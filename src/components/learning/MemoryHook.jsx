import { useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { getJson, setJson } from '../../lib/storage.js'

// Learner-personalised hooks live under one scoped storage object, keyed by the
// hook's stable id. storage.js namespaces the key per account for us.
const NOTES_KEY = 'gcse_memory_hook_notes_v1'

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

function PencilIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" style={{ display: 'block', color }}>
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

// ─── MemoryHook — in-page "make it stick" reminder ───────────────────────────
// A small, reusable content block that anchors one hard idea with a memorable
// analogy or mnemonic. The learner can rewrite the hook in their own words
// (generation effect); the personalised version persists via storage.js.
//
// Content component (Route A) — rendered inside a composed screen / the
// ModulePlayer content flow. It never owns a screen.
//
// block shape: {
//   id?: string,        // stable key for the personalised version
//   label?: string,     // defaults to 'Memory hook'
//   hook: string,       // the analogy / mnemonic the author supplies
//   image?: string,     // optional square thumbnail (author-supplied)
//   imageAlt?: string,
// }
export default function MemoryHook({ block = {}, subject = 'Biology' }) {
  const theme = SUBJECTS[subject] || SUBJECTS.Biology
  const label = block.label || 'Memory hook'
  const defaultHook = block.hook || ''
  const hookId = block.id || defaultHook

  const [personal, setPersonal] = useState(() => readNote(hookId))
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const displayHook = personal || defaultHook
  const hasPersonal = Boolean(personal)

  function startEditing() {
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

  return (
    <div style={{ margin: `${SPACING.compact}px 0` }}>
      <div style={{
        display: 'flex',
        gap: SPACING.compact,
        alignItems: 'flex-start',
        background: `rgba(${theme.accentRgb},0.07)`,
        border: `1px solid rgba(${theme.accentRgb},0.20)`,
        borderRadius: RADII.medium,
        padding: SPACING.standard,
      }}>
        {block.image && (
          <img
            src={block.image}
            alt={block.imageAlt || ''}
            style={{
              width: SPACING.cinematic,
              height: SPACING.cinematic,
              flexShrink: 0,
              objectFit: 'cover',
              borderRadius: RADII.small,
              border: `1px solid ${GENERAL.line.soft}`,
            }}
          />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: SPACING.compact,
            marginBottom: SPACING.micro,
          }}>
            <span style={{ ...TYPE.label, color: theme.accent }}>
              {label}
            </span>

            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                aria-label={hasPersonal ? 'Edit your memory hook' : 'Rewrite this memory hook in your own words'}
                style={{
                  flexShrink: 0,
                  width: SPACING.separation - SPACING.micro,
                  height: SPACING.separation - SPACING.micro,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'transparent',
                  border: `1px solid rgba(${theme.accentRgb},0.30)`,
                  borderRadius: RADII.small,
                  cursor: 'pointer',
                  transition: `transform ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                }}
                onPointerDown={(e) => { e.currentTarget.style.transform = `scale(${MOTION.scale.press})` }}
                onPointerUp={(e) => { e.currentTarget.style.transform = 'none' }}
                onPointerLeave={(e) => { e.currentTarget.style.transform = 'none' }}
              >
                <PencilIcon color={theme.accent} />
              </button>
            )}
          </div>

          {editing ? (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={4}
                autoFocus
                aria-label="Your memory hook"
                placeholder={defaultHook}
                style={{
                  ...TYPE.body,
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  color: GENERAL.softWhite,
                  background: GENERAL.backgroundSunken,
                  border: `1px solid rgba(${theme.accentRgb},0.30)`,
                  borderRadius: RADII.small,
                  padding: SPACING.compact,
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: SPACING.micro, marginTop: SPACING.compact }}>
                <button
                  type="button"
                  onClick={save}
                  style={{
                    ...TYPE.button,
                    flex: 1,
                    height: SPACING.separation,
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
                  onClick={cancel}
                  style={{
                    ...TYPE.button,
                    flex: 1,
                    height: SPACING.separation,
                    color: GENERAL.slate,
                    background: 'transparent',
                    border: `1px solid ${GENERAL.line.medium}`,
                    borderRadius: RADII.small,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ ...TYPE.body, color: GENERAL.neutral[200], margin: 0 }}>
                {displayHook}
              </p>
              {hasPersonal && (
                <p style={{ ...TYPE.caption, color: theme.accent, margin: `${SPACING.micro}px 0 0` }}>
                  Your version
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
