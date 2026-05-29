import { useState, useEffect } from 'react'
import AnswerInteraction from '../core/AnswerInteraction.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'

const IMAGES = {
  History:   '/historybacker.webp',
  Biology:   '/biologybacker.webp',
  Maths:     '/mathsbacker.webp',
  Sociology: '/sociologybacker.webp',
  Chemistry: '/chemsistrybacker.webp',
  Physics:   '/physicsbacker.webp',
  English:   '/Englishbacker.webp',
  Music:     '/historybacker.webp',
}

function Glow({ rgb }) {
  return (
    <div style={{
      position: 'absolute', top: '35%', left: '30%',
      transform: 'translate(-50%, -50%)',
      width: 280, height: 280,
      background: `radial-gradient(circle, rgba(${rgb},0.18) 0%, transparent 70%)`,
      filter: 'blur(110px)', pointerEvents: 'none',
    }} />
  )
}

function ProgressDots({ total, current, done, accent, rgb }) {
  return (
    <div style={{
      position: 'absolute', top: 30, right: 24, zIndex: 10,
      display: 'flex', gap: SPACING.micro, alignItems: 'center',
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone   = i < done
        const isActive = i === current
        return (
          <div key={i} style={{
            width: isActive ? 20 : 8,
            height: 8,
            borderRadius: RADII.pill,
            background: isDone ? accent : isActive ? accent : 'rgba(255,255,255,0.22)',
            boxShadow: isActive ? `0 0 10px rgba(${rgb},0.6)` : isDone ? `0 0 6px rgba(${rgb},0.35)` : 'none',
            transition: 'all 300ms ease',
          }} />
        )
      })}
    </div>
  )
}

function QuestionWords({ question }) {
  const words = question.split(/\s+/)
  return (
    <div style={{
      fontFamily: "'Sora', sans-serif",
      fontWeight: 800,
      fontSize: 'clamp(26px, 8vw, 38px)',
      lineHeight: 'clamp(32px, 10vw, 46px)',
      letterSpacing: '-0.03em',
      color: '#FFFFFF',
    }}>
      {words.map((word, i) => (
        <span key={i} style={{
          display: 'inline',
          animation: `qrs-word 220ms ease ${260 + i * 65}ms both`,
        }}>
          {i > 0 ? ' ' : ''}{word}
        </span>
      ))}
    </div>
  )
}

function TrueFalseButtons({ q, accent, onSelect }) {
  const [chosen, setChosen] = useState(null)

  function pick(val) {
    if (chosen !== null) return
    setChosen(val)
    setTimeout(() => onSelect(val === q.isTrue), 560)
  }

  return (
    <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
      {[true, false].map((val) => {
        const label   = val ? 'True' : 'False'
        const picked  = chosen === val
        const isRight = chosen !== null && val === q.isTrue
        const isWrong = picked && val !== q.isTrue

        let color = 'rgba(255,255,255,0.82)'
        if (isRight && chosen !== null)  color = accent
        if (isWrong)                     color = 'rgba(255,80,80,0.8)'

        const borderColor = (isRight && chosen !== null) ? accent : 'rgba(255,255,255,0.16)'

        return (
          <button
            key={String(val)}
            onClick={() => pick(val)}
            style={{
              background: 'none', border: 'none',
              paddingBottom: 2,
              borderBottom: `1.5px solid ${borderColor}`,
              cursor: chosen !== null ? 'default' : 'pointer',
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 24,
              textTransform: 'uppercase', letterSpacing: '0.18em',
              color,
              transition: 'color 300ms ease, border-color 300ms ease',
              animation: isWrong ? 'qrs-shake 220ms ease' : 'none',
            }}>
            {label}
          </button>
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
  const img   = IMAGES[subject] || IMAGES.History
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  const total = questions.length

  const [qIdx,          setQIdx]          = useState(0)
  const [doneCnt,       setDoneCnt]       = useState(0)
  const [phase,         setPhase]         = useState('in')
  const [animKey,       setAnimKey]       = useState(0)
  const [pendingAdvance, setPendingAdvance] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setPhase('active'), 360)
    return () => clearTimeout(t)
  }, [animKey])

  function advance() {
    setPendingAdvance(false)
    const nextIdx = qIdx + 1
    if (nextIdx >= total) {
      setTimeout(() => setPhase('done'), 0)
    } else {
      setPhase('out')
      setTimeout(() => {
        setQIdx(nextIdx)
        setAnimKey(k => k + 1)
        setPhase('in')
      }, 360)
    }
  }

  function handleSelect(wasCorrect) {
    if (wasCorrect) setDoneCnt(d => d + 1)
    setPendingAdvance(true)
  }

  const cur = questions[qIdx]

  const slideStyle = {
    in:     { animation: 'qrs-in 420ms cubic-bezier(0.16,1,0.3,1) both' },
    active: { animation: 'none', opacity: 1 },
    out:    { animation: 'qrs-out 300ms ease both' },
    done:   { animation: 'none', opacity: 0, pointerEvents: 'none' },
  }[phase] || {}

  const answerStyle = {
    in:     { animation: 'qrs-in 420ms cubic-bezier(0.16,1,0.3,1) 80ms both' },
    active: { animation: 'none', opacity: 1 },
    out:    { animation: 'qrs-out 300ms ease both' },
    done:   { animation: 'none', opacity: 0, pointerEvents: 'none' },
  }[phase] || {}

  function makeBlock(q) {
    return {
      question: q.question,
      options: q.options.map((opt, i) => ({
        text: opt.text || opt,
        correct: i === q.correct,
        icon: opt.icon,
      })),
      explanation: q.explanation,
      hint: q.hint,
    }
  }

  return (
    <>
      <style>{`
        @keyframes qrs-in  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes qrs-out { from { opacity:1; transform:translateY(0); }    to { opacity:0; transform:translateY(-12px); } }
        @keyframes qrs-word { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes qrs-shake {
          0%,100% { transform:translateX(0); }
          18% { transform:translateX(-9px); }
          36% { transform:translateX(9px); }
          54% { transform:translateX(-7px); }
          72% { transform:translateX(7px); }
          88% { transform:translateX(-3px); }
        }
        @keyframes qrs-start { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes qrs-label { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#08090D', overflow: 'hidden' }}>

        {/* Background image */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          filter: 'blur(0.5px) brightness(0.60) grayscale(8%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Global overlay */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(8,9,13,0.28)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Left darkening — text readable left, image bleeds right */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'linear-gradient(90deg, rgba(8,9,13,0.97) 0%, rgba(8,9,13,0.88) 40%, rgba(8,9,13,0.62) 70%, rgba(8,9,13,0.22) 100%)',
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* Bottom fade */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 260,
          background: 'linear-gradient(0deg, rgba(8,9,13,0.99) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 4,
        }} />

        {renderHeader?.()}

        {/* Progress dots */}
        <ProgressDots total={total} current={qIdx} done={doneCnt} accent={accent} rgb={rgb} />

        {/* Main layout — flex column prevents question/answer overlap */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column',
          padding: '0 28px',
        }}>
          {/* Spacer to position question at ~34% */}
          <div style={{ height: '34vh', flexShrink: 0 }} />

          {/* "Quick Recall" label */}
          <div style={{
            flexShrink: 0,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600, fontSize: 11,
            textTransform: 'uppercase', letterSpacing: '0.30em',
            color: accent, opacity: 0.80,
            marginBottom: 18,
            animation: 'qrs-label 400ms ease 100ms both',
          }}>
            Quick Recall
          </div>

          {/* Question text */}
          {phase !== 'done' && cur && (
            <div
              key={`q-${animKey}`}
              style={{ position: 'relative', flexShrink: 0, maxWidth: 340, ...slideStyle }}
            >
              <Glow rgb={rgb} />
              <div style={{ position: 'relative' }}>
                <QuestionWords question={cur.question} />
              </div>
            </div>
          )}

          {/* Elastic spacer — shrinks to keep answers from overlapping question */}
          <div style={{ flex: 1, minHeight: 32 }} />

          {/* Answer area */}
          {phase !== 'done' && cur && (
            <div
              key={`a-${animKey}`}
              style={{
                flexShrink: 0,
                paddingBottom: 'calc(90px + env(safe-area-inset-bottom, 0px))',
                ...answerStyle,
              }}
            >
              {cur.type === 'truefalse' && (
                <TrueFalseButtons q={cur} accent={accent} onSelect={handleSelect} />
              )}
              {(cur.type === 'choice' || cur.type === 'connection') && (
                <AnswerInteraction
                  block={makeBlock(cur)}
                  subject={subject}
                  onComplete={({ correct }) => handleSelect(correct)}
                />
              )}
            </div>
          )}
        </div>

        {/* "Continue →" — stays visible after answer until tapped */}
        {pendingAdvance && phase !== 'done' && (
          <button
            onClick={advance}
            style={{
              position: 'fixed',
              bottom: 'calc(40px + env(safe-area-inset-bottom, 0px))',
              right: 28, zIndex: 10,
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer',
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 22,
              color: accent,
              textShadow: `0 0 24px rgba(${rgb},0.5)`,
              animation: 'qrs-start 300ms ease both',
            }}>
            Continue →
          </button>
        )}

        {/* "Start chapter →" — after all questions answered */}
        {phase === 'done' && (
          <button
            onClick={onContinue}
            style={{
              position: 'fixed', bottom: 64, right: 28, zIndex: 10,
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer',
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 30,
              color: accent,
              textShadow: `0 0 32px rgba(${rgb},0.55)`,
              animation: 'qrs-start 420ms ease both',
            }}>
            Start chapter →
          </button>
        )}

      </div>
    </>
  )
}
