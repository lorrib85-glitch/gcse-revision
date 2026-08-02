// ─── Canonical question metadata contract ────────────────────────────────────
//
// The single source of truth for the shape every question in `ALL_QUESTIONS`
// must satisfy. Pure data layer: no React, no app/feature/component imports, no
// storage, no browser APIs. It may only import `questionTypes.js`.
//
// This module never validates the registry on import and never throws during
// normal use. It exists for architecture tests, future authoring tooling, and
// explicit validation at controlled boundaries.
//
// The two identity fields are deliberately distinct and must not be used
// interchangeably:
//
//   format = how the learner responds and how the question is rendered
//   type   = the assessment / marking family the answer is judged against
//
// See docs/system/QUESTION_BANK_CONTRACT.md.

import { FORMAT, EXAM_TYPE } from './questionTypes.js'

export const REQUIRED_QUESTION_FIELDS = Object.freeze([
  'id',         // stable unique identifier across ALL_QUESTIONS
  'subject',    // 'History', 'Biology', 'Maths', 'English', …
  'module',     // parent curriculum module, e.g. 'Medicine in Britain'
  'topic',      // human-readable topic within the module
  'type',       // assessment/marking family — a registered EXAM_TYPE value
  'format',     // learner interaction/rendering — a registered FORMAT value
  'difficulty', // cognitive demand, integer 1–5
  'marks',      // positive finite number of marks available
  'q',          // question text as the learner reads it
  'ms',         // mark scheme / accepted answer guidance
  'tags',       // learning-graph vocabulary (validity owned by learning-graph.test.js)
  'source',     // provenance, e.g. 'AQA past paper', 'handwritten'
])

export const OPTIONAL_QUESTION_FIELDS = Object.freeze([
  'course',       // e.g. 'Edexcel GCSE History'
  'examBoard',    // e.g. 'Edexcel', 'AQA'
  'unit',         // specification unit reference
  'subtopic',     // finer-grained topic label
  'topicId',      // routing key into QUESTION_BANKS_BY_TOPIC
  'chapterId',    // chapter this question reinforces
  'options',      // MC option strings
  'correct',      // MC correct option index
  'correctIndex', // alternate spelling of `correct`
  'hint',         // learner-facing nudge
  'commandWord',  // exam command word, e.g. 'Explain why'
  'extract',      // source extract shown alongside the question
  'paper',        // past-paper reference
  'topicLabel',   // display label for the topic
  'fig',          // figure key
  'imageKey',     // image key
  'skillTip',     // technique tip
  'note',         // authoring note, e.g. choice-question instructions
])

const REGISTERED_FORMATS = new Set(Object.values(FORMAT))
const REGISTERED_TYPES = new Set(Object.values(EXAM_TYPE))

const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0

// One check per required field, keyed by field name. `validateQuestion` walks
// REQUIRED_QUESTION_FIELDS in declaration order so the error array is
// deterministic for a given input.
const REQUIRED_FIELD_CHECKS = {
  id: q => (isNonEmptyString(q.id) ? null : 'id must be a non-empty string'),
  subject: q => (isNonEmptyString(q.subject) ? null : 'subject must be a non-empty string'),
  module: q => (isNonEmptyString(q.module) ? null : 'module must be a non-empty string'),
  topic: q => (isNonEmptyString(q.topic) ? null : 'topic must be a non-empty string'),
  type: q => (REGISTERED_TYPES.has(q.type) ? null : `type "${q.type}" is not a registered EXAM_TYPE value`),
  format: q => (REGISTERED_FORMATS.has(q.format) ? null : `format "${q.format}" is not a registered FORMAT value`),
  difficulty: q => (Number.isInteger(q.difficulty) && q.difficulty >= 1 && q.difficulty <= 5
    ? null
    : `difficulty must be an integer 1–5 (got ${JSON.stringify(q.difficulty)})`),
  marks: q => (Number.isFinite(q.marks) && q.marks > 0
    ? null
    : `marks must be a positive finite number (got ${JSON.stringify(q.marks)})`),
  q: q => (isNonEmptyString(q.q) ? null : 'q must be a non-empty string'),
  ms: q => (isNonEmptyString(q.ms) ? null : 'ms must be a non-empty string'),
  tags: q => {
    if (!Array.isArray(q.tags) || q.tags.length === 0) return 'tags must be a non-empty array'
    if (!q.tags.every(isNonEmptyString)) return 'tags must contain only non-empty strings'
    return null
  },
  source: q => (isNonEmptyString(q.source) ? null : 'source must be a non-empty string'),
}

// Shared option-list rule for every choice-style format.
function optionErrors(question) {
  if (!Array.isArray(question.options) || question.options.length < 2) {
    return ['options must be an array with at least two entries']
  }
  if (!question.options.every(isNonEmptyString)) {
    return ['options must contain only non-empty strings']
  }
  return []
}

// `correct` is the canonical spelling in the banks; `correctIndex` is accepted
// as an alternate because the exam-mode normaliser emits it.
function answerIndex(question) {
  return question.correct !== undefined ? question.correct : question.correctIndex
}

const FORMAT_CHECKS = {
  [FORMAT.MC]: question => {
    const errors = optionErrors(question)
    if (errors.length > 0) return errors
    const index = answerIndex(question)
    if (!Number.isInteger(index)) {
      return [`correct must be an integer option index (got ${JSON.stringify(index)})`]
    }
    if (index < 0 || index >= question.options.length) {
      return [`correct index ${index} is outside options (length ${question.options.length})`]
    }
    return []
  },

  // No canonical bank question uses mc_multi or truefalse yet, so no answer
  // representation has been agreed for either. Rather than invent one, the
  // schema fails loudly the first time such a question appears — that is a
  // product decision, not something to guess at. Register the representation
  // here (and in QUESTION_BANK_CONTRACT.md) when it is made.
  [FORMAT.MC_MULTI]: question => [
    ...optionErrors(question),
    'format "mc_multi" has no canonical answer representation registered yet — agree one before adding mc_multi questions to a bank',
  ],
  [FORMAT.TRUE_FALSE]: () => [
    'format "truefalse" has no canonical answer representation registered yet — agree one before adding truefalse questions to a bank',
  ],

  // Written answers are marked against `ms`; they carry no options or index.
  [FORMAT.WRITTEN]: () => [],
}

/**
 * Validate one question against the canonical contract.
 *
 * Pure and non-throwing: returns a deterministic array of human-readable error
 * strings, empty when the question conforms. Does not mutate its argument.
 *
 * @param {object} question
 * @returns {string[]}
 */
export function validateQuestion(question) {
  if (question === null || typeof question !== 'object' || Array.isArray(question)) {
    return ['question must be an object']
  }

  const errors = []
  for (const field of REQUIRED_QUESTION_FIELDS) {
    const error = REQUIRED_FIELD_CHECKS[field](question)
    if (error) errors.push(error)
  }

  // Format-specific rules only run once the format itself is trustworthy —
  // otherwise an unregistered format would produce misleading follow-on errors.
  const formatCheck = FORMAT_CHECKS[question.format]
  if (formatCheck) errors.push(...formatCheck(question))

  return errors
}
