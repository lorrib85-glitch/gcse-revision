// LearningHeader — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about LearningHeader; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'learning-header',
  name: 'LearningHeader',
  source: 'src/components/core/LearningHeader.jsx',
  exportName: null,
  order: 8,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Single-row floating capsule header shell for learning screens: [back] [stage rail] [exit]. Composes BackButton, LearningProgressHeader and ExitButton. The stage rail is the only chapter-contents navigation — there is deliberately no numeric n/total counter.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'chapter',
      'currentStage',
      'stageNavigation',
      'currentScreen',
      'onStageJump',
      'onBack',
      'onExit',
      'visible'
    ],
    dataShape: null,
    dependencies: [
      'BackButton',
      'ExitButton',
      'LearningProgressHeader',
      'SUBJECT_ACCENTS / hexToRgb'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
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
