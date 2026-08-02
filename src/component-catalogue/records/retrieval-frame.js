// RetrievalFrame — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about RetrievalFrame; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'retrieval-frame',
  name: 'RetrievalFrame',
  source: 'src/components/feedback/RetrievalFrame.jsx',
  exportName: null,
  order: 76,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'feedback',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Governed presentation infrastructure for an ordinary retrieval interaction embedded within a learning screen. It converts existing retrieval data for AnswerInteraction and provides contained, full-bleed or inline treatments; AnswerInteraction still owns all answer logic.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'retrieval',
      "variant ('contained' | 'fullBleed' | 'inline')",
      'subject',
      'topic',
      'beatId',
      'contextImage',
      'contextText',
      'label',
      'mode',
      'onInteractionComplete',
      'onContinueReady'
    ],
    dataShape: null,
    dependencies: [
      'AnswerInteraction',
      'SUBJECTS',
      'SPACING',
      'TYPE'
    ],
    usedBy: [],
    usageBoundary: 'Use by implementation when a normal multiple-choice retrieval question needs to be woven into a teaching screen with consistent interaction and feedback behaviour. Do not treat it as a selectable learning activity competing with QuickRecallScreen, a free-recall component, misconception repair, a true/false chapter hook, exam practice or a new content schema.',
    contractDoc: null,
    story: null,
    governanceRules: [
      'Content authors select the learning job. Implementation uses RetrievalFrame only where the surrounding screen contract calls for an embedded ordinary retrieval question. It does not handle trueFalse, does not replace ChapterHookScreen and does not count as the chapter’s cinematic moment.'
    ],
    notes: [
      'Content shape: one existing retrieval object with a concise question, a small answer set, one correct option, a useful explanation, an optional hint and any context required by the surrounding learning beat.'
    ]
  },
  decision: null,
  contract: {
    criticality: 'critical',
    rationale: 'It is the visual and interaction contract for every embedded retrieval moment. Changing it risks inconsistency and duplication across question presentation, and the drift shows up screen by screen rather than as one visible break.',
    invariants: [
      {
        id: 'delegates-answer-logic',
        statement: 'It delegates all answer logic to AnswerInteraction and adds none of its own.',
        evidence: [
          {
            kind: 'review',
            reference: 'Read the component for any selection, scoring or reveal logic that does not pass through AnswerInteraction.'
          }
        ]
      },
      {
        id: 'three-presentation-variants',
        statement: 'It provides the contained, fullBleed and inline treatments and no locally invented fourth framing.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm the variant prop still resolves to exactly those three treatments.'
          }
        ]
      }
    ],
    exclusivity: null,
    requiresProductDecision: [
      'Changing question presentation layout',
      'Adding answer logic instead of delegating to AnswerInteraction',
      'Changing the cinematic framing approach'
    ]
  }
}
