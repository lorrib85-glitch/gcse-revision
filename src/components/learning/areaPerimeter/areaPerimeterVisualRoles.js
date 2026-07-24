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
 * Semantic colour roles for the AreaPerimeterExplore family.
 *
 * The keys describe mensuration meaning rather than a palette slot:
 * - boundary: the outside edge being traced — the star of perimeter thinking
 * - boundaryMuted: shape edges when the interior (area) is the star instead
 * - areaFill / areaFillSecondary: restrained translucent fills for the space
 *   inside a shape and for a second decomposition piece or duplicated copy
 * - constructionLine: dashed internal helper lines (splits, perpendicular
 *   heights, completed rectangles) — never part of the perimeter
 * - dimensionLine / dimensionLabel: measurement furniture beside each side
 * - deducedLabel: a dimension the learner works out rather than reads off
 * - gridLine: the unit-square grid that makes square units countable
 * - interaction: the learner-operated handles
 *
 * Keeping boundary and interior as separate roles lets perimeter focus and
 * area focus brighten only their own subject matter — never both at once.
 */
export function createAreaPerimeterVisualRoles(subjectTheme = SUBJECTS.Maths) {
  return Object.freeze({
    boundary: subjectTheme.accent,
    boundaryMuted: GENERAL.cinematic.textFact,
    areaFill: hexToRgba(subjectTheme.accent, 0.14),
    areaFillSecondary: hexToRgba(subjectTheme.accentSecondary, 0.16),
    constructionLine: GENERAL.cinematic.textMuted,
    dimensionLine: GENERAL.cinematic.textFact,
    dimensionLabel: GENERAL.cinematic.textPrimary,
    deducedLabel: subjectTheme.accentSecondary,
    gridLine: hexToRgba(subjectTheme.accent, 0.1),
    interaction: subjectTheme.accent,
    focusGlow: subjectTheme.glow,
    textPrimary: GENERAL.cinematic.textPrimary,
    textSecondary: GENERAL.cinematic.textSecondary,
    textMuted: GENERAL.cinematic.textMuted,
  })
}
