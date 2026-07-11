# Progress Sync Architecture — Account Ownership, Guest Claims, Legacy Migration

**Scope:** how local progress is namespaced per account, how guest progress
is deliberately claimed by a signed-in account, how pre-scoping installations
are migrated safely, and how QuickFire's ranking memory persists and merges
across devices. Read this before touching `src/lib/storage.js`,
`src/data/progressSync/*`, or QuickFire's `logic/quickFireMemory.js`.

## Why this exists

Before account scoping, every progress key (`gcse_progress`,
`gcse_module_<id>`, `gcse_scores`, ...) was a single flat `localStorage`
entry shared by whoever happened to be signed in on a device. Learner A's
leftover local data after signing out could be read as Learner B's "local
progress" the moment B signed in on the same browser, and folded straight
into B's Firestore document on the first reconcile. The fix below closes
that without a second parallel persistence system, without every feature
needing to know about Firebase `uid`s, and without scattering ownership
checks through learning components.

## The storage ownership model

`src/lib/storage.js` is still the *only* file that touches `localStorage`
directly (enforced by `tests/architecture/storage-boundary.test.js`), and it
is also the account-ownership boundary — namespacing is applied there,
transparently, not by callers.

- **Active scope**: a module-level string, either `'guest'` (`GUEST_SCOPE`)
  or `'uid:<firebase-uid>'`, derived synchronously from `riseUser` the
  moment `storage.js` is first imported (before any component renders, and
  before any other module's own import-time code can read a scoped key).
  `setActiveScope()` — called only from `src/auth/AuthContext.jsx` — updates
  it on every sign-in, link, and sign-out.
- **Plain reads/writes are transparently scoped**: `getJson`, `setJson`,
  `removeKey`, `listKeys`, `saveCritical` all resolve to a physical key of
  `<scope>::<logical key>` under the hood. `progress.js`, the QuickFire
  logic files, the daily planner, `unifiedWeaknessTracker.js` — none of them
  changed to make this work, and none of them import a uid or construct a
  scoped key themselves.
- **`riseUser` is deliberately never scoped.** It's the bootstrap pointer
  scoping itself is derived from — scoping it would be circular. It stays a
  single global key, alongside two small governance keys
  (`gcse_legacy_migration_v1`, `gcse_guest_claim_v1`) that also need to be
  readable independent of whatever scope is currently active.
- **Explicit-scope primitives** (`getJsonForScope`, `setJsonForScope`,
  `listKeysForScope`, `removeKeyForScope`) let the sync/migration layer
  target *a specific account's* namespace regardless of what's currently
  active — see "Why pending work can't leak across an account switch" below.
- **Raw primitives** (`getRawJson`, `setRawJson`, `removeRawKey`) bypass
  scoping entirely, for `riseUser` and the two governance keys above.

## Guest progress and the claim flow (`src/data/progressSync/accountScope.js`)

A guest's progress lives in the single, stable `GUEST_SCOPE` namespace, and
must never become visible to an account automatically. It's offered to an
account only at the moment of a deliberate transition —
`AuthContext.completeOnboarding` (fresh Google sign-in) or
`linkGoogleAccount` (guest linking Google later) — via
`claimGuestProgressForUser(user)`.

The claim is tracked with an **explicit state**, not inferred from whichever
unscoped keys happen to exist: `gcse_guest_claim_v1` holds
`{ status: 'claiming' | 'claimed' | 'failed', targetUid, ... }`.

1. `claimGuestProgressForUser(user)` — local-only. Merges the guest
   namespace into `uid:<user.uid>`'s namespace using the same governed
   per-key rules as cross-device sync (`progressMerge.js`), sets
   `status: 'claiming'`. Idempotent: re-running it once claimed is a no-op
   (`isMeaningfulData` on an emptied guest scope returns false); retrying
   after a failure re-merges the same data into a target that already has
   it, which `progressMerge.js`'s `merge(x, x) === x` guarantee makes safe.
2. AuthContext then runs its normal cloud reconcile (`syncProgressForUser`)
   for that uid.
3. **Only on that reconcile's success** does `finalizeGuestClaim(user)` run
   — clearing the guest namespace (so it can't be re-offered to a different
   account, and so a fresh guest session afterwards starts empty) and
   setting `status: 'claimed'`.
4. **On failure**, `markGuestClaimFailed(user)` sets `status: 'failed'` and
   leaves both the guest snapshot and the already-merged uid-scoped copy
   exactly as they are — nothing is deleted before a successful cloud
   reconcile. A later successful reconcile (retry, or the bounded
   online-retry in AuthContext) still finalizes correctly, because
   `finalizeGuestClaim` accepts both `'claiming'` and `'failed'` as valid
   predecessor states for the same `targetUid`.

An in-flight or recently-failed claim stays earmarked for the uid it was
started for — `claimableGuestProgress(user)` refuses to offer that same
guest snapshot to a *different* account while it's `'claiming'`/`'failed'`
for someone else, so an interrupted claim (e.g. a page reload mid-flight)
can't be hijacked by whichever account happens to sign in next.

## Legacy flat-key migration (`runLegacyFlatMigration` in `storage.js`)

Installations that predate account scoping have real progress sitting under
flat, unscoped keys. `runLegacyFlatMigration()` runs once, synchronously, at
`storage.js`'s own module-load time — before any other module's import-time
code (e.g. `progress.js`'s own legacy module-id shim) can read or write a
scoped key.

**Ownership rule** — the only signal trusted is `riseUser`, and only when it
genuinely proves ownership:

- `riseUser.provider === 'google' && riseUser.uid` → legacy data moves into
  that uid's namespace. This is *proof*, not a guess — it is never "whoever
  signs in first after deployment." `riseUser` stays as-is.
- Ambiguous (no `riseUser`, a guest profile, a malformed one) **and the data
  is meaningful** → legacy data moves into a dedicated **`QUARANTINE_SCOPE`**
  (`'quarantine'`), *not* the guest namespace. The previous guest identity
  (`riseUser` name) is sequestered under `quarantine::__quarantined_profile__`
  and the raw `riseUser` cleared, so the app opens at onboarding rather than
  greeting a stranger by the old name. Nothing is deleted.
- Ambiguous but **not** meaningful (only empty arrays/objects left over) →
  guest namespace as before; there is nothing private to hide.

## Why quarantine, not guest, for ambiguous data

The guest namespace *is* the active scope for a fresh visitor. Putting
ambiguous legacy progress there would make the previous learner's name,
streak, plan, scores, module progress, weaknesses, QuickFire history and
completed learning silently appear as the new guest's own. `QUARANTINE_SCOPE`
is **never** an active scope (`setActiveScope` only ever receives `'guest'` or
`'uid:<uid>'`), so quarantined data is:

- never read by plain `getJson`/etc.,
- never collected into a guest snapshot (`collectLocalProgressSnapshot` reads
  guest/uid scopes, not quarantine),
- never reconciled to any cloud document,
- never claimed by a sign-in (`claimGuestProgressForUser` reads the guest
  namespace only).

**Deliberate recovery** (`accountScope.js`) drives the "Progress found on this
device" card (`ProgressRecoveryCard.jsx`), which reveals *nothing* about the
previous learner (no name/scores/subjects):

- `hasQuarantinedProgress()` / `shouldOfferQuarantineRecovery()` — is there
  meaningful quarantined progress the learner hasn't resolved yet?
- `adoptQuarantinedProgress()` — "Use this progress": merges the quarantined
  snapshot into the **guest** scope once (never a Google account), restores
  the sequestered name only if no live identity exists, then clears quarantine
  so a reload can't re-offer or duplicate it. Idempotent.
- `dismissQuarantineRecovery()` — "Start fresh": stops offering the card but
  **retains** the snapshot; a mis-tap is never destructive.
- `discardQuarantinedProgress()` — the separate, explicit permanent-delete
  path (not wired to the two-button card).

`gcse_quarantine_v1` (raw, never-scoped) records the resolution
(`{ status: 'dismissed' | 'adopted' | 'discarded' }`).

**Idempotency**: gated by a persisted flag (`gcse_legacy_migration_v1`) and,
independently, migration never overwrites a scoped key that already has
data. A repeat run (reload before the flag write landed, or a second call
during auth restoration) can't duplicate anything or re-run against data
that's already been moved.

**What's preserved**: the migration copies every flat key it finds
verbatim (no re-serialization, no schema changes) except `riseUser` and the
governance keys, which were never "legacy" — they're already correctly
global. Unknown/future fields survive because nothing is parsed or
reshaped, just relocated.

## Why pending work can't leak across an account switch

`reconcile()` (`progressSync.js`) computes `scopeForUser(user)` once, at the
top of the call, and threads that captured scope through every local
read/write for the rest of that call — never the ambient "currently active"
scope. A reconcile started for account A that's still awaiting its Firestore
round-trip when the device switches to account B keeps reading and writing
*A's own* namespace and *A's own* cloud document; it's structurally
incapable of touching B's, no cancellation token needed.

The one place this isn't automatic is `riseUser` (global, not scoped):
`applyProgressSnapshot` refuses to write it unless the snapshot's uid
matches the reconcile's own `currentUid`, **and** the uid actually active on
the device right now still matches too — so a stale reconcile from an
account that has since signed out/switched can never overwrite the identity
pointer for whichever account is now active.

## QuickFire ranking memory — per-answer persistence and multi-device merge

`src/features/quickfire/logic/quickFireMemory.js` (pure, storage.js-backed).

- **Per-answer persistence**: `bumpQuickFireMemoryForAnswer(question, isCorrect)`
  is called from `QuickFireMode`'s `onAnswer`, immediately, for every
  committed answer — not batched to round end. `finishRound` only *reads*
  `gcse_quickfire_memory_v1` for the summary screen; it never writes to it.
  An abandoned round (tab closed, navigated away) keeps every answer already
  made in the ranking memory `selectQuickFireQueue` uses to prioritise weak
  subjects/topics, and a round finishing normally can't double-count what
  was already persisted per-answer.
- **Multi-device merge**: each bump also appends a stable-id event to
  `gcse_qf_answer_log` (bounded, capped at 4000) — now stamped with the
  creating device's id (`dev`) and a per-device monotonic `seq` — and captures
  a one-time `seedAnswered`/`seedCorrect` on a bucket's first write after
  upgrading (the value both devices are expected to share from their last
  common sync). `progressMerge.js` merges two devices' buckets as
  `seed + folded + |deduplicated unfolded events|`, recovering independent
  activity a naive per-field max would silently drop (two devices diverging
  from a synced base of 10, answering 3 and 4 different new questions
  respectively, correctly merge to 17 — not `max(13, 14) = 14`). Buckets with
  no seed/event/baseline evidence on either side (pre-log historical data)
  fall back to max-merge, and a legacy aggregate-only total is never regressed
  below by a reconstruction, so old records stay readable and nothing is
  fabricated.

- **Merge-safe compaction (`gcse_qf_baseline_v1`)**: raw events don't live
  forever, so once the log exceeds the cap a device folds its OWN aged events
  into a grow-only **per-device accumulator baseline** (a G-Counter CRDT)
  before they're trimmed — `{ folded: {[dev]: maxSeq}, subjects/topics:
  {[key]: {[dev]: {answered, correct}}} }`. Because each event increments
  exactly one device's cell and cells merge by `max` (a monotonic prefix
  count keyed by `seq`), raw-event trimming can never reduce a historical
  total, the same event is never counted twice across devices, repeated syncs
  are idempotent, and a device holding a compacted baseline merges correctly
  with one holding newer raw events. Folding is contiguous-prefix only, so
  `seq <= folded[dev]` exactly means "already in the baseline" and the merge
  prunes those events from the log. The pure compaction/merge core lives in
  `progressMerge.js` (`compactAnswerLog`, `mergeQfBaseline`); `quickFireMemory.js`
  supplies the device id/seq and calls it on write. `gcse_qf_device_v1` holds
  the per-scope device id + seq counter. All new fields are additive and
  backward-compatible: data without `dev`/`seq`/baseline keeps using the
  seed/max path.

## Snapshot size budget (`snapshotBudget.js`)

Firestore rejects any document over 1 MiB, and the progress snapshot grows
with QuickFire evidence and history logs. Rather than discover the limit at
write time, `snapshotBudget.js` (pure) measures the serialised snapshot before
every cloud write and, if it exceeds the hard budget, compacts **only** history
structures with explicit retention rules:

- **Thresholds**: `WARN_BYTES` 700 KiB, `HARD_BYTES` 900 KiB — ~127 KiB of
  headroom under the 1 MiB Firestore limit for metadata, future fields and
  merge expansion.
- **Compacted (most-expendable first)**: fold `gcse_qf_answer_log` into
  `gcse_qf_baseline_v1` (lossless — totals preserved), trim `gcse_qf_q_history`
  (per-question ranking detail) to the newest by `lastAt`, trim `gcse_scores`
  (historical score log, already capped at 200) to the newest.
- **Never touched**: `gcse_progress` (streak), `gcse_module_*` (completion),
  `gcse_mastery_v1`, `gcse_planner_*` (active planner),
  `gcse_quickfire_memory_v1` (aggregate buckets), `gcse_qf_baseline_v1`,
  `gcse_qf_best`, `riseUser`, and every unknown/future key.

Deterministic and idempotent (retention caps are fixed). `reconcile()` compacts
before any upload; if a snapshot is *still* over the hard budget after safe
compaction, the cloud write is **blocked** — local progress stays intact and
the learner is told plainly it couldn't be backed up (never falsely told it
was), via the existing sync-status system. See "Honest oversize handling"
below.

## Honest oversize handling

`reconcile()` runs `compactSnapshotForBudget` on the snapshot it is about to
upload. If the result is within budget it uploads normally. If it is still over
`HARD_BYTES` (core state alone is enormous — extremely rare), it returns
`{ action: 'blocked', reason: 'over-budget' }` and does **not** call
`saveCloudProgress`: the local copy is untouched and fully usable, and
`AuthContext` maps `blocked` to a distinct `syncStatus` (`'blocked'`) whose
`progressStatus.js` wording is "Saved on this device — your progress is safe
here, but we couldn't back up everything yet." No document size, bytes or
Firestore detail ever reaches the learner, and normal learners see no new UI.

## Testing

- `tests/unit/storage/storage.test.js` — scoping primitives, raw keys,
  explicit-scope primitives, legacy migration (proven ownership, ambiguous
  ownership → quarantine, identity sequestration, idempotency, never-overwrite).
- `tests/unit/progressSync/accountScope.test.js` — quarantine recovery
  (adopt into guest once, restore name, "start fresh" retains, explicit
  discard, never attach to an account).
- `tests/unit/progressSync/progressSync.test.js` /
  `tests/unit/progressSync/progressMerge.test.js` — snapshot collect/apply,
  merge decision matrix, per-key merge rules including the divergent-device
  QuickFire scenario, and the size-budget block vs. compact-and-upload paths.
- `tests/unit/progressSync/snapshotBudget.test.js` — measurement, lossless
  fold of an oversized snapshot, core-state preservation, idempotency,
  governed trimming.
- `tests/unit/quickfire/quickFireMemory.test.js` — per-answer persistence,
  seed capture, answer-log events (incl. device id / seq), round-abandonment
  survival.
- `tests/unit/quickfire/quickFireCompaction.test.js` — near-cap folding,
  divergent devices after a shared baseline, mixed legacy+compacted merge.
- `tests/rules/firestore.rules.test.js` — emulator-backed proof of account
  isolation (run via `pnpm test:rules`; see AUTH_SETUP.md).
- `tests/unit/journeys/accountIsolationJourneys.test.js` — end-to-end
  proofs for the account-isolation scenarios: two accounts on one browser,
  guest claims progress, a failed claim recovers, legacy data with proven
  ownership vs. ambiguous → quarantine (shared device, deliberate recovery,
  sign-in leaves quarantine untouched), a pending write surviving an account
  switch, and an abandoned QuickFire round.
- `tests/unit/journeys/persistenceGrowthJourneys.test.js` — long-lived
  QuickFire account crossing the raw-event budget (compaction preserves
  totals, new answers accumulate, merge stays correct) and a snapshot near
  the safety threshold (governed history compacted, core progress unchanged,
  snapshot becomes safe to sync).
- `tests/unit/journeys/learnerJourneys.test.js` — the pre-existing sync
  safety journeys (guest linking, stale-device sign-in, divergent devices,
  offline learning, sign-out with pending work, auth restoration).
