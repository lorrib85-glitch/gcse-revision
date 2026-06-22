# RISE Workflow Directory

**Authority:** `CLAUDE.md` > individual workflow files > session instructions.

Each file covers one lane. Read only the file that matches your triage
output — do not read the whole directory. Do not read this README unless
the lane classification is unclear or you need governance context.

## Lane index

| Lane | File | Use for |
|------|------|---------|
| A | `A_MINOR_EDIT.md` | Typo, one CSS value, one data field — inlined in triage skill |
| B | `B_VISUAL_UI.md` | Screen or component appearance change |
| C | `C_CONTENT_MODULE.md` | Module content, screens, questions in existing module |
| D | `D_BUG_FIX.md` | Broken behaviour, build failure, test failure |
| E | `E_BIG_BUILD.md` | New episode, new component, new flow, new architecture |
| F | `F_GSD_FOUNDATION.md` | `.planning/` and process docs only — inlined in triage skill |
| G | `G_WORKFLOW_GOVERNANCE.md` | CLAUDE.md, skills, workflow rules |

## Testing routing table

Run the lightest command that covers what changed.

| Files changed | Command |
|---|---|
| `src/modules.js` — metadata, `screenCount`, `screenTags` | `vitest run tests/architecture` |
| `src/progress.js`, `src/unifiedWeaknessTracker.js`, `dailyPlanner.js` | `vitest run tests/unit` |
| Storage / localStorage access patterns | `vitest run tests/architecture` |
| Any component with a `.stories.jsx` file | `vitest` (full — Playwright/Chromium) |
| New `.stories.jsx` file added | `vitest` (full) |
| Pure CSS or copy change, no logic touched | `vite build` only |

`vitest run tests/architecture` is fast and safe — run it whenever module
metadata or structural changes are involved. The full `vitest` suite
(Storybook / Playwright) is heavier — only when story files are in play.
