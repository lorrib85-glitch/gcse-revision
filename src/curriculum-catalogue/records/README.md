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
| `module.tier` | Tier is a study-pathway property. A module is shared by Foundation and Higher pathways. |
| `chapterRef.required`, `chapterRef.availabilityOverride`, `moduleRef.availabilityOverride` | Deferred (OD-6). No current surface demonstrates the requirement, and a field nobody maintains is worse than an absent one. |
| `subject.browsable` | Browser visibility is **derived** from configured study pathways, never authored (OD-8). |
| `subject.specificationIds` / `subject.moduleIds` | Coverage is not ownership. If a subject owned its specifications, Combined Science would have to pick one of Biology, Chemistry or Physics to belong to. |
| `chapter.subject`, `chapter.number`, `chapter.series`, `chapter.screenCount`, `chapter.screenTags` | All derived — from the module, from the chapter reference's position, or from the content file. |
| `component`, `screenType`, `blockType`, `authoringType` … | The component domain. The two catalogues share a pattern and no authority. |

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
