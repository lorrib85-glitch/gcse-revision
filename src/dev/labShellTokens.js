// ─── Owner-surface shell tokens ──────────────────────────────────────────────
//
// The non-component half of the owner-surface shell, shared by the Component
// Lab (?componentReview=true) and System reference (?systemReference=true).
// Kept separate from labShell.jsx so that file exports components only.

import { GENERAL } from '../constants/generalTheme.js'

export const mono = { fontFamily: "'Sora', sans-serif" }

// A preview frame is a genuine 390px mobile viewport, not an approximation of
// one. 'fit' scales the whole virtual screen to 78% so a full interaction is
// visible at once; 'actual' keeps it at scale(1) and scrolls.
export const FULLBLEED_PREVIEW_WIDTH = 390
export const FULLBLEED_PREVIEW_SCALE = 0.78

export const PREVIEW_MODES = [
  { id: 'actual', label: 'Actual size' },
  { id: 'fit', label: 'Fit screen' },
]

export const ctrlBtn = {
  ...mono, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  background: 'transparent', color: GENERAL.softWhite,
  border: `1px solid ${GENERAL.line.strong}`, borderRadius: 8, padding: '5px 10px',
}

/**
 * Leave an owner surface by dropping its flag and reloading into the normal
 * learner app, so the app owner is never trapped in one.
 */
export function exitToApp() {
  if (typeof window === 'undefined') return
  window.location.assign(window.location.pathname)
}
