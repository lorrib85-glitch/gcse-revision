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
 * Semantic colour roles for the CoordinatePlaneExplore family.
 *
 * Keys describe coordinate meaning rather than a palette slot:
 * - axis / gridLine: the plane itself — structure, never subject identity
 * - object / objectFill: the original point, line or shape
 * - image / imageFill: the transformed copy, or a second compared line
 * - ruleLine: the rule made visible — mirror line, centre marker, reference
 * - guideLine: dashed drop lines from an active point to both axes
 * - solution: the highlighted intersection point
 * - interaction: learner-operated handles
 *
 * Structural lines resolve through GENERAL.diagram rather than borrowing text
 * colours, so subject identity stays limited to objects, images, solutions and
 * interaction states. That separation is what makes subject="Physics" produce
 * a usable graph rather than a recoloured Maths diagram.
 */
export function createCoordinatePlaneVisualRoles(subjectTheme = SUBJECTS.Maths) {
  return Object.freeze({
    axis: GENERAL.diagram.edgePrimary,
    gridLine: hexToRgba(subjectTheme.accent, 0.1),
    tickLabel: GENERAL.cinematic.textSecondary,
    axisLabel: GENERAL.cinematic.textSecondary,
    axisTitle: GENERAL.cinematic.textSecondary,

    object: subjectTheme.accent,
    objectFill: hexToRgba(subjectTheme.accent, 0.14),
    image: subjectTheme.accentSecondary,
    imageFill: hexToRgba(subjectTheme.accentSecondary, 0.16),

    ruleLine: GENERAL.diagram.construction,
    guideLine: GENERAL.diagram.construction,
    dimensionLine: GENERAL.diagram.dimension,

    solution: subjectTheme.accent,
    interaction: subjectTheme.accent,
    focusGlow: subjectTheme.glow,

    textPrimary: GENERAL.cinematic.textPrimary,
    textSecondary: GENERAL.cinematic.textSecondary,
    textMuted: GENERAL.cinematic.textMuted,
  })
}
