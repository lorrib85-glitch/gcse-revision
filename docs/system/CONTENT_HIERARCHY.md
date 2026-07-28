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

## Canonical catalogue surfaces

Phase 2 establishes these public data and discovery boundaries:

| Responsibility | Canonical surface |
|---|---|
| Chapter metadata | `CHAPTERS` from `src/chapters.js` |
| Chapter availability | `CHAPTER_AVAILABILITY`, `getChapterAvailability`, `isChapterAvailable` from `src/chapters.js` |
| Parent module metadata | `MODULES` from `src/data/modules.js` |
| Chapter content loaders | `CHAPTER_CONTENT_LOADERS`, `loadChapterContent` from `src/content/chapterContentRegistry.js` |
| Recovery routing | `TAG_CHAPTER_MAP`, `findTaggedChapterScreen` from `src/data/tagChapterMap.js` |
| Continue discovery | `getContinueChapter`, `getInProgressChapter` from `src/progress.js` |

`src/data/modules.js` is the sole owner of the parent module list. Progress code may consume that catalogue but must not define a second copy.

New chapter-building, discovery and architecture code must use these canonical surfaces. `tests/architecture/legacy-content-imports.test.js` keeps the remaining legacy imports on an explicit shrink-only allowlist.

## Current legacy names

The codebase still contains migration aliases. These names are compatibility inputs, not the canonical model:

| Current name | Current meaning | Canonical destination |
|---|---|---|
| `MODULES` from `src/modules.js` | Chapter metadata collection | `CHAPTERS` from `src/chapters.js` |
| `MODULE_GROUPS` from `src/progress.js` | Parent module metadata collection | `MODULES` from `src/data/modules.js` |
| `MODULE_CONTENT_LOADERS` | Chapter content loader registry | `CHAPTER_CONTENT_LOADERS` |
| `TAG_MODULE_MAP` | Tag-to-chapter recovery routing | `TAG_CHAPTER_MAP` |
| `ModulePlayer` | Compatibility export for the former chapter runtime | `ChapterPlayer` |
| `loadModuleContent` | Removed app-shell action name | `loadChapterContent` |
| `getModuleState` / `saveModuleState` | Chapter resume state | `getChapterState` / `saveChapterState` |
| `gcse_module_<id>` | Stored chapter progress | `gcse_chapter_<id>` after a safe migration |

Do not introduce new architecture APIs using the legacy meanings. Compatibility aliases remain temporarily while existing runtime imports and stored progress are migrated.

## Progress identity

Existing chapter IDs are stable learner-progress identities and must not change during this refactor.

The later storage migration must:

- read the canonical chapter key first;
- fall back to the legacy module key;
- copy valid legacy state forward without losing data;
- preserve screen position, opener gates, examiner attempts and completion;
- avoid double-counting progress.

Phase 3 makes `gcse_chapter_<id>` the canonical chapter-progress key.

During the migration window:

- `getChapterState` reads the canonical key first and folds forward any
  `gcse_module_<id>` or historical short-id copy;
- `saveChapterState` writes only the canonical key;
- compatibility APIs call the canonical implementation and therefore cannot
  create new legacy keys;
- local and cloud snapshots canonicalise cross-key duplicates with monotonic
  screen, completion, opener-gate and examiner-attempt preservation;
- a fallback key is removed only after its canonical replacement is safely
  persisted.

Existing chapter IDs remain unchanged and continue to be the learner-progress identity.

## Runtime target

The intended runtime boundary is:

```text
Module flow
└── ChapterPlayer
    └── ScreenRenderer
        └── Governed component
```

`ChapterPlayer` now owns chapter navigation and state. `ModulePlayer` and `moduleNavigation.js` remain temporary compatibility facades only. `ScreenRenderer` is the Phase 5 target for mapping registered screen types to governed components. Components remain focused on their own learning interaction.

## Change discipline

This hierarchy refactor must be completed in independently mergeable phases.

Do not combine it with:

- component redesigns;
- chapter content rewrites;
- progress scoring changes;
- new subject-specific exceptions;
- module-level feature speculation.

The migration is complete only when `module` consistently means a parent curriculum unit and `chapter` consistently means one learner journey across code, tests, tooling and documentation.
