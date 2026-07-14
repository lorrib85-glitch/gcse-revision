import CircuitDiagram from './CircuitDiagram.jsx'

export default {
  title: 'Learning/CircuitDiagram',
  component: CircuitDiagram,
}

export const OpenSwitch = {
  args: { closed: false },
}

export const ClosedSwitch = {
  args: { closed: true },
}
