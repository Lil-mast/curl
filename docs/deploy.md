# Deploy (Render + Neon)

## Intent

Ship a URL a partner can open on a phone. Cursor is for building; **Render** runs Next.js and Flask; **Neon** runs Postgres.

## v1 shape

| Service | Where | Root |
| --- | --- | --- |
| Frontend | Render **Web Service** (Node) | repo root — Next.js (`render.yaml`) |
| Backend | Render **Web Service** (Python) | `services/api` — Flask |
| Database | **Neon** (not Render) | `DATABASE_URL` on the Flask service |

## Checklist

- [ ] Next.js service on Render from repo root (`npm ci && npm run build` / `npm start`) — see `render.yaml`
- [ ] Flask service on Render (gunicorn or equivalent; `/health`)
- [ ] Neon project + database; Flask `DATABASE_URL` set in Render
- [ ] `NEXT_PUBLIC_API_URL` = Flask public URL
- [ ] ElevenLabs keys on **Flask only**
- [ ] HTTPS on both Render URLs (required for mic)
- [ ] Logs do not print transcripts, audio, or `DATABASE_URL` (**T1.6**, **T5.3**)
- [ ] Production URLs recorded here (**T6.2**)

## Env var names (values never in git)

Flask / Render:

- `DATABASE_URL`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID_SO` / `ELEVENLABS_VOICE_ID_EN` (or equivalent)
- `ALLOWED_ORIGIN` (Next.js URL)

Next.js / Render:

- `NEXT_PUBLIC_API_URL`

## Environments

| Name | Next.js | Flask | Postgres |
| --- | --- | --- | --- |
| Local | Next dev | Flask dev | Neon **dev branch** (preferred) |
| Staging | Render | Render | Neon branch or staging DB |
| Production | Render | Render | Neon production branch |

## Go-live (T6.2)

Custom domain optional. Must work on mobile Safari/Chrome. Microphone requires HTTPS.
