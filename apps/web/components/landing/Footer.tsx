"use client";

import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { useLanguage } from "./LanguageContext";

export function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-[#f6f1e8] text-stone-700 py-12 px-4 sm:px-8 mt-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5 text-stone-900">
            <BrandMark size={28} />
            <span className="font-bold text-lg tracking-tight">
              Maktab <span className="text-[#b85c38]">AI</span>
            </span>
          </div>
          <p className="text-sm text-stone-600 max-w-md leading-relaxed">
            {lang === "so"
              ? "Kaaliyaha codka ee ugu horreeya ee u fududeynaya bulshada inay helaan shaqooyin, deeqo waxbarasho, iyo adeegyo muhiim ah."
              : "Voice-first opportunity discovery for refugee and underserved communities. Available in Somali & English."}
          </p>
        </div>

        {/* Directory Links */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-900">
            {lang === "so" ? "Fursadaha" : "Opportunities"}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/jobs" className="hover:text-stone-900 transition-colors">
                {lang === "so" ? "Shaqooyinka" : "Jobs & Hiring"}
              </Link>
            </li>
            <li>
              <Link href="/education" className="hover:text-stone-900 transition-colors">
                {lang === "so" ? "Waxbarashada & ESL" : "Education & ESL Classes"}
              </Link>
            </li>
            <li>
              <Link href="/scholarships" className="hover:text-stone-900 transition-colors">
                {lang === "so" ? "Deeqaha Waxbarasho" : "Scholarships & Grants"}
              </Link>
            </li>
            <li>
              <Link href="/opportunities" className="hover:text-stone-900 transition-colors">
                {lang === "so" ? "Dhammaan Adeegyada" : "All Directory Listings"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Assistant & Quick Links */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-900">
            {lang === "so" ? "Kaaliyaha Codka" : "Voice Assistant"}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/onboarding" className="hover:text-stone-900 transition-colors">
                {lang === "so" ? "Bilow Kaaliyaha (5 Tallaabo)" : "Get Started (Onboarding)"}
              </Link>
            </li>
            <li>
              <Link href="/assistant" className="hover:text-stone-900 transition-colors">
                {lang === "so" ? "La Hadal Maktab AI" : "Talk with Maktab AI"}
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-stone-900 transition-colors">
                {lang === "so" ? "Xogtaada & Dookhyada" : "Your Profile & Settings"}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Maktab AI (مكتب). All rights reserved.</p>
        <p className="text-stone-500">
          {lang === "so" ? "Af-Soomaali & English" : "Somali & English First-Class Support"}
        </p>
      </div>
    </footer>
  );
}
