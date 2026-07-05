import { describe, it, expect, vi, beforeEach } from 'vitest'

// In-memory store standing in for the storage.js persistence boundary.
let store = {}

vi.mock('../../src/lib/storage.js', () => ({
  getJson: vi.fn((key, fallback) => (key in store ? store[key] : fallback)),
  setJson: vi.fn((key, value) => { store[key] = value }),
  removeKey: vi.fn((key) => { delete store[key] }),
  getArray: vi.fn((key) => (key in store ? store[key] : [])),
  getObject: vi.fn((key) => (key in store ? store[key] : {})),
  listKeys: vi.fn((prefix = '') => Object.keys(store).filter(k => k.startsWith(prefix))),
}))

const { isTaskDoneToday, getNextPlannerItem, getTaskSubject } = await import('../../src/todaysPlan.js')
const { MODULES } = await import('../../src/modules.js')

const TODAY = new Date().toISOString().slice(0, 10)
const YESTERDAY = (() => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
})()

beforeEach(() => { store = {} })

describe('isTaskDoneToday', () => {
  it('marks the warm-up card done when a Quick Fire score was logged today', () => {
    store.gcse_scores = [{ date: TODAY, subject: 'Quick Fire', source: 'test', pct: 100 }]
    expect(isTaskDoneToday({ type: 'warmup' })).toBe(true)
  })

  it('leaves the warm-up card not-done when no score is logged today', () => {
    store.gcse_scores = [{ date: YESTERDAY, subject: 'Quick Fire', source: 'test', pct: 100 }]
    expect(isTaskDoneToday({ type: 'warmup' })).toBe(false)
  })

  it('marks a subject practice card done from a matching exam-round score today', () => {
    store.gcse_scores = [{ date: TODAY, subject: 'Chemistry', source: 'exam', pct: 80 }]
    const task = { type: 'practice', onSelect: { kind: 'practice', subject: 'Chemistry' } }
    expect(isTaskDoneToday(task)).toBe(true)
  })

  it('does not mark a practice card done from a different subject', () => {
    store.gcse_scores = [{ date: TODAY, subject: 'Maths', source: 'exam', pct: 80 }]
    const task = { type: 'practice', onSelect: { kind: 'practice', subject: 'Chemistry' } }
    expect(isTaskDoneToday(task)).toBe(false)
  })

  it('does not mark a practice card done from a module (non-exam) score', () => {
    store.gcse_scores = [{ date: TODAY, subject: 'Chemistry', source: 'module', pct: 80 }]
    const task = { type: 'practice', onSelect: { kind: 'practice', subject: 'Chemistry' } }
    expect(isTaskDoneToday(task)).toBe(false)
  })

  it('marks a "Random" mixed-practice card done from any exam-round score today', () => {
    store.gcse_scores = [{ date: TODAY, subject: 'History', source: 'exam', pct: 60 }]
    const task = { type: 'practice', onSelect: { kind: 'practice', subject: 'Random' } }
    expect(isTaskDoneToday(task)).toBe(true)
  })

  it('marks the weekend paper card done from a matching paper-round score today', () => {
    store.gcse_scores = [{ date: TODAY, subject: 'History', source: 'exam-paper', pct: 70 }]
    const task = { type: 'paper', onSelect: { kind: 'paper', subject: 'History' } }
    expect(isTaskDoneToday(task)).toBe(true)
  })

  it('does not mark the weekend paper card done from a same-subject practice-round score', () => {
    store.gcse_scores = [{ date: TODAY, subject: 'History', source: 'exam', pct: 70 }]
    const task = { type: 'paper', onSelect: { kind: 'paper', subject: 'History' } }
    expect(isTaskDoneToday(task)).toBe(false)
  })

  it('does not mark a practice card done from a paper-round score, even same subject', () => {
    store.gcse_scores = [{ date: TODAY, subject: 'History', source: 'exam-paper', pct: 70 }]
    const task = { type: 'practice', onSelect: { kind: 'practice', subject: 'History' } }
    expect(isTaskDoneToday(task)).toBe(false)
  })

  it('resets on a new day even with yesterday\'s completion still in the score log', () => {
    store.gcse_scores = [{ date: YESTERDAY, subject: 'Chemistry', source: 'exam', pct: 80 }]
    const task = { type: 'practice', onSelect: { kind: 'practice', subject: 'Chemistry' } }
    expect(isTaskDoneToday(task)).toBe(false)
  })

  it('leaves continue/revisit cards untracked (no date-stamped module signal)', () => {
    store.gcse_scores = [{ date: TODAY, subject: 'History', source: 'module', pct: 100 }]
    expect(isTaskDoneToday({ type: 'continue' })).toBe(false)
    expect(isTaskDoneToday({ type: 'revisit' })).toBe(false)
  })
})

describe('getNextPlannerItem', () => {
  const warmup = { type: 'warmup', doneToday: true }
  const lesson = { type: 'continue', doneToday: false }
  const practice = { type: 'practice', doneToday: false }

  it('returns the first incomplete item in plan order', () => {
    expect(getNextPlannerItem([warmup, lesson, practice])).toBe(lesson)
  })

  it('advances to the next item once the current one completes', () => {
    expect(getNextPlannerItem([warmup, { ...lesson, doneToday: true }, practice])).toBe(practice)
  })

  it('returns null when every item is complete', () => {
    expect(getNextPlannerItem([warmup, { ...lesson, doneToday: true }, { ...practice, doneToday: true }])).toBe(null)
  })

  it('also respects the planner-engine completed/status fields', () => {
    expect(getNextPlannerItem([{ completed: true }, { status: 'done' }, practice])).toBe(practice)
  })
})

describe('getTaskSubject', () => {
  it('reads the subject from practice/paper onSelect payloads', () => {
    expect(getTaskSubject({ onSelect: { kind: 'practice', subject: 'Chemistry' } })).toBe('Chemistry')
  })

  it('renders Random mixed practice as Mixed', () => {
    expect(getTaskSubject({ onSelect: { kind: 'practice', subject: 'Random' } })).toBe('Mixed')
  })

  it('resolves module-backed tasks via MODULES metadata', () => {
    const mod = MODULES[0]
    expect(getTaskSubject({ onSelect: { kind: 'module', moduleId: mod.id } })).toBe(mod.subject)
  })

  it('returns null for the mixed warm-up and for no task at all', () => {
    expect(getTaskSubject({ type: 'warmup', onSelect: { kind: 'quickfire' } })).toBe(null)
    expect(getTaskSubject(null)).toBe(null)
  })
})
