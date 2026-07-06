# Typography System

**Version:** v1 — Locked Foundation Layer  
**Source file:** `src/constants/typography.js`

---

## Purpose

Defines all typography behaviour across the product. Maintains visual hierarchy, emotional consistency, and cinematic pacing. Prevents font drift and readability degradation.

Typography should feel: **cinematic, calm, intelligent, mature, immersive, premium**.

Typography should NOT feel: corporate, productivity-app-like, overly decorative, playful, cluttered, generic educational software.

---

## Font Families

| Font | Usage |
|------|-------|
| **Manrope** | Cinematic display type — headings, titles, impact moments, `TYPE.cinematic` |
| **Sora** | All other UI text — body copy, buttons, labels, navigation, metadata, captions |

Both fonts are loaded via Google Fonts in `index.html`.

**Rules:**
- Never introduce a third font family
- Manrope is for display hierarchy and emotional weight — not body copy or fine-print labels
- Sora handles everything else; it is the dominant font by character count across the product

---

## TYPE Tokens

```js
import { TYPE } from '../../constants/typography.js'
```

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| `TYPE.screenHeading` | Manrope | clamp(30px,8vw,42px) | 800 | 1.02 | -0.045em | Chapter hooks, recovery titles, screen-level impact |
| `TYPE.sectionHeading` | Manrope | clamp(22px,6vw,30px) | 700 | 1.08 | -0.035em | Section headings, module titles |
| `TYPE.impactTitle` | Manrope | clamp(28px,8vw,36px) | 850 | 1.04 | -0.045em | Maximum-weight display moments |
| `TYPE.cinematic` | Manrope | clamp(24px,6.4vw,30px) | 750 | 1.08 | -0.035em | Topic titles, overlay titles, cinematic reveals |
| `TYPE.cardTitle` | Manrope | 1.12rem | 700 | 1.18 | -0.02em | Card titles, prominent labels |
| `TYPE.bodyText` | Sora | 0.95rem | 400 | 1.5 | -0.005em | Explanation copy, reading content |
| `TYPE.bodyLarge` | Sora | 1.02rem | 400 | 1.48 | -0.006em | Larger body passages |
| `TYPE.buttonText` | Sora | 0.92rem | 700 | 1.2 | -0.005em | All button labels |
| `TYPE.metadataText` | Sora | 0.72rem | 600 | 1.2 | 0.10em | Timing, question counts, progress labels |
| `TYPE.captionText` | Sora | 0.78rem | 400 | 1.35 | -0.003em | Captions, timestamps, fine print |

Aliases retained for backwards compatibility: `TYPE.hero` = `TYPE.screenHeading`, `TYPE.sectionTitle` = `TYPE.sectionHeading`, `TYPE.body` = `TYPE.bodyText`, `TYPE.bodySmall` = `TYPE.bodySmallText`, `TYPE.metadata` = `TYPE.metadataText`.

---

## Usage Examples

```js
// Hero heading
<h1 style={{
  ...TYPE.hero,
  color: 'rgba(245,245,245,0.96)',
  margin: 0,
}}>
  Quick recovery?
</h1>

// Topic title (cinematic serif)
<h2 style={{
  ...TYPE.cinematic,
  color: 'rgba(245,245,245,0.96)',
  margin: 0, marginBottom: 28,
}}>
  {block.title}
</h2>

// Explanation body copy
<p style={{
  ...TYPE.body,
  color: 'rgba(245,245,245,0.68)',
  maxWidth: 310,
  margin: '0 auto',
}}>
  {block.explanation}
</p>

// Metadata label (uppercase treatment)
<div style={{
  ...TYPE.metadata,
  textTransform: 'uppercase',
  color: accent,
  opacity: 0.90,
}}>
  3 QUESTIONS • UNDER 90 SECONDS
</div>
```

---

## Hierarchy Rules

Each screen should have:
- **One dominant text element** — usually `TYPE.hero` or `TYPE.cinematic`
- **One supporting hierarchy** — `TYPE.body` or `TYPE.cardTitle`
- **Clear breathing room** between levels

Avoid:
- Stacking multiple large headlines
- Too many competing text sizes
- Excessive bolding
- Cramped text layouts

---

## Metadata Rules

Metadata text (timing, question counts, past-paper years):
- Use `TYPE.metadata`
- Uppercase is permitted here — metadata is short scanning data, and caps aid legibility (see Eyebrows and label case below)
- Lower opacity than body text
- Should feel subtle — supporting hierarchy, not drawing focus

---

## Eyebrows and label case

An "eyebrow" is a small label sitting above a heading. Eyebrows are decorative by default and must earn their place.

**Rules:**
- **No eyebrow that merely restates or categorises the heading below it.** "WORKED EXAMPLE" above a worked example, or "GALEN'S LOGIC" above a Galen screen, adds nothing the reader can't already see — remove it. If the eyebrow does not carry information the heading lacks, it should not exist.
- Use an eyebrow **only when the label genuinely adds content** the reader needs and cannot infer — a live status, a position ("Question 3 of 5"), a source ("Past paper: 2019"), a category that disambiguates.
- **No decorative uppercase.** `textTransform: 'uppercase'` and hand-typed ALL-CAPS are forbidden for headings and for key-point / callout labels. Uppercase is a data-scanning device, not an emphasis or drama device — reach for weight, size, colour or space to emphasise instead.
- Uppercase remains permitted **only** for short scanning labels and data where caps genuinely aid legibility: nav/tab labels, single-word metadata chips, axis or diagram labels.
- Everything else is sentence case (see CLAUDE.md — capitalise only the first word and proper nouns).

Applies to all new work. Existing components migrate to these rules when next touched — not in a single mass change.

---

## Manrope display rules

Manrope (`TYPE.cinematic`, `TYPE.screenHeading`, `TYPE.impactTitle`) carries emotional and cinematic weight.

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
