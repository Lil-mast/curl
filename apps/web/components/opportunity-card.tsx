"use client";

import Link from "next/link";
import { kindLabel, t } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { Opportunity } from "@/lib/types";
import { IconHeart } from "./icons";

export function OpportunityCard({ item, href }: { item: Opportunity; href?: string }) {
  const { lang, savedIds, toggleSaved, setLastOpportunityId } = useApp();
  const saved = savedIds.includes(item.id);
  const title = lang === "so" ? item.titleSo : item.title;
  const summary = lang === "so" ? item.summarySo : item.summary;
  const target = href ?? `/opportunities/${item.id}`;

  return (
    <article className="card flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="chip">{kindLabel[item.kind][lang]}</span>
          <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-muted">{t("sample", lang)}</span>
        </div>
        <button
          type="button"
          className={`rounded-full p-2 ${saved ? "text-clay" : "text-muted"}`}
          aria-pressed={saved}
          aria-label={saved ? t("saved", lang) : t("save", lang)}
          onClick={() => toggleSaved(item.id)}
        >
          <IconHeart filled={saved} />
        </button>
      </div>
      <h3 className="display text-xl leading-tight">{title}</h3>
      <p className="text-sm text-muted">
        {item.org} · {item.location}
      </p>
      <p className="text-sm leading-relaxed">{summary}</p>
      {item.deadline ? <p className="text-xs font-semibold text-pine-2">{item.deadline}</p> : null}
      <Link
        href={target}
        className="btn btn-ghost self-start"
        onClick={() => setLastOpportunityId(item.id)}
      >
        {t("featured", lang)}
      </Link>
    </article>
  );
}
