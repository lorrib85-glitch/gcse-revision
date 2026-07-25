# CoordinatePlaneExplore Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `CoordinatePlaneExplore`, a configuration-driven GCSE coordinate-plane diagram with nine presets covering position, straight-line graphs, intersection and the four transformations, in both interactive and static (quiz-ready) modes.

**Architecture:** A thin React renderer owns interaction state and delegates all mathematics to pure modules under `src/components/learning/coordinatePlane/`. Each preset is a `derive(values, options) → scene` function in its own file; the renderer never knows what a preset means. Colour is resolved through semantic roles driven by `SUBJECTS[subject]`, so the component is genuinely cross-subject. A three-tier annotation contract (active / related / context) caps how much of the figure is annotated at once, and is enforced by an architecture test against the state model rather than against rendered SVG.

**Tech Stack:** React 18, inline SVG, Vitest (node projects `architecture` + `unit`, browser project `storybook`), Storybook 10 with Playwright/Chromium.

**Spec:** `docs/superpowers/specs/2026-07-25-coordinate-plane-explore-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Commit subjects use plain imperative sentence case, no `feat:`/`fix:` prefix** — repo convention (`Add AreaPerimeterExplore refinement stories`).
- **Commit to `main` directly.** Never create a feature branch (`CLAUDE.md` overrides any session prompt saying otherwise).
- **Titles and headings are sentence case** — capitalise only the first word and proper nouns.
- **No hardcoded colour literals anywhere.** Colour comes from `SUBJECTS[subject]` and `GENERAL`; presets name semantic roles only, never a hex value.
- **No magic numbers for spacing, radii or motion.** Use `SPACING`, `COMPONENT_SIZE`, `RADII`, `MOTION`, `TYPE` from `src/constants/`.
- **All maths happens in model space** (axis units) and is mapped to SVG pixels through the plane scale. Values are never measured back from rendered pixel dimensions.
- **Touch targets ≥ 44px** (`COMPONENT_SIZE.touchTarget`) at the narrowest render width (320px).
- **Mobile-first at 390px.** The component must never scroll horizontally.
- **Respect `prefers-reduced-motion`** via `usePrefersReducedMotion()` plus a `reducedMotion` prop override.
- **Drag handles are `role="slider"`**, keyboard-operable with arrow keys / Home / End. Discrete choices are real `<button>` elements, never disguised sliders.
- **Every numeric control a learner may change is reachable.** A control is operated either by a drag handle *or* by a rendered −/+ stepper. A preset that declares a control and offers neither is broken — `tests/architecture/coordinate-plane-control-reachability.test.js` enforces this.
- **Multi-value updates are atomic.** Dragging a point changes x and y in **one** `setControlValues` call — one clamp, one state update, one `onChange`, one announcement. Never two sequential single-control updates: both would close over the same render-time values and the second would discard the first.
- **The whole teaching figure stays inside the axis ranges at every reachable control value.** Enforced by `tests/architecture/coordinate-plane-visible-bounds.test.js`. Lines are clipped in model space against the axis rectangle; an SVG clip path is the rendering safety net, not the primary mechanism. Do not rescale axes dynamically while dragging.
- **Every annotated element declares a `tier`** of `'active' | 'related' | 'context'`. Annotation without a tier is a contract violation.
- **Label obstacles are reported, not tuned around.** The renderer computes boxes for visible tick labels and axis titles and passes them to `layoutPointLabels`. Adjusting `CHAR_WIDTH` or `ANCHOR_RADIUS` is visual tuning, never a substitute for the obstacle contract.
- **Do not add a `series` primitive** to the scene contract in this build (spec §4).
- **Do not add `originPlacement`** or any single combined origin concept; axis placement is resolved per axis (spec §4).

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `src/components/learning/coordinatePlane/coordinatePlaneVisualRoles.js` | Semantic colour roles from a subject theme |
| `src/components/learning/coordinatePlane/coordinatePlaneRoleResolver.js` | Unknown-role dev warning, fail-safe resolution |
| `src/components/learning/coordinatePlane/coordinatePlaneGeometry.js` | Per-axis placement, model↔pixel scales, tick values, ordered-point paths |
| `src/components/learning/coordinatePlane/coordinatePlaneMath.js` | Quadrant, midpoint, line evaluation, intercepts, intersection, four transformations |
| `src/components/learning/coordinatePlane/pointLabelLayout.js` | Shared label placement with degradation |
| `src/components/learning/coordinatePlane/presets/index.js` | Preset registry, resolution, value clamping, capability + axis merging |
| `src/components/learning/coordinatePlane/presets/plotPoint.js` | Position preset with `plot`/`read`/`quadrants` focus |
| `src/components/learning/coordinatePlane/presets/midpoint.js` | Midpoint with separate x- and y-pairing |
| `src/components/learning/coordinatePlane/presets/straightLine.js` | `y = mx + c`, gradient/intercept/compare |
| `src/components/learning/coordinatePlane/presets/tableOfValues.js` | Accumulating points, dashed → solid sequence |
| `src/components/learning/coordinatePlane/presets/intersection.js` | Two lines, solution satisfying both |
| `src/components/learning/coordinatePlane/presets/transformations.js` | Shared factory + translate/reflect/rotate/enlarge |
| `src/components/learning/CoordinatePlaneExplore.jsx` | Renderer, interaction, status area |
| `src/components/learning/CoordinatePlaneExplore.stories.jsx` | Storybook browser tests, all nine presets |
| `tests/unit/coordinatePlaneGeometry.test.js` | Geometry unit tests |
| `tests/unit/coordinatePlaneMath.test.js` | Maths unit tests |
| `tests/unit/pointLabelLayout.test.js` | Label layout unit tests |
| `tests/unit/coordinatePlanePresets.test.js` | Preset `derive()` unit tests |
| `tests/architecture/coordinate-plane-annotation-contract.test.js` | Annotation state-model contract (spec §2, §11) |
| `tests/architecture/coordinate-plane-control-reachability.test.js` | Every declared control is operable by a handle or a stepper |
| `tests/architecture/coordinate-plane-visible-bounds.test.js` | Every reachable state keeps the whole figure inside the axes |

**Modified:**

| File | Change |
|---|---|
| `docs/components/COMPONENT_REGISTRY.md` | New component entry |
| `CLAUDE.md` | Entry in the `src/components/learning/` list |
| `src/dev/componentReview/reviewManifestCore.jsx` | Review manifest entry with per-preset variants |

**Dependency order:** Tasks 1–4 are independent pure modules and may run in parallel. Task 5 depends on 1–4. Task 6 (renderer) depends on 5 — after it the component works end to end, and it is a hard gate: four presets are inoperable until it renders steppers, and every drag preset is wrong until its updates are atomic. Tasks 7–11 each depend on 5 and 6, and are independent of one another except that each edits `presets/index.js`, so they must not run concurrently. Tasks 12 and 13 depend on all nine presets. Task 14 depends on 13. Task 15 depends on 14.

---

## Task 1: Visual roles and role resolver

**Files:**
- Create: `src/components/learning/coordinatePlane/coordinatePlaneVisualRoles.js`
- Create: `src/components/learning/coordinatePlane/coordinatePlaneRoleResolver.js`
- Test: `tests/unit/coordinatePlaneVisualRoles.test.js`

**Interfaces:**
- Consumes: `SUBJECTS` from `src/constants/subjects.js`, `GENERAL` from `src/constants/generalTheme.js`
- Produces:
  - `createCoordinatePlaneVisualRoles(subjectTheme) → frozen object` keyed by role name
  - `resolveCoordinatePlaneVisualRole(roles, role, { isDevelopment, warn }) → string | undefined`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/coordinatePlaneVisualRoles.test.js`:

```js
import { describe, expect, it, vi } from 'vitest'
import { SUBJECTS } from '../../src/constants/subjects.js'
import { GENERAL } from '../../src/constants/generalTheme.js'
import { createCoordinatePlaneVisualRoles } from '../../src/components/learning/coordinatePlane/coordinatePlaneVisualRoles.js'
import { resolveCoordinatePlaneVisualRole } from '../../src/components/learning/coordinatePlane/coordinatePlaneRoleResolver.js'

describe('CoordinatePlaneExplore visual roles', () => {
  it('drives object and image tones from the subject theme', () => {
    const maths = createCoordinatePlaneVisualRoles(SUBJECTS.Maths)
    const physics = createCoordinatePlaneVisualRoles(SUBJECTS.Physics)

    expect(maths.object).toBe(SUBJECTS.Maths.accent)
    expect(maths.image).toBe(SUBJECTS.Maths.accentSecondary)
    expect(physics.object).toBe(SUBJECTS.Physics.accent)
    expect(physics.object).not.toBe(maths.object)
  })

  it('takes structural drawing tones from GENERAL, not the subject', () => {
    const maths = createCoordinatePlaneVisualRoles(SUBJECTS.Maths)
    const physics = createCoordinatePlaneVisualRoles(SUBJECTS.Physics)

    expect(maths.axis).toBe(GENERAL.diagram.edgePrimary)
    expect(maths.guideLine).toBe(GENERAL.diagram.construction)
    expect(maths.ruleLine).toBe(GENERAL.diagram.construction)
    expect(physics.axis).toBe(maths.axis)
  })

  it('defaults to the Maths theme and freezes the result', () => {
    const roles = createCoordinatePlaneVisualRoles()

    expect(roles.object).toBe(SUBJECTS.Maths.accent)
    expect(Object.isFrozen(roles)).toBe(true)
  })

  it('contains no raw hex literals beyond those sourced from tokens', () => {
    const roles = createCoordinatePlaneVisualRoles(SUBJECTS.Maths)
    const tokenValues = new Set([
      ...Object.values(SUBJECTS.Maths),
      ...Object.values(GENERAL.diagram),
      ...Object.values(GENERAL.cinematic),
    ])

    for (const value of Object.values(roles)) {
      const isToken = tokenValues.has(value)
      const isDerivedAlpha = typeof value === 'string' && value.startsWith('rgba(')
      expect(isToken || isDerivedAlpha).toBe(true)
    }
  })
})

describe('CoordinatePlaneExplore role resolver', () => {
  it('resolves a known role', () => {
    expect(resolveCoordinatePlaneVisualRole({ object: '#fff' }, 'object')).toBe('#fff')
  })

  it('returns undefined for a missing role without warning in production', () => {
    const warn = vi.fn()
    expect(resolveCoordinatePlaneVisualRole({}, 'object', { warn })).toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
  })

  it('fails safely and warns in development for an unknown role', () => {
    const warn = vi.fn()
    const result = resolveCoordinatePlaneVisualRole(
      { object: '#fff' },
      '#ff00ff',
      { isDevelopment: true, warn },
    )

    expect(result).toBeUndefined()
    expect(warn).toHaveBeenCalledOnce()
    expect(warn).toHaveBeenCalledWith(
      'CoordinatePlaneExplore received an unknown visual role: #ff00ff',
    )
  })

  it('returns undefined for a null role', () => {
    expect(resolveCoordinatePlaneVisualRole({ object: '#fff' }, null)).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlaneVisualRoles.test.js`

Expected: FAIL — `Failed to resolve import ".../coordinatePlaneVisualRoles.js"`

- [ ] **Step 3: Write the visual roles module**

Create `src/components/learning/coordinatePlane/coordinatePlaneVisualRoles.js`:

```js
import { SUBJECTS } from '../../../constants/subjects.js'
import { GENERAL } from '../../../constants/generalTheme.js'

function hexToRgba(hex, alpha) {
  const value = String(hex).replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return hex

  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)
  return `rgba(${red},${green},${blue},${alpha})`
}

/**
 * Semantic colour roles for the CoordinatePlaneExplore family.
 *
 * Keys describe coordinate meaning rather than a palette slot:
 * - axis / gridLine: the plane itself — structure, never subject identity
 * - object / objectFill: the original point, line or shape
 * - image / imageFill: the transformed copy, or a second compared line
 * - ruleLine: the rule made visible — mirror line, centre marker, reference
 * - guideLine: dashed drop lines from an active point to both axes
 * - solution: the highlighted intersection point
 * - interaction: learner-operated handles
 *
 * Structural lines resolve through GENERAL.diagram rather than borrowing text
 * colours, so subject identity stays limited to objects, images, solutions and
 * interaction states. That separation is what makes subject="Physics" produce
 * a usable graph rather than a recoloured Maths diagram.
 */
export function createCoordinatePlaneVisualRoles(subjectTheme = SUBJECTS.Maths) {
  return Object.freeze({
    axis: GENERAL.diagram.edgePrimary,
    gridLine: hexToRgba(subjectTheme.accent, 0.1),
    tickLabel: GENERAL.cinematic.textSecondary,
    axisLabel: GENERAL.cinematic.textSecondary,
    axisTitle: GENERAL.cinematic.textSecondary,

    object: subjectTheme.accent,
    objectFill: hexToRgba(subjectTheme.accent, 0.14),
    image: subjectTheme.accentSecondary,
    imageFill: hexToRgba(subjectTheme.accentSecondary, 0.16),

    ruleLine: GENERAL.diagram.construction,
    guideLine: GENERAL.diagram.construction,
    dimensionLine: GENERAL.diagram.dimension,

    solution: subjectTheme.accent,
    interaction: subjectTheme.accent,
    focusGlow: subjectTheme.glow,

    textPrimary: GENERAL.cinematic.textPrimary,
    textSecondary: GENERAL.cinematic.textSecondary,
    textMuted: GENERAL.cinematic.textMuted,
  })
}
```

- [ ] **Step 4: Write the role resolver**

Create `src/components/learning/coordinatePlane/coordinatePlaneRoleResolver.js`:

```js
export function resolveCoordinatePlaneVisualRole(
  roles,
  role,
  {
    isDevelopment = false,
    warn = console.warn,
  } = {},
) {
  if (!role) return undefined
  if (Object.prototype.hasOwnProperty.call(roles, role)) return roles[role]

  if (isDevelopment) {
    warn(`CoordinatePlaneExplore received an unknown visual role: ${role}`)
  }
  return undefined
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlaneVisualRoles.test.js`

Expected: PASS — 8 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/learning/coordinatePlane/coordinatePlaneVisualRoles.js \
        src/components/learning/coordinatePlane/coordinatePlaneRoleResolver.js \
        tests/unit/coordinatePlaneVisualRoles.test.js
git commit -m "Add CoordinatePlaneExplore visual roles and role resolver"
```

---

## Task 2: Plane geometry and per-axis placement

**Files:**
- Create: `src/components/learning/coordinatePlane/coordinatePlaneGeometry.js`
- Test: `tests/unit/coordinatePlaneGeometry.test.js`

**Interfaces:**
- Consumes: `clamp`, `roundTo` from `src/components/learning/geometry/shapeGeometry.js`
- Produces:
  - `resolveAxisPlacement({ min, max }) → 'crossing' | 'edge'`
  - `axisAnchorValue({ min, max }) → number` — the model value on this axis where the perpendicular axis is drawn
  - `createPlaneScale({ xAxis, yAxis, canvas, padding }) → { toX, toY, toModelX, toModelY, plot }`
  - `axisTickValues({ min, max, step }) → number[]`
  - `gridLineValues(axis, subdivisions) → number[]` — gridlines may be finer than labelled ticks
  - `orderedPointsPath(points, toX, toY) → string`
  - `snapToStep(value, step) → number`
  - `clipSegmentToBounds({ from, to }, xAxis, yAxis) → { from, to } | null` — Liang–Barsky clip in model space

This task carries spec §4 (per-axis placement). The critical behaviour is that a
positive-only x range and a signed y range produce `x = 0` at the **left edge**
while `y = 0` **crosses** the plot — a single combined origin concept cannot
express that.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/coordinatePlaneGeometry.test.js`:

```js
import { describe, expect, it } from 'vitest'
import {
  axisAnchorValue,
  axisTickValues,
  clipSegmentToBounds,
  createPlaneScale,
  gridLineValues,
  orderedPointsPath,
  resolveAxisPlacement,
  snapToStep,
} from '../../src/components/learning/coordinatePlane/coordinatePlaneGeometry.js'

describe('per-axis placement', () => {
  it('crosses at zero when zero falls inside the range', () => {
    expect(resolveAxisPlacement({ min: -5, max: 5 })).toBe('crossing')
    expect(axisAnchorValue({ min: -5, max: 5 })).toBe(0)
  })

  it('sits at the low edge when the range starts at zero', () => {
    expect(resolveAxisPlacement({ min: 0, max: 20 })).toBe('edge')
    expect(axisAnchorValue({ min: 0, max: 20 })).toBe(0)
  })

  it('sits at the low edge when the range starts above zero', () => {
    expect(resolveAxisPlacement({ min: 5, max: 20 })).toBe('edge')
    expect(axisAnchorValue({ min: 5, max: 20 })).toBe(5)
  })

  it('sits at the high edge when the range is entirely negative', () => {
    expect(resolveAxisPlacement({ min: -20, max: -5 })).toBe('edge')
    expect(axisAnchorValue({ min: -20, max: -5 })).toBe(-5)
  })

  // The mixed case the spec exists to permit.
  it('resolves each axis independently for positive x against signed y', () => {
    const xAxis = { min: 0, max: 20 }
    const yAxis = { min: -50, max: 100 }

    expect(resolveAxisPlacement(xAxis)).toBe('edge')
    expect(resolveAxisPlacement(yAxis)).toBe('crossing')
  })
})

describe('plane scale', () => {
  const canvas = { width: 360, height: 300 }
  const padding = { top: 20, right: 20, bottom: 40, left: 40 }

  it('maps model values to pixels with independent x and y scales', () => {
    const scale = createPlaneScale({
      xAxis: { min: 0, max: 20, step: 2 },
      yAxis: { min: 0, max: 100, step: 10 },
      canvas,
      padding,
    })

    expect(scale.toX(0)).toBe(40)
    expect(scale.toX(20)).toBe(340)
    expect(scale.toX(10)).toBe(190)

    // y is inverted: the maximum sits at the top of the plot.
    expect(scale.toY(0)).toBe(260)
    expect(scale.toY(100)).toBe(20)
    expect(scale.toY(50)).toBe(140)
  })

  it('round-trips pointer pixels back to model values', () => {
    const scale = createPlaneScale({
      xAxis: { min: -5, max: 5, step: 1 },
      yAxis: { min: -5, max: 5, step: 1 },
      canvas,
      padding,
    })

    expect(scale.toModelX(scale.toX(3))).toBeCloseTo(3)
    expect(scale.toModelY(scale.toY(-2))).toBeCloseTo(-2)
  })

  it('exposes the plot rectangle', () => {
    const scale = createPlaneScale({
      xAxis: { min: 0, max: 10, step: 1 },
      yAxis: { min: 0, max: 10, step: 1 },
      canvas,
      padding,
    })

    expect(scale.plot).toEqual({ x: 40, y: 20, width: 300, height: 240 })
  })
})

describe('axis ticks', () => {
  it('produces inclusive tick values on the step', () => {
    expect(axisTickValues({ min: -3, max: 3, step: 1 }))
      .toEqual([-3, -2, -1, 0, 1, 2, 3])
  })

  it('honours a non-unit step', () => {
    expect(axisTickValues({ min: 0, max: 20, step: 5 }))
      .toEqual([0, 5, 10, 15, 20])
  })

  it('avoids floating point drift on fractional steps', () => {
    expect(axisTickValues({ min: 0, max: 1, step: 0.2 }))
      .toEqual([0, 0.2, 0.4, 0.6000000000000001, 0.8, 1].map(v => Math.round(v * 1e6) / 1e6))
  })
})

describe('ordered point paths', () => {
  it('builds a path through points in order', () => {
    const identity = value => value
    expect(orderedPointsPath(
      [{ x: 0, y: 0 }, { x: 10, y: 20 }, { x: 30, y: 5 }],
      identity,
      identity,
    )).toBe('M 0 0 L 10 20 L 30 5')
  })

  it('returns an empty string for fewer than two points', () => {
    const identity = value => value
    expect(orderedPointsPath([{ x: 1, y: 1 }], identity, identity)).toBe('')
    expect(orderedPointsPath([], identity, identity)).toBe('')
  })
})

describe('snapping', () => {
  it('snaps to the nearest step', () => {
    expect(snapToStep(2.4, 1)).toBe(2)
    expect(snapToStep(2.6, 1)).toBe(3)
    expect(snapToStep(2.4, 0.5)).toBe(2.5)
  })
})

describe('grid line values', () => {
  it('matches the tick values when there are no subdivisions', () => {
    expect(gridLineValues({ min: -2, max: 2, step: 1 }, 1)).toEqual([-2, -1, 0, 1, 2])
  })

  it('subdivides between labelled ticks', () => {
    expect(gridLineValues({ min: 0, max: 4, step: 2 }, 2))
      .toEqual([0, 1, 2, 3, 4])
  })
})

// Issue 4: y = 2x + 1 across x = −5…5 reaches y = ±11 on a y-axis of ±5.
// Without model-space clipping the line is drawn far outside the plot.
describe('segment clipping', () => {
  const xAxis = { min: -5, max: 5 }
  const yAxis = { min: -5, max: 5 }

  it('leaves a fully contained segment untouched', () => {
    const clipped = clipSegmentToBounds(
      { from: { x: -2, y: -1 }, to: { x: 2, y: 3 } },
      xAxis,
      yAxis,
    )

    expect(clipped.from).toEqual({ x: -2, y: -1 })
    expect(clipped.to).toEqual({ x: 2, y: 3 })
  })

  it('clips a steep line at both y bounds', () => {
    const clipped = clipSegmentToBounds(
      { from: { x: -5, y: -9 }, to: { x: 5, y: 11 } },
      xAxis,
      yAxis,
    )

    expect(clipped.from).toEqual({ x: -3, y: -5 })
    expect(clipped.to).toEqual({ x: 2, y: 5 })
  })

  it('clips a horizontal line at the x bounds only', () => {
    const clipped = clipSegmentToBounds(
      { from: { x: -20, y: 2 }, to: { x: 20, y: 2 } },
      xAxis,
      yAxis,
    )

    expect(clipped.from).toEqual({ x: -5, y: 2 })
    expect(clipped.to).toEqual({ x: 5, y: 2 })
  })

  it('returns null for a segment entirely outside the plot', () => {
    expect(clipSegmentToBounds(
      { from: { x: -5, y: 20 }, to: { x: 5, y: 30 } },
      xAxis,
      yAxis,
    )).toBeNull()
  })

  it('handles an asymmetric plot', () => {
    const clipped = clipSegmentToBounds(
      { from: { x: 0, y: 0 }, to: { x: 20, y: 200 } },
      { min: 0, max: 20 },
      { min: 0, max: 100 },
    )

    expect(clipped.to).toEqual({ x: 10, y: 100 })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlaneGeometry.test.js`

Expected: FAIL — module not found.

- [ ] **Step 3: Write the geometry module**

Create `src/components/learning/coordinatePlane/coordinatePlaneGeometry.js`:

```js
// ─── CoordinatePlaneExplore geometry ─────────────────────────────────────────
//
// Model space is always in axis units. Pixels are derived from model values
// through the plane scale and never measured back the other way, so a figure
// means the same thing at 320px and at 420px.
//
// Axis placement is resolved PER AXIS. A single combined "origin placement"
// concept models the problem incorrectly: positive-only x values alongside
// signed y values is an ordinary graph, and there x = 0 sits at the left edge
// while y = 0 crosses through the plot.

import { roundTo } from '../geometry/shapeGeometry.js'

// Guards floating point drift when stepping a fractional axis.
const TICK_PRECISION = 6

/**
 * Where this axis sits relative to its own range.
 * - 'crossing': zero falls strictly inside the range
 * - 'edge': the range starts at zero, starts above it, or is entirely negative
 */
export function resolveAxisPlacement({ min, max }) {
  return min < 0 && max > 0 ? 'crossing' : 'edge'
}

/**
 * The model value on this axis at which the perpendicular axis is drawn.
 * Zero when the axis crosses; otherwise the end of the range nearest zero.
 */
export function axisAnchorValue({ min, max }) {
  if (min < 0 && max > 0) return 0
  if (min >= 0) return min
  return max
}

export function createPlaneScale({ xAxis, yAxis, canvas, padding }) {
  const plot = {
    x: padding.left,
    y: padding.top,
    width: canvas.width - padding.left - padding.right,
    height: canvas.height - padding.top - padding.bottom,
  }

  const xSpan = xAxis.max - xAxis.min
  const ySpan = yAxis.max - yAxis.min

  // Independent scales — a 20 s axis against a 100 m axis maps correctly.
  const toX = value => plot.x + ((value - xAxis.min) / xSpan) * plot.width
  const toY = value => plot.y + plot.height - ((value - yAxis.min) / ySpan) * plot.height

  const toModelX = px => xAxis.min + ((px - plot.x) / plot.width) * xSpan
  const toModelY = px => yAxis.min + ((plot.y + plot.height - px) / plot.height) * ySpan

  return { toX, toY, toModelX, toModelY, plot }
}

export function axisTickValues({ min, max, step }) {
  const values = []
  const count = Math.round((max - min) / step)

  for (let index = 0; index <= count; index += 1) {
    values.push(roundTo(min + index * step, TICK_PRECISION))
  }
  return values
}

/**
 * A path through an ordered list of already-projected points.
 *
 * Deliberately general rather than assuming two endpoints: a curve or an
 * additional series can reuse this without restructuring the renderer, which
 * is why the spec defers the `series` contract slot rather than inventing one.
 */
export function orderedPointsPath(points, toX, toY) {
  if (!points || points.length < 2) return ''

  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(point.x)} ${toY(point.y)}`)
    .join(' ')
}

export function snapToStep(value, step) {
  if (!step) return value
  return roundTo(Math.round(value / step) * step, TICK_PRECISION)
}

/**
 * Gridlines, which may be finer than the labelled ticks. A transformation
 * preset wants unit gridlines so coordinates sit on intersections, but labels
 * only every 2 so a wide axis stays legible at 390px.
 */
export function gridLineValues(axis, subdivisions = 1) {
  const divisions = Math.max(1, subdivisions)
  return axisTickValues({ ...axis, step: axis.step / divisions })
}

/**
 * Liang–Barsky clip of a segment against the axis rectangle, in model space.
 *
 * A line built from the x-axis endpoints routinely leaves the y-range: y = 2x + 1
 * across x = −5…5 reaches y = ±11 against a y-axis of ±5. Clipping here — rather
 * than relying on the SVG clip path — keeps the model and the picture agreeing,
 * so anything measured from the scene is what the learner actually sees.
 *
 * Returns null when the segment misses the rectangle entirely.
 */
export function clipSegmentToBounds({ from, to }, xAxis, yAxis) {
  const dx = to.x - from.x
  const dy = to.y - from.y

  let tMin = 0
  let tMax = 1

  const edges = [
    { p: -dx, q: from.x - xAxis.min },
    { p: dx, q: xAxis.max - from.x },
    { p: -dy, q: from.y - yAxis.min },
    { p: dy, q: yAxis.max - from.y },
  ]

  for (const { p, q } of edges) {
    if (p === 0) {
      // Parallel to this edge — outside it means the whole segment is out.
      if (q < 0) return null
      continue
    }
    const t = q / p
    if (p < 0) {
      if (t > tMax) return null
      if (t > tMin) tMin = t
    } else {
      if (t < tMin) return null
      if (t < tMax) tMax = t
    }
  }

  const at = t => ({
    x: roundTo(from.x + t * dx, TICK_PRECISION),
    y: roundTo(from.y + t * dy, TICK_PRECISION),
  })

  return { from: at(tMin), to: at(tMax) }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlaneGeometry.test.js`

Expected: PASS — 22 tests.

If the fractional-step assertion fails, the expected array in the test is
already normalised through the same rounding the module uses; confirm
`TICK_PRECISION` is 6 and that `roundTo` is imported from `shapeGeometry.js`
rather than reimplemented.

- [ ] **Step 5: Commit**

```bash
git add src/components/learning/coordinatePlane/coordinatePlaneGeometry.js \
        tests/unit/coordinatePlaneGeometry.test.js
git commit -m "Add CoordinatePlaneExplore geometry with per-axis placement"
```

---

## Task 3: Coordinate mathematics

**Files:**
- Create: `src/components/learning/coordinatePlane/coordinatePlaneMath.js`
- Test: `tests/unit/coordinatePlaneMath.test.js`

**Interfaces:**
- Consumes: `roundTo` from `src/components/learning/geometry/shapeGeometry.js`
- Produces:
  - `quadrantOf(x, y) → 1 | 2 | 3 | 4 | null`
  - `quadrantRoman(quadrant) → 'I' | 'II' | 'III' | 'IV' | null`
  - `quadrantSigns(quadrant) → '(+, +)' | … | null`
  - `midpointOf(a, b) → { x, y }`
  - `lineY({ m, c }, x) → number`
  - `xInterceptOf({ m, c }) → number | null`
  - `intersectionOf(lineA, lineB) → { kind: 'one', point } | { kind: 'none' } | { kind: 'infinite' }` — equal gradients are **not** automatically "no solution": equal gradient *and* equal intercept means coincident lines with infinitely many solutions
  - `perpendicularGradientOf(m) → number | null` — `null` for `m = 0`, whose perpendicular is vertical and cannot be written as `y = mx + c`
  - `translatePoint(point, { dx, dy }) → { x, y }`
  - `reflectPoint(point, mirror) → { x, y }` where mirror is `{ type: 'vertical' | 'horizontal' | 'yEqualsX' | 'yEqualsNegativeX', value? }`
  - `rotatePoint(point, centre, degrees, direction) → { x, y }` with `direction` of `'clockwise' | 'anticlockwise'`
  - `enlargePoint(point, centre, scaleFactor) → { x, y }`
  - `formatCoordinate({ x, y }) → string` using the minus sign `−` (U+2212)

- [ ] **Step 1: Write the failing test**

Create `tests/unit/coordinatePlaneMath.test.js`:

```js
import { describe, expect, it } from 'vitest'
import {
  enlargePoint,
  formatCoordinate,
  intersectionOf,
  lineY,
  midpointOf,
  perpendicularGradientOf,
  quadrantOf,
  quadrantRoman,
  quadrantSigns,
  reflectPoint,
  rotatePoint,
  translatePoint,
  xInterceptOf,
} from '../../src/components/learning/coordinatePlane/coordinatePlaneMath.js'

describe('quadrants', () => {
  it('identifies all four quadrants', () => {
    expect(quadrantOf(3, 2)).toBe(1)
    expect(quadrantOf(-3, 2)).toBe(2)
    expect(quadrantOf(-3, -2)).toBe(3)
    expect(quadrantOf(3, -2)).toBe(4)
  })

  it('returns null on an axis, where no quadrant applies', () => {
    expect(quadrantOf(0, 4)).toBeNull()
    expect(quadrantOf(4, 0)).toBeNull()
    expect(quadrantOf(0, 0)).toBeNull()
  })

  it('names quadrants and their sign pairs', () => {
    expect(quadrantRoman(4)).toBe('IV')
    expect(quadrantSigns(4)).toBe('(+, −)')
    expect(quadrantSigns(2)).toBe('(−, +)')
    expect(quadrantRoman(null)).toBeNull()
  })
})

describe('midpoint', () => {
  it('averages each coordinate independently', () => {
    expect(midpointOf({ x: -3, y: 1 }, { x: 5, y: 7 })).toEqual({ x: 1, y: 4 })
  })

  it('handles a half-value midpoint', () => {
    expect(midpointOf({ x: 0, y: 0 }, { x: 3, y: 5 })).toEqual({ x: 1.5, y: 2.5 })
  })
})

describe('straight lines', () => {
  it('evaluates y for a given x', () => {
    expect(lineY({ m: 2, c: 1 }, 2)).toBe(5)
    expect(lineY({ m: -1, c: 7 }, 2)).toBe(5)
  })

  it('finds the x-intercept', () => {
    expect(xInterceptOf({ m: 2, c: 4 })).toBe(-2)
  })

  it('returns null for a horizontal line, which has no single x-intercept', () => {
    expect(xInterceptOf({ m: 0, c: 4 })).toBeNull()
  })

  it('finds the intersection of two lines', () => {
    expect(intersectionOf({ m: 1, c: 3 }, { m: -1, c: 7 }))
      .toEqual({ kind: 'one', point: { x: 2, y: 5 } })
  })

  it('reports parallel lines as having no solution', () => {
    expect(intersectionOf({ m: 2, c: 1 }, { m: 2, c: 5 })).toEqual({ kind: 'none' })
  })

  // Equal gradient alone is not enough to conclude "no solution".
  it('reports coincident lines as having infinitely many solutions', () => {
    expect(intersectionOf({ m: 2, c: 1 }, { m: 2, c: 1 })).toEqual({ kind: 'infinite' })
  })
})

describe('perpendicular gradients', () => {
  it('returns the negative reciprocal', () => {
    expect(perpendicularGradientOf(2)).toBe(-0.5)
    expect(perpendicularGradientOf(-0.25)).toBe(4)
  })

  // A line perpendicular to a horizontal line is vertical, and a vertical line
  // has no gradient — it cannot be written as y = mx + c at all.
  it('returns null for a horizontal line', () => {
    expect(perpendicularGradientOf(0)).toBeNull()
  })
})

describe('translation', () => {
  it('applies positive, negative and zero components', () => {
    expect(translatePoint({ x: 1, y: 1 }, { dx: 3, dy: 2 })).toEqual({ x: 4, y: 3 })
    expect(translatePoint({ x: 1, y: 1 }, { dx: -3, dy: -2 })).toEqual({ x: -2, y: -1 })
    expect(translatePoint({ x: 1, y: 1 }, { dx: 0, dy: 4 })).toEqual({ x: 1, y: 5 })
    expect(translatePoint({ x: 1, y: 1 }, { dx: 0, dy: 0 })).toEqual({ x: 1, y: 1 })
  })
})

describe('reflection', () => {
  it('reflects in a vertical mirror line x = a', () => {
    expect(reflectPoint({ x: -1, y: 4 }, { type: 'vertical', value: 2 }))
      .toEqual({ x: 5, y: 4 })
  })

  it('reflects in a horizontal mirror line y = b', () => {
    expect(reflectPoint({ x: 3, y: 1 }, { type: 'horizontal', value: -1 }))
      .toEqual({ x: 3, y: -3 })
  })

  it('reflects in y = x by swapping coordinates', () => {
    expect(reflectPoint({ x: 2, y: 5 }, { type: 'yEqualsX' })).toEqual({ x: 5, y: 2 })
  })

  it('reflects in y = −x by swapping and negating', () => {
    expect(reflectPoint({ x: 2, y: 5 }, { type: 'yEqualsNegativeX' })).toEqual({ x: -5, y: -2 })
  })

  it('leaves a point on the mirror line unmoved', () => {
    expect(reflectPoint({ x: 2, y: 9 }, { type: 'vertical', value: 2 }))
      .toEqual({ x: 2, y: 9 })
  })
})

describe('rotation', () => {
  it('rotates 90 degrees clockwise about the origin', () => {
    expect(rotatePoint({ x: 1, y: 3 }, { x: 0, y: 0 }, 90, 'clockwise'))
      .toEqual({ x: 3, y: -1 })
  })

  it('rotates 90 degrees anticlockwise about the origin', () => {
    expect(rotatePoint({ x: 1, y: 3 }, { x: 0, y: 0 }, 90, 'anticlockwise'))
      .toEqual({ x: -3, y: 1 })
  })

  it('rotates 180 degrees identically in either direction', () => {
    const clockwise = rotatePoint({ x: 2, y: 5 }, { x: 0, y: 0 }, 180, 'clockwise')
    const anticlockwise = rotatePoint({ x: 2, y: 5 }, { x: 0, y: 0 }, 180, 'anticlockwise')

    expect(clockwise).toEqual({ x: -2, y: -5 })
    expect(anticlockwise).toEqual(clockwise)
  })

  it('rotates 270 degrees', () => {
    expect(rotatePoint({ x: 1, y: 3 }, { x: 0, y: 0 }, 270, 'clockwise'))
      .toEqual({ x: -3, y: 1 })
  })

  it('rotates about a centre away from the origin', () => {
    expect(rotatePoint({ x: 4, y: 3 }, { x: 2, y: 1 }, 90, 'clockwise'))
      .toEqual({ x: 4, y: -1 })
  })
})

describe('enlargement', () => {
  it('enlarges by a positive integer scale factor', () => {
    expect(enlargePoint({ x: 3, y: 2 }, { x: 1, y: 1 }, 2)).toEqual({ x: 5, y: 3 })
  })

  it('enlarges by a fractional scale factor', () => {
    expect(enlargePoint({ x: 5, y: 3 }, { x: 1, y: 1 }, 0.5)).toEqual({ x: 3, y: 2 })
  })

  it('enlarges by a negative scale factor, landing the other side of the centre', () => {
    expect(enlargePoint({ x: 3, y: 2 }, { x: 1, y: 1 }, -1)).toEqual({ x: -1, y: 0 })
  })
})

describe('coordinate formatting', () => {
  it('uses a true minus sign rather than a hyphen', () => {
    expect(formatCoordinate({ x: 3, y: -2 })).toBe('(3, −2)')
    expect(formatCoordinate({ x: -1, y: 4 })).toBe('(−1, 4)')
  })

  it('formats a half value without trailing zeroes', () => {
    expect(formatCoordinate({ x: 1.5, y: 2 })).toBe('(1.5, 2)')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlaneMath.test.js`

Expected: FAIL — module not found.

- [ ] **Step 3: Write the maths module**

Create `src/components/learning/coordinatePlane/coordinatePlaneMath.js`:

```js
// ─── CoordinatePlaneExplore mathematics ──────────────────────────────────────
//
// Pure functions only. Every transformation returns a new point; nothing here
// knows about SVG, roles or React.

import { roundTo } from '../geometry/shapeGeometry.js'

// Rotations of 90/180/270 produce exact integers from integer inputs, but the
// trigonometric route introduces tiny drift. Round to kill it.
const PRECISION = 6

const MINUS = '−'

function tidy(value) {
  const rounded = roundTo(value, PRECISION)
  // Avoid returning -0, which formats as "−0".
  return rounded === 0 ? 0 : rounded
}

function tidyPoint({ x, y }) {
  return { x: tidy(x), y: tidy(y) }
}

export function quadrantOf(x, y) {
  if (x === 0 || y === 0) return null
  if (x > 0 && y > 0) return 1
  if (x < 0 && y > 0) return 2
  if (x < 0 && y < 0) return 3
  return 4
}

const QUADRANT_ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }
const QUADRANT_SIGNS = {
  1: `(+, +)`,
  2: `(${MINUS}, +)`,
  3: `(${MINUS}, ${MINUS})`,
  4: `(+, ${MINUS})`,
}

export function quadrantRoman(quadrant) {
  return QUADRANT_ROMAN[quadrant] ?? null
}

export function quadrantSigns(quadrant) {
  return QUADRANT_SIGNS[quadrant] ?? null
}

export function midpointOf(a, b) {
  return tidyPoint({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
}

export function lineY({ m, c }, x) {
  return tidy(m * x + c)
}

export function xInterceptOf({ m, c }) {
  if (m === 0) return null
  return tidy(-c / m)
}

/**
 * Three outcomes, not two. Equal gradients alone do not mean "no solution":
 * two lines with the same gradient AND the same intercept are the same line,
 * and every point on it satisfies both equations.
 */
export function intersectionOf(lineA, lineB) {
  if (lineA.m === lineB.m) {
    return lineA.c === lineB.c ? { kind: 'infinite' } : { kind: 'none' }
  }

  const x = (lineB.c - lineA.c) / (lineA.m - lineB.m)
  return { kind: 'one', point: tidyPoint({ x, y: lineA.m * x + lineA.c }) }
}

/**
 * The negative reciprocal, or null when there isn't one.
 *
 * A line perpendicular to a horizontal line is vertical. Vertical lines have no
 * gradient and cannot be expressed as y = mx + c, so callers must handle null
 * rather than being handed a fabricated value — returning 0 here would draw a
 * second horizontal line and teach the opposite of the intended fact.
 */
export function perpendicularGradientOf(m) {
  if (m === 0) return null
  return tidy(-1 / m)
}

export function translatePoint(point, { dx, dy }) {
  return tidyPoint({ x: point.x + dx, y: point.y + dy })
}

export function reflectPoint(point, mirror) {
  switch (mirror.type) {
    case 'vertical':
      return tidyPoint({ x: 2 * mirror.value - point.x, y: point.y })
    case 'horizontal':
      return tidyPoint({ x: point.x, y: 2 * mirror.value - point.y })
    case 'yEqualsX':
      return tidyPoint({ x: point.y, y: point.x })
    case 'yEqualsNegativeX':
      return tidyPoint({ x: -point.y, y: -point.x })
    default:
      return tidyPoint(point)
  }
}

export function rotatePoint(point, centre, degrees, direction = 'clockwise') {
  // Screen convention: an anticlockwise rotation is positive in model space.
  const signed = direction === 'clockwise' ? -degrees : degrees
  const radians = (signed * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  const dx = point.x - centre.x
  const dy = point.y - centre.y

  return tidyPoint({
    x: centre.x + dx * cos - dy * sin,
    y: centre.y + dx * sin + dy * cos,
  })
}

export function enlargePoint(point, centre, scaleFactor) {
  return tidyPoint({
    x: centre.x + (point.x - centre.x) * scaleFactor,
    y: centre.y + (point.y - centre.y) * scaleFactor,
  })
}

function formatNumber(value) {
  return String(tidy(value)).replace('-', MINUS)
}

export function formatCoordinate({ x, y }) {
  return `(${formatNumber(x)}, ${formatNumber(y)})`
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlaneMath.test.js`

Expected: PASS — 26 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/learning/coordinatePlane/coordinatePlaneMath.js \
        tests/unit/coordinatePlaneMath.test.js
git commit -m "Add CoordinatePlaneExplore coordinate mathematics"
```

---

## Task 4: Shared point label layout

**Files:**
- Create: `src/components/learning/coordinatePlane/pointLabelLayout.js`
- Test: `tests/unit/pointLabelLayout.test.js`

**Interfaces:**
- Consumes: nothing outside this file
- Produces:
  - `estimateChipBox(text) → { width, height }`
  - `candidateAnchors(point, plot) → string[]` — the eight anchor names in preference order
  - `layoutPointLabels(labels, { plot, obstacles }) → placed[]` where each entry is `{ id, text, degraded, anchor, box: { x, y, width, height } }`

This is spec §3, and it is **shared infrastructure**. No preset may compute its
own label offsets — transformations put eight labelled points on one plane and
would expose per-preset offsets immediately.

Input labels are `{ id, x, y, text, shortText, priority }` where `x`/`y` are
already projected to pixels and lower `priority` is placed first.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/pointLabelLayout.test.js`:

```js
import { describe, expect, it } from 'vitest'
import {
  candidateAnchors,
  estimateChipBox,
  layoutPointLabels,
} from '../../src/components/learning/coordinatePlane/pointLabelLayout.js'

const PLOT = { x: 0, y: 0, width: 360, height: 300 }

describe('chip box estimation', () => {
  it('grows with character count', () => {
    const short = estimateChipBox('A')
    const long = estimateChipBox("A' (5, 4)")

    expect(long.width).toBeGreaterThan(short.width)
    expect(short.height).toBe(long.height)
  })

  it('never falls below a legible minimum width', () => {
    expect(estimateChipBox('').width).toBeGreaterThanOrEqual(20)
  })
})

describe('candidate anchors', () => {
  it('prefers outward anchors for a point in the top-right of the plot', () => {
    expect(candidateAnchors({ x: 300, y: 40 }, PLOT)[0]).toBe('NE')
  })

  it('prefers outward anchors for a point in the bottom-left of the plot', () => {
    expect(candidateAnchors({ x: 40, y: 260 }, PLOT)[0]).toBe('SW')
  })

  it('always offers all eight anchors', () => {
    const anchors = candidateAnchors({ x: 180, y: 150 }, PLOT)

    expect(anchors).toHaveLength(8)
    expect(new Set(anchors).size).toBe(8)
  })
})

describe('label layout', () => {
  it('places a lone label at its preferred anchor', () => {
    const [placed] = layoutPointLabels(
      [{ id: 'a', x: 300, y: 40, text: '(5, 4)', shortText: 'A', priority: 0 }],
      { plot: PLOT },
    )

    expect(placed.id).toBe('a')
    expect(placed.anchor).toBe('NE')
    expect(placed.degraded).toBe(false)
    expect(placed.text).toBe('(5, 4)')
  })

  it('keeps every placed box inside the plot', () => {
    const placed = layoutPointLabels(
      [
        { id: 'tl', x: 2, y: 2, text: '(−6, 6)', shortText: 'A', priority: 0 },
        { id: 'br', x: 358, y: 298, text: '(6, −6)', shortText: 'B', priority: 1 },
      ],
      { plot: PLOT },
    )

    for (const label of placed) {
      expect(label.box.x).toBeGreaterThanOrEqual(PLOT.x)
      expect(label.box.y).toBeGreaterThanOrEqual(PLOT.y)
      expect(label.box.x + label.box.width).toBeLessThanOrEqual(PLOT.x + PLOT.width)
      expect(label.box.y + label.box.height).toBeLessThanOrEqual(PLOT.y + PLOT.height)
    }
  })

  it('does not overlap two labels placed near one another', () => {
    const placed = layoutPointLabels(
      [
        { id: 'a', x: 180, y: 150, text: '(0, 0)', shortText: 'A', priority: 0 },
        { id: 'b', x: 186, y: 154, text: '(1, 1)', shortText: 'B', priority: 1 },
      ],
      { plot: PLOT },
    )

    const [first, second] = placed
    const overlaps = first.box.x < second.box.x + second.box.width
      && second.box.x < first.box.x + first.box.width
      && first.box.y < second.box.y + second.box.height
      && second.box.y < first.box.y + first.box.height

    expect(overlaps).toBe(false)
  })

  it('places in priority order regardless of input order', () => {
    const placed = layoutPointLabels(
      [
        { id: 'late', x: 180, y: 150, text: '(0, 0)', shortText: 'L', priority: 5 },
        { id: 'active', x: 180, y: 150, text: '(0, 0)', shortText: 'A', priority: 0 },
      ],
      { plot: PLOT },
    )

    expect(placed[0].id).toBe('active')
  })

  it('degrades to the short label rather than colliding when crowded', () => {
    const crowd = Array.from({ length: 9 }, (_, index) => ({
      id: `p${index}`,
      x: 180 + (index % 3) * 4,
      y: 150 + Math.floor(index / 3) * 4,
      text: `(${index}, ${index})`,
      shortText: `P${index}`,
      priority: index,
    }))

    const placed = layoutPointLabels(crowd, { plot: PLOT })
    const degraded = placed.filter(label => label.degraded)

    expect(degraded.length).toBeGreaterThan(0)
    for (const label of degraded) {
      expect(label.text).toBe(crowd.find(item => item.id === label.id).shortText)
    }
  })

  it('avoids supplied obstacles such as axis tick labels', () => {
    const obstacle = { x: 180, y: 120, width: 80, height: 40 }
    const [placed] = layoutPointLabels(
      [{ id: 'a', x: 180, y: 150, text: '(0, 0)', shortText: 'A', priority: 0 }],
      { plot: PLOT, obstacles: [obstacle] },
    )

    const overlapsObstacle = placed.box.x < obstacle.x + obstacle.width
      && obstacle.x < placed.box.x + placed.box.width
      && placed.box.y < obstacle.y + obstacle.height
      && obstacle.y < placed.box.y + placed.box.height

    expect(overlapsObstacle).toBe(false)
  })

  it('returns an empty array for no labels', () => {
    expect(layoutPointLabels([], { plot: PLOT })).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/pointLabelLayout.test.js`

Expected: FAIL — module not found.

- [ ] **Step 3: Write the label layout module**

Create `src/components/learning/coordinatePlane/pointLabelLayout.js`:

```js
// ─── Shared point label placement ────────────────────────────────────────────
//
// Transformations put up to eight labelled points on one plane, so label
// placement is shared infrastructure rather than per-preset offsets. Presets
// supply model meaning; this file decides where text can physically go.
//
// SVG text cannot be measured before paint, so chip boxes are estimated from
// character count — deliberately slightly generous, the same trade-off
// NumberLineExplore makes. A chip a few pixels wide of its text reads as
// deliberate; a clipped one does not.

const CHAR_WIDTH = 7.4
const CHIP_PADDING = 10
const CHIP_MIN_WIDTH = 20
const CHIP_HEIGHT = 18
const ANCHOR_RADIUS = 14

const ANCHOR_OFFSETS = {
  NE: { x: 1, y: -1 },
  NW: { x: -1, y: -1 },
  SE: { x: 1, y: 1 },
  SW: { x: -1, y: 1 },
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  W: { x: -1, y: 0 },
}

export function estimateChipBox(text) {
  const width = Math.max(CHIP_MIN_WIDTH, String(text).length * CHAR_WIDTH + CHIP_PADDING)
  return { width, height: CHIP_HEIGHT }
}

/**
 * Eight anchors in preference order, biased outward: a point in the top-right
 * of the plot prefers NE, so labels lean away from the figure rather than
 * across it.
 */
export function candidateAnchors(point, plot) {
  const towardRight = point.x >= plot.x + plot.width / 2
  const towardBottom = point.y >= plot.y + plot.height / 2

  const vertical = towardBottom ? 'S' : 'N'
  const horizontal = towardRight ? 'E' : 'W'
  const oppositeVertical = towardBottom ? 'N' : 'S'
  const oppositeHorizontal = towardRight ? 'W' : 'E'

  return [
    `${vertical}${horizontal}`,
    `${oppositeVertical}${horizontal}`,
    `${vertical}${oppositeHorizontal}`,
    `${oppositeVertical}${oppositeHorizontal}`,
    horizontal,
    vertical,
    oppositeHorizontal,
    oppositeVertical,
  ]
}

function boxAt(point, anchor, size) {
  const offset = ANCHOR_OFFSETS[anchor]
  const centreX = point.x + offset.x * (ANCHOR_RADIUS + size.width / 2)
  const centreY = point.y + offset.y * (ANCHOR_RADIUS + size.height / 2)

  return {
    x: centreX - size.width / 2,
    y: centreY - size.height / 2,
    width: size.width,
    height: size.height,
  }
}

function clampIntoPlot(box, plot) {
  return {
    ...box,
    x: Math.min(Math.max(box.x, plot.x), plot.x + plot.width - box.width),
    y: Math.min(Math.max(box.y, plot.y), plot.y + plot.height - box.height),
  }
}

function overlaps(a, b) {
  return a.x < b.x + b.width
    && b.x < a.x + a.width
    && a.y < b.y + b.height
    && b.y < a.y + a.height
}

function overlapArea(a, b) {
  const width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  const height = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
  return width > 0 && height > 0 ? width * height : 0
}

function bestPlacement(point, text, plot, taken) {
  const size = estimateChipBox(text)
  const anchors = candidateAnchors(point, plot)
  let fallback = null

  for (const anchor of anchors) {
    const box = clampIntoPlot(boxAt(point, anchor, size), plot)
    const collision = taken.reduce((total, other) => total + overlapArea(box, other), 0)

    if (collision === 0) return { anchor, box, clear: true }
    if (!fallback || collision < fallback.collision) {
      fallback = { anchor, box, collision, clear: false }
    }
  }
  return fallback
}

/**
 * Places labels in priority order, degrading to each label's short form rather
 * than allowing a collision. Degradation beats displacement: a shortened label
 * beside its point is readable, a full label pushed somewhere else is
 * misleading.
 */
export function layoutPointLabels(labels, { plot, obstacles = [] } = {}) {
  const taken = [...obstacles]

  return [...labels]
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
    .map((label) => {
      const point = { x: label.x, y: label.y }
      const full = bestPlacement(point, label.text, plot, taken)

      if (full.clear) {
        taken.push(full.box)
        return {
          id: label.id,
          text: label.text,
          degraded: false,
          anchor: full.anchor,
          box: full.box,
        }
      }

      const short = label.shortText ?? label.text
      const degraded = bestPlacement(point, short, plot, taken)
      const winner = degraded.clear ? degraded : full
      const text = degraded.clear ? short : label.text

      taken.push(winner.box)
      return {
        id: label.id,
        text,
        degraded: degraded.clear,
        anchor: winner.anchor,
        box: winner.box,
      }
    })
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/pointLabelLayout.test.js`

Expected: PASS — 11 tests.

If the crowding test reports no degraded labels, `CHAR_WIDTH` or
`ANCHOR_RADIUS` has been lowered enough for nine chips to fit in a 12px square
of plot; restore the constants above rather than weakening the test.

- [ ] **Step 5: Commit**

```bash
git add src/components/learning/coordinatePlane/pointLabelLayout.js \
        tests/unit/pointLabelLayout.test.js
git commit -m "Add shared point label layout with degradation"
```

---

## Task 5: Preset registry and the `plotPoint` preset

**Files:**
- Create: `src/components/learning/coordinatePlane/presets/index.js`
- Create: `src/components/learning/coordinatePlane/presets/plotPoint.js`
- Test: `tests/unit/coordinatePlanePresets.test.js`

**Interfaces:**
- Consumes: `coordinatePlaneGeometry.js`, `coordinatePlaneMath.js` (Tasks 2–3)
- Produces:
  - `COORDINATE_PLANE_PRESETS` — the registry object
  - `resolveCoordinatePlanePreset(preset) → presetConfig` (accepts a name or a compatible object)
  - `resolvePresetFocus(preset, focus) → string`
  - `clampPresetValues(preset, values) → values`
  - `mergeAxis(presetAxis, override) → axis` — shallow merge, override wins per key
  - `mergeCapabilities(preset, overrides) → capabilities`
  - `resolveShowGuides(preset, showGuides, { isDevelopment, warn }) → 'active' | 'all' | 'none'`
  - `plotPointPreset` — default export of `plotPoint.js`

**The preset contract** every preset file must satisfy:

```js
{
  id, accessibilityLabel, keyFact,
  interactive,                 // default interactivity
  supportsShowAllGuides,       // false where 'all' would be unreadable
  canvas: { width, height },
  padding: { top, right, bottom, left },
  xAxis: { min, max, step, label?, unit? },
  yAxis: { min, max, step, label?, unit? },
  grid: { xSubdivisions, ySubdivisions },
  focusModes: string[], defaultFocus,
  defaultActiveId,
  capabilities: {},            // defaults, overridden by difficultyCapabilities
  controls: [{
    id, label, step, valueText, valueFromPointer, format?,
    min, max,                          // accepted MODEL range (static/controlled)
    interactionMin?, interactionMax?,  // range the learner may reach; default min/max
  }],
  steppers: [{ controlId, label?, group? }],            // rendered −/+ steppers
  options: [{ id, label, choices: [{ id, label }] }],   // discrete buttons
  initialValues: {},
  derive(values, context) → scene,
  describe(values, context) → string,
}
```

**The numeric-control presentation contract.** A declared control is only
useful if the learner can reach it. Every control must be operated by exactly
one of:

- a **drag handle** — the preset returns a `handles` entry naming it, or
- a **stepper** — the preset lists it in `steppers`, and the renderer draws a
  `−` / value / `+` row.

Presets declare `steppers` explicitly rather than the renderer inferring "every
control without a handle", so a control that is deliberately fixed at a preset
value (a comparison line's gradient, say) can exist without silently
appearing as UI. `group` places related steppers on one row — a translation
vector's two components belong together.

`format` renders the displayed value where the raw number is not what the
learner should read (`½` rather than `0.5`).

`tests/architecture/coordinate-plane-control-reachability.test.js` fails any
preset declaring a control that neither a handle nor a stepper reaches.

### Model range versus interaction range

**These are different things and must not share one pair of numbers.**

- `min` / `max` — the **model range**: every value the preset accepts as
  meaningful. `clampPresetValues` uses this, so it governs `value`,
  `defaultValue` and `initialValues`.
- `interactionMin` / `interactionMax` — the **interaction range**: how far a
  learner may drive the control by dragging, stepping or pressing Home/End.
  Defaults to `min` / `max` when a preset does not narrow it.

Collapsing the two silently corrupts supplied figures. A rotation preset whose
centre is capped at ±2 for comfortable phone interaction would clamp a static
exam figure centred at (3, 2) down to (2, 2) — and the result still *looks*
like a valid rotation, so nothing signals that the diagram no longer matches
its mark scheme. Static content must render what it was given.

Consequences for the renderer:

- Steppers, keyboard stepping and Home/End clamp to the **interaction** range,
  and `aria-valuemin` / `aria-valuemax` report it, because that is what the
  learner can actually reach.
- `−` and `+` disable at the **interaction** bounds.
- A supplied value outside the interaction range but inside the model range is
  rendered as given, and the steppers still operate from wherever it sits.
- `clampPresetValues` never applies interaction bounds.

Both ranges must satisfy the visible-bounds contract: the **model** range is
what `coordinate-plane-visible-bounds.test.js` drives to its extremes, so a
widened model range that pushes the figure off the plot fails there.

`context` is `{ focus, comparisonRule, activeId, showGuides, capabilities, axes, grid }`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/coordinatePlanePresets.test.js`:

```js
import { describe, expect, it, vi } from 'vitest'
import {
  COORDINATE_PLANE_PRESETS,
  clampPresetValues,
  mergeAxis,
  mergeCapabilities,
  resolveCoordinatePlanePreset,
  resolvePresetFocus,
  resolveShowGuides,
} from '../../src/components/learning/coordinatePlane/presets/index.js'

function sceneFor(presetId, values, context = {}) {
  const preset = resolveCoordinatePlanePreset(presetId)
  return preset.derive(
    clampPresetValues(preset, values ?? preset.initialValues),
    {
      focus: resolvePresetFocus(preset, context.focus),
      activeId: context.activeId ?? preset.defaultActiveId,
      showGuides: context.showGuides ?? 'active',
      capabilities: mergeCapabilities(preset, context.capabilities),
      axes: { x: preset.xAxis, y: preset.yAxis },
      grid: preset.grid,
      ...context,
    },
  )
}

describe('preset registry', () => {
  it('resolves a registered preset by name', () => {
    expect(resolveCoordinatePlanePreset('plotPoint').id).toBe('plotPoint')
  })

  it('passes a compatible preset object straight through', () => {
    const custom = { id: 'custom', derive: () => ({}) }
    expect(resolveCoordinatePlanePreset(custom)).toBe(custom)
  })

  it('falls back to plotPoint for an unknown name', () => {
    expect(resolveCoordinatePlanePreset('nope').id).toBe('plotPoint')
  })

  it('registers plotPoint', () => {
    expect(Object.keys(COORDINATE_PLANE_PRESETS)).toContain('plotPoint')
  })
})

describe('focus resolution', () => {
  it('uses the requested focus when the preset supports it', () => {
    expect(resolvePresetFocus(COORDINATE_PLANE_PRESETS.plotPoint, 'quadrants'))
      .toBe('quadrants')
  })

  it('falls back to the default focus when unsupported', () => {
    expect(resolvePresetFocus(COORDINATE_PLANE_PRESETS.plotPoint, 'nonsense'))
      .toBe('plot')
  })
})

describe('value clamping', () => {
  it('clamps each control to its own range and step', () => {
    const preset = COORDINATE_PLANE_PRESETS.plotPoint
    expect(clampPresetValues(preset, { x: 99, y: -99 })).toEqual({ x: 6, y: -6 })
    expect(clampPresetValues(preset, { x: 2.4, y: 1.6 })).toEqual({ x: 2, y: 2 })
  })
})

describe('axis merging', () => {
  it('lets a caller override label and unit without restating the range', () => {
    const merged = mergeAxis(
      { min: 0, max: 20, step: 2 },
      { label: 'Time', unit: 's' },
    )

    expect(merged).toEqual({ min: 0, max: 20, step: 2, label: 'Time', unit: 's' })
  })

  it('lets a caller override the range', () => {
    expect(mergeAxis({ min: -6, max: 6, step: 1 }, { min: 0, max: 10 }))
      .toEqual({ min: 0, max: 10, step: 1 })
  })

  it('returns the preset axis untouched when there is no override', () => {
    const axis = { min: -6, max: 6, step: 1 }
    expect(mergeAxis(axis, undefined)).toEqual(axis)
  })
})

describe('capability merging', () => {
  it('overlays caller capabilities on the preset defaults', () => {
    const preset = { capabilities: { nonOriginCentre: true, negativeScaleFactor: false } }

    expect(mergeCapabilities(preset, { negativeScaleFactor: true })).toEqual({
      nonOriginCentre: true,
      negativeScaleFactor: true,
    })
  })

  it('returns the preset defaults when nothing is supplied', () => {
    expect(mergeCapabilities({ capabilities: { a: 1 } })).toEqual({ a: 1 })
  })

  it('tolerates a preset with no declared capabilities', () => {
    expect(mergeCapabilities({}, { a: 1 })).toEqual({ a: 1 })
  })
})

describe('showGuides resolution', () => {
  it('passes through a supported value', () => {
    const preset = { supportsShowAllGuides: true }
    expect(resolveShowGuides(preset, 'all')).toBe('all')
    expect(resolveShowGuides(preset, 'none')).toBe('none')
  })

  it('defaults to active', () => {
    expect(resolveShowGuides({ supportsShowAllGuides: true })).toBe('active')
  })

  it('clamps all to active for presets that cannot survive it, and warns in dev', () => {
    const warn = vi.fn()
    const preset = { id: 'reflect', supportsShowAllGuides: false }

    expect(resolveShowGuides(preset, 'all', { isDevelopment: true, warn })).toBe('active')
    expect(warn).toHaveBeenCalledOnce()
  })

  it('does not warn outside development', () => {
    const warn = vi.fn()
    resolveShowGuides({ id: 'reflect', supportsShowAllGuides: false }, 'all', { warn })
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('plotPoint preset', () => {
  it('reports the coordinate and its quadrant', () => {
    const scene = sceneFor('plotPoint', { x: 3, y: -2 })

    expect(scene.status.heading).toBe('(3, −2)')
    expect(scene.status.explanation).toContain('Quadrant IV')
  })

  it('reads across first, then up or down', () => {
    const scene = sceneFor('plotPoint', { x: 3, y: -2 })

    expect(scene.status.calculation[0]).toContain('3 units to the right')
    expect(scene.status.calculation[1]).toContain('2 units down')
  })

  it('gives the active point full guide lines', () => {
    const scene = sceneFor('plotPoint', { x: 3, y: -2 })
    const point = scene.points.find(item => item.id === 'p')

    expect(point.tier).toBe('active')
    expect(scene.guides.length).toBeGreaterThan(0)
  })

  it('emits no guides when showGuides is none', () => {
    const scene = sceneFor('plotPoint', { x: 3, y: -2 }, { showGuides: 'none' })

    expect(scene.guides).toEqual([])
    expect(scene.points.find(item => item.id === 'p').tier).toBe('related')
  })

  it('names the axes rather than a quadrant when the point sits on one', () => {
    const scene = sceneFor('plotPoint', { x: 0, y: 4 })

    expect(scene.status.explanation).toContain('axis')
    expect(scene.status.explanation).not.toContain('Quadrant')
  })

  it('adds quadrant context labels only in the quadrants focus', () => {
    const plain = sceneFor('plotPoint', { x: 3, y: 2 }, { focus: 'plot' })
    const quadrants = sceneFor('plotPoint', { x: 3, y: 2 }, { focus: 'quadrants' })

    const quadrantLabels = scene => scene.points.filter(item => item.id.startsWith('quadrant-'))

    expect(quadrantLabels(plain)).toHaveLength(0)
    expect(quadrantLabels(quadrants)).toHaveLength(4)
    for (const label of quadrantLabels(quadrants)) {
      expect(label.tier).toBe('context')
    }
  })

  it('describes the actual figure state for static mode', () => {
    const preset = resolveCoordinatePlanePreset('plotPoint')
    const description = preset.describe({ x: 3, y: -2 }, { focus: 'plot' })

    expect(description).toContain('(3, −2)')
    expect(description).toContain('Quadrant IV')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js`

Expected: FAIL — module not found.

- [ ] **Step 3: Write the `plotPoint` preset**

Create `src/components/learning/coordinatePlane/presets/plotPoint.js`:

```js
// ─── Preset: plotPoint ───────────────────────────────────────────────────────
//
// One GCSE idea: a coordinate is a position, read across first and then up or
// down. Three focus modes share one scene builder because they are the same
// figure asked about differently — plotting it, reading it, or naming which
// quadrant it lives in.

import { snapToStep } from '../coordinatePlaneGeometry.js'
import {
  formatCoordinate,
  quadrantOf,
  quadrantRoman,
  quadrantSigns,
} from '../coordinatePlaneMath.js'

const MINUS = '−'

// Quadrant label positions in model space, one per quadrant, kept clear of the
// axes so they never sit under a plotted point's guide lines.
const QUADRANT_ANCHORS = [
  { quadrant: 1, x: 3.6, y: 4.4 },
  { quadrant: 2, x: -3.6, y: 4.4 },
  { quadrant: 3, x: -3.6, y: -4.4 },
  { quadrant: 4, x: 3.6, y: -4.4 },
]

function horizontalPhrase(x) {
  if (x === 0) return 'Stay on the y-axis (x is 0).'
  const direction = x > 0 ? 'right' : 'left'
  const sign = x > 0 ? 'positive' : 'negative'
  return `Move ${Math.abs(x)} units to the ${direction} (${sign} x).`
}

function verticalPhrase(y) {
  if (y === 0) return 'Stay on the x-axis (y is 0).'
  const direction = y > 0 ? 'up' : 'down'
  const sign = y > 0 ? 'positive' : 'negative'
  return `Move ${Math.abs(y)} units ${direction} (${sign} y).`
}

function positionSentence(x, y) {
  const quadrant = quadrantOf(x, y)
  if (quadrant) {
    const signs = quadrantSigns(quadrant).replace('(', '').replace(')', '')
    const [xSign, ySign] = signs.split(', ')
    const word = sign => (sign === '+' ? 'positive' : 'negative')
    return `Quadrant ${quadrantRoman(quadrant)}: x ${word(xSign)}, y ${word(ySign)}.`
  }
  if (x === 0 && y === 0) return 'The origin — where both axes meet.'
  if (x === 0) return 'On the y-axis, so x is 0 and there is no quadrant.'
  return 'On the x-axis, so y is 0 and there is no quadrant.'
}

const plotPointPreset = {
  id: 'plotPoint',
  accessibilityLabel: 'Coordinate plane with a movable point',
  keyFact: 'A coordinate gives a position: across first, then up or down.',
  interactive: true,
  supportsShowAllGuides: true,

  canvas: { width: 360, height: 320 },
  padding: { top: 24, right: 28, bottom: 40, left: 40 },
  xAxis: { min: -6, max: 6, step: 1 },
  yAxis: { min: -6, max: 6, step: 1 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: ['plot', 'read', 'quadrants'],
  defaultFocus: 'plot',
  defaultActiveId: 'p',
  capabilities: {},

  initialValues: { x: 3, y: -2 },
  controls: [
    {
      id: 'x',
      label: 'x coordinate',
      min: -6,
      max: 6,
      step: 1,
      valueText: values => `x equals ${values.x}`,
      valueFromPointer: point => snapToStep(point.modelX, 1),
    },
    {
      id: 'y',
      label: 'y coordinate',
      min: -6,
      max: 6,
      step: 1,
      valueText: values => `y equals ${values.y}`,
      valueFromPointer: point => snapToStep(point.modelY, 1),
    },
  ],

  derive(values, { focus, activeId, showGuides }) {
    const { x, y } = values
    const isActive = showGuides !== 'none'
      && (showGuides === 'all' || activeId === 'p')

    const points = [{
      id: 'p',
      x,
      y,
      text: formatCoordinate({ x, y }),
      shortText: 'P',
      role: 'object',
      tier: isActive ? 'active' : 'related',
      focusable: true,
    }]

    if (focus === 'quadrants') {
      for (const anchor of QUADRANT_ANCHORS) {
        points.push({
          id: `quadrant-${anchor.quadrant}`,
          x: anchor.x,
          y: anchor.y,
          text: `${quadrantRoman(anchor.quadrant)}  ${quadrantSigns(anchor.quadrant)}`,
          shortText: quadrantRoman(anchor.quadrant),
          role: 'textMuted',
          tier: 'context',
          focusable: false,
        })
      }
    }

    // Guide lines belong to the active point alone (spec section 2).
    const guides = isActive
      ? [
          { id: 'guide-x', from: { x, y: 0 }, to: { x, y }, role: 'guideLine' },
          { id: 'guide-y', from: { x: 0, y }, to: { x, y }, role: 'guideLine' },
        ].filter(guide => guide.from.x !== guide.to.x || guide.from.y !== guide.to.y)
      : []

    return {
      shapes: [],
      points,
      guides,
      handles: [{ controlId: 'x', x, y }],
      status: {
        heading: formatCoordinate({ x, y }),
        calculation: [horizontalPhrase(x), verticalPhrase(y)],
        explanation: positionSentence(x, y),
      },
    }
  },

  describe(values, { focus } = {}) {
    const { x, y } = values
    const base = `A coordinate plane with the point ${formatCoordinate({ x, y })} plotted.`
    const place = positionSentence(x, y)
    return focus === 'quadrants'
      ? `${base} The four quadrants are labelled. ${place}`
      : `${base} ${place}`
  },
}

export default plotPointPreset
```

- [ ] **Step 4: Write the preset registry**

Create `src/components/learning/coordinatePlane/presets/index.js`:

```js
// ─── CoordinatePlaneExplore preset registry ──────────────────────────────────
//
// Resolution order for axes and capabilities is: preset defaults, then caller
// props shallow-merged on top. A preset always supplies a complete axis spec,
// so props are never required — a Physics caller can override label and unit
// without restating min, max and step.

import plotPointPreset from './plotPoint.js'

export const COORDINATE_PLANE_PRESETS = {
  plotPoint: plotPointPreset,
}

const FALLBACK_PRESET = 'plotPoint'

export function resolveCoordinatePlanePreset(preset) {
  if (preset && typeof preset === 'object') return preset
  return COORDINATE_PLANE_PRESETS[preset] ?? COORDINATE_PLANE_PRESETS[FALLBACK_PRESET]
}

export function resolvePresetFocus(preset, focus) {
  const modes = preset.focusModes ?? []
  if (focus && modes.includes(focus)) return focus
  return preset.defaultFocus ?? modes[0] ?? null
}

function clampControl(control, value, { min, max }) {
  const stepped = control.step
    ? Math.round(value / control.step) * control.step
    : value
  return Math.min(Math.max(stepped, min), max)
}

/**
 * Clamps to the MODEL range only.
 *
 * This is what `value`, `defaultValue` and `initialValues` pass through, so it
 * must never apply interaction bounds — a static exam figure has to render the
 * centre it was given, not the nearest one a thumb could reach.
 */
export function clampPresetValues(preset, values) {
  const controls = preset.controls ?? []
  const clamped = { ...values }

  for (const control of controls) {
    if (clamped[control.id] == null) continue
    clamped[control.id] = clampControl(control, clamped[control.id], {
      min: control.min,
      max: control.max,
    })
  }
  return clamped
}

export function interactionRange(control) {
  return {
    min: control.interactionMin ?? control.min,
    max: control.interactionMax ?? control.max,
  }
}

/**
 * Clamps a learner-driven change to the interaction range. Used by drag,
 * steppers and keyboard stepping — never by the controlled-value path.
 */
export function clampInteractionValue(control, value) {
  return clampControl(control, value, interactionRange(control))
}

export function mergeAxis(presetAxis, override) {
  if (!override) return { ...presetAxis }
  return { ...presetAxis, ...override }
}

export function mergeCapabilities(preset, overrides) {
  return { ...(preset.capabilities ?? {}), ...(overrides ?? {}) }
}

export function resolveShowGuides(
  preset,
  showGuides = 'active',
  { isDevelopment = false, warn = console.warn } = {},
) {
  if (showGuides === 'all' && preset.supportsShowAllGuides === false) {
    if (isDevelopment) {
      warn(
        `CoordinatePlaneExplore preset "${preset.id}" does not support showGuides="all"; using "active".`,
      )
    }
    return 'active'
  }
  if (!['active', 'all', 'none'].includes(showGuides)) return 'active'
  return showGuides
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js`

Expected: PASS — 24 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/learning/coordinatePlane/presets/ \
        tests/unit/coordinatePlanePresets.test.js
git commit -m "Add CoordinatePlaneExplore preset registry and plotPoint preset"
```

---

## Task 6: The renderer component

**Files:**
- Create: `src/components/learning/CoordinatePlaneExplore.jsx`
- Create: `src/components/learning/CoordinatePlaneExplore.stories.jsx` (first two stories only; the rest arrive in Task 14)

**Interfaces:**
- Consumes: everything from Tasks 1–5
- Produces: default export `CoordinatePlaneExplore` with the props table from spec §10

After this task the component renders, drags and keyboard-operates with the
`plotPoint` preset. Every later preset task adds capability without touching
this file.

- [ ] **Step 1: Write the component**

Create `src/components/learning/CoordinatePlaneExplore.jsx`:

```jsx
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { COMPONENT_SIZE, SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion.js'
import {
  axisAnchorValue,
  axisTickValues,
  createPlaneScale,
  gridLineValues,
  resolveAxisPlacement,
} from './coordinatePlane/coordinatePlaneGeometry.js'
import { createCoordinatePlaneVisualRoles } from './coordinatePlane/coordinatePlaneVisualRoles.js'
import { resolveCoordinatePlaneVisualRole } from './coordinatePlane/coordinatePlaneRoleResolver.js'
import { estimateChipBox, layoutPointLabels } from './coordinatePlane/pointLabelLayout.js'
import {
  clampInteractionValue,
  clampPresetValues,
  interactionRange,
  mergeAxis,
  mergeCapabilities,
  resolveCoordinatePlanePreset,
  resolvePresetFocus,
  resolveShowGuides,
} from './coordinatePlane/presets/index.js'

// ─── Motion / focus styles (injected once) ───────────────────────────────────
// The first handle breathes gently until the learner's first interaction, then
// stays still — one calm cue toward the draggable point, never a reward
// animation. Same pattern as AngleExplore and AreaPerimeterExplore.
let stylesInjected = false
function ensureStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true

  const el = document.createElement('style')
  el.textContent = `
    @keyframes cp-explore-handle-hint {
      0%, 100% { transform: scale(1); opacity: 0.55; }
      50% { transform: scale(1.35); opacity: 0.2; }
    }

    .cp-explore__handle {
      cursor: grab;
      outline: none;
      touch-action: none;
    }

    .cp-explore__handle[data-dragging="true"] {
      cursor: grabbing;
    }

    .cp-explore__handle-ring {
      transform-box: fill-box;
      transform-origin: center;
    }

    .cp-explore__handle-hint .cp-explore__handle-ring {
      animation: cp-explore-handle-hint 2400ms ${MOTION.easing.gentle} infinite;
    }

    .cp-explore__handle:focus-visible {
      filter: drop-shadow(0 0 4px var(--cp-explore-glow));
    }

    .cp-explore__point {
      outline: none;
    }

    .cp-explore__point:focus-visible {
      filter: drop-shadow(0 0 4px var(--cp-explore-glow));
    }

    .cp-explore__mark {
      transition: fill ${MOTION.duration.fast} ${MOTION.easing.gentle},
        stroke ${MOTION.duration.fast} ${MOTION.easing.gentle};
    }

    .cp-explore__option:focus-visible {
      outline: 2px solid var(--cp-explore-focus);
      outline-offset: 2px;
    }

    .cp-explore--reduced-motion .cp-explore__handle-hint .cp-explore__handle-ring,
    .cp-explore--reduced-motion .cp-explore__mark {
      animation: none;
      transition: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .cp-explore__handle-hint .cp-explore__handle-ring { animation: none; }
      .cp-explore__mark { transition: none; }
    }
  `
  document.head.appendChild(el)
}

// The widest preset uses a 360-unit viewBox, so a 24-unit radius stays above
// 44 CSS pixels when rendered at 320px wide.
const HANDLE_HIT_RADIUS = 24

const SCREEN_READER_ONLY_STYLE = Object.freeze({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})

function axisTitleText(axis) {
  if (!axis.label) return null
  return axis.unit ? `${axis.label} (${axis.unit})` : axis.label
}

/**
 * Configuration-driven GCSE coordinate plane — the coordinate-geometry sibling
 * of AngleExplore, AreaPerimeterExplore, FractionRatioExplore and
 * NumberLineExplore.
 *
 * One plane, points that carry their coordinates, and a rule made visible as
 * geometry. Nine presets cover position, straight-line graphs, intersection
 * and the four transformations.
 *
 * The component owns diagram interaction only. Questions, predictions,
 * marking, scores and weakness tracking belong to the page that composes it.
 */
function CoordinatePlaneExplore({
  preset = 'plotPoint',
  focus,
  comparisonRule,
  value,
  defaultValue,
  onChange,
  interactive,
  disabled = false,
  showGuides = 'active',
  difficultyCapabilities,
  xAxis,
  yAxis,
  grid,
  subject = 'Maths',
  reducedMotion,
  label,
  showStatus = true,
}) {
  ensureStyles()

  const presetConfig = useMemo(
    () => resolveCoordinatePlanePreset(preset),
    [preset],
  )
  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const roles = useMemo(() => createCoordinatePlaneVisualRoles(theme), [theme])
  const prefersReducedMotion = usePrefersReducedMotion()
  const reduceMotion = reducedMotion ?? prefersReducedMotion

  const titleId = useId()
  const descriptionId = useId()
  const statusId = useId()
  const clipId = `cp-clip-${useId().replace(/:/g, '')}`
  const svgRef = useRef(null)
  const pointerAnnouncementRef = useRef('')

  const [draggingControl, setDraggingControl] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [activeId, setActiveId] = useState(presetConfig.defaultActiveId ?? null)
  const [choices, setChoices] = useState(() => (
    Object.fromEntries((presetConfig.options ?? []).map(group => [group.id, group.choices[0].id]))
  ))

  const presetAllowsInteraction = interactive ?? presetConfig.interactive ?? true
  const canInteract = presetAllowsInteraction && !disabled
  const isControlled = value != null && typeof value === 'object'

  const [internalValues, setInternalValues] = useState(() =>
    clampPresetValues(presetConfig, defaultValue ?? presetConfig.initialValues),
  )

  useEffect(() => {
    setInternalValues(clampPresetValues(presetConfig, defaultValue ?? presetConfig.initialValues))
    setActiveId(presetConfig.defaultActiveId ?? null)
    setChoices(Object.fromEntries(
      (presetConfig.options ?? []).map(group => [group.id, group.choices[0].id]),
    ))
    setHasInteracted(false)
    setAnnouncement('')
    pointerAnnouncementRef.current = ''
  }, [presetConfig, defaultValue])

  const currentValues = clampPresetValues(
    presetConfig,
    isControlled ? value : internalValues,
  )

  const axes = useMemo(() => ({
    x: mergeAxis(presetConfig.xAxis, xAxis),
    y: mergeAxis(presetConfig.yAxis, yAxis),
  }), [presetConfig, xAxis, yAxis])

  const resolvedGrid = useMemo(
    () => ({ ...presetConfig.grid, ...(grid ?? {}) }),
    [presetConfig, grid],
  )

  const capabilities = useMemo(
    () => mergeCapabilities(presetConfig, difficultyCapabilities),
    [presetConfig, difficultyCapabilities],
  )

  const effectiveShowGuides = resolveShowGuides(presetConfig, showGuides, {
    isDevelopment: import.meta.env.DEV,
  })
  const effectiveFocus = resolvePresetFocus(presetConfig, focus)

  const canvas = presetConfig.canvas
  const scale = useMemo(
    () => createPlaneScale({
      xAxis: axes.x,
      yAxis: axes.y,
      canvas,
      padding: presetConfig.padding,
    }),
    [axes, canvas, presetConfig.padding],
  )

  const deriveContext = {
    focus: effectiveFocus,
    comparisonRule,
    activeId,
    showGuides: effectiveShowGuides,
    capabilities,
    axes,
    grid: resolvedGrid,
    choices,
  }
  const scene = presetConfig.derive(currentValues, deriveContext)

  const controlsById = useMemo(() => (
    Object.fromEntries((presetConfig.controls ?? []).map(control => [control.id, control]))
  ), [presetConfig])

  // ─── Interaction ───────────────────────────────────────────────────────────

  const nextStatusHeading = nextValues =>
    presetConfig.derive(nextValues, deriveContext).status.heading

  /**
   * Atomic multi-value update — one clamp, one state write, one onChange, one
   * announcement.
   *
   * This must never be split into per-control calls. Two sequential updates in
   * one event both spread the same render-time `currentValues`, so the second
   * discards the first: dragging a point diagonally would move y and silently
   * drop x.
   */
  const setControlValues = (patch, { announce = false } = {}) => {
    // Learner-driven changes are held to the interaction range; the model clamp
    // then runs as the outer guarantee. A supplied value already outside the
    // interaction range is left where it is until the learner moves it.
    const bounded = {}
    for (const [controlId, next] of Object.entries(patch)) {
      const control = controlsById[controlId]
      bounded[controlId] = control ? clampInteractionValue(control, next) : next
    }

    const nextValues = clampPresetValues(presetConfig, { ...currentValues, ...bounded })

    const changed = Object.keys(bounded)
      .some(controlId => nextValues[controlId] !== currentValues[controlId])
    if (!changed) return

    const heading = nextStatusHeading(nextValues)
    if (announce) {
      setAnnouncement(heading)
      pointerAnnouncementRef.current = ''
    } else {
      pointerAnnouncementRef.current = heading
    }

    if (!isControlled) setInternalValues(nextValues)
    onChange?.(nextValues)
  }

  const svgPointFromEvent = (event) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (!rect.width || !rect.height) return null

    const px = ((event.clientX - rect.left) / rect.width) * canvas.width
    const py = ((event.clientY - rect.top) / rect.height) * canvas.height
    return { px, py, modelX: scale.toModelX(px), modelY: scale.toModelY(py) }
  }

  const handlePointerDown = (handle) => (event) => {
    if (!canInteract) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerAnnouncementRef.current = ''
    setDraggingControl(handle.controlId)
    setHasInteracted(true)
    if (handle.pointId) setActiveId(handle.pointId)
  }

  // A handle may drive more than one control — dragging a point moves x and y
  // together. Every control the handle names is collected into ONE patch and
  // applied atomically; updating them one at a time loses all but the last.
  const handlePointerMove = (handle) => (event) => {
    if (draggingControl !== handle.controlId || !canInteract) return
    const point = svgPointFromEvent(event)
    if (!point) return

    const patch = {}
    for (const controlId of handle.controlIds ?? [handle.controlId]) {
      const control = controlsById[controlId]
      if (!control) continue
      patch[controlId] = control.valueFromPointer(point, currentValues)
    }
    setControlValues(patch)
  }

  const handlePointerEnd = () => {
    setDraggingControl(null)
    if (pointerAnnouncementRef.current) {
      setAnnouncement(pointerAnnouncementRef.current)
      pointerAnnouncementRef.current = ''
    }
  }

  const handleKeyDown = (handle) => (event) => {
    if (!canInteract) return
    const control = controlsById[handle.controlId]
    if (!control) return

    const current = currentValues[handle.controlId]
    const reach = interactionRange(control)
    let next = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + control.step
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - control.step
    if (event.key === 'Home') next = reach.min
    if (event.key === 'End') next = reach.max
    if (next === null) return

    event.preventDefault()
    setHasInteracted(true)
    if (handle.pointId) setActiveId(handle.pointId)
    setControlValues({ [handle.controlId]: next }, { announce: true })
  }

  // ─── Steppers ──────────────────────────────────────────────────────────────
  // Every declared control is reachable: by a drag handle, or by one of these.

  const stepControl = (controlId, direction) => {
    const control = controlsById[controlId]
    if (!control) return
    setHasInteracted(true)
    setControlValues(
      { [controlId]: currentValues[controlId] + direction * control.step },
      { announce: true },
    )
  }

  const handleStepperKeyDown = controlId => (event) => {
    const control = controlsById[controlId]
    if (!control) return
    const reach = interactionRange(control)
    let next = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = currentValues[controlId] + control.step
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = currentValues[controlId] - control.step
    if (event.key === 'Home') next = reach.min
    if (event.key === 'End') next = reach.max
    if (next === null) return

    event.preventDefault()
    setHasInteracted(true)
    setControlValues({ [controlId]: next }, { announce: true })
  }

  // Grouped steppers share a row; ungrouped ones each get their own.
  const stepperRows = useMemo(() => {
    const rows = []
    for (const stepper of presetConfig.steppers ?? []) {
      const key = stepper.group ?? stepper.controlId
      const existing = rows.find(row => row.key === key)
      if (existing) existing.items.push(stepper)
      else rows.push({ key, items: [stepper] })
    }
    return rows
  }, [presetConfig])

  // ─── Projection and labels ─────────────────────────────────────────────────

  const resolveRole = role => resolveCoordinatePlaneVisualRole(roles, role, {
    isDevelopment: import.meta.env.DEV,
  })

  const xPlacement = resolveAxisPlacement(axes.x)
  const yPlacement = resolveAxisPlacement(axes.y)
  const xAnchor = axisAnchorValue(axes.x)
  const yAnchor = axisAnchorValue(axes.y)

  const xTicks = axisTickValues(axes.x)
  const yTicks = axisTickValues(axes.y)

  const projectedPoints = scene.points.map(point => ({
    ...point,
    px: scale.toX(point.x),
    py: scale.toY(point.y),
  }))

  // Tick labels and axis titles are real obstacles. Reporting them is the
  // contract; tuning chip constants is not a substitute, because a constant
  // cannot know where a tick label happens to sit.
  const labelObstacles = useMemo(() => {
    const boxes = []

    for (const tick of xTicks) {
      if (tick === xAnchor) continue
      const { width, height } = estimateChipBox(String(tick))
      boxes.push({
        x: scale.toX(tick) - width / 2,
        y: scale.toY(yAnchor) + 16 - height / 2,
        width,
        height,
      })
    }

    for (const tick of yTicks) {
      if (tick === yAnchor) continue
      const { width, height } = estimateChipBox(String(tick))
      boxes.push({
        x: scale.toX(xAnchor) - 12 - width,
        y: scale.toY(tick) - height / 2,
        width,
        height,
      })
    }

    if (axisTitleText(axes.x)) {
      const { width, height } = estimateChipBox(axisTitleText(axes.x))
      boxes.push({
        x: scale.plot.x + scale.plot.width / 2 - width / 2,
        y: canvas.height - 6 - height,
        width,
        height,
      })
    }

    if (axisTitleText(axes.y)) {
      const { width, height } = estimateChipBox(axisTitleText(axes.y))
      // Rotated: the text runs vertically, so width and height swap.
      boxes.push({
        x: 12 - height / 2,
        y: scale.plot.y + scale.plot.height / 2 - width / 2,
        width: height,
        height: width,
      })
    }

    return boxes
  }, [xTicks, yTicks, xAnchor, yAnchor, scale, axes, canvas])

  const placedLabels = useMemo(() => layoutPointLabels(
    projectedPoints.map((point, index) => ({
      id: point.id,
      x: point.px,
      y: point.py,
      text: point.text,
      shortText: point.shortText,
      // Active first, then related, then context — so the point that matters
      // most keeps its full label when the plane gets crowded.
      priority: (point.tier === 'active' ? 0 : point.tier === 'related' ? 100 : 200) + index,
    })),
    { plot: scale.plot, obstacles: labelObstacles },
  ), [scene.points, scale, labelObstacles])

  const labelById = useMemo(
    () => Object.fromEntries(placedLabels.map(item => [item.id, item])),
    [placedLabels],
  )

  const interactionInstruction = canInteract && !hasInteracted
    ? presetConfig.instruction ?? 'Drag the point to move it.'
    : null

  const description = [
    presetConfig.describe?.(currentValues, deriveContext) ?? presetConfig.keyFact,
    canInteract ? null : 'This diagram is shown as a static illustration.',
  ].filter(Boolean).join(' ')

  const optionButtonStyle = active => ({
    ...TYPE.button,
    minHeight: COMPONENT_SIZE.touchTarget,
    padding: `${SPACING.micro}px ${SPACING.compact}px`,
    borderRadius: RADII.small,
    border: `1px solid ${active ? roles.interaction : roles.textMuted}`,
    color: active ? roles.interaction : roles.textSecondary,
    background: active ? roles.objectFill : 'transparent',
    cursor: 'pointer',
    transition: reduceMotion
      ? 'none'
      : `color ${MOTION.duration.fast} ${MOTION.easing.gentle}, border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
  })

  return (
    <div
      className={`cp-explore${reduceMotion ? ' cp-explore--reduced-motion' : ''}`}
      data-cp-preset={presetConfig.id}
      data-cp-focus={effectiveFocus ?? undefined}
      data-cp-interactive={canInteract ? 'true' : 'false'}
      data-cp-show-guides={effectiveShowGuides}
      data-cp-active={activeId ?? undefined}
      data-reduced-motion={reduceMotion || undefined}
      style={{
        width: '100%',
        maxWidth: presetConfig.maxWidth ?? 420,
        minWidth: 0,
        margin: '0 auto',
        position: 'relative',
        '--cp-explore-glow': roles.focusGlow,
        '--cp-explore-focus': roles.interaction,
      }}
    >
      {canInteract && (
        <div
          data-cp-status-announcement="true"
          aria-live="polite"
          aria-atomic="true"
          style={SCREEN_READER_ONLY_STYLE}
        >
          {announcement}
        </div>
      )}

      {interactionInstruction && (
        <div
          data-cp-interaction-instruction="true"
          style={{
            ...TYPE.bodySmall,
            color: roles.textSecondary,
            textAlign: 'center',
            padding: `0 ${SPACING.compact}px ${SPACING.micro}px`,
          }}
        >
          {interactionInstruction}
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        data-cp-canvas={`${canvas.width}x${canvas.height}`}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          aspectRatio: `${canvas.width} / ${canvas.height}`,
          overflow: 'visible',
        }}
      >
        <title id={titleId}>{label ?? presetConfig.accessibilityLabel}</title>
        <desc id={descriptionId}>{description}</desc>

        {/* Clip path — the rendering safety net. Model-space clipping in the
            presets is the primary mechanism; this catches anything that slips
            past, so nothing is ever drawn outside the plot. */}
        <defs>
          <clipPath id={clipId}>
            <rect
              x={scale.plot.x}
              y={scale.plot.y}
              width={scale.plot.width}
              height={scale.plot.height}
            />
          </clipPath>
        </defs>

        {/* Grid — gridlines may be finer than the labelled ticks */}
        <g aria-hidden="true" data-cp-grid="true">
          {gridLineValues(axes.x, resolvedGrid.xSubdivisions).map(value => (
            <line
              key={`grid-x-${value}`}
              x1={scale.toX(value)}
              y1={scale.plot.y}
              x2={scale.toX(value)}
              y2={scale.plot.y + scale.plot.height}
              stroke={roles.gridLine}
              strokeWidth={1}
            />
          ))}
          {gridLineValues(axes.y, resolvedGrid.ySubdivisions).map(value => (
            <line
              key={`grid-y-${value}`}
              x1={scale.plot.x}
              y1={scale.toY(value)}
              x2={scale.plot.x + scale.plot.width}
              y2={scale.toY(value)}
              stroke={roles.gridLine}
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Axes — each placed from its own range */}
        <g data-cp-axes="true">
          <line
            data-cp-axis="x"
            data-cp-axis-placement={xPlacement}
            x1={scale.plot.x}
            y1={scale.toY(yAnchor)}
            x2={scale.plot.x + scale.plot.width}
            y2={scale.toY(yAnchor)}
            stroke={roles.axis}
            strokeWidth={1.5}
          />
          <line
            data-cp-axis="y"
            data-cp-axis-placement={yPlacement}
            x1={scale.toX(xAnchor)}
            y1={scale.plot.y}
            x2={scale.toX(xAnchor)}
            y2={scale.plot.y + scale.plot.height}
            stroke={roles.axis}
            strokeWidth={1.5}
          />
        </g>

        {/* Tick labels */}
        <g aria-hidden="true" data-cp-ticks="true">
          {xTicks.filter(tick => tick !== xAnchor).map(tick => (
            <text
              key={`tick-x-${tick}`}
              x={scale.toX(tick)}
              y={scale.toY(yAnchor) + 16}
              textAnchor="middle"
              dominantBaseline="central"
              fill={roles.tickLabel}
              style={{ ...TYPE.caption, fontVariantNumeric: 'tabular-nums' }}
            >
              {String(tick).replace('-', '−')}
            </text>
          ))}
          {yTicks.filter(tick => tick !== yAnchor).map(tick => (
            <text
              key={`tick-y-${tick}`}
              x={scale.toX(xAnchor) - 12}
              y={scale.toY(tick)}
              textAnchor="end"
              dominantBaseline="central"
              fill={roles.tickLabel}
              style={{ ...TYPE.caption, fontVariantNumeric: 'tabular-nums' }}
            >
              {String(tick).replace('-', '−')}
            </text>
          ))}
        </g>

        {/* Axis titles, when the caller supplies them */}
        <g aria-hidden="true">
          {axisTitleText(axes.x) && (
            <text
              data-cp-axis-title="x"
              x={scale.plot.x + scale.plot.width / 2}
              y={canvas.height - 6}
              textAnchor="middle"
              fill={roles.axisTitle}
              style={TYPE.label}
            >
              {axisTitleText(axes.x)}
            </text>
          )}
          {axisTitleText(axes.y) && (
            <text
              data-cp-axis-title="y"
              transform={`translate(12 ${scale.plot.y + scale.plot.height / 2}) rotate(-90)`}
              textAnchor="middle"
              fill={roles.axisTitle}
              style={TYPE.label}
            >
              {axisTitleText(axes.y)}
            </text>
          )}
        </g>

        {/* Shapes and lines — clipped to the plot */}
        <g clipPath={`url(#${clipId})`}>
        {(scene.shapes ?? []).map(shape => (
          <path
            key={shape.id}
            className="cp-explore__mark"
            data-cp-shape={shape.id}
            d={shape.path}
            fill={resolveRole(shape.fillRole) ?? 'none'}
            stroke={resolveRole(shape.strokeRole) ?? 'none'}
            strokeWidth={shape.strokeWidth ?? 2}
            strokeDasharray={shape.dashed ? '6 5' : undefined}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        </g>

        {/* Guides — active element only (spec section 2), also clipped */}
        <g data-cp-guides="true" clipPath={`url(#${clipId})`}>
          {(scene.guides ?? []).map(guide => (
            <line
              key={guide.id}
              data-cp-guide={guide.id}
              x1={scale.toX(guide.from.x)}
              y1={scale.toY(guide.from.y)}
              x2={scale.toX(guide.to.x)}
              y2={scale.toY(guide.to.y)}
              stroke={resolveRole(guide.role) ?? roles.guideLine}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          ))}
        </g>

        {/* Points and their labels */}
        {projectedPoints.map((point) => {
          const placed = labelById[point.id]
          const isPlottedPoint = point.tier !== 'context'

          return (
            <g key={point.id} data-cp-point={point.id} data-cp-tier={point.tier}>
              {isPlottedPoint && (
                <circle
                  className="cp-explore__mark"
                  cx={point.px}
                  cy={point.py}
                  r={point.tier === 'active' ? 6 : 4.5}
                  fill={resolveRole(point.role) ?? roles.object}
                />
              )}
              {placed && (
                <text
                  data-cp-point-label={point.id}
                  data-cp-label-degraded={placed.degraded ? 'true' : undefined}
                  x={placed.box.x + placed.box.width / 2}
                  y={placed.box.y + placed.box.height / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={point.tier === 'context' ? roles.textMuted : roles.textPrimary}
                  style={{
                    ...(point.tier === 'active' ? TYPE.label : TYPE.caption),
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {placed.text}
                </text>
              )}
              {canInteract && point.focusable && (
                <circle
                  className="cp-explore__point"
                  data-cp-point-target={point.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${point.text}`}
                  cx={point.px}
                  cy={point.py}
                  r={HANDLE_HIT_RADIUS}
                  fill="transparent"
                  onFocus={() => setActiveId(point.id)}
                  onClick={() => {
                    setActiveId(point.id)
                    setHasInteracted(true)
                  }}
                />
              )}
            </g>
          )
        })}

        {/* Drag handles */}
        {canInteract && (scene.handles ?? []).map((handle, index) => {
          const control = controlsById[handle.controlId]
          if (!control) return null
          const hint = index === 0 && !hasInteracted && !reduceMotion

          return (
            <g
              key={handle.controlId}
              className={`cp-explore__handle${hint ? ' cp-explore__handle-hint' : ''}`}
              data-cp-handle={handle.controlId}
              data-dragging={draggingControl === handle.controlId || undefined}
              role="slider"
              tabIndex={0}
              aria-label={control.label}
              aria-valuemin={interactionRange(control).min}
              aria-valuemax={interactionRange(control).max}
              aria-valuenow={currentValues[handle.controlId]}
              aria-valuetext={control.valueText(currentValues)}
              aria-describedby={showStatus ? statusId : descriptionId}
              onPointerDown={handlePointerDown(handle)}
              onPointerMove={handlePointerMove(handle)}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onKeyDown={handleKeyDown(handle)}
            >
              <circle
                data-cp-hit-target="true"
                cx={scale.toX(handle.x)}
                cy={scale.toY(handle.y)}
                r={HANDLE_HIT_RADIUS}
                fill="transparent"
              />
              <circle
                className="cp-explore__handle-ring"
                cx={scale.toX(handle.x)}
                cy={scale.toY(handle.y)}
                r={11}
                fill="none"
                stroke={roles.interaction}
                strokeWidth={1.5}
                opacity={0.55}
              />
            </g>
          )
        })}
      </svg>

      {/* Numeric steppers — how a control without a drag handle is reached */}
      {canInteract && stepperRows.map(row => (
        <div
          key={row.key}
          data-cp-stepper-row={row.key}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.compact,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          {row.items.map((stepper) => {
            const control = controlsById[stepper.controlId]
            if (!control) return null
            const current = currentValues[stepper.controlId]
            const reach = interactionRange(control)
            const display = control.format ? control.format(current) : String(current).replace('-', '−')

            const nudgeStyle = {
              ...TYPE.button,
              minWidth: COMPONENT_SIZE.touchTarget,
              minHeight: COMPONENT_SIZE.touchTarget,
              borderRadius: RADII.small,
              border: `1px solid ${roles.textMuted}`,
              color: roles.textSecondary,
              background: 'transparent',
              cursor: 'pointer',
            }

            return (
              <div
                key={stepper.controlId}
                data-cp-stepper={stepper.controlId}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <span style={{ ...TYPE.label, color: roles.textSecondary }}>
                  {stepper.label ?? control.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
                  <button
                    type="button"
                    className="cp-explore__option"
                    data-cp-stepper-decrement={stepper.controlId}
                    aria-label={`Decrease ${control.label}`}
                    disabled={current <= reach.min}
                    onClick={() => stepControl(stepper.controlId, -1)}
                    style={nudgeStyle}
                  >
                    −
                  </button>
                  <span
                    className="cp-explore__option"
                    data-cp-stepper-value={stepper.controlId}
                    role="slider"
                    tabIndex={0}
                    aria-label={control.label}
                    aria-valuemin={reach.min}
                    aria-valuemax={reach.max}
                    aria-valuenow={current}
                    aria-valuetext={control.valueText(currentValues)}
                    onKeyDown={handleStepperKeyDown(stepper.controlId)}
                    style={{
                      ...TYPE.titleMedium,
                      color: roles.textPrimary,
                      minWidth: COMPONENT_SIZE.touchTarget,
                      textAlign: 'center',
                      fontVariantNumeric: 'tabular-nums',
                      outline: 'none',
                    }}
                  >
                    {display}
                  </span>
                  <button
                    type="button"
                    className="cp-explore__option"
                    data-cp-stepper-increment={stepper.controlId}
                    aria-label={`Increase ${control.label}`}
                    disabled={current >= reach.max}
                    onClick={() => stepControl(stepper.controlId, 1)}
                    style={nudgeStyle}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {/* Discrete choices — real buttons, never disguised sliders */}
      {canInteract && (presetConfig.options ?? []).map(group => (
        <div
          key={group.id}
          role="group"
          aria-label={group.label}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.micro,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          {group.choices.map(choice => (
            <button
              key={choice.id}
              type="button"
              className="cp-explore__option"
              data-cp-option={`${group.id}:${choice.id}`}
              aria-pressed={choices[group.id] === choice.id}
              onClick={() => {
                setChoices(current => ({ ...current, [group.id]: choice.id }))
                setHasInteracted(true)
              }}
              style={optionButtonStyle(choices[group.id] === choice.id)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      ))}

      {showStatus && (
        <div
          id={statusId}
          style={{
            minHeight: COMPONENT_SIZE.areaPerimeterStatusReserve,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
            textAlign: 'center',
          }}
        >
          <div
            data-cp-status-heading="true"
            style={{
              ...TYPE.displayCard,
              color: roles.textPrimary,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {scene.status.heading}
          </div>

          <div style={{ minHeight: COMPONENT_SIZE.touchTarget, marginTop: SPACING.micro }}>
            {scene.status.calculation.map(line => (
              <div
                key={line}
                data-cp-status-calculation="true"
                style={{
                  ...TYPE.bodySmall,
                  color: roles.textSecondary,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {line}
              </div>
            ))}
          </div>

          <div
            data-cp-status-explanation="true"
            style={{
              ...TYPE.bodySmall,
              color: roles.textSecondary,
              maxWidth: '34ch',
              margin: `${SPACING.micro}px auto 0`,
            }}
          >
            {scene.status.explanation}
          </div>
        </div>
      )}
    </div>
  )
}

export default CoordinatePlaneExplore
```

- [ ] **Step 2: Add the `pointId` and `controlIds` fields to the `plotPoint` handle**

The renderer drags x and y together from one handle. Modify the `handles` array
in `src/components/learning/coordinatePlane/presets/plotPoint.js`:

```js
      handles: [{ controlId: 'x', controlIds: ['x', 'y'], pointId: 'p', x, y }],
```

- [ ] **Step 3: Write the first two stories**

Create `src/components/learning/CoordinatePlaneExplore.stories.jsx`:

```jsx
import { expect, userEvent, within } from 'storybook/test'
import CoordinatePlaneExplore from './CoordinatePlaneExplore.jsx'

function expectMobileContainment(canvasElement, maximumWidth = 320) {
  const diagram = canvasElement.querySelector('.cp-explore')
  const diagramWidth = diagram?.getBoundingClientRect().width ?? Infinity

  expect(diagramWidth).toBeLessThanOrEqual(maximumWidth + 0.5)
  expect(diagram?.scrollWidth).toBeLessThanOrEqual(diagram?.clientWidth)
}

export default {
  title: 'Learning/CoordinatePlaneExplore',
  component: CoordinatePlaneExplore,
  parameters: { layout: 'centered' },
}

export const PlotPoint = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'x coordinate' })

    await expect(canvas.getByText('(3, −2)')).toBeVisible()
    await expect(canvas.getByText(/Quadrant IV/)).toBeVisible()

    handle.focus()
    await userEvent.keyboard('{ArrowLeft>5/}')
    await expect(handle).toHaveAttribute('aria-valuenow', '-2')
    await expect(canvas.getByText(/Quadrant III/)).toBeVisible()

    await userEvent.keyboard('{Home}')
    await expect(handle).toHaveAttribute('aria-valuenow', '-6')
  },
}

export const PlotPointStatic = {
  args: { interactive: false, defaultValue: { x: -4, y: 3 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('(−4, 3)')).toBeVisible()
    await expect(canvas.queryByRole('slider')).toBeNull()

    // Static mode drops aria-live but keeps a descriptive figure summary.
    const description = canvasElement.querySelector('desc')
    await expect(description.textContent).toContain('(−4, 3)')
    await expect(description.textContent).toContain('static illustration')
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()

    expectMobileContainment(canvasElement)
  },
}
```

- [ ] **Step 4: Run the storybook tests**

Run: `./node_modules/.bin/vitest run --project storybook -t CoordinatePlaneExplore`

Expected: PASS — 2 stories.

- [ ] **Step 5: Verify the build**

Run: `./node_modules/.bin/vite build`

Expected: build completes with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/learning/CoordinatePlaneExplore.jsx \
        src/components/learning/CoordinatePlaneExplore.stories.jsx \
        src/components/learning/coordinatePlane/presets/plotPoint.js
git commit -m "Add CoordinatePlaneExplore renderer with plotPoint preset"
```

---

## Task 7: The `midpoint` preset

**Files:**
- Create: `src/components/learning/coordinatePlane/presets/midpoint.js`
- Modify: `src/components/learning/coordinatePlane/presets/index.js` (register it)
- Modify: `tests/unit/coordinatePlanePresets.test.js` (append a describe block)

**Interfaces:**
- Consumes: `midpointOf`, `formatCoordinate` from `coordinatePlaneMath.js`; `snapToStep` from `coordinatePlaneGeometry.js`
- Produces: `midpointPreset` registered as `midpoint`

Spec §5: **the x-values and y-values are paired separately before averaging.**
A horizontal bracket joins the two x-values against the x-axis, a vertical
bracket does the same for the y-values, and the midpoint appears where the two
results meet. This is the whole point of the preset — without it the formula
becomes another memorisation shortcut.

- [ ] **Step 1: Append the failing test**

Append to `tests/unit/coordinatePlanePresets.test.js`:

```js
describe('midpoint preset', () => {
  it('averages each coordinate and reports the midpoint', () => {
    const scene = sceneFor('midpoint', { ax: -3, ay: 1, bx: 5, by: 5 })

    expect(scene.status.heading).toBe('(1, 3)')
  })

  it('pairs the x-values and the y-values separately in the calculation', () => {
    const scene = sceneFor('midpoint', { ax: -3, ay: 1, bx: 5, by: 5 })

    expect(scene.status.calculation[0]).toBe('x: (−3 + 5) ÷ 2 = 1')
    expect(scene.status.calculation[1]).toBe('y: (1 + 5) ÷ 2 = 3')
  })

  it('draws one bracket per pairing, not one per point', () => {
    const scene = sceneFor('midpoint', { ax: -3, ay: 1, bx: 5, by: 5 })
    const brackets = scene.shapes.filter(shape => shape.id.startsWith('bracket-'))

    expect(brackets.map(shape => shape.id).sort()).toEqual(['bracket-x', 'bracket-y'])
  })

  it('marks both endpoints and the midpoint, with only one active', () => {
    const scene = sceneFor('midpoint', { ax: -3, ay: 1, bx: 5, by: 5 }, { activeId: 'a' })
    const active = scene.points.filter(point => point.tier === 'active')

    expect(scene.points.map(point => point.id).sort()).toEqual(['a', 'b', 'm'])
    expect(active).toHaveLength(1)
    expect(active[0].id).toBe('a')
  })

  it('handles a half-value midpoint', () => {
    const scene = sceneFor('midpoint', { ax: 0, ay: 0, bx: 3, by: 5 })

    expect(scene.status.heading).toBe('(1.5, 2.5)')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js -t midpoint`

Expected: FAIL — `midpoint` resolves to the `plotPoint` fallback, so the heading is wrong.

- [ ] **Step 3: Write the preset**

Create `src/components/learning/coordinatePlane/presets/midpoint.js`:

```js
// ─── Preset: midpoint ────────────────────────────────────────────────────────
//
// The midpoint formula is worth deriving, not reciting. The two x-values are
// bracketed together against the x-axis and the two y-values against the
// y-axis, so the learner watches two independent averages meet at a point. The
// formula is then read off the picture.

import { snapToStep } from '../coordinatePlaneGeometry.js'
import { formatCoordinate, midpointOf } from '../coordinatePlaneMath.js'

const MINUS = '−'

function signed(value) {
  return String(value).replace('-', MINUS)
}

function averageLine(axis, first, second, result) {
  return `${axis}: (${signed(first)} + ${signed(second)}) ÷ 2 = ${signed(result)}`
}

function endpointControl(id, label) {
  return {
    id,
    label,
    min: -6,
    max: 6,
    step: 1,
    valueText: values => `${label} equals ${values[id]}`,
    valueFromPointer: point => snapToStep(
      id.endsWith('x') ? point.modelX : point.modelY,
      1,
    ),
  }
}

const midpointPreset = {
  id: 'midpoint',
  accessibilityLabel: 'Coordinate plane showing the midpoint of a line segment',
  keyFact: 'The midpoint averages the x-values and the y-values separately.',
  instruction: 'Drag either endpoint to move the line.',
  interactive: true,
  supportsShowAllGuides: true,

  canvas: { width: 360, height: 320 },
  padding: { top: 24, right: 28, bottom: 40, left: 40 },
  xAxis: { min: -6, max: 6, step: 1 },
  yAxis: { min: -6, max: 6, step: 1 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: [],
  defaultFocus: null,
  defaultActiveId: 'a',
  capabilities: {},

  initialValues: { ax: -3, ay: 1, bx: 5, by: 5 },
  controls: [
    endpointControl('ax', 'Point A x'),
    endpointControl('ay', 'Point A y'),
    endpointControl('bx', 'Point B x'),
    endpointControl('by', 'Point B y'),
  ],

  derive(values, { activeId, showGuides }) {
    const a = { x: values.ax, y: values.ay }
    const b = { x: values.bx, y: values.by }
    const m = midpointOf(a, b)

    const tierFor = id => {
      if (showGuides === 'none') return 'related'
      if (showGuides === 'all') return 'active'
      return activeId === id ? 'active' : 'related'
    }

    const shapes = [
      {
        id: 'segment',
        path: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
        strokeRole: 'object',
        modelPath: true,
      },
      // One bracket per pairing — x-values together, y-values together.
      {
        id: 'bracket-x',
        path: `M ${a.x} 0 L ${b.x} 0`,
        strokeRole: 'ruleLine',
        dashed: true,
        modelPath: true,
      },
      {
        id: 'bracket-y',
        path: `M 0 ${a.y} L 0 ${b.y}`,
        strokeRole: 'ruleLine',
        dashed: true,
        modelPath: true,
      },
    ]

    const points = [
      {
        id: 'a',
        ...a,
        text: `A ${formatCoordinate(a)}`,
        shortText: 'A',
        role: 'object',
        tier: tierFor('a'),
        focusable: true,
      },
      {
        id: 'b',
        ...b,
        text: `B ${formatCoordinate(b)}`,
        shortText: 'B',
        role: 'object',
        tier: tierFor('b'),
        focusable: true,
      },
      {
        id: 'm',
        ...m,
        text: `M ${formatCoordinate(m)}`,
        shortText: 'M',
        role: 'image',
        tier: tierFor('m'),
        focusable: true,
      },
    ]

    const activePoint = points.find(point => point.tier === 'active')
    const guides = activePoint && showGuides !== 'none'
      ? [
          {
            id: 'guide-x',
            from: { x: activePoint.x, y: 0 },
            to: { x: activePoint.x, y: activePoint.y },
            role: 'guideLine',
          },
          {
            id: 'guide-y',
            from: { x: 0, y: activePoint.y },
            to: { x: activePoint.x, y: activePoint.y },
            role: 'guideLine',
          },
        ]
      : []

    return {
      shapes,
      points,
      guides,
      handles: [
        { controlId: 'ax', controlIds: ['ax', 'ay'], pointId: 'a', x: a.x, y: a.y },
        { controlId: 'bx', controlIds: ['bx', 'by'], pointId: 'b', x: b.x, y: b.y },
      ],
      status: {
        heading: formatCoordinate(m),
        calculation: [
          averageLine('x', a.x, b.x, m.x),
          averageLine('y', a.y, b.y, m.y),
        ],
        explanation: 'Average the x-values, then average the y-values. Each pair is worked out on its own.',
      },
    }
  },

  describe(values) {
    const a = { x: values.ax, y: values.ay }
    const b = { x: values.bx, y: values.by }
    const m = midpointOf(a, b)
    return `A line segment from A ${formatCoordinate(a)} to B ${formatCoordinate(b)}, with midpoint M ${formatCoordinate(m)}.`
  },
}

export default midpointPreset
```

- [ ] **Step 4: Teach the renderer to project model-space shape paths**

`plotPoint` emitted no shapes, so this is the first preset needing paths in
model coordinates. Add a projection helper to
`src/components/learning/CoordinatePlaneExplore.jsx`, immediately above the
component function:

```jsx
// Presets author shape paths in model space so the maths stays readable.
// Commands are single letters followed by coordinate pairs.
function projectModelPath(path, scale) {
  return path.replace(
    /([ML])\s+(-?[\d.]+)\s+(-?[\d.]+)/g,
    (_, command, x, y) => `${command} ${scale.toX(Number(x))} ${scale.toY(Number(y))}`,
  )
}
```

Then in the shapes map, replace `d={shape.path}` with:

```jsx
            d={shape.modelPath ? projectModelPath(shape.path, scale) : shape.path}
```

- [ ] **Step 5: Register the preset**

In `src/components/learning/coordinatePlane/presets/index.js`, add the import
and registry entry:

```js
import midpointPreset from './midpoint.js'
```

```js
export const COORDINATE_PLANE_PRESETS = {
  plotPoint: plotPointPreset,
  midpoint: midpointPreset,
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js`

Expected: PASS — 29 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/learning/coordinatePlane/presets/midpoint.js \
        src/components/learning/coordinatePlane/presets/index.js \
        src/components/learning/CoordinatePlaneExplore.jsx \
        tests/unit/coordinatePlanePresets.test.js
git commit -m "Add midpoint preset with separate x and y pairing"
```

---

## Task 8: The `straightLine` preset

**Files:**
- Create: `src/components/learning/coordinatePlane/presets/straightLine.js`
- Modify: `src/components/learning/coordinatePlane/presets/index.js`
- Modify: `tests/unit/coordinatePlanePresets.test.js`

**Interfaces:**
- Consumes: `lineY`, `xInterceptOf`, `formatCoordinate` from `coordinatePlaneMath.js`
- Produces: `straightLinePreset` registered as `straightLine`

Spec §5:
- Core teaching is **gradient and y-intercept**. The x-intercept is optional
  (`showXIntercept`, default `false`) and never a required stage.
- `focus="compare"` splits by `comparisonRule`, because parallel and
  perpendicular are different learning tasks.
- `parallel` draws **equal rise/run triangles on both lines**, with intercepts
  controlled independently so learners cannot infer that parallel lines must
  have symmetric intercepts.
- `perpendicular` shows the **negative-reciprocal relationship**, gated behind
  the `perpendicularGradients` capability.

- [ ] **Step 1: Append the failing test**

Append to `tests/unit/coordinatePlanePresets.test.js`:

```js
describe('straightLine preset', () => {
  it('states the equation as the heading', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 1 })
    expect(scene.status.heading).toBe('y = 2x + 1')
  })

  it('writes a negative intercept as subtraction', () => {
    const scene = sceneFor('straightLine', { m: 3, c: -4 })
    expect(scene.status.heading).toBe('y = 3x − 4')
  })

  it('omits the intercept term when c is zero', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 0 })
    expect(scene.status.heading).toBe('y = 2x')
  })

  it('explains the gradient as rise over run', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 1 })
    expect(scene.status.calculation.join(' ')).toContain('rise ÷ run = 2 ÷ 1 = 2')
  })

  it('marks the y-intercept as a point', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 1 })
    const intercept = scene.points.find(point => point.id === 'y-intercept')

    expect(intercept).toBeDefined()
    expect(intercept.x).toBe(0)
    expect(intercept.y).toBe(1)
  })

  it('hides the x-intercept unless it is explicitly asked for', () => {
    const withoutFlag = sceneFor('straightLine', { m: 2, c: 4 })
    const withFlag = sceneFor('straightLine', { m: 2, c: 4 }, {
      capabilities: { showXIntercept: true },
    })

    expect(withoutFlag.points.find(p => p.id === 'x-intercept')).toBeUndefined()
    expect(withFlag.points.find(p => p.id === 'x-intercept').x).toBe(-2)
  })

  it('draws a rise/run triangle for the gradient focus', () => {
    const scene = sceneFor('straightLine', { m: 2, c: 1 }, { focus: 'gradient' })
    expect(scene.shapes.find(shape => shape.id === 'rise-run')).toBeDefined()
  })
})

describe('straightLine comparison', () => {
  const compare = (values, comparisonRule, capabilities) =>
    sceneFor('straightLine', values, { focus: 'compare', comparisonRule, capabilities })

  it('draws a second line in the compare focus', () => {
    const scene = compare({ m: 2, c: 1, m2: 2, c2: -3 }, 'parallel')
    expect(scene.shapes.find(shape => shape.id === 'line-2')).toBeDefined()
  })

  it('forces equal gradients and equal rise/run triangles for parallel', () => {
    const scene = compare({ m: 2, c: 1, m2: 5, c2: -3 }, 'parallel')

    expect(scene.status.explanation).toContain('same gradient')
    expect(scene.shapes.filter(shape => shape.id.startsWith('rise-run'))).toHaveLength(2)
  })

  it('keeps parallel intercepts independent rather than mirrored', () => {
    const scene = compare({ m: 2, c: 1, m2: 2, c2: -3 }, 'parallel')
    const intercepts = scene.points
      .filter(point => point.id.startsWith('y-intercept'))
      .map(point => point.y)

    expect(intercepts).toEqual([1, -3])
  })

  it('sets the second gradient to the negative reciprocal for perpendicular', () => {
    const scene = compare(
      { m: 2, c: 1, m2: 9, c2: 0 },
      'perpendicular',
      { perpendicularGradients: true },
    )

    expect(scene.status.calculation.join(' ')).toContain('−1 ÷ 2')
    expect(scene.status.explanation).toContain('negative reciprocal')
  })

  it('falls back to parallel when perpendicular is not available at this tier', () => {
    const scene = compare({ m: 2, c: 1, m2: 9, c2: 0 }, 'perpendicular', {
      perpendicularGradients: false,
    })

    expect(scene.status.explanation).toContain('same gradient')
  })

  it('leaves both lines free in the free comparison rule', () => {
    const scene = compare({ m: 2, c: 1, m2: 5, c2: -3 }, 'free')
    expect(scene.status.heading).toContain('y = 5x')
  })

  // A horizontal line's perpendicular is vertical, which y = mx + c cannot
  // express. Drawing a second horizontal line here would teach the opposite.
  it('refuses to fake a perpendicular for a horizontal line', () => {
    const scene = compare({ m: 0, c: 2, m2: 9, c2: 0 }, 'perpendicular', {
      perpendicularGradients: true,
    })

    expect(scene.shapes.find(shape => shape.id === 'line-2')).toBeUndefined()
    expect(scene.status.explanation).toContain('vertical')
    expect(scene.status.explanation).toContain('cannot be written as y = mx + c')
  })
})

describe('straightLine stays inside the plot', () => {
  it('clips a steep line at the y bounds rather than drawing past them', () => {
    // y = 2x + 1 across x = −5…5 reaches y = ±11 on a y-axis of ±5.
    const scene = sceneFor('straightLine', { m: 2, c: 1 })
    const line = scene.shapes.find(shape => shape.id === 'line-1')
    const coordinates = line.path.match(/-?[\d.]+/g).map(Number)

    for (let index = 1; index < coordinates.length; index += 2) {
      expect(Math.abs(coordinates[index])).toBeLessThanOrEqual(5)
    }
  })

  it('drops a line that misses the plot entirely', () => {
    const preset = resolveCoordinatePlanePreset('straightLine')
    const scene = preset.derive({ m: 0, c: 40 }, {
      focus: 'gradient',
      showGuides: 'active',
      capabilities: preset.capabilities,
      axes: { x: preset.xAxis, y: preset.yAxis },
    })

    expect(scene.shapes.find(shape => shape.id === 'line-1')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js -t straightLine`

Expected: FAIL — preset not registered.

- [ ] **Step 3: Write the preset**

Create `src/components/learning/coordinatePlane/presets/straightLine.js`:

```js
// ─── Preset: straightLine ────────────────────────────────────────────────────
//
// Core teaching is gradient and y-intercept. The x-intercept is available but
// never a required stage — it is a consequence of the equation, not one of its
// two defining numbers.
//
// Parallel and perpendicular are separate learning tasks, so comparisonRule
// splits them rather than a single overloaded "compare" mode. Under 'parallel'
// the second gradient is forced equal and both lines get a rise/run triangle;
// under 'perpendicular' it is forced to the negative reciprocal. Intercepts
// stay independent in both, so nobody infers that parallel lines must have
// mirrored intercepts.

import {
  formatCoordinate,
  lineY,
  perpendicularGradientOf,
  xInterceptOf,
} from '../coordinatePlaneMath.js'
import { clipSegmentToBounds } from '../coordinatePlaneGeometry.js'

const MINUS = '−'

function signed(value) {
  return String(value).replace('-', MINUS)
}

function equationText({ m, c }) {
  const gradient = m === 1 ? 'x' : m === -1 ? `${MINUS}x` : `${signed(m)}x`
  if (c === 0) return `y = ${gradient}`
  return c > 0 ? `y = ${gradient} + ${c}` : `y = ${gradient} ${MINUS} ${Math.abs(c)}`
}

function riseRunShape(id, { m, c }, atX) {
  const fromY = lineY({ m, c }, atX)
  const toY = lineY({ m, c }, atX + 1)
  return {
    id,
    path: `M ${atX} ${fromY} L ${atX + 1} ${fromY} L ${atX + 1} ${toY}`,
    strokeRole: 'ruleLine',
    dashed: true,
    modelPath: true,
  }
}

// Built from the x-axis endpoints, then clipped against BOTH ranges: y = 2x + 1
// across x = −5…5 reaches y = ±11 on a y-axis of ±5, and an unclipped path
// would be drawn far outside the plot.
function lineShape(id, line, axes, role) {
  const clipped = clipSegmentToBounds(
    {
      from: { x: axes.x.min, y: lineY(line, axes.x.min) },
      to: { x: axes.x.max, y: lineY(line, axes.x.max) },
    },
    axes.x,
    axes.y,
  )
  if (!clipped) return null

  return {
    id,
    path: `M ${clipped.from.x} ${clipped.from.y} L ${clipped.to.x} ${clipped.to.y}`,
    strokeRole: role,
    modelPath: true,
  }
}

/**
 * The second line, or null when the requested comparison is impossible.
 *
 * A horizontal line's perpendicular is vertical, and a vertical line has no
 * gradient — it cannot be written as y = mx + c at all. Returning a gradient of
 * 0 there (the earlier design) drew a second horizontal line and taught the
 * exact opposite of the fact being demonstrated, so this returns
 * `{ rule: 'perpendicular', impossible: true }` and the status explains why.
 */
function resolveSecondLine(values, comparisonRule, capabilities) {
  const primary = { m: values.m, c: values.c }

  if (comparisonRule === 'perpendicular' && capabilities.perpendicularGradients) {
    const gradient = perpendicularGradientOf(primary.m)
    if (gradient === null) {
      return { rule: 'perpendicular', impossible: true }
    }
    return { m: gradient, c: values.c2, rule: 'perpendicular', impossible: false }
  }
  if (comparisonRule === 'free') {
    return { m: values.m2, c: values.c2, rule: 'free', impossible: false }
  }
  // Default, and the perpendicular fallback when the tier does not allow it.
  return { m: primary.m, c: values.c2, rule: 'parallel', impossible: false }
}

const straightLinePreset = {
  id: 'straightLine',
  accessibilityLabel: 'Coordinate plane showing the graph of a straight line',
  keyFact: 'y = mx + c: m is the gradient and c is the y-intercept.',
  instruction: 'Use the steppers to change the gradient and the y-intercept.',
  interactive: true,
  supportsShowAllGuides: true,

  canvas: { width: 360, height: 320 },
  padding: { top: 24, right: 28, bottom: 40, left: 40 },
  xAxis: { min: -5, max: 5, step: 1 },
  yAxis: { min: -5, max: 5, step: 1 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: ['gradient', 'intercept', 'compare'],
  defaultFocus: 'gradient',
  defaultActiveId: 'y-intercept',
  capabilities: { showXIntercept: false, perpendicularGradients: false },

  // m and c are stepped, not dragged: GCSE needs exact values, and dragging a
  // line to precisely gradient 2 on a phone is miserable.
  initialValues: { m: 2, c: 1, m2: 1, c2: -3 },
  controls: [
    {
      id: 'm',
      label: 'Gradient',
      min: -5,
      max: 5,
      step: 1,
      valueText: values => `gradient ${values.m}`,
      valueFromPointer: (_point, values) => values.m,
    },
    {
      id: 'c',
      label: 'Y-intercept',
      min: -5,
      max: 5,
      step: 1,
      valueText: values => `y-intercept ${values.c}`,
      valueFromPointer: (_point, values) => values.c,
    },
  ],
  // Both live numbers get a real stepper. The earlier design offered buttons
  // that only *selected* which value to change, with nothing to change it
  // with — the preset was inoperable.
  steppers: [
    { controlId: 'm', label: 'Gradient (m)', group: 'equation' },
    { controlId: 'c', label: 'Y-intercept (c)', group: 'equation' },
  ],

  derive(values, { focus, comparisonRule, capabilities, axes }) {
    const line = { m: values.m, c: values.c }
    const comparing = focus === 'compare'
    const second = comparing
      ? resolveSecondLine(values, comparisonRule, capabilities)
      : null

    const shapes = [lineShape('line-1', line, axes, 'object')].filter(Boolean)
    const points = [{
      id: 'y-intercept',
      x: 0,
      y: line.c,
      text: `y-intercept ${formatCoordinate({ x: 0, y: line.c })}`,
      shortText: `(0, ${signed(line.c)})`,
      role: 'object',
      tier: 'active',
      focusable: false,
    }]

    if (focus === 'gradient' || comparing) {
      shapes.push(riseRunShape('rise-run', line, 0))
    }

    if (comparing && !second.impossible) {
      const secondShape = lineShape('line-2', second, axes, 'image')
      if (secondShape) shapes.push(secondShape)
      // Under 'parallel' both lines get a triangle, so equal steepness is
      // something you see rather than something you are told.
      if (second.rule === 'parallel') {
        shapes.push(riseRunShape('rise-run-2', second, 1))
      }
      points.push({
        id: 'y-intercept-2',
        x: 0,
        y: second.c,
        text: `y-intercept ${formatCoordinate({ x: 0, y: second.c })}`,
        shortText: `(0, ${signed(second.c)})`,
        role: 'image',
        tier: 'related',
        focusable: false,
      })
    }

    if (capabilities.showXIntercept) {
      const xIntercept = xInterceptOf(line)
      if (xIntercept !== null) {
        points.push({
          id: 'x-intercept',
          x: xIntercept,
          y: 0,
          text: `x-intercept ${formatCoordinate({ x: xIntercept, y: 0 })}`,
          shortText: `(${signed(xIntercept)}, 0)`,
          role: 'object',
          tier: 'related',
          focusable: false,
        })
      }
    }

    const calculation = [
      `gradient: rise ÷ run = ${signed(line.m)} ÷ 1 = ${signed(line.m)}`,
      `y-intercept: the line crosses the y-axis at ${signed(line.c)}.`,
    ]
    let explanation = 'The gradient sets the steepness; the y-intercept sets where the line starts.'
    let heading = equationText(line)

    if (comparing && second.impossible) {
      heading = equationText(line)
      explanation = 'A line perpendicular to a horizontal line is vertical, and a vertical line has no gradient — it cannot be written as y = mx + c. Change the gradient to see a perpendicular pair.'
    } else if (comparing) {
      heading = `${equationText(line)}   and   ${equationText(second)}`
      if (second.rule === 'parallel') {
        explanation = 'Both lines have the same gradient, so they are parallel. Their intercepts are set separately and need not match.'
      } else if (second.rule === 'perpendicular') {
        calculation.push(`perpendicular gradient: ${MINUS}1 ÷ ${signed(line.m)} = ${signed(second.m)}`)
        explanation = 'Perpendicular gradients are negative reciprocals: multiply them and you get −1.'
      } else {
        explanation = 'Two independent lines — compare their gradients and their intercepts.'
      }
    }

    return {
      shapes,
      points,
      guides: [],
      handles: [],
      status: { heading, calculation, explanation },
    }
  },

  describe(values, { focus, comparisonRule, capabilities } = {}) {
    const line = { m: values.m, c: values.c }
    if (focus !== 'compare') {
      return `The graph of ${equationText(line)}, crossing the y-axis at ${signed(line.c)} with gradient ${signed(line.m)}.`
    }
    const second = resolveSecondLine(values, comparisonRule, capabilities ?? {})
    return `The graphs of ${equationText(line)} and ${equationText(second)}, shown together for comparison.`
  },
}

export default straightLinePreset
```

- [ ] **Step 4: Register the preset**

In `presets/index.js` add `import straightLinePreset from './straightLine.js'`
and the entry `straightLine: straightLinePreset,`.

- [ ] **Step 5: Run the tests**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js`

Expected: PASS — 42 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/learning/coordinatePlane/presets/straightLine.js \
        src/components/learning/coordinatePlane/presets/index.js \
        tests/unit/coordinatePlanePresets.test.js
git commit -m "Add straightLine preset with split parallel and perpendicular comparison"
```

---

## Task 9: The `tableOfValues` preset

**Files:**
- Create: `src/components/learning/coordinatePlane/presets/tableOfValues.js`
- Modify: `src/components/learning/coordinatePlane/presets/index.js`
- Modify: `tests/unit/coordinatePlanePresets.test.js`

**Interfaces:**
- Consumes: `lineY`, `formatCoordinate` from `coordinatePlaneMath.js`
- Produces: `tableOfValuesPreset` registered as `tableOfValues`

Spec §5 fixes the teaching sequence exactly. **Do not substitute a different
threshold** — the three states are the lesson:

| Points plotted | Line state | What it teaches |
|---|---|---|
| 1 | no line | a single point does not determine a line |
| 2 | provisional **dashed** line | two points define a straight line |
| 3+ | **solid** line | the third coordinate confirms the rule |

Accumulation is mandatory: completed pairs persist as subdued chips, otherwise
the preset is ordinary point plotting with extra arithmetic.

- [ ] **Step 1: Append the failing test**

Append to `tests/unit/coordinatePlanePresets.test.js`:

```js
describe('tableOfValues preset', () => {
  const at = step => sceneFor('tableOfValues', { m: 2, c: 1, step }, {})

  it('shows the substitution for the current x value', () => {
    const scene = at(0)
    expect(scene.status.calculation[0]).toBe('x = −2 → y = 2(−2) + 1 = −3')
  })

  it('plots no line from a single point', () => {
    const scene = at(0)

    expect(scene.points.filter(point => point.id.startsWith('plotted-'))).toHaveLength(1)
    expect(scene.shapes.find(shape => shape.id === 'line')).toBeUndefined()
  })

  it('draws a provisional dashed line once two points exist', () => {
    const scene = at(1)
    const line = scene.shapes.find(shape => shape.id === 'line')

    expect(scene.points.filter(point => point.id.startsWith('plotted-'))).toHaveLength(2)
    expect(line).toBeDefined()
    expect(line.dashed).toBe(true)
  })

  it('makes the line solid once a third point confirms the rule', () => {
    const scene = at(2)
    const line = scene.shapes.find(shape => shape.id === 'line')

    expect(scene.points.filter(point => point.id.startsWith('plotted-'))).toHaveLength(3)
    expect(line.dashed).toBe(false)
  })

  it('keeps the line solid for every later step', () => {
    expect(at(4).shapes.find(shape => shape.id === 'line').dashed).toBe(false)
  })

  it('names each transition so the change reads as confirmation', () => {
    expect(at(0).status.explanation).toContain('One point')
    expect(at(1).status.explanation).toContain('Two points')
    expect(at(2).status.explanation).toContain('confirms')
  })

  it('accumulates completed pairs as a trail', () => {
    const scene = at(3)
    expect(scene.trail.map(item => item.text)).toEqual([
      '(−2, −3)',
      '(−1, −1)',
      '(0, 1)',
      '(1, 3)',
    ])
  })

  it('marks only the newest point active and the rest related', () => {
    const scene = at(2)
    const plotted = scene.points.filter(point => point.id.startsWith('plotted-'))

    expect(plotted.filter(point => point.tier === 'active')).toHaveLength(1)
    expect(plotted.at(-1).tier).toBe('active')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js -t tableOfValues`

Expected: FAIL — preset not registered.

- [ ] **Step 3: Write the preset**

Create `src/components/learning/coordinatePlane/presets/tableOfValues.js`:

```js
// ─── Preset: tableOfValues ───────────────────────────────────────────────────
//
// Stepping through substitutions teaches arithmetic; it does not by itself
// teach that the collection of points creates the line. So the line's
// appearance follows a fixed sequence: nothing from one point, a provisional
// dashed line from two, and a solid line from three, where the third
// coordinate confirms the rule rather than merely being joinable.
//
// Completed pairs persist as a trail. Without it this preset is ordinary point
// plotting with extra arithmetic.

import { formatCoordinate, lineY } from '../coordinatePlaneMath.js'

const MINUS = '−'
const FIRST_X = -2

function signed(value) {
  return String(value).replace('-', MINUS)
}

function bracketed(value) {
  return value < 0 ? `(${signed(value)})` : String(value)
}

function substitutionText({ m, c }, x) {
  const product = m * x
  const total = product + c
  const cTerm = c < 0 ? `${MINUS} ${Math.abs(c)}` : `+ ${c}`
  return `x = ${signed(x)} → y = ${signed(m)}${bracketed(x)} ${cTerm} = ${signed(total)}`
}

function explanationFor(count) {
  if (count <= 1) return 'One point is not enough — a single point does not fix a line.'
  if (count === 2) return 'Two points define a straight line, so the line appears — but only provisionally.'
  return 'The third coordinate confirms the rule: all the points follow y = mx + c, so the line is certain.'
}

const tableOfValuesPreset = {
  id: 'tableOfValues',
  accessibilityLabel: 'Coordinate plane building a straight line from a table of values',
  keyFact: 'Substituting values of x produces coordinates that all lie on one line.',
  instruction: 'Step through the x values and watch the points build the line.',
  interactive: true,
  supportsShowAllGuides: false,

  canvas: { width: 360, height: 330 },
  padding: { top: 24, right: 28, bottom: 52, left: 40 },
  xAxis: { min: -3, max: 3, step: 1 },
  yAxis: { min: -6, max: 8, step: 2 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: [],
  defaultFocus: null,
  defaultActiveId: null,
  capabilities: {},

  initialValues: { m: 2, c: 1, step: 0 },
  controls: [
    {
      id: 'step',
      label: 'Table row',
      min: 0,
      max: 5,
      step: 1,
      valueText: values => `row ${values.step + 1} of 6`,
      valueFromPointer: (_point, values) => values.step,
    },
  ],
  // The only control, and there is no handle for it — without this stepper the
  // preset cannot be operated at all.
  steppers: [{ controlId: 'step', label: 'Table row' }],

  derive(values) {
    const line = { m: values.m, c: values.c }
    const count = values.step + 1

    const plotted = Array.from({ length: count }, (_, index) => {
      const x = FIRST_X + index
      return { x, y: lineY(line, x) }
    })

    const points = plotted.map((point, index) => ({
      id: `plotted-${index}`,
      ...point,
      text: formatCoordinate(point),
      shortText: formatCoordinate(point),
      role: index === count - 1 ? 'object' : 'textMuted',
      tier: index === count - 1 ? 'active' : 'related',
      focusable: false,
    }))

    const shapes = []
    if (count >= 2) {
      const first = plotted[0]
      const last = plotted[count - 1]
      shapes.push({
        id: 'line',
        path: `M ${first.x} ${first.y} L ${last.x} ${last.y}`,
        strokeRole: 'object',
        // Dashed at exactly two points; solid from the third onward.
        dashed: count === 2,
        modelPath: true,
      })
    }

    const current = plotted[count - 1]

    return {
      shapes,
      points,
      guides: [],
      handles: [],
      // The accumulating trail of every pair worked out so far.
      trail: plotted.map((point, index) => ({
        id: `trail-${index}`,
        text: formatCoordinate(point),
      })),
      status: {
        heading: formatCoordinate(current),
        calculation: [substitutionText(line, current.x)],
        explanation: explanationFor(count),
      },
    }
  },

  describe(values) {
    const line = { m: values.m, c: values.c }
    const count = values.step + 1
    const pairs = Array.from({ length: count }, (_, index) => {
      const x = FIRST_X + index
      return formatCoordinate({ x, y: lineY(line, x) })
    }).join(', ')

    return `A table of values for y = ${signed(line.m)}x + ${signed(line.c)} with ${count} point${count === 1 ? '' : 's'} plotted: ${pairs}.`
  },
}

export default tableOfValuesPreset
```

- [ ] **Step 4: Render the trail**

The trail is new scene data. In
`src/components/learning/CoordinatePlaneExplore.jsx`, add this immediately
after the closing `</svg>` tag and before the discrete-choices block:

```jsx
      {(scene.trail ?? []).length > 0 && (
        <div
          data-cp-trail="true"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: SPACING.micro,
            padding: `${SPACING.micro}px ${SPACING.compact}px 0`,
          }}
        >
          {scene.trail.map(item => (
            <span
              key={item.id}
              data-cp-trail-item={item.id}
              style={{
                ...TYPE.caption,
                color: roles.textMuted,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.text}
            </span>
          ))}
        </div>
      )}
```

- [ ] **Step 5: Register the preset**

In `presets/index.js` add `import tableOfValuesPreset from './tableOfValues.js'`
and the entry `tableOfValues: tableOfValuesPreset,`.

- [ ] **Step 6: Run the tests**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js`

Expected: PASS — 50 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/learning/coordinatePlane/presets/tableOfValues.js \
        src/components/learning/coordinatePlane/presets/index.js \
        src/components/learning/CoordinatePlaneExplore.jsx \
        tests/unit/coordinatePlanePresets.test.js
git commit -m "Add tableOfValues preset with accumulating points and staged line"
```

---

## Task 10: The `intersection` preset

**Files:**
- Create: `src/components/learning/coordinatePlane/presets/intersection.js`
- Modify: `src/components/learning/coordinatePlane/presets/index.js`
- Modify: `tests/unit/coordinatePlanePresets.test.js`

**Interfaces:**
- Consumes: `intersectionOf`, `lineY`, `formatCoordinate` from `coordinatePlaneMath.js`
- Produces: `intersectionPreset` registered as `intersection`

Spec §5: the status **explicitly connects the coordinate to satisfying both
equations**, substituting into each. That substitution is what earns the word
"solution"; a highlighted crossing point alone does not.

- [ ] **Step 1: Append the failing test**

```js
describe('intersection preset', () => {
  it('reports the meeting point as the heading', () => {
    const scene = sceneFor('intersection', { m1: 1, c1: 3, m2: -1, c2: 7 })
    expect(scene.status.heading).toBe('(2, 5)')
  })

  it('substitutes the solution into both equations', () => {
    const scene = sceneFor('intersection', { m1: 1, c1: 3, m2: -1, c2: 7 })

    expect(scene.status.calculation[0]).toBe('y = x + 3  →  5 = 2 + 3 ✓')
    expect(scene.status.calculation[1]).toBe('y = −x + 7  →  5 = −2 + 7 ✓')
  })

  it('names the coordinate as the pair satisfying both equations', () => {
    const scene = sceneFor('intersection', { m1: 1, c1: 3, m2: -1, c2: 7 })

    expect(scene.status.explanation)
      .toBe('x = 2 and y = 5 is the only pair that satisfies both equations.')
  })

  it('marks the solution point as active', () => {
    const scene = sceneFor('intersection', { m1: 1, c1: 3, m2: -1, c2: 7 })
    const solution = scene.points.find(point => point.id === 'solution')

    expect(solution.tier).toBe('active')
    expect(solution.role).toBe('solution')
  })

  it('reports parallel lines as having no solution', () => {
    const scene = sceneFor('intersection', { m1: 2, c1: 1, m2: 2, c2: 5 })

    expect(scene.status.heading).toBe('No solution')
    expect(scene.status.explanation).toContain('never meet')
    expect(scene.points.find(point => point.id === 'solution')).toBeUndefined()
  })

  // Equal gradients alone are not "no solution" — same gradient AND same
  // intercept is one line, and every point on it satisfies both equations.
  it('reports coincident lines as having infinitely many solutions', () => {
    const scene = sceneFor('intersection', { m1: 2, c1: 1, m2: 2, c2: 1 })

    expect(scene.status.heading).toBe('Infinitely many solutions')
    expect(scene.status.explanation).toContain('same line')
    expect(scene.points.find(point => point.id === 'solution')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js -t intersection`

Expected: FAIL — preset not registered.

- [ ] **Step 3: Write the preset**

Create `src/components/learning/coordinatePlane/presets/intersection.js`:

```js
// ─── Preset: intersection ────────────────────────────────────────────────────
//
// A highlighted crossing point is a picture. Substituting the coordinate back
// into both equations is what makes it a solution, so the status always shows
// both checks rather than only the coordinate.

import { formatCoordinate, intersectionOf, lineY } from '../coordinatePlaneMath.js'
import { clipSegmentToBounds } from '../coordinatePlaneGeometry.js'

const MINUS = '−'

function signed(value) {
  return String(value).replace('-', MINUS)
}

function equationText({ m, c }) {
  const gradient = m === 1 ? 'x' : m === -1 ? `${MINUS}x` : `${signed(m)}x`
  if (c === 0) return `y = ${gradient}`
  return c > 0 ? `y = ${gradient} + ${c}` : `y = ${gradient} ${MINUS} ${Math.abs(c)}`
}

function substitutionCheck(line, solution) {
  const product = line.m * solution.x
  const productText = line.m === 1
    ? signed(solution.x)
    : line.m === -1
      ? signed(-solution.x)
      : `${signed(line.m)}(${signed(solution.x)})`
  const cTerm = line.c === 0 ? '' : line.c > 0 ? ` + ${line.c}` : ` ${MINUS} ${Math.abs(line.c)}`

  return `${equationText(line)}  →  ${signed(solution.y)} = ${productText}${cTerm} ✓`
}

function lineShape(id, line, axes, role) {
  const clipped = clipSegmentToBounds(
    {
      from: { x: axes.x.min, y: lineY(line, axes.x.min) },
      to: { x: axes.x.max, y: lineY(line, axes.x.max) },
    },
    axes.x,
    axes.y,
  )
  if (!clipped) return null

  return {
    id,
    path: `M ${clipped.from.x} ${clipped.from.y} L ${clipped.to.x} ${clipped.to.y}`,
    strokeRole: role,
    modelPath: true,
  }
}

const intersectionPreset = {
  id: 'intersection',
  accessibilityLabel: 'Coordinate plane showing where two straight lines meet',
  keyFact: 'Two lines meet at the coordinate that satisfies both equations.',
  instruction: 'Change either equation and watch the meeting point move.',
  interactive: true,
  supportsShowAllGuides: false,

  canvas: { width: 360, height: 330 },
  padding: { top: 24, right: 28, bottom: 40, left: 40 },
  xAxis: { min: -4, max: 7, step: 1 },
  yAxis: { min: -2, max: 9, step: 1 },
  grid: { xSubdivisions: 1, ySubdivisions: 1 },

  focusModes: [],
  defaultFocus: null,
  defaultActiveId: 'solution',
  capabilities: {},

  initialValues: { m1: 1, c1: 3, m2: -1, c2: 7 },
  controls: [
    {
      id: 'c1',
      label: 'First line y-intercept',
      min: -4,
      max: 8,
      step: 1,
      valueText: values => `first line intercept ${values.c1}`,
      valueFromPointer: (_point, values) => values.c1,
    },
    {
      id: 'c2',
      label: 'Second line y-intercept',
      min: -4,
      max: 9,
      step: 1,
      valueText: values => `second line intercept ${values.c2}`,
      valueFromPointer: (_point, values) => values.c2,
    },
  ],
  steppers: [
    { controlId: 'c1', label: 'First line (c)', group: 'intercepts' },
    { controlId: 'c2', label: 'Second line (c)', group: 'intercepts' },
  ],

  derive(values, { axes }) {
    const lineA = { m: values.m1, c: values.c1 }
    const lineB = { m: values.m2, c: values.c2 }
    const result = intersectionOf(lineA, lineB)

    const shapes = [
      lineShape('line-a', lineA, axes, 'object'),
      lineShape('line-b', lineB, axes, 'image'),
    ].filter(Boolean)

    // Three outcomes, not two. Coincident lines are the case a two-way check
    // gets silently wrong: it calls one line "parallel with no solution".
    if (result.kind !== 'one') {
      const infinite = result.kind === 'infinite'
      return {
        shapes,
        points: [],
        guides: [],
        handles: [],
        status: {
          heading: infinite ? 'Infinitely many solutions' : 'No solution',
          calculation: [equationText(lineA), equationText(lineB)],
          explanation: infinite
            ? 'Same gradient and same intercept, so these are the same line — every point on it satisfies both equations.'
            : 'Equal gradients with different intercepts mean the lines are parallel, so they never meet and no pair satisfies both.',
        },
      }
    }

    const solution = result.point

    return {
      shapes,
      points: [{
        id: 'solution',
        ...solution,
        text: formatCoordinate(solution),
        shortText: formatCoordinate(solution),
        role: 'solution',
        tier: 'active',
        focusable: false,
      }],
      guides: [
        { id: 'guide-x', from: { x: solution.x, y: 0 }, to: solution, role: 'guideLine' },
        { id: 'guide-y', from: { x: 0, y: solution.y }, to: solution, role: 'guideLine' },
      ],
      handles: [],
      status: {
        heading: formatCoordinate(solution),
        calculation: [
          substitutionCheck(lineA, solution),
          substitutionCheck(lineB, solution),
        ],
        explanation: `x = ${signed(solution.x)} and y = ${signed(solution.y)} is the only pair that satisfies both equations.`,
      },
    }
  },

  describe(values) {
    const lineA = { m: values.m1, c: values.c1 }
    const lineB = { m: values.m2, c: values.c2 }
    const result = intersectionOf(lineA, lineB)

    if (result.kind === 'infinite') {
      return `The graph of ${equationText(lineA)}, drawn twice — both equations describe the same line.`
    }
    if (result.kind === 'none') {
      return `The graphs of ${equationText(lineA)} and ${equationText(lineB)}, which are parallel and never meet.`
    }
    return `The graphs of ${equationText(lineA)} and ${equationText(lineB)}, meeting at ${formatCoordinate(result.point)}.`
  },
}

export default intersectionPreset
```

- [ ] **Step 4: Register the preset**

In `presets/index.js` add `import intersectionPreset from './intersection.js'`
and the entry `intersection: intersectionPreset,`.

- [ ] **Step 5: Run the tests**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js`

Expected: PASS — 55 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/learning/coordinatePlane/presets/intersection.js \
        src/components/learning/coordinatePlane/presets/index.js \
        tests/unit/coordinatePlanePresets.test.js
git commit -m "Add intersection preset connecting the solution to both equations"
```

---

## Task 11: The transformation family

**Files:**
- Create: `src/components/learning/coordinatePlane/presets/transformations.js`
- Modify: `src/components/learning/coordinatePlane/presets/index.js`
- Modify: `tests/unit/coordinatePlanePresets.test.js`

**Interfaces:**
- Consumes: `translatePoint`, `reflectPoint`, `rotatePoint`, `enlargePoint`, `formatCoordinate` from `coordinatePlaneMath.js`
- Produces: named exports `translatePreset`, `reflectPreset`, `rotatePreset`, `enlargePreset`, registered as `translate`, `reflect`, `rotate`, `enlarge`

All four share one factory for the object polygon, vertex labelling (`A` → `A′`)
and coordinate-pair status. They stay separate presets because each has
genuinely different rule geometry and controls.

**All four set `supportsShowAllGuides: false`** — eight labelled points with
eight sets of guide lines is exactly the unreadable figure the annotation
contract exists to prevent.

**Tier capability is data-driven** (spec §5). Capabilities constrain the
*options offered*; unavailable options are **absent, never disabled-and-visible**:

| Capability | Gates |
|---|---|
| `diagonalMirrorLines` | `y = x` and `y = −x` mirror choices |
| `nonOriginCentre` | whether the rotation/enlargement centre may leave the origin |
| `fractionalScaleFactor` | scale factors of ½ and ¼ |
| `negativeScaleFactor` | scale factors of −1 and −2 |

- [ ] **Step 1: Append the failing test**

```js
describe('transformation family', () => {
  // A is (-1, 3); the enlargement object's A is (-1, 2).
  it('translates with positive, negative and zero components', () => {
    const positive = sceneFor('translate', { dx: 3, dy: 2 })
    const negative = sceneFor('translate', { dx: -3, dy: -2 })
    const zero = sceneFor('translate', { dx: 0, dy: 0 })

    expect(positive.points.find(p => p.id === 'image-a').x).toBe(2)
    expect(negative.points.find(p => p.id === 'image-a').x).toBe(-4)
    expect(zero.points.find(p => p.id === 'image-a').x).toBe(-1)
  })

  it('reflects in a vertical mirror line', () => {
    const scene = sceneFor('reflect', { mirrorValue: 2 }, { choices: { mirror: 'vertical' } })
    const imageA = scene.points.find(point => point.id === 'image-a')

    expect(imageA.x).toBe(5)
    expect(imageA.y).toBe(3)
  })

  it('offers diagonal mirror lines only when the tier allows them', () => {
    const preset = resolveCoordinatePlanePreset('reflect')
    const mirrorGroup = group => group.find(item => item.id === 'mirror')

    const foundation = mirrorGroup(preset.resolveOptions({ diagonalMirrorLines: false }))
    const higher = mirrorGroup(preset.resolveOptions({ diagonalMirrorLines: true }))

    expect(foundation.choices.map(choice => choice.id))
      .toEqual(['vertical', 'horizontal'])
    expect(higher.choices.map(choice => choice.id))
      .toEqual(['vertical', 'horizontal', 'yEqualsX', 'yEqualsNegativeX'])
  })

  it('rotates clockwise and anticlockwise through all three angles', () => {
    const clockwise = sceneFor('rotate', { cx: 0, cy: 0 }, {
      choices: { angle: '90', direction: 'clockwise' },
    })
    const anticlockwise = sceneFor('rotate', { cx: 0, cy: 0 }, {
      choices: { angle: '90', direction: 'anticlockwise' },
    })

    expect(clockwise.points.find(p => p.id === 'image-a')).toMatchObject({ x: 3, y: 1 })
    expect(anticlockwise.points.find(p => p.id === 'image-a')).toMatchObject({ x: -3, y: -1 })
  })

  it('rotates about a centre away from the origin when the tier allows it', () => {
    const scene = sceneFor('rotate', { cx: 1, cy: 1 }, {
      choices: { angle: '180', direction: 'clockwise' },
      capabilities: { nonOriginCentre: true },
    })

    expect(scene.points.find(p => p.id === 'image-a')).toMatchObject({ x: 3, y: -1 })
  })

  it('pins the centre to the origin when the tier forbids moving it', () => {
    const preset = resolveCoordinatePlanePreset('rotate')
    const values = clampPresetValues(preset, { cx: 3, cy: 2 })
    const scene = preset.derive(values, {
      activeId: 'a',
      showGuides: 'active',
      capabilities: { nonOriginCentre: false },
      choices: { angle: '180', direction: 'clockwise' },
      axes: { x: preset.xAxis, y: preset.yAxis },
    })

    expect(scene.points.find(point => point.id === 'centre')).toMatchObject({ x: 0, y: 0 })
  })

  it('offers fractional and negative scale factors only when the tier allows', () => {
    const preset = resolveCoordinatePlanePreset('enlarge')
    const ids = capabilities => preset
      .resolveOptions(capabilities)
      .find(group => group.id === 'scaleFactor')
      .choices.map(choice => choice.id)

    expect(ids({})).toEqual(['2', '3'])
    expect(ids({ fractionalScaleFactor: true })).toEqual(['0.5', '2', '3'])
    expect(ids({ fractionalScaleFactor: true, negativeScaleFactor: true }))
      .toEqual(['-2', '-1', '0.5', '2', '3'])
  })

  it('enlarges from a centre by the chosen scale factor', () => {
    const scene = sceneFor('enlarge', { cx: 0, cy: 0 }, { choices: { scaleFactor: '2' } })
    expect(scene.points.find(p => p.id === 'image-a')).toMatchObject({ x: -2, y: 4 })
  })

  it('labels image vertices with a prime', () => {
    const scene = sceneFor('translate', { dx: 3, dy: 2 })
    const imageA = scene.points.find(point => point.id === 'image-a')

    expect(imageA.shortText).toBe("A'")
    expect(imageA.text).toContain("A'")
  })

  it('refuses showGuides="all" so eight points never carry eight guide sets', () => {
    for (const id of ['translate', 'reflect', 'rotate', 'enlarge']) {
      expect(resolveCoordinatePlanePreset(id).supportsShowAllGuides).toBe(false)
    }
  })

  it('keeps exactly one vertex active across the whole family', () => {
    for (const id of ['translate', 'reflect', 'rotate', 'enlarge']) {
      const scene = sceneFor(id, undefined, { activeId: 'b' })
      const active = scene.points.filter(point => point.tier === 'active')

      expect(active).toHaveLength(1)
      expect(active[0].id).toBe('b')
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js -t transformation`

Expected: FAIL — presets not registered.

- [ ] **Step 3: Write the transformation module**

Create `src/components/learning/coordinatePlane/presets/transformations.js`:

```js
// ─── Presets: translate, reflect, rotate, enlarge ────────────────────────────
//
// One factory supplies the object polygon, the A → A' vertex labelling and the
// coordinate-pair status. Each preset then contributes only its own rule
// geometry and controls, which is where the four genuinely differ.
//
// Every preset here sets supportsShowAllGuides: false. Eight labelled points
// each carrying guide lines is precisely the unreadable figure the annotation
// contract exists to prevent.
//
// Tier capability is data-driven: resolveOptions(capabilities) returns only the
// choices this tier may use. Unavailable options are absent, never
// disabled-and-visible.

import {
  enlargePoint,
  formatCoordinate,
  reflectPoint,
  rotatePoint,
  translatePoint,
} from '../coordinatePlaneMath.js'
import { snapToStep } from '../coordinatePlaneGeometry.js'

const MINUS = '−'

function signed(value) {
  return String(value).replace('-', MINUS)
}

// The object triangle for translate, reflect and rotate.
//
// Coordinates and MODEL ranges are chosen together so the IMAGE also stays
// inside the axes at every accepted value — a figure half off the plot teaches
// nothing. tests/architecture/coordinate-plane-visible-bounds.test.js drives
// the model range to its extremes, so widening either without rechecking fails.
//
// The axes are ±10 rather than ±8 so the model range can sit genuinely wider
// than the interaction range. At ±8 visibility would bind first and the model
// limit would collapse back onto the interaction limit — which is the silent
// clamp the two-range contract exists to prevent.
//
// Worst cases on the ±10 axes, using model ranges:
//   translate  image = p + d,        |p|∞ ≤ 3, d ∈ [−7,10]×[−8,7] → ≤ 10
//   reflect    image = 2a − p,       |a| ≤ 3, |p|∞ ≤ 3            → ≤ 9
//   rotate     image = c + R(p − c), |c|∞ ≤ 3                     → ≤ 9
//   enlarge    image = (1−s)c + s·p, |c|∞ ≤ 2, |p|∞ ≤ 2, |s| ≤ 3  → ≤ 10
const OBJECT_VERTICES = [
  { id: 'a', letter: 'A', x: -1, y: 3 },
  { id: 'b', letter: 'B', x: -3, y: 0 },
  { id: 'c', letter: 'C', x: 0, y: -2 },
]

// Enlargement multiplies distance from the centre, so it needs a smaller object
// to stay on the same axes: image = (1 − s)c + s·p, and with |s| ≤ 3, |c|∞ ≤ 1
// and |p|∞ ≤ 2 the worst case is |−2c + 3p| ≤ 2 + 6 = 8.
const ENLARGE_OBJECT_VERTICES = [
  { id: 'a', letter: 'A', x: -1, y: 2 },
  { id: 'b', letter: 'B', x: -2, y: 0 },
  { id: 'c', letter: 'C', x: 0, y: -1 },
]

// Wide enough for every image above, with unit gridlines but labels every 2 so
// a 21-unit axis stays legible at 390px.
const TRANSFORM_AXIS = { min: -10, max: 10, step: 2 }
const TRANSFORM_GRID = { xSubdivisions: 2, ySubdivisions: 2 }

function polygonPath(vertices) {
  return `${vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x} ${v.y}`).join(' ')} Z`
}

function createTransformationPreset({
  id,
  accessibilityLabel,
  keyFact,
  instruction,
  capabilities,
  initialValues,
  controls = [],
  steppers = [],
  vertices = OBJECT_VERTICES,
  optionGroups = () => [],
  transform,
  ruleShapes = () => [],
  rulePoints = () => [],
  statusFor,
  describeFor,
}) {
  return {
    id,
    accessibilityLabel,
    keyFact,
    instruction,
    interactive: true,
    // Eight labelled points — 'all' would be unreadable, so it is refused.
    supportsShowAllGuides: false,

    canvas: { width: 360, height: 340 },
    padding: { top: 24, right: 28, bottom: 40, left: 40 },
    xAxis: { ...TRANSFORM_AXIS },
    yAxis: { ...TRANSFORM_AXIS },
    grid: { ...TRANSFORM_GRID },

    focusModes: [],
    defaultFocus: null,
    defaultActiveId: 'a',
    capabilities,
    initialValues,
    controls,
    steppers,

    resolveOptions(resolvedCapabilities) {
      return optionGroups(resolvedCapabilities ?? {})
    },

    derive(values, context) {
      const { activeId, showGuides, capabilities: caps = {}, choices = {} } = context
      const image = vertices.map(vertex => ({
        ...vertex,
        ...transform(vertex, values, choices, caps),
      }))

      const shapes = [
        {
          id: 'object',
          path: polygonPath(vertices),
          fillRole: 'objectFill',
          strokeRole: 'object',
          modelPath: true,
        },
        {
          id: 'image',
          path: polygonPath(image),
          fillRole: 'imageFill',
          strokeRole: 'image',
          modelPath: true,
        },
        ...ruleShapes(values, choices, caps, { object: vertices, image }),
      ]

      // Exactly one vertex is Active; every other labelled point is Related.
      const tierFor = vertexId => {
        if (showGuides === 'none') return 'related'
        return activeId === vertexId ? 'active' : 'related'
      }

      const points = [
        ...vertices.map(vertex => ({
          id: vertex.id,
          x: vertex.x,
          y: vertex.y,
          text: `${vertex.letter} ${formatCoordinate(vertex)}`,
          shortText: vertex.letter,
          role: 'object',
          tier: tierFor(vertex.id),
          focusable: true,
        })),
        ...image.map(vertex => ({
          id: `image-${vertex.id}`,
          x: vertex.x,
          y: vertex.y,
          text: `${vertex.letter}' ${formatCoordinate(vertex)}`,
          shortText: `${vertex.letter}'`,
          role: 'image',
          tier: tierFor(`image-${vertex.id}`),
          focusable: true,
        })),
        ...rulePoints(values, choices, caps),
      ]

      const activeVertex = vertices.find(vertex => vertex.id === activeId)
      const activeImage = image.find(vertex => vertex.id === activeId)
      const guides = activeVertex && showGuides !== 'none'
        ? [{
            id: 'movement',
            from: { x: activeVertex.x, y: activeVertex.y },
            to: { x: activeImage.x, y: activeImage.y },
            role: 'ruleLine',
          }]
        : []

      return {
        shapes,
        points,
        guides,
        handles: [],
        status: statusFor(values, choices, caps, { object: vertices, image, activeId }),
      }
    },

    describe(values, context = {}) {
      const image = vertices.map(vertex => ({
        ...vertex,
        ...transform(vertex, values, context.choices ?? {}, context.capabilities ?? {}),
      }))
      const objectText = vertices
        .map(vertex => `${vertex.letter} ${formatCoordinate(vertex)}`)
        .join(', ')
      const imageText = image
        .map(vertex => `${vertex.letter}' ${formatCoordinate(vertex)}`)
        .join(', ')

      return `Triangle ABC with vertices at ${objectText}, ${describeFor(values, context.choices ?? {})} to give ${imageText}.`
    },
  }
}

function vertexPairLines(object, image, activeId) {
  const vertex = object.find(item => item.id === activeId) ?? object[0]
  const paired = image.find(item => item.id === vertex.id)
  return [`${vertex.letter} ${formatCoordinate(vertex)} → ${vertex.letter}' ${formatCoordinate(paired)}`]
}

// ─── translate ───────────────────────────────────────────────────────────────

export const translatePreset = createTransformationPreset({
  id: 'translate',
  accessibilityLabel: 'Coordinate plane showing a translation by a column vector',
  keyFact: 'A translation slides every point by the same vector.',
  instruction: 'Change the vector and watch every vertex slide by the same amount.',
  capabilities: {},
  initialValues: { dx: 3, dy: 2 },
  controls: [
    {
      id: 'dx',
      label: 'Vector across',
      min: -7,
      max: 10,
      interactionMin: -4,
      interactionMax: 4,
      step: 1,
      valueText: values => `across ${values.dx}`,
      valueFromPointer: point => snapToStep(point.modelX, 1),
    },
    {
      id: 'dy',
      label: 'Vector up',
      min: -8,
      max: 7,
      interactionMin: -4,
      interactionMax: 4,
      step: 1,
      valueText: values => `up ${values.dy}`,
      valueFromPointer: point => snapToStep(point.modelY, 1),
    },
  ],
  // The two components belong together, so they share one stepper row.
  steppers: [
    { controlId: 'dx', label: 'Across', group: 'vector' },
    { controlId: 'dy', label: 'Up', group: 'vector' },
  ],
  transform: (vertex, values) => translatePoint(vertex, { dx: values.dx, dy: values.dy }),
  statusFor: (values, _choices, _caps, { object, image, activeId }) => ({
    heading: `Vector (${signed(values.dx)}, ${signed(values.dy)})`,
    calculation: vertexPairLines(object, image, activeId),
    explanation: values.dx === 0 && values.dy === 0
      ? 'A zero vector leaves the shape exactly where it was.'
      : 'Every vertex moves by the same vector, so the shape keeps its size and orientation.',
  }),
  describeFor: values => `translated by the vector (${signed(values.dx)}, ${signed(values.dy)})`,
})

// ─── reflect ─────────────────────────────────────────────────────────────────

const MIRROR_CHOICES = {
  vertical: { id: 'vertical', label: 'x = a' },
  horizontal: { id: 'horizontal', label: 'y = b' },
  yEqualsX: { id: 'yEqualsX', label: 'y = x' },
  yEqualsNegativeX: { id: 'yEqualsNegativeX', label: 'y = −x' },
}

function mirrorFrom(choices, values) {
  const type = choices.mirror ?? 'vertical'
  return { type, value: values.mirrorValue }
}

function mirrorLabel(mirror) {
  if (mirror.type === 'vertical') return `x = ${signed(mirror.value)}`
  if (mirror.type === 'horizontal') return `y = ${signed(mirror.value)}`
  return mirror.type === 'yEqualsX' ? 'y = x' : `y = ${MINUS}x`
}

export const reflectPreset = createTransformationPreset({
  id: 'reflect',
  accessibilityLabel: 'Coordinate plane showing a reflection in a mirror line',
  keyFact: 'Each point and its image sit the same distance from the mirror line.',
  instruction: 'Choose a mirror line and watch each vertex flip across it.',
  capabilities: { diagonalMirrorLines: true },
  initialValues: { mirrorValue: 2 },
  controls: [
    {
      id: 'mirrorValue',
      label: 'Mirror line position',
      min: -3,
      max: 3,
      interactionMin: -2,
      interactionMax: 2,
      step: 1,
      valueText: values => `mirror at ${values.mirrorValue}`,
      valueFromPointer: point => snapToStep(point.modelX, 1),
    },
  ],
  steppers: [{ controlId: 'mirrorValue', label: 'Mirror position' }],
  optionGroups: capabilities => [{
    id: 'mirror',
    label: 'Choose a mirror line',
    choices: [
      MIRROR_CHOICES.vertical,
      MIRROR_CHOICES.horizontal,
      ...(capabilities.diagonalMirrorLines
        ? [MIRROR_CHOICES.yEqualsX, MIRROR_CHOICES.yEqualsNegativeX]
        : []),
    ],
  }],
  transform: (vertex, values, choices) => reflectPoint(vertex, mirrorFrom(choices, values)),
  ruleShapes: (values, choices, _caps, _scene) => {
    const mirror = mirrorFrom(choices, values)
    const path = mirror.type === 'vertical'
      ? `M ${mirror.value} -6 L ${mirror.value} 6`
      : mirror.type === 'horizontal'
        ? `M -6 ${mirror.value} L 6 ${mirror.value}`
        : mirror.type === 'yEqualsX'
          ? 'M -6 -6 L 6 6'
          : 'M -6 6 L 6 -6'

    return [{ id: 'mirror-line', path, strokeRole: 'ruleLine', dashed: true, modelPath: true }]
  },
  statusFor: (values, choices, _caps, { object, image, activeId }) => ({
    heading: `Reflection in ${mirrorLabel(mirrorFrom(choices, values))}`,
    calculation: vertexPairLines(object, image, activeId),
    explanation: 'Each point keeps its perpendicular distance from the mirror line, but lands on the other side.',
  }),
  describeFor: (values, choices) => `reflected in the line ${mirrorLabel(mirrorFrom(choices, values))}`,
})

// ─── rotate ──────────────────────────────────────────────────────────────────

function centreFrom(values, capabilities) {
  return capabilities.nonOriginCentre
    ? { x: values.cx, y: values.cy }
    : { x: 0, y: 0 }
}

export const rotatePreset = createTransformationPreset({
  id: 'rotate',
  accessibilityLabel: 'Coordinate plane showing a rotation about a centre',
  keyFact: 'A rotation turns every point about a centre through the same angle.',
  instruction: 'Choose an angle and direction, then watch the shape turn.',
  capabilities: { nonOriginCentre: true },
  initialValues: { cx: 0, cy: 0 },
  controls: [
    {
      id: 'cx',
      label: 'Centre x',
      min: -3,
      max: 3,
      interactionMin: -2,
      interactionMax: 2,
      step: 1,
      valueText: values => `centre x ${values.cx}`,
      valueFromPointer: point => snapToStep(point.modelX, 1),
    },
    {
      id: 'cy',
      label: 'Centre y',
      min: -3,
      max: 3,
      interactionMin: -2,
      interactionMax: 2,
      step: 1,
      valueText: values => `centre y ${values.cy}`,
      valueFromPointer: point => snapToStep(point.modelY, 1),
    },
  ],
  steppers: [
    { controlId: 'cx', label: 'Centre x', group: 'centre' },
    { controlId: 'cy', label: 'Centre y', group: 'centre' },
  ],
  optionGroups: () => [
    {
      id: 'angle',
      label: 'Choose an angle',
      choices: [
        { id: '90', label: '90°' },
        { id: '180', label: '180°' },
        { id: '270', label: '270°' },
      ],
    },
    {
      id: 'direction',
      label: 'Choose a direction',
      choices: [
        { id: 'clockwise', label: 'Clockwise' },
        { id: 'anticlockwise', label: 'Anticlockwise' },
      ],
    },
  ],
  transform: (vertex, values, choices, capabilities) => rotatePoint(
    vertex,
    centreFrom(values, capabilities),
    Number(choices.angle ?? 90),
    choices.direction ?? 'clockwise',
  ),
  rulePoints: (values, _choices, capabilities) => {
    const centre = centreFrom(values, capabilities)
    return [{
      id: 'centre',
      ...centre,
      text: `Centre ${formatCoordinate(centre)}`,
      shortText: 'O',
      role: 'ruleLine',
      tier: 'context',
      focusable: false,
    }]
  },
  statusFor: (values, choices, capabilities, { object, image, activeId }) => {
    const centre = centreFrom(values, capabilities)
    const direction = choices.direction ?? 'clockwise'
    return {
      heading: `${choices.angle ?? 90}° ${direction} about ${formatCoordinate(centre)}`,
      calculation: vertexPairLines(object, image, activeId),
      explanation: 'Every point turns through the same angle about the centre, so distances from the centre are unchanged.',
    }
  },
  describeFor: (values, choices) => `rotated ${choices.angle ?? 90} degrees ${choices.direction ?? 'clockwise'}`,
})

// ─── enlarge ─────────────────────────────────────────────────────────────────

const SCALE_CHOICES = {
  '-2': { id: '-2', label: `${MINUS}2` },
  '-1': { id: '-1', label: `${MINUS}1` },
  '0.5': { id: '0.5', label: '½' },
  2: { id: '2', label: '2' },
  3: { id: '3', label: '3' },
}

export const enlargePreset = createTransformationPreset({
  id: 'enlarge',
  accessibilityLabel: 'Coordinate plane showing an enlargement from a centre',
  keyFact: 'An enlargement multiplies every distance from the centre by the scale factor.',
  instruction: 'Choose a scale factor and follow the rays out from the centre.',
  capabilities: { nonOriginCentre: true, fractionalScaleFactor: false, negativeScaleFactor: false },
  initialValues: { cx: 0, cy: 0 },
  controls: [
    {
      id: 'cx',
      label: 'Centre x',
      min: -2,
      max: 2,
      interactionMin: -1,
      interactionMax: 1,
      step: 1,
      valueText: values => `centre x ${values.cx}`,
      valueFromPointer: point => snapToStep(point.modelX, 1),
    },
    {
      id: 'cy',
      label: 'Centre y',
      min: -2,
      max: 2,
      interactionMin: -1,
      interactionMax: 1,
      step: 1,
      valueText: values => `centre y ${values.cy}`,
      valueFromPointer: point => snapToStep(point.modelY, 1),
    },
  ],
  steppers: [
    { controlId: 'cx', label: 'Centre x', group: 'centre' },
    { controlId: 'cy', label: 'Centre y', group: 'centre' },
  ],
  vertices: ENLARGE_OBJECT_VERTICES,
  optionGroups: capabilities => [{
    id: 'scaleFactor',
    label: 'Choose a scale factor',
    choices: [
      ...(capabilities.negativeScaleFactor ? [SCALE_CHOICES['-2'], SCALE_CHOICES['-1']] : []),
      ...(capabilities.fractionalScaleFactor ? [SCALE_CHOICES['0.5']] : []),
      SCALE_CHOICES[2],
      SCALE_CHOICES[3],
    ],
  }],
  transform: (vertex, values, choices, capabilities) => enlargePoint(
    vertex,
    centreFrom(values, capabilities),
    Number(choices.scaleFactor ?? 2),
  ),
  ruleShapes: (values, _choices, capabilities, { object, image }) => {
    const centre = centreFrom(values, capabilities)
    return object.map((vertex, index) => ({
      id: `ray-${vertex.id}`,
      path: `M ${centre.x} ${centre.y} L ${image[index].x} ${image[index].y}`,
      strokeRole: 'ruleLine',
      dashed: true,
      strokeWidth: 1,
      modelPath: true,
    }))
  },
  rulePoints: (values, _choices, capabilities) => {
    const centre = centreFrom(values, capabilities)
    return [{
      id: 'centre',
      ...centre,
      text: `Centre ${formatCoordinate(centre)}`,
      shortText: 'O',
      role: 'ruleLine',
      tier: 'context',
      focusable: false,
    }]
  },
  statusFor: (values, choices, capabilities, { object, image, activeId }) => {
    const factor = Number(choices.scaleFactor ?? 2)
    const centre = centreFrom(values, capabilities)
    const explanation = factor < 0
      ? 'A negative scale factor sends every point through the centre to the opposite side.'
      : factor < 1
        ? 'A scale factor below 1 still counts as an enlargement — the image is simply smaller.'
        : 'Every distance from the centre is multiplied by the scale factor.'

    return {
      heading: `Scale factor ${signed(factor)} from ${formatCoordinate(centre)}`,
      calculation: vertexPairLines(object, image, activeId),
      explanation,
    }
  },
  describeFor: (values, choices) => `enlarged by scale factor ${signed(Number(choices.scaleFactor ?? 2))}`,
})
```

- [ ] **Step 4: Wire capability-filtered options into the renderer**

Presets in this family compute their options from capabilities, so the
renderer can no longer read `presetConfig.options` directly.

**Ordering matters here.** The `choices` state is declared near the top of the
component, before the `capabilities` memo exists, so it cannot be seeded from
the resolved options. Seed it empty instead and resolve each group's default at
read time.

First, in `src/components/learning/CoordinatePlaneExplore.jsx`, replace the
`choices` state declaration:

```jsx
  const [choices, setChoices] = useState({})
```

Then replace the two `setChoices(...)` lines in the reset effect with:

```jsx
    setChoices({})
```

Next, add this immediately after the `capabilities` memo:

```jsx
  const resolvedOptions = useMemo(
    () => presetConfig.resolveOptions?.(capabilities) ?? presetConfig.options ?? [],
    [presetConfig, capabilities],
  )

  // A group falls back to its first choice until the learner picks one, so a
  // capability change that removes the selected option cannot strand the
  // diagram on a choice this tier no longer offers.
  const chosen = (group) => {
    const selected = choices[group.id]
    return group.choices.some(choice => choice.id === selected)
      ? selected
      : group.choices[0].id
  }
```

Pass the resolved choices into `derive` by replacing the `choices` entry in
`deriveContext`:

```jsx
    choices: Object.fromEntries(resolvedOptions.map(group => [group.id, chosen(group)])),
```

Finally, in the discrete-choices block, map over `resolvedOptions` instead of
`presetConfig.options ?? []`, and replace both `choices[group.id] === choice.id`
comparisons with `chosen(group) === choice.id`.

- [ ] **Step 5: Register all four presets**

In `presets/index.js`:

```js
import {
  enlargePreset,
  reflectPreset,
  rotatePreset,
  translatePreset,
} from './transformations.js'
```

```js
  translate: translatePreset,
  reflect: reflectPreset,
  rotate: rotatePreset,
  enlarge: enlargePreset,
```

- [ ] **Step 6: Run the tests**

Run: `./node_modules/.bin/vitest run --project unit tests/unit/coordinatePlanePresets.test.js`

Expected: PASS — 66 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/learning/coordinatePlane/presets/transformations.js \
        src/components/learning/coordinatePlane/presets/index.js \
        src/components/learning/CoordinatePlaneExplore.jsx \
        tests/unit/coordinatePlanePresets.test.js
git commit -m "Add translate, reflect, rotate and enlarge presets with tier capabilities"
```

---

## Task 12: Control reachability and visible bounds

**Files:**
- Create: `tests/architecture/coordinate-plane-control-reachability.test.js`
- Create: `tests/architecture/coordinate-plane-visible-bounds.test.js`

**Interfaces:**
- Consumes: the whole preset registry
- Produces: no runtime export — enforcement of two contracts that are easy to
  break silently

These two contracts guard the failure modes that do not announce themselves. A
preset with an unreachable control still renders; a figure drawn outside the
axes still passes every arithmetic test. Both look fine in a unit suite and are
useless to a learner.

- [ ] **Step 1: Write the control reachability test**

Create `tests/architecture/coordinate-plane-control-reachability.test.js`:

```js
import { describe, expect, it } from 'vitest'
import {
  COORDINATE_PLANE_PRESETS,
  clampPresetValues,
  interactionRange,
  mergeCapabilities,
  resolvePresetFocus,
} from '../../src/components/learning/coordinatePlane/presets/index.js'

function handleControlIds(preset) {
  const ids = new Set()
  const focusModes = preset.focusModes?.length ? preset.focusModes : [undefined]
  const values = clampPresetValues(preset, preset.initialValues)

  for (const focus of focusModes) {
    const capabilities = mergeCapabilities(preset, {})
    const choices = Object.fromEntries(
      (preset.resolveOptions?.(capabilities) ?? preset.options ?? [])
        .map(group => [group.id, group.choices[0].id]),
    )
    const scene = preset.derive(values, {
      focus: resolvePresetFocus(preset, focus),
      activeId: preset.defaultActiveId,
      showGuides: 'active',
      capabilities,
      choices,
      axes: { x: preset.xAxis, y: preset.yAxis },
      grid: preset.grid,
    })

    for (const handle of scene.handles ?? []) {
      for (const id of handle.controlIds ?? [handle.controlId]) ids.add(id)
    }
  }
  return ids
}

describe.each(Object.entries(COORDINATE_PLANE_PRESETS))(
  'control reachability: %s',
  (presetId, preset) => {
    it('offers a way to change every declared control', () => {
      const viaHandle = handleControlIds(preset)
      const viaStepper = new Set((preset.steppers ?? []).map(item => item.controlId))

      for (const control of preset.controls ?? []) {
        const reachable = viaHandle.has(control.id) || viaStepper.has(control.id)
        expect(
          reachable,
          `${presetId} declares control "${control.id}" but neither a drag handle nor a stepper reaches it`,
        ).toBe(true)
      }
    })

    it('does not declare a stepper for a control that does not exist', () => {
      const controlIds = new Set((preset.controls ?? []).map(control => control.id))

      for (const stepper of preset.steppers ?? []) {
        expect(
          controlIds.has(stepper.controlId),
          `${presetId} declares a stepper for unknown control "${stepper.controlId}"`,
        ).toBe(true)
      }
    })

    it('gives every control the fields the renderer needs', () => {
      for (const control of preset.controls ?? []) {
        expect(typeof control.label, `${presetId}.${control.id}.label`).toBe('string')
        expect(typeof control.step, `${presetId}.${control.id}.step`).toBe('number')
        expect(control.step, `${presetId}.${control.id}.step`).toBeGreaterThan(0)
        expect(typeof control.min, `${presetId}.${control.id}.min`).toBe('number')
        expect(typeof control.max, `${presetId}.${control.id}.max`).toBe('number')
        expect(control.max).toBeGreaterThan(control.min)
        expect(typeof control.valueText, `${presetId}.${control.id}.valueText`).toBe('function')
      }
    })

    it('keeps every interaction range inside its model range', () => {
      for (const control of preset.controls ?? []) {
        const reach = interactionRange(control)

        expect(reach.min, `${presetId}.${control.id} interactionMin`).toBeGreaterThanOrEqual(control.min)
        expect(reach.max, `${presetId}.${control.id} interactionMax`).toBeLessThanOrEqual(control.max)
        expect(reach.max).toBeGreaterThan(reach.min)
      }
    })

    // The corruption this contract exists to prevent: a supplied static figure
    // silently redrawn at whatever value a thumb could have reached.
    it('never clamps a supplied value down to the interaction range', () => {
      for (const control of preset.controls ?? []) {
        const reach = interactionRange(control)
        if (reach.max >= control.max) continue

        const beyondReach = control.max
        const clamped = clampPresetValues(preset, {
          ...preset.initialValues,
          [control.id]: beyondReach,
        })

        expect(
          clamped[control.id],
          `${presetId}.${control.id}: a supplied value of ${beyondReach} was clamped to ${clamped[control.id]}, so static content would render a figure it did not ask for`,
        ).toBe(beyondReach)
      }
    })
  },
)
```

- [ ] **Step 2: Run it and confirm it passes**

Run: `./node_modules/.bin/vitest run --project architecture tests/architecture/coordinate-plane-control-reachability.test.js`

Expected: PASS. If `straightLine`, `tableOfValues`, `intersection` or any
transformation fails, its `steppers` declaration is missing — add it rather
than removing the control.

- [ ] **Step 3: Write the visible bounds test**

Create `tests/architecture/coordinate-plane-visible-bounds.test.js`:

```js
import { describe, expect, it } from 'vitest'
import {
  COORDINATE_PLANE_PRESETS,
  clampPresetValues,
  mergeCapabilities,
  resolvePresetFocus,
} from '../../src/components/learning/coordinatePlane/presets/index.js'

const CAPABILITY_SETS = [
  {},
  { diagonalMirrorLines: true, nonOriginCentre: true },
  { fractionalScaleFactor: true, negativeScaleFactor: true },
  { perpendicularGradients: true, showXIntercept: true },
]

// Every extreme of every control, plus the initial values.
//
// Deliberately uses the MODEL range (control.min / control.max), not the
// interaction range: static and controlled content may supply anything the
// model accepts, so that is the range which must stay visible. Narrowing this
// to the interaction range would leave supplied exam figures unchecked.
function extremeValueSets(preset) {
  const base = clampPresetValues(preset, preset.initialValues)
  const sets = [base]

  for (const control of preset.controls ?? []) {
    sets.push(clampPresetValues(preset, { ...base, [control.id]: control.min }))
    sets.push(clampPresetValues(preset, { ...base, [control.id]: control.max }))
  }

  // All controls at once, both ways — the true worst case for transformations.
  const allMin = { ...base }
  const allMax = { ...base }
  for (const control of preset.controls ?? []) {
    allMin[control.id] = control.min
    allMax[control.id] = control.max
  }
  sets.push(clampPresetValues(preset, allMin))
  sets.push(clampPresetValues(preset, allMax))

  return sets
}

function pathCoordinates(path) {
  const numbers = path.match(/-?[\d.]+/g)?.map(Number) ?? []
  const points = []
  for (let index = 0; index + 1 < numbers.length; index += 2) {
    points.push({ x: numbers[index], y: numbers[index + 1] })
  }
  return points
}

describe.each(Object.entries(COORDINATE_PLANE_PRESETS))(
  'visible bounds: %s',
  (presetId, preset) => {
    it('keeps the whole figure inside the axes at every reachable value', () => {
      const focusModes = preset.focusModes?.length ? preset.focusModes : [undefined]

      for (const focus of focusModes) {
        for (const caps of CAPABILITY_SETS) {
          for (const values of extremeValueSets(preset)) {
            const capabilities = mergeCapabilities(preset, caps)
            const choices = Object.fromEntries(
              (preset.resolveOptions?.(capabilities) ?? preset.options ?? [])
                .map(group => [group.id, group.choices.at(-1).id]),
            )
            const axes = { x: preset.xAxis, y: preset.yAxis }
            const scene = preset.derive(values, {
              focus: resolvePresetFocus(preset, focus),
              activeId: preset.defaultActiveId,
              showGuides: 'active',
              capabilities,
              choices,
              axes,
              grid: preset.grid,
            })

            const label = `${presetId} focus=${focus} values=${JSON.stringify(values)}`

            for (const point of scene.points) {
              expect(point.x, `${label} point ${point.id}.x`).toBeGreaterThanOrEqual(axes.x.min)
              expect(point.x, `${label} point ${point.id}.x`).toBeLessThanOrEqual(axes.x.max)
              expect(point.y, `${label} point ${point.id}.y`).toBeGreaterThanOrEqual(axes.y.min)
              expect(point.y, `${label} point ${point.id}.y`).toBeLessThanOrEqual(axes.y.max)
            }

            // Model-space paths must already be clipped; the SVG clip path is
            // a safety net, not the mechanism.
            for (const shape of scene.shapes.filter(item => item.modelPath)) {
              for (const point of pathCoordinates(shape.path)) {
                expect(point.x, `${label} shape ${shape.id}.x`).toBeGreaterThanOrEqual(axes.x.min)
                expect(point.x, `${label} shape ${shape.id}.x`).toBeLessThanOrEqual(axes.x.max)
                expect(point.y, `${label} shape ${shape.id}.y`).toBeGreaterThanOrEqual(axes.y.min)
                expect(point.y, `${label} shape ${shape.id}.y`).toBeLessThanOrEqual(axes.y.max)
              }
            }

            for (const guide of scene.guides ?? []) {
              for (const point of [guide.from, guide.to]) {
                expect(point.x, `${label} guide ${guide.id}.x`).toBeGreaterThanOrEqual(axes.x.min)
                expect(point.x, `${label} guide ${guide.id}.x`).toBeLessThanOrEqual(axes.x.max)
                expect(point.y, `${label} guide ${guide.id}.y`).toBeGreaterThanOrEqual(axes.y.min)
                expect(point.y, `${label} guide ${guide.id}.y`).toBeLessThanOrEqual(axes.y.max)
              }
            }
          }
        }
      }
    })
  },
)
```

- [ ] **Step 4: Run it and fix any preset that escapes its axes**

Run: `./node_modules/.bin/vitest run --project architecture tests/architecture/coordinate-plane-visible-bounds.test.js`

Expected: PASS. A failure names the preset, focus and exact values. Fix it by
tightening the control range or widening the preset's axes — **never** by
loosening the test, and never by rescaling axes dynamically during a drag,
which makes the grid move under the learner's finger.

- [ ] **Step 5: Commit**

```bash
git add tests/architecture/coordinate-plane-control-reachability.test.js \
        tests/architecture/coordinate-plane-visible-bounds.test.js
git commit -m "Enforce coordinate plane control reachability and visible bounds"
```

---

## Task 13: The annotation contract architecture test

**Files:**
- Create: `tests/architecture/coordinate-plane-annotation-contract.test.js`
- Modify: `src/components/learning/coordinatePlane/presets/straightLine.js`
- Modify: `src/components/learning/coordinatePlane/presets/tableOfValues.js`
- Modify: `src/components/learning/coordinatePlane/presets/intersection.js`

**Interfaces:**
- Consumes: the whole preset registry
- Produces: no runtime export — this task's deliverable is enforcement

This is spec §2 and §11. The test validates the **annotation state model
returned by `derive()`** — never SVG element counts, rendered positions or
visual geometry, which would break on ordinary rendering changes.

Expect this test to **fail on three presets** when first run. `straightLine`,
`tableOfValues` and `intersection` each hardcode an `active` tier without
consulting `showGuides`, so they still mark a point active under
`showGuides="none"`. That is exactly the drift the contract exists to catch,
and Step 3 fixes it.

- [ ] **Step 1: Write the contract test**

Create `tests/architecture/coordinate-plane-annotation-contract.test.js`:

```js
import { describe, expect, it } from 'vitest'
import {
  COORDINATE_PLANE_PRESETS,
  clampPresetValues,
  mergeCapabilities,
  resolvePresetFocus,
  resolveShowGuides,
} from '../../src/components/learning/coordinatePlane/presets/index.js'

const TIERS = ['active', 'related', 'context']
const SHOW_GUIDES = ['active', 'all', 'none']

// Capability combinations that widen the reachable state space. Presets ignore
// keys they do not use, so one list covers the whole registry.
const CAPABILITY_SETS = [
  {},
  { diagonalMirrorLines: true, nonOriginCentre: true },
  { fractionalScaleFactor: true, negativeScaleFactor: true },
  { perpendicularGradients: true, showXIntercept: true },
]

const COMPARISON_RULES = [undefined, 'parallel', 'perpendicular', 'free']

/**
 * Every state a learner can actually reach: each focus mode, each showGuides
 * value, each capability set, each comparison rule, and each point offered as
 * the active one.
 */
function reachableStates(preset) {
  const focusModes = preset.focusModes?.length ? preset.focusModes : [undefined]
  const values = clampPresetValues(preset, preset.initialValues)
  const states = []

  for (const focus of focusModes) {
    for (const requested of SHOW_GUIDES) {
      for (const caps of CAPABILITY_SETS) {
        for (const comparisonRule of COMPARISON_RULES) {
          const capabilities = mergeCapabilities(preset, caps)
          const showGuides = resolveShowGuides(preset, requested)
          const choices = Object.fromEntries(
            (preset.resolveOptions?.(capabilities) ?? preset.options ?? [])
              .map(group => [group.id, group.choices[0].id]),
          )

          const context = {
            focus: resolvePresetFocus(preset, focus),
            comparisonRule,
            activeId: preset.defaultActiveId,
            showGuides,
            capabilities,
            choices,
            axes: { x: preset.xAxis, y: preset.yAxis },
            grid: preset.grid,
          }

          states.push({ context, scene: preset.derive(values, context), requested })

          // Also exercise activation of each focusable point in turn.
          const base = preset.derive(values, context)
          for (const point of base.points.filter(item => item.focusable)) {
            const moved = { ...context, activeId: point.id }
            states.push({ context: moved, scene: preset.derive(values, moved), requested })
          }
        }
      }
    }
  }
  return states
}

describe.each(Object.entries(COORDINATE_PLANE_PRESETS))(
  'annotation contract: %s',
  (presetId, preset) => {
    const states = reachableStates(preset)

    it('reaches at least one state', () => {
      expect(states.length).toBeGreaterThan(0)
    })

    it('declares a tier on every annotated element', () => {
      for (const { scene } of states) {
        for (const point of scene.points) {
          expect(
            point.tier,
            `${presetId} point "${point.id}" carries annotation without a tier`,
          ).toBeDefined()
        }
      }
    })

    it('uses only the three permitted tiers', () => {
      for (const { scene } of states) {
        for (const point of scene.points) {
          expect(TIERS, `${presetId} point "${point.id}"`).toContain(point.tier)
        }
      }
    })

    it('keeps exactly one element active under the default policy', () => {
      const defaults = states.filter(state => state.context.showGuides === 'active')

      for (const { scene, context } of defaults) {
        const active = scene.points.filter(point => point.tier === 'active')
        const activatable = scene.points.some(point => point.focusable)

        // A preset with no focusable point may legitimately have none active.
        const allowed = activatable ? [1] : [0, 1]
        expect(
          allowed,
          `${presetId} has ${active.length} active elements with activeId="${context.activeId}"`,
        ).toContain(active.length)
      }
    })

    it('marks nothing active when guides are switched off', () => {
      for (const { scene, context } of states.filter(s => s.context.showGuides === 'none')) {
        const active = scene.points.filter(point => point.tier === 'active')

        expect(
          active.map(point => point.id),
          `${presetId} still marks points active under showGuides="none"`,
        ).toEqual([])
      }
    })

    it('emits guides only when something is active', () => {
      for (const { scene } of states) {
        if ((scene.guides ?? []).length === 0) continue
        const active = scene.points.filter(point => point.tier === 'active')

        expect(
          active.length,
          `${presetId} emits guides with no active element`,
        ).toBeGreaterThan(0)
      }
    })

    it('emits no guides at all when guides are switched off', () => {
      for (const { scene } of states.filter(s => s.context.showGuides === 'none')) {
        expect(scene.guides ?? []).toEqual([])
      }
    })

    it('only exceeds one active element under an explicit broader policy', () => {
      for (const { scene, context } of states) {
        const active = scene.points.filter(point => point.tier === 'active')
        if (active.length <= 1) continue

        expect(
          context.showGuides,
          `${presetId} has ${active.length} active elements outside showGuides="all"`,
        ).toBe('all')
        expect(
          preset.supportsShowAllGuides,
          `${presetId} reached showGuides="all" without declaring support`,
        ).toBe(true)
      }
    })

    it('never resolves to the broader policy when it declares no support', () => {
      if (preset.supportsShowAllGuides !== false) return

      for (const { scene, requested } of states.filter(s => s.requested === 'all')) {
        const active = scene.points.filter(point => point.tier === 'active')
        expect(active.length).toBeLessThanOrEqual(1)
      }
    })
  },
)
```

- [ ] **Step 2: Run the test and confirm the expected failures**

Run: `./node_modules/.bin/vitest run --project architecture tests/architecture/coordinate-plane-annotation-contract.test.js`

Expected: FAIL — `straightLine`, `tableOfValues` and `intersection` each fail
`marks nothing active when guides are switched off`. Confirm all three appear
before making any change; if only some fail, the reachable-state enumeration is
not covering `showGuides="none"`.

- [ ] **Step 3: Make the three presets honour `showGuides`**

In `straightLine.js`, change the `derive` signature to accept `showGuides` and
replace the hardcoded y-intercept tier:

```js
  derive(values, { focus, comparisonRule, capabilities, axes, showGuides }) {
```

```js
    const interceptTier = showGuides === 'none' ? 'related' : 'active'
```

Then use `tier: interceptTier` for the `y-intercept` point.

In `tableOfValues.js`, change `derive(values)` to `derive(values, { showGuides })`
and replace the newest-point tier:

```js
      tier: index === count - 1 && showGuides !== 'none' ? 'active' : 'related',
```

In `intersection.js`, change `derive(values, { axes })` to
`derive(values, { axes, showGuides })`, then set the solution's tier and drop
its guides when off:

```js
      points: [{
        id: 'solution',
        ...solution,
        text: formatCoordinate(solution),
        shortText: formatCoordinate(solution),
        role: 'solution',
        tier: showGuides === 'none' ? 'related' : 'active',
        focusable: false,
      }],
      guides: showGuides === 'none' ? [] : [
        { id: 'guide-x', from: { x: solution.x, y: 0 }, to: solution, role: 'guideLine' },
        { id: 'guide-y', from: { x: 0, y: solution.y }, to: solution, role: 'guideLine' },
      ],
```

- [ ] **Step 4: Run the contract test to verify it passes**

Run: `./node_modules/.bin/vitest run --project architecture tests/architecture/coordinate-plane-annotation-contract.test.js`

Expected: PASS — 9 assertions across all 9 presets.

- [ ] **Step 5: Run the full unit suite for regressions**

Run: `./node_modules/.bin/vitest run --project unit`

Expected: PASS. The preset tests from Tasks 5–11 still pass, because none of
them asserts on `showGuides="none"` for the three changed presets except the
`plotPoint` case, which already honoured it.

- [ ] **Step 6: Commit**

```bash
git add tests/architecture/coordinate-plane-annotation-contract.test.js \
        src/components/learning/coordinatePlane/presets/straightLine.js \
        src/components/learning/coordinatePlane/presets/tableOfValues.js \
        src/components/learning/coordinatePlane/presets/intersection.js
git commit -m "Enforce the coordinate plane annotation contract across all presets"
```

---

## Task 14: Stories for every preset

**Files:**
- Modify: `src/components/learning/CoordinatePlaneExplore.stories.jsx`

**Interfaces:**
- Consumes: the finished component and all nine presets
- Produces: browser-verified coverage of every preset, both modes, keyboard operation and capability gating

- [ ] **Step 1: Append the remaining stories**

Append to `src/components/learning/CoordinatePlaneExplore.stories.jsx`:

```jsx
export const Quadrants = {
  args: { preset: 'plotPoint', focus: 'quadrants' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('IV  (+, −)')).toBeVisible()
    await expect(canvas.getByText(/Quadrant IV/)).toBeVisible()
    expectMobileContainment(canvasElement)
  },
}

export const Midpoint = {
  args: { preset: 'midpoint' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('(1, 3)')).toBeVisible()
    await expect(canvas.getByText('x: (−3 + 5) ÷ 2 = 1')).toBeVisible()
    await expect(canvas.getByText('y: (1 + 5) ÷ 2 = 3')).toBeVisible()
  },
}

export const StraightLine = {
  args: { preset: 'straightLine' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('y = 2x + 1')).toBeVisible()
    await expect(canvas.getByText(/rise ÷ run = 2 ÷ 1 = 2/)).toBeVisible()
  },
}

export const ParallelLines = {
  args: { preset: 'straightLine', focus: 'compare', comparisonRule: 'parallel' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText(/same gradient/)).toBeVisible()
    // Both lines carry a rise/run triangle, so equal steepness is seen.
    expect(canvasElement.querySelectorAll('[data-cp-shape^="rise-run"]')).toHaveLength(2)
  },
}

export const PerpendicularLines = {
  args: {
    preset: 'straightLine',
    focus: 'compare',
    comparisonRule: 'perpendicular',
    difficultyCapabilities: { perpendicularGradients: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/negative reciprocal/)).toBeVisible()
  },
}

export const TableOfValues = {
  args: { preset: 'tableOfValues' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const step = canvas.getByRole('slider', { name: 'Table row' })
    const next = canvas.getByRole('button', { name: 'Increase Table row' })

    // One point: no line at all.
    await expect(canvas.getByText(/One point is not enough/)).toBeVisible()
    expect(canvasElement.querySelector('[data-cp-shape="line"]')).toBeNull()

    // Two points: a provisional dashed line. Driven through the real stepper
    // button, because that is how a learner reaches this control.
    await userEvent.click(next)
    await expect(step).toHaveAttribute('aria-valuenow', '1')
    await expect(canvas.getByText(/Two points define a straight line/)).toBeVisible()
    expect(canvasElement.querySelector('[data-cp-shape="line"]')
      ?.getAttribute('stroke-dasharray')).toBe('6 5')

    // Three points: the rule is confirmed and the line goes solid.
    await userEvent.click(next)
    await expect(canvas.getByText(/confirms/)).toBeVisible()
    expect(canvasElement.querySelector('[data-cp-shape="line"]')
      ?.getAttribute('stroke-dasharray')).toBeNull()

    // The accumulating trail is what makes several substitutions worthwhile.
    expect(canvasElement.querySelectorAll('[data-cp-trail-item]')).toHaveLength(3)
  },
}

export const Intersection = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('(2, 5)')).toBeVisible()
    await expect(canvas.getByText('y = x + 3  →  5 = 2 + 3 ✓')).toBeVisible()
    await expect(canvas.getByText(/satisfies both equations/)).toBeVisible()
  },
}

export const Translate = {
  args: { preset: 'translate' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Vector (3, 2)')).toBeVisible()
    expectMobileContainment(canvasElement)
  },
}

export const Reflect = {
  args: { preset: 'reflect' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Reflection in x = 2')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'y = x' }))
    await expect(canvas.getByText('Reflection in y = x')).toBeVisible()
  },
}

export const ReflectFoundationTier = {
  args: {
    preset: 'reflect',
    difficultyCapabilities: { diagonalMirrorLines: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Unavailable options are absent, never disabled-and-visible.
    await expect(canvas.getByRole('button', { name: 'x = a' })).toBeVisible()
    expect(canvas.queryByRole('button', { name: 'y = x' })).toBeNull()
  },
}

export const Rotate = {
  args: { preset: 'rotate' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: '180°' }))
    await expect(canvas.getByText(/180° clockwise about \(0, 0\)/)).toBeVisible()
  },
}

export const Enlarge = {
  args: {
    preset: 'enlarge',
    difficultyCapabilities: { fractionalScaleFactor: true, negativeScaleFactor: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: '½' }))
    await expect(canvas.getByText(/still counts as an enlargement/)).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: '−1' }))
    await expect(canvas.getByText(/opposite side/)).toBeVisible()
  },
}

// A reflection puts eight labelled points on one plane — the state the
// annotation contract exists for.
export const ReflectAnnotationDensity = {
  args: { preset: 'reflect' },
  play: async ({ canvasElement }) => {
    const active = canvasElement.querySelectorAll('[data-cp-tier="active"]')
    expect(active).toHaveLength(1)

    // 'all' is refused by this preset rather than rendered unreadably.
    expect(canvasElement.querySelector('.cp-explore')
      ?.getAttribute('data-cp-show-guides')).toBe('active')
    expectMobileContainment(canvasElement)
  },
}


// ─── Coverage the six blocking defects demanded ──────────────────────────────

// Issue 2: two sequential single-control updates would drop x and keep only y.
export const AtomicDiagonalDrag = {
  args: { preset: 'plotPoint', defaultValue: { x: 1, y: 1 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'x coordinate' })
    const svg = canvasElement.querySelector('svg')
    const box = svg.getBoundingClientRect()

    // Drag diagonally: both coordinates must move together.
    await userEvent.pointer([
      { target: handle, keys: '[MouseLeft>]' },
      { target: svg, coords: { x: box.left + box.width * 0.75, y: box.top + box.height * 0.25 } },
      { keys: '[/MouseLeft]' },
    ])

    const heading = canvasElement.querySelector('[data-cp-status-heading]').textContent
    const [x, y] = heading.replace(/[()]/g, '').split(',').map(part => Number(part.trim().replace('−', '-')))

    expect(x, 'x must change during a diagonal drag').not.toBe(1)
    expect(y, 'y must change during a diagonal drag').not.toBe(1)
  },
}

// Issue 1: every non-drag numeric control must be operable.
export const StraightLineSteppers = {
  args: { preset: 'straightLine' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('y = 2x + 1')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Gradient' }))
    await expect(canvas.getByText('y = 3x + 1')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Y-intercept' }))
    await expect(canvas.getByText('y = 3x')).toBeVisible()

    // Keyboard reaches the same control.
    const gradient = canvas.getByRole('slider', { name: 'Gradient' })
    gradient.focus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(canvas.getByText('y = 2x')).toBeVisible()
  },
}

export const IntersectionSteppers = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('(2, 5)')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Increase First line y-intercept' }))
    await expect(canvas.getByText('(1.5, 5.5)')).toBeVisible()
  },
}

// Issue 5: coincident lines are not "no solution".
export const CoincidentLines = {
  args: { preset: 'intersection', interactive: false, defaultValue: { m1: 1, c1: 3, m2: 1, c2: 3 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Infinitely many solutions')).toBeVisible()
    await expect(canvas.getByText(/same line/)).toBeVisible()
  },
}

export const ParallelNoSolution = {
  args: { preset: 'intersection', interactive: false, defaultValue: { m1: 2, c1: 1, m2: 2, c2: 5 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('No solution')).toBeVisible()
  },
}

// Issue 5: a horizontal line has no representable perpendicular.
export const HorizontalPerpendicular = {
  args: {
    preset: 'straightLine',
    focus: 'compare',
    comparisonRule: 'perpendicular',
    difficultyCapabilities: { perpendicularGradients: true },
    defaultValue: { m: 0, c: 2, m2: 1, c2: 0 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText(/vertical/)).toBeVisible()
    expect(canvasElement.querySelector('[data-cp-shape="line-2"]')).toBeNull()
  },
}

// Issue 4: a steep line must be clipped, not drawn past both y bounds.
export const SteepLineStaysInPlot = {
  args: { preset: 'straightLine', interactive: false, defaultValue: { m: 5, c: 0 } },
  play: async ({ canvasElement }) => {
    const line = canvasElement.querySelector('[data-cp-shape="line-1"]')
    const plot = canvasElement.querySelector('[data-cp-grid] line').getBoundingClientRect()
    const box = line.getBoundingClientRect()

    expect(box.top).toBeGreaterThanOrEqual(plot.top - 1)
    expect(box.bottom).toBeLessThanOrEqual(
      canvasElement.querySelector('svg').getBoundingClientRect().bottom + 1,
    )
  },
}

// Issue 4: the extreme transformation states.
export const MaximumTranslation = {
  args: { preset: 'translate', interactive: false, defaultValue: { dx: 4, dy: 4 } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Vector (4, 4)')).toBeVisible()
    expectMobileContainment(canvasElement)
  },
}

export const MaximumEnlargement = {
  args: {
    preset: 'enlarge',
    interactive: false,
    difficultyCapabilities: { nonOriginCentre: true, negativeScaleFactor: true },
    defaultValue: { cx: -1, cy: -1 },
  },
  play: async ({ canvasElement }) => {
    expectMobileContainment(canvasElement)
  },
}

// Issue 6: coordinate chips must clear the axis numbers, not merely be nudged.
export const LabelsClearAxisNumbers = {
  args: { preset: 'reflect' },
  play: async ({ canvasElement }) => {
    const chips = [...canvasElement.querySelectorAll('[data-cp-point-label]')]
    const ticks = [...canvasElement.querySelectorAll('[data-cp-ticks] text')]

    for (const chip of chips) {
      const a = chip.getBoundingClientRect()
      for (const tick of ticks) {
        const b = tick.getBoundingClientRect()
        const overlaps = a.left < b.right && b.left < a.right
          && a.top < b.bottom && b.top < a.bottom
        expect(overlaps, `chip "${chip.textContent}" overlaps tick "${tick.textContent}"`).toBe(false)
      }
    }
  },
}

// The narrowest supported viewport.
export const NarrowViewport = {
  args: { preset: 'reflect' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    expectMobileContainment(canvasElement, 320)

    // Touch targets survive the narrowest width.
    for (const target of canvasElement.querySelectorAll('button')) {
      const box = target.getBoundingClientRect()
      expect(box.height).toBeGreaterThanOrEqual(43.5)
    }
  },
}

// Subject theming plus axis semantics — the combination that makes this
// genuinely reusable outside Maths rather than merely recoloured.
export const PhysicsDistanceTime = {
  args: {
    preset: 'straightLine',
    subject: 'Physics',
    interactive: false,
    xAxis: { label: 'Time', unit: 's', min: 0, max: 20, step: 5 },
    yAxis: { label: 'Distance', unit: 'm', min: 0, max: 100, step: 20 },
    defaultValue: { m: 4, c: 0 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Time (s)')).toBeVisible()
    await expect(canvas.getByText('Distance (m)')).toBeVisible()

    // Both ranges start at zero, so both axes sit at their edges.
    expect(canvasElement.querySelector('[data-cp-axis="x"]')
      ?.getAttribute('data-cp-axis-placement')).toBe('edge')
    expect(canvasElement.querySelector('[data-cp-axis="y"]')
      ?.getAttribute('data-cp-axis-placement')).toBe('edge')

    expectMobileContainment(canvasElement)
  },
}

// The mixed case per-axis placement exists for: x = 0 at the left edge while
// y = 0 crosses the plot.
export const MixedAxisPlacement = {
  args: {
    preset: 'straightLine',
    interactive: false,
    xAxis: { min: 0, max: 10, step: 2 },
    yAxis: { min: -5, max: 5, step: 1 },
    defaultValue: { m: 1, c: -3 },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-cp-axis="x"]')
      ?.getAttribute('data-cp-axis-placement')).toBe('edge')
    expect(canvasElement.querySelector('[data-cp-axis="y"]')
      ?.getAttribute('data-cp-axis-placement')).toBe('crossing')
  },
}
```

- [ ] **Step 2: Run the storybook suite**

Run: `./node_modules/.bin/vitest run --project storybook -t CoordinatePlaneExplore`

Expected: PASS — 28 stories.

- [ ] **Step 3: Render pass at 390px and 320px**

Run the dev server (`./node_modules/.bin/vite`), open the component review lab,
and screenshot each of the nine presets at **both** 390px and 320px. Check
against `docs/system/GOLD_SCREEN_REGISTER.md` and answer in writing:

1. Does any preset show more than one point with full guide geometry?
2. Does any coordinate label overlap another, or an axis tick label?
3. Does any label degrade to its short form when it did not need to?
4. Does any line, shape or guide leave the plot area?
5. Is every stepper and option button still a 44px target at 320px?
6. Does the status area change height as values change?
7. Does the figure stay within the viewport with no horizontal scroll?

How to act on a failure:

- **1 or 4** — a contract violation. Fix the preset, and add the reproducing
  state to the annotation or visible-bounds test. Never fix it in the renderer.
- **2** — an **obstacle reporting** failure, not a tuning failure. A chip
  overlapping a tick label means that tick's box was not passed to
  `layoutPointLabels`, or was computed at the wrong position. Fix
  `labelObstacles`. Reaching for `CHAR_WIDTH` or `ANCHOR_RADIUS` here hides the
  bug: constants cannot know where an unreported obstacle sits, so the collision
  will return with different data.
- **3** — genuine visual tuning. Adjust the `pointLabelLayout.js` constants and
  re-run Task 4's tests.
- **5, 6 or 7** — a layout regression in the renderer.

- [ ] **Step 4: Commit**

```bash
git add src/components/learning/CoordinatePlaneExplore.stories.jsx
git commit -m "Add CoordinatePlaneExplore stories for every preset and both modes"
```

---

## Task 15: Registry, documentation and final verification

**Files:**
- Modify: `docs/components/COMPONENT_REGISTRY.md`
- Modify: `CLAUDE.md`
- Modify: `src/dev/componentReview/reviewManifestCore.jsx`

**Interfaces:**
- Consumes: the finished component
- Produces: no runtime export — this task makes the component discoverable, so
  the next author finds it instead of building a tenth coordinate diagram

- [ ] **Step 1: Add the Component Registry entry**

In `docs/components/COMPONENT_REGISTRY.md`, insert a new section in
alphabetical position (after `ColSortBlock`, before `ConceptReveal`), matching
the shape of the neighbouring `AreaPerimeterExplore` and `NumberLineExplore`
entries:

```markdown
### CoordinatePlaneExplore

**File:** `src/components/learning/CoordinatePlaneExplore.jsx`
**What it is:** Configuration-driven GCSE coordinate plane — the coordinate-geometry sibling of `AngleExplore`, `AreaPerimeterExplore`, `FractionRatioExplore` and `NumberLineExplore`. One visual grammar runs through every preset: **one plane** (every preset shares an axis system, tick treatment and grid density), **points that carry their coordinates** (a named point is drawn with its coordinate chip — reading a coordinate is never a separate mode), and **a rule made visible as geometry** (across-then-up guides, the rise/run triangle, the mirror line, the centre of rotation, the rays from a centre of enlargement). That third clause is why transformations live here rather than in a separate component: a reflection *is* a rule that moves coordinates, and the movement is the teaching mechanism, not a finished diagram. Nine registered presets — `plotPoint` (drag a point, with `plot`/`read`/`quadrants` focus modes naming the quadrant and its sign pair), `midpoint` (two draggable endpoints, with the x-values and y-values bracketed and averaged *separately* so the formula is read off the picture rather than recalled), `straightLine` (steppers for *m* and *c*, gradient and y-intercept as the core teaching with the x-intercept optional; `focus="compare"` splits by `comparisonRule` into `parallel` — equal rise/run triangles on both lines, intercepts independent — `perpendicular` — the negative-reciprocal relationship, Higher tier only — and `free`), `tableOfValues` (step through integer *x* values; the line follows a fixed teaching sequence — no line from one point, a provisional dashed line from two, a solid line from three where the third coordinate confirms the rule — with completed pairs persisting as a trail), `intersection` (two lines whose meeting point is substituted back into *both* equations, which is what earns the word "solution"), and the four transformations `translate` (positive, negative and zero vector components), `reflect` (vertical, horizontal and diagonal mirror lines), `rotate` (clockwise and anticlockwise, 90°/180°/270°, centre not necessarily at the origin) and `enlarge` (positive integer, fractional and negative scale factors) — plus a compatible-preset-object escape hatch. **A three-tier annotation contract** governs density: *active geometry* (full coordinate chip, guide lines and rule geometry), *related geometry* (compact label only) and *context geometry* (visible but unannotated), with only one point active by default. Presets may opt into a broader static policy via `showGuides="all"` but may not bypass the tiers; transformation presets refuse `"all"` outright, since eight labelled points each carrying guide lines is unreadable on a phone. Point label placement is shared infrastructure that degrades a label to its short form rather than allowing a collision. Axis placement is resolved **per axis** — zero inside the range crosses, a range starting at zero sits at the edge — so positive-only *x* against signed *y* renders correctly. `interactive={false}` gives a static teaching or exam figure that still carries a descriptive `<desc>` of the actual figure state. Drag handles are keyboard-operable `role="slider"` elements with ≥44px hit targets; discrete choices (mirror line, angle, direction, scale factor) are real buttons, never disguised sliders. Respects `prefers-reduced-motion` (and a `reducedMotion` prop override).
**Best used for:** Coordinates and quadrants, midpoints, straight-line graphs and `y = mx + c`, tables of values, parallel and perpendicular gradients, solving simultaneous equations graphically, and all four transformations. Use it when position, movement or the link between a rule and a picture is the learning. Because axis labels, units and independent scales are part of the plane API, it also serves science graphs — `subject="Physics"` with `xAxis={{ label: 'Time', unit: 's', min: 0, max: 20 }}` gives a usable distance–time frame, not merely a recoloured Maths diagram. Questions, predictions, marking, scores and weakness tracking stay outside the component (compose it like `AngleExplore`/`AreaPerimeterExplore`).
**Props:** `preset`, `focus`, `comparisonRule`, `value`/`defaultValue`/`onChange`, `interactive`, `disabled`, `showGuides`, `difficultyCapabilities`, `xAxis`, `yAxis`, `grid`, `subject`, `reducedMotion`, `label`, `showStatus`
**Dependencies:** `SUBJECTS`, `GENERAL` (via `coordinatePlane/coordinatePlaneVisualRoles.js` semantic roles), `TYPE`, `SPACING`, `COMPONENT_SIZE`, `RADII`, `MOTION` (injected animation CSS via `ensureStyles()`, same pattern as `AngleExplore`/`AreaPerimeterExplore`); pure maths in `coordinatePlane/coordinatePlaneMath.js`, geometry in `coordinatePlane/coordinatePlaneGeometry.js`, shared label placement in `coordinatePlane/pointLabelLayout.js`, one file per preset under `coordinatePlane/presets/`
**Closest alternatives:** `GraphView` (interpreting supplied data as a chart — not manipulating a plane); `NumberLineExplore` (position in one dimension); `AngleExplore` (angle facts — do not add coordinate modes to it); `AreaPerimeterExplore` (mensuration); a static figure image (when no interaction is needed and the diagram is one-off).
```

- [ ] **Step 2: Add the CLAUDE.md entry**

In `CLAUDE.md`, in the `src/components/learning/` list, insert in alphabetical
position after `ColSortBlock.jsx` and before `ConceptReveal.jsx`:

```markdown
- `CoordinatePlaneExplore.jsx` — Configuration-driven GCSE coordinate plane (Maths sibling of `AngleExplore`/`AreaPerimeterExplore`/`FractionRatioExplore`/`NumberLineExplore`): one plane, points that carry their coordinates, and a rule made visible as geometry. Nine presets — `plotPoint`, `midpoint`, `straightLine`, `tableOfValues`, `intersection`, `translate`, `reflect`, `rotate`, `enlarge`; `interactive={false}` gives a static teaching/exam diagram. A three-tier annotation contract (active / related / context) keeps only one point fully annotated, enforced by `tests/architecture/coordinate-plane-annotation-contract.test.js`. Axis placement resolves per axis, and the plane API carries axis labels, units and independent scales, so it serves science graphs as well as coordinate geometry. Geometry, maths, label layout and one-file-per-preset live in `src/components/learning/coordinatePlane/`. Page-level questions and marking stay outside the component.
```

- [ ] **Step 3: Add the review manifest entry**

In `src/dev/componentReview/reviewManifestCore.jsx`, add the import beside the
other Maths diagram imports:

```jsx
import CoordinatePlaneExplore from '../../components/learning/CoordinatePlaneExplore.jsx'
```

Then add the manifest entry next to the `number-line-explore` entry:

```jsx
  {
    // Unrouted standalone component (no content type to register yet) —
    // manual classification: the learner moves points, lines and shapes on a
    // coordinate plane and watches the rule respond, with no scoring.
    id: 'coordinate-plane-explore', name: 'CoordinatePlaneExplore', interaction: 'reveal',
    status: 'comparison', subject: 'Maths', renderMode: 'inline',
    function: 'Configuration-driven GCSE coordinate plane — position, quadrants, midpoints, straight-line graphs, tables of values, intersections and the four transformations on one plane with one interaction model. A three-tier annotation contract keeps only one point fully annotated. Page-level questions and marking remain outside the component.',
    usage: 'New component — pending review; not yet routed in ModulePlayer. Review variants cover all nine presets, a static job and a cross-subject science framing.',
    alternative: 'NumberLineExplore (one dimension); GraphView (data charts); AngleExplore (angle facts); AreaPerimeterExplore (mensuration).',
    render: () => <CoordinatePlaneExplore />,
    fixture: null,
    variants: [
      {
        id: 'plot-point',
        label: 'Plot a point',
        description: 'Drag a point and read its coordinate. Guide lines belong to the active point alone.',
        render: () => <CoordinatePlaneExplore preset="plotPoint" />,
      },
      {
        id: 'quadrants',
        label: 'Quadrants',
        description: 'The four quadrants labelled with their sign pairs, named live as the point moves.',
        render: () => <CoordinatePlaneExplore preset="plotPoint" focus="quadrants" />,
      },
      {
        id: 'midpoint',
        label: 'Midpoint',
        description: 'The x-values and y-values bracketed and averaged separately, so the formula is read off the picture.',
        render: () => <CoordinatePlaneExplore preset="midpoint" />,
      },
      {
        id: 'straight-line',
        label: 'Straight line',
        description: 'y = mx + c with the rise/run triangle and the y-intercept marked.',
        render: () => <CoordinatePlaneExplore preset="straightLine" />,
      },
      {
        id: 'parallel',
        label: 'Parallel lines',
        description: 'Equal rise/run triangles on both lines, with intercepts set independently.',
        render: () => (
          <CoordinatePlaneExplore preset="straightLine" focus="compare" comparisonRule="parallel" />
        ),
      },
      {
        id: 'table-of-values',
        label: 'Table of values',
        description: 'One point, no line; two points, a provisional dashed line; three, solid — the third coordinate confirms the rule.',
        render: () => <CoordinatePlaneExplore preset="tableOfValues" />,
      },
      {
        id: 'intersection',
        label: 'Intersection',
        description: 'The meeting point substituted back into both equations, which is what makes it a solution.',
        render: () => <CoordinatePlaneExplore preset="intersection" />,
      },
      {
        id: 'translate',
        label: 'Translate',
        description: 'A column vector sliding every vertex by the same amount.',
        render: () => <CoordinatePlaneExplore preset="translate" />,
      },
      {
        id: 'reflect',
        label: 'Reflect',
        description: 'Vertical, horizontal and diagonal mirror lines. Eight labelled points, one active.',
        render: () => <CoordinatePlaneExplore preset="reflect" />,
      },
      {
        id: 'rotate',
        label: 'Rotate',
        description: 'Clockwise and anticlockwise through 90, 180 and 270 degrees, about any centre.',
        render: () => <CoordinatePlaneExplore preset="rotate" />,
      },
      {
        id: 'enlarge',
        label: 'Enlarge',
        description: 'Rays from the centre, with fractional and negative scale factors gated by tier.',
        render: () => (
          <CoordinatePlaneExplore
            preset="enlarge"
            difficultyCapabilities={{ fractionalScaleFactor: true, negativeScaleFactor: true }}
          />
        ),
      },
      {
        id: 'static-exam',
        label: 'Static exam figure',
        description: 'interactive={false} — no handles, no live region, but a full descriptive summary for screen readers.',
        render: () => (
          <CoordinatePlaneExplore preset="reflect" interactive={false} />
        ),
      },
      {
        id: 'physics-distance-time',
        label: 'Physics distance–time',
        description: 'Cross-subject: axis labels, units and independent scales make a usable science graph, not a recoloured Maths diagram.',
        render: () => (
          <CoordinatePlaneExplore
            preset="straightLine"
            subject="Physics"
            interactive={false}
            xAxis={{ label: 'Time', unit: 's', min: 0, max: 20, step: 5 }}
            yAxis={{ label: 'Distance', unit: 'm', min: 0, max: 100, step: 20 }}
            defaultValue={{ m: 4, c: 0 }}
          />
        ),
      },
    ],
  },
```

- [ ] **Step 4: Run the full verification suite**

Run: `pnpm verify`

This runs `lint`, `test:architecture`, `test:unit`, `test:storybook` and
`build` in sequence.

Expected: all five pass. If `test:architecture` reports a failure in
`content-registry.test.js` or `module-metadata-integrity.test.js`, that is
unrelated to this work — confirm it fails on `origin/main` too before
investigating.

- [ ] **Step 5: Commit**

```bash
git add docs/components/COMPONENT_REGISTRY.md \
        CLAUDE.md \
        src/dev/componentReview/reviewManifestCore.jsx
git commit -m "Register CoordinatePlaneExplore in the component registry and review lab"
```

- [ ] **Step 6: Push**

```bash
git push -u origin main
```

---

## Execution: subagent-driven with mandatory review gates

Tasks 1–4 suit isolated agents well — they are pure modules with no shared
state. Everything after depends on the renderer being correct, so **do not
begin preset batching until the renderer supports both atomic multi-value
dragging and visible numeric steppers.** Four presets are inoperable without
steppers, and a diagonal drag silently loses a coordinate without atomic
updates; batching on top of either would multiply the defect across nine
presets.

**Gate 1 — after Tasks 1–4 (the pure layer).**
Confirm: `clipSegmentToBounds` handles both-bounds, parallel-edge and
entirely-outside cases; `intersectionOf` returns all three kinds;
`perpendicularGradientOf(0)` is `null`; `layoutPointLabels` honours obstacles.
Tasks 1–4 may run as parallel agents; the gate is a single review of all four.

**Gate 2 — after Task 6 (renderer plus numeric-control architecture).** ⛔ Hard stop.
Confirm by inspection, not by test alone:
- `setControlValues` takes a patch and is called **once** per pointer move.
- No `setControlValue` singular remains anywhere.
- Stepper rows render, are keyboard-operable, and have 44px targets.
- The clip path exists and wraps shapes and guides.
- `labelObstacles` is computed and passed to `layoutPointLabels`.
- Controlled and static values are **not** clamped to interaction limits:
  `clampPresetValues` applies `min`/`max` only, while steppers, keyboard and
  drag apply `interactionMin`/`interactionMax`. Verify with a static figure
  supplied a value outside the interaction range — it must render as given.
Do not dispatch any preset task until all six hold.

**Gate 3 — after Task 7 (the first drag preset).**
`midpoint` is the first preset with two multi-control handles. Confirm pointer,
keyboard and `onChange` behaviour: a diagonal drag on each endpoint moves both
coordinates, keyboard stepping reaches the same values, `onChange` fires once
per change with the complete value object, and the visible-bounds test passes
with the corrected `by: 5` example.

**Gate 4 — after Task 8 (the first stepper preset).**
`straightLine` is the first preset with no handles at all. Confirm pointer and
keyboard parity — every value reachable by clicking `−`/`+` is reachable by
arrow keys, and Home/End land on the interaction bounds. Also confirm a steep
line is clipped, and that `m = 0` under `comparisonRule="perpendicular"`
refuses rather than drawing a second horizontal line.

**Gate 5 — after Task 11 (all transformation presets).**
Inspect the maximum states directly: every image must remain visible at each
control's model extreme, annotation density must stay at one active vertex,
each preset must declare `supportsShowAllGuides: false`, and capability-gated
options must be absent rather than disabled.

**Gate 6 — after Task 14 (the final render pass).**
Review all nine presets at 390px and 320px before registry closure in Task 15.
Source and tests alone do not pass this gate.

## Verification summary

| Gate | Command | When |
|---|---|---|
| Unit tests | `./node_modules/.bin/vitest run --project unit` | Tasks 1–5, 7–11 |
| Control reachability | `./node_modules/.bin/vitest run --project architecture` | Task 12 |
| Visible bounds | `./node_modules/.bin/vitest run --project architecture` | Task 12 |
| Annotation contract | `./node_modules/.bin/vitest run --project architecture` | Task 13 |
| Storybook browser tests | `./node_modules/.bin/vitest run --project storybook` | Tasks 6, 14 |
| Production build | `./node_modules/.bin/vite build` | Task 6, Task 15 |
| Render pass at 390px and 320px | manual, component review lab | Task 14 |
| Full suite | `pnpm verify` | Task 15 |

## Out of scope

Per spec §12, none of the following is part of this plan:

- The coordinate table, table-of-values panel, "what's happening" rule card and
  guided step list — separate composable components, built as and when content
  needs them
- `ModulePlayer` block-type routing — the component ships standalone first, as
  `NumberLineExplore` did
- Module content authoring using the component
- A `series` primitive in the scene contract
