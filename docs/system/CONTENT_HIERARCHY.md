# Content Hierarchy

**Status:** Canonical architecture contract  
**Scope:** Content metadata, chapter authoring, runtime orchestration, progress and discovery

## Purpose

The component directory exists so new GCSE chapters can be assembled quickly from governed learning components without adding bespoke application logic for each chapter.

To support that goal, every part of the codebase must use one stable hierarchy:

```text
Subject
└── Module
    └── Chapter
        └── Screen
            └── Component
```

The terms are not interchangeable. Each level owns a different job.

## Canonical levels

### Subject

The top-level curriculum and product area, such as History, Maths or Biology.

A subject owns:

- subject identity and visual theme;
- subject-level progress;
- the available modules;
- broad navigation and reporting.

A subject does not own chapter screen order or component rendering.

### Module

A substantial curriculum unit containing an ordered set of chapters.

Examples include:

- Medicine Through Time;
- Sociology of the Family;
- Number Survival Kit;
- Body Systems Under Pressure.

A module owns:

- module identity and syllabus scope;
- ordered `chapterIds`;
- module-level progress;
- module-level assessment and completion when implemented;
- the route from one chapter to the next.

A module does not render individual learning components.

### Chapter

One focused learner journey through a coherent topic.

A chapter owns:

- a stable chapter ID;
- title, subtitle and curriculum metadata;
- optional hook, outcomes and prior-knowledge recall;
- an ordered collection of screens;
- chapter resume and completion state;
- any chapter-level examiner or recovery diversion.

A chapter should be authorable as governed content data. Creating a normal chapter must not require editing the chapter runtime.

### Screen

One learner-facing moment with one primary learning intent.

A screen owns:

- a registered screen type;
- the content required by that type;
- its local completion conditions;
- its place in the chapter sequence.

A screen does not own chapter navigation, persistence or module completion.

### Component

The governed presentation or interaction used to perform a screen's learning job.

A component owns:

- its visual and interaction contract;
- local state required for its activity;
- accessibility and reduced-motion behaviour;
- a clear completion or evidence callback where applicable.

A component does not decide which chapter comes next, write chapter-level progress directly or invent a parallel navigation system.

## Authoring boundary

The intended chapter-building flow is:

1. Choose the learning objective.
2. Choose the screen intent.
3. Select an approved component from the Component Registry.
4. Supply content that matches the component contract.
5. Add the registered screen definition to the chapter's ordered `screens` collection.
6. Allow the chapter runtime to provide navigation, persistence, recovery and completion.

A normal chapter must be content composition, not application engineering.

## Relationship rules

The following rules are enforced by `tests/architecture/content-hierarchy.test.js`:

- Every chapter has a unique ID.
- Every module has a unique ID.
- Every module contains at least one chapter ID.
- Every chapter ID referenced by a module resolves to real chapter metadata.
- A chapter cannot appear twice within one module.
- A chapter cannot belong to more than one module.
- A module and each of its chapters must share the same subject.

Chapters may remain temporarily unassigned during migration or while future modules are being structured. They must not be discoverable as production content unless the existing availability rules also permit them.

## Current legacy names

The codebase currently contains a naming inversion. These names are migration inputs, not the canonical model:

| Current name | Current meaning | Canonical destination |
|---|---|---|
| `MODULES` | Chapter metadata collection | `CHAPTERS` |
| `MODULE_GROUPS` | Parent module metadata collection | `MODULES` |
| `ModulePlayer` | Runtime for one learner-facing chapter | `ChapterPlayer` |
| `loadModuleContent` | Loads one chapter's full content | `loadChapterContent` |
| `getModuleState` / `saveModuleState` | Chapter resume state | `getChapterState` / `saveChapterState` |
| `gcse_module_<id>` | Stored chapter progress | `gcse_chapter_<id>` after a safe migration |

Do not introduce new architecture APIs using the legacy meanings. Compatibility aliases may remain temporarily while existing imports and stored progress are migrated.

## Progress identity

Existing chapter IDs are stable learner-progress identities and must not change during this refactor.

The later storage migration must:

- read the canonical chapter key first;
- fall back to the legacy module key;
- copy valid legacy state forward without losing data;
- preserve screen position, opener gates, examiner attempts and completion;
- avoid double-counting progress.

Phase 1 changes no storage keys and no learner-facing behaviour.

## Runtime target

The intended runtime boundary is:

```text
Module flow
└── ChapterPlayer
    └── ScreenRenderer
        └── Governed component
```

`ChapterPlayer` owns chapter navigation and state. `ScreenRenderer` maps registered screen types to governed components. Components remain focused on their own learning interaction.

## Change discipline

This hierarchy refactor must be completed in independently mergeable phases.

Do not combine it with:

- component redesigns;
- chapter content rewrites;
- progress scoring changes;
- new subject-specific exceptions;
- module-level feature speculation.

The migration is complete only when `module` consistently means a parent curriculum unit and `chapter` consistently means one learner journey across code, tests, tooling and documentation.
