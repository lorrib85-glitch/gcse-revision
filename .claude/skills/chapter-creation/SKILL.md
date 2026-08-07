---
name: chapter-creation
description: >
  Scaffold the governed structure for a new learner-facing GCSE Chapter.
  Creates structure only; it does not author teaching content, Topics or
  readiness evidence.
argument-hint: "<chapter-id>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---

# Chapter creation

Use this workflow to add the structural shell for one learner-facing Chapter
inside an existing parent Module. The canonical hierarchy is
`Subject → Module → Chapter → Screen → Component`.

This skill owns **scaffolding only**. A scaffolded Chapter is not an implemented
Chapter and is not a ready or approved Chapter.

The lifecycle is:

> `chapter-creation` scaffold → `content-create` implementation + Stage-B
> readiness evidence → independent `content-review` approval.

## Prerequisites

1. The canonical Chapter record exists under
   `src/curriculum-catalogue/records/chapters/<subject>/<module>.js`.
2. Exactly one canonical Module record references it in `chapterRefs`, with a
   `position`.
3. The Chapter has an intended `contentPath` under the governed `src/content/`
   structure.

Halt if any prerequisite is missing. Do not create bespoke runtime routing.
Do not select components or invent learning structure during scaffolding.

## Scaffold

Create the content file under `src/content/<subject>/<series>/episodes/` using
the existing series naming convention. Export one Chapter object with the
minimum governed structure needed by the existing schema, including an empty
`screens: []` collection. Do not generate placeholder teaching copy merely to
make the file look complete.

Do **not** invent or author Chapter Topics during a bare scaffold. If an approved
content/build spec already defines Topics, pass that spec to `content-create`;
Topics and their Screen back-references are authored together there under
`docs/system/CHAPTER_TOPICS.md`.

Point the Chapter record's `contentPath` at the file and run
`pnpm curriculum:runtime:generate`. The loader entry is generated from
`contentPath` — never hand-write one, and never add a static episode import to
the app shell or `ChapterPlayer`. `src/data/learnerCurriculum.js` is the
learner-runtime re-export boundary.

A zero-Screen scaffold is valid as a structural state. It is not evidence of
implementation or readiness. A Chapter becomes openable only through the
existing runtime rule (`status: available` plus a derived `screenCount > 0`);
this skill must never describe an empty scaffold as ready simply because its
record and loader resolve.

## Validation

Before reporting the scaffold complete:

- run the Chapter schema/architecture checks relevant to the scaffold;
- confirm `ChapterPlayer` and `ScreenRenderer` were not edited merely to support
  the new Chapter;
- regenerate the projections — `screenCount` and `screenTags` are DERIVED from
  the content file and are never authored or updated by hand;
- run the `gcse-content-registry` alignment check;
- confirm the result is described as **scaffolded / structurally created**, not
  implemented, ready or approved.

`CHAPTER_READINESS_AUDIT.md` is not satisfied by this scaffold. The full
readiness process begins when `content-create` authors or materially rebuilds
the learning content.

## Handoff to content authoring

After scaffolding, hand the Chapter to `content-create` with its confirmed
canonical/build spec. `content-create` owns Screen authoring, Topic authoring
where applicable, component selection through Pattern Governance, the composed
390px render pass and the Stage-B Chapter readiness report. `content-review`
then independently verifies and approves the built scope.

## Completion message

Report:

- Chapter ID;
- parent Module;
- content path;
- generated loader entry;
- schema/registry result;
- intentionally empty authoring sections;
- lifecycle state: **scaffolded — content not implemented; readiness not yet
  assessed**;
- next owner: `content-create`.
