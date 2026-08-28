# apps/web

**Next.js** client for Maktab AI. Phone-first public landing page (T1.2).

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

## Belongs here

- App Router pages: landing (Somali + English), talk screen
- Talk control, mute/stop, captions
- Language toggle
- Calls Flask via `NEXT_PUBLIC_API_URL`
- Display of next steps / CV draft text (no persistence by default)

This folder currently ships the **marketing landing page only**. `/assistant` and `/opportunities` links are placeholders.

## Does not belong here

- ElevenLabs API keys
- `DATABASE_URL` or any Postgres client
- Knowledge files as the runtime source of truth
- Safety policy (Flask + `docs/privacy.md`)

## Tasks

T1.2 scaffold → T2.2–T2.6 voice UX → T5.1 disclaimer → T5.6 accessibility.
