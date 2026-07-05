# Auth Setup — Google Sign-In (Firebase Auth)

Google sign-in is real (Firebase Auth, Google provider only) — no email/password,
no other identity providers. Login is optional: a "Continue without Google"
path keeps the existing local, name-only flow with no account required.

## What's implemented

- `src/auth/firebaseClient.js` — Firebase app/auth init from `VITE_FIREBASE_*` env vars.
- `src/auth/authService.js` — `signInWithGoogle()` / `signOutGoogle()` via `signInWithPopup`.
- `src/auth/AuthContext.jsx` — two-step first-run flow (Google or guest → name confirm),
  plus `linkGoogleAccount()` for an already-onboarded guest to add Google later.
- `src/auth/progressStatus.js` — the three status strings shown in the app:
  - Logged out / guest: "Progress saved on this device"
  - Signed in with Google: "Signed in — progress still saved on this device"
  - Signed in and cloud-synced: "Progress saved to your account" — **not reachable
    yet**; no cloud sync exists in this pass, so this string is unused until a
    future sync layer sets `user.synced = true`.

**Not built in this pass:** cloud sync/Firestore, cross-device merge, parent
accounts, email/password auth. Signing in with Google today only proves
identity — progress still lives in this browser's `localStorage` only.

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
