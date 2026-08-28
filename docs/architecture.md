# Architecture

Stack is locked: **Next.js** + **Flask** + **Neon Postgres** + **ElevenLabs** + **Render**. See [`stack.md`](./stack.md).

## Pieces

```
[ Phone browser ]
        |
        |  HTTPS
        v
[ apps/web — Next.js on Render ]
        |
        |  HTTPS (JSON, audio)
        v
[ services/api — Flask on Render ]
        |
        +---> [ Neon Postgres — knowledge + anonymous session rows ]
        |
        +---> [ services/voice — ElevenLabs STT / TTS / conversation ]
        |
        +---> [ optional LLM — only to phrase answers from retrieved rows ]
```

## Responsibility split

| Piece | Does | Does not |
| --- | --- | --- |
| **Next.js** | Mic, playback, captions, language toggle, talk UX | Store secrets, query Postgres, call ElevenLabs |
| **Flask** | `/health`, retrieval, safety, session policy, ElevenLabs | Render HTML for the product UI |
| **Neon** | Knowledge entries, anonymous counts | Voice blobs, passports, case files |
| **ElevenLabs** | Speech in / speech out | Own domain facts |

## Render

Two web services:

1. **Next.js** — `apps/web`
2. **Flask** — `services/api` (calls ElevenLabs and Neon)

Neon is not deployed on Render; Flask gets `DATABASE_URL`.

## What we are not building yet

- User accounts
- A data warehouse of recordings
- Direct submit-to-employer or government portals
- On-device models
- A second API (Next.js Route Handlers that duplicate Flask)
