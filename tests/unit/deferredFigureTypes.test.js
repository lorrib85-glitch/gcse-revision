import { describe, it, expect } from 'vitest'

import {
  DEFERRED_FIGURE_TYPES,
  collectDeferredFigureTypes,
  isDeferredFigureType,
} from '../../src/data/deferredFigureTypes.js'
import { preloadDeferredFigures } from '../../src/components/layout/deferredFigureLoaders.js'

// The scanner decides what a chapter downloads, so its precision is the whole
// point: over-report and a History chapter pulls a Maths engine, under-report
// and the learner meets a loading frame mid-lesson.

const screen = (...blocks) => ({ type: 'standard', blocks })
const chapter = (...screens) => ({ id: 'test', screens })

describe('the deferred type list', () => {
  it('names exactly the six figure types', () => {
    expect([...DEFERRED_FIGURE_TYPES]).toEqual([
      'angleFigure',
      'areaPerimeterFigure',
      'coordinatePlaneFigure',
      'numberLineFigure',
      'circuitDiagram',
      'circuitSymbolReference',
    ])
  })

  it('answers membership without a linear scan', () => {
    expect(isDeferredFigureType('angleFigure')).toBe(true)
    expect(isDeferredFigureType('read')).toBe(false)
    expect(isDeferredFigureType(undefined)).toBe(false)
  })
})

describe('collectDeferredFigureTypes', () => {
  it('returns nothing for a chapter with no figures', () => {
    expect(collectDeferredFigureTypes(chapter(
      screen({ type: 'read', text: 'x' }, { type: 'keypoint', text: 'y' }),
      screen({ type: 'quiz', question: 'q', options: ['a'] }),
    ))).toEqual([])
  })

  it('returns the exact distinct types present, in first-authored order', () => {
    expect(collectDeferredFigureTypes(chapter(
      screen({ type: 'read', text: 'x' }, { type: 'numberLineFigure', preset: 'orderNumbers' }),
      screen({ type: 'angleFigure', preset: 'triangle' }),
    ))).toEqual(['numberLineFigure', 'angleFigure'])
  })

  it('deduplicates repeated types', () => {
    const found = collectDeferredFigureTypes(chapter(
      screen({ type: 'angleFigure', preset: 'triangle' }, { type: 'angleFigure', preset: 'straightLine' }),
      screen({ type: 'angleFigure', preset: 'aroundPoint' }),
    ))
    expect(found).toEqual(['angleFigure'])
  })

  it('distinguishes blocks from screen types of the same name', () => {
    // A screen-level type is not a block, and only blocks carry these
    // renderers. Reading `screen.type` here would preload a chapter's worth of
    // engines off a name collision.
    expect(collectDeferredFigureTypes(chapter(
      { type: 'circuitDiagram', blocks: [{ type: 'read', text: 'x' }] },
    ))).toEqual([])
  })

  it('ignores nested question-item data', () => {
    // A quiz block's options and questions are its own data, not a blocks
    // array, so a `type` living inside them is never an authored block.
    expect(collectDeferredFigureTypes(chapter(
      screen({
        type: 'quiz',
        question: 'Which diagram shows this?',
        options: [{ type: 'angleFigure' }, { type: 'coordinatePlaneFigure' }],
        questions: [{ type: 'circuitDiagram' }],
      }),
    ))).toEqual([])
  })

  it('does not mutate its input', () => {
    const input = chapter(screen({ type: 'angleFigure', preset: 'triangle' }))
    const before = JSON.stringify(input)
    collectDeferredFigureTypes(input)
    expect(JSON.stringify(input)).toBe(before)
    expect(Object.isFrozen(input)).toBe(false) // proves the check is about behaviour, not a frozen input
  })

  it('survives malformed content without throwing', () => {
    // Preloading is a hint. Discovering that a chapter is malformed is the
    // validator's job, and failing here would break a chapter the validator
    // would have reported properly.
    for (const bad of [undefined, null, {}, { screens: null }, { screens: [null, 7, 'x'] },
      { screens: [{ blocks: null }] }, { screens: [{ blocks: [null, 7, {}] }] }]) {
      expect(collectDeferredFigureTypes(bad)).toEqual([])
    }
  })

  it('finds every one of the six', () => {
    const all = chapter(screen(...DEFERRED_FIGURE_TYPES.map(type => ({ type }))))
    expect(collectDeferredFigureTypes(all)).toEqual([...DEFERRED_FIGURE_TYPES])
  })
})

describe('preloadDeferredFigures', () => {
  const spyLoaders = () => {
    const calls = []
    const map = Object.fromEntries(
      DEFERRED_FIGURE_TYPES.map(type => [type, () => { calls.push(type); return Promise.resolve({}) }]),
    )
    return { calls, map }
  }

  it('invokes only the loaders the chapter uses', () => {
    const { calls, map } = spyLoaders()
    const used = collectDeferredFigureTypes(chapter(
      screen({ type: 'read', text: 'x' }, { type: 'angleFigure', preset: 'triangle' }),
      screen({ type: 'circuitDiagram', preset: 'simpleSeries' }),
    ))
    expect(preloadDeferredFigures(used, map)).toEqual(['angleFigure', 'circuitDiagram'])
    expect(calls).toEqual(['angleFigure', 'circuitDiagram'])
  })

  it('invokes nothing for a chapter with no figures', () => {
    const { calls, map } = spyLoaders()
    const used = collectDeferredFigureTypes(chapter(screen({ type: 'read', text: 'x' })))
    expect(preloadDeferredFigures(used, map)).toEqual([])
    expect(calls).toEqual([])
  })

  it('invokes one loader per repeated type', () => {
    const { calls, map } = spyLoaders()
    const used = collectDeferredFigureTypes(chapter(
      screen({ type: 'angleFigure' }, { type: 'angleFigure' }, { type: 'angleFigure' }),
    ))
    expect(preloadDeferredFigures(used, map)).toEqual(['angleFigure'])
    expect(calls).toEqual(['angleFigure'])
  })

  it('ignores unknown types rather than throwing', () => {
    const { calls, map } = spyLoaders()
    expect(preloadDeferredFigures(['notAFigure', 'angleFigure'], map)).toEqual(['angleFigure'])
    expect(calls).toEqual(['angleFigure'])
  })

  it('swallows a rejecting or throwing loader', async () => {
    const map = {
      angleFigure: () => Promise.reject(new Error('offline')),
      circuitDiagram: () => { throw new Error('boom') },
    }
    expect(() => preloadDeferredFigures(['angleFigure', 'circuitDiagram'], map)).not.toThrow()
    // An unhandled rejection here would surface as a page-level error, so the
    // catch is the point: a failed preload has to stay silent and let the
    // render path's fallback do the talking.
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  it('accepts a non-array without throwing', () => {
    expect(preloadDeferredFigures(undefined, {})).toEqual([])
    expect(preloadDeferredFigures(null, {})).toEqual([])
  })
})
