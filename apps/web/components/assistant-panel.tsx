"use client";

import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { IconMic } from "./icons";

type SpeechRec = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function AssistantPanel({ focusId }: { focusId?: string | null }) {
  const { lang, messages, sendMessage } = useApp();
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<SpeechRec | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    return () => {
      recRef.current?.stop();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  function getRecognizer(): SpeechRec | null {
    const Speech = (window as typeof window & {
      SpeechRecognition?: new () => SpeechRec;
      webkitSpeechRecognition?: new () => SpeechRec;
    }).SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: new () => SpeechRec }).webkitSpeechRecognition;
    if (!Speech) return null;
    return new Speech();
  }

  function startTalk() {
    const rec = getRecognizer();
    if (!rec) {
      sendMessage(
        lang === "so"
          ? "Mic-ga browser-ka ma shaqeeyo. Qor su’aasha."
          : "This browser cannot listen. Type your question instead.",
        focusId
      );
      return;
    }
    rec.lang = lang === "so" ? "so-SO" : "en-GB";
    rec.interimResults = false;
    rec.onresult = (event) => {
      const said = event.results[0]?.[0]?.transcript ?? "";
      if (said) sendMessage(said, focusId);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  function stopTalk() {
    recRef.current?.stop();
    setListening(false);
    window.speechSynthesis?.cancel();
  }

  return (
    <section className="card flex h-full min-h-[28rem] flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{t("assistant", lang)}</p>
          <h2 className="display text-xl">{t("greeting", lang)}</h2>
        </div>
        <button
          type="button"
          className={`btn ${listening ? "btn-ghost" : "btn-primary"}`}
          onClick={listening ? stopTalk : startTalk}
        >
          <IconMic />
          {listening ? t("stop", lang) : t("talk", lang)}
        </button>
      </header>

      <div ref={listRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <p className="text-xs text-muted">{t("assistantIntro", lang)}</p>
        {listening ? <p className="text-sm font-semibold text-clay">{t("listening", lang)}</p> : null}
        {messages.map((message) => (
          <p
            key={message.id}
            className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              message.role === "user" ? "ml-auto bg-pine text-paper" : "bg-paper"
            }`}
          >
            {message.text}
          </p>
        ))}
      </div>

      <form
        className="flex gap-2 border-t border-line p-3"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(draft, focusId);
          setDraft("");
        }}
      >
        <label className="sr-only" htmlFor="ask">
          {t("typePlaceholder", lang)}
        </label>
        <input
          id="ask"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("typePlaceholder", lang)}
        />
        <button type="submit" className="btn btn-primary shrink-0">
          {lang === "so" ? "Dir" : "Send"}
        </button>
      </form>
    </section>
  );
}
