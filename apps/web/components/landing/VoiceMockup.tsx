"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Mic, Wifi, Battery, Signal } from "lucide-react";
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
    <div className="chats space-y-2 mt-2" key={demoLang}>
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
              <Image src="/logo.png" alt="" width={28} height={28} />
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
    <div className="relative mx-auto" aria-label="Maktab AI voice assistant preview">
      <div className="w-[300px] sm:w-[324px] bg-[#1a1816] p-3 rounded-[46px] shadow-2xl ring-1 ring-stone-700/40 relative">
        <div className="absolute -left-1 top-24 w-1 h-8 bg-stone-700 rounded-l-md" />
        <div className="absolute -left-1 top-36 w-1 h-8 bg-stone-700 rounded-l-md" />
        <div className="absolute -right-1 top-28 w-1 h-12 bg-stone-700 rounded-r-md" />

        <div className="bg-[#fffdf9] rounded-[38px] overflow-hidden p-3.5 flex flex-col justify-between min-h-[490px] shadow-inner relative border border-stone-200/60">
          <div className="w-24 h-4 bg-stone-900 rounded-full mx-auto flex items-center justify-end px-2 mb-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 px-2 pt-0.5 pb-2 shrink-0">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[9px]">LTE</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 py-1.5 pb-2 border-b border-stone-100 shrink-0">
            <div className="flex items-center gap-2">
              <div className="phone-avatar" aria-hidden="true">
                <Image src="/logo.png" alt="" width={28} height={28} />
              </div>
              <div>
                <strong className="text-xs text-stone-900 block leading-tight">
                  Maktab AI
                </strong>
                <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Voice
                </span>
              </div>
            </div>
            {langChip}
          </div>

          <div className="text-center py-2 shrink-0">
            <p
              className="font-bold text-stone-900 text-base demo-fade"
              key={`prompt-${demoLang}`}
              lang={meta.htmlLang}
            >
              {phone.prompt}
            </p>
          </div>

          <div className="my-auto py-2 flex flex-col items-center">
            <div className="mic-wrap">
              <span className="mic-ring" />
              <span className="mic-ring delay" />
              <div className="mic-btn" aria-hidden="true">
                <Mic className="w-7 h-7 text-white" />
              </div>
            </div>
            <p
              className="text-xs font-semibold text-stone-500 mt-1 demo-fade"
              key={`tap-${demoLang}`}
              lang={meta.htmlLang}
            >
              {phone.tap}
            </p>
          </div>

          <div className="shrink-0">{conversation}</div>

          <div className="w-28 h-1 bg-stone-300 rounded-full mx-auto mt-3 shrink-0" />
        </div>
      </div>
    </div>
  );
}
