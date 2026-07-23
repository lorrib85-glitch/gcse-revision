import { useEffect, useRef, useState } from 'react'
import { MODULES } from '../../modules.js'
import { SUBJECTS } from '../../constants/subjects.js'
import {
  SUBJECT_BACKDROPS,
  SUBJECT_BACKDROP_POSITIONS,
} from '../../constants/subjectBackdrops.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CinematicShell from './CinematicShell.jsx'

const SEAL_SIZE = 72
const SEAL_STROKE = 2.5
const SEAL_RADIUS = SEAL_SIZE / 2 - SEAL_STROKE / 2
const SEAL_CIRC = 2 * Math.PI * SEAL_RADIUS

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
  icon,
  label,
  detail,
  onClick,
  ariaLabel,
  accent,
  accentRgb,
  animationDelay,
}) {
  return (
    <button
      className="ccs-secondary ccs-in"
      aria-label={ariaLabel}
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: 58,
        padding: `${SPACING.micro}px ${SPACING.micro / 2}px`,
        border: 'none',
        background: 'transparent',
        color: GENERAL.cinematic.textPrimary,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        transition: `opacity ${MOTION.duration.fast} ${MOTION.easing.gentle}, transform ${MOTION.duration.fast} ${MOTION.easing.gentle}, background ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
        animationDelay,
      }}
    >
      <span style={{
        width: 34,
        height: 34,
        borderRadius: RADII.pill,
        border: `1px solid rgba(${accentRgb},0.26)`,
        background: `rgba(${accentRgb},0.06)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: accent,
      }}>
        {icon}
      </span>
      <span style={{ marginLeft: SPACING.compact, flex: 1, minWidth: 0 }}>
        <span style={{ ...TYPE.titleMedium, color: GENERAL.cinematic.textPrimary, display: 'block' }}>
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
  subject,
  accent,
  completedChapter = 'Chapter',
  completionType,
  nextChapterNum,
  nextChapterTitle,
  nextChapterSubtitle,
  nextChapterImage,
  nextChapterImagePosition,
  nextChapterLabel = 'Chapter',
  supportingCopy = 'Momentum matters.',
  isFinalChapter = false,
  backgroundAsset,
  backgroundPosition,
  primaryActionLabel,
  homeLabel = 'Return to subjects',
  pastPaperLabel,
  quizQuestionCount = 10,
  quizScopeLabel,
  showQuiz = true,
  onContinue,
  onQuiz,
  onPastPaper,
  onHome,
}) {
  const accentSubject = Object.entries(SUBJECTS)
    .find(([, candidate]) => candidate.accent === accent)?.[0]

  // Direct props remain the public component contract. Metadata is only used as
  // a flexible fallback so production and Component Lab fixtures can supply a
  // title without duplicating artwork, subtitle or subject information.
  const matchedModule = MODULES.find(module =>
    module.title === completedChapter
    && (!subject || module.subject === subject)
    && (!accentSubject || module.subject === accentSubject)
  )
  const resolvedSubject = subject || matchedModule?.subject || accentSubject || 'History'
  const theme = SUBJECTS[resolvedSubject] || SUBJECTS.History
  const resolvedAccent = accent || theme.accent
  const accentRgb = hexToRgb(resolvedAccent).join(',')
  const resolvedCompletionType = completionType
    || (isFinalChapter ? 'subject' : nextChapterLabel === 'Next Module' ? 'module' : 'chapter')
  const completionLabel = COMPLETION_LABELS[resolvedCompletionType] || COMPLETION_LABELS.chapter
  const quizScope = quizScopeLabel || QUIZ_SCOPES[resolvedCompletionType] || QUIZ_SCOPES.chapter

  const matchedNextModule = MODULES.find(module =>
    module.title === nextChapterTitle
    && module.subject === resolvedSubject
  )
  const resolvedNextSubtitle = nextChapterSubtitle || matchedNextModule?.subtitle
  const resolvedNextImage = nextChapterImage === false
    ? null
    : nextChapterImage
      || matchedNextModule?.headerImage
      || SUBJECT_BACKDROPS[resolvedSubject]
      || SUBJECT_BACKDROPS.History
  const resolvedNextImagePosition = nextChapterImagePosition
    || (matchedNextModule?.headerImage ? 'center 34%' : null)
    || SUBJECT_BACKDROP_POSITIONS[resolvedSubject]
    || SUBJECT_BACKDROP_POSITIONS.History

  const resolvedBackground = backgroundAsset === false
    ? null
    : backgroundAsset
      || matchedModule?.completionBackground
      || matchedModule?.headerImage
      || SUBJECT_BACKDROPS[resolvedSubject]
      || SUBJECT_BACKDROPS.History
  const resolvedBackgroundPosition = backgroundPosition
    || matchedModule?.completionBackgroundPosition
    || (matchedModule?.headerImage ? 'center 30%' : null)
    || SUBJECT_BACKDROP_POSITIONS[resolvedSubject]
    || SUBJECT_BACKDROP_POSITIONS.History

  const textOnAccent = isLight(resolvedAccent)
    ? GENERAL.textOnAccent
    : GENERAL.cinematic.textPrimary
  const continueLabel = primaryActionLabel
    || (isFinalChapter
      ? 'View subject progress'
      : resolvedCompletionType === 'module'
        ? 'Start the next module'
        : 'Start the next chapter')
  const nextMetaLabel = nextChapterNum != null
    ? `${nextChapterLabel} ${nextChapterNum}`
    : nextChapterLabel === 'Next Module'
      ? 'Next module'
      : nextChapterLabel
  const quizMinutes = Math.max(1, Math.ceil(quizQuestionCount / 4))
  const quizDuration = `about ${quizMinutes} minute${quizMinutes === 1 ? '' : 's'}`

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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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
          from { opacity: 0; transform: translateY(${SPACING.compact}px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ccs-check {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.76); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes ccs-seal-settle {
          0%, 45% { filter: drop-shadow(0 0 12px rgba(${accentRgb},0.42)); }
          100% { filter: none; }
        }
        @keyframes ccs-art-settle {
          from { transform: scale(1.025); }
          to { transform: scale(1); }
        }
        .ccs-in {
          animation: ccs-in ${MOTION.duration.slow} ${MOTION.easing.standard} both;
        }
        .ccs-checkmark {
          animation: ccs-check ${MOTION.duration.standard} ${MOTION.easing.standard} ${MOTION.duration.slow} both;
        }
        .ccs-seal {
          animation: ccs-seal-settle ${GENERAL.cinematic.motion.slow} ${MOTION.easing.standard} both;
        }
        .ccs-artwork {
          animation: ccs-art-settle 1400ms ${MOTION.easing.gentle} both;
        }
        .ccs-secondary:hover {
          background: ${GENERAL.surfaceTint} !important;
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
        .ccs-scroll::-webkit-scrollbar {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .ccs-in,
          .ccs-checkmark,
          .ccs-seal,
          .ccs-artwork {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
          .ccs-checkmark {
            transform: translate(-50%, -50%) !important;
          }
        }
      `}</style>

      {/* This is a full-viewport cinematic completion moment with fixed artwork
          and scrims. CinematicShell keeps those layers stable while the inner
          content remains safe-area aware and scrollable on short devices. */}
      <CinematicShell
        role="main"
        aria-labelledby="chapter-complete-title"
        style={{ background: GENERAL.backgroundApp, color: GENERAL.cinematic.textPrimary, zIndex: 1000 }}
      >
        {resolvedBackground && (
          <div
            className="ccs-artwork"
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
              WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 54%, transparent 84%)',
              maskImage: 'linear-gradient(to bottom, #000 0%, #000 54%, transparent 84%)',
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
          className="ccs-scroll"
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
            padding: `env(safe-area-inset-top, 0px) ${SPACING.standard}px calc(env(safe-area-inset-bottom, 0px) + ${SPACING.separation}px)`,
            boxSizing: 'border-box',
          }}>
            <header style={{
              width: '100%',
              minHeight: 'min(58dvh, 520px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingTop: SPACING.section,
              paddingBottom: SPACING.standard,
              boxSizing: 'border-box',
            }}>
              <div
                className="ccs-seal ccs-in"
                style={{
                  width: SEAL_SIZE,
                  height: SEAL_SIZE,
                  position: 'relative',
                  marginBottom: SPACING.compact,
                  flexShrink: 0,
                }}
              >
                <svg
                  width={SEAL_SIZE}
                  height={SEAL_SIZE}
                  viewBox={`0 0 ${SEAL_SIZE} ${SEAL_SIZE}`}
                  aria-hidden="true"
                  style={{ transform: 'rotate(-90deg)', display: 'block' }}
                >
                  <circle
                    cx={SEAL_SIZE / 2}
                    cy={SEAL_SIZE / 2}
                    r={SEAL_RADIUS - 4}
                    fill="rgba(8,9,13,0.28)"
                    stroke={GENERAL.line.faint}
                    strokeWidth="1"
                  />
                  <circle
                    cx={SEAL_SIZE / 2}
                    cy={SEAL_SIZE / 2}
                    r={SEAL_RADIUS}
                    fill="none"
                    stroke={GENERAL.line.medium}
                    strokeWidth={SEAL_STROKE}
                  />
                  <circle
                    ref={strokeRef}
                    cx={SEAL_SIZE / 2}
                    cy={SEAL_SIZE / 2}
                    r={SEAL_RADIUS}
                    fill="none"
                    stroke={resolvedAccent}
                    strokeWidth={SEAL_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={SEAL_CIRC}
                    strokeDashoffset={reduceMotion ? 0 : SEAL_CIRC}
                  />
                </svg>
                <div
                  className="ccs-checkmark"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(0.76)',
                    opacity: reduceMotion ? 1 : 0,
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 36 36"
                    fill="none"
                    stroke={GENERAL.cinematic.textPrimary}
                    strokeWidth="3.5"
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
                  animationDelay: '260ms',
                }}
              >
                {completionLabel}
              </p>

              <h1
                id="chapter-complete-title"
                className="ccs-in"
                style={{
                  ...TYPE.displayCinematic,
                  color: GENERAL.cinematic.textPrimary,
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: 340,
                  margin: `0 0 ${SPACING.compact}px`,
                  animationDelay: '360ms',
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
                  margin: 0,
                  maxWidth: 310,
                  animationDelay: '480ms',
                }}
              >
                {supportingCopy}
              </p>
            </header>

            <section
              className="ccs-in"
              aria-label="Next step"
              style={{
                width: '100%',
                maxWidth: 360,
                animationDelay: '640ms',
              }}
            >
              {!isFinalChapter && nextChapterTitle && (
                <div
                  data-next-chapter-teaser
                  style={{
                    position: 'relative',
                    minHeight: 112,
                    overflow: 'hidden',
                    borderRadius: RADII.medium,
                    background: GENERAL.backgroundSunken,
                    marginBottom: SPACING.compact,
                    isolation: 'isolate',
                  }}
                >
                  {resolvedNextImage && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${resolvedNextImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: resolvedNextImagePosition,
                        filter: 'saturate(0.78) brightness(0.62)',
                        opacity: 0.48,
                        zIndex: -2,
                      }}
                    />
                  )}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, rgba(8,9,13,0.98) 0%, rgba(8,9,13,0.80) 58%, rgba(8,9,13,0.38) 100%)',
                      zIndex: -1,
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: SPACING.compact,
                      bottom: SPACING.compact,
                      left: 0,
                      width: 2,
                      borderRadius: RADII.pill,
                      background: resolvedAccent,
                    }}
                  />
                  <div style={{
                    minHeight: 112,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: `${SPACING.compact}px ${SPACING.standard}px`,
                    boxSizing: 'border-box',
                  }}>
                    <div style={{ ...TYPE.label, color: resolvedAccent, marginBottom: SPACING.micro / 2 }}>
                      {nextMetaLabel}
                    </div>
                    <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary }}>
                      {nextChapterTitle}
                    </div>
                    {resolvedNextSubtitle && (
                      <div style={{
                        ...TYPE.bodySmall,
                        color: GENERAL.cinematic.textSecondary,
                        marginTop: SPACING.micro / 2,
                        maxWidth: 270,
                      }}>
                        {resolvedNextSubtitle}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <ContinueCTA
                onClick={onContinue}
                label={continueLabel}
                accent={resolvedAccent}
                textColor={textOnAccent}
                style={{ animation: `ccs-in ${MOTION.duration.slow} ${MOTION.easing.standard} 760ms both` }}
              />
            </section>

            {((showQuiz && onQuiz) || onPastPaper) && (
              <section
                aria-label="More ways to continue"
                style={{
                  width: '100%',
                  maxWidth: 360,
                  marginTop: SPACING.compact,
                }}
              >
                {showQuiz && onQuiz && (
                  <SecondaryAction
                    accent={resolvedAccent}
                    accentRgb={accentRgb}
                    icon={quizIcon}
                    label="Test what you remember"
                    detail={`${quizQuestionCount} questions · ${quizDuration}`}
                    ariaLabel={`Start a ${quizQuestionCount}-question quiz from ${quizScope}`}
                    onClick={onQuiz}
                    animationDelay="900ms"
                  />
                )}

                {onPastPaper && (
                  <SecondaryAction
                    accent={resolvedAccent}
                    accentRgb={accentRgb}
                    icon={paperIcon}
                    label={pastPaperLabel || 'Past paper questions'}
                    detail={`Real exam questions from ${quizScope}`}
                    ariaLabel={pastPaperLabel || 'Practice past paper questions'}
                    onClick={onPastPaper}
                    animationDelay="980ms"
                  />
                )}
              </section>
            )}

            {onHome && (
              <button
                className="ccs-home-row ccs-in"
                aria-label={homeLabel}
                onClick={onHome}
                style={{
                  marginTop: SPACING.compact,
                  padding: SPACING.micro,
                  border: 'none',
                  background: 'none',
                  color: GENERAL.cinematic.textMuted,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  transition: `opacity ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                  animationDelay: '1060ms',
                  ...TYPE.bodySmall,
                }}
              >
                {homeLabel}
              </button>
            )}
          </div>
        </div>
      </CinematicShell>
    </>
  )
}
