"use client";

import { Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";

type VoiceMockupProps = {
  variant?: "phone" | "panel";
};

type DemoLang = "en" | "so" | "sw";

const DEMO_ORDER: DemoLang[] = ["en", "so", "sw"];

const LANG_META: Record<
  DemoLang,
  { code: string; label: string; flag: string; htmlLang: string }
> = {
  en: { code: "en", label: "English", flag: "🇬🇧", htmlLang: "en" },
  so: { code: "so", label: "Somali", flag: "🇸🇴", htmlLang: "so" },
  sw: { code: "sw", label: "Swahili", flag: "🇰🇪", htmlLang: "sw" },
};

const PHONE_LINES: Record<
  DemoLang,
  { prompt: string; tap: string; user: string; ai: string }
> = {
  en: {
    prompt: "How can I help you?",
    tap: "Tap to speak",
    user: "I'm looking for a scholarship.",
    ai: "I found scholarship opportunities that may fit you.",
  },
  so: {
    prompt: "Sidee kuu caawin karaa?",
    tap: "Taabo si aad u hadasho",
    user: "Waxaan raadinayaa scholarship.",
    ai: "Waxaan kuu helay fursado scholarship oo kugu habboon.",
  },
  sw: {
    prompt: "Naweza kukusaidiaje?",
    tap: "Gusa ili uongee",
    user: "Natafuta scholarship.",
    ai: "Nimepata fursa za scholarship zinazokufaa.",
  },
};

const PANEL_LINES: Record<DemoLang, { user: string; ai: string }> = {
  en: {
    user: "I'm looking for a technology job.",
    ai: "I found several technology opportunities that might be a good fit for you.",
  },
  so: {
    user: "Waxaan raadinayaa shaqo technology ah.",
    ai: "Waxaan helay fursado dhowr ah oo technology ah oo laga yaabo inay kugu habboon yihiin.",
  },
  sw: {
    user: "Natafuta kazi ya teknolojia.",
    ai: "Nimepata fursa kadhaa za teknolojia ambazo zinaweza kukufaa.",
  },
};

function Waveform() {
  return (
    <div className="wave" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          style={{
            animationDelay: `${i * 0.08}s`,
            height: `${6 + ((i * 7) % 14)}px`,
          }}
        />
      ))}
    </div>
  );
}

function useDemoLang(intervalMs = 3800) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % DEMO_ORDER.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs]);

  return DEMO_ORDER[index];
}

export function VoiceMockup({ variant = "phone" }: VoiceMockupProps) {
  const { t } = useLanguage();
  const demoLang = useDemoLang();
  const meta = LANG_META[demoLang];
  const phone = PHONE_LINES[demoLang];
  const panel = PANEL_LINES[demoLang];

  const conversation = (
    <div className="chats" key={demoLang}>
      <div className="bubble user demo-fade">
        <small>{t.hero.you}</small>
        <span lang={meta.htmlLang}>
          {variant === "phone" ? phone.user : panel.user}
        </span>
      </div>
      <div className="bubble ai demo-fade">
        <small>Maktab AI</small>
        <span lang={meta.htmlLang}>
          {variant === "phone" ? phone.ai : panel.ai}
        </span>
        <Waveform />
      </div>
    </div>
  );

  const langChip = (
    <span className="lang-chip demo-fade" key={`chip-${demoLang}`}>
      {meta.flag} {meta.label}
    </span>
  );

  if (variant === "panel") {
    return (
      <div className="voice-panel">
        <div className="voice-meta">
          <span className="pill">
            {meta.flag} {meta.label}
          </span>
          <span className="pill">🎤 {t.voice.voice}</span>
          <span className="pill">🔊 {t.voice.audio}</span>
        </div>
        <div className="phone-head" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="phone-avatar" aria-hidden="true">
              M
            </div>
            <strong>Maktab AI</strong>
          </div>
          {langChip}
        </div>
        {conversation}
      </div>
    );
  }

  return (
    <div className="phone" aria-label="Maktab AI voice assistant preview">
      <div className="phone-bar">
        <span>9:41</span>
        <span>LTE  ●●●</span>
      </div>
      <div className="phone-head">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="phone-avatar" aria-hidden="true">
            M
          </div>
          <strong>Maktab AI</strong>
        </div>
        {langChip}
      </div>
      <p className="phone-prompt demo-fade" key={`prompt-${demoLang}`} lang={meta.htmlLang}>
        {phone.prompt}
      </p>
      <div className="mic-wrap">
        <span className="mic-ring" />
        <span className="mic-ring delay" />
        <div className="mic-btn" aria-hidden="true">
          <Mic className="w-7 h-7" />
        </div>
      </div>
      <p className="tap-label demo-fade" key={`tap-${demoLang}`} lang={meta.htmlLang}>
        {phone.tap}
      </p>
      {conversation}
    </div>
  );
}
