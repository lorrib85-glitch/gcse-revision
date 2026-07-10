import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getJson, setJson, removeKey, getArray, getObject, listKeys, saveCritical, subscribeSaveFailure,
  getJsonForScope, setJsonForScope, removeKeyForScope, listKeysForScope,
  getRawJson, setRawJson, removeRawKey,
  setActiveScope, scopeForUser, GUEST_SCOPE, QUARANTINE_SCOPE, QUARANTINE_PROFILE_KEY,
  runLegacyFlatMigration,
} from '../../../src/lib/storage.js'

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
    setJson('k', '1')
    expect(removeKey('k')).toBe(true)
    expect(getJson('k', null)).toBe(null)
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

describe('storage.js account scoping', () => {
  beforeEach(() => {
    installLocalStorageStub()
  })

  afterEach(() => {
    setActiveScope(GUEST_SCOPE)
  })

  it('scopeForUser namespaces Google accounts by uid and everyone else as guest', () => {
    expect(scopeForUser({ provider: 'google', uid: 'abc' })).toBe('uid:abc')
    expect(scopeForUser({ provider: 'guest' })).toBe(GUEST_SCOPE)
    expect(scopeForUser(null)).toBe(GUEST_SCOPE)
    expect(scopeForUser({ provider: 'google' })).toBe(GUEST_SCOPE) // no uid — not trustworthy
  })

  it('the same logical key is a different physical entry per scope', () => {
    setActiveScope('uid:alice')
    setJson('gcse_progress', { streak: 3 })
    setActiveScope('uid:bob')
    expect(getJson('gcse_progress', null)).toBe(null) // bob sees nothing of alice's
    setJson('gcse_progress', { streak: 9 })
    setActiveScope('uid:alice')
    expect(getJson('gcse_progress', null)).toEqual({ streak: 3 }) // alice's own value, untouched by bob's write
  })

  it('riseUser is never scoped — it is the bootstrap pointer used to derive the scope itself', () => {
    setActiveScope('uid:alice')
    setJsonForScope('uid:alice', 'riseUser', { uid: 'alice' }) // should be a no-op scope-wise
    setActiveScope('uid:bob')
    expect(getJson('riseUser', null)).toEqual({ uid: 'alice' }) // same global value regardless of active scope
  })

  it('listKeys only sees the active scope\'s own dynamic keys', () => {
    setActiveScope('uid:alice')
    setJson('gcse_module_x', { screen: 1 })
    setActiveScope('uid:bob')
    setJson('gcse_module_y', { screen: 2 })
    expect(listKeys('gcse_module_')).toEqual(['gcse_module_y'])
    setActiveScope('uid:alice')
    expect(listKeys('gcse_module_')).toEqual(['gcse_module_x'])
  })

  it('getJsonForScope/setJsonForScope/listKeysForScope/removeKeyForScope target an explicit scope regardless of what is currently active', () => {
    setActiveScope('uid:alice')
    setJsonForScope('uid:bob', 'gcse_scores', [{ pct: 50 }])
    expect(getJson('gcse_scores', null)).toBe(null) // alice (active) unaffected
    expect(getJsonForScope('uid:bob', 'gcse_scores', null)).toEqual([{ pct: 50 }])
    expect(listKeysForScope('uid:bob', 'gcse_s')).toEqual(['gcse_scores'])
    expect(removeKeyForScope('uid:bob', 'gcse_scores')).toBe(true)
    expect(getJsonForScope('uid:bob', 'gcse_scores', null)).toBe(null)
  })

  it('getRawJson/setRawJson/removeRawKey bypass scoping entirely', () => {
    setActiveScope('uid:alice')
    setRawJson('gcse_guest_claim_v1', { status: 'claimed' })
    setActiveScope('uid:bob')
    expect(getRawJson('gcse_guest_claim_v1', null)).toEqual({ status: 'claimed' })
    expect(removeRawKey('gcse_guest_claim_v1')).toBe(true)
    expect(getRawJson('gcse_guest_claim_v1', null)).toBe(null)
  })
})

describe('storage.js legacy flat-key migration', () => {
  beforeEach(() => {
    installLocalStorageStub()
    setActiveScope(GUEST_SCOPE)
  })

  afterEach(() => {
    setActiveScope(GUEST_SCOPE)
  })

  it('is a no-op with nothing to migrate', () => {
    const result = runLegacyFlatMigration()
    expect(result.ran).toBe(true)
    expect(result.result.target).toBe('none')
    // Running again does nothing further (idempotent, flag-gated).
    const second = runLegacyFlatMigration()
    expect(second.ran).toBe(false)
  })

  it('moves flat legacy data into the proven uid namespace when riseUser proves ownership', () => {
    globalThis.localStorage.setItem('riseUser', JSON.stringify({ provider: 'google', uid: 'proven-1', name: 'Sam' }))
    globalThis.localStorage.setItem('gcse_progress', JSON.stringify({ streak: 5 }))
    globalThis.localStorage.setItem('gcse_scores', JSON.stringify([{ pct: 80 }]))

    const { result } = runLegacyFlatMigration()
    expect(result.target).toBe('uid:proven-1')

    setActiveScope('uid:proven-1')
    expect(getJson('gcse_progress', null)).toEqual({ streak: 5 })
    expect(getJson('gcse_scores', null)).toEqual([{ pct: 80 }])
    // Flat keys are gone — nothing left dangling outside the scoped namespace.
    expect(globalThis.localStorage.getItem('gcse_progress')).toBe(null)

    // Idempotent: running again (e.g. a second app load) does not touch anything further.
    setJson('gcse_progress', { streak: 999 }) // simulate the account continuing to learn
    runLegacyFlatMigration()
    expect(getJson('gcse_progress', null)).toEqual({ streak: 999 })
  })

  it('quarantines meaningful ambiguous legacy data — not visible to the next guest, but recoverable', () => {
    globalThis.localStorage.setItem('gcse_progress', JSON.stringify({ streak: 7 }))

    const { result } = runLegacyFlatMigration()
    expect(result.target).toBe(QUARANTINE_SCOPE)
    expect(result.quarantined).toBe(true)

    setActiveScope('uid:whoever-signs-in-first')
    expect(getJson('gcse_progress', null)).toBe(null) // not assigned to this account

    setActiveScope(GUEST_SCOPE)
    expect(getJson('gcse_progress', null)).toBe(null) // NOT auto-visible to a fresh guest

    // Still preserved and recoverable in the quarantine namespace.
    expect(getJsonForScope(QUARANTINE_SCOPE, 'gcse_progress', null)).toEqual({ streak: 7 })
  })

  it('sequesters the previous guest identity when quarantining, so the old name does not auto-appear', () => {
    globalThis.localStorage.setItem('riseUser', JSON.stringify({ provider: 'guest', name: 'Sam', onboardingComplete: true }))
    globalThis.localStorage.setItem('gcse_progress', JSON.stringify({ streak: 2 }))

    const { result } = runLegacyFlatMigration()
    expect(result.target).toBe(QUARANTINE_SCOPE)
    expect(result.sequesteredProfile).toBe(true)

    // The raw identity pointer is cleared → app opens at onboarding, not "Sam".
    expect(getRawJson('riseUser', null)).toBe(null)
    // The name is preserved (sequestered) for deliberate recovery.
    expect(getJsonForScope(QUARANTINE_SCOPE, QUARANTINE_PROFILE_KEY, null)).toMatchObject({ name: 'Sam' })
  })

  it('sends ambiguous-but-empty leftovers to the guest namespace (nothing private to hide)', () => {
    globalThis.localStorage.setItem('gcse_wrong_answers', JSON.stringify([]))
    globalThis.localStorage.setItem('gcse_scores', JSON.stringify([]))

    const { result } = runLegacyFlatMigration()
    expect(result.target).toBe(GUEST_SCOPE)
    expect(result.quarantined).toBe(false)
  })

  it('reloading does not re-quarantine or duplicate already-quarantined data (idempotent)', () => {
    globalThis.localStorage.setItem('gcse_progress', JSON.stringify({ streak: 7 }))
    runLegacyFlatMigration()
    // Simulate the quarantine snapshot being adopted (moved out) then a reload.
    removeKeyForScope(QUARANTINE_SCOPE, 'gcse_progress')
    const second = runLegacyFlatMigration()
    expect(second.ran).toBe(false) // flag-gated, no second quarantine
    expect(getJsonForScope(QUARANTINE_SCOPE, 'gcse_progress', null)).toBe(null)
  })

  it('never overwrites data a scope already has', () => {
    globalThis.localStorage.setItem('riseUser', JSON.stringify({ provider: 'google', uid: 'proven-2' }))
    globalThis.localStorage.setItem('gcse_progress', JSON.stringify({ streak: 1 }))
    globalThis.localStorage.setItem('uid:proven-2::gcse_progress', JSON.stringify({ streak: 100 }))

    runLegacyFlatMigration()

    setActiveScope('uid:proven-2')
    expect(getJson('gcse_progress', null)).toEqual({ streak: 100 }) // untouched
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
