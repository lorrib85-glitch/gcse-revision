import episode from './episode-01-medieval-beliefs-causes.js'

// Runtime sequence override for Episode 1.
// The original canonical file is preserved for audit history, while the runtime
// sequence removes duplication, keeps the cinematic Galen introduction, and
// splits the Theory of Opposites diagram and worked example into focused screens.
const REMOVED_DUPLICATE_SCREEN_LABEL = 'The Four Humours'
const THEORY_OF_OPPOSITES_HEADING = 'Every illness had an opposite'
const HOT_COLD_REVEAL_BACKGROUND = '/figures/history/medicine/medieval/opposite-qualities-background.svg'

const removedScreenIndex = episode.screens.findIndex(
  screen => screen.label === REMOVED_DUPLICATE_SCREEN_LABEL && screen.type === 'conceptReveal'
)

const theoryScreenIndex = episode.screens.findIndex(
  screen => screen.heading === THEORY_OF_OPPOSITES_HEADING
)

const galenCinematicIntro = {
  type: 'conceptReveal',
  stage: 'Galen',
  label: 'Introducing Galen',
  steps: [
    {
      mainText: 'His name\nwas Galen.',
      supportText: "He turned Hippocrates' ideas into a system that would dominate medicine for over 1,000 years.",
      backgroundImage: '/figures/history/medicine/medieval/galen-portrait.png',
      backgroundPosition: 'center 8%',
      overlay: 'linear-gradient(to bottom, rgba(0,0,0,.12) 0%, rgba(0,0,0,.24) 40%, rgba(0,0,0,.74) 72%, rgba(0,0,0,.97) 100%)',
      slowReveal: true,
      tapToContinue: true,
    },
  ],
}

const fourHumoursRevealConfig = {
  interval: 1500,
  images: {
    topLeft: '/figures/history/medicine/medieval/four-humours-blood.webp',
    topRight: '/figures/history/medicine/medieval/four-humours-yellow-bile.webp',
    bottomLeft: '/figures/history/medicine/medieval/four-humours-phlegm.webp',
    bottomRight: '/figures/history/medicine/medieval/four-humours-black-bile.webp',
  },
  alt: 'The four humours revealed one quadrant at a time: blood (hot and wet), yellow bile (hot and dry), phlegm (cold and wet) and black bile (cold and dry), with arrows crossing the centre to link each humour to its opposite',
  parts: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
  // True opposites sit diagonally across the wheel: blood (hot + wet) ↔ black bile
  // (cold + dry); yellow bile (hot + dry) ↔ phlegm (cold + wet). The arrows cross
  // through the centre, pointing to each humour's opposite.
  opposites: [
    ['topLeft', 'bottomRight'],
    ['topRight', 'bottomLeft'],
  ],
  finished: 'Hot was treated with cold. Wet was treated with dry. The aim was to restore balance.',
}

function splitTheoryOfOppositesScreen(screen) {
  if (screen.heading !== THEORY_OF_OPPOSITES_HEADING) return [screen]

  // Deliver the four-humours opposites wheel as the canonical infographic screen:
  // heading + intro + one governed infographic media slot (the quadrant reveal).
  const { shell: _shell, blocks: _blocks, sub: _sub, ...rest } = screen
  return [{
    ...rest,
    type: 'infographic',
    heading: 'Galen treated with opposites',
    intro: "Galen took Hippocrates' theory of the Four Humours one step further. He believed illness happened when one humour became too dominant — so treatment should use the opposite qualities to restore balance.",
    media: {
      kind: 'imageReveal',
      aspect: '1:1',
      caption: fourHumoursRevealConfig,
    },
  }]
}

// OppositeQualitiesReveal is body content, not a standalone screen shell. The
// canonical source keeps the original authoring shape for audit history; runtime
// composes it through TeachScreenShell so the title clears LearningHeader and the
// normal governed navigation remains available after the reveal completes.
// The reveal requests a screen backdrop, which is portalled into ContentShell;
// Storybook and the Review Lab fall back to the contained stage backdrop.
function composeOppositeQualitiesScreen(screen) {
  if (screen.type !== 'oppositeQualitiesReveal') return screen

  const {
    type,
    title,
    copy,
    stage,
    label,
    ...visualProps
  } = screen

  const isHotCold = label === 'Hot and cold symptoms'
  const isWetDry = label === 'Wet and dry symptoms'
  const backgroundImage = isHotCold
    ? HOT_COLD_REVEAL_BACKGROUND
    : visualProps.backgroundImage
  const visualPair = isHotCold
    ? 'warmCool'
    : isWetDry
      ? 'wetDry'
      : visualProps.visualPair

  return {
    stage,
    label,
    shell: 'teach',
    heading: title,
    sub: copy,
    blocks: [
      {
        type,
        title,
        copy,
        ...visualProps,
        backgroundImage,
        backgroundMode: 'screen',
        visualPair,
        backgroundOpacity: isHotCold
          ? 1
          : visualProps.backgroundOpacity,
      },
    ],
  }
}

const withoutDuplicate = (removedScreenIndex < 0
  ? episode.screens
  : episode.screens.filter((_, index) => index !== removedScreenIndex)
).flatMap(splitTheoryOfOppositesScreen)
  .map(composeOppositeQualitiesScreen)

const galenProfileIndex = withoutDuplicate.findIndex(
  screen => screen.type === 'keyFigureReveal' && screen.label === 'Galen'
)

const screens = galenProfileIndex < 0
  ? withoutDuplicate
  : [
      ...withoutDuplicate.slice(0, galenProfileIndex),
      galenCinematicIntro,
      ...withoutDuplicate.slice(galenProfileIndex),
    ]

function transformScreenIndex(screenIndex) {
  if (typeof screenIndex !== 'number') return screenIndex

  let nextIndex = screenIndex
  if (removedScreenIndex >= 0 && nextIndex > removedScreenIndex) nextIndex -= 1
  if (galenProfileIndex >= 0 && nextIndex >= galenProfileIndex) nextIndex += 1

  return nextIndex
}

const stageNavigation = episode.stageNavigation.map(stage => ({
  ...stage,
  screenIndex: transformScreenIndex(stage.screenIndex),
}))

const screenTags = screens.map(screen => screen.tag || null)

export default {
  ...episode,
  screens,
  stageNavigation,
  screenCount: screens.length,
  screenTags,
}
