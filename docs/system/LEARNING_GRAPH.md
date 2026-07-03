# Canonical Learning Graph

**Status:** Active — Medicine Through Time is the proof-of-concept course.
**Code:** `src/data/learningGraph/`
**Tests:** `tests/architecture/learning-graph.test.js`

## Why this exists

Every adaptive feature — weak-spot detection, planner generation, adaptive
question selection, AI marking/tutoring, analytics, progress reporting —
needs modules, topics, screens, questions and exam papers to describe their
knowledge in the same language. Free-text tags drift (`galen` vs `Galen` vs
`galens-theory`), and drifting tags silently break personalisation. The
learning graph fixes the vocabulary once, centrally, and lets every surface
reference it.

Built to scale to ~100k questions and 12 subjects without redesign: adding a
subject adds a concepts file, never a schema change.

## The hierarchy

```
Subject → Specification/Course → Module → Topic → Screen / Question / Exam question
                                                        ↓
                                                 Knowledge atoms (concepts)
```

Every learning object carries a `tags` array. A tag is one of two things:

| Family | Shape | Examples | Source of truth |
|---|---|---|---|
| **Concept tag** | `subject:course[:concept]` | `history:medicine:galen`, `history:medicine` (course node), `biology:building-blocks` | `conceptRegistry.js` — must be registered |
| **Facet tag** | `namespace:value` | `period:medieval`, `skill:recall`, `exam-type:explain-why`, `examboard:edexcel`, `paper:medicine`, `tier:gcse` | `tagSchema.js` `FACET_NAMESPACES` |

Concepts say **what knowledge** an object teaches or tests. Facets say
**how/where** it sits (period, skill, format, exam question type, board).

## The concept registry

`src/data/learningGraph/conceptRegistry.js` aggregates per-course concept
files (`concepts/historyMedicine.js`, plus `concepts/courseNodes.js` stubs
for courses whose graphs aren't built yet). Every concept exists exactly
once. Content and questions reference ids — never re-spell or invent
variants. Architecture tests fail the build if:

- a concept id is duplicated or malformed
- any tag in a registry-claimed subject namespace (`history:*`, `biology:*`,
  `maths:*`, `english:*`) is not a registered concept id
- any facet tag uses an unknown namespace
- the registry imports React, app code, or anything outside `learningGraph/`

## Naming rules

1. Lowercase kebab-case segments joined by colons: `history:medicine:four-humours`.
2. Concept ids are `subject:course:concept` (course nodes are `subject:course`);
   English text-based courses read as `subject:text:concept`
   (`english:macbeth:ambition`). A fourth segment is allowed where a course
   genuinely needs sub-scoping — use sparingly.
3. Prefer the person/thing's common exam name: `jenner`, not `edward-jenner`.
4. A subject namespace must never collide with a facet namespace.
5. New facet namespaces need a genuinely new axis — extend `FACET_NAMESPACES`
   deliberately, not per-feature. `exam-type:` values match the `EXAM_TYPE`
   constants in `src/data/questionBanks/questionTypes.js`.
6. `topic:` facets are a pre-graph convenience for banks without concepts yet;
   replace them with concept tags when the subject's graph is built.

## Inheritance rules

Effective tags are resolved, never copied:

```js
import { resolveEffectiveTags, MEDICINE_TOPICS } from 'src/data/learningGraph'

const effective = resolveEffectiveTags(
  module.tags,                        // broadest layer
  MEDICINE_TOPICS[q.topicId]?.tags,   // topic layer
  q.tags,                             // most specific layer
)
```

- Layers merge broad → specific; duplicates dedupe (first occurrence wins).
- Content never needs to repeat a parent's tag; repeating one is harmless.
- Missing layers (`undefined`) are skipped, so the resolver works for
  objects that only have their own tags.

## Where tags live today (Medicine proof of concept)

| Layer | Location |
|---|---|
| Module | `tags` on the 14 Medicine entries in `src/modules.js` |
| Topic | `MEDICINE_TOPICS` (`th1`…`th_modern`) in `concepts/historyMedicine.js` |
| Question | `tags` on every question in `src/data/questionBanks/history/medicine.js` |
| Exam question | `tags` on `J23_Q*` in `src/data/medicineExamPapers.js` |
| Exam paper | `tags` on `MEDICINE_2023_PAPER` (paper-level: `paper:medicine`, `examboard:edexcel`, `tier:gcse`) |
| Screen (legacy) | `screenTags` in `src/modules.js` stay as-is; `MEDICINE_SCREEN_TAG_CONCEPTS` bridges them to concept ids without a migration |

## Future expansion

- **New course:** create `concepts/<subjectCourse>.js` exporting an array of
  `{ id, label }`, append it in `conceptRegistry.js`, tag content. Examples the
  schema already supports: `biology:cell`, `biology:osmosis`,
  `maths:factorising`, `maths:pythagoras`, `english:macbeth:ambition`,
  `english:language:language-analysis`.
- **Consumers:** adaptive selection (`selectQuestions.js`), the planner,
  weak-spot repair and analytics should query via tags/concepts
  (`getQuestionsByTags`, `resolveEffectiveTags`) rather than bespoke fields.
- **Do not** put React, storage access, or app imports in `learningGraph/` —
  it must stay a pure leaf usable from node, tests and future workers.
- **Do not** add speculative concepts for subjects without designed content.
