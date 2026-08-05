# Phase 5A — canonical curriculum architecture

The design. `CENSUS.md` is the evidence it is built on; `MODELS.md` is the set
of worked qualifications that test it; `DECISIONS.md` records what is settled
and what genuinely is not; `IMPLEMENTATION-PLAN.md` is the migration.

Nothing here is implemented in this phase.

---

## 1. Domain boundary

The curriculum catalogue copies the **shape** of the component catalogue and
shares **none of its authority**:

```
one authored source  →  central validation  →  deterministic generated projections  →  generated human docs
```

Two separate catalogues, because they answer different questions with different
lifetimes and different consumers:

| | Component catalogue | Curriculum catalogue |
|---|---|---|
| Question | *What is this component, and may an author place it?* | *What is this learner studying, and in what order?* |
| Changes when | a component is built or its contract changes | a specification, a school's option choice, or a build plan changes |
| Runtime exposure | build-time only; `src/**` must never import it | projections are shipped; navigation is built from them |
| Authority over the other | none | none |

**Neither catalogue may reference the other.** A curriculum record must not name
a component, and a component record must not name a subject, module or
specification. The join between them already exists and stays where it is: a
chapter's content file authors `type:` values that `ScreenRenderer` routes
through the generated authoring registry.

### 1.1 Runtime boundaries this design preserves unchanged

```
Resolved chapter → ChapterPlayer → ScreenRenderer → registered authoring type → approved component
```

Restated as prohibitions the curriculum migration must satisfy:

- chapter **lifecycle** stays in `ChapterPlayer`; no curriculum record gains a
  lifecycle field, a gate, or a completion rule;
- component **routing** stays in `ScreenRenderer`; no curriculum record names a
  component or a screen type;
- **exam-board logic stays out of components**; a component never learns which
  board it is rendering for. Board is a specification fact, reachable from a
  chapter through its module, and stops at the content layer;
- **no subject branch enters `ChapterPlayer`**. It has none today and gains none;
- **curriculum authority never enters the component catalogue**.

The migration changes how a chapter is *described, grouped, discovered and
resolved*. It changes nothing about how a chapter *runs*.

---

## 2. The upper model is relational, not a tree

`Subject → Specification` is not a one-to-many ownership hierarchy, and the
census proves it twice over:

- **AQA Combined Science: Trilogy (8464)** is one specification covering
  Biology, Chemistry and Physics. Under a tree, it must belong to one of the
  three, and the other two must either duplicate it or lose it.
- **English** is one theme key over two separate specifications (Language 8700,
  Literature 8702) that are separately certificated.

So the upper layer is four record types with explicit references:

```
Subject ─────────┐
 (discipline)    │  covers (many-to-many)
                 ▼
          Specification ──── owns ──► Paper
                 ▲                    Assessment objective
                 │ realises           Specification requirement
                 │ (one)
          Study pathway ──── ordered module references ──► Module
                 │                                           │
                 │                                           │ ordered chapter references
                 │                                           ▼
                 └──── selections (tier, options, texts)   Chapter ──► content file
                                                             │
                                                             │ references (many-to-many)
                                                             ▼
                                                          Concept   (learning graph — unchanged)
```

Read as sentences:

- a **Specification** covers one *or more* Subjects;
- a **Study pathway** realises exactly one Specification with a specific set of
  selections;
- a **Module** has one primary Subject and may be referenced by *many* pathways;
- a **Chapter** belongs to exactly one Module;
- ordering lives on the **references**, never on the entities.

Two arrows are deliberately absent. Subject does not own Specification — Combined
Science forbids it. Module does not own Specification — a Module is reused across
Foundation and Higher pathways of the same specification and, for shared Science
content, across specifications.

---

## 3. Entity definitions

Every definition states owned fields, referenced fields, prohibited fields and
identity rules. "Prohibited" is load-bearing: it is what stops the levels
collapsing back into each other.

### 3.1 Subject

> A **Subject** is a stable academic discipline. It survives a specification
> change, a board change and a tier change.

Canonical set for the target scope:

`mathematics` · `biology` · `chemistry` · `physics` · `history` ·
`english-language` · `english-literature` · `sociology` · `drama` · `music`

**English is two subjects, not one.** The decision is made from requirements,
not aesthetics:

| Requirement | Evidence |
|---|---|
| Qualification | Two AQA specifications (8700, 8702), separately entered and separately certificated. |
| Pathway | Literature carries text selections; Language carries none. One subject would need a `selections` field that is meaningless for half its pathways. |
| Progress | Subject strings are persisted in `gcse_scores` and the weakness tracker (A-19). "English 62%" over a mixture of Macbeth analysis and unseen-text writing is not a number a learner can act on. |
| Content reuse | Zero. No Language module teaches Literature content or vice versa. A merged subject would buy nothing. |

`Drama` and `Music` are single subjects: one AQA specification each, and their
practical/written split is a *component* structure inside the specification, not
two disciplines.

**Owns**

| Field | Notes |
|---|---|
| `id` | stable, kebab-case, board-free, tier-free |
| `title` | learner-facing, sentence case |
| `shortTitle` | for tabs and chips |
| `themeKey` | reference into `SUBJECTS` — **the theme is not the identity** |
| `status` | `active` \| `planned` |

**References** — `themeKey` only.

**Prohibited** — exam board, specification code, tier, paper list, chapter list,
module list, hero image, palette values. A subject that lists its modules
recreates the tree the census disproved: `mathematics` would have to list both
Foundation and Higher content and lose the distinction between them.

**Theme relationship.** Many-to-one, subject → theme key. `english-language` and
`english-literature` both point at `English`. The theme key stays exactly where
it is, in `src/constants/subjects.js`, and stays a presentation-only record.

**Progress implications.** Subject ids appear in persisted score and weakness
rows (A-19). They are therefore **progress identity**, and the canonical ids
above differ from the persisted strings (`'History'` → `history`,
`'English'` → two ids). Both need the alias policy in §6.4 — this is not a free
rename.

### 3.2 Specification

> A **Specification** is the regulated qualification document a learner is
> assessed against. It is the only place board, code and assessment structure
> are authored.

**Owns**

| Field | Notes |
|---|---|
| `id` | e.g. `aqa-gcse-mathematics-8300` |
| `boardId` | reference to a board record |
| `qualification` | `gcse` today; the field exists so `tier:gcse` (A-14) stops being a tag |
| `code` | official code — `8300`, `8464`, `8700`, `8702`, `1HI0`, `8192`, `8261`, `8271` |
| `title` | official title, verbatim |
| `subjectIds` | **a list** — Combined Science holds three |
| `papers` | ordered paper records (§3.9) |
| `assessmentObjectives` | `{ id, title, weightings }` — `weightings` is scoped: `{ overall }` or one entry per tier (Maths differs by tier; English Language AO7–AO9 are 0%) |
| `tiers` | `['foundation','higher']` or `[]` |
| `firstTeaching` / `firstAssessment` / `withdrawnFrom` | versioning; `withdrawnFrom: null` = current |
| `requirements` | specification requirement records (§3.8) |

**References** — board, subjects.

**Prohibited** — modules, chapters, learner selections, ordering, images,
learner-facing copy beyond the official title. A specification that lists
modules cannot be shared by a Foundation and a Higher pathway with different
module sets.

**Combined Science is the proof.** `aqa-gcse-combined-science-trilogy-8464` has
`subjectIds: ['biology','chemistry','physics']` and six papers, two per subject.
Nothing about that shape is special-cased; `subjectIds` is a list for every
specification, and single-subject ones simply have one entry.

**Multiple pathways per specification is the normal case**, not an exception —
Maths 8300 has two (Foundation, Higher), Literature 8702 has one per text
combination.

### 3.3 Study pathway

> A **Study pathway** is the exact route one cohort or learner follows through
> one specification: its tier, its option choices, its set texts, and the
> ordered modules that result.

The name is kept. `course` is deliberately avoided: the learning graph already
uses "course" at four different levels (A-13), so reusing it would import a
known ambiguity into the one place that must be unambiguous.

**Owns**

| Field | Notes |
|---|---|
| `id` | e.g. `aqa-maths-8300-higher` |
| `specificationId` | exactly one |
| `title` / `shortTitle` | learner-facing |
| `tier` | `foundation` \| `higher` \| `null` |
| `selections` | resolved option/text choices (below) |
| `moduleRefs` | **ordered** module reference records (§3.6) |
| `status` | `active` \| `planned` \| `retired` |
| `scope` | `catalogue` \| `installation` — see below |

**References** — specification, modules (through refs).

**Prohibited** — chapters (reached through modules), board or code (owned by the
specification), theme, images.

**`selections` shape.** A resolved map from a specification's selection group to
the chosen option:

```js
selections: {
  'shakespeare-text': 'macbeth',
  'modern-text': 'an-inspector-calls',
}
```

The *groups* are owned by the specification (it defines what must be chosen);
the *choices* are owned by the pathway. That split is what lets a second school
pick a different text without touching either the specification or the module.

**Identity scope.** Two kinds of pathway, distinguished by one field:

- `scope: 'catalogue'` — a pathway shipped with the app. Its id is **globally
  stable** and may appear in persisted data.
- `scope: 'installation'` — a pathway a school or learner assembles later. Its
  id is stable **within one installation** only and must never be assumed
  globally unique.

Persisted learner data may only reference a `catalogue` pathway id. Everything
in the target scope is `catalogue`; the distinction is declared now so that
adding learner-assembled pathways later is a new record, not a redesign.

**Progress implications.** A pathway is a *view*, not a progress key. Chapter
progress stays keyed on chapter id (§6.4), so switching pathway or tier keeps
every completed chapter. This is the single most important consequence of the
model: **Foundation → Higher must not cost a learner their progress.**

### 3.4 Module

> A **Module** is a coherent, reusable curriculum unit: one thing a learner
> would say they are "doing", with an ordered set of chapters.

**Test for a valid module scope** — it must be true for all of:

*Medicine in Britain · the Western Front historic environment · Macbeth · Cell
Biology · Number · Families · a Drama set text · a Music area of study.*

Each of those is **one nameable curriculum unit inside a specification** —
smaller than the subject, larger than a chapter, and something a scheme of work
would timetable as a block. `maths_core` ("GCSE Maths") and `bio_core` ("GCSE
Biology") fail this test (A-1): they name a subject. They split.

**Owns**

| Field | Notes |
|---|---|
| `id` | stable, kebab-case, includes board only where the module is board-specific |
| `title` / `shortTitle` | learner-facing, sentence case |
| `subjectId` | the **primary** discipline — exactly one, even for shared Science modules |
| `specRefs` | list of `{ specificationId, paperIds, requirementIds }` — how this module maps into each specification that uses it |
| `chapterRefs` | **ordered** chapter reference records (§3.7) |
| `status` | `active` \| `planned` \| `retired` |
| `presentation` | `{ heroImage, shortDescription }` — the module's own card |

**References** — subject, specifications, chapters.

**Prohibited** — tier, pathway membership, board (reached through `specRefs`),
learner progress, screen counts, component names.

**Why `specRefs` is a list.** It is what makes Combined/Triple reuse real: a
Cell Biology module maps into Combined Science 8464 Paper B1 *and* Biology 8461
Paper 1, with different requirement coverage in each, without being defined
twice. §5.3 works this through.

**Why tier is prohibited on a module.** A module is referenced by pathways;
pathways carry tier. Putting tier on the module would force Foundation and
Higher to hold two copies of every shared module — and the census shows the
Maths chapters are shared content, not tier-specific content (A-11).

**Reuse across pathways is by reference, never by duplication.** A module
definition exists once. `hist_medicine`'s fifteen chapters are not copied into a
second pathway; a second pathway holds a `moduleRef` to the same record.

### 3.5 Chapter

> A **Chapter** is one learner-facing learning journey — the unit `ChapterPlayer`
> runs and the unit progress is keyed on.

**Owns**

| Field | Notes |
|---|---|
| `id` | **preserved verbatim from `src/chapters.js`** — see §6.4 |
| `title` / `subtitle` / `era` / `icon` | learner-facing display |
| `headerImage` | the one home for a chapter's image (retires the 20 dead entries of A-10) |
| `status` | `available` \| `planned` \| `retired` — replaces derived-from-`screenCount` |
| `contentPath` | path to the content file, or `null` when `planned` |
| `conceptIds` | registered learning-graph concept ids |
| `requirementIds` | specification requirements this chapter covers |
| `estimatedMinutes` | authored, learner-facing duration |

**References** — module (through the module's `chapterRefs`, not a back-pointer),
concepts, requirements, content file.

**Prohibited**

- `screenCount` — **derived** from the content file, never authored (A: today's
  hand-authored copy is kept honest by a drift test, which is the tell);
- `screenTags` — **derived** from the content file's screen order. The current
  hand-authored positional array has *no* test against content order at all, so
  a tag can already point at the wrong screen silently;
- `series` — replaced by module membership;
- `number` — replaced by position on the chapter reference;
- `subject` — reached through the module. Today it is authored on both chapter
  and module and kept equal by a drift test;
- exam board, specification code, tier, paper — all reached upward;
- any component or screen type name.

**Chapter ordering does not belong to the chapter.** The census settles this
empirically rather than by preference:

1. `chapter.number` **already collides three times** (A-3), twice between two
   visible chapters — so it cannot be an ordering authority;
2. `resolveNextAvailableChapter` uses `module.chapterIds.indexOf(...)`, i.e.
   **position**, not `number`;
3. `buildChapterCompletePayload` computes "chapter N of module" as
   `chapterIds.indexOf(id) + 1` — position again;
4. `Subjects.jsx` renders `chapter.number ?? i + 1`, falling back to position;
5. 21 of 60 chapters carry no `series`, so a chapter cannot even state which
   sequence its `number` is a number *within*.

Ordering therefore belongs to the **relationship**, and `number` becomes a
derived display value equal to position. A chapter reused in two modules — not
in the target scope, but not forbidden by this model — would otherwise need two
numbers.

**Progress identity.** Unchanged: `gcse_chapter_<chapterId>`, with
`LEGACY_CHAPTER_ID_MAP` continuing to serve the six existing aliases.

### 3.6 Module reference

A record on a pathway, not a field hidden inside the module.

```js
{ moduleId, position, required, selectionGroup, availabilityOverride }
```

| Field | Demonstrated requirement |
|---|---|
| `moduleId` | — |
| `position` | ordering must live on the relationship (§3.5); a shared Science module sits at different positions in different pathways. |
| `required` | Edexcel History Paper 1 pairs a required thematic study with a required historic environment; Literature has required *and* optional components. |
| `selectionGroup` | `'shakespeare-text'` — how a pathway's `selections` bind to modules. Without it, swapping Macbeth for Romeo and Juliet is a code change. |
| `availabilityOverride` | a module built for Higher but not yet content-complete for Foundation must be hideable **per pathway**. Today availability is per chapter only, so this is genuinely new — and it is the one field here without a current consumer. It is **deferred** (OD-6) rather than speculatively included. |

Confirmed for v1: `moduleId`, `position`, `required`, `selectionGroup`.
Deferred: `availabilityOverride`.

### 3.7 Chapter reference

A record on a module.

```js
{ chapterId, position, required, availabilityOverride }
```

| Field | Demonstrated requirement |
|---|---|
| `chapterId` | — |
| `position` | replaces both `chapterIds` array index and `chapter.number`. |
| `required` | **deferred** (OD-6). No current surface distinguishes a required from an optional chapter; every chapter in every module is required today. |
| `availabilityOverride` | **deferred** (OD-6). `chapter.status` covers every current case. |

Confirmed for v1: `chapterId`, `position`. The other two are named here so the
shape is understood, and explicitly not built — a field without a demonstrated
requirement is a field nobody maintains.

### 3.8 Specification requirement

**Decision: yes, this is its own entity, separate from Concept.**

They answer different questions and the census shows the difference is real:

| | Concept | Specification requirement |
|---|---|---|
| Question | *What knowledge is this?* | *What does the board mandate is covered?* |
| Owner | learning graph | specification |
| Granularity | one teachable atom (`history:medicine:galen`) | one specification statement, often several atoms wide |
| Changes when | pedagogy changes | the specification is reissued |
| Example that only fits one | — | *"Students should be able to describe how to carry out a required practical"* — mandated coverage with an assessment method, not a knowledge atom |

Forcing requirements into the concept registry would mean either inventing
pseudo-concepts for assessment rules, or losing coverage reporting. Forcing
concepts into requirements would tie pedagogy to a board.

```js
{ id, specificationId, code, statement, paperIds, tier, conceptIds }
```

`conceptIds` is the join: a requirement is *satisfied by* concepts, and coverage
("which requirements does this pathway's content reach?") is computed across
that join. Requirements are authored **only for specifications whose content is
being built** — no speculative requirement sets for Drama or Music (§8).

### 3.9 Paper

Owned by the specification, referenced by modules and requirements.

```js
{ id, code, title, subjectId, durationMinutes, totalMarks, sections, tier }
```

`subjectId` is what lets Combined Science's six papers say which discipline each
assesses while all six belong to one specification. It is also what retires
`paper:medicine` (A-14), a tag that names a subject option rather than a paper.

### 3.10 Concept — unchanged, and deliberately not a navigation level

The learning graph keeps its current design and its current file layout. Two
rules are added, both of which are clarifications the census shows are needed:

1. **A concept id is a knowledge namespace, not a curriculum position.** Today
   `history:medicine:galen` implies membership of a course; after the migration
   the module record states membership and the id is just an id. This is what
   resolves A-13: the seven two-segment "course" nodes stop claiming a
   curriculum level they cannot consistently occupy.
2. **Concept is never a level in the learner-navigation tree.** Navigation is
   Subject → Pathway → Module → Chapter. Concepts are referenced *by* chapters,
   screens, questions, exam questions and mastery records — never rendered as a
   browsable tier.

Relationships:

| Concept relates to | How |
|---|---|
| Module | via the module's `specRefs[].requirementIds` → requirement `conceptIds` |
| Chapter | `chapter.conceptIds` (direct) |
| Screen | screen `tags` (unchanged) |
| Question | question `tags` (unchanged) |
| Exam question | exam-paper question `tags` (unchanged) |
| Mastery record | concept id is the mastery key (unchanged) |

---

## 4. Canonical IDs and naming

### 4.1 Rules

1. Lowercase kebab-case. Segments separated by `-`; no underscores, no camelCase.
2. **No learner-facing copy in an id.** `history-edexcel-medicine-britain`, not
   `trust-me-im-following-jupiter`.
3. **No position numbers in stable identity.** `spain-new-world-1` violates this
   and is nonetheless preserved (§6.4) — the rule binds new ids.
   Exception: a number that is genuinely part of official identity — a
   specification code (`8300`), a paper code (`8461/1`) — is kept verbatim.
4. **No implementation paths as identity.** An id never encodes a directory, a
   filename or an `episode-NN-` prefix (A-18).
5. **One id, one semantic level.** An id is never reused at two levels. This is
   the rule A-13 breaks: `history:medicine` currently means both a concept
   namespace and a course.
6. **An id means the same thing in every subject.** A `module` id means a module
   in Maths exactly as it does in History.
7. **Board appears in an id only where the entity is board-specific.** A
   specification, a pathway and a board-specific module carry it; a subject, a
   concept and a chapter do not.
8. **Chapter ids are never renamed for tidiness.** They back progress keys.

### 4.2 Per-entity patterns

| Entity | Pattern | Example |
|---|---|---|
| Board | `<board>` | `aqa`, `pearson-edexcel` |
| Subject | `<discipline>` | `mathematics`, `english-literature` |
| Specification | `<board>-<qualification>-<subject-slug>-<code>` | `aqa-gcse-combined-science-trilogy-8464` |
| Paper | `<specification-id>-paper-<n>[-<subject>]` | `aqa-gcse-combined-science-trilogy-8464-paper-1-biology` |
| Study pathway | `<board>-<subject-slug>-<code>-<distinguisher>` | `aqa-maths-8300-higher` |
| Module | `<subject-slug>-<board>-<unit-slug>` | `history-edexcel-medicine-britain` |
| Chapter | **existing ids preserved**; new ids `<module-slug>-<topic-slug>` | `history-medicine-black-death` |
| Concept | unchanged: `subject:course[:concept]` | `history:medicine:galen` |
| Spec requirement | `<specification-id>-<official-code>` | `aqa-gcse-biology-8461-4-1-1-1` |
| Selection group | `<slug>` scoped to its specification | `shakespeare-text` |

### 4.3 Two id conventions coexist, on purpose

Curriculum records use kebab-case; concept ids stay colon-separated
(`history:medicine:galen`). They are not unified. The colon form is load-bearing
in the tag grammar (`TAG_PATTERN`, `isFacetTag`, namespace claiming), is
persisted as mastery keys, and appears throughout the question banks. Unifying
the punctuation would be a rename of every concept id and every mastery key to
buy consistency nobody consumes. The rule that matters — one id, one level — is
enforced regardless of punctuation.

---

## 5. Ownership: one authoritative home per fact

Every fact is **authored** in exactly one place or **derived** from one.

### 5.1 Authored facts

| Fact | Canonical owner |
|---|---|
| Academic subject identity | subject record |
| Theme key | `src/constants/subjects.js` (unchanged) — subject record *references* it |
| Subject → theme mapping | subject record |
| Exam board | board record |
| Specification metadata (code, title, qualification, dates) | specification record |
| Subject coverage of a specification | specification record `subjectIds` |
| Assessment objectives | specification record |
| Paper structure | specification record `papers` |
| Specification requirements | specification record `requirements` |
| Selection groups (what must be chosen) | specification record |
| Tier | study pathway record |
| Pathway selections (what *was* chosen) | study pathway record |
| Module order inside a pathway | module reference `position` |
| Module identity, title, scope | module record |
| Module → specification/paper mapping | module record `specRefs` |
| Module hero image and description | module record `presentation` |
| Chapter identity | chapter record `id` |
| Chapter order inside a module | chapter reference `position` |
| Chapter display metadata | chapter record |
| Chapter header image | chapter record `headerImage` |
| Chapter status | chapter record `status` |
| Chapter content source | chapter record `contentPath` |
| Chapter estimated duration | chapter record |
| Concept identity | learning graph (unchanged) |
| Chapter → concept references | chapter record `conceptIds` |
| Chapter progress key | `src/data/chapterProgress.js` (unchanged) |
| Mastery identity | mastery engine, keyed on concept id (unchanged) |
| Component authoring types | component catalogue (unchanged — **not curriculum**) |

### 5.2 Derived facts, and how each is generated

| Derived fact | Generated from | Emitted as |
|---|---|---|
| Runtime module projection | module records + pathway module refs | `src/data/generated/curriculum/modules.js` |
| Runtime chapter projection | chapter records + module chapter refs | `src/data/generated/curriculum/chapters.js` |
| Chapter loader registry | chapter records with `contentPath` | `src/data/generated/curriculum/chapterContentLoaders.js` |
| Learner navigation (subjects, pathways, modules, tabs) | subject + pathway + module records | `src/data/generated/curriculum/navigation.js` |
| Coming-soon presentation | `status: 'planned'` on modules and chapters | inside the navigation projection — **retires all 12 `cs_*` cards** |
| Browser series tabs | module records of a pathway | navigation projection — retires `HISTORY_SERIES` / `ENGLISH_SERIES` |
| Subject display title and description | subject record | navigation projection — retires `SUBJECT_DISPLAY_TITLES` / `SUBJECT_DESCRIPTIONS` |
| Chapter `number` | chapter reference `position + 1` | chapter projection — retires the three collisions of A-3 |
| Chapter `subject` | module → subject | chapter projection — retires the duplicate-and-compare pair |
| Chapter `series` | module id | chapter projection, compatibility only, removed at the end of the migration |
| `screenCount` | content file `screens.length` | chapter projection — **retires the drift test** |
| `screenTags` | content file screen order | chapter projection — and for the first time the *positions* are correct by construction |
| Chapter counts per module/pathway | chapter refs filtered by status | navigation projection |
| Specification coverage report | requirements × chapters × concepts | `docs/curriculum/SPECIFICATION_COVERAGE.md` |
| Human curriculum map | all records | `docs/curriculum/CURRICULUM_MAP.md` |
| `examboard:` / `course:` / `paper:` / `tier:` tags | specification + module + pathway | resolved at read time; authored tags are retired |

**No second authored copy is kept merely so a test can compare it.** Every
current drift test named in `CENSUS.md` §2 is deleted rather than ported,
because after the migration there is nothing left to compare.

### 5.3 Facts that deliberately do not move

| Fact | Stays where it is | Why |
|---|---|---|
| Subject palettes | `src/constants/subjects.js` | Presentation. 85 `src` files import it; it is not curriculum. |
| Concept registry | `src/data/learningGraph/**` | Already single-owner and enforced. |
| Mastery state | `src/data/masteryEngine/**` | Keyed on concepts, not curriculum position. |
| Chapter progress keys | `src/data/chapterProgress.js` | Renaming would cost learner progress. |
| Screen/block authoring types | component catalogue | Component domain. |
| Chapter lifecycle | `ChapterPlayer` | Runtime boundary. |
| Screen routing | `ScreenRenderer` | Runtime boundary. |
| Question banks | `src/data/questionBanks/**` | Their *tags* resolve against the new records; the banks do not move. |

---

## 6. Catalogue boundaries

### 6.1 Location and shape

```
src/curriculum-catalogue/
  schema.js                     validation for every record type
  index.js                      the assembled catalogue + integrity checks
  records/
    boards.js                   2 records — one grouped module
    subjects.js                 10 records — one grouped module
    specifications/
      aqa-gcse-mathematics-8300.js
      aqa-gcse-combined-science-trilogy-8464.js
      ...                       one file per specification
    pathways/
      aqa-maths-8300-foundation.js
      ...                       one file per pathway
    modules/
      history-edexcel-medicine-britain.js
      ...                       one file per module
    chapters/
      history/medicine.js       chapters grouped by module
      ...
```

**File granularity follows record size and edit locality, not uniformity:**

- **Boards and subjects: one grouped file each.** Twelve small records that are
  read together and change almost never. Twelve files would be ceremony.
- **Specifications and pathways: one file each.** Each is large (papers,
  assessment objectives, requirements) and changes for its own reasons. This
  matches `src/component-catalogue/records/<id>.js`, which the repo already
  proves works at 84 records.
- **Modules: one file each.** ~20 records in the target scope, each edited
  independently when its chapters change.
- **Chapters: grouped by module.** ~60 today and growing fastest; adding a
  chapter is almost always adding it to a module that already exists, so a
  per-module file keeps that a one-file edit and keeps `position` values
  visible next to each other. This is the one place the component catalogue's
  one-file-per-record rule is deliberately not copied, and the reason is
  edit locality.

### 6.2 Record purity

Records must be plain serialisable data:

- no React, no JSX;
- no browser APIs (`window`, `document`, `localStorage`);
- no storage access, no network;
- no imports outside `src/curriculum-catalogue/**` except the learning graph's
  pure concept ids;
- no functions, no getters, no `Symbol`, no `Date` objects;
- deterministic — same file, same bytes, always.

Enforced the way the component catalogue's purity already is: a filesystem-derived
architecture test, not an allowlist.

### 6.3 What may reach the learner runtime

**The catalogue itself: never.** `src/curriculum-catalogue/**` is build-time
governance data. Production source must not import it, proved by sweeping all of
`src/**` — the same rule and the same proof shape as ADR-0001 Decision 1.

**Generated projections: yes, and only these:**

| Output | Contents |
|---|---|
| `src/data/generated/curriculum/navigation.js` | subjects, pathways, modules, tabs, coming-soon state |
| `src/data/generated/curriculum/modules.js` | replaces `MODULES` |
| `src/data/generated/curriculum/chapters.js` | replaces `CHAPTERS` |
| `src/data/generated/curriculum/chapterContentLoaders.js` | replaces `CHAPTER_CONTENT_LOADERS` |
| `docs/curriculum/CURRICULUM_MAP.md` | human curriculum documentation |
| `docs/curriculum/SPECIFICATION_COVERAGE.md` | requirement coverage report |

Each projection carries **only the fields its consumers read** — the same
discipline `componentAuthoringRegistry.js` already applies. Specification
requirements, assessment objectives and versioning dates are governance data and
never ship.

Names follow repository convention: generated runtime code under
`src/data/generated/`, generated documentation under `docs/`, both with the
existing `GENERATED FILE — DO NOT EDIT` banner, and both checked by a
`curriculum:check` step added to `pnpm verify`.

### 6.4 ID preservation and the alias policy

**Every one of the 60 existing chapter ids is preserved verbatim.** Including
`spain-new-world-1` (position number in identity), `soc1`, `math1`,
`bio_building_blocks` and `sci_bio_w1` (underscores). They all violate §4.1, and
they are all kept, because each one is a live progress key
(`gcse_chapter_<id>`). A clean-looking id is not worth losing learner progress.

The naming rules in §4.1 therefore bind **new** ids and **non-chapter** entities.

Where a rename is genuinely wanted later, the repository already has the
mechanism and the precedent: `LEGACY_CHAPTER_ID_MAP` in
`src/data/chapterProgress.js` maps six retired ids (`mod2`…`mod9`) to their
canonical successors, and `chapterProgressSourceKeys` folds every old copy
forward monotonically. A rename is:

1. add the old id → new id entry to `LEGACY_CHAPTER_ID_MAP`;
2. change the chapter record id;
3. regenerate.

**Subject ids are the harder case** and are treated as a first-class migration,
not a rename. Persisted `gcse_scores` rows and weakness-tracker entries carry
display strings (`'History'`, `'English'`, and the non-subject `'Quick Fire'`) —
A-19. Canonical ids differ, and `english-*` is a one-to-two split that no
mechanical mapping can resolve for existing rows. Policy:

- the subject record carries `legacyProgressNames: ['English']` so historical
  rows remain readable;
- historical `'English'` rows are attributed to **neither** new subject; they
  are reported as legacy and excluded from per-subject averages rather than
  guessed at;
- no persisted row is rewritten.

OD-1 is settled in `DECISIONS.md`: historical `'English'` rows are kept
exactly as stored, stay visible in historical activity, count towards neither
new subject, and must be surfaced as an explicit legacy bucket rather than
silently dropped. OD-2 and OD-3 remain open.

---

## 7. Compatibility, in one line

`MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS` keep their exact current
export names and shapes throughout the migration; they simply stop being
hand-authored and start being generated. Every consumer traced in `CENSUS.md`
§2 — `progress.js`, `chapterNavigation.js`, `dailyPlanner.js`,
`subjectCatalogue.js`, `Subjects.jsx`, `LegacyApp.jsx`, `todaysPlan.js` and
their tests — is unchanged on the day the records land. `IMPLEMENTATION-PLAN.md`
sequences it.

---

## 8. Scope discipline

No speculative content is invented for subjects that have none. Drama, Music,
Chemistry, Physics, English Language, Triple Science and the three unbuilt
History options get **entity relationships only** — enough records to prove the
architecture holds, with `status: 'planned'`, empty `chapterRefs`, and no
fabricated requirements, papers-content or concepts. `MODELS.md` observes this
line explicitly and says where it stops in each case.
