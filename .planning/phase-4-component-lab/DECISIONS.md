# Phase 4 — open decisions

Only genuinely unresolved product/architecture questions are listed. Anything the
census settled with evidence is in `CENSUS.md`; anything the design settles is in
`DESIGN.md` and is **not** reopened here.

Each decision states what is actually at stake, the options, and a
recommendation. None is decided in this phase.

---

## D1 — Does generated content usage participate in drift checking?

**The problem.** `DESIGN.md` puts `contentUsage` (occurrence and file counts per
authoring type) into the generated Lab projection, because that is the only way
to stop usage prose going stale — the census found two provably wrong claims.

But the existing generator pattern pairs `pnpm x:generate` with `pnpm x:check`,
which **fails the build on drift**. Content usage changes whenever anyone authors
a screen. If usage counts are drift-checked the same way, every content commit
that adds or removes a screen type breaks `pnpm lab:check` until someone
regenerates — friction on the most frequent kind of change in the repo (68
content files, 51 distinct types today).

**Options.**

| | Approach | Cost |
|---|---|---|
| A | Treat usage like every other generated fact: drift-checked, regenerate on content change | Adds a regenerate step to `/chapter-creation` and `/content-create`; a forgotten regenerate fails CI on a content PR |
| B | Split the projection: catalogue-derived fields are drift-checked, `contentUsage` is generated but **excluded** from the check | Usage can silently lag; but it lags as a number, not as prose, and is regenerated on demand |
| C | Compute usage in the Lab at runtime from a small content-type index | No drift possible; costs a runtime scan and a new index the Lab must consume |

**Recommendation: B.** Usage is the one field whose truth lives outside the
catalogue and changes on a different cadence. Drift-checking it couples the
component-governance pipeline to content authoring for no governance benefit — a
usage count that is a week old is still enormously better than prose that is a
year old. Ship B, and add usage regeneration to the content workflow later if the
lag ever misleads anyone.

**Why this needs a decision:** it changes the contract of `pnpm lab:check` and
touches the content authoring workflow, which is outside this phase's remit to
change unilaterally.

---

## D2 — How much new coverage lands in Phase 4?

**The problem.** The census found 28 records not represented. `DESIGN.md` lists
them in priority order but does not say how many Phase 4 must deliver. The
architecture work (generated projection, adapter layer, shell rewrite, identity
corrections, duplicate collapse) is separable from the coverage work (up to 22
new preview adapters, each needing a realistic GCSE fixture).

**Options.**

| | Scope | Consequence |
|---|---|---|
| A | Architecture only; coverage in a follow-up | Phase 4 ships the honest three-layer split; the Lab still shows 56/84, but now *says so* |
| B | Architecture + the five absent reusable components (§4 items 1–5) | Closes the sharpest gap — `ExamQuestionFrame` alone has 61 content uses |
| C | Architecture + full coverage (all 22 adapters) | Large fixture-authoring effort bolted onto an architecture change; hard to review as one diff |

**Recommendation: B.** The five absent reusables are the ones an author could
genuinely pick and cannot currently see. The ten reference-page primitives and
seven runtime components are real gaps but low-frequency, and they are additive —
they can land without touching the architecture again.

---

## D3 — Should non-mountable records appear in the index?

**The problem.** `DESIGN.md` proposes listing `ChapterPlayer`, `ScreenRenderer`
and the other non-mountable records with their facts and a stated reason. That
makes the Lab a complete view of the catalogue, but it puts nine entries in an
owner's browse surface that do nothing when opened.

The counter-argument is real: the Lab's value is *visual comparison*. A row that
cannot be previewed may be noise, and `docs/components/COMPONENT_REGISTRY.md`
already exists as the complete readable view.

**Options.**

- **A. List them**, visually distinct, with the reason — the Lab becomes the
  complete catalogue projection its name implies.
- **B. Exclude them**, and let the Lab remain "everything you can look at",
  pointing at the generated registry for the rest.
- **C. List them behind an off-by-default "show non-previewable" toggle.**

**Recommendation: C.** It preserves the completeness claim — and the guarantee
that every record is accounted for — without cluttering the default browse
surface. The toggle costs one filter and no new facts.

---

## D4 — Does `GuidedAnswerCoach` get a preview?

**The problem.** `GuidedAnswerCoach` is `kind: feature`, `decision:
not-applicable` — an app-level Exams-tab feature with an eight-stage scaffold,
not a component an author picks for a chapter. It is the only category-10 record
whose exclusion is arguable in both directions.

Previewing it means mounting a whole feature flow inside an owner tool and
pulling `guidedAnswerCoach.js` (51.90 kB as its own chunk) into the Lab's
dependency graph.

**Options.**

- **A. List, do not mount** — consistent with `ChapterPlayer` and `ScreenRenderer`.
- **B. Mount it** with one fixture question type — it is genuinely visual and the
  owner may well want to review it.
- **C. Exclude entirely** — it is reachable in the real app via the Exams tab.

**Recommendation: A.** It is a feature, not an authoring choice, and the real app
already shows it. Listing keeps the reconciliation complete at no cost.

---

## D5 — Does the reference page stay one page?

**The problem.** `ButtonsAndProgressPage` currently renders ten core components
plus four non-component patterns as a single scrolling entry. `DESIGN.md` adds
ten more primitives to it. That is twenty components on one page, which is either
a well-organised design-system reference or an unnavigable wall.

It also matters for the join model: reference-page components are represented but
not individually selectable, so an owner cannot deep-link to one.

**Options.**

- **A. One page, sectioned** — as today, with new sections.
- **B. Several reference pages** (buttons / text and layout primitives / progress
  and feedback), each its own Lab entry.
- **C. Reference page *and* individual entries** — each primitive gets a
  selectable row that scrolls the shared page to its section.

**Recommendation: B.** Three focused pages keep each one reviewable at 390px,
which is the whole point of the Lab, and it needs no new selection machinery.
C is the better end state but costs an anchor/scroll mechanism the shell does not
have.

---

## Explicitly not reopened

- **A8** — resolved. The design spec carries the shipped-access addendum; the
  font question is A13. Phase 4 corrects **only** the false source comments
  catalogued in Census 1, and changes no access or runtime behaviour.
- **Pedagogy authority** — complete. Phase 4 consumes it and does not
  reinterpret it. D3 and D4 from Phase 3 remain deferred.
- **Lab access and location** — parked by the settled boundaries.
- **Storybook** — untouched.
- **Code splitting** — options recorded in the bundle baseline; no change in scope.
