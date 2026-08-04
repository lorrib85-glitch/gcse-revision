# Curriculum catalogue

The single home for every curriculum fact: boards, subjects, specifications,
study pathways, modules and chapters.

**Authority:** `docs/decisions/0002-canonical-curriculum-architecture.md`.
Design detail lives in `.planning/phase-5-curriculum-architecture/DESIGN.md`;
the migration sequence in that directory's `IMPLEMENTATION-PLAN.md`.

> **Migration status: Stage 1 of 6.** Boards and specifications are authored.
> Subjects, pathways, modules and chapters arrive at Stage 2. **No production
> code consumes the catalogue.** `MODULES`, `CHAPTERS` and
> `CHAPTER_CONTENT_LOADERS` remain hand-authored exactly as they are, and
> `docs/system/CONTENT_HIERARCHY.md` remains the governing document for the
> current runtime hierarchy until Stage 6 replaces it.

## The boundary

```
src/curriculum-catalogue/          authored records — BUILD TIME ONLY
        │
        ├─ schema.js               validates one record in isolation
        ├─ loadCatalogue.js        deterministic filesystem loader
        ├─ index.js                validates the relationships between records
        └─ records/                the authored facts
        │
        ▼
scripts/generate-curriculum-catalogue.mjs
        │
        ├──► docs/curriculum/SPECIFICATION_CATALOGUE.md      generated documentation
        └──► src/data/generated/curriculum/**                generated projections (Stage 3)
                                                             ── the only thing the runtime may read
```

Two rules define the boundary, and both are enforced:

1. **Nothing under `src/**` may import `src/curriculum-catalogue/**`.** The
   catalogue is governance data. It carries provenance notes, assessment
   objectives and specification prose that must never enter a learner's bundle.
2. **The curriculum catalogue and the component catalogue never reference each
   other.** They share a pattern and no authority. A curriculum record must not
   name a component, a screen type or an authoring type; a component record must
   not name a subject, module or specification.

`tests/architecture/curriculum-catalogue-integrity.test.js` proves both by
**sweeping the filesystem**, not by consulting an allowlist — so a new top-level
folder under `src/` is covered the day it is created rather than the day someone
remembers to add it to a list.

## Authored records versus generated projections

| | Authored | Generated |
|---|---|---|
| Lives in | `src/curriculum-catalogue/records/` | `docs/curriculum/`, later `src/data/generated/curriculum/` |
| Edited by | a person | never — run the generator |
| Contains | the fact, once | a projection carrying only the fields its consumers read |
| Reaches the runtime | never | only the named projections |

The rule that makes this worth doing: **no second authored copy is kept so that
a test can compare it.** Where the old system authored `screenCount` and used a
test to keep it equal to the content file, the catalogue derives it. A drift
detector is what you build once you have accepted that a fact will be written
down twice.

## Adding a record

`src/curriculum-catalogue/records/README.md` is the working guide — layout,
file shapes, id rules, and the fields the schema deliberately rejects.

In short:

1. Add the file in the location the layout declares.
2. `pnpm curriculum:generate`, and commit the regenerated documentation.
3. `pnpm curriculum:check` fails on drift; `pnpm verify` runs it alongside the
   four component-domain checks.

## Commands

```bash
pnpm curriculum:generate   # write docs/curriculum/SPECIFICATION_CATALOGUE.md
pnpm curriculum:check      # fail if the committed document has drifted
```

`curriculum:check` runs inside `pnpm verify`, after the component-domain checks
and before the test suites — the same position `catalogue:check` occupies for
components. It is a generator check, so it belongs with the other generator
checks and ahead of anything that might consume their output.

## What the catalogue is not allowed to own

| Fact | Owner |
|---|---|
| Component identity, screen and block authoring types, routing | the component catalogue and `ScreenRenderer` |
| Chapter lifecycle, gates, completion | `ChapterPlayer` |
| Concept identity | `src/data/learningGraph/**` |
| Learner mastery | `src/data/masteryEngine/**` |
| Chapter progress keys | `src/data/chapterProgress.js` |
| Subject palettes and imagery values | `src/constants/subjects.js` |

A curriculum record referencing any of these would move authority across a
boundary the migration exists to keep. The schema rejects the field names
outright, and the architecture test rejects the imports.
