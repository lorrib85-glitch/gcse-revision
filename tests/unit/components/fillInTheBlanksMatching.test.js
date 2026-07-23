import { describe, expect, it } from 'vitest'
import {
  checkFillBlankAnswer,
  normaliseExactAnswer,
  normaliseTextAnswer,
  parseNumericAnswer,
  resolveFillBlankMatchMode,
} from '../../../src/components/learning/fillInTheBlanksMatching.js'

describe('fill-in-the-blanks answer matching', () => {
  it('keeps forgiving text matching for knowledge terms', () => {
    const sentence = { answer: 'inherited' }

    expect(checkFillBlankAnswer('Inherited', sentence)).toBe(true)
    expect(checkFillBlankAnswer('inheritted', sentence)).toBe(true)
    expect(checkFillBlankAnswer('infectious', sentence)).toBe(false)
  })

  it('preserves Unicode letters while ignoring ordinary punctuation in text mode', () => {
    expect(normaliseTextAnswer('Vesalius’s evidence')).toBe('vesaliuss evidence')
    expect(checkFillBlankAnswer('café', { answer: 'café', allowTypos: false })).toBe(true)
  })

  it('does not lose the sign on negative Maths answers', () => {
    const sentence = { answer: '-4' }

    expect(resolveFillBlankMatchMode(sentence)).toBe('numeric')
    expect(checkFillBlankAnswer('−4', sentence)).toBe(true)
    expect(checkFillBlankAnswer('4', sentence)).toBe(false)
  })

  it('accepts equivalent decimal, fraction and percentage forms when numeric mode is requested', () => {
    const sentence = { answer: '0.5', matchMode: 'numeric' }

    expect(parseNumericAnswer('1/2')).toBe(0.5)
    expect(checkFillBlankAnswer('1/2', sentence)).toBe(true)
    expect(checkFillBlankAnswer('50%', sentence)).toBe(true)
    expect(checkFillBlankAnswer('0.6', sentence)).toBe(false)
  })

  it('supports exact, case-sensitive formula matching for Chemistry and Music notation', () => {
    const sentence = {
      answer: 'CO2',
      matchMode: 'formula',
      caseSensitive: true,
    }

    expect(normaliseExactAnswer('C O₂', { caseSensitive: true })).toBe('CO2')
    expect(checkFillBlankAnswer('C O₂', sentence)).toBe(true)
    expect(checkFillBlankAnswer('Co2', sentence)).toBe(false)
  })

  it('allows authors to disable typo tolerance for exact key terminology', () => {
    const sentence = { answer: 'miasma', allowTypos: false }

    expect(checkFillBlankAnswer('miasma', sentence)).toBe(true)
    expect(checkFillBlankAnswer('miasm', sentence)).toBe(false)
  })
})
