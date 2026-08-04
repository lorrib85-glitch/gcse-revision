# Bundle baseline — Component Lab

Captured at `d2c0030f80730db42e0b5097319ae5292966b078` by `./node_modules/.bin/vite build`.
Measured, not estimated. Any Phase 4 implementation must be able to show these
numbers again (or explain a deliberate change).

## The Lab's own chunk

| Chunk | Raw | Gzip |
|---|---|---|
| `assets/ComponentReviewLab-<hash>.js` | **356.16 kB** | **105.76 kB** |

This is one chunk. `React.lazy()` in `src/App.jsx` is the only thing that pulls
it, so a learner who never sets `?componentReview=true` never downloads it.

## What the Lab chunk depends on

The Lab chunk statically imports exactly two other chunks:

| Chunk | Raw | Gzip | Shared with |
|---|---|---|---|
| `assets/index-<hash>.js` (app entry) | 942.42 kB | 240.30 kB | everything |
| `assets/QuoteAnalyser-<hash>.js` | 556.77 kB | 156.29 kB | `ChapterPlayer-<hash>.js`, app entry |

**The `QuoteAnalyser-*.js` name is a Rollup artefact, not a description.** That
chunk is the shared learning-component chunk — `QuoteAnalyser.jsx` itself imports
only React, four constants files, `ContinueCTA`, `CinematicDivider` and one hook.
Rollup named the shared chunk after one of its members.

Confirmed shared, not Lab-only: `ChapterPlayer-<hash>.js` imports it too, so a
learner opening any chapter downloads it regardless of the Lab. The Lab's
**marginal** cost is therefore its own 356.16 kB chunk, not 356 + 557.

## Leakage into the learner entry — none

Grep of the built learner entry (`assets/index-<hash>.js`) for Lab-only strings:

| String | In learner entry | In Lab chunk |
|---|---|---|
| `devreview` | 0 | 1 |
| `Review questions` | 0 | 1 |
| `Preview variant` | 0 | 1 |
| `Closest alternative` | 0 | 1 |
| `Component review lab` | 1 | 1 |

The single hit in the learner entry is the **entry-card label** in
`src/features/subjects/Subjects.jsx`, not Lab code. No Lab shell, manifest or
fixture code reaches the learner entry chunk.

## Eager vs lazy inside the Lab chunk

Every component the Lab previews is imported **eagerly** at the top of
`reviewManifestCore.jsx` / `reviewManifest.jsx` — there is no `React.lazy()` or
dynamic `import()` anywhere under `src/dev/componentReview/`. Opening the Lab
index therefore downloads every preview's code, not just the one being viewed.

## Variants add fixture data, not code

Of the 60 variants captured in `current-lab-manifest.json`, none imports a
component that the entry does not already import. Variants differ only by props,
fixture selection, or a wrapper the manifest already imports (`TeachScreenShell`,
`ContentShell`). The one exception is the `circuit-diagram` entry's
`symbol-reference` variant, which mounts `CircuitSymbolReference` — a genuinely
different component reached through a variant slot.

## Recorded options (not decisions — see DESIGN.md)

1. Leave eager. 356 kB behind a flag the owner sets deliberately is defensible.
2. Split preview adapters per component behind `React.lazy()`, so the index costs
   metadata only and each preview loads on open.
3. Split the reference page (`ButtonsAndProgressPage`) separately — it is the one
   entry that imports ten otherwise-unused core components.

No option is chosen here. The census records evidence; DESIGN.md states which is
in scope for Phase 4.

---

# Measured again after Phase 4

Same method: `./node_modules/.bin/vite build`, at the Phase 4 implementation
commit. Reported, not budgeted — no target was set.

## The two owner chunks

| Chunk | Raw | Gzip | Was |
|---|---|---|---|
| `assets/ComponentReviewLab-<hash>.js` | **156.43 kB** | **41.29 kB** | 356.16 kB / 105.76 kB |
| `assets/labShell-<hash>.js` (shared shell) | 36.29 kB | 14.14 kB | — (new) |
| `assets/SystemReference-<hash>.js` | 15.77 kB | 5.33 kB | — (new) |

Both surfaces are still lazily imported from `src/App.jsx`, each behind its own
query flag, so a learner who sets neither downloads neither.

The Lab's own chunk roughly halved, but that number on its own is misleading —
most of the reduction is code that **moved** rather than code that disappeared.
The measurement below is the honest one.

## The chapter-runtime cost of making seven components authorable

Routing the six figure blocks (`angleFigure`, `areaPerimeterFigure`,
`coordinatePlaneFigure`, `numberLineFigure`, `circuitDiagram`,
`circuitSymbolReference`) means `ScreenRenderer` now imports those components —
so they moved out of the Lab-only chunk and into the chapter-runtime chunk that
`ChapterPlayer` also loads.

Measured directly, by building twice with only that difference:

| Build | `ScreenRenderer-<hash>.js` | `ComponentReviewLab-<hash>.js` |
|---|---|---|
| Figures routed (shipped) | **808.49 kB / 226.85 kB gz** | 156.43 kB / 41.29 kB gz |
| Figures Lab-only (control) | 641.17 kB / 179.37 kB gz | 323.39 kB / 89.53 kB gz |
| **Delta** | **+167 kB / +47 kB gz** | −167 kB / −48 kB gz |

**This is a real cost to learners, not an accounting artefact.** A learner
opening any chapter now downloads the four Maths figure engines and the two
circuit components, even in a chapter that uses none of them, because
`ScreenRenderer`'s block-renderer map is resolved synchronously.

It is the direct consequence of the D2 decision: a runtime that can render a
type has to be able to load it, and these six types are now authorable. It is
recorded here rather than mitigated because the mitigation is a product call,
not a mechanical one:

- **Option A — accept.** ~47 kB gz on the chapter path, once, cached.
- **Option B — `React.lazy()` the six figure block renderers** behind a
  `Suspense` boundary inside `ScreenRenderer`. Removes the cost from chapters
  that do not use a figure, but introduces a loading state into the inline
  content column, which is a visible-rhythm decision the learning-experience
  principles own.

**Not chosen here.** Phase 4 measures it; choosing B is a separate decision.

## Leakage into the learner entry — still none

Grep of the built learner entry (`assets/index-<hash>.js`):

| String | In learner entry |
|---|---|
| `COMPONENT_LAB_REGISTRY` | 0 |
| `owningRecordId` | 0 |
| `chapter-building` | 0 |
| `Runtime-placed screens` | 0 |
| `devreview` | 0 |
| `Component lab` / `System reference` | 0 |

The one `authoringName` hit in the learner entry is
`componentAuthoringRegistry.js` — the runtime authoring projection the chapter
validator reads — not Lab governance data. No `useWhen`, `contentUsage`,
`bestUsedFor` or `owningRecordId` reaches the learner entry.
