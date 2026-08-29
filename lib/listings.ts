import { opportunities as sampleOpportunities } from "./data";
import type { Opportunity, OpportunityKind } from "./types";

export type ListingSourceResult = {
  id: string;
  name: string;
  ok: boolean;
  count: number;
  website: string;
  social: { label: string; url: string }[];
};

export type ListingsResponse = {
  fetchedAt: string;
  live: boolean;
  items: Opportunity[];
  sources: ListingSourceResult[];
};

export function isOpportunityKind(value: string): value is OpportunityKind {
  return value === "job" || value === "scholarship" || value === "education" || value === "service";
}

export function mergeCatalog(liveItems: Opportunity[], samples: Opportunity[] = sampleOpportunities): Opportunity[] {
  const seen = new Set<string>();
  const merged: Opportunity[] = [];

  for (const item of [...liveItems, ...samples]) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    if (item.sourceUrl) seen.add(item.sourceUrl);
    merged.push(item);
  }

  return merged;
}

export async function fetchLiveListings(init?: RequestInit): Promise<ListingsResponse> {
  const response = await fetch("/api/listings", {
    ...init,
    headers: { Accept: "application/json", ...init?.headers }
  });
  if (!response.ok) {
    throw new Error(`Listings request failed (${response.status})`);
  }
  const data = (await response.json()) as ListingsResponse;
  return {
    fetchedAt: data.fetchedAt ?? new Date().toISOString(),
    live: Boolean(data.live),
    items: Array.isArray(data.items) ? data.items : [],
    sources: Array.isArray(data.sources) ? data.sources : []
  };
}
