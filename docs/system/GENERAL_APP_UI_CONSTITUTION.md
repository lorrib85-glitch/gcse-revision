# General App UI Constitution (Non-Subject Pages)

**Version:** v1
**Scope:** Non-subject pages only — Home, the Subjects/Modules browser (list and
grid level, not in-module content), Progress, Exam landing/navigation,
onboarding, and the bottom navigation shell. In-module subject content
remains governed by `PRODUCT_UI_CONSTITUTION.md` and `SUBJECT_THEME_SYSTEM.md`.

---

## Core Design Philosophy

This product should never feel like a typical education app.

The visual language should sit somewhere between Apple, PlayStation,
Letterboxd, COS and a beautifully designed indie game. It should feel
premium, calm and intelligently restrained rather than playful or heavily
gamified.

The emotional goal is:

> "I know exactly what to do next."

Every design decision should reduce friction and decision fatigue.

---

## Overall Feel

- Mobile-first always
- Calm, spacious layouts
- Cinematic rather than dashboard-like
- Editorial rather than corporate
- Premium rather than gamified
- Confident rather than decorative
- Atmospheric rather than busy

The interface should feel like it has been designed by people who are
comfortable leaving empty space.

---

## Visual Language

### Background

Deep charcoal / near black. Avoid gradients unless extremely subtle.

Texture may include:

- subtle grain
- soft vignette
- barely perceptible light bloom

Never obvious.

### Colour Palette

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Primary interface colour | `teal` | `#2A9D8F` | Progress, active states, key action and selected items |
| Dark anchor | `darkTeal` | `#264653` | Surfaces, navigation and deep background elements |
| Primary text | `softWhite` | `#F1FAEE` | Primary text, headings and high-emphasis content |
| Muted support | `slate` | `#A8B0B3` | Secondary text, icons and disabled states |
| Rare warm accent | `coral` | `#E76F51` | Streaks, highlights and important alerts only |

### Neutral Scale

| Token | Hex |
|-------|-----|
| `neutral.900` | `#0D0F10` |
| `neutral.800` | `#14181A` |
| `neutral.700` | `#1B2124` |
| `neutral.600` | `#232A2E` |
| `neutral.500` | `#2B3337` |
| `neutral.400` | `#3A4246` |
| `neutral.300` | `#5A6367` |
| `neutral.200` | `#A8B0B3` |

The older `neutral.0` to `neutral.4` aliases remain available in code for backwards compatibility, but new work should use the 900–200 scale.

Coral should be used sparingly. It should feel like an event, not part of the
interface.

**Good uses:** streak flame, tiny highlights, selected emphasis, rare
notifications.

**Not:** every button, every progress bar, every card, every icon.

---

## Typography

Typography should carry hierarchy instead of coloured boxes.

- **Large headlines:** elegant serif, oversized, generous spacing, dramatic
  — e.g. "Keep going."
- **Body:** clean modern sans-serif
- **Tiny labels:** uppercase, high letter spacing, low contrast

Avoid excessive font weights.

---

## White Space

Err on the side of too much. Every screen should breathe.

If in doubt: remove something. Do not attempt to fill empty areas.

---

## Cards

Default behaviour: no obvious card. Prefer composition over containers.

When containers are required:

- almost invisible
- extremely subtle border
- barely lifted
- minimal radius
- no glow

**Avoid:** thick outlines, glassmorphism, neon borders, floating dashboard
cards.

---

## Shadows

Soft. Diffuse. Invisible rather than visible.

No hard shadows. No glowing effects around components.

---

## Borders

Use only where necessary. When used: 1px, very low opacity. Should almost
disappear.

---

## Buttons

Buttons should not dominate. Avoid oversized colourful pills.

The primary CTA should often feel like typography with intent rather than a
giant button.

**Example:** `▶ Continue` instead of `[ CONTINUE ]`

---

## Icons

Icons should be restrained. Thin stroke. Elegant.

No chunky filled icons. No cartoon styling.

Icons should support content rather than become decoration.

---

## Navigation

Bottom navigation should feel understated.

- Inactive: low contrast grey
- Active: muted teal only
- No glowing active pill
- No oversized floating centre button
- No neon

The selected state should feel quietly confident.

---

## Motion

Everything should move slowly.

- Transitions: soft, organic, premium
- Avoid: bounce, overshoot, flash, arcade effects

Motion should resemble Apple UI rather than Duolingo.

---

## Imagery

Imagery is the luxury element.

Use: cinematic lighting, strong atmosphere, depth, texture, realism,
restrained colour.

Images should carry emotion so the UI doesn't have to.

---

## Copy Style

Minimal. Never verbose. Assume impatient users.

**Prefer:** "Continue" rather than "Continue your current learning journey"

**Prefer:** "Biggest Win" rather than "Recommended revision opportunity"

Keep language human.

---

## Personalisation

The app should feel like it knows the student.

**Prefer:**

```
Black Death
4 of your last 6 answers were incorrect.
Revisit →
```

**Instead of:**

```
Weak Area
History
Review →
```

**Even better:**

```
William Harvey
Not revised for 18 days.
Revisit →
```

```
Medicine Through Time
Estimated +4 marks.
Revisit →
```

Recommendations should feel intelligent, specific and adaptive.

---

## Layout Philosophy

Every page should answer: **What should I do next?**

The answer should be immediately obvious.

- One primary action
- One secondary recommendation
- Everything else fades into the background

---

## Things To Avoid

NEVER introduce:

- generic AI app styling
- purple/cyan neon
- dashboard aesthetics
- excessive rounded rectangles
- glowing borders
- floating glass cards
- random gradients
- visual clutter
- badges everywhere
- unnecessary labels
- oversized statistics
- cartoon gamification
- excessive icons
- thick outlines
- heavy drop shadows

---

## Design Test

Before shipping any page, ask:

- Could 30% of the UI be removed?
- Does the imagery do the emotional work?
- Is there a single obvious next action?
- Does this feel closer to Apple than Duolingo?
- Does this feel like a premium product rather than an education app?
- Is every coloured element genuinely earning its place?
- Is there enough breathing room?
- Would this still look beautiful if printed in a magazine?

If the answer to any of these is "no", simplify further.
