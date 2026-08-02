// SpotTheError — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about SpotTheError; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'spot-the-error',
  name: 'SpotTheError',
  source: 'src/components/learning/SpotTheError.jsx',
  exportName: null,
  order: 57,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A three-stage diagnostic repair task in which the learner locates one inaccurate word or phrase, explains precisely why it is wrong and rewrites the statement correctly. The three stages are evaluated separately so the system can distinguish recognition, understanding and correction.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Developing precision in scientific statements, historical explanations, mathematical working and exam answers where one specific error changes the meaning or loses marks.',
    props: [
      'block',
      'subject',
      'onContinue'
    ],
    dataShape: "{ type: 'spotTheError', statement, errorTarget, whatWasWrong, correctVersion, examinerNote?, commonTrap?, explanationCriteria?, explanationHint?, explanationPraise?, repairKeyTerms?, acceptableRepairs?, repairMustAvoid?, minimumExplanationLength?, minimumRepairLength?, weaknessAreas? }",
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'RADII',
      'TYPE',
      'GENERAL',
      'CinematicShell',
      'ContinueCTA',
      'CheckAnswerCTA',
      'unifiedWeaknessTracker',
      'spotTheErrorScoring'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/SpotTheError.stories.jsx',
    governanceRules: [
      'The three assessment dimensions — error identification (did the learner locate the meaningful error?), explanation precision (did they explain why it is wrong using the relevant subject concept?) and error correction (did they produce an accurate replacement?) — must remain separately tagged in the weakness tracker. A learner who spots the error but cannot explain or repair it has not demonstrated secure understanding.'
    ],
    notes: [
      'Scoring logic lives in src/components/learning/spotTheErrorScoring.js (pure, unit-tested).'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'One precise error within an otherwise plausible statement, calculation or exam response provides a valuable opportunity to practise identifying the problem, explaining its effect and repairing it accurately. Choose it when correction requires genuine subject understanding rather than simple recognition.',
    doNotUseWhen: 'The whole answer is broadly wrong, several independent errors compete for attention or the correction is subjective or debatable. Do not use it for spelling mistakes, trivial slips, an ordinary true-or-false fact or content the learner has not yet been taught well enough to correct.',
    chooseInstead: 'Use MisconceptionCheck when the learner only needs to recognise and correct a common false belief. Use ExplainReveal when the reasoning behind the correct idea still needs teaching. Use RecoveryQuizPlayer when a repaired weakness should be verified across several examples. Use CalculationBreakdown when the learner needs to understand and execute an entire mathematical procedure. Use an exam-response component when the whole answer needs constructing rather than one error repairing.',
    contentShape: 'One concise statement, calculation or response containing one defensible target error. Supply an exact target range, clear criteria describing why it is wrong, one accurate corrected version and reasonable accepted alternatives. The explanation stage must require the learner to state the conceptual problem, not merely say that the selected words are incorrect. The repair must change the meaning accurately without introducing a new error.',
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
  }
}
