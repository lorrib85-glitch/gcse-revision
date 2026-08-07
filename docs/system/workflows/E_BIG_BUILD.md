# Workflow E — Big Build / New Chapter or Parent Module / New Feature

**Authority:** `CLAUDE.md` > this file > session instructions.

## Purpose

Building something genuinely new — a new learner-facing Chapter, a new parent
Module, a new exam mode, new reusable component family, new app-level flow,
or a new architecture pattern.

## When to use

New Chapter, new parent Module, new exam mode, new reusable component family,
new app-level flow or new architecture pattern.

## Required artefacts

- User story (full success-outcome framing — phase 3)
- Discussion summary: confirmed facts, open decisions, out of scope (phase 4)
- Plan (`/gsd-plan-phase` output — phase 6)
- Scope lock (signed off before any implementation — phase 7)
- For a new Chapter or materially rebuilt Chapter: the readiness evidence
  required by `docs/system/CHAPTER_READINESS_AUDIT.md`

## Phases

1. **Triage** — `/gcse-triage` → Lane E.
2. **Resume project state** — `/gsd-resume-work` if a previous session
   started this work.
3. **User story** — full success-outcome framing:
   ```
   As a [GCSE student / Lorri], I want [outcome] so that [exam impact].
   ```
4. **Discussion phase** — `superpowers:brainstorming` → `/gsd-discuss-phase`:
   ```
   Confirmed facts:
   Open decisions:
   Out of scope:
   User decisions required:
   ```
   Do not proceed to planning until all open decisions are resolved.
5. **Source / canonical check:**
   - Read `.planning/codebase/ARCHITECTURE.md`, `CONVENTIONS.md`,
     `STRUCTURE.md` and `.planning/intel/decisions.md`, `constraints.md`
     first — these already synthesise architecture context. Then check
     `CLAUDE.md`, `docs/system/`, `docs/components/` only for anything not
     already covered, or to confirm a specific detail — grep for the
     relevant section; do not bulk-read.
   - **Staleness rule:** if the `.planning/codebase/` map contradicts the
     current code (moved file, renamed component, changed pattern), don't
     silently trust either source — flag the contradiction to the user and
     re-run `/gsd-map-codebase` (sanctioned in Lane F) to refresh the map
     before proceeding.
   - Canonical Chapter files may live under either `docs/content/<subject>/`
     or `docs/canonical/<subject>/`. Resolve the active matching series and
     Chapter before planning content; do not assume one root across subjects.
   - Run `/canonical-topic` only if canonical or architecture docs are
     missing, stale, incomplete, ambiguous across roots, or explicitly
     requested. Do not run it by default.
   - `/frontend-design` if a new visual surface is introduced.
   - **Content builds:** read `docs/system/PATTERN_GOVERNANCE.md` and the
     relevant `component-contracts/`. Every screen resolves through the
     taxonomy chain (learning objective → intent → approved component →
     approved composition route → contract) and has one primary intent
     statable in a sentence; record each screen's composition selection per
     `CONTENT_BUILD_TEMPLATE.md` → "Composition selection" (teaching screens
     default to `TeachScreenShell`; Route B/C needs contract-granted
     full-screen ownership). A new full-screen/screen-owning component
     requires an approved contract declaring its composition ownership before
     it may own layout. Reserve images/diagrams with `MediaPlaceholder` + a
     visual-assets manifest entry, never generate imagery.
   - **New or materially rebuilt Chapters:** also read
     `docs/system/CHAPTER_READINESS_AUDIT.md`. When the Chapter authors Topics,
     read `docs/system/CHAPTER_TOPICS.md`. These documents remain the single
     readiness and Topic authorities; this workflow only routes to them.
6. **Plan phase** — `superpowers:writing-plans` → `/gsd-plan-phase`.
   Only after discussion decisions are closed.
7. **Scope lock** — required before any implementation:
   ```
   Files to edit:
   Files forbidden:
   Components allowed (existing):
   New components: yes / no — if yes, name them + Component Registry entries
   New stories required: yes / no
   Assets required: yes / no
   Chapter readiness audit required: yes / no — if yes, name why it is triggered
   Verification plan:
   ```
8. **Execute phase** — `superpowers:subagent-driven-development` →
   `/gsd-execute-phase`. **New Chapter content is built with `/content-create`**,
   which resolves every screen through the build chain (learning objective →
   primary intent → learner need → approved component → contract → named gold
   example → content structure → render acceptance criteria) and runs the
   composed render pass; the story spine must already exist in the Chapter's
   canonical architecture file (run `/canonical-topic` if absent). For a new
   or materially rebuilt Chapter, `content-create` also produces the Stage-B
   Chapter readiness report before describing the build as implemented.
   Good subagent tasks: Chapter metadata, Chapter content, question bank, tests,
   docs. Bad subagent tasks: same file, same component, visual polish decisions.
9. **Review** — `/ponytail-review`; `/code-review`; `/frontend-design` if
   UI changed. **Pattern-governance review** (`PATTERN_GOVERNANCE.md`) for
   every screen: state its one primary intent in a sentence (fail and
   split/cut if you can't); confirm the component advances the learning
   objective; check the intent→component map and contracts; run the
   **render pass** (screenshot at 390px) against the named gold example
   (`GOLD_SCREEN_REGISTER.md`) and answer the strengthened visual verdict in
   writing — source + tests alone do not pass. An **independent
   `content-review`** re-audits the built scope (against the gold example),
   independently re-runs the required Chapter readiness audit, and must clear
   every in-scope Fail before the build is treated as approved; "implemented"
   is never "approved".
10. **Verify** — see below.
11. **Pause / handoff** — `/gsd-pause-work` with state summary.
12. **Commit** — directly to `main`.

## Allowed skills

`superpowers:brainstorming`, `superpowers:writing-plans`,
`superpowers:subagent-driven-development`, `superpowers:executing-plans`,
`superpowers:verification-before-completion`,
`/content-create` (build new Chapter content), `/content-review` (diagnose +
independent post-build approval),
`/gsd-discuss-phase`, `/gsd-plan-phase`, `/gsd-execute-phase`,
`/gsd-resume-work`, `/gsd-pause-work`,
`/canonical-topic` (only when docs are missing/stale/ambiguous/requested),
`/frontend-design`, `/ponytail-review`, `/code-review`, `/verify`

## Forbidden

Starting implementation without a completed scope lock. Running
`/gsd-execute-phase` without explicit user request. Bulk-reading canonical
files.

## Stop points

- Open decisions remain after discussion phase → do not plan
- Plan not complete → do not execute
- New component with no Component Registry justification → stop and check
- `vitest run tests/architecture` fails → do not commit; fix first
- A required Chapter readiness audit has an unresolved in-scope Fail → do not
  describe the Chapter as implemented or approved

## Verification

- **`pnpm lab:generate`, and commit the result**, whenever the build added,
  removed or moved Chapter screens or blocks, or changed a record's `authoring`
  entries — the Component Lab projection carries both, and `pnpm lab:check`
  fails on drift. A new authoring type also needs a Lab adapter in the same
  change: the bidirectional coverage guard fails an active entry with no
  selection.
- `vite build` passes
- `vitest run tests/architecture` — always; Chapter or parent-Module metadata
  changes are frequent in big builds
- `vitest run tests/unit` if logic files were touched
- `vitest` (full, Playwright/Chromium) if new component stories were added
- Chapter opens, progresses, and completes — full flow walkthrough
- New/materially rebuilt Chapters have a Stage-B readiness report and an
  independently verified Stage-C result with no unresolved in-scope Fail
- `superpowers:verification-before-completion`
- `/verify`

## Story obligation

Every new reusable component (used in 2+ places or designed to be) requires
a `.stories.jsx` file alongside it so the Playwright suite can verify it.

## Token cost warning

Canonical topic files and architecture docs are large. Before reading:
- `Grep` for specific sections using targeted keywords
- Read only the matched range plus ~10–15 lines of context
- Never bulk-read a canonical file to "get familiar" with it
