# apps/web

**Next.js** client for Maktab AI with public landing page and interactive community dashboard.

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

## Screens

| Route | What it does |
| --- | --- |
| `/` | Public marketing landing page (Somali + English) |
| `/dashboard` | Dashboard overview (sample opportunities + assistant) |
| `/onboarding` | 5-step onboarding flow |
| `/profile` | Name, city, interests — saved on this device only |
| `/opportunities` | Searchable sample listings |
| `/opportunities/[id]` | Opportunity details + assistant for that listing |
| `/scholarships` | Sample grants, with eligibility caution |
| `/education` | Classes and school help |
| `/jobs` | Sample job cards |
| `/assistant` | Talk (browser speech) or type |

Landing CTAs link into onboarding / dashboard. Listings are **samples** so the UI can be used end-to-end. Confirm anything real with the organisation.

## Belongs here

- App Router pages: landing (Somali + English), dashboard screens
- Talk control, mute/stop, captions
- Language toggle
- Calls Flask via `NEXT_PUBLIC_API_URL` (when wired)

## Does not belong here

- ElevenLabs API keys
- `DATABASE_URL` or any Postgres client
- Knowledge files as the runtime source of truth
- Safety policy (Flask + `docs/privacy.md`)
