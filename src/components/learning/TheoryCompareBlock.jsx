import { useState, useEffect, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
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
export default function TheoryCompareBlock({ block, subject = 'Biology' }) {
  if (isPeopleVariant(block)) {
    return <PeopleCompareBlock block={block} subject={subject} />
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
// Two named people, portraits kept as compact headers, one comparison theme
// revealed at a time, a full-width teaching explanation where needed, and a
// single closing takeaway. Left side (e.g. Galen) reads older and quieter;
// right side (e.g. Vesalius) carries restrained subject-accent emphasis as
// evidence is revealed. All colour derives from the subject accent token —
// content data never carries raw colours.
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
    .tcp-cta:focus-visible,
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

function PeopleCompareBlock({ block, subject }) {
  const subj   = SUBJECTS[subject] || SUBJECTS.History
  const accent = subj.accent
  const rgb    = subj.accentRgb

  const left  = block.leftPerson  || {}
  const right = block.rightPerson || {}
  const comparisons = Array.isArray(block.comparisons) ? block.comparisons : []

  const steps = buildPeopleSteps(block)
  const [revealed, setRevealed] = useState(steps.length > 0 ? 1 : 0)

  const view = deriveVisibleState(block, steps, revealed)
  const nextStep = steps[revealed] // the step a Continue press would reveal
  const takeawayRef = useRef(null)

  useEffect(() => { ensurePeopleStyles() }, [])

  // When the closing takeaway becomes visible, move focus to it so keyboard and
  // screen-reader users land on the payoff after the Continue button unmounts.
  useEffect(() => {
    if (view.takeawayVisible && takeawayRef.current) takeawayRef.current.focus()
  }, [view.takeawayVisible])

  function advance() {
    setRevealed(r => Math.min(r + 1, steps.length))
  }

  const filledSegments = revealedComparisonCount(block, steps, revealed)

  const twoCol = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: SPACING.micro,
    alignItems: 'stretch',
  }

  return (
    <section
      className="tcp-anim"
      aria-label={`Comparing ${left.name || 'the two people'} and ${right.name || ''}`.trim()}
      style={{ '--tcp-accent': accent, margin: `${SPACING.compact}px 0` }}
    >
      {/* Cinematic dual-portrait hero (optional) — a single top image spanning
          both people, darkening into the screen. When absent, the two compact
          circular portrait headers are used instead. */}
      {block.heroImage && (
        <HeroHeader block={block} left={left} right={right} rgb={rgb} bg={subj.background} />
      )}

      {block.title && (
        <h3 style={{
          ...TYPE.displaySection,
          color: 'rgba(245,245,245,0.96)',
          margin: `0 0 ${SPACING.standard}px`,
        }}>
          {block.title}
        </h3>
      )}

      {/* Portraits — compact, comparable headers with a central division */}
      {!block.heroImage && (
        <div style={{ position: 'relative', ...twoCol, marginBottom: SPACING.standard }}>
          <PersonHeader person={left}  align="left"  rgb={rgb} emphasised={false} />
          {/* Central visual division between the two people */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: 6, bottom: 6, left: '50%',
            width: 1, transform: 'translateX(-0.5px)',
            background: `linear-gradient(180deg, transparent, rgba(${rgb},0.35), transparent)`,
          }} />
          <PersonHeader person={right} align="right" rgb={rgb} emphasised={true} />
        </div>
      )}

      {/* Reveal-progress rail (bronze) — supplementary to the revealed content */}
      {comparisons.length > 1 && (
        <div aria-hidden="true" style={{ display: 'flex', gap: 6, marginBottom: SPACING.standard }}>
          {comparisons.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: RADII.pill,
              background: i < filledSegments ? accent : `rgba(${rgb},0.16)`,
              transition: `background ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
            }} />
          ))}
        </div>
      )}

      {/* Comparisons — revealed one theme at a time */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.standard }}>
        {comparisons.map((cmp, ci) => {
          const state = view.comparisons[ci]
          if (!state?.visible) return null
          return (
            <ComparisonRow
              key={cmp.id || ci}
              comparison={cmp}
              state={state}
              left={left}
              right={right}
              rgb={rgb}
              accent={accent}
              twoCol={twoCol}
            />
          )
        })}
      </div>

      {/* Progression — governed Continue CTA */}
      {!view.complete && (
        <ContinueCTA
          accent={accent}
          onClick={advance}
          label={nextStep?.type === 'takeaway' ? 'Reveal the takeaway' : 'Continue'}
          style={{ marginTop: SPACING.standard }}
        />
      )}

      {/* Closing takeaway — the core historical meaning */}
      {view.takeawayVisible && block.takeaway && (
        <div
          ref={takeawayRef}
          tabIndex={-1}
          className="tcp-anim tcp-takeaway"
          style={{
            marginTop: SPACING.standard,
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
    </section>
  )
}

// Full-bleed cinematic hero: one image of both people at the top of the screen
// (~30% of the viewport), darkening at the bottom into the subject background so
// it flows into the rest of the screen. Names sit in the darkened base — left
// person quiet, right person in restrained subject accent.
function HeroHeader({ block, left, right, rgb, bg }) {
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
      {/* Darken the lower portion into the screen background */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(0,0,0,0) 36%, ${bg} 100%)`,
      }} />
      <div style={{ position: 'absolute', left: SPACING.compact, bottom: SPACING.compact, maxWidth: '46%' }}>
        <div style={{ ...TYPE.titleMedium, color: 'rgba(245,245,245,0.96)' }}>{left.name}</div>
        {left.subtitle && (
          <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.72)' }}>{left.subtitle}</div>
        )}
      </div>
      <div style={{ position: 'absolute', right: SPACING.compact, bottom: SPACING.compact, maxWidth: '46%', textAlign: 'right' }}>
        <div style={{ ...TYPE.titleMedium, color: `rgba(${rgb},0.98)` }}>{right.name}</div>
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

function ComparisonRow({ comparison, state, left, right, rgb, accent, twoCol }) {
  const hasRows = Array.isArray(comparison.rows) && comparison.rows.length > 0

  return (
    <div className="tcp-anim" role="group" aria-label={comparison.prompt}>
      {comparison.prompt && (
        <h4 style={{
          ...TYPE.titleLarge,
          color: 'rgba(245,245,245,0.9)',
          margin: `0 0 ${SPACING.compact}px`,
        }}>
          {comparison.prompt}
        </h4>
      )}

      {hasRows ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
          {comparison.rows.slice(0, state.visibleRows).map((row, ri) => (
            <div key={ri} className="tcp-anim">
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
              <div style={twoCol}>
                <Cell text={row.left}  person={left}  rgb={rgb} emphasised={false} />
                <Cell text={row.right} person={right} rgb={rgb} emphasised={true} />
              </div>
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
        <div style={twoCol}>
          <Cell text={comparison.left}  person={left}  rgb={rgb} emphasised={false} />
          <Cell text={comparison.right} person={right} rgb={rgb} emphasised={true} />
        </div>
      )}

      {/* Full-width teaching explanation beneath both columns */}
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

// A single comparison cell. The person's name is exposed to screen readers via
// a visually-hidden prefix so the Galen/Vesalius relationship survives even
// though colour and column position are visual-only cues.
function Cell({ text, person, rgb, emphasised }) {
  return (
    <div style={{
      padding: `${SPACING.compact}px`,
      borderRadius: RADII.medium,
      background: emphasised ? `rgba(${rgb},0.09)` : 'rgba(255,255,255,0.035)',
      border: `1px solid ${emphasised ? `rgba(${rgb},0.26)` : 'rgba(255,255,255,0.08)'}`,
      ...TYPE.bodyStrong,
      color: emphasised ? 'rgba(245,245,245,0.94)' : 'rgba(245,245,245,0.62)',
    }}>
      <span className="tcp-sr-only">{person.name}: </span>{text}
    </div>
  )
}
