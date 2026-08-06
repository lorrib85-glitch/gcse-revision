---
name: chapter-creation
description: >
  Scaffold a new learner-facing GCSE chapter from the governed component directory.
  Creates structure only; it does not invent teaching content.
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

Use this workflow to add one learner-facing chapter inside an existing parent module.
The canonical hierarchy is `Subject → Module → Chapter → Screen → Component`.

## Prerequisites

1. The canonical chapter record exists under
   `src/curriculum-catalogue/records/chapters/<subject>/<module>.js`.
2. Exactly one canonical module record references it in `chapterRefs`, with a
   `position`.
3. The intended screen and block types exist in `src/data/screenRegistry.js`.
4. Relevant component decisions are documented in `docs/components/COMPONENT_REGISTRY.md`.

Halt if any prerequisite is missing. Do not create bespoke runtime routing.

## Scaffold

Create the content file under `src/content/<subject>/<series>/episodes/` using the
existing series naming convention. Export one chapter object with metadata, hook,
outcomes, recall, stage navigation and `screens: []`. Do not generate placeholder
copy or teaching content.

Point the chapter record's `contentPath` at that file and run
`pnpm curriculum:runtime:generate`. The loader entry is generated from
`contentPath` — never hand-write one, and never add a static episode import to
the app shell or `ChapterPlayer`. `src/data/learnerCurriculum.js` is the generated-runtime
generated re-export boundary.

## Validation

Before completion:

- run the chapter schema/architecture suite;
- confirm every screen and nested block resolves through `screenRegistry.js`;
- confirm `ChapterPlayer` and `ScreenRenderer` were not edited merely to support
  the new chapter;
- regenerate the projections — `screenCount` and `screenTags` are DERIVED from
  the content file and are never authored or updated by hand;
- run `pnpm lab:generate` if screen or block usage changed;
- run the content-registry alignment check.

## Completion message

Report the chapter ID, parent module, content path, loader entry, schema result and
any intentionally empty authoring sections.
