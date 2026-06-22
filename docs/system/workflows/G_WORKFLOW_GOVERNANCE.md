# Workflow G — Workflow Governance

**Authority:** `CLAUDE.md` > this file > session instructions.

## Purpose

Creating or editing triage skills, changing `CLAUDE.md` rules, changing
workflow files — any change to how work is routed or governed.

## When to use

Changes to `CLAUDE.md`, `.claude/skills/` files, `docs/system/workflows/`
files, `DEVELOPMENT_WORKFLOW.md`, or any other workflow/process rule.

## Required artefacts

- User story (before drafting — see phase 2)
- Draft spec in plain language (before any file edit — phase 4)

## Phases

1. **Triage** — `/gcse-triage` → Lane G.
2. **User story:**
   ```
   As Lorri building RISE with Claude, I want [rule change] so that
   [workflow improvement].
   ```
3. **Source of truth check:**
   - Allowed: `CLAUDE.md`, `DEVELOPMENT_WORKFLOW.md`,
     `docs/system/workflows/` files, existing skill files,
     `.planning/` codebase summary
   - **Forbidden:** app source, module content, canonical topic files
4. **Draft spec** — write the proposed change in plain language before any
   file edit. No implementation yet.
5. **Review spec** — `/ponytail-review`; `/code-review` if logic changed.
6. **Implement** — edit skill and doc files only; no app source.
7. **Verify:**
   - No app source was changed
   - No new rule conflicts with `CLAUDE.md`
   - Triage trigger is mechanical, not aspirational
8. **Commit or PR** — see branch rule below.

## Allowed skills

`/ponytail-review`, `/code-review`

## Forbidden

Editing app source. Treating spec review as permission to implement.

## Stop points

- Any edit to app source is attempted → stop immediately
- Proposed rule conflicts with `CLAUDE.md` → surface conflict to user first

## Verification

- Confirm no app source was changed
- Confirm no new rule contradicts `CLAUDE.md`
- Read back the updated skill or workflow file to confirm it is mechanical
  and unambiguous

## Branch rule

Default is commit directly to `main`. Workflow-governance PR only if Lorri
explicitly asks for a PR.
