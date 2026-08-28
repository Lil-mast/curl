# services/

Python backends. Keep voice vendor and database details out of Next.js.

| Folder | Role | Tasks |
| --- | --- | --- |
| `api/` | **Flask** — sessions, Neon retrieval, safety, health | T1.3, T1.7–T1.8, T3.3, T5.2 |
| `voice/` | ElevenLabs helpers used **by Flask** (STT / TTS / conversation) | T2.1–T2.7 |

No application code yet. Scaffold Flask at **T1.3**; connect Neon at **T1.7**; wire ElevenLabs at **Phase 2**.
