import { useState, useEffect, useCallback } from 'react'
import { TOPICS, TOPIC_DATA } from './data/content.js'
import { getProgress, saveSessionResult, getNextTopicId, daysUntil } from './progress.js'

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
  const allQ = Object.entries(TOPIC_DATA).flatMap(([tid, d]) => d.questions)
  return {
    topicId,
    warmupQ:  pickRandom(current.questions, 3).map(withShuffledOptions),
    facts:    current.facts,
    keyDates: current.keyDates,
    miniQuizQ: pickRandom(allQ, Math.min(7, allQ.length)).map(withShuffledOptions),
  }
}

const TOPIC_IDS = TOPICS.map(t => t.id)

// ─── Top-level router ────────────────────────────────────────────────────────

export default function App() {
  const [view, setView]       = useState('home')   // 'home' | 'session' | 'end'
  const [topicId, setTopicId] = useState(null)
  const [session, setSession] = useState(null)
  const [results, setResults] = useState({})
  const [savedData, setSavedData] = useState(null)
  const [progress, setProgress] = useState(() => getProgress())

  function startSession(id) {
    setTopicId(id)
    setSession(buildSession(id))
    setResults({})
    setSavedData(null)
    setView('session')
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
    setView('end')
  }

  function goHome() {
    setProgress(getProgress())
    setView('home')
  }

  if (view === 'home') {
    return <Home progress={progress} onStart={startSession} />
  }
  if (view === 'session' && session) {
    return <Session session={session} topicId={topicId} onFinish={finishSession} onHome={goHome} />
  }
  if (view === 'end') {
    return <EndScreen topicId={topicId} results={results} savedData={savedData} onHome={goHome} onStart={startSession} />
  }
  return null
}

// ─── Home ────────────────────────────────────────────────────────────────────

function Home({ progress, onStart }) {
  const nextId = getNextTopicId(TOPIC_IDS)
  const nextTopic = TOPICS.find(t => t.id === nextId)

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <div className="container">
          <div className="fade-up"><span className="label" style={{ color: 'var(--gold2)' }}>AQA GCSE History</span></div>
          <h1 className="fade-up" style={{ marginTop: 10, marginBottom: 14 }}>Medicine in Britain</h1>
          <p className="fade-up">30 minutes a day. Four eras. Spaced repetition that actually sticks.</p>

          {progress.streak > 0 && (
            <div className="fade-up" style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
              <span className="streak">🔥 {progress.streak}-day streak — keep it going!</span>
            </div>
          )}

          {nextTopic && (
            <div className="fade-up">
              <button className="btn btn-red btn-lg" onClick={() => onStart(nextId)}>
                Start today's session →
              </button>
              <p style={{ color: '#666688', fontSize: '.83rem', marginTop: 10 }}>
                Today: <strong style={{ color: '#fff' }}>{nextTopic.title}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="how-strip">
        <div className="container">
          <p className="label" style={{ color: 'var(--gold2)', marginBottom: 16 }}>How it works</p>
          <div className="how-grid">
            {[
              { icon: '⚡', t: 'Warm-up',   d: '3 quick questions to activate memory' },
              { icon: '📖', t: 'Key Facts',  d: 'Core content in plain language' },
              { icon: '✏️', t: 'Mini Quiz',  d: '5–7 questions across all topics' },
              { icon: '📊', t: 'Snapshot',   d: 'Score + next review date' },
            ].map(s => (
              <div className="how-card" key={s.t}>
                <div style={{ fontSize: '1.4rem', marginBottom: 7 }}>{s.icon}</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '.88rem', marginBottom: 3 }}>{s.t}</div>
                <div style={{ color: '#666688', fontSize: '.78rem' }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="section" style={{ flexGrow: 1 }}>
        <div className="container">
          <p className="label" style={{ marginBottom: 16 }}>All four eras</p>
          <div className="grid-stack">
            {TOPICS.map(topic => {
              const tp    = progress.topicProgress?.[topic.id]
              const done  = tp?.completedSessions || 0
              const score = tp?.lastScore != null ? Math.round(tp.lastScore * 100) : null
              const days  = tp?.nextReviewDate ? daysUntil(tp.nextReviewDate) : null

              return (
                <div key={topic.id} className="topic-card fade-up" onClick={() => onStart(topic.id)} role="button" tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && onStart(topic.id)}>
                  <div className="topic-icon" style={{ background: topic.colorLight, color: topic.color }}>{topic.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex gap-8" style={{ flexWrap: 'wrap', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: '.96rem' }}>{topic.title}</span>
                      <span style={{ fontSize: '.73rem', color: 'var(--muted)' }}>{topic.era}</span>
                    </div>
                    <div style={{ fontSize: '.79rem', color: 'var(--muted)', marginTop: 2 }}>{topic.subtitle}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {done > 0 ? (
                      <>
                        <div style={{ fontSize: '.74rem', color: 'var(--green)', fontWeight: 700 }}>{done} session{done !== 1 ? 's' : ''}</div>
                        {score !== null && <div style={{ fontSize: '.71rem', color: 'var(--muted)' }}>Last: {score}%</div>}
                        {days === 0
                          ? <div style={{ fontSize: '.71rem', color: 'var(--red)', fontWeight: 600 }}>Due today</div>
                          : days > 0 && <div style={{ fontSize: '.71rem', color: 'var(--muted)' }}>Review in {days}d</div>}
                      </>
                    ) : (
                      <div style={{ fontSize: '.74rem', color: 'var(--muted)' }}>Not started</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Session orchestrator ────────────────────────────────────────────────────

function Session({ session, topicId, onFinish, onHome }) {
  const [phase, setPhase]     = useState(1)  // 1 warm-up | 2 facts | 3 quiz | 4 progress
  const [results, setResults] = useState({})

  const topic = TOPICS.find(t => t.id === topicId)
  const pct   = Math.round((phase / 4) * 100)

  const PHASE_LABELS = ['', 'Warm-up', 'Key Facts', 'Mini Quiz', 'Progress']
  const PHASE_ICONS  = ['', '⚡', '📖', '✏️', '📊']

  function advance(partial) {
    const merged = { ...results, ...partial }
    setResults(merged)
    if (phase < 4) { setPhase(p => p + 1) }
    else            { onFinish(merged) }
  }

  return (
    <div className="page">
      {/* Sticky header */}
      <div className="sticky-header">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <span className="phase-badge">{PHASE_ICONS[phase]} {PHASE_LABELS[phase]}</span>
            <div className="flex items-center gap-12">
              <span className="text-sm text-muted font-bold">{topic?.title}</span>
              <button onClick={onHome} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '.82rem' }}>✕ exit</button>
            </div>
          </div>
          <div className="prog-wrap"><div className="prog-fill" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>

      {phase === 1 && <PhaseWarmup  questions={session.warmupQ}  onComplete={r => advance(r)} />}
      {phase === 2 && <PhaseFacts   facts={session.facts} keyDates={session.keyDates} topic={topic} onComplete={r => advance(r)} />}
      {phase === 3 && <PhaseMiniQuiz questions={session.miniQuizQ} onComplete={r => advance(r)} />}
      {phase === 4 && <PhaseProgress results={results} topicId={topicId} topic={topic} onComplete={() => advance({})} />}
    </div>
  )
}

// ─── Phase 1: Warm-up ────────────────────────────────────────────────────────

function PhaseWarmup({ questions, onComplete }) {
  const [idx, setIdx]         = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore]     = useState(0)
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

// ─── Phase 2: Facts ──────────────────────────────────────────────────────────

function PhaseFacts({ facts, keyDates, topic, onComplete }) {
  return (
    <div className="section">
      <div className="container fade-up">
        <h2 style={{ marginBottom: 4 }}>Key facts</h2>
        <p style={{ fontSize: '.9rem', marginBottom: 22 }}>Read these — they'll come up in the quiz.</p>

        <div className="card mb-16">
          {facts.map(f => (
            <div key={f.id} className="fact-item">
              <div className="fact-dot" style={{ background: topic?.color || 'var(--red)' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '.8rem', color: topic?.color || 'var(--ink)', marginBottom: 4 }}>{f.keyTerm}</div>
                <p style={{ fontSize: '.92rem', margin: 0 }}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>

        {keyDates?.length > 0 && (
          <div className="card mb-24">
            <div className="label mb-12">Key dates</div>
            <div className="grid-stack">
              {keyDates.map(kd => (
                <div key={kd.year} className="flex gap-12 items-center" style={{ flexWrap: 'wrap' }}>
                  <span className="date-pill">📅 {kd.year}</span>
                  <span style={{ fontSize: '.9rem' }}>{kd.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-12">
          <button className="btn btn-green" style={{ flex: 2 }} onClick={() => onComplete({ factConfidence: 'got_it' })}>Got it — quiz me! ✓</button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => onComplete({ factConfidence: 'not_sure' })}>Not sure</button>
        </div>
      </div>
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

// ─── Phase 4: Progress snapshot ──────────────────────────────────────────────

function PhaseProgress({ results, topicId, topic, onComplete }) {
  const { warmupScore = 0, quizScore = 0, quizTotal = 0 } = results
  const totalRight = warmupScore + quizScore
  const totalQ     = 3 + quizTotal
  const pct        = Math.round((totalRight / totalQ) * 100)
  const ringClass  = pct >= 70 ? '' : pct >= 50 ? 'mid' : 'low'

  const progress = getProgress()
  const tp   = progress.topicProgress?.[topicId]
  const days = tp?.nextReviewDate ? Math.max(0, Math.round((new Date(tp.nextReviewDate) - new Date()) / 86400000)) : 3

  return (
    <div className="section">
      <div className="container anim-pop" style={{ textAlign: 'center' }}>
        <div className={`result-ring ${ringClass}`} style={{ marginBottom: 22 }}>
          <span style={{ fontSize: '1.7rem', fontWeight: 900, fontFamily: 'Playfair Display, serif' }}>{totalRight}/{totalQ}</span>
          <span style={{ fontSize: '.73rem', color: 'var(--muted)' }}>correct</span>
        </div>

        <h2 style={{ marginBottom: 8 }}>
          {pct >= 80 ? 'Excellent work! 🏆' : pct >= 60 ? 'Solid session 👍' : 'Keep at it 💪'}
        </h2>
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
  const topic     = TOPICS.find(t => t.id === topicId)
  const currentIdx = TOPIC_IDS.indexOf(topicId)
  const nextId    = TOPIC_IDS[(currentIdx + 1) % TOPIC_IDS.length]
  const nextTopic = TOPICS.find(t => t.id === nextId)
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
