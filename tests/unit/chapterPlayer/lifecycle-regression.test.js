import { describe, it, expect } from 'vitest'
import { computeInitialChapterState, clampScreenIndex, resolveFinishAction, getChapterGate } from '../../../src/app/chapterNavigation.js'

// ─────────────────────────────────────────────────────────────────────────
// ChapterPlayer Phase 2 — pinned behaviour spec
//
// Behaviours below are converted to real assertions once the underlying
// logic is extracted out of ChapterPlayer.jsx's component closure into a
// pure, importable function. As of this file:
//
//   - "fresh chapter start", "resume saved chapter state", "stale saved
//     screen index reset", and one "completed chapter reopening" item are
//     now real assertions against computeInitialChapterState (chapterNavigation.js).
//   - "go/goTo screen clamping" is now real assertions against
//     clampScreenIndex (chapterNavigation.js).
//   - "last-screen finish decision with examiner/examinerExplains" is now
//     real assertions against resolveFinishAction (chapterNavigation.js).
//     handleFinish's own side effects (setShowExaminerExplains,
//     setShowExaminer, detectWeakSpot/completeChapter, scrollToTop) still
//     live inside ChapterPlayer's component closure and are not covered here.
//   - "hook/outcomes/recall gating decisions" is now real assertions against
//     getChapterGate (chapterNavigation.js). The gate screens' own JSX and side
//     effects (setHookDone, setWylDone, setRecallDone, setNavTo, scrollToTop,
//     onBack handlers) still live inside ChapterPlayer's component closure and
//     are not covered here.
//   - Everything else (completeChapter's own persistence side effect) still
//     lives entirely inside `ChapterPlayer`'s component closure. None of it is
//     exported or callable in isolation, so none of it can be asserted
//     against from `tests/unit` yet:
//
//   - `tests/unit` runs under vitest environment: 'node' (vitest.config.js)
//     — there is no `document`/`window`, so ChapterPlayer cannot be rendered.
//   - React function components can only call `useState`/`useEffect` inside
//     a real render pass; calling `ChapterPlayer(props)` directly throws
//     "Invalid hook call" outside of one.
//   - There is no `@testing-library/react` or jsdom in this project's
//     dependency tree (only `@testing-library/dom` as a transitive dep of
//     Storybook's browser-mode Vitest addon, which renders via real
//     Chromium, not jsdom, and requires a `.stories.jsx` file per
//     COMPONENT_AUTHORING_RULES.md).
//   - Extracting the remaining logic into pure, importable functions is
//     out of scope for this pass.
//
// Each remaining `it.todo(...)` names one pinned behaviour, in given/when/
// then form, with the exact current source location. When its extraction
// lands, replace the matching `it.todo` with a real `it` the same way the
// items below were converted.
// ─────────────────────────────────────────────────────────────────────────

function makeChapter(overrides = {}) {
  return {
    id: 'test-chapter',
    screens: [{}, {}, {}, {}, {}],
    ...overrides,
  }
}

describe('ChapterPlayer — fresh chapter start (src/components/layout/ChapterPlayer.jsx:1478-1493, computeInitialChapterState)', () => {
  it('given no saved state and chapter.hook present, hookDone initialises to false', () => {
    const chapter = makeChapter({ hook: { statement: 'x' } })
    expect(computeInitialChapterState(chapter, {}).hookDone).toBe(false)
  })

  it('given no saved state and chapter.hook absent, hookDone initialises to true', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, {}).hookDone).toBe(true)
  })

  it('given no saved state and chapter.outcomes present, wylDone initialises to false', () => {
    const chapter = makeChapter({ outcomes: { bullets: [] } })
    expect(computeInitialChapterState(chapter, {}).wylDone).toBe(false)
  })

  it('given no saved state and chapter.outcomes absent, wylDone initialises to true', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, {}).wylDone).toBe(true)
  })

  it('given no saved state and chapter.recall present, recallDone initialises to false', () => {
    const chapter = makeChapter({ recall: { questions: [] } })
    expect(computeInitialChapterState(chapter, {}).recallDone).toBe(false)
  })

  it('given no saved state, screen initialises to 0', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, {}).screen).toBe(0)
  })

  it('given no saved state, examinerAttempts initialises to []', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, {}).examinerAttempts).toEqual([])
  })

  it('given no saved state, completed initialises to false', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, {}).completed).toBe(false)
  })
})

describe('ChapterPlayer — resume saved chapter state (src/components/layout/ChapterPlayer.jsx:1478-1499, computeInitialChapterState)', () => {
  it('given saved.screen = 5, screen resumes at 5', () => {
    const chapter = makeChapter({ screens: Array.from({ length: 10 }, () => ({})) })
    expect(computeInitialChapterState(chapter, { screen: 5 }).screen).toBe(5)
  })

  it('given saved.hookDone = true, hookDone resumes as true even when chapter.hook is present', () => {
    const chapter = makeChapter({ hook: { statement: 'x' } })
    expect(computeInitialChapterState(chapter, { hookDone: true }).hookDone).toBe(true)
  })

  it('given saved.wylDone = true, wylDone resumes as true even when chapter.outcomes is present', () => {
    const chapter = makeChapter({ outcomes: { bullets: [] } })
    expect(computeInitialChapterState(chapter, { wylDone: true }).wylDone).toBe(true)
  })

  it('given saved.hookDone and saved.wylDone are both true but recallDone was never saved, recallDone initialises to true (existing-progress users skip forced recall) — ChapterPlayer.jsx:1480-1484', () => {
    const chapter = makeChapter({ recall: { questions: [] } })
    const result = computeInitialChapterState(chapter, { hookDone: true, wylDone: true })
    expect(result.recallDone).toBe(true)
  })

  it('given saved.examinerAttempts is a populated array, examinerAttempts resumes from that array', () => {
    const chapter = makeChapter()
    const attempts = [{ chapterId: 'test-chapter', finalMark: 4 }]
    expect(computeInitialChapterState(chapter, { examinerAttempts: attempts }).examinerAttempts).toEqual(attempts)
  })

  it('given saved.completed = true, completed resumes as true', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, { completed: true }).completed).toBe(true)
  })
})

describe('ChapterPlayer — stale saved screen index reset (src/components/layout/ChapterPlayer.jsx:1489-1493, computeInitialChapterState)', () => {
  it('given saved.screen < chapter.screens.length, screen resumes at saved.screen exactly', () => {
    const chapter = makeChapter({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialChapterState(chapter, { screen: 2 }).screen).toBe(2)
  })

  it('given saved.screen === chapter.screens.length - 1 (last valid index), screen resumes at that index, not reset', () => {
    const chapter = makeChapter({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialChapterState(chapter, { screen: 4 }).screen).toBe(4)
  })

  it('given saved.screen === chapter.screens.length (one past the end, e.g. after chapter restructure), screen resets to 0', () => {
    const chapter = makeChapter({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialChapterState(chapter, { screen: 5 }).screen).toBe(0)
  })

  it('given saved.screen > chapter.screens.length, screen resets to 0', () => {
    const chapter = makeChapter({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialChapterState(chapter, { screen: 99 }).screen).toBe(0)
  })

  it('given saved.screen is undefined, screen defaults to 0', () => {
    const chapter = makeChapter()
    expect(computeInitialChapterState(chapter, {}).screen).toBe(0)
  })
})

describe('ChapterPlayer — go/goTo screen clamping (src/components/layout/ChapterPlayer.jsx:1511-1524, clampScreenIndex)', () => {
  // total = 5 throughout (matches makeChapter()'s default screens length).
  // go(delta) calls clampScreenIndex(screen + delta, total); goTo(idx) calls
  // clampScreenIndex(idx, total) directly. See chapterNavigation.test.js for
  // clampScreenIndex's own contract-level boundary coverage — these assert
  // the delta/idx call-site framing specific to go/goTo instead of repeating it.
  const total = 5

  it('go(1) from the last screen index does not overflow past total - 1', () => {
    const screen = total - 1 // 4
    expect(clampScreenIndex(screen + 1, total)).toBe(total - 1)
  })

  it('go(-1) from screen 0 does not underflow below 0', () => {
    const screen = 0
    expect(clampScreenIndex(screen - 1, total)).toBe(0)
  })

  it('go(1) from a middle screen increments screen by exactly 1', () => {
    const screen = 2
    expect(clampScreenIndex(screen + 1, total)).toBe(3)
  })

  it('go(-1) from a middle screen decrements screen by exactly 1', () => {
    const screen = 2
    expect(clampScreenIndex(screen - 1, total)).toBe(1)
  })

  it('goTo(idx) with idx < 0 clamps to 0', () => {
    expect(clampScreenIndex(-3, total)).toBe(0)
  })

  it('goTo(idx) with idx >= total clamps to total - 1', () => {
    expect(clampScreenIndex(8, total)).toBe(total - 1)
  })

  it('goTo(idx) with idx within range navigates to idx exactly', () => {
    expect(clampScreenIndex(3, total)).toBe(3)
  })
})

describe('ChapterPlayer — hook/outcomes/recall gating decisions (src/components/layout/ChapterPlayer.jsx:1665-1721, getChapterGate)', () => {
  it('hookDone=false and chapter.hook.statement present renders the hook gate, before any other content', () => {
    const chapter = makeChapter({ hook: { statement: 'x' }, outcomes: { bullets: [] }, recall: { questions: [] } })
    const gate = getChapterGate(chapter, { hookDone: false, wylDone: false, recallDone: false, navTo: null })
    expect(gate.type).toBe('hook')
  })

  it('hookDone=true, wylDone=false, chapter.outcomes present renders the outcomes gate', () => {
    const chapter = makeChapter({ outcomes: { bullets: [] }, recall: { questions: [] } })
    const gate = getChapterGate(chapter, { hookDone: true, wylDone: false, recallDone: false, navTo: null })
    expect(gate.type).toBe('outcomes')
  })

  it('recallDone=false and chapter.recall present renders the recall gate, after hook/outcomes are done', () => {
    const chapter = makeChapter({ recall: { questions: [] } })
    const gate = getChapterGate(chapter, { hookDone: true, wylDone: true, recallDone: false, navTo: null })
    expect(gate.type).toBe('recall')
  })

  it('navTo="recall" forces the recall gate even when recallDone is already true', () => {
    const chapter = makeChapter({ recall: { questions: [] } })
    const gate = getChapterGate(chapter, { hookDone: true, wylDone: true, recallDone: true, navTo: 'recall' })
    expect(gate.type).toBe('recall')
  })

  it('navTo="hook" forces the hook gate even when hookDone is already true', () => {
    const chapter = makeChapter({ hook: { statement: 'x' } })
    const gate = getChapterGate(chapter, { hookDone: true, wylDone: true, recallDone: true, navTo: 'hook' })
    expect(gate.type).toBe('hook')
  })

  it('chapter has no hook, no outcomes, and no recall: all three gates are skipped and content renders on first mount', () => {
    const chapter = makeChapter()
    const gate = getChapterGate(chapter, { hookDone: true, wylDone: true, recallDone: true, navTo: null })
    expect(gate.type).toBe(null)
  })
})

describe('ChapterPlayer — completed chapter reopening (src/components/layout/ChapterPlayer.jsx:1556-1568, 1482-1484)', () => {
  it.todo('completeChapter() persists screen=total, hookDone/wylDone/recallDone/introDone all true, and completed=true, regardless of the screen the user finished on')

  it('reopening a chapter with saved.completed=true starts directly at content — hook/outcomes/recall gates are all bypassed (computeInitialChapterState)', () => {
    const chapter = makeChapter({
      hook: { statement: 'x' },
      outcomes: { bullets: [] },
      recall: { questions: [] },
    })
    // Matches the exact shape completeChapter() persists (ChapterPlayer.jsx:1563).
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
    // completeChapter's saved screen (= total) is one past the end, so the
    // stale-index guard resets it to 0 — content still renders correctly
    // because the hook/outcomes/recall gates are all already satisfied above.
    expect(result.screen).toBe(0)
  })

  it.todo('reviewing a completed chapter and navigating backward with go(-1) does not clear the persisted completed flag')
})

describe('ChapterPlayer — last-screen finish decision with examiner/examinerExplains (src/components/layout/ChapterPlayer.jsx:1529-1541, resolveFinishAction)', () => {
  it('isLast=true, chapter.examinerExplains present, showExaminerExplains=false: handleFinish shows ExaminerExplainsScreen and does not complete the chapter yet', () => {
    const chapter = makeChapter({ examinerExplains: { statement: 'x' } })
    expect(resolveFinishAction(chapter, { showExaminerExplains: false })).toEqual({ type: 'showExaminerExplains' })
  })

  it('isLast=true, chapter.examinerExplains present, showExaminerExplains=true (already shown once): handleFinish falls through to the examiner/complete check instead of looping back to ExaminerExplainsScreen', () => {
    const chapter = makeChapter({ examinerExplains: { statement: 'x' } })
    expect(resolveFinishAction(chapter, { showExaminerExplains: true })).toEqual({ type: 'completeChapter' })
  })

  it('isLast=true, no examinerExplains, chapter.examiner present: handleFinish shows FaceTheExaminer', () => {
    const chapter = makeChapter({ examiner: { questions: [] } })
    expect(resolveFinishAction(chapter, { showExaminerExplains: false })).toEqual({ type: 'showExaminer' })
  })

  it('isLast=true, no examinerExplains, no examiner: handleFinish calls detectWeakSpot, which completes the chapter directly', () => {
    const chapter = makeChapter()
    expect(resolveFinishAction(chapter, { showExaminerExplains: false })).toEqual({ type: 'completeChapter' })
  })
})
