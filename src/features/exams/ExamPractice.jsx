import TestTab from '../quickfire/QuickFire.jsx'
import { TestDataProvider } from '../quickfire/testDataContext.jsx'

export default function ExamPractice({ tab, onOpenChapter, onOpenPulse, examAutoStart, setExamAutoStart }) {
  if (tab !== 'exams') return null

  return (
    <TestDataProvider>
      <TestTab
        mode="exam"
        onOpenChapter={onOpenChapter}
        onOpenPulse={onOpenPulse}
        examAutoStart={examAutoStart}
        clearExamAutoStart={() => setExamAutoStart(null)}
      />
    </TestDataProvider>
  )
}
