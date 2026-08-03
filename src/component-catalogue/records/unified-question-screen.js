// UnifiedQuestionScreen — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about UnifiedQuestionScreen; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'unified-question-screen',
  name: 'UnifiedQuestionScreen',
  source: 'src/components/learning/UnifiedQuestionScreen.jsx',
  exportName: null,
  order: 79,
  outOfRootReason: null,
  section: 'learning',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The shared single-question presentation used by other question components: stem, options, selection, correct/incorrect state, hint and explanation, over an optional subject backdrop.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'question',
      "type (default 'choice')",
      'options',
      'correct',
      'hint',
      'explanation',
      'backgroundImage',
      "subject (default 'History')",
      'plus completion callbacks'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'MOTION',
      'TYPE',
      'SPACING',
      'GENERAL',
      'RADII'
    ],
    usedBy: [],
    usageBoundary: 'Composed by QuickRecallScreen and TieredQuizScreen. It is not an authorable screen type — authors select the owning component instead.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Its answer feedback shares the GENERAL.feedbackCorrect / feedbackHint / feedbackText tokens with AnswerInteraction.'
    ]
  },
  decision: null,
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  },
  authoring: null
}
