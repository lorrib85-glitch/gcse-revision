// ExamRoundDebrief — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ExamRoundDebrief; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'exam-round-debrief',
  name: 'ExamRoundDebrief',
  source: 'src/components/feedback/ExamRoundDebrief.jsx',
  exportName: null,
  order: 74,
  outOfRootReason: null,
  section: 'feedback',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The examiner-voice end-of-round debrief. It synthesises across every answer in an exam round rather than question by question, surfaces one genuinely recurring pattern, quotes real moments from the learner’s own answers in the FaceTheExaminer voice, and logs that pattern so it resurfaces in WeakSpotRecovery.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'subject',
      'results (the round’s answer records)'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'GENERAL',
      'SPACING',
      'RADII',
      'TYPE',
      'logWrongAnswer (unifiedWeaknessTracker)',
      '/api/debrief'
    ],
    usedBy: [],
    usageBoundary: 'Exam Mode only — mounted by src/features/quickfire/modes/ExamMode.jsx at the end of a round. It sits outside ChapterPlayer and has no authorable screen type; a chapter author never places it. One debrief per round, never per question.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Relationship to GuidedAnswerCoach: both live in Exam Mode and both feed unifiedWeaknessTracker.js, but they are separate flows and are not composed. This component logs content-knowledge weaknesses via logWrongAnswer; the coach logs exam-technique patterns via logExamTechnique.'
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
