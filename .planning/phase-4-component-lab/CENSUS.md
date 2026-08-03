# Phase 4 — Component Lab census

Baseline SHA: `d2c0030f80730db42e0b5097319ae5292966b078`
Method: every number below was measured at that SHA, not estimated. The tooling
used is described per census; the machine-readable output is under `baselines/`.

**Headline numbers**

| Fact | Value |
|---|---|
| Catalogue records | 84 |
| Lab entries | 49 |
| Lab preview variants | 60 |
| Selectable preview units (entries + variants) | 102 |
| Catalogue records represented in the Lab today | 56 |
| Catalogue records not represented today | 28 |
| Lab entries with no catalogue record | 2 |
| Lab chunk (raw / gzip) | 356.16 kB / 105.76 kB |

---

## Census 1 — Lab structure and consumer graph

`src/dev/componentReview/` holds six files, 3,312 lines.

| File | Lines | Role | Holds |
|---|---|---|---|
| `ComponentReviewLab.jsx` | 495 | Lab shell: index, preview view, filters, grouping, nav, error boundary, scope isolation | UI shell code only |
| `reviewManifestCore.jsx` | 951 | The manifest: 45 raw entries, imports, render adapters, prose, status vocabularies | Catalogue facts + adapters + prose + review judgement, all interleaved |
| `reviewManifest.jsx` | 276 | Composition layer: extends 3 entries, appends 1, re-exports | Adapters + prose overrides |
| `fixtures.base.js` | 847 | 44 exported fixtures | Fixture data |
| `fixtures.js` | 553 | `export *` from base, then 17 overrides/additions | Fixture data |
| `ButtonsAndProgressPage.jsx` | 190 | Governed reference page for buttons, dividers and progress indicators | UI shell + live component renders |

### Production-bundle reachability

All six files are **production-bundled**. `src/App.jsx` lazy-loads
`ComponentReviewLab.jsx`; everything else is reached statically from it. See
`baselines/current-bundle-baseline.md` for measured sizes and the proof that no
Lab code leaks into the learner entry chunk.

### Entry points and boundaries

| Boundary | Where | State |
|---|---|---|
| Lazy import | `src/App.jsx:12` | `lazy(() => import('./dev/componentReview/ComponentReviewLab.jsx'))` |
| Query-flag resolution | `src/App.jsx:14-17` | `?componentReview=true`, read from `window.location.search` |
| Replaces learner app | `src/App.jsx:23-29` | Returns the Lab **instead of** `LegacyApp`, bypassing auth, onboarding, tabs, nav |
| History-browser card | `src/features/subjects/Subjects.jsx:341-346` | `window.location.assign(pathname + '?componentReview=true')` |
| Exit to app | `ComponentReviewLab.jsx:60-63` | `window.location.assign(window.location.pathname)` — drops the flag and reloads |
| Storage-scope isolation | `ComponentReviewLab.jsx:84-88` | `setActiveScope('devreview')` on mount, previous scope restored on unmount |
| Lazy-import guard | `tests/architecture/component-catalogue-integrity.test.js:408` | Asserts `src/App.jsx` contains the exact import string |
| Private-family guard | `tests/architecture/chapter-player-private-family.test.js:103` | Asserts `reviewManifestCore.jsx` never offers `ChapterGateLayer` / `ChapterBottomNavigation` |
| Token governance | `tests/architecture/feedback-token-governance.test.js:35` | `ComponentReviewLab.jsx` carries an allowance entry |
| Fixture reuse guard | `tests/architecture/timeline-canvas.architecture.test.js:14-15` | Reads both fixture files |
| Storybook reuse | `src/components/learning/GuidedExamResponse.stories.jsx:3` | Imports `guidedExamResponse` from `fixtures.base.js` |

**Storybook already depends on Lab fixtures.** That is a real coupling: the
fixtures file is not purely a Lab-internal concern. Phase 4 must not break it.

### Bundle implications — confirmed, not assumed

- Lab chunk: **356.16 kB raw / 105.76 kB gzip**, its own file.
- Dominant contributor: the eager component imports in `reviewManifestCore.jsx`
  (44 component imports) plus 1,400 lines of fixtures.
- **Every component is imported eagerly.** No `React.lazy()` or dynamic
  `import()` exists anywhere under `src/dev/componentReview/`.
- **Variants add fixture data and props, not code** — with one exception:
  `circuit-diagram/symbol-reference` mounts `CircuitSymbolReference`, a distinct
  component reached through a variant slot.
- **No Lab code leaks into the learner entry chunk** (measured; see baseline).

### Stale-prose claims about the production boundary (settled boundary 5)

| File | Line | Claim | Reality |
|---|---|---|---|
| `ComponentReviewLab.jsx` | 3–5 | "DEVELOPMENT-ONLY … in a DEV build (see src/App.jsx gate); never part of learner navigation and **tree-shaken out of production**" | False. Production-bundled, reachable in every build. Also "never part of learner navigation" is contradicted by the Subjects.jsx entry card |
| `reviewManifestCore.jsx` | 3 | "DEVELOPMENT-ONLY." | Misleading — it is an owner tool shipped to production |
| `reviewManifestCore.jsx` | 9 | "This whole directory is **excluded from production builds** (src/App.jsx dev gate)." | False on both counts: not excluded, and `src/App.jsx` has no dev gate |
| `ButtonsAndProgressPage.jsx` | 3 | "DEVELOPMENT-ONLY." | Misleading, as above |
| `ButtonsAndProgressPage.jsx` | 6 | "Nothing here is learner-facing." | True in intent (learners never open it), but sits beside the false claims above |
| `ComponentReviewLab.jsx` | 168 | UI label "Development tool" | Owner-facing label; not false, but inconsistent with the shipped-owner-tool framing |

`src/App.jsx:5-11` is **already accurate** ("reachable in every build (including
production)"). The drift is confined to the Lab's own file headers. Correcting
these comments changes no behaviour and is in scope for the implementation phase.

---

## Census 2 — current manifest anatomy

Captured deterministically into `baselines/current-lab-manifest.json` by
bundling `reviewManifest.jsx` with esbuild, stubbing **only** `react` and
`src/components/**`, and leaving every plain data module real — so derived
fields in the baseline are the true runtime values. JSX is represented by the
component names each adapter mounts; functions are never serialised. All 102
render adapters were probe-executed: **zero failures**.

### Composition

`reviewManifest.jsx` composes the final `REVIEW_ENTRIES` from
`reviewManifestCore.jsx`'s 45 `RAW_ENTRIES`:

- `angle-explore` → extended (prose rewritten, variants 6 → 13), and
  `area-perimeter-explore` **inserted immediately after it**
- `acronym-memorise` → render wrapped in `TeachScreenShell`
- `calculation-breakdown` → extended (prose rewritten, 0 → 7 variants)
- all others pass through unchanged

Result: **49 entries, 60 variants, 102 selectable units.**

### Findings

**Duplicate entries for one catalogue record**

| Record | Lab entries |
|---|---|
| `GraphView` | `graph-view-scatter`, `graph-view-line` — same component, same `contentType`, different fixture |
| `InteractiveHotspotImage` | `interactive-hotspot-image`, `interactive-hotspot-image-reveal` — same component, `variant="reveal"` prop |
| `BuilderBlock` | `builder-block`, `builder-block-maths`, `builder-block-quote` — same component, three layouts |

Six entries represent three records. All three predate the variant mechanism and
would today be expressed as variants of a single entry.

**Entries whose displayed name differs from catalogue identity**

| Lab entry | Displays | Catalogue identity |
|---|---|---|
| `face-the-examiner` | `FaceTheExaminerContainer` | `FaceTheExaminer` (`src/components/learning/FaceTheExaminer.jsx`) |
| `examiner-explains-screen` | `WhatExaminersLookFor` | `WhatExaminersLookFor` — but the entry **id** says `examiner-explains-screen`, which is a *different* parked record (`ExaminerExplainsScreen`) |
| `graph-view-scatter` / `-line` | `GraphView (scatter)` / `GraphView (line)` | `GraphView` |
| `builder-block*` | `BuilderBlock — reaction` / `— Maths` / `— quote` | `BuilderBlock` |
| `interactive-hotspot-image-reveal` | `InteractiveHotspotImage (reveal)` | `InteractiveHotspotImage` |

**`face-the-examiner` reaches past a private boundary.** `reviewManifestCore.jsx`
imports `../../components/learning/faceTheExaminer/FaceTheExaminerContainer.jsx`
directly. The `face-the-examiner` record claims
`src/components/learning/faceTheExaminer` as an **internal directory**, and
`FaceTheExaminer.jsx` exists precisely as the public compatibility export
(`export { default } from './faceTheExaminer/FaceTheExaminerContainer.jsx'`).
The Lab is importing the family internal rather than the public identity.

**Lab entries with no catalogue record (orphans): 2**

| Entry | Component | Assessment |
|---|---|---|
| `buttons-and-progress` | `ButtonsAndProgressPage` (Lab-local) | Correct as-is — a Lab reference page, not a product component |
| `face-the-examiner` | `FaceTheExaminerContainer` | Not a true orphan — a boundary violation of the `FaceTheExaminer` record |

**Entries whose `contentType` no longer exists:** none. All 35 distinct
`contentType` values resolve in the generated pedagogy registry (verified: every
derived `interaction` returned a real class, and the `uncategorised` fallback at
`reviewManifestCore.jsx:949` never fires — the `uncategorised` label in
`INTERACTION_LABELS` is dead vocabulary).

**Interaction derivation:** 39 entries derive `interaction` via
`getTypeInfo(contentType)` (35 distinct types); **10** carry a hand-written
`interaction`: `circuit-diagram`, `buttons-and-progress`,
`chapter-outcome-screen`, `chapter-complete-screen`, `chapter-hook-screen`,
`weak-spot-recovery`, `angle-explore`, `area-perimeter-explore`,
`coordinate-plane-explore`, `number-line-explore`.

**Entries with no authoring type: 10** — the same ten. Four of these —
`ChapterOutcomeScreen`, `ChapterCompleteScreen`, `ChapterHookScreen`,
`WeakSpotRecovery` — **do** have catalogue records; they are structural screens
the runtime places, so they have no authorable type by design.

**Raw token/reference examples that are not components:** `buttons-and-progress`
renders three non-component patterns inline — the `BUTTONS` token tiers, the
`cinematic-primary-action` CSS class, the `NavArrow` local SVG pattern, and the
generic pill progress bar. These are legitimately Lab-authored, not catalogue
facts.

**Component family represented rather than a single export:** `circuit-diagram`
is one entry covering both `CircuitDiagram` and `CircuitSymbolReference`.

---

## Census 3 — catalogue-to-Lab coverage

Full per-record table: `baselines/current-catalogue-coverage.json`.

Every one of the 84 records is assigned **exactly one** target category, with a
stated reason. Totals reconcile with no remainder.

| # | Category | Count |
|---|---|---|
| 1 | Directly previewable standalone component | 45 |
| 2 | Previewable through a component-family owner | 0 |
| 3 | Represented as a variant of another Lab preview | 2 |
| 4 | Represented on a governed reference page | 20 |
| 5 | Visual runtime/layout component that needs a preview adapter | 7 |
| 6 | Non-visual support primitive | 1 |
| 7 | Private family internal — must not be independently selectable | 0 |
| 8 | Owner/runtime shell — meaningful to list, not to mount standalone | 2 |
| 9 | Genuinely not previewable | 2 |
| 10 | Unaccounted — requires a decision | 5 |
| | **TOTAL** | **84** |

Category 2 and category 7 are legitimately **zero**: private family internals
(`faceTheExaminer/*`, `chapterPlayer/*`, `circuit/CircuitPrimitives.jsx`) are not
catalogued as separate records at all, so no record needs those categories. The
existing guard in `chapter-player-private-family.test.js` already enforces that
for the one family where the risk was real.

### The three separate questions

| Question | Answer |
|---|---|
| Does it exist in the catalogue? | 84 / 84 |
| Should it appear in the Lab index? | 81 — all except `InlineNavigationContext` (cat 6), `HomeAtmosphere` and `ExaminerExplainsScreen` (cat 9) |
| Can it be mounted as an independent interactive preview? | 72 — excludes cats 6, 8, 9 and the two `ChapterPlayer`/`ScreenRenderer` shells |

These are not the same question, and the current Lab conflates them: it lists
only what it can mount.

### Current representation

| | Count |
|---|---|
| Mounted as its own Lab entry or variant | 46 |
| Rendered live on the reference page | 10 |
| **Represented today** | **56** |
| **Not represented today** | **28** |

### The 28 missing, by why they are missing

**Reusable learning components simply absent (5)** — the sharpest gaps:

| Record | Evidence |
|---|---|
| `ExamQuestionFrame` | Implements `block:boss` — **61 content uses across 17 files**, the most-used authorable type with no Lab preview |
| `PriorKnowledgeRecall` | Implements `screen:priorKnowledgeRecall` — 6 content uses across 6 files |
| `RecoveryQuizPlayer` | `kind: reusable`, `lifecycle: active`, `decision: complete` |
| `FractionRatioExplore` | `lifecycle: reviewing`, decision complete — its four Maths Explore siblings are all previewed |
| `FaceTheExaminer` | Represented, but under the wrong identity (see Census 2) |

**Support primitives absent from the reference page (10)** — `CardContainer`,
`ScreenText`, `ScreenTextBlock`, `SegmentedControl`, `AnimatedNumber`,
`ExamPrompt`, `LearningHeader`, `SaveFailureNotice`, `MediaPlaceholder`,
`AnswerInteraction`. The last two are **authorable block types**
(`block:mediaPlaceholder`, `block:quiz`) with no preview at all.

**Visual runtime/layout components with no adapter (7)** — `InteractionShell`,
`CinematicShell`, `ProgressRecoveryCard`, `ExamRoundDebrief`, `RetrievalFrame`,
`UnifiedQuestionScreen`, `RecoveryQuizPlayer`.

**Deliberate exclusions (6)** — `ChapterPlayer`, `ScreenRenderer` (cat 8);
`ExaminerExplainsScreen`, `HomeAtmosphere` (cat 9); `InlineNavigationContext`
(cat 6); `GuidedAnswerCoach` (cat 10).

### A contradiction the Lab asserts and the catalogue denies

`reviewManifestCore.jsx:64-68` states that `MedievalDiagnosisScene`,
`UnifiedQuestionScreen` and `RecoveryQuizPlayer` "are internal children … and
are not independently selectable module-building choices".

The catalogue disagrees for two of the three:

| Component | Lab comment | Catalogue record |
|---|---|---|
| `UnifiedQuestionScreen` | "internal child" | Own record, `kind: runtime`, `lifecycle: active` |
| `RecoveryQuizPlayer` | "internal child" | Own record, `kind: reusable`, `lifecycle: active`, `decision: complete` |
| `MedievalDiagnosisScene` | "internal child" | **No record** — consistent |

This is precisely the drift Phase 4 exists to remove: the Lab is asserting a
lifecycle fact the catalogue already owns, and getting it wrong.

---

## Census 4 — what each manifest field really is

Classification of every field carried by `RAW_ENTRIES`:

| Field | Class | Verdict |
|---|---|---|
| `id` | **F — duplicated** | A second identifier alongside the catalogue record id. `graph-view-scatter` etc. exist only because entries duplicate records. Should be derived from the record id plus a variant discriminator |
| `name` | **F — duplicated / drifting** | Duplicates `record.name`, and drifts from it in 5 entries (Census 2). Catalogue fact |
| `contentType` | **B — generated derivation** | Already a catalogue fact via `authoring.entries[].type`. Note: it is level-blind — the Lab carries one `contentType` where the catalogue distinguishes `screen:` from `block:` |
| `interaction` | **B for 39 / D-or-E for 10** | The 39 derived values are already catalogue-owned. The 10 manual values are review judgement about components with no authoring entry — see below |
| `status` | **E — temporary review judgement** | Not a catalogue fact in its current form. See Census 5 |
| `subject` | **D — preview adapter fact** | Which subject palette the *example* uses. Not a component property — `TheoryCompare` is not a History component |
| `renderMode` | **D — preview adapter fact** | Genuinely about how the Lab frames the preview. Correlates with `authoring.layout` (`full`/`content`) but is not the same thing: it must also be set for the 8 entries with no authoring entry |
| `function` | **F — duplicated** | Overlaps `documentation.bestUsedFor` and `purpose`. Catalogue fact |
| `usage` | **C — generated derivation from content usage** | Should be computed, not written. 2 of 49 are provably wrong (Census 6) |
| `alternative` | **F — duplicated** | Overlaps `decision.chooseInstead`. Catalogue fact |
| `fixture` | **D — preview adapter fact** | Correctly handwritten |
| `variants` | **D — preview adapter fact** | Correctly handwritten. `label`/`description` are Lab-authored review prose, not catalogue facts |
| `render` | **D — preview adapter fact** | Correctly handwritten. Must stay out of the catalogue |

### Confirming the expected ownership lists

The brief's candidate list is **confirmed with three corrections**:

- **`renderMode` is not a clean derivation of `authoring.layout`.** Eight Lab
  entries have no authoring entry at all, and `acronym-memorise` is `inline`
  while its block layout is `content` — related but not identical vocabularies.
  Keep it as an adapter fact with the catalogue layout available as a default.
- **`contentType` must become level-aware.** The catalogue distinguishes
  `screen:timelineChain` from `block:timelineChain` (two separate records:
  `TimelineChain` and `TimelineChainBlock`). A flat `contentType` cannot express
  that, which is exactly why `TimelineChainBlock` has no Lab presence.
- **"Deterministic content usage counts" are viable and should be generated.**
  Measured across 68 content files; see `baselines/current-content-type-usage.json`.
  Two independent quoting styles exist in content (`type: 'x'` and `"type": "x"`)
  and any generator must match both — matching only the first understates
  `read` by 194 uses and reports `spotTheError`, `builder` and `acronymMemorise`
  as unused when they are not.

**Nothing should be promoted into the catalogue merely because the Lab displays
it.** `status`, `subject`, `renderMode`, variant labels and review prose all stay
out.

---

## Census 5 — status and filter semantics

Distribution across 49 entries: `comparison` 33, `one-off` 9, `routed-unused` 5,
`unused` 1, `reference` 1.

Filters (`ComponentReviewLab.jsx:27-41`): `all`, `unused` (matches `unused` **or**
`routed-unused`), `one-off`, `comparison`. **`reference` has no filter** — the
`buttons-and-progress` entry is reachable only via `all`.

### What each status actually means

| Status | Claimed meaning | What it is in practice | Generable? |
|---|---|---|---|
| `unused` | Not routed, not used | Used once, for `circuit-diagram` — a component with no authoring type at all. Conflates "no authoring entry" with "no content uses" | Partly — the two facts are separately generable, but not as one value |
| `routed-unused` | Has an authoring type, no content uses | True for 4 of 5. **Stale for `spot-the-error`**, which has 1 content use | Yes — `authoring entry exists AND usage count === 0` |
| `one-off` | Used once | **Not what it means.** `timeline-chain` carries it with 8 uses across 6 files. Others range 1–2 uses | Yes, if redefined as `usage count === 1` |
| `comparison` | "Active comparison components (not deletion candidates)" | A catch-all. 33 of 49 entries, spanning 0 to 25 content uses, active and reviewing lifecycles, complete and pending decisions. Correlates with nothing | No — it encodes no fact |
| `reference` | Reference page | A **kind of Lab entry**, not a component status. Mutually exclusive with the other four by nature, not by value | It is an adapter fact, not a status |

### Contradictions found

1. **`one-off` does not mean one use.** `timeline-chain`: 8 uses / 6 files.
2. **`routed-unused` is stale for `spot-the-error`**, which is used in
   `src/content/biology/cell-biology/episodes/bio_building_blocks.js:560`. The
   entry prose even says "evidence shows it is unused" — that evidence has expired.
3. **`comparison` includes a zero-usage component** (`calculation-breakdown`)
   alongside the most-used ones (`col-sort-block`, 25 uses).
4. **`reference` is a different axis entirely** and breaks the filter model —
   it is the one status with no filter.
5. **`unused` vs `routed-unused` splits on routing**, but `circuit-diagram`'s
   real distinction from `memory-hook` is *no authoring entry* vs *authoring entry
   with no uses* — a catalogue fact, stated in Lab vocabulary.

### Comparison with canonical catalogue fields

| Lab status | Nearest catalogue fact | Same thing? |
|---|---|---|
| `unused` / `routed-unused` | `authoring === null` + measured usage | No — two facts fused into one |
| `one-off` | measured usage count | No — value does not track it |
| `comparison` | `lifecycle: active` | No — spans lifecycles and decision statuses |
| `reference` | `kind` | No — `reference` is a Lab presentation kind |
| *(nothing)* | `lifecycle: reviewing` (7 records) | Unexpressed |
| *(nothing)* | `decision.status: pending` (9 records) | Unexpressed |
| *(nothing)* | `contract.criticality: critical` (17 records) | Unexpressed |

### Recommendation for the future index/filter model

Replace the single `status` axis with **four independent generated facts**, each
already owned by the catalogue or measurable:

1. **Lifecycle** — `active` / `reviewing` / `parked` / `internal` (catalogue).
2. **Authorability** — has authoring entries, and at which level (catalogue).
3. **Content usage** — measured occurrence count and file count (generated).
4. **Decision readiness** — `decision.status` (catalogue).

Plus one **Lab-owned presentation kind** (`preview` / `reference`) which is an
adapter fact, not a status.

"Unused", "routed-unused" and "one-off" then become *derived filters over facts*
rather than stored values that go stale — the `spot-the-error` and `timeline-chain`
errors become structurally impossible. `comparison` disappears; it carries no
information.

**No filter is changed in this phase.**

---

## Census 6 — usage, function and alternative prose

Evidence base: `baselines/current-content-type-usage.json` — 51 distinct
authored types across 68 content files, counted deterministically.

### Provably stale statements

| Entry | Claim | Measured reality |
|---|---|---|
| `spot-the-error` | "Routed in ChapterPlayer … but **no content file uses it**. (Brief lists it under one-off; evidence shows it is unused.)" | **1 use** in `bio_building_blocks.js:560` |
| `timeline-chain` | status `one-off`; "Now used in Episode 2 (both plague-progression + aftermath screens)" | **8 uses across 6 files** — the prose describes a migration that has since spread |

### Claims verified correct

`cinematic-carousel`, `graph-view-scatter`, `graph-view-line`, `memory-hook` and
`calculation-breakdown` all correctly report zero content usage. All remaining
"used in Episode N" claims are consistent with the measured counts.

### Prose that duplicates a catalogue field

| Lab field | Catalogue source that already carries it |
|---|---|
| `function` | `purpose`, `documentation.bestUsedFor` |
| `alternative` | `decision.chooseInstead`, `decision.doNotUseWhen` |
| `usage` (the "used in X" half) | generable from content usage |
| `usage` (the "routed in ChapterPlayer" half) | `authoring.entries[].type` + `status` |

### Routing claims that name the wrong owner

Eleven entries say "Routed in **ChapterPlayer** (type: x)". Routing moved to
`ScreenRenderer.jsx`, which `CLAUDE.md` names as "the only component-routing
boundary". `examiner-explains-screen` already says "routed by ScreenRenderer" —
so the codebase states both. All eleven are stale in the same way.

### Claims about retired types

No entry references `visualNarrative` or any other retired type. The
`VisualNarrativeScreen` retirement is clean in the Lab.

### Lab-specific review notes worth keeping

Not everything is duplicated. These are genuinely Lab-owned and have no catalogue
home:

- Variant `label` and `description` strings (60 of them) — they describe *what a
  particular preview demonstrates*, e.g. the `fixed-perimeter` variant's
  "Breaks the 'bigger perimeter means bigger area' assumption."
- The seven shared `REVIEW_QUESTIONS`.
- Preview-mode explanatory copy ("Smaller text here is preview scaling, not a
  token difference").
- Sanctioned-override notes, e.g. the `mobile-width` variant's explanation of why
  a transformed ancestor makes a genuine 320px render.

These belong in the handwritten adapter layer, not the catalogue.

---

## Evidence appendix — how each number was produced

| Number | Method |
|---|---|
| 84 catalogue records | `loadCatalogue()` from `src/component-catalogue/loadCatalogue.js`, run under Node |
| 49 entries / 60 variants / 102 units | esbuild bundle of `reviewManifest.jsx` with `react` and `src/components/**` stubbed; `REVIEW_ENTRIES` walked and serialised |
| Zero render-probe failures | All 102 adapters invoked with their resolved fixture; JSX captured by a recording factory |
| `interaction` values | Real — `src/data/componentFunctions.js` and both generated registries were left unstubbed |
| Content usage counts | Regex over 68 files under `src/content/**`, matching both `type: 'x'` and `"type": "x"` |
| Chunk sizes | `./node_modules/.bin/vite build` at the baseline SHA |
| Leakage check | grep of built `dist/assets/index-*.js` for Lab-only strings |
| Chunk sharing | Parsed `from"./…"` specifiers out of the built chunks |
