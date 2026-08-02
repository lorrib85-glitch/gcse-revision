// ExitButton — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ExitButton; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'exit-button',
  name: 'ExitButton',
  source: 'src/components/core/ExitButton.jsx',
  exportName: null,
  order: 7,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The exit-navigation control for the whole app: 44×44 touch target, near-invisible "X" icon, opacity and scale press feedback.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'onClick',
      "ariaLabel (default 'Exit chapter')",
      'style (layout overrides only — position/margin/zIndex)'
    ],
    dataShape: null,
    dependencies: [],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: null,
  contract: {
    criticality: 'critical',
    rationale: 'Consolidated in 2026-06-15 from the inline exit buttons in the learning header layer. Exiting a chapter is a destructive-feeling action, so its affordance must read the same everywhere the learner meets it.',
    invariants: [
      {
        id: 'exit-control-appearance',
        statement: '44×44 touch target with a near-invisible "X" icon at opacity 0.22 at rest.',
        evidence: [
          {
            kind: 'review',
            reference: 'Measure the touch target and rest opacity of the rendered control at 390px.'
          }
        ]
      },
      {
        id: 'exit-press-feedback',
        statement: 'Press feedback is opacity 0.6 plus scale 0.90, applied on onPointerDown / onPointerUp / onPointerLeave.',
        evidence: [
          {
            kind: 'review',
            reference: 'Press and drag off the control; both opacity and scale must return on pointer leave.'
          }
        ]
      }
    ],
    exclusivity: {
      pattern: 'exit-navigation',
      soleImplementation: true,
      prohibitedAlternatives: [
        'inline "X" or close glyphs used as chapter exits',
        'a feature-owned exit control with its own size or opacity behaviour'
      ],
      evidence: [
        {
          kind: 'review',
          reference: 'Search a new full-screen surface for close affordances that do not render the ExitButton component.'
        }
      ]
    },
    requiresProductDecision: [
      'Changing size, icon, or opacity and press behaviour',
      'Allowing an inline exit-button implementation'
    ]
  }
}
