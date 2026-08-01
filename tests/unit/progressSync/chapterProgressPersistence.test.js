import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  getChapterPct,
  getChapterState,
  saveChapterState,
} from '../../../src/progress.js'
import { GUEST_SCOPE, setActiveScope } from '../../../src/lib/storage.js'

function installLocalStorage() {
  const store = {}
  globalThis.localStorage = {
    get length() { return Object.keys(store).length },
    key: index => Object.keys(store)[index] ?? null,
    getItem: key => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: key => { delete store[key] },
    clear: () => { for (const key of Object.keys(store)) delete store[key] },
  }
  return store
}

let store

beforeEach(() => {
  store = installLocalStorage()
  setActiveScope(GUEST_SCOPE)
})

afterEach(() => setActiveScope(GUEST_SCOPE))

describe('canonical chapter progress persistence', () => {
  it('migrates a complete legacy state without losing opener or examiner data', () => {
    const state = {
      screen: 7,
      completed: true,
      hookDone: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      examinerAttempts: [{ questionId: 'q1', mark: 5 }],
    }
    store['guest::gcse_module_history-medicine-black-death'] = JSON.stringify(state)

    expect(getChapterState('history-medicine-black-death')).toEqual(state)
    expect(JSON.parse(store['guest::gcse_chapter_history-medicine-black-death'])).toEqual(state)
    expect(store['guest::gcse_module_history-medicine-black-death']).toBeUndefined()
  })

  it('folds canonical and legacy copies monotonically into one state', () => {
    store['guest::gcse_chapter_history-medicine-germ-theory'] = JSON.stringify({
      screen: 4,
      hookDone: true,
      examinerAttempts: [{ id: 'canonical' }],
      note: 'canonical wins unknown-field ties',
    })
    store['guest::gcse_module_history-medicine-germ-theory'] = JSON.stringify({
      screen: 9,
      completed: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      examinerAttempts: [{ id: 'legacy' }],
      note: 'legacy',
    })

    expect(getChapterState('history-medicine-germ-theory')).toEqual({
      screen: 9,
      completed: true,
      hookDone: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      examinerAttempts: [{ id: 'canonical' }, { id: 'legacy' }],
      note: 'canonical wins unknown-field ties',
    })
  })

  it('maps historical short ids directly to the current chapter id', () => {
    store['guest::gcse_module_mod8'] = JSON.stringify({ screen: 6, completed: true })

    expect(getChapterState('history-medicine-modern-medicine')).toEqual({
      screen: 6,
      completed: true,
    })
    expect(JSON.parse(store['guest::gcse_chapter_history-medicine-modern-medicine']))
      .toEqual({ screen: 6, completed: true })
    expect(store['guest::gcse_module_mod8']).toBeUndefined()
  })

  it('canonical saves write only gcse_chapter keys', () => {
    expect(saveChapterState('chapter-a', { screen: 2 })).toBe(true)
    expect(saveChapterState('chapter-b', { screen: 3 })).toBe(true)

    expect(JSON.parse(store['guest::gcse_chapter_chapter-a'])).toEqual({ screen: 2 })
    expect(JSON.parse(store['guest::gcse_chapter_chapter-b'])).toEqual({ screen: 3 })
    expect(Object.keys(store).some(key => key.includes('gcse_module_'))).toBe(false)
    expect(getChapterState('chapter-b')).toEqual({ screen: 3 })
  })

  it('keeps the fallback intact when canonical migration cannot be persisted', () => {
    store['guest::gcse_module_history-medicine-cancer'] = JSON.stringify({ screen: 8 })
    const originalSetItem = globalThis.localStorage.setItem
    globalThis.localStorage.setItem = (key, value) => {
      if (key.includes('gcse_chapter_')) {
        const error = new Error('full')
        error.name = 'QuotaExceededError'
        throw error
      }
      originalSetItem(key, value)
    }

    expect(getChapterState('history-medicine-cancer')).toEqual({ screen: 8 })
    expect(JSON.parse(store['guest::gcse_module_history-medicine-cancer'])).toEqual({ screen: 8 })
    expect(store['guest::gcse_chapter_history-medicine-cancer']).toBeUndefined()
  })

  // ChapterPlayer's two persisted shapes, read back through the real store. The
  // shapes themselves are asserted field-by-field in
  // tests/unit/app/chapterNavigation.test.js; this proves saveChapterState /
  // getChapterState round-trip them and that a later review save cannot rewind
  // completion or drop examiner attempts.
  it('round-trips a completion snapshot, then a backward review save, without losing completion or examiner attempts', () => {
    const chapter = { id: 'chapter-review', screenCount: 8 }
    const attempts = [{ chapterId: 'chapter-review', questionId: 'chapter-review-q1', finalMark: 5 }]
    const completion = {
      screen: 8,
      hookDone: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      examinerAttempts: attempts,
      completed: true,
    }

    expect(saveChapterState(chapter.id, completion)).toBe(true)
    expect(getChapterState(chapter.id)).toEqual(completion)
    expect(getChapterPct(chapter)).toBe(100)

    const review = { ...completion, screen: 2 }
    expect(saveChapterState(chapter.id, review)).toBe(true)
    expect(getChapterState(chapter.id)).toEqual(review)
    expect(getChapterState(chapter.id).completed).toBe(true)
    expect(getChapterState(chapter.id).examinerAttempts).toEqual(attempts)
    expect(getChapterPct(chapter)).toBe(100)

    expect(Object.keys(store)).toEqual(['guest::gcse_chapter_chapter-review'])
  })

  it('calculates percentage from canonical state and keeps completion sticky', () => {
    const chapter = { id: 'chapter-pct', screenCount: 10 }
    saveChapterState(chapter.id, { screen: 4 })
    expect(getChapterPct(chapter)).toBe(40)
    saveChapterState(chapter.id, { screen: 1, completed: true })
    expect(getChapterPct(chapter)).toBe(100)
  })
})
