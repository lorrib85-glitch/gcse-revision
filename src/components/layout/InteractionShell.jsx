import { SPACING } from '../../constants/spacing.js'
import { SUBJECTS } from '../../constants/subjects.js'

export default function InteractionShell({
  subject,
  backgroundImage = null,
  backgroundOpacity = 0.13,
  backgroundPosition = 'center',
  children,
}) {
  const theme = SUBJECTS[subject] || SUBJECTS.History

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      background: theme.background,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {backgroundImage && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition,
          opacity: backgroundOpacity,
        }} />
      )}
      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        // overflow: hidden — interaction surfaces manage their own scroll/layout
        overflow: 'hidden',
        maxWidth: 420,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        // 80px clears the fixed LearningHeader (~44px tall at 10px top + 16px gap below)
        paddingTop: 'calc(80px + env(safe-area-inset-top, 0px))',
        paddingLeft: SPACING.compact,
        paddingRight: SPACING.compact,
        // No large bottom padding — interaction surface manages its own spacing;
        // ModulePlayer CTA bar is fixed on top. Safe-area only to avoid system chrome.
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        {children}
      </div>
    </div>
  )
}
