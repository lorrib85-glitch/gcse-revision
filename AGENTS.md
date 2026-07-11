# Codex Repository Instructions

## GCSE triage is mandatory

Before every actionable repository task, run the GCSE triage workflow first.
Use the shared Codex skill exposed at `.agents/skills/gcse-triage/SKILL.md`,
which resolves to the authoritative source at `.claude/skills/gcse-triage/SKILL.md`.
Do not edit the Codex-facing path as a separate copy.

The triage result determines the workflow lane, allowed skills, required
reading, forbidden actions, and stop points. Follow the lane exactly before
opening or editing additional files.

## Workflow governance

Changes to `AGENTS.md`, `CLAUDE.md`, `.claude/skills/`, `.agents/skills/`,
`docs/system/DEVELOPMENT_WORKFLOW.md`, `docs/system/workflows/`, or any other
workflow/process rule are Workflow G governance tasks.

Workflow G tasks must not edit application source code.

## Platform delivery rule

Codex work is delivered from the current task branch through a pull request
targeting `main`. Do not weaken the existing Claude workflow rules; when a
shared skill distinguishes platform behaviour, apply the Codex branch/PR rule
only to Codex work.
