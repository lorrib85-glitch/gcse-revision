# 0003 — Canonical Chapter Topic identity

**Status:** accepted; T0A contract complete  
**Implementation status:** no schema, content metadata, generated index or learner behaviour exists yet  
**Scope:** the teaching unit between a Chapter and its Screens  
**Relationship to 0002:** extends the canonical curriculum architecture downward. ADR-0002 stops at the Chapter; this decision starts there and changes nothing above it.  
**Supporting evidence:** `.planning/chapter-topic-architecture/`

If a planning document conflicts with this ADR, this ADR is authoritative.

## Problem

The app has no stable unit between a whole Chapter and one Screen. A learner who is weak on *miasma* can currently be sent back to a long Chapter or to the first Screen carrying a matching tag. Neither is a coherent refresher with a title, beginning and end.

The word “topic” already has several unrelated meanings in the codebase:

- question-bank routing through `question.topicId`;
- `topic:` facet tags;
- free-text weakness labels;
- progress-header stages;
- informal curriculum language.

None of these has exactly one owning Chapter, stable identity, learner-facing title, registered concepts and deterministic Screen membership. Reinterpreting one would encode false relationships and risk persisted learner data.

## Decision

A **Chapter Topic** is a new content-level entity: a named, revisitable span of Screens inside exactly one Chapter, referencing one or more registered Concepts.

```text
Module → Chapter → Topic → Screens
                     └── references Concepts
```

A Topic is not a seventh curriculum entity and not a new browser level. It is a focused re-entry point inside a Chapter.

## V1 authored contract

Topics are authored in the Chapter content file, beside the Screens they organise.

```js
topics: [
  {
    id: 'four-humours-and-opposites',
    title: 'The four humours and the theory of opposites',
    conceptIds: [
      'history:medicine:four-humours',
      'history:medicine:hippocrates',
    ],
    estimatedMinutes: 6,
  },
]
```

A Screen that belongs to the Topic carries the Chapter-scoped slug:

```js
{
  type: 'teachScreen',
  topic: 'four-humours-and-opposites',
  // ...existing Screen fields
}
```

The Topic record has exactly four authored fields in v1:

| Field | Contract |
|---|---|
| `id` | Required semantic kebab-case slug, unique within the Chapter |
| `title` | Required learner-facing sentence-case title |
| `conceptIds` | Required non-empty list of registered Concept IDs |
| `estimatedMinutes` | Required positive number or `null` |

Everything else is derived later.

### Deliberately not authored

A Topic record does **not** contain:

- `chapterId` — ownership is structural because the record lives in one Chapter content file;
- `screenRefs` or `screenIndices` — Screens carry the single membership statement;
- `position` — array order is authored and a later generator emits position;
- `globalId` — derived as `<chapter-id>:<topic-slug>`;
- `prerequisiteTopicIds` — no demonstrated requirement in v1;
- progress, mastery, completion or learner-state fields.

## Identity

The authored identity is Chapter-scoped:

```text
four-humours-and-opposites
```

The globally resolvable identity is derived:

```text
history-medicine-medieval-beliefs-causes:four-humours-and-opposites
```

Rules:

1. IDs are semantic, never sequential. `topic-1`, `part-2` and equivalent positional IDs are forbidden.
2. Reordering Screens or Topics never changes identity.
3. Two Chapters may use the same local slug because the global identity includes the Chapter ID.
4. Once Topic activity is persisted, a rename requires an explicit legacy mapping rather than a silent edit.

## Ownership boundaries

### Chapter content owns

- Topic records;
- Topic order;
- learner-facing Topic titles;
- Concept references;
- estimated duration;
- each Screen’s Topic back-reference.

### Curriculum catalogue owns

- Subjects, Specifications, Pathways, Modules and Chapters;
- Chapter identity and `contentPath`.

The curriculum catalogue must never reference Topics, Screens or components.

### Generated learner curriculum owns

The existing canonical learner runtime remains the sole authority for Modules, Chapters, Learning Sequences and content loaders. T0A and T0B do not add Topics to that projection.

A future Topic index is generated separately from Chapter content under `src/data/generated/`, not under `src/data/generated/curriculum/`.

## Screen membership

Screens reference Topics; Topics never enumerate Screens.

This prevents two authored copies of the same fact. Screen insertion and reordering therefore change only derived indices, not Topic records or Topic IDs.

Chapter-wide Screens omit `topic` entirely. Typical examples are:

- Chapter hook;
- prior-knowledge diagnostic;
- roadmap;
- Chapter-wide exam practice;
- closing Screen.

`topic: null` is not authored. Absence means the Screen is Chapter-level.

Topic Screens should usually be contiguous, but contiguity is a content-review signal rather than a schema failure. Deliberate interleaving remains possible.

## Optionality and size

`topics` is optional. A Chapter without useful standalone revisitable units remains valid and behaves exactly as it does now.

A Topic is normally about **3–8 Screens**. This is review guidance, not a schema minimum or maximum:

- a one-Screen Topic is probably just a Screen;
- a very large Topic may indicate the Chapter boundary needs review;
- exceptions are reported and reviewed rather than rejected mechanically.

## State separation

Chapter completion, Topic activity and Concept mastery answer different questions and must remain separate.

| Store | Answers | Example key |
|---|---|---|
| Chapter progress | “Have I progressed through or completed this Chapter?” | `gcse_chapter_<chapter-id>` |
| Topic activity | “Have I revisited this Topic?” | future `gcse_topic_<chapter-id>:<topic-slug>` |
| Concept mastery | “How well do I know this Concept?” | Concept ID |

A future Topic refresher must never advance Chapter completion. Questions answered inside it may still produce normal Concept evidence. Topic activity is not a mastery score.

## Refresher return behaviour

The v1 default is to return the learner to the route that opened the refresher. This is the least surprising behaviour and avoids inventing a new progression flow.

A later retrieval check may be added as a distinct product decision, but it is not part of the Topic identity contract.

## Compatibility

Existing meanings of “topic” are not renamed or reinterpreted in T0A:

- `question.topicId` and `QUESTION_BANKS_BY_TOPIC` remain question-bank routing keys;
- `MEDICINE_TOPICS` remains a legacy question-bank grouping;
- `topic:` facets remain until registered Concepts replace them subject by subject;
- `stageNavigation` remains a Chapter progress-header concern;
- `screenTags` remains until Topic routing replaces its last consumer;
- persisted weakness labels and `weakPointId` remain untouched.

New identity is added beside old identity. Persisted learner data is never rewritten in place.

## Consequences

### Now — T0A

- The contract and ownership boundaries are frozen.
- No content file gains `topics` or Screen `topic` metadata.
- No runtime API, generated index, storage key or learner behaviour is added.
- No curriculum-catalogue record changes.

### Next — T0B

A schema and validator will implement this contract additively. Every existing Chapter without `topics` must continue to validate unchanged. Only after T0B is green may the Medicine pilot author Topic metadata.

## Rejected alternatives

- Topic as a curriculum-catalogue record.
- Topic as a fourth browser/navigation tier.
- A separate handwritten Topic registry.
- Deriving Topics only from existing Screen tags.
- Authoring `screenIndices` or `screenRefs` on Topic records.
- Sequential Topic IDs.
- Topic-level completion percentages.
- A prerequisite graph in v1.
