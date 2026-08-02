// Infographic — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about Infographic; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'infographic',
  name: 'Infographic',
  source: 'src/components/learning/Infographic.jsx',
  exportName: null,
  order: 38,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Canonical screen for a single teaching heading and framing line (owned by the approved TeachScreenShell, Route A) followed by one governed infographic media slot (MediaPlaceholder). Owns no heading typography or screen rhythm of its own — it fixes the standard "title + intro + infographic" composition into one named screen so authoring it has a clear build target. The media slot passes through to MediaPlaceholder, so the infographic can be a reserved diagram slot or a progressive quadrant reveal.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'subject',
      'eyebrow',
      'heading',
      'intro',
      'media ({ kind, aspect, caption })'
    ],
    dataShape: null,
    dependencies: [
      'TeachScreenShell',
      'MediaPlaceholder'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/Infographic.stories.jsx',
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner needs to understand a complete system, structure, relationship or summary through one coherent visual. Choose it when seeing the whole picture together is more useful than exploring separate items or reading several text screens. It may also be used for a short progressive visual reveal when the individual revealed parts combine into one meaningful whole.',
    doNotUseWhen: 'The learner needs to inspect particular locations within the image, move through a sequence of separate scenes, compare two developed sides or interpret numerical data. Do not use it as a poster containing large amounts of tiny text or as a decorative image beneath a heading.',
    chooseInstead: 'Use InteractiveHotspotImage when information belongs to specific locations within one image. Use VisualLearning when understanding should build through a sequence of full-screen visual scenes. Use CinematicCarousel when several independent items require focused exploration. Use GraphView when the visual encodes numerical values, trends, correlation or proportion. Use TimelineChain when order or causal progression is the central learning.',
    contentShape: 'One clear teaching heading, one short framing line and one primary visual asset: a supplied diagram or infographic, a progressive image reveal whose sections combine into one whole, or a short explanatory clip. The asset must perform one clear learning job and remain legible on a mobile screen. Labels, symbols and relationships must be readable without zooming. Avoid dense poster layouts, long explanatory paragraphs inside the image, multiple unrelated diagrams and decorative imagery that adds no understanding.',
    rhythmRole: [
      'teaching'
    ],
    note: null
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}
