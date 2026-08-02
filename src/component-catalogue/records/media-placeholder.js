// MediaPlaceholder — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about MediaPlaceholder; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'media-placeholder',
  name: 'MediaPlaceholder',
  source: 'src/components/core/MediaPlaceholder.jsx',
  exportName: null,
  order: 17,
  outOfRootReason: null,
  section: 'core',
  kind: 'support',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The governed reserved slot for an image or diagram the author has not yet supplied, so a screen can be composed and reviewed before art exists. With kind="imageReveal" the same slot becomes a slow quadrant-by-quadrant reveal inside one fixed frame, with optional arrows linking opposite quadrants.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      "kind (default 'image'; 'diagram', 'imageReveal')",
      "aspect (default '16:9')",
      'caption',
      "subject (default 'History')"
    ],
    dataShape: 'Image-reveal config: { intro?, interval?, images: { topLeft, topRight, bottomLeft, bottomRight }, alt?, parts?, opposites?, progressText?, finished? }',
    dependencies: [
      'SUBJECTS',
      'RADII',
      'SPACING',
      'TYPE',
      'MOTION'
    ],
    usedBy: [],
    usageBoundary: 'The only approved way to reserve a missing visual. Do not ship an empty box, a grey div or a stand-in stock image instead.',
    contractDoc: null,
    story: 'src/components/core/MediaPlaceholder.stories.jsx',
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
