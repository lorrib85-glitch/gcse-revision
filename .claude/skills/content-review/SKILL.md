---
name: content-review
description: >
  Audit and amend existing module content against the content quality
  framework and pattern governance — states each screen's one primary intent
  first, checks it against the learning objective, scores the 9-field
  contracts and intent→component map, runs the mandatory render pass, and
  reconciles the visual-assets manifest. Findings are per-dimension, never
  a single blended score. Use for reviewing or improving any already-built
  episode/module (Lane C).
argument-hint: "<module id or episode title> [stage name | screen range] [audit-only]"
---

# Content review

Audits a built episode against the content quality framework, then amends.
Runs in Lane C after `/gcse-triage`. Pass `audit-only` to stop after the
findings report (no code changes).

This is the review half of the framework specified in
`docs/superpowers/specs/2026-07-06-content-quality-framework-design.md`
and built per `docs/superpowers/plans/2026-07-06-content-quality-framework.md`
(Task 7, revised by that plan's Addendum 2, Gaps 1–6). `content-create` is
the companion build-side skill; it does not yet exist — until it does, new
content is still built by direct Lane C/E work, and `content-review` is the
only mechanical checkpoint against the framework.

## Scope argument

`content-review <module id> [stage name | screen range] [audit-only]`

- No second argument: review the whole episode.
- A stage name (matching a `stageNavigation` entry) or a screen range
  (`12-18`): review only that slice. A stage is the realistic unit of work
  — prefer "review the Galen stage" over a whole-episode audit when the
  user names a specific area.
- `audit-only`: report findings and stop. Without it, the skill still
  **checkpoints by default** — see Amend below — so `audit-only` mainly
  matters for pre-authorising the amend step in the invocation itself.

## Required reading

1. `docs/system/PATTERN_GOVERNANCE.md` — the taxonomy chain, the
   one-primary-intent hard rule, the intent→component map, the 9-field
   contract format, the render-pass rule, MediaPlaceholder + manifest
   convention, design-rule review checks.
2. `docs/system/CONTENT_BUILD_TEMPLATE.md` — story units, the hard floor,
   the six-dimension rubric.
3. The episode's canonical files: `docs/content/<subject>/<series>/<NN>_*_Content.md`
   and `..._Architecture.md`, including the Story spine section if present.
4. The subject's locked architecture (`docs/system/HISTORY_MODULE_ARCHITECTURE.md`
   or `SCIENCE_MODULE_BLUEPRINT.md`).
5. The component contracts (`docs/system/component-contracts/`) for every
   component the reviewed screens use.
6. The episode's previous review log, if one exists (see Review log below)
   — findings marked deferred there are first-class inputs to this review.

### Degraded mode

If the canonical content/architecture file is missing, or present but has
no Story spine section (true for every episode built before 2026-07 —
this is expected, not an error): run everything below **except** the
canonical-coverage technical pass and the story-spine check. State plainly
in the findings report and the review log entry: *"canonical files
unavailable — coverage and spine unassessed."* Recommend `/canonical-topic`
as follow-up. Never invent a spine mid-review.

## Audit

For every screen in scope, in this order:

1. **State the one primary intent** in a single sentence
   (`PATTERN_GOVERNANCE.md` hard rule). If it can't be stated in one
   sentence, the screen fails immediately — overloaded, needs splitting or
   cutting — and nothing below is scored for it beyond noting the failure.
2. **Objective match** — does the component actually advance the screen's
   learning objective (from the canonical file / story spine)? A
   well-built component on the wrong objective still fails. Name the
   objective and say yes/no.
3. **Taxonomy chain + contract score** — resolve the screen's intent
   through the intent→component map (`PATTERN_GOVERNANCE.md`): is it using
   the approved component for that intent? Score it against that
   component's 9-field contract (`component-contracts/`) — field 9 (review
   checks) is where composition controls and the design-rule checks
   (no box-in-a-box, no decorative eyebrow/uppercase, gradual key-point
   reveal, points land in `KeyPoint` not as caption text, one emphasis box
   per screen) actually live; don't re-derive them, run what the contract
   lists. Flag any ad-hoc element that should have been a pattern component
   (`TeachScreenShell` / `KeyPoint` / `WorkedExample` / `MediaPlaceholder`).

Then score the whole episode (or scoped slice) per the six rubric
dimensions, each reported separately — **never averaged**:

1. **Story** — follows its story spine (or has a discernible arc, if
   spine-less)? Dramatic questions raised/escalated/resolved? Name
   narrative dead zones by screen index.
2. **Teaching** — cause → mechanism → consequence before testing? Depth
   sufficient for the exam question, not just term recognition?
3. **Retrieval** — every taught fact retrieved or applied later? Wrong
   answers feed `unifiedWeaknessTracker.js`? Spacing across the episode?
4. **Interactions** — right function tag for the content shape
   (`src/data/componentFunctions.js`)? Execution meets each component's
   contract?
5. **Exam preparation** — lands the exam payoff; mark-scheme thinking and
   examiner traps present and specific?
6. **Emotional engagement** — stakes, tension, payoff; would a 15-year-old
   willingly continue? Apply the deletion test to every screen: would
   removing it noticeably reduce understanding, retention or motivation?

Then five technical passes: **hardcoded values** (tokens from
`src/constants/` only), **image quality** (paths resolve, `.webp`
preferred, subject-appropriate), **UX design** (hierarchy/white
space/subject branding per the token systems), **canonical coverage**
(two-way diff against the canonical content file — gaps listed by
canonical section, unsourced content flagged; skipped in degraded mode),
and **readability + sentence case** (run
`node scripts/check-content-quality.mjs <module-id>` — a live, per-screen
check against this one module, with no pre-registration required; report
every violation it prints, then apply "plain language around the
compulsory subject vocabulary, aiming for a reading age of 12" plus
sentence case to copy the script can't reach, e.g. body prose outside
label/title/heading/sub). This script is independent of the CI regression
floor (`tests/architecture/content-quality.test.js`) — it has no
allowlist, so it reports every violation on this module even if that
module is grandfathered there; don't skip a finding because the module
happens to be on that separate list.

### The render pass (mandatory for every 👁 check)

Source-and-tests review is not sufficient — every 👁 contract check
requires rendering and looking at the pixels at 390px width:

1. Start the dev server (`./node_modules/.bin/vite --port 5173`).
2. For each screen in scope, screenshot it via the dev-only jump:
   `node scripts/screenshot.mjs "/?module=<id>&screen=<n>" <out>.png`
   (see `src/app/LegacyApp.jsx` — dev-only, no deep-linking needed).
3. Render the **composed screen in the real render path** — not a
   component's own Storybook story in isolation. A component passing its
   own story is not evidence the screen is good.
4. Compare critically against a bar: put the screenshot beside its gold
   example (and, for an amend, beside the pre-amend version) and answer in
   writing — *is this actually better, and where is it worse?* "Looks
   clean" is not a verdict.

If a 👁 check genuinely cannot be run (e.g. a screen behind a blocking
assessed interaction the jump can't skip past), say so explicitly in the
findings and the review log — silent skipping is a review failure, not an
acceptable shortcut.

## Findings report format

Per rubric dimension: a rating (strong / adequate / below bar) plus
findings as `screen <index> — <what's wrong> — <what fixing it looks
like>`, ordered most-damaging first. Precede the six dimensions with the
per-screen one-primary-intent / objective-match / contract results from
Audit steps 1–3. End with the canonical coverage diff (or the degraded-mode
note) and the technical-pass results, including every readability/
sentence-case violation `check-content-quality.mjs` reported. No single
overall score, ever.

## Review log

Write findings to a persisted per-episode log:
`docs/content/<subject>/<series>/<NN>_Review_Log.md` (matching the
`NN_` canonical-file naming). Create it if it doesn't exist. Append
entries **newest-first**, each with:

- date, session scope (full episode / stage / screen range), canonical
  files available yes/no
- per-dimension ratings + findings (the report above)
- the five technical-pass results
- what was amended (with commit hashes) vs accepted-as-is vs deferred
- after-amend re-score (if amended)

Read the previous entry (if any) before auditing. A finding marked
"deferred" in a prior entry is a first-class input this time — don't
re-discover it from scratch, and don't let it silently drop.

## Amend

Present the findings report and **stop for user confirmation before
amending** — this is the default, not just what `audit-only` produces.
`audit-only` remains available for explicit report-only runs, and the user
can pre-authorise the amend step in the invocation ("review and fix the
Galen stage").

When amending:

- Follow Workflow C (`docs/system/workflows/C_CONTENT_MODULE.md`):
  coverage check, `/ponytail-review`, architecture tests
  (`vitest run tests/architecture`), `vite build`, in-app verification.
- **Commit per story unit / stage, never one mega-commit** — each amendment
  must be individually revertible.
- If the episode is in `GRANDFATHERED_EPISODES` or
  `SENTENCE_CASE_GRANDFATHERED_EPISODES`
  (`tests/architecture/content-quality.test.js`) and the amended
  scope now passes, remove it from the relevant allowlist in the same
  commit — the list only shrinks, and only for what was actually fixed
  (don't remove an episode whose unamended screens still violate).
- Re-score the amended scope after fixing and report before/after per
  dimension.
- Append the amend outcome to the review log entry (or a follow-up entry).

## Hard rules

- Never invent a story spine or canonical fact to fill a gap — flag the
  gap instead.
- A concept is never treated as taught if it was only tested.
- Two competing accent boxes, two header styles for the same screen kind,
  or a second "key point" on one screen are governance failures, not style
  preferences — flag them as such, not as suggestions.
- Findings are never averaged into one score, at any stage of this skill.
