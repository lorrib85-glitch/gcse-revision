// MisconceptionCheck — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about MisconceptionCheck; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'misconception-check',
  name: 'MisconceptionCheck',
  source: 'src/components/learning/MisconceptionCheck.jsx',
  exportName: null,
  order: 56,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Full-screen true/false misconception checker. It presents one conceptual trap at a time, reveals the corrected understanding and can explain the related exam trap. Answers are recorded in the weakness tracker.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'block',
      'subject',
      'onContinue'
    ],
    dataShape: "{ type: 'misconceptionCheck', statements: [{ statement, answer: true|false, reveal, examTrap? }] }",
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'RADII',
      'TYPE',
      'BUTTONS',
      'ContinueCTA',
      'unifiedWeaknessTracker'
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
    useWhen: 'The learner needs to confront a specific, common false belief that is likely to damage later understanding or cost marks in an exam. Choose it when recognising and correcting the misconception is more important than testing an ordinary isolated fact.',
    doNotUseWhen: 'The statement is simply an ordinary fact written as true or false, the learner has not yet been taught enough to understand the correction or the answer depends on unstated context. Do not use it for minor slips, deceptive wording, debatable interpretations or a generic true/false quiz.',
    chooseInstead: 'Use ChapterHookScreen when one surprising statement should create curiosity without becoming a tracked weakness. Use QuickRecallScreen for ordinary factual retrieval. Use SpotTheError when the learner must locate, explain and repair the precise error. Use ExplainReveal when the reasoning that makes the belief wrong still needs teaching.',
    contentShape: 'One conceptual trap at a time, or a very small set of closely related traps. Each needs a concise unambiguous statement, one defensible answer, a clear explanation of what is wrong and what the learner should think instead, plus an optional exam-trap note. Avoid double negatives, technical loopholes and invented tricks.',
    rhythmRole: [
      'retrieval',
      'repair'
    ],
    note: null
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  },
  authoring: {
    entries: [
      {
        type: 'misconceptionCheck',
        level: 'block',
        authoringName: 'Misconception check',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'component',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'retrieve',
            'exam-technique'
          ],
          interaction: 'assessed'
        }
      },
      {
        type: 'misconceptionCheck',
        level: 'screen',
        authoringName: 'Misconception check screen',
        layout: 'full',
        status: 'derived',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'component',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'retrieve',
            'exam-technique'
          ],
          interaction: 'assessed'
        }
      }
    ]
  }
}
