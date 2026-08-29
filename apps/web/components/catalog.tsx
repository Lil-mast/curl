"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OpportunityCard } from "@/components/opportunity-card";
import { OpportunityDetails } from "@/components/opportunity-details";
import { byKind, searchOpportunities } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { OpportunityKind } from "@/lib/types";
import { Search, Sparkles, Briefcase, GraduationCap, Award, Grid } from "lucide-react";

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
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="display text-3xl sm:text-4xl">{title}</h1>
          <p className="text-sm text-muted max-w-2xl">
            {lang === "so"
              ? "Ka raadi fursadaha, deeqaha, iyo shaqooyinka ugu dhow ee la xaqiijiyay."
              : "Explore verified opportunities, scholarships, classes, and career programs."}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "so" ? "Raadi fursad..." : "Search listings..."}
              className="pl-9"
            />
          </div>

          {/* Language Switch */}
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`btn ${lang === "en" ? "btn-primary" : "btn-ghost"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("so")}
              className={`btn ${lang === "so" ? "btn-primary" : "btn-ghost"}`}
            >
              SO
            </button>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
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
                className={`btn gap-1.5 ${active ? "btn-primary" : "btn-ghost"}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Listings */}
      {showDetails && featured ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <OpportunityDetails item={featured} />
          <aside className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">{t("opportunities", lang)}</h2>
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
        <div className="card text-center py-16 px-6">
          <Sparkles className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="text-sm font-semibold text-ink">{t("noMatch", lang)}</p>
          <p className="text-xs text-muted mt-1">
            {lang === "so" ? "Isku day eray kale ama eeg qaybaha kale." : "Try adjusting your search terms or filters."}
          </p>
        </div>
      ) : null}

      {/* Category Shortcuts */}
      {!kinds ? (
        <div className="grid gap-3 sm:grid-cols-3 pt-4">
          <Shortcut href="/scholarships" label={t("scholarships", lang)} count={byKind("scholarship").length} />
          <Shortcut href="/education" label={t("education", lang)} count={byKind("education").length} />
          <Shortcut href="/jobs" label={t("jobs", lang)} count={byKind("job").length} />
        </div>
      ) : null}
    </div>
  );
}

function Shortcut({ href, label, count }: { href: string; label: string; count: number }) {
  return (
    <Link
      href={href}
      className="card flex items-center justify-between px-5 py-4 hover:-translate-y-0.5 hover:shadow-sm transition-all"
    >
      <span className="font-bold text-sm text-ink">{label}</span>
      <span className="chip">{count}</span>
    </Link>
  );
}
