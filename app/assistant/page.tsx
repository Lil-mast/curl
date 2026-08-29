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

  // Auto-scroll chat on message update
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // Clean up speech synthesis & recognition
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
          ? "Mic-ga browser-ka ma shaqeeyo. Qor su’aashaada."
          : "Voice input is not supported in this browser. Please type your question.",
        lastOpportunityId
      );
      return;
    }
    rec.lang = lang === "so" ? "so-SO" : "en-GB";
    rec.interimResults = false;
    rec.onresult = (event) => {
      const said = event.results[0]?.[0]?.transcript ?? "";
      if (said) {
        sendMessage(said, lastOpportunityId);
      }
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

  // Filter user messages for the history sidebar
  const userHistory = messages.filter((m) => m.role === "user");

  const samplePrompts = [
    { en: "Warehouse & driving jobs in Minneapolis", so: "Shaqooyinka warehouse-ka ee Minneapolis" },
    { en: "Free evening ESL English classes", so: "Fasallada bilaashka ah ee Ingiriisiga" },
    { en: "Healthcare career grants & scholarships", so: "Deeqaha waxbarashada caafimaadka" },
    { en: "Local food pantries and utility aid", so: "Gargaarka cuntada iyo biilasha guriga" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-stone-900 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-14 pb-16">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar with navigation & controls */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 transition-colors text-stone-700 hover:text-stone-900"
              title="Return to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">
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
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-300 bg-white text-xs font-semibold text-stone-700"
            >
              <History className="w-3.5 h-3.5" />
              <span>{lang === "so" ? "Taariikhda" : "History"}</span>
            </button>

            {/* Language Switch */}
            <div className="inline-flex rounded-full border border-stone-300 bg-white p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full transition-colors ${
                  lang === "en" ? "bg-emerald-800 text-white" : "text-stone-700 hover:text-stone-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("so")}
                className={`px-3 py-1 rounded-full transition-colors ${
                  lang === "so" ? "bg-emerald-800 text-white" : "text-stone-700 hover:text-stone-900"
                }`}
              >
                SO
              </button>
            </div>

            {/* Voice Audio Speaker Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (!next && typeof window !== "undefined") {
                  window.speechSynthesis?.cancel();
                }
              }}
              className={`p-2 rounded-full border transition-colors ${
                soundEnabled
                  ? "border-emerald-800 bg-white text-emerald-800"
                  : "border-stone-300 bg-white text-stone-400"
              }`}
              title={soundEnabled ? "Voice audio playback enabled" : "Voice audio muted"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <Link
              href="/profile"
              className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 transition-colors text-stone-700 hover:text-stone-900"
              title="Profile & Preferences"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* 2-Column Assistant Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-[20rem_1fr] gap-6 items-stretch">
          {/* LEFT COLUMN: Conversation History */}
          <aside
            className={`${
              showHistoryMobile ? "flex" : "hidden"
            } lg:flex flex-col h-[34rem] bg-white border border-stone-200 rounded-3xl p-5 shadow-xs justify-between`}
          >
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-800" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    {lang === "so" ? "Taariikhda Wadahadalka" : "Conversation History"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={clearChat}
                  className="text-stone-400 hover:text-red-600 transition-colors p-1 rounded-md"
                  title="Clear History"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* New Session Button */}
              <button
                type="button"
                onClick={clearChat}
                className="mt-3 shrink-0 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-stone-100 text-xs font-semibold text-stone-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-800" />
                <span>{lang === "so" ? "Wadahadal Cusub" : "New Conversation"}</span>
              </button>

              {/* History List */}
              <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto pr-1">
                {userHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-8 text-center px-2">
                    <MessageSquare className="w-7 h-7 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-500 font-medium">
                      {lang === "so" ? "Wadahadal hore ma jiro" : "No past conversations yet"}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      {lang === "so"
                        ? "Cod ama qoraal ku bilow"
                        : "Tap mic or type to begin"}
                    </p>
                  </div>
                ) : (
                  userHistory.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSend(item.text)}
                      className="w-full text-left p-3 rounded-xl hover:bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors flex items-start gap-2.5 group"
                    >
                      <span className="w-5 h-5 rounded-full bg-stone-100 group-hover:bg-emerald-50 text-[10px] font-bold text-stone-500 group-hover:text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-stone-700 group-hover:text-stone-900 line-clamp-2 font-medium">
                        {item.text}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Active Assistant Card */}
          <main className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden flex flex-col h-[34rem]">
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#fffdf9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  M
                </div>
                <div>
                  <h2 className="font-bold text-stone-900 text-sm">Maktab AI</h2>
                  <p className="text-xs text-stone-500">
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

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {listening && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span>{lang === "so" ? "Dhageysi" : "Recording"}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Chat Messages Body */}
            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#fcfbfa]"
            >
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 px-1">
                      {isUser ? (lang === "so" ? "Adiga" : "You") : "Maktab AI"}
                    </span>
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? "bg-emerald-800 text-white font-medium rounded-br-xs shadow-xs"
                          : "bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </div>
                );
              })}

              {/* Suggested Quick Prompts (if chat is short) */}
              {messages.length <= 1 && (
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
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
                          className="text-left p-3 rounded-xl border border-stone-200 bg-white hover:border-emerald-800 hover:bg-emerald-50/30 transition-all text-xs font-medium text-stone-700 hover:text-stone-900"
                        >
                          &ldquo;{text}&rdquo;
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer with Microphone & Text Input */}
            <div className="p-4 border-t border-stone-200 bg-white">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                {/* Voice Mic Button */}
                <button
                  type="button"
                  onClick={listening ? stopTalk : startTalk}
                  className={`relative p-3 rounded-full transition-all shrink-0 ${
                    listening
                      ? "bg-red-600 text-white ring-4 ring-red-100"
                      : "bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs"
                  }`}
                  aria-label={listening ? "Stop listening" : "Start speaking"}
                  title={listening ? "Stop voice listening" : "Speak to Maktab AI"}
                >
                  {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text Field */}
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    lang === "so"
                      ? "Qor su’aal ama taabo mic-ga..."
                      : "Type a question or tap the mic to speak..."
                  }
                  className="flex-1 px-4 py-3 rounded-full border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:border-emerald-800 focus:bg-white transition-colors"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="p-3 rounded-full bg-stone-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
