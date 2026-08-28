# Maktab AI — Tasks

Work is ordered. Finish a phase’s **required** tasks before starting the next phase’s build work. Discovery (Phase 0) can overlap with scaffolding (Phase 1).

Status key: `todo` · `in progress` · `done` · `blocked`

---

## Phase 0 — Discover and decide

**Goal:** Know who we serve, where, and what “safe” means before we build voice magic.

| ID | Task | Notes | Done when | Status |
| --- | --- | --- | --- | --- |
| T0.1 | Name primary user and 2 secondary users | e.g. newly arrived Somali parent; youth job seeker; caseworker sitting together | 1-page in `docs/product.md` | todo |
| T0.2 | Pick launch geography | One city / camp / region. Voice without local facts is theater. | Region + languages written in `docs/product.md` | todo |
| T0.3 | Language rules | Somali + English only for v1? Auto-detect? Code-switching? | Rules in `docs/voice.md` | todo |
| T0.4 | Partner list | 3–5 orgs that will correct our knowledge (school, job center, community group) | Named partners + contact owner | todo |
| T0.5 | Safety boundaries | What we never answer (immigration outcomes, medical diagnosis, etc.) | `docs/privacy.md` + product “refuse” list | todo |
| T0.6 | Success metrics for pilot | 3 numbers max (e.g. session completion, language stay-rate, partner NPS) | Written in `docs/product.md` | todo |

**Required before Phase 2:** T0.1, T0.3, T0.5  
**Required before Phase 3:** T0.2, T0.4

---

## Phase 1 — Foundation (no domain features)

**Goal:** Next.js + Flask shells on Render, Neon reachable. No ElevenLabs conversation yet.

| ID | Task | Notes | Done when | Status |
| --- | --- | --- | --- | --- |
| T1.1 | Choose app shape | **Locked:** Next.js + Flask + Neon Postgres on Render/Neon | `docs/stack.md` + `docs/architecture.md` | done |
| T1.2 | Scaffold `apps/web` | **Next.js** App Router; landing, “how it helps”, language toggle placeholder | `next dev` runs; documented in `apps/web/README.md` | todo |
| T1.3 | Scaffold `services/api` | **Flask**; health check only; CORS for the Next origin | `GET /health` returns ok | todo |
| T1.4 | Render blueprint | Next.js web service + Flask web service; env names listed | `docs/deploy.md` + `ops/` checklist | todo |
| T1.5 | Secrets pattern | `DATABASE_URL`, ElevenLabs, `NEXT_PUBLIC_API_URL` — `.env.example` only | Examples committed; real keys never committed | todo |
| T1.6 | Analytics without PII | Count sessions and language in Neon, not names or audio | Decision in `docs/privacy.md` + `docs/data.md` | todo |
| T1.7 | Neon project | Dev (and later prod) database; pooled `DATABASE_URL` | Flask can connect; URL only in env | todo |
| T1.8 | Postgres schema | `knowledge_entries` + anonymous `sessions`; no audio/PII columns | SQL/migrations under `services/api`; described in `docs/data.md` | todo |

**Required before Phase 2:** T1.1, T1.5  
**Required before Phase 3:** T1.7, T1.8

---

## Phase 2 — Voice loop

**Goal:** Person speaks → assistant speaks back, in Somali or English. Content can still be thin.

| ID | Task | Notes | Done when | Status |
| --- | --- | --- | --- | --- |
| T2.1 | ElevenLabs account + voices | One Somali-capable voice, one English; consent-friendly tone | Voice IDs in env; notes in `docs/voice.md` | todo |
| T2.2 | Speech-to-text path | Mic → text, with language hint (so / en) | Spoken sentence appears as text in UI | todo |
| T2.3 | Text-to-speech path | Assistant text → audio playback | User hears the reply without reading | todo |
| T2.4 | Conversational session | Keep turn-taking; interrupt / stop button | 5-turn chat by voice only | todo |
| T2.5 | Language lock + switch | Stay in user’s language; “speak English” / “ku hadal Soomaali” works | Tested both directions | todo |
| T2.6 | Failure UX | Mic denied, network drop, unintelligible audio | User hears/sees a recoverable message, not a blank screen | todo |
| T2.7 | Latency budget | Target: first audio back in a few seconds on mobile data | Number written in `docs/voice.md`; measured once | todo |

**Required before Phase 3:** T2.2, T2.3, T2.5, T2.6

---

## Phase 3 — Knowledge layer (one domain first)

**Goal:** Answers come from **our** curated files, not from the open web. Start with **community services**.

| ID | Task | Notes | Done when | Status |
| --- | --- | --- | --- | --- |
| T3.1 | Knowledge format | Same shape for every domain (title, who it’s for, steps, source, last reviewed) | Template in `knowledge/README.md` | todo |
| T3.2 | Seed `knowledge/services/` | 10–20 real entries for the launch region, partner-reviewed | Files exist; dates on each | todo |
| T3.3 | Retrieval | Flask queries Neon; returns 1–3 relevant entries | Wrong-domain questions don’t invent services | todo |
| T3.4 | Answer recipe | Next step + source + “ask a human if…” | Spot-check 10 questions with a partner | todo |
| T3.5 | Stale content rule | What happens when `last_reviewed` is old | Documented in `docs/knowledge.md` | todo |
| T3.6 | “I don’t know” path | No matching knowledge → say so + offer to switch topic or get a contact | Never fabricates a clinic/job | todo |

**Required before Phase 4:** T3.1, T3.3, T3.6

---

## Phase 4 — Domains (one at a time)

Implement in this order unless partners demand otherwise. Each domain = content + prompts + 5 evaluation questions.

### 4a — Community resources (extends Phase 3)

| ID | Task | Done when | Status |
| --- | --- | --- | --- |
| T4.1 | Housing, food, legal clinics, community groups in knowledge | Partner sign-off on list | todo |
| T4.2 | Referral language in Somali and English | Dual-language phrases reviewed by a speaker | todo |

### 4b — Education

| ID | Task | Done when | Status |
| --- | --- | --- | --- |
| T4.3 | Seed `knowledge/education/` (enroll, adult ed, language class, child school) | 10+ entries, sourced | todo |
| T4.4 | Study-help mode | Short explanations + practice questions by voice | todo |

### 4c — Jobs

| ID | Task | Done when | Status |
| --- | --- | --- | --- |
| T4.5 | Seed `knowledge/jobs/` (how to look, typical requirements — not a live job board unless a partner feed exists) | Honest about listings being examples or links, not “this job is open” unless verified | todo |
| T4.6 | Job-search conversation | Skills, location, language, work authorization **asked carefully** (see privacy) | Flow in `docs/product.md` | todo |

### 4d — Scholarships

| ID | Task | Done when | Status |
| --- | --- | --- | --- |
| T4.7 | Seed `knowledge/scholarships/` with deadlines and eligibility | Every entry has source URL/org + review date | todo |
| T4.8 | Eligibility caution | Assistant never says “you qualify”; it says “this is who they say it’s for” | Prompt + eval questions | todo |

### 4e — CV and applications

| ID | Task | Done when | Status |
| --- | --- | --- | --- |
| T4.9 | Voice-to-CV draft | Capture name, skills, work/school by conversation; output simple CV text | User can hear it back and copy | todo |
| T4.10 | Application helper | Explain a form field in Somali; suggest short answers | Does not submit forms for the user | todo |
| T4.11 | Data handling for CVs | Session-only vs save — default session-only | `docs/privacy.md` updated | todo |

---

## Phase 5 — Trust, privacy, evaluation

**Goal:** Safe enough for a partner to put in front of a family.

| ID | Task | Done when | Status |
| --- | --- | --- | --- |
| T5.1 | Spoken + written disclaimer | Not legal/medical advice; verify with the organization | Plays once per session, not every turn | todo |
| T5.2 | High-stakes classifier | Immigration, health, child protection → human referral | Test set of 20 phrases | todo |
| T5.3 | Audio retention policy | Default: do not store recordings | Implemented + documented | todo |
| T5.4 | Eval set | 30 Somali + 30 English questions across domains | Spreadsheet or `docs/` list; pass/fail | todo |
| T5.5 | Somali quality pass | Native speaker reviews 20 replies | Issues filed as tasks | todo |
| T5.6 | Accessibility | Large tap target, captions on, works with one earbud | Checklist in `docs/product.md` | todo |

**Required before Phase 6:** T5.1, T5.2, T5.3, T5.5

---

## Phase 6 — Pilot and operate

| ID | Task | Done when | Status |
| --- | --- | --- | --- |
| T6.1 | Pilot script | 15-minute session guide for a helper sitting with a user | Written in `docs/product.md` | todo |
| T6.2 | Render production | Custom domain optional; HTTPS; logs without PII | Live URL in `docs/deploy.md` | todo |
| T6.3 | On-call / feedback | WhatsApp/email for partners when knowledge is wrong | Owner named | todo |
| T6.4 | Weekly knowledge review | 30 minutes: deadlines, closed programs | Calendar + owner | todo |
| T6.5 | Pilot report | What people asked, where it failed, what to build next | 1–2 pages after 2–4 weeks | todo |

---

## Explicitly not tasks yet

Do not open tickets for these until after a real pilot:

- Additional languages beyond Somali and English
- Native mobile apps
- Live government API integrations
- User accounts and saved case history
- Fully automated job applications

---

## Suggested first week (if two people)

**Person A (product / community)**  
T0.1, T0.2, T0.4, T0.5, start T3.2 with partners.

**Person B (build)**  
T1.2 (Next.js), T1.3 (Flask), T1.5, T1.7 (Neon), then T2.1 and T2.2–T2.3 as soon as T0.3 and T0.5 exist.

Do not implement CV generation or scholarship matching in week one.
