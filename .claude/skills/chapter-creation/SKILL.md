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

1. The chapter metadata row exists in `src/chapters.js`.
2. Its parent module in `src/data/modules.js` contains the chapter ID in `chapterIds`.
3. The intended screen and block types exist in `src/data/screenRegistry.js`.
4. Relevant component decisions are documented in `docs/components/COMPONENT_REGISTRY.md`.

Halt if any prerequisite is missing. Do not create bespoke runtime routing.

## Scaffold

Create the content file under `src/content/<subject>/<series>/episodes/` using the
existing series naming convention. Export one chapter object with metadata, hook,
outcomes, recall, stage navigation and `screens: []`. Do not generate placeholder
copy or teaching content.

Add a dynamic loader to `CHAPTER_CONTENT_LOADERS` in
`src/content/chapterContentRegistry.js`. Never add a static episode import to the
app shell or `ChapterPlayer`.

## Validation

Before completion:

- run the chapter schema/architecture suite;
- confirm every screen and nested block resolves through `screenRegistry.js`;
- confirm `ChapterPlayer` and `ScreenRenderer` were not edited merely to support
  the new chapter;
- update `screenCount` and `screenTags` in `src/chapters.js` after content exists;
- run the content-registry alignment check.

## Completion message

Report the chapter ID, parent module, content path, loader entry, schema result and
any intentionally empty authoring sections.
