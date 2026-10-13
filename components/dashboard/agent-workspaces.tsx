"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Check, FileSearch, ShieldAlert, Sparkles } from "lucide-react";
import type {
  AgentReview,
  AiSystemRecord,
  Company,
  DpiaRecord,
  GroupEntity,
  ProcessingActivity,
  RegulatoryUpdate,
} from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { parseCsv } from "@/lib/csv";

type AgentWorkspacesProps = {
  activeSection: string;
  company: Company;
  onAddActivity: (activity: Omit<ProcessingActivity, "id" | "status">) => void;
  onImportActivities: (activities: Omit<ProcessingActivity, "id" | "status">[]) => void;
  onExportActivities: () => void;
  onAddDpia: (dpia: Omit<DpiaRecord, "id" | "status">) => void;
  onAddAiSystem: (system: Omit<AiSystemRecord, "id" | "status">) => void;
  onAddGroupEntity: (entity: Omit<GroupEntity, "id">) => void;
  onReviewDecision: (reviewId: string, decision: AgentReview["status"]) => void;
  onRegulatoryStatusChange: (updateId: string, status: RegulatoryUpdate["status"]) => void;
  onAiSystemStatusChange: (systemId: string, status: AiSystemRecord["status"]) => void;
  onDeleteRecord: (
    collection:
      | "processingActivities"
      | "dpias"
      | "agentReviews"
      | "regulatoryUpdates"
      | "aiSystems"
      | "groupEntities",
    recordId: string,
  ) => void;
};

function PageHeading({ eyebrow, title, children }: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{eyebrow}</div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ children }: { children: ReactNode }) {
  const classes: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-700",
    "In Review": "bg-amber-100 text-amber-800",
    "Pending Review": "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    "Changes Requested": "bg-orange-100 text-orange-800",
    High: "bg-red-100 text-red-800",
    Medium: "bg-amber-100 text-amber-800",
    Low: "bg-emerald-100 text-emerald-800",
    New: "bg-sky-100 text-sky-800",
    Assessing: "bg-amber-100 text-amber-800",
    Actioned: "bg-emerald-100 text-emerald-800",
    "Not Relevant": "bg-slate-100 text-slate-700",
    Registered: "bg-sky-100 text-sky-800",
    Assistive: "bg-violet-100 text-violet-800",
    Significant: "bg-orange-100 text-orange-800",
  };

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", typeof children === "string" ? classes[children] : "bg-slate-100 text-slate-700")}>
      {children}
    </span>
  );
}

function ReviewNotice() {
  return (
    <div className="flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>AI-assisted demo output. A qualified privacy reviewer must verify facts, sources and legal applicability before approval or external use.</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

export function AgentWorkspaces({
  activeSection,
  company,
  onAddActivity,
  onImportActivities,
  onExportActivities,
  onAddDpia,
  onAddAiSystem,
  onAddGroupEntity,
  onReviewDecision,
  onRegulatoryStatusChange,
  onAiSystemStatusChange,
  onDeleteRecord,
}: AgentWorkspacesProps) {
  const [activity, setActivity] = useState({
    name: "",
    department: "",
    purpose: "",
    dataCategories: "",
    dataSubjects: "",
    recipients: "",
    retention: "",
    source: "Department interview",
    crossBorder: false,
  });
  const [dpia, setDpia] = useState({
    title: "",
    trigger: "Large-scale processing",
    likelihood: "Medium" as DpiaRecord["likelihood"],
    impact: "Medium" as DpiaRecord["impact"],
    mitigation: "",
    owner: "",
  });
  const [aiSystem, setAiSystem] = useState({
    name: "",
    owner: "",
    purpose: "",
    dataUsed: "",
    decisionImpact: "Assistive" as AiSystemRecord["decisionImpact"],
    risk: "Medium" as AiSystemRecord["risk"],
  });
  const [entity, setEntity] = useState({ name: "", country: "", role: "" });
  const [importMessage, setImportMessage] = useState("");

  const importActivities = async (file?: File) => {
    if (!file) return;
    try {
      const rows = parseCsv(await file.text());
      if (rows.length < 2) {
        setImportMessage("The CSV must include a header row and at least one activity.");
        return;
      }

      const headers = rows[0].map((header) => header.trim().toLowerCase().replace(/[_-]+/g, " "));
      const column = (...names: string[]) => headers.findIndex((header) => names.includes(header));
      const nameIndex = column("activity", "activity name", "name", "processing activity");
      const departmentIndex = column("department", "business function", "owner");
      const purposeIndex = column("purpose", "processing purpose");
      const categoriesIndex = column("data categories", "personal data", "personal data categories", "data elements");

      if ([nameIndex, departmentIndex, purposeIndex, categoriesIndex].some((index) => index === -1)) {
        setImportMessage("Required CSV columns: activity, department, purpose and data categories.");
        return;
      }

      const value = (row: string[], index: number) => index >= 0 ? (row[index] ?? "").trim() : "";
      const imported = rows.slice(1).map((row) => ({
        name: value(row, nameIndex),
        department: value(row, departmentIndex),
        purpose: value(row, purposeIndex),
        dataCategories: value(row, categoriesIndex),
        dataSubjects: value(row, column("data subjects", "individuals")),
        recipients: value(row, column("recipients", "processors", "recipients / processors")),
        retention: value(row, column("retention", "retention period")),
        source: file.name,
        crossBorder: ["yes", "true", "1"].includes(value(row, column("cross border", "cross-border", "international transfer")).toLowerCase()),
      })).filter((item) => item.name && item.department && item.purpose && item.dataCategories);

      if (!imported.length) {
        setImportMessage("No valid activity rows found. Check required values and try again.");
        return;
      }
      onImportActivities(imported);
      setImportMessage(`Imported ${imported.length} activities to the human review queue.`);
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : "Unable to read this CSV file.");
    }
  };

  const submitActivity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddActivity(activity);
    setActivity({
      name: "",
      department: "",
      purpose: "",
      dataCategories: "",
      dataSubjects: "",
      recipients: "",
      retention: "",
      source: "Department interview",
      crossBorder: false,
    });
  };

  const submitDpia = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddDpia(dpia);
    setDpia({
      title: "",
      trigger: "Large-scale processing",
      likelihood: "Medium",
      impact: "Medium",
      mitigation: "",
      owner: "",
    });
  };

  const submitAiSystem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddAiSystem(aiSystem);
    setAiSystem({
      name: "",
      owner: "",
      purpose: "",
      dataUsed: "",
      decisionImpact: "Assistive",
      risk: "Medium",
    });
  };

  const submitEntity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddGroupEntity(entity);
    setEntity({ name: "", country: "", role: "" });
  };

  if (activeSection === "ropa") {
    return (
      <div className="space-y-5">
        <PageHeading eyebrow="Discovery agent · DPDP records" title="Processing activities">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">{company.processingActivities?.length ?? 0} records</span>
            <button type="button" onClick={onExportActivities} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Export RoPA CSV</button>
          </div>
        </PageHeading>
        <ReviewNotice />
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="text-sm font-semibold text-slate-800">Import an existing register</div><div className="mt-1 text-xs text-slate-500">CSV columns: activity, department, purpose, data categories. Imports are drafts for human review.</div></div>
          <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">
            Import CSV
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => void importActivities(event.target.files?.[0])} />
          </label>
          {importMessage && <p role="status" className="text-sm text-slate-600 sm:basis-full">{importMessage}</p>}
        </div>
        <form onSubmit={submitActivity} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <h3 className="mb-4 font-semibold text-slate-900">Capture a processing activity</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Activity name" value={activity.name} onChange={(value) => setActivity({ ...activity, name: value })} placeholder="e.g. Customer onboarding" required />
            <Field label="Department" value={activity.department} onChange={(value) => setActivity({ ...activity, department: value })} placeholder="e.g. Sales" required />
            <Field label="Purpose" value={activity.purpose} onChange={(value) => setActivity({ ...activity, purpose: value })} placeholder="Why is the data processed?" required />
            <Field label="Personal data categories" value={activity.dataCategories} onChange={(value) => setActivity({ ...activity, dataCategories: value })} placeholder="Contact, identity, account..." required />
            <Field label="Data principals" value={activity.dataSubjects} onChange={(value) => setActivity({ ...activity, dataSubjects: value })} placeholder="Customers, employees..." />
            <Field label="Recipients / processors" value={activity.recipients} onChange={(value) => setActivity({ ...activity, recipients: value })} placeholder="Teams and service providers" />
            <Field label="Retention period" value={activity.retention} onChange={(value) => setActivity({ ...activity, retention: value })} placeholder="Document the retention rule" />
            <Field label="Evidence source" value={activity.source} onChange={(value) => setActivity({ ...activity, source: value })} placeholder="Interview, system, document..." />
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={activity.crossBorder} onChange={(event) => setActivity({ ...activity, crossBorder: event.target.checked })} className="h-4 w-4 accent-sky-600" />
            Data may be transferred outside India
          </label>
          <button className="mt-4 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">Add for human review</button>
        </form>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-[950px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Activity / purpose", "Department", "Personal data", "Recipients", "Retention", "Transfer", "Status"].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead>
            <tbody>{(company.processingActivities ?? []).map((item) => (
              <tr key={item.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3"><div className="font-medium text-slate-900">{item.name}</div><div className="mt-1 max-w-xs text-xs text-slate-500">{item.purpose}</div><div className="mt-1 text-[11px] text-slate-400">Source: {item.source}</div></td>
                <td className="px-4 py-3 text-slate-600">{item.department}</td><td className="px-4 py-3 text-slate-600">{item.dataCategories}</td><td className="px-4 py-3 text-slate-600">{item.recipients}</td><td className="px-4 py-3 text-slate-600">{item.retention}</td><td className="px-4 py-3">{item.crossBorder ? "Outside India" : "India"}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><StatusBadge>{item.status}</StatusBadge><button type="button" onClick={() => onDeleteRecord("processingActivities", item.id)} aria-label={`Delete ${item.name}`} className="cursor-pointer rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeSection === "dpia") {
    return (
      <div className="space-y-5">
        <PageHeading eyebrow="Impact assessment agent" title="DPIA register" />
        <ReviewNotice />
        <form onSubmit={submitDpia} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <h3 className="mb-4 font-semibold text-slate-900">Start an impact assessment</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Assessment title" value={dpia.title} onChange={(value) => setDpia({ ...dpia, title: value })} placeholder="Processing or project name" required />
            <label className="text-sm font-medium text-slate-700">Risk trigger<select value={dpia.trigger} onChange={(event) => setDpia({ ...dpia, trigger: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-normal"><option>Large-scale processing</option><option>Children&apos;s personal data</option><option>Significant decisions about individuals</option><option>New or high-risk technology</option><option>Large-scale monitoring</option><option>Other elevated privacy risk</option></select></label>
            <label className="text-sm font-medium text-slate-700">Likelihood<select value={dpia.likelihood} onChange={(event) => setDpia({ ...dpia, likelihood: event.target.value as DpiaRecord["likelihood"] })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-normal">{["Low", "Medium", "High"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Impact<select value={dpia.impact} onChange={(event) => setDpia({ ...dpia, impact: event.target.value as DpiaRecord["impact"] })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-normal">{["Low", "Medium", "High"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <Field label="Assessment owner" value={dpia.owner} onChange={(value) => setDpia({ ...dpia, owner: value })} placeholder="Name or team" />
            <Field label="Proposed mitigation" value={dpia.mitigation} onChange={(value) => setDpia({ ...dpia, mitigation: value })} placeholder="Control or mitigation to assess" required />
          </div>
          <button className="mt-4 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">Create draft assessment</button>
        </form>
        <div className="grid gap-3 lg:grid-cols-2">
          {(company.dpias ?? []).map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2"><div><div className="font-semibold text-slate-900">{item.title}</div><div className="mt-1 text-xs text-slate-500">Trigger: {item.trigger} · Owner: {item.owner || "Unassigned"}</div></div><div className="flex items-center gap-2"><StatusBadge>{item.status}</StatusBadge><button type="button" onClick={() => onDeleteRecord("dpias", item.id)} aria-label={`Delete ${item.title}`} className="cursor-pointer rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button></div></div>
              <div className="mt-4 flex gap-2 text-xs"><StatusBadge>{item.likelihood} likelihood</StatusBadge><StatusBadge>{item.impact} impact</StatusBadge></div>
              <p className="mt-3 text-sm text-slate-600">Mitigation: {item.mitigation}</p>
            </article>
          ))}
          {!company.dpias?.length && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 lg:col-span-2">No DPIAs started. Create an assessment when processing may present elevated risk.</p>}
        </div>
      </div>
    );
  }

  if (activeSection === "regulatory") {
    return (
      <div className="space-y-5">
        <PageHeading eyebrow="Regulatory monitoring · sample feed" title="Regulatory change tracker">
          <span className="text-sm text-slate-500">Sample updates · not a live regulatory feed</span>
        </PageHeading>
        <ReviewNotice />
        <div className="space-y-3">
          {(company.regulatoryUpdates ?? []).map((update) => (
            <article key={update.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900">{update.title}</h3><StatusBadge>{update.impact}</StatusBadge></div><div className="mt-1 text-xs text-slate-500">{update.authority} · Published {update.publishedAt}</div><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{update.summary}</p><div className="mt-3 flex flex-wrap gap-1.5">{update.sectors.map((sector) => <span key={sector} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{sector}</span>)}</div></div>
                <label className="shrink-0 text-sm font-medium text-slate-600">Review status<select value={update.status} onChange={(event) => onRegulatoryStatusChange(update.id, event.target.value as RegulatoryUpdate["status"])} className="mt-1 block cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{(["New", "Assessing", "Actioned", "Not Relevant"] as const).map((status) => <option key={status}>{status}</option>)}</select></label>
                <button type="button" onClick={() => onDeleteRecord("regulatoryUpdates", update.id)} aria-label={`Delete ${update.title}`} className="cursor-pointer self-start rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete update</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (activeSection === "ai-governance") {
    return (
      <div className="space-y-5">
        <PageHeading eyebrow="AI governance agent" title="AI system register" />
        <ReviewNotice />
        <form onSubmit={submitAiSystem} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <h3 className="mb-4 font-semibold text-slate-900">Register an AI use case</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="System / use case" value={aiSystem.name} onChange={(value) => setAiSystem({ ...aiSystem, name: value })} placeholder="Name the AI system" required />
            <Field label="Business owner" value={aiSystem.owner} onChange={(value) => setAiSystem({ ...aiSystem, owner: value })} placeholder="Responsible owner" required />
            <Field label="Purpose" value={aiSystem.purpose} onChange={(value) => setAiSystem({ ...aiSystem, purpose: value })} placeholder="Intended use" required />
            <Field label="Personal data used" value={aiSystem.dataUsed} onChange={(value) => setAiSystem({ ...aiSystem, dataUsed: value })} placeholder="Data inputs or none" />
            <label className="text-sm font-medium text-slate-700">Decision impact<select value={aiSystem.decisionImpact} onChange={(event) => setAiSystem({ ...aiSystem, decisionImpact: event.target.value as AiSystemRecord["decisionImpact"] })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-normal">{(["None", "Assistive", "Significant"] as const).map((value) => <option key={value}>{value}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Initial risk<select value={aiSystem.risk} onChange={(event) => setAiSystem({ ...aiSystem, risk: event.target.value as AiSystemRecord["risk"] })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-normal">{(["Low", "Medium", "High"] as const).map((value) => <option key={value}>{value}</option>)}</select></label>
          </div>
          <button className="mt-4 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">Add for governance review</button>
        </form>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-[800px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["AI use case", "Owner", "Purpose", "Data used", "Decision impact", "Risk", "Review status"].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead>
            <tbody>{(company.aiSystems ?? []).map((system) => <tr key={system.id} className="border-t border-slate-100"><td className="px-4 py-3 font-medium text-slate-900">{system.name}</td><td className="px-4 py-3 text-slate-600">{system.owner}</td><td className="px-4 py-3 text-slate-600">{system.purpose}</td><td className="px-4 py-3 text-slate-600">{system.dataUsed || "Not specified"}</td><td className="px-4 py-3"><StatusBadge>{system.decisionImpact}</StatusBadge></td><td className="px-4 py-3"><StatusBadge>{system.risk}</StatusBadge></td><td className="px-4 py-3"><div className="flex items-center gap-2"><select aria-label={`Review status for ${system.name}`} value={system.status} onChange={(event) => onAiSystemStatusChange(system.id, event.target.value as AiSystemRecord["status"])} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">{(["Registered", "In Review", "Approved"] as const).map((status) => <option key={status}>{status}</option>)}</select><button type="button" onClick={() => onDeleteRecord("aiSystems", system.id)} aria-label={`Delete ${system.name}`} className="cursor-pointer rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button></div></td></tr>)}</tbody>
          </table>
          {!company.aiSystems?.length && <p className="p-6 text-sm text-slate-500">No AI systems registered yet.</p>}
        </div>
      </div>
    );
  }

  if (activeSection === "dpo-copilot") {
    const pending = (company.agentReviews ?? []).filter((review) => review.status === "Pending Review");
    return (
      <div className="space-y-5">
        <PageHeading eyebrow="Practitioner console · human sign-off" title="DPO review queue">
          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">{pending.length} awaiting review</span>
        </PageHeading>
        <ReviewNotice />
        <div className="space-y-3">
          {(company.agentReviews ?? []).map((review) => (
            <article key={review.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-600" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-wide text-violet-700">{review.agent}</span></div><h3 className="mt-2 font-semibold text-slate-900">{review.title}</h3><p className="mt-2 text-sm text-slate-600">{review.summary}</p></div><StatusBadge>{review.status}</StatusBadge></div>
              <details className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600"><summary className="cursor-pointer font-medium text-slate-700">View reasoning and sources</summary><p className="mt-3 leading-6">{review.rationale}</p><ul className="mt-2 list-inside list-disc text-xs">{review.sources.map((source) => <li key={source}>{source}</li>)}</ul><p className="mt-3 text-xs text-slate-400">Created {review.createdAt}. Verify each source and factual claim before sign-off.</p></details>
              <div className="mt-4 flex flex-wrap gap-2">{review.status === "Pending Review" && <><button type="button" onClick={() => onReviewDecision(review.id, "Approved")} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"><Check className="h-4 w-4" aria-hidden="true" />Approve</button><button type="button" onClick={() => onReviewDecision(review.id, "Changes Requested")} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Request changes</button></>}<button type="button" onClick={() => onDeleteRecord("agentReviews", review.id)} className="cursor-pointer rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">Archive review</button></div>
            </article>
          ))}
          {!company.agentReviews?.length && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"><FileSearch className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" /><p className="mt-3 font-medium text-slate-800">No agent outputs awaiting review</p><p className="mt-1 text-sm text-slate-500">Drafts from discovery, DPIA and policy workflows will appear here for human sign-off.</p></div>}
        </div>
      </div>
    );
  }

  if (activeSection === "entities") {
    return (
      <div className="space-y-5">
        <PageHeading eyebrow="Group governance" title="Entity & jurisdiction overview" />
        <ReviewNotice />
        <form onSubmit={submitEntity} className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-slate-900">Add a group entity</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Entity name" value={entity.name} onChange={(value) => setEntity({ ...entity, name: value })} placeholder="Legal entity name" required />
            <Field label="Country / jurisdiction" value={entity.country} onChange={(value) => setEntity({ ...entity, country: value })} placeholder="Country" required />
            <Field label="Role in group" value={entity.role} onChange={(value) => setEntity({ ...entity, role: value })} placeholder="Controller, subsidiary..." required />
            <button className="self-end rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">Add entity</button>
          </div>
        </form>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(company.groupEntities ?? []).map((entity) => (
            <article key={entity.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><h3 className="truncate font-semibold text-slate-900">{entity.name}</h3><p className="mt-1 text-sm text-slate-500">{entity.role}</p></div>
                <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{entity.country}</span>
              </div>
              {entity.id.endsWith("-entity-primary") && <div className="mt-3 text-xs text-slate-400">Current workspace · {company.industry} · {company.companyId}</div>}
              {!entity.id.endsWith("-entity-primary") && <button type="button" onClick={() => onDeleteRecord("groupEntities", entity.id)} className="mt-3 cursor-pointer rounded-lg px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Remove entity</button>}
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-900">Cross-border processing map</h3>
          <p className="mt-1 text-sm text-slate-500">Transfers identified from the processing activity register. Confirm destination-country requirements with qualified counsel.</p>
          <div className="mt-4 space-y-2">{(company.processingActivities ?? []).filter((item) => item.crossBorder).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 p-3 text-sm"><span className="font-medium text-slate-800">{item.name}</span><span className="text-slate-500">{item.recipients || "Recipient not yet recorded"}</span></div>)}{!(company.processingActivities ?? []).some((item) => item.crossBorder) && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No cross-border transfers are currently recorded. Record transfer details in the discovery register.</p>}</div>
        </div>
      </div>
    );
  }

  return null;
}
