import { describe, it, expect } from 'vitest'
import { CHAPTERS } from '../../src/chapters.js'
import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'

const registryIds = new Set(Object.keys(CHAPTER_CONTENT_LOADERS))
const stubs = CHAPTERS.filter(chapter => chapter.screenCount === 0)
const built = CHAPTERS.filter(chapter => chapter.screenCount > 0)

describe('Chapter metadata integrity — stubs (screenCount === 0)', () => {
  it('every stub has screenTags: []', () => {
    for (const meta of stubs) {
      expect(
        meta.screenTags,
        `[${meta.id}] stub must have screenTags: []`,
      ).toEqual([])
    }
  })

  it('every stub has a registry entry in CHAPTER_CONTENT_LOADERS', () => {
    for (const meta of stubs) {
      expect(
        registryIds.has(meta.id),
        `[${meta.id}] stub missing from CHAPTER_CONTENT_LOADERS in chapterContentRegistry.js`,
      ).toBe(true)
    }
  })
})

describe('Chapter metadata integrity — built chapters (screenCount > 0)', () => {
  it('every built chapter has a registry entry', () => {
    for (const meta of built) {
      expect(
        registryIds.has(meta.id),
        `[${meta.id}] missing from CHAPTER_CONTENT_LOADERS in chapterContentRegistry.js`,
      ).toBe(true)
    }
  })

  it('metadata.screenTags.length matches metadata.screenCount', () => {
    for (const meta of built) {
      expect(
        meta.screenTags.length,
        `[${meta.id}] screenTags.length=${meta.screenTags.length} ≠ screenCount=${meta.screenCount}`,
      ).toBe(meta.screenCount)
    }
  })

  it('metadata.screenCount matches loaded content screens.length', async () => {
    for (const meta of built) {
      const loader = CHAPTER_CONTENT_LOADERS[meta.id]
      if (!loader) continue
      const content = await loader()
      expect(
        meta.screenCount,
        `[${meta.id}] metadata.screenCount=${meta.screenCount} ≠ content.screens.length=${content.screens.length}`,
      ).toBe(content.screens.length)
    }
  })

  it('metadata.screenTags match actual screen tags from loaded content', async () => {
    for (const meta of built) {
      const loader = CHAPTER_CONTENT_LOADERS[meta.id]
      if (!loader) continue
      const content = await loader()
      const actualTags = content.screens.map(screen => screen.tag ?? null)
      expect(
        meta.screenTags,
        `[${meta.id}] screenTags in the chapter catalogue do not match content screen tags`,
      ).toEqual(actualTags)
    }
  })
})

describe('Chapter metadata integrity — registry completeness', () => {
  it('every registry entry has matching chapter metadata', () => {
    const chapterIds = new Set(CHAPTERS.map(chapter => chapter.id))
    for (const id of registryIds) {
      expect(
        chapterIds.has(id),
        `[${id}] in CHAPTER_CONTENT_LOADERS has no chapter metadata entry`,
      ).toBe(true)
    }
  })
})
