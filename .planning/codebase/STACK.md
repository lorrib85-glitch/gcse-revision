# Technology Stack

**Analysis Date:** 2026-06-22

## Languages

**Primary:**
- JavaScript (ES2022+) - All application code, components, and utilities
- JSX - React component syntax throughout frontend

**Secondary:**
- CSS - Tailwind CSS for styling

## Runtime

**Environment:**
- Node.js (version not pinned; inferred from ES6 module usage in package.json `"type": "module"`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 18.2.0 - Frontend library for component-based UI
- Vite 6.4.3 - Build tool and development server (fast ESM-based bundler)
- Tailwind CSS 4.3.0 - Utility-first CSS framework via `@tailwindcss/vite` plugin

**Testing:**
- Vitest 4.1.7 - Unit and integration test runner (Vite-native)
- @vitest/browser-playwright 4.1.7 - Browser-based test execution
- Playwright 1.60.0 - End-to-end browser automation for tests
- Storybook 10.4.1 - Component development and testing environment
  - @storybook/addon-vitest - Runs Storybook stories as Vitest tests
  - @storybook/addon-a11y - Accessibility auditing
  - @storybook/addon-docs - Component documentation
  - @chromatic-com/storybook - Visual regression testing integration

**Build/Dev:**
- @vitejs/plugin-react 4.2.1 - JSX transformation for Vite
- Tailwindcss-animate 1.0.7 - Animation utilities for Tailwind

## Key Dependencies

**Critical:**
- @radix-ui/react-dialog 1.1.15 - Accessible modal/dialog component primitives
- @radix-ui/react-dropdown-menu 2.1.16 - Accessible dropdown menu
- @radix-ui/react-label 2.1.8 - Form label component
- @radix-ui/react-slot 1.2.4 - Slot composition primitive
- @radix-ui/react-toast 1.2.15 - Toast notification system
- lucide-react 1.17.0 - SVG icon library (SVG icons used throughout UI)
- motion 12.40.0 - Animation library for performant transitions and keyframes
- clsx 2.1.1 - Utility for conditional CSS class composition
- tailwind-merge 3.6.0 - Smart Tailwind class merging (prevents conflicts)
- class-variance-authority 0.7.1 - Type-safe component variant patterns

**Infrastructure:**
- prop-types 15.8.1 - Runtime prop type checking (minimal usage; TypeScript not in use)

**Linting & Code Quality:**
- @eslint/js 9.39.4 - ESLint core configuration
- eslint 9.39.4 - JavaScript linter
- eslint-plugin-react 7.37.5 - React best practices linting
- eslint-plugin-react-hooks 7.1.1 - Enforces rules of Hooks
- eslint-plugin-react-refresh 0.5.3 - Fast Refresh compatibility
- eslint-plugin-jsx-a11y 6.10.2 - Accessibility auditing for JSX
- globals 17.6.0 - Predefined global variable sets for linting environments

## Configuration

**Environment:**
- No `.env` file detected in repo root — all secrets managed via deployment platform (Vercel)
- `ANTHROPIC_API_KEY` required at runtime for AI-powered features (grading, recall assessment, exam debrief)
- Development uses mock auth; production auth integration ready (Firebase drop-in noted in `src/auth/authService.js`)

**Build:**
- `vite.config.js` — Vite configuration with React plugin, Tailwind plugin, path alias `@/` → `./src/`
- `vitest.config.js` — Vitest configuration with Storybook integration and browser-based test support (Playwright headless shell for sandboxed environments)
- `eslint.config.js` — Flat config ESLint rules for React/JSX/a11y with custom design token enforcement rule
- `jsconfig.json` — Path aliases for imports
- `components.json` — Component library metadata (likely for Storybook or code generation)
- `vercel.json` — Vercel deployment config: build command `vite build`, output directory `dist`, framework `vite`, API rewrites for `/api/*` routes

## Platform Requirements

**Development:**
- Node.js with ES module support (Node 14+)
- npm for dependency management
- Browser with modern JavaScript support (tested via Playwright/Chromium)

**Production:**
- Deployment target: Vercel (inferred from `vercel.json` and API route structure)
- Edge runtime for API routes (`export const config = { runtime: 'edge' }` in `/api/*.js`)
- Static hosting of built `/dist` output
- Environment variable `ANTHROPIC_API_KEY` required at runtime

## API Integration

**AI/LLM:**
- Anthropic Claude API (`https://api.anthropic.com/v1/messages`)
  - Model: `claude-sonnet-4-5-20250929` for exam grading (high reasoning power)
  - Model: `claude-haiku-4-5-20251001` for recall assessment (cost-optimized)
  - Authentication: `ANTHROPIC_API_KEY` in request headers
  - Used by `/api/grade`, `/api/recall`, `/api/examRoundDebrief`, `/api/guidedExamResponse`

**Data Persistence:**
- localStorage (client-side only) for user state, progress, weakness tracking, learning plans
- No remote database — all data stored locally in browser
- Designed for future swap to remote backend (see `src/lib/storage.js` comment)

## Deployment

**Hosting:** Vercel (Edge Functions for serverless API routes)

**Build Process:**
```bash
vite build  # Production bundle to dist/
```

**API Routes:** Deployed as Vercel Edge Functions:
- `/api/grade` — Exam question grading
- `/api/recall` — Concept recall assessment
- `/api/examRoundDebrief` — Pattern analysis across exam rounds
- `/api/guidedExamResponse` — Exam technique coaching
- Fallback support when API unavailable (e.g., local keyword-based grading in recall.js)

---

*Stack analysis: 2026-06-22*
