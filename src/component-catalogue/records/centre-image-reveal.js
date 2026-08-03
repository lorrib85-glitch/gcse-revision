// CentreImageReveal — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CentreImageReveal; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'centre-image-reveal',
  name: 'CentreImageReveal',
  source: 'src/components/learning/CentreImageReveal.jsx',
  exportName: null,
  order: 53,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Three-phase cause → prescription → reveal flow. The learner selects a theory, fills inputs on a parchment surface (fuzzy-match validated), then sees correct treatments revealed. It personalises the heading if a selectedHealer prop is passed from GuidedChoiceCarousel. Its select phase opens with the MedievalDiagnosisScene hero.',
  ownership: {
    internalDirectories: [],
    internalFiles: [
      {
        path: 'src/components/learning/MedievalDiagnosisScene.jsx',
        reason: 'The Medicine-specific SVG hero for the CentreImageReveal select phase. It introduces Thomas and the four explanation zones and mirrors its parent’s belief-selection state; explicitly not a standalone learning beat or authoring choice.'
      }
    ]
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'screen',
      'selectedHealer',
      'onComplete'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'TYPE',
      'MedievalDiagnosisScene'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Renamed from MedicalTheoryPrescription; internals unchanged.'
    ]
  },
  decision: {
    status: 'pending',
    useWhen: null,
    doNotUseWhen: null,
    chooseInstead: null,
    contentShape: null,
    rhythmRole: [],
    note: 'The registry entry has never carried a five-field Decision block. Its boundary against the other selection-and-reveal components is a pedagogical judgement current source, stories and contracts do not settle.'
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
        type: 'centreImageReveal',
        level: 'screen',
        authoringName: 'Centre image reveal',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'component',
        headerMode: 'standard',
        handler: null
      }
    ]
  }
}
