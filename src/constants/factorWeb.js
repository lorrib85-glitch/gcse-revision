import { MOTION } from './motion.js'

// Shared composition tokens for the mobile-first FactorWeb interaction.
// Keep geometry, visual intensity and choreography here so chapter content and
// the component do not accumulate one-off presentation values.

const FOCAL_DIAMETER = 30
const durationSeconds = duration => Number.parseInt(duration, 10) / 1000

export const FACTOR_WEB_LAYOUT = Object.freeze({
  canvasMaxWidth: 360,
  canvasAspectRatio: '1 / 1',
  canvasViewBox: '0 0 100 100',
  introMaxWidth: '36ch',
  scrollBottomClearance: 96,

  nodeWidth: 'clamp(84px, 23vw, 96px)',
  nodeMinHeight: 54,
  judgementOptionMinHeight: 52,
  exploredIndicatorSize: 5,
  nodeX: Object.freeze({ left: 14, right: 86 }),
  nodeAnchorX: Object.freeze({ left: 28, right: 72 }),

  // The visible focal circle and connector calculations share this percentage
  // geometry. At the 360px canvas maximum, 30% remains the original 108px.
  focalDiameter: FOCAL_DIAMETER,
  focalRadius: FOCAL_DIAMETER / 2,
  focalColumnWidth: 128,
  focalCenterX: 50,
  focalCenterY: 46,
  focalLabelGap: 8,
  focalRingInset: 5,

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
  // The path finishes just beneath the focal circle, preventing anti-aliased
  // seams while the visible line still appears to meet the outer edge.
  connectorUnderlap: 0.6,
})

export const FACTOR_WEB_VISUAL = Object.freeze({
  borderWidth: 1,
  activeBorderWidth: 1.5,
  linkedBorderWidth: 2,

  haloScale: 1.63,
  haloBlur: 24,
  haloOpacity: 0.22,
  haloLayerOpacity: 0.74,
  haloCoreOpacity: 0.11,
  haloCoreStop: 68,

  focalGlowBlur: 30,
  focalGlowOpacity: 0.30,
  focalOuterRingWidth: 5,
  focalOuterRingOpacity: 0.045,
  focalBorderOpacity: 0.76,
  focalRingOpacity: 0.20,
  focalPlaceholderFillOpacity: 0.055,
  focalImagePosition: 'center 22%',
  focalImageFilter: 'saturate(0.82) contrast(1.05) brightness(0.84)',

  detailBorderOpacity: 0.20,
  linkedBorderOpacity: 0.55,
  linkedLabelOpacity: 0.82,

  nodeActiveBorderOpacity: 0.82,
  nodeExploredBorderOpacity: 0.36,
  nodeActiveFillOpacity: 0.11,
  nodeExploredTextOpacity: 0.88,
  nodeActiveRingWidth: 3,
  nodeActiveRingOpacity: 0.08,
  judgementSelectedFillOpacity: 0.12,

  // Connectors should support the composition, not compete with the focal image.
  connectorIdleOpacity: 0.13,
  connectorExploredOpacity: 0.28,
  connectorActiveOpacity: 0.52,
  connectorInitialOpacity: 0.08,
  connectorIdleWidth: 0.30,
  connectorActiveWidth: 0.46,

  // Only node-side anchor dots are shown. Lines continue beneath the centre
  // ring by connectorUnderlap so every connection reads as physically joined.
  anchorIdleRadius: 0.85,
  anchorActiveRadius: 1.15,
  anchorGlowRadius: 5,
  anchorGlowOpacity: 0.48,
  exploredIndicatorGlowRadius: 8,
  exploredIndicatorGlowOpacity: 0.42,
})

export const FACTOR_WEB_MOTION = Object.freeze({
  ease: 'easeOut',
  duration: Object.freeze({
    fast: durationSeconds(MOTION.duration.fast),
    standard: durationSeconds(MOTION.duration.standard),
    slow: durationSeconds(MOTION.duration.slow),
  }),
  detailEnterY: 12,
  detailExitY: 8,
  judgementEnterY: 14,
  revealEnterY: 10,
  centreInitialScale: 0.94,
  nodeInitialScale: 0.92,
  connectorDelay: 0.16,
  connectorStagger: 0.06,
  anchorDelay: 0.30,
  nodeDelay: 0.26,
  nodeStagger: 0.07,
})
