// ─── Subject Theme System — Locked Foundation Layer ────────────────────────
//
// Permanent emotional worlds for every subject.
// Defines atmosphere, emotional tone, cinematic treatment, glow behaviour,
// overlays, backgrounds, and UI mood.
//
// Single source of truth for all subject-aware components.
// Do NOT duplicate colours or create local palette maps.

export const SUBJECTS = {
  Maths: {
    accent: '#2CBFA3',
    accentSecondary: '#72E6CF',
    accentTertiary: '#1E8F7A',

    background: '#071917',
    backgroundSecondary: '#0B2220',

    glow: 'rgba(44,191,163,0.35)',
    glowStrong: 'rgba(114,230,207,0.22)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#2CBFA3',

    accentRgb: '44,191,163',
  },

  English: {
    accent: '#7A284F',
    accentSecondary: '#A14A73',
    accentTertiary: '#4A102C',

    background: '#12070D',
    backgroundSecondary: '#1A0C14',

    glow: 'rgba(161,74,115,0.34)',
    glowStrong: 'rgba(122,40,79,0.22)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#A14A73',

    accentRgb: '161,74,115',
  },

  Physics: {
    accent: '#3DA5FF',
    accentSecondary: '#74C7FF',
    accentTertiary: '#1C5D91',

    background: '#06111C',
    backgroundSecondary: '#0A1726',

    glow: 'rgba(61,165,255,0.34)',
    glowStrong: 'rgba(116,199,255,0.22)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#3DA5FF',

    accentRgb: '61,165,255',
  },

  Biology: {
    accent: '#4FA36C',
    accentSecondary: '#7BD89A',
    accentTertiary: '#2E6844',

    background: '#08130C',
    backgroundSecondary: '#102017',

    glow: 'rgba(79,163,108,0.34)',
    glowStrong: 'rgba(123,216,154,0.20)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#4FA36C',

    accentRgb: '79,163,108',
  },

  Chemistry: {
    accent: '#8B4DFF',
    accentSecondary: '#B07CFF',
    accentTertiary: '#44208A',

    background: '#0B0717',
    backgroundSecondary: '#120D22',

    glow: 'rgba(139,77,255,0.34)',
    glowStrong: 'rgba(176,124,255,0.22)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#8B4DFF',

    accentRgb: '139,77,255',
  },

  History: {
    accent: '#D69B45',
    accentSecondary: '#E2B56D',
    accentTertiary: '#8A5A1F',

    background: '#0F0B07',
    backgroundSecondary: '#17110B',

    glow: 'rgba(214,155,69,0.34)',
    glowStrong: 'rgba(226,181,109,0.22)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#D69B45',

    accentRgb: '214,155,69',
  },

  Sociology: {
    accent: '#B8A58F',
    accentSecondary: '#D2C4B3',
    accentTertiary: '#756858',

    background: '#11100E',
    backgroundSecondary: '#191715',

    glow: 'rgba(184,165,143,0.28)',
    glowStrong: 'rgba(210,196,179,0.16)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#B8A58F',

    accentRgb: '184,165,143',
  },

  Drama: {
    accent: '#8F1F44',
    accentSecondary: '#C1456D',
    accentTertiary: '#4E0F24',

    background: '#12070B',
    backgroundSecondary: '#1B0C12',

    glow: 'rgba(193,69,109,0.32)',
    glowStrong: 'rgba(143,31,68,0.20)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#C1456D',

    accentRgb: '193,69,109',
  },

  Music: {
    accent: '#A34DFF',
    accentSecondary: '#FF4DA6',
    accentTertiary: '#3D7CFF',

    background: '#090814',
    backgroundSecondary: '#121022',

    glow: 'rgba(163,77,255,0.32)',
    glowStrong: 'rgba(255,77,166,0.18)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#A34DFF',

    accentRgb: '163,77,255',
  },
}

// Backwards compatibility exports for non-migrated components
export const SUBJECT_ACCENTS = Object.fromEntries(
  Object.entries(SUBJECTS).map(([subject, { accent }]) => [subject, accent])
)

export const SUBJECT_PALETTES = Object.fromEntries(
  Object.entries(SUBJECTS).map(([subject, { accent, accentRgb }]) => [
    subject,
    { accent, rgb: accentRgb },
  ])
)

export function hexToRgb(hex) {
  const c = hex.replace('#', '')
  return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16)).join(',')
}
