// ─── General App Theme — Non-Subject Pages ──────────────────────────────────
//
// Used by Home, Subjects browser, Progress/Pulse, Exam landing, bottom nav,
// onboarding and any other shell screen that sits outside a module's subject
// theme. Subject colours for in-module content remain in
// src/constants/subjects.js (BRAND.md) and are unaffected by this file.
//
// Coral is a RARE accent — streak flame, weakest-subject emphasis only.
// Do not use it for general decoration.

export const GENERAL = {
  teal:      '#2A9D8F',   // primary actions, progress, active nav state
  tealRgb:   '42,157,143',
  darkTeal:  '#264653',   // surfaces, deep backgrounds
  softWhite: '#F1FAEE',   // headings, high-emphasis text
  slate:     '#A8B0B2',   // secondary text, icons, inactive nav
  coral:     '#E76F51',   // rare: streak flame, weakest-subject emphasis
  coralRgb:  '231,111,81',

  neutral: {
    0: '#0D0F10',
    1: '#14161A',
    2: '#1B2126',
    3: '#252B31',
    4: '#32383E',
  },

  gradient: {
    tealFade: 'linear-gradient(180deg, rgba(42,157,143,0.18), rgba(13,15,16,0))',
    warm:     'linear-gradient(135deg, #E76F51, #7A3226)',
  },
}
