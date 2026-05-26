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

## RetrievalFrame v1

**Purpose:** Cinematic wrapper for retrieval moments woven naturally into learning flow.

**CRITICAL ARCHITECTURE:** RetrievalFrame is a wrapper only. AnswerInteraction v1 owns all answer logic.

**Location:** `src/RetrievalFrame.jsx` (TBD)

**Implementation decisions (locked):**

1. **Data source:** Wraps existing `intro.retrieval` from modules. Does NOT create new retrieval array schema yet.

2. **Integration scope:** First implementation replaces inline intro.retrieval rendering in HookScreen only. No broader block-type system yet.

3. **Completion callback:** `onInteractionComplete()` — parent tracks completion state and enables ContinueButton via existing continue logic.

4. **True/False exemption:** RetrievalFrame does NOT handle trueFalse questions. ChapterHookScreen retains T/F hook logic separate. RetrievalFrame for non-hook retrieval only.

5. **Variant:** Explicit prop (fullBleed, contained, inline). Default = contained. No auto-detection.

6. **Background:** Static only. No parallax implementation yet.

7. **Question layout:** Normal flow (not sticky). Question visible in structure but does not require sticky positioning.

**Props:**

- `retrieval` — object from `intro.retrieval` with `{ question, options[], correctIndex, explanation }`
- `variant` — 'fullBleed' | 'contained' | 'inline' (default: 'contained')
- `subject` — subject key for accent styling
- `topic` — topic name
- `beatId` — learning beat ID (for WeakMemory metadata)
- `contextImage` — optional background image path
- `contextText` — optional setup line before question
- `label` — label text (default: "Quick check")
- `mode` — 'learning' | 'cinematic' | 'review' (default: 'learning')
- `onInteractionComplete` — callback when AnswerInteraction completes
- `onContinueReady` — optional callback when user can continue

**Ownership:**

RetrievalFrame owns:
- Visual wrapper / containment
- Label styling
- Question placement
- Atmospheric background
- Spacing / rhythm
- Passing props to AnswerInteraction v1
- Receiving completion state from AnswerInteraction v1
- Calling parent callbacks

RetrievalFrame does NOT own:
- Answer checking logic
- Hint display
- Attempt limits
- Answer reveal
- Correct/incorrect copy
- Feedback styling (owned by AnswerInteraction)
- WeakMemory logging
- ContinueButton styling
- True/False question handling

**Component relationship:**

```
[Learning content]

[RetrievalFrame v1]
  [Label: "Quick check" / "Recall" etc.]
  [Question block - large, visible, persistent]
  
  [AnswerInteraction v1]
    - handles answer options
    - handles submission
    - shows hint on attempt 1 incorrect
    - shows reveal on attempt 2 incorrect
    - shows correct confirmation
    - calls onInteractionComplete when done
  
[ContinueButton enabled by parent via callback]
```

**Visual hierarchy (contained variant):**

- Optional subject accent label (small, muted)
- Question (large, bold, readable)
- AnswerInteraction (options + feedback below)
- No dashboard chrome
- Minimal app chrome

**Mobile-first:** All variants designed for portrait first.

**Variants:**

- **contained** (default): soft glass container, clear boundaries, LearningMode
- **fullBleed**: image background, dark overlay, large question, CinematicMode
- **inline**: compact, between concept cards, minimal chrome

---


**Purpose:** Reusable answer submission and feedback component for learning activities.

**EXEMPT:** True/False questions use existing ChapterHookScreen design (keep as-is).

**Applied to:** MCQ questions (quiz blocks), free text, fill-in-blanks, connection questions.

**Location:** `src/AnswerInteraction.jsx` (180 lines)

**Props:**
- `block` — question block object with options, question, hint, explanation
- `subject` — subject for score recording
- `onAnswered` — callback when answer submission complete
- `onComplete` — **CRITICAL:** called when component reaches complete state (correct OR 2nd incorrect attempt)
  - Signature: `onComplete({ correct: boolean, attempts: number })`
  - Parent MUST call this to track completion and enable progression
- `mode` — 'learning' | 'review' (default: 'learning')

**State Machine:**

```
idle (user selects answer)
  ↓
checking (answer is validated)
  ↓
{
  correct → complete (enable continue) OR
  incorrect_hint (show hint, allow retry) →
    retrying (user taps "Try again") →
    checking →
    {
      correct → complete OR
      incorrect_reveal (reveal answer, lock, log to WeakMemory)
    }
}
```

**Attempt Logic:**
- Attempt 1: user can select any option, auto-evaluates on choice
- Attempt 1 incorrect: show hint, allow retry
- Attempt 2: user can try again
- Attempt 2 incorrect: reveal correct answer + explanation, lock, silent WeakMemory log, enable continue
- Correct on any attempt: show explanation, lock, enable continue

**CRITICAL: Completion Tracking Requirement**

Parent component MUST:
1. Provide `onComplete` callback to AnswerInteraction
2. Track when component calls onComplete (`correct: true` OR after 2 `attempts`)
3. Use completion state to enable progression (e.g., display continue button)

**Without onComplete wiring, component will lock but parent won't know progression is allowed.**

---

**Question Integration:**

The question/stem must be **external and persistent** (rendered separately by parent).

```
[Question block — parent responsibility, always visible]

[AnswerInteraction v1]
  [Option buttons A, B, C, D...]
  
  [After answer selected:]
    Attempt 1 incorrect:
    - 💡 Hint — think about this
    - [hint text]
    - [Try again →] button
    
    Attempt 2 incorrect:
    - ✗ Nope — the answer was: [correct]
    - [explanation if provided]
    
    Correct on any attempt:
    - ✓ Correct! [explanation if provided]
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
