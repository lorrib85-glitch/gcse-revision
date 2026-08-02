import { BUTTONS } from '../../../constants/buttons.js'
import ContinueCTA from '../../core/ContinueCTA.jsx'

// ChapterPlayer private family — NOT an authorable chapter component.
//
// The fixed bottom shell of a chapter's normal content layout: blurred backdrop,
// safe-area padding, 420px inner column, and the governed ContinueCTA (the only
// Primary Progression CTA allowed anywhere in the app).
//
// It is presentation only. Whether a Continue button should appear at all, what
// it says, and whether this is the finishing screen are decided by ChapterPlayer
// — this component never inspects the chapter, its screens, or lifecycle state,
// and never calls screenHasComponentOwnedContinuation(). When a screen's own
// component owns progression (`visible: false`), the shell still reserves the
// CTA's height so the layout does not jump between screens.
export default function ChapterBottomNavigation({ visible, label, isFinish, subjectAccent, onContinue }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
      background: 'rgba(8,9,13,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
    }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        {visible ? (
          <ContinueCTA
            onClick={onContinue}
            label={label}
            accent={isFinish
              ? 'linear-gradient(135deg, #1A4D2E, #38D27A)'
              : subjectAccent}
            textColor={isFinish ? '#fff' : '#0D0F14'}
            style={isFinish ? { boxShadow: '0 4px 16px rgba(56,210,122,.35)' } : undefined}
          />
        ) : (
          <div style={{ height: BUTTONS.continue.height }} />
        )}
      </div>
    </div>
  )
}
