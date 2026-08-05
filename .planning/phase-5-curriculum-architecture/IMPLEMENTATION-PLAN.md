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
Stage 5  Navigation moves off the hardcoded literals   visible change, gated
Stage 6  Old authored files and drift tests deleted    cleanup
```

Stages 0–4 are all **behaviour-preserving**. The first learner-visible change is
Stage 5. Its governing product decision (OD-8) is now settled, so it is gated on
Stages 2–4 rather than on a pending decision.

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

**Verification:** the Stage 3 equality test now compares the generated output
against a checked-in snapshot of the pre-Stage-4 authored data, so a regression
in the generator is caught even after the authored files are gone.

**This is the reversal point.** Reverting Stage 4 restores three files from git
and nothing else. After it, the catalogue is load-bearing.

**Still no learner-visible change.** A chapter renders identically, in the same
order, with the same progress.

---

## Stage 5 — navigation moves off the hardcoded literals

The first stage a learner could notice. **OD-8 is settled**: a subject is shown
when a non-retired catalogue study pathway in the navigation configuration
reaches at least one non-retired module for that subject. Both `active` and
`planned` modules qualify; `retired` never does. No `browsable` field exists.
Stage 5 must preserve the current seven visible subjects.

**Lands:** `src/data/generated/curriculum/navigation.js`, and `Subjects.jsx`
reading it instead of eight hardcoded literals:

| Retired from `Subjects.jsx` | Replaced by |
|---|---|
| `SUBJECT_NAMES` (7 hardcoded, untested) | subjects reached by a configured non-retired pathway through a non-retired module, `active` or `planned` (OD-8) |
| `SUBJECT_DISPLAY_TITLES` | subject record `title` — retires `History: 'Medicine through time'` |
| `SUBJECT_DESCRIPTIONS` | subject record |
| `SUBJECT_HEADER_IMGS`, `SUBJECT_TOPIC_IMAGES` | subject record presentation |
| `HISTORY_SERIES`, `ENGLISH_SERIES` | module records of the active pathway — gives `elizabethan` (A-5) and `inspector` real backing, and fixes the two wrong hero images (A-9) |
| `CHAPTER_HEADER_IMAGES` | deleted outright — all 20 entries are already dead (A-10) |
| `MACBETH_PLACEHOLDERS`, `INSPECTOR_PLACEHOLDERS`, `PHYSICS_PLACEHOLDERS` and the synthesised `cs_<subject>` fallback | `status: 'planned'` modules and chapters — retires all 12 `cs_*` ids (A-15) |

`subjectCatalogue.js` is deleted; its job becomes a projection.

**Behaviour that must not change:** the seven browsable subjects, chapter order,
which cards are openable, and every progress percentage. The `cs_*` cards change
identity but must render the same titles, subtitles and coming-soon state.

**Explicitly deferred to its own change:** anything that alters *what a learner
sees*, beyond retiring dead data. Fixing A-9's wrong hero images is a content
decision, made visible here but decided separately.

---

## Stage 6 — cleanup

**Deleted:**

- `src/features/subjects/subjectCatalogue.js` (superseded at Stage 5);
- `src/data/contentHierarchy.js`'s validator — the schema validates the same
  relationships at build time, and a relationship that cannot be expressed
  cannot be authored;
- `src/data/tagChapterMap.js`'s hand-maintained map — chapter routing becomes a
  concept→chapter query, which also resolves A-8's 21 unregistered `maths:*`
  tags and A-20's 13 broken routes;
- every drift test in `CENSUS.md` §2 whose two sources have collapsed into one:
  `extracted-chapter-contract` Rule 1, the `screenTags.length` check, the
  module/chapter subject equality check, and the loader-presence checks in
  `module-metadata-integrity.test.js`.

**Kept, unchanged, throughout all six stages:**

`ChapterPlayer` · `ScreenRenderer` · the component catalogue and its four
generated registries · the learning graph · the mastery engine ·
`src/data/chapterProgress.js` · `src/lib/storage.js` · `src/constants/subjects.js` ·
the question banks · the exam papers.

**Superseded documentation:** `docs/system/CONTENT_HIERARCHY.md`, per OD-10.
Not touched before this stage.

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
