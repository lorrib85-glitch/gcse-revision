import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  setActiveScope, GUEST_SCOPE, QUARANTINE_SCOPE, QUARANTINE_PROFILE_KEY,
  getJson, setJsonForScope, getJsonForScope, getRawJson, setRawJson,
} from '../../../src/lib/storage.js'
import {
  hasQuarantinedProgress, shouldOfferQuarantineRecovery,
  adoptQuarantinedProgress, dismissQuarantineRecovery, discardQuarantinedProgress,
} from '../../../src/data/progressSync/accountScope.js'

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

// Seeds a quarantine snapshot the way the legacy migration would.
function seedQuarantine({ profile = { provider: 'guest', name: 'Old Learner', onboardingComplete: true } } = {}) {
  setJsonForScope(QUARANTINE_SCOPE, 'gcse_progress', { streak: 9, bestStreak: 12 })
  setJsonForScope(QUARANTINE_SCOPE, 'gcse_scores', [{ date: '2026-01-01', pct: 80 }])
  setJsonForScope(QUARANTINE_SCOPE, 'gcse_module_bio1', { screen: 5, completed: true })
  if (profile) setJsonForScope(QUARANTINE_SCOPE, QUARANTINE_PROFILE_KEY, profile)
}

describe('accountScope — quarantined legacy progress recovery', () => {
  beforeEach(() => {
    installLocalStorageStub()
    setActiveScope(GUEST_SCOPE)
  })
  afterEach(() => setActiveScope(GUEST_SCOPE))

  it('reports quarantined progress and offers recovery until resolved', () => {
    expect(hasQuarantinedProgress()).toBe(false)
    seedQuarantine()
    expect(hasQuarantinedProgress()).toBe(true)
    expect(shouldOfferQuarantineRecovery()).toBe(true)
  })

  it('"Use this progress" merges into guest scope once, restores the name, and is not re-offered', () => {
    seedQuarantine()
    // No live identity yet (app is at login).
    expect(getRawJson('riseUser', null)).toBe(null)

    const { adopted } = adoptQuarantinedProgress()
    expect(adopted).toBe(true)

    // Now available as GUEST progress.
    setActiveScope(GUEST_SCOPE)
    expect(getJson('gcse_progress', null)).toMatchObject({ streak: 9 })
    expect(getJson('gcse_module_bio1', null)).toMatchObject({ screen: 5, completed: true })
    // Name restored.
    expect(getRawJson('riseUser', null)).toMatchObject({ name: 'Old Learner' })
    // Quarantine cleared → not offered again, nothing left to duplicate.
    expect(hasQuarantinedProgress()).toBe(false)
    expect(shouldOfferQuarantineRecovery()).toBe(false)
  })

  it('adopting is idempotent — a second call (e.g. after reload) adds nothing', () => {
    seedQuarantine()
    adoptQuarantinedProgress()
    const before = getJson('gcse_progress', null)
    const second = adoptQuarantinedProgress()
    expect(second.adopted).toBe(false)
    expect(getJson('gcse_progress', null)).toEqual(before)
  })

  it('adopting never overrides a live identity the learner already established', () => {
    seedQuarantine()
    setRawJson('riseUser', { provider: 'guest', name: 'Current', onboardingComplete: true })
    adoptQuarantinedProgress()
    expect(getRawJson('riseUser', null)).toMatchObject({ name: 'Current' })
  })

  it('"Start fresh" stops offering the card but does NOT destroy the snapshot', () => {
    seedQuarantine()
    dismissQuarantineRecovery()
    expect(shouldOfferQuarantineRecovery()).toBe(false)   // not nagged again
    expect(hasQuarantinedProgress()).toBe(true)           // still recoverable
    // Not merged into guest scope.
    expect(getJson('gcse_progress', null)).toBe(null)
  })

  it('adopting does not attach anything to a Google account automatically', () => {
    seedQuarantine()
    adoptQuarantinedProgress()
    // A signed-in account namespace remains untouched by the adopt.
    expect(getJsonForScope('uid:someone', 'gcse_progress', null)).toBe(null)
  })

  it('explicit discard permanently removes the snapshot', () => {
    seedQuarantine()
    discardQuarantinedProgress()
    expect(hasQuarantinedProgress()).toBe(false)
    expect(getJsonForScope(QUARANTINE_SCOPE, 'gcse_progress', null)).toBe(null)
  })
})
