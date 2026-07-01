import { useState } from 'react'
import { TYPE } from '../../../constants/typography.js'
import { GENERAL } from '../../../constants/generalTheme.js'
import { hexToRgb } from '../../../constants/subjects.js'
import { recordScore } from '../../../progress.js'
import { FIGURES } from '../../../figures.js'
import { QUESTION_BANKS_BY_MODULE } from '../../../data/questionBanks/questionRegistry.js'
import BackButton from '../../../components/core/BackButton.jsx'
import ContinueCTA from '../../../components/core/ContinueCTA.jsx'
import { gradeWithAI, cleanQuestionText } from '../utils.js'

const PULSE_GOLD = '#D2A24C'

const GRADE_STYLE = {
  'Excellent':  { bg:`rgba(${GENERAL.tealRgb},.10)`,  border:`rgba(${GENERAL.tealRgb},.35)`,  text:GENERAL.teal,  badge:GENERAL.teal },
  'Good':       { bg:`rgba(${GENERAL.tealRgb},.06)`,  border:`rgba(${GENERAL.tealRgb},.22)`,  text:GENERAL.teal,  badge:GENERAL.teal },
  'Developing': { bg:`rgba(${hexToRgb(PULSE_GOLD)},.08)`, border:`rgba(${hexToRgb(PULSE_GOLD)},.3)`, text:PULSE_GOLD, badge:PULSE_GOLD },
  'Needs Work': { bg:`rgba(${GENERAL.coralRgb},.08)`, border:`rgba(${GENERAL.coralRgb},.3)`,  text:GENERAL.coral, badge:GENERAL.coral },
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

export function TopicPracticeMode({ selected, onExit }) {
  const [qIdx, setQIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [showTip, setTip] = useState(false)
  const [grading, setGrading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)
  const [tqMcAttempts, setTqMcAttempts] = useState(0)
  const [tqMcHint, setTqMcHint] = useState(false)
  const [tqMcLocked, setTqMcLocked] = useState(false)

  const questions = QUESTION_BANKS_BY_MODULE[selected.topicId] || []
  const q = questions[qIdx]
  const gs = feedback ? (GRADE_STYLE[feedback.grade] || GRADE_STYLE['Developing']) : null
  const isMC = q?.type === 'mc'

  function resetQ() { setAnswer(''); setTip(false); setFeedback(null); setError(null); setGrading(false) }
  function fullResetQ() { resetQ(); setTqMcAttempts(0); setTqMcHint(false); setTqMcLocked(false) }

  function tqNextQuestion() {
    if (qIdx < questions.length - 1) { setQIdx(qIdx + 1); fullResetQ() }
    else { onExit() }
  }

  async function gradeAnswer() {
    if (answer.trim().length < 3) { setError('Write a bit more before submitting.'); return }
    setGrading(true); setError(null)
    try {
      const d = await gradeWithAI(q.q, answer, q.marks, q.ms)
      setFeedback(d)
    } catch { setError('Could not grade right now. Check your connection.') }
    finally { setGrading(false) }
  }

  function handleTqCheck() {
    if (q.type === 'mc') {
      if (!answer) { setError('Pick an option first.'); return }
      const isCorrect = answer === q.options[q.correct]
      const newAttempts = tqMcAttempts + 1
      setTqMcAttempts(newAttempts)
      if (isCorrect) {
        setTqMcLocked(true)
        setFeedback({ marksAwarded: q.marks, marksAvailable: q.marks, grade: 'Excellent',
          summary: "That's the one. Well done for getting it.", achieved: ['Correct answer selected'], missed: [], examinerTip: '' })
        recordScore({ subject: selected.subject, earned: q.marks, possible: q.marks, source: 'test' })
      } else if (newAttempts === 1) {
        setTqMcHint(true)
        setAnswer('')
        setError('')
      } else {
        setTqMcLocked(true)
        const correctText = q.options[q.correct] || ''
        setFeedback({ marksAwarded: 0, marksAvailable: q.marks, grade: 'Needs Work',
          summary: 'The correct answer was: ' + correctText + '. Read the explanation below and it will stick next time.',
          achieved: [], missed: [q.ms || ''], examinerTip: "Go back to this topic — one question doesn't define you." })
        recordScore({ subject: selected.subject, earned: 0, possible: q.marks, source: 'test' })
      }
      return
    }
    gradeAnswer()
  }

  return (
    <div style={{ background:GENERAL.neutral[0], minHeight:'100vh', paddingBottom:90 }}>
      <div style={{ background:`rgba(${hexToRgb(GENERAL.neutral[0])},0.96)`, borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'12px 16px', position:'sticky', top:0, zIndex:10, backdropFilter:'blur(12px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, maxWidth:660, margin:'0 auto' }}>
          <BackButton onClick={onExit} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ ...TYPE.titleMedium, color:GENERAL.softWhite, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selected.label}</div>
            <div style={{ ...TYPE.caption, color:GENERAL.slate }}>Question {qIdx+1} of {questions.length}</div>
          </div>
        </div>
        <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden', marginTop:10, maxWidth:660, margin:'10px auto 0' }}>
          <div style={{ height:'100%', width:`${((qIdx+1)/questions.length)*100}%`, background:'rgba(241,250,238,0.30)', borderRadius:99, transition:'width .3s' }} />
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {q && <>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:`rgba(${GENERAL.tealRgb},.10)`, border:`1px solid rgba(${GENERAL.tealRgb},.25)`, borderRadius:99, padding:'4px 12px', marginBottom:14 }}>
            <span style={{ ...TYPE.label, color:GENERAL.teal }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
          </div>
          {q.fig && FIGURES[q.fig] && (
            <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px', marginBottom:14, textAlign:'center' }}>
              <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:GENERAL.slate, marginBottom:8 }}>Figure — from AQA past paper</div>
              <img src={FIGURES[q.fig]} alt="AQA exam figure" style={{ maxWidth:'100%', height:'auto', borderRadius:8 }} />
            </div>
          )}
          <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'16px', marginBottom:14 }}>
            <pre style={{ ...TYPE.body, margin:0, color:GENERAL.softWhite, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
          </div>
          {!showTip
            ? <button onClick={() => setTip(true)} style={{ background:'none', border:`1px dashed ${GENERAL.coral}`, borderRadius:10, padding:'9px 14px', cursor:'pointer', color:GENERAL.coral, ...TYPE.label, width:'100%', marginBottom:14 }}>Show mark tip</button>
            : <div style={{ background:`rgba(${GENERAL.tealRgb},.06)`, border:`1px solid rgba(${GENERAL.tealRgb},.2)`, borderRadius:10, padding:'11px 14px', marginBottom:14 }}>
                <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:GENERAL.teal, marginBottom:5 }}>{q.marks}-mark question</div>
                <p style={{ ...TYPE.body, margin:0, fontSize:'.85rem', color:GENERAL.slate }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
              </div>
          }
          {!feedback && !tqMcLocked && (
            isMC
              ? <div style={{ marginBottom:14 }}>
                  {tqMcHint && (
                    <div style={{ background:`rgba(${GENERAL.tealRgb},.06)`, border:`1px solid rgba(${GENERAL.tealRgb},.28)`, borderRadius:14, padding:'14px 16px', marginBottom:12 }}>
                      <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:GENERAL.teal, marginBottom:8 }}>Have another look</div>
                      <p style={{ ...TYPE.body, fontSize:'.88rem', color:GENERAL.slate, margin:'0 0 4px' }}>
                        {q.hint || (q.ms ? q.ms.split('.')[0] + '.' : 'Think carefully — what is the question specifically asking about?')}
                      </p>
                      <p style={{ ...TYPE.caption, color:GENERAL.teal, margin:0, fontStyle:'italic' }}>
                        You have one more try — you can get this.
                      </p>
                    </div>
                  )}
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {q.options.map((opt,i) => (
                      <button key={i} onClick={() => setAnswer(opt)} style={{ background:answer===opt?`rgba(${GENERAL.tealRgb},.10)`:GENERAL.neutral[1], border:`1.5px solid ${answer===opt?GENERAL.teal:'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'13px 16px', cursor:'pointer', textAlign:'left', ...TYPE.body, fontSize:'.93rem', color:answer===opt?GENERAL.teal:GENERAL.softWhite, transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ width:22, height:22, borderRadius:'50%', border:`1.5px solid ${answer===opt?GENERAL.teal:'rgba(255,255,255,0.12)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.72rem', fontWeight:700, color:answer===opt?GENERAL.teal:GENERAL.slate, background:answer===opt?`rgba(${GENERAL.tealRgb},.10)`:'transparent' }}>{String.fromCharCode(65+i)}</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              : <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'14px', marginBottom:14 }}>
                  <div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:GENERAL.slate, marginBottom:8 }}>Your answer</div>
                  <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Write your answer here…" style={{ width:'100%', border:'none', background:'transparent', resize:'none', ...TYPE.body, color:GENERAL.softWhite, outline:'none', minHeight:q.marks>=6?180:q.marks>=3?120:80 }} />
                </div>
          )}
          {error && <div style={{ background:`rgba(${GENERAL.coralRgb},.08)`, border:`1px solid rgba(${GENERAL.coralRgb},.3)`, borderRadius:10, padding:'11px 14px', marginBottom:14 }}><p style={{ ...TYPE.body, margin:0, fontSize:'.86rem', color:GENERAL.coral }}>{error}</p></div>}
          {feedback && gs && (
            <div className="fade-up">
              <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:16, padding:'18px', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <div style={{ ...TYPE.displayHero, fontSize:'1.8rem', color:gs.text }}>{feedback.marksAwarded}<span style={{ fontSize:'1rem', opacity:.6 }}>/{feedback.marksAvailable}</span></div>
                  <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', ...TYPE.label }}>{feedback.grade}</div>
                </div>
                <p style={{ ...TYPE.body, color:gs.text, margin:0, opacity:.85 }}>{feedback.summary}</p>
              </div>
              {feedback.achieved?.length > 0 && feedback.achieved[0] !== 'Correct answer selected' && <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:GENERAL.teal, marginBottom:8 }}>✓ What you got right</div>{feedback.achieved.map((a,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:GENERAL.teal, flexShrink:0 }}>✓</span><p style={{ margin:0, ...TYPE.body, fontSize:'.87rem', color:GENERAL.slate }}>{a}</p></div>)}</div>}
              {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && feedback.missed[0] !== '' && <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:GENERAL.slate, marginBottom:8 }}>→ Worth knowing</div>{feedback.missed.map((m,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:GENERAL.slate, flexShrink:0 }}>→</span><p style={{ margin:0, ...TYPE.body, fontSize:'.87rem', color:GENERAL.slate }}>{m}</p></div>)}</div>}
              {feedback.examinerTip && feedback.examinerTip !== '' && <div style={{ background:`rgba(${GENERAL.tealRgb},.06)`, border:`1px solid rgba(${GENERAL.tealRgb},.2)`, borderRadius:12, padding:'13px 14px', marginBottom:14 }}><div style={{ ...TYPE.eyebrow, textTransform:'uppercase', color:GENERAL.teal, marginBottom:6 }}>Examiner tip</div><p style={{ margin:0, ...TYPE.body, fontSize:'.87rem', color:GENERAL.slate }}>{feedback.examinerTip}</p></div>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <button onClick={fullResetQ} style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.10)', borderRadius:12, padding:'13px', ...TYPE.button, fontSize:'.88rem', cursor:'pointer', color:GENERAL.slate }}>↩ Try again</button>
                <ContinueCTA onClick={tqNextQuestion} label={qIdx<questions.length-1?'Next →':'Finish ✓'} accent={GENERAL.teal} textColor={GENERAL.neutral[0]} />
              </div>
            </div>
          )}
          {!feedback && !tqMcLocked && (
            <button onClick={handleTqCheck} disabled={grading || (isMC && !answer)}
              style={{ width:'100%', background:grading?'rgba(255,255,255,0.08)':GENERAL.teal, color:grading?GENERAL.slate:GENERAL.neutral[0], border:'none', borderRadius:12, padding:'15px', ...TYPE.buttonLarge, cursor:(grading||(isMC&&!answer))?'default':'pointer', marginTop:4, opacity:(isMC&&!answer)?0.4:1 }}>
              {grading ? 'Marking…' : tqMcHint ? 'Check again — you can do this →' : 'Check my answer →'}
            </button>
          )}
        </>}
      </div>
    </div>
  )
}
