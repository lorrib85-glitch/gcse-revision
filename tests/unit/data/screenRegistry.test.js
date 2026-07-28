import { describe, expect, it } from 'vitest'
import {
  findScreenIndexByType,
  resolveScreenDefinition,
  screenHasComponentOwnedContinuation,
  validateChapterDefinition,
} from '../../../src/data/screenRegistry.js'

describe('screenRegistry', () => {
  it('rejects an unregistered screen type with a precise location', () => {
    const result = validateChapterDefinition({ id: 'demo', screens: [{ type: 'madeUpScreen' }] })
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toMatchObject({ code: 'UNREGISTERED_SCREEN_TYPE', location: 'chapter:demo:screen:0' })
  })

  it('rejects an unregistered nested block type', () => {
    const result = validateChapterDefinition({ id: 'demo', screens: [{ blocks: [{ type: 'madeUpBlock' }] }] })
    expect(result.errors.some(error => error.code === 'UNREGISTERED_BLOCK_TYPE')).toBe(true)
  })

  it('validates required component data before runtime', () => {
    const result = validateChapterDefinition({ id: 'demo', screens: [{ type: 'quickRecall', questions: [] }] })
    expect(result.errors.some(error => error.code === 'REQUIRED_FIELD')).toBe(true)
  })

  it('promotes a nested misconception check to its governed full-screen route', () => {
    const definition = resolveScreenDefinition({ blocks: [{ type: 'misconceptionCheck' }] })
    expect(definition.component).toBe('MisconceptionCheck')
    expect(definition.layout).toBe('full')
    expect(definition.status).toBe('derived')
  })

  it('derives continuation ownership from registry metadata', () => {
    expect(screenHasComponentOwnedContinuation({ blocks: [{ type: 'builder' }] })).toBe(true)
    expect(screenHasComponentOwnedContinuation({ blocks: [{ type: 'read', text: 'Hello' }] })).toBe(false)
  })

  it('keeps screen lookup independent from ChapterPlayer routing', () => {
    expect(findScreenIndexByType([{ type: 'conceptReveal' }, { type: 'faceExaminer' }], 'faceExaminer')).toBe(1)
  })

  it('reports grandfathered types as warnings rather than pretending they are active', () => {
    const result = validateChapterDefinition({
      id: 'demo',
      screens: [{ blocks: [{ type: 'timelinedrag', people: [{}], items: [{}] }] }],
    })
    expect(result.valid).toBe(true)
    expect(result.warnings[0]).toMatchObject({ code: 'LEGACY_BLOCK_TYPE' })
  })
})
