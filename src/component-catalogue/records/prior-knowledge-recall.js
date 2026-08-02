// PriorKnowledgeRecall — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about PriorKnowledgeRecall; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'prior-knowledge-recall',
  name: 'PriorKnowledgeRecall',
  source: 'src/components/learning/PriorKnowledgeRecall.jsx',
  exportName: null,
  order: 43,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Full-screen chapter-opening free-recall screen. The learner writes what they remember from an earlier topic; /api/recall evaluates the response against expected concepts, and missing concepts feed the weakness tracker and future practice.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'block',
      'subject',
      'onContinue',
      'onBack',
      'onExit'
    ],
    dataShape: "{ type: 'priorKnowledgeRecall', chapterTitle, prompt?, previousTopic?, backgroundImage?, recallPrompts?, concepts: [{ tag, label, keywords[] }], sourceContent? }",
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'RADII',
      'TYPE',
      'unifiedWeaknessTracker',
      'CircularTimer',
      'ScreenTextBlock',
      '/api/recall'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Retrieval family rule — choose according to what the learner must do: generate earlier knowledge without options → PriorKnowledgeRecall; answer several short prompted questions → QuickRecallScreen; recognise and correct a known false belief → MisconceptionCheck; make one curiosity-building prediction before new teaching → ChapterHookScreen; present an embedded ordinary retrieval question consistently → RetrievalFrame, selected by implementation rather than by the content author. Do not use true/false interaction as a generic visual pattern, and do not place substantial question-led components back-to-back.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner is beginning a chapter or connected section and needs to retrieve what they remember from an earlier topic without seeing possible answers. Choose it when that prior knowledge genuinely supports the new learning and the result can identify specific gaps for later practice.',
    doNotUseWhen: 'The learner has not previously been taught the knowledge, the new chapter does not depend meaningfully on it or the task is being added as a routine opening ritual. Do not use it when answer options are needed, a weakness is already known or the response should be a precise exam answer.',
    chooseInstead: 'Use QuickRecallScreen for several short prompted questions about taught knowledge. Use MisconceptionCheck for a known false belief. Use ChapterHookScreen to create curiosity about the new chapter rather than diagnose prior knowledge. Use WeakSpotRecovery when the weakness is already known and needs targeted repair.',
    contentShape: 'One broad free-recall prompt linked to a clearly defined earlier topic, with a bounded set of important expected concepts carrying stable weakness tags. Optional nudges may name broad areas but must not reveal the answers. Avoid insignificant details, trick wording and concepts the system cannot use meaningfully in later practice.',
    rhythmRole: [
      'opening',
      'retrieval'
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
