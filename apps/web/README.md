# apps/web

**Next.js** client for Maktab AI. Phone-first. Scaffold when **T1.2** starts — no application code in the repo yet.

## Belongs here

- App Router pages: landing (Somali + English), talk screen
- Talk control, mute/stop, captions
- Language toggle
- Calls Flask via `NEXT_PUBLIC_API_URL`
- Display of next steps / CV draft text (no persistence by default)

## Does not belong here

- ElevenLabs API keys
- `DATABASE_URL` or any Postgres client
- Knowledge files as the runtime source of truth
- Safety policy (Flask + `docs/privacy.md`)

## Tasks

T1.2 scaffold → T2.2–T2.6 voice UX → T5.1 disclaimer → T5.6 accessibility.
