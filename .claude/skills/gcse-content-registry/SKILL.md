---
name: gcse-content-registry
description: >
  Keep learner-facing chapters aligned across parent modules, chapter metadata,
  content files, lazy loaders and the governed screen registry.
argument-hint: "[chapter id or description]"
---

# GCSE chapter registry hygiene

Use this workflow when adding, extracting or changing a learner-facing chapter.
The canonical hierarchy is `Subject → Module → Chapter → Screen → Component`.

## Status block

```text
CHAPTER REGISTRY CHECK
──────────────────────
Chapter:           <id>
Chapter record:    exists ✓/✗  contentPath set ✓/✗
Parent module:     <module id>  referenced once ✓/✗  position ✓/✗
Projection:        CHAPTERS row ✓/✗  screenCount derived ✓/✗  screenTags derived ✓/✗
Content file:      screens non-empty ✓/✗  stageNavigation bounds ✓/✗
Loader registry:   generated CHAPTER_CONTENT_LOADERS[id] ✓/✗
Screen registry:   all screen/block types registered ✓/✗
Action required:   <none / list>
```

## Authorities

| File | Owns |
|---|---|
| `src/curriculum-catalogue/records/modules/<module>.js` | Module membership and chapter order (`chapterRefs[].position`) |
| `src/curriculum-catalogue/records/chapters/<subject>/<module>.js` | Chapter identity, presentation, `status` and `contentPath` |
| `src/content/<subject>/<series>/episodes/<file>.js` | Hook, outcomes, recall, screens and stage navigation |
| `src/data/generated/curriculum/**` | The generated `MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS` — read through `src/data/modules.js`, `src/chapters.js` and `src/content/chapterContentRegistry.js`, which are re-export boundaries and are never authored in |
| `src/data/screenRegistry.js` | Approved screen/block types and required data |

Some content filenames still use `episode-*` for historical reasons. That filename
convention does not change the product model: each file exports one chapter.

## Rules

- `chapter.id` must exactly match the record id and the generated loader key.
- Exactly one module record must reference the chapter.
- `screenCount` and `screenTags` are DERIVED by the generator from the content
  file. Never author or "fix" them — a mismatch means the projection is stale,
  so run `pnpm curriculum:projections:generate`.
- Every screen and nested block type must resolve through `screenRegistry.js`.
- New chapter content must not require edits to `ChapterPlayer` or new routing
  branches in `ScreenRenderer`.
- Do not add chapter content to old subject-wide bundles.

## Workflow

1. Read the module record and confirm it references the chapter exactly once.
2. Read the chapter record and confirm its `contentPath`.
3. Create or update the chapter content file under `src/content/`.
4. Validate the authored screen/block types against `src/data/screenRegistry.js`.
5. Update any affected `stageNavigation` indices in the content file.
6. Run `pnpm curriculum:projections:generate`, and `pnpm lab:generate` if screen
   or block usage changed.
7. Run the architecture suite and production build.

## Test pattern

```javascript
import { CHAPTERS } from '../../src/chapters.js'
import { MODULES } from '../../src/data/modules.js'
import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'

const chapter = CHAPTERS.find(item => item.id === '<chapter-id>')
const parentModule = MODULES.find(item => item.chapterIds.includes(chapter.id))

expect(chapter).toBeDefined()
expect(parentModule).toBeDefined()
expect(CHAPTER_CONTENT_LOADERS[chapter.id]).toBeTypeOf('function')
```
