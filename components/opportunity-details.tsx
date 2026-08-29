"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { kindLabel, t } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { Opportunity } from "@/lib/types";
import { IconHeart } from "./icons";

export function OpportunityDetails({ item }: { item: Opportunity }) {
  const router = useRouter();
  const { lang, savedIds, toggleSaved, setLastOpportunityId, sendMessage, listings } = useApp();
  const saved = savedIds.includes(item.id);
  const title = lang === "so" ? item.titleSo : item.title;
  const summary = lang === "so" ? item.summarySo : item.summary;
  const audience = lang === "so" ? item.audienceSo : item.audience;
  const steps = lang === "so" ? item.stepsSo : item.steps;
  const bring = lang === "so" ? item.bringSo : item.bring;
  const related = listings.filter((other) => other.kind === item.kind && other.id !== item.id).slice(0, 2);

  return (
    <section className="card overflow-hidden">
      <div className="bg-pine px-5 py-4 text-paper">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{t("details", lang)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="chip bg-sage text-pine">{kindLabel[item.kind][lang]}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gold">
            {item.live ? t("live", lang) : t("sample", lang)}
          </span>
        </div>
        <h1 className="display mt-3 text-3xl leading-tight">{title}</h1>
        <p className="mt-1 text-sm text-sage">
          {item.org} · {item.location}
        </p>
      </div>

      <div className="space-y-6 p-5">
        <p className="leading-relaxed">{summary}</p>
        {item.kind === "scholarship" ? (
          <p className="rounded-2xl bg-gold/30 px-4 py-3 text-sm font-medium">{t("scholarshipCaution", lang)}</p>
        ) : null}

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("whoFor", lang)}</h2>
          <p className="mt-2 leading-relaxed">{audience}</p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("nextSteps", lang)}</h2>
          <ol className="prose-steps mt-3">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("bring", lang)}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {bring.map((thing) => (
              <li key={thing}>{thing}</li>
            ))}
          </ul>
        </div>

        {item.pay ? <p className="text-sm font-medium">{item.pay}</p> : null}
        {item.deadline ? <p className="text-sm font-semibold">{item.deadline}</p> : null}

        <div className="rounded-2xl bg-paper px-4 py-3 text-sm">
          <p>
            <strong>{t("contact", lang)}:</strong> {item.contact}
          </p>
          <p className="mt-1 text-muted">
            <strong>{t("source", lang)}:</strong>{" "}
            {item.sourceUrl ? (
              <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-pine underline-offset-2 hover:underline">
                {item.source}
              </a>
            ) : (
              item.source
            )}
            {item.socialUrl ? (
              <>
                {" · "}
                <a href={item.socialUrl} target="_blank" rel="noreferrer" className="text-pine underline-offset-2 hover:underline">
                  {t("openSocial", lang)}
                </a>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => toggleSaved(item.id)}>
            <IconHeart filled={saved} />
            {saved ? t("saved", lang) : t("save", lang)}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setLastOpportunityId(item.id);
              sendMessage(lang === "so" ? "Iga caawi fursaddan." : "Help me with this opportunity.", item.id);
              router.push("/assistant");
            }}
          >
            {t("askThis", lang)}
          </button>
        </div>

        {related.length ? (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("related", lang)}</h2>
            <ul className="mt-3 space-y-2">
              {related.map((other) => (
                <li key={other.id}>
                  <Link
                    href={`/opportunities/${other.id}`}
                    className="block rounded-xl border border-line px-3 py-2 hover:bg-paper"
                    onClick={() => setLastOpportunityId(other.id)}
                  >
                    {lang === "so" ? other.titleSo : other.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
