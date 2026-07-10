// ─── Save-failure notice controller (pure) ──────────────────────────────────
//
// Owns the state behind the governed save-failure notice, with no React so the
// dedupe / retry / dismiss behaviour is fully unit-testable. One notice per
// failure episode: multiple failed critical saves coalesce into a single
// notice keyed by storage key, and "Try again" re-runs every pending retry.
//
// The React host (SaveFailureHost.jsx) subscribes this to the storage bus and
// mirrors snapshot() into component state.

export function createSaveFailureController(onChange = () => {}) {
  let open = false
  let retrying = false
  const pending = new Map() // storage key -> retry closure (deduped by key)

  function snapshot() {
    return { open, retrying, pendingCount: pending.size }
  }
  function notify() {
    onChange(snapshot())
  }

  // A critical save failed. Coalesce by key and open the notice once; while a
  // retry is in flight, ignore the re-emitted failures it produces (retry()
  // already tracks those) so one failed attempt can't stack duplicate notices.
  function reportFailure(detail) {
    if (retrying) return
    if (detail && detail.key && typeof detail.retry === 'function') {
      pending.set(detail.key, detail.retry)
    }
    if (!open) {
      open = true
      notify()
    }
  }

  // Re-run every pending save. Ones that succeed clear; ones that still fail
  // stay pending. If all recover, the notice closes.
  function retry() {
    if (retrying || !open) return
    retrying = true
    notify()
    for (const [key, run] of [...pending]) {
      let ok = false
      try { ok = run() } catch { ok = false }
      if (ok) pending.delete(key)
    }
    retrying = false
    if (pending.size === 0) open = false
    notify()
  }

  // Learner chose to keep working. Their in-memory work is untouched; we simply
  // stop showing the notice and drop the pending retries (nothing is discarded
  // from memory — the next learner action will attempt to persist again).
  function dismiss() {
    open = false
    retrying = false
    pending.clear()
    notify()
  }

  return { reportFailure, retry, dismiss, snapshot }
}
