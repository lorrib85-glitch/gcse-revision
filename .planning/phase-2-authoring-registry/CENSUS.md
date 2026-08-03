# Phase 2 — authoring registry census, architecture and scope lock

Option (c): flip the **screen/block authoring registry** to component catalogue
records in one completed phase. `src/data/componentFunctions.js` stays untouched
as the sole authority for function tags and interaction classes; its consumer
graph is migrated later through its own full authority flip.

Status: **census complete, architecture proposed, scope locked pending three
product decisions.** No implementation started.

---

## 0. Surfaces surveyed

| Surface | Lines | Role today |
|---|---|---|
| `src/data/screenRegistry.js` | 489 | Authors `SCREEN_REGISTRY` (30) + `BLOCK_REGISTRY` (29), derives `LEGACY_BLOCK_TYPES`, plus 10 handwritten helpers and the chapter validator |
| `src/components/layout/ScreenRenderer.jsx` | 1251 | Concrete implementation map — **three** routing tables, not one (see §2) |
| `src/component-catalogue/records/**` | 84 records | Phase 1 catalogue; generates `docs/components/COMPONENT_REGISTRY.md` |
| `src/component-catalogue/schema.js` | 364 | Fixed `REQUIRED_KEYS`, rejects unknown keys — a new authoring key is a schema change |
| `tests/architecture/screen-registry.test.js` | 85 | Current integrity guard |
| `tests/architecture/component-catalogue-integrity.test.js` | 461 | Phase 1 boundary guard |

---

## 1. Screen census — all 30 entries

Legend: **A/R** active and routed · **A/U** active but unrouted · **D/R** derived
and routed · **L/R** legacy with replacement · **C** compatibility-only ·
**G** generic-renderer route · **S** stale or contradictory metadata

| # | type | declared component | class | authored uses | notes |
|---|---|---|---|---|---|
| 1 | `standard` | `ScreenContentRenderer` | **G** | default | Not a type authors write; the `layout: 'content'` fallback. Component is a named export of `ScreenRenderer.jsx`, not a standalone component — **no catalogue record possible** |
| 2 | `infographic` | `Infographic` | **A/R** | 1 | Routed *inside* `ScreenContentRenderer` (line 665), not by `FULL_SCREEN_RENDERER_TYPES`. Second routing table |
| 3 | `choiceReveal` | `ChoiceRevealScreen` | **S** | **0** | **Fictional component — see §4, Decision 1** |
| 4 | `quickRecall` | `QuickRecallScreen` | A/R | 7 | |
| 5 | `tieredquiz` | `TieredQuizScreen` | A/R | 4 | Name collides with the legacy *block* `tieredquiz` — see §3 |
| 6 | `faceExaminer` | `FaceTheExaminer` | A/R | 4 | |
| 7 | `guidedExamResponse` | `GuidedExamResponse` | A/R | 3 | |
| 8 | `naturalSupernaturalSwipe` | `SwipeSort` | A/R | 5 | Intentional alias: type name ≠ component name |
| 9 | `orderedRouteTask` | `OrderedRouteTask` | A/R | 1 | |
| 10 | `matchingTask` | `MatchingTask` | A/R | 5 | |
| 11 | `visualLearning` | `VisualLearning` | A/R | 4 | |
| 12 | `keyFigureReveal` | `KeyFigureReveal` | A/R | 4 | |
| 13 | `guidedChoiceCarousel` | `GuidedChoiceCarousel` | A/R | 2 | |
| 14 | `interactiveImage` | `InteractiveHotspotImage` | A/R | 3 | Alias |
| 15 | `centreImageReveal` | `CentreImageReveal` | A/R | 1 | |
| 16 | `visualNarrative` | `TimelineChain` | **L/R → C?** | **0** | Routed and in the full list, but capped at **0** by `allowedLegacyMaximums`. Not live — see §4, Decision 3 |
| 17 | `timelineChain` | `TimelineChain` | A/R | 6 | |
| 18 | `timelineCanvas` | `TimelineCanvas` | A/R | 1 | |
| 19 | `cinematicCarousel` | `CinematicCarousel` | **A/U-ish** | **0** | Fully routed, zero authored uses. Legitimately available, not stale |
| 20 | `oppositeQualitiesReveal` | `OppositeQualitiesReveal` | A/R | 1 | Also a block type — intentional cross-level alias |
| 21 | `examinerExplains` | `ExaminerExplainsScreen` | A/R | 7 | |
| 22 | `priorKnowledgeRecall` | `PriorKnowledgeRecall` | A/R | 6 | |
| 23 | `conceptReveal` | `ConceptReveal` | A/R | 8 | |
| 24 | `beforeAfterSlider` | `BeforeAfterImageSlider` | A/R | 1 | |
| 25 | `cinematic` | `CinematicRevealMoment` | A/R | 1 | Only `headerMode: 'cinematic'` route with a real component |
| 26 | `cinematicReveal` | `ScreenContentRenderer` | **L/R** | **0** | Unrouted by design; falls through to content layout. Not live |
| 27 | `video` | `ScreenContentRenderer` | **L/R** | **0** | Same as above. Not live |
| 28 | `factorWeb` | `FactorWeb` | A/R | 3 | |
| 29 | `quoteAnalyser` | `QuoteAnalyser` | A/R | 1 | |
| 30 | `misconceptionCheck` | `MisconceptionCheck` | **D/R** | 4 | `status: 'derived'` — never authored as `screen.type`; synthesised by `resolveScreenDefinition` when a `misconceptionCheck` **block** is present. Correctly excluded from `FULL_SCREEN_RENDERER_TYPES` |

**Screen totals:** 24 active-and-routed · 1 derived-and-routed · 3 legacy
(all zero-usage) · 1 stale · 1 generic-renderer route.

---

## 2. Block census — all 29 entries

Every active block is in `BLOCK_RENDERERS`, so the existing set-equality test
holds. The real finding is **where the implementation lives**.

### 2a. Active blocks routed to a *private internal of `ScreenRenderer.jsx`* — **G**

These nine have no standalone file and therefore **no catalogue record, and no
record is possible under the Phase 1 model** (a record needs a `source` file
whose identity it owns).

| type | declared component | defined at | authored uses |
|---|---|---|---|
| `read` | `ReadBlock` | `ScreenRenderer.jsx:52` | 8 |
| `keypoint` | `KeypointBlock` | `:69` | 8 |
| `funfact` | `FunFactBlock` | `:95` | 7 |
| `examtip` | `ExamTipBlock` | `:110` | 7 |
| `timeline` | `TimelineBlock` | `:144` | 0 |
| `reveal` | `RevealBlock` | `:183` | 0 |
| `hotspot` | `HotspotBlock` | `:252` | 0 |
| `misconception` | `MisconceptionBlock` | `:398` | 0 |
| `scenario` | `ScenarioBlock` | `:456` | 0 |

This is the single biggest obstacle to "catalogue records become the authority",
and it is invisible under the current truthiness test. **Decision 2 in §4.**

### 2b. Active blocks routed to a catalogued standalone component — **A/R**

| type | component | record | authored uses |
|---|---|---|---|
| `quiz` | `AnswerInteraction` | ✓ | 8 |
| `flashcards` | `FlashcardsBlock` | ✓ | 4 |
| `acronymMemorise` | `AcronymMemorise` | ✓ | 0 |
| `memoryHook` | `MemoryHook` | ✓ | 0 |
| `builder` | `BuilderBlock` | ✓ | 0 |
| `boss` | `ExamQuestionFrame` | ✓ | 4 |
| `explainReveal` | `ExplainReveal` | ✓ | 3 |
| `mediaPlaceholder` | `MediaPlaceholder` | ✓ | 1 |
| `fillblanks` | `FillInTheBlanksBlock` | ✓ | 4 |
| `theoryCompare` | `TheoryCompare` | ✓ | 2 |
| `oppositeQualitiesReveal` | `OppositeQualitiesReveal` | ✓ | 1 |
| `graphView` | `GraphView` | ✓ | 0 |
| `timelineChain` | `TimelineChainBlock` | ✓ (`exportName`) | 6 |
| `colsort` | `ColSortBlock` | ✓ | 6 |
| `spotTheError` | `SpotTheError` | ✓ | 0 |
| `misconceptionCheck` | `MisconceptionCheck` | ✓ | 4 |

`timelineChain` (block) is the **alias-sharing-an-implementation** case the
integrity contract must support: `TimelineChain.jsx` carries two catalogue
records distinguished by `exportName`, and the block type resolves to the named
export while the *screen* type of the same name resolves to the default export.
A projection keyed only by component *name string* would silently conflate them.

### 2c. Legacy, unrouted, proven live — **C**

All four render `LegacyUnroutedBlock` (an inline notice component, not a real
component) and are the correct population for
`src/component-catalogue/migrations/authoringCompatibility.js`.

| type | replacement | live references | test cap |
|---|---|---|---|
| `appliedscenario` | `scenario` | yes | 2 |
| `examscored` | `boss` | yes | 1 |
| `tieredquiz` | `quickRecall` | yes | 9 |
| `timelinedrag` | `orderedRouteTask` | yes | 1 |

**Block totals:** 16 active-and-catalogued · 9 active-but-renderer-owned ·
4 compatibility-only (all proven live).

---

## 3. Cross-cutting findings

1. **Three routing tables, not one.** `FULL_SCREEN_RENDERER_TYPES` (full-screen
   switch), the `infographic` branch *inside* `ScreenContentRenderer`, and
   `BLOCK_RENDERERS`. The current test only proves two of them. A bidirectional
   contract must cover all three or `infographic` remains unguarded.
2. **`tieredquiz` is two different things.** Screen type: active,
   `TieredQuizScreen`, 4 uses. Block type: legacy, unrouted, replacement
   `quickRecall`. The projection must keep screen and block in **separate
   namespaces**; a flat merged map would collide and silently pick one.
3. **`contract` is a constant, not a fact.** All 59 entries carry the identical
   string `'docs/components/COMPONENT_REGISTRY.md'`, and the current test only
   asserts it contains `COMPONENT_REGISTRY.md` — it proves nothing. Your
   preserved-field list omits it; I read that as deliberate and propose dropping
   it (the owning record path is derivable, and `COMPONENT_REGISTRY.md` is
   itself generated).
4. **`LEGACY_BLOCK_TYPES` has zero consumers.**
   ~~`extracted-chapter-contract.test.js:34` hardcodes its own duplicate `Set`
   of the same four names.~~ **Corrected during implementation:** that is *not*
   a duplicate. It is a nine-name set of unregistered pre-registry block names
   (`flipcards`, `bidmas`, `tfcheckpoint`, …) that must be wholly absent from a
   scoped list of repaired chapters — a different set, for a different job, on a
   different population. Only `appliedscenario` and `examscored` appear in both,
   and there is no contradiction because that test covers `TARGET_IDS` only
   while the registry cap is global. It was left alone.
   `LEGACY_BLOCK_TYPES` therefore still has no consumer. It is re-exported as
   specified, and is now generated rather than hand-derived, but nothing reads
   it.
5. **`status: 'derived'` is load-bearing** and correctly excluded from the
   full-screen list — the integrity contract must special-case it, not treat it
   as an unrouted defect.
6. **`headerMode: 'cinematic'`** is claimed by three entries, but two of them
   (`cinematicReveal`, `video`) are legacy `layout: 'content'` entries that never
   reach the cinematic path. Only `cinematic` uses it live.

---

## 4. Product decisions required before implementation

### Decision 1 — `choiceReveal` (confirmed stale, as you suspected)

Evidence:
- `ChoiceRevealScreen` **has never existed** in this repository. `git log -S`
  shows the string first appearing in `56192ff "Govern chapter screens through
  a single registry"` — the commit that created the registry. It was invented
  to satisfy the "component must be truthy" rule.
- The route at `ScreenRenderer.jsx:801` is **inline JSX**, not a component call.
- **Zero authored uses** anywhere in `src/content/**`.
- **Latent contradiction:** it declares `layout: 'full'` with the default
  `continuation: 'player'`, yet renders its own `ContinueCTA` *and* calls
  `go(1)` itself. `screenHasComponentOwnedContinuation` returns `false`, so
  `ChapterPlayer.nextLabel()` would also render a Continue button — a double
  CTA. Masked only by the zero usage.

**Recommendation: delete the type** — registry entry, `FULL_SCREEN_RENDERER_TYPES`
entry and the inline branch. It has no content, no component and a latent bug.
The alternative (extract a real `ChoiceRevealScreen.jsx` + catalogue record +
story) builds a component for zero callers, which the component-creation rules
forbid.

**Needs your call: delete, or extract?**

### Decision 2 — the nine renderer-owned block components

"Catalogue records become the authority" cannot be literally true for nine of
the twenty-five active blocks, because they are private functions inside
`ScreenRenderer.jsx` with no `source` file of their own. Three options:

| Option | What it means | Cost |
|---|---|---|
| **(a) Extract** all nine into `src/components/learning/blocks/*.jsx` + 9 catalogue records + 9 stories | Every authoring entry is owned by a component record, uniformly | Large; four of the nine have **zero** authored uses, so it is speculative work on dead types |
| **(b) Renderer-owned family** — `ScreenRenderer`'s existing `runtime` record gains an `authoring.rendererOwned[]` list declaring these nine types, with the same full entry shape | Authority genuinely sits in the catalogue; the honest fact ("this type's implementation is private to the renderer") becomes explicit and testable instead of hidden behind a fake component name | One schema addition; the integrity contract gains an explicit "documented generic handler" class, which your brief already anticipates |
| **(c) Compatibility registry** | Wrong — these are active and live, not legacy |

**Recommendation: (b).** It satisfies your requirement that the projection may
combine "authoring entries owned by current component records" with an
explicitly documented generic handler, without a nine-file speculative
extraction. `ScreenContentRenderer`, `LegacyUnroutedBlock` and `Infographic`'s
content-layer route are covered by the same mechanism.

**Needs your call: (a) or (b)?**

### Decision 3 — the three zero-usage legacy screen types

`visualNarrative`, `cinematicReveal`, `video` all have **zero** authored uses.
`visualNarrative` is already capped at `0` by `allowedLegacyMaximums`, i.e. the
suite already asserts it is dead.

Your rule is that the compatibility registry carries **proven live** entries
only, and that a guard must fail when an entry goes stale. These three are
stale *on arrival* — migrating them into the compatibility registry would
create exactly the stale entries the guard is meant to catch.

**Recommendation: delete all three** (registry entries, the `visualNarrative`
branch in `ScreenRenderer.jsx`, its `FULL_SCREEN_RENDERER_TYPES` entry).
`src/data/visualNarrativeCompat.js` — the *lesson-data* mapper CLAUDE.md
describes — is a separate surface and is **out of scope**; deleting the screen
type does not touch it.

Consequence to accept: content authored with those types would now fail as
`UNREGISTERED_SCREEN_TYPE` rather than warn as `LEGACY_SCREEN_TYPE`. With zero
occurrences that is the intended ratchet.

**Needs your call: delete, or carry as compatibility entries?**

### Not a blocker — pending Decision blocks

Nine catalogue records carry `decision.status: 'pending'`
(`BeforeAfterImageSlider`, `CentreImageReveal`, `CircuitDiagram`,
`CircuitSymbolReference`, `FactorWeb`, `FlashcardsBlock`, `QuoteAnalyser`,
`TieredQuizScreen`, `TimelineChainBlock`). Every one is `lifecycle: 'active'`
and routed. As you specified, authorability and "use when / choose instead"
guidance are separate concerns; **none of these blocks this migration.**

---

## 5. Architecture

### 5.1 Where each fact lives

```
src/component-catalogue/records/<id>.js       ← authoring entry for a real component
  └ new key: authoring: { screens: [...], blocks: [...] } | null

src/component-catalogue/records/screen-renderer.js
  └ authoring.rendererOwned: [...]            ← the 9 private block types + standard
                                                 (Decision 2b)

src/component-catalogue/migrations/authoringCompatibility.js
  └ 4 legacy block entries, each with:
      type · level · status · replacement · currentHandler
      · reason · removalCondition

        ↓  scripts/generate-authoring-registry.mjs  (build-time, deterministic)

src/data/generated/componentAuthoringRegistry.js   ← lean runtime projection
  └ SCREEN_REGISTRY · BLOCK_REGISTRY · LEGACY_BLOCK_TYPES

        ↓  import

src/data/screenRegistry.js                    ← shrinks to helpers + re-export
```

### 5.2 Why the generated file lands in `src/data/generated/`, not the catalogue

`component-catalogue-integrity.test.js` ("authority boundaries hold") asserts
that **no production file under `src/` may reach the catalogue**, matching both
import specifiers *and* the bare substring `src/component-catalogue/`. Putting
the projection under `src/component-catalogue/generated/` would break that guard
two ways at once. Your proposed import path — `./generated/…` relative to
`src/data/screenRegistry.js` — resolves to `src/data/generated/` and is correct
as written; this is exactly the right side of the boundary.

One guard amendment is required: the generated file's provenance header must be
allowed to *name* the catalogue without *importing* it. The
`source.includes('src/component-catalogue/')` clause narrows to import
specifiers only, and a new assertion proves the generated file contains no
import reaching the catalogue. This is a tightening, not a loosening — the
substring clause currently catches prose, which is not what it exists for.

### 5.3 Runtime projection shape

Lean by construction: exactly the eleven fields you named
(`type` as the key, plus `authoringName`, `component`, `level`, `layout`,
`status`, `replacement`, `required`, `requiredAny`, `continuation`,
`headerMode`), frozen, screen and block kept in **separate namespaces** so
`tieredquiz` cannot collide. No `contract` field (§3.3). No governance prose,
no Decision blocks, no evidence — none of it is read at runtime.

`src/data/screenRegistry.js` drops from 489 lines to the ten handwritten helpers
plus the re-export; the helper APIs, the chapter validator and all runtime
behaviour are unchanged.

### 5.4 Bidirectional integrity contract (replaces the truthiness test)

`tests/architecture/authoring-registry-integrity.test.js` asserts, over the
projection and all **three** routing tables:

1. every `active` or `derived` projected **screen** type resolves to a renderer
   route — the full-screen switch, the `infographic` content-layer branch, or a
   declared generic handler;
2. every `active` projected **block** type resolves to a `BLOCK_RENDERERS` entry
   or a declared renderer-owned handler;
3. every renderer route corresponds to exactly one projected type — no orphan
   branches (this is what would have caught `choiceReveal`);
4. compatibility entries are the *only* legacy-unrouted entries, and each is
   explicitly marked as such;
5. **aliases are supported and checked**: type name ≠ component name is legal
   (`naturalSupernaturalSwipe` → `SwipeSort`); two types sharing one
   implementation is legal (`oppositeQualitiesReveal` screen + block); two
   records sharing one file is legal only via distinct `exportName`
   (`TimelineChain` / `TimelineChainBlock`);
6. **component-name strings match implementation identity**: a projected
   `component` must resolve to a catalogue record's `name`, a declared
   renderer-owned handler, or a compatibility handler — and to the *same*
   `source#exportName` the renderer actually imports and calls. A fabricated
   name cannot pass.

### 5.5 Compatibility staleness guard

For each entry in `authoringCompatibility.js`, scan `src/content/**` for live
references. **Zero references ⇒ the test fails**, naming the entry and its
`removalCondition`. The registry is a shrinking set with a forcing function, not
a permanent tombstone list.

### 5.6 No interim mirror

Per your point 5: the flip is total. There is never a commit in which both a
handwritten `SCREEN_REGISTRY` and a generated one exist as authored copies, and
no drift test between two authored sources is written at any point. The phase
lands across several internal commits, but the authority moves exactly once.

---

## 6. Scope lock

**Files to edit**
- `src/component-catalogue/schema.js` — add + validate the `authoring` key
- `src/component-catalogue/records/*.js` — authoring entries on owning records
- `src/component-catalogue/records/screen-renderer.js` — `authoring.rendererOwned`
- `src/component-catalogue/migrations/authoringCompatibility.js` — **new**
- `scripts/generate-authoring-registry.mjs` — **new**
- `src/data/generated/componentAuthoringRegistry.js` — **new, generated**
- `src/data/screenRegistry.js` — shrink to helpers + re-export
- `src/components/layout/ScreenRenderer.jsx` — only if Decisions 1 and 3 are
  "delete" (remove `choiceReveal` / `visualNarrative` branches and list entries)
- `tests/architecture/screen-registry.test.js` — replaced by
  `authoring-registry-integrity.test.js`
- `tests/architecture/component-catalogue-integrity.test.js` — narrow the
  substring clause to import specifiers (§5.2)
- `tests/architecture/extracted-chapter-contract.test.js` — consume
  `LEGACY_BLOCK_TYPES` instead of its hardcoded duplicate (§3.4)
- `package.json` — wire the new generator into `verify` ahead of
  `test:architecture`
- `CLAUDE.md`, `docs/system/00_SYSTEM_INDEX.md` — point authoring-registry
  authority at the catalogue

**Files forbidden**
- `src/data/componentFunctions.js` and every consumer of it — a later phase
- `src/data/visualNarrativeCompat.js` — separate surface
- All 84 records' `decision` / `contract` blocks — not this phase's authority
- `src/content/**` — no content is rewritten; legacy types are migrated by
  their own future work, not here
- `ChapterPlayer.jsx`, `progress.js`, any learner-facing component

**Components allowed (existing):** all — no component is added or changed.
**New components:** no.
**New stories required:** no.
**Assets required:** no.

**Verification plan**
- `pnpm catalogue:check` — generated docs still byte-identical
- new `pnpm authoring:check` — generated projection byte-identical
- `pnpm test:architecture` — including the new bidirectional contract
- `pnpm test:unit` — `tests/unit/data/screenRegistry.test.js` passes **unchanged**
  (proves the helper API and runtime behaviour did not move)
- `pnpm build`
- Manual: open a chapter containing a `misconceptionCheck` block (derived route),
  a `timelineChain` block (alias route) and a legacy `tieredquiz` block
  (compatibility notice); confirm all three render as they do today

---

## 7. Decisions

### Decision 1 — `choiceReveal`: **SETTLED — delete the type**

Remove the authoring entry, the `FULL_SCREEN_RENDERER_TYPES` entry and the
inline `ScreenRenderer` branch. No compatibility entry, no new component.

The four evidence findings are retained above and must survive the deletion as
the permanent record of why it went (§4, Decision 1):
`ChoiceRevealScreen` has never existed; `choiceReveal` has zero authored uses;
no compatibility requirement depends on it; its continuation behaviour is
self-contradictory.

Guards required by this decision:
- no authored content in `src/content/**` uses the removed type;
- no stale reference to it remains in the registry projection, in
  `ScreenRenderer.jsx`, or in `FULL_SCREEN_RENDERER_TYPES`.

### Decision 2 — renderer-owned blocks: **SETTLED — renderer-owned family**

`ScreenRenderer`'s catalogue record owns the nine authoring entries as an
explicit renderer-owned family. The authoring type is real; its handler is
private to `ScreenRenderer`; it is not a standalone reusable component; and it
requires no fake catalogue record or invented source file.

No extraction is performed for catalogue symmetry, and no mixed model is used —
usage counts do not decide ownership. Implementation stays private for this
migration; extraction happens later only when reuse, testing isolation or
product design gives a genuine reason.

Each renderer-owned entry retains: `type`, `authoringName`, `level`, `layout`,
`status`, `replacement`, `required`, `requiredAny`, `continuation`,
`headerMode`, **and the current private handler identity**.

Validation required by this decision:
- every renderer-owned authoring entry names a private handler that actually
  exists in `ScreenRenderer.jsx`;
- every governed private handler is represented by exactly one authoring entry,
  or is explicitly marked non-authorable;
- no standalone component record claims ownership of the same implementation;
- the generated runtime projection preserves the current registry values
  exactly;
- zero authored uses alone never silently retire an active type.

### Decision 3 — **PAUSED and split**

Not to be taken as one group. See
[`DECISION-3-CINEMATIC.md`](./DECISION-3-CINEMATIC.md) for the focused
comparison.

- **3a — `cinematicReveal` + `video`:** recommendation is to retire both, on
  stronger evidence than originally offered — they were never a route to
  `CinematicRevealMoment`, share none of `cinematic`'s data shape, and their
  `headerMode: 'cinematic'` + `layout: 'content'` combination permanently hides
  the learning header. Awaiting your call.
- **3b — `visualNarrative`:** recommendation is now to **defer it to a later
  phase** and project it unchanged. It is the sole runtime entry point into
  `visualNarrativeCompat.js`, and CLAUDE.md plus the `TimelineChain` record both
  state that the legacy data shape is still supported — a constitutional
  question that does not belong in a mechanical authority flip. Awaiting your
  call.

Implementation does not start until 3a and 3b are answered.
