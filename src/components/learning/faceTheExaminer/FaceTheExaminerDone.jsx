import { GENERAL } from '../../../constants/generalTheme.js'
import { SPACING } from '../../../constants/spacing.js'
import { TYPE } from '../../../constants/typography.js'

export default function FaceTheExaminerDone({ bg, accent, examiner, remarkResult, onAdvance }) {
  const finalMark = remarkResult?.marksAwarded ?? examiner.mark
  const improved = finalMark > examiner.mark

  return (
    <>
      <style>{`
        @keyframes fte-done-in {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fte-done-cta {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        role="button"
        tabIndex={0}
        onClick={onAdvance}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onAdvance?.()
          }
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '0 32px',
          animation: 'fte-done-in 600ms ease both',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <div style={{ ...TYPE.metadata, color: GENERAL.cinematic.textMuted, marginBottom: 20 }}>
          {improved ? 'You pushed this answer' : 'You reviewed this answer'}
        </div>
        <div style={{ ...TYPE.displayHero, fontSize: improved ? 52 : 60, color: accent }}>
          {improved ? (
            <>
              {examiner.mark}/{examiner.marks}
              <span style={{ color: GENERAL.cinematic.textSubtle, margin: '0 12px', fontWeight: 300 }}>→</span>
              {finalMark}/{examiner.marks}
            </>
          ) : (
            <>{examiner.mark}/{examiner.marks}</>
          )}
        </div>
        {remarkResult?.delta === 0 && (
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, marginTop: SPACING.compact, textAlign: 'center' }}>
            {remarkResult.verdict}
          </div>
        )}
        <div style={{ ...TYPE.metadata, position: 'absolute', bottom: 'calc(40px + env(safe-area-inset-bottom, 0px))', color: accent, animation: 'fte-done-cta 600ms ease 2s both' }}>
          Tap to continue
        </div>
      </div>
    </>
  )
}
