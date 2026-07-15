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
  settledText: 'rgba(240,230,200,0.84)',
  secondaryText: 'rgba(240,230,200,0.68)',
  stageSurface: 'rgba(9,7,10,0.28)',
  stageBorder: 'rgba(240,230,200,0.10)',
  scrimTop: 'rgba(5,4,6,0.70)',
  scrimMiddle: 'rgba(5,4,6,0.32)',
  scrimBottom: 'rgba(5,4,6,0.84)',
  centreShade: 'rgba(5,4,6,0.28)',
  centreLine: 'rgba(240,230,200,0.08)',
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
    leftActiveTextShadow: `0 0 34px rgba(${leftRgb},0.42), 0 3px 12px rgba(0,0,0,0.96)`,
    rightActiveTextShadow: `0 0 34px rgba(${rightRgb},0.42), 0 3px 12px rgba(0,0,0,0.96)`,
    leftLandingShadow: `0 0 18px rgba(${leftRgb},0.38)`,
    rightLandingShadow: `0 0 18px rgba(${rightRgb},0.38)`,
    captionDivider: `rgba(${sharedRgb},0.24)`,
    fullScreenOverlay: [
      `linear-gradient(180deg, ${OPPOSITE_REVEAL_ROLES.scrimTop} 0%, ${OPPOSITE_REVEAL_ROLES.scrimMiddle} 38%, ${OPPOSITE_REVEAL_ROLES.scrimMiddle} 66%, ${OPPOSITE_REVEAL_ROLES.scrimBottom} 100%)`,
      `radial-gradient(circle at 8% 30%, rgba(${leftRgb},0.24) 0%, transparent 48%)`,
      `radial-gradient(circle at 92% 30%, rgba(${rightRgb},0.22) 0%, transparent 48%)`,
      `radial-gradient(circle at 50% 48%, transparent 16%, ${OPPOSITE_REVEAL_ROLES.centreShade} 74%)`,
    ].join(', '),
    stageOverlay: [
      `linear-gradient(90deg, rgba(${leftRgb},0.14) 0%, transparent 34%, transparent 66%, rgba(${rightRgb},0.13) 100%)`,
      `linear-gradient(180deg, rgba(5,4,6,0.12) 0%, rgba(5,4,6,0.02) 46%, rgba(5,4,6,0.30) 100%)`,
    ].join(', '),
    leftZoneIdle: `radial-gradient(circle at 0% 28%, rgba(${leftRgb},0.14) 0%, transparent 72%)`,
    leftZoneActive: `radial-gradient(circle at 0% 28%, rgba(${leftRgb},0.34) 0%, transparent 72%)`,
    rightZoneIdle: `radial-gradient(circle at 100% 28%, rgba(${rightRgb},0.13) 0%, transparent 72%)`,
    rightZoneActive: `radial-gradient(circle at 100% 28%, rgba(${rightRgb},0.32) 0%, transparent 72%)`,
    centreZone: `linear-gradient(90deg, transparent 0%, ${OPPOSITE_REVEAL_ROLES.centreShade} 42%, ${OPPOSITE_REVEAL_ROLES.centreShade} 58%, transparent 100%)`,
  }
}
