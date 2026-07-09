import episode from './episode-01-medieval-beliefs-causes.js'

// Runtime sequence override for Episode 1.
// The original canonical file is preserved for audit history, while the runtime
// sequence removes duplication and adds a slow visual reveal before Galen's profile.
const REMOVED_DUPLICATE_SCREEN_LABEL = 'The Four Humours'
const removedScreenIndex = episode.screens.findIndex(
  screen => screen.label === REMOVED_DUPLICATE_SCREEN_LABEL && screen.type === 'conceptReveal'
)

const galenImageReveal = {
  type: 'cinematicCarousel',
  mode: 'imageReveal',
  stage: 'Galen',
  label: 'The four humours',
  title: 'The four humours',
  intro: 'Four fluids. One theory of health.',
  revealInterval: 1900,
  items: [
    {
      id: 'blood',
      image: '/figures/history/medicine/medieval/four-humours-blood.webp',
      alt: 'Blood, believed to be hot and wet',
    },
    {
      id: 'yellow-bile',
      image: '/figures/history/medicine/medieval/four-humours-yellow-bile.webp',
      alt: 'Yellow bile, believed to be hot and dry',
    },
    {
      id: 'black-bile',
      image: '/figures/history/medicine/medieval/four-humours-black-bile.webp',
      alt: 'Black bile, believed to be cold and dry',
    },
    {
      id: 'phlegm',
      image: '/figures/history/medicine/medieval/four-humours-phlegm.webp',
      alt: 'Phlegm, believed to be cold and wet',
    },
  ],
}

const withoutDuplicate = removedScreenIndex < 0
  ? episode.screens
  : episode.screens.filter((_, index) => index !== removedScreenIndex)

const galenProfileIndex = withoutDuplicate.findIndex(
  screen => screen.type === 'keyFigureReveal' && screen.label === 'Galen'
)

const screens = galenProfileIndex < 0
  ? withoutDuplicate
  : [
      ...withoutDuplicate.slice(0, galenProfileIndex),
      galenImageReveal,
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
