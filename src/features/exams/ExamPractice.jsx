import TestTab, { TestDataProvider } from '../quickfire/QuickFire.jsx'

export default function ExamPractice({ tab, onOpenModule, onOpenPulse, examAutoStart, setExamAutoStart }) {
  if (tab !== 'exams') return null

  return (
    <TestDataProvider>
      <TestTab
        mode="exam"
        onOpenModule={onOpenModule}
        onOpenPulse={onOpenPulse}
        examAutoStart={examAutoStart}
        clearExamAutoStart={() => setExamAutoStart(null)}
      />
    </TestDataProvider>
  )
}
