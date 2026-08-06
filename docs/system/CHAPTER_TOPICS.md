# Chapter Topic authoring

This file is practical guidance only. The authoritative contract is:

`docs/decisions/0003-canonical-chapter-topic-identity.md`

If this file conflicts with ADR-0003, follow the ADR.

## Current implementation state

T0B is complete:

- the optional Chapter `topics` shape is enforced by `src/content/chapterTopicSchema.js`;
- Screen `topic` back-references are validated against Topics declared by their own Chapter;
- the validator is build-time/test-time only and is not imported by learner runtime code;
- no existing Chapter currently authors Topic metadata;
- no generated Topic index, Topic storage or learner-facing Topic route exists yet.

## Authored shape

A Chapter may omit `topics` entirely. When it is useful to define standalone revisitable units, author a non-empty array beside `screens`:

```js
topics: [
  {
    id: 'miasma-and-bad-air',
    title: 'Miasma and bad air',
    conceptIds: ['history:medicine:miasma'],
    estimatedMinutes: 6,
  },
]
```

A Screen belonging to that Topic carries only the local slug:

```js
{
  type: 'teachScreen',
  topic: 'miasma-and-bad-air',
}
```

Chapter-wide Screens omit `topic` entirely.

## Rules enforced now

- `topics`, when present, is a non-empty array.
- Every Topic has exactly `id`, `title`, `conceptIds` and `estimatedMinutes`.
- IDs use semantic lowercase kebab case; positional IDs such as `topic-1` are rejected.
- Topic IDs are unique within the Chapter.
- Titles are non-empty learner-facing text.
- `conceptIds` is non-empty, contains registered Concept IDs and has no duplicates.
- `estimatedMinutes` is a positive finite number or `null`.
- A Screen `topic` must resolve to a Topic declared by that same Chapter.
- Progress, activity, mastery, Chapter ownership, Screen indices and prerequisite fields are not authored on Topic records.

## Deliberately not enforced yet

T0B does not require every Topic to own a Screen, does not enforce Screen contiguity, and does not enforce the 3–8 Screen review heuristic. Those checks become meaningful with the Medicine pilot and generated Topic index.

## Authoring workflow

1. Read ADR-0003.
2. Register any missing Concepts separately before referencing them.
3. Write and review the Screen-to-Topic assignment before changing Chapter content.
4. Add Topic records and Screen back-references in the same Chapter content file.
5. Run the Chapter Topic architecture tests and `pnpm verify`.
6. Confirm Screen order, copy, `screenCount`, `screenTags` and `stageNavigation` are unchanged.

The first permitted content pilot is `history-medicine-medieval-beliefs-causes`, and only after its Screen assignment is reviewed in T1A.
