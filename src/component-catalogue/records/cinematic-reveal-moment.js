// CinematicRevealMoment — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CinematicRevealMoment; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'cinematic-reveal-moment',
  name: 'CinematicRevealMoment',
  source: 'src/components/learning/CinematicRevealMoment.jsx',
  exportName: null,
  order: 32,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Full-screen cinematic video or image reveal moment. Atmospheric, single-focus, high-emotion screen.',
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
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: []
  },
  decision: {
    status: 'complete',
    useWhen: 'One powerful image or video can create emotional weight, surprise, tension or a sense of significance that prepares the learner for the teaching that follows. Choose it for a genuine reveal or turning point, not simply because suitable media exists.',
    doNotUseWhen: 'The learner needs detailed explanation, several facts, a person profile, a visual collection or an interaction that checks understanding. Do not use it as a substitute for teaching, as a generic chapter title screen or merely to make the chapter feel more cinematic.',
    chooseInstead: 'Use ConceptReveal when one new idea needs a clear conceptual introduction. Use KeyFigureReveal when the learner must understand an important person and their contribution. Use CinematicCarousel when several related images or objects need individual exploration. Use InteractiveHotspotImage when the learner should inspect meaningful locations within one image. Use a normal teaching component when the media does not materially improve understanding or emotional engagement.',
    contentShape: 'One exceptional image or video, one concise framing line and, where needed, one short impact statement. Text must remain minimal so the media retains focus. The next screen must explain, explore or apply why the moment matters; the cinematic reveal must not be left as an isolated spectacle.',
    rhythmRole: [
      'opening'
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
        type: 'cinematic',
        level: 'screen',
        authoringName: 'Cinematic reveal moment',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [
          [
            {
              path: 'videoSrc',
              kind: 'string'
            },
            {
              path: 'fallbackImage',
              kind: 'string'
            }
          ]
        ],
        continuation: 'component',
        headerMode: 'cinematic',
        handler: null,
        pedagogy: {
          functions: [
            'hook-tension'
          ],
          interaction: 'passive'
        }
      }
    ]
  }
}
