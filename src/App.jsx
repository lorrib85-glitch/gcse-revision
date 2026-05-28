import { useEffect, useRef, useState } from 'react'
import { SUBJECTS } from './constants/subjects.js'
import { SPACING }  from './constants/spacing.js'
import { RADII }    from './constants/radii.js'
import { TYPE }     from './constants/typography.js'
import { useAuth } from './auth/AuthContext.jsx'
import { MATHS_TOPIC_GROUPS, ALL_MATHS_QUESTIONS, FORMULA_SHEET, DIAGRAMS } from './data/mathsTopics.js'
import { BIOLOGY_GROUPS } from './data/biologyGroups.js'
import { CHEMISTRY_GROUPS } from './data/chemistryGroups.js'
import { MATHS_GROUPS } from './data/mathsGroups.js'
import { SOCIOLOGY_GROUPS } from './data/sociologyGroups.js'
import { ENGLISH_TOPIC_GROUPS, ALL_ENGLISH_QUESTIONS } from './data/englishTopics.js'
import { SOCIOLOGY_TOPIC_GROUPS, ALL_SOCIOLOGY_QUESTIONS } from './data/sociologyTopics.js'
import { CHEMISTRY_TOPIC_GROUPS, ALL_CHEMISTRY_QUESTIONS } from './data/chemistryTopics.js'
import { CHEM_IMAGES } from './data/chemImages.js'
import { FIGURES } from './figures.js'
import { TOPICS, TOPIC_DATA } from './content.js'
import { getProgress, saveSessionResult, getNextTopicId, daysUntil, saveSessionDraft, getSessionDraft, clearSessionDraft, recordActivity, recordScore, getImprovements } from './progress.js'
import { MODULES } from './modules.js'
import ModulePlayer, { getAllConfidenceRatings } from './components/layout/ModulePlayer.jsx'
import ChapterCompleteScreen from './components/layout/ChapterCompleteScreen.jsx'
import ExamQuestionFrame from './components/feedback/ExamQuestionFrame.jsx'

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

// ─── Shared streak chip ───────────────────────────────────────────────────────
// Reads live from localStorage so it's always accurate wherever it's rendered.

function StreakChip({ style = {} }) {
  const prog   = safeGetProgress()
  const streak = prog.streak || 0
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
      borderRadius: 999, padding: '4px 12px 4px 10px',
      ...style,
    }}>
      <span style={{ fontSize: 14, filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.6))' }}>🔥</span>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.02em' }}>
        {streak > 0 ? `${streak} day streak` : 'Start your streak'}
      </span>
    </div>
  )
}

// ─── Top-level router ────────────────────────────────────────────────────────

// ─── Bottom nav ──────────────────────────────────────────────────────────────

function NavIcon({ id, active }) {
  const c = active ? '#A855F7' : '#4B5563'
  const s = { stroke: c, fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const glow = active ? `drop-shadow(0 0 3px rgba(168,85,247,0.30))` : 'none'
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
      background: 'rgba(6,8,14,0.96)',
      backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 32,
      boxShadow: '0 4px 20px rgba(0,0,0,0.65)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      padding: '10px 6px calc(10px + env(safe-area-inset-bottom))',
      gap: 4,
    }}>
      {tabs.map(t => {
        const active = tab === t.id || (t.id === 'pulse' && tab === 'quickfire')
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            border: 'none', background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
            cursor: 'pointer', borderRadius: 22,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: active ? 600 : 500,
            color: active ? '#D4CFEC' : '#3A4054',
            padding: '6px 4px 5px', minWidth: 0,
            transition: 'background 220ms ease, color 220ms ease',
            boxShadow: 'none',
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
  const [activeModule,        setActiveModule]        = useState(null)
  const [chapterCompleteData, setChapterCompleteData] = useState(null)

  // Brand-document subject colours — always used in preference to module.color
  const SUBJECT_ACCENT = {
    'Maths':     '#2BBE9A',
    'Biology':   '#38D27A',
    'History':   '#F5B700',
    'English':   '#9D5CFF',
    'Sociology': '#FF5C7A',
    'Chemistry': '#34D5FF',
    'Drama':     '#FF4FC3',
    'Music':     '#34D5FF',
  }

  // Parent modules — each contains an ordered list of chapter IDs
  // "Chapter" = one entry in MODULES; "Module" = this parent grouping
  const MODULE_GROUPS = [
    {
      id: 'hist_medicine',
      title: 'Medicine Through Time',
      subject: 'History',
      chapterIds: ['mod1','mod2','mod3','mod4','mod5','mod6','mod7','mod8','mod9'],
    },
    {
      id: 'soc_family',
      title: 'Sociology of the Family',
      subject: 'Sociology',
      chapterIds: ['soc1','soc2','soc3','soc4','soc6'],
    },
    {
      id: 'maths_core',
      title: 'GCSE Maths',
      subject: 'Maths',
      chapterIds: ['math1','math2'],
    },
    {
      id: 'bio_core',
      title: 'GCSE Biology',
      subject: 'Biology',
      chapterIds: ['sci_bio_w1','bio_building_life','bio_human_machine','bio_disease_wars','bio_control_systems','bio_genetics_evolution','bio_ecosystems_group'],
    },
    {
      id: 'chem_core',
      title: 'GCSE Chemistry',
      subject: 'Chemistry',
      chapterIds: ['chem_matter_atoms','chem_reactions','chem_rates_organic','chem_earth'],
    },
  ]

  function handleChapterComplete(completedModule) {
    const COPY = [
      'Momentum matters.',
      "That's another one locked in.",
      "You're getting faster.",
      'Nice. Keep the streak moving.',
      'Another one down.',
    ]
    const accent = SUBJECT_ACCENT[completedModule.subject] || completedModule.color || '#9D5CFF'

    // Find which parent module this chapter belongs to
    const group      = MODULE_GROUPS.find(g => g.chapterIds.includes(completedModule.id))
    const chapterIdx = group ? group.chapterIds.indexOf(completedModule.id) : -1
    const nextChapterId = group ? group.chapterIds[chapterIdx + 1] : null

    let nextMod, nextChapterLabel, nextChapterNum, nextChapterTitle, isFinalChapter

    if (nextChapterId) {
      // Another chapter exists in the same parent module
      nextMod          = MODULES.find(m => m.id === nextChapterId)
      nextChapterLabel = 'Chapter'
      nextChapterNum   = chapterIdx + 2  // 1-based index of the next chapter
      nextChapterTitle = nextMod?.title
      isFinalChapter   = false
    } else if (group) {
      // Last chapter — find the next parent module
      const groupIdx   = MODULE_GROUPS.indexOf(group)
      const nextGroup  = MODULE_GROUPS[groupIdx + 1]
      nextMod          = nextGroup ? MODULES.find(m => m.id === nextGroup.chapterIds[0]) : null
      nextChapterLabel = 'Next Module'
      nextChapterNum   = null            // no number shown for "Next Module"
      nextChapterTitle = nextGroup?.title
      isFinalChapter   = !nextGroup
    } else {
      // Chapter not in any defined group — fall back to sequential order
      const idx        = MODULES.findIndex(m => m.id === completedModule.id)
      nextMod          = idx >= 0 && idx < MODULES.length - 1 ? MODULES[idx + 1] : null
      nextChapterLabel = 'Chapter'
      nextChapterNum   = nextMod?.number
      nextChapterTitle = nextMod?.title
      isFinalChapter   = !nextMod
    }

    setChapterCompleteData({
      accent,
      completedChapter: completedModule.title,
      nextChapterLabel,
      nextChapterNum,
      nextChapterTitle,
      supportingCopy:   COPY[Math.floor(Math.random() * COPY.length)],
      isFinalChapter,
      moduleName:       group?.title || completedModule.title,
      nextModule:       nextMod,
    })
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

  function openModule(mod) {
    openModulePlayer(mod)
  }

  function openModulePlayer(mod, screenIndex) {
    if (screenIndex !== undefined && screenIndex !== null) {
      try {
        const existing = safeGetModuleState(mod.id)
        localStorage.setItem(`gcse_module_${mod.id}`, JSON.stringify({
          ...existing,
          screen: screenIndex,
          hookDone:  screenIndex > 0 ? true : (existing.hookDone  || false),
          wylDone:   screenIndex > 0 ? true : (existing.wylDone   || false),
          introDone: screenIndex > 0 ? true : (existing.introDone || false),
        }))
      } catch {}
    }
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
        onContinue={() => {
          setChapterCompleteData(null)
          if (d.nextModule) { openModule(d.nextModule) } else { closeOverlay() }
        }}
        onQuiz={() => {
          setChapterCompleteData(null)
          setView(null)
          setTab('quickfire')
        }}
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
  if (view === 'module' && activeModule) return <ModulePlayer module={activeModule} onBack={closeOverlay} onChapterComplete={handleChapterComplete} />
  if (view === 'session' && session)     return <Session session={session} topicId={topicId} startPhase={startPhase} initialResults={results} onFinish={finishSession} onHome={closeOverlay} />
  if (view === 'end')                    return <EndScreen topicId={topicId} results={results} savedData={savedData} onHome={closeOverlay} onStart={startSession} />


  // Tab shell
  return (
    <div style={{ background: '#08090D', minHeight: '100vh' }}>
      {tab === 'home'     && <Home progress={progress} onStart={startSession} onOpenModule={openModule} onOpenSubjects={() => setTab('subjects')} onOpenPulse={() => setTab('pulse')} />}
      {tab === 'subjects' && <ModulesTab onOpenModule={openModule} />}
      {tab === 'pulse'    && <PulseTab onStartQuickFire={() => setTab('quickfire')} />}
      {tab === 'quickfire' && <TestTab mode="quickfire" autoStart={true} onOpenModule={openModule} onExit={() => setTab('pulse')} />}
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

// ─── Home atmosphere — abstract network / constellation ────────────────────────
function HomeAtmosphere() {
  const nodes = [
    [180, 48], [222, 26], [266, 16], [300, 36], [332, 22],
    [356, 50], [362, 82], [334, 106], [300, 78], [266, 90],
    [228, 68], [194, 90], [370, 62], [346, 130], [308, 116],
  ]
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,12],[5,6],[6,7],
    [7,8],[8,9],[9,10],[10,11],[11,0],[2,8],[3,8],[1,10],
    [6,12],[7,13],[13,14],[8,14],
  ]
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes ha-breathe { 0%,100%{opacity:0.08} 50%{opacity:0.13} }
      `}</style>
      <svg
        width="100%" height="55%"
        viewBox="0 0 390 300"
        preserveAspectRatio="xMaxYMin meet"
        style={{ animation: 'ha-breathe 18s ease-in-out infinite' }}
      >
        {edges.map(([a, b], i) => (
          <line key={i}
            x1={nodes[a][0]} y1={nodes[a][1]}
            x2={nodes[b][0]} y2={nodes[b][1]}
            stroke="rgba(200,190,175,0.25)"
            strokeWidth="0.65"
          />
        ))}
        {nodes.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.8" fill="rgba(215,205,190,0.35)" />
        ))}
      </svg>
      {/* Left-to-right vignette — keeps text area dark */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, #08090D 0%, rgba(8,9,13,0.72) 40%, rgba(8,9,13,0.18) 75%, transparent 100%)',
      }} />
    </div>
  )
}

function Home({ progress, onStart, onOpenModule, onOpenSubjects, onOpenPulse }) {
  const { user } = useAuth()
  const userName = user?.name || 'you'

  // Find the module with most progress to show in "Jump back in"
  const jumpBackModule = (() => {
    let best = null, bestPct = -1
    for (const m of MODULES) {
      const s = safeGetModuleState(m.id)
      if ((s.screen || 0) > 0) {
        const pct = ((s.screen || 0) / Math.max(1, m.screens?.length || 1)) * 100
        if (pct > bestPct) { bestPct = pct; best = m }
      }
    }
    return best || MODULES.find(m => m.id === 'mod1') || MODULES[0]
  })()

  const jumpModState = jumpBackModule ? safeGetModuleState(jumpBackModule.id) : {}
  const jumpPct = jumpBackModule
    ? Math.round(((jumpModState.screen || 0) / Math.max(1, jumpBackModule.screens?.length || 1)) * 100)
    : 0

  // Days active this calendar week (Mon–Sun)
  const daysThisWeek = (() => {
    try {
      const today = new Date()
      const jsDay = today.getDay() === 0 ? 7 : today.getDay()
      const monday = new Date(today); monday.setDate(today.getDate() - (jsDay - 1))
      const mondayStr = monday.toISOString().slice(0, 10)
      const scores = JSON.parse(localStorage.getItem('gcse_scores') || '[]')
      return new Set(scores.filter(s => s.date >= mondayStr).map(s => s.date)).size
    } catch { return progress.streak > 0 ? Math.min(progress.streak, 7) : 0 }
  })()

  // Weakest subject from recent scores — drives "Close the gaps"
  const focusTopic = (() => {
    try {
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 14)
      const cutoffStr = cutoff.toISOString().slice(0, 10)
      const scores = JSON.parse(localStorage.getItem('gcse_scores') || '[]').filter(s => s.date >= cutoffStr)
      if (scores.length < 3) return null
      const buckets = {}
      scores.forEach(s => {
        if (!buckets[s.subject]) buckets[s.subject] = []
        buckets[s.subject].push(s.pct)
      })
      const avg = arr => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
      const entries = Object.entries(buckets)
        .map(([subject, pcts]) => ({ subject, avg: avg(pcts), count: pcts.length }))
        .filter(e => e.count >= 2)
        .sort((a, b) => a.avg - b.avg)
      return entries[0] || null
    } catch { return null }
  })()

  const atmosphereSubject = jumpBackModule?.subject || 'History'
  const theme = SUBJECTS[atmosphereSubject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb

  return (
    <div style={{
      minHeight: '100vh', background: '#08090D',
      paddingBottom: 120, overflowX: 'hidden', position: 'relative',
    }}>
      <HomeAtmosphere />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 420, margin: '0 auto',
        padding: `max(52px, calc(18px + env(safe-area-inset-top))) ${SPACING.standard}px 0`,
      }}>

        {/* ── Top row: avatar left, dots right ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 36,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: RADII.pill,
            background: `rgba(${rgb},0.12)`,
            border: `1.5px solid rgba(${rgb},0.28)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...TYPE.metadata, color: accent, letterSpacing: '0em',
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <button aria-label="More options" style={{
            background: 'none', border: 'none', cursor: 'default',
            opacity: 0.32, padding: 4, display: 'flex', alignItems: 'center',
          }}>
            <svg width="20" height="4" viewBox="0 0 20 4" fill="none">
              <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="10" cy="2" r="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="18" cy="2" r="1.5" fill="rgba(255,255,255,0.8)" />
            </svg>
          </button>
        </div>

        {/* ── Greeting ── */}
        <div style={{ ...TYPE.hero, color: '#F5F7FF', marginBottom: 14 }}>
          Hi, {userName}.
        </div>

        {/* ── Streak pill ── */}
        {(daysThisWeek > 0 || progress.streak > 0) && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.16)',
            borderRadius: RADII.pill, padding: '5px 12px 5px 10px',
            marginBottom: SPACING.cinematic,
          }}>
            <span style={{ fontSize: 13, filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.45))' }}>🔥</span>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 13, fontWeight: 500,
              color: '#F59E0B', letterSpacing: '0.02em',
            }}>
              {daysThisWeek > 0
                ? `${daysThisWeek} day${daysThisWeek !== 1 ? 's' : ''} this week`
                : `${progress.streak} day streak`}
            </span>
          </div>
        )}

        {/* ── Jump back in ── */}
        <div style={{ marginBottom: SPACING.separation, position: 'relative', overflow: 'hidden' }}>

          {/* Landscape atmosphere — very low opacity, desaturated */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'url(/module-atmosphere.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
            opacity: 0.13,
            filter: 'saturate(0.5) brightness(0.75)',
          }} />
          {/* Overlay: text protection left + bottom page blend */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: [
              'linear-gradient(to right, #08090D 0%, rgba(8,9,13,0.92) 38%, rgba(8,9,13,0.55) 65%, rgba(8,9,13,0.15) 100%)',
              'linear-gradient(to bottom, transparent 50%, rgba(8,9,13,0.7) 80%, #08090D 100%)',
            ].join(', '),
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, paddingBottom: SPACING.standard }}>
            <div style={{ ...TYPE.sectionTitle, color: '#F5F7FF', marginBottom: 10 }}>
              Jump back in
            </div>

            {jumpBackModule && (
              <div style={{ marginBottom: 18 }}>
                <div style={{
                  ...TYPE.bodySmall,
                  color: 'rgba(255,255,255,0.46)',
                  marginBottom: 16,
                }}>
                  {jumpBackModule.title}
                </div>

                <button
                  onClick={() => onOpenModule(jumpBackModule)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 12,
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: RADII.pill, flexShrink: 0,
                    background: `rgba(${rgb},0.12)`,
                    border: `1px solid rgba(${rgb},0.24)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                      <path d="M1 1.5L10 6.5L1 11.5V1.5Z" fill={accent} />
                    </svg>
                  </div>
                  <span style={{
                    ...TYPE.bodySmall,
                    color: 'rgba(255,255,255,0.38)',
                  }}>
                    {jumpPct}% complete
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Focus for you ── */}
        <div style={{ marginBottom: SPACING.separation, position: 'relative', overflow: 'hidden' }}>

          {/* Atmospheric background image */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'url(/focus-atmosphere.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
            opacity: 0.34,
            filter: 'blur(0.8px) contrast(0.88)',
          }} />

          {/* Overlay: radial text protection + bottom page blend */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'radial-gradient(ellipse 80% 95% at 12% 50%, #08090D 0%, rgba(8,9,13,0.88) 28%, rgba(8,9,13,0.28) 55%, transparent 78%)',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to bottom, transparent 45%, rgba(8,9,13,0.6) 74%, #08090D 100%)',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, paddingBottom: SPACING.cinematic }}>
            <div style={{
              ...TYPE.metadata,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.24)',
              marginBottom: 14,
            }}>
              Focus for you
            </div>

            <div style={{ ...TYPE.sectionTitle, color: '#F5F7FF', marginBottom: 8 }}>
              {focusTopic ? 'Close the gaps.' : 'Keep this fresh.'}
            </div>

            <div style={{
              ...TYPE.bodySmall,
              color: 'rgba(255,255,255,0.38)',
              marginBottom: SPACING.standard,
            }}>
              {focusTopic
                ? 'These topics are holding you back.'
                : 'Quick questions to keep recent learning active.'}
            </div>

            <button
              onClick={() => onOpenSubjects && onOpenSubjects()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                ...TYPE.bodySmall, color: accent, fontWeight: 500,
              }}
            >
              {focusTopic ? 'See focus topics' : 'Start a quick session'}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7H11M8 4L11 7L8 10" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Check my progress ── */}
        <button
          onClick={() => onOpenPulse && onOpenPulse()}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: RADII.medium, padding: '18px 20px',
            cursor: 'pointer',
          }}
        >
          <span style={{
            ...TYPE.bodySmall,
            color: 'rgba(255,255,255,0.68)', fontWeight: 500,
          }}>
            Check my progress
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 8H12M9 5L12 8L9 11" stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

      </div>
    </div>
  )
}

// ─── Pulse tab ─────────────────────────────────────────────────────────────────

const PULSE_QUICK_START = [
  { id: 'Sociology', label: 'Sociology', logo: '/headers/sociology-main.png', color: '#FF5C7A', glow: 'rgba(255,92,122,', status: 'Slipping',  statusColor: '#E05A52', progress: 38 },
  { id: 'History',   label: 'History',   logo: '/headers/history-main.png',   color: '#C89B6D', glow: 'rgba(200,155,109,', status: 'Stable',   statusColor: '#F59E0B', progress: 62 },
  { id: 'Biology',   label: 'Biology',   logo: '/headers/bio-main.png',        color: '#4CAF7D', glow: 'rgba(76,175,125,',  status: 'Strong',   statusColor: '#4CAF7D', progress: 81 },
  { id: 'Chemistry', label: 'Chemistry', logo: '/headers/chem-logo.png',       color: '#9B59E8', glow: 'rgba(155,89,232,',  status: 'Slipping', statusColor: '#E05A52', progress: 29 },
  { id: 'Maths',     label: 'Maths',     logo: '/headers/maths-main.png',      color: '#2DD4BF', glow: 'rgba(45,212,191,',  status: 'Improving',statusColor: '#2DD4BF', progress: 55 },
  { id: 'English',   label: 'English',   logo: '/headers/english-main.png',    color: '#B66DFF', glow: 'rgba(182,109,255,', status: 'Stable',   statusColor: '#F59E0B', progress: 67 },
  { id: 'Physics',   label: 'Physics',   logo: '/headers/physics-main.png',    color: '#3B82F6', glow: 'rgba(59,130,246,',  status: 'Improving',statusColor: '#2DD4BF', progress: 44 },
]

function PulseTab({ onStartQuickFire }) {
  const { user, signOut } = useAuth()
  const userName = user?.name || 'you'

  // Pull real accuracy data per subject for progress bars
  const subjectAccuracy = (() => {
    try {
      const scores = JSON.parse(localStorage.getItem('gcse_scores') || '[]')
      const buckets = {}
      scores.slice(0, 60).forEach(s => {
        if (!buckets[s.subject]) buckets[s.subject] = []
        buckets[s.subject].push(s.pct)
      })
      const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null
      return Object.fromEntries(Object.entries(buckets).map(([sub, vals]) => [sub, avg(vals)]))
    } catch { return {} }
  })()

  // Weakest subject
  const weakestSubject = (() => {
    const entries = Object.entries(subjectAccuracy).filter(([, v]) => v !== null)
    if (!entries.length) return { label: 'Medicine Through Time', sub: 'History', note: 'Accuracy dropped this week.' }
    const sorted = entries.sort((a, b) => a[1] - b[1])
    const [sub] = sorted[0]
    const meta = PULSE_QUICK_START.find(s => s.id === sub)
    return { label: sub, sub, note: 'Accuracy dropped this week.', color: meta?.color || '#FF5C7A' }
  })()

  const cards = PULSE_QUICK_START.map(c => {
    const acc = subjectAccuracy[c.id]
    if (acc == null) return { ...c, status: 'Pending', statusColor: '#6B7280' }
    const status = acc >= 75 ? 'Strong' : acc >= 55 ? 'Stable' : 'Slipping'
    const statusColor = acc >= 75 ? '#4CAF7D' : acc >= 55 ? '#F59E0B' : '#E05A52'
    return { ...c, progress: acc, status, statusColor }
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#08090D',
      paddingBottom: 120,
      overflowX: 'hidden',
      position: 'relative',
    }}>
      {/* Ambient purple glow behind hero */}
      <div style={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: 420, height: 380, borderRadius: '50%',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(123,63,242,0.18) 0%, rgba(139,92,246,0.06) 50%, transparent 75%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <style>{`
        @keyframes pulseGlow { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.18)} }
        @keyframes heroPulse { 0%,100%{box-shadow:0 0 0 0 rgba(123,63,242,0)} 60%{box-shadow:0 0 28px 4px rgba(123,63,242,0.22)} }
      `}</style>

      <div style={{ maxWidth: 430, margin: '0 auto', padding: '14px 24px 0', position: 'relative', zIndex: 1 }}>

        {/* ── Top row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <StreakChip />
          <button
            onClick={signOut}
            title="Sign out"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '1.5px solid rgba(139,92,246,0.3)',
              background: 'rgba(139,92,246,0.1)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: '#C4B5FD',
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </button>
        </div>

        {/* ── Heading ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <h1 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 42, fontWeight: 800, lineHeight: '44px',
            letterSpacing: '-0.02em', color: '#F5F7FF',
            margin: 0,
          }}>Pulse</h1>
          <svg width={24} height={24} viewBox="0 0 22 22" fill="none"
            style={{ filter: 'drop-shadow(0 0 7px rgba(155,92,255,0.8))', animation: 'pulseGlow 2s ease-in-out infinite', flexShrink: 0, marginBottom: 2 }}>
            <polyline points="2,13 6,13 8,6 11,18 14,10 16,13 20,13"
              stroke="#9B5CFF" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        {/* ── Hero card ── */}
        <button
          onClick={onStartQuickFire}
          style={{
            width: '100%', height: 240, border: 'none', padding: 0, cursor: 'pointer',
            borderRadius: 28, overflow: 'hidden', position: 'relative', display: 'block',
            background: 'linear-gradient(120deg, #0D0820 0%, #130C28 40%, #1A0F35 100%)',
            boxShadow: '0 0 0 1px rgba(123,63,242,0.35), 0 16px 48px rgba(0,0,0,0.7), 0 0 32px rgba(123,63,242,0.12)',
            animation: 'heroPulse 3.5s ease-in-out infinite',
            marginBottom: 28,
          }}
        >
          {/* Mystery cube artwork — right side */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/headers/pulse-hero.png)',
            backgroundSize: 'cover', backgroundPosition: 'right center',
            opacity: 0.82,
          }} />
          {/* Dark gradient overlay left side for readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(10,5,25,0.97) 0%, rgba(10,5,25,0.88) 38%, rgba(10,5,25,0.4) 62%, transparent 100%)',
          }} />

          {/* Text content — left side */}
          <div style={{
            position: 'absolute', left: 24, top: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            maxWidth: '60%',
          }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 600, letterSpacing: '0.14em',
              color: '#9B5CFF', textTransform: 'uppercase', marginBottom: 8,
            }}>Quick Fire</div>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 22, fontWeight: 700, lineHeight: '26px',
              color: '#F5F7FF', marginBottom: 6,
              letterSpacing: '-0.01em',
            }}>90s Challenge</div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 400,
              color: 'rgba(255,255,255,0.55)', marginBottom: 22,
            }}>Mixed topics · Adaptive</div>

            {/* CTA button */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              height: 50, paddingLeft: 22, paddingRight: 22,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #7B3FF2 0%, #9B5CFF 100%)',
              boxShadow: '0 6px 24px rgba(123,63,242,0.45), 0 0 0 1px rgba(155,92,255,0.3)',
              fontFamily: "'Sora', sans-serif", fontWeight: 700,
              fontSize: 16, color: '#FFFFFF', letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}>
              Start 90s Challenge →
            </div>
          </div>
        </button>

        {/* ── Quick Start section ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 600, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
            }}>Quick Start</span>
          </div>

          {/* Horizontally scrollable cards — padding-right creates the cut-off effect */}
          <div style={{
            display: 'flex', gap: 14,
            overflowX: 'auto', overflowY: 'visible',
            paddingBottom: 6, paddingRight: 24,
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            marginLeft: -24, paddingLeft: 24,
            marginRight: -24,
          }}>
            <style>{'.pulse-scroll::-webkit-scrollbar{display:none}'}</style>
            {cards.map(card => (
              <button
                key={card.id}
                onClick={onStartQuickFire}
                style={{
                  flexShrink: 0,
                  width: 145, height: 210,
                  borderRadius: 20,
                  background: '#0D0E10',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', padding: 0,
                  position: 'relative', overflow: 'hidden',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.55)',
                }}
              >
                {/* Background image */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${card.logo})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  filter: 'saturate(0.85) brightness(0.72)',
                }} />
                {/* Bottom gradient */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(5,7,11,0.08) 0%, rgba(5,7,11,0.62) 50%, rgba(5,7,11,0.97) 100%)',
                }} />
                {/* Status pill top-right */}
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                  borderRadius: 999, padding: '3px 8px',
                  fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700,
                  color: card.statusColor, border: `1px solid ${card.statusColor}44`,
                }}>
                  {card.status}
                </div>
                {/* Bottom text */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 12px 14px' }}>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
                    marginBottom: 3,
                  }}>QUICK START</div>
                  <div style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 15, fontWeight: 700, color: '#F5F7FF',
                    lineHeight: '18px', marginBottom: 8, letterSpacing: '-0.01em',
                  }}>{card.label}</div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: (card.progress || 0) + '%', height: '100%', background: card.color, borderRadius: 999 }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Weakest Right Now card ── matches home screen style ── */}
        <div style={{ marginBottom: 4 }}>
          <button
            onClick={onStartQuickFire}
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
              padding: '18px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              {/* Brain icon */}
              <div style={{
                width: 72, height: 72, borderRadius: 20, flexShrink: 0, overflow: 'hidden',
                background: '#0D1117',
                boxShadow: '0 0 24px rgba(45,212,191,0.4), inset 0 0 0 1px rgba(45,212,191,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src="/icons/brain-icon.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }} />
              </div>
              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13, fontWeight: 600, letterSpacing: '0.14em',
                  color: '#FB7185', textTransform: 'uppercase', marginBottom: 5,
                }}>Weak Zone</div>
                <div style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 16, fontWeight: 700, color: '#F4EFE6', lineHeight: 1.2, marginBottom: 6,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{weakestSubject.label}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
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
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11, fontWeight: 700, color: '#C4B5FD',
                lineHeight: 1.3, textAlign: 'center',
                boxShadow: '0 0 18px rgba(139,92,246,0.22)',
              }}>
                Recover<br />now <span style={{ fontSize: 13 }}>›</span>
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── ModulePage ───────────────────────────────────────────────────────────────
// Universal module landing page showing ordered topics with progression rail.
// Replaces the direct-to-ModulePlayer flow; always shows between module browser
// and the actual lesson content.

const MODULE_HEADER_IMAGES = {
  'mod1': '/headers/history-medicine-through-time.png',
  'mod2': '/headers/history-medicine-through-time.png',
  'mod3': '/headers/history-medicine-through-time.png',
  'mod4': '/headers/history-medicine-through-time.png',
  'mod5': '/headers/history-medicine-through-time.png',
  'mod6': '/headers/history-medicine-through-time.png',
  'mod7': '/headers/history-medicine-through-time.png',
  'mod8': '/headers/history-medicine-through-time.png',
  'mod9': '/headers/history-medicine-through-time.png',
  'sci_bio_w1': '/headers/bio-buildinglife.png',
  'math1': '/headers/maths-numbers.png',
  'math2': '/headers/maths-numbers.png',
  'soc1': '/headers/sociology-family.png',
  'soc2': '/headers/sociology-education.png',
  'soc3': '/headers/sociology-crime.png',
  'soc4': '/headers/sociology-stratification.png',
  'soc6': '/headers/sociology-main.png',
}

function hexToRgb(hex) {
  if (!hex || hex.length < 7) return '255,255,255'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

const SUBJECT_PALETTES = {
  History:   { sand: '#C89B6D', bronze: '#9A7B4F', cream: '#E8D9B5', espresso: '#2B1A0E', ink: '#14110E' },
  Sociology: { sand: '#C9B07C', bronze: '#9A7B4F', cream: '#E8D9B5', espresso: '#2B2118', ink: '#14110E' },
  Biology:   { sand: '#4CAF7D', bronze: '#2E8B57', cream: '#B8F0D4', espresso: '#0A2E1A', ink: '#061408' },
  Chemistry: { sand: '#9B59E8', bronze: '#7B3BD0', cream: '#DDD0F8', espresso: '#1A0E2B', ink: '#0D0816' },
  Physics:   { sand: '#3B82F6', bronze: '#2563EB', cream: '#DBEAFE', espresso: '#0E1B2B', ink: '#060D18' },
  English:   { sand: '#B66DFF', bronze: '#9B5CFF', cream: '#E8D5FF', espresso: '#1A0B2E', ink: '#0E0618' },
  Maths:     { sand: '#2DD4BF', bronze: '#0D9488', cream: '#CCFBF1', espresso: '#0A2A27', ink: '#041612' },
}

function ModulePage({ module: mod, onBack, onOpenTopic }) {
  const saved   = safeGetModuleState(mod.id)
  const screenIdx = saved.screen || 0
  const hasStarted = (saved.hookDone && saved.wylDone) || screenIdx > 0

  const topics = (mod.screens || []).map((screen, i) => ({
    number: i + 1,
    title: screen.label || screen.heading || `Topic ${i + 1}`,
    hook: screen.sub || screen.kicker || screen.heading || '',
    status: !hasStarted ? 'not_started'
      : i < screenIdx ? 'completed'
      : i === screenIdx ? 'in_progress'
      : 'not_started',
  }))

  const palette   = SUBJECT_PALETTES[mod.subject] || SUBJECT_PALETTES.History
  const { sand, bronze, cream, espresso, ink } = palette
  const completed = topics.filter(t => t.status === 'completed').length
  const total     = topics.length
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

  const [ringPct, setRingPct] = useState(0)
  useEffect(() => { const t = setTimeout(() => setRingPct(pct), 80); return () => clearTimeout(t) }, [pct])

  const R       = 32.5
  const CIRCUM  = 2 * Math.PI * R
  const dashOff = CIRCUM * (1 - ringPct / 100)

  const heroImg = mod.headerImage || MODULE_HEADER_IMAGES[mod.id] || '/headers/history-medicine-through-time.png'
  const sandRgb = hexToRgb(sand)

  return (
    <div style={{ minHeight: '100vh', background: '#08090D', paddingBottom: 120, overflowX: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes mpNodePulse {
          0%,100% { box-shadow: 0 0 18px rgba(${sandRgb},0.32), 0 0 8px rgba(${sandRgb},0.18); }
          50%      { box-shadow: 0 0 30px rgba(${sandRgb},0.55), 0 0 14px rgba(${sandRgb},0.28); }
        }
        @media (max-width: 374px) {
          .mp-title { font-size: 38px !important; }
          .mp-topic-title { font-size: 19px !important; }
          .mp-cta { min-width: 112px !important; }
          .mp-ring { width: 64px !important; height: 64px !important; }
          .mp-page { padding-left: 20px !important; padding-right: 20px !important; }
          .mp-rail { width: 52px !important; }
        }
      `}</style>

      {/* ── CINEMATIC HEADER (285px) ── */}
      <div style={{ height: 285, position: 'relative', overflow: 'hidden' }}>
        {/* Artwork — right side */}
        <div style={{
          position: 'absolute', right: 0, top: 0, width: '58%', height: 250,
          backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0.78,
        }} />
        {/* Horizontal fade over artwork */}
        <div style={{
          position: 'absolute', right: 0, top: 0, width: '58%', height: 250,
          background: 'linear-gradient(to left, rgba(8,9,13,0) 0%, rgba(8,9,13,0.85) 70%, rgba(8,9,13,1) 100%)',
        }} />
        {/* Full-width left overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #08090D 0%, rgba(8,9,13,0.92) 38%, rgba(8,9,13,0.35) 100%)',
        }} />
        {/* Bottom fade into page background */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 110,
          background: 'linear-gradient(180deg, transparent 0%, #08090D 92%)',
        }} />

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 20, left: 24, zIndex: 10,
            width: 44, height: 44, borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.82)', fontSize: 20, fontFamily: "'Sora', sans-serif",
          }}
        >←</button>

        {/* Menu button */}
        <button
          style={{
            position: 'absolute', top: 20, right: 24, zIndex: 10,
            width: 44, height: 44, borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.82)', fontSize: 22, letterSpacing: 1,
          }}
        >···</button>

        {/* Text block — bottom-left */}
        <div style={{ position: 'absolute', bottom: 22, left: 24, right: '44%', zIndex: 5 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, lineHeight: '18px',
            letterSpacing: '0.14em', color: sand, textTransform: 'uppercase', marginBottom: 10,
          }}>{mod.subject || ''}</div>
          <div className="mp-title" style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 42, lineHeight: '44px',
            letterSpacing: '-0.02em', color: '#F5F7FF', maxWidth: 260,
          }}>{mod.title}</div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="mp-page" style={{ padding: '0 24px' }}>

        {/* ── PROGRESS CARD ── */}
        <div style={{
          width: '100%', borderRadius: 28, padding: '22px 24px', boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.055)',
          border: `1px solid ${sand}2E`,
          backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
          marginTop: -12, marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 15, lineHeight: '20px',
              color: 'rgba(255,255,255,0.66)',
            }}>Your progress</div>
            <div style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 28, lineHeight: '32px',
              color: '#F5F7FF', marginTop: 6,
            }}>{completed} of {total} completed</div>
            <div style={{ marginTop: 14, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${bronze}, ${sand})`,
                transition: 'width 700ms ease-out',
              }} />
            </div>
          </div>

          {/* Ring */}
          <div className="mp-ring" style={{ flexShrink: 0, width: 72, height: 72, position: 'relative' }}>
            <svg width={72} height={72} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              <circle cx={36} cy={36} r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={7} />
              <circle cx={36} cy={36} r={R} fill="none" stroke={sand} strokeWidth={7}
                strokeDasharray={CIRCUM} strokeDashoffset={dashOff}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 700ms ease-out', filter: `drop-shadow(0 0 5px ${sand}88)` }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 20, color: cream, lineHeight: 1,
              }}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* ── TOPIC SECTION LABEL ── */}
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, lineHeight: '18px',
          letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)',
          textTransform: 'uppercase', marginBottom: 18,
        }}>Your Topics</div>

        {/* ── TOPIC RAIL + CARDS ── */}
        <div>
          {topics.map((topic, i) => {
            const isCompleted = topic.status === 'completed'
            const isCurrent   = topic.status === 'in_progress'
            const isUpcoming  = topic.status === 'not_started'
            const isLast      = i === topics.length - 1

            const cardH    = isCurrent ? null : 102  // current card is auto-height
            const nodeSize = isCurrent ? 50 : isCompleted ? 44 : 42

            // Line segment colour: gold if the topic ABOVE this one is completed
            const lineAboveGold = i > 0 && topics[i - 1].status === 'completed'
            // Line below: gold if this topic is completed (flows into next node)
            const lineBelowGold = !isLast && isCompleted

            return (
              <div key={topic.number} style={{
                display: 'flex', gap: 14, alignItems: 'stretch',
                paddingBottom: isLast ? 0 : 14,
              }}>
                {/* Rail column */}
                <div className="mp-rail" style={{
                  width: 58, flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  {/* Line above node */}
                  <div style={{
                    width: 2, flexShrink: 0,
                    height: Math.max(0, ((isCurrent ? 108 : cardH) - nodeSize) / 2),
                    background: i === 0 ? 'transparent'
                      : lineAboveGold ? `linear-gradient(180deg, ${sand}, ${sand})`
                      : 'rgba(255,255,255,0.14)',
                  }} />

                  {/* NODE */}
                  {isCompleted && (
                    <div style={{
                      width: 44, height: 44, borderRadius: 999, flexShrink: 0,
                      background: `linear-gradient(135deg, ${bronze}, ${sand})`,
                      border: `1px solid ${cream}72`,
                      boxShadow: `0 0 20px rgba(${sandRgb},0.28), inset 0 1px 0 rgba(255,255,255,0.20)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                        <path d="M5 11.5L9 15.5L17 7" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  {isCurrent && (
                    <div style={{
                      width: 50, height: 50, borderRadius: 999, flexShrink: 0,
                      background: `rgba(${hexToRgb(espresso)},0.88)`,
                      border: `2px solid ${sand}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'mpNodePulse 2.8s ease-in-out infinite',
                    }}>
                      <span style={{
                        fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 20, color: cream, lineHeight: 1,
                      }}>{topic.number}</span>
                    </div>
                  )}
                  {isUpcoming && (
                    <div style={{
                      width: 42, height: 42, borderRadius: 999, flexShrink: 0,
                      background: 'rgba(255,255,255,0.035)',
                      border: '1.5px solid rgba(255,255,255,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 17,
                        color: 'rgba(255,255,255,0.45)', lineHeight: 1,
                      }}>{topic.number}</span>
                    </div>
                  )}

                  {/* Line below node — extends through paddingBottom gap too */}
                  {!isLast ? (
                    <div style={{
                      width: 2, flex: 1,
                      background: lineBelowGold
                        ? `linear-gradient(180deg, ${sand}, ${bronze})`
                        : 'rgba(255,255,255,0.14)',
                    }} />
                  ) : (
                    <div style={{ flex: 1 }} />
                  )}
                </div>

                {/* TOPIC CARD */}
                <button
                  onClick={() => onOpenTopic(topic, i)}
                  style={{
                    flex: 1,
                    ...(isCurrent ? { minHeight: 108 } : { height: cardH }),
                    alignSelf: 'flex-start',
                    borderRadius: 22,
                    padding: isCurrent ? '16px 18px 16px 20px' : '18px 18px 18px 20px',
                    cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: isCurrent ? 'column' : 'row',
                    alignItems: isCurrent ? 'flex-start' : 'center',
                    justifyContent: 'space-between', gap: isCurrent ? 10 : 12,
                    border: isCurrent
                      ? `1.5px solid ${sand}BF`
                      : isCompleted
                        ? `1px solid rgba(${sandRgb},0.10)`
                        : '1px solid rgba(255,255,255,0.07)',
                    background: isCurrent
                      ? `linear-gradient(90deg, rgba(${hexToRgb(espresso)},0.42) 0%, rgba(255,255,255,0.055) 100%)`
                      : isCompleted
                        ? 'rgba(255,255,255,0.045)'
                        : 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: isCurrent ? `0 0 28px rgba(${sandRgb},0.22), inset 0 1px 0 rgba(255,255,255,0.08)` : 'none',
                    opacity: isUpcoming ? 0.78 : isCompleted ? 0.86 : 1,
                  }}
                >
                  {/* Text */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="mp-topic-title" style={{
                      fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 21, lineHeight: '25px',
                      color: '#F5F7FF', letterSpacing: '-0.01em',
                      ...(isCurrent
                        ? { wordBreak: 'break-word' }
                        : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
                    }}>{topic.title}</div>
                    {topic.hook && (
                      <div style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 15.5, lineHeight: '21px',
                        color: 'rgba(255,255,255,0.68)', marginTop: 5,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>{topic.hook}</div>
                    )}
                  </div>

                  {/* Right badge / CTA */}
                  {isCompleted && (
                    <div style={{
                      flexShrink: 0, height: 32, padding: '0 12px', borderRadius: 999,
                      background: 'rgba(46,125,72,0.22)',
                      border: '1px solid rgba(83,220,134,0.35)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 999,
                        background: 'rgba(83,220,134,0.3)', border: '1.5px solid #53DC86',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <svg width={9} height={9} viewBox="0 0 9 9" fill="none">
                          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#9FE8B6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13.5, color: '#9FE8B6', whiteSpace: 'nowrap' }}>Completed</span>
                    </div>
                  )}
                  {isCurrent && (
                    <button
                      onClick={e => { e.stopPropagation(); onOpenTopic(topic, i) }}
                      className="mp-cta"
                      style={{
                        alignSelf: 'flex-start',
                        height: 44, padding: '0 20px',
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${bronze}, ${sand})`,
                        border: 'none', cursor: 'pointer',
                        fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15,
                        color: ink, whiteSpace: 'nowrap',
                        boxShadow: `0 0 24px rgba(${sandRgb},0.30), inset 0 1px 0 rgba(255,255,255,0.22)`,
                        transition: 'transform 120ms ease',
                      }}
                    >Continue →</button>
                  )}
                  {isUpcoming && (
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        height: 32, padding: '0 12px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.075)',
                        display: 'flex', alignItems: 'center',
                        fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13.5,
                        color: 'rgba(255,255,255,0.62)', whiteSpace: 'nowrap',
                      }}>Not started</div>
                      <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 20, marginLeft: 8 }}>›</span>
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom nav — Subjects always selected */}
      <BottomNav tab="subjects" setTab={() => onBack()} />
    </div>
  )
}

// ─── Modules tab ──────────────────────────────────────────────────────────────

function ModuleCard({ title, subtitle, progress, accentColour, bgGradient, headerImage, icon, isSelected, onClick }) {
  const w = isSelected ? 174 : 154
  const h = isSelected ? 235 : 215
  return (
    <button
      onClick={onClick}
      style={{
        width: w, height: h, flexShrink: 0, position: 'relative',
        borderRadius: 18, overflow: 'hidden',
        cursor: 'pointer',
        border: isSelected ? `1.5px solid ${accentColour}` : '1px solid rgba(255,255,255,0.12)',
        background: bgGradient || '#0D0E10',
        padding: 0, textAlign: 'left',
        boxShadow: isSelected
          ? `0 0 30px ${accentColour}36, 0 12px 32px rgba(0,0,0,0.68), inset 0 1px 0 rgba(255,255,255,0.06)`
          : '0 4px 18px rgba(0,0,0,0.54), inset 0 1px 0 rgba(255,255,255,0.03)',
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
      {/* bottom text */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 12px 12px', zIndex: 2 }}>
        <div style={{
          fontWeight: 700, fontSize: 18, color: '#F5F7FF',
          lineHeight: '22px', marginBottom: 8, fontFamily: "'Sora', sans-serif",
          letterSpacing: '-0.01em',
        }}>{title}</div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: '.6rem', fontWeight: 800, color: accentColour, fontFamily: "'Outfit', sans-serif" }}>
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
            fontSize: 13, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#F5F2EA',
            fontFamily: "'Outfit', sans-serif",
          }}>{heading}</span>
          <span style={{ color: accent, fontSize: '.82rem', lineHeight: 1 }}>›</span>
        </div>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '.72rem', fontWeight: 600, color: accent, padding: 0,
          fontFamily: "'Outfit', sans-serif",
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
        display: 'flex', alignItems: 'center',
        paddingLeft: 18, paddingRight: 18, marginBottom: 14, gap: 8,
      }}>
        <img src={logoSrc} alt={subjectLabel} style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'cover' }} />
        <span style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)',
          fontFamily: "'Outfit', sans-serif", lineHeight: '18px',
        }}>{subjectLabel}</span>
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

// ─── SubjectBrowser ────────────────────────────────────────────────────────────

const SUBJECT_HEADER_IMGS = {
  History:   '/headers/history-medicine-through-time.png',
  Biology:   '/headers/bio-main.png',
  Chemistry: '/headers/history-elizabethan.png',
  Maths:     '/headers/maths-main.png',
  Sociology: '/headers/sociology-main.png',
  English:   '/headers/history-usa-conflict.png',
  Physics:   '/headers/history-spain-new-world.png',
}

const SUBJECT_DISPLAY_TITLES = {
  History:   'Medicine Through Time',
  Biology:   'AQA Biology',
  Chemistry: 'AQA Chemistry',
  Maths:     'AQA Mathematics',
  Sociology: 'AQA Sociology',
  English:   'AQA English',
  Physics:   'AQA Physics',
}

function getSubjectModuleList(subjectName) {
  const real = MODULES.filter(m => m.subject === subjectName)
  const cs = (arr) => arr.map(x => ({ ...x, comingSoon: true }))
  switch (subjectName) {
    case 'History':
      return [
        ...real,
        ...cs([
          { id: 'cs_usa',   title: 'USA: Conflict at Home & Abroad', subtitle: 'AQA History · Period Study' },
          { id: 'cs_eliz',  title: 'Early Elizabethans 1558–88',     subtitle: 'Elizabethan England' },
          { id: 'cs_spain', title: 'Spain & the New World',          subtitle: 'British Depth Study' },
        ]),
      ]
    case 'English':
      return cs([
        { id: 'cs_macbeth',   title: 'Macbeth',                subtitle: 'Shakespeare · Power & Ambition' },
        { id: 'cs_inspector', title: 'An Inspector Calls',     subtitle: 'J.B. Priestley' },
        { id: 'cs_poetry',    title: 'Power & Conflict Poetry',subtitle: 'AQA Anthology · 15 poems' },
        { id: 'cs_lang1',     title: 'Language Paper 1',       subtitle: 'Reading & Creative Writing' },
        { id: 'cs_lang2',     title: 'Language Paper 2',       subtitle: 'Non-fiction & Argument' },
      ])
    case 'Physics':
      return cs([
        { id: 'cs_forces', title: 'Forces & Motion',     subtitle: 'AQA Physics · Topic 5 & 6' },
        { id: 'cs_energy', title: 'Energy',              subtitle: 'AQA Physics · Topic 1' },
        { id: 'cs_waves',  title: 'Waves & Electricity', subtitle: 'AQA Physics · Topic 6 & 2' },
        { id: 'cs_space',  title: 'Space',               subtitle: 'AQA Physics · Topic 8' },
        { id: 'cs_matter', title: 'Matter & Particles',  subtitle: 'AQA Physics · Topic 3 & 4' },
      ])
    default:
      if (real.length > 0) return real
      return cs([{ id: `cs_${subjectName.toLowerCase()}`, title: 'Content coming soon', subtitle: subjectName }])
  }
}

function SubjectBrowser({ subjectName, onBack, onOpenModule }) {
  const palette      = SUBJECT_PALETTES[subjectName] || SUBJECT_PALETTES.History
  const { sand, bronze, cream, espresso } = palette
  const sandRgb      = hexToRgb(sand)
  const espressoRgb  = hexToRgb(espresso)
  const headerImg    = SUBJECT_HEADER_IMGS[subjectName]    || '/headers/history-medicine-through-time.png'
  const displayTitle = SUBJECT_DISPLAY_TITLES[subjectName] || subjectName

  const rawMods = getSubjectModuleList(subjectName)
  const items = rawMods.map((mod, i) => {
    if (mod.comingSoon) return { ...mod, number: i + 1, status: 'coming_soon', pct: 0 }
    const s = safeGetModuleState(mod.id)
    const screen = s.screen || 0
    const hasStarted = (s.hookDone && s.wylDone) || screen > 0
    const total = mod.screens?.length || 1
    const pct = Math.min(100, Math.round((screen / total) * 100))
    const status = pct >= 100 ? 'completed' : hasStarted ? 'in_progress' : 'not_started'
    return { ...mod, number: i + 1, status, pct }
  })

  const completedCount = items.filter(m => m.status === 'completed').length
  const realCount      = items.filter(m => m.status !== 'coming_soon').length
  const overallPct     = realCount > 0 ? Math.round((completedCount / realCount) * 100) : 0

  const [ringPct, setRingPct] = useState(0)
  useEffect(() => { const t = setTimeout(() => setRingPct(overallPct), 80); return () => clearTimeout(t) }, [overallPct])

  const R      = 32.5
  const CIRCUM = 2 * Math.PI * R
  const dashOff = CIRCUM * (1 - ringPct / 100)

  function handleCardClick(item) {
    if (item.status === 'coming_soon') return
    const realMod = MODULES.find(m => m.id === item.id)
    if (realMod && onOpenModule) onOpenModule(realMod)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08090D', paddingBottom: 120, overflowX: 'hidden' }}>
      <style>{`
        @keyframes sbPulse {
          0%,100% { box-shadow: 0 0 18px rgba(${sandRgb},0.32), 0 0 8px rgba(${sandRgb},0.18); }
          50%      { box-shadow: 0 0 30px rgba(${sandRgb},0.55), 0 0 14px rgba(${sandRgb},0.28); }
        }
      `}</style>

      {/* ── CINEMATIC HEADER ── */}
      <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${headerImg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.92,
        }} />
        {/* Subtle left fade — keeps top of image bright */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '68%',
          background: 'linear-gradient(to right, rgba(8,9,13,0.70) 0%, rgba(8,9,13,0.22) 65%, transparent 100%)',
        }} />
        {/* Bottom fade to page bg only */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 85,
          background: 'linear-gradient(180deg, transparent 0%, #08090D 100%)',
        }} />
        <button onClick={onBack} style={{
          position: 'absolute', top: 20, left: 24, zIndex: 10,
          width: 44, height: 44, borderRadius: 999,
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.85)', fontSize: 20, fontFamily: "'Sora', sans-serif",
        }}>←</button>
        <div style={{ position: 'absolute', bottom: 18, left: 24, right: '35%', zIndex: 5 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 11,
            letterSpacing: '0.16em', color: sand, textTransform: 'uppercase', marginBottom: 7,
          }}>{subjectName}</div>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 24, lineHeight: '28px',
            letterSpacing: '-0.01em', color: '#F5F7FF',
          }}>{displayTitle}</div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: '0 24px' }}>

        {/* Progress card */}
        <div style={{
          width: '100%', borderRadius: 28, padding: '20px 22px', boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.055)', border: `1px solid ${sand}2A`,
          backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
          marginTop: -10, marginBottom: 26,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>Your progress</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26, lineHeight: '30px', color: '#F5F7FF', marginTop: 5 }}>
              {completedCount} of {realCount} completed
            </div>
            <div style={{ marginTop: 12, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.10)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999, width: `${overallPct}%`,
                background: `linear-gradient(90deg, ${bronze}, ${sand})`,
                transition: 'width 700ms ease-out',
              }} />
            </div>
          </div>
          <div style={{ flexShrink: 0, width: 70, height: 70, position: 'relative' }}>
            <svg width={70} height={70} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              <circle cx={36} cy={36} r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={7} />
              <circle cx={36} cy={36} r={R} fill="none" stroke={sand} strokeWidth={7}
                strokeDasharray={CIRCUM} strokeDashoffset={dashOff} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 700ms ease-out', filter: `drop-shadow(0 0 5px ${sand}88)` }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: cream, lineHeight: 1 }}>{overallPct}%</span>
            </div>
          </div>
        </div>

        {/* Section label */}
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12,
          letterSpacing: '0.16em', color: 'rgba(255,255,255,0.40)',
          textTransform: 'uppercase', marginBottom: 16,
        }}>Your Modules</div>

        {/* Rail */}
        <div>
          {items.map((item, i) => {
            const isCompleted = item.status === 'completed'
            const isCurrent   = item.status === 'in_progress'
            const isComing    = item.status === 'coming_soon'
            const isLast      = i === items.length - 1
            const nodeSize    = isCurrent ? 50 : isCompleted ? 44 : 42
            const cardH       = 96
            const lineAboveGold = i > 0 && items[i - 1].status === 'completed'
            const lineBelowGold = !isLast && isCompleted
            const desc = item.subtitle || item.era || ''
            return (
              <div key={item.id} style={{ display: 'flex', gap: 14, alignItems: 'stretch', paddingBottom: isLast ? 0 : 14 }}>

                {/* Rail column */}
                <div style={{ width: 56, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 2, flexShrink: 0,
                    height: Math.max(0, ((isCurrent ? 108 : cardH) - nodeSize) / 2),
                    background: i === 0 ? 'transparent' : lineAboveGold ? sand : 'rgba(255,255,255,0.14)',
                  }} />
                  {isCompleted && (
                    <div style={{
                      width: 44, height: 44, borderRadius: 999, flexShrink: 0,
                      background: `linear-gradient(135deg, ${bronze}, ${sand})`,
                      border: `1px solid ${cream}72`,
                      boxShadow: `0 0 20px rgba(${sandRgb},0.28), inset 0 1px 0 rgba(255,255,255,0.20)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                        <path d="M5 11.5L9 15.5L17 7" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  {isCurrent && (
                    <div style={{
                      width: 50, height: 50, borderRadius: 999, flexShrink: 0,
                      background: `rgba(${espressoRgb},0.88)`, border: `2px solid ${sand}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'sbPulse 2.8s ease-in-out infinite',
                    }}>
                      <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 20, color: cream, lineHeight: 1 }}>{item.number}</span>
                    </div>
                  )}
                  {!isCompleted && !isCurrent && (
                    <div style={{
                      width: 42, height: 42, borderRadius: 999, flexShrink: 0,
                      background: 'rgba(255,255,255,0.035)', border: '1.5px solid rgba(255,255,255,0.16)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 16,
                        color: isComing ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.42)', lineHeight: 1,
                      }}>{item.number}</span>
                    </div>
                  )}
                  {!isLast ? (
                    <div style={{ width: 2, flex: 1, background: lineBelowGold ? `linear-gradient(180deg, ${sand}, ${bronze})` : 'rgba(255,255,255,0.14)' }} />
                  ) : <div style={{ flex: 1 }} />}
                </div>

                {/* Card */}
                <button
                  onClick={() => handleCardClick(item)}
                  style={{
                    flex: 1,
                    ...(isCurrent ? { minHeight: 108 } : { height: cardH }),
                    alignSelf: 'flex-start',
                    borderRadius: 22, boxSizing: 'border-box',
                    padding: isCurrent ? '16px 18px 16px 20px' : '0 18px 0 20px',
                    cursor: isComing ? 'default' : 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: isCurrent ? 'column' : 'row',
                    alignItems: isCurrent ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    gap: isCurrent ? 8 : 12,
                    border: isCurrent
                      ? `1.5px solid ${sand}CC`
                      : isCompleted
                        ? `1px solid rgba(${sandRgb},0.12)`
                        : '1px solid rgba(255,255,255,0.07)',
                    background: isCurrent
                      ? `linear-gradient(90deg, rgba(${espressoRgb},0.45) 0%, rgba(255,255,255,0.05) 100%)`
                      : isCompleted ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.028)',
                    opacity: isComing ? 0.42 : 1,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Sora', sans-serif", fontWeight: 700,
                      fontSize: isCurrent ? 20 : 16, lineHeight: isCurrent ? '24px' : '20px',
                      color: '#F5F7FF', marginBottom: desc ? 4 : 0,
                    }}>{item.title}</div>
                    {desc ? (
                      <div style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: 13,
                        color: 'rgba(255,255,255,0.46)', lineHeight: '17px',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>{desc}</div>
                    ) : null}
                    {isCurrent && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCardClick(item) }}
                        style={{
                          marginTop: 14, padding: '10px 22px',
                          background: `linear-gradient(90deg, ${bronze}, ${sand})`,
                          border: 'none', borderRadius: 14, cursor: 'pointer',
                          fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15,
                          color: '#14110E', boxShadow: `0 4px 14px rgba(${sandRgb},0.38)`,
                        }}
                      >Continue →</button>
                    )}
                  </div>
                  {isCompleted && (
                    <div style={{
                      flexShrink: 0, alignSelf: 'center',
                      background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.28)',
                      borderRadius: 999, padding: '6px 12px',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#4ADE80" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, color: '#4ADE80', whiteSpace: 'nowrap' }}>Completed</span>
                    </div>
                  )}
                  {isComing && (
                    <div style={{
                      flexShrink: 0, alignSelf: 'center',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 999, padding: '6px 12px',
                    }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.32)', whiteSpace: 'nowrap' }}>Coming soon</span>
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav tab="subjects" setTab={() => onBack()} />
    </div>
  )
}

function HistoryMedicineBrowser({ onBack, onOpenModule }) {
  const histMods = MODULES.filter(m => m.subject === 'History')
  const palette  = SUBJECT_PALETTES.History
  const { sand, bronze, cream } = palette

  function modPct(mod) {
    if (!mod?.screens) return 0
    const s = safeGetModuleState(mod.id)
    const screen = s.screen || 0
    const hasStarted = (s.hookDone && s.wylDone) || screen > 0
    if (!hasStarted) return 0
    return Math.min(100, Math.round((screen / mod.screens.length) * 100))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08090D', paddingBottom: 120, overflowX: 'hidden' }}>

      {/* Cinematic header */}
      <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/headers/history-medicine-through-time.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.72,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #08090D 0%, rgba(8,9,13,0.88) 42%, rgba(8,9,13,0.28) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(180deg, transparent 0%, #08090D 100%)' }} />

        {/* Back button */}
        <button onClick={onBack} style={{
          position: 'absolute', top: 20, left: 24, zIndex: 10,
          width: 44, height: 44, borderRadius: 999,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.82)', fontSize: 20, fontFamily: "'Sora', sans-serif",
        }}>←</button>

        {/* Title block */}
        <div style={{ position: 'absolute', bottom: 20, left: 24, zIndex: 5 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: sand, marginBottom: 6,
          }}>HISTORY</div>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 28, lineHeight: '32px',
            letterSpacing: '-0.01em', color: '#F5F7FF',
          }}>Medicine Through Time</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.42)', marginTop: 4 }}>
            {histMods.length} modules · AQA History
          </div>
        </div>
      </div>

      {/* Module list */}
      <div style={{ padding: '16px 24px 0' }}>
        {histMods.map((mod, i) => {
          const pct = modPct(mod)
          const isStarted = pct > 0
          return (
            <button
              key={mod.id}
              onClick={() => onOpenModule && onOpenModule(mod)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                background: 'rgba(255,255,255,0.045)',
                border: `1px solid rgba(255,255,255,${isStarted ? '0.10' : '0.06'})`,
                borderRadius: 20, padding: '16px 18px', marginBottom: 10,
                cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Module number */}
              <div style={{
                width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                background: isStarted ? `linear-gradient(135deg, ${bronze}, ${sand})` : 'rgba(255,255,255,0.06)',
                border: isStarted ? `1px solid ${sand}60` : '1px solid rgba(255,255,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14,
                  color: isStarted ? '#14110E' : 'rgba(255,255,255,0.38)',
                }}>{i + 1}</span>
              </div>

              {/* Text + progress */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, lineHeight: '20px',
                  color: '#F5F7FF', marginBottom: 3,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{mod.title}</div>
                {mod.era && (
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 8 }}>
                    {mod.era}
                  </div>
                )}
                <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    width: pct + '%', height: '100%', borderRadius: 99,
                    background: `linear-gradient(90deg, ${bronze}, ${sand})`,
                    boxShadow: pct > 0 ? `0 0 6px ${sand}66` : 'none',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {/* % + chevron */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13,
                  color: isStarted ? sand : 'rgba(255,255,255,0.22)',
                }}>{pct}%</span>
                <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 18 }}>›</span>
              </div>
            </button>
          )
        })}
      </div>

      <BottomNav tab="subjects" setTab={() => onBack()} />
    </div>
  )
}

function ModulesTab({ onOpenModule }) {
  const { user } = useAuth()
  const modUserName = user?.name || 'you'
  const [subjectBrowser, setSubjectBrowser] = useState(null)

  if (subjectBrowser) {
    return <SubjectBrowser subjectName={subjectBrowser} onBack={() => setSubjectBrowser(null)} onOpenModule={onOpenModule} />
  }

  function modPct(mod) {
    if (!mod || !mod.screens) return 0
    const s = safeGetModuleState(mod.id)
    const screen = s.screen || 0
    return Math.min(100, Math.round((screen / mod.screens.length) * 100))
  }

  const histAllMods = MODULES.filter(m => m.subject === 'History')
  const medMods = histAllMods  // mod1-mod5 are all Medicine Through Time sub-topics
  const continueRaw = medMods.find(m => { const p = modPct(m); return p > 0 && p < 100 }) || medMods[0]
  const continuePct = modPct(continueRaw) || 0
  const selectedId = continueRaw?.id || 'mod1'
  const continueAccent = continueRaw?.color || '#C89B6D'
  const continueHeaderImage = MODULE_HEADER_IMAGES[selectedId] || '/headers/history-medicine-through-time.png'

  // Medicine Through Time progress = average across all 5 sub-modules
  const medPct = Math.round(medMods.reduce((sum, m) => sum + modPct(m), 0) / Math.max(medMods.length, 1))

  const historyGroupCards = [
    { id: 'med_through_time',    title: 'Medicine Through Time',          subtitle: '', progress: medPct, locked: false, isSelected: false, bg: '#0D0E10', accent: '#C89B6D', headerImage: '/headers/history-medicine-through-time.png' },
    { id: 'usa_conflict',        title: 'USA: Conflict at Home & Abroad', subtitle: '', progress: 0,      locked: false, isSelected: false, bg: '#0D0E10', accent: '#C89B6D', headerImage: '/headers/history-usa-conflict.png' },
    { id: 'early_elizabethans',  title: 'Early Elizabethans',             subtitle: '', progress: 0,      locked: false, isSelected: false, bg: '#0D0E10', accent: '#C89B6D', headerImage: '/headers/history-elizabethan.png' },
    { id: 'spain_new_world',     title: 'Spain & the New World',          subtitle: '', progress: 0,      locked: false, isSelected: false, bg: '#0D0E10', accent: '#C89B6D', headerImage: '/headers/history-spain-new-world.png' },
  ]

  const englishGroupCards = [
    { id: 'eng_macbeth',   title: 'Macbeth',                    subtitle: '', progress: 0, locked: false, isSelected: false, bg: '#0D0E10', accent: '#B66DFF', headerImage: '/headers/english-macbeth.png' },
    { id: 'eng_inspector', title: 'An Inspector Calls',         subtitle: '', progress: 0, locked: false, isSelected: false, bg: '#0D0E10', accent: '#B66DFF', headerImage: '/headers/english-inspector.png' },
    { id: 'eng_poetry',    title: 'Poetry',                     subtitle: '', progress: 0, locked: false, isSelected: false, bg: '#0D0E10', accent: '#B66DFF', headerImage: '/headers/english-poetry.png' },
    { id: 'eng_lang1',     title: 'Reading Between the Lines',  subtitle: '', progress: 0, locked: false, isSelected: false, bg: '#0D0E10', accent: '#B66DFF', headerImage: '/headers/english-reading.png' },
  ]

  const physicsGroupCards = [
    { id: 'phys_forces',  title: 'Forces & Motion',    subtitle: '', progress: 0, locked: false, isSelected: false, bg: '#0D0E10', accent: '#3B82F6', headerImage: '/headers/physics-forces.png' },
    { id: 'phys_energy',  title: 'Energy & Power',     subtitle: '', progress: 0, locked: false, isSelected: false, bg: '#0D0E10', accent: '#3B82F6', headerImage: '/headers/physics-energy.png' },
    { id: 'phys_waves',   title: 'Waves & Electricity',subtitle: '', progress: 0, locked: false, isSelected: false, bg: '#0D0E10', accent: '#3B82F6', headerImage: '/headers/physics-waves.png' },
    { id: 'phys_space',   title: 'Space',               subtitle: '', progress: 0, locked: false, isSelected: false, bg: '#0D0E10', accent: '#3B82F6', headerImage: '/headers/physics-space.png' },
    { id: 'phys_matter',  title: 'Matter & Particles',  subtitle: '', progress: 0, locked: false, isSelected: false, bg: '#0D0E10', accent: '#3B82F6', headerImage: '/headers/physics-matter.png' },
  ]


  function handleModuleClick(mod) {
    if (mod.id === 'med_through_time' || mod.id === 'usa_conflict' || mod.id === 'early_elizabethans' || mod.id === 'spain_new_world') {
      setHistoryOpen(true); return
    }
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

  const mathsGroupCards = MATHS_GROUPS.map(group => {
    const realMod = MODULES.find(m => m.id === group.id)
    const pct = realMod ? modPct(realMod) : 0
    return { id: group.id, title: group.title, subtitle: group.subtitle, icon: group.icon, accent: group.accent, headerImage: group.headerImage, progress: pct, locked: false, isSelected: false, bg: '#0D0E10' }
  })

  const sociologyGroupCards = SOCIOLOGY_GROUPS.map(group => ({
    id: group.id,
    title: group.title,
    subtitle: group.subtitle,
    icon: group.icon,
    accent: group.accent,
    headerImage: group.headerImage,
    progress: 0,
    locked: group.locked,
    isSelected: false,
    bg: '#0D0E10',
    filterPrefix: group.filterPrefix,
  }))

  const heroBg = [
    'linear-gradient(90deg, #05070B 0%, rgba(5,7,11,0.92) 28%, rgba(5,7,11,0.40) 62%, rgba(5,7,11,0.08) 100%)',
    'radial-gradient(ellipse at 84% 62%, rgba(185,115,30,0.56) 0%, rgba(95,52,14,0.34) 30%, transparent 62%)',
    'radial-gradient(ellipse at 76% 26%, rgba(225,158,42,0.24) 0%, transparent 44%)',
    'radial-gradient(ellipse at 92% 48%, rgba(148,82,22,0.30) 0%, transparent 40%)',
    'linear-gradient(175deg, #0E0B05 0%, #13110A 42%, #1C1610 70%, #0F0E07 100%)',
  ].join(', ')

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', paddingBottom: 108, overflowX: 'hidden' }}>

      {/* ── HERO — header only ── */}
      <div style={{ width: '100%', position: 'relative', background: heroBg, overflow: 'hidden', paddingBottom: 14 }}>
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
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Subjects</div>
          <StreakChip />
        </div>
      </div>

      {/* ── KEEP GOING heading ── */}
      <div style={{ padding: '14px 18px 0' }}>
        <div style={{
          color: '#F5F7FF', fontWeight: 800, fontSize: 36,
          lineHeight: 1.05, marginBottom: 0,
          fontFamily: "'Sora', sans-serif",
          letterSpacing: '-0.02em',
        }}>Keep going.</div>
      </div>

      {/* ── CONTINUE LEARNING CARD ── */}
      <div style={{ padding: '14px 18px 0', position: 'relative', zIndex: 10 }}>
        <div style={{
          borderRadius: 22,
          border: `1px solid ${continueAccent}4D`,
          position: 'relative', overflow: 'hidden', minHeight: 190,
          background: '#0B0703',
        }}>
          {/* Cinematic header image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${continueHeaderImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center right',
            filter: 'saturate(0.85) contrast(0.9)',
          }} />
          {/* Dark left overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(5,7,11,0.97) 0%, rgba(5,7,11,0.88) 40%, rgba(5,7,11,0.45) 65%, rgba(5,7,11,0.08) 100%)',
          }} />
          {/* Content sits above overlays */}
          <div style={{ position: 'relative', zIndex: 2, padding: '20px 18px' }}>

          <div style={{ paddingRight: 62 }}>
            <div style={{
              fontSize: '.58rem', fontWeight: 800, letterSpacing: '.30em',
              textTransform: 'uppercase', color: continueAccent, marginBottom: 4,
              fontFamily: "'Outfit', sans-serif",
            }}>Continue Learning</div>
            <div style={{ fontSize: '.72rem', color: '#7D7988', marginBottom: 5, fontFamily: "'Outfit', sans-serif" }}>
              {continueRaw?.subject || 'History'} · Module {continueRaw?.number || 3}
            </div>
            <div style={{
              color: '#F5F2EA', fontWeight: 700, fontSize: '1.12rem',
              lineHeight: 1.18, marginBottom: 3, fontFamily: "'Outfit', sans-serif",
            }}>{continueRaw?.title || 'Surgery & Anatomy'}</div>
            <div style={{ color: '#B8B4C2', fontSize: '.75rem', marginBottom: 14, fontFamily: "'Outfit', sans-serif" }}>
              {continueRaw?.subtitle || 'Hold Him Down and Hope'}
            </div>
            {/* Progress */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '.6rem', color: continueAccent, fontWeight: 700, marginBottom: 5, fontFamily: "'Outfit', sans-serif" }}>{continuePct}%</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.10)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: continuePct + '%', height: '100%', background: continueAccent, borderRadius: 99, boxShadow: `0 0 8px ${continueAccent}88` }} />
              </div>
            </div>
            <button
              onClick={() => { const m = MODULES.find(x => x.id === selectedId); if (m && onOpenModule) onOpenModule(m) }}
              style={{
                height: 58, paddingLeft: 24, paddingRight: 24,
                background: `linear-gradient(90deg, ${continueAccent}AA, ${continueAccent})`,
                border: 'none', borderRadius: 18, cursor: 'pointer',
                color: '#fff', fontWeight: 700, fontSize: 20,
                fontFamily: "'Sora', sans-serif",
                letterSpacing: '-0.01em', lineHeight: '20px',
                boxShadow: `0 4px 18px ${continueAccent}44`,
                display: 'inline-flex', alignItems: 'center', gap: 7,
              }}>▶ Continue Module</button>
          </div>
          </div>{/* close relative zIndex content wrapper */}
        </div>
      </div>

      {/* ── WEAK AREA CARD ── */}
      {(() => {
        const improvements = getImprovements()
        const worst = [...improvements].sort((a,b) => (a.recentAvg||100)-(b.recentAvg||100))[0]
        const weakLabel = worst?.subject || 'History'
        const weakPct   = worst?.recentAvg ?? null
        return (
          <div style={{ padding: '14px 18px 0' }}>
            <button onClick={() => setSubjectBrowser(weakLabel)} style={{ width: '100%', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 24, position: 'relative', textAlign: 'left', display: 'block' }}>
              <div style={{ position: 'absolute', inset: -1, borderRadius: 25, background: 'linear-gradient(135deg, rgba(251,113,133,0.2) 0%, rgba(139,92,246,0.15) 100%)', filter: 'blur(1.5px)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1, background: 'rgba(17,24,39,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 24, border: '1px solid rgba(251,113,133,0.18)', boxShadow: '0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)', padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, overflow: 'hidden', background: '#0D1117', boxShadow: '0 0 20px rgba(45,212,191,0.35), inset 0 0 0 1px rgba(45,212,191,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/icons/brain-icon.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#FB7185', textTransform: 'uppercase', marginBottom: 3 }}>Weak Zone</div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: '#F4EFE6', lineHeight: 1.2, marginBottom: 4 }}>{weakLabel}</div>
                  {weakPct !== null && (
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#9CA3AF' }}>
                      Recent score: <span style={{ color: '#2DD4BF', textShadow: '0 0 10px rgba(45,212,191,0.5)', fontWeight: 700 }}>{weakPct}%</span>
                    </div>
                  )}
                </div>
                <div style={{ flexShrink: 0, background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.28)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 10, padding: '8px 10px', fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, color: '#C4B5FD', lineHeight: 1.3, textAlign: 'center' }}>
                  Review<br />now ›
                </div>
              </div>
            </button>
          </div>
        )
      })()}

      {/* ── SUBJECT SECTIONS ── */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <SubjectLogoSection subjectLabel="History"   logoSrc="/headers/history-main.png"    accent="#C89B6D" groups={historyGroupCards}  onGroupClick={() => setSubjectBrowser('History')} />
        <SubjectLogoSection subjectLabel="English"   logoSrc="/headers/english-main.png"    accent="#B66DFF" groups={englishGroupCards}  onGroupClick={() => setSubjectBrowser('English')} />
        <BiologySection groups={biologyGroupCards} onGroupClick={() => setSubjectBrowser('Biology')} />
        <SubjectLogoSection subjectLabel="Chemistry" logoSrc="/headers/chem-logo.png"       accent="#9B59E8" groups={chemGroupCards}     onGroupClick={() => setSubjectBrowser('Chemistry')} />
        <SubjectLogoSection subjectLabel="Maths"     logoSrc="/headers/maths-main.png"      accent="#2DD4BF" groups={mathsGroupCards}    onGroupClick={() => setSubjectBrowser('Maths')} />
        <SubjectLogoSection subjectLabel="Physics"   logoSrc="/headers/physics-main.png"    accent="#3B82F6" groups={physicsGroupCards}  onGroupClick={() => setSubjectBrowser('Physics')} />
        <SubjectLogoSection subjectLabel="Sociology" logoSrc="/headers/sociology-main.png"  accent="#FF5C7A" groups={sociologyGroupCards} onGroupClick={() => setSubjectBrowser('Sociology')} />
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
            <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'1.1rem', color:'#F5F7FB' }}>📐 AQA Formula Sheet</div>
            <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', color:'#5A6480', marginTop:2 }}>These are given in the exam — but worth knowing them cold</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.08)', border:'1px solid #2A3552', borderRadius:8, padding:'6px 14px', color:'#9CA8C7', cursor:'pointer', fontFamily:'inherit', fontSize:'.82rem' }}>✕</button>
        </div>
        {FORMULA_SHEET.map(cat => (
          <div key={cat.section} style={{ marginBottom:18 }}>
            <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#3B82FF', marginBottom:10 }}>{cat.section}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {cat.formulae.map(item => (
                <div key={item.name} style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.82rem', color:'#9CA8C7' }}>{item.name}</div>
                  <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F5F7FB', flexShrink:0 }}>{item.f}</div>
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
      <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#3B82FF', marginBottom:8 }}>📐 Diagram — from AQA past paper</div>
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
                <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:topicColor }}>{topicLabel}</span>
              </div>
              <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.9rem', color:'#F5F7FB' }}>
                Q{q.qNum} · {q.source}
              </div>
            </div>
            {isMathsQ && (<div style={{ display:'flex', gap:6, flexShrink:0 }}>{isCalc
                      ? <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(56,210,122,.1)', border:'1px solid rgba(56,210,122,.25)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#38D27A' }}>🖩 Calculator OK</div>
                      : <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,200,87,.07)', border:'1px solid rgba(255,200,87,.18)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#FFC857' }}>✏️ No Calculator</div>
              }
              <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#70B8FF', cursor:'pointer' }}>📐 Formulae</button>
            </div>)}
          </div>
          {/* Progress */}
          <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${((qIdx+1)/total)*100}%`, background:`linear-gradient(90deg,${topicColor}88,${topicColor})`, borderRadius:99, transition:'width .4s ease' }} />
          </div>
          <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.62rem', color:'#4A5578', marginTop:5, textAlign:'right' }}>{qIdx+1} / {total}</div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px 20px' }}>
        {/* Marks badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:`${topicColor}18`, border:`1px solid ${topicColor}44`, borderRadius:99, padding:'4px 13px', marginBottom:14 }}>
          <span style={{ fontFamily:"'Sora', sans-serif", fontSize:'.78rem', fontWeight:700, color:topicColor }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
        </div>

        {/* Diagram */}
        {q.diagramKey && <MathsDiagram diagramKey={q.diagramKey} />}


        {/* Source extract or reference */}
        {q.extract && (() => {
          const isRealExtract = q.extract.startsWith('Lines') || q.extract.startsWith('"')
          return (
            <div style={{ background:'#0D1424', borderLeft:`3px solid ${topicColor}`, borderRadius:'0 12px 12px 0', padding:'14px 16px', marginBottom:14 }}>
              <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:topicColor, marginBottom:8 }}>
                {isRealExtract ? '📄 Source extract' : '📎 Where to find your source'}
              </div>
              <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', lineHeight:1.7, margin:0, color: isRealExtract ? '#C8D0E8' : '#9CA8C7', whiteSpace:'pre-wrap' }}>{q.extract}</p>
            </div>
          )
        })()}

        {/* Question */}
        <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:16, padding:'18px 18px', marginBottom:14 }}>
          <pre style={{ fontFamily:"'Outfit', sans-serif", fontSize:'1rem', lineHeight:1.7, margin:0, color:'#E0E6F0', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
        </div>

        {/* Mark tip */}
        {!showTip
          ? <button onClick={() => setTip(true)} style={{ background:'transparent', border:'1px dashed #2A3552', borderRadius:10, padding:'9px 14px', cursor:'pointer', color:'#4A5578', fontSize:'.82rem', fontFamily:"'Outfit', sans-serif", width:'100%', marginBottom:14 }}>💡 {isMathsQ ? 'How many steps do I need to show?' : 'What does this question need from me?'}</button>
          : <div style={{ background:'rgba(255,200,87,.05)', border:'1px solid rgba(255,200,87,.18)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
              <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FFC857', marginBottom:5 }}>{isMathsQ ? `${q.marks}-mark question` : `${q.marks} marks — what to write`}</div>
              <p style={{ fontFamily:"'Outfit', sans-serif", margin:0, fontSize:'.86rem', color:'#C8D0E8', lineHeight:1.55 }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
            </div>
        }

        {/* Answer area — only shown before feedback */}
        {!feedback && (
          q.type === 'mc' || q.type === 'mc_multi'
            ? <div style={{ marginBottom:16 }}>
                {q.type === 'mc_multi' && <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', color:'#5A6480', marginBottom:8 }}>Select all that apply ({q.marks} correct answers)</div>}
                {/* Hint card after first wrong MC attempt */}
                {mcHint && !mcLocked && (
                  <div style={{ background:'rgba(255,200,87,.06)', border:'1px solid rgba(255,200,87,.25)', borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
                    <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#FFC857', marginBottom:6 }}>💡 Hint — think about this</div>
                    <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.87rem', color:'#C8D0E8', margin:0, lineHeight:1.55 }}>
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
                    <button key={i} onClick={toggle} disabled={mcLocked} style={{ background:sel?`${topicColor}18`:'#151720', border:`1.5px solid ${sel?topicColor:'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'14px 16px', cursor:mcLocked?'default':'pointer', textAlign:'left', fontFamily:"'Outfit', sans-serif", fontSize:'.93rem', color:sel?topicColor:'#C8D0E8', transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ width:24, height:24, borderRadius:isMulti?'4px':'50%', border:`1.5px solid ${sel?topicColor:'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.75rem', fontWeight:700, color:sel?topicColor:'#4A5578', background:sel?`${topicColor}18`:'transparent' }}>{isMulti ? (sel ? '✓' : '') : String.fromCharCode(65+i)}</span>
                      {opt}
                    </button>
                  )
                })}
                </div>
              </div>
            : <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:14, padding:'14px', marginBottom:16 }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4A5578', marginBottom:8 }}>{isMathsQ ? 'Your working & answer' : 'Your answer'}</div>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder={isMathsQ ? (q.marks >= 3 ? 'Show all your working here…' : 'Write your answer…') : 'Write your answer here. Use quotes from the extract where relevant…'}
                  style={{ width:'100%', border:'none', background:'transparent', resize:'none', fontFamily:"'Outfit', sans-serif", fontSize:'.95rem', color:'#E0E6F0', lineHeight:1.7, outline:'none', minHeight: q.marks >= 4 ? 170 : q.marks >= 2 ? 110 : 65 }}
                />
              </div>
        )}

        {/* Error */}
        {error && <div style={{ background:'rgba(255,93,115,.08)', border:'1px solid rgba(255,93,115,.3)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}><p style={{ fontFamily:"'Outfit', sans-serif", margin:0, fontSize:'.86rem', color:'#FF5D73', lineHeight:1.5 }}>{error}</p></div>}

        {/* Feedback */}
        {feedback && gs && (
          <div className="fade-up">
            {/* Score card */}
            <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:18, padding:'20px', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ fontFamily:"'Sora', sans-serif", fontSize:'2rem', fontWeight:800, color:gs.text, lineHeight:1 }}>
                  {feedback.marksAwarded}<span style={{ fontSize:'1.1rem', opacity:.5 }}>/{feedback.marksAvailable}</span>
                </div>
                <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.8rem' }}>{feedback.grade}</div>
              </div>
              <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.9rem', color:gs.text, margin:0, lineHeight:1.55, opacity:.9 }}>{feedback.summary}</p>
            </div>

            {/* What they got right */}
            {feedback.achieved?.length > 0 && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4DFF88', marginBottom:10 }}>✓ What you got right</div>
                {feedback.achieved.map((a,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.achieved.length-1?8:0 }}>
                    <span style={{ color:'#4DFF88', flexShrink:0, fontSize:'.9rem' }}>✓</span>
                    <p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* What they missed */}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FF5D73', marginBottom:10 }}>→ Next time, also include</div>
                {feedback.missed.map((m,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.missed.length-1?8:0 }}>
                    <span style={{ color:'#FF5D73', flexShrink:0, fontSize:'.9rem' }}>→</span>
                    <p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{m}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Examiner tip */}
            {feedback.examinerTip && (
              <div style={{ background:'rgba(245,183,0,.05)', border:'1px solid rgba(245,183,0,.18)', borderRadius:13, padding:'14px', marginBottom:16 }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:6 }}>🗡️ Examiner tip</div>
                <p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{feedback.examinerTip}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <button onClick={reset} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:13, padding:'14px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:'pointer', color:'#9CA8C7', fontSize:'.88rem' }}>↩ Try again</button>
              <button onClick={onNext} style={{ background:`linear-gradient(135deg,${topicColor}cc,${topicColor})`, border:'none', borderRadius:13, padding:'14px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:'pointer', color:'#fff', fontSize:'.88rem', boxShadow:`0 4px 16px ${topicColor}44` }}>
                {qIdx < total-1 ? 'Next →' : 'Finish ✓'}
              </button>
            </div>
          </div>
        )}

        {/* Submit button — hidden for locked MC (feedback already shown inline) */}
        {!feedback && !(mcLocked) && (
          <button onClick={grade} disabled={grading || (q.type === 'mc' && !answer) || (q.type === 'mc_multi' && (!answer || answer.length === 0))}
            style={{ width:'100%', background:grading?'rgba(255,255,255,0.08)':`linear-gradient(135deg,${topicColor}cc,${topicColor})`, color:grading?'#4A5578':'#fff', border:'none', borderRadius:13, padding:'16px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:(grading||(q.type==='mc'&&!answer))?'default':'pointer', fontSize:'1rem', letterSpacing:'.01em', marginTop:4, boxShadow:grading?'none':`0 4px 20px ${topicColor}44`, transition:'all .2s',
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

function mathsTopicImg(id) {
  const n = id || ''
  if (['number','negatives','fractions','percentages','decimals','indices','surds','primes','bidmas','powers'].some(k => n.includes(k))) return '/headers/maths-numbers.png'
  if (['algebra','equations','inequalities','sequences','quadratic','expression','formula'].some(k => n.includes(k))) return '/headers/maths-algebra.png'
  if (['graph','gradient','coordinate','straight','linear_graph'].some(k => n.includes(k))) return '/headers/maths-algebra.png'
  if (['angles','area','volume','similarity','transforms','pythagoras','trig','geometry','polygon','shape','circle','perimeter'].some(k => n.includes(k))) return '/headers/maths-geometry.png'
  if (['statistics','probability','data','averages','mean','sampling','charts'].some(k => n.includes(k))) return '/headers/maths-data.png'
  if (['ratio','proportion','speed','density','money','finance','units'].some(k => n.includes(k))) return '/headers/maths-realworld.png'
  return '/headers/maths-main.png'
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
          <img src="/headers/maths-main.png" alt="Maths" style={{ width:32, height:32, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'1rem', color:'#F5F7FB' }}>AQA Maths — Topics</div>
            <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.72rem', color:'#5A6480' }}>{MATHS_TOPIC_GROUPS.length} topics · {totalQs} questions · AI marked</div>
          </div>
          <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:10, padding:'7px 12px', fontFamily:"'Outfit', sans-serif", fontSize:'.73rem', fontWeight:700, color:'#70B8FF', cursor:'pointer', flexShrink:0 }}>📐 Formulae</button>
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
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(59,130,255,.15)':'#151720', border:`1px solid ${filter===f.id?'#3B82FF':'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'9px 6px', fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', fontWeight:600, color:filter===f.id?'#70B8FF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

        {/* Topic grid */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background:'#151720', border:`1px solid #1E2A40`, borderRadius:16, padding:'16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, transition:'border-color .15s, transform .12s', width:'100%' }}>
              <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
                <img src={mathsTopicImg(group.id)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  {/* Mini progress-style pill */}
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:'0%', background:group.color, borderRadius:99 }} />
                  </div>
                  <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.68rem', fontWeight:600, color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  {group.calculator
                    ? <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', color:'#38D27A', flexShrink:0 }}>🖩</span>
                    : <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', color:'#FFC857', flexShrink:0 }}>✗</span>
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
          <img src="/headers/english-main.png" alt="English" style={{ width:32, height:32, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'1rem', color:'#F5F7FB' }}>AQA English Language</div>
            <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.72rem', color:'#5A6480' }}>Papers 1 & 2 · {ENGLISH_TOPIC_GROUPS.length} skill areas · {totalQs} questions · AI marked</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(157,92,255,.15)':'#151720', border:`1px solid ${filter===f.id?'#9D5CFF':'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'9px 6px', fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', fontWeight:600, color:filter===f.id?'#C18CFF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

        {/* Topic cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:16, padding:'16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, width:'100%' }}>
              <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
                <img src="/headers/english-main.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.93rem', color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.08)', borderRadius:99 }} />
                  <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.68rem', fontWeight:600, color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', color:'#4A5578', flexShrink:0 }}>{group.marks}m</span>
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
function SociologyBrowser({ onBack, filterPrefix = null }) {
  const [activeGroup, setGroup] = useState(null)
  const [filter, setFilter]     = useState('all')

  if (activeGroup) return <SociologyTopicView group={activeGroup} onBack={() => setGroup(null)} />

  const baseGroups = filterPrefix
    ? SOCIOLOGY_TOPIC_GROUPS.filter(g => g.id.startsWith(filterPrefix))
    : SOCIOLOGY_TOPIC_GROUPS

  const totalQs = baseGroups.reduce((s, g) => s + g.questions.length, 0)
  const filters = [
    { id: 'all', label: `All (${totalQs})` },
    { id: 'p1',  label: 'Paper 1' },
    { id: 'p2',  label: 'Paper 2' },
  ]
  const filtered = filter === 'all' ? baseGroups
    : filter === 'p1' ? baseGroups.filter(g => g.paper === 'Paper 1')
    : baseGroups.filter(g => g.paper === 'Paper 2')

  const socGroup = filterPrefix ? SOCIOLOGY_GROUPS.find(g => g.filterPrefix === filterPrefix) : null
  const headerTitle = socGroup ? socGroup.title : 'AQA Sociology'

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(8,12,26,.97)', borderBottom: '1px solid #1E2A40', backdropFilter: 'blur(14px)', padding: '14px 16px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A6480', fontSize: '1.1rem', padding: 0, flexShrink: 0 }}>←</button>
          <img src={socGroup?.headerImage || '/headers/sociology-main.png'} alt="Sociology" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F5F7FB' }}>{headerTitle}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.72rem', color: '#5A6480' }}>
              {baseGroups.length} topic area{baseGroups.length !== 1 ? 's' : ''} · {totalQs} questions · AI marked
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
              fontFamily: "'Outfit', sans-serif", fontSize: '.75rem', fontWeight: 600,
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
              <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={(() => {
                  const id = group.id
                  if (id.startsWith('soc_families'))     return '/headers/sociology-family.png'
                  if (id.startsWith('soc_education'))    return '/headers/sociology-education.png'
                  if (id.startsWith('soc_crime'))        return '/headers/sociology-crime.png'
                  if (id.startsWith('soc_stratification')) return '/headers/sociology-stratification.png'
                  return '/headers/sociology-main.png'
                })()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.93rem', color: '#F5F7FB', marginBottom: 3 }}>{group.label}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.75rem', color: '#5A6480', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.68rem', fontWeight: 600, color: group.color, flexShrink: 0 }}>{group.questions.length} Q{group.questions.length !== 1 ? 's' : ''}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.65rem', color: '#4A5578', flexShrink: 0 }}>{group.marks}m</span>
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
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#38D27A', marginBottom: 8 }}>
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
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color }}>Chemistry · {group.label}</span>
              </div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#F5F7FB' }}>
                {q.source} · {q.marks} mark{q.marks !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {group.calculator
                ? <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(56,210,122,.1)', border:'1px solid rgba(56,210,122,.25)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#38D27A' }}><span style={{fontSize:'.8rem'}}>🖩</span>Calculator OK</div>
                : <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,200,87,.07)', border:'1px solid rgba(255,200,87,.18)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#FFC857' }}><span style={{fontSize:'.8rem'}}>✏️</span>No Calculator</div>
              }
            </div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((qIdx+1)/qs.length)*100}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 99, transition: 'width .4s' }} />
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.62rem', color: '#4A5578', marginTop: 5, textAlign: 'right' }}>{qIdx+1} / {qs.length}</div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px 20px' }}>
        {/* Marks badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 99, padding: '4px 13px', marginBottom: 14 }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '.78rem', fontWeight: 700, color }}>[{q.marks} mark{q.marks !== 1 ? 's' : ''}]</span>
        </div>

        {/* Chemistry diagram image */}
        {q.imageKey && <ChemImage imageKey={q.imageKey} />}

        {/* Question */}
        <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 16, padding: '18px', marginBottom: 14 }}>
          <pre style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', lineHeight: 1.7, margin: 0, color: '#E0E6F0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{q.q}</pre>
        </div>

        {/* Skill tip */}
        {!showTip
          ? <button onClick={() => setTip(true)} style={{ background: 'transparent', border: '1px dashed #2A3552', borderRadius: 10, padding: '9px 14px', cursor: 'pointer', color: '#4A5578', fontSize: '.82rem', fontFamily: "'Outfit', sans-serif", width: '100%', marginBottom: 14 }}>💡 How many marks do I need to earn?</button>
          : <div style={{ background: 'rgba(255,200,87,.05)', border: '1px solid rgba(255,200,87,.18)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#FFC857', marginBottom: 5 }}>{q.marks}-mark question</div>
              <p style={{ fontFamily: "'Outfit', sans-serif", margin: 0, fontSize: '.86rem', color: '#C8D0E8', lineHeight: 1.55 }}>{CHEM_TIPS[q.marks] || CHEM_TIPS[4]}</p>
            </div>
        }

        {/* Answer — MC or written */}
        {!feedback && (
          (q.type === 'mc' || q.type === 'mc_multi')
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswer(opt)} style={{ background: answer === opt ? `${color}18` : '#151720', border: `1.5px solid ${answer === opt ? color : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: "'Outfit', sans-serif", fontSize: '.93rem', color: answer === opt ? color : '#C8D0E8', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${answer === opt ? color : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.72rem', fontWeight: 700, color: answer === opt ? color : '#4A5578', background: answer === opt ? `${color}18` : 'transparent' }}>{String.fromCharCode(65+i)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            : <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 14, padding: '14px', marginBottom: 16 }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#4A5578', marginBottom: 8 }}>Your answer</div>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Write your answer here. Show any working…" style={{ width: '100%', border: 'none', background: 'transparent', resize: 'none', fontFamily: "'Outfit', sans-serif", fontSize: '.95rem', color: '#E0E6F0', lineHeight: 1.7, outline: 'none', minHeight: q.marks >= 4 ? 160 : q.marks >= 2 ? 100 : 65 }} />
              </div>
        )}

        {/* Error */}
        {error && <div style={{ background: 'rgba(255,93,115,.08)', border: '1px solid rgba(255,93,115,.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}><p style={{ fontFamily: "'Outfit', sans-serif", margin: 0, fontSize: '.86rem', color: '#FF5D73' }}>{error}</p></div>}

        {/* Feedback */}
        {feedback && gs && (
          <div className="fade-up">
            <div style={{ background: gs.bg, border: `2px solid ${gs.border}`, borderRadius: 18, padding: '20px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', fontWeight: 800, color: gs.text, lineHeight: 1 }}>{feedback.marksAwarded}<span style={{ fontSize: '1.1rem', opacity: .5 }}>/{feedback.marksAvailable}</span></div>
                <div style={{ background: gs.badge, color: '#000', borderRadius: 99, padding: '5px 14px', fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.8rem' }}>{feedback.grade}</div>
              </div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.9rem', color: gs.text, margin: 0, lineHeight: 1.55, opacity: .9 }}>{feedback.summary}</p>
            </div>
            {feedback.achieved?.length > 0 && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#4DFF88', marginBottom: 10 }}>✓ What you got right</div>{feedback.achieved.map((a,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#4DFF88', flexShrink: 0 }}>✓</span><p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '.88rem', color: '#C8D0E8', lineHeight: 1.55 }}>{a}</p></div>)}</div>}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#FF5D73', marginBottom: 10 }}>→ Next time, also include</div>{feedback.missed.map((m,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#FF5D73', flexShrink: 0 }}>→</span><p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '.88rem', color: '#C8D0E8', lineHeight: 1.55 }}>{m}</p></div>)}</div>}
            {feedback.examinerTip && <div style={{ background: 'rgba(245,183,0,.05)', border: '1px solid rgba(245,183,0,.18)', borderRadius: 13, padding: '14px', marginBottom: 16 }}><div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#F5B700', marginBottom: 6 }}>🗡️ Examiner tip</div><p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '.88rem', color: '#C8D0E8', lineHeight: 1.55 }}>{feedback.examinerTip}</p></div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={reset} style={{ background: '#151720', border: '1px solid #2A3552', borderRadius: 13, padding: '14px', fontFamily: "'Sora', sans-serif", fontWeight: 700, cursor: 'pointer', color: '#9CA8C7', fontSize: '.88rem' }}>↩ Try again</button>
              <button onClick={next} style={{ background: `linear-gradient(135deg, ${color}cc, ${color})`, border: 'none', borderRadius: 13, padding: '14px', fontFamily: "'Sora', sans-serif", fontWeight: 700, cursor: 'pointer', color: '#fff', fontSize: '.88rem', boxShadow: `0 4px 16px ${color}44` }}>{qIdx < qs.length-1 ? 'Next →' : 'Finish ✓'}</button>
            </div>
          </div>
        )}

        {/* Submit */}
        {!feedback && (
          <button onClick={grade} disabled={grading} style={{ width: '100%', background: grading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${color}cc, ${color})`, color: grading ? '#4A5578' : '#fff', border: 'none', borderRadius: 13, padding: '16px', fontFamily: "'Sora', sans-serif", fontWeight: 700, cursor: grading ? 'default' : 'pointer', fontSize: '1rem', marginTop: 4, boxShadow: grading ? 'none' : `0 4px 20px ${color}44`, transition: 'all .2s' }}>
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
          <img src="/headers/chem-logo.png" alt="Chemistry" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F5F7FB' }}>AQA Chemistry Foundation</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.72rem', color: '#5A6480' }}>Papers 1 & 2 · {CHEMISTRY_TOPIC_GROUPS.length} topics · {totalQs} questions · AI marked · Diagrams included</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex: 1, background: filter === f.id ? 'rgba(56,210,122,.15)' : '#151720', border: `1px solid ${filter === f.id ? '#38D27A' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '9px 6px', fontFamily: "'Outfit', sans-serif", fontSize: '.73rem', fontWeight: 600, color: filter === f.id ? '#38D27A' : '#5A6480', cursor: 'pointer' }}>{f.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 16, padding: '16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={(() => {
                  const id = group.id || ''
                  if (['chem_atom','chem_periodic','chem_bonding','chem_giant','chem_matter','chem_ions'].some(k => id.startsWith(k))) return '/headers/chem-matteratoms.png'
                  if (['chem_react','chem_acid','chem_electro','chem_energy','chem_calcul'].some(k => id.startsWith(k))) return '/headers/chem-reactions.png'
                  if (['chem_rates','chem_revers','chem_hydro','chem_crack','chem_organic','chem_polymer'].some(k => id.startsWith(k))) return '/headers/chem-rates.png'
                  if (['chem_earth','chem_atmos','chem_pollu','chem_resource'].some(k => id.startsWith(k))) return '/headers/chem-earth.png'
                  return '/headers/chem-logo.png'
                })()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.93rem', color: '#F5F7FB', marginBottom: 3 }}>{group.label}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.75rem', color: '#5A6480', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.68rem', fontWeight: 600, color: group.color, flexShrink: 0 }}>{group.questions.length} Q{group.questions.length !== 1 ? 's' : ''}</span>
                  <span style={{ background: group.calculator ? 'rgba(56,210,122,.12)' : 'rgba(255,200,87,.08)', border: group.calculator ? '1px solid rgba(56,210,122,.25)' : '1px solid rgba(255,200,87,.2)', borderRadius:6, padding:'2px 8px', fontFamily:"'Outfit', sans-serif", fontSize:'.6rem', fontWeight:700, color: group.calculator ? '#38D27A' : '#FFC857', flexShrink:0 }}>{group.calculator ? '🖩 Calc OK' : '✏️ No Calc'}</span>
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
const QF_QUESTION_HISTORY_KEY = 'gcse_qf_q_history'
const QF_PREV_SESSION_KEY = 'gcse_qf_prev_session'

function qfQuestionId(q) {
  return (q.subject || '') + '::' + (q.q || '').slice(0, 40)
}
function readQfQuestionHistory() {
  try { return JSON.parse(localStorage.getItem(QF_QUESTION_HISTORY_KEY) || '{}') } catch { return {} }
}
function updateQfQuestionHistory(q, isCorrect) {
  const id = qfQuestionId(q)
  if (!id) return
  const hist = readQfQuestionHistory()
  const prev = hist[id] || { attempts: 0, correct: 0, lastResult: null }
  hist[id] = { attempts: prev.attempts + 1, correct: prev.correct + (isCorrect ? 1 : 0), lastResult: isCorrect ? 'correct' : 'incorrect' }
  try { localStorage.setItem(QF_QUESTION_HISTORY_KEY, JSON.stringify(hist)) } catch {}
}
function wasQfPrevWrong(q) {
  return readQfQuestionHistory()[qfQuestionId(q)]?.lastResult === 'incorrect'
}
function readQfPrevSession() {
  try { return JSON.parse(localStorage.getItem(QF_PREV_SESSION_KEY) || 'null') } catch { return null }
}
function saveQfPrevSession(accuracy, answered) {
  try { localStorage.setItem(QF_PREV_SESSION_KEY, JSON.stringify({ accuracy, answered, date: new Date().toISOString() })) } catch {}
}

const QUICK_FIRE_SUBJECT_META = {
  History:    { icon: '🏛️', logo: '/headers/history-main.png',    color: '#C89B6D', moduleId: 'mod1' },
  Maths:      { icon: '✖️', logo: '/headers/maths-main.png',      color: '#2DD4BF', moduleId: null },
  Sociology:  { icon: '👥', logo: '/headers/sociology-main.png',  color: '#FF5C7A', moduleId: null },
  Chemistry:  { icon: '⚗️', logo: '/headers/chem-logo.png',       color: '#9B59E8', moduleId: null },
  Biology:    { icon: '🌿', logo: '/headers/bio-main.png',         color: '#4F8A5B', moduleId: 'sci_bio_w1' },
  English:    { icon: '📘', logo: '/headers/english-main.png',    color: '#B66DFF', moduleId: null },
  Physics:    { icon: '⚡', logo: '/headers/physics-main.png',    color: '#3B82F6', moduleId: null },
  'Quick Fire': { icon: '⚡', logo: null,                          color: '#9D5CFF', moduleId: null },
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
  const qHist = readQfQuestionHistory()
  // Shuffle first so same-priority questions vary each round
  const shuffled = [...QUICK_FIRE_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled
    .map(question => {
      const prevResult = qHist[qfQuestionId(question)]?.lastResult
      const subjectBucket = memory.subjects?.[question.subject]
      const topicBucket = memory.topics?.[question.subject + '::' + question.topic]
      const subjectWeakness = subjectBucket?.answered ? Math.max(0, 70 - bucketAccuracy(subjectBucket)) / 10 : 0
      const topicWeakness = topicBucket?.answered ? Math.max(0, 75 - bucketAccuracy(topicBucket)) / 8 : 0
      const confidenceBoost = confidencePriorityForModule(question.moduleId)
      // Previously wrong → higher priority; recently correct → slightly lower
      const wrongBoost = prevResult === 'incorrect' ? 3.5 : 0
      const correctPenalty = prevResult === 'correct' ? -1.0 : 0
      return { question, score: subjectWeakness + topicWeakness + confidenceBoost + wrongBoost + correctPenalty }
    })
    .sort((a, b) => b.score - a.score)
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



function TestTab({ mode = 'test', onOpenModule, onExit, autoStart = false } = {}) {
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
  const [quickFireCountdown, setQuickFireCountdown] = useState(null)
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
  const [qfConsecutiveWrong, setQfConsecutiveWrong] = useState(0)
  // Full-paper exam state
  const [examPaperAnswers,   setExamPaperAnswers]   = useState({})
  const [examPaperFeedbacks, setExamPaperFeedbacks] = useState({})
  const [examPaperGrading,   setExamPaperGrading]   = useState({})

  // Quickfire 3-2-1-GO countdown
  useEffect(() => {
    if (!isQuickFire || quickFireCountdown === null) return undefined
    if (quickFireCountdown === 'GO') {
      const t = setTimeout(() => { setQuickFireCountdown(null); setQuickFireActive(true) }, 650)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setQuickFireCountdown(v => v === 1 ? 'GO' : v - 1), 900)
    return () => clearTimeout(t)
  }, [isQuickFire, quickFireCountdown])

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
    if (!isExamMode || examPhase !== 'round' || !examConfig?.isTimedPaper) return undefined
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
  }, [isExamMode, examPhase, examConfig])

  // Auto-start quickfire when launched from Pulse tab
  const autoStartedRef = useRef(false)
  useEffect(() => {
    if (autoStart && isQuickFire && !autoStartedRef.current) {
      autoStartedRef.current = true
      startRandomQuestion()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  function startExamRound(subject = 'Random', { isTimedPaper = false } = {}) {
    const questions = adaptiveExamQuestions(subject)
    setExamConfig({ subject, title: subject === 'Random' ? 'Random Exam Challenge' : subject + ' Exam Sprint', isTimedPaper })
    setExamQuestions(questions)
    setExamIdx(0)
    setExamTimeLeft(EXAM_SECONDS)
    setExamCountdown(3)
    setExamStats({ correct: 0, answered: 0, bySubject: {} })
    resetExamQuestion()
    setExamPaperAnswers({})
    setExamPaperFeedbacks({})
    setExamPaperGrading({})
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

  async function checkPaperAnswer(question, idx) {
    const ans = (examPaperAnswers[idx] ?? '').toString()
    if (examPaperFeedbacks[idx]) return
    if (question.type === 'mc') {
      if (ans === '') return
      const picked = Number(ans)
      const isCorrect = picked === question.correctIndex
      addExamResult(question, isCorrect ? question.marks : 0, question.marks)
      setExamPaperFeedbacks(prev => ({ ...prev, [idx]: {
        grade: isCorrect ? 'Correct' : 'Needs Work',
        summary: isCorrect ? 'Correct.' : `Correct answer: ${question.options[question.correctIndex]}`,
        correct: isCorrect,
      }}))
      return
    }
    if (ans.trim().length < 3) return
    setExamPaperGrading(prev => ({ ...prev, [idx]: true }))
    try {
      const result = await gradeWithAI(question.q, ans, question.marks, question.ms)
      const earned = result.marksAwarded ?? 0
      addExamResult(question, earned, result.marksAvailable || question.marks)
      setExamPaperFeedbacks(prev => ({ ...prev, [idx]: { ...result, correct: earned >= (result.marksAvailable || question.marks) } }))
    } catch {
      setExamPaperFeedbacks(prev => ({ ...prev, [idx]: { grade: 'Error', summary: 'Could not mark. Try again.' } }))
    } finally {
      setExamPaperGrading(prev => ({ ...prev, [idx]: false }))
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


  // Quickfire 3-2-1 countdown screen
  if (isQuickFire && quickFireCountdown !== null) {
    return (
      <div style={{ minHeight:'100vh', background:'radial-gradient(circle at 50% 25%, rgba(101,230,198,0.12), transparent 45%), #060816', display:'flex', alignItems:'center', justifyContent:'center', color:'#F5F7FB' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:"'Outfit', sans-serif", color:'#7A7670', fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', fontSize:'.72rem', marginBottom:24 }}>90 Second Quick Fire</div>
          <div key={quickFireCountdown} style={{ fontFamily:"'Sora', sans-serif", fontSize: quickFireCountdown === 'GO' ? '5rem' : '7.5rem', fontWeight:900, color: quickFireCountdown === 'GO' ? '#65E6C6' : '#F4EFE6', textShadow: quickFireCountdown === 'GO' ? '0 0 48px rgba(101,230,198,0.75)' : '0 0 32px rgba(255,255,255,0.2)', animation:'examPop .8s ease both' }}>{quickFireCountdown}</div>
          <div style={{ color:'#4B5563', marginTop:20, fontFamily:"'Outfit', sans-serif", fontSize:'.88rem' }}>Answer as many as you can.</div>
          <style>{'@keyframes examPop { 0%{opacity:0;transform:scale(.7)} 50%{opacity:1;transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }'}</style>
        </div>
      </div>
    )
  }

  if (isExamMode && examPhase !== 'landing') {
    const currentExamQuestion = examQuestions[examIdx]
    const examAccuracy = examStats.answered ? Math.round((examStats.correct / examStats.answered) * 100) : 0

    if (examPhase === 'countdown') {
      return (
        <div style={{ minHeight:'100vh', background:'radial-gradient(circle at 50% 20%, rgba(157,92,255,.2), transparent 38%), #050817', display:'flex', alignItems:'center', justifyContent:'center', color:'#F5F7FB', padding:24 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:"'Outfit', sans-serif", color:'#AAB4D4', fontWeight:800, letterSpacing:'.18em', textTransform:'uppercase', fontSize:'.72rem', marginBottom:20 }}>{examConfig?.title || 'Exam Mode'}</div>
            <div key={examCountdown} style={{ fontFamily:"'Sora', sans-serif", fontSize: examCountdown === 'GO' ? '5rem' : '7rem', fontWeight:950, color: examCountdown === 'GO' ? '#38F27B' : '#C18CFF', textShadow:'0 0 42px rgba(157,92,255,.72)', animation:'examPop .85s ease both' }}>{examCountdown}</div>
            <div style={{ color:'#7C8DB0', marginTop:18, fontFamily:"'Outfit', sans-serif" }}>Breathe. Read the command word first.</div>
            <style>{'@keyframes examPop { 0%{opacity:0;transform:scale(.72)} 45%{opacity:1;transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }'}</style>
          </div>
        </div>
      )
    }

    if (examPhase === 'round') {
      return (
        <div style={{ minHeight:'100vh', background:'#08090D', color:'#F5F7FB' }}>
          {/* Sticky timer bar */}
          <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(8,9,13,0.96)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, boxSizing:'border-box' }}>
            <button onClick={() => setExamPhase('summary')} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid rgba(80,97,140,.4)', background:'rgba(12,18,38,.9)', color:'#DCE5FA', fontSize:'1.1rem', cursor:'pointer', flexShrink:0 }}>‹</button>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F4EFE6' }}>{examConfig?.title}</div>
              <div style={{ color:'#4B5563', fontSize:'.72rem' }}>{examQuestions.length} questions · scroll to answer all</div>
            </div>
            {examConfig?.isTimedPaper && (
              <div style={{ background:examTimeLeft < 60 ? 'rgba(255,93,115,.18)' : 'rgba(139,92,246,.18)', border:'1px solid '+(examTimeLeft<60?'rgba(255,93,115,.5)':'rgba(139,92,246,.4)'), borderRadius:999, color:examTimeLeft<60?'#FF5D73':'#C4B5FD', fontFamily:"'Sora', sans-serif", fontWeight:900, padding:'7px 14px', fontSize:'1rem', flexShrink:0 }}>{examTime}</div>
            )}
          </div>

          {/* Scrollable paper */}
          <div style={{ padding:'16px 16px 130px', maxWidth:660, margin:'0 auto' }}>
            {examQuestions.map((q, idx) => {
              const block = {
                questionText: q.q,
                marks: q.marks || 4,
                markPoints: q.ms ? [q.ms] : [],
                source: q.extract ? { label: 'Source', text: q.extract } : null,
                commandWord: q.commandWord || null,
                topic: q.topic || null,
                paper: examConfig?.title || 'EXAM PRACTICE',
              }
              return (
                <div key={idx} style={{ marginBottom: 32 }}>
                  <ExamQuestionFrame
                    block={block}
                    subject={q.subject || 'History'}
                    mode="exam"
                    questionNum={idx + 1}
                    onComplete={({ marksAwarded }) => {
                      setExamPaperFeedbacks(prev => ({
                        ...prev,
                        [idx]: { marksAwarded, grade: 'Submitted', summary: '' }
                      }))
                    }}
                  />
                </div>
              )
            })}
            <button onClick={()=>setExamPhase('summary')} style={{ width:'100%', background:'linear-gradient(135deg,#7C3AED,#9D5CFF)', border:'none', borderRadius:16, padding:16, color:'#fff', fontWeight:800, fontSize:'1rem', cursor:'pointer', marginTop:8 }}>Submit Paper</button>
          </div>
        </div>
      )
    }

    if (examPhase === 'summary') {
      return (
        <div style={{ minHeight:'100vh', background:'#08090D', color:'#F5F7FB', padding:'28px 20px 120px' }}>
          <div style={{ maxWidth:520, margin:'0 auto', textAlign:'center' }}>
            <div style={{ width:150, height:150, borderRadius:'50%', margin:'0 auto 22px', background:'conic-gradient(#38F27B ' + examAccuracy + '%, #172845 0)', display:'grid', placeItems:'center' }}><div style={{ width:122, height:122, borderRadius:'50%', background:'#071126', display:'grid', placeItems:'center' }}><div><div style={{ fontFamily:"'Sora', sans-serif", fontSize:'2.4rem', fontWeight:950 }}>{examAccuracy}%</div><div style={{ color:'#AAB4D4', fontWeight:800 }}>{examStats.correct}/{examStats.answered || 0}</div></div></div></div>
            <h1 style={{ fontFamily:"'Sora', sans-serif", fontSize:'2rem', margin:'0 0 8px' }}>Exam round complete</h1>
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
      setQuickFireActive(false)
      setQuickFireFinished(false)
      setQuickFireStats(emptyQuickFireStats())
      setQuickFireQuestionSet(prioritizedQuickFireQuestions())
      setQuickFireSummary(null)
      setQuickFireCountdown(3)
      setQfConsecutiveWrong(0)
    }
  }

  function finishQuickFireRound(reason = 'exit') {
    setQuickFireActive(false)
    setQuickFireFinished(true)
    const memory = saveQuickFireMemory(quickFireStats)
    const accuracy = quickFireStats.answered ? Math.round((quickFireStats.correct / quickFireStats.answered) * 100) : 0
    const prevSession = readQfPrevSession()
    if (quickFireStats.answered > 0) saveQfPrevSession(accuracy, quickFireStats.answered)
    setQuickFireSummary({
      reason,
      answered: quickFireStats.answered,
      correct: quickFireStats.correct,
      timeUsed: QUICK_FIRE_SECONDS - quickFireTimeLeft,
      timeLeft: quickFireTimeLeft,
      subjects: rankedQuickFireSubjects(memory, quickFireStats),
      recommendation: pickQuickFireRecommendation(memory, quickFireStats),
      prevAccuracy: (prevSession?.answered >= 3) ? prevSession.accuracy : null,
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
    setQuickFireCountdown(null)
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
      const wasPrevWrong = isQuickFire && wasQfPrevWrong(q)
      const newAttempts = tqMcAttempts + 1
      setTqMcAttempts(newAttempts)
      if (isCorrect) {
        if (isQuickFire) {
          setQuickFireStats(stats => addQuickFireAnswer(stats, q, true))
          updateQfQuestionHistory(q, true)
          setQfConsecutiveWrong(0)
        }
        setTqMcLocked(true)
        const correctMsg = wasPrevWrong
          ? "Well done — you didn't get that right last time!"
          : "That's the one. Well done for getting it."
        setFeedback({ marksAwarded: q.marks, marksAvailable: q.marks, grade: 'Excellent',
          summary: correctMsg, achieved: ['Correct answer selected'], missed: [], examinerTip: '' })
        recordScore({ subject: selected.subject, earned: q.marks, possible: q.marks, source: 'test' })
      } else if (newAttempts === 1) {
        setTqMcHint(true)
        setAnswer('')
        setError('')
      } else {
        if (isQuickFire) {
          setQuickFireStats(stats => addQuickFireAnswer(stats, q, false))
          updateQfQuestionHistory(q, false)
          const newConsecutive = qfConsecutiveWrong + 1
          setQfConsecutiveWrong(newConsecutive)
          // After 3 consecutive wrong answers, inject a revisit question from the queue
          if (newConsecutive >= 3) {
            setQfConsecutiveWrong(0)
            const revisitCandidate = quickFireQuestionSet.slice(qIdx + 2).find(qItem => wasQfPrevWrong(qItem))
            if (revisitCandidate) {
              setQuickFireQuestionSet(prev => {
                const next = [...prev]
                next.splice(qIdx + 1, 0, { ...revisitCandidate, _retryPrevWrong: true })
                return next
              })
            }
          }
        }
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
    const prevAcc = quickFireSummary.prevAccuracy
    const improvement = (prevAcc !== null && quickFireSummary.answered >= 3) ? accuracy - prevAcc : null
    const improvementText = improvement === null ? null
      : improvement > 0 ? `+${improvement}% better than last time`
      : improvement < 0 ? `${Math.abs(improvement)}% lower than last time`
      : 'Same as last time'
    const improvementColor = improvement > 0 ? '#4CAF7D' : improvement < 0 ? '#E05A52' : '#A89FC2'
    const headlineText = improvement !== null && improvement > 0
      ? `${improvement}% improvement`
      : accuracy >= 60 ? 'Great work!' : 'Keep going!'

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
                <div style={{ fontFamily:"'Sora', sans-serif", fontSize:'2.65rem', fontWeight:900, lineHeight:1 }}>{accuracy}%</div>
                <div style={{ color:'#AAB4D4', fontSize:'.9rem', fontWeight:700, marginTop:5 }}>{quickFireSummary.correct} / {quickFireSummary.answered || 0}</div>
                <div style={{ color:'#38F27B', fontSize:'.86rem', fontWeight:900, marginTop:4 }}>Correct</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:9 }}>
              <h1 style={{ fontFamily:"'Sora', sans-serif", fontSize:'2.1rem', lineHeight:1.05, margin:0, color:'#F5F7FB' }}>{headlineText}</h1>
              {improvement > 0 && <span style={{ color:'#4CAF7D', fontSize:'1.45rem' }}>↑</span>}
            </div>
            {improvementText && (
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background: improvement > 0 ? 'rgba(76,175,125,.12)' : improvement < 0 ? 'rgba(224,90,82,.1)' : 'rgba(255,255,255,.06)', border:'1px solid ' + (improvement > 0 ? 'rgba(76,175,125,.35)' : improvement < 0 ? 'rgba(224,90,82,.3)' : 'rgba(255,255,255,.1)'), borderRadius:999, padding:'6px 14px', marginTop:10 }}>
                <span style={{ color:improvementColor, fontFamily:"'Sora', sans-serif", fontWeight:800, fontSize:'.9rem' }}>{improvementText}</span>
              </div>
            )}
            {!improvementText && (
              <p style={{ color:'#AAB4D4', fontSize:'.96rem', margin:'10px 0 0', lineHeight:1.45 }}>{accuracy >= 80 ? 'Excellent recall.' : accuracy >= 60 ? 'Strong session.' : 'Good start — now sharpen the weak spots.'}</p>
            )}
          </div>

          <div style={{ background:'linear-gradient(145deg, rgba(16,24,43,.96), rgba(9,15,31,.96))', border:'1px solid rgba(62,78,118,.55)', borderRadius:18, padding:'18px 18px 14px', marginBottom:16, boxShadow:'0 14px 36px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:800, fontSize:'1rem' }}>Performance by subject</div>
              <button onClick={exitTestTopic} style={{ border:'none', background:'transparent', color:'#AAB4D4', fontSize:'.8rem', cursor:'pointer' }}>View all ›</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {summarySubjects.slice(0, 5).map(item => (
                <div key={item.subject} style={{ display:'grid', gridTemplateColumns:'40px 1fr 54px 48px', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', overflow:'hidden', flexShrink:0 }}>
                    {item.logo
                      ? <img src={item.logo} alt={item.subject} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ width:'100%', height:'100%', background:item.color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.12rem', color:item.color }}>{item.icon}</div>
                    }
                  </div>
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
            <div style={{ width:54, height:54, borderRadius:'50%', overflow:'hidden', flexShrink:0 }}>
              {recommendationMeta.logo
                ? <img src={recommendationMeta.logo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <div style={{ width:'100%', height:'100%', background:recommendationMeta.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', color:recommendationMeta.color }}>{recommendationMeta.icon}</div>
              }
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ fontFamily:"'Sora', sans-serif", color:'#F5F7FB', fontWeight:850, fontSize:'1rem' }}>Recommended next</div>
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
              <span style={{ display:'block', fontFamily:"'Sora', sans-serif", fontSize:'1.25rem', fontWeight:950, letterSpacing:'.02em' }}>TRY AGAIN</span>
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
              <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.9rem', color:'#F5F7FB', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selected.label}</div>
              <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.7rem', color:'#5A6480' }}>Question {qIdx+1} of {questions.length}</div>
            </div>
            {isQuickFire && (
              <div style={{ background: quickFireTimeLeft <= 10 ? 'rgba(255,93,115,.12)' : 'rgba(157,92,255,.12)', border: quickFireTimeLeft <= 10 ? '1px solid rgba(255,93,115,.36)' : '1px solid rgba(157,92,255,.3)', borderRadius: 999, padding: '6px 10px', color: quickFireTimeLeft <= 10 ? '#FF5D73' : '#C18CFF', fontFamily: "'Sora', sans-serif", fontWeight: 900, fontSize: '.86rem', minWidth: 58, textAlign: 'center' }}>
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
              <span style={{ fontFamily:"'Sora', sans-serif", fontSize:'.75rem', fontWeight:700, color:'#F5B700' }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
            </div>
            {q.fig && FIGURES[q.fig] && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'12px', marginBottom:14, textAlign:'center' }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'#5A6480', marginBottom:8 }}>Figure — from AQA past paper</div>
                <img src={FIGURES[q.fig]} alt="AQA exam figure" style={{ maxWidth:'100%', height:'auto', borderRadius:8 }} />
              </div>
            )}
            <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:14, padding:'16px', marginBottom:14 }}>
              <pre style={{ fontFamily:"'Outfit', sans-serif", fontSize:'1rem', lineHeight:1.65, margin:0, color:'#E0E6F0', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
            </div>
            {!showTip
              ? <button onClick={() => setTip(true)} style={{ background:'none', border:'1px dashed #2A3552', borderRadius:10, padding:'9px 14px', cursor:'pointer', color:'#4A5578', fontSize:'.82rem', fontFamily:"'Outfit', sans-serif", width:'100%', marginBottom:14 }}>💡 Show mark tip</button>
              : <div style={{ background:'rgba(245,183,0,.06)', border:'1px solid rgba(245,183,0,.2)', borderRadius:10, padding:'11px 14px', marginBottom:14 }}>
                  <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:5 }}>{q.marks}-mark question</div>
                  <p style={{ fontFamily:"'Outfit', sans-serif", margin:0, fontSize:'.85rem', color:'#C8D0E8' }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
                </div>
            }
            {!feedback && !tqMcLocked && (
              isMC
                ? <div style={{ marginBottom:14 }}>
                    {/* Hint card after first wrong MC */}
                    {tqMcHint && (
                      <div style={{ background:'rgba(255,200,87,.06)', border:'1px solid rgba(255,200,87,.28)', borderRadius:14, padding:'14px 16px', marginBottom:12 }}>
                        <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#FFC857', marginBottom:8 }}>💡 Have another look</div>
                        <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', color:'#C8D0E8', margin:'0 0 4px', lineHeight:1.55 }}>
                          {q.hint || (q.ms ? q.ms.split('.')[0] + '.' : 'Think carefully — what is the question specifically asking about?')}
                        </p>
                        <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.78rem', color:'#FFC857', margin:0, fontStyle:'italic' }}>
                          You have one more try — you can get this.
                        </p>
                      </div>
                    )}
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {q.options.map((opt,i) => (
                        <button key={i} onClick={() => setAnswer(opt)} style={{ background:answer===opt?'rgba(245,183,0,.1)':'#151720', border:`1.5px solid ${answer===opt?'#F5B700':'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'13px 16px', cursor:'pointer', textAlign:'left', fontFamily:"'Outfit', sans-serif", fontSize:'.93rem', color:answer===opt?'#F5B700':'#C8D0E8', transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ width:22, height:22, borderRadius:'50%', border:`1.5px solid ${answer===opt?'#F5B700':'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.72rem', fontWeight:700, color:answer===opt?'#F5B700':'#4A5578', background:answer===opt?'rgba(245,183,0,.1)':'transparent' }}>{String.fromCharCode(65+i)}</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                : <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:14, padding:'14px', marginBottom:14 }}>
                    <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4A5578', marginBottom:8 }}>Your answer</div>
                    <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Write your answer here…" style={{ width:'100%', border:'none', background:'transparent', resize:'none', fontFamily:"'Outfit', sans-serif", fontSize:'.92rem', color:'#E0E6F0', lineHeight:1.65, outline:'none', minHeight:q.marks>=6?180:q.marks>=3?120:80 }} />
                  </div>
            )}
            {error && <div style={{ background:'rgba(255,93,115,.08)', border:'1px solid rgba(255,93,115,.3)', borderRadius:10, padding:'11px 14px', marginBottom:14 }}><p style={{ fontFamily:"'Outfit', sans-serif", margin:0, fontSize:'.86rem', color:'#FF5D73' }}>{error}</p></div>}
            {feedback && gs && (
              <div className="fade-up">
                <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:16, padding:'18px', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ fontFamily:"'Sora', sans-serif", fontSize:'1.8rem', fontWeight:800, color:gs.text, lineHeight:1 }}>{feedback.marksAwarded}<span style={{ fontSize:'1rem', opacity:.6 }}>/{feedback.marksAvailable}</span></div>
                    <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.82rem' }}>{feedback.grade}</div>
                  </div>
                  <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.9rem', color:gs.text, margin:0, opacity:.85 }}>{feedback.summary}</p>
                </div>
                {feedback.achieved?.length > 0 && feedback.achieved[0] !== 'Correct answer selected' && <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4DFF88', marginBottom:8 }}>✓ What you got right</div>{feedback.achieved.map((a,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:'#4DFF88', flexShrink:0 }}>✓</span><p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.87rem', color:'#C8D0E8' }}>{a}</p></div>)}</div>}
                {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && feedback.missed[0] !== '' && <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#9CA8C7', marginBottom:8 }}>→ Worth knowing</div>{feedback.missed.map((m,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:'#9CA8C7', flexShrink:0 }}>→</span><p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.87rem', color:'#C8D0E8' }}>{m}</p></div>)}</div>}
                {feedback.examinerTip && feedback.examinerTip !== '' && <div style={{ background:'rgba(245,183,0,.06)', border:'1px solid rgba(245,183,0,.2)', borderRadius:12, padding:'13px 14px', marginBottom:14 }}><div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:6 }}>🗡️ Examiner tip</div><p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.87rem', color:'#C8D0E8' }}>{feedback.examinerTip}</p></div>}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <button onClick={fullResetQ} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:12, padding:'13px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:'pointer', color:'#9CA8C7', fontSize:'.88rem' }}>↩ Try again</button>
                  <button onClick={()=>tqNextQuestion(questions.length)} style={{ background:'linear-gradient(135deg,#F5B700,#C98719)', border:'none', borderRadius:12, padding:'13px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:'pointer', color:'#070500', fontSize:'.88rem' }}>{qIdx<questions.length-1?'Next →':'Finish ✓'}</button>
                </div>
              </div>
            )}
            {!feedback && !tqMcLocked && (
              <button onClick={() => handleTqCheck(q)} disabled={grading || (isMC && !answer)}
                style={{ width:'100%', background:grading?'rgba(255,255,255,0.08)':'linear-gradient(135deg,#F5B700,#C98719)', color:grading?'#5A6480':'#070500', border:'none', borderRadius:12, padding:'15px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:(grading||(isMC&&!answer))?'default':'pointer', fontSize:'.97rem', marginTop:4, opacity:(isMC&&!answer)?0.4:1 }}>
                {grading ? 'Marking…' : tqMcHint ? 'Check again — you can do this →' : 'Check my answer →'}
              </button>
            )}
          </>}
        </div>
      </div>
    )
  }


  const EXAM_SUBJECTS = [
    { logo: '/headers/sociology-main.png', label: 'Sociology', color: '#FF5C7A', completed: 7,  total: 10, action: isExamMode ? () => startExamRound('Sociology') : () => setSociologyOpen(true) },
    { logo: '/headers/history-main.png',   label: 'History',   color: '#C89B6D', completed: 6,  total: 12, action: isExamMode ? () => startExamRound('History') : () => startTopic({ topicId: 'medieval', label: 'History', subject: 'History' }) },
    { logo: '/headers/bio-main.png',        label: 'Biology',   color: '#4F8A5B', completed: 1,  total: 7,  action: isExamMode ? () => startExamRound('Biology')    : () => startTopic({ topicId: 'tb_cells', label: 'Biology', subject: 'Biology' }) },
    { logo: '/headers/chem-logo.png',       label: 'Chemistry', color: '#9B59E8', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('Chemistry')  : () => setChemistryOpen(true) },
    { logo: '/headers/maths-main.png',      label: 'Maths',     color: '#2DD4BF', completed: 0,  total: 20, action: isExamMode ? () => startExamRound('Maths') : () => setMathsOpen(true) },
    { logo: '/headers/english-main.png',    label: 'English',   color: '#B66DFF', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('English') : () => setEnglishOpen(true) },
    { logo: '/headers/physics-main.png',    label: 'Physics',   color: '#3B82F6', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('Physics')  : () => {} },
  ]

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>

      {/* ── Header — 60px ── */}
      <div style={{ height: 60, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div>
          {!isExamMode && (
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F4EFE6' }}>
              {isQuickFire ? '90s Quick Fire' : 'Practice Test'}
            </div>
          )}
          {isExamMode && (
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F4EFE6' }}>Exams</div>
          )}
        </div>
        <StreakChip />
      </div>

      <div style={{ padding: '8px 20px 0' }}>

        {/* ── QUICK FIRE CTA ── */}
        <button onClick={startRandomQuestion} style={{
          width: '100%', boxSizing: 'border-box', cursor: 'pointer',
          background: 'linear-gradient(140deg, #0A1A14 0%, #081209 55%, #060E07 100%)',
          border: '1px solid rgba(101,230,198,0.22)', borderRadius: 22,
          padding: '22px 22px 20px', display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 28, textAlign: 'left',
          boxShadow: '0 0 40px rgba(101,230,198,0.06), 0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            width: 62, height: 62, borderRadius: 18, flexShrink: 0,
            background: 'linear-gradient(135deg, #1B4A36, #2A7A58)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', boxShadow: '0 0 18px rgba(101,230,198,0.22)',
          }}>⚡</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#F4EFE6', lineHeight: 1.15, marginBottom: 5 }}>
              {isQuickFire ? '90s Quick Fire' : 'Random Quick Fire'}
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.78rem', color: '#65E6C6', fontWeight: 600, marginBottom: 4 }}>
              {isQuickFire ? '90 seconds · Answer fast' : '90 seconds · All subjects · Mixed'}
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.72rem', color: '#5A6A50', lineHeight: 1.4 }}>
              Random questions from across your GCSE subjects — you never know what's coming.
            </div>
          </div>
          <div style={{ flexShrink: 0, background: 'linear-gradient(135deg, #3D7A5E, #65E6C6)', borderRadius: 18, padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em', color: '#051209', whiteSpace: 'nowrap' }}>
            {isQuickFire ? 'Start ⚡' : 'Go →'}
          </div>
        </button>

        {/* ── SELECT A TOPIC label ── */}
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A7670', marginBottom: 14 }}>
          Or select a topic
        </div>

        {/* ── SUBJECT GRID — 3 columns ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
          {EXAM_SUBJECTS.map((subj, i) => (
            <button key={i} onClick={subj.action} style={{
              position: 'relative', height: 112, borderRadius: 16, overflow: 'hidden',
              border: `1px solid ${subj.color}28`, cursor: 'pointer', padding: 0,
              background: '#0D0E10',
              boxShadow: `0 4px 16px rgba(0,0,0,0.45)`,
            }}>
              {/* cinematic background image */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${subj.logo})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'saturate(0.75) brightness(0.72)',
              }} />
              {/* bottom gradient */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(5,7,11,0.10) 0%, rgba(5,7,11,0.72) 58%, rgba(5,7,11,0.96) 100%)',
              }} />
              {/* label */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 10px 10px', textAlign: 'left' }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, color: '#F5F7FF', lineHeight: '18px', letterSpacing: '-0.01em' }}>{subj.label}</div>
              </div>
              {/* accent top-left dot */}
              <div style={{ position: 'absolute', top: 9, left: 9, width: 6, height: 6, borderRadius: '50%', background: subj.color, boxShadow: `0 0 8px ${subj.color}` }} />
            </button>
          ))}
        </div>

        {/* ── REAL EXAM PAPERS ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4A5578', marginBottom: 12 }}>Real Exam Papers</div>
          <button onClick={() => startExamRound('Random', { isTimedPaper: true })} style={{ width: '100%', boxSizing: 'border-box', background: '#0E1628', border: '1px solid #1E2A40', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 54, height: 54, borderRadius: 15, background: 'rgba(59,130,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.92rem', color: '#F0F3FA' }}>Full Timed Paper</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.73rem', color: '#4A5578', marginTop: 3 }}>10 questions · 10 min timer · All subjects</div>
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
