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

  // ── System / operational status tokens ────────────────────────────────
  // These are the loud, high-chroma signals. They mean "the app did or did
  // not do something" — a failed fetch, an unreachable grading server, an
  // input that can't be submitted, a dev-lab component that threw. They are
  // NOT learner feedback: never use them to tell a student their answer was
  // right or wrong (use the feedback* tokens below), because an API failure
  // and a wrong answer must not look like the same event.
  //
  // `successSoft`/`error` are additionally read by GRADE_COLOURS
  // (src/features/quickfire/utils.js) for performance-band styling
  // (Excellent / Good / Developing / Needs Work). A band is a summary of how
  // well a whole answer scored, which is a third concept — deliberately
  // distinct from both binary answer feedback and system state — and it
  // keeps these tokens by review, not by accident.
  //
  // Call sites are censused and guarded by
  // tests/architecture/feedback-token-governance.test.js.
  success:     '#4DFF88',
  successSoft: '#38D27A',
  error:       '#FF5D73',
  errorSoft:   '#FF5C7A',

  // ── Learning / answer-feedback tokens ─────────────────────────────────
  // Canonical answer-feedback tokens — the single source of truth for
  // correct/incorrect/hint/feedback-copy colour across AnswerInteraction,
  // UnifiedQuestionScreen, and AI-marked written feedback ("what you got
  // right" / "next time, also include"). These match the documented
  // `correct`/`incorrect` values in PRODUCT_UI_CONSTITUTION.md —
  // deliberately calmer than the system `success`/`error` above, because
  // marking a student's work should read as guidance, not as an alarm.
  feedbackCorrect:      '#4CAF7D',
  feedbackCorrectRgb:   '76,175,125',
  feedbackIncorrect:    '#E05A52',
  feedbackIncorrectRgb: '224,90,82',
  // Semantic alias for teal when used specifically as the hint/supportive
  // accent in feedback UI — same value as `teal`, named for intent.
  feedbackHint:         '#2A9D8F',
  feedbackHintRgb:      '42,157,143',
  // Canonical feedback/hint body text colour — matches the documented
  // `text-primary` token in PRODUCT_UI_CONSTITUTION.md.
  feedbackText:         '#F5F7FF',

  // Shared full-screen cinematic values. Subject identity still comes from
  // SUBJECTS; these only govern readable white text, image treatment and the
  // protective lower scrim used over photography.
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

    // Completion artwork remains visible through the achievement moment, then
    // dissolves into an opaque action area rather than dimming the whole frame.
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

  // Hairline separators, faint borders and tint fills on dark surfaces —
  // the approved white-alpha ladder for general pages. Pick the nearest
  // step; do not invent new alpha values.
  line: {
    faint:  'rgba(255,255,255,0.06)',
    soft:   'rgba(255,255,255,0.08)',
    medium: 'rgba(255,255,255,0.10)',
    strong: 'rgba(255,255,255,0.14)',
  },

  // Structural drawing tokens for diagrams, graphs and measurement figures.
  // These are intentionally separate from text colours: a component may use
  // them for SVG edges and construction marks without borrowing typography
  // semantics or inventing local white-alpha values.
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
    cinematicOverlay: 'linear-gradient(145deg, rgba(13,15,20,0.78) 0%, rgba(13,15,20,0.56) 100%)',
    cinematicOverlayBorder: 'rgba(255,255,255,0.10)',
    cinematicOverlayBlur: '14px',
    cinematicOverlayShadow: '0 18px 44px rgba(0,0,0,0.32)',
    cinematicOverlayInset: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  },

  // Passive exam-technique hierarchy. The accent itself always comes from the
  // active subject theme; these tokens only control emphasis and spacing.
  examTechnique: {
    bodyPrimary: 'rgba(255,255,255,0.92)',
    bodySecondary: 'rgba(255,255,255,0.72)',
    phraseFillAlpha: 0.08,
    phraseBorderAlpha: 0.26,
    surfaceTintAlpha: 0.055,
    surfaceGlowAlpha: 0.12,
    labelGap: 12,
    sectionGap: 14,
    phraseGap: 8,
    phraseRadius: 999,
  },

  // Elevation shadows on dark surfaces and imagery — the approved shadow
  // ladder. Pick the nearest step; do not invent new shadow values.
  shadow: {
    raised:  '0 4px 16px rgba(0,0,0,0.55)',
    overlay: '0 4px 32px rgba(0,0,0,0.60)',
  },

  // Interaction ring over imagery (drag handles, focusable image surfaces).
  // rest = resting ring; pulse = attention-pulse origin colour.
  ring: {
    rest:  'rgba(255,255,255,0.25)',
    pulse: 'rgba(255,255,255,0.50)',
  },

  // Full-screen scrim behind centred dialog/overlay cards.
  scrim: 'rgba(3,10,11,0.86)',
}
