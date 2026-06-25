import { GENERAL } from '../constants/generalTheme.js'
import { hexToRgb } from '../constants/subjects.js'
import { TYPE } from '../constants/typography.js'

function NavIcon({ id, active }) {
  const c = active ? GENERAL.teal : `rgba(${hexToRgb(GENERAL.slate)},0.5)`
  const s = { stroke: c, fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const props = { width: 22, height: 22, viewBox: '0 0 22 22', style: { display: 'block', transition: 'stroke 220ms ease' } }
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

export default function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'home',     label: 'Home' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'pulse',    label: 'Pulse' },
    { id: 'exams',    label: 'Exams' },
  ]

  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0,
      width: '100%', zIndex: 1000,
      background: `rgba(${hexToRgb(GENERAL.neutral[0])},0.96)`,
      backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      padding: '10px 6px calc(10px + env(safe-area-inset-bottom))',
      gap: 4,
    }}>
      {tabs.map(t => {
        const active = tab === t.id || (t.id === 'pulse' && tab === 'quickfire')
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            border: 'none', background: 'transparent',
            cursor: 'pointer', borderRadius: 22,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontFamily: TYPE.bodyText.fontFamily, fontSize: 13, fontWeight: active ? 600 : 500,
            color: active ? GENERAL.teal : `rgba(${hexToRgb(GENERAL.slate)},0.5)`,
            padding: '6px 4px 5px', minWidth: 0,
            transition: 'color 220ms ease',
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
