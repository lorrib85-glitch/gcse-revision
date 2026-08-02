// ContentShell — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ContentShell; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'content-shell',
  name: 'ContentShell',
  source: 'src/components/layout/ContentShell.jsx',
  exportName: null,
  order: 67,
  outOfRootReason: null,
  section: 'layout',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The default scrolling content surface for a chapter screen. Provides the subject background, optional background image, safe-area and header clearance, scoped typography as a safety net for raw h1/h2/h3/p, and the inline-navigation bridge that lets a component own the visible Continue CTA.',
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
      "header ('learning' clears the fixed 80px LearningHeader; 'none' applies safe-area only)",
      'children'
    ],
    dataShape: null,
    dependencies: [
      'SPACING',
      'SUBJECTS',
      'InlineNavigationContext'
    ],
    usedBy: [
      'ChapterPlayer',
      'CentreImageReveal',
      'Component Lab'
    ],
    usageBoundary: 'The default shell. Prefer ScreenText primitives over raw tags inside it — the scoped CSS is a net, not the design. It provides InlineNavigationContext; components claim it through useInlineNavigationOwner() rather than touching shell DOM.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'The three shells define where a screen’s content lives. They are structural infrastructure, not authoring choices: an author picks a learning component, and the component picks its shell. Full rules — including where TeachScreenShell sits inside ContentShell — are in docs/system/SCREEN_SHELL_SYSTEM.md.'
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
