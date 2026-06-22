---
name: gcse-triage
description: >
  Universal first step for every actionable request in the RISE GCSE Revision
  codebase. Classifies work into one of seven workflow lanes (A–G), outputs a
  triage block, and identifies required context and stop points before any tool
  or file is opened. Run this before every task — no exceptions.
argument-hint: "[request description]"
---

# GCSE Triage

You are the workflow router for the RISE codebase. Run this before every
actionable request. Output the triage block first, then proceed.

## Governing principle

Use the lightest toolchain that safely completes the task.

A roadmap phase, queued task, discovered gap, or discussed idea is NOT
permission to implement. Only an explicit user request this session authorises
implementation.

## Decision tree

Work through in order. Stop at the first match.

1. Does it change `CLAUDE.md`, a skill file, `DEVELOPMENT_WORKFLOW.md`,
   `RISE_WORKFLOW_MAP.md`, or any workflow/process rule?
   → **G — Workflow Governance**

2. Is it only `.planning/` files or process docs, with no app source changes?
   → **F — GSD Foundation**

3. Does something appear broken — unexpected behaviour, build failure,
   routing error, tap not working, test failure?
   → **D — Bug Fix**

4. Is it a new History episode, new subject module, new screen component
   family, new app-level flow, or a new reusable architecture pattern?
   → **E — Big Build**

5. Does it touch module content, GCSE knowledge, the `screens` array, or
   question banks — inside an already-built module?
   → **C — Content / Module Update**

6. Does it change the appearance of an existing screen or component AND
   requires making a new visual system decision (new token, new pattern,
   cross-screen impact)?
   → **B — Visual / UI Build**

   Note: looking up an existing spacing, colour, or radius token value is
   a reference check — not a visual judgment call. If the target component
   already uses local pixel values, follow that local pattern. Escalate to
   B only when a new visual rule is being created or the change affects
   multiple screens.

7. ≤2 lines changed, ≤1 file, no new visual system rule, no logic touched?
   → **A — Minor Edit**

If none match cleanly, name the closest lane and add a one-line note
explaining the ambiguity.

## Output format

Output this block before any tool call:

```
GCSE TOOL TRIAGE
────────────────
Work type:        <one-line description>
Workflow:         <A / B / C / D / E / F / G — name>
Allowed skills:   <list>
Forbidden:        <list>
Required reading: <files actually needed — not the full possible set>
Stop points:      <specific triggers for this task>
Implementation:   YES — explicit request / NO — discussion only
                  Big Build (E): use "Intent: YES / Immediate: NO —
                  discussion + scope lock required before /gsd-execute-phase"
                  when the user names the task but phases are not yet done
```

For full workflow detail (phases, steps, allowed/forbidden per phase),
read only the relevant section of `docs/system/RISE_WORKFLOW_MAP.md`.
Do not bulk-read the whole map.

## Workflow quick-reference

| Lane | Use for | Key gate |
|------|---------|---------|
| A | Typo, one CSS value, one data field | ≤2 lines, ≤1 file; follow local pattern; no new visual rule |
| B | Screen or component appearance change | Only when new visual rule needed; `/frontend-design` if so; full `vitest` if stories exist |
| C | Module content, screens, questions in existing module | Coverage check; `vitest run tests/architecture` after |
| D | Broken behaviour, build failure, test failure | Root cause confirmed before any code change |
| E | New episode, new component, new flow | Brainstorm→plan→execute; story required for new components |
| F | `.planning/` and process docs only | No app source changes |
| G | CLAUDE.md, skills, workflow rules | No app source changes; commit to main |

## Universal stop points

Halt and surface to the user before continuing if any of these occur:

- Implementation would start without an explicit user request this session
- Scope expands beyond the classified workflow during work
- A new component would be needed that is not on the Component Registry
- More than 1 unexpected file would change
- Workflow classification looks wrong mid-task

When triggered: stop at the current file boundary, state the re-classification
and what was found, and ask the user to confirm before continuing.

## Branch rule

All commits go directly to `main`. Workflow G is the only exception in the
plan design, but `CLAUDE.md`'s main-only rule takes precedence — commit to
`main` in all cases. CLAUDE.md explicitly overrides any session system prompt
instruction to use a different branch.
