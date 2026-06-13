import { useState, useEffect, useMemo } from 'react'
import UnifiedQuestionScreen from './UnifiedQuestionScreen.jsx'
import { SUBJECTS } from '../../constants/subjects.js'

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

function ProgressDots({ total, current, done, accent, rgb }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28,
      left: '50%', transform: 'translateX(-50%)',
      zIndex: 10,
      display: 'flex', gap: 6, alignItems: 'center',
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone   = i < done
        const isActive = i === current
        return (
          <div key={i} style={{
            width: isActive ? 20 : 8,
            height: 8,
            borderRadius: 99,
            background: isDone ? accent : isActive ? accent : 'rgba(255,255,255,0.22)',
            boxShadow: isActive
              ? `0 0 10px rgba(${rgb},0.6)`
              : isDone ? `0 0 6px rgba(${rgb},0.35)` : 'none',
            transition: 'all 300ms ease',
          }} />
        )
      })}
    </div>
  )
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
  const img    = IMAGES[subject] || IMAGES.History
  const bgStyle = BG_STYLE[subject] || { opacity: 0.26, filter: 'grayscale(10%) brightness(0.65)' }
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  const total = questions.length

  const [qIdx,    setQIdx]    = useState(0)
  const [doneCnt, setDoneCnt] = useState(0)
  const [phase,   setPhase]   = useState('in')
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setPhase('active'), 360)
    return () => clearTimeout(t)
  }, [animKey])

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

  function handleSelect(wasCorrect) {
    if (wasCorrect) setDoneCnt(d => d + 1)
    advance()
  }

  const cur = questions[qIdx]

  const contentAnim = {
    in:     { animation: 'qrs-up-in 360ms cubic-bezier(0.16,1,0.3,1) both' },
    active: { opacity: 1 },
    out:    { animation: 'qrs-up-out 280ms ease both' },
    done:   { opacity: 0 },
  }[phase] || {}

  return (
    <>

      <>
        {/* Question renders its own full-screen background */}
        {phase !== 'done' && cur && (
          <UnifiedQuestionScreen
            key={animKey}
            question={cur.question || cur.q}
            type={cur.type || 'choice'}
            options={cur.options || []}
            correct={cur.correct}
            hint={cur.hint}
            explanation={cur.explanation}
            backgroundImage={img}
            subject={subject}
            qIndex={qIdx}
            qTotal={total}
            onAnswer={(isCorrect) => {
              if (isCorrect) setDoneCnt(d => d + 1)
            }}
            onComplete={advance}
          />
        )}

        {/* Progress dots overlay */}
        {phase !== 'done' && <ProgressDots total={total} current={qIdx} done={doneCnt} accent={accent} rgb={rgb} />}

        {/* Header overlay */}
        {phase !== 'done' && renderHeader?.()}

        {/* Done state with continue button */}
        {phase === 'done' && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#08090D', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700, fontSize: 32,
                color: accent,
                marginBottom: 32,
              }}>
                All done! 🎯
              </div>
              <button
                onClick={onContinue}
                style={{
                  background: accent,
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 28px',
                  cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700, fontSize: 16,
                  color: '#08090D',
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </>

    </>
  )
}
