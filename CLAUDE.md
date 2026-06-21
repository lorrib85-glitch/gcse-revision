# GCSE Revision App — Project Guide

## Active Development Branch

**Always commit directly to `main`.**

## Entry Point

`src/App.jsx` is now a tiny wrapper that renders `src/app/LegacyApp.jsx`. The main app shell, tab state, auth flow, overlays, module opening and lazy-loading orchestration live in `src/app/LegacyApp.jsx`. Do not treat `src/App.jsx` as the old single-file app, and do not re-inline extracted components back into it.

## Recovery required

The full guide content was accidentally shortened during connector editing. Restore the complete `CLAUDE.md` from commit `9fac4ea772b2af28ed50f2a5a0552e293342d6ea` before using this file as the authoritative project guide.
