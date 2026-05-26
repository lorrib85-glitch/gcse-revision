# GCSE Revision — Locked Component Architecture

All locked components follow a frozen behavior contract. Visual redesigns are permitted; architectural changes require careful consideration.

---

## ModuleToolbar v1

**Purpose:** Navigation layer (back + exit buttons only).

**Location:** `src/ModuleToolbar.jsx` (59 lines)

**Props:**
- `onBack` — callback when user taps back
- `onExit` — callback when user taps exit

**State:**
- `backPressed` — visual press state
- `exitPressed` — visual press state

**Styling:**
- Back button: 44×40, white arrow, opacity 0.6→0.9, scale 0.94
- Exit button: 44×40, white X, opacity 0.22→0.6, scale 0.90
- Flex row with space-between

**Locked Rules:**
- Must remain navigation-only
- No titles, progress, or metadata
- Behaviour and styling preserved from original integrated header

---

## LearningProgressHeader v2

**Purpose:** Phase-based progress system beneath ModuleToolbar v1 (per RISE Module Header System spec).

**Location:** `src/LearningProgressHeader.jsx` (250+ lines)

**Props:**
- `beats` (array) — phase/beat objects with labels
- `currentBeatIndex` (number) — current position (0-indexed)
- `accent` (hex) — subject colour
- `accentRgb` (string) — "r,g,b" format for rgba()
- `onJump` — callback when user jumps to a phase

**State:**
- `sheetOpen` — whether jump-to-section sheet is open

**Visual (Per RISE Spec):**
```
○──○──◉──○──○

Completed phases: filled circles with subject accent glow
Active phase: larger filled circle with breathing animation + accent glow
Future phases: hollow/dimmed circles (locked)
Connector lines: neutral dark lines, highlight when complete
```

- **5-7 nodes maximum** (prevents overwhelming feeling)
- **Node states:**
  - Completed: filled, tappable, allows revisit
  - Active: slightly larger, breathing glow, highest contrast
  - Future: hollow/dimmed, untappable, visually present but locked
- **Connector lines:** subtle neutral coloured, highlight with accent glow when complete
- **Jump sheet:** bottom sheet modal with beat list, checkmarks, lock icons

**Locked Rules (Per RISE Spec):**
- Progress nodes must remain phase-based (not bar-based)
- Forward-locking must be enforced (no jumping ahead/skipping)
- Completed phases must be tappable to revisit with preserved state
- Active node uses subject accent glow with breathing animation
- Connector lines remain neutral/dark/subtle
- Max 7 visible nodes (never 20+)
- Jump sheet uses portal to escape transform containing block
- Must always sit BELOW ModuleToolbar v1
- Toolbar and progress must never merge into same row

---

## LearningHeader

**Purpose:** Orchestrator that owns the floating capsule shell and composes ModuleToolbar + LearningProgressHeader.

**Location:** `src/LearningHeader.jsx` (74 lines)

**Props:**
- `module` — module object with subject
- `beats` — beat array
- `currentBeatIndex` — current position
- `onBack` — navigation callback
- `onExit` — exit callback
- `onJump` — jump callback
- `visible` — show/hide animation

**Responsibilities:**
- Subject palette lookup (7 colours: history, biology, chemistry, physics, maths, english, sociology)
- hexToRgb() conversion for accent theming
- Capsule shell styling (fixed, frosted glass, blur)
- Composition of ModuleToolbar + LearningProgressHeader

**Locked Rules:**
- Public props must remain unchanged so all 4 ModulePlayer call sites work without modification
- Palette system must be maintained
- Portal usage in LearningProgressHeader must not be modified

---

## AnswerInteraction v1

**Purpose:** Reusable answer submission and feedback component for non-timed learning activities.

**Location:** `src/AnswerInteraction.jsx` (220 lines)

**Props:**
- `mode` — 'learning' | 'review' | 'timedExam' (default: 'learning')
- `questionId` — unique ID for tracking
- `questionType` — 'mcq' | 'shortText' | 'longText' | 'markScheme' | 'answerSheet'
- `options` — array of answer options (for MCQ)
- `correctAnswer` — string or array
- `acceptedAnswers` — alternative accepted answers
- `markScheme` — array of required marking points
- `hint` — string or array of hints
- `explanation` — feedback text shown after correct or reveal
- `subject` — subject for accent colour
- `onSubmit` — called when answer submitted
- `onCorrect` — called when answer is correct
- `onIncorrect` — called when answer is incorrect
- `onReveal` — called when answer revealed after attempt 2
- `onWeakMemoryLog` — silent logging callback
- `allowRetry` — allow retry (default: true, false in timed exams)
- `maxAttempts` — maximum attempts (default: 2)

**State Machine:**

```
idle
  ↓
answering
  ↓
checking
  ↓
correct → complete

OR

incorrect_hint
  ↓
retrying
  ↓
checking
  ↓
incorrect_reveal → complete
```

**Feedback Layout:**

The question/stem must be **external and persistent** above this component.

```
[Question block — parent responsibility]

[AnswerInteraction v1]
  [Answer input or options]
  [Submit button]

  [Feedback panel BELOW answer area]
    Attempt 1 incorrect:
    - Not quite.
    - Hint: [one targeted hint]
    - Try again button

    Attempt 2 incorrect:
    - Correct answer: [answer]
    - Why: [brief explanation]

    Correct on any attempt:
    - ✓ You're right.
    - [Optional explanation]

[ContinueButton v2 — parent enables when complete]
```

**Locked Rules:**

- **Question must never be replaced** by feedback
- **Feedback must appear BELOW** answer area only
- **Max 2 attempts** — no third attempt
- **Attempt 1 incorrect:** show hint, allow retry, no reveal
- **Attempt 2 incorrect:** reveal answer, explain, log to WeakMemory, enable continue
- **Correct on any attempt:** show confirmation, optional explanation, enable continue
- **Silent WeakMemory logging** — no visible "saved to weak zone" message
- **Timed exam override:** no hints, no retry, no correctness feedback, save and move on
- **Tone:** calm, specific, useful, grown-up — no "nice one", "great job", "amazing"
- **Motion:** soft fade/slide only — no bounce, shake, confetti
- **Mobile-first:** readable at phone distance, thumb-friendly targets, no dense text walls

**Forbidden Patterns:**
- Cheesy praise language
- Confetti or celebratory animation
- Shame language ("oops", "wrong", "failed")
- Punitive error styling
- Visible WeakMemory announcements
- Revealing answer after attempt 1
- Hints during timed exam mode

---

## Component Separation Pattern

All three header components follow this separation:

1. **ModuleToolbar v1** — navigation responsibility (escape/back)
2. **LearningProgressHeader v2** — progression responsibility (phase tracking, navigation)
3. **LearningHeader** — orchestrator (capsule shell, palette, composition)

This allows:
- Clear responsibility boundaries
- Reuse across different chapter types
- Independent testing and iteration
- Frozen behaviour contracts

---

## Visual Style System

**Colours:**
- Correct: soft green (#22C55E)
- Hint: amber (#D97706)
- Incorrect: soft red (avoided unless necessary)
- Information: muted blue (#60A5FA)
- Subject accents: per PALETTES system

**Motion:**
- Feedback panels: soft fade/slide from below
- Glow shifts: subtle
- State transitions: 140ms ease
- Loading: soft pulse, no bouncing

**Typography:**
- UI text: Sora, sans-serif
- Labels/status: Outfit, sans-serif
- Responsive sizing: touch-friendly on mobile

---

## Future Modifications

### Allowed:
- Visual redesigns (colours, spacing, animations)
- Question type support (mark scheme, answer sheet)
- Feedback text and explanations
- Subject accent application
- Hint text and improvement suggestions

### Not Allowed:
- Changing attempt flow (max 2 remains)
- Placing feedback above question
- Showing hints in timed exam mode
- Using praise-heavy tone
- Replacing ContinueButton v2 styling
- Making each component visually unrelated

All components are **LOCKED globally**. Changes must preserve their core contracts.
