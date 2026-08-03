// FaceTheExaminer — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about FaceTheExaminer; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'face-the-examiner',
  name: 'FaceTheExaminer',
  source: 'src/components/learning/FaceTheExaminer.jsx',
  exportName: null,
  order: 36,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A post-teaching examiner simulation built around one prepared sample answer. The learner reads the response, predicts its mark, identifies which criteria it meets, compares that judgement with the examiner’s verdict, edits annotated weak sections and submits the improved answer for re-marking. FaceTheExaminer.jsx is the compatibility export for faceTheExaminer/FaceTheExaminerContainer.jsx.',
  ownership: {
    internalDirectories: [
      {
        path: 'src/components/learning/faceTheExaminer',
        reason: 'Phase components of the FaceTheExaminer flow (intro, main, marking, verdict, done) plus its container. FaceTheExaminer.jsx is the compatibility export authors use; the phases are never placed individually.'
      }
    ],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Teaching how marks are awarded by making the learner judge and improve a realistic, imperfect response rather than simply reading a model answer.',
    props: [
      'module',
      'examiner',
      'onExit',
      'onContinue'
    ],
    dataShape: 'Examiner shape: { question, marks, sampleAnswer, mark, markScheme, criteriaOptions?, annotations?, subject?, board?, type?, backgroundImage?, videoSrc? }',
    dependencies: [
      'FaceTheExaminerIntro',
      'FaceTheExaminerMain',
      'FaceTheExaminerDone',
      'SegmentedControl',
      'ContinueCTA',
      'SUBJECTS',
      'GENERAL',
      '/api/examiner'
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
    useWhen: 'The learner needs to understand how an examiner applies criteria to a whole answer, distinguish genuine strengths from weaknesses and improve specific passages before seeing the answer re-marked. Choose it when judgement and revision of the response are the central learning jobs.',
    doNotUseWhen: 'The learner should write their own answer from scratch, the sample is either perfect or completely unusable, the only feedback is generic advice such as "add more detail", or there are no precise weak sections that can be meaningfully edited. Do not use it for one isolated factual error or as a decorative model-answer reveal.',
    chooseInstead: 'Use ExamQuestionFrame for independent exam-response practice. Use WhatExaminersLookFor for a short success-criteria briefing before writing. Use GuidedExamResponse when the learner needs substantial construction support. Use SpotTheError when one precise sentence-level error should be identified and repaired rather than the whole answer judged.',
    contentShape: 'One authentic exam-style question and one plausible, imperfect sample answer containing genuine strengths and a small number of improvable weaknesses. Supply an accurate original mark, learner-friendly criteria, precise annotations, editable weak passages and a defensible re-marking route. The answer must be good enough to reward careful judgement rather than being cartoonishly poor.',
    rhythmRole: [
      'practice',
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
        type: 'faceExaminer',
        level: 'screen',
        authoringName: 'Face the examiner',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'examiner',
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
