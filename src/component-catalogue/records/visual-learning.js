// VisualLearning — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about VisualLearning; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'visual-learning',
  name: 'VisualLearning',
  source: 'src/components/learning/VisualLearning.jsx',
  exportName: null,
  order: 40,
  scope: {
    location: 'components',
    reason: null
  },
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'A full-screen, tap-through sequence of image-led scenes. Each scene pairs one purposeful background image with a concise headline and short explanation; the sequence can end with a larger synthesis reveal. The learner advances through the scenes in a fixed order, with governed local progress and no scored answer.',
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
      'SequenceProgress',
      'SUBJECTS',
      'CinematicShell',
      'TYPE',
      'GENERAL',
      'usePrefersReducedMotion'
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
    useWhen: 'The learner should move through a short, guided sequence of full-screen visual scenes that gradually builds one explanation, narrative or change in understanding. Choose it when each scene adds a new layer and the final scene can synthesise what the learner has just seen. The order should support the intended narrative, but the component is not intended to teach the formal order of named stages.',
    doNotUseWhen: 'All the information belongs to different locations within one image, the items form a non-sequential collection or the order of the stages is itself the knowledge being taught. Do not use it for one isolated dramatic image, text-heavy teaching, free exploration or assessment.',
    chooseInstead: 'Use InteractiveHotspotImage when the learner should inspect different locations within one shared image. Use CinematicCarousel when several related but independent items can be explored individually and in either direction. Use TimelineChain when the identity, order or causal connection of distinct stages is the central learning. Use CinematicRevealMoment when only one powerful visual moment is required. Use ConceptReveal when one idea needs introducing without a multi-scene visual narrative.',
    contentShape: 'Usually three to six full-screen scenes. Each regular scene needs one purposeful background image, one concise headline and one short explanatory statement. Each scene must advance the same central explanation rather than repeat it in different words. The final reveal should synthesise the scenes into one clear conclusion or changed understanding. Avoid long paragraphs, fact lists, decorative stock images and scenes that could be removed without weakening the narrative. Do not disguise an ordinary slideshow as visual learning: the images must carry meaningful explanatory or emotional work.',
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
  }
}
