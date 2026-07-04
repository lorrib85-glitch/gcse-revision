import { useEffect, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { GENERAL } from '../../constants/generalTheme.js'
import CinematicShell from '../layout/CinematicShell.jsx'
import ScreenTextBlock from '../layout/ScreenTextBlock.jsx'
import { TYPE, SCREEN_TEXT_LAYOUT } from '../../constants/typography.js'
import { logWrongAnswer } from '../../unifiedWeaknessTracker.js'
import ModuleToolbar from '../core/ModuleToolbar.jsx'

const SCORE_RECALLED = 0.7
const SCORE_PARTIAL = 0.3
const RECALL_DURATION = 3 * 60
const SUCCESS_RGB = '117,220,208'
const LOW_TIME_RGB = '201,123,99'
const DEFAULT_RECALL_PROMPTS = ['people', 'causes', 'changes', 'evidence']

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function lerpColor(rgbA, rgbB, t) {
  const a = rgbA.split(',').map(Number)
  const b = rgbB.split(',').map(Number)
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')
}

let stylesReady = false
function ensureStyles() {
  if (stylesReady) return
  stylesReady = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes prk-fade-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes prk-sheet-in { from { opacity: 0; transform: translateY(24px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes prk-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes prk-timer-pulse { 0%, 100% { opacity: 0.32; transform: scale(1); } 50% { opacity: 0.62; transform: scale(1.06); } }
    @keyframes prk-complete-glow {
      0% { box-shadow: 0 0 28px rgba(213,160,73,0.09), inset 0 1px 0 rgba(255,255,255,0.04); border-color: rgba(213,160,73,0.28); }
      42% { box-shadow: 0 0 0 1px rgba(117,220,208,0.18), 0 0 44px rgba(117,220,208,0.22), inset 0 1px 0 rgba(255,255,255,0.07); border-color: rgba(117,220,208,0.62); }
      100% { box-shadow: 0 0 30px rgba(117,220,208,0.12), inset 0 1px 0 rgba(255,255,255,0.05); border-color: rgba(117,220,208,0.44); }
    }
    .prk-scroll { scrollbar-width: none; -ms-overflow-style: none; }
    .prk-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }
  `
  document.head.appendChild(el)
}

async function analyseRecall(answer, concepts, sourceContent) {
  const response = await fetch('/api/recall', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer, concepts, sourceContent: sourceContent || '' }),
  })

  if (!response.ok) {
    let detail = ''
    try {
      const errBody = await response.json()
      detail = errBody.error || JSON.stringify(errBody)
    } catch {
      try { detail = await response.text() } catch { /* ignore */ }
    }
    throw new Error(`Server error ${response.status}${detail ? `: ${detail}` : ''}`)
  }

  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data
}

function CheckIcon({ color = `rgb(${SUCCESS_RGB})` }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function FeatherIcon({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.48-8.48L5 10.52V19h8.48z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  )
}

function RecallTimer({ secondsLeft, duration, ringRgb, rgb }) {
  const progress = Math.max(0, Math.min(1, secondsLeft / duration))
  const radius = 19
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      padding: '12px 13px',
      borderRadius: 18,
      background: `linear-gradient(135deg, rgba(${ringRgb},0.12), rgba(255,255,255,0.026) 48%, rgba(0,0,0,0.18))`,
      border: `1px solid rgba(${ringRgb},0.28)`,
      boxShadow: `0 0 28px rgba(${ringRgb},0.10), inset 0 1px 0 rgba(255,255,255,0.055)`,
      marginBottom: SPACING.compact,
      overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: -28, background: `radial-gradient(circle at 18% 50%, rgba(${ringRgb},0.16), transparent 32%)`, animation: 'prk-timer-pulse 2.4s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(245,247,255,0.08)" strokeWidth="4" />
          <circle cx="24" cy="24" r={radius} fill="none" stroke={`rgb(${ringRgb})`} strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: `stroke-dashoffset ${MOTION.duration.slow} ${MOTION.easing.linear}, stroke ${MOTION.duration.slow} ${MOTION.easing.linear}`, filter: `drop-shadow(0 0 7px rgba(${ringRgb},0.30))` }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 900, color: `rgb(${ringRgb})`, fontVariantNumeric: 'tabular-nums' }}>
          {Math.ceil(secondsLeft / 60)}m
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
          <span style={{ ...TYPE.metadata, fontSize: 11, color: `rgba(${rgb},0.62)` }}>Recall countdown</span>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 850, color: `rgb(${ringRgb})`, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{formatTime(secondsLeft)}</span>
        </div>
        <div aria-hidden="true" style={{ height: 5, borderRadius: RADII.pill, overflow: 'hidden', background: 'rgba(245,247,255,0.075)' }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', borderRadius: RADII.pill, background: `linear-gradient(90deg, rgba(${ringRgb},0.28), rgb(${ringRgb}))`, boxShadow: `0 0 14px rgba(${ringRgb},0.24)`, transition: `width ${MOTION.duration.slow} ${MOTION.easing.linear}, background ${MOTION.duration.slow} ${MOTION.easing.linear}` }} />
        </div>
      </div>
    </div>
  )
}

function MemoryNudges({ prompts }) {
  const nudges = prompts.map(p => String(p).toLowerCase())
  return (
    <div style={{ padding: '0 2px', marginBottom: SPACING.compact, ...TYPE.bodySmall, fontSize: 12, color: 'rgba(245,247,255,0.43)' }}>
      {nudges.join(' · ')}
    </div>
  )
}

function ResultsOverlay({ results, recalled, missing, accent, rgb, onClose }) {
  const rememberedList = (recalled.length ? recalled : (results.concepts || []).slice(0, 3)).slice(0, 3)
  const missingList = (missing.length ? missing : (results.concepts || []).filter(c => c.score < SCORE_RECALLED)).slice(0, 3)

  return (
    <div className="prk-scroll" style={{ position: 'fixed', left: SPACING.standard, right: SPACING.standard, bottom: `calc(${SPACING.standard}px + env(safe-area-inset-bottom))`, zIndex: 6, maxHeight: '58vh', overflow: 'auto', padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.compact}px`, borderRadius: 30, background: 'linear-gradient(180deg, rgba(17,19,24,0.985), rgba(8,10,15,0.99))', border: '1px solid rgba(255,255,255,0.11)', boxShadow: `0 26px 70px rgba(0,0,0,0.58), 0 0 0 1px rgba(${rgb},0.06), inset 0 1px 0 rgba(255,255,255,0.055)`, animation: 'prk-sheet-in 360ms cubic-bezier(0.2,0.8,0.2,1) both' }}>
      <button type="button" onClick={onClose} aria-label="Close recall results" style={{ position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.035)', color: 'rgba(245,247,255,0.64)', fontSize: 24, lineHeight: '34px', cursor: 'pointer' }}>×</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: SPACING.compact, paddingRight: 42 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `rgba(${SUCCESS_RGB},0.14)`, border: `1px solid rgba(${SUCCESS_RGB},0.34)`, boxShadow: `0 0 18px rgba(${SUCCESS_RGB},0.10)` }}><CheckIcon /></div>
        <h2 style={{ ...TYPE.displayCard, color: '#F5F7FF', margin: 0 }}>You remembered</h2>
      </div>
      <div style={{ display: 'grid', gap: 10, marginBottom: SPACING.standard }}>
        {rememberedList.map(concept => <div key={concept.tag || concept.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 24, height: 24, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, border: `1px solid rgba(${SUCCESS_RGB},0.36)`, background: `rgba(${SUCCESS_RGB},0.08)` }}><CheckIcon /></span><span style={{ ...TYPE.bodySmall, color: 'rgba(245,247,255,0.74)', lineHeight: 1.45 }}>{concept.label}</span></div>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: `${SPACING.compact}px 0` }} aria-hidden="true"><div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, rgba(${rgb},0.24))` }} /><div style={{ color: `rgba(${rgb},0.56)`, fontSize: 18 }}>✦</div><div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, rgba(${rgb},0.24), transparent)` }} /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: SPACING.compact }}><div style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `rgba(${rgb},0.13)`, border: `1px solid rgba(${rgb},0.40)`, color: accent, fontSize: 18 }}>✚</div><h2 style={{ ...TYPE.displayCard, color: accent, margin: 0 }}>Missing pieces to revisit</h2></div>
      <div style={{ display: 'grid', gap: 10 }}>{missingList.map(concept => <button type="button" key={concept.tag || concept.label} onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', padding: '11px 10px 11px 13px', borderRadius: 13, border: `1px solid rgba(${rgb},0.30)`, background: `linear-gradient(180deg, rgba(${rgb},0.10), rgba(255,255,255,0.025))`, color: accent, textAlign: 'left', cursor: 'pointer' }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 650, lineHeight: 1.35 }}>{concept.label}</span><span style={{ flexShrink: 0, padding: '6px 9px', borderRadius: 10, border: `1px solid rgba(${rgb},0.62)`, background: 'rgba(0,0,0,0.15)', fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: accent }}>Revise this</span></button>)}</div>
    </div>
  )
}

export default function PriorKnowledgeRecall({ block, subject, onContinue, onBack, onExit }) {
  ensureStyles()
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb
  const [phase, setPhase] = useState('input')
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [isPressed, setIsPressed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RECALL_DURATION)
  const recallPrompts = block.recallPrompts || DEFAULT_RECALL_PROMPTS
  const timeFrac = secondsLeft / RECALL_DURATION
  const shiftAmount = timeFrac >= 0.4 ? 0 : 1 - (timeFrac / 0.4)
  const ringRgb = lerpColor(rgb, LOW_TIME_RGB, shiftAmount)

  useEffect(() => {
    if (phase !== 'input') return undefined
    const id = setInterval(() => { if (document.visibilityState === 'visible') setSecondsLeft(s => Math.max(0, s - 1)) }, 1000)
    return () => clearInterval(id)
  }, [phase])

  async function submit() {
    if (answer.trim().length < 10) { setError('Write at least a sentence — rough notes count.'); return }
    if (!block.concepts?.length) { if (import.meta.env.DEV) console.warn('[PriorKnowledgeRecall] block.concepts missing or empty for block:', block.title ?? block.type); setError('Could not analyse your answer. Check your connection and try again.'); return }
    setError(null); setPhase('analyzing')
    try {
      const data = await analyseRecall(answer, block.concepts, block.sourceContent)
      ;(data.concepts || []).filter(c => c.score < SCORE_PARTIAL).forEach(c => logWrongAnswer({ subject, topic: c.tag, questionId: `prior-recall-${c.tag}`, questionText: c.label, marks: 1, source: 'module', questionType: 'prior-recall' }))
      setResults(data); setPhase('results')
    } catch (err) { if (import.meta.env.DEV) console.error('[PriorKnowledgeRecall] analyseRecall failed:', err); setError('Could not analyse your answer. Check your connection and try again.'); setPhase('input') }
  }

  const recalled = results?.concepts.filter(c => c.score >= SCORE_RECALLED) || []
  const missing = results?.concepts.filter(c => c.score < SCORE_RECALLED) || []
  const hasResults = phase === 'results' && results
  const pressProps = { onMouseDown: () => setIsPressed(true), onMouseUp: () => setIsPressed(false), onMouseLeave: () => setIsPressed(false), onTouchStart: () => setIsPressed(true), onTouchEnd: () => setIsPressed(false) }

  return (
    <CinematicShell style={{ background: GENERAL.backgroundApp, zIndex: 1000, display: 'flex', flexDirection: 'column', animation: 'prk-fade-in 360ms ease both' }}>
      {block.backgroundImage && <div aria-hidden="true" style={{ position: 'fixed', inset: 0, backgroundImage: `linear-gradient(180deg, rgba(8,9,13,0.36), rgba(8,9,13,0.90)), url(${block.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.24, filter: 'brightness(0.95) grayscale(8%)', pointerEvents: 'none', zIndex: 0 }} />}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, background: `radial-gradient(circle at 50% 18%, rgba(${rgb},0.09), transparent 31%), linear-gradient(180deg, rgba(8,9,13,0.16), rgba(8,9,13,0.96) 82%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div className="prk-scroll" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: `calc(14px + env(safe-area-inset-top)) ${SPACING.standard}px calc(${SPACING.separation}px + env(safe-area-inset-bottom))`, overflow: 'auto', filter: hasResults ? 'brightness(0.70)' : 'none', transition: `filter ${MOTION.duration.standard} ${MOTION.easing.gentle}` }}>
        <div style={{ minHeight: 48, marginBottom: SCREEN_TEXT_LAYOUT.titleOffsetTop, flexShrink: 0 }}><ModuleToolbar onBack={onBack} onExit={onExit || onBack} /></div>
        {(phase === 'input' || phase === 'results') && <div style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'prk-fade-in 280ms ease both' }}><div style={{ flex: 1 }}>
          <ScreenTextBlock title="What can you remember?" tone="quiet" inset={false} style={{ paddingTop: 0, paddingBottom: SCREEN_TEXT_LAYOUT.blockGap }} titleStyle={{ ...TYPE.displayScreen, color: '#F5F7FF', marginBottom: SPACING.micro, textWrap: 'balance' }} bodyStyle={{ ...TYPE.bodySmall, color: 'rgba(245,247,255,0.58)', lineHeight: 1.45 }}>Write anything you know before we reveal the gaps.</ScreenTextBlock>
          <RecallTimer secondsLeft={secondsLeft} duration={RECALL_DURATION} ringRgb={ringRgb} rgb={rgb} />
          <MemoryNudges prompts={recallPrompts.slice(0, 4)} />
          <div style={{ position: 'relative', background: 'linear-gradient(180deg, rgba(20,23,29,0.93), rgba(11,13,18,0.96))', border: hasResults ? `1.5px solid rgba(${SUCCESS_RGB},0.44)` : isFocused ? `1.5px solid rgba(${SUCCESS_RGB},0.58)` : `1.5px solid rgba(${rgb},0.28)`, borderRadius: 24, padding: `${SPACING.compact}px ${SPACING.standard}px`, marginBottom: SPACING.standard, boxShadow: hasResults ? `0 0 30px rgba(${SUCCESS_RGB},0.12), inset 0 1px 0 rgba(255,255,255,0.05)` : isFocused ? `0 0 0 1px rgba(${SUCCESS_RGB},0.13), 0 0 36px rgba(${SUCCESS_RGB},0.14), inset 0 1px 0 rgba(255,255,255,0.05)` : `0 0 28px rgba(${rgb},0.09), inset 0 1px 0 rgba(255,255,255,0.04)`, animation: hasResults ? 'prk-complete-glow 900ms ease-out both' : 'none', transition: `border-color ${MOTION.duration.standard} ${MOTION.easing.gentle}, box-shadow ${MOTION.duration.standard} ${MOTION.easing.gentle}` }}>
            <div style={{ position: 'relative' }}>{answer.length === 0 && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><div style={{ ...TYPE.bodyStrong, fontSize: 16, color: 'rgba(245,247,255,0.42)' }}>Type your answer here…</div></div>}<textarea value={answer} onChange={e => { setAnswer(e.target.value); setError(null) }} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} rows={8} disabled={phase === 'results'} aria-label="Write anything you remember" style={{ width: '100%', padding: 0, minHeight: 'clamp(225px, 35vh, 315px)', background: 'transparent', border: 'none', outline: 'none', resize: 'none', ...TYPE.bodySmall, color: '#F5F7FF', lineHeight: 1.7, letterSpacing: '0.01em', caretColor: `rgb(${SUCCESS_RGB})`, opacity: phase === 'results' ? 0.72 : 1 }} /></div>
            <div aria-hidden="true" style={{ position: 'absolute', right: 18, bottom: 16, color: hasResults ? `rgba(${SUCCESS_RGB},0.70)` : `rgba(${SUCCESS_RGB},0.33)`, opacity: 0.9, filter: hasResults ? `drop-shadow(0 0 10px rgba(${SUCCESS_RGB},0.30))` : 'none', transition: `color ${MOTION.duration.standard} ${MOTION.easing.gentle}, filter ${MOTION.duration.standard} ${MOTION.easing.gentle}` }}><FeatherIcon color="currentColor" /></div>
          </div>
          {error && <p style={{ ...TYPE.bodySmall, color: '#E05A52', margin: `0 0 ${SPACING.standard}px` }}>{error}</p>}
        </div><button onClick={submit} disabled={phase === 'results'} {...pressProps} style={{ width: '100%', minHeight: 60, borderRadius: 18, border: `1.5px solid rgba(${rgb},0.62)`, background: `linear-gradient(180deg, rgba(${rgb},0.42), rgba(${rgb},0.18))`, boxShadow: `0 0 34px rgba(${rgb},0.14), inset 0 1px 0 rgba(255,255,255,0.11)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transform: isPressed ? `scale(${MOTION.scale.press})` : 'scale(1)', transition: `transform ${MOTION.duration.fast} ${MOTION.easing.standard}`, flexShrink: 0, opacity: phase === 'results' ? 0.58 : 1 }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 800, color: accent }}>Check my recall</span></button></div>}
        {phase === 'analyzing' && <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'prk-fade-in 280ms ease both' }}><div style={{ width: 44, height: 44, border: '2px solid rgba(255,255,255,0.06)', borderTop: `2px solid ${accent}`, borderRadius: '50%', animation: 'prk-spin 0.85s linear infinite', marginBottom: SPACING.standard }} /><p style={{ ...TYPE.body, color: 'rgba(255,255,255,0.55)', textAlign: 'center', margin: 0 }}>Checking what you remember…</p></div>}
      </div>
      {hasResults && <ResultsOverlay results={results} recalled={recalled} missing={missing} accent={accent} rgb={rgb} onClose={onContinue} />}
    </CinematicShell>
  )
}
