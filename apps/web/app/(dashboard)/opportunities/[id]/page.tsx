"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AssistantPanel } from "@/components/assistant-panel";
import { OpportunityDetails } from "@/components/opportunity-details";
import { getOpportunity, opportunities } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { ArrowLeft } from "lucide-react";

export default function OpportunityDetailsPage() {
  const params = useParams<{ id: string }>();
  const { lang, setLastOpportunityId } = useApp();
  const item = getOpportunity(params.id) ?? opportunities[0];

  useEffect(() => {
    if (item) setLastOpportunityId(item.id);
  }, [item, setLastOpportunityId]);

  if (!getOpportunity(params.id)) {
    return (
      <div className="min-h-screen bg-[#f6f1e8] text-stone-900 px-4 py-16 text-center">
        <p className="text-sm text-stone-600">{t("pickListing", lang)}</p>
        <Link href="/opportunities" className="mt-4 inline-block text-emerald-800 font-semibold text-sm">
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-stone-900 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/opportunities"
            className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 transition-colors text-stone-700 hover:text-stone-900"
            title="Back to Opportunities"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {lang === "so" ? "Faahfaahinta Fursadda" : "Opportunity Details"}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] items-start">
          <OpportunityDetails item={item} />
          <AssistantPanel focusId={item.id} />
        </div>
      </div>
    </div>
  );
}
