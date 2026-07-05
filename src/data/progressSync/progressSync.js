// ─── Progress sync — Firestore backup for signed-in Google users ────────────
//
// One user-owned document: users/{uid}/progress/main
//   { version: 1, updatedAt: <ms since epoch>, data: { <storage key>: <value> } }
//
// local storage stays the runtime source of truth; Firestore is a backup that
// is reconciled once per app load (and topped up on visibility change / after
// account linking). Guests never sync — the Firestore SDK isn't even
// downloaded unless a Google-signed-in user reaches syncProgressForUser().
//
// Deliberately excluded from the snapshot:
//   - streakCelebrationShown:<date> — daily-expiring UI dedup flags, not
//     progress; the streak itself is derived from gcse_scores, which IS backed up.
//   - gcse_sync_meta — this service's own bookkeeping.

import { getJson, setJson, listKeys, getObject } from '../../lib/storage.js'
import { firebaseEnabled, app } from '../../auth/firebaseClient.js'

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
  'gcse_qf_q_history',
  'gcse_qf_prev_session',
  'gcse_qf_best',
  'gcse_todays_plan_revisit',
]

export const DYNAMIC_KEY_PREFIXES = ['gcse_module_']

// ─── Snapshot collect / apply (pure local storage side) ──────────────────────

export function collectLocalProgressSnapshot() {
  const data = {}
  const keys = [
    ...STATIC_PROGRESS_KEYS,
    ...DYNAMIC_KEY_PREFIXES.flatMap(prefix => listKeys(prefix)),
  ]
  for (const key of keys) {
    const value = getJson(key, undefined)
    if (value !== undefined) data[key] = value
  }
  return { version: SNAPSHOT_VERSION, updatedAt: Date.now(), data }
}

// Writes only the keys present in the snapshot — never deletes or renames
// anything else in local storage.
export function applyProgressSnapshot(snapshot, { currentUid } = {}) {
  const data = snapshot?.data
  if (!data || typeof data !== 'object') return 0
  let applied = 0
  for (const [key, value] of Object.entries(data)) {
    if (key === SYNC_META_KEY) continue
    // Defensive: never let a cloud riseUser for a different account replace
    // the current session's identity.
    if (key === 'riseUser' && currentUid && value?.uid && value.uid !== currentUid) continue
    setJson(key, value)
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
// Returns 'upload' | 'apply' | 'none'.
//   - No cloud doc → upload local.
//   - Cloud meaningful + local empty → apply (restore).
//   - Local meaningful + cloud empty → upload (never wipe richer with empty).
//   - Both meaningful → whichever is newer: cloud counts as newer only if it
//     changed since this device last synced (updatedAt > lastSyncedAt),
//     i.e. another device wrote in the meantime; otherwise local wins.
export function decideSyncAction({ cloud, local, lastSyncedAt = 0 }) {
  if (!cloud) return 'upload'
  const cloudMeaningful = isMeaningfulSnapshot(cloud)
  const localMeaningful = isMeaningfulSnapshot(local)
  if (!cloudMeaningful && !localMeaningful) return 'none'
  if (cloudMeaningful && !localMeaningful) return 'apply'
  if (!cloudMeaningful && localMeaningful) return 'upload'
  return (cloud.updatedAt || 0) > lastSyncedAt ? 'apply' : 'upload'
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

function getSyncMeta() { return getObject(SYNC_META_KEY) }
function setSyncMeta(meta) { setJson(SYNC_META_KEY, { ...getSyncMeta(), ...meta }) }

export async function syncProgressForUser(user) {
  if (!firebaseEnabled) return { action: 'none', reason: 'firebase-disabled' }
  if (!user || user.provider !== 'google' || !user.uid) {
    return { action: 'none', reason: 'not-google-user' }
  }

  const cloud = await loadCloudProgress(user.uid)
  const local = collectLocalProgressSnapshot()
  const { lastSyncedAt = 0 } = getSyncMeta()
  const action = decideSyncAction({ cloud, local, lastSyncedAt })

  if (action === 'upload') {
    await saveCloudProgress(user.uid, local)
    setSyncMeta({ lastSyncedAt: local.updatedAt })
  } else if (action === 'apply') {
    applyProgressSnapshot(cloud, { currentUid: user.uid })
    setSyncMeta({ lastSyncedAt: cloud.updatedAt || Date.now() })
  }
  return { action }
}

// Fire-and-forget backup of current local state (visibility change, post-link).
export async function backupProgressForUser(user) {
  if (!firebaseEnabled) return { action: 'none', reason: 'firebase-disabled' }
  if (!user || user.provider !== 'google' || !user.uid) {
    return { action: 'none', reason: 'not-google-user' }
  }
  const local = collectLocalProgressSnapshot()
  // Guard: an empty local state must never overwrite an existing meaningful
  // cloud backup (e.g. a fresh browser that hasn't restored yet).
  if (!isMeaningfulSnapshot(local)) {
    const cloud = await loadCloudProgress(user.uid)
    if (cloud && isMeaningfulSnapshot(cloud)) return { action: 'none', reason: 'empty-local-guard' }
  }
  await saveCloudProgress(user.uid, local)
  setSyncMeta({ lastSyncedAt: local.updatedAt })
  return { action: 'upload' }
}
