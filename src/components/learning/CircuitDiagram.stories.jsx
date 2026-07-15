import { expect, userEvent, within } from 'storybook/test'
import CircuitDiagram from './CircuitDiagram.jsx'

const symbolLibraryPreset = {
  id: 'symbolLibraryPreview',
  canvas: {
    width: 380,
    height: 205,
    safeInset: 16,
  },
  maxWidth: 520,
  accessibilityLabel: 'Reusable GCSE circuit symbol library',
  primarySwitchId: 'switch-preview',
  paths: [],
  currentPaths: [],
  components: [
    { id: 'cell-preview', type: 'cell', x: 45, y: 34, showPolarity: true },
    { id: 'battery-preview', type: 'battery', x: 120, y: 22, cells: 2 },
    { id: 'resistor-preview', type: 'resistor', cx: 220, cy: 45 },
    { id: 'junction-preview', type: 'junction', cx: 315, cy: 45, radius: 5 },
    { id: 'ammeter-preview', type: 'ammeter', cx: 65, cy: 125 },
    { id: 'voltmeter-preview', type: 'voltmeter', cx: 150, cy: 125 },
    {
      id: 'lamp-preview',
      type: 'lamp',
      cx: 235,
      cy: 125,
      activeWhen: { always: true },
    },
    {
      id: 'switch-preview',
      type: 'switch',
      left: 290,
      right: 350,
      y: 125,
      defaultClosed: false,
      accessibilityLabel: 'Preview switch',
    },
  ],
  labels: [
    { id: 'cell-label', x: 45, y: 82, text: 'Cell', textAnchor: 'middle', tone: 'secondary' },
    { id: 'battery-label', x: 120, y: 82, text: 'Battery', textAnchor: 'middle', tone: 'secondary' },
    { id: 'resistor-label', x: 220, y: 82, text: 'Resistor', textAnchor: 'middle', tone: 'secondary' },
    { id: 'junction-label', x: 315, y: 82, text: 'Junction', textAnchor: 'middle', tone: 'secondary' },
    { id: 'ammeter-label', x: 65, y: 162, text: 'Ammeter', textAnchor: 'middle', tone: 'secondary' },
    { id: 'voltmeter-label', x: 150, y: 162, text: 'Voltmeter', textAnchor: 'middle', tone: 'secondary' },
    { id: 'lamp-label', x: 235, y: 162, text: 'Lamp', textAnchor: 'middle', tone: 'secondary' },
    { id: 'switch-label', x: 320, y: 162, text: 'Switch', textAnchor: 'middle', tone: 'secondary' },
  ],
  presentationStates: [
    {
      id: 'default',
      default: true,
      heading: 'One governed GCSE symbol family.',
      explanation: 'Future circuit presets reuse these symbols rather than drawing local alternatives.',
      headingTone: 'primary',
    },
  ],
}

function getScientificState(canvasElement) {
  return {
    lamp: canvasElement.querySelector('[data-circuit-component="lamp"]'),
    currentPath: canvasElement.querySelector('[data-circuit-component="current-path"]'),
  }
}

function expectScientificState(canvasElement, active) {
  const { lamp, currentPath } = getScientificState(canvasElement)
  const expected = active ? 'true' : null

  expect(lamp?.getAttribute('data-active')).toBe(expected)
  expect(currentPath?.getAttribute('data-active')).toBe(expected)
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
    expectScientificState(canvasElement, false)

    await userEvent.click(circuitSwitch)
    await expect(circuitSwitch).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByText('The switch is closed.')).toBeVisible()
    expectScientificState(canvasElement, true)

    circuitSwitch.focus()
    await userEvent.keyboard(' ')
    await expect(circuitSwitch).toHaveAttribute('aria-checked', 'false')
    await expect(canvas.getByText('The switch is open.')).toBeVisible()
    expectScientificState(canvasElement, false)
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
    expectScientificState(canvasElement, false)

    switchB.focus()
    await userEvent.keyboard('{Enter}')
    await expect(switchB).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByText('Both switches are closed.')).toBeVisible()
    expectScientificState(canvasElement, true)

    switchA.focus()
    await userEvent.keyboard(' ')
    await expect(switchA).toHaveAttribute('aria-checked', 'false')
    await expect(canvas.getByText('Switch A is open.')).toBeVisible()
    expectScientificState(canvasElement, false)
  },
}

export const PredictThenTest = {
  args: {
    preset: 'twoSwitchSeries',
    mode: 'predictThenTest',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchA = canvas.getByRole('switch', { name: 'Switch A' })
    const switchB = canvas.getByRole('switch', { name: 'Switch B' })
    const correctPrediction = canvas.getByRole('radio', { name: 'The bulb will light' })

    await expect(switchA).toHaveAttribute('aria-disabled', 'true')
    await expect(switchB).toHaveAttribute('aria-disabled', 'true')
    await expect(switchA).toHaveAttribute('tabindex', '-1')
    await expect(switchB).toHaveAttribute('tabindex', '-1')

    await userEvent.click(correctPrediction)
    await expect(correctPrediction).toBeChecked()
    await expect(switchA).not.toHaveAttribute('aria-disabled')
    await expect(switchB).not.toHaveAttribute('aria-disabled')
    await expect(switchB).toHaveAttribute('tabindex', '0')

    switchB.focus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByText(/Prediction matched\./)).toBeVisible()
    await expect(canvas.getByText('Both switches are closed.')).toBeVisible()
    expectScientificState(canvasElement, true)
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
    expectScientificState(canvasElement, true)
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

export const TwoSwitchSeriesMobile = {
  args: {
    preset: 'twoSwitchSeries',
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

export const PredictThenTestMobile = {
  args: {
    preset: 'twoSwitchSeries',
    mode: 'predictThenTest',
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
  },
}

export const SymbolLibrary = {
  args: { preset: symbolLibraryPreset },
}
