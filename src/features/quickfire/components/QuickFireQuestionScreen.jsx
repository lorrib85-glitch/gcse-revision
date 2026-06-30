import { useState, useEffect, useRef } from 'react'
import { SPACING } from '../../../constants/spacing.js'
import { RADII } from '../../../constants/radii.js'
import { TYPE } from '../../../constants/typography.js'
import { GENERAL } from '../../../constants/generalTheme.js'
import { MOTION } from '../../../constants/motion.js'
import CircularTimer from './CircularTimer.jsx'

// ─── Quick Fire — question screen ───────────────────────────────────────────
// Implements the "90 Second Quick Fire" locked UX spec: tap-to-grade answer
// cards, retry-in-place on an incorrect tap, auto-advance on a correct one.
// Calm, monochrome, no badges/labels/progress bars — the timer is the only
// chrome. `onAnswer` fires once per question (first attempt only).
export default function QuickFireQuestionScreen({ q, timeLeft, totalSeconds, onExit, onAnswer, onAdvance }) {
  const [tapped, setTapped]         = useState(null)
  const [status, setStatus]         = useState(null) // null | 'correct' | 'incorrect'
  const [hintVisible, setHintVisible] = useState(false)
  const [retryTapped, setRetryTapped] = useState(null)
  const [retryStatus, setRetryStatus] = useState(null) // null | 'correct' | 'incorrect'
  const [entered, setEntered]       = useState(false)
  const [leaving, setLeaving]       = useState(false)
  const timersRef = useRef([])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => {
      cancelAnimationFrame(raf)
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  if (!q) return null

  function advanceAfterHold() {
    const holdMs = parseInt(MOTION.duration.cinematic, 10)
    const outMs = parseInt(MOTION.duration.standard, 10)
    timersRef.current.push(setTimeout(() => {
      setLeaving(true)
      timersRef.current.push(setTimeout(onAdvance, outMs))
    }, holdMs))
  }

  function selectOption(opt) {
    if (status === null) {
      const isCorrect = opt === q.options[q.correct]
      setTapped(opt)
      setStatus(isCorrect ? 'correct' : 'incorrect')
      if (navigator.vibrate) navigator.vibrate(isCorrect ? 10 : 20)
      onAnswer(isCorrect)
      if (isCorrect || q.type === 'truefalse') {
        // True/false is binary — a wrong tap already reveals the answer, so
        // skip the hint and retry step and move straight on.
        advanceAfterHold()
      } else {
        const hintMs = parseInt(MOTION.duration.fast, 10)
        timersRef.current.push(setTimeout(() => setHintVisible(true), hintMs))
      }
      return
    }
    // One retry after the hint: picking a different answer marks it immediately
    if (status === 'incorrect' && hintVisible && retryStatus === null && opt !== tapped) {
      const isCorrect = opt === q.options[q.correct]
      setRetryTapped(opt)
      setRetryStatus(isCorrect ? 'correct' : 'incorrect')
      if (navigator.vibrate) navigator.vibrate(isCorrect ? 10 : 20)
      advanceAfterHold()
    }
  }

  function mark(kind) {
    if (kind !== 'correct') {
      return (
        <span aria-hidden="true" style={{ position:'absolute', right:18, top:'50%', transform:'translateY(-50%)', color:GENERAL.coral, fontSize:'1.15rem', fontWeight:700, animation:`qfMarkIn ${MOTION.duration.fast} ${MOTION.easing.standard} both` }}>
          ×
        </span>
      )
    }
    return (
      <span aria-hidden="true" style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', width:30, height:30 }}>
        <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:`rgba(${GENERAL.tealRgb}, 0.4)`, animation:`qfRingOut ${MOTION.duration.slow} ${MOTION.easing.standard} both` }} />
        <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:GENERAL.teal, display:'flex', alignItems:'center', justifyContent:'center', animation:`qfMarkPop ${MOTION.duration.standard} ${MOTION.easing.standard} both` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GENERAL.neutral[0]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" style={{ strokeDasharray:24, strokeDashoffset:24, animation:`qfCheckDraw ${MOTION.duration.standard} ${MOTION.easing.standard} ${MOTION.duration.instant} forwards` }} />
          </svg>
        </span>
      </span>
    )
  }

  return (
    <div style={{ background:GENERAL.neutral[0], minHeight:'100dvh', display:'flex', flexDirection:'column', color:GENERAL.softWhite }}>
      <style>{`
        @keyframes qfMarkIn { from { opacity:0; transform:translateY(-50%) scale(0.5); } to { opacity:1; transform:translateY(-50%) scale(1); } }
        @keyframes qfHintIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes qfMarkPop { 0% { transform:scale(0.4); opacity:0; } 65% { transform:scale(1.15); opacity:1; } 100% { transform:scale(1); opacity:1; } }
        @keyframes qfRingOut { 0% { transform:scale(0.6); opacity:0.45; } 100% { transform:scale(1.9); opacity:0; } }
        @keyframes qfCheckDraw { to { stroke-dashoffset:0; } }
      `}</style>

      <div style={{ padding:`${SPACING.compact}px 20px 0`, display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
        <div style={{ width:'100%', maxWidth:520, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <button onClick={onExit} aria-label="Exit" style={{
            width:42, height:42, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.14)',
            background:'transparent', color:GENERAL.slate, fontSize:'1.2rem', lineHeight:1,
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', padding:0,
          }}>×</button>
          <CircularTimer seconds={timeLeft} totalSeconds={totalSeconds} />
        </div>
      </div>

      <div style={{
        flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-start',
        padding:`${SPACING.compact}px 20px ${SPACING.standard}px`, maxWidth:520, width:'100%', margin:'0 auto', boxSizing:'border-box',
        opacity: entered && !leaving ? 1 : 0,
        transform: leaving ? 'translateY(-8px)' : entered ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
      }}>
        <p style={{
          fontFamily:"'IBM Plex Serif', serif", fontSize:26, lineHeight:1.25, fontWeight:600,
          letterSpacing:'-0.01em', margin:`0 0 ${SPACING.standard}px`, color:GENERAL.softWhite,
        }}>{q.q}</p>

        <div style={{ display:'flex', flexDirection:'column', gap:SPACING.micro }}>
          {q.options.map((opt, i) => {
            const isFirstTapped = tapped === opt
            const isRetryTapped = retryTapped === opt
            const isCorrectOpt = i === q.correct
            let opacity = 1
            let background = GENERAL.neutral[1]
            let border = '1px solid rgba(255,255,255,0.06)'

            if (status === 'incorrect' && isFirstTapped) opacity = 0.58
            if (status === 'correct' && isFirstTapped) {
              background = `rgba(${GENERAL.tealRgb}, 0.07)`
              border = `1px solid ${GENERAL.teal}`
            }
            if (isRetryTapped && retryStatus === null) {
              border = `1px solid rgba(${GENERAL.tealRgb}, 0.5)`
            }
            if (isRetryTapped && retryStatus === 'correct') {
              background = `rgba(${GENERAL.tealRgb}, 0.07)`
              border = `1px solid ${GENERAL.teal}`
            }
            if (isRetryTapped && retryStatus === 'incorrect') opacity = 0.58
            if (retryStatus === 'incorrect' && isCorrectOpt) {
              background = `rgba(${GENERAL.tealRgb}, 0.07)`
              border = `1px solid ${GENERAL.teal}`
            }

            const disabled = status === 'correct'
              ? true
              : status === 'incorrect'
                ? (retryStatus !== null || isFirstTapped || !hintVisible)
                : false

            return (
              <button key={i} onClick={() => selectOption(opt)} disabled={disabled} style={{
                position:'relative', width:'100%', textAlign:'left', background, border, borderRadius:RADII.large,
                padding:'14px 44px 14px 18px', cursor: disabled ? 'default' : 'pointer',
                ...TYPE.body, fontWeight:500, color:GENERAL.softWhite,
                opacity,
                transition:`opacity ${MOTION.duration.instant} ${MOTION.easing.gentle}, background ${MOTION.duration.instant} ${MOTION.easing.gentle}, border-color ${MOTION.duration.instant} ${MOTION.easing.gentle}`,
              }}>
                {opt}
                {status === 'incorrect' && isFirstTapped && mark('incorrect')}
                {status === 'correct' && isFirstTapped && mark('correct')}
                {isRetryTapped && retryStatus === 'correct' && mark('correct')}
                {isRetryTapped && retryStatus === 'incorrect' && mark('incorrect')}
                {retryStatus === 'incorrect' && isCorrectOpt && !isRetryTapped && mark('correct')}
              </button>
            )
          })}
        </div>

        {hintVisible && status === 'incorrect' && (
          <div style={{
            marginTop:SPACING.compact, background:GENERAL.neutral[1], borderRadius:RADII.large,
            borderLeft:`3px solid ${GENERAL.teal}`, padding:'12px 16px',
            display:'flex', gap:12, alignItems:'flex-start',
            animation:`qfHintIn ${MOTION.duration.fast} ${MOTION.easing.standard} both`,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color:GENERAL.slate, flexShrink:0, marginTop:3 }}>
              <path d="M9 18h6M10 21h4M12 2a6.5 6.5 0 0 0-4 11.6c.6.5 1 1.3 1 2.4h6c0-1.1.4-1.9 1-2.4A6.5 6.5 0 0 0 12 2z" />
            </svg>
            <div>
              <div style={{ ...TYPE.metadata, color:GENERAL.slate, marginBottom:6 }}>Hint</div>
              <p style={{ margin:0, ...TYPE.body, fontSize:'.92rem', color:GENERAL.softWhite }}>{q.hint || q.ms}</p>
              <p style={{ margin:'6px 0 0', ...TYPE.body, fontSize:'.8rem', color:GENERAL.teal, fontStyle:'italic' }}>Pick another answer — it'll mark straight away.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
