import type { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function GrcLoginLayout({ children }: { children: ReactNode }) {
  return (
    <main className="h-dvh overflow-hidden bg-[#07111f] text-slate-100">
      <ScrollArea className="h-full">{children}</ScrollArea>
    </main>
  );
}
