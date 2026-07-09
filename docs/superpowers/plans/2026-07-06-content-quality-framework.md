# Content Quality Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the content quality framework specified in `docs/superpowers/specs/2026-07-06-content-quality-framework-design.md` — story-unit build template, function-tagged component selection, per-component execution contracts, a machine-checked quality floor, two content skills, canonical story spines, and workflow wiring.

**Architecture:** A machine-readable taxonomy module (`src/data/componentFunctions.js`) is the single source of truth for screen-type functions and interaction classes; docs, skills, and the new architecture test all consume it. Quality standards are exemplar-first docs; enforcement is a Vitest architecture test plus a critique gate in the content workflows. The Galen stretch rebuild validates the templates before the skills are finalised.

**Tech Stack:** Markdown docs, plain ES modules, Vitest (existing `tests/architecture/` conventions). No new dependencies.

## Global Constraints

- All commits go directly to `main` (CLAUDE.md rule; overrides session branch instructions)
- Sentence case for all titles/headings written into the codebase
- No new npm dependencies — readability scoring is implemented in plain JS
- Locked components and locked architecture docs (`HISTORY_MODULE_ARCHITECTURE.md`, `SCIENCE_MODULE_BLUEPRINT.md`) are never modified — the template layers inside them
- Six rubric dimensions (Story, Teaching, Retrieval, Interactions, Exam preparation, Emotional engagement) are always reported separately, never averaged into one number
- Readability rule wording is exactly: "plain language around the compulsory subject vocabulary, aiming for a reading age of 12" — exam vocabulary is exempt from scoring but must be explained on first use
- Design principle to carry into every doc written: "Every screen must justify its existence. Removing a screen should noticeably reduce understanding, retention or motivation. If it doesn't, redesign or remove it."
- Verification command for every task: `pnpm test:architecture` and (when app source changed) `./node_modules/.bin/vite build`

---

### Task 1: Function-tag taxonomy module

**Files:**
- Create: `src/data/componentFunctions.js`
- Test: `tests/architecture/content-quality.test.js` (first describe block only; the file grows in Task 5)

**Interfaces:**
- Produces: `FUNCTION_TAGS` (string[]), `SCREEN_TYPE_FUNCTIONS` (object: type → `{ functions: string[], interaction: 'passive'|'reveal'|'assessed' }`), `getTypeInfo(type)`, `isPassive(type)`, `isAssessed(type)`. Tasks 2, 3, 5, 6, 7 rely on these exact names.

- [ ] **Step 1: Write the failing completeness test**

Create `tests/architecture/content-quality.test.js`:

```js
import { describe, it, expect } from 'vitest'
import {
  FUNCTION_TAGS,
  SCREEN_TYPE_FUNCTIONS,
  getTypeInfo,
  isPassive,
  isAssessed,
} from '../../src/data/componentFunctions.js'
import { MEDICINE_EPISODES } from '../../src/content/history/medicine/index.js'

// Every display type used by real content, gathered from screens and their
// nested blocks. Types inside answer options (e.g. 'weak'/'strong' evidence
// labels) are not display types and are excluded by only walking
// screen.type and screen.blocks[].type.
function collectUsedTypes() {
  const types = new Set()
  for (const ep of MEDICINE_EPISODES) {
    for (const screen of ep.screens ?? []) {
      if (screen.type) types.add(screen.type)
      for (const block of screen.blocks ?? []) {
        if (block.type) types.add(block.type)
      }
    }
  }
  return [...types].sort()
}

describe('Component function taxonomy', () => {
  it('defines the nine agreed function tags', () => {
    expect(FUNCTION_TAGS).toEqual([
      'hook-tension',
      'introduce-figure',
      'teach-mechanism',
      'teach-comparison',
      'apply',
      'classify',
      'sequence-process',
      'retrieve',
      'exam-technique',
    ])
  })

  it('every display type used in built content is registered', () => {
    const unregistered = collectUsedTypes().filter(t => !SCREEN_TYPE_FUNCTIONS[t])
    expect(unregistered, `unregistered display types: ${unregistered.join(', ')}`).toEqual([])
  })

  it('every registered type has valid functions and an interaction class', () => {
    for (const [type, info] of Object.entries(SCREEN_TYPE_FUNCTIONS)) {
      expect(info.functions.length, `${type} has no functions`).toBeGreaterThan(0)
      for (const fn of info.functions) {
        expect(FUNCTION_TAGS, `${type} has unknown function "${fn}"`).toContain(fn)
      }
      expect(['passive', 'reveal', 'assessed'], `${type} interaction`).toContain(info.interaction)
    }
  })

  it('helpers agree with the map', () => {
    expect(isPassive('read')).toBe(true)
    expect(isAssessed('quiz')).toBe(true)
    expect(isPassive('quiz')).toBe(false)
    expect(getTypeInfo('read').functions).toContain('teach-mechanism')
    expect(getTypeInfo('nonexistent-type')).toBeNull()
  })
})
```

Note: check `src/content/history/medicine/index.js` first — if `MEDICINE_EPISODES` doesn't export the full episode objects (with `screens`), import episodes individually following the exact pattern at the top of `tests/architecture/content-registry.test.js` and build the array locally. This applies to every use of `MEDICINE_EPISODES` in this file (Tasks 1 and 5).

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run tests/architecture/content-quality.test.js`
Expected: FAIL — cannot resolve `src/data/componentFunctions.js`

- [ ] **Step 3: Implement the taxonomy module**

Create `src/data/componentFunctions.js`. The interaction classes: `passive` = learner only reads/continues; `reveal` = learner taps/pans to progress a reveal but gives no answer; `assessed` = learner gives an answer or makes a decision that can be evaluated. Seed the map with every type from the census below, then extend with whatever Step 4's failure output reports (the completeness test is the authority — any type it names must be added with an accurate classification, judged by reading that component's registry entry):

```js
// ─── Component function taxonomy ────────────────────────────────────────
// Single source of truth mapping every content display type (screen types
// and block types) to its pedagogical functions and interaction class.
// Consumed by: docs/components/COMPONENT_REGISTRY.md (human view),
// docs/system/CONTENT_BUILD_TEMPLATE.md (beat pattern references
// functions, not components), the content-create / content-review skills
// (component selection + audit), and
// tests/architecture/content-quality.test.js (quality floor).
//
// interaction: 'passive'  — learner only reads or taps Continue
//              'reveal'   — learner taps/pans to progress, gives no answer
//              'assessed' — learner answers or decides; can be right/wrong

export const FUNCTION_TAGS = [
  'hook-tension',
  'introduce-figure',
  'teach-mechanism',
  'teach-comparison',
  'apply',
  'classify',
  'sequence-process',
  'retrieve',
  'exam-technique',
]

export const SCREEN_TYPE_FUNCTIONS = {
  // Passive display blocks
  read: { functions: ['teach-mechanism'], interaction: 'passive' },
  keypoint: { functions: ['teach-mechanism'], interaction: 'passive' },
  funfact: { functions: ['hook-tension'], interaction: 'passive' },
  examtip: { functions: ['exam-technique'], interaction: 'passive' },
  cinematic: { functions: ['hook-tension'], interaction: 'passive' },
  examinerExplains: { functions: ['exam-technique'], interaction: 'passive' },
  visualNarrative: { functions: ['hook-tension', 'teach-mechanism'], interaction: 'passive' },

  // Reveal interactions — active but unassessed
  conceptReveal: { functions: ['teach-mechanism'], interaction: 'reveal' },
  visualLearning: { functions: ['hook-tension', 'teach-mechanism'], interaction: 'reveal' },
  explainReveal: { functions: ['teach-mechanism'], interaction: 'reveal' },
  keyFigureReveal: { functions: ['introduce-figure'], interaction: 'reveal' },
  theoryCompare: { functions: ['teach-comparison'], interaction: 'reveal' },
  timelineCanvas: { functions: ['sequence-process'], interaction: 'reveal' },
  progressionTimeline: { functions: ['sequence-process'], interaction: 'reveal' },
  beforeAfterSlider: { functions: ['teach-comparison'], interaction: 'reveal' },
  collectionExplorer: { functions: ['teach-mechanism'], interaction: 'reveal' },
  flashcards: { functions: ['retrieve'], interaction: 'reveal' },

  // Assessed interactions
  quiz: { functions: ['retrieve'], interaction: 'assessed' },
  choice: { functions: ['retrieve'], interaction: 'assessed' },
  truefalse: { functions: ['retrieve'], interaction: 'assessed' },
  connection: { functions: ['retrieve'], interaction: 'assessed' },
  fillblanks: { functions: ['retrieve'], interaction: 'assessed' },
  tieredquiz: { functions: ['retrieve'], interaction: 'assessed' },
  quickRecall: { functions: ['retrieve'], interaction: 'assessed' },
  priorKnowledgeRecall: { functions: ['retrieve'], interaction: 'assessed' },
  boss: { functions: ['retrieve', 'apply'], interaction: 'assessed' },
  colsort: { functions: ['classify'], interaction: 'assessed' },
  naturalSupernaturalSwipe: { functions: ['classify'], interaction: 'assessed' },
  matchingTask: { functions: ['classify'], interaction: 'assessed' },
  misconceptionCheck: { functions: ['retrieve', 'exam-technique'], interaction: 'assessed' },
  theoryLab: { functions: ['apply'], interaction: 'assessed' },
  medicalTheoryPrescription: { functions: ['apply'], interaction: 'assessed' },
  appliedscenario: { functions: ['apply'], interaction: 'assessed' },
  guidedChoiceCarousel: { functions: ['apply'], interaction: 'assessed' },
  interactiveImage: { functions: ['teach-mechanism', 'apply'], interaction: 'assessed' },
  evacuationChainRoute: { functions: ['sequence-process'], interaction: 'assessed' },
  timelinedrag: { functions: ['sequence-process'], interaction: 'assessed' },
  factorWeb: { functions: ['teach-comparison', 'apply'], interaction: 'assessed' },
  connectionMap: { functions: ['teach-comparison', 'apply'], interaction: 'assessed' },
  faceExaminer: { functions: ['exam-technique'], interaction: 'assessed' },
  guidedExamResponse: { functions: ['exam-technique'], interaction: 'assessed' },
  examscored: { functions: ['exam-technique'], interaction: 'assessed' },
  spotTheError: { functions: ['exam-technique', 'apply'], interaction: 'assessed' },
}

export function getTypeInfo(type) {
  return SCREEN_TYPE_FUNCTIONS[type] ?? null
}

export function isPassive(type) {
  return getTypeInfo(type)?.interaction === 'passive'
}

export function isAssessed(type) {
  return getTypeInfo(type)?.interaction === 'assessed'
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run tests/architecture/content-quality.test.js`
Expected: PASS. If the completeness test names unregistered types (the census above came from a grep and may be incomplete), add each named type to the map with an accurate `functions`/`interaction` classification (consult its entry in `docs/components/COMPONENT_REGISTRY.md`) and re-run until green.

- [ ] **Step 5: Run the full architecture suite and commit**

Run: `./node_modules/.bin/vitest run tests/architecture` — expected: all pass.

```bash
git add src/data/componentFunctions.js tests/architecture/content-quality.test.js
git commit -m "Add component function taxonomy with completeness test"
git push -u origin main
```

---

### Task 2: Content build template + registry integration

**Files:**
- Create: `docs/system/CONTENT_BUILD_TEMPLATE.md`
- Modify: `docs/components/COMPONENT_REGISTRY.md` (add function-tag reference to the "How to Use This Registry" section)
- Modify: `docs/system/00_SYSTEM_INDEX.md` (register the new doc in the order of authority)

**Interfaces:**
- Consumes: `FUNCTION_TAGS`, interaction classes from Task 1
- Produces: the story-unit beat pattern and hard-floor checklist that Tasks 3–7 reference verbatim

- [ ] **Step 1: Write `docs/system/CONTENT_BUILD_TEMPLATE.md`**

Full content (this is the doc — write it exactly, then refine wording only if a statement is factually wrong for this repo):

```markdown
# Content build template

**Authority:** layers inside the locked module architectures
(`HISTORY_MODULE_ARCHITECTURE.md`, `SCIENCE_MODULE_BLUEPRINT.md`). Those
docs own section structure; this doc owns the rhythm and quality floor
*inside* the sections. Where they conflict, the locked architecture wins.

**Companion docs:** `docs/system/component-contracts/` (per-component
execution standards), `src/data/componentFunctions.js` (function-tag
taxonomy), `tests/architecture/content-quality.test.js` (machine-checked
floor).

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

## The hard floor — checklist

Items marked ⚙ are enforced by
`tests/architecture/content-quality.test.js` and cannot regress.

- ⚙ Never more than 2 consecutive passive screens (a screen is passive
  when its type and all its blocks' types have interaction class
  `passive`)
- ⚙ Every teaching stage (each `stageNavigation` segment except the final
  exam-prep stage) contains at least one `assessed` screen
- ⚙ `stageNavigation` screenIndex values are strictly increasing, unique,
  and within bounds
- ⚙ All learner-facing text passes the readability check: plain language
  around the compulsory subject vocabulary, aiming for a reading age of 12
  (Flesch-Kincaid grade ≤ 7 per screen, exam vocabulary exempt)
- A concept may not be tested before the screen that teaches it
- No orphan facts: every fact taught is retrieved or applied later in the
  episode
- Teach beats state *why* (cause/consequence), never only *what*
- Exam vocabulary is explained on first use

## The review rubric

Every episode is scored on six dimensions, each reported separately and
never averaged: **Story, Teaching, Retrieval, Interactions, Exam
preparation, Emotional engagement** — plus five technical passes:
**hardcoded values, image quality, UX design, canonical coverage,
readability**. Definitions live in the spec
(`docs/superpowers/specs/2026-07-06-content-quality-framework-design.md`)
and are operationalised by the `content-create` and `content-review`
skills.
```

- [ ] **Step 2: Add the function-tag pointer to the Component Registry**

In `docs/components/COMPONENT_REGISTRY.md`, at the end of the "How to Use This Registry" section, append:

```markdown
**Function tags:** every learning component's display type is mapped to
pedagogical function tags and an interaction class (`passive` / `reveal` /
`assessed`) in `src/data/componentFunctions.js` — the machine-readable
source of truth. Content builds select components by function, not by
name: see `docs/system/CONTENT_BUILD_TEMPLATE.md`. When adding a component,
register its display type there in the same change (the architecture test
fails otherwise once content uses it).
```

- [ ] **Step 3: Register the doc in `docs/system/00_SYSTEM_INDEX.md`**

Read the index, add `CONTENT_BUILD_TEMPLATE.md` at the same priority tier as `LEARNING_EXPERIENCE_PRINCIPLES.md` with a one-line description ("Story-unit rhythm and machine-checked quality floor for all module content"), following the file's existing table format exactly.

- [ ] **Step 4: Verify and commit**

Run: `./node_modules/.bin/vitest run tests/architecture` — expected: all pass (docs-only change).

```bash
git add docs/system/CONTENT_BUILD_TEMPLATE.md docs/components/COMPONENT_REGISTRY.md docs/system/00_SYSTEM_INDEX.md
git commit -m "Add content build template and function-tag registry integration"
git push -u origin main
```

---

### Task 3: Component execution contracts (first six)

**Files:**
- Create: `docs/system/component-contracts/README.md`
- Create: `docs/system/component-contracts/read-blocks.md`
- Create: `docs/system/component-contracts/theory-lab.md`
- Create: `docs/system/component-contracts/matching-task.md`
- Create: `docs/system/component-contracts/key-figure-reveal.md`
- Create: `docs/system/component-contracts/interactive-hotspot-image.md`
- Create: `docs/system/component-contracts/quick-recall.md`

**Interfaces:**
- Consumes: beat pattern + floor from Task 2; function tags from Task 1
- Produces: the per-component standards the Galen rebuild (Task 4), the skills (Tasks 6–7) and the critique gate (Task 9) check against

Every contract uses this exact three-part structure. `theory-lab.md` is written out in full below as the pattern; write the other five to the same depth using the guidance given for each. Before writing each contract, read the component's source in `src/components/learning/` and its registry entry so props and behaviour statements are accurate.

- [ ] **Step 1: Write `README.md`**

```markdown
# Component execution contracts

One page per content display type: what the bar is (a named example from
the codebase and why it works), the copy standards, and the known failure
modes. Consumed by the content-create and content-review skills and the
Workflow C/E critique gate.

A contract governs *execution quality* — it never redefines the
component's API or overrides a LOCKED component's internals.

Contracts so far: read-blocks, theory-lab, matching-task,
key-figure-reveal, interactive-hotspot-image, quick-recall. When content
work repeatedly hits quality problems on an uncontracted component, write
its contract as part of that work (Lane G change).
```

- [ ] **Step 2: Write `theory-lab.md` (the full pattern)**

```markdown
# Contract — theoryLab

**Component:** `src/components/learning/TheoryLab.jsx` · display type
`theoryLab` · functions: `apply` · interaction: `assessed`

## The bar

The rebuilt "Think like Galen" stretch in Episode 1
(`src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`,
stage "Galen") is the standard. It works because:

- The theory is *taught before it is tested*: the preceding teach beat
  explains cause → mechanism → consequence (humours ↔ qualities ↔
  treatment logic) in full sentences, so the lab is applying knowledge the
  learner actually holds.
- Every stage of the lab (scenario → diagnosis → prescription →
  evaluation) advances one dramatic question rather than presenting
  disconnected mini-tasks.
- The evaluation stage lands the exam payoff: why the theory persisted,
  and what the examiner expects the learner to say about it.

## Copy standards

- `explanation` must carry the full causal chain in complete sentences —
  a two-sentence summary is below the bar.
- `outcome.lines` and other short-line fields are for rhythm, not for
  carrying teaching: no load-bearing fact may exist *only* as a fragment.
- Feedback lines explain *why* the answer is right or wrong in terms of
  the theory's logic, not just restate the correct answer.
- Plain language around the compulsory subject vocabulary, aiming for a
  reading age of 12; vocabulary explained on first use.

## Known failure modes

1. **Testing before teaching** — the lab opens with a scenario the learner
   has no tools for. Below-bar example: the pre-rebuild "Think like Galen"
   screen explained the Theory of Opposites in two sentences, then
   immediately tested prescriptions.
2. **Fragment copy** — evaluation and outcome stages collapse into
   two-word fragments ("Too much heat.") that carry teaching weight
   nothing else carries.
3. **Missing exam payoff** — the lab ends at "correct!" without the
   evaluation stage connecting the theory to why it matters in the exam.
```

- [ ] **Step 3: Write the remaining five contracts (same structure, same depth)**

- `read-blocks.md` — covers `read`, `keypoint`, `examtip`, `funfact` (functions per taxonomy; all `passive`). The bar: a `read` block that sets up an interaction within the same story unit. Copy standards: full sentences; a `read` block teaches at most one causal chain; never more than 2 consecutive passive screens (⚙); no emoji-bullet fact walls — if the content is a list of more than 3 parallel facts, it belongs in an interactive component (`classify`, `matchingTask`) instead. Failure modes: (1) the Episode 12 pattern — walls of `<br/>`-bulleted facts with emoji icons carrying an entire topic passively (name Episode 12 screen 1 "From Guesswork to Precision" as the below-bar example); (2) the encyclopaedia screen — information with no exam value; (3) definition-first openings where a tension beat should be.
- `matching-task.md` — the user's known case of "like the concept, not the execution". Bar: pairs whose matching *requires understanding*, not surface word-association; round sizes within the component's split threshold; every pair's terms appear in prior teach beats. Failure modes: (1) guessable pairs (one option shares a word with the prompt); (2) matching used for *ordered* processes — use `evacuationChainRoute` (this is the existing CLAUDE.md fit rule — restate it here); (3) pair text so long the cards wrap and the connector lines lose meaning.
- `key-figure-reveal.md` — bar: the Hippocrates and Galen reveals in Episode 1 (name them; say why: portrait hero with a significance statement that frames the coming unit, knowledge sections that each carry one idea, a story detail that makes the figure memorable — "the pig fell instantly silent"). Failure modes: (1) CV-recitation (born/died/wrote lists); (2) significance statement that states importance without stakes; (3) more than 4 knowledge sections.
- `interactive-hotspot-image.md` — bar: the four-humours hotspot in Episode 1 (`four-humours-hotspot`) — say why: each hotspot answers "what is this and why does it matter", two-phase intro→explore gives orientation before interaction, and the set of hotspots together resolves the unit's question. Failure modes: (1) hotspots as decoration (tap reveals a caption, not a concept); (2) unclear tap targets; (3) hotspot text over-long for a phone overlay.
- `quick-recall.md` — covers `quickRecall` and inline `quiz`/`choice`/`truefalse`/`connection` blocks. Bar: questions that retrieve what *this episode* taught, at the level the exam needs, with explanations that re-teach on a wrong answer. Standards: every wrong answer logs through `unifiedWeaknessTracker.js`; distractors are plausible misconceptions, never jokes; hints point at the reasoning, not the answer. Failure modes: (1) retrieval of facts the episode never taught; (2) giveaway distractors; (3) explanation that restates the correct option without the why.

- [ ] **Step 4: Verify and commit**

Run: `./node_modules/.bin/vitest run tests/architecture` — expected: all pass.

```bash
git add docs/system/component-contracts/
git commit -m "Add execution contracts for the six most-used content components"
git push -u origin main
```

---

### Task 4: Proof case — rebuild the Galen theory-of-opposites stretch

**Files:**
- Modify: `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js` (the `stage: 'Galen'` screens, currently around lines 263–430: keyFigureReveal → theoryLab → quickRecall)
- Modify (if tuning needed): `docs/system/CONTENT_BUILD_TEMPLATE.md`, `docs/system/component-contracts/theory-lab.md`

**Interfaces:**
- Consumes: build template beat pattern (Task 2), theory-lab + key-figure-reveal contracts (Task 3)
- Produces: the named "bar" example that `theory-lab.md` already points to; lessons that tune the template before the skills are written

This is Lane C content work governed by `docs/system/workflows/C_CONTENT_MODULE.md`: read `docs/system/HISTORY_MODULE_ARCHITECTURE.md` and the episode's canonical files (`docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Content.md` / `_Architecture.md`) before editing, and run the coverage-check block from Workflow C phase 4.

- [ ] **Step 1: Write the story-unit beat sheet for the stretch**

Before touching code, write the unit as a comment-level plan (keep it in the commit message body, not the source):

- **Dramatic question:** "How do you *treat* someone when your theory says illness is an imbalance?"
- **Tension beat:** existing Galen `keyFigureReveal` (already at bar — keep, verify against `key-figure-reveal.md`)
- **Teach beat (the missing piece):** a new teach screen *before* the theoryLab that explains the full causal chain in complete sentences: each humour maps to two qualities (blood = hot+wet, phlegm = cold+wet, yellow bile = hot+dry, black bile = cold+dry) → an excess shows as symptoms with those qualities → therefore the cure applies the *opposite* qualities → concrete worked example (fever/red face/sweating = too much blood = hot+wet → treat cold+dry). Component: `explainReveal` (function `teach-mechanism`, interaction `reveal`) — a step-revealed cause-and-effect chain, which is exactly its purpose per the registry.
- **Interactive payoff:** the existing `theoryLab`, upgraded to contract: expand `theory.explanation` to the full causal chain; replace fragment copy in `outcome.lines` and `evaluation` with complete sentences; make the evaluation's `verdict`/`significance` land the exam payoff (why treatment-by-opposites kept Galen credible for 1,400 years).
- **Retrieval close:** existing `quickRecall`, extended with one question retrieving the humour↔quality mapping just taught.

- [ ] **Step 2: Implement the changes**

Author the new `explainReveal` screen and the theoryLab/quickRecall upgrades per the beat sheet, following the exact data shapes already used by `explainReveal` screens elsewhere (grep `type: 'explainReveal'` in `src/modules/` and the episodes directory for a reference shape). All copy: sentence case, teaching voice per `docs/system/TEACHING_VOICE_GUIDE.md`, plain language aiming at reading age 12.

- [ ] **Step 3: Update module metadata**

Episode 1 gains one screen: in `src/modules.js`, update the episode's `screenCount` (+1) and insert the new screen's tag (or `null`) at the matching position in `screenTags`. Also update any `stageNavigation` `screenIndex` values in the episode file that point past the insertion point (they shift by +1).

- [ ] **Step 4: Verify**

Run: `./node_modules/.bin/vitest run tests/architecture` — expected: all pass (`module-metadata-integrity` and `content-registry` catch `screenCount`/`screenTags` mistakes).
Run: `./node_modules/.bin/vite build` — expected: success.
Then open the app (`./node_modules/.bin/vite`), play Episode 1 from the Galen keyFigureReveal through the retrieval close, and confirm: no errors, the new screen renders, theoryLab still completes, progress saves.

- [ ] **Step 5: Tune the templates from what the rebuild taught**

Re-read `CONTENT_BUILD_TEMPLATE.md` and `theory-lab.md` against the finished stretch. If the rebuild contradicted or refined any rule (e.g. the teach beat needed two screens, or a floor rule proved wrong), amend the doc in this commit. If nothing changed, state that in the commit body.

- [ ] **Step 6: Commit**

```bash
git add src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js src/modules.js docs/system/CONTENT_BUILD_TEMPLATE.md docs/system/component-contracts/theory-lab.md
git commit -m "Rebuild Galen theory-of-opposites stretch to the quality bar"
git push -u origin main
```

**User checkpoint:** this task's output is the framework's validation. Show the user the rebuilt stretch (screens + how to view them) and get their judgement against success criterion 3 of the spec before proceeding to Task 5.

---

### Task 5: Content quality architecture test — guardrails + readability

**Files:**
- Create: `tests/architecture/helpers/readability.js`
- Create: `tests/architecture/helpers/examVocabulary.js`
- Modify: `tests/architecture/content-quality.test.js` (add the guardrail and readability describe blocks)

**Interfaces:**
- Consumes: `SCREEN_TYPE_FUNCTIONS`, `isPassive`, `isAssessed` (Task 1)
- Produces: `fleschKincaidGrade(text)`, `stripExamVocabulary(text)`, `collectLearnerText(screen)` in `helpers/readability.js`; `EXAM_VOCABULARY` in `helpers/examVocabulary.js`; `GRANDFATHERED_EPISODES` allowlist inside the test file

- [ ] **Step 1: Write failing tests for the readability helper**

Append to `tests/architecture/content-quality.test.js`:

```js
import {
  fleschKincaidGrade,
  stripExamVocabulary,
  collectLearnerText,
} from './helpers/readability.js'

describe('Readability helper', () => {
  it('scores simple text at a low grade', () => {
    const simple = 'The dog ran to the park. It was a warm day. The boy threw the ball.'
    expect(fleschKincaidGrade(simple)).toBeLessThan(4)
  })

  it('scores dense academic text at a high grade', () => {
    const dense =
      'Notwithstanding contemporaneous epidemiological understanding, practitioners persistently administered counterproductive interventions, exacerbating physiological deterioration.'
    expect(fleschKincaidGrade(dense)).toBeGreaterThan(12)
  })

  it('exam vocabulary is neutralised before scoring', () => {
    const text = 'Miasma explained disease as bad air.'
    const stripped = stripExamVocabulary(text)
    expect(stripped).not.toMatch(/miasma/i)
    expect(fleschKincaidGrade(stripped)).toBeLessThanOrEqual(fleschKincaidGrade(text))
  })

  it('collects learner-facing strings from a screen', () => {
    const screen = {
      heading: 'Doctors could finally see inside the body.',
      blocks: [{ type: 'read', text: 'X-rays changed diagnosis.' }],
    }
    const text = collectLearnerText(screen)
    expect(text).toContain('see inside the body')
    expect(text).toContain('X-rays changed diagnosis')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `./node_modules/.bin/vitest run tests/architecture/content-quality.test.js`
Expected: FAIL — cannot resolve `./helpers/readability.js`

- [ ] **Step 3: Implement the helpers**

`tests/architecture/helpers/examVocabulary.js`:

```js
// Compulsory GCSE subject vocabulary, exempt from readability scoring.
// GCSE deliberately introduces difficult vocabulary — it stays, and must
// be explained on first use; it's the language AROUND it that must be
// plain. Extend per subject as content is built or reviewed.
export const EXAM_VOCABULARY = [
  // History — Medicine Through Time
  'miasma', 'humours', 'bloodletting', 'purging', 'apothecary',
  'physician', 'anatomy', 'dissection', 'inoculation', 'vaccination',
  'anaesthetic', 'antiseptic', 'aseptic', 'pasteurisation', 'penicillin',
  'chemotherapy', 'radiotherapy', 'diagnosis', 'epidemic', 'quarantine',
  'supernatural', 'astrology', 'flagellants', 'laissez-faire',
  // Science (seed list — extend in Phase 5 content work)
  'osmosis', 'diffusion', 'photosynthesis', 'respiration', 'mitosis',
  'enzyme', 'chromosome', 'organelle', 'eukaryotic', 'prokaryotic',
]
```

`tests/architecture/helpers/readability.js`:

```js
import { EXAM_VOCABULARY } from './examVocabulary.js'

// Heuristic syllable count — adequate for a pass/fail floor, not linguistics.
function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (w.length <= 3) return 1
  const stripped = w.replace(/(?:[^laeiouy]e|ed)$/, '')
  const groups = stripped.match(/[aeiouy]{1,2}/g)
  return Math.max(1, groups ? groups.length : 1)
}

export function fleschKincaidGrade(text) {
  const plain = text
    .replace(/<[^>]+>/g, ' ') // strip inline HTML used by read blocks
    .replace(/[•▪–—]/g, '. ') // bullets act as sentence breaks
  const sentences = plain.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
  const words = plain.split(/\s+/).map(w => w.replace(/[^a-zA-Z'-]/g, '')).filter(Boolean)
  if (sentences.length === 0 || words.length === 0) return 0
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  return 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59
}

// Replace exempt vocabulary with a one-syllable neutral token so the
// compulsory terms don't skew the score of the language around them.
export function stripExamVocabulary(text) {
  let out = text
  for (const term of EXAM_VOCABULARY) {
    out = out.replace(new RegExp(`\\b${term}\\b`, 'gi'), 'term')
  }
  return out
}

// Learner-facing strings on a screen: headings, subs, block text/labels,
// questions, options, explanations, feedback — walked recursively.
const TEXT_KEYS = new Set([
  'heading', 'sub', 'text', 'question', 'explanation', 'hint',
  'wrongFeedback', 'correctFeedback', 'detail', 'body', 'verdict',
  'significance', 'punchline', 'tagline', 'intro',
])

export function collectLearnerText(node, out = []) {
  if (typeof node !== 'object' || node === null) return out.join(' ')
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string' && TEXT_KEYS.has(key)) out.push(value)
    else if (typeof value === 'object') collectLearnerText(value, out)
  }
  return out.join(' ')
}
```

- [ ] **Step 4: Run to verify the helper tests pass**

Run: `./node_modules/.bin/vitest run tests/architecture/content-quality.test.js`
Expected: PASS. Tune the syllable heuristic only if the two calibration tests disagree with it.

- [ ] **Step 5: Add the quality-floor describe block**

Append to `tests/architecture/content-quality.test.js`:

```js
// ─── Quality floor (⚙ guardrails from CONTENT_BUILD_TEMPLATE.md) ─────────

// Episodes built before the framework. This list only shrinks: fixing an
// episode with content-review removes it. Never add a NEW episode here.
const GRANDFATHERED_EPISODES = new Set([
  // populated in Step 6 from the initial run
])

const READABILITY_GRADE_CEILING = 7

function isPassiveScreen(screen) {
  const types = [screen.type, ...(screen.blocks ?? []).map(b => b.type)].filter(Boolean)
  if (types.length === 0) return true
  return types.every(t => isPassive(t))
}

function hasAssessedScreen(screens) {
  return screens.some(s =>
    [s.type, ...(s.blocks ?? []).map(b => b.type)].filter(Boolean).some(t => isAssessed(t)),
  )
}

function guardrailViolations(ep) {
  const violations = []
  const screens = ep.screens ?? []

  // ⚙ never more than 2 consecutive passive screens
  let run = 0
  screens.forEach((s, i) => {
    run = isPassiveScreen(s) ? run + 1 : 0
    if (run === 3) violations.push(`3 consecutive passive screens ending at index ${i}`)
  })

  // ⚙ stageNavigation sane + every teaching stage has an assessed screen
  const stages = ep.stageNavigation ?? []
  stages.forEach((stage, i) => {
    if (i > 0 && stage.screenIndex <= stages[i - 1].screenIndex) {
      violations.push(`stageNavigation "${stage.id}" screenIndex not strictly increasing`)
    }
    if (stage.screenIndex < 0 || stage.screenIndex >= screens.length) {
      violations.push(`stageNavigation "${stage.id}" screenIndex out of bounds`)
    }
  })
  stages.slice(0, -1).forEach((stage, i) => {
    const end = stages[i + 1]?.screenIndex ?? screens.length
    const segment = screens.slice(stage.screenIndex, end)
    if (segment.length > 0 && !hasAssessedScreen(segment)) {
      violations.push(`teaching stage "${stage.id}" has no assessed screen`)
    }
  })

  // ⚙ readability per screen
  screens.forEach((s, i) => {
    const text = stripExamVocabulary(collectLearnerText(s))
    if (text.split(/\s+/).filter(Boolean).length < 10) return // too short to score
    const grade = fleschKincaidGrade(text)
    if (grade > READABILITY_GRADE_CEILING) {
      violations.push(`screen ${i} readability grade ${grade.toFixed(1)} > ${READABILITY_GRADE_CEILING}`)
    }
  })

  return violations
}

describe('Content quality floor', () => {
  for (const ep of MEDICINE_EPISODES) {
    if ((ep.screens ?? []).length === 0) continue // stubs are covered by placeholder-module-safety
    it(`${ep.id} meets the quality floor (or is grandfathered)`, () => {
      const violations = guardrailViolations(ep)
      if (GRANDFATHERED_EPISODES.has(ep.id)) return // shrink-only allowlist
      expect(violations, violations.join('\n')).toEqual([])
    })
  }

  it('the floor is real: episode 12 as-built violates it (spec success criterion 4)', () => {
    const ep12 = MEDICINE_EPISODES.find(e => e.id === 'history-medicine-modern-medicine')
    expect(guardrailViolations(ep12).length).toBeGreaterThan(0)
  })
})
```

Note: if `MEDICINE_EPISODES` in `src/content/history/medicine/index.js` doesn't export the full episode objects (check it first), import episodes individually following the exact pattern at the top of `tests/architecture/content-registry.test.js`.

- [ ] **Step 6: Run, populate the allowlist, verify**

Run: `./node_modules/.bin/vitest run tests/architecture/content-quality.test.js`
Expected: failures listing violations per episode. Add each violating episode id to `GRANDFATHERED_EPISODES` — **except** `history-medicine-medieval-beliefs-causes` (Episode 1): if the rebuilt Galen stretch's episode still violates, fix those violations now rather than grandfathering the flagship. Re-run until green, and confirm the "floor is real" test passes (Episode 12 must genuinely violate — if it doesn't, the guardrails are too weak; tighten the passive-run rule check against Episode 12's actual screens before proceeding).

Run: `./node_modules/.bin/vitest run tests/architecture` — expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add tests/architecture/content-quality.test.js tests/architecture/helpers/
git commit -m "Add content quality floor test: guardrails + readability"
git push -u origin main
```

---

### Task 6: `content-create` skill

**Files:**
- Create: `.claude/skills/content-create/SKILL.md`

**Interfaces:**
- Consumes: build template (Task 2), contracts (Task 3), taxonomy exports (Task 1), quality-floor test (Task 5), Story spine section shape (defined here, produced by Task 8)

- [ ] **Step 1: Write the skill**

```markdown
---
name: content-create
description: "Build new module content to the quality bar — consumes the episode's canonical files and story spine, decomposes into story units, selects components by function tag, builds, then self-critiques against the six-dimension rubric and five technical passes before presenting to the user. Use for any new episode/module content build (Lane E, or Lane C when adding substantial new screens)."
argument-hint: "<episode title or module id>"
---

# Content create

Pipeline for building new module content. Runs inside Lane E (new module)
or Lane C (substantial additions to a built module) after /gcse-triage.

## Required reading before any screen is written

1. The episode's canonical files: `docs/content/<subject>/<series>/<NN>_*_Content.md`
   and `..._Architecture.md`. If missing or lacking a Story spine section,
   run `/canonical-topic` first — do not invent an arc at build time.
2. `docs/system/CONTENT_BUILD_TEMPLATE.md` — story units + hard floor.
3. The subject's locked architecture (`docs/system/HISTORY_MODULE_ARCHITECTURE.md`
   or `SCIENCE_MODULE_BLUEPRINT.md`).
4. The component contracts for every component you select
   (`docs/system/component-contracts/`).

## Pipeline

1. **Story spine** — copy the spine (dramatic question, stakes,
   escalation, resolution + exam payoff) from the canonical architecture
   file. Confirm it still matches the canonical content file.
2. **Story units** — decompose the spine's escalation into 3–5 units,
   each with its own dramatic question and the four beats
   (tension → teach → interactive payoff → retrieval close).
3. **Component selection** — for each beat, pick the function tag, then a
   component carrying that tag in `src/data/componentFunctions.js`,
   applying the fit rules in its contract. Record the mapping
   (beat → function → component) in the working plan before building.
4. **Build** — author screens per the contracts and
   `docs/system/TEACHING_VOICE_GUIDE.md`. Register metadata per CLAUDE.md
   (per-module content file, `MODULE_CONTENT_LOADERS` entry,
   `src/modules.js` metadata with screenCount/screenTags).
5. **Self-critique** — before presenting to the user, score every screen
   on the six dimensions (Story, Teaching, Retrieval, Interactions, Exam
   preparation, Emotional engagement — reported separately, never
   averaged) and run the five technical passes:
   - hardcoded values (tokens from `src/constants/` only)
   - image quality (paths exist, `.webp` preferred, subject-appropriate)
   - UX design (typography/spacing/subject-palette tokens, one job per
     screen)
   - **canonical coverage** — diff built screens against the canonical
     content file: list any exam-relevant fact/figure/cause-effect link
     not taught, applied or retrieved; list anything in the episode
     absent from the canonical file (unsourced). Close or justify every
     gap.
   - readability — `vitest run tests/architecture/content-quality.test.js`
     covers the machine floor; also apply "plain language around the
     compulsory subject vocabulary, aiming for a reading age of 12" to
     copy the test can't reach.
   Fix everything below bar before presenting. Include the per-dimension
   scores and the coverage diff in what you present.
6. **Verify** — `vitest run tests/architecture` green, `vite build`
   green, module plays end-to-end in the running app.

## Hard rules

- Every screen must justify its existence: removing it should noticeably
  reduce understanding, retention or motivation. If it doesn't, redesign
  or remove it.
- Never add the new episode to `GRANDFATHERED_EPISODES` in
  `tests/architecture/content-quality.test.js`. New content passes the
  floor, full stop.
- A concept is never tested before the screen that teaches it.
```

- [ ] **Step 2: Verify and commit**

Run: `./node_modules/.bin/vitest run tests/architecture` — expected: all pass.

```bash
git add .claude/skills/content-create/
git commit -m "Add content-create skill: quality-gated content build pipeline"
git push -u origin main
```

---

### Task 7: `content-review` skill

**Files:**
- Create: `.claude/skills/content-review/SKILL.md`

**Interfaces:**
- Consumes: same standards stack as Task 6; `GRANDFATHERED_EPISODES` (Task 5)

- [ ] **Step 1: Write the skill**

```markdown
---
name: content-review
description: "Audit and amend existing module content against the content quality framework — scores every screen across the six rubric dimensions and five technical passes, produces per-dimension findings (never a single blended score), then fixes what's below bar. Use for reviewing or improving any already-built episode/module (Lane C)."
argument-hint: "<episode title or module id> [audit-only]"
---

# Content review

Audits a built episode against the quality framework, then amends. Runs in
Lane C after /gcse-triage. Pass `audit-only` to stop after the findings
report (no code changes).

## Required reading

Same stack as content-create: the episode's canonical files,
`docs/system/CONTENT_BUILD_TEMPLATE.md`, the subject's locked
architecture, and the contracts for every component the episode uses.

## Audit

Score every screen, reporting per dimension — never averaged:

1. **Story** — does the episode follow its story spine (or, if the
   canonical file predates spines, does it have a discernible arc)? Are
   dramatic questions raised, escalated, resolved? Name narrative dead
   zones by screen index.
2. **Teaching** — cause → mechanism → consequence before testing? Depth
   sufficient for the exam question, not just term recognition?
3. **Retrieval** — every taught fact retrieved or applied later? Wrong
   answers feed `unifiedWeaknessTracker.js`? Spacing across the episode?
4. **Interactions** — right function tag for the content shape
   (`src/data/componentFunctions.js`)? Execution meets each component's
   contract?
5. **Exam preparation** — lands the exam payoff; mark-scheme thinking and
   examiner traps present and specific?
6. **Emotional engagement** — stakes, tension, payoff; would a
   15-year-old willingly continue? Apply the deletion test to every
   screen: would removing it noticeably reduce understanding, retention
   or motivation?

Then the five technical passes: hardcoded values, image quality, UX
design (hierarchy / white space / subject branding), **canonical
coverage** (two-way diff against the canonical content file — gaps listed
by canonical section, unsourced content flagged), and readability (run
the floor test; apply the reading-age-12 rule to copy it can't reach).

## Findings report format

Per dimension: a rating (strong / adequate / below bar) plus findings as
`screen <index> — <what's wrong> — <what fixing it looks like>`, ordered
most-damaging first. End with the canonical coverage diff and the
technical-pass results. No single overall score.

## Amend

Unless `audit-only`: fix below-bar findings following Workflow C
(coverage check, `/ponytail-review`, architecture tests, build, in-app
verification). If the episode is in `GRANDFATHERED_EPISODES`
(`tests/architecture/content-quality.test.js`) and now passes the floor,
remove it from the allowlist in the same commit — the list only shrinks.
Re-score after amending and report the before/after per dimension.
```

- [ ] **Step 2: Verify and commit**

Run: `./node_modules/.bin/vitest run tests/architecture` — expected: all pass.

```bash
git add .claude/skills/content-review/
git commit -m "Add content-review skill: six-dimension audit and amend pipeline"
git push -u origin main
```

---

### Task 8: Story spine in the canonical-topic skill

**Files:**
- Modify: `.claude/skills/canonical-topic/SKILL.md` (Step 2 gathering, ~line 179 onward; Step 5 architecture-file template, ~line 468 onward)

**Interfaces:**
- Consumes: nothing new
- Produces: the "## 2. Story spine" section shape that `content-create` (Task 6) reads from canonical architecture files

- [ ] **Step 1: Add a Story spine gathering step**

In `.claude/skills/canonical-topic/SKILL.md`, after subsection "### 2g. Core argument / central takeaway", insert:

```markdown
### 2h. Story spine

Derive the episode's story spine from the source material and spine data —
the arc comes from the inherent drama of the real events, selected by exam
value; it is decided here, never invented at build time:

- **Dramatic question** — the one question the episode exists to answer,
  phrased as a question a 15-year-old would actually want answered.
- **Stakes** — why they should care, one sentence.
- **Escalation** — 3–5 story-unit questions in sequence, each raising the
  next; together they must cover the episode's exam-relevant content (no
  unit may exist purely for drama).
- **Resolution + exam payoff** — how the dramatic question resolves, and
  which exam question type this arc feeds (name the question type from the
  subject's exam board).
```

- [ ] **Step 2: Add the section to the architecture-file template**

In Step 5's architecture-file template, insert a new section between "## 1. Identity (brief)" and the current "## 2. Architecture checklist (tailored)", renumbering the existing sections 2→3, 3→4, 4→5 both in the template outline and in the per-section guidance that follows it:

```markdown
## 2. Story spine

The four fields from 2h, written out in full. `content-create` consumes
this verbatim — it is the build's narrative contract. If the episode is
already built, note where the built screens diverge from this spine.
```

- [ ] **Step 3: Note the migration rule**

At the end of the skill's Step 5 section, add one line:

```markdown
Canonical architecture files written before 2026-07 lack a Story spine
section — add one (per 2h) whenever the episode is next touched by
/canonical-topic, content-create, or content-review. No mass backfill.
```

- [ ] **Step 4: Verify and commit**

Re-read the modified SKILL.md sections for renumbering consistency (every reference to "section 2/3/4" in the skill's prose must match the new numbering).

```bash
git add .claude/skills/canonical-topic/SKILL.md
git commit -m "Canonical-topic: require a story spine in every architecture file"
git push -u origin main
```

---

### Task 9: Workflow wiring — critique gate, triage routing, CLAUDE.md

**Files:**
- Modify: `docs/system/workflows/C_CONTENT_MODULE.md`
- Modify: `docs/system/workflows/E_BIG_BUILD.md`
- Modify: `.claude/skills/gcse-triage/SKILL.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: skill names `content-create` / `content-review` (Tasks 6–7), doc paths from Tasks 2–3

- [ ] **Step 1: Wire Workflow C**

In `docs/system/workflows/C_CONTENT_MODULE.md`:
- In **Phases**, replace phase 6 (`**Build** — superpowers:executing-plans or direct edit.`) with:
  ```
  6. **Build** — `/content-create` for substantial new screens;
     `/content-review` when improving existing screens; direct edit only
     for small copy fixes.
  ```
- Insert a new phase between Review (7) and Verify (8), renumbering the rest:
  ```
  8. **Critique gate** — score changed screens on the six rubric
     dimensions and run the five technical passes (see
     `docs/system/CONTENT_BUILD_TEMPLATE.md` "The review rubric").
     Below-bar screens are fixed before the work is presented. The
     content-create / content-review skills perform this internally;
     direct edits must do it manually.
  ```
- In **Allowed skills**, add `/content-create`, `/content-review`.
- In **Verification**, add: `vitest run tests/architecture` now includes the content quality floor (`content-quality.test.js`) — never add an episode to its grandfather allowlist to get green.

- [ ] **Step 2: Wire Workflow E**

Read `docs/system/workflows/E_BIG_BUILD.md`. In its build/execution phase, add the equivalent rule in the file's own phrasing and structure: new module content builds go through `/content-create` (which enforces the critique gate internally); the story spine must exist in the episode's canonical architecture file before screens are planned (run `/canonical-topic` if absent). Add the two skills to its allowed-skills list.

- [ ] **Step 3: Wire the triage router**

In `.claude/skills/gcse-triage/SKILL.md`:
- In the lane/key-gate table, update Lane C's row: key gate becomes `Coverage check + critique gate; content skills` (keep the file reference).
- After the decision-tree table, add one routing note:
  ```markdown
  **Content quality framework:** building new module content routes
  through `/content-create`; auditing or improving built content routes
  through `/content-review`. Both enforce the six-dimension rubric and
  five technical passes from `docs/system/CONTENT_BUILD_TEMPLATE.md` —
  a triage block for content work in Lanes C/E should name the applicable
  skill in "Allowed skills".
  ```

- [ ] **Step 4: Update CLAUDE.md**

In `CLAUDE.md`, in the Development Workflow section after the superpowers table, add:

```markdown
### Content quality framework

All module content work is governed by
`docs/system/CONTENT_BUILD_TEMPLATE.md` (story units + machine-checked
quality floor) and `docs/system/component-contracts/` (per-component
execution standards). Build new content with `/content-create`; audit and
improve built content with `/content-review`. Story arcs come from the
Story spine section of the episode's canonical architecture file
(`/canonical-topic`) — never invented at build time. The quality floor is
enforced by `tests/architecture/content-quality.test.js`; its grandfather
allowlist only shrinks.
```

- [ ] **Step 5: Verify and commit**

Run: `./node_modules/.bin/vitest run tests/architecture` — expected: all pass.
Re-read the four modified files end-to-end for contradictions (e.g. phase numbering in Workflow C, stale skill lists).

```bash
git add docs/system/workflows/C_CONTENT_MODULE.md docs/system/workflows/E_BIG_BUILD.md .claude/skills/gcse-triage/SKILL.md CLAUDE.md
git commit -m "Wire content quality framework into triage, workflows C/E and CLAUDE.md"
git push -u origin main
```

---

---

# Addendum (2026-07-06) — Pattern component governance layer

This addendum supersedes the ad-hoc "build reusable boxes" direction. It
adds a governance layer whose job is to **prevent misuse**, not just offer
nicer components. It also folds in everything learned during the Galen
proof case: the render-pass gap, the MediaPlaceholder convention, and the
eyebrow/uppercase/gradual-reveal design rules.

It reprioritises the remaining work: **the pattern layer is built and
contracted before the skills, because the skills exist to enforce it.**

## The taxonomy chain

Every element a build session puts on a screen must resolve through one
chain — no ad-hoc `<div>` boxes for a job a pattern owns:

**learning objective → screen intent → approved component → execution contract → gold example**

- **Learning objective** — the GCSE thing the learner should be able to do
  after this screen (from the episode's canonical file / spec), e.g.
  "explain why medieval treatments followed the Theory of Opposites". Every
  screen serves an objective; a screen that serves none is cut. The review
  must always ask, first: **does this component actually advance the
  learning objective?** A beautiful component on the wrong objective still
  fails.
- **Screen intent** — the communicative job that serves the objective
  (e.g. "land a takeaway", "reserve a visual", "walk a worked example",
  "teach a concept", "introduce a figure"). Named, finite.
- **Approved component** — the single sanctioned component for that intent.
  If an intent has an approved component, using anything else is a review
  failure.
- **Execution contract** — the 9-field rules below governing correct use.
- **Gold example** — the reference implementation (a Storybook story plus a
  real on-screen use) the contract points to.

## Hard rule — one primary intent per screen

Every screen has **exactly one primary intent.** If a reviewer cannot state
that intent in a single sentence, the screen fails review and is split or
cut. This is the top-level control against overloaded screens (the "teaching
three things" failure): one screen, one job, one sentence. A screen may use
supporting elements (a `MediaPlaceholder`, a single `KeyPoint`), but they
serve the one primary intent — they are not second and third intents
smuggled in.

Intent → approved component map (seed; extended as intents are named):

| Screen intent | Approved component |
|---|---|
| Land the takeaway / payoff of a screen | `KeyPoint` |
| Walk a concrete worked example | `WorkedExample` |
| Compose a teaching screen (rhythm + spacing) | `TeachScreenShell` |
| Reserve an image/diagram the author will supply | `MediaPlaceholder` |
| Teach a concept, test-after-teach | `theoryLab` (per its contract) |
| Introduce a key person | `keyFigureReveal` |
| …(existing learning components) | per `component-contracts/` |

## The contract format — 9 fields (supersedes the 3-part format)

Every contract, new and existing, uses these fields. The 3-part format from
Task 3 (bar / copy standards / failure modes) is a subset; the six existing
contracts upgrade to this format opportunistically when next touched.

1. **Purpose** — the one intent this component serves.
2. **When to use** — the trigger conditions.
3. **When NOT to use** — the misuse control. The cases where a build
   session would reach for this but must not, each with the correct
   alternative. This field is mandatory and is what the reviewer checks
   hardest.
4. **Required structure** — mandatory props/children, required order, and
   what may never appear (e.g. "no eyebrow", "exactly one per screen").
5. **Token rules** — the `SPACING`/`TYPE`/`RADII`/`MOTION` tokens it must
   use; no raw pixel/hex/ms values. (⚙ machine-checkable via the existing
   token-governance tests.)
6. **Motion rules** — required entrance/reveal behaviour and reduced-motion
   fallback, in `MOTION` tokens.
7. **Gold example** — named story + named on-screen use, and why it is the
   bar.
8. **Below-bar counterexample** — a named real (or realistic) misuse and
   why it fails.
9. **Review checks** — the explicit checks `content-review` runs, each
   marked ⚙ (machine-checkable, becomes an architecture test) or 👁
   (requires the render pass).

## The mandatory render pass (the Galen lesson)

`content-review` and the critique gate do not pass on source + tests alone.
Every 👁 review check requires **rendering the screen and looking at the
pixels** (Storybook story or the isolated-mount harness, screenshot at
390px). Source-and-tests review is what let capitalisation drift, screens
teaching three things, and inverted hierarchy through the first time — it
must not recur. This is a first-class review check, not optional polish.

## MediaPlaceholder convention + visual-assets manifest

Build sessions never generate bespoke imagery or diagrams. When a screen
needs a visual, insert `MediaPlaceholder` with a `caption` briefing exactly
what the asset should depict, and append an entry to a per-episode
**visual-assets manifest** (`docs/content/<subject>/<series>/<NN>_visual-assets.md`)
listing every reserved slot: kind, aspect, the brief, and the screen it
sits on. The manifest is the author's shopping list. `content-review`
checks that every placeholder has a manifest entry and vice versa.

## Design-rule review checks (from this session's design rules)

These become explicit review checks in every relevant contract:

- **No decorative eyebrow** — an eyebrow that restates/categorises its
  heading is a failure (`TYPOGRAPHY_SYSTEM.md` → Eyebrows and label case).
- **No decorative uppercase** — `text-transform: uppercase` / ALL-CAPS on
  headings or key-point labels is a failure; caps only for scanning
  data. ⚙ candidate.
- **Gradual key-point reveal** — payoff boxes reveal gradually, never
  static all-at-once (`MOTION_SYSTEM.md` → Key-point reveal).
- **Points land in a box, not as caption text** — a key takeaway rendered
  as small muted footer text is a hierarchy inversion; it belongs in
  `KeyPoint`.

## The three pattern components (each specified to the 9 fields)

**`KeyPoint` and `WorkedExample` are deliberately separate and must never be
merged.** They serve different learning purposes: `KeyPoint` *summarises a
rule* (the takeaway the learner must hold); `WorkedExample` *demonstrates
its application* (the rule run through one concrete case). Collapsing them
into one component with a mode would blur that distinction and is a
governance failure, not a simplification.

### `TeachScreenShell`
1. **Purpose** — compose a teaching screen with the approved vertical
   rhythm so spacing stops being per-session judgement.
2. **When to use** — any screen whose job is to teach/explain (not a
   full-bleed cinematic moment, not an assessed interaction that owns its
   own layout).
3. **When NOT to use** — cinematic reveal moments (`VisualLearning`,
   `CinematicRevealMoment`), or inside a component that already owns a
   full-screen layout (`theoryLab` stages). Don't nest shells.
4. **Required structure** — slots in fixed order: optional `eyebrow` (only
   if it passes the eyebrow rule) → `heading` → optional `intro` →
   `children` (the teaching body: at most one `MediaPlaceholder`/visual)
   → optional single `KeyPoint`. Enforces one-job-per-screen.
5. **Token rules** — all inter-slot spacing from `SPACING`; type from
   `TYPE`; no raw px.
6. **Motion rules** — content enters toward the reader per Cinematic
   Animation Principles; the `KeyPoint` slot reveals gradually per the
   motion rule.
7. **Gold example** — the reworked Galen teach screen (the approved
   preview: eyebrow-free heading → intro → visual slot → boxed key point).
8. **Below-bar counterexample** — the pre-rework explainReveal wall: five
   stacked text steps, raw-px spacing, no focal point.
9. **Review checks** — ⚙ no raw px spacing; ⚙ ≤1 visual slot; 👁 rhythm
   reads clean at 390px; 👁 eyebrow (if present) passes the eyebrow rule.

### `KeyPoint`
1. **Purpose** — land the single takeaway/payoff of a screen.
2. **When to use** — the one sentence the learner must leave with; the
   answer the screen was building toward.
3. **When NOT to use** — for ordinary body copy, for more than one point
   (if there are two "key" points, the screen is doing two jobs — split
   it), or to decorate. Not a generic callout box for any text.
4. **Required structure** — accent-tinted box, sentence-case content, **no
   eyebrow**, at most one per screen, appears last in reading order.
5. **Token rules** — `RADII`, `SPACING`, `TYPE`, accent via
   `SUBJECTS`/`--cinematic-accent`; no raw values.
6. **Motion rules** — gradual fade-and-rise, slightly delayed
   (`MOTION.easing.gentle`); reduced-motion shows final state.
7. **Gold example** — the approved Galen "worked example" box (reworked
   from footer text into an accent callout).
8. **Below-bar counterexample** — the same payoff rendered as 14px,
   55%-opacity centred footer text (the hierarchy inversion the user
   flagged); or an all-caps "WORKED EXAMPLE" eyebrow on top.
9. **Review checks** — ⚙ ≤1 `KeyPoint` per screen; ⚙ no uppercase label;
   ⚙ uses tokens not raw values; 👁 reveals gradually; 👁 is genuinely the
   screen's takeaway, not decoration.

### `WorkedExample`
1. **Purpose** — walk one concrete case through the concept just taught, so
   the abstract rule becomes applicable.
2. **When to use** — immediately after a concept is taught, to show it
   applied to a specific, named case (a patient, a calculation, a source).
3. **When NOT to use** — before the concept is taught (that is testing
   before teaching — the `theoryLab` failure mode), or as the only teaching
   on the screen (it illustrates, it does not replace the teach beat).
4. **Required structure** — a labelled case (the specific scenario) → the
   step applying the rule → the result; sentence-case; may sit inside
   `TeachScreenShell`. Distinct from `KeyPoint` (which states the takeaway;
   `WorkedExample` demonstrates the process).
5. **Token rules** — tokens only; no raw values.
6. **Motion rules** — steps may reveal in sequence per the reveal
   principle; reduced-motion shows final state.
7. **Gold example** — the fever → too much blood → cool-and-dry worked
   example in the Galen stretch.
8. **Below-bar counterexample** — a worked example placed before the
   theory is taught; or fragments carrying the teaching weight ("Too much
   heat.") with no full-sentence reasoning.
9. **Review checks** — ⚙ tokens not raw values; 👁 the concept is taught
   earlier in the episode than this example (no test-before-teach); 👁 the
   case is specific and named, not generic.

## New tasks (run before the current Tasks 6–7)

- **Task P1 — Pattern governance doc.** Create
  `docs/system/component-contracts/README.md` upgrade + a new
  `docs/system/PATTERN_GOVERNANCE.md` capturing the taxonomy chain
  (learning objective first), the one-primary-intent hard rule, the
  intent→component map, the 9-field contract format, the render-pass rule,
  the MediaPlaceholder+manifest convention, and the design-rule review
  checks. Migrate the six existing contracts' headers to reference the
  9-field format (full rewrite of each is opportunistic).
- **Task P2 — `TeachScreenShell`** component + `.stories.jsx` + its
  9-field contract at `component-contracts/teach-screen-shell.md`. Verify
  with a render pass at 390px.
- **Task P3 — `KeyPoint`** component + story + contract
  (`component-contracts/key-point.md`). Render pass.
- **Task P4 — `WorkedExample`** component + story + contract
  (`component-contracts/worked-example.md`). Render pass.
- **Task P5 — MediaPlaceholder contract + manifest convention.** Write
  `component-contracts/media-placeholder.md` (9 fields) and document the
  visual-assets manifest format. (`MediaPlaceholder` component already
  built and committed.)

## Revisions to existing tasks

- **Task 6 (`content-create`)** — add to required reading:
  `PATTERN_GOVERNANCE.md` and the pattern-component contracts. Add to the
  pipeline: name each screen's learning objective and its single primary
  intent (in one sentence) before choosing a component; resolve every
  screen element through the taxonomy chain; use the approved component for
  each intent; reserve visuals with `MediaPlaceholder` + manifest entry;
  never generate imagery. Add the render pass to self-critique.
- **Task 7 (`content-review`)** — for every screen, first state its one
  primary intent in a single sentence; if that is not possible, fail the
  screen (overloaded — split or cut). Then check the component actually
  advances the screen's learning objective (a well-built component on the
  wrong objective still fails). Then score against the 9-field contracts
  and the intent→component map (flag any ad-hoc element that should be a
  pattern component); run every 👁 check via the mandatory render pass;
  verify the visual-assets manifest matches the placeholders.
- **Task 9 (critique gate)** — the gate includes the render pass, the
  one-primary-intent test, the objective-match check, and the
  taxonomy-chain check.

---

## Not in this plan

- Back-catalogue review (spec rollout step 7) — that is *using* the framework: run `/content-review` per episode afterwards, worst first (Episode 12 is the known candidate).
- Mass migration of the 38 files using decorative eyebrows/uppercase — opportunistic, per the design-rule commit.
- Contracts beyond the pattern components and the first six learning components — written on demand per the contracts README.
- Mass backfill of story spines — added per episode as touched (Task 8 Step 3 rule).

## Execution order note

Done: Tasks 1–5 (taxonomy module, build template, six learning-component contracts, Galen proof case, quality-floor test).

Revised order for remaining work: **pattern layer first, then the skills that enforce it.** Task P1 (governance doc) → P2–P5 (pattern components + contracts) → Task 8 (canonical story spine, independent) → **revised** Tasks 6–7 (skills, now enforcing the pattern layer) → Task 9 (wiring + critique gate). The skills come last among the build tasks because they are the enforcement surface for everything before them — building them first would point them at components and contracts that don't yet exist.

**Superseded by Addendum 2's execution order below.**

---

# Addendum 2 (2026-07-09) — operational gaps closed before the skills are built

A design review of Tasks 6–7 (plus what the Galen proof case actually
demonstrated — one reworked teach screen, with the rest of the Galen stage
untouched and still carrying title-case copy) found six gaps. All are
operational: steps the skills mandate but give no mechanism or record for.
The rubric, taxonomy chain and contracts stand unchanged.

## Gap 1 — persisted review record (revises Task 7)

The findings report and before/after re-score currently go to chat and die
with the session, making "which episodes have been reviewed, to what
result?" unanswerable from the repo — the exact failure that made the Galen
proof case's real scope unverifiable after a history squash.

`content-review` writes its findings to a per-episode review log:
`docs/content/<subject>/<series>/<NN>_Review_Log.md` (matching the existing
`NN_` canonical-file naming). Entries are appended newest-first, each with:

- date, session scope (full episode / stage / screen range), and whether
  canonical files were available
- per-dimension ratings + findings (the existing report format)
- the five technical-pass results
- what was amended (with commit hashes) vs accepted-as-is vs deferred
- after-amend re-score

The skill reads the previous entry (if any) before auditing — findings
marked deferred are first-class inputs to the next review. `content-create`
writes the log's first entry from its independent critique (Gap 3), so
every new module has a baseline from day one.

## Gap 2 — render-pass mechanism (new Task P6; revises Tasks 6–7)

The mandatory 👁 render pass requires the composed screen at 390px in the
real render path, but the app has no deep-linking — reaching screen 14 of
an episode means scripting through every screen before it, including
assessed interactions that block until answered. When rendering is hard,
sessions skip it (the documented render-pass gap). Two changes:

- **Task P6 (app source, Lane A/B when built):** dev-only screen jump.
  `LegacyApp.jsx` reads `?module=<id>&screen=<n>` behind
  `import.meta.env.DEV`, opens that module via the existing
  `openModulePlayer()` path and jumps to screen `n` — the same mechanism
  the `LearningProgressHeader` jump sheet uses. Production builds ignore
  the params. Verified with:
  `node scripts/screenshot.mjs "?module=<id>&screen=<n>" out.png`
  (390×844 viewport).
- **Skills name the procedure.** Both skills' render-pass steps say
  exactly: start vite, screenshot each changed screen via the jump URL,
  look at the pixels. A review that could not run a 👁 check must say so
  in the review log entry — silent skipping is a review failure.

## Gap 3 — independent critique (revises Task 6)

The spec's diagnosis is "quality depends on which session built the
episode", yet `content-create` has the builder score its own work.
The self-critique stage is replaced by an **independent critique**: a
fresh subagent (per `subagent-driven-development` / `requesting-code-review`
conventions) is given only the rubric, the contracts, the canonical files,
the render-pass screenshots and the built screens — never the build
session's reasoning. The builder fixes its findings; disagreements are
surfaced to the user rather than argued away.

## Gap 4 — degraded mode when canonical files are missing (revises Task 7)

The back catalogue is where canonical files and story spines are most
likely to be missing (every existing spine is missing by definition —
Task 8's no-backfill rule). `content-review` defines the degraded path
explicitly: run everything except the canonical-coverage pass and the
story-spine check; record "canonical files unavailable — coverage and
spine unassessed" prominently in the review log entry; recommend
`/canonical-topic` as follow-up. A spine is never invented mid-review.

## Gap 5 — sentence-case ⚙ guard (new Task P7)

Sentence case is a CLAUDE.md hard rule, is trivially machine-checkable,
and the gold-example episode violates it today ("Think Like Galen",
"A Patient Arrives"). Task P7 extends
`tests/architecture/content-quality.test.js` with a title-case detector
over known copy fields (`label`, `title`, `heading`, `sub`): flag any
string with ≥2 consecutive capitalised non-first words that are not in a
`PROPER_NOUNS` allowlist (seeded from real content: "Black Death",
"Theory of Opposites", names, places). Existing violations are grandfathered
via the same shrink-only mechanism as the quality floor; fixing them is
`content-review` work.

## Gap 6 — review scope + amend checkpoint (revises Task 7)

Whole-episode audit-then-fix-everything produces one giant unreviewable
diff. Three changes:

- **Scope argument:** `content-review <module id> [stage name | screen
  range] [audit-only]` — a stage is the realistic unit of work ("review
  the Galen stage").
- **Checkpoint by default:** present the findings report and stop for
  user confirmation before amending. `audit-only` still exists for
  report-only runs; the user can pre-authorise amend in the invocation.
- **Commit per story unit / stage,** never one mega-commit, so each
  amendment is individually revertible.

## UX review tooling note

The UX-design technical pass may optionally escalate to `/gsd-ui-review`
(installed; 6-pillar visual audit → scored UI-REVIEW.md) when visual
quality is in doubt across multiple screens. The standard per-screen check
remains the Gap 2 render pass; `/frontend-design` remains the build-time
guidance skill.

## Revised execution order (supersedes the note above)

Task 8 (story spine) → **P6 (dev screen jump — render-pass tooling)** →
P7 (sentence-case guard) → revised Tasks 6–7 (skills, folding in Gaps 1–6)
→ Task 9 (wiring). P6 lands before the skills because the render pass is
unenforceable without it.
