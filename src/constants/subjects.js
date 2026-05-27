// ─── Subject palette — single source of truth ────────────────────────────────
//
// All subject colour values live here.
// Do NOT redefine SUBJECT_ACCENTS or hexToRgb in individual components.
// Import from this file instead.
//
// Shape:
// SUBJECT_ACCENTS[subject] → hex string
// SUBJECT_PALETTES[subject] → { accent, rgb }
//
// Usage:
//   import { SUBJECT_ACCENTS, SUBJECT_PALETTES, hexToRgb } from '../constants/subjects.js'
//   const accent = SUBJECT_ACCENTS[subject] || SUBJECT_ACCENTS.History
//   const { accent, rgb } = SUBJECT_PALETTES[subject] || SUBJECT_PALETTES.History

export const SUBJECT_ACCENTS = {
  History:   '#B38B63',
  Biology:   '#78B98A',
  Physics:   '#6EA8FF',
  Chemistry: '#A77BFF',
  English:   '#8F4C6B',
  Maths:     '#5FC9B6',
  Sociology: '#C9B07C',
  Music:     '#C778DD',
}

export const SUBJECT_PALETTES = {
  History:   { accent: '#B38B63', rgb: '179,139,99'  },
  Biology:   { accent: '#78B98A', rgb: '120,185,138' },
  Physics:   { accent: '#6EA8FF', rgb: '110,168,255' },
  Chemistry: { accent: '#A77BFF', rgb: '167,123,255' },
  English:   { accent: '#8F4C6B', rgb: '143,76,107'  },
  Maths:     { accent: '#5FC9B6', rgb: '95,201,182'  },
  Sociology: { accent: '#C9B07C', rgb: '201,176,124' },
  Music:     { accent: '#C778DD', rgb: '199,120,221' },
}

export function hexToRgb(hex) {
  const c = hex.replace('#', '')
  return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16)).join(',')
}
