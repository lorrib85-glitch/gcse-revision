import { describe, it, expect } from 'vitest'
import { TAG_CHAPTER_MAP, findTaggedChapterScreen } from '../../src/data/tagChapterMap.js'
import {
  CURRICULUM_CHAPTERS as CHAPTERS,
} from '../../src/data/learnerCurriculum.js'
import {
  CHAPTER_CONTENT_LOADERS,
} from '../../src/data/learnerCurriculum.js'

// Guards the weakness → recovery routing chain:
//   weakness tag → TAG_CHAPTER_MAP → chapter → tagged screen → screen index
// A break anywhere here means a learner is routed to missing content or the
// wrong teaching screen.

const chapterById = new Map(CHAPTERS.map(chapter => [chapter.id, chapter]))
const entries = Object.entries(TAG_CHAPTER_MAP)

// Legacy mappings that still open at screen 0 because no explicit tagged
// screen exists yet. Shrink only by individual tag; never add chapter-wide
// exemptions and never use this for new mappings.
const LEGACY_SCREEN_ZERO_RECOVERY_TAGS = new Set([
  'black-death',
  'communication',
  'diagnosis',
  'genetics',
  'lifestyle-factors',
  'medieval-causes',
  'medieval-prevention',
  'nhs',
  'nightingale',
  'royal-society',
  'scientific-method',
  'surgery',
  'war-and-medicine',
])

describe('Recovery routing — TAG_CHAPTER_MAP integrity', () => {
  it('every mapping value is either a real chapter id or an explicit null', () => {
    for (const [tag, target] of entries) {
      if (target === null) continue
      expect(
        chapterById.has(target),
        `tag "${tag}" maps to "${target}", which is not in the chapter catalogue`,
      ).toBe(true)
    }
  })

  it('null targets are intentional, not accidental', () => {
    const nonRecoverable = entries
      .filter(([, target]) => target === null)
      .map(([tag]) => tag)
    expect(nonRecoverable).toEqual(['factors-in-change'])
  })

  it('new non-null mappings resolve to explicit tagged screens instead of implicit screen 0', () => {
    for (const [tag, target] of entries) {
      if (target === null) continue
      const chapter = chapterById.get(target)
      if (LEGACY_SCREEN_ZERO_RECOVERY_TAGS.has(tag)) continue
      expect(
        chapter.screenTags || [],
        `tag "${tag}" routes to "${target}" but is not an explicit screenTag; add a tagged screen or a shrink-only legacy exception`,
      ).toContain(tag)
      const index = findTaggedChapterScreen(chapter, tag)
      expect(index, `tag "${tag}" not found in ${target}.screenTags`).toBeTypeOf('number')
      expect(
        index,
        `tag "${tag}" → index ${index} out of range for ${target} (screenCount ${chapter.screenCount})`,
      ).toBeLessThan(chapter.screenCount)
      expect(index).toBeGreaterThanOrEqual(0)
    }
  })

  it('every mapped chapter has real content', () => {
    for (const [tag, target] of entries) {
      if (target === null) continue
      const chapter = chapterById.get(target)
      expect(
        chapter.screenCount,
        `tag "${tag}" routes to "${target}", which has no built content`,
      ).toBeGreaterThan(0)
    }
  })

  it('resolved recovery screens carry the exact tag in loaded content', async () => {
    for (const [tag, target] of entries) {
      if (target === null) continue
      if (LEGACY_SCREEN_ZERO_RECOVERY_TAGS.has(tag)) continue
      const chapter = chapterById.get(target)
      const index = findTaggedChapterScreen(chapter, tag)
      const loader = CHAPTER_CONTENT_LOADERS[target]
      expect(loader, `${target} has no content loader`).toBeTypeOf('function')
      const content = await loader()
      const actualTag = content.screens[index]?.tag ?? null
      expect(
        actualTag,
        `recovery for "${tag}" lands on ${target} screen ${index}, whose real tag is "${actualTag}"`,
      ).toBe(tag)
    }
  })
})
