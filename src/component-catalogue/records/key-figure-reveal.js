// KeyFigureReveal — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about KeyFigureReveal; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'key-figure-reveal',
  name: 'KeyFigureReveal',
  source: 'src/components/learning/KeyFigureReveal.jsx',
  exportName: null,
  order: 41,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A full-screen, portrait-led introduction to one important person. The learner meets the figure through their name and role, then swipes through focused sections covering their ideas, evidence, contribution, significance or impact. Sections may include concise explanation, supporting imagery, a quotation and a takeaway.',
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'block',
      'subject',
      'onComplete'
    ],
    dataShape: null,
    dependencies: [
      'SUBJECTS',
      'TYPE',
      'SPACING',
      'COMPONENT_SIZE',
      'RADII',
      'GENERAL',
      'MOTION',
      'CinematicShell',
      'ContinueCTA',
      'SequenceProgress'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: null,
    governanceRules: [],
    notes: [
      'Opening family rhythm rule — choose one clear opening treatment per learning job: one concept → ConceptReveal; one emotionally significant moment → CinematicRevealMoment; one important person → KeyFigureReveal; one related visual collection → CinematicCarousel. Do not stack these components simply because they are cinematic. After the opening beat, move promptly into explanation, exploration, practice or retrieval. CinematicRevealMoment should be the rarest of the four because it carries the least teaching content by itself. ChapterHookScreen is also tagged cinematic; when used, it fulfils the chapter’s one cinematic-moment requirement.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'One person is important enough to organise the learner’s understanding of the topic, and the learner needs to know who they were, what they contributed and why they mattered. Choose it when the figure is a meaningful conceptual anchor rather than simply a name that appears in the specification.',
    doNotUseWhen: 'The person is a minor factual detail, several people need equal coverage, two people need direct comparison or the main learning is a chronology of events rather than the significance of the individual. Do not use it just because a portrait is available.',
    chooseInstead: 'Use TheoryCompare when two people need developed parallel comparison. Use CinematicCarousel when several people each need a shorter introduction as members of one related set. Use ConceptReveal when the central learning is an idea rather than a person. Use TimelineChain when the important content is a chronological sequence of the person’s work or changing influence. Use a standard teaching screen when only a brief contribution or name needs mentioning.',
    contentShape: 'Exactly one significant figure with a strong, relevant portrait, a clear role or identity line and usually two to four focused sections. Each section should have one distinct job, such as background, key idea, evidence, contribution or impact. Keep the sections concise and finish with a clear statement of why the person matters to the topic. Quotes and supporting images must add evidence or meaning rather than atmosphere alone.',
    rhythmRole: [
      'opening',
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
  },
  authoring: {
    entries: [
      {
        type: 'keyFigureReveal',
        level: 'screen',
        authoringName: 'Key figure reveal',
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
