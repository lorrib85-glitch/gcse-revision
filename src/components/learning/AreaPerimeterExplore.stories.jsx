import { expect, userEvent, within } from 'storybook/test'
import AreaPerimeterExplore from './AreaPerimeterExplore.jsx'

// Every value change is mirrored verbatim into a visually hidden aria-live
// region, so the status heading exists twice in the DOM once a learner has
// interacted. Text queries have to skip the mirror or they match twice.
const IGNORE_LIVE_REGION = 'script, style, [data-ap-status-announcement]'

function canvasOf(canvasElement) {
  const queries = within(canvasElement)
  return {
    ...queries,
    getByText: (matcher, options) =>
      queries.getByText(matcher, { ignore: IGNORE_LIVE_REGION, ...options }),
    queryByText: (matcher, options) =>
      queries.queryByText(matcher, { ignore: IGNORE_LIVE_REGION, ...options }),
    getAllByText: (matcher, options) =>
      queries.getAllByText(matcher, { ignore: IGNORE_LIVE_REGION, ...options }),
  }
}

function statusText(canvasElement) {
  return [
    canvasElement.querySelector('[data-ap-status-heading]')?.textContent ?? '',
    ...[...canvasElement.querySelectorAll('[data-ap-status-calculation]')].map(node => node.textContent),
    canvasElement.querySelector('[data-ap-status-explanation]')?.textContent ?? '',
  ].join(' | ')
}

function shape(canvasElement, id) {
  return canvasElement.querySelector(`[data-ap-shape="${id}"]`)
}

function expectMobileContainment(canvasElement, maximumWidth = 320) {
  const diagram = canvasElement.querySelector('.ap-explore')
  const diagramWidth = diagram?.getBoundingClientRect().width ?? Infinity

  expect(diagramWidth).toBeLessThanOrEqual(maximumWidth + 0.5)
  expect(diagram?.scrollWidth).toBeLessThanOrEqual(diagram?.clientWidth)
}

export default {
  title: 'Learning/AreaPerimeterExplore',
  component: AreaPerimeterExplore,
  parameters: {
    layout: 'centered',
  },
}

// ─── Rectangle ───────────────────────────────────────────────────────────────

export const RectanglePerimeter = {
  args: { preset: 'rectangle', focus: 'perimeter' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const width = canvas.getByRole('slider', { name: 'Width of the rectangle' })

    await expect(canvas.getByText('Perimeter = 20 cm')).toBeVisible()
    await expect(canvas.getByText('6 + 4 + 6 + 4 = 20 cm')).toBeVisible()
    await expect(canvas.getByText('2 × (6 + 4) = 20 cm')).toBeVisible()

    // Perimeter is a linear measure — no square units anywhere in the status.
    expect(statusText(canvasElement)).not.toContain('²')

    width.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(width).toHaveAttribute('aria-valuenow', '7')
    await expect(canvas.getByText('7 + 4 + 7 + 4 = 22 cm')).toBeVisible()
    await expect(canvas.getByText('2 × (7 + 4) = 22 cm')).toBeVisible()
  },
}

export const RectangleArea = {
  args: { preset: 'rectangle', focus: 'area' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const height = canvas.getByRole('slider', { name: 'Height of the rectangle' })

    // Rows and columns come first; the multiplication is the second line.
    await expect(canvas.getByText('Area = 24 cm²')).toBeVisible()
    await expect(canvas.getByText('4 rows × 6 columns = 24 cm²')).toBeVisible()
    await expect(canvas.getByText('Length × width: 6 × 4 = 24 cm²')).toBeVisible()
    expect(canvasElement.querySelectorAll('[data-ap-shape^="rectangle-grid-"]').length).toBe(8)

    height.focus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(height).toHaveAttribute('aria-valuenow', '5')
    await expect(canvas.getByText('Area = 30 cm²')).toBeVisible()
    await expect(canvas.getByText('5 rows × 6 columns = 30 cm²')).toBeVisible()
  },
}

export const RectangleSquareState = {
  args: { preset: 'rectangle', focus: 'area', defaultValue: { width: 5, height: 4 } },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const height = canvas.getByRole('slider', { name: 'Height of the rectangle' })

    expect(canvasElement.querySelectorAll('[data-ap-shape^="rectangle-equal-"]').length).toBe(0)

    height.focus()
    await userEvent.keyboard('{ArrowUp}')

    await expect(canvas.getByText('Area = 25 cm²')).toBeVisible()
    await expect(canvas.getByText('Area = side × side = 5² = 25 cm²')).toBeVisible()
    expect(canvasElement.querySelectorAll('[data-ap-shape^="rectangle-equal-"]').length).toBe(4)
    expect(canvasElement.querySelectorAll('[data-ap-shape^="rectangle-grid-"]').length).toBe(8)
  },
}

export const RectangleCompare = {
  args: { preset: 'rectangle', focus: 'compare' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const width = canvas.getByRole('slider', { name: 'Width of the rectangle' })

    await expect(canvas.getByText('Perimeter 20 cm — area 24 cm²')).toBeVisible()

    // One extra column: area gains a whole column, perimeter gains only 2 cm.
    width.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByText('Perimeter 22 cm — area 28 cm²')).toBeVisible()

    await userEvent.keyboard('{End}')
    await expect(width).toHaveAttribute('aria-valuenow', '12')
    await expect(canvas.getByText('Perimeter 32 cm — area 48 cm²')).toBeVisible()

    await userEvent.keyboard('{Home}')
    await expect(width).toHaveAttribute('aria-valuenow', '3')
    await expect(canvas.getByText('Perimeter 14 cm — area 12 cm²')).toBeVisible()
  },
}

// ─── Fixed perimeter ─────────────────────────────────────────────────────────

export const FixedPerimeter = {
  args: { preset: 'fixedPerimeterRectangle' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const width = canvas.getByRole('slider', { name: 'Width of the rectangle (perimeter stays 24 cm)' })

    await expect(canvas.getByText('Area = 32 cm²')).toBeVisible()
    await expect(canvas.getByText('Perimeter: 4 + 8 + 4 + 8 = 24 cm')).toBeVisible()

    // Every width keeps the 24 cm boundary while the enclosed area changes.
    width.focus()
    await userEvent.keyboard('{Home}')
    await expect(width).toHaveAttribute('aria-valuenow', '1')
    await expect(canvas.getByText('Area = 11 cm²')).toBeVisible()
    await expect(canvas.getByText('Perimeter: 1 + 11 + 1 + 11 = 24 cm')).toBeVisible()

    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByText('Area = 20 cm²')).toBeVisible()
    await expect(canvas.getByText('Perimeter: 2 + 10 + 2 + 10 = 24 cm')).toBeVisible()

    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    await expect(canvas.getByText('Area = 32 cm²')).toBeVisible()

    // The square is the maximum among the whole-number states.
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    await expect(width).toHaveAttribute('aria-valuenow', '6')
    await expect(canvas.getByText('Area = 36 cm²')).toBeVisible()
    await expect(canvas.getByText('Perimeter: 6 + 6 + 6 + 6 = 24 cm')).toBeVisible()
    await expect(
      canvas.getByText('With this fixed perimeter, the square encloses the greatest area.'),
    ).toBeVisible()
    expect(canvasElement.querySelectorAll('[data-ap-shape^="fixed-rectangle-equal-"]').length).toBe(4)

    // Past the square, area falls again on the same fixed boundary.
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    await expect(canvas.getByText('Area = 32 cm²')).toBeVisible()
  },
}

// ─── Triangle ────────────────────────────────────────────────────────────────

export const TriangleArea = {
  args: { preset: 'triangleArea' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const apex = canvas.getByRole('slider', { name: 'Slide the apex along the top' })

    await expect(canvas.getByText('Area = 16 cm²')).toBeVisible()
    expect(shape(canvasElement, 'triangle-height')).not.toBeNull()
    expect(shape(canvasElement, 'triangle-right-angle')).not.toBeNull()

    // Sliding the apex changes the sloping sides but not base or height.
    apex.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')
    await expect(apex).toHaveAttribute('aria-valuenow', '8')
    await expect(canvas.getByText('Area = 16 cm²')).toBeVisible()

    await userEvent.keyboard('{End}')
    await expect(apex).toHaveAttribute('aria-valuenow', '11')
    await expect(canvas.getByText('Area = 16 cm²')).toBeVisible()
    // Leaning past the base puts the perpendicular foot outside it.
    expect(shape(canvasElement, 'triangle-base-extension')).not.toBeNull()
    expect(shape(canvasElement, 'triangle-right-angle')).not.toBeNull()

    await userEvent.keyboard('{Home}')
    await expect(apex).toHaveAttribute('aria-valuenow', '1')
    await expect(canvas.getByText('Area = 16 cm²')).toBeVisible()
  },
}

export const TrianglePerpendicularHeight = {
  args: { preset: 'triangleArea' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const height = canvas.getByRole('slider', { name: 'Perpendicular height of the triangle' })

    await expect(canvas.getByText('Area = 16 cm²')).toBeVisible()

    height.focus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(height).toHaveAttribute('aria-valuenow', '5')
    await expect(canvas.getByText('Area = 20 cm²')).toBeVisible()

    await userEvent.keyboard('{Home}')
    await expect(height).toHaveAttribute('aria-valuenow', '2')
    await expect(canvas.getByText('Area = 8 cm²')).toBeVisible()
    expect(shape(canvasElement, 'triangle-height')).not.toBeNull()
    expect(shape(canvasElement, 'triangle-right-angle')).not.toBeNull()
  },
}

export const TriangleFormulaReveal = {
  args: { preset: 'triangleArea' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)

    // The formula is withheld until the pairing is triggered.
    expect(statusText(canvasElement)).not.toContain('½ × base')
    expect(shape(canvasElement, 'triangle-duplicate')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Show why the formula works' }))

    expect(shape(canvasElement, 'triangle-duplicate')).not.toBeNull()
    await expect(canvas.getByText('Area = ½ × 8 × 4 = 16 cm²')).toBeVisible()
    await expect(canvas.getByText('Area = ½ × base × perpendicular height.')).toBeVisible()
    await expect(canvas.getByText(/8 × 4 = 32 cm²/)).toBeVisible()
  },
}

// ─── Parallelogram ───────────────────────────────────────────────────────────

export const ParallelogramArea = {
  args: { preset: 'parallelogramArea' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const slant = canvas.getByRole('slider', { name: 'Slide the top edge sideways' })

    await expect(canvas.getByText('Area = 28 cm²')).toBeVisible()

    // Slant alone never changes the space inside.
    slant.focus()
    await userEvent.keyboard('{End}')
    await expect(slant).toHaveAttribute('aria-valuenow', '5')
    await expect(canvas.getByText('Area = 28 cm²')).toBeVisible()

    await userEvent.keyboard('{Home}')
    await expect(slant).toHaveAttribute('aria-valuenow', '0')
    await expect(canvas.getByText('Area = 28 cm²')).toBeVisible()

    // The only height shown is the perpendicular one, and it stays labelled
    // beside its own dashed line — the slant is never given a length.
    expect(canvasElement.querySelector('[data-ap-label="dim-height"]').textContent).toBe('4 cm')
    expect(shape(canvasElement, 'parallelogram-height').getAttribute('stroke-dasharray')).toBe('6 5')
    expect(shape(canvasElement, 'parallelogram-right-angle')).not.toBeNull()
    await expect(canvas.getByText(/The sloping side is not the height\./)).toBeVisible()
  },
}

export const ParallelogramCutAndSlide = {
  args: { preset: 'parallelogramArea' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)

    expect(shape(canvasElement, 'parallelogram-rectangle')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Cut and slide the overhang' }))

    // The cut piece moves across and completes an equivalent rectangle.
    expect(shape(canvasElement, 'parallelogram-overhang-ghost')).not.toBeNull()
    expect(shape(canvasElement, 'parallelogram-moved-piece')).not.toBeNull()
    expect(shape(canvasElement, 'parallelogram-rectangle')).not.toBeNull()
    await expect(canvas.getByText('Area = 7 × 4 = 28 cm²')).toBeVisible()
    await expect(canvas.getByText('Area = base × perpendicular height — the slant never changed the space inside.')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Back to the parallelogram' }))
    expect(shape(canvasElement, 'parallelogram-rectangle')).toBeNull()
  },
}

// ─── Trapezium ───────────────────────────────────────────────────────────────

export const TrapeziumArea = {
  args: { preset: 'trapeziumArea' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const top = canvas.getByRole('slider', { name: 'Length of the top parallel side' })
    const bottom = canvas.getByRole('slider', { name: 'Length of the bottom parallel side' })
    const height = canvas.getByRole('slider', { name: 'Perpendicular height of the trapezium' })

    await expect(canvas.getByText('Area = 20 cm²')).toBeVisible()

    top.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    await expect(top).toHaveAttribute('aria-valuenow', '5')
    await expect(canvas.getByText('Area = 24 cm²')).toBeVisible()

    bottom.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    await expect(bottom).toHaveAttribute('aria-valuenow', '9')
    await expect(canvas.getByText('Area = 28 cm²')).toBeVisible()

    height.focus()
    await userEvent.keyboard('{Home}')
    await expect(height).toHaveAttribute('aria-valuenow', '2')
    await expect(canvas.getByText('Area = 14 cm²')).toBeVisible()

    expect(shape(canvasElement, 'trapezium-parallel-top')).not.toBeNull()
    expect(shape(canvasElement, 'trapezium-parallel-bottom')).not.toBeNull()
  },
}

export const TrapeziumDuplicateAndRotate = {
  args: { preset: 'trapeziumArea' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)

    expect(shape(canvasElement, 'trapezium-duplicate')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Join a rotated copy' }))

    // a + b base, same height, exactly twice the trapezium's area.
    expect(shape(canvasElement, 'trapezium-duplicate')).not.toBeNull()
    await expect(canvas.getByText(/base 3 \+ 7 = 10 cm, height 4 cm/)).toBeVisible()
    await expect(canvas.getByText(/Parallelogram area 40 cm² — the trapezium is half/)).toBeVisible()
    await expect(canvas.getByText('Area = ½ × (3 + 7) × 4 = 20 cm²')).toBeVisible()
    await expect(canvas.getByText('Area = ½ × (a + b) × h.')).toBeVisible()
  },
}

// ─── Composite ───────────────────────────────────────────────────────────────

export const CompositeArea = {
  args: { preset: 'compositeShape', focus: 'area' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)

    await expect(canvas.getByText('Area = 36 cm²')).toBeVisible()
    await expect(canvas.getByText('24 cm² + 12 cm² = 36 cm²')).toBeVisible()

    // A second valid decomposition reaches the same total.
    await userEvent.click(canvas.getByRole('button', { name: 'Horizontal split' }))
    await expect(canvas.getByText('Area = 36 cm²')).toBeVisible()
    await expect(canvas.getByText('28 cm² + 8 cm² = 36 cm²')).toBeVisible()

    // So does completing the rectangle and subtracting the missing corner.
    await userEvent.click(canvas.getByRole('button', { name: 'Subtract the corner' }))
    await expect(canvas.getByText('Area = 36 cm²')).toBeVisible()
    await expect(canvas.getByText('42 cm² − 6 cm² = 36 cm²')).toBeVisible()
    expect(shape(canvasElement, 'composite-missing-rectangle')).not.toBeNull()

    // The choice is a real discrete control, not a disguised slider.
    expect(canvas.queryAllByRole('slider')).toHaveLength(0)
    await expect(canvas.getByRole('button', { name: 'Subtract the corner' }))
      .toHaveAttribute('aria-pressed', 'true')
  },
}

export const CompositePerimeter = {
  args: { preset: 'compositeShape', focus: 'perimeter' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)

    await expect(canvas.getByText('Perimeter = 26 cm')).toBeVisible()
    await expect(canvas.getByText('7 + 4 + 3 + 2 + 4 + 6 = 26 cm')).toBeVisible()

    // The two unlabelled outer lengths are deduced, and marked as deduced.
    await expect(canvas.getByText('Missing lengths: 3 = 7 − 4 and 2 = 6 − 4')).toBeVisible()
    const deduced = [...canvasElement.querySelectorAll('[data-ap-deduced="true"]')].map(n => n.textContent)
    expect(deduced).toEqual(['3 cm', '2 cm'])

    // The internal split line stays on screen but out of the calculation.
    expect(shape(canvasElement, 'composite-old-split')).not.toBeNull()
    expect(shape(canvasElement, 'composite-old-split').getAttribute('stroke-dasharray')).toBe('6 5')
    await expect(canvas.getByText(
      'This line helped us calculate the area, but it is inside the shape, so it is not part of the perimeter.',
    )).toBeVisible()

    // Decomposition choice belongs to area work only.
    expect(canvas.queryByRole('button', { name: 'Vertical split' })).toBeNull()
    expect(statusText(canvasElement)).not.toContain('²')
  },
}

// ─── Static, accessibility and containment ───────────────────────────────────

export const StaticWorkedExample = {
  args: {
    preset: 'trapeziumArea',
    value: { top: 4, bottom: 8, height: 5 },
    interactive: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const diagram = canvasElement.querySelector('.ap-explore')

    await expect(diagram).toHaveAttribute('data-ap-interactive', 'false')
    expect(canvas.queryAllByRole('slider')).toHaveLength(0)
    expect(canvas.queryAllByRole('button')).toHaveLength(0)
    expect(canvasElement.querySelector('[data-ap-hit-target]')).toBeNull()
    await expect(canvas.getByText('Area = 30 cm²')).toBeVisible()
  },
}

export const KeyboardOnly = {
  args: { preset: 'rectangle', focus: 'compare' },
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    const width = canvas.getByRole('slider', { name: 'Width of the rectangle' })
    const height = canvas.getByRole('slider', { name: 'Height of the rectangle' })

    // One calm cue points at the draggable dimensions before first contact.
    expect(canvasElement.querySelector('.ap-explore__handle-hint')).not.toBeNull()

    // Both handles are reachable by tab and announce their value.
    await userEvent.tab()
    await expect(width).toHaveFocus()
    await userEvent.tab()
    await expect(height).toHaveFocus()

    await userEvent.keyboard('{ArrowUp}')

    // The cue has done its job and stops for good.
    expect(canvasElement.querySelector('.ap-explore__handle-hint')).toBeNull()

    await expect(height).toHaveAttribute('aria-valuenow', '5')
    await expect(height).toHaveAttribute('aria-valuetext', 'Height 5 centimetres — perimeter 22 centimetres, area 30 square centimetres')

    await userEvent.keyboard('{End}')
    await expect(height).toHaveAttribute('aria-valuenow', '7')
    await userEvent.keyboard('{Home}')
    await expect(height).toHaveAttribute('aria-valuenow', '3')
  },
}

export const ReducedMotion = {
  args: { preset: 'rectangle', reducedMotion: true },
  play: async ({ canvasElement }) => {
    const diagram = canvasElement.querySelector('.ap-explore')

    await expect(diagram).toHaveClass('ap-explore--reduced-motion')
    await expect(diagram).toHaveAttribute('data-reduced-motion', 'true')
    // The one-off handle cue is suppressed entirely, not merely slowed.
    expect(canvasElement.querySelector('.ap-explore__handle-hint')).toBeNull()
  },
}

export const MobileWidth = {
  args: { preset: 'compositeShape', focus: 'area' },
  decorators: [
    Story => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = canvasOf(canvasElement)
    expectMobileContainment(canvasElement)

    const svg = canvasElement.querySelector('svg[data-ap-canvas]')
    await expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet')

    // Discrete method controls stay tappable at 320px.
    for (const button of canvas.getAllByRole('button')) {
      expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    }
  },
}

export const MobileHitTargets = {
  args: { preset: 'rectangle', focus: 'compare' },
  decorators: [
    Story => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    expectMobileContainment(canvasElement)

    const targets = [...canvasElement.querySelectorAll('[data-ap-hit-target="true"]')]
    expect(targets).toHaveLength(2)

    // ≥44px in the SVG's own coordinate space, whatever the render scale.
    for (const target of targets) {
      expect(Number(target.getAttribute('r')) * 2).toBeGreaterThanOrEqual(44)
    }
  },
}
