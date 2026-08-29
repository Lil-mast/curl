export type Lang = "en" | "so";
export type OpportunityKind = "job" | "scholarship" | "education" | "service";

export type Opportunity = {
  id: string;
  kind: OpportunityKind;
  title: string;
  titleSo: string;
  org: string;
  location: string;
  summary: string;
  summarySo: string;
  audience: string;
  audienceSo: string;
  steps: string[];
  stepsSo: string[];
  bring: string[];
  bringSo: string[];
  deadline?: string;
  pay?: string;
  contact: string;
  source: string;
  featured?: boolean;
};

export type Profile = {
  displayName: string;
  language: Lang;
  city: string;
  lookingFor: OpportunityKind[];
  notes: string;
};

export const EMPTY_PROFILE: Profile = {
  displayName: "",
  language: "en",
  city: "",
  lookingFor: ["job", "education", "scholarship"],
  notes: ""
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};
