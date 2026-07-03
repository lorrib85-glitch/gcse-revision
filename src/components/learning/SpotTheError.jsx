import { useState, useMemo, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { BUTTONS } from '../../constants/buttons.js'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

// Plain, subtle openers — never a game-show "Spot The Error" title.
const HEADER_PROMPTS = [
  "Something isn't right.",
  'Look closely.',
  'Check the reasoning.',
]

function tokenise(text) {
  const tokens = []
  const re = /\S+/g
  let m
  while ((m = re.exec(text))) tokens.push({ text: m[0], start: m.index, end: m.index + m[0].length })
  return tokens
}

// Jaccard-style overlap — rewards selections that closely track the real
// error span and naturally penalises "select the whole sentence" gaming.
function overlapRatio(aStart, aEnd, bStart, bEnd) {
  const interStart = Math.max(aStart, bStart)
  const interEnd   = Math.min(aEnd, bEnd)
  const inter = Math.max(0, interEnd - interStart)
  const union = Math.max(aEnd, bEnd) - Math.min(aStart, bStart)
  return union > 0 ? inter / union : 0
}

function slugify(text) {
  return (text || '').toLowerCase().slice(0, 40).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function FeedbackSection({ label, text, rgb }) {
  if (!text) return null
  return (
    <div style={{ marginBottom: SPACING.standard }}>
      <p style={{
        ...TYPE.metadata,
        textTransform: 'uppercase',
        color: `rgba(${rgb},0.5)`,
        marginBottom: SPACING.micro,
      }}>{label}</p>
      <p style={{ ...TYPE.body, color: '#EAF7F0', margin: 0 }}>{text}</p>
    </div>
  )
}

export default function SpotTheError({ block, subject = 'Biology', onContinue }) {
  const subj   = SUBJECTS[subject] || SUBJECTS.Biology
  const accent = subj.accent
  const rgb    = subj.accentRgb

  const statement = block.statement || ''
  const tokens = useMemo(() => tokenise(statement), [statement])

  // The error span is authored as a substring — resolved to character
  // offsets so we can score selections by overlap rather than exact match.
  const target = useMemo(() => {
    const needle = block.errorTarget || ''
    const idx = needle ? statement.indexOf(needle) : -1
    return idx === -1 ? null : { start: idx, end: idx + needle.length }
  }, [statement, block.errorTarget])

  const headerPrompt = block.prompt || HEADER_PROMPTS[slugify(statement).length % HEADER_PROMPTS.length]

  const [selected, setSelected]       = useState(() => new Set())
  const [pulsing, setPulsing]         = useState(null)
  const [explanation, setExplanation] = useState('')
  const [repair, setRepair]           = useState('')
  const [phase, setPhase]             = useState('diagnose') // diagnose | feedback
  const [pressed, setPressed]         = useState(false)
  const loggedRef = useRef(false)

  const hasSelection      = selected.size > 0
  const explanationFilled = explanation.trim().length > 0
  const canCheck          = hasSelection && explanationFilled

  function toggleToken(i) {
    if (phase !== 'diagnose') return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(i)) {
        next.delete(i)
      } else {
        next.add(i)
        setPulsing(i)
        setTimeout(() => setPulsing(p => (p === i ? null : p)), 560)
      }
      return next
    })
  }

  const selectionRange = useMemo(() => {
    if (selected.size === 0) return null
    let start = Infinity, end = -Infinity
    selected.forEach(i => {
      start = Math.min(start, tokens[i].start)
      end   = Math.max(end, tokens[i].end)
    })
    return { start, end }
  }, [selected, tokens])

  const selectionCorrect = useMemo(() => {
    if (!selectionRange || !target) return false
    return overlapRatio(selectionRange.start, selectionRange.end, target.start, target.end) >= 0.4
  }, [selectionRange, target])

  // Without a marking API to grade free text, precision is checked against
  // the GCSE terms the explanation is expected to reach for.
  const explanationPrecise = useMemo(() => {
    const terms = block.keyTerms || []
    if (terms.length === 0) return true
    const lower = explanation.toLowerCase()
    return terms.some(t => lower.includes(String(t).toLowerCase()))
  }, [explanation, block.keyTerms])

  function handleCheck() {
    if (!canCheck || phase !== 'diagnose') return

    if (!loggedRef.current) {
      loggedRef.current = true
      const qid = `spotTheError-${slugify(block.id || statement)}`

      if (selectionCorrect) {
        logCorrectAnswer({ subject, topic: 'Error identification', questionId: qid, source: 'module' })
      } else {
        logWrongAnswer({
          subject, topic: 'Error identification', questionId: qid,
          questionText: statement, source: 'module', questionType: 'spotTheError', marks: 1,
        })
      }

      if (explanationPrecise) {
        logCorrectAnswer({ subject, topic: 'Scientific precision', questionId: `${qid}-precision`, source: 'module' })
      } else {
        logWrongAnswer({
          subject, topic: 'Scientific precision', questionId: `${qid}-precision`,
          questionText: explanation, source: 'module', questionType: 'spotTheError', marks: 1,
        })
      }
    }

    setPhase('feedback')
  }

  function handleContinue() {
    const fn = block.onContinue || onContinue
    if (fn) fn()
  }

  const textAreaStyle = {
    display: 'block',
    width: '100%',
    background: 'rgba(0,0,0,0.28)',
    border: `1.5px solid rgba(${rgb},0.20)`,
    borderRadius: RADII.medium,
    padding: SPACING.compact,
    ...TYPE.bodySmall,
    color: '#EAF7F0',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
  }

  return (
    <div style={{ marginTop: SPACING.compact, maxWidth: 720, marginInline: 'auto' }}>
      <style>{`
        .ste-token { transition: background ${MOTION.duration.fast} ${MOTION.easing.gentle}, box-shadow ${MOTION.duration.fast} ${MOTION.easing.gentle}, color ${MOTION.duration.fast} ${MOTION.easing.gentle}; }
        .ste-token::placeholder, .ste-input::placeholder { color: rgba(234,247,240,0.28); font-style: italic; }
        @keyframes ste-pulse {
          0%, 100% { transform: scale(1); }
          45%      { transform: scale(${MOTION.scale.subtle}); }
        }
        @keyframes ste-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ste-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {phase === 'diagnose' ? (
        <>
          {/* Plain, subtle opener — not a game-show title */}
          <p style={{
            ...TYPE.bodySmall,
            fontStyle: 'italic',
            color: 'rgba(234,247,240,0.38)',
            margin: `0 0 ${SPACING.standard}px`,
          }}>{headerPrompt}</p>

          {/* Statement — every token is independently selectable so the
              error never stands out by its own formatting */}
          <div style={{
            background: `linear-gradient(160deg, rgba(${rgb},0.07) 0%, rgba(0,0,0,0.26) 100%)`,
            border: `1px solid rgba(${rgb},0.16)`,
            boxShadow: `inset 0 1px 0 rgba(${rgb},0.10), 0 4px 24px rgba(0,0,0,0.30)`,
            borderRadius: RADII.large,
            padding: SPACING.standard,
            marginBottom: SPACING.standard,
          }}>
            <p style={{ ...TYPE.body, color: '#EAF7F0', margin: 0, lineHeight: 1.7 }}>
              {tokens.map((tok, i) => {
                const isSelected = selected.has(i)
                const isPulsing  = pulsing === i
                return (
                  <span key={i}>
                    <span
                      className="ste-token"
                      onClick={() => toggleToken(i)}
                      style={{
                        display: 'inline-block',
                        cursor: 'pointer',
                        borderRadius: RADII.small,
                        padding: '1px 4px',
                        margin: '0 -4px',
                        color: isSelected ? '#F4FFF8' : '#EAF7F0',
                        background: isSelected ? `rgba(${rgb},0.20)` : 'transparent',
                        boxShadow: isSelected
                          ? `0 0 0 1px rgba(${rgb},0.45), 0 0 16px rgba(${rgb},0.26)`
                          : 'none',
                        textShadow: isSelected ? `0 0 12px rgba(${rgb},0.40)` : 'none',
                        animation: isPulsing ? `ste-pulse 560ms ${MOTION.easing.gentle}` : 'none',
                      }}
                    >{tok.text}</span>{' '}
                  </span>
                )
              })}
            </p>
          </div>

          {/* Explain — appears only once something has been selected */}
          {hasSelection && (
            <div style={{
              marginBottom: SPACING.standard,
              animation: `ste-slide-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
            }}>
              <p style={{ ...TYPE.displayCard, fontSize: 17, color: '#EAF7F0', marginBottom: SPACING.micro }}>
                Why is this incorrect?
              </p>
              <textarea
                className="ste-input"
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder="Explain what is wrong..."
                style={{ ...textAreaStyle, minHeight: 120 }}
              />
              {explanation.length > 0 && (
                <p style={{
                  ...TYPE.metadata,
                  color: `rgba(${rgb},0.40)`,
                  textAlign: 'right',
                  margin: `${SPACING.micro}px 0 0`,
                }}>{explanation.trim().length} characters</p>
              )}
            </div>
          )}

          {/* Repair — appears once the explanation has content; this is
              where the real learning happens */}
          {explanationFilled && (
            <div style={{
              marginBottom: SPACING.standard,
              animation: `ste-slide-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
            }}>
              <p style={{ ...TYPE.displayCard, fontSize: 17, color: '#EAF7F0', marginBottom: SPACING.micro }}>
                Rewrite the statement correctly.
              </p>
              <textarea
                className="ste-input"
                value={repair}
                onChange={e => setRepair(e.target.value)}
                placeholder="Rewrite it so it's accurate..."
                style={{ ...textAreaStyle, minHeight: 96 }}
              />
            </div>
          )}

          {/* Submit — disabled until an error is selected and explained */}
          <button
            onClick={handleCheck}
            disabled={!canCheck}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            style={{
              width: '100%',
              height: BUTTONS.primary.height,
              borderRadius: BUTTONS.primary.borderRadius,
              background: canCheck ? `linear-gradient(135deg, ${accent}, rgba(${rgb},0.72))` : `rgba(${rgb},0.10)`,
              border: canCheck ? 'none' : `1px solid rgba(${rgb},0.18)`,
              cursor: canCheck ? 'pointer' : 'default',
              opacity: canCheck ? 1 : 0.45,
              fontFamily: BUTTONS.primary.fontFamily,
              fontSize: BUTTONS.primary.fontSize,
              fontWeight: BUTTONS.primary.fontWeight,
              color: canCheck ? '#0A0804' : accent,
              letterSpacing: '-0.02em',
              boxShadow: canCheck ? `0 4px 28px rgba(${rgb},0.28)` : 'none',
              transition: `all ${MOTION.duration.fast} ${MOTION.easing.standard}`,
              transform: pressed && canCheck ? `scale(${MOTION.scale.press})` : 'scale(1)',
            }}
          >Check my thinking</button>
        </>
      ) : (
        // ── Feedback — premium tone, never a bare "wrong" stamp ──────────────
        <div style={{ animation: `ste-fade-in ${MOTION.duration.slow} ${MOTION.easing.standard} both` }}>
          <p style={{ ...TYPE.displaySection, color: accent, margin: `0 0 ${SPACING.standard}px` }}>
            {selectionCorrect ? 'Good catch.' : 'Almost.'}
          </p>

          <FeedbackSection label="What was wrong?"      text={block.whatWasWrong}   rgb={rgb} />
          <FeedbackSection label="Why examiners care"   text={block.examinerNote}   rgb={rgb} />
          <FeedbackSection label="Correct version"      text={block.correctVersion} rgb={rgb} />
          <FeedbackSection label="Common GCSE trap"     text={block.commonTrap}     rgb={rgb} />

          <ContinueCTA onClick={handleContinue} accent={accent} />
        </div>
      )}
    </div>
  )
}
