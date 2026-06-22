# External Integrations

**Analysis Date:** 2026-06-22

## APIs & External Services

**Anthropic Claude API:**
- **Models Used:**
  - `claude-sonnet-4-5-20250929` — Exam grading (high reasoning power for mark scheme interpretation)
  - `claude-haiku-4-5-20251001` — Recall assessment (cost-optimized for concept scoring)
- **Endpoints:**
  - `/api/grade` — Posts exam question, answer, marks, mark scheme; receives structured marking feedback
  - `/api/recall` — Posts student recall answer and concept list; receives per-concept scores (0.0–1.0)
  - `/api/examRoundDebrief` — Posts all answers from an exam round; receives cross-cutting pattern analysis and debrief
  - `/api/guidedExamResponse` — Posts guided answer coaching context; receives scaffolded exam technique walkthrough
- **Auth:** `ANTHROPIC_API_KEY` environment variable (set via Vercel secrets)
- **Request Format:** JSON with Content-Type header
- **Response Format:** Structured JSON (models instructed to respond ONLY in specified JSON schemas)
- **Fallback:** Local keyword-based scoring if API unavailable (see `src/lib/storage.js` and `/api/recall.js` fallback logic)

## Data Storage

**Databases:**
- **None configured** — Application is data-light by design

**Client-Side Persistence:**
- `localStorage` only — all learner data stored in browser
- Keys managed via `src/lib/storage.js`:
  - User profile: `riseUser` (auth context)
  - Progress tracking: various keys read/written by `src/progress.js`
  - Weakness tracking: keys managed by `src/unifiedWeaknessTracker.js`
  - Learning plans: keys managed by `src/features/planner/dailyPlanner.js`
  - Session drafts, quiz state, exam results

**File Storage:**
- **Public assets only** — no user uploads
- Static files served from `/public/` (images, SVG, logos, header images, figures)
- Module content (lessons, questions) baked into JavaScript bundles

**Caching:**
- Browser HTTP caching via standard headers (Vite dev server + Vercel CDN in production)
- No explicit cache layer; no Redis, Memcached

## Authentication & Identity

**Auth Provider:**
- **Custom** (mock in development; Firebase ready for production)

**Implementation:**
- `src/auth/AuthContext.jsx` — Context-based user state management
- `src/auth/authService.js` — Pluggable auth service layer
- Current: Mock Google OAuth flow (700ms simulated delay; no real auth backend)
- Stored in localStorage as `riseUser` object with fields: `loggedIn`, `name`, `onboardingComplete`, `createdAt`
- Future: Firebase drop-in replacement supported (commented in `authService.js`)

**No External Identity Providers in Use:**
- Google OAuth flow is stubbed out
- No Supabase, Auth0, or similar integration
- No session/JWT backend

## Monitoring & Observability

**Error Tracking:**
- **None configured** — No Sentry, LogRocket, or similar
- Client-side error boundary in `src/main.jsx` displays error messages

**Logs:**
- **Console logging only** — `console.log()` for API debugging
- Vercel Edge Function logs available in deployment dashboard
- No centralized logging service

**User Analytics:**
- **None detected** — No Google Analytics, Mixpanel, or equivalent
- No event tracking beyond localStorage progress snapshots

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from `vercel.json` and Edge Function routing)

**Deployment Flow:**
- Git push to repository → Vercel auto-build triggered
- Build: `vite build` → `/dist` output
- Static file serving + Edge Function routing for `/api/*`

**CI Pipeline:**
- **None detected** — No GitHub Actions, CircleCI, or Jenkins config
- Vercel handles build/test/deploy automatically on push

## Environment Configuration

**Required env vars at runtime:**
- `ANTHROPIC_API_KEY` — Anthropic API key for grading, recall, debrief, coaching endpoints

**Optional env vars:**
- None explicitly used in source code

**Secrets location:**
- Vercel project settings → Environment Variables (secrets not checked into git)
- No `.env` file in repo

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## External Fonts & Assets

**Fonts Loaded from Google Fonts (via CDN):**
- Manrope (wght 400–800) — Display headings and cinematic type
- Sora (wght 400–800) — All UI body text, buttons, labels
- Outfit (wght 400–800) — Available but not currently used
- Inter (wght 400–800) — Available but not currently used
- Space Grotesk (wght 600–800) — Available but not currently used
- IBM Plex Serif (wght 400–500, italic) — Available but not currently used
- Caveat (wght 400–700) — Available but not currently used

**Icon Library:**
- lucide-react — SVG icons (no external image requests for icons)

**Images:**
- Static images in `/public/` served via HTTP from Vercel CDN
- Subject theme header images (e.g., `history-medicine-through-time.png`, `bio-main.png`)
- Biology diagrams (e.g., `/public/figures/`)
- Module-specific screens and content imagery

## Third-Party Code & Frameworks

**UI Component Libraries:**
- Radix UI (dialog, dropdown, label, slot, toast) — Headless, unstyled primitives
- Lucide React — Icon set
- Tailwind CSS — Utility-first styling

**Animation & Motion:**
- Motion library — Keyframe and gesture-based animations

**Code Organization:**
- class-variance-authority — Type-safe component variant definitions
- clsx — Conditional class composition
- tailwind-merge — Smart Tailwind class merging

## Absence of Common Integrations

**Not in use:**
- No database (Supabase, Firebase Firestore, MongoDB)
- No email service (SendGrid, Mailgun, AWS SES)
- No payment processing (Stripe, Paddle)
- No SMS (Twilio)
- No file upload service (AWS S3, Cloudinary)
- No real-time collaboration (Replicache, WebSockets)
- No feature flags (LaunchDarkly)
- No form backend (Formspree, Basin)
- No content management system (Contentful, Sanity, Strapi)

---

*Integration audit: 2026-06-22*
