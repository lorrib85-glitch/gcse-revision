// CircuitSymbolReference — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CircuitSymbolReference; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'circuit-symbol-reference',
  name: 'CircuitSymbolReference',
  source: 'src/components/learning/CircuitSymbolReference.jsx',
  exportName: null,
  order: 83,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'reviewing',
  lifecycleReason: 'Component Lab and Storybook only at present — reached from src/dev/componentReview/reviewManifestCore.jsx and CircuitDiagram.stories.jsx, with no authorable screen type. That is a status, not a defect: it is catalogued so it is not rebuilt, and it stays unrouted until a chapter genuinely needs a symbol reference.',
  purpose: 'A reference sheet of the GCSE Physics circuit symbols, drawn from the shared circuit/CircuitPrimitives.jsx set so the symbols match those used in live CircuitDiagram figures exactly. The symbol shape is the exam convention; colour is only used to show state inside interactive diagrams.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      "title (default 'GCSE circuit symbols')",
      'description'
    ],
    dataShape: null,
    dependencies: [
      'circuit/CircuitPrimitives.jsx',
      'circuit/circuitVisualRoles.js',
      'GENERAL'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'pending',
    useWhen: null,
    doNotUseWhen: null,
    chooseInstead: null,
    contentShape: null,
    rhythmRole: [],
    note: 'Not applicable while unrouted: with no authorable screen type there is no authoring choice to guide. Revisit when a chapter needs a symbol reference.'
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  },
  authoring: null
}
