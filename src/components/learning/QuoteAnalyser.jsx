import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

function ensureStyles() {
  if (document.getElementById('qa-styles')) return
  const s = document.createElement('style')
  s.id = 'qa-styles'
  s.textContent = `
    @keyframes qa-slide-up { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes qa-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes qa-reveal-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes qa-tick-pop { 0% { transform: scale(0); } 70% { transform: scale(1.18); } 100% { transform: scale(1); } }
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

function cleanWord(w) {
  return w.replace(/[""";,.?!]/g, '').toLowerCase()
}

function RippedSeam({ accentColor }) {
  return (
    <div style={{ position: 'relative', height: 22, margin: '0 0 2px', flexShrink: 0 }}>
      <svg viewBox="0 0 420 24" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
        <path d="M0,12 C16,15 30,9 46,12 C62,15 76,9 92,12 C108,15 122,9 138,12 C154,15 168,9 184,12 C200,15 214,9 230,12 C246,15 260,9 276,12 C292,15 306,9 322,12 C338,15 352,9 368,12 C386,18 402,9 420,12" fill="none" stroke={accentColor} strokeWidth="2" strokeOpacity="0.45" />
        <path d="M0 23H420" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      </svg>
    </div>
  )
}

function FocusBlock({ label, children, accent, parchment }) {
  return (
    <div>
      <div style={{ ...TYPE.metadata, color: accent, textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
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
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: 'linear-gradient(to top, rgba(13,15,16,0.92), rgba(13,15,16,0.12) 58%, transparent)', pointerEvents: 'auto', cursor: 'default' }}
      />
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, maxWidth: 420, margin: '0 auto', padding: '18px 18px 16px', borderRadius: 26, background: 'linear-gradient(180deg, rgba(59,38,38,0.96), rgba(31,28,27,0.98))', border: `1px solid rgba(${accentRgb}, 0.28)`, boxShadow: '0 -22px 70px rgba(0,0,0,0.46)', pointerEvents: 'auto', animation: 'qa-slide-up 0.24s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 13 }}>
          <div>
            <div style={{ ...TYPE.metadata, color: accent, textTransform: 'uppercase', marginBottom: 5 }}>{focus.technique}</div>
            <div style={{ ...TYPE.displaySection, color: parchment }}>"{focus.label}"</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, flexShrink: 0, borderRadius: RADII.pill, border: '1px solid rgba(233,225,211,0.16)', background: 'rgba(233,225,211,0.06)', color: 'rgba(233,225,211,0.76)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', ...TYPE.button }}>×</button>
        </div>
        <div style={{ display: 'grid', gap: 13 }}>
          <FocusBlock label="Meaning" accent={accent} parchment={parchment}>{focus.meaning}</FocusBlock>
          <FocusBlock label="AQA move" accent={accent} parchment={parchment}>{focus.examMove}</FocusBlock>
          <FocusBlock label="Context / link" accent={accent} parchment={parchment}>{focus.context}</FocusBlock>
          <div style={{ padding: '11px 12px', borderRadius: 16, background: `rgba(${accentRgb}, 0.10)`, border: `1px solid rgba(${accentRgb}, 0.18)` }}>
            <div style={{ ...TYPE.metadata, color: accent, textTransform: 'uppercase', marginBottom: 5 }}>Use it</div>
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
        style={{
          display: 'inline-block',
          opacity: isVisible ? 1 : 0,
          color: accent,
          background: isActive ? `rgba(${accentRgb}, 0.24)` : `rgba(${accentRgb}, 0.12)`,
          border: `1px solid rgba(${accentRgb}, ${isActive ? 0.54 : 0.30})`,
          borderBottom: `3px solid rgba(${accentRgb}, ${isActive ? 0.94 : 0.70})`,
          borderRadius: 10,
          boxShadow: isActive
            ? `0 0 10px rgba(${accentRgb}, 0.38), 0 0 28px rgba(${accentRgb}, 0.30), inset 0 0 10px rgba(${accentRgb}, 0.10)`
            : `0 0 10px rgba(${accentRgb}, 0.22), 0 0 24px rgba(${accentRgb}, 0.18), inset 0 0 8px rgba(${accentRgb}, 0.07)`,
          padding: '2px 0.18em 0.06em',
          margin: '0 0.06em 0.14em 0',
          minHeight: 44,
          font: 'inherit',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          textShadow: `0 0 10px rgba(${accentRgb}, 0.55), 0 0 24px rgba(${accentRgb}, 0.34)`,
          cursor: 'pointer',
          transition: 'opacity 0.28s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
          transform: isActive ? 'translateY(-1px)' : 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {word}{' '}
      </button>
    )
  }

  if (shouldHighlight) {
    return (
      <span style={{
        display: 'inline',
        opacity: isVisible ? 1 : 0,
        color: accent,
        borderBottom: `1px solid rgba(${accentRgb}, 0.44)`,
        paddingBottom: '0.04em',
        transition: 'opacity 0.28s ease',
      }}>{word}{' '}</span>
    )
  }

  return (
    <span style={{
      display: 'inline',
      opacity: isVisible ? 1 : 0,
      color: 'inherit',
      textShadow: '0 1px 18px rgba(0,0,0,0.65)',
      transition: 'opacity 0.28s ease',
    }}>{word}{' '}</span>
  )
}

export default function QuoteAnalyser({ block, subject = 'English', onContinue }) {
  useEffect(() => { ensureStyles() }, [])

  const palette = SUBJECTS[subject] || SUBJECTS.English
  const accent = palette.accent
  const accentRgb = palette.accentRgb
  const parchment = palette.palette?.parchment || '#E9E1D3'

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
    minHeight: '100dvh',
    background: `radial-gradient(circle at 50% 0%, rgba(${accentRgb}, 0.16), transparent 34%), ${palette.background}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 0,
  }

  const innerStyle = {
    width: '100%',
    flex: 1,
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    background: `linear-gradient(180deg, rgba(${accentRgb}, 0.10), rgba(7,7,9,0.92) 34%, rgba(8,8,10,0.98))`,
    overflow: 'hidden',
  }

  function renderNav() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px 0', flexShrink: 0 }}>
        {step !== 'read' ? (
          <button
            type="button"
            onClick={goBack}
            style={{ background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', color: `rgba(${accentRgb}, 0.76)`, ...TYPE.caption, fontWeight: 600 }}
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <div style={{ flex: 1, textAlign: 'right', ...TYPE.metadata, color: `rgba(${accentRgb}, 0.52)`, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          {STEP_LABELS[step]}
        </div>
      </div>
    )
  }

  function renderHero(fullHeight) {
    const minH = fullHeight ? 318 : 220
    const quoteSize = fullHeight ? 'clamp(2.18rem, 8.6vw, 3.25rem)' : 'clamp(1.5rem, 5.8vw, 2.2rem)'
    return (
      <div style={{ position: 'relative', minHeight: minH, overflow: 'hidden', flexShrink: 0 }}>
        {block.backgroundImage && (
          <img src={block.backgroundImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.40) saturate(0.82) contrast(1.04)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(6,4,8,0.12) 0%, rgba(8,6,10,0.25) 36%, rgba(8,8,10,0.94) 100%), radial-gradient(circle at 78% 44%, rgba(${accentRgb}, 0.15), transparent 32%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, minHeight: minH, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '30px 26px 22px' }}>
          <blockquote style={{ margin: 0 }}>
            <p style={{ margin: 0, ...TYPE.displayHero, color: parchment, fontSize: quoteSize, lineHeight: 1.08, letterSpacing: '-0.055em' }}>
              {quoteWords.map((word, i) => (
                <QuoteWord
                  key={i}
                  word={word}
                  index={i}
                  visibleWords={visibleWords}
                  accent={accent}
                  accentRgb={accentRgb}
                  interactive={step === 'words'}
                  activeWord={activeWord}
                  onSelect={setActiveWord}
                />
              ))}
            </p>
          </blockquote>
          {block.location && (
            <p style={{ margin: '16px 0 0', ...TYPE.caption, color: 'rgba(233,225,211,0.72)', opacity: visibleWords >= quoteWords.length ? 1 : 0, transition: 'opacity 0.5s ease 0.3s', letterSpacing: '0.01em' }}>
              {block.location}
            </p>
          )}
        </div>
      </div>
    )
  }

  function renderBottomCTA(label, action) {
    return (
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 16px calc(16px + env(safe-area-inset-bottom))', background: `linear-gradient(to top, ${palette.background} 55%, transparent)`, zIndex: 10, animation: 'qa-slide-up 0.4s ease both' }}>
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <ContinueCTA onClick={action} label={label} accent={accent} textColor={parchment} />
        </div>
      </div>
    )
  }

  // ── Page 1: Read ────────────────────────────────────────────
  if (step === 'read') {
    return (
      <div style={outerStyle}>
        <div style={innerStyle}>
          {renderHero(true)}
          <RippedSeam accentColor={accent} />
          {renderNav()}
          <div style={{ flex: 1, padding: '18px 26px 120px', animation: 'qa-fade-in 0.4s ease 0.2s both' }}>
            <p style={{ ...TYPE.bodyLarge, color: 'rgba(233,225,211,0.78)', margin: 0 }}>
              Read it once. What feeling does it create?
            </p>
          </div>
        </div>
        {renderBottomCTA('Start breaking it down', goNext)}
        {activeWord && <WordFocusSheet word={activeWord} accent={accent} accentRgb={accentRgb} parchment={parchment} onClose={handleWordClose} />}
      </div>
    )
  }

  // ── Page 2: Words ───────────────────────────────────────────
  if (step === 'words') {
    return (
      <div style={outerStyle}>
        <div style={innerStyle}>
          {renderHero(false)}
          <RippedSeam accentColor={accent} />
          {renderNav()}
          <div style={{ flex: 1, padding: '14px 26px 120px', display: 'flex', flexDirection: 'column', gap: 10, animation: 'qa-fade-in 0.3s ease 0.1s both' }}>
            <p style={{ ...TYPE.bodyLarge, color: 'rgba(233,225,211,0.78)', margin: 0 }}>
              Tap the highlighted words.
            </p>
            {hasOpenedWord && (
              <p style={{ ...TYPE.caption, color: accent, margin: 0, animation: 'qa-reveal-up 0.3s ease both' }}>
                Good — you've unlocked a word-level idea.
              </p>
            )}
          </div>
        </div>
        {hasOpenedWord && renderBottomCTA('Next: build the meaning', goNext)}
        {activeWord && <WordFocusSheet word={activeWord} accent={accent} accentRgb={accentRgb} parchment={parchment} onClose={handleWordClose} />}
      </div>
    )
  }

  // ── Page 3: Meaning ─────────────────────────────────────────
  if (step === 'meaning') {
    return (
      <div style={outerStyle}>
        <div style={innerStyle}>
          {renderNav()}
          <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
            <div style={{ padding: '14px 16px', borderRadius: 16, background: `rgba(${accentRgb}, 0.07)`, border: `1px solid rgba(${accentRgb}, 0.20)` }}>
              <blockquote style={{ margin: 0 }}>
                <p style={{ margin: 0, ...TYPE.bodyLarge, color: accent, fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{block.quote}"
                </p>
              </blockquote>
              {block.location && (
                <p style={{ margin: '6px 0 0', ...TYPE.caption, color: 'rgba(233,225,211,0.54)' }}>{block.location}</p>
              )}
            </div>
          </div>
          <div style={{ flex: 1, padding: '14px 20px 120px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {MEANING_BLOCKS.map((mb, i) => (
              <div key={mb.id} style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(233,225,211,0.04)', border: '1px solid rgba(233,225,211,0.10)', animation: `qa-reveal-up 0.36s ease ${i * 0.14 + 0.08}s both` }}>
                <div style={{ ...TYPE.metadata, color: accent, textTransform: 'uppercase', marginBottom: 7 }}>{mb.label}</div>
                <p style={{ ...TYPE.body, color: 'rgba(233,225,211,0.82)', margin: 0 }}>{mb.text}</p>
              </div>
            ))}
          </div>
        </div>
        {renderBottomCTA('Next: use it in an essay', goNext)}
      </div>
    )
  }

  // ── Page 4: Essay ───────────────────────────────────────────
  if (step === 'essay') {
    return (
      <div style={outerStyle}>
        <div style={innerStyle}>
          {renderNav()}
          <div style={{ flex: 1, padding: '16px 20px 120px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ animation: 'qa-reveal-up 0.36s ease 0.08s both' }}>
              <div style={{ ...TYPE.metadata, color: `rgba(${accentRgb}, 0.72)`, textTransform: 'uppercase', marginBottom: 10 }}>In an exam</div>
              <div style={{ padding: '16px', borderRadius: 16, background: `rgba(${accentRgb}, 0.09)`, border: `1px solid rgba(${accentRgb}, 0.26)` }}>
                <p style={{ ...TYPE.bodyLarge, color: parchment, margin: 0, lineHeight: 1.5 }}>
                  {EXAM_SENTENCE}
                </p>
              </div>
            </div>
            <div style={{ animation: 'qa-reveal-up 0.36s ease 0.22s both' }}>
              <div style={{ ...TYPE.metadata, color: 'rgba(233,225,211,0.54)', textTransform: 'uppercase', marginBottom: 10 }}>Your scaffold</div>
              <div style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(233,225,211,0.04)', border: '1px solid rgba(233,225,211,0.10)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SCAFFOLD.map((line, i) => (
                  <p key={i} style={{ ...TYPE.body, color: 'rgba(233,225,211,0.72)', margin: 0 }}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        {renderBottomCTA('Continue', onContinue)}
      </div>
    )
  }

  return null
}
