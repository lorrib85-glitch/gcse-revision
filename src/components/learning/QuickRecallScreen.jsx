import { useState, useEffect, useMemo } from 'react'
import AnswerInteraction from '../core/AnswerInteraction.jsx'
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

function tokenize(text) {
  const parts = text.split(/(\s+)/)
  let wi = 0
  return parts.map((part, i) => {
    if (/^\s+$/.test(part)) return { key: i, space: true, text: part }
    return { key: i, space: false, text: part, wordIdx: wi++ }
  })
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

function TrueFalseQuestion({ q, accent, rgb, onSelect }) {
  const [chosen,      setChosen]      = useState(null)
  const [shakeTarget, setShakeTarget] = useState(null)
  const [btnsReady,   setBtnsReady]   = useState(false)

  const tokens    = tokenize(q.question)
  const wordCount = tokens.filter(t => !t.space).length
  const btnDelay  = 260 + (wordCount - 1) * 65 + 380

  useEffect(() => {
    const t = setTimeout(() => setBtnsReady(true), btnDelay)
    return () => clearTimeout(t)
  }, [btnDelay])

  function pick(val) {
    if (chosen !== null || !btnsReady) return
    const correct = val === q.isTrue
    if (!correct) {
      setShakeTarget(val ? 'true' : 'false')
      setTimeout(() => setShakeTarget(null), 300)
    }
    setChosen(val)
    setTimeout(() => onSelect(correct), correct ? 500 : 700)
  }

  const answered = chosen !== null

  return (
    <>
      {/* Statement */}
      <div style={{
        position: 'absolute', top: '34%', left: 28, right: 28, zIndex: 5,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(28px, 9vw, 40px)',
          lineHeight: 'clamp(33px, 10.5vw, 46px)',
          letterSpacing: '-0.05em',
          color: '#FFFFFF',
          maxWidth: 320,
        }}>
          {tokens.map(tok =>
            tok.space ? tok.text : (
              <span
                key={tok.key}
                style={{
                  display: 'inline-block',
                  animation: `qrs-word 220ms ease ${260 + tok.wordIdx * 65}ms both`,
                }}
              >
                {tok.text}
              </span>
            )
          )}
        </div>
      </div>

      {/* TRUE / FALSE buttons */}
      <div style={{
        position: 'fixed', bottom: 100, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, zIndex: 10,
        opacity: btnsReady ? 1 : 0,
        transition: 'opacity 400ms ease',
        pointerEvents: !btnsReady ? 'none' : 'auto',
      }}>
        <button
          onClick={() => pick(true)}
          style={{
            background: 'none', border: 'none', cursor: answered ? 'default' : 'pointer',
            fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 24,
            textTransform: 'uppercase', letterSpacing: '0.18em',
            color: answered
              ? (q.isTrue ? accent : 'rgba(255,255,255,0.22)')
              : 'rgba(255,255,255,0.82)',
            borderBottom: '1.5px solid rgba(255,255,255,0.16)', paddingBottom: 2,
            animation: shakeTarget === 'true' ? 'qrs-shake 220ms ease' : 'none',
            transition: 'color 300ms ease',
          }}>
          TRUE
        </button>
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.14)', flexShrink: 0 }} />
        <button
          onClick={() => pick(false)}
          style={{
            background: 'none', border: 'none', cursor: answered ? 'default' : 'pointer',
            fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 24,
            textTransform: 'uppercase', letterSpacing: '0.18em',
            color: answered
              ? (!q.isTrue ? accent : 'rgba(255,255,255,0.22)')
              : 'rgba(255,255,255,0.82)',
            borderBottom: '1.5px solid rgba(255,255,255,0.16)', paddingBottom: 2,
            animation: shakeTarget === 'false' ? 'qrs-shake 220ms ease' : 'none',
            transition: 'color 300ms ease',
          }}>
          FALSE
        </button>
      </div>
    </>
  )
}

function ChoiceOrConnectionQuestion({ q, subject, onSelect }) {
  const block = useMemo(() => {
    const opts = (q.options || []).map((opt, i) => ({
      text:    typeof opt === 'string' ? opt : opt.text || opt,
      correct: i === q.correct,
      icon:    typeof opt === 'object' ? opt.icon : undefined,
    }))
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]]
    }
    return { question: q.question, options: opts, hint: q.hint }
  }, [q])

  return (
    <div style={{
      position: 'absolute', top: '22%', left: 28, right: 28, zIndex: 5,
      maxHeight: '72dvh', overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(22px, 7vw, 30px)',
        lineHeight: 1.3, letterSpacing: '-0.03em',
        color: '#FFFFFF',
        marginBottom: 32, maxWidth: 340,
        animation: 'qrs-word 300ms ease 60ms both',
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
      <style>{`
        @keyframes qrs-word {
          from { opacity: 0; transform: translateY(9px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes qrs-up-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes qrs-up-out {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-12px); }
        }
        @keyframes qrs-done-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes qrs-shake {
          0%,100% { transform: translateX(0); }
          20%  { transform: translateX(-4px); }
          40%  { transform: translateX(4px); }
          60%  { transform: translateX(-3px); }
          80%  { transform: translateX(2px); }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#08090D', overflow: 'hidden' }}>

        {/* Background image */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: bgStyle.opacity,
          filter: bgStyle.filter,
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Left gradient — skipped for subjects with dark textured backgrounds */}
        {!bgStyle.skipLeftGradient && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'linear-gradient(90deg, rgba(8,9,13,0.94) 0%, rgba(8,9,13,0.78) 38%, rgba(8,9,13,0.42) 68%, rgba(8,9,13,0.16) 100%)',
            pointerEvents: 'none', zIndex: 2,
          }} />
        )}

        {/* Dark overlay */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(8,9,13,0.28)',
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* Bottom fade */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 220,
          background: 'linear-gradient(0deg, rgba(8,9,13,0.97) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 4,
        }} />

        {renderHeader?.()}

        <ProgressDots total={total} current={qIdx} done={doneCnt} accent={accent} rgb={rgb} />

        {/* Question */}
        {phase !== 'done' && cur && (
          <div
            key={animKey}
            style={{
              position: 'relative', zIndex: 5,
              width: '100%', height: '100%',
              ...contentAnim,
            }}
          >
            {cur.type === 'truefalse' && (
              <TrueFalseQuestion q={cur} accent={accent} rgb={rgb} onSelect={handleSelect} />
            )}
            {(cur.type === 'choice' || cur.type === 'connection') && (
              <ChoiceOrConnectionQuestion q={cur} subject={subject} onSelect={handleSelect} />
            )}
          </div>
        )}

        {/* Continue button after all questions */}
        {phase === 'done' && (
          <button
            onClick={onContinue}
            style={{
              position: 'fixed', bottom: 80,
              left: '50%', transform: 'translateX(-50%)',
              zIndex: 10,
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer',
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 22,
              color: accent,
              whiteSpace: 'nowrap',
            }}>
            Continue →
          </button>
        )}

      </div>
    </>
  )
}
