import ContinueCTA from '../../core/ContinueCTA.jsx'
import { GENERAL } from '../../../constants/generalTheme.js'
import { SPACING } from '../../../constants/spacing.js'
import { TYPE } from '../../../constants/typography.js'

export default function FaceTheExaminerDone({ bg, accent, examiner, remarkResult, onAdvance }) {
  const finalMark = remarkResult?.marksAwarded ?? examiner.mark
  const improved = finalMark > examiner.mark
  const verdict = remarkResult?.verdict || examiner.completionMessage || examiner.summary

  return (
    <>
      <style>{`
        @keyframes fte-done-in {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fte-done-screen { animation: none !important; }
        }
      `}</style>
      <div
        className="fte-done-screen"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: bg,
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(28px, 8vh, 72px) 24px calc(20px + env(safe-area-inset-bottom, 0px))',
          animation: 'fte-done-in 500ms ease both',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
          <div style={{ ...TYPE.metadata, color: GENERAL.cinematic.textMuted, marginBottom: 20 }}>
            {improved
              ? (examiner.improvedCompletionLabel || 'You improved this answer')
              : (examiner.reviewedCompletionLabel || 'You reviewed this answer')}
          </div>

          <div style={{ ...TYPE.displayHero, fontSize: improved ? 52 : 60, color: accent }}>
            {improved ? (
              <>
                {examiner.mark}/{examiner.marks}
                <span aria-hidden="true" style={{ color: GENERAL.cinematic.textSubtle, margin: '0 12px', fontWeight: 300 }}>→</span>
                {finalMark}/{examiner.marks}
              </>
            ) : (
              <>{finalMark}/{examiner.marks}</>
            )}
          </div>

          {verdict && (
            <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary, marginTop: SPACING.standard, maxWidth: 440 }}>
              {verdict}
            </div>
          )}
        </div>

        <ContinueCTA
          accent={accent}
          label={examiner.doneCtaLabel || 'Continue'}
          onClick={onAdvance}
        />
      </div>
    </>
  )
}
