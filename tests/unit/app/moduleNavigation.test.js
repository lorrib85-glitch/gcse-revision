import { describe, it, expect } from 'vitest'
import {
  getStageNavigation,
  getCurrentStageFromNavigation,
  isFullScreenVideoScreen,
  computeInitialModuleState,
  clampScreenIndex,
} from '../../../src/app/moduleNavigation.js'

function makeModule(overrides = {}) {
  return {
    id: 'test-module',
    screens: [{}, {}, {}, {}, {}],
    ...overrides,
  }
}

describe('getStageNavigation', () => {
  it('returns the provided stage data when module.stageNavigation has exactly 6 entries', () => {
    const module = {
      stageNavigation: [
        { id: 'a', title: 'Alpha', description: 'first', screenIndex: 0 },
        { id: 'b', title: 'Beta', description: 'second', screenIndex: 2 },
        { id: 'c', title: 'Gamma', description: 'third', screenIndex: 4 },
        { id: 'd', title: 'Delta', description: 'fourth', screenIndex: 6 },
        { id: 'e', title: 'Epsilon', description: 'fifth', screenIndex: 8 },
        { id: 'f', title: 'Zeta', description: 'sixth', screenIndex: 10 },
      ],
    }
    const result = getStageNavigation(module, 12)
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
    const module = {
      stageNavigation: [
        { screenIndex: 0 },
        { screenIndex: 1 },
        { screenIndex: 2 },
        { screenIndex: 3 },
        { screenIndex: 4 },
        { screenIndex: 5 },
      ],
    }
    const result = getStageNavigation(module, 6)
    expect(result[0]).toEqual({ id: 'part-1', title: 'Part 1', description: '', screenIndex: 0 })
    expect(result[3]).toEqual({ id: 'part-4', title: 'Part 4', description: '', screenIndex: 3 })
  })

  it('returns the fallback six-stage navigation when module has no stageNavigation', () => {
    const module = {}
    const result = getStageNavigation(module, 12)
    expect(result).toHaveLength(6)
    expect(result.map(s => s.title)).toEqual(['Intro', 'Learn 1', 'Learn 2', 'Learn 3', 'Review', 'Exam prep'])
    expect(result[5].description).toBe('Exam practice and final application.')
    expect(result[0].description).toBe('')
  })

  it('returns the fallback when stageNavigation is present but not exactly 6 entries', () => {
    const module = { stageNavigation: [{ id: 'only-one', screenIndex: 0 }] }
    const result = getStageNavigation(module, 6)
    expect(result).toHaveLength(6)
    expect(result[0].id).toBe('fallback-1')
  })

  it('clamps fallback screenIndex values sensibly against total (module.screens.length)', () => {
    const module = {}
    const total = 12
    const result = getStageNavigation(module, total)
    // fallback screenIndex = min(total-1, floor((index/6) * total))
    expect(result.map(s => s.screenIndex)).toEqual([0, 2, 4, 6, 8, 10])
    result.forEach(stage => {
      expect(stage.screenIndex).toBeLessThanOrEqual(total - 1)
      expect(stage.screenIndex).toBeGreaterThanOrEqual(0)
    })
  })

  it('clamps explicit stage screenIndex values into [0, total-1] and defaults non-numeric to 0', () => {
    const module = {
      stageNavigation: [
        { id: 'a', title: 'A', screenIndex: -5 },
        { id: 'b', title: 'B', screenIndex: 999 },
        { id: 'c', title: 'C', screenIndex: 'not-a-number' },
        { id: 'd', title: 'D', screenIndex: 3 },
        { id: 'e', title: 'E', screenIndex: 4 },
        { id: 'f', title: 'F', screenIndex: 5 },
      ],
    }
    const result = getStageNavigation(module, 6)
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

describe('computeInitialModuleState', () => {
  it('fresh module with a hook: hookDone false, everything else at its own fresh default', () => {
    const module = makeModule({ hook: { statement: 'x' } })
    const result = computeInitialModuleState(module, {})
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

  it('fresh module without a hook: hookDone true (nothing to gate on)', () => {
    const module = makeModule()
    const result = computeInitialModuleState(module, {})
    expect(result.hookDone).toBe(true)
  })

  it('fresh module with outcomes: wylDone false', () => {
    const module = makeModule({ outcomes: { bullets: ['a'] } })
    expect(computeInitialModuleState(module, {}).wylDone).toBe(false)
  })

  it('fresh module without outcomes: wylDone true', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, {}).wylDone).toBe(true)
  })

  it('fresh module with recall: recallDone false', () => {
    const module = makeModule({ recall: { questions: [] } })
    expect(computeInitialModuleState(module, {}).recallDone).toBe(false)
  })

  it('fresh module without recall: recallDone true', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, {}).recallDone).toBe(true)
  })

  it('saved screen is restored when within range', () => {
    const module = makeModule({ screens: Array.from({ length: 10 }, () => ({})) })
    expect(computeInitialModuleState(module, { screen: 5 }).screen).toBe(5)
  })

  it('saved hookDone/wylDone/introDone are restored (introDone always true regardless)', () => {
    const module = makeModule({ hook: { statement: 'x' }, outcomes: { bullets: [] } })
    const result = computeInitialModuleState(module, { hookDone: true, wylDone: true })
    expect(result.hookDone).toBe(true)
    expect(result.wylDone).toBe(true)
    expect(result.introDone).toBe(true) // always true — mirrors current ModulePlayer behaviour exactly
  })

  it('saved recallDone is restored directly when true', () => {
    const module = makeModule({ recall: { questions: [] } })
    expect(computeInitialModuleState(module, { recallDone: true }).recallDone).toBe(true)
  })

  it('saved hookDone+wylDone both true implies recallDone true even if recallDone was never saved', () => {
    const module = makeModule({ recall: { questions: [] } })
    const result = computeInitialModuleState(module, { hookDone: true, wylDone: true })
    expect(result.recallDone).toBe(true)
  })

  it('saved examinerAttempts array is restored', () => {
    const module = makeModule()
    const saved = { examinerAttempts: [{ moduleId: 'x', finalMark: 3 }] }
    expect(computeInitialModuleState(module, saved).examinerAttempts).toEqual(saved.examinerAttempts)
  })

  it('stale saved screen index at exactly module.screens.length resets to 0', () => {
    const module = makeModule({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialModuleState(module, { screen: 5 }).screen).toBe(0)
  })

  it('stale saved screen index beyond module.screens.length resets to 0', () => {
    const module = makeModule({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialModuleState(module, { screen: 99 }).screen).toBe(0)
  })

  it('saved screen index at the last valid position (length - 1) is kept, not reset', () => {
    const module = makeModule({ screens: [{}, {}, {}, {}, {}] })
    expect(computeInitialModuleState(module, { screen: 4 }).screen).toBe(4)
  })

  it('missing saved.screen defaults to 0', () => {
    const module = makeModule()
    expect(computeInitialModuleState(module, {}).screen).toBe(0)
  })

  it('completed saved module reopens with all lifecycle flags respected and completed true', () => {
    const module = makeModule({
      hook: { statement: 'x' },
      outcomes: { bullets: [] },
      recall: { questions: [] },
    })
    // Matches the exact shape ModulePlayer's completeModule() persists (ModulePlayer.jsx:1563):
    // screen: total, hookDone/wylDone/recallDone/introDone: true, completed: true.
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
    // screen: total is one past the end, so the stale-index guard resets it to 0 —
    // this is existing behaviour (completeModule's sentinel screen value is not
    // meant to be resumed at directly; content re-renders from screen 0).
    expect(result.screen).toBe(0)
  })

  it('missing/corrupt saved object ({} — what getModuleState returns on parse failure) falls back to fresh-start defaults for every field', () => {
    const module = makeModule({
      hook: { statement: 'x' },
      outcomes: { bullets: [] },
      recall: { questions: [] },
    })
    const result = computeInitialModuleState(module, {})
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
// framing is covered in tests/unit/modulePlayer/lifecycle.test.js instead
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

  it('always clamps to 0 for a single-screen module (total = 1)', () => {
    expect(clampScreenIndex(-1, 1)).toBe(0)
    expect(clampScreenIndex(0, 1)).toBe(0)
    expect(clampScreenIndex(5, 1)).toBe(0)
  })
})
