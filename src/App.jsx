import { useState } from 'react'
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

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'home',    icon: '🏠', label: 'Home'    },
    { id: 'modules', icon: '📚', label: 'Modules' },
    { id: 'test',    icon: '✏️', label: 'Test'    },
  ]
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#fdfaf5', borderTop: '1px solid #e5ddd0',
      display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)}
          style={{
            flex: 1, border: 'none', background: 'none', cursor: 'pointer',
            padding: '10px 0 8px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3, transition: 'opacity .15s',
          }}>
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{t.icon}</span>
          <span style={{
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.04em',
            color: tab === t.id ? '#3d2e1e' : '#9e8f7e',
          }}>{t.label}</span>
          {tab === t.id && (
            <div style={{ width: 20, height: 2, background: '#c8922a', borderRadius: 99, marginTop: 2 }} />
          )}
        </button>
      ))}
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
    <div style={{ background: '#f5f0e8', minHeight: '100vh' }}>
      {tab === 'home'    && <Home    progress={progress} draft={draft} onStart={startSession} onResume={resumeSession} onDiscardDraft={discardDraft} onOpenModule={openModule} />}
      {tab === 'modules' && <ModulesTab onOpenModule={openModule} />}
      {tab === 'test'    && <TestTab />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}

// ─── Shared palette ──────────────────────────────────────────────────────────

const W = {
  bg:         '#f5f0e8',
  bgCard:     '#fdfaf5',
  border:     '#e5ddd0',
  text:       '#2c2016',
  textMid:    '#6b5c4a',
  textMuted:  '#9e8f7e',
  textLight:  '#c4b8a8',
  gold:       '#c8922a',
  goldLight:  '#f5e4b8',
  green:      '#3a7d44',
  btnPrimary: '#3d2e1e',
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
  const nextId     = getNextTopicId(TOPIC_IDS)
  const nextTopic  = TOPICS.find(t => t.id === nextId)
  const draftTopic = draft ? TOPICS.find(t => t.id === draft.topicId) : null
  const PHASE_NAMES = ['', 'Warm-up', 'Key Facts', 'Mini Quiz', 'Progress']
  const greeting   = GREETINGS[Math.floor(Date.now() / 86400000) % GREETINGS.length]
  const streak     = progress.streak || 0
  const bestStreak = progress.bestStreak || streak
  const examDays   = daysUntilExam()
  const totalSessions = Object.values(progress.topicProgress || {}).reduce((s, t) => s + (t.completedSessions || 0), 0)

  // Next module to do — first one not completed
  const nextModule = MODULES.find(m => {
    const s = safeGetModuleState(m.id)
    return !s.screen || s.screen < m.screens.length - 1
  }) || MODULES[0]

  return (
    <div style={{ background: W.bg, minHeight: '100vh', paddingBottom: 80 }}>

      {/* Top bar */}
      <div style={{ background: W.bgCard, borderBottom: `1px solid ${W.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.05rem', color: W.text }}>
          Revision
        </div>
        {streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: W.goldLight, border: '1px solid #e8cfa0', borderRadius: 99, padding: '5px 12px' }}>
            <span style={{ fontSize: '.9rem' }}>🔥</span>
            <span style={{ fontWeight: 800, fontSize: '.85rem', color: W.gold }}>{streak} day{streak !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '24px 18px 0' }}>

        {/* Greeting */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: W.textMuted, marginBottom: 8 }}>Your progress</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', color: W.text, lineHeight: 1.2, margin: 0 }}>
            {greeting}
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { emoji: '🔥', value: streak, label: 'Day streak', sub: bestStreak > 1 ? `Best: ${bestStreak}` : null, subColor: W.gold },
            { emoji: '📚', value: totalSessions, label: 'Sessions' },
            { emoji: '📅', value: examDays, label: 'Days to go', sub: '1 May 2027', subColor: W.textMuted },
          ].map((s, i) => (
            <div key={i} style={{ background: W.bgCard, border: `1px solid ${W.border}`, borderRadius: 16, padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', color: W.text, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '.61rem', fontWeight: 600, color: W.textMuted, textTransform: 'uppercase', letterSpacing: '.07em', marginTop: 4 }}>{s.label}</div>
              {s.sub && <div style={{ fontSize: '.61rem', color: s.subColor || W.textMuted, marginTop: 3 }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Continue banner */}
        {draft && draftTopic && (
          <div style={{ background: W.btnPrimary, borderRadius: 18, padding: '16px 18px', marginBottom: 16 }}>
            <div style={{ fontSize: '.63rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: W.gold, marginBottom: 6 }}>↩ Unfinished session</div>
            <div style={{ color: '#f0e8da', fontWeight: 700, marginBottom: 2 }}>{draftTopic.icon} {draftTopic.title}</div>
            <div style={{ color: W.textMuted, fontSize: '.78rem', marginBottom: 14 }}>Left off at: <strong style={{ color: '#d4c4b0' }}>{PHASE_NAMES[draft.phase] || 'Key Facts'}</strong></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onResume} style={{ flex: 2, background: W.gold, color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '.9rem', fontFamily: 'inherit' }}>Continue →</button>
              <button onClick={onDiscardDraft} style={{ flex: 1, background: 'transparent', color: W.textMuted, border: '1px solid #4a3828', borderRadius: 12, padding: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '.82rem', fontFamily: 'inherit' }}>Discard</button>
            </div>
          </div>
        )}

        {/* Today's module */}
        {nextModule && (
          <div style={{ background: W.bgCard, border: `1px solid ${W.border}`, borderRadius: 18, padding: '18px', marginBottom: 20 }}>
            <div style={{ fontSize: '.63rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: W.textMuted, marginBottom: 12 }}>Daily · Today's module</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: nextModule.colorLight, color: nextModule.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                {nextModule.icon}
              </div>
              <div>
                <div style={{ fontSize: '.63rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: W.gold, marginBottom: 2 }}>{nextModule.subject} · Module {nextModule.number}</div>
                <div style={{ fontWeight: 800, fontSize: '.97rem', color: W.text }}>{nextModule.title}</div>
                <div style={{ fontSize: '.75rem', color: W.textMuted }}>{nextModule.subtitle}</div>
              </div>
            </div>
            <button onClick={() => onOpenModule(nextModule)} style={{ width: '100%', background: W.btnPrimary, color: '#f0e8da', border: 'none', borderRadius: 13, padding: '14px', fontWeight: 800, cursor: 'pointer', fontSize: '.97rem', fontFamily: 'inherit' }}>
              Start today's module →
            </button>
          </div>
        )}

        {/* Recent modules — last 2 touched */}
        {(() => {
          const recent = MODULES.filter(m => safeGetModuleState(m.id).screen > 0).slice(0, 2)
          if (!recent.length) return null
          return (
            <div>
              <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: W.textMuted, marginBottom: 12 }}>Continue where you left off</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recent.map(mod => {
                  const s = safeGetModuleState(mod.id)
                  const pct = Math.round(((s.screen + 1) / mod.screens.length) * 100)
                  return (
                    <button key={mod.id} onClick={() => onOpenModule(mod)}
                      style={{ background: W.bgCard, border: `1px solid ${W.border}`, borderRadius: 14, padding: '13px 15px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: mod.colorLight, color: mod.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{mod.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: W.gold, fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>{mod.subject} · Module {mod.number}</div>
                        <div style={{ color: W.text, fontWeight: 700, fontSize: '.9rem' }}>{mod.title}</div>
                        <div style={{ marginTop: 6, height: 3, background: W.border, borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: pct + '%', background: mod.color, borderRadius: 99 }} />
                        </div>
                      </div>
                      <div style={{ color: W.gold, fontWeight: 700, fontSize: '.75rem', flexShrink: 0 }}>{pct}%</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })()}

      </div>
    </div>
  )
}

// ─── Modules tab ──────────────────────────────────────────────────────────────

function ModulesTab({ onOpenModule }) {
  const subjects = [...new Set(MODULES.map(m => m.subject))]

  return (
    <div style={{ background: W.bg, minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: W.bgCard, borderBottom: `1px solid ${W.border}`, padding: '14px 20px' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.05rem', color: W.text }}>Modules</div>
        <div style={{ fontSize: '.78rem', color: W.textMuted, marginTop: 3 }}>Work through these daily — one module at a time.</div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '20px 18px' }}>
        {subjects.map(subject => {
          const mods = MODULES.filter(m => m.subject === subject)
          return (
            <div key={subject} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: W.textMuted, marginBottom: 12 }}>{subject}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mods.map(mod => {
                  const s       = safeGetModuleState(mod.id)
                  const screen  = s.screen || 0
                  const pct     = Math.round(((screen + 1) / mod.screens.length) * 100)
                  const done    = screen >= mod.screens.length - 1
                  const started = screen > 0
                  return (
                    <button key={mod.id} onClick={() => onOpenModule(mod)}
                      style={{ background: W.bgCard, border: `1px solid ${done ? '#b8d8be' : W.border}`, borderRadius: 14, padding: '13px 15px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: mod.colorLight, color: mod.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', position: 'relative' }}>
                        {mod.icon}
                        {done && <div style={{ position: 'absolute', top: -4, right: -4, background: W.green, color: '#fff', borderRadius: 99, width: 16, height: 16, fontSize: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>✓</div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: W.gold, fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>{mod.subject} · Module {mod.number}</div>
                        <div style={{ color: W.text, fontWeight: 700, fontSize: '.92rem' }}>{mod.title}</div>
                        <div style={{ color: W.textMuted, fontSize: '.73rem', marginTop: 1 }}>{mod.subtitle}</div>
                        {started && !done && (
                          <div style={{ marginTop: 7, height: 3, background: W.border, borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: pct + '%', background: mod.color, borderRadius: 99 }} />
                          </div>
                        )}
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        {done
                          ? <span style={{ fontSize: '.72rem', color: W.green, fontWeight: 700 }}>Done ✓</span>
                          : started
                            ? <span style={{ fontSize: '.72rem', color: W.gold, fontWeight: 700 }}>{pct}%</span>
                            : <span style={{ fontSize: '.8rem', color: W.textLight }}>→</span>}
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
    { q: 'Describe two features of medieval hospitals. [4 marks]', type: 'written', marks: 4, ms: 'Award up to 2 marks per feature (1 for identifying, 1 for supporting detail). Features include: run by the Church/monks/nuns; focused on care and prayer rather than curing disease; St Bartholomew\\'s Hospital founded 1123; patients prayed and received basic care; hospitals were places of rest not medical treatment; staffed by religious orders.' },
    { q: 'Explain why the Church both helped and hindered medicine in the Middle Ages. [12 marks]', type: 'written', marks: 12, ms: 'Helped: preserved Galen\\'s texts in universities; ran hospitals like St Bartholomew\\'s (1123); provided care for sick; trained physicians. Hindered: discouraged dissection (body needed to be whole for resurrection); treated Galen\\'s work as unquestionable; linked illness to sin/God\\'s punishment; discouraged new thinking. Strong answers explain the mechanism, not just list.' },
    { q: 'How far was the Black Death a turning point in the history of medicine? Explain your answer. [16 marks]', type: 'written', marks: 16, ms: 'Was a turning point: exposed limits of medieval medicine; prompted some public health action. Counter: beliefs and treatments barely changed; humours still dominant after 1349; no new understanding of disease. Strong answers need specific evidence (1348 arrival, 1/3 died, miasma/God\\'s punishment blamed), explain why change/continuity happened, reach clear supported judgement.' },
    { q: '"The main reason medieval medicine made little progress was the influence of the Church." How far do you agree? Explain your answer. [16 marks]', type: 'written', marks: 16, ms: 'Agree: Church backed Galen, discouraged dissection, linked illness to God, trained physicians in outdated ideas. Disagree: other factors — lack of technology, four humours theory itself, tradition and conservatism, limited scientific method, Galen\\'s own authority. Strong answers argue both sides with specific evidence, reach a clear judgement about which factor was most important and why.' },
  ],
  th2: [
    { q: "Describe two features of Vesalius's contribution to medicine. [4 marks]", type: 'written', marks: 4, ms: 'Award up to 2 marks per feature. Features: corrected over 300 of Galen\\'s errors; used human dissection himself; published De Fabrica (1543); proved jaw is one bone; showed septum of heart had no holes; encouraged observation over ancient authority.' },
    { q: "Explain why Harvey's discovery of blood circulation did not immediately lead to better treatments. [12 marks]", type: 'written', marks: 12, ms: 'Key points: Harvey proved blood circulates but could not explain what blood does; doctors still used bloodletting because they did not know what else to do; understanding does not automatically change treatment; conservative medical profession; lack of technology. Strong answers explain the mechanism — why understanding and treatment are separate things.' },
    { q: 'How far did the Renaissance change medicine? Explain your answer. [16 marks]', type: 'written', marks: 16, ms: 'Changed: Vesalius corrected anatomy, Harvey proved circulation, Paré improved surgery, printing press spread ideas. Continuity: treatments barely changed, humours still used, bleeding/purging continued, Great Plague 1665 shows disease understanding remained poor. Strong answers: balanced argument with specific evidence, clear judgement on extent of change.' },
  ],
  th3: [
    { q: 'Describe two problems with surgery before the 1840s. [4 marks]', type: 'written', marks: 4, ms: 'Award up to 2 marks per problem. Problems: no anaesthetic so patients conscious and in pain; no antiseptics so infection was common; no blood transfusions so blood loss often fatal; dirty instruments spread infection; surgeons judged on speed not care.' },
    { q: 'Explain why anaesthetics both helped and created new problems for surgery. [12 marks]', type: 'written', marks: 12, ms: 'Helped: removed pain, patients could stay still, surgeons could work more carefully, longer operations possible. Problems: longer operations increased infection risk; overconfidence led to more ambitious surgery before antiseptics; chloroform could be fatal if overdosed (Hannah Greener, 1848). Strong answers explain both effects with specific evidence.' },
    { q: "How important was Lister's use of antiseptics in improving surgery? [16 marks]", type: 'written', marks: 16, ms: 'Important: carbolic acid dramatically reduced infection deaths; applied Pasteur\\'s germ theory practically; changed surgical practice; aseptic surgery followed. Limits: other factors also improved surgery — anaesthetics (Simpson 1847), blood groups, aseptic methods went further; initial resistance from surgeons. Strong answers: weigh against other factors, reach supported judgement.' },
  ],
  th4: [
    { q: "Describe two features of Pasteur's germ theory. [4 marks]", type: 'written', marks: 4, ms: 'Award up to 2 marks per feature. Features: proved micro-organisms cause disease/decay; swan-neck flask experiment (1861); overturned spontaneous generation; showed microbes come from air; led to pasteurisation; opened door to vaccines and antiseptics.' },
    { q: "Explain why Koch's work was important for the development of medicine. [12 marks]", type: 'written', marks: 12, ms: 'Key points: identified specific bacteria causing specific diseases (anthrax 1876, TB 1882, cholera 1883); developed staining techniques; made germ theory more convincing; enabled development of targeted treatments; built on Pasteur\\'s general germ theory. Strong answers explain why specificity mattered.' },
    { q: '"Pasteur\\'s germ theory was the most important development in medicine in the 19th century." How far do you agree? [16 marks]', type: 'written', marks: 16, ms: 'Agree: germ theory underpinned antiseptic surgery, vaccines, public health reform; changed direction of all medicine; Pasteur\\'s swan-neck flask 1861 was pivotal. Disagree: other developments also important — anaesthetics (Simpson 1847), public health acts (1848, 1875), Koch\\'s specific discoveries, Lister\\'s antiseptics, Snow\\'s waterborne cholera proof. Strong answers: weigh with specific evidence, clear supported judgement.' },
  ],
  th5: [
    { q: 'Describe two features of the 1875 Public Health Act. [4 marks]', type: 'written', marks: 4, ms: 'Award up to 2 marks per feature. Features: compulsory clean water supply; compulsory sewage systems; local authorities had to appoint medical officers of health; made sanitation improvements mandatory; shift away from laissez-faire; built on the weaker 1848 Act.' },
    { q: 'Explain why the government was slow to improve public health in the early 19th century. [12 marks]', type: 'written', marks: 12, ms: 'Key reasons: laissez-faire attitude (government should not interfere); cost — ratepayers did not want to pay; miasma theory meant people did not fully understand disease; vested interests (landlords, water companies); local not national responsibility; 1848 Act was optional not compulsory. Strong answers explain mechanism with evidence.' },
    { q: 'How far was the Great Stink of 1858 a turning point in the history of public health? [16 marks]', type: 'written', marks: 16, ms: 'Was a turning point: Parliament directly affected so reform became urgent; led to Bazalgette\\'s sewer system; reduced cholera outbreaks in London; showed engineering could solve public health. Not/other factors: Chadwick\\'s 1842 report laid groundwork; Snow\\'s 1854 pump handle removal proved waterborne spread; 1875 Act was arguably more significant nationally. Strong answers: balanced argument, specific evidence, clear judgement.' },
  ],

  // ── BIOLOGY — Cells & microscopy ─────────────────────────────────────────────
  // Sources: Jun22 Q2, Jun23 Q7, Jun24 B1 Q1

  tb_cells: [
    {
      q: 'What is the function of the nucleus in a cell? Tick ONE box.\n\n[ ] To contain a solution called cell sap\n[ ] To control the activities of the whole cell\n[ ] To control the movement of substances into the cell',
      type: 'mc', marks: 1,
      options: ['To contain a solution called cell sap', 'To control the activities of the whole cell', 'To control the movement of substances into the cell'],
      correct: 1,
      ms: 'To control the activities of the whole cell. [1 mark]'
    },
    {
      q: 'What is the function of the mitochondria in a cell? Tick ONE box.\n\n[ ] To produce glucose during photosynthesis\n[ ] To produce proteins for the cell\n[ ] To release energy in respiration',
      type: 'mc', marks: 1,
      options: ['To produce glucose during photosynthesis', 'To produce proteins for the cell', 'To release energy in respiration'],
      correct: 2,
      ms: 'To release energy in respiration. [1 mark]'
    },
    {
      q: 'A palisade cell image measured 28 mm in length when viewed at a magnification of ×400. Calculate the real length of the palisade cell in mm. Then convert to micrometres (µm). 1 mm = 1000 µm. [3 marks]\n\nUse: real length = image length ÷ magnification',
      type: 'written', marks: 3,
      ms: 'Real length = 28 ÷ 400 = 0.07 mm [2 marks for correct working and answer]. Conversion: 0.07 × 1000 = 70 µm [1 mark]. Allow ecf from incorrect real length calculation.'
    },
    {
      q: 'Give ONE advantage of using an electron microscope compared with a light microscope. [1 mark]',
      type: 'written', marks: 1,
      ms: 'Any one from: greater magnification; higher resolving power; can see (smaller) subcellular structures/parts; can see more detail inside cells; reference to 3-D images.'
    },
    {
      q: 'Give ONE way you can tell that an animal cell is NOT a plant cell. [1 mark]',
      type: 'written', marks: 1,
      ms: 'Any one from: does not have a cell wall; does not have a (large) vacuole; does not have chloroplasts. Ignore chlorophyll.'
    },
    {
      q: 'Which part of a cell controls the movement of substances into and out of the cell? Tick ONE box.\n\n[ ] Cell membrane\n[ ] Cytoplasm\n[ ] Nucleus',
      type: 'mc', marks: 1,
      options: ['Cell membrane', 'Cytoplasm', 'Nucleus'],
      correct: 0,
      ms: 'Cell membrane. [1 mark]'
    },
  ],

  // ── BIOLOGY — Digestion & enzymes ─────────────────────────────────────────────
  // Sources: Jun20 Q6, Jun22 Q1, Jun23 Q2, Jun24 B1 Q6

  tb_digest: [
    {
      q: 'What type of enzyme is produced in the stomach? Tick ONE box.\n\n[ ] Carbohydrase\n[ ] Lipase\n[ ] Protease',
      type: 'mc', marks: 1,
      options: ['Carbohydrase', 'Lipase', 'Protease'],
      correct: 2,
      ms: 'Protease. [1 mark]'
    },
    {
      q: 'Which term describes the pH in the stomach? And give ONE reason why the stomach is this pH. [2 marks]\n\n[ ] Acidic  [ ] Alkaline  [ ] Neutral',
      type: 'written', marks: 2,
      ms: 'Acidic [1 mark]. Reason: any one from — produces (hydrochloric) acid; optimum/best condition for protease/enzyme to act; to kill microorganisms/bacteria/pathogens. [1 mark]'
    },
    {
      q: 'Which organ produces bile? Tick ONE box.\n\n[ ] Large intestine\n[ ] Liver\n[ ] Mouth\n[ ] Pancreas',
      type: 'mc', marks: 1,
      options: ['Large intestine', 'Liver', 'Mouth', 'Pancreas'],
      correct: 1,
      ms: 'Liver. [1 mark]'
    },
    {
      q: 'How does bile help in the digestion of foods? Tick ONE box.\n\n[ ] It increases the surface area of fats\n[ ] It is an enzyme that digests protein\n[ ] It makes the pH in the small intestine acidic',
      type: 'mc', marks: 1,
      options: ['It increases the surface area of fats', 'It is an enzyme that digests protein', 'It makes the pH in the small intestine acidic'],
      correct: 0,
      ms: 'It increases the surface area of fats. [1 mark] — bile emulsifies fats, breaking them into smaller droplets to increase surface area for lipase to act on.'
    },
    {
      q: 'What molecules are produced when starch is digested? Tick ONE box.\n\n[ ] Amino acids\n[ ] Fatty acids\n[ ] Sugars',
      type: 'mc', marks: 1,
      options: ['Amino acids', 'Fatty acids', 'Sugars'],
      correct: 2,
      ms: 'Sugars. [1 mark] — amylase breaks starch down into maltose/glucose (sugars).'
    },
    {
      q: 'What is the name of the enzyme that digests starch? [1 mark]',
      type: 'written', marks: 1,
      ms: 'Amylase. Allow phonetic spelling. Allow carbohydrase. Do NOT accept amylose.'
    },
    {
      q: 'Where are most food molecules absorbed? Tick ONE box.\n\n[ ] Large intestine\n[ ] Liver\n[ ] Small intestine\n[ ] Stomach',
      type: 'mc', marks: 1,
      options: ['Large intestine', 'Liver', 'Small intestine', 'Stomach'],
      correct: 2,
      ms: 'Small intestine. [1 mark]'
    },
    {
      fig: 'nov20_villi',
      q: 'Explain how villi are adapted for efficient absorption of sugar molecules. [4 marks]',
      type: 'written', marks: 4,
      ms: 'Level 2 (3–4): points identified in detail and logically linked. Level 1 (1–2): points stated simply, no linking.\n\nIndicative content: have (many) microvilli to increase surface area; wall of villus only one cell thick/thin so short diffusion pathway; capillaries close to surface; good blood supply to transport food molecules away and maintain diffusion gradient; cells have many mitochondria providing energy for active transport of sugar molecules. For Level 2 must link structure to function.'
    },
    {
      q: 'Describe how protein and fat are digested. Include the enzymes involved and where they are produced. [6 marks]',
      type: 'written', marks: 6,
      ms: 'Level 2 (4–6): accurate detail forming a clear account. Level 1 (1–3): facts stated simply.\n\nProtein: protease enzyme; broken down into amino acids; produced in the stomach; produced in the pancreas; produced in the small intestine; hydrochloric acid provides correct pH for protease in stomach.\n\nFat: lipase enzyme; broken down into fatty acids and glycerol; produced by the pancreas; produced by the small intestine; bile produced by the liver, released from gall bladder; bile emulsifies fats (increases surface area for lipase); bile neutralises acid to provide correct pH.\n\nFor Level 2 must describe digestion of BOTH fat and protein linked to correct enzyme type for both.'
    },
  ],

  // ── BIOLOGY — Transpiration & stomata ─────────────────────────────────────────
  // Sources: Jun20 Q3, Jun23 Q3, Jun24 B1 Q2

  tb_transp: [
    {
      q: 'What is the loss of water from a leaf called? Tick ONE box.\n\n[ ] Osmosis\n[ ] Respiration\n[ ] Transpiration',
      type: 'mc', marks: 1,
      options: ['Osmosis', 'Respiration', 'Transpiration'],
      correct: 2,
      ms: 'Transpiration. [1 mark]'
    },
    {
      q: 'Which cells control the size of stomata? Tick ONE box.\n\n[ ] Guard cells\n[ ] Phloem cells\n[ ] Xylem cells',
      type: 'mc', marks: 1,
      options: ['Guard cells', 'Phloem cells', 'Xylem cells'],
      correct: 0,
      ms: 'Guard cells. [1 mark]'
    },
    {
      fig: 'nov20_leaf_experiment',
      q: 'A leaf grease experiment showed: Leaf B (upper surface covered) lost 0.13 g of mass; Leaf C (lower surface covered) lost 0.05 g. What evidence does this give about where most water is lost from? [1 mark]',
      type: 'written', marks: 1,
      ms: 'Leaf B (upper surface covered) lost more mass/water than Leaf C (lower surface covered), so more water is lost from the lower surface. Allow: "lower surface lost 0.13 g and upper surface lost 0.05 g" with conclusion.'
    },
    {
      q: 'Based on the leaf grease experiment, what do the results show about the number of stomata on leaf surfaces? Tick ONE box.\n\n[ ] There are more stomata on the lower surface\n[ ] There are more stomata on the upper surface\n[ ] There are the same number of stomata on both surfaces',
      type: 'mc', marks: 1,
      options: ['There are more stomata on the lower surface', 'There are more stomata on the upper surface', 'There are the same number of stomata on both surfaces'],
      correct: 0,
      ms: 'There are more stomata on the lower surface. [1 mark] — because more water was lost when the lower surface was uncovered (Leaf B vs Leaf C).'
    },
    {
      q: 'A leaf investigation was done at 20°C. How would the mass of water lost be different at 25°C? Give a reason for your answer. [2 marks]',
      type: 'written', marks: 2,
      ms: 'More (mass/water) lost [1 mark] because evaporation/transpiration would be faster at higher temperature [1 mark].'
    },
    {
      q: 'A student investigated loss of mass from leaves in different wind speeds. Results: fan off = 0.06 g, low = 0.15 g, medium = 0.23 g, high = 0.31 g.\n\nHow does increasing fan speed affect the loss of mass from the leaves? Use the results. [1 mark]',
      type: 'written', marks: 1,
      ms: 'Loss of mass increases (as fan speed increases). Allow: more mass/water is lost; mass of leaves decreases more.'
    },
    {
      q: 'Explain why the mass of leaves decreased at all fan speeds (including with the fan off). [3 marks]',
      type: 'written', marks: 3,
      ms: 'Loss of water [1 mark] because water evaporated [1 mark] from stomata/stoma [1 mark]. Allow: by transpiration; by diffusion. Ignore: from guard cells.'
    },
    {
      q: 'What rate of water loss from a plant losing 9.0 g over 5 hours? Tick ONE box.\n\n[ ] 0.9 grams/hour\n[ ] 1.8 grams/hour\n[ ] 9.0 grams/hour',
      type: 'mc', marks: 1,
      options: ['0.9 grams/hour', '1.8 grams/hour', '9.0 grams/hour'],
      correct: 1,
      ms: '1.8 grams/hour. [1 mark] — 9.0 ÷ 5 = 1.8 g/hour.'
    },
  ],

  // ── BIOLOGY — Respiration ─────────────────────────────────────────────────────
  // Sources: Jun20 Q1, Jun23 Q5

  tb_resp: [
    {
      q: 'What is the equation for aerobic respiration? Tick ONE box.\n\n[ ] carbon dioxide + water → glucose + oxygen\n[ ] glucose + oxygen → carbon dioxide + water\n[ ] oxygen + water → glucose + carbon dioxide',
      type: 'mc', marks: 1,
      options: ['carbon dioxide + water → glucose + oxygen', 'glucose + oxygen → carbon dioxide + water', 'oxygen + water → glucose + carbon dioxide'],
      correct: 1,
      ms: 'glucose + oxygen → carbon dioxide + water. [1 mark]'
    },
    {
      q: 'Give two health benefits of regular exercise. Do NOT refer to losing body mass. [2 marks]',
      type: 'written', marks: 2,
      ms: 'Any two from: strengthens muscles; strengthens heart muscle; reduces risk of coronary heart disease; reduces blood pressure; reduces risk of Type 2 diabetes; improves mental health/mood; improves mobility; improves stamina; reduces blood cholesterol; strengthens bones; boosts immunity. Ignore: references to losing weight; immediate effects of exercise (e.g. increases heart rate); "makes you healthier" unqualified.'
    },
    {
      q: 'Give two changes that happen in the body during aerobic exercise. Do NOT refer to increased breathing rate. [2 marks]',
      type: 'written', marks: 2,
      ms: 'Any two from: deeper/heavier breathing; increased heart rate; increased body temperature; increased sweating; increased blood flow to skin/muscles; blood flows faster. Do NOT accept: lactic acid is produced (that is anaerobic).'
    },
    {
      q: 'Muscles respire anaerobically during vigorous exercise. Complete the sentences.\n\nMuscles respire anaerobically if they do not have enough _______.\n\nAnaerobic respiration of glucose produces _______. [2 marks]',
      type: 'written', marks: 2,
      ms: 'First blank: oxygen (allow O₂). Second blank: lactic acid. [1 mark each] Word takes precedence over symbol.'
    },
    {
      q: 'Explain the differences in the air breathed into the lungs and the air breathed out. (Oxygen in: 21%, out: 16%; Carbon dioxide in: 0.04%, out: 4%; Nitrogen: 78% both.) [4 marks]',
      type: 'written', marks: 4,
      ms: 'Level 2 (3–4): relevant points with logical linking. Level 1 (1–2): points stated simply, no linking.\n\nIndicative content: less oxygen in exhaled air because body has used some for respiration; more carbon dioxide in exhaled air because carbon dioxide is produced in respiration; no difference in nitrogen because nitrogen is not used by the body; more water vapour in air breathed out because water is produced in respiration; exhaled air is warmer because energy is transferred during respiration.\n\nFor Level 2: explanation(s) AND differences must be given.'
    },
    {
      q: 'Give two ways the lungs are adapted for efficient gas exchange. [2 marks]',
      type: 'written', marks: 2,
      ms: 'Any two from: many alveoli; large surface area; short diffusion distance; wall of alveolus only one cell thick/thin; wall of blood capillaries only one cell thick; good blood supply; well ventilated. Allow: short distance for gas to travel. Ignore: moist.'
    },
  ],

  // ── BIOLOGY — Blood & circulatory system ──────────────────────────────────────
  // Sources: Jun23 Q4, Jun24 B1 Q3

  tb_blood: [
    {
      q: 'Which chamber of the heart pumps blood to the body? Tick ONE box.\n\n[ ] Left atrium\n[ ] Left ventricle\n[ ] Right atrium\n[ ] Right ventricle',
      type: 'mc', marks: 1,
      options: ['Left atrium', 'Left ventricle', 'Right atrium', 'Right ventricle'],
      correct: 1,
      ms: 'Left ventricle. [1 mark]'
    },
    {
      q: 'What is the name of the blood vessel that carries blood to the heart muscle? Tick ONE box.\n\n[ ] Aorta\n[ ] Coronary artery\n[ ] Pulmonary artery',
      type: 'mc', marks: 1,
      options: ['Aorta', 'Coronary artery', 'Pulmonary artery'],
      correct: 1,
      ms: 'Coronary artery. [1 mark]'
    },
    {
      q: 'Which type of blood vessel has valves? Tick ONE box.\n\n[ ] Artery\n[ ] Capillary\n[ ] Vein',
      type: 'mc', marks: 1,
      options: ['Artery', 'Capillary', 'Vein'],
      correct: 2,
      ms: 'Vein. [1 mark]'
    },
    {
      q: 'What is the function of valves in the heart and veins? [1 mark]',
      type: 'written', marks: 1,
      ms: 'To stop blood flowing in the wrong direction. Allow: to stop blood flowing backwards; to stop backflow of blood; to keep blood flowing in the correct direction.'
    },
    {
      q: 'Explain ONE way a capillary is adapted for its function. [2 marks]',
      type: 'written', marks: 2,
      ms: 'Walls that are one cell thick [1 mark] so there is a short diffusion distance / substances can move quickly between blood and cells [1 mark]. OR large surface area to volume ratio [1 mark] for exchange of substances [1 mark]. Allow: thin walls / very narrow (so) close to cells.'
    },
    {
      q: 'Explain why having more red blood cells will improve an athlete\\'s performance. [3 marks]',
      type: 'written', marks: 3,
      ms: 'More oxygen can be transported/carried [1 mark]. Oxygen is needed for aerobic respiration [1 mark]. So more energy can be transferred/released (for muscle contraction) [1 mark]. Allow: so less anaerobic respiration. Do NOT accept: energy is made/produced/created.'
    },
    {
      q: 'Which part of the blood causes blood to clot? Tick ONE box.\n\n[ ] Plasma\n[ ] Platelets\n[ ] Red blood cells',
      type: 'mc', marks: 1,
      options: ['Plasma', 'Platelets', 'Red blood cells'],
      correct: 1,
      ms: 'Platelets. [1 mark]'
    },
    {
      q: 'A heart attack happens when plaques block a coronary artery. Explain how the blockage can lead to the death of muscle cells in the heart. [3 marks]',
      type: 'written', marks: 3,
      ms: 'Less/no blood flow [1 mark] so less/no oxygen to heart muscle/cells [1 mark] so less/no respiration (so less energy available) [1 mark]. Ignore reference to lactic acid.'
    },
  ],

  // ── BIOLOGY — Disease, immunity & drugs ───────────────────────────────────────
  // Sources: Jun20 Q2 & Q4, Jun22 Q3 & Q5, Jun23 Q6, Jun24 B1 Q4

  tb_immune: [
    {
      q: 'Give two ways that the body prevents pathogens entering the body. [2 marks]',
      type: 'written', marks: 2,
      ms: 'Any two from: skin (acts as a barrier); mucus in trachea/bronchi/nose; cilia in respiratory tract; hydrochloric acid in stomach; scab forms over wounds; tears. Allow: mucus in airways. Ignore: references to hairs; immune response.'
    },
    {
      q: 'Describe how the immune system defends the body against disease. [6 marks]',
      type: 'written', marks: 6,
      ms: 'Level 2 (4–6): scientifically accurate detail with clear logical linking. Level 1 (1–3): facts listed without linking.\n\nIndicative content: white blood cells detect/identify foreign antigens; phagocytes engulf and digest/kill invading cells; lymphocytes produce antibodies which attach to and destroy/agglutinate pathogens; produce antitoxins to destroy toxins; produce memory cells so immune response to later exposure is faster.\n\nFor Level 2: must describe HOW white blood cells act, not just name them.'
    },
    {
      q: 'Give ONE reason why antibiotics cannot be used to treat HIV infections. [1 mark]',
      type: 'written', marks: 1,
      ms: 'Any one from: HIV is a virus; antibiotics do not kill viruses; antibiotics are used to kill bacteria. Allow: HIV is not a bacterium.'
    },
    {
      q: 'Give two ways to prevent the spread of HIV. [2 marks]',
      type: 'written', marks: 2,
      ms: 'Any two from: avoid sexual intercourse; use a condom; do not share needles; use antiretroviral drugs; screen blood for transfusions; have regular tests. Ignore: handwashing; social distancing; "use protection" unqualified.'
    },
    {
      q: 'What type of pathogen causes rose black spot disease? Tick ONE box.\n\n[ ] Bacterium\n[ ] Fungus\n[ ] Protist\n[ ] Virus',
      type: 'mc', marks: 1,
      options: ['Bacterium', 'Fungus', 'Protist', 'Virus'],
      correct: 1,
      ms: 'Fungus. [1 mark]'
    },
    {
      q: 'How is the malaria pathogen transferred to humans? [1 mark]',
      type: 'written', marks: 1,
      ms: 'By the bite of a mosquito/insect vector. Allow: through a mosquito bite.'
    },
    {
      q: 'What is the name of the first antibiotic developed? [1 mark]',
      type: 'written', marks: 1,
      ms: 'Penicillin. [1 mark]'
    },
    {
      q: 'Suggest why doctors do not give antibiotics to patients with minor infections. [1 mark]',
      type: 'written', marks: 1,
      ms: 'Any one from: to prevent/reduce antibiotic resistance; overuse of antibiotics leads to resistant strains; minor infections are often caused by viruses (which antibiotics cannot treat); the immune system can deal with minor infections on its own.'
    },
    {
      q: 'During Phase 1 clinical trials, a drug is tested on healthy volunteers using low doses. What is the main purpose of Phase 1 testing? Tick ONE box.\n\n[ ] To find the best dose to use\n[ ] To see if the drug is safe to use\n[ ] To see if the drug works',
      type: 'mc', marks: 1,
      options: ['To find the best dose to use', 'To see if the drug is safe to use', 'To see if the drug works'],
      correct: 1,
      ms: 'To see if the drug is safe to use. [1 mark]'
    },
    {
      q: 'What is a placebo? [1 mark]',
      type: 'written', marks: 1,
      ms: 'A tablet/treatment that does not contain the drug/active ingredient. Allow: a sugar pill; a fake drug.'
    },
    {
      q: 'Who knows which patients are given the placebo and which are given the drug in a double blind trial? Tick ONE box.\n\n[ ] Not the patients or the doctors\n[ ] The patients and the doctors\n[ ] The patients but not the doctors',
      type: 'mc', marks: 1,
      options: ['Not the patients or the doctors', 'The patients and the doctors', 'The patients but not the doctors'],
      correct: 0,
      ms: 'Not the patients or the doctors. [1 mark]'
    },
  ],

  // ── BIOLOGY — Osmosis & water movement ───────────────────────────────────────
  // Sources: Jun20 Q5, Jun24 B1 Q7

  tb_osmosis: [
    {
      q: 'What is the independent variable in a potato osmosis investigation? Tick ONE box.\n\n[ ] Change in mass of the pieces of potato\n[ ] Concentration of the sugar solution\n[ ] Length of time the pieces of potato are in the solution\n[ ] Starting mass of the pieces of potato',
      type: 'mc', marks: 1,
      options: ['Change in mass of the pieces of potato', 'Concentration of the sugar solution', 'Length of time the pieces of potato are in the solution', 'Starting mass of the pieces of potato'],
      correct: 1,
      ms: 'Concentration of the sugar solution. [1 mark]'
    },
    {
      q: 'A potato piece in 0.0 mol/dm³ sugar solution increased in mass. Explain why. [2 marks]',
      type: 'written', marks: 2,
      ms: 'Gained water [1 mark] by osmosis [1 mark] because the concentration of water outside the potato is greater than inside the cells (allow: concentration of sugar solution inside the potato is greater than outside). Allow converse statements.'
    },
    {
      q: 'A potato piece started at 7.96 g and ended at 8.21 g after being in 0.2 mol/dm³ sugar solution. Calculate the percentage change in mass to 3 significant figures.\n\nUse: percentage change = (change in mass ÷ mass at start) × 100 [3 marks]',
      type: 'written', marks: 3,
      ms: 'Change in mass = 8.21 − 7.96 = 0.25 g [1 mark]. Percentage change = (0.25 ÷ 7.96) × 100 [1 mark]. = 3.14% (to 3 significant figures) [1 mark]. Allow ecf from incorrect working.'
    },
    {
      fig: 'jun24_osmosis_tube',
      q: 'In an osmosis investigation using sealed tubing in salt solutions, a student dried the outside of each tube before recording mass. Why was it important to dry the tubes? [1 mark]',
      type: 'written', marks: 1,
      ms: 'Water/solution on the tube would affect/increase the mass (making results invalid). Allow: the results would not be valid.'
    },
    {
      q: 'In a sealed-tube osmosis experiment, the concentration of salt solution where the tube does not change mass is approximately 0.64–0.66 mol/dm³. What does this tell us? [1 mark]',
      type: 'written', marks: 1,
      ms: 'The concentration of solution Z (inside the tubes) is approximately 0.64–0.66 mol/dm³ — because at this concentration the solution inside equals the solution outside, so no net movement of water by osmosis.'
    },
    {
      q: 'Calculate the percentage change in mass for a tube that started at 15.54 g and ended at 16.50 g after being in 0.0 mol/dm³ salt solution. Give your answer to 1 decimal place. [3 marks]\n\nUse: percentage change = (change in mass ÷ mass at start) × 100',
      type: 'written', marks: 3,
      ms: 'Change in mass = 16.50 − 15.54 = 0.96 g [1 mark]. Percentage change = (0.96 ÷ 15.54) × 100 [1 mark]. = 6.2% (to 1 decimal place) [1 mark]. Allow ecf from incorrect calculation.'
    },
  ],

  // ── BIOLOGY — Photosynthesis ───────────────────────────────────────────────────
  // Sources: Jun22 Q2, Jun24 B1 Q5

  tb_photo: [
    {
      q: 'Complete the equation for photosynthesis. Choose from: nitrogen, oxygen, ethanol, water.\n\ncarbon dioxide + _______ → glucose + _______ [2 marks]',
      type: 'written', marks: 2,
      ms: 'First blank: water [1 mark]. Second blank: oxygen [1 mark]. Allow H₂O and O₂.'
    },
    {
      q: 'What is the chemical formula for glucose? Tick ONE box.\n\n[ ] CO₂\n[ ] C₆H₁₂O₆\n[ ] H₂O\n[ ] O₂',
      type: 'mc', marks: 1,
      options: ['CO₂', 'C₆H₁₂O₆', 'H₂O', 'O₂'],
      correct: 1,
      ms: 'C₆H₁₂O₆. [1 mark]'
    },
    {
      q: 'Give two ways plants use the glucose produced by photosynthesis. [2 marks]',
      type: 'written', marks: 2,
      ms: 'Any two from: respiration (for energy); to convert to starch (store); to produce fat/oil (store); to produce cellulose (cell walls); to produce amino acids/protein. Allow: energy source. Do NOT accept: energy produced/made/created; used for growth (too vague). Ignore: used for growth of the plant.'
    },
    {
      q: 'Give ONE way that the palisade layer of a leaf is adapted for photosynthesis. [1 mark]',
      type: 'written', marks: 1,
      ms: 'Any one from: contains many chloroplasts/chlorophyll to absorb light; cells are long and packed tightly to maximise light absorption; positioned near the top of the leaf to receive most light; large surface area for CO₂ absorption.'
    },
    {
      q: 'A student investigated the effect of different colours of light on the rate of photosynthesis. Results: blue = 9 arbitrary units, green = 1, red = 8. What colour of light should be used to grow plants in a greenhouse? Tick ONE box.\n\n[ ] Blue  [ ] Green  [ ] Red',
      type: 'mc', marks: 1,
      options: ['Blue', 'Green', 'Red'],
      correct: 0,
      ms: 'Blue. [1 mark] — blue light gave the highest rate of photosynthesis (9 arbitrary units) so would produce the most growth.'
    },
    {
      fig: 'jun24_greenhouses',
      q: 'Greenhouse B has a wood burner burning logs, while Greenhouse A does not. Both greenhouses have the same light intensity, water volume, and soil. Explain why plants in Greenhouse B grow faster. [4 marks]',
      type: 'written', marks: 4,
      ms: 'Higher/increased temperature [1 mark] OR more carbon dioxide (combustion/burning releases CO₂) [1 mark]. So more photosynthesis/faster photosynthesis [1 mark]. So more glucose/sugar made [1 mark]. So more protein/cellulose made [1 mark]. Award max 4 marks.'
    },
  ],

  // ── BIOLOGY — Cell division & growth ──────────────────────────────────────────
  // Sources: Jun22 Q6

  tb_cells_div: [
    {
      q: 'Write these biological structures in correct order of size. Smallest to largest: cell, chromosome, gene, nucleus. [1 mark]',
      type: 'written', marks: 1,
      ms: 'gene → chromosome → nucleus → cell. Must be in this order for the mark.'
    },
    {
      q: 'In humans a fertilised egg cell contains 23 pairs of chromosomes. How many chromosomes will there be in each of the embryo cells? [1 mark]',
      type: 'written', marks: 1,
      ms: '46. Allow: 23 pairs (of chromosomes).'
    },
    {
      q: 'How many cell divisions are needed to form a 16-cell embryo from the original fertilised egg cell? [1 mark]',
      type: 'written', marks: 1,
      ms: '4 cell divisions. Allow 15 (if student has counted total cells including the original). The sequence is 1→2→4→8→16, which is 4 divisions.'
    },
    {
      q: 'Give ONE way that cell division by mitosis is important in fully grown animals. [1 mark]',
      type: 'written', marks: 1,
      ms: 'Repair of tissues / replacement of cells. Allow: repair of organs; replacement of tissues. Ignore: growth; repair of cells; replacement of organs.'
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

function TestTab() {
  const [selected, setSelected] = useState(null)
  const [qIdx, setQIdx]         = useState(0)
  const [answer, setAnswer]     = useState('')
  const [showTip, setShowTip]   = useState(false)
  const [grading, setGrading]   = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [error, setError]       = useState(null)

  function resetQuestion() {
    setAnswer('')
    setShowTip(false)
    setFeedback(null)
    setError(null)
    setGrading(false)
  }

  async function gradeAnswer(q) {
    if (answer.trim().length < 3) {
      setError('Write a bit more before submitting — even a rough attempt helps.')
      return
    }
    setGrading(true)
    setError(null)
    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q.q, answer: answer.trim(), marks: q.marks, markScheme: q.ms }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setFeedback(data)
    } catch (e) {
      setError('Could not grade your answer right now. Check your connection and try again.')
    } finally {
      setGrading(false)
    }
  }

  function nextQuestion(total) {
    if (qIdx < total - 1) {
      setQIdx(qIdx + 1)
      resetQuestion()
    } else {
      setSelected(null)
      setQIdx(0)
      resetQuestion()
    }
  }

  // ── Grade colours ──────────────────────────────────────────────
  const GRADE_STYLE = {
    'Excellent':    { bg: '#e6f4e8', border: '#b8d8be', text: '#2a5c34', badge: '#3a7d44' },
    'Good':         { bg: '#f0f9f1', border: '#c8e6cc', text: '#2a5c34', badge: '#5a9e64' },
    'Developing':   { bg: '#fef9e7', border: '#f0d080', text: '#7a5c00', badge: '#c8922a' },
    'Needs Work':   { bg: '#fdf0ee', border: '#f0b8b0', text: '#7a2a2a', badge: '#b84040' },
  }

  // ── Question view ──────────────────────────────────────────────
  if (selected) {
    const questions = PAST_PAPER_QS[selected.topicId] || []
    const q = questions[qIdx]
    const tip = q ? MARK_TIPS[q.marks] : null
    const gs = feedback ? (GRADE_STYLE[feedback.grade] || GRADE_STYLE['Developing']) : null

    return (
      <div style={{ background: W.bg, minHeight: '100vh', paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ background: W.bgCard, borderBottom: `1px solid ${W.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => { setSelected(null); setQIdx(0); resetQuestion() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: W.textMuted, fontSize: '1.1rem', padding: 0, lineHeight: 1 }}>←</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '.9rem', color: W.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selected.label}</div>
            <div style={{ fontSize: '.7rem', color: W.textMuted }}>Question {qIdx + 1} of {questions.length}</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ height: 4, background: W.border }}>
          <div style={{ height: '100%', width: `${((qIdx + 1) / questions.length) * 100}%`, background: W.gold, transition: 'width .3s' }} />
        </div>

        <div style={{ maxWidth: 660, margin: '0 auto', padding: '20px 18px' }}>
          {q && (
            <>
              {/* Marks badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: W.goldLight, border: '1px solid #e8cfa0', borderRadius: 99, padding: '4px 12px', marginBottom: 14 }}>
                <span style={{ fontSize: '.72rem', fontWeight: 700, color: W.gold }}>{q.marks} marks</span>
              </div>

              {/* Diagram if present */}
              {q.fig && FIGURES[q.fig] && (
                <div style={{ background: '#fff', border: `1px solid ${W.border}`, borderRadius: 14, padding: '12px', marginBottom: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: W.textMuted, marginBottom: 8 }}>Figure — from AQA past paper</div>
                  <img src={FIGURES[q.fig]} alt="AQA exam figure" style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} />
                </div>
              )}

              {/* Question */}
              <div style={{ background: W.bgCard, border: `1px solid ${W.border}`, borderRadius: 16, padding: '18px', marginBottom: 14 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', lineHeight: 1.6, color: W.text, margin: 0 }}>{q.q}</p>
              </div>

              {/* Mark scheme tip */}
              {!showTip ? (
                <button onClick={() => setShowTip(true)}
                  style={{ background: 'none', border: `1px dashed ${W.border}`, borderRadius: 12, padding: '10px 16px', cursor: 'pointer', color: W.textMuted, fontSize: '.83rem', width: '100%', fontFamily: 'inherit', marginBottom: 14 }}>
                  💡 Show mark scheme guidance
                </button>
              ) : tip && (
                <div style={{ background: '#f0f9f1', border: '1px solid #b8d8be', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
                  <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: W.green, marginBottom: 5 }}>{tip.label}</div>
                  <p style={{ fontSize: '.86rem', color: '#2a5c34', margin: 0 }}>{tip.tip}</p>
                </div>
              )}

              {/* Answer area — hidden after feedback */}
              {!feedback && (
                <>
                  {q.type === 'mc' ? (
                    /* Multiple choice */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                      {q.options.map((opt, i) => (
                        <button key={i} onClick={() => setAnswer(opt)}
                          style={{
                            background: answer === opt ? W.btnPrimary : W.bgCard,
                            border: `2px solid ${answer === opt ? W.btnPrimary : W.border}`,
                            borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
                            textAlign: 'left', fontFamily: 'inherit', fontSize: '.92rem',
                            color: answer === opt ? '#f0e8da' : W.text,
                            transition: 'all .15s',
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Written answer */
                    <div style={{ background: W.bgCard, border: `1px solid ${W.border}`, borderRadius: 16, padding: '16px', marginBottom: 14 }}>
                      <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: W.textMuted, marginBottom: 10 }}>Your answer</div>
                      <textarea
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        placeholder="Write your answer here..."
                        style={{ width: '100%', border: 'none', background: 'transparent', resize: 'none', fontSize: '.92rem', color: W.text, lineHeight: 1.65, outline: 'none', minHeight: q.marks >= 6 ? 180 : q.marks >= 3 ? 120 : 80, fontFamily: 'inherit' }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Error */}
              {error && (
                <div style={{ background: '#fdf0ee', border: '1px solid #f0b8b0', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
                  <p style={{ margin: 0, fontSize: '.86rem', color: '#7a2a2a' }}>{error}</p>
                </div>
              )}

              {/* Feedback */}
              {feedback && gs && (
                <div className="fade-up">
                  {/* Score card */}
                  <div style={{ background: gs.bg, border: `2px solid ${gs.border}`, borderRadius: 18, padding: '20px', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: gs.text, lineHeight: 1 }}>
                          {feedback.marksAwarded}<span style={{ fontSize: '1rem', fontWeight: 600, color: gs.text, opacity: .6 }}>/{feedback.marksAvailable}</span>
                        </div>
                        <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: gs.text, opacity: .7, marginTop: 4 }}>marks</div>
                      </div>
                      <div style={{ background: gs.badge, color: '#fff', borderRadius: 99, padding: '6px 14px', fontWeight: 800, fontSize: '.82rem' }}>
                        {feedback.grade}
                      </div>
                    </div>
                    <p style={{ fontSize: '.92rem', color: gs.text, margin: 0, fontStyle: 'italic' }}>{feedback.summary}</p>
                  </div>

                  {/* What you got right */}
                  {feedback.achieved?.length > 0 && (
                    <div style={{ background: W.bgCard, border: `1px solid ${W.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
                      <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: W.green, marginBottom: 10 }}>✓ What you got right</div>
                      {feedback.achieved.map((a, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < feedback.achieved.length - 1 ? 8 : 0 }}>
                          <span style={{ color: W.green, fontSize: '.9rem', flexShrink: 0, marginTop: 1 }}>✓</span>
                          <p style={{ margin: 0, fontSize: '.88rem', color: W.textMid }}>{a}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* What you missed */}
                  {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && (
                    <div style={{ background: W.bgCard, border: `1px solid ${W.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
                      <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#b84040', marginBottom: 10 }}>✗ Points to add next time</div>
                      {feedback.missed.map((m, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < feedback.missed.length - 1 ? 8 : 0 }}>
                          <span style={{ color: '#b84040', fontSize: '.9rem', flexShrink: 0, marginTop: 1 }}>→</span>
                          <p style={{ margin: 0, fontSize: '.88rem', color: W.textMid }}>{m}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Examiner tip */}
                  {feedback.examinerTip && (
                    <div style={{ background: '#fffaf0', border: '1px solid #f0d080', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
                      <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: W.gold, marginBottom: 8 }}>🗡️ Examiner tip</div>
                      <p style={{ margin: 0, fontSize: '.88rem', color: '#7a5c00' }}>{feedback.examinerTip}</p>
                    </div>
                  )}

                  {/* Try again / Next */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button onClick={resetQuestion}
                      style={{ background: W.bgCard, border: `1px solid ${W.border}`, borderRadius: 13, padding: '13px', fontWeight: 700, cursor: 'pointer', color: W.text, fontFamily: 'inherit', fontSize: '.88rem' }}>
                      ↩ Try again
                    </button>
                    <button onClick={() => nextQuestion(questions.length)}
                      style={{ background: W.btnPrimary, border: 'none', borderRadius: 13, padding: '13px', fontWeight: 800, cursor: 'pointer', color: '#f0e8da', fontFamily: 'inherit', fontSize: '.88rem' }}>
                      {qIdx < questions.length - 1 ? 'Next →' : 'Finish ✓'}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit button — only shown before feedback */}
              {!feedback && (
                <button onClick={() => gradeAnswer(q)} disabled={grading}
                  style={{ width: '100%', background: grading ? W.textMuted : W.btnPrimary, color: '#f0e8da', border: 'none', borderRadius: 13, padding: '15px', fontWeight: 800, cursor: grading ? 'default' : 'pointer', fontSize: '.97rem', fontFamily: 'inherit', marginTop: 4, transition: 'background .2s' }}>
                  {grading ? 'Marking your answer...' : 'Check my answer →'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  // ── Topic picker ───────────────────────────────────────────────
  return (
    <div style={{ background: W.bg, minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: W.bgCard, borderBottom: `1px solid ${W.border}`, padding: '14px 20px' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.05rem', color: W.text }}>Test Your Learning</div>
        <div style={{ fontSize: '.78rem', color: W.textMuted, marginTop: 3 }}>Real AQA past paper questions — write your answer and get it marked by AI.</div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '20px 18px' }}>
        {TEST_TOPICS.map(({ subject, icon, topics }) => (
          <div key={subject} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span>{icon}</span>
              <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: W.textMuted }}>{subject}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topics.map(t => (
                <button key={t.id}
                  onClick={() => t.available && setSelected({ topicId: t.id, label: t.label, subject })}
                  style={{
                    background: t.available ? W.bgCard : '#f5f2ed',
                    border: `1px solid ${W.border}`, borderRadius: 13,
                    padding: '13px 16px', cursor: t.available ? 'pointer' : 'default',
                    textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    opacity: t.available ? 1 : 0.5,
                  }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.9rem', color: W.text }}>{t.label}</div>
                    <div style={{ fontSize: '.72rem', color: W.textMuted, marginTop: 2 }}>
                      {t.available ? `${t.questions} question${t.questions !== 1 ? 's' : ''} · AI marked` : 'Coming soon'}
                    </div>
                  </div>
                  {t.available && <span style={{ color: W.gold, fontWeight: 700 }}>→</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
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
