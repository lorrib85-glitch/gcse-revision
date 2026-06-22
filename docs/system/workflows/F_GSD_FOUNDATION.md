# Workflow F — GSD Foundation / Documentation Tidy

**Authority:** `CLAUDE.md` > this file > session instructions.  
**Runtime:** This lane is inlined in `.claude/skills/gcse-triage/SKILL.md`.
Do not read this file at runtime — it is the full reference only.

## Purpose

Ingesting docs, mapping the codebase, organising `.planning/`, tidying
workflow docs. Process artefacts only — no app source changes.

## When to use

`.planning/` reorganisation, GSD setup commands, process doc tidy. If the
task touches `CLAUDE.md` or workflow rules → re-triage to G.

## Required artefacts

- Scope confirmation: process artefacts only, no app source (before starting)

## Phases

1. **Triage** — `/gcse-triage` → Lane F.
2. **Scope lock** — confirm: `.planning/` and process docs only; no app source.
3. **Run GSD tools** — as needed:
   `/gsd-ingest-docs`, `/gsd-map-codebase`, `/gsd-pause-work`,
   `/gsd-resume-work`, `/gsd-progress`
4. **Review created docs:**
   - Does `.planning/` duplicate source-of-truth docs?
   - Is it noisier than it needs to be?
   - Does the roadmap accidentally imply permission to build a phase?
5. **Tidy** — only if the review found issues.
6. **Commit** — directly to `main`.

## Allowed skills

GSD suite: `/gsd-ingest-docs`, `/gsd-map-codebase`, `/gsd-pause-work`,
`/gsd-resume-work`, `/gsd-progress`

## Forbidden

Editing app source (`src/`, `public/`, component files). Editing `CLAUDE.md`
or workflow docs (→ re-triage to G). Treating a roadmap entry as permission
to build.

## Stop points

- Any app source edit is attempted → stop; re-triage to B/C/E
- A `.planning/` doc contradicts `CLAUDE.md` → surface to user

## Verification

No build verification needed — process docs only. Confirm no app source
was changed before committing.
