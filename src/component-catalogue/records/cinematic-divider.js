// CinematicDivider — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CinematicDivider; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'cinematic-divider',
  name: 'CinematicDivider',
  source: 'src/components/core/CinematicDivider.jsx',
  exportName: null,
  order: 13,
  outOfRootReason: null,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Decorative line–diamond–line separator for cinematic and editorial screens. Owns the motif, the governed line colour and the subject-accent treatment; the caller owns placement via style.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'accent (default GENERAL.teal)',
      'accentRgb',
      "size ('compact' | 'standard' | 'wide', default 'standard')",
      'style'
    ],
    dataShape: null,
    dependencies: [
      'GENERAL',
      'hexToRgb'
    ],
    usedBy: [
      'QuoteAnalyser',
      'TheoryCompare',
      'Component Lab'
    ],
    usageBoundary: 'Presentation only, aria-hidden. Do not build a second inline divider motif; extend the size scale instead.',
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
