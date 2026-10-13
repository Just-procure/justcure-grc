import type { ReactNode } from "react";
import { GrcRootShell } from "@/components/grc/grc-root-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <GrcRootShell>{children}</GrcRootShell>;
}
