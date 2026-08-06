import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadCatalogue } from '../../src/curriculum-catalogue/index.js'
import {
  loadLearningSequences,
  validateLearningSequences,
} from '../../src/curriculum-catalogue/runtime/index.js'
import {
  assertInputPurity,
  buildLearnerCurriculum,
} from '../../scripts/generate-learner-curriculum.mjs'
import {
  LEARNING_SEQUENCES,
  CURRICULUM_MODULES,
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
  getCurriculumChapterById,
  getLearningSequenceForChapter,
  getOrderedAvailableChapters,
  isChapterAvailable,
} from '../../src/data/generated/curriculum/learnerCurriculum.js'
import {
  MODULES as LEGACY_MODULES,
} from '../../src/data/modules.js'
import {
  CHAPTERS as LEGACY_CHAPTERS,
  isChapterAvailable as isLegacyChapterAvailable,
} from '../../src/chapters.js'
import {
  canonicalChapterId,
  chapterProgressSourceKeys,
} from '../../src/data/chapterProgress.js'

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)))

const productionFiles = [
  'src/progress.js',
  'src/app/chapterNavigation.js',
  'src/features/planner/dailyPlanner.js',
  'src/todaysPlan.js',
  'src/features/progress/Progress.jsx',
  'src/app/LegacyApp.jsx',
  'src/components/layout/ChapterPlayer.jsx',
  'src/components/layout/ChapterCompleteScreen.jsx',
  'src/features/subjects/subjectNavigationAdapter.js',
]

describe('canonical learner runtime', () => {
  it('validates the seven semantic Learning Sequences', async () => {
    const catalogue = await loadCatalogue()
    const sequences = loadLearningSequences(catalogue)
    expect(validateLearningSequences(sequences, catalogue)).toEqual([])
    expect(sequences).toHaveLength(7)
    expect(sequences.map(sequence => sequence.id)).toEqual([
      'history-medicine',
      'sociology-family',
      'maths-number',
      'biology-core',
      'english-macbeth',
      'history-spain-new-world',
      'history-usa-conflict',
    ])
  })

  it('projects the canonical catalogue without compatibility-shaped Chapter fields', () => {
    expect(CURRICULUM_MODULES).toHaveLength(36)
    expect(CURRICULUM_CHAPTERS).toHaveLength(65)
    expect(LEARNING_SEQUENCES).toHaveLength(7)
    for (const chapter of CURRICULUM_CHAPTERS) {
      for (const legacyField of ['number', 'series', 'color', 'colorLight', 'tags', 'availability']) {
        expect(chapter).not.toHaveProperty(legacyField)
      }
      expect(chapter).toHaveProperty('moduleId')
      expect(chapter).toHaveProperty('status')
      expect(chapter).toHaveProperty('screenCount')
      expect(chapter).toHaveProperty('screenTags')
    }
  })

  it('preserves the live available-Chapter set and current continuation order', () => {
    const expectedAvailable = LEGACY_CHAPTERS.filter(isLegacyChapterAvailable).map(chapter => chapter.id)
    const actualAvailable = CURRICULUM_CHAPTERS.filter(isChapterAvailable).map(chapter => chapter.id)
    expect(new Set(actualAvailable)).toEqual(new Set(expectedAvailable))
    expect(actualAvailable).toHaveLength(30)

    expect(LEARNING_SEQUENCES.map(sequence => sequence.chapterIds)).toEqual(
      LEGACY_MODULES.map(module => module.chapterIds),
    )
    expect(getOrderedAvailableChapters().map(chapter => chapter.id)).toEqual(
      LEGACY_MODULES
        .flatMap(module => module.chapterIds)
        .map(id => LEGACY_CHAPTERS.find(chapter => chapter.id === id))
        .filter(isLegacyChapterAvailable)
        .map(chapter => chapter.id),
    )
  })

  it('derives every available Chapter through exactly one Learning Sequence', () => {
    for (const chapter of CURRICULUM_CHAPTERS.filter(isChapterAvailable)) {
      const sequence = getLearningSequenceForChapter(chapter.id)
      expect(sequence, chapter.id).not.toBeNull()
      expect(sequence.chapterIds.filter(id => id === chapter.id)).toHaveLength(1)
      expect(getCurriculumChapterById(chapter.id)).toBe(chapter)
    }
  })

  it('generates 59 canonical content loaders and every loader resolves', async () => {
    expect(Object.keys(CHAPTER_CONTENT_LOADERS)).toHaveLength(59)
    expect(CHAPTER_CONTENT_LOADERS).not.toHaveProperty('history-medicine-renaissance-medicine')
    for (const [chapterId, loader] of Object.entries(CHAPTER_CONTENT_LOADERS)) {
      const content = await loader()
      expect(content?.id, chapterId).toBe(chapterId)
    }
  })

  it('migrates both mod2 and the superseded hidden id onto the canonical replacement', () => {
    expect(canonicalChapterId('mod2')).toBe('history-medicine-vesalius-beginning-doubt')
    expect(canonicalChapterId('history-medicine-renaissance-medicine'))
      .toBe('history-medicine-vesalius-beginning-doubt')
    const sources = chapterProgressSourceKeys('history-medicine-vesalius-beginning-doubt')
    expect(sources).toContain('gcse_chapter_history-medicine-renaissance-medicine')
    expect(sources).toContain('gcse_module_mod2')
  })

  it('keeps the learner generator independent of compatibility and browser output', async () => {
    expect(assertInputPurity()).toEqual([])
    const catalogue = await loadCatalogue()
    const sequences = loadLearningSequences(catalogue)
    const built = await buildLearnerCurriculum(catalogue, sequences)
    expect(built.chapters).toEqual(CURRICULUM_CHAPTERS)
    expect(built.modules).toEqual(CURRICULUM_MODULES)
    expect(built.sequences).toEqual(LEARNING_SEQUENCES)
  })

  it('moves every live consumer onto the public learner-curriculum boundary', () => {
    for (const path of productionFiles) {
      const source = readFileSync(resolve(ROOT, path), 'utf8')
      expect(source, path).toContain('learnerCurriculum.js')
      expect(source, path).not.toMatch(/(?:from|import\s*\()\s*['"][^'"]*(?:chapters|data\/modules|chapterContentRegistry)\.js['"]/) 
    }
  })
})
