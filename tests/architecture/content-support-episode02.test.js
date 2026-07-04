/**
 * Guard tests for the Medicine Episode 2 (Black Death) concept-support map and
 * its derived concept → revision-screen reverse index. Mirrors the Episode 1
 * guard, and additionally checks that Black Death concepts resolve to Episode 2
 * teaching screens through the shared repair lookup.
 */

import { describe, it, expect } from 'vitest'
import SUPPORT, {
  HISTORY_MEDICINE_EPISODE_02_CONCEPT_SUPPORT as INDEX,
} from '../../src/data/contentSupport/historyMedicineEpisode02.js'
import { deriveConceptSupport } from '../../src/data/contentSupport/historyMedicineEpisode01.js'
import { getSupportForConcept } from '../../src/data/contentSupport/conceptRepairLookup.js'
import { isConceptId } from '../../src/data/learningGraph/conceptRegistry.js'

const EP02 = 'history-medicine-black-death'
const SCREEN_COUNT = 27

const screenIndices = SUPPORT.screens.map(s => s.screenIndex)
const maxScreen = Math.max(...screenIndices)
const stageIds = new Set(SUPPORT.stageRanges.map(r => r.id))
const forwardConcepts = new Set([
  ...SUPPORT.screens.flatMap(s => s.conceptTags),
  ...SUPPORT.stageRanges.flatMap(r => r.conceptTags),
])

describe('Episode 2 support map — forward integrity', () => {
  it('targets the Black Death episode', () => {
    expect(SUPPORT.id).toBe(EP02)
  })

  it('every conceptTag (screen + stageRange) is a registered concept id', () => {
    for (const tag of forwardConcepts) {
      expect(isConceptId(tag), `unregistered concept tag "${tag}"`).toBe(true)
    }
  })

  it('missingConceptCandidates are kept out of the live conceptTags (not invented)', () => {
    const candidates = SUPPORT.screens.flatMap(s => s.missingConceptCandidates ?? [])
    for (const candidate of candidates) {
      expect(forwardConcepts.has(candidate), `candidate "${candidate}" leaked into conceptTags`).toBe(false)
    }
  })

  it('has a screen-level entry for all 27 screens (0–26), contiguous, no duplicates', () => {
    const sorted = [...screenIndices].sort((a, b) => a - b)
    expect(sorted).toEqual(Array.from({ length: SCREEN_COUNT }, (_, i) => i))
    expect(new Set(screenIndices).size).toBe(screenIndices.length)
  })

  it('every screen entry has a label, purpose and at least one concept tag', () => {
    for (const s of SUPPORT.screens) {
      expect(typeof s.label, `screen ${s.screenIndex} label`).toBe('string')
      expect(typeof s.purpose, `screen ${s.screenIndex} purpose`).toBe('string')
      expect(s.conceptTags.length, `screen ${s.screenIndex} has no concept tags`).toBeGreaterThan(0)
    }
  })

  it('every stageRange id is unique and its screenRange is in bounds', () => {
    expect(stageIds.size).toBe(SUPPORT.stageRanges.length)
    for (const r of SUPPORT.stageRanges) {
      const [start, end] = r.screenRange
      expect(start, `${r.id} start`).toBeGreaterThanOrEqual(0)
      if (end !== null) expect(end, `${r.id} end`).toBeGreaterThanOrEqual(start)
    }
  })

  it('stageRanges collectively cover every screen (0–26)', () => {
    const covered = new Set()
    for (const r of SUPPORT.stageRanges) {
      const [start, end] = r.screenRange
      const last = end === null ? maxScreen : end
      for (let i = start; i <= last; i++) covered.add(i)
    }
    for (let i = 0; i <= maxScreen; i++) {
      expect(covered.has(i), `screen ${i} not covered by any stageRange`).toBe(true)
    }
  })
})

describe('Episode 2 concept-support — derived reverse index', () => {
  it('indexes exactly the concepts that appear in the forward map', () => {
    expect(new Set(Object.keys(INDEX))).toEqual(forwardConcepts)
  })

  it('every indexed key is a registered concept and matches its .concept field', () => {
    for (const [id, entry] of Object.entries(INDEX)) {
      expect(isConceptId(id), `unregistered index key "${id}"`).toBe(true)
      expect(entry.concept).toBe(id)
    }
  })

  it('screens are ascending, in range, and reference a mapped screen entry', () => {
    const mapped = new Set(screenIndices)
    for (const [id, entry] of Object.entries(INDEX)) {
      const ascending = [...entry.screens].sort((a, b) => a - b)
      expect(entry.screens, `${id} screens not ascending`).toEqual(ascending)
      for (const s of entry.screens) {
        expect(mapped.has(s), `${id}: screen ${s} not a mapped screen`).toBe(true)
      }
    }
  })

  it('derivation is pure and deterministic (same input → same output)', () => {
    expect(deriveConceptSupport(SUPPORT)).toEqual(deriveConceptSupport(SUPPORT))
    expect(deriveConceptSupport(SUPPORT)).toEqual(INDEX)
  })
})

describe('Episode 2 — Black Death concepts resolve to teaching screens via the repair lookup', () => {
  for (const concept of [
    'history:medicine:black-death',
    'history:medicine:flagellants',
    'history:medicine:miasma',
    'history:medicine:factors-in-change',
  ]) {
    it(`${concept} returns Episode 2 screens`, () => {
      const res = getSupportForConcept(concept)
      const ep2Screens = res.screens.filter(s => s.moduleId === EP02)
      expect(ep2Screens.length, `${concept} has no Episode 2 support`).toBeGreaterThan(0)
      for (const s of ep2Screens) {
        expect(s.conceptTags).toContain(concept)
      }
    })
  }
})
