# Maktab AI

**Voice AI assistant for refugee and underserved communities.**

Maktab AI lets someone **speak naturally** — in Somali or English — and get practical help with education, local services, jobs, scholarships, CVs, and community resources. No forms-first experience. No English-only barrier. Voice in, useful answer out.

> *Maktab* (مكتب) — a place of learning and of getting things done.

---

## Why this exists

People who are displaced, newly arrived, or underserved often need the same things everyone else needs: school, work, papers, and trusted local information. They are frequently asked to navigate those needs through websites, call queues, and English-heavy forms.

Maktab AI is built for the person who would rather **talk** than type — and who may be more comfortable in Somali than in English.

### Who it is for

- Refugees, asylum seekers, and newly arrived families
- Underserved communities with limited digital access or literacy
- Somali speakers who need English-world information (and the reverse)
- Helpers (caseworkers, teachers, community leaders) who sit with someone and use the assistant together

### What it helps with

| Area | What the person can ask |
| --- | --- |
| Education | How to enroll, find classes, study help, language learning |
| Services | What help exists nearby, who to contact, what documents are needed |
| Jobs | Openings, how to apply, what a role requires |
| Scholarships | What exists, who qualifies, how to apply, deadlines |
| CV / applications | Draft a CV, practice answers, fill an application in plain language |
| Community | Local groups, mosques/churches, legal clinics, food, housing leads |

Somali ↔ English voice is a first-class feature, not an afterthought.

---

## Product principles

1. **Voice first.** Typing is optional. A person should be able to complete a useful session with speech only.
2. **Plain language.** Short answers. Next step first. Jargon last.
3. **Trust over fluency.** Prefer “I don’t know — here’s who to ask” over a confident wrong answer about visas, benefits, or deadlines.
4. **Human in the loop.** The assistant points to real organizations and people. It does not replace a caseworker.
5. **Privacy by default.** Voice and personal stories are sensitive. Collect little. Keep it briefly. Explain why.
6. **Works on a phone.** Low bandwidth, small screen, noisy environments.

---

## Out of scope (for now)

These are explicitly **not** v1:

- Legal advice, immigration decisions, or “you will be approved”
- Medical diagnosis or treatment
- Storing identity documents or case files as a system of record
- Fully offline on-device models
- Every language at launch (Somali + English first)

---

## Stack

Locked. Details live in [`docs/stack.md`](./docs/stack.md) and [`docs/architecture.md`](./docs/architecture.md).

| Layer | Choice | Role |
| --- | --- | --- |
| Frontend | [Next.js](https://nextjs.org) | Phone UI: Talk, captions, language, results (`apps/web`) |
| Backend | Python ([Flask](https://flask.palletsprojects.com)) | API, safety, knowledge lookup, ElevenLabs calls (`services/api`) |
| Database | [PostgreSQL](https://www.postgresql.org) on [Neon](https://neon.tech) | Knowledge index + anonymous session stats — not recordings |
| Voice | [ElevenLabs](https://elevenlabs.io) | Speech-to-text, text-to-speech, conversational voice |
| Build | [Cursor](https://cursor.com) | Rapid application development |
| Deploy | [Render](https://render.com) | Host Next.js and Flask; Neon stays on Neon |

The Next.js app does **not** hold ElevenLabs or database secrets. The browser talks to Flask; Flask talks to Neon and ElevenLabs.

---

## How a session should feel

1. Person taps **Talk** (or the page starts listening).
2. They speak in Somali or English. The assistant detects language and stays in it unless asked to switch.
3. The assistant answers in **one next step**, then offers 1–2 follow-ups.
4. If the topic is high-stakes (legal, medical, benefits), it says so and points to a human or official source.
5. Optional: generate a CV draft, a checklist, or a short message they can copy or hear again.

Example:

> **User (Somali):** “Waxaan rabaa inaan helo shaqo nadiifin ah magaaladan.”  
> **Maktab:** Explains in Somali what is needed, lists 2–3 realistic next steps (where to look, what to bring), and offers to draft a simple CV by voice.

---

## Repository structure

This repo is **structure and planning only** until implementation starts. Folders describe where future work will live. There is no application code yet.

```
.
├── README.md                 # This file — vision, stack, map of the project
├── TASKS.md                  # Ordered work: phases, owners, acceptance criteria
├── docs/                     # Decisions and design (not code)
│   ├── product.md            # Users, flows, success metrics
│   ├── stack.md              # Next.js, Flask, Neon, ElevenLabs, Render
│   ├── architecture.md       # System sketch and boundaries
│   ├── data.md               # What Postgres stores (and what it must not)
│   ├── voice.md              # ElevenLabs, languages, conversation rules
│   ├── knowledge.md          # What content we trust and how we keep it current
│   ├── privacy.md            # Data we will and will not keep
│   └── deploy.md             # Render + Neon, environments, go-live checklist
├── apps/
│   └── web/                  # Next.js app (talk button, transcript, results)
├── services/
│   ├── api/                  # Flask: sessions, knowledge lookup, safety
│   └── voice/                # ElevenLabs wiring used by Flask (STT / TTS)
├── knowledge/                # Curated content the assistant is allowed to use
│   ├── education/
│   ├── services/
│   ├── jobs/
│   ├── scholarships/
│   ├── cv-help/
│   └── community/
└── ops/                      # Render notes, env var list, runbooks (no secrets)
```

Each folder has a short README explaining **what belongs there** and **which tasks own it**.

---

## Suggested build order

Do not start with “a chatbot that does everything.” Ship a thin voice loop, then one domain at a time.

| Phase | Goal | Outcome |
| --- | --- | --- |
| 0 | Align | Users, languages, cities/regions, safety rules written down |
| 1 | Foundation | Next.js + Flask shells on Render; Neon connected; env and secrets pattern |
| 2 | Voice | Speak → understand → speak back (Somali and English) |
| 3 | Knowledge | Curated answers for **one** domain (recommend: community services) |
| 4 | Domains | Education, jobs, scholarships, CV help — one after another |
| 5 | Trust | Disclaimers, human referral, privacy, eval of wrong answers |
| 6 | Pilot | Real users with community partners; measure and tighten |

Detailed tickets live in [`TASKS.md`](./TASKS.md).

---

## Success (pilot)

A pilot is working when:

- A Somali speaker can complete a 3-minute session without typing.
- The assistant stays in the user’s language unless they switch.
- For services/jobs/scholarships, answers include a **source or organization**, not only a summary.
- High-stakes questions are deferred to humans with a clear contact path.
- A community partner would let a family member use it without coaching.

---

## Working agreements

- **No code until a task in `TASKS.md` is picked up.** Structure first, then implement by ticket.
- Prefer Cursor for implementation speed; keep architecture notes in `docs/` so the team does not live only in chat history.
- Never commit API keys. Render env vars and a local `.env` that is gitignored.
- Knowledge files are part of the product. A wrong scholarship deadline is a product bug.

---

## License and use

To be decided by the project owners. Until then, treat this as a private community project: do not scrape or republish personal stories from users.
