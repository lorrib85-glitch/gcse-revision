// GuidedExamResponse — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about GuidedExamResponse; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'guided-exam-response',
  name: 'GuidedExamResponse',
  source: 'src/components/learning/GuidedExamResponse.jsx',
  exportName: null,
  order: 77,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The guided written-answer scaffold. It presents an exam question with its marks, breaks the response into named sections the learner writes into (optionally pre-seeded with sentence starters), submits for marking, then reveals a model answer with a mark-by-mark breakdown. Support can be dialled down across attempts, and recurring technique patterns are logged.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'chapter',
      'module (default {})',
      'exam (default {})',
      'onExit',
      'onContinue',
      "theme ('general' for non-subject branding)",
      'embedded (default false)'
    ],
    dataShape: "Exam shape: { board, subject, subjectLabel?, topic, question, marks, sections, markScheme, sources?, beatText?, labels?, supportMode? } where supportMode is 'guided' | 'light' | 'none'",
    dependencies: [
      'SPACING',
      'COMPONENT_SIZE',
      'MOTION',
      'TYPE',
      'RADII',
      'BUTTONS',
      'GENERAL',
      'SUBJECTS',
      'BackButton',
      'ContinueCTA',
      'ExamPrompt',
      'logExamTechnique / getExamTechniquePatterns',
      'usePrefersReducedMotion'
    ],
    usedBy: [],
    usageBoundary: 'Support during construction. Used both as an authorable chapter screen and, with embedded, as the worked-example and write stages inside GuidedAnswerCoach.',
    contractDoc: null,
    story: 'src/components/learning/GuidedExamResponse.stories.jsx',
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner must produce a developed written response but cannot yet structure one unaided, so the answer needs breaking into named parts with visible expectations and a model to compare against.',
    doNotUseWhen: 'The learner can already construct the response independently — scaffolding a secure skill teaches dependence rather than technique.',
    chooseInstead: 'Use ExamQuestionFrame once the learner should attempt the question independently. Use WhatExaminersLookFor when only the priorities need clarifying beforehand. Use FaceTheExaminer when the job is judging and improving a prepared answer rather than writing one.',
    contentShape: 'One board-accurate question with a defensible mark allocation, sections that correspond to real mark-scheme demands, a usable mark scheme and a model answer whose annotations explain why each part earns marks.',
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
  },
  authoring: {
    entries: [
      {
        type: 'guidedExamResponse',
        level: 'screen',
        authoringName: 'Guided exam response',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'exam',
            kind: 'object'
          }
        ],
        requiredAny: [],
        continuation: 'component',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'exam-technique'
          ],
          interaction: 'assessed'
        }
      }
    ]
  }
}
