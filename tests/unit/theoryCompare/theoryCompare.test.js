import { describe, it, expect } from 'vitest'
import {
  buildComparisonSteps,
  deriveVisibleState,
  revealedComparisonCount,
} from '../../../src/components/learning/theoryCompare.js'

// A trimmed Galen/Vesalius block that mirrors the Episode 3 shape.
const PEOPLE_BLOCK = {
  type: 'theoryCompare',
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

describe('buildComparisonSteps — one complete theme per reveal', () => {
  it('creates one comparison step per comparison theme', () => {
    const steps = buildComparisonSteps(PEOPLE_BLOCK)
    expect(steps).toEqual([
      { type: 'comparison', comparisonIndex: 0 },
      { type: 'comparison', comparisonIndex: 1 },
      { type: 'comparison', comparisonIndex: 2 },
      { type: 'comparison', comparisonIndex: 3 },
    ])
  })

  it('does not split rows, notes or the takeaway into extra Continue presses', () => {
    const steps = buildComparisonSteps(PEOPLE_BLOCK)
    expect(steps).toHaveLength(PEOPLE_BLOCK.comparisons.length)
    expect(steps.some(step => step.type === 'row')).toBe(false)
    expect(steps.some(step => step.type === 'note')).toBe(false)
    expect(steps.some(step => step.type === 'takeaway')).toBe(false)
  })

  it('handles a single comparison', () => {
    const steps = buildComparisonSteps({
      comparisons: [{ id: 'x', prompt: 'p', left: 'l', right: 'r' }],
    })
    expect(steps).toEqual([{ type: 'comparison', comparisonIndex: 0 }])
  })

  it('returns an empty sequence for an empty block', () => {
    expect(buildComparisonSteps({})).toEqual([])
    expect(buildComparisonSteps(null)).toEqual([])
  })
})

describe('deriveVisibleState — replacement reveal', () => {
  const steps = buildComparisonSteps(PEOPLE_BLOCK)

  it('shows only the first comparison at the first step', () => {
    const view = deriveVisibleState(PEOPLE_BLOCK, steps, 1)
    expect(view.comparisons.map(comparison => comparison.visible)).toEqual([
      true,
      false,
      false,
      false,
    ])
    expect(view.takeawayVisible).toBe(false)
    expect(view.complete).toBe(false)
  })

  it('replaces the previous comparison when the next theme is reached', () => {
    const view = deriveVisibleState(PEOPLE_BLOCK, steps, 3)
    expect(view.comparisons.map(comparison => comparison.visible)).toEqual([
      false,
      false,
      true,
      false,
    ])
  })

  it('reveals every row and the note together with their comparison theme', () => {
    const beforeConclusions = deriveVisibleState(PEOPLE_BLOCK, steps, 2)
    expect(beforeConclusions.comparisons[2].visible).toBe(false)
    expect(beforeConclusions.comparisons[2].visibleRows).toBe(0)
    expect(beforeConclusions.comparisons[2].noteVisible).toBe(false)

    const atConclusions = deriveVisibleState(PEOPLE_BLOCK, steps, 3)
    expect(atConclusions.comparisons[2].visible).toBe(true)
    expect(atConclusions.comparisons[2].visibleRows).toBe(3)
    expect(atConclusions.comparisons[2].noteVisible).toBe(true)
  })

  it('reveals the takeaway with the final comparison theme', () => {
    const beforeLast = deriveVisibleState(PEOPLE_BLOCK, steps, steps.length - 1)
    expect(beforeLast.takeawayVisible).toBe(false)
    expect(beforeLast.complete).toBe(false)

    const atEnd = deriveVisibleState(PEOPLE_BLOCK, steps, steps.length)
    expect(atEnd.comparisons.map(comparison => comparison.visible)).toEqual([
      false,
      false,
      false,
      true,
    ])
    expect(atEnd.takeawayVisible).toBe(true)
    expect(atEnd.complete).toBe(true)
  })

  it('clamps an over-large revealed count to the sequence length', () => {
    const view = deriveVisibleState(PEOPLE_BLOCK, steps, 999)
    expect(view.complete).toBe(true)
    expect(view.takeawayVisible).toBe(true)
    expect(view.comparisons[3].visible).toBe(true)
  })

  it('a comparison with no rows reports zero visible rows', () => {
    const view = deriveVisibleState(PEOPLE_BLOCK, steps, steps.length)
    expect(view.comparisons[3].visibleRows).toBe(0)
  })
})

describe('revealedComparisonCount — shared progress marker', () => {
  const steps = buildComparisonSteps(PEOPLE_BLOCK)

  it('tracks how many themes have been reached even though only one is visible', () => {
    expect(revealedComparisonCount(PEOPLE_BLOCK, steps, 1)).toBe(1)
    expect(revealedComparisonCount(PEOPLE_BLOCK, steps, 2)).toBe(2)
    expect(revealedComparisonCount(PEOPLE_BLOCK, steps, steps.length)).toBe(4)
  })
})
