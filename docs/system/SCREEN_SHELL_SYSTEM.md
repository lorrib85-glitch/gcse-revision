# Screen Shell System

**Version:** v2  
**Source files:** `src/components/layout/ContentShell.jsx`, `src/components/layout/InteractionShell.jsx`, `src/components/layout/CinematicShell.jsx`

---

## Purpose

Defines the canonical **structural** primitives for all learning module screens. Shells provide consistent safe-area handling, max-width centering, background layering, and top/bottom clearance. They own no behaviour, no state, and no sequencing logic.

Shells are only one of the two layers a screen is built from. This doc owns the **structural** layer; `PATTERN_GOVERNANCE.md` owns the **learning-composition** layer. The two are complementary, not competing (see "Two complementary layers" below).

---

## Two complementary layers

A screen is composed from two layers that must not be confused:

| Layer | Owns | Primitives |
|-------|------|------------|
| **Structural shell** | viewport behaviour, safe-area handling, scrolling, max-width, subject/background treatment, fixed-header clearance, fixed-CTA clearance | `ContentShell`, `InteractionShell`, `CinematicShell` |
| **Learning-composition route** | heading hierarchy, screen-title treatment, vertical rhythm, content sequence, interaction layout, feedback placement, the screen's dominant focal point | `TeachScreenShell` (Route A), approved interaction-owned components (Route B), approved cinematic/full-screen components (Route C) |

The structural shell does **not** decide the learning hierarchy of the screen; the composition route does. A `ContentShell` is a background and a safe-area frame — it is not, by itself, a teaching-screen composition.

**Do not merge these primitives, and do not create a new universal shell.** `ContentShell` and `TeachScreenShell` are deliberately separate: one is a structural frame, the other is a learning-composition route that renders *inside* such a frame.

The three learning-composition routes (A teaching / B interaction-owned / C cinematic) and the rule that every new screen must resolve to exactly one of them are defined in `docs/system/PATTERN_GOVERNANCE.md` → "Screen-composition routes". This doc covers only which structural shell each route sits in.

---

## Decision rule

The two defaults operate at different layers and do not conflict:

> **Default structural shell:** normally `ContentShell`, unless interaction or cinematic requirements justify another structural shell.
>
> **Default teaching composition:** `TeachScreenShell` (which itself sits inside `ContentShell`).

- Reach for **`InteractionShell`** as the structural shell for approved interaction-owned experiences (Route B) that need to control their own scroll and fill available space.
- Use **`CinematicShell`** only for approved cinematic/full-screen components (Route C), and only with a specific written justification for why `ContentShell` or `InteractionShell` cannot be used.

**`ContentShell` alone is not sufficient learning composition for a new teaching screen.** A new teaching or explanation screen must compose through `TeachScreenShell` (Route A) — which owns the heading (`TYPE.displayScreen`) and the vertical rhythm — rendered inside `ContentShell`. Dropping a raw `ScreenTitle` and hand-spaced `<div>`s straight into `ContentShell` bypasses the design system's rhythm and header token and fails governance.

---

## ContentShell

**File:** `src/components/layout/ContentShell.jsx`  
**Use for:** The structural frame for knowledge-delivery screens. A teaching or explanation screen composes through `TeachScreenShell` (Route A) *inside* this shell — `ContentShell` supplies the safe-area frame and background; `TeachScreenShell` supplies the heading token and rhythm. Approved cinematic knowledge-delivery components that own their own layout (ConceptReveal, KeyFigureReveal, ExaminerExplainsScreen, VisualLearning, ExplainReveal, and `TimelineChain` — including its `variant: 'reveal'`, which replaced the retired VisualNarrativeScreen) are Route C and may sit directly in this shell per their contracts.

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
