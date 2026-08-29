"use client";

import { useEffect, useState } from "react";
import { kindLabel, t } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { OpportunityKind, Profile } from "@/lib/types";

const KINDS: OpportunityKind[] = ["job", "scholarship", "education", "service"];

export function ProfileForm() {
  const { lang, profile, saveProfile, ready } = useApp();
  const [form, setForm] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (ready) setForm(profile);
  }, [profile, ready]);

  function toggleKind(kind: OpportunityKind) {
    setForm((current) => {
      const lookingFor = current.lookingFor.includes(kind)
        ? current.lookingFor.filter((item) => item !== kind)
        : [...current.lookingFor, kind];
      return { ...current, lookingFor };
    });
  }

  return (
    <form
      className="card space-y-4 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        saveProfile({ ...form, language: lang });
        setSaved(true);
      }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{t("profile", lang)}</p>
        <h1 className="display mt-1 text-3xl">{t("yourProfile", lang)}</h1>
        <p className="mt-2 text-sm text-muted">{t("profileHint", lang)}</p>
      </div>

      <label className="block text-sm font-semibold">
        {t("displayName", lang)}
        <input
          className="mt-1 font-normal"
          value={form.displayName}
          onChange={(event) => setForm({ ...form, displayName: event.target.value })}
        />
      </label>

      <label className="block text-sm font-semibold">
        {t("city", lang)}
        <input
          className="mt-1 font-normal"
          value={form.city}
          onChange={(event) => setForm({ ...form, city: event.target.value })}
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold">{t("lookingFor", lang)}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {KINDS.map((kind) => {
            const on = form.lookingFor.includes(kind);
            return (
              <button
                key={kind}
                type="button"
                className={`btn ${on ? "btn-primary" : "btn-ghost"}`}
                aria-pressed={on}
                onClick={() => toggleKind(kind)}
              >
                {kindLabel[kind][lang]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="block text-sm font-semibold">
        {t("notes", lang)}
        <textarea
          className="mt-1 min-h-28 font-normal"
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
        />
      </label>

      <button type="submit" className="btn btn-primary mb-4 scroll-mb-28">
        {t("saveProfile", lang)}
      </button>
      {saved ? <p className="text-sm font-medium text-pine-2">{lang === "so" ? "Waa la kaydiyay." : "Saved on this phone."}</p> : null}
    </form>
  );
}
