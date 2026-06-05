import { useState, useEffect, useRef } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { BUTTONS } from '../../constants/buttons.js'

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
  const matched = []   // { canonical, userLine }
  const missing = []   // canonical strings

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

// ── Colours ───────────────────────────────────────────────────────────────────

const GOLD   = '#D69B45'
const GOLD_RGB = '214,155,69'
const BRONZE = '#8B6B14'
const PARCHMENT = '#F0E0B0'
const DARK   = '#0C0905'

const THEORY_TINTS = {
  'god-sin':       { from: 'rgba(80,40,8,0.92)',  to: 'rgba(12,9,5,0.98)' },
  'four-humours':  { from: 'rgba(70,20,10,0.92)', to: 'rgba(12,9,5,0.98)' },
  'astrology':     { from: 'rgba(20,20,55,0.92)', to: 'rgba(12,9,5,0.98)' },
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MedicalTheoryPrescription({ screen, onComplete }) {
  const theories = screen.theories || []

  const [phase, setPhase]           = useState('select')
  const [activeId, setActiveId]     = useState(null)
  const [completedIds, setCompletedIds] = useState([])
  const [inputs, setInputs]         = useState({})
  const [results, setResults]       = useState({}) // { id: { matched, missing } }
  const [revealCount, setRevealCount] = useState(0)
  const [finalPhase, setFinalPhase] = useState(0) // 0-3 branch animations
  const [pressed, setPressed]       = useState(false)

  const activeTheory = theories.find(t => t.id === activeId)
  const allComplete  = completedIds.length === theories.length
  const tint         = activeId ? (THEORY_TINTS[activeId] || THEORY_TINTS['god-sin']) : THEORY_TINTS['god-sin']

  // Init inputs for each theory
  useEffect(() => {
    const init = {}
    for (const t of theories) {
      init[t.id] = Array(t.acceptedAnswers.length).fill('')
    }
    setInputs(init)
  }, [])

  // Drive the ink-reveal animation one item at a time
  useEffect(() => {
    if (phase !== 'reveal') return
    const missing = results[activeId]?.missing || []
    if (revealCount >= missing.length) return
    const timer = setTimeout(() => setRevealCount(c => c + 1), 700)
    return () => clearTimeout(timer)
  }, [phase, revealCount, activeId, results])

  // Drive branch glow on final screen
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

  function startPrescription() {
    setPhase('input')
  }

  function checkPrescription() {
    const lines = inputs[activeId] || []
    const res = checkAnswers(lines, activeTheory.acceptedAnswers)
    setResults(r => ({ ...r, [activeId]: res }))
    setRevealCount(0)
    setPhase('reveal')
  }

  function finishReveal() {
    const next = [...completedIds]
    if (!next.includes(activeId)) next.push(activeId)
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

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ── Render phases ─────────────────────────────────────────────────────────

  if (phase === 'select') return (
    <SelectPhase
      theories={theories}
      completedIds={completedIds}
      onSelect={selectTheory}
      screen={screen}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'explain') return (
    <ExplainPhase
      theory={activeTheory}
      tint={tint}
      onStart={startPrescription}
      pressed={pressed}
      setPressed={setPressed}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'input') return (
    <InputPhase
      theory={activeTheory}
      tint={tint}
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
      tint={tint}
      inputs={inputs[activeId] || []}
      result={results[activeId] || { matched: [], missing: [] }}
      revealCount={revealCount}
      allComplete={completedIds.length + 1 === theories.length &&
        !completedIds.includes(activeId)}
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
      pressed={pressed}
      setPressed={setPressed}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  return null
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const CSS = `
  @keyframes mtp-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mtp-ink {
    from { opacity: 0; transform: translateY(6px); filter: blur(2px); }
    to   { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes mtp-branch {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mtp-scroll-in {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .mtp-input { outline: none; background: transparent; }
  .mtp-input::placeholder { color: rgba(60,35,8,0.38); font-style: italic; }
`

// ── Phase: Select ─────────────────────────────────────────────────────────────

function SelectPhase({ theories, completedIds, onSelect, screen, prefersReducedMotion }) {
  const remaining = theories.filter(t => !completedIds.includes(t.id))
  const nextTheory = remaining[0]

  return (
    <div style={{
      minHeight: '100dvh',
      background: DARK,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <style>{CSS}</style>

      {/* Hero */}
      <div style={{
        position: 'relative',
        paddingTop: SPACING.section,
        paddingBottom: SPACING.separation,
        paddingLeft: SPACING.standard,
        paddingRight: SPACING.standard,
        background: `linear-gradient(160deg, rgba(${GOLD_RGB},0.08) 0%, rgba(0,0,0,0) 60%)`,
        borderBottom: `1px solid rgba(${GOLD_RGB},0.10)`,
      }}>
        <div style={{
          ...TYPE.metadata,
          textTransform: 'uppercase',
          color: `rgba(${GOLD_RGB},0.55)`,
          marginBottom: SPACING.micro,
          animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        }}>
          {completedIds.length === 0 ? 'Choose a cause' : 'Explore another belief'}
        </div>

        <div style={{
          ...TYPE.sectionTitle,
          color: '#F5EED9',
          marginBottom: SPACING.compact,
          animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} 60ms both`,
        }}>
          {nextTheory?.scenePrompt || 'What caused illness in medieval times?'}
        </div>

        <div style={{
          ...TYPE.bodySmall,
          color: `rgba(245,238,217,0.55)`,
          animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} 120ms both`,
        }}>
          {screen.theories?.[0]?.introText || 'Different people had different explanations.'}
        </div>
      </div>

      {/* Theory cards */}
      <div style={{
        flex: 1,
        padding: `${SPACING.compact}px ${SPACING.standard}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.compact,
        paddingBottom: SPACING.separation,
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

      {/* Bottom hint */}
      <div style={{
        textAlign: 'center',
        paddingBottom: SPACING.separation,
        paddingLeft: SPACING.standard,
        paddingRight: SPACING.standard,
      }}>
        <div style={{
          ...TYPE.metadata,
          color: `rgba(${GOLD_RGB},0.35)`,
          fontStyle: 'italic',
        }}>
          {completedIds.length === 0
            ? 'There was no single correct answer — people believed many different things.'
            : `${completedIds.length} of ${theories.length} complete — different causes led to different treatments.`
          }
        </div>
      </div>
    </div>
  )
}

function TheoryCard({ theory, done, onClick, delay, prefersReducedMotion }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.compact,
        background: done
          ? `rgba(${GOLD_RGB},0.04)`
          : hovered
            ? `rgba(${GOLD_RGB},0.08)`
            : `rgba(${GOLD_RGB},0.05)`,
        border: `1px solid rgba(${GOLD_RGB},${done ? '0.30' : hovered ? '0.35' : '0.18'})`,
        borderRadius: RADII.medium,
        padding: `${SPACING.compact}px`,
        cursor: done ? 'default' : 'pointer',
        textAlign: 'left',
        width: '100%',
        minHeight: 96,
        transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} ${delay}ms both`,
        boxShadow: done ? `inset 0 1px 0 rgba(${GOLD_RGB},0.15), 0 2px 12px rgba(0,0,0,0.28)` : 'none',
        opacity: done ? 0.72 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 64,
        height: 64,
        borderRadius: RADII.small,
        flexShrink: 0,
        overflow: 'hidden',
        border: `1px solid rgba(${GOLD_RGB},${done ? '0.28' : '0.18'})`,
      }}>
        <img
          src={theory.icon}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          ...TYPE.metadata,
          textTransform: 'uppercase',
          color: done ? `rgba(${GOLD_RGB},0.55)` : GOLD,
          marginBottom: 4,
          letterSpacing: '0.06em',
        }}>
          {theory.shortLabel || theory.label}
        </div>
        <div style={{
          ...TYPE.bodySmall,
          color: `rgba(245,238,217,${done ? '0.45' : '0.70'})`,
          lineHeight: 1.4,
          fontSize: 14,
        }}>
          {theory.explanation.split('.')[0] + '.'}
        </div>
      </div>

      {/* State indicator */}
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        flexShrink: 0,
        border: `1.5px solid rgba(${GOLD_RGB},${done ? '0.55' : '0.22'})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: done ? `rgba(${GOLD_RGB},0.12)` : 'transparent',
        transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
      }}>
        {done ? (
          <span style={{ color: GOLD, fontSize: 13, lineHeight: 1 }}>✓</span>
        ) : (
          <span style={{ color: `rgba(${GOLD_RGB},0.35)`, fontSize: 11 }}>›</span>
        )}
      </div>
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
      background: DARK,
    }}>
      {/* Background icon image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${theory.icon})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.35) saturate(0.7)',
      }} />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to bottom, rgba(12,9,5,0.4) 0%, rgba(12,9,5,0.6) 40%, rgba(12,9,5,0.92) 70%, rgba(12,9,5,0.99) 100%)`,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        padding: `${SPACING.standard}px`,
        paddingBottom: `calc(${SPACING.section}px + env(safe-area-inset-bottom, 0px))`,
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.compact,
      }}>

        {/* Icon + label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.compact,
          marginBottom: SPACING.compact,
          animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: RADII.small,
            overflow: 'hidden',
            border: `1px solid rgba(${GOLD_RGB},0.35)`,
            flexShrink: 0,
            boxShadow: `0 0 24px rgba(${GOLD_RGB},0.18)`,
          }}>
            <img src={theory.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            ...TYPE.metadata,
            textTransform: 'uppercase',
            color: GOLD,
            letterSpacing: '0.08em',
          }}>
            {theory.label}
          </div>
        </div>

        {/* Context */}
        <div style={{
          ...TYPE.metadata,
          textTransform: 'uppercase',
          color: `rgba(${GOLD_RGB},0.50)`,
          animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} 60ms both`,
        }}>
          {theory.scenePrompt}
        </div>

        {/* Explanation */}
        <div style={{
          ...TYPE.body,
          color: '#F0E8D4',
          lineHeight: 1.6,
          animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} 120ms both`,
        }}>
          {theory.explanation}
        </div>

        <CTA
          label="Write the prescription"
          onClick={onStart}
          pressed={pressed}
          setPressed={setPressed}
          delay={180}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </div>
  )
}

// ── Phase: Input ──────────────────────────────────────────────────────────────

function InputPhase({ theory, tint, inputs, onChange, onCheck, pressed, setPressed, prefersReducedMotion }) {
  const inputRefs = useRef([])
  const anyFilled = inputs.some(v => v.trim().length > 0)

  return (
    <div style={{
      minHeight: '100dvh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: DARK,
    }}>
      {/* Background: selected theory's icon */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${theory.icon})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.25) saturate(0.55)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to bottom, rgba(12,9,5,0.55) 0%, rgba(12,9,5,0.75) 50%, rgba(12,9,5,0.97) 100%)`,
      }} />

      {/* Scrollable content */}
      <div style={{
        position: 'relative',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: `${SPACING.section}px ${SPACING.standard}px ${SPACING.separation}px`,
        gap: SPACING.compact,
      }}>

        {/* Theory label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.micro,
          marginBottom: SPACING.micro,
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: RADII.small,
            overflow: 'hidden',
            border: `1px solid rgba(${GOLD_RGB},0.28)`,
            flexShrink: 0,
          }}>
            <img src={theory.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            ...TYPE.metadata,
            textTransform: 'uppercase',
            color: GOLD,
            letterSpacing: '0.06em',
          }}>
            {theory.label}
          </div>
        </div>

        {/* Prompt */}
        <div style={{
          ...TYPE.cardTitle,
          color: '#F0E8D4',
          marginBottom: SPACING.micro,
          animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        }}>
          {theory.prescriptionPrompt}
        </div>

        {/* Prescription scroll */}
        <PrescriptionScroll
          theory={theory}
          inputs={inputs}
          onChange={onChange}
          inputRefs={inputRefs}
          onSubmit={onCheck}
          phase="input"
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Hint */}
        <div style={{
          ...TYPE.metadata,
          color: `rgba(${GOLD_RGB},0.40)`,
          fontStyle: 'italic',
          textAlign: 'center',
          paddingTop: SPACING.micro,
        }}>
          {theory.hint}
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
  )
}

// ── Phase: Reveal ─────────────────────────────────────────────────────────────

function RevealPhase({ theory, tint, inputs, result, revealCount, allComplete, onContinue, pressed, setPressed, prefersReducedMotion }) {
  const allRevealed = revealCount >= (result.missing?.length || 0)

  return (
    <div style={{
      minHeight: '100dvh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: DARK,
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${theory.icon})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.2) saturate(0.5)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to bottom, rgba(12,9,5,0.6) 0%, rgba(12,9,5,0.8) 50%, rgba(12,9,5,0.98) 100%)`,
      }} />

      <div style={{
        position: 'relative',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: `${SPACING.section}px ${SPACING.standard}px ${SPACING.separation}px`,
        gap: SPACING.compact,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.micro,
          marginBottom: SPACING.micro,
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: RADII.small,
            overflow: 'hidden',
            border: `1px solid rgba(${GOLD_RGB},0.35)`,
            flexShrink: 0,
          }}>
            <img src={theory.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            ...TYPE.metadata,
            textTransform: 'uppercase',
            color: GOLD,
            letterSpacing: '0.06em',
          }}>
            {theory.label}
          </div>
        </div>

        <div style={{
          ...TYPE.cardTitle,
          color: '#F0E8D4',
          marginBottom: SPACING.micro,
        }}>
          Here are the common treatments linked to this belief.
        </div>

        {/* Revealed prescription */}
        <PrescriptionScroll
          theory={theory}
          inputs={inputs}
          phase="reveal"
          result={result}
          revealCount={revealCount}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Explanation */}
        {allRevealed && (
          <div style={{
            ...TYPE.bodySmall,
            color: `rgba(245,238,217,0.65)`,
            lineHeight: 1.6,
            borderLeft: `2px solid rgba(${GOLD_RGB},0.28)`,
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

// ── Prescription scroll ───────────────────────────────────────────────────────

function PrescriptionScroll({ theory, inputs, onChange, inputRefs, phase, result, revealCount, prefersReducedMotion }) {
  const answers = theory.acceptedAnswers
  const matched = result?.matched || []
  const missing  = result?.missing  || []

  // Build display lines from matched + missing
  function buildRevealLines() {
    return answers.map((ans, i) => {
      const matchEntry = matched.find(m => m.canonical === ans.canonical)
      const missingIdx = missing.indexOf(ans.canonical)
      return { canonical: ans.canonical, matchEntry, missingIdx }
    })
  }

  const lines = phase === 'reveal' ? buildRevealLines() : null

  return (
    <div style={{
      position: 'relative',
      borderRadius: RADII.medium,
      overflow: 'hidden',
      animation: prefersReducedMotion ? 'none' : `mtp-scroll-in ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
      boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,220,120,0.18)',
    }}>
      {/* Parchment background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/figures/history/medicine/medieval/parchment-scroll.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      {/* Warm overlay to ensure legibility */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(240,220,160,0.35)',
      }} />

      {/* Content on scroll */}
      <div style={{
        position: 'relative',
        padding: `${SPACING.standard}px`,
      }}>
        {/* Rx header */}
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: '#3A2008',
          letterSpacing: '-0.02em',
          marginBottom: SPACING.compact,
          borderBottom: `1.5px solid rgba(58,32,8,0.20)`,
          paddingBottom: SPACING.micro,
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
        }}>
          <span>Rx</span>
          <span style={{
            ...TYPE.metadata,
            color: 'rgba(58,32,8,0.45)',
            fontSize: 11,
            fontStyle: 'italic',
            fontWeight: 400,
          }}>
            {theory.label}
          </span>
        </div>

        {/* Lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {phase === 'input' && answers.map((ans, i) => (
            <div key={ans.canonical} style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
              <span style={{
                ...TYPE.metadata,
                color: 'rgba(58,32,8,0.45)',
                fontWeight: 600,
                width: 20,
                flexShrink: 0,
                textAlign: 'right',
              }}>
                {i + 1}.
              </span>
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
                  borderBottom: '1.5px solid rgba(58,32,8,0.25)',
                  padding: '6px 4px 8px',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  color: '#2A1404',
                  width: '100%',
                  boxSizing: 'border-box',
                  caretColor: '#8B4A10',
                }}
              />
            </div>
          ))}

          {phase === 'reveal' && lines?.map((line, i) => {
            const isMatched = !!line.matchEntry
            const isRevealed = !isMatched && line.missingIdx >= 0 && line.missingIdx < revealCount

            return (
              <div key={line.canonical} style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
                <span style={{
                  ...TYPE.metadata,
                  color: 'rgba(58,32,8,0.45)',
                  fontWeight: 600,
                  width: 20,
                  flexShrink: 0,
                  textAlign: 'right',
                }}>
                  {i + 1}.
                </span>
                <span style={{
                  flex: 1,
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 16,
                  fontWeight: isMatched ? 500 : 400,
                  color: isMatched ? '#2A1404' : isRevealed ? '#4A2800' : 'transparent',
                  borderBottom: '1.5px solid rgba(58,32,8,0.20)',
                  padding: '6px 4px 8px',
                  minHeight: 38,
                  animation: isRevealed && !prefersReducedMotion
                    ? `mtp-ink ${MOTION.duration.slow} ${MOTION.easing.standard} both`
                    : 'none',
                  display: 'block',
                }}>
                  {isMatched ? line.matchEntry.userLine : isRevealed ? line.canonical : ''}
                </span>
                <span style={{
                  flexShrink: 0,
                  fontSize: 14,
                  color: isMatched ? '#5C8A3A' : isRevealed ? '#8B6914' : 'transparent',
                  animation: (isMatched || isRevealed) && !prefersReducedMotion
                    ? `mtp-fade-up ${MOTION.duration.standard} ${MOTION.easing.standard} both`
                    : 'none',
                }}>
                  {isMatched ? '✓' : isRevealed ? '✦' : ''}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Phase: Final ──────────────────────────────────────────────────────────────

function FinalPhase({ theories, results, finalPhase, screen, onComplete, pressed, setPressed, prefersReducedMotion }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: `linear-gradient(160deg, rgba(${GOLD_RGB},0.06) 0%, ${DARK} 50%)`,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      padding: `${SPACING.section}px ${SPACING.standard}px calc(${SPACING.separation}px + env(safe-area-inset-bottom, 0px))`,
    }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: SPACING.separation,
        animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
      }}>
        <div style={{
          ...TYPE.metadata,
          textTransform: 'uppercase',
          color: `rgba(${GOLD_RGB},0.55)`,
          marginBottom: SPACING.micro,
          letterSpacing: '0.1em',
        }}>
          The big picture
        </div>
        <div style={{
          ...TYPE.sectionTitle,
          color: '#F0E8D4',
        }}>
          Medieval medicine
        </div>
      </div>

      {/* Branches */}
      <div style={{
        display: 'flex',
        gap: SPACING.compact,
        marginBottom: SPACING.separation,
      }}>
        {theories.map((theory, i) => {
          const visible = i < finalPhase
          const theoryResult = results[theory.id] || { matched: [], missing: [] }
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
              {/* Icon */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: RADII.small,
                overflow: 'hidden',
                border: `1px solid rgba(${GOLD_RGB},0.35)`,
                margin: '0 auto 10px',
                boxShadow: visible ? `0 0 24px rgba(${GOLD_RGB},0.15)` : 'none',
                transition: `box-shadow ${MOTION.duration.slow} ${MOTION.easing.standard}`,
              }}>
                <img src={theory.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Theory name */}
              <div style={{
                ...TYPE.metadata,
                textTransform: 'uppercase',
                color: GOLD,
                textAlign: 'center',
                marginBottom: SPACING.micro,
                fontSize: 11,
                letterSpacing: '0.05em',
              }}>
                {theory.shortLabel}
              </div>

              {/* Connector */}
              <div style={{
                width: 1,
                height: 16,
                background: `rgba(${GOLD_RGB},0.30)`,
                margin: '0 auto 6px',
              }} />

              {/* Treatments */}
              <div style={{
                background: `rgba(${GOLD_RGB},0.05)`,
                border: `1px solid rgba(${GOLD_RGB},0.14)`,
                borderRadius: RADII.small,
                padding: '10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}>
                {allAnswers.map(ans => (
                  <div
                    key={ans}
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 12,
                      fontWeight: 400,
                      color: `rgba(245,238,217,0.75)`,
                      lineHeight: 1.3,
                    }}
                  >
                    {ans}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Final message */}
      {finalPhase >= theories.length && (
        <div style={{
          ...TYPE.bodySmall,
          color: `rgba(245,238,217,0.60)`,
          lineHeight: 1.65,
          textAlign: 'center',
          marginBottom: SPACING.separation,
          padding: `${SPACING.compact}px ${SPACING.compact}px`,
          borderTop: `1px solid rgba(${GOLD_RGB},0.12)`,
          paddingTop: SPACING.compact,
          animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        }}>
          {screen.finalMessage}
        </div>
      )}

      {finalPhase >= theories.length && (
        <CTA
          label="Continue"
          onClick={onComplete}
          pressed={pressed}
          setPressed={setPressed}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
    </div>
  )
}

// ── Shared CTA button ─────────────────────────────────────────────────────────

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
        height: BUTTONS.primary.height,
        borderRadius: BUTTONS.primary.borderRadius,
        background: disabled
          ? `rgba(${GOLD_RGB},0.08)`
          : `linear-gradient(135deg, ${GOLD}, rgba(${GOLD_RGB},0.72))`,
        border: disabled ? `1px solid rgba(${GOLD_RGB},0.18)` : 'none',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontFamily: "'Sora', sans-serif",
        fontSize: BUTTONS.primary.fontSize,
        fontWeight: BUTTONS.primary.fontWeight,
        color: disabled ? GOLD : '#0A0804',
        letterSpacing: '-0.02em',
        boxShadow: disabled ? 'none' : `0 4px 28px rgba(${GOLD_RGB},0.28)`,
        transition: `all ${BUTTONS.primary.transition}`,
        transform: pressed && !disabled ? `scale(${MOTION.scale.press})` : 'scale(1)',
        animation: prefersReducedMotion ? 'none' : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} ${delay}ms both`,
        marginTop: SPACING.micro,
      }}
    >
      {label}
    </button>
  )
}
