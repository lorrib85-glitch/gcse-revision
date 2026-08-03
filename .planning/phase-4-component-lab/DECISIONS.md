# Phase 4 — open decisions

Revised for the clarified product rule: **the Component Lab is the
chapter-building component library.**

Only genuinely unresolved product/architecture questions are listed. Anything
the census settled with evidence is in `CENSUS.md`; anything the design settles
is in `DESIGN.md` and is not reopened here.

> **Superseded from the previous version.** Old D2 ("how much new coverage?") and
> D3 ("should non-mountable records appear in the index?") are gone. The product
> rule answers both: coverage is 100% of the live authoring surface, and
> non-authorable items do not appear at all. Old D4 (`GuidedAnswerCoach`) is
> settled — it has no authoring entry, so it is category C and leaves the Lab.
> Old D5 (reference page organisation) is folded into the wider D3 below.

---

## D1 — Does generated content usage participate in drift checking?

*(Carried forward unchanged — still open, still blocking.)*

**The problem.** `DESIGN.md` puts `contentUsage` into the generated Lab
projection, because that is the only way to stop usage prose going stale — the
census found two provably wrong claims. But the established generator pattern
pairs `x:generate` with `x:check`, which **fails the build on drift**. Content
usage changes whenever anyone authors a screen, so drift-checking it breaks CI on
ordinary content commits.

**Options.**

| | Approach | Cost |
|---|---|---|
| A | Drift-check usage like every other generated fact | Adds a regenerate step to the content workflow; a forgotten regenerate fails CI on a content PR |
| B | Catalogue-derived fields drift-checked; `contentUsage` generated but **excluded** from the check | Usage can lag — as a number, not as prose |
| C | Compute usage at runtime from a small content-type index | No drift possible; costs a runtime scan and a new index |

**Recommendation: B.** Usage is the one field whose truth lives outside the
catalogue and changes on a different cadence. A usage count a week old is still
far better than prose a year old.

**Why it needs a decision:** it changes the contract of `pnpm lab:check` and
touches the content authoring workflow.

---

## D2 — One `block:mathsFigure` type, or four separate types?

**The problem.** Four category B items — `AngleExplore`, `AreaPerimeterExplore`,
`CoordinatePlaneExplore`, `NumberLineExplore` — share one interaction model, one
governed boundary ("page-level questions and marking remain outside the
component"), and one prop shape (`preset`, `value`, `interactive`, `focus`). They
differ in what they draw.

They currently carry **42 preview variants between them** (13 + 8 + 13 + 8), so
whichever way this goes, the Lab shows a lot of modes.

**Options.**

| | Approach | Consequence |
|---|---|---|
| A | One `block:mathsFigure` with a `figure` discriminator (`angle` / `areaPerimeter` / `coordinatePlane` / `numberLine`) | One authoring type, four modes. Authors learn one contract. Needs a router block that dispatches to the four components |
| B | Four types: `block:angleFigure`, `block:areaPerimeterFigure`, `block:coordinateFigure`, `block:numberLineFigure` | Each component owns its own entry and contract directly. No router. Four types for one idea |
| C | One type per *topic area* — e.g. `block:geometryFigure` (angle + areaPerimeter) and `block:numberFigure` (numberLine + coordinatePlane) | Splits on curriculum rather than on mechanism; hardest to defend |

**Recommendation: A.** The four components already behave as one family with a
shared boundary; a single contract with a discriminator matches how an author
actually thinks ("place a Maths figure, choose which"). It also keeps the
`preset` vocabulary in one validated place.

**But this is genuinely a product call**, because it decides what an author types
into a chapter file for the rest of the project's life, and A requires a new
dispatching block that does not exist today.

The same question applies in miniature to `CircuitDiagram` +
`CircuitSymbolReference`: one `block:circuitFigure` with the symbol board as a
preset (recommended), or two types.

---

## D3 — Where do the category C items go?

**The problem.** Five items leave the Lab and need a home. `DESIGN.md` names two
destinations — "design-system reference" and "runtime-component reference" —
without saying whether either is a new surface.

Three homes already exist and may absorb this with no new UI:
`docs/components/COMPONENT_REGISTRY.md` (generated), Storybook (already
configured), and the existing `ButtonsAndProgressPage.jsx` (already written and
working).

**Options.**

| | Approach | Consequence |
|---|---|---|
| A | A second owner surface beside the Lab (`?designSystem=true`), reusing `ButtonsAndProgressPage` and adding a runtime-component page | Keeps the live-render value; costs a second shell and a second route |
| B | Storybook absorbs everything — the four runtime screens get stories; the buttons page becomes a Storybook docs page | No new app surface; but Storybook is a dev-only tool and the owner uses the Lab on a phone, which is the whole reason the Lab exists |
| C | Keep `ButtonsAndProgressPage` reachable at its own flag, and let the four runtime screens live only in the generated registry (no live preview) | Cheapest; loses live preview of four real screens |

**Recommendation: A**, scoped small: one additional flag, the existing buttons
page moved across unchanged, and the four runtime screens added to it as a second
section. The owner keeps the 390px live-render capability that motivated the Lab,
and the chapter-building Lab stays clean.

**Why it needs a decision:** it creates a second owner-facing surface, which is a
product-surface change rather than a refactor — and the settled boundaries park
Lab *access*, so adding a sibling route needs explicit approval.

---

## D4 — Do the ten `ScreenRenderer` block types get previews in Phase 4?

**The problem.** Ten of the seventeen missing authoring entries are implemented
by private handlers inside `ScreenRenderer.jsx` (`ReadBlock`, `KeypointBlock`,
`ExamTipBlock`, `ScenarioBlock`, `FunFactBlock`, `MisconceptionBlock`,
`RevealBlock`, `HotspotBlock`, `TimelineBlock`, `ScreenContentRenderer`). They
include the two most-used authorable types in the codebase — `block:read` (261
uses) and `block:keypoint` (83).

They are genuine authoring types; the schema explicitly sanctions handler-backed
entries. But they have no importable component: previewing them means either
mounting `ScreenRenderer` with a one-block fixture screen, or exporting the
handlers.

**Options.**

| | Approach | Consequence |
|---|---|---|
| A | Preview through `ScreenRenderer` with a minimal one-block screen fixture | Honest — it renders exactly what an author gets, through the real router. Needs the Lab to mount `ScreenRenderer`, which `DESIGN.md` otherwise excludes as infrastructure |
| B | Export the ten handlers as named exports and mount them directly | Simpler adapters; but promotes ten deliberately private handlers to public API, which the schema's `handler` design exists to avoid |
| C | Defer all ten to a follow-up phase | Phase 4 ships a Lab that still omits the most-used authoring types — failing coverage contract 2 on day one |

**Recommendation: A.** It is the only option that is both honest and
boundary-preserving: the Lab mounts the router as a *rendering mechanism* for a
one-block fixture, which is not the same as listing `ScreenRenderer` as a
selectable item. Requirement 10 in `DESIGN.md` §8 already demands a minimal valid
content shape per selection, so the fixture exists anyway — option A simply
renders it.

**Why it needs a decision:** it is the difference between Phase 4 achieving
100% authoring coverage and achieving 65% of it, and it touches how the Lab
relates to `ScreenRenderer`.

---

## D5 — Do the two authoring-entry ownership defects get fixed in Phase 4?

**The problem.** Census 7 found two inversions:

1. `screen:examinerExplains` sits on `ExaminerExplainsScreen` (`lifecycle:
   parked`, a bare re-export) while the canonical `WhatExaminersLookFor` record
   has `authoring: null`.
2. `screen:faceExaminer` correctly sits on the canonical `FaceTheExaminer`
   record, but the Lab imports the private internal
   `faceTheExaminer/FaceTheExaminerContainer.jsx`.

(2) is unambiguously a Phase 4 fix — it is a Lab import, and the public export
behaves identically.

(1) is a **catalogue** change: moving an authoring entry between records. It is
correct, but it touches the migration status of a parked component and may be
part of a separate deprecation.

**Options.**

- **A. Fix both in Phase 4.** The projection is keyed by authoring entry, so an
  entry owned by a parked record produces a row pointing at a deprecated
  component — visible wrongness in the new Lab.
- **B. Fix (2) only**, and raise (1) as a catalogue-hygiene item.

**Recommendation: A.** The projection makes the defect user-visible, so leaving
it means shipping a Lab row that names a parked component. The move is
mechanical: relocate the entry, regenerate, confirm the projection is unchanged
apart from `owningRecordId`.

**Why it needs a decision:** it changes catalogue records, and the parked record
may be scheduled for removal under a different plan.

---

## Explicitly not reopened

- **A8** — resolved. Phase 4 corrects only the false source comments catalogued
  in Census 1; no access or runtime behaviour changes.
- **Pedagogy authority** — complete. Phase 4 consumes it. D3/D4 from Phase 3
  remain deferred.
- **Lab access and location** — parked. D3 above proposes a *sibling* surface,
  which is why it is flagged as needing approval rather than assumed.
- **Storybook config** — untouched.
- **Code splitting** — options recorded in the bundle baseline; no change in scope.
- **`CalculationBreakdown`'s retention** — settled by product mandate. It is
  category B, keeps everything, and gains a genuine authoring entry.
