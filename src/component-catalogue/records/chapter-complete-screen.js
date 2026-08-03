// ChapterCompleteScreen — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ChapterCompleteScreen; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'chapter-complete-screen',
  name: 'ChapterCompleteScreen',
  source: 'src/components/layout/ChapterCompleteScreen.jsx',
  exportName: null,
  order: 64,
  outOfRootReason: null,
  section: 'layout',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'End-of-chapter completion screen with score and stats. An emotional beat that acknowledges progress without being childish.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'subject',
      'chapterTitle',
      'score',
      'totalQuestions',
      'onContinue',
      'onReview'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'MOTION',
      'RADII',
      'CinematicShell'
    ],
    usedBy: [],
    usageBoundary: 'Placed by the chapter runtime at the end of a chapter, not selected by a content author.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: null,
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  },
  authoring: null
}
