// AnswerInteraction — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about AnswerInteraction; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'answer-interaction',
  name: 'AnswerInteraction',
  source: 'src/components/core/AnswerInteraction.jsx',
  exportName: null,
  order: 1,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The shared answer interaction for block-based, non-timed learning activities — choice, connection and true/false. It owns selection, the attempt sequence, hint and reveal, and silent weakness logging for the components that delegate to it. It is not the only answer implementation in the product: the QuickFire-style question families (QuickRecallScreen, TieredQuizScreen) own their answer flow through UnifiedQuestionScreen instead.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'block',
      'subject',
      'onAnswer',
      'onContinue'
    ],
    dataShape: null,
    dependencies: [],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      '2026-07-05, explicit sign-off, scoped: the hardcoded feedback colour literals (#4DFF88 correct-answer highlight, #C8D0E8 hint/feedback body text) and copy ("Hint — think about this", "Correct — ", "Not quite — the answer was: ") were migrated to the canonical GENERAL.feedbackCorrect / GENERAL.feedbackHint / GENERAL.feedbackText tokens as part of an app-wide answer-feedback consolidation shared with UnifiedQuestionScreen. Scoped strictly to colour, copy and token usage inside the existing hint and feedback blocks — no answer-logic, reveal-timing or API change.'
    ]
  },
  decision: null,
  contract: {
    criticality: 'critical',
    rationale: 'Every block-based question type delegates its answer flow here, so a change is felt across those screens at once — and the failure is silent: the screen still renders, it just teaches differently.',
    invariants: [
      {
        id: 'two-attempt-ceiling',
        statement: 'At most two attempts. An incorrect first attempt shows the hint and allows a retry; an incorrect second attempt reveals the answer, logs the weakness and completes the interaction. Correct on either attempt completes it.',
        evidence: [
          {
            kind: 'review',
            reference: 'Play a choice, a connection and a true/false block: confirm attempt 1 hints, attempt 2 reveals, and no third attempt is offered.'
          }
        ]
      },
      {
        id: 'question-stays-visible',
        statement: 'The question is never replaced by feedback. Feedback appears below the answer area so the stem stays on screen throughout.',
        evidence: [
          {
            kind: 'review',
            reference: 'Answer incorrectly and confirm the stem is still readable above the feedback at 390px.'
          }
        ]
      },
      {
        id: 'silent-weakness-logging',
        statement: 'Weakness logging is silent — no "saved to your weak spots" message ever reaches the learner.',
        evidence: [
          {
            kind: 'review',
            reference: 'Answer incorrectly twice and confirm no persistence or tracking copy is shown.'
          }
        ]
      },
      {
        id: 'untimed-learning-only',
        statement: 'This component serves non-timed, block-based learning activities only. Timed exam flows do not use it and must not gain hints or retries through it.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm no timed exam surface imports AnswerInteraction before approving a change.'
          }
        ]
      },
      {
        id: 'parent-owns-completion',
        statement: 'The parent must wire onComplete. Without it the interaction locks but the surrounding screen never learns that progression is allowed.',
        evidence: [
          {
            kind: 'review',
            reference: 'Check every call site passes a completion handler when adding a new consumer.'
          }
        ]
      }
    ],
    exclusivity: null,
    requiresProductDecision: [
      'Changing answer state logic, the attempt ceiling or reveal timing',
      'Adding a new answer type',
      'Changing the public API (block, subject, onAnswer, onContinue)'
    ]
  }
}
