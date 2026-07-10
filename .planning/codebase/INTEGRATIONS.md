# External Integrations

**Analysis Date:** 2026-07-09

## APIs & External Services

**AI Grading & Feedback:**
- Claude AI (Anthropic) — Exam answer grading and feedback
  - SDK/Client: Direct HTTPS to `https://api.anthropic.com/v1/messages`
  - Model: `claude-sonnet-4-5-20250929`
  - Auth: `ANTHROPIC_API_KEY` environment variable (server-side, Vercel secrets)
  - Used by: `api/grade.js`, `api/recall.js`, `api/examiner.js`, `api/guidedExamResponse.js`, `api/examRoundDebrief.js`

**Font Delivery:**
- Google Fonts API — CSS font libraries
  - Fonts: Manrope, Sora, Outfit, Inter, Space Grotesk, Caveat, IBM Plex Serif
  - Delivery: `<link>` tags in `index.html` (preconnect to fonts.googleapis.com, fonts.gstatic.com)
  - No authentication required

## Data Storage

**Authentication & User Identity:**
- Firebase Authentication
  - Provider: Google OAuth 2.0 via `signInWithPopup`
  - SDK: `firebase` v12.15.0
  - Implementation: `src/auth/firebaseClient.js` (init), `src/auth/authService.js` (sign-in/sign-out)
  - Environment config: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`
  - Local fallback: Missing Firebase config does not crash the app; Google sign-in becomes unavailable

**Databases:**
- Firestore (Firebase Cloud Database)
  - Type: NoSQL document store
  - Connection: `firebase/firestore` (dynamically imported on demand)
  - Client: Firebase SDK native API (getFirestore, doc, getDoc, setDoc)
  - Data model: Single user progress document at `users/{uid}/progress/main`
  - Schema:
    ```javascript
    {
      version: 1,
      updatedAt: <milliseconds>,
      data: {
        riseUser: <user profile>,
        gcse_scores: <object>,
        gcse_wrong_answers: <object>,
        gcse_correct_answers: <object>,
        gcse_exam_techniques: <object>,
        gcse_coach_type_results: <object>,
        gcse_progress: <object>,
        gcse_planner_rotation: <object>,
        gcse_planner_prefs: <object>,
        gcse_planner_weakpoints: <object>,
        gcse_planner_paper_results: <object>,
        gcse_mastery_v1: <object>,
        gcse_quickfire_memory_v1: <object>,
        gcse_qf_q_history: <object>,
        gcse_qf_prev_session: <object>,
        gcse_qf_best: <object>,
        gcse_todays_plan_revisit: <object>,
        gcse_module_*: <per-module state>
      }
    }
    ```
  - Backup strategy: Cloud Firestore acts as secondary backup; localStorage is runtime source of truth
  - Sync trigger: App load + visibility change + account linking. Account
    linking additionally runs a local-only guest-progress claim
    (`src/data/progressSync/accountScope.js`) before the Firestore reconcile
    — a guest's local snapshot is only ever offered to the specific account
    it's deliberately linked/signed into, tracked via an explicit claim
    state, never inferred from whichever unscoped data exists
  - Sync scope: Google-authenticated users only; guest users never sync.
    Each reconcile call captures its target account's storage scope once, up
    front, and never touches the ambient "currently active" scope — so a
    reconcile still in flight when the device switches accounts can't write
    into the new account's namespace or cloud document
  - See `docs/system/PROGRESS_SYNC_ARCHITECTURE.md` for the full model

**File Storage:**
- Local filesystem only
  - Uses browser localStorage API for persistent client-side state
  - Managed via `src/lib/storage.js` (abstraction layer)
  - No remote file/blob storage (images/PDFs served as static assets from `/public/`)

**Caching:**
- None detected
  - Lazy loading via dynamic `import()` for large modules and exam question banks
  - Code splitting at bundle level via Vite

## Authentication & Identity

**Auth Provider:**
- Google OAuth 2.0 (Firebase Auth)
  - Implementation: `signInWithPopup(auth, googleProvider)` → returns `{ uid, email, displayName, photoURL }`
  - Storage: User profile cached in `localStorage.riseUser` (JSON)
  - Session persistence: `getStoredUser()`, `storeUser(data)`, `clearUser()`
  - Sign-out: `signOutGoogle()` (Firebase + localStorage clear)
  - Fallback: No auth required; app works for guest users (unsynced localStorage state)

**User Profile Data:**
- Stored locally in localStorage under key `riseUser` — one of a small set
  of keys `src/lib/storage.js` deliberately never namespaces per account
  (it's the signal every other key's namespace is derived from; namespacing
  it would be circular). Every other progress key (`gcse_progress`,
  `gcse_module_<id>`, `gcse_scores`, ...) *is* namespaced per account —
  see `docs/system/PROGRESS_SYNC_ARCHITECTURE.md`
- Synced to Firestore only for Google-authenticated users
- Schema:
  ```javascript
  {
    uid: <string>,
    email: <string>,
    displayName: <string>,
    photoURL: <string>,
    provider: 'google'
  }
  ```

## Monitoring & Observability

**Error Tracking:**
- None detected
- App includes basic error boundary in `src/main.jsx` for React component errors + chunk load failures
- No external error reporting (Sentry, Rollbar, etc.)

**Logs:**
- Browser console only
- No centralized log aggregation
- localStorage JSON blobs for progress/state tracking (application state, not diagnostic logs)

## CI/CD & Deployment

**Hosting:**
- Vercel — Frontend + Edge Functions
- Deployment: `vercel.json` config
  - Build command: `vite build`
  - Output directory: `dist/`
  - Framework: Vite
  - Rewrites: `/api/*` → serverless functions; `/*` → `index.html` (SPA routing)

**CI Pipeline:**
- GitHub Actions (inferred from `.github/` directory presence)
- Build steps: npm/pnpm install → lint → test:architecture → build
  - Command: `pnpm verify` (runs lint + test:architecture + build)
- No explicit coverage threshold detected

## API Endpoints

**Internal (Vercel Edge Functions):**

| Endpoint | Purpose | Auth | Model |
|----------|---------|------|-------|
| `POST /api/grade` | Exam question grading + feedback | Public | Claude Sonnet 4.5 |
| `POST /api/recall` | Free-text recall scoring + concept tracking | Public | Claude Sonnet 4.5 |
| `POST /api/examiner` | Exam technique scaffolding + feedback | Public | Claude Sonnet 4.5 |
| `POST /api/guidedExamResponse` | Guided exam response coaching | Public | Claude Sonnet 4.5 |
| `POST /api/examRoundDebrief` | End-of-round synthesis + pattern logging | Public | Claude Sonnet 4.5 |

All API endpoints expect JSON POST requests and return JSON responses. No API key validation on client side (client-side secrets are not used; `ANTHROPIC_API_KEY` is server-side only).

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected
- Progress sync is pull-based (app loads from Firestore, reconciles with localStorage, then pushes back)
- No event streaming or pub/sub integrations

## Environment Configuration

**Required Client-Side env vars (Vite):**
```
VITE_FIREBASE_API_KEY=<public Firebase API key>
VITE_FIREBASE_AUTH_DOMAIN=<Firebase auth domain>
VITE_FIREBASE_PROJECT_ID=<Firebase project ID>
VITE_FIREBASE_APP_ID=<Firebase app ID>
```

**Required Server-Side env vars (Vercel secrets):**
```
ANTHROPIC_API_KEY=<Claude API key>
```

**Secrets location:**
- Client: Environment variables in `.env.local` (never committed; read by Vite at build time)
- Server: Vercel environment settings (dashboard or CLI)

**Optional/Feature Flags:**
- `VITE_STORYBOOK_CONFIG_DIR` (internal, for Storybook integration)
- No feature flags for API integrations detected

## Security & Data Handling

**Firebase Security:**
- Firestore security rules (`firestore.rules`):
  - Authenticated users can read/write only their own `users/{uid}/progress/{docId}` documents
  - All other paths deny by default
  - Enforced via `request.auth.uid == userId` check

**Progress Sync Conflict Resolution:**
- Cloud backup is secondary; local state is authoritative
- Sync decision logic in `src/data/progressSync/progressSync.js`:
  - No cloud doc → upload local
  - Cloud meaningful + local empty → apply (restore)
  - Local meaningful + cloud empty → upload (never wipe richer state with empty)
  - Both meaningful → **merge**, key by key (`src/data/progressSync/progressMerge.js`)
    — not a single top-level-timestamp "newer wins". Each key has its own
    merge rule (additive dedup for logs, monotonic for module/streak state,
    identity-based union for weak points, seeded-event-log recovery for
    QuickFire ranking memory, etc.); two devices with genuinely different
    progress both keep it. See `docs/system/PROGRESS_SYNC_ARCHITECTURE.md`
- Snapshot version: 1 (enables future migrations)

**API Security:**
- No client-side API key exposure
- `ANTHROPIC_API_KEY` stored server-side in Vercel environment
- Edge functions validate request method (POST only), return 405 otherwise
- Input validation: Check for missing fields, empty answers before calling Claude

---

*Integration audit: 2026-07-09*
