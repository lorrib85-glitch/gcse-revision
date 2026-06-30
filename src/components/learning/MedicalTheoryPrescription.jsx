import { useState, useEffect } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
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
  'god-sin':      { from: 'rgba(80,40,8,0.92)',   to: 'rgba(12,9,5,0.98)' },
  'four-humours': { from: 'rgba(70,20,10,0.92)',  to: 'rgba(12,9,5,0.98)' },
  'miasma':       { from: 'rgba(46,54,30,0.92)',  to: 'rgba(12,9,5,0.98)' },
  'astrology':    { from: 'rgba(20,20,55,0.92)',  to: 'rgba(12,9,5,0.98)' },
}

const THEORY_SYMBOLS = {
  'god-sin':      '✝',
  'four-humours': '⚖',
  'miasma':       '≋',
  'astrology':    '✦',
}

const BELIEF_HINTS = {
  'god-sin':      'Illness as punishment',
  'four-humours': 'Illness as imbalance',
  'miasma':       'Illness carried by bad air',
  'astrology':    'Illness linked to the stars',
}

const BELIEF_HEADLINES = {
  'god-sin': {
    title: 'Illness was punishment for sin',
    subtitle: 'Treatment focused on forgiveness.',
  },
  'four-humours': {
    title: 'The body was out of balance',
    subtitle: 'Treatment restored balance.',
  },
  'miasma': {
    title: 'Bad air carried disease',
    subtitle: 'Treatment purified the air.',
  },
  'astrology': {
    title: 'The stars shaped the body',
    subtitle: 'Treatment depended on timing.',
  },
}

const THEORY_IMAGES = {
  'god-sin':      '/History/Medicine/god_sin-1024.webp',
  'four-humours': '/History/Medicine/four_humours_treatment-1024.webp',
  'miasma':       '/History/Medicine/miasma-1024.webp',
  'astrology':    '/History/Medicine/astrology-1024.webp',
}

const DEFAULT_MIASMA_THEORY = {
  id: 'miasma',
  label: 'Miasma',
  shortLabel: 'Miasma',
  explanation: 'Some people believed disease spread through foul-smelling air from rotting waste, marshes, sewers and rubbish.',
  acceptedAnswers: [
    { canonical: 'Sweet-smelling herbs', accepted: ['sweet-smelling herbs', 'herbs', 'posy', 'flowers', 'pleasant smells', 'perfume'] },
    { canonical: 'Cleaning streets',     accepted: ['cleaning streets', 'clean streets', 'remove rubbish', 'remove waste', 'clear filth', 'cleaning'] },
    { canonical: 'Avoiding bad air',     accepted: ['avoid bad air', 'avoid miasma', 'move away', 'fresh air', 'ventilation', 'keep air moving'] },
  ],
}

// Per-treatment descriptions — this component is Medicine-specific so local defaults are acceptable
const TREATMENT_DETAILS = {
  'god-sin': {
    'Prayer':
      'Asking God directly for forgiveness and healing. Prayer required no physician and no money — anyone could do it anywhere.',
    'Pilgrimage':
      'Travelling to a holy site, such as Canterbury Cathedral, to seek God\'s favour. The journey itself demonstrated faith and devotion.',
    'Confession':
      'Admitting sins to a priest and receiving absolution. The Church taught that illness was often God\'s punishment for sin, so cleansing the soul could restore health.',
  },
  'four-humours': {
    'Bloodletting':
      'Removing blood using a knife, leeches, or cupping to reduce excess blood humour. Physicians used zodiac charts to choose which vein to open and when.',
    'Purging':
      'Expelling excess phlegm or bile with laxatives or emetics. Purging forced the imbalanced humour out of the body.',
    'Herbal remedies':
      'Plants were chosen for their qualities — hot, cold, wet or dry — to counteract the dominant humour. Diet changes and rest were also commonly prescribed.',
  },
  'miasma': {
    'Sweet-smelling herbs':
      'Carrying flowers, herbs or a posy was thought to protect people by replacing foul air with cleaner, sweeter smells.',
    'Cleaning streets':
      'Removing rotting waste and filth made sense under miasma theory because bad smells were believed to carry disease.',
    'Avoiding bad air':
      'People tried to avoid marshes, sewers and rubbish heaps, or keep air moving, because still foul air was seen as dangerous.',
  },
  'astrology': {
    'Astrology charts':
      'Medieval physicians consulted zodiac charts to identify which organ was affected. Each star sign was linked to a specific part of the body.',
    'Treatment at the right time':
      'Surgery, bloodletting, or medicine was delayed until the planets were in a favourable position. Timing was considered as important as the treatment itself.',
  },
}

const CSS = `
  @keyframes mtp-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mtp-slide-up {
    from { transform: translateY(40px); opacity: 0.6; }
    to   { transform: translateY(0);  opacity: 1; }
  }
  @keyframes mtp-panel-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mtp-tabs::-webkit-scrollbar { display: none; }
`

function sentenceCase(value = '') {
  const cleaned = String(value).replace(/\s+/g, ' ').trim().toLowerCase()
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : cleaned
}

function withMiasmaTheory(theories = []) {
  if (theories.some(theory => theory.id === 'miasma')) return theories

  const astrologyIndex = theories.findIndex(theory => theory.id === 'astrology')
  if (astrologyIndex === -1) return [...theories, DEFAULT_MIASMA_THEORY]

  return [
    ...theories.slice(0, astrologyIndex),
    DEFAULT_MIASMA_THEORY,
    ...theories.slice(astrologyIndex),
  ]
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MedicalTheoryPrescription({ screen, onComplete }) {
  const theories = withMiasmaTheory(screen.theories || [])

  const [phase,              setPhase]             = useState('select')
  const [activeId,           setActiveId]           = useState(null)
  const [completedIds,       setCompletedIds]       = useState([])
  const [activeTreatmentIdx, setActiveTreatmentIdx] = useState(0)
  const [finalPhase,         setFinalPhase]         = useState(0)

  const activeTheory = theories.find(t => t.id === activeId)
  const tint = THEORY_TINTS[activeId] || THEORY_TINTS['god-sin']

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (phase !== 'final') return
    if (finalPhase >= theories.length) return
    const t = setTimeout(() => setFinalPhase(p => p + 1), 600)
    return () => clearTimeout(t)
  }, [phase, finalPhase, theories.length])

  function openBelief(id) {
    setActiveId(id)
    setActiveTreatmentIdx(0)
    setPhase('view')
  }

  function closeView() {
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

  const isLastBelief =
    !completedIds.includes(activeId) &&
    completedIds.length + 1 === theories.length

  if (phase === 'select') return (
    <SelectPhase
      theories={theories}
      completedIds={completedIds}
      onSelect={openBelief}
      prefersReducedMotion={prefersReducedMotion}
    />
  )

  if (phase === 'view' && activeTheory) return (
    <ViewPhase
      theory={activeTheory}
      tint={tint}
      activeTreatmentIdx={activeTreatmentIdx}
      onSelectTreatment={setActiveTreatmentIdx}
      onContinue={closeView}
      isLast={isLastBelief}
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
          Pick a belief to explore the treatments it led to.
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
              onClick={() => onSelect(theory.id)}
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
  const symbol    = THEORY_SYMBOLS[theory.id] || '◆'
  const hint      = BELIEF_HINTS[theory.id]

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.compact,
        width: '100%',
        padding: `${SPACING.compact}px`,
        textAlign: 'left',
        cursor: 'pointer',
        border: `1px solid rgba(${THEME.accentRgb},${done ? '0.34' : '0.16'})`,
        borderRadius: RADII.large,
        background: done
          ? `linear-gradient(145deg, rgba(${THEME.accentRgb},0.10), rgba(${THEME.parchmentRgb},0.04))`
          : `rgba(${THEME.parchmentRgb},0.04)`,
        boxShadow: done ? `0 0 22px rgba(${THEME.accentRgb},0.10)` : 'none',
        transition: `transform ${MOTION.duration.standard} ${MOTION.easing.standard}, border-color ${MOTION.duration.standard} ${MOTION.easing.standard}`,
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
        background: done
          ? `rgba(${THEME.accentRgb},0.18)`
          : `rgba(${THEME.accentRgb},0.10)`,
        border: `1px solid rgba(${THEME.accentRgb},0.30)`,
        boxShadow: done ? `0 0 18px rgba(${THEME.accentRgb},0.16)` : 'none',
        fontSize: 20,
        color: THEME.accent,
      }}>
        {done ? '✓' : symbol}
      </span>

      <span style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 0 }}>
        <span style={{ ...TYPE.cardTitle, color: THEME.text }}>
          {sentenceCase(theory.shortLabel || theory.label)}
        </span>
        {hint && (
          <span style={{
            ...TYPE.bodySmall,
            color: done ? THEME.accent : THEME.textMuted,
            lineHeight: 1.25,
          }}>
            {done ? 'Explored' : hint}
          </span>
        )}
      </span>

      <span style={{ color: THEME.textFaint, fontSize: 18, flexShrink: 0 }}>›</span>
    </button>
  )
}

// ── Phase: View (overlay card with treatment tabs) ────────────────────────────

function ViewPhase({
  theory, tint, activeTreatmentIdx, onSelectTreatment,
  onContinue, prefersReducedMotion,
}) {
  const headline    = BELIEF_HEADLINES[theory.id] || { title: sentenceCase(theory.label), subtitle: '' }
  const image       = THEORY_IMAGES[theory.id] || theory.icon
  const treatments  = theory.acceptedAnswers.map(a => a.canonical)
  const details     = TREATMENT_DETAILS[theory.id] || {}
  const activeLabel = treatments[activeTreatmentIdx]
  const detail      = details[activeLabel] || ''

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      background: 'rgba(0,0,0,0.72)',
      padding: `calc(72px + ${SPACING.micro}px) ${SPACING.standard}px calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
      boxSizing: 'border-box',
      overflowY: 'auto',
    }}>
      <style>{CSS}</style>

      {/* ── Focused belief card ───────────────────────────────────────────── */}
      <div style={{
        borderRadius: RADII.large,
        overflow: 'hidden',
        background: THEME.surfaceRaised,
        border: `1px solid rgba(${THEME.accentRgb},0.18)`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.38), 0 0 30px rgba(${THEME.accentRgb},0.07)`,
        animation: prefersReducedMotion
          ? 'none'
          : `mtp-slide-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
      }}>

        {/* Cinematic image header */}
        <div style={{
          position: 'relative',
          height: 260,
          overflow: 'hidden',
          background: `linear-gradient(160deg, ${tint.from} 0%, rgba(12,9,5,0.97) 100%)`,
        }}>
          {image && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.68) saturate(0.92)',
              opacity: 0.98,
            }} />
          )}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: [
              'linear-gradient(180deg, rgba(12,9,5,0.04) 0%, rgba(12,9,5,0.16) 42%, rgba(21,16,10,0.88) 100%)',
              'radial-gradient(circle at 50% 10%, rgba(245,238,217,0.10), transparent 48%)',
            ].join(', '),
          }} />

          {/* Belief headline at bottom of image */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: `0 ${SPACING.standard}px ${SPACING.standard}px`,
          }}>
            <div style={{
              ...TYPE.cardTitle,
              color: THEME.text,
              maxWidth: 520,
              lineHeight: 1.12,
            }}>
              {headline.title}
            </div>
            {headline.subtitle && (
              <div style={{
                ...TYPE.bodySmall,
                color: THEME.textMuted,
                marginTop: SPACING.micro,
                lineHeight: 1.45,
              }}>
                {headline.subtitle}
              </div>
            )}
          </div>
        </div>

        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${THEME.accentRgb},0.34), transparent)`,
        }} />

        {/* Brief belief explanation */}
        <div style={{
          padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.compact}px`,
        }}>
          <p style={{
            ...TYPE.bodySmall,
            color: THEME.textMuted,
            margin: 0,
            lineHeight: 1.6,
          }}>
            {theory.explanation}
          </p>
        </div>

        {/* ── Treatment tabs ──────────────────────────────────────────────── */}
        <div
          className="mtp-tabs"
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            padding: `0 ${SPACING.standard}px`,
            gap: SPACING.micro,
          }}
        >
          {treatments.map((treatment, i) => (
            <TreatmentTab
              key={treatment}
              label={treatment}
              active={i === activeTreatmentIdx}
              onClick={() => onSelectTreatment(i)}
            />
          ))}
        </div>

        {/* ── Treatment content panel ────────────────────────────────────── */}
        <div
          key={activeTreatmentIdx}
          style={{
            padding: `${SPACING.compact}px ${SPACING.standard}px ${SPACING.standard}px`,
            minHeight: 108,
            animation: prefersReducedMotion
              ? 'none'
              : `mtp-panel-in ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
          }}
        >
          <div style={{
            ...TYPE.bodySmall,
            color: THEME.textMuted,
            lineHeight: 1.7,
          }}>
            {detail}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: `${SPACING.micro}px ${SPACING.standard}px ${SPACING.standard}px` }}>
          <ContinueCTA
            onClick={onContinue}
            accent={THEME.accent}
            style={{
              animation: prefersReducedMotion
                ? 'none'
                : `mtp-fade-up ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function TreatmentTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: '1 0 auto',
        padding: '10px 12px 9px',
        background: 'transparent',
        border: 'none',
        borderBottom: `2px solid ${active ? THEME.accent : 'transparent'}`,
        color: active ? THEME.accent : THEME.textFaint,
        ...TYPE.metadata,
        fontWeight: active ? 700 : undefined,
        letterSpacing: '0.02em',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: [
          `color ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          `border-color ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        ].join(', '),
      }}
    >
      {label}
    </button>
  )
}

// ── Phase: Final ──────────────────────────────────────────────────────────────

function FinalPhase({ theories, finalPhase, screen, onComplete, prefersReducedMotion }) {
  const finalMessage = screen.finalMessage?.includes('miasma')
    ? screen.finalMessage
    : 'Medieval medicine mixed religion, ancient Greek ideas, miasma and astrology. Most people believed several explanations at the same time.'

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
        marginBottom: SPACING.compact,
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
          Beliefs shaped treatments.
        </p>
      </header>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.micro,
        marginBottom: SPACING.compact,
      }}>
        {theories.map((theory, i) => {
          const visible = i < finalPhase
          const symbol  = THEORY_SYMBOLS[theory.id] || '◆'
          const hint    = BELIEF_HINTS[theory.id]
          const treatments = theory.acceptedAnswers.map(ans => ans.canonical).join(' · ')

          return (
            <div
              key={theory.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: SPACING.compact,
                padding: `${SPACING.compact}px`,
                borderRadius: RADII.large,
                background: `rgba(${THEME.parchmentRgb},0.035)`,
                border: `1px solid rgba(${THEME.accentRgb},0.14)`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(14px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : `opacity ${MOTION.duration.slow} ${MOTION.easing.standard}, transform ${MOTION.duration.slow} ${MOTION.easing.standard}`,
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `rgba(${THEME.accentRgb},0.12)`,
                border: `1px solid rgba(${THEME.accentRgb},0.30)`,
                fontSize: 18,
                color: THEME.accent,
                boxShadow: visible ? `0 0 18px rgba(${THEME.accentRgb},0.12)` : 'none',
              }}>
                {symbol}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ ...TYPE.cardTitle, color: THEME.text, lineHeight: 1.18 }}>
                  {sentenceCase(theory.shortLabel)}
                </div>
                <div style={{
                  ...TYPE.captionText,
                  color: THEME.accent,
                  marginTop: 5,
                  lineHeight: 1.35,
                }}>
                  {hint}
                </div>
                <div style={{
                  ...TYPE.captionText,
                  color: THEME.textMuted,
                  marginTop: 6,
                  lineHeight: 1.35,
                }}>
                  {treatments}
                </div>
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
          {finalMessage}
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
