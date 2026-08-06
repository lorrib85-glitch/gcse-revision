# Chapter Topic — migration plan

This plan breaks the Topic architecture into independently reversible phases. Each phase must keep `pnpm verify` green and must not rely on a later phase to make it safe.

The governing boundary is now the post–Stage 6 architecture:

- the curriculum catalogue owns Subjects, Specifications, Pathways, Modules and Chapters;
- `src/data/learnerCurriculum.js` is the sole production learner-runtime boundary for canonical Modules, Chapters, Learning Sequences and content loaders;
- Chapter Topic metadata lives inside Chapter content and never enters the curriculum catalogue;
- Chapter progress keys remain untouched.

---

## Phase map

```text
T0A  Contract and ownership boundaries are accepted             COMPLETE
T0B  Additive Topic schema and validator                        COMPLETE
T1A  Write and review one Medicine screen-to-Topic assignment   no runtime change
T1B  Author the Medicine pilot metadata                         no runtime change
T2   Generate and drift-check the Topic index                   no runtime change
T3   Weak-spot recovery reads the Topic index                   learner-visible, gated
T4   A learner opens one standalone Topic refresher             learner-visible, gated
T5   Adaptive planning schedules Topic-sized work               learner-visible, gated
T6   Retire replaced compatibility fields subject by subject    cleanup
```

T0A–T2 are behaviour-preserving. T3 is the first learner-visible change.

---

## T0A — contract and architecture decision

**Status:** complete.

**Lands:**

- the definition of a Chapter Topic;
- authored record shape;
- semantic ID grammar;
- ownership boundaries;
- optionality and size guidance;
- separation of Chapter completion, Topic activity and Concept mastery;
- default refresher return behaviour;
- explicit v1 non-goals.

**Deliberately does not land:**

- schema or validator code;
- Topic metadata in content;
- generated Topic data;
- runtime imports;
- storage keys;
- learner-visible behaviour.

**Acceptance:** the repository’s permanent ADR describes one contract with no competing authored source.

---

## T0B — additive schema and validator

**Status:** complete.

**Goal:** make the accepted contract enforceable without changing any existing Chapter.

**Lands:**

- `src/content/chapterTopicSchema.js` as a build-time/test-time Topic-record validator for the optional Chapter-content `topics` array;
- validation for the Screen `topic` back-reference;
- focused architecture tests;
- `docs/system/CHAPTER_TOPICS.md` as practical authoring guidance subordinate to ADR-0003.

**Required rules:**

1. A Chapter with no `topics` key is valid and unchanged.
2. When `topics` exists, it is a non-empty array.
3. Each Topic has exactly the v1 authored fields:
   - `id`;
   - `title`;
   - `conceptIds`;
   - `estimatedMinutes`.
4. `id` is semantic kebab case, unique within the Chapter and not sequential placeholder vocabulary.
5. `title` is non-empty learner-facing text.
6. `conceptIds` is a non-empty array of registered Concept IDs with no duplicates.
7. `estimatedMinutes` is a positive finite number or `null`.
8. A Screen `topic` value is a local slug declared by its own Chapter.
9. Chapter-level Screens may omit `topic`.
10. Topic metadata contains no Chapter progress, Topic activity, mastery or learner-state fields.
11. No curriculum-catalogue record gains a Topic field.
12. No production file imports Topic validation or a Topic index at runtime.

**Deliberately not enforced yet:**

- at least one Screen per Topic — meaningful once the pilot exists;
- Screen contiguity — reported later, not a schema failure;
- 3–8 Screen size guidance — content review, not schema;
- standalone-context quality — content review;
- prerequisite relationships — not part of v1.

**Acceptance:** every existing Chapter validates byte-for-byte unchanged, malformed fixtures fail for the intended reason, and no learner-facing output changes.

---

## T1A — Medicine assignment before authoring

**Pilot Chapter:** `history-medicine-medieval-beliefs-causes`

Before content changes, write a reviewed assignment covering every Screen:

- Topic slug;
- learner-facing title;
- Concept IDs;
- estimated minutes;
- Screen indices assigned to it;
- Chapter-level Screens that deliberately remain unassigned;
- any wording that assumes earlier Chapter context.

This is a pedagogical decision and must be reviewed as content, not generated mechanically from existing tags.

**Acceptance:** every Screen is accounted for, the assignment uses registered Concepts only, and no source content changes.

---

## T1B — Medicine pilot metadata

**Lands:**

- `topics` on `history-medicine-medieval-beliefs-causes`;
- `topic` back-references on the assigned Screens only.

**Prerequisites:** T0B green and T1A reviewed.

**Hard parity requirements:**

- same `screenCount`;
- same derived `screenTags`;
- same `stageNavigation`;
- same Screen order and authored copy;
- same Chapter open/progress/complete behaviour;
- same 390px render before and after.

Topic metadata is inert in T1B. Any visual or behavioural change is a regression.

---

## T2 — generated Topic index

**Lands:**

- `scripts/generate-topic-index.mjs`;
- `src/data/generated/topicIndex.js`;
- a public read boundary only when a later consumer needs it;
- `topics:generate` and `topics:check` commands;
- drift checking inside `pnpm verify`;
- generated documentation or diagnostics for content review.

The generator reads Chapter content through the canonical content-loading boundary. It does not read browser navigation, learner state, planning documents or curriculum compatibility files.

**Generated facts include:**

- global Topic ID;
- Chapter ID;
- position;
- title;
- Concept IDs;
- estimated minutes;
- Screen indices;
- first and last Screen index;
- Chapter-level Screen indices;
- Concept-to-Topic lookup.

**Checks:**

- every Screen back-reference resolves within its own Chapter;
- every Topic has at least one Screen;
- every Concept ID resolves;
- Topic slugs are unique within a Chapter;
- global IDs are unique;
- non-contiguous membership and size outliers are reported;
- same content produces identical bytes.

Still no production consumer imports the index.

---

## T3 — weak-spot recovery uses Topics

Replace first-matching-Screen routing with Concept → Topic → start-Screen resolution.

**Gate:** measure every existing weakness route before and after.

A route moving from Screen 0 or `undefined` to the correct Topic is the intended improvement. A route changing destination Chapter requires explicit review.

Keep `screenTags` until this route and any other consumer have proven replacements.

---

## T4 — standalone Topic refresher

**Lands:**

- direct Topic opening;
- playback of Topic Screens only;
- Topic activity storage under a new key;
- return to the route that opened the refresher.

**Hard boundary:** a refresher must leave `gcse_chapter_<chapter-id>` byte-identical.

**Blocked by:** OD-3 content handling for Screens that assume earlier context.

A refresher may record normal Concept evidence only after the mastery-engine allowlist is explicitly extended in its own reviewed change.

---

## T5 — adaptive planning

The planner may schedule Topic-sized blocks only after Topic routing and standalone playback are stable.

Initial selection should remain deterministic and explainable, using evidence such as:

- repeated incorrect answers;
- low confidence;
- recency;
- previous Topic activity;
- estimated duration.

No opaque “learning style” classification is introduced.

---

## T6 — compatibility cleanup

Cleanup happens only after each replacement is live and proven.

| Existing field or vocabulary | Treatment |
|---|---|
| `question.topicId` | Keep as a question-bank routing key. A future canonical `topicRef` may coexist. |
| `QUESTION_BANKS_BY_TOPIC` | Keep while the question bank uses it. |
| `MEDICINE_TOPICS` | Label explicitly as a legacy question-bank/tag grouping; do not map one-to-one to Chapter Topics. |
| `topic:` facets | Replace subject by subject when registered Concepts exist. |
| `stageNavigation` | Keep until a separate learner-visible progress-header decision replaces it. |
| `screenTags` | Remove only after its final routing/content consumer has migrated. |
| `logWrongAnswer({ topic })` | Keep free text; add canonical identity beside it rather than rewriting rows. |
| `weakPointId` | Never rewrite; it is persisted identity. |

The rule is **add beside, then retire after proof**. No learner row or progress key is rewritten in place.

---

## Runtime and catalogue boundaries

Stage 6 of the curriculum migration is complete. Topic work must preserve its result:

1. Topics never enter `src/curriculum-catalogue/**`.
2. T0A and T0B do not alter `src/data/learnerCurriculum.js` or the generated learner curriculum.
3. The future Topic index is a separate generated artefact under `src/data/generated/`, not `src/data/generated/curriculum/`.
4. Browser navigation never becomes a Topic authority.
5. Topic activity never shares a storage key with Chapter progress.

---

## Failure containment

| Phase | Worst case | Recovery |
|---|---|---|
| T0A | a poor written contract | amend the ADR before implementation |
| T0B | an additive validator rejects valid existing content | revert validator and tests; no content or learner data changed |
| T1A | poor pedagogical grouping on paper | revise assignment before authoring |
| T1B | poor grouping in one Chapter | edit one content file; no learner data exists yet |
| T2 | generated index disagrees with content | drift/validation fails before any runtime import |
| T3 | weakness route lands somewhere worse | revert one lookup; legacy route remains available |
| T4 | Topic activity leaks into Chapter progress | architecture test blocks release |
| T5 | planner over-schedules Topic work | revert Topic block selection |
| T6 | a removed compatibility field was still live | restore it and identify the missed consumer |

No phase is permitted to lose or silently reinterpret learner progress.
