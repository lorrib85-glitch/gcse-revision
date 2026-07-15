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
}

export const InteractiveClosed = {
  args: { defaultClosed: true },
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
}

export const SymbolLibrary = {
  args: { preset: symbolLibraryPreset },
}
