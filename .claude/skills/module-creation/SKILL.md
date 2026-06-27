---
name: module-creation
description: >
  Scaffold a new GCSE module — creates the content file at the canonical path,
  adds the loader entry to src/content/moduleContentRegistry.js, and updates
  the series index if applicable. Run after adding the metadata row to
  src/modules.js and (optionally) running /canonical-topic. Does zero content
  generation — structure only.
argument-hint: "<module-id>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---

# Module creation

Scaffolds the code structure for a new GCSE module: content file, registry
entry, series index. Does **not** generate lesson content — screens, hook,
and outcomes are left empty for a subsequent content build session.

## Prerequisite

The module ID must already exist in `src/modules.js` with a metadata row
(id, subject, number, title, subtitle, era, icon, color, colorLight,
headerImage, screenCount: 0, screenTags: []). The skill reads all metadata
from there. If the row is missing, halt immediately and tell the user to add
it first.

## Step 0 — Output the status block

Before doing anything, read `src/modules.js` and `src/content/moduleContentRegistry.js`
and output:

```
MODULE SCAFFOLD
───────────────
Module ID:      <id>
Subject:        <subject>  (number: N)
src/modules.js: ✓ found  /  ✗ missing — add metadata row first, then re-run
Content file:   <resolved-path>
                → does not exist — will create  /  already exists (screenCount N) — will skip
Registry entry: src/content/moduleContentRegistry.js
                → missing — will add  /  already present — will skip
Series index:   <index-path>  → will update  /  N/A
Canonical docs: <content-doc-path>  → ✓ found  /  ✗ missing
                <architecture-doc-path>  → ✓ found  /  ✗ missing
```

If `src/modules.js` row is missing: halt here. Do not create any files.
If content file already exists AND screenCount > 0: halt. Warn the user before overwriting built content — only proceed on explicit confirmation.

**Legacy bundle check:** grep `src/modules/biology.js`, `src/modules/maths.js`,
`src/modules/sociology.js`, `src/modules/chemistry.js`, and `src/modules/english.js`
for the module ID. If found in any of these files, halt immediately and output:

```
HALT — module exists in legacy subject bundle
──────────────────────────────────────────────
<id> is currently defined inline in src/modules/<subject>.js.
This skill scaffolds new isolated files only and does not handle
migration out of legacy bundles. Run the separate migration workflow
to extract this module before using /module-creation.
```

Do not create any files if the ID is found in a legacy bundle.

## Step 1 — Resolve paths

### Subject routing

| Subject | Content file location | Series index |
|---------|----------------------|--------------|
| History | `src/content/history/<series>/episodes/episode-NN-<slug>.js` | `src/content/history/<series>/index.js` |
| All others | `src/content/<subject-lower>/<series>/episodes/<moduleId>.js` | `src/content/<subject-lower>/<series>/index.js` (created if missing) |

All content files live under `src/content/` — never under `src/modules/`.

**History series detection:** read `src/content/history/` to find the series
directory. For Medicine Through Time: `medicine/`. If multiple series exist,
match against the module's `era` or `title` from `src/modules.js`, or halt
and ask the user which series.

**Episode filename (History):** `episode-NN-<slug>.js` where:
- `NN` = module `number` from `src/modules.js`, zero-padded to 2 digits
- `slug` = module `id` with the subject+series prefix stripped
  e.g. `history-medicine-germ-theory` → `germ-theory`

**Non-History subjects:** if no `src/content/<subject-lower>/` directory
exists yet, halt and ask the user to confirm the path before creating.
Do not invent a directory structure for a subject that has none.

### Registry entry path

The `import()` path in `moduleContentRegistry.js` is relative to `src/content/`:
- History example: `'./history/medicine/episodes/episode-07-germ-theory.js'`

## Step 2 — Create the content file

Only if the content file does not already exist (or user has confirmed overwrite).

Write the file with this exact shape — no invented content, no placeholder copy:

```js
// Episode <NN> — <Title>
// Content file for: <id>
// Run /canonical-topic "<title>" to generate knowledge + architecture docs
// before filling in hook, outcomes, stageNavigation and screens.

export default {
  id: '<id>',
  subject: '<subject>',
  number: <number>,
  title: '<title>',
  subtitle: '<subtitle>',
  era: '<era>',
  icon: '<icon>',
  color: '<color>',
  colorLight: '<colorLight>',
  series: '<series-slug>',
  recallTags: [],
  examTags: [],
  assetKeys: [],

  hook: {},

  outcomes: {
    bullets: [],
  },

  stageNavigation: [],

  screens: [],
}
```

Fill `series` from the directory name for History (`medicine-through-time`
for medicine series). Fill all other fields verbatim from `src/modules.js`.

## Step 3 — Add registry entry

Append to `src/content/moduleContentRegistry.js` inside `MODULE_CONTENT_LOADERS`,
maintaining subject grouping comments. Insert in `number` order within the group.

Entry format — **dynamic import only, never static**:
```js
'<id>': () => import('<relative-path-to-file>').then(m => m.default),
```

The `() => import(...)` wrapper is mandatory. Do not add a top-level `import`
statement for episode content anywhere — doing so would statically bundle the
episode and defeat the per-module loading architecture.

Use column alignment consistent with existing entries. If the entry already
exists, skip silently — do not duplicate.

Seven architecture rules enforce this boundary automatically via
`tests/architecture/content-loading-boundary.test.js`:
1. `LegacyApp.jsx` must not define `MODULE_CONTENT_LOADERS`
2. `SUBJECT_MODULE_LOADERS` must not exist anywhere in `src/`
3. `moduleContentRegistry.js` must be the sole registry file
4. Registry values must be loader functions (not static imports)
5. App shell files must not statically import episode content
6. Stub content files must export `screens: []`
7. Every module ID in `src/modules.js` must have a registry entry

## Step 4 — Update or create series index

Applies to all subjects. The series index records which episodes exist in the
series and in what order. It is separate from `moduleContentRegistry.js` (which
serves the app loader) — the index serves tooling and future series-level features.

### If the index does not exist — create it

Create `src/content/<subject-lower>/<series>/index.js` with dynamic imports only:

```js
// <Series name> — episode registry
// Dynamic imports only — importing this file does not load any episode content.
// App loading is handled by src/content/moduleContentRegistry.js.

export const EPISODE_LOADERS = {
  '<id>': () => import('./episodes/<filename>.js').then(m => m.default),
}

export const EPISODE_IDS = Object.keys(EPISODE_LOADERS)
```

### If the index already exists with static imports (e.g. History medicine/index.js)

Do **not** convert existing static entries — that is a separate migration task.
Add the new episode using a dynamic loader appended after existing entries:

```js
// <id> — dynamic (new pattern)
export const <CONST_NAME>_LOADER = () => import('./episodes/<filename>.js').then(m => m.default)
```

Or, if the episode is **unbuilt** (screenCount 0), add only a placeholder comment:
```js
// episode-NN: <id> — unbuilt (screenCount 0), add loader when built
```

Never add a static `import` statement for episode content in any index file.

## Step 5 — Output next-steps checklist

```
MODULE SCAFFOLD COMPLETE
────────────────────────
Created:    <content-file-path>
Registry:   <id> added to src/content/moduleContentRegistry.js
Index:      <series-index-path> updated  /  N/A

Next steps:
  □ /canonical-topic "<title>" — generate knowledge + architecture docs
    (skip if docs already exist — see Canonical docs check above)
  □ Fill in hook, outcomes, stageNavigation and screens
  □ Update screenCount + screenTags in src/modules.js after screens are written
  □ vitest run tests/architecture   (includes content-loading-boundary.test.js — 7 loader rules)
  □ /gcse-content-registry <id> — final alignment check before commit
```

## Stop points

- `src/modules.js` row missing → halt before creating any file
- Content file exists with screenCount > 0 → halt, require explicit user confirmation
- Registry entry already present → skip step 3 silently, note in output
- Subject is not History and `src/content/<subject-lower>/` does not exist → halt, ask user to confirm path
- Any file write fails → halt and report the error
