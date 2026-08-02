// ExamQuestionFrame — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ExamQuestionFrame; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'exam-question-frame',
  name: 'ExamQuestionFrame',
  source: 'src/components/feedback/ExamQuestionFrame.jsx',
  exportName: null,
  order: 73,
  outOfRootReason: null,
  section: 'feedback',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The independent written exam-practice component. It presents an exam-style question with its mark allocation, command word, topic and optional source material, accepts a typed response and sends it to /api/grade for marking against the supplied mark scheme. Feedback can include marks awarded, achieved points, missed points, a summary and an examiner tip; the result can also feed the weakness tracker.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Realistic GCSE written practice where the learner should construct a complete response independently and receive evidence-based feedback.',
    props: [
      'block',
      'subject',
      "mode (default 'practice')",
      'questionNum',
      'onComplete',
      'onSkip'
    ],
    dataShape: '{ id?, questionText?|question, marks?, markPoints?|ms?, commandWord?, topic?, paper?, source?, sourceInstruction? }',
    dependencies: [
      'SUBJECTS',
      'GENERAL',
      'SPACING',
      'RADII',
      'BUTTONS',
      'TYPE',
      'ContinueCTA',
      'unifiedWeaknessTracker',
      '/api/grade'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Exam practice and examiner feedback family rule — choose according to the learner’s stage: clarify what earns marks before writing → WhatExaminersLookFor; construct and submit an independent response → ExamQuestionFrame; judge, annotate and improve a prepared response → FaceTheExaminer. These may form a sequence but should not automatically be stacked around every exam question. GuidedExamResponse remains the alternative when the learner needs support during construction rather than before or after it.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner has already been taught the relevant knowledge and should independently attempt an authentic written question whose response needs mark-scheme judgement rather than simple right-or-wrong checking. Choose it for developed historical, literary, scientific or sociological responses and source-supported questions.',
    doNotUseWhen: 'The learner still needs sentence-by-sentence construction support, the knowledge has not been taught, the task is ordinary factual retrieval, the response can be checked reliably through a simple objective interaction or the learning job is marking somebody else’s answer.',
    chooseInstead: 'Use GuidedExamResponse when substantial scaffolding is needed. Use WhatExaminersLookFor immediately beforehand when the priorities need clarifying. Use FaceTheExaminer when the learner should judge and improve a prepared answer. Use QuickRecallScreen for short factual retrieval and CalculationBreakdown when a numerical method still needs teaching.',
    contentShape: 'One board-accurate exam-style question with a clear command word, defensible mark allocation, sufficient context, any required source or image, a usable mark scheme and stable topic metadata for feedback and weakness evidence. Avoid vague prompts, invented mark-scheme rules and questions that could be marked in several incompatible ways.',
    rhythmRole: [
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
