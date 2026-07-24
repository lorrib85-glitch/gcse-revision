# FractionRatioExplore — design

**Date:** 2026-07-24
**Lane:** E (Big Build — new component family)
**Status:** approved for planning

## Purpose

A single configuration-driven visual engine for *parts of a whole* across the
Maths spine. Today fractions, ratio, percentages and direct proportion are
taught as separate topics with no shared visual language, so a learner who
understands `3/4` of a bar does not recognise the same bar when it is labelled
`3 : 1` or `75%`. One engine with one visual grammar makes the connection
structural rather than something a teacher has to assert.

Coverage: fractions, equivalent fractions, simplifying, comparing fractions,
adding and subtracting fractions, fractions of amounts, ratio as shares, ratio
simplification, direct proportion, percentages, and fraction–decimal–percentage
conversion — roughly a quarter of the current course spine.

## User story

As a GCSE Maths student, I want to see fractions, ratio, percentages and
proportion drawn on the same divided whole, so that I recognise them in the
exam as one idea in different clothes rather than four unrelated methods.

## Visual grammar

Four rules govern every preset. They are the reason this is one engine and not
eight components.

| Rule | Meaning | Expressed as |
|---|---|---|
| Same whole | The outer rectangle never changes size when the maths changes | Every `bar` in a preset shares one `x` and `width`; only `parts` varies |
| Divided parts | The whole is always visibly cut into equal parts | `bars[].parts` + `shaded`; `cells` for 2D; `sectors` for circles; `counters` for discrete sets |
| Linked representations | The same quantity appears simultaneously in two or more forms | `connectors` (curved paths joining bar → line → glyph) and a `fractions` array rendering a real stacked fraction glyph with a rule line |
| Scaling both sides together | Multiplying top and bottom, or both sides of a ratio, is one gesture | `rungs` joining two parallel `lines`, driven by a single shared multiplier control |

## Architecture

Direct sibling of `AngleExplore` and `AreaPerimeterExplore`, following their
established split.

```
src/components/learning/FractionRatioExplore.jsx          renderer + interaction
src/components/learning/FractionRatioExplore.stories.jsx
src/components/learning/fractionRatio/
  fractionRatioMath.js         pure number work
  fractionRatioGeometry.js     pure layout, model space
  fractionRatioVisualRoles.js  semantic colour roles
  presets/
    fractionBar.js
    equivalentFractions.js
    fractionOperations.js
    ratioShare.js
    doubleNumberLine.js
    percentageGrid.js
    proportionScale.js
    bestValue.js
    index.js                   registry + resolve/clamp helpers
```

Presets are one file each rather than a single module. `anglePresets.js` is
already 807 lines for simpler presets; these carry step sequences and method
branches, so a single file would be unreadable and unreviewable.

### Division of responsibility

The component owns diagram state and the drag / keyboard / step interaction.
Questions, predictions, exam tasks, marking, scoring and weakness tracking
belong to the page that composes the diagram — identical to both siblings. This
is what keeps the engine reusable across a quarter of the spine instead of
being welded to one chapter's assessment.

`fractionRatioMath.js` and `fractionRatioGeometry.js` are pure and independently
testable. Presets import from them and return plain data. The renderer imports
no maths.

## Scene contract

Each preset exposes `derive(values, { method, step, focus })` returning a scene
of optional typed arrays. The renderer walks them in a fixed z-order and knows
nothing about fractions.

```js
{
  bars:        [{ id, x, y, width, height, parts, shaded, tone, dividerTone, ghost }],
  cells:       [{ id, x, y, width, height, tone, hatch }],
  sectors:     [{ id, cx, cy, radius, startTurn, endTurn, tone }],
  counters:    [{ id, cx, cy, r, tone, filled }],
  lines:       [{ id, x1, y1, x2, y2, tone, dashed, arrow }],
  rungs:       [{ id, x, y1, y2, tone }],
  brackets:    [{ id, x1, x2, y, tone, text, below }],
  connectors:  [{ id, path, tone, dashed }],
  labels:      [{ id, x, y, text, role, size, anchor }],
  fractions:   [{ id, x, y, numerator, denominator, tone, size }],
  handles:     [{ controlId, x, y }],
  status:      { heading, calculation: [], explanation },
}
```

Every array is optional, so a simple preset stays simple. Tones are semantic
role names resolved through `fractionRatioVisualRoles.js`; presets never name a
colour.

## Interaction

Three kinds, all keyboard-operable, chosen per control by what is humane on a
phone.

1. **Drag handles** — `role="slider"`, arrow keys / Home / End, transparent
   ≥44px hit target. Used for continuous or wide-range values: a bar divider,
   a number-line marker, the percentage grid fill.
2. **Stepper rows** — a `−` / `+` pair with a label, for small discrete values
   where dragging would be fiddly (numerator, denominator, share counts).
   Declared by `stepper: true` on a control.
3. **Buttons** — real `<button>` elements, never disguised sliders, for
   discrete choice: `methods` (operation tabs) and `steps` ("Next step").

Handles never overlap in any reachable state. Values magnetise to whole parts.

## Presets

| Preset | Learner controls | GCSE coverage |
|---|---|---|
| `fractionBar` | numerator, denominator | what a fraction is; bar, circle and glyph shown as one quantity |
| `equivalentFractions` | multiplier | equivalence, simplifying, comparing via a common denominator |
| `fractionOperations` | two fractions, amount; `methods` × `steps` | add, subtract, multiply (area model), divide (reciprocal), fraction of an amount |
| `ratioShare` | share a, share b, total | ratio as shares, ratio simplification |
| `doubleNumberLine` | position | direct proportion, unit rate |
| `percentageGrid` | percent | percentages, fraction–decimal–percentage conversion |
| `proportionScale` | scale factor | scaling both sides together |
| `bestValue` | `methods` (per-unit basis) | best value comparison |

### fractionOperations

The only preset with an internal step sequence, because for add and subtract
the steps *are* the maths — each step is a different state of the same whole,
and seeing the mismatch before the fix is what teaches why a common denominator
is needed.

- `add` / `subtract` — four steps: see the mismatch (two bars, visibly different
  part sizes) → find the common denominator (both re-divided to the LCD, same
  whole, same shaded length) → add or subtract the numerators (one result bar)
  → check and simplify.
- `multiply` — 2D area model: `denominatorA` columns × `denominatorB` rows, the
  overlap hatched, `numeratorA × numeratorB` out of `denominatorA × denominatorB`.
- `divide` — reciprocal strip: how many `b`-sized pieces fit into `a`, with
  brackets counting the fit.
- `ofAmount` — discrete counters, `numerator/denominator` of the set filled,
  with the divide-then-multiply calculation.

## Accessibility

- SVG `role="group"` with `<title>` and `<desc>`; `desc` states the key fact and
  whether the diagram is interactive.
- Every handle is a `role="slider"` with `aria-valuemin` / `max` / `now` /
  `valuetext` and `aria-describedby` pointing at the live status region.
- Steppers and method/step buttons are real buttons with `aria-pressed` where
  they express state.
- Status region is `aria-live="polite"` when interactive.
- `prefers-reduced-motion` respected, with a `reducedMotion` prop override.

## Non-goals

- No marking, scoring, hints or weakness logging inside the component.
- No new colour, spacing, radius, motion or type values — tokens only.
- No module content authored in this build. Wiring presets into lesson screens
  is separate Lane C work.
- No changes to any locked component.

## Verification

- `vite build` passes.
- `vitest run tests/architecture` passes.
- `vitest run tests/unit` — the pure maths and geometry modules are unit-tested
  (`test-driven-development` applies here: these are pure logic units).
- `FractionRatioExplore.stories.jsx` covers every preset for the Playwright
  browser suite.
- Render pass at 390px against the Maths gold example.
- Component Registry entry added.
