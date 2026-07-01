# Question tagging backlog

## Purpose
Track question-bank metadata, tagging, and adaptive-selection work separately from UI/refactor work.

This backlog exists because adaptive difficulty depends on clean question metadata. Do not build the adaptive engine before the schema and tags are reliable.

---

## T1 — Phase 2A: Standardise question metadata schema

**Status:** Backlog  
**Priority:** High  
**Area:** `src/data/questionBanks/`, `src/features/quickfire/logic/selectQuestions.js`, `tests/architecture/`

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

## T2 — Phase 2B: Adaptive question selection

**Status:** Future backlog  
**Priority:** Medium  
**Depends on:** T1

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
