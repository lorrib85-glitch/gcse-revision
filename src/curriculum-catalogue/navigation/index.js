// ─── Subject-browser navigation configuration — validation ────────────────
//
// BUILD-TIME ONLY. Browser entries configure this app's learner-facing
// destinations over the canonical curriculum. They are not curriculum records,
// are not counted as a seventh entity type and never reach production except
// through the generated navigation projection.

import { checkSerialisable } from '../schema.js'
import browserEntries from './browserEntries.js'

export const NAVIGATION_CARD_MODES = ['chapter', 'module', 'none']

const ENTRY_KEYS = [
  'id', 'position', 'label', 'title', 'description', 'heroImage', 'themeKey',
  'subjectIds', 'pathwayIds', 'moduleIds', 'cardMode', 'comingSoon', 'sections',
  'displayNumberOverrides', 'cardLabelOverrides',
]
const SECTION_KEYS = ['id', 'title', 'shortLabel', 'heroImage', 'comingSoon', 'moduleIds']
const COMING_SOON_KEYS = ['title', 'subtitle']
const OVERRIDE_KEYS = ['value', 'preserves', 'retireWhen']

const isPlainObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0
const isStringArray = value => Array.isArray(value) && value.every(isNonEmptyString)
const isNonNegativeInteger = value => Number.isInteger(value) && value >= 0

function unknownKeys(problems, label, value, allowed) {
  if (!isPlainObject(value)) return
  const allowedSet = new Set(allowed)
  for (const key of Object.keys(value)) {
    if (!allowedSet.has(key)) problems.push(`${label}.${key} is not a known field`)
  }
}

function duplicateValues(values) {
  const seen = new Set()
  const duplicates = new Set()
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value)
    seen.add(value)
  }
  return [...duplicates]
}

function validateImage(problems, label, value) {
  if (!isNonEmptyString(value) || !value.startsWith('/images/')) {
    problems.push(`${label} must be a /images/… public asset path`)
  }
}

function validateComingSoon(problems, label, value) {
  if (!isPlainObject(value)) {
    problems.push(`${label} must be an object`)
    return
  }
  unknownKeys(problems, label, value, COMING_SOON_KEYS)
  if (!isNonEmptyString(value.title)) problems.push(`${label}.title must be a non-empty string`)
  if (!isNonEmptyString(value.subtitle)) problems.push(`${label}.subtitle must be a non-empty string`)
}

function validateOverrideMap(problems, label, value, kind) {
  if (!isPlainObject(value)) {
    problems.push(`${label} must be an object keyed by canonical card id`)
    return
  }
  for (const [id, override] of Object.entries(value)) {
    if (!isNonEmptyString(id) || id.startsWith('cs_')) {
      problems.push(`${label} key "${id}" must be a canonical non-placeholder id`)
    }
    if (!isPlainObject(override)) {
      problems.push(`${label}.${id} must be an object`)
      continue
    }
    unknownKeys(problems, `${label}.${id}`, override, OVERRIDE_KEYS)
    if (kind === 'number') {
      if (!Number.isInteger(override.value) || override.value < 1) {
        problems.push(`${label}.${id}.value must be a positive integer`)
      }
    } else if (!isNonEmptyString(override.value)) {
      problems.push(`${label}.${id}.value must be a non-empty string`)
    }
    if (!isNonEmptyString(override.preserves)) {
      problems.push(`${label}.${id}.preserves must state the visible fact being preserved`)
    }
    if (!isNonEmptyString(override.retireWhen)) {
      problems.push(`${label}.${id}.retireWhen must name the decision that deletes it`)
    }
  }
}

/** Validate browser-entry shape and all references into a loaded catalogue. */
export function validateNavigationConfiguration(entries, catalogue) {
  const problems = []
  if (!Array.isArray(entries)) return ['navigation configuration must export an array']

  const subjectById = new Map(catalogue.subjects.map(record => [record.id, record]))
  const pathwayById = new Map(catalogue.pathways.map(record => [record.id, record]))
  const moduleById = new Map(catalogue.modules.map(record => [record.id, record]))
  const themeKeys = new Set(catalogue.subjects.map(record => record.themeKey))

  const entryIds = []
  const labels = []
  const positions = []

  for (const [entryIndex, entry] of entries.entries()) {
    const label = `navigation[${entryIndex}]`
    if (!isPlainObject(entry)) {
      problems.push(`${label} must be an object`)
      continue
    }
    unknownKeys(problems, label, entry, ENTRY_KEYS)

    if (!isNonEmptyString(entry.id) || !/^[a-z][a-z0-9-]*$/.test(entry.id)) {
      problems.push(`${label}.id must be a stable lowercase navigation id`)
    }
    if (!isNonNegativeInteger(entry.position)) problems.push(`${label}.position must be a non-negative integer`)
    if (!isNonEmptyString(entry.label)) problems.push(`${label}.label must be a non-empty string`)
    if (!isNonEmptyString(entry.title)) problems.push(`${label}.title must be a non-empty string`)
    if (!isNonEmptyString(entry.description)) problems.push(`${label}.description must be a non-empty string`)
    validateImage(problems, `${label}.heroImage`, entry.heroImage)
    if (!isNonEmptyString(entry.themeKey) || !themeKeys.has(entry.themeKey)) {
      problems.push(`${label}.themeKey "${entry.themeKey}" does not resolve to a canonical subject theme`)
    }

    if (!isStringArray(entry.subjectIds) || entry.subjectIds.length === 0) {
      problems.push(`${label}.subjectIds must name at least one canonical subject`)
    } else {
      for (const subjectId of entry.subjectIds) {
        if (!subjectById.has(subjectId)) problems.push(`${label}.subjectIds references unknown subject "${subjectId}"`)
      }
      for (const duplicate of duplicateValues(entry.subjectIds)) {
        problems.push(`${label}.subjectIds repeats "${duplicate}"`)
      }
    }

    if (!isStringArray(entry.pathwayIds) || entry.pathwayIds.length === 0) {
      problems.push(`${label}.pathwayIds must name at least one configured study pathway`)
    } else {
      for (const pathwayId of entry.pathwayIds) {
        if (!pathwayById.has(pathwayId)) problems.push(`${label}.pathwayIds references unknown pathway "${pathwayId}"`)
      }
      for (const duplicate of duplicateValues(entry.pathwayIds)) {
        problems.push(`${label}.pathwayIds repeats "${duplicate}"`)
      }
    }

    if (!NAVIGATION_CARD_MODES.includes(entry.cardMode)) {
      problems.push(`${label}.cardMode must be one of ${NAVIGATION_CARD_MODES.join(' | ')}`)
    }

    if (entry.cardMode === 'none') {
      validateComingSoon(problems, `${label}.comingSoon`, entry.comingSoon)
      if (entry.sections !== null) problems.push(`${label}.sections must be null when cardMode is "none"`)
    } else if (entry.comingSoon !== null) {
      problems.push(`${label}.comingSoon must be null when cards are projected`)
    }

    if ('moduleIds' in entry) {
      if (!isStringArray(entry.moduleIds) || entry.moduleIds.length === 0) {
        problems.push(`${label}.moduleIds must be a non-empty array when present`)
      } else {
        for (const moduleId of entry.moduleIds) {
          if (!moduleById.has(moduleId)) problems.push(`${label}.moduleIds references unknown module "${moduleId}"`)
        }
        for (const duplicate of duplicateValues(entry.moduleIds)) {
          problems.push(`${label}.moduleIds repeats "${duplicate}"`)
        }
      }
    }

    if (entry.sections !== null) {
      if (!Array.isArray(entry.sections) || entry.sections.length === 0) {
        problems.push(`${label}.sections must be null or a non-empty array`)
      } else {
        if ('moduleIds' in entry) problems.push(`${label} must not define both moduleIds and sections`)
        const sectionIds = []
        const claimedModules = []
        entry.sections.forEach((section, sectionIndex) => {
          const sectionLabel = `${label}.sections[${sectionIndex}]`
          if (!isPlainObject(section)) {
            problems.push(`${sectionLabel} must be an object`)
            return
          }
          unknownKeys(problems, sectionLabel, section, SECTION_KEYS)
          if (!isNonEmptyString(section.id) || !/^[a-z][a-z0-9-]*$/.test(section.id)) {
            problems.push(`${sectionLabel}.id must be a stable lowercase id`)
          }
          if (!isNonEmptyString(section.title)) problems.push(`${sectionLabel}.title must be a non-empty string`)
          if (!isNonEmptyString(section.shortLabel)) problems.push(`${sectionLabel}.shortLabel must be a non-empty string`)
          validateImage(problems, `${sectionLabel}.heroImage`, section.heroImage)
          if (typeof section.comingSoon !== 'boolean') problems.push(`${sectionLabel}.comingSoon must be a boolean`)
          if (!isStringArray(section.moduleIds) || section.moduleIds.length === 0) {
            problems.push(`${sectionLabel}.moduleIds must name at least one canonical module`)
          } else {
            for (const moduleId of section.moduleIds) {
              if (!moduleById.has(moduleId)) problems.push(`${sectionLabel}.moduleIds references unknown module "${moduleId}"`)
              claimedModules.push(moduleId)
            }
          }
          sectionIds.push(section.id)
        })
        for (const duplicate of duplicateValues(sectionIds)) problems.push(`${label}.sections repeats id "${duplicate}"`)
        for (const duplicate of duplicateValues(claimedModules)) problems.push(`${label}.sections claims module "${duplicate}" twice`)
      }
    }

    validateOverrideMap(problems, `${label}.displayNumberOverrides`, entry.displayNumberOverrides, 'number')
    validateOverrideMap(problems, `${label}.cardLabelOverrides`, entry.cardLabelOverrides, 'label')

    entryIds.push(entry.id)
    labels.push(entry.label)
    positions.push(entry.position)
  }

  for (const duplicate of duplicateValues(entryIds)) problems.push(`navigation entry id "${duplicate}" is declared twice`)
  for (const duplicate of duplicateValues(labels)) problems.push(`navigation label "${duplicate}" is declared twice`)
  const sortedPositions = [...positions].sort((a, b) => a - b)
  sortedPositions.forEach((position, index) => {
    if (position !== index) problems.push(`navigation positions must be contiguous 0…${entries.length - 1}`)
  })

  checkSerialisable(problems, 'navigation', entries)
  return problems
}

/** Load and validate the navigation configuration against the catalogue. */
export function loadNavigation(catalogue) {
  const problems = validateNavigationConfiguration(browserEntries, catalogue)
  if (problems.length) {
    throw new Error(`curriculum navigation configuration failed:\n  - ${problems.join('\n  - ')}`)
  }
  return browserEntries
}

export { default as browserEntries } from './browserEntries.js'
