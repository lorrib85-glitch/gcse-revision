import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'

export default function ScreenShell({
  children,
  subject,
  background,
  backgroundImage,
  backgroundPosition = 'center',
  backgroundOpacity = 0.13,
  backgroundFilter,
  overlay = true,
  scroll = true,
  centreContent = false,
  className,
  style,
}) {
  const theme = subject ? (SUBJECTS[subject] || null) : null
  const bg = background || theme?.background || '#08090D'
  const overlayColor = overlay ? (theme?.overlay || 'rgba(0,0,0,0.58)') : null

  return (
    <div style={{ position: 'fixed', inset: 0, background: bg, overflow: 'hidden', ...style }}
      className={className}>

      {backgroundImage && (
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition,
          opacity: backgroundOpacity,
          ...(backgroundFilter ? { filter: backgroundFilter } : {}),
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      )}

      {overlayColor && (
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0,
          background: overlayColor,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      )}

      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        maxWidth: 420,
        margin: '0 auto',
        paddingTop: 'max(18px, env(safe-area-inset-top))',
        paddingBottom: 'max(34px, env(safe-area-inset-bottom))',
        paddingLeft: SPACING.standard,
        paddingRight: SPACING.standard,
        display: 'flex', flexDirection: 'column',
        overflow: scroll ? 'auto' : 'hidden',
        ...(centreContent ? { alignItems: 'center', justifyContent: 'center' } : {}),
      }}>
        {children}
      </div>
    </div>
  )
}
