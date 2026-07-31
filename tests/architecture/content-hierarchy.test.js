import { describe, expect, it } from 'vitest'
import { CHAPTERS, getChapterAvailability, CHAPTER_AVAILABILITY } from '../../src/chapters.js'
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

// ─── Reverse ownership: every learner-visible chapter has a parent ───────────
// The module→chapter direction alone cannot catch a chapter that no module
// claims. A learner can still reach an orphan through the subject browser, but
// completion hand-off, the planner and continue-chapter all resolve a chapter's
// position through MODULES — so an orphan silently loses its place in the
// journey. Availability is the exemption: an explicitly hidden chapter (a
// superseded or migration entry) is allowed to sit outside the catalogue.

describe('Reverse hierarchy — chapter must have a parent module', () => {
  const availableChapter = CHAPTERS.find(
    chapter => getChapterAvailability(chapter) === CHAPTER_AVAILABILITY.AVAILABLE,
  )
  const owningModule = MODULES.find(module => module.chapterIds.includes(availableChapter.id))

  it('rejects an available chapter whose module no longer claims it', () => {
    const errors = validateContentHierarchy({
      chapters: CHAPTERS,
      modules: MODULES.map(module =>
        module.id === owningModule.id
          ? { ...module, chapterIds: module.chapterIds.filter(id => id !== availableChapter.id) }
          : module,
      ),
    })

    expect(errors).toContain(
      `Chapter "${availableChapter.id}" is available but belongs to no module`,
    )
  })

  it('rejects a coming-soon chapter that no module claims', () => {
    const errors = validateContentHierarchy({
      chapters: [{ id: 'unowned-stub', subject: 'History', screenCount: 0 }],
      modules: [{ id: 'history-module', subject: 'History', chapterIds: ['other'] }],
    })

    expect(errors).toContain('Chapter "unowned-stub" is comingSoon but belongs to no module')
  })

  it('permits an explicitly hidden chapter to sit outside the module catalogue', () => {
    const errors = validateContentHierarchy({
      chapters: [
        { id: 'owned', subject: 'History', screenCount: 4 },
        { id: 'superseded', subject: 'History', screenCount: 9, availability: 'hidden' },
      ],
      modules: [{ id: 'history-module', subject: 'History', chapterIds: ['owned'] }],
    })

    expect(errors).toEqual([])
  })

  it('still rejects a chapter claimed by two modules', () => {
    const errors = validateContentHierarchy({
      chapters: [{ id: 'contested', subject: 'History', screenCount: 4 }],
      modules: [
        { id: 'module-a', subject: 'History', chapterIds: ['contested'] },
        { id: 'module-b', subject: 'History', chapterIds: ['contested'] },
      ],
    })

    expect(errors).toContain('Chapter "contested" belongs to both "module-a" and "module-b"')
  })
})
