import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'

export function ExamPaperMarking({ paper, progress }) {
  const { current, total } = progress
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  const accent = paper.color || GENERAL.teal

  return (
    <div style={{
      minHeight: '100vh',
      background: GENERAL.neutral[0],
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: `0 ${SPACING.standard}px`,
    }}>
      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: `${accent}18`, border: `2px solid ${accent}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.standard,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      </div>

      {/* Heading */}
      <div style={{
        ...TYPE.cinematic, fontSize: 22, color: GENERAL.softWhite,
        textAlign: 'center', marginBottom: 8,
      }}>
        Marking your paper
      </div>

      {/* Status */}
      <div style={{
        fontFamily: TYPE.bodyText.fontFamily, fontSize: 14, color: GENERAL.slate,
        textAlign: 'center', marginBottom: SPACING.standard,
      }}>
        {current > 0
          ? `Question ${current} of ${total}…`
          : 'Preparing…'}
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%', maxWidth: 280,
        height: 4, borderRadius: RADII.pill,
        background: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: accent,
          borderRadius: RADII.pill,
          transition: 'width 0.4s ease',
        }} />
      </div>

      <div style={{
        fontFamily: TYPE.bodyText.fontFamily, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.12em', color: GENERAL.slate,
        textAlign: 'center', marginTop: 10,
      }}>
        {pct}%
      </div>
    </div>
  )
}
