# Backend

Python lives under `services/`. Flask is the only process that talks to **Neon** and **ElevenLabs**. Next.js never gets those credentials.

## Layout

| Path | Role |
| --- | --- |
| `services/api` | Flask: health, retrieval, safety, sessions, CORS |
| `services/voice` | ElevenLabs helpers used **by Flask** (STT / TTS) |
| `knowledge/` | Curated facts humans edit in git, then load into Neon |
| `ops/` | Runbooks and env **names** (never secret values) |

## Flask (when scaffolded)

- `GET /health`
- CORS for the Next origin (`ALLOWED_ORIGIN`) and localhost in dev
- Postgres via `DATABASE_URL` (Neon, SSL)
- Retrieve knowledge rows; phrase answers only from those rows
- High-stakes questions → human referral, not improvised legal/medical decisions
- Default: do not store audio, transcripts, or CVs

## Voice

v1 languages: **Somali** and **English**. Short turns, next step first, captions always. Failures (mic denied, timeout, noise) must recover in the current language.

Env on Flask only:

- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID_SO` / `ELEVENLABS_VOICE_ID_EN`

## Data (Neon)

Store program facts and anonymous usage — not people’s stories.

| Store | Do not store |
| --- | --- |
| `knowledge_entries` (public program info, source, last reviewed) | Recordings, transcripts, passports, case files |
| `sessions` (opaque id, language, domain, turn count) | User accounts, CVs after the session |

Humans edit `knowledge/{education,services,jobs,scholarships,cv-help,community}/`. A load step upserts into Neon. Flask **reads Neon at runtime**.

## Knowledge entry shape

```text
title, audience, region, steps
source_org, contact, last_reviewed
notes_so / notes_en
```

If a fact is in neither git nor Neon, the assistant must not invent it.
