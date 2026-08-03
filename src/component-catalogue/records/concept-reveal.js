// ConceptReveal — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ConceptReveal; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'concept-reveal',
  name: 'ConceptReveal',
  source: 'src/components/learning/ConceptReveal.jsx',
  exportName: null,
  order: 34,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Concept introduction with atmospheric reveal. Introduces a new idea cinematically before quiz questions.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'block',
      'subject',
      'onContinue',
      'onBack'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'MOTION',
      'CinematicContinueCTA'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: 'docs/system/CONCEPT_REVEAL_CONTRACT.md',
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner needs a clear, memorable introduction to one important new concept before its details, examples or applications are developed. Choose it when the next section depends on the learner first grasping a single central idea.',
    doNotUseWhen: 'The content concerns a specific person, several related items, a sequence of connected stages or a dramatic image that carries the emotional meaning by itself. Do not use it as a decorative title screen or repeat it every time a new subtopic begins.',
    chooseInstead: 'Use KeyFigureReveal when one important person and their contribution need to anchor the learning. Use CinematicRevealMoment when one image or video should create emotional significance before the teaching begins. Use CinematicCarousel when several related items each deserve individual visual focus. Use ExplainReveal when the learner needs to understand how several linked ideas lead from one to the next. Use a standard teaching screen when the idea does not need a distinct conceptual reveal.',
    contentShape: 'One central concept expressed through a clear headline, a short framing explanation and one strong takeaway. Supporting visual material should strengthen the concept rather than merely decorate it. Avoid multiple competing ideas, detailed evidence, long paragraphs and lists of loosely related facts.',
    rhythmRole: [
      'opening',
      'teaching'
    ],
    note: null
  },
  contract: {
    criticality: 'critical',
    rationale: 'Its reveal choreography is a written contract, not an implementation detail: the eyebrow, CTA gating and progress rules were each fixed after a specific regression, and each is easy to reintroduce while the screen still looks correct.',
    invariants: [
      {
        id: 'eyebrow-hidden-by-default',
        statement: 'Eyebrows stay hidden unless a step explicitly requests one (showEyebrow === true).',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/concept-reveal-contract.test.js'
          }
        ]
      },
      {
        id: 'final-cinematic-continue-only',
        statement: 'Exactly one CinematicContinueCTA is rendered, and only on the final step, after the step gate.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/concept-reveal-contract.test.js'
          }
        ]
      },
      {
        id: 'no-local-progress-dots',
        statement: 'It renders no custom local progress dots and no text-only "tap to continue" hint.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/concept-reveal-contract.test.js'
          }
        ]
      },
      {
        id: 'background-taps-stay-in-screen',
        statement: 'A background tap advances the internal step sequence and never calls onContinue; only the final CTA leaves the screen.',
        evidence: [
          {
            kind: 'test',
            reference: 'tests/architecture/concept-reveal-contract.test.js'
          }
        ]
      }
    ],
    exclusivity: null,
    requiresProductDecision: [
      'Changing the reveal choreography documented in docs/system/CONCEPT_REVEAL_CONTRACT.md',
      'Adding a local progress indicator or a second progression affordance'
    ]
  },
  authoring: {
    entries: [
      {
        type: 'conceptReveal',
        level: 'screen',
        authoringName: 'Concept reveal',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [
          {
            path: 'steps',
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
