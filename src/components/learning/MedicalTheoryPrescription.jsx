import { useState, useEffect, useMemo } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { BUTTONS } from '../../constants/buttons.js'
import { SUBJECTS } from '../../constants/subjects.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import ContentShell from '../layout/ContentShell.jsx'

// ── Design tokens ─────────────────────────────────────────────────────────────

const THEME = {
  surface:      '#0C0905',
  surfaceRaised:'#15100A',
  text:         '#F5EED9',
  textMuted:    'rgba(245,238,217,0.62)',
  textFaint:    'rgba(245,238,217,0.38)',
  accent:       SUBJECTS.History.accent,
  accentRgb:    SUBJECTS.History.accentRgb,
  parchment:    '#F0E0B0',
  parchmentRgb: '240,224,176',
}

const THEORY_TINTS = {
  'god-sin':      { from: 'rgba(80,40,8,0.90)',  to: 'rgba(12,9,5,0.98)' },
  'four-humours': { from: 'rgba(70,20,10,0.90)', to: 'rgba(12,9,5,0.98)' },
  'astrology':    { from: 'rgba(20,20,55,0.90)', to: 'rgba(12,9,5,0.98)' },
}

const ROLE_LABELS = {
  'god-sin':      'Priest',
  'four-humours': 'Physician',
  'astrology':    'Astrologer',
}

const THEORY_SYMBOLS = {
  'god-sin':      '✝',
  'four-humours': '⚖',
  'astrology':    '✦',
}

const TREATMENT_LOGIC = {
  'god-sin':      'So treatment focused on the soul: prayer, confession, or pilgrimage.',
  'four-humours': 'So treatment tried to rebalance the body through bleeding, purging, or diet.',
  'astrology':    'So treatment meant checking the stars and choosing the right time.',
}

const CSS = `
  @keyframes mtp-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mtp-chip-in {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes mtp-symbol-pulse {
    0%, 100% { opacity: 0.17; }
    50%       { opacity: 0.28; }
  }
`

function sentenceCase(value = '') {
  const cleaned = String(value).replace(/\s+/g, ' ').trim().toLowerCase()
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : cleaned
}

// Pool of all canonical treatment names across every theory, sorted alphabetically
function buildChipPool(theories) {
  const seen = new Set()
  const chips = []
  for (const t of theories) {
    for (const ans of t.acceptedAnswers) {
      if (!seen.has(ans.canonical)) {
        seen.add(ans.canonical)
        chips.push(ans.canonical)
      }
    }
  }
  return chips.sort((a, b) => a.localeCompare(b))
}

function checkChips(selected, theory) {
  const correctSet = new Set(theory.acceptedAnswers.map(a => a.canonical))
  return {
    correct:   selected.filter(c =>  correctSet.has(c)),
    incorrect: selected.filter(c => !correctSet.has(c)),
    missed:    [...correctSet].filter(c => !selected.includes(c)),
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MedicalTheoryPrescription({ screen, onComplete }) {
  const theories = screen.theories || []

  const [phase,         setPhase]         = useState('select')
  const [activeId,      setActiveId]      = useState(null)
  const [completedIds,  setCompletedIds]  = useState([])
  const [selectedChips, setSelectedChips] = useState([])
  const [chipResult,    setChipResult]    = useState(null)
  const [revealCount,   setRevealCount]   = useState(0)
  const [finalPhase,    setFinalPhase]    = useState(0)
  const [pressed,       setPressed]       = useState(false)

  const activeTheory = theories.find(t => t.id === activeId)
  const tint = THEORY_TINTS[activeId] || THEORY_TINTS['god-sin']

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Chip pool is the same for every theory — all treatments pooled and sorted
  const chipPool = useMemo(() => buildChipPool(theories), [theories])

  // Animate missed chips in one by one
  useEffect(() => {
    if (phase !== 'reveal' || !chipResult) return
    if (revealCount >= chipResult.missed.length) return
    const t = setTimeout(() => setRevealCount(c => c + 1), 700)
    return () => clearTimeout(t)
  }, [phase, revealCount, chipResult])

  // Stagger the final summary columns
  useEffect(() => {
    if (phase !== 'final') return
    if (finalPhase >= theories.length) return
    const t = setTimeout(() => setFinalPhase(p => p + 1), 600)
    return () => clearTimeout(t)
  }, [phase, finalPhase, theories.length])

  function selectTheory(id) {
    setActiveId(id)
    setSelectedChips([])
    setChipResult(null)
    setPhase('chips')
  }

  function toggleChip(canonical) {
    setSelectedChips(prev =>
      prev.includes(canonical)
        ? prev.filter(c => c !== canonical)
        : [...prev, canonical]
    )
  }

  function checkPrescription() {
    setChipResult(checkChips(selectedChips, activeTheory))
    setRevealCount(0)
    setPhase('reveal')
  }

  function finishReveal() {
    const next = completedIds.includes(activeId)
      ? completedIds
      : [...completedIds, activeId]
    setCompletedIds(next)
    if (next.length === theories.length) {
      setPhase('final')
      setFinalPhase(0)
    } else {
      setActiveId(null)
      setPhase('select')
    }
  }

  if (phase === 'select') return (
    <SelectPhase
      theories={theories}
      completedIds={completedIds}
      onSelect={selectTheory}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'chips') return (
    <ChipsPhase
      theory={activeTheory}
      tint={tint}
      chipPool={chipPool}
      selectedChips={selectedChips}
      onToggleChip={toggleChip}
      onCheck={checkPrescription}
      pressed={pressed}
      setPressed={setPressed}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'reveal') return (
    <RevealPhase
      theory={activeTheory}
      chipPool={chipPool}
      chipResult={chipResult}
      selectedChips={selectedChips}
      revealCount={revealCount}
      allComplete={
        !completedIds.includes(activeId) &&
        completedIds.length + 1 === theories.length
      }
      onContinue={finishReveal}
      pressed={pressed}
      setPressed={setPressed}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'final') return (
    <FinalPhase
      theories={theories}
      finalPhase={finalPhase}
      screen={screen}
      onComplete={onComplete}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  return null
}

// ── Phase: Select ─────────────────────────────────────────────────────────────

function SelectPhase({ theories, completedIds, onSelect, prefersReducedMotion }) {
  return (
    <ContentShell subject="History">
      <style>{CSS}</style>

      <div style={{
        marginBottom: SPACING.compact,
        animation: prefersReducedMotion
          ? 'none'
          : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
      }}>
        <h1 style={{ ...TYPE.screenHeading, color: THEME.text, margin: 0 }}>
          How did people explain illness?
        </h1>
        <p style={{
          ...TYPE.bodyLarge,
          color: THEME.textMuted,
          margin: `${SPACING.compact}px 0 0`,
        }}>
          Pick a belief, then choose the treatments that would make sense.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
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
  const roleLabel = ROLE_LABELS[theory.id]
  const symbol    = THEORY_SYMBOLS[theory.id] || '◆'

  return (
    <button
      onClick={onClick}
      onPointerDown={() => !done && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.compact,
        width: '100%',
        padding: `${SPACING.compact}px`,
        textAlign: 'left',
        cursor: done ? 'default' : 'pointer',
        border: `1px solid rgba(${THEME.accentRgb},${done ? '0.24' : '0.16'})`,
        borderRadius: RADII.large,
        background: `rgba(${THEME.parchmentRgb},0.04)`,
        opacity: done ? 0.66 : 1,
        transition: `transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        transform: pressed ? `scale(${MOTION.scale.press})` : 'scale(1)',
        animation: prefersReducedMotion
          ? 'none'
          : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} ${delay}ms both`,
      }}
    >
      <span style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `rgba(${THEME.accentRgb},0.10)`,
        border: `1px solid rgba(${THEME.accentRgb},0.24)`,
        fontSize: 20,
        color: done ? THEME.textFaint : THEME.accent,
      }}>
        {done ? '✓' : symbol}
      </span>

      <span style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
        <span style={{ ...TYPE.cardTitle, color: done ? THEME.textFaint : THEME.text }}>
          {sentenceCase(theory.shortLabel || theory.label)}
        </span>
        {roleLabel && (
          <span style={{
            ...TYPE.metadata,
            color: done ? THEME.textFaint : THEME.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {roleLabel}
          </span>
        )}
      </span>

      <span style={{ color: THEME.textFaint, fontSize: 18, flexShrink: 0 }}>
        {done ? '' : '›'}
      </span>
    </button>
  )
}

// ── Phase: Chips ──────────────────────────────────────────────────────────────

function ChipsPhase({
  theory, tint, chipPool, selectedChips,
  onToggleChip, onCheck, pressed, setPressed, prefersReducedMotion,
}) {
  const roleLabel    = ROLE_LABELS[theory.id] || 'Healer'
  const symbol       = THEORY_SYMBOLS[theory.id] || '✦'
  const correctCount = theory.acceptedAnswers.length

  return (
    <ContentShell subject="History">
      <style>{CSS}</style>

      {/* ── Belief card ───────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: RADII.large,
        overflow: 'hidden',
        border: `1px solid rgba(${THEME.accentRgb},0.18)`,
        background: THEME.surfaceRaised,
        marginBottom: SPACING.compact,
        animation: prefersReducedMotion
          ? 'none'
          : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
      }}>
        {/* Atmospheric top — 38% of a typical card */}
        <div style={{
          position: 'relative',
          height: 185,
          overflow: 'hidden',
          background: `linear-gradient(160deg, ${tint.from} 0%, rgba(12,9,5,0.97) 100%)`,
        }}>
          {theory.icon && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${theory.icon})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.22) saturate(0.55)',
              opacity: 0.65,
            }} />
          )}
          {/* Bottom fade into card body */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 25%, rgba(21,16,10,0.96) 100%)',
          }} />
          {/* Large atmospheric glyph */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            <span style={{
              fontSize: 76,
              color: THEME.parchment,
              lineHeight: 1,
              animation: prefersReducedMotion
                ? 'none'
                : 'mtp-symbol-pulse 4s ease-in-out infinite',
            }}>
              {symbol}
            </span>
          </div>
          {/* Role badge — bottom-left */}
          <div style={{
            position: 'absolute',
            bottom: SPACING.compact,
            left: SPACING.compact,
          }}>
            <span style={{
              ...TYPE.metadata,
              color: THEME.accent,
              background: `rgba(${THEME.accentRgb},0.14)`,
              border: `1px solid rgba(${THEME.accentRgb},0.32)`,
              borderRadius: RADII.small,
              padding: '4px 12px',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}>
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div style={{
          padding: `${SPACING.compact}px ${SPACING.standard}px ${SPACING.standard}px`,
        }}>
          <div style={{ ...TYPE.cardTitle, color: THEME.text, marginBottom: 8 }}>
            {sentenceCase(theory.label)}
          </div>
          <div style={{
            ...TYPE.bodySmall,
            color: THEME.textMuted,
            lineHeight: 1.65,
            marginBottom: SPACING.compact,
          }}>
            {theory.explanation}
          </div>

          {/* ── Treatment chips ───────────────────────────────────────────── */}
          <div style={{
            borderTop: `1px solid rgba(${THEME.accentRgb},0.14)`,
            paddingTop: SPACING.compact,
          }}>
            {TREATMENT_LOGIC[theory.id] && (
              <div style={{
                ...TYPE.bodySmall,
                color: THEME.textMuted,
                fontStyle: 'italic',
                lineHeight: 1.55,
                marginBottom: SPACING.compact,
              }}>
                {TREATMENT_LOGIC[theory.id]}
              </div>
            )}
            <div style={{
              ...TYPE.metadata,
              color: THEME.textFaint,
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}>
              Which treatments match this belief?
            </div>
            <div style={{
              ...TYPE.metadata,
              color: THEME.textFaint,
              marginBottom: 12,
              letterSpacing: '0.04em',
            }}>
              Choose {correctCount}.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {chipPool.map((canonical, i) => (
                <TreatmentChip
                  key={canonical}
                  label={canonical}
                  selected={selectedChips.includes(canonical)}
                  onToggle={() => onToggleChip(canonical)}
                  delay={i * 35}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <CTA
        label="Check choices"
        onClick={onCheck}
        disabled={selectedChips.length === 0}
        pressed={pressed}
        setPressed={setPressed}
        prefersReducedMotion={prefersReducedMotion}
      />
    </ContentShell>
  )
}

function TreatmentChip({ label, selected, onToggle, delay, prefersReducedMotion }) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={onToggle}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        padding: '8px 14px',
        borderRadius: RADII.medium,
        border: selected
          ? `1.5px solid ${THEME.accent}`
          : `1px solid rgba(${THEME.accentRgb},0.22)`,
        background: selected
          ? `rgba(${THEME.accentRgb},0.16)`
          : `rgba(${THEME.parchmentRgb},0.035)`,
        color: selected ? THEME.text : THEME.textMuted,
        ...TYPE.bodySmall,
        fontWeight: selected ? 600 : TYPE.bodySmall?.fontWeight,
        cursor: 'pointer',
        transition: [
          `border-color ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          `background ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          `color ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        ].join(', '),
        transform: pressed ? `scale(${MOTION.scale.press})` : 'scale(1)',
        animation: prefersReducedMotion
          ? 'none'
          : `mtp-chip-in ${MOTION.duration.slow} ${MOTION.easing.standard} ${delay}ms both`,
      }}
    >
      {label}
    </button>
  )
}

// ── Phase: Reveal ─────────────────────────────────────────────────────────────

function RevealPhase({
  theory, chipPool, chipResult, selectedChips, revealCount,
  allComplete, onContinue, pressed, setPressed, prefersReducedMotion,
}) {
  const { correct = [], incorrect = [], missed = [] } = chipResult || {}
  const allRevealed = revealCount >= missed.length
  const correctSet  = new Set(theory.acceptedAnswers.map(a => a.canonical))

  return (
    <ContentShell subject="History">
      <style>{CSS}</style>

      <div style={{
        marginBottom: SPACING.compact,
        animation: prefersReducedMotion
          ? 'none'
          : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
      }}>
        <div style={{ ...TYPE.cardTitle, color: THEME.text, marginBottom: 6 }}>
          {sentenceCase(theory.label)}
        </div>
        <div style={{ ...TYPE.bodySmall, color: THEME.textMuted }}>
          Here are the treatments linked to this belief.
        </div>
      </div>

      {/* Results chip grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.compact }}>
        {chipPool.map((canonical) => {
          const wasSelected  = selectedChips.includes(canonical)
          const isCorrect    = correctSet.has(canonical)
          const missedIdx    = missed.indexOf(canonical)
          const isMissedNow  = missedIdx >= 0 && missedIdx < revealCount

          let state
          if      (wasSelected && isCorrect)  state = 'correct'
          else if (wasSelected && !isCorrect) state = 'incorrect'
          else if (isMissedNow)               state = 'missed'
          else                                state = 'neutral'

          if (state === 'neutral') return null

          return (
            <RevealChip
              key={canonical}
              label={canonical}
              state={state}
              prefersReducedMotion={prefersReducedMotion}
            />
          )
        })}
      </div>

      {/* Score line */}
      <div style={{
        ...TYPE.metadata,
        color: correct.length === theory.acceptedAnswers.length
          ? '#A8D68A'
          : THEME.textFaint,
        marginBottom: SPACING.compact,
      }}>
        {correct.length} of {theory.acceptedAnswers.length} correct
        {incorrect.length > 0 && ` · ${incorrect.length} wrong`}
      </div>

      {/* Explanation — appears after all missed items are revealed */}
      {allRevealed && theory.revealExplanation && (
        <div style={{
          ...TYPE.bodySmall,
          color: THEME.textMuted,
          lineHeight: 1.65,
          borderLeft: `2px solid rgba(${THEME.accentRgb},0.32)`,
          paddingLeft: SPACING.compact,
          marginBottom: SPACING.compact,
          animation: prefersReducedMotion
            ? 'none'
            : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
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
    </ContentShell>
  )
}

function RevealChip({ label, state, prefersReducedMotion }) {
  const S = {
    correct: {
      border: '1.5px solid #5C8A3A',
      background: 'rgba(92,138,58,0.14)',
      color: '#A8D68A',
      prefix: '✓ ',
      weight: 600,
    },
    incorrect: {
      border: '1px solid rgba(180,60,40,0.36)',
      background: 'rgba(180,60,40,0.07)',
      color: 'rgba(245,238,217,0.28)',
      textDecoration: 'line-through',
      prefix: '',
      weight: undefined,
    },
    missed: {
      border: `1.5px solid ${THEME.accent}`,
      background: `rgba(${THEME.accentRgb},0.13)`,
      color: THEME.accent,
      prefix: '✦ ',
      weight: 600,
    },
  }
  const s = S[state]

  return (
    <div style={{
      padding: '8px 14px',
      borderRadius: RADII.medium,
      ...TYPE.bodySmall,
      fontWeight: s.weight,
      border: s.border,
      background: s.background,
      color: s.color,
      textDecoration: s.textDecoration,
      animation: state === 'missed' && !prefersReducedMotion
        ? `mtp-chip-in ${MOTION.duration.slow} ${MOTION.easing.standard} both`
        : 'none',
    }}>
      {s.prefix}{label}
    </div>
  )
}

// ── Phase: Final ──────────────────────────────────────────────────────────────

function FinalPhase({ theories, finalPhase, screen, onComplete, prefersReducedMotion }) {
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
        animation: prefersReducedMotion
          ? 'none'
          : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
      }}>
        <div style={{ ...TYPE.sectionHeading, color: THEME.text }}>
          Medieval medicine
        </div>
        <p style={{
          ...TYPE.bodySmall,
          color: THEME.textMuted,
          margin: `${SPACING.micro}px auto 0`,
          maxWidth: 320,
        }}>
          Different causes created different treatments.
        </p>
      </header>

      <div style={{ display: 'flex', gap: SPACING.compact, marginBottom: SPACING.separation }}>
        {theories.map((theory, i) => {
          const visible = i < finalPhase
          const symbol  = THEORY_SYMBOLS[theory.id] || '◆'

          return (
            <div
              key={theory.id}
              style={{
                flex: 1,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(14px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : `opacity ${MOTION.duration.slow} ${MOTION.easing.standard}, transform ${MOTION.duration.slow} ${MOTION.easing.standard}`,
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                background: `rgba(${THEME.accentRgb},0.12)`,
                border: `1px solid rgba(${THEME.accentRgb},0.32)`,
                fontSize: 20,
                color: THEME.accent,
                boxShadow: visible ? `0 0 20px rgba(${THEME.accentRgb},0.14)` : 'none',
              }}>
                {symbol}
              </div>

              <div style={{
                ...TYPE.metadata,
                color: THEME.accent,
                textAlign: 'center',
                marginBottom: SPACING.micro,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {sentenceCase(theory.shortLabel)}
              </div>

              <div style={{
                width: 1,
                height: 14,
                background: `rgba(${THEME.accentRgb},0.28)`,
                margin: '0 auto 6px',
              }} />

              <div style={{
                background: `rgba(${THEME.accentRgb},0.05)`,
                border: `1px solid rgba(${THEME.accentRgb},0.14)`,
                borderRadius: RADII.small,
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}>
                {theory.acceptedAnswers.map(ans => (
                  <div key={ans.canonical} style={{
                    ...TYPE.captionText,
                    color: 'rgba(245,238,217,0.72)',
                  }}>
                    {ans.canonical}
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
          borderTop: `1px solid rgba(${THEME.accentRgb},0.12)`,
          paddingTop: SPACING.compact,
          animation: prefersReducedMotion
            ? 'none'
            : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
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
            animation: prefersReducedMotion
              ? 'none'
              : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
          }}
        />
      )}
    </div>
  )
}

// ── Shared: CTA button ────────────────────────────────────────────────────────

function CTA({ label, onClick, disabled = false, pressed, setPressed, prefersReducedMotion }) {
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
        animation: prefersReducedMotion
          ? 'none'
          : `mtp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
        marginTop: SPACING.micro,
      }}
    >
      {label}
    </button>
  )
}
