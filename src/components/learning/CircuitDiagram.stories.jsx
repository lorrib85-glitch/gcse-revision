import CircuitDiagram from './CircuitDiagram.jsx'

export default {
  title: 'Learning/CircuitDiagram',
  component: CircuitDiagram,
  parameters: {
    layout: 'centered',
  },
}

export const InteractiveOpen = {
  args: { defaultClosed: false },
}

export const InteractiveClosed = {
  args: { defaultClosed: true },
}
