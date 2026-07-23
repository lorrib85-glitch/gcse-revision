import { useState, useEffect, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING, COMPONENT_SIZE } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
import CinematicDivider from '../core/CinematicDivider.jsx'
import { useInlineNavigationOwner } from '../core/InlineNavigationContext.jsx'
import {
  isPeopleVariant,
  buildPeopleSteps,
  deriveVisibleState,
  revealedComparisonCount,
} from './theoryComparePeople.js'

let stylesInjected = false
function ensureStyles() {
  if (stylesInjected) return
  stylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes tcb-fade-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(el)
}

// ─── theoryCompare — default export (routes between variants) ──────────────
export default function TheoryCompareBlock({ block, subject = 'Biology', onComplete }) {
  if (isPeopleVariant(block)) {
    return <PeopleCompareBlock block={block} subject={subject} onComplete={onComplete} />
  }
  return <SimpleCompareBlock block={block} subject={subject} />
}

// ─── Simple variant — unchanged, backwards-compatible ─────────────────────
// old → new position comparison with staggered fade-in (e.g. Black Death
// "what people believed" → "what was actually happening"). Do not alter its
// data shape or behaviour; existing content depends on it.
function SimpleCompareBlock({ block, subject }) {
  const subj   = SUBJECTS[subject] || SUBJECTS.Biology
  const accent = subj.accent
  const rgb    = subj.accentRgb

  const [newVisible,      setNewVisible]      = useState(false)
  const [takeawayVisible, setTakeawayVisible] = useState(false)

  useEffect(() => { ensureStyles() }, [])

  return (
    <div style={{ margin: '14px 0' }}>
      {/* Optional block title */}
      {block.title && (
        <div style={{
          ...TYPE.eyebrow,
          textTransform: 'uppercase',
          color: `rgba(${rgb},0.72)`,
          marginBottom: 20,
        }}>
          {block.title}
        </div>
      )}

      {/* Old section */}
      <div style={{ marginBottom: newVisible ? 0 : 28 }}>
        <div style={{
          ...TYPE.eyebrow,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.38)',
          marginBottom: 10,
        }}>
          {block.oldLabel}
        </div>
        <div style={{
          ...TYPE.displayHero,
          fontSize: 26,
          color: 'rgba(245,245,245,0.58)',
          marginBottom: 14,
        }}>
          {block.oldTitle}
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(block.oldPoints || []).map((pt, i) => (
            <li key={i} style={{
              ...TYPE.bodyStrong,
              color: 'rgba(245,245,245,0.52)',
              paddingLeft: 0,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.22)', marginRight: 8 }}>—</span>{pt}
            </li>
          ))}
        </ul>
      </div>

      {/* Continue button — shown while new section is hidden */}
      {!newVisible && (
        <button
          onClick={() => setNewVisible(true)}
          style={{
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer',
            ...TYPE.eyebrow,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.42)',
            marginTop: 4,
          }}
        >
          Continue ↓
        </button>
      )}

      {/* Divider + new section */}
      {newVisible && (
        <>
          <div style={{
            height: 1,
            background: `rgba(${rgb},0.15)`,
            margin: '24px 0',
            animation: 'tcb-fade-up 400ms ease both',
          }} />
          <div
            style={{ animation: 'tcb-fade-up 400ms ease both' }}
            onAnimationEnd={() => setTakeawayVisible(true)}
          >
            <div style={{
              ...TYPE.eyebrow,
              textTransform: 'uppercase',
              color: `rgba(${rgb},0.82)`,
              marginBottom: 10,
            }}>
              {block.newLabel}
            </div>
            <div style={{
              ...TYPE.displayHero,
              fontSize: 26,
              color: accent,
              marginBottom: 14,
            }}>
              {block.newTitle}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(block.newPoints || []).map((pt, i) => (
                <li key={i} style={{
                  ...TYPE.bodyStrong,
                  color: 'rgba(245,245,245,0.75)',
                }}>
                  <span style={{ color: `rgba(${rgb},0.55)`, marginRight: 8 }}>—</span>{pt}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Takeaway */}
      {takeawayVisible && block.takeaway && (
        <div style={{
          marginTop: 28,
          ...TYPE.displayCard,
          fontSize: 17,
          color: accent,
          animation: 'tcb-fade-up 400ms ease both',
        }}>
          {block.takeaway}
        </div>
      )}
    </div>
  )
}

// ─── People variant — person-to-person comparison ─────────────────────────
// One comparison theme is visible at a time. The hero and shared progress stay
// stable; Continue swaps in the next complete comparison and moves focus to it.
const PEOPLE_HERO_SIZE = {
  height: '30vh',
  minHeight: 200,
  maxHeight: 340,
}

const EMPHASIS_SIDES = new Set(['left', 'right', 'none'])

function resolveEmphasisSide(value) {
  return EMPHASIS_SIDES.has(value) ? value : 'none'
}

let peopleStylesInjected = false
function ensurePeopleStyles() {
  if (peopleStylesInjected) return
  peopleStylesInjected = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes tcp-fade-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .tcp-anim { animation: tcp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both; }
    .tcp-sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
    }
    .tcp-reveal-target:focus-visible {
      outline: ${COMPONENT_SIZE.focusRing}px solid var(--tcp-accent);
      outline-offset: ${COMPONENT_SIZE.focusOffset}px;
    }
    @media (prefers-reduced-motion: reduce) {
      .tcp-anim { animation: none !important; }
    }
  `
  document.head.appendChild(el)
}

function PeopleCompareBlock({ block, subject, onComplete }) {
  const subj   = SUBJECTS[subject] || SUBJECTS.History
  const accent = subj.accent
  const rgb    = subj.accentRgb

  const left  = block.leftPerson  || {}
  const right = block.rightPerson || {}
  const comparisons = Array.isArray(block.comparisons) ? block.comparisons : []
  const defaultEmphasisSide = resolveEmphasisSide(block.emphasisSide)

  const steps = buildPeopleSteps(block)
  const [revealed, setRevealed] = useState(steps.length > 0 ? 1 : 0)
  const continueModule = useInlineNavigationOwner(true)

  const view = deriveVisibleState(block, steps, revealed)
  const activeComparisonRef = useRef(null)
  const previousRevealedRef = useRef(revealed)
  const finishScreen = onComplete || continueModule

  useEffect(() => { ensurePeopleStyles() }, [])

  useEffect(() => {
    if (previousRevealedRef.current === revealed) return
    previousRevealedRef.current = revealed

    const target = activeComparisonRef.current
    if (!target) return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const moveToTarget = () => {
      target.focus({ preventScroll: true })
      target.scrollIntoView?.({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    }
    const frame = window.requestAnimationFrame?.(moveToTarget)

    if (frame == null) {
      moveToTarget()
      return undefined
    }

    return () => window.cancelAnimationFrame?.(frame)
  }, [revealed])

  function advance() {
    setRevealed(count => Math.min(count + 1, steps.length))
  }

  const revealedComparisons = revealedComparisonCount(block, steps, revealed)
  const currentComparison = Math.max(revealedComparisons - 1, 0)
  const completedComparisons = Math.max(revealedComparisons - 1, 0)
  const activeComparisonIndex = view.comparisons.findIndex(state => state.visible)

  const pairGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'stretch',
  }

  return (
    <section
      className="tcp-anim"
      aria-label={`Comparing ${left.name || 'the two people'} and ${right.name || ''}`.trim()}
      style={{ '--tcp-accent': accent, margin: `${SPACING.compact}px 0` }}
    >
      {block.heroImage && (
        <HeroHeader
          block={block}
          left={left}
          right={right}
          accent={accent}
          bg={subj.background}
          bgSecondary={subj.backgroundSecondary}
        />
      )}

      {/* When a cinematic hero already names both people, do not repeat them in
          a second title immediately below it. */}
      {block.title && !block.heroImage && (
        <h3 style={{
          ...TYPE.displaySection,
          color: GENERAL.cinematic.textPrimary,
          textAlign: 'center',
          margin: `0 auto ${SPACING.standard}px`,
        }}>
          {block.title}
        </h3>
      )}

      {!block.heroImage && (
        <div style={{ position: 'relative', ...pairGrid, gap: SPACING.micro, marginBottom: SPACING.standard }}>
          <PersonHeader
            person={left}
            align="left"
            rgb={rgb}
            emphasised={defaultEmphasisSide === 'left'}
            deemphasised={defaultEmphasisSide === 'right'}
          />
          <div aria-hidden="true" style={{
            position: 'absolute',
            top: SPACING.micro,
            bottom: SPACING.micro,
            left: '50%',
            width: COMPONENT_SIZE.hairline,
            transform: 'translateX(-0.5px)',
            background: subj.glow,
          }} />
          <PersonHeader
            person={right}
            align="right"
            rgb={rgb}
            emphasised={defaultEmphasisSide === 'right'}
            deemphasised={defaultEmphasisSide === 'left'}
          />
        </div>
      )}

      {comparisons.length > 1 && (
        <div style={{ width: '100%', marginBottom: SPACING.standard }}>
          <SequenceProgress
            total={comparisons.length}
            current={currentComparison}
            completed={completedComparisons}
            accent={accent}
            accentRgb={rgb}
            variant="sash"
            stretch
            ariaLabel={`${block.title || 'Comparison'} progress`}
            style={{ width: '100%' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.separation }}>
        {comparisons.map((comparison, comparisonIndex) => {
          const state = view.comparisons[comparisonIndex]
          if (!state?.visible) return null
          return (
            <ComparisonRow
              key={comparison.id || comparisonIndex}
              comparison={comparison}
              state={state}
              left={left}
              right={right}
              rgb={rgb}
              accent={accent}
              pairGrid={pairGrid}
              defaultEmphasisSide={defaultEmphasisSide}
              focusRef={comparisonIndex === activeComparisonIndex ? activeComparisonRef : undefined}
            />
          )
        })}
      </div>

      {view.takeawayVisible && block.takeaway && (
        <div
          className="tcp-anim"
          style={{
            marginTop: SPACING.separation,
            textAlign: 'center',
          }}
        >
          <CinematicDivider
            accent={accent}
            accentRgb={rgb}
            style={{ margin: `0 auto ${SPACING.standard}px` }}
          />
          <p style={{
            ...TYPE.displayCard,
            color: accent,
            margin: 0,
          }}>
            {block.takeaway}
          </p>
        </div>
      )}

      {(!view.complete || finishScreen) && (
        <ContinueCTA
          accent={accent}
          onClick={view.complete ? finishScreen : advance}
          label="Continue"
          style={{ marginTop: SPACING.standard }}
        />
      )}
    </section>
  )
}

function HeroHeader({ block, left, right, accent, bg, bgSecondary }) {
  const objectPosition = block.heroObjectPosition || 'center center'

  return (
    <div style={{
      position: 'relative',
      marginTop: -SPACING.compact,
      marginInline: -SPACING.compact,
      marginBottom: SPACING.standard,
      ...PEOPLE_HERO_SIZE,
      isolation: 'isolate',
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img
          src={block.heroImage}
          alt={block.heroImageAlt || `${left.name} and ${right.name}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
            display: 'block',
          }}
        />
        <div aria-hidden="true" style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,0) 36%, ${bg} 100%)`,
        }} />
      </div>

      <div
        aria-hidden="true"
        data-hero-atmosphere="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -SPACING.standard,
          height: SPACING.separation,
          background: `linear-gradient(180deg, transparent 0%, ${bg} 36%, ${bgSecondary || bg} 68%, transparent 100%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'absolute', left: SPACING.compact, bottom: SPACING.micro, maxWidth: '46%', zIndex: 2 }}>
        <div style={{ ...TYPE.titleLarge, color: accent }}>{left.name}</div>
        {left.subtitle && (
          <div style={{ ...TYPE.caption, color: GENERAL.cinematic.textSecondary }}>{left.subtitle}</div>
        )}
      </div>
      <div style={{ position: 'absolute', right: SPACING.compact, bottom: SPACING.micro, maxWidth: '46%', textAlign: 'right', zIndex: 2 }}>
        <div style={{ ...TYPE.titleLarge, color: accent }}>{right.name}</div>
        {right.subtitle && (
          <div style={{ ...TYPE.caption, color: GENERAL.cinematic.textSecondary }}>{right.subtitle}</div>
        )}
      </div>
    </div>
  )
}

function PersonHeader({ person, align, rgb, emphasised, deemphasised }) {
  return (
    <figure style={{
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      paddingInline: align === 'left' ? `0 ${SPACING.micro}px` : `${SPACING.micro}px 0`,
    }}>
      <div style={{
        width: COMPONENT_SIZE.thumbnail,
        height: COMPONENT_SIZE.thumbnail,
        borderRadius: RADII.pill,
        overflow: 'hidden',
        border: emphasised ? `1px solid rgba(${rgb},0.4)` : `1px solid ${GENERAL.line.soft}`,
        boxShadow: emphasised ? `0 0 0 ${COMPONENT_SIZE.accentRail}px rgba(${rgb},0.10)` : 'none',
        background: GENERAL.surfaceTint,
        marginBottom: SPACING.micro,
      }}>
        {person.image && (
          <img
            src={person.image}
            alt={person.imageAlt || `Portrait of ${person.name}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: deemphasised ? 'grayscale(0.35) brightness(0.92)' : 'none',
            }}
          />
        )}
      </div>
      <figcaption>
        <div style={{ ...TYPE.titleMedium, color: GENERAL.cinematic.textPrimary }}>{person.name}</div>
        {person.subtitle && (
          <div style={{ ...TYPE.caption, color: GENERAL.cinematic.textMuted, marginTop: 2 }}>
            {person.subtitle}
          </div>
        )}
      </figcaption>
    </figure>
  )
}

function ComparisonRow({
  comparison,
  state,
  left,
  right,
  rgb,
  accent,
  pairGrid,
  defaultEmphasisSide,
  focusRef,
}) {
  const hasRows = Array.isArray(comparison.rows) && comparison.rows.length > 0
  const emphasisSide = resolveEmphasisSide(comparison.emphasisSide ?? defaultEmphasisSide)

  return (
    <div
      ref={focusRef}
      tabIndex={-1}
      className="tcp-anim tcp-reveal-target"
      role="group"
      aria-label={comparison.prompt}
      data-emphasis-side={emphasisSide}
      style={{ scrollMarginTop: COMPONENT_SIZE.learningHeaderClearance }}
    >
      {comparison.prompt && (
        <h4 style={{
          ...TYPE.titleLarge,
          color: GENERAL.cinematic.textPrimary,
          textAlign: 'center',
          margin: `0 0 ${SPACING.compact}px`,
        }}>
          {comparison.prompt}
        </h4>
      )}

      <ColumnLabels left={left} right={right} pairGrid={pairGrid} accent={accent} rgb={rgb} />

      {hasRows ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
          {comparison.rows.slice(0, state.visibleRows).map((row, rowIndex) => (
            <div key={rowIndex} className="tcp-anim">
              {row.label && (
                <div style={{
                  ...TYPE.label,
                  color: `rgba(${rgb},0.85)`,
                  textAlign: 'center',
                  marginBottom: SPACING.micro,
                }}>
                  {row.label}
                </div>
              )}
              <ComparisonPair pairGrid={pairGrid} rgb={rgb}>
                <Cell text={row.left} person={left} rgb={rgb} emphasised={emphasisSide === 'left'} />
                <Cell text={row.right} person={right} rgb={rgb} emphasised={emphasisSide === 'right'} />
              </ComparisonPair>
            </div>
          ))}
          {state.noteVisible && comparison.note && (
            <p className="tcp-anim" style={{
              ...TYPE.bodyStrong,
              color: accent,
              textAlign: 'center',
              margin: `${SPACING.micro}px 0 0`,
            }}>
              {comparison.note}
            </p>
          )}
        </div>
      ) : (
        <ComparisonPair pairGrid={pairGrid} rgb={rgb}>
          <Cell text={comparison.left} person={left} rgb={rgb} emphasised={emphasisSide === 'left'} />
          <Cell text={comparison.right} person={right} rgb={rgb} emphasised={emphasisSide === 'right'} />
        </ComparisonPair>
      )}

      {comparison.explanation && (
        <p style={{
          ...TYPE.body,
          color: GENERAL.cinematic.textSecondary,
          margin: `${SPACING.compact}px 0 0`,
        }}>
          {comparison.explanation}
        </p>
      )}
    </div>
  )
}

function ColumnLabels({ left, right, pairGrid, accent, rgb }) {
  return (
    <div style={{
      position: 'relative',
      ...pairGrid,
      marginBottom: SPACING.micro,
      paddingInline: SPACING.compact,
    }}>
      <div style={{ ...TYPE.label, color: accent, textAlign: 'left' }}>{left.name}</div>
      <div style={{ ...TYPE.label, color: accent, textAlign: 'right' }}>{right.name}</div>
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        width: COMPONENT_SIZE.hairline,
        transform: 'translateX(-0.5px)',
        background: `rgba(${rgb},0.28)`,
      }} />
    </div>
  )
}

// One shared panel reads as a static side-by-side comparison rather than two
// tappable answer options. The restrained centre rule carries the relationship.
function ComparisonPair({ children, pairGrid, rgb }) {
  return (
    <div
      data-comparison-pair="true"
      style={{
        position: 'relative',
        ...pairGrid,
        overflow: 'hidden',
        borderRadius: RADII.medium,
        border: `1px solid ${GENERAL.line.soft}`,
        background: GENERAL.surfaceTint,
      }}
    >
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        width: COMPONENT_SIZE.hairline,
        transform: 'translateX(-0.5px)',
        background: `linear-gradient(180deg, transparent, rgba(${rgb},0.34) 18%, rgba(${rgb},0.34) 82%, transparent)`,
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      {children}
    </div>
  )
}

// The person's name remains available to screen readers while the repeated
// visual column labels keep the left/right relationship clear after the hero.
function Cell({ text, person, rgb, emphasised }) {
  return (
    <div
      data-emphasised={emphasised ? 'true' : 'false'}
      style={{
        height: '100%',
        padding: `${SPACING.standard}px ${SPACING.compact}px`,
        background: emphasised ? `rgba(${rgb},0.07)` : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        ...TYPE.bodyStrong,
        color: GENERAL.cinematic.textPrimary,
      }}
    >
      <span className="tcp-sr-only">{person.name}: </span>{text}
    </div>
  )
}
