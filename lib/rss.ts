export type RssItem = {
  title: string;
  link: string;
  summary: string;
  publishedAt?: string;
  sourceName?: string;
};

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripHtml(value: string) {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string) {
  const cdata = block.match(new RegExp(`<${name}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${name}>`, "i"));
  if (cdata) return stripHtml(cdata[1]);
  const plain = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return plain ? stripHtml(plain[1]) : "";
}

function attr(block: string, name: string, attrName: string) {
  const match = block.match(new RegExp(`<${name}[^>]*\\s${attrName}=["']([^"']+)["'][^>]*/?>`, "i"));
  return match ? decodeEntities(match[1]).trim() : "";
}

function firstLink(block: string) {
  const tagged = tag(block, "link");
  if (tagged.startsWith("http")) return tagged;
  const href = attr(block, "link", "href");
  if (href.startsWith("http")) return href;
  const guid = tag(block, "guid");
  return guid.startsWith("http") ? guid : "";
}

function blocks(xml: string, name: string) {
  return [...xml.matchAll(new RegExp(`<${name}[\\s>]([\\s\\S]*?)</${name}>`, "gi"))].map((match) => match[1]);
}

export function parseFeed(xml: string): RssItem[] {
  const entries = blocks(xml, "item").concat(blocks(xml, "entry"));
  const items: RssItem[] = [];

  for (const block of entries) {
    const title = tag(block, "title");
    const link = firstLink(block);
    if (!title || !link) continue;
    const summary = tag(block, "description") || tag(block, "summary") || tag(block, "content") || tag(block, "content:encoded");
    const publishedAt = tag(block, "pubDate") || tag(block, "published") || tag(block, "updated") || tag(block, "dc:date");
    const sourceName = tag(block, "source") || undefined;
    items.push({
      title,
      link,
      summary: summary.slice(0, 420),
      publishedAt: publishedAt || undefined,
      sourceName: sourceName || undefined
    });
  }

  return items;
}

export function stableId(url: string) {
  let hash = 2166136261;
  for (let i = 0; i < url.length; i += 1) {
    hash ^= url.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `live-${(hash >>> 0).toString(36)}`;
}

export function clip(text: string, max = 280) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}
