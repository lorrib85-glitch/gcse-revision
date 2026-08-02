// CinematicShell — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CinematicShell; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'cinematic-shell',
  name: 'CinematicShell',
  source: 'src/components/layout/CinematicShell.jsx',
  exportName: null,
  order: 69,
  section: 'layout',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Minimal full-viewport fixed container (100dvh, overflow and overscroll locked) for full-screen cinematic moments.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'children',
      'style',
      'plus any DOM props (spread onto the container)'
    ],
    dataShape: null,
    dependencies: [],
    usedBy: [
      '16 components, including ChapterHookScreen, ChapterOutcomeScreen, ChapterCompleteScreen, ConceptReveal, TimelineCanvas, KeyFigureReveal'
    ],
    usageBoundary: 'The most restricted shell. Using it requires a comment in the consuming component explaining why ContentShell or InteractionShell cannot be used — that requirement is stated in the file itself. It supplies no background, padding or safe-area handling; the component owns all of that.',
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
