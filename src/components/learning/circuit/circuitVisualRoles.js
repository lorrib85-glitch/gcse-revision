import { SUBJECTS } from '../../../constants/subjects.js'

function hexToRgba(hex, alpha) {
  const value = String(hex).replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return hex

  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)
  return `rgba(${red},${green},${blue},${alpha})`
}

/**
 * Semantic colour roles for the circuit-diagram family.
 *
 * The keys describe meaning rather than a raw palette slot:
 * - interaction: focus, selection and the learner-operated switch
 * - conducting: a complete current path
 * - emittedLight: the visible light produced by a lamp
 * - structure: inactive wires and component outlines
 *
 * Keeping these meanings separate prevents the Physics accent from becoming a
 * generic "success" colour and lets future presets change one role without
 * recolouring every active element.
 */
export function createCircuitVisualRoles(subjectTheme = SUBJECTS.Physics) {
  return Object.freeze({
    interaction: subjectTheme.accent,
    interactionSoft: hexToRgba(subjectTheme.accent, 0.11),
    conducting: subjectTheme.accent,
    emittedLight: subjectTheme.accentSecondary,
    structure: subjectTheme.accentTertiary,
    surface: subjectTheme.backgroundSecondary,
    textPrimary: subjectTheme.palette.lightAsh,
    textSecondary: subjectTheme.palette.warmGrey,
    focusGlow: subjectTheme.glow,
    lampFill: subjectTheme.glowStrong,
    lampHalo: hexToRgba(subjectTheme.accentSecondary, 0.32),
  })
}

export const PHYSICS_CIRCUIT_VISUAL_ROLES = createCircuitVisualRoles()
