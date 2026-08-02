// SaveFailureNotice — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about SaveFailureNotice; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'save-failure-notice',
  name: 'SaveFailureNotice',
  source: 'src/components/core/SaveFailureNotice.jsx',
  exportName: null,
  order: 10,
  outOfRootReason: null,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The single governed learner-facing surface shown when a critical save fails (chapter progress, screen completion, quiz and exam scores, streaks, planner completion). Calm, subject-neutral, mobile-first; it never claims progress was saved.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'open',
      'retrying (bool)',
      'onRetry',
      'onDismiss'
    ],
    dataShape: null,
    dependencies: [
      'GENERAL theme',
      'TYPE',
      'SPACING',
      'RADII',
      'BUTTONS',
      'createPortal'
    ],
    usedBy: [],
    usageBoundary: 'The app-wide save-failure notice only. Mounted once via SaveFailureHost at the app root — features do not render it themselves. Not for success confirmation, generic toasts or per-feature error banners.',
    contractDoc: null,
    story: 'src/components/core/SaveFailureNotice.stories.jsx',
    governanceRules: [],
    notes: [
      'Presentation only. Which saves are critical, plus dedupe and retry, live in src/lib/storage.js (saveCritical + subscribeSaveFailure) and the pure src/app/saveFailureController.js; src/app/SaveFailureHost.jsx wires bus → controller → this component.'
    ]
  },
  decision: null,
  contract: {
    criticality: 'critical',
    rationale: 'It is the only place the product ever tells a learner that work was not saved. A second alert path anywhere would either double-report a failure or, worse, let one pass silently — and a learner who believes lost progress was saved is the most damaging state this app can reach.',
    invariants: [
      {
        id: 'never-claims-a-save-succeeded',
        statement: 'It reports failure only. It never states or implies that progress was saved, and there is no global success toast for normal saves.',
        evidence: [
          {
            kind: 'review',
            reference: 'Read every string the notice can render for any wording that implies a successful save.'
          }
        ]
      },
      {
        id: 'presentation-only',
        statement: 'Presentation only. Which saves are critical, plus dedupe and retry, live in src/lib/storage.js (saveCritical + subscribeSaveFailure) and the pure src/app/saveFailureController.js.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/unit/saveFailure/progressFailureIntegration.test.js'
          }
        ]
      },
      {
        id: 'mounted-once-at-the-root',
        statement: 'Mounted once via SaveFailureHost at the app root. Features never render it themselves, and it is never rendered inside a chapter.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm SaveFailureHost is the only component rendering SaveFailureNotice before approving a new consumer.'
          }
        ]
      }
    ],
    exclusivity: {
      pattern: 'save-failure-surface',
      soleImplementation: true,
      prohibitedAlternatives: [
        'a hardcoded save-error alert inside a feature',
        'window.alert or a native dialog used to report a failed save',
        'a per-feature error banner for persistence failures'
      ],
      evidence: [
        {
          kind: 'review',
          reference: 'Search for alert( and any local save-error banner: critical persistence must route through saveCritical so this one notice handles it.'
        }
      ]
    },
    requiresProductDecision: [
      'Adding a second learner-facing surface for save failures',
      'Adding a global success toast for normal saves',
      'Moving criticality, dedupe or retry decisions into this component'
    ]
  }
}
