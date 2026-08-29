# Frontend

The Next.js app lives at the **repository root**. Phone-first UI: landing page, dashboard, and voice assistant. It never holds database or ElevenLabs secrets.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run lint
```

Set `NEXT_PUBLIC_API_URL` to the Flask origin when the API exists. Local default can be `http://localhost:5000`.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Marketing landing (Somali / English) |
| `/onboarding` | First-run language, goal, and location |
| `/dashboard` | Overview, sample listings, assistant chip |
| `/profile` | Name, city, interests — this device only |
| `/opportunities` | Searchable sample listings |
| `/opportunities/[id]` | Listing detail + assistant |
| `/scholarships` | Sample grants (eligibility caution) |
| `/education` | Classes and school help |
| `/jobs` | Sample job cards |
| `/assistant` | Talk (browser speech) or type |

Listings are **samples** so the product can be used end to end. Confirm anything real with the organisation. The in-app assistant answers from those samples only.

## Stack

- Next.js 15 App Router, React 19, Tailwind 4, Ant Design, Lucide icons
- Client state: `lib/store.tsx` (no server accounts in v1)

## Rules

- UI only: mic, captions, language toggle, results
- Do not call Neon or ElevenLabs from the browser
- Microphone needs HTTPS in production
