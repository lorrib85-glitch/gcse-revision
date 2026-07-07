import { useState, useEffect } from 'react'
import UnifiedQuestionScreen from './UnifiedQuestionScreen.jsx'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'

const IMAGES = {
  History:   '/headers/history-quiz-bg.png',
  Biology:   '/biologybacker.webp',
  Maths:     '/mathsbacker.webp',
  Sociology: '/sociologybacker.webp',
  Chemistry: '/chemsistrybacker.webp',
  Physics:   '/physicsbacker.webp',
  English:   '/Englishbacker.webp',
  Music:     '/historybacker.webp',
}

const BG_STYLE = {
  History: { opacity: 1.0, filter: 'none', skipLeftGradient: true },
}


export default function QuickRecallScreen({
  subject      = 'History',
  chapterNum   = 1,
  chapterTitle = '',
  questions    = [],
  onBack,
  onContinue,
  renderHeader,
}) {
  const img = IMAGES[subject] || IMAGES.History
  const bgStyle = BG_STYLE[subject] || { opacity: 0.26, filter: 'grayscale(10%) brightness(0.65)' }

  const total = questions.length

  const [qIdx,    setQIdx]    = useState(0)
  const [phase,   setPhase]   = useState('in')
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setPhase('active'), 360)
    return () => clearTimeout(t)
  }, [animKey])

  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(() => onContinue?.(), 100)
      return () => clearTimeout(t)
    }
  }, [phase, onContinue])

  function advance() {
    const nextIdx = qIdx + 1
    if (nextIdx >= total) {
      setPhase('done')
    } else {
      setPhase('out')
      setTimeout(() => {
        setQIdx(nextIdx)
        setAnimKey(k => k + 1)
        setPhase('in')
      }, 300)
    }
  }

  const cur = questions[qIdx]

  // Normalize true/false recall questions ({ type: 'truefalse', isTrue }) into
  // the options/correct shape UnifiedQuestionScreen expects.
  const isTrueFalse = cur?.type === 'truefalse'
  const curOptions = isTrueFalse ? ['True', 'False'] : (cur?.options || [])
  const curCorrect = isTrueFalse ? (cur?.isTrue ? 0 : 1) : cur?.correct

  return (
    <>

      <>
        {/* Question renders its own full-screen background */}
        {phase !== 'done' && cur && (
          <UnifiedQuestionScreen
            key={animKey}
            question={cur.question || cur.q}
            type={cur.type || 'choice'}
            options={curOptions}
            correct={curCorrect}
            hint={cur.hint}
            explanation={cur.explanation}
            backgroundImage={img}
            subject={subject}
            qIndex={qIdx}
            qTotal={total}
            onAnswer={(isCorrect) => {
              if (isTrueFalse) {
                const log = isCorrect ? logCorrectAnswer : logWrongAnswer
                log({
                  subject,
                  topic: chapterTitle,
                  questionText: cur.question || cur.q,
                  source: 'module',
                  questionType: 'truefalse',
                })
              }
            }}
            onComplete={advance}
          />
        )}

        {/* Header overlay */}
        {phase !== 'done' && renderHeader?.()}
      </>

    </>
  )
}
