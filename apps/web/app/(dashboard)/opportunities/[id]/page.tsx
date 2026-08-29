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
      <div className="py-16 text-center">
        <p className="text-sm text-muted">{t("pickListing", lang)}</p>
        <Link href="/opportunities" className="mt-4 inline-block text-pine font-semibold text-sm">
          ← {lang === "so" ? "Ku noqo Fursadaha" : "Back to Opportunities"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/opportunities"
          className="btn btn-ghost"
          title="Back to Opportunities"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-clay">
          {lang === "so" ? "Faahfaahinta Fursadda" : "Opportunity Details"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] items-start">
        <OpportunityDetails item={item} />
        <AssistantPanel focusId={item.id} />
      </div>
    </div>
  );
}
