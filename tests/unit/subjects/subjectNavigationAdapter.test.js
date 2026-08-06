import { describe, expect, it } from 'vitest'

import { CURRICULUM_CHAPTERS as CHAPTERS, isChapterAvailable } from '../../../src/data/learnerCurriculum.js'
import { NAVIGATION_ENTRIES } from '../../../src/data/generated/curriculum/navigation.js'
import {
  SUBJECT_NAVIGATION_NAMES,
  getSubjectChapterList,
  getSubjectNavigationEntry,
} from '../../../src/features/subjects/subjectNavigationAdapter.js'

const ids = list => list.map(entry => entry.id)

describe('Subject-navigation adapter', () => {
  it('takes all seven destinations and their order from generated navigation', () => {
    expect(SUBJECT_NAVIGATION_NAMES).toEqual([
      'History', 'Biology', 'Chemistry', 'Physics', 'Maths', 'English', 'Sociology',
    ])
    expect(SUBJECT_NAVIGATION_NAMES).toEqual(NAVIGATION_ENTRIES.map(entry => entry.label))
  })

  it('passes Browser Entry presentation through without a second copy', () => {
    for (const projected of NAVIGATION_ENTRIES) {
      const adapted = getSubjectNavigationEntry(projected.label)
      expect({
        id: adapted.id,
        title: adapted.title,
        description: adapted.description,
        heroImage: adapted.heroImage,
        themeKey: adapted.themeKey,
      }).toEqual({
        id: projected.id,
        title: projected.title,
        description: projected.description,
        heroImage: projected.heroImage,
        themeKey: projected.themeKey,
      })
    }
  })

  it('adapts History and English sections to the existing series contract', () => {
    expect(getSubjectNavigationEntry('History').series.map(series => series.id)).toEqual([
      'medicine', 'spain-new-world', 'elizabethan', 'usa',
    ])
    expect(getSubjectNavigationEntry('English').series.map(series => series.id)).toEqual([
      'macbeth', 'inspector',
    ])
    expect(getSubjectNavigationEntry('History').series.find(series => series.id === 'elizabethan').comingSoon).toBe(true)
    expect(getSubjectNavigationEntry('English').series.find(series => series.id === 'inspector').comingSoon).toBe(true)
  })

  it('preserves Maths and Biology card order', () => {
    expect(ids(getSubjectChapterList('Maths'))).toEqual([
      'math1', 'math2', 'math3', 'math4', 'math5', 'math6', 'math7', 'math8',
    ])
    expect(ids(getSubjectChapterList('Biology')).slice(0, 2)).toEqual([
      'bio_building_blocks', 'sci_bio_w1',
    ])
  })

  it('uses semantic English Chapter identities rather than cs placeholders', () => {
    expect(ids(getSubjectChapterList('English'))).toEqual([
      'english-macbeth-power-ambition',
      'english-macbeth-guilt-consequence',
      'english-macbeth-witches-fate',
      'english-macbeth-appearance-reality',
      'english-inspector-calls-social-message',
      'english-inspector-calls-responsibility-denial',
      'english-inspector-calls-consequences-resolution',
    ])
  })

  it('keeps Physics as five non-openable canonical Module cards', () => {
    const physics = getSubjectChapterList('Physics')
    expect(ids(physics)).toEqual([
      'physics-aqa-forces-motion',
      'physics-aqa-energy',
      'physics-aqa-waves-electricity',
      'physics-aqa-space',
      'physics-aqa-matter-particles',
    ])
    expect(physics.every(card => card.navigationKind === 'module' && !card.openable)).toBe(true)
  })

  it('represents Chemistry as a subject state rather than a fake Chapter', () => {
    expect(getSubjectChapterList('Chemistry')).toEqual([
      expect.objectContaining({
        id: 'chemistry:coming-soon',
        chapterId: null,
        navigationKind: 'state',
        title: 'Content coming soon',
        subtitle: 'Chemistry',
        openable: false,
        comingSoon: true,
      }),
    ])
  })

  it('joins all 30 openable cards to the same available runtime Chapters', () => {
    const runtimeById = new Map(CHAPTERS.map(chapter => [chapter.id, chapter]))
    const cards = SUBJECT_NAVIGATION_NAMES.flatMap(getSubjectChapterList)
    const openable = cards.filter(card => card.openable)
    expect(openable).toHaveLength(30)
    for (const card of openable) {
      const runtime = runtimeById.get(card.chapterId)
      expect(runtime, card.id).toBeTruthy()
      expect(isChapterAvailable(runtime), card.id).toBe(true)
      expect(card.screenCount, card.id).toBe(runtime.screenCount)
    }
  })

  it('keeps all 41 planned, Module and state items non-openable', () => {
    const cards = SUBJECT_NAVIGATION_NAMES.flatMap(getSubjectChapterList)
    expect(cards.filter(card => !card.openable)).toHaveLength(41)
    expect(cards.filter(card => !card.openable).every(card => card.comingSoon)).toBe(true)
  })

  it('surfaces 70 canonical cards plus one state and no cs identity', () => {
    const cards = SUBJECT_NAVIGATION_NAMES.flatMap(getSubjectChapterList)
    expect(cards).toHaveLength(71)
    expect(cards.filter(card => card.navigationKind !== 'state')).toHaveLength(70)
    expect(cards.filter(card => card.navigationKind === 'state')).toHaveLength(1)
    expect(cards.some(card => card.id.startsWith('cs_'))).toBe(false)
  })

  it('surfaces no superseded Renaissance runtime Chapter', () => {
    const retiredId = 'history-medicine-renaissance-medicine'
    expect(CHAPTERS.some(chapter => chapter.id === retiredId)).toBe(false)
    expect(SUBJECT_NAVIGATION_NAMES.flatMap(getSubjectChapterList)
      .some(card => card.chapterId === retiredId)).toBe(false)
  })

  it('does not leak compatibility-shaped Chapter fields into browser cards', () => {
    const card = getSubjectChapterList('History').find(item => item.openable)
    expect(card.screenCount).toBeGreaterThan(0)
    for (const legacyField of ['color', 'colorLight', 'tags', 'era', 'icon', 'subject']) {
      expect(card).not.toHaveProperty(legacyField)
    }
  })

  it('returns no entry for an unknown destination', () => {
    expect(getSubjectNavigationEntry('Drama')).toBeNull()
    expect(getSubjectChapterList('Drama')).toEqual([])
  })
})
