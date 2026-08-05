# 0003 — Canonical chapter-topic identity

**Status:** accepted (design only); no implementation, no content, no behaviour change
**Scope:** the teaching unit between a Chapter and its Screens
**Relationship to 0002:** extends it downward. 0002 stops at the Chapter; this
starts there and does not touch anything above it.
**Evidence:** `.planning/chapter-topic-architecture/`

## The problem: "topic" already means five things

A learner who is weak on *miasma* has two possible destinations today. One is a
34-screen chapter. The other is a single screen, chosen by
`findTaggedChapterScreen`, which returns `screenTags.indexOf(tag)` — the first
match, with no framing, no end and no way back. For 13 of the 54 routes in
`TAG_CHAPTER_MAP` it returns nothing at all and the learner lands on screen 0.

There is no entity between the chapter and the screen, and the word that should
name it is already taken five times over:

| Meaning | Where | Vocabulary | Count |
|---|---|---|---:|
| Question-bank grouping | `question.topicId` | `th1`, `tb_immune`, … | 16 |
| Facet tag | `topic:` namespace | `topic:osmosis`, … | 16 |
| Knowledge atom | concept registry | `history:medicine:galen` | 87 |
| Progress-header stage | `stageNavigation` | `part-1`…`part-6` | 6/chapter |
| Weakness label | `logWrongAnswer({ topic })` | free text | unbounded |

None is a revisitable teaching unit inside one chapter, and none can be promoted
into one:

- `th1` means "Medieval Medicine", which spans at least two chapters, while
  `tb_osmosis` is roughly a chapter section — one vocabulary, two orders of
  magnitude of grain, and no owning chapter on either.
- `topic:` facets are, by their own comment in `tagSchema.js`, stand-ins for
  concepts nobody has registered yet.
- Concepts are explicitly not a navigation level (0002 §3.10).
- `stageNavigation` is capped at exactly six slots in two separate files, keyed
  positionally (`part-3` means nothing), and bounded by screen *indices* that
  silently shift when a screen is inserted.
- The weakness-tracker `topic` is unvalidated free text that has already leaked
  into a persisted key: `weakPointId: ${subject}_${topic}_${date}_…`.

`AUDIT.md` records eight distinct collisions with evidence, including one field
(`topicId`) that `selectQuestions.js` matches against both `q.module` and
`q.topic` — one field answering two questions at two levels, which is the exact
shape 0001 and 0002 each removed one layer up.

## Decision

**A Chapter Topic is a new content-level entity: a named, revisitable span of
screens inside exactly one chapter, referencing registered concepts.**

```
Module → Chapter → Topic → Screens
                     └── references one or more Concepts
```

Eight rules, settled in `DECISIONS.md`:

1. **New entity, not a promotion.** No existing "topic" is reinterpreted.
2. **Authored in the chapter's content file**, beside its screens — because
   screen membership is its defining property, and any other home creates two
   files that must agree with nothing enforcing it.
3. **The curriculum catalogue never learns about topics.** It owns the Chapter
   and stops at `contentPath`. This is 0001's and 0002's boundary restated for a
   new entity, not renegotiated.
4. **Ids are semantic and chapter-scoped**, referenced globally as
   `<chapter-id>:<topic-slug>`. Sequential ids are forbidden.
5. **Screens reference their topic; topics never list their screens.** A
   `screenIndices` array would be a second copy of one fact, stale on the next
   insertion — which is exactly how `stageNavigation` drifts and how a quarter
   of the weakness routes broke.
6. **Chapter-level screens omit `topic` entirely** — the hook, the diagnostic,
   exam practice and the close serve the whole chapter.
7. **Topic activity, concept mastery and chapter completion are three separate
   stores.** A topic refresher never advances chapter completion.
8. **Nothing is renamed before its replacement exists.** `topicId`,
   `MEDICINE_TOPICS`, `topic:` facets, `stageNavigation` and `screenTags` all
   stay. New identity is added beside old identity, the rule
   `legacyProgressNames`, `LEGACY_CHAPTER_ID_MAP` and `conceptTag` already
   follow.

## Why rule 7 is the one that matters most

Telling a learner who revisited one topic that they have made chapter progress
is a lie about their revision, and it is the kind of lie that makes them stop
trusting every number the app shows. Chapter completion answers "have I finished
this?", topic activity answers "have I been back?", and concept mastery answers
"do I know this?". Three questions, three stores, no shared key.

## Consequences

**Immediately:** none. This ADR changes no code, no content and no behaviour.

**When implemented** (`MIGRATION-PLAN.md`, T0–T6):

- weak-spot recovery resolves a concept to a *titled span with a start and an
  end* instead of a first-match screen index, which fixes the 13 routes that
  currently land on screen 0;
- a learner can open one topic without replaying its chapter, and without their
  chapter progress moving;
- the adaptive planner can schedule a 6-minute unit instead of a 34-screen one;
- `MEDICINE_TOPICS` becomes an explicitly-labelled legacy grouping. It is **not**
  mapped onto canonical topics: `th1` spans two chapters, so no mapping exists,
  and inventing one would encode a false statement.

**Independent of Stage 3.** Topics live inside content files, one level below
the curriculum catalogue's boundary. The generated topic index is a sibling of
`src/data/generated/curriculum/`, never a child of it. T6 cleanup waits for
Stage 3, because `screenTags` is compared during Stage 3's byte-equality gate.

## Open

Five product decisions remain, each with a stated default so the phases that do
not depend on them are not blocked: what a refresher does at its end (OD-1),
whether the progress header should read from topics (OD-2), how a refresher
handles screens that assume earlier context (OD-3), whether a topic has a size
range (OD-4), and whether topics apply to every subject (OD-5).
