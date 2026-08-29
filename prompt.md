# Maktab AI — Logo Prompt for Gemini

Use this file with **Gemini** (image generation / Nano Banana / Imagen) to create a logo worthy of Maktab AI.

Copy the **Primary prompt** first. If results feel generic, use the **Variant prompts** or the **Refinement follow-ups**.

---

## Brand in one line

**Maktab AI** — a multilingual, voice-first AI assistant that helps refugees, displaced people, and underserved communities find scholarships, jobs, education, and community resources by speaking, starting with Somali and English.

**Tagline:** Your Voice. Your Opportunity.

**Name meaning:** *Maktab* (مكتب) — a place of learning and of getting things done.

---

## Visual identity (match the product)

| Role | Color | Hex |
| --- | --- | --- |
| Deep forest (trust, primary) | Forest green | `#134E3A` |
| Voice accent | Terracotta / warm clay | `#B85C38` |
| Warm paper background | Soft cream | `#F6F1E8` |
| Ink | Warm near-black | `#1C1915` |
| Soft highlight | Sand / sage light | `#E4D6C3` / `#D7E2D1` |

**Feel:** Premium, human, trustworthy, African-tech, AI-powered, accessible — **not** generic SaaS purple, not ChatGPT-clone, not stereotypical “Africa” clip-art, not stock-photo heavy.

**Core symbol:** Voice + learning. The **microphone / sound wave** is the product’s visual identity. Prefer an abstract mark that can work as an app icon at 32px.

---

## Primary prompt (paste into Gemini)

```text
Design a modern app logo for “Maktab AI”, a voice-first AI assistant that helps refugees and underserved communities discover education, jobs, and scholarships by speaking — especially in Somali and English.

Create a single clean logo mark + wordmark.

CONCEPT:
- Abstract fusion of a microphone and soft sound waves, suggesting speaking and being heard.
- Subtle nod to learning / a place of getting things done (the meaning of “Maktab”), without drawing a literal school or book.
- Human, warm, and trustworthy — African-tech and community-centered, not Silicon Valley generic.

STYLE:
- Flat vector logo, simple geometry, 2–3 colors maximum.
- Premium and editorial, like a carefully designed nonprofit-tech product.
- Soft rounded forms, confident but gentle.
- Works as a square app icon and as a horizontal logo with text.

COLORS (exact):
- Deep forest green #134E3A as the main color
- Terracotta #B85C38 as a small accent for the “voice” element
- Optional cream #F6F1E8 only as background, not as a muddy fill
- No purple gradients, no neon, no rainbow AI clichés

TYPOGRAPHY:
- Wordmark “Maktab AI” in a refined humanist sans or soft serif display style
- “Maktab” slightly more distinctive; “AI” quieter and secondary
- Letterspacing clean; no comic fonts, no futuristic sci-fi fonts

COMPOSITION:
- Primary deliverable: centered icon mark on a cream or transparent background
- Secondary: horizontal layout — icon left, “Maktab AI” right
- Plenty of clear space; no clutter; no decorative borders

MUST AVOID:
- Stereotypical African imagery (maps of Africa, tribal patterns, safari motifs, generic “earth child” illustrations)
- Realistic photos, 3D plastic AI heads, robot faces, glowing brains
- Crowded icons, too many details that break at small size
- Chat bubbles that look like WhatsApp or Messenger clones
- Excessive gradients and glassmorphism

OUTPUT:
- High-resolution flat logo, crisp edges, vector-like
- Transparent or solid cream background
- Ready for a mobile app icon and a website navbar
```

---

## Variant prompts

### A — Icon only (app icon / favicon)

```text
Create a square app icon for Maktab AI. Circular or rounded-square badge in deep forest green #134E3A. Inside: a minimal white microphone combined with 2–3 terracotta #B85C38 sound-wave bars. Extremely simple, readable at 32×32 pixels. Flat vector, no text, no gradients, no 3D. Cream #F6F1E8 background optional outside the badge. Premium African-tech voice assistant brand — human and trustworthy, not generic AI.
```

### B — Wordmark focus

```text
Design a refined wordmark logo: “Maktab AI”. Soft editorial display type for “Maktab”, quieter “AI”. Color: forest green #134E3A with a tiny terracotta #B85C38 accent on a sound-wave or mic diacritic above or beside the word. Tagline under optional and small: “Your Voice. Your Opportunity.” Cream background #F6F1E8. Flat, modern, nonprofit-tech elegance. No clip-art, no Africa map.
```

### C — Symbol that merges voice + opportunity

```text
Abstract logo mark for Maktab AI: a single geometric symbol that reads as both a microphone capsule and an upward path / open doorway of opportunity, framed by soft concentric sound arcs. Forest green #134E3A and terracotta #B85C38 only. Flat vector, balanced, memorable, works in monochrome. Mood: dignity, access, speaking and being heard. Avoid stereotypes and sci-fi AI tropes.
```

---

## Refinement follow-ups (after the first result)

Paste one of these if Gemini’s first logo is close but not right:

1. **Simpler:** “Simplify the mark to 3–4 shapes total. Remove fine lines. It must stay clear at 24px.”
2. **Less generic AI:** “Remove any neural-network nodes, circuit boards, or glowing orbs. Keep only mic + waves.”
3. **More human:** “Make the curves warmer and less corporate. Soften sharp corners. Still professional.”
4. **Stronger voice identity:** “Increase the sound-wave presence slightly; terracotta accent only on the waves.”
5. **Monochrome test:** “Also show a pure black version and a pure white version for dark/light UI.”
6. **Lockup:** “Provide navbar lockup: icon 32px equivalent next to ‘Maktab AI’ in forest green.”

---

## Deliverables to ask Gemini for

Ask for these in one message after you like a direction:

```text
Please provide:
1) Primary icon (square, transparent background)
2) Horizontal lockup: icon + “Maktab AI”
3) Monochrome black version
4) Monochrome white version
5) A version with the tagline “Your Voice. Your Opportunity.” in small text underneath
All flat vector style, no mockups of phones unless asked.
```

---

## Usage notes for the team

- Prefer a mark that still works if “AI” is removed from the wordmark later.
- Do not put Somali flag colors or Arabic calligraphy into the logo unless a native speaker / designer reviews it — language inclusion lives in the product UI, not forced into the mark.
- The current in-product mark is a green circle with three cream waveform bars; Gemini can elevate that idea without copying a stock mic icon.
- Final files should ideally be exported later as SVG + PNG (1024×1024) for the Next.js app favicon and navbar.
