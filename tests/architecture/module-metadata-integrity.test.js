import { describe, expect, it } from 'vitest'
import {
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
} from '../../src/data/learnerCurriculum.js'

const loaderIds = new Set(Object.keys(CHAPTER_CONTENT_LOADERS))
const built = CURRICULUM_CHAPTERS.filter(chapter => chapter.screenCount > 0)
const zeroScreen = CURRICULUM_CHAPTERS.filter(chapter => chapter.screenCount === 0)

describe('generated Chapter metadata integrity', () => {
  it('derives an empty screenTags array for every zero-screen Chapter', () => {
    for (const chapter of zeroScreen) expect(chapter.screenTags, chapter.id).toEqual([])
  })

  it('gives every built Chapter a loader and matching derived metadata', async () => {
    for (const chapter of built) {
      expect(loaderIds.has(chapter.id), chapter.id).toBe(true)
      const content = await CHAPTER_CONTENT_LOADERS[chapter.id]()
      expect(chapter.screenCount, chapter.id).toBe(content.screens.length)
      expect(chapter.screenTags, chapter.id).toEqual(content.screens.map(screen => screen.tag ?? null))
    }
  })

  it('keeps every loader attached to canonical Chapter metadata', () => {
    const chapterIds = new Set(CURRICULUM_CHAPTERS.map(chapter => chapter.id))
    for (const id of loaderIds) expect(chapterIds.has(id), id).toBe(true)
  })

  it('does not manufacture loaders for the six planned Chapters with no source file', () => {
    const withoutLoader = CURRICULUM_CHAPTERS.filter(chapter => !loaderIds.has(chapter.id))
    expect(withoutLoader).toHaveLength(6)
    for (const chapter of withoutLoader) {
      expect(chapter.status, chapter.id).toBe('planned')
      expect(chapter.screenCount, chapter.id).toBe(0)
    }
  })
})
