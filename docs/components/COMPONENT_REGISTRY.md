# Component Registry

**Last updated:** 2026-05-28  
**Scope:** All standalone components in `src/components/`

---

## How to Use This Registry

Before building anything new, check this registry. If a component already covers your use case — use it. If it doesn't quite fit, adapt it. Only build new components for genuinely distinct learning beats.

---

## `src/components/core/`

Foundation components used by many others. Handle atomic UI concerns.

### AnswerInteraction — **LOCKED**

**File:** `src/components/core/AnswerInteraction.jsx`  
**Purpose:** Universal answer UI for all question types (choice, connection, true/false). The single component that handles all answer logic across the product.  
**Props:** `block`, `subject`, `onAnswer`, `onContinue`  
**Lock reason:** Owns all answer interaction logic. Changing internals risks breaking answer flow across every question type.

---

### CardContainer — **LOCKED**

**File:** `src/components/core/CardContainer.jsx`  
**Purpose:** Atmospheric content surface wrapper. Provides a consistent card shell with optional background image, subject glow, and cinematic atmosphere.  
**Props:** `subject`, `backgroundImage`, `children`, `style`  
**Lock reason:** Visual contract for all content surfaces. Changing it would cascade to all cards in the product.

---

### LearningHeader

**File:** `src/components/core/LearningHeader.jsx`  
**Purpose:** Floating capsule header shell for learning screens. Composes `ModuleToolbar` (navigation) and `LearningProgressHeader` (progress display).  
**Props:** `module`, `progress`, `currentStep`, `totalSteps`, `onBack`, `onExit`  
**Dependencies:** `ModuleToolbar`, `LearningProgressHeader`, `SUBJECTS`

---

### LearningProgressHeader — **LOCKED**

**File:** `src/components/core/LearningProgressHeader.jsx`  
**Purpose:** Progress rail and jump sheet display. Shows current position within a module. Display only — owns no interaction logic.  
**Props:** `progress`, `currentStep`, `totalSteps`, `steps`  
**Lock reason:** Core navigation affordance. Visual contract is established and relied upon across learning flow.

---

### ModuleToolbar — **LOCKED**

**File:** `src/components/core/ModuleToolbar.jsx`  
**Purpose:** Back and exit navigation buttons for learning screens. Navigation only — no learning logic.  
**Props:** `onBack`, `onExit`  
**Lock reason:** Navigation contract. Changing button positions or behaviour breaks muscle memory.

---

## `src/components/learning/`

Screen-level learning interaction components. Each is a distinct learning beat.

### CinematicRevealMoment

**File:** `src/components/learning/CinematicRevealMoment.jsx`  
**Purpose:** Full-screen cinematic video or image reveal moment. Atmospheric, single-focus, high-emotion screen.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### ConceptReveal

**File:** `src/components/learning/ConceptReveal.jsx`  
**Purpose:** Concept introduction with atmospheric reveal. Introduces a new idea cinematically before quiz questions.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### ExplainReveal

**File:** `src/components/learning/ExplainReveal.jsx`  
**Purpose:** Progressive cause-and-effect reasoning chain. Reveals steps one by one — teaches the logic, not just the answer.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### FaceTheExaminer

**File:** `src/components/learning/FaceTheExaminer.jsx`  
**Purpose:** Examiner-style written question interaction. Presents a structured exam question with model answer reveal.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`

---

### FillInTheBlanksBlock

**File:** `src/components/learning/FillInTheBlanksBlock.jsx`  
**Purpose:** Inline fill-in-the-blanks interaction. Learner taps word slots and fills gaps from a word bank.  
**Props:** `block`, `subject`, `onComplete`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`

---

### InteractiveHotspotImage

**File:** `src/components/learning/InteractiveHotspotImage.jsx`  
**Purpose:** Full-screen image with tappable hotspots. Two-phase: intro reveal → explore hotspots. Used for diagrams and labelling tasks.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`, `MOTION`

---

### QuickRecallScreen

**File:** `src/components/learning/QuickRecallScreen.jsx`  
**Purpose:** Rapid-fire retrieval screen for choice and connection questions. Fast-paced sequence with immediate feedback.  
**Props:** `block`, `subject`, `onComplete`, `onBack`  
**Dependencies:** `SUBJECTS`, `AnswerInteraction`

---

### RecoveryQuizPlayer

**File:** `src/components/learning/RecoveryQuizPlayer.jsx`  
**Purpose:** Lightweight recovery quiz player (3–4 focused questions). Launched from WeakSpotRecovery for targeted remediation.  
**Props:** `quizId`, `subject`, `onComplete`, `onBack`  
**Dependencies:** `SUBJECTS`, `AnswerInteraction`, `recoveryQuizzes.js`

---

### WeakSpotRecovery

**File:** `src/components/learning/WeakSpotRecovery.jsx`  
**Purpose:** Full-screen behavioural intervention screen shown when a learner struggles. Presents the weak topic with explanation and a recovery CTA. Calm, non-punitive.  
**Props:** `block`, `subject`, `progress`, `onBack`, `onFixWeakSpot`, `onSkip`  
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`

---

## `src/components/layout/`

Module-level orchestration and chapter framing screens.

### ChapterCompleteScreen

**File:** `src/components/layout/ChapterCompleteScreen.jsx`  
**Purpose:** End-of-chapter completion screen with score and stats. Emotional beat — acknowledges progress without being childish.  
**Props:** `subject`, `chapterTitle`, `score`, `totalQuestions`, `onContinue`, `onReview`  
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`

---

### ChapterHookScreen

**File:** `src/components/layout/ChapterHookScreen.jsx`  
**Purpose:** Chapter intro hook screen with a true/false warm-up statement. Sets the emotional context before the chapter begins.  
**Props:** `subject`, `chapterNum`, `chapterTitle`, `statement`, `isTrue`, `accentWords`, `explanation`, `onBack`, `onContinue`  
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`

---

### ChapterOutcomeScreen

**File:** `src/components/layout/ChapterOutcomeScreen.jsx`  
**Purpose:** Chapter outcome reveal screen. Shows learner performance with cinematic context.  
**Props:** `subject`, `chapterTitle`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`

---

### LearningScreenShell

**File:** `src/components/layout/LearningScreenShell.jsx`  
**Purpose:** Layout shell for learning module screens. Provides header, progress bar, safe-area padding, and content zone. Structural — owns no learning logic.  
**Props:** `children`, `subject`, `title`, `subtitle`, `progress`, `currentStep`, `totalSteps`, `backgroundImage`, `showHeader`, `scroll`  
**Dependencies:** `SUBJECTS`, `SPACING`, `TYPE`

---

### ModulePlayer

**File:** `src/components/layout/ModulePlayer.jsx`  
**Purpose:** In-module lesson flow orchestrator. Routes between all block types based on module screen data.  
**Props:** `moduleId`, `onComplete`, `onBack`  
**Dependencies:** All learning + feedback components

---

### ScreenShell

**File:** `src/components/layout/ScreenShell.jsx`  
**Purpose:** Base layout shell for full-screen views. Provides fixed container, atmospheric background layers, safe-area padding, max-width constraint, and scroll zone. Structural — owns no app logic.  
**Props:** `children`, `subject`, `background`, `backgroundImage`, `backgroundPosition`, `backgroundOpacity`, `backgroundFilter`, `overlay`, `scroll`, `centreContent`  
**Dependencies:** `SUBJECTS`, `SPACING`

---

## `src/components/feedback/`

Question feedback and exam practice components.

### ExamQuestionFrame

**File:** `src/components/feedback/ExamQuestionFrame.jsx`  
**Purpose:** Universal exam question component with mark scheme reveal. Presents structured exam questions with marks, model answers, and AQA-style formatting.  
**Props:** `block`, `subject`, `onContinue`, `onBack`  
**Dependencies:** `SUBJECTS`

---

### RetrievalFrame — **LOCKED**

**File:** `src/components/feedback/RetrievalFrame.jsx`  
**Purpose:** Cinematic wrapper for retrieval moments. Delegates all answer logic to AnswerInteraction. Provides atmospheric framing for question display.  
**Props:** `block`, `subject`, `progress`, `onAnswer`, `onContinue`, `onBack`  
**Lock reason:** Visual contract for all retrieval screens. Changing it risks inconsistency across all question presentations.  
**Dependencies:** `AnswerInteraction`, `SUBJECTS`
