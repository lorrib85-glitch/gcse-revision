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
 * Semantic colour roles for the NumberLineExplore family.
 *
 * The keys describe meaning rather than a palette slot:
 * - interaction: the learner-moved marker, its chip and its guide line
 * - reference: values fixed by the preset for the learner to move among
 * - band / bandEdge: a shaded interval — an inequality, a rounding gap, an
 *   error interval or an estimation range
 * - jump: directed movement along the line (addition and subtraction)
 * - included / excluded: endpoint status, the ≤ / < distinction that decides
 *   whether a bound belongs to its interval
 * - structure: the line itself, its ticks and its arrows
 *
 * Keeping these separate lets a preset recolour one meaning without touching
 * the rest, and stops the subject accent quietly becoming a "correct" colour —
 * nothing in this component marks anything.
 */
export function createNumberLineVisualRoles(subjectTheme = SUBJECTS.Maths) {
  return Object.freeze({
    interaction: subjectTheme.accent,
    interactionSoft: hexToRgba(subjectTheme.accent, 0.16),
    interactionLabel: subjectTheme.accent,

    reference: subjectTheme.accentSecondary,
    referenceLabel: subjectTheme.accentSecondary,

    // Bands carry a lot of meaning at a glance, so they are lit rather than
    // tinted — a 0.16 wash disappears against the near-black canvas.
    band: hexToRgba(subjectTheme.accent, 0.34),
    bandEdge: subjectTheme.accent,
    bandAlt: hexToRgba(subjectTheme.accentSecondary, 0.30),
    bandAltEdge: subjectTheme.accentSecondary,

    jump: subjectTheme.accent,
    jumpLabel: subjectTheme.accent,

    included: subjectTheme.accent,
    includedLabel: subjectTheme.accent,
    excluded: GENERAL.cinematic.textPrimary,
    // Punches the centre out of an excluded endpoint so it reads as hollow
    // even where a shaded band passes beneath it.
    openFill: GENERAL.neutral[900],

    structure: GENERAL.cinematic.textFact,
    structureMuted: GENERAL.cinematic.textMuted,
    structureSubtle: GENERAL.cinematic.textSubtle,

    surface: subjectTheme.backgroundSecondary,
    focusGlow: subjectTheme.glow,
    textPrimary: GENERAL.cinematic.textPrimary,
    textSecondary: GENERAL.cinematic.textSecondary,
    textMuted: GENERAL.cinematic.textMuted,
  })
}
