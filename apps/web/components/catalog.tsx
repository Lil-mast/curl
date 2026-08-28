"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OpportunityCard } from "@/components/opportunity-card";
import { OpportunityDetails } from "@/components/opportunity-details";
import { byKind, searchOpportunities } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { OpportunityKind } from "@/lib/types";
import { ArrowLeft, Search, Sparkles, Briefcase, GraduationCap, Award, Grid } from "lucide-react";

export function Catalog({
  title,
  kinds,
  showDetails
}: {
  title: string;
  kinds?: OpportunityKind[];
  showDetails?: boolean;
}) {
  const { lang, setLang, profile } = useApp();
  const [query, setQuery] = useState("");
  const [selectedKind, setSelectedKind] = useState<OpportunityKind | "all">(kinds ? kinds[0] : "all");

  const items = useMemo(() => {
    let found = searchOpportunities(query);
    if (kinds) {
      found = found.filter((item) => kinds.includes(item.kind));
    } else if (selectedKind !== "all") {
      found = found.filter((item) => item.kind === selectedKind);
    }
    if (!profile.lookingFor.length) return found;
    return [...found].sort((a, b) => Number(profile.lookingFor.includes(b.kind)) - Number(profile.lookingFor.includes(a.kind)));
  }, [kinds, selectedKind, profile.lookingFor, query]);

  const featured = items[0] ?? null;

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-stone-900 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 transition-colors text-stone-700 hover:text-stone-900 shrink-0"
                title="Return to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">{title}</h1>
            </div>
            <p className="text-sm text-stone-600 pl-11 max-w-2xl">
              {lang === "so"
                ? "Ka raadi fursadaha, deeqaha, iyo shaqooyinka ugu dhow ee la xaqiijiyay."
                : "Explore verified opportunities, scholarships, classes, and career programs."}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto pl-11 md:pl-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "so" ? "Raadi fursad..." : "Search listings..."}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-stone-300 bg-white text-sm focus:outline-none focus:border-emerald-800"
              />
            </div>

            {/* Language Switch */}
            <div className="inline-flex rounded-full border border-stone-300 bg-white p-0.5 text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  lang === "en" ? "bg-emerald-800 text-white" : "text-stone-700 hover:text-stone-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("so")}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  lang === "so" ? "bg-emerald-800 text-white" : "text-stone-700 hover:text-stone-900"
                }`}
              >
                SO
              </button>
            </div>
          </div>
        </header>

        {/* Filter Tabs (when viewing general opportunities directory) */}
        {!kinds && (
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: lang === "so" ? "Dhammaan" : "All Listings", icon: Grid },
              { id: "job", label: lang === "so" ? "Shaqooyin" : "Jobs", icon: Briefcase },
              { id: "education", label: lang === "so" ? "Waxbarasho" : "Education & ESL", icon: GraduationCap },
              { id: "scholarship", label: lang === "so" ? "Deeqo" : "Scholarships", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = selectedKind === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedKind(tab.id as OpportunityKind | "all")}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? "bg-emerald-800 border-emerald-800 text-white shadow-xs"
                      : "bg-white border-stone-300 text-stone-700 hover:border-stone-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Listings Grid or Split View */}
        {showDetails && featured ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <OpportunityDetails item={featured} />
            <aside className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">{t("opportunities", lang)}</h2>
              {items.slice(1).map((item) => (
                <OpportunityCard key={item.id} item={item} />
              ))}
            </aside>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <OpportunityCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {!items.length ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl p-6">
            <Sparkles className="w-8 h-8 text-stone-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-700">{t("noMatch", lang)}</p>
            <p className="text-xs text-stone-500 mt-1">
              {lang === "so" ? "Isku day eray kale ama eeg qaybaha kale." : "Try adjusting your search terms or filters."}
            </p>
          </div>
        ) : null}

        {/* Quick Category Shortcuts */}
        {!kinds ? (
          <div className="grid gap-3 sm:grid-cols-3 pt-4">
            <Shortcut href="/scholarships" label={t("scholarships", lang)} count={byKind("scholarship").length} />
            <Shortcut href="/education" label={t("education", lang)} count={byKind("education").length} />
            <Shortcut href="/jobs" label={t("jobs", lang)} count={byKind("job").length} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Shortcut({ href, label, count }: { href: string; label: string; count: number }) {
  return (
    <Link
      href={href}
      className="bg-white border border-stone-200 hover:border-[#e4d6c3] rounded-2xl flex items-center justify-between px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
    >
      <span className="font-bold text-sm text-stone-900">{label}</span>
      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold">{count}</span>
    </Link>
  );
}
