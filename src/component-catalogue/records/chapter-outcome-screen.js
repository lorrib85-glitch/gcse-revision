// ChapterOutcomeScreen — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ChapterOutcomeScreen; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'chapter-outcome-screen',
  name: 'ChapterOutcomeScreen',
  source: 'src/components/layout/ChapterOutcomeScreen.jsx',
  exportName: null,
  order: 66,
  section: 'layout',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Chapter outcome reveal screen. Shows learner performance with cinematic context.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'subject',
      'chapterTitle',
      'onContinue',
      'onBack'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'CinematicShell'
    ],
    usedBy: [],
    usageBoundary: 'Placed by the chapter runtime, not selected by a content author.',
    contractDoc: null,
    story: 'src/components/layout/ChapterOutcomeScreen.stories.jsx',
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
  }
}
