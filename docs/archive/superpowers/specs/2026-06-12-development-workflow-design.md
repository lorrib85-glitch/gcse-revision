# Development workflow — two pipelines (Superpowers + GSD)

**Date:** 2026-06-12
**Status:** Approved — pending implementation

## Problem

Two general-purpose toolkits are now available: the **Superpowers** plugin
(brainstorming, writing-plans, executing-plans, code review, debugging, etc.)
and **GSD-core** (67 skills for milestone/phase-based project management,
freshly installed globally but not yet configured for this repo).

Without an explicit routing rule, every new request risks an ad-hoc choice
between the two, inconsistent documentation updates, and skipped
review/verification steps.

There is also a direct conflict: `CLAUDE.md` mandates "always commit directly
to `main`, never create feature branches", while GSD's defaults assume
per-phase branches and PR creation (it ships a `gsd-pr-branch` skill and a
`gsd-ship` skill).

## Decision

### Guiding principle

The workflow exists to improve product quality and consistency, not to force
unnecessary process. When a lighter approach achieves the same outcome
without increasing long-term maintenance cost, prefer the lighter approach.

### Core rule

All work follows one of two named pipelines:

- **Standard Change Pipeline** — for improving, refactoring, or extending
  existing screens/components.
- **Big Build Pipeline** — for new product areas, new flows, new
  architecture, or anything that creates new reusable patterns.

`CLAUDE.md`, `docs/system/`, and `docs/components/` remain the source of
truth for the product. `.planning/`, `docs/superpowers/specs/`, and GSD phase
files are **process artefacts only** — they must never become competing
documentation.

### Reuse before create (non-negotiable)

Before creating any new reusable component, design token, architecture
pattern, or interaction pattern, search existing canonical documentation
(`docs/components/COMPONENT_REGISTRY.md`, `docs/system/`) and the codebase
for an existing solution. Extend before inventing. This applies to both
pipelines.

### Pipeline 1 — Standard Change Pipeline

Use for existing-surface work.

1. Clarify intent — brainstorm or discuss as needed
2. Specification — only when the change is substantial, introduces a new
   pattern, or benefits from documented planning. Minor bug fixes and
   straightforward UI tweaks do not require one. When needed, written to
   `docs/superpowers/specs/`.
3. Planning
4. Execution — implement the change; use subagents where helpful
5. Documentation update — only if the change affects reusable components,
   design tokens, routing, architecture, product behaviour, or workflow rules
6. Review — perform code review and incorporate findings
7. Verification — build (`./node_modules/.bin/vite build`) and Playwright
   check
8. Confirm working tree status — commit + push to `main`

*Normally implemented via Superpowers: `brainstorming`, `writing-plans`,
`executing-plans`, code review skills, `verification-before-completion`.*

### Pipeline 2 — Big Build Pipeline

Use for new surface area.

**One-time bootstrap:** `.planning/` does not exist yet. The first Big Build
ever must bootstrap it before step 1. Every Big Build after that starts
directly at step 1.

1. Specification
2. Discussion
3. Architecture mapping — check `CLAUDE.md`, `docs/system/`,
   `docs/components/`; apply the reuse-before-create rule before proposing
   anything new
4. Planning
5. Execution
6. Documentation update — write to existing canonical docs; never create a
   parallel documentation tree
7. Review — code review, and UI review where visual behaviour changed
8. Verification
9. Confirm working tree status — commit + push to `main`

*Normally implemented via the corresponding GSD skills (e.g. spec-phase,
discuss-phase, map-codebase, plan-phase, execute-phase, docs-update,
code-review/ui-review, verify-work). Bootstrap via the GSD project-init skill
once, then the milestone skill for each Big Build thereafter.*

### Routing rule

- Use **Standard Change Pipeline** when the task changes an existing
  component, screen, style, copy pattern, or behaviour.
- Use **Big Build Pipeline** when the task creates a new flow, new module
  type, new route, new reusable component family, new architecture pattern,
  or anything likely to affect future builds.
- When uncertain, default to **Big Build Pipeline** for planning, then
  downshift to **Standard Change Pipeline** only if architecture mapping
  proves it is existing-surface work.

### Branching policy

GSD is configured for **main-only operation**, matching the existing
Superpowers/CLAUDE.md habit:

- GSD's project/settings configuration disables per-phase branches and
  automatic PR creation, so execution skills commit straight to `main`.
- No pipeline — Standard or Big Build — creates a feature branch or PR
  unless the user explicitly asks for one in a given session.

### Context Loading Policy

Load only:

- `CLAUDE.md`
- `DEVELOPMENT_WORKFLOW.md`
- directly relevant canonical docs
- files being modified

Do not read large documentation trees or perform architecture-wide reviews
unless required by the selected pipeline.

Minimise context usage while preserving correctness.

### Document placement

- **`docs/system/DEVELOPMENT_WORKFLOW.md`** (new) — the operational doc
  containing both pipelines, the routing rule, the reuse-before-create rule,
  the context loading policy, and the completion checklist. This is the doc
  consulted every session before starting work.
- **`CLAUDE.md`** — new short section near the top (before "Design System
  Documentation"), since this governs all work, not just UI changes. Points
  to `docs/system/DEVELOPMENT_WORKFLOW.md`.
- **`docs/system/00_SYSTEM_INDEX.md`** — add a process cross-reference
  alongside the existing design-authority order.
- **This file** (`docs/superpowers/specs/2026-06-12-development-workflow-design.md`)
  — records the rationale and decisions behind the above. A process
  artefact; does not compete with `DEVELOPMENT_WORKFLOW.md`.

### One-time GSD setup

Applied once during implementation of this design:

- GSD project/settings configuration: set branching/PR behaviour to
  main-only (no per-phase branches, no automatic PR creation).
- Skill surfacing: hide skills oriented at teams/PRs/cloud-offload that don't
  fit a solo, main-only project — `gsd-pr-branch`, `gsd-ship`,
  `gsd-workspace`, `gsd-workstreams`, `gsd-inbox`. Leave `gsd-review` (and
  anything else not clearly team/PR/workspace-oriented) visible until its
  function is better understood. Exact mechanism confirmed against the
  skill-surfacing tool's own documentation during implementation.

### Non-negotiable completion checklist

Before marking any build complete, confirm:

- Implementation completed
- Specification/documentation written where the triggers above require it
- No new undocumented reusable pattern introduced (reuse-before-create
  honoured)
- Canonical docs updated where needed
- Code review completed
- UI review completed where visual behaviour changed
- Build passed
- Playwright verification completed
- Working tree checked (committed + pushed to `main`)

No task is complete at implementation alone.

## Files touched (implementation)

- New: `docs/system/DEVELOPMENT_WORKFLOW.md`
- Edit: `CLAUDE.md` (new short "Development Workflow" section)
- Edit: `docs/system/00_SYSTEM_INDEX.md` (cross-reference)
- Global GSD config: project/settings (main-only), skill surfacing (curated
  skill list) — outside the repo, in `~/.claude`

## Verification

- New doc renders correctly; cross-references from `CLAUDE.md` and
  `00_SYSTEM_INDEX.md` resolve to `docs/system/DEVELOPMENT_WORKFLOW.md`.
- GSD config/surfacing changes confirmed via their own status/list output.
- No change to the existing build/test process —
  `./node_modules/.bin/vite build` remains the build check; Playwright
  remains the visual spot-check tool.
