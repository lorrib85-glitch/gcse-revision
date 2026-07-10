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
  `gcse_qf_answer_log` (bounded, capped at 4000) and captures a one-time
  `seedAnswered`/`seedCorrect` on a bucket's first write after upgrading —
  the value both devices are expected to share from their last common sync.
  `progressMerge.js` merges two devices' buckets as
  `seed + |deduplicated events|` when log evidence exists, recovering
  independent activity a naive per-field max would silently drop (two
  devices diverging from a synced base of 10, answering 3 and 4 different
  new questions respectively, correctly merge to 17 — not `max(13, 14) = 14`).
  Buckets with no matching log evidence on either side (pre-log historical
  data) fall back to the original max-merge unchanged, so old aggregate-only
  records stay readable and nothing is fabricated for history that was never
  logged.

## Testing

- `tests/unit/storage/storage.test.js` — scoping primitives, raw keys,
  explicit-scope primitives, legacy migration (proven ownership, ambiguous
  ownership, idempotency, never-overwrite).
- `tests/unit/progressSync/progressSync.test.js` /
  `tests/unit/progressSync/progressMerge.test.js` — snapshot collect/apply,
  merge decision matrix, per-key merge rules including the divergent-device
  QuickFire scenario.
- `tests/unit/quickfire/quickFireMemory.test.js` — per-answer persistence,
  seed capture, answer-log events, round-abandonment survival.
- `tests/unit/journeys/accountIsolationJourneys.test.js` — end-to-end
  proofs for the account-isolation scenarios: two accounts on one browser,
  guest claims progress, a failed claim recovers, legacy data with proven
  vs. ambiguous ownership, a pending write surviving an account switch, and
  an abandoned QuickFire round.
- `tests/unit/journeys/learnerJourneys.test.js` — the pre-existing sync
  safety journeys (guest linking, stale-device sign-in, divergent devices,
  offline learning, sign-out with pending work, auth restoration).
