import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadCatalogue } from '../../src/curriculum-catalogue/index.js'
import { loadLearningSequences, validateLearningSequences } from '../../src/curriculum-catalogue/runtime/index.js'
import { assertInputPurity, buildLearnerCurriculum } from '../../scripts/generate-learner-curriculum.mjs'
import {
  LEARNING_SEQUENCES,
  CURRICULUM_MODULES,
  CURRICULUM_CHAPTERS,
  CHAPTER_CONTENT_LOADERS,
  getCurriculumChapterById,
  getLearningSequenceForChapter,
  getOrderedAvailableChapters,
  isChapterAvailable,
} from '../../src/data/learnerCurriculum.js'
import { canonicalChapterId, chapterProgressSourceKeys } from '../../src/data/chapterProgress.js'

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
  it('validates seven semantic Learning Sequences', async () => {
    const catalogue = await loadCatalogue()
    const sequences = loadLearningSequences(catalogue)
    expect(validateLearningSequences(sequences, catalogue)).toEqual([])
    expect(sequences.map(sequence => sequence.id)).toEqual([
      'history-medicine', 'sociology-family', 'maths-number', 'biology-core',
      'english-macbeth', 'history-spain-new-world', 'history-usa-conflict',
    ])
  })

  it('projects 36 Modules and all 65 canonical Chapters without compatibility fields', () => {
    expect(CURRICULUM_MODULES).toHaveLength(36)
    expect(CURRICULUM_CHAPTERS).toHaveLength(65)
    expect(LEARNING_SEQUENCES).toHaveLength(7)
    for (const chapter of CURRICULUM_CHAPTERS) {
      for (const field of ['number', 'series', 'color', 'colorLight', 'tags', 'availability']) {
        expect(chapter, `${chapter.id}.${field}`).not.toHaveProperty(field)
      }
      expect(chapter).toHaveProperty('moduleId')
      expect(chapter).toHaveProperty('status')
      expect(chapter).toHaveProperty('screenCount')
      expect(chapter).toHaveProperty('screenTags')
    }
  })

  it('projects exactly 30 available Chapters in Learning Sequence order', () => {
    expect(CURRICULUM_CHAPTERS.filter(isChapterAvailable)).toHaveLength(30)
    expect(getOrderedAvailableChapters().map(chapter => chapter.id)).toEqual(
      LEARNING_SEQUENCES
        .flatMap(sequence => sequence.chapterIds)
        .map(getCurriculumChapterById)
        .filter(isChapterAvailable)
        .map(chapter => chapter.id),
    )
  })

  it('resolves every available Chapter through exactly one Learning Sequence', () => {
    for (const chapter of CURRICULUM_CHAPTERS.filter(isChapterAvailable)) {
      const sequence = getLearningSequenceForChapter(chapter.id)
      expect(sequence, chapter.id).not.toBeNull()
      expect(sequence.chapterIds.filter(id => id === chapter.id)).toHaveLength(1)
    }
  })

  it('generates 59 canonical loaders and no hidden Renaissance loader', async () => {
    expect(Object.keys(CHAPTER_CONTENT_LOADERS)).toHaveLength(59)
    expect(CHAPTER_CONTENT_LOADERS).not.toHaveProperty('history-medicine-renaissance-medicine')
    for (const [id, loader] of Object.entries(CHAPTER_CONTENT_LOADERS)) {
      expect((await loader()).id, id).toBe(id)
    }
  })

  it('maps both historical Renaissance ids directly onto the canonical replacement', () => {
    const replacement = 'history-medicine-vesalius-beginning-doubt'
    expect(canonicalChapterId('mod2')).toBe(replacement)
    expect(canonicalChapterId('history-medicine-renaissance-medicine')).toBe(replacement)
    const sources = chapterProgressSourceKeys(replacement)
    expect(sources).toContain('gcse_chapter_history-medicine-renaissance-medicine')
    expect(sources).toContain('gcse_module_mod2')
  })

  it('keeps the generator independent of compatibility and browser output', async () => {
    expect(assertInputPurity()).toEqual([])
    const catalogue = await loadCatalogue()
    const built = await buildLearnerCurriculum(catalogue, loadLearningSequences(catalogue))
    expect(built.chapters).toEqual(CURRICULUM_CHAPTERS)
    expect(built.modules).toEqual(CURRICULUM_MODULES)
    expect(built.sequences).toEqual(LEARNING_SEQUENCES)
  })

  it('keeps retired compatibility paths absent', () => {
    for (const path of [
      'src/curriculum-catalogue/compatibility/index.js',
      'src/curriculum-catalogue/compatibility/runtime-v1.js',
      'src/data/modules.js',
      'src/chapters.js',
      'src/content/chapterContentRegistry.js',
      'scripts/generate-curriculum-projections.mjs',
      'tests/fixtures/curriculum-runtime-v1.json',
    ]) expect(existsSync(resolve(ROOT, path)), path).toBe(false)
  })

  it('moves every live consumer onto the public learner boundary', () => {
    for (const path of productionFiles) {
      const source = readFileSync(resolve(ROOT, path), 'utf8')
      expect(source, path).toContain('learnerCurriculum.js')
      expect(source, path).not.toMatch(/generated\/curriculum\/learnerCurriculum\.js/)
      expect(source, path).not.toMatch(/(?:chapters|data\/modules|chapterContentRegistry)\.js['"]/) 
    }
  })
})
