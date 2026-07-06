import { describe, it, expect } from 'vitest'
import {
  FUNCTION_TAGS,
  SCREEN_TYPE_FUNCTIONS,
  getTypeInfo,
  isPassive,
  isAssessed,
} from '../../src/data/componentFunctions.js'
import { MEDICINE_EPISODES } from '../../src/content/history/medicine/index.js'

// Every display type used by real content, gathered from screens and their
// nested blocks. Types inside answer options (e.g. 'weak'/'strong' evidence
// labels) are not display types and are excluded by only walking
// screen.type and screen.blocks[].type.
function collectUsedTypes() {
  const types = new Set()
  for (const ep of MEDICINE_EPISODES) {
    for (const screen of ep.screens ?? []) {
      if (screen.type) types.add(screen.type)
      for (const block of screen.blocks ?? []) {
        if (block.type) types.add(block.type)
      }
    }
  }
  return [...types].sort()
}

describe('Component function taxonomy', () => {
  it('defines the nine agreed function tags', () => {
    expect(FUNCTION_TAGS).toEqual([
      'hook-tension',
      'introduce-figure',
      'teach-mechanism',
      'teach-comparison',
      'apply',
      'classify',
      'sequence-process',
      'retrieve',
      'exam-technique',
    ])
  })

  it('every display type used in built content is registered', () => {
    const unregistered = collectUsedTypes().filter(t => !SCREEN_TYPE_FUNCTIONS[t])
    expect(unregistered, `unregistered display types: ${unregistered.join(', ')}`).toEqual([])
  })

  it('every registered type has valid functions and an interaction class', () => {
    for (const [type, info] of Object.entries(SCREEN_TYPE_FUNCTIONS)) {
      expect(info.functions.length, `${type} has no functions`).toBeGreaterThan(0)
      for (const fn of info.functions) {
        expect(FUNCTION_TAGS, `${type} has unknown function "${fn}"`).toContain(fn)
      }
      expect(['passive', 'reveal', 'assessed'], `${type} interaction`).toContain(info.interaction)
    }
  })

  it('helpers agree with the map', () => {
    expect(isPassive('read')).toBe(true)
    expect(isAssessed('quiz')).toBe(true)
    expect(isPassive('quiz')).toBe(false)
    expect(getTypeInfo('read').functions).toContain('teach-mechanism')
    expect(getTypeInfo('nonexistent-type')).toBeNull()
  })
})
