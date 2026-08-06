import { describe, expect, it } from 'vitest'
import {
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
  getLearningSequenceById,
} from '../../src/data/learnerCurriculum.js'
import { canonicalChapterId } from '../../src/data/chapterProgress.js'
import { MEDICINE_EPISODES } from '../../src/content/history/medicine/index.js'

const chapterById = new Map(CURRICULUM_CHAPTERS.map(chapter => [chapter.id, chapter]))
const expectedBuiltMedicineIds = [
  'history-medicine-medieval-beliefs-causes',
  'history-medicine-black-death',
  'history-medicine-vesalius-beginning-doubt',
  'history-medicine-harvey-pare-renaissance-method',
  'history-medicine-surgery-anaesthetics',
  'history-medicine-great-plague-1665',
  'history-medicine-jenner-vaccination',
  'history-medicine-germ-theory',
  'history-medicine-great-stink',
  'history-medicine-surgery-revolution',
  'history-medicine-accidental-miracle',
  'history-medicine-modern-medicine',
  'history-medicine-cancer',
  'history-medicine-western-front',
]

describe('Medicine content registry', () => {
  it('contains every built canonical Medicine Chapter exactly once', () => {
    const reviewIds = MEDICINE_EPISODES.map(episode => episode.id)
    expect(reviewIds).toEqual(expectedBuiltMedicineIds)
    expect(new Set(reviewIds).size).toBe(reviewIds.length)

    const sequence = getLearningSequenceById('history-medicine')
    const builtFromSequence = sequence.chapterIds
      .filter(id => CHAPTER_CONTENT_LOADERS[id])
      .filter(id => chapterById.get(id)?.screenCount > 0)

    // This file is a content-review convenience, not a runtime ordering
    // authority. Canonical learner order belongs to the Learning Sequence.
    expect(new Set(reviewIds)).toEqual(new Set(builtFromSequence))
  })

  it('resolves every episode to canonical metadata and the generated loader', async () => {
    for (const episode of MEDICINE_EPISODES) {
      const chapter = chapterById.get(episode.id)
      expect(chapter, episode.id).toBeDefined()
      expect(chapter.status, episode.id).toBe('available')
      expect(chapter.screenCount, episode.id).toBe(episode.screens.length)
      expect(chapter.screenTags, episode.id).toEqual(episode.screens.map(screen => screen.tag ?? null))
      expect(CHAPTER_CONTENT_LOADERS[episode.id], episode.id).toBeTypeOf('function')
      expect((await CHAPTER_CONTENT_LOADERS[episode.id]()).id, episode.id).toBe(episode.id)
      expect(chapter, episode.id).not.toHaveProperty('number')
    }
  })

  it('keeps content-file episode numbers local to the content series', () => {
    const numbers = MEDICINE_EPISODES.map(episode => episode.number)
    expect(numbers.every(Number.isInteger)).toBe(true)
    expect(numbers).toEqual([...numbers].sort((left, right) => left - right))
    // Two distinct Chapter journeys deliberately share the historical episode
    // number 4; canonical ordering is owned by Module chapterRefs, not this field.
    expect(numbers.filter(number => number === 4)).toHaveLength(2)
  })

  it('validates every stage-navigation entry against its own screens', () => {
    for (const episode of MEDICINE_EPISODES) {
      for (const stage of episode.stageNavigation ?? []) {
        expect(stage).toHaveProperty('id')
        expect(stage).toHaveProperty('title')
        expect(stage.screenIndex, `${episode.id}:${stage.id}`).toBeGreaterThanOrEqual(0)
        expect(stage.screenIndex, `${episode.id}:${stage.id}`).toBeLessThan(episode.screens.length)
      }
    }
  })

  it('keeps the superseded Renaissance bundle outside the registry', () => {
    const oldId = 'history-medicine-renaissance-medicine'
    expect(MEDICINE_EPISODES.some(episode => episode.id === oldId)).toBe(false)
    expect(chapterById.has(oldId)).toBe(false)
    expect(CHAPTER_CONTENT_LOADERS).not.toHaveProperty(oldId)
    expect(canonicalChapterId(oldId)).toBe('history-medicine-vesalius-beginning-doubt')
  })
})
