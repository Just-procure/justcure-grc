"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShieldCheck, X } from "lucide-react";
import { createDemoCompanies } from "@/data/grc-data";
import { NAV_ITEMS, canSeeSection } from "@/constants/grc-navigation";
type DemoRole = "Platform Administrator" | "Company Administrator" | "GRC Manager" | "Risk Manager" | "Compliance Officer" | "Internal Auditor" | "Department Owner" | "Read-Only Viewer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const STORAGE_KEY = "aegis-grc-demo-store";
const ROLE_OPTIONS: DemoRole[] = [
  "Platform Administrator", "Company Administrator", "GRC Manager", "Risk Manager",
  "Compliance Officer", "Internal Auditor", "Department Owner", "Read-Only Viewer",
];

export function GrcRootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<DemoRole>("Company Administrator");
  const [companyId, setCompanyId] = useState("tenant-01");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openModule, setOpenModule] = useState<string[]>([]);

  const syncAuth = (event?: Event) => {
    if (event instanceof CustomEvent && typeof event.detail === "boolean") {
      setLoggedIn(event.detail);
      return;
    }
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Record<string, unknown> | null;
      setLoggedIn(saved?.loggedIn === true);
      if (typeof saved?.companyId === "string") setCompanyId(saved.companyId);
      if (ROLE_OPTIONS.includes(saved?.role as DemoRole)) setRole(saved?.role as DemoRole);
    } catch {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    syncAuth();
    setReady(true);
    window.addEventListener("aegis-auth-change", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("aegis-auth-change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const visibleItems = useMemo(() => NAV_ITEMS.filter((item) => canSeeSection(role, item)), [role]);
  const groups = [...new Set(visibleItems.map((item) => item.group))];
  const section = pathname === "/" ? "overview" : pathname.slice(1);
  const current = NAV_ITEMS.find((item) => item.id === section) ?? NAV_ITEMS[0];
  const companies = useMemo(() => createDemoCompanies(), []);
  const company = companies.find((tenant) => tenant.id === companyId) ?? companies[0];

  const signOut = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, unknown>;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, loggedIn: false }));
    } finally {
      setLoggedIn(false);
      setMobileOpen(false);
      window.dispatchEvent(new CustomEvent("aegis-auth-change", { detail: false }));
      router.push("/login");
    }
  };

  useEffect(() => {
    if (ready && !loggedIn) router.replace("/login");
  }, [ready, loggedIn, router]);

  if (!ready) return <div className="min-h-dvh bg-slate-950" aria-busy="true"><div className="sr-only">Loading workspace</div>{children}</div>;
  if (!loggedIn) return <div className="min-h-dvh bg-slate-950" aria-busy="true" />;

  const sidebar = (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[278px] flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-700 text-white"><ShieldCheck className="h-5 w-5" /></span>
        <div className="min-w-0"><div className="truncate text-sm font-bold tracking-tight text-slate-900">Aegis GRC OS</div><div className="text-[10px] font-medium uppercase tracking-[0.17em] text-slate-400">Protect. Enable. Progress.</div></div>
        <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-md p-1 text-slate-400 lg:hidden" aria-label="Close menu"><X className="h-4 w-4" /></button>
      </div>
      <nav className="min-h-0 flex-1" aria-label="GRC navigation">
        <ScrollArea className="h-full px-2 py-3">
          <Accordion value={openModule} onValueChange={setOpenModule} className="min-w-0 gap-1 overflow-x-hidden">
            {groups.map((group) => {
              const items = visibleItems.filter((item) => item.group === group);
              return <AccordionItem key={group} value={group} className="border-0">
                <AccordionTrigger className="min-w-0 items-center gap-0 rounded-md px-1.5 py-1 text-[7px] font-bold uppercase tracking-[0.05em] text-slate-800 hover:bg-sky-50 hover:text-sky-800 hover:underline aria-expanded:bg-sky-50 aria-expanded:text-sky-800 aria-expanded:underline">
                  <span className="min-w-0 flex-1 truncate">{group}</span>
                  <span className="shrink-0 text-[10px] font-semibold tabular-nums text-slate-800">{items.length}</span>
                </AccordionTrigger>
                <AccordionContent className="mt-1 pb-0"><div className="space-y-0.5">
                  {items.map(({ id, label, icon: Icon }) => <button key={id} data-grc-sidebar-item onClick={() => { router.push(id === "overview" ? "/" : `/${id}`); setMobileOpen(false); }} aria-current={id === section ? "page" : undefined} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] font-medium transition ${id === section ? "bg-sky-50 text-sky-800" : "text-slate-800 hover:bg-sky-50 hover:text-sky-800 hover:underline"}`}><Icon className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="truncate">{label}</span></button>)}
                </div></AccordionContent>
              </AccordionItem>;
            })}
          </Accordion>
        </ScrollArea>
      </nav>
      <div className="shrink-0 border-t border-slate-100 p-3"><div className="rounded-lg bg-slate-50 p-3"><div className="flex items-center justify-between text-[10px]"><span className="font-semibold uppercase tracking-wider text-slate-500">Demo environment</span><span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">Active</span></div><p className="mt-1 text-[10px] leading-4 text-slate-500">Fictional data Ã‚Â· no legal certification</p></div></div>
    </aside>
  );

  return <div className="flex h-dvh min-h-0 overflow-hidden bg-[#f6f8fb] text-slate-900">
    {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}
    {sidebar}
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="z-20 flex min-h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 sm:px-5">
        <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"><Menu className="h-4 w-4" /></button>
        <div className="min-w-0 flex-1"><div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{current.group} / {current.label}</div><div className="truncate text-sm font-semibold text-slate-900">{company.name}</div></div>
        <ThemeToggle />
        <div className="hidden text-right md:block"><div className="text-xs font-semibold text-slate-700">{role === "Platform Administrator" ? "Aegis Platform Admin" : role === "Read-Only Viewer" ? "Demo Viewer" : "Workspace Admin"}</div><div className="text-[10px] text-slate-400">{role}</div></div>
        <button onClick={signOut} className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Sign out</button>
      </header>
      <ScrollArea className="min-h-0 flex-1"><div className="min-h-full p-3 sm:p-5 lg:p-6">{children}</div></ScrollArea>
      <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-2 text-[10px] text-slate-500">Aegis GRC OS Ã‚Â· Demonstration workspace Ã‚Â· Sample data only</footer>
    </main>
  </div>;
}







