// LearningProgressHeader — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about LearningProgressHeader; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'learning-progress-header',
  name: 'LearningProgressHeader',
  source: 'src/components/core/LearningProgressHeader.jsx',
  exportName: null,
  order: 9,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Progress rail and jump sheet display for a chapter. Shows the current position within a chapter and owns no interaction logic of its own.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'progress',
      'currentStep',
      'totalSteps',
      'steps'
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
    rationale: 'Learners build spatial memory for where progress lives. Moving or restyling the rail costs them that memory across every chapter simultaneously, and the regression is invisible in tests.',
    invariants: [
      {
        id: 'display-only',
        statement: 'Display only — it owns no interaction logic. The jump sheet reports a request; the runtime decides what happens.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm the component adds no navigation side effects of its own.'
          }
        ]
      },
      {
        id: 'stable-rail-position',
        statement: 'The progress rail keeps its established position and appearance inside the header capsule.',
        evidence: [
          {
            kind: 'review',
            reference: 'Compare the rail position and treatment against a current chapter screen at 390px.'
          }
        ]
      }
    ],
    exclusivity: {
      pattern: 'chapter-progress-rail',
      soleImplementation: true,
      prohibitedAlternatives: [
        'inline progress bars on a chapter screen',
        'a component-local n/total counter standing in for the rail'
      ],
      evidence: [
        {
          kind: 'review',
          reference: 'Every chapter progress display must arrive through LearningHeader; check new screens for a local bar.'
        }
      ]
    },
    requiresProductDecision: [
      'Moving the progress bar position or changing the rail appearance',
      'Adding interaction logic to a display-only component',
      'Allowing an inline progress-bar implementation for chapter screens'
    ]
  }
}
