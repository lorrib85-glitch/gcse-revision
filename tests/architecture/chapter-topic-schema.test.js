import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadCatalogue } from '../../src/curriculum-catalogue/index.js'
import { CHAPTER_CONTENT_LOADERS } from '../../src/data/learnerCurriculum.js'
import {
  CHAPTER_TOPIC_AUTHORED_FIELDS,
  validateChapterTopics,
} from '../../src/content/chapterTopicSchema.js'

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const VALID_TOPIC = {
  id: 'miasma-and-bad-air',
  title: 'Miasma and bad air',
  conceptIds: ['history:medicine:miasma'],
  estimatedMinutes: 6,
}

function makeChapter(overrides = {}) {
  return {
    id: 'test-chapter',
    screens: [{ type: 'standard' }],
    ...overrides,
  }
}

function errorCodes(chapter) {
  return validateChapterTopics(chapter).errors.map(error => error.code)
}

function collectFiles(directory) {
  return readdirSync(directory).flatMap(name => {
    const path = resolve(directory, name)
    return statSync(path).isDirectory() ? collectFiles(path) : [path]
  })
}

function findTopicKeys(value, path = 'catalogue', findings = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findTopicKeys(item, `${path}[${index}]`, findings))
    return findings
  }
  if (typeof value !== 'object' || value === null) return findings

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`
    if (['topic', 'topics', 'topicId', 'topicRefs'].includes(key)) findings.push(childPath)
    findTopicKeys(child, childPath, findings)
  }
  return findings
}

describe('Chapter Topic schema', () => {
  it('keeps a Chapter with no topics key valid and byte-identical', () => {
    const chapter = makeChapter()
    const before = JSON.stringify(chapter)

    expect(validateChapterTopics(chapter)).toEqual({ valid: true, errors: [], warnings: [] })
    expect(JSON.stringify(chapter)).toBe(before)
    expect(chapter).not.toHaveProperty('topics')
  })

  it('accepts the exact v1 Topic shape and local Screen back-reference', () => {
    const chapter = makeChapter({
      topics: [VALID_TOPIC],
      screens: [
        { type: 'standard', topic: 'miasma-and-bad-air' },
        { type: 'standard' },
      ],
    })

    expect(CHAPTER_TOPIC_AUTHORED_FIELDS).toEqual([
      'id', 'title', 'conceptIds', 'estimatedMinutes',
    ])
    expect(validateChapterTopics(chapter)).toEqual({ valid: true, errors: [], warnings: [] })
  })

  it('requires a non-empty topics array when the key is authored', () => {
    expect(errorCodes(makeChapter({ topics: [] }))).toContain('TOPICS_ARRAY')
    expect(errorCodes(makeChapter({ topics: null }))).toContain('TOPICS_ARRAY')
  })

  it('requires exactly the four v1 authored fields', () => {
    const { title: _title, ...missingTitle } = VALID_TOPIC
    expect(errorCodes(makeChapter({ topics: [missingTitle] }))).toContain('TOPIC_REQUIRED_FIELD')
    expect(errorCodes(makeChapter({ topics: [{ ...VALID_TOPIC, progress: 0 }] }))).toContain('TOPIC_UNAUTHORISED_FIELD')
    expect(errorCodes(makeChapter({ topics: [{ ...VALID_TOPIC, screenIndices: [0] }] }))).toContain('TOPIC_UNAUTHORISED_FIELD')
    expect(errorCodes(makeChapter({ topics: [{ ...VALID_TOPIC, prerequisiteTopicIds: [] }] }))).toContain('TOPIC_UNAUTHORISED_FIELD')
  })

  it('requires semantic unique kebab-case Topic ids', () => {
    expect(errorCodes(makeChapter({ topics: [{ ...VALID_TOPIC, id: 'Miasma' }] }))).toContain('TOPIC_ID_FORMAT')
    expect(errorCodes(makeChapter({ topics: [{ ...VALID_TOPIC, id: 'topic-1' }] }))).toContain('TOPIC_ID_SEQUENTIAL')
    expect(errorCodes(makeChapter({ topics: [VALID_TOPIC, { ...VALID_TOPIC }] }))).toContain('TOPIC_ID_DUPLICATE')
  })

  it('requires non-empty learner-facing titles', () => {
    expect(errorCodes(makeChapter({ topics: [{ ...VALID_TOPIC, title: '   ' }] }))).toContain('TOPIC_TITLE')
  })

  it('requires registered, unique Concept ids', () => {
    expect(errorCodes(makeChapter({ topics: [{ ...VALID_TOPIC, conceptIds: [] }] }))).toContain('TOPIC_CONCEPT_IDS')
    expect(errorCodes(makeChapter({ topics: [{ ...VALID_TOPIC, conceptIds: ['history:medicine:not-registered'] }] }))).toContain('TOPIC_CONCEPT_UNKNOWN')
    expect(errorCodes(makeChapter({
      topics: [{
        ...VALID_TOPIC,
        conceptIds: ['history:medicine:miasma', 'history:medicine:miasma'],
      }],
    }))).toContain('TOPIC_CONCEPT_DUPLICATE')
  })

  it('requires estimatedMinutes to be positive and finite or null', () => {
    expect(validateChapterTopics(makeChapter({ topics: [{ ...VALID_TOPIC, estimatedMinutes: null }] })).valid).toBe(true)
    for (const value of [0, -1, Number.POSITIVE_INFINITY, '6']) {
      expect(errorCodes(makeChapter({ topics: [{ ...VALID_TOPIC, estimatedMinutes: value }] }))).toContain('TOPIC_ESTIMATED_MINUTES')
    }
  })

  it('requires every authored Screen topic to resolve inside its own Chapter', () => {
    expect(errorCodes(makeChapter({
      topics: [VALID_TOPIC],
      screens: [{ type: 'standard', topic: 'religious-explanations' }],
    }))).toContain('SCREEN_TOPIC_UNKNOWN')

    expect(errorCodes(makeChapter({
      topics: [VALID_TOPIC],
      screens: [{ type: 'standard', topic: null }],
    }))).toContain('SCREEN_TOPIC_VALUE')

    expect(errorCodes(makeChapter({
      screens: [{ type: 'standard', topic: 'miasma-and-bad-air' }],
    }))).toContain('SCREEN_TOPIC_UNKNOWN')
  })

  it('validates every existing Chapter without changing its authored bytes', async () => {
    const chaptersWithTopics = []

    for (const [chapterId, loader] of Object.entries(CHAPTER_CONTENT_LOADERS)) {
      const chapter = await loader()
      const before = JSON.stringify(chapter)
      const validation = validateChapterTopics(chapter)

      expect(validation.errors, chapterId).toEqual([])
      expect(validation.warnings, chapterId).toEqual([])
      expect(JSON.stringify(chapter), chapterId).toBe(before)
      if (Object.prototype.hasOwnProperty.call(chapter, 'topics')) chaptersWithTopics.push(chapterId)
    }

    expect(chaptersWithTopics).toEqual([])
  })

  it('keeps Topic fields out of the curriculum catalogue', async () => {
    const catalogue = await loadCatalogue()
    expect(findTopicKeys(catalogue)).toEqual([])
  })

  it('keeps Topic validation and indexing out of production runtime', () => {
    const schemaPath = resolve(ROOT, 'src/content/chapterTopicSchema.js')
    const sourceFiles = collectFiles(resolve(ROOT, 'src'))
      .filter(path => /\.(?:js|jsx|mjs)$/.test(path))
      .filter(path => path !== schemaPath)

    const imports = sourceFiles.filter(path => {
      const source = readFileSync(path, 'utf8')
      return /(?:from\s+|import\s*\()['"][^'"]*chapterTopicSchema\.js['"]/.test(source)
    })

    expect(imports.map(path => path.replace(`${ROOT}/`, ''))).toEqual([])
    expect(existsSync(resolve(ROOT, 'src/data/generated/topicIndex.js'))).toBe(false)
  })

  it('keeps authoring guidance subordinate to ADR-0003', () => {
    const guidance = readFileSync(resolve(ROOT, 'docs/system/CHAPTER_TOPICS.md'), 'utf8')
    expect(guidance).toContain('docs/decisions/0003-canonical-chapter-topic-identity.md')
    expect(guidance).toContain('src/content/chapterTopicSchema.js')
    expect(guidance).toContain('T0B')
  })
})
