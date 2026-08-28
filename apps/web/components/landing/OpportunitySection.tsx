"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Globe,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

const icons = [GraduationCap, Briefcase, BookOpen, Globe];
const links = ["/scholarships", "/jobs", "/education", "/opportunities"];

export function OpportunitySection() {
  const { t } = useLanguage();

  return (
    <section className="section" id="opportunities" aria-labelledby="opp-title">
      <div className="wrap">
        <h2 className="section-title" id="opp-title">
          {t.opportunities.title}
        </h2>
        <p className="section-lede">{t.opportunities.lede}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {t.opportunities.cards.map((card, index) => {
            const Icon = icons[index];
            const href = links[index];
            return (
              <Link
                href={href}
                key={card.title}
                className="bg-white border border-stone-200 hover:border-[#e4d6c3] rounded-2xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div className="opp-icon mb-4" aria-hidden="true">
                    <Icon className="w-6 h-6 text-[#b85c38]" />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-stone-600 mb-4">{card.text}</p>
                </div>
                <span className="opp-more text-xs font-bold text-emerald-800 inline-flex items-center gap-1">
                  {t.opportunities.more} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
