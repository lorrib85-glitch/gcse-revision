// ─── Cinematic Diagnostic-Lab Theme ──────────────────────────────────────────
//
// Shared values for the "cinematic diagnostic lab" genre of learning screen —
// currently TheoryLab.jsx and SymptomQualityDiagnostic.jsx. These are dark,
// subject-accented, multi-beat scenario/diagnosis/treatment components that
// share a warm-cream text colour and near-black background distinct from
// GENERAL (non-subject pages) and from any single subject's own palette.
//
// Do NOT add values here that are specific to one component (e.g. GalensDiagnostic's
// astrolabe SVG gradients are bespoke illustration art, not shared UI tokens).

export const CINEMATIC_LAB = {
  // Near-black background for full-screen beats in this genre.
  background: '#09070A',

  // Warm cream — the primary emphasis/heading text colour in this genre.
  creamText: '#F0E6C8',

  // Dark text/icon colour for content on top of an accent-filled button —
  // matches ContinueCTA's own hardcoded default (src/components/core/ContinueCTA.jsx),
  // kept here as the named source of truth for this genre's own buttons.
  buttonTextOnAccent: '#0D0F14',

  // "Wrong answer" feedback state — background, border and text.
  wrongBg:     'rgba(180,50,30,0.1)',
  wrongBorder: 'rgba(200,60,40,0.45)',
  wrongText:   'rgba(220,90,70,0.9)',

  // Shared layout constants for this genre's full-screen column.
  screenMaxWidth: 420,
  dotSize: 5,
  optionMinHeight: 52,
}
