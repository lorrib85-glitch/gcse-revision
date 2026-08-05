# `compatibility/` — temporary, and not curriculum

Everything in this directory exists to reproduce the **pre-cutover runtime
interface** exactly, and to be deleted when that interface is.

The canonical catalogue describes 8 subjects, 14 pathways, 36 modules and
65 chapters. The runtime interface exposes 7 `MODULES`, 60 `CHAPTERS` and
60 `CHAPTER_CONTENT_LOADERS`. The gap between those two shapes is legacy
presentation and legacy ordering. It has to be written down for Stage 3 to
promise exact parity — but it must never be written down in `records/`, because
a fact in `records/` is curriculum and outlives the migration.

| File | What it is |
|---|---|
| `runtime-v1.js` | the data — plain, serialisable, no imports |
| `index.js` | shape validation, cross-checks against the catalogue, and `DELETION_STAGES` |

## The rules

1. **Not a curriculum entity.** There are six (`CURRICULUM_ENTITY_TYPES` in
   `../schema.js`), and nothing here is a seventh.
2. **Never imported by production source.**
3. **Plain serialisable data,** validated like a record.
4. **Never duplicates a derivable fact.** If a canonical record or a content
   file already states it, stating it here is a validation failure.
5. **Every field names the stage that deletes it** (`DELETION_STAGES`).
6. **Never leaks into the Stage 5 canonical navigation projection.**

All six are enforced by `tests/architecture/curriculum-compatibility.test.js`.

## Before adding anything here

Ask, in this order:

1. Can a canonical record state it? Then it is a record, not compatibility.
2. Can it be derived from a record relationship, or from the chapter's content
   file? Then derive it in the generator — `screenCount` and `screenTags` both
   derive exactly, for all 60 rows, and neither appears here.
3. Does it exist only because the *old* interface printed it? Only then does it
   belong here — and it needs a `DELETION_STAGES` entry naming Stage 5 or
   Stage 6 before it will validate.

Full contract and the field-authority audit:
`docs/system/CURRICULUM_RUNTIME_COMPATIBILITY.md`.
