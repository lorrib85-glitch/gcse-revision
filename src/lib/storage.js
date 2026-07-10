// ─── Persistence boundary ──────────────────────────────────────────
// All learner-data reads/writes (progress, scores, weakness tracking)
// go through this file. Currently backed by localStorage; swapping to
// a remote store later means changing only this file.

export function getJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

// Returns true when the write persisted, false when it failed — callers that
// care (e.g. progress saves) can surface the failure instead of assuming
// success. A quota failure means learner data is silently NOT saving, so it
// gets its own explicit warning.
export function setJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    if (isQuotaError(err)) {
      console.warn(`storage: quota exceeded writing "${key}" — progress is NOT being saved`)
    } else {
      console.warn(`storage: failed to write "${key}"`, err)
    }
    return false
  }
}

function isQuotaError(err) {
  return err?.name === 'QuotaExceededError' ||
    err?.code === 22 || // legacy DOMException code for quota
    err?.code === 1014  // Firefox NS_ERROR_DOM_QUOTA_REACHED
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    console.warn(`storage: failed to remove "${key}"`)
    return false
  }
}

export function getArray(key) {
  return getJson(key, [])
}

export function getObject(key) {
  return getJson(key, {})
}

// All stored key names, optionally filtered by prefix — lets callers (e.g.
// progress sync) discover dynamic keys like gcse_module_<id> without
// touching localStorage directly.
export function listKeys(prefix = '') {
  try {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key !== null && key.startsWith(prefix)) keys.push(key)
    }
    return keys
  } catch {
    return []
  }
}

// ─── Critical-save failure signalling ──────────────────────────────
// A "critical" save is one the learner is shown as done — module progress,
// screen completion, quiz/exam scores, streaks, planner completion. If one of
// these fails, the learner must not be told it succeeded. `saveCritical`
// writes through `setJson` and, on failure, notifies subscribers with a retry
// closure so the app can surface one governed, recoverable notice
// (see src/components/core/SaveFailureNotice.jsx). Non-critical caches keep
// using `setJson` directly.

const saveFailureListeners = new Set()

// Subscribe to critical-save failures. Returns an unsubscribe function.
export function subscribeSaveFailure(listener) {
  saveFailureListeners.add(listener)
  return () => saveFailureListeners.delete(listener)
}

function emitSaveFailure(detail) {
  for (const listener of saveFailureListeners) {
    // A broken subscriber must never block or corrupt persistence.
    try { listener(detail) } catch { /* ignore */ }
  }
}

// Persist a critical value. Returns true on success, false on failure — the
// caller still gets the boolean so it can avoid rendering a "saved"/"complete"
// state — and additionally emits a failure event carrying a retry closure.
export function saveCritical(key, value) {
  const ok = setJson(key, value)
  if (!ok) emitSaveFailure({ key, retry: () => saveCritical(key, value) })
  return ok
}
