import { createContext, useContext, useEffect, useState } from 'react'

export const TestDataContext = createContext(null)
export function useTestData() { return useContext(TestDataContext) }

export function TestDataProvider({ children }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([
      import('../../data/mathsTopics.js'),
      import('../../data/englishTopics.js'),
      import('../../data/sociologyTopics.js'),
      import('../../data/chemistryTopics.js'),
      import('../../data/guidedAnswerCoach.js'),
    ]).then(([maths, english, sociology, chemistry, coach]) => {
      setData({
        MATHS_TOPIC_GROUPS: maths.MATHS_TOPIC_GROUPS,
        ALL_MATHS_QUESTIONS: maths.ALL_MATHS_QUESTIONS,
        FORMULA_SHEET: maths.FORMULA_SHEET,
        DIAGRAMS: maths.DIAGRAMS,
        ENGLISH_TOPIC_GROUPS: english.ENGLISH_TOPIC_GROUPS,
        ALL_ENGLISH_QUESTIONS: english.ALL_ENGLISH_QUESTIONS,
        SOCIOLOGY_TOPIC_GROUPS: sociology.SOCIOLOGY_TOPIC_GROUPS,
        ALL_SOCIOLOGY_QUESTIONS: sociology.ALL_SOCIOLOGY_QUESTIONS,
        CHEMISTRY_TOPIC_GROUPS: chemistry.CHEMISTRY_TOPIC_GROUPS,
        ALL_CHEMISTRY_QUESTIONS: chemistry.ALL_CHEMISTRY_QUESTIONS,
        GUIDED_COACH_TYPES: coach.GUIDED_COACH_TYPES,
      })
    })
  }, [])

  if (!data) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#08090D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src="/logo.png" alt="" style={{ width: 64, height: 64, objectFit: 'contain', opacity: 0.5 }} />
    </div>
  )
  return <TestDataContext.Provider value={data}>{children}</TestDataContext.Provider>
}
