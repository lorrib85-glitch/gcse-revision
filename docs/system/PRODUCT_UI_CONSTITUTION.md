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

`correct`/`incorrect` are implemented in code as `GENERAL.feedbackCorrect` /
`GENERAL.feedbackIncorrect` (`src/constants/generalTheme.js`), alongside
`GENERAL.feedbackHint` (supportive/hint accent) and `GENERAL.feedbackText`
(feedback/hint body copy, matching `text-primary` above) — the canonical
answer-feedback token set shared by `AnswerInteraction` and
`UnifiedQuestionScreen`.

Subject accent colours are defined in `src/constants/subjects.js`. See `docs/system/SUBJECT_THEME_SYSTEM.md`.

---

## Typography Law

Two fonts only:

| Font | Source | Usage |
|------|--------|-------|
| **Manrope** | Google Fonts | Cinematic display type — headings, titles, impact moments |
| **Sora** | Google Fonts | All other UI text — body copy, buttons, labels, navigation, metadata |

Typography tokens are defined in `src/constants/typography.js`. See `docs/system/TYPOGRAPHY_SYSTEM.md`.

**Rules:**
- Never introduce a third font family
- No italic styling
- Labels and kickers must be sentence case (capitalise only the first word and proper nouns)
- The eyebrow pattern — small uppercase label placed above a heading — is prohibited. Remove any existing eyebrows when a component is next touched.
- Manrope must not appear in body copy, UI labels, or navigation

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

For image planning, reuse and asset creation decisions, defer to `docs/system/VISUAL_ASSET_SYSTEM.md`.

---

## Cinematic Learning Screen Treatment

This section defines the preferred treatment for **in-module learning screens**. It sharpens this constitution for the newer premium cinematic direction without replacing the existing layout, theme, motion or typography laws.

The goal is not to make screens more decorative. The goal is to make each learning moment feel calmer, more memorable and more worth opening.

### Core Treatment Principle

Every learning screen should feel like a focused scene, not a dashboard.

A tired but capable teenager should be able to understand the next action in **three seconds**.

If the screen asks the learner to read, choose, remember, analyse, navigate and interpret all at once, it is doing too much.

### One-Screen Rule

Each screen should have:

- one primary learning job
- one dominant visual, idea, question or decision
- one clear next action
- one quiet local progress signal, only when needed

Do not cram several teaching tasks into one screen. Sequence them instead.

Correct pattern:

1. create curiosity
2. reveal one idea
3. ask for one action
4. give feedback or insight
5. move on

Incorrect pattern:

- title
- long explanation
- image
- multiple cards
- several buttons
- extra labels
- progress
- hint
- exam tip
- summary
- secondary navigation

This produces compliance, not attention.

### Image-Led Learning Cards

Where a screen uses imagery, the image should carry learning weight.

Use images to:

- create curiosity before explanation
- make abstract ideas concrete
- anchor memory
- show a person, place, decision, process or consequence
- support an interaction that would be weaker without the image

Do not use images merely to break up text.

When used inside a card, the image should feel integrated:

- rounded with the card
- softly darkened at the bottom where text may sit
- large enough to become the focus
- not competing with multiple other images on the same screen

### Artefact Card Treatment

Cards should feel like premium learning artefacts, not dashboard widgets.

Preferred qualities:

- dark charcoal or near-black surface
- subtle subject-tinted border at low opacity
- soft depth, barely visible shadow
- generous internal padding
- one clear hierarchy
- restrained accent use

Avoid:

- stacked dashboard panels
- thick borders
- glassmorphism
- bright glowing edges
- lots of equal-weight cards
- coloured boxes used as hierarchy

A card should earn its container. If the content can breathe without a card, avoid adding one.

### Progressive Disclosure

Never show all explanation at once just because the data exists.

Prefer:

- short setup first
- detail on reveal
- one misconception at a time
- one exam tip at the point of need
- optional deeper layer after the learner acts

This follows `docs/system/LEARNING_EXPERIENCE_PRINCIPLES.md`: discovery, investigation and memorable insight beat information density.

### Subject Accent Use

Subject accent should signal meaning. It is not decoration.

Use accent for:

- selected state
- active local progress
- primary action
- tiny section label
- meaningful emphasis
- feedback state, where appropriate

Do not use accent for:

- every border
- every icon
- every heading
- every card
- decorative glow
- filling empty space

If everything glows, nothing matters.

### Local Progress

For local in-component progress, use `SequenceProgress` only.

Allowed:

- dots
- sash
- current / viewed / future state

Not allowed:

- visible local progress numbers
- percentages
- `2/5`
- "Step 3"
- labels beside progress dots
- one-off local `ProgressDots` implementations

The top module rail is separate and is not governed by this local progress rule.

### Teen-at-9pm Test

Before shipping any learning screen, ask:

> If a tired, distracted 15-year-old opened this at 9pm, would they know what to do next in three seconds?

If not, reduce the screen.

Remove before adding:

- remove labels before adding instructions
- hide detail before shrinking text
- split the task before adding more hierarchy
- use one strong visual before adding several supporting visuals

### Screen Treatment Checklist

Before refactoring or shipping an in-module screen, check:

- Is there one clear learning job?
- Is one thing visually dominant?
- Is the next action obvious?
- Can any text be hidden until reveal?
- Are there too many cards?
- Are there too many equal-weight buttons?
- Is the image doing learning work, not decoration?
- Is subject accent used as signal, not wallpaper?
- Is local progress quiet and number-free?
- Would a smart tired teenager know what to do next?

If three or more answers are weak, the screen needs recomposition before styling.

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
- **No new fonts** — Sora and Manrope only
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
