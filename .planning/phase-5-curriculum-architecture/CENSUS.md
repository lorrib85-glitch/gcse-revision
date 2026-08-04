# Phase 5A — curriculum census

Baseline SHA: `9dc4e875a146fbe4ea44992fb31bc5a81023e765`
Branch: `main` · working tree clean at the start of the phase.

Method: every number below was **measured by loading the live modules**, not
grepped and not taken from documentation or previous commit messages. The
machine-readable output is `baselines/current-curriculum-baseline.json` and
`census/migration-census.json`; both regenerate deterministically:

```bash
node .planning/phase-5-curriculum-architecture/scripts/generate-curriculum-baseline.mjs
node .planning/phase-5-curriculum-architecture/scripts/generate-migration-census.mjs
```

Both accept `--check`, which regenerates in memory and compares byte-for-byte
without writing. Neither script reads a clock, an environment variable or an
absolute path, so the same tree always produces the same bytes.

> **A note on the starting state.** The session began on a shallow clone whose
> grafted history made local `main` *look* 53 ahead / 50 behind `origin/main`
> with no merge base. After `git fetch --unshallow`, the truth is **0 ahead, 74
> behind**. The phase was re-baselined onto the real `origin/main` head before
> any measurement was taken. Every figure here is from `9dc4e87`, not from the
> stale shallow tip.

---

## 1. Baseline

### 1.1 Headline counts

| Fact | Value |
|---|---:|
| Total chapters (`CHAPTERS`) | **60** |
| — available | 30 |
| — coming soon | 29 |
| — hidden | 1 |
| Non-hidden chapters | **59** |
| Total modules (`MODULES`) | **7** |
| Chapter content loaders (`CHAPTER_CONTENT_LOADERS`) | **60** |
| — loaders resolving to zero screens | 29 |
| Subjects with a theme entry (`SUBJECTS`) | **9** |
| Subjects appearing in chapter metadata | 5 |
| Subjects appearing in the module catalogue | 5 |
| Subjects in the learner browser (`SUBJECT_NAMES`) | 7 |
| Learning-graph concepts | **87** |
| — two-segment "course" nodes | 7 |
| — knowledge atoms (3+ segments) | 80 |
| Active authoring entries | **57** (26 screen + 31 block) |
| Total authoring entries | 62 (+1 derived screen, +4 legacy blocks) |
| Synthetic browser placeholder cards | **12** |
| Subject-browser series tabs | 6 (4 History, 2 English) |
| Distinct chapter `series` values | 4 |
| `TAG_CHAPTER_MAP` entries | 55 |
| Curriculum-bearing facet tags in use | 4 |
| Census entities classified | **171** |

Every chapter has a loader and every loader has a chapter — `idsWithoutChapterMetadata`
and `chaptersWithoutLoader` are both empty. All 60 content files import cleanly
in plain Node, which is what made a structural census possible instead of a
regex one.

### 1.2 Verification status at the baseline SHA

`pnpm verify` runs nine steps. Measured result, with dependencies installed
into a container that started with no `node_modules`:

| Step | Result |
|---|---|
| `catalogue:check` | ✅ `COMPONENT_REGISTRY.md` matches the catalogue |
| `authoring:check` | ✅ `componentAuthoringRegistry.js` matches |
| `pedagogy:check` | ✅ `componentPedagogyRegistry.js` matches |
| `lab:check` | ✅ `componentLabRegistry.js` matches |
| `test:architecture` | ✅ 56 files, **1831 tests passed** |
| `lint` | ✅ 0 errors (90 warnings) |
| `test:unit` | ✅ 68 files, **1243 tests passed** |
| `test:storybook` | ⚠️ **could not run in this container** — Vitest failed to connect to the Chromium browser session (`Failed to connect to the browser session … within the timeout`). 34 test files were collected and none executed. This is an environment limitation of the remote sandbox, not a repository failure; it is reported honestly rather than claimed green. |
| `build` | ✅ built in 12.43 s (run separately, after the storybook step aborted the chain) |

Generated artefacts `pnpm verify` currently checks:

- `docs/components/COMPONENT_REGISTRY.md`
- `src/data/generated/componentAuthoringRegistry.js`
- `src/data/generated/componentPedagogyRegistry.js`
- `src/data/generated/componentLabRegistry.js`

**All four are component-domain.** No curriculum fact is generated or checked
today — which is precisely the gap this phase exists to close.

### 1.3 Learner-facing subject-browser groups

| Subject | Cards shown | Real chapters | Synthetic cards |
|---|---:|---:|---|
| History | 37 | 37 | — |
| Biology | 8 | 8 | — |
| Maths | 8 | 8 | — |
| English | 7 | 1 | 6 (`cs_macbeth_2–4`, `cs_inspector_1–3`) |
| Sociology | 5 | 5 | — |
| Physics | 5 | 0 | 5 (`cs_forces`, `cs_energy`, `cs_waves`, `cs_space`, `cs_matter`) |
| Chemistry | 1 | 0 | 1 (`cs_chemistry`, synthesised, not authored) |

`Drama` and `Music` have theme entries but appear nowhere in the browser.
`Chemistry` and `Physics` are browsable with no module and no chapter.

---

## 2. Authority and duplication matrix

For every curriculum fact: who authors it, who else holds a copy, who reads it,
what kind of fact it is, and — the question that actually matters — **whether
the existing test removes the duplication or merely detects drift in it.**

A drift detector is what you build once you have accepted that a fact will be
written down twice. It keeps the copies equal; it does not make there be one.

### 2.1 Subject-level facts

| Fact | Authored owner | Copies / parallel versions | Runtime consumers | Build-time consumers | Doc consumers | Kind | Test posture |
|---|---|---|---|---|---|---|---|
| Subject theme (palette, glow, browser accent pair) | `src/constants/subjects.js` | none | 85 `src` files import `SUBJECTS` | — | `SUBJECT_THEME_SYSTEM.md` | presentation | `app-boundaries.test.js` guards required fields. **No duplication to remove.** |
| Subject academic identity | **nowhere** — inferred from the theme key string | `chapter.subject`, `module.subject`, `SUBJECT_NAMES` in `Subjects.jsx`, `subject:*` tags, concept namespaces | `subjectCatalogue.js`, `chapterNavigation.js`, `progress.js` | `content-hierarchy.test.js` | `CONTENT_HIERARCHY.md` | **curriculum identity** | `content-hierarchy.test.js` checks module/chapter subject strings match. **Drift detection only** — the string is the identity. |
| Which subjects the browser shows | `SUBJECT_NAMES` literal in `Subjects.jsx` | — | `SubjectsTab` | — | — | presentation | **Untested.** A subject can be added to `SUBJECTS` and never appear, or listed and have nothing behind it (Chemistry, Physics today). |
| Subject display title | `SUBJECT_DISPLAY_TITLES` in `Subjects.jsx` | conceptually duplicates module titles | `SubjectBrowser` | — | — | presentation | **Untested.** `History: 'Medicine through time'` is a module title used as a subject title. |
| Subject description | `SUBJECT_DESCRIPTIONS` in `Subjects.jsx` | — | `SubjectBrowser` | — | — | presentation | Untested. |
| Subject hero image | `SUBJECT_HEADER_IMGS` + `SUBJECT_TOPIC_IMAGES` in `Subjects.jsx` | — | `SubjectBrowser`, `SubjectsTab` | — | `VISUAL_ASSET_SYSTEM.md` | presentation | Untested. |
| Exam board | `examboard:*` tag on chapters, questions and papers; `board` field on exam papers | 3 parallel homes | Exam Mode, question routing | `learning-graph.test.js` | `LEARNING_GRAPH.md` | **curriculum identity** | Validates the tag's *spelling*, not that a chapter's board agrees with its module's. **Drift detection only.** |
| Specification code | `ref: '8192/1'` inside exam-paper records only | — | ExamPaper tool | — | — | **curriculum identity** | **No test, no curriculum home.** Six AQA Sociology papers carry a real specification code that no curriculum record can see. |

### 2.2 Module-level facts

| Fact | Authored owner | Copies / parallel versions | Runtime consumers | Build-time consumers | Doc consumers | Kind | Test posture |
|---|---|---|---|---|---|---|---|
| Module identity + title | `src/data/modules.js` | `HISTORY_SERIES` / `ENGLISH_SERIES` titles in `Subjects.jsx`; `chapter.series` values | `chapterNavigation.js` (completion hand-off), `subjectCatalogue.js`, `dailyPlanner.js`, `progress.js` | `content-hierarchy.test.js`, `module-availability.test.js` | `CONTENT_HIERARCHY.md` | **curriculum identity** | Nothing connects a `series` value or a series tab to a module id. **No test at all** across that boundary. |
| Chapter membership of a module | `module.chapterIds` | `chapter.series` (implicitly), series tab filter | `subjectCatalogue.js`, `resolveNextAvailableChapter` | `content-hierarchy.test.js` (both directions) | `CONTENT_HIERARCHY.md` | **curriculum identity** | Genuinely single-owner. The one relationship in the system that is properly modelled. |
| Chapter order in a module | `module.chapterIds` array position | `chapter.number` (parallel, and colliding) | `resolveNextAvailableChapter` uses `indexOf`; `Subjects.jsx` renders `chapter.number` | — | `CONTENT_HIERARCHY.md` | derived vs presentation | **No test compares them.** Position and `number` disagree today in three places (§3, A-3). |
| Module subject | `module.subject` | `chapter.subject` on every member | `subjectCatalogue.js` filter | `content-hierarchy.test.js` | — | **curriculum identity** | Test asserts they are equal. **Drift detection only** — the fact is authored twice. |
| Browser series tab (title, hero, coming-soon) | `HISTORY_SERIES` / `ENGLISH_SERIES` in `Subjects.jsx` | module titles and hero images | `SubjectBrowser` | — | `CONTENT_HIERARCHY.md` explicitly blesses the split | presentation | **Untested.** `elizabethan` is a tab with no module, no chapters and no `series` value anywhere. |

### 2.3 Chapter-level facts

| Fact | Authored owner | Copies / parallel versions | Runtime consumers | Build-time consumers | Doc consumers | Kind | Test posture |
|---|---|---|---|---|---|---|---|
| Chapter identity (`id`) | `src/chapters.js` | loader key, progress key `gcse_chapter_<id>`, `TAG_CHAPTER_MAP` targets, `LEGACY_CHAPTER_ID_MAP` | everything | many | `CONTENT_HIERARCHY.md` | **curriculum + progress identity** | `module-metadata-integrity.test.js` checks loader presence both ways. Genuinely enforced. |
| Chapter display metadata (title, subtitle, era, icon, colour) | `src/chapters.js` | — | `Subjects.jsx`, `Progress.jsx`, `ChapterCompleteScreen` | — | — | presentation | Untested; single owner. |
| Chapter header image | `chapter.headerImage` | `CHAPTER_HEADER_IMAGES` in `Subjects.jsx` — **20 entries, all dead** | `thumbFor()` (chapter wins), `SubjectsTab` continue-card | — | — | presentation | **Untested.** Every one of the 20 map entries is shadowed by a `chapter.headerImage` that takes precedence. Measured: 20 of 20 dead, 0 of 60 chapters lack their own image. |
| Chapter availability | derived from `screenCount`, overridable by `chapter.availability` | — | `subjectCatalogue.js`, planner, recovery, completion hand-off | `module-availability.test.js` | `CONTENT_HIERARCHY.md` | derived + override | Well governed. Single owner with an explicit escape hatch. |
| `screenCount` | `src/chapters.js` (hand-authored) | the chapter's own `screens.length` | `getChapterPct`, browser percentage | `extracted-chapter-contract.test.js` Rule 1 | — | **derived data, authored** | Test asserts `screenCount === screens.length`. **Pure drift detection.** The fact is derivable and is written down anyway. |
| `screenTags` | `src/chapters.js` (hand-authored, positional) | screen order in the content file | `findTaggedChapterScreen` → weak-spot "fix this gap" | `module-metadata-integrity.test.js` (length only) | — | **derived data, authored** | Length is checked against `screenCount`; **the positions are not checked against the content at all.** A tag can point at the wrong screen and every test still passes. |
| Chapter concept tags | `chapter.tags` | question tags, topic tags, `TAG_CHAPTER_MAP` | recovery routing | `learning-graph.test.js` | `LEARNING_GRAPH.md` | **content identity** | Spelling validated against the registry. Real enforcement, for `history:*` only. |
| Chapter `series` | `src/chapters.js` | module membership; browser tab ids | series tab filter | — | `CONTENT_HIERARCHY.md` | presentation-with-identity-creep | Untested. 21 of 60 chapters have no `series` at all. |
| Chapter `number` | `src/chapters.js` | array position in `module.chapterIds` | browser card numbering | — | `CONTENT_HIERARCHY.md` | presentation | **Untested; collides three times.** |
| Chapter content source | `CHAPTER_CONTENT_LOADERS` | the file path itself | `LegacyApp.jsx` lazy open | `module-metadata-integrity.test.js`, `content-loading-boundary.test.js` | `CONTENT_HIERARCHY.md` | **derived data, authored** | Both directions enforced. Still hand-maintained — a generated registry would remove the file entirely. |
| Chapter progress key | `src/data/chapterProgress.js` | `LEGACY_CHAPTER_ID_MAP` (6 aliases) | `progress.js`, sync | `storage-boundary.test.js` | `PROGRESS_SYNC_ARCHITECTURE.md` | **progress identity** | Properly modelled, with a working alias precedent. |

### 2.4 Concept, mastery and question facts

| Fact | Authored owner | Copies / parallel versions | Runtime consumers | Build-time consumers | Kind | Test posture |
|---|---|---|---|---|---|---|
| Concept identity | `src/data/learningGraph/concepts/**` | — | mastery engine, recovery | `learning-graph.test.js` | **content identity** | Single owner, enforced. The healthiest part of the system. |
| Concept → curriculum membership | implied by the id prefix (`history:medicine:*`) | `course:medicine` facet tag, `chapter.tags`, `MEDICINE_TOPICS` | recovery routing | `learning-graph.test.js` | **conflated** | The prefix is doing double duty as namespace *and* curriculum position. No test separates them because nothing distinguishes them. |
| Weakness tag → chapter route | `src/data/tagChapterMap.js` | `chapter.screenTags` | recovery, `Subjects.jsx` biggest-win | `recovery-routing-integrity.test.js` | compatibility | 55 entries. **21 of them are `maths:*` tags in a namespace the concept registry claims, and 0 of the 21 are registered concepts** — they are outside the validated vocabulary entirely (A-8). |
| Mastery identity | registered concept ids | — | `masteryRecorder.js` (write-only, Phase 3A) | `mastery-engine.test.js` allowlist | **progress identity** | Single owner, allowlisted consumers. Correct by construction. |
| Paper structure | exam-paper records (`ref`, `board`, `sectionScope`, `totalMarks`, `timeMins`) | `paper:*` facet tag | ExamPaper tool, Exam Mode | `learning-graph.test.js` (tag spelling) | **curriculum identity** | The tag and the record know nothing about each other. `paper:medicine` names a subject option, not a paper. |

### 2.5 What the matrix shows

Counting the rows above:

- **3 facts have a single authored owner and a test that enforces it**: chapter
  membership of a module, concept identity, mastery identity.
- **6 facts are authored twice with a test that keeps the copies equal**:
  module subject vs chapter subject, `screenCount` vs `screens.length`,
  `screenTags.length` vs `screenCount`, loader key vs chapter id, exam-board tag
  vs exam-paper `board`, concept prefix vs `course:` tag.
- **11 facts are authored more than once with no test across the boundary at
  all**: subject browsability, subject display title, subject description,
  subject hero image, chapter header image, chapter `number` vs module position,
  `series` vs module membership, series tab vs module, `screenTags` *positions*,
  specification code, paper structure vs paper tag.

The pattern is consistent and it is not a code-quality problem. Every one of
these facts is a **curriculum** fact, and the curriculum has no catalogue — so
each fact settles wherever the consumer that first needed it happened to live.
The component domain solved exactly this and now has one authored source, a
validator and four generated projections. The curriculum domain has none.

---

## 3. Anomalies

Recorded, not normalised. Each has a stable id used by the census, `DESIGN.md`
and `IMPLEMENTATION-PLAN.md`.

**A-1 — Module scope means four different things.**
`hist_medicine` = one specification option. `hist_spain_new_world` and
`hist_usa` = one option each. `eng_macbeth` = one set text. `soc_family` = a
mixture (below). `maths_core` = titled "GCSE Maths", contains eight AQA *Number*
chapters. `bio_core` = titled "GCSE Biology", contains chapters from six
different AQA topics. A definition satisfying both `maths_core` and
`hist_medicine` would have to mean "any group of chapters", which is not a
definition.

**A-2 — Content directories already carry a finer module grain than `MODULES`.**
`bio_core`'s eight chapters load from six directories: `cell-biology`,
`organisation`, `infection-and-response`, `homeostasis`,
`inheritance-variation-evolution`, `ecology`. Chemistry has four content
directories (`atomic-structure`, `chemical-changes`,
`chemistry-of-the-atmosphere`, `rates-and-organic`) and **zero** chapters,
loaders or modules. The filesystem is a more accurate module catalogue than the
module catalogue.

**A-3 — Chapter numbers collide.** Three collisions, measured:

| Key | Chapters |
|---|---|
| `History / medicine / 3` | `history-medicine-renaissance-medicine` (hidden), `history-medicine-vesalius-beginning-doubt` |
| `History / medicine / 4` | `history-medicine-harvey-pare-renaissance-method`, `history-medicine-surgery-anaesthetics` |
| `Biology / (no series) / 2` | `bio_building_life`, `sci_bio_w1` |

Only the first is explained by the hidden entry. The other two are two visible
chapters claiming the same position while `module.chapterIds` order says
otherwise — and the browser renders `chapter.number`, so a learner sees two
chapter 4s.

**A-4 — 21 of 60 chapters have no `series` value.** All Maths, Sociology and
Biology chapters. The browser's `hasSeries` branch only exists for History and
English, so the field is load-bearing for two subjects and absent for three.

**A-5 — A series tab with no curriculum behind it.** `elizabethan` is in
`HISTORY_SERIES`, marked `comingSoon`, and no chapter anywhere carries
`series: 'elizabethan'`. Selecting it renders an empty list under a hero image.
It is a curriculum intention that exists only as UI. (`Early Elizabethan
England` is one of the five options the target route needs.)

**A-6 — A chapter whose loader directory disagrees with its subject matter.**
`bio_building_life` — "Building Life · Cells, Microscopes & Division" — loads
from `src/content/biology/organisation/`. Its content is Cell Biology.

**A-7 — A module whose title misdescribes its own membership.**
`soc_family` = "Sociology of the Family" contains `soc1` (What even is
sociology?), `soc2` (Marxism vs Functionalism) and `soc3` (Feminism, power and
life chances) alongside `soc4` and `soc6` (Families). Three of five chapters are
key concepts and approaches that run across both AQA papers. All five load from
`src/content/sociology/families/`. `soc5` does not exist — the numbering has a
hole.

**A-8 — 21 weakness-routing tags sit outside the validated vocabulary.**
`TAG_CHAPTER_MAP` has 55 entries. 21 are namespaced `maths:*`
(`maths:place-value`, `maths:bidmas`, `maths:hcf-lcm`, …). `maths` **is** a
namespace the concept registry claims, so a chapter or question carrying those
tags would fail `learning-graph.test.js` — but `TAG_CHAPTER_MAP` is not one of
the sources that test sweeps. Measured: 0 of 21 are registered concepts. The
remaining 34 keys are bare single-segment strings (`galen`, `miasma`) which the
tag grammar does not admit at all.

**A-9 — Presentation metadata pointing at the wrong subject.** In
`ENGLISH_SERIES`, the Macbeth tab's `headerImage` is
`/images/history/_shared/medicine-through-time.webp` and the An Inspector Calls
tab's is `/images/sociology/_shared/family.webp`.

**A-10 — `CHAPTER_HEADER_IMAGES` is 20 entries of dead duplication.** Measured:
all 60 chapters carry their own `headerImage`, `thumbFor()` prefers it, and
therefore **20 of 20 map entries are unreachable**. It is a second home for a
fact whose first home always wins.

**A-11 — "foundations" is not the Foundation tier.** All eight Maths chapters
load from `src/content/maths/foundations/`. The content is Foundation-*and*-Higher
Number material; the directory means "foundational". Once
`AQA Mathematics Foundation` and `Higher` are real pathways, this name will read
as a tier claim it does not make.

**A-12 — 29 loader entries exist for content that does not exist.** Every one
resolves to `{ screens: [] }`. They are required today by
`module-metadata-integrity.test.js`, which insists every stub has a registry
entry — a rule that exists only because the registry is hand-maintained.

**A-13 — Learning-graph "course" nodes sit at four different levels.** Measured
across the seven two-segment ids:

| Node | Actual level | Atoms under it |
|---|---|---:|
| `history:medicine` | specification option | 80 |
| `biology:building-blocks`, `biology:organisation`, `biology:infection-response`, `biology:bioenergetics` | AQA topic (module-sized) | 0 |
| `maths:number` | content domain | 0 |
| `english:language-paper-1` | **an exam paper** | 0 |

80 of the registry's 87 concepts hang off one node; six nodes are placeholders
that exist to make live question-bank tags legal.

**A-14 — Specification identity exists, but only inside exam papers.** Six AQA
Sociology papers carry `ref: '8192/1'`, `board: 'AQA'`, `totalMarks`, `timeMins`
and `sectionScope`. That is genuine specification structure, and no curriculum
record can reference it. Meanwhile the only `tier:` value in use is `tier:gcse`
— a qualification level in a namespace reserved for Foundation/Higher.

**A-15 — Twelve learner-facing cards with no canonical curriculum object.**
`cs_macbeth_2–4` and `cs_inspector_1–3` carry real authored titles and
subtitles. `cs_forces`, `cs_energy`, `cs_waves`, `cs_space`, `cs_matter` carry
AQA Physics topic numbers in their subtitles — they are module-sized promises
rendered as chapter cards. `cs_chemistry` is not authored anywhere; it is
synthesised by `getSubjectChapterList`'s default branch.

**A-16 — Two theme keys with no curriculum at all.** `Drama` and `Music` have
full palettes, no chapters, no modules, and are not in `SUBJECT_NAMES`. They are
branding held in advance — and both are target qualifications for this phase.

**A-17 — A documentation statement that the code does not support.**
`docs/system/CONTENT_HIERARCHY.md` line 7 states "**Subject** owns brand,
specification and overall progress." No subject record owns any specification
fact anywhere in the repository; `SUBJECTS` is a palette map. This is recorded
rather than edited: `CONTENT_HIERARCHY.md` is active governance, and rewriting
governance is not a planning-phase change. `ADR-0002` supersedes the line at
implementation time.

**A-18 — Chapter ids that no longer match their content filenames.**
`history-medicine-modern-medicine` → `episode-12-when-medicine-became-magic.js`;
`history-medicine-cancer` → `episode-13-can-we-beat-cancer.js`;
`history-medicine-vesalius-beginning-doubt` →
`episode-03-vesalius-beginning-doubt.js` alongside a hidden
`episode-03-renaissance-medicine.js`. The ids are correct and must not be
touched — they back progress keys — but the `episode-NN-` filename prefix is a
second, drifting statement of chapter order.

**A-19 — Subject display strings are persisted progress identity.**
`recordScore({ subject })` writes the subject string into `gcse_scores`, and
`logWrongAnswer` / `logCorrectAnswer` write it into the weakness tracker's
stored entries. `getWeakestSubject` and `getImprovements` group on it. So a
subject rename is a data migration, exactly like a chapter rename — a constraint
no current documentation states. Worse, `QuickFireMode.jsx` writes
`subject: 'Quick Fire'`, so the persisted subject vocabulary already contains a
value that is not a subject at all.

**A-20 — A quarter of weakness routes silently land on screen 0.** Measured over
the 54 non-null `TAG_CHAPTER_MAP` entries: **41** name a chapter whose
`screenTags` actually contain that tag; **13 do not**, so
`findTaggedChapterScreen` returns `undefined` and the learner is dropped at the
start of the chapter instead of at the screen that fixes their gap. Examples:
`black-death` → `history-medicine-medieval-beliefs-causes`, `surgery` →
`history-medicine-surgery-anaesthetics`, `nightingale` →
`history-medicine-great-stink`. Nothing detects this, because `screenTags`
positions are checked for *length* only (§2.3). It is the concrete cost of
`screenTags` being authored rather than derived.

---

## 4. What this census does not do

- It does not reopen Component Platform v1. The component catalogue, the
  generated authoring/pedagogy/lab registries, `ChapterPlayer` and
  `ScreenRenderer` are treated as settled and were read, not assessed.
- It does not correct any anomaly. A-10 (20 dead map entries) and A-9 (wrong
  hero images) are one-line fixes and are still left alone: a planning commit
  that quietly fixes things is a migration hiding inside a planning commit.
- It does not touch `CONTENT_HIERARCHY.md`, `LEARNING_GRAPH.md` or
  `MASTERY_ENGINE.md`, including the false statement recorded as A-17.
