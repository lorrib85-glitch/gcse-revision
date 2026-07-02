import { MODULES } from '../modules.js'
import { MODULE_GROUPS } from '../progress.js'
import { MEDICINE_2023_PAPER } from '../data/medicineExamPapers.js'
import { SUBJECTS } from '../constants/subjects.js'

// Header appears on all learning pages.
// It is hidden only for full-screen cinematic/video moments where overlay UI would reduce immersion.
export function isFullScreenVideoScreen(screen) {
  return screen?.type === 'cinematic' || screen?.type === 'cinematicReveal' || screen?.type === 'video'
}

export function getStageNavigation(module, total) {
  const fromModule = Array.isArray(module.stageNavigation) ? module.stageNavigation : []
  if (fromModule.length === 6) {
    return fromModule.map((stage, index) => ({
      id: stage.id || `part-${index + 1}`,
      title: stage.title || `Part ${index + 1}`,
      description: stage.description || '',
      screenIndex: Math.max(0, Math.min(total - 1, Number(stage.screenIndex) || 0)),
    }))
  }
  const fallbackTitles = ['Intro', 'Learn 1', 'Learn 2', 'Learn 3', 'Review', 'Exam prep']
  return fallbackTitles.map((title, index) => ({
    id: `fallback-${index + 1}`,
    title,
    description: index === 5 ? 'Exam practice and final application.' : '',
    screenIndex: Math.min(total - 1, Math.floor((index / 6) * total)),
  }))
}

export function getCurrentStageFromNavigation(stageNavigation, screen) {
  const active = [...stageNavigation]
    .filter(stage => stage.screenIndex <= screen)
    .sort((a, b) => b.screenIndex - a.screenIndex)[0]
  return active?.title || stageNavigation[0]?.title || 'Intro'
}

// Pure: clamp a requested screen index into the valid [0, total-1] range.
// Used by ModulePlayer's go(delta) and goTo(idx) — both compute a candidate
// index and pass it through this same clamp before setScreen().
export function clampScreenIndex(index, total) {
  return Math.max(0, Math.min(total - 1, index))
}

// Pure: derive ModulePlayer's initial in-memory lifecycle state from a module's
// definition and its persisted state object (see getModuleState/saveModuleState
// in ModulePlayer.jsx — `saved` is always an object, `{}` on first-ever open or
// on JSON-parse failure, never null/undefined, so no extra guarding is needed
// here to match current behaviour).
//
// introDone always starts `true` regardless of `saved.introDone` — this mirrors
// existing ModulePlayer behaviour exactly (IntroScreen gating never actually
// triggers on mount today; preserved as-is, not a bug fix).
export function computeInitialModuleState(module, saved) {
  const rawScreen = saved.screen || 0
  return {
    hookDone:         saved.hookDone || !module.hook,
    wylDone:          saved.wylDone ?? !module.outcomes,
    // If user already has hookDone+wylDone saved (i.e. they've been to content
    // before), treat recallDone as true to avoid forcing recall on existing progress.
    recallDone:       saved.recallDone || !module.recall || !!(saved.hookDone && saved.wylDone),
    introDone:        true,
    // Guard against a stale saved index (e.g. after a module restructure).
    screen:           rawScreen < module.screens.length ? rawScreen : 0,
    examinerAttempts: saved.examinerAttempts || [],
    completed:        saved.completed || false,
  }
}

// Pure: decide what handleFinish should do when the user continues from the
// final content screen. Mirrors the priority order in ModulePlayer.jsx's
// handleFinish exactly: examinerExplains gate first (shown once), then the
// examiner gate, then completion. All side effects (setShowExaminerExplains,
// setShowExaminer, detectWeakSpot/completeModule, scrollToTop) stay in
// ModulePlayer.jsx — this only returns the decision.
export function resolveFinishAction(module, { showExaminerExplains } = {}) {
  if (module.examinerExplains && !showExaminerExplains) {
    return { type: 'showExaminerExplains' }
  }
  if (module.examiner) {
    return { type: 'showExaminer' }
  }
  return { type: 'completeModule' }
}

// Pure: decide which universal-opener gate (hook/outcomes/recall) ModulePlayer
// should render before its main content, or none. Mirrors the priority order
// of ModulePlayer.jsx's three gate render blocks exactly: hook first
// (including the navTo='hook' override), then outcomes, then recall
// (including the navTo='recall' override). All side effects (setHookDone,
// setWylDone, setRecallDone, setNavTo, scrollToTop, onBack handlers) and the
// gate screens' own JSX stay in ModulePlayer.jsx — this only returns the
// decision.
export function getModuleGate(module, { hookDone, wylDone, recallDone, navTo } = {}) {
  if ((!hookDone && module.hook?.statement) || navTo === 'hook') {
    return { type: 'hook' }
  }
  if (hookDone && !wylDone && module.outcomes) {
    return { type: 'outcomes' }
  }
  if ((!recallDone || navTo === 'recall') && module.recall) {
    return { type: 'recall' }
  }
  return { type: null }
}

const CHAPTER_COPY = [
  'Momentum matters.',
  "That's another one locked in.",
  "You're getting faster.",
  'Nice. Keep the streak moving.',
  'Another one down.',
]

// Pure: compute the data object needed by ChapterCompleteScreen.
export function buildChapterCompletePayload(completedModule) {
  const accent = SUBJECTS[completedModule.subject]?.accent || completedModule.color || SUBJECTS.History.accent

  const group         = MODULE_GROUPS.find(g => g.chapterIds.includes(completedModule.id))
  const chapterIdx    = group ? group.chapterIds.indexOf(completedModule.id) : -1
  const nextChapterId = group ? group.chapterIds[chapterIdx + 1] : null

  let nextMod, nextChapterLabel, nextChapterNum, nextChapterTitle, isFinalChapter

  if (nextChapterId) {
    nextMod          = MODULES.find(m => m.id === nextChapterId)
    nextChapterLabel = 'Chapter'
    nextChapterNum   = chapterIdx + 2
    nextChapterTitle = nextMod?.title
    isFinalChapter   = false
  } else if (group) {
    const groupIdx  = MODULE_GROUPS.indexOf(group)
    const nextGroup = MODULE_GROUPS[groupIdx + 1]
    nextMod          = nextGroup ? MODULES.find(m => m.id === nextGroup.chapterIds[0]) : null
    nextChapterLabel = 'Next Module'
    nextChapterNum   = null
    nextChapterTitle = nextGroup?.title
    isFinalChapter   = !nextGroup
  } else {
    const idx        = MODULES.findIndex(m => m.id === completedModule.id)
    nextMod          = idx >= 0 && idx < MODULES.length - 1 ? MODULES[idx + 1] : null
    nextChapterLabel = 'Chapter'
    nextChapterNum   = nextMod?.number
    nextChapterTitle = nextMod?.title
    isFinalChapter   = !nextMod
  }

  const pastPaperHint = completedModule.id === 'history-medicine-medieval-beliefs-causes'
    ? { label: 'Practice 2023 exam questions', topicId: 'th1', paper: MEDICINE_2023_PAPER }
    : null

  return {
    accent,
    completedChapter:  completedModule.title,
    nextChapterLabel,
    nextChapterNum,
    nextChapterTitle,
    supportingCopy:    CHAPTER_COPY[Math.floor(Math.random() * CHAPTER_COPY.length)],
    isFinalChapter,
    moduleName:        group?.title || completedModule.title,
    nextModule:        nextMod,
    pastPaperHint,
  }
}

// Pure: given a screen index and the module's current persisted state, compute
// the new state object to write to localStorage before opening the player.
export function prepareModuleScreenState(screenIndex, existingState) {
  return {
    ...existingState,
    screen:    screenIndex,
    hookDone:  screenIndex > 0 ? true : (existingState.hookDone  || false),
    wylDone:   screenIndex > 0 ? true : (existingState.wylDone   || false),
    introDone: screenIndex > 0 ? true : (existingState.introDone || false),
  }
}

// Pure: map a Today's-Plan task to a navigation destination descriptor.
// Returns null if the task carries no actionable destination.
export function resolveTaskDestination(task) {
  const sel = task?.onSelect
  if (!sel) return null

  if (sel.kind === 'quickfire') {
    return { kind: 'quickfire' }
  }
  if (sel.kind === 'module') {
    const mod = MODULES.find(m => m.id === sel.moduleId)
    if (!mod) return null
    return { kind: 'module', mod, screenIndex: sel.screenIndex }
  }
  if (sel.kind === 'practice' || sel.kind === 'paper') {
    return {
      kind:            'exam',
      subject:         sel.subject,
      isTimedPaper:    sel.isTimedPaper,
      durationSeconds: sel.durationSeconds,
      paperQuestions:  sel.paperQuestions,
      title:           sel.title,
    }
  }
  return null
}
