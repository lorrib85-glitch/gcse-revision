import { useEffect, useMemo, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE, HEADING_LAYOUT } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

const R_SIZE = 96
const R_STROKE = 7
const R_RADIUS = R_SIZE / 2 - R_STROKE / 2
const R_CIRC = 2 * Math.PI * R_RADIUS

function hexToRgb(hex) {
  const value = parseInt(hex.replace('#', ''), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function rgb(hex) {
  return hexToRgb(hex).join(',')
}

function isLight(hex) {
  const [red, green, blue] = hexToRgb(hex)
  return (0.299 * red + 0.587 * green + 0.114 * blue) / 255 > 0.55
}

function Particles({ accent }) {
  const points = useMemo(() => Array.from({ length: 7 }, (_, index) => ({
    id: index,
    x: 8 + Math.random() * 84,
    y: 8 + Math.random() * 76,
    size: 1 + Math.random() * 0.8,
    opacity: 0.12 + Math.random() * 0.14,
    duration: 16 + Math.random() * 6,
    delay: -(Math.random() * 18),
  })), [])

  return (
    <>
      {points.map(point => (
        <div
          key={point.id}
          className="ccs-particle"
          style={{
            position: 'absolute',
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: point.size,
            height: point.size,
            borderRadius: RADII.pill,
            background: accent,
            opacity: point.opacity,
            pointerEvents: 'none',
            zIndex: 0,
            animation: `ccs-drift ${point.duration}s ${MOTION.easing.standard} ${point.delay}s infinite`,
          }}
        />
      ))}
    </>
  )
}

export default function ChapterCompleteScreen({
  accent = SUBJECTS.History.accent,
  completedChapter = 'Chapter',
  nextChapterNum,
  nextChapterTitle,
  nextChapterLabel = 'Chapter',
  supportingCopy = 'Momentum matters.',
  isFinalChapter = false,
  pastPaperLabel,
  quizQuestionCount = 10,
  showQuiz = true,
  onContinue,
  onQuiz,
  onPastPaper,
  onHome,
}) {
  const accentRgb = rgb(accent)
  const textOnAccent = isLight(accent)
    ? GENERAL.textOnAccent
    : GENERAL.cinematic.textPrimary
  const strokeRef = useRef(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      if (strokeRef.current) strokeRef.current.style.strokeDashoffset = '0'
      return undefined
    }

    const timer = setTimeout(() => {
      if (!strokeRef.current) return
      strokeRef.current.style.transition = `stroke-dashoffset ${GENERAL.cinematic.motion.slow} ${MOTION.easing.standard}`
      strokeRef.current.style.strokeDashoffset = '0'
    }, GENERAL.cinematic.motion.hintDelayMs)

    return () => clearTimeout(timer)
  }, [])

  const completionLabel = isFinalChapter
    ? 'Subject complete'
    : nextChapterLabel === 'Next Module'
      ? 'Module complete'
      : 'Chapter complete'

  const continueLabel = isFinalChapter
    ? 'Finish'
    : nextChapterNum != null
      ? `Start ${nextChapterLabel.toLowerCase()} ${nextChapterNum}`
      : `Start ${nextChapterLabel.toLowerCase()}`

  const baseButton = {
    border: 'none',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  }

  return (
    <>
      <style>{`
        @keyframes ccs-drift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        @keyframes ccs-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ccs-check {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.72); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .ccs-in {
          animation: ccs-in ${MOTION.duration.slow} ${MOTION.easing.standard} both;
        }
        .ccs-checkmark {
          animation: ccs-check ${MOTION.duration.standard} ${MOTION.easing.standard} 520ms both;
        }
        .ccs-secondary:active {
          transform: scale(${MOTION.scale.press});
          background: ${GENERAL.line.faint} !important;
        }
        .ccs-home-row:active {
          opacity: 0.48 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .ccs-in,
          .ccs-checkmark,
          .ccs-particle {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .ccs-checkmark {
            transform: translate(-50%, -50%) !important;
          }
        }
      `}</style>

      <main style={{
        minHeight: '100dvh',
        background: GENERAL.backgroundApp,
        color: GENERAL.cinematic.textPrimary,
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}>
        <div style={{
          position: 'absolute',
          top: -SPACING.separation,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 320,
          height: 320,
          background: `radial-gradient(circle, rgba(${accentRgb},0.10) 0%, transparent 72%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <Particles accent={accent} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 430,
          minHeight: '100dvh',
          margin: '0 auto',
          padding: `calc(env(safe-area-inset-top, 0px) + ${SPACING.cinematic}px) ${SPACING.standard}px calc(env(safe-area-inset-bottom, 0px) + ${SPACING.standard}px)`,
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1,
        }}>
          <div
            className="ccs-in"
            style={{
              width: R_SIZE,
              height: R_SIZE,
              position: 'relative',
              marginBottom: SPACING.standard,
              flexShrink: 0,
              animationDelay: '0ms',
            }}
          >
            <svg
              width={R_SIZE}
              height={R_SIZE}
              viewBox={`0 0 ${R_SIZE} ${R_SIZE}`}
              aria-hidden="true"
              style={{ transform: 'rotate(-90deg)', display: 'block' }}
            >
              <circle
                cx={R_SIZE / 2}
                cy={R_SIZE / 2}
                r={R_RADIUS}
                fill="none"
                stroke={GENERAL.line.medium}
                strokeWidth={R_STROKE}
              />
              <circle
                ref={strokeRef}
                cx={R_SIZE / 2}
                cy={R_SIZE / 2}
                r={R_RADIUS}
                fill="none"
                stroke={accent}
                strokeWidth={R_STROKE}
                strokeLinecap="round"
                strokeDasharray={R_CIRC}
                strokeDashoffset={R_CIRC}
                style={{ filter: `drop-shadow(0 0 12px rgba(${accentRgb},0.24))` }}
              />
            </svg>
            <div
              className="ccs-checkmark"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(0.72)',
                opacity: 0,
              }}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 36 36"
                fill="none"
                stroke={GENERAL.cinematic.textPrimary}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 18l7 7 13-13" />
              </svg>
            </div>
          </div>

          <p
            className="ccs-in"
            style={{
              ...TYPE.label,
              color: accent,
              textAlign: 'center',
              margin: `0 0 ${SPACING.micro}px`,
              animationDelay: '40ms',
            }}
          >
            {completionLabel}
          </p>

          <h1
            className="ccs-in"
            style={{
              ...TYPE.displayScreen,
              ...HEADING_LAYOUT.screenTitle,
              color: GENERAL.cinematic.textPrimary,
              textAlign: 'center',
              margin: `0 0 ${SPACING.micro}px`,
              animationDelay: '70ms',
            }}
          >
            {completedChapter}
          </h1>

          <p
            className="ccs-in"
            style={{
              ...TYPE.bodyStrong,
              color: GENERAL.cinematic.textSecondary,
              textAlign: 'center',
              margin: `0 0 ${SPACING.standard}px`,
              maxWidth: 300,
              animationDelay: '100ms',
            }}
          >
            {supportingCopy}
          </p>

          <section
            className="ccs-in"
            aria-label="Next step"
            style={{
              width: '100%',
              maxWidth: 360,
              animationDelay: '140ms',
            }}
          >
            {!isFinalChapter && nextChapterTitle && (
              <div style={{ textAlign: 'center', marginBottom: SPACING.compact }}>
                <div style={{
                  ...TYPE.label,
                  color: GENERAL.cinematic.textMuted,
                  marginBottom: SPACING.micro,
                }}>
                  Up next
                </div>
                <div style={{
                  ...TYPE.displayCard,
                  color: GENERAL.cinematic.textPrimary,
                }}>
                  {nextChapterTitle}
                </div>
              </div>
            )}

            <ContinueCTA
              onClick={onContinue}
              label={continueLabel}
              accent={accent}
              textColor={textOnAccent}
            />
          </section>

          {showQuiz && (
            <button
              className="ccs-secondary ccs-in"
              aria-label={`Start quick quiz with ${quizQuestionCount} questions`}
              onClick={onQuiz}
              style={{
                ...baseButton,
                width: '100%',
                maxWidth: 360,
                minHeight: 64,
                marginTop: SPACING.compact,
                borderRadius: RADII.medium,
                padding: `${SPACING.micro}px ${SPACING.compact}px`,
                background: GENERAL.surfaceTint,
                border: `1px solid ${GENERAL.line.soft}`,
                display: 'flex',
                alignItems: 'center',
                textAlign: 'left',
                transition: `background ${MOTION.duration.fast} ${MOTION.easing.gentle}, transform ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                animationDelay: '180ms',
              }}
            >
              <div style={{
                width: SPACING.separation,
                height: SPACING.separation,
                borderRadius: RADII.pill,
                border: `1px solid rgba(${accentRgb},0.28)`,
                background: `rgba(${accentRgb},0.06)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
                </svg>
              </div>
              <div style={{ marginLeft: SPACING.compact, flex: 1, minWidth: 0 }}>
                <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary }}>
                  Quick quiz
                </div>
                <div style={{
                  ...TYPE.bodySmall,
                  color: GENERAL.cinematic.textMuted,
                  marginTop: 2,
                }}>
                  {quizQuestionCount} questions from this chapter
                </div>
              </div>
            </button>
          )}

          {onPastPaper && (
            <button
              className="ccs-secondary ccs-in"
              aria-label={pastPaperLabel || 'Practice past paper questions'}
              onClick={onPastPaper}
              style={{
                ...baseButton,
                width: '100%',
                maxWidth: 360,
                minHeight: 64,
                marginTop: SPACING.micro,
                borderRadius: RADII.medium,
                padding: `${SPACING.micro}px ${SPACING.compact}px`,
                background: `rgba(${accentRgb},0.05)`,
                border: `1px solid rgba(${accentRgb},0.18)`,
                display: 'flex',
                alignItems: 'center',
                textAlign: 'left',
                transition: `background ${MOTION.duration.fast} ${MOTION.easing.gentle}, transform ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                animationDelay: '210ms',
              }}
            >
              <div style={{
                width: SPACING.separation,
                height: SPACING.separation,
                borderRadius: RADII.pill,
                border: `1px solid rgba(${accentRgb},0.28)`,
                background: `rgba(${accentRgb},0.07)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="7" x2="16" y2="7" />
                  <line x1="8" y1="11" x2="16" y2="11" />
                  <line x1="8" y1="15" x2="12" y2="15" />
                </svg>
              </div>
              <div style={{ marginLeft: SPACING.compact, flex: 1, minWidth: 0 }}>
                <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary }}>
                  {pastPaperLabel || 'Past paper questions'}
                </div>
                <div style={{
                  ...TYPE.bodySmall,
                  color: GENERAL.cinematic.textMuted,
                  marginTop: 2,
                }}>
                  Real exam questions from this chapter
                </div>
              </div>
            </button>
          )}

          <button
            className="ccs-home-row ccs-in"
            aria-label="Return home"
            onClick={onHome}
            style={{
              ...baseButton,
              marginTop: SPACING.standard,
              background: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.micro,
              opacity: 0.68,
              transition: `opacity ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
              animationDelay: '240ms',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={GENERAL.cinematic.textPrimary}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span style={{ ...TYPE.bodyStrong, color: GENERAL.cinematic.textPrimary }}>
              Return home
            </span>
          </button>
        </div>
      </main>
    </>
  )
}
