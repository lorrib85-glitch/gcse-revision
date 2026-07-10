import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getJson, setJson, removeKey, getArray, getObject, listKeys } from '../../../src/lib/storage.js'

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
