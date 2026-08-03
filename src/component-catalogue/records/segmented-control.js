// SegmentedControl — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about SegmentedControl; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'segmented-control',
  name: 'SegmentedControl',
  source: 'src/components/core/SegmentedControl.jsx',
  exportName: null,
  order: 21,
  outOfRootReason: null,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Shared two-or-more option switcher for stable, mutually exclusive views, with roving focus. Disabled options stay visible so the learner can see the sequence without being able to skip it.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'options ([{ value, label, disabled? }])',
      'value',
      'onChange',
      'accent',
      "ariaLabel (default 'Choose a view')",
      "variant ('segmented' | 'tabs', default 'segmented')"
    ],
    dataShape: null,
    dependencies: [
      'GENERAL',
      'RADII',
      'TYPE'
    ],
    usedBy: [
      'FaceTheExaminer (faceTheExaminer/FaceTheExaminerMain.jsx)'
    ],
    usageBoundary: 'Switching between views of the same material. Not an answer control — answers go through AnswerInteraction.',
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
