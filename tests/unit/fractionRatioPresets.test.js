import { describe, expect, it } from 'vitest'
import {
  FRACTION_RATIO_PRESETS,
  clampPresetValues,
  controlHasStepper,
  presetSteps,
  resolveFractionRatioPreset,
  resolvePresetMethod,
  resolvePresetStep,
} from '../../src/components/learning/fractionRatio/presets/index.js'

const PRESET_NAMES = Object.keys(FRACTION_RATIO_PRESETS)

// Min, middle and max of each control. Exhausting every combination of
// fractionOperations' five controls would be tens of thousands of scenes for no
// extra coverage — the interesting cases live at the ends of each range.
function sampleValues(preset) {
  return preset.controls.reduce((combos, control) => {
    const mid = control.min + Math.floor((control.max - control.min) / 2)
    const samples = [...new Set([control.min, mid, control.max])]
    return combos.flatMap(partial => samples.map(v => ({ ...partial, [control.id]: v })))
  }, [{}])
}

function everyScene(preset) {
  const methods = preset.methods?.map(entry => entry.id) ?? [null]

  return sampleValues(preset).flatMap(values => methods.flatMap((method) => {
    const steps = presetSteps(preset, method)
    const stepIds = steps.length ? steps.map(entry => entry.id) : [null]

    return stepIds.map((step) => {
      const clamped = clampPresetValues(preset, values, { method })
      return {
        values: clamped,
        method,
        step,
        scene: preset.derive(clamped, { method, step }),
      }
    })
  }))
}

describe('preset registry', () => {
  it('registers all eight presets', () => {
    expect(PRESET_NAMES).toEqual([
      'fractionBar',
      'equivalentFractions',
      'fractionOperations',
      'ratioShare',
      'doubleNumberLine',
      'percentageGrid',
      'proportionScale',
      'bestValue',
    ])
  })

  it('resolves a preset by name and passes an object through', () => {
    expect(resolveFractionRatioPreset('fractionBar').id).toBe('fractionBar')
    const custom = { id: 'custom' }
    expect(resolveFractionRatioPreset(custom)).toBe(custom)
  })

  it('throws on an unknown preset name', () => {
    expect(() => resolveFractionRatioPreset('nope')).toThrow(/Unknown FractionRatioExplore preset/)
  })
})

describe.each(PRESET_NAMES)('%s', (name) => {
  const preset = FRACTION_RATIO_PRESETS[name]

  it('declares the metadata the renderer needs', () => {
    expect(preset.id).toBe(name)
    expect(preset.accessibilityLabel).toBeTruthy()
    expect(preset.keyFact).toBeTruthy()
    expect(preset.canvas.width).toBeGreaterThan(0)
    expect(preset.canvas.height).toBeGreaterThan(0)
    expect(Array.isArray(preset.controls)).toBe(true)
  })

  it('keeps initial values inside their control ranges', () => {
    const clamped = clampPresetValues(preset, preset.initialValues)
    for (const control of preset.controls) {
      expect(clamped[control.id]).toBeGreaterThanOrEqual(control.min)
      expect(clamped[control.id]).toBeLessThanOrEqual(control.max)
    }
  })

  it('produces a complete status in every reachable state', () => {
    for (const { scene, method, step } of everyScene(preset)) {
      const where = `${name}/${method}/${step}`
      expect(scene.status, where).toBeTruthy()
      expect(typeof scene.status.heading, where).toBe('string')
      expect(scene.status.heading.length, where).toBeGreaterThan(0)
      expect(typeof scene.status.explanation, where).toBe('string')
      expect(scene.status.explanation.length, where).toBeGreaterThan(0)

      for (const line of scene.status.calculation ?? []) {
        expect(typeof line, where).toBe('string')
        expect(line.length, where).toBeGreaterThan(0)
      }
    }
  })

  it('never renders NaN or undefined into a label', () => {
    for (const { scene, method, step } of everyScene(preset)) {
      const where = `${name}/${method}/${step}`
      const text = [
        scene.status.heading,
        ...(scene.status.calculation ?? []),
        scene.status.explanation,
        ...(scene.labels ?? []).map(item => item.text),
        ...(scene.brackets ?? []).map(item => item.text ?? ''),
      ].join(' | ')

      expect(text, where).not.toMatch(/NaN|undefined|Infinity/)
    }
  })

  it('draws every element inside its canvas', () => {
    const { width, height } = preset.canvas

    for (const { scene, method, step } of everyScene(preset)) {
      const where = `${name}/${method}/${step}`

      for (const bar of scene.bars ?? []) {
        expect(bar.x, `${where} bar ${bar.id} left`).toBeGreaterThanOrEqual(0)
        expect(bar.x + bar.width, `${where} bar ${bar.id} right`).toBeLessThanOrEqual(width)
        expect(bar.y + bar.height, `${where} bar ${bar.id} bottom`).toBeLessThanOrEqual(height)
        expect(bar.parts, `${where} bar ${bar.id} parts`).toBeGreaterThan(0)
      }

      for (const cell of scene.cells ?? []) {
        expect(cell.width, `${where} cell ${cell.id} width`).toBeGreaterThanOrEqual(0)
        expect(cell.x + cell.width, `${where} cell ${cell.id} right`).toBeLessThanOrEqual(width + 0.5)
        expect(cell.y + cell.height, `${where} cell ${cell.id} bottom`).toBeLessThanOrEqual(height + 0.5)
      }

      for (const counter of scene.counters ?? []) {
        expect(counter.cx + counter.r, `${where} counter ${counter.id}`).toBeLessThanOrEqual(width + 0.5)
        expect(counter.cy + counter.r, `${where} counter ${counter.id}`).toBeLessThanOrEqual(height + 0.5)
      }
    }
  })

  it('anchors every handle to a real control, inside the canvas', () => {
    const controlIds = new Set(preset.controls.map(control => control.id))

    for (const { scene, method, step } of everyScene(preset)) {
      const where = `${name}/${method}/${step}`
      for (const handle of scene.handles ?? []) {
        expect(controlIds.has(handle.controlId), `${where} handle ${handle.controlId}`).toBe(true)
        expect(Number.isFinite(handle.x), `${where} handle x`).toBe(true)
        expect(Number.isFinite(handle.y), `${where} handle y`).toBe(true)
        expect(handle.x, `${where} handle x`).toBeGreaterThanOrEqual(0)
        expect(handle.x, `${where} handle x`).toBeLessThanOrEqual(preset.canvas.width)
      }
    }
  })

  it('gives every draggable control a way to read a pointer', () => {
    for (const { scene } of everyScene(preset)) {
      for (const handle of scene.handles ?? []) {
        const control = preset.controls.find(entry => entry.id === handle.controlId)
        expect(typeof control.valueFromPointer).toBe('function')
      }
    }
  })

  it('labels every control for a screen reader', () => {
    for (const control of preset.controls) {
      expect(control.label).toBeTruthy()
      expect(control.min).toBeLessThan(control.max)
      expect(control.step).toBeGreaterThan(0)
    }
  })
})

describe('fractionBar', () => {
  const preset = FRACTION_RATIO_PRESETS.fractionBar

  it('never shades more parts than the whole has', () => {
    const values = clampPresetValues(preset, { numerator: 12, denominator: 3 })
    expect(values.numerator).toBe(3)
  })

  it('reports the equivalent decimal and percentage', () => {
    const scene = preset.derive(clampPresetValues(preset, { numerator: 3, denominator: 4 }))
    expect(scene.status.calculation.join(' ')).toContain('0.75')
    expect(scene.status.calculation.join(' ')).toContain('75%')
  })

  it('offers the simplified form when one exists', () => {
    const scene = preset.derive(clampPresetValues(preset, { numerator: 2, denominator: 4 }))
    expect(scene.status.explanation).toContain('1/2')
  })

  it('draws one sector per part of the whole', () => {
    const scene = preset.derive(clampPresetValues(preset, { numerator: 3, denominator: 5 }))
    expect(scene.sectors).toHaveLength(5)
  })
})

describe('equivalentFractions', () => {
  const preset = FRACTION_RATIO_PRESETS.equivalentFractions

  it('keeps the shaded amount the same while the parts multiply', () => {
    const scene = preset.derive(clampPresetValues(preset, { numerator: 1, denominator: 2, multiplier: 4 }))
    const [base, equivalent] = scene.bars

    const baseFraction = base.segments[0].to / base.parts
    const equivalentFraction = equivalent.segments[0].to / equivalent.parts
    expect(equivalentFraction).toBeCloseTo(baseFraction, 10)
  })

  it('keeps both bars on the same whole', () => {
    const scene = preset.derive(clampPresetValues(preset, { numerator: 2, denominator: 3, multiplier: 3 }))
    const [base, equivalent] = scene.bars
    expect(equivalent.x).toBe(base.x)
    expect(equivalent.width).toBe(base.width)
  })

  it('holds the scaled bar to a countable number of parts', () => {
    const values = clampPresetValues(preset, { numerator: 1, denominator: 12, multiplier: 6 })
    expect(values.denominator * values.multiplier).toBeLessThanOrEqual(24)
  })
})

describe('fractionOperations', () => {
  const preset = FRACTION_RATIO_PRESETS.fractionOperations

  it('steps add and subtract through mismatch, common denominator, combine and check', () => {
    expect(presetSteps(preset, 'add').map(entry => entry.id))
      .toEqual(['mismatch', 'common', 'combine', 'check'])
  })

  it('shows both operands over a common denominator at the common step', () => {
    const values = clampPresetValues(preset, { numeratorA: 2, denominatorA: 3, numeratorB: 1, denominatorB: 4 }, { method: 'add' })
    const scene = preset.derive(values, { method: 'add', step: 'common' })
    expect(scene.bars.every(bar => bar.parts === 12)).toBe(true)
  })

  it('continues an improper sum into a second whole rather than overflowing one bar', () => {
    const values = clampPresetValues(preset, { numeratorA: 2, denominatorA: 3, numeratorB: 1, denominatorB: 2 }, { method: 'add' })
    const scene = preset.derive(values, { method: 'add', step: 'combine' })

    // 2/3 + 1/2 = 7/6 — one full whole plus one sixth.
    expect(scene.bars).toHaveLength(2)
    expect(scene.bars[0].segments[0].to).toBe(6)
    expect(scene.bars[1].segments[0].to).toBe(1)
  })

  it('never lets subtraction be driven negative', () => {
    const values = clampPresetValues(
      preset,
      { numeratorA: 1, denominatorA: 4, numeratorB: 11, denominatorB: 12 },
      { method: 'subtract' },
    )
    expect(values.numeratorB / values.denominatorB)
      .toBeLessThanOrEqual(values.numeratorA / values.denominatorA)
  })

  it('hatches only the overlapping cells of the multiply area model', () => {
    const values = clampPresetValues(preset, { numeratorA: 2, denominatorA: 3, numeratorB: 3, denominatorB: 4 }, { method: 'multiply' })
    const scene = preset.derive(values, { method: 'multiply', step: 'overlap' })
    const hatched = scene.cells.filter(cell => cell.hatch?.length)
    expect(hatched).toHaveLength(6)
    expect(scene.cells).toHaveLength(12)
  })

  it('shows the amount stepper only when taking a fraction of an amount', () => {
    const amount = preset.controls.find(control => control.id === 'amount')
    expect(controlHasStepper(amount, 'ofAmount')).toBe(true)
    expect(controlHasStepper(amount, 'add')).toBe(false)
  })

  it('counts the whole amount as counters', () => {
    const values = clampPresetValues(preset, { numeratorA: 3, denominatorA: 4, amount: 20 }, { method: 'ofAmount' })
    const scene = preset.derive(values, { method: 'ofAmount', step: 'take' })
    expect(scene.counters).toHaveLength(20)
    expect(scene.counters.filter(counter => counter.fillTone === 'shaded')).toHaveLength(15)
  })
})

describe('ratioShare', () => {
  const preset = FRACTION_RATIO_PRESETS.ratioShare

  it('divides the bar into one part per share', () => {
    const scene = preset.derive(clampPresetValues(preset, { shareA: 3, shareB: 2, total: 40 }))
    expect(scene.bars[0].parts).toBe(5)
    expect(scene.bars[0].segments).toHaveLength(2)
  })

  it('works out each share', () => {
    const scene = preset.derive(clampPresetValues(preset, { shareA: 3, shareB: 2, total: 40 }))
    expect(scene.status.heading).toBe('24 and 16')
  })

  it('names the simplified ratio when one exists', () => {
    const scene = preset.derive(clampPresetValues(preset, { shareA: 6, shareB: 4, total: 40 }))
    expect(scene.status.explanation).toContain('3 : 2')
  })
})

describe('doubleNumberLine', () => {
  const preset = FRACTION_RATIO_PRESETS.doubleNumberLine

  it('marks exactly one rung as active', () => {
    const scene = preset.derive(clampPresetValues(preset, { position: 3 }))
    expect(scene.rungs.filter(rung => rung.active)).toHaveLength(1)
  })

  it('keeps both markers on the same vertical line', () => {
    const scene = preset.derive(clampPresetValues(preset, { position: 4 }))
    const [top, bottom] = scene.markers
    expect(top.cx).toBe(bottom.cx)
  })

  it('always states the unit rate', () => {
    const scene = preset.derive(clampPresetValues(preset, { position: 5 }))
    expect(scene.status.calculation[0]).toContain('1 → ')
  })
})

describe('percentageGrid', () => {
  const preset = FRACTION_RATIO_PRESETS.percentageGrid

  it('always draws one hundred squares', () => {
    const scene = preset.derive(clampPresetValues(preset, { percent: 45 }))
    expect(scene.cells).toHaveLength(100)
  })

  it('fills one square per per cent', () => {
    const scene = preset.derive(clampPresetValues(preset, { percent: 45 }))
    expect(scene.cells.filter(cell => cell.fillTone === 'shadedSoft')).toHaveLength(45)
  })

  it('states the percentage, fraction and decimal together', () => {
    const scene = preset.derive(clampPresetValues(preset, { percent: 45 }))
    expect(scene.status.heading).toBe('45% = 45/100 = 0.45')
  })
})

describe('proportionScale', () => {
  const preset = FRACTION_RATIO_PRESETS.proportionScale

  it('scales every quantity by the same factor', () => {
    const scene = preset.derive(clampPresetValues(preset, { factor: 3 }))
    expect(scene.status.calculation).toEqual([
      'Eggs: 2 × 3 = 6',
      'Cups of flour: 3 × 3 = 9',
    ])
  })

  it('keeps the simplified ratio constant however far it is scaled', () => {
    const ratios = [1, 2, 3, 4, 5, 6].map((factor) => {
      const scene = preset.derive(clampPresetValues(preset, { factor }))
      return scene.labels.find(item => item.id === 'ratio-note').text.split('=')[1].trim()
    })
    expect(new Set(ratios).size).toBe(1)
  })
})

describe('bestValue', () => {
  const preset = FRACTION_RATIO_PRESETS.bestValue

  it('reaches the same verdict on either basis', () => {
    const perQuantity = preset.derive({}, { method: 'perQuantity' })
    const perPrice = preset.derive({}, { method: 'perPrice' })
    expect(perQuantity.status.heading).toBe(perPrice.status.heading)
  })

  it('falls back to the first method when given an unknown one', () => {
    expect(resolvePresetMethod(preset, 'nonsense')).toBe('perQuantity')
  })

  it('has no steps to walk through', () => {
    expect(resolvePresetStep(preset, 'perQuantity', null)).toBe(null)
  })
})
