import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getJson, setJson, removeKey, getArray, getObject, listKeys, saveCritical, subscribeSaveFailure } from '../../../src/lib/storage.js'

// In-memory localStorage stub (node environment has none).
function installLocalStorageStub() {
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

function quotaError() {
  const err = new Error('quota')
  err.name = 'QuotaExceededError'
  return err
}

describe('storage.js persistence boundary', () => {
  let store
  let warnSpy

  beforeEach(() => {
    store = installLocalStorageStub()
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('getJson round-trips values written by setJson', () => {
    expect(setJson('k', { a: 1 })).toBe(true)
    expect(getJson('k', null)).toEqual({ a: 1 })
  })

  it('getJson falls back safely on malformed JSON', () => {
    store['bad'] = '{not json'
    expect(getJson('bad', { fallback: true })).toEqual({ fallback: true })
    expect(getArray('bad')).toEqual([])
    expect(getObject('bad')).toEqual({})
  })

  it('getJson returns the fallback for missing keys', () => {
    expect(getJson('missing', 'fb')).toBe('fb')
    expect(getArray('missing')).toEqual([])
    expect(getObject('missing')).toEqual({})
  })

  it('setJson returns false and warns loudly on QuotaExceededError', () => {
    globalThis.localStorage.setItem = () => { throw quotaError() }
    expect(setJson('k', { a: 1 })).toBe(false)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('quota exceeded'))
    expect(warnSpy.mock.calls[0][0]).toContain('NOT being saved')
  })

  it('setJson returns false (not silent success) on any other write failure', () => {
    globalThis.localStorage.setItem = () => { throw new Error('boom') }
    expect(setJson('k', 1)).toBe(false)
    expect(warnSpy).toHaveBeenCalled()
  })

  it('removeKey reports success and failure', () => {
    store['k'] = '1'
    expect(removeKey('k')).toBe(true)
    expect('k' in store).toBe(false)
    globalThis.localStorage.removeItem = () => { throw new Error('boom') }
    expect(removeKey('other')).toBe(false)
  })

  it('listKeys filters by prefix and never throws', () => {
    setJson('gcse_module_a', 1)
    setJson('gcse_module_b', 2)
    setJson('riseUser', {})
    expect(listKeys('gcse_module_').sort()).toEqual(['gcse_module_a', 'gcse_module_b'])
    delete globalThis.localStorage
    expect(listKeys('gcse_')).toEqual([])
  })
})

describe('storage.js saveCritical + failure bus', () => {
  let store
  let warnSpy

  beforeEach(() => {
    store = installLocalStorageStub()
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => warnSpy.mockRestore())

  it('a successful critical save persists and emits no failure', () => {
    const listener = vi.fn()
    const unsub = subscribeSaveFailure(listener)
    expect(saveCritical('gcse_scores', [{ pct: 80 }])).toBe(true)
    expect(getJson('gcse_scores', null)).toEqual([{ pct: 80 }])
    expect(listener).not.toHaveBeenCalled()
    unsub()
  })

  it('a failed critical save returns false and emits a failure with a retry closure', () => {
    globalThis.localStorage.setItem = () => { const e = new Error('full'); e.name = 'QuotaExceededError'; throw e }
    const listener = vi.fn()
    const unsub = subscribeSaveFailure(listener)
    expect(saveCritical('gcse_scores', [{ pct: 80 }])).toBe(false)
    expect(listener).toHaveBeenCalledTimes(1)
    const detail = listener.mock.calls[0][0]
    expect(detail.key).toBe('gcse_scores')
    expect(typeof detail.retry).toBe('function')
    unsub()
  })

  it('the retry closure re-attempts the same save and succeeds once storage recovers', () => {
    let full = true
    const realSet = store // capture stub store
    globalThis.localStorage.setItem = (k, v) => {
      if (full) { const e = new Error('full'); e.name = 'QuotaExceededError'; throw e }
      realSet[k] = String(v)
    }
    const listener = vi.fn()
    const unsub = subscribeSaveFailure(listener)
    expect(saveCritical('gcse_module_x', { screen: 4 })).toBe(false)
    const { retry } = listener.mock.calls[0][0]
    full = false // storage frees up
    expect(retry()).toBe(true)
    expect(getJson('gcse_module_x', null)).toEqual({ screen: 4 })
    unsub()
  })

  it('unsubscribing stops further failure notifications', () => {
    globalThis.localStorage.setItem = () => { throw new Error('boom') }
    const listener = vi.fn()
    const unsub = subscribeSaveFailure(listener)
    unsub()
    expect(saveCritical('k', 1)).toBe(false)
    expect(listener).not.toHaveBeenCalled()
  })
})
