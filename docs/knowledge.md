# Knowledge

The assistant is only as good as the files in `knowledge/`. Wrong deadlines and closed programs are product bugs.

## Format (T3.1)

Every entry should include:

- Title
- Who it is for
- Place / region
- Steps (numbered)
- Organization / source
- How to contact
- Last reviewed date
- Language notes (Somali terms that matter)

Until T3.1 is done, do not invent a second format.

## Domains

| Folder | First use |
| --- | --- |
| `knowledge/services/` | Phase 3 (first domain) |
| `knowledge/community/` | T4.1 |
| `knowledge/education/` | T4.3 |
| `knowledge/jobs/` | T4.5 |
| `knowledge/scholarships/` | T4.7 |
| `knowledge/cv-help/` | Templates and example phrasing, not user CVs |

## Freshness (T3.5)

Decide: hide, warn, or still show entries older than N days. Scholarships and jobs need a shorter N than “what is a CV.”

## Files vs Neon

Git `knowledge/` is for humans to write and review. **Flask reads Postgres** after entries are loaded (**T1.8**, **T3.2**). See [`data.md`](./data.md).

## Retrieval (T3.3)

Flask queries Neon, returns 1–3 entries. If nothing fits, **I don’t know** + human/org path (**T3.6**). Do not fall back to uncited web search in v1.

## Ownership

A partner or named teammate reviews `knowledge/` on a schedule (**T6.4**). The model is not the owner of facts.
