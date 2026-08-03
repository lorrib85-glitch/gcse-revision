# Governed screen registry

**Where the entries are authored:**

- `src/component-catalogue/records/**` — each record's `authoring` block declares the screen and block types its component implements: authoring name, layout, required data, continuation ownership, header mode and status. This is the authority.
- `src/component-catalogue/migrations/authoringCompatibility.js` — legacy types that no component implements but authored content still references. A shrinking set with a removal condition per entry.

**Runtime sources (generated or handwritten, never authored):**

- `src/data/generated/componentAuthoringRegistry.js` — the lean projection, written by `pnpm authoring:generate`. Never hand-edit it; `pnpm authoring:check` fails on drift.
- `src/data/screenRegistry.js` — re-exports the projection and owns the handwritten helpers (resolution, continuation, header mode, chapter validation).
- `src/components/layout/ScreenRenderer.jsx` — the single component-routing boundary.
- `tests/architecture/authoring-registry-integrity.test.js` — the bidirectional contract between projected types and renderer routes.
- `tests/architecture/screen-registry.test.js` — validates every loaded chapter and prevents routing from returning to `ChapterPlayer`.

## Authoring contract

A chapter author composes `screens` from existing registered screen and block definitions. Authors do not import React components and do not edit `ChapterPlayer`.

Before a type may appear in chapter content it must have:

1. a canonical authoring name;
2. a real implementation — either the owning record's component, or a handler
   private to that record's own source, named honestly as such;
3. an `authoring` entry on the record that owns that implementation;
4. a declared layout (content or full-screen);
5. required-data validation;
6. continuation ownership where the component gates its own progress.

## Runtime boundary

`ChapterPlayer` owns chapter lifecycle, persistence, universal opener gates, navigation and completion. It asks the registry how the current screen behaves and delegates component selection to `ScreenRenderer`.

Unsupported or malformed screens render a precise development error naming the chapter, screen and missing registry contract. Production content is protected by the architecture validation that loads every registered chapter in CI.

## Legacy authored types

Four nested block types in the extracted content were never implemented by the old inline renderer: `appliedscenario`, `examscored`, `tieredquiz` and `timelinedrag`. They live in `src/component-catalogue/migrations/authoringCompatibility.js`, each carrying its current handler, the reason it exists and the condition for deleting it.

New content must use their declared replacements. CI permits only the current shrink-only baseline; adding another legacy use fails the architecture contract. The registry is a shrinking set, not a tombstone list — a guard fails an entry the moment its last authored reference disappears, so a compatibility entry can never quietly become permanent.

A retired type with no live content is deleted outright rather than moved here. `choiceReveal`, `visualNarrative`, `cinematicReveal` and `video` were removed on that basis.
