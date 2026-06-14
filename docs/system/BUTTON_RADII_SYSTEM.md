# Button & Radius System

**Version:** v1 — Locked Foundation Layer  
**Source files:** `src/constants/buttons.js` + `src/constants/radii.js`

---

## Radius Tokens

```js
import { RADII } from '../../constants/radii.js'
```

| Token | Value | Usage |
|-------|-------|-------|
| `RADII.small` | `10px` | Small interactive elements, compact chips |
| `RADII.medium` | `16px` | Secondary buttons, input fields, tags |
| `RADII.large` | `22px` | Primary buttons, major interactive surfaces |
| `RADII.panel` | `26px` | Cards, panels, atmospheric containers |
| `RADII.pill` | `999px` | Progress bars, pills, tags, icon buttons |

### Rules

- Primary CTA buttons use `RADII.large` — never `RADII.pill` (prevents jellybean buttons)
- Progress bars and pill shapes always use `RADII.pill`
- Never invent random radii like `borderRadius: 23` or `borderRadius: 12`
- Panels and cards use `RADII.panel` or `RADII.large` — never sharp corners

---

## Button Tokens

```js
import { BUTTONS } from '../../constants/buttons.js'
```

### Primary Button

Height `74px` — the dominant CTA for any screen.

```js
BUTTONS.primary = {
  height: 74,
  borderRadius: RADII.large,   // 22px
  paddingX: 28,
  fontSize: 20,
  fontWeight: 600,
  arrowSize: 26,
  transition: '180ms ease',
  pressScale: 0.985,
}
```

### Secondary Button

Height `56px` — supporting action, second-level CTA.

```js
BUTTONS.secondary = {
  height: 56,
  borderRadius: RADII.medium,  // 16px
  paddingX: 24,
  fontSize: 17,
  fontWeight: 500,
  arrowSize: 22,
  transition: '180ms ease',
  pressScale: 0.985,
}
```

### Continue Button

Height `56px` — the **Primary Progression CTA**. See "Progression CTA System" below.

```js
BUTTONS.continue = {
  height: 56,
  borderRadius: RADII.large,  // 22px — unlike secondary's RADII.medium
  paddingX: 24,
  fontSize: 17,
  fontWeight: 600,
  transition: '180ms ease',
  pressScale: 0.985,
}
```

### Compact Button

Height `44px` — minimum tap target, contextual actions.

```js
BUTTONS.compact = {
  height: 44,
  borderRadius: RADII.small,   // 10px
  paddingX: 18,
  fontSize: 15,
  fontWeight: 500,
  arrowSize: 18,
  transition: '180ms ease',
  pressScale: 0.985,
}
```

### Text Button

No height or background — inline skip/secondary text action.

```js
BUTTONS.text = {
  fontSize: 16,
  fontWeight: 400,
  opacity: 0.46,
  transition: '180ms ease',
}
```

---

## Usage Examples

```js
// Primary CTA button
<button style={{
  width: '100%',
  height: BUTTONS.primary.height,
  borderRadius: BUTTONS.primary.borderRadius,
  padding: `0 ${BUTTONS.primary.paddingX}px`,
  fontSize: BUTTONS.primary.fontSize,
  fontWeight: BUTTONS.primary.fontWeight,
  background: accent,
  transform: isPressed ? `scale(${BUTTONS.primary.pressScale})` : 'scale(1)',
  transition: BUTTONS.primary.transition,
}}>

// Progress bar (always pill)
<div style={{ borderRadius: RADII.pill, overflow: 'hidden' }}>

// Icon button
<button style={{ borderRadius: RADII.pill, width: 44, height: 44 }}>
```

---

## Progression CTA System

**Locked.** Governs the control that advances the learner from one screen/chapter to the next. Exactly two patterns exist — never invent a third, and never use either pattern for anything other than screen-to-screen progression.

### 1. Primary Progression CTA (~90% of screens)

The default "Continue" button on in-flow learning screens.

```js
import { BUTTONS } from '../../constants/buttons.js'
import { SUBJECTS } from '../../constants/subjects.js'

const accent = SUBJECTS[subject].accent

<button style={{
  width: '100%',                          // sits within the screen's 24px side padding
  height: BUTTONS.continue.height,        // 56px
  borderRadius: BUTTONS.continue.borderRadius, // RADII.large (22px)
  background: accent,                     // subject accent — "gold" in History, teal in Biology, etc.
  color: '#0D0F14',                       // near-black, for contrast on accent fill
  fontFamily: "'Sora', sans-serif",
  fontSize: BUTTONS.continue.fontSize,
  fontWeight: BUTTONS.continue.fontWeight,
  border: 'none', cursor: 'pointer',
  transition: `transform ${BUTTONS.continue.transition}`,
}}>
  Continue
</button>
```

- Sits inside the screen's existing 24px side margins (`SPACING.standard`) — full width of that content column, no extra outer margin
- Fill is always the active subject's accent colour (`SUBJECTS[subject].accent`) — never a hardcoded "gold" or other hex
- Text is near-black (`#0D0F14`) for contrast against the accent fill
- Label is exactly **"Continue"** — no arrow icon, no arrow character

### 2. Cinematic Reveal CTA

Used only on full-screen cinematic "reveal moment" screens with no button chrome (e.g. `CinematicRevealMoment`, `CinematicCarousel`, `TimelineChain`, `TimelineCanvas`, `VisualNarrativeScreen`, `GuidedChoiceCarousel`).

```js
<span style={{
  fontFamily: "'Sora', sans-serif",
  fontWeight: 700, fontSize: 13,
  letterSpacing: '0.34em', textTransform: 'uppercase',
  color: accent,
}}>Continue&nbsp;&nbsp;→</span>
```

- No background, no border, no fill — plain text only
- Label is exactly **"Continue →"** (right arrow)
- Centred, quiet, appears once the reveal copy has finished animating in

### Forbidden labels

The only allowed progression labels are **"Continue"** (Primary CTA) and **"Continue →"** (Cinematic CTA). For the control whose job is to advance to the next screen/chapter, never use:

- "Next" / "Next →" / "Next example →"
- "Keep going"
- "Moving on"
- "Your turn →", "Start the question →", or any other situational synonym

A screen MAY have a separate interim action first (e.g. "Check answers", "Reveal next stage") that doesn't advance the screen — once the SAME or a follow-up control is ready to advance, ITS label must be exactly "Continue" / "Continue →".

### Not part of this system

`NavArrow` (the bare stroke-arrow icon used on Home/Pulse/Exams task and mode cards) means "open this item" — a destination link, not screen progression. It is a separate pattern and must not be substituted for, or confused with, either CTA above.

---

## Button Colour Rules

Button colours come from `src/constants/subjects.js` — never hardcoded locally.

```js
import { SUBJECTS } from '../../constants/subjects.js'
const accent = SUBJECTS[subject].accent
// background: accent (primary button fill)
```

---

## Rules

- All interactive elements must have a minimum tap target of `44×44px`
- Button press feedback must use `pressScale: 0.985` — never a larger press reduction
- Never use pill radius for primary CTAs — this is the jellybean anti-pattern
- Button heights are fixed per tier — do not resize buttons to taste
- All screen-to-screen progression controls must follow the Progression CTA System above — "Continue" (Primary CTA) or "Continue →" (Cinematic CTA) only, never "Next", "Keep going", "Moving on", or other synonyms
