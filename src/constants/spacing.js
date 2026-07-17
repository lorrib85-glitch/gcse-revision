// ─── Spacing Tokens — Locked Foundation Layer ────────────────────────────────
//
// ALL spacing behaviour across the product uses these tokens.
// Enforces visual rhythm, cinematic pacing, consistency, and premium feel.
//
// Do NOT invent random spacing values or eyeball margins.
// Do NOT manually tune spacing per component unless absolutely necessary.

export const SPACING = {
  micro: 8,
  compact: 16,
  standard: 24,
  separation: 42,
  cinematic: 72,
  section: 96,
}

// Semantic aliases for fixed component dimensions. These keep call sites from
// borrowing a rhythm token for an unrelated job (for example, using
// SPACING.cinematic directly as a thumbnail size) while preserving the locked
// foundation scale.
export const COMPONENT_SIZE = {
  hairline: 1,
  focusRing: 2,
  focusOffset: 2,
  accentRail: 3,
  touchTarget: SPACING.separation,
  thumbnail: SPACING.cinematic,
}

export const CONTENT_LIMITS = {
  memoryHook: 200,
}
