/**
 * Concept repair lookup — pure, read-only concept → teaching-screen resolver.
 *
 * Proves the lookup returns Episode 1 screens for supported concepts, empty
 * results for registered-but-unsupported concepts, throws clearly for
 * unregistered concept ids, and stays a pure leaf (no React/component imports).
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  getSupportForConcept,
  getBestSupportScreen,
  getSupportForConcepts,
} from '../../../src/data/contentSupport/conceptRepairLookup.js'
import { isConceptId } from '../../../src/data/learningGraph/conceptRegistry.js'

const EP01 = 'history-medicine-medieval-beliefs-causes'
// registered but not taught in Episode 1 (modern medicine) → no support yet
const UNSUPPORTED = 'history:medicine:penicillin'
const UNREGISTERED = 'history:medicine:not-a-real-concept'

describe('getSupportForConcept — supported Episode 1 concepts', () => {
  for (const concept of [
    'history:medicine:four-humours',
    'history:medicine:galen',
    'history:medicine:miasma',
  ]) {
    it(`${concept} returns Episode 1 teaching screens`, () => {
      const res = getSupportForConcept(concept)
      expect(res.concept).toBe(concept)
      expect(res.screens.length).toBeGreaterThan(0)
      for (const s of res.screens) {
        expect(s.moduleId).toBe(EP01)
        expect(typeof s.screenIndex).toBe('number')
        expect(typeof s.label).toBe('string')
        expect(typeof s.purpose).toBe('string')
        // the screen genuinely lists this concept (exact match, not a broad guess)
        expect(s.conceptTags).toContain(concept)
      }
      // screens are ascending by index (deterministic, single module)
      const idxs = res.screens.map(s => s.screenIndex)
      expect(idxs).toEqual([...idxs].sort((a, b) => a - b))
    })
  }
})

describe('getBestSupportScreen — exact screen preferred', () => {
  it('returns the lowest-index supporting screen', () => {
    const best = getBestSupportScreen('history:medicine:galen')
    expect(best).not.toBeNull()
    expect(best.moduleId).toBe(EP01)
    expect(best.screenIndex).toBe(getSupportForConcept('history:medicine:galen').screens[0].screenIndex)
    expect(best.conceptTags).toContain('history:medicine:galen')
  })

  it('returns null for a registered concept with no screen support', () => {
    expect(getBestSupportScreen(UNSUPPORTED)).toBeNull()
  })
})

describe('registered-but-unsupported concepts return empty results', () => {
  it(`${UNSUPPORTED} is registered but has no Episode 1 support`, () => {
    expect(isConceptId(UNSUPPORTED)).toBe(true)
    const res = getSupportForConcept(UNSUPPORTED)
    expect(res).toEqual({ concept: UNSUPPORTED, screens: [], parts: [] })
  })
})

describe('unregistered Medicine ids fail clearly', () => {
  it('throws for an unregistered history:medicine:* id, naming the id', () => {
    expect(isConceptId(UNREGISTERED)).toBe(false)
    expect(() => getSupportForConcept(UNREGISTERED)).toThrow(UNREGISTERED)
  })

  it('getBestSupportScreen and getSupportForConcepts also reject unregistered ids', () => {
    expect(() => getBestSupportScreen(UNREGISTERED)).toThrow(UNREGISTERED)
    expect(() => getSupportForConcepts(['history:medicine:galen', UNREGISTERED])).toThrow(UNREGISTERED)
  })

  it('rejects non-string / malformed input', () => {
    expect(() => getSupportForConcept(undefined)).toThrow()
    expect(() => getSupportForConcept('not-a-concept')).toThrow()
    expect(() => getSupportForConcepts('history:medicine:galen')).toThrow(TypeError)
  })
})

describe('getSupportForConcepts — batch union, deterministic ranking', () => {
  it('unions screens across concepts and ranks by match count then index', () => {
    const res = getSupportForConcepts(['history:medicine:galen', 'history:medicine:church-authority'])
    expect(res.concepts).toEqual(['history:medicine:galen', 'history:medicine:church-authority'])
    expect(res.perConcept).toHaveLength(2)
    expect(res.screens.length).toBeGreaterThan(0)
    // ranking is non-increasing by matched-concept count
    for (let i = 1; i < res.screens.length; i++) {
      expect(res.screens[i - 1].matchedConcepts.length).toBeGreaterThanOrEqual(res.screens[i].matchedConcepts.length)
    }
    // a screen teaching both concepts ranks first and lists both
    expect(res.screens[0].matchedConcepts).toEqual(
      ['history:medicine:church-authority', 'history:medicine:galen'],
    )
  })

  it('is deterministic (same input → identical output)', () => {
    const input = ['history:medicine:galen', 'history:medicine:miasma']
    expect(getSupportForConcepts(input)).toEqual(getSupportForConcepts(input))
  })

  it('returns empty screens for an all-unsupported batch', () => {
    const res = getSupportForConcepts([UNSUPPORTED])
    expect(res.screens).toEqual([])
  })
})

describe('purity — no React / component / runtime-lesson imports', () => {
  const src = readFileSync(
    resolve(process.cwd(), 'src/data/contentSupport/conceptRepairLookup.js'),
    'utf8',
  )
  it('does not import React or JSX/components', () => {
    expect(src).not.toMatch(/from ['"]react/)
    expect(src).not.toMatch(/from ['"][^'"]*components\//)
    expect(src).not.toMatch(/from ['"][^'"]*\.jsx['"]/)
  })
  it('does not import runtime lesson content (src/content/…)', () => {
    expect(src).not.toMatch(/from ['"][^'"]*\/content\/history\//)
  })
})
