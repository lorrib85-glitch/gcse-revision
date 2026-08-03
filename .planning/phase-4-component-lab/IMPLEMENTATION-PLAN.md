# Phase 4 — implementation plan

Revised for the clarified product rule: **the Component Lab is the
chapter-building component library.**

Baseline SHA: `d2c0030f80730db42e0b5097319ae5292966b078`.
Nothing here is executed. Execution requires an explicit request, and the user
has directed that this corrected planning is reviewed first.

**Blocked on:** D1, D2, D3 and D4 in `DECISIONS.md`. D2 decides what authoring
types the B items get. D3 decides where category C items go. D4 decides whether
Phase 4 reaches 100% authoring coverage or 65%. D1 shapes the generator.

Lane: **E — Big Build**. Pipeline: `brainstorming` → `writing-plans` →
`subagent-driven-development`, with `verification-before-completion` before any
completion claim.

> **Superseded.** The previous sequence built a record-keyed projection and
> deleted the `calculationBreakdown` pedagogy shim at Step 6. Both are wrong
> under the clarified rule: the projection unit is the authoring entry, and the
> shim is removed only *after* a genuine authoring entry exists.

---

## Step 0 — Parity harness (before any change)

Unchanged from the previous plan and still first.

1. Commit the capture script that produced `baselines/current-lab-manifest.json`
   as a repo script.
2. Add `tests/architecture/component-lab-parity.test.js` asserting the capture
   matches the baseline.

Phase 4 deliberately changes the Lab's population, so parity is not a
"nothing changed" test — it is the instrument that makes **every** change show up
as a reviewed baseline diff. No entry may move silently.

**Exit:** passes at the baseline SHA; fails on any entry, variant, fixture or
mounted-component change.

---

## Step 1 — Content usage scanner

`scripts/scanContentTypeUsage.mjs`.

- Must match both `type: 'x'` and `"type": "x"`.
- Regression test: `spotTheError`, `builder`, `acronymMemorise` each report
  exactly 1 use — the three the naive regex missed.
- Counts only registered authoring types; nested question types (`choice`,
  `truefalse`) are excluded.
- Output must equal `baselines/current-content-type-usage.json`.

**Exit:** output byte-identical to the baseline.

---

## Step 2 — Authoring-keyed Lab projection

`scripts/generate-lab-registry.mjs` → `src/data/generated/componentLabRegistry.js`,
wired as `pnpm lab:generate` / `pnpm lab:check`.

**One row per live authoring entry**, keyed `level:type` (`DESIGN.md` §2). Rows
are emitted only for `status !== 'legacy'`. A record with `authoring: null`
produces no row — this is how infrastructure is excluded structurally.

Guards:
- Generated-file header; hand-edits fail `lab:check`.
- No JSX, no functions, no React.
- Extend `component-catalogue-integrity.test.js` to prove the Lab never imports
  `src/component-catalogue/**` or `loadCatalogue()`.

**Exit:** `pnpm lab:generate && pnpm lab:check` clean; 51 rows; Lab untouched, so
parity still passes.

---

## Step 3 — Adapter layer keyed by authoring key

Restructure `src/dev/componentReview/` so every adapter carries an
`authoringKey`. Preserve every existing render adapter, fixture and variant
verbatim — this step moves code, it does not rewrite previews.

Constraints:
- `fixtures.base.js` export names are **frozen** —
  `GuidedExamResponse.stories.jsx` imports from it (Census 1). Breaking that
  breaks Storybook, which is out of scope.
- Delete the "internal child" comment at `reviewManifestCore.jsx:64-68`; it
  contradicts the catalogue for `UnifiedQuestionScreen` and `RecoveryQuizPlayer`.

The 11 routeless items (B and C) are tagged but not yet bound — they have no key
to bind to until Steps 5 and 6.

**Exit:** parity passes unchanged.

---

## Step 4 — Bidirectional join guard

Add `tests/architecture/component-lab-authoring-coverage.test.js` enforcing
coverage contract 2:

- every adapter's `authoringKey` resolves to a live projection row;
- every live projection row has an adapter;
- no adapter references a record with `authoring: null`.

**This test is expected to FAIL when written** — 17 rows have no adapter and 11
adapters have no key. That failure is the specification for Steps 5–7. Do not
weaken it to pass; make the code satisfy it.

**Exit:** the test exists, fails with exactly 17 + 11 named violations, and those
counts match `baselines/current-authoring-coverage.json`.

---

## Step 5 — Category C removal (`DESIGN.md` §5, home per D3)

Remove from the Lab: `buttons-and-progress`, `chapter-outcome-screen`,
`chapter-complete-screen`, `chapter-hook-screen`, `weak-spot-recovery`.

Rehome per D3 (recommended: a sibling owner surface reusing
`ButtonsAndProgressPage.jsx` unchanged, plus a runtime-screen section).

**Nothing is deleted.** `ButtonsAndProgressPage.jsx` moves; the four runtime
components keep their catalogue records and gain a preview on the new surface.
No component is shown as disabled or catalogue-only in the Lab.

**Exit:** 11 routeless adapters → 6; parity diff shows exactly five removals.

---

## Step 6 — Category B authoring entries (per D2)

For each of the six B items: a genuine authoring entry on the owning record, a
content contract (`required` / `requiredAny`), a `ScreenRenderer` route, and a
minimal valid chapter content shape.

### 6a — CalculationBreakdown (`DESIGN.md` §6)

Spec is fully worked: `screen:calculationBreakdown`, layout `full`, continuation
`component`, `headerMode` `standard`,
`requiredAny: [[steps:array, presentation:object]]`, pedagogy
`['sequence-process','apply'] / assessed`.

**Shim removal order is mandatory — one atomic commit:**

1. Add the authoring entry carrying the pedagogy block.
2. Add the `ScreenRenderer` route.
3. `pnpm authoring:generate`, `pnpm pedagogy:generate`.
4. **Then** delete the `calculationBreakdown` entry from `NON_AUTHORING_PEDAGOGY`.
5. Regenerate and assert `componentPedagogyRegistry.js` is **unchanged** for
   `calculationBreakdown` — proof the classification moved cleanly from shim to
   entry.

Do not remove the pedagogy classification first. Do not delete, retire or hide
the component, its record, contracts, previews, or any of the five presentations
(`standard`, `algebraWhy`, `inverseMachine`, `groupSplit`, `balance`). All five
become selectable authoring **modes**; `reduced-motion` and `mobile-width` stay
**variants**.

### 6b — Maths figures and circuit figure (per D2)

Recommended: `block:mathsFigure` with a `figure` discriminator, and
`block:circuitFigure` with the symbol board as a preset. Option A requires a
dispatching block that does not exist today.

**Any B item whose entry is not delivered leaves the Lab** rather than remaining
a routeless preview.

**Exit:** 6 routeless adapters → 0; `authoring:check` and `pedagogy:check` clean;
step-5 no-diff assertion passes.

---

## Step 7 — The 17 missing authoring entries

Adapters + minimal valid content shapes for every uncovered live entry, in
measured-usage order: `block:read` (261), `block:quiz` (224), `block:keypoint`
(83), `block:examtip` (62), `block:boss` (61), `block:scenario` (39),
`block:funfact` (26), `block:misconceptionCheck` (20), `block:timelineChain` (8),
`screen:priorKnowledgeRecall` (6), `block:oppositeQualitiesReveal` (2),
`block:misconception` (2), `block:mediaPlaceholder` (1), `block:reveal` (1),
`block:hotspot` (0), `block:timeline` (0), `screen:standard` (0).

Ten are `ScreenRenderer` handler types — **preview mechanism decided by D4**
(recommended: mount `ScreenRenderer` with a one-block fixture screen, so the
preview is what an author actually gets and the handlers stay private).

Also in this step (per D5): fix the two ownership defects — bind
`face-the-examiner` to the public `FaceTheExaminer.jsx`, and move
`screen:examinerExplains` from the parked `ExaminerExplainsScreen` record to the
canonical `WhatExaminersLookFor` record.

**Exit:** Step 4's guard **passes** — 100% coverage in both directions.

---

## Step 8 — Modes and variants; shell reads generated facts

- Collapse: `GraphView` ×2 → one row, two variants; `InteractiveHotspotImage` ×2
  → one row, two variants; `BuilderBlock` ×3 → one row, three variants.
- Expand: `misconceptionCheck`, `oppositeQualitiesReveal`, `timelineChain` each
  become **two rows** (screen and block levels).
- Shell renders name, contract, usage, pedagogy and lifecycle from the
  projection; adapters supply only previews.
- Delete the `getTypeInfo` import and `reviewManifestCore.jsx:949`.
- Delete `status`, `STATUS_LABELS`, `matchesFilter`; implement the filter model
  in `DESIGN.md` §9; drop the dead `uncategorised` label.

**Exit:** no handwritten `name` / `function` / `usage` / `alternative` / `status`
remains; both stale claims are gone because nothing hand-writes them.

---

## Step 9 — Authoring-completeness proof

Assert all ten requirements in `DESIGN.md` §8 for every Lab selection. The
sharpest is **requirement 10**: each selection ships a minimal content shape that
the real chapter validator accepts — a route guard plus a validator round-trip
per type.

**Exit:** every selection satisfies all ten; failures name the type and the
missing requirement.

---

## Step 10 — Source-comment corrections

Correct the four false production-boundary claims (Census 1), matching the
already accurate `src/App.jsx:5-11`.

**Comments only.** No change to access, query flag, entry card, auth bypass,
app-replacement, exit behaviour, URL structure or learner reachability.

---

## Step 11 — Verification

| Check | Evidence |
|---|---|
| Coverage contract 2 | Step 4's guard passes: 100% both directions |
| Authoring completeness | Step 9 passes for every selection |
| Shim handover | `componentPedagogyRegistry.js` unchanged for `calculationBreakdown` across Step 6a |
| CalculationBreakdown intact | Component, record, contracts and all five presentations still present and previewable |
| Parity | Every baseline diff reviewed and attributable to a named step |
| Generators | `catalogue:check`, `authoring:check`, `pedagogy:check`, `lab:check` clean |
| Architecture | full `vitest run tests/architecture` |
| Build | `./node_modules/.bin/vite build` succeeds |
| Bundle | Lab chunk re-measured against 356.16 kB / 105.76 kB; delta reported, not budgeted |
| No leakage | learner entry chunk still free of Lab-only strings |
| Runtime | Lab opened at ~390px; one selection exercised per interaction class; the new C-item surface opens |
| Learner app | still loads normally without the flag |
| Catalogue contract 1 | all 84 records still in the generated registry; `catalogue:check` clean |

---

## Coverage baseline strategy

| Baseline | Status |
|---|---|
| `current-authoring-coverage.json` | **Governing.** The Lab coverage contract. Regenerated at Step 11; target is 0 missing, 0 routeless |
| `current-catalogue-coverage.json` | **Demoted, retained.** Records the catalogue population and the pre-Phase-4 relationship. No longer a Lab target |
| `current-lab-manifest.json` | Parity instrument, unchanged in role |
| `current-content-type-usage.json` | Evidence base for usage; regression fixture for Step 1 |
| `current-bundle-baseline.md` | Bundle comparison point |

---

## Risk register

| Risk | Mitigation |
|---|---|
| A preview is silently dropped | Step 0 parity harness before any change; every removal is a reviewed diff |
| Pedagogy classification lost when the shim goes | Step 6a's mandatory order plus the no-diff assertion at step 5 |
| A fake authoring type gets registered to keep an item | `DESIGN.md` §11; Step 6 requires a renderer route and a validator-accepted content shape, which a fake type cannot produce |
| The ten handler types get previewed by exporting private handlers | D4 recommends the router-with-fixture route precisely to avoid this |
| Generated usage churns on content commits | D1 — recommendation excludes usage from drift checking |
| Fixture rename breaks Storybook | Step 3 constraint: `fixtures.base.js` export names frozen |
| Category C removal loses a useful preview | Step 5 rehomes rather than deletes; D3 picks the surface |
| New sibling surface exceeds the parked access boundary | D3 flags it as needing explicit approval, not assumed |
