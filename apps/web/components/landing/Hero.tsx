"use client";

import Link from "next/link";
import { Mic, Globe, Smartphone } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { VoiceMockup } from "./VoiceMockup";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1>
            {t.hero.title1}
            <br />
            <em>{t.hero.title2}</em>
          </h1>
          <div className="hero-actions">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 transition-colors shadow-sm"
            >
              {t.hero.primary} →
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-stone-300 text-stone-900 font-semibold text-sm hover:bg-stone-100/60 transition-colors"
            >
              {t.hero.secondary}
            </Link>
          </div>
          <div className="hero-note">
            <span>
              <Mic className="w-4 h-4 inline-block mr-1 text-emerald-800" /> {t.hero.note1}
            </span>
            <span>
              <Smartphone className="w-4 h-4 inline-block mr-1 text-emerald-800" /> {t.hero.note2}
            </span>
            <span>
              <Globe className="w-4 h-4 inline-block mr-1 text-emerald-800" /> {t.hero.note3}
            </span>
          </div>
        </div>
        <VoiceMockup />
      </div>
    </section>
  );
}
