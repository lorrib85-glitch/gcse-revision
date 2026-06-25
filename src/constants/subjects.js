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
    // Maths palette: precise, logical, blueprint-like and calm.
    // Blues should represent structure, clarity and confidence, not neon tech.
    accent: '#4EA3FF',
    accentSecondary: '#A7D2FF',
    accentTertiary: '#1E5F9E',

    background: '#080B10',
    backgroundSecondary: '#101722',

    glow: 'rgba(78,163,255,0.30)',
    glowStrong: 'rgba(167,210,255,0.18)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#4EA3FF',

    accentRgb: '78,163,255',

    palette: {
      blueprintBlue: '#4EA3FF',
      gridBlue: '#A7D2FF',
      theoremBlue: '#1E5F9E',
      graphite: '#252A31',
      slate: '#101722',
      formulaPaper: '#EAF2F8',
      ink: '#080B10',
      tealAccent: '#2A9D8F',
    },
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
    // Physics palette: cosmic, fundamental, energetic and distinct from Maths.
    // Use deep space, prism light, particle gold and electric teal — not blueprint blue.
    accent: '#22D3EE',
    accentSecondary: '#F2C14E',
    accentTertiary: '#3A506B',

    background: '#0D1321',
    backgroundSecondary: '#1A2332',

    glow: 'rgba(34,211,238,0.26)',
    glowStrong: 'rgba(242,193,78,0.18)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#22D3EE',

    accentRgb: '34,211,238',

    palette: {
      cosmicNavy: '#0D1321',
      deepSpace: '#1A2332',
      steelBlue: '#3A506B',
      electricTeal: '#22D3EE',
      particleGold: '#F2C14E',
      warmGrey: '#B7B3A8',
      lightAsh: '#E6E2D9',
      energyPurple: '#8A5CF6',
    },
  },

  Biology: {
    // Biology palette: organic, botanical, glassy and cellular.
    // Greens should feel moss/sage/cellular and premium, not bright app green.
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
      cellMint: '#A8C5A2',
      naturalClay: '#E6E0CF',
      stone: '#2B2B28',
      tealAccent: '#2A9D8F',
    },
  },

  Chemistry: {
    // Chemistry palette: considered, intelligent and quietly scientific.
    // Purples should feel like smoked violet glass, not neon or gaming purple.
    accent: '#6D5AA6',
    accentSecondary: '#7E6D9D',
    accentTertiary: '#54447A',

    background: '#0D0F12',
    backgroundSecondary: '#14181A',

    glow: 'rgba(109,90,166,0.28)',
    glowStrong: 'rgba(126,109,157,0.18)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#6D5AA6',

    accentRgb: '109,90,166',

    palette: {
      amethyst: '#6D5AA6',
      duskPurple: '#54447A',
      mutedLilac: '#7E6D9D',
      slate: '#3B3A47',
      parchment: '#E8E3D6',
      softGrey: '#B8B3BC',
      charcoal: '#0D0F12',
      tealAccent: '#2A9D8F',
    },
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
    // Sociology palette: neutral, grounded, curious and human.
    // No green. Use taupe, stone, clay and parchment to represent connection, understanding and perspective.
    accent: '#A79B8C',
    accentSecondary: '#B8B3AA',
    accentTertiary: '#7B7366',

    background: '#0D0F10',
    backgroundSecondary: '#1F1E1C',

    glow: 'rgba(167,155,140,0.22)',
    glowStrong: 'rgba(184,179,170,0.14)',

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
    // Music palette: sophisticated, analogue, warm and atmospheric.
    // No neon pink, cyan waveforms or EDM/gaming RGB. Use piano black, walnut, brass and dusty plum.
    accent: '#6E4253',
    accentSecondary: '#8A5E3B',
    accentTertiary: '#4B4745',

    background: '#161516',
    backgroundSecondary: '#241F1D',

    glow: 'rgba(110,66,83,0.26)',
    glowStrong: 'rgba(138,94,59,0.18)',

    overlay: 'rgba(0,0,0,0.58)',
    progressFill: '#6E4253',

    accentRgb: '110,66,83',

    palette: {
      pianoBlack: '#161516',
      smokedWalnut: '#4B4745',
      dustyPlum: '#6E4253',
      burnishedBrass: '#8A5E3B',
      mutedRose: '#A06A7B',
      warmIvory: '#D8C8B8',
      velvetShadow: '#241F1D',
      tealAccent: '#2A9D8F',
    },
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