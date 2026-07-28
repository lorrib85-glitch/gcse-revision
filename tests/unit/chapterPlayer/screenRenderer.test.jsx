import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ScreenContentRenderer } from '../../../src/components/layout/ScreenRenderer.jsx'

describe('ScreenContentRenderer authored data variants', () => {
  it('renders a single scenario object without requiring a scenarios array', () => {
    const html = renderToStaticMarkup(
      <ScreenContentRenderer
        subject="Sociology"
        screen={{
          blocks: [{
            type: 'scenario',
            situation: 'A family makes a difficult choice.',
            options: ['Option A', 'Option B'],
            correctIndex: 0,
            explanation: 'The evidence supports option A.',
          }],
        }}
      />,
    )
    expect(html).toContain('A family makes a difficult choice.')
    expect(html).toContain('Option A')
  })

  it('renders point-list key points instead of producing an empty card', () => {
    const html = renderToStaticMarkup(
      <ScreenContentRenderer
        subject="History"
        screen={{ blocks: [{ type: 'keypoint', points: ['First governed point', 'Second governed point'] }] }}
      />,
    )
    expect(html).toContain('First governed point')
    expect(html).toContain('Second governed point')
  })
})
