# Phase 4 — decisions

**All five decisions are settled.** They were taken together with one
correction to the coverage arithmetic, and this file now records the answers
rather than the options. The options tables are kept because a settled decision
is only readable if the alternatives it beat are still visible.

Governing product rule, unchanged: **the Component Lab is the chapter-building
component library.**

> **Superseded from the previous version.** Old D2 ("how much new coverage?")
> and D3 ("should non-mountable records appear in the index?") are gone. The
> product rule answers both. Old D4 (`GuidedAnswerCoach`) is settled — it has
> no authoring entry, so it is category C. Old D5 (reference page organisation)
> is folded into D3 below.

---

## D0 — the derived-entry correction (settled first, because it re-bases D1–D5)

**The defect.** The census counted 51 "live" authoring entries and made that
the coverage target. 51 is 50 `active` plus 1 `derived`, and treating them
alike would have turned a derived route into a public authoring option.

**A derived route is not a separate selectable authoring choice.** It is the
runtime presenting an existing choice at a different level. `ScreenRenderer`
resolves `screen:misconceptionCheck` itself, from the presence of a
`block:misconceptionCheck` in a screen's `blocks` array — no author ever writes
`type: 'misconceptionCheck'` at screen level, and the measured content usage
confirms it: **21 block uses, 0 screen uses.**

**Settled.**

- `block:misconceptionCheck` is the selectable authoring entry.
- `screen:misconceptionCheck` stays `status: 'derived'` and is represented in
  the Lab as the **runtime presentation** of that one choice — a presentation
  row under it, never a second index selection.
- The direct authoring coverage contract counts **active entries only**.
- Derived routes are still fully accounted for: the schema gained a
  `derivedFrom` key, mandatory on a derived entry and forbidden on any other,
  naming the active entry the route derives from. A derived route with no
  source, or an adapter bound to a derived route, is a build failure.

Direct authoring of `screen:misconceptionCheck` is not proven, so it does not
become a second selection. If it is ever proven, the change is one edit —
flip the status to `active`, drop `derivedFrom`, add an adapter — and the
guards will then *require* the second row.

### The corrected arithmetic

| | Before Phase 4 | After Phase 4 |
|---|---|---|
| Active authoring entries | 50 | **57** |
| Derived routes | 1 | 1 |
| Legacy entries (excluded) | 4 | 4 |
| Active entries selectable in the Lab | 33 | **57** |
| Active entries missing from the Lab | 17 | **0** |
| Lab selections with no active authoring entry | 11 | **0** |
| Category C items in the Lab | 5 | **0** |

The seven new active entries are the seven new authoring types below (D2 and
CalculationBreakdown). 33 + 7 + 17 = 57, with no remainder.

The superseded target was "51". The correct target is **57 selectable choices
resolving to 57 active entries**, with one derived route accounted for as a
presentation and four legacy entries excluded.

---

## D1 — content usage participates in drift checking

**Chosen: option A.** `contentUsage` is committed in the generated Lab
projection and fully checked by `pnpm lab:generate`, `pnpm lab:check` and
`pnpm verify`.

| | Approach | Cost | |
|---|---|---|---|
| **A** | **Drift-check usage like every other generated fact** | **Adds a regenerate step to the content workflow** | **chosen** |
| B | `contentUsage` generated but excluded from the check | Usage can lag — as a number, not as prose | rejected |
| C | Compute usage at runtime from a content-type index | No drift possible; costs a runtime scan and a new index | rejected |

**Why A beat the earlier recommendation of B.** B optimises for never failing
a content PR, which is the wrong thing to optimise. A number that is allowed to
lag is a number nobody can cite, and the census found two provably wrong usage
claims that had been readable and wrong for months. The regenerate step is one
command, and the failure it causes is a correct failure: the projection really
has gone stale.

Usage is never computed at Lab runtime. The Lab reads a committed fact.

**Workflow consequence, now part of the governed chapter/content pipeline:** a
content change that changes component usage must run `pnpm lab:generate` and
commit the result. Recorded in `CLAUDE.md` and in the Lane C and Lane E
workflow files.

**The scanner does not grep.** Every content module under `src/content/**` is
imported and its `screens` array walked structurally, which is the only way to
satisfy "distinguish screen and block levels". A regex over `type:` cannot tell
a screen from a block, and the previous regex evidence was wrong about exactly
that: it attributed all 8 `timelineChain` uses to the block level, when the
structural walk shows **10 screen uses and 0 block uses**. Nested question
shapes (`choice`, `truefalse`, `connection`) are excluded structurally rather
than by an exclusion list, because they never appear in a `blocks` array.

Regression coverage retained: `spotTheError`, `builder` and `acronymMemorise`
each report exactly 1 use — the three the naive regex missed.

---

## D2 — six separate public authoring types for the Maths and circuit figures

**Chosen: option B, extended to the circuit pair.**

| | Approach | Consequence | |
|---|---|---|---|
| A | One `block:mathsFigure` with a `figure` discriminator | One contract; needs a dispatching block that does not exist | rejected |
| **B** | **A type per component** | **Each component owns its own entry and contract. No router** | **chosen** |
| C | One type per topic area | Splits on curriculum rather than mechanism | rejected |

Six genuine authoring entries and six renderer routes:

| Authoring key | Component | Interaction | Required |
|---|---|---|---|
| `block:angleFigure` | `AngleExplore` | reveal | `preset` |
| `block:areaPerimeterFigure` | `AreaPerimeterExplore` | reveal | `preset` |
| `block:coordinatePlaneFigure` | `CoordinatePlaneExplore` | reveal | `preset` |
| `block:numberLineFigure` | `NumberLineExplore` | reveal | `preset` |
| `block:circuitDiagram` | `CircuitDiagram` | reveal | `preset` |
| `block:circuitSymbolReference` | `CircuitSymbolReference` | passive | — |

**Why B beat the earlier recommendation of A.** A shared prop vocabulary is not
a shared identity. The four Maths components take `preset`, `value` and
`interactive` in common, but their preset vocabularies do not interchange, and
`CoordinatePlaneExplore` alone carries axis configuration, difficulty
capabilities and guide resolution. Hiding four component identities behind a
discriminator would have made the author's choice less legible, not more, and
would have required inventing a dispatching block purely to serve the
abstraction. An author places an angle diagram or a number line — never a
"figure" plus a discriminator.

`CircuitDiagram` and `CircuitSymbolReference` get separate types for the same
reason, and a sharper one: a connected circuit is an interactive `reveal`, a
symbol board is a `passive` read-only reference. They differ in interaction
class, so they cannot be presets of one another.

Shared validation lives in common schema helpers. Each public type has its own
authoring name, contract, renderer route, pedagogy, interaction class,
continuation behaviour, Lab fixture and minimal valid chapter shape.

`block:circuitSymbolReference` requires no authored data, and that is the
honest contract rather than a gap: the board is complete in itself, and its two
props override the heading and standfirst only. No field was invented to make
the row look fuller.

---

## D3 — a separate System reference owner surface

**Chosen: option A.** A sibling owner-facing surface called **System
reference**, reached at `?systemReference=true`.

| | Approach | Consequence | |
|---|---|---|---|
| **A** | **A second owner surface beside the Lab** | **Keeps the live-render value; costs a second shell and route** | **chosen** |
| B | Storybook absorbs everything | No new app surface, but the owner reviews on a phone | rejected |
| C | Registry-only, no live preview | Cheapest; loses live preview of four real screens | rejected |

It holds the whole category C population — `Buttons and progress`,
`ChapterHookScreen`, `ChapterOutcomeScreen`, `ChapterCompleteScreen`,
`WeakSpotRecovery` — plus any further runtime or design-system item found
during implementation that is not a selectable chapter component choice.

**This is not the Component Lab.** It has its own owner flag, its own shell and
its own lazily-loaded chunk. It reuses the Lab's shell primitives and stays
mobile-first.

**No category C item remains in the Component Lab** as disabled, catalogue-only
or non-previewable. Every one keeps a live preview — on the other surface.
Nothing is deleted: `ButtonsAndProgressPage.jsx` moves across unchanged.

**The existing Lab access model is untouched.** `?componentReview=true`, the
History-browser entry card, the auth bypass, the exit behaviour, the storage
scope isolation and learner navigation all behave exactly as before. Approval
to add a sibling surface is not approval to redesign the existing one.

---

## D4 — handler-backed entries are previewed through ScreenRenderer

**Chosen: option A.** All ten `ScreenRenderer`-owned private-handler entries
are represented by mounting `ScreenRenderer` with a minimal, valid, one-block
fixture screen.

| | Approach | Consequence | |
|---|---|---|---|
| **A** | **Preview through `ScreenRenderer` with a one-block fixture** | **Renders exactly what an author gets, through the real router** | **chosen** |
| B | Export the ten handlers and mount them directly | Promotes ten deliberately private handlers to public API | rejected |
| C | Defer all ten | Ships a Lab missing the two most-used authoring types | rejected |

The private handlers are **not** exported and **no** fake component record is
created for any of them. Each Lab selection is keyed by its own authoring key —
`block:read`, `block:keypoint`, `block:examtip`, `block:scenario`,
`block:funfact`, `block:misconception`, `block:reveal`, `block:hotspot`,
`block:timeline`, `screen:standard` — and `ScreenRenderer` is only the
rendering mechanism. It never appears as a selectable Lab item.

Every fixture is a valid minimal content shape that passes the same chapter
validation as authored content — asserted per selection, not per family.

---

## D5 — both ownership defects are fixed

**Chosen: option A.**

1. **`screen:examinerExplains` moved to the canonical record.** The entry now
   sits on `WhatExaminersLookFor`, not on the parked `ExaminerExplainsScreen`
   alias. The authoring contract is byte-identical; the only change anywhere in
   the regenerated projection is the component identity
   (`ExaminerExplainsScreen` → `WhatExaminersLookFor`), and `ScreenRenderer`
   now mounts the canonical component rather than its bare re-export. The
   parked alias keeps its record and its file for compatibility — it simply no
   longer owns a live authoring entry.

2. **The Lab imports the public `FaceTheExaminer`.** The adapter binds to
   `src/components/learning/FaceTheExaminer.jsx`, never to the private family
   container `faceTheExaminer/FaceTheExaminerContainer.jsx`.

---

## The shim handover, and why the order held

`NON_AUTHORING_PEDAGOGY`'s `calculationBreakdown` entry was removed **after**
the genuine authoring entry existed, never before. The order was not merely
followed — it was *enforced*, by a guard that already existed:
`projectPedagogy` throws when a non-authoring type collides with an authoring
entry. Adding the entry made generation fail until the shim was deleted, so the
shim could not outlive its replacement, and deleting it could not lose the
classification.

Evidence, from the regenerated projection:

- the flat `calculationBreakdown` pedagogy line is **byte-identical** before
  and after — `functions: ['sequence-process', 'apply'], interaction: 'assessed'`;
- the whole pedagogy projection diff is **additions only** — no existing value
  changed;
- the whole authoring projection diff is additions plus **exactly one** rewritten
  line, the sanctioned D5 component-identity change.

`CalculationBreakdown` keeps everything: component, record, contract,
invariants, fixtures, Lab preview and all five presentations. The five
presentations are selectable authoring **modes** within the one type;
`reduced-motion` and `mobile-width` remain preview **variants**, because they
change no content.

---

## Explicitly not reopened

- **A8** — Phase 4 corrects only the false source comments catalogued in Census
  1; no access or runtime behaviour changes.
- **Pedagogy authority** — complete. Phase 4 consumes it.
- **Lab access and location** — parked, and stays parked. D3 adds a sibling
  surface; it changes nothing about the Lab's own access.
- **Storybook config** — untouched.
- **Code splitting** — no change in scope beyond keeping both owner surfaces
  lazy.
- **`CalculationBreakdown`'s retention** — settled by product mandate.
