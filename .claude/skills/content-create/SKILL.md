---
name: content-create
description: >
  Build or rebuild composed learning screens to the quality bar — the governed
  implementation companion to content-review. Implements only confirmed
  amendment briefs (or a fresh-build spec), resolving every screen through the
  taxonomy chain before any component is chosen, reserving visuals with
  MediaPlaceholder, running the composed 390px render pass, and recording any
  deviation from the brief. It never freely invents screens and never treats
  "implemented" as "approved" — an independent post-build content-review does
  that. Use for building new module content (Lane E) or rebuilding confirmed
  briefs in built content (Lane C).
argument-hint: "<module id> [screen range | brief file] "
---

# Content create

The build side of the governed review-to-rebuild pipeline. `content-review`
diagnoses and writes amendment briefs; **`content-create` implements them.**
For a genuinely new module it consumes a build spec/canonical spine instead
of a brief, but the same chain and halts apply. Runs in Lane E (new module)
or Lane C (rebuilding confirmed briefs) after `/gcse-triage`.

This is the companion build-side skill named throughout
`docs/system/PATTERN_GOVERNANCE.md`, `docs/system/CONTENT_BUILD_TEMPLATE.md`
and the `component-contracts/`. It is a real skill — do not describe it as
missing or not-yet-built anywhere.

## What this skill is NOT

- It is **not** a diagnosis tool. It does not decide what is wrong or what to
  change — that is `content-review`'s job, recorded as amendment briefs.
- It is **not** an approval tool. Producing a screen is not approving it.
  After building, an **independent** `content-review` re-audits the amended
  scope (Stage C below). `content-create` never signs off its own work.
- It does **not** expand scope. It implements the confirmed briefs and
  nothing else. New problems noticed while building are logged back to
  `content-review`, not fixed opportunistically.

## The three-stage pipeline (this skill owns Stage B)

The whole pathway, so this skill's boundaries are unambiguous:

- **Stage A — `content-review` (diagnose).** Audits, records evidence,
  assigns each screen one of Keep / Refine / Rebuild / Split / Cut, writes a
  structured amendment brief for every Refine / Rebuild / Split, and **stops
  for user confirmation.**
- **Stage B — `content-create` (implement).** *This skill.* Takes the
  **confirmed** briefs only, resolves each screen through the taxonomy chain,
  builds/rebuilds the composed screens, renders them at 390px, and records
  any unavoidable deviation from the brief. Output is *implemented*, not
  *approved*.
- **Stage C — `content-review` (approve).** An independent re-audit of the
  amended scope compares before / after / named gold example and does not
  accept this skill's self-assessment as evidence.

Do not start Stage B without confirmed Stage-A briefs (or, for a new build,
a confirmed spec + canonical story spine). If invoked with no brief and no
spec, stop and ask which briefs are confirmed.

## Required reading before any screen is written

1. The **confirmed amendment brief(s)** from `content-review`
   (the current or a prior `docs/content/<subject>/<series>/<NN>_Review_Log.md`
   entry), or — for a new build — the episode's canonical files
   `docs/content/<subject>/<series>/<NN>_*_Content.md` / `..._Architecture.md`
   including the Story spine section. If canonical files are missing or lack a
   spine for a new build, run `/canonical-topic` first — never invent an arc
   at build time.
2. `docs/system/PATTERN_GOVERNANCE.md` — the taxonomy chain, the
   one-primary-intent hard rule, the intent→component map, the 9-field
   contract format, the render-pass rule, MediaPlaceholder + manifest.
3. `docs/system/CONTENT_BUILD_TEMPLATE.md` — story units, the hard floor, the
   six-dimension rubric.
4. `docs/system/GOLD_SCREEN_REGISTER.md` — the named gold example for each
   component (the sixth link of the chain).
5. The subject's locked architecture (`HISTORY_MODULE_ARCHITECTURE.md` or
   `SCIENCE_MODULE_BLUEPRINT.md`).
6. The `component-contracts/` page for every component the briefs name.

## The build chain — mandatory before component selection

For **every** screen this skill creates or rebuilds, resolve this chain in
order, in writing, **before touching a component.** Skipping ahead to "which
component" is the failure this chain exists to stop.

1. **Learning objective** — the GCSE thing the learner should be able to do
   after this screen, taken from the canonical file / spec (not invented).
2. **One primary screen intent** — the single communicative job that serves
   the objective, stated in **one sentence**.
3. **Learner misunderstanding or learning need** — the specific gap, error or
   misconception this screen addresses. A screen with no learner need is
   decoration; cut it.
4. **Approved component** — the one sanctioned component for that intent, from
   the intent→component map. If an intent has an approved component, anything
   else is wrong.
5. **Component execution contract** — the 9-field (or legacy 3-part) contract
   in `component-contracts/` governing correct use. No contract → see halt 4.
6. **Named gold example** — the component's current gold screen from
   `GOLD_SCREEN_REGISTER.md`, which the build imitates and the render pass
   compares against. No verified gold → build to the contract and flag the
   render comparison as measured against contract prose only, and log the
   missing-gold debt.
7. **Content structure** — the concrete data shape (props/children/beats) that
   fills the component, drawn from canonical knowledge, matching the
   contract's required structure.
8. **Render acceptance criteria** — the 👁 checks (from the contract's field 9
   and the register's 390px review questions) this screen must pass at 390px
   before it is presented. Write them down *before* building, so the render
   pass has a checklist, not a vibe.

Record the full chain per screen in the working plan (and, for a rebuild,
against the brief it implements) before building. If a link cannot be filled,
**halt** — do not paper over it.

## Halt conditions (stop, surface to the user, do not build)

Building must stop and the situation be surfaced when any of these is true:

1. The **learning objective is absent or unclear** (chain link 1 empty).
2. The **primary intent cannot be stated in one sentence** (link 2 fails).
3. **More than one primary intent** is being placed on one screen — the
   screen is overloaded; it must be split before building.
4. The intended component **has no registered contract** and building would
   require inventing execution rules on the spot. Write the contract first as
   a Lane G change (per `component-contracts/README.md`), or pick a contracted
   component that serves the intent.
5. A **new component is proposed where an approved existing component already
   serves the intent** (reuse-before-create, `DEVELOPMENT_WORKFLOW.md`).
6. **Required canonical knowledge is missing** — the fact, figure or
   cause-and-effect link the screen must teach is not in the canonical file.
   Run `/canonical-topic` or get the source; never fabricate GCSE content.
7. The proposed screen **adds decoration without improving understanding,
   retention, application or motivation** — it fails the deletion test; cut
   or redesign it.

A halt is not a failure of the skill — it is the skill working. Surface the
halt, don't build around it.

## Teaching / retrieval / application / exam-technique — never blur them

These four are distinct learning jobs, and the pipeline keeps them separate:

- **Teaching** explains cause → mechanism → consequence in full sentences.
- **Retrieval** asks the learner to recall what was already taught.
- **Application** makes the learner use a taught idea on a new case.
- **Exam technique** trains *how* to answer a question type to a mark scheme.

**A concept must not be tested (retrieval, application or exam technique)
before the screen that teaches it.** If a brief or spine orders a test before
its teach beat, that is a halt-4-style structural problem — fix the order, do
not build the test first. Do not let a single screen silently carry two of
these jobs; if it does, it has two primary intents (halt 3).

## Build

1. Author each screen per its chain, the component contract, and
   `docs/system/TEACHING_VOICE_GUIDE.md` — sentence case, plain language
   around the compulsory vocabulary aiming at reading age 12, vocabulary
   explained on first use.
2. **Reserve every visual with `MediaPlaceholder`** + a manifest entry in
   `docs/content/<subject>/<series>/<NN>_visual-assets.md`. Never generate
   bespoke imagery or diagrams.
3. Register metadata per `CLAUDE.md` (per-module content file,
   `MODULE_CONTENT_LOADERS` entry, `src/modules.js` metadata with
   `screenCount` / `screenTags`). For a rebuild that changes screen count,
   update `screenCount`, `screenTags`, and any `stageNavigation` indices.
4. **Commit per screen / story unit / stage**, never one mega-commit — each
   amendment must be individually revertible.

## Render pass and deviation record (Stage B output, not approval)

Before handing back to Stage C:

1. Start the dev server (`./node_modules/.bin/vite --port 5173`) and
   screenshot each built/rebuilt screen in the **composed render path** at
   390px via the dev-only jump
   (`node scripts/screenshot.mjs "/?module=<id>&screen=<n>" <out>.png`).
   Rendering a component's own Storybook story is not sufficient — the
   composed screen is what ships.
2. Check each screenshot against the render acceptance criteria (chain link 8)
   and the named gold example. Where the environment blocks a render, say so
   explicitly — silent skipping is a failure.
3. **Record any unavoidable deviation from the brief** — where and why the
   built screen differs from what the brief specified (a constraint the brief
   didn't foresee, a component limitation, a canonical gap). Deviations are
   surfaced to the user and to Stage C, never hidden.
4. Write the **first / build entry to the review log** so the amended scope
   has a persisted record: what was built, the per-screen chain, the render
   results, and every deviation. This entry is *implementation evidence for
   Stage C*, explicitly not an approval.

## Verify (mechanical floor, still not approval)

- `vitest run tests/architecture` green (includes the content-quality floor —
  never add a module to a grandfather allowlist to get green).
- `./node_modules/.bin/vite build` green.
- The module opens, progresses and completes in the running app.

Passing these is necessary, not sufficient. **The build is "implemented", not
"approved", until an independent `content-review` (Stage C) has re-audited it
against before / after / gold.**

## Hard rules

- Never freely invent a screen: every screen resolves the full build chain or
  it is not built.
- Never treat "implemented" as "approved" — Stage C is a separate,
  independent pass.
- A concept is never tested before the screen that teaches it.
- Never generate imagery; reserve it with `MediaPlaceholder` + manifest.
- Never add a new module to `GRANDFATHERED_EPISODES` /
  `SENTENCE_CASE_GRANDFATHERED_EPISODES` — new content passes the floor.
