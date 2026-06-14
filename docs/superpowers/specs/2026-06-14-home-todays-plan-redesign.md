# Home redesign — "Today's plan" task carousel

**Date:** 2026-06-14
**Status:** Specification — not yet implemented

## Problem

The current Home screen (`src/App.jsx:841-1098`) is reactive rather than
prescriptive. It shows:

- **Jump back in** — whichever module has the most progress and isn't
  complete.
- **Close the gap** — a single weak-tag module suggestion (or a generic
  "See focus topics" fallback when nothing qualifies).

This doesn't answer "what should I do *today*?" — it surfaces one resume
point and one maybe-relevant suggestion, with no sense of pacing, total
effort, or daily structure. The user shared a mockup of a "Today's plan"
task list that feels closer to a daily training plan: a short warm-up, a
couple of targeted tasks sized to roughly an hour, and a weekly full-paper
session on top. This spec captures the agreed design for that replacement.

## Decision

### Layout — full replacement

"Jump back in" and "Close the gap" are removed entirely. Home becomes:

1. Top row — avatar + `StreakChip` (unchanged, retained as-is per explicit
   instruction).
2. Cinematic greeting ("Hi, {userName}.") — unchanged.
3. A single, small "this week" line (see below) — not a stat card, just a
   line of body copy under the greeting.
4. **"Today's plan"** — a horizontal, scroll-snap carousel of task cards.
   This is Home's one primary action, per
   `GENERAL_APP_UI_CONSTITUTION.md`'s "one primary action, one secondary
   recommendation" layout law.

Weekdays: 3 cards. Weekends (Sat/Sun): 4 cards (the extra card is additive,
not a replacement of any weekday slot).

Cards are ordered by priority — the first card is always the most urgent
task, and the carousel opens scrolled to it. There is no separate
"recommended" highlight beyond ordering.

### "This week" stat — reuse the existing trend delta

Per the brainstorm decision to avoid building new weak→mastered transition
tracking for v1, reuse `PulseTab`'s existing week-over-week trend
calculation (`src/App.jsx:1129-1142`, `trend`/`trendNote`). Extract it to a
shared helper — e.g. `getWeeklyTrend()` in `src/progress.js` — so both
`PulseTab` and `Home` call the same logic instead of duplicating the
`gcse_scores` parsing.

Display as a single short line under the greeting, following the existing
`trendNote` copy (e.g. "You're remembering more than last week." / "Your
average score this week." / "Holding steady on last week."). No numeric
badge, no card — just text, per "Avoid: oversized statistics."

### The "Today's Plan" engine

New pure function `buildTodaysPlan()`, in a new file `src/todaysPlan.js`
(small logic module, same pattern as `progress.js` /
`unifiedWeaknessTracker.js` — not a `.jsx` component). It returns an
ordered array of task descriptors:

```js
{
  type: 'warmup' | 'revisit' | 'continue' | 'practice' | 'paper',
  kicker: string,        // e.g. "Warm up", "Revisit", "Continue", "Practice", "This weekend"
  title: string,         // specific — module/topic/subject name, never generic
  reason: string,        // personalised one-liner, per GENERAL_APP_UI_CONSTITUTION examples
  durationMinutes: number,
  onSelect: { ... }       // enough info for App to route the tap (see Navigation)
}
```

#### Slot 1 — fixed: Quick Fire warm-up

Always first. `kicker: 'Warm up'`, `title: '90 second sprint'` (matches
`PulseTab`'s existing `sprint` mode wording), `durationMinutes: 2`
(90s + transition). Tapping routes to the existing Quick Fire flow
(`setTab('quickfire')`, same as `PulseTab`'s `onStartQuickFire`).

#### Slots 2–3 — dynamic, priority order

This resolves the open question from the brainstorm (does weak-spot
revisit always outrank "continue module"?) with a v1 default:

**Slot 2 priority:**

1. **Weak-spot snippet revisit** — if `getBiggestWin()` returns a result
   whose `topic` has a `TAG_MODULE_MAP` entry, AND that exact topic wasn't
   already shown as today's revisit yesterday (simple repeat-avoidance,
   see "Repeat avoidance" below). `kicker: 'Revisit'`, `title:
   result.label`, `reason: result.reasonText` (already personalised, e.g.
   "4 of your last 6 answers were incorrect."). `durationMinutes: 5`
   (one tagged screen + a quick recall check).
2. Else, fall through to "continue module" (below).
3. Else, fall through to "exam practice" (below) — exam practice never
   returns nothing, so slot 2 is never empty.

**Slot 3 priority** (must differ in `type` from slot 2 where possible):

1. **Continue module** — if there's an in-progress, incomplete module
   (today's equivalent of the current `jumpBackModule`/`jumpPct` logic,
   `src/App.jsx:846-863`) and it wasn't used for slot 2. `kicker:
   'Continue'`, `title: jumpBackModule.title`, `reason:` framed around
   screens remaining (e.g. "X screens left in this module."),
   `durationMinutes: remainingScreens * 2.5` (rounded).
2. Else, **exam practice** on the weakest subject
   (`getWeakestSubject()?.subject || 'Random'`), via
   `adaptiveExamQuestions(subject)`. `kicker: 'Practice'`, `title:
   '${subject} practice'` (or `'Mixed practice'` for Random), `reason:`
   tied to `getWeakestSubject()`'s wrong-answer count.

If both slot 2 and slot 3 land on "exam practice" (no revisit, no
in-progress module), pick a different subject for slot 3 than slot 2
(2nd-weakest subject, or `'Random'`) so the two practice cards aren't
identical.

#### Sizing toward ~60 minutes

The ~1 hour target governs `durationMinutes`, mainly via the exam-practice
question count, which is the "flex" variable:

- Running total starts at 2 (warm-up).
- Add 5 if slot 2 is a revisit.
- Add `remainingScreens * 2.5` if a slot is "continue module".
- Whatever's left of the 60-minute budget is divided by ~1.5 min/question
  to get the exam-practice question count for `adaptiveExamQuestions`,
  clamped to 6–15 questions. `durationMinutes` for that card =
  `questionCount * 1.5`.

These are *displayed estimates*, not hard caps — the priority order matters
more than hitting exactly 60. No grand "total time" badge is shown (see
Layout); each card just shows its own short duration tag (e.g. "~5 min").

#### Repeat avoidance

To stop the same revisit snippet appearing every single day, store the last
shown `{ date, topic }` for the revisit slot in localStorage (e.g.
`gcse_todays_plan_revisit`). If `getBiggestWin()`'s top topic matches
yesterday's and today's date differs, skip to the next candidate in
`getWeakTopics()` (still filtered through `TAG_MODULE_MAP`); if none, fall
through to "continue module" per the slot 2 priority above. This is a
soft nudge, not a hard rule — if it's genuinely the only weak topic, it can
repeat.

#### Slot 4 — weekend full paper (additive)

On Saturday/Sunday only, append a 4th card:

- `kicker: 'This weekend'`, `title: 'Full ${subject} paper'`.
- Subject chosen by a deterministic weekly rotation (ISO week number mod
  the list of subjects with exam content: Maths, English, Sociology,
  Chemistry, History) so it doesn't repeat the same subject every weekend
  and needs no extra state.
- Reuses the existing "Sit a full paper" flow
  (`startExamRound(subject, { isTimedPaper: true, paperQuestions, title,
  durationSeconds })`, `src/App.jsx:4670-4684`). For History, use the real
  past-paper data already in `src/data/medicineExamPapers.js`
  (`MEDICINE_2023_PAPER`); for other subjects, `paperQuestions =
  adaptiveExamQuestions(subject)` with a longer `durationSeconds` than the
  default `EXAM_SECONDS`.
- `durationMinutes`: ~50, matching a realistic full-paper sitting.

### Visual contract — card design

Per `GENERAL_APP_UI_CONSTITUTION.md`:

- Horizontal scroll-snap row. Each card ~85% of the content width so the
  next card visibly peeks in — signals scrollability without any "swipe"
  label.
- Card surface: near-invisible per the "Cards" section — extremely subtle
  1px low-opacity border, minimal radius (`RADII` tokens), no glow, no
  glassmorphism.
- Typography carries hierarchy, using existing `TYPE` tokens: `kicker` =
  tiny uppercase low-contrast label, `title` = `TYPE.sectionTitle`-weight,
  `reason` = `TYPE.bodySmall` in `GENERAL.slate`, duration tag = small
  uppercase metadata.
- Accent colour: teal (`GENERAL.teal`) for revisit/continue/practice/paper
  cards, consistent with the current Jump back in / Close the gap accents.
  Coral stays reserved for the streak flame and the Quick Fire warm-up card
  only (matching `PulseTab`'s existing `sprint` mode treatment).
- Optional faint imagery per card (module header image / subject colour
  wash) at very low opacity (~0.06–0.10), same restraint level as the
  existing `/focus-atmosphere.png` treatment at 0.08 opacity — imagery adds
  atmosphere, not a "tile".
- No per-card numeric badges beyond the small duration tag — avoid
  "oversized statistics" / "badges everywhere".

### Navigation / wiring

- **Warm-up card** → `setTab('quickfire')` (existing path, unchanged).
- **Revisit / continue cards** → `onOpenModule(mod, screenIndex)` — already
  supports an optional `screenIndex` via `openModulePlayer`
  (`src/App.jsx:637-653`); revisit uses `findTaggedScreen(mod, topic)`,
  continue uses no index (resumes from saved `screen` state).
- **Practice / full-paper cards** → `TestTab`'s exam-round state
  (`startExamRound`, `adaptiveExamQuestions`, `examPhase`) is local to
  `TestTab` (mode `'exam'`) and not reachable from `Home` today. Add a small
  auto-start prop to `TestTab`, mirroring the existing quickfire
  `autoStart` prop (`<TestTab mode="quickfire" autoStart={true} .../>`):
  e.g. `examAutoStart={{ subject, isTimedPaper, durationSeconds,
  paperQuestions, title }}`, consumed in a `useEffect` once
  `TestDataProvider`'s data has loaded, calling `startExamRound(...)` once.
  `App` holds the chosen config in state, set by the card's `onClick`,
  then calls `setTab('exams')`.

Exact prop names/shapes are confirmed during planning, not fixed here.

## Build approach — two phases, with a mid-build screenshot checkpoint

Directly addressing the "can I see this before full wiring?" question:

**Phase 1 — visual shell, mock data.** Build the new `Home` layout exactly
as described above (carousel, card visual contract, "this week" line,
StreakChip repositioned, "Jump back in"/"Close the gap" removed), populated
with hardcoded mock task data covering all four card types (warm-up,
revisit, continue, practice, plus the weekend paper card). Start the dev
server, take a Playwright screenshot at 390×844, send it via
`SendUserFile`. Iterate on spacing/colour/copy from feedback here — this is
the cheap, low-token loop, before any engine logic exists.

**Phase 2 — wire up the engine.** Implement `buildTodaysPlan()` in
`src/todaysPlan.js`, the weekly-trend extraction, the `TestTab` auto-start
prop, and replace the mock data with real engine output. Then run the full
Standard Change Pipeline tail: documentation update, code review,
`./node_modules/.bin/vite build`, run the app and exercise each of the four
card types end-to-end, commit + push to `main`.

## Scope of changes

- `src/App.jsx` — rewrite `Home` (`841-1098`); extract `getWeeklyTrend()`
  out of `PulseTab` into `src/progress.js` and use it from both; add the
  `examAutoStart` prop/handling to `TestTab`; wire the new tap targets in
  the top-level router.
- New file: `src/todaysPlan.js` — `buildTodaysPlan()`.
- `src/progress.js` — add `getWeeklyTrend()`.
- Docs (if applicable after execution): `CLAUDE.md` (Home's description in
  "Key Components in App.jsx"), `docs/components/COMPONENT_REGISTRY.md` if
  a reusable task-card/carousel pattern emerges.

## Out of scope / deferred

- Cross-subject weak-spot tag mappings — `TAG_MODULE_MAP` stays
  History-only for now; non-History weak subjects fold into the exam
  practice slot.
- Bottom nav relabeling (Home/Learn/Practice/Progress) — confirmed out of
  scope.
- New weak→mastered "X spots became strengths" tracking — deferred in
  favour of the weekly trend delta.

## Documentation

After Phase 2, update `CLAUDE.md`'s `Home` description and
`COMPONENT_REGISTRY.md` if a new reusable card/carousel pattern is
extracted, per the Decision Capture Rule. Add a "Revisions" section to this
spec if anything changes materially from this design during execution.

## Verification

- `./node_modules/.bin/vite build` passes.
- Dev server + Playwright screenshot at 390×844 (Phase 1 checkpoint, then
  again after Phase 2) showing the carousel (3 cards weekday / 4 weekend),
  the "this week" line, `StreakChip` retained top-right, and no remaining
  "Jump back in"/"Close the gap" UI.
- Manually exercise each card type's tap target → correct destination
  (module at the right screen, Quick Fire, exam practice round, full
  paper).
