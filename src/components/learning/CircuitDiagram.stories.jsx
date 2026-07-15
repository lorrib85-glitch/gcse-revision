import { expect, userEvent, within } from 'storybook/test'
import CircuitDiagram from './CircuitDiagram.jsx'
import CircuitSymbolReference from './CircuitSymbolReference.jsx'

function getCircuitItem(canvasElement, id, componentType) {
  return canvasElement.querySelector(
    `[data-circuit-id="${id}"] [data-circuit-component="${componentType}"]`,
  )
}

function expectCircuitItemActive(canvasElement, id, componentType, active) {
  const element = getCircuitItem(canvasElement, id, componentType)
  const expected = active ? 'true' : null

  expect(element).not.toBeNull()
  expect(element?.getAttribute('data-active')).toBe(expected)
}

function expectSimpleScientificState(canvasElement, active) {
  expectCircuitItemActive(canvasElement, 'lamp-main', 'lamp', active)
  expectCircuitItemActive(canvasElement, 'current-main-loop', 'current-path', active)
}

function expectMobileContainment(canvasElement, maximumWidth = 320) {
  const circuit = canvasElement.querySelector('.circuit-diagram')
  const circuitWidth = circuit?.getBoundingClientRect().width ?? Infinity

  expect(circuitWidth).toBeLessThanOrEqual(maximumWidth + 0.5)
  expect(circuit?.scrollWidth).toBeLessThanOrEqual(circuit?.clientWidth)
}

export default {
  title: 'Learning/CircuitDiagram',
  component: CircuitDiagram,
  parameters: {
    layout: 'centered',
  },
  args: {
    preset: 'simpleSeries',
  },
}

export const InteractiveOpen = {
  args: { defaultClosed: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const circuitSwitch = canvas.getByRole('switch', { name: 'Main circuit switch' })

    await expect(circuitSwitch).toHaveAttribute('aria-checked', 'false')
    expectSimpleScientificState(canvasElement, false)

    await userEvent.click(circuitSwitch)
    await expect(circuitSwitch).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByText('The switch is closed.')).toBeVisible()
    expectSimpleScientificState(canvasElement, true)

    circuitSwitch.focus()
    await userEvent.keyboard(' ')
    await expect(circuitSwitch).toHaveAttribute('aria-checked', 'false')
    await expect(canvas.getByText('The switch is open.')).toBeVisible()
    expectSimpleScientificState(canvasElement, false)
  },
}

export const InteractiveClosed = {
  args: { defaultClosed: true },
}

export const TwoSwitchSeries = {
  args: {
    preset: 'twoSwitchSeries',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchA = canvas.getByRole('switch', { name: 'Switch A' })
    const switchB = canvas.getByRole('switch', { name: 'Switch B' })

    await expect(switchA).toHaveAttribute('aria-checked', 'true')
    await expect(switchB).toHaveAttribute('aria-checked', 'false')
    await expect(canvas.getByText('Switch B is open.')).toBeVisible()
    expectSimpleScientificState(canvasElement, false)

    switchB.focus()
    await userEvent.keyboard('{Enter}')
    await expect(switchB).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByText('Both switches are closed.')).toBeVisible()
    expectSimpleScientificState(canvasElement, true)

    switchA.focus()
    await userEvent.keyboard(' ')
    await expect(switchA).toHaveAttribute('aria-checked', 'false')
    await expect(canvas.getByText('Switch A is open.')).toBeVisible()
    expectSimpleScientificState(canvasElement, false)
  },
}

export const ParallelBranches = {
  args: {
    preset: 'parallelBranches',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchA = canvas.getByRole('switch', { name: 'Switch A for Lamp A' })
    const switchB = canvas.getByRole('switch', { name: 'Switch B for Lamp B' })

    await expect(canvas.getByText('Lamp A is on. Lamp B is off.')).toBeVisible()
    expectCircuitItemActive(canvasElement, 'lamp-a', 'lamp', true)
    expectCircuitItemActive(canvasElement, 'lamp-b', 'lamp', false)
    expectCircuitItemActive(canvasElement, 'current-shared-rails', 'current-path', true)
    expectCircuitItemActive(canvasElement, 'current-branch-a', 'current-path', true)
    expectCircuitItemActive(canvasElement, 'current-branch-b', 'current-path', false)

    await userEvent.click(switchB)
    await expect(canvas.getByText('Both lamps are on.')).toBeVisible()
    expectCircuitItemActive(canvasElement, 'lamp-a', 'lamp', true)
    expectCircuitItemActive(canvasElement, 'lamp-b', 'lamp', true)
    expectCircuitItemActive(canvasElement, 'current-branch-a', 'current-path', true)
    expectCircuitItemActive(canvasElement, 'current-branch-b', 'current-path', true)

    await userEvent.click(switchA)
    await expect(canvas.getByText('Lamp A is off. Lamp B is on.')).toBeVisible()
    expectCircuitItemActive(canvasElement, 'lamp-a', 'lamp', false)
    expectCircuitItemActive(canvasElement, 'lamp-b', 'lamp', true)
    expectCircuitItemActive(canvasElement, 'current-shared-rails', 'current-path', true)
    expectCircuitItemActive(canvasElement, 'current-branch-a', 'current-path', false)
    expectCircuitItemActive(canvasElement, 'current-branch-b', 'current-path', true)
  },
}

export const MeasurementCircuit = {
  args: {
    preset: 'measurementCircuit',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const circuit = canvasElement.querySelector('.circuit-diagram')

    await expect(circuit).toHaveAttribute('data-circuit-interactive', 'false')
    await expect(canvas.queryAllByRole('switch')).toHaveLength(0)
    await expect(canvas.getByText('Ammeter in series. Voltmeter in parallel.')).toBeVisible()
    expect(getCircuitItem(canvasElement, 'ammeter-main', 'ammeter')).not.toBeNull()
    expect(getCircuitItem(canvasElement, 'voltmeter-main', 'voltmeter')).not.toBeNull()
    expect(getCircuitItem(canvasElement, 'resistor-main', 'resistor')).not.toBeNull()
  },
}

export const ReadOnly = {
  args: {
    defaultClosed: true,
    interactive: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const circuit = canvasElement.querySelector('.circuit-diagram')
    const circuitSwitch = canvas.getByRole('switch', { name: 'Main circuit switch' })

    await expect(circuit).toHaveAttribute('data-circuit-interactive', 'false')
    await expect(circuitSwitch).toHaveAttribute('aria-disabled', 'true')
    await expect(circuitSwitch).toHaveAttribute('tabindex', '-1')
    await expect(circuitSwitch).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(circuitSwitch)
    await expect(circuitSwitch).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByText('The switch is closed.')).toBeVisible()
    expectSimpleScientificState(canvasElement, true)
  },
}

export const ReducedMotion = {
  args: {
    defaultClosed: false,
    reducedMotion: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const circuit = canvasElement.querySelector('.circuit-diagram')
    const circuitSwitch = canvas.getByRole('switch', { name: 'Main circuit switch' })

    await expect(circuit).toHaveClass('circuit-diagram--reduced-motion')
    await expect(circuit).toHaveAttribute('data-reduced-motion', 'true')

    await userEvent.click(circuitSwitch)
    const pulse = canvasElement.querySelector('.circuit-diagram__current-pulse')
    expect(window.getComputedStyle(pulse).display).toBe('none')
    expectSimpleScientificState(canvasElement, true)
  },
}

export const MobileWidth = {
  args: { defaultClosed: false },
  decorators: [
    Story => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    expectMobileContainment(canvasElement)
    const svg = canvasElement.querySelector('svg[data-circuit-canvas="360x210"]')
    await expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet')
  },
}

export const ParallelBranchesMobile = {
  args: {
    preset: 'parallelBranches',
  },
  decorators: [
    Story => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    expectMobileContainment(canvasElement)
    const hitTargets = [...canvasElement.querySelectorAll('[data-circuit-hit-target="true"]')]

    expect(hitTargets).toHaveLength(2)
    for (const target of hitTargets) {
      expect(Number(target.getAttribute('width'))).toBeGreaterThanOrEqual(64)
      expect(Number(target.getAttribute('height'))).toBeGreaterThanOrEqual(52)
    }
  },
}

export const MeasurementCircuitMobile = {
  args: {
    preset: 'measurementCircuit',
  },
  decorators: [
    Story => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    expectMobileContainment(canvasElement)
    const svg = canvasElement.querySelector('svg[data-circuit-canvas="360x220"]')
    await expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet')
  },
}

export const SymbolReference = {
  render: () => <CircuitSymbolReference />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const symbols = canvasElement.querySelectorAll('[data-circuit-reference-symbol]')

    expect(symbols).toHaveLength(14)
    await expect(canvas.getByText('Switch (open)')).toBeVisible()
    await expect(canvas.getByText('Battery')).toBeVisible()
    await expect(canvas.getByText('Thermistor')).toBeVisible()
    await expect(canvas.getByText('LDR')).toBeVisible()
    await expect(canvas.getByText('LED')).toBeVisible()
    await expect(canvas.queryAllByRole('switch')).toHaveLength(0)
  },
}

export const SymbolReferenceMobile = {
  render: () => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <CircuitSymbolReference />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const reference = canvasElement.querySelector('section')
    const width = reference?.getBoundingClientRect().width ?? Infinity

    expect(width).toBeLessThanOrEqual(320.5)
    expect(reference?.scrollWidth).toBeLessThanOrEqual(reference?.clientWidth)
  },
}
