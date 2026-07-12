# Contract — TeachScreenShell

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Component:** `src/components/core/TeachScreenShell.jsx` · intent: *compose a
teaching screen* · not a display block type — a composition primitive.

**Composition classification:** `composition-route` — this component *is*
Route A (the default teaching/explanation composition route), not a component
rendered inside a route. It owns the screen heading and vertical rhythm for
teaching screens. See `PATTERN_GOVERNANCE.md` → "Screen-composition routes".

## 1. Purpose

Compose a teaching screen with the approved vertical rhythm so spacing stops
being a per-session judgement call. One screen, one heading, one job.

This is the **default learning-composition route for new teaching and
explanation screens** (Route A). It is responsible for the standard
teaching-screen heading (`TYPE.displayScreen`), the approved vertical rhythm,
and the fixed order of heading → intro → teaching body → optional key point.
It is **mandatory** where the screen's primary purpose matches this contract —
not optional, and not substitutable with a generic shell plus a local
`ScreenTitle`.

## 2. When to use

Any screen whose primary intent is to teach or explain a concept: a heading,
an optional framing line, a teaching body (often a reserved visual), and at
most one key point.

## 3. When NOT to use

`TeachScreenShell` is a composition primitive, not a universal screen
wrapper. Do not broaden it to wrap everything. It must not wrap:

- **Cinematic reveal moments** (`VisualLearning`, `CinematicRevealMoment`,
  `ExaminerExplainsScreen`) and other approved cinematic/full-screen (Route C)
  experiences — those own a full-bleed layout; don't wrap them.
- **Assessed interactions that own their own layout** (`theoryLab`,
  `matchingTask`, `interactiveImage`, quiz screens) and any other Route B
  interaction engine that explicitly owns its screen — the shell composes a
  teach screen, it does not host an interaction engine.
- **Another screen shell** (`ContentShell`/`InteractionShell`/`CinematicShell`)
  or a full-screen stage — `TeachScreenShell` renders *inside* `ContentShell`;
  it never wraps a shell.
- **Another `TeachScreenShell`** — never nest it inside itself.

A small interaction embedded within a teaching screen (an inline `choice` /
`truefalse` block) stays a content component inside this shell; it does not
turn the screen into a Route B interaction-owned screen.

## 4. Required structure

Slots render in this fixed order; every one except `heading` is optional:

`eyebrow` → `heading` → `intro` → `children` (teaching body) → `keyPoint`

- `heading` (required) — the screen's single teaching heading, sentence case.
- `eyebrow` — only if it passes the eyebrow rule (adds information the
  heading lacks); rendered sentence case, never uppercase.
- `children` — the teaching body. **At most one visual** (one
  `MediaPlaceholder`). More than one visual means the screen is doing more
  than one job — split it.
- `keyPoint` — at most one, rendered last (a `KeyPoint`).

Enforces one-job-per-screen: if the screen needs two headings or two key
points, it is two screens.

## 5. Token rules

- All inter-slot spacing from `SPACING`. Page padding is
  `SPACING.standard` top / horizontal and `SPACING.cinematic` bottom, because
  the parent `ContentShell` already clears the fixed learning header.
- Heading ↔ intro spacing is `SPACING.standard`. This creates a clearer
  heading/paragraph rhythm without pushing the teaching body too far down.
- Body and keyPoint are separated by `SPACING.separation`.
- Type from `TYPE` (`TYPE.displayScreen` heading, `TYPE.body` intro,
  `TYPE.label` eyebrow). Accent from `SUBJECTS[subject]`.
- No raw px values for layout rhythm or type overrides.

## 6. Motion rules

- Slots enter toward the reader (`tss-rise`: fade + translateY from below),
  lightly staggered, using `MOTION.duration.slow` / `MOTION.easing.standard`.
- The `keyPoint` slot reveals **gradually and last** (delayed fade-and-rise,
  `MOTION.easing.gentle`) per `MOTION_SYSTEM.md` → Key-point reveal.
- `prefers-reduced-motion`: no animation; final state shown, keyPoint still
  last in reading order.

## 7. Gold example

`TeachScreenShell.stories.jsx` → **Gold — Galen teach screen**: heading
"Every illness had an opposite" (no eyebrow — the heading carries the point)
→ intro → a `MediaPlaceholder` diagram slot → one key point. Reads clean at
390px with token-driven rhythm: high enough under the learning header to avoid
a dead top half, with enough heading/intro space to make the paragraph feel
secondary.

## 8. Below-bar counterexample

The pre-rework Galen teach screen: five stacked `explainReveal` text steps
accumulating into a wall, raw-pixel spacing, no focal point, the payoff
buried as 14px muted footer text. Everything this shell exists to prevent.

## 9. Review checks

- ⚙ No raw px spacing/type — tokens only.
- ⚙ At most one visual (`MediaPlaceholder`) in the body.
- ⚙ Exactly one heading; at most one `keyPoint`.
- 👁 **The teach screen actually composes through this shell** (content sets
  `shell: 'teach'`) — not the generic block shell. A teaching screen whose
  heading renders through `ScreenTitle` with ad-hoc spacing is a failure.
- 👁 The header uses this shell's `TYPE.displayScreen` — not `ScreenTitle`
  or an ad-hoc size; two screens of the same kind share one header token.
- 👁 Rhythm reads clean at 390px, composed with real content (render pass):
  heading visible high in the content area, intro visibly secondary, body not
  crammed against the paragraph.
- 👁 If an `eyebrow` is present, it passes the eyebrow rule (adds
  information, sentence case, not decorative).
