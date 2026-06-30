import { MEDICINE_BY_TOPIC, MEDICINE_QUICKFIRE_QUESTIONS, ALL_MEDICINE_QUESTIONS } from './history/medicine.js'
import { BUILDING_BLOCKS_BY_TOPIC, BUILDING_BLOCKS_QUICKFIRE, ALL_BUILDING_BLOCKS_QUESTIONS } from './science/biology/buildingBlocks.js'
import { ORGANISATION_BY_TOPIC, ORGANISATION_QUICKFIRE, ALL_ORGANISATION_QUESTIONS } from './science/biology/organisation.js'
import { INFECTION_BY_TOPIC, ALL_INFECTION_QUESTIONS } from './science/biology/infectionAndResponse.js'
import { BIOENERGETICS_BY_TOPIC, BIOENERGETICS_QUICKFIRE, ALL_BIOENERGETICS_QUESTIONS } from './science/biology/bioenergetics.js'
import { NUMBER_QUICKFIRE, ALL_NUMBER_QUESTIONS } from './maths/number.js'
import { LANGUAGE_PAPER1_QUICKFIRE, ALL_LANGUAGE_PAPER1_QUESTIONS } from './english/languagePaper1.js'

// Keyed by topicId — drop-in replacement for PAST_PAPER_QS
export const QUESTION_BANKS_BY_MODULE = {
  ...MEDICINE_BY_TOPIC,
  ...BUILDING_BLOCKS_BY_TOPIC,
  ...ORGANISATION_BY_TOPIC,
  ...INFECTION_BY_TOPIC,
  ...BIOENERGETICS_BY_TOPIC,
}

// All quickfire questions from module banks (replaces QUICK_FIRE_HANDWRITTEN_QUESTIONS)
export const ALL_MODULE_QUICKFIRE_QUESTIONS = [
  ...MEDICINE_QUICKFIRE_QUESTIONS,
  ...BUILDING_BLOCKS_QUICKFIRE,
  ...ORGANISATION_QUICKFIRE,
  ...BIOENERGETICS_QUICKFIRE,
  ...NUMBER_QUICKFIRE,
  ...LANGUAGE_PAPER1_QUICKFIRE,
]

// Flat list of all questions
export const ALL_QUESTIONS = [
  ...ALL_MEDICINE_QUESTIONS,
  ...ALL_BUILDING_BLOCKS_QUESTIONS,
  ...ALL_ORGANISATION_QUESTIONS,
  ...ALL_INFECTION_QUESTIONS,
  ...ALL_BIOENERGETICS_QUESTIONS,
  ...ALL_NUMBER_QUESTIONS,
  ...ALL_LANGUAGE_PAPER1_QUESTIONS,
]

export function getQuestionsBySubject(subject) {
  return ALL_QUESTIONS.filter(q => q.subject === subject)
}

export function getQuestionsByModule(moduleId) {
  return QUESTION_BANKS_BY_MODULE[moduleId] || []
}

export function getQuestionsByTopic(topicId) {
  return QUESTION_BANKS_BY_MODULE[topicId] || []
}

export function getQuestionsByTags(tags) {
  const tagSet = Array.isArray(tags) ? tags : [tags]
  return ALL_QUESTIONS.filter(q => q.tags && tagSet.every(t => q.tags.includes(t)))
}

export function getQuestionsByDifficulty(min, max) {
  return ALL_QUESTIONS.filter(q => q.difficulty >= min && q.difficulty <= max)
}
