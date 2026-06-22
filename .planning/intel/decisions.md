# Synthesized Decisions

Extracted from all ADR-type classifications. Each entry represents a discrete architectural decision with provenance.

---

## DEC-01 — Development workflow: two named pipelines (main-only)

source: /home/user/gcse-revision/docs/superpowers/specs/2026-06-12-development-workflow-design.md
status: LOCKED (ADR confidence: high, locked: true)
scope: development workflow, branching policy, Standard Change Pipeline, Big Build Pipeline, Superpowers plugin, GSD-core

### Decision statement

All code changes follow exactly one of three named pipelines:

- Minor Edit — single-file, single-concept, no new pattern or API. Steps: name it → change → /ponytail-review → build → commit.
- Standard Change Pipeline — improving/refactoring/extending existing screens or components.
- Big Build Pipeline — new product areas, new flows, new architecture, new reusable patterns.

Branching policy is main-only. No feature branches, no PRs unless the user explicitly requests one. GSD is configured with git.branching_strategy: "none". The `gsd-pr-branch`, `gsd-ship`, `gsd-workspace`, `gsd-workstreams`, and `gsd-inbox` skills are excluded from this project.

The guiding principle: workflow exists to improve quality and consistency, not to force unnecessary process — prefer the lighter approach when it achieves the same outcome.

### Consequences

- Every session must name the pipeline before starting work.
- Context compaction and "resume directly" instructions do not skip pipeline steps.
- Process artefacts (.planning/, docs/superpowers/specs/) must never become competing product documentation.
- Canonical product documentation lives only in CLAUDE.md, docs/system/, docs/components/.

### Completion checklist (non-negotiable before marking any build done)

Implementation completed; specification/documentation written where triggers require; no new undocumented reusable pattern introduced; canonical docs updated; code review completed; UI review completed where visual changed; build passed (./node_modules/.bin/vite build); Vitest passed (npx vitest run) per pipeline tier; implementation verified in running app via /verify; working tree checked (committed + pushed to main).

---

## DEC-02 — BackButton: single locked constitutional component for all back-navigation

source: /home/user/gcse-revision/docs/superpowers/specs/2026-06-12-back-button-component-design.md
status: Implemented (ADR confidence: high, locked: false per classifier — treated as Accepted-equivalent)
scope: BackButton, back-navigation, src/components/core/BackButton.jsx, ModuleToolbar, LearningHeader

### Decision statement

`src/components/core/BackButton.jsx` is the only back-navigation button implementation allowed anywhere in the app.

Visual contract (fixed, not overridable via props):
- Touch target: 40×40 (revised from 44×44 on 2026-06-12 per user request)
- Fill: rgba(255,255,255,0.05)
- Border: 1px, rgba(255,255,255,0.03) (revised from 0.06 on same day)
- Radius: RADII.pill (fully rounded)
- Icon: left chevron only — no "Back" text label
- Hover/press: identical opacity 0.6 via .rise-back-button:hover, .rise-back-button:active in src/styles.css

API: `<BackButton onClick={onBack} />` and `<BackButton onClick={onBack} style={{ position, top, left, zIndex }} />`. The style prop is layout-only — never used to change visual identity.

All 28 back-navigation call sites across the codebase were migrated in 2026-06-12. ModuleToolbar was discovered to be dead code; LearningHeader is the live implementation, both were migrated.

### Consequences

- No inline back-button implementations (chevron SVG, ← character, pill with "Back" label) are allowed anywhere.
- Every new screen requiring back-navigation must use `<BackButton />`.
- LOCKED_COMPONENTS.md, COMPONENT_REGISTRY.md, and COMPONENT_AUTHORING_RULES.md all reference this rule.
- CONFLICT NOTE: This decision sets 40×40 touch target; BUTTON_RADII_SYSTEM.md SPEC asserts 44×44px minimum tap target. ADR takes precedence — see INGEST-CONFLICTS.md [INFO] entry.

---

## DEC-03 — Standard Module Spine (SUPERSEDED)

source: /home/user/gcse-revision/docs/04 Learning Architecture/Standard_Module_Spine.md
status: SUPERSEDED — retained for historical reference only
scope: module structure, learning flow (superseded by HISTORY_MODULE_ARCHITECTURE.md and SCIENCE_MODULE_BLUEPRINT.md)

### Decision statement

The 15-role sequential module spine (Hook → Outcomes → Recall Warm-up → Learning Blocks 1-4 with interleaved recall → Exam Tips → Face the Examiner → Chapter Complete) was the prior authority for module structure. It is now explicitly superseded.

CLAUDE.md (History Module Architecture and Science Module Blueprint) is the current authority. Do not use this document for new module builds.

### Consequences

- This ADR's structural rules are no longer binding.
- Where this document conflicts with HISTORY_MODULE_ARCHITECTURE.md or SCIENCE_MODULE_BLUEPRINT.md, the latter two win.
- The document is retained only as historical provenance.
