---
name: gcse-content-registry
description: >
  Keep learner-facing Chapters aligned across parent Modules, Chapter metadata,
  content files, generated loaders, optional Chapter Topics and the governed
  Screen registry. This is structural hygiene, not content readiness approval.
argument-hint: "[chapter id or description]"
---

# GCSE Chapter registry hygiene

Use this workflow when adding, extracting or structurally changing a
learner-facing Chapter. The canonical hierarchy is
`Subject → Module → Chapter → Screen → Component`.

This skill checks **registry and structural alignment only**. It does not replace
`content-create`'s Stage-B Chapter readiness report or `content-review`'s
independent approval.

## Status block

```text
CHAPTER REGISTRY CHECK
──────────────────────
Chapter:           <id>
Chapter record:    exists ✓/✗  status <value>  contentPath set ✓/✗
Parent Module:     <module id>  referenced once ✓/✗  position ✓/✗
Projection:        CURRICULUM_CHAPTERS row ✓/✗  screenCount derived ✓/✗  screenTags derived ✓/✗
Content file:      screens <count>  structural state valid ✓/✗  stageNavigation bounds ✓/✗
Topic layer:       absent / present-valid / invalid
Loader registry:   generated CHAPTER_CONTENT_LOADERS[id] ✓/✗
Screen registry:   all authored Screen/block types registered ✓/✗
Openable now:      yes / no — `status: available` + derived `screenCount > 0`
Lifecycle state:   scaffolded / implemented-not-approved / approved / unknown
Action required:   <none / list>
```

## Authorities

| File | Owns |
|---|---|
| `src/curriculum-catalogue/records/modules/<module>.js` | Module membership and Chapter order (`chapterRefs[].position`) |
| `src/curriculum-catalogue/records/chapters/<subject>/<module>.js` | Chapter identity, presentation, authored `status` and `contentPath` |
| `src/content/<subject>/<series>/episodes/<file>.js` | Hook, outcomes, recall, optional Topics, Screens and stage navigation |
| `docs/system/CHAPTER_TOPICS.md` + `src/content/chapterTopicSchema.js` | Chapter Topic authoring and validation when Topics are present |
| `src/data/generated/curriculum/learnerCurriculum.js` | Generated canonical Modules, Chapters, Learning Sequences and loaders; read only through `src/data/learnerCurriculum.js` |
| `src/data/screenRegistry.js` | Approved Screen/block authoring types and required data |
| `docs/system/CHAPTER_READINESS_AUDIT.md` | Readiness-report assembly; not reimplemented here |

Some content filenames still use `episode-*` for historical reasons. That
filename convention does not change the product model: each file exports one
Chapter.

## Rules

- `chapter.id` must exactly match the record ID and the generated loader key.
- Exactly one Module record must reference the Chapter.
- `status` is authored. `screenCount` and `screenTags` are DERIVED by the
  generator from the content file. Never author or "fix" the derived fields — a
  mismatch means the projection is stale, so run
  `pnpm curriculum:runtime:generate`.
- A zero-Screen content file is a valid **scaffolded structural state**. Do not
  add placeholder teaching content merely to make `screens` non-empty.
- Openability follows the existing runtime rule: the Chapter is openable only
  when `status` is `available` and derived `screenCount > 0`. Report that fact;
  do not equate a resolving record/loader with content readiness.
- Every authored Screen and nested block type must resolve through
  `screenRegistry.js`.
- When `topics` is present, validate it through `CHAPTER_TOPICS.md` and
  `chapterTopicSchema.js`. Topics remain optional for unmigrated Chapters; this
  skill must not invent Topic IDs, duplicate pedagogy metadata or run a second
  Topic schema.
- New Chapter content must not require edits to `ChapterPlayer` or new routing
  branches in `ScreenRenderer`.
- Do not add Chapter content to old subject-wide bundles.
- A green registry check means **structurally aligned**, not implemented, ready
  or approved.

## Workflow

1. Read the Module record and confirm it references the Chapter exactly once.
2. Read the Chapter record and confirm its authored `status` and `contentPath`.
3. Read the Chapter content file and record the actual Screen count.
4. If Topics are present, validate Topic records and Screen back-references
   through the existing Chapter Topic contract.
5. Validate all authored Screen/block types against `src/data/screenRegistry.js`.
6. Validate affected `stageNavigation` indices.
7. Run `pnpm curriculum:runtime:generate`, and `pnpm lab:generate` if Screen or
   block usage changed.
8. Run the relevant architecture checks and production build for the change.
9. Report the structural lifecycle state. If learning content is being created
   or materially rebuilt, hand off to `content-create`; do not substitute this
   registry check for the Chapter readiness audit.

## Test pattern

```javascript
import {
  CURRICULUM_CHAPTERS,
  CURRICULUM_MODULES,
  CHAPTER_CONTENT_LOADERS,
} from '../../src/data/learnerCurriculum.js'

const chapter = CURRICULUM_CHAPTERS.find(item => item.id === '<chapter-id>')
const parentModule = CURRICULUM_MODULES.find(item =>
  item.chapterIds.includes(chapter.id),
)

expect(chapter).toBeDefined()
expect(parentModule).toBeDefined()
expect(CHAPTER_CONTENT_LOADERS[chapter.id]).toBeTypeOf('function')
```

If the Chapter is intended to be openable, also assert the authored/derived
openability conditions rather than asserting that every structural scaffold has
Screens.
