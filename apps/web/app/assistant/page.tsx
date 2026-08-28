"use client";

import { AssistantPanel } from "@/components/assistant-panel";
import { useApp } from "@/lib/store";

export default function AssistantPage() {
  const { lastOpportunityId } = useApp();
  return (
    <div className="mx-auto max-w-3xl">
      <AssistantPanel focusId={lastOpportunityId} />
    </div>
  );
}
