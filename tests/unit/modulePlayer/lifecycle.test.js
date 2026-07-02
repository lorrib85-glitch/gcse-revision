import { describe, it, expect } from 'vitest'
import { computeInitialModuleState, clampScreenIndex, resolveFinishAction } from '../../../src/app/moduleNavigation.js'

// ─────────────────────────────────────────────────────────────────────────
// ModulePlayer Phase 2 — pinned behaviour spec
//
// Behaviours below are converted to real assertions once the underlying
// logic is extracted out of ModulePlayer.jsx's component closure into a
// pure, importable function. As of this file:
//
//   - "fresh module start", "resume saved module state", "stale saved
//     screen index reset", and one "completed module reopening" item are
//     now real assertions against computeInitialModuleState (moduleNavigation.js).
//   - "go/goTo screen clamping" is now real assertions against
//     clampScreenIndex (moduleNavigation.js).
//   - "last-screen finish decision with examiner/examinerExplains" is now
//     real assertions against resolveFinishAction (moduleNavigation.js).
//     handleFinish's own side effects (setShowExaminerExplains,
//     setShowExaminer, detectWeakSpot/completeModule, scrollToTop) still
//     live inside ModulePlayer's component closure and are not covered here.
//   - Everything else (hook/outcomes/recall render gating, completeModule's
//     own persistence side effect) still lives entirely inside
//     `ModulePlayer`'s component closure (`nextLabel`, inline JSX `if`
//     gating). None of it is exported or callable in isolation, so none of
//     it can be asserted against from `tests/unit` yet:
//
//   - `tests/unit` runs under vitest environment: 'node' (vitest.config.js)
//     — there is no `document`/`window`, so ModulePlayer cannot be rendered.
//   - React function components can only call `useState`/`useEffect` inside
//     a real render pass; calling `ModulePlayer(props)` directly throws
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

function makeModule(overrides = {}) {
  return {
    id: 'test-module',
    screens: [{}, {}, {}, {}, {}],
    ...overrides,
  }
}

describe('ModulePlayer — fresh module start (src/components/layout/ModulePlayer.jsx:1478-1493, computeInitialModuleState)', () => {
  it('given no saved state and module.hook present, hookDone initialises to false', () => {
    const module = makeModule({ hook: { statement: 'x' } })
    expect(computeInitialModuleState(module, {}).hookDone).toBe(false)
  })

  it('given no saved state and module.hook absent, hookDone initialises to true', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, {}).hookDone).toBe(true)
  })

  it('given no saved state and module.outcomes present, wylDone initialises to false', () => {
    const module = makeModule({ outcomes: { bullets: [] } })
    expect(computeInitialModuleState(module, {}).wylDone).toBe(false)
  })

  it('given no saved state and module.outcomes absent, wylDone initialises to true', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, {}).wylDone).toBe(true)
  })

  it('given no saved state and module.recall present, recallDone initialises to false', () => {
    const module = makeModule({ recall: { questions: [] } })
    expect(computeInitialModuleState(module, {}).recallDone).toBe(false)
  })

  it('given no saved state, screen initialises to 0', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, {}).screen).toBe(0)
  })

  it('given no saved state, examinerAttempts initialises to []', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, {}).examinerAttempts).toEqual([])
  })

  it('given no saved state, completed initialises to false', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, {}).completed).toBe(false)
  })
})

describe('ModulePlayer — resume saved module state (src/components/layout/ModulePlayer.jsx:1478-1499, computeInitialModuleState)', () => {
  it('given saved.screen = 5, screen resumes at 5', () => {
    const module = makeModule({ screens: Array.from({ length: 10 }, () => ({})) })
    expect(computeInitialModuleState(module, { screen: 5 }).screen).toBe(5)
  })

  it('given saved.hookDone = true, hookDone resumes as true even when module.hook is present', () => {
    const module = makeModule({ hook: { statement: 'x' } })
    expect(computeInitialModuleState(module, { hookDone: true }).hookDone).toBe(true)
  })

  it('given saved.wylDone = true, wylDone resumes as true even when module.outcomes is present', () => {
    const module = makeModule({ outcomes: { bullets: [] } })
    expect(computeInitialModuleState(module, { wylDone: true }).wylDone).toBe(true)
  })

  it('given saved.hookDone and saved.wylDone are both true but recallDone was never saved, recallDone initialises to true (existing-progress users skip forced recall) — ModulePlayer.jsx:1480-1484', () => {
    const module = makeModule({ recall: { questions: [] } })
    const result = computeInitialModuleState(module, { hookDone: true, wylDone: true })
    expect(result.recallDone).toBe(true)
  })

  it('given saved.examinerAttempts is a populated array, examinerAttempts resumes from that array', () => {
    const module = makeModule()
    const attempts = [{ moduleId: 'test-module', finalMark: 4 }]
    expect(computeInitialModuleState(module, { examinerAttempts: attempts }).examinerAttempts).toEqual(attempts)
  })

  it('given saved.completed = true, completed resumes as true', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, { completed: true }).completed).toBe(true)
  })
})

describe('ModulePlayer — stale saved screen index reset (src/components/layout/ModulePlayer.jsx:1489-1493, computeInitialModuleState)', () => {
  it('given saved.screen < module.screens.length, screen resumes at saved.screen exactly', () => {
    const module = makeModule({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialModuleState(module, { screen: 2 }).screen).toBe(2)
  })

  it('given saved.screen === module.screens.length - 1 (last valid index), screen resumes at that index, not reset', () => {
    const module = makeModule({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialModuleState(module, { screen: 4 }).screen).toBe(4)
  })

  it('given saved.screen === module.screens.length (one past the end, e.g. after module restructure), screen resets to 0', () => {
    const module = makeModule({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialModuleState(module, { screen: 5 }).screen).toBe(0)
  })

  it('given saved.screen > module.screens.length, screen resets to 0', () => {
    const module = makeModule({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialModuleState(module, { screen: 99 }).screen).toBe(0)
  })

  it('given saved.screen is undefined, screen defaults to 0', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, {}).screen).toBe(0)
  })
})

describe('ModulePlayer — go/goTo screen clamping (src/components/layout/ModulePlayer.jsx:1511-1524, clampScreenIndex)', () => {
  // total = 5 throughout (matches makeModule()'s default screens length).
  // go(delta) calls clampScreenIndex(screen + delta, total); goTo(idx) calls
  // clampScreenIndex(idx, total) directly. See moduleNavigation.test.js for
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

describe('ModulePlayer — hook/outcomes/recall gating decisions (src/components/layout/ModulePlayer.jsx:1672,1691,1705)', () => {
  it.todo('hookDone=false and module.hook.statement present renders the hook gate, before any other content')
  it.todo('hookDone=true, wylDone=false, module.outcomes present renders the outcomes gate')
  it.todo('recallDone=false and module.recall present renders the recall gate, after hook/outcomes are done')
  it.todo('navTo="recall" forces the recall gate even when recallDone is already true')
  it.todo('navTo="hook" forces the hook gate even when hookDone is already true')
  it.todo('module has no hook, no outcomes, and no recall: all three gates are skipped and content renders on first mount')
})

describe('ModulePlayer — completed module reopening (src/components/layout/ModulePlayer.jsx:1556-1568, 1482-1484)', () => {
  it.todo('completeModule() persists screen=total, hookDone/wylDone/recallDone/introDone all true, and completed=true, regardless of the screen the user finished on')

  it('reopening a module with saved.completed=true starts directly at content — hook/outcomes/recall gates are all bypassed (computeInitialModuleState)', () => {
    const module = makeModule({
      hook: { statement: 'x' },
      outcomes: { bullets: [] },
      recall: { questions: [] },
    })
    // Matches the exact shape completeModule() persists (ModulePlayer.jsx:1563).
    const saved = {
      screen: module.screens.length,
      hookDone: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      completed: true,
    }
    const result = computeInitialModuleState(module, saved)
    expect(result.completed).toBe(true)
    expect(result.hookDone).toBe(true)
    expect(result.wylDone).toBe(true)
    expect(result.recallDone).toBe(true)
    expect(result.introDone).toBe(true)
    // completeModule's saved screen (= total) is one past the end, so the
    // stale-index guard resets it to 0 — content still renders correctly
    // because the hook/outcomes/recall gates are all already satisfied above.
    expect(result.screen).toBe(0)
  })

  it.todo('reviewing a completed module and navigating backward with go(-1) does not clear the persisted completed flag')
})

describe('ModulePlayer — last-screen finish decision with examiner/examinerExplains (src/components/layout/ModulePlayer.jsx:1529-1541, resolveFinishAction)', () => {
  it('isLast=true, module.examinerExplains present, showExaminerExplains=false: handleFinish shows ExaminerExplainsScreen and does not complete the module yet', () => {
    const module = makeModule({ examinerExplains: { statement: 'x' } })
    expect(resolveFinishAction(module, { showExaminerExplains: false })).toEqual({ type: 'showExaminerExplains' })
  })

  it('isLast=true, module.examinerExplains present, showExaminerExplains=true (already shown once): handleFinish falls through to the examiner/complete check instead of looping back to ExaminerExplainsScreen', () => {
    const module = makeModule({ examinerExplains: { statement: 'x' } })
    expect(resolveFinishAction(module, { showExaminerExplains: true })).toEqual({ type: 'completeModule' })
  })

  it('isLast=true, no examinerExplains, module.examiner present: handleFinish shows FaceTheExaminer', () => {
    const module = makeModule({ examiner: { questions: [] } })
    expect(resolveFinishAction(module, { showExaminerExplains: false })).toEqual({ type: 'showExaminer' })
  })

  it('isLast=true, no examinerExplains, no examiner: handleFinish calls detectWeakSpot, which completes the module directly', () => {
    const module = makeModule()
    expect(resolveFinishAction(module, { showExaminerExplains: false })).toEqual({ type: 'completeModule' })
  })
})
