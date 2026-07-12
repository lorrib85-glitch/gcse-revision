import { describe, it, expect } from 'vitest'
import {
  isPeopleVariant,
  buildPeopleSteps,
  deriveVisibleState,
  revealedComparisonCount,
} from '../../../src/components/learning/theoryComparePeople.js'

// A trimmed Galen/Vesalius block that mirrors the Episode 3 shape.
const PEOPLE_BLOCK = {
  type: 'theoryCompare',
  variant: 'people',
  title: 'Galen and Vesalius',
  leftPerson: { name: 'Galen', subtitle: 'Ancient Roman doctor' },
  rightPerson: { name: 'Vesalius', subtitle: 'Renaissance anatomist' },
  comparisons: [
    { id: 'evidence-source', prompt: 'What did they study?', left: 'Animals', right: 'Humans', explanation: 'Because dissection was restricted.' },
    { id: 'method', prompt: 'How did they build knowledge?', left: 'Theory', right: 'Evidence', explanation: 'He tested it.' },
    {
      id: 'conclusions',
      prompt: 'What did they conclude?',
      rows: [
        { label: 'Jaw', left: 'Two bones', right: 'One bone' },
        { label: 'Ribs', left: 'Fewer in men', right: 'Same number' },
        { label: 'Breastbone', left: 'Seven parts', right: 'Three parts' },
      ],
      note: 'Around 300 errors.',
    },
    { id: 'impact', prompt: 'What was their impact?', left: 'A thousand years', right: 'Authority could be corrected' },
  ],
  takeaway: 'Old ideas should be checked against evidence.',
}

const SIMPLE_BLOCK = {
  type: 'theoryCompare',
  oldLabel: 'What people believed',
  oldPoints: ['A', 'B'],
  newLabel: 'What was happening',
  newPoints: ['C', 'D'],
  takeaway: 'Reality differed.',
}

describe('isPeopleVariant', () => {
  it('is true only for variant: "people"', () => {
    expect(isPeopleVariant(PEOPLE_BLOCK)).toBe(true)
    expect(isPeopleVariant(SIMPLE_BLOCK)).toBe(false)
    expect(isPeopleVariant({ variant: 'other' })).toBe(false)
    expect(isPeopleVariant(null)).toBe(false)
    expect(isPeopleVariant(undefined)).toBe(false)
  })
})

describe('buildPeopleSteps — reveal ordering', () => {
  it('flattens comparisons, rows, note and takeaway in the intended order', () => {
    const steps = buildPeopleSteps(PEOPLE_BLOCK)
    expect(steps.map(s => s.type)).toEqual([
      'comparison', // 0 evidence-source
      'comparison', // 1 method
      'comparison', // 2 conclusions (row 0)
      'row',        // 2 conclusions (row 1)
      'row',        // 2 conclusions (row 2)
      'note',       // 2 conclusions note
      'comparison', // 3 impact
      'takeaway',
    ])
  })

  it('reveals anatomical example rows one at a time within the comparison', () => {
    const steps = buildPeopleSteps(PEOPLE_BLOCK)
    const conclusionSteps = steps.filter(s => s.comparisonIndex === 2)
    expect(conclusionSteps.map(s => s.rowIndex)).toEqual([0, 1, 2, undefined]) // rows then note
  })

  it('omits the takeaway step when no takeaway is present', () => {
    const steps = buildPeopleSteps({ ...PEOPLE_BLOCK, takeaway: undefined })
    expect(steps.some(s => s.type === 'takeaway')).toBe(false)
  })

  it('handles a single comparison with no rows, no note and no takeaway', () => {
    const steps = buildPeopleSteps({
      comparisons: [{ id: 'x', prompt: 'p', left: 'l', right: 'r' }],
    })
    expect(steps).toEqual([{ type: 'comparison', comparisonIndex: 0 }])
  })

  it('returns an empty sequence for an empty block', () => {
    expect(buildPeopleSteps({})).toEqual([])
    expect(buildPeopleSteps(null)).toEqual([])
  })
})

describe('deriveVisibleState — progressive reveal', () => {
  const steps = buildPeopleSteps(PEOPLE_BLOCK)

  it('shows only the first comparison at the first step', () => {
    const view = deriveVisibleState(PEOPLE_BLOCK, steps, 1)
    expect(view.comparisons[0].visible).toBe(true)
    expect(view.comparisons[1].visible).toBe(false)
    expect(view.takeawayVisible).toBe(false)
    expect(view.complete).toBe(false)
  })

  it('reveals rows incrementally within the conclusions comparison', () => {
    // Steps: [c0, c1, c2(row0), row1, row2, note, c3, takeaway]
    const atRow0 = deriveVisibleState(PEOPLE_BLOCK, steps, 3) // c0,c1,c2
    expect(atRow0.comparisons[2].visible).toBe(true)
    expect(atRow0.comparisons[2].visibleRows).toBe(1)
    expect(atRow0.comparisons[2].noteVisible).toBe(false)

    const atRow2 = deriveVisibleState(PEOPLE_BLOCK, steps, 5) // through row2
    expect(atRow2.comparisons[2].visibleRows).toBe(3)
    expect(atRow2.comparisons[2].noteVisible).toBe(false)

    const atNote = deriveVisibleState(PEOPLE_BLOCK, steps, 6) // through note
    expect(atNote.comparisons[2].noteVisible).toBe(true)
  })

  it('reveals the takeaway only after the whole comparison sequence', () => {
    const beforeLast = deriveVisibleState(PEOPLE_BLOCK, steps, steps.length - 1)
    expect(beforeLast.takeawayVisible).toBe(false)

    const atEnd = deriveVisibleState(PEOPLE_BLOCK, steps, steps.length)
    expect(atEnd.takeawayVisible).toBe(true)
    expect(atEnd.complete).toBe(true)
  })

  it('clamps an over-large revealed count to the sequence length', () => {
    const view = deriveVisibleState(PEOPLE_BLOCK, steps, 999)
    expect(view.complete).toBe(true)
    expect(view.takeawayVisible).toBe(true)
  })

  it('a comparison with no rows reports zero visible rows', () => {
    const view = deriveVisibleState(PEOPLE_BLOCK, steps, steps.length)
    expect(view.comparisons[0].visibleRows).toBe(0)
    expect(view.comparisons[3].visibleRows).toBe(0)
  })
})

describe('revealedComparisonCount — reveal-progress rail', () => {
  const steps = buildPeopleSteps(PEOPLE_BLOCK)

  it('counts comparison themes that are at least partially revealed', () => {
    expect(revealedComparisonCount(PEOPLE_BLOCK, steps, 1)).toBe(1)
    expect(revealedComparisonCount(PEOPLE_BLOCK, steps, 2)).toBe(2)
    expect(revealedComparisonCount(PEOPLE_BLOCK, steps, steps.length)).toBe(4)
  })
})
