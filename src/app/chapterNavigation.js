import { CHAPTERS, isChapterAvailable } from '../chapters.js'
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

// Pure: build the regular persisted chapter-progress snapshot — the exact object
// ChapterPlayer's autosave effect writes through saveChapterState() on every
// screen/flag change. This is the canonical shape of an in-progress save; the
// completion shape is buildCompletedChapterState() below.
//
// `completed` is passed straight through, never inferred from screen position:
// reviewing a finished chapter deliberately moves `screen` backwards while
// keeping completed: true, which is what keeps the subject browser and
// getChapterPct() reading 100 during review.
export function buildChapterProgressState({ screen, hookDone, wylDone, recallDone, introDone, examinerAttempts, completed }) {
  return { screen, hookDone, wylDone, recallDone, introDone, examinerAttempts, completed }
}

// Pure: build the persisted chapter-completion snapshot — the exact object
// ChapterPlayer's completeChapter() writes through saveChapterState().
//
// Completion always writes screen: total and every opener flag true, so it is
// independent of the screen the learner happened to finish on and re-opening
// reviews content rather than replaying the hook/outcomes/recall gates. The
// caller supplies the examiner attempts that are current at completion time —
// an examiner completion must pass its freshly appended array in, not a stale
// render's copy. No existing saved object is merged in: the persisted public
// shape stays explicit.
export function buildCompletedChapterState({ total, examinerAttempts }) {
  return {
    screen: total,
    hookDone: true,
    wylDone: true,
    recallDone: true,
    introDone: true,
    examinerAttempts,
    completed: true,
  }
}

// Finish contract — the current rule, and why the helper that encoded it is gone
// ─────────────────────────────────────────────────────────────────────────────
// Continuing from the final content screen completes the chapter. There is no
// decision left to make, so there is no resolveFinishAction() any more —
// ChapterPlayer.handleFinish() calls completeChapter() unconditionally.
//
// History (kept so the removal is not re-litigated): the helper was extracted in
// A4 phase 2 to mirror a three-way ladder — a module-level examinerExplains gate
// shown once, then a module-level examiner gate, then completion — driven by
// top-level `chapter.examinerExplains` / `chapter.examiner` metadata. The Phase 8
// audit found no chapter has ever defined either key (0 of 81 content modules,
// 0 of 60 rows in chapters.js), so only the third branch could ever be taken.
// Both features do ship, but as *authored screens* (`type: 'examinerExplains'`,
// `type: 'faceExaminer'`) routed by ScreenRenderer, which never touch this path.
// Reintroducing a module-level ladder is a product decision, not a refactor.

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

// Pure: decide which chapter a learner should be offered after finishing one.
//
// Two rules, both absolute:
//   1. only a chapter isChapterAvailable() accepts is ever offered — coming-soon
//      stubs, hidden chapters and missing references are skipped, not stopped at;
//   2. the hand-off never leaves the completed chapter's subject. Moving between
//      subjects belongs to the planner, Home and the subject browser.
//
// Looks inside the parent module first, then at later same-subject modules in
// MODULES order. Returns null when the subject has no available successor — the
// end-of-journey case the completion screen already renders (isFinalChapter).
// Module array position therefore carries no build-status meaning.
export function resolveNextAvailableChapter(completedChapter, { modules = MODULES, chapters = CHAPTERS } = {}) {
  const subject = completedChapter?.subject
  const firstAvailable = chapterIds => chapterIds
    .map(id => chapters.find(chapter => chapter.id === id))
    .find(chapter => chapter?.subject === subject && isChapterAvailable(chapter)) || null

  const parentIdx = modules.findIndex(module => module.chapterIds.includes(completedChapter?.id))
  if (parentIdx === -1) return null

  const parentModule = modules[parentIdx]
  const remaining    = parentModule.chapterIds.slice(parentModule.chapterIds.indexOf(completedChapter.id) + 1)
  const withinModule = firstAvailable(remaining)
  if (withinModule) return { nextChapter: withinModule, isNextModule: false, nextModule: parentModule }

  for (const module of modules.slice(parentIdx + 1)) {
    const candidate = firstAvailable(module.chapterIds)
    if (candidate) return { nextChapter: candidate, isNextModule: true, nextModule: module }
  }
  return null
}

// Pure: compute the data object needed by ChapterCompleteScreen.
export function buildChapterCompletePayload(completedChapter) {
  const accent = SUBJECTS[completedChapter.subject]?.accent || completedChapter.color || SUBJECTS.History.accent

  const parentModule = MODULES.find(module => module.chapterIds.includes(completedChapter.id))
  const handoff      = resolveNextAvailableChapter(completedChapter)

  const nextChapter      = handoff?.nextChapter || null
  const isFinalChapter   = !nextChapter
  const completionType   = isFinalChapter ? 'subject' : 'chapter'
  const nextChapterLabel = handoff?.isNextModule ? 'Next Module' : 'Chapter'
  // A cross-module hand-off announces the module it opens; a within-module one
  // announces the chapter and its position in the module.
  const nextChapterNum   = handoff && !handoff.isNextModule
    ? handoff.nextModule.chapterIds.indexOf(nextChapter.id) + 1
    : null
  const nextChapterTitle = handoff?.isNextModule ? handoff.nextModule.title : nextChapter?.title

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
