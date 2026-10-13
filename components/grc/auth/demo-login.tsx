"use client";

import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { GrcTenant } from "@/data/grc-data";
import { GrcNetworkDiagram } from "@/components/login/grc-network-diagram";
import { GrcLoginLayout } from "@/components/grc/auth/login-layout";

export type DemoRole =
  | "Platform Administrator"
  | "Company Administrator"
  | "GRC Manager"
  | "Risk Manager"
  | "Compliance Officer"
  | "Internal Auditor"
  | "Department Owner"
  | "Read-Only Viewer";

export const ROLE_OPTIONS: DemoRole[] = [
  "Platform Administrator",
  "Company Administrator",
  "GRC Manager",
  "Risk Manager",
  "Compliance Officer",
  "Internal Auditor",
  "Department Owner",
  "Read-Only Viewer",
];

export function DemoLogin({
  companies,
  selectedCompanyId,
  role,
  onCompanyChange,
  onRoleChange,
  onSignIn,
}: {
  companies: GrcTenant[];
  selectedCompanyId: string;
  role: DemoRole;
  onCompanyChange: (id: string) => void;
  onRoleChange: (role: DemoRole) => void;
  onSignIn: () => void;
}) {
  return (
    <GrcLoginLayout>
      <div className="mx-auto grid min-h-dvh max-w-7xl items-center gap-8 px-4 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-8">
        <section className="min-w-0 py-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm"><ShieldCheck className="h-4 w-4" /> AEGIS COMPLIANCE <span className="text-slate-300">Â·</span> DEMO ENVIRONMENT</div>
          <h1 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Governance that keeps your business moving.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">A connected view of risk, controls, actions, and company workspaces.</p>
          <div className="relative mt-4 h-[300px] overflow-hidden bg-transparent sm:h-[380px] lg:h-[440px]">
            <GrcNetworkDiagram />
            <p className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium text-slate-500 backdrop-blur">Illustrative governance network Â· fictional demo data</p>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-6 text-slate-100 shadow-2xl shadow-black/30 sm:p-8">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white"><ShieldCheck className="h-5 w-5" /></span><div><div className="text-lg font-semibold">Sign in to Aegis GRC OS</div><div className="text-xs text-slate-400">Use demo access to explore the product</div></div></div>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-200">Demo email<input type="email" value="admin@demo.aegis" readOnly className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-200" /></label>
            <label className="block text-sm font-medium text-slate-200">Demo password<input type="password" value="demo123" readOnly className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-200" /></label>
            <label className="block text-sm font-medium text-slate-200">Demo role<select value={role} onChange={(event) => onRoleChange(event.target.value as DemoRole)} className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100">{ROLE_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="block text-sm font-medium text-slate-200">Company workspace<select value={selectedCompanyId} onChange={(event) => onCompanyChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100">{companies.map((tenant) => <option key={tenant.id} value={tenant.id}>{tenant.name}</option>)}</select></label>
            <button onClick={onSignIn} className="w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500">Enter demo workspace <ArrowUpRight className="ml-1 inline h-4 w-4" /></button>
            <div className="rounded-lg border border-slate-700/70 bg-slate-800/70 p-3 text-xs leading-5 text-slate-400"><span className="font-semibold text-slate-200">Simulated access.</span> No real password is checked or stored. All names and records belong to the fictional Acme Technologies demo workspace.</div>
          </div>
        </section>
      </div>
    </GrcLoginLayout>
  );
}

