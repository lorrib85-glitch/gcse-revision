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
