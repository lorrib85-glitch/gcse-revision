import { describe, expect, it } from 'vitest'

// Deliberately the ONLY STATIC import in this file, and deliberately not the
// registry — transformations.js must be the module that enters first.
//
// transformations.js once imported resolveOptionValues from index.js, which
// made a cycle: importing the preset module first hit a temporal-dead-zone
// error on the registry's own preset table. Every other test reaches these
// presets through the registry, so nothing caught it. This file exists purely
// to enter through the other door.
import {
  enlargePreset,
  reflectPreset,
  rotatePreset,
  translatePreset,
} from '../../src/components/learning/coordinatePlane/presets/transformations.js'

describe('transformations module imported directly', () => {
  it('evaluates without the registry having been loaded first', () => {
    for (const preset of [translatePreset, reflectPreset, rotatePreset, enlargePreset]) {
      expect(preset).toBeDefined()
      expect(typeof preset.derive).toBe('function')
    }
  })

  it('exposes the four presets with their expected ids', () => {
    expect([translatePreset, reflectPreset, rotatePreset, enlargePreset]
      .map(preset => preset.id))
      .toEqual(['translate', 'reflect', 'rotate', 'enlarge'])
  })

  it('can derive a scene without the registry', () => {
    const scene = rotatePreset.derive(
      { cx: 0, cy: 0, angle: '90', direction: 'clockwise' },
      {
        activeId: 'a',
        showGuides: 'active',
        capabilities: rotatePreset.capabilities,
        choices: { angle: '90', direction: 'clockwise' },
        axes: { x: rotatePreset.xAxis, y: rotatePreset.yAxis },
      },
    )

    expect(scene.points.find(point => point.id === 'image-a')).toBeDefined()
  })

  // The assertion that actually bites.
  //
  // Checking only the bindings imported above proves nothing: under Vite's SSR
  // transform each export is a getter wrapped in a swallowing try/catch, so a
  // temporal-dead-zone ReferenceError is discarded and the getter simply
  // returns undefined. The four bindings here are populated by the time a test
  // body runs either way.
  //
  // The damage lands one module over. With a cycle in place, entering through
  // transformations.js leaves the REGISTRY holding undefined for exactly the
  // presets involved — a broken app, and green tests. So load the registry
  // second, from inside the test, and check what it actually got.
  it('leaves the registry fully populated when it is loaded second', async () => {
    const { COORDINATE_PLANE_PRESETS } = await import(
      '../../src/components/learning/coordinatePlane/presets/index.js'
    )

    for (const [id, preset] of Object.entries(COORDINATE_PLANE_PRESETS)) {
      expect(preset, `registry entry "${id}" is undefined — a preset import cycle`)
        .toBeDefined()
      expect(typeof preset.derive, `registry entry "${id}"`).toBe('function')
    }

    expect(Object.keys(COORDINATE_PLANE_PRESETS)).toHaveLength(9)
  })
})
