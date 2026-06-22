# Workflow A — Minor Edit

**Authority:** `CLAUDE.md` > this file > session instructions.  
**Runtime:** This lane is inlined in `.claude/skills/gcse-triage/SKILL.md`.
Do not read this file at runtime — it is the full reference only.

## Purpose

Single-file, single-concept changes where no new pattern, visual rule, or
logic is introduced.

## When to use

Typo fix, one CSS value swap, one image path, one data field, one copy word.

**Qualification rule:** ≤2 lines changed, ≤1 file, no new visual system rule
required, no logic or component structure touched.

"No new visual rule needed" means no new decision is being made. Looking up
an existing spacing, colour, or radius token is a reference check, not a
judgment call. If the target component already uses local pixel values,
follow that local pattern and stay at A. Escalate to B only if the change
creates a new rule or has cross-screen impact.

## Required artefacts

None — no artefacts required before implementation.

## Phases

1. Triage — `/gcse-triage` confirms it qualifies as A.
2. Make the change — direct edit; no skill required.
3. Diff review — `/ponytail-review` to confirm scope didn't expand.
4. Verify — `vite build` if app source changed; skip for docs-only.
5. Commit — directly to `main`.

## Allowed skills

`/ponytail-review`

## Forbidden

GSD, `/canonical-topic`, `/frontend-design`, `/code-review` (unless the
change unexpectedly touches behaviour — then re-triage first).

## Stop points

- Change touches more than 1 file → re-triage; likely B or C
- A design judgment call is needed → re-triage to B
- Logic is touched → re-triage to D or C

## Verification

`vite build` if app source changed. Skip entirely for docs-only edits.
