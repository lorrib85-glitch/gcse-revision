---
name: gcse-content-registry
description: >
  Ensure extracted GCSE content episodes/modules stay aligned with the metadata
  registry and series index. Use when extracting an episode into a content
  registry file, adding a new episode file, changing episode id/number/
  screenCount/screenTags, registering an episode in a series index, or checking
  compatibility between src/modules.js and content files.
argument-hint: "[episode id or description]"
---

# GCSE Content Registry Hygiene

Alignment checklist for episode extraction and registration in the RISE content
registry. Output a short status block first, then work through the steps.

## Status block

```
CONTENT REGISTRY CHECK
──────────────────────
Episode:          <id>
src/modules.js:   id ✓/✗  number ✓/✗  screenCount ✓/✗
Episode file:     screens non-empty ✓/✗  stageNavigation bounds ✓/✗
Series index:     included ✓/✗  order ascending ✓/✗
Loader entry:     MODULE_CONTENT_LOADERS[id] exists in LegacyApp.jsx ✓/✗
Action required:  <none / list>
```

## When to invoke

- Extracting an existing inline episode from `src/modules/<subject>.js` into
  `src/content/<subject>/<series>/episodes/`
- Adding a new episode file to the registry
- Changing episode `id`, `number`, `screenCount`, or `screenTags`
- Registering an episode in a series index
- Spot-checking alignment between `src/modules.js` and extracted content files

## Authorities

| File | Owns |
|------|------|
| `src/modules.js` | `id`, `number`, `screenCount`, `screenTags`, `headerImage`, all browsing metadata |
| `src/content/<subject>/<series>/episodes/episode-NN-<slug>.js` | `hook`, `outcomes`, `screens`, `recall`, `stageNavigation` |
| `src/content/<subject>/<series>/index.js` | ordered series array (`MEDICINE_EPISODES` etc.) |
| `src/app/LegacyApp.jsx` | `MODULE_CONTENT_LOADERS` — one entry per built episode, consumed by the app loader |

`src/modules.js` is the **single source of truth** for metadata. When content and
metadata disagree, fix the content file — do not edit `src/modules.js` unless
the user explicitly asks.

## Rules

### Filename convention

- Filename prefix must match `episode.number`: `episode-07-*.js` must export `number: 7`
- Slug: `episode-NN-<kebab-id-without-subject-prefix>.js`
  - e.g. id `history-medicine-germ-theory`, number 7 → `episode-07-germ-theory.js`

### Alignment with src/modules.js

- `episode.id` must exactly match the `id` field in `src/modules.js`
- `episode.number` must exactly match the `number` field in `src/modules.js`

### Series index

- Episodes appear in **ascending `number` order** in `MEDICINE_EPISODES` (or subject equivalent)
- Every extracted episode must be present in the series index
- Placeholder comments for unextracted episodes remain numbered in sequence

### Loader entry

- Every built episode must have an entry in `MODULE_CONTENT_LOADERS` in `src/app/LegacyApp.jsx`
- Entry format: `'<episode-id>': () => import('<path-to-episode-file>').then(m => m.default)`
- Do not remove or restructure fields that `ModulePlayer` reads

### Episode file requirements

- `screens` array must be non-empty
- `stageNavigation` entries (if present): must have `id`, `title`, `screenIndex`
- `stageNavigation.screenIndex` values must be within `[0, screens.length - 1]`

## Forbidden

- Rewriting copy, questions, or explanations — extract verbatim
- Visual redesign
- Building a module that does not already exist inline
- Running `/canonical-topic` unless separately requested
- Touching unrelated subject files
- Editing `src/modules.js` metadata (`screenCount`, `screenTags`) — that is a
  Workflow C task requiring its own triage

## Extraction steps

1. Read `src/modules.js` — find the target episode's metadata block (id, number)
2. Create `src/content/<subject>/<series>/episodes/episode-NN-<slug>.js`
   - `export default { id, subject, number, ... }` — follow existing episode files in the same series
   - Set `number` to match `src/modules.js` (correct if it differs)
   - Add future fields (`series`, `recallTags`, `examTags`, `assetKeys`) as empty arrays
3. Update the series index — import and append in number order in `index.js`
4. Add a `MODULE_CONTENT_LOADERS` entry in `src/app/LegacyApp.jsx`:
   `'<episode-id>': () => import('<relative-path-to-episode>').then(m => m.default)`
5. Update `tests/architecture/content-registry.test.js` — add per-episode tests
   (see Test pattern below)
6. Run `vitest run tests/architecture` — all tests must pass
7. Run `vite build` — must be clean
8. Commit to `main`

## Test pattern

Add these tests for each newly extracted episode. Import `MODULES` from
`src/modules.js` at the top of the test file.

```javascript
import { MODULES } from '../../src/modules.js'

describe('Content registry — <episode-slug>', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episode.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episode.id)
    expect(episode.number).toBe(meta.number)
  })

  it('filename prefix matches episode.number', () => {
    // episode-07-* must export number: 7
    expect(episode.number).toBe(/* hardcode expected number */)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episode.screens)).toBe(true)
    expect(episode.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episode.stageNavigation) return
    for (const stage of episode.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episode.screens.length)
    }
  })
})

describe('Content registry — series index (MEDICINE_EPISODES)', () => {
  it('episodes are in ascending number order', () => {
    const numbers = MEDICINE_EPISODES.map(e => e.number)
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
  })
})
```
