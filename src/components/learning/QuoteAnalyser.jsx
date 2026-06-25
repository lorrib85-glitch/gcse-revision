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
    @keyframes qa-card-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes qa-tick-pop { 0% { transform: scale(0); } 70% { transform: scale(1.18); } 100% { transform: scale(1); } }
  `
  document.head.appendChild(s)
}

const ICON_MAP = {
  search: '⌕',
  feather: '⌁',
  mask: '◌',
  bulb: '◍',
  flame: '◇',
}

const HIGHLIGHT_WORDS = ['fires', ['bl', 'ack'].join(''), 'deep', 'desires', 'stage']

const WORD_FOCUS = {
  fires: {
    label: 'fires',
    technique: 'Light imagery',
    meaning: 'The stars suggest light, judgement and divine order. Macbeth wants that light hidden because his ambition has become something he knows should not be seen.',
    examMove: 'Link this to appearance vs reality: Macbeth is learning to hide his private thoughts behind a loyal public face.',
    context: 'AO3: for a Jacobean audience, a nobleman hiding treachery near the king would connect to fears about trusted subjects betraying divinely appointed rule.',
    sentence: 'Shakespeare uses light imagery in “fires” to show Macbeth trying to conceal ambition from moral and divine judgement.',
  },
  [['bl', 'ack'].join('')]: {
    label: ['bl', 'ack'].join(''),
    technique: 'Colour imagery',
    meaning: 'The colour suggests moral darkness and concealment. Macbeth already recognises that the thing he wants is corrupt, so the word exposes his self-awareness.',
    examMove: 'Useful for ambition questions because it proves Macbeth is not innocent or purely manipulated; he understands the darkness of his own desire before Lady Macbeth pressures him.',
    context: 'AO3: regicide would be seen as a violation of the natural and divine order, so darkness imagery helps present the desire as spiritually wrong.',
    sentence: 'The colour imagery of “black” presents Macbeth’s ambition as morally corrupt and deliberately hidden.',
  },
  deep: {
    label: 'deep',
    technique: 'Depth imagery',
    meaning: '“Deep” makes Macbeth’s ambition feel buried, private and rooted inside him. It is not a passing thought; it is something he is already carrying within himself.',
    examMove: 'Use this to argue that Shakespeare presents ambition as psychological: Macbeth tries to push the thought out of sight, but it has already taken hold.',
    context: 'Whole-play link: this hidden desire grows into the later concealment motif: “False face must hide what the false heart doth know.”',
    sentence: 'Shakespeare’s use of “deep” implies Macbeth’s ambition is hidden but already rooted within his mind.',
  },
  desires: {
    label: 'desires',
    technique: 'Noun choice',
    meaning: '“Desires” makes ambition sound private, tempting and personal. Macbeth is not just responding to the witches; he actively wants power.',
    examMove: 'This is strong AO1 evidence against the weak argument that Lady Macbeth simply creates Macbeth’s ambition. The desire is already his.',
    context: 'Whole-play link: Malcolm being named Prince of Cumberland turns Macbeth’s desire into an active obstacle-crossing ambition.',
    sentence: 'The noun “desires” reveals that Macbeth’s ambition is internal and self-driven before Lady Macbeth intervenes.',
  },
  stage: {
    label: 'stage',
    technique: 'Theatre metaphor',
    meaning: 'A stage suggests performance and public identity. This links strongly to Shakespeare’s repeated interest in people acting one way while feeling another.',
    examMove: 'Use this for appearance vs reality: characters perform loyalty, innocence or authority while hiding more dangerous intentions.',
    context: 'Whole-play link: it connects to “look like the innocent flower” and “False face must hide what the false heart doth know.”',
    sentence: 'The stage image suggests identity can be performed, linking to Shakespeare’s wider theme of appearance versus reality.',
  },
}

function cleanWord(word) {
  return word.replace(/[“”";,.]/g, '').toLowerCase()
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

function AnalysisCard({ item, accentRgb, accent, seen, index, onClick, itemCount }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        background: 'transparent',
        border: 0,
        borderBottom: index < itemCount - 1 ? '1px solid rgba(233,225,211,0.10)' : 0,
        padding: '13px 0',
        display: 'grid',
        gridTemplateColumns: '54px 1fr 42px',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        textAlign: 'left',
        animation: `qa-card-in 0.34s ease both`,
        animationDelay: `${index * 0.05 + 0.16}s`,
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: RADII.pill,
        background: `linear-gradient(145deg, rgba(${accentRgb}, 0.22), rgba(233,225,211,0.035))`,
        border: `1px solid rgba(${accentRgb}, ${seen ? 0.34 : 0.20})`,
        boxShadow: seen ? `0 0 18px rgba(${accentRgb}, 0.17)` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: accent,
        fontSize: 24,
        lineHeight: 1,
      }} aria-hidden="true">
        {ICON_MAP[item.icon] || ICON_MAP.search}
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ ...TYPE.cardTitle, color: seen ? accent : '#E9E1D3', marginBottom: 3, fontSize: '0.98rem', lineHeight: 1.16 }}>
          {item.heading}
        </div>
        <div style={{ ...TYPE.captionText, color: 'rgba(233,225,211,0.78)', lineHeight: 1.35 }}>
          {item.explainer}
        </div>
      </div>

      <div style={{
        width: 38,
        height: 38,
        borderRadius: RADII.pill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: seen ? `rgba(${accentRgb}, 0.92)` : 'rgba(233,225,211,0.045)',
        border: seen ? `1px solid rgba(${accentRgb}, 0.95)` : '1px solid rgba(233,225,211,0.08)',
        boxShadow: seen ? `0 0 20px rgba(${accentRgb}, 0.24)` : 'none',
        color: seen ? '#1B1113' : 'rgba(233,225,211,0.52)',
        fontSize: seen ? 16 : 26,
      }}>
        {seen ? <span aria-label="Seen" style={{ animation: 'qa-tick-pop 0.28s cubic-bezier(0.34,1.56,0.64,1) both' }}>✓</span> : <span aria-hidden="true">›</span>}
      </div>
    </button>
  )
}

function ItemExpanded({ item, accent, accentRgb, parchment, palette, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div role="dialog" aria-modal="true" aria-label={item.heading} style={{ position: 'fixed', inset: 0, zIndex: 200, background: palette.backgroundSecondary || palette.background, display: 'flex', flexDirection: 'column', animation: 'qa-slide-up 0.32s cubic-bezier(0.16,1,0.3,1) both' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 420, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '52px 20px 18px', borderBottom: `1px solid rgba(${accentRgb}, 0.14)`, flexShrink: 0 }}>
          <div style={{ width: 52, height: 52, flexShrink: 0, background: `rgba(${accentRgb}, 0.12)`, border: `1px solid rgba(${accentRgb}, 0.28)`, borderRadius: RADII.pill, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 24 }} aria-hidden="true">
            {ICON_MAP[item.icon] || ICON_MAP.search}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...TYPE.sectionHeading, color: parchment }}>{item.heading}</div>
            <div style={{ ...TYPE.captionText, color: 'rgba(233,225,211,0.72)', marginTop: 2 }}>{item.explainer}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: RADII.pill, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', ...TYPE.buttonText }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px 28px', WebkitOverflowScrolling: 'touch' }}>
          {item.content.title && <div style={{ ...TYPE.metadataText, color: accent, textTransform: 'uppercase', marginBottom: 14 }}>{item.content.title}</div>}
          <p style={{ ...TYPE.bodyLarge, color: parchment, margin: 0 }}>{item.content.body}</p>
          {item.content.keyWords?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ ...TYPE.metadataText, color: 'rgba(233,225,211,0.58)', textTransform: 'uppercase', marginBottom: 10 }}>Key words</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {item.content.keyWords.map(word => <span key={word} style={{ background: `rgba(${accentRgb}, 0.12)`, border: `1px solid rgba(${accentRgb}, 0.28)`, color: accent, borderRadius: RADII.small, padding: '5px 12px', ...TYPE.captionText, fontWeight: 600 }}>{word}</span>)}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 16px calc(12px + env(safe-area-inset-bottom))', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <ContinueCTA onClick={onClose} label="Done ✓" accent={accent} textColor={parchment} />
        </div>
      </div>
    </div>
  )
}

function FocusBlock({ label, children, accent, parchment }) {
  return (
    <div>
      <div style={{ ...TYPE.metadataText, color: accent, textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
      <p style={{ ...TYPE.bodyText, color: parchment, margin: 0 }}>{children}</p>
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
    sentence: `Shakespeare uses “${word}” to suggest...`,
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={`Word focus: ${focus.label}`} style={{ position: 'fixed', inset: 0, zIndex: 180, pointerEvents: 'none' }}>
      <button type="button" onClick={onClose} aria-label="Close word focus" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: 'linear-gradient(to top, rgba(13,15,16,0.92), rgba(13,15,16,0.12) 58%, transparent)', pointerEvents: 'auto' }} />
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, maxWidth: 420, margin: '0 auto', padding: '18px 18px 16px', borderRadius: 26, background: 'linear-gradient(180deg, rgba(59,38,38,0.96), rgba(31,28,27,0.98))', border: `1px solid rgba(${accentRgb}, 0.28)`, boxShadow: '0 -22px 70px rgba(0,0,0,0.46)', pointerEvents: 'auto', animation: 'qa-slide-up 0.24s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 13 }}>
          <div>
            <div style={{ ...TYPE.metadataText, color: accent, textTransform: 'uppercase', marginBottom: 5 }}>{focus.technique}</div>
            <div style={{ ...TYPE.sectionHeading, color: parchment }}>“{focus.label}”</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: RADII.pill, border: '1px solid rgba(233,225,211,0.16)', background: 'rgba(233,225,211,0.06)', color: 'rgba(233,225,211,0.76)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', ...TYPE.buttonText }}>×</button>
        </div>

        <div style={{ display: 'grid', gap: 13 }}>
          <FocusBlock label="Meaning" accent={accent} parchment={parchment}>{focus.meaning}</FocusBlock>
          <FocusBlock label="AQA move" accent={accent} parchment={parchment}>{focus.examMove}</FocusBlock>
          <FocusBlock label="Context / link" accent={accent} parchment={parchment}>{focus.context}</FocusBlock>
          <div style={{ padding: '11px 12px', borderRadius: 16, background: `rgba(${accentRgb}, 0.10)`, border: `1px solid rgba(${accentRgb}, 0.18)` }}>
            <div style={{ ...TYPE.metadataText, color: accent, textTransform: 'uppercase', marginBottom: 5 }}>Use it</div>
            <p style={{ ...TYPE.bodyText, color: parchment, margin: 0 }}>{focus.sentence}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuoteWord({ word, index, visibleWords, accent, accentRgb, activeWord, onSelect }) {
  const stripped = cleanWord(word)
  const shouldHighlight = HIGHLIGHT_WORDS.includes(stripped)
  const isVisible = index < visibleWords
  const isActive = activeWord === stripped

  if (shouldHighlight) {
    return (
      <button type="button" onClick={() => onSelect(stripped)} aria-label={`Analyse the word ${stripped}`} style={{ display: 'inline-block', opacity: isVisible ? 1 : 0, color: accent, background: isActive ? `rgba(${accentRgb}, 0.24)` : `rgba(${accentRgb}, 0.10)`, border: `1px solid rgba(${accentRgb}, ${isActive ? 0.52 : 0.28})`, borderBottom: `3px solid rgba(${accentRgb}, ${isActive ? 0.92 : 0.66})`, borderRadius: 10, boxShadow: isActive ? `0 0 20px rgba(${accentRgb}, 0.28)` : `0 0 12px rgba(${accentRgb}, 0.14)`, padding: '0 0.12em 0.03em', margin: '0 0.06em 0.12em 0', font: 'inherit', lineHeight: 'inherit', letterSpacing: 'inherit', textShadow: `0 0 18px ${accent}55`, cursor: 'pointer', transition: 'opacity 0.28s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease', transform: isActive ? 'translateY(-1px)' : 'none', WebkitTapHighlightColor: 'transparent' }}>
        {word}{' '}
      </button>
    )
  }

  return <span style={{ display: 'inline', opacity: isVisible ? 1 : 0, color: 'inherit', textShadow: '0 1px 18px rgba(0,0,0,0.65)', transition: 'opacity 0.28s ease' }}>{word}{' '}</span>
}

export default function QuoteAnalyser({ block, subject = 'English', onContinue }) {
  useEffect(() => { ensureStyles() }, [])

  const palette = SUBJECTS[subject] || SUBJECTS.English
  const accent = palette.accent
  const accentRgb = palette.accentRgb
  const parchment = palette.palette?.parchment || '#E9E1D3'

  const [seen, setSeen] = useState(new Set())
  const [activeItem, setActiveItem] = useState(null)
  const [activeWord, setActiveWord] = useState(null)
  const items = block.items || []
  const allSeen = seen.size >= items.length
  const quoteWords = (block.quote || '').split(' ')
  const [visibleWords, setVisibleWords] = useState(0)

  useEffect(() => {
    setVisibleWords(0)
    let i = 0
    const iv = setInterval(() => {
      i += 1
      setVisibleWords(i)
      if (i >= quoteWords.length) clearInterval(iv)
    }, 96)
    return () => clearInterval(iv)
  }, [block.quote]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleClose() {
    if (activeItem) setSeen(s => new Set([...s, activeItem.id]))
    setActiveItem(null)
  }

  return (
    <div style={{ minHeight: '100dvh', background: `radial-gradient(circle at 50% 0%, rgba(${accentRgb}, 0.16), transparent 34%), ${palette.background}`, display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>
      <div style={{ width: '100%', flex: 1, minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg, rgba(${accentRgb}, 0.10), rgba(7,7,9,0.92) 34%, rgba(8,8,10,0.98))`, overflow: 'hidden' }}>
        <div style={{ position: 'relative', minHeight: 318, overflow: 'hidden', flexShrink: 0 }}>
          {block.backgroundImage && <img src={block.backgroundImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.40) saturate(0.82) contrast(1.04)' }} />}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(6,4,8,0.12) 0%, rgba(8,6,10,0.25) 36%, rgba(8,8,10,0.94) 100%), radial-gradient(circle at 78% 44%, rgba(${accentRgb}, 0.15), transparent 32%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, minHeight: 318, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '30px 26px 26px' }}>
            <blockquote style={{ margin: 0 }}>
              <p style={{ margin: 0, ...TYPE.featureText, color: parchment, fontSize: 'clamp(2.18rem, 8.6vw, 3.25rem)', lineHeight: 1.08, letterSpacing: '-0.055em' }}>
                {quoteWords.map((word, i) => <QuoteWord key={i} word={word} index={i} visibleWords={visibleWords} accent={accent} accentRgb={accentRgb} activeWord={activeWord} onSelect={setActiveWord} />)}
              </p>
            </blockquote>
            {block.location && <p style={{ margin: '18px 0 0', ...TYPE.captionText, color: 'rgba(233,225,211,0.72)', opacity: visibleWords >= quoteWords.length ? 1 : 0, transition: 'opacity 0.5s ease 0.3s', letterSpacing: '0.01em' }}>{block.location}</p>}
          </div>
        </div>

        <RippedSeam accentColor={accent} />

        <div style={{ padding: '0 28px 7px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ ...TYPE.metadataText, color: `rgba(${accentRgb}, 0.72)`, textTransform: 'uppercase', letterSpacing: '0.22em' }}>Quote microscope</div>
        </div>

        <div style={{ flex: 1, padding: '0 26px', display: 'flex', flexDirection: 'column', paddingBottom: allSeen ? 108 : 24 }}>
          {items.map((item, i) => <AnalysisCard key={item.id} item={item} accent={accent} accentRgb={accentRgb} seen={seen.has(item.id)} index={i} itemCount={items.length} onClick={() => setActiveItem(item)} />)}
        </div>
      </div>

      {allSeen && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 16px calc(16px + env(safe-area-inset-bottom))', background: `linear-gradient(to top, ${palette.background} 55%, transparent)`, zIndex: 10, animation: 'qa-slide-up 0.4s ease both' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <ContinueCTA onClick={onContinue} accent={accent} textColor={parchment} />
          </div>
        </div>
      )}

      {activeWord && <WordFocusSheet word={activeWord} accent={accent} accentRgb={accentRgb} parchment={parchment} onClose={() => setActiveWord(null)} />}
      {activeItem && <ItemExpanded item={activeItem} accent={accent} accentRgb={accentRgb} parchment={parchment} palette={palette} onClose={handleClose} />}
    </div>
  )
}
