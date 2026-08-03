// CinematicCarousel — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CinematicCarousel; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'cinematic-carousel',
  name: 'CinematicCarousel',
  source: 'src/components/learning/CinematicCarousel.jsx',
  exportName: null,
  order: 31,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Full-screen "deep dive" carousel — one large image at a time (objectFit: contain, so any aspect ratio works), with glass prev/next arrow buttons either side. A name and key-facts panel below slides in to match the navigation direction. Progress dots track which items have been viewed; Continue unlocks once every item has been seen at least once.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Browsing a small related set of things in turn, each worth a focused look — e.g. the organelles inside a cell, the planets of the solar system, the stages of a specialised cell. Designed for cinematic single-item focus, not for scanning a large list.',
    props: [
      'block',
      'subject (defaults to Biology)',
      'onContinue'
    ],
    dataShape: "{ type: 'cinematicCarousel', title?, intro?, items: [{ id, image, label, facts: string[] }] }",
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'RADII',
      'usePrefersReducedMotion'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/CinematicCarousel.stories.jsx',
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner needs to explore a small related collection in which every item deserves its own image, name and focused set of facts. Choose it when viewing each item separately helps the learner notice or understand its individual features.',
    doNotUseWhen: 'The items form a chronological or causal sequence, require direct side-by-side comparison, belong in assessed categories or could be understood more clearly when displayed together. Do not use it for one concept, one important person, a large catalogue or a general list of facts with decorative images.',
    chooseInstead: 'Use TimelineChain when order or causal progression matters. Use TheoryCompare when two items need developed parallel comparison. Use KeyFigureReveal when one important person requires deeper treatment. Use InteractiveHotspotImage when the information concerns different parts of one shared image or object. Use Infographic when the learner benefits from seeing the complete system or dataset together. Use ColSortBlock or SwipeSort when the learner must categorise the items themselves.',
    contentShape: 'Usually three to six clearly related and visually distinct items. Every item needs one meaningful image, one concise label and a small number of focused facts. All items should answer the same broad learning question, but each must contribute something different. The order should not carry essential chronological or causal meaning. Avoid long paragraphs, repeated facts and items included only to increase the set size.',
    rhythmRole: [
      'teaching',
      'exploration'
    ],
    note: null
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  },
  authoring: {
    entries: [
      {
        type: 'cinematicCarousel',
        level: 'screen',
        authoringName: 'Cinematic carousel',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'items',
            kind: 'array'
          }
        ],
        requiredAny: [],
        continuation: 'component',
        headerMode: 'standard',
        handler: null
      }
    ]
  }
}
