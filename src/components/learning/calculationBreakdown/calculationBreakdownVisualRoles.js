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
 * Semantic colour roles for the CalculationBreakdown algebra presentations.
 *
 * The keys describe meaning, not palette slots, so a model can restate one
 * meaning (an operation becoming active, a counter joining a group) without
 * every other element shifting with it:
 *
 * - equationPrimary: the equation currently under discussion — the one thing
 *   on screen with full emphasis
 * - operationActive / operationMuted: the step being undone right now versus
 *   the steps either side of it. Never the only signal — the active step also
 *   carries a position label and aria-current
 * - groupContainer: an x container in a grouping model
 * - counter / counterGrouped: a loose unit versus one that has been shared
 *   into a group. These deliberately differ in fill AND outline so grouping is
 *   never colour-only
 * - balanceStructure / balanceValid / balanceInvalid: the beam and pans, a
 *   transformation that kept the equation true, and the deliberate one-sided
 *   misconception reveal
 * - reasoningAccent: the "why" rail that stays visible after support fades
 * - constructionLine: braces, arrows and connectors that carry no value
 * - focusGlow: the restrained active-state glow, and nothing else
 *
 * Subject identity is resolved through SUBJECTS; nothing here is a literal.
 */
export function createCalculationVisualRoles(subjectTheme = SUBJECTS.Maths) {
  const theme = subjectTheme || SUBJECTS.Maths

  return Object.freeze({
    equationPrimary: GENERAL.cinematic.textPrimary,
    equationAccent: theme.accent,
    equationMuted: GENERAL.cinematic.textMuted,

    operationActive: theme.accent,
    operationActiveSoft: hexToRgba(theme.accent, 0.16),
    operationMuted: GENERAL.cinematic.textMuted,
    operationMutedSoft: GENERAL.surfaceTint,

    groupContainer: theme.accentSecondary,
    groupContainerSoft: hexToRgba(theme.accentSecondary, 0.12),

    counter: theme.accentSecondary,
    counterSoft: hexToRgba(theme.accentSecondary, 0.18),
    counterGrouped: theme.accent,
    counterGroupedSoft: hexToRgba(theme.accent, 0.30),

    balanceStructure: GENERAL.diagram.edgeSecondary,
    balanceBeam: GENERAL.diagram.edgePrimary,
    balanceValid: theme.accent,
    balanceValidSoft: hexToRgba(theme.accent, 0.14),
    balanceInvalid: GENERAL.feedbackIncorrect,
    balanceInvalidSoft: `rgba(${GENERAL.feedbackIncorrectRgb},0.12)`,

    reasoningAccent: theme.accent,
    reasoningText: GENERAL.cinematic.textSecondary,

    constructionLine: GENERAL.diagram.construction,
    focusGlow: theme.glow,

    surface: GENERAL.surfaceTint,
    surfaceSunken: GENERAL.backgroundSunken,
    line: GENERAL.line.soft,
    lineStrong: GENERAL.line.strong,

    correct: theme.accent,
    incorrect: GENERAL.feedbackIncorrect,

    textPrimary: GENERAL.cinematic.textPrimary,
    textSecondary: GENERAL.cinematic.textSecondary,
    textMuted: GENERAL.cinematic.textMuted,
  })
}
