import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
import CinematicShell from '../layout/CinematicShell.jsx'

const STEP_MS = 380

export default function ConceptReveal({ subject: subjectProp, steps = [], onContinue, onRevealStart }) {
  const theme = SUBJECTS[subjectProp] || SUBJECTS.History
  const accent = theme.accent
  const palBg = theme.background

  const [stepIdx, setStepIdx] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [revealStarted, setRevealStarted] = useState(false)
  const touchRef = useRef({ x: null, y: null })

  const step = steps[stepIdx] || {}
  const isLast = stepIdx === steps.length - 1
  const bg = step.backgroundImage
    ? `url(${step.backgroundImage})`
    : `linear-gradient(160deg, ${palBg} 0%, #080C1A 100%)`

  function markRevealStarted() {
    if (!revealStarted) {
      setRevealStarted(true)
      onRevealStart?.()
    }
  }

  function advanceStep() {
    markRevealStarted()
    if (isLast) return
    setStepIdx(i => i + 1)
    setAnimKey(k => k + 1)
  }

  function finishReveal() {
    markRevealStarted()
    onContinue?.()
  }

  function retreat() {
    if (stepIdx > 0) {
      setStepIdx(i => i - 1)
      setAnimKey(k => k + 1)
    }
  }

  function onTouchStart(e) {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function onTouchEnd(e) {
    const { x, y } = touchRef.current
    if (x === null) return
    const dx = e.changedTouches[0].clientX - x
    const dy = e.changedTouches[0].clientY - y
    touchRef.current = { x: null, y: null }
    if (Math.abs(dx) < Math.abs(dy) * 1.4 || Math.abs(dx) < 44) return
    dx < 0 ? advanceStep() : retreat()
  }

  function onClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    ;(e.clientX - rect.left) / rect.width < 0.2 ? retreat() : advanceStep()
  }

  function keepOnCta(e) {
    e.stopPropagation()
  }

  return (
    <>
      <style>{`
        @keyframes crSlideIn {
          from { opacity:0; transform:translateY(22px) }
          to   { opacity:1; transform:translateY(0) }
        }
      `}</style>

      <CinematicShell style={{ background: bg, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 100 }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          onClick={onClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,.08) 0%, rgba(0,0,0,.18) 35%, rgba(0,0,0,.68) 65%, rgba(0,0,0,.94) 100%)',
          }} />

          <div
            key={animKey}
            style={{
              position: 'relative', zIndex: 1,
              padding: '0 32px calc(128px + env(safe-area-inset-bottom, 0px))',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              animation: `crSlideIn ${STEP_MS}ms cubic-bezier(.16,1,.3,1) both`,
            }}
          >
            <MainReveal text={step.mainText} emphasis={step.emphasis} accent={accent} />

            {step.supportText && (
              <p style={{
                ...TYPE.bodyStrong,
                color: 'rgba(245,238,225,.64)',
                margin: '14px 0 0',
                maxWidth: '34ch',
              }}>
                {step.supportText}
              </p>
            )}

            {step.microPoints?.length > 0 && (
              <ul style={{
                listStyle: 'none', padding: 0,
                margin: '12px 0 0',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                {step.microPoints.map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{
                      display: 'block',
                      width: 3, height: 3, borderRadius: '50%',
                      background: accent + '66',
                      marginTop: '0.6em', flexShrink: 0,
                    }} />
                    <span style={{
                      ...TYPE.bodySmall,
                      color: 'rgba(245,238,225,.48)',
                    }}>{pt}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isLast && (
            <div
              onClick={keepOnCta}
              onTouchStart={keepOnCta}
              onTouchEnd={keepOnCta}
              style={{
                position: 'fixed',
                left: 32,
                right: 32,
                bottom: 'calc(40px + env(safe-area-inset-bottom, 0px))',
                zIndex: 20,
                pointerEvents: 'auto',
              }}
            >
              <CinematicContinueCTA
                onClick={finishReveal}
                accent={accent}
                animation="crm-fade 520ms ease both, crm-pulse 2.8s ease-in-out 900ms infinite"
                style={{ position: 'static', left: 'auto', right: 'auto', bottom: 'auto' }}
              />
            </div>
          )}
        </div>
      </CinematicShell>
    </>
  )
}

function MainReveal({ text, emphasis, accent }) {
  if (!text) return null

  const base = {
    ...TYPE.displaySection,
    color: 'rgba(245,238,225,0.97)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxWidth: '18ch',
    textShadow: '0 2px 28px rgba(0,0,0,.62)',
  }

  if (!emphasis) return <div style={base}>{text}</div>

  const phrases = Array.isArray(emphasis) ? emphasis : [emphasis]
  let segs = [text]

  for (const phrase of phrases) {
    const out = []
    for (const seg of segs) {
      if (typeof seg !== 'string') { out.push(seg); continue }
      const idx = seg.toLowerCase().indexOf(phrase.toLowerCase())
      if (idx === -1) { out.push(seg); continue }
      if (idx > 0) out.push(seg.slice(0, idx))
      out.push({ em: true, val: seg.slice(idx, idx + phrase.length) })
      if (idx + phrase.length < seg.length) out.push(seg.slice(idx + phrase.length))
    }
    segs = out
  }

  return (
    <div style={base}>
      {segs.map((s, i) =>
        typeof s === 'string' ? (
          <span key={i}>{s}</span>
        ) : (
          <span key={i} style={{
            color: accent,
            textShadow: `0 0 32px ${accent}40`,
          }}>{s.val}</span>
        )
      )}
    </div>
  )
}
