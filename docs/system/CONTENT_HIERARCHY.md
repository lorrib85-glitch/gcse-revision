# Content hierarchy

## Canonical model

`Subject → Module → Chapter → Screen → Component`

- **Subject** owns brand, specification and overall progress.
- **Module** is a parent curriculum unit containing an ordered `chapterIds` list.
- **Chapter** is one learner-facing journey with hook, outcomes, recall and screens.
- **Screen** is one governed learning moment.
- **Component** is the reusable presentation or interaction used by a screen.

## Authoritative files

- `src/data/modules.js` — parent module catalogue.
- `src/chapters.js` — chapter metadata and availability.
- `src/content/chapterContentRegistry.js` — lazy chapter-content loaders.
- `src/data/screenRegistry.js` — approved screen/block schema and authoring contract.
- `src/components/layout/ChapterPlayer.jsx` — chapter lifecycle and navigation.
- `src/components/layout/ScreenRenderer.jsx` — the only component-routing boundary.
- `src/progress.js` — canonical chapter progress APIs.

## Chapter-building rule

A normal chapter is assembled as data from registered screens and blocks. Adding a
chapter must not require edits to `ChapterPlayer` or a new component-routing branch.
Add or amend a reusable component through the component-governance process first,
then register its authoring contract in `screenRegistry.js`.

## Progress identity

Chapter progress is stored under `gcse_chapter_<chapterId>`. The persistence layer
may still read older `gcse_module_<chapterId>` keys solely to migrate existing user
data; no production code writes those keys. Parent modules do not own screen-level
resume state.

## Naming contract

In active code and authoring documentation:

- `module` always means a parent curriculum unit;
- `chapter` always means one learner-facing journey;
- `screen` always means one routed learning moment;
- `component` always means a reusable governed implementation.

Historical archive documents may preserve terminology that was accurate when they
were written. They are not authoring guidance.
