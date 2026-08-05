# Content hierarchy

## Canonical model

`Subject → Module → Chapter → Screen → Component`

- **Subject** owns brand, specification and overall progress.
- **Module** is a parent curriculum unit containing an ordered `chapterIds` list.
- **Chapter** is one learner-facing journey with hook, outcomes, recall and screens.
- **Screen** is one governed learning moment.
- **Component** is the reusable presentation or interaction used by a screen.

## Ownership split — order vs metadata

> **Since the Stage 4 cutover, `src/data/modules.js`, `src/chapters.js` and
> `src/content/chapterContentRegistry.js` are generated re-export boundaries.**
> They are still the correct import path for every consumer; they are never
> authored in. What follows describes what each *runtime export* carries and
> where that fact is now authored.

`MODULES` carries, authored on **module records**
(`src/curriculum-catalogue/records/modules/`):

- which parent module a chapter belongs to — `chapterRefs`;
- the canonical order of real chapters inside that module — `position`;
- the module sequence used by module-aware navigation.

`CHAPTERS` carries, authored on **chapter records**
(`src/curriculum-catalogue/records/chapters/`) unless noted:

- chapter metadata: title, subtitle, era, icon, header image;
- subject — derived from the owning module's `subjectId`;
- `series`, `number`, `color` and `colorLight` — legacy presentation held in the
  temporary compatibility projection, not authored anywhere new;
- `screenCount` and `screenTags` — **derived from the content file**, never
  authored;
- availability — derived from `screenCount`, with one hidden legacy override;
- the metadata a progress card renders.

**Position in the `CHAPTERS` array is not the learner journey order.** It is
projection order. Any surface that presents chapters in sequence resolves that
sequence through `MODULES`; nothing derives real order by filtering `CHAPTERS`.

## Ownership invariant

Every chapter whose effective availability is not `hidden` must belong to
exactly one module. This covers `available` and `comingSoon` chapters alike — a
chapter a learner can see must have a parent, because ownership is what gives it
a position in the journey.

An explicitly `hidden` chapter (a superseded or migration entry) is the sole
permitted exemption. Availability metadata already carries that meaning, so
there is no migration allowlist and no grandfathering.

`src/data/contentHierarchy.js` enforces this in both directions —
module→chapter and chapter→module — and
`tests/architecture/content-hierarchy.test.js` runs it over the live catalogue.

## Subject browsing

`src/features/subjects/subjectNavigationAdapter.js` assembles the subject-browser
catalogue. Real chapters are the subject's modules' `chapterIds`, flattened in
module order and resolved against `CHAPTERS`; real order is never derived with
`CHAPTERS.filter()`.

**Real chapters vs synthetic placeholders.** The browser also renders `cs_*`
placeholder cards for series with no built chapters. They are browse-surface
presentation only: not chapters, no content file, no loader, no progress, never
openable. They must never be added to `CHAPTERS` or `MODULES`, and canonical
content rules do not apply to them.

**Numbering.** A real chapter displays its authored `chapter.number`. A
generated position is only a fallback for a synthetic card that carries no
number. Hidden chapters are removed before numbering, so a superseded entry
cannot shift a visible chapter's position.

**Series tabs are presentation, not ownership.** The History and English series
tabs — labels, titles, hero images, and the empty Elizabethan coming-soon tab —
live in `src/features/subjects/Subjects.jsx`. A `series` value is chapter
identity used to group cards under a tab; it is not a module id and does not
have to match one. Series presentation is not a second ownership hierarchy, and
adding a tab does not create a module.

## Authoritative files

- `src/curriculum-catalogue/records/modules/` — **authored** module membership and order.
- `src/curriculum-catalogue/records/chapters/` — **authored** chapter identity and `contentPath`.
- `src/data/modules.js` — re-export boundary for `MODULES`; never authored in.
- `src/chapters.js` — re-export boundary for `CHAPTERS`; never authored in.
- `src/content/chapterContentRegistry.js` — re-export boundary for the generated loaders; never authored in.
- `src/data/contentHierarchy.js` — hierarchy levels and the relationship validator.
- `src/features/subjects/subjectNavigationAdapter.js` — subject-browser catalogue assembly.
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

## Completion hand-off rule

Completion hand-off stays within the current subject and only targets an
available chapter.

`buildChapterCompletePayload` (`src/app/chapterNavigation.js`) resolves the next
chapter through `resolveNextAvailableChapter`, which skips coming-soon, hidden
and missing chapters inside the parent module, then looks at later same-subject
modules, and returns nothing when the subject has no available successor. Moving
a learner between subjects belongs to the planner, Home and the subject browser
— never to the completion screen.

Module array position therefore carries no build-status meaning. Do not order
`MODULES` around what is or is not built.
