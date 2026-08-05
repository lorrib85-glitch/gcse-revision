# Chapter Topic architecture

**Audit and design only.** No production behaviour, authored content,
learner-facing UI, progress storage, component routing or generated registry was
changed. Not one screen gained a `topic` key.

Baseline SHA: `4a63539` (`main`).

---

## Read in this order

| # | Document | What it settles |
|---|---|---|
| 1 | `AUDIT.md` | What "topic" means today — five meanings, eight collisions, all measured |
| 2 | `DESIGN.md` | The Topic contract, where it is authored, and a worked example |
| 3 | `DECISIONS.md` | 8 settled decisions, 5 open with owners and defaults |
| 4 | `MIGRATION-PLAN.md` | T0–T6, prerequisites, and the compatibility treatment of every existing field |

The decision record is `docs/decisions/0003-canonical-chapter-topic-identity.md`.

---

## The finding in one paragraph

A learner who is weak on *miasma* can be sent to a 34-screen chapter or to a
single screen chosen by `screenTags.indexOf(tag)` — and for 13 of 54 routes,
to screen 0. There is no entity between the chapter and the screen. The word
that should name it already means five different things, none of which has an
owning chapter, a stable id and screen membership at the same time. So a
Chapter Topic is a new content-level entity: a named, revisitable span of
screens inside exactly one chapter, referencing registered concepts, with its
own activity store that never touches chapter completion.

---

## Boundaries this pack respected

- Stage 3 of the curriculum migration was **not** started.
- `src/data/generated/curriculum/` does **not** exist.
- `MODULES`, `CHAPTERS` and `CHAPTER_CONTENT_LOADERS` are unchanged.
- `ChapterPlayer`, `ScreenRenderer` and navigation are unchanged.
- No screen data was migrated and no topic progress behaviour was created.
- No topic, screen type or component entered a curriculum-catalogue record.
- The curriculum ontology was extended downward, not redesigned.
