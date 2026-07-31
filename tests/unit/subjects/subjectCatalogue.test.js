import { describe, it, expect } from 'vitest'
import { CHAPTERS, getChapterAvailability, CHAPTER_AVAILABILITY } from '../../../src/chapters.js'
import { MODULES } from '../../../src/data/modules.js'
import { getSubjectChapterList } from '../../../src/features/subjects/subjectCatalogue.js'

const ids = (list) => list.map(entry => entry.id)
const seriesOf = (list, series) => list.filter(entry => entry.series === series)
const positionOf = (list, id) => ids(list).indexOf(id)

describe('Subject browser catalogue — real chapters come from MODULES', () => {
  it('resolves Maths as math1 through math8 in maths_core order', () => {
    const mathsCore = MODULES.find(module => module.id === 'maths_core')
    expect(ids(getSubjectChapterList('Maths'))).toEqual(mathsCore.chapterIds)
    expect(ids(getSubjectChapterList('Maths'))).toEqual([
      'math1', 'math2', 'math3', 'math4', 'math5', 'math6', 'math7', 'math8',
    ])
  })

  it('begins Biology with bio_building_blocks', () => {
    expect(ids(getSubjectChapterList('Biology'))[0]).toBe('bio_building_blocks')
  })

  it('follows hist_medicine order for the Medicine series', () => {
    const medicine = MODULES.find(module => module.id === 'hist_medicine')
    const browsed = seriesOf(getSubjectChapterList('History'), 'medicine')
    expect(ids(browsed)).toEqual(medicine.chapterIds)
  })

  it('places Great Plague before Surgery & anaesthetics', () => {
    const history = getSubjectChapterList('History')
    const plague = positionOf(history, 'history-medicine-great-plague-1665')
    const surgery = positionOf(history, 'history-medicine-surgery-anaesthetics')
    expect(plague).toBeGreaterThanOrEqual(0)
    expect(plague).toBeLessThan(surgery)
  })

  it('keeps Nightingale at its authored chapter number', () => {
    const authored = CHAPTERS.find(chapter => chapter.id === 'history-medicine-nightingale')
    const browsed = getSubjectChapterList('History').find(entry => entry.id === 'history-medicine-nightingale')
    expect(browsed.number).toBe(authored.number)
    expect(browsed.number).toBe(10)
  })

  it('omits the hidden superseded Renaissance chapter', () => {
    expect(ids(getSubjectChapterList('History'))).not.toContain('history-medicine-renaissance-medicine')
  })

  it('retains Spain and USA module chapter order', () => {
    const history = getSubjectChapterList('History')
    const spain = MODULES.find(module => module.id === 'hist_spain_new_world')
    const usa = MODULES.find(module => module.id === 'hist_usa')
    expect(ids(seriesOf(history, 'spain-new-world'))).toEqual(spain.chapterIds)
    expect(ids(seriesOf(history, 'usa'))).toEqual(usa.chapterIds)
  })
})

describe('Subject browser catalogue — synthetic placeholders', () => {
  it('follows the real Macbeth chapter with its synthetic placeholders', () => {
    const macbeth = seriesOf(getSubjectChapterList('English'), 'macbeth')
    expect(ids(macbeth)).toEqual([
      'english-macbeth-power-ambition', 'cs_macbeth_2', 'cs_macbeth_3', 'cs_macbeth_4',
    ])
    expect(macbeth[0].comingSoon).toBeUndefined()
    expect(macbeth.slice(1).every(entry => entry.comingSoon)).toBe(true)
  })

  it('keeps the Inspector placeholders under the inspector series', () => {
    const inspector = seriesOf(getSubjectChapterList('English'), 'inspector')
    expect(ids(inspector)).toEqual(['cs_inspector_1', 'cs_inspector_2', 'cs_inspector_3'])
    expect(inspector.map(entry => entry.number)).toEqual([1, 2, 3])
  })

  it('keeps the Physics topic cards even though Physics has no module', () => {
    expect(MODULES.some(module => module.subject === 'Physics')).toBe(false)
    expect(ids(getSubjectChapterList('Physics'))).toEqual([
      'cs_forces', 'cs_energy', 'cs_waves', 'cs_space', 'cs_matter',
    ])
  })

  it('falls back to a single coming-soon card for a subject with no module or chapters', () => {
    expect(MODULES.some(module => module.subject === 'Chemistry')).toBe(false)
    const chemistry = getSubjectChapterList('Chemistry')
    expect(ids(chemistry)).toEqual(['cs_chemistry'])
    expect(chemistry[0].comingSoon).toBe(true)
  })

  it('never lets a synthetic card into MODULES or CHAPTERS', () => {
    const catalogued = new Set(MODULES.flatMap(module => module.chapterIds))
    const known = new Set(CHAPTERS.map(chapter => chapter.id))
    const synthetic = ['History', 'English', 'Physics', 'Biology', 'Maths', 'Sociology', 'Chemistry']
      .flatMap(subject => getSubjectChapterList(subject))
      .filter(entry => entry.id.startsWith('cs_'))

    expect(synthetic.length).toBeGreaterThan(0)
    for (const entry of synthetic) {
      expect(catalogued.has(entry.id)).toBe(false)
      expect(known.has(entry.id)).toBe(false)
    }
  })
})

describe('Subject browser catalogue — availability survives the transformation', () => {
  it('keeps coming-soon real chapters non-openable', () => {
    const nightingale = getSubjectChapterList('History')
      .find(entry => entry.id === 'history-medicine-nightingale')
    expect(getChapterAvailability(nightingale)).toBe(CHAPTER_AVAILABILITY.COMING_SOON)
    expect(nightingale.screenCount).toBe(0)
  })

  it('leaves every real available chapter openable', () => {
    const available = getSubjectChapterList('Maths')
      .filter(entry => getChapterAvailability(entry) === CHAPTER_AVAILABILITY.AVAILABLE)
    expect(available.length).toBe(8)
    expect(available.every(entry => entry.screenCount > 0)).toBe(true)
  })

  it('surfaces no hidden chapter in any subject', () => {
    const everything = ['History', 'English', 'Physics', 'Biology', 'Maths', 'Sociology', 'Chemistry']
      .flatMap(subject => getSubjectChapterList(subject))
    const hidden = everything.filter(entry => getChapterAvailability(entry) === CHAPTER_AVAILABILITY.HIDDEN)
    expect(hidden).toEqual([])
  })
})
