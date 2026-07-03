// ─── Canonical Learning Graph — concept registry ────────────────────────────
//
// Single source of truth for every knowledge atom in the app. A concept
// exists exactly once, here; modules, screens, questions, exam papers, the
// planner and analytics all reference concepts by id and never invent new
// spellings. Enforced by tests/architecture/learning-graph.test.js.
//
// Node kinds by id shape:
//   subject:course          → course node   (e.g. history:medicine)
//   subject:course:concept  → knowledge atom (e.g. history:medicine:galen)
//
// Adding a subject later = add a concepts/<subjectCourse>.js file and append
// its export below. No registry redesign needed for biology:cell,
// maths:factorising, english:macbeth:ambition, etc.
//
// This file must stay pure data: no React, no app imports, no side effects.

import { HISTORY_MEDICINE_CONCEPTS } from './concepts/historyMedicine.js'
import { COURSE_NODES } from './concepts/courseNodes.js'

export const ALL_CONCEPTS = [
  ...HISTORY_MEDICINE_CONCEPTS,
  ...COURSE_NODES,
]

export const CONCEPTS = {}
for (const concept of ALL_CONCEPTS) {
  CONCEPTS[concept.id] = concept
}

// Subject namespaces claimed by the registry (e.g. ['history']). Any tag in
// one of these namespaces MUST be a registered concept id — that is what
// stops free-text drift.
export const CONCEPT_SUBJECT_NAMESPACES = [
  ...new Set(ALL_CONCEPTS.map(c => c.id.split(':')[0])),
]

export function getConcept(id) {
  return CONCEPTS[id] || null
}

export function isConceptId(id) {
  return Object.prototype.hasOwnProperty.call(CONCEPTS, id)
}

// A concept tag is simply a tag that is a registered concept id.
export function isConceptTag(tag) {
  return isConceptId(tag)
}

export function getConceptsByCourse(subject, course) {
  const prefix = `${subject}:${course}:`
  return ALL_CONCEPTS.filter(c => c.id.startsWith(prefix))
}
