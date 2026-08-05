# The runtime compatibility projection

**Status: Stage 3 of the curriculum migration. Temporary by construction.**

The canonical catalogue describes **8 subjects, 14 pathways, 36 modules and
65 chapters**. The pre-cutover runtime interface exposes **7 `MODULES`,
60 `CHAPTERS` and 60 `CHAPTER_CONTENT_LOADERS`**. Stage 3 promises *exact*
runtime parity, so the difference between those two numbers has to be written
down somewhere that is visibly **not** the curriculum.

That somewhere is `src/curriculum-catalogue/compatibility/runtime-v1.js`.

Authority: `docs/decisions/0002-canonical-curriculum-architecture.md`. Migration
sequence: `.planning/phase-5-curriculum-architecture/IMPLEMENTATION-PLAN.md`.

---

## 1. What the compatibility layer is

| | Canonical records | Compatibility projection |
|---|---|---|
| Lives in | `src/curriculum-catalogue/records/` | `src/curriculum-catalogue/compatibility/` |
| Is | curriculum | scaffolding for the pre-cutover interface |
| Counted as | one of six entity types | **nothing** — see `CURRICULUM_ENTITY_TYPES` |
| Outlives the migration | yes | no — every field names the stage that deletes it |
| Answers | "what does this qualification contain?" | "what did the old interface print?" |

Six rules govern it, and each is enforced by
`tests/architecture/curriculum-compatibility.test.js`:

1. **It is not a curriculum entity.** `RECORD_TYPES` and
   `CURRICULUM_ENTITY_TYPES` in `schema.js` list six, and nothing under
   `compatibility/` appears in either.
2. **Production source must never import it.** The whole of `src/**` is swept,
   the compatibility directory excepted.
3. **It is plain serialisable data,** validated like a record.
4. **It must never duplicate a derivable fact.** A declared value that a
   canonical record or a content file already states is a validation failure,
   not a convenience.
5. **Every field names the stage that deletes it** — `DELETION_STAGES` in
   `compatibility/index.js`. A field with no death date fails validation.
6. **Nothing here may reach the Stage 5 canonical navigation projection.** This
   layer reproduces the *old* interface and nothing else.

### `legacyContentBindings` was never a seventh entity

Stage 2 filed the hidden Renaissance bundle under `records/` as a
`legacyContentBinding`, loaded through `LAYOUT` and validated through
`RECORD_TYPES` — which made it, structurally, a seventh curriculum entity type.
It never was one: it describes an id the curriculum explicitly does *not* own.

Stage 3 reclassifies it. The record file is gone, the `LAYOUT` entry is gone,
`validateLegacyContentBinding` is gone from `schema.js`, and the same fact now
lives in `compatibility/runtime-v1.js` as `hiddenChapter`, validated by
`compatibility/index.js`. `checkIntegrity` no longer knows about it; the
content-path uniqueness check it used to perform is now done by
`checkCompatibility`, against the same canonical paths.

Nothing about the fact changed. Its filing did.

---

## 2. Field-authority audit

Four authorities appear in the tables below.

| Kind | Meaning |
|---|---|
| **Canonical** | stated by a catalogue record; the projection copies it |
| **Derived (records)** | computed from relationships between canonical records |
| **Derived (content)** | computed by loading the chapter's content file |
| **Compatibility** | non-derivable legacy fact; lives in `runtime-v1.js`; has a deletion stage |

*"Exact parity required"* is `yes` for every current output field: Stage 3 is
behaviour-preserving and accepts no deliberate difference.

### 2.1 `src/data/modules.js` — `MODULES`

Consumers: `chapterNavigation.js`, `progress.js`, `dailyPlanner.js`,
`todaysPlan.js`, `contentHierarchy.js`, `Subjects.jsx`, `LegacyApp.jsx`.

| Field | Authority | Source | Parity | Deleted at |
|---|---|---|---|---|
| `id` (×7) | **Compatibility** | `legacyModules[].id` — the seven legacy ids are aggregations with no canonical counterpart | exact | Stage 5 |
| order of the seven | **Compatibility** | `legacyModules` declaration order | exact | Stage 5 |
| `title` | **Compatibility** (5 of 7) | `legacyModules[].title`. `null` for `eng_macbeth` and `hist_usa`, whose legacy title *is* their single canonical module's title, so those two derive. The other five either aggregate several modules (no single canonical title exists) or differ from canonical by capitalisation the records deliberately corrected — `"Medicine Through Time"` vs `Medicine through time`. | exact | Stage 5 |
| `subject` | **Derived (records)** | aggregated modules' `subjectId` → subject record `themeKey`. The generator fails if the aggregated modules disagree. | exact | Stage 5 |
| `chapterIds` | **Derived (records)** | aggregated modules' `chapterRefs`, concatenated in `position` order, minus `excludedChapterIds` | exact | Stage 5 |
| `getModuleById` | **Derived (code)** | same lookup over the projected array | exact | Stage 5 |
| `getModuleForChapter` | **Derived (code)** | same lookup over the projected array | exact | Stage 5 |

**Proved, not assumed:** `subject` was checked against all 60 rows — every
aggregated module resolves to one `subjectId`, and `themeKey` reproduces
`"History"`, `"Sociology"`, `"Maths"`, `"Biology"`, `"English"` exactly.
`chapterIds` was checked aggregation by aggregation; canonical `position` order
reproduces all seven legacy arrays with no reordering.

### 2.2 `src/chapters.js` — `CHAPTERS`

Consumers: everything that browses, plans, scores or routes to a chapter.

| Field | Authority | Source | Parity | Deleted at |
|---|---|---|---|---|
| `id` | **Canonical** | `chapter.id`, preserved verbatim (D-8) | exact | — (canonical) |
| row order (60) | **Compatibility** | `chapterOrder`. Not derivable: it is neither the canonical module order nor the legacy `MODULES` order. Legacy modules run medicine → sociology → maths → biology → english → spain → usa; these rows run medicine → spain → usa → biology → maths → sociology → english. Within medicine, `surgery-anaesthetics` precedes `great-plague-1665`, the reverse of *both* the canonical and the legacy module order. | exact | Stage 5 |
| `subject` | **Derived (records)** | owning module's `subjectId` → subject `themeKey`. Verified for all 59 canonical rows. | exact | Stage 5 |
| `series` | **Compatibility** | `chapterFields[].series`. Present on 39 rows, absent on 21; no canonical field exists. `REJECTED_FIELDS` names it "replaced by module membership". | exact | Stage 5 |
| `number` | **Compatibility** | `chapterFields[].number`. A frozen display index, **not** the canonical position: 18 of 60 rows disagree with `position + 1` (`surgery-anaesthetics` sits at position 5 and prints 4; `soc6` at position 1 and prints 6; two rows both print 3). `REJECTED_FIELDS` names it "replaced by position on the chapter reference (D-5)". | exact | Stage 5 |
| `title` | **Canonical** | `chapter.title` — 59/59 identical | exact | — |
| `subtitle` | **Canonical** | `chapter.subtitle` — 59/59 identical | exact | — |
| `era` | **Canonical** | `chapter.era` — 59/59 identical | exact | — |
| `icon` | **Canonical** | `chapter.icon` — 59/59 identical | exact | — |
| `headerImage` | **Canonical** | `chapter.headerImage` — 59/59 identical | exact | — |
| `color` | **Compatibility** | `chapterFields[].color`. Per-row palette override; subject palettes live in `src/constants/subjects.js` and no rule generates these. History medicine alone uses 12 distinct values across 15 rows. | exact | Stage 5 |
| `colorLight` | **Compatibility** | `chapterFields[].colorLight`. Same, and not derivable from `color`: the values mix `rgba(…,.12)`, `rgba(…,0.12)`, `rgba(…,.14)` and one flat hex (`#f5e6d3`). | exact | Stage 5 |
| `tags` | **Split** | facet prefix (`subject:`, `course:`, `examboard:`, `period:`, `theme:`) from `chapterFields[].facetTags` — **compatibility**; concept portion from `chapter.conceptIds` — **canonical**. Verified: on all 16 tagged rows the concept portion equals `conceptIds` exactly, in order. Only 16 rows carry `tags` at all. | exact | facets Stage 6 |
| `screenCount` | **Derived (content)** | `screens.length` of the chapter's content module. **Verified exact for all 60 rows.** | exact | — |
| `screenTags` | **Derived (content)** | `screens.map(s => s.tag ?? null)`. **Verified exact for all 60 rows**, including nulls and positions. | exact | — |
| `availability` | **Compatibility** | emitted only for the hidden Renaissance row. The other 59 rows omit the key entirely and let `getChapterAvailability` derive it from `screenCount`. | exact | Stage 6 |
| `CHAPTER_AVAILABILITY` | **Derived (code)** | constant, reproduced verbatim | exact | — |
| `getChapterAvailability` | **Derived (code)** | same function body | exact | — |
| `isChapterAvailable` | **Derived (code)** | same function body | exact | — |

### 2.3 `src/content/chapterContentRegistry.js` — `CHAPTER_CONTENT_LOADERS`

Consumers: `ChapterPlayer` via `loadChapterContent`.

| Field | Authority | Source | Parity | Deleted at |
|---|---|---|---|---|
| key (×60) | **Canonical** (59) | `chapter.id` | exact | — |
| key (the 60th) | **Compatibility** | `hiddenChapter.row.id` | exact | Stage 6 |
| key order | **Compatibility** | `loaderSectionAnchors` re-sequencing `chapterOrder`. The registry holds the same 60 ids in the same contiguous runs, ordered differently (sociology and maths before biology). Seven anchor ids recover it; restating all 60 would violate rule 4. | exact | Stage 5 |
| dynamic import path | **Derived (records)** | `chapter.contentPath` (or `hiddenChapter.contentPath`) with the `src/content/` prefix replaced by `./`. **Verified exact for all 60 entries.** | exact | — |
| loaded module shape | **Derived (records)** | `.then(m => m.default)` for all 60 — one uniform rule, no per-entry exception | exact | — |
| `loadChapterContent` | **Derived (code)** | same function body | exact | — |

### 2.4 Fields that are compatibility-only, in one list

`legacyModules` (7 ids, 5 titles, 7 aggregation lists) · `chapterOrder` (60 ids)
· `loaderSectionAnchors` (7 ids) · `chapterFields.number` (59) ·
`chapterFields.series` (39) · `chapterFields.color` (59) ·
`chapterFields.colorLight` (59) · `chapterFields.facetTags` (16) ·
`hiddenChapter` (1 row, 13 fields) · `excludedChapterIds` (6 ids).

Everything else in all three interfaces is canonical or derived. In particular
the two fields that dominate `src/chapters.js` by volume — `screenCount` and
`screenTags` — are derived from the content files, exactly, for every row.

---

## 3. The seven legacy module aggregations

| Legacy id | Canonical modules aggregated | Title |
|---|---|---|
| `hist_medicine` | `history-edexcel-medicine-britain` + `history-edexcel-western-front` | declared |
| `soc_family` | `sociology-aqa-key-concepts` + `sociology-aqa-families` | declared |
| `maths_core` | `maths-aqa-number` | declared |
| `bio_core` | `biology-aqa-cell-biology`, `-organisation`, `-infection-and-response`, `-homeostasis`, `-inheritance-variation-evolution`, `-ecology` (in current runtime chapter order) | declared |
| `eng_macbeth` | `english-lit-aqa-macbeth` | **derived** |
| `hist_spain_new_world` | `history-edexcel-spain-new-world` | declared |
| `hist_usa` | `history-edexcel-usa-conflict` | **derived** |

No canonical module is aggregated twice, and the aggregation is checked against
the loaded catalogue rather than trusted.

---

## 4. The hidden Renaissance chapter

`history-medicine-renaissance-medicine` is the superseded Renaissance bundle. It
has **no chapter record and never will** — it is not a chapter. It is still a
live progress destination (`LEGACY_CHAPTER_ID_MAP` folds `mod2` onto it), it
still has a loader entry, and it still appears as a `CHAPTERS` row marked
`availability: 'hidden'`.

It therefore lives in `hiddenChapter`, in full, with its insertion point
(`insertAfter: 'history-medicine-black-death'`) — because there is no canonical
record to derive any of it from. Two things are deliberately *not* stated:
`screenCount` and `screenTags`, which come off its content file exactly as they
do for the other 59 rows. Validation rejects them if they appear.

It is deleted at **Stage 6**, with `LEGACY_CHAPTER_ID_MAP`.

---

## 5. The six new English chapters

The catalogue authors six planned English Literature chapters that have no
runtime row, no content file and no loader:

`english-inspector-calls-social-message` ·
`english-inspector-calls-responsibility-denial` ·
`english-inspector-calls-consequences-resolution` ·
`english-macbeth-guilt-consequence` · `english-macbeth-witches-fate` ·
`english-macbeth-appearance-reality`

They **stay in the canonical catalogue** and **must not enter the Stage 3
projection**: surfacing six new coming-soon cards is a learner-visible change,
and Stage 3 is not allowed to make one.

They are listed explicitly in `excludedChapterIds` rather than filtered by
`status`, and a completeness gate asserts that every non-retired canonical
chapter is *either* projected *or* explicitly excluded. Adding a planned chapter
to any other module therefore fails the projection instead of being silently
dropped. The exclusion is deleted at **Stage 5**, when navigation moves onto
canonical records and `status` may legitimately reach the learner.

---

## 6. `screenTags` corrections are not a Stage 3 concern

`screenTags` derive from the content files **exactly**, so the Stage 3
projection introduces no difference at all. It does not follow that the current
values are *good*: a weakness route whose tag is missing from its target
chapter's `screenTags` silently lands on screen 0.

`pnpm curriculum:projections:report` writes that analysis to
`docs/curriculum/SCREEN_TAG_REVIEW.md` — dead routes, untagged chapters,
ambiguous tags. It is a **review artefact only**. It changes no output.

A route moving from screen 0 to screen 14 is a learner-visible change even
though no code changed, so corrected recovery routing belongs to the
Topic/recovery migration, not to a stage whose entire promise is that behaviour
is preserved.

---

## 7. When the compatibility projection is retired

| Stage | What happens to it |
|---|---|
| **Stage 3** (this one) | created; feeds the generated projections; no runtime change |
| **Stage 4** | **unchanged and still required.** The three runtime files become re-exports of the generated projections, so the projection must keep producing the identical interface. Nothing here is deleted. |
| **Stage 5** | `legacyModules`, `chapterOrder`, `loaderSectionAnchors`, `chapterFields.number`, `.series`, `.color`, `.colorLight` and `excludedChapterIds` are deleted, as the canonical navigation projection supersedes each of them. |
| **Stage 6** | `chapterFields.facetTags` (with `tagChapterMap`) and `hiddenChapter` (with `LEGACY_CHAPTER_ID_MAP`) are deleted. `compatibility/` is removed. |

`DELETION_STAGES` in `compatibility/index.js` is the machine-readable copy of
that table, and validation fails for any field missing from it.

---

## 8. Commands

```bash
pnpm curriculum:projections:generate   # write src/data/generated/curriculum/**
pnpm curriculum:projections:check      # fail on drift or on any parity break
pnpm curriculum:projections:report     # write the screenTags review artefact
```

`curriculum:projections:check` runs inside `pnpm verify`, immediately after
`curriculum:check`.
