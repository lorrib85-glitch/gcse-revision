import { describe, it, expect } from 'vitest'
import {
  getStageNavigation,
  getCurrentStageFromNavigation,
  isFullScreenVideoScreen,
  computeInitialChapterState,
  clampScreenIndex,
  resolveFinishAction,
  getChapterGate,
  resolveNextAvailableChapter,
  buildChapterCompletePayload,
} from '../../../src/app/chapterNavigation.js'
import { CHAPTERS, isChapterAvailable } from '../../../src/chapters.js'

function makeChapter(overrides = {}) {
  return {
    id: 'test-chapter',
    screens: [{}, {}, {}, {}, {}],
    ...overrides,
  }
}

describe('getStageNavigation', () => {
  it('returns the provided stage data when chapter.stageNavigation has exactly 6 entries', () => {
    const chapter = {
      stageNavigation: [
        { id: 'a', title: 'Alpha', description: 'first', screenIndex: 0 },
        { id: 'b', title: 'Beta', description: 'second', screenIndex: 2 },
        { id: 'c', title: 'Gamma', description: 'third', screenIndex: 4 },
        { id: 'd', title: 'Delta', description: 'fourth', screenIndex: 6 },
        { id: 'e', title: 'Epsilon', description: 'fifth', screenIndex: 8 },
        { id: 'f', title: 'Zeta', description: 'sixth', screenIndex: 10 },
      ],
    }
    const result = getStageNavigation(chapter, 12)
    expect(result).toEqual([
      { id: 'a', title: 'Alpha', description: 'first', screenIndex: 0 },
      { id: 'b', title: 'Beta', description: 'second', screenIndex: 2 },
      { id: 'c', title: 'Gamma', description: 'third', screenIndex: 4 },
      { id: 'd', title: 'Delta', description: 'fourth', screenIndex: 6 },
      { id: 'e', title: 'Epsilon', description: 'fifth', screenIndex: 8 },
      { id: 'f', title: 'Zeta', description: 'sixth', screenIndex: 10 },
    ])
  })

  it('fills in defaults for missing id/title/description on provided stages', () => {
    const chapter = {
      stageNavigation: [
        { screenIndex: 0 },
        { screenIndex: 1 },
        { screenIndex: 2 },
        { screenIndex: 3 },
        { screenIndex: 4 },
        { screenIndex: 5 },
      ],
    }
    const result = getStageNavigation(chapter, 6)
    expect(result[0]).toEqual({ id: 'part-1', title: 'Part 1', description: '', screenIndex: 0 })
    expect(result[3]).toEqual({ id: 'part-4', title: 'Part 4', description: '', screenIndex: 3 })
  })

  it('returns the fallback six-stage navigation when chapter has no stageNavigation', () => {
    const chapter = {}
    const result = getStageNavigation(chapter, 12)
    expect(result).toHaveLength(6)
    expect(result.map(s => s.title)).toEqual(['Intro', 'Learn 1', 'Learn 2', 'Learn 3', 'Review', 'Exam prep'])
    expect(result[5].description).toBe('Exam practice and final application.')
    expect(result[0].description).toBe('')
  })

  it('returns the fallback when stageNavigation is present but not exactly 6 entries', () => {
    const chapter = { stageNavigation: [{ id: 'only-one', screenIndex: 0 }] }
    const result = getStageNavigation(chapter, 6)
    expect(result).toHaveLength(6)
    expect(result[0].id).toBe('fallback-1')
  })

  it('clamps fallback screenIndex values sensibly against total (chapter.screens.length)', () => {
    const chapter = {}
    const total = 12
    const result = getStageNavigation(chapter, total)
    // fallback screenIndex = min(total-1, floor((index/6) * total))
    expect(result.map(s => s.screenIndex)).toEqual([0, 2, 4, 6, 8, 10])
    result.forEach(stage => {
      expect(stage.screenIndex).toBeLessThanOrEqual(total - 1)
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
    })
  })

  it('clamps explicit stage screenIndex values into [0, total-1] and defaults non-numeric to 0', () => {
    const chapter = {
      stageNavigation: [
        { id: 'a', title: 'A', screenIndex: -5 },
        { id: 'b', title: 'B', screenIndex: 999 },
        { id: 'c', title: 'C', screenIndex: 'not-a-number' },
        { id: 'd', title: 'D', screenIndex: 3 },
        { id: 'e', title: 'E', screenIndex: 4 },
        { id: 'f', title: 'F', screenIndex: 5 },
      ],
    }
    const result = getStageNavigation(chapter, 6)
    expect(result.map(s => s.screenIndex)).toEqual([0, 5, 0, 3, 4, 5])
  })
})

describe('getCurrentStageFromNavigation', () => {
  const stageNavigation = [
    { id: 's0', title: 'Intro', screenIndex: 0 },
    { id: 's1', title: 'Learn 1', screenIndex: 2 },
    { id: 's2', title: 'Learn 2', screenIndex: 4 },
    { id: 's3', title: 'Learn 3', screenIndex: 6 },
    { id: 's4', title: 'Review', screenIndex: 8 },
    { id: 's5', title: 'Exam prep', screenIndex: 10 },
  ]

  it('falls back to the first stage title when the screen index is before any stage', () => {
    expect(getCurrentStageFromNavigation(stageNavigation, -1)).toBe('Intro')
  })

  it('returns the exact stage at a stage boundary', () => {
    expect(getCurrentStageFromNavigation(stageNavigation, 4)).toBe('Learn 2')
    expect(getCurrentStageFromNavigation(stageNavigation, 8)).toBe('Review')
  })

  it('returns the most recently entered stage when mid-stage', () => {
    expect(getCurrentStageFromNavigation(stageNavigation, 5)).toBe('Learn 2')
    expect(getCurrentStageFromNavigation(stageNavigation, 7)).toBe('Learn 3')
  })

  it('returns the last stage when the screen index is exactly the last boundary', () => {
    expect(getCurrentStageFromNavigation(stageNavigation, 10)).toBe('Exam prep')
  })

  it('returns the last stage when the screen index is beyond the last stage boundary', () => {
    expect(getCurrentStageFromNavigation(stageNavigation, 999)).toBe('Exam prep')
  })
})

describe('isFullScreenVideoScreen', () => {
  it('returns true for type "cinematic"', () => {
    expect(isFullScreenVideoScreen({ type: 'cinematic' })).toBe(true)
  })

  it('returns true for type "cinematicReveal"', () => {
    expect(isFullScreenVideoScreen({ type: 'cinematicReveal' })).toBe(true)
  })

  it('returns true for type "video"', () => {
    expect(isFullScreenVideoScreen({ type: 'video' })).toBe(true)
  })

  it('returns false when screen is undefined', () => {
    expect(isFullScreenVideoScreen(undefined)).toBe(false)
  })

  it('returns false for an unrelated screen type', () => {
    expect(isFullScreenVideoScreen({ type: 'quiz' })).toBe(false)
  })
})

describe('computeInitialChapterState', () => {
  it('fresh chapter with a hook: hookDone false, everything else at its own fresh default', () => {
    const chapter = makeChapter({ hook: { statement: 'x' } })
    const result = computeInitialChapterState(chapter, {})
    expect(result).toEqual({
      hookDone: false,
      wylDone: true,
      recallDone: true,
      introDone: true,
      screen: 0,
      examinerAttempts: [],
      completed: false,
    })
  })

  it('fresh chapter without a hook: hookDone true (nothing to gate on)', () => {
    const chapter = makeChapter()
    const result = computeInitialChapterState(chapter, {})
    expect(result.hookDone).toBe(true)
  })

  it('fresh chapter with outcomes: wylDone false', () => {
    const chapter = makeChapter({ outcomes: { bullets: ['a'] } })
    expect(computeInitialChapterState(chapter, {}).wylDone).toBe(false)
  })

  it('fresh chapter without outcomes: wylDone true', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, {}).wylDone).toBe(true)
  })

  it('fresh chapter with recall: recallDone false', () => {
    const chapter = makeChapter({ recall: { questions: [] } })
    expect(computeInitialChapterState(chapter, {}).recallDone).toBe(false)
  })

  it('fresh chapter without recall: recallDone true', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, {}).recallDone).toBe(true)
  })

  it('saved screen is restored when within range', () => {
    const chapter = makeChapter({ screens: Array.from({ length: 10 }, () => ({})) })
    expect(computeInitialChapterState(chapter, { screen: 5 }).screen).toBe(5)
  })

  it('saved hookDone/wylDone/introDone are restored (introDone always true regardless)', () => {
    const chapter = makeChapter({ hook: { statement: 'x' }, outcomes: { bullets: [] } })
    const result = computeInitialChapterState(chapter, { hookDone: true, wylDone: true })
    expect(result.hookDone).toBe(true)
    expect(result.wylDone).toBe(true)
    expect(result.introDone).toBe(true) // always true — mirrors current ChapterPlayer behaviour exactly
  })

  it('saved recallDone is restored directly when true', () => {
    const chapter = makeChapter({ recall: { questions: [] } })
    expect(computeInitialChapterState(chapter, { recallDone: true }).recallDone).toBe(true)
  })

  it('saved hookDone+wylDone both true implies recallDone true even if recallDone was never saved', () => {
    const chapter = makeChapter({ recall: { questions: [] } })
    const result = computeInitialChapterState(chapter, { hookDone: true, wylDone: true })
    expect(result.recallDone).toBe(true)
  })

  it('saved examinerAttempts array is restored', () => {
    const chapter = makeChapter()
    const saved = { examinerAttempts: [{ chapterId: 'x', finalMark: 3 }] }
    expect(computeInitialChapterState(chapter, saved).examinerAttempts).toEqual(saved.examinerAttempts)
  })

  it('stale saved screen index at exactly chapter.screens.length resets to 0', () => {
    const chapter = makeChapter({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialChapterState(chapter, { screen: 5 }).screen).toBe(0)
  })

  it('stale saved screen index beyond chapter.screens.length resets to 0', () => {
    const chapter = makeChapter({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialChapterState(chapter, { screen: 99 }).screen).toBe(0)
  })

  it('saved screen index at the last valid position (length - 1) is kept, not reset', () => {
    const chapter = makeChapter({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialChapterState(chapter, { screen: 4 }).screen).toBe(4)
  })

  it('missing saved.screen defaults to 0', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, {}).screen).toBe(0)
  })

  it('completed saved chapter reopens with all lifecycle flags respected and completed true', () => {
    const chapter = makeChapter({
      hook: { statement: 'x' },
      outcomes: { bullets: [] },
      recall: { questions: [] },
    })
    // Matches the exact shape ChapterPlayer's completeChapter() persists (ChapterPlayer.jsx:1563):
    // screen: total, hookDone/wylDone/recallDone/introDone: true, completed: true.
    const saved = {
      screen: chapter.screens.length,
      hookDone: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      completed: true,
    }
    const result = computeInitialChapterState(chapter, saved)
    expect(result.completed).toBe(true)
    expect(result.hookDone).toBe(true)
    expect(result.wylDone).toBe(true)
    expect(result.recallDone).toBe(true)
    expect(result.introDone).toBe(true)
    // screen: total is one past the end, so the stale-index guard resets it to 0 —
    // this is existing behaviour (completeChapter's sentinel screen value is not
    // meant to be resumed at directly; content re-renders from screen 0).
    expect(result.screen).toBe(0)
  })

  it('missing/corrupt saved object ({} — what getChapterState returns on parse failure) falls back to fresh-start defaults for every field', () => {
    const chapter = makeChapter({
      hook: { statement: 'x' },
      outcomes: { bullets: [] },
      recall: { questions: [] },
    })
    const result = computeInitialChapterState(chapter, {})
    expect(result).toEqual({
      hookDone: false,
      wylDone: false,
      recallDone: false,
      introDone: true,
      screen: 0,
      examinerAttempts: [],
      completed: false,
    })
  })
})

// Contract-level coverage only — go/goTo-specific delta and idx call-site
// framing is covered in tests/unit/chapterPlayer/lifecycle-regression.test.js instead
// of being repeated here.
describe('clampScreenIndex', () => {
  it('passes an in-range index through unchanged', () => {
    expect(clampScreenIndex(3, 10)).toBe(3)
  })

  it('clamps a negative index up to 0', () => {
    expect(clampScreenIndex(-5, 10)).toBe(0)
  })

  it('clamps an index at or beyond total up to total - 1', () => {
    expect(clampScreenIndex(10, 10)).toBe(9)
    expect(clampScreenIndex(99, 10)).toBe(9)
  })

  it('keeps the lower boundary (0) unchanged', () => {
    expect(clampScreenIndex(0, 10)).toBe(0)
  })

  it('keeps the upper boundary (total - 1) unchanged', () => {
    expect(clampScreenIndex(9, 10)).toBe(9)
  })

  it('always clamps to 0 for a single-screen chapter (total = 1)', () => {
    expect(clampScreenIndex(-1, 1)).toBe(0)
    expect(clampScreenIndex(0, 1)).toBe(0)
    expect(clampScreenIndex(5, 1)).toBe(0)
  })
})

// Contract-level coverage for the final-screen finish decision — mirrors
// ChapterPlayer.jsx's handleFinish priority order: examinerExplains gate
// (shown once) first, then examiner, then completion.
describe('resolveFinishAction', () => {
  it('given chapter.examinerExplains present and not yet shown, returns showExaminerExplains', () => {
    const chapter = makeChapter({ examinerExplains: { statement: 'x' } })
    expect(resolveFinishAction(chapter, { showExaminerExplains: false })).toEqual({ type: 'showExaminerExplains' })
  })

  it('given chapter.examinerExplains present and already shown, does not loop back — falls through to the examiner/complete check', () => {
    const chapter = makeChapter({ examinerExplains: { statement: 'x' } })
    expect(resolveFinishAction(chapter, { showExaminerExplains: true })).toEqual({ type: 'completeChapter' })
  })

  it('given no examinerExplains and chapter.examiner present, returns showExaminer', () => {
    const chapter = makeChapter({ examiner: { questions: [] } })
    expect(resolveFinishAction(chapter, { showExaminerExplains: false })).toEqual({ type: 'showExaminer' })
  })

  it('given neither examinerExplains nor examiner, returns completeChapter', () => {
    const chapter = makeChapter()
    expect(resolveFinishAction(chapter, { showExaminerExplains: false })).toEqual({ type: 'completeChapter' })
  })

  it('given both examinerExplains and examiner, examinerExplains takes priority while unshown', () => {
    const chapter = makeChapter({ examinerExplains: { statement: 'x' }, examiner: { questions: [] } })
    expect(resolveFinishAction(chapter, { showExaminerExplains: false })).toEqual({ type: 'showExaminerExplains' })
  })

  it('given both examinerExplains and examiner, once examinerExplains has been shown, examiner takes priority over completion', () => {
    const chapter = makeChapter({ examinerExplains: { statement: 'x' }, examiner: { questions: [] } })
    expect(resolveFinishAction(chapter, { showExaminerExplains: true })).toEqual({ type: 'showExaminer' })
  })

  it('given an empty chapter object and no options, tolerates missing fields and returns completeChapter (matches current handleFinish, which never receives an empty chapter in practice but this mirrors property-access-only logic)', () => {
    expect(resolveFinishAction({})).toEqual({ type: 'completeChapter' })
  })
})

// Contract-level coverage for the universal-opener gate decision — mirrors
// ChapterPlayer.jsx's three gate render blocks exactly: hook first (including
// the navTo='hook' override), then outcomes, then recall (including the
// navTo='recall' override).
describe('getChapterGate', () => {
  it('given hookDone=false and chapter.hook.statement present, returns the hook gate', () => {
    const chapter = makeChapter({ hook: { statement: 'x' } })
    expect(getChapterGate(chapter, { hookDone: false, wylDone: false, recallDone: false, navTo: null })).toEqual({ type: 'hook' })
  })

  it('given hookDone=true, wylDone=false, chapter.outcomes present, returns the outcomes gate', () => {
    const chapter = makeChapter({ outcomes: { bullets: [] } })
    expect(getChapterGate(chapter, { hookDone: true, wylDone: false, recallDone: false, navTo: null })).toEqual({ type: 'outcomes' })
  })

  it('given recallDone=false and chapter.recall present, after hook/outcomes are done, returns the recall gate', () => {
    const chapter = makeChapter({ recall: { questions: [] } })
    expect(getChapterGate(chapter, { hookDone: true, wylDone: true, recallDone: false, navTo: null })).toEqual({ type: 'recall' })
  })

  it('given navTo="recall", forces the recall gate even when recallDone is already true', () => {
    const chapter = makeChapter({ recall: { questions: [] } })
    expect(getChapterGate(chapter, { hookDone: true, wylDone: true, recallDone: true, navTo: 'recall' })).toEqual({ type: 'recall' })
  })

  it('given navTo="hook", forces the hook gate even when hookDone is already true', () => {
    const chapter = makeChapter({ hook: { statement: 'x' } })
    expect(getChapterGate(chapter, { hookDone: true, wylDone: true, recallDone: true, navTo: 'hook' })).toEqual({ type: 'hook' })
  })

  it('given a chapter with no hook, outcomes, or recall, returns no gate', () => {
    const chapter = makeChapter()
    expect(getChapterGate(chapter, { hookDone: true, wylDone: true, recallDone: true, navTo: null })).toEqual({ type: null })
  })

  it('given both hook and outcomes/recall conditions are satisfiable, hook takes priority', () => {
    const chapter = makeChapter({ hook: { statement: 'x' }, outcomes: { bullets: [] }, recall: { questions: [] } })
    expect(getChapterGate(chapter, { hookDone: false, wylDone: false, recallDone: false, navTo: null })).toEqual({ type: 'hook' })
  })

  it('given hook is done but outcomes and recall conditions are both satisfiable, outcomes takes priority over recall', () => {
    const chapter = makeChapter({ outcomes: { bullets: [] }, recall: { questions: [] } })
    expect(getChapterGate(chapter, { hookDone: true, wylDone: false, recallDone: false, navTo: null })).toEqual({ type: 'outcomes' })
  })
})

// ─── Completion hand-off ─────────────────────────────────────────────────────
// The hand-off must only ever offer a chapter the learner can actually open,
// and must never move them into a different GCSE subject on its own. Fixtures
// cover the edge cases; the real catalogue covers the named live behaviours.

const HANDOFF_CHAPTERS = [
  { id: 'p1', title: 'P1', subject: 'Alpha', screenCount: 4 },
  { id: 'p2', title: 'P2', subject: 'Alpha', screenCount: 4 },
  { id: 'p3', title: 'P3', subject: 'Alpha', screenCount: 0 },                         // comingSoon
  { id: 'p4', title: 'P4', subject: 'Alpha', screenCount: 4, availability: 'hidden' },
  { id: 'p5', title: 'P5', subject: 'Alpha', screenCount: 4 },
  { id: 'q1', title: 'Q1', subject: 'Alpha', screenCount: 0 },                         // all-stub module
  { id: 'r1', title: 'R1', subject: 'Beta',  screenCount: 4 },                         // other subject
  { id: 's1', title: 'S1', subject: 'Alpha', screenCount: 0 },
  { id: 's2', title: 'S2', subject: 'Alpha', screenCount: 4 },
]

const HANDOFF_MODULES = [
  { id: 'm_alpha_1',    title: 'Alpha one',   subject: 'Alpha', chapterIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6-does-not-exist'] },
  { id: 'm_alpha_stub', title: 'Alpha stubs', subject: 'Alpha', chapterIds: ['q1'] },
  { id: 'm_beta',       title: 'Beta',        subject: 'Beta',  chapterIds: ['r1'] },
  { id: 'm_alpha_2',    title: 'Alpha two',   subject: 'Alpha', chapterIds: ['s1', 's2'] },
]

const fixture = id => HANDOFF_CHAPTERS.find(chapter => chapter.id === id)
const handoff = (id, modules = HANDOFF_MODULES) =>
  resolveNextAvailableChapter(fixture(id), { modules, chapters: HANDOFF_CHAPTERS })

describe('resolveNextAvailableChapter — within the current module', () => {
  it('given the next chapter in the module is available, returns it', () => {
    expect(handoff('p1')).toMatchObject({ nextChapter: fixture('p2'), isNextModule: false })
  })

  it('skips a comingSoon chapter sitting between two available chapters', () => {
    const result = handoff('p2')
    expect(result.nextChapter.id).not.toBe('p3')
    expect(result).toMatchObject({ nextChapter: fixture('p5'), isNextModule: false })
  })

  it('skips a hidden chapter sitting between two available chapters', () => {
    const result = handoff('p2')
    expect(result.nextChapter.id).not.toBe('p4')
    expect(result.nextChapter.id).toBe('p5')
  })

  it('given the rest of the module is unavailable or a missing reference, returns no within-module successor', () => {
    expect(handoff('p5', [HANDOFF_MODULES[0]])).toBeNull()
  })
})

describe('resolveNextAvailableChapter — later modules in the same subject', () => {
  it('returns an available chapter from a later module of the same subject', () => {
    expect(handoff('p5')).toMatchObject({
      nextChapter: fixture('s2'),
      isNextModule: true,
      nextModule:   HANDOFF_MODULES[3],
    })
  })

  it('skips a same-subject module whose chapters are all unavailable', () => {
    expect(handoff('p5').nextChapter.id).not.toBe('q1')
  })

  it('never returns a chapter from a later module of another subject', () => {
    expect(handoff('p5').nextChapter.subject).toBe('Alpha')
    expect(handoff('r1')).toBeNull()
  })

  it('given no available same-subject successor exists, returns null', () => {
    expect(handoff('s2')).toBeNull()
  })

  it('given a chapter that belongs to no module, returns null', () => {
    expect(resolveNextAvailableChapter(
      { id: 'orphan', subject: 'Alpha', screenCount: 4 },
      { modules: HANDOFF_MODULES, chapters: HANDOFF_CHAPTERS },
    )).toBeNull()
  })
})

describe('buildChapterCompletePayload — real catalogue hand-offs', () => {
  const realChapter = id => CHAPTERS.find(chapter => chapter.id === id)

  it('math7 hands off to math8', () => {
    const payload = buildChapterCompletePayload(realChapter('math7'))
    expect(payload.nextChapter.id).toBe('math8')
    expect(payload.isFinalChapter).toBe(false)
    // Position inside the parent module, counted past any skipped chapter.
    expect(payload.nextChapterNum).toBe(8)
    expect(payload.nextChapterLabel).toBe('Chapter')
  })

  it('math8 has no automatic next chapter — it never crosses into another subject', () => {
    const payload = buildChapterCompletePayload(realChapter('math8'))
    expect(payload.nextChapter).toBeNull()
    expect(payload.isFinalChapter).toBe(true)
    expect(payload.completionType).toBe('subject')
    expect(payload.nextChapterTitle).toBeUndefined()
  })

  it('the Western Front has no automatic next chapter while the later History modules are all coming soon', () => {
    const payload = buildChapterCompletePayload(realChapter('history-medicine-western-front'))
    expect(payload.nextChapter).toBeNull()
    expect(payload.isFinalChapter).toBe(true)
  })

  it('skips the coming-soon Nightingale chapter inside Medicine Through Time', () => {
    const payload = buildChapterCompletePayload(realChapter('history-medicine-surgery-revolution'))
    expect(payload.nextChapter.id).toBe('history-medicine-accidental-miracle')
  })

  it('every chapter offered after any available chapter is itself available and in the same subject', () => {
    for (const chapter of CHAPTERS.filter(isChapterAvailable)) {
      const { nextChapter } = buildChapterCompletePayload(chapter)
      if (!nextChapter) continue
      expect(isChapterAvailable(nextChapter)).toBe(true)
      expect(nextChapter.subject).toBe(chapter.subject)
    }
  })
})
