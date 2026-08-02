// CircuitDiagram — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CircuitDiagram; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'circuit-diagram',
  name: 'CircuitDiagram',
  source: 'src/components/learning/CircuitDiagram.jsx',
  exportName: null,
  order: 33,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Renders a GCSE Physics simple series circuit (battery, wire loop, bulb, switch) as inline SVG primitives — not a static image. Open versus closed is driven by a single closed prop: when closed the switch arm bridges both contacts, an animated cyan current overlay flows around the loop, and the bulb glows warm amber; when open the arm is raised, the current overlay is hidden, and the bulb is dim. Restrained Physics blue/cyan glow only; the moving current animation is disabled under prefers-reduced-motion.',
  ownership: {
    internalDirectories: [
      {
        path: 'src/components/learning/circuit',
        reason: 'Shared SVG circuit primitives and semantic colour roles for the Physics circuit family. Rendered only through CircuitDiagram and CircuitSymbolReference; carries no learning behaviour of its own.'
      }
    ],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'closed (boolean)'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS (Physics palette)',
      'injects animation/glow CSS classes once via an ensureStyles() <style> block (same pattern as GraphView)',
      'circuit/CircuitPrimitives.jsx',
      'circuit/circuitVisualRoles.js'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/CircuitDiagram.stories.jsx',
    governanceRules: [],
    notes: [
      'Guarded by tests/architecture/circuitDiagramGovernance.test.js and tests/architecture/circuitSwitchAffordance.test.js.'
    ]
  },
  decision: {
    status: 'pending',
    useWhen: null,
    doNotUseWhen: null,
    chooseInstead: null,
    contentShape: null,
    rhythmRole: [],
    note: 'The registry entry has never carried a five-field Decision block. Its boundary against a static figure image and against the Maths Explore family is a pedagogical judgement current source, stories and contracts do not settle.'
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}
