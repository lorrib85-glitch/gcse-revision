import { useEffect, useRef, useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { COMPONENT_SIZE, CONTENT_LIMITS, SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { getJson, setJson } from '../../lib/storage.js'

// Learner-personalised hooks live under one scoped storage object, keyed by the
// hook's stable id. storage.js namespaces the key per account for us.
const NOTES_KEY = 'gcse_memory_hook_notes_v1'
const CONTROL_CLASS = 'memory-hook-control'

const CONTROL_STYLES = `
  .${CONTROL_CLASS} {
    transition: transform var(--memory-hook-motion-duration) var(--memory-hook-motion-easing);
  }

  .${CONTROL_CLASS}:active {
    transform: scale(var(--memory-hook-press-scale));
  }

  .${CONTROL_CLASS}:focus-visible {
    outline: var(--memory-hook-focus-width) solid var(--memory-hook-accent);
    outline-offset: var(--memory-hook-focus-offset);
  }

  @media (prefers-reduced-motion: reduce) {
    .${CONTROL_CLASS} {
      transition: none;
    }
  }
`

function readNote(hookId) {
  if (!hookId) return ''
  const notes = getJson(NOTES_KEY, {}) || {}
  return typeof notes[hookId] === 'string' ? notes[hookId] : ''
}

function writeNote(hookId, value) {
  if (!hookId) return
  const notes = getJson(NOTES_KEY, {}) || {}
  const trimmed = (value || '').trim()
  if (trimmed) notes[hookId] = trimmed
  else delete notes[hookId]
  setJson(NOTES_KEY, notes)
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      <path
        d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.83l-1.17-1.17a2 2 0 0 0-2.83 0L4 16v4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── MemoryHook — in-page memory anchor ──────────────────────────────────────
// A compact, reusable content block that anchors one hard idea with a memorable
// analogy or mnemonic. With a stable id, the learner can rewrite the hook in
// their own words (generation effect) and keep that version via storage.js.
//
// Content component (Route A) — rendered inside a composed screen / the
// ModulePlayer content flow. It never owns a screen.
//
// block shape: {
//   id: string,         // stable key; required to enable personalisation
//   label?: string,     // defaults to 'Memory hook'
//   hook: string,       // the analogy / mnemonic the author supplies
//   image?: string,     // optional square thumbnail (author-supplied)
//   imageAlt?: string,
// }
export default function MemoryHook({ block = {}, subject = 'Biology' }) {
  const theme = SUBJECTS[subject] || SUBJECTS.Biology
  const label = block.label || 'Memory hook'
  const defaultHook = block.hook || ''
  const hookId = typeof block.id === 'string' ? block.id.trim() : ''
  const canPersonalise = Boolean(hookId)

  const [personal, setPersonal] = useState(() => readNote(hookId))
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const textareaRef = useRef(null)

  const displayHook = personal || defaultHook
  const hasPersonal = Boolean(personal)
  const displayLabel = hasPersonal ? 'Your memory hook' : label

  useEffect(() => {
    if (import.meta.env.DEV && !hookId) {
      console.warn('MemoryHook requires block.id to enable learner personalisation.')
    }
  }, [hookId])

  useEffect(() => {
    if (!editing || !textareaRef.current) return
    const field = textareaRef.current
    field.style.height = 'auto'
    field.style.height = `${Math.min(field.scrollHeight, SPACING.section)}px`
  }, [draft, editing])

  function startEditing() {
    if (!canPersonalise) return
    setDraft(personal || defaultHook)
    setEditing(true)
  }

  function save() {
    const trimmed = draft.trim()
    // An empty draft, or the default restored verbatim, clears the override.
    const next = trimmed && trimmed !== defaultHook.trim() ? trimmed : ''
    writeNote(hookId, next)
    setPersonal(next)
    setEditing(false)
  }

  function cancel() {
    setEditing(false)
  }

  function useOriginal() {
    writeNote(hookId, '')
    setPersonal('')
    setDraft(defaultHook)
    setEditing(false)
  }

  const controlVariables = {
    '--memory-hook-accent': theme.accent,
    '--memory-hook-focus-width': `${COMPONENT_SIZE.focusRing}px`,
    '--memory-hook-focus-offset': `${COMPONENT_SIZE.focusOffset}px`,
    '--memory-hook-motion-duration': MOTION.duration.fast,
    '--memory-hook-motion-easing': MOTION.easing.gentle,
    '--memory-hook-press-scale': MOTION.scale.press,
  }

  const secondaryButton = {
    ...TYPE.button,
    minHeight: COMPONENT_SIZE.touchTarget,
    color: GENERAL.slate,
    background: 'transparent',
    border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.medium}`,
    borderRadius: RADII.small,
    cursor: 'pointer',
  }

  return (
    <div style={{ margin: `${SPACING.compact}px 0` }}>
      <style>{CONTROL_STYLES}</style>
      <div style={{
        ...controlVariables,
        display: 'flex',
        gap: SPACING.compact,
        alignItems: 'flex-start',
        background: GENERAL.backgroundSurface,
        border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
        borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${theme.accent}`,
        borderRadius: RADII.medium,
        padding: SPACING.compact,
      }}>
        {block.image && (
          <img
            src={block.image}
            alt={block.imageAlt || ''}
            style={{
              width: COMPONENT_SIZE.thumbnail,
              height: COMPONENT_SIZE.thumbnail,
              flexShrink: 0,
              objectFit: 'cover',
              borderRadius: RADII.small,
              border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
            }}
          />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: SPACING.micro,
            marginBottom: SPACING.micro,
          }}>
            <span aria-live="polite" style={{ ...TYPE.label, color: theme.accent }}>
              {displayLabel}
            </span>

            {!editing && canPersonalise && (
              <button
                type="button"
                className={CONTROL_CLASS}
                onClick={startEditing}
                aria-label={hasPersonal ? 'Edit your memory hook' : 'Make this memory hook your own'}
                style={{
                  ...TYPE.button,
                  flexShrink: 0,
                  minHeight: COMPONENT_SIZE.touchTarget,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: SPACING.micro,
                  padding: `0 ${SPACING.compact}px`,
                  color: theme.accent,
                  background: GENERAL.surfaceTint,
                  border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.medium}`,
                  borderRadius: RADII.small,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <PencilIcon />
                {hasPersonal ? 'Edit' : 'Make it mine'}
              </button>
            )}
          </div>

          {editing ? (
            <>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                maxLength={CONTENT_LIMITS.memoryHook}
                autoFocus
                aria-label="Your memory hook"
                placeholder={defaultHook}
                className={CONTROL_CLASS}
                style={{
                  ...TYPE.bodyStrong,
                  width: '100%',
                  minHeight: SPACING.cinematic,
                  maxHeight: SPACING.section,
                  boxSizing: 'border-box',
                  resize: 'none',
                  overflowY: 'auto',
                  color: GENERAL.softWhite,
                  background: GENERAL.backgroundSunken,
                  border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.medium}`,
                  borderRadius: RADII.small,
                  padding: SPACING.compact,
                }}
              />

              <div style={{ ...TYPE.caption, color: GENERAL.slate, textAlign: 'right', marginTop: SPACING.micro }}>
                {draft.length}/{CONTENT_LIMITS.memoryHook}
              </div>

              <div style={{ display: 'flex', gap: SPACING.micro, marginTop: SPACING.compact }}>
                <button
                  type="button"
                  className={CONTROL_CLASS}
                  onClick={save}
                  style={{
                    ...TYPE.button,
                    flex: 1,
                    minHeight: COMPONENT_SIZE.touchTarget,
                    color: GENERAL.textOnAccent,
                    background: theme.accent,
                    border: 'none',
                    borderRadius: RADII.small,
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className={CONTROL_CLASS}
                  onClick={cancel}
                  style={{ ...secondaryButton, flex: 1 }}
                >
                  Cancel
                </button>
              </div>

              {hasPersonal && (
                <button
                  type="button"
                  className={CONTROL_CLASS}
                  onClick={useOriginal}
                  style={{
                    ...secondaryButton,
                    width: '100%',
                    marginTop: SPACING.micro,
                    borderColor: 'transparent',
                  }}
                >
                  Use original
                </button>
              )}
            </>
          ) : (
            <p style={{ ...TYPE.bodyStrong, color: GENERAL.softWhite, margin: 0 }}>
              {displayHook}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
