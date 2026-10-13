"use client";

import { useState, type ReactNode } from "react";
import type { Company } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type DashboardShellProps = {
  activeSection: string;
  children: ReactNode;
  onLogout: () => void;
  onSearchChange: (value: string) => void;
  onSectionChange: (sectionId: string) => void;
  searchTerm: string;
  selectedCompany: Company;
};

export function DashboardShell({
  activeSection,
  children,
  onLogout,
  onSearchChange,
  onSectionChange,
  searchTerm,
  selectedCompany,
}: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const changeSection = (sectionId: string) => {
    onSectionChange(sectionId);
    setMobileNavOpen(false);
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-slate-50 text-slate-900">
      <DashboardHeader
        onLogout={onLogout}
        onSearchChange={onSearchChange}
        onToggleMobileNavigation={() => setMobileNavOpen(true)}
        searchTerm={searchTerm}
        selectedCompany={selectedCompany}
        mobileNavOpen={mobileNavOpen}
      />

      <div className="flex min-h-0 w-full flex-1 overflow-hidden">
        <aside className="hidden h-full min-h-0 w-56 shrink-0 border-r border-slate-200 bg-white lg:block xl:w-60">
          <ScrollArea className="h-full">
            <DashboardSidebar
              activeSection={activeSection}
              onSectionChange={changeSection}
              selectedCompany={selectedCompany}
            />
          </ScrollArea>
        </aside>
        <ScrollArea aria-label="Dashboard content" className="h-full min-h-0 min-w-0 flex-1 bg-slate-50">
          <main className="p-4 sm:p-5 lg:p-6">{children}</main>
        </ScrollArea>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          mobileNavOpen ? "visible" : "invisible pointer-events-none",
        )}
      >
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
          className={cn(
            "absolute inset-0 bg-slate-950/40 transition-opacity",
            mobileNavOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          id="mobile-workspace-navigation"
          aria-label="Mobile workspace navigation"
          aria-hidden={!mobileNavOpen}
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(18rem,calc(100vw-3rem))] flex-col bg-slate-50 p-3 shadow-xl transition-transform",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-sm font-semibold text-slate-700">Navigation</span>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <ScrollArea className="min-h-0 flex-1">
            <DashboardSidebar
              activeSection={activeSection}
              onSectionChange={changeSection}
              selectedCompany={selectedCompany}
            />
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
