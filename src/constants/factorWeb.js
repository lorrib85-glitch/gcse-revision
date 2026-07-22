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

  // The centre remains the focal point, but the atmosphere should sit behind
  // the content rather than reading as a second illuminated object.
  haloScale: 1.56,
  haloBlur: 24,
  haloOpacity: 0.15,
  haloLayerOpacity: 0.56,
  haloCoreOpacity: 0.07,
  haloCoreStop: 68,

  focalGlowBlur: 26,
  focalGlowOpacity: 0.18,
  focalOuterRingWidth: 4,
  focalOuterRingOpacity: 0.03,
  focalBorderOpacity: 0.60,
  focalRingOpacity: 0.14,
  focalPlaceholderFillOpacity: 0.045,
  focalImagePosition: 'center 22%',
  focalImageFilter: 'saturate(0.82) contrast(1.05) brightness(0.84)',

  detailBorderOpacity: 0.20,
  linkedBorderOpacity: 0.55,
  linkedLabelOpacity: 0.82,

  // Selected factors remain clear through contrast and line weight, not glow.
  nodeActiveBorderOpacity: 0.58,
  nodeExploredBorderOpacity: 0.26,
  nodeActiveFillOpacity: 0.07,
  nodeExploredTextOpacity: 0.76,
  nodeActiveRingWidth: 2,
  nodeActiveRingOpacity: 0.035,
  judgementSelectedFillOpacity: 0.09,

  // Connectors should support the composition, not compete with the focal image.
  connectorIdleOpacity: 0.10,
  connectorExploredOpacity: 0.21,
  connectorActiveOpacity: 0.40,
  connectorInitialOpacity: 0.06,
  connectorIdleWidth: 0.30,
  connectorActiveWidth: 0.43,

  // Only node-side anchor dots are shown. Lines continue beneath the centre
  // ring by connectorUnderlap so every connection reads as physically joined.
  anchorIdleRadius: 0.78,
  anchorActiveRadius: 1.00,
  anchorGlowRadius: 4,
  anchorGlowOpacity: 0.25,
  exploredIndicatorGlowRadius: 6,
  exploredIndicatorGlowOpacity: 0.20,
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
