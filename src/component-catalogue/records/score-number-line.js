// ScoreNumberLine — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ScoreNumberLine; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'score-number-line',
  name: 'ScoreNumberLine',
  source: 'src/components/core/ScoreNumberLine.jsx',
  exportName: null,
  order: 19,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Draggable and tappable number line for choosing a mark out of a small range. Keyboard and pointer accessible.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'value',
      'max (default 8)',
      'min (default 0)',
      'onChange',
      'accent',
      "label (default 'Score')",
      'disabled'
    ],
    dataShape: null,
    dependencies: [
      'GENERAL',
      'RADII',
      'TYPE'
    ],
    usedBy: [
      'FaceTheExaminer (faceTheExaminer/MarkingPanel.jsx)',
      'Component Lab'
    ],
    usageBoundary: 'Awarding a mark. Not a general-purpose slider, rating or confidence control — self-reported confidence is not evidence in this product.',
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
