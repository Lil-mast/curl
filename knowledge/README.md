# knowledge/

Curated facts humans edit in git. After **T1.8** / **T3.2**, the same facts are loaded into **Neon**; Flask serves from Postgres. If a fact is in neither git nor Neon, the assistant should not invent it.

Seed content only after **T3.1** (format) and **T0.2** (region). Prefer partner-reviewed entries over scraping.

## Folders

| Folder | Domain | Start task |
| --- | --- | --- |
| `education/` | Learning, enrollment, classes | T4.3 |
| `services/` | Available help (first domain) | T3.2 |
| `jobs/` | Work search, typical requirements | T4.5 |
| `scholarships/` | Programs, eligibility *as stated by the org*, deadlines | T4.7 |
| `cv-help/` | How to talk about experience; example CV structure | T4.9 |
| `community/` | Groups, places of worship, local networks | T4.1 |

## Entry template (finalize in T3.1)

```text
title:
audience:
region:
steps:
source_org:
contact:
last_reviewed: YYYY-MM-DD
notes_so / notes_en:
```

Do not put real user CVs or case notes in this tree.
