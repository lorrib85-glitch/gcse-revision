// Presentation metadata is attached to preset configuration before the generic
// renderer consumes it. This keeps viewport/baseline decisions out of
// AreaPerimeterExplore and lets future presets opt into their own presentation
// without adding component-level branches.

const configuredPresets = new WeakMap()

const RECTANGLE_PRESENTATION = Object.freeze({
  canvas: Object.freeze({ width: 360, height: 210 }),
  sourceTop: 30,
  unit: 20,
  baseline: 162,
})

const PRESENTATION_BY_PRESET = Object.freeze({
  rectangle(values) {
    const shapeBottom = RECTANGLE_PRESENTATION.sourceTop
      + values.height * RECTANGLE_PRESENTATION.unit

    return {
      canvas: RECTANGLE_PRESENTATION.canvas,
      translateY: RECTANGLE_PRESENTATION.baseline - shapeBottom,
    }
  },
})

export function configureAreaPerimeterPresentation(presetConfig) {
  if (!presetConfig || typeof presetConfig !== 'object') return presetConfig
  if (typeof presetConfig.presentation === 'function') return presetConfig

  const resolver = PRESENTATION_BY_PRESET[presetConfig.id]
  if (!resolver) return presetConfig

  const cached = configuredPresets.get(presetConfig)
  if (cached) return cached

  const configured = Object.freeze({
    ...presetConfig,
    presentation: resolver,
  })
  configuredPresets.set(presetConfig, configured)
  return configured
}

export function resolveAreaPerimeterPresentation(presetConfig, values) {
  const resolved = typeof presetConfig.presentation === 'function'
    ? presetConfig.presentation(values)
    : null

  return {
    canvas: resolved?.canvas ?? presetConfig.canvas,
    translateY: resolved?.translateY ?? 0,
  }
}
