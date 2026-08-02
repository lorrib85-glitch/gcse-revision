// SequenceProgress — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about SequenceProgress; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'sequence-progress',
  name: 'SequenceProgress',
  source: 'src/components/core/SequenceProgress.jsx',
  exportName: null,
  order: 11,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Local sequence progress through a short sequence inside a learning component. Provides consistent dot and sash indicators for carousels, image sets, swipe cards, mini-steps and question sets.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'total',
      'current (zero-based, default 0)',
      'completed (count, default 0)',
      'viewed (index array for non-linear flows, default [])',
      'accent',
      'accentRgb',
      "variant ('dots' | 'sash', default 'dots')",
      'compact (boolean, default false)',
      'ariaLabel'
    ],
    dataShape: null,
    dependencies: [],
    usedBy: [
      'QuickRecallScreen',
      'CinematicCarousel',
      'VisualLearning',
      'GuidedChoiceCarousel'
    ],
    usageBoundary: 'Use for carousels, image sets, swipe cards, multi-question task progress, mini-step progress inside a learning component, and small viewed/current/remaining indicators. Do NOT use for the top chapter progress rail, chapter navigation or global app progress — use LearningProgressHeader for those.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Approved variants — dots (default): 20×8px accent pill for current, 8px muted-accent circle for done/viewed, 8px muted-white for future; compact reduces to 16×6px pill and 6px circles. sash: thin horizontal segments (3px, or 2px when compact), accent for current, muted accent for done/viewed, muted white for future — use where dots are too subtle (longer flows, step interactions).',
      'Behaviour: display only, no navigation. The viewed array takes priority over the completed count when supplied. current is zero-based.'
    ]
  },
  decision: null,
  contract: {
    criticality: 'critical',
    rationale: 'Before it existed, one-off ProgressDots and inline carousel dots had drifted across several components. Its no-numbers rule is a product decision about how progress should feel inside a learning beat, and a local counter quietly undoes it.',
    invariants: [
      {
        id: 'never-renders-numbers',
        statement: 'It never renders numbers, labels, counters, percentages or "x of y" — no exceptions.',
        evidence: [
          {
            kind: 'review',
            reference: 'Read the component for any numeric or textual progress output before approving a change.'
          }
        ]
      },
      {
        id: 'display-only-no-navigation',
        statement: 'Display only: it carries no navigation and no interaction.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm the rendered indicators expose no click, tap or keyboard handlers.'
          }
        ]
      },
      {
        id: 'approved-variants-only',
        statement: "Only the two approved variants exist — 'dots' and 'sash', each with a compact size.",
        evidence: [
          {
            kind: 'review',
            reference: 'Any third variant is a product decision, not an implementation detail.'
          }
        ]
      }
    ],
    exclusivity: {
      pattern: 'local-sequence-progress',
      soleImplementation: true,
      prohibitedAlternatives: [
        'local ProgressDots components',
        'one-off carousel dots inside a learning component',
        'an inline "3 of 5" counter standing in for local progress'
      ],
      evidence: [
        {
          kind: 'review',
          reference: 'Search a new sequenced component for hand-rolled dots or counters before approving it.'
        }
      ]
    },
    requiresProductDecision: [
      'Rendering any numeric or textual progress',
      'Adding navigation or interaction to a display-only indicator',
      'Adding a new variant',
      'Allowing a local ProgressDots or one-off carousel-dot implementation'
    ]
  }
}
