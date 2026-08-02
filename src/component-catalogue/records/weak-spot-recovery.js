// WeakSpotRecovery — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about WeakSpotRecovery; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'weak-spot-recovery',
  name: 'WeakSpotRecovery',
  source: 'src/components/learning/WeakSpotRecovery.jsx',
  exportName: null,
  order: 45,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A calm intervention handoff shown after the weakness tracker has gathered enough behavioural evidence to identify one specific weak concept or recurring error pattern. It explains the diagnosed gap briefly and offers a direct route into an appropriate repair activity.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Turning an evidenced weakness into an immediate, manageable next action without making the learner feel punished or overwhelmed.',
    props: [
      'block',
      'subject',
      'progress',
      'onBack',
      'onFixWeakSpot',
      'onSkip'
    ],
    dataShape: "{ type: 'weakSpotRecovery', subject, topicId, title, explanation, meta?, cta?, skipText?, recoveryQuizId? }",
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'RADII',
      'GENERAL',
      'BackButton',
      'ScreenTitle'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [
      'WeakSpotRecovery starts a repair pathway. It does not teach enough content by itself and must not mark the weakness as resolved merely because the learner accepts or completes the suggested activity.'
    ],
    notes: [
      'Weakness repair family rule — choose according to the stage of repair: communicate one evidenced weakness and offer a manageable route → WeakSpotRecovery; rebuild the missing idea → the appropriate teaching, worked-example or scaffold component; practise precise diagnosis and correction → SpotTheError; verify transfer after reteaching → RecoveryQuizPlayer. Detection, reteaching, practice and verification are separate jobs.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'The system has enough evidence to identify one specific weak concept, misconception or recurring error pattern and can offer a suitable next repair activity. Choose it when the learner needs a clear explanation of what is going wrong and one manageable action to address it.',
    doNotUseWhen: 'The learner has made one isolated mistake, the weakness is still broad or uncertain, or the system cannot explain what the learner is confusing. Do not trigger it from self-reported confidence alone, use it as a generic encouragement screen or claim that a topic is weak without supporting evidence.',
    chooseInstead: 'Use MisconceptionCheck when a common false belief should be tested but has not yet been identified as this learner’s weakness. Use PriorKnowledgeRecall when broad missing prior knowledge still needs diagnosing. Use SpotTheError when the learner should locate and repair one precise error. Use QuickRecallScreen when the goal is ordinary retrieval rather than targeted repair.',
    contentShape: 'Exactly one specific weak spot with a concise, evidence-based diagnosis of what the learner is mixing up, missing or doing incorrectly. Include one realistic repair route, a short indication of what the activity involves and an optional skip route. Avoid vague labels such as "History" or "Algebra", generic motivational copy and unsupported claims that the learner has mastered or failed a topic.',
    rhythmRole: [
      'repair'
    ],
    note: null
  },
  contract: {
    criticality: 'critical',
    rationale: 'This is the learner-facing face of the weak-area system, the app’s primary personalisation mechanism. Its non-punitive, non-gamified tone and its behavioural (not self-report) basis are product rules, and both are easy to erode one sympathetic copy edit at a time.',
    invariants: [
      {
        id: 'calm-non-gamified-diagnosis',
        statement: 'The diagnosis framing stays calm and non-punitive: no gamified or motivational copy, no streaks, no scores.',
        evidence: [
          {
            kind: 'review',
            reference: 'Read every learner-facing string on the screen for motivational or game-like framing.'
          }
        ]
      },
      {
        id: 'behavioural-evidence-only',
        statement: 'The intervention is based on behavioural evidence from the weakness tracker, never on self-reported confidence.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm no trigger path reaches this screen from a learner self-rating.'
          }
        ]
      },
      {
        id: 'starts-repair-never-completes-it',
        statement: 'It starts a repair pathway and never marks a weakness resolved from this screen.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm no handler on this screen writes a resolved state to the weakness tracker.'
          }
        ]
      }
    ],
    exclusivity: null,
    requiresProductDecision: [
      'Changing the diagnosis framing to gamified or motivational copy',
      'Basing the intervention on self-reported confidence',
      'Marking a weakness resolved from this screen',
      'Changing the component API or block shape'
    ]
  }
}
