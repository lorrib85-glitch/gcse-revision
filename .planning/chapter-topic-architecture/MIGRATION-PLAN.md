# Chapter Topic — migration plan

**Nothing in this document is executed by this pack.** It sequences the work so
each phase lands independently, keeps `pnpm verify` green, and can be reverted
without touching the one before it.

The governing constraint, unchanged from the curriculum migration: **`MODULES`,
`CHAPTERS` and `CHAPTER_CONTENT_LOADERS` keep their exact export names and
shapes.** Chapter progress keys are never touched.

---

## Phase shape

```
T0  Contract and validation exist, no content uses them      no runtime change
T1  Medicine pilot — one chapter authors topics              no runtime change
T2  Generated index emitted and checked                      no runtime change
T3  Weak-spot recovery reads the index                       VISIBLE, gated
T4  Topic refresher — a learner opens one topic              VISIBLE, gated
T5  Adaptive planner schedules topics                        VISIBLE, gated
T6  Compatibility cleanup: topicId, topic:, MEDICINE_TOPICS  cleanup
```

T0–T2 are behaviour-preserving. The first learner-visible change is **T3**, and
it is an improvement to a route that is measurably broken today (24% of
weakness routes land on screen 0 — anomaly A-20).

---

## T0 — the contract exists and nothing uses it

**Lands:** a topic schema and validator for the `topics` array and the screen
`topic` back-reference; an architecture test asserting that a chapter with no
`topics` key is valid and unchanged.

**Deliberately not landed:** any content, any index, any consumer.

**Verification:** every existing chapter still validates untouched. That is the
whole test — the contract must be additive or it is wrong.

**Reversible by:** deleting one file.

---

## T1 — the Medicine pilot

**Lands:** `topics` on `history-medicine-medieval-beliefs-causes`, and a `topic`
key on the screens that belong to one. Chapter-level screens stay untouched.

**Why this chapter:** 34 screens, 10 registered concepts, the most tagged screens
of any chapter, and it is the destination of 7 of the 54 `TAG_CHAPTER_MAP`
entries. If topics do not fit here they fit nowhere.

**Prerequisites — all four, before a single line of content changes:**

1. **T0 merged.** Authoring against an unvalidated shape produces a shape.
2. **Every concept the pilot references is already registered.** The five topics
   in `DESIGN.md` §9 use only existing ids; if a sixth topic needs a new
   concept, the concept is registered in its own commit first.
3. **A written screen-to-topic assignment, reviewed before authoring.** Which of
   the 34 screens belongs to which topic, and which are chapter-level. This is a
   pedagogical judgement, not a mechanical one, and `/content-review` governs
   it.
4. **The chapter renders identically afterwards.** A 390px render pass before
   and after. `topic` is inert metadata at T1 — if anything moves on screen, the
   change is wrong.

**Verification:** `screenCount` unchanged, `screenTags` unchanged,
`stageNavigation` unchanged, chapter opens/progresses/completes identically.

---

## T2 — the generated index

**Lands:** `scripts/generate-topic-index.mjs` writing
`src/data/generated/topicIndex.js`, plus `topics:check` in `pnpm verify`.

Same discipline as the four component-catalogue registries: deterministic, same
content in / same bytes out, `GENERATED FILE — DO NOT EDIT` banner, drift check.

**Checks the generator enforces:**

- every screen `topic` resolves to a topic declared by its own chapter;
- every topic has at least one screen (a topic nothing teaches is an authoring
  slip);
- every `conceptIds` entry is registered;
- topic slugs are unique within a chapter;
- non-contiguous screen membership is **reported, not failed** (`DESIGN.md` §5).

**Still no runtime change.** Nothing imports the index.

---

## T3 — weak-spot recovery reads the index

**The first learner-visible phase, and the one with the clearest payoff.**

Today `findTaggedChapterScreen` returns the first screen whose tag matches, or
`undefined`; 13 of 54 routes return `undefined` and drop the learner at screen
0. With the index, a concept resolves to a *topic* — a titled span with a start
and an end.

**Gated on:** T2 green, and a measured before/after of all 54 routes. A route
moving from screen 0 to a real topic is the point; a route that changes
*destination chapter* is a regression and must be reviewed individually.

**Reversible by:** reverting one lookup.

---

## T4 — the topic refresher

**Lands:** the ability to open one topic without replaying its chapter, plus the
topic-activity store from `DESIGN.md` §7.

**Prerequisites:**

1. **T3 shipped and stable.** Routing must be right before it becomes a
   destination.
2. **A settled answer to OD-3 (`DECISIONS.md`)** — what a refresher does when
   its topic's screens assume earlier chapter context.
3. **A separate storage key, proven not to touch `gcse_chapter_<id>`.** An
   architecture test asserting a refresher session leaves chapter progress
   byte-identical. This is the hard boundary of the whole feature.
4. **The mastery-engine allowlist explicitly extended** to the refresher, in its
   own change, per `tests/architecture/mastery-engine.test.js`.

**Not in scope:** any change to what chapter completion means.

---

## T5 — adaptive planning over topics

`buildDailyPlan` gains topic-sized blocks: "6 minutes on miasma" instead of
"open a 34-screen chapter". Depends on `estimatedMinutes` being authored widely
enough to be useful, which is a content prerequisite, not an engineering one.

---

## T6 — compatibility cleanup

Only after T3–T5 have a working replacement for each.

---

## 4. Compatibility treatment of the existing fields

Nothing below is renamed, deleted or reinterpreted before its replacement
exists. Each row states what happens and when.

| Field | Treatment | Phase |
|---|---|---|
| `question.topicId` | **Kept, unchanged, indefinitely.** It is a question-bank routing key and it works. It is *not* renamed to `bankId`, because 16 ids across 6 files and 4 consumers is a rename with no user. A future question may additionally carry a canonical `topicRef`; the two coexist. | — |
| `QUESTION_BANKS_BY_TOPIC` | Kept. Same reasoning. | — |
| `MEDICINE_TOPICS` | **Becomes a legacy grouping, explicitly.** It is a *tag-inheritance layer* for the question bank (`AUDIT.md` §8), not a topic set, and its `tags` are facets only. It is **not** renamed and **not** mapped one-to-one onto canonical topics — `th1` "Medieval Medicine" spans at least two chapters, so no mapping exists. It gains a comment saying what it is, and `masteryRecorder` keeps using it until questions carry concept tags directly. | T6 |
| `topic:` facets | **Superseded per subject, never in bulk.** Each is a stand-in for an unregistered concept. When a subject's concepts are registered, its `topic:` tags are replaced in that subject's own change; `tagSchema.js` already says "prefer a registered concept tag once the subject has one". The namespace itself is removed only when the last tag goes. | T6 |
| `stageNavigation` | **Kept, unchanged.** It is progress-header presentation with a hard six-slot contract in two files. Whether the header should read from topics is a separate product question (OD-4), not a migration step. | — |
| `screenTags` | Kept until T3 removes its last routing consumer; it is also load-bearing for Stage 3 of the curriculum migration, which must land first. | T6 |
| `logWrongAnswer({ topic })` | **Kept and never rewritten.** Existing rows carry free text and `weakPointId` embeds it (`AUDIT.md` C-4). A `topicRef` field is *added* beside `conceptTag` — the precedent already set when `conceptTag` was added beside `topic`. No stored row is rewritten and no weak point is orphaned. | T3 |
| `weakPointId` | Untouched. It is a persisted key containing a free-text topic string; changing its shape orphans stored weak points. New weak points may carry `topicRef` as an extra field. | — |

**The rule across every row: add beside, never rewrite in place.** It is the
same rule `legacyProgressNames`, `LEGACY_CHAPTER_ID_MAP` and `conceptTag`
already follow, and it is why none of them lost learner data.

---

## 5. Prerequisites for Stage 3 of the curriculum migration

Stage 3 (curriculum runtime projections) and the Topic work are **independent
and must not be interleaved**. Stage 3 generates `MODULES`, `CHAPTERS` and
`CHAPTER_CONTENT_LOADERS` from the curriculum catalogue; topics live inside
content files, one level below that boundary.

Two constraints hold in both directions:

1. **Topics must not enter the curriculum catalogue.** A catalogue record may
   never reference a topic, a screen or a component. T0's validator lives with
   the content schema, not with `src/curriculum-catalogue/schema.js`.
2. **T2's index must not be written under `src/data/generated/curriculum/`.**
   That path is Stage 3's, generated from a different source with a different
   check. `src/data/generated/topicIndex.js` is a sibling, not a child.

**Ordering:** T0–T2 may proceed at any time. **T6 must wait for Stage 3**,
because `screenTags` is compared during Stage 3's byte-equality gate and
removing it early would remove the thing being compared.

---

## 6. Prerequisites for standalone adaptive topic refreshers

The end state — "you are weak on miasma, here is a 6-minute refresher" — needs
all six:

1. T2 shipped: the `byConcept` index exists.
2. T3 shipped: concepts resolve to topics, not to first-match screens.
3. T4 shipped: a topic can be opened and its activity recorded separately from
   chapter completion.
4. `estimatedMinutes` authored on enough topics to schedule against.
5. The mastery engine authorised to be **read** by the planner — today it is
   write-only from QuickFire, and the allowlist guard blocks everything else.
6. OD-1 and OD-3 settled: what a refresher does at its end, and what it does
   when its screens assume earlier chapter context.

Until 5 is granted, a refresher can be *routed to* but cannot be *chosen for*
the learner by mastery. T3 is still worth shipping without it: it fixes 13
broken routes on its own.

---

## 7. What each phase costs if it goes wrong

| Phase | Worst case | Recovery |
|---|---|---|
| T0 | a validator nobody calls | delete one file |
| T1 | topics carve one chapter badly | edit one content file; no learner data involved |
| T2 | the index disagrees with content | the drift check fails; nothing ships |
| T3 | a weakness route lands somewhere worse | revert one lookup; `screenTags` still exists |
| T4 | topic activity leaks into chapter progress | the architecture test in T4's prerequisites is what stops this reaching a learner at all |
| T5 | the planner over-schedules refreshers | revert the block type |
| T6 | a deleted field was load-bearing | restore from git |

**No phase can lose learner progress.** Chapter progress keys are untouched
throughout, topic activity is a new key, and no persisted weakness row is ever
rewritten.
