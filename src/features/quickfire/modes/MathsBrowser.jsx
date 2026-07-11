import { useState } from 'react'
import { TYPE } from '../../../constants/typography.js'
import BackButton from '../../../components/core/BackButton.jsx'
import { useTestData } from '../useTestData.js'
import { MathsTopicView } from './MathsTopicView.jsx'
import { FormulaSheet } from '../components/FormulaSheet.jsx'

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

export function MathsBrowser({ onBack }) {
  const { MATHS_TOPIC_GROUPS } = useTestData() || {}
  const [activeGroup, setGroup] = useState(null)
  const [fmOpen, setFm]         = useState(false)
  const [filter, setFilter]     = useState('all')

  if (activeGroup) return <MathsTopicView group={activeGroup} onBack={() => setGroup(null)} />

  const totalQs = MATHS_TOPIC_GROUPS.reduce((s,g) => s + g.questions.length, 0)
  const filtered = filter === 'all' ? MATHS_TOPIC_GROUPS
    : filter === 'calc' ? MATHS_TOPIC_GROUPS.filter(g => g.calculator)
    : MATHS_TOPIC_GROUPS.filter(g => !g.calculator)

  return (
    <div style={{ background:'#08090D', minHeight:'100vh', paddingBottom:90 }}>
      {fmOpen && <FormulaSheet onClose={() => setFm(false)} />}

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
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {[
            { id:'all',      label:`All (${totalQs})` },
            { id:'noncalc',  label:'✏️ No Calculator' },
            { id:'calc',     label:'🖩 Calculator allowed' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(59,130,255,.15)':'#151720', border:`1px solid ${filter===f.id?'#3B82FF':'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'9px 6px', ...TYPE.label, fontSize:'.75rem', color:filter===f.id?'#70B8FF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

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
