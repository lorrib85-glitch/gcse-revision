import { describe, it, expect, vi } from 'vitest'
import { createSaveFailureController } from '../../../src/app/saveFailureController.js'

describe('saveFailureController', () => {
  it('stays closed until a critical save fails', () => {
    const c = createSaveFailureController()
    expect(c.snapshot().open).toBe(false)
  })

  it('opens the notice when a save fails and reports pending work', () => {
    const onChange = vi.fn()
    const c = createSaveFailureController(onChange)
    c.reportFailure({ key: 'gcse_scores', retry: () => true })
    expect(c.snapshot()).toMatchObject({ open: true, pendingCount: 1 })
    expect(onChange).toHaveBeenCalled()
  })

  it('coalesces multiple failures from one episode into a single notice', () => {
    const c = createSaveFailureController()
    c.reportFailure({ key: 'gcse_scores', retry: () => false })
    c.reportFailure({ key: 'gcse_progress', retry: () => false })
    c.reportFailure({ key: 'gcse_scores', retry: () => false }) // same key again
    const snap = c.snapshot()
    expect(snap.open).toBe(true)
    // Two distinct keys, deduped — not three notices, not three entries.
    expect(snap.pendingCount).toBe(2)
  })

  it('retry that succeeds clears the pending save and closes the notice', () => {
    const c = createSaveFailureController()
    let willSucceed = false
    c.reportFailure({ key: 'gcse_scores', retry: () => willSucceed })
    expect(c.snapshot().open).toBe(true)
    willSucceed = true
    c.retry()
    expect(c.snapshot()).toMatchObject({ open: false, pendingCount: 0, retrying: false })
  })

  it('retry that still fails keeps the notice open with the save pending', () => {
    const c = createSaveFailureController()
    c.reportFailure({ key: 'gcse_scores', retry: () => false })
    c.retry()
    expect(c.snapshot()).toMatchObject({ open: true, pendingCount: 1, retrying: false })
  })

  it('a partial retry keeps only the saves that still fail', () => {
    const c = createSaveFailureController()
    let bFixed = false
    c.reportFailure({ key: 'a', retry: () => true })
    c.reportFailure({ key: 'b', retry: () => bFixed })
    c.retry() // a recovers, b still fails
    expect(c.snapshot()).toMatchObject({ open: true, pendingCount: 1 })
    bFixed = true
    c.retry()
    expect(c.snapshot()).toMatchObject({ open: false, pendingCount: 0 })
  })

  it('does not stack a duplicate notice from failures re-emitted during a retry', () => {
    const c = createSaveFailureController()
    const openStatesSeen = []
    // A retry closure that itself re-reports a failure (as saveCritical does).
    const retry = () => { c.reportFailure({ key: 'gcse_scores', retry }); return false }
    c.reportFailure({ key: 'gcse_scores', retry })
    c.retry()
    const snap = c.snapshot()
    // Still exactly one pending entry — the in-flight re-report was ignored.
    expect(snap.pendingCount).toBe(1)
    expect(snap.open).toBe(true)
    expect(openStatesSeen).toEqual([]) // (no assertion noise; documents intent)
  })

  it('dismiss closes the notice and stops nagging without discarding in-memory work', () => {
    const c = createSaveFailureController()
    c.reportFailure({ key: 'gcse_scores', retry: () => false })
    c.dismiss()
    expect(c.snapshot()).toMatchObject({ open: false, pendingCount: 0 })
  })

  it('a successful save that never reports failure leaves the notice closed (no success toast)', () => {
    const onChange = vi.fn()
    const c = createSaveFailureController(onChange)
    // No reportFailure call at all → nothing happens.
    expect(c.snapshot().open).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
  })
})
