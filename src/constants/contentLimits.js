// Learner-facing component limits that protect the composed mobile layout.
// These are authoring constraints, not runtime truncation rules: content that
// exceeds a limit must be rewritten and should fail governance.

export const COMPONENT_TEXT_LIMITS = Object.freeze({
  factorWeb: Object.freeze({
    title: 42,
    centreLabel: 22,
    nodeLabel: 24,
  }),
})
