// ChapterHookScreen — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ChapterHookScreen; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'chapter-hook-screen',
  name: 'ChapterHookScreen',
  source: 'src/components/layout/ChapterHookScreen.jsx',
  exportName: null,
  order: 65,
  outOfRootReason: null,
  section: 'layout',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Chapter-opening true/false prediction followed by a cinematic explanation or short sequence of reveal beats.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'subject',
      'chapterNum',
      'chapterTitle',
      'statement',
      'isTrue',
      'accentWords',
      'explanation',
      'revealBeats',
      'backgroundImage',
      'onBack',
      'onContinue'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'MOTION',
      'RADII',
      'GENERAL',
      'SPACING',
      'CinematicShell',
      'BackButton'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Presentation tag: cinematic — this component counts as the chapter’s one cinematic moment. When it is used, do not add another cinematic component merely to satisfy the chapter-rhythm requirement.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'One striking true/false statement can open a chapter by creating curiosity, tension or surprise before revealing the central idea the learner is about to explore. Choose it when making an initial prediction gives the following teaching more meaning.',
    doNotUseWhen: 'The purpose is to measure retained knowledge, diagnose a weakness or correct a misconception that should be tracked and revisited. Do not use it as a routine opening for every chapter, for a bland or obvious statement or when another component already owns the chapter’s cinematic moment.',
    chooseInstead: 'Use MisconceptionCheck when recognising the false belief is an assessed retrieval and repair task. Use PriorKnowledgeRecall when the learner should retrieve knowledge from an earlier topic. Use QuickRecallScreen for several fast checks of taught material. Use ConceptReveal when one new idea needs introducing without a prediction. Use CinematicRevealMoment when an image or video can create the opening significance more effectively.',
    contentShape: 'One short, surprising but fair true/false statement connected directly to the chapter’s central question, with one defensible answer and either one clear explanation or a short series of reveal beats. It must be understandable before the teaching and remain useful whether the learner predicts correctly or incorrectly. The response must not be logged as a weakness.',
    rhythmRole: [
      'opening'
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
