// Governed chapter screen registry.
//
// The authoring contract for chapter screen and nested block types. The entries
// themselves are no longer authored here: they are owned by the component
// catalogue (`src/component-catalogue/records/**` plus the compatibility
// registry) and projected into `generated/componentAuthoringRegistry.js`.
//
// What lives here is the handwritten behaviour that reads them — resolution,
// continuation ownership, header mode and chapter validation. This file stays
// pure so chapter content can be validated in architecture tests and scripts.

import {
  SCREEN_REGISTRY,
  BLOCK_REGISTRY,
  LEGACY_BLOCK_TYPES,
} from './generated/componentAuthoringRegistry.js'

export { SCREEN_REGISTRY, BLOCK_REGISTRY, LEGACY_BLOCK_TYPES }

export function getScreenType(screenDefinition) {
  return screenDefinition?.type || 'standard'
}

export function getScreenDefinition(screenDefinition) {
  return SCREEN_REGISTRY[getScreenType(screenDefinition)] ?? null
}

export function getBlockDefinition(type) {
  return BLOCK_REGISTRY[type] ?? null
}

export function resolveScreenDefinition(screenDefinition) {
  const misconceptionBlock = (screenDefinition?.blocks || [])
    .find(blockDefinition => blockDefinition?.type === 'misconceptionCheck')
  if (misconceptionBlock) return SCREEN_REGISTRY.misconceptionCheck
  return getScreenDefinition(screenDefinition)
}

export function screenHasComponentOwnedContinuation(screenDefinition) {
  const route = resolveScreenDefinition(screenDefinition)
  if (route?.continuation === 'component') return true
  return (screenDefinition?.blocks || []).some(blockDefinition =>
    getBlockDefinition(blockDefinition?.type)?.continuation === 'component',
  )
}

export function isCinematicHeaderScreen(screenDefinition) {
  return getScreenDefinition(screenDefinition)?.headerMode === 'cinematic'
}

export function findScreenIndexByType(screens, type) {
  return (screens || []).findIndex(screenDefinition => getScreenType(screenDefinition) === type)
}

function valueAtPath(value, path) {
  return path.split('.').reduce((current, key) => current?.[key], value)
}

function matchesKind(value, kind) {
  if (kind === 'array') return Array.isArray(value) && value.length > 0
  if (kind === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value)
  if (kind === 'string') return typeof value === 'string' && value.trim().length > 0
  if (kind === 'number') return typeof value === 'number' && Number.isFinite(value)
  return value !== undefined && value !== null
}

function describeRequirement(requirement) {
  return `${requirement.path} (${requirement.kind || 'value'})`
}

function validateRequirements(value, definition, location, errors) {
  for (const requirement of definition.required || []) {
    if (!matchesKind(valueAtPath(value, requirement.path), requirement.kind)) {
      errors.push({
        code: 'REQUIRED_FIELD',
        location,
        message: `${location} requires ${describeRequirement(requirement)} for ${definition.authoringName}.`,
      })
    }
  }

  for (const alternatives of definition.requiredAny || []) {
    const satisfied = alternatives.some(requirement =>
      matchesKind(valueAtPath(value, requirement.path), requirement.kind),
    )
    if (!satisfied) {
      errors.push({
        code: 'REQUIRED_FIELD_ALTERNATIVE',
        location,
        message: `${location} requires one of: ${alternatives.map(describeRequirement).join(', ')} for ${definition.authoringName}.`,
      })
    }
  }
}

export function validateChapterDefinition(chapter) {
  const errors = []
  const warnings = []

  if (typeof chapter !== 'object' || chapter === null || Array.isArray(chapter)) {
    return {
      valid: false,
      errors: [{ code: 'CHAPTER_OBJECT', location: 'chapter', message: 'Chapter content must be an object.' }],
      warnings,
    }
  }

  if (typeof chapter.id !== 'string' || chapter.id.trim() === '') {
    errors.push({ code: 'CHAPTER_ID', location: 'chapter.id', message: 'Chapter content requires a stable string id.' })
  }
  if (!Array.isArray(chapter.screens)) {
    errors.push({ code: 'CHAPTER_SCREENS', location: 'chapter.screens', message: 'Chapter content requires a screens array.' })
    return { valid: false, errors, warnings }
  }

  chapter.screens.forEach((screenDefinition, screenIndex) => {
    const screenLocation = `chapter:${chapter.id || '<unknown>'}:screen:${screenIndex}`
    if (typeof screenDefinition !== 'object' || screenDefinition === null || Array.isArray(screenDefinition)) {
      errors.push({ code: 'SCREEN_OBJECT', location: screenLocation, message: `${screenLocation} must be an object.` })
      return
    }

    const type = getScreenType(screenDefinition)
    const definition = SCREEN_REGISTRY[type]
    if (!definition) {
      errors.push({
        code: 'UNREGISTERED_SCREEN_TYPE',
        location: screenLocation,
        message: `${screenLocation} uses unregistered screen type "${type}". Add an authoring entry to the owning component catalogue record before authoring it.`,
      })
    } else {
      validateRequirements(screenDefinition, definition, screenLocation, errors)
      if (definition.status === 'legacy') {
        warnings.push({
          code: 'LEGACY_SCREEN_TYPE',
          location: screenLocation,
          message: `${screenLocation} uses legacy screen type "${type}"; author "${definition.replacement}" instead.`,
        })
      }
    }

    if (screenDefinition.blocks !== undefined && !Array.isArray(screenDefinition.blocks)) {
      errors.push({ code: 'BLOCKS_ARRAY', location: `${screenLocation}.blocks`, message: `${screenLocation}.blocks must be an array.` })
      return
    }

    ;(screenDefinition.blocks || []).forEach((blockDefinition, blockIndex) => {
      const blockLocation = `${screenLocation}:block:${blockIndex}`
      if (typeof blockDefinition !== 'object' || blockDefinition === null || Array.isArray(blockDefinition)) {
        errors.push({ code: 'BLOCK_OBJECT', location: blockLocation, message: `${blockLocation} must be an object.` })
        return
      }
      const blockType = blockDefinition.type
      const blockContract = BLOCK_REGISTRY[blockType]
      if (!blockContract) {
        errors.push({
          code: 'UNREGISTERED_BLOCK_TYPE',
          location: blockLocation,
          message: `${blockLocation} uses unregistered block type "${blockType || '<missing>'}". Add an authoring entry to the owning component catalogue record before authoring it.`,
        })
        return
      }
      validateRequirements(blockDefinition, blockContract, blockLocation, errors)
      if (blockContract.status === 'legacy') {
        warnings.push({
          code: 'LEGACY_BLOCK_TYPE',
          location: blockLocation,
          message: `${blockLocation} uses legacy block type "${blockType}"; author "${blockContract.replacement}" instead.`,
        })
      }
    })
  })

  return { valid: errors.length === 0, errors, warnings }
}

export function formatChapterSchemaIssues(issues) {
  return (issues || []).map(issue => `${issue.code} ${issue.location}: ${issue.message}`).join('\n')
}
