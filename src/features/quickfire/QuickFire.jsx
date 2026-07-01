import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { SPACING }  from '../../constants/spacing.js'
import { RADII }    from '../../constants/radii.js'
import { TYPE }     from '../../constants/typography.js'
import { GENERAL }  from '../../constants/generalTheme.js'
import { MOTION }   from '../../constants/motion.js'
import { SOCIOLOGY_GROUPS } from '../../data/sociologyGroups.js'
import { CHEM_IMAGES } from '../../data/chemImages.js'
import { MEDICINE_2023_PAPER } from '../../data/medicineExamPapers.js'
import { ALL_EXAM_PAPERS } from '../../data/examPapers/index.js'
import { ExamPaperRunner } from '../exampaper/ExamPaperRunner.jsx'
import { getProgress, recordScore } from '../../progress.js'
import { getSuggestedQuestionType } from '../../unifiedWeaknessTracker.js'
import { MODULES } from '../../modules.js'
import { StreakChip } from '../home/StreakChip.jsx'
import BackButton from '../../components/core/BackButton.jsx'
import ContinueCTA from '../../components/core/ContinueCTA.jsx'
import ExamQuestionFrame from '../../components/feedback/ExamQuestionFrame.jsx'
import ExamRoundDebrief from '../../components/feedback/ExamRoundDebrief.jsx'
import GuidedAnswerCoach from '../../components/learning/GuidedAnswerCoach.jsx'
import { QUESTION_BANKS_BY_MODULE } from '../../data/questionBanks/questionRegistry.js'
import { QuickFireMode, readQfBest } from './modes/QuickFireMode.jsx'
import { TopicPracticeMode } from './modes/TopicPracticeMode.jsx'
import { gradeWithAI, cleanQuestionText } from './utils.js'

// ─── Exam Mode question-bank loading ───────────────────────────────────────────
// The Maths/English/Sociology/Chemistry question banks and the exam-technique
// coach types are only needed inside Exam Mode (TestTab mode="exam") — load
// them on demand and share them via context so they're not in the main bundle.

const TestDataContext = createContext(null)

function useTestData() {
  return useContext(TestDataContext)
}

export function TestDataProvider({ children }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([
      import('../../data/mathsTopics.js'),
      import('../../data/englishTopics.js'),
      import('../../data/sociologyTopics.js'),
      import('../../data/chemistryTopics.js'),
      import('../../data/guidedAnswerCoach.js'),
    ]).then(([maths, english, sociology, chemistry, coach]) => {
      setData({
        MATHS_TOPIC_GROUPS: maths.MATHS_TOPIC_GROUPS,
        ALL_MATHS_QUESTIONS: maths.ALL_MATHS_QUESTIONS,
        FORMULA_SHEET: maths.FORMULA_SHEET,
        DIAGRAMS: maths.DIAGRAMS,
        ENGLISH_TOPIC_GROUPS: english.ENGLISH_TOPIC_GROUPS,
        ALL_ENGLISH_QUESTIONS: english.ALL_ENGLISH_QUESTIONS,
        SOCIOLOGY_TOPIC_GROUPS: sociology.SOCIOLOGY_TOPIC_GROUPS,
        ALL_SOCIOLOGY_QUESTIONS: sociology.ALL_SOCIOLOGY_QUESTIONS,
        CHEMISTRY_TOPIC_GROUPS: chemistry.CHEMISTRY_TOPIC_GROUPS,
        ALL_CHEMISTRY_QUESTIONS: chemistry.ALL_CHEMISTRY_QUESTIONS,
        GUIDED_COACH_TYPES: coach.GUIDED_COACH_TYPES,
      })
    })
  }, [])

  if (!data) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#08090D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src="/logo.png" alt="" style={{ width: 64, height: 64, objectFit: 'contain', opacity: 0.5 }} />
    </div>
  )
  return <TestDataContext.Provider value={data}>{children}</TestDataContext.Provider>
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

const PULSE_GOLD = '#D2A24C'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Shared "go" arrow used on task/mode cards across Home, Pulse and Exams.
function NavArrow({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

import { hexToRgb } from '../../constants/subjects.js'

// ─── Test tab ─────────────────────────────────────────────────────────────────

const TEST_TOPICS = [
  {
    subject: 'History',
    icon: '📜',
    topics: [
      { id: 'th1',      label: 'Medieval Medicine c1250–c1500',        questions: 5,  available: true },
      { id: 'th2',      label: 'Renaissance & the Plague c1500–c1700', questions: 4,  available: true },
      { id: 'th3',      label: 'Surgery & Anatomy c1700–c1900',        questions: 4,  available: true },
      { id: 'th4',      label: 'Germ Theory c1850–c1900',              questions: 3,  available: true },
      { id: 'th5',      label: 'Public Health c1800–c1900',            questions: 3,  available: true },
      { id: 'th_wf',    label: 'Western Front 1914–18',                questions: 3,  available: true },
      { id: 'th_modern',label: 'Modern Medicine c1900–present',        questions: 1,  available: true },
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

// NOTE: Past paper question banks have been extracted to
// src/data/questionBanks/ and are now accessed via QUESTION_BANKS_BY_MODULE.
// PAST_PAPER_QS has been removed — use QUESTION_BANKS_BY_MODULE[topicId] instead.




// ─── Formula sheet modal ──────────────────────────────────────────────────────
function FormulaSheet({ onClose }) {
  const { FORMULA_SHEET } = useTestData() || {}
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#0E1330', border:'1px solid rgba(59,130,255,.3)', borderRadius:'20px 20px 0 0', padding:'20px 18px 40px', width:'100%', maxWidth:660, maxHeight:'82vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div>
            <div style={{ ...TYPE.titleLarge, color:'#F5F7FB' }}>📐 AQA Formula Sheet</div>
            <div style={{ ...TYPE.bodySmall, fontSize:'.75rem', color:'#5A6480', marginTop:2 }}>These are given in the exam — but worth knowing them cold</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.08)', border:'1px solid #2A3552', borderRadius:8, padding:'6px 14px', color:'#9CA8C7', cursor:'pointer', fontFamily:'inherit', fontSize:'.82rem' }}>✕</button>
        </div>
        {(FORMULA_SHEET || []).map(cat => (
          <div key={cat.section} style={{ marginBottom:18 }}>
            <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#3B82FF', marginBottom:10 }}>{cat.section}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {cat.formulae.map(item => (
                <div key={item.name} style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  <div style={{ ...TYPE.label, color:'#9CA8C7' }}>{item.name}</div>
                  <div style={{ ...TYPE.titleMedium, color:'#F5F7FB', flexShrink:0 }}>{item.f}</div>
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
  const { DIAGRAMS } = useTestData() || {}
  const svg = DIAGRAMS?.[diagramKey]
  if (!svg) return null
  return (
    <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'14px', marginBottom:14 }}>
      <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#3B82FF', marginBottom:8 }}>📐 Diagram — from AQA past paper</div>
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
            <BackButton onClick={() => { reset(); onBack() }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:topicColor, flexShrink:0, boxShadow:`0 0 6px ${topicColor}` }} />
                <span style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:topicColor }}>{topicLabel}</span>
              </div>
              <div style={{ ...TYPE.button, color:'#F5F7FB' }}>
                Q{q.qNum} · {q.source}
              </div>
            </div>
            {isMathsQ && (<div style={{ display:'flex', gap:6, flexShrink:0 }}>{isCalc
                      ? <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(56,210,122,.1)', border:'1px solid rgba(56,210,122,.25)', borderRadius:8, padding:'4px 10px', ...TYPE.eyebrow, textTransform:'uppercase', color:'#38D27A' }}>🖩 Calculator OK</div>
                      : <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,200,87,.07)', border:'1px solid rgba(255,200,87,.18)', borderRadius:8, padding:'4px 10px', ...TYPE.eyebrow, textTransform:'uppercase', color:'#FFC857' }}>✏️ No Calculator</div>
              }
              <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:8, padding:'4px 10px', ...TYPE.eyebrow, textTransform:'uppercase', color:'#70B8FF', cursor:'pointer' }}>📐 Formulae</button>
            </div>)}
          </div>
          {/* Progress */}
          <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${((qIdx+1)/total)*100}%`, background:`linear-gradient(90deg,${topicColor}88,${topicColor})`, borderRadius:99, transition:'width .4s ease' }} />
          </div>
          <div style={{ ...TYPE.metadata, color:'#4A5578', marginTop:5, textAlign:'right' }}>{qIdx+1} / {total}</div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px 20px' }}>
        {/* Marks badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:`${topicColor}18`, border:`1px solid ${topicColor}44`, borderRadius:99, padding:'4px 13px', marginBottom:14 }}>
          <span style={{ ...TYPE.label, color:topicColor }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
        </div>

        {/* Diagram */}
        {q.diagramKey && <MathsDiagram diagramKey={q.diagramKey} />}


        {/* Source extract or reference */}
        {q.extract && (() => {
          const isRealExtract = q.extract.startsWith('Lines') || q.extract.startsWith('"')
          return (
            <div style={{ background:'#0D1424', borderLeft:`3px solid ${topicColor}`, borderRadius:'0 12px 12px 0', padding:'14px 16px', marginBottom:14 }}>
              <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:topicColor, marginBottom:8 }}>
                {isRealExtract ? '📄 Source extract' : '📎 Where to find your source'}
              </div>
              <p style={{ ...TYPE.body, fontSize:'.88rem', margin:0, color: isRealExtract ? '#C8D0E8' : '#9CA8C7', whiteSpace:'pre-wrap', maxHeight:240, overflowY:'auto', WebkitOverflowScrolling:'touch', paddingRight:4 }}>{q.extract}</p>
            </div>
          )
        })()}

        {/* Question */}
        <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:16, padding:'18px 18px', marginBottom:14 }}>
          <pre style={{ ...TYPE.body, margin:0, color:'#E0E6F0', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
        </div>

        {/* Mark tip */}
        {!showTip
          ? <button onClick={() => setTip(true)} style={{ background:'transparent', border:'1px dashed #2A3552', borderRadius:10, padding:'9px 14px', cursor:'pointer', color:'#4A5578', ...TYPE.label, width:'100%', marginBottom:14 }}>💡 {isMathsQ ? 'How many steps do I need to show?' : 'What does this question need from me?'}</button>
          : <div style={{ background:'rgba(255,200,87,.05)', border:'1px solid rgba(255,200,87,.18)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
              <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#FFC857', marginBottom:5 }}>{isMathsQ ? `${q.marks}-mark question` : `${q.marks} marks — what to write`}</div>
              <p style={{ ...TYPE.body, fontSize:'.86rem', margin:0, color:'#C8D0E8' }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
            </div>
        }

        {/* Answer area — only shown before feedback */}
        {!feedback && (
          q.type === 'mc' || q.type === 'mc_multi'
            ? <div style={{ marginBottom:16 }}>
                {q.type === 'mc_multi' && <div style={{ ...TYPE.bodySmall, fontSize:'.75rem', color:'#5A6480', marginBottom:8 }}>Select all that apply ({q.marks} correct answers)</div>}
                {/* Hint card after first wrong MC attempt */}
                {mcHint && !mcLocked && (
                  <div style={{ background:'rgba(255,200,87,.06)', border:'1px solid rgba(255,200,87,.25)', borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
                    <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#FFC857', marginBottom:6 }}>💡 Hint — think about this</div>
                    <p style={{ ...TYPE.body, fontSize:'.87rem', color:'#C8D0E8', margin:0 }}>
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
                    <button key={i} onClick={toggle} disabled={mcLocked} style={{ background:sel?`${topicColor}18`:'#151720', border:`1.5px solid ${sel?topicColor:'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'14px 16px', cursor:mcLocked?'default':'pointer', textAlign:'left', ...TYPE.body, fontSize:'.93rem', color:sel?topicColor:'#C8D0E8', transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ width:24, height:24, borderRadius:isMulti?'4px':'50%', border:`1.5px solid ${sel?topicColor:'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.75rem', fontWeight:700, color:sel?topicColor:'#4A5578', background:sel?`${topicColor}18`:'transparent' }}>{isMulti ? (sel ? '✓' : '') : String.fromCharCode(65+i)}</span>
                      {opt}
                    </button>
                  )
                })}
                </div>
              </div>
            : <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:14, padding:'14px', marginBottom:16 }}>
                <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#4A5578', marginBottom:8 }}>{isMathsQ ? 'Your working & answer' : 'Your answer'}</div>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder={isMathsQ ? (q.marks >= 3 ? 'Show all your working here…' : 'Write your answer…') : 'Write your answer here. Use quotes from the extract where relevant…'}
                  style={{ width:'100%', border:'none', background:'transparent', resize:'none', ...TYPE.body, color:'#E0E6F0', outline:'none', minHeight: q.marks >= 4 ? 170 : q.marks >= 2 ? 110 : 65 }}
                />
              </div>
        )}

        {/* Error */}
        {error && <div style={{ background:'rgba(255,93,115,.08)', border:'1px solid rgba(255,93,115,.3)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}><p style={{ ...TYPE.body, fontSize:'.86rem', margin:0, color:'#FF5D73' }}>{error}</p></div>}

        {/* Feedback */}
        {feedback && gs && (
          <div className="fade-up">
            {/* Score card */}
            <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:18, padding:'20px', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ ...TYPE.displayHero, fontSize:'2rem', color:gs.text }}>
                  {feedback.marksAwarded}<span style={{ fontSize:'1.1rem', opacity:.5 }}>/{feedback.marksAvailable}</span>
                </div>
                <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', ...TYPE.label, fontSize:'.8rem' }}>{feedback.grade}</div>
              </div>
              <p style={{ ...TYPE.body, fontSize:'.9rem', color:gs.text, margin:0, opacity:.9 }}>{feedback.summary}</p>
            </div>

            {/* What they got right */}
            {feedback.achieved?.length > 0 && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#4DFF88', marginBottom:10 }}>✓ What you got right</div>
                {feedback.achieved.map((a,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.achieved.length-1?8:0 }}>
                    <span style={{ color:'#4DFF88', flexShrink:0, fontSize:'.9rem' }}>✓</span>
                    <p style={{ margin:0, ...TYPE.body, fontSize:'.88rem', color:'#C8D0E8' }}>{a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* What they missed */}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#FF5D73', marginBottom:10 }}>→ Next time, also include</div>
                {feedback.missed.map((m,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.missed.length-1?8:0 }}>
                    <span style={{ color:'#FF5D73', flexShrink:0, fontSize:'.9rem' }}>→</span>
                    <p style={{ margin:0, ...TYPE.body, fontSize:'.88rem', color:'#C8D0E8' }}>{m}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Examiner tip */}
            {feedback.examinerTip && (
              <div style={{ background:'rgba(245,183,0,.05)', border:'1px solid rgba(245,183,0,.18)', borderRadius:13, padding:'14px', marginBottom:16 }}>
                <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#F5B700', marginBottom:6 }}>🗡️ Examiner tip</div>
                <p style={{ margin:0, ...TYPE.body, fontSize:'.88rem', color:'#C8D0E8' }}>{feedback.examinerTip}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <button onClick={reset} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:13, padding:'14px', ...TYPE.button, cursor:'pointer', color:'#9CA8C7', fontSize:'.88rem' }}>↩ Try again</button>
              <ContinueCTA onClick={onNext} label={qIdx < total-1 ? 'Next \u2192' : 'Finish \u2713'} accent={topicColor} />
            </div>
          </div>
        )}

        {/* Submit button — hidden for locked MC (feedback already shown inline) */}
        {!feedback && !(mcLocked) && (
          <button onClick={grade} disabled={grading || (q.type === 'mc' && !answer) || (q.type === 'mc_multi' && (!answer || answer.length === 0))}
            style={{ width:'100%', background:grading?'rgba(255,255,255,0.08)':`linear-gradient(135deg,${topicColor}cc,${topicColor})`, color:grading?'#4A5578':'#fff', border:'none', borderRadius:13, padding:'16px', ...TYPE.button, cursor:(grading||(q.type==='mc'&&!answer))?'default':'pointer', marginTop:4, boxShadow:grading?'none':`0 4px 20px ${topicColor}44`, transition:'all .2s',
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
  if (['number','negatives','fractions','percentages','decimals','indices','surds','primes','bidmas','powers'].some(k => n.includes(k))) return '/headers/maths-numbers.webp'
  if (['algebra','equations','inequalities','sequences','quadratic','expression','formula'].some(k => n.includes(k))) return '/headers/maths-algebra.webp'
  if (['graph','gradient','coordinate','straight','linear_graph'].some(k => n.includes(k))) return '/headers/maths-algebra.webp'
  if (['angles','area','volume','similarity','transforms','pythagoras','trig','geometry','polygon','shape','circle','perimeter'].some(k => n.includes(k))) return '/headers/maths-geometry.webp'
  if (['statistics','probability','data','averages','mean','sampling','charts'].some(k => n.includes(k))) return '/headers/maths-data.webp'
  if (['ratio','proportion','speed','density','money','finance','units'].some(k => n.includes(k))) return '/headers/maths-realworld.webp'
  return '/headers/maths-main.webp'
}

function MathsBrowser({ onBack }) {
  const { MATHS_TOPIC_GROUPS } = useTestData() || {}
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
          <BackButton onClick={onBack} />
          <img src="/headers/maths-main.webp" alt="Maths" style={{ width:32, height:32, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ ...TYPE.titleLarge, color:'#F5F7FB' }}>AQA Maths — Topics</div>
            <div style={{ ...TYPE.metadata, color:'#5A6480' }}>{MATHS_TOPIC_GROUPS.length} topics · {totalQs} questions · AI marked</div>
          </div>
          <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:10, padding:'7px 12px', ...TYPE.label, fontSize:'.73rem', color:'#70B8FF', cursor:'pointer', flexShrink:0 }}>📐 Formulae</button>
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
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(59,130,255,.15)':'#151720', border:`1px solid ${filter===f.id?'#3B82FF':'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'9px 6px', ...TYPE.label, fontSize:'.75rem', color:filter===f.id?'#70B8FF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
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
                <div style={{ ...TYPE.titleMedium, color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ ...TYPE.bodySmall, fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  {/* Mini progress-style pill */}
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:'0%', background:group.color, borderRadius:99 }} />
                  </div>
                  <span style={{ ...TYPE.label, fontSize:'.68rem', color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  {group.calculator
                    ? <span style={{ ...TYPE.metadata, color:'#38D27A', flexShrink:0 }}>🖩</span>
                    : <span style={{ ...TYPE.metadata, color:'#FFC857', flexShrink:0 }}>✗</span>
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
  const { ENGLISH_TOPIC_GROUPS } = useTestData() || {}
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
          <BackButton onClick={onBack} />
          <img src="/headers/english-main.webp" alt="English" style={{ width:32, height:32, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ ...TYPE.titleLarge, color:'#F5F7FB' }}>AQA English Language</div>
            <div style={{ ...TYPE.metadata, color:'#5A6480' }}>Papers 1 & 2 · {ENGLISH_TOPIC_GROUPS.length} skill areas · {totalQs} questions · AI marked</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?`rgba(${GENERAL.tealRgb},0.15)`:'#151720', border:`1px solid ${filter===f.id?GENERAL.teal:'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'9px 6px', ...TYPE.label, fontSize:'.75rem', color:filter===f.id?GENERAL.softWhite:GENERAL.slate, cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

        {/* Topic cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:16, padding:'16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, width:'100%' }}>
              <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
                <img src="/headers/english-main.webp" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ ...TYPE.titleMedium, color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ ...TYPE.bodySmall, fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.08)', borderRadius:99 }} />
                  <span style={{ ...TYPE.label, fontSize:'.68rem', color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  <span style={{ ...TYPE.metadata, color:'#4A5578', flexShrink:0 }}>{group.marks}m</span>
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
  const { SOCIOLOGY_TOPIC_GROUPS } = useTestData() || {}
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
          <BackButton onClick={onBack} />
          <img src={socGroup?.headerImage || '/headers/sociology-main.webp'} alt="Sociology" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...TYPE.titleLarge, color: '#F5F7FB' }}>{headerTitle}</div>
            <div style={{ ...TYPE.metadata, color: '#5A6480' }}>
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
              ...TYPE.label, fontSize: '.75rem',
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
                  if (id.startsWith('soc_families'))     return '/headers/sociology-family.webp'
                  if (id.startsWith('soc_education'))    return '/headers/sociology-education.webp'
                  if (id.startsWith('soc_crime'))        return '/headers/sociology-crime.webp'
                  if (id.startsWith('soc_stratification')) return '/headers/sociology-stratification.webp'
                  return '/headers/sociology-main.webp'
                })()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...TYPE.titleMedium, color: '#F5F7FB', marginBottom: 3 }}>{group.label}</div>
                <div style={{ ...TYPE.bodySmall, fontSize: '.75rem', color: '#5A6480', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }} />
                  <span style={{ ...TYPE.label, fontSize: '.68rem', color: group.color, flexShrink: 0 }}>{group.questions.length} Q{group.questions.length !== 1 ? 's' : ''}</span>
                  <span style={{ ...TYPE.metadata, color: '#4A5578', flexShrink: 0 }}>{group.marks}m</span>
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
      <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#38D27A', marginBottom: 8 }}>
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
            <BackButton onClick={onBack} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ ...TYPE.eyebrow, fontSize: '.68rem', textTransform: 'uppercase', color }}>Chemistry · {group.label}</span>
              </div>
              <div style={{ ...TYPE.button, color: '#F5F7FB' }}>
                {q.source} · {q.marks} mark{q.marks !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {group.calculator
                ? <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(56,210,122,.1)', border:'1px solid rgba(56,210,122,.25)', borderRadius:8, padding:'4px 10px', ...TYPE.eyebrow, fontSize:'.63rem', color:'#38D27A' }}><span style={{fontSize:'.8rem'}}>🖩</span>Calculator OK</div>
                : <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,200,87,.07)', border:'1px solid rgba(255,200,87,.18)', borderRadius:8, padding:'4px 10px', ...TYPE.eyebrow, fontSize:'.63rem', color:'#FFC857' }}><span style={{fontSize:'.8rem'}}>✏️</span>No Calculator</div>
              }
            </div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((qIdx+1)/qs.length)*100}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 99, transition: 'width .4s' }} />
          </div>
          <div style={{ ...TYPE.metadata, color: '#4A5578', marginTop: 5, textAlign: 'right' }}>{qIdx+1} / {qs.length}</div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px 20px' }}>
        {/* Marks badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 99, padding: '4px 13px', marginBottom: 14 }}>
          <span style={{ ...TYPE.label, color }}>[{q.marks} mark{q.marks !== 1 ? 's' : ''}]</span>
        </div>

        {/* Chemistry diagram image */}
        {q.imageKey && <ChemImage imageKey={q.imageKey} />}

        {/* Question */}
        <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 16, padding: '18px', marginBottom: 14 }}>
          <pre style={{ ...TYPE.body, margin: 0, color: '#E0E6F0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{q.q}</pre>
        </div>

        {/* Skill tip */}
        {!showTip
          ? <button onClick={() => setTip(true)} style={{ background: 'transparent', border: '1px dashed #2A3552', borderRadius: 10, padding: '9px 14px', cursor: 'pointer', color: '#4A5578', ...TYPE.label, width: '100%', marginBottom: 14 }}>💡 How many marks do I need to earn?</button>
          : <div style={{ background: 'rgba(255,200,87,.05)', border: '1px solid rgba(255,200,87,.18)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#FFC857', marginBottom: 5 }}>{q.marks}-mark question</div>
              <p style={{ ...TYPE.body, margin: 0, fontSize: '.86rem', color: '#C8D0E8' }}>{CHEM_TIPS[q.marks] || CHEM_TIPS[4]}</p>
            </div>
        }

        {/* Answer — MC or written */}
        {!feedback && (
          (q.type === 'mc' || q.type === 'mc_multi')
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswer(opt)} style={{ background: answer === opt ? `${color}18` : '#151720', border: `1.5px solid ${answer === opt ? color : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', ...TYPE.body, fontSize: '.93rem', color: answer === opt ? color : '#C8D0E8', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${answer === opt ? color : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.72rem', fontWeight: 700, color: answer === opt ? color : '#4A5578', background: answer === opt ? `${color}18` : 'transparent' }}>{String.fromCharCode(65+i)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            : <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 14, padding: '14px', marginBottom: 16 }}>
                <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#4A5578', marginBottom: 8 }}>Your answer</div>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Write your answer here. Show any working…" style={{ width: '100%', border: 'none', background: 'transparent', resize: 'none', ...TYPE.body, color: '#E0E6F0', outline: 'none', minHeight: q.marks >= 4 ? 160 : q.marks >= 2 ? 100 : 65 }} />
              </div>
        )}

        {/* Error */}
        {error && <div style={{ background: 'rgba(255,93,115,.08)', border: '1px solid rgba(255,93,115,.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}><p style={{ ...TYPE.body, margin: 0, fontSize: '.86rem', color: '#FF5D73' }}>{error}</p></div>}

        {/* Feedback */}
        {feedback && gs && (
          <div className="fade-up">
            <div style={{ background: gs.bg, border: `2px solid ${gs.border}`, borderRadius: 18, padding: '20px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ ...TYPE.displayHero, fontSize: '2rem', color: gs.text }}>{feedback.marksAwarded}<span style={{ fontSize: '1.1rem', opacity: .5 }}>/{feedback.marksAvailable}</span></div>
                <div style={{ background: gs.badge, color: '#000', borderRadius: 99, padding: '5px 14px', ...TYPE.label }}>{feedback.grade}</div>
              </div>
              <p style={{ ...TYPE.body, color: gs.text, margin: 0, opacity: .9 }}>{feedback.summary}</p>
            </div>
            {feedback.achieved?.length > 0 && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#4DFF88', marginBottom: 10 }}>✓ What you got right</div>{feedback.achieved.map((a,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#4DFF88', flexShrink: 0 }}>✓</span><p style={{ margin: 0, ...TYPE.body, fontSize: '.88rem', color: '#C8D0E8' }}>{a}</p></div>)}</div>}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#FF5D73', marginBottom: 10 }}>→ Next time, also include</div>{feedback.missed.map((m,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#FF5D73', flexShrink: 0 }}>→</span><p style={{ margin: 0, ...TYPE.body, fontSize: '.88rem', color: '#C8D0E8' }}>{m}</p></div>)}</div>}
            {feedback.examinerTip && <div style={{ background: 'rgba(245,183,0,.05)', border: '1px solid rgba(245,183,0,.18)', borderRadius: 13, padding: '14px', marginBottom: 16 }}><div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#F5B700', marginBottom: 6 }}>🗡️ Examiner tip</div><p style={{ margin: 0, ...TYPE.body, fontSize: '.88rem', color: '#C8D0E8' }}>{feedback.examinerTip}</p></div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={reset} style={{ background: '#151720', border: '1px solid #2A3552', borderRadius: 13, padding: '14px', ...TYPE.button, fontSize: '.88rem', cursor: 'pointer', color: '#9CA8C7' }}>↩ Try again</button>
              <ContinueCTA onClick={next} label={qIdx < qs.length-1 ? 'Next →' : 'Finish ✓'} accent={color} />
            </div>
          </div>
        )}

        {/* Submit */}
        {!feedback && (
          <button onClick={grade} disabled={grading} style={{ width: '100%', background: grading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${color}cc, ${color})`, color: grading ? '#4A5578' : '#fff', border: 'none', borderRadius: 13, padding: '16px', ...TYPE.buttonLarge, cursor: grading ? 'default' : 'pointer', marginTop: 4, boxShadow: grading ? 'none' : `0 4px 20px ${color}44`, transition: 'all .2s' }}>
            {grading ? '⏳ Marking your answer…' : 'Check my answer →'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Chemistry browser ────────────────────────────────────────────────────────
function ChemistryBrowser({ onBack }) {
  const { CHEMISTRY_TOPIC_GROUPS } = useTestData() || {}
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
          <BackButton onClick={onBack} />
          <img src="/headers/chem-logo.webp" alt="Chemistry" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...TYPE.titleLarge, color: '#F5F7FB' }}>AQA Chemistry Foundation</div>
            <div style={{ ...TYPE.metadata, color: '#5A6480' }}>Papers 1 & 2 · {CHEMISTRY_TOPIC_GROUPS.length} topics · {totalQs} questions · AI marked · Diagrams included</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex: 1, background: filter === f.id ? 'rgba(56,210,122,.15)' : '#151720', border: `1px solid ${filter === f.id ? '#38D27A' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '9px 6px', ...TYPE.label, color: filter === f.id ? '#38D27A' : '#5A6480', cursor: 'pointer' }}>{f.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 16, padding: '16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={(() => {
                  const id = group.id || ''
                  if (['chem_atom','chem_periodic','chem_bonding','chem_giant','chem_matter','chem_ions'].some(k => id.startsWith(k))) return '/headers/chem-matteratoms.webp'
                  if (['chem_react','chem_acid','chem_electro','chem_energy','chem_calcul'].some(k => id.startsWith(k))) return '/headers/chem-reactions.webp'
                  if (['chem_rates','chem_revers','chem_hydro','chem_crack','chem_organic','chem_polymer'].some(k => id.startsWith(k))) return '/headers/chem-rates.webp'
                  if (['chem_earth','chem_atmos','chem_pollu','chem_resource'].some(k => id.startsWith(k))) return '/headers/chem-earth.webp'
                  return '/headers/chem-logo.webp'
                })()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...TYPE.titleMedium, color: '#F5F7FB', marginBottom: 3 }}>{group.label}</div>
                <div style={{ ...TYPE.bodySmall, color: '#5A6480', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }} />
                  <span style={{ ...TYPE.eyebrow, fontSize: '.68rem', color: group.color, flexShrink: 0 }}>{group.questions.length} Q{group.questions.length !== 1 ? 's' : ''}</span>
                  <span style={{ background: group.calculator ? 'rgba(56,210,122,.12)' : 'rgba(255,200,87,.08)', border: group.calculator ? '1px solid rgba(56,210,122,.25)' : '1px solid rgba(255,200,87,.2)', borderRadius:6, padding:'2px 8px', ...TYPE.eyebrow, fontSize:'.6rem', color: group.calculator ? '#38D27A' : '#FFC857', flexShrink:0 }}>{group.calculator ? '🖩 Calc OK' : '✏️ No Calc'}</span>
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



function TestTab({ mode = 'test', onOpenModule, onExit, onOpenPulse, autoStart = false, examAutoStart = null, clearExamAutoStart } = {}) {
  const { ALL_MATHS_QUESTIONS, ALL_ENGLISH_QUESTIONS, ALL_SOCIOLOGY_QUESTIONS, ALL_CHEMISTRY_QUESTIONS, GUIDED_COACH_TYPES } = useTestData() || {}
  const [mathsOpen, setMathsOpen]   = useState(false)
  const [englishOpen, setEnglishOpen]     = useState(false)
  const [sociologyOpen, setSociologyOpen]     = useState(false)
  const [chemistryOpen, setChemistryOpen]     = useState(false)
  const [activePaper, setActivePaper] = useState(null)
  const [paperChooserOpen, setPaperChooserOpen] = useState(false)
  const [examTechniqueOpen, setExamTechniqueOpen] = useState(false)
  const [activeCoachType, setActiveCoachType] = useState(null)
  const [selected, setSelected]   = useState(null)
  const [testProgress, setTestProgress] = useState(() => { try { return getProgress() } catch { return { streak: 0 } } })
  const testStreak = testProgress.streak || 0
  const testStreakDots = Array.from({ length: 7 }, (_, i) => i < Math.min(7, testStreak))
  const isQuickFire = mode === 'quickfire'
  const isExamMode = mode === 'exam'
  const [qfSessionActive, setQfSessionActive] = useState(() => isQuickFire && autoStart)
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
  // Full-paper exam state
  const [examPaperAnswers,   setExamPaperAnswers]   = useState({})
  const [examPaperFeedbacks, setExamPaperFeedbacks] = useState({})
  const [examPaperGrading,   setExamPaperGrading]   = useState({})

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

  // Auto-start an exam round when launched from Home's "Today's plan"
  const examAutoStartedRef = useRef(false)
  useEffect(() => {
    if (isExamMode && examAutoStart && !examAutoStartedRef.current) {
      examAutoStartedRef.current = true
      const { subject, ...opts } = examAutoStart
      startExamRound(subject, opts)
      clearExamAutoStart?.()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const examTime = Math.floor(examTimeLeft / 60) + ':' + String(examTimeLeft % 60).padStart(2, '0')

  if (isQuickFire && qfSessionActive) {
    return <QuickFireMode onExit={() => setQfSessionActive(false)} />
  }

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

  function startExamRound(subject = 'Random', { isTimedPaper = false, durationSeconds = EXAM_SECONDS, paperQuestions = null, title = null } = {}) {
    const questions = paperQuestions || adaptiveExamQuestions(subject)
    const derivedTitle = title || (subject === 'Random' ? 'Random Exam Challenge' : subject + ' Exam Sprint')
    setExamConfig({ subject, title: derivedTitle, isTimedPaper })
    setExamQuestions(questions)
    setExamIdx(0)
    setExamTimeLeft(durationSeconds)
    setExamCountdown(3)
    setExamStats({ correct: 0, answered: 0, bySubject: {} })
    resetExamQuestion()
    setExamPaperAnswers({})
    setExamPaperFeedbacks({})
    setExamPaperGrading({})
    setExamPhase('countdown')
  }

  function startMedicinePaper2023() {
    const paperQs = MEDICINE_2023_PAPER.questions.map(q => ({
      id: q.id,
      q: q.q,
      marks: q.marks,
      type: q.type,
      ms: q.ms,
      commandWord: q.commandWord,
      topic: q.topic,
      subject: q.subject,
      extract: q.extract,
      sectionHeader: q.sectionHeader,
      sectionNote: q.sectionNote,
      sourcesBooklet: q.sourcesBooklet,
      sourceRefs: q.sourceRefs,
      isChoice: q.isChoice,
      choiceHeader: q.choiceHeader,
      spagNote: q.spagNote,
      note: q.note,
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


  if (isExamMode && examPhase !== 'landing') {
    const currentExamQuestion = examQuestions[examIdx]
    const examAccuracy = examStats.answered ? Math.round((examStats.correct / examStats.answered) * 100) : 0

    if (examPhase === 'countdown') {
      return (
        <div style={{ minHeight:'100vh', background:`radial-gradient(circle at 50% 20%, rgba(${GENERAL.tealRgb},.2), transparent 38%), ${GENERAL.neutral[0]}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#F5F7FB', padding:24 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:'#AAB4D4', marginBottom:20 }}>{examConfig?.title || 'Exam Mode'}</div>
            <div key={examCountdown} style={{ ...TYPE.displayHero, fontSize: examCountdown === 'GO' ? '5rem' : '7rem', color: examCountdown === 'GO' ? '#38F27B' : GENERAL.teal, textShadow:`0 0 42px rgba(${GENERAL.tealRgb},.72)`, animation:'examPop .85s ease both' }}>{examCountdown}</div>
            <div style={{ color:'#7C8DB0', marginTop:18, ...TYPE.body }}>Breathe. Read the command word first.</div>
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
            <BackButton onClick={() => setExamPhase('summary')} />
            <div style={{ flex:1 }}>
              <div style={{ ...TYPE.titleMedium, color:'#F4EFE6' }}>{examConfig?.title}</div>
              <div style={{ color:'#4B5563', fontSize:'.72rem' }}>{examQuestions.length} questions · scroll to answer all</div>
            </div>
            {examConfig?.isTimedPaper && (
              <div style={{ background:examTimeLeft < 60 ? 'rgba(255,93,115,.18)' : `rgba(${GENERAL.tealRgb},.18)`, border:'1px solid '+(examTimeLeft<60?'rgba(255,93,115,.5)':`rgba(${GENERAL.tealRgb},.4)`), borderRadius:999, color:examTimeLeft<60?'#FF5D73':GENERAL.teal, ...TYPE.buttonLarge, padding:'7px 14px', flexShrink:0 }}>{examTime}</div>
            )}
          </div>

          {/* Scrollable paper */}
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
                  {/* Section header */}
                  {q.sectionHeader && (
                    <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ ...TYPE.titleLarge, color: '#F4EFE6', marginBottom: 4 }}>{q.sectionHeader}</div>
                      {q.sectionNote && <div style={{ ...TYPE.label, color: GENERAL.slate }}>{q.sectionNote}</div>}
                    </div>
                  )}
                  {/* Sources booklet — shown inline before the first question that carries them */}
                  {q.sourcesBooklet && q.sourcesBooklet.map((src, si) => (
                    <div key={si} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px', marginBottom: 14 }}>
                      <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#C89B6D', marginBottom: 8 }}>{src.label}</div>
                      <div style={{ ...TYPE.caption, fontStyle: 'italic', color: 'rgba(245,245,245,0.48)', marginBottom: 10 }}>{src.attribution}</div>
                      <div style={{ ...TYPE.body, color: 'rgba(245,245,245,0.82)', whiteSpace: 'pre-wrap', maxHeight: 240, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingRight: 4 }}>{src.text}</div>
                      {src.credit && <div style={{ ...TYPE.metadata, color: 'rgba(245,245,245,0.3)', marginTop: 10, fontStyle: 'italic' }}>{src.credit}</div>}
                    </div>
                  ))}
                  {/* Choice / SPaG note */}
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
            <button onClick={()=>setExamPhase('summary')} style={{ width:'100%', background:GENERAL.teal, border:'none', borderRadius:16, padding:16, color:GENERAL.neutral[0], fontWeight:800, fontSize:'1rem', cursor:'pointer', marginTop:8 }}>Submit Paper</button>
          </div>
        </div>
      )
    }

    if (examPhase === 'summary') {
      return (
        <div style={{ minHeight:'100vh', background:'#08090D', color:'#F5F7FB', padding:'28px 20px 120px' }}>
          <div style={{ maxWidth:520, margin:'0 auto', textAlign:'center' }}>
            <div style={{ width:150, height:150, borderRadius:'50%', margin:'0 auto 22px', background:'conic-gradient(#38F27B ' + examAccuracy + '%, #172845 0)', display:'grid', placeItems:'center' }}><div style={{ width:122, height:122, borderRadius:'50%', background:'#071126', display:'grid', placeItems:'center' }}><div><div style={{ ...TYPE.displayHero, fontSize:'2.4rem' }}>{examAccuracy}%</div><div style={{ color:'#AAB4D4', fontWeight:800 }}>{examStats.correct}/{examStats.answered || 0}</div></div></div></div>
            <h1 style={{ ...TYPE.displayHero, fontSize:'2rem', margin:'0 0 8px' }}>Exam round complete</h1>
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

  const EXAM_SUBJECTS = [
    { logo: '/headers/sociology-main.webp', label: 'Sociology', color: '#FF5C7A', completed: 7,  total: 10, action: isExamMode ? () => startExamRound('Sociology') : () => setSociologyOpen(true) },
    { logo: '/headers/history-main.webp',   label: 'History',   color: '#C89B6D', completed: 6,  total: 12, action: isExamMode ? () => startExamRound('History') : () => startTopic({ topicId: 'medieval', label: 'History', subject: 'History' }) },
    { logo: '/headers/bio-main.webp',        label: 'Biology',   color: '#4F8A5B', completed: 1,  total: 7,  action: isExamMode ? () => startExamRound('Biology')    : () => startTopic({ topicId: 'tb_cells', label: 'Biology', subject: 'Biology' }) },
    { logo: '/headers/chem-logo.webp',       label: 'Chemistry', color: '#9B59E8', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('Chemistry')  : () => setChemistryOpen(true) },
    { logo: '/headers/maths-main.webp',      label: 'Maths',     color: '#2DD4BF', completed: 0,  total: 20, action: isExamMode ? () => startExamRound('Maths') : () => setMathsOpen(true) },
    { logo: '/headers/english-main.webp',    label: 'English',   color: '#B66DFF', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('English') : () => setEnglishOpen(true) },
    { logo: '/headers/physics-main.webp',    label: 'Physics',   color: '#3B82F6', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('Physics')  : () => {} },
  ]

  // ── Full exam paper runner ────────────────────────────────────────────────
  if (activePaper) {
    return (
      <ExamPaperRunner
        paper={activePaper}
        onExit={() => setActivePaper(null)}
      />
    )
  }

  // ── Exams landing (cinematic redesign) ──────────────────────────────────
  if (isExamMode && examPhase === 'landing') {

    // ── Guided answer coach (full-screen overlay) ──
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

    // ── Exam technique chooser ──
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
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                  padding: '14px 16px', cursor: 'pointer', borderRadius: RADII.large,
                  background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: `2px solid ${coachType.accent}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: coachType.accent, marginBottom: 4 }}>
                      {coachType.marksLabel}
                    </div>
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

    // ── Paper chooser ──
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

            <div style={{
              ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 10,
            }}>
              Real exam papers
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: SPACING.standard }}>
              {/* Edexcel History Paper 1 — June 2023 */}
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

              {/* AQA Sociology papers from registry */}
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

              {/* Generic timed practice */}
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

            <div style={{
              ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 10,
            }}>
              By subject
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {EXAM_SUBJECTS.map((subj, i) => (
                <button key={i} onClick={() => { setPaperChooserOpen(false); subj.action() }} style={{
                  position: 'relative', height: 112, borderRadius: RADII.medium, overflow: 'hidden',
                  border: `1px solid ${subj.color}28`, cursor: 'pointer', padding: 0,
                  background: GENERAL.neutral[1],
                  boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${subj.logo})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'saturate(0.75) brightness(0.72)',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(5,7,11,0.10) 0%, rgba(5,7,11,0.72) 58%, rgba(5,7,11,0.96) 100%)',
                  }} />
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

    // ── Landing ──
    const examWeekStats = (() => {
      try {
        const scores = JSON.parse(localStorage.getItem('gcse_scores') || '[]')
        const d = new Date(); d.setDate(d.getDate() - 7)
        const cutoff = d.toISOString().slice(0, 10)
        const week = scores.filter(s => s.source === 'exam' && s.date > cutoff)
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

        {/* ── Hero ── */}
        <div style={{ position: 'relative', width: '100%', height: '34vh', minHeight: 260, maxHeight: 340, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/headers/exam-summit.png)',
            backgroundSize: 'cover', backgroundPosition: 'center 30%',
            filter: 'saturate(0.9)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, rgba(13,15,16,0.5) 0%, rgba(13,15,16,0.1) 28%, rgba(13,15,16,0.25) 58%, ${GENERAL.neutral[0]} 100%)`,
          }} />

          {/* Top row — streak */}
          <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', right: SPACING.compact, zIndex: 2 }}>
            <StreakChip />
          </div>

          {/* Headline */}
          <div style={{ position: 'absolute', left: SPACING.compact, right: SPACING.compact, bottom: SPACING.standard, zIndex: 2 }}>
            <div style={{ ...TYPE.displayHero, fontSize: 46, color: GENERAL.softWhite }}>
              Exams<span style={{ color: GENERAL.teal }}>.</span>
            </div>
            <div style={{
              marginTop: 10, ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.teal,
            }}>
              Practise like it's the real thing.
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 430, margin: '0 auto', padding: `0 ${SPACING.compact}px` }}>

          {/* Section label */}
          <div style={{
            marginTop: SPACING.compact + 4, marginBottom: 10,
            ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.slate,
          }}>
            Choose your next step.
          </div>

          {/* Mode cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {EXAM_MODE_CARDS.map(card => (
              <button key={card.id} onClick={card.onClick} disabled={card.disabled} style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                padding: '14px 16px', cursor: card.disabled ? 'default' : 'pointer',
                borderRadius: RADII.large, background: GENERAL.neutral[1],
                border: '1px solid rgba(255,255,255,0.06)', borderLeft: `2px solid ${card.accent}`,
                opacity: card.disabled ? 0.55 : 1,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${card.accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {card.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    ...TYPE.eyebrow, textTransform: 'uppercase', color: card.accent, marginBottom: 4,
                  }}>
                    {card.kicker}
                  </div>
                  <div style={{ ...TYPE.displaySection, fontSize: 22, color: GENERAL.softWhite, marginBottom: 4 }}>
                    {card.title}
                  </div>
                  {card.lines.map((line, i) => (
                    <div key={i} style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>
                      {line}
                    </div>
                  ))}
                </div>
                {!card.disabled && (
                  <NavArrow color={card.accent} />
                )}
              </button>
            ))}
          </div>

          {/* Progress stat card */}
          {examWeekStats ? (
            <button onClick={onOpenPulse} style={{
              display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
              marginTop: SPACING.standard, padding: '14px 16px', cursor: 'pointer',
              borderRadius: RADII.large, background: GENERAL.neutral[1],
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: `conic-gradient(${GENERAL.teal} ${examWeekStats.avgPct}%, ${GENERAL.neutral[2]} 0)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: GENERAL.neutral[1],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  ...TYPE.eyebrow, color: GENERAL.softWhite,
                }}>
                  {examWeekStats.avgPct}%
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...TYPE.body, color: GENERAL.softWhite, marginBottom: 4 }}>
                  You've answered {examWeekStats.count} exam question{examWeekStats.count === 1 ? '' : 's'} this week.
                </div>
                <div style={{ ...TYPE.label, color: GENERAL.teal }}>
                  View your progress →
                </div>
              </div>
            </button>
          ) : (
            <div style={{
              marginTop: SPACING.standard, padding: '14px 16px',
              borderRadius: RADII.large, background: GENERAL.neutral[1],
              border: '1px solid rgba(255,255,255,0.06)',
              ...TYPE.body, color: GENERAL.slate,
            }}>
              Sit your first paper to start tracking progress.
            </div>
          )}

        </div>
      </div>
    )
  }

  if (mathsOpen)   return <MathsBrowser   onBack={() => setMathsOpen(false)} />
  if (englishOpen)   return <EnglishBrowser   onBack={() => setEnglishOpen(false)} />
  if (sociologyOpen)  return <SociologyBrowser  onBack={() => setSociologyOpen(false)} />
  if (chemistryOpen) return <ChemistryBrowser onBack={() => setChemistryOpen(false)} />

  function startTopic(selection) { setSelected(selection) }
  function exitTestTopic() { setSelected(null) }

  function startRandomQuestion() {
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

  if (selected) return <TopicPracticeMode key={selected.topicId} selected={selected} onExit={exitTestTopic} />

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>

      {/* ── Header — 60px ── */}
      <div style={{ height: 60, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div>
          <div style={{ ...TYPE.titleLarge, color: '#F4EFE6' }}>
            {isQuickFire ? '90s Quick Fire' : 'Practice Test'}
          </div>
        </div>
        <StreakChip />
      </div>

      <div style={{ padding: '8px 20px 0' }}>

        {/* ── QUICK FIRE CTA ── */}
        <button onClick={isQuickFire ? () => setQfSessionActive(true) : startRandomQuestion} style={{
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
            <div style={{ ...TYPE.displayCard, color: '#F4EFE6', marginBottom: 5 }}>
              {isQuickFire ? '90s Quick Fire' : 'Random Quick Fire'}
            </div>
            <div style={{ ...TYPE.label, color: '#65E6C6', marginBottom: 4 }}>
              {isQuickFire ? '90 seconds · Answer fast' : '90 seconds · All subjects · Mixed'}
            </div>
            <div style={{ ...TYPE.metadata, color: '#5A6A50' }}>
              Random questions from across your GCSE subjects — you never know what's coming.
            </div>
          </div>
          <div style={{ flexShrink: 0, background: 'linear-gradient(135deg, #3D7A5E, #65E6C6)', borderRadius: 18, padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', ...TYPE.displayCard, fontSize: 20, color: '#051209', whiteSpace: 'nowrap' }}>
            {isQuickFire ? 'Start ⚡' : 'Go →'}
          </div>
        </button>

        {/* ── SELECT A TOPIC label ── */}
        <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#7A7670', marginBottom: 14 }}>
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
                <div style={{ ...TYPE.titleMedium, color: '#F5F7FF', lineHeight: '18px' }}>{subj.label}</div>
              </div>
              {/* accent top-left dot */}
              <div style={{ position: 'absolute', top: 9, left: 9, width: 6, height: 6, borderRadius: '50%', background: subj.color, boxShadow: `0 0 8px ${subj.color}` }} />
            </button>
          ))}
        </div>

        {/* ── REAL EXAM PAPERS ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#4A5578', marginBottom: 12 }}>Real Exam Papers</div>

          {/* Edexcel History Paper 1 — June 2023 */}
          <button onClick={startMedicinePaper2023} style={{ width: '100%', boxSizing: 'border-box', background: '#0E1122', border: '1px solid rgba(200,155,109,0.22)', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left', marginBottom: 10 }}>
            <div style={{ width: 54, height: 54, borderRadius: 15, background: 'rgba(200,155,109,0.1)', border: '1px solid rgba(200,155,109,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C89B6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...TYPE.button, color: '#F0F3FA', lineHeight: 1.25, marginBottom: 3 }}>Edexcel History Paper 1 — June 2023</div>
              <div style={{ ...TYPE.metadata, color: '#C89B6D', marginBottom: 2 }}>1HI0/11 · 52 marks · 75 min timer</div>
              <div style={{ ...TYPE.metadata, color: '#4A5578' }}>Medicine in Britain & Western Front 1914–18</div>
            </div>
            <div style={{ background: 'rgba(200,155,109,0.15)', border: '1px solid rgba(200,155,109,0.3)', borderRadius: 8, padding: '5px 10px', flexShrink: 0 }}>
              <span style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#C89B6D' }}>Timed</span>
            </div>
          </button>

          {/* Generic timed practice */}
          <button onClick={() => startExamRound('Random', { isTimedPaper: true })} style={{ width: '100%', boxSizing: 'border-box', background: '#0E1628', border: '1px solid #1E2A40', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 54, height: 54, borderRadius: 15, background: 'rgba(59,130,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE.button, color: '#F0F3FA' }}>Timed mixed practice</div>
              <div style={{ ...TYPE.metadata, color: '#4A5578', marginTop: 3 }}>10 questions · 10 min timer · All subjects</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.05rem', flexShrink: 0 }}>›</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export { readQfBest }
export default TestTab
