// Shared composition tokens for the mobile-first FactorWeb interaction.
// Keep geometry and visual intensity here so chapter content never carries
// layout values and the component does not accumulate one-off magic numbers.

export const FACTOR_WEB_LAYOUT = Object.freeze({
  canvasMaxWidth: 360,
  canvasAspectRatio: '1 / 1',

  nodeWidth: 'clamp(84px, 23vw, 96px)',
  nodeMinHeight: 54,
  nodeX: Object.freeze({ left: 14, right: 86 }),
  nodeAnchorX: Object.freeze({ left: 28, right: 72 }),

  focalSize: 108,
  focalColumnWidth: 128,
  focalCenterY: 46,
  focalLabelGap: 8,
  focalRingInset: 5,
  focalAnchorX: Object.freeze({ left: 34.5, right: 65.5 }),

  rowsByCount: Object.freeze({
    1: Object.freeze([50]),
    2: Object.freeze([31, 69]),
    3: Object.freeze([18, 50, 82]),
  }),
  focalRowsByCount: Object.freeze({
    1: Object.freeze([46]),
    2: Object.freeze([41, 51]),
    3: Object.freeze([38, 46, 54]),
  }),
  connectorControlOffset: 4,
})

export const FACTOR_WEB_VISUAL = Object.freeze({
  haloSize: 176,
  haloBlur: 24,
  haloOpacity: 0.22,
  haloCoreOpacity: 0.11,

  connectorIdleOpacity: 0.24,
  connectorExploredOpacity: 0.54,
  connectorActiveOpacity: 0.82,
  connectorIdleWidth: 0.44,
  connectorActiveWidth: 0.68,

  anchorIdleRadius: 1.0,
  anchorActiveRadius: 1.35,
  anchorGlowRadius: 7,
})
