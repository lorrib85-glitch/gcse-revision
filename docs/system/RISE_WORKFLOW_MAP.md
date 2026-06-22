# RISE Workflow Map

**Authority:** `CLAUDE.md` > this document > session instructions.  
**Version:** v1

This document defines the seven workflow lanes (A–G) for the RISE GCSE
Revision codebase. The `/gcse-triage` skill routes each request to the
correct lane. Load only the section matching your triage output — do not
bulk-read this file.

---

## Workflow A — Minor Edit

**Use for:** typo, one CSS value, one image path, one data field, one copy
word — single-file, single-concept, no new pattern introduced.

**Qualification rule:** ≤2 lines changed, ≤1 file, no new visual system
rule required, no logic or component structure touched.

"No design docs needed" means no new visual decision is being made —
looking up an existing spacing, colour, or radius token is a reference
check, not a judgment call. If the target component already uses local
pixel values, follow that local pattern and stay at A. Escalate to B only
if the change creates a new rule or has cross-screen impact.

### Phases

1. **Triage** — `/gcse-triage` confirms it qualifies as A.
2. **Make the change** — direct edit; no skill required.
3. **Diff review** — `/ponytail-review` to confirm it didn't become bigger.
4. **Verify** — `vite build` if app source changed; skip for docs-only.
5. **Commit** — directly to `main`.

### Allowed skills
`/ponytail-review`

### Forbidden
GSD, `/canonical-topic`, `/frontend-design`, `/code-review` (unless the
change unexpectedly touches behaviour — then re-triage first)

### Stop points
- Change touches more than 1 file → re-triage; likely B or C
- A design judgment call is needed → re-triage to B

---

## Workflow B — Visual / UI Build

**Use for:** improving the appearance of an existing screen or component —
spacing, typography, mobile layout, image positioning, component styling.
Requires reading design docs or making visual judgment calls.

### Phases

1. **Triage** — `/gcse-triage` → Lane B.
2. **User story** — one sentence: who, what, why for the visual change.
3. **Source of truth check** — read in this order:
   - `docs/system/PRODUCT_UI_CONSTITUTION.md`
   - `docs/system/GENERAL_APP_UI_CONSTITUTION.md`
   - Relevant token docs as needed: `TYPOGRAPHY_SYSTEM.md`,
     `SPACING_SYSTEM.md`, `MOTION_SYSTEM.md`
   - Target component file and a similar existing component
   - **Forbidden:** canonical topic files, exam specs, question banks
4. **Design judgement** — `/frontend-design` if non-trivial visual decisions
   are needed; skip for a single CSS token swap.
5. **Plan** — `superpowers:writing-plans` if >1 file or non-trivial.
6. **Build** — direct implementation.
7. **Anti-bloat review** — `/ponytail-review`.
8. **Verify:**
   - If component has a `.stories.jsx` file → `vitest` (full suite,
     Playwright/Chromium)
   - Otherwise → `vite build`
   - `/verify` to confirm mobile viewport behaviour in the running app
9. **Commit** — directly to `main`.

### Story obligation
If the component being changed has an existing `.stories.jsx` file, update
it if the change affects the story's render. If a new reusable component is
created, a story is required alongside it.

### Allowed skills
`/frontend-design`, `/ponytail-review`, `superpowers:writing-plans`,
`superpowers:executing-plans`, `/verify`

### Forbidden
`/canonical-topic`, GSD, `/code-review` (unless behaviour changed)

### Stop points
- Requires touching more than 2 files → re-triage; likely E
- New component needed → re-triage to E; check Component Registry first

---

## Workflow C — Content / Module Update

**Use for:** changing existing lesson copy, adding screens to a built module,
fixing module structure, adding recall questions, improving GCSE knowledge
coverage within an already-built module.

### Phases

1. **Triage** — `/gcse-triage` → Lane C.
2. **User story** — exam-board framing:
   ```
   As a GCSE [Subject] student, I want [content outcome] so that
   I can [exam benefit].
   ```
3. **Source of truth check:**
   - `/canonical-topic` if History content accuracy or source material is
     in question (grep for specific sections first; do not bulk-read)
   - Allowed: canonical file, module architecture doc, exam spec/mark
     scheme, neighbouring module, target `src/modules/<subject>.js` file
   - **Forbidden by default:** brand docs, broad UI files, `/frontend-design`
     (only include if layout changes are also involved)
4. **Coverage check** — required before implementation:
   ```
   Source checked:
   Required coverage:
   Planned coverage:
   Gaps:
   Decision:
   ```
   No generic "coverage looks fine".
5. **Plan** — `superpowers:writing-plans`.
6. **Build** — `superpowers:executing-plans` or direct edit.
7. **Review** — `/ponytail-review`; `/code-review` if data shape or logic
   changed.
8. **Verify:**
   - `vite build` passes
   - `vitest run tests/architecture` — catches `screenCount` mismatches,
     missing `screenTags`, broken module boundaries, storage violations
   - Module opens, progresses, and completes without errors
   - No missing `recoveryQuizId` tags
   - `/verify` in the running app
9. **Commit** — directly to `main`.

### Allowed skills
`/canonical-topic` (History), `/ponytail-review`, `/code-review`,
`superpowers:writing-plans`, `superpowers:executing-plans`, `/verify`

### Forbidden
`/frontend-design` (unless layout is also changing), GSD (if the module
is not yet built → re-triage to E)

### Stop points
- Module is not yet built → re-triage to E
- New component required → check Component Registry; if genuinely new,
  re-triage to E
- `vitest run tests/architecture` fails → do not commit; fix first

---

## Workflow D — Bug Fix

**Use for:** broken Continue button, tap not working, build failure, routing
issue, progress bug, test failure, any unexpected behaviour.

### Phases

1. **Triage** — `/gcse-triage` → Lane D. No pre-triage clarifying question
   is needed — broken behaviour is always D. Reproduction details are
   established in phase 2, not before classification.
2. **Reproduce** — `superpowers:systematic-debugging`. The first debugging
   step must establish: which screen/module, expected behaviour, actual
   behaviour, and reproduction path. Ask or confirm these before forming a
   hypothesis.
   ```
   Symptom:
   Reproduction path:
   Expected:
   Actual:
   ```
3. **Hypothesis** — no code changes yet:
   ```
   Likely cause:
   Evidence needed:
   Files to inspect:
   ```
4. **Evidence gathering** — read only relevant files/logs; do not bulk-read.
5. **Confirm root cause** — required before any implementation:
   ```
   Confirmed root cause:
   Why this explains the symptom:
   Why alternatives were ruled out:
   ```
6. **Fix plan** — smallest possible fix.
7. **Build** — direct edit or `superpowers:executing-plans`.
8. **Review** — `/code-review`; `/ponytail-review`.
9. **Verify:**
   - Original reproduction path is resolved
   - `vite build` passes
   - `vitest run tests/architecture` if metadata, boundaries, or storage
     patterns were touched
   - `vitest run tests/unit` if `progress.js`, `unifiedWeaknessTracker.js`,
     or `dailyPlanner.js` were touched
   - `vitest` (full, Playwright/Chromium) if a component with `.stories.jsx`
     was changed
   - `superpowers:verification-before-completion`
   - `/verify` in the running app
10. **Commit** — directly to `main`.

### Allowed skills
`superpowers:systematic-debugging`, `superpowers:executing-plans`,
`superpowers:verification-before-completion`, `/code-review`,
`/ponytail-review`, `/verify`

### Forbidden
Guessing. CSS poking without a confirmed root cause. GSD (unless the bug
reveals architecture-level work needed — then stop and surface to user
before escalating to E).

### Stop points
- Implementing a fix before root cause is confirmed → stop; return to step 5
- Fix requires a new component → check registry; re-triage to E if new
- Bug is architecture-level → surface to user before escalating

---

## Workflow E — Big Build / New Module / New Feature

**Use for:** new History episode, new subject module, new exam mode, new
reusable component family, new app-level flow, new architecture pattern.

### Phases

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
     canonical docs for this episode are missing, stale, or explicitly
     requested by the user. Do not run it by default.
   - `/frontend-design` if a new visual surface is introduced
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
10. **Verify:**
    - `vite build` passes
    - `vitest run tests/architecture` — always; module metadata changes are
      frequent in big builds
    - `vitest run tests/unit` if logic files were touched
    - `vitest` (full, Playwright/Chromium) if new component stories were added
    - Module opens, progresses, and completes — full flow walkthrough
    - `superpowers:verification-before-completion`
    - `/verify`
11. **Pause / handoff** — `/gsd-pause-work` with state summary.
12. **Commit** — directly to `main`.

### Story obligation
Every new reusable component (used in 2+ places or designed to be) requires
a `.stories.jsx` file alongside it, so the Playwright suite can verify it.

### Token cost warning
Canonical topic files and architecture docs are large. Before reading:
- `Grep` for specific sections using targeted keywords
- Read only the matched range plus ~10–15 lines of context
- Never bulk-read a canonical file to "get familiar" with it

### Allowed skills
`superpowers:brainstorming`, `superpowers:writing-plans`,
`superpowers:subagent-driven-development`, `superpowers:executing-plans`,
`superpowers:verification-before-completion`,
`/gsd-discuss-phase`, `/gsd-plan-phase`, `/gsd-execute-phase`,
`/gsd-resume-work`, `/gsd-pause-work`,
`/canonical-topic`, `/frontend-design`,
`/ponytail-review`, `/code-review`, `/verify`

### Forbidden
Starting implementation without a completed scope lock. Running
`/gsd-execute-phase` without explicit user request. Bulk-reading canonical
files.

### Stop points
- Open decisions remain after discussion phase → do not plan
- Plan not complete → do not execute
- New component with no Component Registry justification → stop and check
- `vitest run tests/architecture` fails → do not commit; fix first

---

## Workflow F — GSD Foundation / Documentation Tidy

**Use for:** ingesting docs, mapping codebase, organising `.planning/`,
tidying workflow docs. Process artefacts only — no app source changes.

### Phases

1. **Triage** — `/gcse-triage` → Lane F.
2. **Scope lock** — confirm: process artefacts only; no app source changes.
3. **Run GSD setup** — as needed:
   `/gsd-ingest-docs`, `/gsd-map-codebase`, `/gsd-pause-work`,
   `/gsd-resume-work`, `/gsd-progress`
4. **Review created docs:**
   - Does `.planning/` duplicate source-of-truth docs?
   - Is it noisier than it needs to be?
   - Does the roadmap accidentally imply permission to build a phase?
5. **Tidy** — only if the review found issues.
6. **Commit** — directly to `main`.

### Allowed skills
GSD suite: `/gsd-ingest-docs`, `/gsd-map-codebase`, `/gsd-pause-work`,
`/gsd-resume-work`, `/gsd-progress`

### Forbidden
Editing app source (`src/`, `public/`, component files). Editing `CLAUDE.md`
or workflow docs (→ re-triage to G). Treating a roadmap entry as permission
to build.

### Stop points
- Any app source edit is attempted → stop; re-triage to B/C/E
- A `.planning/` doc contradicts `CLAUDE.md` → surface to user

---

## Workflow G — Workflow Governance

**Use for:** creating or editing triage skills, changing `CLAUDE.md` rules,
changing `DEVELOPMENT_WORKFLOW.md`, changing `RISE_WORKFLOW_MAP.md`, or any
other workflow/process rule change.

### Phases

1. **Triage** — `/gcse-triage` → Lane G.
2. **User story:**
   ```
   As Lorri building RISE with Claude, I want [rule change] so that
   [workflow improvement].
   ```
3. **Source of truth check:**
   - Allowed: `CLAUDE.md`, `DEVELOPMENT_WORKFLOW.md`, `RISE_WORKFLOW_MAP.md`,
     existing skill files, `.planning/` codebase summary
   - **Forbidden:** app source, module content, canonical topic files
4. **Draft spec** — write the proposed change in plain language before any
   file edit. No implementation yet.
5. **Review spec** — `/ponytail-review`; `/code-review` if logic changed.
6. **Implement** — edit skill and doc files only; no app source.
7. **Verify:**
   - No app source was changed
   - No new rule conflicts with `CLAUDE.md`
   - Main-only commit policy preserved
   - Triage trigger is mechanical, not aspirational
8. **Commit** — directly to `main`.

### Allowed skills
`/ponytail-review`, `/code-review`

### Forbidden
Editing app source. Treating spec review as permission to implement.

### Stop points
- Any edit to app source is attempted → stop immediately
- Proposed rule conflicts with `CLAUDE.md` → surface conflict to user first

---

## Testing routing table

Run the lightest command that covers what changed.

| Files changed | Command |
|---|---|
| `src/modules.js` — metadata, `screenCount`, `screenTags` | `vitest run tests/architecture` |
| `src/progress.js`, `src/unifiedWeaknessTracker.js`, `dailyPlanner.js` | `vitest run tests/unit` |
| Storage / localStorage access patterns | `vitest run tests/architecture` |
| Any component with a `.stories.jsx` file | `vitest` (full — Playwright/Chromium) |
| New `.stories.jsx` file added | `vitest` (full) |
| Pure CSS or copy change, no logic touched | `vite build` only |

`vitest run tests/architecture` is fast and always safe to run when module
metadata or structural changes are involved.

The full `vitest` suite (Storybook / Playwright / Chromium) is heavier —
only run it when story files are in play.
