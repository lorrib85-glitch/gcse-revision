/**
 * Guard tests for the Medicine Episode 1 concept-support map and its derived
 * concept → revision-screen reverse index.
 *
 * The map (src/data/contentSupport/historyMedicineEpisode01.js) connects each
 * teaching screen to the registered concepts it supports; the derived index
 * powers "you got this concept wrong — revisit these screens" routing. These
 * tests keep the tagging model honest: registered vocabulary only, screen
 * indices in range, and the reverse index faithfully derived from the forward
 * map with no drift.
 */

import { describe, it, expect } from 'vitest'
import SUPPORT, {
  deriveConceptSupport,
  HISTORY_MEDICINE_EPISODE_01_CONCEPT_SUPPORT as INDEX,
} from '../../src/data/contentSupport/historyMedicineEpisode01.js'
import { isConceptId } from '../../src/data/learningGraph/conceptRegistry.js'

const screenIndices = SUPPORT.screens.map(s => s.screenIndex)
const maxScreen = Math.max(...screenIndices)
const stageIds = new Set(SUPPORT.stageRanges.map(r => r.id))
const forwardConcepts = new Set([
  ...SUPPORT.screens.flatMap(s => s.conceptTags),
  ...SUPPORT.stageRanges.flatMap(r => r.conceptTags),
])

describe('Episode 1 support map — forward integrity', () => {
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

  it('has a screen-level entry for all 33 Episode 1 screens (0–32), contiguous, no duplicates', () => {
    const sorted = [...screenIndices].sort((a, b) => a - b)
    expect(sorted).toEqual(Array.from({ length: 33 }, (_, i) => i))
    expect(new Set(screenIndices).size).toBe(screenIndices.length)
  })

  it('every stageRange id is unique and its screenRange is in bounds', () => {
    expect(stageIds.size).toBe(SUPPORT.stageRanges.length)
    for (const r of SUPPORT.stageRanges) {
      const [start, end] = r.screenRange
      expect(start, `${r.id} start`).toBeGreaterThanOrEqual(0)
      if (end !== null) expect(end, `${r.id} end`).toBeGreaterThanOrEqual(start)
    }
  })

  it('stageRanges collectively cover every screen (0–32)', () => {
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

describe('Episode 1 concept-support — derived reverse index', () => {
  it('indexes exactly the concepts that appear in the forward map', () => {
    expect(new Set(Object.keys(INDEX))).toEqual(forwardConcepts)
  })

  it('every indexed key is a registered concept and matches its .concept field', () => {
    for (const [id, entry] of Object.entries(INDEX)) {
      expect(isConceptId(id), `unregistered index key "${id}"`).toBe(true)
      expect(entry.concept).toBe(id)
    }
  })

  it('includes screens from parts 5–6 (now that screens 24–32 are mapped)', () => {
    // The exam-prep / synthesis screens are 24+. At least one concept must now
    // resolve to a revisit screen in that range, and the factors-in-change
    // synthesis concept in particular must reach the exam-prep screens.
    const anyLateScreen = Object.values(INDEX).some(e => e.screens.some(s => s >= 24))
    expect(anyLateScreen, 'no concept resolves to a screen 24+').toBe(true)
    expect(INDEX['history:medicine:factors-in-change'].screens.some(s => s >= 24)).toBe(true)
    expect(INDEX['history:medicine:church-authority'].screens.some(s => s >= 24)).toBe(true)
  })

  it('screens are ascending, in range, and reference a mapped screen entry', () => {
    const mapped = new Set(screenIndices)
    for (const [id, entry] of Object.entries(INDEX)) {
      expect(Array.isArray(entry.screens)).toBe(true)
      const ascending = [...entry.screens].sort((a, b) => a - b)
      expect(entry.screens, `${id} screens not ascending`).toEqual(ascending)
      for (const s of entry.screens) {
        expect(s >= 0 && s <= maxScreen, `${id}: screen ${s} out of range`).toBe(true)
        expect(mapped.has(s), `${id}: screen ${s} not a mapped screen`).toBe(true)
      }
    }
  })

  it('parts reference real stageRange ids', () => {
    for (const [id, entry] of Object.entries(INDEX)) {
      for (const part of entry.parts) {
        expect(stageIds.has(part), `${id}: unknown part "${part}"`).toBe(true)
      }
    }
  })

  it('every concept resolves to at least one revisit target (screen or part)', () => {
    for (const [id, entry] of Object.entries(INDEX)) {
      expect(entry.screens.length + entry.parts.length, `${id} has no revisit target`).toBeGreaterThan(0)
    }
  })

  it('derivation is pure and deterministic (same input → same output)', () => {
    expect(deriveConceptSupport(SUPPORT)).toEqual(deriveConceptSupport(SUPPORT))
    expect(deriveConceptSupport(SUPPORT)).toEqual(INDEX)
  })
})
