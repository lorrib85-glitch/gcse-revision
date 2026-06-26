# docs/ — navigation guide

## What each area is for

| Folder | Purpose |
|--------|---------|
| `system/` | **Permanent source of truth** — product identity, design tokens, UI constitutions, module architecture rules, workflow governance, spacing/motion/typography/button systems. These files are authoritative. |
| `components/` | Component registry and locked component specs. Check here before building or changing any component. |
| `canonical/` | Canonical lesson blueprints for Biology and Sociology — series maps, episode content files, episode architecture files. |
| `content/` | Canonical lesson blueprints for History and English (legacy location — see note below). |
| `workflows/` | Active workflow process docs — the canonical-topic pipeline and its per-subject adapters. |
| `archive/` | Searchable history only. Not authoritative. See archive section below. |

---

## What to read when

**UI change** → `docs/system/00_SYSTEM_INDEX.md` first, then follow its order of authority.

**Component change** → `docs/components/COMPONENT_REGISTRY.md` (check before building anything new), then `docs/components/LOCKED_COMPONENTS.md` if touching a locked component.

**Subject content change** → read the relevant canonical subject architecture file:
- History: `docs/system/HISTORY_MODULE_ARCHITECTURE.md` + `docs/content/history/HISTORY_SERIES_MAP.md`
- Science (Biology/Chemistry/Physics): `docs/system/SCIENCE_MODULE_BLUEPRINT.md` + `docs/canonical/biology/`
- Sociology: `docs/canonical/sociology/`
- English: `docs/content/english/`

**Workflow or process question** → `docs/system/DEVELOPMENT_WORKFLOW.md`.

**Old decision or rationale** → search `docs/archive/`, but archive is not authoritative.

---

## docs/canonical/ vs docs/content/ — why both exist

These two folders serve the same purpose (canonical episode content and architecture files) but were created at different times:

- `docs/content/` — the original location, used by History and English Literature. The History workflow adapter explicitly requires files to stay here. Do not move History or English content to `docs/canonical/`.
- `docs/canonical/` — the newer convention, used by Biology and Sociology.

The `canonical-topic` skill and its adapters know which location to use for each subject. New subjects default to `docs/canonical/<subject>/`. Existing History and English content stays in `docs/content/`.

---

## docs/archive/ — what is in there and why

The archive holds historical artefacts that are no longer authoritative but are worth keeping for reference:

| Subfolder | Contents |
|-----------|---------|
| `archive/superpowers/specs/` | Dated one-off design specs and ADRs (2026-06 series) |
| `archive/superpowers/plans/` | Dated one-off implementation plans (2026-06 series) |
| `archive/old-learning-architecture/` | `Module-Blueprint-Library.md` and `Standard_Module_Spine.md` — superseded by `CLAUDE.md` module architecture rules |
| `archive/one-off-fixes/` | `DESIGN_CONSISTENCY_FIX.md` and `DESIGN_TOKENS_QUICK_GUIDE.md` — historical session artefacts |
| `archive/superseded-workflows/` | `RISE_WORKFLOW_MAP.md` — replaced by per-lane files under `docs/system/workflows/` |

**Archive rules:**
- Archive is searchable history, not active guidance.
- When any archived file conflicts with `docs/system/` or `CLAUDE.md`, the active system doc wins.
- Do not promote archive content into canonical rules without explicit user review.
- Do not add new files to `docs/archive/` unless they are genuinely historical — new process artefacts go to `docs/superpowers/specs/` or `docs/superpowers/plans/`.
