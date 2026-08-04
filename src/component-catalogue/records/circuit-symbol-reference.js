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
  lifecycleReason: "Routed for chapter authoring in Phase 4 as block:circuitSymbolReference; the component itself is still under review, which is what keeps this lifecycle at reviewing.",
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
    dataShape: "{ type: 'circuitSymbolReference', title?, description? } — the board is complete in itself, so it requires no authored data. Both fields have component defaults and override the heading and standfirst only.",
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
  authoring: {
    entries: [
      {
        // Its own public authoring type, not a mode of an invented figure
        // router. Authors write the type they mean;
        // it is a read-only board, so it carries no required data and no
        // interaction.
        type: 'circuitSymbolReference',
        level: 'block',
        authoringName: 'Circuit symbol reference',
        layout: 'content',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'player',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'teach-mechanism'
          ],
          interaction: 'passive'
        }
      }
    ]
  }
}
