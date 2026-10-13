"use client";

import { useSyncExternalStore } from "react";
import { createDemoCompanies, GRC_COLLECTION_LABELS, type GrcCollection, type GrcRecord, type GrcTenant } from "@/data/grc-data";

export const DEMO_STORAGE_KEY = "aegis-grc-demo-store";
type DemoStore = { companies: GrcTenant[]; companyId: string; loggedIn?: boolean; role?: string; selectedLoginCompany?: string };
const seed = createDemoCompanies();
const serverSnapshot: DemoStore = { companies: seed, companyId: seed[0].id };
let snapshot: DemoStore = serverSnapshot;
let hydrated = false;
const subscribers = new Set<() => void>();

function readSnapshot(): DemoStore {
  if (typeof window === "undefined") return serverSnapshot;
  if (hydrated) return snapshot;
  hydrated = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(DEMO_STORAGE_KEY) ?? "null") as Partial<DemoStore> | null;
    const savedCompanies = Array.isArray(saved?.companies) ? saved.companies : [];
    const companies = seed.map((fallback) => {
      const existing = savedCompanies.find((company) => company?.id === fallback.id);
      return existing?.records ? existing : fallback;
    });
    const companyId = companies.some((company) => company.id === saved?.companyId) ? saved!.companyId! : companies[0].id;
    snapshot = { ...saved, companies, companyId };
  } catch {
    snapshot = serverSnapshot;
  }
  return snapshot;
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
    window.addEventListener("aegis-grc-data-change", callback);
  }
  return () => {
    subscribers.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
      window.removeEventListener("aegis-grc-data-change", callback);
    }
  };
}

export function useDemoStore() {
  return useSyncExternalStore(subscribe, readSnapshot, () => serverSnapshot);
}

function refreshReadiness(tenant: GrcTenant) {
  tenant.records.frameworks = tenant.records.frameworks.map((framework) => {
    const requirements = tenant.records.obligations.filter((item) => item.frameworkRef === framework.id && item.status !== "Not Applicable");
    const reqScore = requirements.length ? requirements.reduce((sum, item) => sum + (item.status === "Compliant" ? 1 : item.status === "Partially Compliant" ? 0.5 : 0), 0) / requirements.length : 0;
    const controls = tenant.records.controls.filter((item) => item.frameworkRefs?.includes(framework.id));
    const impl = controls.length ? controls.reduce((sum, item) => sum + (item.status === "Implemented" ? 1 : item.status === "In Progress" ? 0.5 : 0), 0) / controls.length : 0;
    const assurance = controls.length ? controls.reduce((sum, item) => {
      const verified = tenant.records.evidence.some((evidence) => evidence.controlRefs?.includes(item.id) && evidence.status === "Verified");
      const passed = item.testResult === "Pass";
      return sum + (verified && passed ? 1 : verified || passed ? 0.5 : 0);
    }, 0) / controls.length : 0;
    const readinessScore = Math.round(reqScore * 50 + impl * 30 + assurance * 20);
    return { ...framework, riskScore: readinessScore, readinessScore, status: readinessScore >= 70 ? "Ready for Review" : readinessScore >= 45 ? "In Progress" : "Not Started" };
  });
}

function publish(next: DemoStore) {
  snapshot = next;
  hydrated = true;
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("aegis-grc-data-change"));

}

function updateTenant(companyId: string, update: (tenant: GrcTenant) => GrcTenant) {
  const current = readSnapshot();
  const companies = current.companies.map((tenant) => tenant.id === companyId ? update(tenant) : tenant);
  publish({ ...current, companies });
}

export function upsertDemoRecord(companyId: string, collection: GrcCollection, record: GrcRecord) {
  updateTenant(companyId, (tenant) => {
    const rows = tenant.records[collection];
    const exists = rows.some((item) => item.id === record.id);
    const nextRows = exists ? rows.map((item) => item.id === record.id ? record : item) : [record, ...rows];
    const next = { ...tenant, records: { ...tenant.records, [collection]: nextRows } };
    if (collection === "users") next.users = nextRows.map((item) => item.title);
    if (collection === "departments") next.departments = nextRows.map((item) => item.title);
    if (collection !== "activity") {
      const verb = exists ? "updated" : "created";
      const log: GrcRecord = { id: `LOG-${Date.now()}-${tenant.records.activity.length + 1}`, companyId, title: `${GRC_COLLECTION_LABELS[collection]} ${verb}: ${record.title}`, description: `Demo workspace record ${record.id} was ${verb}.`, owner: record.owner || "Workspace user", status: "Updated", priority: "Info", category: GRC_COLLECTION_LABELS[collection], department: record.department, source: record.id, createdAt: new Date().toISOString().slice(0, 10), dueDate: new Date().toISOString().slice(0, 10) };
      next.records.activity = [log, ...tenant.records.activity];
    }
    if (["controls", "obligations", "evidence"].includes(collection)) refreshReadiness(next);
    return next;
  });
}

export function deleteDemoRecord(companyId: string, collection: GrcCollection, recordId: string) {
  updateTenant(companyId, (tenant) => {
    const records = { ...tenant.records };
    records[collection] = records[collection].filter((item) => item.id !== recordId);
    const relationFields = ["frameworkRefs", "requirementRefs", "controlRefs", "evidenceRefs", "riskRefs", "findingRefs", "vendorRefs"] as const;
    for (const key of Object.keys(records) as GrcCollection[]) {
      records[key] = records[key].map((item) => {
        const updated = { ...item };
        for (const field of relationFields) if (updated[field]) updated[field] = updated[field]!.filter((id) => id !== recordId);
        if (updated.source === recordId) updated.source = undefined;
        if (updated.auditRef === recordId) updated.auditRef = undefined;
        if (updated.frameworkRef === recordId) updated.frameworkRef = undefined;
        return updated;
      });
    }
    const next = { ...tenant, records };
    if (collection === "users") next.users = records.users.map((item) => item.title);
    if (collection === "departments") next.departments = records.departments.map((item) => item.title);
    if (collection !== "activity") next.records.activity = [{ id: `LOG-${Date.now()}`, companyId, title: `${GRC_COLLECTION_LABELS[collection]} deleted: ${recordId}`, description: "A fictional demo record and its incoming links were removed.", owner: "Workspace user", status: "Deleted", priority: "Info", category: GRC_COLLECTION_LABELS[collection], department: "Risk & Compliance", source: recordId, createdAt: new Date().toISOString().slice(0, 10), dueDate: new Date().toISOString().slice(0, 10) }, ...records.activity];
    if (["controls", "obligations", "evidence"].includes(collection)) refreshReadiness(next);
    return next;
  });
}

export function nextDemoRecordId(collection: GrcCollection, records: GrcRecord[]) {
  const prefixes: Record<GrcCollection, string> = { risks: "RISK", frameworks: "FRM", obligations: "REQ", controls: "CTRL", policies: "POL", audits: "AUD", findings: "FND", vendors: "VEN", incidents: "INC", tasks: "ACT", evidence: "EVD", users: "USR", departments: "DEP", activity: "LOG" };
  const prefix = prefixes[collection];
  const max = records.reduce((value, item) => Math.max(value, Number(item.id.match(new RegExp(`^${prefix}-(\\d+)$`))?.[1] ?? 0)), 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

