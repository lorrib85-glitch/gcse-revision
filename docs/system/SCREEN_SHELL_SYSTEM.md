# Screen Shell System

**Version:** v2  
**Source files:** `src/components/layout/ContentShell.jsx`, `src/components/layout/InteractionShell.jsx`, `src/components/layout/CinematicShell.jsx`

---

## Purpose

Defines the canonical screen structure for all learning module screens. Shells are structural primitives that provide consistent safe-area handling, max-width centering, background layering, and top/bottom clearance. They own no behaviour, no state, and no sequencing logic.

---

## Decision rule

**Default to `ContentShell`.** Reach for `InteractionShell` when the screen contains an answer mechanic that needs to control its own scroll and fill available space. Only use `CinematicShell` when you have a specific written justification for why neither of the others can be used.

---

## ContentShell

**File:** `src/components/layout/ContentShell.jsx`  
**Use for:** Knowledge delivery screens — ConceptReveal, KeyFigureReveal, ExaminerExplainsScreen, VisualLearning, VisualNarrativeScreen, ExplainReveal, etc.

### Alignment guarantees

| Property | Value |
|----------|-------|
| Outer container | `position: fixed; inset: 0; overflow: hidden` |
| Max content width | `420px`, horizontally centred |
| Horizontal padding | `SPACING.compact` (16px) each side |
| Top clearance | `calc(80px + env(safe-area-inset-top, 0px))` — clears the fixed LearningHeader |
| Bottom clearance | `calc(96px + env(safe-area-inset-bottom, 0px))` — clears the fixed CTA bar |
| Content scroll | `overflow-y: auto` — content scrolls within the shell |
| Background | `SUBJECTS[subject].background` (dark base) |
| Atmospheric image | Ghosted at `backgroundOpacity` (default 0.13), z-index 0, pointer-events none |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `subject` | string | — | Subject name for theme lookup. Falls back to `History` if unrecognised. |
| `backgroundImage` | string \| null | `null` | Atmospheric image URL |
| `backgroundOpacity` | number | `0.13` | Opacity of atmospheric image layer |
| `backgroundPosition` | string | `'center'` | CSS background-position for atmospheric image |
| `children` | node | — | Screen content |

### Usage

```jsx
import ContentShell from '../layout/ContentShell.jsx'

<ContentShell
  subject="History"
  backgroundImage="/headers/history-medicine-through-time.png"
  backgroundOpacity={0.11}
  backgroundPosition="left center"
>
  <h2>Medieval beliefs about disease</h2>
  <p>Physicians in 1350 believed illness was caused by…</p>
</ContentShell>
```

---

## InteractionShell

**File:** `src/components/layout/InteractionShell.jsx`  
**Use for:** Screens where the learner must complete an interaction before advancing — MatchingTask, GuidedChoiceCarousel, QuickRecallScreen, MisconceptionCheck, ColSortBlock, SwipeSort, FillInTheBlanksBlock, etc.

### Alignment guarantees

| Property | Value |
|----------|-------|
| Outer container | `position: fixed; inset: 0; overflow: hidden` |
| Max content width | `420px`, horizontally centred |
| Horizontal padding | `SPACING.compact` (16px) each side |
| Top clearance | `calc(80px + env(safe-area-inset-top, 0px))` — clears the fixed LearningHeader |
| Bottom clearance | `env(safe-area-inset-bottom, 0px)` only — interaction surface manages its own spacing |
| Content overflow | `overflow: hidden` — inner area does not scroll; children control their own scroll |
| Flex layout | `display: flex; flex-direction: column` — children can use `flex: 1` to fill height |
| Background | Same as ContentShell |

Children that need full-bleed content (e.g. a carousel going edge-to-edge) should apply `marginLeft: -SPACING.compact` and `marginRight: -SPACING.compact` on their own element.

### Props

Same as ContentShell — `subject`, `backgroundImage`, `backgroundOpacity` (default `0.13`), `backgroundPosition` (default `'center'`), `children`.

### Usage

```jsx
import InteractionShell from '../layout/InteractionShell.jsx'

<InteractionShell subject="Biology" backgroundImage="/headers/bio-diseasewars.png">
  <MatchingTask
    pairs={pairs}
    onComplete={handleComplete}
  />
</InteractionShell>
```

---

## CinematicShell

**File:** `src/components/layout/CinematicShell.jsx`  
**Use for:** Full-bleed immersive screens that deliberately break standard chrome — CinematicRevealMoment, TimelineCanvas, ChapterHookScreen. Use only when ContentShell or InteractionShell would actively prevent the required visual treatment.

The component enforces one rule at the file level: **using it requires a written comment in the consuming component explaining why ContentShell or InteractionShell cannot be used.**

### Alignment guarantees

| Property | Value |
|----------|-------|
| Outer container | `position: fixed; inset: 0; overflow: hidden` |
| Everything else | Component's responsibility |

No background, no padding, no max-width, no safe-area handling is applied. The consuming component owns all of it.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | — | Full-bleed content |
| `style` | object | — | Top-level style overrides (e.g. background colour) |

### Usage

```jsx
// CinematicShell used here because this screen renders a full-bleed panning canvas
// that must reach all four edges; the 16px horizontal padding in ContentShell/InteractionShell
// would clip the swipe gesture area and break the connector rail alignment.
import CinematicShell from '../layout/CinematicShell.jsx'

<CinematicShell style={{ background: '#0A0806' }}>
  <TimelineCanvas events={events} onComplete={onComplete} />
</CinematicShell>
```

---

## What Shells Must Not Do

Shells are structural primitives. They must never:

- Decide what component appears on screen
- Sequence module screens
- Calculate or display progress
- Own answer state or interaction state
- Handle learning flow logic

If you find yourself adding conditional rendering or state to a shell, the logic belongs in `ModulePlayer.jsx` or the consuming component.
