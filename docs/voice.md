# Voice

ElevenLabs is the speech/voice interface. Product rules live here so prompts and UI stay aligned.

## Languages (T0.3)

v1: **Somali** and **English** only.

Decide:

- Auto-detect vs user picks before talking
- What happens when a sentence mixes both (code-switching)
- How the user says “switch to English” / “ku hadal Soomaali”

## Conversation rules

- Short turns. Next action first.
- Match the user’s language.
- If unsure, ask one clarifying question, not five.
- Never fake a government decision, a diagnosis, or “you got the job/scholarship.”

## ElevenLabs work (Phase 2)

| Task | Intent |
| --- | --- |
| T2.1 | Pick voices that sound respectful, not childish or cartoonish |
| T2.2 | Speech → text with a language hint |
| T2.3 | Text → speech; captions always |
| T2.4 | Multi-turn; obvious Stop |
| T2.7 | Measure time-to-first-audio on mobile data |

## Failure

Mic blocked, silence, noise, API timeout: speak and show a recovery line in the current language (**T2.6**).

## Latency

Write the target number here when **T2.7** is done.
