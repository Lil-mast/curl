# apps/web

**Next.js** dashboard for Maktab AI. Phone-first. No marketing landing page — `/` is the working dashboard.

## Run

```bash
cd apps/web
npm install
npm run dev
```

Open `http://localhost:3000`.

## Screens

| Route | What it does |
| --- | --- |
| `/` | Overview: profile chip, Opportunity details, AI assistant, sample listings |
| `/profile` | Name, city, interests — saved on this device only |
| `/opportunities` | Searchable sample listings |
| `/opportunities/[id]` | Opportunity details + assistant for that listing |
| `/scholarships` | Sample grants, with eligibility caution |
| `/education` | Classes and school help |
| `/jobs` | Sample job cards |
| `/assistant` | Talk (browser speech) or type |

Listings are **samples** so the dashboard can be used end-to-end. Confirm anything real with the organisation. The assistant answers from those samples only — it will not invent a clinic or say you qualify.
