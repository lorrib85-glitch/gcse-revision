import { QuickFireMode } from './modes/QuickFireMode.jsx'
import { ExamMode } from './modes/ExamMode.jsx'

/**
 * Mode boundary for the question runner.
 *
 * Two supported modes, one per live caller:
 *   - "quickfire" — LegacyApp's Pulse/Home/chapter-completion round. The round
 *     starts immediately and exits through the parent's onExit, which returns
 *     the learner to the surface that launched it.
 *   - "exam"      — ExamPractice's Exams tab, wrapped in TestDataProvider so the
 *     lazy-loaded question banks are available.
 *
 * Exam question-bank data loads for Exam Mode, not for QuickFire. QuickFire must
 * never be wrapped in TestDataProvider.
 */
function TestTab({ mode, onOpenChapter, onExit, onOpenPulse, examAutoStart, clearExamAutoStart }) {
  if (mode === 'quickfire') {
    return <QuickFireMode onExit={onExit} />
  }

  if (mode === 'exam') {
    return (
      <ExamMode
        mode={mode}
        onExit={onExit}
        onOpenChapter={onOpenChapter}
        onOpenPulse={onOpenPulse}
        examAutoStart={examAutoStart}
        clearExamAutoStart={clearExamAutoStart}
      />
    )
  }

  return null
}

export default TestTab
