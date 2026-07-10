// ─── Progress sync — Firestore backup for signed-in Google users ────────────
//
// One user-owned document: users/{uid}/progress/main
//   { version: 1, updatedAt: <ms since epoch>, data: { <storage key>: <value> } }
//
// local storage stays the runtime source of truth; Firestore is a backup that
// is reconciled once per app load (and topped up on visibility change / after
// account linking / sign-out). Guests never sync — the Firestore SDK isn't
// even downloaded unless a Google-signed-in user reaches syncProgressForUser().
//
// Reconciliation is a real per-key merge (progressMerge.js), not a
// whole-snapshot "pick a side": local and cloud are combined key by key, and
// only whichever side(s) actually changed as a result get written. This is
// what makes linking a guest account, opening a second device, and repeated
// syncs all safe — see progressMerge.js for the merge rules themselves.
//
// Deliberately excluded from the snapshot:
//   - streakCelebrationShown:<date> — daily-expiring UI dedup flags, not
//     progress; the streak itself is derived from gcse_scores, which IS backed up.
//   - gcse_sync_meta — this service's own bookkeeping.
//
// Every local read/write below goes through the *ForScope storage helpers
// with a scope captured once at the top of reconcile() — never the ambient
// "currently active" scope. This is what makes reconcile() safe to have
// in flight across an account switch: a stale promise from a signed-out
// user's reconcile call keeps reading/writing that user's own namespace,
// never whatever scope becomes active while it was awaiting Firestore.
import { getJsonForScope, setJsonForScope, listKeysForScope, getRawJson, scopeForUser, GUEST_SCOPE } from '../../lib/storage.js'
import { firebaseEnabled, app } from '../../auth/firebaseClient.js'
import { mergeProgressData, progressDataEqual } from './progressMerge.js'
import { compactSnapshotForBudget } from './snapshotBudget.js'

export const SNAPSHOT_VERSION = 1
export const SYNC_META_KEY = 'gcse_sync_meta'

export const STATIC_PROGRESS_KEYS = [
  'riseUser',
  'gcse_scores',
  'gcse_wrong_answers',
  'gcse_correct_answers',
  'gcse_exam_techniques',
  'gcse_coach_type_results',
  'gcse_progress',
  'gcse_planner_rotation',
  'gcse_planner_prefs',
  'gcse_planner_weakpoints',
  'gcse_planner_paper_results',
  'gcse_mastery_v1',
  'gcse_quickfire_memory_v1',
  'gcse_qf_answer_log',
  'gcse_qf_baseline_v1',
  'gcse_qf_q_history',
  'gcse_qf_prev_session',
  'gcse_qf_best',
  'gcse_todays_plan_revisit',
]

export const DYNAMIC_KEY_PREFIXES = ['gcse_module_']

// ─── Snapshot collect / apply (pure local storage side) ──────────────────────
// Both take an explicit `scope` — the account namespace to read/write —
// rather than assuming "whichever scope is currently active". Callers
// (reconcile() below, and the guest-claim flow in accountScope.js) always
// pass a scope captured at the start of their operation.

export function collectLocalProgressSnapshot(scope = GUEST_SCOPE) {
  const data = {}
  const keys = [
    ...STATIC_PROGRESS_KEYS,
    ...DYNAMIC_KEY_PREFIXES.flatMap(prefix => listKeysForScope(scope, prefix)),
  ]
  for (const key of keys) {
    const value = getJsonForScope(scope, key, undefined)
    if (value !== undefined) data[key] = value
  }
  return { version: SNAPSHOT_VERSION, updatedAt: Date.now(), data }
}

// Writes only the keys present in the snapshot — never deletes or renames
// anything else in that scope's local storage.
export function applyProgressSnapshot(snapshot, { currentUid, scope = GUEST_SCOPE } = {}) {
  const data = snapshot?.data
  if (!data || typeof data !== 'object') return 0
  let applied = 0
  for (const [key, value] of Object.entries(data)) {
    if (key === SYNC_META_KEY) continue
    if (key === 'riseUser' && currentUid) {
      // riseUser is the single global identity pointer (never scoped — see
      // storage.js). Two guards, both required: never adopt a snapshot
      // profile for a different account, and never overwrite whichever
      // account is *actually* signed in right now on this device if it's
      // no longer this reconcile's own uid (a stale reconcile from an
      // account that has since signed out/switched must not touch it).
      if (value?.uid && value.uid !== currentUid) continue
      const activeRiseUser = getRawJson('riseUser', null)
      if (activeRiseUser?.uid && activeRiseUser.uid !== currentUid) continue
    }
    setJsonForScope(scope, key, value)
    applied++
  }
  return applied
}

// A snapshot is "meaningful" if it holds any actual progress beyond the
// user profile — used to guard against empty state wiping richer state.
export function isMeaningfulSnapshot(snapshot) {
  const data = snapshot?.data
  if (!data || typeof data !== 'object') return false
  return Object.entries(data).some(([key, value]) => {
    if (key === 'riseUser' || key === SYNC_META_KEY) return false
    if (value === null || value === undefined) return false
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return true
  })
}

// ─── Conflict decision (pure — fully unit-testable) ─────────────────────────
//
// Returns 'upload' | 'apply' | 'merge' | 'none'.
//   - No cloud doc → upload local.
//   - Cloud meaningful + local empty → apply (restore).
//   - Local meaningful + cloud empty → upload (never wipe richer with empty).
//   - Both meaningful → merge key by key (progressMerge.js) and report which
//     side(s) the merged result actually differs from: 'merge' if both sides
//     contributed something the other lacked, 'apply'/'upload' if only one
//     side needed updating, 'none' if the merge changed nothing. This is
//     content-based, not a single top-level-timestamp race — two devices
//     with real, different progress both keep their progress.
export function decideSyncAction({ cloud, local, lastSyncedAt: _lastSyncedAt = 0 }) {
  if (!cloud) return 'upload'
  const cloudMeaningful = isMeaningfulSnapshot(cloud)
  const localMeaningful = isMeaningfulSnapshot(local)
  if (!cloudMeaningful && !localMeaningful) return 'none'
  if (cloudMeaningful && !localMeaningful) return 'apply'
  if (!cloudMeaningful && localMeaningful) return 'upload'

  const mergedData = mergeProgressData(local.data, cloud.data, {
    preferLocalOnTie: (local.updatedAt || 0) >= (cloud.updatedAt || 0),
  })
  const localChanged = !progressDataEqual(mergedData, local.data)
  const cloudChanged = !progressDataEqual(mergedData, cloud.data)
  if (!localChanged && !cloudChanged) return 'none'
  if (localChanged && cloudChanged) return 'merge'
  return cloudChanged ? 'upload' : 'apply'
}

// ─── Firestore access (SDK loaded on demand, Google users only) ─────────────

async function firestore() {
  const { getFirestore, doc, getDoc, setDoc } = await import('firebase/firestore')
  return { db: getFirestore(app), doc, getDoc, setDoc }
}

function progressDocPath(uid) {
  return ['users', uid, 'progress', 'main']
}

export async function loadCloudProgress(uid) {
  const { db, doc, getDoc } = await firestore()
  const snap = await getDoc(doc(db, ...progressDocPath(uid)))
  return snap.exists() ? snap.data() : null
}

export async function saveCloudProgress(uid, snapshot) {
  const { db, doc, setDoc } = await firestore()
  await setDoc(doc(db, ...progressDocPath(uid)), snapshot)
}

// ─── Orchestration ───────────────────────────────────────────────────────────

function getSyncMeta(scope) { return getJsonForScope(scope, SYNC_META_KEY, {}) }
function setSyncMeta(scope, meta) { setJsonForScope(scope, SYNC_META_KEY, { ...getSyncMeta(scope), ...meta }) }

// The single reconciliation path — used for both the once-per-load restore
// (syncProgressForUser) and the lightweight backup fired on visibility
// change / after linking / before sign-out (backupProgressForUser). Both are
// "make local and cloud agree" operations that must never discard either
// side; the only difference between the two call sites is *when* they run,
// not *what* they do, so unifying them closes the gap where the old
// visibility-change backup pushed local up wholesale without first folding
// in anything cloud-only another device had added since the last sync.
//
// Only writes the side(s) that the merge actually changed, so a repeat call
// with nothing new to contribute (e.g. two lifecycle events firing close
// together) performs no writes at all.
//
// `scope` is captured once, right here, from the user object passed in —
// not read from storage.js's ambient "currently active" scope. That's what
// makes this safe to have in flight across an account switch: this call's
// local reads/writes always target *this* user's namespace, even if a
// different account becomes active on the device before the awaited
// Firestore round-trip resolves.
async function reconcile(user) {
  if (!firebaseEnabled) return { action: 'none', reason: 'firebase-disabled' }
  if (!user || user.provider !== 'google' || !user.uid) {
    return { action: 'none', reason: 'not-google-user' }
  }
  const scope = scopeForUser(user)

  const cloud = await loadCloudProgress(user.uid)
  const local = collectLocalProgressSnapshot(scope)
  // Reuse the same pure decision decideSyncAction exposes for tests, so the
  // rule that's independently unit-tested is exactly the rule that runs here.
  const action = decideSyncAction({ cloud, local })

  if (action === 'none') {
    setSyncMeta(scope, { lastSyncedAt: Math.max(local.updatedAt || 0, cloud?.updatedAt || 0) })
    return { action }
  }
  if (action === 'upload' && !cloud) {
    return uploadWithBudget(user, local, scope, action)
  }

  const mergedData = mergeProgressData(local.data, cloud.data, {
    currentUid: user.uid,
    preferLocalOnTie: (local.updatedAt || 0) >= (cloud.updatedAt || 0),
  })
  const mergedRaw = { version: SNAPSHOT_VERSION, updatedAt: Date.now(), data: mergedData }
  // Compact governed history before touching the cloud so an oversized document
  // is never sent (and never falsely reported as backed up). Compaction is
  // lossless for core state; persist it locally too when it changes anything.
  const budget = compactSnapshotForBudget(mergedRaw)
  const merged = budget.snapshot
  if (action === 'apply' || action === 'merge' || budget.compacted) {
    applyProgressSnapshot(merged, { currentUid: user.uid, scope })
  }
  if (action === 'upload' || action === 'merge') {
    if (!budget.withinBudget) {
      setSyncMeta(scope, { lastBlockedAt: Date.now() })
      return { action: 'blocked', reason: 'over-budget' }
    }
    await saveCloudProgress(user.uid, merged)
  }
  setSyncMeta(scope, { lastSyncedAt: merged.updatedAt })

  return { action }
}

// Fresh upload of a local snapshot (no cloud doc yet), gated by the size
// budget. Compacts first; if still over the hard budget the upload is blocked
// and the learner is told plainly — local progress is untouched. Any lossless
// compaction is persisted back to local storage so it stays bounded too.
async function uploadWithBudget(user, snapshot, scope, action) {
  const budget = compactSnapshotForBudget(snapshot)
  if (budget.compacted) applyProgressSnapshot(budget.snapshot, { currentUid: user.uid, scope })
  if (!budget.withinBudget) {
    setSyncMeta(scope, { lastBlockedAt: Date.now() })
    return { action: 'blocked', reason: 'over-budget' }
  }
  await saveCloudProgress(user.uid, budget.snapshot)
  setSyncMeta(scope, { lastSyncedAt: budget.snapshot.updatedAt })
  return { action }
}

// Once-per-app-load / post-link reconciliation. Pulls in anything cloud-only
// as well as pushing up anything local-only — see reconcile().
export async function syncProgressForUser(user) {
  return reconcile(user)
}

// Lightweight backup for lifecycle events (visibility change, before
// sign-out) — safe to call as often as needed; it's the same merge as
// syncProgressForUser, so it can never clobber cloud-only progress another
// device added since this device's last sync.
export async function backupProgressForUser(user) {
  return reconcile(user)
}
