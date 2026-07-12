---
name: content-review
description: >
  Diagnose and approve existing module content in the governed
  review-to-rebuild pipeline — states each screen's one primary intent,
  checks it against the learning objective, scores the 9-field contracts and
  intent→component map, runs the mandatory 390px render pass against the gold
  register, then assigns every screen one decision (Keep / Refine / Rebuild /
  Split / Cut) and writes a structured amendment brief for each Refine /
  Rebuild / Split. Implementation is done by content-create; this skill then
  re-audits the result independently (implemented ≠ approved). Findings are
  per-dimension, never a single blended score. Use for reviewing or improving
  any already-built episode/module (Lane C).
argument-hint: "<module id or episode title> [stage name | screen range] [audit-only]"
---

# Content review

Audits a built episode against the content quality framework, assigns each
screen a decision, and writes the amendment briefs `content-create`
implements — then approves the result independently. Runs in Lane C after
`/gcse-triage`. Pass `audit-only` to stop after the findings report (no
briefs acted on, no code changes).

This is the **diagnose-and-approve** half of the governed review-to-rebuild
pipeline specified in
`docs/superpowers/specs/2026-07-06-content-quality-framework-design.md` and
built per `docs/superpowers/plans/2026-07-06-content-quality-framework.md`
(Task 7, revised by that plan's Addendum 2, Gaps 1–6). `content-create` is
the companion build-side skill and **exists** — this skill diagnoses and
writes amendment briefs, `content-create` implements the confirmed briefs,
and this skill re-audits the result independently. The one consistent
pathway is:

> canonical objective → review decision (Keep / Refine / Rebuild / Split /
> Cut) → amendment brief → `content-create` implementation → composed render
> comparison → independent post-build approval.

## Three stages, never collapsed

This skill runs at **two** of the pipeline's three stages; `content-create`
owns the middle one. Keeping them separate is the point — "implemented" is
never the same as "approved".

- **Stage A — diagnose (this skill).** Audit, record evidence, assign each
  screen one of Keep / Refine / Rebuild / Split / Cut, write a structured
  amendment brief for every Refine / Rebuild / Split, and **stop for user
  confirmation.** No amendment begins before the brief exists and is
  confirmed.
- **Stage B — implement (`content-create`).** Builds only the confirmed
  briefs, does not expand scope, renders the composed screens, records any
  unavoidable deviation. Its output is *implemented*, not *approved*.
- **Stage C — approve (this skill again, independently).** Re-audit the
  amended scope, comparing before / after / named gold example. **Do not
  accept the builder's self-assessment as evidence** — re-render and
  re-check. The same session output must never treat "implemented" as
  equivalent to "approved".

## Scope argument

`content-review <module id> [stage name | screen range] [audit-only]`

- No second argument: review the whole episode.
- A stage name (matching a `stageNavigation` entry) or a screen range
  (`12-18`): review only that slice. A stage is the realistic unit of work
  — prefer "review the Galen stage" over a whole-episode audit when the
  user names a specific area.
- `audit-only`: report findings and stop. Without it, the skill still
  **checkpoints by default** — see "Stop for confirmation" below — so
  `audit-only` mainly matters for pre-authorising the amend step in the
  invocation itself.

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
6. `docs/system/GOLD_SCREEN_REGISTER.md` — the named gold example (and
   below-bar counterexample) for every component reviewed; the render pass
   compares against these, not against taste.
7. The episode's previous review log, if one exists (see Review log below)
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
4. **Composition route** — for the in-module screen, identify and record:
   (a) its one primary intent, (b) the approved component serving it,
   (c) the approved learning-composition route (A teaching → `TeachScreenShell`
   / B interaction-owned / C cinematic — `PATTERN_GOVERNANCE.md`),
   (d) the structural shell used where relevant, (e) whether the route
   matches the learning intent, and (f) for any screen-owning component,
   whether its contract explicitly grants full-screen composition ownership.
   Check for and fail on:
   - generic or ad-hoc screen composition (a bare shell with hand-spaced
     `<div>`s instead of a route)
   - local screen-heading styles; local title-weight overrides; local
     title-size overrides
   - bespoke screen-level vertical rhythm
   - duplicate screen headings; a supporting heading competing with the
     primary title
   - use of a full-screen route without documented ownership
   - "cinematic" used as an unsupported exception
   - an interaction component claiming screen ownership without contract
     approval

   > **Fail** any in-module screen that uses a generic shell, local heading
   > treatment or ad-hoc vertical spacing where `TeachScreenShell` or another
   > approved composition route exists.

   > A valid token spread does not automatically pass hierarchy review. The
   > composed screen must still have one obvious typographic focal point at
   > the required mobile render width (390px) — decided in the render pass,
   > not from source.

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
4. Compare critically against a bar. Put the screenshot beside its **named
   gold example** (`GOLD_SCREEN_REGISTER.md`) and, for an amend, beside the
   **before** version, and answer **every** one of these in writing — this
   is the strengthened visual verdict, and none of it may be skipped:
   - What is objectively better?
   - What became worse?
   - Does the learning objective land more quickly?
   - Can a tired learner understand the screen's job and next action within
     three seconds?
   - Is one element clearly dominant?
   - Is the learner doing something cognitively meaningful?
   - Does any element compete with the primary intent?
   - Would removing any element improve clarity?
   - Does the result meet or exceed the named gold example?
   - Is there any clipping, density, hierarchy, spacing, image-relevance or
     CTA-visibility problem?

   **"Looks clean", "looks polished" and "more engaging" are not acceptable
   verdicts.** Every claim is backed by what is on the pixels. A verdict
   with no evidence fails the review, not the screen.

If a 👁 check genuinely cannot be run (e.g. a screen behind a blocking
assessed interaction the jump can't skip past, or the environment blocks
rendering entirely), say so explicitly in the findings and the review log —
name which state could not be captured. Silent skipping is a review failure,
not an acceptable shortcut.

## Findings report format

Per rubric dimension: a rating (strong / adequate / below bar) plus
findings as `screen <index> — <what's wrong> — <what fixing it looks
like>`, ordered most-damaging first. Precede the six dimensions with the
per-screen one-primary-intent / objective-match / contract results from
Audit steps 1–3. End with the canonical coverage diff (or the degraded-mode
note) and the technical-pass results, including every readability/
sentence-case violation `check-content-quality.mjs` reported. No single
overall score, ever.

## Screen decision — every screen gets exactly one

After the audit, assign **every screen in scope** one explicit decision.
There is no "leave it, roughly fine" — the decision is stated:

- **Keep** — meets the bar; no amendment.
- **Refine** — right component, right objective, but execution is below bar
  (copy, hierarchy, readability, a weak distractor). A targeted fix.
- **Rebuild** — right objective, wrong or badly-executed approach; the screen
  is rebuilt from its objective and intent (often a component change).
- **Split** — more than one primary intent on one screen; it becomes two or
  more screens, each with one job.
- **Cut** — serves no learning objective, or fails the deletion test
  (removing it does not reduce understanding, retention or motivation).

Record the decision per screen in the findings and the review log.

## The amendment brief — required for every Refine / Rebuild / Split

A decision of Refine, Rebuild or Split does not authorise any editing on its
own. **The review must produce a structured amendment brief first, and the
brief is what `content-create` implements** (Stage B). No amendment begins
before the brief exists and the user has confirmed it. Each brief contains
**all** of these fields:

- **Module ID**
- **Screen index**
- **Current component**
- **Decision** (Refine / Rebuild / Split)
- **Canonical learning objective** (from the canonical file / spine)
- **One primary screen intent** — a single sentence
- **Exact learner misunderstanding or learning need** the screen addresses
- **Approved replacement component** (from the intent→component map;
  unchanged for a Refine)
- **Reason the component matches the content shape**
- **Named component contract** (`component-contracts/<file>.md`)
- **Named gold example** (`GOLD_SCREEN_REGISTER.md` entry — or the explicit
  "No verified composed gold example yet" if none exists)
- **Required content / evidence** — the canonical facts the screen must carry
- **Required learner action** — what the learner does (teach / retrieve /
  apply / exam-technique; never blur them, never test before teach)
- **Intended learning payoff** — why this improves understanding, retention,
  application or motivation
- **Content or visual elements that must NOT appear** — the specific things to
  keep off the screen (a second key point, decorative uppercase, a box in a
  box, imagery the manifest doesn't cover)
- **390px visual acceptance criteria** — the concrete render checks the
  rebuilt screen must pass
- **Retained elements from the current screen** — what is explicitly kept, so
  the rebuild doesn't discard working content
- **Known risks** — including content loss, repetition, or increased density

### No vague recommendations

A brief (and any finding) must describe **what fixing the problem looks like
and why it improves learning.** These are not acceptable and must never
appear as a recommendation:

- "make this more engaging"
- "improve hierarchy"
- "add interactivity"
- "make it more cinematic"

Each of these is a symptom, not an instruction. Replace it with the concrete
change (which element, to what, in service of which intent) and the learning
reason it helps.

## Review log

Write findings to a persisted per-episode log:
`docs/content/<subject>/<series>/<NN>_Review_Log.md` (matching the
`NN_` canonical-file naming). Create it if it doesn't exist. Append
entries **newest-first**, each with:

- date, session scope (full episode / stage / screen range), canonical
  files available yes/no, and which stage this entry records
  (A diagnose / B build / C approve)
- per-dimension ratings + findings (the report above)
- the per-screen decision (Keep / Refine / Rebuild / Split / Cut) and, for
  each Refine/Rebuild/Split, the amendment brief (or a reference to it)
- the five technical-pass results
- what was implemented by `content-create` (with commit hashes and any
  recorded deviations) vs accepted-as-is vs deferred
- the Stage-C independent re-audit result and any named trade-off —
  "implemented" and "approved" logged as separate facts

Read the previous entry (if any) before auditing. A finding marked
"deferred" in a prior entry is a first-class input this time — don't
re-discover it from scratch, and don't let it silently drop.

## Stop for confirmation (end of Stage A)

Present the findings report **and the amendment briefs**, then **stop for
user confirmation before any amendment begins** — this is the default, not
just what `audit-only` produces. `audit-only` remains available for
report-only runs, and the user can pre-authorise the amend step in the
invocation ("review and fix the Galen stage"). **The briefs must exist and
be confirmed before implementation** — a decision without a confirmed brief
does not authorise editing.

## Implementation is `content-create` (Stage B — not this skill)

Confirmed briefs are implemented by **`content-create`**, not by editing
inside this review. That is the separation of diagnosis from implementation:
this skill decides *what* changes and *why*; `content-create` builds it,
resolving each brief through the taxonomy chain, rendering the composed
screen, and recording any unavoidable deviation from the brief. It does not
expand scope beyond the confirmed briefs. (For a small, single-field copy fix
the review may hand-edit directly per Workflow C, but anything reaching for a
component change or a rebuild goes through `content-create`.)

`content-create` follows Workflow C when amending built content: coverage
check, `/ponytail-review`, architecture tests
(`vitest run tests/architecture`), `vite build`, in-app verification, and
**commit per screen / story unit / stage, never one mega-commit**. If the
episode is in `GRANDFATHERED_EPISODES` or
`SENTENCE_CASE_GRANDFATHERED_EPISODES`
(`tests/architecture/content-quality.test.js`) and the amended scope now
passes, it removes the episode from the relevant allowlist in the same commit
— the list only shrinks, and only for what was actually fixed.

## Post-build approval (Stage C — this skill, independently)

After `content-create` reports the amended scope as *implemented*, run this
skill **again as an independent re-audit** of the amended scope. This is the
approval stage, and it is deliberately not the same act as building:

- **Do not accept the builder's self-assessment as evidence.** Re-render each
  amended screen at 390px yourself and run the strengthened visual verdict
  against **before / after / named gold example**. "The build says it's
  fixed" is not a finding.
- Re-score the amended scope per the six dimensions and report before/after.
- **Name every trade-off.** An amendment must not improve one dimension by
  silently damaging another. Check explicitly for each of these, and if any
  is present, report it as a finding rather than approving:
  - stronger visual design but weaker teaching
  - simpler copy but lost GCSE precision
  - more interaction but less meaningful thinking
  - more cinematic imagery but poorer readability
  - improved hierarchy but missing content
  - reduced density but fragmented learning
  - stronger story but weaker exam preparation
- Only when the re-audit clears the bar with no unreported trade-off is the
  amended scope **approved**. Append the Stage-C outcome to the review log,
  distinct from the Stage-B build entry — "implemented" and "approved" are
  separate log facts.

## Hard rules

- Never invent a story spine or canonical fact to fill a gap — flag the
  gap instead.
- A concept is never treated as taught if it was only tested.
- Two competing accent boxes, two header styles for the same screen kind,
  or a second "key point" on one screen are governance failures, not style
  preferences — flag them as such, not as suggestions.
- A generic shell, local screen-heading treatment, or ad-hoc vertical rhythm
  on a screen an approved composition route already covers is a governance
  failure — flag it, don't accept it as an existing pattern.
- A full-screen / "cinematic" route without documented contract ownership,
  or an interaction claiming screen ownership without contract approval, is a
  governance failure.
- Source inspection alone never passes composition or visual hierarchy — the
  mandatory 390px render pass is required.
- Findings are never averaged into one score, at any stage of this skill.
