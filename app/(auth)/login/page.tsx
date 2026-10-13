"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createDemoCompanies } from "@/data/grc-data";
import { DemoLogin, type DemoRole } from "@/components/grc/auth/demo-login";

const STORAGE_KEY = "aegis-grc-demo-store";
const companies = createDemoCompanies();

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<DemoRole>("Company Administrator");
  const [companyId, setCompanyId] = useState(companies[0].id);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as { loggedIn?: boolean; role?: DemoRole; companyId?: string } | null;
      if (saved?.loggedIn) router.replace("/");
      if (saved?.role) setRole(saved.role);
      if (saved?.companyId && companies.some((company) => company.id === saved.companyId)) setCompanyId(saved.companyId);
    } catch {
      // Use the default demo workspace when stored data is unavailable.
    }
  }, [router]);

  const signIn = () => {
    let saved: Record<string, unknown> = {};
    try {
      saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, unknown>;
    } catch {
      // Replace invalid demo storage with a valid login state.
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, companies, companyId, selectedLoginCompany: companyId, role, loggedIn: true }));
    window.dispatchEvent(new CustomEvent("aegis-auth-change", { detail: true }));
    router.push("/");
  };

  return <DemoLogin companies={companies} selectedCompanyId={companyId} role={role} onCompanyChange={setCompanyId} onRoleChange={setRole} onSignIn={signIn} />;
}

