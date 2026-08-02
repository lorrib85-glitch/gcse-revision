# Question bank metadata contract

**Status:** canonical. Enforced by `tests/architecture/question-bank-schema.test.js`.

Every question exposed through `src/data/questionBanks/questionRegistry.js` →
`ALL_QUESTIONS` must satisfy this contract. The machine-readable version is
`src/data/questionBanks/questionSchema.js`; this document explains the field
meanings and the decisions behind them.

This is a **structural** contract, not a content-writing guide. It says nothing
about how to word a question, choose distractors or write a mark scheme.

---

## 1. `type` versus `format` — the durable rule

These two fields look interchangeable and are not. Getting them confused is the
single most likely way to break this contract.

```
format = how the learner responds and how the question is rendered
type   = the assessment / marking family the answer is judged against
```

**Runtime renderers must branch on `format`, never on `type`.** A question can
change its marking family without changing how it is rendered, and a new
command word must never be able to break a renderer.

| | `format` | `type` |
|---|---|---|
| Answers the question | "What UI does the learner see?" | "How is this answer marked?" |
| Vocabulary | `FORMAT` in `questionTypes.js` | `EXAM_TYPE` in `questionTypes.js` |
| Read by | renderers, interaction components | selection, analytics, exam-technique coaching |
| Example | `written` | `how-far-do-you-agree` |

A worked example: `j23p1_q5` is `format: 'written'` (a textarea) and
`type: 'how-far-do-you-agree'` (16 marks, levelled AO1/AO2 mark scheme with
SPaG). `j23p1_q1` is also `format: 'written'` but
`type: 'describe-two-features'` — same interaction, entirely different marking
family.

### Registered `format` values

| Value | Learner interaction |
|---|---|
| `mc` | pick one option from `options[]` |
| `mc_multi` | pick several options — **no canonical answer representation agreed yet** |
| `written` | free prose, marked against `ms` |
| `truefalse` | true/false — **no canonical answer representation agreed yet** |

`mc_multi` and `truefalse` are registered formats with no question currently
using them in a canonical bank. Rather than guess at an answer shape,
`validateQuestion()` fails loudly for both. Agree a representation, register it
in `questionSchema.js`, and document it here before adding such a question.

The legacy `QUICK_QUIZ_QUESTIONS` bank (`src/data/quickQuizData.js`) has its own
unrelated `type` vocabulary and its own converter
(`src/features/quickfire/logic/convertBankQuestion.js`). It is **not** part of
`ALL_QUESTIONS` and is not governed by this contract.

### Registered `type` values

Generic families — used when no command-specific mark scheme family applies:

| Value | Used by |
|---|---|
| `mc` | every multiple-choice bank question |
| `written` | every generic marked-prose question (science, maths, English) |
| `written-short` | registered, no current user |
| `calculation` | registered, no current user |

Command-specific families — Edexcel GCSE History question types, each with its
own levelled mark scheme and its own `GuidedAnswerCoach` scaffold:

`describe-two-features`, `explain-why`, `how-far-do-you-agree`,
`source-utility`, `source-follow-up`, `explain-similar-different`.

**Extend `EXAM_TYPE` only for a value that already occurs legitimately in a
current bank.** Do not pre-register types for banks that do not exist yet, and
do not reinterpret a generic written science question as a command-specific
exam question because its wording happens to start with "Explain".

---

## 2. Required fields

All twelve must be present on every question in `ALL_QUESTIONS`.

| Field | Rule |
|---|---|
| `id` | non-empty string, unique across `ALL_QUESTIONS` |
| `subject` | non-empty string — `'History'`, `'Biology'`, `'Maths'`, `'English'` |
| `module` | non-empty string — the parent curriculum module, e.g. `'Medicine in Britain'` |
| `topic` | non-empty string — human-readable topic within the module |
| `type` | a registered `EXAM_TYPE` value |
| `format` | a registered `FORMAT` value |
| `difficulty` | integer 1–5 |
| `marks` | positive finite number |
| `q` | non-empty string — the question as the learner reads it |
| `ms` | non-empty string — mark scheme / accepted answer guidance |
| `tags` | non-empty array of non-empty strings |
| `source` | non-empty string — provenance |

## 3. Optional fields

Recognised and documented, never required:

`course`, `examBoard`, `unit`, `subtopic`, `topicId`, `chapterId`, `options`,
`correct`, `correctIndex`, `hint`, `commandWord`, `extract`, `paper`,
`topicLabel`, `fig`, `imageKey`, `skillTip`, `note`.

Unknown extra fields are **allowed** — the schema is not a whitelist. Required
and format-specific rules are still enforced regardless. If you add a field that
several banks will share, list it above so it stays discoverable.

## 4. Format-specific rules

**`mc`** — `options` must be an array of at least two non-empty strings; the
correct answer must be an integer index inside that array. `correct` is the
canonical spelling; `correctIndex` is accepted because
`normaliseExamQuestion()` emits it.

**`written`** — no `options`, no answer index. Marked against `ms`.

**`mc_multi` / `truefalse`** — currently rejected, see §1.

## 5. The difficulty scale

`difficulty` is **cognitive demand**, not historical importance, not how often
the topic is examined, and not the national pass rate. A famous, heavily
examined fact recalled from memory is difficulty 1.

| | Meaning |
|---|---|
| 1 | Recall — a single retrieved fact |
| 2 | Standard — apply a known idea in a familiar context |
| 3 | Explain — connect two or more ideas causally |
| 4 | Extended — sustained analytical explanation |
| 5 | Stretch — weigh competing factors and reach a justified judgement |

These map to the `DIFFICULTY` constants in `questionTypes.js`.

## 6. Source and provenance

`source` records where the question came from, so a learner-facing "past paper"
claim is always traceable. Current values:

- `'AQA past paper'` — AQA-sourced science and maths questions
- `'handwritten'` — authored in-house for this app
- `'Edexcel June 2023 Paper 1 (1HI0/11)'` — the June 2023 Medicine paper

Where a question belongs to a specific paper, `examBoard`, `course` and `paper`
carry the finer detail. `source` must never be blank to make a question validate.

## 7. Relationship to the learning graph

`tags` is validated **structurally** here (non-empty array of non-empty
strings) and **semantically** by `tests/architecture/learning-graph.test.js`,
which owns the tag vocabulary: facet tags (`period:medieval`, `skill:recall`)
and registered concept ids (`history:medicine:galen`).

`questionSchema.js` deliberately does not import the learning graph and does not
re-implement its tag parser. Never invent a concept spelling in a bank — register
it in `src/data/learningGraph/conceptRegistry.js` first. See
`docs/system/LEARNING_GRAPH.md`.

### Ownership split between the two architecture suites

| Assertion | Owner |
|---|---|
| question-id uniqueness | `question-bank-schema.test.js` |
| required fields, difficulty, marks, format, type, MC answers, provenance | `question-bank-schema.test.js` |
| bank files stay data-only | `question-bank-schema.test.js` |
| tag vocabulary validity, concept registration, topic-graph integrity | `learning-graph.test.js` |

Do not duplicate an assertion across both files.

## 8. Relationship to the mastery engine

The mastery engine (`src/data/masteryEngine/`) keys per-concept evidence off the
concept ids inside a question's `tags`. This contract is what makes that safe:
without a guaranteed `tags` array, a recorded attempt could resolve to no
concept at all.

`difficulty` and `type` are the two fields adaptive selection will read (F2).
Neither is read by any selector today — `selectQuestions.js` filters on
metadata only and must not read mastery state until F2 is authorised, which
also requires an allowlist extension in
`tests/architecture/mastery-engine.test.js`. See `docs/system/MASTERY_ENGINE.md`.

## 9. How a new bank enters `ALL_QUESTIONS`

1. Create `src/data/questionBanks/<subject>/<module>.js`. It must be data only —
   no React, no JSX, no components, no features, no app imports, no storage, no
   `localStorage`.
2. Import `FORMAT`, `DIFFICULTY` and `EXAM_TYPE` from `questionTypes.js` rather
   than writing the string literals by hand.
3. Export a `BY_TOPIC` object keyed by `topicId`, an optional `QUICKFIRE` array,
   and a flat `ALL_<NAME>_QUESTIONS` array.
4. Register concept ids for any new tags in the learning graph first.
5. Wire the exports into `questionRegistry.js`.
6. Run `pnpm test:architecture`. Every new question is validated automatically —
   there is no opt-in step and no allowlist.

Do not create a broad catch-all bank (`biologyQuestions.js`, `allQuestions.js`)
and do not add a speculative Chemistry, Physics, Drama or Music bank ahead of
real content; both are blocked by the architecture suite.

## 10. Validating outside the tests

```js
import { validateQuestion } from './src/data/questionBanks/questionSchema.js'

const errors = validateQuestion(question) // string[], empty when valid
```

`validateQuestion()` is pure, never throws, never mutates its argument, and
returns errors in a deterministic order (required fields in declared order,
then format-specific rules). The registry is **not** validated on import — the
schema exists for architecture tests, authoring tooling and explicit validation
at controlled boundaries, not as a production runtime cost.
