import { useEffect, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

function ensureStyles() {
  if (document.getElementById('qa-styles')) return
  const style = document.createElement('style')
  style.id = 'qa-styles'
  style.textContent = `
    @keyframes qa-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes qa-drift { 0%,100% { transform: scale(1.04) translate3d(-1%, -1%, 0); } 50% { transform: scale(1.07) translate3d(1%, 1%, 0); } }
    @keyframes qa-pulse { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .qa-motion { animation: none !important; transition: none !important; } }
  `
  document.head.appendChild(style)
}

const STEPS = ['read', 'interpret', 'words', 'meaning', 'essay']
const TEMP_MACBETH_BACKGROUND = '/English/Macbeth/heroes/macbeth-generic-banner.svg'

const WORDS = {
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

const MEANING = [
  ['What it means', 'Macbeth asks the stars to hide their light so his ambition cannot be seen. He already knows that what he wants is morally wrong.'],
  ['Why it matters', 'Macbeth is not innocent or simply pushed into evil. He actively chooses to conceal a desire that already belongs to him.'],
  ['Method and effect', 'Shakespeare contrasts light and darkness to show the conflict between judgement and hidden ambition.'],
]

function clean(word) {
  return word.replace(/[“”";,.?!]/g, '').toLowerCase()
}

function Paper({ children, accentRgb, background }) {
  return (
    <section style={{ position: 'relative', padding: '30px 24px', overflow: 'hidden', clipPath: 'polygon(0 2%, 5% 0, 11% 2%, 18% 0, 25% 2%, 34% 0, 43% 2%, 52% 0, 61% 2%, 70% 0, 79% 2%, 88% 0, 95% 2%, 100% 0, 100% 98%, 94% 100%, 87% 98%, 78% 100%, 69% 98%, 60% 100%, 51% 98%, 42% 100%, 33% 98%, 24% 100%, 15% 98%, 7% 100%, 0 98%)', background: `linear-gradient(145deg, rgba(255,255,255,0.045), transparent 42%), ${background}`, boxShadow: '0 22px 58px rgba(0,0,0,0.48)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 5px)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: 14, top: 18, bottom: 18, width: 1, background: `rgba(${accentRgb}, 0.22)` }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </section>
  )
}

function QuoteText({ words, visibleWords, parchment, accent, accentRgb, interactive = false, onWord, centred = false, compact = false }) {
  return (
    <blockquote style={{ margin: 0 }}>
      <p style={{ margin: 0, fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: compact ? 'clamp(24px, 6.8vw, 33px)' : 'clamp(34px, 9.1vw, 46px)', lineHeight: centred ? 1.13 : 1.08, fontWeight: centred ? 500 : 600, letterSpacing: centred ? '-0.025em' : '-0.035em', color: parchment, textAlign: centred ? 'center' : 'left', textWrap: 'balance', textShadow: centred ? '0 16px 40px rgba(0,0,0,0.62)' : 'none' }}>
        {words.map((word, index) => {
          const key = clean(word)
          const marked = Boolean(WORDS[key])
          if (interactive && marked) {
            return <button key={`${word}-${index}`} type="button" onClick={() => onWord(key)} style={{ opacity: index < visibleWords ? 1 : 0, minHeight: 44, padding: '0 0.08em', border: 0, borderBottom: `2px solid rgba(${accentRgb}, 0.75)`, background: `rgba(${accentRgb}, 0.12)`, color: accent, font: 'inherit', lineHeight: 'inherit', cursor: 'pointer' }}>{word}{' '}</button>
          }
          return <span className="qa-motion" key={`${word}-${index}`} style={{ opacity: index < visibleWords ? 1 : 0, transition: 'opacity 0.32s ease', color: !centred && marked ? accent : 'inherit' }}>{word}{' '}</span>
        })}
      </p>
    </blockquote>
  )
}

function EvidenceTags({ evidence, accentRgb }) {
  if (!Array.isArray(evidence) || evidence.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
      {evidence.map(item => (
        <span key={item} style={{ ...TYPE.caption, color: 'rgba(233,225,211,0.86)', padding: '5px 9px', borderRadius: RADII.pill, background: `rgba(${accentRgb}, 0.14)`, border: `1px solid rgba(${accentRgb}, 0.25)` }}>
          “{item}”
        </span>
      ))}
    </div>
  )
}

function FeedbackInsight({ insight, accent, accentRgb }) {
  if (!insight) return null
  return (
    <div style={{ paddingLeft: 14, borderLeft: `2px solid rgba(${accentRgb}, 0.62)` }}>
      <p style={{ ...TYPE.bodyStrong, color: 'rgba(233,225,211,0.92)', margin: 0 }}>{insight.idea}</p>
      <EvidenceTags evidence={insight.evidence} accentRgb={accentRgb} />
      {insight.explanation && <p style={{ ...TYPE.bodySmall, color: 'rgba(233,225,211,0.66)', margin: '10px 0 0' }}>{insight.explanation}</p>}
    </div>
  )
}

function WordSheet({ word, accent, accentRgb, parchment, onClose }) {
  const content = WORDS[word]
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <div role="dialog" aria-modal="true" aria-label={`Word focus: ${word}`} style={{ position: 'fixed', inset: 0, zIndex: 180 }}>
      <button type="button" aria-label="Close word focus" onClick={onClose} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: 'linear-gradient(to top, rgba(13,15,16,0.95), rgba(13,15,16,0.24) 58%, transparent)' }} />
      <div className="qa-motion" style={{ position: 'absolute', left: 12, right: 12, bottom: 'calc(12px + env(safe-area-inset-bottom))', maxWidth: 420, margin: '0 auto', padding: 18, borderRadius: 26, background: 'linear-gradient(180deg, rgba(59,38,38,0.98), rgba(31,28,27,0.99))', border: `1px solid rgba(${accentRgb}, 0.28)`, boxShadow: '0 -22px 70px rgba(0,0,0,0.46)', animation: 'qa-rise 0.24s ease both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <div><div style={{ ...TYPE.label, color: accent, marginBottom: 5 }}>{content.technique}</div><div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 29, color: parchment }}>“{word}”</div></div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: RADII.pill, border: '1px solid rgba(233,225,211,0.16)', background: 'rgba(233,225,211,0.06)', color: parchment, ...TYPE.button }}>×</button>
        </div>
        <p style={{ ...TYPE.body, color: parchment, margin: '0 0 14px' }}>{content.meaning}</p>
        <div style={{ padding: 12, borderRadius: 16, background: `rgba(${accentRgb}, 0.10)`, border: `1px solid rgba(${accentRgb}, 0.18)` }}><div style={{ ...TYPE.label, color: accent, marginBottom: 5 }}>Use it</div><p style={{ ...TYPE.body, color: parchment, margin: 0 }}>{content.sentence}</p></div>
      </div>
    </div>
  )
}

export default function QuoteAnalyser({ block, subject = 'English', onContinue }) {
  useEffect(() => { ensureStyles() }, [])
  const palette = SUBJECTS[subject] || SUBJECTS.English
  const accent = palette.accent
  const accentRgb = palette.accentRgb
  const parchment = palette.palette?.parchment || '#E9E1D3'
  const paper = palette.backgroundSecondary || '#1F1C1B'
  const backgroundImage = block.backgroundImage || TEMP_MACBETH_BACKGROUND
  const words = (block.quote || '').split(' ').filter(Boolean)

  const [step, setStep] = useState('read')
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
    const index = STEPS.indexOf(step)
    if (index < STEPS.length - 1) setStep(STEPS[index + 1])
  }

  function back() {
    const index = STEPS.indexOf(step)
    if (index > 0) setStep(STEPS[index - 1])
  }

  function closeWord() {
    if (activeWord) setOpenedWords(current => new Set([...current, activeWord]))
    setActiveWord(null)
  }

  async function checkInterpretation() {
    const answer = interpretation.trim()
    if (answer.length < 12 || checking) return

    setChecking(true)
    setCheckError('')

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

  function Atmosphere({ cinematic = false }) {
    return <>
      {backgroundImage && <img className="qa-motion" src={backgroundImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: cinematic ? '-3%' : 0, width: cinematic ? '106%' : '100%', height: cinematic ? '106%' : '100%', objectFit: 'cover', objectPosition: block.backgroundPosition || 'center', filter: cinematic ? 'brightness(0.44) saturate(0.78) contrast(1.08)' : 'brightness(0.30) saturate(0.72)', opacity: cinematic ? 0.58 : 0.34, animation: cinematic ? 'qa-drift 18s ease-in-out infinite' : 'none' }} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: cinematic ? `radial-gradient(circle at 50% 46%, rgba(${accentRgb}, 0.14), transparent 41%), linear-gradient(90deg, rgba(0,0,0,0.62), transparent 25%, transparent 75%, rgba(0,0,0,0.62)), linear-gradient(to bottom, rgba(5,5,7,0.22), rgba(5,5,7,0.08) 42%, ${palette.background})` : `linear-gradient(180deg, rgba(${accentRgb}, 0.10), transparent 26%), linear-gradient(to bottom, rgba(8,8,10,0.18), ${palette.background} 88%)` }} />
    </>
  }

  function Nav({ label }) {
    return <div style={{ display: 'flex', alignItems: 'center', minHeight: 42, margin: '0 6px 12px' }}><button type="button" onClick={back} style={{ minHeight: 40, border: 0, background: 'none', color: 'rgba(233,225,211,0.72)', cursor: 'pointer', ...TYPE.label }}>← Back</button><div style={{ flex: 1, textAlign: 'right', ...TYPE.caption, color: `rgba(${accentRgb}, 0.78)` }}>{label}</div></div>
  }

  if (step === 'read') {
    return <div style={outer}>
      <Atmosphere cinematic />
      <main style={{ ...page, paddingLeft: 22, paddingRight: 22 }}>
        <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '8vh 0 5vh' }}>
          <div style={{ width: '100%', maxWidth: 390, transform: 'translateY(-2vh)' }}>
            <QuoteText words={words} visibleWords={visibleWords} parchment={parchment} accent={accent} accentRgb={accentRgb} centred />
            <div className="qa-motion" aria-hidden={!showAttribution} style={{ minHeight: 52, marginTop: 24, opacity: showAttribution ? 1 : 0, transform: showAttribution ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.65s ease, transform 0.65s ease', textAlign: 'center' }}>
              <div aria-hidden="true" style={{ width: 34, height: 1, margin: '0 auto 13px', background: `rgba(${accentRgb}, 0.64)` }} />
              <p style={{ ...TYPE.label, color: 'rgba(233,225,211,0.66)', margin: 0 }}>{block.location}</p>
            </div>
          </div>
        </div>
        <div className="qa-motion" aria-hidden={!showCTA} style={{ opacity: showCTA ? 1 : 0, transform: showCTA ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.55s ease, transform 0.55s ease', pointerEvents: showCTA ? 'auto' : 'none' }}>
          <ContinueCTA onClick={next} label="What do you think it means?" accent={accent} textColor={parchment} />
        </div>
      </main>
    </div>
  }

  if (step === 'interpret') {
    const hints = block.interpretationHints || ['What is the speaker feeling?', 'What do they want?', 'Why might they hide it?']
    return <div style={outer}>
      <Atmosphere cinematic />
      <main style={{ ...page, overflowY: 'auto', paddingLeft: 18, paddingRight: 18 }}>
        <Nav label="Your interpretation" />
        <div className="qa-motion" style={{ padding: '14px 10px 20px', animation: 'qa-rise 0.35s ease both' }}>
          <QuoteText words={words} visibleWords={words.length} parchment={parchment} accent={accent} accentRgb={accentRgb} centred compact />
          <p style={{ ...TYPE.caption, color: 'rgba(233,225,211,0.52)', textAlign: 'center', margin: '10px 0 0' }}>{block.location}</p>
        </div>

        <section className="qa-motion" style={{ marginTop: 8, padding: '22px 18px 18px', borderRadius: 28, background: 'linear-gradient(180deg, rgba(31,28,27,0.98), rgba(15,14,15,0.99))', border: `1px solid rgba(${accentRgb}, 0.28)`, boxShadow: '0 24px 70px rgba(0,0,0,0.42)', animation: 'qa-rise 0.42s ease 0.08s both' }}>
          {!feedback ? <>
            <h2 style={{ ...TYPE.displaySection, color: parchment, margin: 0 }}>{block.interpretationPrompt || 'What do you think this quote reveals?'}</h2>
            <p style={{ ...TYPE.bodySmall, color: 'rgba(233,225,211,0.62)', margin: '9px 0 16px' }}>Use your own words. A rough idea is enough.</p>
            <textarea
              value={interpretation}
              onChange={event => { setInterpretation(event.target.value); setCheckError('') }}
              placeholder={block.interpretationPlaceholder || 'I think Macbeth is showing...'}
              maxLength={1400}
              rows={6}
              aria-label="Your interpretation of the quote"
              style={{ width: '100%', minHeight: 142, resize: 'vertical', boxSizing: 'border-box', padding: '14px 15px', borderRadius: 18, border: `1px solid rgba(${accentRgb}, 0.30)`, outline: 'none', background: 'rgba(233,225,211,0.055)', color: parchment, caretColor: accent, ...TYPE.body, lineHeight: 1.55 }}
            />
            <p style={{ ...TYPE.caption, color: 'rgba(233,225,211,0.46)', margin: '11px 2px 0' }}>Think about: {hints.join(' · ')}</p>
            <div aria-live="polite" style={{ minHeight: checkError || checking ? 34 : 14, marginTop: 8 }}>
              {checking && <p className="qa-motion" style={{ ...TYPE.caption, color: accent, margin: 0, animation: 'qa-pulse 1.2s ease-in-out infinite' }}>Reading your interpretation…</p>}
              {checkError && <p style={{ ...TYPE.caption, color: '#DFA0A8', margin: 0 }}>{checkError}</p>}
            </div>
            <ContinueCTA onClick={checkInterpretation} label={checking ? 'Checking your interpretation…' : 'Check my interpretation'} accent={accent} textColor={parchment} disabled={checking || interpretation.trim().length < 12} style={{ marginTop: 10 }} />
            {checkError && <button type="button" onClick={next} style={{ width: '100%', minHeight: 44, marginTop: 8, border: 0, background: 'none', color: 'rgba(233,225,211,0.60)', cursor: 'pointer', ...TYPE.button }}>Continue without checking</button>}
          </> : <>
            <div style={{ ...TYPE.label, color: accent, marginBottom: 7 }}>What you understood</div>
            <p style={{ ...TYPE.bodyLarge, color: parchment, margin: '0 0 19px' }}>{feedback.verdict}</p>

            <div style={{ padding: '16px 15px', borderRadius: 20, background: 'rgba(233,225,211,0.045)', border: '1px solid rgba(233,225,211,0.10)' }}>
              <div style={{ ...TYPE.label, color: 'rgba(233,225,211,0.72)', marginBottom: 14 }}>{feedback.strengths?.length ? 'You spotted' : 'Your starting point'}</div>
              {feedback.strengths?.length
                ? <div style={{ display: 'grid', gap: 18 }}>{feedback.strengths.map((insight, index) => <FeedbackInsight key={`${insight.idea}-${index}`} insight={insight} accent={accent} accentRgb={accentRgb} />)}</div>
                : <p style={{ ...TYPE.body, color: 'rgba(233,225,211,0.72)', margin: 0 }}>You have made a start. Now we can anchor the idea to the writer’s exact words.</p>}
            </div>

            <div style={{ marginTop: 12, padding: '16px 15px', borderRadius: 20, background: `rgba(${accentRgb}, 0.10)`, border: `1px solid rgba(${accentRgb}, 0.22)` }}>
              <div style={{ ...TYPE.label, color: accent, marginBottom: 14 }}>One more layer</div>
              <FeedbackInsight insight={feedback.nextLayer} accent={accent} accentRgb={accentRgb} />
            </div>

            <ContinueCTA onClick={next} label="Look closer at the words" accent={accent} textColor={parchment} style={{ marginTop: 20 }} />
            <button type="button" onClick={() => { setFeedback(null); setCheckError('') }} style={{ width: '100%', minHeight: 44, marginTop: 7, border: 0, background: 'none', color: 'rgba(233,225,211,0.58)', cursor: 'pointer', ...TYPE.button }}>Edit my answer</button>
          </>}
        </section>
      </main>
    </div>
  }

  if (step === 'words') {
    return <div style={outer}><Atmosphere /><main style={page}><Nav label="Break down words" /><Paper accentRgb={accentRgb} background={paper}>
      <QuoteText words={words} visibleWords={words.length} parchment={parchment} accent={accent} accentRgb={accentRgb} interactive onWord={setActiveWord} />
      <p style={{ ...TYPE.bodyLarge, color: 'rgba(233,225,211,0.78)', margin: '22px 0 0' }}>Tap a marked word to uncover what it is doing.</p>
      {openedWords.size > 0 && <ContinueCTA onClick={next} label="Next: build the meaning" accent={accent} textColor={parchment} style={{ marginTop: 26 }} />}
    </Paper></main>{activeWord && <WordSheet word={activeWord} accent={accent} accentRgb={accentRgb} parchment={parchment} onClose={closeWord} />}</div>
  }

  if (step === 'meaning') {
    return <div style={outer}><Atmosphere /><main style={{ ...page, overflowY: 'auto' }}><Nav label="Build the meaning" /><Paper accentRgb={accentRgb} background={paper}>
      <QuoteText words={words} visibleWords={words.length} parchment={parchment} accent={accent} accentRgb={accentRgb} compact />
      <div style={{ display: 'grid', gap: 20, marginTop: 24 }}>{MEANING.map(([label, text]) => <div key={label} style={{ paddingLeft: 16, borderLeft: `2px solid rgba(${accentRgb}, 0.62)` }}><div style={{ ...TYPE.label, color: accent, marginBottom: 6 }}>{label}</div><p style={{ ...TYPE.body, color: 'rgba(233,225,211,0.84)', margin: 0 }}>{text}</p></div>)}</div>
      <ContinueCTA onClick={next} label="Next: use it in an essay" accent={accent} textColor={parchment} style={{ marginTop: 26 }} />
    </Paper></main></div>
  }

  if (step === 'essay') {
    return <div style={outer}><Atmosphere /><main style={{ ...page, overflowY: 'auto' }}><Nav label="Use it in an essay" /><Paper accentRgb={accentRgb} background={paper}>
      <div style={{ ...TYPE.label, color: accent, marginBottom: 9 }}>In an exam</div>
      <p style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 'clamp(21px, 5.8vw, 27px)', lineHeight: 1.42, color: parchment, margin: 0 }}>Shakespeare uses light and dark imagery in “Stars, hide your fires” to show that Macbeth recognises his ambition is morally corrupt and wants to conceal it from judgement.</p>
      <ContinueCTA onClick={onContinue} label="Continue" accent={accent} textColor={parchment} style={{ marginTop: 26 }} />
    </Paper></main></div>
  }

  return null
}
