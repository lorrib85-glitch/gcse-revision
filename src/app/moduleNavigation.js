import { MODULES } from '../modules.js'
import { MODULE_GROUPS } from '../progress.js'
import { MEDICINE_2023_PAPER } from '../data/medicineExamPapers.js'
import { SUBJECTS } from '../constants/subjects.js'

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
