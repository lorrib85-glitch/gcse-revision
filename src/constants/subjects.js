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
    // English palette: rich, literary, oxblood and parchment.
    // Use oxblood with intention for key actions, active states and progress.
    accent: '#6A343D',
    accentSecondary: '#8A6A6E',
    accentTertiary: '#4C242B',

    background: '#0D0F10',
    backgroundSecondary: '#1F1C1B',

    glow: 'rgba(106,52,61,0.32)',
    glowStrong: 'rgba(138,106,110,0.20)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#6A343D',

    accentRgb: '106,52,61',

    palette: {
      oxblood: '#6A343D',
      mahogany: '#4C242B',
      walnut: '#3B2626',
      dustyRose: '#8A6A6E',
      parchment: '#E9E1D3',
      ink: '#1F1C1B',
      tealAccent: '#2A9D8F',
    },
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
    // Biology palette: natural, organic, calm and focused.
    // Greens should represent life, growth and clarity.
    accent: '#6BAA5B',
    accentSecondary: '#A8C5A2',
    accentTertiary: '#4C6B3E',

    background: '#0D0F10',
    backgroundSecondary: '#1B2520',

    glow: 'rgba(107,170,91,0.30)',
    glowStrong: 'rgba(168,197,162,0.18)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#6BAA5B',

    accentRgb: '107,170,91',

    palette: {
      leafGreen: '#6BAA5B',
      mossGreen: '#4C6B3E',
      forest: '#2E4A35',
      sage: '#A8C5A2',
      naturalClay: '#E6E0CF',
      stone: '#2B2B28',
      tealAccent: '#2A9D8F',
    },
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
    // Sociology palette: natural, grounded, curious and human.
    // Neutrals should represent connection, understanding and perspective.
    accent: '#A79B8C',
    accentSecondary: '#B8B3AA',
    accentTertiary: '#7B7366',

    background: '#0D0F10',
    backgroundSecondary: '#1B2124',

    glow: 'rgba(167,155,140,0.24)',
    glowStrong: 'rgba(184,179,170,0.16)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#A79B8C',

    accentRgb: '167,155,140',

    palette: {
      taupe: '#A79B8C',
      warmStone: '#7B7366',
      clay: '#5B544A',
      mink: '#3D3934',
      parchment: '#E8E3D6',
      softGrey: '#B8B3AA',
      charcoal: '#1F1E1C',
      tealAccent: '#2A9D8F',
    },
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
