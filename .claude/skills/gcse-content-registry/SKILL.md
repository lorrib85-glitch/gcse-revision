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
Parent module:     <module id>  included ✓/✗  order ✓/✗
src/chapters.js:   id ✓/✗  number ✓/✗  screenCount ✓/✗  screenTags ✓/✗
Content file:      screens non-empty ✓/✗  stageNavigation bounds ✓/✗
Loader registry:   CHAPTER_CONTENT_LOADERS[id] ✓/✗
Screen registry:   all screen/block types registered ✓/✗
Action required:   <none / list>
```

## Authorities

| File | Owns |
|---|---|
| `src/data/modules.js` | Parent modules and ordered `chapterIds` |
| `src/chapters.js` | Chapter browsing metadata, availability, `screenCount`, `screenTags` |
| `src/content/<subject>/<series>/episodes/<file>.js` | Hook, outcomes, recall, screens and stage navigation |
| `src/content/chapterContentRegistry.js` | `CHAPTER_CONTENT_LOADERS` and lazy content loading |
| `src/data/screenRegistry.js` | Approved screen/block types and required data |

Some content filenames still use `episode-*` for historical reasons. That filename
convention does not change the product model: each file exports one chapter.

## Rules

- `chapter.id` must exactly match the metadata ID and loader key.
- The parent module must include the chapter ID exactly once.
- `screenCount` must equal `screens.length`.
- `screenTags` must equal `screens.map(screen => screen.tag ?? null)`.
- Every screen and nested block type must resolve through `screenRegistry.js`.
- New chapter content must not require edits to `ChapterPlayer` or new routing
  branches in `ScreenRenderer`.
- Do not add chapter content to old subject-wide bundles.

## Workflow

1. Read `src/data/modules.js` and confirm the parent module.
2. Read the chapter row in `src/chapters.js`.
3. Create or update the chapter content file under `src/content/`.
4. Add or update its dynamic loader in `src/content/chapterContentRegistry.js`.
5. Validate the authored screen/block types against `src/data/screenRegistry.js`.
6. Update `screenCount`, `screenTags` and any affected `stageNavigation` indices.
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
