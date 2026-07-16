import { GENERAL } from '../../constants/generalTheme.js'

const rgba = (rgb, alpha) => `rgba(${rgb},${alpha})`

/**
 * Semantic visual roles for TimelineCanvas. The renderer asks for meaning
 * (connector, focused card, detail sheet) rather than constructing colours and
 * shadows locally.
 */
export function getTimelineCanvasTheme({ accent, accentRgb }) {
  return {
    canvasBackground: GENERAL.backgroundApp,
    titleText: GENERAL.feedbackText,
    introText: rgba('255,255,255', 0.54),
    settledText: rgba('255,255,255', 0.82),
    quietText: rgba('255,255,255', 0.34),
    metadataText: rgba('255,255,255', 0.48),

    connectorInactive: rgba(accentRgb, 0.30),
    nodeActive: accent,
    nodeRing: GENERAL.backgroundApp,
    nodeShadow: `0 0 14px ${rgba(accentRgb, 0.48)}`,

    cardSurface: GENERAL.surfaceTint,
    cardBorder: rgba(accentRgb, 0.18),
    cardBorderFocused: rgba(accentRgb, 0.46),
    cardBorderSelected: rgba(accentRgb, 0.62),
    cardShadow: GENERAL.shadow.raised,
    cardShadowFocused: `0 18px 42px rgba(0,0,0,0.58), 0 0 18px ${rgba(accentRgb, 0.10)}`,
    cardShadowSelected: `0 22px 54px rgba(0,0,0,0.64), 0 0 24px ${rgba(accentRgb, 0.15)}`,

    mediaBackground: GENERAL.backgroundSunken,
    mediaFallback: `radial-gradient(circle at 50% 42%, ${rgba(accentRgb, 0.18)}, transparent 58%), linear-gradient(145deg, ${GENERAL.backgroundPanel}, ${GENERAL.backgroundSunken})`,
    mediaScrim: `linear-gradient(180deg, ${rgba(accentRgb, 0.14)} 0%, rgba(8,9,13,0) 42%, rgba(8,9,13,0.88) 100%)`,
    mediaTitle: rgba('255,255,255', 0.97),
    mediaTitleShadow: '0 3px 10px rgba(0,0,0,0.60)',
    metadataSurface: rgba('255,255,255', 0.025),
    metadataDivider: GENERAL.line.faint,

    controlBorder: rgba(accentRgb, 0.52),
    controlRest: rgba(accentRgb, 0.15),
    controlActive: accent,
    controlText: accent,
    controlTextActive: GENERAL.textOnAccent,
    controlShadow: GENERAL.shadow.raised,
    controlGlow: rgba(accentRgb, 0.44),

    detailSurface: `linear-gradient(180deg, ${rgba(accentRgb, 0.13)}, ${GENERAL.backgroundSurface})`,
    detailBorder: rgba(accentRgb, 0.28),
    detailShadow: '0 -18px 42px rgba(0,0,0,0.48)',
    detailEyebrow: accent,

    swipeHint: accent,
    swipeHintShadow: '0 2px 12px rgba(0,0,0,0.78)',
  }
}
