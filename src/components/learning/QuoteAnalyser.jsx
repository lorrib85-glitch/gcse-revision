import { useEffect, useId, useRef, useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CinematicDivider from '../core/CinematicDivider.jsx'

function ensureStyles() {
  if (document.getElementById('qa-styles')) return
  const style = document.createElement('style')
  style.id = 'qa-styles'
  style.textContent = `
    @keyframes qa-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes qa-drift { 0%,100% { transform: scale(1.04) translate3d(-1%, -1%, 0); } 50% { transform: scale(1.07) translate3d(1%, 1%, 0); } }
    @keyframes qa-pulse { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }
    .qa-interpretation-input::placeholder { color: var(--qa-placeholder); opacity: 1; }
    .qa-interpretation-input:focus { border-color: var(--qa-focus-accent) !important; box-shadow: 0 0 0 3px var(--qa-focus-ring); }
    @media (prefers-reduced-motion: reduce) { .qa-motion { animation: none !important; transition: none !important; } }
  `
  document.head.appendChild(style)
}

const BASE_STEPS = ['read', 'interpret', 'words', 'meaning', 'essay']

// Legacy fallbacks keep older content working. New QuoteAnalyser content should
// provide wordAnalysis, meaningSections and essayExample in its data block.
const LEGACY_WORDS = {
  fires: {
    technique: 'Light imagery',
    meaning: 'Light suggests truth, judgement and divine order. Macbeth wants that light hidden because he knows his ambition should not be seen.',
    sentence: 'Shakespeare uses “fires” to show Macbeth trying to conceal ambition from moral and divine judgement.',
  },
  black: {
    technique: 'Colour imagery',
    meaning: '“Black” suggests moral darkness. Macbeth already recognises that what he wants is corrupt.',
    sentence: 'The colour imagery of “black” presents Macbeth’s ambition as morally corrupt and deliberately hidden.',
  },
  deep: {
    technique: 'Depth imagery',
    meaning: '“Deep” makes the ambition feel buried and rooted inside Macbeth rather than like a passing thought.',
    sentence: 'Shakespeare’s use of “deep” implies Macbeth’s ambition is hidden but already established in his mind.',
  },
  desires: {
    technique: 'Noun choice',
    meaning: '“Desires” shows that Macbeth actively wants power. His ambition exists before Lady Macbeth begins influencing him.',
    sentence: 'The noun “desires” reveals that Macbeth’s ambition is internal and self-driven.',
  },
}

const LEGACY_MEANING = [
  ['What it means', 'Macbeth asks the stars to hide their light so his ambition cannot be seen. He already knows that what he wants is morally wrong.'],
  ['Why it matters', 'Macbeth is not innocent or simply pushed into evil. He actively chooses to conceal a desire that already belongs to him.'],
  ['Method and effect', 'Shakespeare contrasts light and darkness to show the conflict between judgement and hidden ambition.'],
]

function clean(word) {
  return word.replace(/[“”";,.?!]/g, '').toLowerCase()
}

function resolveLiteraryMeta(block) {
  const location = String(block.location || '').trim()
  const parts = location.split('—').map(part => part.trim()).filter(Boolean)
  return {
    title: block.workTitle || block.character || block.speaker || (parts.length > 1 ? parts.slice(1).join(' — ') : ''),
    scene: block.sceneLabel || (parts.length > 1 ? parts[0] : location),
  }
}

function resolveContext(block, literaryMeta) {
  const supplied = block.context && typeof block.context === 'object' ? block.context : {}
  const suppliedBeats = Array.isArray(supplied.beats)
    ? supplied.beats.map(beat => String(beat || '').trim()).filter(Boolean).slice(0, 3)
    : []

  if (suppliedBeats.length) {
    return {
      label: String(supplied.label || '').trim(),
      beats: suppliedBeats,
      transition: supplied.transition || '',
      continueLabel: supplied.continueLabel || undefined,
      showWorkTitle: supplied.showWorkTitle === true,
      showScene: supplied.showScene !== false,
    }
  }

  const speaker = block.speaker || block.character || literaryMeta.title || 'The speaker'
  const scene = literaryMeta.scene
  return {
    label: String(supplied.label || '').trim(),
    beats: [scene ? `${speaker} speaks in ${scene}.` : 'This quote comes from a key moment in the text.'],
    transition: supplied.transition || 'Now listen for what the speaker reveals.',
    continueLabel: supplied.continueLabel || undefined,
    showWorkTitle: supplied.showWorkTitle === true,
    showScene: supplied.showScene !== false,
  }
}

function resolveDefaultStarters(block, literaryMeta) {
  if (Array.isArray(block.interpretationStarters) && block.interpretationStarters.length) {
    return block.interpretationStarters.map(item => String(item || '').trim()).filter(Boolean).slice(0, 4)
  }

  const speaker = block.speaker || block.character || literaryMeta.title || 'The speaker'
  return [
    `I think ${speaker} is feeling…`,
    'I think this because the word “…” suggests…',
    `${speaker} wants to hide…`,
    `This reveals that ${speaker} is…`,
  ]
}

function Paper({ children, accentRgb, background }) {
  return (
    <section style={{ position: 'relative', padding: '30px 24px', overflow: 'hidden', clipPath: 'polygon(0 2%, 5% 0, 11% 2%, 18% 0, 25% 2%, 34% 0, 43% 2%, 52% 0, 61% 2%, 70% 0, 79% 2%, 88% 0, 95% 2%, 100% 0, 100% 98%, 94% 100%, 87% 98%, 78% 100%, 69% 98%, 60% 100%, 51% 98%, 42% 100%, 33% 98%, 24% 100%, 15% 98%, 7% 100%, 0 98%)', background: `linear-gradient(145deg, ${GENERAL.surfaceTint}, transparent 42%), ${background}`, boxShadow: GENERAL.shadow.overlay }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: `repeating-linear-gradient(0deg, ${GENERAL.line.faint} 0 1px, transparent 1px 5px)` }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: 14, top: 18, bottom: 18, width: 1, background: `rgba(${accentRgb}, 0.22)` }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </section>
  )
}

function QuoteText({ words, visibleWords, parchment, accentRgb, analysisWords, interactive = false, onWord, variant = 'analysis' }) {
  const centred = variant === 'hero' || variant === 'reference'
  const fontSize = variant === 'hero'
    ? 'clamp(34px, 9.1vw, 46px)'
    : variant === 'reference'
      ? 'clamp(25px, 6.8vw, 30px)'
      : 'clamp(24px, 6.8vw, 33px)'

  return (
    <blockquote style={{ margin: 0 }}>
      <p style={{
        margin: 0,
        fontFamily: "'IBM Plex Serif', Georgia, serif",
        fontSize,
        lineHeight: variant === 'reference' ? 1.2 : centred ? 1.13 : 1.08,
        fontWeight: variant === 'reference' ? 450 : centred ? 500 : 600,
        letterSpacing: variant === 'reference' ? '-0.016em' : centred ? '-0.025em' : '-0.035em',
        color: parchment,
        textAlign: centred ? 'center' : 'left',
        textWrap: 'balance',
        textShadow: centred ? GENERAL.cinematic.actionShadow : 'none',
      }}>
        {words.map((word, index) => {
          const key = clean(word)
          const marked = Boolean(analysisWords[key])
          if (interactive && marked) {
            return <button key={`${word}-${index}`} type="button" onClick={() => onWord(key)} style={{ opacity: index < visibleWords ? 1 : 0, minHeight: 44, padding: '0 0.08em', border: 0, borderBottom: `2px solid rgba(${accentRgb}, 0.75)`, background: `rgba(${accentRgb}, 0.12)`, color: GENERAL.cinematic.textPrimary, font: 'inherit', lineHeight: 'inherit', cursor: 'pointer' }}>{word}{' '}</button>
          }
          return <span className="qa-motion" key={`${word}-${index}`} style={{ opacity: index < visibleWords ? 1 : 0, transition: 'opacity 0.32s ease', color: 'inherit', boxShadow: variant === 'analysis' && marked ? `inset 0 -0.18em rgba(${accentRgb}, 0.22)` : 'none' }}>{word}{' '}</span>
        })}
      </p>
    </blockquote>
  )
}

function LiteraryHeader({ title, scene, onBack, accentRgb, text }) {
  return (
    <header style={{ position: 'relative', minHeight: 64, display: 'grid', placeItems: 'center', padding: '2px 50px 12px' }}>
      <button type="button" onClick={onBack} aria-label="Back" style={{ position: 'absolute', left: 0, top: 4, width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: RADII.pill, border: `1px solid ${GENERAL.line.medium}`, background: GENERAL.surfaceTint, color: text.textSecondary, cursor: 'pointer', ...TYPE.bodyStrong }}>‹</button>
      <div style={{ minWidth: 0, textAlign: 'center' }}>
        {title && <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 19, lineHeight: 1.1, fontStyle: 'italic', color: text.textPrimary, textWrap: 'balance' }}>{title}</div>}
        {scene && <div style={{ ...TYPE.caption, fontSize: 12, color: text.textMuted, marginTop: title ? 3 : 0 }}>{scene}</div>}
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: `linear-gradient(90deg, rgba(${accentRgb}, 0.72) 0 32%, ${GENERAL.line.soft} 32% 100%)` }} />
    </header>
  )
}

function QuoteScene({ words, parchment, accent, accentRgb, analysisWords }) {
  return (
    <section className="qa-motion" style={{ position: 'relative', padding: '28px 16px 20px', animation: 'qa-rise 0.35s ease both' }}>
      <div aria-hidden="true" style={{ position: 'absolute', left: 10, top: 13, fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 50, lineHeight: 1, color: `rgba(${accentRgb}, 0.62)` }}>“</div>
      <QuoteText words={words} visibleWords={words.length} parchment={parchment} accentRgb={accentRgb} analysisWords={analysisWords} variant="reference" />
      <CinematicDivider accent={accent} accentRgb={accentRgb} size="standard" style={{ margin: '22px auto 0' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 'auto 14% 0', height: 24, background: `radial-gradient(ellipse at center, rgba(${accentRgb}, 0.10), transparent 68%)`, filter: 'blur(8px)', opacity: 0.8 }} />
    </section>
  )
}

function StarterPrompts({ starters, heading, expanded, onToggle, onChoose, text }) {
  const regionId = useId()
  if (!starters.length) return null

  return (
    <div style={{ marginTop: 16, borderTop: `1px solid ${GENERAL.line.soft}`, borderBottom: `1px solid ${GENERAL.line.soft}` }}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={regionId}
        onClick={onToggle}
        style={{ width: '100%', minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '13px 0', border: 0, background: 'none', color: text.textPrimary, textAlign: 'left', cursor: 'pointer', ...TYPE.bodyStrong }}
      >
        <span>{heading}</span>
        <span aria-hidden="true" className="qa-motion" style={{ flex: '0 0 auto', color: text.textSecondary, fontSize: 20, lineHeight: 1, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>⌄</span>
      </button>
      {expanded && (
        <div id={regionId} className="qa-motion" style={{ paddingBottom: 6, borderTop: `1px solid ${GENERAL.line.soft}`, animation: 'qa-rise 0.24s ease both' }}>
          {starters.map(starter => (
            <button
              key={starter}
              type="button"
              onClick={() => onChoose(starter)}
              style={{ width: '100%', minHeight: 46, padding: '11px 0', border: 0, borderBottom: `1px solid ${GENERAL.line.soft}`, background: 'none', color: text.textFact, textAlign: 'left', cursor: 'pointer', ...TYPE.bodySmall }}
            >
              {starter}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function EvidenceTags({ evidence, accentRgb }) {
  if (!Array.isArray(evidence) || evidence.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
      {evidence.map(item => (
        <span key={item} style={{ ...TYPE.caption, color: GENERAL.cinematic.textFact, padding: '5px 9px', borderRadius: RADII.pill, background: `rgba(${accentRgb}, 0.14)`, border: `1px solid rgba(${accentRgb}, 0.25)` }}>
          “{item}”
        </span>
      ))}
    </div>
  )
}

function FeedbackInsight({ insight, accentRgb }) {
  if (!insight) return null
  return (
    <div style={{ paddingLeft: 14, borderLeft: `2px solid rgba(${accentRgb}, 0.62)` }}>
      <p style={{ ...TYPE.bodyStrong, color: GENERAL.cinematic.textPrimary, margin: 0 }}>{insight.idea}</p>
      <EvidenceTags evidence={insight.evidence} accentRgb={accentRgb} />
      {insight.explanation && <p style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary, margin: '10px 0 0' }}>{insight.explanation}</p>}
    </div>
  )
}

function WordSheet({ word, analysisWords, accentRgb, parchment, onClose }) {
  const content = analysisWords[word]
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!content) return null

  return (
    <div role="dialog" aria-modal="true" aria-label={`Word focus: ${word}`} style={{ position: 'fixed', inset: 0, zIndex: 180 }}>
      <button type="button" aria-label="Close word focus" onClick={onClose} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: GENERAL.cinematic.overlay }} />
      <div className="qa-motion" style={{ position: 'absolute', left: 12, right: 12, bottom: 'calc(12px + env(safe-area-inset-bottom))', maxWidth: 420, margin: '0 auto', padding: 18, borderRadius: 26, background: 'linear-gradient(180deg, rgba(59,38,38,0.98), rgba(31,28,27,0.99))', border: `1px solid rgba(${accentRgb}, 0.28)`, boxShadow: GENERAL.shadow.overlay, animation: 'qa-rise 0.24s ease both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <div><div style={{ ...TYPE.label, color: GENERAL.cinematic.textSecondary, marginBottom: 5 }}>{content.technique}</div><div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 29, color: parchment }}>“{word}”</div></div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: RADII.pill, border: `1px solid ${GENERAL.line.strong}`, background: GENERAL.surfaceTint, color: parchment, ...TYPE.button }}>×</button>
        </div>
        <p style={{ ...TYPE.body, color: parchment, margin: '0 0 14px' }}>{content.meaning}</p>
        {content.sentence && <div style={{ padding: 12, borderRadius: 16, background: `rgba(${accentRgb}, 0.10)`, border: `1px solid rgba(${accentRgb}, 0.18)` }}><div style={{ ...TYPE.label, color: GENERAL.cinematic.textSecondary, marginBottom: 5 }}>Use it</div><p style={{ ...TYPE.body, color: parchment, margin: 0 }}>{content.sentence}</p></div>}
      </div>
    </div>
  )
}

export default function QuoteAnalyser({ block, subject = 'English', onContinue }) {
  useEffect(() => { ensureStyles() }, [])
  const palette = SUBJECTS[subject] || SUBJECTS.English
  const accent = palette.accent
  const accentRgb = palette.accentRgb
  const parchment = palette.palette?.parchment || GENERAL.feedbackText
  const paper = palette.backgroundSecondary || GENERAL.backgroundSurface
  const backgroundImage = block.backgroundImage || null
  const words = (block.quote || '').split(' ').filter(Boolean)
  const text = GENERAL.cinematic
  const literaryMeta = resolveLiteraryMeta(block)
  const context = resolveContext(block, literaryMeta)
  const steps = ['context', ...BASE_STEPS]
  const analysisWords = block.wordAnalysis && typeof block.wordAnalysis === 'object' ? block.wordAnalysis : LEGACY_WORDS
  const meaningSections = Array.isArray(block.meaningSections) && block.meaningSections.length ? block.meaningSections : LEGACY_MEANING
  const interpretationPrompt = block.interpretationPrompt || 'What do you think this quote reveals?'
  const interpretationInstruction = block.interpretationInstruction || 'Use your own words. A rough idea is enough.'
  const interpretationStarters = resolveDefaultStarters(block, literaryMeta)
  const interpretationStarterHeading = block.interpretationStarterHeading || 'Need a way in?'
  const support = {
    noAnswerTitle: block.interpretationSupport?.noAnswerTitle || 'Give me an idea to work with',
    noAnswerBody: block.interpretationSupport?.noAnswerBody || 'That answer does not explain the quote yet. Try one sentence about what the speaker feels, wants or hides.',
    starterHeading: block.interpretationSupport?.starterHeading || 'Start with one of these:',
    sentenceStarters: (block.interpretationSupport?.sentenceStarters || interpretationStarters.slice(0, 3)).slice(0, 3),
    hint: block.interpretationSupport?.hint || 'Choose one important word from the quote and explain what it suggests.',
    retryLabel: block.interpretationSupport?.retryLabel || 'Try my answer again',
    hintLabel: block.interpretationSupport?.hintLabel || 'Give me one hint',
  }

  const [step, setStep] = useState('context')
  const [visibleWords, setVisibleWords] = useState(0)
  const [showAttribution, setShowAttribution] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [activeWord, setActiveWord] = useState(null)
  const [openedWords, setOpenedWords] = useState(new Set())
  const [reducedMotion, setReducedMotion] = useState(false)
  const [interpretation, setInterpretation] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState('')
  const [showInterpretationHint, setShowInterpretationHint] = useState(false)
  const [promptsExpanded, setPromptsExpanded] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (step !== 'read') {
      setVisibleWords(words.length)
      return undefined
    }
    setShowAttribution(false)
    setShowCTA(false)
    if (reducedMotion) {
      setVisibleWords(words.length)
      setShowAttribution(true)
      setShowCTA(true)
      return undefined
    }
    setVisibleWords(0)
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setVisibleWords(index)
      if (index >= words.length) window.clearInterval(timer)
    }, 125)
    return () => window.clearInterval(timer)
  }, [step, reducedMotion, block.quote]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step !== 'read' || reducedMotion || visibleWords < words.length) return undefined
    const attribution = window.setTimeout(() => setShowAttribution(true), 420)
    const cta = window.setTimeout(() => setShowCTA(true), 1050)
    return () => { window.clearTimeout(attribution); window.clearTimeout(cta) }
  }, [step, reducedMotion, visibleWords, words.length])

  function next() {
    const index = steps.indexOf(step)
    if (index < steps.length - 1) setStep(steps[index + 1])
  }

  function back() {
    const index = steps.indexOf(step)
    if (index > 0) setStep(steps[index - 1])
  }

  function closeWord() {
    if (activeWord) setOpenedWords(current => new Set([...current, activeWord]))
    setActiveWord(null)
  }

  function retryInterpretation(value = '') {
    setInterpretation(value)
    setFeedback(null)
    setCheckError('')
    setShowInterpretationHint(false)
    setPromptsExpanded(false)
  }

  function insertStarter(starter) {
    setInterpretation(current => {
      const existing = current.trimEnd()
      return `${existing}${existing ? '\n' : ''}${starter} `
    })
    setPromptsExpanded(false)
    window.requestAnimationFrame(() => textareaRef.current?.focus())
  }

  async function checkInterpretation() {
    const answer = interpretation.trim()
    if (answer.length < 12 || checking) return

    setChecking(true)
    setCheckError('')
    setShowInterpretationHint(false)

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 25000)

    try {
      const response = await fetch(block.analysisEndpoint || '/api/quoteAnalysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          quote: block.quote,
          location: block.location,
          answer,
          referenceIdeas: block.analysisIdeas || [],
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'The interpretation could not be checked just now')
      setFeedback(data)
    } catch (error) {
      setCheckError(error.name === 'AbortError' ? 'That took too long. Try checking it again.' : error.message)
    } finally {
      window.clearTimeout(timeout)
      setChecking(false)
    }
  }

  const outer = { position: 'relative', minHeight: '100dvh', overflow: 'hidden', background: palette.background, color: parchment }
  const page = { position: 'relative', zIndex: 1, width: '100%', maxWidth: 430, minHeight: '100dvh', margin: '0 auto', padding: 'max(18px, env(safe-area-inset-top)) 14px calc(24px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column' }
  const interpretationLayout = {
    padding: '4px 4px 24px',
    animation: 'qa-rise 0.42s ease 0.08s both',
  }

  function Atmosphere({ cinematic = false }) {
    return <>
      {backgroundImage && <img className="qa-motion" src={backgroundImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: cinematic ? '-3%' : 0, width: cinematic ? '106%' : '100%', height: cinematic ? '106%' : '100%', objectFit: 'cover', objectPosition: block.backgroundPosition || 'center', filter: cinematic ? 'brightness(0.44) saturate(0.78) contrast(1.08)' : 'brightness(0.30) saturate(0.72)', opacity: cinematic ? 0.58 : 0.34, animation: cinematic ? 'qa-drift 18s ease-in-out infinite' : 'none' }} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: cinematic ? `radial-gradient(circle at 50% 42%, rgba(${accentRgb}, 0.12), transparent 43%), linear-gradient(90deg, rgba(0,0,0,0.62), transparent 25%, transparent 75%, rgba(0,0,0,0.62)), linear-gradient(to bottom, rgba(5,5,7,0.20), rgba(5,5,7,0.10) 42%, ${palette.background})` : `linear-gradient(180deg, rgba(${accentRgb}, 0.10), transparent 26%), linear-gradient(to bottom, rgba(8,8,10,0.18), ${palette.background} 88%)` }} />
    </>
  }

  function Nav({ label }) {
    return <div style={{ display: 'flex', alignItems: 'center', minHeight: 36, margin: '0 6px 4px' }}><button type="button" onClick={back} style={{ minHeight: 36, border: 0, background: 'none', color: text.textMuted, cursor: 'pointer', padding: 0, ...TYPE.caption, fontSize: 13 }}>← Back</button><div style={{ flex: 1, textAlign: 'right', ...TYPE.caption, fontSize: 13, color: text.textMuted }}>{label}</div></div>
  }

  if (step === 'context') {
    const hasContextMeta = (context.showWorkTitle && literaryMeta.title) || (context.showScene && literaryMeta.scene)

    return <div style={outer}>
      <Atmosphere cinematic />
      <main style={{ ...page, paddingLeft: 22, paddingRight: 22 }}>
        {hasContextMeta && (
          <div style={{ textAlign: 'center', paddingTop: 4 }}>
            {context.showWorkTitle && literaryMeta.title && <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 19, fontStyle: 'italic', color: text.textPrimary }}>{literaryMeta.title}</div>}
            {context.showScene && literaryMeta.scene && <div style={{ ...TYPE.caption, color: text.textMuted, marginTop: context.showWorkTitle && literaryMeta.title ? 4 : 0 }}>{literaryMeta.scene}</div>}
          </div>
        )}
        <div style={{ padding: 'clamp(44px, 6.5vh, 70px) 4px 32px' }}>
          {context.label && <div className="qa-motion" style={{ ...TYPE.label, color: text.textSecondary, marginBottom: 16, animation: 'qa-rise 0.45s ease both' }}>{context.label}</div>}
          <div style={{ display: 'grid', gap: 14 }}>
            {context.beats.map((beat, index) => (
              <p key={`${beat}-${index}`} className="qa-motion" style={{ ...TYPE.displaySection, fontWeight: 480, color: text.textPrimary, margin: 0, animation: `qa-rise 0.55s ease ${index * 0.32}s both` }}>{beat}</p>
            ))}
          </div>
          {context.transition && <p className="qa-motion" style={{ ...TYPE.bodyLarge, color: text.textSecondary, fontStyle: 'italic', margin: '24px 0 0', animation: `qa-rise 0.55s ease ${context.beats.length * 0.32 + 0.18}s both` }}>{context.transition}</p>}
          <div className="qa-motion" style={{ marginTop: 24, animation: `qa-rise 0.55s ease ${context.beats.length * 0.32 + 0.5}s both` }}>
            <ContinueCTA onClick={next} label={context.continueLabel} accent={accent} textColor={parchment} />
          </div>
        </div>
      </main>
    </div>
  }

  if (step === 'read') {
    return <div style={outer}>
      <Atmosphere cinematic />
      <main style={{ ...page, paddingLeft: 22, paddingRight: 22 }}>
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '8vh 0 5vh' }}>
          <div style={{ width: '100%', maxWidth: 390, transform: 'translateY(-2vh)' }}>
            <QuoteText words={words} visibleWords={visibleWords} parchment={parchment} accentRgb={accentRgb} analysisWords={analysisWords} variant="hero" />
            <div className="qa-motion" aria-hidden={!showAttribution} style={{ minHeight: 52, marginTop: 24, opacity: showAttribution ? 1 : 0, transform: showAttribution ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.65s ease, transform 0.65s ease', textAlign: 'center' }}>
              <div aria-hidden="true" style={{ width: 34, height: 1, margin: '0 auto 13px', background: `rgba(${accentRgb}, 0.64)` }} />
              <p style={{ ...TYPE.label, color: text.textSecondary, margin: 0 }}>{block.location}</p>
            </div>
          </div>
        </div>
        <div className="qa-motion" aria-hidden={!showCTA} style={{ opacity: showCTA ? 1 : 0, transform: showCTA ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.55s ease, transform 0.55s ease', pointerEvents: showCTA ? 'auto' : 'none' }}>
          <ContinueCTA onClick={next} label={block.quoteContinueLabel || 'What do you think it means?'} accent={accent} textColor={parchment} />
        </div>
      </main>
    </div>
  }

  if (step === 'interpret') {
    const needsRetry = Boolean(feedback) && (
      feedback.responseQuality === 'non_answer'
      || (!feedback.responseQuality && feedback.understanding === 'starting' && !feedback.strengths?.length)
    )

    return <div style={outer}>
      <Atmosphere cinematic />
      <main style={{ ...page, overflowY: 'auto', paddingLeft: 18, paddingRight: 18 }}>
        <LiteraryHeader title={literaryMeta.title} scene={literaryMeta.scene} onBack={back} accentRgb={accentRgb} text={text} />
        <QuoteScene words={words} parchment={parchment} accent={accent} accentRgb={accentRgb} analysisWords={analysisWords} />

        <section className="qa-motion" style={interpretationLayout}>
          {!feedback ? <>
            <h1 style={{ ...TYPE.displaySection, color: text.textPrimary, margin: 0, maxWidth: 350 }}>{interpretationPrompt}</h1>
            <p style={{ ...TYPE.bodySmall, color: text.textSecondary, margin: '9px 0 17px' }}>{interpretationInstruction}</p>
            <textarea
              ref={textareaRef}
              className="qa-interpretation-input"
              value={interpretation}
              onChange={event => { setInterpretation(event.target.value); setCheckError('') }}
              placeholder={block.interpretationPlaceholder || 'Write your interpretation...'}
              maxLength={1400}
              rows={5}
              aria-label="Your interpretation of the quote"
              style={{
                '--qa-focus-accent': accent,
                '--qa-focus-ring': `rgba(${accentRgb}, 0.18)`,
                '--qa-placeholder': text.textMuted,
                width: '100%',
                height: 138,
                minHeight: 138,
                resize: 'vertical',
                boxSizing: 'border-box',
                padding: '15px 16px',
                borderRadius: 16,
                border: `1px solid ${GENERAL.line.strong}`,
                outline: 'none',
                background: GENERAL.surfaceTint,
                color: parchment,
                caretColor: parchment,
                transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                ...TYPE.bodyStrong,
                fontWeight: 400,
                lineHeight: 1.55,
              }}
            />
            <StarterPrompts
              starters={interpretationStarters}
              heading={interpretationStarterHeading}
              expanded={promptsExpanded}
              onToggle={() => setPromptsExpanded(current => !current)}
              onChoose={insertStarter}
              text={text}
            />
            <div aria-live="polite" style={{ minHeight: checkError || checking ? 30 : 8, marginTop: 8 }}>
              {checking && <p className="qa-motion" style={{ ...TYPE.caption, color: text.textSecondary, margin: 0, animation: 'qa-pulse 1.2s ease-in-out infinite' }}>Reading your interpretation…</p>}
              {checkError && <p style={{ ...TYPE.caption, color: GENERAL.errorSoft, margin: 0 }}>{checkError}</p>}
            </div>
            <ContinueCTA onClick={checkInterpretation} label={checking ? 'Checking your interpretation…' : 'Check my interpretation'} accent={accent} textColor={parchment} disabled={checking || interpretation.trim().length < 12} style={{ marginTop: 8 }} />
            {checkError && <button type="button" onClick={next} style={{ width: '100%', minHeight: 44, marginTop: 8, border: 0, background: 'none', color: text.textSecondary, cursor: 'pointer', ...TYPE.button }}>Continue without checking</button>}
          </> : needsRetry ? <>
            <h1 style={{ ...TYPE.displaySection, color: text.textPrimary, margin: 0 }}>{support.noAnswerTitle}</h1>
            <p style={{ ...TYPE.body, color: text.textSecondary, margin: '10px 0 17px' }}>{support.noAnswerBody}</p>

            <div style={{ ...TYPE.label, color: text.textSecondary, marginBottom: 5 }}>{support.starterHeading}</div>
            <div style={{ borderTop: `1px solid ${GENERAL.line.soft}` }}>
              {support.sentenceStarters.map(starter => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => retryInterpretation(`${starter} `)}
                  style={{ minHeight: 48, width: '100%', padding: '11px 2px', border: 0, borderBottom: `1px solid ${GENERAL.line.soft}`, background: 'none', color: text.textPrimary, textAlign: 'left', cursor: 'pointer', ...TYPE.bodySmall }}
                >
                  {starter}
                </button>
              ))}
            </div>

            {showInterpretationHint && (
              <div aria-live="polite" style={{ marginTop: 14, paddingLeft: 13, borderLeft: `2px solid rgba(${accentRgb}, 0.62)` }}>
                <div style={{ ...TYPE.label, color: text.textSecondary, marginBottom: 5 }}>One hint</div>
                <p style={{ ...TYPE.bodySmall, color: text.textPrimary, margin: 0 }}>{support.hint}</p>
              </div>
            )}

            <ContinueCTA onClick={() => retryInterpretation('')} label={support.retryLabel} accent={accent} textColor={parchment} style={{ marginTop: 18 }} />
            <button type="button" onClick={() => setShowInterpretationHint(current => !current)} style={{ width: '100%', minHeight: 44, marginTop: 7, border: 0, background: 'none', color: text.textSecondary, cursor: 'pointer', ...TYPE.button }}>{support.hintLabel}</button>
          </> : <>
            <div style={{ ...TYPE.label, color: text.textSecondary, marginBottom: 7 }}>What you understood</div>
            <p style={{ ...TYPE.bodyLarge, color: text.textPrimary, margin: '0 0 19px' }}>{feedback.verdict}</p>

            <div style={{ paddingTop: 16, borderTop: `1px solid ${GENERAL.line.soft}` }}>
              <div style={{ ...TYPE.label, color: text.textSecondary, marginBottom: 14 }}>{feedback.strengths?.length ? 'You spotted' : 'Your starting point'}</div>
              {feedback.strengths?.length
                ? <div style={{ display: 'grid', gap: 18 }}>{feedback.strengths.map((insight, index) => <FeedbackInsight key={`${insight.idea}-${index}`} insight={insight} accentRgb={accentRgb} />)}</div>
                : <p style={{ ...TYPE.body, color: text.textSecondary, margin: 0 }}>You have made a start. Now connect the idea to one exact word from the quote.</p>}
            </div>

            <div style={{ margin: '20px -4px 0', padding: '18px 4px 18px 16px', background: `linear-gradient(90deg, rgba(${accentRgb}, 0.13), rgba(${accentRgb}, 0.03) 72%, transparent)`, borderTop: `1px solid rgba(${accentRgb}, 0.22)`, borderBottom: `1px solid rgba(${accentRgb}, 0.18)` }}>
              <div style={{ ...TYPE.label, color: text.textPrimary, marginBottom: 14 }}>One more layer</div>
              <FeedbackInsight insight={feedback.nextLayer} accentRgb={accentRgb} />
            </div>

            <ContinueCTA onClick={next} label="Look closer at the words" accent={accent} textColor={parchment} style={{ marginTop: 20 }} />
            <button type="button" onClick={() => retryInterpretation(interpretation)} style={{ width: '100%', minHeight: 44, marginTop: 7, border: 0, background: 'none', color: text.textSecondary, cursor: 'pointer', ...TYPE.button }}>Edit my answer</button>
          </>}
        </section>
      </main>
    </div>
  }

  if (step === 'words') {
    return <div style={outer}><Atmosphere /><main style={page}><Nav label={block.wordAnalysisLabel || 'Break down words'} /><Paper accentRgb={accentRgb} background={paper}>
      <QuoteText words={words} visibleWords={words.length} parchment={parchment} accentRgb={accentRgb} analysisWords={analysisWords} interactive onWord={setActiveWord} />
      <p style={{ ...TYPE.bodyLarge, color: text.textSecondary, margin: '22px 0 0' }}>{block.wordAnalysisInstruction || 'Tap a marked word to uncover what it is doing.'}</p>
      {openedWords.size > 0 && <ContinueCTA onClick={next} label={block.meaningContinueLabel || 'Next: build the meaning'} accent={accent} textColor={parchment} style={{ marginTop: 26 }} />}
    </Paper></main>{activeWord && <WordSheet word={activeWord} analysisWords={analysisWords} accentRgb={accentRgb} parchment={parchment} onClose={closeWord} />}</div>
  }

  if (step === 'meaning') {
    return <div style={outer}><Atmosphere /><main style={{ ...page, overflowY: 'auto' }}><Nav label={block.meaningLabel || 'Build the meaning'} /><Paper accentRgb={accentRgb} background={paper}>
      <QuoteText words={words} visibleWords={words.length} parchment={parchment} accentRgb={accentRgb} analysisWords={analysisWords} />
      <div style={{ display: 'grid', gap: 20, marginTop: 24 }}>{meaningSections.map((section, index) => {
        const label = Array.isArray(section) ? section[0] : section.label
        const body = Array.isArray(section) ? section[1] : section.body
        return <div key={`${label}-${index}`} style={{ paddingLeft: 16, borderLeft: `2px solid rgba(${accentRgb}, 0.62)` }}><div style={{ ...TYPE.label, color: text.textSecondary, marginBottom: 6 }}>{label}</div><p style={{ ...TYPE.body, color: text.textFact, margin: 0 }}>{body}</p></div>
      })}</div>
      <ContinueCTA onClick={next} label={block.essayContinueLabel || 'Next: use it in an essay'} accent={accent} textColor={parchment} style={{ marginTop: 26 }} />
    </Paper></main></div>
  }

  if (step === 'essay') {
    return <div style={outer}><Atmosphere /><main style={{ ...page, overflowY: 'auto' }}><Nav label={block.essayNavLabel || 'Use it in an essay'} /><Paper accentRgb={accentRgb} background={paper}>
      <div style={{ ...TYPE.label, color: text.textSecondary, marginBottom: 9 }}>{block.essayLabel || 'In an exam'}</div>
      <p style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 'clamp(21px, 5.8vw, 27px)', lineHeight: 1.42, color: parchment, margin: 0 }}>{block.essayExample || 'Use the quote as precise evidence, then analyse one word or method and explain what it reveals.'}</p>
      <ContinueCTA onClick={onContinue} label={block.finalContinueLabel || 'Continue'} accent={accent} textColor={parchment} style={{ marginTop: 26 }} />
    </Paper></main></div>
  }

  return null
}
