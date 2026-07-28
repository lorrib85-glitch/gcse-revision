import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { hexToRgb, SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { BUTTONS } from '../../constants/buttons.js'
import { recordActivity, getChapterState, saveChapterState } from '../../progress.js'
import { MODULES } from '../../data/modules.js'
import { isFullScreenVideoScreen, getStageNavigation, getCurrentStageFromNavigation, computeInitialChapterState, clampScreenIndex, resolveFinishAction, getChapterGate } from '../../app/chapterNavigation.js'
import { findScreenIndexByType, resolveScreenDefinition, screenHasComponentOwnedContinuation, validateChapterDefinition } from '../../data/screenRegistry.js'
import ChapterHookScreen from './ChapterHookScreen.jsx'
import QuickRecallScreen from '../learning/QuickRecallScreen.jsx'
import LearningHeader from '../core/LearningHeader.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import FaceTheExaminer from '../learning/FaceTheExaminer.jsx'
import RetrievalFrame from '../feedback/RetrievalFrame.jsx'
import WeakSpotRecovery from '../learning/WeakSpotRecovery.jsx'
import RecoveryQuizPlayer from '../learning/RecoveryQuizPlayer.jsx'
import ChapterOutcomeScreen from './ChapterOutcomeScreen.jsx'
import ExaminerExplainsScreen from '../learning/ExaminerExplainsScreen.jsx'
import ContentShell from './ContentShell.jsx'
import ScreenRenderer, { ChapterSchemaError } from './ScreenRenderer.jsx'
import { TYPE, HEADING_LAYOUT } from '../../constants/typography.js'

// ── Stage navigation helpers ──────────────────────────────────────────────────
// isFullScreenVideoScreen, getStageNavigation, getCurrentStageFromNavigation
// live in ../../app/chapterNavigation.js (imported above).

// iOS Safari ignores window.scrollTo on fixed-position shells.
// scrollToTop() tries window first, then falls back to the document element.
function scrollToTop() {
  try {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    // Also scroll the chapter content container for iOS Safari
    const el = document.getElementById('chapter-scroll-container')
    if (el) el.scrollTop = 0
  } catch {}
}

// Chapter resume state persists via getChapterState / saveChapterState from
// ../../progress.js (imported above) under the canonical gcse_chapter_<id> key.

// ─── HookScreen ──────────────────────────────────────────────────────────────
// Renders inside the normal ChapterPlayer nav shell.
// Phases: question → feedback → grow → reveal
// The grow and reveal phases stay put until the user taps the bottom-nav Next button.

function useHookPhase(hook) {
  // phases: 'question' | 'feedback' | 'grow' | 'reveal'
  const [phase, setPhase]         = useState('question')
  const [chosenTrue, setChosenTrue] = useState(null)
  const [growStep, setGrowStep]   = useState(0)
  const [revealIdx, setRevealIdx] = useState(-1)

  function choose(tappedTrue) {
    setChosenTrue(tappedTrue)
    setPhase('feedback')
    // After 1.4s flash, auto-advance to grow and begin stepping
    setTimeout(() => {
      setPhase('grow')
      let step = 0
      // Step every 900ms so each stage is clearly visible
      const iv = setInterval(() => {
        step++
        setGrowStep(step)
        if (step >= 3) clearInterval(iv)
        // No auto-advance to reveal — user controls that via Next button
      }, 900)
    }, 1400)
  }

  function nextFromGrow()   { setPhase('reveal') }
  function nextRevealItem() { setRevealIdx(i => i + 1) }

  const wasCorrect   = chosenTrue === hook?.isTrue
  const allRevealed  = revealIdx >= (hook?.revealItems?.length || 0) - 1
  const canAdvance   = phase === 'grow'    // Next button advances grow → reveal
  const revealDone   = phase === 'reveal' && allRevealed

  return { phase, chosenTrue, wasCorrect, growStep, revealIdx, allRevealed,
           canAdvance, revealDone, choose, nextFromGrow, nextRevealItem }
}

function HookContent({ chapter: _module, hook, hookState, subjectColor: _subjectColor }) {
  const { phase, wasCorrect, growStep, revealIdx, allRevealed, choose, nextRevealItem } = hookState

  // Support both storyLines (new format) and scenario (legacy format)
  const storyLines = hook.storyLines || (() => {
    if (!hook.scenario) return []
    const s = hook.scenario
    const lines = []
    if (s.location) lines.push(s.location + '.')
    if (s.hint) lines.push(s.hint)
    if (s.items) s.items.forEach(item => lines.push('— ' + item))
    return lines
  })()

  return (
    <div style={{ paddingBottom: 20 }}>

      {/* ── Phase: QUESTION ── */}
      {phase === 'question' && (
        <div style={{ animation: 'hFadeIn .4s ease' }}>
          {/* Story context */}
          <div style={{ marginBottom: 20 }}>
            {storyLines.map((line, i) => (
              <p key={i} style={{
                ...(i === storyLines.length - 1 ? TYPE.bodyStrong : TYPE.body),
                fontSize: '.88rem', color: i === storyLines.length - 1 ? '#C8D0E8' : '#5A6480',
                margin: '0 0 5px', lineHeight: 1.65,
              }}>{line}</p>
            ))}
          </div>

          {/* Statement card */}
          <div style={{
            background: 'linear-gradient(145deg, #10182B, #0D1424)',
            border: '1px solid #2A3552',
            borderRadius: 18, padding: '22px 22px',
            marginBottom: 24, textAlign: 'center',
            boxShadow: '0 8px 40px rgba(0,0,0,.4)',
          }}>
            <div style={{
              ...TYPE.eyebrow,
              textTransform: 'uppercase', color: '#4A5578', marginBottom: 12,
            }}>True or False?</div>
            <p style={{
              ...TYPE.displaySection,
              fontSize: 'clamp(1.05rem, 3.5vw, 1.3rem)',
              color: '#F5F7FB',
              margin: 0,
            }}>{hook.statement}</p>
          </div>

          {/* Big TRUE / FALSE buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button onClick={() => choose(true)} style={{
              background: 'linear-gradient(145deg, #0D2B1A, #0A2015)',
              border: '2px solid rgba(77,255,136,.4)',
              borderRadius: 18, padding: '20px 10px',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8, transition: 'transform .12s',
              boxShadow: '0 4px 24px rgba(77,255,136,.1)',
            }}>
              <span style={{ fontSize: '2rem' }}>✅</span>
              <span style={{
                ...TYPE.displaySection,
                fontSize: '1.25rem',
                color: '#4DFF88',
              }}>TRUE</span>
            </button>
            <button onClick={() => choose(false)} style={{
              background: 'linear-gradient(145deg, #2B0D0D, #200A0A)',
              border: '2px solid rgba(255,93,115,.4)',
              borderRadius: 18, padding: '20px 10px',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8, transition: 'transform .12s',
              boxShadow: '0 4px 24px rgba(255,93,115,.1)',
            }}>
              <span style={{ fontSize: '2rem' }}>❌</span>
              <span style={{
                ...TYPE.displaySection,
                fontSize: '1.25rem',
                color: '#FF5D73',
              }}>FALSE</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Phase: FEEDBACK flash ── */}
      {phase === 'feedback' && (
        <div style={{
          textAlign: 'center', padding: '24px 0',
          animation: 'hFadeIn .2s ease',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 14 }}>
            {wasCorrect ? '🎯' : '💥'}
          </div>
          <div style={{
            ...TYPE.displayHero,
            fontSize: '2rem', marginBottom: 14,
            color: wasCorrect ? '#4DFF88' : '#FF5D73',
            textShadow: wasCorrect ? '0 0 40px rgba(77,255,136,.5)' : '0 0 40px rgba(255,93,115,.6)',
          }}>
            {wasCorrect ? 'CORRECT' : 'NOPE'}
          </div>
          <p style={{
            ...TYPE.body,
            fontSize: '.95rem', lineHeight: 1.6,
            color: wasCorrect ? '#6BFFB0' : '#FF8DA1',
            maxWidth: 300, margin: '0 auto',
          }}>
            {wasCorrect
              ? (hook.correctFeedback || "Right. Now find out why...")
              : (hook.wrongFeedback   || "That's what most people think. The numbers tell a different story...")}
          </p>
          <div style={{ ...TYPE.bodySmall, marginTop: 20, color: '#4A5578', fontSize: '.78rem' }}>
            Loading the experiment...
          </div>
        </div>
      )}

      {/* ── Phase: GROW ── */}
      {phase === 'grow' && (
        <div style={{ animation: 'hFadeIn .4s ease' }}>
          <div style={{
            ...TYPE.eyebrow,
            textTransform: 'uppercase', color: '#5A6480', marginBottom: 16, textAlign: 'center',
          }}>1648 — Somewhere in Belgium</div>

          {/* Willow container */}
          <div style={{
            background: 'linear-gradient(180deg, #0A1F12 0%, #061008 100%)',
            border: '1px solid rgba(56,210,122,.2)',
            borderRadius: 20, padding: '20px 16px 0',
            position: 'relative', overflow: 'hidden', marginBottom: 16,
            boxShadow: '0 8px 40px rgba(0,0,0,.5), 0 0 60px rgba(56,210,122,.05)',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 60,
              background: 'linear-gradient(180deg, rgba(56,210,122,.06) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
            <svg viewBox="0 0 200 160" style={{ width: '100%', display: 'block' }}>
              <rect x="0" y="130" width="200" height="30" fill="#1A0E05" />
              <line x1="10" y1="130" x2="190" y2="130" stroke="rgba(139,90,43,.4)" strokeWidth="1" strokeDasharray="4 3" />
              <path d="M60 130 L55 160 L145 160 L140 130 Z" fill="#2A1A0A" stroke="rgba(139,90,43,.3)" strokeWidth="1" />

              {growStep >= 1 && (
                <rect x="97" y={130 - (growStep >= 2 ? 60 : 30)}
                  width="6" height={growStep >= 2 ? 60 : 30}
                  fill="#5C3D1A" rx="2" style={{ transition: 'all .7s ease' }}
                />
              )}
              {growStep >= 2 && (<>
                <line x1="100" y1="90" x2="70" y2="70" stroke="#5C3D1A" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="90" x2="130" y2="70" stroke="#5C3D1A" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="100" x2="75" y2="85" stroke="#5C3D1A" strokeWidth="2" strokeLinecap="round" />
                <line x1="100" y1="100" x2="125" y2="85" stroke="#5C3D1A" strokeWidth="2" strokeLinecap="round" />
              </>)}
              {growStep >= 3 && (<>
                {[[70,68],[130,68],[75,83],[125,83],[85,55],[115,55],[100,48]].map(([cx,cy],i) => (
                  <ellipse key={i} cx={cx} cy={cy} rx="10" ry="6"
                    fill="rgba(56,210,122,.75)"
                    transform={"rotate(" + (i*25-50) + " " + cx + " " + cy + ")"}
                    style={{ opacity:0, animation:"hLeafPop .35s ease " + (i*0.07) + "s forwards" }}
                  />
                ))}
                {[72,80,88,96,104,112,120,128].map((x, i) => (
                  <path key={i}
                    d={"M" + x + " " + (65+(i%3)*4) + " Q" + (x-4+i%3*2) + " " + (80+i%2*6) + " " + (x-6+i%4) + " " + (95+i%3*5)}
                    fill="none" stroke="rgba(107,255,176,.55)" strokeWidth="1.3" strokeLinecap="round"
                    style={{ opacity:0, animation:"hLeafPop .4s ease " + (0.3+i*0.06) + "s forwards" }}
                  />
                ))}
                <text x="100" y="44" textAnchor="middle" fill="#4DFF88" fontSize="9" fontWeight="bold"
                  style={{ opacity:0, animation:'hLeafPop .4s ease .85s forwards' }}>+74 kg</text>
              </>)}
              {growStep >= 2 && (
                <text x="100" y="148" textAnchor="middle" fill="rgba(139,90,43,.7)" fontSize="7">soil: −57g</text>
              )}
            </svg>

            {/* Year label inside card */}
            <div style={{
              textAlign: 'center', padding: '10px 0 14px',
              ...TYPE.label,
              fontSize: '.82rem', color: '#5A6480',
            }}>
              {growStep === 0 && 'Planting the sapling...'}
              {growStep === 1 && "Year 2 — it's growing"}
              {growStep === 2 && 'Year 4 — branches forming...'}
              {growStep === 3 && <span style={{ color: '#4DFF88' }}>Year 5 — 74 kg of tree. Soil lost 57g. 🤯</span>}
            </div>
          </div>

          {/* The question */}
          <div style={{
            background: '#10182B', border: '1px solid #2A3552',
            borderRadius: 14, padding: '14px 16px', textAlign: 'center',
          }}>
            <p style={{
              ...TYPE.titleLarge,
              fontSize: '1rem', color: '#F5F7FB', margin: 0,
            }}>{hook.bigQuestion || 'So where did 74 kg of tree come from?'}</p>
            <p style={{
              ...TYPE.caption,
              fontSize: '.78rem', color: '#5A6480', margin: '6px 0 0',
            }}>Tap Next to find out →</p>
          </div>
        </div>
      )}

      {/* ── Phase: REVEAL ── */}
      {phase === 'reveal' && (
        <div style={{ animation: 'hFadeIn .4s ease' }}>
          <div style={{ marginBottom: 18, textAlign: 'center' }}>
            <p style={{
              ...TYPE.eyebrow,
              color: '#5A6480', margin: '0 0 8px',
              textTransform: 'uppercase',
            }}>If not the soil... then:</p>
            <h2 style={{
              ...TYPE.displaySection,
              fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
              color: '#F5F7FB', margin: 0,
            }}>{hook.bigQuestion || 'Where did 74 kg come from?'}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {hook.revealItems?.map((item, i) => {
              const visible = i <= revealIdx
              return (
                <div key={i} style={{
                  background: visible ? (item.bg || 'rgba(56,210,122,.08)') : 'rgba(255,255,255,.02)',
                  border: '1.5px solid ' + (visible ? (item.color || 'rgba(56,210,122,.35)') : '#1E2A40'),
                  borderRadius: 16, padding: '14px 18px',
                  transition: 'all .35s ease',
                  transform: visible ? 'translateY(0)' : 'translateY(8px)',
                  opacity: visible ? 1 : 0.12,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.emoji}</span>
                  <div>
                    <div style={{
                      ...TYPE.titleMedium,
                      fontSize: '.95rem',
                      color: visible ? (item.color || '#4DFF88') : '#2A3552',
                    }}>{item.label}</div>
                    {visible && item.detail && (
                      <div style={{
                        ...TYPE.bodySmall,
                        fontSize: '.78rem', color: '#9CA8C7',
                        marginTop: 3, animation: 'hFadeIn .3s ease',
                      }}>{item.detail}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {!allRevealed ? (
            <button onClick={nextRevealItem} style={{
              width: '100%',
              background: 'rgba(56,210,122,.08)',
              border: '1.5px solid rgba(56,210,122,.3)',
              borderRadius: 14, padding: '14px',
              ...TYPE.button,
              color: '#6BFFB0',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              Reveal next → ({revealIdx + 2}/{hook.revealItems?.length})
            </button>
          ) : hook.punchline ? (
            <div style={{
              background: 'linear-gradient(145deg, #0A1F12, #061008)',
              border: '1px solid rgba(56,210,122,.3)',
              borderRadius: 14, padding: '16px 18px', textAlign: 'center',
              boxShadow: '0 0 32px rgba(56,210,122,.07)',
            }}>
              <p style={{
                ...TYPE.titleMedium,
                fontSize: '.95rem',
                color: '#4DFF88', margin: 0,
              }}>{hook.punchline}</p>
              <p style={{
                ...TYPE.caption,
                fontSize: '.75rem', color: '#5A6480',
                margin: '8px 0 0',
              }}>Tap Next to start learning →</p>
            </div>
          ) : null}
        </div>
      )}

      <style>{`
        @keyframes hFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hLeafPop { from{opacity:0;transform:scale(.4)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  )
}

// ─── IntroScreen ──────────────────────────────────────────────────────────────
// Universal second screen: retrieval starter + "this chapter you'll learn" list
// Reads from chapter.intro: { retrieval: { question, options[], correctIndex, explanation }, learningGoals[] }

function IntroScreen({ chapter, onDone }) {
  const intro = chapter.intro
  const subjectColor = chapter.color || '#38D27A'
  const [retrievalComplete, setRetrievalComplete] = useState(false)

  const hasRetrieval = !!intro.retrieval

  // When there's no retrieval question, show goals immediately
  const showGoals = !hasRetrieval || retrievalComplete

  return (
    <div style={{
      minHeight: '100vh', background: GENERAL.backgroundApp,
      padding: '28px 22px 120px',
      animation: 'fadeIn .4s ease',
    }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: subjectColor + '15',
            border: '1px solid ' + subjectColor + '30',
            borderRadius: 99, padding: '4px 12px', marginBottom: 14,
          }}>
            <span style={{
              ...TYPE.eyebrow,
              textTransform: 'uppercase',
              color: subjectColor,
            }}>{hasRetrieval ? '⚡ Retrieval Starter' : '🎯 Module Overview'}</span>
          </div>
          <h2 style={{
            ...TYPE.displaySection,
            ...HEADING_LAYOUT.screenTitle,
            fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
            color: '#F5F7FB', margin: '0 0 6px',
          }}>{hasRetrieval ? 'What do you already know?' : "You'll be able to…"}</h2>
          {hasRetrieval && (
            <p style={{
              ...TYPE.body,
              fontSize: '.85rem', color: '#5A6480', margin: 0,
            }}>No notes. No pressure. Just activate your brain.</p>
          )}
        </div>

        {/* RetrievalFrame v1 — wraps retrieval question and AnswerInteraction */}
        {hasRetrieval && (
          <RetrievalFrame
            retrieval={intro.retrieval}
            variant="contained"
            subject={chapter.subject}
            topic={chapter.title}
            beatId="intro"
            label="Quick check"
            mode="learning"
            onInteractionComplete={(_result) => setRetrievalComplete(true)}
          />
        )}

        {/* Learning goals — shown immediately when no retrieval, or after answering */}
        {showGoals && (
          <div style={{ animation: 'fadeIn .3s ease' }}>
            <div style={{
              background: 'linear-gradient(145deg, #10182B, #0D1424)',
              border: '1px solid #1E2A40',
              borderRadius: 18, padding: '18px 20px', marginBottom: 20,
            }}>
              <div style={{
                ...TYPE.eyebrow,
                textTransform: 'uppercase',
                color: subjectColor, marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>🎯 This chapter — you'll be able to</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {intro.learningGoals?.map((goal, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    animation: 'fadeIn .3s ease ' + (i * 0.1) + 's both',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: subjectColor + '20',
                      border: '1px solid ' + subjectColor + '40',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      ...TYPE.eyebrow,
                      fontSize: '.7rem', color: subjectColor,
                      marginTop: 1,
                    }}>{i + 1}</div>
                    <p style={{
                      ...TYPE.body,
                      fontSize: '.88rem', color: '#C8D0E8',
                      margin: 0,
                    }}>{goal}</p>
                  </div>
                ))}
              </div>
            </div>

            <ContinueCTA onClick={onDone} label="Start learning →" accent={subjectColor} textColor="#001A0A" />
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(7px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
      `}</style>
    </div>
  )
}

// ─── Chapter jump sheet ───────────────────────────────────────────────────────

function JumpSheet({ screens, currentScreen, accent, accentRgb, onJumpTo, onClose }) {
  const labeled = screens.filter(s => s.label)

  return (
    <>
      <style>{`
        @keyframes js-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .js-row:hover { background: rgba(${accentRgb},0.07) !important; }
        .js-row:active { background: rgba(${accentRgb},0.14) !important; }
        .js-close:hover { background: rgba(255,255,255,0.10) !important; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.54)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
        }}
      />

      {/* Dropdown sheet */}
      <div style={{
        position: 'fixed',
        top: 'calc(66px + env(safe-area-inset-top, 0px))',
        left: 12, right: 12,
        maxHeight: 'min(72vh, 540px)',
        background: 'rgba(9,12,22,0.97)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: `1px solid rgba(${accentRgb},0.16)`,
        borderRadius: 20,
        zIndex: 2001,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: `0 8px 48px rgba(0,0,0,0.64), 0 0 0 1px rgba(${accentRgb},0.06)`,
        animation: 'js-in 200ms cubic-bezier(.16,1,.3,1) both',
      }}>

        {/* Header */}
        <div style={{
          padding: '14px 18px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              ...TYPE.titleMedium,
              fontSize: 13,
              color: 'rgba(255,255,255,0.84)',
            }}>Chapter contents</span>
            <span style={{
              ...TYPE.label,
              fontSize: 11,
              color: `rgba(${accentRgb},0.56)`,
            }}>{labeled.length} sections</span>
          </div>
          <button
            className="js-close"
            onClick={onClose}
            aria-label="Close contents"
            style={{
              width: 28, height: 28, borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.42)', fontSize: 13,
              ...TYPE.label,
            }}
          >✕</button>
        </div>

        {/* Screen list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0 8px' }}>
          {screens.map((s, i) => {
            if (!s.label) return null
            const isCurrent = i === currentScreen
            return (
              <button
                key={i}
                className="js-row"
                onClick={() => onJumpTo(i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 18px',
                  background: isCurrent ? `rgba(${accentRgb},0.09)` : 'none',
                  border: 'none',
                  borderLeft: isCurrent ? `3px solid ${accent}` : '3px solid transparent',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background 100ms ease',
                }}
              >
                <span style={{
                  ...TYPE.eyebrow,
                  fontSize: 10,
                  color: `rgba(${accentRgb},${isCurrent ? '0.90' : '0.36'})`,
                  minWidth: 22, flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{
                  ...(isCurrent ? TYPE.titleMedium : TYPE.body),
                  fontSize: 14,
                  color: isCurrent ? '#EAF7F0' : 'rgba(255,255,255,0.56)',
                  flex: 1,
                }}>
                  {s.label}
                </span>
                {s.stage && (
                  <span style={{
                    ...TYPE.eyebrow,
                    fontSize: 9,
                    color: `rgba(${accentRgb},0.50)`,
                    textTransform: 'uppercase', flexShrink: 0,
                  }}>
                    {s.stage}
                  </span>
                )}
                {isCurrent && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: accent, flexShrink: 0,
                    boxShadow: `0 0 6px ${accent}`,
                  }} />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ─── Main ChapterPlayer ────────────────────────────────────────────────────────

export default function ChapterPlayer(props) {
  const validation = validateChapterDefinition(props.chapter)
  if (!validation.valid) {
    return <ChapterSchemaError chapter={props.chapter} errors={validation.errors} onBack={props.onBack} />
  }
  return <ValidatedChapterPlayer {...props} />
}

function ValidatedChapterPlayer({ chapter, onBack, onChapterComplete }) {
  const saved   = getChapterState(chapter.id)
  const _chapterGroup = MODULES.find(g => g.chapterIds.includes(chapter.id))
  const chapterNum    = _chapterGroup ? _chapterGroup.chapterIds.indexOf(chapter.id) + 1 : chapter.number

  // hookDone / wylDone / introDone track whether the universal openers have been seen.
  // We persist these inside the chapter state so resuming skips them correctly.
  // Initial values are derived by computeInitialChapterState (chapterNavigation.js).
  const initial = computeInitialChapterState(chapter, saved)
  const [hookDone,   setHookDone]   = useState(initial.hookDone)
  const [wylDone,    setWylDone]    = useState(initial.wylDone)
  const [recallDone, setRecallDone] = useState(initial.recallDone)
  const [introDone,  setIntroDone]  = useState(initial.introDone)
  // navTo — in-memory only, drives navigation back to hook/wyl/recall without changing "done" flags
  // null | 'hook' | 'wyl' | 'recall'
  const [navTo, setNavTo] = useState(null)
  const [screen, setScreen] = useState(initial.screen)
  const [showWeakSpotRecovery, setShowWeakSpotRecovery] = useState(false)
  const [detectedWeakSpot, _setDetectedWeakSpot] = useState(null)
  const [recoveryQuizId, setRecoveryQuizId] = useState(null)
  const [showExaminer,         setShowExaminer]         = useState(false)
  const [showExaminerExplains, setShowExaminerExplains] = useState(false)
  const [examinerAttempts, setExaminerAttempts] = useState(initial.examinerAttempts)
  // Sticks once a chapter has been finished — re-entering to review never un-completes it
  const [completed, setCompleted] = useState(initial.completed)
  const total   = chapter.screens.length
  const isLast  = screen === total - 1
  const [animKey, setAnimKey] = useState(0)
  const [cinematicHeaderVisible, setCinematicHeaderVisible] = useState(false)
  const [ihmExploreScreen, setIhmExploreScreen] = useState(null)
  const [jumpOpen, setJumpOpen] = useState(false)
  const [selectedHealer, setSelectedHealer] = useState(null)

  useEffect(() => {
    saveChapterState(chapter.id, { screen, hookDone, wylDone, recallDone, introDone, examinerAttempts, completed })
  }, [screen, chapter.id, hookDone, wylDone, recallDone, introDone, examinerAttempts, completed])

  // Reset cinematic header visibility whenever we navigate to a different screen
  useEffect(() => { setCinematicHeaderVisible(false) }, [screen])

  function go(delta) {
    const next = clampScreenIndex(screen + delta, total)
    setScreen(next)
    setAnimKey(k => k + 1)
    scrollToTop()
    recordActivity()
    setJumpOpen(false)
  }

  function goTo(idx) {
    const next = clampScreenIndex(idx, total)
    setScreen(next)
    setAnimKey(k => k + 1)
    scrollToTop()
    recordActivity()
    setJumpOpen(false)
  }

  function handleFinish() {
    const action = resolveFinishAction(chapter, { showExaminerExplains })
    if (action.type === 'showExaminerExplains') {
      setShowExaminerExplains(true)
      scrollToTop()
      return
    }
    if (action.type === 'showExaminer') {
      setShowExaminer(true)
    } else {
      detectWeakSpot()
    }
    scrollToTop()
  }

  function detectWeakSpot() {
    // V1: Simple heuristic-based weak spot detection
    // For now, no actual weak spot — just proceed to completion
    // This is where we'd integrate actual score analysis in future versions
    completeChapter()
  }

  function completeChapter() {
    recordActivity()
    setCompleted(true)
    // Persist full completion with a sticky `completed` flag so SubjectBrowser always reads this
    // chapter as 'completed' — even while reviewing it afterwards moves `screen` back down. Keep
    // the intro flags true so re-opening reviews the content straight away rather than replaying
    // the hook/recall/outcomes screens.
    saveChapterState(chapter.id, { screen: total, hookDone: true, wylDone: true, recallDone: true, introDone: true, examinerAttempts, completed: true })
    setTimeout(() => {
      if (onChapterComplete) onChapterComplete(chapter)
      else onBack()
    }, 400)
  }

  // Hook state — always called (hook is undefined when chapter has no hook)
  const hookState = useHookPhase(chapter.hook || {})
  const { phase: hookPhase, revealDone: hookRevealDone } = hookState

  // Determine what the "Next" button does at each stage
  function handleNext() {
    if (!hookDone && chapter.hook) {
      if (hookPhase === 'grow')   { hookState.nextFromGrow(); return }
      if (hookPhase === 'reveal') { if (hookRevealDone) { setHookDone(true); scrollToTop() } else { hookState.nextRevealItem(); } return }
      return // question / feedback: Next does nothing — user must tap TRUE/FALSE
    }
    if (!introDone && chapter.intro) return // IntroScreen has its own button
    isLast ? handleFinish() : go(1)
  }

  // Label + disabled state for the Continue/Finish button
  function nextLabel() {
    if (!hookDone && chapter.hook) {
      if (hookPhase === 'question' || hookPhase === 'feedback') return null // hidden
      if (hookPhase === 'grow')   return 'Continue'
      if (hookPhase === 'reveal') return hookRevealDone ? 'Continue' : null // hidden until all revealed
    }
    if (!introDone && chapter.intro) return null // IntroScreen has its own button
    if (screenHasComponentOwnedContinuation(chapter.screens[screen])) return null // governed component owns continuation
    return isLast ? 'Finish ✓' : 'Continue'
  }

  const showNextBtn  = nextLabel() !== null
  const nextBtnLabel = nextLabel()
  const isFinishBtn  = !(!hookDone && chapter.hook) && wylDone && recallDone && navTo === null && (!chapter.intro || introDone) && isLast

  const cur = chapter.screens[screen]
  const subjectColor = chapter.color || (SUBJECTS[chapter?.subject] || SUBJECTS.History).accent

  if (total === 0) {
    return (
      <div style={{ minHeight: '100dvh', background: '#08090D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <p style={{ ...TYPE.body, color: 'rgba(255,255,255,0.45)', fontSize: 15, textAlign: 'center', margin: 0 }}>
          {chapter.title} — coming soon.
        </p>
        <button
          onClick={onBack}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', ...TYPE.button, fontSize: 14, padding: '10px 24px', cursor: 'pointer' }}
        >
          Go back
        </button>
      </div>
    )
  }

  // ── Stage-based learning header ───────────────────────────────────────────
  const stageNavigation = getStageNavigation(chapter, total)
  const currentStage = (() => {
    if (navTo === 'recall' || (!recallDone && chapter.recall)) return stageNavigation[0]?.title || 'Intro'
    return getCurrentStageFromNavigation(stageNavigation, screen)
  })()

  const headerVisible =
    !showWeakSpotRecovery &&
    !recoveryQuizId &&
    !showExaminer &&
    hookDone && wylDone &&
    (isFullScreenVideoScreen(cur) ? cinematicHeaderVisible : true)

  function headerOnBack() {
    if (screen > 0) { go(-1); return }
    if (navTo === 'recall' || (!recallDone && chapter.recall)) {
      if (chapter.hook?.statement) { setNavTo('hook'); return }
      onBack(); return
    }
    if (chapter.recall) { setNavTo('recall'); scrollToTop(); return }
    if (chapter.hook?.statement) { setNavTo('hook'); scrollToTop(); return }
    onBack()
  }

  const subjectRgb = hexToRgb(subjectColor) || SUBJECTS.History.accentRgb
  const H = {
    chapter,
    currentStage,
    stageNavigation,
    currentScreen:  screen,
    onStageJump:    goTo,
    onBack:         headerOnBack,
    onExit:         onBack,
    onJumpOpen:     () => setJumpOpen(true),
    screenPos:      null,
  }
  const jumpSheetPortal = jumpOpen ? createPortal(
    <JumpSheet
      screens={chapter.screens}
      currentScreen={screen}
      accent={subjectColor}
      accentRgb={subjectRgb}
      onJumpTo={goTo}
      onClose={() => setJumpOpen(false)}
    />,
    document.body
  ) : null
  // ──────────────────────────────────────────────────────────────────────────

  // ── Confidence overlay — neutral, no colour judgement ──────────────────
  // Which universal-opener gate (if any) to render is decided by
  // getChapterGate (chapterNavigation.js); the JSX and side effects below stay here.
  const chapterGate = getChapterGate(chapter, { hookDone, wylDone, recallDone, navTo })

  // ── Full-screen hook screen — renders before the player shell ──────────────
  if (chapterGate.type === 'hook') {
    return (
      <ChapterHookScreen
        subject={chapter.subject}
        chapterNum={chapterNum}
        chapterTitle={chapter.title}
        statement={chapter.hook.statement}
        isTrue={chapter.hook.isTrue}
        accentWords={chapter.hook.accentWords || []}
        explanation={chapter.hook.explanation || chapter.hook.correctFeedback || ''}
        revealBeats={chapter.hook.revealBeats}
        backgroundImage={chapter.hook.backgroundImage || ''}
        onBack={onBack}
        onContinue={() => { setHookDone(true); setNavTo(null); scrollToTop() }}
      />
    )
  }

  // ── Chapter outcomes screen — appears after hook, before recall ──────────────
  if (chapterGate.type === 'outcomes') {
    return (
      <ChapterOutcomeScreen
        subject={chapter.subject}
        chapterNum={chapterNum}
        chapterTitle={chapter.title}
        outcomes={chapter.outcomes.bullets || chapter.outcomes}
        onBack={() => setHookDone(false)}
        onContinue={() => { setWylDone(true); scrollToTop() }}
      />
    )
  }

  // ── Full-screen recall screen — appears after outcomes, before content ────────
  if (chapterGate.type === 'recall') {
    return (
      <>
        <QuickRecallScreen
          subject={chapter.subject}
          chapterNum={chapterNum}
          chapterTitle={chapter.title}
          questions={chapter.recall.questions}
          onBack={() => {
            if (navTo === 'recall') setNavTo(null)
            else if (chapter.hook?.statement) setNavTo('hook')
            else onBack()
          }}
          onContinue={() => { setRecallDone(true); setNavTo(null); scrollToTop() }}
          renderHeader={() => (
            <LearningHeader {...H} currentStage="Discover" visible={true} />
          )}
        />
        {jumpSheetPortal}
      </>
    )
  }

  if (showExaminerExplains) {
    return (
      <ExaminerExplainsScreen
        subject={chapter.subject}
        examinerExplains={chapter.examinerExplains}
        onBack={() => { setShowExaminerExplains(false); go(-1) }}
        onContinue={() => {
          setShowExaminerExplains(false)
          // Navigate to the faceExaminer screen if one exists in this chapter
          const faceExamIdx = findScreenIndexByType(chapter.screens, 'faceExaminer')
          if (faceExamIdx >= 0) {
            setScreen(faceExamIdx)
            setAnimKey(k => k + 1)
            scrollToTop()
            return
          }
          if (chapter.examiner) {
            setShowExaminer(true)
          } else {
            detectWeakSpot()
          }
          scrollToTop()
        }}
      />
    )
  }

  if (showExaminer) {
    return (
      <FaceTheExaminer
        chapter={chapter}
        examiner={chapter.examiner}
        onExit={onBack}
        onContinue={({ originalMark: _originalMark, finalMark, guessedMark }) => {
          const attempt = {
            moduleId: chapter.id,
            questionId: `${chapter.id}-q1`,
            guessedMark,
            examinerMark: chapter.examiner.mark,
            finalMark,
            timestamp: Date.now(),
          }
          const updated = [...examinerAttempts, attempt]
          setExaminerAttempts(updated)
          saveChapterState(chapter.id, { screen, hookDone, wylDone, recallDone, introDone, examinerAttempts: updated })
          setShowExaminer(false)
          completeChapter()
          scrollToTop()
        }}
      />
    )
  }

  // Recovery quiz player
  if (recoveryQuizId) {
    return (
      <RecoveryQuizPlayer
        recoveryQuizId={recoveryQuizId}
        onComplete={() => {
          setRecoveryQuizId(null)
          completeChapter()
        }}
        onBack={() => setRecoveryQuizId(null)}
      />
    )
  }

  // Weak spot recovery screen
  if (showWeakSpotRecovery && detectedWeakSpot) {
    return (
      <WeakSpotRecovery
        block={detectedWeakSpot}
        subject={chapter.subject}
        progress={{ current: screen + 1, total: total }}
        onBack={() => setShowWeakSpotRecovery(false)}
        onFixWeakSpot={(quizId) => {
          setShowWeakSpotRecovery(false)
          setRecoveryQuizId(quizId)
        }}
        onSkip={() => {
          setShowWeakSpotRecovery(false)
          completeChapter()
        }}
      />
    )
  }

  const routeDefinition = resolveScreenDefinition(cur)
  if (!routeDefinition || routeDefinition.layout === 'full') {
    return (
      <ScreenRenderer
        screen={cur}
        chapter={chapter}
        chapterNum={chapterNum}
        isLast={isLast}
        handleFinish={handleFinish}
        go={go}
        screenIndex={screen}
        setScreen={setScreen}
        setAnimKey={setAnimKey}
        scrollToTop={scrollToTop}
        headerProps={H}
        jumpSheetPortal={jumpSheetPortal}
        subjectColor={subjectColor}
        headerOnBack={headerOnBack}
        ihmExploreScreen={ihmExploreScreen}
        setIhmExploreScreen={setIhmExploreScreen}
        selectedHealer={selectedHealer}
        setSelectedHealer={setSelectedHealer}
        cinematicHeaderVisible={cinematicHeaderVisible}
        setCinematicHeaderVisible={setCinematicHeaderVisible}
        onScreenComplete={isLast ? handleFinish : () => go(1)}
      />
    )
  }

  return (
    <>
      <LearningHeader {...H} visible={headerVisible} />
      <ContentShell subject={chapter.subject}>
        {(!hookDone && chapter.hook && !chapter.hook.statement)
          ? <HookContent chapter={chapter} hook={chapter.hook} hookState={hookState} subjectColor={subjectColor} />
          : !introDone && chapter.intro
            ? <IntroScreen chapter={chapter} onDone={() => { setIntroDone(true); scrollToTop() }} />
              : (
                <div key={animKey} className="anim-pop">
                  <ScreenRenderer screen={cur} chapter={chapter} subject={chapter.subject} onScreenComplete={isLast ? handleFinish : () => go(1)} />
                </div>
              )
        }
      </ContentShell>

      {/* ── Bottom navigation — Next only ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        background: 'rgba(8,9,13,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
      }}>
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          {showNextBtn ? (
            <ContinueCTA
              onClick={handleNext}
              label={nextBtnLabel}
              accent={isFinishBtn
                ? 'linear-gradient(135deg, #1A4D2E, #38D27A)'
                : (SUBJECTS[chapter.subject]?.accent || subjectColor)}
              textColor={isFinishBtn ? '#fff' : '#0D0F14'}
              style={isFinishBtn ? { boxShadow: '0 4px 16px rgba(56,210,122,.35)' } : undefined}
            />
          ) : (
            <div style={{ height: BUTTONS.continue.height }} />
          )}
        </div>
      </div>
      {jumpSheetPortal}
    </>
  )
}
