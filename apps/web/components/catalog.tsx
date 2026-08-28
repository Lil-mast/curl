"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OpportunityCard } from "@/components/opportunity-card";
import { OpportunityDetails } from "@/components/opportunity-details";
import { byKind, searchOpportunities } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { OpportunityKind } from "@/lib/types";

export function Catalog({
  title,
  kinds,
  showDetails
}: {
  title: string;
  kinds?: OpportunityKind[];
  showDetails?: boolean;
}) {
  const { lang, profile } = useApp();
  const [query, setQuery] = useState("");
  const items = useMemo(() => {
    const found = searchOpportunities(query).filter((item) => (kinds ? kinds.includes(item.kind) : true));
    if (!profile.lookingFor.length) return found;
    return [...found].sort((a, b) => Number(profile.lookingFor.includes(b.kind)) - Number(profile.lookingFor.includes(a.kind)));
  }, [kinds, profile.lookingFor, query]);

  const featured = items[0] ?? null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="display text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">{t("sampleNote", lang)}</p>
        </div>
        <label className="md:w-80">
          <span className="sr-only">{t("search", lang)}</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search", lang)} />
        </label>
      </header>

      {showDetails && featured ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <OpportunityDetails item={featured} />
          <aside className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("opportunities", lang)}</h2>
            {items.slice(1).map((item) => (
              <OpportunityCard key={item.id} item={item} />
            ))}
          </aside>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <OpportunityCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!items.length ? <p className="text-sm text-muted">{t("noMatch", lang)}</p> : null}

      {!kinds ? (
        <div className="grid gap-3 sm:grid-cols-3">
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
    <Link href={href} className="card flex items-center justify-between px-4 py-4">
      <span className="font-semibold">{label}</span>
      <span className="chip">{count}</span>
    </Link>
  );
}
