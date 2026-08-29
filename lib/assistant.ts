import { opportunities as sampleOpportunities } from "./data";
import type { ChatMessage, Lang, Opportunity } from "./types";

const HIGH_STAKES =
  /\b(asylum|visa|deport|immigration|diagnos|medicine|overdose|suicid|child abuse|traffick)\b/i;

function matchesQuery(item: Opportunity, q: string) {
  const blob = `${item.title} ${item.titleSo} ${item.org} ${item.kind} ${item.summary} ${item.summarySo} ${item.audience}`.toLowerCase();
  return q.split(/\s+/).filter(Boolean).some((word) => blob.includes(word));
}

export function answerQuestion(
  raw: string,
  lang: Lang,
  focus?: Opportunity | null,
  catalog: Opportunity[] = sampleOpportunities
): ChatMessage {
  const text = raw.trim();
  const q = text.toLowerCase();
  const id = `a-${Date.now()}`;

  if (HIGH_STAKES.test(q)) {
    return {
      id,
      role: "assistant",
      text:
        lang === "so"
          ? "Tani waa arrin culus. Ma bixin karo go'aan sharci, fiis, ama caafimaad. Weydii qof bini’aadam ah — rugta sharciga ee tusaalaha, ama shaqaale kiis."
          : "That is a high-stakes question. I cannot decide legal, visa, or medical outcomes. Please ask a person — the sample legal clinic, or a caseworker."
    };
  }

  if (/\b(eligib|qualify|u qalant|waan u qalmaa)\b/i.test(q)) {
    return {
      id,
      role: "assistant",
      text:
        lang === "so"
          ? "Ma oran karo inaad u qalanto deeq ama shaqo. Kaliya waxaan ku celin karaa waxa ururku qoray. Fur faahfaahinta fursadda oo akhri qaybta “cidda ay yidhaahdaan waa loogu talagalay”, kadibna weydii ururka."
          : "I cannot say you qualify. I can only repeat what the organisation publishes. Open Opportunity details, read “who they say it is for”, then ask the organisation."
    };
  }

  const aboutThis = /\b(this listing|this opportunity|this job|this class|this grant|help me with this|iga caawi|fursaddan|tan)\b/i.test(q);
  if (focus && aboutThis) {
    const title = lang === "so" ? focus.titleSo : focus.title;
    const steps = (lang === "so" ? focus.stepsSo : focus.steps).slice(0, 2).join(" ");
    return {
      id,
      role: "assistant",
      text:
        lang === "so"
          ? `${title} — tusaale. Tallaabada xigta: ${steps} Xaqiiji ${focus.org}. Ma oran karo inaad u qalanto.`
          : `${title} — ${focus.live ? "live listing" : "sample listing"}. Next step: ${steps} Confirm with ${focus.org}. I will not say you are eligible.`
    };
  }

  const hits = catalog.filter((item) => matchesQuery(item, q)).slice(0, 3);

  if (!hits.length) {
    return {
      id,
      role: "assistant",
      text:
        lang === "so"
          ? "Ma hayo tusaale ku habboon su’aashaada. Isku day erayada: Ingiriis, shaqo, deeq, dugsi, ama sharci. Haddii aysan ku jirin tusaalahayga, weydii urur maxalli ah."
          : "I do not have a sample listing for that. Try words like English, job, scholarship, school, or legal. If it is not in these samples, ask a local organisation — I will not invent one."
    };
  }

  const lines = hits.map((item) => {
    const title = lang === "so" ? item.titleSo : item.title;
    return `• ${title} (${item.org})`;
  });

  return {
    id,
    role: "assistant",
    text:
      lang === "so"
        ? `Waxaan helay tusaalooyinkan. Fur faahfaahinta fursadda si aad u aragto tallaabooyinka:\n${lines.join("\n")}\nXaqiiji ururka ka hor intaadan dhaqaaqin.`
        : `I found these sample listings. Open Opportunity details for the steps:\n${lines.join("\n")}\nConfirm with the organisation before you travel.`
  };
}
