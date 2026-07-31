import { describe, it, expect, beforeEach } from 'vitest'
import {
  STUDY_TIME_KEY,
  addStudySeconds,
  formatStudyTime,
  readStudyTime,
} from '../../../src/features/progress/studyTime.js'
import { getJson, setJson } from '../../../src/lib/storage.js'
import { todayStr } from '../../../src/progress.js'

// node env has no localStorage; a real Map-backed fake exercises the actual
// storage.js path (matches the pattern used by quickFireMemory.test.js).
const fakeStore = new Map()
globalThis.localStorage = {
  get length() { return fakeStore.size },
  key: (i) => Array.from(fakeStore.keys())[i] ?? null,
  getItem: key => (fakeStore.has(key) ? fakeStore.get(key) : null),
  setItem: (key, value) => fakeStore.set(key, String(value)),
  removeItem: key => fakeStore.delete(key),
}

beforeEach(() => fakeStore.clear())

describe('readStudyTime — nothing recorded yet', () => {
  it('reports a genuine zero rather than an estimate', () => {
    expect(readStudyTime()).toEqual({ totalSeconds: 0, daysStudied: 0 })
  })
})

describe('addStudySeconds', () => {
  it('accumulates seconds against the local calendar date', () => {
    addStudySeconds(30)
    addStudySeconds(90)
    const stored = getJson(STUDY_TIME_KEY, {})
    expect(stored[todayStr()]).toBe(120)
    expect(readStudyTime()).toEqual({ totalSeconds: 120, daysStudied: 1 })
  })

  it('totals across every day on record, not just today', () => {
    addStudySeconds(60)
    // Simulate an older day already on record.
    setJson(STUDY_TIME_KEY, { ...getJson(STUDY_TIME_KEY, {}), '2020-01-04': 3600 })
    expect(readStudyTime()).toEqual({ totalSeconds: 3660, daysStudied: 2 })
  })

  it('ignores non-positive, non-finite and absurd tick values', () => {
    addStudySeconds(0)
    addStudySeconds(-500)
    addStudySeconds(NaN)
    addStudySeconds(undefined)
    // A tab resumed after hours must not dump a whole afternoon in one tick.
    addStudySeconds(60 * 60 * 5)
    expect(readStudyTime().totalSeconds).toBe(0)
  })

  it('adds today without disturbing days already on record', () => {
    setJson(STUDY_TIME_KEY, { '2020-01-01': 60, '2020-01-02': 120 })
    addStudySeconds(30)
    expect(getJson(STUDY_TIME_KEY, {})).toEqual({
      '2020-01-01': 60, '2020-01-02': 120, [todayStr()]: 30,
    })
  })
})

describe('formatStudyTime', () => {
  it('reads as encouragement, not as a stopwatch', () => {
    expect(formatStudyTime(0)).toBe('0m')
    expect(formatStudyTime(45)).toBe('0m')
    expect(formatStudyTime(60)).toBe('1m')
    expect(formatStudyTime(59 * 60)).toBe('59m')
    expect(formatStudyTime(60 * 60)).toBe('1h 0m')
    expect(formatStudyTime(4 * 3600 + 7 * 60)).toBe('4h 7m')
  })
})
