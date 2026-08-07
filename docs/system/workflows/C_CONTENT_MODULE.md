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
- Chapter readiness report when the change triggers
  `docs/system/CHAPTER_READINESS_AUDIT.md`

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
     `component-contracts/` and `CONTENT_BUILD_TEMPLATE.md`.
   - When the scope creates or changes Chapter Topics, canonical coverage,
     assessed evidence, weakness/recovery wiring, Screen order/count,
     `stageNavigation` or Chapter metadata, also read
     `docs/system/CHAPTER_READINESS_AUDIT.md`; if Topics are present, read
     `docs/system/CHAPTER_TOPICS.md` too. These docs own the readiness and
     Topic rules — do not restate them in this workflow.
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
6. **Build via the review-to-rebuild pathway.** Improving or rebuilding
   built screens runs `/content-review` to diagnose (per-screen Keep /
   Refine / Rebuild / Split / Cut + a structured amendment brief for each
   Refine / Rebuild / Split), stops for confirmation, then `/content-create`
   implements the **confirmed briefs only**. A small single-field copy fix
   may be a direct edit; anything reaching for a component change or rebuild
   goes through the pathway. The one pathway: canonical objective → review
   decision → amendment brief → `content-create` implementation → composed
   render comparison → independent post-build approval. Before building any
   screen, record its composition selection (learning objective → intent →
   approved component → approved composition route → structural shell;
   content-level or screen-owning) per `CONTENT_BUILD_TEMPLATE.md` →
   "Composition selection": teaching/explanation screens default to
   `TeachScreenShell` (Route A); a Route B/C route needs explicit
   contract-granted full-screen ownership. When the readiness contract is
   triggered, `content-create` must also produce the Stage-B Chapter readiness
   report before calling the scope implemented.
7. **Review** — `/ponytail-review`; `/code-review` if data shape or logic
   changed. **Pattern-governance review** (`PATTERN_GOVERNANCE.md`) for any
   screen touched: state its one primary intent in a sentence (fail and
   split/cut if you can't); confirm the component advances the screen's
   learning objective; check the intent→component map and the relevant
   contracts; run the **render pass** (screenshot at 390px) against the
   named gold example (`GOLD_SCREEN_REGISTER.md`) for any visual or UX
   change — source + tests alone do not pass — and answer the strengthened
   visual verdict in writing. After `content-create` builds, the
   **independent post-build `content-review`** re-audits the amended scope
   (before / after / gold), independently re-runs any required Chapter
   readiness audit, and names any quality trade-off; "implemented" is never
   "approved".
8. **Verify** — see below.
9. **Commit** — directly to `main`.

## Allowed skills

`/content-review` (diagnose + amendment briefs + independent post-build
approval), `/content-create` (implement confirmed briefs),
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
- A required Chapter readiness audit has an unresolved in-scope Fail → do not
  describe the changed scope as implemented or approved

## Verification

- **`pnpm lab:generate`, and commit the result** — the Component Lab projection
  carries measured content usage per authoring key. Adding, removing or moving
  a screen or block changes those counts, so a content change that skips this
  ships a stale projection and `pnpm lab:check` fails the build.
- `vite build` passes
- `vitest run tests/architecture` — catches `screenCount` mismatches,
  missing `screenTags`, broken module boundaries, storage violations, and Lab
  projection drift
- Module opens, progresses, and completes without errors
- No missing `recoveryQuizId` tags
- When triggered by `CHAPTER_READINESS_AUDIT.md`, Stage B and independent
  Stage C readiness results are recorded, with no unresolved in-scope Fail
- `/verify` in the running app