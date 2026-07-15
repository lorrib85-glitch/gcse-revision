import CircuitDiagram from './CircuitDiagram.jsx'

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
