import { describe, it, expect } from 'vitest'
import { MODULES } from '../../src/modules.js'
import { MEDICINE_EPISODES } from '../../src/content/history/medicine/index.js'
import episodeMedievalBeliefs from '../../src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js'
import episodeBlackDeath from '../../src/content/history/medicine/episodes/episode-02-black-death.js'
import episodeRenaissanceMedicine from '../../src/content/history/medicine/episodes/episode-03-renaissance-medicine.js'
import episodeSurgeryAnaesthetics from '../../src/content/history/medicine/episodes/episode-04-surgery-anaesthetics.js'
import episodeJenner from '../../src/content/history/medicine/episodes/episode-06-jenner-vaccination.js'
import episodeGermTheory from '../../src/content/history/medicine/episodes/episode-07-germ-theory.js'
import episodeGreatStink from '../../src/content/history/medicine/episodes/episode-08-great-stink.js'
import episodeSurgeryRevolution from '../../src/content/history/medicine/episodes/episode-09-surgery-revolution.js'
import episodeAccidentalMiracle from '../../src/content/history/medicine/episodes/episode-11-accidental-miracle.js'
import episodeWhenMedicineBecameMagic from '../../src/content/history/medicine/episodes/episode-12-when-medicine-became-magic.js'
import episodeCanWeBeatCancer from '../../src/content/history/medicine/episodes/episode-13-can-we-beat-cancer.js'
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

describe('Content registry — episode-03-renaissance-medicine', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeRenaissanceMedicine.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeRenaissanceMedicine.id)
    expect(episodeRenaissanceMedicine.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-03-* → number: 3)', () => {
    expect(episodeRenaissanceMedicine.number).toBe(3)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeRenaissanceMedicine.screens)).toBe(true)
    expect(episodeRenaissanceMedicine.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeRenaissanceMedicine.stageNavigation) return
    for (const stage of episodeRenaissanceMedicine.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeRenaissanceMedicine.stageNavigation) return
    for (const stage of episodeRenaissanceMedicine.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeRenaissanceMedicine.screens.length)
    }
  })
})

describe('Content registry — episode-04-surgery-anaesthetics', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeSurgeryAnaesthetics.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeSurgeryAnaesthetics.id)
    expect(episodeSurgeryAnaesthetics.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-04-* → number: 4)', () => {
    expect(episodeSurgeryAnaesthetics.number).toBe(4)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeSurgeryAnaesthetics.screens)).toBe(true)
    expect(episodeSurgeryAnaesthetics.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeSurgeryAnaesthetics.stageNavigation) return
    for (const stage of episodeSurgeryAnaesthetics.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeSurgeryAnaesthetics.stageNavigation) return
    for (const stage of episodeSurgeryAnaesthetics.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeSurgeryAnaesthetics.screens.length)
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

describe('Content registry — episode-08-great-stink', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeGreatStink.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeGreatStink.id)
    expect(episodeGreatStink.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-08-* → number: 8)', () => {
    expect(episodeGreatStink.number).toBe(8)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeGreatStink.screens)).toBe(true)
    expect(episodeGreatStink.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeGreatStink.stageNavigation) return
    for (const stage of episodeGreatStink.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeGreatStink.stageNavigation) return
    for (const stage of episodeGreatStink.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeGreatStink.screens.length)
    }
  })
})

describe('Content registry — episode-09-surgery-revolution', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeSurgeryRevolution.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeSurgeryRevolution.id)
    expect(episodeSurgeryRevolution.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-09-* → number: 9)', () => {
    expect(episodeSurgeryRevolution.number).toBe(9)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeSurgeryRevolution.screens)).toBe(true)
    expect(episodeSurgeryRevolution.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeSurgeryRevolution.stageNavigation) return
    for (const stage of episodeSurgeryRevolution.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeSurgeryRevolution.stageNavigation) return
    for (const stage of episodeSurgeryRevolution.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeSurgeryRevolution.screens.length)
    }
  })
})

describe('Content registry — episode-11-accidental-miracle', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeAccidentalMiracle.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeAccidentalMiracle.id)
    expect(episodeAccidentalMiracle.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-11-* → number: 11)', () => {
    expect(episodeAccidentalMiracle.number).toBe(11)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeAccidentalMiracle.screens)).toBe(true)
    expect(episodeAccidentalMiracle.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeAccidentalMiracle.stageNavigation) return
    for (const stage of episodeAccidentalMiracle.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeAccidentalMiracle.stageNavigation) return
    for (const stage of episodeAccidentalMiracle.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeAccidentalMiracle.screens.length)
    }
  })
})

describe('Content registry — episode-12-when-medicine-became-magic', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeWhenMedicineBecameMagic.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeWhenMedicineBecameMagic.id)
    expect(episodeWhenMedicineBecameMagic.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-12-* → number: 12)', () => {
    expect(episodeWhenMedicineBecameMagic.number).toBe(12)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeWhenMedicineBecameMagic.screens)).toBe(true)
    expect(episodeWhenMedicineBecameMagic.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeWhenMedicineBecameMagic.stageNavigation) return
    for (const stage of episodeWhenMedicineBecameMagic.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeWhenMedicineBecameMagic.stageNavigation) return
    for (const stage of episodeWhenMedicineBecameMagic.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeWhenMedicineBecameMagic.screens.length)
    }
  })
})

describe('Content registry — episode-13-can-we-beat-cancer', () => {
  it('id exists in src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeCanWeBeatCancer.id)
    expect(meta).toBeDefined()
  })

  it('number matches src/modules.js', () => {
    const meta = MODULES.find(m => m.id === episodeCanWeBeatCancer.id)
    expect(episodeCanWeBeatCancer.number).toBe(meta.number)
  })

  it('filename prefix matches episode number (episode-13-* → number: 13)', () => {
    expect(episodeCanWeBeatCancer.number).toBe(13)
  })

  it('screens array is non-empty', () => {
    expect(Array.isArray(episodeCanWeBeatCancer.screens)).toBe(true)
    expect(episodeCanWeBeatCancer.screens.length).toBeGreaterThan(0)
  })

  it('stageNavigation entries have id, title, and screenIndex', () => {
    if (!episodeCanWeBeatCancer.stageNavigation) return
    for (const stage of episodeCanWeBeatCancer.stageNavigation) {
      expect(stage).toHaveProperty('id')
      expect(stage).toHaveProperty('title')
      expect(stage).toHaveProperty('screenIndex')
    }
  })

  it('stageNavigation screenIndex values are within bounds', () => {
    if (!episodeCanWeBeatCancer.stageNavigation) return
    for (const stage of episodeCanWeBeatCancer.stageNavigation) {
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
      expect(stage.screenIndex).toBeLessThan(episodeCanWeBeatCancer.screens.length)
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

  it('includes the renaissance medicine episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-renaissance-medicine')).toBeDefined()
  })

  it('includes the surgery & anaesthetics episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-surgery-anaesthetics')).toBeDefined()
  })

  it('includes the jenner episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-jenner-vaccination')).toBeDefined()
  })

  it('includes the germ theory episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-germ-theory')).toBeDefined()
  })

  it('includes the great stink episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-great-stink')).toBeDefined()
  })

  it('includes the surgery revolution episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-surgery-revolution')).toBeDefined()
  })

  it('includes the accidental miracle episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-accidental-miracle')).toBeDefined()
  })

  it('includes the when medicine became magic episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-modern-medicine')).toBeDefined()
  })

  it('includes the can we beat cancer episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-cancer')).toBeDefined()
  })

  it('includes the western front episode', () => {
    expect(MEDICINE_EPISODES.find(m => m.id === 'history-medicine-western-front')).toBeDefined()
  })
})

