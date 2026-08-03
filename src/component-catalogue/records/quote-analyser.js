// QuoteAnalyser — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about QuoteAnalyser; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'quote-analyser',
  name: 'QuoteAnalyser',
  source: 'src/components/learning/QuoteAnalyser.jsx',
  exportName: null,
  order: 75,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Full-screen quote analysis screen with a cinematic hero quote section (animated word-by-word reveal, optional background image), a ripped-seam SVG divider, and five tappable analysis item cards. Each card expands to a full-screen overlay; Continue only unlocks once all five items have been seen.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'English Literature close reading — any play, poem or novel extract where the learner needs to explore word choice, connotations, literary methods, interpretations and essay construction from a single quotation.',
    props: [
      'block',
      "subject (defaults to 'English')",
      'onContinue'
    ],
    dataShape: "{ type: 'quoteAnalyser', quote: string, location: string, backgroundImage?: string, items: [{ id, icon: 'search'|'feather'|'mask'|'bulb'|'flame', heading, explainer, content: { title?, body, keyWords?: string[] } }] }",
    dependencies: [
      'SUBJECTS',
      'RADII',
      'TYPE',
      'ContinueCTA',
      'CinematicDivider',
      'usePrefersReducedMotion'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/QuoteAnalyser.stories.jsx',
    governanceRules: [],
    notes: [
      'Animation: word-by-word quote reveal via staggered opacity transitions; card entrance via the qa-card-in CSS keyframe; seen-tick pop via qa-tick-pop; expanded overlay via qa-slide-up.'
    ]
  },
  decision: {
    status: 'pending',
    useWhen: null,
    doNotUseWhen: null,
    chooseInstead: null,
    contentShape: null,
    rhythmRole: [],
    note: 'The registry entry has never carried a five-field Decision block. Its boundary against the general teaching and reveal components is a pedagogical judgement current source, stories and contracts do not settle.'
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
        type: 'quoteAnalyser',
        level: 'screen',
        authoringName: 'Quote analyser',
        layout: 'full',
        status: 'active',
        replacement: null,
        required: [],
        requiredAny: [],
        continuation: 'component',
        headerMode: 'standard',
        handler: null,
        pedagogy: {
          functions: [
            'teach-mechanism'
          ],
          interaction: 'reveal'
        }
      }
    ]
  }
}
