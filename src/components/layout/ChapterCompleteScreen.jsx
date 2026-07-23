import { useEffect, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import {
  SUBJECT_BACKDROPS,
  SUBJECT_BACKDROP_POSITIONS,
} from '../../constants/subjectBackdrops.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE, HEADING_LAYOUT } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CinematicShell from './CinematicShell.jsx'

const R_SIZE = 96
const R_STROKE = 7
const R_RADIUS = R_SIZE / 2 - R_STROKE / 2
const R_CIRC = 2 * Math.PI * R_RADIUS

function hexToRgb(hex) {
  const value = Number.parseInt(hex.replace('#', ''), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function isLight(hex) {
  const [red, green, blue] = hexToRgb(hex)
  return (0.299 * red + 0.587 * green + 0.114 * blue) / 255 > 0.55
}

const COMPLETION_LABELS = {
  chapter: 'Chapter complete',
  module: 'Module complete',
  subject: 'Subject complete',
}

const QUIZ_SCOPES = {
  chapter: 'this chapter',
  module: 'this module',
  subject: 'this subject',
}

function SecondaryAction({
  iconBorder,
  icon,
  label,
  detail,
  onClick,
  ariaLabel,
  showDivider = false,
  animationDelay,
}) {
  return (
    <button
      className="ccs-secondary ccs-in"
      aria-label={ariaLabel}
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: 68,
        padding: `${SPACING.micro}px 0`,
        border: 'none',
        borderTop: showDivider ? `1px solid ${GENERAL.line.faint}` : 'none',
        background: 'transparent',
        color: GENERAL.cinematic.textPrimary,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        transition: `opacity ${MOTION.duration.fast} ${MOTION.easing.gentle}, transform ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
        animationDelay,
      }}
    >
      <span style={{
        width: SPACING.separation,
        height: SPACING.separation,
        borderRadius: RADII.pill,
        border: `1px solid ${iconBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        opacity: 0.72,
      }}>
        {icon}
      </span>
      <span style={{ marginLeft: SPACING.compact, flex: 1, minWidth: 0 }}>
        <span style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, display: 'block' }}>
          {label}
        </span>
        <span style={{
          ...TYPE.bodySmall,
          color: GENERAL.cinematic.textMuted,
          display: 'block',
          marginTop: SPACING.micro / 4,
        }}>
          {detail}
        </span>
      </span>
    </button>
  )
}

export default function ChapterCompleteScreen({
  subject = 'History',
  accent,
  completedChapter = 'Chapter',
  completionType,
  nextChapterNum,
  nextChapterTitle,
  nextChapterLabel = 'Chapter',
  supportingCopy = 'Momentum matters.',
  isFinalChapter = false,
  backgroundAsset,
  backgroundPosition,
  primaryActionLabel,
  pastPaperLabel,
  quizQuestionCount = 10,
  quizScopeLabel,
  showQuiz = true,
  onContinue,
  onQuiz,
  onPastPaper,
  onHome,
}) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const resolvedAccent = accent || theme.accent
  const resolvedCompletionType = completionType
    || (isFinalChapter ? 'subject' : nextChapterLabel === 'Next Module' ? 'module' : 'chapter')
  const completionLabel = COMPLETION_LABELS[resolvedCompletionType] || COMPLETION_LABELS.chapter
  const quizScope = quizScopeLabel || QUIZ_SCOPES[resolvedCompletionType] || QUIZ_SCOPES.chapter
  const resolvedBackground = backgroundAsset === false
    ? null
    : backgroundAsset || SUBJECT_BACKDROPS[subject] || SUBJECT_BACKDROPS.History
  const resolvedBackgroundPosition = backgroundPosition
    || SUBJECT_BACKDROP_POSITIONS[subject]
    || SUBJECT_BACKDROP_POSITIONS.History
  const textOnAccent = isLight(resolvedAccent)
    ? GENERAL.textOnAccent
    : GENERAL.cinematic.textPrimary
  const continueLabel = primaryActionLabel
    || (isFinalChapter
      ? 'View subject progress'
      : nextChapterNum != null
        ? `Start ${nextChapterLabel.toLowerCase()} ${nextChapterNum}`
        : nextChapterTitle
          ? `Start ${nextChapterLabel.toLowerCase()}`
          : 'Continue')
  const [reduceMotion] = useState(() =>
    typeof window !== 'undefined'
      && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  const strokeRef = useRef(null)

  useEffect(() => {
    if (reduceMotion) {
      if (strokeRef.current) strokeRef.current.style.strokeDashoffset = '0'
      return undefined
    }

    const timer = setTimeout(() => {
      if (!strokeRef.current) return
      strokeRef.current.style.transition = `stroke-dashoffset ${GENERAL.cinematic.motion.slow} ${MOTION.easing.standard}`
      strokeRef.current.style.strokeDashoffset = '0'
    }, GENERAL.cinematic.motion.hintDelayMs)

    return () => clearTimeout(timer)
  }, [reduceMotion])

  const quizIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={resolvedAccent}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
    </svg>
  )

  const paperIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={resolvedAccent}
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
  )

  return (
    <>
      <style>{`
        @keyframes ccs-in {
          from { opacity: 0; transform: translateY(${SPACING.micro}px); }
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
          animation: ccs-check ${MOTION.duration.standard} ${MOTION.easing.standard} ${MOTION.duration.slow} both;
        }
        .ccs-secondary:active {
          opacity: 0.62;
          transform: scale(${MOTION.scale.press});
        }
        .ccs-home-row:active {
          opacity: 0.46 !important;
        }
        .ccs-secondary:focus-visible,
        .ccs-home-row:focus-visible {
          outline: 2px solid ${resolvedAccent};
          outline-offset: 3px;
          border-radius: ${RADII.small}px;
        }
        @media (prefers-reduced-motion: reduce) {
          .ccs-in,
          .ccs-checkmark {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .ccs-checkmark {
            transform: translate(-50%, -50%) !important;
          }
        }
      `}</style>

      {/* This is a full-viewport completion moment with fixed atmosphere layers.
          CinematicShell keeps those layers stable while the inner column remains scrollable. */}
      <CinematicShell
        role="main"
        aria-labelledby="chapter-complete-title"
        style={{ background: GENERAL.backgroundApp, color: GENERAL.cinematic.textPrimary, zIndex: 1000 }}
      >
        {resolvedBackground && (
          <div
            aria-hidden="true"
            data-chapter-complete-backdrop
            style={{
              position: 'fixed',
              inset: 0,
              backgroundImage: `url(${resolvedBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: resolvedBackgroundPosition,
              opacity: GENERAL.cinematic.completionBackdropOpacity,
              filter: GENERAL.cinematic.completionBackdropFilter,
              WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 34%, transparent 72%)',
              maskImage: 'linear-gradient(to bottom, #000 0%, #000 34%, transparent 72%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: GENERAL.cinematic.completionOverlay,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: SPACING.separation,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 240,
            height: 240,
            borderRadius: RADII.pill,
            background: theme.glow,
            filter: 'blur(90px)',
            opacity: GENERAL.cinematic.completionGlowOpacity,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <div
          data-chapter-complete-scroll
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100dvh',
            overflowY: 'auto',
            overscrollBehaviorY: 'contain',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
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
          }}>
            <div
              className="ccs-in"
              style={{
                width: R_SIZE,
                height: R_SIZE,
                position: 'relative',
                marginBottom: SPACING.standard,
                flexShrink: 0,
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
                  stroke={resolvedAccent}
                  strokeWidth={R_STROKE}
                  strokeLinecap="round"
                  strokeDasharray={R_CIRC}
                  strokeDashoffset={reduceMotion ? 0 : R_CIRC}
                  style={{ filter: `drop-shadow(0 0 12px ${theme.glow})` }}
                />
              </svg>
              <div
                className="ccs-checkmark"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) scale(0.72)',
                  opacity: reduceMotion ? 1 : 0,
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
                color: resolvedAccent,
                textAlign: 'center',
                margin: `0 0 ${SPACING.micro}px`,
                animationDelay: '40ms',
              }}
            >
              {completionLabel}
            </p>

            <h1
              id="chapter-complete-title"
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
                  <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary }}>
                    {nextChapterTitle}
                  </div>
                </div>
              )}

              <ContinueCTA
                onClick={onContinue}
                label={continueLabel}
                accent={resolvedAccent}
                textColor={textOnAccent}
              />
            </section>

            {((showQuiz && onQuiz) || onPastPaper) && (
              <section
                aria-label="More ways to continue"
                style={{
                  width: '100%',
                  maxWidth: 360,
                  marginTop: SPACING.standard,
                  borderTop: `1px solid ${GENERAL.line.soft}`,
                  borderBottom: `1px solid ${GENERAL.line.soft}`,
                }}
              >
                {showQuiz && onQuiz && (
                  <SecondaryAction
                    iconBorder={theme.glowStrong}
                    icon={quizIcon}
                    label="Quick quiz"
                    detail={`${quizQuestionCount} questions from ${quizScope}`}
                    ariaLabel={`Start quick quiz with ${quizQuestionCount} questions`}
                    onClick={onQuiz}
                    animationDelay="180ms"
                  />
                )}

                {onPastPaper && (
                  <SecondaryAction
                    iconBorder={theme.glowStrong}
                    icon={paperIcon}
                    label={pastPaperLabel || 'Past paper questions'}
                    detail={`Real exam questions from ${quizScope}`}
                    ariaLabel={pastPaperLabel || 'Practice past paper questions'}
                    onClick={onPastPaper}
                    showDivider={showQuiz && !!onQuiz}
                    animationDelay="210ms"
                  />
                )}
              </section>
            )}

            {onHome && (
              <button
                className="ccs-home-row ccs-in"
                aria-label="Return home"
                onClick={onHome}
                style={{
                  marginTop: SPACING.standard,
                  padding: SPACING.micro,
                  border: 'none',
                  background: 'none',
                  color: GENERAL.cinematic.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: SPACING.micro,
                  opacity: 0.68,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  transition: `opacity ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                  animationDelay: '240ms',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span style={TYPE.bodyStrong}>Return home</span>
              </button>
            )}
          </div>
        </div>
      </CinematicShell>
    </>
  )
}
