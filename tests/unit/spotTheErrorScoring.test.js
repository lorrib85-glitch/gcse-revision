import { describe, it, expect } from 'vitest'
import {
  tokenise,
  resolveTargetRange,
  nextContiguousSelection,
  selectionTokenText,
  targetTokenText,
  scoreSelection,
  evaluateExplanation,
  evaluateRepair,
  deriveFeedbackHeading,
  DEFAULT_MIN_EXPLANATION,
  DEFAULT_MIN_REPAIR,
} from '../../src/components/learning/spotTheErrorScoring.js'

const STATEMENT =
  'Photosynthesis takes place in the mitochondria of plant cells, using carbon dioxide and water to produce glucose and oxygen.'

const tokens = tokenise(STATEMENT)
const target = resolveTargetRange(tokens, STATEMENT, 'mitochondria')

describe('tokenise', () => {
  it('splits on whitespace and records character spans', () => {
    const t = tokenise('a bb ccc')
    expect(t.map(x => x.text)).toEqual(['a', 'bb', 'ccc'])
    expect(t[0]).toEqual({ text: 'a', start: 0, end: 1 })
    expect(t[2]).toEqual({ text: 'ccc', start: 5, end: 8 })
  })

  it('is empty for empty/nullish input', () => {
    expect(tokenise('')).toEqual([])
    expect(tokenise(null)).toEqual([])
  })
})

describe('resolveTargetRange', () => {
  it('maps a single-word target to one token index', () => {
    expect(target).toEqual({ start: 5, end: 5 })
    expect(targetTokenText(tokens, target)).toBe('mitochondria')
  })

  it('maps a multi-word target to an inclusive token range', () => {
    const s = 'Bacterial cells have a nucleus that contains their DNA.'
    const tks = tokenise(s)
    const r = resolveTargetRange(tks, s, 'have a nucleus')
    expect(targetTokenText(tks, r)).toBe('have a nucleus')
  })

  it('returns null when the target is absent or empty', () => {
    expect(resolveTargetRange(tokens, STATEMENT, 'ribosome')).toBeNull()
    expect(resolveTargetRange(tokens, STATEMENT, '')).toBeNull()
  })
})

describe('nextContiguousSelection', () => {
  it('selects a single word from nothing', () => {
    expect(nextContiguousSelection(null, 3)).toEqual({ start: 3, end: 3 })
  })

  it('extends by one word when tapping directly beside the range', () => {
    expect(nextContiguousSelection({ start: 3, end: 3 }, 4)).toEqual({ start: 3, end: 4 })
    expect(nextContiguousSelection({ start: 3, end: 4 }, 2)).toEqual({ start: 2, end: 4 })
  })

  it('shrinks from the tapped endpoint of a multi-word range', () => {
    expect(nextContiguousSelection({ start: 2, end: 4 }, 2)).toEqual({ start: 3, end: 4 })
    expect(nextContiguousSelection({ start: 2, end: 4 }, 4)).toEqual({ start: 2, end: 3 })
  })

  it('clears when tapping the only selected word', () => {
    expect(nextContiguousSelection({ start: 3, end: 3 }, 3)).toBeNull()
  })

  it('collapses to a single word when tapping an interior word', () => {
    expect(nextContiguousSelection({ start: 2, end: 6 }, 4)).toEqual({ start: 4, end: 4 })
  })

  it('starts a fresh selection when tapping a non-adjacent word', () => {
    expect(nextContiguousSelection({ start: 2, end: 3 }, 8)).toEqual({ start: 8, end: 8 })
  })

  it('never produces a non-contiguous selection across a sequence of taps', () => {
    let sel = null
    for (const i of [5, 6, 8, 8, 9]) sel = nextContiguousSelection(sel, i)
    // 5→{5,5} 6→{5,6} 8(non-adj)→{8,8} 8→null 9→{9,9}
    expect(sel).toEqual({ start: 9, end: 9 })
  })
})

describe('scoreSelection', () => {
  it('accepts an exact single-word hit', () => {
    expect(scoreSelection({ start: 5, end: 5 }, target)).toBe(true)
  })

  it('rejects an adjacent-word miss on a single-word target', () => {
    expect(scoreSelection({ start: 4, end: 4 }, target)).toBe(false) // "the"
    expect(scoreSelection({ start: 6, end: 6 }, target)).toBe(false) // "of"
  })

  it('rejects one extra word on a single-word target (no over-selection)', () => {
    expect(scoreSelection({ start: 5, end: 6 }, target)).toBe(false)
  })

  it('never rewards selecting the whole sentence', () => {
    expect(scoreSelection({ start: 0, end: tokens.length - 1 }, target)).toBe(false)
  })

  it('tolerates one extra word on a multi-word target', () => {
    const multi = { start: 2, end: 4 } // 3-word phrase
    expect(scoreSelection({ start: 2, end: 4 }, multi)).toBe(true)      // exact
    expect(scoreSelection({ start: 2, end: 5 }, multi)).toBe(true)      // one extra, full coverage
  })

  it('requires strong coverage of a multi-word target', () => {
    const three = { start: 2, end: 4 } // 3-word phrase
    expect(scoreSelection({ start: 2, end: 3 }, three)).toBe(false)     // 2/3 < 0.8

    const multi = { start: 2, end: 6 } // 5-word phrase
    expect(scoreSelection({ start: 2, end: 3 }, multi)).toBe(false)     // only 2/5 covered
    expect(scoreSelection({ start: 2, end: 5 }, multi)).toBe(true)      // 4/5 covered, no extra
  })

  it('returns false for null selection or target', () => {
    expect(scoreSelection(null, target)).toBe(false)
    expect(scoreSelection({ start: 1, end: 1 }, null)).toBe(false)
  })
})

describe('evaluateExplanation', () => {
  const block = { explanationCriteria: { anyOf: ['chloroplast', 'chloroplasts'] } }

  it('needs both length and a required term to be precise', () => {
    const short = evaluateExplanation('chloroplast', block)
    expect(short.meetsLength).toBe(false)
    expect(short.precise).toBe(false)

    const vague = evaluateExplanation('this is completely wrong somehow', block)
    expect(vague.meetsLength).toBe(true)
    expect(vague.precise).toBe(false)
    expect(vague.missing).toContain('chloroplast')

    const good = evaluateExplanation('it happens in the chloroplast, not there', block)
    expect(good.precise).toBe(true)
    expect(good.missing).toEqual([])
  })

  it('treats legacy keyTerms as anyOf', () => {
    const legacy = { keyTerms: ['prokaryotic', 'nucleus'] }
    expect(evaluateExplanation('bacteria are prokaryotic cells', legacy).precise).toBe(true)
    expect(evaluateExplanation('this answer is just wrong here', legacy).precise).toBe(false)
  })

  it('requires one match per allOf group', () => {
    const block2 = { explanationCriteria: { allOf: [['site', 'place'], ['chloroplast']] } }
    expect(evaluateExplanation('the site is the chloroplast here', block2).precise).toBe(true)
    const miss = evaluateExplanation('the chloroplast is what matters most', block2)
    expect(miss.precise).toBe(false)
    expect(miss.missing).toContain('site')
  })

  it('falls back to length only when no criteria are authored', () => {
    const r = evaluateExplanation('any sufficiently long explanation', {})
    expect(r.precise).toBe(true)
    expect(evaluateExplanation('short', {}).precise).toBe(false)
  })

  it('honours an authored minimum length', () => {
    const r = evaluateExplanation('a'.repeat(DEFAULT_MIN_EXPLANATION), { minimumExplanationLength: 40 })
    expect(r.meetsLength).toBe(false)
  })
})

describe('evaluateRepair', () => {
  it('requires length, required terms, and avoids the forbidden term', () => {
    const block = { repairKeyTerms: ['chloroplast'], repairMustAvoid: ['mitochondria'] }
    expect(evaluateRepair('it happens in the chloroplast', block).accurate).toBe(true)
    expect(evaluateRepair('it happens in the mitochondria', block).accurate).toBe(false) // forbidden
    expect(evaluateRepair('it happens somewhere in the cell', block).accurate).toBe(false) // missing term
    expect(evaluateRepair('chloro', block).meetsLength).toBe(false) // below the length bar
  })

  it('accepts any listed acceptable rewrite', () => {
    const block = { acceptableRepairs: ['in the chloroplasts', 'in chloroplast'] }
    expect(evaluateRepair('photosynthesis occurs in the chloroplasts', block).accurate).toBe(true)
    expect(evaluateRepair('photosynthesis occurs in the vacuole here', block).accurate).toBe(false)
  })

  it('falls back to length only when no repair criteria are authored', () => {
    expect(evaluateRepair('a corrected sentence', {}).accurate).toBe(true)
    expect(evaluateRepair('nope', {}).accurate).toBe(false)
    expect('nope'.length < DEFAULT_MIN_REPAIR).toBe(true)
  })
})

describe('deriveFeedbackHeading', () => {
  it('names every outcome combination specifically', () => {
    expect(deriveFeedbackHeading({ selectionCorrect: true, explanationPrecise: true, repairAccurate: true }))
      .toBe('You found it and fixed it.')
    expect(deriveFeedbackHeading({ selectionCorrect: true, explanationPrecise: true, repairAccurate: false }))
      .toBe('You diagnosed the problem, but the rewrite still needs fixing.')
    expect(deriveFeedbackHeading({ selectionCorrect: true, explanationPrecise: false, repairAccurate: false }))
      .toBe('You found the right phrase.')
    expect(deriveFeedbackHeading({ selectionCorrect: false, explanationPrecise: true, repairAccurate: false }))
      .toBe('Your explanation is heading in the right direction.')
  })

  it('uses the authored miss heading for a completely wrong answer', () => {
    expect(deriveFeedbackHeading({ selectionCorrect: false, explanationPrecise: false, repairAccurate: false, missHeading: 'Not quite — compare the two organelles.' }))
      .toBe('Not quite — compare the two organelles.')
  })

  it('falls back to a calm generic miss heading', () => {
    expect(deriveFeedbackHeading({ selectionCorrect: false, explanationPrecise: false, repairAccurate: false }))
      .toBe('Not quite — look again at what the statement claims.')
  })
})

describe('selectionTokenText', () => {
  it('joins the selected tokens and returns empty for null', () => {
    expect(selectionTokenText(tokens, { start: 0, end: 1 })).toBe('Photosynthesis takes')
    expect(selectionTokenText(tokens, null)).toBe('')
  })
})
