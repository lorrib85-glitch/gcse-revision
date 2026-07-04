import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as masteryEngine from '../../src/data/masteryEngine/index.js'
import {
  createEmptyMasteryState,
  recordAttempt,
  recordCorrect,
  getConceptMastery,
} from '../../src/data/masteryEngine/index.js'
import { ALL_CONCEPTS } from '../../src/data/learningGraph/conceptRegistry.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ENGINE_DIR = join(__dirname, '../../src/data/masteryEngine')

const engineFiles = readdirSync(ENGINE_DIR)
  .filter(name => name.endsWith('.js'))
  .map(name => join(ENGINE_DIR, name))

// ─── Purity: pure logic layer, no React, no UI, no app imports ───────────────

describe('Mastery engine — module purity', () => {
  it('finds the mastery engine source files', () => {
    expect(engineFiles.length).toBeGreaterThanOrEqual(6)
  })

  it('no React, JSX, component, feature, or app-layer imports anywhere', () => {
    for (const file of engineFiles) {
      const src = readFileSync(file, 'utf8')
      expect(src, `${file} imports react`).not.toMatch(/from ['"]react/)
      expect(src, `${file} imports a component`).not.toMatch(/from ['"].*components\//)
      expect(src, `${file} imports app layer`).not.toMatch(/from ['"].*\/app\//)
      expect(src, `${file} imports features`).not.toMatch(/from ['"].*features\//)
      expect(src, `${file} imports jsx`).not.toMatch(/from ['"].*\.jsx['"]/)
    }
  })

  it('no direct localStorage access anywhere in the engine', () => {
    for (const file of engineFiles) {
      const src = readFileSync(file, 'utf8')
      expect(src, `${file} touches localStorage`).not.toMatch(/localStorage/)
    }
  })

  it('only masteryStore.js may reach the persistence boundary; pure files stay leaf-local', () => {
    for (const file of engineFiles) {
      const src = readFileSync(file, 'utf8')
      const imports = [...src.matchAll(/from ['"]([^'"]+)['"]/g)].map(m => m[1])
      for (const spec of imports) {
        expect(spec.startsWith('./') || spec.startsWith('../'), `${file} imports "${spec}"`).toBe(true)
        if (basename(file) === 'masteryStore.js') {
          const allowed = spec.startsWith('./') || spec === '../../lib/storage.js'
          expect(allowed, `masteryStore.js may only import engine files + lib/storage.js, got "${spec}"`).toBe(true)
        } else {
          const allowed = spec.startsWith('./') || spec.startsWith('../learningGraph/')
          expect(allowed, `${file} escapes the pure leaf via "${spec}"`).toBe(true)
        }
      }
    }
  })
})

// ─── Registry coupling: the engine speaks only registered concept ids ────────

describe('Mastery engine — learning graph coupling', () => {
  it('rejects unknown concept ids instead of silently accepting drift', () => {
    const state = createEmptyMasteryState()
    expect(() => recordAttempt(state, { conceptId: 'history:medicine:invented', correct: true })).toThrow()
    expect(() => recordCorrect(state, 'free-text-tag')).toThrow()
    expect(() => getConceptMastery(state, 'biology:speculative:thing')).toThrow()
  })

  it('accepts every registered concept id, and keys each exactly once', () => {
    let state = createEmptyMasteryState()
    for (const { id } of ALL_CONCEPTS) {
      state = recordCorrect(state, id, { at: 1 })
      state = recordCorrect(state, id, { at: 2 })
    }
    const keys = Object.keys(state.concepts)
    expect(keys.length).toBe(ALL_CONCEPTS.length)
    expect(new Set(keys).size).toBe(keys.length)
    for (const key of keys) expect(state.concepts[key].attempts).toBe(2)
  })
})

// ─── Pure functions: immutability contract at the API boundary ───────────────

describe('Mastery engine — pure update functions', () => {
  it('recorders return new state and never mutate the input', () => {
    const empty = createEmptyMasteryState()
    const frozenEmpty = JSON.parse(JSON.stringify(empty))
    const next = recordCorrect(empty, ALL_CONCEPTS[0].id, { at: 1 })
    expect(empty).toEqual(frozenEmpty)
    expect(next).not.toBe(empty)
    expect(next.concepts).not.toBe(empty.concepts)
  })
})

// ─── Public API stability ─────────────────────────────────────────────────────

describe('Mastery engine — public API surface', () => {
  it('index.js exports the full documented API', () => {
    const expected = [
      'MASTERY_STATE_VERSION',
      'EVIDENCE_WINDOW',
      'STRENGTH_BANDS',
      'createEmptyMasteryState',
      'createEmptyConceptEvidence',
      'isMasteryState',
      'recordAttempt',
      'recordCorrect',
      'recordIncorrect',
      'mergeEvidence',
      'calculateMastery',
      'calculateConfidence',
      'calculateStrength',
      'getConceptMastery',
      'getAllConceptMastery',
      'identifyWeakConcepts',
      'identifyStrongConcepts',
      'identifyNeglectedConcepts',
      'MASTERY_STORAGE_KEY',
      'loadMasteryState',
      'saveMasteryState',
    ]
    for (const name of expected) {
      expect(masteryEngine[name], `index.js is missing export "${name}"`).toBeDefined()
    }
  })

  it('only authorised consumers touch the engine (Phase 3A: QuickFire recorder)', () => {
    // Each consumer of the mastery engine is authorised phase by phase.
    // Extend this allowlist only in a phase that explicitly wires a new
    // consumer — accidental coupling stays blocked.
    const AUTHORISED_CONSUMERS = new Set([
      join('features', 'quickfire', 'logic', 'masteryRecorder.js'), // Phase 3A — write-only recorder
    ])
    const srcRoot = join(__dirname, '../../src')
    const offenders = []
    for (const entry of readdirSync(srcRoot, { recursive: true })) {
      const rel = String(entry)
      if (!/\.(js|jsx)$/.test(rel) || rel.startsWith(join('data', 'masteryEngine'))) continue
      if (AUTHORISED_CONSUMERS.has(rel)) continue
      const src = readFileSync(join(srcRoot, rel), 'utf8')
      if (/masteryEngine/.test(src)) offenders.push(rel)
    }
    expect(offenders).toEqual([])
  })
})
