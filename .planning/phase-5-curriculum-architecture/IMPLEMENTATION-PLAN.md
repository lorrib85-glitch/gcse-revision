# Phase 5A — compatibility migration design

How the design in `DESIGN.md` reaches production without a big-bang cutover.
**Nothing in this document is executed in Phase 5A.**

The governing constraint is D-11: `MODULES`, `CHAPTERS` and
`CHAPTER_CONTENT_LOADERS` keep their exact export names and shapes throughout.
They stop being hand-authored and start being generated. Every consumer traced
in `CENSUS.md` §2 is untouched until the stage that deliberately changes it.

---

## Migration shape

```
Stage 0  Records exist, nothing consumes them          no runtime change
Stage 1  Specifications verified and authored          no runtime change
Stage 2  Modules and chapters authored, cross-checked  no runtime change
Stage 3  Projections generated, byte-compared          no runtime change
Stage 4  Projections become the source of the three    no VISIBLE change
Stage 5A Canonical navigation projection generated,    no runtime change
         imported by nothing
Stage 5B Subject browser switched onto it              visible change, gated
Stage 6  Remaining legacy consumers migrated, THEN     cleanup
         compatibility and drift tests deleted
```

Stage 5 **adds** canonical navigation; it does not retire the compatibility
projection. Nine production consumers still read the compatibility-shaped
`MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS` after it, so every
compatibility field survives to Stage 6 and is deleted only once its own final
consumer has gone.

Stages 0–4 and 5A are all **behaviour-preserving**. The first learner-visible
change is Stage 5B. Its governing product decision (OD-8) is settled, and Stage
5A supplies the navigation configuration OD-8 requires but that did not exist.

Each stage lands independently, keeps `pnpm verify` green, and can be reverted
without touching the one before it.

---

## Stage 0 — the catalogue exists and nothing consumes it

**Lands:** `src/curriculum-catalogue/schema.js`, `index.js`, an empty `records/`
tree, and `scripts/generate-curriculum-catalogue.mjs` producing nothing yet.
`pnpm verify` gains `curriculum:check`.

**Tests:** record purity (no React, no browser APIs, no storage, no imports
outside the catalogue and the learning graph) and the runtime-isolation sweep —
`src/**` production code must not import `src/curriculum-catalogue/**`, proved
by sweeping the filesystem rather than an allowlist, the same shape as
ADR-0001 Decision 1.

**Reversible by:** deleting a directory.

---

## Stage 1 — boards and specifications

**Lands:** board records (`aqa`, `pearson-edexcel`) and one specification record
per qualification in scope.

**Blocking task, per specification (OD-9):** verify code, title, papers,
durations, marks, tiers and assessment objectives against the **current board
specification document**. `MODELS.md` states these values as the architecture
requires them; they are not repository-measured facts and must not be authored
from that document alone.

**Also lands:** `paper.subjectId` and `paper.assessmentType` on every paper, so
Combined Science's six papers and Drama's three components are expressible from
the first commit rather than retrofitted.

**Deliberately not landed:** specification requirements for qualifications with
no content (`DESIGN.md` §8). Requirements are authored per specification only
when that specification's content is being built.

**Settled decision applied here:** OD-7 — Drama and Music get **no** records in
Stage 0 or Stage 1. Nine specifications are authored, not eleven; `MODELS.md`
§8–9 stay architecture proofs.

---

## Stage 2 — subjects, pathways, modules, chapters

**Lands:** subject records, pathway records, module records and chapter records
for everything the census enumerated.

**The census is the input.** `census/migration-census.json` classifies all 171
current entities and names each one's target. Stage 2 is executing that file,
not re-deciding it.

**The canonical chapter baseline is 65, not 60.** An earlier draft of this
document said "same 60 chapter ids, no additions", which contradicted both
`MODELS.md` §11 and the census. `CHAPTERS` holds 60 rows, but two of those rows
are not one-to-one with canonical chapter records:

```
60 rows in CHAPTERS
−  1 hidden legacy bundle   history-medicine-renaissance-medicine
= 59 non-hidden chapter ids, every one preserved verbatim
+  6 planned English chapters, converted from the cs_macbeth_2–4 /
     cs_inspector_1–3 placeholder cards (census: presentation-only → chapter)
= 65 canonical chapter records   (30 available · 35 planned)
```

Both ends reconcile with the measured census, which classifies 59 entities
`chapter` and exactly one `retired-hidden`, and with `MODELS.md` §11's
30 built / 35 planned.

**`history-medicine-renaissance-medicine` gets no canonical chapter record.** It
is the superseded Renaissance bundle, hidden from every learner surface and
succeeded by `history-medicine-vesalius-beginning-doubt`. Its id is not lost:
it stays reachable through the existing legacy/progress compatibility mechanism
(`LEGACY_CHAPTER_ID_MAP` and `chapterProgressSourceKeys` in
`src/data/chapterProgress.js`, §6.4), which is what a superseded id is for. A
`retired` chapter record would put it back in the catalogue as a chapter, which
is precisely what the census says it is not.

**Cross-check, and it must be exact.** A test asserts that the new records
reproduce today's reality precisely:

| Assertion | Source of truth |
|---|---|
| All 59 non-hidden chapter ids preserved verbatim, none removed | `CHAPTERS` |
| The 6 added ids are semantic, never `cs_*` | `subjectCatalogue.js` placeholders |
| Same chapter order within each module | `MODULES[].chapterIds` |
| Same availability for every chapter | `getChapterAvailability` |
| Same content path for every available chapter | `CHAPTER_CONTENT_LOADERS` |
| Same subject for every chapter | `chapter.subject` |
| `screenCount` derived == authored, for all 59 | `extracted-chapter-contract` Rule 1 |

Module *splits* (A-1, A-7) change which module a chapter belongs to, so the
"same order within each module" assertion is scoped to modules that do not
split, and the splitting modules get explicit expected orders. That is the one
place Stage 2 changes a fact, and it is stated rather than absorbed.

**Settled decision applied here:** OD-4 — `soc1`–`soc3` move to
`sociology-aqa-key-concepts`; `soc4` and `soc6` stay in `sociology-aqa-families`.
Stage 2 authors the split directly. Nothing moves in the current runtime
catalogue, so `MODULES` keeps all five in `soc_family` until Stage 4.

**Settled decision applied here:** OD-5 — `history-medicine-nightingale` stays a
distinct `planned` chapter in the Medicine module and is not absorbed.

**Still no runtime change.** Nothing imports these records.

---

## Stage 3 — projections generated and byte-compared

**Lands:** `scripts/generate-curriculum-projections.mjs` writing:

```
src/data/generated/curriculum/modules.js
src/data/generated/curriculum/chapters.js
src/data/generated/curriculum/chapterContentLoaders.js
```

Each exports the **same symbol names and shapes** as the file it will eventually
replace, with the standard `GENERATED FILE — DO NOT EDIT` banner.

**The gate:** a test imports both the authored and the generated version and
asserts deep equality — same ids, same order, same availability, same loader
keys, same resolved content modules. Where a field is now derived
(`screenCount`, `screenTags`, `number`, `subject`, `series`), the generated
value must equal the currently authored one.

This is where the derived-`screenTags` improvement shows up as a **deliberate
difference**: A-20 measured 13 weakness routes landing on screen 0 because their
tag is missing from the target chapter's `screenTags`. Derived tags fix some of
those by construction. The test must therefore assert *equality of tags that
exist* and *report* newly-correct positions rather than failing on them — and
the report is reviewed, not auto-accepted, because a route moving from screen 0
to screen 14 is a learner-visible change even though no code changed.

**The compatibility projection.** The catalogue describes 8 subjects, 14
pathways, 36 modules and 65 chapters; the runtime interface exposes 7 modules,
60 chapters and 60 loaders. Stage 3 therefore lands
`src/curriculum-catalogue/compatibility/runtime-v1.js` — an isolated, validated,
build-time-only source holding the minimum non-derivable facts that reproduce
the OLD interface: the seven legacy module aggregations, the runtime row and
loader orders, the legacy-only chapter fields (`number`, `series`, `color`,
`colorLight`, facet tags), the hidden Renaissance row, and the explicit
exclusion of the six planned English chapters.

It is **not a curriculum entity**. `legacyContentBindings` — filed under
`records/` at Stage 2 and loaded through `RECORD_TYPES`, which made it a seventh
entity type by accident — is reclassified into it. There are six entity types
and there is no seventh.

Every compatibility field names the stage that deletes it, and validation fails
for any field that does not. Full contract and the field-authority audit:
`docs/system/CURRICULUM_RUNTIME_COMPATIBILITY.md`.

**Still no runtime change.** `pnpm verify` now checks the projections are
current and that they agree with the authored files.

---

## Stage 4 — the three files become re-exports

**Lands:** the smallest possible diff, three files:

```js
// src/data/modules.js
export { MODULES, getModuleById, getModuleForChapter } from './generated/curriculum/modules.js'

// src/chapters.js
export { CHAPTERS, CHAPTER_AVAILABILITY, getChapterAvailability, isChapterAvailable }
  from './data/generated/curriculum/chapters.js'

// src/content/chapterContentRegistry.js
export { CHAPTER_CONTENT_LOADERS, loadChapterContent }
  from '../data/generated/curriculum/chapterContentLoaders.js'
```

**Zero consumer changes.** `progress.js`, `chapterNavigation.js`,
`dailyPlanner.js`, `subjectCatalogue.js`, `Subjects.jsx`, `LegacyApp.jsx`,
`todaysPlan.js`, `contentHierarchy.js` and all 19 test files that import these
symbols are untouched.

**Verification:** the Stage 3 equality test stops importing the three runtime
files and compares the generated output against
`tests/fixtures/curriculum-runtime-v1.json` — a frozen semantic capture of the
pre-cutover interface, taken while all three were still hand-authored. Without
that move the gate would compare the generated files with themselves the moment
they became re-exports. The fixture is test-only, is never a generator input,
holds all 7 modules, all 60 chapter rows (field absences included), all 60
normalised loader targets and the three public export surfaces, and its digest
is pinned in the test so an edit to it is always a visible contract change. It
is deleted at Stage 6, with `compatibility/`.

**This is the reversal point.** Reverting Stage 4 restores three files from git
and nothing else. After it, the catalogue is load-bearing.

**Still no learner-visible change.** A chapter renders identically, in the same
order, with the same progress.

**The compatibility projection is unchanged and still required.** Stage 4 moves
where the three files get their data, not what that data is, so the projection
must keep producing the identical interface. Nothing in
`src/curriculum-catalogue/compatibility/` is deleted at this stage.

---

## Stage 5 — canonical subject navigation

Stage 5 is complete in three controlled slices:

- **5A** defines Browser Entries and generates
  `src/data/generated/curriculum/navigation.js` without a runtime import.
- **5B** switches the live subject browser onto that projection through a thin
  adapter, preserving seven destinations, 71 visible items, 30 openable
  Chapters, card copy, numbering, tabs and progress behaviour.
- **5C** renames the surviving boundary to
  `subjectNavigationAdapter.js`, removes the proved-dead 20-entry Chapter image
  fallback, narrows the adapter so compatibility-shaped Chapter rows do not
  leak into the UI, and updates the architecture records. No learner-visible
  behaviour changes.

Browser presentation remains separate from the six curriculum entity types.
`browserEntries.js` owns destination copy, imagery, sections and card mode;
canonical pathway, Module and Chapter records own academic identity and order.
Temporary number and Physics-label overrides remain governed by
`stage-5-navigation/DECISIONS.md`.

The compatibility projection remains intact until Stage 6. Stage 5 migrates the
subject browser only; the remaining runtime consumers still require the legacy
`MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS` interfaces.

Full contract pack: `stage-5-navigation/`.

---

## Stage 6 — canonical learner runtime and compatibility retirement

Stage 6 is complete. It did **not** route progress and planning through the
browser projection. Instead it added an explicit Learning Sequence configuration
and generated canonical learner-runtime query model:

- canonical Modules continue to own Chapter membership;
- Study Pathways continue to own qualification structure;
- Browser Entries continue to own destination presentation;
- Learning Sequences own only app-level continuation, numbering scope and planner order;
- `src/data/learnerCurriculum.js` is the sole production boundary for canonical
  Modules, Chapters, sequences and content loaders.

All live consumers moved from compatibility-shaped `MODULES`, `CHAPTERS` and
`CHAPTER_CONTENT_LOADERS` onto that boundary. The hidden Renaissance bundle was
retired; both historical progress ids now resolve directly to
`history-medicine-vesalius-beginning-doubt`.

The subject-wide denominator source now reflects the canonical Chapter set:
History drops the one hidden non-Chapter row and English gains the six genuine
planned Chapters that the compatibility projection explicitly excluded. No
Chapter progress key or stored learner result changes.

Deleted after the migration passed parity, full verification and mobile smoke:

- `src/curriculum-catalogue/compatibility/`;
- the three old generated runtime projections and their generator;
- `src/data/modules.js`, `src/chapters.js` and
  `src/content/chapterContentRegistry.js`;
- the frozen runtime-v1 fixture and compatibility/parity tests;
- the redundant runtime content-hierarchy validator.

Deliberately retained: `screenTags` and `tagChapterMap.js`. They still power
weakness routing and cannot retire until Chapter Topic T3 provides the
concept→Topic replacement.

---

## What each stage costs if it goes wrong

| Stage | Worst case | Recovery |
|---|---|---|
| 0 | a directory nobody imports | delete it |
| 1 | a wrong specification code | edit one record |
| 2 | a chapter in the wrong module | edit one module record; no learner data involved |
| 3 | generator produces different data | the equality test fails; nothing ships |
| 4 | generator regression reaches runtime | revert three files from git |
| 5 | a subject disappears from the browser | revert `Subjects.jsx`; the projection stays |
| 6 | a deleted test was load-bearing | restore from git |

**No stage can lose learner progress.** Chapter progress keys are untouched at
every stage (D-8), and subject-string progress is read-compatible via
`legacyProgressNames` (OD-1 settled, OD-2 open). That property is what the staging exists to
protect.

---

## Phase 5A completion criteria

This phase is complete when all of the following are true, and none of them
involve production behaviour:

1. A deterministic baseline exists and regenerates byte-identically —
   `baselines/current-curriculum-baseline.json`, `--check` clean. ✅
2. Every curriculum fact has an authority row stating its owner, its copies, its
   consumers, its kind, and whether its test removes duplication or detects
   drift — `CENSUS.md` §2. ✅
3. Every current entity is classified with a proposed target and a note, checked
   by a generator that fails on gaps and on stale entries —
   171 entities, `census/migration-census.json`. ✅
4. Anomalies are recorded rather than normalised — 20 of them, `CENSUS.md` §3. ✅
5. Every entity in the ontology has owned, referenced and prohibited fields —
   `DESIGN.md` §3. ✅
6. All eleven target qualifications are modelled with no schema exception —
   `MODELS.md`. ✅
7. ID rules exist and state how existing ids are preserved or mapped —
   `DESIGN.md` §4, §6.4. ✅
8. A single-owner table covers every major fact, with a generation rule for
   every derived one — `DESIGN.md` §5. ✅
9. Catalogue boundaries and permitted runtime projections are defined —
   `DESIGN.md` §6. ✅
10. The migration is staged, reversible and behaviour-preserving until an
    explicitly gated stage — this document. ✅
11. Genuine unresolved decisions are documented with an owner and a default —
    `DECISIONS.md`. Ten at the close of Phase 5A; five were settled by the
    product owner before Stage 0, five remain open. ✅
12. No production behaviour, authored content, learner-facing UI, progress
    storage, component routing or generated runtime registry changed. ✅
