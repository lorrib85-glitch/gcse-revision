# Learner runtime configuration

This directory is build-time application configuration over the canonical
curriculum catalogue. It is not a seventh curriculum entity type.

`learningSequences.js` names the ordered learner journeys used for continuation,
Chapter numbering and planner progression. Each sequence references canonical
Modules; Chapter membership remains authored only on those Module records.

The generated production model is
`src/data/generated/curriculum/learnerCurriculum.js` and production reaches it
only through `src/data/learnerCurriculum.js`.

## Boundaries

- Do not add screen, Component, progress or browser-copy fields here.
- Do not duplicate Module `chapterRefs` here.
- Every available Chapter must resolve through exactly one Learning Sequence.
- Planned Chapters may exist without a sequence until they become learner-openable.
- Browser destinations remain separate in `../navigation/`.
