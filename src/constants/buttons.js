// ─── Button System — Locked Foundation Layer ─────────────────────────────────
//
// ALL button dimensions and interaction values use these tokens.
// Prevents button drift, ensures consistent tactile feel.
//
// Colours come from src/constants/subjects.js — never hardcode locally.
// Use MOTION constants for transition timings.

import { RADII } from './radii.js'

export const BUTTONS = {
  primary: {
    height: 74,
    borderRadius: RADII.large,
    paddingX: 28,
    fontSize: 20,
    fontWeight: 600,
    arrowSize: 26,
    transition: '180ms ease',
    pressScale: 0.985,
  },

  secondary: {
    height: 56,
    borderRadius: RADII.medium,
    paddingX: 24,
    fontSize: 17,
    fontWeight: 500,
    arrowSize: 22,
    transition: '180ms ease',
    pressScale: 0.985,
  },

  compact: {
    height: 44,
    borderRadius: RADII.small,
    paddingX: 18,
    fontSize: 15,
    fontWeight: 500,
    arrowSize: 18,
    transition: '180ms ease',
    pressScale: 0.985,
  },

  text: {
    fontSize: 16,
    fontWeight: 400,
    opacity: 0.46,
    transition: '180ms ease',
  },
}
