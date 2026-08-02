// TieredQuizScreen — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about TieredQuizScreen; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'tiered-quiz-screen',
  name: 'TieredQuizScreen',
  source: 'src/components/learning/TieredQuizScreen.jsx',
  exportName: null,
  order: 80,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A multi-tier question sequence over a subject backdrop. Each tier is a set of questions rendered through UnifiedQuestionScreen, with shared SequenceProgress and a governed ContinueCTA at the end.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      "subject (default 'History')",
      'backgroundImage',
      'tiers (default [])',
      'renderHeader',
      'onContinue'
    ],
    dataShape: null,
    dependencies: [
      'UnifiedQuestionScreen',
      'SequenceProgress',
      'ContinueCTA',
      'SUBJECTS',
      'GENERAL',
      'TYPE',
      'SPACING',
      'RADII'
    ],
    usedBy: [],
    usageBoundary: 'Graduated difficulty within one topic. Do not use it as a generic quiz chain — see the anti-patterns list in CLAUDE.md.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'pending',
    useWhen: null,
    doNotUseWhen: null,
    chooseInstead: null,
    contentShape: null,
    rhythmRole: [],
    note: 'Pending product review. Choosing between this and QuickRecallScreen or RecoveryQuizPlayer is a pedagogical judgement that current source, stories and contracts do not settle.'
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}
