import { describe, expect, it } from 'vitest'
import { episode } from '../../src/content/history/medicine/episodes/episode-03-vesalius-beginning-doubt.js'

describe('Episode 3 FactorWeb configuration', () => {
  const factorWeb = episode.screens.find(screen => screen.type === 'factorWeb')

  it('keeps the approved Vesalius focal asset in chapter content rather than the shared component', () => {
    expect(factorWeb).toBeDefined()
    expect(factorWeb.title).toBe('Why could Vesalius challenge Galen?')
    expect(factorWeb.centreLabel).toBe('Vesalius')
    expect(factorWeb.centreImage).toBe('/images/vesalius-factorweb-portrait.webp')
    expect(factorWeb.centreImageAlt).toBe('Portrait of the Renaissance anatomist Andreas Vesalius')
  })

  it('orders six factors as three left and three right for the split composition', () => {
    expect(factorWeb.factors.map(factor => factor.id)).toEqual([
      'vesalius',
      'printing',
      'reformation',
      'human-dissection',
      'anatomy-theatres',
      'humanism',
    ])
  })

  it('does not carry legacy emoji presentation data', () => {
    expect(factorWeb.factors.every(factor => factor.icon == null)).toBe(true)
  })
})
