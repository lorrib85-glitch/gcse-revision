import { SUBJECTS } from '../../../constants/subjects.js'
import { GENERAL } from '../../../constants/generalTheme.js'

function hexToRgba(hex, alpha) {
  const value = String(hex).replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return hex

  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)
  return `rgba(${red},${green},${blue},${alpha})`
}

/**
 * Semantic colour roles for the FractionRatioExplore family.
 *
 * The keys describe part-whole meaning rather than a palette slot:
 * - whole: the outline of the whole, which never changes size or colour when
 *   the maths changes — it is the constant the learner measures against
 * - divider: the lines cutting the whole into equal parts
 * - shaded: the part being counted; shadedAlt is a second quantity being
 *   compared or combined, and overlap is where the two meet in an area model
 * - shareA/shareB/shareC: ratio shares, distinct from shaded because a ratio
 *   has no "unshaded remainder" — every part belongs to somebody
 * - ghost: a previous or unchanged state kept on screen for comparison
 * - link: the connectors that say "this is the same quantity, shown another
 *   way" — never an edge, never a division, so it must not share their colour
 * - deduced: a value the learner works out rather than reads off
 *
 * Keeping shaded and share separate stops the accent becoming a generic
 * "highlight", and lets a ratio diagram sit beside a fraction diagram without
 * either implying the other's meaning.
 */
export function createFractionRatioVisualRoles(subjectTheme = SUBJECTS.Maths) {
  return Object.freeze({
    whole: GENERAL.cinematic.textFact,
    wholeMuted: GENERAL.cinematic.textSubtle,
    divider: hexToRgba(subjectTheme.accent, 0.45),
    dividerStrong: subjectTheme.accent,

    shaded: subjectTheme.accent,
    shadedSoft: hexToRgba(subjectTheme.accent, 0.30),
    shadedAlt: subjectTheme.accentSecondary,
    shadedAltSoft: hexToRgba(subjectTheme.accentSecondary, 0.26),
    overlap: hexToRgba(subjectTheme.accent, 0.52),

    shareA: subjectTheme.accent,
    shareASoft: hexToRgba(subjectTheme.accent, 0.32),
    shareB: subjectTheme.accentSecondary,
    shareBSoft: hexToRgba(subjectTheme.accentSecondary, 0.28),
    shareC: subjectTheme.accentTertiary,
    shareCSoft: hexToRgba(subjectTheme.accentTertiary, 0.46),

    ghost: hexToRgba(subjectTheme.accent, 0.10),
    link: subjectTheme.accentSecondary,
    deduced: subjectTheme.accentSecondary,

    interaction: subjectTheme.accent,
    focusGlow: subjectTheme.glow,

    textPrimary: GENERAL.cinematic.textPrimary,
    textSecondary: GENERAL.cinematic.textSecondary,
    textMuted: GENERAL.cinematic.textMuted,
  })
}
