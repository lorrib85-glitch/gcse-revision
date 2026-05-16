import { useState } from 'react'
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

export default function App() {
  const [view, setView]           = useState('home')
  const [topicId, setTopicId]     = useState(null)
  const [session, setSession]     = useState(null)
  const [startPhase, setStartPhase] = useState(1)
  const [results, setResults]     = useState({})
  const [savedData, setSavedData] = useState(null)
  const [progress, setProgress]   = useState(() => safeGetProgress())
  const [draft, setDraft]         = useState(() => safeGetDraft())
  const [activeModule, setActiveModule] = useState(null)

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

  function goHome() {
    setProgress(getProgress())
    setDraft(getSessionDraft())
    setView('home')
  }

  if (view === 'module' && activeModule) return <ModulePlayer module={activeModule} onBack={() => setView('home')} />
  if (view === 'home') return <Home progress={progress} draft={draft} onStart={startSession} onResume={resumeSession} onDiscardDraft={discardDraft} onOpenModule={m => { setActiveModule(m); setView('module') }} />
  if (view === 'session' && session) return <Session session={session} topicId={topicId} startPhase={startPhase} initialResults={results} onFinish={finishSession} onHome={goHome} />
  if (view === 'end') return <EndScreen topicId={topicId} results={results} savedData={savedData} onHome={goHome} onStart={startSession} />
  return null
}

// ─── Home ────────────────────────────────────────────────────────────────────

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
  today.setHours(0,0,0,0)
  exam.setHours(0,0,0,0)
  return Math.max(0, Math.round((exam - today) / 86400000))
}

function Home({ progress, draft, onStart, onResume, onDiscardDraft, onOpenModule }) {
  const nextId     = getNextTopicId(TOPIC_IDS)
  const nextTopic  = TOPICS.find(t => t.id === nextId)
  const draftTopic = draft ? TOPICS.find(t => t.id === draft.topicId) : null
  const PHASE_NAMES = ['', 'Warm-up', 'Key Facts', 'Mini Quiz', 'Progress']
  const greeting   = GREETINGS[Math.floor(Date.now() / 86400000) % GREETINGS.length]
  const streak     = progress.streak || 0
  const bestStreak = progress.bestStreak || streak
  const examDays   = daysUntilExam()
  const totalSessions = Object.values(progress.topicProgress || {}).reduce((s, t) => s + (t.completedSessions || 0), 0)

  return (
    <div className="page" style={{ background: '#f7f3ee', minHeight: '100vh' }}>

      {/* ── Top nav bar ── */}
      <div style={{ background: '#f7f3ee', borderBottom: '1px solid #e8e0d4', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.1rem', color: '#17120d' }}>
          Medicine in Britain
        </div>
        {streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff8f0', border: '1px solid #f0d8b8', borderRadius: 99, padding: '5px 12px' }}>
            <span style={{ fontSize: '1rem' }}>🔥</span>
            <span style={{ fontWeight: 800, fontSize: '.88rem', color: '#b45309' }}>{streak}</span>
          </div>
        )}
      </div>

      {/* ── Hero greeting ── */}
      <div style={{ padding: '28px 20px 0' }}>
        <div className="container">
          <div className="fade-up">
            <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9a8370', marginBottom: 8 }}>
              Your progress
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 6vw, 2.4rem)', color: '#17120d', marginBottom: 10, lineHeight: 1.15 }}>
              {greeting}
            </h1>
          </div>

          {/* ── Stats row ── */}
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, margin: '20px 0 24px' }}>
            <div style={{ background: '#fff', border: '1px solid #e8e0d4', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 2 }}>🔥</div>
              <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#17120d' }}>{streak}</div>
              <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#9a8370', textTransform: 'uppercase', letterSpacing: '.08em' }}>Day streak</div>
              {bestStreak > 1 && <div style={{ fontSize: '.65rem', color: '#b45309', marginTop: 3 }}>Best: {bestStreak}</div>}
            </div>
            <div style={{ background: '#fff', border: '1px solid #e8e0d4', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 2 }}>📚</div>
              <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#17120d' }}>{totalSessions}</div>
              <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#9a8370', textTransform: 'uppercase', letterSpacing: '.08em' }}>Sessions</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e8e0d4', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 2 }}>📅</div>
              <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#17120d' }}>{examDays}</div>
              <div style={{ fontSize: '.68rem', fontWeight: 600, color: '#9a8370', textTransform: 'uppercase', letterSpacing: '.08em' }}>Days to go</div>
              <div style={{ fontSize: '.65rem', color: '#9a8370', marginTop: 3 }}>1 May 2027</div>
            </div>
          </div>

          {/* ── Continue banner ── */}
          {draft && draftTopic && (
            <div className="fade-up" style={{ marginBottom: 16 }}>
              <div style={{ background: '#17120d', borderRadius: 18, padding: '16px 18px' }}>
                <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#f8d783', marginBottom: 6 }}>
                  ↩ You were partway through
                </div>
                <div style={{ color: '#fff', fontWeight: 700, marginBottom: 3 }}>
                  {draftTopic.icon} {draftTopic.title}
                </div>
                <div style={{ color: '#888', fontSize: '.8rem', marginBottom: 14 }}>
                  Left off at: <strong style={{ color: '#ccc' }}>{PHASE_NAMES[draft.phase] || 'Key Facts'}</strong>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={onResume} style={{ flex: 2, background: '#f8d783', color: '#17120d', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 900, cursor: 'pointer', fontSize: '.9rem' }}>
                    Continue →
                  </button>
                  <button onClick={onDiscardDraft} style={{ flex: 1, background: 'transparent', color: '#666', border: '1px solid #333', borderRadius: 12, padding: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '.85rem' }}>
                    Discard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Daily CTA ── */}
          {nextTopic && (
            <div className="fade-up" style={{ marginBottom: 28 }}>
              <div style={{ background: '#fff', border: '1px solid #e8e0d4', borderRadius: 18, padding: '18px' }}>
                <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9a8370', marginBottom: 10 }}>
                  DAILY · Today's session
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: nextTopic.colorLight, color: nextTopic.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                    {nextTopic.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#17120d' }}>{nextTopic.title}</div>
                    <div style={{ fontSize: '.78rem', color: '#9a8370' }}>{nextTopic.era} · ~30 min</div>
                  </div>
                </div>
                <button onClick={() => onStart(nextId)} style={{ width: '100%', background: '#17120d', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontWeight: 900, cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}>
                  {draft ? 'Start fresh session →' : "Start today's session →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Topic progress ── */}
      <div style={{ padding: '0 20px 24px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9a8370' }}>Where you are</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOPICS.map(topic => {
              const tp    = progress.topicProgress?.[topic.id]
              const done  = tp?.completedSessions || 0
              const score = tp?.lastScore != null ? Math.round(tp.lastScore * 100) : null
              const days  = tp?.nextReviewDate ? daysUntil(tp.nextReviewDate) : null
              return (
                <div key={topic.id} onClick={() => onStart(topic.id)} role="button" tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && onStart(topic.id)}
                  style={{ background: '#fff', border: '1px solid #e8e0d4', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: topic.colorLight, color: topic.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                    {topic.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '.93rem', color: '#17120d' }}>{topic.title}</div>
                    <div style={{ fontSize: '.73rem', color: '#9a8370' }}>{topic.era}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {done > 0 ? (
                      <>
                        <div style={{ fontSize: '.73rem', fontWeight: 700, color: '#16a34a' }}>{done} session{done !== 1 ? 's' : ''}</div>
                        {score !== null && <div style={{ fontSize: '.68rem', color: '#9a8370' }}>{score}% last</div>}
                        {days === 0 && <div style={{ fontSize: '.68rem', color: '#dc2626', fontWeight: 700 }}>Review today</div>}
                        {days > 0 && <div style={{ fontSize: '.68rem', color: '#9a8370' }}>in {days}d</div>}
                      </>
                    ) : (
                      <div style={{ fontSize: '.72rem', color: '#ccc' }}>Not started</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Study Modules ── */}
      <div style={{ background: '#17120d', padding: '28px 20px' }}>
        <div className="container">
          <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#f8d783', marginBottom: 6 }}>Study Modules</div>
          <div style={{ color: '#6d5d4d', fontSize: '.82rem', marginBottom: 16 }}>In-depth lessons — read, tap and quiz your way through.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MODULES.map(mod => {
              const savedMod    = safeGetModuleState(mod.id)
              const savedScreen = savedMod.screen || 0
              const pct         = Math.round(((savedScreen + 1) / mod.screens.length) * 100)
              const started     = savedScreen > 0
              return (
                <button key={mod.id} onClick={() => onOpenModule(mod)}
                  style={{ background: '#1f1812', border: '1px solid #2d2318', borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: mod.colorLight, color: mod.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    {mod.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff9ec', fontWeight: 700, fontSize: '.92rem' }}>{mod.title}</div>
                    <div style={{ color: '#6d5d4d', fontSize: '.74rem', marginTop: 2 }}>{mod.subtitle}</div>
                    {started && (
                      <div style={{ marginTop: 7, height: 3, background: '#2d2318', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: pct + '%', background: mod.color, borderRadius: 99 }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {started
                      ? <span style={{ fontSize: '.72rem', color: '#f8d783', fontWeight: 700 }}>{pct}%</span>
                      : <span style={{ fontSize: '.8rem', color: '#444' }}>→</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: '20px', textAlign: 'center', background: '#f7f3ee' }}>
        <p style={{ fontSize: '.75rem', color: '#9a8370' }}>AQA GCSE History · Medicine in Britain c1250–present</p>
      </div>

    </div>
  )
}

// ─── Session orchestrator ────────────────────────────────────────────────────

function Session({ session, topicId, startPhase = 1, initialResults = {}, onFinish, onHome }) {
  const [phase, setPhase]     = useState(startPhase)
  const [results, setResults] = useState(initialResults)
  const topic = TOPICS.find(t => t.id === topicId)
  const pct   = Math.round((phase / 4) * 100)
  const PHASE_LABELS = ['', 'Warm-up', 'Key Facts', 'Mini Quiz', 'Progress']
  const PHASE_ICONS  = ['', '⚡', '📖', '✏️', '📊']

  function advance(partial) {
    const merged   = { ...results, ...partial }
    const nextPhase = phase + 1
    setResults(merged)
    if (phase < 4) {
      setPhase(nextPhase)
      // Save draft so returning users can pick up here
      saveSessionDraft({ topicId, phase: nextPhase, results: merged })
    } else {
      onFinish(merged)
    }
  }

  function exitToHome() {
    // Save current position before leaving
    saveSessionDraft({ topicId, phase, results })
    onHome()
  }

  return (
    <div className="page">
      <div className="sticky-header">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <span className="phase-badge">{PHASE_ICONS[phase]} {PHASE_LABELS[phase]}</span>
            <div className="flex items-center gap-12">
              <span className="text-sm text-muted font-bold">{topic?.title}</span>
              <button onClick={exitToHome} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '.82rem' }}>✕ exit</button>
            </div>
          </div>
          <div className="prog-wrap"><div className="prog-fill" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>

      {phase === 1 && <PhaseWarmup   questions={session.warmupQ} onComplete={r => advance(r)} />}
      {phase === 2 && <PhaseFacts    session={session} topic={topic} onComplete={r => advance(r)} />}
      {phase === 3 && <PhaseMiniQuiz questions={session.miniQuizQ} onComplete={r => advance(r)} />}
      {phase === 4 && <PhaseProgress results={results} topicId={topicId} topic={topic} onComplete={() => advance({})} />}
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
                    <div key={kd.year} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
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
  { name: 'Blood',       emoji: '🩸', color: '#c0392b', bg: '#fdf0ee', element: 'Air',   season: 'Spring', trait: 'Cheerful & optimistic', fact: 'Too much? Doctor cuts a vein or applies leeches.' },
  { name: 'Phlegm',      emoji: '💧', color: '#2980b9', bg: '#e8f4fd', element: 'Water', season: 'Winter', trait: 'Calm & unemotional',    fact: "Too much? You'd be sluggish, pale and cold." },
  { name: 'Yellow Bile', emoji: '⚡', color: '#b7860b', bg: '#fef9e7', element: 'Fire',  season: 'Summer', trait: 'Easily angered',         fact: 'Too much? Causes fever, vomiting, bad temper.' },
  { name: 'Black Bile',  emoji: '🌑', color: '#4a4a5a', bg: '#f0eef5', element: 'Earth', season: 'Autumn', trait: 'Sad & withdrawn',        fact: 'Too much? Causes depression and serious illness.' },
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
                background: isFlipped ? h.bg : 'var(--parchment2)',
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
                background: isRevealed ? (c.wasRight ? '#eafbf0' : '#fdf0ee') : 'var(--parchment2)',
                border: `2px solid ${isRevealed ? (c.wasRight ? 'var(--green)' : 'var(--red)') : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 16px',
                cursor: isRevealed ? 'default' : 'pointer',
                textAlign: 'left', transition: 'all .2s',
              }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
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
            <div style={{ background: '#eafbf0', border: '2px solid var(--green)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: '.75rem', marginBottom: 8 }}>👍 HELPED</div>
              {sorted.helped.map(s => (
                <div key={s.text} style={{ fontSize: '.78rem', marginBottom: 5 }}>
                  {s.correct === 'helped' ? <span>✅ {s.text}</span> : <span style={{ color: 'var(--red)' }}>⚠️ {s.text}</span>}
                </div>
              ))}
            </div>
            <div style={{ background: '#fdf0ee', border: '2px solid var(--red)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontWeight: 700, color: 'var(--red)', fontSize: '.75rem', marginBottom: 8 }}>👎 HINDERED</div>
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
                background: isActive ? '#1a1a2e' : 'var(--parchment2)',
                border: `2px solid ${isActive ? '#4a4a8a' : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                textAlign: 'left', transition: 'all .2s',
              }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
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
            display: 'flex', gap: 14, alignItems: 'flex-start',
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
          <span style={{ fontSize: '1.7rem', fontWeight: 900, fontFamily: 'Playfair Display, serif' }}>{totalRight}/{totalQ}</span>
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
        <div style={{ background: 'var(--parchment2)', borderRadius: 12, padding: '14px 18px', marginBottom: 22, textAlign: 'left' }}>
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
    <div className="page" style={{ justifyContent: 'center', alignItems: 'center', padding: '40px 18px' }}>
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
