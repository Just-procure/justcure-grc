"use client";

import {
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { Company } from "@/data/mock-data";

type DashboardHeaderProps = {
  onLogout: () => void;
  onSearchChange: (value: string) => void;
  onToggleMobileNavigation: () => void;
  searchTerm: string;
  selectedCompany: Company;
  mobileNavOpen: boolean;
};

export function DashboardHeader({
  onLogout,
  onSearchChange,
  onToggleMobileNavigation,
  searchTerm,
  selectedCompany,
  mobileNavOpen,
}: DashboardHeaderProps) {
  return (
    <header className="z-20 shrink-0 border-b border-slate-200 bg-white">
      <div className="flex min-h-14 items-center justify-between gap-3 px-3 py-2 sm:px-4 lg:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileNavigation}
            aria-label="Open navigation"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-workspace-navigation"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold tracking-tight text-slate-900">
              Aegis Privacy OS
            </div>
            <div className="max-w-32 truncate text-[11px] text-slate-500 sm:max-w-48 sm:text-xs">
              {selectedCompany.name}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <label className="relative hidden lg:block">
            <Search
              className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <span className="sr-only">Search dashboard records</span>
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-48 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white"
              placeholder="Search records"
            />
          </label>
          <button
            type="button"
            aria-label="Notifications"
            className="hidden rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 sm:inline-flex"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Help"
            className="hidden rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 md:inline-flex"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              {selectedCompany.logoPlaceholder}
            </div>
            <div className="hidden text-left xl:block">
              <div className="text-[10px] text-slate-400">Signed in as</div>
              <div className="text-xs font-semibold text-slate-700">Aegis User</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 sm:px-3 sm:text-sm"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
