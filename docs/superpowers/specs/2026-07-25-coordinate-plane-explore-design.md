# CoordinatePlaneExplore — design

**Date:** 2026-07-25
**Lane:** E (Big Build — new component family)
**Status:** Approved with amendments; scope locked

---

## 1. Why this component exists

`CoordinatePlaneExplore` is the fifth member of the configuration-driven Maths
diagram family (`AngleExplore`, `AreaPerimeterExplore`, `FractionRatioExplore`,
`NumberLineExplore`). Like its siblings it earns single-component status
through one visual grammar shared by every preset:

> **One plane, points that carry their coordinates, and a visible rule that
> moves them.**

- **Same plane** — every preset shares one axis system, tick treatment and grid
  density. Only the axis ranges change.
- **Points carry coordinates** — a named point is drawn with its coordinate
  chip. Reading a coordinate is never a separate mode; it is how points exist.
- **The rule is geometry, not prose** — "across then up", the rise/run
  triangle, the mirror line, the centre of rotation, the rays from a centre of
  enlargement. Each is drawn.

That third clause is why transformations belong here rather than in a separate
component: a reflection *is* a rule that moves coordinates, drawn on the same
plane. The coordinate movement is the teaching mechanism, not a finished
diagram.

### What stays outside

Questions, predictions, marking, scores, hints and weakness tracking are the
composing page's job, exactly as for the four siblings. Surrounding chrome from
the reference designs — coordinate table, table-of-values panel, "what's
happening" rule card, guided step list — will be built as separate composable
components as and when content needs them. They are **not** part of this build.

---

## 2. The annotation contract (the governing constraint)

The largest design risk on a 390px plane is excessive simultaneous annotation.
A reflection preset has four object vertices and four image vertices; drawing
guide lines from all eight is unusable. This is therefore a **hard rule**, not
a guideline, and is enforced by architecture test and render pass.

### The three tiers

| Tier | Name | Content |
|---|---|---|
| **1** | **Active geometry** | Full coordinate chip, guide lines to both axes, and the relevant rule geometry — rise/run triangle, perpendicular distance ticks, rotation arc, enlargement rays, midpoint brackets |
| **2** | **Related geometry** | Compact vertex or coordinate label only |
| **3** | **Context geometry** | The shape or line remains visible, carrying no coordinate annotation |

**Only one point or vertex is Active by default.** Everything else in the
figure resolves to Related or Context.

Presets may explicitly opt into a broader static annotation policy — a
two-point teaching figure may reasonably mark both — but **no preset may bypass
the tier system**. Every annotated element declares its tier; annotation
without a declared tier is a contract violation.

### Activation

- `activeId` is component state.
- Set by: pointer-down on a handle, tap on a named point, or keyboard focus
  moving to a point.
- Presets declare `defaultActiveId`.
- Named points are focusable (`tabIndex=0`) with an accessible name, so
  activation is reachable without a pointer.

### The `showGuides` prop

| Value | Behaviour |
|---|---|
| `"active"` *(default)* | One Active element; all other named points Related |
| `"all"` | Every named point Active — the broader static annotation policy, for teaching figures with few points |
| `"none"` | No Active element; named points Related, everything else Context |

`"all"` is the opt-in broader policy, not an escape from the tiers: elements are
still tier-assigned, there are simply more of them at Active.

Presets declare `supportsShowAllGuides` (default `true`). Transformation
presets set it `false`; the resolver clamps `"all"` to `"active"` and dev-warns
rather than rendering an unreadable figure.

---

## 3. Point label placement — shared infrastructure

Built once in `coordinatePlane/pointLabelLayout.js`, never as preset-specific
offsets. Transformations expose any weakness here immediately, so this is
shared infrastructure from the first commit.

### Algorithm

1. **Candidate anchors.** Each labelled point proposes eight anchor positions
   (NE, NW, SE, SW, N, S, E, W) at a fixed radius. Preference order is derived
   from the point's position relative to the plane centre, so labels point
   outward, away from the figure.
2. **Box estimation.** SVG text cannot be measured before paint, so chip boxes
   are estimated from character count at the label type size — deliberately
   slightly generous, the same trick `NumberLineExplore` uses.
3. **Greedy placement in priority order:** active point → object vertices →
   image vertices → intercepts and derived points. Take the first candidate
   that overlaps no already-placed box, clears the axis tick labels, and stays
   inside the viewBox.
4. **Label degradation, not collision.** If all eight candidates are blocked,
   the chip drops to its shorter form (`A′` rather than `A′ (5, 4)`) and
   re-runs placement. Only if the short form also fails does it take the
   least-overlapping candidate.

Every labelled point therefore supplies both a `text` and a `shortText`.

---

## 4. The plane API — cross-subject from the start

Zero hardcoded colour is necessary but not sufficient for genuine reuse.
A Physics or Biology graph needs axis semantics. These are part of the plane
API from the first build, exposed through preset configuration and static
props.

```js
xAxis={{ label: 'Time', unit: 's', min: 0, max: 20, step: 2 }}
yAxis={{ label: 'Distance', unit: 'm', min: 0, max: 100, step: 10 }}
grid={{ xSubdivisions: 1, ySubdivisions: 1 }}
```

### Derived axis placement — per axis, independently

There is **no public `originPlacement` prop**, and no single combined "origin
placement" concept. A combined concept models the problem incorrectly, because
each axis's placement depends only on its own range.

Each axis is placed independently:

- **Zero falls inside the range** → that axis crosses at zero.
- **The range starts at zero** → that axis sits at the corresponding edge.

This must permit mixed combinations. Positive-only *x* values with signed *y*
values is an ordinary graph: `x = 0` sits at the **left edge** while `y = 0`
**crosses through** the plot. Neither "four quadrants" nor "bottom-left L-frame"
describes that figure, which is precisely why placement is resolved per axis.

Coordinate-geometry presets pass symmetric ranges and get crossed axes on both;
`xAxis={{ min: 0, max: 20 }}, yAxis={{ min: 0, max: 100 }}` gives a
distance–time frame — with no extra flag in either case.

### Independent scales

`scaleX` and `scaleY` are computed independently, so non-equal scales
(20 s against 100 m) work correctly. Model space is always in axis units;
values are never measured back from rendered pixels.

### Continuous series — deliberately not in the contract yet

No `series` primitive ships in this build. An unused, untested contract slot is
speculative API rather than genuine extensibility.

The obligation is on the **internal renderer**, not the contract: line
rendering is written as a general "path through an ordered list of model-space
points" routine rather than assuming two endpoints, so a curve or a second
series can be added without restructuring. The public contract gains a `series`
entry only alongside the first real preset or cross-subject use that exercises
it.

### Axis titles and units

Rendered when supplied: axis title with unit in parentheses, positioned
outside the tick labels. Coordinate-geometry presets supply the bare italic
`x` / `y` instead, as in the reference designs.

---

## 5. Presets

Nine presets. `focus` selects a sub-mode where a preset supports more than one,
matching the `AreaPerimeterExplore` API.

### Position family

**`plotPoint`** — `focus: 'plot' | 'read' | 'quadrants'`
Drag a point across the plane. Live coordinate chip; Active-tier guide lines to
both axes for the active point. `quadrants` labels the four quadrants I–IV
with their sign pairs and names the current one. Guided reading is "across
first, then up or down".

**`midpoint`**
Two draggable endpoints. **The x-values and y-values are paired separately
before averaging** — a horizontal bracket joins the two x-values against the
x-axis showing `(−3 + 5) ÷ 2 = 1`, a vertical bracket does the same for the
y-values, and the midpoint appears where the two results meet. The formula is
read off the picture rather than recalled, so the preset does not become
another memorisation shortcut.

### Straight-line family

**`straightLine`** — `focus: 'gradient' | 'intercept' | 'compare'`,
`comparisonRule: 'parallel' | 'perpendicular' | 'free'`

Steppers for *m* and *c* (not drag — GCSE needs exact values, and dragging to
precisely gradient 2 on a phone is miserable; matches the reference design and
the `FractionRatioExplore` stepper precedent).

Core teaching is **gradient and y-intercept**. The x-intercept is optional
(`showXIntercept`, default `false`) and never a required stage.

`focus="compare"` holds a second line and is split by `comparisonRule`, because
parallel and perpendicular are different learning tasks and a generic compare
mode produces overloaded controls and status text:

- `parallel` — draws **equal rise/run triangles** on both lines. Intercepts are
  controlled independently, so learners cannot infer that parallel lines must
  have opposite or symmetric intercepts.
- `perpendicular` — shows the **negative-reciprocal relationship** as a
  quarter-turn of the rise/run triangle. Higher tier only; gated by
  `difficultyCapabilities`.
- `free` — two unconstrained lines for open comparison.

**`tableOfValues`**
Step along integer *x* values and watch each `(x, y)` satisfy the rule and land
on the line.

**Accumulation is mandatory.** Without it the preset is ordinary point plotting
with extra arithmetic — the learner understands each substitution but misses
that the collection of points *creates* the line. The preset therefore keeps a
compact trail:

- The current step reads `x = −1 → y = 1 → (−1, 1)`.
- Previously completed pairs persist as small subdued chips along the bottom
  edge, beneath the rule.
- Previously plotted points remain on the plane as Related geometry.

**The line's appearance follows an exact teaching sequence**, so that
calculating several values has a visible purpose rather than crossing an
unexplained threshold:

| Points plotted | Line state | What it teaches |
|---|---|---|
| **1** | No line | A single point does not determine a line |
| **2** | **Provisional dashed line** | Two points define a straight line |
| **3+** | **Solid line** | The third coordinate confirms the rule — the points share one rule rather than merely being joinable |

The status explanation names the transition as it happens, so the dashed → solid
change is read as confirmation rather than decoration.

**`intersection`**
Two lines with the meeting point highlighted. The status **explicitly connects
the coordinate to satisfying both equations**, substituting into each:

```
(2, 5)
y = x + 3  →  5 = 2 + 3   ✓
y = −x + 7 →  5 = −2 + 7  ✓
x = 2 and y = 5 is the only pair that satisfies both equations.
```

### Transformation family

Four presets sharing one factory for the object polygon, vertex labelling
(`A` → `A′`) and coordinate-pair status. Separate presets because each has
genuinely different rule geometry and controls. All set
`supportsShowAllGuides: false`.

**`translate`** — column vector with **positive, negative and zero**
components. Movement arrows from each vertex to its image.

**`reflect`** — mirror lines covering **vertical (`x = a`), horizontal
(`y = b`) and diagonal (`y = x`, `y = −x`)**. Perpendicular distance ticks on
the active vertex only.

**`rotate`** — **clockwise and anticlockwise**, **90°, 180° and 270°**, with a
**centre not necessarily at the origin**. Rotation arc drawn for the active
vertex.

**`enlarge`** — **positive integer, fractional and negative** scale factors as
the tier requires. Rays from the centre through each vertex pair.

### Tier capability is data-driven

Course tier is never embedded in the component:

```js
difficultyCapabilities={{
  fractionalScaleFactor: true,
  negativeScaleFactor: false,
  nonOriginCentre: true,
  diagonalMirrorLines: true,
  perpendicularGradients: false,
}}
```

Merged over each preset's defaults. Capabilities constrain the *options
offered* — the enlarge scale-factor list, the reflect mirror-line list, whether
the rotation centre is draggable, whether `comparisonRule="perpendicular"` is
available. Unavailable options are absent, never disabled-and-visible.

---

## 6. Interactive and static modes

`interactive={false}` freezes the figure at the supplied values, hides handles,
removes the interaction instruction, and drops the `aria-live` region — a clean
quiz or exam figure. Same switch as all four siblings.

**Static mode retains meaningful accessible text.** Dropping `aria-live` is
right, but the figure still needs description. Each preset supplies
`describe(values, options)` returning a sentence about the *actual figure
state*, not the preset's generic key fact:

> "Triangle ABC with vertices at (−1, 4), (−3, 1) and (0, −2), reflected in the
> line x = 2 to give A′ (5, 4), B′ (3, 1) and C′ (2, −2)."

This becomes the `<desc>`; `<title>` is the `label` prop or the preset's
accessibility label.

---

## 7. Status area

`result → calculation → explanation`, structurally identical to
`AreaPerimeterExplore`:

```
(3, −2)                                      ← heading
Across 3 (positive x), down 2 (negative y)   ← calculation lines
Quadrant IV: x positive, y negative.         ← explanation
```

Height is reserved so the figure does not jump as values change.

---

## 8. Visual roles

Named for coordinate meaning, never for Maths. Zero hardcoded colours.

| Role | Source |
|---|---|
| `axis` | `GENERAL.diagram.edgePrimary` |
| `gridLine` | subject accent at low alpha |
| `tickLabel`, `axisLabel`, `axisTitle` | `GENERAL.cinematic.textSecondary` |
| `object`, `objectFill` | `subjectTheme.accent` |
| `image`, `imageFill` | `subjectTheme.accentSecondary` |
| `ruleLine`, `guideLine` | `GENERAL.diagram.construction` (dashed) |
| `solution`, `interaction` | `subjectTheme.accent` |
| `focusGlow` | `subjectTheme.glow` |
| `textPrimary`, `textSecondary`, `textMuted` | `GENERAL.cinematic.*` |

Unknown roles resolve through `coordinatePlaneRoleResolver.js`, which dev-warns
and returns `undefined` — the `AreaPerimeterExplore` pattern.

`subject="Physics"` therefore yields a physics-accented distance–time graph
that is genuinely usable, because §4 supplies the axis semantics that colour
alone cannot.

---

## 9. File layout

```
src/components/learning/
  CoordinatePlaneExplore.jsx           renderer, interaction, status
  CoordinatePlaneExplore.stories.jsx
  coordinatePlane/
    coordinatePlaneGeometry.js         model↔pixel mapping, per-axis placement,
                                       ticks, ordered-point path building
    coordinatePlaneMath.js             pure: quadrant, midpoint, line eval, intercepts,
                                       intersection, the four transformations
    pointLabelLayout.js                shared label placement + degradation (§3)
    coordinatePlaneVisualRoles.js      semantic colour roles
    coordinatePlaneRoleResolver.js     unknown-role dev warning
    presets/
      index.js                         registry, resolve, clamp, capability merge
      plotPoint.js
      midpoint.js
      straightLine.js
      tableOfValues.js
      intersection.js
      transformations.js               shared factory + the four presets
```

Neutral geometry helpers are reused from `geometry/shapeGeometry.js` rather
than duplicated.

---

## 10. Public API and scene contract

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `preset` | preset name or compatible object | `'plotPoint'` | Escape hatch matches the siblings |
| `focus` | string | preset's `defaultFocus` | Only where the preset declares `focusModes` |
| `comparisonRule` | `'parallel' \| 'perpendicular' \| 'free'` | `'parallel'` | `straightLine` with `focus="compare"` only; ignored elsewhere |
| `value` / `defaultValue` / `onChange` | value object | — | Controlled and uncontrolled, as `AreaPerimeterExplore` |
| `interactive` | boolean | preset's `interactive` | `false` gives the static figure (§6) |
| `disabled` | boolean | `false` | |
| `showGuides` | `'active' \| 'all' \| 'none'` | `'active'` | Clamped per §2 |
| `difficultyCapabilities` | object | preset defaults | Merged over defaults (§5) |
| `xAxis` / `yAxis` | axis spec | preset's axes | **Shallow-merged over the preset's axes**, so a caller may override `label` and `unit` without restating `min`/`max`/`step` |
| `grid` | `{ xSubdivisions, ySubdivisions }` | preset's grid | Same merge rule |
| `subject` | string | `'Maths'` | Drives all roles (§8) |
| `reducedMotion` | boolean | media query | Override |
| `label` | string | preset's accessibility label | Becomes `<title>` |
| `showStatus` | boolean | `true` | |

Axis and grid resolution is therefore: **preset defaults → props shallow-merged
on top → passed into `derive`**. The preset always supplies a complete axis
spec, so props are never required.

### Scene contract

```js
derive(values, {
  focus,               // resolved focus mode
  comparisonRule,      // resolved; straightLine only
  activeId,            // the element at the Active tier
  showGuides,          // resolved and clamped
  capabilities,        // resolved difficultyCapabilities
  axes,                // resolved x/y axis specs after prop merge
  grid,                // resolved grid after prop merge
}) → {
  axes:     { x: AxisSpec, y: AxisSpec },   // each carries its own placement
  grid:     { xSubdivisions, ySubdivisions },
  shapes:   [{ id, path, fillRole?, strokeRole?, strokeWidth?, dashed? }],
  points:   [{ id, x, y, text, shortText, role, tier, focusable }],
  guides:   [{ id, path, role }],            // Active tier only
  handles:  [{ controlId, x, y }],
  status:   { heading, calculation: string[], explanation },
}
```

Each `AxisSpec` carries `placement: 'crossing' | 'edge'`, derived **per axis**
by the geometry layer from that axis's own resolved range (§4), never chosen by
the preset and never shared between the two axes.

`tier` is `'active' | 'related' | 'context'` and is **required** on every
annotated element — the tier system cannot be bypassed (§2).

Presets also supply `describe(values, options)` (§6) and never name a colour —
they name roles.

---

## 11. Verification

- `vite build` passes
- `vitest run tests/architecture` passes
- New architecture test asserting the annotation contract (§2). It validates
  the **annotation state model returned by `derive()`** — never literal SVG
  element counts, rendered positions or visual geometry, which would be brittle
  against ordinary rendering changes. Across every preset and every reachable
  combination of focus, capabilities and `showGuides`, it asserts:
  1. every annotated element declares a `tier` — no element carries annotation
     without one, so the system cannot be bypassed;
  2. `tier` is one of the three permitted values;
  3. exactly one element is at `active` under the default `showGuides="active"`;
  4. `guides` are emitted only for elements at `active`;
  5. a preset reaching more than one `active` element has explicitly opted into
     the broader static annotation policy via `showGuides="all"`, and declares
     `supportsShowAllGuides`.

  The test therefore constrains the state model, leaving rendering free to change.
- `CoordinatePlaneExplore.stories.jsx` covering all nine presets, both modes,
  keyboard operation, and the capability gating
- Render pass at 390px against the gold register for each preset
- Registry obligations: `docs/components/COMPONENT_REGISTRY.md` entry,
  `CLAUDE.md` learning-component list entry,
  `src/dev/componentReview/reviewManifestCore.jsx` entry with per-preset
  variants

---

## 12. Out of scope

- Coordinate table, table-of-values panel, "what's happening" rule card and
  guided step list — separate composable components, built as needed
- ModulePlayer block-type routing — the component ships standalone first, as
  `NumberLineExplore` did
- Module content authoring using the component
