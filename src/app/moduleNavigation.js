// Legacy compatibility facade.
// New production code must import from chapterNavigation.js.

import { resolveFinishAction as resolveChapterFinishAction } from './chapterNavigation.js'

export {
  isFullScreenVideoScreen,
  getStageNavigation,
  getCurrentStageFromNavigation,
  clampScreenIndex,
  computeInitialChapterState,
  computeInitialChapterState as computeInitialModuleState,
  getChapterGate,
  getChapterGate as getModuleGate,
  buildChapterCompletePayload,
  prepareChapterScreenState,
  prepareChapterScreenState as prepareModuleScreenState,
  resolveTaskDestination,
} from './chapterNavigation.js'

// Preserve the legacy action discriminator for old callers while the
// canonical runtime uses completeChapter internally.
export function resolveFinishAction(...args) {
  const action = resolveChapterFinishAction(...args)
  return action?.type === 'completeChapter'
    ? { ...action, type: 'completeModule' }
    : action
}
