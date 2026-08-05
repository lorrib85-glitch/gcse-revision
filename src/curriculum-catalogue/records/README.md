# Curriculum catalogue records

Authored curriculum facts. **Build-time only** — nothing under
`src/curriculum-catalogue/**` may ever be imported by production `src/**` code,
and `tests/architecture/curriculum-catalogue-integrity.test.js` proves it by
sweeping the filesystem rather than consulting an allowlist.

Every record is plain serialisable data: no React, no browser APIs, no storage,
no imports outside this directory. What the runtime eventually needs is a
*generated projection* of these records, never a second authored copy.

## Layout

Declared once in `../loadCatalogue.js` (`LAYOUT`) and matching
`.planning/phase-5-curriculum-architecture/DESIGN.md` §6.1. Where a record type
lives is a decision, not something derivable from disk, so it is stated in one
place. **Which records exist is always derived** — every `.js` file in a
declared location is loaded, so adding a record is adding a file and nothing
else. There is no list of records anywhere.

| Path | Shape | Why |
|---|---|---|
| `boards.js` | one file, array of records | Two small records, read together, changing almost never. Two files would be ceremony. |
| `subjects.js` | one file, array of records | Ten small records, same reasoning. |
| `specifications/<id>.js` | one file per record | Each is large — papers, assessment objectives, selection groups, requirements — and changes for its own reasons. |
| `pathways/<id>.js` | one file per record | Same reasoning; a pathway changes when a school's option choices change. |
| `modules/<id>.js` | one file per record | Each is edited independently when its chapters change. |
| `chapters/<subject>/<module>.js` | one file per module, array of records | The fastest-growing set. Adding a chapter is almost always adding it to a module that already exists, so a per-module file keeps that a one-file edit and keeps `position` values visible next to each other. |

For the per-file shapes the **filename is the record id** — a record cannot be
found under a name that disagrees with what it calls itself.

A directory appears when its first record does. An absent location loads as
empty; it is not an error.

## Adding a record

1. Create the file in the location above, default-exporting the record (or the
   array, for grouped and nested shapes).
2. Run `pnpm curriculum:generate` and commit the regenerated documentation.
3. `pnpm curriculum:check` fails if the generated output has drifted, and
   `pnpm verify` runs it.

`../schema.js` validates each record in isolation; `../index.js` validates the
relationships between records — references resolving, retired records staying
unreachable from live ones, a chapter belonging to exactly one module.

## What a record may never contain

The schema rejects unknown keys outright, and names the reason for the fields
that were deliberately rejected rather than merely never added:

| Field | Why it is rejected |
|---|---|
| `assessmentObjective.weighting` | A single number cannot say which tier it describes. Use `weightings` (below). |
| `module.tier` | Tier is a study-pathway property. A module is shared by Foundation and Higher pathways. |
| `chapterRef.required`, `chapterRef.availabilityOverride`, `moduleRef.availabilityOverride` | Deferred (OD-6). No current surface demonstrates the requirement, and a field nobody maintains is worse than an absent one. |
| `subject.browsable` | Browser visibility is **derived** from configured study pathways, never authored (OD-8). |
| `subject.specificationIds` / `subject.moduleIds` | Coverage is not ownership. If a subject owned its specifications, Combined Science would have to pick one of Biology, Chemistry or Physics to belong to. |
| `chapter.subject`, `chapter.number`, `chapter.series`, `chapter.screenCount`, `chapter.screenTags` | All derived — from the module, from the chapter reference's position, or from the content file. |
| `component`, `screenType`, `blockType`, `authoringType` … | The component domain. The two catalogues share a pattern and no authority. |

## Assessment objective weightings

Every assessment objective carries a `weightings` object that names the scope it
describes:

```js
{ id: 'ao1', title: 'Standard techniques', weightings: { foundation: 50, higher: 40 } }
{ id: 'ao1', title: 'Knowledge and understanding', weightings: { overall: 40 } }
```

Two real qualifications forced this shape. AQA Mathematics weights its
objectives differently in each tier — 50/25/25 Foundation, 40/30/30 Higher — so
one number would be wrong for one tier. AQA English Language has three
objectives, AO7–AO9, examined through the Spoken Language endorsement and worth
**0%** of the qualification; they are real and must not be dropped to make a
total add up.

| Rule | Why |
|---|---|
| Either `overall`, or one entry per tier the specification declares | A record that states neither, or only some tiers, still reads as complete. |
| Never both `overall` and a tier | A record stating both does not know which one is true. |
| A scope the specification does not offer is rejected | A percentage attached to something that does not exist. |
| Values are finite numbers from 0 to 100 **inclusive** | 0% is a fact; a missing weighting is not. |
| Every scope totals exactly 100 across the objectives | Checked per scope, so a wrong Higher set is not averaged away by a right Foundation one. |

`overall` is allowed on a tiered specification when the tiers genuinely agree —
the Sciences weight 40/40/20 in both tiers, and writing that twice would be one
fact with two homes. The generated document prints one column per tier only when
the tiers actually differ.

## Chapter status and content binding

Two fields, two questions, deliberately independent:

| Field | Question it answers |
|---|---|
| `status` | May a learner open this chapter? |
| `contentPath` | Does a content source exist for it today? |

29 planned chapters have a real content file that currently returns zero
screens. Their `contentPath` names that file. Forcing it to `null` to match
their status would delete a true fact about the repository and make the loader
registry unreproducible from the catalogue.

The one direction that **is** constrained: `available` means openable, and
nothing is openable without a source, so an available chapter may never have a
null path. A file appearing never promotes a chapter — only `status` does.

The six chapters converted from browse-surface placeholder cards have no file at
all, so their path is `null` and they generate no loader entry.

One remaining case is **not** a record: a content file the runtime loads for an
id that is not a chapter. There is one — `history-medicine-renaissance-medicine`,
the superseded hidden bundle, whose id is still a live progress destination. It
has no module, no position, no status and no learner surface; it states only
that a path is still loaded and why. That makes it compatibility data, not a
seventh entity type, so it lives in `../compatibility/runtime-v1.js`. Chapters
plus that one binding reproduce the loader registry exactly.

## Persisted progress names

A subject id is **progress identity**, not display text: `recordScore` writes it
into `gcse_scores` and the weakness tracker writes it into stored entries. The
canonical ids differ from the strings already on disk, so a subject records
which persisted strings are its own — and, separately, which are not anybody's.

| Field | Meaning |
|---|---|
| `legacyProgressNames` | Persisted strings that **resolve to this subject**. Exclusive: `index.js` rejects a name claimed by two subjects, so resolution can never pick one arbitrarily. |
| `unattributedProgressNames` | Persisted strings that are known legacy and **resolve to no subject**. May be listed by several subjects — that is precisely what makes them unattributed — and may never also be an exclusive alias anywhere. |

`'English'` is the case that forced two lists (OD-1). It was written before
Language and Literature were separate subjects, and nothing can recover which
one an old row meant. Both English subjects list it as unattributed, so the rows
stay stored, stay readable, and count toward neither average. Guessing would
fabricate learner data, and fabricated progress is worse than absent progress.

`'Quick Fire'` is also persisted and is not a subject at all. It appears in
neither list, on any record.

## Ordering

Ordering lives on the **relationship**, never on the entity: `{ moduleId,
position }` on a pathway, `{ chapterId, position }` on a module. Positions must
be non-negative, unique within one list, and ascending in array order — the
authored file reads in the order it means.

## Identifiers

Kebab-case for everything the catalogue creates. **Chapter ids are the
exception**: they are preserved verbatim from `src/chapters.js`, including
`soc1`, `math1`, `bio_building_blocks` and `sci_bio_w1`, because each one backs
a live `gcse_chapter_<id>` progress key. They are never renamed or normalised.
