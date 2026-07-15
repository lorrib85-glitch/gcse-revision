import { describe, it, expect } from 'vitest'
import {
  buildOppositeRevealSequence,
  deriveOppositeRevealState,
  getOppositeRevealDurations,
} from '../../src/components/learning/oppositeQualitiesReveal.js'
import {
  OPPOSITE_REVEAL_PAIRS,
  resolveOppositeRevealVisuals,
} from '../../src/components/learning/oppositeQualitiesRevealTheme.js'
import canonicalEpisode from '../../src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js'
import runtimeEpisode from '../../src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js'
import { MODULES } from '../../src/modules.js'

const hotCold = {
  type: 'oppositeQualitiesReveal',
  title: 'Hot or cold?',
  copy: 'Doctors used symptoms to decide which quality was strongest.',
  visualPair: 'warmCool',
  leftConcept: { label: 'Hot', items: ['Fever', 'Red face', 'Flushed skin'] },
  rightConcept: { label: 'Cold', items: ['Pale skin', 'Chills', 'Shivering'] },
  sequence: [
    { item: 'Fever', side: 'left' },
    { item: 'Chills', side: 'right' },
    { item: 'Red face', side: 'left' },
    { item: 'Pale skin', side: 'right' },
    { item: 'Flushed skin', side: 'left' },
    { item: 'Shivering', side: 'right' },
  ],
}

const wetDry = {
  type: 'oppositeQualitiesReveal',
  title: 'Wet or dry?',
  copy: 'The same idea was used for symptoms linked to moisture.',
  visualPair: 'wetDry',
  leftConcept: { label: 'Wet', items: ['Sweating', 'Runny nose', 'Watery eyes', 'Phlegm'] },
  rightConcept: { label: 'Dry', items: ['Cracked lips', 'Dry cough', 'Thirst'] },
  sequence: [
    { item: 'Sweating', side: 'left' },
    { item: 'Cracked lips', side: 'right' },
    { item: 'Runny nose', side: 'left' },
    { item: 'Dry cough', side: 'right' },
    { item: 'Watery eyes', side: 'left' },
    { item: 'Thirst', side: 'right' },
    { item: 'Phlegm', side: 'left' },
  ],
}

const historyTheme = {
  accent: '#D69B45',
  accentRgb: '214,155,69',
}

describe('opposite qualities reveal sequencing', () => {
  it('groups configured symptoms under their final side', () => {
    const sequence = buildOppositeRevealSequence(hotCold)
    expect(sequence.map(step => step.item)).toEqual(['Fever', 'Chills', 'Red face', 'Pale skin', 'Flushed skin', 'Shivering'])
    expect(sequence.filter(step => step.side === 'left').map(step => step.item)).toEqual(['Fever', 'Red face', 'Flushed skin'])
    expect(sequence.filter(step => step.side === 'right').map(step => step.item)).toEqual(['Chills', 'Pale skin', 'Shivering'])
    expect(sequence[0].conceptLabel).toBe('Hot')
    expect(sequence[1].conceptLabel).toBe('Cold')
  })

  it('derives movement direction from side configuration rather than concept labels', () => {
    const swapped = {
      ...hotCold,
      leftConcept: { label: 'Cold', items: ['Chills'] },
      rightConcept: { label: 'Hot', items: ['Fever'] },
      sequence: [{ item: 'Fever', side: 'right' }, { item: 'Chills', side: 'left' }],
    }
    expect(buildOppositeRevealSequence(swapped).map(step => step.direction)).toEqual(['right', 'left'])
  })

  it('uses the same component contract for Hot/Cold and Wet/Dry', () => {
    expect(buildOppositeRevealSequence(hotCold)).toHaveLength(6)
    expect(buildOppositeRevealSequence(wetDry)).toHaveLength(7)
  })

  it('keeps reusable sequencing helpers free of Galen-specific words', () => {
    const source = buildOppositeRevealSequence.toString() + deriveOppositeRevealState.toString()
    expect(source).not.toMatch(/Galen|Hot|Cold|Wet|Dry|Fever|Phlegm/i)
  })

  it('reduced-motion state is immediately complete and readable', () => {
    const view = deriveOppositeRevealState(hotCold, { settledCount: 0, activeIndex: 0, reducedMotion: true })
    expect(view.complete).toBe(true)
    expect(view.leftItems).toEqual(['Fever', 'Red face', 'Flushed skin'])
    expect(view.rightItems).toEqual(['Chills', 'Pale skin', 'Shivering'])
    expect(view.active).toBe(null)
  })

  it('sequence order is deterministic and next item waits for read, travel and settle', () => {
    expect(buildOppositeRevealSequence(wetDry)).toEqual(buildOppositeRevealSequence(wetDry))
    const timings = getOppositeRevealDurations({ read: '420ms', travel: '720ms', settle: '280ms' })
    expect(timings.nextDelay).toBe(timings.read + timings.travel + timings.settle)
  })
})

describe('opposite qualities reveal visual roles', () => {
  it('gives warm and cool concepts distinct restrained identities', () => {
    const visuals = resolveOppositeRevealVisuals(hotCold, historyTheme)

    expect(visuals.pairId).toBe('warmCool')
    expect(visuals.leftAccent).toBe(OPPOSITE_REVEAL_PAIRS.warmCool.leftAccent)
    expect(visuals.rightAccent).toBe(OPPOSITE_REVEAL_PAIRS.warmCool.rightAccent)
    expect(visuals.leftAccent).not.toBe(visuals.rightAccent)
    expect(visuals.leftDestinationGlow).not.toBe(visuals.rightDestinationGlow)
    expect(visuals.leftZoneActive).not.toBe(visuals.leftZoneIdle)
    expect(visuals.rightZoneActive).not.toBe(visuals.rightZoneIdle)
    expect(visuals.sharedAccent).toBe(historyTheme.accent)
  })

  it('uses a separate wet-dry pair without changing reveal mechanics', () => {
    const visuals = resolveOppositeRevealVisuals(wetDry, historyTheme)

    expect(visuals.pairId).toBe('wetDry')
    expect(visuals.leftAccent).toBe(OPPOSITE_REVEAL_PAIRS.wetDry.leftAccent)
    expect(visuals.rightAccent).toBe(OPPOSITE_REVEAL_PAIRS.wetDry.rightAccent)
    expect(visuals.fullScreenOverlay).toContain(visuals.leftRgb)
    expect(visuals.fullScreenOverlay).toContain(visuals.rightRgb)
    expect(buildOppositeRevealSequence(wetDry).map(step => step.direction)).toEqual([
      'left', 'right', 'left', 'right', 'left', 'right', 'left',
    ])
  })

  it('falls back to the subject accent when no semantic pair is configured', () => {
    const visuals = resolveOppositeRevealVisuals({}, historyTheme)

    expect(visuals.pairId).toBe('subject')
    expect(visuals.leftAccent).toBe(historyTheme.accent)
    expect(visuals.rightAccent).toBe(historyTheme.accent)
  })
})

describe('episode 1 opposite qualities integration', () => {
  it('keeps the canonical reveal data and composes runtime screens through the teach shell', () => {
    const canonicalReveals = canonicalEpisode.screens.filter(
      screen => screen.type === 'oppositeQualitiesReveal'
    )
    expect(canonicalReveals.map(screen => screen.title)).toEqual(['Hot or cold?', 'Wet or dry?'])

    const runtimeReveals = runtimeEpisode.screens.filter(
      screen => screen.blocks?.some(block => block.type === 'oppositeQualitiesReveal')
    )
    expect(runtimeReveals.map(screen => screen.heading)).toEqual(['Hot or cold?', 'Wet or dry?'])
    expect(runtimeReveals.every(screen => screen.shell === 'teach')).toBe(true)
    expect(runtimeReveals.map(screen => screen.blocks[0].title)).toEqual(['Hot or cold?', 'Wet or dry?'])
    expect(runtimeReveals.map(screen => screen.blocks[0].visualPair)).toEqual(['warmCool', 'wetDry'])
    expect(runtimeReveals.every(screen => Boolean(screen.blocks[0].backgroundImage))).toBe(true)
    expect(runtimeReveals.every(screen => screen.blocks[0].backgroundMode === 'screen')).toBe(true)
    expect(runtimeEpisode.screens.some(screen => screen.type === 'oppositeQualitiesReveal')).toBe(false)
    expect(runtimeEpisode.screens.some(screen => screen.type === 'symptomQualityDiagnostic')).toBe(false)
  })

  it('keeps module metadata aligned with runtime screen count and navigation', () => {
    const meta = MODULES.find(mod => mod.id === canonicalEpisode.id)
    expect(meta.screenCount).toBe(runtimeEpisode.screens.length)
    expect(meta.screenTags).toHaveLength(runtimeEpisode.screens.length)
    expect(runtimeEpisode.stageNavigation.map(stage => stage.screenIndex)).toEqual([0, 1, 7, 12, 25, 28])
  })
})
