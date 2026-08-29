"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Brand } from "./BrandMark";
import { useLanguage } from "./LanguageContext";
import type { Lang } from "./copy";

const links = [
  { href: "#how-it-works", key: "how" as const },
  { href: "#opportunities", key: "opportunities" as const },
  { href: "#about", key: "about" as const },
];

export function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const languageButton = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
        className="lang-btn border border-line bg-white text-ink h-9 px-3 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold"
        aria-label="Language"
      >
        <span aria-hidden="true">{lang === "so" ? "🇸🇴" : "🇬🇧"}</span>
        <span className="lang-label">{lang === "so" ? "Somali" : "English"}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {langDropdownOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-line rounded-xl shadow-lg py-1 z-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setLang("so" as Lang);
              setLangDropdownOpen(false);
            }}
            className={`w-full text-left px-3 py-2 hover:bg-paper flex items-center gap-2 ${
              lang === "so" ? "text-forest font-bold" : "text-ink-soft"
            }`}
          >
            <span>🇸🇴</span>
            <span>Somali</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLang("en" as Lang);
              setLangDropdownOpen(false);
            }}
            className={`w-full text-left px-3 py-2 hover:bg-paper flex items-center gap-2 ${
              lang === "en" ? "text-forest font-bold" : "text-ink-soft"
            }`}
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      )}
    </div>
  );

  const navAnchors = (
    <>
      {links.map((link) => (
        <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
          {t.nav[link.key]}
        </a>
      ))}
    </>
  );

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Brand />
        <nav className="nav-links" aria-label="Primary">
          {navAnchors}
        </nav>
        <div className="nav-actions">
          {languageButton}
          <Link
            href="/onboarding"
            className="inline-flex items-center px-4 py-2 rounded-full bg-forest text-white font-semibold text-xs hover:bg-forest-deep transition-colors nav-cta"
          >
            {t.nav.try}
          </Link>
          <button
            className="menu-btn p-2 text-ink lg:hidden"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/30 backdrop-blur-xs">
          <div className="w-72 bg-paper h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <Image
                  src="/logo.png"
                  alt="Maktab AI"
                  width={120}
                  height={50}
                  className="h-10 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-full text-ink-soft hover:text-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="drawer-links mt-4" id="mobile-nav" aria-label="Mobile">
                {navAnchors}
              </nav>
            </div>
            <div className="pt-6">
              <Link
                href="/onboarding"
                onClick={() => setOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full bg-forest text-white font-semibold text-sm hover:bg-forest-deep transition-colors"
              >
                {t.nav.try}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
