# Workflow C — Content / Module Update

**Authority:** `CLAUDE.md` > this file > session instructions.

## Purpose

Changing or extending content inside an already-built module — lesson copy,
screens, recall questions, module structure, GCSE knowledge coverage.

## When to use

Any change to `src/modules/<subject>.js` content, `screens` array, `recall`
questions, or `hook`/`outcomes` copy for a module that already exists.
Module not yet built → re-triage to E (Big Build).

## Required artefacts

- User story (exam-board framing — see phase 2)
- Coverage check (inline note or doc — see phase 4)
- Plan (`superpowers:writing-plans` output)

## Phases

1. **Triage** — `/gcse-triage` → Lane C.
2. **User story** — exam-board framing:
   ```
   As a GCSE [Subject] student, I want [content outcome] so that
   I can [exam benefit].
   ```
3. **Source of truth check:**
   - Read existing canonical and architecture docs first — grep for the
     relevant section; do not bulk-read.
   - Run `/canonical-topic` only if canonical or architecture docs are
     missing, stale, incomplete, or explicitly requested. Do not run it
     by default.
   - Allowed: canonical file, module architecture doc, exam spec/mark
     scheme, neighbouring module, target `src/modules/<subject>.js` file,
     `docs/system/PATTERN_GOVERNANCE.md` + the relevant
     `component-contracts/` and `CONTENT_BUILD_TEMPLATE.md`
   - During `/content-review`, brand, typography, subject-theme and product-UI
     governance may be consulted to audit an existing learning screen. This
     does not authorise creation of a new visual system, broad redesign,
     `/frontend-design`, or visual changes outside approved component and
     token systems.
   - **Forbidden by default:** brand docs and broad UI files outside that
     review-only exception; `/frontend-design` (only if layout changes are
     also involved)
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
   changed. **Pattern-governance review** (`PATTERN_GOVERNANCE.md`) for any
   screen touched: state its one primary intent in a sentence (fail and
   split/cut if you can't); confirm the component advances the screen's
   learning objective; check the intent→component map and the relevant
   contracts; run the **render pass** (screenshot at 390px) for any visual
   or UX change — source + tests alone do not pass.
8. **Verify** — see below.
9. **Commit** — directly to `main`.

## Allowed skills

`/canonical-topic` (History, only when docs are missing/stale/requested),
`/ponytail-review`, `/code-review`, `superpowers:writing-plans`,
`superpowers:executing-plans`, `/verify`

## Forbidden

`/frontend-design` (unless layout is also changing), GSD

## Stop points

- Module is not yet built → re-triage to E
- New component required → check Component Registry; if genuinely new,
  re-triage to E
- `vitest run tests/architecture` fails → do not commit; fix first

## Verification

- `vite build` passes
- `vitest run tests/architecture` — catches `screenCount` mismatches,
  missing `screenTags`, broken module boundaries, storage violations
- Module opens, progresses, and completes without errors
- No missing `recoveryQuizId` tags
- `/verify` in the running app
