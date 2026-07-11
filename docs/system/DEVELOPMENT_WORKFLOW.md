# Development Workflow

**Version:** v1
**Scope:** How all development work in this codebase is approached — from a one-line copy tweak to a brand-new product surface.

This document is the operational counterpart to
`docs/archive/superpowers/specs/2026-06-12-development-workflow-design.md`,
which records the rationale and decisions behind it. `CLAUDE.md`,
`docs/system/`, and `docs/components/` remain the source of truth for the
product itself. This file, `.planning/`, and `docs/superpowers/specs/` are
process artefacts — they describe how work happens, not what the product is,
and must never become competing documentation.

`docs/archive/` is searchable history only. Archived files are not
authoritative. When any archived file conflicts with `docs/system/` or
`CLAUDE.md`, the active system docs win. One-off specs and plans in
`docs/archive/superpowers/` must not be promoted into canonical rules unless
explicitly reviewed and merged into a system doc by the user.

## Guiding principle

The workflow exists to improve product quality and consistency, not to
force unnecessary process. When a lighter approach achieves the same
outcome without increasing long-term maintenance cost, prefer the lighter
approach.

## Core rule

All work follows one of three named pipelines:

- **Minor Edit** — single-file, single-concept change with no new pattern
  or API surface introduced.
- **Standard Change Pipeline** — for improving, refactoring, or extending
  existing screens/components.
- **Big Build Pipeline** — for new product areas, new flows, new
  architecture, or anything that creates new reusable patterns.

## Session continuity rule

Context compaction, session resumption, or runtime instructions to
"continue without asking further questions" do not exempt any pipeline
step or skill invocation. These instructions mean: don't re-litigate
decisions already settled earlier in the conversation — they do not
authorise skipping brainstorming, planning, or other pipeline skills for
new substantial work.

Before resuming or starting substantial work in a continued session,
explicitly state which pipeline and skill you are using (e.g. "Standard
Change Pipeline → brainstorming") *before* doing exploratory research or
posing questions directly via `AskUserQuestion`. If a half-formed plan
carried over from before compaction still involves substantial new work,
route it through the normal pipeline rather than executing it directly.

## Reuse before create (non-negotiable)

Before creating any new reusable component, design token, architecture
pattern, or interaction pattern, search existing canonical documentation
(`docs/components/COMPONENT_REGISTRY.md`, `docs/system/`) and the codebase
for an existing solution. Extend before inventing. This applies to both
pipelines.

This is enforced mechanically, not just by intent: a `PostToolUse` hook
(`.claude/hooks/new-component-check.sh`) nudges on every brand-new
`src/components/**` file to confirm the Component Registry was checked.
When extracting or splitting an existing file, don't carry forward an
existing violation (e.g. direct `localStorage` access, a hardcoded value)
into the new files unchanged — fix it during the extraction, or note
explicitly why it's deferred.

## File hygiene

Component and feature-orchestration files (`src/components/**`,
`src/features/**`) should stay under ~1200 lines. Past that, evaluate
whether the file is doing too much and should be decomposed — this is
what happened to `src/modules/history.js` (7318 lines, split into
per-episode files) and has not yet happened to `ModulePlayer.jsx`
(2400+ lines, flagged as a fragile area in `.planning/codebase/CONCERNS.md`).

This threshold does not apply to content files (`src/content/**`,
`src/modules/<subject>.js`, `src/data/*.js`) — their size tracks
curriculum content volume, not code complexity.

A `PostToolUse` hook (`.claude/hooks/component-size-check.sh`) nudges
when an in-scope file is both over the threshold and just grew from its
committed (`HEAD`) size — so it flags active bloat without nagging on
every touch to an already-oversized file that isn't growing further.

## Debugging discipline

Non-trivial bugs should use a structured debugging methodology before
implementation — form a hypothesis, gather evidence, and confirm the root
cause before changing code. Avoid speculative fixes or repeated
trial-and-error changes.

## Decision capture rule

Whenever implementation introduces a new reusable component, a new
architectural pattern, a new design rule, a new workflow rule, or a new
educational pattern, explicitly decide whether it is intended to become
part of the permanent system:

- **If yes** — update the canonical documentation (`CLAUDE.md`,
  `docs/system/`, `docs/components/`) appropriately, as part of each
  pipeline's "Documentation update" step.
- **If no** — treat it as a local implementation detail only. Do not
  elevate it into permanent documentation or constitutional rules.

This keeps canonical docs accurate over time and prevents documentation
drift or unnecessary expansion of the constitutional documents — only
genuinely reusable or system-level decisions become part of the permanent
architecture.

Only capture rules likely to be forgotten, disputed, or applied
inconsistently. Simple, self-evidently correct practices don't need
documenting.

## Pipeline 0 — Minor Edit

Use for single-file, single-concept changes where no new prop, API,
reusable pattern, or component behaviour is introduced. Examples: fix a
CSS value, correct a typo, update one data field, adjust one colour token.

**Does NOT qualify if:** the change touches a locked component, introduces
a new prop or API surface, affects more than one concept, or could have
side effects across screens. When in doubt, use Standard Change Pipeline.

1. Name it — state "Minor Edit" before touching anything
2. Make the change
3. Run `/ponytail-review` on the diff
4. Build passes (`./node_modules/.bin/vite build`)
5. Commit + push to `main`

## Pipeline 1 — Standard Change Pipeline

Use for existing-surface work.

1. Clarify intent — brainstorm or discuss as needed
2. Specification — only when the change is substantial, introduces a new
   pattern, or benefits from documented planning. Minor bug fixes and
   straightforward UI tweaks do not require one. When needed, written to
   `docs/superpowers/specs/`.
3. Planning
4. Execution — implement the change; use subagents where helpful; run
   `/ponytail-review` on the diff before moving on
5. Documentation update — only if the change affects reusable components,
   design tokens, routing, architecture, product behaviour, or workflow
   rules
6. Review — perform code review and incorporate findings
7. Verification — build (`./node_modules/.bin/vite build`) passes; if a
   Storybook story exists for the changed component, run `pnpm test:storybook`
   to confirm it mounts and renders without error; then exercise the change
   in the running app via `/verify`
8. Confirm working tree status — commit + push to `main`

*Normally implemented via Superpowers: `brainstorming`, `writing-plans`,
`executing-plans`, code review skills, `verification-before-completion`.*

## Pipeline 2 — Big Build Pipeline

Use for new surface area.

**One-time bootstrap:** `.planning/` does not exist yet. The first Big
Build ever must bootstrap it before step 1. Every Big Build after that
starts directly at step 1.

1. Specification
2. Discussion
3. Architecture mapping — check `CLAUDE.md`, `docs/system/`,
   `docs/components/`; apply the reuse-before-create rule before proposing
   anything new. **For History modules:** consult the canonical reference
   file for the series in `docs/content/history/` (generated by the
   `canonical-topic` skill) and update it if the module or series
   architecture changes. The canonical file must already exist before this
   step — generating it is a prerequisite done before the Big Build begins,
   not part of this step.
4. Planning
5. Execution — run `/ponytail-review` on the diff before moving on
6. Documentation update — write to existing canonical docs; never create a
   parallel documentation tree
7. Review — code review, and UI review where visual behaviour changed
8. Verification — build (`./node_modules/.bin/vite build`) passes; run
   `pnpm test:storybook` to confirm all stories mount and render without
   error; exercise the change in the running app via `/verify` to confirm
   real behaviour — not static inspection alone
9. Confirm working tree status — commit + push to `main`

*Normally implemented via the corresponding GSD skills (e.g. spec-phase,
discuss-phase, map-codebase, plan-phase, execute-phase, docs-update,
code-review/ui-review, verify-work). Bootstrap via the GSD project-init
skill once, then the milestone skill for each Big Build thereafter.*

**Excluded GSD skills:** `gsd-pr-branch`, `gsd-ship`, `gsd-workspace`,
`gsd-workstreams`, and `gsd-inbox` are not part of this pipeline and should
not be invoked. They assume team, PR-review, and multi-workspace workflows
that don't apply to this solo, main-only project. `gsd-review` remains
available and is not excluded.

## Routing rule

- Use **Standard Change Pipeline** when the task changes an existing
  component, screen, style, copy pattern, or behaviour.
- Use **Big Build Pipeline** when the task creates a new flow, new module
  type, new route, new reusable component family, new architecture pattern,
  or anything likely to affect future builds.
- When uncertain, default to **Big Build Pipeline** for planning, then
  downshift to **Standard Change Pipeline** only if architecture mapping
  proves it is existing-surface work.

## Branching policy

All work commits directly to `main` and is pushed immediately — no feature
branches, no PRs, unless the user explicitly asks for one in a given
session.

GSD's `git.branching_strategy` setting already defaults to `"none"`
("Commit directly to current branch") when no `.planning/config.json`
exists, which matches this policy with no extra configuration. If a future
`.planning/config.json` is created (e.g. during the first Big Build
bootstrap) and a setup prompt asks about branching strategy, choose `"none"`
to keep this policy intact.

## Continuous Integration

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push
and pull request to `main`, as two jobs. (pnpm is the repository's package
manager — see `package.json` `"packageManager"`; there is a single
`pnpm-lock.yaml`.)

- **`verify`** — `pnpm install --frozen-lockfile`, then each gate in
  `pnpm verify` as its own step: `pnpm lint`, `pnpm test:architecture`,
  `pnpm test:unit`, `pnpm test:storybook`, `pnpm build`. This is the same
  command set as the local `pnpm verify` — see `README`/`AUTH_SETUP.md` and
  the authoritative command table below.
- **`firestore-rules`** — `pnpm install --frozen-lockfile`, then
  `pnpm test:rules` against the Firestore emulator (Java pinned via
  `actions/setup-java`, emulator jar cached). Runs on every push/PR; never
  touches live Firebase, needs no production credentials. See
  `docs/system/AUTH_SETUP.md` "Firestore security-rule tests".

Running `pnpm verify` locally before pushing keeps `main` from failing the
`verify` job; running `pnpm test:rules` locally after any `firestore.rules`
edit keeps it from failing the `firestore-rules` job.

## Context Loading Policy

Load only:

- `CLAUDE.md`
- `DEVELOPMENT_WORKFLOW.md`
- directly relevant canonical docs
- files being modified

**Big Build only** (Pipeline 2, architecture mapping step): also load
`.planning/codebase/ARCHITECTURE.md`, `CONVENTIONS.md`, `STRUCTURE.md` and
`.planning/intel/decisions.md`, `constraints.md` before grepping
`docs/system/` — these already synthesise the architecture context most
Big Builds would otherwise re-derive from scratch. See `E_BIG_BUILD.md`
step 3 for the staleness rule governing this.

Do not read large documentation trees or perform architecture-wide reviews
unless required by the selected pipeline.

Minimise context usage while preserving correctness.

## Non-negotiable completion checklist

Before marking any build complete, confirm:

- Implementation completed
- Specification/documentation written where the triggers above require it
- No new undocumented reusable pattern introduced (reuse-before-create
  honoured)
- Canonical docs updated where needed (decision capture rule applied)
- Code review completed
- UI review completed where visual behaviour changed
- Build passed (`./node_modules/.bin/vite build`)
- Vitest passed (`pnpm test:storybook`) — Standard Change: if a story exists
  for the changed component; Big Build: always
- Implementation verified in the running app via `/verify` — Standard
  Change and Big Build only; Minor Edit is build-only
- Working tree checked (committed + pushed to `main`)

No task is complete at implementation alone.

## Rationale

See `docs/archive/superpowers/specs/2026-06-12-development-workflow-design.md`
for the full rationale and decisions behind this workflow.
