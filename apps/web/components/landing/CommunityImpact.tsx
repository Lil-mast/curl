"use client";

import { useLanguage } from "./LanguageContext";

export function CommunityImpact() {
  const { t } = useLanguage();

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <p className="section-kicker">{t.about.kicker}</p>
        <h2 className="section-title" id="about-title">
          {t.about.title}
        </h2>
        <p className="section-lede">{t.about.lede}</p>
        <div className="impact-grid">
          {t.about.items.map((item) => (
            <article className="impact-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
