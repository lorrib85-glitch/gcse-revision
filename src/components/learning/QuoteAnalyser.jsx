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
    @keyframes qa-slide-up {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes qa-card-in {
      from { opacity: 0; transform: translateX(-8px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes qa-tick-pop {
      0%   { transform: scale(0); }
      70%  { transform: scale(1.18); }
      100% { transform: scale(1); }
    }
  `
  document.head.appendChild(s)
}

// ── Inline SVG icons ─────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.55"/>
      <line x1="12.5" y1="12.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
    </svg>
  )
}

function IconFeather() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15 2.5C11.5 2.5 5.5 8 4 16.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
      <path d="M15 2.5C16 4.5 15.5 7 13.5 9S8.5 12 4 16.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
      <path d="M4 16.5L9 12" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
    </svg>
  )
}

function IconMask() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 8.5C3 6 4.8 4 7 4H13C15.2 4 17 6 17 8.5V10.5C17 13.2 15.3 15 12.5 15H7.5C4.7 15 3 13.2 3 10.5V8.5Z" stroke="currentColor" strokeWidth="1.55"/>
      <path d="M7 8.5C7.6 8.5 8 8.1 8 7.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
      <path d="M13 8.5C12.4 8.5 12 8.1 12 7.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
      <path d="M8.5 12C9 12.8 11 12.8 11.5 12" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
    </svg>
  )
}

function IconBulb() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3C7 3 5 5.3 5 8C5 10.2 6.3 12 8 12.8V14.5H12V12.8C13.7 12 15 10.2 15 8C15 5.3 13 3 10 3Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round"/>
      <path d="M8.5 16.5H11.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
      <path d="M9.5 18H10.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round"/>
    </svg>
  )
}

function IconFlame() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 17C7 15 4 12 4 8.5C4 6 5.8 4 8 4C8 4 7 6.5 9.5 7.5C9.5 7.5 8.5 5 11 3.5C13 3.5 16 6 16 9C16 12.5 13 15 10 17Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round"/>
      <path d="M10 17C9 15 9.5 13 11 12.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" opacity="0.55"/>
    </svg>
  )
}

const ICON_MAP = { search: IconSearch, feather: IconFeather, mask: IconMask, bulb: IconBulb, flame: IconFlame }

const WORD_INSIGHTS = {
  fires: {
    label: 'fires',
    connotations: 'burning ambition, danger and desire.',
    why: 'Macbeth knows his ambition is powerful enough to consume him if it is seen.',
    sentence: 'Shakespeare uses “fires” to present Macbeth’s ambition as intense, dangerous and difficult to control.',
  },
  black: {
    label: 'black',
    connotations: 'evil, secrecy and moral darkness.',
    why: 'Macbeth already understands that his desire is corrupt and must be hidden.',
    sentence: 'The adjective “black” suggests Macbeth recognises the evil nature of his own ambition.',
  },
  deep: {
    label: 'deep',
    connotations: 'hidden thoughts, buried motives and something difficult to escape.',
    why: 'His ambition is not a quick passing thought; it has settled inside him.',
    sentence: 'Shakespeare uses “deep” to imply that Macbeth’s ambition is rooted within him and becoming harder to resist.',
  },
  desires: {
    label: 'desires',
    connotations: 'private longing, temptation and selfish ambition.',
    why: 'The word shows Macbeth is not simply reacting to events; he actively wants power.',
    sentence: 'The noun “desires” reveals that Macbeth is driven by a private longing for power.',
  },
  stage: {
    label: 'stage',
    connotations: 'performance, role-playing and public identity.',
    why: 'This can link to Shakespeare’s interest in appearance versus reality.',
    sentence: 'The image of the “stage” can suggest that identity is performed rather than fixed.',
  },
}

function RippedSeam({ accentColor }) {
  return (
    <div style={{ position: 'relative', height: 30, margin: '0 0 4px', flexShrink: 0 }}>
      <svg viewBox="0 0 420 30" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
        <path d="M0,15 C16,18 30,12 46,15 C62,18 76,12 92,15 C108,18 122,12 138,15 C154,18 168,12 184,15 C200,18 214,12 230,15 C246,18 260,12 276,15 C292,18 306,12 322,15 C338,18 352,12 368,15 C386,18 402,12 420,15" fill="none" stroke={accentColor} strokeWidth="2" strokeOpacity="0.42" />
        <path d="M0 28H420" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </svg>
    </div>
  )
}

function AnalysisCard({ item, accentRgb, accent, seen, index, onClick, itemCount }) {
  const IconComponent = ICON_MAP[item.icon] || IconSearch
  const isFirst = index === 0

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: 'transparent',
        border: 0,
        borderBottom: index < itemCount - 1 ? '1px solid rgba(255,255,255,0.075)' : 0,
        padding: '14px 0',
        display: 'grid',
        gridTemplateColumns: '58px 1fr 44px',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        textAlign: 'left',
        animation: `qa-card-in 0.4s ease both`,
        animationDelay: `${index * 0.07 + 0.25}s`,
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        flexShrink: 0,
        background: `linear-gradient(145deg, rgba(${accentRgb}, 0.24), rgba(255,255,255,0.035))`,
        border: `1px solid rgba(${accentRgb}, ${seen || isFirst ? 0.34 : 0.18})`,
        borderRadius: RADII.pill,
        boxShadow: seen || isFirst ? `0 0 20px rgba(${accentRgb}, 0.18)` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: seen || isFirst ? accent : `rgba(${accentRgb}, 0.72)`,
        transition: 'all 0.2s',
      }}>
        <IconComponent />
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{
          ...TYPE.cardTitle,
          color: seen || isFirst ? accent : '#E9E1D3',
          marginBottom: 4,
          fontSize: '1rem',
          lineHeight: 1.16,
          transition: 'color 0.2s',
        }}>
          {item.heading}
        </div>
        <div style={{
          ...TYPE.captionText,
          color: 'rgba(233,225,211,0.78)',
          lineHeight: 1.35,
        }}>
          {item.explainer}
        </div>
      </div>

      <div style={{
        width: 40,
        height: 40,
        flexShrink: 0,
        borderRadius: RADII.pill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: seen || isFirst ? `rgba(${accentRgb}, 0.92)` : 'rgba(255,255,255,0.045)',
        border: seen || isFirst ? `1px solid rgba(${accentRgb}, 0.95)` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: seen || isFirst ? `0 0 22px rgba(${accentRgb}, 0.28)` : 'none',
        color: seen || isFirst ? '#1B1113' : 'rgba(255,255,255,0.45)',
      }}>
        {seen ? (
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" style={{ animation: 'qa-tick-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }} aria-label="Seen">
            <path d="M6.8 11.2L9.7 14.1L15.4 7.8" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  )
}

function ItemExpanded({ item, accent, accentRgb, parchment, palette, onClose }) {
  const IconComponent = ICON_MAP[item.icon] || IconSearch

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div role="dialog" aria-modal="true" aria-label={item.heading} style={{ position: 'fixed', inset: 0, zIndex: 200, background: palette.backgroundSecondary || palette.background, display: 'flex', flexDirection: 'column', animation: 'qa-slide-up 0.32s cubic-bezier(0.16,1,0.3,1) both' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 420, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '52px 20px 18px', borderBottom: `1px solid rgba(${accentRgb}, 0.14)`, flexShrink: 0 }}>
          <div style={{ width: 52, height: 52, flexShrink: 0, background: `rgba(${accentRgb}, 0.12)`, border: `1px solid rgba(${accentRgb}, 0.28)`, borderRadius: RADII.pill, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
            <IconComponent />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...TYPE.sectionHeading, color: parchment }}>{item.heading}</div>
            <div style={{ ...TYPE.captionText, color: 'rgba(233,225,211,0.72)', marginTop: 2 }}>{item.explainer}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: RADII.pill, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', ...TYPE.buttonText }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px 28px', WebkitOverflowScrolling: 'touch' }}>
          {item.content.title && (
            <div style={{ ...TYPE.metadataText, color: accent, textTransform: 'uppercase', marginBottom: 14 }}>{item.content.title}</div>
          )}

          <p style={{ ...TYPE.bodyLarge, color: parchment, margin: 0 }}>{item.content.body}</p>

          {item.content.keyWords?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ ...TYPE.metadataText, color: 'rgba(233,225,211,0.58)', textTransform: 'uppercase', marginBottom: 10 }}>Key words</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {item.content.keyWords.map(word => (
                  <span key={word} style={{ background: `rgba(${accentRgb}, 0.12)`, border: `1px solid rgba(${accentRgb}, 0.28)`, color: accent, borderRadius: RADII.small, padding: '5px 12px', ...TYPE.captionText, fontWeight: 600 }}>{word}</span>
                ))}
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

function WordInsightSheet({ wordKey, accent, accentRgb, parchment, onClose }) {
  const insight = WORD_INSIGHTS[wordKey]
  if (!insight) return null

  return (
    <div role="dialog" aria-modal="true" aria-label={`Word focus: ${insight.label}`} style={{ position: 'fixed', inset: 0, zIndex: 180, pointerEvents: 'none' }}>
      <button onClick={onClose} aria-label="Close word focus" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: 'linear-gradient(to top, rgba(13,15,16,0.92), rgba(13,15,16,0.12) 58%, transparent)', pointerEvents: 'auto' }} />
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, maxWidth: 420, margin: '0 auto', padding: '18px 18px 16px', borderRadius: 26, background: 'linear-gradient(180deg, rgba(59,38,38,0.96), rgba(31,28,27,0.98))', border: `1px solid rgba(${accentRgb}, 0.28)`, boxShadow: '0 -22px 70px rgba(0,0,0,0.46)', pointerEvents: 'auto', animation: 'qa-slide-up 0.24s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 12 }}>
          <div>
            <div style={{ ...TYPE.metadataText, color: accent, textTransform: 'uppercase', marginBottom: 5 }}>Word focus</div>
            <div style={{ ...TYPE.sectionHeading, color: parchment }}>“{insight.label}”</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: RADII.pill, border: '1px solid rgba(233,225,211,0.16)', background: 'rgba(233,225,211,0.06)', color: 'rgba(233,225,211,0.76)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', ...TYPE.buttonText }}>✕</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <div style={{ ...TYPE.metadataText, color: 'rgba(233,225,211,0.54)', textTransform: 'uppercase', marginBottom: 5 }}>Connotations</div>
            <p style={{ ...TYPE.bodyText, color: parchment, margin: 0 }}>{insight.connotations}</p>
          </div>
          <div>
            <div style={{ ...TYPE.metadataText, color: 'rgba(233,225,211,0.54)', textTransform: 'uppercase', marginBottom: 5 }}>Why it matters</div>
            <p style={{ ...TYPE.bodyText, color: 'rgba(233,225,211,0.84)', margin: 0 }}>{insight.why}</p>
          </div>
          <div style={{ padding: '11px 12px', borderRadius: 16, background: `rgba(${accentRgb}, 0.10)`, border: `1px solid rgba(${accentRgb}, 0.18)` }}>
            <div style={{ ...TYPE.metadataText, color: accent, textTransform: 'uppercase', marginBottom: 5 }}>Use it</div>
            <p style={{ ...TYPE.bodyText, color: parchment, margin: 0 }}>{insight.sentence}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuoteWord({ word, index, visibleWords, accent, accentRgb, activeWord, onSelect }) {
  const stripped = word.replace(/[“”";,\.]/g, '').toLowerCase()
  const shouldHighlight = Object.prototype.hasOwnProperty.call(WORD_INSIGHTS, stripped)
  const isVisible = index < visibleWords
  const isActive = activeWord === stripped

  if (shouldHighlight) {
    return (
      <>
        <button
          type="button"
          onClick={() => onSelect(stripped)}
          aria-label={`Analyse the word ${stripped}`}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            color: accent,
            background: isActive ? `rgba(${accentRgb}, 0.28)` : `rgba(${accentRgb}, 0.12)`,
            border: `1px solid rgba(${accentRgb}, ${isActive ? 0.54 : 0.34})`,
            borderBottom: `3px solid rgba(${accentRgb}, ${isActive ? 0.95 : 0.72})`,
            borderRadius: 10,
            boxShadow: isActive ? `0 0 24px rgba(${accentRgb}, 0.32)` : `0 0 16px rgba(${accentRgb}, 0.18)`,
            padding: '0 0.12em 0.03em',
            margin: '0 0.06em 0.12em 0',
            font: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            textShadow: `0 0 18px ${accent}55`,
            cursor: 'pointer',
            transition: 'opacity 0.28s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
            transform: isActive ? 'translateY(-1px)' : 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {word}
        </button>{' '}
      </>
    )
  }

  return (
    <span style={{ display: 'inline', opacity: isVisible ? 1 : 0, color: 'inherit', textShadow: '0 1px 18px rgba(0,0,0,0.65)', transition: 'opacity 0.28s ease' }}>
      {word}{' '}
    </span>
  )
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
  const allSeen = seen.size >= (block.items?.length || 0)

  const quoteWords = (block.quote || '').split(' ')
  const [visibleWords, setVisibleWords] = useState(0)

  useEffect(() => {
    setVisibleWords(0)
    let i = 0
    const iv = setInterval(() => {
      i++
      setVisibleWords(i)
      if (i >= quoteWords.length) clearInterval(iv)
    }, 110)
    return () => clearInterval(iv)
  }, [block.quote]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleClose() {
    setSeen(s => new Set([...s, activeItem.id]))
    setActiveItem(null)
  }

  return (
    <div style={{ minHeight: '100dvh', background: `radial-gradient(circle at 50% 0%, rgba(${accentRgb}, 0.16), transparent 34%), ${palette.background}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 12px 0' }}>
      <div style={{ width: '100%', maxWidth: 420, flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 34, background: `linear-gradient(180deg, rgba(${accentRgb}, 0.10), rgba(7,7,9,0.92) 34%, rgba(8,8,10,0.98))`, border: `1px solid rgba(${accentRgb}, 0.18)`, boxShadow: '0 28px 70px rgba(0,0,0,0.48)', overflow: 'hidden' }}>
        <div style={{ position: 'relative', minHeight: 342, overflow: 'hidden', flexShrink: 0, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
          {block.backgroundImage && (
            <img src={block.backgroundImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.38) saturate(0.82) contrast(1.05)' }} />
          )}

          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(6,4,8,0.18) 0%, rgba(8,6,10,0.28) 38%, rgba(8,8,10,0.94) 100%), radial-gradient(circle at 78% 44%, rgba(${accentRgb}, 0.18), transparent 32%)`, pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, minHeight: 342, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '34px 26px 30px' }}>
            <div style={{ ...TYPE.captionText, color: 'rgba(233,225,211,0.72)', marginBottom: 12, opacity: visibleWords >= quoteWords.length ? 1 : 0, transition: 'opacity 0.5s ease 0.2s' }}>Tap the highlighted words</div>

            <blockquote style={{ margin: 0 }}>
              <p style={{ margin: 0, ...TYPE.featureText, color: parchment }}>
                {quoteWords.map((word, i) => (
                  <QuoteWord key={i} word={word} index={i} visibleWords={visibleWords} accent={accent} accentRgb={accentRgb} activeWord={activeWord} onSelect={setActiveWord} />
                ))}
              </p>
            </blockquote>

            {block.location && (
              <p style={{ margin: '18px 0 0', ...TYPE.captionText, color: 'rgba(233,225,211,0.72)', opacity: visibleWords >= quoteWords.length ? 1 : 0, transition: 'opacity 0.5s ease 0.3s', letterSpacing: '0.01em' }}>{block.location}</p>
            )}
          </div>
        </div>

        <RippedSeam accentColor={accent} />

        <div style={{ padding: '0 28px 8px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ ...TYPE.metadataText, color: `rgba(${accentRgb}, 0.72)`, textTransform: 'uppercase', letterSpacing: '0.22em' }}>Quote microscope</div>
        </div>

        <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', paddingBottom: allSeen ? 110 : 28 }}>
          {(block.items || []).map((item, i) => (
            <AnalysisCard key={item.id} item={item} accent={accent} accentRgb={accentRgb} seen={seen.has(item.id)} index={i} itemCount={(block.items || []).length} onClick={() => setActiveItem(item)} />
          ))}
        </div>
      </div>

      {allSeen && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 16px calc(16px + env(safe-area-inset-bottom))', background: `linear-gradient(to top, ${palette.background} 55%, transparent)`, zIndex: 10, animation: 'qa-slide-up 0.4s ease both' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <ContinueCTA onClick={onContinue} accent={accent} textColor={parchment} />
          </div>
        </div>
      )}

      {activeWord && <WordInsightSheet wordKey={activeWord} accent={accent} accentRgb={accentRgb} parchment={parchment} onClose={() => setActiveWord(null)} />}
      {activeItem && <ItemExpanded item={activeItem} accent={accent} accentRgb={accentRgb} parchment={parchment} palette={palette} onClose={handleClose} />}
    </div>
  )
}
