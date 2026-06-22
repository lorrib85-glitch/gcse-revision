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

Metadata text (timing, labels, question counts):
- Use `TYPE.metadata`
- Often paired with `textTransform: 'uppercase'`
- Lower opacity than body text
- Should feel subtle — supporting hierarchy, not drawing focus

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
