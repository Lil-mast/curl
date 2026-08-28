# Privacy and safety

Refugee and underserved users often share status, family, and documents in conversation. Default to **hearing, helping, forgetting**.

## We will not (v1)

- Store voice recordings unless a later task explicitly changes this (**T5.3** — default off)
- Keep CVs or application drafts after the session unless the user opts in (**T4.11**)
- Ask for passport numbers, case IDs, or full asylum stories
- Give legal, immigration, or medical **decisions**

## We may

- Keep anonymous counts in Neon: language, domain, session length (**T1.6**, `sessions` table)
- Keep knowledge rows in Neon (public program info, not people)

Postgres is not a case-management system. Schema contract: [`data.md`](./data.md).

## High-stakes (T5.2, T0.5)

If the user asks about asylum outcomes, deportation, diagnosis, or child danger: do not improvise. Refer to a human and a named type of service. Child-protection-style questions need a real local referral path before pilot.

## Transparency

Once per session, say that this is an assistant, not a government or clinic, and that the user should confirm with the organization (**T5.1**).

## Secrets

API keys and `DATABASE_URL` live in Render (and Neon dashboard). Never in git. Next.js does not receive the database URL. See `ops/README.md`.
