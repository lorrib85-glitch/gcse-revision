# Product UI Constitution

**Version:** v1 — Supreme Design Law  
**Status:** Immutable. All other decisions defer to this document.

---

## Product Identity

This is a **premium cinematic learning platform** — not a school VLE, not a Duolingo clone, not a productivity app.

The experience should feel like something a smart 15-year-old would **choose** to open, not something they are forced to use.

**Reference point:** Apple TV, Spotify, Netflix — not DuoLingo, Google Classroom, or BBC Bitesize.

---

## Design Priority Order

When making any decision, apply this priority order:

1. Calm, legible, dark
2. Premium and intentional
3. Functional and clear
4. Subtly engaging (micro-animations only)

---

## What This Product Is Not

- Not a gamified reward system
- Not a productivity dashboard
- Not a cartoon edtech app
- Not a corporate learning portal
- Not a generic SaaS product

No mascots. No confetti. No pastel buttons. No "Amazing! You're a superstar!" copy.

---

## Global Layout Law

- **Max width:** `420px`, horizontally centred
- **Side padding:** `24px` (SPACING.standard) for screens
- **Layout:** Single scrollable vertical column — no sidebars, no grids, no multi-column
- **Mobile-first:** All screens designed for portrait mobile first
- **Safe areas:** Always account for `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`

---

## Global Colour Tokens

### Background Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#08090D` | Page / screen background |
| `bg-secondary` | `#101218` | Section backgrounds |
| `bg-card` | `#151720` | Standard cards |
| `bg-elevated` | `#1B1E27` | Elevated cards, modals |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#F5F7FF` | Headings, key copy |
| `text-secondary` | `#A89FC2` | Subheadings, labels |
| `text-muted` | `#5E5874` | Captions, timestamps, disabled |

### Status / Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-teal` | `#65E6C6` | Primary interactive accent, nav active |
| `correct` | `#4CAF7D` | Correct answer state |
| `incorrect` | `#E05A52` | Incorrect answer state |
| `weak-zone` | `#E0A84F` | Weak topics, amber highlight |

Subject accent colours are defined in `src/constants/subjects.js`. See `docs/system/SUBJECT_THEME_SYSTEM.md`.

---

## Typography Law

Two fonts only:

| Font | Source | Usage |
|------|--------|-------|
| **Sora** | Google Fonts | All headings, buttons, UI labels, navigation |
| **Cormorant Garamond** | Google Fonts | Cinematic editorial moments only — use sparingly |

Typography tokens are defined in `src/constants/typography.js`. See `docs/system/TYPOGRAPHY_SYSTEM.md`.

**Rules:**
- Never introduce a third font family
- No italic styling
- Section labels must be UPPERCASE
- Cormorant Garamond must not appear in body copy or UI labels

---

## Motion Law

- Duration range: `120ms` (instant) → `720ms` (cinematic)
- Easing: deceleration curves — never bounce, never spring physics
- Transforms used: `scale`, `translateY`, `opacity`
- Never: confetti, particle effects, arcade animations, overshoot easing

Motion tokens are defined in `src/constants/motion.js`. See `docs/system/MOTION_SYSTEM.md`.

---

## Imagery Law

All header and subject images must feel cinematic and editorial:

- Dark left side or dark region for text overlay
- Slightly desaturated — not hyper-vivid
- CSS filter: `brightness(0.65) grayscale(10%)`
- No stock-photo brightness, no white backgrounds, no illustrated/cartoon imagery
- Images should feel like film stills or documentary photography
- Always `.png` — never `.svg` for photos

---

## Copy Tone Law

- Direct, calm, intelligent
- Write as if to a smart 15-year-old who respects being treated like an adult
- No exclamation mark spam
- No patronising praise
- No cutesy error messages

**Correct:** "Something went wrong. Try again."  
**Incorrect:** "Oopsie! Something went wrong 😬"

**Correct:** "You've done 3 sessions this week."  
**Incorrect:** "Wow, 3 sessions! You're smashing it! Keep going superstar! 🎉"

---

## What Claude Must Never Improvise

- **No new colour palettes** — use tokens from Section 3 and `subjects.js` only
- **No new fonts** — Sora and Cormorant Garamond only
- **No playful or childish styling** — no bubbly buttons, no pastel fills, no emoji in UI
- **No new layout patterns** — single-column scroll, max-width 420px
- **No decorative gradients** — gradient use limited to: button fills, progress bars, atmospheric overlays
- **No unsanctioned motion** — no spring physics, no bounce, no confetti
- **No auto-invented component variants** — match the closest existing pattern

---

## The Final Build Principle

Before shipping any screen or component, ask:

> **Would a smart 15-year-old voluntarily open this on their phone after school?**

If the answer is "maybe, if they had to" — it needs more work.  
If the answer is "yes, this feels like a real product" — ship it.

The bar is: this should feel like it belongs in the App Store next to Spotify — not next to a school homework portal.
