import { expect, userEvent, within } from 'storybook/test'
import CoordinatePlaneExplore from './CoordinatePlaneExplore.jsx'

// The coordinate is deliberately said twice — once beside the point, once as
// the status heading — and the quadrant sentence appears in both the status
// area and the SVG <desc>. Query those by their data attributes rather than by
// text, so the assertion names which one it means.
function pointLabel(canvasElement, pointId) {
  return canvasElement.querySelector(`[data-cp-point-label="${pointId}"]`)
}

function statusHeading(canvasElement) {
  return canvasElement.querySelector('[data-cp-status-heading]')
}

function statusExplanation(canvasElement) {
  return canvasElement.querySelector('[data-cp-status-explanation]')
}

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

    await expect(pointLabel(canvasElement, 'p')).toHaveTextContent('(3, −2)')
    await expect(statusHeading(canvasElement)).toBeVisible()
    await expect(statusHeading(canvasElement)).toHaveTextContent('(3, −2)')
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/Quadrant IV/)

    handle.focus()
    await userEvent.keyboard('{ArrowLeft>5/}')
    await expect(handle).toHaveAttribute('aria-valuenow', '-2')
    await expect(statusHeading(canvasElement)).toHaveTextContent('(−2, −2)')
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/Quadrant III/)

    await userEvent.keyboard('{Home}')
    await expect(handle).toHaveAttribute('aria-valuenow', '-6')
  },
}

export const PlotPointStatic = {
  args: { interactive: false, defaultValue: { x: -4, y: 3 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(pointLabel(canvasElement, 'p')).toHaveTextContent('(−4, 3)')
    await expect(statusHeading(canvasElement)).toBeVisible()
    await expect(statusHeading(canvasElement)).toHaveTextContent('(−4, 3)')
    await expect(canvas.queryByRole('slider')).toBeNull()

    // Static mode drops aria-live but keeps a descriptive figure summary.
    const description = canvasElement.querySelector('desc')
    await expect(description.textContent).toContain('(−4, 3)')
    await expect(description.textContent).toContain('static illustration')
    expect(canvasElement.querySelector('[data-cp-status-announcement]')).toBeNull()

    expectMobileContainment(canvasElement)
  },
}

// The minus sign is U+2212 throughout the component, so option labels and
// coordinate text must be matched with the same character — a hyphen silently
// matches nothing.
const MINUS = '−'

function calculationText(canvasElement) {
  return [...canvasElement.querySelectorAll('[data-cp-status-calculation]')]
    .map(node => node.textContent)
    .join(' | ')
}

function shapeIds(canvasElement) {
  return [...canvasElement.querySelectorAll('[data-cp-shape]')]
    .map(node => node.getAttribute('data-cp-shape'))
}

// ─── One story per preset ────────────────────────────────────────────────────

export const Quadrants = {
  args: { preset: 'plotPoint', focus: 'quadrants' },
  play: async ({ canvasElement }) => {
    // Four quadrant labels, each carrying its Roman numeral and its sign pair.
    const quadrantLabels = [...canvasElement.querySelectorAll('[data-cp-point-label]')]
      .filter(node => node.getAttribute('data-cp-point-label').startsWith('quadrant-'))
    expect(quadrantLabels).toHaveLength(4)

    expect(pointLabel(canvasElement, 'quadrant-4').textContent).toBe(`IV  (+, ${MINUS})`)
    expect(pointLabel(canvasElement, 'quadrant-2').textContent).toBe(`II  (${MINUS}, +)`)

    // "Quadrant IV" is said in the status area AND in <desc>, so name which.
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/Quadrant IV/)
    expectMobileContainment(canvasElement)
  },
}

export const Midpoint = {
  args: { preset: 'midpoint' },
  play: async ({ canvasElement }) => {
    // Query by data attribute — "(1, 3)" also renders as the M point label.
    expect(statusHeading(canvasElement).textContent).toBe('(1, 3)')

    expect(calculationText(canvasElement)).toContain(`x: (${MINUS}3 + 5) ÷ 2 = 1`)
    expect(calculationText(canvasElement)).toContain('y: (1 + 5) ÷ 2 = 3')

    // Both pairings are bracketed on their own axis.
    expect(shapeIds(canvasElement)).toEqual(
      expect.arrayContaining(['segment', 'bracket-x', 'bracket-y']),
    )
  },
}

export const StraightLine = {
  args: { preset: 'straightLine' },
  play: async ({ canvasElement }) => {
    expect(statusHeading(canvasElement).textContent).toBe('y = 2x + 1')
    expect(calculationText(canvasElement)).toContain('rise ÷ run = 2 ÷ 1 = 2')
  },
}

export const ParallelLines = {
  args: { preset: 'straightLine', focus: 'compare', comparisonRule: 'parallel' },
  play: async ({ canvasElement }) => {
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/same gradient/)
    // Both lines carry a rise/run triangle, so equal steepness is seen.
    expect(canvasElement.querySelectorAll('[data-cp-shape^="rise-run"]')).toHaveLength(2)
    expect(canvasElement.querySelector('[data-cp-shape="line-2"]')).not.toBeNull()
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
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/negative reciprocal/)
    expect(calculationText(canvasElement))
      .toContain(`perpendicular gradient: ${MINUS}1 ÷ 2 = ${MINUS}0.5`)
  },
}

export const TableOfValues = {
  args: { preset: 'tableOfValues' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Exact accessible names: /c/ would match BOTH "Increase Table row" and
    // "Decrease Table row", because the letter appears in each word.
    const step = canvas.getByRole('slider', { name: 'Table row' })
    const next = canvas.getByRole('button', { name: 'Increase Table row' })

    // One point: no line at all.
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/One point is not enough/)
    expect(canvasElement.querySelector('[data-cp-shape="line"]')).toBeNull()

    // Two points: a provisional dashed line. Driven through the real stepper
    // button, because that is how a learner reaches this control.
    await userEvent.click(next)
    await expect(step).toHaveAttribute('aria-valuenow', '1')
    await expect(statusExplanation(canvasElement))
      .toHaveTextContent(/Two points define a straight line/)
    expect(canvasElement.querySelector('[data-cp-shape="line"]')
      ?.getAttribute('stroke-dasharray')).toBe('6 5')

    // Three points: the rule is confirmed and the line goes solid.
    await userEvent.click(next)
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/confirms/)
    expect(canvasElement.querySelector('[data-cp-shape="line"]')
      ?.getAttribute('stroke-dasharray')).toBeNull()

    // The accumulating trail is what makes several substitutions worthwhile.
    expect(canvasElement.querySelectorAll('[data-cp-trail-item]')).toHaveLength(3)
  },
}

export const Intersection = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    expect(statusHeading(canvasElement).textContent).toBe('(2, 5)')

    // Both substitutions, not merely the coordinate.
    expect(calculationText(canvasElement)).toContain('y = x + 3  →  5 = 2 + 3 ✓')
    expect(calculationText(canvasElement)).toContain(`y = ${MINUS}x + 7  →  5 = ${MINUS}2 + 7 ✓`)
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/satisfies both equations/)
  },
}

export const Translate = {
  args: { preset: 'translate' },
  play: async ({ canvasElement }) => {
    // The plan's draft said "Vector (3, 2)"; the built preset heads it
    // "Translation by (3, 2)". Assert what the component actually says.
    expect(statusHeading(canvasElement).textContent).toBe('Translation by (3, 2)')
    expectMobileContainment(canvasElement)
  },
}

export const Reflect = {
  args: { preset: 'reflect' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(statusHeading(canvasElement).textContent).toBe('Reflection in x = 2')
    // Exact name: "y = x" must not also select "y = −x".
    await userEvent.click(canvas.getByRole('button', { name: 'y = x' }))
    expect(statusHeading(canvasElement).textContent).toBe('Reflection in y = x')
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
    expect(canvas.queryByRole('button', { name: `y = ${MINUS}x` })).toBeNull()
  },
}

export const Rotate = {
  args: { preset: 'rotate' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: '180°' }))

    // A half-turn reaches the same image either way, so the direction group
    // withdraws and the heading names no direction.
    expect(statusHeading(canvasElement).textContent).toBe('Rotation 180° about (0, 0)')
    expect(canvas.queryByRole('button', { name: 'Clockwise' })).toBeNull()
    expect(canvas.queryByRole('button', { name: 'Anticlockwise' })).toBeNull()
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
    // The plan drafted /still counts as an enlargement/; the built preset says
    // "it is still called an enlargement".
    await expect(statusExplanation(canvasElement))
      .toHaveTextContent(/still called an enlargement/)

    await userEvent.click(canvas.getByRole('button', { name: `${MINUS}1` }))
    // Drafted as /opposite side/; the built preset says "the other side of the
    // centre".
    await expect(statusExplanation(canvasElement))
      .toHaveTextContent(/other side of the centre/)
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
      // ON THE HANDLE, not the svg — onPointerMove is bound to the handle and
      // events do not propagate from an ancestor down to it.
      {
        target: handle,
        coords: { x: box.left + box.width * 0.75, y: box.top + box.height * 0.25 },
      },
      { target: handle, keys: '[/MouseLeft]' },
    ])

    const heading = statusHeading(canvasElement).textContent
    const [x, y] = heading.replace(/[()]/g, '').split(',')
      .map(part => Number(part.trim().replace(MINUS, '-')))

    expect(x, 'x must change during a diagonal drag').not.toBe(1)
    expect(y, 'y must change during a diagonal drag').not.toBe(1)
  },
}

// Issue 1: every non-drag numeric control must be operable.
export const StraightLineSteppers = {
  args: { preset: 'straightLine' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(statusHeading(canvasElement).textContent).toBe('y = 2x + 1')

    await userEvent.click(canvas.getByRole('button', { name: 'Increase Gradient' }))
    expect(statusHeading(canvasElement).textContent).toBe('y = 3x + 1')

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease Y-intercept' }))
    expect(statusHeading(canvasElement).textContent).toBe('y = 3x')

    // Keyboard reaches the same control.
    const gradient = canvas.getByRole('slider', { name: 'Gradient' })
    gradient.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(statusHeading(canvasElement).textContent).toBe('y = 2x')
  },
}

export const IntersectionSteppers = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(statusHeading(canvasElement).textContent).toBe('(2, 5)')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Increase First line y-intercept' }),
    )
    expect(statusHeading(canvasElement).textContent).toBe('(1.5, 5.5)')
  },
}

// Issue 5: coincident lines are not "no solution".
export const CoincidentLines = {
  args: {
    preset: 'intersection',
    interactive: false,
    defaultValue: { m1: 1, c1: 3, m2: 1, c2: 3 },
  },
  play: async ({ canvasElement }) => {
    expect(statusHeading(canvasElement).textContent).toBe('Infinitely many solutions')
    // /same line/ also matches <desc>, so name the status explanation.
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/same line/)
  },
}

export const ParallelNoSolution = {
  args: {
    preset: 'intersection',
    interactive: false,
    defaultValue: { m1: 2, c1: 1, m2: 2, c2: 5 },
  },
  play: async ({ canvasElement }) => {
    expect(statusHeading(canvasElement).textContent).toBe('No solution')
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/never meet/)
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
    await expect(statusExplanation(canvasElement)).toHaveTextContent(/vertical/)
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
  // The MODEL extreme, not the interaction limit. dx reaches 8 and dy reaches
  // 5 for supplied content; (4, 4) is only as far as a learner can drag.
  args: { preset: 'translate', interactive: false, defaultValue: { dx: 8, dy: 5 } },
  play: async ({ canvasElement }) => {
    expect(statusHeading(canvasElement).textContent).toBe('Translation by (8, 5)')
    expectMobileContainment(canvasElement)
  },
}

export const MaximumEnlargement = {
  args: {
    preset: 'enlarge',
    interactive: false,
    difficultyCapabilities: {
      nonOriginCentre: true,
      fractionalScaleFactor: true,
      negativeScaleFactor: true,
    },
    // Without an explicit scaleFactor this rendered the DEFAULT factor 2, not
    // the maximum. The largest offered factor about a non-origin centre is the
    // state that actually reaches furthest.
    defaultValue: { cx: -1, cy: -1, scaleFactor: '3' },
  },
  play: async ({ canvasElement }) => {
    expect(statusHeading(canvasElement).textContent).toContain('scale factor 3')
    expect(statusHeading(canvasElement).textContent)
      .toContain(`centre (${MINUS}1, ${MINUS}1)`)
    expectMobileContainment(canvasElement)
  },
}

// Issue 6: coordinate chips must clear the axis numbers, not merely be nudged.
export const LabelsClearAxisNumbers = {
  args: { preset: 'reflect' },
  play: async ({ canvasElement }) => {
    const chips = [...canvasElement.querySelectorAll('[data-cp-point-label]')]
    const ticks = [...canvasElement.querySelectorAll('[data-cp-ticks] text')]

    expect(chips.length).toBeGreaterThan(0)
    expect(ticks.length).toBeGreaterThan(0)

    for (const chip of chips) {
      const a = chip.getBoundingClientRect()
      for (const tick of ticks) {
        const b = tick.getBoundingClientRect()
        const overlaps = a.left < b.right && b.left < a.right
          && a.top < b.bottom && b.top < a.bottom
        expect(
          overlaps,
          `chip "${chip.textContent}" overlaps tick "${tick.textContent}"`,
        ).toBe(false)
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

    // Touch targets survive the narrowest width — every interactive element,
    // not only the buttons. The stepper value is a focusable slider too.
    const interactive = canvasElement.querySelectorAll('button, [role="slider"]')
    expect(interactive.length).toBeGreaterThan(0)

    for (const target of interactive) {
      const box = target.getBoundingClientRect()
      expect(box.height, `${target.getAttribute('aria-label') ?? target.textContent} height`)
        .toBeGreaterThanOrEqual(43.5)
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
    expect(canvasElement.querySelector('[data-cp-axis-title="x"]').textContent)
      .toBe('Time (s)')
    expect(canvasElement.querySelector('[data-cp-axis-title="y"]').textContent)
      .toBe('Distance (m)')

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

// ─── Render pass: one demanding state per preset ─────────────────────────────
//
// These nine exist to be LOOKED AT at 390px and 320px, so each is deliberately
// pinned to a crowded, far-reaching state rather than a comfortable default —
// the most labels, the longest guides, the widest option row that preset can
// produce. Each play function asserts the demanding state is genuinely on
// screen, so a screenshot cannot quietly become a picture of something easier.

export const RenderPassPlotPoint = {
  args: { preset: 'plotPoint', focus: 'quadrants', defaultValue: { x: -5, y: 4 } },
  play: async ({ canvasElement }) => {
    // Four quadrant labels plus the moving point, with both drop guides.
    expect(canvasElement.querySelectorAll('[data-cp-point-label]')).toHaveLength(5)
    expect(canvasElement.querySelectorAll('[data-cp-guide]')).toHaveLength(2)
    expect(statusHeading(canvasElement).textContent).toBe(`(${MINUS}5, 4)`)
  },
}

export const RenderPassMidpoint = {
  args: { preset: 'midpoint', defaultValue: { ax: -5, ay: -4, bx: 5, by: 5 } },
  play: async ({ canvasElement }) => {
    // Both endpoints, the midpoint, and BOTH bracket rules on screen at once.
    expect(shapeIds(canvasElement)).toEqual(
      expect.arrayContaining(['segment', 'bracket-x', 'bracket-y']),
    )
    expect(canvasElement.querySelectorAll('[data-cp-point-label]')).toHaveLength(3)
  },
}

export const RenderPassStraightLine = {
  args: { preset: 'straightLine', focus: 'compare', comparisonRule: 'parallel' },
  play: async ({ canvasElement }) => {
    // Two lines, two intercept labels and BOTH rise/run triangles.
    expect(canvasElement.querySelectorAll('[data-cp-shape^="rise-run"]')).toHaveLength(2)
    expect(canvasElement.querySelector('[data-cp-shape="line-1"]')).not.toBeNull()
    expect(canvasElement.querySelector('[data-cp-shape="line-2"]')).not.toBeNull()
  },
}

export const RenderPassTableOfValues = {
  args: { preset: 'tableOfValues', defaultValue: { m: 2, c: 1, step: 5 } },
  play: async ({ canvasElement }) => {
    // Every row plotted, the full trail accumulated, and a solid line.
    expect(canvasElement.querySelectorAll('[data-cp-point^="plotted-"]')).toHaveLength(6)
    expect(canvasElement.querySelectorAll('[data-cp-trail-item]')).toHaveLength(6)
    expect(canvasElement.querySelector('[data-cp-shape="line"]')
      ?.getAttribute('stroke-dasharray')).toBeNull()
  },
}

export const RenderPassIntersection = {
  args: { preset: 'intersection' },
  play: async ({ canvasElement }) => {
    // One solution, both lines, both drop guides and both substitution lines.
    expect(canvasElement.querySelectorAll('[data-cp-guide]')).toHaveLength(2)
    expect(canvasElement.querySelectorAll('[data-cp-status-calculation]')).toHaveLength(2)
    expect(statusHeading(canvasElement).textContent).toBe('(2, 5)')
  },
}

export const RenderPassTranslate = {
  args: { preset: 'translate', interactive: false, defaultValue: { dx: 8, dy: 5 } },
  play: async ({ canvasElement }) => {
    // The model extreme: six vertex labels at the furthest reach of the plane.
    expect(canvasElement.querySelectorAll('[data-cp-point-label]')).toHaveLength(6)
    expect(statusHeading(canvasElement).textContent).toBe('Translation by (8, 5)')
  },
}

export const RenderPassReflect = {
  args: {
    preset: 'reflect',
    defaultValue: { mirror: 'yEqualsX', mirrorValue: 2 },
  },
  play: async ({ canvasElement }) => {
    // A DIAGONAL mirror, which crosses the plot corner to corner, with all six
    // original and image vertices labelled.
    expect(statusHeading(canvasElement).textContent).toBe('Reflection in y = x')
    expect(canvasElement.querySelector('[data-cp-shape="mirror-line"]')).not.toBeNull()
    expect(canvasElement.querySelectorAll('[data-cp-point-label]')).toHaveLength(6)
  },
}

export const RenderPassRotate = {
  args: {
    preset: 'rotate',
    difficultyCapabilities: { nonOriginCentre: true },
    // NOT 180°, so the direction group is on screen as well as the angle group
    // and both centre steppers.
    defaultValue: { cx: 2, cy: -2, angle: '270', direction: 'anticlockwise' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(statusHeading(canvasElement).textContent)
      .toBe(`Rotation 270° anticlockwise about (2, ${MINUS}2)`)
    await expect(canvas.getByRole('button', { name: 'Anticlockwise' })).toBeVisible()
    expect(canvasElement.querySelectorAll('[data-cp-stepper]')).toHaveLength(2)
    // Six vertices plus the centre marker.
    expect(canvasElement.querySelectorAll('[data-cp-point-label]')).toHaveLength(7)
  },
}

export const RenderPassEnlarge = {
  args: {
    preset: 'enlarge',
    difficultyCapabilities: {
      nonOriginCentre: true,
      fractionalScaleFactor: true,
      negativeScaleFactor: true,
    },
    defaultValue: { cx: -1, cy: -1, scaleFactor: '3' },
  },
  play: async ({ canvasElement }) => {
    expect(statusHeading(canvasElement).textContent)
      .toBe(`Enlargement scale factor 3, centre (${MINUS}1, ${MINUS}1)`)
    // The full ray from the centre out to the image vertex.
    expect(canvasElement.querySelector('[data-cp-shape="ray-a"]')).not.toBeNull()
    // Six scale factors plus two centre steppers — the widest control area any
    // preset produces.
    expect(canvasElement.querySelectorAll('[data-cp-option^="scaleFactor:"]')).toHaveLength(6)
    expect(canvasElement.querySelectorAll('[data-cp-stepper]')).toHaveLength(2)
  },
}

// ─── Axis numbers must be readable, not merely present ───────────────────────
//
// Reproduces the render-pass failure found at both 390px and 320px: with both
// axes crossing and a unit spacing near 21px, the y-axis number one step below
// the x-axis was printed on top of the x-axis number one step to its left —
// "−1" over "−1", illegible. The renderer now drops the colliding y-axis
// number rather than stacking two glyphs.
function expectNoTickCollisions(canvasElement) {
  const ticks = [...canvasElement.querySelectorAll('[data-cp-ticks] text')]
  expect(ticks.length).toBeGreaterThan(0)

  for (let i = 0; i < ticks.length; i += 1) {
    for (let j = i + 1; j < ticks.length; j += 1) {
      const a = ticks[i].getBoundingClientRect()
      const b = ticks[j].getBoundingClientRect()
      const overlaps = a.left < b.right && b.left < a.right
        && a.top < b.bottom && b.top < a.bottom
      expect(
        overlaps,
        `axis number "${ticks[i].textContent}" overlaps "${ticks[j].textContent}"`,
      ).toBe(false)
    }
  }
}

// plotPoint has the tightest unit spacing of any preset (a 12-unit range on a
// 256px plot), so it is where two axis numbers collide first.
export const AxisNumbersNeverCollide = {
  args: { preset: 'plotPoint' },
  play: async ({ canvasElement }) => {
    expectNoTickCollisions(canvasElement)

    // Both runs are still there — the fix drops one number, not a whole axis.
    expect(canvasElement.querySelectorAll('[data-cp-tick="x"]').length)
      .toBeGreaterThanOrEqual(12)
    expect(canvasElement.querySelectorAll('[data-cp-tick="y"]').length)
      .toBeGreaterThanOrEqual(11)
  },
}

export const AxisNumbersNeverCollideNarrow = {
  args: { preset: 'intersection' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    expectNoTickCollisions(canvasElement)
  },
}
