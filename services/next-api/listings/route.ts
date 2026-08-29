import { NextResponse } from "next/server";
import { LIVE_SOURCES, type LiveSource } from "@/lib/live-sources";
import { clip, parseFeed, stableId } from "@/lib/rss";
import { isOpportunityKind } from "@/lib/listings";
import type { Opportunity, OpportunityKind } from "@/lib/types";

export const revalidate = 600;
export const runtime = "nodejs";

const DEFAULT_UA = "MaktabAI/0.1 (listings aggregator for refugees; +https://maktab.local)";

type SourceResult = {
  id: string;
  name: string;
  ok: boolean;
  count: number;
  website: string;
  social: LiveSource["social"];
};

function envInt(name: string, fallback: number) {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function classify(title: string, summary: string, fallback: OpportunityKind): OpportunityKind {
  const blob = `${title} ${summary}`.toLowerCase();
  if (/scholarship|fellowship|bursary|grant|tuition|deeq/.test(blob)) return "scholarship";
  if (/\bjob\b|vacancy|hiring|recruit|internship|livelihood/.test(blob)) return "job";
  if (/course|training|class|school|university|education|esl|enrol/.test(blob)) return "education";
  return fallback;
}

function postedLabel(publishedAt?: string) {
  if (!publishedAt) return undefined;
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return `Posted: ${publishedAt}`;
  return `Posted ${date.toISOString().slice(0, 10)}`;
}

function toOpportunity(source: LiveSource, item: ReturnType<typeof parseFeed>[number]): Opportunity {
  const kind = classify(item.title, item.summary, source.kind);
  const org = item.sourceName || source.name;
  const summary =
    clip(item.summary) ||
    `${org} published this listing. Open their page to read who they say it is for, the deadline, and how to apply.`;
  const social = source.social[0]?.url;

  return {
    id: stableId(item.link),
    kind,
    title: item.title,
    titleSo: item.title,
    org,
    location: source.location,
    summary: `${summary} Confirm every date and rule on the organisation’s own page. Maktab does not decide if you qualify.`,
    summarySo: `${org} ayaa daabacday fursaddan. Akhri bogga asalka si aad u ogaato cidda ay yidhaahdaan waa loogu talagalay iyo kama dambaysta. Maktab ma oranayo inaad u qalanto. ${clip(item.title, 140)}`,
    audience:
      "This is who the organisation’s public page is written for — only they can say if you qualify. Read their eligibility section before you apply.",
    audienceSo:
      "Tani waa cidda bogga ururku u qoran yahay — iyaga kaliya ayaa oran kara inaad u qalanto. Akhri shuruudaha ka hor intaadan codsan.",
    steps: [
      "Open the organisation’s own page using the source link.",
      "Read who they say it is for, what to bring, and the deadline.",
      "Apply on their site, or ask a helper to read it with you. Maktab does not submit forms."
    ],
    stepsSo: [
      "Fur bogga ururka adoo isticmaalaya xiriirka isha.",
      "Akhri cidda ay yidhaahdaan waa loogu talagalay, waxa la keeno, iyo kama dambaysta.",
      "Codso boggooda, ama weydii qof kaa caawinaya akhriska. Maktab foom ma gudbinayo."
    ],
    bring: ["The organisation’s form or portal", "ID or school papers if they ask", "A helper if the language is hard"],
    bringSo: ["Foomka ama bogga ururka", "Aqoonsi ama waraaqo dugsi haddii la weydiiyo", "Qof kaa caawinaya haddii luqaddu adag tahay"],
    deadline: postedLabel(item.publishedAt),
    contact: social ? `${org} · ${item.link} · social: ${social}` : `${org} · ${item.link}`,
    source: `Live from ${org} — ${item.link}`,
    live: true,
    sourceUrl: item.link,
    socialUrl: social,
    publishedAt: item.publishedAt,
    featured: kind === "scholarship"
  };
}

async function fetchSource(source: LiveSource, fetchMs: number, userAgent: string): Promise<{ items: Opportunity[]; result: SourceResult }> {
  const empty = { id: source.id, name: source.name, ok: false, count: 0, website: source.website, social: source.social };
  try {
    const response = await fetch(source.feedUrl, {
      signal: AbortSignal.timeout(fetchMs),
      headers: {
        "User-Agent": userAgent,
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*"
      },
      next: { revalidate: 600 }
    });
    if (!response.ok) {
      return { items: [], result: empty };
    }
    const xml = await response.text();
    if (!xml.includes("<item") && !xml.includes("<entry")) {
      return { items: [], result: empty };
    }
    const items = parseFeed(xml)
      .slice(0, source.limit)
      .map((item) => toOpportunity(source, item));
    return {
      items,
      result: { ...empty, ok: items.length > 0, count: items.length }
    };
  } catch {
    return { items: [], result: empty };
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kindParam = url.searchParams.get("kind") ?? "";
  const kindFilter = isOpportunityKind(kindParam) ? kindParam : null;
  const userAgent = process.env.LISTINGS_USER_AGENT?.trim() || DEFAULT_UA;
  const fetchMs = envInt("LISTINGS_FETCH_MS", 8000);
  const maxItems = envInt("LISTINGS_MAX_ITEMS", 40);

  const settled = await Promise.allSettled(LIVE_SOURCES.map((source) => fetchSource(source, fetchMs, userAgent)));
  const items: Opportunity[] = [];
  const sources: SourceResult[] = [];
  const seen = new Set<string>();

  for (const entry of settled) {
    if (entry.status !== "fulfilled") continue;
    sources.push(entry.value.result);
    for (const item of entry.value.items) {
      if (kindFilter && item.kind !== kindFilter) continue;
      if (seen.has(item.id) || seen.has(item.sourceUrl ?? item.id)) continue;
      seen.add(item.id);
      if (item.sourceUrl) seen.add(item.sourceUrl);
      items.push(item);
    }
  }

  const scholarshipsFirst = [...items].sort((a, b) => Number(b.kind === "scholarship") - Number(a.kind === "scholarship"));

  return NextResponse.json(
    {
      fetchedAt: new Date().toISOString(),
      live: scholarshipsFirst.length > 0,
      items: scholarshipsFirst.slice(0, maxItems),
      sources
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800"
      }
    }
  );
}
