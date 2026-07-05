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

export function setJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn(`storage: failed to write "${key}"`)
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    console.warn(`storage: failed to remove "${key}"`)
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
