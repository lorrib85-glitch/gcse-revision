// ─── Learner runtime sequence configuration — validation ───────────────────
//
// BUILD-TIME ONLY. Learning Sequences are application configuration over the
// six canonical curriculum entity types. They are not curriculum records and
// reach production only through the generated learner-curriculum projection.

import { checkSerialisable } from '../schema.js'
import learningSequences from './learningSequences.js'

const isPlainObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0
const isStringArray = value => Array.isArray(value) && value.every(isNonEmptyString)

const ALLOWED_KEYS = ['id', 'position', 'title', 'subjectId', 'moduleIds']

function duplicates(values) {
  const seen = new Set()
  const repeated = new Set()
  for (const value of values) {
    if (seen.has(value)) repeated.add(value)
    seen.add(value)
  }
  return [...repeated]
}

/** Validate sequence shape, references and current available-Chapter coverage. */
export function validateLearningSequences(sequences, catalogue) {
  const problems = []
  if (!Array.isArray(sequences)) return ['learning sequences must export an array']

  const moduleById = new Map(catalogue.modules.map(record => [record.id, record]))
  const chapterById = new Map(catalogue.chapters.map(record => [record.id, record]))
  const subjectIds = new Set(catalogue.subjects.map(record => record.id))
  const claimedModules = new Map()
  const claimedAvailableChapters = new Map()
  const ids = []
  const positions = []

  for (const [index, sequence] of sequences.entries()) {
    const label = `learningSequences[${index}]`
    if (!isPlainObject(sequence)) {
      problems.push(`${label} must be an object`)
      continue
    }

    for (const key of Object.keys(sequence)) {
      if (!ALLOWED_KEYS.includes(key)) problems.push(`${label}.${key} is not a known field`)
    }

    if (!isNonEmptyString(sequence.id) || !/^[a-z][a-z0-9-]*$/.test(sequence.id)) {
      problems.push(`${label}.id must be a stable lowercase semantic id`)
    }
    if (!Number.isInteger(sequence.position) || sequence.position < 0) {
      problems.push(`${label}.position must be a non-negative integer`)
    }
    if (!isNonEmptyString(sequence.title)) problems.push(`${label}.title must be a non-empty string`)
    if (!subjectIds.has(sequence.subjectId)) {
      problems.push(`${label}.subjectId references unknown subject "${sequence.subjectId}"`)
    }
    if (!isStringArray(sequence.moduleIds) || sequence.moduleIds.length === 0) {
      problems.push(`${label}.moduleIds must name at least one canonical Module`)
    } else {
      for (const repeated of duplicates(sequence.moduleIds)) {
        problems.push(`${label}.moduleIds repeats "${repeated}"`)
      }
      for (const moduleId of sequence.moduleIds) {
        const module = moduleById.get(moduleId)
        if (!module) {
          problems.push(`${label}.moduleIds references unknown Module "${moduleId}"`)
          continue
        }
        if (module.status === 'retired') {
          problems.push(`${label} references retired Module "${moduleId}"`)
        }
        if (module.subjectId !== sequence.subjectId) {
          problems.push(`${label} is ${sequence.subjectId} but Module "${moduleId}" is ${module.subjectId}`)
        }
        const existing = claimedModules.get(moduleId)
        if (existing) problems.push(`Module "${moduleId}" is claimed by both "${existing}" and "${sequence.id}"`)
        else claimedModules.set(moduleId, sequence.id)

        for (const ref of module.chapterRefs) {
          const chapter = chapterById.get(ref.chapterId)
          if (!chapter || chapter.status !== 'available') continue
          const owner = claimedAvailableChapters.get(chapter.id)
          if (owner) problems.push(`available Chapter "${chapter.id}" is claimed by both "${owner}" and "${sequence.id}"`)
          else claimedAvailableChapters.set(chapter.id, sequence.id)
        }
      }
    }

    ids.push(sequence.id)
    positions.push(sequence.position)
  }

  for (const repeated of duplicates(ids)) problems.push(`learning sequence id "${repeated}" is declared twice`)
  const sortedPositions = [...positions].sort((a, b) => a - b)
  sortedPositions.forEach((position, index) => {
    if (position !== index) problems.push(`learning sequence positions must be contiguous 0…${sequences.length - 1}`)
  })

  for (const chapter of catalogue.chapters) {
    if (chapter.status !== 'available') continue
    if (!claimedAvailableChapters.has(chapter.id)) {
      problems.push(`available Chapter "${chapter.id}" belongs to no Learning Sequence`)
    }
  }

  checkSerialisable(problems, 'learningSequences', sequences)
  return problems
}

export function loadLearningSequences(catalogue) {
  const problems = validateLearningSequences(learningSequences, catalogue)
  if (problems.length) {
    throw new Error(`learner runtime sequence configuration failed:\n  - ${problems.join('\n  - ')}`)
  }
  return learningSequences
}

export { default as learningSequences } from './learningSequences.js'
