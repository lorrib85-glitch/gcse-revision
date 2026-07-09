import episode from './episode-01-medieval-beliefs-causes.js'

// Runtime sequence override for Episode 1.
// The original canonical file is preserved for audit history, while the runtime
// sequence removes duplication, keeps the cinematic Galen introduction, and
// upgrades the Theory of Opposites media slot into a layered quadrant reveal.
const REMOVED_DUPLICATE_SCREEN_LABEL = 'The Four Humours'
const removedScreenIndex = episode.screens.findIndex(
  screen => screen.label === REMOVED_DUPLICATE_SCREEN_LABEL && screen.type === 'conceptReveal'
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
  intro: 'Watch the four humours build into one system.',
  interval: 1500,
  images: {
    topLeft: '/figures/history/medicine/medieval/four-humours-blood.webp',
    topRight: '/figures/history/medicine/medieval/four-humours-yellow-bile.webp',
    bottomLeft: '/figures/history/medicine/medieval/four-humours-black-bile.webp',
    bottomRight: '/figures/history/medicine/medieval/four-humours-phlegm.webp',
  },
  alt: 'The four humours revealed one quadrant at a time: blood (hot and wet), yellow bile (hot and dry), black bile (cold and dry) and phlegm (cold and wet), with arrows linking each humour to its opposite',
  parts: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
  // Blood (hot + wet) ↔ black bile (cold + dry); yellow bile (hot + dry) ↔ phlegm (cold + wet)
  opposites: [
    ['topLeft', 'bottomLeft'],
    ['topRight', 'bottomRight'],
  ],
  finished: 'Each humour has an opposite — hot cancels cold, wet cancels dry.',
}

function upgradeTheoryOfOppositesScreen(screen) {
  if (screen.heading !== 'Every illness had an opposite') return screen

  return {
    ...screen,
    blocks: (screen.blocks || []).map(block => (
      block.type === 'mediaPlaceholder'
        ? {
            ...block,
            kind: 'imageReveal',
            aspect: '1:1',
            caption: fourHumoursRevealConfig,
          }
        : block
    )),
  }
}

const withoutDuplicate = (removedScreenIndex < 0
  ? episode.screens
  : episode.screens.filter((_, index) => index !== removedScreenIndex)
).map(upgradeTheoryOfOppositesScreen)

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
