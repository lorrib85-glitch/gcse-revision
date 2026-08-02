// ExamPrompt — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ExamPrompt; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'exam-prompt',
  name: 'ExamPrompt',
  source: 'src/components/core/ExamPrompt.jsx',
  exportName: null,
  order: 15,
  outOfRootReason: null,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Cross-subject exam-question prompt primitive: the question stem plus its mark allocation, in Sora rather than a subject-specific face, so one treatment serves prose, quotations, calculations, equations and source questions. Also exports stripTrailingMarks(question, marks), which removes a trailing "(4 marks)" from authored question text so marks are not shown twice.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'question',
      'marks',
      'and layout props'
    ],
    dataShape: null,
    dependencies: [
      'GENERAL',
      'SPACING',
      'TYPE'
    ],
    usedBy: [
      'GuidedExamResponse'
    ],
    usageBoundary: 'The question stem only. Marking, feedback and answer capture stay with the surrounding exam component.',
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
