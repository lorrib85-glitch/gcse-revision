// ─── Guest progress claiming ─────────────────────────────────────────────
//
// A guest's local progress lives in the single, stable GUEST_SCOPE namespace
// (src/lib/storage.js). It must never be visible to an account automatically
// — only a deliberate sign-in/link transition (AuthContext.completeOnboarding
// / linkGoogleAccount) offers it to *that* account's reconciliation.
//
// gcse_guest_claim_v1 (a raw, never-scoped key) records the state of that
// offer so it's explicit and testable rather than inferred from "whichever
// unscoped keys happen to exist":
//   { status: 'claiming' | 'claimed' | 'failed', targetUid, startedAt/claimedAt/failedAt }
// No record at all (or a resolved 'claimed'/'failed' for a *different* uid
// once the guest namespace is empty again) means "nothing pending".
//
// The claim itself is a local-only merge (guest data folded into the target
// uid's namespace via the same governed per-key rules used for cross-device
// sync — see progressMerge.js). It never talks to Firestore; the caller
// (AuthContext) runs the normal cloud reconcile immediately afterwards and
// only calls finalizeGuestClaim() once that has actually succeeded — so a
// failed reconcile leaves the guest snapshot fully intact and recoverable,
// and a retry is safe because the merge is idempotent.

import {
  getJsonForScope, setJsonForScope, removeKeyForScope, listKeysForScope,
  getRawJson, setRawJson, scopeForUser, GUEST_SCOPE,
  QUARANTINE_SCOPE, QUARANTINE_PROFILE_KEY,
} from '../../lib/storage.js'
import { mergeProgressData } from './progressMerge.js'
import { collectLocalProgressSnapshot, STATIC_PROGRESS_KEYS, DYNAMIC_KEY_PREFIXES } from './progressSync.js'

const GUEST_CLAIM_KEY = 'gcse_guest_claim_v1'
const QUARANTINE_FLAG_KEY = 'gcse_quarantine_v1'

function readClaimState() {
  return getRawJson(GUEST_CLAIM_KEY, { status: 'unclaimed', targetUid: null })
}

function isMeaningfulData(data) {
  return Object.entries(data || {}).some(([key, value]) => {
    if (key === 'riseUser') return false
    if (value === null || value === undefined) return false
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return true
  })
}

function collectGuestData() {
  return collectLocalProgressSnapshot(GUEST_SCOPE).data
}

// Is there guest progress this user is allowed to claim right now? False if
// there's nothing meaningful in the guest namespace, or if another account's
// claim on this same snapshot is still in flight / recently failed (an
// interrupted claim stays earmarked for the account it was started for,
// rather than becoming up for grabs by whoever signs in next).
export function claimableGuestProgress(user) {
  const guestData = collectGuestData()
  if (!isMeaningfulData(guestData)) return false
  const claim = readClaimState()
  if ((claim.status === 'claiming' || claim.status === 'failed') &&
      claim.targetUid && claim.targetUid !== user?.uid) {
    return false
  }
  return true
}

// Adopts the current browser's guest snapshot into the given uid's local
// namespace. Local-only — does not touch Firestore. Idempotent: safe to call
// repeatedly (retry after a failed reconcile, or an accidental duplicate
// sign-in call) because it merges rather than overwrites, and merge(x, x)
// leaves x unchanged (progressMerge.js).
export function claimGuestProgressForUser(user) {
  if (!claimableGuestProgress(user)) return { claimed: false }
  const uid = user.uid
  setRawJson(GUEST_CLAIM_KEY, { status: 'claiming', targetUid: uid, startedAt: Date.now() })

  const guestData = collectGuestData()
  const targetScope = scopeForUser(user)
  const existingTargetData = collectLocalProgressSnapshot(targetScope).data
  const merged = mergeProgressData(guestData, existingTargetData, { currentUid: uid })
  for (const [key, value] of Object.entries(merged)) {
    setJsonForScope(targetScope, key, value)
  }
  return { claimed: true }
}

// Call only once the post-claim cloud reconcile has actually succeeded.
// Clears the guest namespace so it can't be re-offered to a different
// account later, and so a fresh guest session afterwards starts empty
// rather than inheriting progress that already belongs to `user`.
//
// Accepts both 'claiming' (first attempt succeeded outright) and 'failed'
// (a previous attempt failed and this is a successful retry — the retry
// paths don't re-run claimGuestProgressForUser, only reconcile again, so
// the state is still 'failed' from markGuestClaimFailed when this finally
// succeeds) — either way the local merge already happened and belongs to
// this uid, so it's safe to finalize.
export function finalizeGuestClaim(user) {
  const claim = readClaimState()
  const inFlightForThisUser = (claim.status === 'claiming' || claim.status === 'failed') && claim.targetUid === user?.uid
  if (!inFlightForThisUser) return
  for (const key of [...STATIC_PROGRESS_KEYS, ...DYNAMIC_KEY_PREFIXES.flatMap(p => listKeysForScope(GUEST_SCOPE, p))]) {
    removeKeyForScope(GUEST_SCOPE, key)
  }
  setRawJson(GUEST_CLAIM_KEY, { status: 'claimed', targetUid: user.uid, claimedAt: Date.now() })
}

// The post-claim cloud reconcile failed. Leaves the guest snapshot and the
// uid-scoped local copy exactly as they are (nothing is deleted) — the next
// successful reconcile for the same uid can retry via finalizeGuestClaim.
export function markGuestClaimFailed(user) {
  const claim = readClaimState()
  if (claim.status === 'claiming' && claim.targetUid === user?.uid) {
    setRawJson(GUEST_CLAIM_KEY, { ...claim, status: 'failed', failedAt: Date.now() })
  }
}

// ─── Quarantined legacy progress (ambiguous, unproven ownership) ─────────
//
// The one-time flat-key migration (storage.js) routes legacy progress whose
// owner can't be proven into the QUARANTINE_SCOPE namespace instead of the
// guest one, and sequesters the previous guest identity under
// QUARANTINE_PROFILE_KEY. That namespace is never active, never collected into
// a guest snapshot, and never reconciled to the cloud — so it can't silently
// surface as the next learner's own progress, and signing into an account
// can't claim it (claimGuestProgressForUser reads GUEST_SCOPE only).
//
// The learner recovers it deliberately via the "Progress found on this device"
// card:
//   - "Use this progress" → adoptQuarantinedProgress(): merge into the guest
//     scope once, restore the sequestered name, then clear quarantine so a
//     reload can't re-offer or duplicate it. Still only guest progress — never
//     auto-attached to a Google account (that needs a later explicit claim).
//   - "Start fresh" → dismissQuarantineRecovery(): stop offering the card but
//     RETAIN the snapshot; nothing is destroyed. discardQuarantinedProgress()
//     is the separate, explicit permanent-delete path.
//
// gcse_quarantine_v1 (raw, never-scoped) records the resolution
// ({ status: 'dismissed' | 'adopted' | 'discarded', at }) so the card is shown
// at most until the learner acts on it.

function readQuarantineFlag() {
  return getRawJson(QUARANTINE_FLAG_KEY, null)
}

// The quarantined progress keys, EXCLUDING riseUser — riseUser is a raw,
// never-scoped key (storage.js), so any *ForScope call on it would read/clear
// the single global identity pointer, not a quarantine-scoped entry. The
// sequestered identity lives under QUARANTINE_PROFILE_KEY (which IS scoped)
// and is handled explicitly on adopt.
function quarantineProgressKeys() {
  return [
    ...STATIC_PROGRESS_KEYS.filter(k => k !== 'riseUser'),
    ...DYNAMIC_KEY_PREFIXES.flatMap(p => listKeysForScope(QUARANTINE_SCOPE, p)),
  ]
}

function collectQuarantineData() {
  const data = {}
  for (const key of quarantineProgressKeys()) {
    const value = getJsonForScope(QUARANTINE_SCOPE, key, undefined)
    if (value !== undefined) data[key] = value
  }
  return data
}

function clearQuarantineScope() {
  for (const key of [...quarantineProgressKeys(), QUARANTINE_PROFILE_KEY]) {
    removeKeyForScope(QUARANTINE_SCOPE, key)
  }
}

// Is there meaningful quarantined progress on this device (regardless of
// whether the recovery card has been dismissed)? Used to know it's still
// recoverable.
export function hasQuarantinedProgress() {
  return isMeaningfulData(collectQuarantineData())
}

// Should the "Progress found on this device" card be shown? Only when there's
// meaningful quarantined progress the learner hasn't yet resolved.
export function shouldOfferQuarantineRecovery() {
  if (!hasQuarantinedProgress()) return false
  const flag = readQuarantineFlag()
  return !flag?.status
}

// "Use this progress": fold the quarantined snapshot into the guest namespace
// (local-only — never a Google account), restore the sequestered name if the
// device has no active identity, then clear quarantine so it happens exactly
// once. Idempotent: after clearing, hasQuarantinedProgress() is false, so a
// reload can't re-adopt or duplicate it.
export function adoptQuarantinedProgress() {
  const quarantined = collectQuarantineData()
  if (!isMeaningfulData(quarantined)) {
    setRawJson(QUARANTINE_FLAG_KEY, { status: 'adopted', at: Date.now() })
    return { adopted: false }
  }
  const existingGuest = collectLocalProgressSnapshot(GUEST_SCOPE).data
  const merged = mergeProgressData(quarantined, existingGuest)
  for (const [key, value] of Object.entries(merged)) {
    setJsonForScope(GUEST_SCOPE, key, value)
  }
  // Restore the previous name only if the learner hasn't already established a
  // fresh identity on this device — never override a live profile.
  const sequesteredProfile = getJsonForScope(QUARANTINE_SCOPE, QUARANTINE_PROFILE_KEY, null)
  if (sequesteredProfile && !getRawJson('riseUser', null)) {
    setRawJson('riseUser', sequesteredProfile)
  }
  clearQuarantineScope()
  setRawJson(QUARANTINE_FLAG_KEY, { status: 'adopted', at: Date.now() })
  return { adopted: true }
}

// "Start fresh": stop offering the card but keep the snapshot intact — a
// mis-tap must not be destructive. Only discardQuarantinedProgress() actually
// deletes it.
export function dismissQuarantineRecovery() {
  setRawJson(QUARANTINE_FLAG_KEY, { status: 'dismissed', at: Date.now() })
}

// Explicit, permanent deletion of the quarantined snapshot. Not wired to the
// two-button recovery card — reserved for a deliberate confirmed delete.
export function discardQuarantinedProgress() {
  clearQuarantineScope()
  setRawJson(QUARANTINE_FLAG_KEY, { status: 'discarded', at: Date.now() })
}

// Re-exported for convenience so callers only need one import for the
// account-scope surface.
export { getJsonForScope, scopeForUser, GUEST_SCOPE }
