import { describe, it, expect } from 'vitest'
import {
  CHAPTERS,
  isChapterAvailable,
  getChapterAvailability,
  CHAPTER_AVAILABILITY,
} from '../../src/chapters.js'
import { MODULES } from '../../src/data/modules.js'
import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'
import { TAG_CHAPTER_MAP } from '../../src/data/tagChapterMap.js'

const chapterById = new Map(CHAPTERS.map(chapter => [chapter.id, chapter]))

// Governs incomplete-chapter safety: a learner must never be planned into,
// recommended into, or land inside an unbuilt chapter.

describe('Chapter availability — derivation', () => {
  it('derives availability from screenCount when not explicitly set', () => {
    expect(getChapterAvailability({ screenCount: 5 })).toBe(CHAPTER_AVAILABILITY.AVAILABLE)
    expect(getChapterAvailability({ screenCount: 0 })).toBe(CHAPTER_AVAILABILITY.COMING_SOON)
    expect(getChapterAvailability(null)).toBe(CHAPTER_AVAILABILITY.HIDDEN)
  })

  it('an explicit availability field overrides the screenCount derivation', () => {
    expect(getChapterAvailability({ screenCount: 5, availability: 'hidden' })).toBe('hidden')
    expect(getChapterAvailability({ screenCount: 0, availability: 'available' })).toBe('available')
  })

  it('every available chapter has real, loadable content', async () => {
    for (const chapter of CHAPTERS.filter(isChapterAvailable)) {
      expect(chapter.screenCount, `${chapter.id} available but screenCount 0`).toBeGreaterThan(0)
      const loader = CHAPTER_CONTENT_LOADERS[chapter.id]
      expect(loader, `${chapter.id} available but has no content loader`).toBeTypeOf('function')
      const content = await loader()
      expect(content.screens.length, `${chapter.id} available but loads no screens`).toBeGreaterThan(0)
    }
  })

  it('every explicitly non-available metadata value is a known governance state', () => {
    for (const chapter of CHAPTERS) {
      if (!chapter.availability) continue
      expect(Object.values(CHAPTER_AVAILABILITY)).toContain(chapter.availability)
    }
  })
})

describe('Module and chapter discovery safety', () => {
  it('every chapter a module can select is real metadata, never a dangling id', () => {
    for (const module of MODULES) {
      for (const chapterId of module.chapterIds) {
        expect(
          chapterById.has(chapterId),
          `Module "${module.id}" references unknown chapter "${chapterId}"`,
        ).toBe(true)
      }
    }
  })

  it('weak-spot recovery never targets a non-available chapter', () => {
    for (const [tag, target] of Object.entries(TAG_CHAPTER_MAP)) {
      if (target === null) continue
      const chapter = chapterById.get(target)
      expect(
        isChapterAvailable(chapter),
        `tag "${tag}" recovery-routes to "${target}", which is not available`,
      ).toBe(true)
    }
  })
})
