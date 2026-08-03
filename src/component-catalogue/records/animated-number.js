// AnimatedNumber — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about AnimatedNumber; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'animated-number',
  name: 'AnimatedNumber',
  source: 'src/components/core/AnimatedNumber.jsx',
  exportName: null,
  order: 12,
  outOfRootReason: null,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Counts a numeric display up from 0 to value on first scroll into view. Respects prefers-reduced-motion by rendering the final value immediately.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'value',
      'duration (ms, default 1400)'
    ],
    dataShape: null,
    dependencies: [
      'none beyond React; IntersectionObserver, requestAnimationFrame'
    ],
    usedBy: [
      'QuickFireMode'
    ],
    usageBoundary: 'Score and stat reveals only. Do not animate a number the learner must read and act on immediately.',
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
