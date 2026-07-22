import { describe, it, expect } from 'vitest'
import {
  normalizeRichText,
  segmentsToString,
  buildRevealModel,
  initialRevealCount,
  nextRevealCount,
  revealState,
} from '../../src/components/learning/timelineChainReveal.js'
import { visualNarrativeToRevealChain } from '../../src/data/visualNarrativeCompat.js'

describe('normalizeRichText — structured highlight data', () => {
  it('wraps a plain string as a single non-highlighted segment', () => {
    expect(normalizeRichText('Bad air spread disease.')).toEqual([
      { text: 'Bad air spread disease.', highlight: false },
    ])
  })

  it('renders highlighted phrases from structured segment data (not HTML)', () => {
    const segments = normalizeRichText([
      { text: 'The real cause was ' },
      { text: 'microbes', highlight: true },
      { text: '.' },
    ])
    expect(segments).toEqual([
      { text: 'The real cause was ', highlight: false },
      { text: 'microbes', highlight: true },
      { text: '.', highlight: false },
    ])
    expect(segments.filter(s => s.highlight)).toHaveLength(1)
  })

  it('accepts bare strings inside an array and drops empty segments', () => {
    expect(normalizeRichText(['One', '', 'Two'])).toEqual([
      { text: 'One', highlight: false },
      { text: 'Two', highlight: false },
    ])
  })

  it('treats null / undefined / empty string as no content', () => {
    expect(normalizeRichText(null)).toEqual([])
    expect(normalizeRichText(undefined)).toEqual([])
    expect(normalizeRichText('')).toEqual([])
  })

  it('flattens segments back to plain text for aria labels', () => {
    expect(segmentsToString(normalizeRichText([
      { text: 'People tried to ' },
      { text: 'sweeten the air', highlight: true },
    ]))).toBe('People tried to sweeten the air')
  })
})

describe('buildRevealModel — markers, icons, supporting detail', () => {
  it('assigns 1-based numeric markers and normalizes statement + optional detail', () => {
    const model = buildRevealModel({
      title: 'How the idea travelled',
      intro: 'Reveal each step.',
      steps: [
        { id: 'a', statement: 'Bad air spread disease.', detail: 'So people tried to sweeten the air.' },
        { statement: 'The real cause was microbes.' },
      ],
    })
    expect(model.title).toBe('How the idea travelled')
    expect(model.intro).toBe('Reveal each step.')
    expect(model.steps).toHaveLength(2)
    expect(model.steps[0].marker).toBe(1)
    expect(model.steps[1].marker).toBe(2)
    expect(model.steps[0].id).toBe('a')
    expect(model.steps[1].id).toBe('step-1')
    expect(segmentsToString(model.steps[0].statement)).toBe('Bad air spread disease.')
    expect(segmentsToString(model.steps[0].detail)).toBe('So people tried to sweeten the air.')
    expect(model.steps[1].detail).toEqual([])
  })

  it('supports supplied icons and falls back to null when absent (numbered marker used)', () => {
    const model = buildRevealModel({
      steps: [
        { statement: 'Pasteur proves germ theory', icon: 'microscope' },
        { statement: 'Lister applies it to surgery' },
      ],
    })
    expect(model.steps[0].icon).toBe('microscope')
    expect(model.steps[1].icon).toBe(null)
    // A numbered marker is always available whether or not an icon is supplied.
    expect(model.steps[0].marker).toBe(1)
    expect(model.steps[1].marker).toBe(2)
  })

  it('normalizes a takeaway into structured segments', () => {
    const model = buildRevealModel({
      steps: [{ statement: 'A' }],
      takeaway: [{ text: 'Understanding changed ' }, { text: 'faster than treatment', highlight: true }],
    })
    expect(model.takeaway.filter(s => s.highlight)).toHaveLength(1)
    expect(segmentsToString(model.takeaway)).toBe('Understanding changed faster than treatment')
  })
})

describe('reveal progression', () => {
  it('starts by showing only the first step', () => {
    expect(initialRevealCount(4)).toBe(1)
    expect(initialRevealCount(0)).toBe(0)
  })

  it('reveals exactly one additional step per press, never past the last', () => {
    expect(nextRevealCount(1, 4)).toBe(2)
    expect(nextRevealCount(3, 4)).toBe(4)
    expect(nextRevealCount(4, 4)).toBe(4)
  })

  it('keeps the reveal CTA until every step is visible, then switches to continue', () => {
    const first = revealState({ total: 3, visibleCount: 1, hasTakeaway: true })
    expect(first).toMatchObject({ visibleCount: 1, atEnd: false, showTakeaway: false, cta: 'reveal' })

    const mid = revealState({ total: 3, visibleCount: 2, hasTakeaway: true })
    expect(mid.cta).toBe('reveal')
    expect(mid.showTakeaway).toBe(false)

    const end = revealState({ total: 3, visibleCount: 3, hasTakeaway: true })
    expect(end).toMatchObject({ visibleCount: 3, atEnd: true, showTakeaway: true, cta: 'continue' })
  })

  it('does not show a takeaway at the end when none was supplied', () => {
    const end = revealState({ total: 2, visibleCount: 2, hasTakeaway: false })
    expect(end).toMatchObject({ atEnd: true, showTakeaway: false, cta: 'continue' })
  })

  it('clamps an over-large visible count to the total', () => {
    expect(revealState({ total: 2, visibleCount: 9 }).visibleCount).toBe(2)
  })

  it('treats an empty step list as complete so the CTA never soft-locks', () => {
    expect(revealState({ total: 0, visibleCount: 0 })).toMatchObject({ atEnd: true, cta: 'continue' })
  })
})

describe('visualNarrativeToRevealChain — legacy compatibility mapping', () => {
  it('maps the canonical bad-air example structurally, not by hardcoded content', () => {
    const block = visualNarrativeToRevealChain({
      title: 'Miasma',
      beats: [
        { facts: [
          'People believed disease spread through bad air.',
          'So they tried to sweeten the air.',
          'But the real cause was microbes.',
        ] },
      ],
    })
    expect(block.type).toBe('timelineChain')
    expect(block.variant).toBe('reveal')
    expect(block.steps.map(s => s.statement)).toEqual([
      'People believed disease spread through bad air.',
      'So they tried to sweeten the air.',
      'But the real cause was microbes.',
    ])
  })

  it('maps a narrative beat to one step (headline → statement, body → detail)', () => {
    const block = visualNarrativeToRevealChain({
      beats: [
        { headline: 'Two dead Greeks ran medieval medicine.', body: 'Doctors looked to men dead for centuries.' },
        { facts: ['Galen was one.', 'Hippocrates the other.'], conclusion: 'Their ideas lasted 1,000 years.' },
      ],
    })
    expect(block.steps[0]).toMatchObject({
      statement: 'Two dead Greeks ran medieval medicine.',
      detail: 'Doctors looked to men dead for centuries.',
    })
    // facts of the final beat become their own steps...
    expect(block.steps.slice(1).map(s => s.statement)).toEqual(['Galen was one.', 'Hippocrates the other.'])
    // ...and the final beat's conclusion becomes the takeaway, not a step.
    expect(block.takeaway).toBe('Their ideas lasted 1,000 years.')
  })

  it('folds a headline beat that carries facts into a single step with detail', () => {
    const block = visualNarrativeToRevealChain({
      beats: [
        { headline: '1. Stretcher bearers', facts: ['First hands on the wounded.', 'Under fire.'] },
      ],
    })
    expect(block.steps).toHaveLength(1)
    expect(block.steps[0].statement).toBe('1. Stretcher bearers')
    expect(block.steps[0].detail).toBe('First hands on the wounded.\nUnder fire.')
  })

  it('turns a non-final conclusion into a step and preserves a source note', () => {
    const block = visualNarrativeToRevealChain({
      beats: [
        { facts: ['A fact.'], conclusion: 'Mid conclusion.', source: 'Some Journal (2023).' },
        { headline: 'The end.' },
      ],
    })
    expect(block.steps.map(s => s.statement)).toEqual(['A fact.', 'Mid conclusion.', 'The end.'])
    expect(block.takeaway).toBeUndefined()
    expect(block.source).toBe('Some Journal (2023).')
  })

  it('returns an empty reveal block for empty / missing beats', () => {
    expect(visualNarrativeToRevealChain({}).steps).toEqual([])
    expect(visualNarrativeToRevealChain({ beats: [] }).steps).toEqual([])
  })
})

describe('reveal logic is subject-agnostic', () => {
  it('contains no hardcoded history colours or subject-specific words', () => {
    const source = normalizeRichText.toString()
      + buildRevealModel.toString()
      + revealState.toString()
      + visualNarrativeToRevealChain.toString()
    expect(source).not.toMatch(/#[0-9a-fA-F]{6}/)
    expect(source).not.toMatch(/bronze|gold|galen|medieval|history/i)
  })
})
