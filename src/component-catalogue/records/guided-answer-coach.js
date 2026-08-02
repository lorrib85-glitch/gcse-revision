// GuidedAnswerCoach — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about GuidedAnswerCoach; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'guided-answer-coach',
  name: 'GuidedAnswerCoach',
  source: 'src/components/learning/GuidedAnswerCoach.jsx',
  exportName: null,
  order: 78,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'learning',
  kind: 'feature',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The multi-stage exam-technique coach for one question type. It walks the learner through an eight-stage scaffold: the question → what the examiner wants → watching an examiner think → an annotated model answer → write with support → write with light support → write independently → progress debrief. Support is withdrawn stage by stage.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'coachType (one entry from GUIDED_COACH_TYPES)',
      'onExit'
    ],
    dataShape: 'Data source: src/data/guidedAnswerCoach.js (GUIDED_COACH_TYPES, currently TYPE_A–TYPE_F). Worked examples reuse GuidedExamResponse’s exam shape.',
    dependencies: [
      'SequenceProgress',
      'GuidedExamResponse',
      'ContinueCTA',
      'ScreenText',
      'SPACING',
      'MOTION',
      'TYPE',
      'RADII',
      'BUTTONS',
      'GENERAL',
      'SUBJECTS',
      'logCoachTypeResult (unifiedWeaknessTracker)'
    ],
    usedBy: [],
    usageBoundary: 'A standalone, app-wide feature owned by the Exams tab (src/features/quickfire/modes/ExamMode.jsx), rendered as a full-screen overlay. It sits outside ChapterPlayer entirely and is not bound by the subject module architectures. A chapter author never places it.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Subject scope: the component is subject-agnostic (palettes for History, Biology, Chemistry, Physics, Maths, English and Sociology, plus theme="general"); current content is six Edexcel GCSE History (Medicine) question types.',
      'Adding content: follow the existing TYPE_A–TYPE_F shape and add the entry to GUIDED_COACH_TYPES.'
    ]
  },
  decision: {
    status: 'not-applicable',
    useWhen: null,
    doNotUseWhen: null,
    chooseInstead: null,
    contentShape: null,
    rhythmRole: [],
    note: 'An author never selects it against a learning component; the learner chooses a question type in the Exams tab.'
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}
