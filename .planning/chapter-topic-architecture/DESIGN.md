# Chapter Topic — target design

**Design only.** No code, no content and no learner behaviour changes with this
document. It defines the contract a later phase implements.

Read `AUDIT.md` first: it establishes that none of the five current meanings of
"topic" can carry this entity.

---

## 1. The hierarchy

```
Module
  └── Chapter          the thing a learner opens and completes
        └── Topic      the thing a learner can revisit on its own
              └── Screens
```

Concepts are **not** a level. They are knowledge atoms referenced across the
layers:

```
Topic ──references──▶ one or more registered Concepts
Chapter ─────────────▶ Concepts (already exists: chapter.conceptIds)
Screen ──────────────▶ Concepts (already exists: screen tags)
Question ────────────▶ Concepts (already exists: question tags)
Mastery ─────────────▶ keyed on Concept (already exists)
```

This restates, and does not amend, DESIGN.md §3.10 of the curriculum
architecture: *concept is never a level in the learner-navigation tree.*

### What each layer is for

| Layer | Answers | Owns |
|---|---|---|
| Chapter | "what am I studying today?" | completion, progress key, content file |
| **Topic** | "what can I go back and fix?" | a focused span of screens, its concepts |
| Concept | "what do I know?" | mastery evidence |
| Screen | "what is in front of me?" | one interaction |

The gap the Topic fills is the second row. Today a learner who is weak on
*miasma* can be sent to a chapter (34 screens) or to a single screen
(`indexOf`, first match only). Neither is a refresher.

---

## 2. The Topic contract

A canonical Chapter Topic **must** support all ten. Each row states how.

| # | Requirement | Mechanism |
|---|---|---|
| 1 | stable id | authored, semantic, `<chapter-id>:<topic-slug>` |
| 2 | learner-facing title | authored `title`, sentence case |
| 3 | exactly one owning chapter | the record lives *in* the chapter's content file; ownership is structural, not a field |
| 4 | deterministic position | array order in `topics`, mirrored to an explicit `position` at build time |
| 5 | one or more registered concepts | `conceptIds`, validated against `conceptRegistry.js` |
| 6 | optional estimated minutes | `estimatedMinutes: number \| null` |
| 7 | deterministic screen membership | each screen carries `topic: '<topic-slug>'`; membership is the set of screens naming it |
| 8 | direct opening as a refresher | a generated `chapter → topic → firstScreenIndex` index |
| 9 | topic activity ≠ chapter completion | separate storage key, separate vocabulary (§7) |
| 10 | future generated lookup | `Chapter → Topic → Concept → screen indices`, generated at build time |

### Record shape

```js
// inside src/content/<subject>/<series>/episodes/<chapter>.js
topics: [
  {
    id: 'four-humours-and-opposites',        // slug, unique within the chapter
    title: 'The four humours and the theory of opposites',
    conceptIds: [
      'history:medicine:four-humours',
      'history:medicine:hippocrates',
    ],
    estimatedMinutes: 6,                      // or null
  },
  …
]
```

and on each screen that belongs to one:

```js
{ type: 'teachScreen', topic: 'four-humours-and-opposites', … }
```

**Four fields, one back-reference.** Everything else is derived.

---

## 3. Where Topic metadata is authored

**In the chapter's own content file, beside its screens.**

Rejected alternatives, with the reason each fails:

| Option | Why not |
|---|---|
| A curriculum-catalogue record | The catalogue is build-time governance and must never learn about screens or components (ADR-0001, ADR-0002). A Topic's defining property is *screen membership*. Putting it there would import the content domain into the curriculum domain — the exact separation both ADRs exist to hold. |
| A separate `src/data/topics/` registry | Two files that must agree about one chapter, with nothing enforcing it. That is the "one fact, two homes" pattern ADR-0002 removed. Screens and topics change in the same edit; they belong in the same file. |
| Derived purely from screen tags | Topics would have no title, no order and no estimated duration, and a chapter with no tagged screens would have no topics. `AUDIT.md` §7 measures 29 of 34 screens untagged. |
| Inside `stageNavigation` | Six slots, positional ids, index-based boundaries, and it is a progress-header presentation concern (`AUDIT.md` §5). |

**The curriculum catalogue keeps the Chapter and never learns the Topic.** The
catalogue's chapter record already carries `contentPath`; a Topic is inside that
content, one level below the boundary. Nothing changes in
`src/curriculum-catalogue/**`.

---

## 4. Ids

### Pattern

**Chapter-scoped slug, globally referenced as `<chapter-id>:<topic-slug>`.**

```
authored:   'four-humours-and-opposites'
referenced: 'history-medicine-medieval-beliefs-causes:four-humours-and-opposites'
```

- **Semantic, never sequential.** `topic-1` is forbidden for the same reason
  `part-3` is useless (`AUDIT.md` §5): a positional id says nothing and changes
  meaning when the chapter is edited.
- **Chapter-scoped when authored** so two chapters may both have a
  `treatments` topic without coordination, and an author never has to check a
  global list.
- **Globally unique when referenced** because a persisted activity row, a
  weak-point route and a generated index all need one string that resolves
  without context. The colon is the same separator the concept grammar already
  uses, and the chapter id is already globally unique.

### Surviving screen reordering

The id is **never** derived from a position. Screens name their topic; the topic
does not name its screens. Reordering screens, inserting one, or moving a screen
between topics changes only the *derived* index, never the id.

This is the property `stageNavigation` does not have and `screenTags` does not
have, and it is why neither can be reused.

### Renaming

A topic slug is a persisted identity as soon as any activity row carries it, so
renaming needs the mechanism chapter ids already use: an entry in a legacy map,
not a silent edit. Until the pilot writes its first activity row, a slug is free
to change.

---

## 5. Screen membership

**Screens reference their topic; topics never list their screens.**

```js
{ type: 'teachScreen', topic: 'four-humours-and-opposites', … }
```

Reasons, in order of weight:

1. **One authored copy.** A `screenIndices: [3, 4, 5]` array on the topic is a
   second statement of the same fact, and it goes stale on the next insertion —
   exactly how `stageNavigation.screenIndex` and the 13 broken
   `TAG_CHAPTER_MAP` routes went wrong.
2. **Membership is a property of the screen.** "This screen teaches the
   humours" is a fact about the screen.
3. **It is derivable in one pass** at build time, giving contiguity checks and
   the refresher index for free.

### Chapter-level screens

Not every screen belongs to a topic. The hook, the prior-knowledge diagnostic,
the exam-practice block and the closing screen serve the whole chapter.

**They omit `topic` entirely.** `topic: null` and an absent key mean the same
thing, and the absent key is the honest one — a chapter-level screen has no
topic, rather than a null one.

A generated `chapterScreens` list carries them so nothing is lost, and a
refresher never replays them.

### Contiguity

A topic's screens **should** be contiguous, and the build check reports when
they are not rather than failing. A deliberately interleaved chapter is a
pedagogical choice; a *silently* interleaved one is usually an authoring slip.
Report, review, decide — the same posture the Stage 3 `screenTags` comparison
takes.

---

## 6. Ordering

**Array order in `topics`, with an explicit `position` emitted at build time.**

Consistent with the curriculum catalogue: ordering lives on the relationship and
the authored file reads in the order it means. Unlike the catalogue's
`chapterRefs`, `position` is not authored here — a chapter's topic list is short
and edited as a unit, so hand-maintained integers would be pure ceremony.

The generated index carries `position` so consumers never re-derive it.

---

## 7. Topic activity vs Concept mastery vs Chapter completion

Three different questions, three different stores. Conflating any two is the
failure this section exists to prevent.

| | Chapter completion | **Topic activity** | Concept mastery |
|---|---|---|---|
| Question | "have I finished this chapter?" | "have I revisited this topic?" | "do I know this?" |
| Key | `gcse_chapter_<id>` | `gcse_topic_<chapter-id>:<slug>` | concept id |
| Owner | `src/data/chapterProgress.js` | new, its own store | `src/data/masteryEngine/**` |
| Written by | `ChapterPlayer` | a topic refresher | answered questions |
| Shape | furthest screen, completion | last visited, visit count | evidence events |
| Derived? | no | no | mastery is **always** derived at read time |

**Three rules:**

1. **A topic refresher never advances chapter completion.** A learner who
   revisits the humours has not made progress through the chapter, and telling
   them they have would be a lie about their revision. This is the single most
   important separation in the design.
2. **A topic refresher records concept mastery normally.** Answering a question
   inside a refresher is evidence about a concept, and the mastery engine
   already keys on concepts. No new mastery vocabulary is introduced.
3. **Topic activity is not mastery.** "Revisited twice" and "knows it" are
   different claims. Topic activity answers "have I been back?", which the
   planner needs for spacing and the learner needs for reassurance; mastery
   answers "should I go back?".

The mastery engine's allowlist guard (`tests/architecture/mastery-engine.test.js`)
stays closed. A topic refresher becomes an authorised consumer in its own phase,
explicitly, or not at all.

---

## 8. The generated index

**`Chapter → Topic → Concept → screen indices`**, generated at build time from
the content files, in the same shape as the four component-catalogue registries.

```js
// generated — illustrative shape only
{
  'history-medicine-medieval-beliefs-causes': {
    topics: [
      {
        id: 'four-humours-and-opposites',
        globalId: 'history-medicine-medieval-beliefs-causes:four-humours-and-opposites',
        title: 'The four humours and the theory of opposites',
        position: 0,
        conceptIds: ['history:medicine:four-humours', 'history:medicine:hippocrates'],
        screenIndices: [3, 4, 5, 6],
        estimatedMinutes: 6,
      },
      …
    ],
    chapterScreens: [0, 1, 2, 28, 29, …],   // hook, diagnostic, exam, close
    byConcept: { 'history:medicine:four-humours': ['four-humours-and-opposites'] },
  },
}
```

Three consumers, none of which exists yet:

| Consumer | What it asks the index |
|---|---|
| Weak-spot recovery | "which topic teaches `history:medicine:miasma`, and where does it start?" — replaces the first-match `screenTags` lookup and the 13 broken routes |
| Adaptive planner | "give me a 6-minute topic covering this learner's weakest concept" |
| Topic refresher | "which screens do I play, and which do I skip?" |

`byConcept` is what makes the first two one lookup instead of a scan, and it is
the reason `conceptIds` is required rather than optional.

**Not a runtime projection of the curriculum catalogue.** It is generated from
`src/content/**`, lives under `src/data/generated/`, and is a separate artefact
from anything Stage 3 emits.

---

## 9. Worked example — `history-medicine-medieval-beliefs-causes`

**Architecture example only. The chapter is not changed by this document.**

Today: 34 screens, 6 positional stages, 5 tagged screens, 10 registered
concepts, and no way to revisit "the humours" without replaying the chapter.

A possible breakdown using **only concepts already in the registry**:

| # | Topic id | Title | Concepts | Existing anchors |
|---:|---|---|---|---|
| 0 | `four-humours-and-opposites` | The four humours and the theory of opposites | `history:medicine:four-humours`, `history:medicine:hippocrates` | screen 3 tagged `four-humours` |
| 1 | `religious-explanations` | Religious explanations of disease | `history:medicine:religion` | — |
| 2 | `astrology-and-the-stars` | Astrology and the stars | `history:medicine:astrology` | — |
| 3 | `miasma-and-bad-air` | Miasma and bad air | `history:medicine:miasma` | screen 14 tagged `miasma` |
| 4 | `who-treated-you` | Who treated you, and how | `history:medicine:barber-surgeons`, `history:medicine:apothecaries`, `history:medicine:medieval-hospitals`, `history:medicine:bloodletting` | screen 13 tagged `medieval-practitioners` |

`history:medicine:galen` (screen 7) sits across topics 0 and 4 — Galen supplies
the theory *and* the treatment rationale. That is a genuine many-to-many between
topic and concept, and it is why `conceptIds` is a list on the topic and
`byConcept` maps one concept to *several* topics.

Screens 0–2 (hook, prior-knowledge recall, roadmap) and 28–33 (core takeaway,
exam prep) carry no `topic` and stay chapter-level.

What this buys, concretely: a learner whose mastery of
`history:medicine:miasma` is weak is currently routed by
`findTaggedChapterScreen` to screen 14 of 34 — one screen, mid-chapter, with no
framing and no end. With topics they open `miasma-and-bad-air`: its screens,
start to finish, without replaying the chapter and without their chapter
completion moving.

---

## 10. What this design deliberately does not do

- **No runtime topic index.** Deferred to its own phase.
- **No content migration.** Not one screen gains a `topic` key in this pack.
- **No topic progress behaviour.** The store in §7 is specified, not built.
- **No change to `stageNavigation`.** The progress header keeps its six slots;
  topics and stages coexist until a later phase decides whether the header
  should read from topics instead.
- **No change to the curriculum catalogue.** Not one record, not one field.
- **No renaming of `topicId` or `MEDICINE_TOPICS`.** See `MIGRATION-PLAN.md` §4.
