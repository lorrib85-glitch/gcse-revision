import { GENERAL } from '../../../constants/generalTheme.js'
import { MOTION } from '../../../constants/motion.js'
import { TYPE } from '../../../constants/typography.js'

export default function CircularTimer({ seconds, totalSeconds }) {
  const size = 84
  const stroke = 4
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(1, totalSeconds ? seconds / totalSeconds : 0))
  const offset = circumference * (1 - pct)
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block', transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={GENERAL.teal} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition:`stroke-dashoffset ${MOTION.duration.standard} ${MOTION.easing.linear}` }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontFamily: TYPE.bodyText.fontFamily, fontWeight:700, fontSize:'1.05rem', color:GENERAL.softWhite, lineHeight:1 }}>{seconds}</span>
        <span style={{ fontFamily: TYPE.bodyText.fontFamily, fontWeight:600, fontSize:'.5rem', letterSpacing:'.16em', color:GENERAL.slate, marginTop:3 }}>SEC</span>
      </div>
    </div>
  )
}
