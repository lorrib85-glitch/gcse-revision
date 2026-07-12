# Typography System

**Version:** v2 — reconciled with live `src/constants/typography.js`  
**Source file:** `src/constants/typography.js`

---

## Purpose

Defines all typography behaviour across the product. Maintains visual hierarchy, emotional consistency, and cinematic pacing. Prevents font drift and readability degradation.

Typography should feel: **cinematic, calm, intelligent, mature, immersive, premium**.

Typography should NOT feel: corporate, productivity-app-like, overly decorative, playful, cluttered, generic educational software.

> **Semantic rule.** Module typography is assigned by role, never chosen
> locally. Pick the token whose role matches the element (see "Role
> assignment" below); never hand-set `fontSize` / `fontWeight` /
> `fontFamily` / `letterSpacing` to build a bespoke heading. Governed
> composition components (e.g. `TeachScreenShell`) must not hardcode
> `fontFamily` or `fontWeight` at all — enforced by
> `tests/architecture/screen-composition-governance.test.js` and
> `tests/architecture/typography-governance.test.js`.

---

## Font Families

| Font | Usage |
|------|-------|
| **Manrope** | Cinematic display type — the four `display*` tokens (`displayHero`, `displayScreen`, `displaySection`, `displayCard`). Headings, titles, impact moments. |
| **Sora** | All other UI text — body copy, buttons, labels, navigation, metadata, captions. |

Both fonts are loaded via Google Fonts in `index.html`.

**Rules:**
- Never introduce a third font family.
- Manrope is for display hierarchy and emotional weight — not body copy or fine-print labels.
- Sora handles everything else; it is the dominant font by character count across the product.

---

## TYPE Tokens

```js
import { TYPE } from '../../constants/typography.js'
```

These are the **live** tokens exported by `src/constants/typography.js`. Names and weights match the code exactly.

### Display (Manrope)

| Token | Size | Weight | Line height | Letter spacing | Role |
|-------|------|--------|-------------|----------------|------|
| `TYPE.displayHero` | clamp(32px, 9vw, 48px) | 600 | 1.05 | -0.028em | Cinematic / hero title — the biggest emotional moment on a screen |
| `TYPE.displayScreen` | clamp(28px, 8vw, 38px) | 560 | 1.07 | -0.022em | Standard learning-screen title (the `TeachScreenShell` heading) |
| `TYPE.displaySection` | clamp(22px, 6vw, 30px) | 560 | 1.10 | -0.015em | Section-level title |
| `TYPE.displayCard` | 1.15rem | 560 | 1.20 | -0.012em | Supporting / card title |

### Titles & body (Sora)

| Token | Size | Weight | Line height | Role |
|-------|------|--------|-------------|------|
| `TYPE.titleLarge` | 1.1rem | 600 | 1.35 | Prominent Sora sub-title / strong label |
| `TYPE.titleMedium` | 0.95rem | 600 | 1.30 | Sora sub-title / strong label |
| `TYPE.bodyLarge` | 1.02rem | 400 | 1.48 | Larger body passages |
| `TYPE.body` | 0.95rem | 400 | 1.50 | Explanation copy, reading content |
| `TYPE.bodyStrong` | clamp(15px, 4vw, 17px) | 500 | 1.45 | Emphasised body line |
| `TYPE.bodySmall` | 0.84rem | 400 | 1.45 | Small body copy |

### Labels, metadata & captions (Sora)

| Token | Size | Weight | Line height | Letter spacing | Role |
|-------|------|--------|-------------|----------------|------|
| `TYPE.label` | 0.82rem | 500 | 1.20 | 0.01em | Sentence-case labels and kickers |
| `TYPE.metadata` | 0.72rem | 500 | 1.20 | 0.10em | Timing, counts, progress labels (uppercase permitted) |
| `TYPE.caption` | 0.78rem | 400 | 1.35 | -0.003em | Captions, timestamps, fine print |

### Buttons & specialised (Sora)

| Token | Size | Weight | Line height | Role |
|-------|------|--------|-------------|------|
| `TYPE.button` | 0.92rem | 500 | 1.20 | All standard button labels |
| `TYPE.buttonLarge` | 1.0rem | 600 | 1.20 | Large / primary button labels |
| `TYPE.quizQuestion` | clamp(34px, 8.7vw, 46px) | 600 | 1.05 | Quiz question (extends `displayScreen`) |
| `TYPE.quizOption` | 0.95rem | 500 | 1.28 | Quiz option label |
| `TYPE.quizHint` | 0.92rem | 400 | 1.45 | Quiz hint |
| `TYPE.examQuestion` | clamp(14px, 3.8vw, 15.5px) | 520 | 1.55 | Exam question text |
| `TYPE.examAnswer` | clamp(15px, 4vw, 16px) | 420 | 1.72 | Exam answer text |
| `TYPE.secondsMarker` | 0.58em | — | 1 | Raised "s" marker (e.g. the "s" in "90s") |

### Deprecated

`TYPE.eyebrow` is deprecated — it is kept only as an alias of `TYPE.label`
for backward compatibility. Do not spread it in new code; use `TYPE.label`
(sentence case). The eyebrow *pattern* (uppercase, letter-spaced label above
a heading) is prohibited — see "Label case" below.

**Removed aliases (do not reintroduce).** The pre-v2 display/weight aliases —
`hero`, `screenHeading`, `sectionHeading`, `sectionTitle`, `impactTitle`,
`cinematic`, `cardTitle`, `bodyText`, `bodySmallText`, `metadataText`,
`captionText`, `buttonText`, `featureText`, `overlayTitle`, `overlayBody`,
`overlayEyebrow`, `overlayPrompt`, `examAnswerText`, `examQuestionText` — no
longer exist in the token system and their old 700–850 display weights are
gone. Reaching for any of them fails
`tests/architecture/typography-governance.test.js`. Use the live tokens above.

---

## Role assignment

Titles are assigned by role using the **current live tokens** — never by
choosing a weight locally, and never with a blanket "every title is the same
weight" rule:

| Role | Token |
|------|-------|
| Cinematic / hero title | `TYPE.displayHero` |
| Standard learning-screen title | `TYPE.displayScreen` |
| Section-level title | `TYPE.displaySection` |
| Supporting / card title | `TYPE.displayCard` |
| Body, label, metadata, caption | their corresponding tokens above |

Standard teaching-screen titles use `TYPE.displayScreen` — this is the token
`TeachScreenShell` owns for the heading. Supporting section and card headings
use their subordinate tokens (`displaySection` / `displayCard`) so they read
as clearly below the screen title.

---

## Usage Examples

```js
// Standard learning-screen title (TeachScreenShell owns this internally)
<h1 style={{ ...TYPE.displayScreen, color: 'rgba(245,245,245,0.96)', margin: 0 }}>
  Every illness had an opposite
</h1>

// Cinematic / hero moment
<h1 style={{ ...TYPE.displayHero, color: 'rgba(245,245,245,0.96)', margin: 0 }}>
  Quick recovery?
</h1>

// Section title (subordinate to the screen title)
<h2 style={{ ...TYPE.displaySection, color: 'rgba(245,245,245,0.92)', margin: 0 }}>
  {section.title}
</h2>

// Explanation body copy
<p style={{ ...TYPE.body, color: 'rgba(245,245,245,0.68)', maxWidth: 310, margin: '0 auto' }}>
  {block.explanation}
</p>

// Metadata label (uppercase treatment permitted for scanning data)
<div style={{ ...TYPE.metadata, textTransform: 'uppercase', color: accent, opacity: 0.90 }}>
  3 QUESTIONS • UNDER 90 SECONDS
</div>
```

---

## Hierarchy Rules

Each screen should have:
- **One dominant text element** — the screen's focal title, usually
  `TYPE.displayScreen` (or `TYPE.displayHero` on a cinematic screen)
- **Supporting hierarchy visibly subordinate** — `TYPE.displaySection` /
  `TYPE.displayCard` / `TYPE.body`
- **Clear breathing room** between levels

> Valid token use alone is not a hierarchy pass. The rendered mobile screen
> (390px) must contain one clear typographic focal point, with supporting
> headings visibly subordinate — checked in the render pass
> (`PATTERN_GOVERNANCE.md` → "Hierarchy is a render check").

Avoid:
- Stacking multiple large headlines
- Two headings competing for the focal point
- Excessive bolding
- Cramped text layouts

---

## Metadata Rules

Metadata text (timing, question counts, past-paper years):
- Use `TYPE.metadata`
- Uppercase is permitted here — metadata is short scanning data, and caps aid legibility
- Lower opacity than body text
- Should feel subtle — supporting hierarchy, not drawing focus

---

## Label case

All UI labels and kickers must be **sentence case** (capitalise only the first word and proper nouns). This includes section labels, kickers, status labels, category labels, and any small label above or beside a heading.

**The eyebrow pattern is prohibited.** An "eyebrow" is a small uppercase, letter-spaced label placed above a heading as a category or section marker. Do not add new eyebrows. Remove existing eyebrows whenever a component is next touched.

`TYPE.eyebrow` is deprecated — use `TYPE.label` instead. The token is kept for backward compatibility only; do not spread it in new code.

**Rules:**
- **No decorative uppercase.** `textTransform: 'uppercase'` and hand-typed ALL-CAPS are forbidden for headings and for key-point / callout labels. Uppercase is a data-scanning device, not an emphasis device — use weight, size, colour or space to emphasise.
- Uppercase remains permitted **only** for short scanning data where caps genuinely aid legibility: nav/tab labels, single-word metadata chips, axis or diagram labels, clock/timer displays.
- Everything else is sentence case (see CLAUDE.md — capitalise only the first word and proper nouns).

When next editing a component that uses `TYPE.eyebrow` or `cinematic-eyebrow`, replace with `TYPE.label` and remove any `textTransform: 'uppercase'` alongside it.

---

## Manrope display rules

Manrope (the four `display*` tokens) carries emotional and cinematic weight.

Use for:
- Screen-level headings and emotional reveals
- Topic titles in recovery/reveal screens
- Chapter moments and impact statements
- Overlay titles

Do not use for:
- Body copy
- UI labels or navigation
- Buttons or form elements

---

## Text Density Rules

- Avoid overfilled screens
- Respect breathing room between text elements
- Keep body paragraphs short — guide, don't lecture
- Whitespace is part of typography

The learner should feel guided, relaxed, and able to continue — not confronted by a wall of text.
