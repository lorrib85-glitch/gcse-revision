# Auth Setup — Google Sign-In (Firebase Auth) + Progress Backup (Firestore)

Google sign-in is real (Firebase Auth, Google provider only) — no email/password,
no other identity providers. Login is optional: a "Continue without Google"
path keeps the existing local, name-only flow with no account required.
Signed-in Google users additionally get their progress backed up to Firestore.

## What's implemented

- `src/auth/firebaseClient.js` — Firebase app/auth init from `VITE_FIREBASE_*` env vars.
- `src/auth/authService.js` — `signInWithGoogle()` / `signOutGoogle()` via `signInWithPopup`.
- `src/auth/AuthContext.jsx` — two-step first-run flow (Google or guest → name confirm),
  `linkGoogleAccount()` for an already-onboarded guest to add Google later,
  progress sync orchestration (reconcile on load, best-effort backup on
  visibility change and before sign-out), and account-scope switching —
  every sign-in/link/sign-out calls `setActiveScope()` (`src/lib/storage.js`)
  so local reads/writes immediately target the right account's namespace,
  with no full-page refresh.
- `src/lib/storage.js` — besides the raw localStorage wrapper, this is the
  account-ownership boundary: every logical key is transparently namespaced
  under the currently active scope (`'guest'` or `'uid:<firebase-uid>'`),
  derived synchronously from `riseUser` at module load and switched at
  runtime by `setActiveScope()`. Feature code never sees this — it keeps
  calling `getJson`/`setJson` with plain key names. `riseUser` and two small
  governance keys stay deliberately unscoped (they're what scoping itself is
  derived from). A one-time, idempotent migration moves any pre-scoping flat
  keys into the right namespace on first load — see
  `docs/system/PROGRESS_SYNC_ARCHITECTURE.md` for the full model.
- `src/data/progressSync/progressSync.js` — Firestore progress backup for
  Google users only. One document per user at `users/{uid}/progress/main`,
  shape `{ version: 1, updatedAt: <ms>, data: { <storage key>: <value> } }`.
  The Firestore SDK is dynamically imported, so guests never download it.
  Local storage remains the runtime source of truth; reconciliation is a real
  per-key merge (`progressSync/progressMerge.js`), not a whole-snapshot
  "pick a side" — see `docs/system/PROGRESS_SYNC_ARCHITECTURE.md`.
- `src/data/progressSync/accountScope.js` — the guest-progress claim flow:
  offers a guest's local snapshot to an account only at the moment of an
  explicit sign-in/link, tracked via an explicit claim state
  (`gcse_guest_claim_v1`) rather than inferred from whichever unscoped data
  happens to exist.
- `src/auth/progressStatus.js` — the status strings shown in the app:
  - Guest / logged out: "Using this device only. Sign in with Google to back up progress."
  - Signed in with Google, backup healthy: "Signed in — progress backs up to your account."
  - Signed in, backup failing: "Progress is saved on this device. Backup will
    retry when connection is available."
- `firestore.rules` — security rules (see below).

**Not built in this pass:** parent accounts, dashboards, email/password auth,
Realtime Database, Storage, Functions, Messaging, Analytics, App Check,
Firebase Hosting (Vercel remains the host).

## Firestore setup (console)

1. Firebase Console → Build → **Firestore Database** → Create database →
   production mode (any region; pick once, it can't change).
2. Open the **Rules** tab, paste the contents of `firestore.rules` from this
   repo, and **Publish**. The rules allow each authenticated user to read and
   write only `users/{their-own-uid}/progress/*`; everything else is denied.
3. No CLI, no `firebase deploy` — this repo does not use Firebase Hosting.
   `firestore.rules` is version-controlled documentation of what the console
   should contain; re-paste it after any edit.

## Local dev setup

1. Create (or reuse) a Firebase project at https://console.firebase.google.com.
2. Enable **Authentication > Sign-in method > Google**.
3. Add a Web app under Project settings > General > Your apps, copy its config.
4. Copy `.env.example` to `.env.local` and fill in the four `VITE_FIREBASE_*` values.
5. `pnpm dev` — Google sign-in works; without step 4, it's disabled gracefully
   (shows an error if tapped, guest path still works normally).

## Required Vercel environment variables

Set these in the Vercel project dashboard (Settings > Environment Variables),
not in source:

| Variable | Notes |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase web config — not secret, but env-scoped per deployment |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase web config |
| `VITE_FIREBASE_APP_ID` | Firebase web config |

`ANTHROPIC_API_KEY` (existing, unrelated to auth) stays server-side only for
the `/api/*` Edge Functions — never prefix it with `VITE_`.

Also add the deployment's domain (and `localhost` for preview builds if
needed) to Firebase Console > Authentication > Settings > Authorized domains,
or the Google popup will be rejected.
