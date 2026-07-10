// ─── Persistence boundary ──────────────────────────────────────────
// All learner-data reads/writes (progress, scores, weakness tracking)
// go through this file. Currently backed by localStorage; swapping to
// a remote store later means changing only this file.
//
// ─── Account ownership / scoping ───────────────────────────────────
// Every logical key (gcse_progress, gcse_module_<id>, ...) is namespaced
// under the currently active scope — 'guest' or 'uid:<firebase-uid>' — so
// two accounts on the same browser never share the same physical
// localStorage entry. Feature code (progress.js, quickfire, planner, ...)
// never sees this: getJson/setJson/etc. transparently read/write whatever
// scope is currently active, so callers keep using plain logical key names.
//
// A small set of keys are deliberately NEVER scoped (RAW_KEYS below) —
// they are the bootstrap/governance state needed to determine or change
// the active scope itself, so scoping them would be circular. 'riseUser'
// is the main one: it has to be readable before we know which scope its
// own uid points to.
//
// Only src/auth/AuthContext.jsx (via src/data/progressSync/accountScope.js)
// calls setActiveScope() — feature code and learning components never
// construct or reason about scope/uid themselves.

export const GUEST_SCOPE = 'guest'

// A holding namespace for legacy progress whose owner can't be proven. It is
// NEVER the active scope (setActiveScope only ever receives 'guest' or a uid
// scope), so quarantined data is never read by plain getJson/etc., never
// collected into a guest snapshot, and never reconciled to the cloud — it just
// sits there, recoverable, until the learner deliberately adopts or discards
// it via the account-scope helpers. See PROGRESS_SYNC_ARCHITECTURE.md.
export const QUARANTINE_SCOPE = 'quarantine'

// Logical key (inside QUARANTINE_SCOPE) that holds the previous learner's
// sequestered identity (their old riseUser) so the raw riseUser can be cleared
// on quarantine — otherwise their name would still auto-appear even with the
// progress hidden. Not a RAW key, so it scopes normally under 'quarantine::'.
export const QUARANTINE_PROFILE_KEY = '__quarantined_profile__'

const RAW_KEYS = new Set([
  'riseUser',
  'gcse_legacy_migration_v1',
  'gcse_guest_claim_v1',
  'gcse_quarantine_v1',
])

const SCOPE_DELIMITER = '::'
const LEGACY_MIGRATION_FLAG_KEY = 'gcse_legacy_migration_v1'

// The scope id for a given signed-in/guest user object (as stored in
// riseUser). Google users get a stable per-uid namespace; everyone else
// (guests, logged-out) shares the single guest namespace.
export function scopeForUser(user) {
  return (user && user.provider === 'google' && user.uid) ? `uid:${user.uid}` : GUEST_SCOPE
}

function physicalKey(scope, key) {
  return RAW_KEYS.has(key) ? key : `${scope}${SCOPE_DELIMITER}${key}`
}

function deriveInitialScope() {
  try {
    if (typeof localStorage === 'undefined') return GUEST_SCOPE
    const raw = localStorage.getItem('riseUser')
    if (!raw) return GUEST_SCOPE
    const parsed = JSON.parse(raw)
    if (parsed?.provider === 'google' && parsed?.uid) return `uid:${parsed.uid}`
  } catch { /* malformed riseUser — fall back to guest */ }
  return GUEST_SCOPE
}

let activeScope = deriveInitialScope()

// The scope currently in effect for plain getJson/setJson/etc. calls.
export function getActiveScope() {
  return activeScope
}

// Switches which account's namespace plain getJson/setJson/etc. read and
// write. Called only from the auth boundary on sign-in/sign-out/link, never
// from feature code.
export function setActiveScope(scope) {
  activeScope = scope || GUEST_SCOPE
}

// ─── Scoped primitives ──────────────────────────────────────────────

export function getJsonForScope(scope, key, fallback) {
  try {
    const raw = localStorage.getItem(physicalKey(scope, key))
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
export function setJsonForScope(scope, key, value) {
  try {
    localStorage.setItem(physicalKey(scope, key), JSON.stringify(value))
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

export function removeKeyForScope(scope, key) {
  try {
    localStorage.removeItem(physicalKey(scope, key))
    return true
  } catch {
    console.warn(`storage: failed to remove "${key}"`)
    return false
  }
}

// All stored logical key names for one scope, optionally filtered by prefix —
// lets callers (e.g. progress sync) discover dynamic keys like
// gcse_module_<id> within a specific account's namespace without touching
// localStorage directly.
export function listKeysForScope(scope, prefix = '') {
  try {
    const physicalPrefix = `${scope}${SCOPE_DELIMITER}${prefix}`
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key !== null && key.startsWith(physicalPrefix)) {
        keys.push(key.slice(scope.length + SCOPE_DELIMITER.length))
      }
    }
    return keys
  } catch {
    return []
  }
}

// ─── Ambient primitives (operate on the currently active scope) ────
// The vast majority of the app just wants "read/write my progress" without
// caring which account that is — these are what progress.js, quickfire,
// the planner, etc. use.

export function getJson(key, fallback) {
  return getJsonForScope(activeScope, key, fallback)
}

export function setJson(key, value) {
  return setJsonForScope(activeScope, key, value)
}

export function removeKey(key) {
  return removeKeyForScope(activeScope, key)
}

export function getArray(key) {
  return getJson(key, [])
}

export function getObject(key) {
  return getJson(key, {})
}

export function listKeys(prefix = '') {
  return listKeysForScope(activeScope, prefix)
}

// ─── Raw (never-scoped) primitives ──────────────────────────────────
// For the small RAW_KEYS set only — bootstrap/governance state that must be
// readable/writable independent of whatever scope is currently active.

export function getRawJson(key, fallback) {
  return getJsonForScope(null, key, fallback)
}

export function setRawJson(key, value) {
  return setJsonForScope(null, key, value)
}

export function removeRawKey(key) {
  return removeKeyForScope(null, key)
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

// ─── One-time legacy migration ──────────────────────────────────────
// Installations that predate account scoping have real learner progress
// sitting under flat, unscoped keys (e.g. plain "gcse_progress", not
// "guest::gcse_progress"). Runs once, at first load after this feature
// ships, before any other module's import-time code can read/write a scoped
// key (storage.js is a leaf dependency, so its own module body always
// finishes evaluating before anything that imports it runs).
//
// Ownership rule: riseUser is the only trustworthy signal available at this
// point.
//
//   - Proven Google account (provider + uid): the legacy data demonstrably
//     belongs to that uid and is moved into that uid's namespace — not
//     "whichever account happens to sign in first". riseUser stays as-is.
//   - Ambiguous (no riseUser, a guest profile, or a malformed one) AND the
//     legacy data is meaningful: it goes into the QUARANTINE namespace, not
//     the guest one. A fresh guest never has 'quarantine' as their active
//     scope, so the previous learner's progress can't silently surface as the
//     new guest's own name/streak/scores/modules/weaknesses. The previous
//     guest identity (riseUser name) is sequestered alongside it and the raw
//     riseUser cleared, so the app opens at onboarding rather than greeting a
//     stranger by the old name. Nothing is deleted — the learner can
//     deliberately adopt or discard it later (accountScope.js).
//   - Ambiguous but NOT meaningful (only empty arrays/objects left over): sent
//     to the guest namespace as before — there is nothing private to hide, and
//     this preserves the pre-quarantine behaviour for trivial leftovers.
//
// Idempotent: gated by a persisted flag, and never overwrites a scoped key
// that already has data, so a repeat run (or a reload before the flag write
// landed) can't duplicate anything or re-quarantine already-moved data.
function rawValueIsMeaningful(raw) {
  if (raw === null || raw === undefined) return false
  let parsed
  try { parsed = JSON.parse(raw) } catch { return raw.length > 0 }
  if (parsed === null || parsed === undefined) return false
  if (Array.isArray(parsed)) return parsed.length > 0
  if (typeof parsed === 'object') return Object.keys(parsed).length > 0
  if (typeof parsed === 'string') return parsed.length > 0
  if (typeof parsed === 'number') return parsed !== 0
  return Boolean(parsed)
}

export function runLegacyFlatMigration() {
  if (typeof localStorage === 'undefined') return { ran: false }

  let flag
  try { flag = JSON.parse(localStorage.getItem(LEGACY_MIGRATION_FLAG_KEY) || 'null') } catch { flag = null }
  if (flag?.done) return { ran: false, already: flag }

  let legacyKeys = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k === null) continue
      if (k.includes(SCOPE_DELIMITER)) continue // already a scoped key
      if (RAW_KEYS.has(k)) continue
      legacyKeys.push(k)
    }
  } catch { legacyKeys = [] }

  const writeFlag = (result) => {
    try { localStorage.setItem(LEGACY_MIGRATION_FLAG_KEY, JSON.stringify(result)) } catch { /* ignore */ }
    return { ran: true, result }
  }

  if (legacyKeys.length === 0) {
    return writeFlag({ done: true, ranAt: Date.now(), target: 'none' })
  }

  let riseUser = null
  try { riseUser = JSON.parse(localStorage.getItem('riseUser') || 'null') } catch { riseUser = null }
  const provenUid = (riseUser?.provider === 'google' && typeof riseUser?.uid === 'string' && riseUser.uid) ? riseUser.uid : null

  // Ambiguous + at least one legacy key holds real content → quarantine, so it
  // can't auto-display to the next guest. Otherwise fall through to the plain
  // relocation (proven uid, or ambiguous-but-empty → guest).
  const ambiguous = !provenUid
  const meaningful = legacyKeys.some(k => rawValueIsMeaningful(localStorage.getItem(k)))
  const targetScope = provenUid ? `uid:${provenUid}` : (ambiguous && meaningful ? QUARANTINE_SCOPE : GUEST_SCOPE)

  const migrated = []
  for (const key of legacyKeys) {
    const scopedPhysicalKey = `${targetScope}${SCOPE_DELIMITER}${key}`
    if (localStorage.getItem(scopedPhysicalKey) !== null) continue // never overwrite existing scoped data
    try {
      localStorage.setItem(scopedPhysicalKey, localStorage.getItem(key))
      migrated.push(key)
    } catch { /* leave the legacy key in place — safer to retry later than lose it */ }
  }
  for (const key of migrated) {
    try { localStorage.removeItem(key) } catch { /* ignore */ }
  }

  // When quarantining, sequester the previous guest identity too and clear the
  // raw riseUser, so the old name doesn't greet the next visitor.
  let sequesteredProfile = false
  if (targetScope === QUARANTINE_SCOPE) {
    const rawRiseUser = localStorage.getItem('riseUser')
    if (rawRiseUser !== null) {
      const profilePhysicalKey = `${QUARANTINE_SCOPE}${SCOPE_DELIMITER}${QUARANTINE_PROFILE_KEY}`
      try {
        if (localStorage.getItem(profilePhysicalKey) === null) localStorage.setItem(profilePhysicalKey, rawRiseUser)
        localStorage.removeItem('riseUser')
        sequesteredProfile = true
      } catch { /* leave riseUser in place if the copy failed */ }
    }
  }

  return writeFlag({
    done: true, ranAt: Date.now(), target: targetScope,
    provenUid: provenUid || null, migratedKeys: migrated,
    quarantined: targetScope === QUARANTINE_SCOPE, sequesteredProfile,
  })
}

runLegacyFlatMigration()
