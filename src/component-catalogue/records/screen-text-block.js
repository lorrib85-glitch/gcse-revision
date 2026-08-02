// ScreenTextBlock — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ScreenTextBlock; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'screen-text-block',
  name: 'ScreenTextBlock',
  source: 'src/components/layout/ScreenTextBlock.jsx',
  exportName: null,
  order: 70,
  outOfRootReason: null,
  section: 'layout',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Small titled text surface with three tones, for a short passage that needs to read as a distinct block within a screen (a source extract, a framing note, a set of instructions).',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'title',
      'children',
      'accent',
      "tone ('default' | 'quiet' | 'card')",
      'inset (default true)',
      'framed (default false)',
      'style',
      'titleStyle',
      'bodyStyle'
    ],
    dataShape: null,
    dependencies: [
      'TYPE',
      'SCREEN_TEXT_LAYOUT'
    ],
    usedBy: [
      'PriorKnowledgeRecall',
      'FaceTheExaminer (faceTheExaminer/FaceTheExaminerMain.jsx)'
    ],
    usageBoundary: 'One short passage inside a screen that already has a heading. Not a screen heading (use ScreenText’s ScreenTitle), and not a way to place a wall of text on a screen.',
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
  }
}
