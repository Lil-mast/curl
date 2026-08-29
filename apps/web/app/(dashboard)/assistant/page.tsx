"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import {
  Mic,
  MicOff,
  Send,
  Trash2,
  Plus,
  MessageSquare,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowLeft,
  Settings,
  History
} from "lucide-react";

type SpeechRec = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export default function AssistantPage() {
  const { lang, setLang, messages, sendMessage, clearChat, profile, lastOpportunityId } = useApp();
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);

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
          ? "Mic-ga browser-ka ma shaqeeyo. Qor su'aashaada."
          : "Voice input is not supported in this browser. Please type your question.",
        lastOpportunityId
      );
      return;
    }
    rec.lang = lang === "so" ? "so-SO" : "en-GB";
    rec.interimResults = false;
    rec.onresult = (event) => {
      const said = event.results[0]?.[0]?.transcript ?? "";
      if (said) sendMessage(said, lastOpportunityId);
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
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || draft).trim();
    if (!query) return;
    sendMessage(query, lastOpportunityId);
    setDraft("");
  };

  const userHistory = messages.filter((m) => m.role === "user");

  const samplePrompts = [
    { en: "Warehouse & driving jobs in Minneapolis", so: "Shaqooyinka warehouse-ka ee Minneapolis" },
    { en: "Free evening ESL English classes", so: "Fasallada bilaashka ah ee Ingiriisiga" },
    { en: "Healthcare career grants & scholarships", so: "Deeqaha waxbarashada caafimaadka" },
    { en: "Local food pantries and utility aid", so: "Gargaarka cuntada iyo biilasha guriga" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-full border border-line bg-card hover:bg-paper transition-colors text-ink-soft"
            title="Return to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="display text-2xl md:text-3xl">
              {profile.displayName
                ? lang === "so"
                  ? `Salaan, ${profile.displayName}`
                  : `Welcome, ${profile.displayName}`
                : lang === "so"
                  ? "Kaaliyaha Maktab AI"
                  : "Maktab AI Assistant"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Mobile History Toggle */}
          <button
            type="button"
            onClick={() => setShowHistoryMobile(!showHistoryMobile)}
            className="lg:hidden btn btn-ghost text-xs gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            <span>{lang === "so" ? "Taariikhda" : "History"}</span>
          </button>

          {/* Language Switch */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`btn ${lang === "en" ? "btn-primary" : "btn-ghost"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("so")}
              className={`btn ${lang === "so" ? "btn-primary" : "btn-ghost"}`}
            >
              SO
            </button>
          </div>

          {/* Sound toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (!next && typeof window !== "undefined") window.speechSynthesis?.cancel();
            }}
            className={`btn btn-ghost ${soundEnabled ? "text-pine" : "text-muted"}`}
            title={soundEnabled ? "Voice audio enabled" : "Voice audio muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <Link
            href="/profile"
            className="btn btn-ghost"
            title="Profile & Preferences"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[20rem_1fr] gap-6 items-stretch">
        {/* History Sidebar */}
        <aside
          className={`${
            showHistoryMobile ? "flex" : "hidden"
          } lg:flex flex-col h-[34rem] card p-5 justify-between`}
        >
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-line shrink-0">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-pine" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                  {lang === "so" ? "Taariikhda Wadahadalka" : "Conversation History"}
                </h2>
              </div>
              <button
                type="button"
                onClick={clearChat}
                className="text-muted hover:text-clay transition-colors p-1 rounded-md"
                title="Clear History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="mt-3 shrink-0 btn btn-ghost w-full justify-center gap-2 text-xs"
            >
              <Plus className="w-3.5 h-3.5 text-pine" />
              <span>{lang === "so" ? "Wadahadal Cusub" : "New Conversation"}</span>
            </button>

            <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {userHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-8 text-center px-2">
                  <MessageSquare className="w-7 h-7 text-muted mx-auto mb-2" />
                  <p className="text-xs text-muted font-medium">
                    {lang === "so" ? "Wadahadal hore ma jiro" : "No past conversations yet"}
                  </p>
                  <p className="text-[11px] text-muted mt-1">
                    {lang === "so" ? "Cod ama qoraal ku bilow" : "Tap mic or type to begin"}
                  </p>
                </div>
              ) : (
                userHistory.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSend(item.text)}
                    className="w-full text-left p-3 rounded-xl hover:bg-paper border border-line hover:border-sand transition-colors flex items-start gap-2.5 group"
                  >
                    <span className="w-5 h-5 rounded-full bg-paper group-hover:bg-sage text-[10px] font-bold text-muted group-hover:text-pine flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-ink-soft group-hover:text-ink line-clamp-2 font-medium">
                      {item.text}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Chat Card */}
        <main className="card overflow-hidden flex flex-col h-[34rem]">
          {/* Card Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-pine text-paper font-bold flex items-center justify-center text-sm">
                M
              </div>
              <div>
                <h2 className="font-bold text-ink text-sm">Maktab AI</h2>
                <p className="text-xs text-muted">
                  {listening
                    ? lang === "so"
                      ? "Waa la dhageysanayaa..."
                      : "Listening to your voice..."
                    : lang === "so"
                      ? "Diyaar u ah su'aalahaaga"
                      : "Ready for your voice or typing"}
                </p>
              </div>
            </div>
            {listening && (
              <span className="chip bg-terracotta-soft text-terracotta animate-pulse text-xs">
                {lang === "so" ? "Dhageysi" : "Recording"}
              </span>
            )}
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            className="flex-1 p-5 overflow-y-auto space-y-4 bg-paper/40"
          >
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 px-1">
                    {isUser ? (lang === "so" ? "Adiga" : "You") : "Maktab AI"}
                  </span>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "bg-pine text-paper font-medium"
                        : "bg-card border border-line text-ink"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              );
            })}

            {messages.length <= 1 && (
              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-pine" />
                  <span>{lang === "so" ? "Tusaalooyin Su'aalo ah" : "Try asking"}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {samplePrompts.map((p) => {
                    const text = lang === "so" ? p.so : p.en;
                    return (
                      <button
                        key={p.en}
                        type="button"
                        onClick={() => handleSend(text)}
                        className="text-left p-3 rounded-xl border border-line bg-card hover:border-sand hover:bg-paper transition-all text-xs font-medium text-ink-soft hover:text-ink"
                      >
                        &ldquo;{text}&rdquo;
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-line bg-card">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <button
                type="button"
                onClick={listening ? stopTalk : startTalk}
                className={`btn shrink-0 ${listening ? "bg-terracotta text-paper" : "btn-primary"}`}
                aria-label={listening ? "Stop listening" : "Start speaking"}
              >
                {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <label className="sr-only" htmlFor="assistant-input">
                {lang === "so" ? "Qor su'aal..." : "Type a question..."}
              </label>
              <input
                id="assistant-input"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  lang === "so"
                    ? "Qor su'aal ama taabo mic-ga..."
                    : "Type a question or tap the mic..."
                }
              />

              <button
                type="submit"
                disabled={!draft.trim()}
                className="btn btn-primary shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
