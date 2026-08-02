// InteractionShell — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about InteractionShell; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'interaction-shell',
  name: 'InteractionShell',
  source: 'src/components/layout/InteractionShell.jsx',
  exportName: null,
  order: 68,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'layout',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Fixed, non-scrolling shell for an interaction engine that owns its whole screen and manages its own internal layout and progression.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'subject',
      'backgroundImage (default null)',
      'backgroundOpacity (default 0.13)',
      "backgroundPosition (default 'center')",
      'children'
    ],
    dataShape: null,
    dependencies: [
      'SPACING',
      'SUBJECTS'
    ],
    usedBy: [
      'FactorWeb',
      'CalculationBreakdown',
      'CinematicCarousel',
      'GuidedChoiceCarousel'
    ],
    usageBoundary: 'Use when the interaction must not scroll and the component owns its own progression (Route B). If the content scrolls, use ContentShell instead.',
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
