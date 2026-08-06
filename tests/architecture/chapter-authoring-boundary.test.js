// A normal Chapter is authored entirely through governed data. Adding one must
// not require a bespoke runtime branch or a second hierarchy registry.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { checkIntegrity, loadCatalogue } from '../../src/curriculum-catalogue/index.js'
import {
  BLOCK_REGISTRY,
  SCREEN_REGISTRY,
  validateChapterDefinition,
} from '../../src/data/screenRegistry.js'
import {
  BLOCK_RENDERER_TYPES,
  FULL_SCREEN_RENDERER_TYPES,
} from '../../src/components/layout/ScreenRenderer.jsx'

const ROOT = resolve(process.cwd())
const read = path => readFileSync(resolve(ROOT, path), 'utf8')
const NEW_CHAPTER_ID = 'architecture-fixture-representative-chapter'

const NEW_CHAPTER_CONTENT = {
  id: NEW_CHAPTER_ID,
  subject: 'History',
  screens: [
    {
      type: 'standard',
      title: 'What the fixture teaches',
      blocks: [
        { type: 'read', text: 'A registered block, composed rather than invented.' },
        { type: 'reveal', prompt: 'Which file owns component routing?', answer: 'ScreenRenderer.' },
      ],
    },
    {
      type: 'quickRecall',
      questions: [{ q: 'Does adding a Chapter require editing the runtime?', options: ['Yes', 'No'], correct: 1 }],
    },
  ],
}

const RUNTIME_FILES = [
  'src/components/layout/ChapterPlayer.jsx',
  'src/components/layout/ScreenRenderer.jsx',
  'src/app/LegacyApp.jsx',
  'src/app/chapterNavigation.js',
  'src/progress.js',
  'src/data/chapterProgress.js',
  'src/data/learnerCurriculum.js',
]

describe('Chapter authoring boundary', () => {
  it('validates representative content against the governed screen schema', () => {
    const result = validateChapterDefinition(NEW_CHAPTER_CONTENT)
    expect(result.errors).toEqual([])
    expect(result.valid).toBe(true)
  })

  it('composes only registered screen and block types', () => {
    for (const screen of NEW_CHAPTER_CONTENT.screens) {
      expect(SCREEN_REGISTRY).toHaveProperty(screen.type)
      for (const block of screen.blocks ?? []) expect(BLOCK_REGISTRY).toHaveProperty(block.type)
    }
  })

  it('routes every authored type through ScreenRenderer already', () => {
    for (const screen of NEW_CHAPTER_CONTENT.screens) {
      const definition = SCREEN_REGISTRY[screen.type]
      if (definition.layout === 'full') expect(FULL_SCREEN_RENDERER_TYPES).toContain(screen.type)
      for (const block of screen.blocks ?? []) expect(BLOCK_RENDERER_TYPES).toContain(block.type)
    }
  })

  it('satisfies canonical ownership when one Module receives one Chapter reference', async () => {
    const catalogue = await loadCatalogue()
    const template = catalogue.chapters.find(chapter => chapter.id === 'history-medicine-medieval-beliefs-causes')
    const parent = catalogue.modules.find(module => module.chapterRefs.some(ref => ref.chapterId === template.id))
    const newChapter = {
      ...template,
      id: NEW_CHAPTER_ID,
      title: 'A representative new Chapter',
      status: 'planned',
      contentPath: null,
    }
    const newModules = catalogue.modules.map(module => module.id === parent.id
      ? {
          ...module,
          chapterRefs: [
            ...module.chapterRefs,
            { chapterId: NEW_CHAPTER_ID, position: module.chapterRefs.length },
          ],
        }
      : module)
    expect(checkIntegrity({ ...catalogue, modules: newModules, chapters: [...catalogue.chapters, newChapter] }))
      .toEqual([])
  })

  it('needs no mention of its id in any runtime file', () => {
    for (const path of RUNTIME_FILES) expect(read(path), path).not.toContain(NEW_CHAPTER_ID)
  })

  it('keeps ScreenRenderer the only component-routing boundary', () => {
    const player = read('src/components/layout/ChapterPlayer.jsx')
    expect(player).toContain('ScreenRenderer')
    expect(player).not.toMatch(/screen\.type\s*===\s*['"]/)
    expect(player).not.toMatch(/SCREEN_REGISTRY\s*\[/)
  })
})
