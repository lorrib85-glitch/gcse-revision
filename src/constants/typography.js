const _displayHero = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'clamp(32px, 9vw, 48px)',
  lineHeight: 1.05,
  fontWeight: 600,
  letterSpacing: '-0.028em',
  textWrap: 'balance',
}

// Full-screen cinematic headline. This role stays dominant but is deliberately
// calmer than a landing-page hero so the image and narrative remain one moment.
// Full-bleed narrative/reveal components must consume it without local type overrides.
const _displayCinematic = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'clamp(32px, 9.2vw, 44px)',
  lineHeight: 1.06,
  fontWeight: 540,
  letterSpacing: '-0.020em',
  textWrap: 'balance',
}

// Canonical non-cinematic module heading. Calibrated from the 390px
// TimelineCanvas reference: calm, prominent and readable without competing
// with cinematic/hero moments. Primary module headings must consume this
// token without local size, weight, line-height or letter-spacing overrides.
const _displayScreen = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'clamp(24px, 7.5vw, 32px)',
  lineHeight: 1.10,
  fontWeight: 560,
  letterSpacing: '-0.015em',
  textWrap: 'balance',
}

const _displaySection = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'clamp(21px, 5.5vw, 28px)',
  lineHeight: 1.12,
  fontWeight: 560,
  letterSpacing: '-0.012em',
  textWrap: 'balance',
}

const _displayCard = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: '1.15rem',
  lineHeight: 1.20,
  fontWeight: 560,
  letterSpacing: '-0.012em',
  textWrap: 'balance',
}

const _titleLarge = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '1.1rem',
  lineHeight: 1.35,
  fontWeight: 600,
  letterSpacing: '-0.01em',
}

const _titleMedium = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '0.95rem',
  lineHeight: 1.30,
  fontWeight: 600,
  letterSpacing: '-0.008em',
}

const _bodyLarge = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '1.02rem',
  lineHeight: 1.48,
  fontWeight: 400,
  letterSpacing: '-0.006em',
}

const _body = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '0.95rem',
  lineHeight: 1.5,
  fontWeight: 400,
  letterSpacing: '-0.005em',
}

const _bodyStrong = {
  fontFamily: "'Sora', sans-serif",
  fontSize: 'clamp(15px, 4vw, 17px)',
  lineHeight: 1.45,
  fontWeight: 500,
  letterSpacing: '-0.005em',
}

const _bodySmall = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '0.84rem',
  lineHeight: 1.45,
  fontWeight: 400,
  letterSpacing: '-0.005em',
}

const _label = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '0.82rem',
  lineHeight: 1.20,
  fontWeight: 500,
  letterSpacing: '0.01em',
}

// DEPRECATED — do not use in new code. The eyebrow pattern (uppercase label
// above a heading) is prohibited. See TYPOGRAPHY_SYSTEM.md — "Label case".
// Use TYPE.label (sentence case) instead.
// Token kept for backward compat only; migrate on next touch.
const _eyebrow = {
  ..._label,
}

const _metadata = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '0.72rem',
  lineHeight: 1.2,
  fontWeight: 500,
  letterSpacing: '0.10em',
}

const _caption = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '0.78rem',
  lineHeight: 1.35,
  fontWeight: 400,
  letterSpacing: '-0.003em',
}

const _button = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '0.92rem',
  lineHeight: 1.2,
  fontWeight: 500,
  letterSpacing: '-0.003em',
}

const _buttonLarge = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '1.0rem',
  lineHeight: 1.2,
  fontWeight: 600,
  letterSpacing: '-0.005em',
}

// Atmospheric progression action used only by CinematicContinueCTA.
// Kept separate from TYPE.label so the uppercase/tracked treatment cannot
// leak into normal screen labels.
const _cinematicAction = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '0.82rem',
  lineHeight: 1.2,
  fontWeight: 600,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
}

const _quizQuestion = {
  ..._displayScreen,
  fontSize: 'clamp(34px, 8.7vw, 46px)',
  lineHeight: 1.05,
  fontWeight: 600,
}

const _quizOption = {
  ..._button,
  fontSize: '0.95rem',
  lineHeight: 1.28,
}

const _quizHint = {
  ..._body,
  fontSize: '0.92rem',
  lineHeight: 1.45,
}

const _examQuestion = {
  fontFamily: "'Sora', sans-serif",
  fontSize: 'clamp(14px, 3.8vw, 15.5px)',
  lineHeight: 1.55,
  fontWeight: 520,
  letterSpacing: '-0.006em',
}

// Small raised seconds marker — the "s" in "90s memory sprint". Applied to a
// <span> nested inside a display/title token; sizes relative to its parent.
const _secondsMarker = {
  fontSize: '0.58em',
  verticalAlign: 'super',
  lineHeight: 1,
}

const _examAnswer = {
  fontFamily: "'Sora', sans-serif",
  fontSize: 'clamp(15px, 4vw, 16px)',
  lineHeight: 1.72,
  fontWeight: 420,
  letterSpacing: '-0.006em',
}

export const TYPE = {
  displayHero: _displayHero,
  displayCinematic: _displayCinematic,
  displayScreen: _displayScreen,
  displaySection: _displaySection,
  displayCard: _displayCard,
  titleLarge: _titleLarge,
  titleMedium: _titleMedium,
  bodyLarge: _bodyLarge,
  body: _body,
  bodyStrong: _bodyStrong,
  bodySmall: _bodySmall,
  eyebrow: _eyebrow,
  label: _label,
  metadata: _metadata,
  caption: _caption,
  button: _button,
  buttonLarge: _buttonLarge,
  cinematicAction: _cinematicAction,
  quizQuestion: _quizQuestion,
  quizOption: _quizOption,
  quizHint: _quizHint,
  examQuestion: _examQuestion,
  examAnswer: _examAnswer,
  secondsMarker: _secondsMarker,
}

export const HEADING_LAYOUT = {
  screenTitle: { maxWidth: 'min(360px, 100%)' },
  sectionTitle: { maxWidth: 'min(320px, 92%)' },
}

export const SCREEN_TEXT_LAYOUT = {
  mobileInset: 16,
  blockGap: 16,
  titleOffsetTop: 20,
  titleBodyGap: 24,
}
