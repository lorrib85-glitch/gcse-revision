import { TYPE } from '../../../constants/typography.js'
import { useTestData } from '../testDataContext.jsx'

export function FormulaSheet({ onClose }) {
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
