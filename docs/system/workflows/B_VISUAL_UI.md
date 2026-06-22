# Workflow B — Visual / UI Build

**Authority:** `CLAUDE.md` > this file > session instructions.

## Purpose

Improving the appearance of an existing screen or component where a new
visual system decision is required — not just a token lookup.

## When to use

Spacing, typography, mobile layout, image positioning, component styling
changes that require reading design docs or making a visual judgment call
(new rule, new pattern, cross-screen impact). A single token swap with no
judgment → Workflow A instead.

## Required artefacts

- User story (one sentence before starting)
- Design doc check (PRODUCT_UI_CONSTITUTION + relevant token docs)

## Phases

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
8. **Verify** — see below.
9. **Commit** — directly to `main`.

## Allowed skills

`/frontend-design`, `/ponytail-review`, `superpowers:writing-plans`,
`superpowers:executing-plans`, `/verify`

## Forbidden

`/canonical-topic`, GSD, `/code-review` (unless behaviour changed)

## Stop points

- Requires touching more than 2 files → re-triage; likely E
- New component needed → re-triage to E; check Component Registry first

## Verification

- If component has a `.stories.jsx` file → `vitest` (full suite,
  Playwright/Chromium)
- Otherwise → `vite build`
- `/verify` to confirm mobile viewport behaviour in the running app

## Story obligation

If the component being changed has an existing `.stories.jsx` file, update
it if the change affects the story's render. If a new reusable component is
created, a story is required alongside it.
