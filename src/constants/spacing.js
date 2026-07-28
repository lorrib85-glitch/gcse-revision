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
  // WCAG-aligned minimum interactive target. Kept separate from the 42px
  // separation rhythm so controls never need arithmetic at the call site.
  touchTarget: 44,
  thumbnail: SPACING.cinematic,
  memoryHookImage: SPACING.section,
  typedAnswerHeight: 52,
  typedAnswerMinWidth: 148,
  typedAnswerMaxWidth: 292,
  typedRecallMinHeight: 360,
  answerFeedbackReserve: 58,
  areaPerimeterStatusReserve: 118,

  // CoordinatePlaneExplore reserves each status sub-block separately rather
  // than the area as a whole. Its headings wrap to two lines in some states
  // ("Rotation 90° clockwise about (−2, 2)") and not others, its working runs
  // to three lines for negative scale factors, and its explanation drops from
  // three lines to two. Reserving only the total let the component's height
  // move by up to 22px as a learner stepped through options.
  //
  // Expressed in line counts so they track the TYPE tokens: heading is
  // displayCard (1.2 line-height), working and explanation are bodySmall
  // (1.45). Sized to the worst state of the busiest preset, not to the
  // default state of the simplest.
  coordinatePlaneHeadingLines: 2,
  coordinatePlaneWorkingLines: 3,
  coordinatePlaneExplanationLines: 3,
  // Clears the fixed LearningHeader (safe-area offset + 44px controls) when a
  // component programmatically scrolls newly revealed content into view.
  learningHeaderClearance: SPACING.cinematic,
}

export const CONTENT_LIMITS = {
  memoryHook: 200,
}
