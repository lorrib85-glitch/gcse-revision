# NumberLineExplore — design

**Date:** 2026-07-24
**Lane:** E (Big Build — new reusable component family)
**Status:** approved

## Problem

Number topics across AQA Foundation Maths — place value, negative numbers,
ordering, rounding, inequalities and bounds — each want the same visual: a
number line with values on it. Building a small component per topic would give
us six near-identical diagrams that drift apart visually and behaviourally.

`NumberLineExplore` is the single visual foundation for all of them: one
configuration-driven number line, one interaction model, one status voice,
selected by preset.

## User story

As a GCSE student, I want to see numbers, movement, intervals and bounds on one
consistent number line I can move, so that position, direction and size become
something I can picture in the exam rather than rules I have to recall.

## Scope

The component owns **the diagram and its status line only** — matching
`AngleExplore` and `AreaPerimeterExplore`. Questions, predictions, marking,
scoring, hints and weakness tracking belong to the page that composes it.

Out of scope, to be composed at page level later: the tab bar, quick-example
lists, challenge questions and correct/incorrect feedback cards shown in the
reference visuals.

## Architecture

Four files, mirroring the `areaPerimeter/` family layout:

| File | Responsibility |
|---|---|
| `src/components/learning/numberLine/numberLineGeometry.js` | Pure model-space maths: value↔x mapping, tick generation, snapping, number formatting (decimals + unicode fractions), rounding and bounds calculation |
| `src/components/learning/numberLine/numberLineVisualRoles.js` | Semantic colour roles resolved from the subject theme |
| `src/components/learning/numberLine/numberLinePresets.js` | The seven presets — each a scene definition plus its controls |
| `src/components/learning/NumberLineExplore.jsx` | Renders the scene, owns drag/keyboard interaction and the status area |

Values are model-space numbers throughout. Pixels are derived at render time
and never measured back into values, except through the single
`valueFromPointer` projection each control declares.

### Scene model

A preset's `derive(values, context)` returns:

```
{
  axis:    { min, max, majorStep, minorStep, format },
  bands:   [{ id, from, to, role, dashed? }],
  jumps:   [{ id, from, to, label, role }],
  markers: [{ id, value, role, style: 'filled' | 'open', controlId? }],
  chips:   [{ id, value, text, role, tier? }],
  notes:   [{ id, value, text, role, below? }],
  status:  { heading, headingRole, explanation }
}
```

`axis` drives tick generation inside the geometry module — presets never build
ticks by hand. `markers` use `filled` for included endpoints (≤, ≥) and `open`
for excluded ones (<, >), which is the GCSE convention and the key shown in the
reference visuals.

### Controls

Each preset declares `controls: [{ id, label, min, max, step, snap?,
valueFromPointer, valueText }]` and `initialValues`. The component's value is
an object keyed by control id, even for single-control presets, so every preset
shares one API.

Discrete choices (open/closed endpoint, inequality direction, rounding
precision) are declared as `options` and render as real buttons — never as a
disguised slider.

## Presets

1. **`orderNumbers`** — axis −5…5. Fixed reference values pinned with chips
   (`−1.5`, `0`, `½`, `0.75`, `2`); one draggable value slots between them. The
   status line is the live ordering statement, re-sorting as the value moves.
   Covers place value, negatives, decimals, fractions and scale reading.
2. **`negativeMovement`** — axis −10…10, two controls (`start`, `move`).
   A curved dashed arc with an arrowhead shows the jump. Status:
   `3 + (−5) = −2` / "Start at 3, move 5 steps left."
3. **`roundingIntervals`** — the two neighbouring multiples with the midpoint
   marked; option buttons for nearest 10 / 1 / 0.1. Status: `2.3 rounds to 2`.
4. **`inequalityRange`** — endpoint control plus open/closed and direction
   toggles. Shaded band running to an infinity arrow. Status: `x ≥ −1` with
   interval notation `[−1, ∞)`.
5. **`boundsInterval`** — a rounded value plus precision option. Half-open
   band. Status: `2.25 ≤ x < 2.35`.
6. **`multiplyPattern`** — repeated equal jumps from zero; control is the
   number of jumps. Status: `−3 × 4 = −12` / "Four jumps of −3, left of zero."
7. **`estimateRange`** — exact value fixed, learner drags an estimate; a
   tolerance band shows what counts as a reasonable estimate. Status describes
   the gap. Description only — no marking, no scoring.

## Interaction

- Draggable markers are keyboard-operable `role="slider"` elements (arrow keys,
  Home, End) with ≥44px transparent hit targets.
- The first handle breathes gently until the learner's first interaction, then
  stays still.
- `interactive={false}` turns any preset into a static teaching or exam diagram
  at fixed values.
- `prefers-reduced-motion` (and a `reducedMotion` prop override) is respected:
  the jump arc's ~700ms draw-in becomes an instant finished arc, and colour
  transitions are disabled.

## Props

`preset`, `value` (controlled object), `defaultValue`, `onChange`,
`interactive`, `disabled`, `subject` (defaults to `Maths`), `reducedMotion`,
`label`, `showStatus`.

## Verification

- `NumberLineExplore.stories.jsx` with a play test per preset, plus static,
  reduced-motion and 320px-containment stories
- `vite build` passes
- `vitest run tests/architecture` passes
- Full Playwright `vitest` passes
- 390px render pass against the gold register
