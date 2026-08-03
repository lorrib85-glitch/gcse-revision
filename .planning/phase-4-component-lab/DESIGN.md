# Phase 4 — Component Lab design

**The Component Lab is the chapter-building component library.**

Every item in it is a genuine selectable chapter authoring choice. It is not a
browser for all 84 catalogue records.

> **Supersedes the previous direction.** An earlier version of this document
> targeted "all 84 catalogue records represented in the Lab", listing runtime
> shells and support primitives as non-mountable rows. That is withdrawn.
> Infrastructure does not belong in the chapter-building Lab at all — not even
> as a disabled or catalogue-only row.

Read `CENSUS.md` — particularly **Census 7** — first. Every number here rests on
a measured figure there.

---

## 1. The governing rule, enforced in both directions

1. **Every Lab item maps to at least one live registered authoring entry** that
   chapter content can actually use.
2. **Every active chapter authoring entry is selectable in the Lab** as an item
   or an authoring mode.

A preview with no authoring route is a defect. An authoring route with no Lab
selection is equally a defect. Both are build failures, not warnings.

**No fake authoring entries.** A type is never registered to keep an engineering
or design-system item in the Lab. If an item is not a chapter choice, it leaves
the Lab.

Today: 38 of 49 Lab items satisfy direction 1; **34 of 51** authoring entries
satisfy direction 2.

---

## 2. The three layers

### Layer 1 — catalogue-generated Lab facts

`src/data/generated/componentLabRegistry.js`, produced by
`scripts/generate-lab-registry.mjs` (`pnpm lab:generate` / `pnpm lab:check`),
following the pattern already proven twice by the authoring and pedagogy
generators.

**The projection unit is the authoring entry, not the catalogue record.** One row
per live authoring entry, keyed by a stable level-aware key:

```
screen:timelineChain
block:timelineChain
```

Rows are emitted **only** for authoring entries whose status is not `legacy`.
A catalogue record with `authoring: null` produces no row — which is precisely
how infrastructure is excluded structurally rather than by a list.

| Field | Source |
|---|---|
| `key`, `level`, `type` | authoring entry |
| `authoringName` | authoring entry |
| `status` | authoring entry (`active` / `derived`) |
| `layout`, `continuation`, `headerMode` | authoring entry |
| `required`, `requiredAny` | authoring entry — the content contract |
| `pedagogy` (`functions`, `interaction`) | authoring entry |
| `owningRecordId`, `componentName`, `source` | owning catalogue record |
| `handler` | authoring entry — non-null for the ten `ScreenRenderer` types |
| `lifecycle`, `criticality`, `decisionStatus` | owning record |
| `bestUsedFor`, `useWhen`, `doNotUseWhen`, `chooseInstead`, `contentShape` | owning record |
| `contentUsage` | generated scan of `src/content/**` |

No JSX, no functions, no React. Production-safe, as the settled boundaries require.

A record that owns several authoring entries (`MisconceptionCheck`,
`OppositeQualitiesReveal`, `TimelineChain`/`TimelineChainBlock`, `ScreenRenderer`
with ten) contributes one row per entry. That is the whole point: an author
picks a *type*, not a file.

### Layer 2 — handwritten preview adapters

Stays handwritten in `src/dev/componentReview/`, now keyed by **authoring key**:

```
{
  authoringKey: 'screen:timelineChain',
  renderMode: 'fullbleed',
  subject: 'History',
  fixture: FIX.timelineChain,
  render: (fx, { onDone }) => <TimelineChain … />,
  modes: [ … ],      // selectable authoring modes (see §3)
  variants: [ … ],   // presentation variants within one contract
  reviewNote: '…',
}
```

Everything Census 4 classified as an adapter fact lives here and nowhere else:
React imports, JSX, fixtures, GCSE examples, subject/accent choice, render mode,
callbacks, controlled state, reset/replay, and sanctioned layout overrides.

**Nothing here is ever promoted into a catalogue record.**

### Layer 3 — Lab shell

Composes the index from Layer 1 joined to Layer 2 by `authoringKey`. It authors
no facts.

The join is the enforcement point, and it is bidirectional:

- an adapter whose `authoringKey` is not in the projection → **build error**;
- a projection row with no adapter → **build error**.

There is no allowlist. The `buttons-and-progress` exception disappears because
that page leaves the Lab entirely (§5).

---

## 3. Modes versus variants

A single record may expose one selectable authoring mode, several, or variants
within one mode. The distinction is contractual:

| | Rule |
|---|---|
| **Separate authoring modes** | Chapter data *and* renderer behaviour are genuinely different → separate rows |
| **Variants within one mode** | Same content contract, same renderer entry; only props or fixture differ → variant chips under one row |

Applied to the current duplicates:

| Today | Becomes |
|---|---|
| `graph-view-scatter` + `graph-view-line` | One `block:graphView` row, two variants (same contract, `chartType` differs) |
| `interactive-hotspot-image` + `-reveal` | One `screen:interactiveImage` row, two variants |
| `builder-block` ×3 | One `block:builder` row, three variants (`layout` differs, contract identical) |
| `misconception-check` (one entry) | **Two rows** — `screen:misconceptionCheck` and `block:misconceptionCheck` are different levels with different contracts |
| `opposite-qualities-reveal` (one entry) | **Two rows** — screen and block levels |
| `timeline-chain` (one entry) | **Two rows** — `screen:timelineChain` and `block:timelineChain` |

Note the direction of travel runs both ways: six entries collapse into three, and
three entries expand into six. The Lab gets *more* honest, not simply smaller.

---

## 4. Category B — items needing a real authoring route

Six Lab items are previews with no authoring route. Each needs a genuine entry,
content contract and renderer route **before** it may appear in the final Lab.

| Item | Recommended key | Level | Rationale |
|---|---|---|---|
| `CalculationBreakdown` | `screen:calculationBreakdown` | screen | Full-screen, owns its own continuation — see §6 |
| `AngleExplore` | `block:mathsFigure` (mode `angle`) | block | Inline figure; the page owns the question |
| `AreaPerimeterExplore` | `block:mathsFigure` (mode `areaPerimeter`) | block | Same interaction model and boundary |
| `CoordinatePlaneExplore` | `block:mathsFigure` (mode `coordinatePlane`) | block | Same |
| `NumberLineExplore` | `block:mathsFigure` (mode `numberLine`) | block | Same |
| `CircuitDiagram` + `CircuitSymbolReference` | `block:circuitFigure` | block | Inline Physics figure; symbol board is a preset of the same primitives |

The four Maths Explore components share one interaction model, one governed
boundary ("page-level questions and marking remain outside the component") and
one prop shape (`preset`, `value`, `interactive`, `focus`). **Whether they become
one `block:mathsFigure` type with a discriminator or four separate types is a
genuine product decision — D2 in `DECISIONS.md`.** The table above states the
recommendation, not a settled answer.

If a B item's authoring entry is not delivered in Phase 4, **it leaves the Lab**
until it is. It does not remain as a routeless preview.

---

## 5. Category C — items leaving the Lab

Five items are not chapter-building choices. They are removed from the Lab and
rehomed. **None is shown as disabled, catalogue-only or non-previewable in the
chapter-building Lab.**

| Item | New home |
|---|---|
| `Buttons and progress` (page) | **Design-system reference** — a separate owner surface |
| `ChapterOutcomeScreen` | **Runtime-component reference** |
| `ChapterCompleteScreen` | **Runtime-component reference** |
| `ChapterHookScreen` | **Runtime-component reference** |
| `WeakSpotRecovery` | **Runtime-component reference** |

The three chapter-framing screens and `WeakSpotRecovery` are active, well-formed
components. They are category C because the **runtime places them** — from
chapter metadata or app state — and an author never selects them.

`ButtonsAndProgressPage.jsx` already exists and works; it moves out of the Lab's
selectable population and becomes its own owner surface. Its ten previewed
primitives (`ContinueCTA`, `BackButton`, `SequenceProgress`, …) go with it. The
Phase-3-era idea of adding ten *more* primitives to the Lab is withdrawn — they
were never chapter choices.

**The shape and location of these two reference surfaces is D3 in
`DECISIONS.md`.** The census records that `docs/components/COMPONENT_REGISTRY.md`
and Storybook already exist and may absorb some of this without new UI.

---

## 6. CalculationBreakdown — recommended authoring entry

`CalculationBreakdown.jsx`, its record, contracts, previews and all five
presentations (`standard`, `algebraWhy`, `inverseMachine`, `groupSplit`,
`balance`) are **retained in full**. Nothing is deleted, retired or hidden.

Investigated from the source (Census 7). Recommendation:

| Question | Recommendation | Evidence |
|---|---|---|
| **Level** | `screen` | Renders inside `InteractionShell` with its own `ScreenTitle` and manages a multi-stage sequence — it is a whole screen, not a block in a flow |
| **Type name** | `calculationBreakdown` | Already the Lab's `contentType` and the shim's key, so the generated pedagogy value is preserved byte-for-byte when the shim is removed |
| **`authoringName`** | `Calculation breakdown` | Matches the component's own default title |
| **`layout`** | `full` | Full-screen shell, matching `screen:factorWeb` |
| **`headerMode`** | `standard` | Renders its own title inside the shell |
| **`continuation`** | `component` | Takes `onContinue` and renders its own CTAs |
| **Required data** | `required: []`, `requiredAny: [[{path:'steps',kind:'array'},{path:'presentation',kind:'object'}]]` | The standard flow needs `steps`; a visual model needs `presentation` and ignores `steps`. `requiredAny` expresses exactly this "one of" |
| **Optional data** | `title`, `goalPrompt`, `problem`, `understand`, `solution`, `backgroundImage`, `backgroundOpacity` | All have component defaults |
| **Presentation selection** | `block.presentation.variant`, enum `CALCULATION_VARIANTS` | Already frozen in `calculationBreakdownValidation.js` |
| **Renderer ownership** | `ScreenRenderer` routes `type: 'calculationBreakdown'` → `CalculationBreakdown`; `handler: null` | It is a standalone reusable component, not a private handler |
| **Pedagogy** | `functions: ['sequence-process','apply']`, `interaction: 'assessed'` | Copied verbatim from the shim so the projection is unchanged |
| **Validation contract** | Envelope by `required`/`requiredAny`; model by `resolveCalculationPresentation()` wired into the chapter validator | The validator already exists and returns structured errors; today its failure is a dev-only `console.error` and a silent production fallback |

**Modes versus variants.** One authoring type with five **selectable authoring
modes** in the Lab, not five types. All five share the `block` envelope, the same
renderer entry and the same validation entry point — so they are one contract —
but an author genuinely chooses between them, so each must be individually
selectable. The existing `reduced-motion` and `mobile-width` previews stay as
**variants** of the `groupSplit` / `algebraWhy` modes: they change no content.

### Shim removal — ordering is mandatory

`NON_AUTHORING_PEDAGOGY`'s `calculationBreakdown` entry is **kept until the
genuine authoring entry exists** and the generated pedagogy projection reads from
that entry.

Correct order, in **one atomic commit**:

1. Add the authoring entry to the `calculation-breakdown` record, carrying the
   pedagogy block above.
2. Add the `ScreenRenderer` route.
3. Run `pnpm authoring:generate` and `pnpm pedagogy:generate`.
4. Delete the shim entry from `NON_AUTHORING_PEDAGOGY`.
5. Regenerate and confirm `componentPedagogyRegistry.js` is **unchanged** for
   `calculationBreakdown` — the classification now comes from the authoring
   entry instead of the shim.

**Do not remove the pedagogy classification first.** If the shim is deleted
before the entry exists, the classification disappears and the projection
changes. The step-5 no-diff check is the proof the handover was clean.

This supersedes the earlier plan, which deleted the shim on the grounds that the
Lab no longer called `getTypeInfo`. That reasoning was correct about the
consumer and wrong about the product intent.

---

## 7. Coverage — two separate contracts

### Contract 1 — catalogue coverage (unchanged)

Every one of the 84 records remains accounted for in
`docs/components/COMPONENT_REGISTRY.md` and the architecture tests. The catalogue
stays complete. **This is not a Lab contract.**

### Contract 2 — Component Lab coverage (new, enforced)

- **100%** of live authoring entries are selectable in the Lab.
- **100%** of Lab selections resolve to live authoring entries.
- **Zero** infrastructure, private internals, raw token examples or
  non-authorable features in the Lab.

Populations after reclassification:

| | Now | Target |
|---|---|---|
| Live authoring entries | 51 | 51 + 2 new (B items, per D2) |
| — selectable in the Lab | 34 | all |
| — missing | 17 | 0 |
| Lab items with no authoring route | 11 | 0 |
| Category C items in the Lab | 5 | 0 |

---

## 8. Authoring completeness — the per-selection proof

For every final Lab selection, all ten must hold. A visual preview alone is not
chapter-building support.

| # | Requirement | Enforced by |
|---|---|---|
| 1 | Registered screen or block type | Projection row exists |
| 2 | Owning catalogue record | `owningRecordId` resolves |
| 3 | Valid renderer route | Route guard: every non-legacy type resolves in `ScreenRenderer` |
| 4 | Authoring schema | `required` / `requiredAny` present |
| 5 | Required data stated | Same |
| 6 | Pedagogy | `pedagogy.functions` non-empty (or a container-derived exemption) |
| 7 | Interaction class | `pedagogy.interaction` in the vocabulary |
| 8 | Continuation behaviour | `continuation` present |
| 9 | Realistic preview | Adapter exists and probe-renders |
| 10 | Valid minimal chapter content shape | A minimal fixture passes the chapter validator for that type |

Requirement 10 is the strongest and the newest: each selection ships a **minimal
valid content shape** that the real chapter validator accepts. That is what turns
the Lab from a gallery into a component library.

---

## 9. Index and filter model

`status` is deleted (Census 5: 33 of 49 entries carried the meaningless
`comparison`, and two values were provably stale). Filters read generated facts:

1. **Level** — screen / block
2. **Pedagogy function** and **interaction class**
3. **Content usage** — measured occurrences and files
4. **Lifecycle** and **decision readiness** of the owning record

Derived filters (`unused`, `one-off`) become predicates over facts, so the
`spot-the-error` and `timeline-chain` staleness becomes structurally impossible.
`comparison` and the dead `uncategorised` label are dropped.

---

## 10. Bundle position

Lab chunk today: 356.16 kB raw / 105.76 kB gzip, no leakage into the learner
entry (measured). Phase 4 both **adds** adapters (17 missing entries) and
**removes** them (5 category C items, including the ten primitives on the
buttons page). Net direction is unknown until built — re-measure and report; no
budget is set.

---

## 11. What this design refuses to do

- Register a fake authoring type to keep an item in the Lab.
- Keep a preview that has no authoring route.
- Show infrastructure in the chapter-building Lab as disabled or catalogue-only.
- Put JSX, fixtures or React imports into catalogue records or generated data.
- Let the Lab restate any fact the catalogue owns.
- Delete, retire or hide `CalculationBreakdown`, its record, contracts, previews
  or any of its five presentations.
- Remove the pedagogy shim before its genuine authoring entry exists.
- Touch the access model, Storybook config, or the runtime/catalogue import
  boundary.
