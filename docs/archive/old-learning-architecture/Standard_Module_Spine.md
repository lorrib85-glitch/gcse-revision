# Standard Module Spine

> **Superseded — retained for historical reference only.** This document predates and conflicts with the module architecture defined in `CLAUDE.md` ("History Module Architecture (LOCKED)" and "Science Module Blueprint (LOCKED)"). `CLAUDE.md` is the current authority for module structure — do not use this document for new module builds.

Every module in the GCSE Revision app must follow this spine unless explicitly marked as an approved variant.

## The Locked Flow

| # | Role | Example component |
|---|------|-------------------|
| 1 | **Hook** — true/false warm-up or cinematic opening | `ChapterHookScreen` |
| 2 | **Learning outcomes** — what the learner will understand | `ChapterOutcomeScreen` |
| 3 | **Recall warm-up** — pre-test before content begins | `QuickRecallScreen` |
| 4 | **Learning Block 1** — image-led explanation | `VisualNarrativeScreen`, `ConceptReveal` |
| 5 | **Task 1** — active application of Block 1 | `ColSortBlock`, `FillInTheBlanksBlock`, `TheoryCompareBlock` |
| 6 | **Recall 1** | `QuickRecallScreen` (inline or full-screen) |
| 7 | **Learning Block 2** — activity-led explanation | `ExplainReveal`, `GuidedChoiceCarousel` |
| 8 | **Recall 2** | `QuickRecallScreen` |
| 9 | **Learning Block 3** — diagram, story mode, or scenario | `InteractiveHotspotImage`, scenario blocks |
| 10 | **Recall 3** | `QuickRecallScreen` |
| 11 | **Learning Block 4** — timeline or broader concept connection | `VisualNarrativeScreen`, `TheoryCompareBlock` |
| 12 | **Recall 4** | `QuickRecallScreen` |
| 13 | **Exam tips** — application and mark-scheme guidance | `examtip` blocks, `FaceTheExaminer` prep |
| 14 | **Face the Examiner** | `FaceTheExaminer` |
| 15 | **Chapter complete** | `ChapterCompleteScreen` |

## Rules

**Role order must not drift.** Component choice may vary by role, but the sequence of roles is fixed.

**Every teaching block must be followed by retrieval.** A learning block without a recall is not complete. Do not stack two learning blocks before a recall.

**No more than two passive screens may appear consecutively.** A passive screen is any screen the learner reads without answering a question or completing a task.

**Exam application must appear before Face the Examiner.** The learner must have seen mark-scheme guidance or exam tips before reaching the examiner question. Do not place the examiner question first.

**ChapterComplete must always close the module.** No content screens appear after `ChapterCompleteScreen`. The module ends there.

## Variants

A module may be marked as an approved variant if it:
- Is a short introductory chapter with no recall warm-up
- Is an exam-mode only module (starts at role 13)
- Has been explicitly agreed in writing before build

Transitional or legacy modules (e.g. Medieval Medicine mod1) that predate this spine are not variants — they should be migrated to the spine when next updated.

## What this is not

This spine does not dictate which component to use for any given role. A teaching block may be a `VisualNarrativeScreen`, a `ConceptReveal`, an `ExplainReveal`, or any other appropriate component. The spine defines the roles, not the implementation.

This spine does not apply retroactively to all existing modules. It applies to all modules created or substantially restructured from this point forward.
