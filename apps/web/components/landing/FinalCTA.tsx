"use client";

import { Button } from "antd";
import { useLanguage } from "./LanguageContext";

const HEADLINES = [
  { lang: "en", text: "Your Next Opportunity Could Be One Conversation Away." },
  { lang: "sw", text: "Fursa yako ifuatayo inaweza kuwa mazungumzo moja tu." },
  { lang: "so", text: "Fursaddaada xigta waxay ku jirtaa hal wadahadal." },
] as const;

function MarqueeTrack() {
  return (
    <div className="cta-marquee-track">
      {HEADLINES.map((item) => (
        <span className="cta-marquee-item" key={item.lang} lang={item.lang}>
          {item.text}
          <span className="cta-marquee-sep" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
    </div>
  );
}

export function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="final-cta">
      <div className="wrap">
        <div className="cta-band">
          <div className="cta-marquee" aria-label="CTA headlines">
            <div className="cta-marquee-viewport">
              <div className="cta-marquee-move">
                <MarqueeTrack />
                <MarqueeTrack />
              </div>
            </div>
            <p className="cta-marquee-sr">
              {HEADLINES.map((item) => item.text).join(" · ")}
            </p>
          </div>
          <p className="cta-lede">{t.cta.lede}</p>
          <Button
            className="cta-button"
            size="large"
            href="/assistant"
            style={{
              background: "#f6f1e8",
              color: "#1c1915",
              border: 0,
            }}
          >
            {t.cta.button} →
          </Button>
        </div>
      </div>
    </section>
  );
}
