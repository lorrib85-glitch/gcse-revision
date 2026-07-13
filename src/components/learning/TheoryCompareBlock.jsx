import { useState, useEffect, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
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
// The comparison builds down one page. Each Continue press adds one complete
// theme beneath the content already visible. The component owns the only visible
// CTA while active so navigation always follows the latest revealed text.
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
    .tcp-takeaway:focus-visible {
      outline: 2px solid var(--tcp-accent);
      outline-offset: 3px;
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

  const steps = buildPeopleSteps(block)
  const [revealed, setRevealed] = useState(steps.length > 0 ? 1 : 0)
  const continueModule = useInlineNavigationOwner(true)

  const view = deriveVisibleState(block, steps, revealed)
  const takeawayRef = useRef(null)
  const finishScreen = onComplete || continueModule

  useEffect(() => { ensurePeopleStyles() }, [])

  useEffect(() => {
    if (view.takeawayVisible && takeawayRef.current) takeawayRef.current.focus()
  }, [view.takeawayVisible])

  function advance() {
    setRevealed(count => Math.min(count + 1, steps.length))
  }

  const revealedComparisons = revealedComparisonCount(block, steps, revealed)
  const currentComparison = Math.max(revealedComparisons - 1, 0)
  const completedComparisons = Math.max(revealedComparisons - 1, 0)

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
        <HeroHeader block={block} left={left} right={right} accent={accent} bg={subj.background} />
      )}

      {/* When a cinematic hero already names both people, do not repeat them in
          a second title immediately below it. */}
      {block.title && !block.heroImage && (
        <h3 style={{
          ...TYPE.displaySection,
          color: 'rgba(245,245,245,0.96)',
          textAlign: 'center',
          margin: `0 auto ${SPACING.standard}px`,
        }}>
          {block.title}
        </h3>
      )}

      {!block.heroImage && (
        <div style={{ position: 'relative', ...pairGrid, gap: SPACING.micro, marginBottom: SPACING.standard }}>
          <PersonHeader person={left}  align="left"  rgb={rgb} emphasised={false} />
          <div aria-hidden="true" style={{
            position: 'absolute', top: 6, bottom: 6, left: '50%',
            width: 1, transform: 'translateX(-0.5px)',
            background: `linear-gradient(180deg, transparent, rgba(${rgb},0.35), transparent)`,
          }} />
          <PersonHeader person={right} align="right" rgb={rgb} emphasised={true} />
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
            />
          )
        })}
      </div>

      {view.takeawayVisible && block.takeaway && (
        <div
          ref={takeawayRef}
          tabIndex={-1}
          className="tcp-anim tcp-takeaway"
          style={{
            marginTop: SPACING.separation,
            padding: `${SPACING.standard}px`,
            borderRadius: RADII.large,
            background: `rgba(${rgb},0.08)`,
            border: `1px solid rgba(${rgb},0.28)`,
            ...TYPE.displayCard,
            color: accent,
          }}
        >
          {block.takeaway}
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

function HeroHeader({ block, left, right, accent, bg }) {
  return (
    <div style={{
      position: 'relative',
      marginTop: -SPACING.compact,
      marginInline: -SPACING.compact,
      marginBottom: SPACING.standard,
      height: '30vh', minHeight: 200, maxHeight: 340,
      overflow: 'hidden',
    }}>
      <img
        src={block.heroImage}
        alt={block.heroImageAlt || `${left.name} and ${right.name}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 24%', display: 'block' }}
      />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(0,0,0,0) 36%, ${bg} 100%)`,
      }} />
      <div style={{ position: 'absolute', left: SPACING.compact, bottom: SPACING.micro, maxWidth: '46%' }}>
        <div style={{ ...TYPE.titleLarge, color: accent }}>{left.name}</div>
        {left.subtitle && (
          <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.72)' }}>{left.subtitle}</div>
        )}
      </div>
      <div style={{ position: 'absolute', right: SPACING.compact, bottom: SPACING.micro, maxWidth: '46%', textAlign: 'right' }}>
        <div style={{ ...TYPE.titleLarge, color: accent }}>{right.name}</div>
        {right.subtitle && (
          <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.72)' }}>{right.subtitle}</div>
        )}
      </div>
    </div>
  )
}

function PersonHeader({ person, align, rgb, emphasised }) {
  return (
    <figure style={{
      margin: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center',
      paddingInline: align === 'left' ? `0 ${SPACING.micro}px` : `${SPACING.micro}px 0`,
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: RADII.pill, overflow: 'hidden',
        border: `1px solid rgba(${rgb},${emphasised ? 0.4 : 0.18})`,
        boxShadow: emphasised ? `0 0 0 3px rgba(${rgb},0.10)` : 'none',
        background: 'rgba(255,255,255,0.03)',
        marginBottom: SPACING.micro,
      }}>
        {person.image && (
          <img
            src={person.image}
            alt={person.imageAlt || `Portrait of ${person.name}`}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: emphasised ? 'none' : 'grayscale(0.35) brightness(0.92)',
            }}
          />
        )}
      </div>
      <figcaption>
        <div style={{ ...TYPE.titleMedium, color: 'rgba(245,245,245,0.95)' }}>{person.name}</div>
        {person.subtitle && (
          <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.55)', marginTop: 2 }}>
            {person.subtitle}
          </div>
        )}
      </figcaption>
    </figure>
  )
}

function ComparisonRow({ comparison, state, left, right, rgb, accent, pairGrid }) {
  const hasRows = Array.isArray(comparison.rows) && comparison.rows.length > 0

  return (
    <div className="tcp-anim" role="group" aria-label={comparison.prompt}>
      {comparison.prompt && (
        <h4 style={{
          ...TYPE.titleLarge,
          color: 'rgba(245,245,245,0.9)',
          textAlign: 'center',
          margin: `0 0 ${SPACING.compact}px`,
        }}>
          {comparison.prompt}
        </h4>
      )}

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
                <Cell text={row.left}  person={left}  rgb={rgb} emphasised={false} />
                <Cell text={row.right} person={right} rgb={rgb} emphasised={true} />
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
          <Cell text={comparison.left}  person={left}  rgb={rgb} emphasised={false} />
          <Cell text={comparison.right} person={right} rgb={rgb} emphasised={true} />
        </ComparisonPair>
      )}

      {comparison.explanation && (
        <p style={{
          ...TYPE.body,
          color: 'rgba(245,245,245,0.74)',
          margin: `${SPACING.compact}px 0 0`,
        }}>
          {comparison.explanation}
        </p>
      )}
    </div>
  )
}

// One shared panel reads as a static side-by-side comparison rather than two
// tappable answer options. The restrained centre rule carries the relationship.
function ComparisonPair({ children, pairGrid, rgb }) {
  return (
    <div style={{
      position: 'relative',
      ...pairGrid,
      overflow: 'hidden',
      borderRadius: RADII.large,
      border: `1px solid rgba(${rgb},0.24)`,
      background: 'rgba(255,255,255,0.025)',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        width: 1,
        transform: 'translateX(-0.5px)',
        background: `linear-gradient(180deg, transparent, rgba(${rgb},0.34) 18%, rgba(${rgb},0.34) 82%, transparent)`,
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      {children}
    </div>
  )
}

// The person's name remains available to screen readers while the visual
// design relies on the once-only hero labels and consistent left/right columns.
function Cell({ text, person, rgb, emphasised }) {
  return (
    <div style={{
      height: '100%',
      padding: `${SPACING.standard}px ${SPACING.compact}px`,
      background: emphasised ? `rgba(${rgb},0.055)` : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      ...TYPE.bodyStrong,
      color: 'rgba(245,245,245,0.9)',
    }}>
      <span className="tcp-sr-only">{person.name}: </span>{text}
    </div>
  )
}
