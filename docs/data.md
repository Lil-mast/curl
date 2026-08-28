# Data (Neon Postgres)

Postgres holds **program facts** and **anonymous usage**, not people’s stories or audio.

Full table names and columns are finalized in **T1.8**. This file is the product contract.

## Will store (v1)

| Area | Purpose | PII? |
| --- | --- | --- |
| Knowledge entries | Services, education, jobs, scholarships, community — the rows Flask retrieves | No (public program info) |
| Knowledge review metadata | `last_reviewed`, source org, region, domain | No |
| Anonymous sessions | Created time, language, domain tag, turn count | No names, no audio |

## Will not store (v1)

- Voice recordings or spectrograms
- Transcripts of what the user said (unless a later explicit opt-in task)
- CVs or application drafts after the session (**T4.11** — default session-only, in memory)
- Passport numbers, case IDs, asylum narratives
- User accounts

If a column would identify a person, it does not belong in v1.

## Suggested tables (implement in T1.8 — documentation only until then)

**`knowledge_entries`**

- `id`, `domain` (services / education / jobs / scholarships / community / cv-help)
- `region`, `title`, `audience`, `steps` (text or jsonb)
- `source_org`, `contact`, `source_url`
- `body_en`, `body_so` (or one body + `language`)
- `last_reviewed` (date)
- `active` (hide stale instead of deleting)

**`sessions`**

- `id` (opaque uuid)
- `created_at`, `language`, `domain` (nullable)
- `turn_count`
- no `user_id`

Skip a `users` table until after pilot.

## Knowledge files vs Neon

1. Humans edit `knowledge/**` (reviewable, git history).
2. A load/sync step upserts into `knowledge_entries` (**T3.2** + **T1.8**).
3. Flask **reads Neon at runtime**, not the git tree, so Render does not depend on rebuilding the frontend to fix a deadline.

## Connection

- Env var: `DATABASE_URL` (Neon connection string, pooled if they provide a pooler URL).
- Flask only. Next.js never gets this URL.
- SSL required (Neon default).

## Migrations

When T1.8 starts: SQL (or a small migration tool) lives under `services/api`, applied against Neon. Never apply production migrations from a laptop without saying so in `ops/`.
