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
  lifecycle: 'active',
  lifecycleReason: 'Reviewed as the passive Physics representation-reference block routed for chapter authoring as block:circuitSymbolReference.',
  purpose: 'A passive Physics reference board that builds representation fluency by pairing each governed GCSE circuit symbol with its accepted label. It draws from the shared circuit/CircuitPrimitives.jsx set so the symbols match those used in live CircuitDiagram figures exactly. The symbol shape is the exam convention; colour is only used to show state inside interactive diagrams.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Introducing or refreshing the standard circuit-symbol vocabulary immediately before learners interpret or draw circuit diagrams. It is especially useful as a just-in-time reference when symbol recognition is the blocking foundation.',
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
    usageBoundary: 'Physics-only passive reference. Viewing the board is exposure, not evidence of unaided recognition or accurate drawing; do not log completion as mastery. Pair it with an assessed circuit task when progress evidence is needed.',
    contractDoc: null,
    story: null,
    governanceRules: [
      'Treat completion as exposure only: CircuitSymbolReference must not write a correct result or mastery signal to the weakness tracker.',
      'Keep symbol shapes and labels aligned with the shared circuit primitives and accepted exam convention. Colour must not become a second code for symbol identity.'
    ],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner needs to learn, compare or quickly reorient to several standard circuit symbols as one visual vocabulary before interpreting or drawing a circuit. Choose it for first teaching or a just-in-time refresher when symbol recognition is the blocking foundation.',
    doNotUseWhen: 'The learner needs to prove unaided recall, draw a circuit from a description, explain current, voltage or component behaviour, or inspect how components connect in a complete circuit. Do not use it as a decorative poster or as a replacement for practice.',
    chooseInstead: 'Use CircuitDiagram when the learner needs to understand connections or how a complete circuit changes state. Use a standard teaching block when only one symbol needs explanation in context. Use ExamQuestionFrame or another suitable assessed question component when the learner must draw or interpret a circuit for marks.',
    contentShape: 'One fixed, mobile-legible board of the governed circuit-symbol set, with every conventional symbol paired with its accepted name. Authors may override only the short title and standfirst; they do not supply subsets, extra meanings, questions, procedures or colour-coded categories inside this component.',
    rhythmRole: [
      'teaching',
      'repair'
    ],
    note: null
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
