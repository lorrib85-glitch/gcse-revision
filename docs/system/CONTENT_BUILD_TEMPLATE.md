# Content build template

**Authority:** layers inside the locked module architectures
(`HISTORY_MODULE_ARCHITECTURE.md`, `SCIENCE_MODULE_BLUEPRINT.md`). Those
docs own section structure; this doc owns the rhythm and quality floor
*inside* the sections. Where they conflict, the locked architecture wins.

**Companion docs:** `docs/system/PATTERN_GOVERNANCE.md` (the taxonomy chain,
the one-primary-intent rule, and the review-to-rebuild pathway),
`docs/system/component-contracts/` (per-component execution standards),
`docs/system/GOLD_SCREEN_REGISTER.md` (the named composed gold example per
component), `src/data/componentFunctions.js` (function-tag taxonomy),
`tests/architecture/content-quality.test.js` (machine-checked floor).

**One pathway for all content work:** canonical objective → review decision
(Keep / Refine / Rebuild / Split / Cut) → amendment brief →
`content-create` implementation → composed render comparison → independent
post-build approval. New builds run `/content-create`; auditing and improving
built content runs `/content-review`, which writes the briefs `content-create`
implements and then re-audits the result independently. Both skills exist and
enforce this template and `PATTERN_GOVERNANCE.md`.

## Governing principle

Every screen must justify its existence. Removing a screen should
noticeably reduce understanding, retention or motivation. If it doesn't,
redesign or remove it.

## Story units — the shape

An episode's teaching sections are composed of **3–5 story units**. Each
unit is defined by a **dramatic question** taken from the episode's story
spine (in its canonical architecture file) and follows this beat pattern:

1. **Tension beat** — a scene, stake, or question; never a definition
   first. Component functions: `hook-tension`, `introduce-figure`.
2. **Teach beat** — the concept properly explained: cause → mechanism →
   consequence, in full sentences, *before* anything tests it. Component
   functions: `teach-mechanism`, `teach-comparison`.
3. **Interactive payoff** — the learner uses the idea just taught, and the
   payoff must resolve the unit's dramatic question. Component functions:
   `apply`, `classify`, `sequence-process`.
4. **Retrieval close** — quick check feeding `unifiedWeaknessTracker.js`.
   Component function: `retrieve`.

Beats name **component functions, never component names**. To pick the
component: match the content's shape to a function tag in
`src/data/componentFunctions.js`, then choose among the components
carrying that tag using the fit rules in their contracts (e.g. ordered
process → `evacuationChainRoute`; unordered pairs → `matchingTask`).

For non-narrative subjects (e.g. Maths), story units are tension-shaped
rather than narrative-shaped — "here is where this goes wrong for real
students" — with the same four beats.

## Composition selection — before implementation

Before building any planned screen, record its composition selection. This
is a required step: it forces every screen to resolve to one approved
composition route (`PATTERN_GOVERNANCE.md` → "Screen-composition routes")
rather than inventing its own shell, heading or rhythm.

For **every** planned screen, record:

- **Learning objective** — the GCSE thing the learner can do after it.
- **Primary screen intent** — the single communicative job (one sentence).
- **Approved component** — from the intent→component map.
- **Approved composition route** — Route A (teaching → `TeachScreenShell`),
  Route B (interaction-owned), or Route C (cinematic/full-screen).
- **Structural shell** — where relevant (`ContentShell` /
  `InteractionShell` / `CinematicShell`).
- **Content-level or screen-owning** — is the component rendered inside a
  route (content-level), or does its contract grant it full-screen ownership?

**Teaching and explanation screens default to `TeachScreenShell`** (Route A).
Choosing an interaction-owned (Route B) or cinematic/full-screen (Route C)
route requires explicit justification recorded here, pointing at the approved
contract that grants that component full-screen ownership.

Do not create a new full-screen component merely because no existing
component is an exact visual match. First determine whether the content
belongs inside an existing approved composition route — normally
`TeachScreenShell`.

## The hard floor — checklist

Items marked ⚙ are enforced by
`tests/architecture/content-quality.test.js`,
`tests/architecture/recovery-routing-integrity.test.js`, and
`tests/architecture/content-semantic-token-governance.test.js`; known
legacy debt is tracked by exact shrink-only fingerprints, not whole-episode
skips. Readability debt also carries a recorded maximum grade budget in
`tests/fixtures/content-quality-known-debt.js`, so a known screen cannot
quietly become harder to read while retaining the same location fingerprint.

- ⚙ Never more than 2 consecutive passive screens (a screen is passive
  when its type and all its blocks' types have interaction class
  `passive`)
- ⚙ Every teaching stage (each `stageNavigation` segment except the final
  exam-prep stage) contains at least one `assessed` screen
- ⚙ `stageNavigation` screenIndex values are strictly increasing, unique,
  and within bounds
- ⚙ All learner-facing text passes the readability check: plain language
  around the compulsory subject vocabulary, aiming for a reading age of 12
  (Flesch-Kincaid grade ≤ 7 per screen, exam vocabulary exempt). The
  collector includes nested learner text such as titles, labels, prompts,
  learning goals, bullets, narrative facts, profile lines, and answer
  options; it excludes IDs, tags, component types, asset paths, colours, and
  other implementation metadata. Separate answer options, bullets, profile
  lines, and facts are collected as separate text segments and joined with
  sentence boundaries for scoring; they must not be flattened into one
  artificial run-on sentence.
- ⚙ An exam-prep stage or `examinerExplains` screen must include examiner
  teaching and be followed by an assessed component whose registered
  function includes `exam-technique`.
- ⚙ Runtime lesson screens/reveal items/interaction data must not own raw
  presentation fields such as `color`, `colorRgb`, `bg`, or `colorLight`.
  Use semantic inputs (`tone`, `variant`, governed theme key) instead.
- ⚙ Recovery mappings must resolve to a real module and, for new non-null
  mappings, to an explicit screen carrying the same tag in loaded runtime
  content. Legacy screen-0 routes are individual-tag exceptions only.
- ⚙ Sentence-case debt is tracked by exact content-location fingerprints
  rather than whole-module exemptions. New title-case copy in a module with
  old debt must fail until fixed or intentionally baselined.
- A concept may not be tested before the screen that teaches it
- No orphan facts: every fact taught is retrieved or applied later in the
  episode
- Teach beats state *why* (cause/consequence), never only *what*
- Exam vocabulary is explained on first use

## The review rubric

Every episode is scored on six dimensions, each reported separately and
never averaged: **Story, Teaching, Retrieval, Interactions, Exam
preparation, Emotional engagement** — plus technical passes such as
**semantic tokens, image quality, UX design, canonical coverage, recovery
routing, and readability**. The machine checks above are structural and
semantic floors; visual quality still requires the 390px render pass, and
human judgement dimensions (story, teaching clarity, emotional engagement,
exam usefulness) must not be reduced to weak regex checks. Definitions live
in the spec
(`docs/superpowers/specs/2026-07-06-content-quality-framework-design.md`)
and are operationalised by the `content-create` and `content-review`
skills.
