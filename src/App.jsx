import { useEffect, useRef, useState } from 'react'
import { useAuth } from './auth/AuthContext.jsx'
import { MATHS_TOPIC_GROUPS, ALL_MATHS_QUESTIONS, FORMULA_SHEET, DIAGRAMS } from './data/mathsTopics.js'
import { BIOLOGY_GROUPS } from './data/biologyGroups.js'
import { CHEMISTRY_GROUPS } from './data/chemistryGroups.js'
import { ENGLISH_TOPIC_GROUPS, ALL_ENGLISH_QUESTIONS } from './data/englishTopics.js'
import { SOCIOLOGY_TOPIC_GROUPS, ALL_SOCIOLOGY_QUESTIONS } from './data/sociologyTopics.js'
import { CHEMISTRY_TOPIC_GROUPS, ALL_CHEMISTRY_QUESTIONS } from './data/chemistryTopics.js'
import { CHEM_IMAGES } from './data/chemImages.js'
import { FIGURES } from './figures.js'
import { TOPICS, TOPIC_DATA } from './content.js'
import { getProgress, saveSessionResult, getNextTopicId, daysUntil, saveSessionDraft, getSessionDraft, clearSessionDraft, recordActivity, recordScore, getImprovements } from './progress.js'
import { MODULES } from './modules.js'
import ModulePlayer, { getAllConfidenceRatings } from './ModulePlayer.jsx'

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

// ─── Google logo SVG ─────────────────────────────────────────────────────────

function GoogleLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

// ─── Splash screen ────────────────────────────────────────────────────────────

function SplashScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: '#08090D',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'riseIn 0.6s ease forwards',
    }}>
      <style>{`
        @keyframes riseIn { from { opacity: 0; transform: scale(0.94) } to { opacity: 1; transform: scale(1) } }
        @keyframes risePulse { 0%,100% { filter: drop-shadow(0 0 22px rgba(101,230,198,0.45)) } 50% { filter: drop-shadow(0 0 38px rgba(101,230,198,0.75)) } }
      `}</style>
      <img
        src="/logo.png" alt="RISE"
        style={{ width: 96, height: 96, objectFit: 'contain', animation: 'risePulse 1.8s ease-in-out infinite' }}
      />
    </div>
  )
}

// ─── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#08090D',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 28px',
      overflow: 'hidden',
    }}>
      {/* Ambient glow top */}
      <div style={{
        position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(101,230,198,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo — 28% from top */}
      <div style={{ flex: '0 0 auto', marginTop: 'max(72px, 28vh)' }}>
        <img
          src="/logo.png" alt="RISE"
          style={{ width: 80, height: 80, objectFit: 'contain', display: 'block',
            filter: 'drop-shadow(0 0 22px rgba(101,230,198,0.5))' }}
        />
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif",
        fontSize: 42, fontWeight: 700, color: '#F4EFE6',
        textAlign: 'center', lineHeight: 1.05, marginTop: 28, letterSpacing: '-0.02em',
      }}>
        Who will<br />you be?
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Google button */}
      {/* TODO: replace signInWithGoogle() in src/auth/authService.js with Firebase when ready */}
      <button
        onClick={signInWithGoogle}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          background: '#FFFFFF', border: 'none', borderRadius: 18, cursor: loading ? 'default' : 'pointer',
          height: 56, width: '100%', maxWidth: 340,
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 600, color: '#1A1A1A',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.12) inset',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 150ms ease, transform 120ms ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.015)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.985)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.015)' }}
      >
        {loading
          ? <span style={{ width: 20, height: 20, border: '2.5px solid #ccc', borderTopColor: '#555', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
          : <GoogleLogo size={22} />
        }
        {loading ? 'Signing in…' : 'Continue with Google'}
      </button>

      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 11, color: '#3A3835', marginTop: 18, marginBottom: 'max(32px, env(safe-area-inset-bottom))',
        textAlign: 'center', lineHeight: 1.5,
      }}>
        By continuing you agree to our Terms &amp; Privacy Policy
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ─── Onboarding — name entry ─────────────────────────────────────────────────

function OnboardingScreen() {
  const { completeOnboarding } = useAuth()
  const [name, setName] = useState('')
  const valid = name.trim().length >= 2

  function handleSubmit() {
    if (!valid) return
    completeOnboarding(name)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#08090D',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 28px',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(101,230,198,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ flex: '0 0 auto', marginTop: 'max(88px, 22vh)', width: '100%', maxWidth: 340 }}>
        <div style={{
          fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif",
          fontSize: 32, fontWeight: 700, color: '#F4EFE6',
          lineHeight: 1.15, marginBottom: 12, letterSpacing: '-0.01em',
        }}>
          What should<br />we call you?
        </div>
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 15, color: '#7A7670', lineHeight: 1.55, marginBottom: 36,
        }}>
          This helps personalise your revision journey.
        </div>

        {/* Glassmorphism input */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Your name"
          autoFocus
          maxLength={30}
          style={{
            width: '100%', height: 58, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '0 22px',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 500, color: '#F4EFE6',
            outline: 'none', caretColor: '#65E6C6',
            transition: 'border-color 180ms ease, box-shadow 180ms ease',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(101,230,198,0.45)'
            e.target.style.boxShadow = '0 0 0 3px rgba(101,230,198,0.08), inset 0 0 20px rgba(101,230,198,0.04)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(255,255,255,0.1)'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Fixed-bottom continue button */}
      <button
        onClick={handleSubmit}
        disabled={!valid}
        style={{
          width: '100%', maxWidth: 340, height: 54,
          background: valid ? 'linear-gradient(135deg, #3D7A5E 0%, #65E6C6 100%)' : 'rgba(255,255,255,0.07)',
          border: 'none', borderRadius: 16, cursor: valid ? 'pointer' : 'default',
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700,
          color: valid ? '#08090D' : '#3D3A35',
          transition: 'background 220ms ease, color 220ms ease, transform 120ms ease',
          letterSpacing: '0.02em', flexShrink: 0,
          marginBottom: 'max(36px, env(safe-area-inset-bottom))',
        }}
        onMouseEnter={e => { if (valid) e.currentTarget.style.transform = 'scale(1.015)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        Continue →
      </button>
    </div>
  )
}

// ─── Top-level router ────────────────────────────────────────────────────────

// ─── Bottom nav ──────────────────────────────────────────────────────────────

function NavIcon({ id, active }) {
  const c = active ? '#A855F7' : '#4B5563'
  const s = { stroke: c, fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const glow = active ? `drop-shadow(0 0 6px rgba(168,85,247,0.65))` : 'none'
  const props = { width: 22, height: 22, viewBox: '0 0 22 22', style: { display: 'block', filter: glow, transition: 'filter 220ms ease' } }
  if (id === 'home') return (
    <svg {...props}><path d="M3 9.5L11 3l8 6.5V19a1.5 1.5 0 01-1.5 1.5h-4V14h-5v6.5H4.5A1.5 1.5 0 013 19V9.5z" {...s} /></svg>
  )
  if (id === 'subjects') return (
    <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1.5" {...s} /><rect x="12" y="3" width="7" height="7" rx="1.5" {...s} /><rect x="3" y="12" width="7" height="7" rx="1.5" {...s} /><rect x="12" y="12" width="7" height="7" rx="1.5" {...s} /></svg>
  )
  if (id === 'pulse') return (
    <svg {...props}><polyline points="2,13 6,13 8,6 11,18 14,10 16,13 20,13" {...s} /></svg>
  )
  if (id === 'exams') return (
    <svg {...props}><rect x="4" y="2" width="14" height="18" rx="2" {...s} /><line x1="8" y1="7" x2="14" y2="7" {...s} /><line x1="8" y1="11" x2="14" y2="11" {...s} /><line x1="8" y1="15" x2="11" y2="15" {...s} /></svg>
  )
  return null
}

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'home',     label: 'Home' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'pulse',    label: 'Pulse' },
    { id: 'exams',    label: 'Exams' },
  ]

  return (
    <div style={{
      position: 'fixed', left: '50%', bottom: 14, transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: 400, zIndex: 1000,
      background: 'rgba(11,16,32,0.88)',
      backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
      border: '1px solid rgba(139,92,246,0.12)',
      borderRadius: 32,
      boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 32px rgba(139,92,246,0.08)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      padding: '10px 6px calc(10px + env(safe-area-inset-bottom))',
      gap: 4,
    }}>
      {tabs.map(t => {
        const active = tab === t.id
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            border: 'none', background: active ? 'rgba(139,92,246,0.18)' : 'transparent',
            cursor: 'pointer', borderRadius: 22,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: active ? 700 : 500,
            color: active ? '#C4B5FD' : '#374151',
            padding: '6px 4px 5px', minWidth: 0,
            transition: 'background 220ms ease, color 220ms ease',
            boxShadow: active ? '0 0 16px rgba(139,92,246,0.2)' : 'none',
          }}>
            <NavIcon id={t.id} active={active} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', letterSpacing: '0.01em' }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const { user, pendingAuth, signOut } = useAuth()
  const [showSplash, setShowSplash]   = useState(true)
  const [tab, setTab]                 = useState('home')
  const [view, setView]               = useState(null)   // 'module' | 'session' | 'end' — overlays
  const [topicId, setTopicId]         = useState(null)
  const [session, setSession]         = useState(null)
  const [startPhase, setStartPhase]   = useState(1)
  const [results, setResults]         = useState({})
  const [savedData, setSavedData]     = useState(null)
  const [progress, setProgress]       = useState(() => safeGetProgress())
  const [draft, setDraft]             = useState(() => safeGetDraft())
  const [activeModule, setActiveModule] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1400)
    return () => clearTimeout(t)
  }, [])

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

  // Splash → auth screens → overlays → tab shell
  if (showSplash) return <SplashScreen />
  if (!user?.loggedIn || !user?.onboardingComplete) {
    if (pendingAuth) return <OnboardingScreen />
    return <LoginScreen />
  }

  // Full-screen overlays take priority
  if (view === 'module' && activeModule) return <ModulePlayer module={activeModule} onBack={closeOverlay} />
  if (view === 'session' && session)     return <Session session={session} topicId={topicId} startPhase={startPhase} initialResults={results} onFinish={finishSession} onHome={closeOverlay} />
  if (view === 'end')                    return <EndScreen topicId={topicId} results={results} savedData={savedData} onHome={closeOverlay} onStart={startSession} />

  // Tab shell
  return (
    <div style={{ background: '#08090D', minHeight: '100vh' }}>
      {tab === 'home'     && <Home progress={progress} onStart={startSession} onOpenModule={openModule} onOpenSubjects={() => setTab('subjects')} />}
      {tab === 'subjects' && <ModulesTab onOpenModule={openModule} />}
      {tab === 'pulse'    && <TestTab mode="quickfire" onOpenModule={openModule} />}
      {tab === 'exams'    && <TestTab mode="exam" onOpenModule={openModule} />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}

// ─── Shared palette ──────────────────────────────────────────────────────────

const W = {
  bg:         '#070B1A',
  bgCard:     '#151720',
  border:     'rgba(255,255,255,0.1)',
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

function daysUntilExam() {
  const exam = new Date('2027-05-01')
  const today = new Date()
  today.setHours(0,0,0,0); exam.setHours(0,0,0,0)
  return Math.max(0, Math.round((exam - today) / 86400000))
}

function getTimeGreeting(name) {
  const h = new Date().getHours()
  if (h < 12) return `Good morning, ${name}.`
  if (h < 17) return `Good afternoon, ${name}.`
  return `Good evening, ${name}.`
}

function Home({ progress, onStart, onOpenModule, onOpenSubjects }) {
  const { user, signOut } = useAuth()
  const userName    = user?.name || 'you'
  const greeting    = getTimeGreeting(userName)
  const streak      = Math.max(progress.streak || 0, 8)
  const todayIdx    = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1 })()
  const dayLetters  = ['M','T','W','T','F','S','S']

  const medicineModule  = MODULES.find(m => m.id === 'mod1') || MODULES.find(m => m.subject === 'History')
  const medState        = medicineModule ? safeGetModuleState(medicineModule.id) : {}
  const medProgress     = medicineModule
    ? Math.min(100, Math.max(12, Math.round(((medState.screen || 0) / (medicineModule.screens?.length || 1)) * 100)))
    : 12

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse 90% 45% at 50% -5%, rgba(139,92,246,0.14) 0%, transparent 60%), #060816',
      paddingBottom: 120,
      overflowX: 'hidden',
    }}>
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '56px 20px 0' }}>

        {/* ── Greeting + Streak ── */}
        <div style={{ marginBottom: 32, position: 'relative' }}>

          {/* Sign-out avatar — top right */}
          <button
            onClick={signOut}
            title="Sign out"
            style={{
              position: 'absolute', top: 0, right: 0,
              width: 34, height: 34, borderRadius: '50%',
              border: '1.5px solid rgba(139,92,246,0.3)',
              background: 'rgba(139,92,246,0.1)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13, fontWeight: 700, color: '#C4B5FD',
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </button>

          {/* Greeting */}
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14, fontWeight: 600, color: '#D6A166',
            marginBottom: 8, letterSpacing: '0.01em',
          }}>
            {greeting}
          </div>

          {/* Streak row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{
              fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif",
              fontSize: 46, fontWeight: 700, color: '#F4EFE6', lineHeight: 1,
              letterSpacing: '-0.025em',
            }}>
              {streak} day streak
            </div>
            <div style={{ fontSize: 34, flexShrink: 0, filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.65))' }}>
              🔥
            </div>
          </div>

          {/* Sub text */}
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14, color: '#4B5563', marginBottom: 24,
          }}>
            You're building momentum.
          </div>

          {/* Day tracker */}
          <div style={{ display: 'flex', gap: 6 }}>
            {dayLetters.map((d, i) => {
              const done   = i < todayIdx
              const isToday = i === todayIdx
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: isToday ? 34 : 30, height: isToday ? 34 : 30,
                    borderRadius: '50%',
                    background: done ? 'rgba(45,212,191,0.12)' : isToday ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.03)',
                    border: done ? '1.5px solid rgba(45,212,191,0.35)' : isToday ? '1.5px solid rgba(139,92,246,0.45)' : '1.5px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: done ? '0 0 10px rgba(45,212,191,0.18)' : isToday ? '0 0 14px rgba(139,92,246,0.3)' : 'none',
                  }}>
                    <div style={{
                      width: done ? 8 : isToday ? 9 : 5, height: done ? 8 : isToday ? 9 : 5,
                      borderRadius: '50%',
                      background: done ? '#2DD4BF' : isToday ? '#8B5CF6' : 'rgba(255,255,255,0.12)',
                      boxShadow: done ? '0 0 8px rgba(45,212,191,0.8)' : isToday ? '0 0 10px rgba(139,92,246,0.9)' : 'none',
                    }} />
                  </div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
                    color: done ? '#2DD4BF' : isToday ? '#C4B5FD' : '#1F2937',
                  }}>
                    {d}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Continue Learning ── */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            color: '#374151', textTransform: 'uppercase', marginBottom: 12,
          }}>
            Continue Learning
          </div>

          <button
            onClick={() => medicineModule && onOpenModule(medicineModule)}
            style={{
              width: '100%', height: 240, border: 'none', padding: 0,
              cursor: medicineModule ? 'pointer' : 'default',
              borderRadius: 24, overflow: 'hidden', position: 'relative',
              background: '#0B1020', display: 'block',
              boxShadow: '0 10px 40px rgba(0,0,0,0.55)',
            }}
          >
            {/* Artwork */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/headers/history-medicine-through-time.png)',
              backgroundSize: 'cover', backgroundPosition: 'center right',
              filter: 'saturate(0.85) contrast(0.9)',
            }} />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, rgba(6,8,22,0.97) 0%, rgba(6,8,22,0.88) 38%, rgba(6,8,22,0.5) 62%, rgba(6,8,22,0.08) 100%)',
            }} />
            {/* Border ring */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 24, border: '1px solid rgba(255,255,255,0.07)' }} />

            {/* Text — left 50% */}
            <div style={{
              position: 'absolute', inset: 0, padding: '22px 20px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              maxWidth: '54%',
            }}>
              <div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                  color: '#D6A166', textTransform: 'uppercase', marginBottom: 10,
                }}>
                  History
                </div>
                <div style={{
                  fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif",
                  fontSize: 21, fontWeight: 700, color: '#F4EFE6', lineHeight: 1.2, marginBottom: 6,
                }}>
                  Medicine through Time
                </div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#6B7280' }}>
                  1250–present
                </div>
              </div>

              <div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden', marginBottom: 7 }}>
                  <div style={{
                    width: medProgress + '%', height: '100%', borderRadius: 99,
                    background: 'linear-gradient(90deg, #92400E, #D6A166)',
                    boxShadow: '0 0 8px rgba(214,161,102,0.5)',
                  }} />
                </div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#6B7280' }}>
                  {medProgress}% complete
                </div>
              </div>
            </div>

            {/* Continue button */}
            <div style={{
              position: 'absolute', bottom: 20, right: 18,
              background: 'rgba(214,161,102,0.14)',
              border: '1px solid rgba(214,161,102,0.28)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 12, padding: '9px 16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12, fontWeight: 700, color: '#D6A166',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              Continue <span style={{ fontSize: 15 }}>›</span>
            </div>
          </button>
        </div>

        {/* ── Weak Zone ── */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => onStart && medicineModule && onStart(medicineModule.id)}
            style={{
              width: '100%', border: 'none', padding: 0,
              cursor: 'pointer', borderRadius: 24, position: 'relative',
              background: 'transparent', textAlign: 'left', display: 'block',
            }}
          >
            {/* Ambient glow halo */}
            <div style={{
              position: 'absolute', inset: -1, borderRadius: 25,
              background: 'linear-gradient(135deg, rgba(251,113,133,0.2) 0%, rgba(139,92,246,0.15) 100%)',
              filter: 'blur(1.5px)', zIndex: 0,
            }} />

            <div style={{
              position: 'relative', zIndex: 1,
              background: 'rgba(17,24,39,0.72)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 24,
              border: '1px solid rgba(251,113,133,0.18)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
              padding: '18px 16px 18px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              {/* Brain icon */}
              <div style={{
                width: 66, height: 66, borderRadius: 18, flexShrink: 0, overflow: 'hidden',
                boxShadow: '0 0 22px rgba(45,212,191,0.35)',
              }}>
                <img src="/icons/brain-icon.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                  color: '#FB7185', textTransform: 'uppercase', marginBottom: 5,
                }}>
                  Weak Zone
                </div>
                <div style={{
                  fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif",
                  fontSize: 16, fontWeight: 700, color: '#F4EFE6', lineHeight: 1.2, marginBottom: 6,
                }}>
                  Medicine through Time
                </div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 12, color: '#9CA3AF', lineHeight: 1.5,
                }}>
                  2 quick quizzes to get this{' '}
                  <span style={{ color: '#2DD4BF', textShadow: '0 0 10px rgba(45,212,191,0.5)' }}>green</span> again.
                </div>
              </div>

              {/* Recover button */}
              <div style={{
                flexShrink: 0,
                background: 'rgba(139,92,246,0.14)',
                border: '1px solid rgba(139,92,246,0.28)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                borderRadius: 12, padding: '10px 12px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 11, fontWeight: 700, color: '#C4B5FD',
                lineHeight: 1.3, textAlign: 'center',
                boxShadow: '0 0 18px rgba(139,92,246,0.22)',
              }}>
                Recover<br />now <span style={{ fontSize: 13 }}>›</span>
              </div>
            </div>
          </button>
        </div>

        {/* ── This Week ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              color: '#374151', textTransform: 'uppercase',
            }}>
              This Week
            </div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12, fontWeight: 600, color: '#D6A166',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span>⭐</span> You're on track
            </div>
          </div>

          <div style={{
            background: 'rgba(17,24,39,0.72)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20, padding: '18px 8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          }}>
            {[
              { icon: '⏱', label: 'Study time', value: '4h 15m' },
              { icon: '🧠', label: 'Quizzes',    value: '18' },
              { icon: '⚡', label: 'Points',     value: '740' },
            ].map((s, i) => (
              <div key={s.label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ fontSize: 18, opacity: 0.75 }}>{s.icon}</div>
                <div style={{
                  fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif",
                  fontSize: 22, fontWeight: 700, color: '#F4EFE6', lineHeight: 1,
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 10, color: '#374151', fontWeight: 600,
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
// ─── Modules tab ──────────────────────────────────────────────────────────────

function ModuleCard({ title, subtitle, progress, accentColour, bgGradient, headerImage, icon, locked, isSelected, onClick }) {
  const w = isSelected ? 174 : 154
  const h = isSelected ? 235 : 215
  return (
    <button
      onClick={locked ? undefined : onClick}
      style={{
        width: w, height: h, flexShrink: 0, position: 'relative',
        borderRadius: 18, overflow: 'hidden',
        cursor: locked ? 'default' : 'pointer',
        border: isSelected ? `1.5px solid ${accentColour}` : '1px solid rgba(255,255,255,0.12)',
        background: bgGradient || '#0D0E10',
        padding: 0, textAlign: 'left',
        boxShadow: isSelected
          ? `0 0 30px ${accentColour}36, 0 12px 32px rgba(0,0,0,0.68), inset 0 1px 0 rgba(255,255,255,0.06)`
          : '0 4px 18px rgba(0,0,0,0.54), inset 0 1px 0 rgba(255,255,255,0.03)',
        opacity: locked ? 0.52 : 1,
      }}
    >
      {/* cinematic header image */}
      {headerImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${headerImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          filter: 'saturate(0.88) contrast(0.92)',
        }} />
      )}
      {/* bottom dark overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: headerImage
          ? 'linear-gradient(180deg, rgba(5,7,11,0.15) 0%, rgba(5,7,11,0.52) 45%, rgba(5,7,11,0.96) 100%)'
          : 'linear-gradient(180deg, rgba(5,7,11,0.04) 0%, rgba(5,7,11,0.44) 38%, rgba(5,7,11,0.90) 100%)',
      }} />
      {/* top-left icon circle */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 2,
        width: 48, height: 48, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'rgba(5,7,11,0.52)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem',
      }}>{icon}</div>
      {/* lock top-right */}
      {locked && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(5,7,11,0.68)', border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.75rem',
        }}>🔒</div>
      )}
      {/* bottom text */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 12px 12px', zIndex: 2 }}>
        <div style={{
          fontWeight: 700, fontSize: '.87rem', color: '#F5F2EA',
          lineHeight: 1.2, marginBottom: 2, fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>{title}</div>
        <div style={{
          fontSize: '.63rem', color: '#B8B4C2', lineHeight: 1.3,
          marginBottom: locked ? 0 : 8, fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>{subtitle}</div>
        {!locked && (
          <>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: '.6rem', fontWeight: 800, color: accentColour, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {progress}%
              </span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.10)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                width: progress + '%', height: '100%',
                background: accentColour, borderRadius: 99,
                boxShadow: `0 0 7px ${accentColour}99`,
              }} />
            </div>
          </>
        )}
      </div>
    </button>
  )
}

function SubjectSection({ heading, accent, modules, onModuleClick }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingLeft: 18, paddingRight: 18, marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: '.62rem', fontWeight: 800, letterSpacing: '.18em',
            textTransform: 'uppercase', color: '#F5F2EA',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>{heading}</span>
          <span style={{ color: accent, fontSize: '.82rem', lineHeight: 1 }}>›</span>
        </div>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '.72rem', fontWeight: 600, color: accent, padding: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>View all</button>
      </div>
      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto',
        paddingLeft: 18, paddingRight: 18, paddingBottom: 4,
        scrollbarWidth: 'none', msOverflowStyle: 'none',
        alignItems: 'flex-end',
      }}>
        {modules.map(mod => (
          <ModuleCard
            key={mod.id}
            title={mod.title}
            subtitle={mod.subtitle}
            progress={mod.progress}
            accentColour={mod.accent || accent}
            bgGradient={mod.bg}
            icon={mod.icon}
            locked={mod.locked}
            isSelected={mod.isSelected}
            onClick={() => onModuleClick && onModuleClick(mod)}
          />
        ))}
      </div>
    </div>
  )
}

function SubjectLogoSection({ subjectLabel, logoSrc, accent, groups, onGroupClick }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingLeft: 18, paddingRight: 18, marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={logoSrc} alt={subjectLabel} style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{
            fontSize: '.62rem', fontWeight: 800, letterSpacing: '.18em',
            textTransform: 'uppercase', color: '#F5F2EA',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>{subjectLabel}</span>
          <span style={{ color: accent, fontSize: '.82rem', lineHeight: 1 }}>›</span>
        </div>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '.72rem', fontWeight: 600, color: accent, padding: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>View all</button>
      </div>
      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto',
        paddingLeft: 18, paddingRight: 18, paddingBottom: 4,
        scrollbarWidth: 'none', msOverflowStyle: 'none',
        alignItems: 'flex-end',
      }}>
        {groups.map(group => (
          <ModuleCard
            key={group.id}
            title={group.title}
            subtitle={group.subtitle}
            progress={group.progress}
            accentColour={group.accent}
            headerImage={group.headerImage}
            bgGradient={group.bg}
            icon={group.icon}
            locked={group.locked}
            isSelected={group.isSelected}
            onClick={() => onGroupClick && onGroupClick(group)}
          />
        ))}
      </div>
    </div>
  )
}

function BiologySection({ groups, onGroupClick }) {
  return <SubjectLogoSection subjectLabel="Biology" logoSrc="/headers/bio-main.png" accent="#4F8A5B" groups={groups} onGroupClick={onGroupClick} />
}

function ModulesTab({ onOpenModule }) {
  function modPct(mod) {
    if (!mod || !mod.screens) return 0
    const s = safeGetModuleState(mod.id)
    const screen = s.screen || 0
    return Math.min(100, Math.round(((screen + 1) / mod.screens.length) * 100))
  }

  const histRaw = MODULES.filter(m => m.subject === 'History').slice(0, 4)
  const continueRaw = histRaw.find(m => { const p = modPct(m); return p > 0 && p < 100 }) || histRaw[2]
  const continuePct = modPct(continueRaw) || 64
  const selectedId = continueRaw?.id || 'mod3'

  const HIST_BG = [
    'radial-gradient(ellipse at 68% 35%, #3E1F06 0%, #1F0E03 52%, #0A0401 100%), linear-gradient(148deg, #0A0401 0%, #1C0E03 100%)',
    'radial-gradient(ellipse at 62% 42%, #081A1A 0%, #041010 52%, #020808 100%), linear-gradient(148deg, #020808 0%, #091A1A 100%)',
    'radial-gradient(ellipse at 65% 38%, #3C1B05 0%, #1D0D02 52%, #0D0602 100%), radial-gradient(ellipse at 20% 78%, rgba(92,44,12,0.18) 0%, transparent 50%), linear-gradient(148deg, #0D0602 0%, #1E0D03 100%)',
    'radial-gradient(ellipse at 50% 50%, #121018 0%, #0A0812 52%, #050509 100%), linear-gradient(148deg, #050509 0%, #0D0B12 100%)',
  ]
  const HIST_ICONS  = ['⚕️', '🦠', '🩺', '🔬']
  const HIST_ACCS   = ['#C89B6D', '#65E6C6', '#C89B6D', '#C89B6D']
  const HIST_DFLT   = [75, 38, 64, 0]

  const historyModules = histRaw.map((m, i) => {
    const pct = modPct(m)
    return {
      id: m.id, title: m.title, subtitle: m.subtitle,
      progress: pct > 0 ? pct : HIST_DFLT[i],
      icon: m.icon || HIST_ICONS[i],
      locked: i === 3, isSelected: m.id === selectedId,
      bg: HIST_BG[i], accent: HIST_ACCS[i],
    }
  })

  const englishModules = [
    { id: 'eng_macbeth',   title: 'Macbeth',           subtitle: 'Ambition & Guilt',        progress: 60, icon: '🗡️', locked: false, isSelected: false, bg: 'radial-gradient(ellipse at 65% 35%, #20003C 0%, #100020 52%, #080014 100%), linear-gradient(148deg, #080014 0%, #1A0030 100%)', accent: '#B66DFF' },
    { id: 'eng_inspector', title: 'Inspector Calls',    subtitle: 'Power & Responsibility',  progress: 40, icon: '🕵️', locked: false, isSelected: false, bg: 'radial-gradient(ellipse at 62% 42%, #0B0A2C 0%, #06041A 52%, #030214 100%), linear-gradient(148deg, #030214 0%, #0A0826 100%)', accent: '#B66DFF' },
    { id: 'eng_poetry',    title: 'Poetry Power',       subtitle: 'Structure & Meaning',     progress: 25, icon: '✍️', locked: false, isSelected: false, bg: 'radial-gradient(ellipse at 65% 40%, #0C0C36 0%, #05051E 52%, #030216 100%), linear-gradient(148deg, #030216 0%, #0B0B2A 100%)', accent: '#B66DFF' },
    { id: 'eng_lang1',     title: 'Language Paper 1',   subtitle: 'Reading Skills',          progress: 0,  icon: '📝', locked: true,  isSelected: false, bg: 'radial-gradient(ellipse at 50% 50%, #12121C 0%, #080810 52%, #04040A 100%), linear-gradient(148deg, #04040A 0%, #100E16 100%)', accent: '#B66DFF' },
  ]

  const sciRealMod = MODULES.find(m => m.id === 'sci_bio_w1')
  const sciPct = sciRealMod ? (modPct(sciRealMod) || 65) : 65
  const scienceModules = [
    { id: 'sci_bio_w1', title: 'Biology',        subtitle: 'Life & Living',        progress: sciPct, icon: '🧬', locked: false, isSelected: false, bg: 'radial-gradient(ellipse at 65% 35%, #041C12 0%, #020E08 52%, #010604 100%), linear-gradient(148deg, #010604 0%, #061A10 100%)', accent: '#65E6C6' },
    { id: 'sci_chem',   title: 'Chemistry',      subtitle: 'Reactions & Energy',   progress: 50,     icon: '⚗️', locked: false, isSelected: false, bg: 'radial-gradient(ellipse at 62% 42%, #04141A 0%, #020A10 52%, #010608 100%), linear-gradient(148deg, #010608 0%, #06141A 100%)', accent: '#65E6C6' },
    { id: 'sci_phys',   title: 'Physics',        subtitle: 'Forces & Motion',      progress: 35,     icon: '⚡', locked: false, isSelected: false, bg: 'radial-gradient(ellipse at 65% 40%, #040A24 0%, #020514 52%, #01030C 100%), linear-gradient(148deg, #01030C 0%, #060A20 100%)', accent: '#65E6C6' },
    { id: 'sci_triple', title: 'Triple Science', subtitle: 'Coming soon',          progress: 0,      icon: '🔭', locked: true,  isSelected: false, bg: 'radial-gradient(ellipse at 50% 50%, #0B0C16 0%, #060608 52%, #030306 100%), linear-gradient(148deg, #030306 0%, #09090E 100%)', accent: '#65E6C6' },
  ]

  function handleModuleClick(mod) {
    const realMod = MODULES.find(m => m.id === mod.id)
    if (realMod && onOpenModule) onOpenModule(realMod)
  }

  const biologyGroupCards = BIOLOGY_GROUPS.map(group => {
    const realMod = MODULES.find(m => m.id === group.id)
    const pct = realMod ? modPct(realMod) : 0
    return { id: group.id, title: group.title, subtitle: group.subtitle, icon: group.icon, accent: group.accent, headerImage: group.headerImage, progress: pct, locked: false, isSelected: false, bg: '#0D0E10' }
  })

  const chemGroupCards = CHEMISTRY_GROUPS.map(group => {
    const realMod = MODULES.find(m => m.id === group.id)
    const pct = realMod ? modPct(realMod) : 0
    return { id: group.id, title: group.title, subtitle: group.subtitle, icon: group.icon, accent: group.accent, headerImage: group.headerImage, progress: pct, locked: false, isSelected: false, bg: '#0D0E10' }
  })

  const heroBg = [
    'linear-gradient(90deg, #05070B 0%, rgba(5,7,11,0.92) 28%, rgba(5,7,11,0.40) 62%, rgba(5,7,11,0.08) 100%)',
    'radial-gradient(ellipse at 84% 62%, rgba(185,115,30,0.56) 0%, rgba(95,52,14,0.34) 30%, transparent 62%)',
    'radial-gradient(ellipse at 76% 26%, rgba(225,158,42,0.24) 0%, transparent 44%)',
    'radial-gradient(ellipse at 92% 48%, rgba(148,82,22,0.30) 0%, transparent 40%)',
    'linear-gradient(175deg, #0E0B05 0%, #13110A 42%, #1C1610 70%, #0F0E07 100%)',
  ].join(', ')

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', paddingBottom: 108, overflowX: 'hidden' }}>

      {/* ── HERO 260px ── */}
      <div style={{ height: 260, width: '100%', position: 'relative', background: heroBg, overflow: 'hidden' }}>
        {/* Warm column-silhouette suggestion layer */}
        <div style={{
          position: 'absolute', right: 0, top: 0, width: '55%', height: '100%', pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse at 80% 72%, rgba(210,148,50,0.10) 0%, transparent 42%)',
            'linear-gradient(0deg, rgba(5,7,11,0.52) 0%, transparent 55%)',
          ].join(', '),
        }} />

        {/* Header */}
        <div style={{
          padding: '18px 18px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', zIndex: 5,
        }}>
          {/* RISE logo */}
          <img
            src="/logo.png"
            alt="RISE"
            style={{ height: 36, width: 'auto', objectFit: 'contain' }}
          />
          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(11,16,24,0.72)', border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 99, padding: '5px 10px',
            }}>
              <span style={{ fontSize: '.88rem', lineHeight: 1 }}>🔥</span>
              <span style={{ color: '#F5F2EA', fontSize: '.78rem', fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>12</span>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(11,16,24,0.65)', border: '1px solid rgba(255,255,255,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem',
            }}>🔍</div>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
              border: '2px solid rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '.88rem', fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}>A</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ padding: '20px 18px 0', position: 'relative', zIndex: 5 }}>
          <div style={{ color: '#7D7988', fontSize: '.82rem', marginBottom: 7, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Good evening, Alex</div>
          <div style={{
            color: '#F5F2EA', fontWeight: 800, fontSize: '2.6rem',
            letterSpacing: '-.025em', lineHeight: 1.04, marginBottom: 8,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
          }}>Keep going.</div>
          <div style={{ color: '#B8B4C2', fontSize: '.88rem', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Small steps now. Big results later.
          </div>
        </div>
      </div>

      {/* ── CONTINUE LEARNING CARD (overlaps hero -48px) ── */}
      <div style={{ padding: '0 18px', marginTop: -48, position: 'relative', zIndex: 10 }}>
        <div style={{
          borderRadius: 22,
          border: '1px solid rgba(200,155,109,0.45)',
          background: [
            'linear-gradient(90deg, rgba(5,7,11,0.93) 0%, rgba(5,7,11,0.62) 55%, rgba(5,7,11,0.22) 100%)',
            'radial-gradient(ellipse at 72% 52%, rgba(140,90,58,0.48) 0%, rgba(70,38,16,0.22) 52%, transparent 78%)',
            'linear-gradient(148deg, #1C0E04 0%, #2C1808 55%, #110806 100%)',
          ].join(', '),
          padding: '20px 18px', position: 'relative', overflow: 'hidden', minHeight: 190,
        }}>
          {/* Medical icon top-right */}
          <div style={{
            position: 'absolute', top: 16, right: 16,
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(140,90,60,0.24)', border: '1px solid rgba(200,155,109,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.45rem',
          }}>⚕️</div>

          <div style={{ paddingRight: 62 }}>
            <div style={{
              fontSize: '.58rem', fontWeight: 800, letterSpacing: '.30em',
              textTransform: 'uppercase', color: '#C89B6D', marginBottom: 4,
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}>Continue Learning</div>
            <div style={{ fontSize: '.72rem', color: '#7D7988', marginBottom: 5, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {continueRaw?.subject || 'History'} · Module {continueRaw?.number || 3}
            </div>
            <div style={{
              color: '#F5F2EA', fontWeight: 700, fontSize: '1.12rem',
              lineHeight: 1.18, marginBottom: 3, fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}>{continueRaw?.title || 'Surgery & Anatomy'}</div>
            <div style={{ color: '#B8B4C2', fontSize: '.75rem', marginBottom: 14, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {continueRaw?.subtitle || 'Hold Him Down and Hope'}
            </div>
            {/* Progress */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '.6rem', color: '#C89B6D', fontWeight: 700, marginBottom: 5, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{continuePct}%</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.10)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: continuePct + '%', height: '100%', background: '#C89B6D', borderRadius: 99, boxShadow: '0 0 8px rgba(200,155,109,0.55)' }} />
              </div>
            </div>
            <button
              onClick={() => { const m = MODULES.find(x => x.id === selectedId); if (m && onOpenModule) onOpenModule(m) }}
              style={{
                height: 46, paddingLeft: 22, paddingRight: 22,
                background: 'linear-gradient(90deg, #8C5A3C, #C89B6D)',
                border: 'none', borderRadius: 99, cursor: 'pointer',
                color: '#fff', fontWeight: 700, fontSize: '.86rem',
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                boxShadow: '0 4px 18px rgba(140,90,60,0.42)',
                display: 'inline-flex', alignItems: 'center', gap: 7,
              }}>▶ Continue Module</button>
          </div>
        </div>
      </div>

      {/* ── WEAK AREA CARD ── */}
      <div style={{ padding: '14px 18px 0' }}>
        <div style={{
          borderRadius: 18, border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(11,16,24,0.90)',
          padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12, minHeight: 86,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,85,122,0.12)', border: '1px solid rgba(255,85,122,0.20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
          }}>🎯</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '.54rem', fontWeight: 800, letterSpacing: '.28em',
              textTransform: 'uppercase', color: '#FF557A', marginBottom: 3, fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}>Weak Area to Target</div>
            <div style={{ color: '#F5F2EA', fontWeight: 600, fontSize: '.82rem', marginBottom: 2, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Education needs reinforcement
            </div>
            <div style={{ color: '#7D7988', fontSize: '.72rem', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              You scored <span style={{ color: '#FF557A', fontWeight: 700 }}>42%</span> in this area
            </div>
          </div>
          <button style={{
            background: 'none', border: '1px solid rgba(255,85,122,0.40)',
            borderRadius: 99, padding: '7px 11px', cursor: 'pointer',
            color: '#FF6F8F', fontSize: '.7rem', fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans',sans-serif", flexShrink: 0, whiteSpace: 'nowrap',
          }}>Review now ›</button>
        </div>
      </div>

      {/* ── SUBJECT SECTIONS ── */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <SubjectSection heading="History" accent="#C89B6D" modules={historyModules} onModuleClick={handleModuleClick} />
        <SubjectSection heading="English" accent="#9E3D52" modules={englishModules} onModuleClick={handleModuleClick} />
        <BiologySection groups={biologyGroupCards} onGroupClick={handleModuleClick} />
        <SubjectLogoSection subjectLabel="Chemistry" logoSrc="/headers/chem-logo.png" accent="#9B59E8" groups={chemGroupCards} onGroupClick={handleModuleClick} />
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
            <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1.1rem', color:'#F5F7FB' }}>📐 AQA Formula Sheet</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.75rem', color:'#5A6480', marginTop:2 }}>These are given in the exam — but worth knowing them cold</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.08)', border:'1px solid #2A3552', borderRadius:8, padding:'6px 14px', color:'#9CA8C7', cursor:'pointer', fontFamily:'inherit', fontSize:'.82rem' }}>✕</button>
        </div>
        {FORMULA_SHEET.map(cat => (
          <div key={cat.section} style={{ marginBottom:18 }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#3B82FF', marginBottom:10 }}>{cat.section}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {cat.formulae.map(item => (
                <div key={item.name} style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.82rem', color:'#9CA8C7' }}>{item.name}</div>
                  <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F5F7FB', flexShrink:0 }}>{item.f}</div>
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
    <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'14px', marginBottom:14 }}>
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#3B82FF', marginBottom:8 }}>📐 Diagram — from AQA past paper</div>
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
      // Strip marks label — shown in badge already: [8 marks], [20 marks] etc
      if (/^\[\d+ marks?\]$/.test(t)) return false
      // Strip inline source attribution — shown in extract card instead
      if (/^\(Source:/i.test(t)) return false
      // Strip "You could include the writer's choice of:" — instruction noise
      if (/^You could include/i.test(t)) return false
      if (!isMC) return true
      // Strip embedded MC option lines: [ ] ... or [x] ...
      if (/^\[.{0,2}\]/.test(t)) return false
      // Strip lettered option lines: A. / B. / A) etc
      if (/^[A-D][.)]\s/.test(t)) return false
      // Strip MC instruction lines redundant with button UI
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
  // MC hint+retry state
  const [mcAttempts, setMcAttempts] = useState(0)
  const [mcHint, setMcHint]         = useState(false)   // show hint after 1st wrong MC
  const [mcLocked, setMcLocked]     = useState(false)   // lock after 2nd attempt or correct

  function reset() {
    setAnswer(''); setTip(false); setFB(null); setError(null); setGrading(false)
    setMcAttempts(0); setMcHint(false); setMcLocked(false)
  }

  async function grade() {
    const isMC = q.type === 'mc' || q.type === 'mc_multi'
    if (q.type === 'mc' && !answer) { setError('Pick an option first.'); return }
    if (q.type === 'mc_multi' && (!answer || (Array.isArray(answer) && answer.length === 0))) { setError('Select at least one option.'); return }
    if (!isMC && answer.trim().length < 1) { setError('Write something — even a rough attempt gets method marks!'); return }

    // MC: check inline without hitting the API
    if (isMC) {
      const isCorrect = q.type === 'mc'
        ? answer === q.options[q.correct]
        : Array.isArray(answer) && answer.length === q.marks &&
          answer.every(a => q.options.indexOf(a) !== -1 && q.correctIndices?.includes(q.options.indexOf(a)))
      const newAttempts = mcAttempts + 1
      setMcAttempts(newAttempts)
      if (isCorrect) {
        setMcLocked(true)
        setFB({ marksAwarded: q.marks, marksAvailable: q.marks, grade: 'Excellent',
          summary: 'Correct.', achieved: ['Right answer selected'], missed: [], examinerTip: q.ms || '' })
        recordScore({ subject: topicLabel.split(' ·')[0].split(' —')[0].trim(), earned: q.marks, possible: q.marks, source: 'test' })
      } else if (newAttempts === 1) {
        // First wrong — show hint, don't lock yet
        setMcHint(true)
        setAnswer('')  // clear selection so they can try again
      } else {
        // Second wrong — lock and show full explanation
        setMcLocked(true)
        const correctText = q.options[q.correct] || ''
        setFB({ marksAwarded: 0, marksAvailable: q.marks, grade: 'Needs Work',
          summary: 'The correct answer was: ' + correctText,
          achieved: [], missed: [q.ms || 'See mark scheme above'],
          examinerTip: 'Re-read the question carefully and look for key scientific terms.' })
        recordScore({ subject: topicLabel.split(' ·')[0].split(' —')[0].trim(), earned: 0, possible: q.marks, source: 'test' })
      }
      return
    }

    setGrading(true); setError(null)
    try {
      const result = await gradeWithAI(q.q, answer, q.marks, q.ms)
      setFB(result)
      // Record score for streak + improvement tracking
      if (result && result.marksAwarded !== undefined) {
        recordScore({
          subject: topicLabel.split(' ·')[0].split(' —')[0].trim(),
          earned: result.marksAwarded,
          possible: result.marksAvailable || q.marks,
          source: 'test',
        })
      }
    } catch (e) {
      setError('Could not reach the grading server. Check your connection and try again.')
    } finally {
      setGrading(false)
    }
  }

  const gs = feedback ? (GRADE_COLOURS[feedback.grade] || GRADE_COLOURS['Developing']) : null
  // Detect if this is a maths question (has M1/A1/B1 mark scheme) vs English/History (level-based)
  const isMathsQ = q.ms ? /\[M1|\[A1|\[B1|\[B2|\[B3/.test(q.ms) : false
  // Tips adapt based on whether this is maths or English/humanities
  const MARK_TIPS = isMathsQ ? {
    1: 'One specific correct answer. No working needed for 1 mark.',
    2: 'Show your method AND give the correct answer — both earn marks.',
    3: 'Show every step. Each line of working can earn a mark even if the final answer is wrong.',
    4: 'Full method with all steps shown clearly. Check your arithmetic at the end.',
    5: 'Five marks = five things to demonstrate. Show all working from start to finish.',
    6: 'Full method with sub-steps. Show all stages — do not skip steps.',
  } : {
    1: 'One clear, accurate point that directly answers the question.',
    2: 'Two separate, distinct points. Each must be a new idea — not the same point rephrased.',
    3: 'Three points OR one point with a well-developed explanation. Quote from the text.',
    4: 'Four separate points, OR two points each with a clear explanation and evidence.',
    6: 'Level of response: link your points together with evidence. Do not just list facts.',
    8: 'Use quotes, name techniques, explain effects. Aim for Level 3: "clear and relevant".',
    12: 'Analyse language choices in depth. Quote precisely, name the technique, explain the effect on the reader.',
    16: "Compare BOTH texts throughout. Link quotes to writer's methods and intentions.",
    20: 'Give your view first, then prove it. Engage critically with the statement — agree, disagree, or both.',
    40: 'Plan before you write. Strong opening, clear structure, ambitious vocabulary, accurate punctuation throughout.',
  }

  return (
    <div style={{ background:'#08090D', minHeight:'100vh', paddingBottom:90 }}>
      {fmOpen && <FormulaSheet onClose={() => setFm(false)} />}

      {/* Sticky header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'12px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <button onClick={() => { reset(); onBack() }} style={{ background:'none', border:'none', cursor:'pointer', color:'#5A6480', fontSize:'1.1rem', padding:0, flexShrink:0, lineHeight:1 }}>←</button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:topicColor, flexShrink:0, boxShadow:`0 0 6px ${topicColor}` }} />
                <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:topicColor }}>{topicLabel}</span>
              </div>
              <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.9rem', color:'#F5F7FB' }}>
                Q{q.qNum} · {q.source}
              </div>
            </div>
            {isMathsQ && (<div style={{ display:'flex', gap:6, flexShrink:0 }}>{isCalc
                      ? <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(56,210,122,.1)', border:'1px solid rgba(56,210,122,.25)', borderRadius:8, padding:'4px 10px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, color:'#38D27A' }}>🖩 Calculator OK</div>
                      : <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,200,87,.07)', border:'1px solid rgba(255,200,87,.18)', borderRadius:8, padding:'4px 10px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, color:'#FFC857' }}>✏️ No Calculator</div>
              }
              <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:8, padding:'4px 10px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, color:'#70B8FF', cursor:'pointer' }}>📐 Formulae</button>
            </div>)}
          </div>
          {/* Progress */}
          <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${((qIdx+1)/total)*100}%`, background:`linear-gradient(90deg,${topicColor}88,${topicColor})`, borderRadius:99, transition:'width .4s ease' }} />
          </div>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.62rem', color:'#4A5578', marginTop:5, textAlign:'right' }}>{qIdx+1} / {total}</div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px 20px' }}>
        {/* Marks badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:`${topicColor}18`, border:`1px solid ${topicColor}44`, borderRadius:99, padding:'4px 13px', marginBottom:14 }}>
          <span style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize:'.78rem', fontWeight:700, color:topicColor }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
        </div>

        {/* Diagram */}
        {q.diagramKey && <MathsDiagram diagramKey={q.diagramKey} />}


        {/* Source extract or reference */}
        {q.extract && (() => {
          const isRealExtract = q.extract.startsWith('Lines') || q.extract.startsWith('"')
          return (
            <div style={{ background:'#0D1424', borderLeft:`3px solid ${topicColor}`, borderRadius:'0 12px 12px 0', padding:'14px 16px', marginBottom:14 }}>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:topicColor, marginBottom:8 }}>
                {isRealExtract ? '📄 Source extract' : '📎 Where to find your source'}
              </div>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.88rem', lineHeight:1.7, margin:0, color: isRealExtract ? '#C8D0E8' : '#9CA8C7', whiteSpace:'pre-wrap' }}>{q.extract}</p>
            </div>
          )
        })()}

        {/* Question */}
        <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:16, padding:'18px 18px', marginBottom:14 }}>
          <pre style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1rem', lineHeight:1.7, margin:0, color:'#E0E6F0', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
        </div>

        {/* Mark tip */}
        {!showTip
          ? <button onClick={() => setTip(true)} style={{ background:'transparent', border:'1px dashed #2A3552', borderRadius:10, padding:'9px 14px', cursor:'pointer', color:'#4A5578', fontSize:'.82rem', fontFamily:"'Plus Jakarta Sans',sans-serif", width:'100%', marginBottom:14 }}>💡 {isMathsQ ? 'How many steps do I need to show?' : 'What does this question need from me?'}</button>
          : <div style={{ background:'rgba(255,200,87,.05)', border:'1px solid rgba(255,200,87,.18)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FFC857', marginBottom:5 }}>{isMathsQ ? `${q.marks}-mark question` : `${q.marks} marks — what to write`}</div>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", margin:0, fontSize:'.86rem', color:'#C8D0E8', lineHeight:1.55 }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
            </div>
        }

        {/* Answer area — only shown before feedback */}
        {!feedback && (
          q.type === 'mc' || q.type === 'mc_multi'
            ? <div style={{ marginBottom:16 }}>
                {q.type === 'mc_multi' && <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.75rem', color:'#5A6480', marginBottom:8 }}>Select all that apply ({q.marks} correct answers)</div>}
                {/* Hint card after first wrong MC attempt */}
                {mcHint && !mcLocked && (
                  <div style={{ background:'rgba(255,200,87,.06)', border:'1px solid rgba(255,200,87,.25)', borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
                    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#FFC857', marginBottom:6 }}>💡 Hint — think about this</div>
                    <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.87rem', color:'#C8D0E8', margin:0, lineHeight:1.55 }}>
                      {q.hint || (q.ms ? q.ms.split('.')[0] + '.' : 'Look at the question again carefully — what does it specifically ask for?')}
                    </p>
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {q.options.map((opt, i) => {
                  const isMulti = q.type === 'mc_multi'
                  const sel = isMulti ? (Array.isArray(answer) && answer.includes(opt)) : answer === opt
                  const toggle = () => {
                    if (mcLocked) return
                    if (!isMulti) { setAnswer(opt); return }
                    const cur = Array.isArray(answer) ? answer : []
                    setAnswer(sel ? cur.filter(a => a !== opt) : [...cur, opt])
                  }
                  return (
                    <button key={i} onClick={toggle} disabled={mcLocked} style={{ background:sel?`${topicColor}18`:'#151720', border:`1.5px solid ${sel?topicColor:'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'14px 16px', cursor:mcLocked?'default':'pointer', textAlign:'left', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.93rem', color:sel?topicColor:'#C8D0E8', transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ width:24, height:24, borderRadius:isMulti?'4px':'50%', border:`1.5px solid ${sel?topicColor:'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.75rem', fontWeight:700, color:sel?topicColor:'#4A5578', background:sel?`${topicColor}18`:'transparent' }}>{isMulti ? (sel ? '✓' : '') : String.fromCharCode(65+i)}</span>
                      {opt}
                    </button>
                  )
                })}
                </div>
              </div>
            : <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:14, padding:'14px', marginBottom:16 }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4A5578', marginBottom:8 }}>{isMathsQ ? 'Your working & answer' : 'Your answer'}</div>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder={isMathsQ ? (q.marks >= 3 ? 'Show all your working here…' : 'Write your answer…') : 'Write your answer here. Use quotes from the extract where relevant…'}
                  style={{ width:'100%', border:'none', background:'transparent', resize:'none', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.95rem', color:'#E0E6F0', lineHeight:1.7, outline:'none', minHeight: q.marks >= 4 ? 170 : q.marks >= 2 ? 110 : 65 }}
                />
              </div>
        )}

        {/* Error */}
        {error && <div style={{ background:'rgba(255,93,115,.08)', border:'1px solid rgba(255,93,115,.3)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}><p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", margin:0, fontSize:'.86rem', color:'#FF5D73', lineHeight:1.5 }}>{error}</p></div>}

        {/* Feedback */}
        {feedback && gs && (
          <div className="fade-up">
            {/* Score card */}
            <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:18, padding:'20px', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize:'2rem', fontWeight:800, color:gs.text, lineHeight:1 }}>
                  {feedback.marksAwarded}<span style={{ fontSize:'1.1rem', opacity:.5 }}>/{feedback.marksAvailable}</span>
                </div>
                <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.8rem' }}>{feedback.grade}</div>
              </div>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.9rem', color:gs.text, margin:0, lineHeight:1.55, opacity:.9 }}>{feedback.summary}</p>
            </div>

            {/* What they got right */}
            {feedback.achieved?.length > 0 && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4DFF88', marginBottom:10 }}>✓ What you got right</div>
                {feedback.achieved.map((a,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.achieved.length-1?8:0 }}>
                    <span style={{ color:'#4DFF88', flexShrink:0, fontSize:'.9rem' }}>✓</span>
                    <p style={{ margin:0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* What they missed */}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FF5D73', marginBottom:10 }}>→ Next time, also include</div>
                {feedback.missed.map((m,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.missed.length-1?8:0 }}>
                    <span style={{ color:'#FF5D73', flexShrink:0, fontSize:'.9rem' }}>→</span>
                    <p style={{ margin:0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{m}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Examiner tip */}
            {feedback.examinerTip && (
              <div style={{ background:'rgba(245,183,0,.05)', border:'1px solid rgba(245,183,0,.18)', borderRadius:13, padding:'14px', marginBottom:16 }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:6 }}>🗡️ Examiner tip</div>
                <p style={{ margin:0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{feedback.examinerTip}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <button onClick={reset} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:13, padding:'14px', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, cursor:'pointer', color:'#9CA8C7', fontSize:'.88rem' }}>↩ Try again</button>
              <button onClick={onNext} style={{ background:`linear-gradient(135deg,${topicColor}cc,${topicColor})`, border:'none', borderRadius:13, padding:'14px', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, cursor:'pointer', color:'#fff', fontSize:'.88rem', boxShadow:`0 4px 16px ${topicColor}44` }}>
                {qIdx < total-1 ? 'Next →' : 'Finish ✓'}
              </button>
            </div>
          </div>
        )}

        {/* Submit button — hidden for locked MC (feedback already shown inline) */}
        {!feedback && !(mcLocked) && (
          <button onClick={grade} disabled={grading || (q.type === 'mc' && !answer) || (q.type === 'mc_multi' && (!answer || answer.length === 0))}
            style={{ width:'100%', background:grading?'rgba(255,255,255,0.08)':`linear-gradient(135deg,${topicColor}cc,${topicColor})`, color:grading?'#4A5578':'#fff', border:'none', borderRadius:13, padding:'16px', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, cursor:(grading||(q.type==='mc'&&!answer))?'default':'pointer', fontSize:'1rem', letterSpacing:'.01em', marginTop:4, boxShadow:grading?'none':`0 4px 20px ${topicColor}44`, transition:'all .2s',
              opacity: (q.type === 'mc' && !answer) ? 0.4 : 1 }}>
            {grading ? '⏳ Marking your answer…' : mcHint ? 'Check again →' : 'Check my answer →'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Topic question list ──────────────────────────────────────────────────────
function MathsTopicView({ group, onBack }) {
  const [qIdx, setQIdx] = useState(0)
  const qs = group.questions
  // Go straight into the question — no intermediate list screen
  return (
    <MathsQuestion
      key={qIdx}
      q={qs[qIdx]} qIdx={qIdx} total={qs.length}
      topicLabel={group.label} topicColor={group.color} isCalc={group.calculator}
      onBack={onBack}
      onNext={() => { const n=qIdx+1; if(n<qs.length){setQIdx(n);window.scrollTo({top:0,behavior:'smooth'})}else onBack() }}
    />
  )
}

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
    <div style={{ background:'#08090D', minHeight:'100vh', paddingBottom:90 }}>
      {fmOpen && <FormulaSheet onClose={() => setFm(false)} />}

      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'14px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#5A6480', fontSize:'1.1rem', padding:0, flexShrink:0 }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1rem', color:'#F5F7FB' }}>AQA Maths — Topics</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.72rem', color:'#5A6480' }}>{MATHS_TOPIC_GROUPS.length} topics · {totalQs} questions · AI marked</div>
          </div>
          <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:10, padding:'7px 12px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.73rem', fontWeight:700, color:'#70B8FF', cursor:'pointer', flexShrink:0 }}>📐 Formulae</button>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {[
            { id:'all',      label:`All (${totalQs})` },
            { id:'noncalc',  label:'✏️ No Calculator' },
            { id:'calc',     label:'🖩 Calculator allowed' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(59,130,255,.15)':'#151720', border:`1px solid ${filter===f.id?'#3B82FF':'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'9px 6px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.75rem', fontWeight:600, color:filter===f.id?'#70B8FF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

        {/* Topic grid */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background:'#151720', border:`1px solid #1E2A40`, borderRadius:16, padding:'16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, transition:'border-color .15s, transform .12s', width:'100%' }}>
              {/* Icon */}
              <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, background:group.bg, border:`1px solid ${group.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:'1rem', color:group.color }}>
                {group.icon}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  {/* Mini progress-style pill */}
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:'0%', background:group.color, borderRadius:99 }} />
                  </div>
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.68rem', fontWeight:600, color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  {group.calculator
                    ? <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', color:'#38D27A', flexShrink:0 }}>🖩</span>
                    : <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', color:'#FFC857', flexShrink:0 }}>✗</span>
                  }
                </div>
              </div>

              <span style={{ color:'rgba(255,255,255,0.1)', fontSize:'1.1rem', flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── English topic view ───────────────────────────────────────────────────────
function EnglishTopicView({ group, onBack }) {
  const [qIdx, setQIdx] = useState(0)
  const qs = group.questions
  // Go straight into the question — no list, no picker
  return (
    <MathsQuestion
      key={qIdx}
      q={qs[qIdx]}
      qIdx={qIdx} total={qs.length}
      topicLabel={group.label} topicColor={group.color} isCalc={false}
      onBack={onBack}
      onNext={() => { const n=qIdx+1; if(n<qs.length){setQIdx(n);window.scrollTo({top:0,behavior:'smooth'})}else onBack() }}
    />
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
    <div style={{ background:'#08090D', minHeight:'100vh', paddingBottom:90 }}>
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'14px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#5A6480', fontSize:'1.1rem', padding:0, flexShrink:0 }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1rem', color:'#F5F7FB' }}>AQA English Language</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.72rem', color:'#5A6480' }}>Papers 1 & 2 · {ENGLISH_TOPIC_GROUPS.length} skill areas · {totalQs} questions · AI marked</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(157,92,255,.15)':'#151720', border:`1px solid ${filter===f.id?'#9D5CFF':'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'9px 6px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.75rem', fontWeight:600, color:filter===f.id?'#C18CFF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

        {/* Topic cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:16, padding:'16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, width:'100%' }}>
              <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, background:group.bg, border:`1px solid ${group.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:group.color, fontWeight:800 }}>
                {group.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.93rem', color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.08)', borderRadius:99 }} />
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.68rem', fontWeight:600, color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', color:'#4A5578', flexShrink:0 }}>{group.marks}m</span>
                </div>
              </div>
              <span style={{ color:'rgba(255,255,255,0.1)', fontSize:'1.1rem', flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sociology topic view ─────────────────────────────────────────────────────
function SociologyTopicView({ group, onBack }) {
  const [qIdx, setQIdx] = useState(0)
  const qs = group.questions
  return (
    <MathsQuestion
      key={qIdx}
      q={qs[qIdx]}
      qIdx={qIdx} total={qs.length}
      topicLabel={group.label} topicColor={group.color} isCalc={false}
      onBack={onBack}
      onNext={() => { const n=qIdx+1; if(n<qs.length){setQIdx(n);window.scrollTo({top:0,behavior:'smooth'})}else onBack() }}
    />
  )
}

// ─── Sociology browser ────────────────────────────────────────────────────────
function SociologyBrowser({ onBack }) {
  const [activeGroup, setGroup] = useState(null)
  const [filter, setFilter]     = useState('all')

  if (activeGroup) return <SociologyTopicView group={activeGroup} onBack={() => setGroup(null)} />

  const totalQs = SOCIOLOGY_TOPIC_GROUPS.reduce((s, g) => s + g.questions.length, 0)
  const filters = [
    { id: 'all', label: `All (${totalQs})` },
    { id: 'p1',  label: 'Paper 1' },
    { id: 'p2',  label: 'Paper 2' },
  ]
  const filtered = filter === 'all' ? SOCIOLOGY_TOPIC_GROUPS
    : filter === 'p1' ? SOCIOLOGY_TOPIC_GROUPS.filter(g => g.paper === 'Paper 1')
    : SOCIOLOGY_TOPIC_GROUPS.filter(g => g.paper === 'Paper 2')

  const SC = { color: '#FF5C7A', border: 'rgba(255,92,122,.28)' }

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(8,12,26,.97)', borderBottom: '1px solid #1E2A40', backdropFilter: 'blur(14px)', padding: '14px 16px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A6480', fontSize: '1.1rem', padding: 0, flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F5F7FB' }}>AQA Sociology</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.72rem', color: '#5A6480' }}>
              Papers 1 & 2 · {SOCIOLOGY_TOPIC_GROUPS.length} topic areas · {totalQs} questions · AI marked
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flex: 1, background: filter === f.id ? 'rgba(255,92,122,.15)' : '#151720',
              border: `1px solid ${filter === f.id ? '#FF5C7A' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10, padding: '9px 6px',
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.75rem', fontWeight: 600,
              color: filter === f.id ? '#FF8DA1' : '#5A6480', cursor: 'pointer',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Topic cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{
              background: '#151720', border: '1px solid #1E2A40',
              borderRadius: 16, padding: '16px', cursor: 'pointer',
              textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, width: '100%',
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                background: group.bg, border: `1px solid ${group.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              }}>{group.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '.93rem', color: '#F5F7FB', marginBottom: 3 }}>{group.label}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.75rem', color: '#5A6480', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }} />
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.68rem', fontWeight: 600, color: group.color, flexShrink: 0 }}>{group.questions.length} Q{group.questions.length !== 1 ? 's' : ''}</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.65rem', color: '#4A5578', flexShrink: 0 }}>{group.marks}m</span>
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.1rem', flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}





// ─── Chemistry image renderer ─────────────────────────────────────────────────
function ChemImage({ imageKey, caption }) {
  const src = CHEM_IMAGES[imageKey]
  if (!src) return null
  return (
    <div style={{ background: '#0D1424', border: '1px solid #1E2A40', borderRadius: 12, padding: '10px', marginBottom: 14 }}>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#38D27A', marginBottom: 8 }}>
        📐 Diagram — from AQA past paper
      </div>
      <img src={src} alt={caption || 'AQA Chemistry diagram'} style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
    </div>
  )
}

// ─── Chemistry topic view ─────────────────────────────────────────────────────
function ChemistryTopicView({ group, onBack, qIdx: initialQIdx = 0, onQChange }) {
  const [qIdx, setQIdx] = useState(initialQIdx)
  const qs = group.questions

  // Wrap MathsQuestion but inject image rendering
  // We pass imageKey via q.imageKey — MathsQuestion already handles extract/diagram rendering
  // but Chemistry needs the CHEM_IMAGES lookup, so we use a thin wrapper
  const q = qs[qIdx]
  const [answer, setAnswer]   = useState('')
  const [showTip, setTip]     = useState(false)
  const [grading, setGrading] = useState(false)
  const [feedback, setFB]     = useState(null)
  const [error, setError]     = useState(null)

  function reset() { setAnswer(''); setTip(false); setFB(null); setError(null); setGrading(false) }
  function next()  { const n=qIdx+1; if(n<qs.length){ setQIdx(n); if(onQChange) onQChange(n); reset(); window.scrollTo({top:0,behavior:'smooth'}) } else { reset(); onBack() } }

  async function grade() {
    if (q.type === 'mc' && !answer) { setError('Select an option first.'); return }
    if (q.type !== 'mc' && !answer.trim()) { setError('Write something — even a rough attempt earns method marks.'); return }
    setGrading(true); setError(null)
    try {
      const result = await gradeWithAI(q.q, answer, q.marks, q.ms)
      setFB(result)
      if (result?.marksAwarded !== undefined) {
        recordScore({ subject: 'Chemistry', earned: result.marksAwarded, possible: result.marksAvailable || q.marks, source: 'test' })
      }
    } catch { setError('Could not reach the grading server. Check your connection.') }
    finally { setGrading(false) }
  }

  const gs = feedback ? (GRADE_COLOURS[feedback.grade] || GRADE_COLOURS['Developing']) : null
  const color = group.color
  const CHEM_TIPS = {
    1: 'One specific correct answer. No working needed.',
    2: 'Two points OR method + correct answer. Show any calculation.',
    3: 'Three separate marks — show each step or point clearly.',
    4: 'Show all working. Each correct step earns a mark even if final answer is wrong.',
  }

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(8,12,26,.97)', borderBottom: '1px solid #1E2A40', backdropFilter: 'blur(14px)', padding: '12px 16px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A6480', fontSize: '1.1rem', padding: 0, flexShrink: 0, lineHeight: 1 }}>←</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color }}>Chemistry · {group.label}</span>
              </div>
              <div style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#F5F7FB' }}>
                {q.source} · {q.marks} mark{q.marks !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {group.calculator
                ? <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(56,210,122,.1)', border:'1px solid rgba(56,210,122,.25)', borderRadius:8, padding:'4px 10px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, color:'#38D27A' }}><span style={{fontSize:'.8rem'}}>🖩</span>Calculator OK</div>
                : <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,200,87,.07)', border:'1px solid rgba(255,200,87,.18)', borderRadius:8, padding:'4px 10px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, color:'#FFC857' }}><span style={{fontSize:'.8rem'}}>✏️</span>No Calculator</div>
              }
            </div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((qIdx+1)/qs.length)*100}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 99, transition: 'width .4s' }} />
          </div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.62rem', color: '#4A5578', marginTop: 5, textAlign: 'right' }}>{qIdx+1} / {qs.length}</div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px 20px' }}>
        {/* Marks badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 99, padding: '4px 13px', marginBottom: 14 }}>
          <span style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontSize: '.78rem', fontWeight: 700, color }}>[{q.marks} mark{q.marks !== 1 ? 's' : ''}]</span>
        </div>

        {/* Chemistry diagram image */}
        {q.imageKey && <ChemImage imageKey={q.imageKey} />}

        {/* Question */}
        <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 16, padding: '18px', marginBottom: 14 }}>
          <pre style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1rem', lineHeight: 1.7, margin: 0, color: '#E0E6F0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{q.q}</pre>
        </div>

        {/* Skill tip */}
        {!showTip
          ? <button onClick={() => setTip(true)} style={{ background: 'transparent', border: '1px dashed #2A3552', borderRadius: 10, padding: '9px 14px', cursor: 'pointer', color: '#4A5578', fontSize: '.82rem', fontFamily: "'Plus Jakarta Sans',sans-serif", width: '100%', marginBottom: 14 }}>💡 How many marks do I need to earn?</button>
          : <div style={{ background: 'rgba(255,200,87,.05)', border: '1px solid rgba(255,200,87,.18)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#FFC857', marginBottom: 5 }}>{q.marks}-mark question</div>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", margin: 0, fontSize: '.86rem', color: '#C8D0E8', lineHeight: 1.55 }}>{CHEM_TIPS[q.marks] || CHEM_TIPS[4]}</p>
            </div>
        }

        {/* Answer — MC or written */}
        {!feedback && (
          (q.type === 'mc' || q.type === 'mc_multi')
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswer(opt)} style={{ background: answer === opt ? `${color}18` : '#151720', border: `1.5px solid ${answer === opt ? color : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.93rem', color: answer === opt ? color : '#C8D0E8', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${answer === opt ? color : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.72rem', fontWeight: 700, color: answer === opt ? color : '#4A5578', background: answer === opt ? `${color}18` : 'transparent' }}>{String.fromCharCode(65+i)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            : <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 14, padding: '14px', marginBottom: 16 }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#4A5578', marginBottom: 8 }}>Your answer</div>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Write your answer here. Show any working…" style={{ width: '100%', border: 'none', background: 'transparent', resize: 'none', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.95rem', color: '#E0E6F0', lineHeight: 1.7, outline: 'none', minHeight: q.marks >= 4 ? 160 : q.marks >= 2 ? 100 : 65 }} />
              </div>
        )}

        {/* Error */}
        {error && <div style={{ background: 'rgba(255,93,115,.08)', border: '1px solid rgba(255,93,115,.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}><p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", margin: 0, fontSize: '.86rem', color: '#FF5D73' }}>{error}</p></div>}

        {/* Feedback */}
        {feedback && gs && (
          <div className="fade-up">
            <div style={{ background: gs.bg, border: `2px solid ${gs.border}`, borderRadius: 18, padding: '20px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontSize: '2rem', fontWeight: 800, color: gs.text, lineHeight: 1 }}>{feedback.marksAwarded}<span style={{ fontSize: '1.1rem', opacity: .5 }}>/{feedback.marksAvailable}</span></div>
                <div style={{ background: gs.badge, color: '#000', borderRadius: 99, padding: '5px 14px', fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '.8rem' }}>{feedback.grade}</div>
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.9rem', color: gs.text, margin: 0, lineHeight: 1.55, opacity: .9 }}>{feedback.summary}</p>
            </div>
            {feedback.achieved?.length > 0 && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#4DFF88', marginBottom: 10 }}>✓ What you got right</div>{feedback.achieved.map((a,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#4DFF88', flexShrink: 0 }}>✓</span><p style={{ margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.88rem', color: '#C8D0E8', lineHeight: 1.55 }}>{a}</p></div>)}</div>}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#FF5D73', marginBottom: 10 }}>→ Next time, also include</div>{feedback.missed.map((m,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#FF5D73', flexShrink: 0 }}>→</span><p style={{ margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.88rem', color: '#C8D0E8', lineHeight: 1.55 }}>{m}</p></div>)}</div>}
            {feedback.examinerTip && <div style={{ background: 'rgba(245,183,0,.05)', border: '1px solid rgba(245,183,0,.18)', borderRadius: 13, padding: '14px', marginBottom: 16 }}><div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#F5B700', marginBottom: 6 }}>🗡️ Examiner tip</div><p style={{ margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.88rem', color: '#C8D0E8', lineHeight: 1.55 }}>{feedback.examinerTip}</p></div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={reset} style={{ background: '#151720', border: '1px solid #2A3552', borderRadius: 13, padding: '14px', fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, cursor: 'pointer', color: '#9CA8C7', fontSize: '.88rem' }}>↩ Try again</button>
              <button onClick={next} style={{ background: `linear-gradient(135deg, ${color}cc, ${color})`, border: 'none', borderRadius: 13, padding: '14px', fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, cursor: 'pointer', color: '#fff', fontSize: '.88rem', boxShadow: `0 4px 16px ${color}44` }}>{qIdx < qs.length-1 ? 'Next →' : 'Finish ✓'}</button>
            </div>
          </div>
        )}

        {/* Submit */}
        {!feedback && (
          <button onClick={grade} disabled={grading} style={{ width: '100%', background: grading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${color}cc, ${color})`, color: grading ? '#4A5578' : '#fff', border: 'none', borderRadius: 13, padding: '16px', fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, cursor: grading ? 'default' : 'pointer', fontSize: '1rem', marginTop: 4, boxShadow: grading ? 'none' : `0 4px 20px ${color}44`, transition: 'all .2s' }}>
            {grading ? '⏳ Marking your answer…' : 'Check my answer →'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Chemistry browser ────────────────────────────────────────────────────────
function ChemistryBrowser({ onBack }) {
  const [activeGroup, setGroup] = useState(null)
  const [filter, setFilter]     = useState('all')
  const [chemQIdx, setChemQIdx] = useState(0)

  if (activeGroup) return <ChemistryTopicView key={chemQIdx} group={activeGroup} qIdx={chemQIdx} onQChange={setChemQIdx} onBack={() => { setGroup(null); setChemQIdx(0) }} />

  const totalQs = CHEMISTRY_TOPIC_GROUPS.reduce((s, g) => s + g.questions.length, 0)
  const filters = [
    { id: 'all',    label: `All (${totalQs})` },
    { id: 'p1',     label: 'Paper 1' },
    { id: 'p2',     label: 'Paper 2' },
    { id: 'calc',   label: '🖩 Calculator' },
  ]
  const filtered = filter === 'all'  ? CHEMISTRY_TOPIC_GROUPS
    : filter === 'p1'   ? CHEMISTRY_TOPIC_GROUPS.filter(g => g.paper.includes('1'))
    : filter === 'p2'   ? CHEMISTRY_TOPIC_GROUPS.filter(g => g.paper.includes('2'))
    : CHEMISTRY_TOPIC_GROUPS.filter(g => g.calculator)

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(8,12,26,.97)', borderBottom: '1px solid #1E2A40', backdropFilter: 'blur(14px)', padding: '14px 16px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A6480', fontSize: '1.1rem', padding: 0, flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F5F7FB' }}>AQA Chemistry Foundation</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.72rem', color: '#5A6480' }}>Papers 1 & 2 · {CHEMISTRY_TOPIC_GROUPS.length} topics · {totalQs} questions · AI marked · Diagrams included</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex: 1, background: filter === f.id ? 'rgba(56,210,122,.15)' : '#151720', border: `1px solid ${filter === f.id ? '#38D27A' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '9px 6px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.73rem', fontWeight: 600, color: filter === f.id ? '#38D27A' : '#5A6480', cursor: 'pointer' }}>{f.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 16, padding: '16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: group.bg, border: `1px solid ${group.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{group.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '.93rem', color: '#F5F7FB', marginBottom: 3 }}>{group.label}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.75rem', color: '#5A6480', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }} />
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.68rem', fontWeight: 600, color: group.color, flexShrink: 0 }}>{group.questions.length} Q{group.questions.length !== 1 ? 's' : ''}</span>
                  <span style={{ background: group.calculator ? 'rgba(56,210,122,.12)' : 'rgba(255,200,87,.08)', border: group.calculator ? '1px solid rgba(56,210,122,.25)' : '1px solid rgba(255,200,87,.2)', borderRadius:6, padding:'2px 8px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.6rem', fontWeight:700, color: group.calculator ? '#38D27A' : '#FFC857', flexShrink:0 }}>{group.calculator ? '🖩 Calc OK' : '✏️ No Calc'}</span>
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.1rem', flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}



const QUICK_FIRE_QUESTIONS = [
  { q: 'What theory said bad smells caused disease?', options: ['Miasma', 'Germ theory', 'Four humours', 'Natural selection'], correct: 0, subject: 'History', topic: 'Medieval Medicine', moduleId: 'mod1', ms: 'Miasma was the belief that bad air or smells caused disease.' },
  { q: 'Who proved blood circulates around the body?', options: ['William Harvey', 'Edward Jenner', 'Louis Pasteur', 'Robert Koch'], correct: 0, subject: 'History', topic: 'Renaissance Medicine', moduleId: 'mod2', ms: 'William Harvey published his ideas about blood circulation in 1628.' },
  { q: 'Which scientist developed germ theory?', options: ['Louis Pasteur', 'Galen', 'Vesalius', 'Florence Nightingale'], correct: 0, subject: 'History', topic: 'Germ Theory', moduleId: 'mod4', ms: 'Louis Pasteur showed that germs cause decay and disease.' },
  { q: 'What did Jenner create a vaccine for?', options: ['Smallpox', 'Cholera', 'Tuberculosis', 'Typhoid'], correct: 0, subject: 'History', topic: 'Vaccination', moduleId: 'mod4', ms: 'Edward Jenner developed vaccination against smallpox.' },
  { q: 'What did Lister use as an antiseptic?', options: ['Carbolic acid', 'Penicillin', 'Ether', 'Aspirin'], correct: 0, subject: 'History', topic: 'Surgery & Anatomy', moduleId: 'mod3', ms: 'Joseph Lister used carbolic acid to reduce infection in surgery.' },
  { q: 'Who discovered penicillin?', options: ['Alexander Fleming', 'Robert Koch', 'James Simpson', 'John Snow'], correct: 0, subject: 'History', topic: 'Modern Medicine', moduleId: 'mod4', ms: 'Alexander Fleming discovered penicillin in 1928.' },
  { q: 'What did John Snow remove in 1854?', options: ['A pump handle', 'A hospital ward', 'A sewer pipe', 'A microscope lens'], correct: 0, subject: 'History', topic: 'Public Health', moduleId: 'mod5', ms: 'John Snow removed the Broad Street pump handle during a cholera outbreak.' },
  { q: 'Which war helped plastic surgery develop?', options: ['First World War', 'Crimean War', 'Vietnam War', 'English Civil War'], correct: 0, subject: 'History', topic: 'Modern Surgery', moduleId: 'mod3', ms: 'The First World War created a need for reconstructive plastic surgery.' },
  { q: 'Which organ pumps blood?', options: ['Heart', 'Liver', 'Lung', 'Kidney'], correct: 0, subject: 'Biology', topic: 'Circulation', moduleId: null, ms: 'The heart pumps blood around the body.' },
  { q: 'What is the control centre of a cell?', options: ['Nucleus', 'Ribosome', 'Cell wall', 'Cytoplasm'], correct: 0, subject: 'Biology', topic: 'Cells', moduleId: 'sci_bio_w1', ms: 'The nucleus contains genetic material and controls cell activities.' },
  { q: 'What process moves water through a membrane?', options: ['Osmosis', 'Diffusion', 'Respiration', 'Transpiration'], correct: 0, subject: 'Biology', topic: 'Osmosis', moduleId: 'sci_bio_w1', ms: 'Osmosis is the movement of water through a partially permeable membrane.' },
  { q: 'What gas do plants take in for photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correct: 0, subject: 'Biology', topic: 'Photosynthesis', moduleId: 'sci_bio_w1', ms: 'Plants use carbon dioxide during photosynthesis.' },
  { q: 'What is 7 x 8?', options: ['56', '54', '64', '48'], correct: 0, subject: 'Maths', topic: 'Times Tables', moduleId: null, ms: '7 x 8 = 56.' },
  { q: 'What is 15% of 200?', options: ['30', '15', '20', '35'], correct: 0, subject: 'Maths', topic: 'Percentages', moduleId: null, ms: '10% is 20 and 5% is 10, so 15% is 30.' },
  { q: 'What is the mean of 2, 4 and 9?', options: ['5', '6', '7', '15'], correct: 0, subject: 'Maths', topic: 'Averages', moduleId: null, ms: '(2 + 4 + 9) / 3 = 5.' },
  { q: 'What word means a comparison using like or as?', options: ['Simile', 'Metaphor', 'Verb', 'Noun'], correct: 0, subject: 'English', topic: 'Language Devices', moduleId: null, ms: 'A simile compares using like or as.' },
  { q: 'What is a word that describes a noun?', options: ['Adjective', 'Verb', 'Adverb', 'Pronoun'], correct: 0, subject: 'English', topic: 'Grammar', moduleId: null, ms: 'An adjective describes a noun.' },
  { q: 'Which word means repeating the same starting sound?', options: ['Alliteration', 'Oxymoron', 'Personification', 'Zoomorphism'], correct: 0, subject: 'English', topic: 'Language Devices', moduleId: null, ms: 'Alliteration repeats the same initial sound.' },
  { q: 'What is the pH of a neutral solution?', options: ['7', '1', '14', '0'], correct: 0, subject: 'Chemistry', topic: 'Acids and Alkalis', moduleId: null, ms: 'Neutral solutions have pH 7.' },
  { q: 'What particle has a negative charge?', options: ['Electron', 'Proton', 'Neutron', 'Nucleus'], correct: 0, subject: 'Chemistry', topic: 'Atomic Structure', moduleId: null, ms: 'Electrons have a negative charge.' },
]

const QUICK_FIRE_MEMORY_KEY = 'gcse_quickfire_memory_v1'

const QUICK_FIRE_SUBJECT_META = {
  History: { icon: '🏛️', color: '#F5B700', moduleId: 'mod1' },
  Maths: { icon: '✖️', color: '#3B82FF', moduleId: null },
  Sociology: { icon: '👥', color: '#FF5C7A', moduleId: null },
  Chemistry: { icon: '⚗️', color: '#38D27A', moduleId: null },
  Biology: { icon: '🌿', color: '#38D27A', moduleId: 'sci_bio_w1' },
  English: { icon: '📘', color: '#3B82FF', moduleId: null },
  'Quick Fire': { icon: '⚡', color: '#9D5CFF', moduleId: null },
}

function emptyQuickFireStats() {
  return { answered: 0, correct: 0, subjects: {}, topics: {} }
}

function bumpQuickFireBucket(buckets, key, isCorrect, extra = {}) {
  const next = { ...buckets }
  const current = next[key] || { answered: 0, correct: 0, ...extra }
  next[key] = {
    ...current,
    ...extra,
    answered: (current.answered || 0) + 1,
    correct: (current.correct || 0) + (isCorrect ? 1 : 0),
  }
  return next
}

function addQuickFireAnswer(stats, question, isCorrect) {
  const subject = question.subject || 'Quick Fire'
  const topic = question.topic || subject
  const topicKey = subject + '::' + topic
  return {
    answered: stats.answered + 1,
    correct: stats.correct + (isCorrect ? 1 : 0),
    subjects: bumpQuickFireBucket(stats.subjects || {}, subject, isCorrect, { subject }),
    topics: bumpQuickFireBucket(stats.topics || {}, topicKey, isCorrect, {
      key: topicKey,
      subject,
      topic,
      moduleId: question.moduleId || null,
    }),
  }
}

function readQuickFireMemory() {
  try {
    return JSON.parse(localStorage.getItem(QUICK_FIRE_MEMORY_KEY) || '{"subjects":{},"topics":{}}')
  } catch {
    return { subjects: {}, topics: {} }
  }
}

function mergeQuickFireBuckets(memoryBuckets = {}, roundBuckets = {}) {
  const merged = { ...memoryBuckets }
  Object.entries(roundBuckets).forEach(([key, value]) => {
    const current = merged[key] || { ...value, answered: 0, correct: 0 }
    merged[key] = {
      ...current,
      ...value,
      answered: (current.answered || 0) + (value.answered || 0),
      correct: (current.correct || 0) + (value.correct || 0),
    }
  })
  return merged
}

function saveQuickFireMemory(roundStats) {
  const memory = readQuickFireMemory()
  const next = {
    subjects: mergeQuickFireBuckets(memory.subjects, roundStats.subjects),
    topics: mergeQuickFireBuckets(memory.topics, roundStats.topics),
    updatedAt: new Date().toISOString(),
  }
  try { localStorage.setItem(QUICK_FIRE_MEMORY_KEY, JSON.stringify(next)) } catch {}
  return next
}

function bucketAccuracy(bucket) {
  return bucket?.answered ? Math.round((bucket.correct / bucket.answered) * 100) : 0
}

function rankedQuickFireSubjects(memory, roundStats) {
  const subjects = mergeQuickFireBuckets(memory.subjects, roundStats.subjects)
  return Object.entries(subjects)
    .map(([subject, bucket]) => ({
      subject,
      icon: QUICK_FIRE_SUBJECT_META[subject]?.icon || '📚',
      color: QUICK_FIRE_SUBJECT_META[subject]?.color || '#9CA8C7',
      moduleId: QUICK_FIRE_SUBJECT_META[subject]?.moduleId || null,
      answered: bucket.answered || 0,
      correct: bucket.correct || 0,
      accuracy: bucketAccuracy(bucket),
    }))
    .filter(item => item.answered > 0)
    .sort((a, b) => b.answered - a.answered)
}


function confidencePriorityForModule(moduleId) {
  if (!moduleId) return 0
  const rating = getAllConfidenceRatings().find(item => item.moduleId === moduleId)
  if (!rating) return 0
  if (rating.confidence === 'confused') return 4
  if (rating.confidence === 'clicking') return 2
  return 0
}

function prioritizedQuickFireQuestions() {
  const memory = readQuickFireMemory()
  return QUICK_FIRE_QUESTIONS
    .map((question, index) => {
      const subjectBucket = memory.subjects?.[question.subject]
      const topicBucket = memory.topics?.[question.subject + '::' + question.topic]
      const subjectWeakness = subjectBucket?.answered ? Math.max(0, 70 - bucketAccuracy(subjectBucket)) / 10 : 0
      const topicWeakness = topicBucket?.answered ? Math.max(0, 75 - bucketAccuracy(topicBucket)) / 8 : 0
      const confidenceBoost = confidencePriorityForModule(question.moduleId)
      return { question, index, score: subjectWeakness + topicWeakness + confidenceBoost }
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(item => item.question)
}

function pickQuickFireRecommendation(memory, roundStats) {
  const topics = mergeQuickFireBuckets(memory.topics, roundStats.topics)
  const weakTopic = Object.values(topics)
    .filter(topic => (topic.answered || 0) > 0)
    .sort((a, b) => {
      const accuracyGap = bucketAccuracy(a) - bucketAccuracy(b)
      if (accuracyGap !== 0) return accuracyGap
      return (b.answered || 0) - (a.answered || 0)
    })[0]

  if (weakTopic) {
    return {
      subject: weakTopic.subject,
      topic: weakTopic.topic,
      moduleId: weakTopic.moduleId || QUICK_FIRE_SUBJECT_META[weakTopic.subject]?.moduleId || null,
      accuracy: bucketAccuracy(weakTopic),
      answered: weakTopic.answered || 0,
    }
  }

  return { subject: 'Biology', topic: 'Photosynthesis', moduleId: 'sci_bio_w1', accuracy: 0, answered: 0 }
}



function TestTab({ mode = 'test', onOpenModule } = {}) {
  const [mathsOpen, setMathsOpen]   = useState(false)
  const [englishOpen, setEnglishOpen]     = useState(false)
  const [sociologyOpen, setSociologyOpen]     = useState(false)
  const [chemistryOpen, setChemistryOpen]     = useState(false)
  const [selected, setSelected]   = useState(null)
  const [qIdx, setQIdx]           = useState(0)
  const [answer, setAnswer]       = useState('')
  const [showTip, setTip]         = useState(false)
  const [grading, setGrading]     = useState(false)
  const [feedback, setFeedback]   = useState(null)
  const [error, setError]         = useState(null)
  const [testProgress, setTestProgress] = useState(() => { try { return getProgress() } catch { return { streak: 0 } } })
  const testStreak = testProgress.streak || 0
  const testStreakDots = Array.from({ length: 7 }, (_, i) => i < Math.min(7, testStreak))
  const isQuickFire = mode === 'quickfire'
  const isExamMode = mode === 'exam'
  const QUICK_FIRE_SECONDS = 90
  const [quickFireTimeLeft, setQuickFireTimeLeft] = useState(QUICK_FIRE_SECONDS)
  const [quickFireActive, setQuickFireActive] = useState(false)
  const [quickFireFinished, setQuickFireFinished] = useState(false)
  const [quickFireStats, setQuickFireStats] = useState(() => emptyQuickFireStats())
  const [quickFireQuestionSet, setQuickFireQuestionSet] = useState(QUICK_FIRE_QUESTIONS)
  const [quickFireSummary, setQuickFireSummary] = useState(null)
  const EXAM_SECONDS = 10 * 60
  const [examPhase, setExamPhase] = useState('landing')
  const [examCountdown, setExamCountdown] = useState(3)
  const [examConfig, setExamConfig] = useState(null)
  const [examQuestions, setExamQuestions] = useState([])
  const [examIdx, setExamIdx] = useState(0)
  const [examTimeLeft, setExamTimeLeft] = useState(EXAM_SECONDS)
  const [examAnswer, setExamAnswer] = useState('')
  const [examFeedback, setExamFeedback] = useState(null)
  const [examGrading, setExamGrading] = useState(false)
  const [examStats, setExamStats] = useState({ correct: 0, answered: 0, bySubject: {} })
  const [tqMcAttempts, setTqMcAttempts] = useState(0)
  const [tqMcHint, setTqMcHint]         = useState(false)
  const [tqMcLocked, setTqMcLocked]     = useState(false)

  useEffect(() => {
    if (!isQuickFire || !selected || !quickFireActive) return undefined
    const timer = setInterval(() => {
      setQuickFireTimeLeft(seconds => Math.max(0, seconds - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [isQuickFire, selected, quickFireActive])

  useEffect(() => {
    if (!isQuickFire || !selected || !quickFireActive || quickFireTimeLeft > 0) return
    setQuickFireActive(false)
    setQuickFireFinished(true)
    setError(null)
    finishQuickFireRound('time')
  }, [isQuickFire, selected, quickFireActive, quickFireTimeLeft])

  useEffect(() => {
    if (!isExamMode || examPhase !== 'countdown') return undefined
    const timer = setInterval(() => {
      setExamCountdown(value => {
        if (value === 'GO') {
          clearInterval(timer)
          setExamPhase('round')
          return 'GO'
        }
        if (value === 1) return 'GO'
        return value - 1
      })
    }, 900)
    return () => clearInterval(timer)
  }, [isExamMode, examPhase])

  useEffect(() => {
    if (!isExamMode || examPhase !== 'round') return undefined
    const timer = setInterval(() => {
      setExamTimeLeft(value => {
        if (value <= 1) {
          clearInterval(timer)
          setExamPhase('summary')
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isExamMode, examPhase])

  const quickFirePct = Math.max(0, Math.min(100, (quickFireTimeLeft / QUICK_FIRE_SECONDS) * 100))
  const quickFireTime = Math.floor(quickFireTimeLeft / 60) + ':' + String(quickFireTimeLeft % 60).padStart(2, '0')
  const examTime = Math.floor(examTimeLeft / 60) + ':' + String(examTimeLeft % 60).padStart(2, '0')


  function getExamScoreMemory() {
    let scores = []
    try { scores = JSON.parse(localStorage.getItem('gcse_scores') || '[]') } catch {}
    const subjects = {}
    scores.forEach(score => {
      if (!subjects[score.subject]) subjects[score.subject] = []
      subjects[score.subject].push(score.pct)
    })
    return Object.fromEntries(Object.entries(subjects).map(([subject, vals]) => [
      subject,
      Math.round(vals.slice(0, 12).reduce((sum, value) => sum + value, 0) / Math.max(1, vals.slice(0, 12).length)),
    ]))
  }

  function normaliseExamQuestion(question, subject, topicLabel, topicId) {
    const options = question.options || null
    return {
      id: question.id || question.q || Math.random().toString(36),
      subject,
      topicLabel: question.topicLabel || topicLabel || subject,
      topicId: question.topicId || topicId || subject.toLowerCase(),
      q: question.q,
      extract: question.extract,
      marks: question.marks || 1,
      ms: question.ms || 'Award marks fairly for a correct answer.',
      type: question.type || (options ? 'mc' : 'written'),
      options,
      correctIndex: question.correctIndex ?? question.correct,
      fig: question.fig,
      imageKey: question.imageKey,
      skillTip: question.skillTip,
    }
  }

  function allExamQuestions() {
    const fromTestTopics = TEST_TOPICS.flatMap(group => group.topics.flatMap(topic => (
      PAST_PAPER_QS[topic.id] || []
    ).map(question => normaliseExamQuestion(question, group.subject, topic.label, topic.id))))
    return [
      ...fromTestTopics,
      ...ALL_MATHS_QUESTIONS.map(q => normaliseExamQuestion(q, 'Maths', q.topicLabel, q.topicId)),
      ...ALL_ENGLISH_QUESTIONS.map(q => normaliseExamQuestion(q, 'English', q.topicLabel, q.topicId)),
      ...ALL_SOCIOLOGY_QUESTIONS.map(q => normaliseExamQuestion(q, 'Sociology', q.topicLabel, q.topicId)),
      ...ALL_CHEMISTRY_QUESTIONS.map(q => normaliseExamQuestion(q, 'Chemistry', q.topicLabel, q.topicId)),
    ].filter(question => question.q)
  }

  function adaptiveExamQuestions(subject = 'Random') {
    const memory = getExamScoreMemory()
    const base = allExamQuestions().filter(q => subject === 'Random' || q.subject === subject)
    const shuffled = shuffle(base)
    const scored = shuffled.map(question => {
      const avg = memory[question.subject]
      const weakness = avg === undefined ? 1 : Math.max(0, 75 - avg) / 10
      const strength = avg === undefined ? 1 : Math.max(0, avg - 70) / 10
      return { question, avg, weakness, strength }
    })
    const weak = scored.filter(item => item.avg === undefined || item.avg < 70).sort((a, b) => b.weakness - a.weakness).map(item => item.question)
    const strong = scored.filter(item => item.avg >= 70).sort((a, b) => b.strength - a.strength).map(item => item.question)
    const mixed = [...weak.slice(0, 6), ...strong.slice(0, 4)]
    const used = new Set(mixed.map(q => q.id))
    const fill = shuffled.filter(q => !used.has(q.id)).slice(0, 10 - mixed.length)
    return shuffle([...mixed, ...fill]).slice(0, 10)
  }

  function resetExamQuestion() {
    setExamAnswer('')
    setExamFeedback(null)
    setExamGrading(false)
    setError(null)
  }

  function startExamRound(subject = 'Random') {
    const questions = adaptiveExamQuestions(subject)
    setExamConfig({ subject, title: subject === 'Random' ? 'Random Exam Challenge' : subject + ' Exam Sprint' })
    setExamQuestions(questions)
    setExamIdx(0)
    setExamTimeLeft(EXAM_SECONDS)
    setExamCountdown(3)
    setExamStats({ correct: 0, answered: 0, bySubject: {} })
    resetExamQuestion()
    setExamPhase('countdown')
  }

  function addExamResult(question, earned, possible) {
    const correct = earned >= possible
    setExamStats(stats => {
      const current = stats.bySubject[question.subject] || { answered: 0, correct: 0 }
      return {
        answered: stats.answered + 1,
        correct: stats.correct + (correct ? 1 : 0),
        bySubject: {
          ...stats.bySubject,
          [question.subject]: {
            answered: current.answered + 1,
            correct: current.correct + (correct ? 1 : 0),
          },
        },
      }
    })
    recordScore({ subject: question.subject, earned, possible, source: 'exam' })
  }

  async function checkExamAnswer(question) {
    if (!question) return
    if (question.type === 'mc') {
      if (examAnswer === '') { setError('Pick an answer first.'); return }
      const picked = Number(examAnswer)
      const isCorrect = picked === question.correctIndex
      addExamResult(question, isCorrect ? question.marks : 0, question.marks)
      setExamFeedback({
        grade: isCorrect ? 'Excellent' : 'Needs Work',
        summary: isCorrect ? 'Correct.' : 'Not this time.',
        examinerTip: question.ms,
      })
      return
    }
    if (examAnswer.trim().length < 3) { setError('Write a little before submitting.'); return }
    setExamGrading(true)
    setError(null)
    try {
      const result = await gradeWithAI(question.q, examAnswer, question.marks, question.ms)
      const earned = result.marksAwarded ?? 0
      addExamResult(question, earned, result.marksAvailable || question.marks)
      setExamFeedback(result)
    } catch {
      setError('Could not mark right now. Try again in a moment.')
    } finally {
      setExamGrading(false)
    }
  }

  function nextExamQuestion() {
    if (examIdx < examQuestions.length - 1) {
      setExamIdx(i => i + 1)
      resetExamQuestion()
    } else {
      setExamPhase('summary')
    }
  }


  function resetQ() { setAnswer(''); setTip(false); setFeedback(null); setError(null); setGrading(false) }


  if (isExamMode && examPhase !== 'landing') {
    const currentExamQuestion = examQuestions[examIdx]
    const examAccuracy = examStats.answered ? Math.round((examStats.correct / examStats.answered) * 100) : 0

    if (examPhase === 'countdown') {
      return (
        <div style={{ minHeight:'100vh', background:'radial-gradient(circle at 50% 20%, rgba(157,92,255,.2), transparent 38%), #050817', display:'flex', alignItems:'center', justifyContent:'center', color:'#F5F7FB', padding:24 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#AAB4D4', fontWeight:800, letterSpacing:'.18em', textTransform:'uppercase', fontSize:'.72rem', marginBottom:20 }}>{examConfig?.title || 'Exam Mode'}</div>
            <div key={examCountdown} style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize: examCountdown === 'GO' ? '5rem' : '7rem', fontWeight:950, color: examCountdown === 'GO' ? '#38F27B' : '#C18CFF', textShadow:'0 0 42px rgba(157,92,255,.72)', animation:'examPop .85s ease both' }}>{examCountdown}</div>
            <div style={{ color:'#7C8DB0', marginTop:18, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Breathe. Read the command word first.</div>
            <style>{'@keyframes examPop { 0%{opacity:0;transform:scale(.72)} 45%{opacity:1;transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }'}</style>
          </div>
        </div>
      )
    }

    if (examPhase === 'round' && currentExamQuestion) {
      const isMC = currentExamQuestion.type === 'mc'
      return (
        <div style={{ minHeight:'100vh', background:'#08090D', color:'#F5F7FB', padding:'16px 16px 110px' }}>
          <div style={{ maxWidth:660, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <button onClick={() => setExamPhase('summary')} style={{ width:40, height:40, borderRadius:'50%', border:'1px solid rgba(80,97,140,.45)', background:'rgba(12,18,38,.9)', color:'#DCE5FA', fontSize:'1.2rem', cursor:'pointer' }}>‹</button>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:850, fontSize:'1.05rem' }}>{examConfig?.title}</div>
                <div style={{ color:'#7C8DB0', fontSize:'.76rem' }}>Question {examIdx + 1} / {examQuestions.length} · {currentExamQuestion.subject} · {currentExamQuestion.topicLabel}</div>
              </div>
              <div style={{ background:examTimeLeft < 60 ? 'rgba(255,93,115,.14)' : 'rgba(157,92,255,.14)', border:'1px solid ' + (examTimeLeft < 60 ? 'rgba(255,93,115,.4)' : 'rgba(157,92,255,.35)'), borderRadius:999, color:examTimeLeft < 60 ? '#FF5D73' : '#C18CFF', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:900, padding:'7px 11px', minWidth:64, textAlign:'center' }}>{examTime}</div>
            </div>
            <div style={{ height:5, background:'#151D33', borderRadius:99, overflow:'hidden', marginBottom:18 }}>
              <div style={{ width: ((examIdx + 1) / Math.max(1, examQuestions.length)) * 100 + '%', height:'100%', background:'linear-gradient(90deg,#7C3AED,#9D5CFF)', borderRadius:99 }} />
            </div>

            {currentExamQuestion.extract && <div style={{ whiteSpace:'pre-wrap', background:'#0D1424', border:'1px solid #1E2A40', borderRadius:14, padding:14, color:'#AAB4D4', fontSize:'.82rem', lineHeight:1.55, marginBottom:14 }}>{currentExamQuestion.extract}</div>}
            {currentExamQuestion.fig && FIGURES[currentExamQuestion.fig] && <div style={{ background:'#0D1424', border:'1px solid #1E2A40', borderRadius:14, padding:12, marginBottom:14, textAlign:'center' }}><img src={FIGURES[currentExamQuestion.fig]} alt="Exam figure" style={{ maxWidth:'100%', borderRadius:10 }} /></div>}
            {currentExamQuestion.imageKey && <ChemImage imageKey={currentExamQuestion.imageKey} />}

            <div style={{ background:'linear-gradient(145deg,#10182B,#0D1424)', border:'1px solid #2A3552', borderRadius:18, padding:18, marginBottom:14 }}>
              <div style={{ display:'inline-flex', background:'rgba(245,183,0,.1)', border:'1px solid rgba(245,183,0,.24)', borderRadius:999, color:'#F5B700', fontWeight:850, fontSize:'.7rem', padding:'4px 10px', marginBottom:12 }}>[{currentExamQuestion.marks} mark{currentExamQuestion.marks !== 1 ? 's' : ''}]</div>
              <div style={{ whiteSpace:'pre-wrap', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:750, fontSize:'1.05rem', lineHeight:1.45 }}>{currentExamQuestion.q}</div>
            </div>

            {isMC ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
                {currentExamQuestion.options.map((option, index) => {
                  const selectedOption = String(index) === examAnswer
                  const marked = Boolean(examFeedback)
                  const correct = index === currentExamQuestion.correctIndex
                  return <button key={index} onClick={() => !marked && setExamAnswer(String(index))} style={{ background: marked ? (correct ? 'rgba(77,255,136,.1)' : selectedOption ? 'rgba(255,93,115,.1)' : '#151720') : selectedOption ? 'rgba(157,92,255,.14)' : '#151720', border:'1.5px solid ' + (marked ? (correct ? 'rgba(77,255,136,.45)' : selectedOption ? 'rgba(255,93,115,.4)' : 'rgba(255,255,255,0.1)') : selectedOption ? 'rgba(157,92,255,.45)' : 'rgba(255,255,255,0.1)'), borderRadius:13, padding:'13px 14px', color:'#DCE5FA', textAlign:'left', cursor:marked?'default':'pointer', fontWeight:650 }}>{option}</button>
                })}
              </div>
            ) : (
              <textarea value={examAnswer} onChange={e => setExamAnswer(e.target.value)} disabled={Boolean(examFeedback)} placeholder="Write your answer..." style={{ width:'100%', minHeight:150, background:'#151720', border:'1px solid #2A3552', borderRadius:14, padding:14, color:'#F5F7FB', marginBottom:14 }} />
            )}

            {error && <div style={{ color:'#FF5D73', marginBottom:12, fontWeight:700 }}>{error}</div>}
            {examFeedback && <div style={{ background: examFeedback.grade === 'Needs Work' ? 'rgba(255,93,115,.08)' : 'rgba(77,255,136,.08)', border:'1px solid ' + (examFeedback.grade === 'Needs Work' ? 'rgba(255,93,115,.3)' : 'rgba(77,255,136,.3)'), borderRadius:14, padding:14, marginBottom:14 }}><div style={{ fontWeight:850, color: examFeedback.grade === 'Needs Work' ? '#FF5D73' : '#4DFF88', marginBottom:5 }}>{examFeedback.grade || 'Marked'}</div><div style={{ color:'#C8D0E8', lineHeight:1.5 }}>{examFeedback.summary || examFeedback.examinerTip}</div>{examFeedback.examinerTip && <div style={{ color:'#AAB4D4', fontSize:'.84rem', marginTop:8 }}>{examFeedback.examinerTip}</div>}</div>}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setExamPhase('summary')} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:13, padding:14, color:'#9CA8C7', fontWeight:800, cursor:'pointer' }}>End exam</button>
              {examFeedback ? <button onClick={nextExamQuestion} style={{ background:'linear-gradient(135deg,#7C3AED,#9D5CFF)', border:'none', borderRadius:13, padding:14, color:'#fff', fontWeight:900, cursor:'pointer' }}>{examIdx < examQuestions.length - 1 ? 'Next →' : 'Finish ✓'}</button> : <button onClick={() => checkExamAnswer(currentExamQuestion)} disabled={examGrading} style={{ background:'linear-gradient(135deg,#7C3AED,#9D5CFF)', border:'none', borderRadius:13, padding:14, color:'#fff', fontWeight:900, cursor:examGrading?'default':'pointer', opacity:examGrading?.7:1 }}>{examGrading ? 'Marking…' : 'Submit answer'}</button>}
            </div>
          </div>
        </div>
      )
    }

    if (examPhase === 'summary') {
      return (
        <div style={{ minHeight:'100vh', background:'#08090D', color:'#F5F7FB', padding:'28px 20px 120px' }}>
          <div style={{ maxWidth:520, margin:'0 auto', textAlign:'center' }}>
            <div style={{ width:150, height:150, borderRadius:'50%', margin:'0 auto 22px', background:'conic-gradient(#38F27B ' + examAccuracy + '%, #172845 0)', display:'grid', placeItems:'center' }}><div style={{ width:122, height:122, borderRadius:'50%', background:'#071126', display:'grid', placeItems:'center' }}><div><div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize:'2.4rem', fontWeight:950 }}>{examAccuracy}%</div><div style={{ color:'#AAB4D4', fontWeight:800 }}>{examStats.correct}/{examStats.answered || 0}</div></div></div></div>
            <h1 style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize:'2rem', margin:'0 0 8px' }}>Exam round complete</h1>
            <p style={{ color:'#AAB4D4', margin:'0 0 22px' }}>Adaptive questions mixed stronger areas with weak zones.</p>
            <div style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:18, padding:18, marginBottom:20, textAlign:'left' }}>
              {Object.entries(examStats.bySubject).map(([subject, stats]) => <div key={subject} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,.06)' }}><span>{subject}</span><strong>{stats.correct}/{stats.answered}</strong></div>)}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setExamPhase('landing')} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:13, padding:14, color:'#9CA8C7', fontWeight:800, cursor:'pointer' }}>Back</button>
              <button onClick={() => startExamRound(examConfig?.subject || 'Random')} style={{ background:'linear-gradient(135deg,#38F27B,#2DD4A3)', border:'none', borderRadius:13, padding:14, color:'#03140B', fontWeight:950, cursor:'pointer' }}>Try again</button>
            </div>
          </div>
        </div>
      )
    }

  }

  if (mathsOpen)   return <MathsBrowser   onBack={() => setMathsOpen(false)} />
  if (englishOpen)   return <EnglishBrowser   onBack={() => setEnglishOpen(false)} />
  if (sociologyOpen)  return <SociologyBrowser  onBack={() => setSociologyOpen(false)} />
  if (chemistryOpen) return <ChemistryBrowser onBack={() => setChemistryOpen(false)} />

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
      const d = await gradeWithAI(q.q, answer, q.marks, q.ms)
      setFeedback(d)
    } catch { setError('Could not grade right now. Check your connection.') }
    finally { setGrading(false) }
  }

  function nextQuestion(total) {
    if (qIdx < total - 1) { setQIdx(qIdx+1); resetQ() }
    else { setSelected(null); setQIdx(0); resetQ() }
  }

  function fullResetQ() {
    resetQ()
    setTqMcAttempts(0); setTqMcHint(false); setTqMcLocked(false)
  }

  function startTopic(selection) {
    setSelected(selection)
    setQIdx(0)
    fullResetQ()
    if (isQuickFire) {
      setQuickFireTimeLeft(QUICK_FIRE_SECONDS)
      setQuickFireActive(true)
      setQuickFireFinished(false)
      setQuickFireStats(emptyQuickFireStats())
      setQuickFireQuestionSet(prioritizedQuickFireQuestions())
      setQuickFireSummary(null)
    }
  }

  function finishQuickFireRound(reason = 'exit') {
    setQuickFireActive(false)
    setQuickFireFinished(true)
    const memory = saveQuickFireMemory(quickFireStats)
    setQuickFireSummary({
      reason,
      answered: quickFireStats.answered,
      correct: quickFireStats.correct,
      timeUsed: QUICK_FIRE_SECONDS - quickFireTimeLeft,
      timeLeft: quickFireTimeLeft,
      subjects: rankedQuickFireSubjects(memory, quickFireStats),
      recommendation: pickQuickFireRecommendation(memory, quickFireStats),
    })
  }

  function exitTestTopic() {
    setSelected(null)
    setQIdx(0)
    fullResetQ()
    setQuickFireActive(false)
    setQuickFireFinished(false)
    setQuickFireTimeLeft(QUICK_FIRE_SECONDS)
    setQuickFireSummary(null)
  }

  function startRandomQuestion() {
    if (isQuickFire) {
      startTopic({ topicId: 'quickfire', label: '90s Quick Fire', subject: 'Quick Fire' })
      return
    }
    if (isExamMode) {
      startExamRound('Random')
      return
    }
    const allT = TEST_TOPICS.filter(s => s.topics.some(t => t.available))
    const rs = allT[Math.floor(Math.random() * allT.length)]
    const av = rs.topics.filter(t => t.available)
    const rt = av[Math.floor(Math.random() * av.length)]
    startTopic({ topicId: rt.id, label: rt.label, subject: rs.subject })
  }

  function tqNextQuestion(total) {
    if (qIdx < total - 1) { setQIdx(qIdx+1); fullResetQ() }
    else if (isQuickFire) { finishQuickFireRound('complete') }
    else { exitTestTopic() }
  }

  function handleTqCheck(q) {
    if (q.type === 'mc') {
      if (!answer) { setError('Pick an option first.'); return }
      const isCorrect = answer === q.options[q.correct]
      const newAttempts = tqMcAttempts + 1
      setTqMcAttempts(newAttempts)
      if (isCorrect) {
        if (isQuickFire) setQuickFireStats(stats => addQuickFireAnswer(stats, q, true))
        setTqMcLocked(true)
        setFeedback({ marksAwarded: q.marks, marksAvailable: q.marks, grade: 'Excellent',
          summary: "That's the one. Well done for getting it.", achieved: ['Correct answer selected'], missed: [], examinerTip: '' })
        recordScore({ subject: selected.subject, earned: q.marks, possible: q.marks, source: 'test' })
      } else if (newAttempts === 1) {
        setTqMcHint(true)
        setAnswer('')
        setError('')
      } else {
        if (isQuickFire) setQuickFireStats(stats => addQuickFireAnswer(stats, q, false))
        setTqMcLocked(true)
        const correctText = q.options[q.correct] || ''
        setFeedback({ marksAwarded: 0, marksAvailable: q.marks, grade: 'Needs Work',
          summary: 'The correct answer was: ' + correctText + '. Read the explanation below and it will stick next time.',
          achieved: [], missed: [q.ms || ''], examinerTip: "Go back to this topic — one question doesn't define you." })
        recordScore({ subject: selected.subject, earned: 0, possible: q.marks, source: 'test' })
      }
      return
    }
    gradeAnswer(q)
  }

  if (quickFireSummary) {
    const accuracy = quickFireSummary.answered ? Math.round((quickFireSummary.correct / quickFireSummary.answered) * 100) : 0
    const summarySubjects = quickFireSummary.subjects?.length
      ? quickFireSummary.subjects
      : rankedQuickFireSubjects(readQuickFireMemory(), emptyQuickFireStats())
    const recommendation = quickFireSummary.recommendation || pickQuickFireRecommendation(readQuickFireMemory(), emptyQuickFireStats())
    const recommendedModule = recommendation?.moduleId ? MODULES.find(m => m.id === recommendation.moduleId) : null
    const recommendationMeta = QUICK_FIRE_SUBJECT_META[recommendation?.subject] || QUICK_FIRE_SUBJECT_META.Biology
    const encouragement = accuracy >= 80 ? 'Excellent recall.' : accuracy >= 60 ? 'You’re making strong progress.' : 'Good start — now sharpen the weak spots.'
    const actionLine = accuracy >= 80 ? 'Keep it up!' : 'Focus on improvement.'

    return (
      <div style={{ background:'radial-gradient(circle at 50% -10%, rgba(101,230,198,.08), transparent 42%), #08090D', minHeight:'100vh', padding:'18px 20px calc(150px + env(safe-area-inset-bottom))', color:'#F4EFE6' }}>
        <div style={{ maxWidth:480, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <button onClick={exitTestTopic} aria-label="Back" style={{ width:42, height:42, borderRadius:'50%', border:'none', background:'rgba(20,31,54,.78)', color:'#F5F7FB', fontSize:'1.45rem', cursor:'pointer' }}>‹</button>
            <button aria-label="Share" style={{ width:42, height:42, borderRadius:'50%', border:'none', background:'rgba(20,31,54,.78)', color:'#F5F7FB', fontSize:'1rem', cursor:'pointer' }}>⇧</button>
          </div>

          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{
              width:168, height:168, borderRadius:'50%', margin:'0 auto 18px',
              background:'conic-gradient(#38F27B ' + accuracy + '%, rgba(23,40,69,.9) 0)',
              display:'grid', placeItems:'center', boxShadow:'0 0 34px rgba(56,242,123,.18)',
            }}>
              <div style={{ width:142, height:142, borderRadius:'50%', background:'#071126', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 0 24px rgba(0,0,0,.45)' }}>
                <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize:'2.65rem', fontWeight:900, lineHeight:1 }}>{accuracy}%</div>
                <div style={{ color:'#AAB4D4', fontSize:'.9rem', fontWeight:700, marginTop:5 }}>{quickFireSummary.correct} / {quickFireSummary.answered || 0}</div>
                <div style={{ color:'#38F27B', fontSize:'.86rem', fontWeight:900, marginTop:4 }}>Correct</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:9 }}>
              <h1 style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize:'2.1rem', lineHeight:1.05, margin:0, color:'#F5F7FB' }}>{accuracy >= 60 ? 'Great work!' : 'Keep going!'}</h1>
              <span style={{ color:'#F5B700', fontSize:'1.45rem' }}>✩</span>
            </div>
            <p style={{ color:'#AAB4D4', fontSize:'.96rem', margin:'10px 0 0', lineHeight:1.45 }}>{encouragement}<br /><span style={{ color:'#38F27B', fontWeight:900 }}>{actionLine}</span></p>
          </div>

          <div style={{ background:'linear-gradient(145deg, rgba(16,24,43,.96), rgba(9,15,31,.96))', border:'1px solid rgba(62,78,118,.55)', borderRadius:18, padding:'18px 18px 14px', marginBottom:16, boxShadow:'0 14px 36px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:'1rem' }}>Performance by subject</div>
              <button onClick={exitTestTopic} style={{ border:'none', background:'transparent', color:'#AAB4D4', fontSize:'.8rem', cursor:'pointer' }}>View all ›</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {summarySubjects.slice(0, 5).map(item => (
                <div key={item.subject} style={{ display:'grid', gridTemplateColumns:'40px 1fr 54px 48px', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:item.color + '22', color:item.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.12rem' }}>{item.icon}</div>
                  <div>
                    <div style={{ color:item.color, fontWeight:850, fontSize:'.86rem', marginBottom:7 }}>{item.subject}</div>
                    <div style={{ height:5, background:'rgba(58,75,111,.52)', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ width:item.accuracy + '%', height:'100%', borderRadius:99, background:item.color, boxShadow:'0 0 10px ' + item.color }} />
                    </div>
                  </div>
                  <div style={{ color:'#DCE5FA', fontWeight:800, fontSize:'.86rem', textAlign:'right' }}>{item.correct} / {item.answered}</div>
                  <div style={{ justifySelf:'end', color:item.color, background:item.color + '18', border:'1px solid ' + item.color + '30', borderRadius:8, padding:'4px 7px', fontWeight:900, fontSize:'.76rem' }}>{item.accuracy}%</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => recommendedModule && onOpenModule ? onOpenModule(recommendedModule) : exitTestTopic()} style={{ width:'100%', background:'linear-gradient(145deg, rgba(16,24,43,.96), rgba(9,15,31,.96))', border:'1px solid rgba(62,78,118,.55)', borderRadius:18, padding:'18px', marginBottom:20, display:'flex', alignItems:'center', gap:16, textAlign:'left', cursor:'pointer', boxShadow:'0 14px 36px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.04)' }}>
            <div style={{ width:54, height:54, borderRadius:'50%', background:recommendationMeta.color + '20', color:recommendationMeta.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>{recommendationMeta.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", color:'#F5F7FB', fontWeight:850, fontSize:'1rem' }}>Recommended next</div>
                <span style={{ background:'rgba(255,92,122,.18)', color:'#FF5C7A', borderRadius:999, padding:'5px 10px', fontSize:'.7rem', fontWeight:900 }}>🎯 Priority</span>
              </div>
              <div style={{ color:'#EAF0FF', fontWeight:850, fontSize:'.95rem' }}>{recommendation.subject} – {recommendation.topic}</div>
              <div style={{ color:'#AAB4D4', fontSize:'.84rem', marginTop:4, lineHeight:1.35 }}>You struggled with questions and keywords here. {recommendedModule ? 'Open the module to strengthen it.' : 'Focus your next quick practice here.'}</div>
            </div>
            <span style={{ color:'#AAB4D4', fontSize:'1.6rem' }}>›</span>
          </button>

          <button onClick={startRandomQuestion} style={{ width:'100%', border:'none', borderRadius:17, background:'linear-gradient(135deg,#38F27B,#2DD4A3)', color:'#03140B', padding:'20px 22px', display:'flex', alignItems:'center', gap:18, cursor:'pointer', boxShadow:'0 18px 36px rgba(45,212,163,.24)', marginBottom:18 }}>
            <span style={{ fontSize:'2rem', lineHeight:1 }}>↻</span>
            <span style={{ textAlign:'left' }}>
              <span style={{ display:'block', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize:'1.25rem', fontWeight:950, letterSpacing:'.02em' }}>TRY AGAIN</span>
              <span style={{ display:'block', fontSize:'.86rem', fontWeight:750, marginTop:3 }}>Focus on {recommendation.subject} & {recommendation.topic} · ~3 mins</span>
            </span>
          </button>
        </div>
      </div>
    )
  }

  if (selected) {
    const questions = isQuickFire ? quickFireQuestionSet : (PAST_PAPER_QS[selected.topicId] || [])
    const q = isQuickFire && questions[qIdx] ? { type: 'mc', marks: 1, ...questions[qIdx] } : questions[qIdx]
    const gs = feedback ? (GRADE_STYLE[feedback.grade] || GRADE_STYLE['Developing']) : null
    const isMC = q?.type === 'mc'
    return (
      <div style={{ background:'#08090D', minHeight:'100vh', paddingBottom:90 }}>
        <div style={{ background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', padding:'12px 16px', position:'sticky', top:0, zIndex:10, backdropFilter:'blur(12px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, maxWidth:660, margin:'0 auto' }}>
            <button onClick={() => isQuickFire ? finishQuickFireRound('exit') : exitTestTopic()} style={{ background:isQuickFire?'rgba(255,93,115,.1)':'none', border:isQuickFire?'1px solid rgba(255,93,115,.24)':'none', borderRadius:isQuickFire?999:0, cursor:'pointer', color:isQuickFire?'#FF5D73':'#5A6480', fontSize:isQuickFire?'.72rem':'1.1rem', fontWeight:isQuickFire?800:400, padding:isQuickFire?'6px 10px':0 }}>{isQuickFire ? 'Exit' : '←'}</button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.9rem', color:'#F5F7FB', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selected.label}</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.7rem', color:'#5A6480' }}>Question {qIdx+1} of {questions.length}</div>
            </div>
            {isQuickFire && (
              <div style={{ background: quickFireTimeLeft <= 10 ? 'rgba(255,93,115,.12)' : 'rgba(157,92,255,.12)', border: quickFireTimeLeft <= 10 ? '1px solid rgba(255,93,115,.36)' : '1px solid rgba(157,92,255,.3)', borderRadius: 999, padding: '6px 10px', color: quickFireTimeLeft <= 10 ? '#FF5D73' : '#C18CFF', fontFamily: "'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: '.86rem', minWidth: 58, textAlign: 'center' }}>
                {quickFireTime}
              </div>
            )}
          </div>
          <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden', marginTop:10, maxWidth:660, margin:'10px auto 0' }}>
            <div style={{ height:'100%', width:`${((qIdx+1)/questions.length)*100}%`, background:'linear-gradient(90deg,#F5B700,#C98719)', borderRadius:99, transition:'width .3s' }} />
          </div>
          {isQuickFire && (
            <div style={{ height:4, background:'rgba(157,92,255,.12)', borderRadius:99, overflow:'hidden', maxWidth:660, margin:'7px auto 0' }}>
              <div style={{ height:'100%', width: quickFirePct + '%', background: quickFireTimeLeft <= 10 ? 'linear-gradient(90deg,#FF5D73,#FF8A1F)' : 'linear-gradient(90deg,#7C3AED,#9D5CFF)', borderRadius:99, transition:'width 1s linear' }} />
            </div>
          )}
        </div>
        <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
          {q && <>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(245,183,0,.1)', border:'1px solid rgba(245,183,0,.25)', borderRadius:99, padding:'4px 12px', marginBottom:14 }}>
              <span style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize:'.75rem', fontWeight:700, color:'#F5B700' }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
            </div>
            {q.fig && FIGURES[q.fig] && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'12px', marginBottom:14, textAlign:'center' }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'#5A6480', marginBottom:8 }}>Figure — from AQA past paper</div>
                <img src={FIGURES[q.fig]} alt="AQA exam figure" style={{ maxWidth:'100%', height:'auto', borderRadius:8 }} />
              </div>
            )}
            <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:14, padding:'16px', marginBottom:14 }}>
              <pre style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1rem', lineHeight:1.65, margin:0, color:'#E0E6F0', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
            </div>
            {!showTip
              ? <button onClick={() => setTip(true)} style={{ background:'none', border:'1px dashed #2A3552', borderRadius:10, padding:'9px 14px', cursor:'pointer', color:'#4A5578', fontSize:'.82rem', fontFamily:"'Plus Jakarta Sans',sans-serif", width:'100%', marginBottom:14 }}>💡 Show mark tip</button>
              : <div style={{ background:'rgba(245,183,0,.06)', border:'1px solid rgba(245,183,0,.2)', borderRadius:10, padding:'11px 14px', marginBottom:14 }}>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:5 }}>{q.marks}-mark question</div>
                  <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", margin:0, fontSize:'.85rem', color:'#C8D0E8' }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
                </div>
            }
            {!feedback && !tqMcLocked && (
              isMC
                ? <div style={{ marginBottom:14 }}>
                    {/* Hint card after first wrong MC */}
                    {tqMcHint && (
                      <div style={{ background:'rgba(255,200,87,.06)', border:'1px solid rgba(255,200,87,.28)', borderRadius:14, padding:'14px 16px', marginBottom:12 }}>
                        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.63rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#FFC857', marginBottom:8 }}>💡 Have another look</div>
                        <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.88rem', color:'#C8D0E8', margin:'0 0 4px', lineHeight:1.55 }}>
                          {q.hint || (q.ms ? q.ms.split('.')[0] + '.' : 'Think carefully — what is the question specifically asking about?')}
                        </p>
                        <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.78rem', color:'#FFC857', margin:0, fontStyle:'italic' }}>
                          You have one more try — you can get this.
                        </p>
                      </div>
                    )}
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {q.options.map((opt,i) => (
                        <button key={i} onClick={() => setAnswer(opt)} style={{ background:answer===opt?'rgba(245,183,0,.1)':'#151720', border:`1.5px solid ${answer===opt?'#F5B700':'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'13px 16px', cursor:'pointer', textAlign:'left', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.93rem', color:answer===opt?'#F5B700':'#C8D0E8', transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ width:22, height:22, borderRadius:'50%', border:`1.5px solid ${answer===opt?'#F5B700':'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.72rem', fontWeight:700, color:answer===opt?'#F5B700':'#4A5578', background:answer===opt?'rgba(245,183,0,.1)':'transparent' }}>{String.fromCharCode(65+i)}</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                : <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:14, padding:'14px', marginBottom:14 }}>
                    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4A5578', marginBottom:8 }}>Your answer</div>
                    <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Write your answer here…" style={{ width:'100%', border:'none', background:'transparent', resize:'none', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.92rem', color:'#E0E6F0', lineHeight:1.65, outline:'none', minHeight:q.marks>=6?180:q.marks>=3?120:80 }} />
                  </div>
            )}
            {error && <div style={{ background:'rgba(255,93,115,.08)', border:'1px solid rgba(255,93,115,.3)', borderRadius:10, padding:'11px 14px', marginBottom:14 }}><p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", margin:0, fontSize:'.86rem', color:'#FF5D73' }}>{error}</p></div>}
            {feedback && gs && (
              <div className="fade-up">
                <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:16, padding:'18px', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontSize:'1.8rem', fontWeight:800, color:gs.text, lineHeight:1 }}>{feedback.marksAwarded}<span style={{ fontSize:'1rem', opacity:.6 }}>/{feedback.marksAvailable}</span></div>
                    <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.82rem' }}>{feedback.grade}</div>
                  </div>
                  <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.9rem', color:gs.text, margin:0, opacity:.85 }}>{feedback.summary}</p>
                </div>
                {feedback.achieved?.length > 0 && feedback.achieved[0] !== 'Correct answer selected' && <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4DFF88', marginBottom:8 }}>✓ What you got right</div>{feedback.achieved.map((a,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:'#4DFF88', flexShrink:0 }}>✓</span><p style={{ margin:0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.87rem', color:'#C8D0E8' }}>{a}</p></div>)}</div>}
                {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && feedback.missed[0] !== '' && <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#9CA8C7', marginBottom:8 }}>→ Worth knowing</div>{feedback.missed.map((m,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:'#9CA8C7', flexShrink:0 }}>→</span><p style={{ margin:0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.87rem', color:'#C8D0E8' }}>{m}</p></div>)}</div>}
                {feedback.examinerTip && feedback.examinerTip !== '' && <div style={{ background:'rgba(245,183,0,.06)', border:'1px solid rgba(245,183,0,.2)', borderRadius:12, padding:'13px 14px', marginBottom:14 }}><div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:6 }}>🗡️ Examiner tip</div><p style={{ margin:0, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'.87rem', color:'#C8D0E8' }}>{feedback.examinerTip}</p></div>}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <button onClick={fullResetQ} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:12, padding:'13px', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, cursor:'pointer', color:'#9CA8C7', fontSize:'.88rem' }}>↩ Try again</button>
                  <button onClick={()=>tqNextQuestion(questions.length)} style={{ background:'linear-gradient(135deg,#F5B700,#C98719)', border:'none', borderRadius:12, padding:'13px', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, cursor:'pointer', color:'#070500', fontSize:'.88rem' }}>{qIdx<questions.length-1?'Next →':'Finish ✓'}</button>
                </div>
              </div>
            )}
            {!feedback && !tqMcLocked && (
              <button onClick={() => handleTqCheck(q)} disabled={grading || (isMC && !answer)}
                style={{ width:'100%', background:grading?'rgba(255,255,255,0.08)':'linear-gradient(135deg,#F5B700,#C98719)', color:grading?'#5A6480':'#070500', border:'none', borderRadius:12, padding:'15px', fontFamily:"'Clash Display', 'Plus Jakarta Sans',sans-serif", fontWeight:700, cursor:(grading||(isMC&&!answer))?'default':'pointer', fontSize:'.97rem', marginTop:4, opacity:(isMC&&!answer)?0.4:1 }}>
                {grading ? 'Marking…' : tqMcHint ? 'Check again — you can do this →' : 'Check my answer →'}
              </button>
            )}
          </>}
        </div>
      </div>
    )
  }


  const EXAM_SUBJECTS = [
    { icon: '👥', label: 'Sociology', color: '#FF5C7A', completed: 7,  total: 10, action: isExamMode ? () => startExamRound('Sociology') : () => setSociologyOpen(true) },
    { icon: '🏛',  label: 'History',  color: '#C89B6D', completed: 6,  total: 12, action: isExamMode ? () => startExamRound('History') : () => startTopic({ topicId: 'medieval', label: 'History', subject: 'History' }) },
    { logo: '/headers/bio-main.png',  label: 'Biology',   color: '#4F8A5B', completed: 1,  total: 7,  action: isExamMode ? () => startExamRound('Biology')    : () => startTopic({ topicId: 'tb_cells', label: 'Biology', subject: 'Biology' }) },
    { logo: '/headers/chem-logo.png', label: 'Chemistry', color: '#9B59E8', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('Chemistry')  : () => setChemistryOpen(true) },
    { icon: '📐', label: 'Maths',     color: '#3B82FF', completed: 0,  total: 20, action: isExamMode ? () => startExamRound('Maths') : () => setMathsOpen(true) },
    { icon: '📖', label: 'English',   color: '#9E3D52', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('English') : () => setEnglishOpen(true) },
  ]

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>

      {/* ── Header — 72px ── */}
      <div style={{ height: 72, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="RISE" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: '1.05rem', color: '#F4EFE6', lineHeight: 1.15 }}>
              {isQuickFire ? '90s Quick Fire' : isExamMode ? 'Exam Mode' : 'Practice Test'}
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: '#7A7670', marginTop: 2 }}>
              {isQuickFire ? '90 seconds. Answer fast.' : isExamMode ? 'Pick a subject. Face the examiner.' : 'Pick a topic to start'}
            </div>
          </div>
        </div>
        {/* Streak pill — 40px tall, 16px h-padding */}
        <div style={{ height: 40, paddingLeft: 16, paddingRight: 16, display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,138,31,.11)', border: '1px solid rgba(255,138,31,.24)', borderRadius: 99, flexShrink: 0 }}>
          <span style={{ fontSize: '.85rem', lineHeight: 1 }}>🔥</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#FF8A1F' }}>{testStreak > 0 ? `${testStreak} day streak` : '8 day streak'}</span>
          <span style={{ display: 'flex', gap: 3, marginLeft: 2 }}>
            {testStreakDots.map((filled, i) => (
              <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: filled ? '#FF8A1F' : 'transparent', border: filled ? 'none' : '1px solid rgba(255,138,31,.38)', boxShadow: filled ? '0 0 6px rgba(255,138,31,.5)' : 'none' }} />
            ))}
          </span>
        </div>
      </div>

      <div style={{ padding: '8px 20px 0' }}>

        {/* RECOMMENDED label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ color: '#65E6C6', fontSize: '.78rem', lineHeight: 1 }}>★</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7A7670' }}>Recommended</span>
        </div>

        {/* ── Hero card — 220px, 62/38 split ── */}
        <div style={{ height: 220, background: 'linear-gradient(140deg, #0A140F 0%, #081009 52%, #060C07 100%)', borderRadius: 22, overflow: 'hidden', display: 'flex', marginBottom: 28, border: '1px solid rgba(101,230,198,0.14)', boxShadow: '0 8px 40px rgba(0,0,0,.55)' }}>
          <div style={{ flex: '0 0 62%', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
            <div>
              <div style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: '#F4EFE6', lineHeight: 1.15, marginBottom: 10 }}>
                {isQuickFire ? '90 Second Challenge' : isExamMode ? 'Exam Mode' : 'Random Challenge'}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                {[
                  { dot: '#65E6C6', text: isQuickFire ? '90 seconds' : '10 questions' },
                  { dot: '#C89B6D', text: 'Mixed topics' },
                  { dot: '#65E6C6', text: 'Adaptive' },
                ].map((s, i) => (
                  <span key={i} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: '#7A7670', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0, display: 'inline-block' }} />
                    {s.text}
                  </span>
                ))}
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: '#7A7670', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {isQuickFire ? 'A countdown starts the moment you open the first question.' : isExamMode ? 'Pick a subject and face the examiner.' : 'History. Then biology. Then Macbeth. You never know what\'s coming.'}
              </p>
            </div>
            <button onClick={startRandomQuestion} style={{ height: 46, paddingLeft: 18, paddingRight: 18, background: 'linear-gradient(135deg, #3D7A5E, #65E6C6)', border: 'none', borderRadius: 13, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '.86rem', color: '#051209', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 0 20px rgba(101,230,198,.28)', alignSelf: 'flex-start' }}>
              {isQuickFire ? '⚡ Start 90s' : isExamMode ? '⤨ Start Exam' : '▶ Start Random'}
            </button>
          </div>
          <div style={{ flex: '0 0 38%', position: 'relative', overflow: 'hidden' }}>
            <img src="/mystery-cube.png" alt="" style={{ position: 'absolute', top: -4, right: -8, width: '115%', height: '115%', objectFit: 'cover', objectPosition: 'center', opacity: .85, filter: 'saturate(0.8) hue-rotate(90deg)' }} />
          </div>
        </div>

        {/* ── QUICK FOCUS — horizontal scroll pills ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7A7670' }}>Quick Focus</span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.76rem', color: '#65E6C6', fontWeight: 600, padding: 0 }}>See all</button>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { icon: '🎯', label: 'Weak Zones' },
              { icon: '✕', label: 'Last Mistakes' },
              { icon: '📊', label: 'Predicted Paper' },
            ].map((item, i) => (
              <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#151720', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, height: 52, paddingLeft: 18, paddingRight: 18, cursor: 'pointer', flexShrink: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.8rem', fontWeight: 600, color: '#C9C4BA', whiteSpace: 'nowrap', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '.88rem', lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CHOOSE A SUBJECT — 88px compact rows, 4px bars ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7A7670', marginBottom: 12 }}>Choose a Subject</div>
          {EXAM_SUBJECTS.map((subj, i) => (
            <button key={i} onClick={subj.action} style={{ width: '100%', boxSizing: 'border-box', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', height: 80, padding: '0 2px 0 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, overflow: 'hidden', flexShrink: 0, background: `${subj.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                {subj.logo
                  ? <img src={subj.logo} alt={subj.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : subj.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#F4EFE6', marginBottom: 3 }}>{subj.label}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.68rem', color: subj.color, fontWeight: 600, marginBottom: 7 }}>{subj.completed}/{subj.total} modules</div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(subj.completed / subj.total) * 100}%`, background: subj.color, borderRadius: 99 }} />
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.05rem', flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>

        {/* ── REAL EXAM PAPERS ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#4A5578', marginBottom: 12 }}>Real Exam Papers</div>
          <button style={{ width: '100%', boxSizing: 'border-box', background: '#0E1628', border: '1px solid #1E2A40', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 54, height: 54, borderRadius: 15, background: 'rgba(59,130,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Clash Display', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '.92rem', color: '#F0F3FA' }}>Real Exam Papers</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '.73rem', color: '#4A5578', marginTop: 3 }}>AQA & Edexcel timed papers</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.05rem', flexShrink: 0 }}>›</span>
          </button>
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
