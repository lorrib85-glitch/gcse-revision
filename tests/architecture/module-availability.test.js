import { describe, expect, it } from 'vitest'
import {
  CURRICULUM_CHAPTERS,
  CURRICULUM_MODULES,
  CHAPTER_CONTENT_LOADERS,
  isChapterAvailable,
} from '../../src/data/learnerCurriculum.js'
import { TAG_CHAPTER_MAP } from '../../src/data/tagChapterMap.js'

const chapterById = new Map(CURRICULUM_CHAPTERS.map(chapter => [chapter.id, chapter]))

describe('canonical Chapter availability', () => {
  it('is authored as status and requires real screens to become openable', () => {
    expect(isChapterAvailable({ status: 'available', screenCount: 5 })).toBe(true)
    expect(isChapterAvailable({ status: 'available', screenCount: 0 })).toBe(false)
    expect(isChapterAvailable({ status: 'planned', screenCount: 5 })).toBe(false)
    expect(isChapterAvailable(null)).toBe(false)
    for (const chapter of CURRICULUM_CHAPTERS) {
      expect(['available', 'planned']).toContain(chapter.status)
      expect(isChapterAvailable(chapter)).toBe(chapter.status === 'available' && chapter.screenCount > 0)
    }
  })

  it('gives every available Chapter loadable non-empty content', async () => {
    const available = CURRICULUM_CHAPTERS.filter(isChapterAvailable)
    expect(available).toHaveLength(30)
    for (const chapter of available) {
      const loader = CHAPTER_CONTENT_LOADERS[chapter.id]
      expect(loader, chapter.id).toBeTypeOf('function')
      expect((await loader()).screens.length, chapter.id).toBeGreaterThan(0)
    }
  })
})

describe('canonical Module and recovery discovery safety', () => {
  it('resolves every canonical Module Chapter reference', () => {
    for (const module of CURRICULUM_MODULES) {
      for (const ref of module.chapterRefs) {
        expect(chapterById.has(ref.chapterId), `${module.id} → ${ref.chapterId}`).toBe(true)
      }
    }
  })

  it('keeps every current weak-spot route on an available Chapter', () => {
    for (const [tag, target] of Object.entries(TAG_CHAPTER_MAP)) {
      if (target === null) continue
      expect(isChapterAvailable(chapterById.get(target)), `${tag} → ${target}`).toBe(true)
    }
  })
})
