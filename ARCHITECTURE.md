# Architecture

Maktab AI is a voice assistant for refugee and underserved communities. Speak in Somali or English; get a next step for education, services, jobs, scholarships, CVs, and community help.

**Locked stack:** Next.js + Flask + Neon Postgres + ElevenLabs + Render.

## Sketch

```
[ Phone browser ]
        |
        |  HTTPS
        v
[ Next.js — repo root, Render ]
        |
        |  HTTPS (JSON, audio)
        v
[ services/api — Flask, Render ]
        |
        +---> [ Neon Postgres — knowledge + anonymous sessions ]
        |
        +---> [ services/voice — ElevenLabs STT / TTS ]
        |
        +---> [ optional LLM — phrase answers from retrieved rows only ]
```

## Boundaries

| Piece | Does | Does not |
| --- | --- | --- |
| **Next.js** | Mic, playback, captions, language, talk UX | Secrets, Postgres, ElevenLabs |
| **Flask** | Health, retrieval, safety, session policy, vendor calls | Product HTML |
| **Neon** | Knowledge rows, anonymous counts | Voice blobs, identity docs |
| **ElevenLabs** | Speech in / out | Domain facts |

## Deploy

Two Render web services: Next.js (this repo root) and Flask (`services/api`). Neon is not on Render; Flask gets `DATABASE_URL`.

| Name | Next.js | Flask | Postgres |
| --- | --- | --- | --- |
| Local | `npm run dev` | Flask dev | Neon **dev branch** |
| Production | Render | Render | Neon production |

Env (values never in git):

- Flask: `DATABASE_URL`, `ELEVENLABS_API_KEY`, voice IDs, `ALLOWED_ORIGIN`
- Next.js: `NEXT_PUBLIC_API_URL`

HTTPS is required for the microphone. Logs must not print transcripts, audio, or connection strings.

## Privacy

Hear, help, forget. No recordings or CVs by default. Anonymous session counts only. The assistant is not a government, clinic, or case-management system. High-stakes topics (asylum, diagnosis, child danger) refer to a human.

## Repo

```
.
├── FRONTEND.md / BACKEND.md / ARCHITECTURE.md
├── render.yaml               # Render Blueprint (Next.js web service)
├── app/ components/ lib/     # Next.js
├── apps/README.md
├── services/api|voice
├── knowledge/
└── ops/
```

See [FRONTEND.md](./FRONTEND.md) and [BACKEND.md](./BACKEND.md).
