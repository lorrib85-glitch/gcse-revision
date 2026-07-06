# Content build template

**Authority:** layers inside the locked module architectures
(`HISTORY_MODULE_ARCHITECTURE.md`, `SCIENCE_MODULE_BLUEPRINT.md`). Those
docs own section structure; this doc owns the rhythm and quality floor
*inside* the sections. Where they conflict, the locked architecture wins.

**Companion docs:** `docs/system/component-contracts/` (per-component
execution standards), `src/data/componentFunctions.js` (function-tag
taxonomy), `tests/architecture/content-quality.test.js` (machine-checked
floor).

## Governing principle

Every screen must justify its existence. Removing a screen should
noticeably reduce understanding, retention or motivation. If it doesn't,
redesign or remove it.

## Story units — the shape

An episode's teaching sections are composed of **3–5 story units**. Each
unit is defined by a **dramatic question** taken from the episode's story
spine (in its canonical architecture file) and follows this beat pattern:

1. **Tension beat** — a scene, stake, or question; never a definition
   first. Component functions: `hook-tension`, `introduce-figure`.
2. **Teach beat** — the concept properly explained: cause → mechanism →
   consequence, in full sentences, *before* anything tests it. Component
   functions: `teach-mechanism`, `teach-comparison`.
3. **Interactive payoff** — the learner uses the idea just taught, and the
   payoff must resolve the unit's dramatic question. Component functions:
   `apply`, `classify`, `sequence-process`.
4. **Retrieval close** — quick check feeding `unifiedWeaknessTracker.js`.
   Component function: `retrieve`.

Beats name **component functions, never component names**. To pick the
component: match the content's shape to a function tag in
`src/data/componentFunctions.js`, then choose among the components
carrying that tag using the fit rules in their contracts (e.g. ordered
process → `evacuationChainRoute`; unordered pairs → `matchingTask`).

For non-narrative subjects (e.g. Maths), story units are tension-shaped
rather than narrative-shaped — "here is where this goes wrong for real
students" — with the same four beats.

## The hard floor — checklist

Items marked ⚙ are enforced by
`tests/architecture/content-quality.test.js` and cannot regress.

- ⚙ Never more than 2 consecutive passive screens (a screen is passive
  when its type and all its blocks' types have interaction class
  `passive`)
- ⚙ Every teaching stage (each `stageNavigation` segment except the final
  exam-prep stage) contains at least one `assessed` screen
- ⚙ `stageNavigation` screenIndex values are strictly increasing, unique,
  and within bounds
- ⚙ All learner-facing text passes the readability check: plain language
  around the compulsory subject vocabulary, aiming for a reading age of 12
  (Flesch-Kincaid grade ≤ 7 per screen, exam vocabulary exempt)
- A concept may not be tested before the screen that teaches it
- No orphan facts: every fact taught is retrieved or applied later in the
  episode
- Teach beats state *why* (cause/consequence), never only *what*
- Exam vocabulary is explained on first use

## The review rubric

Every episode is scored on six dimensions, each reported separately and
never averaged: **Story, Teaching, Retrieval, Interactions, Exam
preparation, Emotional engagement** — plus five technical passes:
**hardcoded values, image quality, UX design, canonical coverage,
readability**. Definitions live in the spec
(`docs/superpowers/specs/2026-07-06-content-quality-framework-design.md`)
and are operationalised by the `content-create` and `content-review`
skills.
