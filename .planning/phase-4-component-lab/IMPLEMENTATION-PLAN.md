# Phase 4 — implementation plan

Baseline SHA: `d2c0030f80730db42e0b5097319ae5292966b078`.
Nothing here is executed in this phase. Execution requires an explicit request,
per `CLAUDE.md`'s GSD command scope.

**Blocked on:** D1 and D2 in `DECISIONS.md`. D1 changes what Step 2 builds; D2
determines whether Step 7 exists. D3–D5 can be answered during execution.

Lane: **E — Big Build** (new architecture + generated projection). Pipeline:
`brainstorming` → `writing-plans` → `subagent-driven-development`, with
`verification-before-completion` before any completion claim.

---

## Step 0 — Parity harness (before any behaviour changes)

Make later parity provable rather than asserted.

1. Commit the capture script that produced
   `baselines/current-lab-manifest.json` as a repo script (it currently lives in
   a scratchpad). It bundles `reviewManifest.jsx` with esbuild, stubs only
   `react` and `src/components/**`, and serialises entries, variants, fixture
   identities and the component names each adapter mounts.
2. Add `tests/architecture/component-lab-parity.test.js` asserting the capture
   still matches the baseline.

**Exit:** the test passes at the baseline SHA, and fails if any entry, variant,
fixture binding or mounted component changes. Every later step is then measured
against it, and every intentional change shows as a reviewed baseline diff.

---

## Step 1 — Content usage scanner

Extract the usage scan into `scripts/scanContentTypeUsage.mjs`.

- Must match **both** authoring styles: `type: 'x'` and `"type": "x"`.
- Regression test: `spotTheError`, `builder` and `acronymMemorise` each report
  exactly 1 use — these are the three the naive single-quote regex missed, and
  the reason two Lab claims were wrong.
- Output must equal `baselines/current-content-type-usage.json` at this SHA.

**Exit:** scanner output byte-identical to the baseline.

---

## Step 2 — Generated Lab projection

Add `scripts/generate-lab-registry.mjs` → `src/data/generated/componentLabRegistry.js`,
wired as `pnpm lab:generate` / `pnpm lab:check`, mirroring the two existing
generators.

Fields per `DESIGN.md` §1. **Shape of the usage half depends on D1.**

Guards:
- File header marks it generated; hand-edits fail `lab:check`.
- No JSX, no functions, no React — extend the existing catalogue-integrity test.
- Extend `tests/architecture/component-catalogue-integrity.test.js` so the Lab is
  proven never to import `src/component-catalogue/**` or `loadCatalogue()`.

**Exit:** `pnpm lab:generate && pnpm lab:check` clean; projection covers all 84
records; Lab untouched so far, so parity still passes.

---

## Step 3 — Adapter layer

Restructure `src/dev/componentReview/` into a `recordId`-keyed adapter registry
carrying only Layer-2 facts (`DESIGN.md` §1).

Constraints:
- Preserve every existing render adapter, fixture binding and variant verbatim —
  this step moves code, it does not rewrite previews.
- `fixtures.base.js` keeps its current export names: `GuidedExamResponse.stories.jsx`
  imports `guidedExamResponse` from it (Census 1). Breaking that breaks Storybook,
  which is out of scope to touch.
- Delete the "internal child" comment at `reviewManifestCore.jsx:64-68` — it
  contradicts the catalogue for `UnifiedQuestionScreen` and `RecoveryQuizPlayer`.

**Exit:** parity test passes unchanged. Prose and status fields still present but
now unused by the shell.

---

## Step 4 — Identity corrections

Three changes, each a reviewed parity diff:

1. **`face-the-examiner`** imports `FaceTheExaminer.jsx` (the public export)
   instead of `faceTheExaminer/FaceTheExaminerContainer.jsx` (a directory the
   record claims as internal). The public file is a bare re-export, so rendered
   output is identical; only the mounted component *name* in the parity capture
   changes.
2. **Collapse duplicates into variants:** `GraphView` ×2, `InteractiveHotspotImage`
   ×2, `BuilderBlock` ×3 → three entries with variants. Six entries become three;
   **no preview is lost** — 102 selectable units must stay 102.
3. **Add a guard** that every adapter's `recordId` resolves to a catalogue record,
   with one allowlisted Lab-local exception (`buttons-and-progress`).

**Exit:** parity diff shows exactly these three changes and nothing else.

---

## Step 5 — Shell reads generated facts

`ComponentReviewLab.jsx` renders name, function, usage, alternative, interaction
and lifecycle from `componentLabRegistry.js`; adapters supply only previews.

- Delete the `getTypeInfo` import and the derivation at `reviewManifestCore.jsx:949`.
- Delete `status` and the `STATUS_LABELS` / `matchesFilter` machinery.
- Implement the four-fact filter model (`DESIGN.md` §3).
- Drop the dead `uncategorised` interaction label — the census proved it never fires.

**Exit:** no handwritten `name` / `function` / `usage` / `alternative` / `status`
remains in the Lab; both stale claims (`spot-the-error`, `timeline-chain`) are
gone because nothing hand-writes them any more.

---

## Step 6 — Remove the Phase 3 temporary pedagogy entry

**Same commit as Step 5's `getTypeInfo` deletion**, per `DESIGN.md` §5:

1. Delete the `calculationBreakdown` entry from `NON_AUTHORING_PEDAGOGY`
   (array becomes empty; the file and its governing comment stay).
2. `pnpm pedagogy:generate`; commit the regenerated registry.
3. `pnpm pedagogy:check` passes.

Do **not** give `CalculationBreakdown` an authoring entry.

**Exit:** no `getTypeInfo` call remains in `src/dev/componentReview/`; the
CalculationBreakdown preview still renders all seven variants.

---

## Step 7 — Coverage (scope set by D2)

Recommended scope (D2 option B): adapters for `ExamQuestionFrame`,
`PriorKnowledgeRecall`, `RecoveryQuizPlayer`, `FractionRatioExplore`, and
`TimelineChainBlock` as a level variant of `TimelineChain`.

Each needs a realistic GCSE fixture following `fixtures.base.js` conventions and
the `TEACHING_VOICE_GUIDE`. Non-mountable records are listed per D3.

**Exit:** the coverage baseline regenerates with the newly represented records
moving out of "not represented", and totals still reconciling to 84.

---

## Step 8 — Source-comment corrections

Correct the four false production-boundary claims catalogued in Census 1
(`ComponentReviewLab.jsx:3-5`, `reviewManifestCore.jsx:3`, `:9`,
`ButtonsAndProgressPage.jsx:3`), matching the already-accurate wording at
`src/App.jsx:5-11`.

**Comments only.** No change to access, query flag, entry card, auth bypass,
app-replacement, exit behaviour, URL structure or learner reachability.

---

## Step 9 — Verification

Evidence required before any completion claim
(`verification-before-completion`):

| Check | Evidence |
|---|---|
| Parity | `component-lab-parity.test.js` passes; every baseline diff reviewed and attributable to a named step |
| Generators | `pnpm catalogue:check`, `authoring:check`, `pedagogy:check`, `lab:check` all clean |
| Architecture | full `vitest run tests/architecture` |
| Build | `./node_modules/.bin/vite build` succeeds |
| Bundle | Lab chunk re-measured against 356.16 kB / 105.76 kB; delta reported, not budgeted |
| No leakage | learner entry chunk still free of Lab-only strings |
| Runtime | Lab opened at ~390px via `?componentReview=true`; index, filters, and one preview per interaction class exercised |
| Learner app | app still loads normally without the flag |
| Reconciliation | coverage baseline regenerated; totals still sum to 84 |

---

## Risk register

| Risk | Mitigation |
|---|---|
| Rewrite silently drops a preview | Step 0 parity harness before any change; 102 selectable units is a hard invariant through Step 4 |
| Generated usage churns on content commits | D1 — recommendation excludes usage from drift checking |
| Fixture rename breaks Storybook | Step 3 constraint: `fixtures.base.js` export names are frozen |
| Chunk grows materially | Measured and reported at Step 9; splitting options recorded in the bundle baseline if needed |
| Catalogue absorbs preview concerns | `DESIGN.md` §8; enforced by the no-JSX/no-functions guard in Step 2 |
| Scope creep into access model | Settled boundary; Step 8 is comments only |
