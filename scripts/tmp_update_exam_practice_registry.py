from pathlib import Path
import re

PATH = Path('docs/components/COMPONENT_REGISTRY.md')
text = PATH.read_text(encoding='utf-8')


def replace_section(source: str, heading: str, replacement: str) -> str:
    pattern = rf'(?ms)^### {re.escape(heading)}\n.*?^---\n'
    updated, count = re.subn(pattern, replacement.rstrip() + '\n\n---\n', source, count=1)
    if count != 1:
        raise RuntimeError(f'Expected exactly one {heading} section, found {count}')
    return updated


face_the_examiner = r'''### FaceTheExaminer

**File:** `src/components/learning/FaceTheExaminer.jsx` (compatibility export for `faceTheExaminer/FaceTheExaminerContainer.jsx`)
**What it is:** A post-teaching examiner simulation built around one prepared sample answer. The learner reads the response, predicts its mark, identifies which criteria it meets, compares that judgement with the examiner's verdict, edits annotated weak sections and submits the improved answer for re-marking.
**Best used for:** Teaching how marks are awarded by making the learner judge and improve a realistic, imperfect response rather than simply reading a model answer.
**Props:** `module`, `examiner`, `onExit`, `onContinue`
**Examiner shape:** `{ question, marks, sampleAnswer, mark, markScheme, criteriaOptions?, annotations?, subject?, board?, type?, backgroundImage?, videoSrc? }`
**Screen type:** `faceTheExaminer`
**Dependencies:** `FaceTheExaminerIntro`, `FaceTheExaminerMain`, `FaceTheExaminerDone`, `SegmentedControl`, `ContinueCTA`, `SUBJECTS`, `GENERAL`, `/api/examiner`

- **Decision**
  - **Use when:** the learner needs to understand how an examiner applies criteria to a whole answer, distinguish genuine strengths from weaknesses and improve specific passages before seeing the answer re-marked. Choose it when judgement and revision of the response are the central learning jobs.
  - **Do not use when:** the learner should write their own answer from scratch, the sample is either perfect or completely unusable, the only feedback is generic advice such as “add more detail”, or there are no precise weak sections that can be meaningfully edited. Do not use it for one isolated factual error or as a decorative model-answer reveal.
  - **Choose instead:** use `ExamQuestionFrame` for independent exam-response practice. Use `WhatExaminersLookFor` for a short success-criteria briefing before writing. Use `GuidedExamResponse` when the learner needs substantial construction support. Use `SpotTheError` when one precise sentence-level error should be identified and repaired rather than the whole answer judged.
  - **Content shape:** one authentic exam-style question and one plausible, imperfect sample answer containing genuine strengths and a small number of improvable weaknesses. Supply an accurate original mark, learner-friendly criteria, precise annotations, editable weak passages and a defensible re-marking route. The answer must be good enough to reward careful judgement rather than being cartoonishly poor.
  - **Rhythm role:** practice, feedback, repair.'''

what_examiners_look_for = r'''### WhatExaminersLookFor

**File:** `src/components/learning/WhatExaminersLookFor.jsx`
**What it is:** A short pre-question examiner briefing. It introduces the upcoming exam skill, progressively reveals up to three high-value priorities and closes with one practical takeaway the learner can use while writing. It does not mark, annotate or score an answer.
**Best used for:** Preparing the learner immediately before independent or guided exam practice by clarifying the small number of things the examiner will reward most.
**Props:** `subject`, `whatExaminersLookFor`, `examinerExplains`, `title`, `label`, `showBack`, `onBack`, `onContinue`
**Data shape:** `{ introduction?, context?, priorities?: [{ id?, title?, explanation? }], takeaway? }` — legacy `examinerExplains` data may still use `opening`, `tips` and `closing` while content migrates.
**Screen type:** `whatExaminersLookFor`; legacy `examinerExplains` remains compatibility-only.
**Dependencies:** `CinematicShell`, `BackButton`, `ContinueCTA`, `ScreenTitle`, `SUBJECTS`, `SUBJECT_BACKDROPS`, `GENERAL`, `TYPE`, `SPACING`, `MOTION`

- **Decision**
  - **Use when:** the learner is about to attempt an exam question and needs a concise reminder of the specific behaviours the examiner rewards, such as selecting precise evidence, explaining a link, analysing a method or supporting a judgement.
  - **Do not use when:** the learner has already completed the response, feedback must react to their actual writing, the advice is a generic revision tip or the success criteria require substantial teaching rather than a short briefing. Do not turn it into a dense mark-scheme dump.
  - **Choose instead:** use `ExamQuestionFrame` when the learner should now write independently. Use `FaceTheExaminer` when they should inspect and improve an existing answer. Use `GuidedExamResponse` when they need structured support while constructing the response. Use a normal teaching component when the exam skill itself has not yet been explained clearly enough for three priorities to be useful.
  - **Content shape:** one short introduction, usually two or three actionable priorities and one closing takeaway. Every priority must be specific enough to apply during the immediately following question and important enough to affect marks. Avoid vague encouragement, duplicated criteria and lengthy mark-scheme language.
  - **Rhythm role:** teaching, practice preparation.

> **`ExaminerExplainsScreen` is legacy compatibility only.**
> `src/components/learning/ExaminerExplainsScreen.jsx` re-exports `WhatExaminersLookFor` so existing routes and content do not break during migration. Do not register, select or author it as a separate learning component; new code and content must use `WhatExaminersLookFor`.'''

exam_question_frame = r'''### ExamQuestionFrame

**File:** `src/components/feedback/ExamQuestionFrame.jsx`
**What it is:** The independent written exam-practice component. It presents an exam-style question with its mark allocation, command word, topic and optional source material, accepts a typed response and sends it to `/api/grade` for marking against the supplied mark scheme. Feedback can include marks awarded, achieved points, missed points, a summary and an examiner tip; the result can also feed the weakness tracker.
**Best used for:** Realistic GCSE written practice where the learner should construct a complete response independently and receive evidence-based feedback.
**Props:** `block`, `subject`, `mode` (default `'practice'`), `questionNum`, `onComplete`, `onSkip`
**Block shape:** `{ id?, questionText?|question, marks?, markPoints?|ms?, commandWord?, topic?, paper?, source?, sourceInstruction? }`
**Dependencies:** `SUBJECTS`, `GENERAL`, `SPACING`, `RADII`, `BUTTONS`, `TYPE`, `ContinueCTA`, `unifiedWeaknessTracker`, `/api/grade`

- **Decision**
  - **Use when:** the learner has already been taught the relevant knowledge and should independently attempt an authentic written question whose response needs mark-scheme judgement rather than simple right-or-wrong checking. Choose it for developed historical, literary, scientific or sociological responses and source-supported questions.
  - **Do not use when:** the learner still needs sentence-by-sentence construction support, the knowledge has not been taught, the task is ordinary factual retrieval, the response can be checked reliably through a simple objective interaction or the learning job is marking somebody else's answer.
  - **Choose instead:** use `GuidedExamResponse` when substantial scaffolding is needed. Use `WhatExaminersLookFor` immediately beforehand when the priorities need clarifying. Use `FaceTheExaminer` when the learner should judge and improve a prepared answer. Use `QuickRecallScreen` for short factual retrieval and `CalculationBreakdown` when a numerical method still needs teaching.
  - **Content shape:** one board-accurate exam-style question with a clear command word, defensible mark allocation, sufficient context, any required source or image, a usable mark scheme and stable topic metadata for feedback and weakness evidence. Avoid vague prompts, invented mark-scheme rules and questions that could be marked in several incompatible ways.
  - **Rhythm role:** practice, assessment.

### Exam practice and examiner feedback family rule

Choose according to the learner's stage:

- clarify what earns marks before writing → `WhatExaminersLookFor`
- construct and submit an independent response → `ExamQuestionFrame`
- judge, annotate and improve a prepared response → `FaceTheExaminer`

These components may form a sequence, but should not automatically be stacked around every exam question. Use `WhatExaminersLookFor` only when the priorities are not already secure, and use `FaceTheExaminer` as a deliberate examiner-literacy lesson rather than a compulsory post-question screen. `GuidedExamResponse` remains the alternative when the learner needs support during construction rather than before or after it.'''

text = replace_section(text, 'FaceTheExaminer', face_the_examiner)
text = replace_section(text, 'ExaminerExplainsScreen', what_examiners_look_for)
text = replace_section(text, 'ExamQuestionFrame', exam_question_frame)

PATH.write_text(text, encoding='utf-8')
