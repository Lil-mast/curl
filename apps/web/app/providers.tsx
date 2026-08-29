"use client";

import { LanguageProvider } from "@/components/landing/LanguageContext";
import { AppProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppProvider>{children}</AppProvider>
    </LanguageProvider>
  );
}
