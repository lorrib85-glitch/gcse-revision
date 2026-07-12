# Chapter contact sheet tool — design

**Date:** 2026-07-12
**Status:** Approved (Step 1 of the UX-quality-at-scale programme)
**Builds on:** the DEV screen-jump seam (`?module=<id>&screen=<n>` in
`src/app/LegacyApp.jsx`) and `scripts/screenshot.mjs`, both from
`docs/superpowers/plans/2026-07-06-content-quality-framework.md` (Task P6).

## Problem

The mandatory 390px render pass (`docs/system/PATTERN_GOVERNANCE.md`) is the
quality bottleneck for scaling content production: today it is one screenshot
per screen, driven by hand. Chapter-level qualities — rhythm, pacing,
monotony, where the memorable moment sits — are invisible to per-screen
review entirely.

## What this tool does

One command renders **every screen of a module in the real render path** at
390px and produces:

1. A numbered PNG per frame (hook first, then screens 0…N-1), labelled with
   the screen's `screenTags` entry where present.
2. An `index.html` contact sheet — a dark grid of all frames in learner
   order, each clickable to full size — so a whole chapter's hierarchy,
   density and rhythm can be reviewed in one scroll.

Intended uses: the gold audit (Step 2), routine render passes in
`content-review` / the Workflow C/E critique gate, and later the
chapter-rhythm review.

## Usage

```bash
node scripts/contact-sheet.mjs <module-id> [--full]
```

- `<module-id>` — an id from `src/modules.js` with `screenCount > 0`.
  Running with no/unknown id lists the available ids.
- `--full` — capture full-page (scrolling) screenshots instead of the
  390×844 fold view.
- `APP_URL` — optional; a running dev server to use. When unset/unreachable
  the script starts `vite --port 5199` itself and stops it afterwards.
  The target must be a **dev** server — the jump seam is `import.meta.env.DEV`
  only, so a production build will not navigate.

Output: `contact-sheets/<module-id>/` (gitignored), overwritten per run.

## How it works

- **Auth gate:** seeds a guest profile before app boot —
  `riseUser` is a deliberately unscoped raw key
  (`src/lib/storage.js` RAW_KEYS), shape per
  `AuthContext.completeOnboarding`: `{ loggedIn: true, name, onboardingComplete:
  true, createdAt, provider: 'guest' }`.
- **Hook frame:** navigate `?module=<id>` with no module state — the player
  opens at the chapter hook.
- **Screen 0 frame:** the jump seam's `prepareModuleScreenState` only marks
  hook/wyl/intro done for `screenIndex > 0`, so the script first writes
  `guest::gcse_module_<id>` = `{ screen: 0, hookDone: true, wylDone: true,
  introDone: true }`, then navigates `?module=<id>&screen=0`.
- **Screens 1…N-1:** the seam handles state itself; `N` = `screenCount`
  from `src/modules.js` (pure-data ESM, imported directly by the script).
- **Capture settings:** viewport 390×844, `deviceScaleFactor: 2`,
  `reducedMotion: 'reduce'` (frames show resting composition, not
  mid-entrance animation), `networkidle` + a fixed settle wait to clear the
  1.4s splash on each navigation.
- **Chromium:** same pre-installed-`executablePath` fallback as
  `scripts/screenshot.mjs` (sandbox cannot download Playwright's pinned
  revision).
- **Failure signal:** uncaught page exceptions are collected per frame and
  reported; any exception → exit 1. Console errors and failed external
  resource loads (e.g. Google Fonts in the sandbox) are informational only.

## Known limitations (accepted for v1)

- Interactive screens are captured in their **initial resting state** — the
  standard render-pass view. Mid-interaction and feedback states remain
  manual review.
- The pre-screen flow between hook and screen 0 (outcomes / what-you'll-learn
  / intro) is not individually captured; the hook frame represents the
  chapter opening.
- One module per run; batching is a trivial later addition if the gold
  audit wants it.

## Scope lock (as executed)

- Files edited: `scripts/contact-sheet.mjs` (new), `.gitignore` (+1 line),
  this spec.
- Files forbidden: all of `src/**` — no app source changes; the seam
  already exists.
- New components: no. New stories: no. Assets: no.
- Verification: full run against `history-medicine-medieval-beliefs-causes`
  (33 screens + hook); frames and sheet inspected; `vitest run
  tests/architecture`; `vite build`.
