// ProgressRecoveryCard — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ProgressRecoveryCard; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'progress-recovery-card',
  name: 'ProgressRecoveryCard',
  source: 'src/components/core/ProgressRecoveryCard.jsx',
  exportName: null,
  order: 18,
  outOfRootReason: null,
  section: 'core',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Shown once, before the login screen, when earlier progress is found on this device that cannot be confirmed as the current learner’s (quarantined legacy data — see accountScope.js). It reveals nothing about the previous learner: no name, scores or subjects, only that some earlier progress exists. The learner chooses "Use this progress" or "Start fresh"; nothing is deleted either way.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'onUse',
      'onStartFresh',
      'busy (default false)'
    ],
    dataShape: null,
    dependencies: [
      'GENERAL',
      'TYPE',
      'SPACING',
      'RADII'
    ],
    usedBy: [],
    usageBoundary: 'Mounted once by LegacyApp in the auth flow. Never rendered inside a chapter. No technical wording ("migration", "namespace", "storage", "legacy") may reach the learner.',
    contractDoc: null,
    story: 'src/components/core/ProgressRecoveryCard.stories.jsx',
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
