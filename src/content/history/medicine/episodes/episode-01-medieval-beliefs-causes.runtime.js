import episode from './episode-01-medieval-beliefs-causes.js'

const REMOVED_DUPLICATE_SCREEN_LABEL = 'The Four Humours'
const removedScreenIndex = episode.screens.findIndex(
  screen => screen.label === REMOVED_DUPLICATE_SCREEN_LABEL && screen.type === 'conceptReveal'
)

function shiftScreenIndex(screenIndex) {
  if (removedScreenIndex < 0 || typeof screenIndex !== 'number') return screenIndex
  return screenIndex > removedScreenIndex ? screenIndex - 1 : screenIndex
}

const screens = removedScreenIndex < 0
  ? episode.screens
  : episode.screens.filter((_, index) => index !== removedScreenIndex)

const stageNavigation = episode.stageNavigation.map(stage => ({
  ...stage,
  screenIndex: shiftScreenIndex(stage.screenIndex),
}))

export default {
  ...episode,
  screens,
  stageNavigation,
}
