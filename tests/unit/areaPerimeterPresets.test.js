import { describe, expect, it } from 'vitest'
import { polygonArea, polygonPerimeter } from '../../src/components/learning/geometry/shapeGeometry.js'
import {
  AREA_PERIMETER_PRESETS,
  clampPresetValues,
  resolveAreaPerimeterPreset,
  resolvePresetFocus,
} from '../../src/components/learning/areaPerimeter/areaPerimeterPresets.js'

// Every reachable combination of a preset's controls, focus modes,
// decomposition methods and reveal state.
function everyState(preset) {
  const combos = preset.controls.reduce((acc, control) => {
    const values = []
    for (let v = control.min; v <= control.max; v += control.step) values.push(v)
    return acc.flatMap(partial => values.map(v => ({ ...partial, [control.id]: v })))
  }, [{}])

  const methods = (preset.methods ?? [{ id: null }]).map(option => option.id)
  const reveals = preset.reveal ? [false, true] : [false]

  return combos.flatMap(values => preset.focusModes.flatMap(focus => (
    methods.flatMap(method => reveals.map(revealed => ({
      values: clampPresetValues(preset, values),
      scene: preset.derive(clampPresetValues(preset, values), { focus, method, revealed }),
      focus,
      method,
      revealed,
    })))
  )))
}

function sceneFor(presetName, values, options = {}) {
  const preset = resolveAreaPerimeterPreset(presetName)
  return preset.derive(clampPresetValues(preset, values), {
    focus: options.focus ?? preset.defaultFocus,
    method: options.method ?? preset.methods?.[0]?.id ?? null,
    revealed: options.revealed ?? false,
  })
}

describe('preset resolution', () => {
  it('resolves every registered preset by name', () => {
    for (const name of Object.keys(AREA_PERIMETER_PRESETS)) {
      expect(resolveAreaPerimeterPreset(name).id).toBe(name)
    }
  })

  it('rejects an unknown preset name rather than rendering nothing', () => {
    expect(() => resolveAreaPerimeterPreset('circleArea')).toThrow(/Unknown AreaPerimeterExplore preset/)
  })

  it('clamps and steps control values into range', () => {
    const rectangle = resolveAreaPerimeterPreset('rectangle')
    expect(clampPresetValues(rectangle, { width: 99, height: 0 })).toEqual({ width: 12, height: 3 })
  })

  it('falls back to the preset default when an unsupported focus is requested', () => {
    const triangle = resolveAreaPerimeterPreset('triangleArea')
    expect(resolvePresetFocus(triangle, 'perimeter')).toBe('area')
    expect(resolvePresetFocus(AREA_PERIMETER_PRESETS.rectangle, 'perimeter')).toBe('perimeter')
  })
})

describe('rectangle preset', () => {
  it('builds the perimeter by tracing all four sides, then the efficient form', () => {
    const scene = sceneFor('rectangle', { width: 6, height: 4 }, { focus: 'perimeter' })

    expect(scene.status.heading).toBe('Perimeter = 20 cm')
    expect(scene.status.calculation[0]).toBe('6 + 4 + 6 + 4 = 20 cm')
    expect(scene.status.calculation[1]).toBe('2 × (6 + 4) = 20 cm')
  })

  it('labels every side in perimeter focus and only the two dimensions in area focus', () => {
    const perimeter = sceneFor('rectangle', { width: 6, height: 4 }, { focus: 'perimeter' })
    const area = sceneFor('rectangle', { width: 6, height: 4 }, { focus: 'area' })

    expect(perimeter.labels).toHaveLength(4)
    expect(area.labels).toHaveLength(2)
  })

  it('reaches the multiplication through rows and columns first', () => {
    const scene = sceneFor('rectangle', { width: 6, height: 4 }, { focus: 'area' })

    expect(scene.status.heading).toBe('Area = 24 cm²')
    expect(scene.status.calculation[0]).toBe('4 rows × 6 columns = 24 cm²')
    expect(scene.status.calculation[1]).toContain('6 × 4 = 24 cm²')
  })

  it('shows a unit-square grid when the count stays countable', () => {
    const grid = sceneFor('rectangle', { width: 6, height: 4 }, { focus: 'area' })
      .shapes.filter(shape => shape.strokeRole === 'gridLine')

    // 5 internal verticals + 3 internal horizontals
    expect(grid).toHaveLength(8)
  })

  it('drops the grid rather than crowding it once the area grows large', () => {
    const grid = sceneFor('rectangle', { width: 12, height: 7 }, { focus: 'area' })
      .shapes.filter(shape => shape.strokeRole === 'gridLine')

    expect(grid).toHaveLength(0)
  })

  it('marks equal sides and names the square only in the square state', () => {
    const square = sceneFor('rectangle', { width: 5, height: 5 }, { focus: 'area' })
    const oblong = sceneFor('rectangle', { width: 6, height: 5 }, { focus: 'area' })

    expect(square.shapes.filter(shape => shape.id.includes('equal'))).toHaveLength(4)
    expect(square.status.calculation[1]).toBe('Area = side × side = 5² = 25 cm²')
    expect(oblong.shapes.filter(shape => shape.id.includes('equal'))).toHaveLength(0)
  })

  it('keeps the boundary muted when the interior is the subject, and lit when it is not', () => {
    expect(sceneFor('rectangle', { width: 6, height: 4 }, { focus: 'area' })
      .shapes[0].strokeRole).toBe('boundaryMuted')
    expect(sceneFor('rectangle', { width: 6, height: 4 }, { focus: 'perimeter' })
      .shapes[0].strokeRole).toBe('boundary')
  })

  it('shows area and perimeter changing differently in compare focus', () => {
    const before = sceneFor('rectangle', { width: 6, height: 4 }, { focus: 'compare' })
    const after = sceneFor('rectangle', { width: 7, height: 4 }, { focus: 'compare' })

    expect(before.status.heading).toBe('Perimeter 20 cm — area 24 cm²')
    expect(after.status.heading).toBe('Perimeter 22 cm — area 28 cm²')
  })

  it('never labels a length in square units or an area in linear units', () => {
    for (const { scene } of everyState(AREA_PERIMETER_PRESETS.rectangle)) {
      for (const label of scene.labels) {
        expect(label.text).toMatch(/^\d+ cm$/)
      }
      const heading = scene.status.heading
      if (heading.startsWith('Perimeter =')) expect(heading).not.toContain('²')
      if (heading.startsWith('Area =')) expect(heading).toContain('cm²')
    }
  })
})

describe('fixed-perimeter rectangle preset', () => {
  const widths = [1, 2, 4, 6, 8, 11]

  it('holds the perimeter at 24 cm for every width', () => {
    for (const width of widths) {
      const scene = sceneFor('fixedPerimeterRectangle', { width })
      expect(scene.status.calculation[0]).toContain('= 24 cm')
    }
  })

  it('changes the height as the width changes', () => {
    expect(sceneFor('fixedPerimeterRectangle', { width: 1 }).status.calculation[1]).toBe('Area: 1 × 11 = 11 cm²')
    expect(sceneFor('fixedPerimeterRectangle', { width: 2 }).status.calculation[1]).toBe('Area: 2 × 10 = 20 cm²')
    expect(sceneFor('fixedPerimeterRectangle', { width: 4 }).status.calculation[1]).toBe('Area: 4 × 8 = 32 cm²')
  })

  it('gives the square the greatest area of every whole-number state', () => {
    const areas = widths.map(width => ({
      width,
      area: Number(sceneFor('fixedPerimeterRectangle', { width }).status.heading.match(/\d+/)[0]),
    }))
    const best = areas.reduce((max, entry) => (entry.area > max.area ? entry : max))

    expect(best).toEqual({ width: 6, area: 36 })
  })

  it('explains the maximum only at the square', () => {
    expect(sceneFor('fixedPerimeterRectangle', { width: 6 }).status.explanation)
      .toBe('With this fixed perimeter, the square encloses the greatest area.')
    expect(sceneFor('fixedPerimeterRectangle', { width: 4 }).status.explanation)
      .not.toContain('greatest area')
  })
})

describe('triangle area preset', () => {
  it('keeps the area unchanged as the apex slides with the height fixed', () => {
    const headings = [1, 4, 8, 11].map(apex => (
      sceneFor('triangleArea', { apex, height: 4 }).status.heading
    ))

    expect(new Set(headings)).toEqual(new Set(['Area = 16 cm²']))
  })

  it('changes the area when the perpendicular height changes', () => {
    expect(sceneFor('triangleArea', { apex: 5, height: 2 }).status.heading).toBe('Area = 8 cm²')
    expect(sceneFor('triangleArea', { apex: 5, height: 6 }).status.heading).toBe('Area = 24 cm²')
  })

  it('always draws the dashed perpendicular height and its right-angle marker', () => {
    for (const { scene } of everyState(AREA_PERIMETER_PRESETS.triangleArea)) {
      const height = scene.shapes.find(shape => shape.id === 'triangle-height')
      const marker = scene.shapes.find(shape => shape.id === 'triangle-right-angle')

      expect(height.dashed).toBe(true)
      expect(height.strokeRole).toBe('constructionLine')
      expect(marker).toBeDefined()
    }
  })

  it('names the sloping side separately from the height', () => {
    const scene = sceneFor('triangleArea', { apex: 5, height: 4 })

    expect(scene.labels.find(label => label.id === 'slope-note').text).toBe('sloping side')
    expect(scene.status.explanation).toContain('A sloping side is not the height.')
  })

  it('extends the base only when the perpendicular foot falls outside it', () => {
    const inside = sceneFor('triangleArea', { apex: 4, height: 4 })
    const outside = sceneFor('triangleArea', { apex: 11, height: 4 })

    expect(inside.shapes.find(shape => shape.id === 'triangle-base-extension')).toBeUndefined()
    expect(outside.shapes.find(shape => shape.id === 'triangle-base-extension')).toBeDefined()
  })

  it('pairs a second triangle into a parallelogram of twice the area before revealing the formula', () => {
    const scene = sceneFor('triangleArea', { apex: 5, height: 4 }, { revealed: true })

    expect(scene.shapes.find(shape => shape.id === 'triangle-duplicate')).toBeDefined()
    expect(scene.status.calculation[0]).toContain('8 × 4 = 32 cm²')
    expect(scene.status.heading).toBe('Area = ½ × 8 × 4 = 16 cm²')
    expect(scene.status.explanation).toBe('Area = ½ × base × perpendicular height.')
  })

  it('withholds the formula until the reveal is triggered', () => {
    const scene = sceneFor('triangleArea', { apex: 5, height: 4 })
    expect(scene.status.explanation).not.toContain('½ × base')
  })
})

describe('parallelogram area preset', () => {
  it('keeps the area unchanged when only the slant changes', () => {
    const headings = [0, 1, 3, 5].map(slant => (
      sceneFor('parallelogramArea', { slant }).status.heading
    ))

    expect(new Set(headings)).toEqual(new Set(['Area = 28 cm²']))
  })

  it('keeps the height label on the perpendicular, never on the slant', () => {
    for (const { values, scene } of everyState(AREA_PERIMETER_PRESETS.parallelogramArea)) {
      const label = scene.labels.find(item => item.id === 'dim-height')
      const perpendicular = scene.shapes.find(shape => shape.id === 'parallelogram-height')
      const [, lineX] = perpendicular.path.match(/M ([\d.]+) /)

      // The height always reads 4 cm, and its label sits beside the dashed
      // perpendicular rather than anywhere near a sloping edge.
      expect(label.text, JSON.stringify(values)).toBe('4 cm')
      expect(Math.abs(label.x - Number(lineX)), JSON.stringify(values)).toBeLessThanOrEqual(24)
    }
  })

  it('builds an equivalent rectangle from the cut piece only once triggered', () => {
    const resting = sceneFor('parallelogramArea', { slant: 2 })
    const revealed = sceneFor('parallelogramArea', { slant: 2 }, { revealed: true })

    expect(resting.shapes.find(shape => shape.id === 'parallelogram-rectangle')).toBeUndefined()
    expect(revealed.shapes.find(shape => shape.id === 'parallelogram-rectangle')).toBeDefined()
    expect(revealed.shapes.find(shape => shape.id === 'parallelogram-moved-piece')).toBeDefined()
    expect(revealed.status.heading).toBe('Area = 7 × 4 = 28 cm²')
    expect(revealed.status.explanation).toContain('Area = base × perpendicular height')
  })

  it('does not invent a cut when there is no slant to remove', () => {
    const revealed = sceneFor('parallelogramArea', { slant: 0 }, { revealed: true })

    expect(revealed.shapes.find(shape => shape.id === 'parallelogram-moved-piece')).toBeUndefined()
    expect(revealed.status.calculation[0]).toContain('already a 7 × 4 rectangle')
  })
})

describe('trapezium area preset', () => {
  it('updates the area as either parallel side or the height changes', () => {
    expect(sceneFor('trapeziumArea', { top: 3, bottom: 7, height: 4 }).status.heading).toBe('Area = 20 cm²')
    expect(sceneFor('trapeziumArea', { top: 5, bottom: 7, height: 4 }).status.heading).toBe('Area = 24 cm²')
    expect(sceneFor('trapeziumArea', { top: 3, bottom: 9, height: 4 }).status.heading).toBe('Area = 24 cm²')
    expect(sceneFor('trapeziumArea', { top: 3, bottom: 7, height: 6 }).status.heading).toBe('Area = 30 cm²')
  })

  it('handles the half-unit case without floating-point noise', () => {
    const scene = sceneFor('trapeziumArea', { top: 2, bottom: 5, height: 3 })
    expect(scene.status.heading).toBe('Area = 10.5 cm²')
  })

  it('keeps the parallel-side markings visible in every state', () => {
    for (const { scene } of everyState(AREA_PERIMETER_PRESETS.trapeziumArea)) {
      expect(scene.shapes.find(shape => shape.id === 'trapezium-parallel-top')).toBeDefined()
      expect(scene.shapes.find(shape => shape.id === 'trapezium-parallel-bottom')).toBeDefined()
    }
  })

  it('states a mathematically accurate duplicate-and-rotate explanation', () => {
    const scene = sceneFor('trapeziumArea', { top: 3, bottom: 7, height: 4 }, { revealed: true })

    expect(scene.shapes.find(shape => shape.id === 'trapezium-duplicate')).toBeDefined()
    expect(scene.status.calculation[0]).toContain('base 3 + 7 = 10 cm')
    expect(scene.status.calculation[1]).toContain('40 cm²')
    expect(scene.status.heading).toBe('Area = ½ × (3 + 7) × 4 = 20 cm²')
  })

  it('keeps the parallelogram exactly twice the trapezium for every state', () => {
    for (const { values, scene, revealed } of everyState(AREA_PERIMETER_PRESETS.trapeziumArea)) {
      if (!revealed) continue
      const doubled = (values.top + values.bottom) * values.height
      expect(scene.status.calculation[1]).toContain(`${doubled} cm²`)
    }
  })
})

describe('composite shape preset', () => {
  it('reaches the same area by both splits and by subtraction', () => {
    for (const method of ['split-vertical', 'split-horizontal', 'subtract']) {
      const scene = sceneFor('compositeShape', {}, { focus: 'area', method })
      expect(scene.status.heading).toBe('Area = 36 cm²')
    }
  })

  it('shows each decomposition piece adding up to the total', () => {
    const vertical = sceneFor('compositeShape', {}, { focus: 'area', method: 'split-vertical' })
    const horizontal = sceneFor('compositeShape', {}, { focus: 'area', method: 'split-horizontal' })
    const subtract = sceneFor('compositeShape', {}, { focus: 'area', method: 'subtract' })

    expect(vertical.status.calculation[1]).toBe('24 cm² + 12 cm² = 36 cm²')
    expect(horizontal.status.calculation[1]).toBe('28 cm² + 8 cm² = 36 cm²')
    expect(subtract.status.calculation[1]).toBe('42 cm² − 6 cm² = 36 cm²')
  })

  it('traces only the six outside edges for the perimeter', () => {
    const scene = sceneFor('compositeShape', {}, { focus: 'perimeter' })

    expect(scene.status.heading).toBe('Perimeter = 26 cm')
    expect(scene.status.calculation[0]).toBe('7 + 4 + 3 + 2 + 4 + 6 = 26 cm')
  })

  it('deduces the two unlabelled outer lengths', () => {
    const scene = sceneFor('compositeShape', {}, { focus: 'perimeter' })
    const deduced = scene.labels.filter(label => label.role === 'deducedLabel')

    expect(deduced.map(label => label.text)).toEqual(['3 cm', '2 cm'])
    expect(scene.status.calculation[1]).toBe('Missing lengths: 3 = 7 − 4 and 2 = 6 − 4')
  })

  it('excludes the internal split line from the perimeter and says why', () => {
    const scene = sceneFor('compositeShape', {}, { focus: 'perimeter' })
    const internal = scene.shapes.find(shape => shape.id === 'composite-old-split')

    expect(internal.strokeRole).toBe('constructionLine')
    expect(internal.dashed).toBe(true)
    expect(scene.status.explanation).toBe(
      'This line helped us calculate the area, but it is inside the shape, so it is not part of the perimeter.',
    )
  })

  it('derives its totals from the shape rather than stating a worked answer', () => {
    // The L-shape's own boundary and interior — computed independently of the
    // preset — must be what the status reports.
    const lShape = [
      { x: 0, y: 0 }, { x: 7, y: 0 }, { x: 7, y: 4 },
      { x: 4, y: 4 }, { x: 4, y: 6 }, { x: 0, y: 6 },
    ]

    expect(sceneFor('compositeShape', {}, { focus: 'area' }).status.heading)
      .toBe(`Area = ${polygonArea(lShape)} cm²`)
    expect(sceneFor('compositeShape', {}, { focus: 'perimeter' }).status.heading)
      .toBe(`Perimeter = ${polygonPerimeter(lShape)} cm`)
  })

  it('keeps every decomposition consistent with the shape it decomposes', () => {
    const total = polygonArea([
      { x: 0, y: 0 }, { x: 7, y: 0 }, { x: 7, y: 4 },
      { x: 4, y: 4 }, { x: 4, y: 6 }, { x: 0, y: 6 },
    ])

    for (const method of ['split-vertical', 'split-horizontal', 'subtract']) {
      const line = sceneFor('compositeShape', {}, { focus: 'area', method }).status.calculation[1]
      const [a, b, result] = line.match(/\d+/g).map(Number)

      expect(result).toBe(total)
      expect(line.includes('−') ? a - b : a + b).toBe(total)
    }
  })

  it('places each perimeter label beside its own side, without collisions', () => {
    const labels = sceneFor('compositeShape', {}, { focus: 'perimeter' }).labels

    expect(labels).toHaveLength(6)
    for (let i = 0; i < labels.length; i += 1) {
      for (let j = i + 1; j < labels.length; j += 1) {
        const clashes = Math.abs(labels[i].x - labels[j].x) < 32
          && Math.abs(labels[i].y - labels[j].y) < 15
        expect(clashes, `${labels[i].id} overlaps ${labels[j].id}`).toBe(false)
      }
    }
  })

  it('offers the decomposition choice only where decomposition is the job', () => {
    expect(AREA_PERIMETER_PRESETS.compositeShape.methodsFocus).toBe('area')
    expect(AREA_PERIMETER_PRESETS.compositeShape.methods).toHaveLength(3)
  })
})

describe('every preset', () => {
  it('declares the contract the renderer relies on', () => {
    for (const [name, preset] of Object.entries(AREA_PERIMETER_PRESETS)) {
      expect(preset.id, name).toBe(name)
      expect(preset.accessibilityLabel, name).toBeTruthy()
      expect(preset.keyFact, name).toBeTruthy()
      expect(preset.canvas.width, name).toBeGreaterThan(0)
      expect(preset.focusModes, name).toContain(preset.defaultFocus)

      for (const control of preset.controls) {
        expect(control.label, `${name}.${control.id}`).toBeTruthy()
        expect(control.min, `${name}.${control.id}`).toBeLessThan(control.max)
        expect(typeof control.valueFromPointer, `${name}.${control.id}`).toBe('function')
        expect(typeof control.valueText, `${name}.${control.id}`).toBe('function')
      }
    }
  })

  it('returns a complete, non-shifting status block in every reachable state', () => {
    for (const [name, preset] of Object.entries(AREA_PERIMETER_PRESETS)) {
      for (const { scene, values } of everyState(preset)) {
        const where = `${name} ${JSON.stringify(values)}`
        expect(scene.status.heading, where).toBeTruthy()
        expect(scene.status.calculation.length, where).toBeGreaterThan(0)
        expect(scene.status.calculation.length, where).toBeLessThanOrEqual(2)
        expect(scene.status.explanation, where).toBeTruthy()
      }
    }
  })

  it('keeps every handle inside the canvas and a full touch target apart', () => {
    for (const [name, preset] of Object.entries(AREA_PERIMETER_PRESETS)) {
      for (const { scene, values } of everyState(preset)) {
        const where = `${name} ${JSON.stringify(values)}`
        for (const handle of scene.handles) {
          expect(handle.x, where).toBeGreaterThanOrEqual(22)
          expect(handle.x, where).toBeLessThanOrEqual(preset.canvas.width - 22)
          expect(handle.y, where).toBeGreaterThanOrEqual(22)
          expect(handle.y, where).toBeLessThanOrEqual(preset.canvas.height - 22)
        }
        for (let i = 0; i < scene.handles.length; i += 1) {
          for (let j = i + 1; j < scene.handles.length; j += 1) {
            const gap = Math.hypot(
              scene.handles[i].x - scene.handles[j].x,
              scene.handles[i].y - scene.handles[j].y,
            )
            expect(gap, `${where} ${scene.handles[i].controlId}/${scene.handles[j].controlId}`)
              .toBeGreaterThanOrEqual(44)
          }
        }
      }
    }
  })

  it('keeps dimension labels clear of the handles sitting on the same edge', () => {
    // A label hidden under a drag handle is unreadable exactly when the
    // learner is changing the value it reports.
    for (const [name, preset] of Object.entries(AREA_PERIMETER_PRESETS)) {
      for (const { scene, values } of everyState(preset)) {
        for (const label of scene.labels) {
          for (const handle of scene.handles) {
            const clear = Math.abs(label.x - handle.x) >= 26 || Math.abs(label.y - handle.y) >= 20
            expect(clear, `${name} ${JSON.stringify(values)}: ${label.id} sits under ${handle.controlId}`)
              .toBe(true)
          }
        }
      }
    }
  })

  it('keeps dimension labels off the shape edges they are not measuring', () => {
    // Guards the collision that put a height label across a sloping side.
    for (const [name, preset] of Object.entries(AREA_PERIMETER_PRESETS)) {
      for (const { scene, values } of everyState(preset)) {
        for (let i = 0; i < scene.labels.length; i += 1) {
          for (let j = i + 1; j < scene.labels.length; j += 1) {
            const a = scene.labels[i]
            const b = scene.labels[j]
            const clear = Math.abs(a.x - b.x) >= 34 || Math.abs(a.y - b.y) >= 16
            expect(clear, `${name} ${JSON.stringify(values)}: ${a.id} overlaps ${b.id}`).toBe(true)
          }
        }
      }
    }
  })

  it('gives every handle a control that exists', () => {
    for (const preset of Object.values(AREA_PERIMETER_PRESETS)) {
      const controlIds = new Set(preset.controls.map(control => control.id))
      for (const { scene } of everyState(preset)) {
        for (const handle of scene.handles) {
          expect(controlIds.has(handle.controlId)).toBe(true)
        }
      }
    }
  })

  it('never states a mensuration result without its unit', () => {
    for (const [name, preset] of Object.entries(AREA_PERIMETER_PRESETS)) {
      for (const { scene, values } of everyState(preset)) {
        const where = `${name} ${JSON.stringify(values)}`
        expect(scene.status.heading, where).toMatch(/cm/)
      }
    }
  })

  it('leaves scoring, marking and progression to the composing page', () => {
    for (const [name, preset] of Object.entries(AREA_PERIMETER_PRESETS)) {
      for (const { scene, values } of everyState(preset)) {
        const where = `${name} ${JSON.stringify(values)}`

        // The status block carries a result, its working and one conceptual
        // sentence — no verdict, mark or progression field can ride along.
        expect(Object.keys(scene.status).sort(), where)
          .toEqual(['calculation', 'explanation', 'heading'])

        const prose = [scene.status.heading, ...scene.status.calculation, scene.status.explanation].join(' ')
        expect(prose, where).not.toMatch(/well done|try again|you got|score|points|marks?\b|continue/i)
      }
    }
  })
})
