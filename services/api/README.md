# services/api

**Flask** API on Render. The only process that talks to **Neon** and **ElevenLabs**.

## Belongs here (when tasks start)

- `GET /health` (**T1.3**)
- Postgres via `DATABASE_URL` (**T1.7**, **T1.8**)
- Retrieve knowledge rows from Neon (**T3.3**)
- Phrase answers only from retrieved entries (**T3.4**)
- High-stakes handling (**T5.2**)
- Session policy: no audio/CV store by default (**T5.3**, **T4.11**)
- CORS for the Next.js origin
- Later: `migrations/` SQL against Neon

## Does not belong here

- Next.js pages
- Hard-coded secrets

## Tasks

T1.3 → T1.5 env → T1.7 Neon → T1.8 schema → T3.3–T3.6 → T5.2–T5.3
