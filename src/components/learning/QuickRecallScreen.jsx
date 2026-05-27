import { useState, useEffect } from 'react'
import AnswerInteraction from '../core/AnswerInteraction.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'

const IMAGES = {
  History:   '/historybacker.png',
  Biology:   '/biologybacker.png',
  Maths:     '/mathsbacker.png',
  Sociology: '/sociologybacker.png',
  Chemistry: '/chemsistrybacker.png',
  Physics:   '/physicsbacker.png',
  English:   '/Englishbacker.png',
  Music:     '/historybacker.png',
}

// Icon SVGs keyed by name
function Icon({ name, size = 22, color = 'currentColor' }) {
  const s = { width: size, height: size, display: 'block' }
  const props = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', style: s }
  switch (name) {
    case 'lightbulb': return <svg {...props}><path d="M9 21h6M12 3a6 6 0 0 1 4.243 10.243C15.27 14.216 15 15.063 15 16H9c0-.937-.27-1.784-1.243-2.757A6 6 0 0 1 12 3z"/><line x1="9" y1="19" x2="15" y2="19"/></svg>
    case 'people':    return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    case 'arrow':     return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    case 'book':      return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    case 'leaf':      return <svg {...props}><path d="M2 22c8-8 12-14 12-20C7 2 2 8 2 22z"/><path d="M22 6c-4.5 4.5-9 7.5-20 8"/></svg>
    case 'flask':     return <svg {...props}><path d="M9 3h6M9 3v6l-4.5 9A2 2 0 0 0 6.26 21h11.48a2 2 0 0 0 1.76-3L15 9V3"/></svg>
    case 'warning':   return <svg {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    case 'heart':     return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    case 'house':     return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    case 'device':    return <svg {...props}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
    case 'atom':      return <svg {...props}><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5z"/></svg>
    case 'germ':      return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
    case 'dna':       return <svg {...props}><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M2 9c6.667-6 13.333 0 20-6"/><path d="M15 4c-1.198 1.332-1.918 2.665-2.207 3.993"/><path d="M15.5 22c-.667 0-1.333-.333-2-1"/><path d="M8.5 2c.667 0 1.333.333 2 1"/></svg>
    case 'gear':      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    case 'science':   return <svg {...props}><path d="M9 3h6M9 3v6l-4.5 9A2 2 0 0 0 6.26 21h11.48a2 2 0 0 0 1.76-3L15 9V3"/><line x1="6.2" y1="15" x2="17.8" y2="15"/></svg>
    default:          return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
  }
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
            borderRadius: 999,
            background: isDone ? accent : isActive ? accent : 'rgba(255,255,255,0.22)',
            boxShadow: isActive ? `0 0 10px rgba(${rgb},0.6)` : isDone ? `0 0 6px rgba(${rgb},0.35)` : 'none',
            transition: 'all 300ms ease',
          }} />
        )
      })}
    </div>
  )
}

function TrueFalseQuestion({ q, accent, rgb, onSelect }) {
  const [chosen, setChosen] = useState(null)

  function pick(val) {
    if (chosen !== null) return
    setChosen(val)
    const correct = val === q.isTrue
    setTimeout(() => onSelect(correct), 560)
  }

  const correct = chosen !== null ? q.isTrue : null

  return (
    <div style={{ width: '100%' }}>
      {/* Statement */}
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 800, fontSize: 38,
        lineHeight: '46px', letterSpacing: '-0.03em',
        color: '#FFFFFF',
        marginBottom: 64,
      }}>
        {q.question}
      </div>

      {/* True / False options */}
      <div style={{ display: 'flex', gap: 36 }}>
        {[true, false].map((val) => {
          const label   = val ? 'True' : 'False'
          const picked  = chosen === val
          const isRight = correct !== null && val === correct
          const isWrong = picked && !isRight

          let color = 'rgba(255,255,255,0.28)'
          if (chosen === null) color = 'rgba(255,255,255,0.72)'
          if (picked && isRight) color = accent
          if (isWrong) color = 'rgba(255,80,80,0.8)'
          if (!picked && chosen !== null && isRight) color = accent

          return (
            <button
              key={label}
              onClick={() => pick(val)}
              style={{
                background: 'none', border: 'none', padding: 0, cursor: chosen !== null ? 'default' : 'pointer',
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800, fontSize: 44,
                letterSpacing: '-0.03em',
                color,
                textDecoration: (picked || (chosen !== null && isRight)) ? 'underline' : 'none',
                textDecorationColor: accent,
                textUnderlineOffset: 6,
                textDecorationThickness: 3,
                transition: 'color 300ms ease',
              }}>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ChoiceQuestion({ q, onSelect, subject }) {
  const block = {
    question: q.question,
    options: q.options.map((text, i) => ({
      text,
      correct: i === q.correct,
    })),
    explanation: q.explanation,
    hint: q.hint,
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 800, fontSize: 34,
        lineHeight: '42px', letterSpacing: '-0.03em',
        color: '#FFFFFF',
        marginBottom: 40,
      }}>
        {q.question}
      </div>

      <AnswerInteraction
        block={block}
        subject={subject}
        onComplete={({ correct }) => onSelect(correct)}
      />
    </div>
  )
}

function ConnectionQuestion({ q, onSelect, subject }) {
  const block = {
    question: q.question,
    options: q.options.map((opt, i) => ({
      text: opt.text || opt,
      correct: i === q.correct,
      icon: opt.icon,
    })),
    explanation: q.explanation,
    hint: q.hint,
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 800, fontSize: 34,
        lineHeight: '42px', letterSpacing: '-0.03em',
        color: '#FFFFFF',
        marginBottom: 40,
      }}>
        {q.question}
      </div>

      <AnswerInteraction
        block={block}
        subject={subject}
        onComplete={({ correct }) => onSelect(correct)}
      />
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

  const [qIdx,    setQIdx]    = useState(0)
  const [doneCnt, setDoneCnt] = useState(0) // how many answered correctly (for dots)
  const [phase,   setPhase]   = useState('in') // 'in' | 'active' | 'out' | 'done'
  const [animKey, setAnimKey] = useState(0)

  // Transition from 'in' → 'active' after mount
  useEffect(() => {
    const t = setTimeout(() => setPhase('active'), 360)
    return () => clearTimeout(t)
  }, [animKey])

  function advance() {
    const nextIdx = qIdx + 1
    if (nextIdx >= total) {
      // All done
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
    advance()
  }

  const cur = questions[qIdx]

  const slideStyle = {
    in:     { animation: 'qrs-in 360ms ease both' },
    active: { animation: 'none', opacity: 1 },
    out:    { animation: 'qrs-out 360ms ease both' },
    done:   { animation: 'none', opacity: 0, pointerEvents: 'none' },
  }[phase] || {}

  return (
    <>
      <style>{`
        @keyframes qrs-in  { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes qrs-out { from { opacity: 1; transform: translateX(0); }   to { opacity: 0; transform: translateX(-28px); } }
        @keyframes qrs-shake {
          0%   { transform: translateX(0); }
          18%  { transform: translateX(-9px); }
          36%  { transform: translateX(9px); }
          54%  { transform: translateX(-7px); }
          72%  { transform: translateX(7px); }
          88%  { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
        @keyframes qrs-start { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes qrs-label { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#08090D', overflow: 'hidden' }}>

        {/* Background image */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center right',
          filter: 'blur(0.5px) brightness(0.38) grayscale(12%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Global overlay */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(8,9,13,0.52)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Left darkening */}
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

        {/* Universal learning header (rendered by parent via renderHeader prop) */}
        {renderHeader?.()}

        {/* Progress dots */}
        <ProgressDots
          total={total}
          current={qIdx}
          done={doneCnt}
          accent={accent}
          rgb={rgb}
        />

        {/* Label */}
        <div style={{
          position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10,
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600, fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.30em',
          color: accent, opacity: 0.80,
          whiteSpace: 'nowrap',
          animation: 'qrs-label 400ms ease 100ms both',
        }}>
          Quick Recall
        </div>

        {/* Question area */}
        <div style={{
          position: 'relative', zIndex: 5,
          padding: '120px 28px 200px',
          overflowY: 'auto', maxHeight: '100dvh',
        }}>
          {phase !== 'done' && cur && (
            <div key={animKey} style={{ maxWidth: 360, ...slideStyle }}>
              {cur.type === 'truefalse' && (
                <TrueFalseQuestion q={cur} accent={accent} rgb={rgb} onSelect={handleSelect} />
              )}
              {cur.type === 'choice' && (
                <ChoiceQuestion q={cur} onSelect={handleSelect} subject={subject} />
              )}
              {cur.type === 'connection' && (
                <ConnectionQuestion q={cur} onSelect={handleSelect} subject={subject} />
              )}
            </div>
          )}
        </div>

        {/* "Start chapter →" — appears when done */}
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
