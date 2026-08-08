// ─── Component Lab — adapters for the ScreenRenderer-owned authoring types ───
//
// Nine authoring types are implemented by handlers private to
// ScreenRenderer.jsx: ReadBlock, KeypointBlock, ExamTipBlock, ScenarioBlock,
// FunFactBlock, MisconceptionBlock, RevealBlock, TimelineBlock
// and ScreenContentRenderer. They include the two most-used authorable types
// in the codebase — `read` (261 uses) and `quiz` (224) — so a Lab that omits
// them omits the things an author places most often.
//
// They are genuine authoring types; the catalogue schema sanctions
// handler-backed entries precisely because their implementation is
// deliberately not a standalone reusable component. So the preview mounts
// ScreenRenderer with a minimal valid one-block screen (D4, option A):
//
//   • the handlers stay private — nothing here exports one, and nothing here
//     imports one;
//   • the preview is what an author actually gets, rendered by the real
//     router, not a re-implementation that can drift from it;
//   • ScreenRenderer is a rendering *mechanism* here, never a selectable Lab
//     item — every selection below is keyed by its own authoring key.
//
// Each fixture is the adapter's `minimalScreen`: the same object is both the
// preview's content and the shape the chapter validator is asserted against,
// so a preview cannot show something an author could not write.

import ScreenRenderer from '../../components/layout/ScreenRenderer.jsx'

/**
 * Mount the real router on one screen. The chapter is the smallest object
 * ScreenRenderer reads: an id, a subject and the screen itself.
 */
export function renderThroughScreenRenderer(screen, { subject = 'History', onDone } = {}) {
  const chapter = {
    id: 'component-lab-preview',
    title: 'Component Lab preview',
    subject,
    screens: [screen],
  }
  return (
    <ScreenRenderer
      screen={screen}
      chapter={chapter}
      chapterNum={1}
      subject={subject}
      onScreenComplete={onDone}
      isLast={false}
      handleFinish={onDone}
      go={() => {}}
      screenIndex={0}
      setScreen={() => {}}
      setAnimKey={() => {}}
      scrollToTop={() => {}}
      headerProps={{}}
      headerOnBack={() => {}}
      setIhmExploreScreen={() => {}}
      setSelectedHealer={() => {}}
      setCinematicHeaderVisible={() => {}}
    />
  )
}

/** Wrap one authored block in the standard content screen that carries it. */
const inStandardScreen = (...blocks) => ({ type: 'standard', blocks })

/**
 * One adapter over one authored screen. `fixture` and `minimalScreen` are the
 * same object on purpose: the preview renders exactly the shape the chapter
 * validator is asserted against, so a preview can never show something an
 * author could not write.
 */
const screenAdapter = (minimalScreen, { subject = 'History' } = {}) => ({
  renderMode: 'inline',
  subject,
  fixture: minimalScreen,
  minimalScreen,
  render: (fx, { onDone }) => renderThroughScreenRenderer(fx, { subject, onDone }),
})

const blockAdapter = (block, options) => screenAdapter(inStandardScreen(block), options)

// ─── The nine handler-backed selections ──────────────────────────────────────
//
// Content is realistic GCSE material at the minimum the contract requires —
// "minimal" is about the shape, not about being unrepresentative.

export const SCREEN_RENDERER_ADAPTERS = {
  'block:read': blockAdapter({
    type: 'read',
    label: 'The four humours',
    text: 'Medieval doctors believed the body held four fluids — blood, phlegm, black bile and yellow bile. Illness was thought to follow when one of them fell out of balance, so treatment aimed to restore the balance rather than to remove a cause.',
  }),

  'block:keypoint': blockAdapter({
    type: 'keypoint',
    text: 'Galen’s theory of opposites shaped treatment for over a thousand years.',
    points: [
      'A fever was "hot", so it was treated with something cold, such as a cucumber.',
      'A cold was "wet", so it was treated with something dry, such as pepper.',
      'The theory was wrong, but it was internally consistent — which is why it survived.',
    ],
  }),

  'block:examtip': blockAdapter({
    type: 'examtip',
    text: 'A "describe two features" question is worth 4 marks: two features, each with one supporting detail.',
    tip: 'Do not explain <em>why</em> — that earns nothing here. State the feature, then add the detail that proves it.',
    phrases: ['One feature was…', 'This is shown by…'],
  }),

  'block:scenario': blockAdapter({
    type: 'scenario',
    label: 'Treating a fever in 1348',
    scenarios: [
      {
        situation: 'A patient has a burning fever. A physician following Galen reaches for a treatment. Which one fits the theory of opposites?',
        options: ['A cold compress', 'A hot poultice'],
        correctIndex: 0,
        explanation: 'A fever was classed as hot and wet, so the opposite — something cold — was applied to rebalance the humours.',
      },
    ],
    completionText: 'You have applied the theory of opposites the way a medieval physician would.',
  }),

  'block:funfact': blockAdapter({
    type: 'funfact',
    label: '🤯 Fun fact',
    text: 'Some medieval physicians diagnosed illness by tasting a patient’s urine. The urine wheel matched its colour, smell and taste to a humoral imbalance.',
  }),

  'block:misconception': blockAdapter({
    type: 'misconception',
    label: 'Common mistakes — tap to reveal why',
    mistakes: [
      {
        wrong: '"People in the Middle Ages had no idea what caused disease."',
        right: 'They had detailed explanations — they were simply wrong ones.',
        reason: 'Saying they had "no idea" loses marks. The examiner wants the four explanations they did use: the four humours, miasma, astrology and divine punishment.',
      },
    ],
  }),

  'block:reveal': blockAdapter({
    type: 'reveal',
    label: 'Rapid fire',
    prompt: 'Name the four humours.',
    answer: 'Blood, phlegm, black bile and yellow bile.',
  }),

  'block:timeline': blockAdapter({
    type: 'timeline',
    events: [
      { year: '1348', text: 'The Black Death reaches Melcombe in Dorset.' },
      { year: '1349', text: 'Flagellants walk from town to town, whipping themselves in penance.' },
      { year: '1350', text: 'Roughly a third of England’s population has died.' },
    ],
  }),

  // The container screen itself. Its pedagogy is container-derived, which is
  // exactly what this fixture shows: two ordinary blocks, and the screen takes
  // its classification from them.
  'screen:standard': screenAdapter(inStandardScreen(
    {
      type: 'read',
      text: 'The standard screen is the default. A screen with no <code>type</code> is one of these — which is why it has no direct authored uses and is still the most common screen in the app.',
    },
    {
      type: 'keypoint',
      text: 'It holds an ordered <code>blocks</code> array and renders each block in turn. Its pedagogical classification is container-derived: it comes from the blocks it holds.',
    },
  )),
}
