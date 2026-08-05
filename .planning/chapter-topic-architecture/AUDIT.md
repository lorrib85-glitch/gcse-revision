# Chapter Topic — current-state audit

**Measurement only.** Nothing in this document changes behaviour. Every count
below was taken from the repository at `4a63539`; where a number is derived
rather than counted, it says so.

The question this audit answers: **does the word "topic" already mean one thing
in this codebase?** It does not. It means at least five, and two of them are not
about teaching at all.

---

## 1. The five current meanings

| # | Meaning | Where it lives | Vocabulary | Count |
|---|---|---|---|---:|
| 1 | **Question-bank grouping** | `question.topicId`, `QUESTION_BANKS_BY_TOPIC` | `th1`…`th5`, `th_wf`, `th_modern`, `tb_cells`, `tb_immune`, … | 16 keys |
| 2 | **Facet tag** | `topic:` namespace in `tagSchema.js` | `topic:osmosis`, `topic:averages`, `topic:grammar`, … | 16 distinct tags |
| 3 | **Canonical concept** | `conceptRegistry.js` | `history:medicine:galen` | 87 registered |
| 4 | **Chapter stage** | `chapter.stageNavigation` | `part-1`…`part-6` | 6 per chapter, fixed |
| 5 | **Free-text weakness label** | `logWrongAnswer({ topic })` | unbounded strings | unbounded |

None of these is a revisitable teaching unit inside a chapter. That entity does
not exist today, which is the finding this pack is built on.

---

## 2. Meaning 1 — `topicId`, the question-bank grouping

### What it is

`QUESTION_BANKS_BY_TOPIC` (`src/data/questionBanks/questionRegistry.js`) is a
flat map from a short id to an array of questions. `questionSchema.js` documents
`topicId` as "routing key into `QUESTION_BANKS_BY_TOPIC`" — a **routing key**,
not a curriculum position.

### Census

Counted from `QUESTION_BANKS_BY_TOPIC` itself — 16 keys — not from raw
`topicId:` occurrences, which double-count questions that also appear in a
quickfire export.

| Id | Label (`MEDICINE_TOPICS`) | Questions | Grain |
|---|---|---:|---|
| `th1` | Medieval Medicine | 5 | a whole historical period |
| `th2` | Renaissance Medicine | 4 | a whole historical period |
| `th3` | Surgery & Anatomy, c1700–c1900 | 4 | two centuries |
| `th4` | Germ Theory & Vaccination | 3 | a theme across chapters |
| `th5` | Public Health | 3 | a theme across chapters |
| `th_wf` | The Western Front, 1914–18 | 3 | a whole module |
| `th_modern` | Modern Medicine | 1 | a whole period |
| `tb_cells` | — | 6 | roughly a chapter |
| `tb_cells_div` | — | 4 | roughly a chapter section |
| `tb_immune` | — | 11 | roughly a chapter |
| `tb_digest` | — | 9 | roughly a chapter |
| `tb_blood` | — | 8 | roughly a chapter |
| `tb_transp` | — | 8 | roughly a chapter section |
| `tb_osmosis` | — | 6 | roughly a chapter section |
| `tb_photo` | — | 6 | roughly a chapter section |
| `tb_resp` | — | 6 | roughly a chapter section |

`th_modern` has **one** question and `tb_immune` has **eleven**. One
vocabulary, an 11× spread in coverage, and no rule anywhere about what a
`topicId` is supposed to cover.

### Why it is not a Chapter Topic

1. **The grain is inconsistent and mostly too coarse.** `th1` covers Medieval
   Medicine — one *module-sized* span that maps to at least two chapters.
   `tb_osmosis` is roughly a chapter section. One vocabulary, both grains.
2. **It has no owning chapter.** `th1` does not belong to
   `history-medicine-medieval-beliefs-causes`; it spans it and the Black Death
   chapter. Nothing records which chapter, because no field could.
3. **It is already load-bearing elsewhere.**
   `src/app/chapterNavigation.js:207` passes `topicId: 'th1'` to launch the 2023
   exam paper. `ExamMode.normaliseExamQuestion` *fabricates* one when a question
   has none: `question.topicId || topicId || subject.toLowerCase()` — so
   `'maths'` and `'english'` are live `topicId` values that were never authored.
4. **Two banks disagree about what the key selects.**
   `selectQuestions.js:20-21` treats `topicId` as interchangeable with *both*
   `q.module` and `q.topic`:
   ```js
   if (moduleId) pool = pool.filter(q => q.module === moduleId || q.topicId === moduleId)
   if (topic)    pool = pool.filter(q => q.topic === topic   || q.topicId === topic)
   ```
   One field is being asked to answer two different questions at two different
   levels. That is the exact shape ADR-0002 removed one layer up.

**Verdict: a question-bank grouping, correctly named for what it does and wrongly
shaped for what a Topic needs. It is not evidence of a canonical Topic id.**

---

## 3. Meaning 2 — the `topic:` facet namespace

`tagSchema.js` lists `topic` among 11 facet namespaces, and its own comment
already calls the problem:

> `'topic'`, // `topic:osmosis` — free question-bank topic label (pre-graph);
> prefer a registered concept tag once the subject has one

16 tags exist: `topic:cells`, `topic:osmosis`, `topic:immunity`,
`topic:photosynthesis`, `topic:respiration`, `topic:transpiration`,
`topic:digestion`, `topic:circulation`, `topic:cell-division`,
`topic:drug-testing`, `topic:pathogens`, `topic:averages`,
`topic:percentages`, `topic:times-tables`, `topic:grammar`,
`topic:language-devices`.

Every one is in Biology, Maths or English — the three subjects whose concept
coverage is thinnest. **They are a stand-in for concepts that were never
registered, not a Topic layer.** Six of them (`cells`, `osmosis`, `immunity`,
`photosynthesis`, `respiration`, `transpiration`) name knowledge atoms, which is
concept-shaped, not topic-shaped.

**Verdict: a placeholder for unregistered concepts. Not a Chapter Topic.**

---

## 4. Meaning 3 — registered concepts

87 concepts across 7 namespaces (`history:medicine`, `biology:building-blocks`,
`biology:organisation`, `biology:infection-response`, `biology:bioenergetics`,
`maths:number`, `english:language-paper-1`).

DESIGN.md §3.10 of the curriculum architecture already settled two rules:

1. a concept id is a knowledge namespace, **not** a curriculum position;
2. **concept is never a level in the learner-navigation tree.**

Concepts are the right vocabulary for *what a Topic teaches*. They are the wrong
vocabulary for *what a learner opens*, because they carry no position, no
screens and no chapter.

**Verdict: the knowledge layer a Topic references. Not the Topic itself.**

---

## 5. Meaning 4 — `stageNavigation`

### What it is

An authored array on each built chapter, consumed by
`getStageNavigation(chapter, total)` (`src/app/chapterNavigation.js`) and
rendered by `LearningProgressHeader`.

```js
stageNavigation: [
  { id: 'part-1', title: 'The ship that changed England', description: '…', screenIndex: 0 },
  …
]
```

### Three hard constraints, measured

1. **Exactly six, or none.** `getStageNavigation` accepts the authored array
   only when `fromChapter.length === 6`; anything else silently falls back to
   six generated stages at evenly-spaced indices. `LearningProgressHeader`
   repeats the check: `stageNavigation.length === 6 ? stageNavigation :
   INTERNAL_FALLBACK`. Six is a *presentation* constant.
2. **Position is an index, not an identity.** `screenIndex` is an integer into
   `screens`. Inserting one screen at the top of a chapter silently moves every
   stage boundary below it. Nothing detects that.
3. **Ids are positional.** `part-1`…`part-6`, or `fallback-1`…`fallback-6`.
   `part-3` of one chapter and `part-3` of another share an id and mean nothing
   in common.

`getCurrentStageFromNavigation` resolves the current stage by scanning for the
largest `screenIndex <= screen` — so a stage is a *range*, derived, never
stored.

**Verdict: a progress-header segmentation. Six is a UI constant, the ids are
positional, and the boundaries are indices. It cannot carry Topic identity, and
a Topic must not inherit its six-slot ceiling.**

---

## 6. Meaning 5 — `topic` in the weakness tracker

`logWrongAnswer({ subject, topic, conceptTag, … })` stores a **free-text**
`topic` into `gcse_wrong_answers`. The field is unvalidated and comes from eight
different call sites with eight different vocabularies:

| Caller | What it puts in `topic` |
|---|---|
| `PriorKnowledgeRecall.jsx:212` | `c.tag` — a screen-level concept tag |
| `useExamPaperState.js:66` | `q.topicId \|\| q.topic \|\| 'General'` |
| `MatchingTask`, `OrderedRouteTask`, `MisconceptionCheck`, `SpotTheError` | author-supplied strings |
| `ExamQuestionFrame`, `ExamRoundDebrief` | question metadata |
| `logWrongAnswerLegacy` | `subject: 'Unknown'` plus a raw tag |

The tracker already knew this was unsafe. A second field was added beside it:

```js
// Canonical recovery-routing identity (a TAG_CHAPTER_MAP key), stored
// separately from the human-readable `topic`. null for sources that don't
// supply one — those stay safe (routed only if `topic` is itself a key).
conceptTag: metadata.conceptTag || null,
```

So there are already **two** fields on a wrong-answer row: one human-readable
and unbounded, one canonical and routable. `dailyPlanner.js` then groups
weak points on the *unbounded* one (`topics[w.topic]`), and
`weakPointId` is built as `${subject}_${topic}_${date}_…` — a **persisted key
containing a free-text topic string**.

**Verdict: `topic` here is a display label that leaked into a persisted
identity. It is the single largest compatibility hazard in this migration.**

---

## 7. Screen membership today: `screenTags`

`findTaggedChapterScreen(chapter, tag)` returns
`chapter.screenTags.indexOf(tag)` — the first screen whose tag matches, or
`undefined`.

Measured on `history-medicine-medieval-beliefs-causes` (34 screens):

```
5 of 34 screens carry a tag: four-humours(3) galen(7)
                             medieval-practitioners(13) miasma(14)
                             core-takeaway(28)
29 of 34 are null
```

`screenTags` is a positional array derived at build time from
`screen.tag || null`. Consequences:

- **It is sparse.** 85% of screens in the flagship chapter have no tag, so no
  screen-to-anything membership can be derived from it.
- **One tag, one screen.** `indexOf` returns the *first* match, so a tag
  spanning four screens routes to one and loses three.
- **`core-takeaway` is not knowledge.** Navigational and composite tags share
  the array with concept-shaped ones, and nothing distinguishes them —
  `MEDICINE_SCREEN_TAG_CONCEPTS` exists precisely to bridge the confident subset
  and deliberately omits the rest.
- **A quarter of routes are already broken.** Anomaly A-20 measured 13 of 54
  `TAG_CHAPTER_MAP` entries naming a chapter whose `screenTags` do not contain
  that tag, so the learner lands on screen 0.

**Verdict: `screenTags` cannot express Topic membership. It is a sparse,
first-match, positional index that is already 24% wrong.**

---

## 8. `MEDICINE_TOPICS` — the closest existing thing

```js
export const MEDICINE_TOPICS = {
  th1: { label: 'Medieval Medicine', tags: ['period:medieval'] },
  …
}
```

Two consumers:

1. `masteryRecorder.js:41` — the **only** authorised mastery consumer. It uses
   `MEDICINE_TOPICS[question.topicId].tags` as the *outer* layer of
   `resolveEffectiveTags(topicTags, questionTags)`, i.e. as tag inheritance.
2. `learning-graph.test.js` — asserts every medicine question's `topicId`
   resolves.

Its `tags` are **facets only** (`period:`, `theme:`), never concepts. The
recorder's own comment says so:

> medicine's topic layer is the only one with tags today and module-level
> medicine tags are facets only, so nothing concept-shaped is lost.

**Verdict: a tag-inheritance layer for the question bank, named "topics". It is
a real, working mechanism and it is not a Chapter Topic.**

---

## 9. Collisions and ambiguities

| # | Collision | Evidence | Cost |
|---|---|---|---|
| **C-1** | `topicId` means both "question bank" and "module" | `selectQuestions.js:20-21` matches it against `q.module` *and* `q.topic` | one field, two levels — a filter can silently select the wrong pool |
| **C-2** | `topicId` values are fabricated at runtime | `ExamMode.jsx:122` falls back to `subject.toLowerCase()` | `'maths'`, `'english'`, `'sociology'`, `'chemistry'` are live topic ids nobody authored |
| **C-3** | `th1` is both a bank id and a launch argument | `chapterNavigation.js:207` | a question-bank key is doing navigation |
| **C-4** | `topic` in weakness rows is free text **and** part of a persisted key | `weakPointId: ${subject}_${topic}_${date}_…` | renaming any topic label orphans stored weak points |
| **C-5** | `topic:` facets duplicate concepts | `topic:osmosis` vs an unregistered `biology:…:osmosis` | two vocabularies for one knowledge atom |
| **C-6** | `part-N` stage ids are chapter-local and positional | `getStageNavigation` fallback generates `fallback-N` | no stage can be referenced from outside its chapter |
| **C-7** | Screen membership is first-match | `findTaggedChapterScreen` uses `indexOf` | a multi-screen teaching unit collapses to one screen |
| **C-8** | 24% of weakness routes miss | A-20, 13 of 54 | learner lands at screen 0 instead of the fix |

---

## 10. What does not exist

Searched and **absent**: no `contentSupport` field on any screen or chapter.
`src/data/contentSupport/` is a *directory* of concept-repair lookups
(`conceptRepairLookup.js`, `historyMedicineEpisode01.js`,
`historyMedicineEpisode02.js`) keyed by **concept id**, not by topic. It is the
closest working precedent for what a Topic index should look like — per-episode,
concept-keyed, build-time — and it is per-episode by hand today.

Also absent: any entity with a stable id, an owning chapter, a position, screen
membership and a learner-facing title. That is the gap.

---

## 11. Summary

- **5** meanings of "topic", **0** of which is a revisitable unit inside a chapter.
- **16** question-bank ids, from 1 question to 11, and from a chapter section to a two-chapter period.
- **16** `topic:` facets, all of them stand-ins for unregistered concepts.
- **6** stage slots per chapter, hard-coded in two files, keyed positionally.
- **5 of 34** screens tagged in the flagship chapter.
- **8** collisions, one of which (**C-4**) already writes free text into a
  persisted key.

The evidence does not support promoting `th1`, `topic:` or any question-bank
value to a canonical Chapter Topic id. A new, small, content-level entity is
required, and `DESIGN.md` defines it.
