"use client";

import Link from "next/link";
import { AssistantPanel } from "@/components/assistant-panel";
import { OpportunityCard } from "@/components/opportunity-card";
import { OpportunityDetails } from "@/components/opportunity-details";
import { getOpportunity } from "@/lib/data";
import { kindLabel, t } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export default function OverviewPage() {
  const { ready, lang, profile, lastOpportunityId, savedIds, listings, listingsLive, listingsReady } = useApp();
  const last = getOpportunity(lastOpportunityId, listings);
  const liveItems = listings.filter((item) => item.live);
  const preferredKind = profile.lookingFor.includes("scholarship") ? "scholarship" : profile.lookingFor[0];
  const fromKnownOrg = (item: (typeof listings)[number]) =>
    /opportunity desk|scholars4dev|chevening|wusc|opportunities for youth|fundsforngos/i.test(item.org);
  const selected =
    (last?.live ? last : null) ??
    liveItems.find((item) => item.kind === "scholarship" && fromKnownOrg(item)) ??
    liveItems.find((item) => item.kind === preferredKind && fromKnownOrg(item)) ??
    liveItems.find((item) => item.kind === "scholarship") ??
    liveItems[0] ??
    last ??
    listings[0];
  const rest = listings
    .filter((item) => item.id !== selected?.id)
    .sort((a, b) => Number(Boolean(b.live)) - Number(Boolean(a.live)))
    .slice(0, 6);
  const saved = listings.filter((item) => savedIds.includes(item.id));
  const liveCount = liveItems.length;

  if (!ready || !selected) {
    return <p className="text-sm text-muted">{lang === "so" ? "Waa la diyaarinayaa…" : "Loading your dashboard…"}</p>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">Maktab AI</p>
          <h1 className="display mt-1 text-4xl md:text-5xl">
            {profile.displayName
              ? lang === "so"
                ? `Salaan, ${profile.displayName}`
                : `Salaan, ${profile.displayName}`
              : t("greeting", lang)}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            {profile.city
              ? lang === "so"
                ? `Aagga: ${profile.city}. ${t("sampleNote", lang)}`
                : `Area: ${profile.city}. ${t("sampleNote", lang)}`
              : t("sampleNote", lang)}
          </p>
          <p className="mt-2 text-xs font-semibold text-pine-2">
            {!listingsReady
              ? t("liveLoading", lang)
              : listingsLive
                ? lang === "so"
                  ? `${liveCount} fursadood oo toos ah oo laga soo qaaday bogag iyo warbaahinta bulshada`
                  : `${liveCount} live listings from organisation websites and public social posts`
                : t("liveFailed", lang)}
          </p>
        </div>
        <Link href="/profile" className="card max-w-sm px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("yourProfile", lang)}</p>
          <p className="mt-1 font-semibold">{profile.displayName || (lang === "so" ? "Magac lama gelin" : "No name yet")}</p>
          <p className="text-sm text-muted">
            {profile.lookingFor.length
              ? profile.lookingFor.map((kind) => kindLabel[kind][lang]).join(" · ")
              : lang === "so"
                ? "Dooro waxaad raadinayso"
                : "Choose what you are looking for"}
          </p>
        </Link>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <OpportunityDetails item={selected} />
        <AssistantPanel focusId={selected.id} />
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="display text-3xl">{t("opportunities", lang)}</h2>
          <Link href="/opportunities" className="text-sm font-semibold text-clay">
            {lang === "so" ? "Dhammaan" : "See all"}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rest.map((item) => (
            <OpportunityCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {saved.length ? (
        <section className="space-y-3">
          <h2 className="display text-2xl">{t("saved", lang)}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {saved.map((item) => (
              <OpportunityCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/scholarships" className="card px-4 py-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("scholarships", lang)}</p>
          <p className="display mt-1 text-2xl">{lang === "so" ? "Deeqaha tooska ah" : "Live grants"}</p>
        </Link>
        <Link href="/education" className="card px-4 py-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("education", lang)}</p>
          <p className="display mt-1 text-2xl">{lang === "so" ? "Fasallo iyo dugsi" : "Classes and school"}</p>
        </Link>
        <Link href="/jobs" className="card px-4 py-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("jobs", lang)}</p>
          <p className="display mt-1 text-2xl">{lang === "so" ? "Shaqooyin tusaale" : "Sample jobs"}</p>
        </Link>
      </section>
    </div>
  );
}
