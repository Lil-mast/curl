"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "./app-shell";

const BARE_ROUTES = new Set(["/", "/onboarding"]);

export function ConditionalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (BARE_ROUTES.has(pathname)) {
    return children;
  }
  return <AppShell>{children}</AppShell>;
}
