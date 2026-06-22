import { describe, it, expect } from 'vitest'
import { MODULES } from '../../src/modules.js'
import { HISTORY_MODULES } from '../../src/modules/history.js'
import { MEDICINE_EPISODES } from '../../src/content/history/medicine/index.js'
import episodeMedievalBeliefs from '../../src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js'
import episodeBlackDeath from '../../src/content/history/medicine/episodes/episode-02-black-death.js'
import episodeJenner from '../../src/content/history/medicine/episodes/episode-06-jenner-vaccination.js'
import episodeGermTheory from '../../src/content/history/medicine/episodes/episode-07-germ-theory.js'
import episodeWesternFront from '../../src/content/history/medicine/episodes/episode-14-western-front.js'

// ─── Per-episode guards ───────────────────────────────────────────────────────

describe('Content registry — episode-01-medieval-beliefs-causes', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeMedievalBeliefs.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeMedievalBeliefs.id)
    expect(episodeMedievalBeliefs.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-01-* → number: 1)', () => {
    expect(episodeMedievalBeliefs.number).toBe(1)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeMedievalBeliefs.screens)).toBe(true)
    expect(episodeMedievalBeliefs.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeMedievalBeliefs.stageNavigation) return
    for (const stage of episodeMedievalBeliefs.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeMedievalBeliefs.stageNavigation) return
    for (const stage of episodeMedievalBeliefs.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeMedievalBeliefs.screens.length)
    }
  })
})

describe('Content registry — episode-02-black-death', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeBlackDeath.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeBlackDeath.id)
    expect(episodeBlackDeath.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-02-* → number: 2)', () => {
    expect(episodeBlackDeath.number).toBe(2)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeBlackDeath.screens)).toBe(true)
    expect(episodeBlackDeath.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeBlackDeath.stageNavigation) return
    for (const stage of episodeBlackDeath.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeBlackDeath.stageNavigation) return
    for (const stage of episodeBlackDeath.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeBlackDeath.screens.length)
    }
  })
})

describe('Content registry — episode-06-jenner-vaccination', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeJenner.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeJenner.id)
    expect(episodeJenner.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-06-* → number: 6)', () => {
    expect(episodeJenner.number).toBe(6)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeJenner.screens)).toBe(true)
    expect(episodeJenner.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeJenner.stageNavigation) return
    for (const stage of episodeJenner.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeJenner.stageNavigation) return
    for (const stage of episodeJenner.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeJenner.screens.length)
    }
  })
})

describe('Content registry — episode-07-germ-theory', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeGermTheory.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeGermTheory.id)
    expect(episodeGermTheory.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-07-* → number: 7)', () => {
    expect(episodeGermTheory.number).toBe(7)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeGermTheory.screens)).toBe(true)
    expect(episodeGermTheory.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeGermTheory.stageNavigation) return
    for (const stage of episodeGermTheory.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeGermTheory.stageNavigation) return
    for (const stage of episodeGermTheory.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeGermTheory.screens.length)
    }
  })
})

describe('Content registry — episode-14-western-front', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeWesternFront.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeWesternFront.id)
    expect(episodeWesternFront.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-14-* → number: 14)', () => {
    expect(episodeWesternFront.number).toBe(14)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeWesternFront.screens)).toBe(true)
    expect(episodeWesternFront.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeWesternFront.stageNavigation) return
    for (const stage of episodeWesternFront.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeWesternFront.stageNavigation) return
    for (const stage of episodeWesternFront.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeWesternFront.screens.length)
    }
  })
})

// ─── Series index guards ──────────────────────────────────────────────────────

describe('Content registry — series index (MEDICINE_EPISODES)', () => {
  it('episodes are in ascending number order', () => {
    const numbers = MEDICINE_EPISODES.map(e => e.number)
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
  })

  it('includes the medieval beliefs episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-medieval-beliefs-causes')).toBeDefined()
  })

  it('includes the black death episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-black-death')).toBeDefined()
  })

  it('includes the jenner episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-jenner-vaccination')).toBeDefined()
  })

  it('includes the germ theory episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-germ-theory')).toBeDefined()
  })

  it('includes the western front episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-western-front')).toBeDefined()
  })
})

// ─── Compatibility export guards ─────────────────────────────────────────────

describe('Content registry — compatibility layer (HISTORY_MODULES)', () => {
  it('includes the medieval beliefs episode', () => {
    expect(HISTORY_MODULES.find(m => m.id === 'history-medicine-medieval-beliefs-causes')).toBeDefined()
  })

  it('medieval beliefs episode has screens', () => {
    const ep = HISTORY_MODULES.find(m => m.id === 'history-medicine-medieval-beliefs-causes')
    expect(ep?.screens?.length).toBeGreaterThan(0)
  })

  it('includes the black death episode', () => {
    expect(HISTORY_MODULES.find(m => m.id === 'history-medicine-black-death')).toBeDefined()
  })

  it('black death episode has screens', () => {
    const ep = HISTORY_MODULES.find(m => m.id === 'history-medicine-black-death')
    expect(ep?.screens?.length).toBeGreaterThan(0)
  })

  it('includes the jenner episode', () => {
    expect(HISTORY_MODULES.find(m => m.id === 'history-medicine-jenner-vaccination')).toBeDefined()
  })

  it('jenner episode has screens', () => {
    const ep = HISTORY_MODULES.find(m => m.id === 'history-medicine-jenner-vaccination')
    expect(ep?.screens?.length).toBeGreaterThan(0)
  })

  it('includes the germ theory episode', () => {
    expect(HISTORY_MODULES.find(m => m.id === 'history-medicine-germ-theory')).toBeDefined()
  })

  it('germ theory episode has screens', () => {
    const ep = HISTORY_MODULES.find(m => m.id === 'history-medicine-germ-theory')
    expect(ep?.screens?.length).toBeGreaterThan(0)
  })

  it('includes the western front episode', () => {
    expect(HISTORY_MODULES.find(m => m.id === 'history-medicine-western-front')).toBeDefined()
  })

  it('western front episode has screens', () => {
    const ep = HISTORY_MODULES.find(m => m.id === 'history-medicine-western-front')
    expect(ep?.screens?.length).toBeGreaterThan(0)
  })
})
