import {
  AlertTriangle,
  Bot,
  ArrowRight,
  Briefcase,
  Building2,
  ClipboardCheck,
  Database,
  FileText,
  FolderOpen,
  Globe2,
  LayoutGrid,
  ListChecks,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { Company } from "@/data/mock-data";
import { cn, getDaysUntilDate } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const navigationGroups = [
  { id: "workspace", label: "Workspace", items: [
    { id: "overview", label: "Overview", icon: LayoutGrid },
  ] },
  { id: "data-governance", label: "Data governance", items: [
    { id: "ropa", label: "Discovery & RoPA", icon: Database },
    { id: "inventory", label: "Data Inventory", icon: Database },
    { id: "entities", label: "Entities & Transfers", icon: Network },
    { id: "consent", label: "Consent Management", icon: ShieldCheck },
  ] },
  { id: "compliance", label: "Compliance", items: [
    { id: "dpia", label: "DPIA Assessments", icon: ClipboardCheck },
    { id: "assessment", label: "DPDP Assessment", icon: ClipboardCheck },
    { id: "documents", label: "Policies & Documents", icon: FileText },
    { id: "tasks", label: "Compliance Tasks", icon: ListChecks },
  ] },
  { id: "risk-operations", label: "Risk & operations", items: [
    { id: "requests", label: "Data Principal Requests", icon: Users },
    { id: "incidents", label: "Incident Management", icon: AlertTriangle },
    { id: "vendors", label: "Vendor Risk", icon: Building2 },
    { id: "regulatory", label: "Regulatory Monitor", icon: Globe2 },
  ] },
  { id: "oversight", label: "Oversight", items: [
    { id: "ai-governance", label: "AI Governance", icon: Bot },
    { id: "dpo-copilot", label: "DPO Review Queue", icon: Sparkles },
    { id: "reports", label: "Reports & Audit Trail", icon: FolderOpen },
  ] },
  { id: "administration", label: "Administration", items: [
    { id: "settings", label: "Settings", icon: Briefcase },
  ] },
];

type DashboardSidebarProps = {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  selectedCompany: Company;
};

export function DashboardSidebar({
  activeSection,
  onSectionChange,
  selectedCompany,
}: DashboardSidebarProps) {
  const plan = selectedCompany.subscription.plan;
  const daysUntilRenewal = getDaysUntilDate(selectedCompany.subscription.renewalDate);
  const renewalCountdown = daysUntilRenewal === null
    ? "Renewal date not set"
    : daysUntilRenewal < 0
      ? `Renewal date passed ${Math.abs(daysUntilRenewal)} ${Math.abs(daysUntilRenewal) === 1 ? "day" : "days"} ago`
      : daysUntilRenewal === 0
        ? "Renews today"
        : `${daysUntilRenewal} ${daysUntilRenewal === 1 ? "day" : "days"} until renewal`;

  return (
    <div className="flex h-full min-h-full flex-col bg-white px-2 py-3 text-slate-700">
      <nav aria-label="Workspace navigation" className="min-h-0 flex-1">
        <Accordion multiple className="space-y-0.5">
          {navigationGroups.map(({ id, label, items }) => (
            <AccordionItem key={id} value={id} className="border-0">
              <AccordionTrigger className="gap-1 rounded-md px-2 py-1 text-[6px] font-semibold uppercase tracking-[0.01em] text-slate-500 hover:bg-slate-50  hover:underline">
                <span className="truncate">{label}</span>
                <span className="ml-auto mr-1 text-[9px] font-medium tabular-nums text-slate-400">{items.length}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-1">
                <div className="space-y-0.5">
                  {items.map(({ id: sectionId, label: sectionLabel, icon: Icon }) => {
                    const isActive = activeSection === sectionId;
                    return (
                      <button
                        key={sectionId}
                        type="button"
                        onClick={() => onSectionChange(sectionId)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors",
                          isActive
                            ? "bg-sky-50 text-sky-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{sectionLabel}</span>
                        {isActive && <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
      <div className="mt-2 shrink-0 border-t border-slate-100 pt-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Subscription
            </span>
            <span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-semibold text-sky-700">
              {plan}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Current workspace plan</div>
          <div className={cn("mt-1 text-xs font-medium", daysUntilRenewal !== null && daysUntilRenewal <= 7 ? "text-amber-700" : "text-slate-600")}>
            {renewalCountdown}
          </div>
          <button
            type="button"
            onClick={() => onSectionChange("subscription")}
            className="mt-2 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            Manage subscription
          </button>
        </div>
        <div className="px-2 pt-3 text-[11px] text-slate-400">
          Aegis Privacy OS · Demo workspace
        </div>
      </div>
    </div>
  );
}
