import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest'

// The streak must follow the learner's LOCAL calendar day. The UK runs on
// BST (UTC+1) from late March to late October, so between 00:00 and 00:59
// local time the UTC date is still "yesterday" — a date source based on
// toISOString() stamps late-night revision onto the previous day, silently
// skipping the streak increment (and risking an unfair reset a day later).
//
// TZ must be set before any Date work in this worker so V8 renders local
// time as UK time. Restored in afterAll so it can't leak into other files
// that happen to share this worker process.
const ORIGINAL_TZ = process.env.TZ
process.env.TZ = 'Europe/London'

// Faithful in-memory localStorage (same pattern as learnerJourneys.test.js)
// so the REAL progress.js + storage.js run end-to-end.
function installLocalStorage() {
  const store = {}
  globalThis.localStorage = {
    get length() { return Object.keys(store).length },
    key: (i) => Object.keys(store)[i] ?? null,
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  }
  return store
}

beforeEach(() => { installLocalStorage() })
afterEach(() => { vi.useRealTimers() })
afterAll(() => {
  if (ORIGINAL_TZ === undefined) delete process.env.TZ
  else process.env.TZ = ORIGINAL_TZ
})

function setClock(iso) {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(iso))
}

describe('todayStr follows the local calendar day', () => {
  it('reports the new local day during the 00:00–00:59 BST window', async () => {
    const { todayStr } = await import('../../../src/progress.js')
    // 00:30 BST on the 18th is 23:30 UTC on the 17th.
    setClock('2026-07-18T00:30:00+01:00')
    expect(todayStr()).toBe('2026-07-18')
  })

  it('offsetDate(-1) gives the local yesterday in the same window', async () => {
    const { offsetDate } = await import('../../../src/progress.js')
    setClock('2026-07-18T00:30:00+01:00')
    expect(offsetDate(-1)).toBe('2026-07-17')
  })
})

describe('recordActivity across a local midnight', () => {
  it('increments the streak for a session just after local midnight', async () => {
    const { recordActivity, getProgress } = await import('../../../src/progress.js')
    const { setJson } = await import('../../../src/lib/storage.js')

    // Learner revised on the evening of the 17th, streak stood at 10.
    setJson('gcse_progress', { streak: 10, lastActivityDate: '2026-07-17', bestStreak: 10 })

    // They open the app at 00:30 local on the 18th — a new day for them.
    setClock('2026-07-18T00:30:00+01:00')
    recordActivity()

    const prog = getProgress()
    expect(prog.streak).toBe(11)
    expect(prog.lastActivityDate).toBe('2026-07-18')
  })

  it('does not reset the streak when the after-midnight day is followed by a normal evening', async () => {
    const { recordActivity, getProgress } = await import('../../../src/progress.js')
    const { setJson } = await import('../../../src/lib/storage.js')

    setJson('gcse_progress', { streak: 10, lastActivityDate: '2026-07-17', bestStreak: 10 })

    setClock('2026-07-18T00:30:00+01:00')
    recordActivity()

    setClock('2026-07-19T21:00:00+01:00')
    recordActivity()

    expect(getProgress().streak).toBe(12)
  })

  it('stays a no-op for a second session on the same local day', async () => {
    const { recordActivity, getProgress } = await import('../../../src/progress.js')
    const { setJson } = await import('../../../src/lib/storage.js')

    setJson('gcse_progress', { streak: 10, lastActivityDate: '2026-07-17', bestStreak: 10 })

    setClock('2026-07-18T00:30:00+01:00')
    recordActivity()
    setClock('2026-07-18T17:00:00+01:00')
    recordActivity()

    expect(getProgress().streak).toBe(11)
  })
})

describe('streak celebration once-per-day flag uses the local day', () => {
  it('a celebration shown yesterday evening shows again just after local midnight', async () => {
    const { shouldShowStreakCelebration, markStreakCelebrationShown } =
      await import('../../../src/features/streaks/streakCelebrationStorage.js')

    // Shown at 21:00 on the 17th…
    markStreakCelebrationShown(new Date('2026-07-17T21:00:00+01:00'))
    // …must be eligible again at 00:30 local on the 18th (a new local day),
    // and marking it then must suppress it for the REST of the 18th.
    const earlyHours = new Date('2026-07-18T00:30:00+01:00')
    expect(shouldShowStreakCelebration(5, earlyHours)).toBe(true)

    markStreakCelebrationShown(earlyHours)
    expect(shouldShowStreakCelebration(5, new Date('2026-07-18T09:00:00+01:00'))).toBe(false)
  })
})
