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

## Step 1 — Resolve paths

### Subject routing

| Subject | Content file location | Series index |
|---------|----------------------|--------------|
| History | `src/content/history/<series>/episodes/episode-NN-<slug>.js` | `src/content/history/<series>/index.js` |
| All others | `src/content/<subject-lower>/<series-or-id>/<id>.js` | none (create if series index exists) |

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

Entry format:
```js
'<id>': () => import('<relative-path-to-file>').then(m => m.default),
```

Use column alignment consistent with existing entries. If the entry already
exists, skip silently — do not duplicate.

## Step 4 — Update series index (History only)

For History episodes, update `src/content/history/<series>/index.js`:

**If episode is built** (screenCount > 0 or content file has screens): add
an `import` at the top and push the imported name into the `MEDICINE_EPISODES`
array in number order.

**If episode is unbuilt** (screenCount 0): add a placeholder comment in
number order:
```js
// episode-NN: <id> — unbuilt (screenCount 0), add import when built
```

Do not add an import for an episode whose screens array is empty.

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
  □ vitest run tests/architecture
  □ /gcse-content-registry <id> — final alignment check before commit
```

## Stop points

- `src/modules.js` row missing → halt before creating any file
- Content file exists with screenCount > 0 → halt, require explicit user confirmation
- Registry entry already present → skip step 3 silently, note in output
- Subject is not History and `src/content/<subject-lower>/` does not exist → halt, ask user to confirm path
- Any file write fails → halt and report the error
