# QuickFire abandoned-device merge tail risk

**Status:** Backlog — explicitly deferred
**Priority:** Low
**Area:** `src/data/progressSync/progressMerge.js`, `src/features/quickfire/logic/quickFireMemory.js`, QuickFire persistence/compaction tests

## Context

QuickFire answer evidence now uses a merge-safe, per-device grow-only baseline plus deduplicated raw answer events. A device folds its own aged events into its baseline before trimming, which preserves normal long-lived and multi-device use without double-counting.

One residual edge remains: the merged cloud answer log is capped at 4,000 raw events. If a device records a tail of events, syncs them to cloud, then is permanently abandoned before it ever folds those events into its own baseline, sufficiently heavy later activity from other devices could eventually push that foreign device's still-unfolded tail out of the shared raw-event window.

The result would be a possible historical undercount of that abandoned device's aged QuickFire activity. It does not fabricate activity, double-count answers, corrupt current progress, regress module completion, or affect ordinary multi-device use.

## Why this is deferred

Closing the edge correctly would require merge-time contiguous folding for events created by other devices, including safe per-device watermark ownership and idempotent convergence when devices compact at different times. That is materially more complex than the current local-owner folding model and is not justified by the current learner impact.

Do not replace the current CRDT-style baseline with lossy `max()` merging or arithmetic guesses.

## Pickup trigger

Revisit only when one of these becomes true:

- real accounts approach the 4,000-event raw-log cap;
- telemetry or support evidence shows material QuickFire undercounting;
- the progress document architecture is redesigned away from whole-snapshot storage;
- a simpler proven merge-time folding design becomes available.

## Required work when picked up

- Design merge-time contiguous folding across device-owned event sequences without trusting arrival order.
- Ensure each event contributes exactly once across baseline and raw-event layers.
- Preserve `correct <= answered` for every bucket.
- Preserve backward compatibility with aggregate-only legacy data and current baseline/event shapes.
- Keep merge and compaction deterministic, commutative and idempotent.
- Do not fabricate historical answer events.
- Keep the progress snapshot within its governed size budget.

## Acceptance criteria

- A foreign device can sync a tail of valid events and disappear permanently.
- More than 4,000 newer events from other devices can then accumulate and compact.
- The abandoned device's valid historical contribution remains represented after the raw events age out.
- Repeated and differently ordered merges converge to the same totals.
- No event is counted twice and no valid activity is lost.
- Existing QuickFire persistence, compaction, snapshot-budget and multi-device journey suites remain green.
