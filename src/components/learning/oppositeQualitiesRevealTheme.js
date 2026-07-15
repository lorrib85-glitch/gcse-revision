import { CINEMATIC_LAB } from '../../constants/cinematicLabTheme.js'

// Semantic visual pairs for guided contrast reveals.
// These are deliberately restrained cinematic tones, not generic correct/incorrect
// colours. Content selects a meaning such as `warmCool`; it never supplies a local
// red/blue UI palette.
export const OPPOSITE_REVEAL_PAIRS = Object.freeze({
  subject: Object.freeze({
    id: 'subject',
  }),
  warmCool: Object.freeze({
    id: 'warmCool',
    leftAccent: '#D69B45',
    leftRgb: '214,155,69',
    rightAccent: '#8EA9B8',
    rightRgb: '142,169,184',
  }),
  wetDry: Object.freeze({
    id: 'wetDry',
    leftAccent: '#79A7A3',
    leftRgb: '121,167,163',
    rightAccent: '#C79A5C',
    rightRgb: '199,154,92',
  }),
})

export const OPPOSITE_REVEAL_ROLES = Object.freeze({
  background: CINEMATIC_LAB.background,
  foreground: CINEMATIC_LAB.creamText,
  settledText: 'rgba(240,230,200,0.88)',
  secondaryText: 'rgba(240,230,200,0.72)',
  stageBorder: 'rgba(240,230,200,0.12)',
  scrimTop: 'rgba(5,4,6,0.68)',
  scrimMiddle: 'rgba(5,4,6,0.34)',
  scrimBottom: 'rgba(5,4,6,0.80)',
  centreShade: 'rgba(5,4,6,0.20)',
  labelShadow: '0 2px 16px rgba(0,0,0,0.88)',
  settledTextShadow: '0 2px 14px rgba(0,0,0,0.95)',
  captionShadow: '0 2px 14px rgba(0,0,0,0.96)',
})

function resolvePair(pairId) {
  return OPPOSITE_REVEAL_PAIRS[pairId] ?? OPPOSITE_REVEAL_PAIRS.subject
}

export function resolveOppositeRevealVisuals(block = {}, subjectTheme = {}) {
  const pair = resolvePair(block.visualPair)
  const sharedAccent = block.theme?.accent ?? subjectTheme.accent ?? '#D69B45'
  const sharedRgb = block.theme?.accentRgb ?? subjectTheme.accentRgb ?? '214,155,69'
  const leftAccent = block.theme?.leftAccent ?? pair.leftAccent ?? sharedAccent
  const leftRgb = block.theme?.leftRgb ?? pair.leftRgb ?? sharedRgb
  const rightAccent = block.theme?.rightAccent ?? pair.rightAccent ?? sharedAccent
  const rightRgb = block.theme?.rightRgb ?? pair.rightRgb ?? sharedRgb

  return {
    ...OPPOSITE_REVEAL_ROLES,
    pairId: pair.id,
    sharedAccent,
    sharedRgb,
    leftAccent,
    leftRgb,
    rightAccent,
    rightRgb,
    activeTextShadow: `0 0 32px rgba(${sharedRgb},0.38), 0 3px 12px rgba(0,0,0,0.96)`,
    captionDivider: `rgba(${sharedRgb},0.24)`,
    backdropOverlay: [
      `linear-gradient(180deg, ${OPPOSITE_REVEAL_ROLES.scrimTop} 0%, ${OPPOSITE_REVEAL_ROLES.scrimMiddle} 38%, ${OPPOSITE_REVEAL_ROLES.scrimMiddle} 66%, ${OPPOSITE_REVEAL_ROLES.scrimBottom} 100%)`,
      `radial-gradient(circle at 8% 26%, rgba(${leftRgb},0.22) 0%, transparent 46%)`,
      `radial-gradient(circle at 92% 26%, rgba(${rightRgb},0.20) 0%, transparent 46%)`,
      `radial-gradient(circle at 50% 46%, transparent 18%, ${OPPOSITE_REVEAL_ROLES.centreShade} 72%)`,
    ].join(', '),
  }
}
