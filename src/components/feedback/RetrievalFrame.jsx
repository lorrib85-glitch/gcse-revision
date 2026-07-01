import AnswerInteraction from '../core/AnswerInteraction.jsx'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'
import { SUBJECTS } from '../../constants/subjects.js'

// ── RetrievalFrame v1 — LOCKED COMPONENT ──────────────────────────────────────
// Cinematic wrapper for retrieval moments woven into learning flow.
// CRITICAL: RetrievalFrame is a wrapper only. AnswerInteraction v1 owns all answer logic.
//
// Wraps existing intro.retrieval data. Does not create new schema.
// Replaces inline retrieval rendering in HookScreen.
// Does NOT handle trueFalse (stays in ChapterHookScreen).
//
// Props:
// - retrieval: { question, options[], correctIndex, explanation }
// - variant: 'contained' | 'fullBleed' | 'inline' (default: 'contained')
// - subject: subject key for accent styling
// - topic: topic name for metadata
// - beatId: learning beat ID
// - contextImage: optional background image path
// - contextText: optional setup line
// - label: label text (default: "Quick check")
// - mode: 'learning' | 'cinematic' | 'review' (default: 'learning')
// - onInteractionComplete: callback when AnswerInteraction completes
// - onContinueReady: optional callback for continue readiness
export default function RetrievalFrame({
  retrieval,
  variant = 'contained',
  subject,
  topic,
  beatId,
  contextImage,
  contextText,
  label = 'Quick check',
  mode = 'learning',
  onInteractionComplete,
  onContinueReady,
}) {
  if (!retrieval || !retrieval.question) return null

  // Convert retrieval format to AnswerInteraction format
  const block = {
    question: retrieval.question,
    options: retrieval.options.map((text, i) => ({
      text,
      correct: i === retrieval.correctIndex,
    })),
    explanation: retrieval.explanation,
    hint: retrieval.hint,
  }

  // Resolve accent from canonical SUBJECTS source
  const subjectKey = Object.keys(SUBJECTS).find(k => k.toLowerCase() === subject?.toLowerCase()) || 'History'
  const accent = SUBJECTS[subjectKey].accent

  function handleComplete(result) {
    if (onInteractionComplete) {
      onInteractionComplete({ correct: result.correct, attempts: result.attempts })
    }
    if (onContinueReady) {
      onContinueReady()
    }
  }

  // ── Contained variant (default) ──
  if (variant === 'contained') {
    return (
      <div style={{
        margin: '24px 0',
        padding: '20px 16px',
        background: 'rgba(7,10,18,0.6)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        {/* Label */}
        <div style={{
          ...TYPE.eyebrow,
          textTransform: 'uppercase',
          color: accent,
          marginBottom: 12,
          opacity: 0.8,
        }}>
          {label}
        </div>

        {/* Optional context text */}
        {contextText && (
          <p style={{
            ...TYPE.body,
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 16px',
          }}>
            {contextText}
          </p>
        )}

        {/* Question */}
        <div style={{
          ...TYPE.displayScreen,
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
          color: '#F5F7FB',
          marginBottom: 20,
        }}>
          {block.question}
        </div>

        {/* AnswerInteraction */}
        <AnswerInteraction
          block={block}
          subject={subject}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  // ── Full-bleed variant ──
  if (variant === 'fullBleed') {
    return (
      <div style={{
        position: 'relative',
        margin: '32px -16px',
        padding: '40px 16px',
        minHeight: 320,
        background: contextImage
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${contextImage}) center / cover`
          : 'linear-gradient(135deg, rgba(7,10,18,0.8), rgba(15,15,30,0.8))',
        backgroundAttachment: 'scroll',
      }}>
        {/* Label */}
        <div style={{
          ...TYPE.eyebrow,
          textTransform: 'uppercase',
          color: accent,
          marginBottom: SPACING.compact,
          opacity: 0.85,
        }}>
          {label}
        </div>

        {/* Optional context text */}
        {contextText && (
          <p style={{
            ...TYPE.body,
            color: 'rgba(255,255,255,0.65)',
            margin: '0 0 20px',
          }}>
            {contextText}
          </p>
        )}

        {/* Question */}
        <div style={{
          ...TYPE.displayScreen,
          fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
          color: '#FFFFFF',
          marginBottom: 28,
          maxWidth: '90%',
        }}>
          {block.question}
        </div>

        {/* AnswerInteraction */}
        <AnswerInteraction
          block={block}
          subject={subject}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  // ── Inline variant ──
  if (variant === 'inline') {
    return (
      <div style={{
        margin: '16px 0',
        padding: '14px 12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
      }}>
        {/* Compact label */}
        <div style={{
          ...TYPE.eyebrow,
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          color: accent,
          marginBottom: SPACING.micro,
          opacity: 0.7,
        }}>
          {label}
        </div>

        {/* Compact question */}
        <div style={{
          ...TYPE.displayScreen,
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          color: '#F0ECFF',
          marginBottom: 12,
        }}>
          {block.question}
        </div>

        {/* AnswerInteraction */}
        <AnswerInteraction
          block={block}
          subject={subject}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  return null
}
