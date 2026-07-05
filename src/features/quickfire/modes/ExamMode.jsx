import { useEffect, useRef, useState } from 'react'
import { SPACING } from '../../../constants/spacing.js'
import { RADII } from '../../../constants/radii.js'
import { TYPE } from '../../../constants/typography.js'
import { GENERAL } from '../../../constants/generalTheme.js'
import { MEDICINE_2023_PAPER } from '../../../data/medicineExamPapers.js'
import { ALL_EXAM_PAPERS } from '../../../data/examPapers/index.js'
import { ExamPaperRunner } from '../../exampaper/ExamPaperRunner.jsx'
import { recordScore } from '../../../progress.js'
import { getSuggestedQuestionType } from '../../../unifiedWeaknessTracker.js'
import BackButton from '../../../components/core/BackButton.jsx'
import ExamQuestionFrame from '../../../components/feedback/ExamQuestionFrame.jsx'
import ExamRoundDebrief from '../../../components/feedback/ExamRoundDebrief.jsx'
import GuidedAnswerCoach from '../../../components/learning/GuidedAnswerCoach.jsx'
import { QUESTION_BANKS_BY_MODULE } from '../../../data/questionBanks/questionRegistry.js'
import { useTestData } from '../testDataContext.jsx'
import { StreakChip } from '../../home/StreakChip.jsx'

const PULSE_GOLD = '#D2A24C'
const EXAM_SECONDS = 10 * 60

function NavArrow({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const TEST_TOPICS = [
  {
    subject: 'History',
    icon: '📜',
    topics: [
      { id: 'th1',       label: 'Medieval Medicine c1250–c1500',        questions: 5,  available: true },
      { id: 'th2',       label: 'Renaissance & the Plague c1500–c1700', questions: 4,  available: true },
      { id: 'th3',       label: 'Surgery & Anatomy c1700–c1900',        questions: 4,  available: true },
      { id: 'th4',       label: 'Germ Theory c1850–c1900',              questions: 3,  available: true },
      { id: 'th5',       label: 'Public Health c1800–c1900',            questions: 3,  available: true },
      { id: 'th_wf',     label: 'Western Front 1914–18',                questions: 3,  available: true },
      { id: 'th_modern', label: 'Modern Medicine c1900–present',        questions: 1,  available: true },
    ]
  },
  {
    subject: 'Biology',
    icon: '🧬',
    topics: [
      { id: 'tb_cells',     label: 'Cells, microscopy & size calculations', questions: 6,  available: true },
      { id: 'tb_digest',    label: 'Digestion, enzymes & absorption',       questions: 9,  available: true },
      { id: 'tb_transp',    label: 'Transpiration, stomata & water loss',   questions: 8,  available: true },
      { id: 'tb_resp',      label: 'Respiration — aerobic & anaerobic',     questions: 6,  available: true },
      { id: 'tb_blood',     label: 'Blood, heart & circulatory system',     questions: 8,  available: true },
      { id: 'tb_immune',    label: 'Disease, immunity & drug testing',      questions: 11, available: true },
      { id: 'tb_osmosis',   label: 'Osmosis & water movement',              questions: 6,  available: true },
      { id: 'tb_photo',     label: 'Photosynthesis',                        questions: 6,  available: true },
      { id: 'tb_cells_div', label: 'Cell division, growth & mitosis',       questions: 4,  available: true },
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

export function ExamMode({ mode, onExit, onOpenModule, onOpenPulse, examAutoStart, clearExamAutoStart }) {
  const { ALL_MATHS_QUESTIONS, ALL_ENGLISH_QUESTIONS, ALL_SOCIOLOGY_QUESTIONS, ALL_CHEMISTRY_QUESTIONS, GUIDED_COACH_TYPES } = useTestData() || {}

  const [activePaper,        setActivePaper]        = useState(null)
  const [paperChooserOpen,   setPaperChooserOpen]   = useState(false)
  const [examTechniqueOpen,  setExamTechniqueOpen]  = useState(false)
  const [activeCoachType,    setActiveCoachType]    = useState(null)
  const [examPhase,          setExamPhase]          = useState('landing')
  const [examCountdown,      setExamCountdown]      = useState(3)
  const [examConfig,         setExamConfig]         = useState(null)
  const [examQuestions,      setExamQuestions]      = useState([])
  const [examTimeLeft,       setExamTimeLeft]       = useState(EXAM_SECONDS)
  const [examStats,          setExamStats]          = useState({ correct: 0, answered: 0, bySubject: {} })
  const [examPaperFeedbacks, setExamPaperFeedbacks] = useState({})
  // ExamQuestionFrame's onComplete fires once automatically after grading and
  // again if the user taps its own Continue CTA — dedupe so addExamResult
  // (and recordScore) counts each question once per round, not twice.
  const countedQuestionsRef = useRef(new Set())

  useEffect(() => {
    if (examPhase !== 'countdown') return undefined
    const timer = setInterval(() => {
      setExamCountdown(value => {
        if (value === 'GO') { clearInterval(timer); setExamPhase('round'); return 'GO' }
        if (value === 1) return 'GO'
        return value - 1
      })
    }, 900)
    return () => clearInterval(timer)
  }, [examPhase])

  useEffect(() => {
    if (examPhase !== 'round' || !examConfig?.isTimedPaper) return undefined
    const timer = setInterval(() => {
      setExamTimeLeft(value => {
        if (value <= 1) { clearInterval(timer); setExamPhase('summary'); return 0 }
        return value - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [examPhase, examConfig])

  const examAutoStartedRef = useRef(false)
  useEffect(() => {
    if (examAutoStart && !examAutoStartedRef.current) {
      examAutoStartedRef.current = true
      const { subject, ...opts } = examAutoStart
      startExamRound(subject, opts)
      clearExamAutoStart?.()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      QUESTION_BANKS_BY_MODULE[topic.id] || []
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
    const weak   = scored.filter(item => item.avg === undefined || item.avg < 70).sort((a, b) => b.weakness - a.weakness).map(item => item.question)
    const strong = scored.filter(item => item.avg >= 70).sort((a, b) => b.strength - a.strength).map(item => item.question)
    const mixed  = [...weak.slice(0, 6), ...strong.slice(0, 4)]
    const used   = new Set(mixed.map(q => q.id))
    const fill   = shuffled.filter(q => !used.has(q.id)).slice(0, 10 - mixed.length)
    return shuffle([...mixed, ...fill]).slice(0, 10)
  }

  function startExamRound(subject = 'Random', { isTimedPaper = false, durationSeconds = EXAM_SECONDS, paperQuestions = null, title = null, origin = null } = {}) {
    const questions    = paperQuestions || adaptiveExamQuestions(subject)
    const derivedTitle = title || (subject === 'Random' ? 'Random Exam Challenge' : subject + ' Exam Sprint')
    setExamConfig({ subject, title: derivedTitle, isTimedPaper, origin })
    setExamQuestions(questions)
    setExamTimeLeft(durationSeconds)
    setExamCountdown(3)
    setExamStats({ correct: 0, answered: 0, bySubject: {} })
    setExamPaperFeedbacks({})
    countedQuestionsRef.current = new Set()
    setExamPhase('countdown')
  }

  function startMedicinePaper2023() {
    const paperQs = MEDICINE_2023_PAPER.questions.map(q => ({
      id: q.id, q: q.q, marks: q.marks, type: q.type, ms: q.ms,
      commandWord: q.commandWord, topic: q.topic, subject: q.subject,
      extract: q.extract, sectionHeader: q.sectionHeader, sectionNote: q.sectionNote,
      sourcesBooklet: q.sourcesBooklet, sourceRefs: q.sourceRefs,
      isChoice: q.isChoice, choiceHeader: q.choiceHeader, spagNote: q.spagNote, note: q.note,
    }))
    startExamRound('History', {
      isTimedPaper: true,
      durationSeconds: MEDICINE_2023_PAPER.timeMins * 60,
      paperQuestions: paperQs,
      title: MEDICINE_2023_PAPER.title,
    })
  }

  function addExamResult(question, earned, possible) {
    const correct = earned >= possible
    setExamStats(stats => {
      const current = stats.bySubject[question.subject] || { answered: 0, correct: 0 }
      return {
        answered: stats.answered + 1,
        correct:  stats.correct + (correct ? 1 : 0),
        bySubject: {
          ...stats.bySubject,
          [question.subject]: {
            answered: current.answered + 1,
            correct:  current.correct + (correct ? 1 : 0),
          },
        },
      }
    })
    // Paper rounds are tagged distinctly from practice rounds so Home's
    // "done today" check (todaysPlan.js) can't confuse a quick practice
    // round for a completed full paper (or vice versa) just because they
    // happen to share a subject on the same day.
    recordScore({ subject: question.subject, earned, possible, source: examConfig?.isTimedPaper ? 'exam-paper' : 'exam' })
  }

  const EXAM_SUBJECTS = [
    { logo: '/headers/sociology-main.webp', label: 'Sociology', color: '#FF5C7A', completed: 7,  total: 10, action: () => startExamRound('Sociology') },
    { logo: '/headers/history-main.webp',   label: 'History',   color: '#C89B6D', completed: 6,  total: 12, action: () => startExamRound('History') },
    { logo: '/headers/bio-main.webp',       label: 'Biology',   color: '#4F8A5B', completed: 1,  total: 7,  action: () => startExamRound('Biology') },
    { logo: '/headers/chem-logo.webp',      label: 'Chemistry', color: '#9B59E8', completed: 0,  total: 15, action: () => startExamRound('Chemistry') },
    { logo: '/headers/maths-main.webp',     label: 'Maths',     color: '#2DD4BF', completed: 0,  total: 20, action: () => startExamRound('Maths') },
    { logo: '/headers/english-main.webp',   label: 'English',   color: '#B66DFF', completed: 0,  total: 15, action: () => startExamRound('English') },
    { logo: '/headers/physics-main.webp',   label: 'Physics',   color: '#3B82F6', completed: 0,  total: 15, action: () => startExamRound('Physics') },
  ]

  // ── Full exam paper runner ──────────────────────────────────────────────────
  if (activePaper) {
    return <ExamPaperRunner paper={activePaper} onExit={() => setActivePaper(null)} />
  }

  // ── Active exam phases (countdown / round / summary) ───────────────────────
  if (examPhase !== 'landing') {
    const examAccuracy = examStats.answered ? Math.round((examStats.correct / examStats.answered) * 100) : 0

    if (examPhase === 'countdown') {
      return (
        <div style={{ minHeight:'100vh', background:`radial-gradient(circle at 50% 20%, rgba(${GENERAL.tealRgb},.2), transparent 38%), ${GENERAL.neutral[0]}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#F5F7FB', padding:24 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#AAB4D4', marginBottom:20 }}>{examConfig?.title || 'Exam Mode'}</div>
            <div key={examCountdown} style={{ ...TYPE.displayHero, fontSize: examCountdown === 'GO' ? '5rem' : '7rem', color: examCountdown === 'GO' ? '#38F27B' : GENERAL.teal, textShadow:`0 0 42px rgba(${GENERAL.tealRgb},.72)`, animation:'examPop .85s ease both' }}>{examCountdown}</div>
            <div style={{ color:'#7C8DB0', marginTop:18, ...TYPE.body }}>{examConfig?.origin === 'home' ? 'Just a few quick questions.' : 'Breathe. Read the command word first.'}</div>
            <style>{'@keyframes examPop { 0%{opacity:0;transform:scale(.72)} 45%{opacity:1;transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }'}</style>
          </div>
        </div>
      )
    }

    if (examPhase === 'round') {
      return (
        <div style={{ minHeight:'100vh', background:'#08090D', color:'#F5F7FB' }}>
          <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(8,9,13,0.96)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, boxSizing:'border-box' }}>
            <BackButton onClick={() => setExamPhase('summary')} />
            <div style={{ flex:1 }}>
              <div style={{ ...TYPE.titleMedium, color:'#F4EFE6' }}>{examConfig?.title}</div>
              <div style={{ color:'#4B5563', fontSize:'.72rem' }}>{examQuestions.length} questions · scroll to answer all</div>
            </div>
            {examConfig?.isTimedPaper && (
              <div style={{ background:examTimeLeft < 60 ? 'rgba(255,93,115,.18)' : `rgba(${GENERAL.tealRgb},.18)`, border:'1px solid '+(examTimeLeft<60?'rgba(255,93,115,.5)':`rgba(${GENERAL.tealRgb},.4)`), borderRadius:999, color:examTimeLeft<60?'#FF5D73':GENERAL.teal, ...TYPE.buttonLarge, padding:'7px 14px', flexShrink:0 }}>{examTime}</div>
            )}
          </div>

          <div style={{ padding:'16px 16px 130px', maxWidth:660, margin:'0 auto' }}>
            {examQuestions.map((q, idx) => {
              const block = {
                questionText: q.q,
                marks: q.marks || 4,
                markPoints: q.ms ? [q.ms] : [],
                source: q.extract ? { label: q.sourceRefs?.length > 1 ? 'Sources A and B' : 'Source', text: q.extract } : null,
                commandWord: q.commandWord || null,
                topic: q.topic || q.topicLabel || null,
                paper: examConfig?.title || 'EXAM PRACTICE',
              }
              return (
                <div key={idx} style={{ marginBottom: 32 }}>
                  {q.sectionHeader && (
                    <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ ...TYPE.titleLarge, color: '#F4EFE6', marginBottom: 4 }}>{q.sectionHeader}</div>
                      {q.sectionNote && <div style={{ ...TYPE.label, color: GENERAL.slate }}>{q.sectionNote}</div>}
                    </div>
                  )}
                  {q.sourcesBooklet && q.sourcesBooklet.map((src, si) => (
                    <div key={si} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px', marginBottom: 14 }}>
                      <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#C89B6D', marginBottom: 8 }}>{src.label}</div>
                      <div style={{ ...TYPE.caption, fontStyle: 'italic', color: 'rgba(245,245,245,0.48)', marginBottom: 10 }}>{src.attribution}</div>
                      <div style={{ ...TYPE.body, color: 'rgba(245,245,245,0.82)', whiteSpace: 'pre-wrap', maxHeight: 240, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingRight: 4 }}>{src.text}</div>
                      {src.credit && <div style={{ ...TYPE.metadata, color: 'rgba(245,245,245,0.3)', marginTop: 10, fontStyle: 'italic' }}>{src.credit}</div>}
                    </div>
                  ))}
                  {q.choiceHeader && (
                    <div style={{ background: `rgba(${GENERAL.tealRgb},0.08)`, border: `1px solid rgba(${GENERAL.tealRgb},0.2)`, borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
                      <div style={{ ...TYPE.label, color: GENERAL.teal }}>{q.choiceHeader}</div>
                    </div>
                  )}
                  {q.spagNote && (
                    <div style={{ ...TYPE.caption, color: GENERAL.slate, fontStyle: 'italic', marginBottom: 10, paddingLeft: 4 }}>{q.spagNote}</div>
                  )}
                  <ExamQuestionFrame
                    block={block}
                    subject={q.subject || 'History'}
                    mode="exam"
                    questionNum={idx + 1}
                    onComplete={(result) => {
                      if (!countedQuestionsRef.current.has(idx)) {
                        countedQuestionsRef.current.add(idx)
                        addExamResult({ ...q, subject: q.subject || 'History' }, result.marksAwarded ?? 0, result.marks ?? q.marks ?? 4)
                      }
                      setExamPaperFeedbacks(prev => ({
                        ...prev,
                        [idx]: {
                          marksAwarded: result.marksAwarded,
                          marks: result.marks ?? q.marks ?? 4,
                          grade: 'Submitted',
                          subject: q.subject || 'History',
                          topic: q.topic || q.topicLabel || null,
                          questionText: result.questionText ?? q.q,
                          markScheme: result.markScheme ?? q.ms ?? '',
                          answer: result.answer ?? '',
                          summary: result.summary ?? '',
                          achieved: result.achieved ?? [],
                          missed: result.missed ?? [],
                          examinerTip: result.examinerTip ?? null,
                        }
                      }))
                    }}
                  />
                </div>
              )
            })}
            <button onClick={() => setExamPhase('summary')} style={{ width:'100%', background:GENERAL.teal, border:'none', borderRadius:16, padding:16, color:GENERAL.neutral[0], fontWeight:800, fontSize:'1rem', cursor:'pointer', marginTop:8 }}>{examConfig?.origin === 'home' ? 'Finish' : 'Submit Paper'}</button>
          </div>
        </div>
      )
    }

    if (examPhase === 'summary') {
      return (
        <div style={{ minHeight:'100vh', background:'#08090D', color:'#F5F7FB', padding:'28px 20px 120px' }}>
          <div style={{ maxWidth:520, margin:'0 auto', textAlign:'center' }}>
            <div style={{ width:150, height:150, borderRadius:'50%', margin:'0 auto 22px', background:'conic-gradient(#38F27B ' + examAccuracy + '%, #172845 0)', display:'grid', placeItems:'center' }}><div style={{ width:122, height:122, borderRadius:'50%', background:'#071126', display:'grid', placeItems:'center' }}><div><div style={{ ...TYPE.displayHero, fontSize:'2.4rem' }}>{examAccuracy}%</div><div style={{ color:'#AAB4D4', fontWeight:800 }}>{examStats.correct}/{examStats.answered || 0}</div></div></div></div>
            <h1 style={{ ...TYPE.displayHero, fontSize:'2rem', margin:'0 0 8px' }}>{examConfig?.origin === 'home' ? 'Practice complete' : 'Exam round complete'}</h1>
            <p style={{ color:'#AAB4D4', margin:'0 0 22px' }}>Adaptive questions mixed stronger areas with weak zones.</p>
            <div style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:18, padding:18, marginBottom:20, textAlign:'left' }}>
              {Object.entries(examStats.bySubject).map(([subject, stats]) => <div key={subject} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,.06)' }}><span>{subject}</span><strong>{stats.correct}/{stats.answered}</strong></div>)}
            </div>
            {(() => {
              const debriefResults = examQuestions
                .map((q, idx) => {
                  const fb = examPaperFeedbacks[idx]
                  if (!fb) return null
                  return {
                    subject: fb.subject || q.subject || examConfig?.subject || 'History',
                    topic: fb.topic || q.topic || q.topicLabel || null,
                    question: fb.questionText || q.q,
                    marks: fb.marks ?? q.marks ?? 4,
                    markScheme: fb.markScheme || q.ms || '',
                    answer: fb.answer || '',
                    marksAwarded: fb.marksAwarded ?? 0,
                    achieved: fb.achieved || [],
                    missed: fb.missed || [],
                  }
                })
                .filter(Boolean)
              if (debriefResults.length === 0) return null
              return <ExamRoundDebrief subject={examConfig?.subject} results={debriefResults} />
            })()}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop: 20 }}>
              <button onClick={() => setExamPhase('landing')} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:13, padding:14, color:'#9CA8C7', fontWeight:800, cursor:'pointer' }}>Back</button>
              <button onClick={() => startExamRound(examConfig?.subject || 'Random')} style={{ background:'linear-gradient(135deg,#38F27B,#2DD4A3)', border:'none', borderRadius:13, padding:14, color:'#03140B', fontWeight:950, cursor:'pointer' }}>Try again</button>
            </div>
          </div>
        </div>
      )
    }
  }

  // ── Guided answer coach ────────────────────────────────────────────────────
  if (activeCoachType) {
    const coachType = GUIDED_COACH_TYPES.find(t => t.id === activeCoachType)
    if (coachType) {
      return (
        <GuidedAnswerCoach
          coachType={coachType}
          onExit={(target) => {
            setActiveCoachType(null)
            if (target !== 'chooser') setExamTechniqueOpen(false)
          }}
        />
      )
    }
  }

  // ── Exam technique chooser ─────────────────────────────────────────────────
  if (examTechniqueOpen) {
    const suggestedTypeId = getSuggestedQuestionType('History')
    return (
      <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 110, boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 430, margin: '0 auto', padding: `0 ${SPACING.compact}px` }}>
          <div style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)', paddingBottom: SPACING.compact }}>
            <BackButton onClick={() => setExamTechniqueOpen(false)} />
          </div>
          <div style={{ ...TYPE.displaySection, fontSize: 32, color: GENERAL.softWhite, marginBottom: 6 }}>
            Nail exam technique<span style={{ color: GENERAL.teal }}>.</span>
          </div>
          <div style={{ ...TYPE.body, color: GENERAL.slate, marginBottom: SPACING.standard }}>
            Pick a question type and learn exactly what the examiner wants.
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: SPACING.standard, scrollbarWidth: 'none' }}>
            {EXAM_SUBJECTS.map((subj, i) => {
              const isHistory = subj.label === 'History'
              return (
                <div key={i} style={{
                  flexShrink: 0, whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: RADII.pill,
                  ...TYPE.label,
                  background: isHistory ? 'rgba(200,155,109,0.14)' : GENERAL.neutral[1],
                  border: isHistory ? '1px solid #C89B6D' : '1px solid rgba(255,255,255,0.06)',
                  color: isHistory ? '#C89B6D' : 'rgba(168,176,178,0.45)',
                }}>
                  {subj.label}
                  {!isHistory && (
                    <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(168,176,178,0.35)' }}>
                      Soon
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {GUIDED_COACH_TYPES.map(coachType => (
              <button key={coachType.id} onClick={() => setActiveCoachType(coachType.id)} style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                padding: '14px 16px', cursor: 'pointer', borderRadius: RADII.large,
                background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: `2px solid ${coachType.accent}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: coachType.accent, marginBottom: 4 }}>{coachType.marksLabel}</div>
                  <div style={{ ...TYPE.displaySection, fontSize: 18, color: GENERAL.softWhite, marginBottom: 4 }}>{coachType.title}</div>
                  <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>{coachType.shortDesc}</div>
                </div>
                <NavArrow color={coachType.accent} />
                {coachType.id === suggestedTypeId && (
                  <div style={{
                    position: 'absolute', top: 10, right: 12,
                    ...TYPE.eyebrow, textTransform: 'uppercase',
                    color: GENERAL.teal, background: 'rgba(42,157,143,0.12)',
                    border: '1px solid rgba(42,157,143,0.3)', borderRadius: RADII.pill,
                    padding: '3px 8px',
                  }}>
                    Suggested
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Paper chooser ──────────────────────────────────────────────────────────
  if (paperChooserOpen) {
    return (
      <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 110, boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 430, margin: '0 auto', padding: `0 ${SPACING.compact}px` }}>
          <div style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)', paddingBottom: SPACING.compact }}>
            <BackButton onClick={() => setPaperChooserOpen(false)} />
          </div>
          <div style={{ ...TYPE.displaySection, fontSize: 32, color: GENERAL.softWhite, marginBottom: 6 }}>
            Sit a full paper<span style={{ color: GENERAL.teal }}>.</span>
          </div>
          <div style={{ ...TYPE.body, color: GENERAL.slate, marginBottom: SPACING.standard }}>
            Real timings, real conditions — pick a full paper or practise by subject.
          </div>
          <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 10 }}>
            Real exam papers
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: SPACING.standard }}>
            <button onClick={() => { setPaperChooserOpen(false); startMedicinePaper2023() }} style={{
              display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
              padding: '14px 16px', cursor: 'pointer', borderRadius: RADII.large,
              background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: '2px solid #C89B6D',
            }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0, border: '1.5px solid #C89B6D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C89B6D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#C89B6D', marginBottom: 4 }}>Timed</div>
                <div style={{ ...TYPE.displaySection, fontSize: 18, color: GENERAL.softWhite, marginBottom: 4 }}>Edexcel history paper 1 — June 2023</div>
                <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>1HI0/11 · 52 marks · 75 min · medicine in Britain & Western Front</div>
              </div>
              <NavArrow color="#C89B6D" />
            </button>
            {ALL_EXAM_PAPERS.map(paper => (
              <button key={paper.id} onClick={() => { setPaperChooserOpen(false); setActivePaper(paper) }} style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                padding: '14px 16px', cursor: 'pointer', borderRadius: RADII.large,
                background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: `2px solid ${paper.color}`,
              }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0, border: `1.5px solid ${paper.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={paper.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: paper.color, marginBottom: 4 }}>{paper.board} · {paper.year}</div>
                  <div style={{ ...TYPE.displaySection, fontSize: 17, color: GENERAL.softWhite, marginBottom: 4 }}>{paper.subtitle || paper.title}</div>
                  <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>{paper.ref} · {paper.totalMarks} marks · {paper.timeMins} min</div>
                </div>
                <NavArrow color={paper.color} />
              </button>
            ))}
            <button onClick={() => { setPaperChooserOpen(false); startExamRound('Random', { isTimedPaper: true }) }} style={{
              display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
              padding: '14px 16px', cursor: 'pointer', borderRadius: RADII.large,
              background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: `2px solid ${GENERAL.teal}`,
            }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0, border: `1.5px solid ${GENERAL.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GENERAL.teal} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5" /><path d="M9 1h6" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.teal, marginBottom: 4 }}>Timed</div>
                <div style={{ ...TYPE.displaySection, fontSize: 18, color: GENERAL.softWhite, marginBottom: 4 }}>Timed mixed practice</div>
                <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>10 questions · 10 min · all subjects</div>
              </div>
              <NavArrow color={GENERAL.teal} />
            </button>
          </div>
          <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 10 }}>
            By subject
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {EXAM_SUBJECTS.map((subj, i) => (
              <button key={i} onClick={() => { setPaperChooserOpen(false); subj.action() }} style={{
                position: 'relative', height: 112, borderRadius: RADII.medium, overflow: 'hidden',
                border: `1px solid ${subj.color}28`, cursor: 'pointer', padding: 0,
                background: GENERAL.neutral[1], boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
              }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${subj.logo})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.75) brightness(0.72)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,7,11,0.10) 0%, rgba(5,7,11,0.72) 58%, rgba(5,7,11,0.96) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 10px 10px', textAlign: 'left' }}>
                  <div style={{ ...TYPE.titleMedium, color: '#F5F7FF', lineHeight: '18px' }}>{subj.label}</div>
                </div>
                <div style={{ position: 'absolute', top: 9, left: 9, width: 6, height: 6, borderRadius: '50%', background: subj.color, boxShadow: `0 0 8px ${subj.color}` }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Exam landing ───────────────────────────────────────────────────────────
  const examWeekStats = (() => {
    try {
      const scores = JSON.parse(localStorage.getItem('gcse_scores') || '[]')
      const d = new Date(); d.setDate(d.getDate() - 7)
      const cutoff = d.toISOString().slice(0, 10)
      const week = scores.filter(s => (s.source === 'exam' || s.source === 'exam-paper') && s.date > cutoff)
      if (!week.length) return null
      return { count: week.length, avgPct: Math.round(week.reduce((sum, s) => sum + s.pct, 0) / week.length) }
    } catch { return null }
  })()

  const EXAM_MODE_CARDS = [
    {
      id: 'weak', accent: GENERAL.teal, kicker: 'Start', title: 'Practice a weak spot',
      lines: ['Adaptive questions based on', "where you're struggling most."],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke={GENERAL.teal} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill={GENERAL.teal} />
        </svg>
      ),
      onClick: () => startExamRound('Random', { title: 'Weak spot practice' }),
    },
    {
      id: 'technique', accent: PULSE_GOLD, kicker: 'Coach', title: 'Nail exam technique',
      lines: ['Learn exactly how top answers are built', 'before writing your own.'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PULSE_GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      ),
      onClick: () => setExamTechniqueOpen(true),
    },
    {
      id: 'paper', accent: GENERAL.coral, kicker: 'Challenge', title: 'Sit a full paper',
      lines: ['Real timings. Real conditions.', 'No hints.'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GENERAL.coral} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2.5" />
          <path d="M9 1h6" />
        </svg>
      ),
      onClick: () => setPaperChooserOpen(true),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 110, overflowX: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '34vh', minHeight: 260, maxHeight: 340, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/headers/exam-summit.png)', backgroundSize: 'cover', backgroundPosition: 'center 30%', filter: 'saturate(0.9)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(13,15,16,0.5) 0%, rgba(13,15,16,0.1) 28%, rgba(13,15,16,0.25) 58%, ${GENERAL.neutral[0]} 100%)` }} />
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', right: SPACING.compact, zIndex: 2 }}>
          <StreakChip />
        </div>
        <div style={{ position: 'absolute', left: SPACING.compact, right: SPACING.compact, bottom: SPACING.standard, zIndex: 2 }}>
          <div style={{ ...TYPE.displayHero, fontSize: 46, color: GENERAL.softWhite }}>
            Exams<span style={{ color: GENERAL.teal }}>.</span>
          </div>
          <div style={{ marginTop: 10, ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.teal }}>
            Practise like it's the real thing.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 430, margin: '0 auto', padding: `0 ${SPACING.compact}px` }}>
        <div style={{ marginTop: SPACING.compact + 4, marginBottom: 10, ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.slate }}>
          Choose your next step.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXAM_MODE_CARDS.map(card => (
            <button key={card.id} onClick={card.onClick} disabled={card.disabled} style={{
              display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
              padding: '14px 16px', cursor: card.disabled ? 'default' : 'pointer',
              borderRadius: RADII.large, background: GENERAL.neutral[1],
              border: '1px solid rgba(255,255,255,0.06)', borderLeft: `2px solid ${card.accent}`,
              opacity: card.disabled ? 0.55 : 1,
            }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0, border: `1.5px solid ${card.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: card.accent, marginBottom: 4 }}>{card.kicker}</div>
                <div style={{ ...TYPE.displaySection, fontSize: 22, color: GENERAL.softWhite, marginBottom: 4 }}>{card.title}</div>
                {card.lines.map((line, i) => (
                  <div key={i} style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>{line}</div>
                ))}
              </div>
              {!card.disabled && <NavArrow color={card.accent} />}
            </button>
          ))}
        </div>

        {examWeekStats ? (
          <button onClick={onOpenPulse} style={{
            display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
            marginTop: SPACING.standard, padding: '14px 16px', cursor: 'pointer',
            borderRadius: RADII.large, background: GENERAL.neutral[1],
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0, background: `conic-gradient(${GENERAL.teal} ${examWeekStats.avgPct}%, ${GENERAL.neutral[2]} 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: GENERAL.neutral[1], display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.eyebrow, color: GENERAL.softWhite }}>
                {examWeekStats.avgPct}%
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...TYPE.body, color: GENERAL.softWhite, marginBottom: 4 }}>
                You've answered {examWeekStats.count} exam question{examWeekStats.count === 1 ? '' : 's'} this week.
              </div>
              <div style={{ ...TYPE.label, color: GENERAL.teal }}>View your progress →</div>
            </div>
          </button>
        ) : (
          <div style={{ marginTop: SPACING.standard, padding: '14px 16px', borderRadius: RADII.large, background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)', ...TYPE.body, color: GENERAL.slate }}>
            Sit your first paper to start tracking progress.
          </div>
        )}
      </div>
    </div>
  )
}
