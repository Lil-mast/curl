"use client";

import { AudioOutlined, GlobalOutlined, MobileOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useLanguage } from "./LanguageContext";
import { VoiceMockup } from "./VoiceMockup";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.kicker}</p>
          <h1>
            {t.hero.title1}
            <br />
            <em>{t.hero.title2}</em>
          </h1>
          <div className="hero-actions">
            <Button type="primary" size="large" href="/assistant">
              {t.hero.primary} →
            </Button>
            <Button size="large" href="/opportunities">
              {t.hero.secondary}
            </Button>
          </div>
          <div className="hero-note">
            <span>
              <AudioOutlined /> {t.hero.note1}
            </span>
            <span>
              <MobileOutlined /> {t.hero.note2}
            </span>
            <span>
              <GlobalOutlined /> {t.hero.note3}
            </span>
          </div>
        </div>
        <VoiceMockup />
      </div>
    </section>
  );
}
