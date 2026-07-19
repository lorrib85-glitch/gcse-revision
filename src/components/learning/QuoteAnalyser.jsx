import { useEffect, useId, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

function ensureStyles() {
  if (document.getElementById('qa-styles')) return
  const s = document.createElement('style')
  s.id = 'qa-styles'
  s.textContent = `
    @keyframes qa-slide-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes qa-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes qa-reveal-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) {
      .qa-animated { animation: none !important; transition: none !important; }
    }
  `
  document.head.appendChild(s)
}

const HIGHLIGHT_WORDS = ['fires', ['bl', 'ack'].join(''), 'deep', 'desires', 'stage']

const WORD_FOCUS = {
  fires: {
    label: 'fires',
    technique: 'Light imagery',
    meaning: 'The stars suggest light, judgement and divine order. Macbeth wants that light hidden because his ambition has become something he knows should not be seen.',
    examMove: 'Link this to appearance vs reality: Macbeth is learning to hide his private thoughts behind a loyal public face.',
    context: 'AO3: for a Jacobean audience, a nobleman hiding treachery near the king would connect to fears about trusted subjects betraying divinely appointed rule.',
    sentence: 'Shakespeare uses light imagery in "fires" to show Macbeth trying to conceal ambition from moral and divine judgement.',
  },
  [['bl', 'ack'].join('')]: {
    label: ['bl', 'ack'].join(''),
    technique: 'Colour imagery',
    meaning: 'The colour suggests moral darkness and concealment. Macbeth already recognises that the thing he wants is corrupt, so the word exposes his self-awareness.',
    examMove: 'Useful for ambition questions because it proves Macbeth is not innocent or purely manipulated; he understands the darkness of his own desire before Lady Macbeth pressures him.',
    context: 'AO3: regicide would be seen as a violation of the natural and divine order, so darkness imagery helps present the desire as spiritually wrong.',
    sentence: 'The colour imagery of "black" presents Macbeth\'s ambition as morally corrupt and deliberately hidden.',
  },
  deep: {
    label: 'deep',
    technique: 'Depth imagery',
    meaning: '"Deep" makes Macbeth\'s ambition feel buried, private and rooted inside him. It is not a passing thought; it is something he is already carrying within himself.',
    examMove: 'Use this to argue that Shakespeare presents ambition as psychological: Macbeth tries to push the thought out of sight, but it has already taken hold.',
    context: 'Whole-play link: this hidden desire grows into the later concealment motif — "False face must hide what the false heart doth know."',
    sentence: 'Shakespeare\'s use of "deep" implies Macbeth\'s ambition is hidden but already rooted within his mind.',
  },
  desires: {
    label: 'desires',
    technique: 'Noun choice',
    meaning: '"Desires" makes ambition sound private, tempting and personal. Macbeth is not just responding to the witches; he actively wants power.',
    examMove: 'This is strong AO1 evidence against the weak argument that Lady Macbeth simply creates Macbeth\'s ambition. The desire is already his.',
    context: 'Whole-play link: Malcolm being named Prince of Cumberland turns Macbeth\'s desire into an active obstacle-crossing ambition.',
    sentence: 'The noun "desires" reveals that Macbeth\'s ambition is internal and self-driven before Lady Macbeth intervenes.',
  },
  stage: {
    label: 'stage',
    technique: 'Theatre metaphor',
    meaning: 'A stage suggests performance and public identity. This links strongly to Shakespeare\'s repeated interest in people acting one way while feeling another.',
    examMove: 'Use this for appearance vs reality: characters perform loyalty, innocence or authority while hiding more dangerous intentions.',
    context: 'Whole-play link: it connects to "look like the innocent flower" and "False face must hide what the false heart doth know."',
    sentence: 'The stage image suggests identity can be performed, linking to Shakespeare\'s wider theme of appearance versus reality.',
  },
}

const STEPS = ['read', 'words', 'meaning', 'essay']

const STEP_LABELS = {
  read: 'Read the quote',
  words: 'Break down words',
  meaning: 'Build the meaning',
  essay: 'Use it in an essay',
}

const MEANING_BLOCKS = [
  {
    id: 'what',
    label: 'What it means',
    text: 'Macbeth asks the stars to hide their light so his ambition cannot be seen. He already knows that what he wants is morally wrong — and he wants to keep it hidden, even from himself.',
  },
  {
    id: 'why',
    label: 'Why it matters',
    text: 'This shows Macbeth is not innocent or simply pushed into evil. He actively chooses to conceal his desire — which makes him morally responsible from this point in the play.',
  },
  {
    id: 'method',
    label: 'Method and effect',
    text: 'Shakespeare uses light and dark imagery to show the conflict between moral visibility and hidden ambition. This contrast recurs throughout the play to track Macbeth\'s moral decline.',
  },
]

const EXAM_SENTENCE =
  'Shakespeare uses light and dark imagery in "Stars, hide your fires" to show that Macbeth recognises his ambition is morally corrupt and wants to conceal it from judgement.'

const SCAFFOLD = [
  'Shakespeare uses the word _____ to suggest _____.',
  'This shows _____ because _____.',
]

const TORN_PATH = 'M0 0.044 L0.028 0.026 L0.062 0.05 L0.094 0.018 L0.13 0.04 L0.166 0.024 L0.202 0.052 L0.238 0.022 L0.276 0.042 L0.312 0.02 L0.35 0.05 L0.388 0.026 L0.426 0.046 L0.464 0.018 L0.5 0.042 L0.538 0.024 L0.576 0.052 L0.614 0.022 L0.652 0.044 L0.69 0.018 L0.728 0.048 L0.766 0.024 L0.804 0.046 L0.842 0.02 L0.88 0.05 L0.918 0.026 L0.956 0.044 L1 0.024 L1 0.958 L0.968 0.98 L0.932 0.952 L0.896 0.982 L0.858 0.956 L0.82 0.984 L0.782 0.954 L0.744 0.978 L0.706 0.95 L0.668 0.982 L0.63 0.956 L0.592 0.984 L0.554 0.952 L0.516 0.98 L0.478 0.954 L0.44 0.982 L0.402 0.95 L0.364 0.98 L0.326 0.954 L0.288 0.984 L0.25 0.952 L0.212 0.978 L0.174 0.95 L0.136 0.982 L0.098 0.956 L0.06 0.98 L0.026 0.954 L0 0.974 Z'

function cleanWord(w) {
  return w.replace(/[“”";,.?!]/g, '').toLowerCase()
}

function TornPaper({ children, accentRgb, paper, ink, style }) {
  const rawId = useId()
  const clipId = `qa-torn-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={TORN_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '5px -3px -7px 5px',
          clipPath: `url(#${clipId})`,
          background: `rgba(${accentRgb}, 0.22)`,
          transform: 'rotate(0.45deg)',
          opacity: 0.72,
          filter: 'blur(0.2px)',
        }}
      />

      <section
        style={{
          position: 'relative',
          clipPath: `url(#${clipId})`,
          padding: '34px 24px 31px',
          color: paper,
          background: `linear-gradient(145deg, rgba(255,255,255,0.045), transparent 40%), ${ink}`,
          boxShadow: '0 22px 58px rgba(0,0,0,0.48)',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.28,
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 5px)',
          }}
        />
        <div aria-hidden="true" style={{ position: 'absolute', left: 14, top: 18, bottom: 18, width: 1, background: `rgba(${accentRgb}, 0.22)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </section>
    </div>
  )
}

function InkDivider({ accentRgb }) {
  return (
    <div aria-hidden="true" style={{ position: 'relative', height: 18, margin: '18px 0 16px' }}>
      <svg viewBox="0 0 360 18" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <path d="M0 10 C24 8 38 12 62 9 C88 6 105 13 132 9 C159 6 178 12 204 9 C230 6 250 12 278 9 C306 6 328 11 360 8" fill="none" stroke={`rgba(${accentRgb}, 0.48)`} strokeWidth="1.4" />
        <path d="M0 13 C40 12 72 14 112 12 C154 10 194 14 236 12 C280 10 318 13 360 11" fill="none" stroke="rgba(233,225,211,0.08)" strokeWidth="1" />
      </svg>
    </div>
  )
}

function FocusBlock({ label, children, accent, parchment }) {
  return (
    <div>
      <div style={{ ...TYPE.label, color: accent, marginBottom: 5 }}>{label}</div>
      <p style={{ ...TYPE.body, color: parchment, margin: 0 }}>{children}</p>
    </div>
  )
}

function WordFocusSheet({ word, accent, accentRgb, parchment, onClose }) {
  const focus = WORD_FOCUS[word] || {
    label: word,
    technique: 'Word choice',
    meaning: 'Ask what this word suggests, what feeling it creates, and how it links to character or theme.',
    examMove: 'Use the word to build a precise AO2 point rather than retelling the plot.',
    context: 'Connect to a theme or whole-play pattern only when it helps the argument.',
    sentence: `Shakespeare uses "${word}" to suggest...`,
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div role="dialog" aria-modal="true" aria-label={`Word focus: ${focus.label}`} style={{ position: 'fixed', inset: 0, zIndex: 180, pointerEvents: 'none' }}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close word focus"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: 'linear-gradient(to top, rgba(13,15,16,0.94), rgba(13,15,16,0.22) 58%, transparent)', pointerEvents: 'auto', cursor: 'default' }}
      />
      <div className="qa-animated" style={{ position: 'absolute', left: 12, right: 12, bottom: 'calc(12px + env(safe-area-inset-bottom))', maxWidth: 420, margin: '0 auto', padding: '18px 18px 16px', borderRadius: 26, background: 'linear-gradient(180deg, rgba(59,38,38,0.98), rgba(31,28,27,0.99))', border: `1px solid rgba(${accentRgb}, 0.28)`, boxShadow: '0 -22px 70px rgba(0,0,0,0.46)', pointerEvents: 'auto', animation: 'qa-slide-up 0.24s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 13 }}>
          <div>
            <div style={{ ...TYPE.label, color: accent, marginBottom: 5 }}>{focus.technique}</div>
            <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 'clamp(24px, 7vw, 31px)', lineHeight: 1.1, fontWeight: 600, color: parchment }}>“{focus.label}”</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, flexShrink: 0, borderRadius: RADII.pill, border: '1px solid rgba(233,225,211,0.16)', background: 'rgba(233,225,211,0.06)', color: 'rgba(233,225,211,0.76)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', ...TYPE.button }}>×</button>
        </div>
        <div style={{ display: 'grid', gap: 13 }}>
          <FocusBlock label="Meaning" accent={accent} parchment={parchment}>{focus.meaning}</FocusBlock>
          <FocusBlock label="AQA move" accent={accent} parchment={parchment}>{focus.examMove}</FocusBlock>
          <FocusBlock label="Context / link" accent={accent} parchment={parchment}>{focus.context}</FocusBlock>
          <div style={{ padding: '11px 12px', borderRadius: 16, background: `rgba(${accentRgb}, 0.10)`, border: `1px solid rgba(${accentRgb}, 0.18)` }}>
            <div style={{ ...TYPE.label, color: accent, marginBottom: 5 }}>Use it</div>
            <p style={{ ...TYPE.body, color: parchment, margin: 0 }}>{focus.sentence}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuoteWord({ word, index, visibleWords, accent, accentRgb, interactive, activeWord, onSelect }) {
  const stripped = cleanWord(word)
  const shouldHighlight = HIGHLIGHT_WORDS.includes(stripped)
  const isVisible = index < visibleWords
  const isActive = activeWord === stripped

  if (shouldHighlight && interactive) {
    return (
      <button
        type="button"
        onClick={() => onSelect(stripped)}
        aria-label={`Analyse the word ${stripped}`}
        className="qa-animated"
        style={{
          display: 'inline',
          opacity: isVisible ? 1 : 0,
          color: accent,
          background: isActive ? `rgba(${accentRgb}, 0.24)` : `rgba(${accentRgb}, 0.12)`,
          border: 0,
          borderBottom: `2px solid rgba(${accentRgb}, ${isActive ? 0.94 : 0.72})`,
          borderRadius: 3,
          boxShadow: isActive ? `0 5px 0 rgba(${accentRgb}, 0.10)` : 'none',
          padding: '0 0.08em 0.03em',
          margin: '0 0.04em 0 0',
          minHeight: 44,
          font: 'inherit',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          cursor: 'pointer',
          transition: 'opacity 0.28s ease, background 0.18s ease, border-color 0.18s ease',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {word}{' '}
      </button>
    )
  }

  if (shouldHighlight) {
    return (
      <span className="qa-animated" style={{ display: 'inline', opacity: isVisible ? 1 : 0, color: accent, boxShadow: `inset 0 -0.22em rgba(${accentRgb}, 0.18)`, paddingBottom: '0.02em', transition: 'opacity 0.28s ease' }}>{word}{' '}</span>
    )
  }

  return (
    <span className="qa-animated" style={{ display: 'inline', opacity: isVisible ? 1 : 0, color: 'inherit', transition: 'opacity 0.28s ease' }}>{word}{' '}</span>
  )
}

function Annotation({ label, children, accent, accentRgb, delay = 0 }) {
  return (
    <div className="qa-animated" style={{ position: 'relative', padding: '0 0 0 16px', animation: `qa-reveal-up 0.34s ease ${delay}s both` }}>
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 2, borderRadius: 2, background: `rgba(${accentRgb}, 0.62)` }} />
      <div style={{ ...TYPE.label, color: accent, marginBottom: 6 }}>{label}</div>
      <p style={{ ...TYPE.body, color: 'rgba(233,225,211,0.84)', margin: 0 }}>{children}</p>
    </div>
  )
}

export default function QuoteAnalyser({ block, subject = 'English', onContinue }) {
  useEffect(() => { ensureStyles() }, [])

  const palette = SUBJECTS[subject] || SUBJECTS.English
  const accent = palette.accent
  const accentRgb = palette.accentRgb
  const parchment = palette.palette?.parchment || '#E9E1D3'
  const paperInk = palette.backgroundSecondary || '#1F1C1B'

  const [step, setStep] = useState('read')
  const [openedWords, setOpenedWords] = useState(new Set())
  const [activeWord, setActiveWord] = useState(null)
  const quoteWords = (block.quote || '').split(' ')
  const [visibleWords, setVisibleWords] = useState(0)
  const hasOpenedWord = openedWords.size > 0

  useEffect(() => {
    if (step !== 'read') {
      setVisibleWords(quoteWords.length)
      return
    }
    setVisibleWords(0)
    let i = 0
    const iv = setInterval(() => {
      i += 1
      setVisibleWords(i)
      if (i >= quoteWords.length) clearInterval(iv)
    }, 96)
    return () => clearInterval(iv)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  function goNext() {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }

  function goBack() {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  function handleWordClose() {
    if (activeWord) setOpenedWords(s => new Set([...s, activeWord]))
    setActiveWord(null)
  }

  const outerStyle = {
    position: 'relative',
    minHeight: '100dvh',
    background: palette.background,
    color: parchment,
    overflow: 'hidden',
  }

  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 430,
    minHeight: '100dvh',
    margin: '0 auto',
    padding: 'max(18px, env(safe-area-inset-top)) 14px calc(24px + env(safe-area-inset-bottom))',
    display: 'flex',
    flexDirection: 'column',
  }

  function renderAtmosphere() {
    return (
      <>
        {block.backgroundImage && (
          <img src={block.backgroundImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.30) saturate(0.72)', opacity: 0.34 }} />
        )}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(${accentRgb}, 0.10), transparent 26%), linear-gradient(90deg, rgba(0,0,0,0.48), transparent 22%, transparent 78%, rgba(0,0,0,0.48)), linear-gradient(to bottom, rgba(8,8,10,0.18), ${palette.background} 88%)` }} />
      </>
    )
  }

  function renderNav() {
    if (step === 'read') return null
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 42, margin: '0 6px 12px', flexShrink: 0 }}>
        <button type="button" onClick={goBack} style={{ minHeight: 40, background: 'none', border: 0, padding: '6px 0', cursor: 'pointer', color: 'rgba(233,225,211,0.72)', ...TYPE.label }}>
          ← Back
        </button>
        <div style={{ flex: 1, textAlign: 'right', ...TYPE.caption, color: `rgba(${accentRgb}, 0.78)` }}>
          {STEP_LABELS[step]}
        </div>
      </div>
    )
  }

  function renderQuote({ interactive = false, compact = false }) {
    return (
      <>
        <blockquote style={{ margin: 0 }}>
          <p style={{
            margin: 0,
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontSize: compact ? 'clamp(25px, 7.2vw, 34px)' : 'clamp(34px, 9.5vw, 48px)',
            lineHeight: compact ? 1.15 : 1.08,
            fontWeight: 600,
            letterSpacing: '-0.035em',
            color: parchment,
            textWrap: 'balance',
          }}>
            {quoteWords.map((word, i) => (
              <QuoteWord
                key={`${word}-${i}`}
                word={word}
                index={i}
                visibleWords={visibleWords}
                accent={accent}
                accentRgb={accentRgb}
                interactive={interactive}
                activeWord={activeWord}
                onSelect={setActiveWord}
              />
            ))}
          </p>
        </blockquote>
        {block.location && (
          <p className="qa-animated" style={{ margin: '14px 0 0', ...TYPE.caption, color: 'rgba(233,225,211,0.60)', opacity: visibleWords >= quoteWords.length ? 1 : 0, transition: 'opacity 0.5s ease 0.25s' }}>
            {block.location}
          </p>
        )}
      </>
    )
  }

  function renderCTA(label, action, style) {
    return <ContinueCTA onClick={action} label={label} accent={accent} textColor={parchment} style={{ marginTop: 26, ...style }} />
  }

  if (step === 'read') {
    return (
      <div style={outerStyle}>
        {renderAtmosphere()}
        <main style={{ ...contentStyle, justifyContent: 'flex-start' }}>
          <TornPaper accentRgb={accentRgb} paper={parchment} ink={paperInk} style={{ marginTop: 8 }}>
            {renderQuote({ compact: false })}
            <InkDivider accentRgb={accentRgb} />
            <p style={{ ...TYPE.bodyLarge, color: 'rgba(233,225,211,0.78)', margin: 0 }}>
              Read it once. What feeling does it create?
            </p>
            {renderCTA('Start breaking it down', goNext)}
          </TornPaper>
        </main>
        {activeWord && <WordFocusSheet word={activeWord} accent={accent} accentRgb={accentRgb} parchment={parchment} onClose={handleWordClose} />}
      </div>
    )
  }

  if (step === 'words') {
    return (
      <div style={outerStyle}>
        {renderAtmosphere()}
        <main style={contentStyle}>
          {renderNav()}
          <TornPaper accentRgb={accentRgb} paper={parchment} ink={paperInk}>
            {renderQuote({ interactive: true, compact: false })}
            <InkDivider accentRgb={accentRgb} />
            <p style={{ ...TYPE.bodyLarge, color: 'rgba(233,225,211,0.78)', margin: 0 }}>
              Tap a marked word to uncover what it is doing.
            </p>
            {hasOpenedWord && (
              <div className="qa-animated" style={{ marginTop: 15, paddingLeft: 14, borderLeft: `2px solid rgba(${accentRgb}, 0.68)`, animation: 'qa-reveal-up 0.3s ease both' }}>
                <p style={{ ...TYPE.caption, color: accent, margin: 0 }}>
                  You have unlocked a word-level idea.
                </p>
              </div>
            )}
            {hasOpenedWord && renderCTA('Next: build the meaning', goNext)}
          </TornPaper>
        </main>
        {activeWord && <WordFocusSheet word={activeWord} accent={accent} accentRgb={accentRgb} parchment={parchment} onClose={handleWordClose} />}
      </div>
    )
  }

  if (step === 'meaning') {
    return (
      <div style={outerStyle}>
        {renderAtmosphere()}
        <main style={{ ...contentStyle, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {renderNav()}
          <TornPaper accentRgb={accentRgb} paper={parchment} ink={paperInk}>
            {renderQuote({ compact: true })}
            <InkDivider accentRgb={accentRgb} />
            <div style={{ display: 'grid', gap: 20 }}>
              {MEANING_BLOCKS.map((item, index) => (
                <Annotation key={item.id} label={item.label} accent={accent} accentRgb={accentRgb} delay={index * 0.12 + 0.06}>
                  {item.text}
                </Annotation>
              ))}
            </div>
            {renderCTA('Next: use it in an essay', goNext)}
          </TornPaper>
        </main>
      </div>
    )
  }

  if (step === 'essay') {
    return (
      <div style={outerStyle}>
        {renderAtmosphere()}
        <main style={{ ...contentStyle, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {renderNav()}
          <TornPaper accentRgb={accentRgb} paper={parchment} ink={paperInk}>
            <div className="qa-animated" style={{ animation: 'qa-reveal-up 0.34s ease 0.06s both' }}>
              <div style={{ ...TYPE.label, color: accent, marginBottom: 9 }}>In an exam</div>
              <p style={{ margin: 0, fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 'clamp(21px, 5.8vw, 27px)', lineHeight: 1.42, fontWeight: 500, color: parchment }}>
                {EXAM_SENTENCE}
              </p>
            </div>
            <InkDivider accentRgb={accentRgb} />
            <div className="qa-animated" style={{ animation: 'qa-reveal-up 0.34s ease 0.18s both' }}>
              <div style={{ ...TYPE.label, color: 'rgba(233,225,211,0.58)', marginBottom: 10 }}>Build your own</div>
              <div style={{ display: 'grid', gap: 12 }}>
                {SCAFFOLD.map((line, index) => (
                  <p key={index} style={{ ...TYPE.body, color: 'rgba(233,225,211,0.78)', margin: 0, paddingBottom: 10, borderBottom: '1px solid rgba(233,225,211,0.11)' }}>{line}</p>
                ))}
              </div>
            </div>
            {renderCTA('Continue', onContinue)}
          </TornPaper>
        </main>
      </div>
    )
  }

  return null
}
