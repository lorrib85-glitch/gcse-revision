# Motion System

**Version:** v1 — Locked Foundation Layer  
**Source file:** `src/constants/motion.js`

---

## Purpose

Enforces cinematic consistency across all animations and transitions. Prevents motion drift — random timings and easings that make the app feel incoherent.

The product should feel: **cinematic, calm, restrained, premium**.  
Not: playful, hyperactive, gamified, arcade-like.

---

## Tokens

```js
import { MOTION } from '../../constants/motion.js'
```

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `MOTION.duration.instant` | `120ms` | Button press feedback, immediate state changes |
| `MOTION.duration.fast` | `180ms` | Hover states, micro-interactions, press transforms |
| `MOTION.duration.standard` | `280ms` | Most transitions, screen element appearances |
| `MOTION.duration.slow` | `420ms` | Page-level transitions, modal appearances |
| `MOTION.duration.cinematic` | `720ms` | Dramatic reveals, chapter hooks, emotional moments |
| `MOTION.duration.atmospheric` | `12000ms` | Ambient/looping atmosphere (background breathing, subtle parallax) |

### Easings

| Token | Value | Usage |
|-------|-------|-------|
| `MOTION.easing.standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | Primary easing — deceleration into rest |
| `MOTION.easing.gentle` | `ease-out` | Subtle transitions, element appearances |
| `MOTION.easing.linear` | `linear` | Progress bars, opacity fades, looping animations |

### Scale

| Token | Value | Usage |
|-------|-------|-------|
| `MOTION.scale.press` | `0.985` | Button press — subtle physical feedback |
| `MOTION.scale.subtle` | `1.015` | Hover lift — restrained, not bouncy |

---

## Rules

- Use `MOTION.duration.*` for all transition durations — never hardcode `'200ms'` or `0.3s`
- Use `MOTION.easing.standard` as the default easing for most transitions
- `MOTION.easing.gentle` for element entrances and subtle state changes
- Press feedback should always use `MOTION.scale.press` — never `0.97` or `0.96`
- Hover lift should always use `MOTION.scale.subtle` — never `1.02` or `1.03`

---

## Usage Examples

```js
// Button press animation
transform: isPressed ? `scale(${MOTION.scale.press})` : 'scale(1)',
transition: `transform ${MOTION.duration.fast} ${MOTION.easing.gentle}`,

// Element entrance
animation: `fade-in ${MOTION.duration.standard} ${MOTION.easing.standard} both`,

// Atmospheric overlay
animation: `breathe ${MOTION.duration.atmospheric} ${MOTION.easing.linear} infinite`,

// Progress bar fill
transition: `width ${MOTION.duration.slow} ${MOTION.easing.gentle}`,
```

---

## What Is Forbidden

- **Bounce or spring physics** — no `cubic-bezier(0.34, 1.56, 0.64, 1)` overshoot
- **Confetti or particle effects** — ever
- **Arcade animations** — flashing, rapid pulsing, score counters spinning
- **Excessive hover motion** — `scale(1.05)` is too much
- **Hyperactive transitions** — multiple simultaneous heavy transforms

---

## Cinematic Animation Principles

Animations should guide attention, not compete for it. The learner should barely notice individual transitions — but they should feel the cumulative effect of calm, intentional movement.

Entrance animations should move content **toward** the reader (translateY from below). Exit animations should move content **away** (opacity fade, optional translateY upward).
