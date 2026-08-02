// HomeAtmosphere — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about HomeAtmosphere; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'home-atmosphere',
  name: 'HomeAtmosphere',
  source: 'src/features/home/Home.jsx',
  exportName: 'HomeAtmosphere',
  order: 84,
  section: 'feature',
  kind: 'feature',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The three drifting teal SVG wave bands and the constellation network rendered in the 34vh hero section of the Home tab. It is the first thing a learner sees on opening the app.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [],
    dataShape: null,
    dependencies: [],
    usedBy: [
      'Home (src/features/home/Home.jsx)'
    ],
    usageBoundary: 'A governed standalone component that lives outside src/components/**. It is catalogued because current live governance already treats it as one; ordinary feature screens are not catalogued.',
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'not-applicable',
    useWhen: null,
    doNotUseWhen: null,
    chooseInstead: null,
    contentShape: null,
    rhythmRole: [],
    note: 'An author never selects it against a learning component — it is app chrome owned by the Home tab.'
  },
  contract: {
    criticality: 'critical',
    rationale: 'It is the first thing a learner sees on opening the app and it carries the product’s "premium streaming platform, not a school VLE" identity. It has been repeatedly at risk of being removed as decorative, which is exactly the change that would be hardest to notice in review.',
    invariants: [
      {
        id: 'component-and-call-site-survive',
        statement: 'Neither the component nor its `<HomeAtmosphere />` call site inside Home may be removed or renamed.',
        evidence: [
          {
            kind: 'review',
            reference: 'Confirm Home.jsx still defines HomeAtmosphere and still renders the `<HomeAtmosphere />` call site in the hero section.'
          }
        ]
      },
      {
        id: 'wave-and-constellation-structure',
        statement: 'The three drifting SVG wave bands, their gradients and their animation structure, plus the constellation network, stay as they are.',
        evidence: [
          {
            kind: 'review',
            reference: 'Compare the rendered Home hero against the current app before approving any SVG or keyframe change.'
          }
        ]
      }
    ],
    exclusivity: null,
    requiresProductDecision: [
      'Removing or renaming the component, or removing its call site in Home',
      'Altering the wave, gradient or animation structure'
    ]
  }
}
