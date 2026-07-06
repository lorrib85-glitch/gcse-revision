# Contract — TeachScreenShell

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Component:** `src/components/core/TeachScreenShell.jsx` · intent: *compose a
teaching screen* · not a display block type — a composition primitive.

## 1. Purpose

Compose a teaching screen with the approved vertical rhythm so spacing stops
being a per-session judgement call. One screen, one heading, one job.

## 2. When to use

Any screen whose primary intent is to teach or explain a concept: a heading,
an optional framing line, a teaching body (often a reserved visual), and at
most one key point.

## 3. When NOT to use

- **Cinematic reveal moments** (`VisualLearning`, `CinematicRevealMoment`,
  `ExaminerExplainsScreen`) — those own a full-bleed layout; don't wrap them.
- **Assessed interactions that own their own layout** (`theoryLab`,
  `matchingTask`, `interactiveImage`, quiz screens) — the shell composes a
  teach screen, it does not host an interaction engine.
- **Inside another shell or a full-screen stage** — never nest
  `TeachScreenShell`.

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

- All inter-slot spacing from `SPACING` (heading↔intro `SPACING.compact`;
  body and keyPoint separated by `SPACING.separation`; page padding
  `SPACING.cinematic`/`SPACING.standard`). No raw px.
- Type from `TYPE` (`TYPE.displayScreen` heading, `TYPE.body` intro,
  `TYPE.label` eyebrow). Accent from `SUBJECTS[subject]`.

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
390px with token-driven rhythm.

## 8. Below-bar counterexample

The pre-rework Galen teach screen: five stacked `explainReveal` text steps
accumulating into a wall, raw-pixel spacing, no focal point, the payoff
buried as 14px muted footer text. Everything this shell exists to prevent.

## 9. Review checks

- ⚙ No raw px spacing/type — tokens only.
- ⚙ At most one visual (`MediaPlaceholder`) in the body.
- ⚙ Exactly one heading; at most one `keyPoint`.
- 👁 Rhythm reads clean at 390px (render pass).
- 👁 If an `eyebrow` is present, it passes the eyebrow rule (adds
  information, sentence case, not decorative).
