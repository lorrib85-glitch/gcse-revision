import { describe, expect, it } from 'vitest'
import { MODULES as LEGACY_CHAPTERS } from '../../src/modules.js'
import { MODULE_GROUPS as LEGACY_MODULES } from '../../src/progress.js'
import {
  CONTENT_HIERARCHY,
  CONTENT_LEVELS,
  LEGACY_CONTENT_NAMES,
  validateContentHierarchy,
} from '../../src/data/contentHierarchy.js'

describe('Canonical content hierarchy', () => {
  it('locks the product hierarchy in one order', () => {
    expect(CONTENT_HIERARCHY).toEqual([
      CONTENT_LEVELS.SUBJECT,
      CONTENT_LEVELS.MODULE,
      CONTENT_LEVELS.CHAPTER,
      CONTENT_LEVELS.SCREEN,
      CONTENT_LEVELS.COMPONENT,
    ])
  })

  it('records the current legacy names without redefining their meaning', () => {
    expect(LEGACY_CONTENT_NAMES.MODULES.canonicalName).toBe('CHAPTERS')
    expect(LEGACY_CONTENT_NAMES.MODULE_GROUPS.canonicalName).toBe('MODULES')
    expect(LEGACY_CONTENT_NAMES.ModulePlayer.canonicalName).toBe('ChapterPlayer')
  })
})

describe('Current content relationships', () => {
  it('satisfies the canonical module-to-chapter relationship contract', () => {
    const errors = validateContentHierarchy({
      chapters: LEGACY_CHAPTERS,
      modules: LEGACY_MODULES,
    })

    expect(errors).toEqual([])
  })

  it('reports broken parent-child relationships with actionable messages', () => {
    const errors = validateContentHierarchy({
      chapters: [
        { id: 'shared', subject: 'History' },
        { id: 'shared', subject: 'History' },
      ],
      modules: [
        {
          id: 'history-module',
          subject: 'History',
          chapterIds: ['shared', 'shared', 'missing'],
        },
        {
          id: 'science-module',
          subject: 'Science',
          chapterIds: ['shared'],
        },
      ],
    })

    expect(errors).toContain('Duplicate chapter id "shared"')
    expect(errors).toContain(
      'Module "history-module" contains chapter "shared" more than once',
    )
    expect(errors).toContain(
      'Module "history-module" references unknown chapter "missing"',
    )
    expect(errors).toContain(
      'Chapter "shared" belongs to both "history-module" and "science-module"',
    )
    expect(errors).toContain(
      'Module "science-module" is Science but chapter "shared" is History',
    )
  })
})
