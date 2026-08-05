# Chapter Topic — decisions

Settled decisions are binding on the phases in `MIGRATION-PLAN.md`. Open
decisions have an owner and a stated default, so an unanswered question does not
block the phases that do not depend on it.

**8 settled · 5 open.**

---

## Settled

### T-1 — A Chapter Topic is a new entity, not a promotion of an existing one

None of the five current meanings of "topic" can carry the contract
(`AUDIT.md` §1). `topicId` has no owning chapter and a grain varying by two
orders of magnitude; `topic:` facets are stand-ins for unregistered concepts;
concepts are explicitly not a navigation level; `stageNavigation` has six
positional slots and index-based boundaries; the weakness-tracker `topic` is
unvalidated free text.

*Why it matters:* promoting `th1` would have made "Medieval Medicine" — a
two-chapter span — a chapter-scoped topic, and the contradiction would have
surfaced the first time a learner tried to open it.

### T-2 — Topics are content-level, authored in the chapter's content file

A topic's defining property is screen membership, and screens live in the
content file. Any other home creates two files that must agree about one chapter
with nothing enforcing it — the pattern ADR-0002 removed one layer up.

### T-3 — The curriculum catalogue never learns about topics

The catalogue owns the Chapter and stops at `contentPath`. A catalogue record
may not reference a topic, a screen or a component; this is the same boundary
ADR-0001 and ADR-0002 already hold, restated for a new entity rather than
renegotiated.

### T-4 — Ids are semantic and chapter-scoped, referenced globally

Authored `four-humours-and-opposites`, referenced
`history-medicine-medieval-beliefs-causes:four-humours-and-opposites`.
Sequential ids (`topic-1`) are forbidden: `AUDIT.md` §5 measures what positional
ids cost — `part-3` means nothing and changes meaning when the chapter is
edited.

### T-5 — Screens reference their topic; topics never list their screens

A `screenIndices` array on the topic would be a second copy of one fact and
would go stale on the next insertion. That is precisely how
`stageNavigation.screenIndex` drifts and how 13 of 54 `TAG_CHAPTER_MAP` routes
became wrong. Membership derives in one build-time pass.

### T-6 — Chapter-level screens omit `topic` entirely

The hook, the diagnostic, exam practice and the close serve the whole chapter.
They carry no `topic` key rather than `topic: null` — an absent key states "this
screen has no topic", which is true, where a null states "its topic is nothing",
which is not.

### T-7 — Topic activity, concept mastery and chapter completion are three stores

A topic refresher **never** advances chapter completion. It records concept
mastery normally, because mastery is already keyed on concepts. Topic activity
gets its own key and answers only "have I been back?".

*Why it matters:* telling a learner who revisited one topic that they have made
chapter progress is a lie about their revision, and it is the kind of lie that
makes a learner stop trusting the app's numbers.

### T-8 — Nothing is renamed before its replacement exists

`topicId`, `QUESTION_BANKS_BY_TOPIC`, `MEDICINE_TOPICS`, `stageNavigation`,
`screenTags` and the weakness-tracker `topic` are all kept as they are.
`MEDICINE_TOPICS` becomes an explicitly-labelled legacy grouping and is **not**
mapped onto canonical topics, because `th1` spans two chapters and no mapping
exists. New identity is added beside old identity — the rule
`legacyProgressNames`, `LEGACY_CHAPTER_ID_MAP` and `conceptTag` already follow.

---

## Open

### OD-1 — What happens at the end of a topic refresher?

**Owner:** product (Lorri). **Blocks:** T4.
**Options:** (a) return to where the learner came from; (b) offer the next topic
in the chapter; (c) offer a short retrieval check on the topic's concepts.
**Default if unanswered:** (a). It is the least surprising and adds no new
screen type.
**Why it needs an answer:** (c) is the pedagogically strongest and is also the
one that generates mastery evidence, which changes what T4 must be authorised
for.

### OD-2 — Does the progress header read from topics?

**Owner:** product. **Blocks:** nothing; T4 ships either way.
**Context:** `stageNavigation` has exactly six slots, enforced in two files, and
a chapter may have more or fewer topics — the pilot has five. Reading the header
from topics would remove a duplicate segmentation and would also change what the
header shows on every built chapter.
**Default if unanswered:** keep both. Stages stay a presentation concern; topics
stay a teaching concern.

### OD-3 — What does a refresher do when its screens assume earlier context?

**Owner:** content (`/content-review`). **Blocks:** T4.
**Context:** a screen in topic 3 may open with "as we saw with Galen…". Played
standalone, that reads as a broken reference.
**Options:** (a) author topics to be self-contained from the start; (b) allow a
topic to declare prerequisite topics and offer them; (c) accept the rough edge
in the pilot and measure it.
**Default if unanswered:** (c) for the pilot, then decide with evidence. Adding
a prerequisite graph before knowing whether it is needed is the field-nobody-
maintains failure the curriculum work already rejected three times.

### OD-4 — Does a topic have a minimum or maximum size?

**Owner:** content. **Blocks:** nothing; it is a review heuristic, not a schema
rule.
**Context:** the pilot's five topics divide 34 screens unevenly. A one-screen
topic is probably a screen; a fifteen-screen topic is probably a chapter.
**Default if unanswered:** no schema constraint, a `/content-review` heuristic
of roughly 3–8 screens, and the build reports outliers rather than failing.

### OD-5 — Do topics apply to every subject, or only to chapters that earn them?

**Owner:** product. **Blocks:** nothing before T5.
**Context:** an 8-screen Maths chapter may be one topic, which is the same as
having none. Mandating topics everywhere would produce ceremony in half the
catalogue.
**Default if unanswered:** `topics` stays optional. A chapter without them
behaves exactly as it does today, and the index simply has no entry for it.

---

## Rejected

| Rejected | Why |
|---|---|
| Topic as a curriculum-catalogue record | Its defining property is screen membership; the catalogue must never learn about screens (T-3). |
| Topic as a fourth navigation level in the browser | The learner journey is Subject → Pathway → Module → Chapter. A topic is a *re-entry point*, not a browse tier. |
| Renaming `topicId` to `bankId` | 16 ids, 6 files, 4 consumers, and no user for the rename. It is churn wearing tidiness. |
| Mapping `MEDICINE_TOPICS` onto canonical topics | `th1` spans at least two chapters. No mapping exists, and inventing one would encode a false statement. |
| Deriving topics from `screenTags` | 29 of 34 screens in the pilot chapter are untagged, and `indexOf` returns one screen per tag. |
| `topic.screenIndices` authored on the record | A second copy of one fact, stale on the next insertion (T-5). |
| A prerequisite graph between topics in v1 | No demonstrated requirement. See OD-3 default. |
| Topic-level completion percentages | Chapter completion and concept mastery already answer "how far" and "how well". A third percentage would be a third number to reconcile. |
