// TheoryCompare — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about TheoryCompare; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'theory-compare',
  name: 'TheoryCompare',
  source: 'src/components/learning/TheoryCompare.jsx',
  exportName: null,
  order: 59,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: "Side-by-side comparison of any two approaches, people or theories. Two labelled sides kept as compact headers with a central division; one comparison theme revealed at a time; a full-width teaching explanation beneath the columns where needed; example rows within a theme; a single closing takeaway. emphasisSide gives one side restrained subject-accent emphasis; 'none' keeps both sides visually equal for a neutral concept comparison. All colour derives from the subject accent token — content data carries no raw colours. Teaching-first and unassessed: never a disguised quiz, and no right/wrong judgement.",
  ownership: {
    internalDirectories: [],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'block',
      'subject',
      'onComplete?'
    ],
    dataShape: "{ type: 'theoryCompare', title?, emphasisSide? ('left' | 'right' | 'none', default 'none'), heroImage?, heroImageAlt?, leftPerson: { name, subtitle?, image?, imageAlt? }, rightPerson: { name, subtitle?, image?, imageAlt? }, comparisons: [{ id, prompt?, left, right, explanation?, emphasisSide? } | { id, prompt?, rows: [{ label, left, right }], note?, explanation?, emphasisSide? }], takeaway? }",
    dependencies: [
      'SUBJECTS',
      'TYPE',
      'SPACING',
      'RADII',
      'MOTION',
      'ContinueCTA',
      'InlineNavigationContext',
      'CinematicDivider'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/TheoryCompare.stories.jsx',
    governanceRules: [],
    notes: [
      'Reveal logic lives in src/components/learning/theoryCompare.js (pure).',
      'Portraits are optional. Supply image/imageAlt per side (and/or a heroImage) for a person-to-person comparison; when none are supplied the two portrait boxes render empty, ready for images to be added in future, and the labelled sides carry the comparison on their own.',
      'Accessibility expectations: portraits carry meaningful imageAlt; each comparison cell exposes its person’s name to screen readers via a visually-hidden prefix so the relationship survives colour- and position-only cues; progression uses the governed ContinueCTA (keyboard-operable, visible focus); focus moves to the takeaway when it reveals; motion respects prefers-reduced-motion; DOM reading order is prompt → left → right → explanation.',
      'Galen / Vesalius example (Episode 3, "The beginning of doubt"): compares Galen (animal dissection) and Vesalius (human dissection) across method, evidence-building, anatomical conclusions (jaw, ribs, breastbone) and impact, closing on "Vesalius did not prove that everything Galen believed was wrong. He proved that old ideas should be checked against evidence."'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'Two approaches, people or models need developed parallel comparison.',
    doNotUseWhen: 'Isolated words or short examples are simply placed into opposing groups.',
    chooseInstead: 'Use OppositeQualitiesReveal for short examples being visually organised into two simple opposing groups. Use ColSortBlock or SwipeSort when the learner must classify items themselves. Use TimelineChain when the relationship is sequential or causal. Use FactorWeb when several plausible factors must be explored and weighed for relative importance.',
    contentShape: 'Two labelled sides, one comparison theme revealed at a time as short parallel phrases, with a full-width explanation carrying any developed reasoning, closing on one takeaway; a person-to-person comparison must keep both sides historically fair.',
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
