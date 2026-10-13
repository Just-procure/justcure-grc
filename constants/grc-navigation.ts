import {
  Activity, AlertTriangle, BadgeCheck, Bell, BookOpenCheck, Bot, Building2,
  CalendarDays, Check, ClipboardCheck, FileCheck2, FileText, Fingerprint, Gauge,
  Globe2, LayoutDashboard, ListTodo, Search, Settings2, Shield, ShieldAlert,
  ShieldCheck, Siren, Users, type LucideIcon,
} from "lucide-react";
import type { GrcCollection } from "@/data/grc-data";
import type { DemoRole } from "@/components/grc/auth/demo-login";
export type NavItem = {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  collection?: GrcCollection;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Executive dashboard", group: "Overview", icon: LayoutDashboard },
  { id: "workspace", label: "My workspace", group: "Overview", icon: ListTodo, collection: "tasks" },
  { id: "governance", label: "Governance overview", group: "Governance & Policy", icon: ShieldCheck, collection: "frameworks" },
  { id: "policies", label: "Policies & documents", group: "Governance & Policy", icon: FileText, collection: "policies" },
  { id: "approvals", label: "Approvals", group: "Governance & Policy", icon: BadgeCheck, collection: "policies" },
  { id: "risks", label: "Risk register", group: "Risk Management", icon: ShieldAlert, collection: "risks" },
  { id: "risk-assessments", label: "Risk assessments", group: "Risk Management", icon: ClipboardCheck, collection: "risks" },
  { id: "risk-heatmap", label: "Risk heatmap", group: "Risk Management", icon: Gauge },
  { id: "treatment-plans", label: "Risk treatment plans", group: "Risk Management", icon: FileCheck2, collection: "tasks" },
  { id: "compliance", label: "Compliance overview", group: "Compliance Management", icon: BookOpenCheck, collection: "obligations" },
  { id: "frameworks", label: "Frameworks", group: "Compliance Management", icon: Globe2, collection: "frameworks" },
  { id: "obligations-calendar", label: "Obligations calendar", group: "Compliance Management", icon: CalendarDays, collection: "obligations" },
  { id: "obligations", label: "Requirements & obligations", group: "Compliance Management", icon: ClipboardCheck, collection: "obligations" },
  { id: "controls", label: "Controls library", group: "Compliance Management", icon: Shield, collection: "controls" },
  { id: "control-testing", label: "Control testing", group: "Compliance Management", icon: Check, collection: "controls" },
  { id: "assessments", label: "Compliance assessments", group: "Compliance Management", icon: FileCheck2, collection: "frameworks" },
  { id: "audits", label: "Audit management", group: "Audit & Assurance", icon: ClipboardCheck, collection: "audits" },
  { id: "findings", label: "Audit findings", group: "Audit & Assurance", icon: AlertTriangle, collection: "findings" },
  { id: "evidence", label: "Evidence library", group: "Audit & Assurance", icon: FileText, collection: "evidence" },
  { id: "corrective-actions", label: "Corrective actions", group: "Audit & Assurance", icon: ListTodo, collection: "tasks" },
  { id: "vendors", label: "Vendors", group: "Third-party Risk", icon: Building2, collection: "vendors" },
  { id: "vendor-assessments", label: "Vendor assessments", group: "Third-party Risk", icon: ClipboardCheck, collection: "vendors" },
  { id: "due-diligence", label: "Due diligence", group: "Third-party Risk", icon: FileCheck2, collection: "vendors" },
  { id: "contract-reviews", label: "Contract reviews", group: "Third-party Risk", icon: FileText, collection: "vendors" },
  { id: "incidents", label: "Incident register", group: "Incident Management", icon: Siren, collection: "incidents" },
  { id: "investigations", label: "Investigations", group: "Incident Management", icon: Search, collection: "incidents" },
  { id: "response-actions", label: "Response actions", group: "Incident Management", icon: ListTodo, collection: "tasks" },
  { id: "tasks", label: "Tasks & remediation", group: "Operations", icon: ListTodo, collection: "tasks" },
  { id: "notifications", label: "Notifications", group: "Operations", icon: Bell, collection: "tasks" },
  { id: "reports", label: "Reports & analytics", group: "Operations", icon: Activity, collection: "risks" },
  { id: "users", label: "Users & roles", group: "Administration", icon: Users, collection: "users" },
  { id: "departments", label: "Departments", group: "Administration", icon: Building2, collection: "departments" },
  { id: "company-settings", label: "Company settings", group: "Administration", icon: Settings2, collection: "departments" },
  { id: "subscription", label: "Subscription & usage", group: "Administration", icon: BadgeCheck },
  { id: "activity", label: "Activity audit log", group: "Administration", icon: Fingerprint, collection: "activity" },
  { id: "dpdp", label: "DPDP & privacy", group: "Privacy & Emerging Risk", icon: ShieldCheck, collection: "obligations" },
  { id: "ai-risk", label: "AI risk", group: "Privacy & Emerging Risk", icon: Bot, collection: "risks" },
  { id: "ip-protection", label: "Counterfeiting & IP protection", group: "Privacy & Emerging Risk", icon: Shield, collection: "incidents" },
  { id: "company-directory", label: "Company directory", group: "Platform administration", icon: Building2 },
];

export function canSeeSection(role: DemoRole, item: NavItem): boolean {
  if (item.id === "company-directory") return role === "Platform Administrator";
  if (role === "Platform Administrator" || role === "Company Administrator" || role === "GRC Manager" || role === "Read-Only Viewer") return true;
  if (role === "Internal Auditor") {
    return ["overview", "workspace", "governance", "obligations-calendar", "approvals", "compliance", "frameworks", "obligations", "controls", "control-testing", "assessments", "audits", "findings", "evidence", "corrective-actions", "tasks", "notifications", "reports", "activity"].includes(item.id);
  }
  if (role === "Risk Manager") {
    return ["Overview", "Risk Management", "Third-party Risk", "Incident Management", "Operations", "Audit & Assurance", "Privacy & Emerging Risk"].includes(item.group)
      && item.id !== "company-directory";
  }
  if (role === "Compliance Officer") {
    return ["Overview", "Governance & Policy", "Compliance Management", "Audit & Assurance", "Third-party Risk", "Operations", "Administration", "Privacy & Emerging Risk"].includes(item.group)
      && item.id !== "company-directory";
  }
  return ["overview", "workspace", "risks", "risk-assessments", "incidents", "investigations", "response-actions", "tasks", "notifications", "reports", "ai-risk", "ip-protection"].includes(item.id);
}


