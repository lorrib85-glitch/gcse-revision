# Workflow D — Bug Fix

**Authority:** `CLAUDE.md` > this file > session instructions.

## Purpose

Diagnosing and fixing broken behaviour — confirming root cause before
touching any code.

## When to use

Broken Continue button, tap not working, build failure, routing issue,
progress bug, test failure, any unexpected behaviour.

No pre-triage clarifying question is needed — broken behaviour is always D.
Reproduction details are established in phase 2, not before classification.

## Required artefacts

- Symptom / reproduction / expected / actual (phase 2 — before hypothesis)
- Confirmed root cause statement (phase 5 — before any code change)
- Fix plan (phase 6 — before implementation)

## Phases

1. **Triage** — `/gcse-triage` → Lane D.
2. **Check main first** — before reproducing or forming a hypothesis, check
   whether the reported issue is already fixed on current `main`: scan
   `git log` for the affected file(s)/area, then read the current code path
   directly.
   - **Already fixed and verified** (fix is present, existing or addable
     tests cover it, tests/build pass) — stop here. Do not create a branch,
     do not reproduce, do not re-implement. Run phase 9's verification
     commands to confirm, skip phase 10 (nothing to commit), and report:
     the existing commit SHA + message, what test coverage exists, and
     current test/build status.
   - **Not fixed, or fixed but unverified** (no test coverage, tests fail,
     or fix is partial) — continue to phase 2's reproduction step below for
     the remaining gap.
   ```
   Symptom:
   Reproduction path:
   Expected:
   Actual:
   ```
3. **Hypothesis** — no code changes yet:
   ```
   Likely cause:
   Evidence needed:
   Files to inspect:
   ```
4. **Evidence gathering** — read only relevant files/logs; do not bulk-read.
5. **Confirm root cause** — required before any implementation:
   ```
   Confirmed root cause:
   Why this explains the symptom:
   Why alternatives were ruled out:
   ```
6. **Fix plan** — smallest possible fix.
7. **Build** — direct edit or `superpowers:executing-plans`.
8. **Review** — `/code-review`; `/ponytail-review`.
9. **Verify** — see below.
10. **Commit** — directly to `main`.

## Allowed skills

`superpowers:systematic-debugging`, `superpowers:executing-plans`,
`superpowers:verification-before-completion`, `/code-review`,
`/ponytail-review`, `/verify`

## Forbidden

Guessing. CSS poking without a confirmed root cause. GSD (unless the bug
reveals architecture-level work needed — then stop and surface to user
before escalating to E).

## Stop points

- Reproducing or hypothesising before checking if `main` already fixes it → stop; return to phase 2
- Implementing a fix before root cause is confirmed → stop; return to phase 5
- Fix requires a new component → check registry; re-triage to E if new
- Bug is architecture-level → surface to user before escalating
- Root cause is inside a LOCKED component → surface to user before touching

## Verification

- Original reproduction path is resolved
- `vite build` passes
- `vitest run tests/architecture` if metadata, boundaries, or storage
  patterns were touched
- `vitest run tests/unit` if `progress.js`, `unifiedWeaknessTracker.js`,
  or `dailyPlanner.js` were touched
- `vitest` (full, Playwright/Chromium) if a component with `.stories.jsx`
  was changed
- `superpowers:verification-before-completion`
- `/verify` in the running app
