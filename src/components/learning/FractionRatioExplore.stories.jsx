import { expect, userEvent, within } from 'storybook/test'
import FractionRatioExplore from './FractionRatioExplore.jsx'

function statusText(canvasElement) {
  return [
    canvasElement.querySelector('[data-fr-status-heading]')?.textContent ?? '',
    ...[...canvasElement.querySelectorAll('[data-fr-status-calculation]')].map(node => node.textContent),
    canvasElement.querySelector('[data-fr-status-explanation]')?.textContent ?? '',
  ].join(' | ')
}

function segments(canvasElement, barId) {
  return [...canvasElement.querySelectorAll(`[data-fr-bar="${barId}"] [data-fr-segment]`)]
}

function expectMobileContainment(canvasElement, maximumWidth = 320) {
  const diagram = canvasElement.querySelector('.fr-explore')
  const diagramWidth = diagram?.getBoundingClientRect().width ?? Infinity

  expect(diagramWidth).toBeLessThanOrEqual(maximumWidth + 0.5)
  expect(diagram?.scrollWidth).toBeLessThanOrEqual(diagram?.clientWidth)
}

export default {
  title: 'Learning/FractionRatioExplore',
  component: FractionRatioExplore,
  parameters: {
    layout: 'centered',
  },
}

// ─── fractionBar ─────────────────────────────────────────────────────────────

export const FractionBar = {
  args: { preset: 'fractionBar' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('3/4 — three quarters')).toBeVisible()
    await expect(canvas.getByText('3 shaded out of 4 equal parts')).toBeVisible()
    await expect(canvas.getByText('= 0.75 = 75%')).toBeVisible()

    // The circle is cut into the same number of parts as the bar — one whole,
    // two representations.
    expect(canvasElement.querySelectorAll('[data-fr-sector]')).toHaveLength(4)

    const numerator = canvas.getByRole('slider', { name: 'Parts shaded' })
    numerator.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(numerator).toHaveAttribute('aria-valuenow', '4')
    await expect(canvas.getByText('4/4 — one whole')).toBeVisible()

    expectMobileContainment(canvasElement)
  },
}

export const FractionBarSimplifies = {
  args: { preset: 'fractionBar', defaultValue: { numerator: 2, denominator: 8 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/The same amount is also 1\/4/)).toBeVisible()
  },
}

export const FractionBarStepperShrinksNumerator = {
  args: { preset: 'fractionBar', defaultValue: { numerator: 5, denominator: 6 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const fewerParts = canvas.getByRole('button', { name: 'Decrease equal parts' })

    // Dropping to five parts cannot leave five shaded out of five by accident —
    // the numerator follows the denominator down.
    await userEvent.click(fewerParts)
    await expect(canvas.getByText('5/5 — one whole')).toBeVisible()
    await userEvent.click(fewerParts)
    await expect(canvas.getByText('4/4 — one whole')).toBeVisible()
  },
}

// ─── equivalentFractions ─────────────────────────────────────────────────────

export const EquivalentFractions = {
  args: { preset: 'equivalentFractions' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('1/2 = 3/6')).toBeVisible()
    await expect(canvas.getByText('same amount')).toBeVisible()

    // Same whole, same shaded length — only the number of cuts changes.
    const [baseSegment] = segments(canvasElement, 'base')
    const [equivalentSegment] = segments(canvasElement, 'equivalent')
    expect(baseSegment.getAttribute('width')).toBe(equivalentSegment.getAttribute('width'))

    const multiplier = canvas.getByRole('slider', { name: 'Cut each part into' })
    multiplier.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByText('1/2 = 4/8')).toBeVisible()

    // Still the same amount after scaling again.
    const [scaledBase] = segments(canvasElement, 'base')
    const [scaledEquivalent] = segments(canvasElement, 'equivalent')
    expect(scaledBase.getAttribute('width')).toBe(scaledEquivalent.getAttribute('width'))

    expectMobileContainment(canvasElement)
  },
}

// ─── fractionOperations ──────────────────────────────────────────────────────

export const OperationsAdd = {
  args: { preset: 'fractionOperations', method: 'add' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Step 1 — the mismatch has to be felt before the fix means anything.
    await expect(canvas.getByText('The parts are different sizes')).toBeVisible()
    await expect(canvas.getByText('Step 1 of 4')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Match the parts' }))
    await expect(canvas.getByText('Now both are twelfths')).toBeVisible()
    await expect(canvas.getByText('2/3 = 8/12')).toBeVisible()
    await expect(canvas.getByText('1/4 = 3/12')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Combine' }))
    await expect(canvas.getByText('Add the numerators')).toBeVisible()
    await expect(canvas.getByText('8 + 3 = 11')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Check' }))
    await expect(canvas.getByText('11/12')).toBeVisible()
    await expect(canvas.getByText('Step 4 of 4')).toBeVisible()

    expectMobileContainment(canvasElement)
  },
}

export const OperationsAddPastOneWhole = {
  args: {
    preset: 'fractionOperations',
    method: 'add',
    step: 'combine',
    defaultValue: { numeratorA: 2, denominatorA: 3, numeratorB: 1, denominatorB: 2, amount: 20 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 2/3 + 1/2 = 7/6 — the shading continues into a second whole rather than
    // overflowing the first.
    await expect(canvas.getByText('one whole — full')).toBeVisible()
    await expect(canvas.getByText('into the next whole')).toBeVisible()
    expect(canvasElement.querySelectorAll('[data-fr-bar]')).toHaveLength(2)
  },
}

export const OperationsSubtract = {
  args: { preset: 'fractionOperations', method: 'subtract', step: 'check' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('5/12')).toBeVisible()
    expect(statusText(canvasElement)).not.toContain('−5')
  },
}

export const OperationsMultiply = {
  args: { preset: 'fractionOperations', method: 'multiply', step: 'overlap' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 2/3 × 1/4 — a 3 × 4 grid with two overlapping cells.
    expect(canvasElement.querySelectorAll('[data-fr-cell]')).toHaveLength(12)
    await expect(canvas.getByText('2 overlapping parts out of 12')).toBeVisible()
    await expect(canvas.getByText('1/6')).toBeVisible()

    expectMobileContainment(canvasElement)
  },
}

export const OperationsDivide = {
  args: {
    preset: 'fractionOperations',
    method: 'divide',
    step: 'fit',
    defaultValue: { numeratorA: 3, denominatorA: 5, numeratorB: 1, denominatorB: 2, amount: 20 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('6/5 pieces fit into 3/5')).toBeVisible()
    await expect(canvas.getByText(/1 whole pieces and 1\/5 of another/)).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'The rule' }))
    await expect(canvas.getByText(/Flip the second fraction/)).toBeVisible()
    await expect(canvas.getByText('3/5 ÷ 1/2 = 6/5')).toBeVisible()
  },
}

export const OperationsOfAmount = {
  args: {
    preset: 'fractionOperations',
    method: 'ofAmount',
    defaultValue: { numeratorA: 3, denominatorA: 4, numeratorB: 1, denominatorB: 4, amount: 20 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Twenty counters, shared into four rows of five.
    expect(canvasElement.querySelectorAll('[data-fr-counter]')).toHaveLength(20)
    await expect(canvas.getByText('Share 20 into 4 equal parts')).toBeVisible()
    await expect(canvas.getByText('20 ÷ 4 = 5')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Take the parts' }))
    await expect(canvas.getByText('Take 3 of those parts')).toBeVisible()
    await expect(canvas.getByText('5 × 3 = 15')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'The method' }))
    await expect(canvas.getByText('3/4 of 20 = 15')).toBeVisible()

    expectMobileContainment(canvasElement)
  },
}

export const OperationsSwitchMethodKeepsNumbers = {
  args: { preset: 'fractionOperations', method: 'add' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Multiply' }))
    // The learner's fractions survive the switch; only the method changes.
    await expect(canvas.getByText('Split the whole into 3 columns')).toBeVisible()
    await expect(canvas.getByText('Shade 2 of them — that is 2/3')).toBeVisible()
  },
}

// ─── ratioShare ──────────────────────────────────────────────────────────────

export const RatioShare = {
  args: { preset: 'ratioShare' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('24 and 16')).toBeVisible()
    await expect(canvas.getByText('3 + 2 = 5 shares')).toBeVisible()
    await expect(canvas.getByText('40 ÷ 5 = 8 per share')).toBeVisible()
    await expect(canvas.getByText('1 share = 8')).toBeVisible()

    // A ratio has no unshaded remainder — every part belongs to a share.
    expect(segments(canvasElement, 'shares')).toHaveLength(2)

    const shareA = canvas.getByRole('slider', { name: 'First share' })
    shareA.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByText('4 + 2 = 6 shares')).toBeVisible()

    expectMobileContainment(canvasElement)
  },
}

export const RatioShareSimplifies = {
  args: { preset: 'ratioShare', defaultValue: { shareA: 6, shareB: 4, total: 40 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/6 : 4 simplifies to 3 : 2/)).toBeVisible()
  },
}

// ─── doubleNumberLine ────────────────────────────────────────────────────────

export const DoubleNumberLine = {
  args: { preset: 'doubleNumberLine' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('3 → £4.50')).toBeVisible()
    await expect(canvas.getByText('1 → £1.50')).toBeVisible()

    // Exactly one rung is live at a time — the rung is the answer.
    expect(canvasElement.querySelectorAll('[data-fr-rung-active="true"]')).toHaveLength(1)

    const position = canvas.getByRole('slider', { name: 'Amount on the line' })
    position.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByText('4 → £6.00')).toBeVisible()

    expectMobileContainment(canvasElement)
  },
}

// ─── percentageGrid ──────────────────────────────────────────────────────────

export const PercentageGrid = {
  args: { preset: 'percentageGrid' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('45% = 45/100 = 0.45')).toBeVisible()
    await expect(canvas.getByText('45 squares shaded out of 100')).toBeVisible()
    expect(canvasElement.querySelectorAll('[data-fr-cell]')).toHaveLength(100)

    const percent = canvas.getByRole('slider', { name: 'Per cent' })
    percent.focus()
    await userEvent.keyboard('{End}')
    await expect(canvas.getByText('100% = 100/100 = 1')).toBeVisible()

    expectMobileContainment(canvasElement)
  },
}

// ─── proportionScale ─────────────────────────────────────────────────────────

export const ProportionScale = {
  args: { preset: 'proportionScale' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('6 eggs and 9 cups')).toBeVisible()
    await expect(canvas.getByText('Eggs: 2 × 3 = 6')).toBeVisible()
    await expect(canvas.getByText('Cups of flour: 3 × 3 = 9')).toBeVisible()

    const factor = canvas.getByRole('slider', { name: 'Scale factor' })
    factor.focus()
    await userEvent.keyboard('{ArrowRight}')

    // Scaling changes both quantities and leaves the ratio alone — the point.
    await expect(canvas.getByText('8 eggs and 12 cups')).toBeVisible()
    await expect(canvas.getByText(/still 2 : 3/)).toBeVisible()

    expectMobileContainment(canvasElement)
  },
}

// ─── bestValue ───────────────────────────────────────────────────────────────

export const BestValue = {
  args: { preset: 'bestValue' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Pack B is better value')).toBeVisible()
    await expect(canvas.getByText('£1.12 per 100 g')).toBeVisible()

    // Dividing the other way round must reach the same verdict.
    await userEvent.click(canvas.getByRole('button', { name: 'Grams per £1' }))
    await expect(canvas.getByText('Pack B is better value')).toBeVisible()
    await expect(canvas.getByText(/Higher is better/)).toBeVisible()

    expectMobileContainment(canvasElement)
  },
}

// ─── Static and reduced-motion modes ─────────────────────────────────────────

export const StaticDiagram = {
  args: { preset: 'fractionBar', interactive: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A teaching or exam figure: no handles, no steppers, no live region.
    expect(canvasElement.querySelectorAll('[data-fr-handle]')).toHaveLength(0)
    expect(canvasElement.querySelectorAll('[data-fr-stepper]')).toHaveLength(0)
    await expect(canvas.getByText('3/4 — three quarters')).toBeVisible()
  },
}

export const ReducedMotion = {
  args: { preset: 'equivalentFractions', reducedMotion: true },
  play: async ({ canvasElement }) => {
    const diagram = canvasElement.querySelector('.fr-explore')
    expect(diagram.className).toContain('fr-explore--reduced-motion')
    expect(canvasElement.querySelectorAll('.fr-explore__handle-hint')).toHaveLength(0)
  },
}
