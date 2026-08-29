import type { OpportunityKind } from "./types";

export type SocialLink = {
  label: string;
  url: string;
};

export type LiveSource = {
  id: string;
  name: string;
  kind: OpportunityKind;
  feedUrl: string;
  website: string;
  social: SocialLink[];
  location: string;
  limit: number;
};

/** Public RSS / news feeds. Same posts these orgs share on their websites and social channels. */
export const LIVE_SOURCES: LiveSource[] = [
  {
    id: "scholars4dev",
    name: "Scholars4Dev",
    kind: "scholarship",
    feedUrl: "https://www.scholars4dev.com/feed/",
    website: "https://www.scholars4dev.com/",
    social: [
      { label: "X", url: "https://x.com/scholars4dev" },
      { label: "Facebook", url: "https://www.facebook.com/scholars4dev" }
    ],
    location: "International — confirm on their page",
    limit: 8
  },
  {
    id: "opportunitydesk",
    name: "Opportunity Desk",
    kind: "scholarship",
    feedUrl: "https://opportunitydesk.org/feed/",
    website: "https://opportunitydesk.org/",
    social: [
      { label: "X", url: "https://x.com/opportunitydesk" },
      { label: "Facebook", url: "https://www.facebook.com/opportunitydesk" },
      { label: "Instagram", url: "https://www.instagram.com/opportunitydesk/" }
    ],
    location: "International — confirm on their page",
    limit: 8
  },
  {
    id: "ofy",
    name: "Opportunities for Youth",
    kind: "scholarship",
    feedUrl: "https://opportunitiesforyouth.org/feed/",
    website: "https://opportunitiesforyouth.org/",
    social: [
      { label: "X", url: "https://x.com/opp4youth" },
      { label: "Facebook", url: "https://www.facebook.com/opportunitiesforyouth" }
    ],
    location: "International — confirm on their page",
    limit: 6
  },
  {
    id: "fundsforngos",
    name: "FundsforNGOs",
    kind: "scholarship",
    feedUrl: "https://www2.fundsforngos.org/feed/",
    website: "https://www2.fundsforngos.org/",
    social: [
      { label: "X", url: "https://x.com/fundsforNGOs" },
      { label: "Facebook", url: "https://www.facebook.com/fundsforngos" }
    ],
    location: "Grants and funding — confirm on their page",
    limit: 5
  },
  {
    id: "wusc",
    name: "WUSC Student Refugee Program",
    kind: "education",
    feedUrl: "https://srp.wusc.ca/feed/",
    website: "https://srp.wusc.ca/",
    social: [
      { label: "X", url: "https://x.com/wusc" },
      { label: "Facebook", url: "https://www.facebook.com/wusc.ca" }
    ],
    location: "Canada — Student Refugee Program",
    limit: 4
  },
  {
    id: "chevening",
    name: "Chevening",
    kind: "scholarship",
    feedUrl: "https://www.chevening.org/feed/",
    website: "https://www.chevening.org/",
    social: [
      { label: "X", url: "https://x.com/CheveningFCDO" },
      { label: "Facebook", url: "https://www.facebook.com/cheveningawards" },
      { label: "Instagram", url: "https://www.instagram.com/cheveningfcdo/" }
    ],
    location: "UK government scholarships — confirm on chevening.org",
    limit: 4
  },
  {
    id: "web-scholarships",
    name: "Public web — refugee scholarships",
    kind: "scholarship",
    feedUrl:
      "https://news.google.com/rss/search?q=refugee+OR+asylum+OR+DAFI+(scholarship+OR+fellowship)&hl=en-US&gl=US&ceid=US:en",
    website: "https://news.google.com/",
    social: [],
    location: "From public news sites — confirm with the organisation",
    limit: 6
  },
  {
    id: "social-scholarships",
    name: "Public social posts — scholarships",
    kind: "scholarship",
    feedUrl:
      "https://news.google.com/rss/search?q=scholarship+(site:x.com+OR+site:twitter.com+OR+site:facebook.com+OR+site:linkedin.com)&hl=en-US&gl=US&ceid=US:en",
    website: "https://news.google.com/",
    social: [
      { label: "X", url: "https://x.com/search?q=refugee%20scholarship&src=typed_query" },
      { label: "Facebook", url: "https://www.facebook.com/search/posts?q=refugee%20scholarship" }
    ],
    location: "Indexed public posts — confirm on the original page",
    limit: 5
  }
];
