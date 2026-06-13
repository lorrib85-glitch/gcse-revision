import { useState, useEffect, useMemo } from 'react'
import UnifiedQuestionScreen from './UnifiedQuestionScreen.jsx'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'

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

export default function TieredQuizScreen({
  subject = 'History',
  backgroundImage,
  tiers = [],
  renderHeader,
  onContinue,
}) {
  const subjectData = SUBJECTS[subject] || SUBJECTS.History
  const accent = subjectData.accent
  const rgb = subjectData.accentRgb

  const img = backgroundImage || IMAGES[subject] || IMAGES.History
  const bgStyle = BG_STYLE[subject] || {}

  // Tier selection state
  const [tierIdx, setTierIdx] = useState(null)  // null = selecting, otherwise index of chosen tier
  const [phase, setPhase] = useState('select')  // 'select' | 'questions' | 'summary' | 'done'
  const [qIdx, setQIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const curTier = tierIdx !== null ? tiers[tierIdx] : null
  const curQuestion = tierIdx !== null && qIdx < (curTier?.questions?.length || 0) ? curTier.questions[qIdx] : null
  const isLastQ = tierIdx !== null && qIdx === (curTier?.questions?.length || 1) - 1
  const tierTotal = curTier?.questions?.length || 0

  // Animation states
  const contentAnim = {
    'select': { opacity: 1 },
    'questions': { animation: 'qrs-up-in 360ms cubic-bezier(0.22,1,0.36,1) both', opacity: 1 },
    'summary': { animation: 'qrs-up-in 360ms cubic-bezier(0.22,1,0.36,1) both', opacity: 1 },
    'done': { opacity: 0 },
  }[phase] || {}

  function selectTier(idx) {
    setTierIdx(idx)
    setPhase('questions')
    setQIdx(0)
    setCorrectCount(0)
    setAnimKey(k => k + 1)
  }

  function handleAnswer(isCorrect) {
    if (isCorrect) {
      setCorrectCount(c => c + 1)
    }
  }

  function handleQuestionComplete() {
    if (isLastQ) {
      // Show summary
      setPhase('summary')
      setAnimKey(k => k + 1)
    } else {
      // Next question
      setQIdx(q => q + 1)
      setAnimKey(k => k + 1)
    }
  }

  function handleContinueFromSummary() {
    onContinue?.()
  }

  function backToTierSelect() {
    setTierIdx(null)
    setPhase('select')
    setQIdx(0)
    setCorrectCount(0)
    setAnimKey(k => k + 1)
  }

  return (
    <>
      <style>{`
        @keyframes qrs-up-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes qrs-up-out {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-12px); }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#08090D', overflow: 'hidden' }}>

        {/* Background image */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: bgStyle.opacity || 1,
          filter: bgStyle.filter || 'none',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Left gradient */}
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

        {/* Tier Selection Phase */}
        {phase === 'select' && (
          <div style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%', ...contentAnim, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(28px, 9vw, 40px)',
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: 32,
              textAlign: 'center',
              maxWidth: 320,
            }}>
              Choose difficulty
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 300 }}>
              {tiers.map((tier, idx) => (
                <button
                  key={idx}
                  onClick={() => selectTier(idx)}
                  style={{
                    background: 'rgba(36,22,11,0.72)',
                    border: `2px solid ${accent}`,
                    borderRadius: 16,
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    transition: 'all 180ms ease',
                    boxShadow: `0 0 16px rgba(${rgb},0.16)`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(50,35,20,0.88)'
                    e.target.style.boxShadow = `0 0 24px rgba(${rgb},0.28)`
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(36,22,11,0.72)'
                    e.target.style.boxShadow = `0 0 16px rgba(${rgb},0.16)`
                  }}
                >
                  <div style={{
                    fontSize: 28,
                    flexShrink: 0,
                  }}>
                    {tier.emoji || '●'}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{
                      fontFamily: "'Sora', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: accent,
                    }}>
                      {tier.label || 'Tier'}
                    </div>
                    <div style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.56)',
                      marginTop: 4,
                    }}>
                      {tier.questions?.length || 0} questions
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Questions Phase */}
        {phase === 'questions' && curQuestion && (
          <div key={animKey} style={{
            position: 'relative', zIndex: 5,
            width: '100%', height: '100%',
            ...contentAnim,
          }}>
            <UnifiedQuestionScreen
              question={curQuestion.q || curQuestion.question}
              type={curQuestion.type || 'choice'}
              options={curQuestion.options || []}
              correct={curQuestion.correct}
              hint={curQuestion.hint}
              explanation={curQuestion.explanation}
              backgroundImage={backgroundImage || img}
              subject={subject}
              qIndex={qIdx}
              qTotal={tierTotal}
              onAnswer={handleAnswer}
              onComplete={handleQuestionComplete}
            />
          </div>
        )}

        {/* Summary Phase */}
        {phase === 'summary' && curTier && (
          <div style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%', ...contentAnim, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: accent,
              marginBottom: 16,
            }}>
              Tier complete
            </div>

            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(48px, 15vw, 80px)',
              color: accent,
              lineHeight: 1,
              marginBottom: 8,
            }}>
              {correctCount}/{tierTotal}
            </div>

            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 16,
              color: 'rgba(255,255,255,0.72)',
              marginBottom: 32,
              textAlign: 'center',
            }}>
              {correctCount === tierTotal ? 'Perfect! 🎯' : `${Math.round((correctCount / tierTotal) * 100)}% correct`}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 240 }}>
              <button
                onClick={handleContinueFromSummary}
                style={{
                  background: accent,
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 20px',
                  cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#08090D',
                  transition: 'all 120ms ease',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(0.98)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Continue →
              </button>

              <button
                onClick={backToTierSelect}
                style={{
                  background: 'transparent',
                  border: `1px solid ${accent}`,
                  borderRadius: 12,
                  padding: '14px 20px',
                  cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: accent,
                  transition: 'all 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = `rgba(${rgb},0.08)`
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent'
                }}
              >
                Try another tier
              </button>
            </div>
          </div>
        )}

        {/* Progress dots during questions phase */}
        {phase === 'questions' && <ProgressDots total={tierTotal} current={qIdx} done={0} accent={accent} rgb={rgb} />}

      </div>
    </>
  )
}
