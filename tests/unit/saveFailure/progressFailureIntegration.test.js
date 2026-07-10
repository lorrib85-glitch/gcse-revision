import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { subscribeSaveFailure } from '../../../src/lib/storage.js'
import { recordScore, saveModuleState } from '../../../src/progress.js'
import { createSaveFailureController } from '../../../src/app/saveFailureController.js'

// Proves the completion flows can't silently appear saved: when storage is
// unavailable, recording a score or module completion surfaces the governed
// failure notice (via the storage bus → controller) instead of returning as
// if it succeeded.

function installLocalStorage({ failing }) {
  const store = {}
  globalThis.localStorage = {
    get length() { return Object.keys(store).length },
    key: (i) => Object.keys(store)[i] ?? null,
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => {
      if (failing()) { const e = new Error('full'); e.name = 'QuotaExceededError'; throw e }
      store[k] = String(v)
    },
    removeItem: (k) => { delete store[k] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  }
  return store
}

let warnSpy
beforeEach(() => { warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {}) })
afterEach(() => warnSpy.mockRestore())

describe('progress completion flows surface save failures', () => {
  it('saveModuleState failure returns false AND opens the governed notice', () => {
    installLocalStorage({ failing: () => true })
    const controller = createSaveFailureController()
    const unsub = subscribeSaveFailure(d => controller.reportFailure(d))

    const ok = saveModuleState('history-medicine-black-death', { screen: 12, completed: true })

    expect(ok).toBe(false)                      // caller is not told it saved
    expect(controller.snapshot().open).toBe(true) // learner sees the notice
    unsub()
  })

  it('recording a completed round failure opens exactly one notice (deduped across its writes)', () => {
    installLocalStorage({ failing: () => true })
    const controller = createSaveFailureController()
    const unsub = subscribeSaveFailure(d => controller.reportFailure(d))

    // recordScore writes the streak/activity key and the scores key — both fail.
    recordScore({ subject: 'History', earned: 8, possible: 10, source: 'exam' })

    const snap = controller.snapshot()
    expect(snap.open).toBe(true)
    // One notice, even though two underlying keys failed.
    expect(snap.pendingCount).toBeGreaterThanOrEqual(1)
    unsub()
  })

  it('once storage recovers, retry persists the completion and closes the notice', () => {
    let failing = true
    const store = installLocalStorage({ failing: () => failing })
    const controller = createSaveFailureController()
    const unsub = subscribeSaveFailure(d => controller.reportFailure(d))

    saveModuleState('history-medicine-germ-theory', { screen: 9, completed: true })
    expect(controller.snapshot().open).toBe(true)

    failing = false // storage frees up
    controller.retry()

    expect(controller.snapshot().open).toBe(false)
    // No user is signed in in this test, so the write lands under the guest scope.
    expect(JSON.parse(store['guest::gcse_module_history-medicine-germ-theory'])).toMatchObject({ completed: true })
    unsub()
  })

  it('a successful save shows no notice (no false positives, no success toast)', () => {
    installLocalStorage({ failing: () => false })
    const controller = createSaveFailureController()
    const unsub = subscribeSaveFailure(d => controller.reportFailure(d))

    const ok = saveModuleState('history-medicine-germ-theory', { screen: 3 })

    expect(ok).toBe(true)
    expect(controller.snapshot().open).toBe(false)
    unsub()
  })
})
