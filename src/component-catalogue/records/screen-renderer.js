// ScreenRenderer — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ScreenRenderer; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'screen-renderer',
  name: 'ScreenRenderer',
  source: 'src/components/layout/ScreenRenderer.jsx',
  exportName: null,
  order: 72,
  section: 'layout',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The sole runtime boundary mapping registered screen and block types to approved components. FULL_SCREEN_RENDERER_TYPES and BLOCK_RENDERER_TYPES are proved equal to the active entries of SCREEN_REGISTRY / BLOCK_REGISTRY by tests/architecture/screen-registry.test.js.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'screen',
      'chapter',
      'chapterNum',
      'subject',
      'plus the runtime callbacks ChapterPlayer supplies'
    ],
    dataShape: null,
    dependencies: [
      'src/data/screenRegistry.js',
      'every routed learning and feedback component'
    ],
    usedBy: [],
    usageBoundary: 'Not an authoring choice. Authors select entries from screenRegistry.js, never ScreenRenderer directly.',
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
