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
 * Semantic colour roles for the AngleExplore family.
 *
 * The keys describe meaning rather than a raw palette slot:
 * - interaction: the learner-operated ray and its drag handle
 * - sectorA/B/C: distinct angle sectors within one diagram — equal angles
 *   share a sector role so "these are equal" reads as colour before words
 * - sectorALabel/BLabel/CLabel: contrast-safe text paired with each sector
 * - structure: fixed rays, shape edges and the baseline
 *
 * Keeping these meanings separate lets a preset recolour one role (for
 * example a highlighted sector) without touching every other element, and
 * stops the subject accent becoming a generic "correct" colour.
 */
export function createAngleVisualRoles(subjectTheme = SUBJECTS.Maths) {
  return Object.freeze({
    interaction: subjectTheme.accent,
    interactionSoft: hexToRgba(subjectTheme.accent, 0.14),
    sectorA: subjectTheme.accent,
    sectorASoft: hexToRgba(subjectTheme.accent, 0.16),
    sectorALabel: subjectTheme.accent,
    sectorB: subjectTheme.accentSecondary,
    sectorBSoft: hexToRgba(subjectTheme.accentSecondary, 0.14),
    sectorBLabel: subjectTheme.accentSecondary,
    sectorC: subjectTheme.accentTertiary,
    sectorCSoft: hexToRgba(subjectTheme.accentTertiary, 0.22),
    sectorCLabel: GENERAL.cinematic.textPrimary,
    structure: GENERAL.cinematic.textFact,
    structureMuted: GENERAL.cinematic.textMuted,
    surface: subjectTheme.backgroundSecondary,
    focusGlow: subjectTheme.glow,
    textPrimary: GENERAL.cinematic.textPrimary,
    textSecondary: GENERAL.cinematic.textSecondary,
  })
}
