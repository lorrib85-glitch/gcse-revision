import { useState, useEffect } from 'react'

// ─── localStorage helpers ─────────────────────────────────────────────────────

function getModuleState(moduleId) {
  try { return JSON.parse(localStorage.getItem(`gcse_module_${moduleId}`) || '{}') } catch { return {} }
}
function saveModuleState(moduleId, state) {
  try { localStorage.setItem(`gcse_module_${moduleId}`, JSON.stringify(state)) } catch {}
}

// ─── Block renderers ──────────────────────────────────────────────────────────

function ReadBlock({ block }) {
  return (
    <div style={{
      borderLeft: '4px solid #1e3a5f', background: '#f0f4ff',
      borderRadius: '0 12px 12px 0', padding: '16px 18px', margin: '12px 0'
    }}>
      {block.label && (
        <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#1e3a5f', marginBottom: 8 }}>
          {block.label}
        </div>
      )}
      <p style={{ fontSize: '.95rem', lineHeight: 1.65, margin: 0 }} dangerouslySetInnerHTML={{ __html: block.text }} />
    </div>
  )
}

function KeypointBlock({ block }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #17120d, #3b2410)',
      color: '#fff9ec', borderRadius: 16, padding: '18px 20px', margin: '14px 0',
    }}>
      <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#f8d783', marginBottom: 8 }}>
        ⭐ Key Point
      </div>
      <p style={{ fontSize: '.93rem', lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={{ __html: block.text }} />
    </div>
  )
}

function FunFactBlock({ block }) {
  return (
    <div style={{
      background: '#fffaf0', borderLeft: '4px solid #b45309',
      borderRadius: '0 12px 12px 0', padding: '14px 18px', margin: '12px 0'
    }}>
      <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#b45309', marginBottom: 6 }}>
        {block.label || '🤯 Fun Fact'}
      </div>
      <p style={{ fontSize: '.92rem', margin: 0 }}>{block.text}</p>
    </div>
  )
}

function ExamTipBlock({ block }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f3f3a, #07352f)',
      color: '#eafff9', border: '2px dashed rgba(248,215,131,.5)',
      borderRadius: 16, padding: '16px 18px', margin: '14px 0'
    }}>
      <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#f8d783', marginBottom: 8 }}>
        {block.label || '🗡️ Exam Assassin'}
      </div>
      {block.text && <p style={{ fontSize: '.9rem', margin: 0 }} dangerouslySetInnerHTML={{ __html: block.text }} />}
      {block.tip && <p style={{ fontSize: '.9rem', marginBottom: block.phrases ? 10 : 0 }} dangerouslySetInnerHTML={{ __html: block.tip }} />}
      {block.phrases && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {block.phrases.map(p => (
            <span key={p} style={{
              background: 'rgba(248,215,131,.15)', border: '1px solid rgba(248,215,131,.45)',
              color: '#f8d783', borderRadius: 8, padding: '4px 10px', fontSize: '.8rem', fontWeight: 700
            }}>{p}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function TimelineBlock({ block }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '14px 0' }}>
      {block.events.map((e, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'grid', gridTemplateColumns: '70px 1fr',
              gap: 10, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', padding: 0
            }}>
            <div style={{
              background: open === i ? '#d29b2f' : '#17120d', color: open === i ? '#17120d' : '#f8d783',
              borderRadius: 12, display: 'grid', placeItems: 'center', fontWeight: 900,
              fontSize: '.82rem', padding: '10px 6px', minHeight: 60, transition: 'all .2s'
            }}>{e.year}</div>
            <div style={{
              background: open === i ? '#fffaf0' : '#fffaf5',
              border: `2px solid ${open === i ? '#d29b2f' : '#eadcc8'}`,
              borderRadius: 12, padding: '12px 14px', transition: 'all .2s',
              display: 'flex', alignItems: 'center'
            }}>
              <span style={{ fontSize: '.9rem', fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: e.text }} />
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}

function RevealBlock({ block }) {
  const [shown, setShown] = useState(false)
  return (
    <div style={{ margin: '12px 0' }}>
      <div style={{ background: '#f0ece0', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
        <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 6 }}>
          {block.label || '⚡ Quick Sort'}
        </div>
        <p style={{ fontWeight: 600, margin: 0 }}>{block.prompt}</p>
      </div>
      {!shown ? (
        <button className="btn btn-ghost w-full" onClick={() => setShown(true)}>Reveal answer →</button>
      ) : (
        <div className="fade-up" style={{ background: '#eafbf0', border: '1px solid var(--green)', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: '.9rem' }}>{block.answer}</p>
        </div>
      )}
    </div>
  )
}

function QuizBlock({ block, onAnswered }) {
  const [selected, setSelected]   = useState(null)
  const [shakeIdx, setShakeIdx]   = useState(null)

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (!block.options[i].correct) setShakeIdx(i)
    else if (onAnswered) setTimeout(() => onAnswered(), 600)
  }

  const answered = selected !== null
  const correct  = answered && block.options[selected].correct

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: '16px 18px', marginBottom: 12 }}>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{block.question}</p>
      </div>
      <div className="grid-stack">
        {block.options.map((opt, i) => {
          let cls = 'opt'
          if (answered) {
            if (opt.correct) cls += ' correct'
            else if (i === selected) cls += ' wrong'
          }
          return (
            <button key={i} className={`${cls}${shakeIdx === i ? ' shake' : ''}`}
              onClick={() => choose(i)} disabled={answered}>
              <span style={{ marginRight: 8, opacity: .5 }}>{String.fromCharCode(65 + i)}.</span>{opt.text}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className={`feedback ${correct ? 'correct' : 'wrong'} fade-up`} style={{ marginTop: 12 }}>
          <p style={{ margin: 0, fontSize: '.9rem' }}>
            <strong>{correct ? '✓ Correct! ' : '✗ Not quite. '}</strong>{block.explanation}
          </p>
        </div>
      )}
    </div>
  )
}

function FlashcardsBlock({ block }) {
  const [flipped, setFlipped] = useState(new Set())
  function toggle(i) {
    setFlipped(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '14px 0' }}>
      {block.cards.map((c, i) => (
        <button key={i} onClick={() => toggle(i)}
          style={{
            background: flipped.has(i) ? '#17120d' : '#fff',
            border: `2px solid ${flipped.has(i) ? '#d29b2f' : '#eadcc8'}`,
            borderRadius: 14, padding: '14px 12px', cursor: 'pointer',
            textAlign: 'center', minHeight: 90, transition: 'all .25s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <div>
            <div style={{
              fontWeight: 700, fontSize: '.85rem',
              color: flipped.has(i) ? '#f8d783' : '#17120d',
              marginBottom: flipped.has(i) ? 6 : 0
            }}>{c.front}</div>
            {flipped.has(i) && (
              <div className="fade-up" style={{ color: '#e5e7eb', fontSize: '.78rem', lineHeight: 1.5 }}>{c.back}</div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Single screen renderer ───────────────────────────────────────────────────

function Screen({ screen }) {
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{
          display: 'inline-flex', background: '#17120d', color: '#fff',
          borderRadius: 999, padding: '5px 12px', fontSize: '.72rem',
          fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10
        }}>{screen.kicker}</div>
        <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', marginBottom: 6 }}>{screen.heading}</h2>
        {screen.sub && <p style={{ fontSize: '.9rem', color: 'var(--muted)' }}>{screen.sub}</p>}
      </div>

      {screen.blocks.map((block, i) => (
        <div key={i}>
          {block.type === 'read'       && <ReadBlock block={block} />}
          {block.type === 'keypoint'   && <KeypointBlock block={block} />}
          {block.type === 'funfact'    && <FunFactBlock block={block} />}
          {block.type === 'examtip'    && <ExamTipBlock block={block} />}
          {block.type === 'timeline'   && <TimelineBlock block={block} />}
          {block.type === 'reveal'     && <RevealBlock block={block} />}
          {block.type === 'quiz'       && <QuizBlock block={block} />}
          {block.type === 'flashcards' && <FlashcardsBlock block={block} />}
        </div>
      ))}
    </div>
  )
}

// ─── Main ModulePlayer ────────────────────────────────────────────────────────

export default function ModulePlayer({ module, onBack }) {
  const saved      = getModuleState(module.id)
  const [screen, setScreen] = useState(saved.screen || 0)
  const total      = module.screens.length
  const pct        = Math.round(((screen + 1) / total) * 100)
  const isLast     = screen === total - 1
  const [animKey, setAnimKey] = useState(0)

  // Persist position
  useEffect(() => {
    saveModuleState(module.id, { screen })
  }, [screen, module.id])

  function go(delta) {
    const next = Math.max(0, Math.min(total - 1, screen + delta))
    setScreen(next)
    setAnimKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cur = module.screens[screen]

  return (
    <div className="page" style={{ background: 'var(--parchment)' }}>
      {/* Sticky header */}
      <div className="sticky-header">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                background: module.color, color: '#fff',
                borderRadius: 999, padding: '4px 12px',
                fontSize: '.72rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase'
              }}>{module.icon} {module.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 700 }}>
                {screen + 1} / {total}
              </span>
              <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '.82rem' }}>
                ✕ exit
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="prog-wrap">
            <div className="prog-fill" style={{ width: `${pct}%`, background: module.color }} />
          </div>
          {/* Screen chips */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto', paddingBottom: 2 }}>
            {module.screens.map((s, i) => (
              <button key={i} onClick={() => { setScreen(i); setAnimKey(k => k + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                style={{
                  border: `1px solid ${i === screen ? module.color : 'var(--border)'}`,
                  background: i === screen ? module.color : 'rgba(255,253,248,.9)',
                  color: i === screen ? '#fff' : i < screen ? 'var(--green)' : 'var(--muted)',
                  borderRadius: 999, padding: '5px 10px', fontSize: '.72rem',
                  fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
                }}>
                {i < screen ? '✓ ' : ''}{s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Screen content */}
      <div className="section">
        <div className="container">
          <div key={animKey} className="anim-pop">
            <Screen screen={cur} />
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'sticky', bottom: 0, background: 'rgba(23,18,13,.94)',
        backdropFilter: 'blur(10px)', padding: '12px 18px calc(12px + env(safe-area-inset-bottom))',
        borderTop: '1px solid rgba(255,255,255,.08)'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-ghost" style={{ borderColor: 'rgba(255,255,255,.2)', color: '#fff', opacity: screen === 0 ? 0.3 : 1 }}
              onClick={() => go(-1)} disabled={screen === 0}>
              ← Back
            </button>
            <button onClick={onBack} style={{ background: '#fff9ec', color: '#17120d', border: 'none', borderRadius: 12, padding: '11px 16px', fontWeight: 900, cursor: 'pointer', fontSize: '.85rem' }}>
              Save + Exit
            </button>
            <button className="btn btn-primary" style={{ background: isLast ? 'var(--green)' : '#17120d' }}
              onClick={() => isLast ? onBack() : go(1)}>
              {isLast ? 'Finish ✓' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
