import { useState } from 'react'
import { TYPE }     from '../../constants/typography.js'
import { GENERAL }  from '../../constants/generalTheme.js'
import { SOCIOLOGY_GROUPS } from '../../data/sociologyGroups.js'
import { CHEM_IMAGES } from '../../data/chemImages.js'
import { recordScore } from '../../progress.js'
import { StreakChip } from '../home/StreakChip.jsx'
import BackButton from '../../components/core/BackButton.jsx'
import ContinueCTA from '../../components/core/ContinueCTA.jsx'
import { QuickFireMode, readQfBest } from './modes/QuickFireMode.jsx'
import { TopicPracticeMode } from './modes/TopicPracticeMode.jsx'
import { gradeWithAI, GRADE_COLOURS } from './utils.js'
import { useTestData } from './testDataContext.jsx'
import { MathsBrowser } from './modes/MathsBrowser.jsx'
import { MathsQuestion } from './modes/MathsQuestion.jsx'
import { ExamMode, TEST_TOPICS } from './modes/ExamMode.jsx'

export { TestDataProvider } from './testDataContext.jsx'

// NOTE: Past paper question banks have been extracted to
// src/data/questionBanks/ and are now accessed via QUESTION_BANKS_BY_MODULE.
// PAST_PAPER_QS has been removed — use QUESTION_BANKS_BY_MODULE[topicId] instead.

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
        {error && <div style={{ background: 'rgba(255,93,115,.08)', border: '1px solid rgba(255,93,115,.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}><p style={{ ...TYPE.body, margin: 0, fontSize: '.86rem', color: GENERAL.error }}>{error}</p></div>}

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
            {feedback.achieved?.length > 0 && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.success, marginBottom: 10 }}>✓ What you got right</div>{feedback.achieved.map((a,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: GENERAL.success, flexShrink: 0 }}>✓</span><p style={{ margin: 0, ...TYPE.body, fontSize: '.88rem', color: '#C8D0E8' }}>{a}</p></div>)}</div>}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: GENERAL.error, marginBottom: 10 }}>→ Next time, also include</div>{feedback.missed.map((m,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: GENERAL.error, flexShrink: 0 }}>→</span><p style={{ margin: 0, ...TYPE.body, fontSize: '.88rem', color: '#C8D0E8' }}>{m}</p></div>)}</div>}
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
  const [mathsOpen,     setMathsOpen]     = useState(false)
  const [englishOpen,   setEnglishOpen]   = useState(false)
  const [sociologyOpen, setSociologyOpen] = useState(false)
  const [chemistryOpen, setChemistryOpen] = useState(false)
  const [selected,      setSelected]      = useState(null)
  const [qfSessionActive, setQfSessionActive] = useState(() => mode === 'quickfire' && autoStart)

  const isQuickFire = mode === 'quickfire'
  const isExamMode  = mode === 'exam'

  if (isExamMode) {
    return (
      <ExamMode
        mode={mode}
        onExit={onExit}
        onOpenModule={onOpenModule}
        onOpenPulse={onOpenPulse}
        examAutoStart={examAutoStart}
        clearExamAutoStart={clearExamAutoStart}
      />
    )
  }

  if (isQuickFire && qfSessionActive) {
    return <QuickFireMode onExit={() => setQfSessionActive(false)} />
  }

  if (mathsOpen)     return <MathsBrowser   onBack={() => setMathsOpen(false)} />
  if (englishOpen)   return <EnglishBrowser onBack={() => setEnglishOpen(false)} />
  if (sociologyOpen) return <SociologyBrowser onBack={() => setSociologyOpen(false)} />
  if (chemistryOpen) return <ChemistryBrowser onBack={() => setChemistryOpen(false)} />

  function startTopic(selection) { setSelected(selection) }
  function exitTestTopic() { setSelected(null) }

  function startRandomQuestion() {
    const allT = TEST_TOPICS.filter(s => s.topics.some(t => t.available))
    const rs = allT[Math.floor(Math.random() * allT.length)]
    const av = rs.topics.filter(t => t.available)
    const rt = av[Math.floor(Math.random() * av.length)]
    startTopic({ topicId: rt.id, label: rt.label, subject: rs.subject })
  }

  if (selected) return <TopicPracticeMode key={selected.topicId} selected={selected} onExit={exitTestTopic} />

  const EXAM_SUBJECTS = [
    { logo: '/headers/sociology-main.webp', label: 'Sociology', color: '#FF5C7A', completed: 7,  total: 10, action: () => setSociologyOpen(true) },
    { logo: '/headers/history-main.webp',   label: 'History',   color: '#C89B6D', completed: 6,  total: 12, action: () => startTopic({ topicId: 'medieval', label: 'History', subject: 'History' }) },
    { logo: '/headers/bio-main.webp',       label: 'Biology',   color: '#4F8A5B', completed: 1,  total: 7,  action: () => startTopic({ topicId: 'tb_cells', label: 'Biology', subject: 'Biology' }) },
    { logo: '/headers/chem-logo.webp',      label: 'Chemistry', color: '#9B59E8', completed: 0,  total: 15, action: () => setChemistryOpen(true) },
    { logo: '/headers/maths-main.webp',     label: 'Maths',     color: '#2DD4BF', completed: 0,  total: 20, action: () => setMathsOpen(true) },
    { logo: '/headers/english-main.webp',   label: 'English',   color: '#B66DFF', completed: 0,  total: 15, action: () => setEnglishOpen(true) },
    { logo: '/headers/physics-main.webp',   label: 'Physics',   color: '#3B82F6', completed: 0,  total: 15, action: () => {} },
  ]

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

        {/* ── REAL EXAM PAPERS — available via the Exam tab ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#4A5578', marginBottom: 12 }}>Real Exam Papers</div>

          <button onClick={() => {}} style={{ width: '100%', boxSizing: 'border-box', background: '#0E1122', border: '1px solid rgba(200,155,109,0.22)', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left', marginBottom: 10 }}>
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

          <button onClick={() => {}} style={{ width: '100%', boxSizing: 'border-box', background: '#0E1628', border: '1px solid #1E2A40', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left' }}>
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
