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
| `MOTION.duration.settle` | `1400ms` | Slow artwork or atmosphere settling into its resting state |
| `MOTION.duration.atmospheric` | `12000ms` | Ambient/looping atmosphere (background breathing, subtle parallax) |

### Stagger cadence

| Token | Value | Usage |
|-------|-------|-------|
| `MOTION.stagger.standardMs` | `120` | Calm sequential reveals and compact completion ladders |
| `MOTION.stagger.cinematicMs` | `180` | More spacious dramatic reveal sequences |

Stagger tokens are numeric milliseconds so components can derive deliberate step delays without creating one-off local ladders.

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
- Use `MOTION.stagger.*Ms` to derive reveal sequences rather than maintaining bespoke timing ladders

---

## Reduced-motion baseline

`src/globals.css` provides the mandatory app-level safety net for both the production app and Component Lab. Under `prefers-reduced-motion: reduce`, animation and transition delays are removed and durations settle in `0.01ms`.

This uses near-instant durations rather than `animation: none`, because some reveal components depend on animation fill states to finish visible. The baseline therefore removes perceptible movement while still allowing elements to land in their intended final state.

Component-level handling is still required when motion is driven by JavaScript or media rather than CSS. Examples include autoplay video, `requestAnimationFrame`, timers that deliberately step through motion states, or gesture logic that triggers a spring/fly-off sequence. Those branches must show a static final state or provide an equivalent non-motion interaction.

---

## Reduced-motion ownership

There are exactly **four** permitted mechanisms. Anything else is a defect.

| Mechanism | What it is | When to use it |
|---|---|---|
| **CSS safety net** | Global and component-local `@media (prefers-reduced-motion: reduce)` rules | Always. Independent of JavaScript, so it keeps working when JS is slow, failed or disabled |
| **Canonical React preference** | `usePrefersReducedMotion` (`src/hooks/usePrefersReducedMotion.js`) | The single app-owned reactive JS source. Default for any component whose motion is driven by JS |
| **Third-party delegated hook** | `useReducedMotion` from `motion/react` | Allowed **inside components already built on Motion** (`TimelineCanvas`, `TimelineChain`, `FactorWeb`). It is reactive and correct on first render — do not swap it out just to make every import name match, and do not add Motion to a component that does not already use it |
| **One-shot synchronous read** | `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, read once | Only for genuinely one-time behaviour: a single celebration, one counter animation, one gesture response, one scroll-into-view. **Must be registered with a reason** in `APPROVED_ONE_SHOT_READERS` in `tests/architecture/reduced-motion-boundary.test.js` |

**A private reactive hook is forbidden.** No component may own its own
`matchMedia` + `change` subscription. `tests/architecture/reduced-motion-boundary.test.js`
fails the build if one appears, if a file re-declares `usePrefersReducedMotion`
or `useReducedMotion`, or if a new direct reader shows up unclassified.

### The rules that follow from this

- **The device preference is honoured from the first render.** The canonical
  hook reads `matchMedia` in a lazy state initialiser, so a learner who already
  asked for reduced motion never gets a frame of animation before an effect
  corrects it. Any state that *drives* an entrance must be seeded from the
  preference too — seeding it to the hidden/animated start value and fixing it
  up in an effect reintroduces the same false first frame one level down.
- **Reduced motion does not mean "remove all visual personality."** Colour,
  depth, imagery, typography and atmosphere all stay. What goes is perceptible
  movement.
- **Meaningful content and functional feedback remain.** Nothing is dropped from
  the screen, the reading order is unchanged, and every interaction stays
  reachable.
- **Transforms, autoplay-like animation and delayed staged reveals need an
  equivalent calm path** — the final state, present immediately, in the same
  order. Not a redesigned interaction.
- **CSS rules stay even where JavaScript handling exists.** The two layers are
  independent fallbacks, not duplicates. Never delete a component's
  `@media (prefers-reduced-motion: reduce)` block because a hook covers the same
  case.
- **Timed automatic content replacement is sequencing, not motion.** Advancing
  through a set of images on a timer is a separate product question from whether
  those images animate in. Suppress the animation; do not silently redesign the
  sequence.

---

## Key-point reveal

A screen's final key-point / payoff box (the callout that lands the takeaway) **always reveals gradually** — a deliberate fade-and-rise, timed to arrive slightly after the surrounding content, so the point registers as a moment rather than being present from first paint.

- Never render the payoff box statically alongside the rest of the screen.
- Use `MOTION.easing.gentle` and an entrance that moves the box **toward** the reader (translateY from below), consistent with the Cinematic Animation Principles below.
- This is one deliberate reveal, not a cascade — do not stack several different ideas onto one timer (that reads as clutter). One payoff, one reveal.
- Respect `prefers-reduced-motion`: reduced motion shows the final state immediately with no transform, but the box still comes last in reading order.

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
