import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  FACET_NAMESPACES,
  isValidTag,
  isFacetTag,
  tagNamespace,
} from '../../src/data/learningGraph/tagSchema.js'
import { resolveEffectiveTags } from '../../src/data/learningGraph/resolveTags.js'
import {
  ALL_CONCEPTS,
  CONCEPTS,
  CONCEPT_SUBJECT_NAMESPACES,
  getConcept,
  isConceptId,
  isConceptTag,
  getConceptsByCourse,
} from '../../src/data/learningGraph/conceptRegistry.js'
import {
  MEDICINE_TOPICS,
  MEDICINE_SCREEN_TAG_CONCEPTS,
} from '../../src/data/learningGraph/concepts/historyMedicine.js'

import { MODULES } from '../../src/modules.js'
import { ALL_QUESTIONS } from '../../src/data/questionBanks/questionRegistry.js'
import { ALL_MEDICINE_QUESTIONS } from '../../src/data/questionBanks/history/medicine.js'
import { MEDICINE_2023_PAPER, ALL_MEDICINE_PAPERS } from '../../src/data/medicineExamPapers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const GRAPH_DIR = join(__dirname, '../../src/data/learningGraph')

// A tag is graph-valid when it is either a facet tag in a known namespace or
// a registered concept id. Tags in a registry-claimed subject namespace
// (e.g. history:*) MUST be registered — that is the anti-drift rule.
function tagProblem(tag) {
  if (!isValidTag(tag)) return `malformed tag "${tag}"`
  const ns = tagNamespace(tag)
  if (CONCEPT_SUBJECT_NAMESPACES.includes(ns)) {
    return isConceptTag(tag) ? null : `unregistered concept tag "${tag}"`
  }
  if (FACET_NAMESPACES.includes(ns)) {
    return isFacetTag(tag) ? null : `malformed facet tag "${tag}"`
  }
  return `unknown tag namespace "${ns}" in "${tag}"`
}

// ─── Concept registry integrity ───────────────────────────────────────────────

describe('Learning graph — concept registry integrity', () => {
  it('has at least the Medicine Through Time proof-of-concept content', () => {
    expect(ALL_CONCEPTS.length).toBeGreaterThan(50)
    expect(getConceptsByCourse('history', 'medicine').length).toBeGreaterThan(50)
  })

  it('every concept id is unique (no duplicate definitions)', () => {
    const ids = ALL_CONCEPTS.map(c => c.id)
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dupes).toEqual([])
    expect(Object.keys(CONCEPTS).length).toBe(ALL_CONCEPTS.length)
  })

  it('every concept id is a valid 2-segment course node or 3+-segment concept id', () => {
    for (const { id } of ALL_CONCEPTS) {
      expect(isValidTag(id), `invalid concept id "${id}"`).toBe(true)
      const segments = id.split(':')
      expect(segments.length, `"${id}" must have 2–4 segments`).toBeGreaterThanOrEqual(2)
      // concept namespaces must never collide with facet namespaces
      expect(FACET_NAMESPACES, `"${id}" uses a facet namespace as subject`).not.toContain(segments[0])
    }
  })

  it('every concept has a non-empty human label', () => {
    for (const concept of ALL_CONCEPTS) {
      expect(typeof concept.label, `${concept.id} label`).toBe('string')
      expect(concept.label.trim().length, `${concept.id} label empty`).toBeGreaterThan(0)
    }
  })

  it('lookup helpers agree with the concept list', () => {
    for (const concept of ALL_CONCEPTS) {
      expect(getConcept(concept.id)).toBe(concept)
      expect(isConceptId(concept.id)).toBe(true)
    }
    expect(getConcept('history:medicine:not-a-thing')).toBeNull()
    expect(isConceptId('history:medicine:not-a-thing')).toBe(false)
  })
})

// ─── Purity: no React, no app imports, no circular imports ───────────────────

describe('Learning graph — module purity', () => {
  const graphFiles = []
  for (const entry of readdirSync(GRAPH_DIR, { recursive: true })) {
    const name = String(entry)
    if (name.endsWith('.js')) graphFiles.push(join(GRAPH_DIR, name))
  }

  it('finds the learning graph source files', () => {
    expect(graphFiles.length).toBeGreaterThanOrEqual(5)
  })

  it('no React, JSX, or app-layer imports inside the registry', () => {
    for (const file of graphFiles) {
      const src = readFileSync(file, 'utf8')
      expect(src, `${file} imports react`).not.toMatch(/from ['"]react/)
      expect(src, `${file} imports a component`).not.toMatch(/from ['"].*components\//)
      expect(src, `${file} imports app layer`).not.toMatch(/from ['"].*\/app\//)
      expect(src, `${file} imports features`).not.toMatch(/from ['"].*features\//)
      expect(src, `${file} imports jsx`).not.toMatch(/from ['"].*\.jsx['"]/)
      expect(src, `${file} touches storage`).not.toMatch(/localStorage/)
    }
  })

  it('registry files only import from within the learning graph (no cycles possible)', () => {
    for (const file of graphFiles) {
      const src = readFileSync(file, 'utf8')
      const imports = [...src.matchAll(/from ['"]([^'"]+)['"]/g)].map(m => m[1])
      for (const spec of imports) {
        expect(spec.startsWith('./') || spec.startsWith('../'), `${file} imports "${spec}"`).toBe(true)
        expect(spec, `${file} escapes learningGraph via "${spec}"`).not.toMatch(/\.\.\/\.\./)
      }
    }
  })
})

// ─── Tag inheritance ─────────────────────────────────────────────────────────

describe('Learning graph — resolveEffectiveTags', () => {
  it('merges module → topic → question layers in order', () => {
    expect(resolveEffectiveTags(['a:b'], ['c:d'], ['e:f'])).toEqual(['a:b', 'c:d', 'e:f'])
  })

  it('dedupes repeated tags, keeping first occurrence', () => {
    expect(resolveEffectiveTags(['a:b', 'c:d'], ['c:d', 'e:f'], ['a:b'])).toEqual(['a:b', 'c:d', 'e:f'])
  })

  it('ignores missing layers and non-string entries', () => {
    expect(resolveEffectiveTags(undefined, null, ['a:b', null, 7], undefined)).toEqual(['a:b'])
    expect(resolveEffectiveTags()).toEqual([])
  })

  it('does not mutate its inputs', () => {
    const layer = ['a:b', 'c:d']
    resolveEffectiveTags(layer, ['c:d'])
    expect(layer).toEqual(['a:b', 'c:d'])
  })

  it('resolves a real medicine question through module + topic + question layers', () => {
    const mod = MODULES.find(m => m.id === 'history-medicine-medieval-beliefs-causes')
    const question = ALL_MEDICINE_QUESTIONS.find(q => q.id === 'med-th1-003')
    const effective = resolveEffectiveTags(mod.tags, MEDICINE_TOPICS[question.topicId].tags, question.tags)
    expect(effective).toContain('subject:history')          // inherited from module
    expect(effective).toContain('period:medieval')          // module + topic, deduped
    expect(effective).toContain('history:medicine:black-death') // question's own
    expect(effective.filter(t => t === 'period:medieval')).toHaveLength(1)
  })
})

// ─── Tagged content resolves against the registry ────────────────────────────

describe('Learning graph — tagged content uses only registered vocabulary', () => {
  it('every module tag is a registered concept or known facet', () => {
    for (const mod of MODULES) {
      for (const tag of mod.tags ?? []) {
        expect(tagProblem(tag), `${mod.id}: ${tagProblem(tag)}`).toBeNull()
      }
    }
  })

  it('all 14 Medicine modules carry subject/course tags', () => {
    const medicine = MODULES.filter(m => m.series === 'medicine')
    expect(medicine).toHaveLength(14)
    for (const mod of medicine) {
      expect(mod.tags, `${mod.id} missing tags`).toBeDefined()
      expect(mod.tags).toContain('subject:history')
      expect(mod.tags).toContain('course:medicine')
    }
  })

  it('every question tag across ALL_QUESTIONS is registered vocabulary', () => {
    for (const q of ALL_QUESTIONS) {
      for (const tag of q.tags ?? []) {
        expect(tagProblem(tag), `${q.id}: ${tagProblem(tag)}`).toBeNull()
      }
    }
  })

  it('every medicine question has tags including the course tag', () => {
    for (const q of ALL_MEDICINE_QUESTIONS) {
      expect(Array.isArray(q.tags), `${q.id} has no tags`).toBe(true)
      expect(q.tags, `${q.id} missing course tag`).toContain('history:medicine')
    }
  })

  it('every medicine question carries at least one concept tag (knowledge atom)', () => {
    for (const q of ALL_MEDICINE_QUESTIONS) {
      const concepts = q.tags.filter(t => isConceptTag(t) && t.split(':').length > 2)
      expect(concepts.length, `${q.id} has no concept tag`).toBeGreaterThan(0)
    }
  })

  it('question ids remain unique across ALL_QUESTIONS', () => {
    const ids = ALL_QUESTIONS.map(q => q.id)
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dupes).toEqual([])
  })

  it('every medicine question topicId has a topic entry with valid tags', () => {
    for (const q of ALL_MEDICINE_QUESTIONS) {
      const topic = MEDICINE_TOPICS[q.topicId]
      expect(topic, `${q.id} topicId "${q.topicId}" missing from MEDICINE_TOPICS`).toBeDefined()
      for (const tag of topic.tags) {
        expect(tagProblem(tag), `topic ${q.topicId}: ${tagProblem(tag)}`).toBeNull()
      }
    }
  })
})

// ─── Exam papers ─────────────────────────────────────────────────────────────

describe('Learning graph — exam paper tagging', () => {
  it('every medicine paper has valid paper-level tags', () => {
    for (const paper of ALL_MEDICINE_PAPERS) {
      expect(Array.isArray(paper.tags), `${paper.id} has no tags`).toBe(true)
      expect(paper.tags).toContain('history:medicine')
      expect(paper.tags).toContain('examboard:edexcel')
      for (const tag of paper.tags) {
        expect(tagProblem(tag), `${paper.id}: ${tagProblem(tag)}`).toBeNull()
      }
    }
  })

  it('every question inside the June 2023 paper owns its own valid tags', () => {
    for (const q of MEDICINE_2023_PAPER.questions) {
      expect(Array.isArray(q.tags), `${q.id} has no tags`).toBe(true)
      for (const tag of q.tags) {
        expect(tagProblem(tag), `${q.id}: ${tagProblem(tag)}`).toBeNull()
      }
    }
  })
})

// ─── Legacy screen-tag bridge ────────────────────────────────────────────────

describe('Learning graph — legacy screen-tag bridge', () => {
  const medicineScreenTags = new Set(
    MODULES.filter(m => m.series === 'medicine')
      .flatMap(m => m.screenTags ?? [])
      .filter(Boolean),
  )

  it('every bridged screen tag exists in a medicine module screenTags array', () => {
    for (const legacyTag of Object.keys(MEDICINE_SCREEN_TAG_CONCEPTS)) {
      expect(medicineScreenTags.has(legacyTag), `"${legacyTag}" not found in any medicine screenTags`).toBe(true)
    }
  })

  it('every bridged concept id is registered', () => {
    for (const [legacyTag, conceptId] of Object.entries(MEDICINE_SCREEN_TAG_CONCEPTS)) {
      expect(isConceptId(conceptId), `"${legacyTag}" maps to unregistered "${conceptId}"`).toBe(true)
    }
  })
})
