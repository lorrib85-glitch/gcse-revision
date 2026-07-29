import { describe, expect, it } from 'vitest'
import { CHAPTERS } from '../../src/chapters.js'
import { MODULES } from '../../src/data/modules.js'
import {
  CONTENT_HIERARCHY,
  CONTENT_LEVELS,
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

})

describe('Current content relationships', () => {
  it('satisfies the canonical module-to-chapter relationship contract', () => {
    const errors = validateContentHierarchy({ chapters: CHAPTERS, modules: MODULES })
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
