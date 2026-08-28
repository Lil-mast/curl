"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AssistantPanel } from "@/components/assistant-panel";
import { OpportunityDetails } from "@/components/opportunity-details";
import { getOpportunity, opportunities } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export default function OpportunityDetailsPage() {
  const params = useParams<{ id: string }>();
  const { lang, setLastOpportunityId } = useApp();
  const item = getOpportunity(params.id) ?? opportunities[0];

  useEffect(() => {
    if (item) setLastOpportunityId(item.id);
  }, [item, setLastOpportunityId]);

  if (!getOpportunity(params.id)) {
    return <p className="text-sm text-muted">{t("pickListing", lang)}</p>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <OpportunityDetails item={item} />
      <AssistantPanel focusId={item.id} />
    </div>
  );
}
