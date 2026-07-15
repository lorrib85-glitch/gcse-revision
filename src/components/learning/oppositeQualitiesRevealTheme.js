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
})

function resolvePair(pairId) {
  return OPPOSITE_REVEAL_PAIRS[pairId] ?? OPPOSITE_REVEAL_PAIRS.subject
}

export function resolveOppositeRevealVisuals(block = {}, subjectTheme = {}) {
  const pair = resolvePair(block.visualPair)
  const sharedAccent = block.theme?.accent ?? subjectTheme.accent ?? '#D69B45'
  const sharedRgb = block.theme?.accentRgb ?? subjectTheme.accentRgb ?? '214,155,69'

  return {
    ...OPPOSITE_REVEAL_ROLES,
    pairId: pair.id,
    sharedAccent,
    sharedRgb,
    leftAccent: block.theme?.leftAccent ?? pair.leftAccent ?? sharedAccent,
    leftRgb: block.theme?.leftRgb ?? pair.leftRgb ?? sharedRgb,
    rightAccent: block.theme?.rightAccent ?? pair.rightAccent ?? sharedAccent,
    rightRgb: block.theme?.rightRgb ?? pair.rightRgb ?? sharedRgb,
  }
}
