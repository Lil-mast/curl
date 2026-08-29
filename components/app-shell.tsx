"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { IconBrief, IconCap, IconDoc, IconGrid, IconHome, IconMic, IconSpark, IconUser } from "./icons";

const NAV = [
  { href: "/dashboard", key: "overview" as const, icon: IconHome },
  { href: "/profile", key: "profile" as const, icon: IconUser },
  { href: "/opportunities", key: "opportunities" as const, icon: IconGrid },
  { href: "/scholarships", key: "scholarships" as const, icon: IconCap },
  { href: "/education", key: "education" as const, icon: IconSpark },
  { href: "/jobs", key: "jobs" as const, icon: IconBrief },
  { href: "/opportunities/details", key: "details" as const, icon: IconDoc },
  { href: "/assistant", key: "assistant" as const, icon: IconMic }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready, lang, setLang, profile, lastOpportunityId } = useApp();
  const detailsHref = lastOpportunityId ? `/opportunities/${lastOpportunityId}` : "/opportunities/evening-english";

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="hidden flex-col bg-pine text-paper lg:flex">
        <div className="px-5 py-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Maktab AI</p>
          <p className="display mt-2 text-3xl">Maktab</p>
          <p className="mt-1 text-sm text-sage">
            {!ready
              ? lang === "so"
                ? "Kaaliyaha codka"
                : "Voice-first help"
              : profile.displayName
                ? lang === "so"
                  ? `Salaan, ${profile.displayName}`
                  : `Hello, ${profile.displayName}`
                : lang === "so"
                  ? "Kaaliyaha codka"
                  : "Voice-first help"}
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const href = item.key === "details" ? detailsHref : item.href;
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : item.key === "details"
                  ? pathname.startsWith("/opportunities/") && pathname !== "/opportunities"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={href}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold ${
                  active ? "bg-pine-2 text-gold" : "text-paper/85 hover:bg-pine-2"
                }`}
              >
                <Icon />
                {t(item.key, lang)}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-sage">{t("language", lang)}</p>
          <div className="flex gap-2">
            <button type="button" className={`btn ${lang === "en" ? "btn-primary" : "btn-ghost text-paper"}`} onClick={() => setLang("en")}>
              EN
            </button>
            <button type="button" className={`btn ${lang === "so" ? "btn-primary" : "btn-ghost text-paper"}`} onClick={() => setLang("so")}>
              SO
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">Maktab AI</p>
            <p className="display text-xl">Maktab</p>
          </div>
          <div className="flex gap-1">
            <button type="button" className={`btn ${lang === "en" ? "btn-primary" : "btn-ghost"}`} onClick={() => setLang("en")}>
              EN
            </button>
            <button type="button" className={`btn ${lang === "so" ? "btn-primary" : "btn-ghost"}`} onClick={() => setLang("so")}>
              SO
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 pb-32 lg:px-8 lg:py-8 lg:pb-8">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-card px-1 py-2 lg:hidden">
          {[
            { href: "/dashboard", label: t("overview", lang), icon: IconHome },
            { href: "/opportunities", label: t("opportunities", lang), icon: IconGrid },
            { href: detailsHref, label: t("details", lang), icon: IconDoc },
            { href: "/assistant", label: t("assistant", lang), icon: IconMic },
            { href: "/profile", label: t("profile", lang), icon: IconUser }
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-1 text-[0.65rem] font-semibold">
              <item.icon />
              <span className="line-clamp-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
