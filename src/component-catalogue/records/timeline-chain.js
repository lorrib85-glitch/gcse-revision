// TimelineChain — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about TimelineChain; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'timeline-chain',
  name: 'TimelineChain',
  source: 'src/components/learning/TimelineChain.jsx',
  exportName: null,
  order: 62,
  outOfRootReason: null,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'Full-screen sequence component with two variants. interactive (default) — a horizontal scroll-snap chain of flip cards connected by a connector rail (line segments plus a dot per card). reveal — a passive vertical sequence that reveals one step at a time behind a "Reveal next" CTA, absorbing the behaviour of the former VisualNarrativeScreen.',
  ownership: {
    internalDirectories: [],
    internalFiles: [
      {
        path: 'src/components/learning/TimelineChainIcons.jsx',
        reason: 'The icon set for TimelineChain markers. Imported only by TimelineChain; it carries no learning behaviour of its own and is never placed directly.'
      }
    ]
  },
  documentation: {
    bestUsedFor: 'Interactive: a chapter’s "big idea" causal sequence the learner explores at will (e.g. how the Black Death spread) — card fronts show a short step label, tapping flips a card to reveal why that step mattered, and Continue only appears once every card has been flipped. Reveal: a short cause→effect narrative delivered one calm statement at a time (e.g. "bad air → sweeten the air → the real cause was microbes") — each press reveals one more step, the standard ContinueCTA replaces "Reveal next" once all steps show, and an optional accent takeaway closes it.',
    props: [
      'block',
      'subject (defaults to History)',
      'onContinue',
      "variant ('interactive' | 'reveal'; falls back to block.variant, then 'interactive')"
    ],
    dataShape: "Interactive: { type: 'timelineChain', title, intro?, steps: [{ id?, icon?, image?, label, detail }] }. Reveal: { type: 'timelineChain', variant: 'reveal', title?, intro?, source?, steps: [{ id?, icon?, statement, detail? }], takeaway? } — statement/detail/takeaway accept a plain string or an array of { text, highlight? } segments for inline subject-accent highlighting. statement (not label) is the primary field so full-sentence copy is not scanned by the sentence-case heading guard.",
    dependencies: [
      'SUBJECTS',
      'SPACING',
      'MOTION',
      'RADII',
      'ContinueCTA',
      'timelineChainReveal.js (pure reveal logic)',
      'TimelineChainIcons.jsx'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/TimelineChain.stories.jsx',
    governanceRules: [],
    notes: [
      `VisualNarrativeScreen is retired and must not be recreated, restored, registered, refined or locked. Its progressive numbered-reveal behaviour is owned solely by this component’s reveal variant. New progressive narrative or statement-sequence screens must use the reveal variant; interactive ordering and causal-chain screens continue to use the default interactive variant. Legacy type: 'visualNarrative' lesson data is supported only through src/data/visualNarrativeCompat.js, which is migration-only compatibility code — never author new content as visualNarrative, and never build new features on the compat mapper. Any older per-module architecture or planning doc that still lists VisualNarrativeScreen under "suggested components" is superseded by this rule.`
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'The learner needs to understand or explore a meaningful sequence of distinct events, stages or developments where the order or causal connection matters. Use the interactive variant when each stage is worth exploring individually. Use the reveal variant for a shorter, calmer narrative that unfolds one linked statement at a time.',
    doNotUseWhen: 'The content is merely a list of related facts, the order can be changed without affecting the meaning or the main learning job is comparison, categorisation or relative importance. Do not use it to test whether the learner knows the order.',
    chooseInstead: 'Use ExplainReveal when the main learning is the reasoning that connects a short cause → mechanism → consequence chain. Use OrderedRouteTask when the sequence has already been taught and should now be assessed. Use TimelineCanvas only when an important sequence benefits from a deliberately different, spatial exploration rhythm. Use TheoryCompare when two sides need parallel comparison rather than sequential explanation.',
    contentShape: 'A clear chronological, causal or procedural sequence of distinct stages. Each stage needs a short identifying label or statement and a concise explanation of why it matters. Usually use three to seven stages. Every stage must earn its place in the chain and the sequence should lead towards a clear outcome or takeaway. For the interactive variant, each stage should make sense as an individually explored card. For the reveal variant, each statement should flow naturally into the next and form one calm narrative.',
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
  }
}
