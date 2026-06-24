import { useState, useEffect, useRef } from 'react'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'

async function gradeWithAI(question, answer, marks, markScheme) {
  const res = await fetch('/api/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer: answer.trim(), marks, markScheme }),
  })
  if (!res.ok) throw new Error(`Server error ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data
}

export function useExamPaperState(paper) {
  const [phase, setPhase] = useState('paper')
  const [answers, setAnswers] = useState({})
  const [markingResults, setMarkingResults] = useState({})
  const [markingProgress, setMarkingProgress] = useState({ current: 0, total: 0 })
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (phase !== 'paper') {
      clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  function allQuestions() {
    return paper.sections.flatMap(s => s.questions)
  }

  function setAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  async function submit() {
    const questions = allQuestions()
    const total = questions.length
    setPhase('marking')
    setMarkingProgress({ current: 0, total })

    for (let i = 0; i < questions.length; i++) {
      setMarkingProgress({ current: i + 1, total })
      const q = questions[i]
      const ans = (answers[q.id] ?? '').trim()

      let result
      try {
        if (ans.length < 2) {
          result = {
            marksAwarded: 0, marksAvailable: q.marks,
            grade: 'No answer', summary: 'No answer was provided.', correct: false,
          }
        } else {
          const data = await gradeWithAI(q.q, ans, q.marks, q.ms)
          const earned = data.marksAwarded ?? 0
          const available = data.marksAvailable || q.marks
          result = { ...data, marksAvailable: available, correct: earned >= available }
          const topicKey = q.topicId || q.topic || 'General'
          if (earned < available) {
            logWrongAnswer({ subject: paper.subject, topic: topicKey, questionId: q.id, questionText: q.q, marks: q.marks, source: 'exam-paper', questionType: q.type })
          } else {
            logCorrectAnswer({ subject: paper.subject, topic: topicKey, questionId: q.id })
          }
        }
      } catch {
        result = {
          marksAwarded: 0, marksAvailable: q.marks,
          grade: 'Error', summary: 'Could not mark — check your connection.', correct: false,
        }
      }

      setMarkingResults(prev => ({ ...prev, [q.id]: result }))
    }

    setPhase('debrief')
  }

  function reset() {
    setPhase('paper')
    setAnswers({})
    setMarkingResults({})
    setMarkingProgress({ current: 0, total: 0 })
    setElapsed(0)
  }

  return { phase, answers, markingResults, markingProgress, elapsed, setAnswer, submit, reset, allQuestions }
}
