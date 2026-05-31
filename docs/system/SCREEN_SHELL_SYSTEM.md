# Screen Shell System

**Version:** v1 — Locked Foundation Layer  
**Source files:** `src/components/layout/ScreenShell.jsx` + `src/components/layout/LearningScreenShell.jsx`

---

## Purpose

Defines the canonical screen structure for the product. Every major screen should sit inside a consistent shell.

Without shells, each screen invents its own wrapper logic — leading to inconsistent safe-area padding, different max widths, inconsistent background layering, and layout drift.

The shell is invisible when done well. Users should not notice it. But they should feel: consistency, calmness, premium structure, cinematic spacing, reliable navigation rhythm.

---

## ScreenShell

**File:** `src/components/layout/ScreenShell.jsx`

Base wrapper for full-screen mobile views.

### Responsibilities

- `position: fixed, inset: 0` full-screen container
- Base background colour from `SUBJECTS[subject].background`
- Optional atmospheric background image
- Optional overlay from `SUBJECTS[subject].overlay`
- Safe-area padding: `max(18px, env(safe-area-inset-top))` / `max(34px, env(safe-area-inset-bottom))`
- Max content width: `420px`, horizontally centred
- Horizontal padding: `SPACING.standard` (24px)
- Optional scroll behaviour

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | — | Screen content |
| `subject` | string | — | Subject name for theme resolution |
| `background` | string | — | Override subject background colour |
| `backgroundImage` | string | — | Atmospheric image URL |
| `backgroundPosition` | string | `'center'` | CSS background-position |
| `backgroundOpacity` | number | `0.13` | Atmospheric image opacity (8–18% recommended) |
| `backgroundFilter` | string | — | CSS filter on background image |
| `overlay` | bool | `true` | Apply subject overlay over background |
| `scroll` | bool | `true` | Enable scrollable content zone |
| `centreContent` | bool | `false` | Vertically centre content (for completion/reveal screens) |
| `className` | string | — | Additional CSS class on outer container |
| `style` | object | — | Additional inline styles on outer container |

### Usage

```jsx
import ScreenShell from '../layout/ScreenShell.jsx'

<ScreenShell
  subject="History"
  backgroundImage="/headers/history-medicine-through-time.png"
  backgroundPosition="left center"
  backgroundOpacity={0.11}
  backgroundFilter="brightness(0.6)"
  overlay={false}
  style={{ animation: 'fade-in 360ms ease both' }}
>
  {/* Screen content */}
</ScreenShell>
```

### Background Layering Order

1. Base colour (from `SUBJECTS[subject].background` or `background` prop)
2. Optional atmospheric image (z-index 0)
3. Optional overlay (z-index 1)
4. Content zone (z-index 2)

---

## LearningScreenShell

**File:** `src/components/layout/LearningScreenShell.jsx`

Extends ScreenShell for learning module screens. Adds a header area with title, progress bar, and step count above the content zone.

### Responsibilities

- Everything ScreenShell handles
- Progress bar display at the top of content
- Title and subtitle placement
- Consistent content top offset for learning screens

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | — | Screen content below header |
| `subject` | string | — | Subject name for theme resolution |
| `title` | string | — | Screen title (displayed in header) |
| `subtitle` | string | — | Supporting subtitle |
| `progress` | number | — | Progress value 0–1 for progress bar |
| `currentStep` | number | — | Current step number (displayed as `n / total`) |
| `totalSteps` | number | — | Total step count |
| `backgroundImage` | string | — | Atmospheric image URL |
| `showHeader` | bool | `true` | Show/hide header area |
| `scroll` | bool | `true` | Enable scrollable content zone |
| `className` | string | — | Additional CSS class |
| `style` | object | — | Additional inline styles |

### Usage

```jsx
import LearningScreenShell from '../layout/LearningScreenShell.jsx'

<LearningScreenShell
  subject="Biology"
  title="Disease & Immunity"
  progress={0.6}
  currentStep={6}
  totalSteps={10}
  backgroundImage="/headers/bio-diseasewars.png"
>
  {/* Learning screen content */}
</LearningScreenShell>
```

---

## What Shells Must Not Do

- Decide what component appears
- Sequence module screens
- Calculate progress
- Own answer state
- Handle learning flow logic

Shells are structural primitives — they provide consistent housing, not behaviour.

---

## Migration Strategy

Apply shells gradually — one screen at a time, verify visual output before continuing.

**Good first candidates:**
- `WeakSpotRecovery`
- `ChapterHookScreen`
- `ChapterCompleteScreen`

**Avoid initially:**
- Heavily nested ModulePlayer internals
- Old inline App.jsx flows
- Fragile locked components

---

## Anti-Patterns Shells Prevent

- Every screen defining its own full-screen wrapper
- Inconsistent safe-area padding
- Random max widths
- Inconsistent background overlays
- Cropped mobile screens
- Content pushed too low by accident
