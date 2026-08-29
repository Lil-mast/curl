"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { answerQuestion } from "./assistant";
import { getOpportunity } from "./data";
import { EMPTY_PROFILE, type ChatMessage, type Lang, type Profile } from "./types";

const PROFILE_KEY = "maktab-profile";
const SAVED_KEY = "maktab-saved";
const LAST_KEY = "maktab-last-opportunity";
const LANG_KEY = "maktab-lang";

type AppContextValue = {
  ready: boolean;
  lang: Lang;
  setLang: (lang: Lang) => void;
  profile: Profile;
  saveProfile: (profile: Profile) => void;
  savedIds: string[];
  toggleSaved: (id: string) => void;
  lastOpportunityId: string;
  setLastOpportunityId: (id: string) => void;
  messages: ChatMessage[];
  sendMessage: (text: string, focusId?: string | null) => void;
  clearChat: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lang, setLangState] = useState<Lang>("en");
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [lastOpportunityId, setLastId] = useState("evening-english");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const storedProfile = readJson<Profile>(PROFILE_KEY, EMPTY_PROFILE);
    const storedLang = (localStorage.getItem(LANG_KEY) as Lang | null) ?? storedProfile.language ?? "en";
    setProfile(storedProfile);
    setLangState(storedLang === "so" ? "so" : "en");
    setSavedIds(readJson<string[]>(SAVED_KEY, []));
    setLastId(localStorage.getItem(LAST_KEY) || "evening-english");
    setMessages([
      {
        id: "intro",
        role: "assistant",
        text:
          storedLang === "so"
            ? "Salaan. Waxaan ku caawin karaa tusaalooyinka fasalada, shaqooyinka, iyo deeqaha. Weydii, ama taabo Talk."
            : "Salaan. I can help you look through sample classes, jobs, and scholarships. Type a question, or tap Talk."
      }
    ]);
    setReady(true);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(LANG_KEY, next);
    setProfile((current) => {
      const updated = { ...current, language: next };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveProfile = useCallback((next: Profile) => {
    setProfile(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    setLangState(next.language);
    localStorage.setItem(LANG_KEY, next.language);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setLastOpportunityId = useCallback((id: string) => {
    setLastId(id);
    localStorage.setItem(LAST_KEY, id);
  }, []);

  const sendMessage = useCallback(
    (text: string, focusId?: string | null) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const user: ChatMessage = { id: `u-${Date.now()}`, role: "user", text: trimmed };
      const focus = focusId ? getOpportunity(focusId) : getOpportunity(lastOpportunityId);
      const reply = answerQuestion(trimmed, lang, focus);
      setMessages((current) => [...current, user, reply]);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(reply.text);
        utter.lang = lang === "so" ? "so-SO" : "en-GB";
        utter.rate = 0.96;
        window.speechSynthesis.speak(utter);
      }
    },
    [lang, lastOpportunityId]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      lang,
      setLang,
      profile,
      saveProfile,
      savedIds,
      toggleSaved,
      lastOpportunityId,
      setLastOpportunityId,
      messages,
      sendMessage,
      clearChat
    }),
    [
      ready,
      lang,
      setLang,
      profile,
      saveProfile,
      savedIds,
      toggleSaved,
      lastOpportunityId,
      setLastOpportunityId,
      messages,
      sendMessage,
      clearChat
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
