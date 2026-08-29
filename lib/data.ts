import type { Opportunity } from "./types";

export const opportunities: Opportunity[] = [
  {
    id: "evening-english",
    kind: "education",
    title: "Evening English class",
    titleSo: "Fasalka Ingiriisiga fiidkii",
    org: "City Adult Learning Centre",
    location: "Downtown library, room 2",
    summary:
      "Free spoken English twice a week for adults. Sample listing for the dashboard — confirm times with the centre.",
    summarySo:
      "Ingiriis lagu hadlo, laba jeer toddobaadkii, dadka waaweyn. Tusaale dashboord — xaqiiji wakhtiga xarunta.",
    audience: "Adults who want to practise English for work, school, or daily life.",
    audienceSo: "Dadka waaweyn ee doonaya inay ku tababaraan Ingiriis shaqo, dugsi, ama nolosha maalinlaha.",
    steps: [
      "Call or visit the adult learning desk on the library ground floor.",
      "Say you want the evening English class. Bring a photo ID if you have one.",
      "Ask which night still has space. First session is a short conversation test, not an exam."
    ],
    stepsSo: [
      "Wac ama booqo miiska waxbarashada dadka waaweyn ee dabaqa hoose ee maktabadda.",
      "Dheh waxaad rabtaa fasalka Ingiriisiga fiidkii. Qaad aqoonsi sawir leh haddii aad haysato.",
      "Weydii habeenkee weli boos ku jiro. Casharka koowaad waa sheeko gaaban, ma aha imtixaan."
    ],
    bring: ["Photo ID if you have one", "Notebook"],
    bringSo: ["Aqoonsi sawir leh haddii aad haysato", "Buug qoraal"],
    deadline: "New groups start the first Monday of each month",
    contact: "Adult learning desk · library ground floor · ask for “evening English”",
    source: "Sample listing — confirm with City Adult Learning Centre",
    featured: true
  },
  {
    id: "kitchen-porter",
    kind: "job",
    title: "Kitchen porter (evenings)",
    titleSo: "Kaaliye jikada (fiidkii)",
    org: "Community Kitchen",
    location: "East market street",
    summary:
      "Wash, prep, and keep the kitchen safe. Sample vacancy for the UI — treat as an example of how a job would appear, not a live opening.",
    summarySo:
      "Maydh, diyaarin, jikada nadiif iyo nabadgelyo. Tusaale shaqo — tani waa tusaale muuqaal, ma aha boos la xaqiijiyay.",
    audience: "People who can work standing, evenings, and follow kitchen hygiene rules.",
    audienceSo: "Dadka istaagi kara, fiidkii shaqeyn kara, oo raaci kara nadiifinta jikada.",
    steps: [
      "Ask at the kitchen office between 2pm and 4pm, Tuesday to Thursday.",
      "Bring a simple list of past work or say what you have done (cleaning, cooking, warehouses).",
      "They may offer a trial shift. You do not need to pay anyone to apply."
    ],
    stepsSo: [
      "Weydii xafiiska jikada 2pm–4pm, Talaado ilaa Khamiis.",
      "Keen liis gaaban oo shaqooyinkii hore, ama sheeg waxaad qabatay (nadiifin, karinta, bakhaar).",
      "Waxaa laga yaabaa inay ku siiyaan maalin tijaabo. Ha bixin lacag si aad u codsato."
    ],
    bring: ["Photo ID", "Closed shoes if you have them", "A short work history on paper"],
    bringSo: ["Aqoonsi sawir leh", "Kabo xidhan haddii aad haysato", "Taariikh shaqo oo warqad ku qoran"],
    pay: "Sample: paid hourly — ask the kitchen, do not assume a number from this app",
    contact: "Kitchen office, East market street · ask for the shift supervisor",
    source: "Sample listing — confirm with Community Kitchen"
  },
  {
    id: "youth-scholarship",
    kind: "scholarship",
    title: "Newcomer youth study grant",
    titleSo: "Deeqda waxbarasho ee dhalinyarada cusub",
    org: "Local Education Trust",
    location: "Online application + city office drop-in",
    summary:
      "A small grant the Trust says is for young people in education. This app never decides if you qualify — only the Trust can.",
    summarySo:
      "Deeq yar oo Trust-ku yidhaahdo waa dhalinyarada waxbarashada. App-kani marna ma go'aaminayo inaad u qalanto — Trust-ka kaliya ayaa go'aamiya.",
    audience:
      "The Trust’s published page says: ages 16–24, enrolled in school or training, living in the city. That is their wording, not our decision.",
    audienceSo:
      "Bogga Trust-ka wuxuu yidhaahdaa: da'da 16–24, dugsi ama tababar, kuna nool magaalada. Taasi waa eraygooda, ma aha go'aankayaga.",
    steps: [
      "Read the Trust page (ask a helper if the English is hard).",
      "Fill the form with school name, years in the city, and a short paragraph about your plan.",
      "Submit before the deadline. Keep a copy. The assistant will not tell you that you are eligible."
    ],
    stepsSo: [
      "Akhri bogga Trust-ka (weydii qof kaa caawinaya haddii Ingiriisku adag yahay).",
      "Buuxi foomka: magaca dugsiga, sannadaha magaalada, iyo jumlado qorshahaaga.",
      "Gudbi ka hor kama dambaysta. Hayso nuqul. Kaaliyuhu kuuma sheegi doono inaad u qalanto."
    ],
    bring: ["School or training letter", "Address proof if they ask", "Helper who can read the form with you"],
    bringSo: ["Warqad dugsi ama tababar", "Caddayn ciwaan haddii la weydiiyo", "Qof kaa caawinaya akhriska foomka"],
    deadline: "Sample deadline: 30 September",
    contact: "Local Education Trust grants desk · city office, Wednesdays 10am–1pm",
    source: "Sample listing — confirm dates on the Trust’s own page"
  },
  {
    id: "warehouse-operative",
    kind: "job",
    title: "Warehouse operative",
    titleSo: "Shaqaale bakhaar",
    org: "City Logistics Hub",
    location: "North industrial park · bus 12",
    summary:
      "Pick, pack, and load. Sample job card so you can practise the dashboard — check with the hub before you travel.",
    summarySo:
      "Qaado, xir, rar. Tusaale shaqo si aad ugu tababarto dashboord-ka — xaqiiji xarunta ka hor intaadan dhaqaaqin.",
    audience: "People who can lift medium boxes, work early shifts, and follow safety signs.",
    audienceSo: "Dadka qaadi kara sanduuqyo dhexdhexaad, subaxda shaqeyn kara, oo raaci kara calaamadaha nabadgelyada.",
    steps: [
      "Go to the hub reception with the bus 12 stop “North park”.",
      "Ask for “warehouse hiring”. They usually take walk-ins on Monday mornings.",
      "You may be asked about work permission. You can say you want to speak with a caseworker first."
    ],
    stepsSo: [
      "Tag soo dhawaynta xarunta, istaaga bas 12 “North park”.",
      "Weydii “warehouse hiring”. Inta badan Isniinta subaxda ayay qaataan dadka soo galaya.",
      "Waxaa laga yaabaa in lagu weydiiyo ogolaanshaha shaqada. Waxaad odhan kartaa waxaan rabaa inaan la hadlo shaqaale kiiska."
    ],
    bring: ["Photo ID", "Work documents you are comfortable showing", "Closed shoes"],
    bringSo: ["Aqoonsi sawir leh", "Waraaqaha shaqada ee aad rabto inaad tustid", "Kabo xidhan"],
    pay: "Sample: paid shift work — ask reception for the current rate",
    contact: "Hub reception · North industrial park",
    source: "Sample listing — confirm with City Logistics Hub"
  },
  {
    id: "school-enrollment",
    kind: "education",
    title: "Help enrolling a child in school",
    titleSo: "Caawimaad diiwaangelinta ilmo dugsiga",
    org: "Welcome School Desk",
    location: "Education office, civic centre",
    summary:
      "Walk-in help to find a school place and understand the forms. Sample service card for the dashboard.",
    summarySo:
      "Caawimaad joogto ah si loo helo boos dugsi iyo in la fahmo foomamka. Tusaale adeeg dashboord.",
    audience: "Parents and carers of school-age children who are new to the city.",
    audienceSo: "Waalidiinta iyo daryeelayaasha carruurta da'da dugsiga ee ku cusub magaalada.",
    steps: [
      "Bring the child if you can, plus any papers from a previous school.",
      "Tell the desk the child’s age and the area you live in. They will list nearby schools.",
      "They cannot promise a place. They can tell you who to call next."
    ],
    stepsSo: [
      "Keen ilmaha haddii aad kari karto, iyo waraaqihii dugsigii hore.",
      "U sheeg miiska da'da ilmaha iyo aagga aad ku nooshahay. Waxay kuu qori doonaan dugsiyada u dhow.",
      "Ma ballanqaadi karaan boos. Waxay kuu sheegi karaan cidda xigta ee aad wacdo."
    ],
    bring: ["Child’s name and date of birth", "Proof of address if you have it", "Previous school papers"],
    bringSo: ["Magaca ilmaha iyo taariikhda dhalashada", "Caddayn ciwaan haddii aad haysato", "Waraaqihii dugsigii hore"],
    contact: "Welcome School Desk · civic centre, Monday–Friday 9am–3pm",
    source: "Sample listing — confirm with the education office"
  },
  {
    id: "legal-clinic",
    kind: "service",
    title: "Community legal clinic (drop-in)",
    titleSo: "Rugta sharciga ee bulshada (imaansho toos ah)",
    org: "Neighbourhood Advice Centre",
    location: "West hall, Saturday mornings",
    summary:
      "Short advice slots with a volunteer lawyer. Not a government decision. Sample listing — hours change.",
    summarySo:
      "Waqtiyo gaaban oo la-talin qareen tabaruc ah. Ma aha go'aan dawladeed. Tusaale — saacaduhu way isbeddelaan.",
    audience: "People who need to understand a letter, tenancy, or form. Not for medical emergencies.",
    audienceSo: "Dadka u baahan inay fahmaan warqad, kirada, ama foom. Ma aha xaalad caafimaad oo degdeg ah.",
    steps: [
      "Arrive when the hall opens. Names are taken in order.",
      "Show the letter or form. You can ask for a Somali speaker if one is on duty.",
      "Write down the next step they give you. This clinic does not represent you in court unless they say so."
    ],
    stepsSo: [
      "Imaaw marka hoolku furmo. Magacyada waxaa la qaataa siday u kala horreeyaan.",
      "Tus warqadda ama foomka. Weydii haddii qof Soomaali ku hadlaa shaqaynayo.",
      "Qor tallaabada xigta ee ay ku siiyaan. Rugtani kuma matali doonto maxkamadda haddii aysan sidaas odhan."
    ],
    bring: ["The letter or form", "Any ID you have", "A friend who can interpret if needed"],
    bringSo: ["Warqadda ama foomka", "Aqoonsi aad haysato", "Saaxiib turjumi kara haddii loo baahdo"],
    deadline: "Sample hours: Saturdays 9am–12pm",
    contact: "Neighbourhood Advice Centre · West hall",
    source: "Sample listing — confirm Saturday hours before you travel"
  }
];

export function getOpportunity(id: string, catalog: Opportunity[] = opportunities) {
  return catalog.find((item) => item.id === id) ?? null;
}

export function byKind(kind: Opportunity["kind"], catalog: Opportunity[] = opportunities) {
  return catalog.filter((item) => item.kind === kind);
}

export function searchOpportunities(query: string, catalog: Opportunity[] = opportunities) {
  const q = query.trim().toLowerCase();
  if (!q) return catalog;
  return catalog.filter((item) => {
    const blob = [
      item.title,
      item.titleSo,
      item.org,
      item.location,
      item.summary,
      item.summarySo,
      item.kind,
      item.audience
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });
}
