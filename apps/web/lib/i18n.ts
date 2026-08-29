import type { Lang, OpportunityKind } from "./types";

type Dict = Record<Lang, string>;

export const copy = {
  appName: { en: "Maktab", so: "Maktab" } satisfies Dict,
  overview: { en: "Overview", so: "Guud ahaan" } satisfies Dict,
  profile: { en: "Profile", so: "Profile" } satisfies Dict,
  opportunities: { en: "Opportunities", so: "Fursadaha" } satisfies Dict,
  scholarships: { en: "Scholarships", so: "Deeqaha waxbarasho" } satisfies Dict,
  education: { en: "Education", so: "Waxbarasho" } satisfies Dict,
  jobs: { en: "Jobs", so: "Shaqooyin" } satisfies Dict,
  details: { en: "Opportunity details", so: "Faahfaahinta fursadda" } satisfies Dict,
  assistant: { en: "AI assistant", so: "Kaaliyaha AI" } satisfies Dict,
  sample: { en: "Sample listing", so: "Tusaale" } satisfies Dict,
  save: { en: "Save", so: "Kaydi" } satisfies Dict,
  saved: { en: "Saved", so: "La kaydiyay" } satisfies Dict,
  nextSteps: { en: "Next steps", so: "Tallaabooyinka xiga" } satisfies Dict,
  whoFor: { en: "Who they say it is for", so: "Cidda ay yidhaahdaan waa loogu talagalay" } satisfies Dict,
  bring: { en: "What to bring", so: "Waxa la keeno" } satisfies Dict,
  contact: { en: "Who to ask", so: "Cidda la weydiiyo" } satisfies Dict,
  source: { en: "Source", so: "Ilaha" } satisfies Dict,
  askThis: { en: "Ask the assistant about this", so: "Ka weydii kaaliyaha tan" } satisfies Dict,
  search: { en: "Search opportunities", so: "Raadi fursado" } satisfies Dict,
  talk: { en: "Talk", so: "Hadal" } satisfies Dict,
  stop: { en: "Stop", so: "Jooji" } satisfies Dict,
  listening: { en: "Listening…", so: "Waan dhegeysanayaa…" } satisfies Dict,
  typePlaceholder: {
    en: "Ask about a class, job, or scholarship…",
    so: "Weydii fasal, shaqo, ama deeq waxbarasho…"
  } satisfies Dict,
  greeting: { en: "Salaan. What do you need next?", so: "Salaan. Maxaad u baahan tahay?" } satisfies Dict,
  sampleNote: {
    en: "These are sample listings so you can try the dashboard. Confirm every time, place, and deadline with the organisation.",
    so: "Kuwaani waa tusaalooyin si aad u tijaabiso dashboord-ka. Xaqiiji wakhtiga, goobta, iyo kama dambaysta ururka."
  } satisfies Dict,
  scholarshipCaution: {
    en: "Maktab never says you qualify. It only repeats what the organisation publishes.",
    so: "Maktab marna ma odhanayo waad u qalantaa. Kaliya wuxuu soo celiyaa waxa ururku daabacay."
  } satisfies Dict,
  noMatch: {
    en: "No matching sample listings. Try another word, or ask the assistant.",
    so: "Ma jiro tusaale ku habboon. Isku day eray kale, ama weydii kaaliyaha."
  } satisfies Dict,
  yourProfile: { en: "Your profile", so: "Profile-kaaga" } satisfies Dict,
  displayName: { en: "Name (optional)", so: "Magac (ikhtiyaar)" } satisfies Dict,
  city: { en: "City or area", so: "Magaalo ama aag" } satisfies Dict,
  lookingFor: { en: "I am looking for", so: "Waxaan raadinayaa" } satisfies Dict,
  notes: { en: "Notes for yourself", so: "Qoraal naftaada ah" } satisfies Dict,
  saveProfile: { en: "Save profile", so: "Kaydi profile-ka" } satisfies Dict,
  profileHint: {
    en: "Stored on this phone only. No account. No case file.",
    so: "Waxaa lagu kaydiyaa telefoonkan kaliya. Akoon ma jiro. Dosiye kiis ma jiro."
  } satisfies Dict,
  language: { en: "Language", so: "Luqadda" } satisfies Dict,
  featured: { en: "Open this listing", so: "Fur tusaalahan" } satisfies Dict,
  related: { en: "Related sample listings", so: "Tusaalooyin la xidhiidha" } satisfies Dict,
  pickListing: {
    en: "Choose a listing to see opportunity details.",
    so: "Dooro tusaale si aad u aragto faahfaahinta fursadda."
  } satisfies Dict,
  assistantIntro: {
    en: "I can help you look through these sample listings. I do not decide visas, diagnoses, or scholarship eligibility.",
    so: "Waan kaa caawin karaa inaad eegto tusaalooyinkan. Ma go'aaminayo fiisaha, ogaanshaha cudur, ama u-qalmida deeqda."
  } satisfies Dict
} as const;

export const kindLabel: Record<OpportunityKind, Dict> = {
  job: { en: "Job", so: "Shaqo" },
  scholarship: { en: "Scholarship", so: "Deeq waxbarasho" },
  education: { en: "Education", so: "Waxbarasho" },
  service: { en: "Service", so: "Adeeg" }
};

export function t(key: keyof typeof copy, lang: Lang) {
  return copy[key][lang];
}
