# Feature backlog

## Purpose
Track learner-facing product features and learning-system improvements separately from architecture debt and visual/brand work.

Use this backlog for features that change what the learner can do, how practice is selected, how progress is personalised, or how content is expanded.

---

## F1 — Phase 2A: Standardise question metadata and tags

**Status:** In progress — superseded in part by the Canonical Learning Graph (architecture backlog A5)  
**Priority:** High  
**Area:** `src/data/questionBanks/`, `src/features/quickfire/logic/selectQuestions.js`, `tests/architecture/`

### Progress (2026-07-03)
The tagging half of this phase was broadened into the Canonical Learning
Graph (`src/data/learningGraph/`, `docs/system/LEARNING_GRAPH.md`, tracked as
A5 in the architecture backlog):

- Concept ids are now canonical registry entries (`history:medicine:galen`),
  not free-text tags; architecture tests reject unregistered spellings across
  the whole of `ALL_QUESTIONS`.
- Every medicine question (including the previously untagged June 2023 paper
  questions) now carries course, facet and concept tags; the 2023 paper has
  paper-level tags; the 14 Medicine modules have module-level tags.
- Tag inheritance (module → topic → question) resolves via
  `resolveEffectiveTags` — no duplication required.
- `tests/architecture/learning-graph.test.js` covers tag validity, question-id
  uniqueness and registry integrity.

Still open from the original F1 scope: enforcing the full per-question
metadata contract (required fields, difficulty 1–5, positive marks, format
constants) as a dedicated `question-bank-schema.test.js`, and minimal-tag
audits of the Biology/Maths/English banks (their concept atoms arrive with
the A5 Biology graph).

### Product value
This unlocks proper adaptive practice. Without reliable metadata, question selection can only be random or topic-level. With clean tags, the app can identify whether a learner is weak on question type, skill, period, theme, or difficulty.

### Context
Phase 1 created module-aligned question banks and a registry. The next step is not adaptive difficulty yet. First, the existing question banks need a consistent metadata contract.

### Scope
Audit and standardise only existing question banks:

- `src/data/questionBanks/history/medicine.js`
- `src/data/questionBanks/science/biology/buildingBlocks.js`
- `src/data/questionBanks/science/biology/organisation.js`
- `src/data/questionBanks/science/biology/infectionAndResponse.js`
- `src/data/questionBanks/science/biology/bioenergetics.js`
- `src/data/questionBanks/maths/number.js`
- `src/data/questionBanks/english/languagePaper1.js`
- `src/data/questionBanks/questionRegistry.js`
- `src/data/questionBanks/questionTypes.js`
- `src/features/quickfire/logic/selectQuestions.js`

Do not add speculative Chemistry, Physics, Drama or Music banks.

### Metadata contract
Every question should consistently support:

```js
{
  id,
  subject,
  course,
  examBoard,
  module,
  unit,
  topic,
  subtopic,
  type,
  format,
  difficulty,
  marks,
  q,
  options,
  correct,
  ms,
  tags,
  source
}
```

### Required fields
Every question must have:

- `id`
- `subject`
- `module`
- `topic`
- `type`
- `format`
- `difficulty`
- `marks`
- `q`
- `ms`
- `tags`
- `source`

### Optional fields
Allowed optional fields:

- `course`
- `examBoard`
- `unit`
- `subtopic`
- `options`
- `correct`

### Rules
- `id` must be unique across `ALL_QUESTIONS`.
- `difficulty` must be an integer from 1 to 5.
- `marks` must be positive.
- `tags` must be a non-empty array.
- `format` should use constants from `questionTypes.js` where possible.
- `type` should use `EXAM_TYPE` constants where possible.
- Do not invent a huge taxonomy in this phase.
- Add TODO comments where tags are uncertain rather than overfitting.
- Do not change question wording or mark schemes.
- Do not change app behaviour.

### Minimal tag requirements
Each question should have at least:

1. Module tag, e.g. `history:medicine`, `biology:building-blocks`, `maths:number`.
2. Format tag, e.g. `format:mc`, `format:written`, `format:truefalse`.
3. At least one topic, skill, period, theme or exam-type tag where obvious.

### Suggested History Medicine tags
Use broad obvious tags only at this stage:

- `period:medieval`
- `period:renaissance`
- `period:industrial`
- `period:modern`
- `period:western-front`
- `theme:causes`
- `theme:treatments`
- `theme:public-health`
- `theme:surgery`
- `theme:individuals`
- `theme:war`
- `exam-type:describe-two-features`
- `exam-type:explain-why`
- `exam-type:how-far`
- `exam-type:source-utility`
- `skill:recall`
- `skill:explanation`
- `skill:evaluation`
- `skill:source-analysis`

### Tests to add
Create:

`tests/architecture/question-bank-schema.test.js`

Tests should verify:

- `questionRegistry.js` exports `ALL_QUESTIONS`.
- `ALL_QUESTIONS` is not empty.
- Every question has required fields.
- Every `id` is unique.
- `difficulty` is 1–5.
- `marks` is positive.
- `tags` is a non-empty array.
- `format` is valid.
- No question bank imports from React components.
- No broad catch-all files like `biologyQuestions.js`.
- No speculative Chemistry/Physics/Drama/Music banks.

### Acceptance criteria
- Existing question content unchanged.
- Existing app behaviour unchanged.
- New schema tests pass.
- Existing quickfire boundary tests pass.
- Vite build passes.

---

## F2 — Phase 2B: Adaptive question selection

**Status:** Future backlog  
**Priority:** High  
**Depends on:** F1

### Product value
Makes practice feel personalised rather than random. Learners should gradually see harder questions as proficiency improves, while weak topics still reappear through spaced retrieval.

### Goal
Use clean metadata to select questions based on proficiency, weakness, question type and difficulty.

### Do not start until
- Existing question banks pass schema tests.
- Tags are reliable enough to drive selection.
- There is enough question volume for adaptive behaviour to matter.

### Selection should eventually consider
- Subject
- Module
- Topic
- Subtopic
- Tags
- Question type
- Difficulty range
- Previously seen questions
- Recent mistakes
- Weakness tracker data
- Proficiency trend

### Initial adaptive behaviour
Use simple weighting first:

- Low proficiency: mostly difficulty 1–2, some difficulty 3.
- Developing proficiency: mostly difficulty 2–3, some difficulty 4.
- Strong proficiency: difficulty 3–5 with older weak topics mixed in.

### Acceptance criteria
- Adaptive selection is explainable.
- Learners are not punished with hard questions too early.
- Weakness tracking and spaced retrieval still work.
- Selection remains deterministic enough to test.

---

## F3 — Expand question banks by current designed modules

**Status:** Backlog  
**Priority:** High  
**Depends on:** F1

### Product value
Quick Fire and topic practice only become useful with enough question volume. The learner needs repeated, varied practice across current GCSE modules.

### Current rule
Only add banks for modules that have been designed or are actively being built. Do not create speculative module banks for Chemistry, Physics, Drama or Music until those subjects have real module designs.

### Initial focus
- History: Medicine in Britain first, then other already-designed History modules.
- Biology: existing current banks only.
- Maths: current built maths topics only.
- English: current Macbeth / Inspector Calls / Language Paper work when ready.

### Acceptance criteria
- New questions follow the standard metadata contract.
- New questions include minimal tags from F1.
- Question content is aligned to the correct exam board/spec.
- New banks are module-aligned, not broad catch-all files.

---

## F4 — Personalised daily revision planner improvements

**Status:** Backlog  
**Priority:** Medium

### Product value
The planner should help the learner know exactly what to do each day without decision fatigue.

### Current known direction
- Weekdays: around 60 minutes.
- Weekend: longer practice, including paper/test work.
- Mix progress, weak repair, interleaving and exam moves.
- Inject weak topics automatically.
- Handle incomplete work without derailing the week.

### Future work
- Connect planner more deeply to question-bank tags and weakness data.
- Surface the next best task rather than a static plan.
- Keep sessions ADHD-manageable: short blocks, clear next action, no huge menus.

### Acceptance criteria
- Planner recommends a realistic daily set of tasks.
- Weak areas and spaced repetition influence the plan.
- Incomplete work rolls forward sensibly.
- The learner can start without choosing from too many options.

---

## F5 — Streak/personalisation moment

**Status:** Backlog  
**Priority:** Medium

### Product value
Make the app feel personal and rewarding without childish gamification.

### Current direction
- A full-screen streak moment appears once per visit per day after the home screen appears.
- If there is no streak, nothing shows.
- Flame image uses general app palette, not subject-specific colours.
- Animation concept: flame spins, then days tick up one by one.
- Keep content lean and avoid repeated wording.

### Acceptance criteria
- Shows once per day only.
- Does not interrupt active learning.
- Uses mature app styling.
- Works across all subjects.
- Does not become noisy or gimmicky.

---

## F6 — Content expansion by subject/module

**Status:** Backlog  
**Priority:** Medium

### Product value
The app only helps if the learner has useful, spec-aligned content for the actual GCSE subjects being taken.

### Direction
Continue expanding built modules in priority order:

- Edexcel History: Medicine, USA Conflict, Elizabethan England, Spain and the New World.
- AQA English Literature: Macbeth, An Inspector Calls.
- AQA English Language: Paper 1 and Paper 2 skills.
- AQA Maths: current priority modules already mapped.
- AQA Combined Science: Biology modules currently designed first.
- AQA Sociology: core topic modules when ready.
- Drama/Music: keep as future subjects until designs are ready.

### Acceptance criteria
- Each module follows the locked learning structure.
- Content is spec-aligned.
- Practice questions link back to module/question-bank tags where possible.
- Do not add placeholder subject structures without real designed content.
