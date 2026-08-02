// RecoveryQuizPlayer — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about RecoveryQuizPlayer; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'recovery-quiz-player',
  name: 'RecoveryQuizPlayer',
  source: 'src/components/learning/RecoveryQuizPlayer.jsx',
  exportName: null,
  order: 44,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A short, highly focused verification sequence used after targeted reteaching. It checks whether the learner can now apply the repaired understanding across several closely related questions.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Testing whether a specific weak concept has improved after the learner has received an explanation, worked example, scaffold or other appropriate repair activity.',
    props: [
      'recoveryQuizId',
      'onComplete',
      'onBack'
    ],
    dataShape: 'Quiz shape: { id, subject, estimatedTime, topic, questions: [{ type, question, options, correct, explanation, hint? }] } — data source src/data/recoveryQuizzes.js',
    dependencies: [
      'AnswerInteraction',
      'recoveryQuizzes',
      'SUBJECTS',
      'SPACING',
      'BackButton',
      'SequenceProgress',
      'TYPE',
      'GENERAL'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [
      'Completion is not evidence of repair. The weakness status should change only when the learner meets the defined success threshold, ideally across more than one representation of the concept. An unsuccessful check should trigger simpler reteaching or a different repair strategy rather than repeating the same quiz unchanged.',
      `Outcome language: successful evidence → "This is looking stronger"; partial evidence → "One part still needs work"; weak evidence → "Let's rebuild this another way". Do not automatically display "Weak spot fixed".`
    ],
    notes: [
      'Known implementation gap: the current v1 completion screen still displays "Weak spot fixed" when the question sequence ends and does not yet apply a recovery threshold. Treat this as unresolved implementation work; this record does not claim the behaviour is already compliant.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner has already received targeted reteaching for one evidenced weakness and now needs a short check showing whether the corrected understanding transfers across several examples. Choose it as the verification stage of recovery, not as the whole repair.',
    doNotUseWhen: 'The weakness has only just been detected, the learner has not yet been shown why their thinking was wrong or the questions simply repeat the original item with different wording. Do not use it as a generic quiz, mix unrelated weak areas together or mark a weak spot as fixed merely because every question was attempted.',
    chooseInstead: 'Use WeakSpotRecovery to introduce the diagnosed weakness and offer the repair route. Use ExplainReveal, CalculationBreakdown, a worked example or another teaching component when the concept still needs to be rebuilt. Use SpotTheError when the learner must diagnose and correct a precise error. Use QuickRecallScreen for ordinary mixed retrieval outside a repair pathway.',
    contentShape: 'Usually three to five tightly focused questions targeting the same underlying weakness through meaningfully different examples or representations. Begin with a simpler check, then test the idea in a changed context so success cannot come from memorising one answer. Every question needs useful corrective feedback. Include a defined success threshold and a fallback route when the learner is still struggling.',
    rhythmRole: [
      'repair',
      'retrieval'
    ],
    note: null
  },
  contract: {
    criticality: 'critical',
    rationale: 'This component decides whether a diagnosed weakness has been repaired. Changing its flow or completion logic changes what the whole weak-area personalisation system believes about the learner, and nothing downstream can detect that the belief is now wrong.',
    invariants: [
      {
        id: 'verification-not-repair',
        statement: 'It verifies a repair that has already been taught; it never stands in for the reteaching itself.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm every entry point reaches this component after a repair activity, not straight from detection.'
          }
        ]
      },
      {
        id: 'threshold-gated-resolution',
        statement: 'A weakness is declared repaired only on the documented success threshold — never because the learner reached the end of the question sequence.',
        evidence: [
          {
            kind: 'review',
            reference: 'Read the completion path for any resolution that fires on sequence end rather than on the threshold. See the known implementation gap recorded above.'
          }
        ]
      },
      {
        id: 'stable-quiz-data-contract',
        statement: 'The recovery-quiz data contract read from src/data/recoveryQuizzes.js stays stable: adding quizzes uses the existing shape.',
        evidence: [
          {
            kind: 'review',
            reference: 'Add a quiz to src/data/recoveryQuizzes.js using the existing shape and confirm no player change was needed.'
          }
        ]
      }
    ],
    exclusivity: null,
    requiresProductDecision: [
      'Changing the question flow, feedback timing or completion contract',
      'Changing the public API',
      'Declaring a weakness repaired on any basis other than the documented success threshold'
    ]
  }
}
