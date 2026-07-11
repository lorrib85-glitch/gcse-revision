# Design — unified "symptom to treatment" diagnostic set (Episode 1, Galen stage)

**Status:** Approved by user, pending implementation plan.
**Lane:** E — Big Build (new component + content restructure).
**Scope:** `episode-01-medieval-beliefs-causes.js` (History → Medicine Through Time), Galen stage only.

## Problem

The current Galen "Theory of Opposites" stretch has a test-before-teach and
duplication problem:

1. Four Humours quadrant reveal (kept, unchanged)
2. "Galen treated with opposites" diagram screen (kept, unchanged)
3. `workedExample` screen "From symptoms to treatment" — solves a patient case
   (fever, red face, sweating) and gives away the answer
4. `theoryLab` screen ("Think Like Galen") — immediately re-tests the *same*
   patient case the worked example just solved, and its `TheoryStage` only
   ever renders the first `theory.grid` pair (HOT ↔ COLD), never WET ↔ DRY,
   despite the data carrying both pairs.

Screens 3 and 4 are being replaced by one new, purpose-built component.

## What's kept unchanged

- The Four Humours quadrant reveal screen.
- The "Galen treated with opposites" diagram screen — this becomes page 1 of
  the new set; the new component's content starts immediately after it.

## What's removed

- The `workedExample` block/screen ("From symptoms to treatment").
- The existing `theoryLab` screen block for this stage.
- The `.runtime.js` sequencing logic that splits the diagram screen away from
  the worked example (`splitTheoryOfOppositesScreen`'s worked-example half is
  deleted; the diagram-only split stays, since the diagram screen is kept
  unchanged as page 1).

## New unified set

One new component, one `screens[]` entry, ten internal beats (same
architectural pattern as `TheoryLab.jsx`/`GalensDiagnostic.jsx` — a single
component owns its own beat/stage state via `useState`, rather than being
split into multiple `screens[]` entries).

No images anywhere in this component — text and design-token surfaces only.
Each beat is single-purpose, per the cognitive load law (one screen, one job).

| # | Beat | What it does |
|---|------|---------------|
| 1 | Hot | Word reveal ("Hot"), then example symptoms fade in one at a time: Fever, red face, flushed skin |
| 2 | Cold | Word reveal ("Cold"), then example symptoms: Pale skin, chills, shivering |
| 3 | Wet | Word reveal ("Wet"), then example symptoms: Sweating, runny nose, watery eyes |
| 4 | Dry | Word reveal ("Dry"), then example symptoms: Cracked lips, dry cough, thirst |
| 5 | Patient case | "A patient arrives" — Fever, phlegm cough, revealed progressively (only one case; no others) |
| 6 | Quadrant select | "Which qualities dominate?" — four options: hot + wet / hot + dry / cold + wet / cold + dry. Wrong pick shakes and lets the learner retry; correct pick advances |
| 7 | Diagnosis reveal | Brief confirmation beat: "Hot + wet" — no interaction, sets up the next question |
| 8 | Treatment MCQ | Single multiple-choice question, one correct answer among ~4 plausible options, feedback explains the reasoning in terms of the theory's logic |
| 9 | Opposite recall | Hot + wet → cold + dry → balance transformation reveal (existing pattern, reused) |
| 10 | Closing beat | Short "did the cure actually work?" + why the Church kept the theory alive for 1,000+ years (condensed from `TheoryLab`'s two-beat evaluation into one) |

### Draft copy for the treatment MCQ (beat 8)

Adjustable during content authoring — not locked by this spec.

> **What would Galen prescribe to cool and dry this patient?**
> - **Cucumber and dry bread** — correct. Cold and dry qualities restore
>   balance against the patient's hot, wet excess.
> - Hot soup and warm wine — wrong. Hot and wet, the same qualities causing
>   the illness.
> - Warm blankets and a thick stew — wrong. Still adds heat.
> - Cold milk and steamed vegetables — wrong. Cold is right, but still moist
>   — it doesn't dry the body.

## Component & interaction pattern

**New component:** `src/components/learning/SymptomQualityDiagnostic.jsx`
(name confirmable at planning time), plus a `.stories.jsx` file alongside it
per the component checklist in `COMPONENT_AUTHORING_RULES.md`.

**Block type:** `symptomQualityDiagnostic`, routed in
`src/components/layout/ModulePlayer.jsx` next to the existing `theoryLab`
case (`ModulePlayer.jsx:2176`).

**Choice interactions (quadrant select, treatment MCQ):** built as bespoke
selection UI using `SPACING`/`RADII`/`TYPE`/`BUTTONS`/`MOTION`/`SUBJECTS`
tokens — **not** the locked `AnswerInteraction.jsx`. `AnswerInteraction` is
the universal answer component for generic app-wide quiz/exam screens
(styled with the `GENERAL` theme), but `TheoryLab.jsx` — the contractual
gold standard for this exact genre of screen
(`docs/system/component-contracts/theory-lab.md`) — deliberately hand-rolls
its own subject-accented choice buttons instead, because the cinematic,
per-subject-accented look this genre requires doesn't match
`AnswerInteraction`'s generic styling. This component follows that same
established precedent.

**Copy conventions:** sentence case throughout (headings, question text,
option labels, button labels) — not title case, per `CLAUDE.md` → Titles
and Headings. Reading age ~12, vocabulary explained on first use, per
`docs/system/TEACHING_VOICE_GUIDE.md`.

**Token conventions:** no raw px/hex values anywhere in the new component —
every spacing, radius, motion timing, typography and colour value comes
from `SPACING`/`RADII`/`MOTION`/`TYPE`/`SUBJECTS`, per
`docs/system/COMPONENT_AUTHORING_RULES.md`.

## Data shape (draft)

```js
{
  type: 'symptomQualityDiagnostic',
  stage: 'Galen',
  label: 'Symptom to treatment',
  qualities: [
    { quality: 'hot',  symptoms: ['Fever', 'Red face', 'Flushed skin'] },
    { quality: 'cold', symptoms: ['Pale skin', 'Chills', 'Shivering'] },
    { quality: 'wet',  symptoms: ['Sweating', 'Runny nose', 'Watery eyes'] },
    { quality: 'dry',  symptoms: ['Cracked lips', 'Dry cough', 'Thirst'] },
  ],
  patient: {
    title: 'A patient arrives',
    symptoms: ['Fever', 'Phlegm cough'],
  },
  quadrantQuestion: 'Which qualities dominate?',
  quadrantOptions: [
    { label: 'Hot + wet',  correct: true },
    { label: 'Hot + dry',  correct: false },
    { label: 'Cold + wet', correct: false },
    { label: 'Cold + dry', correct: false },
  ],
  diagnosis: { label: 'Hot + wet' },
  treatmentQuestion: 'What would Galen prescribe to cool and dry this patient?',
  treatmentOptions: [
    {
      label: 'Cucumber and dry bread',
      correct: true,
      explanation: 'Cold and dry qualities pull the body back towards balance against the hot, wet excess.',
    },
    {
      label: 'Hot soup and warm wine',
      correct: false,
      explanation: 'Hot and wet — the same qualities causing the illness, not the opposite.',
    },
    {
      label: 'Warm blankets and a thick stew',
      correct: false,
      explanation: 'Still adds heat, when the patient needs cooling.',
    },
    {
      label: 'Cold milk and steamed vegetables',
      correct: false,
      explanation: "Cold is right, but this is still moist — it doesn't dry the body.",
    },
  ],
  oppositeRecall: { from: 'Hot + wet', to: 'Cold + dry', result: 'Balance' },
  closing: {
    worked: ['Rest', 'Fluids', 'Cooling foods'],
    limitation: 'Disease is not actually caused by an imbalance of the four humours.',
    verdict: 'Patients who rested, drank fluids and ate cooling foods often did recover. To Galen, and to the doctors who followed him, that recovery looked like proof the theory worked, even though the humours had nothing to do with it.',
    church: {
      heading: 'Supported by the Church',
      body: "Christians believed God created a perfect and balanced body. This matched Galen's ideas, so the Church preserved and promoted his work for centuries.",
    },
    significance: "That's why the Theory of Opposites survived for over 1,400 years. It wasn't blind faith. It was a theory that seemed to keep working, treatment after treatment, patient after patient.",
  },
}
```

`closing.church` carries no `image` field — no images anywhere in this
component, including the closing beat (the existing `theoryLab` evaluation
stage shows a Church portrait image; this component drops it and renders the
heading + body as text only).

Field names loosely mirror `theoryLab`'s existing shape (`patient` ~
`scenario`, `oppositeRecall` ~ `prescription.reveal` + `evaluation.
transformation`) for content-author familiarity, without literally reusing
the `theoryLab` block type.

## Files touched

- **New:** `src/components/learning/SymptomQualityDiagnostic.jsx`
- **New:** `src/components/learning/SymptomQualityDiagnostic.stories.jsx`
- **Edit:** `src/components/layout/ModulePlayer.jsx` — add routing case
- **Edit:** `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`
  — replace the `workedExample` block and the `theoryLab` screen with one
  `symptomQualityDiagnostic` screen
- **Edit:** `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js`
  — drop the worked-example half of `splitTheoryOfOppositesScreen`; keep the
  diagram-only split
- **New:** `docs/system/component-contracts/symptom-quality-diagnostic.md`
  — 9-field contract, per `PATTERN_GOVERNANCE.md`
- **Edit:** `docs/components/COMPONENT_REGISTRY.md` — new entry

## Verification plan

- `./node_modules/.bin/vite build` — 0 errors
- `./node_modules/.bin/vitest run tests/architecture` — module metadata/
  screenCount/screenTags stay in sync
- Full walkthrough: open Episode 1, play through the Four Humours reveal →
  diagram screen → all ten new beats → confirm it hands off correctly to
  whatever screen currently follows the old `theoryLab` block
- `/ponytail-review`
- Pattern-governance review: one-sentence primary intent per beat, checked
  against `docs/system/PATTERN_GOVERNANCE.md`

## Out of scope

- `GalensDiagnostic.jsx` — left untouched, not revived, not deleted.
- `TheoryLab.jsx` — left untouched; still used elsewhere if/when other
  content references it. Its known WET/DRY rendering gap is not fixed by
  this work (noted in its contract as a pre-existing, separate issue).
- Any subject/module other than this one Episode 1 stretch.
