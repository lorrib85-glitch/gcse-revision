// TeachScreenShell — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about TeachScreenShell; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'teach-screen-shell',
  name: 'TeachScreenShell',
  source: 'src/components/core/TeachScreenShell.jsx',
  exportName: null,
  order: 22,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Composes a teaching screen with the approved vertical rhythm, so spacing stops being a per-session judgement call. Slots render in a fixed order — eyebrow → heading → intro → body → memoryHook — with token-driven gaps and a calm entrance.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'heading (required, sentence case)',
      'eyebrow (only when it adds information the heading lacks)',
      'intro',
      'children (the teaching body, at most one visual)',
      'memoryHook',
      "subject (default 'History')"
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'TYPE',
      'HEADING_LAYOUT'
    ],
    usedBy: [],
    usageBoundary: 'This is Route A, the default composition route for new teaching and explanation screens. It owns the screen heading (TYPE.displayScreen) and the vertical rhythm; neither may be overridden locally. It is a composition primitive, not a universal wrapper — do not use it to wrap cinematic/full-screen (Route C) components, interaction engines that own their own screen (Route B), another shell, or another TeachScreenShell.',
    contractDoc: 'docs/system/component-contracts/teach-screen-shell.md',
    story: 'src/components/core/TeachScreenShell.stories.jsx',
    governanceRules: [],
    notes: [
      'Sits inside ContentShell — see docs/system/SCREEN_SHELL_SYSTEM.md.',
      'Governed by docs/system/PATTERN_GOVERNANCE.md.'
    ]
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
