import { useState, useEffect, useRef } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { BUTTONS } from '../../constants/buttons.js'
import { SUBJECTS } from '../../constants/subjects.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import ContentShell from '../layout/ContentShell.jsx'

// ── Fuzzy matching ────────────────────────────────────────────────────────────

function normalise(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ')
}

function matchesAccepted(userLine, acceptedPhrases) {
  const n = normalise(userLine)
  if (!n) return false
  return acceptedPhrases.some(phrase => {
    const p = normalise(phrase)
    return n.includes(p) || p.includes(n) || levenshtein(n, p) <= (p.length <= 5 ? 1 : 2)
  })
}

function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[m][n]
}

function checkAnswers(userLines, acceptedAnswers) {
  const matched = []
  const missing = []

  for (const ans of acceptedAnswers) {
    const foundLine = userLines.find(line =>
      line.trim() && matchesAccepted(line, ans.accepted) &&
      !matched.some(m => m.userLine === line)
    )
    if (foundLine) {
      matched.push({ canonical: ans.canonical, userLine: foundLine })
    } else {
      missing.push(ans.canonical)
    }
  }
  return { matched, missing }
}

// ── Design tokens ─────────────────────────────────────────────────────────────

const THEME = {
  surface: '#0C0905',
  surfaceRaised: '#15100A',
  text: '#F5EED9',
  textMuted: 'rgba(245,238,217,0.62)',
  textFaint: 'rgba(245,238,217,0.44)',
  ink: '#2A1404',
  inkMuted: 'rgba(42,20,4,0.70)',
  accent: SUBJECTS.History.accent,
  accentRgb: SUBJECTS.History.accentRgb,
  bronze: '#8B6B14',
  parchment: '#F0E0B0',
  parchmentRgb: '240,224,176',
}

const THEORY_TINTS = {
  'god-sin': { from: 'rgba(80,40,8,0.88)', to: 'rgba(12,9,5,0.98)' },
  'four-humours': { from: 'rgba(70,20,10,0.88)', to: 'rgba(12,9,5,0.98)' },
  astrology: { from: 'rgba(20,20,55,0.88)', to: 'rgba(12,9,5,0.98)' },
}

const CSS = `
  @keyframes mtp-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mtp-ink {
    from { opacity: 0; transform: translateY(6px); filter: blur(2px); }
    to   { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  .mtp-input { outline: none; background: transparent; }
  .mtp-input::placeholder { color: rgba(60,35,8,0.38); font-family: inherit; }
`

function sentenceCase(value = '') {
  const cleaned = String(value).replace(/\s+/g, ' ').trim().toLowerCase()
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : cleaned
}

function firstSentence(value = '') {
  const [first] = String(value).split('.')
  return first ? `${first}.` : value
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MedicalTheoryPrescription({ screen, selectedHealer, onComplete }) {
  const theories = screen.theories || []

  const [phase, setPhase] = useState('select')
  const [activeId, setActiveId] = useState(null)
  const [completedIds, setCompletedIds] = useState([])
  const [inputs, setInputs] = useState({})
  const [results, setResults] = useState({})
  const [revealCount, setRevealCount] = useState(0)
  const [finalPhase, setFinalPhase] = useState(0)
  const [pressed, setPressed] = useState(false)

  const activeTheory = theories.find(t => t.id === activeId)
  const tint = activeId ? (THEORY_TINTS[activeId] || THEORY_TINTS['god-sin']) : THEORY_TINTS['god-sin']
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const init = {}
    for (const t of theories) {
      init[t.id] = Array(t.acceptedAnswers.length).fill('')
    }
    setInputs(init)
  }, [theories])

  useEffect(() => {
    if (phase !== 'reveal') return
    const missing = results[activeId]?.missing || []
    if (revealCount >= missing.length) return
    const timer = setTimeout(() => setRevealCount(c => c + 1), 700)
    return () => clearTimeout(timer)
  }, [phase, revealCount, activeId, results])

  useEffect(() => {
    if (phase !== 'final') return
    if (finalPhase >= theories.length) return
    const timer = setTimeout(() => setFinalPhase(p => p + 1), 600)
    return () => clearTimeout(timer)
  }, [phase, finalPhase, theories.length])

  function selectTheory(id) {
    setActiveId(id)
    setPhase('explain')
  }

  function checkPrescription() {
    const lines = inputs[activeId] || []
    const res = checkAnswers(lines, activeTheory.acceptedAnswers)
    setResults(r => ({ ...r, [activeId]: res }))
    setRevealCount(0)
    setPhase('reveal')
  }

  function finishReveal() {
    const next = completedIds.includes(activeId) ? completedIds : [...completedIds, activeId]
    setCompletedIds(next)
    if (next.length === theories.length) {
      setPhase('final')
      setFinalPhase(0)
    } else {
      setActiveId(null)
      setPhase('select')
    }
  }

  function updateInput(theoryId, idx, val) {
    setInputs(prev => ({
      ...prev,
      [theoryId]: prev[theoryId].map((v, i) => i === idx ? val : v),
    }))
  }

  if (phase === 'select') return (
    <SelectPhase
      theories={theories}
      completedIds={completedIds}
      onSelect={selectTheory}
      screen={screen}
      selectedHealer={selectedHealer}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'explain') return (
    <ExplainPhase
      theory={activeTheory}
      tint={tint}
      onStart={() => setPhase('input')}
      pressed={pressed}
      setPressed={setPressed}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'input') return (
    <InputPhase
      theory={activeTheory}
      inputs={inputs[activeId] || []}
      onChange={(idx, val) => updateInput(activeId, idx, val)}
      onCheck={checkPrescription}
      pressed={pressed}
      setPressed={setPressed}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'reveal') return (
    <RevealPhase
      theory={activeTheory}
      result={results[activeId] || { matched: [], missing: [] }}
      revealCount={revealCount}
      allComplete={completedIds.length + 1 === theories.length && !completedIds.includes(activeId)}
      onContinue={finishReveal}
      pressed={pressed}
      setPressed={setPressed}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'final') return (
    <FinalPhase
      theories={theories}
      results={results}
      finalPhase={finalPhase}
      screen={screen}
      onComplete={onComplete}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  return null
}

// ── Phase: Select ─────────────────────────────────────────────────────────────

function SelectPhase({ theories, completedIds, onSelect, screen, selectedHealer, prefersReducedMotion }) {
  const healerTitle = selectedHealer?.title?.toLowerCase()
  const heading = healerTitle
    ? `What does the ${healerTitle} think caused Thomas's illness?`
    : 'What caused illness in medieval times?'

  return (
    <ContentShell subject="History">
      <style>{CSS}</style>

      <div style={{
        animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        marginBottom: SPACING.compact,
      }}>
        <h1 style={{
          ...TYPE.screenHeading,
          color: THEME.text,
          margin: 0,
        }}>
          {heading}
        </h1>
        <p style={{
          ...TYPE.bodyLarge,
          color: THEME.textMuted,
          margin: `${SPACING.compact}px 0 0`,
        }}>
          {screen.theories?.[0]?.introText || 'Different people had different explanations.'}
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.compact,
      }}>
        {theories.map((theory, i) => {
          const done = completedIds.includes(theory.id)
          return (
            <TheoryCard
              key={theory.id}
              theory={theory}
              done={done}
              onClick={() => !done && onSelect(theory.id)}
              delay={i * 80}
              prefersReducedMotion={prefersReducedMotion}
            />
          )
        })}
      </div>
    </ContentShell>
  )
}

function TheoryCard({ theory, done, onClick, delay, prefersReducedMotion }) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onPointerDown={() => !done && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '88px 1fr 34px',
        alignItems: 'center',
        gap: SPACING.compact,
        width: '100%',
        minHeight: 142,
        padding: SPACING.compact,
        textAlign: 'left',
        cursor: done ? 'default' : 'pointer',
        border: `1px solid rgba(${THEME.accentRgb},${done ? '0.24' : '0.15'})`,
        borderRadius: RADII.large || RADII.medium,
        background: `linear-gradient(145deg, rgba(${THEME.parchmentRgb},0.055), rgba(${THEME.accentRgb},0.025))`,
        boxShadow: done ? `inset 0 1px 0 rgba(${THEME.accentRgb},0.10)` : '0 18px 36px rgba(0,0,0,0.24)',
        opacity: done ? 0.72 : 1,
        overflow: 'hidden',
        transition: `transform ${MOTION.duration.standard} ${MOTION.easing.standard}, border-color ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        transform: pressed ? 'scale(0.985)' : 'scale(1)',
        animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} ${delay}ms both`,
      }}
    >
      <span style={{
        width: 70,
        height: 70,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `rgba(${THEME.parchmentRgb},0.90)`,
        border: `1px solid rgba(${THEME.accentRgb},0.18)`,
        boxShadow: `0 0 0 1px rgba(${THEME.accentRgb},0.08), inset 0 1px 0 rgba(255,255,255,0.22)`,
      }}>
        <img
          src={theory.icon}
          alt=""
          aria-hidden="true"
          style={{
            width: 46,
            height: 46,
            objectFit: 'contain',
            opacity: done ? 0.55 : 0.95,
            filter: done ? 'grayscale(30%)' : 'grayscale(100%) contrast(1.2) brightness(0.12)',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </span>

      <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{
          ...TYPE.cardTitle,
          color: done ? THEME.textFaint : THEME.text,
        }}>
          {sentenceCase(theory.shortLabel || theory.label)}
        </span>
        <span style={{
          ...TYPE.bodySmall,
          color: done ? THEME.textFaint : THEME.textMuted,
          paddingRight: SPACING.micro,
        }}>
          {firstSentence(theory.explanation)}
        </span>
      </span>

      <span style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: `1px solid rgba(${THEME.accentRgb},${done ? '0.48' : '0.24'})`,
        color: done ? THEME.accent : THEME.textMuted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...TYPE.buttonText,
      }}>
        {done ? '✓' : '›'}
      </span>
    </button>
  )
}

// ── Phase: Explain ────────────────────────────────────────────────────────────

function ExplainPhase({ theory, tint, onStart, pressed, setPressed, prefersReducedMotion }) {
  return (
    <div style={{
      minHeight: '100dvh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      background: THEME.surface,
    }}>
      <style>{CSS}</style>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${theory.icon})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.35) saturate(0.7)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to bottom, ${tint.from} 0%, rgba(12,9,5,0.72) 44%, ${tint.to} 100%)`,
      }} />

      <div style={{
        position: 'relative',
        padding: `${SPACING.standard}px`,
        paddingBottom: `calc(${SPACING.section}px + env(safe-area-inset-bottom, 0px))`,
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.compact,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.compact }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `1px solid rgba(${THEME.accentRgb},0.35)`,
            flexShrink: 0,
            background: `rgba(${THEME.parchmentRgb},0.88)`,
          }}>
            <img src={theory.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10, boxSizing: 'border-box' }} />
          </div>
          <div style={{ ...TYPE.cardTitle, color: THEME.text }}>
            {sentenceCase(theory.label)}
          </div>
        </div>

        <div style={{ ...TYPE.bodySmall, color: THEME.textFaint }}>
          {theory.scenePrompt}
        </div>

        <div style={{ ...TYPE.bodyLarge, color: THEME.text, lineHeight: 1.6 }}>
          {theory.explanation}
        </div>

        <CTA
          label="Write the prescription"
          onClick={onStart}
          pressed={pressed}
          setPressed={setPressed}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </div>
  )
}

// ── Phase: Input ──────────────────────────────────────────────────────────────

function InputPhase({ theory, inputs, onChange, onCheck, pressed, setPressed, prefersReducedMotion }) {
  const inputRefs = useRef([])
  const anyFilled = inputs.some(v => v.trim().length > 0)

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: THEME.surface,
      overflow: 'hidden',
    }}>
      <style>{CSS}</style>
      <div style={{
        flexShrink: 0,
        paddingTop: `calc(env(safe-area-inset-top, 0px) + ${SPACING.section}px)`,
        paddingLeft: SPACING.standard,
        paddingRight: SPACING.standard,
        paddingBottom: SPACING.compact,
        animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
      }}>
        <div style={{ ...TYPE.sectionHeading, color: THEME.text }}>
          {theory.prescriptionPrompt}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ParchmentBackground />
        <div style={{
          position: 'relative',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.separation}px`,
          gap: SPACING.compact,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {theory.acceptedAnswers.map((ans, i) => (
              <div key={ans.canonical} style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
                <span style={{
                  ...TYPE.metadata,
                  color: 'rgba(58,32,8,0.45)',
                  fontWeight: 600,
                  width: 20,
                  flexShrink: 0,
                  textAlign: 'right',
                }}>{i + 1}.</span>
                <input
                  ref={el => { if (inputRefs?.current) inputRefs.current[i] = el }}
                  className="mtp-input"
                  value={inputs[i] || ''}
                  onChange={e => onChange?.(i, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && inputRefs?.current?.[i + 1]) {
                      inputRefs.current[i + 1].focus()
                    }
                  }}
                  aria-label={`Treatment ${i + 1}`}
                  placeholder="Write a treatment…"
                  style={{
                    flex: 1,
                    border: 'none',
                    borderBottom: '1.5px solid rgba(58,32,8,0.30)',
                    padding: '6px 4px 8px',
                    fontFamily: TYPE.bodyText.fontFamily,
                    fontSize: TYPE.bodyText.fontSize,
                    fontWeight: TYPE.bodyText.fontWeight,
                    color: THEME.ink,
                    background: 'transparent',
                    width: '100%',
                    boxSizing: 'border-box',
                    caretColor: THEME.bronze,
                  }}
                />
              </div>
            ))}
          </div>

          <CTA
            label="Check prescription"
            onClick={onCheck}
            disabled={!anyFilled}
            pressed={pressed}
            setPressed={setPressed}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      </div>
    </div>
  )
}

// ── Phase: Reveal ─────────────────────────────────────────────────────────────

function RevealPhase({ theory, result, revealCount, allComplete, onContinue, pressed, setPressed, prefersReducedMotion }) {
  const allRevealed = revealCount >= (result.missing?.length || 0)
  const matched = result?.matched || []
  const missing = result?.missing || []
  const lines = theory.acceptedAnswers.map(ans => {
    const matchEntry = matched.find(m => m.canonical === ans.canonical)
    const missingIdx = missing.indexOf(ans.canonical)
    return { canonical: ans.canonical, matchEntry, missingIdx }
  })

  return (
    <div style={{ minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{CSS}</style>
      <ParchmentBackground />
      <div style={{
        position: 'relative',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: `${SPACING.section}px ${SPACING.standard}px ${SPACING.separation}px`,
        gap: SPACING.compact,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro, marginBottom: SPACING.micro }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1px solid rgba(58,32,8,0.28)',
            background: `rgba(${THEME.parchmentRgb},0.50)`,
            flexShrink: 0,
          }}>
            <img src={theory.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 7, boxSizing: 'border-box' }} />
          </div>
          <div style={{ ...TYPE.cardTitle, color: THEME.ink }}>
            {sentenceCase(theory.label)}
          </div>
        </div>

        <div style={{ ...TYPE.sectionHeading, color: THEME.ink, marginBottom: SPACING.micro }}>
          Here are the common treatments linked to this belief.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {lines.map((line, i) => {
            const isMatched = !!line.matchEntry
            const isRevealed = !isMatched && line.missingIdx >= 0 && line.missingIdx < revealCount
            const text = isMatched ? line.matchEntry.userLine : isRevealed ? line.canonical : ''

            return (
              <div key={line.canonical} style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
                <span style={{
                  ...TYPE.metadata,
                  color: 'rgba(58,32,8,0.45)',
                  fontWeight: 600,
                  width: 20,
                  flexShrink: 0,
                  textAlign: 'right',
                }}>{i + 1}.</span>
                <span style={{
                  flex: 1,
                  fontFamily: TYPE.bodyText.fontFamily,
                  fontSize: TYPE.bodyText.fontSize,
                  fontWeight: isMatched ? 600 : TYPE.bodyText.fontWeight,
                  color: isMatched ? THEME.ink : isRevealed ? '#4A2800' : 'transparent',
                  borderBottom: '1.5px solid rgba(58,32,8,0.20)',
                  padding: '6px 4px 8px',
                  minHeight: 38,
                  animation: isRevealed && !prefersReducedMotion
                    ? `mtp-ink ${MOTION.duration.slow} ${MOTION.easing.standard} both`
                    : 'none',
                  display: 'block',
                }}>
                  {text}
                </span>
                <span style={{
                  flexShrink: 0,
                  fontSize: 14,
                  color: isMatched ? '#5C8A3A' : isRevealed ? THEME.bronze : 'transparent',
                }}>
                  {isMatched ? '✓' : isRevealed ? '✦' : ''}
                </span>
              </div>
            )
          })}
        </div>

        {allRevealed && (
          <div style={{
            ...TYPE.bodySmall,
            color: THEME.inkMuted,
            lineHeight: 1.6,
            borderLeft: '2px solid rgba(58,32,8,0.28)',
            paddingLeft: SPACING.compact,
            animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
          }}>
            {theory.revealExplanation}
          </div>
        )}

        {allRevealed && (
          <CTA
            label={allComplete ? 'Reveal the big picture' : 'Explore another belief'}
            onClick={onContinue}
            pressed={pressed}
            setPressed={setPressed}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </div>
    </div>
  )
}

// ── Phase: Final ──────────────────────────────────────────────────────────────

function FinalPhase({ theories, results, finalPhase, screen, onComplete, prefersReducedMotion }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: `linear-gradient(160deg, rgba(${THEME.accentRgb},0.06) 0%, ${THEME.surface} 50%)`,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      padding: `${SPACING.section}px ${SPACING.standard}px calc(${SPACING.separation}px + env(safe-area-inset-bottom, 0px))`,
    }}>
      <style>{CSS}</style>

      <header style={{
        textAlign: 'center',
        marginBottom: SPACING.separation,
        animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
      }}>
        <div style={{ ...TYPE.sectionHeading, color: THEME.text }}>
          Medieval medicine
        </div>
        <p style={{ ...TYPE.bodySmall, color: THEME.textMuted, margin: `${SPACING.micro}px auto 0`, maxWidth: 320 }}>
          Different causes created different treatments.
        </p>
      </header>

      <div style={{ display: 'flex', gap: SPACING.compact, marginBottom: SPACING.separation }}>
        {theories.map((theory, i) => {
          const visible = i < finalPhase
          const allAnswers = theory.acceptedAnswers.map(a => a.canonical)

          return (
            <div
              key={theory.id}
              style={{
                flex: 1,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(14px)',
                transition: prefersReducedMotion ? 'none' : `opacity ${MOTION.duration.slow} ${MOTION.easing.standard}, transform ${MOTION.duration.slow} ${MOTION.easing.standard}`,
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `1px solid rgba(${THEME.accentRgb},0.35)`,
                margin: '0 auto 10px',
                background: `rgba(${THEME.parchmentRgb},0.88)`,
                boxShadow: visible ? `0 0 24px rgba(${THEME.accentRgb},0.15)` : 'none',
              }}>
                <img src={theory.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8, boxSizing: 'border-box' }} />
              </div>

              <div style={{
                ...TYPE.metadata,
                color: THEME.accent,
                textAlign: 'center',
                marginBottom: SPACING.micro,
                letterSpacing: '0.04em',
              }}>
                {sentenceCase(theory.shortLabel)}
              </div>

              <div style={{ width: 1, height: 16, background: `rgba(${THEME.accentRgb},0.30)`, margin: '0 auto 6px' }} />

              <div style={{
                background: `rgba(${THEME.accentRgb},0.05)`,
                border: `1px solid rgba(${THEME.accentRgb},0.14)`,
                borderRadius: RADII.small,
                padding: '10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}>
                {allAnswers.map(ans => (
                  <div key={ans} style={{ ...TYPE.captionText, color: 'rgba(245,238,217,0.75)' }}>
                    {ans}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {finalPhase >= theories.length && (
        <div style={{
          ...TYPE.bodySmall,
          color: THEME.textMuted,
          lineHeight: 1.65,
          textAlign: 'center',
          marginBottom: SPACING.separation,
          padding: `${SPACING.compact}px ${SPACING.compact}px`,
          borderTop: `1px solid rgba(${THEME.accentRgb},0.12)`,
          paddingTop: SPACING.compact,
          animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        }}>
          {screen.finalMessage}
        </div>
      )}

      {finalPhase >= theories.length && (
        <ContinueCTA
          onClick={onComplete}
          accent={THEME.accent}
          style={{
            marginTop: SPACING.micro,
            animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
          }}
        />
      )}
    </div>
  )
}

// ── Shared parts ──────────────────────────────────────────────────────────────

function ParchmentBackground() {
  return (
    <>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/figures/history/medicine/medieval/parchment-scroll.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(${THEME.parchmentRgb},0.30)`,
      }} />
    </>
  )
}

function CTA({ label, onClick, disabled = false, pressed, setPressed, delay = 0, prefersReducedMotion }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: '100%',
        height: BUTTONS.continue.height,
        borderRadius: BUTTONS.continue.borderRadius,
        background: disabled ? `rgba(${THEME.accentRgb},0.08)` : THEME.accent,
        border: disabled ? `1px solid rgba(${THEME.accentRgb},0.18)` : 'none',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...TYPE.buttonText,
        color: disabled ? THEME.accent : THEME.surface,
        transition: `transform ${BUTTONS.continue.transition}`,
        transform: pressed && !disabled ? `scale(${MOTION.scale.press})` : 'scale(1)',
        animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} ${delay}ms both`,
        marginTop: SPACING.micro,
      }}
    >
      {label}
    </button>
  )
}
