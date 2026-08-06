# Chapter Topic — decisions

Settled decisions are binding on the implementation phases in `MIGRATION-PLAN.md`. This file records product and architecture choices; ADR-0003 is the authoritative contract.

**11 settled · 2 open**

---

## Settled

### T-1 — A Chapter Topic is a new entity, not a promotion of an existing one

No current meaning of “topic” carries the required contract. Question-bank IDs, `topic:` facets, Concepts, `stageNavigation` and weakness labels remain separate vocabularies.

### T-2 — Topics are content-level and authored in the Chapter content file

A Topic’s defining property is Screen membership. Topics and their Screens therefore change in the same file and the same review.

### T-3 — The curriculum catalogue never learns about Topics

The catalogue owns the Chapter and stops at `contentPath`. A curriculum record may not reference a Topic, Screen or component.

### T-4 — IDs are semantic and Chapter-scoped, then referenced globally

Authored:

```text
four-humours-and-opposites
```

Referenced:

```text
history-medicine-medieval-beliefs-causes:four-humours-and-opposites
```

Sequential IDs such as `topic-1` are forbidden.

### T-5 — Screens reference their Topic; Topics never list Screens

A Screen carries `topic: '<topic-slug>'`. Topic records do not carry `screenRefs`, `screenIndices` or equivalent duplicate membership.

### T-6 — Chapter-level Screens omit `topic`

Hooks, diagnostics, roadmaps, Chapter-wide exam practice and closes may remain Chapter-level. They omit the key entirely rather than authoring `topic: null`.

### T-7 — Topic activity, Concept mastery and Chapter completion are separate stores

A Topic refresher never advances Chapter completion. Questions answered inside a refresher may produce ordinary Concept evidence. Topic activity records revisit behaviour only.

### T-8 — Nothing is renamed before its replacement exists

`topicId`, `QUESTION_BANKS_BY_TOPIC`, `MEDICINE_TOPICS`, `stageNavigation`, `screenTags`, free-text weakness labels and `weakPointId` remain unchanged until a proven replacement exists. New identity is added beside old identity; persisted rows are not rewritten.

### T-9 — A Topic refresher returns to its origin by default

At the end of a refresher, the learner returns to the route that opened it. This is predictable, reversible and introduces no new progression rule.

A short retrieval check may be added later, but it is a separate product feature rather than part of Topic identity.

### T-10 — Topic size is review guidance, not schema

The working heuristic is roughly **3–8 Screens**.

- one Screen is usually too small to justify a Topic;
- a very large Topic may indicate a weak Chapter boundary;
- exceptions are reported and reviewed rather than mechanically rejected.

### T-11 — Topics are optional

Not every Chapter earns a Topic layer. A short Maths Chapter, for example, may already be the smallest useful revisitable unit.

A Chapter without `topics` remains valid, unchanged and absent from the future Topic index.

---

## Open

### OD-2 — Does the progress header eventually read from Topics?

**Owner:** product  
**Blocks:** nothing before a later presentation redesign

`stageNavigation` is a six-slot Chapter progress-header concern. Topics are teaching units and may number more or fewer than six.

**Current decision:** keep both. Any replacement of `stageNavigation` requires a separate learner-visible product change and is not part of T0–T4.

### OD-3 — What happens when a Topic’s Screens assume earlier Chapter context?

**Owner:** content review  
**Blocks:** T4 standalone refresher

A Screen might say “as we saw with Galen…” and make poor sense when opened independently.

V1 does **not** add `prerequisiteTopicIds` or a prerequisite graph. The pilot will identify contextual dependencies explicitly. Content review can then choose among:

1. rewrite the Topic to be self-contained;
2. add a small refresher introduction;
3. accept a measured rough edge in the pilot;
4. propose a later prerequisite mechanism with evidence.

The absence of a prerequisite graph is deliberate, not an omission.

---

## Rejected

| Rejected | Why |
|---|---|
| Topic as a curriculum-catalogue record | Screen membership is content-level; the catalogue must not learn about Screens. |
| Topic as another browser tier | A Topic is a re-entry point inside a Chapter, not a fourth curriculum-navigation level. |
| A separate handwritten Topic registry | It creates two files that must agree about the same Chapter. |
| Renaming `topicId` to `bankId` during this work | Churn with no learner benefit and unnecessary risk to existing consumers. |
| Mapping `MEDICINE_TOPICS` one-to-one onto Chapter Topics | Existing groups span different grains and sometimes multiple Chapters; the mapping would be false. |
| Deriving Topics only from `screenTags` | Tags do not provide complete membership, title, order or estimated duration. |
| Authoring `topic.screenIndices` or `screenRefs` | A second copy of membership that becomes stale when Screens move. |
| Sequential IDs | Position is not identity. |
| Topic-level completion percentages | Chapter completion and Concept mastery already answer the useful progress questions. |
| A prerequisite graph in v1 | No demonstrated requirement or maintenance pattern yet. |
