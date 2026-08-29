import Link from "next/link";
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
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-forest text-white font-semibold text-sm hover:bg-forest-deep transition-colors shadow-sm"
            >
              {t.hero.primary} →
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-line text-ink font-semibold text-sm hover:bg-paper transition-colors"
            >
              {t.hero.secondary}
            </Link>
          </div>
        </div>
        <VoiceMockup />
      </div>
    </section>
  );
}
