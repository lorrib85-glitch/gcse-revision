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

### Pipeline 1 — Standard Change Pipeline

Use for existing-surface work.

1. Brainstorm / clarify intent
2. Create or update spec in `docs/superpowers/specs/`
3. Use `writing-plans`
4. Implement change
5. Use subagents where helpful
6. Update canonical docs if the change affects: reusable components, design
   tokens, routing, architecture, product behaviour, or workflow rules
7. Request code review (`requesting-code-review`)
8. Receive and apply code review (`receiving-code-review`)
9. Build (`./node_modules/.bin/vite build`)
10. Verify in Playwright
11. Confirm working tree status (commit + push to `main`)

### Pipeline 2 — Big Build Pipeline

Use for new surface area.

**One-time bootstrap:** `.planning/` does not exist yet. The *first* Big
Build ever must run `gsd-new-project` once to bootstrap it. Every Big Build
after that starts directly at step 1.

1. `gsd-new-milestone`
2. `gsd-spec-phase`
3. `gsd-discuss-phase`
4. `gsd-map-codebase` — check existing `CLAUDE.md`, `docs/system/`,
   `docs/components/`; identify reusable components before inventing new ones
5. `gsd-plan-phase`
6. `gsd-execute-phase`
7. `gsd-docs-update` — write to existing canonical docs; do not create a
   parallel documentation tree
8. `gsd-code-review`
9. `gsd-ui-review`
10. `gsd-verify-work`
11. Build (`./node_modules/.bin/vite build`)
12. Playwright verification
13. Confirm working tree status (commit + push to `main`)

### Routing rule

- Use **Standard Change Pipeline** when the task changes an existing
  component, screen, style, copy pattern, or behaviour.
- Use **Big Build Pipeline** when the task creates a new flow, new module
  type, new route, new reusable component family, new architecture pattern,
  or anything likely to affect future builds.
- When uncertain, default to **Big Build Pipeline** for planning, then
  downshift to **Standard Change Pipeline** only if the mapping phase
  (`gsd-map-codebase`) proves it is existing-surface work.

### Branching policy

GSD is configured for **main-only operation**, matching the existing
Superpowers/CLAUDE.md habit:

- `gsd-config`/`gsd-settings` disables per-phase branches and automatic PR
  creation, so `gsd-execute-phase` and related skills commit straight to
  `main`.
- No pipeline — Standard or Big Build — creates a feature branch or PR
  unless the user explicitly asks for one in a given session.

### Document placement

- **`docs/system/DEVELOPMENT_WORKFLOW.md`** (new) — the operational doc
  containing both pipelines, the routing rule, and the completion checklist.
  This is the doc consulted every session before starting work.
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

- `gsd-config`/`gsd-settings`: set branching/PR behaviour to main-only (no
  per-phase branches, no automatic PR creation).
- `gsd-surface`: hide skills oriented at teams/PRs/cloud-offload that don't
  fit a solo, main-only project. Candidates: `gsd-pr-branch`, `gsd-ship`,
  `gsd-workspace`, `gsd-workstreams`, `gsd-inbox`, `gsd-review`,
  `gsd-ultraplan-phase`. Exact mechanism confirmed against `gsd-surface`'s own
  documentation during implementation.

### Non-negotiable completion checklist

Before marking any build complete, confirm:

- Implementation completed
- Canonical docs updated where needed
- No new undocumented reusable pattern introduced
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
- Global GSD config: `gsd-config`/`gsd-settings` (main-only), `gsd-surface`
  (curated skill list) — outside the repo, in `~/.claude`

## Verification

- New doc renders correctly; cross-references from `CLAUDE.md` and
  `00_SYSTEM_INDEX.md` resolve to `docs/system/DEVELOPMENT_WORKFLOW.md`.
- `gsd-config`/`gsd-surface` changes confirmed via their own status/list
  output.
- No change to the existing build/test process —
  `./node_modules/.bin/vite build` remains the build check; Playwright
  remains the visual spot-check tool.
