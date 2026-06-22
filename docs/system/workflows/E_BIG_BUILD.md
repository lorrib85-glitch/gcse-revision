# Workflow E — Big Build / New Module / New Feature

**Authority:** `CLAUDE.md` > this file > session instructions.

## Purpose

Building something genuinely new — a new History episode, new subject
module, new exam mode, new reusable component family, new app-level flow,
or a new architecture pattern.

## When to use

New History episode, new subject module, new exam mode, new reusable
component family, new app-level flow, new architecture pattern.

## Required artefacts

- User story (full success-outcome framing — phase 3)
- Discussion summary: confirmed facts, open decisions, out of scope (phase 4)
- Plan (`/gsd-plan-phase` output — phase 6)
- Scope lock (signed off before any implementation — phase 7)

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
   - Read existing canonical and architecture docs first — grep for the
     relevant section; do not bulk-read. Run `/canonical-topic` only if
     canonical or architecture docs are missing, stale, incomplete, or
     explicitly requested. Do not run it by default.
   - `/frontend-design` if a new visual surface is introduced.
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
   Verification plan:
   ```
8. **Execute phase** — `superpowers:subagent-driven-development` →
   `/gsd-execute-phase`.
   Good subagent tasks: metadata, module content, question bank, tests, docs.
   Bad subagent tasks: same file, same component, visual polish decisions.
9. **Review** — `/ponytail-review`; `/code-review`; `/frontend-design` if
   UI changed.
10. **Verify** — see below.
11. **Pause / handoff** — `/gsd-pause-work` with state summary.
12. **Commit** — directly to `main`.

## Allowed skills

`superpowers:brainstorming`, `superpowers:writing-plans`,
`superpowers:subagent-driven-development`, `superpowers:executing-plans`,
`superpowers:verification-before-completion`,
`/gsd-discuss-phase`, `/gsd-plan-phase`, `/gsd-execute-phase`,
`/gsd-resume-work`, `/gsd-pause-work`,
`/canonical-topic` (only when docs are missing/stale/requested),
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

## Verification

- `vite build` passes
- `vitest run tests/architecture` — always; module metadata changes are
  frequent in big builds
- `vitest run tests/unit` if logic files were touched
- `vitest` (full, Playwright/Chromium) if new component stories were added
- Module opens, progresses, and completes — full flow walkthrough
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
