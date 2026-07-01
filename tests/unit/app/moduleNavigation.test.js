import { describe, it, expect } from 'vitest'
import {
  getStageNavigation,
  getCurrentStageFromNavigation,
  isFullScreenVideoScreen,
} from '../../../src/app/moduleNavigation.js'

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
