# Spacing System

**Version:** v1 — Locked Foundation Layer  
**Source file:** `src/constants/spacing.js`

---

## Purpose

Enforces visual rhythm, cinematic pacing, and premium feel across all screens. Every margin, padding, and gap should use one of these tokens — no invented magic numbers.

---

## Tokens

```js
import { SPACING } from '../../constants/spacing.js'
```

| Token | Value | Usage |
|-------|-------|-------|
| `SPACING.micro` | `8px` | Icon gaps, tight internal padding, small component gaps |
| `SPACING.compact` | `16px` | Card padding, stacked item gaps, safe-area minimums |
| `SPACING.standard` | `24px` | Screen horizontal padding, section gaps, standard margins |
| `SPACING.separation` | `42px` | Breathing room between major content blocks |
| `SPACING.cinematic` | `72px` | Dramatic vertical spacing, hero areas, progress bar clearance |
| `SPACING.section` | `96px` | Top-of-screen breathing, major section divisions |

---

## Rules

- Never invent spacing values like `marginTop: 67` or `padding: 13`
- Use the closest token — don't split the difference
- Screen horizontal padding is always `SPACING.standard` (24px)
- Content separation between major areas is `SPACING.cinematic` (72px) or `SPACING.separation` (42px)
- `SPACING.micro` and `SPACING.compact` are for internal component gaps, not screen-level rhythm

---

## Usage Examples

```js
// Screen horizontal padding
paddingLeft: SPACING.standard,
paddingRight: SPACING.standard,

// Space below progress bar before content
marginBottom: SPACING.cinematic,

// Space between content blocks
marginBottom: SPACING.separation,

// Tight internal gap between label and value
gap: SPACING.micro,
```

---

## What Not to Do

```js
// Wrong — magic numbers
marginTop: 72
paddingBottom: 42
gap: 8

// Right — tokens
marginTop: SPACING.cinematic
paddingBottom: SPACING.separation
gap: SPACING.micro
```

---

## Note on Safe Areas

Safe-area padding is handled by ScreenShell, not spacing tokens. Do not use SPACING tokens to approximate device insets. Use CSS `env()`:

```js
paddingTop: 'max(18px, env(safe-area-inset-top))',
paddingBottom: 'max(34px, env(safe-area-inset-bottom))',
```
