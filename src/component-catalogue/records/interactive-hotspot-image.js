// InteractiveHotspotImage — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about InteractiveHotspotImage; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'interactive-hotspot-image',
  name: 'InteractiveHotspotImage',
  source: 'src/components/learning/InteractiveHotspotImage.jsx',
  exportName: null,
  order: 39,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Full-screen image with tappable hotspots. Two-phase: intro reveal → explore hotspots. Two variants: detail (default — one card of labelled rows per hotspot) and reveal (pages through multiple pieces of information per hotspot via reveals[]). An optional synthesis shows a "collection complete" summary once all hotspots are explored.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'subject',
      'title',
      'introText',
      'image',
      'imageAlt',
      'hotspots',
      'ctaLabel',
      'variant',
      'synthesis',
      'onBack',
      'onEnterExplore',
      'onContinue'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'MOTION'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Absorbed the former InteractiveCollectionExplorer.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner needs to explore several meaningful locations within one shared image, diagram, source or object. Choose it when understanding depends on connecting each piece of information to where it appears physically, such as parts of a cell, features of a building, evidence within a historical source or structures within an organ.',
    doNotUseWhen: 'The information is not genuinely linked to locations in the image, the learner would understand it better by seeing all labels together or the image is merely decorative. Do not use it for a collection of separate objects, a chronological sequence, numerical data or a scored image-identification question.',
    chooseInstead: 'Use Infographic when the learner needs to see the complete labelled system or summary together. Use VisualLearning when several full-screen visual scenes should build a guided explanation in a fixed order. Use CinematicCarousel when several separate items each deserve individual visual focus. Use GraphView when the visual information is numerical. Pair the image with an assessed question component when the learner must give a right or wrong answer rather than simply explore.',
    contentShape: 'One clear, high-quality image with usually three to six meaningful hotspots. Every hotspot must be attached to a defensible physical location and reveal information that is specifically relevant to that location. Each hotspot should have a concise title and either a small set of clearly labelled detail rows or a short progressive series of reveals. Hotspots must not overlap so closely that they are difficult to select on mobile. Avoid arbitrary dot placement, long paragraphs, hidden trivia and information that could be moved to another location without changing its meaning. Use the optional synthesis only when exploring all hotspots leads to a useful overall conclusion.',
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
        type: 'interactiveImage',
        level: 'screen',
        authoringName: 'Interactive hotspot image',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'image',
            kind: 'string'
          },
          {
            path: 'hotspots',
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
