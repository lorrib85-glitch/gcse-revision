import { useState } from 'react'
import { MATHS_TOPIC_GROUPS, ALL_MATHS_QUESTIONS, FORMULA_SHEET, DIAGRAMS } from './data/mathsTopics.js'
import { ENGLISH_TOPIC_GROUPS, ALL_ENGLISH_QUESTIONS } from './data/englishTopics.js'
import { FIGURES } from './figures.js'
import { TOPICS, TOPIC_DATA } from './content.js'
import { getProgress, saveSessionResult, getNextTopicId, daysUntil, saveSessionDraft, getSessionDraft, clearSessionDraft } from './progress.js'
import { MODULES } from './modules.js'
import ModulePlayer from './ModulePlayer.jsx'

// ─── Helpers ────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom(arr, n) { return shuffle(arr).slice(0, n) }

function withShuffledOptions(q) {
  const indexed = q.options.map((text, i) => ({ text, isCorrect: i === q.correctIndex }))
  const shuffled = shuffle(indexed)
  return { ...q, options: shuffled.map(o => o.text), correctIndex: shuffled.findIndex(o => o.isCorrect) }
}

function buildSession(topicId) {
  const current = TOPIC_DATA[topicId]
  if (!current) return null
  const allQ = Object.entries(TOPIC_DATA).flatMap(([, d]) => d.questions)
  return {
    topicId,
    warmupQ:          pickRandom(current.questions, 3).map(withShuffledOptions),
    facts:            current.facts,
    keyDates:         current.keyDates,
    miniQuizQ:        pickRandom(allQ, Math.min(7, allQ.length)).map(withShuffledOptions),
    interactiveFacts: current.interactiveFacts || null,
  }
}

const TOPIC_IDS = TOPICS.map(t => t.id)

function safeGetModuleState(moduleId) {
  try { return JSON.parse(localStorage.getItem('gcse_module_' + moduleId) || '{}') } catch { return {} }
}

function safeGetProgress() {
  try { return getProgress() } catch { return { streak: 0, lastSessionDate: null, topicProgress: {}, history: [] } }
}

function safeGetDraft() {
  try { return getSessionDraft() } catch { return null }
}

// ─── Top-level router ────────────────────────────────────────────────────────

// ─── Bottom nav ──────────────────────────────────────────────────────────────

const NAV_ICONS = {
  home: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#9D5CFF' : 'none'} stroke={active ? '#9D5CFF' : '#4A5578'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  modules: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#9D5CFF' : '#4A5578'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="7" height="7" fill={active ? 'rgba(157,92,255,.2)' : 'none'}/><rect x="15" y="3" width="7" height="7" fill={active ? 'rgba(157,92,255,.2)' : 'none'}/><rect x="2" y="14" width="7" height="7" fill={active ? 'rgba(157,92,255,.2)' : 'none'}/><rect x="15" y="14" width="7" height="7" fill={active ? 'rgba(157,92,255,.2)' : 'none'}/>
    </svg>
  ),
  test: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#9D5CFF' : '#4A5578'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
}

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'home',    label: 'Home'    },
    { id: 'modules', label: 'Modules' },
    { id: 'test',    label: 'Test'    },
  ]
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,13,28,.96)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(157,92,255,.15)',
      boxShadow: '0 -1px 0 rgba(157,92,255,.08), 0 -8px 32px rgba(0,0,0,.4)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(t => {
        const active = tab === t.id
        return (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, border: 'none', background: 'none', cursor: 'pointer',
              padding: '9px 0 7px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              transition: 'opacity .15s',
            }}>
            {NAV_ICONS[t.id](active)}
            <span style={{
              fontSize: '.58rem', fontWeight: 600, letterSpacing: '.05em',
              fontFamily: "'Inter', sans-serif",
              color: active ? '#9D5CFF' : '#4A5578',
              transition: 'color .2s',
            }}>{t.label}</span>
            {active && (
              <div style={{
                width: 22, height: 2, background: 'linear-gradient(90deg, #7C3AED, #9D5CFF)',
                borderRadius: 99, marginTop: 1,
                boxShadow: '0 0 8px rgba(157,92,255,.7)',
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab]             = useState('home')
  const [view, setView]           = useState(null)   // 'module' | 'session' | 'end' — overlays
  const [topicId, setTopicId]     = useState(null)
  const [session, setSession]     = useState(null)
  const [startPhase, setStartPhase] = useState(1)
  const [results, setResults]     = useState({})
  const [savedData, setSavedData] = useState(null)
  const [progress, setProgress]   = useState(() => safeGetProgress())
  const [draft, setDraft]         = useState(() => safeGetDraft())
  const [activeModule, setActiveModule] = useState(null)

  function openModule(mod) {
    setActiveModule(mod)
    setView('module')
  }

  function startSession(id, resumePhase = 1, resumeResults = {}) {
    const built = buildSession(id)
    setTopicId(id)
    setSession(built)
    setResults(resumeResults)
    setStartPhase(resumePhase)
    setSavedData(null)
    saveSessionDraft({ topicId: id, phase: resumePhase, results: resumeResults })
    setView('session')
  }

  function resumeSession() {
    const d = getSessionDraft()
    if (!d) return
    startSession(d.topicId, d.phase, d.results || {})
  }

  function discardDraft() {
    clearSessionDraft()
    setDraft(null)
  }

  function finishSession(finalResults) {
    const saved = saveSessionResult({
      topicId,
      score: (finalResults.warmupScore || 0) + (finalResults.quizScore || 0),
      total: 3 + (finalResults.quizTotal || 0),
    })
    setSavedData(saved)
    setResults(finalResults)
    setProgress(getProgress())
    setDraft(null)
    setView('end')
  }

  function closeOverlay() {
    setProgress(safeGetProgress())
    setDraft(safeGetDraft())
    setView(null)
  }

  // Full-screen overlays take priority
  if (view === 'module' && activeModule) return <ModulePlayer module={activeModule} onBack={closeOverlay} />
  if (view === 'session' && session)     return <Session session={session} topicId={topicId} startPhase={startPhase} initialResults={results} onFinish={finishSession} onHome={closeOverlay} />
  if (view === 'end')                    return <EndScreen topicId={topicId} results={results} savedData={savedData} onHome={closeOverlay} onStart={startSession} />

  // Tab shell
  return (
    <div style={{ background: '#070B1A', minHeight: '100vh' }}>
      {tab === 'home'    && <Home    progress={progress} draft={draft} onStart={startSession} onResume={resumeSession} onDiscardDraft={discardDraft} onOpenModule={openModule} />}
      {tab === 'modules' && <ModulesTab onOpenModule={openModule} />}
      {tab === 'test'    && <TestTab />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}

// ─── Shared palette ──────────────────────────────────────────────────────────

const W = {
  bg:         '#070B1A',
  bgCard:     '#10182B',
  border:     '#2A3552',
  text:       '#F5F7FB',
  textMid:    '#C8D0E8',
  textMuted:  '#9CA8C7',
  textLight:  '#5A6480',
  gold:       '#F5B700',
  goldLight:  'rgba(245,183,0,.12)',
  green:      '#4DFF88',
  btnPrimary: 'linear-gradient(135deg, #F5B700, #C98719)',
}

// ─── Home tab ─────────────────────────────────────────────────────────────────

const GREETINGS = [
  "Right then, Elliot. Let's get some of this locked in.",
  "Back again. Good. Consistency beats cramming every time.",
  "Small session, big difference. Let's go.",
  "The exam won't study for itself. Fortunately, you're here.",
  "One topic at a time. That's all this is.",
  "You showed up. That's already the hard part done.",
  "No pressure. Just progress.",
  "Medicine in Britain isn't going to remember itself.",
]

function daysUntilExam() {
  const exam = new Date('2027-05-01')
  const today = new Date()
  today.setHours(0,0,0,0); exam.setHours(0,0,0,0)
  return Math.max(0, Math.round((exam - today) / 86400000))
}

function Home({ progress, draft, onStart, onResume, onDiscardDraft, onOpenModule }) {
  const nextId        = getNextTopicId(TOPIC_IDS)
  const draftTopic    = draft ? TOPICS.find(t => t.id === draft.topicId) : null
  const PHASE_NAMES   = ['', 'Warm-up', 'Key Facts', 'Mini Quiz', 'Progress']
  const streak        = progress.streak || 0
  const examDays      = daysUntilExam()
  const totalSessions = Object.values(progress.topicProgress || {}).reduce((s, t) => s + (t.completedSessions || 0), 0)
  const modulesCompleted = MODULES.filter(m => {
    const s = safeGetModuleState(m.id)
    return s.screen >= (m.screens?.length || 1) - 1
  }).length

  const nextModule = MODULES.find(m => {
    const s = safeGetModuleState(m.id)
    return !s.screen || s.screen < (m.screens?.length || 1) - 1
  }) || MODULES[0]

  const nextModuleState   = nextModule ? safeGetModuleState(nextModule.id) : {}
  const nextModulePct     = nextModule
    ? Math.round(((nextModuleState.screen || 0) / (nextModule.screens?.length || 1)) * 100)
    : 0
  const nextModuleStarted = (nextModuleState.screen || 0) > 0

  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'Morning,' : hour < 17 ? 'Afternoon,' : 'Evening,'

  const QUICK_SUBJECTS = [
    { label: 'Random', icon: '🎲', color: '#9D5CFF', bg: 'rgba(157,92,255,.14)', id: nextId },
    { label: 'History', icon: '🏰', color: '#F5B700', bg: 'rgba(245,183,0,.12)',  id: 'medieval' },
    { label: 'Science', icon: '🧬', color: '#38D27A', bg: 'rgba(56,210,122,.12)', id: 'tb_cells' },
    { label: 'Mixed',   icon: '⚡', color: '#3B82FF', bg: 'rgba(59,130,255,.12)', id: nextId },
  ]

  return (
    <div style={{ background: '#080C1A', minHeight: '100vh', paddingBottom: 72 }}>

      {/* ── Top bar ── */}
      <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '.95rem' }}>🔥</span>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 700,
            fontSize: '.78rem', color: streak > 0 ? '#FF8A1F' : '#4A5578',
            letterSpacing: '.04em',
          }}>
            {streak > 0 ? `${streak} DAY STREAK` : 'START STREAK'}
          </span>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 99,
          background: '#10182B', border: '1px solid #2A3552',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.9rem', color: '#4A5578', cursor: 'pointer',
        }}>🔔</div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 18px 0' }}>

        {/* ── Hero greeting ── */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(2rem, 7vw, 2.6rem)',
            color: '#F5F7FB',
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: '-.02em',
          }}>
            {timeGreeting}<br />
            <span style={{ color: '#9D5CFF' }}>Elliot.</span>
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.88rem', color: '#5A6480',
            marginTop: 8, fontWeight: 400,
          }}>
            Ready for your next <span style={{ color: '#C18CFF', fontWeight: 600 }}>win</span>?
          </p>
        </div>

        {/* ── Focus session hero card ── */}
        {nextModule && (
          <div style={{
            background: 'linear-gradient(145deg, #12183A 0%, #0E1330 100%)',
            border: '1px solid rgba(157,92,255,.22)',
            borderRadius: 20,
            padding: '18px',
            marginBottom: 14,
            boxShadow: '0 0 0 1px rgba(157,92,255,.06), 0 8px 40px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* ambient glow blob */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 140, height: 140, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(157,92,255,.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* TODAY chip */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(157,92,255,.12)', border: '1px solid rgba(157,92,255,.25)',
              borderRadius: 6, padding: '3px 9px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '.62rem', fontWeight: 600, color: '#C18CFF',
              letterSpacing: '.08em', textTransform: 'uppercase',
              marginBottom: 14,
            }}>TODAY</div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              {/* Icon tile */}
              <div style={{
                width: 60, height: 60, borderRadius: 15, flexShrink: 0,
                background: 'linear-gradient(145deg, rgba(245,183,0,.18), rgba(245,183,0,.08))',
                border: '1px solid rgba(245,183,0,.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.7rem',
                boxShadow: '0 0 20px rgba(245,183,0,.1)',
              }}>
                {nextModule.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '1.1rem',
                  color: '#F5F7FB', lineHeight: 1.2,
                  letterSpacing: '-.01em',
                }}>
                  {nextModule.title}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '.78rem', color: '#5A6480', marginTop: 4,
                }}>
                  {nextModuleStarted ? 'Continue where you left off' : nextModule.subtitle}
                </div>

                {/* Progress bar */}
                {nextModuleStarted && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: '#1A2338', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: nextModulePct + '%',
                          background: 'linear-gradient(90deg, #7C3AED, #9D5CFF)',
                          borderRadius: 99,
                          boxShadow: '0 0 8px rgba(157,92,255,.6)',
                          transition: 'width .6s ease',
                        }} />
                      </div>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '.75rem', fontWeight: 700, color: '#9D5CFF', flexShrink: 0,
                      }}>{nextModulePct}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <button onClick={() => onOpenModule(nextModule)} style={{
              width: '100%',
              background: 'linear-gradient(135deg, #7C3AED 0%, #9D5CFF 100%)',
              color: '#fff', border: 'none', borderRadius: 13,
              padding: '15px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.95rem',
              letterSpacing: '.03em', textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124,58,237,.45), inset 0 1px 0 rgba(255,255,255,.12)',
              transition: 'transform .15s, box-shadow .15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {nextModuleStarted ? 'Continue Session' : 'Start Focus Session'} →
            </button>

            {/* Draft banner if relevant */}
            {draft && draftTopic && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.72rem', color: '#5A6480', marginBottom: 8 }}>
                  ↩ Unfinished: <span style={{ color: '#C18CFF', fontWeight: 600 }}>{draftTopic.title}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={onResume} style={{
                    flex: 2, background: 'rgba(157,92,255,.12)', border: '1px solid rgba(157,92,255,.28)',
                    borderRadius: 9, padding: '9px', fontWeight: 600, cursor: 'pointer',
                    fontSize: '.82rem', fontFamily: "'Inter', sans-serif", color: '#C18CFF',
                  }}>Resume →</button>
                  <button onClick={onDiscardDraft} style={{
                    flex: 1, background: 'transparent', color: '#4A5578',
                    border: '1px solid #2A3552', borderRadius: 9, padding: '9px',
                    fontWeight: 500, cursor: 'pointer', fontSize: '.78rem',
                    fontFamily: "'Inter', sans-serif",
                  }}>Discard</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Stats row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
          {[
            { value: streak,            label: 'Streak',   suffix: ' days', color: '#FF8A1F', icon: '🔥' },
            { value: modulesCompleted,  label: 'Modules',  suffix: ' done', color: '#9D5CFF', icon: '✓'  },
            { value: examDays,          label: 'To exam',  suffix: ' days', color: '#3B82FF', icon: '📅' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'linear-gradient(145deg, #10182B, #0D1424)',
              border: '1px solid #1E2A40',
              borderRadius: 14, padding: '12px 10px',
              textAlign: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.03)',
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '1.25rem',
                color: s.color, lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.6rem', fontWeight: 500,
                color: '#4A5578', textTransform: 'uppercase',
                letterSpacing: '.08em', marginTop: 5,
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Quick Quiz section ── */}
        <div style={{
          background: 'linear-gradient(145deg, #10182B, #0D1424)',
          border: '1px solid #1E2A40',
          borderRadius: 18, padding: '16px 16px 14px',
          marginBottom: 14,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.03)',
        }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <span style={{ fontSize: '1rem' }}>⚡</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '1rem', color: '#F5F7FB',
              }}>Quick Quiz</span>
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.78rem', color: '#5A6480', margin: 0,
            }}>5 questions. No pressure. Just keep your brain warm.</p>
          </div>

          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {QUICK_SUBJECTS.map((s, i) => (
              <button key={i} onClick={() => onStart(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: s.bg, border: `1px solid ${s.color}28`,
                borderRadius: 99, padding: '8px 13px',
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                fontWeight: 600, fontSize: '.8rem', color: s.color,
                transition: 'transform .12s, box-shadow .12s',
                boxShadow: `0 0 0 0 ${s.color}`,
              }}>
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Next steps ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '⚡', label: 'Quick Win', sub: '2 minute warm-up', iconBg: 'rgba(255,200,87,.12)', iconBorder: 'rgba(255,200,87,.22)', iconColor: '#FFC857', action: () => onStart(nextId) },
            { icon: '🧠', label: 'Review Weak Spots', sub: 'Focus on what matters', iconBg: 'rgba(56,210,122,.1)', iconBorder: 'rgba(56,210,122,.2)', iconColor: '#38D27A', action: () => onStart(nextId) },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{
              background: 'linear-gradient(145deg, #10182B, #0D1424)',
              border: '1px solid #1E2A40',
              borderRadius: 14, padding: '13px 14px',
              display: 'flex', alignItems: 'center', gap: 13,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.03)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 99, flexShrink: 0,
                background: item.iconBg, border: `1px solid ${item.iconBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: '.92rem', color: '#E0E6F0',
                }}>{item.label}</div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '.75rem', color: '#4A5578', marginTop: 2,
                }}>{item.sub}</div>
              </div>
              <span style={{ color: '#2A3552', fontSize: '1.1rem', fontWeight: 300 }}>›</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}



// ─── Modules tab ──────────────────────────────────────────────────────────────

function ModulesTab({ onOpenModule }) {
  const subjects = [...new Set(MODULES.map(m => m.subject))]

  const SUBJECT_COLOURS = {
    'History':  { color: '#F5B700', bg: 'rgba(245,183,0,.12)',  border: 'rgba(245,183,0,.25)'  },
    'Biology':  { color: '#38D27A', bg: 'rgba(56,210,122,.12)', border: 'rgba(56,210,122,.25)' },
    'Science':  { color: '#38D27A', bg: 'rgba(56,210,122,.12)', border: 'rgba(56,210,122,.25)' },
    'Maths':    { color: '#3B82FF', bg: 'rgba(59,130,255,.12)', border: 'rgba(59,130,255,.25)' },
    'English':  { color: '#9D5CFF', bg: 'rgba(157,92,255,.12)', border: 'rgba(157,92,255,.25)' },
    'Sociology':{ color: '#FF5C7A', bg: 'rgba(255,92,122,.12)', border: 'rgba(255,92,122,.25)' },
    'Drama':    { color: '#FF4FC3', bg: 'rgba(255,79,195,.12)', border: 'rgba(255,79,195,.25)' },
    'Music':    { color: '#34D5FF', bg: 'rgba(52,213,255,.12)', border: 'rgba(52,213,255,.25)' },
  }

  return (
    <div style={{ background: '#070B1A', minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ background: '#10182B', borderBottom: '1px solid #2A3552', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#F5F7FB' }}>Modules</div>
        <div style={{ fontSize: '.78rem', color: '#9CA8C7', marginTop: 3 }}>Work through these daily — one module at a time.</div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '20px 16px' }}>
        {subjects.map(subject => {
          const mods = MODULES.filter(m => m.subject === subject)
          const sc = SUBJECT_COLOURS[subject] || SUBJECT_COLOURS['History']
          return (
            <div key={subject} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: sc.bg, border: `1px solid ${sc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem' }}>
                  {subject === 'History' ? '🏰' : subject === 'Biology' || subject === 'Science' ? '🧬' : subject === 'Maths' ? '✕' : subject === 'English' ? '📖' : subject === 'Sociology' ? '👥' : subject === 'Drama' ? '🎭' : '🎵'}
                </div>
                <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: sc.color }}>
                  {subject}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mods.map(mod => {
                  const s      = safeGetModuleState(mod.id)
                  const screen = s.screen || 0
                  const pct    = Math.round(((screen + 1) / mod.screens.length) * 100)
                  const done   = screen >= mod.screens.length - 1
                  const started = screen > 0
                  const mc     = SUBJECT_COLOURS[mod.subject] || sc
                  return (
                    <button key={mod.id} onClick={() => onOpenModule(mod)} style={{
                      background: '#10182B',
                      border: `1px solid ${done ? 'rgba(77,255,136,.35)' : '#2A3552'}`,
                      borderRadius: 14, padding: '14px 15px',
                      cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', transition: 'border-color .2s, transform .15s',
                    }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                        background: mod.colorLight || mc.bg,
                        border: `1px solid ${mc.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.15rem', position: 'relative',
                      }}>
                        {mod.icon}
                        {done && (
                          <div style={{
                            position: 'absolute', top: -5, right: -5,
                            background: '#4DFF88', color: '#00140a',
                            borderRadius: 99, width: 17, height: 17,
                            fontSize: '.58rem', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontWeight: 900,
                            boxShadow: '0 0 8px rgba(77,255,136,.5)',
                          }}>✓</div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: mc.color, fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 3 }}>
                          {mod.subject} · Module {mod.number}
                        </div>
                        <div style={{ color: '#F5F7FB', fontWeight: 700, fontSize: '.93rem' }}>{mod.title}</div>
                        <div style={{ color: '#9CA8C7', fontSize: '.73rem', marginTop: 2 }}>{mod.subtitle}</div>
                        {started && !done && (
                          <div style={{ marginTop: 8, height: 3, background: '#2A3552', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: pct + '%', background: mod.color || mc.color, borderRadius: 99, boxShadow: `0 0 6px ${mc.color}55` }} />
                          </div>
                        )}
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        {done
                          ? <span style={{ fontSize: '.72rem', color: '#4DFF88', fontWeight: 700 }}>Done ✓</span>
                          : started
                            ? <span style={{ fontSize: '.75rem', color: '#F5B700', fontWeight: 800 }}>{pct}%</span>
                            : <span style={{ fontSize: '.85rem', color: '#5A6480', fontWeight: 700 }}>→</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Test tab ─────────────────────────────────────────────────────────────────

const TEST_TOPICS = [
  {
    subject: 'History',
    icon: '📜',
    topics: [
      { id: 'th1', label: 'Medieval Medicine c1250–c1500',        questions: 4,  available: true },
      { id: 'th2', label: 'Renaissance & the Plague c1500–c1700', questions: 3,  available: true },
      { id: 'th3', label: 'Surgery & Anatomy c1700–c1900',        questions: 3,  available: true },
      { id: 'th4', label: 'Germ Theory c1850–c1900',              questions: 3,  available: true },
      { id: 'th5', label: 'Public Health c1800–c1900',            questions: 3,  available: true },
    ]
  },
  {
    subject: 'Biology',
    icon: '🧬',
    topics: [
      { id: 'tb_cells',    label: 'Cells, microscopy & size calculations', questions: 6,  available: true },
      { id: 'tb_digest',   label: 'Digestion, enzymes & absorption',       questions: 9,  available: true },
      { id: 'tb_transp',   label: 'Transpiration, stomata & water loss',   questions: 8,  available: true },
      { id: 'tb_resp',     label: 'Respiration — aerobic & anaerobic',     questions: 6,  available: true },
      { id: 'tb_blood',    label: 'Blood, heart & circulatory system',     questions: 8,  available: true },
      { id: 'tb_immune',   label: 'Disease, immunity & drug testing',      questions: 11, available: true },
      { id: 'tb_osmosis',  label: 'Osmosis & water movement',              questions: 6,  available: true },
      { id: 'tb_photo',    label: 'Photosynthesis',                        questions: 6,  available: true },
      { id: 'tb_cells_div','label': 'Cell division, growth & mitosis',     questions: 4,  available: true },
    ]
  },
  { subject: 'Chemistry',          icon: '⚗️',  topics: [{ id: 'tc1',   label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'Physics',            icon: '⚡',  topics: [{ id: 'tp1',   label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'Maths',              icon: '📐',  topics: [{ id: 'tm1',   label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'Music',              icon: '🎵',  topics: [{ id: 'tmu1',  label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'Sociology',          icon: '👥',  topics: [{ id: 'ts1',   label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'English Literature', icon: '📚',  topics: [{ id: 'tel1',  label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'English Language',   icon: '✍️',  topics: [{ id: 'tela1', label: 'Coming soon', questions: 0, available: false }] },
]


// ── Real AQA past paper questions with real mark schemes ──────────────────────
// Source: AQA 8464/B/1F June 2020 + Nov 2020

const PAST_PAPER_QS = {

  // ── HISTORY ──────────────────────────────────────────────────────────────────

  th1: [
    { q: `Describe two features of medieval hospitals. [4 marks]`, type: 'written', marks: 4, ms: `Award up to 2 marks per feature (1 for identifying, 1 for supporting detail). Features include: run by the Church/monks/nuns; focused on care and prayer rather than curing disease; St Bartholomew\'s Hospital founded 1123; patients prayed and received basic care; hospitals were places of rest not medical treatment; staffed by religious orders.` },
    { q: `Explain why the Church both helped and hindered medicine in the Middle Ages. [12 marks]`, type: 'written', marks: 12, ms: `Helped: preserved Galen\'s texts in universities; ran hospitals like St Bartholomew\'s (1123); provided care for sick; trained physicians. Hindered: discouraged dissection (body needed to be whole for resurrection); treated Galen\'s work as unquestionable; linked illness to sin/God\'s punishment; discouraged new thinking. Strong answers explain the mechanism, not just list.` },
    { q: `How far was the Black Death a turning point in the history of medicine? Explain your answer. [16 marks]`, type: 'written', marks: 16, ms: `Was a turning point: exposed limits of medieval medicine; prompted some public health action. Counter: beliefs and treatments barely changed; humours still dominant after 1349; no new understanding of disease. Strong answers need specific evidence (1348 arrival, 1/3 died, miasma/God\'s punishment blamed), explain why change/continuity happened, reach clear supported judgement.` },
    { q: `"The main reason medieval medicine made little progress was the influence of the Church." How far do you agree? Explain your answer. [16 marks]`, type: 'written', marks: 16, ms: `Agree: Church backed Galen, discouraged dissection, linked illness to God, trained physicians in outdated ideas. Disagree: other factors — lack of technology, four humours theory itself, tradition and conservatism, limited scientific method, Galen\'s own authority. Strong answers argue both sides with specific evidence, reach a clear judgement about which factor was most important and why.` },
  ],
  th2: [
    { q: "Describe two features of Vesalius's contribution to medicine. [4 marks]", type: 'written', marks: 4, ms: `Award up to 2 marks per feature. Features: corrected over 300 of Galen\'s errors; used human dissection himself; published De Fabrica (1543); proved jaw is one bone; showed septum of heart had no holes; encouraged observation over ancient authority.` },
    { q: "Explain why Harvey's discovery of blood circulation did not immediately lead to better treatments. [12 marks]", type: 'written', marks: 12, ms: `Key points: Harvey proved blood circulates but could not explain what blood does; doctors still used bloodletting because they did not know what else to do; understanding does not automatically change treatment; conservative medical profession; lack of technology. Strong answers explain the mechanism — why understanding and treatment are separate things.` },
    { q: `How far did the Renaissance change medicine? Explain your answer. [16 marks]`, type: 'written', marks: 16, ms: `Changed: Vesalius corrected anatomy, Harvey proved circulation, Paré improved surgery, printing press spread ideas. Continuity: treatments barely changed, humours still used, bleeding/purging continued, Great Plague 1665 shows disease understanding remained poor. Strong answers: balanced argument with specific evidence, clear judgement on extent of change.` },
  ],
  th3: [
    { q: `Describe two problems with surgery before the 1840s. [4 marks]`, type: 'written', marks: 4, ms: `Award up to 2 marks per problem. Problems: no anaesthetic so patients conscious and in pain; no antiseptics so infection was common; no blood transfusions so blood loss often fatal; dirty instruments spread infection; surgeons judged on speed not care.` },
    { q: `Explain why anaesthetics both helped and created new problems for surgery. [12 marks]`, type: 'written', marks: 12, ms: `Helped: removed pain, patients could stay still, surgeons could work more carefully, longer operations possible. Problems: longer operations increased infection risk; overconfidence led to more ambitious surgery before antiseptics; chloroform could be fatal if overdosed (Hannah Greener, 1848). Strong answers explain both effects with specific evidence.` },
    { q: "How important was Lister's use of antiseptics in improving surgery? [16 marks]", type: 'written', marks: 16, ms: `Important: carbolic acid dramatically reduced infection deaths; applied Pasteur\'s germ theory practically; changed surgical practice; aseptic surgery followed. Limits: other factors also improved surgery — anaesthetics (Simpson 1847), blood groups, aseptic methods went further; initial resistance from surgeons. Strong answers: weigh against other factors, reach supported judgement.` },
  ],
  th4: [
    { q: "Describe two features of Pasteur's germ theory. [4 marks]", type: 'written', marks: 4, ms: `Award up to 2 marks per feature. Features: proved micro-organisms cause disease/decay; swan-neck flask experiment (1861); overturned spontaneous generation; showed microbes come from air; led to pasteurisation; opened door to vaccines and antiseptics.` },
    { q: "Explain why Koch's work was important for the development of medicine. [12 marks]", type: 'written', marks: 12, ms: `Key points: identified specific bacteria causing specific diseases (anthrax 1876, TB 1882, cholera 1883); developed staining techniques; made germ theory more convincing; enabled development of targeted treatments; built on Pasteur\'s general germ theory. Strong answers explain why specificity mattered.` },
    { q: `"Pasteur\'s germ theory was the most important development in medicine in the 19th century." How far do you agree? [16 marks]`, type: 'written', marks: 16, ms: `Agree: germ theory underpinned antiseptic surgery, vaccines, public health reform; changed direction of all medicine; Pasteur\'s swan-neck flask 1861 was pivotal. Disagree: other developments also important — anaesthetics (Simpson 1847), public health acts (1848, 1875), Koch\'s specific discoveries, Lister\'s antiseptics, Snow\'s waterborne cholera proof. Strong answers: weigh with specific evidence, clear supported judgement.` },
  ],
  th5: [
    { q: `Describe two features of the 1875 Public Health Act. [4 marks]`, type: 'written', marks: 4, ms: `Award up to 2 marks per feature. Features: compulsory clean water supply; compulsory sewage systems; local authorities had to appoint medical officers of health; made sanitation improvements mandatory; shift away from laissez-faire; built on the weaker 1848 Act.` },
    { q: `Explain why the government was slow to improve public health in the early 19th century. [12 marks]`, type: 'written', marks: 12, ms: `Key reasons: laissez-faire attitude (government should not interfere); cost — ratepayers did not want to pay; miasma theory meant people did not fully understand disease; vested interests (landlords, water companies); local not national responsibility; 1848 Act was optional not compulsory. Strong answers explain mechanism with evidence.` },
    { q: `How far was the Great Stink of 1858 a turning point in the history of public health? [16 marks]`, type: 'written', marks: 16, ms: `Was a turning point: Parliament directly affected so reform became urgent; led to Bazalgette\'s sewer system; reduced cholera outbreaks in London; showed engineering could solve public health. Not/other factors: Chadwick\'s 1842 report laid groundwork; Snow\'s 1854 pump handle removal proved waterborne spread; 1875 Act was arguably more significant nationally. Strong answers: balanced argument, specific evidence, clear judgement.` },
  ],

  // ── BIOLOGY — Cells & microscopy ─────────────────────────────────────────────
  // Sources: Jun22 Q2, Jun23 Q7, Jun24 B1 Q1

  tb_cells: [
    {
      q: `What is the function of the nucleus in a cell? Tick ONE box.\n\n[ ] To contain a solution called cell sap\n[ ] To control the activities of the whole cell\n[ ] To control the movement of substances into the cell`,
      type: 'mc', marks: 1,
      options: ['To contain a solution called cell sap', 'To control the activities of the whole cell', 'To control the movement of substances into the cell'],
      correct: 1,
      ms: `To control the activities of the whole cell. [1 mark]`
    },
    {
      q: `What is the function of the mitochondria in a cell? Tick ONE box.\n\n[ ] To produce glucose during photosynthesis\n[ ] To produce proteins for the cell\n[ ] To release energy in respiration`,
      type: 'mc', marks: 1,
      options: ['To produce glucose during photosynthesis', 'To produce proteins for the cell', 'To release energy in respiration'],
      correct: 2,
      ms: `To release energy in respiration. [1 mark]`
    },
    {
      q: `A palisade cell image measured 28 mm in length when viewed at a magnification of ×400. Calculate the real length of the palisade cell in mm. Then convert to micrometres (µm). 1 mm = 1000 µm. [3 marks]\n\nUse: real length = image length ÷ magnification`,
      type: 'written', marks: 3,
      ms: `Real length = 28 ÷ 400 = 0.07 mm [2 marks for correct working and answer]. Conversion: 0.07 × 1000 = 70 µm [1 mark]. Allow ecf from incorrect real length calculation.`
    },
    {
      q: `Give ONE advantage of using an electron microscope compared with a light microscope. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: greater magnification; higher resolving power; can see (smaller) subcellular structures/parts; can see more detail inside cells; reference to 3-D images.`
    },
    {
      q: `Give ONE way you can tell that an animal cell is NOT a plant cell. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: does not have a cell wall; does not have a (large) vacuole; does not have chloroplasts. Ignore chlorophyll.`
    },
    {
      q: `Which part of a cell controls the movement of substances into and out of the cell? Tick ONE box.\n\n[ ] Cell membrane\n[ ] Cytoplasm\n[ ] Nucleus`,
      type: 'mc', marks: 1,
      options: ['Cell membrane', 'Cytoplasm', 'Nucleus'],
      correct: 0,
      ms: `Cell membrane. [1 mark]`
    },
  ],

  // ── BIOLOGY — Digestion & enzymes ─────────────────────────────────────────────
  // Sources: Jun20 Q6, Jun22 Q1, Jun23 Q2, Jun24 B1 Q6

  tb_digest: [
    {
      q: `What type of enzyme is produced in the stomach? Tick ONE box.\n\n[ ] Carbohydrase\n[ ] Lipase\n[ ] Protease`,
      type: 'mc', marks: 1,
      options: ['Carbohydrase', 'Lipase', 'Protease'],
      correct: 2,
      ms: `Protease. [1 mark]`
    },
    {
      q: `Which term describes the pH in the stomach? And give ONE reason why the stomach is this pH. [2 marks]\n\n[ ] Acidic  [ ] Alkaline  [ ] Neutral`,
      type: 'written', marks: 2,
      ms: `Acidic [1 mark]. Reason: any one from — produces (hydrochloric) acid; optimum/best condition for protease/enzyme to act; to kill microorganisms/bacteria/pathogens. [1 mark]`
    },
    {
      q: `Which organ produces bile? Tick ONE box.\n\n[ ] Large intestine\n[ ] Liver\n[ ] Mouth\n[ ] Pancreas`,
      type: 'mc', marks: 1,
      options: ['Large intestine', 'Liver', 'Mouth', 'Pancreas'],
      correct: 1,
      ms: `Liver. [1 mark]`
    },
    {
      q: `How does bile help in the digestion of foods? Tick ONE box.\n\n[ ] It increases the surface area of fats\n[ ] It is an enzyme that digests protein\n[ ] It makes the pH in the small intestine acidic`,
      type: 'mc', marks: 1,
      options: ['It increases the surface area of fats', 'It is an enzyme that digests protein', 'It makes the pH in the small intestine acidic'],
      correct: 0,
      ms: `It increases the surface area of fats. [1 mark] — bile emulsifies fats, breaking them into smaller droplets to increase surface area for lipase to act on.`
    },
    {
      q: `What molecules are produced when starch is digested? Tick ONE box.\n\n[ ] Amino acids\n[ ] Fatty acids\n[ ] Sugars`,
      type: 'mc', marks: 1,
      options: ['Amino acids', 'Fatty acids', 'Sugars'],
      correct: 2,
      ms: `Sugars. [1 mark] — amylase breaks starch down into maltose/glucose (sugars).`
    },
    {
      q: `What is the name of the enzyme that digests starch? [1 mark]`,
      type: 'written', marks: 1,
      ms: `Amylase. Allow phonetic spelling. Allow carbohydrase. Do NOT accept amylose.`
    },
    {
      q: `Where are most food molecules absorbed? Tick ONE box.\n\n[ ] Large intestine\n[ ] Liver\n[ ] Small intestine\n[ ] Stomach`,
      type: 'mc', marks: 1,
      options: ['Large intestine', 'Liver', 'Small intestine', 'Stomach'],
      correct: 2,
      ms: `Small intestine. [1 mark]`
    },
    {
      fig: 'nov20_villi',
      q: `Explain how villi are adapted for efficient absorption of sugar molecules. [4 marks]`,
      type: 'written', marks: 4,
      ms: `Level 2 (3–4): points identified in detail and logically linked. Level 1 (1–2): points stated simply, no linking.\n\nIndicative content: have (many) microvilli to increase surface area; wall of villus only one cell thick/thin so short diffusion pathway; capillaries close to surface; good blood supply to transport food molecules away and maintain diffusion gradient; cells have many mitochondria providing energy for active transport of sugar molecules. For Level 2 must link structure to function.`
    },
    {
      q: `Describe how protein and fat are digested. Include the enzymes involved and where they are produced. [6 marks]`,
      type: 'written', marks: 6,
      ms: `Level 2 (4–6): accurate detail forming a clear account. Level 1 (1–3): facts stated simply.\n\nProtein: protease enzyme; broken down into amino acids; produced in the stomach; produced in the pancreas; produced in the small intestine; hydrochloric acid provides correct pH for protease in stomach.\n\nFat: lipase enzyme; broken down into fatty acids and glycerol; produced by the pancreas; produced by the small intestine; bile produced by the liver, released from gall bladder; bile emulsifies fats (increases surface area for lipase); bile neutralises acid to provide correct pH.\n\nFor Level 2 must describe digestion of BOTH fat and protein linked to correct enzyme type for both.`
    },
  ],

  // ── BIOLOGY — Transpiration & stomata ─────────────────────────────────────────
  // Sources: Jun20 Q3, Jun23 Q3, Jun24 B1 Q2

  tb_transp: [
    {
      q: `What is the loss of water from a leaf called? Tick ONE box.\n\n[ ] Osmosis\n[ ] Respiration\n[ ] Transpiration`,
      type: 'mc', marks: 1,
      options: ['Osmosis', 'Respiration', 'Transpiration'],
      correct: 2,
      ms: `Transpiration. [1 mark]`
    },
    {
      q: `Which cells control the size of stomata? Tick ONE box.\n\n[ ] Guard cells\n[ ] Phloem cells\n[ ] Xylem cells`,
      type: 'mc', marks: 1,
      options: ['Guard cells', 'Phloem cells', 'Xylem cells'],
      correct: 0,
      ms: `Guard cells. [1 mark]`
    },
    {
      fig: 'nov20_leaf_experiment',
      q: `A leaf grease experiment showed: Leaf B (upper surface covered) lost 0.13 g of mass; Leaf C (lower surface covered) lost 0.05 g. What evidence does this give about where most water is lost from? [1 mark]`,
      type: 'written', marks: 1,
      ms: `Leaf B (upper surface covered) lost more mass/water than Leaf C (lower surface covered), so more water is lost from the lower surface. Allow: "lower surface lost 0.13 g and upper surface lost 0.05 g" with conclusion.`
    },
    {
      q: `Based on the leaf grease experiment, what do the results show about the number of stomata on leaf surfaces? Tick ONE box.\n\n[ ] There are more stomata on the lower surface\n[ ] There are more stomata on the upper surface\n[ ] There are the same number of stomata on both surfaces`,
      type: 'mc', marks: 1,
      options: ['There are more stomata on the lower surface', 'There are more stomata on the upper surface', 'There are the same number of stomata on both surfaces'],
      correct: 0,
      ms: `There are more stomata on the lower surface. [1 mark] — because more water was lost when the lower surface was uncovered (Leaf B vs Leaf C).`
    },
    {
      q: `A leaf investigation was done at 20°C. How would the mass of water lost be different at 25°C? Give a reason for your answer. [2 marks]`,
      type: 'written', marks: 2,
      ms: `More (mass/water) lost [1 mark] because evaporation/transpiration would be faster at higher temperature [1 mark].`
    },
    {
      q: `A student investigated loss of mass from leaves in different wind speeds. Results: fan off = 0.06 g, low = 0.15 g, medium = 0.23 g, high = 0.31 g.\n\nHow does increasing fan speed affect the loss of mass from the leaves? Use the results. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Loss of mass increases (as fan speed increases). Allow: more mass/water is lost; mass of leaves decreases more.`
    },
    {
      q: `Explain why the mass of leaves decreased at all fan speeds (including with the fan off). [3 marks]`,
      type: 'written', marks: 3,
      ms: `Loss of water [1 mark] because water evaporated [1 mark] from stomata/stoma [1 mark]. Allow: by transpiration; by diffusion. Ignore: from guard cells.`
    },
    {
      q: `What rate of water loss from a plant losing 9.0 g over 5 hours? Tick ONE box.\n\n[ ] 0.9 grams/hour\n[ ] 1.8 grams/hour\n[ ] 9.0 grams/hour`,
      type: 'mc', marks: 1,
      options: ['0.9 grams/hour', '1.8 grams/hour', '9.0 grams/hour'],
      correct: 1,
      ms: `1.8 grams/hour. [1 mark] — 9.0 ÷ 5 = 1.8 g/hour.`
    },
  ],

  // ── BIOLOGY — Respiration ─────────────────────────────────────────────────────
  // Sources: Jun20 Q1, Jun23 Q5

  tb_resp: [
    {
      q: `What is the equation for aerobic respiration? Tick ONE box.\n\n[ ] carbon dioxide + water → glucose + oxygen\n[ ] glucose + oxygen → carbon dioxide + water\n[ ] oxygen + water → glucose + carbon dioxide`,
      type: 'mc', marks: 1,
      options: ['carbon dioxide + water → glucose + oxygen', 'glucose + oxygen → carbon dioxide + water', 'oxygen + water → glucose + carbon dioxide'],
      correct: 1,
      ms: `glucose + oxygen → carbon dioxide + water. [1 mark]`
    },
    {
      q: `Give two health benefits of regular exercise. Do NOT refer to losing body mass. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: strengthens muscles; strengthens heart muscle; reduces risk of coronary heart disease; reduces blood pressure; reduces risk of Type 2 diabetes; improves mental health/mood; improves mobility; improves stamina; reduces blood cholesterol; strengthens bones; boosts immunity. Ignore: references to losing weight; immediate effects of exercise (e.g. increases heart rate); "makes you healthier" unqualified.`
    },
    {
      q: `Give two changes that happen in the body during aerobic exercise. Do NOT refer to increased breathing rate. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: deeper/heavier breathing; increased heart rate; increased body temperature; increased sweating; increased blood flow to skin/muscles; blood flows faster. Do NOT accept: lactic acid is produced (that is anaerobic).`
    },
    {
      q: `Muscles respire anaerobically during vigorous exercise. Complete the sentences.\n\nMuscles respire anaerobically if they do not have enough _______.\n\nAnaerobic respiration of glucose produces _______. [2 marks]`,
      type: 'written', marks: 2,
      ms: `First blank: oxygen (allow O₂). Second blank: lactic acid. [1 mark each] Word takes precedence over symbol.`
    },
    {
      q: `Explain the differences in the air breathed into the lungs and the air breathed out. (Oxygen in: 21%, out: 16%; Carbon dioxide in: 0.04%, out: 4%; Nitrogen: 78% both.) [4 marks]`,
      type: 'written', marks: 4,
      ms: `Level 2 (3–4): relevant points with logical linking. Level 1 (1–2): points stated simply, no linking.\n\nIndicative content: less oxygen in exhaled air because body has used some for respiration; more carbon dioxide in exhaled air because carbon dioxide is produced in respiration; no difference in nitrogen because nitrogen is not used by the body; more water vapour in air breathed out because water is produced in respiration; exhaled air is warmer because energy is transferred during respiration.\n\nFor Level 2: explanation(s) AND differences must be given.`
    },
    {
      q: `Give two ways the lungs are adapted for efficient gas exchange. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: many alveoli; large surface area; short diffusion distance; wall of alveolus only one cell thick/thin; wall of blood capillaries only one cell thick; good blood supply; well ventilated. Allow: short distance for gas to travel. Ignore: moist.`
    },
  ],

  // ── BIOLOGY — Blood & circulatory system ──────────────────────────────────────
  // Sources: Jun23 Q4, Jun24 B1 Q3

  tb_blood: [
    {
      q: `Which chamber of the heart pumps blood to the body? Tick ONE box.\n\n[ ] Left atrium\n[ ] Left ventricle\n[ ] Right atrium\n[ ] Right ventricle`,
      type: 'mc', marks: 1,
      options: ['Left atrium', 'Left ventricle', 'Right atrium', 'Right ventricle'],
      correct: 1,
      ms: `Left ventricle. [1 mark]`
    },
    {
      q: `What is the name of the blood vessel that carries blood to the heart muscle? Tick ONE box.\n\n[ ] Aorta\n[ ] Coronary artery\n[ ] Pulmonary artery`,
      type: 'mc', marks: 1,
      options: ['Aorta', 'Coronary artery', 'Pulmonary artery'],
      correct: 1,
      ms: `Coronary artery. [1 mark]`
    },
    {
      q: `Which type of blood vessel has valves? Tick ONE box.\n\n[ ] Artery\n[ ] Capillary\n[ ] Vein`,
      type: 'mc', marks: 1,
      options: ['Artery', 'Capillary', 'Vein'],
      correct: 2,
      ms: `Vein. [1 mark]`
    },
    {
      q: `What is the function of valves in the heart and veins? [1 mark]`,
      type: 'written', marks: 1,
      ms: `To stop blood flowing in the wrong direction. Allow: to stop blood flowing backwards; to stop backflow of blood; to keep blood flowing in the correct direction.`
    },
    {
      q: `Explain ONE way a capillary is adapted for its function. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Walls that are one cell thick [1 mark] so there is a short diffusion distance / substances can move quickly between blood and cells [1 mark]. OR large surface area to volume ratio [1 mark] for exchange of substances [1 mark]. Allow: thin walls / very narrow (so) close to cells.`
    },
    {
      q: `Explain why having more red blood cells will improve an athlete\'s performance. [3 marks]`,
      type: 'written', marks: 3,
      ms: `More oxygen can be transported/carried [1 mark]. Oxygen is needed for aerobic respiration [1 mark]. So more energy can be transferred/released (for muscle contraction) [1 mark]. Allow: so less anaerobic respiration. Do NOT accept: energy is made/produced/created.`
    },
    {
      q: `Which part of the blood causes blood to clot? Tick ONE box.\n\n[ ] Plasma\n[ ] Platelets\n[ ] Red blood cells`,
      type: 'mc', marks: 1,
      options: ['Plasma', 'Platelets', 'Red blood cells'],
      correct: 1,
      ms: `Platelets. [1 mark]`
    },
    {
      q: `A heart attack happens when plaques block a coronary artery. Explain how the blockage can lead to the death of muscle cells in the heart. [3 marks]`,
      type: 'written', marks: 3,
      ms: `Less/no blood flow [1 mark] so less/no oxygen to heart muscle/cells [1 mark] so less/no respiration (so less energy available) [1 mark]. Ignore reference to lactic acid.`
    },
  ],

  // ── BIOLOGY — Disease, immunity & drugs ───────────────────────────────────────
  // Sources: Jun20 Q2 & Q4, Jun22 Q3 & Q5, Jun23 Q6, Jun24 B1 Q4

  tb_immune: [
    {
      q: `Give two ways that the body prevents pathogens entering the body. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: skin (acts as a barrier); mucus in trachea/bronchi/nose; cilia in respiratory tract; hydrochloric acid in stomach; scab forms over wounds; tears. Allow: mucus in airways. Ignore: references to hairs; immune response.`
    },
    {
      q: `Describe how the immune system defends the body against disease. [6 marks]`,
      type: 'written', marks: 6,
      ms: `Level 2 (4–6): scientifically accurate detail with clear logical linking. Level 1 (1–3): facts listed without linking.\n\nIndicative content: white blood cells detect/identify foreign antigens; phagocytes engulf and digest/kill invading cells; lymphocytes produce antibodies which attach to and destroy/agglutinate pathogens; produce antitoxins to destroy toxins; produce memory cells so immune response to later exposure is faster.\n\nFor Level 2: must describe HOW white blood cells act, not just name them.`
    },
    {
      q: `Give ONE reason why antibiotics cannot be used to treat HIV infections. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: HIV is a virus; antibiotics do not kill viruses; antibiotics are used to kill bacteria. Allow: HIV is not a bacterium.`
    },
    {
      q: `Give two ways to prevent the spread of HIV. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: avoid sexual intercourse; use a condom; do not share needles; use antiretroviral drugs; screen blood for transfusions; have regular tests. Ignore: handwashing; social distancing; "use protection" unqualified.`
    },
    {
      q: `What type of pathogen causes rose black spot disease? Tick ONE box.\n\n[ ] Bacterium\n[ ] Fungus\n[ ] Protist\n[ ] Virus`,
      type: 'mc', marks: 1,
      options: ['Bacterium', 'Fungus', 'Protist', 'Virus'],
      correct: 1,
      ms: `Fungus. [1 mark]`
    },
    {
      q: `How is the malaria pathogen transferred to humans? [1 mark]`,
      type: 'written', marks: 1,
      ms: `By the bite of a mosquito/insect vector. Allow: through a mosquito bite.`
    },
    {
      q: `What is the name of the first antibiotic developed? [1 mark]`,
      type: 'written', marks: 1,
      ms: `Penicillin. [1 mark]`
    },
    {
      q: `Suggest why doctors do not give antibiotics to patients with minor infections. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: to prevent/reduce antibiotic resistance; overuse of antibiotics leads to resistant strains; minor infections are often caused by viruses (which antibiotics cannot treat); the immune system can deal with minor infections on its own.`
    },
    {
      q: `During Phase 1 clinical trials, a drug is tested on healthy volunteers using low doses. What is the main purpose of Phase 1 testing? Tick ONE box.\n\n[ ] To find the best dose to use\n[ ] To see if the drug is safe to use\n[ ] To see if the drug works`,
      type: 'mc', marks: 1,
      options: ['To find the best dose to use', 'To see if the drug is safe to use', 'To see if the drug works'],
      correct: 1,
      ms: `To see if the drug is safe to use. [1 mark]`
    },
    {
      q: `What is a placebo? [1 mark]`,
      type: 'written', marks: 1,
      ms: `A tablet/treatment that does not contain the drug/active ingredient. Allow: a sugar pill; a fake drug.`
    },
    {
      q: `Who knows which patients are given the placebo and which are given the drug in a double blind trial? Tick ONE box.\n\n[ ] Not the patients or the doctors\n[ ] The patients and the doctors\n[ ] The patients but not the doctors`,
      type: 'mc', marks: 1,
      options: ['Not the patients or the doctors', 'The patients and the doctors', 'The patients but not the doctors'],
      correct: 0,
      ms: `Not the patients or the doctors. [1 mark]`
    },
  ],

  // ── BIOLOGY — Osmosis & water movement ───────────────────────────────────────
  // Sources: Jun20 Q5, Jun24 B1 Q7

  tb_osmosis: [
    {
      q: `What is the independent variable in a potato osmosis investigation? Tick ONE box.\n\n[ ] Change in mass of the pieces of potato\n[ ] Concentration of the sugar solution\n[ ] Length of time the pieces of potato are in the solution\n[ ] Starting mass of the pieces of potato`,
      type: 'mc', marks: 1,
      options: ['Change in mass of the pieces of potato', 'Concentration of the sugar solution', 'Length of time the pieces of potato are in the solution', 'Starting mass of the pieces of potato'],
      correct: 1,
      ms: `Concentration of the sugar solution. [1 mark]`
    },
    {
      q: `A potato piece in 0.0 mol/dm³ sugar solution increased in mass. Explain why. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Gained water [1 mark] by osmosis [1 mark] because the concentration of water outside the potato is greater than inside the cells (allow: concentration of sugar solution inside the potato is greater than outside). Allow converse statements.`
    },
    {
      q: `A potato piece started at 7.96 g and ended at 8.21 g after being in 0.2 mol/dm³ sugar solution. Calculate the percentage change in mass to 3 significant figures.\n\nUse: percentage change = (change in mass ÷ mass at start) × 100 [3 marks]`,
      type: 'written', marks: 3,
      ms: `Change in mass = 8.21 − 7.96 = 0.25 g [1 mark]. Percentage change = (0.25 ÷ 7.96) × 100 [1 mark]. = 3.14% (to 3 significant figures) [1 mark]. Allow ecf from incorrect working.`
    },
    {
      fig: 'jun24_osmosis_tube',
      q: `In an osmosis investigation using sealed tubing in salt solutions, a student dried the outside of each tube before recording mass. Why was it important to dry the tubes? [1 mark]`,
      type: 'written', marks: 1,
      ms: `Water/solution on the tube would affect/increase the mass (making results invalid). Allow: the results would not be valid.`
    },
    {
      q: `In a sealed-tube osmosis experiment, the concentration of salt solution where the tube does not change mass is approximately 0.64–0.66 mol/dm³. What does this tell us? [1 mark]`,
      type: 'written', marks: 1,
      ms: `The concentration of solution Z (inside the tubes) is approximately 0.64–0.66 mol/dm³ — because at this concentration the solution inside equals the solution outside, so no net movement of water by osmosis.`
    },
    {
      q: `Calculate the percentage change in mass for a tube that started at 15.54 g and ended at 16.50 g after being in 0.0 mol/dm³ salt solution. Give your answer to 1 decimal place. [3 marks]\n\nUse: percentage change = (change in mass ÷ mass at start) × 100`,
      type: 'written', marks: 3,
      ms: `Change in mass = 16.50 − 15.54 = 0.96 g [1 mark]. Percentage change = (0.96 ÷ 15.54) × 100 [1 mark]. = 6.2% (to 1 decimal place) [1 mark]. Allow ecf from incorrect calculation.`
    },
  ],

  // ── BIOLOGY — Photosynthesis ───────────────────────────────────────────────────
  // Sources: Jun22 Q2, Jun24 B1 Q5

  tb_photo: [
    {
      q: `Complete the equation for photosynthesis. Choose from: nitrogen, oxygen, ethanol, water.\n\ncarbon dioxide + _______ → glucose + _______ [2 marks]`,
      type: 'written', marks: 2,
      ms: `First blank: water [1 mark]. Second blank: oxygen [1 mark]. Allow H₂O and O₂.`
    },
    {
      q: `What is the chemical formula for glucose? Tick ONE box.\n\n[ ] CO₂\n[ ] C₆H₁₂O₆\n[ ] H₂O\n[ ] O₂`,
      type: 'mc', marks: 1,
      options: ['CO₂', 'C₆H₁₂O₆', 'H₂O', 'O₂'],
      correct: 1,
      ms: `C₆H₁₂O₆. [1 mark]`
    },
    {
      q: `Give two ways plants use the glucose produced by photosynthesis. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: respiration (for energy); to convert to starch (store); to produce fat/oil (store); to produce cellulose (cell walls); to produce amino acids/protein. Allow: energy source. Do NOT accept: energy produced/made/created; used for growth (too vague). Ignore: used for growth of the plant.`
    },
    {
      q: `Give ONE way that the palisade layer of a leaf is adapted for photosynthesis. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: contains many chloroplasts/chlorophyll to absorb light; cells are long and packed tightly to maximise light absorption; positioned near the top of the leaf to receive most light; large surface area for CO₂ absorption.`
    },
    {
      q: `A student investigated the effect of different colours of light on the rate of photosynthesis. Results: blue = 9 arbitrary units, green = 1, red = 8. What colour of light should be used to grow plants in a greenhouse? Tick ONE box.\n\n[ ] Blue  [ ] Green  [ ] Red`,
      type: 'mc', marks: 1,
      options: ['Blue', 'Green', 'Red'],
      correct: 0,
      ms: `Blue. [1 mark] — blue light gave the highest rate of photosynthesis (9 arbitrary units) so would produce the most growth.`
    },
    {
      fig: 'jun24_greenhouses',
      q: `Greenhouse B has a wood burner burning logs, while Greenhouse A does not. Both greenhouses have the same light intensity, water volume, and soil. Explain why plants in Greenhouse B grow faster. [4 marks]`,
      type: 'written', marks: 4,
      ms: `Higher/increased temperature [1 mark] OR more carbon dioxide (combustion/burning releases CO₂) [1 mark]. So more photosynthesis/faster photosynthesis [1 mark]. So more glucose/sugar made [1 mark]. So more protein/cellulose made [1 mark]. Award max 4 marks.`
    },
  ],

  // ── BIOLOGY — Cell division & growth ──────────────────────────────────────────
  // Sources: Jun22 Q6

  tb_cells_div: [
    {
      q: `Write these biological structures in correct order of size. Smallest to largest: cell, chromosome, gene, nucleus. [1 mark]`,
      type: 'written', marks: 1,
      ms: `gene → chromosome → nucleus → cell. Must be in this order for the mark.`
    },
    {
      q: `In humans a fertilised egg cell contains 23 pairs of chromosomes. How many chromosomes will there be in each of the embryo cells? [1 mark]`,
      type: 'written', marks: 1,
      ms: `46. Allow: 23 pairs (of chromosomes).`
    },
    {
      q: `How many cell divisions are needed to form a 16-cell embryo from the original fertilised egg cell? [1 mark]`,
      type: 'written', marks: 1,
      ms: `4 cell divisions. Allow 15 (if student has counted total cells including the original). The sequence is 1→2→4→8→16, which is 4 divisions.`
    },
    {
      q: `Give ONE way that cell division by mitosis is important in fully grown animals. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Repair of tissues / replacement of cells. Allow: repair of organs; replacement of tissues. Ignore: growth; repair of cells; replacement of organs.`
    },
  ],

}


const MARK_TIPS = {
  1:  { label: '1-mark question', tip: 'One clear, accurate point. No development needed. Be specific — vague answers score zero.' },
  2:  { label: '2-mark question', tip: 'Two separate, accurate points. If asked to "explain", you need the point AND the reason. If asked to "give two", each point must be distinct.' },
  3:  { label: '3-mark question', tip: 'Show your working clearly. Each step can earn a mark. Even if you get the final answer wrong, correct working gets credit.' },
  4:  { label: '4-mark question', tip: 'Two developed points, each with supporting detail. OR four separate points if listing. For "explain" questions: point → reason → link back.' },
  6:  { label: '6-mark question', tip: 'Level of response: Level 2 (4–6 marks) needs scientifically accurate detail with clear logical linking. Level 1 (1–3 marks) is just listing facts. Name the process, explain how it works, link to the function.' },
  12: { label: '12-mark question', tip: 'Three or four developed paragraphs. Each needs a clear point, specific evidence, and explanation of how it answers the question.' },
  16: { label: '16-mark question', tip: 'Argue both sides then reach a clear judgement. Specific evidence required. Avoid vague generalisations.' },
}

// ─── Formula sheet modal ──────────────────────────────────────────────────────
function FormulaSheet({ onClose }) {
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#0E1330', border:'1px solid rgba(59,130,255,.3)', borderRadius:'20px 20px 0 0', padding:'20px 18px 40px', width:'100%', maxWidth:660, maxHeight:'82vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1.1rem', color:'#F5F7FB' }}>📐 AQA Formula Sheet</div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.75rem', color:'#5A6480', marginTop:2 }}>These are given in the exam — but worth knowing them cold</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.08)', border:'1px solid #2A3552', borderRadius:8, padding:'6px 14px', color:'#9CA8C7', cursor:'pointer', fontFamily:'inherit', fontSize:'.82rem' }}>✕</button>
        </div>
        {FORMULA_SHEET.map(cat => (
          <div key={cat.section} style={{ marginBottom:18 }}>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#3B82FF', marginBottom:10 }}>{cat.section}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {cat.formulae.map(item => (
                <div key={item.name} style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:12, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.82rem', color:'#9CA8C7' }}>{item.name}</div>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F5F7FB', flexShrink:0 }}>{item.f}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Inline diagram renderer ──────────────────────────────────────────────────
function MathsDiagram({ diagramKey }) {
  const svg = DIAGRAMS[diagramKey]
  if (!svg) return null
  return (
    <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:12, padding:'14px', marginBottom:14 }}>
      <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#3B82FF', marginBottom:8 }}>📐 Diagram — from AQA past paper</div>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}

// ─── Grade colours ────────────────────────────────────────────────────────────
const GRADE_COLOURS = {
  'Excellent':  { bg:'rgba(77,255,136,.08)', border:'rgba(77,255,136,.35)', text:'#4DFF88', badge:'#38D27A' },
  'Good':       { bg:'rgba(77,255,136,.05)', border:'rgba(77,255,136,.2)',  text:'#6BFFB0', badge:'#38D27A' },
  'Developing': { bg:'rgba(255,200,87,.08)', border:'rgba(255,200,87,.3)',  text:'#FFC857', badge:'#F5B700' },
  'Needs Work': { bg:'rgba(255,93,115,.08)', border:'rgba(255,93,115,.3)',  text:'#FF5D73', badge:'#FF5D73' },
}

// ─── API grading call ─────────────────────────────────────────────────────────
async function gradeWithAI(question, answer, marks, markScheme) {
  const res = await fetch('/api/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      answer: answer.trim(),
      marks,
      markScheme,
    }),
  })
  if (!res.ok) throw new Error(`Server error ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data
}

// ─── Strip bracketed MC options from question text ────────────────────────────
// MC questions store options in q.options[] but some also embed them as
// "[ ] Option text" lines in q.q — this removes those duplicate lines.
function cleanQuestionText(q) {
  if (!q.q) return q.q
  const isMC = q.type === 'mc' || q.type === 'mc_multi'
  return q.q
    .split('\n')
    .filter(line => {
      const t = line.trim()
      if (!isMC) return true
      // Strip embedded MC option lines: [ ] ... or [x] ...
      if (/^\[.{0,2}\]/.test(t)) return false
      // Strip lettered option lines: A. / B. / A) etc
      if (/^[A-D][.)]\s/.test(t)) return false
      // Strip instruction lines that are redundant with button UI
      if (/^tick one box/i.test(t)) return false
      if (/^circle the (answer|correct)/i.test(t)) return false
      return true
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}


// ─── Single question view ─────────────────────────────────────────────────────
function MathsQuestion({ q, qIdx, total, topicLabel, topicColor, isCalc, onBack, onNext }) {
  const [answer, setAnswer]   = useState('')
  const [showTip, setTip]     = useState(false)
  const [grading, setGrading] = useState(false)
  const [feedback, setFB]     = useState(null)
  const [error, setError]     = useState(null)
  const [fmOpen, setFm]       = useState(false)

  function reset() { setAnswer(''); setTip(false); setFB(null); setError(null); setGrading(false) }

  async function grade() {
    if (q.type === 'mc' && !answer) { setError('Pick an option first.'); return }
    if (q.type !== 'mc' && answer.trim().length < 1) { setError('Write something — even a rough attempt gets method marks!'); return }
    setGrading(true); setError(null)
    try {
      const result = await gradeWithAI(q.q, answer, q.marks, q.ms)
      setFB(result)
    } catch (e) {
      setError('Could not reach the grading server. Check your connection and try again.')
    } finally {
      setGrading(false)
    }
  }

  const gs = feedback ? (GRADE_COLOURS[feedback.grade] || GRADE_COLOURS['Developing']) : null
  const MARK_TIPS = {
    1: 'One specific correct point. No working needed.',
    2: 'Two separate points, OR method + correct answer.',
    3: 'Show every step — each line of working can earn a mark.',
    4: 'Full method with all steps. Check your arithmetic at the end.',
    5: 'Five marks means five things to show — method + sub-steps + answer.',
  }

  return (
    <div style={{ background:'#080C1A', minHeight:'100vh', paddingBottom:90 }}>
      {fmOpen && <FormulaSheet onClose={() => setFm(false)} />}

      {/* Sticky header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'12px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <button onClick={() => { reset(); onBack() }} style={{ background:'none', border:'none', cursor:'pointer', color:'#5A6480', fontSize:'1.1rem', padding:0, flexShrink:0, lineHeight:1 }}>←</button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:topicColor, flexShrink:0, boxShadow:`0 0 6px ${topicColor}` }} />
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:topicColor }}>{topicLabel}</span>
              </div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.9rem', color:'#F5F7FB' }}>
                Q{q.qNum} · {q.source}
              </div>
            </div>
            <div style={{ display:'flex', gap:6, flexShrink:0 }}>
              {isCalc
                ? <div style={{ background:'rgba(56,210,122,.1)', border:'1px solid rgba(56,210,122,.25)', borderRadius:8, padding:'4px 9px', fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, color:'#38D27A' }}>🖩 Calc</div>
                : <div style={{ background:'rgba(255,200,87,.08)', border:'1px solid rgba(255,200,87,.2)', borderRadius:8, padding:'4px 9px', fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, color:'#FFC857' }}>✗ No Calc</div>
              }
              <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:8, padding:'4px 10px', fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, color:'#70B8FF', cursor:'pointer' }}>📐 Formulae</button>
            </div>
          </div>
          {/* Progress */}
          <div style={{ height:3, background:'#1E2A40', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${((qIdx+1)/total)*100}%`, background:`linear-gradient(90deg,${topicColor}88,${topicColor})`, borderRadius:99, transition:'width .4s ease' }} />
          </div>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.62rem', color:'#4A5578', marginTop:5, textAlign:'right' }}>{qIdx+1} / {total}</div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px 20px' }}>
        {/* Marks badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:`${topicColor}18`, border:`1px solid ${topicColor}44`, borderRadius:99, padding:'4px 13px', marginBottom:14 }}>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'.78rem', fontWeight:700, color:topicColor }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
        </div>

        {/* Diagram */}
        {q.diagramKey && <MathsDiagram diagramKey={q.diagramKey} />}

        {/* Question */}
        <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:16, padding:'18px 18px', marginBottom:14 }}>
          <pre style={{ fontFamily:"'Inter',sans-serif", fontSize:'1rem', lineHeight:1.7, margin:0, color:'#E0E6F0', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
        </div>

        {/* Mark tip */}
        {!showTip
          ? <button onClick={() => setTip(true)} style={{ background:'transparent', border:'1px dashed #2A3552', borderRadius:10, padding:'9px 14px', cursor:'pointer', color:'#4A5578', fontSize:'.82rem', fontFamily:"'Inter',sans-serif", width:'100%', marginBottom:14 }}>💡 How many things do I need to write?</button>
          : <div style={{ background:'rgba(255,200,87,.05)', border:'1px solid rgba(255,200,87,.18)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FFC857', marginBottom:5 }}>{q.marks}-mark question</div>
              <p style={{ fontFamily:"'Inter',sans-serif", margin:0, fontSize:'.86rem', color:'#C8D0E8', lineHeight:1.55 }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
            </div>
        }

        {/* Answer area — only shown before feedback */}
        {!feedback && (
          q.type === 'mc'
            ? <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswer(opt)} style={{ background:answer===opt?`${topicColor}18`:'#10182B', border:`1.5px solid ${answer===opt?topicColor:'#1E2A40'}`, borderRadius:12, padding:'14px 16px', cursor:'pointer', textAlign:'left', fontFamily:"'Inter',sans-serif", fontSize:'.93rem', color:answer===opt?topicColor:'#C8D0E8', transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ width:24, height:24, borderRadius:'50%', border:`1.5px solid ${answer===opt?topicColor:'#2A3552'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.72rem', fontWeight:700, color:answer===opt?topicColor:'#4A5578', background:answer===opt?`${topicColor}18`:'transparent' }}>{String.fromCharCode(65+i)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            : <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:14, padding:'14px', marginBottom:16 }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4A5578', marginBottom:8 }}>Your working & answer</div>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder={q.marks >= 3 ? 'Show all your working here…' : 'Write your answer…'}
                  style={{ width:'100%', border:'none', background:'transparent', resize:'none', fontFamily:"'Inter',sans-serif", fontSize:'.95rem', color:'#E0E6F0', lineHeight:1.7, outline:'none', minHeight: q.marks >= 4 ? 170 : q.marks >= 2 ? 110 : 65 }}
                />
              </div>
        )}

        {/* Error */}
        {error && <div style={{ background:'rgba(255,93,115,.08)', border:'1px solid rgba(255,93,115,.3)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}><p style={{ fontFamily:"'Inter',sans-serif", margin:0, fontSize:'.86rem', color:'#FF5D73', lineHeight:1.5 }}>{error}</p></div>}

        {/* Feedback */}
        {feedback && gs && (
          <div className="fade-up">
            {/* Score card */}
            <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:18, padding:'20px', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'2rem', fontWeight:800, color:gs.text, lineHeight:1 }}>
                  {feedback.marksAwarded}<span style={{ fontSize:'1.1rem', opacity:.5 }}>/{feedback.marksAvailable}</span>
                </div>
                <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.8rem' }}>{feedback.grade}</div>
              </div>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'.9rem', color:gs.text, margin:0, lineHeight:1.55, opacity:.9 }}>{feedback.summary}</p>
            </div>

            {/* What they got right */}
            {feedback.achieved?.length > 0 && (
              <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4DFF88', marginBottom:10 }}>✓ What you got right</div>
                {feedback.achieved.map((a,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.achieved.length-1?8:0 }}>
                    <span style={{ color:'#4DFF88', flexShrink:0, fontSize:'.9rem' }}>✓</span>
                    <p style={{ margin:0, fontFamily:"'Inter',sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* What they missed */}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && (
              <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FF5D73', marginBottom:10 }}>→ Next time, also include</div>
                {feedback.missed.map((m,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.missed.length-1?8:0 }}>
                    <span style={{ color:'#FF5D73', flexShrink:0, fontSize:'.9rem' }}>→</span>
                    <p style={{ margin:0, fontFamily:"'Inter',sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{m}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Examiner tip */}
            {feedback.examinerTip && (
              <div style={{ background:'rgba(245,183,0,.05)', border:'1px solid rgba(245,183,0,.18)', borderRadius:13, padding:'14px', marginBottom:16 }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:6 }}>🗡️ Examiner tip</div>
                <p style={{ margin:0, fontFamily:"'Inter',sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{feedback.examinerTip}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <button onClick={reset} style={{ background:'#10182B', border:'1px solid #2A3552', borderRadius:13, padding:'14px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, cursor:'pointer', color:'#9CA8C7', fontSize:'.88rem' }}>↩ Try again</button>
              <button onClick={onNext} style={{ background:`linear-gradient(135deg,${topicColor}cc,${topicColor})`, border:'none', borderRadius:13, padding:'14px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, cursor:'pointer', color:'#fff', fontSize:'.88rem', boxShadow:`0 4px 16px ${topicColor}44` }}>
                {qIdx < total-1 ? 'Next →' : 'Finish ✓'}
              </button>
            </div>
          </div>
        )}

        {/* Submit button */}
        {!feedback && (
          <button onClick={grade} disabled={grading} style={{ width:'100%', background:grading?'#1E2A40':`linear-gradient(135deg,${topicColor}cc,${topicColor})`, color:grading?'#4A5578':'#fff', border:'none', borderRadius:13, padding:'16px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, cursor:grading?'default':'pointer', fontSize:'1rem', letterSpacing:'.01em', marginTop:4, boxShadow:grading?'none':`0 4px 20px ${topicColor}44`, transition:'all .2s' }}>
            {grading ? '⏳ Marking your answer…' : 'Check my answer →'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Topic question list ──────────────────────────────────────────────────────
function MathsTopicView({ group, onBack }) {
  const [qIdx, setQIdx]   = useState(null)   // null = list, number = in question
  const qs = group.questions

  if (qIdx !== null) {
    return (
      <MathsQuestion
        q={qs[qIdx]} qIdx={qIdx} total={qs.length}
        topicLabel={group.label} topicColor={group.color} isCalc={group.calculator}
        onBack={() => setQIdx(null)}
        onNext={() => { if (qIdx < qs.length-1) setQIdx(qIdx+1); else setQIdx(null) }}
      />
    )
  }

  return (
    <div style={{ background:'#080C1A', minHeight:'100vh', paddingBottom:90 }}>
      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'14px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#5A6480', fontSize:'1.1rem', padding:0, flexShrink:0 }}>←</button>
          <div style={{ width:32, height:32, borderRadius:10, background:group.bg, border:`1px solid ${group.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem', flexShrink:0 }}>{group.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1rem', color:'#F5F7FB' }}>{group.label}</div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem', color:'#5A6480' }}>{qs.length} question{qs.length!==1?'s':''} · {group.calculator?'Calculator allowed':'Non-calculator'}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Topic description */}
        <div style={{ background:'#10182B', border:`1px solid ${group.border}`, borderRadius:14, padding:'14px 16px', marginBottom:20 }}>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.85rem', color:'#C8D0E8', lineHeight:1.6 }}>{group.description}</div>
          {group.calculator
            ? <div style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:5, background:'rgba(56,210,122,.08)', border:'1px solid rgba(56,210,122,.2)', borderRadius:8, padding:'4px 10px', fontFamily:"'Inter',sans-serif", fontSize:'.7rem', fontWeight:600, color:'#38D27A' }}>🖩 Calculator allowed for this topic</div>
            : <div style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:5, background:'rgba(255,200,87,.07)', border:'1px solid rgba(255,200,87,.2)', borderRadius:8, padding:'4px 10px', fontFamily:"'Inter',sans-serif", fontSize:'.7rem', fontWeight:600, color:'#FFC857' }}>✗ No calculator — show all working</div>
          }
        </div>

        {/* Start all button */}
        <button onClick={() => setQIdx(0)} style={{ width:'100%', background:`linear-gradient(135deg,${group.color}cc,${group.color})`, color:'#fff', border:'none', borderRadius:14, padding:'15px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, cursor:'pointer', fontSize:'.97rem', marginBottom:16, boxShadow:`0 4px 20px ${group.color}44`, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          Start all {qs.length} questions →
        </button>

        {/* Individual question list */}
        <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:16, overflow:'hidden' }}>
          {qs.map((q,i) => (
            <button key={q.id} onClick={() => setQIdx(i)} style={{ width:'100%', background:'transparent', border:'none', borderBottom:i<qs.length-1?'1px solid #161F30':'none', padding:'14px 16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:12, transition:'background .15s' }}>
              {/* Question number badge */}
              <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:group.bg, border:`1px solid ${group.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.72rem', color:group.color }}>Q{q.qNum}</div>
              <div style={{ flex:1, minWidth:0 }}>
                {/* First line of question */}
                <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:'.9rem', color:'#E0E6F0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {q.q.split('\n')[0].substring(0,58)}{q.q.split('\n')[0].length>58?'…':''}
                </div>
                <div style={{ display:'flex', gap:6, marginTop:4, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.68rem', color:'#4A5578' }}>{q.source}</span>
                  <span style={{ color:'#2A3552' }}>·</span>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.68rem', color:group.color, fontWeight:600 }}>{q.marks} mark{q.marks!==1?'s':''}</span>
                  {q.diagramKey && <><span style={{ color:'#2A3552' }}>·</span><span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.68rem', color:'#3B82FF' }}>📐 diagram</span></>}
                  {q.type === 'mc' && <><span style={{ color:'#2A3552' }}>·</span><span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.68rem', color:'#9D5CFF' }}>multiple choice</span></>}
                </div>
              </div>
              <span style={{ color:'#2A3552', fontSize:'1rem', flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Maths topic browser ──────────────────────────────────────────────────────
function MathsBrowser({ onBack }) {
  const [activeGroup, setGroup] = useState(null)
  const [fmOpen, setFm]         = useState(false)
  const [filter, setFilter]     = useState('all')   // 'all' | 'calc' | 'noncalc'

  if (activeGroup) return <MathsTopicView group={activeGroup} onBack={() => setGroup(null)} />

  const totalQs = MATHS_TOPIC_GROUPS.reduce((s,g) => s + g.questions.length, 0)
  const filtered = filter === 'all' ? MATHS_TOPIC_GROUPS
    : filter === 'calc' ? MATHS_TOPIC_GROUPS.filter(g => g.calculator)
    : MATHS_TOPIC_GROUPS.filter(g => !g.calculator)

  return (
    <div style={{ background:'#080C1A', minHeight:'100vh', paddingBottom:90 }}>
      {fmOpen && <FormulaSheet onClose={() => setFm(false)} />}

      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'14px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#5A6480', fontSize:'1.1rem', padding:0, flexShrink:0 }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1rem', color:'#F5F7FB' }}>AQA Maths — Topics</div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem', color:'#5A6480' }}>{MATHS_TOPIC_GROUPS.length} topics · {totalQs} questions · AI marked</div>
          </div>
          <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:10, padding:'7px 12px', fontFamily:"'Inter',sans-serif", fontSize:'.73rem', fontWeight:700, color:'#70B8FF', cursor:'pointer', flexShrink:0 }}>📐 Formulae</button>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {[
            { id:'all',      label:`All (${totalQs})` },
            { id:'noncalc',  label:'✗ No Calculator' },
            { id:'calc',     label:'🖩 Calculator' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(59,130,255,.15)':'#10182B', border:`1px solid ${filter===f.id?'#3B82FF':'#1E2A40'}`, borderRadius:10, padding:'9px 6px', fontFamily:"'Inter',sans-serif", fontSize:'.75rem', fontWeight:600, color:filter===f.id?'#70B8FF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

        {/* Topic grid */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background:'#10182B', border:`1px solid #1E2A40`, borderRadius:16, padding:'16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, transition:'border-color .15s, transform .12s', width:'100%' }}>
              {/* Icon */}
              <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, background:group.bg, border:`1px solid ${group.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1rem', color:group.color }}>
                {group.icon}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  {/* Mini progress-style pill */}
                  <div style={{ flex:1, height:3, background:'#1E2A40', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:'0%', background:group.color, borderRadius:99 }} />
                  </div>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.68rem', fontWeight:600, color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  {group.calculator
                    ? <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', color:'#38D27A', flexShrink:0 }}>🖩</span>
                    : <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', color:'#FFC857', flexShrink:0 }}>✗</span>
                  }
                </div>
              </div>

              <span style={{ color:'#2A3552', fontSize:'1.1rem', flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── English topic view ───────────────────────────────────────────────────────
function EnglishTopicView({ group, onBack }) {
  const [qIdx, setQIdx] = useState(null)
  const qs = group.questions

  if (qIdx !== null) {
    return (
      <MathsQuestion
        q={{...qs[qIdx], ms: qs[qIdx].ms}}
        qIdx={qIdx} total={qs.length}
        topicLabel={group.label} topicColor={group.color} isCalc={false}
        onBack={() => setQIdx(null)}
        onNext={() => { if (qIdx < qs.length-1) setQIdx(qIdx+1); else setQIdx(null) }}
      />
    )
  }

  return (
    <div style={{ background:'#080C1A', minHeight:'100vh', paddingBottom:90 }}>
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'14px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#5A6480', fontSize:'1.1rem', padding:0, flexShrink:0 }}>←</button>
          <div style={{ width:32, height:32, borderRadius:10, background:group.bg, border:`1px solid ${group.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem', flexShrink:0 }}>{group.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F5F7FB', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{group.label}</div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem', color:'#5A6480' }}>{group.paper} · {qs.length} question{qs.length!==1?'s':''}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Description + skill tip */}
        <div style={{ background:'#10182B', border:`1px solid ${group.border}`, borderRadius:14, padding:'16px', marginBottom:16 }}>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.6, marginBottom:group.skillTip?12:0 }}>{group.description}</div>
          {group.skillTip && (
            <div style={{ background:'rgba(255,200,87,.06)', border:'1px solid rgba(255,200,87,.18)', borderRadius:10, padding:'10px 14px' }}>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FFC857', marginBottom:5 }}>🗡️ Exam Tip</div>
              <p style={{ fontFamily:"'Inter',sans-serif", margin:0, fontSize:'.83rem', color:'#C8D0E8', lineHeight:1.55 }}>{group.skillTip}</p>
            </div>
          )}
        </div>

        {/* Level descriptors if present */}
        {group.levelDescriptors && (
          <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:14, padding:'14px', marginBottom:16 }}>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:group.color, marginBottom:10 }}>LEVEL DESCRIPTORS</div>
            {Object.entries(group.levelDescriptors).map(([marks, desc]) => (
              <div key={marks} style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start' }}>
                <div style={{ background:group.bg, border:`1px solid ${group.border}`, borderRadius:8, padding:'3px 9px', fontFamily:"'Space Grotesk',sans-serif", fontSize:'.7rem', fontWeight:700, color:group.color, flexShrink:0, whiteSpace:'nowrap' }}>{marks}</div>
                <p style={{ fontFamily:"'Inter',sans-serif", margin:0, fontSize:'.82rem', color:'#9CA8C7', lineHeight:1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setQIdx(0)} style={{ width:'100%', background:`linear-gradient(135deg,${group.color}cc,${group.color})`, color:'#fff', border:'none', borderRadius:14, padding:'15px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, cursor:'pointer', fontSize:'.97rem', marginBottom:16, boxShadow:`0 4px 20px ${group.color}44` }}>
          Practice all {qs.length} question{qs.length!==1?'s':''} →
        </button>

        <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:16, overflow:'hidden' }}>
          {qs.map((q,i) => (
            <button key={q.id} onClick={() => setQIdx(i)} style={{ width:'100%', background:'transparent', border:'none', borderBottom:i<qs.length-1?'1px solid #161F30':'none', padding:'14px 16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:group.bg, border:`1px solid ${group.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.7rem', color:group.color, textAlign:'center', lineHeight:1.2 }}>
                {q.marks}m
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:'.9rem', color:'#E0E6F0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {q.q.split('\n')[0].substring(0,60)}{q.q.split('\n')[0].length>60?'…':''}
                </div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.7rem', color:'#4A5578', marginTop:2 }}>{q.source} · {q.marks} mark{q.marks!==1?'s':''}</div>
              </div>
              <span style={{ color:'#2A3552', fontSize:'1rem', flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── English browser ──────────────────────────────────────────────────────────
function EnglishBrowser({ onBack }) {
  const [activeGroup, setGroup] = useState(null)
  const [filter, setFilter]     = useState('all')

  if (activeGroup) return <EnglishTopicView group={activeGroup} onBack={() => setGroup(null)} />

  const totalQs = ENGLISH_TOPIC_GROUPS.reduce((s,g) => s + g.questions.length, 0)
  const filters = [
    { id:'all',    label:`All (${totalQs})` },
    { id:'p1',     label:'Paper 1' },
    { id:'p2',     label:'Paper 2' },
    { id:'skills', label:'Skills' },
  ]

  const filtered = filter === 'all'    ? ENGLISH_TOPIC_GROUPS
    : filter === 'p1'     ? ENGLISH_TOPIC_GROUPS.filter(g => g.paper.includes('1') || g.paper.includes('Both'))
    : filter === 'p2'     ? ENGLISH_TOPIC_GROUPS.filter(g => g.paper.includes('2') || g.paper.includes('Both'))
    : ENGLISH_TOPIC_GROUPS.filter(g => g.paper === 'Skills practice')

  return (
    <div style={{ background:'#080C1A', minHeight:'100vh', paddingBottom:90 }}>
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'14px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#5A6480', fontSize:'1.1rem', padding:0, flexShrink:0 }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1rem', color:'#F5F7FB' }}>AQA English Language</div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem', color:'#5A6480' }}>Papers 1 & 2 · {ENGLISH_TOPIC_GROUPS.length} skill areas · {totalQs} questions · AI marked</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(157,92,255,.15)':'#10182B', border:`1px solid ${filter===f.id?'#9D5CFF':'#1E2A40'}`, borderRadius:10, padding:'9px 6px', fontFamily:"'Inter',sans-serif", fontSize:'.75rem', fontWeight:600, color:filter===f.id?'#C18CFF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

        {/* Topic cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:16, padding:'16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, width:'100%' }}>
              <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, background:group.bg, border:`1px solid ${group.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:group.color, fontWeight:800 }}>
                {group.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.93rem', color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  <div style={{ flex:1, height:3, background:'#1E2A40', borderRadius:99 }} />
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.68rem', fontWeight:600, color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', color:'#4A5578', flexShrink:0 }}>{group.marks}m</span>
                </div>
              </div>
              <span style={{ color:'#2A3552', fontSize:'1.1rem', flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}



function TestTab() {
  const [mathsOpen, setMathsOpen]   = useState(false)
  const [englishOpen, setEnglishOpen] = useState(false)
  const [selected, setSelected]   = useState(null)
  const [qIdx, setQIdx]           = useState(0)
  const [answer, setAnswer]       = useState('')
  const [showTip, setTip]         = useState(false)
  const [grading, setGrading]     = useState(false)
  const [feedback, setFeedback]   = useState(null)
  const [error, setError]         = useState(null)

  function resetQ() { setAnswer(''); setTip(false); setFeedback(null); setError(null); setGrading(false) }

  if (mathsOpen)   return <MathsBrowser   onBack={() => setMathsOpen(false)} />
  if (englishOpen) return <EnglishBrowser onBack={() => setEnglishOpen(false)} />

  const GRADE_STYLE = {
    'Excellent':  { bg:'rgba(77,255,136,.08)',  border:'rgba(77,255,136,.3)',  text:'#4DFF88', badge:'#38D27A' },
    'Good':       { bg:'rgba(77,255,136,.06)',  border:'rgba(77,255,136,.2)',  text:'#6BFFB0', badge:'#38D27A' },
    'Developing': { bg:'rgba(255,200,87,.08)',  border:'rgba(255,200,87,.3)',  text:'#FFC857', badge:'#F5B700' },
    'Needs Work': { bg:'rgba(255,93,115,.08)',  border:'rgba(255,93,115,.3)',  text:'#FF5D73', badge:'#FF5D73' },
  }
  const MARK_TIPS = {
    1:'One clear specific point.',
    2:'Two separate points, or one point plus a reason.',
    3:'Show all working — each step can earn a mark.',
    4:'Two developed points with explanation.',
    6:'Level of response — link facts, not just list them.',
    12:'Three or four developed paragraphs with specific evidence.',
    16:'Argue both sides then reach a clear judgement with evidence.',
  }

  async function gradeAnswer(q) {
    if (answer.trim().length < 3) { setError('Write a bit more before submitting.'); return }
    setGrading(true); setError(null)
    try {
      const d = await gradeWithAI(q.q, answer2, q.marks, q.ms)
      setFeedback(d)
    } catch { setError('Could not grade right now. Check your connection.') }
    finally { setGrading(false) }
  }

  function nextQuestion(total) {
    if (qIdx < total - 1) { setQIdx(qIdx+1); resetQ() }
    else { setSelected(null); setQIdx(0); resetQ() }
  }

  if (selected) {
    const questions = PAST_PAPER_QS[selected.topicId] || []
    const q = questions[qIdx]
    const gs = feedback ? (GRADE_STYLE[feedback.grade] || GRADE_STYLE['Developing']) : null
    return (
      <div style={{ background:'#080C1A', minHeight:'100vh', paddingBottom:90 }}>
        <div style={{ background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', padding:'12px 16px', position:'sticky', top:0, zIndex:10, backdropFilter:'blur(12px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, maxWidth:660, margin:'0 auto' }}>
            <button onClick={() => { setSelected(null); setQIdx(0); resetQ() }} style={{ background:'none', border:'none', cursor:'pointer', color:'#5A6480', fontSize:'1.1rem', padding:0 }}>←</button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.9rem', color:'#F5F7FB', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selected.label}</div>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.7rem', color:'#5A6480' }}>Question {qIdx+1} of {questions.length}</div>
            </div>
          </div>
          <div style={{ height:3, background:'#1E2A40', borderRadius:99, overflow:'hidden', marginTop:10, maxWidth:660, margin:'10px auto 0' }}>
            <div style={{ height:'100%', width:`${((qIdx+1)/questions.length)*100}%`, background:'linear-gradient(90deg,#F5B700,#C98719)', borderRadius:99, transition:'width .3s' }} />
          </div>
        </div>
        <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
          {q && <>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(245,183,0,.1)', border:'1px solid rgba(245,183,0,.25)', borderRadius:99, padding:'4px 12px', marginBottom:14 }}>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'.75rem', fontWeight:700, color:'#F5B700' }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
            </div>
            {q.fig && FIGURES[q.fig] && (
              <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:12, padding:'12px', marginBottom:14, textAlign:'center' }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'#5A6480', marginBottom:8 }}>Figure — from AQA past paper</div>
                <img src={FIGURES[q.fig]} alt="AQA exam figure" style={{ maxWidth:'100%', height:'auto', borderRadius:8 }} />
              </div>
            )}
            <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:14, padding:'16px', marginBottom:14 }}>
              <pre style={{ fontFamily:"'Inter',sans-serif", fontSize:'1rem', lineHeight:1.65, margin:0, color:'#E0E6F0', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
            </div>
            {!showTip
              ? <button onClick={() => setTip(true)} style={{ background:'none', border:'1px dashed #2A3552', borderRadius:10, padding:'9px 14px', cursor:'pointer', color:'#4A5578', fontSize:'.82rem', fontFamily:"'Inter',sans-serif", width:'100%', marginBottom:14 }}>💡 Show mark tip</button>
              : <div style={{ background:'rgba(245,183,0,.06)', border:'1px solid rgba(245,183,0,.2)', borderRadius:10, padding:'11px 14px', marginBottom:14 }}>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:5 }}>{q.marks}-mark question</div>
                  <p style={{ fontFamily:"'Inter',sans-serif", margin:0, fontSize:'.85rem', color:'#C8D0E8' }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
                </div>
            }
            {!feedback && (
              q.type === 'mc'
                ? <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
                    {q.options.map((opt,i) => (
                      <button key={i} onClick={() => setAnswer(opt)} style={{ background:answer===opt?'rgba(245,183,0,.1)':'#10182B', border:`1.5px solid ${answer===opt?'#F5B700':'#1E2A40'}`, borderRadius:12, padding:'13px 16px', cursor:'pointer', textAlign:'left', fontFamily:"'Inter',sans-serif", fontSize:'.93rem', color:answer===opt?'#F5B700':'#C8D0E8', transition:'all .15s' }}>
                        <span style={{ opacity:.45, marginRight:8 }}>{String.fromCharCode(65+i)}.</span>{opt}
                      </button>
                    ))}
                  </div>
                : <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:14, padding:'14px', marginBottom:14 }}>
                    <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4A5578', marginBottom:8 }}>Your answer</div>
                    <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Write your answer here…" style={{ width:'100%', border:'none', background:'transparent', resize:'none', fontFamily:"'Inter',sans-serif", fontSize:'.92rem', color:'#E0E6F0', lineHeight:1.65, outline:'none', minHeight:q.marks>=6?180:q.marks>=3?120:80 }} />
                  </div>
            )}
            {error && <div style={{ background:'rgba(255,93,115,.08)', border:'1px solid rgba(255,93,115,.3)', borderRadius:10, padding:'11px 14px', marginBottom:14 }}><p style={{ fontFamily:"'Inter',sans-serif", margin:0, fontSize:'.86rem', color:'#FF5D73' }}>{error}</p></div>}
            {feedback && gs && (
              <div className="fade-up">
                <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:16, padding:'18px', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.8rem', fontWeight:800, color:gs.text, lineHeight:1 }}>{feedback.marksAwarded}<span style={{ fontSize:'1rem', opacity:.6 }}>/{feedback.marksAvailable}</span></div>
                    <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.82rem' }}>{feedback.grade}</div>
                  </div>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'.9rem', color:gs.text, margin:0, opacity:.85 }}>{feedback.summary}</p>
                </div>
                {feedback.achieved?.length > 0 && <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4DFF88', marginBottom:8 }}>✓ What you got right</div>{feedback.achieved.map((a,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:'#4DFF88', flexShrink:0 }}>✓</span><p style={{ margin:0, fontFamily:"'Inter',sans-serif", fontSize:'.87rem', color:'#C8D0E8' }}>{a}</p></div>)}</div>}
                {feedback.missed?.length > 0 && feedback.missed[0]!=='No answer provided' && <div style={{ background:'#10182B', border:'1px solid #1E2A40', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FF5D73', marginBottom:8 }}>→ Points to add next time</div>{feedback.missed.map((m,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:'#FF5D73', flexShrink:0 }}>→</span><p style={{ margin:0, fontFamily:"'Inter',sans-serif", fontSize:'.87rem', color:'#C8D0E8' }}>{m}</p></div>)}</div>}
                {feedback.examinerTip && <div style={{ background:'rgba(245,183,0,.06)', border:'1px solid rgba(245,183,0,.2)', borderRadius:12, padding:'13px 14px', marginBottom:14 }}><div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:6 }}>🗡️ Examiner tip</div><p style={{ margin:0, fontFamily:"'Inter',sans-serif", fontSize:'.87rem', color:'#C8D0E8' }}>{feedback.examinerTip}</p></div>}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <button onClick={resetQ} style={{ background:'#10182B', border:'1px solid #2A3552', borderRadius:12, padding:'13px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, cursor:'pointer', color:'#9CA8C7', fontSize:'.88rem' }}>↩ Try again</button>
                  <button onClick={()=>nextQuestion(questions.length)} style={{ background:'linear-gradient(135deg,#F5B700,#C98719)', border:'none', borderRadius:12, padding:'13px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, cursor:'pointer', color:'#070500', fontSize:'.88rem' }}>{qIdx<questions.length-1?'Next →':'Finish ✓'}</button>
                </div>
              </div>
            )}
            {!feedback && <button onClick={()=>gradeAnswer(q)} disabled={grading} style={{ width:'100%', background:grading?'#1E2A40':'linear-gradient(135deg,#F5B700,#C98719)', color:grading?'#5A6480':'#070500', border:'none', borderRadius:12, padding:'15px', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, cursor:grading?'default':'pointer', fontSize:'.97rem', marginTop:4 }}>{grading?'Marking…':'Check my answer →'}</button>}
          </>}
        </div>
      </div>
    )
  }


  // Subject definitions for the clean grid
  const SUBJECTS = [
    { id: 'maths',   label: 'Maths',   icon: '✕²', color: '#3B82FF', bg: 'rgba(59,130,255,.1)',  action: () => setMathsOpen(true) },
    { id: 'history', label: 'History', icon: '🏰', color: '#F5B700', bg: 'rgba(245,183,0,.1)',   action: () => setSelected({ topicId: 'medieval', label: 'Medieval Medicine', subject: 'History' }) },
    { id: 'english', label: 'English', icon: '📖', color: '#9D5CFF', bg: 'rgba(157,92,255,.1)', action: () => setEnglishOpen(true) },
    { id: 'science', label: 'Science', icon: '🧬', color: '#38D27A', bg: 'rgba(56,210,122,.1)', action: () => setSelected({ topicId: 'tb_cells', label: 'Cells & Microscopy', subject: 'Biology' }) },
    { id: 'sociology', label: 'Sociology', icon: '👥', color: '#FF5C7A', bg: 'rgba(255,92,122,.1)', action: () => {} },
    { id: 'drama',  label: 'Drama',   icon: '🎭', color: '#FF4FC3', bg: 'rgba(255,79,195,.1)', action: () => {} },
  ]

  // Mock "most improved" — in future this could be computed from real attempt history
  const IMPROVED = [
    { icon: '🧬', label: 'Science', pct: 12, color: '#38D27A' },
    { icon: '🏰', label: 'History', pct: 9,  color: '#F5B700' },
    { icon: '✕²', label: 'Maths',   pct: 7,  color: '#3B82FF' },
  ]

  return (
    <div style={{ background: '#080C1A', minHeight: '100vh', paddingBottom: 90 }}>

      {/* ── Header ── */}
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,6vw,2rem)', color: '#F5F7FB', margin: 0, lineHeight: 1.1 }}>
              Test <span style={{ color: '#9D5CFF' }}>Yourself</span>
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.85rem', color: '#4A5578', marginTop: 6, margin: '6px 0 0' }}>
              Real exam questions. Real progress.
            </p>
          </div>
          {/* Streak pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,138,31,.1)', border: '1px solid rgba(255,138,31,.2)', borderRadius: 99, padding: '5px 12px', flexShrink: 0, marginTop: 4 }}>
            <span style={{ fontSize: '.85rem' }}>🔥</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '.72rem', fontWeight: 700, color: '#FF8A1F' }}>4 day streak</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '28px 22px 0' }}>

        {/* ── Most improved this week ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <span style={{ fontSize: '.8rem' }}>📈</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '.67rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A5578' }}>Most improved this week</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {IMPROVED.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.95rem' }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#E0E6F0' }}>{s.label}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.72rem', color: s.color, fontWeight: 600 }}>↑{s.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Random question — lightweight card ── */}
        <button
          onClick={() => {
            const allT = TEST_TOPICS.filter(s => s.topics.some(t => t.available))
            const rs = allT[Math.floor(Math.random() * allT.length)]
            const av = rs.topics.filter(t => t.available)
            const rt = av[Math.floor(Math.random() * av.length)]
            setSelected({ topicId: rt.id, label: rt.label, subject: rs.subject })
          }}
          style={{
            width: '100%', background: '#10182B',
            border: '1px solid #1E2A40',
            borderRadius: 16, padding: '16px 20px',
            cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 16,
            marginBottom: 36,
            transition: 'border-color .2s',
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(157,92,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>🎲</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#F5F7FB' }}>Random Question</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.78rem', color: '#4A5578', marginTop: 2 }}>Tap and go</div>
          </div>
          <span style={{ color: '#9D5CFF', fontSize: '1rem' }}>→</span>
        </button>

        {/* ── Subjects grid ── */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: '.8rem' }}>📚</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '.67rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A5578' }}>Subjects</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SUBJECTS.map(s => (
              <button key={s.id} onClick={s.action} style={{
                background: '#10182B',
                border: '1px solid #1A2338',
                borderRadius: 18,
                padding: '24px 16px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'background .15s, border-color .15s',
                minHeight: 110,
              }}>
                {/* Icon tile */}
                <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                  {s.icon}
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '.9rem', color: '#E0E6F0' }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Continue last session ── */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <span style={{ fontSize: '.8rem' }}>🕐</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '.67rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A5578' }}>Continue last session</span>
          </div>
          <div style={{ background: '#10182B', border: '1px solid #1A2338', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(59,130,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>📐</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#F5F7FB', marginBottom: 3 }}>Maths Foundation</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.75rem', color: '#4A5578', marginBottom: 8 }}>Question 12 of 25 · ~9 mins left</div>
              <div style={{ height: 3, background: '#1A2338', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '48%', background: '#3B82FF', borderRadius: 99 }} />
              </div>
            </div>
            <button onClick={() => setMathsOpen(true)} style={{ background: 'linear-gradient(135deg, #7C3AED, #9D5CFF)', border: 'none', borderRadius: 12, padding: '10px 16px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.82rem', color: '#fff', cursor: 'pointer', flexShrink: 0, letterSpacing: '.02em' }}>
              CONTINUE →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}


// ─── Phase 1: Warm-up ────────────────────────────────────────────────────────

function PhaseWarmup({ questions, onComplete }) {
  const [idx, setIdx]           = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore]       = useState(0)
  const [shakeIdx, setShakeIdx] = useState(null)
  const q = questions[idx]

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correctIndex) setScore(s => s + 1)
    else setShakeIdx(i)
  }
  function next() {
    const finalScore = score + (selected === q.correctIndex ? 1 : 0)
    if (idx + 1 < questions.length) { setIdx(i => i + 1); setSelected(null); setShakeIdx(null) }
    else onComplete({ warmupScore: finalScore })
  }

  return (
    <div className="section">
      <div className="container anim-pop">
        <div className="flex items-center justify-between mb-16">
          <span className="label">Question {idx + 1} of {questions.length}</span>
          <span style={{ fontSize: '.82rem', color: 'var(--green)', fontWeight: 700 }}>{score} correct</span>
        </div>
        <div className="card mb-16"><h2 style={{ fontSize: '1.1rem', lineHeight: 1.4 }}>{q.question}</h2></div>
        <div className="grid-stack">
          {q.options.map((opt, i) => (
            <button key={`${idx}-${i}`}
              className={`opt${selected !== null ? (i === q.correctIndex ? ' correct' : i === selected ? ' wrong' : '') : ''}${shakeIdx === i ? ' shake' : ''}`}
              onClick={() => choose(i)} disabled={selected !== null}>
              <span style={{ marginRight: 8, opacity: .5 }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          ))}
        </div>
        {selected !== null && (
          <div className="fade-up" style={{ marginTop: 18 }}>
            <div className={`feedback ${selected === q.correctIndex ? 'correct' : 'wrong'}`}>
              <p style={{ fontSize: '.9rem', margin: 0 }}>
                <strong>{selected === q.correctIndex ? '✓ Correct! ' : '✗ Not quite. '}</strong>{q.explanation}
              </p>
            </div>
            <button className="btn btn-primary w-full" onClick={next}>
              {idx + 1 < questions.length ? 'Next question →' : 'See key facts →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Phase 2: Facts router ───────────────────────────────────────────────────

function PhaseFacts({ session, topic, onComplete }) {
  if (session.topicId === 'medieval' && session.interactiveFacts) {
    return <MedievalFacts interactiveFacts={session.interactiveFacts} onComplete={onComplete} />
  }
  return <GenericFacts facts={session.facts} keyDates={session.keyDates} topic={topic} onComplete={onComplete} />
}

// ─── Generic card-per-fact (non-medieval topics) ──────────────────────────────

function GenericFacts({ facts, keyDates, topic, onComplete }) {
  const [cardIdx, setCardIdx] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const cards = [
    ...facts.map(f => ({ type: 'fact', ...f })),
    ...(keyDates?.length ? [{ type: 'dates', keyDates }] : []),
  ]
  const card   = cards[cardIdx]
  const isLast = cardIdx === cards.length - 1

  function nextCard() {
    if (isLast) { onComplete({ factConfidence: 'got_it' }); return }
    setAnimKey(k => k + 1)
    setCardIdx(i => i + 1)
  }

  return (
    <div className="section">
      <div className="container">
        <div className="fact-dots mb-24">
          {cards.map((_, i) => (
            <div key={i} className={`fact-dot-pip${i === cardIdx ? ' active' : i < cardIdx ? ' done' : ''}`} />
          ))}
        </div>

        <div key={animKey} className="anim-pop">
          {card.type === 'fact' && (
            <>
              <div className="fact-card-hero" style={{ background: topic?.colorLight || '#f5e6d3', borderColor: topic?.color || 'var(--red)' }}>
                <div className="fact-card-label" style={{ color: topic?.color || 'var(--red)' }}>{card.keyTerm}</div>
                <p style={{ fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>{card.text}</p>
              </div>
              <button className="btn btn-primary w-full mt-16" onClick={nextCard}>
                {isLast ? 'Start the quiz →' : 'Got it — next →'}
              </button>
            </>
          )}
          {card.type === 'dates' && (
            <>
              <div className="fact-card-hero" style={{ background: '#1a1a2e', borderColor: '#2d2d55' }}>
                <div className="fact-card-label" style={{ color: 'var(--gold2)' }}>Key Dates</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
                  {card.keyDates.map(kd => (
                    <div key={kd.year} style={{ display: 'flex', gap: 12, alignItems: `flex-start` }}>
                      <span className="date-pill" style={{ marginTop: 2, flexShrink: 0 }}>📅 {kd.year}</span>
                      <span style={{ color: '#e0e0f0', fontSize: '.93rem', lineHeight: 1.5 }}>{kd.event}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary w-full mt-16" onClick={nextCard}>
                Start the quiz →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Medieval interactive facts ───────────────────────────────────────────────

function MedievalFacts({ interactiveFacts, onComplete }) {
  const [cardIdx, setCardIdx] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const cards  = interactiveFacts
  const isLast = cardIdx === cards.length - 1

  function nextCard() {
    if (isLast) { onComplete({ factConfidence: 'got_it' }); return }
    setAnimKey(k => k + 1)
    setCardIdx(i => i + 1)
  }

  const card = cards[cardIdx]

  return (
    <div className="section">
      <div className="container">
        <div className="fact-dots mb-24">
          {cards.map((_, i) => (
            <div key={i} className={`fact-dot-pip${i === cardIdx ? ' active' : i < cardIdx ? ' done' : ''}`} />
          ))}
        </div>
        <div key={animKey} className="anim-pop">
          {card.type === 'humours'    && <HumoursCard    card={card} onNext={nextCard} isLast={isLast} />}
          {card.type === 'galen'      && <GalenCard      card={card} onNext={nextCard} isLast={isLast} />}
          {card.type === 'church'     && <ChurchCard     card={card} onNext={nextCard} isLast={isLast} />}
          {card.type === 'blackdeath' && <BlackDeathCard card={card} onNext={nextCard} isLast={isLast} />}
          {card.type === 'dates'      && <DatesCard      card={card} onNext={nextCard} isLast={isLast} />}
        </div>
      </div>
    </div>
  )
}

// ─── Humours Card ─────────────────────────────────────────────────────────────

const HUMOUR_DATA = [
  { name: 'Blood',       emoji: '🩸', color: '#FF5D73', bg: 'rgba(255,93,115,.1)', element: 'Air',   season: 'Spring', trait: 'Cheerful & optimistic', fact: 'Too much? Doctor cuts a vein or applies leeches.' },
  { name: 'Phlegm',      emoji: '💧', color: '#70B8FF', bg: 'rgba(59,130,255,.1)', element: 'Water', season: 'Winter', trait: 'Calm & unemotional',    fact: "Too much? You'd be sluggish, pale and cold." },
  { name: 'Yellow Bile', emoji: '⚡', color: '#FFC857', bg: 'rgba(255,200,87,.1)', element: 'Fire',  season: 'Summer', trait: 'Easily angered',         fact: 'Too much? Causes fever, vomiting, bad temper.' },
  { name: 'Black Bile',  emoji: '🌑', color: '#9CA8C7', bg: 'rgba(157,92,255,.1)', element: 'Earth', season: 'Autumn', trait: 'Sad & withdrawn',        fact: 'Too much? Causes depression and serious illness.' },
]

function HumoursCard({ card, onNext, isLast }) {
  const [flipped, setFlipped]   = useState([])
  const [quizDone, setQuizDone] = useState(false)
  const [selected, setSelected] = useState(null)
  const [shakeIdx, setShakeIdx] = useState(null)
  const allFlipped = flipped.length === HUMOUR_DATA.length

  function flip(i) {
    if (!flipped.includes(i)) setFlipped(f => [...f, i])
  }
  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i !== card.quiz.correctIndex) setShakeIdx(i)
    else setTimeout(() => setQuizDone(true), 900)
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>🫙</div>
        <h2 style={{ marginBottom: 8 }}>The Four Humours</h2>
        <p style={{ fontSize: '.93rem', maxWidth: 340, margin: '0 auto' }}>
          Medieval doctors thought your body had four liquids. Illness = imbalance.
        </p>
      </div>

      <p className="label" style={{ marginBottom: 10, textAlign: 'center' }}>Tap each humour to reveal it</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {HUMOUR_DATA.map((h, i) => {
          const isFlipped = flipped.includes(i)
          return (
            <button key={h.name} onClick={() => flip(i)}
              style={{
                background: isFlipped ? h.bg : 'var(--bg3)',
                border: `2px solid ${isFlipped ? h.color : 'var(--border)'}`,
                borderRadius: 14, padding: '14px 12px', cursor: 'pointer',
                transition: 'all .25s', textAlign: 'left',
                transform: isFlipped ? 'scale(1.02)' : 'scale(1)',
              }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 5 }}>{h.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: h.color, marginBottom: isFlipped ? 5 : 0 }}>{h.name}</div>
              {isFlipped && (
                <div className="fade-up">
                  <div style={{ fontSize: '.73rem', color: 'var(--ink2)', marginBottom: 3 }}><strong>Trait:</strong> {h.trait}</div>
                  <div style={{ fontSize: '.73rem', color: 'var(--muted)' }}>🌍 {h.element} · {h.season}</div>
                  <div style={{ fontSize: '.7rem', color: h.color, marginTop: 5, fontStyle: 'italic' }}>{h.fact}</div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {!allFlipped && (
        <p className="text-center text-muted text-sm">{HUMOUR_DATA.length - flipped.length} left to tap</p>
      )}

      {allFlipped && !quizDone && (
        <div className="fade-up">
          <div className="card mb-12" style={{ background: '#1a1a2e', border: 'none' }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{card.quiz.question}</p>
          </div>
          <div className="grid-stack">
            {card.quiz.options.map((opt, i) => (
              <button key={i}
                className={`opt${selected !== null ? (i === card.quiz.correctIndex ? ' correct' : i === selected ? ' wrong' : '') : ''}${shakeIdx === i ? ' shake' : ''}`}
                onClick={() => choose(i)} disabled={selected !== null}>
                <span style={{ marginRight: 8, opacity: .5 }}>{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
          </div>
          {selected !== null && selected !== card.quiz.correctIndex && (
            <div className="fade-up mt-12">
              <div className="feedback wrong mb-12">
                <p style={{ margin: 0, fontSize: '.9rem' }}><strong>✗ Not quite.</strong> {card.quiz.explanation}</p>
              </div>
              <button className="btn btn-primary w-full" onClick={onNext}>
                {isLast ? 'Start the quiz →' : 'Next: Galen →'}
              </button>
            </div>
          )}
          {selected === null && <p className="text-center text-muted text-sm mt-12">Answer to continue</p>}
        </div>
      )}

      {quizDone && (
        <div className="fade-up">
          <div className="feedback correct mb-12">
            <p style={{ margin: 0, fontSize: '.95rem' }}>🎉 <strong>Nailed it!</strong> {card.quiz.explanation}</p>
          </div>
          <button className="btn btn-primary w-full" onClick={onNext}>
            {isLast ? 'Start the quiz →' : 'Next: Galen →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Galen Card ───────────────────────────────────────────────────────────────

function GalenCard({ card, onNext, isLast }) {
  const [revealed, setRevealed] = useState([])
  const [quizDone, setQuizDone] = useState(false)
  const [selected, setSelected] = useState(null)
  const [shakeIdx, setShakeIdx] = useState(null)
  const allRevealed = revealed.length === card.comparisons.length

  function reveal(i) {
    if (!revealed.includes(i)) setRevealed(r => [...r, i])
  }
  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i !== card.quiz.correctIndex) setShakeIdx(i)
    else setTimeout(() => setQuizDone(true), 900)
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🏛️</div>
        <h2 style={{ marginBottom: 8 }}>Galen</h2>
        <p style={{ fontSize: '.93rem', maxWidth: 340, margin: '0 auto' }}>
          A Roman doctor so influential, his ideas dominated medicine for <strong>over 1,000 years</strong> — even when completely wrong.
        </p>
      </div>

      <p className="label" style={{ marginBottom: 10, textAlign: 'center' }}>Tap to reveal: right or wrong?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {card.comparisons.map((c, i) => {
          const isRevealed = revealed.includes(i)
          return (
            <button key={i} onClick={() => reveal(i)}
              style={{
                background: isRevealed ? (c.wasRight ? 'rgba(77,255,136,.08)' : 'rgba(255,93,115,.08)') : 'var(--bg3)',
                border: `2px solid ${isRevealed ? (c.wasRight ? '#4DFF88' : '#FF5D73') : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 16px',
                cursor: isRevealed ? 'default' : 'pointer',
                textAlign: 'left', transition: 'all .2s',
              }}>
              <div style={{ display: 'flex', alignItems: `flex-start`, gap: 10 }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{isRevealed ? (c.wasRight ? '✅' : '❌') : '❓'}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.92rem' }}>{c.claim}</div>
                  {isRevealed && (
                    <div className="fade-up" style={{ fontSize: '.8rem', color: 'var(--ink2)', marginTop: 4 }}>{c.verdict}</div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {!allRevealed && (
        <p className="text-center text-muted text-sm">{card.comparisons.length - revealed.length} claim{card.comparisons.length - revealed.length !== 1 ? 's' : ''} left to tap</p>
      )}

      {allRevealed && !quizDone && (
        <div className="fade-up">
          <div className="card mb-12" style={{ background: '#1a1a2e', border: 'none' }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{card.quiz.question}</p>
          </div>
          <div className="grid-stack">
            {card.quiz.options.map((opt, i) => (
              <button key={i}
                className={`opt${selected !== null ? (i === card.quiz.correctIndex ? ' correct' : i === selected ? ' wrong' : '') : ''}${shakeIdx === i ? ' shake' : ''}`}
                onClick={() => choose(i)} disabled={selected !== null}>
                <span style={{ marginRight: 8, opacity: .5 }}>{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
          </div>
          {selected !== null && selected !== card.quiz.correctIndex && (
            <div className="fade-up mt-12">
              <div className="feedback wrong mb-12">
                <p style={{ margin: 0, fontSize: '.9rem' }}><strong>✗ Not quite.</strong> {card.quiz.explanation}</p>
              </div>
              <button className="btn btn-primary w-full" onClick={onNext}>
                {isLast ? 'Start the quiz →' : 'Next: The Church →'}
              </button>
            </div>
          )}
          {selected === null && <p className="text-center text-muted text-sm mt-12">Answer to continue</p>}
        </div>
      )}

      {quizDone && (
        <div className="fade-up">
          <div className="feedback correct mb-12">
            <p style={{ margin: 0, fontSize: '.95rem' }}>🎉 <strong>Correct!</strong> {card.quiz.explanation}</p>
          </div>
          <button className="btn btn-primary w-full" onClick={onNext}>
            {isLast ? 'Start the quiz →' : 'Next: The Church →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Church Card ──────────────────────────────────────────────────────────────

function ChurchCard({ card, onNext, isLast }) {
  const [sorted, setSorted]       = useState({ helped: [], hindered: [] })
  const [remaining, setRemaining] = useState(card.statements)
  const allSorted = remaining.length === 0

  function sort(statement, bucket) {
    setSorted(s => ({ ...s, [bucket]: [...s[bucket], statement] }))
    setRemaining(r => r.filter(x => x.text !== statement.text))
  }

  const mistakes = allSorted
    ? [...sorted.helped.filter(s => s.correct !== 'helped'), ...sorted.hindered.filter(s => s.correct !== 'hindered')]
    : []

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>⛪</div>
        <h2 style={{ marginBottom: 8 }}>The Church</h2>
        <p style={{ fontSize: '.93rem', maxWidth: 340, margin: '0 auto' }}>
          The Church ran medieval life — including medicine. But was it a help or a hindrance?
        </p>
      </div>

      {remaining.length > 0 && (
        <>
          <p className="label" style={{ marginBottom: 12, textAlign: 'center' }}>Sort this statement</p>
          <div className="card mb-14" style={{ textAlign: 'center', padding: '22px 18px' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{remaining[0].emoji}</div>
            <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{remaining[0].text}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <button className="btn btn-green" onClick={() => sort(remaining[0], 'helped')}
              style={{ flexDirection: 'column', gap: 4, padding: '14px 10px' }}>
              <span style={{ fontSize: '1.2rem' }}>👍</span>
              <span style={{ fontSize: '.85rem' }}>Helped</span>
            </button>
            <button className="btn btn-red" onClick={() => sort(remaining[0], 'hindered')}
              style={{ flexDirection: 'column', gap: 4, padding: '14px 10px' }}>
              <span style={{ fontSize: '1.2rem' }}>👎</span>
              <span style={{ fontSize: '.85rem' }}>Hindered</span>
            </button>
          </div>
          <p className="text-center text-muted text-sm">{remaining.length} left to sort</p>
        </>
      )}

      {allSorted && (
        <div className="fade-up">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ background: 'rgba(77,255,136,.08)', border: '2px solid rgba(77,255,136,.3)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontWeight: 700, color: '#4DFF88', fontSize: '.75rem', marginBottom: 8 }}>👍 HELPED</div>
              {sorted.helped.map(s => (
                <div key={s.text} style={{ fontSize: '.78rem', marginBottom: 5 }}>
                  {s.correct === 'helped' ? <span>✅ {s.text}</span> : <span style={{ color: 'var(--red)' }}>⚠️ {s.text}</span>}
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,93,115,.08)', border: '2px solid rgba(255,93,115,.3)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontWeight: 700, color: '#FF5D73', fontSize: '.75rem', marginBottom: 8 }}>👎 HINDERED</div>
              {sorted.hindered.map(s => (
                <div key={s.text} style={{ fontSize: '.78rem', marginBottom: 5 }}>
                  {s.correct === 'hindered' ? <span>✅ {s.text}</span> : <span style={{ color: 'var(--red)' }}>⚠️ {s.text}</span>}
                </div>
              ))}
            </div>
          </div>

          {mistakes.length > 0 ? (
            <div className="feedback wrong mb-12">
              <p style={{ margin: 0, fontSize: '.85rem' }}>
                <strong>⚠️ A couple off.</strong> The Church both helped AND hindered — it's a key exam nuance.
              </p>
            </div>
          ) : (
            <div className="feedback correct mb-12">
              <p style={{ margin: 0, fontSize: '.85rem' }}>
                <strong>✓ Perfect sort!</strong> The Church was a double-edged sword — vital care, but blocked new knowledge.
              </p>
            </div>
          )}

          <button className="btn btn-primary w-full" onClick={onNext}>
            {isLast ? 'Start the quiz →' : 'Next: The Black Death →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Black Death Card ─────────────────────────────────────────────────────────

function BlackDeathCard({ card, onNext, isLast }) {
  const [allSeen, setAllSeen]   = useState([])
  const [activeIdx, setActiveIdx] = useState(null)
  const [quizDone, setQuizDone] = useState(false)
  const [selected, setSelected] = useState(null)
  const [shakeIdx, setShakeIdx] = useState(null)
  const allTapped = allSeen.length === card.beliefs.length

  function tapBelief(i) {
    setActiveIdx(i)
    setAllSeen(s => s.includes(i) ? s : [...s, i])
  }
  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i !== card.quiz.correctIndex) setShakeIdx(i)
    else setTimeout(() => setQuizDone(true), 900)
  }

  return (
    <div>
      <div style={{
        background: '#0d0d1a', borderRadius: 16, padding: '26px 20px',
        textAlign: 'center', marginBottom: 22, border: '1px solid #2d2d44',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>☠️</div>
        <h2 style={{ color: '#fff', marginBottom: 8 }}>The Black Death</h2>
        <div style={{ color: '#e0c87a', fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>1348.</div>
        <p style={{ color: '#c0c0d8', fontSize: '.93rem', margin: 0 }}>
          Roughly <strong style={{ color: '#fff' }}>1 in 3 people</strong> in England died.
        </p>
      </div>

      <p className="label" style={{ marginBottom: 8, textAlign: 'center' }}>What did people think caused it?</p>
      <p className="text-center text-muted text-sm mb-14">Tap each belief</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {card.beliefs.map((b, i) => {
          const isActive = activeIdx === i
          return (
            <button key={i} onClick={() => tapBelief(i)}
              style={{
                background: isActive ? '#1a1a2e' : 'var(--bg3)',
                border: `2px solid ${isActive ? '#4a4a8a' : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                textAlign: 'left', transition: 'all .2s',
              }}>
              <div style={{ display: 'flex', gap: 12, alignItems: `flex-start` }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{b.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, color: isActive ? '#fff' : 'var(--ink)', fontSize: '.93rem' }}>{b.belief}</div>
                  {isActive && (
                    <div className="fade-up" style={{ marginTop: 7 }}>
                      <div style={{ color: '#ff9090', fontSize: '.8rem', fontWeight: 600, marginBottom: 3 }}>
                        ✗ Wrong — they had no idea about germs yet.
                      </div>
                      <div style={{ color: '#a0a0c0', fontSize: '.78rem' }}>{b.context}</div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {!allTapped && (
        <p className="text-center text-muted text-sm">{card.beliefs.length - allSeen.length} left to tap</p>
      )}

      {allTapped && !quizDone && (
        <div className="fade-up">
          <div style={{ background: '#1a1a2e', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
            <p style={{ color: '#a0c8ff', fontSize: '.86rem', margin: 0 }}>
              💡 <strong style={{ color: '#fff' }}>The real cause?</strong> Bubonic plague, spread by fleas on rats. Nobody found this out until centuries later.
            </p>
          </div>
          <div className="card mb-12" style={{ background: '#0d0d1a', border: 'none' }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{card.quiz.question}</p>
          </div>
          <div className="grid-stack">
            {card.quiz.options.map((opt, i) => (
              <button key={i}
                className={`opt${selected !== null ? (i === card.quiz.correctIndex ? ' correct' : i === selected ? ' wrong' : '') : ''}${shakeIdx === i ? ' shake' : ''}`}
                onClick={() => choose(i)} disabled={selected !== null}>
                <span style={{ marginRight: 8, opacity: .5 }}>{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
          </div>
          {selected !== null && selected !== card.quiz.correctIndex && (
            <div className="fade-up mt-12">
              <div className="feedback wrong mb-12">
                <p style={{ margin: 0, fontSize: '.9rem' }}><strong>✗ Not quite.</strong> {card.quiz.explanation}</p>
              </div>
              <button className="btn btn-primary w-full" onClick={onNext}>
                {isLast ? 'Start the quiz →' : 'Next →'}
              </button>
            </div>
          )}
          {selected === null && <p className="text-center text-muted text-sm mt-10">Answer to continue</p>}
        </div>
      )}

      {quizDone && (
        <div className="fade-up">
          <div className="feedback correct mb-12">
            <p style={{ margin: 0, fontSize: '.95rem' }}>🎉 <strong>Correct!</strong> {card.quiz.explanation}</p>
          </div>
          <button className="btn btn-primary w-full" onClick={onNext}>
            {isLast ? 'Start the quiz →' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Dates Card ───────────────────────────────────────────────────────────────

function DatesCard({ card, onNext, isLast }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: '2rem', marginBottom: 10 }}>📅</div>
        <h2 style={{ marginBottom: 8 }}>Key Dates</h2>
        <p style={{ fontSize: '.9rem' }}>These come up in the exam — lock them in.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {card.keyDates.map((kd, i) => (
          <div key={i} style={{
            background: '#1a1a2e', borderRadius: 12, padding: '16px 18px',
            display: 'flex', gap: 14, alignItems: `flex-start`,
          }}>
            <span className="date-pill" style={{ marginTop: 2, flexShrink: 0 }}>📅 {kd.year}</span>
            <span style={{ color: '#e0e0f0', fontSize: '.93rem', lineHeight: 1.5 }}>{kd.event}</span>
          </div>
        ))}
      </div>
      <button className="btn btn-primary w-full" onClick={onNext}>
        {isLast ? 'Start the quiz →' : 'Next →'}
      </button>
    </div>
  )
}

// ─── Phase 3: Mini quiz ──────────────────────────────────────────────────────

function PhaseMiniQuiz({ questions, onComplete }) {
  const [idx, setIdx]           = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore]       = useState(0)
  const [shakeIdx, setShakeIdx] = useState(null)
  const q   = questions[idx]
  const pct = Math.round((idx / questions.length) * 100)

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correctIndex) setScore(s => s + 1)
    else setShakeIdx(i)
  }
  function next() {
    const finalScore = score + (selected === q.correctIndex ? 1 : 0)
    if (idx + 1 < questions.length) { setIdx(i => i + 1); setSelected(null); setShakeIdx(null) }
    else onComplete({ quizScore: finalScore, quizTotal: questions.length })
  }

  return (
    <div className="section">
      <div className="container anim-pop">
        <div className="flex items-center justify-between mb-8">
          <span className="label">Question {idx + 1} of {questions.length}</span>
          <span style={{ fontSize: '.82rem', color: 'var(--green)', fontWeight: 700 }}>{score}/{idx} correct</span>
        </div>
        <div className="prog-wrap mb-16"><div className="prog-fill" style={{ width: `${pct}%`, background: 'var(--blue)' }} /></div>
        <div className="card mb-16"><h2 style={{ fontSize: '1.05rem', lineHeight: 1.4 }}>{q.question}</h2></div>
        <div className="grid-stack">
          {q.options.map((opt, i) => (
            <button key={`${idx}-${i}`}
              className={`opt${selected !== null ? (i === q.correctIndex ? ' correct' : i === selected ? ' wrong' : '') : ''}${shakeIdx === i ? ' shake' : ''}`}
              onClick={() => choose(i)} disabled={selected !== null}>
              <span style={{ marginRight: 8, opacity: .5 }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          ))}
        </div>
        {selected !== null && (
          <div className="fade-up" style={{ marginTop: 18 }}>
            <div className={`feedback ${selected === q.correctIndex ? 'correct' : 'wrong'}`}>
              <p style={{ fontSize: '.9rem', margin: 0 }}>
                <strong>{selected === q.correctIndex ? '✓ Correct! ' : '✗ Not quite. '}</strong>{q.explanation}
              </p>
            </div>
            <button className="btn btn-primary w-full" onClick={next}>
              {idx + 1 < questions.length ? 'Next →' : 'See results →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Phase 4: Progress ───────────────────────────────────────────────────────

function PhaseProgress({ results, topicId, topic, onComplete }) {
  const { warmupScore = 0, quizScore = 0, quizTotal = 0 } = results
  const totalRight = warmupScore + quizScore
  const totalQ     = 3 + quizTotal
  const pct        = Math.round((totalRight / totalQ) * 100)
  const ringClass  = pct >= 70 ? '' : pct >= 50 ? 'mid' : 'low'
  const progress   = getProgress()
  const tp         = progress.topicProgress?.[topicId]
  const days       = tp?.nextReviewDate ? Math.max(0, Math.round((new Date(tp.nextReviewDate) - new Date()) / 86400000)) : 3

  return (
    <div className="section">
      <div className="container anim-pop" style={{ textAlign: 'center' }}>
        <div className={`result-ring ${ringClass}`} style={{ marginBottom: 22 }}>
          <span style={{ fontSize: '1.7rem', fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{totalRight}/{totalQ}</span>
          <span style={{ fontSize: '.73rem', color: 'var(--muted)' }}>correct</span>
        </div>
        <h2 style={{ marginBottom: 8 }}>{pct >= 80 ? 'Excellent work! 🏆' : pct >= 60 ? 'Solid session 👍' : 'Keep at it 💪'}</h2>
        <p style={{ marginBottom: 8 }}>You got <strong>{totalRight} out of {totalQ}</strong> right today.</p>
        <p style={{ marginBottom: 22 }}>
          <strong style={{ color: topic?.color }}>{topic?.title}</strong> returns in <strong>{days} day{days !== 1 ? 's' : ''}</strong>.
        </p>
        {progress.streak > 1 && (
          <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
            <span className="streak">🔥 {progress.streak}-day streak!</span>
          </div>
        )}
        <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: '14px 18px', marginBottom: 22, textAlign: 'left' }}>
          <div className="label mb-8">Session breakdown</div>
          <div style={{ fontSize: '.9rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="flex justify-between"><span>⚡ Warm-up</span><strong>{warmupScore}/3</strong></div>
            <div className="flex justify-between"><span>✏️ Mini quiz</span><strong>{quizScore}/{quizTotal}</strong></div>
          </div>
        </div>
        <button className="btn btn-primary btn-full btn-lg" onClick={onComplete}>Finish session →</button>
      </div>
    </div>
  )
}

// ─── End screen ──────────────────────────────────────────────────────────────

function EndScreen({ topicId, results, savedData, onHome, onStart }) {
  const topic      = TOPICS.find(t => t.id === topicId)
  const currentIdx = TOPIC_IDS.indexOf(topicId)
  const nextId     = TOPIC_IDS[(currentIdx + 1) % TOPIC_IDS.length]
  const nextTopic  = TOPICS.find(t => t.id === nextId)
  const totalRight = (results.warmupScore || 0) + (results.quizScore || 0)
  const totalQ     = 3 + (results.quizTotal || 0)
  const pct        = totalQ > 0 ? Math.round((totalRight / totalQ) * 100) : 0

  return (
    <div className="page" style={{ justifyContent: 'center', alignItems: `center`, padding: '40px 18px' }}>
      <div className="container anim-pop" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🎉</div>
        <h2 style={{ marginBottom: 10 }}>Session complete!</h2>
        <p style={{ marginBottom: 6 }}>
          <strong>{topic?.title}</strong> — {pct}% correct. Come back tomorrow to keep your streak alive.
        </p>
        {savedData?.streak > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <span className="streak">🔥 {savedData.streak}-day streak!</span>
          </div>
        )}
        <hr className="divider" />
        {nextTopic && nextId !== topicId && (
          <div style={{ marginBottom: 22 }}>
            <div className="label mb-8">Next up</div>
            <div className="card-sm flex gap-12 items-center" style={{ textAlign: 'left' }}>
              <div className="topic-icon" style={{ background: nextTopic.colorLight, color: nextTopic.color }}>{nextTopic.icon}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{nextTopic.title}</div>
                <div style={{ fontSize: '.79rem', color: 'var(--muted)' }}>{nextTopic.subtitle}</div>
              </div>
            </div>
          </div>
        )}
        <div className="grid-stack">
          <button className="btn btn-primary btn-full" onClick={onHome}>Back to home</button>
          {nextTopic && nextId !== topicId && (
            <button className="btn btn-ghost btn-full" onClick={() => onStart(nextId)}>Start next topic now</button>
          )}
        </div>
      </div>
    </div>
  )
}
