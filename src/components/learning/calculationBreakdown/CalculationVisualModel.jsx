// ─── CalculationVisualModel — algebra presentation runner ────────────────────
//
// One scene machine shared by all four algebra presentations. Each variant
// contributes a *description* of its scenes (heading, figure, decision,
// reasoning, summary); this file owns the sequence, the gating, the reasoning
// rail and the live announcements, so no variant grows its own navigation and
// nothing here becomes a switch over variant names beyond one lookup table.
//
// Choreography, in every variant: predict → act → observe → explain → check.
// A scene that carries a decision will not release Continue until the learner
// has committed to one.

import { useEffect, useMemo, useRef, useState } from 'react'
import { TYPE } from '../../../constants/typography.js'
import { SPACING } from '../../../constants/spacing.js'
import { MOTION } from '../../../constants/motion.js'
import usePrefersReducedMotion from '../../../hooks/usePrefersReducedMotion.js'
import { SUBJECTS } from '../../../constants/subjects.js'
import {
  PhaseActions,
  ReasoningPanel,
  bodyStyle,
  stageHeaderStyle,
} from './calculationBreakdownParts.jsx'
import { visuallyHidden } from './calculationBreakdownFigures.jsx'
import { createCalculationVisualRoles } from './calculationBreakdownVisualRoles.js'
import { buildAlgebraWhyScenes } from './AlgebraWhyModel.jsx'
import { buildInverseMachineScenes } from './InverseMachineModel.jsx'
import { buildGroupSplitScenes } from './GroupSplitModel.jsx'
import { buildBalanceScenes } from './BalanceModel.jsx'

const SCENE_BUILDERS = Object.freeze({
  algebraWhy: buildAlgebraWhyScenes,
  inverseMachine: buildInverseMachineScenes,
  groupSplit: buildGroupSplitScenes,
  balance: buildBalanceScenes,
})

export function hasVisualModel(variant) {
  return Object.hasOwn(SCENE_BUILDERS, variant)
}

export default function CalculationVisualModel({
  variant,
  model,
  reasoning,
  subject = 'Maths',
  accent,
  reducedMotion,
  onContinue,
}) {
  const theme = SUBJECTS[subject] || SUBJECTS.Maths
  const resolvedAccent = accent || theme.accent
  const roles = useMemo(() => createCalculationVisualRoles(theme), [theme])
  const systemReducedMotion = usePrefersReducedMotion()
  const prefersReducedMotion = reducedMotion ?? systemReducedMotion

  const scenes = useMemo(
    () => SCENE_BUILDERS[variant]({ model, reasoning, roles, accent: resolvedAccent }),
    [variant, model, reasoning, roles, resolvedAccent],
  )

  const [index, setIndex] = useState(0)
  const [sceneStates, setSceneStates] = useState(
    () => Object.fromEntries(scenes.map(scene => [scene.id, scene.initialState ?? {}])),
  )
  const [resolvedScenes, setResolvedScenes] = useState({})
  const [announcement, setAnnouncement] = useState('')
  const lastAnnouncedScene = useRef(null)

  const scene = scenes[Math.min(index, scenes.length - 1)]
  const isLastScene = index === scenes.length - 1
  const sceneResolved = Boolean(resolvedScenes[scene.id])
  const gateOpen = !scene.requiresDecision || sceneResolved

  // Entering a scene announces what changed, not the whole screen.
  useEffect(() => {
    if (lastAnnouncedScene.current === scene.id) return
    lastAnnouncedScene.current = scene.id
    setAnnouncement(scene.announce ?? `${scene.label}. ${scene.heading}`)
  }, [scene])

  function setSceneState(nextState) {
    setSceneStates(current => ({
      ...current,
      [scene.id]: typeof nextState === 'function' ? nextState(current[scene.id] ?? {}) : nextState,
    }))
  }

  function resolveScene() {
    setResolvedScenes(current => ({ ...current, [scene.id]: true }))
  }

  function advance() {
    if (!isLastScene) setIndex(current => current + 1)
    else onContinue?.()
  }

  function goBack() {
    if (index > 0) setIndex(current => current - 1)
  }

  const revealedReasoning = scenes
    .slice(0, index + 1)
    .flatMap(item => item.reasoning ?? [])

  const completed = scenes.slice(0, index).filter(item => item.summary)

  return (
    <>
      <div style={stageHeaderStyle}>
        <span style={{ ...TYPE.label, color: resolvedAccent }}>{scene.label}</span>
      </div>

      <div aria-live="polite" style={visuallyHidden}>{announcement}</div>

      {completed.length > 0 && (
        <CompletedTrail items={completed} roles={roles} />
      )}

      <div
        key={scene.id}
        data-cb-scene={scene.id}
        data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
        style={{
          padding: `${SPACING.compact}px ${SPACING.standard}px 0`,
          animation: prefersReducedMotion
            ? undefined
            : `cb-scene-in ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
        }}
      >
        {/* Settles in rather than fading up from nothing — content is legible
            for the whole of the transition, never briefly invisible. */}
        <style>{'@keyframes cb-scene-in { from { opacity: 0.55 } to { opacity: 1 } }'}</style>

        <h2 style={{ ...TYPE.displaySection, color: roles.textPrimary, margin: 0 }}>
          {scene.heading}
        </h2>
        {scene.intro && <p style={{ ...bodyStyle, marginTop: SPACING.micro }}>{scene.intro}</p>}

        <div style={{ marginTop: SPACING.standard }}>
          {scene.render({
            state: sceneStates[scene.id] ?? {},
            setState: setSceneState,
            resolved: sceneResolved,
            resolve: resolveScene,
            announce: setAnnouncement,
            prefersReducedMotion,
            roles,
            accent: resolvedAccent,
          })}
        </div>
      </div>

      {revealedReasoning.length > 0 && (
        <ReasoningPanel
          items={revealedReasoning}
          accent={resolvedAccent}
          style={{ margin: `${SPACING.standard}px ${SPACING.standard}px 0` }}
        />
      )}

      <PhaseActions
        onContinue={advance}
        onBack={index > 0 ? goBack : undefined}
        accent={resolvedAccent}
        label={scene.continueLabel ?? (isLastScene ? 'Next challenge' : 'Continue')}
        disabled={!gateOpen}
        backLabel="Review previous step"
      />
    </>
  )
}

/**
 * Scenes already worked through stay visible, but quietly — one line each, no
 * figures, no controls. The learner can see the path taken without it
 * competing with the scene that currently has the job.
 */
function CompletedTrail({ items, roles }) {
  return (
    <ol style={{
      listStyle: 'none',
      margin: 0,
      padding: `${SPACING.compact}px ${SPACING.standard}px 0`,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      {items.map(item => (
        <li key={item.id} style={{ display: 'flex', gap: SPACING.micro, alignItems: 'baseline' }}>
          <span style={{ ...TYPE.caption, color: roles.textMuted, flexShrink: 0 }}>Done</span>
          <span style={{ ...TYPE.caption, color: roles.textSecondary, minWidth: 0 }}>{item.summary}</span>
        </li>
      ))}
    </ol>
  )
}

