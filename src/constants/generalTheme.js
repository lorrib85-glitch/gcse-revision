// ─── General App Theme — Non-Subject Pages ──────────────────────────────────
//
// Used by Home, Subjects browser, Progress/Pulse, Exam landing, bottom nav,
// onboarding and any other shell screen that sits outside a module's subject
// theme. Subject colours for in-module content remain in
// src/constants/subjects.js and docs/system/SUBJECT_THEME_SYSTEM.md.
//
// General palette: cinematic, calm, focused. Dark backgrounds are atmosphere,
// not decoration. Teal is the primary interface accent. Coral is rare.

export const GENERAL = {
  teal:      '#2A9D8F',
  tealRgb:   '42,157,143',
  darkTeal:  '#264653',
  softWhite: '#F1FAEE',
  slate:     '#A8B0B3',
  coral:     '#E76F51',
  coralRgb:  '231,111,81',

  neutral: {
    900: '#0D0F10',
    800: '#14181A',
    700: '#1B2124',
    600: '#232A2E',
    500: '#2B3337',
    400: '#3A4246',
    300: '#5A6367',
    200: '#A8B0B3',

    0: '#0D0F10',
    1: '#14181A',
    2: '#1B2124',
    3: '#232A2E',
    4: '#2B3337',
  },

  gradient: {
    tealFade: 'linear-gradient(180deg, rgba(42,157,143,0.18), rgba(13,15,16,0))',
    warm:     'linear-gradient(135deg, #E76F51, #7A2E24)',
  },

  // General app chrome / semantic feedback tokens — not subject tokens.
  // These name values that were already repeated across component/feature
  // files as raw hex (see .planning/codebase/CONCERNS.md and the file-hygiene
  // audit). Call sites are not migrated yet except where an exact match
  // existed in the same file — this is a token-definition pass only.
  backgroundApp:     '#08090D',
  backgroundSurface: '#151720',
  backgroundSunken:  '#0D0F14',
  backgroundPanel:   '#0D1424',

  // Dark text/icon colour for use on top of an accent-filled interactive
  // surface (e.g. a CTA button whose background is a subject accent colour).
  textOnAccent: '#08090D',

  success:     '#4DFF88',
  successSoft: '#38D27A',
  error:       '#FF5D73',
  errorSoft:   '#FF5C7A',

  // Canonical answer-feedback tokens — the single source of truth for
  // correct/incorrect/hint/feedback-copy colour across AnswerInteraction and
  // UnifiedQuestionScreen (and any future shared question UI). These match
  // the documented `correct`/`incorrect` values in PRODUCT_UI_CONSTITUTION.md
  // — deliberately calmer than `success` above, which stays as-is for any
  // existing call site that isn't part of this feedback-token migration.
  feedbackCorrect:      '#4CAF7D',
  feedbackIncorrect:    '#E05A52',
  feedbackIncorrectRgb: '224,90,82',
  // Semantic alias for teal when used specifically as the hint/supportive
  // accent in feedback UI — same value as `teal`, named for intent.
  feedbackHint:         '#2A9D8F',
  feedbackHintRgb:      '42,157,143',
  // Canonical feedback/hint body text colour — matches the documented
  // `text-primary` token in PRODUCT_UI_CONSTITUTION.md.
  feedbackText:         '#F5F7FF',
}
