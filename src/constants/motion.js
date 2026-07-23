// ─── Motion System — Locked Foundation Layer ─────────────────────────────────
//
// ALL motion behaviour across the product uses these tokens.
// Enforces cinematic consistency, prevents motion drift.
//
// The product should feel: cinematic, calm, restrained, premium.
// NOT: playful, hyperactive, gamified, arcade-like.

export const MOTION = {
  duration: {
    instant: '120ms',
    fast: '180ms',
    standard: '280ms',
    slow: '420ms',
    cinematic: '720ms',
    settle: '1400ms',
    atmospheric: '12000ms',
  },

  // Numeric millisecond intervals used to build deliberate reveal sequences.
  // Components should derive step delays from these values rather than inventing
  // one-off delay ladders locally.
  stagger: {
    standardMs: 120,
    cinematicMs: 180,
  },

  easing: {
    standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
    gentle: 'ease-out',
    linear: 'linear',
  },

  scale: {
    press: 0.985,
    subtle: 1.015,
  },
}
