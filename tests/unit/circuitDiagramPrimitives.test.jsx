import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import CircuitDiagram from '../../src/components/learning/CircuitDiagram.jsx'

const symbolPreset = {
  id: 'symbol-test',
  viewBox: '0 0 400 220',
  accessibilityLabel: 'Circuit symbol renderer test',
  paths: [{ id: 'wire', d: 'M10,10 H100' }],
  currentPaths: [],
  components: [
    { id: 'cell', type: 'cell', x: 30, y: 30 },
    { id: 'battery', type: 'battery', x: 80, y: 20 },
    { id: 'lamp', type: 'lamp', cx: 140, cy: 40, activeWhen: { always: true } },
    { id: 'resistor', type: 'resistor', cx: 200, cy: 40 },
    { id: 'ammeter', type: 'ammeter', cx: 260, cy: 40 },
    { id: 'voltmeter', type: 'voltmeter', cx: 320, cy: 40 },
    { id: 'junction', type: 'junction', cx: 360, cy: 40 },
    {
      id: 'switch',
      type: 'switch',
      left: 120,
      right: 180,
      y: 130,
      defaultClosed: false,
    },
  ],
  labels: [],
  presentationStates: [
    {
      id: 'default',
      default: true,
      heading: 'Symbols',
      explanation: 'Reusable symbol test.',
      headingTone: 'primary',
    },
  ],
}

describe('CircuitDiagram symbol renderer', () => {
  it('renders the governed GCSE circuit symbol family from configuration', () => {
    const markup = renderToStaticMarkup(<CircuitDiagram preset={symbolPreset} />)

    expect(markup).toContain('data-circuit-component="wire"')
    expect(markup).toContain('data-circuit-component="cell"')
    expect(markup).toContain('data-circuit-component="battery"')
    expect(markup).toContain('data-circuit-component="lamp"')
    expect(markup).toContain('data-circuit-component="resistor"')
    expect(markup).toContain('data-circuit-component="ammeter"')
    expect(markup).toContain('data-circuit-component="voltmeter"')
    expect(markup).toContain('data-circuit-component="junction"')
    expect(markup).toContain('data-circuit-component="switch"')
  })

  it('applies declarative active state to symbols without bespoke renderer logic', () => {
    const markup = renderToStaticMarkup(<CircuitDiagram preset={symbolPreset} />)

    expect(markup).toContain('data-circuit-component="lamp" data-active="true"')
    expect(markup).toContain('role="switch"')
    expect(markup).toContain('aria-checked="false"')
  })
})
