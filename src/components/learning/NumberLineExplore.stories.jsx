import { expect, userEvent, within } from 'storybook/test'
import NumberLineExplore from './NumberLineExplore.jsx'

function markerStyle(canvasElement, markerId) {
  return canvasElement
    .querySelector(`[data-nl-marker="${markerId}"]`)
    ?.getAttribute('data-nl-marker-style')
}

function expectMobileContainment(canvasElement, maximumWidth = 320) {
  const diagram = canvasElement.querySelector('.nl-explore')
  const diagramWidth = diagram?.getBoundingClientRect().width ?? Infinity

  expect(diagramWidth).toBeLessThanOrEqual(maximumWidth + 0.5)
  expect(diagram?.scrollWidth).toBeLessThanOrEqual(diagram?.clientWidth)
}

export default {
  title: 'Learning/NumberLineExplore',
  component: NumberLineExplore,
  parameters: {
    layout: 'centered',
  },
}

export const OrderNumbers = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('slider', { name: 'Value to place on the line' })

    await expect(handle).toHaveAttribute('aria-valuenow', '2')
    await expect(canvas.getByText('−1.5 < 0 < ½ < 0.75 < 2')).toBeVisible()
    await expect(canvas.getByText('2 sits furthest right, so it is the largest of the five.')).toBeVisible()

    // Landing exactly on a pinned value shows the two forms sharing one point.
    handle.focus()
    await userEvent.keyboard('{ArrowLeft>6/}')
    await expect(handle).toHaveAttribute('aria-valuenow', '0.5')
    await expect(canvas.getByText('−1.5 < 0 < ½ = 0.5 < 0.75')).toBeVisible()
    await expect(canvas.getByText('0.5 lands on the same point as ½ — one value written two ways.')).toBeVisible()

    await userEvent.keyboard('{Home}')
    await expect(handle).toHaveAttribute('aria-valuenow', '-5')
    await expect(canvas.getByText('−5 < −1.5 < 0 < ½ < 0.75')).toBeVisible()
    await expect(canvas.getByText('−5 sits furthest left, so it is the smallest of the five.')).toBeVisible()
  },
}

export const NegativeMovement = {
  args: { preset: 'negativeMovement' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const move = canvas.getByRole('slider', { name: 'Size of the move' })

    await expect(canvas.getByText('3 + (−5) = −2')).toBeVisible()
    await expect(canvas.getByText('Adding a negative moves left: 3 − 5 = −2.')).toBeVisible()
    expect(canvasElement.querySelector('[data-nl-jump="move"]')).not.toBeNull()
    expect(canvasElement.querySelector('[data-nl-jump-label="move"]')?.textContent).toBe('(−5)')

    move.focus()
    await userEvent.keyboard('{ArrowRight>5/}')
    await expect(move).toHaveAttribute('aria-valuenow', '0')
    await expect(canvas.getByText('3 + 0 = 3')).toBeVisible()
    await expect(canvas.getByText('No move — you stay at 3.')).toBeVisible()
    expect(canvasElement.querySelector('[data-nl-jump="move"]')).toBeNull()

    await userEvent.keyboard('{ArrowRight>4/}')
    await expect(canvas.getByText('3 + 4 = 7')).toBeVisible()
    await expect(canvas.getByText('Start at 3, move 4 steps right.')).toBeVisible()

    // The start marker moves independently, and the landing point follows it.
    const start = canvas.getByRole('slider', { name: 'Starting number' })
    start.focus()
    await userEvent.keyboard('{ArrowLeft>3/}')
    await expect(canvas.getByText('0 + 4 = 4')).toBeVisible()
  },
}

export const RoundingIntervals = {
  args: { preset: 'roundingIntervals' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Round to 1 decimal place')).toBeVisible()
    await expect(canvas.getByText('2.34 rounds to 2.3')).toBeVisible()
    await expect(canvas.getByText('2.34 is below the halfway point 2.35, so it rounds down.')).toBeVisible()

    const handle = canvas.getByRole('slider', { name: 'Value to round' })
    handle.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByText('2.35 rounds to 2.4')).toBeVisible()
    await expect(
      canvas.getByText('2.35 is exactly halfway. The rule is to round up, so it becomes 2.4.'),
    ).toBeVisible()

    // Changing precision rescales the axis, so the value restarts in range.
    await userEvent.click(canvas.getByRole('button', { name: 'Whole number' }))
    await expect(canvas.getByText('Round to the nearest whole number')).toBeVisible()
    await expect(canvas.getByText('6.4 rounds to 6')).toBeVisible()
  },
}

export const InequalityRange = {
  args: { preset: 'inequalityRange' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('x ≥ −1')).toBeVisible()
    await expect(
      canvas.getByText('Interval notation [−1, ∞). The filled circle shows −1 is included.'),
    ).toBeVisible()
    expect(markerStyle(canvasElement, 'endpoint')).toBe('filled')

    await userEvent.click(canvas.getByRole('button', { name: 'Excluded' }))
    await expect(canvas.getByText('x > −1')).toBeVisible()
    await expect(
      canvas.getByText('Interval notation (−1, ∞). The open circle shows −1 is not included.'),
    ).toBeVisible()
    expect(markerStyle(canvasElement, 'endpoint')).toBe('open')

    await userEvent.click(canvas.getByRole('button', { name: 'x smaller' }))
    await expect(canvas.getByText('x < −1')).toBeVisible()

    const handle = canvas.getByRole('slider', { name: 'Endpoint of the inequality' })
    handle.focus()
    await userEvent.keyboard('{ArrowRight>4/}')
    await expect(canvas.getByText('x < 1')).toBeVisible()
  },
}

export const BoundsInterval = {
  args: { preset: 'boundsInterval' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('2.3 rounded to 1 decimal place')).toBeVisible()
    await expect(canvas.getByText('2.25 ≤ x < 2.35')).toBeVisible()
    expect(markerStyle(canvasElement, 'lower')).toBe('filled')
    expect(markerStyle(canvasElement, 'upper')).toBe('open')
    expect(canvasElement.querySelector('[data-nl-note="note-lower"]')?.textContent)
      .toBe('2.25 included')
    expect(canvasElement.querySelector('[data-nl-note="note-upper"]')?.textContent)
      .toBe('2.35 excluded')

    const handle = canvas.getByRole('slider', { name: 'Rounded value' })
    handle.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByText('2.35 ≤ x < 2.45')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Whole number' }))
    await expect(canvas.getByText('7 rounded to the nearest whole number')).toBeVisible()
    await expect(canvas.getByText('6.5 ≤ x < 7.5')).toBeVisible()
  },
}

export const MultiplyPattern = {
  args: { preset: 'multiplyPattern' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('3 × (−3) = −9')).toBeVisible()
    await expect(canvas.getByText('3 jumps of 3, left of zero.')).toBeVisible()
    expect(canvasElement.querySelectorAll('[data-nl-jump]')).toHaveLength(3)

    const handle = canvas.getByRole('slider', { name: 'Number of jumps' })
    handle.focus()
    await userEvent.keyboard('{ArrowRight>3/}')
    await expect(canvas.getByText('3 × 0 = 0')).toBeVisible()
    await expect(canvas.getByText('No jumps at all — you never leave zero.')).toBeVisible()
    expect(canvasElement.querySelectorAll('[data-nl-jump]')).toHaveLength(0)

    await userEvent.keyboard('{ArrowRight>4/}')
    await expect(canvas.getByText('3 × 4 = 12')).toBeVisible()
    await expect(canvas.getByText('4 jumps of 3, right of zero.')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: '× 5' }))
    await expect(canvas.getByText('Jumps of 5 from zero')).toBeVisible()
    await expect(canvas.getByText('5 × (−3) = −15')).toBeVisible()
  },
}

export const EstimateRange = {
  args: { preset: 'estimateRange' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('29 × 21 — round each to 1 significant figure')).toBeVisible()
    await expect(canvas.getByText('30 × 20 = 600')).toBeVisible()
    await expect(
      canvas.getByText('Your estimate 600 is within 1% of 609 — inside the sensible range.'),
    ).toBeVisible()

    const handle = canvas.getByRole('slider', { name: 'Your estimate' })
    handle.focus()
    // The exact answer is a line, not a dot, so the estimate can sit on it.
    expect(canvasElement.querySelector('[data-nl-marker="exact"]')?.getAttribute('data-nl-marker-style'))
      .toBe('line')

    await userEvent.keyboard('{End}')
    await expect(handle).toHaveAttribute('aria-valuenow', '750')
    await expect(
      canvas.getByText('Your estimate 750 is 23% from 609 — outside the sensible range.'),
    ).toBeVisible()
  },
}

export const StaticDiagram = {
  args: {
    preset: 'inequalityRange',
    value: { endpoint: 2 },
    interactive: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const diagram = canvasElement.querySelector('.nl-explore')

    await expect(diagram).toHaveAttribute('data-nl-interactive', 'false')
    expect(canvas.queryAllByRole('slider')).toHaveLength(0)
    expect(canvas.queryAllByRole('button')).toHaveLength(0)
    await expect(canvas.getByText('x ≥ 2')).toBeVisible()
  },
}

export const ReducedMotion = {
  args: { preset: 'negativeMovement', reducedMotion: true },
  play: async ({ canvasElement }) => {
    const diagram = canvasElement.querySelector('.nl-explore')

    await expect(diagram).toHaveClass('nl-explore--reduced-motion')
    await expect(diagram).toHaveAttribute('data-reduced-motion', 'true')
    // The arc is present in its finished state, with no draw-in animation.
    expect(canvasElement.querySelector('[data-nl-jump="move"]')).not.toBeNull()
    expect(canvasElement.querySelector('.nl-explore__jump-reveal')).toBeNull()
  },
}

export const MobileWidth = {
  args: { preset: 'orderNumbers' },
  decorators: [
    Story => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    expectMobileContainment(canvasElement)
    const svg = canvasElement.querySelector('svg[data-nl-canvas="360x168"]')
    await expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet')

    const hitTarget = canvasElement.querySelector('[data-nl-hit-target="true"]')
    expect(hitTarget).not.toBeNull()
    const radius = Number(hitTarget.getAttribute('r'))
    expect(radius * 2).toBeGreaterThanOrEqual(44)
  },
}
