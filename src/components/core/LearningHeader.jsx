import LearningProgressHeader from './LearningProgressHeader.jsx'
import BackButton from './BackButton.jsx'
import ExitButton from './ExitButton.jsx'
import { SUBJECT_ACCENTS, hexToRgb } from '../../constants/subjects.js'

// ── LearningHeader — single-row chapter header ─────────────────────────────────
// Single row: [back] [stage rail] [exit]
// Stage rail shows the chapter's 6 navigation stages; each dot jumps to the start of that stage.
// Labels are hidden unless tapped.
// The rail is the only chapter-contents navigation. There is deliberately no
// numeric n/total counter here — progression is shown as position on the rail,
// never as a count.
// Props: chapter, currentStage, stageNavigation, currentScreen, onStageJump,
//        onBack, onExit, visible
export default function LearningHeader({
  chapter,
  currentStage = 'Discover',
  stageNavigation = null,
  currentScreen = 0,
  onStageJump = null,
  onBack,
  onExit,
  visible = true,
}) {
  const activeChapter = chapter
  const subject = activeChapter?.subject || 'History'
  const accent = SUBJECT_ACCENTS[subject] || SUBJECT_ACCENTS.History
  const accentRgb = hexToRgb(accent)

  return (
    <div style={{
      position: 'fixed',
      top: 'calc(10px + env(safe-area-inset-top, 0px))',
      left: 16, right: 16,
      background: 'rgba(7,10,18,0.70)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 22,
      zIndex: 1001,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-10px)',
      transition: visible
        ? 'opacity 700ms ease-out, transform 700ms ease-out'
        : 'none',
      pointerEvents: visible ? 'auto' : 'none',
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px',
    }}>

      {/* Back button */}
      <BackButton onClick={onBack} />

      {/* Stage rail */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <LearningProgressHeader
          currentStage={currentStage}
          stageNavigation={stageNavigation}
          currentScreen={currentScreen}
          onStageJump={onStageJump}
          accent={accent}
          accentRgb={accentRgb}
        />
      </div>

      {/* Exit button */}
      <ExitButton onClick={onExit} />
    </div>
  )
}
