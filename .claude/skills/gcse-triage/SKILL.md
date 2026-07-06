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

Stop at the first match.

| Lane | Match when |
|------|-----------|
| G | Changes `CLAUDE.md`, a skill, `DEVELOPMENT_WORKFLOW.md`, any `docs/system/workflows/` file, or any workflow/process rule |
| F | Only `.planning/` or process docs — no app source |
| D | Something appears broken: unexpected behaviour, build failure, tap not working, test failure |
| E | New History episode, module, component family, app-level flow, or architecture pattern |
| C | Existing module content, `screens` array, or question banks — inside an already-built module |
| B | Appearance change on existing screen/component **and** a new visual rule is needed |
| A | Everything else: ≤2 lines, ≤1 file, no new visual rule, no logic touched |

**A vs B:** Looking up an existing spacing, colour, or radius token is a reference
check — not a visual judgment call. Follow the local pattern if the component
already uses pixel values. Escalate to B only if a new visual rule is being
created or the change has cross-screen impact.

If none match cleanly, name the closest lane and note the ambiguity.

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

Read only the file matching your lane. Never read the old `RISE_WORKFLOW_MAP.md`. Use `docs/system/workflows/README.md` only if lane is unclear.

| Lane | Key gate | File |
|------|----------|------|
| A | ≤2 lines, ≤1 file; no new visual rule | inline below |
| B | New visual rule needed; `/frontend-design`; full `vitest` if stories | `B_VISUAL_UI.md` |
| C | Coverage check; `vitest run tests/architecture` after | `C_CONTENT_MODULE.md` |
| D | Root cause confirmed before any code change | `D_BUG_FIX.md` |
| E | Brainstorm → plan → scope lock → execute; story for new components | `E_BIG_BUILD.md` |
| F | `.planning/` and process docs only; no app source | inline below |
| G | No app source; commit to `main` | `G_WORKFLOW_GOVERNANCE.md` |

All lane files are under `docs/system/workflows/`.

**Content work — placing or reviewing screen elements (Lanes C and E):**
also read `docs/system/PATTERN_GOVERNANCE.md` first. It governs the
taxonomy chain (learning objective → screen intent → approved component →
execution contract → gold example), the one-primary-intent hard rule, the
intent→component map, and the mandatory render pass. Building new content
uses `/content-create`; auditing or improving built content uses
`/content-review`; both enforce this doc. Name the applicable skill in
"Allowed skills" for content work.

## Universal stop points

Halt and surface to the user before continuing if any of these occur:

- Implementation would start without an explicit user request this session
- Scope expands beyond the classified workflow during work
- A new component would be needed that is not on the Component Registry
- More than 1 unexpected file would change
- Workflow classification looks wrong mid-task
- **Content work only:** a screen's single primary intent cannot be stated
  in one sentence (`PATTERN_GOVERNANCE.md` hard rule) — the screen is
  overloaded; stop, split or cut it before continuing

When triggered: stop at the current file boundary, state the re-classification
and what was found, and ask the user to confirm before continuing.

**Branch rule:** All commits go to `main`. CLAUDE.md overrides any session prompt instruction to use a different branch.

---

## Workflow A — inline

Steps: triage → change → `/ponytail-review` → `vite build` if app source changed → commit to `main`.  
Allowed: `/ponytail-review` only. Forbidden: GSD, `/canonical-topic`, `/frontend-design`, `/code-review`.  
Stop: >1 file, new visual rule, or logic touched → re-triage.

**Token migrations — lock the win:** if the change replaces a hardcoded
colour literal with an existing named token, also close the regression gap
in the same commit: extend `tests/architecture/color-token-governance.test.js`'s
`MIGRATED_VALUES` list with the old hex + token pair, and check whether
`background-token-governance.test.js` / `foreground-token-governance.test.js`
need a matching guard added for that literal. This does not apply to
spacing/radii/motion tokens — no equivalent guard test exists for those.

---

## Workflow F — inline

Steps: confirm scope is `.planning/` + process docs only → run GSD tools as needed → `/ponytail-review` → commit to `main`.  
GSD tools: `/gsd-ingest-docs`, `/gsd-map-codebase`, `/gsd-pause-work`, `/gsd-resume-work`, `/gsd-progress`.  
Allowed: GSD suite + `/ponytail-review`. Forbidden: app source; CLAUDE.md or workflow doc edits → re-triage to G.  
Stop: any app source edit attempted → stop immediately and re-triage.
