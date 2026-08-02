// QuickRecallScreen — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about QuickRecallScreen; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'quick-recall-screen',
  name: 'QuickRecallScreen',
  source: 'src/components/learning/QuickRecallScreen.jsx',
  exportName: null,
  order: 42,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Rapid-fire retrieval screen for choice, connection and true/false questions. Presents one short question at a time through UnifiedQuestionScreen, gives immediate feedback and records supported question outcomes in the weakness tracker.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'subject',
      'chapterNum',
      'chapterTitle',
      'questions',
      'onBack',
      'onContinue',
      'renderHeader'
    ],
    dataShape: null,
    dependencies: [
      'UnifiedQuestionScreen',
      'unifiedWeaknessTracker',
      'SequenceProgress'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner needs a fast sequence of short, objectively marked questions that retrieves knowledge already taught. Choose it for low-friction checks of facts, definitions, simple connections, vocabulary or straightforward application.',
    doNotUseWhen: 'The learner needs to generate knowledge freely, develop an explanation, repair a complex error or demonstrate extended exam reasoning. Do not use it to introduce new content, test a misconception that deserves targeted corrective feedback or turn a long question bank into a formal test.',
    chooseInstead: 'Use PriorKnowledgeRecall when the learner should retrieve an earlier topic without answer options. Use MisconceptionCheck when the incorrect belief itself is the learning target. Use ChapterHookScreen when one surprising true/false prediction should open a chapter. Use ExamQuestionFrame or another exam-practice component for mark-scheme application and developed responses. Use SpotTheError when the learner must diagnose and repair an error.',
    contentShape: 'Usually three to six independent questions, each testing one clear retrieval target with one defensible correct answer, concise plausible options and useful immediate feedback. Questions should vary the recalled knowledge rather than repeatedly rephrase one fact. Avoid obscure trivia, confusing wording, oversized option sets and questions solvable through wording clues.',
    rhythmRole: [
      'retrieval',
      'practice'
    ],
    note: null
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}
