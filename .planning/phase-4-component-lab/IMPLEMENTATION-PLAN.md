# Phase 4 — implementation plan

Rewritten for the settled decisions. **D0–D5 in `DECISIONS.md` are answered;
nothing here is blocked.** The governing product rule is unchanged: the
Component Lab is the chapter-building component library.

Baseline SHA: `552b899654fbc83f3d4483eed9182fb95626ac45`.

Lane: **E — Big Build**. Pipeline: `brainstorming` → `writing-plans` →
`subagent-driven-development`, with `verification-before-completion` before any
completion claim.

> **Superseded twice, in place.** The first sequence built a record-keyed
> projection and deleted the `calculationBreakdown` pedagogy shim early. The
> second targeted 51 entries and recommended a `block:mathsFigure` dispatcher.
> Both are withdrawn: the projection unit is the *active* authoring entry, the
> target is **57**, each figure component gets its own public type, and the
> shim is removed only after a genuine entry exists.

The target: **57 selectable Lab choices resolving to 57 active authoring
entries**, one derived route accounted for as a presentation, four legacy
entries excluded.

---

## Step 1 — Content usage scanner (D1)

`scripts/scan-content-type-usage.mjs`.

Structural, not regex: every module under `src/content/**` is imported and its
`screens` array walked, so screen and block levels are distinguished and nested
question shapes are excluded by construction.

- A screen's type is `screen.type` or `standard` when omitted — the type the
  runtime resolves, and therefore the one the author chose.
- Files are globbed and sorted; keys are sorted; no clock, environment or
  absolute path.
- Regression: `spotTheError`, `builder` and `acronymMemorise` each report
  exactly 1 use.

**Exit:** deterministic across runs; the three regression cases hold; the level
split is real (`timelineChain` = 10 screen / 0 block, correcting the regex
evidence).

---

## Step 2 — Catalogue entries and ownership (D2, D5)

Seven new authoring entries, each on its own owning record, each naming its
actual public component:

`screen:calculationBreakdown`, `block:angleFigure`,
`block:areaPerimeterFigure`, `block:coordinatePlaneFigure`,
`block:numberLineFigure`, `block:circuitDiagram`,
`block:circuitSymbolReference`.

Plus:

- `derivedFrom` added to the schema — mandatory on a `derived` entry, forbidden
  elsewhere, and set to `block:misconceptionCheck` on the derived screen route
  (D0);
- `screen:examinerExplains` moved from the parked `ExaminerExplainsScreen`
  record to the canonical `WhatExaminersLookFor` record (D5.1).

**Exit:** 57 active + 1 derived entries load and validate.

---

## Step 3 — Renderer routes and the shim handover

Routes for all seven new types in `ScreenRenderer`, and the canonical
`WhatExaminersLookFor` import in place of the parked alias.

**The handover order is mandatory, and it is enforced rather than trusted:**

1. Add the authoring entry carrying the pedagogy block.
2. Add the `ScreenRenderer` route.
3. Regenerate — which **fails**, because `projectPedagogy` refuses to hold the
   same classification twice. That failure is the proof the entry now carries
   the fact.
4. Only then delete the `calculationBreakdown` entry from
   `NON_AUTHORING_PEDAGOGY`.
5. Regenerate and prove no observable value changed.

**Exit evidence:** the flat `calculationBreakdown` pedagogy line is
byte-identical before and after; the pedagogy diff is additions only; the
authoring diff is additions plus exactly one rewritten line — the sanctioned
component-identity change.

Nothing about `CalculationBreakdown` is deleted or hidden: component, record,
contract, invariants, fixtures, Lab preview and all five presentations survive.

---

## Step 4 — Authoring-keyed Lab projection

`scripts/generate-lab-registry.mjs` → `src/data/generated/componentLabRegistry.js`,
wired as `pnpm lab:generate` / `pnpm lab:check` and added to `pnpm verify`.

One row per non-legacy authoring entry, keyed `level:type`. A record with
`authoring: null` produces no row — that is how infrastructure is excluded
structurally rather than by a list.

Serialisable generated facts only: authoring key, owning record id, component
identity, authoring name, level, layout, status, `derivedFrom`, required /
requiredAny, continuation, header mode, pedagogy, Decision guidance, lifecycle,
contract criticality, and drift-checked content usage (D1).

Guards: generated-file header; no JSX, functions or React; no catalogue import;
deterministic bytes.

**Exit:** `lab:generate && lab:check` clean; 58 rows (57 active + 1 derived).

---

## Step 5 — Adapter layer keyed by authoring key

`src/dev/componentReview/` restructured so every adapter carries an
`authoringKey`. Every existing render adapter, fixture and variant is preserved
verbatim — this step moves code, it does not rewrite previews.

- `fixtures.base.js` export names are **frozen**; `GuidedExamResponse.stories.jsx`
  imports from it.
- Adapters carry only React imports, JSX, fixtures, render callbacks, subject
  and example palette, render framing, controlled state, authoring-mode
  examples and preview-only variants. No canonical name, usage prose,
  alternatives, lifecycle, authorability or pedagogy — the shell reads those
  from the projection.
- The ten handler-backed types mount `ScreenRenderer` with a minimal valid
  one-block fixture (D4). No handler is exported.
- Collapse into variants: `GraphView` ×2 → 1, `InteractiveHotspotImage` ×2 → 1,
  `BuilderBlock` ×3 → 1.
- Expand into separate rows: `timelineChain` and `oppositeQualitiesReveal`, each
  screen **and** block.
- `misconceptionCheck` binds to the **block** entry; the derived screen route
  renders as a presentation beneath it.
- `face-the-examiner` binds to the public `FaceTheExaminer.jsx` (D5.2).

---

## Step 6 — System reference (D3)

`?systemReference=true`, its own lazy chunk, holding the five category C items:
`ButtonsAndProgressPage` (moved unchanged) plus live previews of
`ChapterHookScreen`, `ChapterOutcomeScreen`, `ChapterCompleteScreen` and
`WeakSpotRecovery`.

No category C item stays in the Lab as disabled, catalogue-only or
non-previewable. Nothing is deleted. The Lab's own access model is untouched.

---

## Step 7 — Bidirectional coverage guard, mutation-tested

`tests/architecture/component-lab-authoring-coverage.test.js`:

- every adapter's `authoringKey` resolves to an **active** projection row;
- every **active** projection row has exactly one adapter;
- no adapter binds a legacy, derived-only or unknown key;
- every derived row names an active `derivedFrom` that has an adapter;
- every selection ships a minimal content shape the real chapter validator
  accepts;
- every selection resolves through a real renderer route.

Eight mutations, each failing a **named** assertion and reverting cleanly:

| # | Mutation |
|---|---|
| 1 | remove a Lab adapter |
| 2 | add an active authoring entry with no adapter |
| 3 | bind an adapter to a legacy entry |
| 4 | bind an adapter to a derived-only entry |
| 5 | bind an adapter to an unknown key |
| 6 | add a Lab selection with no authoring entry |
| 7 | diverge a generated usage count |
| 8 | import a private handler directly / remove a ScreenRenderer fixture route |

---

## Step 8 — Source-comment corrections

Correct the four false production-boundary claims (Census 1), matching the
already accurate `src/App.jsx:5-11`.

**Comments only.** No change to access, query flag, entry card, auth bypass,
app-replacement, exit behaviour, URL structure or learner reachability.

---

## Step 9 — Verification

| Check | Evidence |
|---|---|
| Coverage contract 2 | Step 7's guard passes: 100% both directions over 57 active entries |
| Derived route | Accounted for, not selectable; mutation 4 proves it |
| Authoring completeness | All ten requirements per selection |
| Shim handover | Pedagogy line byte-identical; diffs additions-only |
| CalculationBreakdown intact | Component, record, contract and all five presentations present and previewable |
| Category C | All five previewable in System reference, none in the Lab |
| Private handlers | Still private; no new export |
| Usage | Current and drift-checked |
| Generators | `catalogue:check`, `authoring:check`, `pedagogy:check`, `lab:check` clean |
| Bundle | Lab and System reference both lazy owner chunks; learner entry free of catalogue and Lab governance data |
| Access | `?componentReview=true`, entry card, auth bypass, exit and learner navigation unchanged |
| Full gate | `pnpm verify` passes |

---

## Coverage baseline strategy

| Baseline | Status |
|---|---|
| `current-authoring-coverage.json` | **Governing.** Regenerated at Step 9 against active entries; target 0 missing, 0 routeless |
| `current-catalogue-coverage.json` | **Demoted, retained.** The catalogue-population record. Not a Lab target |
| `current-lab-manifest.json` | The pre-Phase-4 Lab population, retained as the preservation baseline |
| `current-content-type-usage.json` | **Superseded by the structural scan**, retained as the prior regex evidence and the record of what it got wrong |
| `current-bundle-baseline.md` | Bundle comparison point |

---

## Risk register

| Risk | Mitigation |
|---|---|
| A preview is silently dropped | Every removal is a reviewed diff against the retained Lab manifest baseline |
| Pedagogy classification lost when the shim goes | Enforced by the generator's collision guard, plus the byte-identity evidence in Step 3 |
| A fake authoring type gets registered to keep an item | Step 7 requires a renderer route and a validator-accepted content shape, which a fake type cannot produce |
| A derived route becomes a public option | `derivedFrom` in the schema plus mutation 4 |
| The ten handler types get previewed by exporting private handlers | D4's fixture route, plus mutation 8 |
| Generated usage churns on content commits | Accepted under D1; the content workflow gains an explicit regenerate step |
| Fixture rename breaks Storybook | `fixtures.base.js` export names frozen |
| New sibling surface drifts into the Lab's access model | System reference has its own flag and shell; the Lab's access assertions are kept and extended |

---

## Executed — measured results

Every figure below was produced by a green run, not estimated.

### The coverage contract

| | Target | Measured |
|---|---|---|
| Projection rows | 58 | **58** |
| Active authoring entries | 57 | **57** |
| — selectable in the Lab | 57 | **57** |
| — missing | 0 | **0** |
| Lab selections with no active entry | 0 | **0** |
| Derived routes accounted for | 1 | **1** |
| Derived routes selectable | 0 | **0** |
| Legacy entries in the projection | 0 | **0** |
| Category C items in the Lab | 0 | **0** |
| Category C items on System reference | 5 | **5** |
| Selections with a validator-accepted minimal chapter shape | 57 | **57** |
| Total preview units (selections + modes + variants + presentations) | — | **114** |

Machine-readable: `baselines/current-authoring-coverage.json`, key
`measuredAfterPhase4`, plus the full `finalSelections` list.

### Nothing was dropped

`tests/architecture/component-lab-preview-preservation.test.js` maps all 49
pre-Phase-4 entries and all 60 variants to a stated destination — `lab`,
`variant` or `system` — and asserts it. "Deleted" is not a destination, and the
mapping is checked for both over- and under-coverage, so a future change that
quietly removes a preview fails with its name.

One variant was promoted rather than preserved in place:
`circuit-diagram/symbol-reference` mounted a different component through a
variant slot, and is now `block:circuitSymbolReference`, a selection of its own.

### Mutation testing

Nine mutations applied to the real files, each run against the real guard, each
reverted (`git status` clean afterwards):

| # | Mutation | Caught by |
|---|---|---|
| 1 | remove a Lab adapter | *leaves no active entry without an adapter* |
| 2 | add an active authoring entry with no adapter | `lab:check` drift, then the coverage guard |
| 3 | bind an adapter to a legacy entry | *binds no adapter to a missing, legacy or derived entry* |
| 4 | bind an adapter to a derived-only entry | *binds no adapter to a missing, legacy or derived entry* |
| 5 | bind an adapter to an unknown key | same |
| 6 | add a Lab selection with no authoring entry | same |
| 7 | diverge a generated usage count | `lab:check` drift |
| 8a | import a private handler directly | *importing a private handler into the Lab fails this assertion* |
| 8b | remove a ScreenRenderer fixture route | *…satisfies all ten requirements* |

8a initially escaped: the first guard matched `import { X } from` only, so
`import ScreenRenderer, { ReadBlock } from` slipped past. The guard now extracts
the import clause first and searches it second, and asserts all three forms —
bare named, default-plus-named and aliased.

### Runtime, at 390px

Both surfaces driven in a real browser at 390 × 844:

- Lab index lists **57** rows and says "57 choices"; no category C item appears.
- `block:read` — the most-used authoring type — previews through the real
  `ScreenRenderer`, showing `ScreenRenderer · ReadBlock`, `text (string)` and
  "261 uses across 23 files", all read from the projection.
- `block:misconceptionCheck` offers its derived screen route as a labelled
  runtime presentation, not as a second index row.
- `screen:calculationBreakdown` shows all five authoring modes and both preview
  variants.
- System reference lists and renders all five category C items.
- The learner app still loads normally with no flag set.

No uncaught JS exceptions. (The `ERR_CONNECTION_RESET` console lines are the
sandbox's blocked font requests, documented in `scripts/screenshot.mjs`.)

### Gates

`pnpm verify` green end to end: `catalogue:check`, `authoring:check`,
`pedagogy:check` and `lab:check` all clean; **1779** architecture tests,
**1227** unit tests, **301** Storybook browser tests; lint 0 errors (90
warnings, unchanged from the baseline); build succeeds.

> **Corrected.** This line first read 1718, which was the count at the point the
> commit message was drafted — before the preview-preservation guard was added.
> The successful `pnpm verify` run printed **1779**. The number here is now the
> one the passing command actually printed.

### Bundle

Measured and reported, not budgeted — see `baselines/current-bundle-baseline.md`.
The one number worth reading: routing the six figure blocks moves **+167 kB raw
/ +47 kB gzip** out of the Lab-only chunk and into the chapter-runtime chunk,
because a runtime that can render a type must be able to load it. That is a real
cost to learners and is recorded with its two options; choosing between them is
a separate decision.

---

## Step 10 — Bundle closure (executed)

The one cost Phase 4 recorded rather than fixed — the six figure renderers
sitting synchronously in the chapter-runtime chunk — is now removed, without
introducing a loading interruption during normal progression.

**Neither of the two options as written.** Accepting the cost was rejected on
the numbers (all six types have zero content uses, so every learner paid
47 kB gzip for engines no chapter renders, and each future engine would have
joined the same list). Plain `React.lazy` was rejected on the experience (a
spinner arriving mid-sequence, with a layout jump behind it). What shipped is
deferred loading **plus chapter-aware preloading**: the runtime starts the
downloads for exactly the types a chapter contains the moment its definition
resolves, screens ahead of where they are needed.

| Piece | Where |
|---|---|
| Six stable per-component loaders, one dynamic import each | `src/components/layout/deferredFigureLoaders.js` |
| Pure structural scanner over `screens[].blocks[]` | `src/data/deferredFigureTypes.js` |
| Preload at chapter resolution, not awaited | `LegacyApp.loadChapterContent` |
| `lazy()` routes, per-block Suspense, error boundary, reserved frame | `src/components/layout/deferredFigures.jsx` |

Both new files are owned as private internals of the `ScreenRenderer` record —
routing machinery, not author choices.

### Measured

| Chapter-runtime chunk | Raw | Gzip |
|---|---|---|
| Synchronous (Phase 4 as shipped) | 808.49 kB | 226.85 kB |
| Deferred (this closure) | **642.19 kB** | **179.72 kB** |
| Pre-route control | 641.17 kB | 179.37 kB |

−166.30 kB raw / −47.13 kB gzip, landing +1.02 kB / +0.35 kB above the control —
the wrapper itself, not variance. Six separate figure chunks, 4.10 kB to
48.89 kB. Learner entry +1.71 kB raw for the scanner and the six thunks; no
figure engine reaches the entry or the chapter-runtime chunk.

### Verified in a real browser, on the production bundle

| Case | Figure chunks requested |
|---|---|
| History chapter, no figure blocks | none of the six |
| Maths chapter with one `angleFigure` | `AngleExplore` only |
| Same, with that chunk aborted | chapter opened, no page errors |

The two figure cases needed a chapter that contains one, so a single block was
added to `math3` for the measurement and reverted — the same technique as the
control build. No content is committed.

Render-time states are covered deterministically in
`src/components/layout/deferredFigures.stories.jsx`: a module that never
resolves shows the reserved "Diagram loading" frame at real height inside the
content column, and a module that rejects is caught by the boundary and shows
"Diagram unavailable" while the surrounding screen carries on.

### Mutations

Seven applied to the real files, each caught by a named assertion, all reverted
(`git status` clean):

| # | Mutation | Caught by |
|---|---|---|
| 1 | restore one static figure import | *angleFigure → AngleExplore.jsx is not statically imported* |
| 2 | remove one loader | *covers the scanned set in both directions* |
| 3 | remove one type from the scanner map | *keeps one dynamic import per figure, not one merged chunk* |
| 4 | scanner returns duplicate types | *a scanner that returns duplicates fails this assertion* |
| 5 | scanner preloads an unused figure | *a scanner that preloads an unused figure fails this assertion* |
| 6 | remove one Suspense boundary | *circuitSymbolReference is wrapped in DeferredFigure* |
| 7 | drop the chapter-aware preload call | *calls the preloader from the one place chapter content resolves* |

### Gates

`pnpm verify` green: four generator checks clean, **1831** architecture tests,
**1243** unit tests, **304** Storybook browser tests, lint **0 errors and 90
warnings** — the baseline — and the build succeeds.

The Phase 4 authoring architecture is untouched: 57 ↔ 57 coverage, adapters,
authoring types, generated projection, System reference, both access flags,
catalogue records, pedagogy and chapter content all unchanged.

---

## Step 11 — Seal (executed)

The closure briefly cost one lint warning: `deferredFigures.jsx` exported the
six lazy components *and* `DEFERRED_FIGURE_COMPONENTS`, and a file that exports
a component alongside a constant loses fast refresh for everything in it.

Fixed by moving, not by silencing — no `eslint-disable`, no rule change. The map
now lives in `src/components/layout/deferredFigureComponentMap.js`, which
imports the six lazy components and exports the frozen authoring-type map the
architecture guard reads. `deferredFigures.jsx` is left exporting components
only: the six `Lazy*` renderers, `FigurePlaceholder` and `DeferredFigure`. The
new module is owned as a private internal of the `ScreenRenderer` record, like
the two files beside it.

**Nothing else moved, and the evidence is unusually direct:**

| Claim | Evidence |
|---|---|
| `ScreenRenderer` unchanged | `git diff` on it is empty — it still imports the six lazy components by name |
| Loader, scanner, preload unchanged | `git diff` on `deferredFigureLoaders.js`, `deferredFigureTypes.js` and `LegacyApp.jsx` is empty |
| Suspense and error boundary unchanged | The only diff in `deferredFigures.jsx` is the removed map, replaced by a comment |
| Bundle unchanged | Every chunk **including its content hash** is identical before and after. The map is imported only by the test, so it is never bundled |
| Mutations still effective | All seven re-run against the real files, each caught by the same named assertion, all reverted clean |
| Lint back to baseline | 91 → **90** warnings, 0 errors; all four deferred-loading files lint clean |
