// InlineNavigationContext — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about InlineNavigationContext; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'inline-navigation-context',
  name: 'InlineNavigationContext',
  source: 'src/components/core/InlineNavigationContext.jsx',
  exportName: null,
  order: 16,
  outOfRootReason: null,
  section: 'core',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Lets a learning component running a progressive reveal inside ContentShell own the only visible Continue CTA. ContentShell provides the bridge to the chapter-level navigation action.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'exports InlineNavigationContext (React context)',
      'exports useInlineNavigationOwner(active) → the chapter continue handler while claimed'
    ],
    dataShape: null,
    dependencies: [
      'React context only'
    ],
    usedBy: [
      'ContentShell',
      'TheoryCompare',
      'OppositeQualitiesReveal'
    ],
    usageBoundary: 'The sanctioned alternative to reaching into the DOM for the shell’s Continue button. Components must never query or mutate shell DOM directly.',
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
