// Gate 9 of the content hierarchy migration.
//
// A normal chapter must be buildable from governed data alone: chapter
// metadata, a content loader, registered screens and blocks, and membership of
// exactly one parent module. Building one must never require editing the
// runtime — ChapterPlayer, ScreenRenderer, app navigation or progress
// persistence.
//
// This test demonstrates that end to end with a representative new chapter
// that exists only inside the test.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CHAPTERS } from '../../src/chapters.js'
import { MODULES } from '../../src/data/modules.js'
import { validateContentHierarchy } from '../../src/data/contentHierarchy.js'
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

const RUNTIME_FILES = [
  'src/components/layout/ChapterPlayer.jsx',
  'src/components/layout/ScreenRenderer.jsx',
  'src/app/LegacyApp.jsx',
  'src/app/chapterNavigation.js',
  'src/progress.js',
  'src/data/chapterProgress.js',
]

// A representative chapter: one teaching screen composed of registered blocks,
// one full-screen retrieval moment. Nothing here is bespoke — every type is an
// existing entry in screenRegistry.js.
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
      questions: [
        {
          q: 'Does adding a chapter require editing the runtime?',
          options: ['Yes', 'No'],
          correct: 1,
        },
      ],
    },
  ],
}

const NEW_CHAPTER_METADATA = {
  id: NEW_CHAPTER_ID,
  title: 'A representative new chapter',
  subject: 'History',
  screenCount: NEW_CHAPTER_CONTENT.screens.length,
}

describe('chapter authoring boundary', () => {
  it('validates a representative new chapter against the governed schema', () => {
    const result = validateChapterDefinition(NEW_CHAPTER_CONTENT)
    expect(result.errors).toEqual([])
    expect(result.valid).toBe(true)
  })

  it('composes it only from registered screen and block types', () => {
    for (const screen of NEW_CHAPTER_CONTENT.screens) {
      expect(SCREEN_REGISTRY, screen.type).toHaveProperty(screen.type)
      for (const block of screen.blocks ?? []) {
        expect(BLOCK_REGISTRY, block.type).toHaveProperty(block.type)
      }
    }
  })

  it('routes every one of its types through ScreenRenderer already', () => {
    for (const screen of NEW_CHAPTER_CONTENT.screens) {
      const definition = SCREEN_REGISTRY[screen.type]
      if (definition.layout === 'full') {
        expect(FULL_SCREEN_RENDERER_TYPES, screen.type).toContain(screen.type)
      }
      for (const block of screen.blocks ?? []) {
        expect(BLOCK_RENDERER_TYPES, block.type).toContain(block.type)
      }
    }
  })

  it('satisfies the hierarchy contract once added to exactly one parent module', () => {
    const parent = MODULES.find(module => module.subject === 'History')
    const errors = validateContentHierarchy({
      chapters: [...CHAPTERS, NEW_CHAPTER_METADATA],
      modules: MODULES.map(module => (
        module.id === parent.id
          ? { ...module, chapterIds: [...module.chapterIds, NEW_CHAPTER_ID] }
          : module
      )),
    })
    expect(errors).toEqual([])
  })

  it('needs no mention of itself anywhere in the runtime', () => {
    for (const path of RUNTIME_FILES) {
      expect(read(path), path).not.toContain(NEW_CHAPTER_ID)
    }
  })

  it('keeps ScreenRenderer the only component-routing boundary', () => {
    const player = read('src/components/layout/ChapterPlayer.jsx')
    // ChapterPlayer may render the runtime frame and its own lifecycle
    // diversions, but must not grow per-screen-type routing of its own.
    expect(player).toContain('ScreenRenderer')
    expect(player).not.toMatch(/screen\.type\s*===\s*['"]/)
    expect(player).not.toMatch(/SCREEN_REGISTRY\s*\[/)
  })
})
