# Content Quality Framework — Design

Date: 2026-07-06
Status: Approved in brainstorm, pending spec review
Lane: G (workflow governance) for the framework docs; C/E for the proof case

## Problem

The repo has extensive prescriptive quality documentation
(`LEARNING_EXPERIENCE_PRINCIPLES.md`, `TEACHING_VOICE_GUIDE.md`,
`PEDAGOGICAL_MODEL.md`, locked module architectures, per-episode canonical
files, a 9-point Module Completion Test) — yet built content is inconsistent
and often below the intended bar. Diagnosed failure modes, confirmed against
real episodes:

1. **Flat / passive screens** — walls of `read` blocks with emoji bullet
   lists (e.g. Episode 12 "When medicine became magic"), the exact
   "fact dumping" anti-pattern the docs forbid. Compliance with locked
   *structure* does not produce quality *execution*.
2. **Shallow teaching** — concepts tested before they are taught. The
   "Think Like Galen" theoryLab explains the Theory of Opposites in two
   sentences, then immediately tests it. An activity wearing the costume
   of a lesson.
3. **Inconsistent quality** — quality depends on which session built the
   episode. No reliable floor, no enforcement between "standards docs" and
   "shipped screens".
4. **Weak story flow** — the Section 1–6 architecture locks structure, but
   structure is not story. Episodes can be fully compliant with no
   narrative pull. Stage-navigation titles drift from actual screens
   (Episode 12 carries a TODO admitting this).

The quality bar exists as a concrete exemplar: the Episode 1 stretch
(cinematic intro → Hippocrates keyFigureReveal → four-humours hotspot →
Galen keyFigureReveal) has narrative momentum — each screen answers a
question the previous one raised, and interactions arrive as payoffs.
The framework's job is to make that stretch's qualities repeatable and
enforceable.

## Design principles

- **Exemplar-first.** Build sessions imitate concrete examples far more
  reliably than they follow abstract principles. Every standard is anchored
  to a named good example and a named below-bar counterexample from the
  codebase.
- **Function drives component choice.** Content shape selects the
  component, not author habit. This kills "default to `read` blocks".
- **The arc is decided before screens exist.** Story comes from the
  canonical stage, extracted from the inherent drama of the real material
  and selected by exam value — never invented ad hoc at build time.
- **One rubric, two directions.** The same standard powers new builds and
  back-catalogue review.
- **Dimensions are scored separately, never averaged into one number.** A
  chapter can have a brilliant story and poor retrieval; a single score
  would hide exactly that.
- **Machine-check what can be machine-checked.** Mechanical guardrails live
  in `tests/architecture/` and run in `pnpm verify` forever.
- **Every screen must justify its existence.** Removing a screen should
  noticeably reduce understanding, retention or motivation. If it doesn't,
  redesign or remove it.

## The review rubric — six dimensions + three technical passes

The shared rubric used by `content-create` self-critique, `content-review`,
and the Workflow C/E critique gate. Every episode is scored per dimension
(per screen where applicable), and each dimension reports separately.

**Six content dimensions:**

1. **Story** — does the episode follow its story spine? Does each story
   unit's dramatic question get raised, escalated, and resolved? Any
   narrative dead zones?
2. **Teaching** — is every concept explained cause → mechanism →
   consequence before it is tested? Depth sufficient to answer the exam
   question, not just recognise the term?
3. **Retrieval** — does every taught fact get retrieved or applied later?
   Do retrieval moments feed `unifiedWeaknessTracker.js`? Is spacing/
   interleaving present across the episode?
4. **Interactions** — is each interactive component the right function tag
   for the content shape? Does the execution meet its component contract,
   not just its concept?
5. **Exam preparation** — does the episode land on the exam payoff named
   in the story spine? Are mark-scheme thinking, examiner traps, and
   question-type practice present and specific?
6. **Emotional engagement** — stakes, tension, payoff, moments a
   15-year-old would remember. Would they willingly continue?

**Five technical passes (checked alongside the six dimensions):**

- **Hardcoded values** — colours, spacing, radii, motion, and typography
  must come from the token files (`src/constants/`); no magic values.
  Extends the existing `color-token-governance` architecture tests'
  coverage into content review.
- **Image quality** — images present where the screen design expects them,
  correct paths, appropriate format (`.webp` preferred), no stretched,
  low-resolution, or mismatched-subject imagery.
- **UX design** — text in clear hierarchy (per `TYPOGRAPHY_SYSTEM.md`
  tokens), positive white space (per `SPACING_SYSTEM.md`), correct subject
  colour branding (per `SUBJECT_THEME_SYSTEM.md` / `subjects.js`), one job
  per screen.
- **Canonical coverage** — diff the built episode against its canonical
  content file: every exam-relevant fact, figure, cause-and-effect link and
  spec point in the canonical file must appear in the episode (taught,
  applied, or retrieved), and anything in the episode absent from the
  canonical file is flagged as unsourced. Gaps are listed by canonical
  section so they can be closed surgically.
- ⚙ **Readability** — all learner-facing screen text must be concise,
  written in plain language around the compulsory subject vocabulary,
  aiming for a reading age of 12 (Flesch-Kincaid grade ≤ 7 or equivalent,
  measured per screen). GCSE deliberately introduces difficult vocabulary —
  that vocabulary stays, is exempt from the scoring, and must be explained
  on first use (e.g. "miasma", "osmosis"); it's the language *around* it
  that must be plain. Long sentences, stacked clauses and unnecessary
  jargon fail the pass. Simplify the language, never the accuracy.

## Deliverables

### 1. `docs/system/CONTENT_BUILD_TEMPLATE.md` — story units + hard floor

Layers *inside* the locked Section 1–6 / Parts 1–6 architectures without
modifying them.

**Story units (the shape).** An episode's teaching sections are composed of
3–5 story units. Each unit is defined by a dramatic question and follows the
beat pattern extracted from the Episode 1 gold stretch:

1. **Tension beat** — a scene, stake, or question; never a definition first
2. **Teach beat** — the concept properly explained (cause → mechanism →
   consequence, full sentences) *before* anything tests it
3. **Interactive payoff** — the learner uses the idea just taught; must
   resolve the unit's dramatic question
4. **Retrieval close** — quick check feeding `unifiedWeaknessTracker.js`

Beats reference **component functions, not component names** (see
Deliverable 2).

**Hard floor (the checklist).** Items marked ⚙ are machine-checkable and
become the architecture test (Deliverable 6):

- ⚙ Never more than 2 consecutive read-only screens/blocks
- ⚙ Every teaching section contains ≥1 interactive screen and ends in
  retrieval
- ⚙ Stage-navigation titles correspond to real screen indices
- A concept may not be tested before the screen that teaches it
- No orphan facts: every fact taught is retrieved or applied later in the
  episode
- Teach beats state *why* (cause/consequence), never only *what*

For non-narrative subjects (e.g. Maths), story units are tension-shaped
rather than narrative-shaped — "where this goes wrong for real students" —
same beat fields, different flavour.

### 2. Function-tag taxonomy on the Component Registry

Every screen type in `docs/components/COMPONENT_REGISTRY.md` gains one or
more **function tags** from a small fixed taxonomy. Draft taxonomy (~9 tags,
to be refined against the real component list during implementation):

`hook/tension` · `introduce-figure` · `teach-mechanism` ·
`teach-comparison` · `apply` · `classify` · `sequence-process` ·
`retrieve` · `exam-technique`

Selection rules live with the tags — generalising the existing CLAUDE.md
rule (ordered process → `EvacuationChainRoute`, unordered pairs →
`MatchingTask`) into a system. The build workflow selects the most
appropriate component for the content being taught by matching content
shape to function tag, then applying the fit rules.

### 3. `docs/system/component-contracts/` — per-component execution contracts

One short page per screen type, starting with the **6 most-used**
(`read` blocks, `theoryLab`, `matchingTask`, `keyFigureReveal`,
hotspot/`InteractiveHotspotImage`, `quickRecall`) — not all 40. Each
contract has three parts:

- **The bar** — a named reference example from the codebase (e.g. "the
  four-humours hotspot in Episode 1 is the standard") with 3 bullets on
  *why* it works
- **Copy standards** — full sentences vs fragments, minimum teaching depth
  before an interaction may test, tone per `TEACHING_VOICE_GUIDE.md`, no
  emoji-bullet fact walls
- **Known failure modes** — the 2–3 ways this component goes wrong, each
  with a real below-bar example (e.g. "Think Like Galen: theory explained
  in 2 sentences then immediately tested")

### 4. Two skills

- **`content-create`** (Lane E/C) — new content build pipeline:
  read canonical files → confirm/write story spine → decompose into story
  units → select components by function tag → build → self-critique against
  component contracts, including a canonical-coverage diff (nothing in the
  canonical file left untaught, nothing unsourced added) → architecture
  tests pass (incl. readability) → present to user.
- **`content-review`** (Lane C) — existing content audit + amend:
  score an episode per-screen across all six rubric dimensions plus the
  five technical passes → produce findings ranked per dimension (never a
  single blended score) → amend what's below bar → re-score.
  Same rubric as `content-create`; makes back-catalogue auditing mechanical.

Both skills declare their lane and slot into the existing triage system.

### 5. `canonical-topic` skill update — required Story spine section

The canonical **architecture file** gains a required **Story spine**
section, generated at canonical time from source material + exam value:

- **Dramatic question** — the one question the episode exists to answer
- **Stakes** — why a 15-year-old should care, one sentence
- **Escalation** — 3–5 story-unit questions in sequence, each raising the
  next
- **Resolution + exam payoff** — how the question resolves, and which exam
  question type this arc feeds

`content-create` *consumes* the spine; `content-review` checks built
screens against it. Existing canonical files (all of them) predate this:
the spine is added when an episode is next touched — no mass backfill.

### 6. `tests/architecture/content-quality.test.js`

Encodes the ⚙ guardrails from Deliverable 1 plus the ⚙ readability pass —
a Flesch-Kincaid (or equivalent) scorer over each screen's learner-facing
text with an exam-vocabulary exemption list. Runs in
`pnpm test:architecture` / `pnpm verify`. New episodes physically cannot
ship as bullet-list walls or as text a 12-year-old can't read. Existing below-bar episodes are grandfathered
via an explicit allowlist that shrinks as `content-review` fixes them —
the test fails on new violations and on regressions.

### 7. Critique gate in the content workflow

Workflow C and E docs gain a mandatory final stage for content builds:
a critique pass scoring every screen against the six rubric dimensions
(story spine, teaching, retrieval, interactions, exam preparation,
emotional engagement) and running the five technical passes (hardcoded
values, image quality, UX design, canonical coverage, readability).
Below-bar screens are flagged and fixed *before* the episode reaches user
review.

## Proof case

Before contracts are written for all six components, **rebuild the Galen
Theory of Opposites stretch in Episode 1** against the draft template and
draft contracts. What the rebuild teaches feeds back into the templates
before they are finalised. This is the validation step for the whole
framework.

## Rollout order

1. `CONTENT_BUILD_TEMPLATE.md` (draft) + function-tag taxonomy on the
   registry
2. Component contracts for the first 6 screen types (draft)
3. Proof case: Galen stretch rebuild → tune 1 and 2 → finalise
4. `content-create` and `content-review` skills
5. `canonical-topic` skill update (Story spine section)
6. `content-quality.test.js` + critique gate wired into Workflow C/E docs
7. `content-review` applied to the back-catalogue, worst episodes first
   (Episode 12 is a known candidate)

## Out of scope

- No changes to locked module architectures (`HISTORY_MODULE_ARCHITECTURE.md`,
  `SCIENCE_MODULE_BLUEPRINT.md`) — the template layers inside them
- No changes to locked components or the UI constitutions
- No mass backfill of story spines into existing canonical files
- No new screen-type components — the framework selects among existing ones
- Building new episodes (Roadmap Phases 2–5) — this framework is a
  prerequisite for that work, not part of it

## Success criteria

1. A build session given only the canonical files + this framework produces
   an episode whose screens pass the critique gate on first user review
2. `content-review` run on Episode 12 produces per-dimension findings that
   match the user's own instincts about what's wrong — including surfacing
   a case where one dimension scores well while another fails (e.g. strong
   story, weak retrieval), proving the dimensions are truly independent
3. The rebuilt Galen stretch is judged by the user to match the Episode 1
   gold stretch in quality
4. `content-quality.test.js` fails when fed Episode 12 as-is (proving the
   floor is real) while passing grandfathered allowlist entries
