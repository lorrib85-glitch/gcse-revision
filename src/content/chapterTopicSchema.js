// Chapter Topic authoring contract.
//
// BUILD-TIME / TEST-TIME ONLY. Learner runtime code must not import this file.
// ADR-0003 owns the contract; this module only enforces it.

import { isConceptId } from '../data/learningGraph/index.js'

export const CHAPTER_TOPIC_AUTHORED_FIELDS = Object.freeze([
  'id',
  'title',
  'conceptIds',
  'estimatedMinutes',
])

const TOPIC_FIELD_SET = new Set(CHAPTER_TOPIC_AUTHORED_FIELDS)
const TOPIC_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SEQUENTIAL_PLACEHOLDER_PATTERN = /^(?:topic|part|section|stage|unit|lesson)-?\d+$/i

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key)
}

function addError(errors, code, location, message) {
  errors.push({ code, location, message })
}

function validateTopicRecord(topic, topicIndex, chapterId, seenIds, errors) {
  const location = `chapter:${chapterId || '<unknown>'}:topic:${topicIndex}`

  if (typeof topic !== 'object' || topic === null || Array.isArray(topic)) {
    addError(errors, 'TOPIC_OBJECT', location, `${location} must be an object.`)
    return
  }

  for (const field of CHAPTER_TOPIC_AUTHORED_FIELDS) {
    if (!hasOwn(topic, field)) {
      addError(
        errors,
        'TOPIC_REQUIRED_FIELD',
        `${location}.${field}`,
        `${location} requires authored field "${field}".`,
      )
    }
  }

  for (const field of Object.keys(topic)) {
    if (!TOPIC_FIELD_SET.has(field)) {
      addError(
        errors,
        'TOPIC_UNAUTHORISED_FIELD',
        `${location}.${field}`,
        `${location} may author only: ${CHAPTER_TOPIC_AUTHORED_FIELDS.join(', ')}. "${field}" is derived, stateful or outside the v1 contract.`,
      )
    }
  }

  if (typeof topic.id !== 'string' || topic.id.trim() === '') {
    addError(errors, 'TOPIC_ID', `${location}.id`, `${location}.id must be a non-empty semantic kebab-case slug.`)
  } else {
    if (!TOPIC_SLUG_PATTERN.test(topic.id)) {
      addError(errors, 'TOPIC_ID_FORMAT', `${location}.id`, `${location}.id must use lowercase semantic kebab case.`)
    }
    if (SEQUENTIAL_PLACEHOLDER_PATTERN.test(topic.id)) {
      addError(errors, 'TOPIC_ID_SEQUENTIAL', `${location}.id`, `${location}.id must describe the teaching unit rather than its position.`)
    }
    if (seenIds.has(topic.id)) {
      addError(errors, 'TOPIC_ID_DUPLICATE', `${location}.id`, `${location}.id duplicates Topic "${topic.id}" within this Chapter.`)
    }
    seenIds.add(topic.id)
  }

  if (typeof topic.title !== 'string' || topic.title.trim() === '') {
    addError(errors, 'TOPIC_TITLE', `${location}.title`, `${location}.title must be non-empty learner-facing text.`)
  }

  if (!Array.isArray(topic.conceptIds) || topic.conceptIds.length === 0) {
    addError(errors, 'TOPIC_CONCEPT_IDS', `${location}.conceptIds`, `${location}.conceptIds must be a non-empty array of registered Concept IDs.`)
  } else {
    const seenConcepts = new Set()
    topic.conceptIds.forEach((conceptId, conceptIndex) => {
      const conceptLocation = `${location}.conceptIds:${conceptIndex}`
      if (typeof conceptId !== 'string' || !isConceptId(conceptId)) {
        addError(errors, 'TOPIC_CONCEPT_UNKNOWN', conceptLocation, `${conceptLocation} must reference a registered Concept ID.`)
        return
      }
      if (seenConcepts.has(conceptId)) {
        addError(errors, 'TOPIC_CONCEPT_DUPLICATE', conceptLocation, `${conceptLocation} duplicates Concept "${conceptId}" within this Topic.`)
      }
      seenConcepts.add(conceptId)
    })
  }

  const minutes = topic.estimatedMinutes
  if (minutes !== null && (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0)) {
    addError(errors, 'TOPIC_ESTIMATED_MINUTES', `${location}.estimatedMinutes`, `${location}.estimatedMinutes must be a positive finite number or null.`)
  }
}

export function validateChapterTopics(chapter) {
  const errors = []
  const warnings = []

  if (typeof chapter !== 'object' || chapter === null || Array.isArray(chapter)) {
    return {
      valid: false,
      errors: [{
        code: 'TOPIC_CHAPTER_OBJECT',
        location: 'chapter',
        message: 'Chapter Topic validation requires a Chapter content object.',
      }],
      warnings,
    }
  }

  const chapterId = typeof chapter.id === 'string' && chapter.id.trim() !== ''
    ? chapter.id
    : '<unknown>'
  const hasTopics = hasOwn(chapter, 'topics')
  const declaredTopicIds = new Set()

  if (hasTopics) {
    if (!Array.isArray(chapter.topics) || chapter.topics.length === 0) {
      addError(errors, 'TOPICS_ARRAY', `chapter:${chapterId}.topics`, `chapter:${chapterId}.topics must be a non-empty array when authored.`)
    } else {
      chapter.topics.forEach((topic, topicIndex) => {
        validateTopicRecord(topic, topicIndex, chapterId, declaredTopicIds, errors)
      })
    }
  }

  if (Array.isArray(chapter.screens)) {
    chapter.screens.forEach((screen, screenIndex) => {
      if (typeof screen !== 'object' || screen === null || Array.isArray(screen) || !hasOwn(screen, 'topic')) return

      const location = `chapter:${chapterId}:screen:${screenIndex}.topic`
      if (typeof screen.topic !== 'string' || screen.topic.trim() === '') {
        addError(errors, 'SCREEN_TOPIC_VALUE', location, `${location} must be an authored local Topic slug; Chapter-level Screens omit the key entirely.`)
      } else if (!declaredTopicIds.has(screen.topic)) {
        addError(errors, 'SCREEN_TOPIC_UNKNOWN', location, `${location} references undeclared Topic "${screen.topic}" in its own Chapter.`)
      }
    })
  } else if (hasTopics) {
    addError(errors, 'TOPIC_SCREENS_ARRAY', `chapter:${chapterId}.screens`, `chapter:${chapterId} must expose a screens array so Topic back-references can be validated.`)
  }

  return { valid: errors.length === 0, errors, warnings }
}

export function formatChapterTopicIssues(issues) {
  return (issues || []).map(issue => `${issue.code} ${issue.location}: ${issue.message}`).join('\n')
}
