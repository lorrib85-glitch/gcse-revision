import { describe, it, expect } from 'vitest'
import { HISTORY_MODULES } from '../../src/modules/history.js'
import { MEDICINE_EPISODES } from '../../src/content/history/medicine/index.js'
import episodeJenner from '../../src/content/history/medicine/episodes/episode-03-jenner-vaccination.js'

describe('Content registry — episode-03-jenner-vaccination', () => {
  it('episode file exports an object with the correct id', () => {
    expect(episodeJenner.id).toBe('history-medicine-jenner-vaccination')
  })

  it('episode has at least one screen', () => {
    expect(Array.isArray(episodeJenner.screens)).toBe(true)
    expect(episodeJenner.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries all have id, title, and screenIndex', () => {
    if (!episodeJenner.stageNavigation) return
    for (const stage of episodeJenner.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })
})

describe('Content registry — series index (MEDICINE_EPISODES)', () => {
  it('includes the jenner episode', () => {
    const jenner = MEDICINE_EPISODES.find(m => m.id === 'history-medicine-jenner-vaccination')
    expect(jenner).toBeDefined()
  })
})

describe('Content registry — compatibility layer (HISTORY_MODULES)', () => {
  it('HISTORY_MODULES still exports the jenner episode', () => {
    const jenner = HISTORY_MODULES.find(m => m.id === 'history-medicine-jenner-vaccination')
    expect(jenner).toBeDefined()
  })

  it('jenner episode in HISTORY_MODULES has screens', () => {
    const jenner = HISTORY_MODULES.find(m => m.id === 'history-medicine-jenner-vaccination')
    expect(jenner?.screens?.length).toBeGreaterThan(0)
  })
})
