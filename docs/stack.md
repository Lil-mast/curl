# Stack (locked)

These choices are decided. Do not introduce a second frontend, backend, or database in v1.

| Layer | Choice | Lives in |
| --- | --- | --- |
| Frontend | **Next.js** (App Router, phone-first) | `apps/web` |
| Backend | **Python / Flask** | `services/api` |
| Database | **PostgreSQL** hosted on **Neon** | Neon project; schema in `docs/data.md` |
| Voice | **ElevenLabs** | Called only from Flask (`services/voice` helpers) |
| Build | **Cursor** | Local development |
| Deploy | **Render** | Next.js web service + Flask web service |

## How they connect

```
Phone browser
    →  Next.js  (UI only; HTTPS on Render)
    →  Flask    (JSON + audio upload/stream)
           →  Neon Postgres
           →  ElevenLabs
           →  knowledge files (seed) / knowledge rows (runtime)
```

## Rules

- **Secrets stay in Flask and Render/Neon env vars.** Next.js public env may contain only the Flask public URL (`NEXT_PUBLIC_API_URL`).
- **CORS:** Flask allows the Render Next.js origin (and localhost in dev).
- **One database.** No SQLite in production, no extra Redis for v1.
- **Knowledge source of truth** for serving is Postgres after Phase 3 load. Markdown/YAML in `knowledge/` is how humans edit and review; a load task copies into Neon (**T1.8**, **T3.2**).

## Local vs hosted

| Piece | Local | Hosted |
| --- | --- | --- |
| Next.js | `apps/web` dev server | Render |
| Flask | `services/api` | Render |
| Postgres | Neon (dev branch) or local Postgres that matches Neon | Neon |
| ElevenLabs | API against their cloud | Same |

Prefer a Neon **branch** for development rather than a random local schema that drifts.
