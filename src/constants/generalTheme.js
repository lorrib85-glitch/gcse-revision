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

  backgroundApp:     '#08090D',
  backgroundSurface: '#151720',
  backgroundSunken:  '#0D0F14',
  backgroundPanel:   '#0D1424',

  textOnAccent: '#08090D',

  success:     '#4DFF88',
  successSoft: '#38D27A',
  error:       '#FF5D73',
  errorSoft:   '#FF5C7A',

  feedbackCorrect:      '#4CAF7D',
  feedbackCorrectRgb:   '76,175,125',
  feedbackIncorrect:    '#E05A52',
  feedbackIncorrectRgb: '224,90,82',
  feedbackHint:         '#2A9D8F',
  feedbackHintRgb:      '42,157,143',
  feedbackText:         '#F5F7FF',

  cinematic: {
    textPrimary:   'rgba(255,255,255,0.98)',
    textSecondary: 'rgba(255,255,255,0.78)',
    textFact:      'rgba(255,255,255,0.86)',
    textMuted:     'rgba(255,255,255,0.54)',
    textSubtle:    'rgba(255,255,255,0.32)',
    sourceText:    'rgba(255,255,255,0.30)',
    overlay:       'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.46) 57%, rgba(0,0,0,0.82) 78%, rgba(0,0,0,0.94) 100%)',
    imageFilterFull:  'brightness(2.5)',
    imageFilterUpper: 'brightness(1.12) saturate(1.04)',
    actionShadow:  '0 1px 16px rgba(0,0,0,0.60)',

    completionBackdropOpacity: 0.70,
    completionBackdropFilter: 'saturate(0.90) brightness(0.76)',
    completionOverlay: 'linear-gradient(180deg, rgba(8,9,13,0.08) 0%, rgba(8,9,13,0.22) 30%, rgba(8,9,13,0.68) 58%, rgba(8,9,13,0.97) 78%, #08090D 100%)',
    completionGlowOpacity: 0,

    motion: {
      fast: '420ms',
      standard: '500ms',
      slow: '700ms',
      pulse: '2.8s',
      attentionDelay: '900ms',
      hintDelayMs: 300,
      lockDelayMs: 250,
      conclusionDelayMs: 350,
      ctaDelayMs: 700,
    },
  },

  line: {
    faint:  'rgba(255,255,255,0.06)',
    soft:   'rgba(255,255,255,0.08)',
    medium: 'rgba(255,255,255,0.10)',
    strong: 'rgba(255,255,255,0.14)',
  },

  diagram: {
    edgePrimary:  'rgba(255,255,255,0.86)',
    edgeSecondary:'rgba(255,255,255,0.44)',
    construction: 'rgba(255,255,255,0.42)',
    dimension:    'rgba(255,255,255,0.72)',
  },

  surfaceTint: 'rgba(255,255,255,0.04)',

  // Shared translucent surface used when content should sit over a scene or
  // atmospheric background without becoming a bright "glass card". Subject
  // identity is layered in by CardContainer from SUBJECTS, never encoded here.
  contentSurface: {
    cinematicOverlay: 'linear-gradient(145deg, rgba(13,15,20,0.72) 0%, rgba(13,15,20,0.50) 100%)',
    cinematicOverlayBorder: 'rgba(255,255,255,0.06)',
    cinematicOverlayBlur: '14px',
    cinematicOverlayShadow: '0 12px 32px rgba(0,0,0,0.24)',
    cinematicOverlayInset: 'inset 0 1px 0 rgba(255,255,255,0.03)',
  },

  // Passive exam-technique hierarchy. The accent itself always comes from the
  // active subject theme; these tokens only control emphasis and spacing.
  examTechnique: {
    bodyPrimary: 'rgba(255,255,255,0.92)',
    bodySecondary: 'rgba(255,255,255,0.68)',
    surfaceTintAlpha: 0.04,
    surfaceGlowAlpha: 0.07,
    labelGap: 12,
    sectionGap: 16,
    phraseGap: 8,
  },

  shadow: {
    raised:  '0 4px 16px rgba(0,0,0,0.55)',
    overlay: '0 4px 32px rgba(0,0,0,0.60)',
  },

  ring: {
    rest:  'rgba(255,255,255,0.25)',
    pulse: 'rgba(255,255,255,0.50)',
  },

  scrim: 'rgba(3,10,11,0.86)',
}
