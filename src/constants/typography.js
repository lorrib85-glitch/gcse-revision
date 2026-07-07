const _displayHero = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'clamp(32px, 9vw, 48px)',
  lineHeight: 1.05,
  fontWeight: 600,
  letterSpacing: '-0.028em',
  textWrap: 'balance',
}

const _displayScreen = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'clamp(28px, 8vw, 38px)',
  lineHeight: 1.07,
  fontWeight: 560,
  letterSpacing: '-0.022em',
  textWrap: 'balance',
}

const _displaySection = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'clamp(22px, 6vw, 30px)',
  lineHeight: 1.10,
  fontWeight: 560,
  letterSpacing: '-0.015em',
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
  quizQuestion: _quizQuestion,
  quizOption: _quizOption,
  quizHint: _quizHint,
  examQuestion: _examQuestion,
  examAnswer: _examAnswer,
  secondsMarker: _secondsMarker,
}

export const HEADING_LAYOUT = {
  screenTitle: { maxWidth: 'min(360px, 92%)' },
  sectionTitle: { maxWidth: 'min(320px, 92%)' },
}

export const SCREEN_TEXT_LAYOUT = {
  mobileInset: 16,
  blockGap: 16,
  titleOffsetTop: 20,
  titleBodyGap: 24,
}
