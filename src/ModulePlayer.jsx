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
      borderLeft: '3px solid #3B82FF',
      background: 'rgba(59,130,255,.07)',
      borderRadius: '0 14px 14px 0',
      padding: '16px 18px', margin: '12px 0',
    }}>
      {block.label && (
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#70B8FF', marginBottom: 8,
        }}>{block.label}</div>
      )}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.95rem', lineHeight: 1.7, margin: 0, color: '#C8D0E8',
      }} dangerouslySetInnerHTML={{ __html: block.text }} />
    </div>
  )
}

function KeypointBlock({ block }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1A2338 0%, #111828 100%)',
      border: '1px solid rgba(157,92,255,.25)',
      borderRadius: 16, padding: '18px 20px', margin: '14px 0',
      boxShadow: '0 0 24px rgba(157,92,255,.08)',
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: '#9D5CFF', marginBottom: 10,
      }}>⭐ Key Point</div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.95rem', lineHeight: 1.65, margin: 0, color: '#E0E6F0',
      }} dangerouslySetInnerHTML={{ __html: block.text }} />
    </div>
  )
}

function FunFactBlock({ block }) {
  return (
    <div style={{
      background: 'rgba(255,200,87,.06)',
      borderLeft: '3px solid #FFC857',
      borderRadius: '0 14px 14px 0',
      padding: '14px 18px', margin: '12px 0',
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: '#FFC857', marginBottom: 6,
      }}>{block.label || '🤯 Fun Fact'}</div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.92rem', margin: 0, color: '#C8D0E8', lineHeight: 1.65,
      }}>{block.text}</p>
    </div>
  )
}

function ExamTipBlock({ block }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0C2218 0%, #071610 100%)',
      border: '1.5px dashed rgba(245,183,0,.35)',
      borderRadius: 16, padding: '16px 18px', margin: '14px 0',
      boxShadow: '0 0 20px rgba(245,183,0,.05)',
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: '#F5B700', marginBottom: 10,
      }}>{block.label || '🗡️ Exam Assassin'}</div>
      {block.text && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.9rem', margin: 0, color: '#C8D0E8', lineHeight: 1.65,
        }} dangerouslySetInnerHTML={{ __html: block.text }} />
      )}
      {block.tip && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.9rem', marginBottom: block.phrases ? 10 : 0, color: '#C8D0E8', lineHeight: 1.65,
        }} dangerouslySetInnerHTML={{ __html: block.tip }} />
      )}
      {block.phrases && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {block.phrases.map(p => (
            <span key={p} style={{
              background: 'rgba(245,183,0,.12)', border: '1px solid rgba(245,183,0,.3)',
              color: '#F5B700', borderRadius: 8, padding: '5px 11px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '.78rem', fontWeight: 600,
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
              width: '100%', display: 'grid', gridTemplateColumns: '72px 1fr',
              gap: 10, border: 'none', background: 'transparent', cursor: 'pointer',
              textAlign: 'left', padding: 0,
            }}>
            <div style={{
              background: open === i ? '#F5B700' : '#1A2338',
              color: open === i ? '#070500' : '#F5B700',
              border: `1px solid ${open === i ? '#F5B700' : '#2A3552'}`,
              borderRadius: 12, display: 'grid', placeItems: 'center',
              fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '.8rem', padding: '10px 6px', minHeight: 56, transition: 'all .2s',
            }}>{e.year}</div>
            <div style={{
              background: open === i ? 'rgba(245,183,0,.06)' : '#10182B',
              border: `1px solid ${open === i ? 'rgba(245,183,0,.3)' : '#2A3552'}`,
              borderRadius: 12, padding: '12px 14px', transition: 'all .2s',
              display: 'flex', alignItems: 'center',
            }}>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.9rem', fontWeight: 500, color: '#C8D0E8',
              }} dangerouslySetInnerHTML={{ __html: e.text }} />
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
    <div style={{ margin: '14px 0' }}>
      {/* Prompt card */}
      <div style={{
        background: '#10182B',
        border: '1px solid #2A3552',
        borderRadius: 14, padding: '16px 18px', marginBottom: 10,
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#9D5CFF', marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ⚡ {block.label || 'Rapid Fire Sort'}
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500, margin: 0,
          color: '#7C8DB0', fontSize: '.95rem', lineHeight: 1.5,
        }}>{block.prompt}</p>
      </div>

      {!shown ? (
        <button onClick={() => setShown(true)} style={{
          width: '100%',
          background: 'transparent',
          border: '1px solid #2A3552',
          borderRadius: 14, padding: '14px',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, fontSize: '.92rem',
          color: '#9CA8C7', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'border-color .2s, color .2s',
        }}>
          Reveal answer →
        </button>
      ) : (
        <div className="fade-up" style={{
          background: 'rgba(77,255,136,.07)',
          border: '1px solid rgba(77,255,136,.25)',
          borderRadius: 14, padding: '16px 18px',
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: '#4DFF88', marginBottom: 8,
          }}>✓ Answer</div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            margin: 0, fontSize: '.92rem', color: '#C8D0E8', lineHeight: 1.6,
          }}>{block.answer}</p>
        </div>
      )}
    </div>
  )
}

function QuizBlock({ block, onAnswered }) {
  const [selected, setSelected] = useState(null)
  const [shakeIdx, setShakeIdx] = useState(null)

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
      <div style={{
        background: 'linear-gradient(135deg, #12183A, #0E1330)',
        border: '1px solid rgba(157,92,255,.2)',
        borderRadius: 14, padding: '16px 18px', marginBottom: 12,
      }}>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: '#F5F7FB', fontWeight: 600, fontSize: '1rem', margin: 0, lineHeight: 1.45,
        }}>{block.question}</p>
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
              <span style={{ marginRight: 8, opacity: .45 }}>{String.fromCharCode(65 + i)}.</span>
              {opt.text}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className={`feedback ${correct ? 'correct' : 'wrong'} fade-up`} style={{ marginTop: 12 }}>
          <p style={{ margin: 0, fontSize: '.9rem', fontFamily: "'Inter', sans-serif" }}>
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
            background: flipped.has(i)
              ? 'linear-gradient(145deg, #1A1038, #120C2C)'
              : '#10182B',
            border: `1.5px solid ${flipped.has(i) ? 'rgba(157,92,255,.4)' : '#2A3552'}`,
            borderRadius: 14, padding: '16px 12px', cursor: 'pointer',
            textAlign: 'center', minHeight: 90, transition: 'all .22s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: flipped.has(i) ? '0 0 16px rgba(157,92,255,.12)' : 'none',
          }}>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.88rem',
              color: flipped.has(i) ? '#C18CFF' : '#E0E6F0',
              marginBottom: flipped.has(i) ? 6 : 0,
            }}>{c.front}</div>
            {flipped.has(i) && (
              <div className="fade-up" style={{
                fontFamily: "'Inter', sans-serif",
                color: '#9CA8C7', fontSize: '.78rem', lineHeight: 1.5,
              }}>{c.back}</div>
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
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(157,92,255,.12)',
          border: '1px solid rgba(157,92,255,.25)',
          color: '#C18CFF',
          borderRadius: 99, padding: '4px 12px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '.68rem', fontWeight: 700,
          letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12,
        }}>{screen.kicker}</div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
          marginBottom: 8, color: '#F5F7FB',
          fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1.2,
        }}>{screen.heading}</h2>
        {screen.sub && (
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.9rem', color: '#5A6480', lineHeight: 1.6, margin: 0,
          }}>{screen.sub}</p>
        )}
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
  const saved   = getModuleState(module.id)
  const [screen, setScreen] = useState(saved.screen || 0)
  const total   = module.screens.length
  const pct     = Math.round(((screen + 1) / total) * 100)
  const isLast  = screen === total - 1
  const [animKey, setAnimKey] = useState(0)

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
  // Subject colour — fallback to purple
  const subjectColor = module.color || '#9D5CFF'

  return (
    <div style={{ background: '#080C1A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Sticky top header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(8,12,26,.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1E2A40',
        padding: '12px 16px 0',
      }}>
        {/* Row 1: subject label + counter + exit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          {/* Module icon */}
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: `${subjectColor}22`,
            border: `1px solid ${subjectColor}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.9rem',
          }}>{module.icon}</div>

          {/* Subject + title — truncated cleanly */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.65rem', fontWeight: 700,
              letterSpacing: '.1em', textTransform: 'uppercase',
              color: subjectColor, marginBottom: 1,
            }}>{module.subject} · Module {module.number}</div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.88rem', color: '#E0E6F0',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{module.title}</div>
          </div>

          {/* Counter */}
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '.78rem', fontWeight: 700,
            color: '#4A5578', flexShrink: 0,
          }}>{screen + 1}<span style={{ color: '#2A3552' }}>/{total}</span></div>

          {/* Exit button */}
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,.05)',
            border: '1px solid #2A3552',
            borderRadius: 8, padding: '5px 10px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '.72rem', fontWeight: 600,
            color: '#4A5578', cursor: 'pointer',
            flexShrink: 0, letterSpacing: '.02em',
          }}>✕ exit</button>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, background: '#1E2A40', borderRadius: 99,
          overflow: 'hidden', marginBottom: 10,
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${subjectColor}aa, ${subjectColor})`,
            borderRadius: 99,
            boxShadow: `0 0 8px ${subjectColor}66`,
            transition: 'width .5s ease',
          }} />
        </div>

        {/* Section chips — scrollable, dark-themed */}
        <div style={{
          display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10,
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}>
          {module.screens.map((s, i) => {
            const isActive = i === screen
            const isDone   = i < screen
            return (
              <button key={i}
                onClick={() => { setScreen(i); setAnimKey(k => k + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                style={{
                  flexShrink: 0,
                  background: isActive
                    ? subjectColor
                    : isDone
                    ? 'rgba(77,255,136,.1)'
                    : '#10182B',
                  border: `1px solid ${isActive ? subjectColor : isDone ? 'rgba(77,255,136,.3)' : '#2A3552'}`,
                  borderRadius: 99,
                  padding: '5px 12px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '.7rem', fontWeight: 600,
                  color: isActive ? '#fff' : isDone ? '#4DFF88' : '#4A5578',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  letterSpacing: '.01em',
                  boxShadow: isActive ? `0 0 10px ${subjectColor}55` : 'none',
                  transition: 'all .2s',
                }}>
                {isDone ? '✓ ' : ''}{s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Screen content ── */}
      <div style={{ flex: 1, padding: '20px 18px 120px', maxWidth: 660, margin: '0 auto', width: '100%' }}>
        <div key={animKey} className="anim-pop">
          <Screen screen={cur} />
        </div>
      </div>

      {/* ── Bottom navigation ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        background: 'rgba(8,12,26,.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #1E2A40',
        padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        boxShadow: '0 -8px 32px rgba(0,0,0,.4)',
      }}>
        <div style={{
          maxWidth: 660, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignItems: 'center',
        }}>
          {/* Back */}
          <button onClick={() => go(-1)} disabled={screen === 0} style={{
            background: '#10182B',
            border: '1px solid #2A3552',
            borderRadius: 14, padding: '13px 10px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.9rem',
            color: screen === 0 ? '#2A3552' : '#9CA8C7',
            cursor: screen === 0 ? 'default' : 'pointer',
            transition: 'all .15s',
          }}>← Back</button>

          {/* Save + Exit */}
          <button onClick={onBack} style={{
            background: '#10182B',
            border: '1px solid #2A3552',
            borderRadius: 14, padding: '13px 10px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.82rem',
            color: '#5A6480', cursor: 'pointer',
            lineHeight: 1.3, textAlign: 'center',
          }}>Save +{'\n'}Exit</button>

          {/* Next / Finish */}
          <button onClick={() => isLast ? onBack() : go(1)} style={{
            background: isLast
              ? 'linear-gradient(135deg, #1A4D2E, #38D27A)'
              : `linear-gradient(135deg, ${subjectColor}cc, ${subjectColor})`,
            border: 'none',
            borderRadius: 14, padding: '13px 10px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.9rem',
            color: '#fff', cursor: 'pointer',
            boxShadow: isLast
              ? '0 4px 16px rgba(56,210,122,.35)'
              : `0 4px 16px ${subjectColor}44`,
            transition: 'all .15s',
          }}>
            {isLast ? 'Finish ✓' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
