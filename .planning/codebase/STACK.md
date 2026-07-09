# Technology Stack

**Analysis Date:** 2026-07-09

## Languages

**Primary:**
- JavaScript (ES6+ modules) — All source code, build scripts, and configuration

## Runtime

**Environment:**
- Node.js (development and build)
- Edge Runtime (Vercel) — For API functions in `api/` directory

**Package Manager:**
- npm (primary, package-lock.json 380KB)
- pnpm (secondary, pnpm-lock.yaml 225KB, pnpm-workspace.yaml configured)
- Lockfile: Both present; npm/pnpm interoperable in this workspace

## Frameworks

**Core:**
- React 18.2.0 — Component rendering and state management
- React DOM 18.2.0 — Web platform rendering

**Animation & Motion:**
- Motion 12.40.0 — Keyframe animations and transitions (installed but not heavily used in current imports)
- tailwindcss-animate 1.0.7 — Tailwind animation utilities

**Styling:**
- Tailwind CSS 4.3.0 — Utility-first CSS framework
- @tailwindcss/vite 4.3.0 — Vite plugin for Tailwind (replaces PostCSS pipeline)
- Google Fonts (Manrope, Sora, Outfit, Inter, Space Grotesk, Caveat, IBM Plex Serif) — Loaded via `<link>` in `index.html`

**Testing:**
- Vitest 4.1.7 — Unit and architecture test runner (node and browser environments)
- @vitest/browser-playwright 4.1.7 — Browser test runner
- @vitest/coverage-v8 4.1.7 — Code coverage reporting
- Playwright 1.60.0 — Browser automation for E2E testing
- Storybook 10.4.1 — Component documentation and testing
- @storybook/react-vite 10.4.1 — Storybook Vite integration
- @storybook/addon-vitest 10.4.1 — Storybook + Vitest integration
- @storybook/addon-a11y 10.4.1 — Accessibility testing in Storybook
- @storybook/addon-docs 10.4.1 — Component documentation blocks
- @storybook/addon-mcp 0.6.0 — MCP integration (experimental)
- @chromatic-com/storybook 5.2.1 — Visual regression testing

**Build & Dev:**
- Vite 6.4.3 — Module bundler and dev server
  - Base configuration: `./` (relative paths)
  - Output: `dist/` directory
  - Chunk size warning limit: 1000KB
  - Configured to support dynamic imports and lazy loading
- @vitejs/plugin-react 4.2.1 — JSX/React Fast Refresh support

**Linting & Formatting:**
- ESLint 9.39.4 — Linter with flat config
- @eslint/js 9.39.4 — ESLint recommended rules
- eslint-plugin-react 7.37.5 — React-specific linting rules
- eslint-plugin-react-hooks 7.1.1 — React Hooks rules
- eslint-plugin-react-refresh 0.5.3 — React Fast Refresh rules
- eslint-plugin-jsx-a11y 6.10.2 — Accessibility rules
- Prettier — *Not in package.json; note if formatting standard is in use*

**Utilities:**
- glob 13.0.6 — File path globbing
- prop-types 15.8.1 — Runtime prop validation (legacy, React 16 compatibility)
- globals 17.6.0 — Global variable definitions for linters

## Configuration Files

**Build & Runtime:**
- `vite.config.js` — Vite bundler config (plugins, output, aliases)
- `vitest.config.js` — Vitest config (three projects: architecture, unit, storybook)
- `.storybook/main.js` — Storybook framework config
- `.storybook/preview.jsx` — Storybook global decorators
- `jsconfig.json` — TypeScript/JavaScript compiler options (baseUrl, path aliases)
- `vercel.json` — Vercel deployment config (buildCommand, outputDirectory, rewrites)
- `eslint.config.js` — ESLint flat config with custom rules
- `firestore.rules` — Firestore security rules (Cloud Firestore auth)

**Asset Config:**
- `components.json` — Component metadata for build tools
- `index.html` — HTML entry point with Google Fonts links and icon

**Workspace:**
- `pnpm-workspace.yaml` — pnpm workspace configuration (empty; single-package workspace)

## Environment Configuration

**Setup:**
- `.env.example` exists (source control, no secrets)
- Environment variables required (see `.env.example`):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_APP_ID`
  - `ANTHROPIC_API_KEY` (server-side, in Vercel secrets)

**Development:**
- Hot module replacement (HMR) via Vite
- Fast Refresh for React components
- Storybook dev server on port 6006
- Vite dev server default port 5173

**Production:**
- Vite build outputs to `dist/`
- Vercel deployment for both frontend and serverless API functions
- Environment variables managed via Vercel environment settings

## Platform Requirements

**Development:**
- Node.js 18+ (implied by ES6 modules and Vite 6 requirements)
- npm 9+ or pnpm 8+
- Chromium-based browser (for Playwright tests)

**Production:**
- Deployment target: Vercel (v1 — Vite framework)
- Frontend: Vite SPA, static hosting
- Backend: Vercel Edge Functions for `/api/*` routes
- Cloud storage: Firebase (Firestore for progress backup)

## Deployment & Hosting

**Primary Hosting:**
- Vercel — Frontend SPA + Edge Functions API
- Build: `vite build` (CI step in Vercel)
- Static output: `dist/` directory
- API routes: `api/` directory (auto-deployed as serverless functions)

**Version Control:**
- Git repository tracked (`.git/` present)
- GitHub integration likely (`.github/` directory exists with workflows/config)

---

*Stack analysis: 2026-07-09*
