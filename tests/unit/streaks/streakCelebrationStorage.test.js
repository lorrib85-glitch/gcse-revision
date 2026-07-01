import { describe, it, expect, vi, beforeEach } from 'vitest'

// In-memory fake so shouldShowStreakCelebration/markStreakCelebrationShown
// round-trip through the same store, without touching real localStorage.
const store = new Map()

vi.mock('../../../src/lib/storage.js', () => ({
  getJson: vi.fn((key, fallback) => (store.has(key) ? store.get(key) : fallback)),
  setJson: vi.fn((key, value) => { store.set(key, value) }),
  removeKey: vi.fn((key) => { store.delete(key) }),
}))

// Imported after the mock so vitest's hoisted vi.mock() is already in place.
const {
  shouldShowStreakCelebration,
  markStreakCelebrationShown,
  getCompletedWeekDays,
  getTodayIndex,
} = await import('../../../src/features/streaks/streakCelebrationStorage.js')

const MONDAY = new Date('2026-06-22') // known Monday
const TUESDAY = new Date('2026-06-23')

beforeEach(() => {
  store.clear()
})

describe('shouldShowStreakCelebration', () => {
  it('does not show when streakCount is 0', () => {
    expect(shouldShowStreakCelebration(0, MONDAY)).toBe(false)
  })

  it('does not show when streakCount is negative or missing', () => {
    expect(shouldShowStreakCelebration(-1, MONDAY)).toBe(false)
    expect(shouldShowStreakCelebration(undefined, MONDAY)).toBe(false)
  })

  it('shows when streakCount > 0 and not yet shown today', () => {
    expect(shouldShowStreakCelebration(3, MONDAY)).toBe(true)
  })

  it('does not show again once marked shown today', () => {
    markStreakCelebrationShown(MONDAY)
    expect(shouldShowStreakCelebration(3, MONDAY)).toBe(false)
  })

  it('shows again on a new date even if shown the previous day', () => {
    markStreakCelebrationShown(MONDAY)
    expect(shouldShowStreakCelebration(3, TUESDAY)).toBe(true)
  })
})

describe('getTodayIndex', () => {
  it('maps Monday to 0 and Sunday to 6', () => {
    expect(getTodayIndex(MONDAY)).toBe(0)
    expect(getTodayIndex(new Date('2026-06-28'))).toBe(6) // Sunday
  })
})

describe('getCompletedWeekDays', () => {
  it('returns all-false when there is no streak', () => {
    expect(getCompletedWeekDays(0, TUESDAY)).toEqual([false, false, false, false, false, false, false])
  })

  it('marks only the trailing streak days up to today', () => {
    // Thursday, streak of 3 -> Tue, Wed, Thu completed; Mon/Fri/Sat/Sun not
    const THURSDAY = new Date('2026-06-25')
    expect(getCompletedWeekDays(3, THURSDAY)).toEqual([false, true, true, true, false, false, false])
  })

  it('caps completion at the start of the current week even with a longer streak', () => {
    // Streak of 30 days ending on Tuesday still only fills Mon+Tue this week
    expect(getCompletedWeekDays(30, TUESDAY)).toEqual([true, true, false, false, false, false, false])
  })

  it('marks the whole week when streak covers every day so far', () => {
    const SUNDAY = new Date('2026-06-28')
    expect(getCompletedWeekDays(7, SUNDAY)).toEqual([true, true, true, true, true, true, true])
  })
})
