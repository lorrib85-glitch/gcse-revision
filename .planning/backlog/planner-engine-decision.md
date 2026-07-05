# Planner engine decision

**Status:** Backlog decision note  
**Related feature:** F4 — Personalised daily revision planner improvements  
**Date:** 2026-07-05

## Decision

Keep `src/todaysPlan.js` as the live Home carousel for first-use readiness.

Park `src/features/planner/dailyPlanner.js` until subject-selection onboarding exists and can populate the planner's required learner profile data.

Do not expand `todaysPlan.js` into a second full planner.

## Why

The current live Home experience is intentionally lightweight and already wired into the app:

- `src/todaysPlan.js` builds the Home task carousel.
- Home cards now show same-day completion state.
- Home-launched practice has lighter wording than full Exam Mode.
- Google Auth and Firestore backup are working.

The dormant planner engine is more sophisticated, but not yet safe to activate:

- `src/features/planner/dailyPlanner.js` expects `userProfile.selectedSubjects`.
- The current onboarding flow does not collect GCSE subjects/options.
- Its richer `PlanBlock` shape does not directly match the existing Home carousel/card UI.
- Wiring it now would risk large planner/UI/routing changes immediately before first real student use.

## Current live approach

Use `src/todaysPlan.js` for now as a pragmatic first-use planner:

- fixed warm-up
- continue/revisit/practice cards
- weekend paper card
- same-day completion derived from existing progress data

Small fixes to `todaysPlan.js` are allowed only when they directly improve first-use clarity or prevent misleading behaviour.

Do not turn `todaysPlan.js` into a full scheduling engine.

## Deferred planner direction

Revisit `dailyPlanner.js` under F4 once the app has:

1. Subject-selection onboarding.
2. Stored selected GCSE subjects/options.
3. A data-assembly layer that builds the planner's required `userProfile` and `learningState` from existing progress/weakness/mastery data.
4. A clear UI mapping from `DailyPlan` / `PlanBlock` outputs to learner-facing Home tasks.

## Useful parts of `dailyPlanner.js` to preserve

When F4 resumes, consider reusing:

- weekday/Saturday/Sunday duration-budgeting
- selected-subject filtering
- weak-point lifecycle: `new → repairing → retest_due → stabilising → resolved`
- subject-rotation avoidance
- incomplete-work handling
- paper-result processing

## Guardrails

Do not start a planner rebuild until subject-selection onboarding exists.

Do not let the live planner recommend subjects the learner is not taking once selected subjects are available.

Do not create two competing planner source-of-truth systems.

Do not add large planner architecture while first-use readiness is still being validated.
