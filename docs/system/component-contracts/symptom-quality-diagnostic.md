# Contract — symptomQualityDiagnostic

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Component:** `src/components/learning/SymptomQualityDiagnostic.jsx` · intent: *teach a diagnostic theory, then apply it to one case*

## 1. Purpose

Teach a quality-based diagnostic theory (hot/cold/wet/dry) through example
symptoms, then apply it end to end to one named patient case: diagnose the
dominant quadrant, choose a treatment, and see why the theory's logic
persisted historically.

## 2. When to use

A theory that classifies symptoms along two or more named qualities/axes,
where the exam-relevant skill is applying that classification to a specific
case and then reasoning about treatment. Currently used once, for Galen's
Theory of Opposites in Episode 1 — built as a distinct component rather than
extending `TheoryLab.jsx` at the user's explicit direction, so it is not yet
reusable across three modules; a second use case should revisit whether the
two should converge.

## 3. When NOT to use

- **Multiple patient cases in one set** — this component is built for
  exactly one worked case; testing several cases needs a different
  mechanic (see `GalensDiagnostic.jsx` for a different case-based
  approach) or several separate blocks.
- **As a general MCQ component** — the quadrant-select and treatment beats
  are bespoke to this cinematic, subject-accented genre; a generic
  standalone multiple-choice question should use `AnswerInteraction.jsx`.
- **With images** — this component is text/token-only by design; a
  screen needing diagrams or photos should use a different component.

## 4. Required structure

- `qualities` — exactly 4 entries (the axis being taught), each with a
  `quality` id and 2-3 named example `symptoms`.
- `patient` — exactly one named case: a `title` and its `symptoms`.
- `quadrantQuestion` / `quadrantOptions` — exactly 4 options, one `correct`.
- `diagnosis` — a short confirmation label, no fragments carrying new
  teaching weight (the diagnosis was already taught by the quadrant beat).
- `treatmentQuestion` / `treatmentOptions` — any number of options, exactly
  one `correct: true`; every option carries an `explanation` in full
  sentences (why it's right or wrong in terms of the theory's logic, not a
  restatement of the answer).
- `oppositeRecall` — `from`/`to`/`result`, the theory's core transformation.
- `closing` — `worked` (list), `limitation`, `verdict`, `church` (`heading`
  + `body`), `significance`, all in full sentences — the exam payoff.

## 5. Token rules

`SPACING`/`RADII`/`MOTION`/`TYPE`/`BUTTONS` tokens only — no raw px/hex.
Subject accent via `SUBJECTS[subject].accent`/`.accentRgb`. No
`TYPE.eyebrow` or hand-typed uppercase labels — small section labels use
`TYPE.label` in sentence case (see `docs/system/TYPOGRAPHY_SYSTEM.md` →
Label case).

## 6. Motion rules

Word/symptom reveals stagger in via `sqd-in`/`sqd-in-left` keyframes
(`MOTION.easing.standard`), matching `TheoryLab.jsx`'s established rhythm
for this genre. Wrong quadrant picks shake (`sqd-shake`) and reset.
`prefers-reduced-motion: reduce` disables all `.sqd-motion` animations via
the injected stylesheet's media query.

## 7. Gold example

`SymptomQualityDiagnostic.stories.jsx` → **Gold — fever and phlegm cough**:
the shipped Episode 1 case (`episode-01-medieval-beliefs-causes.js`, Galen
stage) — hot/cold/wet/dry taught with named symptoms, one patient (fever,
phlegm cough), diagnosed hot + wet, treated with cucumber and dry bread,
closing with the Church's role in the theory's 1,400-year survival.

## 8. Below-bar counterexample

- A quadrant question with fewer or more than 4 options (breaks the
  bespoke 2×2 grid layout).
- A treatment option with no `explanation`, or an explanation that just
  restates "correct"/"wrong" without the theory's reasoning.
- Any image, icon-as-illustration, or background photo — this genre is
  text/token-only.
- A second patient case bolted onto the same block — split into a new
  block or a different component instead.

## 9. Review checks

- ⚙ Solid colours use tokens (`CINEMATIC_LAB`, `SUBJECTS`); the cream text's
  opacity variants and neutral surface tints remain raw `rgba(...)`
  literals, consistent with this genre's established convention.
- 👁 No decorative uppercase / no `TYPE.eyebrow` anywhere.
- 👁 Exactly one patient case; exactly 4 quality beats; exactly 4 quadrant
  options.
- 👁 Every treatment option's `explanation` is a full sentence carrying the
  theory's reasoning, not a fragment.
- 👁 No images.
