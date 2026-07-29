import { CHAPTERS } from '../chapters.js'
import { MODULES } from '../data/modules.js'
import { MEDICINE_2023_PAPER } from '../data/medicineExamPapers.js'
import { SUBJECTS } from '../constants/subjects.js'
import { isCinematicHeaderScreen } from '../data/screenRegistry.js'

// Header appears on all learning pages.
// It is hidden only for full-screen cinematic/video moments where overlay UI would reduce immersion.
export function isFullScreenVideoScreen(screen) {
  return isCinematicHeaderScreen(screen)
}

export function getStageNavigation(chapter, total) {
  const fromChapter = Array.isArray(chapter.stageNavigation) ? chapter.stageNavigation : []
  if (fromChapter.length === 6) {
    return fromChapter.map((stage, index) => ({
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
// Used by ChapterPlayer's go(delta) and goTo(idx) — both compute a candidate
// index and pass it through this same clamp before setScreen().
export function clampScreenIndex(index, total) {
  return Math.max(0, Math.min(total - 1, index))
}

// Pure: derive ChapterPlayer's initial in-memory lifecycle state from a chapter's
// definition and its persisted state object (see getChapterState/saveChapterState
// in ChapterPlayer.jsx — `saved` is always an object, `{}` on first-ever open or
// on JSON-parse failure, never null/undefined, so no extra guarding is needed
// here to match current behaviour).
//
// introDone always starts `true` regardless of `saved.introDone` — this mirrors
// existing ChapterPlayer behaviour exactly (IntroScreen gating never actually
// triggers on mount today; preserved as-is, not a bug fix).
export function computeInitialChapterState(chapter, saved) {
  const rawScreen = saved.screen || 0
  return {
    hookDone:         saved.hookDone || !chapter.hook,
    wylDone:          saved.wylDone ?? !chapter.outcomes,
    // If user already has hookDone+wylDone saved (i.e. they've been to content
    // before), treat recallDone as true to avoid forcing recall on existing progress.
    recallDone:       saved.recallDone || !chapter.recall || !!(saved.hookDone && saved.wylDone),
    introDone:        true,
    // Guard against a stale saved index (e.g. after a chapter restructure).
    screen:           rawScreen < chapter.screens.length ? rawScreen : 0,
    examinerAttempts: saved.examinerAttempts || [],
    completed:        saved.completed || false,
  }
}

// Pure: decide what handleFinish should do when the user continues from the
// final content screen. Mirrors the priority order in ChapterPlayer.jsx's
// handleFinish exactly: examinerExplains gate first (shown once), then the
// examiner gate, then completion. All side effects (setShowExaminerExplains,
// setShowExaminer, detectWeakSpot/completeChapter, scrollToTop) stay in
// ChapterPlayer.jsx — this only returns the decision.
export function resolveFinishAction(chapter, { showExaminerExplains } = {}) {
  if (chapter.examinerExplains && !showExaminerExplains) {
    return { type: 'showExaminerExplains' }
  }
  if (chapter.examiner) {
    return { type: 'showExaminer' }
  }
  return { type: 'completeChapter' }
}

// Pure: decide which universal-opener gate (hook/outcomes/recall) ChapterPlayer
// should render before its main content, or none. Mirrors the priority order
// of ChapterPlayer.jsx's three gate render blocks exactly: hook first
// (including the navTo='hook' override), then outcomes, then recall
// (including the navTo='recall' override). All side effects (setHookDone,
// setWylDone, setRecallDone, setNavTo, scrollToTop, onBack handlers) and the
// gate screens' own JSX stay in ChapterPlayer.jsx — this only returns the
// decision.
export function getChapterGate(chapter, { hookDone, wylDone, recallDone, navTo } = {}) {
  if ((!hookDone && chapter.hook?.statement) || navTo === 'hook') {
    return { type: 'hook' }
  }
  if (hookDone && !wylDone && chapter.outcomes) {
    return { type: 'outcomes' }
  }
  if ((!recallDone || navTo === 'recall') && chapter.recall) {
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
export function buildChapterCompletePayload(completedChapter) {
  const accent = SUBJECTS[completedChapter.subject]?.accent || completedChapter.color || SUBJECTS.History.accent

  const parentModule  = MODULES.find(module => module.chapterIds.includes(completedChapter.id))
  const chapterIdx    = parentModule ? parentModule.chapterIds.indexOf(completedChapter.id) : -1
  const nextChapterId = parentModule ? parentModule.chapterIds[chapterIdx + 1] : null

  let nextChapter, nextChapterLabel, nextChapterNum, nextChapterTitle, isFinalChapter, completionType

  if (nextChapterId) {
    nextChapter          = CHAPTERS.find(chapter => chapter.id === nextChapterId)
    nextChapterLabel = 'Chapter'
    nextChapterNum   = chapterIdx + 2
    nextChapterTitle = nextChapter?.title
    isFinalChapter   = false
    completionType   = 'chapter'
  } else if (parentModule) {
    const moduleIdx = MODULES.indexOf(parentModule)
    const nextModule = MODULES[moduleIdx + 1]
    nextChapter      = nextModule ? CHAPTERS.find(chapter => chapter.id === nextModule.chapterIds[0]) : null
    nextChapterLabel = 'Next Module'
    nextChapterNum   = null
    nextChapterTitle = nextModule?.title
    isFinalChapter   = !nextModule
    completionType   = nextModule ? 'chapter' : 'subject'
  } else {
    const idx        = CHAPTERS.findIndex(chapter => chapter.id === completedChapter.id)
    nextChapter          = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null
    nextChapterLabel = 'Chapter'
    nextChapterNum   = nextChapter?.number
    nextChapterTitle = nextChapter?.title
    isFinalChapter   = !nextChapter
    completionType   = isFinalChapter ? 'subject' : 'chapter'
  }

  const backgroundAsset = completedChapter.completionBackground || completedChapter.headerImage
  const backgroundPosition = completedChapter.completionBackgroundPosition
    || (backgroundAsset ? 'center 30%' : undefined)

  const pastPaperHint = completedChapter.id === 'history-medicine-medieval-beliefs-causes'
    ? { label: 'Practice 2023 exam questions', topicId: 'th1', paper: MEDICINE_2023_PAPER }
    : null

  return {
    subject:           completedChapter.subject,
    accent,
    completionType,
    completedChapter:  completedChapter.title,
    nextChapterLabel,
    nextChapterNum,
    nextChapterTitle,
    supportingCopy:    CHAPTER_COPY[Math.floor(Math.random() * CHAPTER_COPY.length)],
    isFinalChapter,
    backgroundAsset,
    backgroundPosition,
    moduleName:        parentModule?.title || completedChapter.title,
    nextChapter,
    pastPaperHint,
  }
}

// Pure: given a screen index and the chapter's current persisted state, compute
// the new state object to persist (via progress.js) before opening the player.
export function prepareChapterScreenState(screenIndex, existingState) {
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
  if (sel.kind === 'chapter') {
    const chapterId = sel.chapterId
    const chapter = CHAPTERS.find(candidate => candidate.id === chapterId)
    if (!chapter) return null
    return { kind: 'chapter', chapter, screenIndex: sel.screenIndex }
  }
  if (sel.kind === 'practice' || sel.kind === 'paper') {
    return {
      kind:            'exam',
      subject:         sel.subject,
      isTimedPaper:    sel.isTimedPaper,
      durationSeconds: sel.durationSeconds,
      paperQuestions:  sel.paperQuestions,
      title:           sel.title,
      origin:          sel.origin,
    }
  }
  return null
}
