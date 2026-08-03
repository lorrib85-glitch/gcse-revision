# Phase 3 — decisions surfaced by the census

Only genuine unresolved questions. Mechanical choices settled by the phase
brief (per-entry pedagogy, compatibility-entry ownership, separate namespaces,
parity-first migration) are not re-opened here.

**D1 and D2 block implementation** — they determine what the generated
projection contains. **D3 and D4 do not block** — settled policy is that every
current classification migrates byte-identically and these return for review
afterwards; they are recorded so they are not lost.

---

## D1 — the four taxonomy keys registered in neither authoring namespace *(blocking)*

Census §2c. All four would violate guard 9 (no pedagogy without an owning
entry) unless kept via an approved non-authoring population.

**`choice`, `truefalse`, `connection`** — question-item types nested inside
`questions` arrays; never display types; **zero consumers** (quality checks and
the coverage test only ever walk `screen.type` and `blocks[].type`; no Lab
entry names them). Post-flip, `getTypeInfo('choice')` would return `null`
instead of a value — observable only to a caller that doesn't exist.

- **Recommendation: drop all three**, recorded as approved taxonomy-parity
  exceptions in the parity script (the Phase 2 treatment of stale claims:
  delete outright, don't tombstone).
- Alternative: carry them in `nonAuthoringPedagogy.js` — but they would be
  entries with no consumer and no removal trigger, exactly what the
  shrinking-set discipline forbids.

**`calculationBreakdown`** — one live consumer: the Lab entry derives its
interaction badge from it (`reviewManifestCore.jsx:701,949`). The component is
real, catalogued, storied, but unrouted and unauthorable.

- **Recommendation: keep**, as the single member of
  `nonAuthoringPedagogy.js`, with reason ("Lab interaction badge; component
  not yet authorable") and removal condition ("delete when Phase 4 gives the
  Lab manifest its interaction another way, or when CalculationBreakdown gains
  a real authoring entry — whichever first").
- Alternative: drop it and hand-set `interaction` on the Lab entry — but that
  edits the Lab manifest, which Phase 3's exclusions forbid.

## D2 — the three authoring entries with no taxonomy coverage *(blocking)*

Census §2d. Guards 1–2 require every active entry to carry pedagogy, so the
flip must either assign facts or exempt explicitly. These are **new facts**,
not migrations — the do-not-silently-improve rule doesn't apply, but they need
sign-off because nobody has ever classified them.

**screen `standard`** — the generic block-container screen; its pedagogy is
whatever its blocks are; quality checks never consult it (raw `screen.type` is
`undefined` for standard screens and filtered before lookup).

- **Recommendation: explicit exemption** — a documented
  `pedagogy: null`-permitted case on the `standard` entry (schema allows null
  only where a stated container-exemption flag is set), preserving today's
  behaviour exactly. Giving it a real classification would invent a fact the
  quality system would then half-consult (only for explicitly-typed screens).

**block `hotspot`** (renderer-owned, 0 uses) — tap-to-explore labelled
diagram, no scoring. Today's absence makes any host screen count non-passive
by accident.

- **Proposed values:** `functions: ['teach-mechanism']`,
  `interaction: 'reveal'` — same reasoning as the documented 2026-07-24
  `interactiveImage` correction (its full-screen sibling).

**block `timeline`** (renderer-owned, 0 uses) — static rendered event list.

- **Proposed values:** `functions: ['sequence-process']`,
  `interaction: 'passive'` (display only — no tap-to-progress mechanic in the
  handler).

Consequence either way: quality parity is unaffected today (zero uses), but
future content using `hotspot`/`timeline` would flip from
accidentally-non-passive to their true class. That is the point of covering
them.

## D3 — legacy compatibility types classified `assessed` *(non-blocking, deferred)*

`appliedscenario`, `examscored`, `tieredquiz` (block), `timelinedrag` all
render the `LegacyUnroutedBlock` notice, yet their `assessed` classification
currently lets a legacy notice **satisfy the `STAGE_NO_ASSESSMENT` guardrail**
and make a screen count as non-passive. The classifications describe the
authored intent, not what renders.

Migrates unchanged (settled). The open question, for after the flip: should a
compatibility entry's pedagogy describe the *replacement experience* or the
*rendered notice*? Changing to the notice-truth (`passive`, arguably no
functions) would surface new `STAGE_NO_ASSESSMENT` / `PASSIVE_RUN` violations
in the chapters still carrying these 12 uses — i.e. it would tell the truth
about degraded stages. That is a content-quality product call, best taken
together with actually migrating the 12 uses to their replacements.

## D4 — likely-stale `assessed` claims on active types *(non-blocking, deferred)*

Migrate unchanged (settled). Return for review with evidence:

| type | current | evidence | likely correction |
|---|---|---|---|
| `centreImageReveal` | assessed / apply | no correctness, no logging, no scoring in component | reveal |
| `guidedChoiceCarousel` | assessed / apply | no correctness; all options valid, routes by `nextId` | reveal |
| `factorWeb` | assessed / teach-comparison+apply | JudgementPhase = pick a factor + revealed verdict; no marking found — genuine pedagogy call | needs product decision, not a grep |

Correcting any of these changes quality-guardrail behaviour for the chapters
using them (4 + potential future uses), so each correction should arrive as
its own reviewed change with a quality-baseline diff attached — the mechanism
the parity harness makes cheap.
