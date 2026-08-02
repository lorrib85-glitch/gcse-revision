// CircularTimer — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CircularTimer; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'circular-timer',
  name: 'CircularTimer',
  source: 'src/components/core/CircularTimer.jsx',
  exportName: null,
  order: 14,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Circular countdown ring with a centred value and label. Display only — the caller owns the countdown.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'seconds',
      'totalSeconds',
      'size (default 84)',
      'stroke (default 4)',
      "label (default 'SEC')",
      'color',
      'trackColor',
      'displayValue',
      'valueStyle',
      'labelStyle',
      'ariaLabel'
    ],
    dataShape: null,
    dependencies: [
      'GENERAL',
      'MOTION'
    ],
    usedBy: [
      'PriorKnowledgeRecall',
      'QuickFireQuestionScreen (via the QuickFire re-export)',
      'Component Lab'
    ],
    usageBoundary: 'Timed flows only (QuickFire, timed recall). Never add a timer to an untimed learning screen — see the cognitive load law in CLAUDE.md.',
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
