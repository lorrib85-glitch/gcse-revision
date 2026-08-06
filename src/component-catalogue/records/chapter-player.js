// ChapterPlayer — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about ChapterPlayer; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'chapter-player',
  name: 'ChapterPlayer',
  source: 'src/components/layout/ChapterPlayer.jsx',
  exportName: null,
  order: 71,
  outOfRootReason: null,
  section: 'layout',
  kind: 'runtime',
  lifecycle: 'active',
  lifecycleReason: null,
  purpose: 'The internal runtime for one authored chapter. It owns the chapter lifecycle — deciding which opening gate applies (hook, what-you’ll-learn, prior-knowledge recall), navigation between screens, progress persistence to gcse_chapter_<chapterId>, and completion.',
  ownership: {
    internalDirectories: [
      {
        path: 'src/components/layout/chapterPlayer',
        reason: "ChapterPlayer's own runtime JSX, split out of the player: the universal opener gate layer and the fixed bottom-navigation shell. Authors never place either — the runtime decides — so they are deliberately absent from screenRegistry.js, componentFunctions.js and the Component Lab. Guarded by tests/architecture/chapter-player-private-family.test.js."
      }
    ],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: null,
    props: [
      'chapter (a chapter definition resolved through CHAPTER_CONTENT_LOADERS)',
      'onBack',
      'onChapterComplete'
    ],
    dataShape: null,
    dependencies: [
      'ScreenRenderer',
      'screenRegistry.js schema validation',
      'chapterNavigation.js',
      'progress.js',
      'LEARNING_SEQUENCES via learnerCurriculum.js',
      'its own private family under layout/chapterPlayer/'
    ],
    usedBy: [],
    usageBoundary: 'Not an authoring choice. Content authors never select ChapterPlayer as a screen or component, and never add a screen type to it. It resolves every screen through ScreenRenderer and holds no component-routing branches of its own.',
    contractDoc: null,
    story: null,
    governanceRules: [
      'No chapter-level examiner or repair diversions. Finishing the last content screen completes the chapter, full stop. Face the Examiner and What Examiners Look For are reached as authored screens routed by ScreenRenderer, never as end-of-chapter overlays; WeakSpotRecovery and RecoveryQuizPlayer have no ChapterPlayer entry point.',
      'Chapter-building rule: author a canonical Chapter record, reference it from exactly one canonical Module record, create its content file, set contentPath, use registered screens and blocks, then run the curriculum generators. Production reaches the result only through src/data/learnerCurriculum.js; screenCount, screenTags and the loader entry are derived. Adding a normal Chapter must not require editing ChapterPlayer, ScreenRenderer, app navigation or progress persistence. Enforced by tests/architecture/chapter-authoring-boundary.test.js and tests/architecture/authoring-guidance.test.js.'
    ],
    notes: []
  },
  decision: null,
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  },
  authoring: null
}
