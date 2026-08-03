// FillInTheBlanksBlock — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about FillInTheBlanksBlock; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'fill-in-the-blanks-block',
  name: 'FillInTheBlanksBlock',
  source: 'src/components/learning/FillInTheBlanksBlock.jsx',
  exportName: null,
  order: 37,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A short typed-recall activity. The learner supplies one missing word, phrase or numerical value inside meaningful context, receives a hint after the first incorrect attempt and sees the correct answer after a second unsuccessful attempt.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Generative retrieval where the surrounding sentence provides a useful cue but the learner must still produce the missing answer rather than recognise it from options.',
    props: [
      'block',
      'subject',
      'onContinue'
    ],
    dataShape: "{ type: 'fillblanks', sentences: [{ before?, after?, answer, acceptedAnswers?, matchMode?, hint?, hints?, feedback?, placeholder?, ariaLabel?, inputMode? }], wrongMsg?, correctMsg?, placeholder?, backgroundImage?, backgroundPosition?, backgroundOpacity?, backgroundFilter? }",
    dependencies: [
      'SequenceProgress',
      'CheckAnswerCTA',
      'ContinueCTA',
      'SUBJECTS',
      'subject backdrops',
      'GENERAL',
      'COMPONENT_SIZE',
      'SPACING',
      'MOTION',
      'RADII',
      'TYPE',
      'fillInTheBlanksMatching'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Guided construction family rule — choose according to what the learner must produce: select supplied pieces and rebuild an exact structure → BuilderBlock; generate and type one missing answer from context → FillInTheBlanksBlock; understand and execute a connected procedural method → CalculationBreakdown. These form a graduated support pathway but are not interchangeable. Do not supply choices when independent recall is the learning goal, and do not reduce a multi-step method to disconnected missing-value questions.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'The surrounding sentence gives a useful retrieval cue, but the learner should independently generate and type one missing word, phrase or numerical value. Choose it for precise scientific terminology, a missing historical fact, a quotation fragment, a formula value or one essential word that changes a definition’s meaning.',
    doNotUseWhen: 'Several supplied pieces must be arranged, multiple gaps form one larger structure, several answers could reasonably fit, grammar reveals the answer without subject knowledge or the learner needs an extended explanation.',
    chooseInstead: 'Use BuilderBlock when choices should be supplied and positioned. Use QuickRecallScreen for short objectively marked questions with answer options. Use SpotTheError when the learner must diagnose and repair incorrect wording. Use GuidedExamResponse when the response needs developed writing rather than one precise missing answer.',
    contentShape: 'Usually three to six short independent sentences, each containing one meaningful gap and one defensible answer. The surrounding wording must test subject knowledge rather than provide an accidental grammatical clue. Use accepted alternatives only where they are genuinely equivalent, and provide a hint that narrows the concept without simply revealing the answer.',
    rhythmRole: [
      'retrieval',
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
        type: 'fillblanks',
        level: 'block',
        authoringName: 'Fill in the blanks',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'sentences',
            kind: 'array'
          }
        ],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: null
      }
    ]
  }
}
