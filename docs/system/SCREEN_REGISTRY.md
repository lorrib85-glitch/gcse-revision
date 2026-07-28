# Governed screen registry

**Runtime sources:**

- `src/data/screenRegistry.js` — authoring names, component links, layout, required data and legacy status.
- `src/components/layout/ScreenRenderer.jsx` — the single component-routing boundary.
- `tests/architecture/screen-registry.test.js` — validates every loaded chapter and prevents routing from returning to `ChapterPlayer`.

## Authoring contract

A chapter author composes `screens` from existing registered screen and block definitions. Authors do not import React components and do not edit `ChapterPlayer`.

Before a type may appear in chapter content it must have:

1. a canonical authoring name;
2. a component implementation;
3. a link to the component registry contract;
4. a declared layout (content or full-screen);
5. required-data validation;
6. continuation ownership where the component gates its own progress.

## Runtime boundary

`ChapterPlayer` owns chapter lifecycle, persistence, universal opener gates, navigation and completion. It asks the registry how the current screen behaves and delegates component selection to `ScreenRenderer`.

Unsupported or malformed screens render a precise development error naming the chapter, screen and missing registry contract. Production content is protected by the architecture validation that loads every registered chapter in CI.

## Legacy authored types

The extracted content currently contains four nested types that the old inline renderer never implemented: `appliedscenario`, `examscored`, `tieredquiz` and `timelinedrag`. They are explicitly registered as legacy so they cannot remain invisible debt.

New content must use their declared replacements. CI permits only the current shrink-only baseline; adding another legacy use fails the architecture contract. Phase 5 does not redesign or reinterpret those interactions.
