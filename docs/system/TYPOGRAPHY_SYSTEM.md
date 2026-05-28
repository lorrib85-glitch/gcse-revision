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
| **Sora** | All UI text — buttons, labels, navigation, metadata, headings, body copy |
| **Cormorant Garamond** | Cinematic editorial moments only — used sparingly |

Both fonts are loaded via Google Fonts in `index.html`.

**Rules:**
- Never introduce a third font family
- Cormorant Garamond must not be used for body copy or UI labels
- If overused, Cormorant Garamond makes the app feel theatrical and inconsistent

---

## TYPE Tokens

```js
import { TYPE } from '../../constants/typography.js'
```

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| `TYPE.hero` | Sora | 34px | 700 | 1.05 | -0.03em | Chapter hooks, recovery titles, cinematic reveals |
| `TYPE.sectionTitle` | Sora | 28px | 600 | 1.12 | -0.02em | Section headings, module titles |
| `TYPE.cardTitle` | Sora | 22px | 600 | 1.2 | -0.01em | Card titles, prominent labels |
| `TYPE.body` | Sora | 18px | 400 | 1.5 | 0em | Explanation copy, reading content |
| `TYPE.bodySmall` | Sora | 16px | 400 | 1.45 | 0em | Supporting copy, skip links, secondary text |
| `TYPE.metadata` | Sora | 14px | 500 | 1.3 | 0.08em | Timing, question counts, progress labels |
| `TYPE.cinematic` | Cormorant Garamond | 38px | 600 | 1.02 | -0.03em | Topic titles, emotional reveals, chapter moments |

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

## Cinematic Font Rules

Cormorant Garamond (`TYPE.cinematic`) should be used **very sparingly**.

Use for:
- Emotional reveals
- Historical drama
- Topic titles in recovery/reveal screens
- Chapter moments

Do not use for:
- Body copy
- UI labels
- Navigation
- Buttons

---

## Text Density Rules

- Avoid overfilled screens
- Respect breathing room between text elements
- Keep body paragraphs short — guide, don't lecture
- Whitespace is part of typography

The learner should feel guided, relaxed, and able to continue — not confronted by a wall of text.
