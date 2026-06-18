import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { getProgress, recordActivity, getModuleState as safeGetModuleState } from '../progress.js'
import { buildChapterCompletePayload, prepareModuleScreenState, resolveTaskDestination } from './moduleNavigation.js'
import TestTab, { TestDataProvider, readQfBest } from '../features/quickfire/QuickFire.jsx'
import Home from '../features/home/Home.jsx'
import PulseTab from '../features/pulse/Pulse.jsx'
import ModulesTab from '../features/subjects/Subjects.jsx'
import BottomNav from './BottomNav.jsx'
import ChapterCompleteScreen from '../components/layout/ChapterCompleteScreen.jsx'

// ModulePlayer (and the ~40 learning/feedback components it imports) is only
// needed once a user opens a module — lazy-load it as its own chunk so
// Home/Subjects/Progress/Quiz don't pay for it on first load.
const ModulePlayer = lazy(() => import('../components/layout/ModulePlayer.jsx'))

// ─── Helpers ────────────────────────────────────────────────────────────────

function safeGetProgress() {
  try { return getProgress() } catch { return { streak: 0, lastSessionDate: null, topicProgress: {}, history: [] } }
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

// ─── Module loading screen ─────────────────────────────────────────────────────
// Shown both while ModulePlayer's chunk downloads (Suspense fallback, first open
// only) and while a module's full lesson content is being fetched (see
// loadModuleContent below).

function ModuleLoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#08090D',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <img src="/logo.png" alt="" style={{ width: 64, height: 64, objectFit: 'contain', opacity: 0.5 }} />
    </div>
  )
}

// ─── Module content loading ────────────────────────────────────────────────────
// Full lesson content (hook, outcomes, screens, intro, recall) lives in
// src/modules/<subject>.js, split out of src/modules.js so it's only downloaded
// when a module from that subject is opened. src/modules.js itself keeps only
// the lightweight metadata used for browsing, cards and progress.

const SUBJECT_MODULE_LOADERS = {
  History:   () => import('../modules/history.js').then(m => m.HISTORY_MODULES),
  Biology:   () => import('../modules/biology.js').then(m => m.BIOLOGY_MODULES),
  Maths:     () => import('../modules/maths.js').then(m => m.MATHS_MODULES),
  Sociology: () => import('../modules/sociology.js').then(m => m.SOCIOLOGY_MODULES),
  Chemistry: () => import('../modules/chemistry.js').then(m => m.CHEMISTRY_MODULES),
}

async function loadModuleContent(mod) {
  const loader = SUBJECT_MODULE_LOADERS[mod.subject]
  if (!loader) return null
  const subjectModules = await loader()
  return subjectModules.find(m => m.id === mod.id) || null
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
        fontFamily: "'Sora', sans-serif",
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
          fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600, color: '#1A1A1A',
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
        fontFamily: "'Outfit', sans-serif",
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
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

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
          fontFamily: "'Sora', sans-serif",
          fontSize: 32, fontWeight: 700, color: '#F4EFE6',
          lineHeight: 1.15, marginBottom: 12, letterSpacing: '-0.01em',
        }}>
          What should<br />we call you?
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15, color: '#7A7670', lineHeight: 1.55, marginBottom: 36,
        }}>
          This helps personalise your revision journey.
        </div>

        {/* Glassmorphism input */}
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Your name"
          maxLength={30}
          style={{
            width: '100%', height: 58, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '0 22px',
            fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 500, color: '#F4EFE6',
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
          fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700,
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

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const { user, pendingAuth, signOut } = useAuth()
  const [showSplash, setShowSplash]   = useState(true)
  const [tab, setTab]                 = useState('home')
  const [view, setView]               = useState(null)   // 'module' | 'chapter-complete' — overlays
  const [progress, setProgress]       = useState(() => safeGetProgress())
  const [activeModule,        setActiveModule]        = useState(null)
  const [chapterCompleteData, setChapterCompleteData] = useState(null)
  const [examAutoStart,       setExamAutoStart]       = useState(null)

  function handleChapterComplete(completedModule) {
    setChapterCompleteData(buildChapterCompletePayload(completedModule))
    setView('chapter-complete')
  }

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1400)
    return () => clearTimeout(t)
  }, [])

  // Record daily login — updates the streak accurately
  useEffect(() => {
    recordActivity()
    setProgress(safeGetProgress())
  }, [])

  function openModule(mod, screenIndex) {
    openModulePlayer(mod, screenIndex)
  }

  function handleTodaysPlanSelect(task) {
    const dest = resolveTaskDestination(task)
    if (!dest) return
    if (dest.kind === 'quickfire') {
      setTab('quickfire')
    } else if (dest.kind === 'module') {
      openModule(dest.mod, dest.screenIndex)
    } else if (dest.kind === 'exam') {
      setExamAutoStart({
        subject:         dest.subject,
        isTimedPaper:    dest.isTimedPaper,
        durationSeconds: dest.durationSeconds,
        paperQuestions:  dest.paperQuestions,
        title:           dest.title,
      })
      setTab('exams')
    }
  }

  function openModulePlayer(mod, screenIndex) {
    if (screenIndex !== undefined && screenIndex !== null) {
      try {
        const existing = safeGetModuleState(mod.id)
        localStorage.setItem(`gcse_module_${mod.id}`, JSON.stringify(
          prepareModuleScreenState(screenIndex, existing)
        ))
      } catch {}
    }
    setActiveModule(null)
    setView('module')
    loadModuleContent(mod).then(fullMod => setActiveModule(fullMod || mod))
  }

  function closeOverlay() {
    setProgress(safeGetProgress())
    setView(null)
  }

  // Splash → auth screens → overlays → tab shell
  if (showSplash) return <SplashScreen />
  if (!user?.loggedIn || !user?.onboardingComplete) {
    if (pendingAuth) return <OnboardingScreen />
    return <LoginScreen />
  }

  // Full-screen overlays take priority
  if (view === 'chapter-complete' && chapterCompleteData) {
    const d = chapterCompleteData
    return (
      <ChapterCompleteScreen
        accent={d.accent}
        completedChapter={d.completedChapter}
        nextChapterNum={d.nextChapterNum}
        nextChapterTitle={d.nextChapterTitle}
        nextChapterLabel={d.nextChapterLabel}
        supportingCopy={d.supportingCopy}
        isFinalChapter={d.isFinalChapter}
        moduleName={d.moduleName}
        pastPaperLabel={d.pastPaperHint?.label}
        onContinue={() => {
          setChapterCompleteData(null)
          if (d.nextModule) { openModule(d.nextModule) } else { closeOverlay() }
        }}
        onQuiz={() => {
          setChapterCompleteData(null)
          setView(null)
          setTab('quickfire')
        }}
        onPastPaper={d.pastPaperHint ? () => {
          setChapterCompleteData(null)
          setView(null)
          setTab('exams')
        } : undefined}
        onHome={() => {
          setChapterCompleteData(null)
          closeOverlay()
          setTab('home')
        }}
        tab="subjects"
        setTab={(t) => {
          setChapterCompleteData(null)
          setView(null)
          setTab(t)
        }}
      />
    )
  }
  if (view === 'module' && !activeModule) return <ModuleLoadingScreen />
  if (view === 'module' && activeModule) return (
    <Suspense fallback={<ModuleLoadingScreen />}>
      <ModulePlayer module={activeModule} onBack={closeOverlay} onChapterComplete={handleChapterComplete} />
    </Suspense>
  )


  // Tab shell
  return (
    <div style={{ background: '#08090D', minHeight: '100vh' }}>
      <div key={tab} className="tab-content">
        {tab === 'home'     && <Home onSelectTask={handleTodaysPlanSelect} />}
        {tab === 'subjects' && <ModulesTab onOpenModule={openModule} />}
        {tab === 'pulse'    && <PulseTab onStartQuickFire={() => setTab('quickfire')} best={readQfBest()} />}
        {tab === 'quickfire' && <TestTab mode="quickfire" autoStart={true} onOpenModule={openModule} onExit={() => setTab('pulse')} />}
        {tab === 'exams'    && <TestDataProvider><TestTab mode="exam" onOpenModule={openModule} onOpenPulse={() => setTab('pulse')} examAutoStart={examAutoStart} clearExamAutoStart={() => setExamAutoStart(null)} /></TestDataProvider>}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}

