# apps/web

**Next.js** client for Maktab AI. Phone-first landing page plus sample dashboard.

## Run locally

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run lint
```

## Routes

| Route | What it does |
| --- | --- |
| `/` | Public marketing landing page (Somali + English) |
| `/dashboard` | Dashboard overview (sample opportunities + assistant) |
| `/profile` | Name, city, interests — saved on this device only |
| `/opportunities` | Searchable sample listings |
| `/opportunities/[id]` | Opportunity details + assistant for that listing |
| `/scholarships` | Sample grants, with eligibility caution |
| `/education` | Classes and school help |
| `/jobs` | Sample job cards |
| `/assistant` | Talk (browser speech) or type |

Landing CTAs link into the dashboard (`/assistant`, `/opportunities`). Listings are **samples** so the UI can be used end-to-end.

## Belongs here

- App Router pages: landing (Somali + English), dashboard screens
- Talk control, mute/stop, captions
- Language toggle
- Calls Flask via `NEXT_PUBLIC_API_URL` (when wired)
- Display of next steps / CV draft text (no persistence by default)

## Does not belong here

- ElevenLabs API keys
- `DATABASE_URL` or any Postgres client
- Knowledge files as the runtime source of truth
- Safety policy (Flask + `docs/privacy.md`)

## Tasks

T1.2 scaffold → T2.2–T2.6 voice UX → T5.1 disclaimer → T5.6 accessibility.
