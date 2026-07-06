# Contract — WorkedExample

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Component:** `src/components/core/WorkedExample.jsx` · intent: *walk a worked example*

## 1. Purpose

Walk one concrete, named case through the concept just taught, so the
abstract rule becomes applicable: the case → applying the rule → the result.

## 2. When to use

Immediately **after** a concept is taught, to show it applied to a specific,
named case (a patient, a calculation, a source). Pairs naturally with a
`KeyPoint`: `KeyPoint` states the rule, `WorkedExample` shows it in action.

## 3. When NOT to use

- **Before the concept is taught** — that is testing before teaching (the
  `theoryLab` failure mode). The learner must already hold the rule.
- **As the only teaching on the screen** — it illustrates a rule, it does
  not replace the teach beat that establishes it.
- **To state the rule itself** — a general rule is a `KeyPoint`.
  `WorkedExample` is always about one specific case.

## 4. Required structure

- `scenario` — the specific, named case (sentence case).
- `chips` (optional) — the case's short givens (symptoms, numbers).
- `working` — the reasoning applying the rule to this case.
- `result` — the outcome for THIS case (accent-emphasised).
- May sit inside `TeachScreenShell` (as body, not as the keyPoint slot).

Distinct from `KeyPoint`: `KeyPoint` summarises the rule; `WorkedExample`
demonstrates the process. Never merge them.

## 5. Token rules

`RADII.medium` card, `RADII.small` result inset, `RADII.pill` chips;
`SPACING` gaps and padding; `TYPE.body`/`TYPE.bodySmall`/`TYPE.metadata`;
accent via `SUBJECTS[subject].accentRgb`. No raw px/hex.

## 6. Motion rules

The three beats (case → working → result) reveal in a light sequence
(`we-rise`, staggered `animationDelay`, `MOTION.easing.gentle`), so the
demonstration unfolds rather than appearing at once. `prefers-reduced-motion`:
no animation, final state shown.

## 7. Gold example

`WorkedExample.stories.jsx` → **Gold — the Galen fever case**: chips
(Fever · Red face · Sweating) → "A patient arrives with a fever, a red face
and heavy sweating." → "Heat and wetness point to too much blood, which is
hot and wet." → result "cool and dry the body — the opposite qualities."
The `Maths` story shows the same case → apply → result shape generalises
across subjects.

## 8. Below-bar counterexample

- A worked example placed before the theory is taught (test-before-teach).
- Fragments carrying the teaching weight ("Too much heat.") instead of
  full-sentence reasoning.
- A generic, un-named case ("some patient") — the case must be specific.
- The general rule ("treat with the opposite") dropped in here — that is a
  `KeyPoint`, not a worked example.

## 9. Review checks

- ⚙ Uses tokens, not raw values.
- 👁 The concept is taught earlier in the episode than this example (no
  test-before-teach).
- 👁 The case is specific and named, not generic.
- 👁 It demonstrates a case — it is not a rule summary (that is `KeyPoint`).
