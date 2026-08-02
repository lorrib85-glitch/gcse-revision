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
    governanceRules: [
      'Do not add separate hardcoded save-error alerts or window.alert anywhere. Route critical persistence through saveCritical so this one notice handles it.',
      'No global success toast for normal saves.'
    ],
    notes: [
      'Presentation only. Which saves are critical, plus dedupe and retry, live in src/lib/storage.js (saveCritical + subscribeSaveFailure) and the pure src/app/saveFailureController.js; src/app/SaveFailureHost.jsx wires bus → controller → this component.'
    ]
  },
  decision: null,
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}
