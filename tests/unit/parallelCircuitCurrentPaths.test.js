import { describe, expect, it } from 'vitest'
import {
  PARALLEL_BRANCHES_CIRCUIT,
  getCircuitPresentationState,
  matchesCircuitCondition,
} from '../../src/components/learning/circuit/circuitPresets.js'

function path(id) {
  return PARALLEL_BRANCHES_CIRCUIT.currentPaths.find(currentPath => currentPath.id === id)
}

function active(id, states) {
  return matchesCircuitCondition(path(id)?.activeWhen, states)
}

describe('parallel circuit current-path fidelity', () => {
  it('splits shared and upper rails so only segments in a complete loop activate', () => {
    expect(path('current-shared-rails')?.d).toBe('M50,145 V120 M310,120 V210 H50 V179')
    expect(path('current-upper-rails')?.d).toBe('M50,120 V50 M310,50 V120')
  })

  it('does not show current above Branch B when only Branch B is complete', () => {
    const states = { 'switch-a': false, 'switch-b': true }

    expect(active('current-shared-rails', states)).toBe(true)
    expect(active('current-upper-rails', states)).toBe(false)
    expect(active('current-branch-a', states)).toBe(false)
    expect(active('current-branch-b', states)).toBe(true)
  })

  it('shows the upper rails only when the upper branch forms a complete loop', () => {
    const states = { 'switch-a': true, 'switch-b': false }

    expect(active('current-shared-rails', states)).toBe(true)
    expect(active('current-upper-rails', states)).toBe(true)
    expect(active('current-branch-a', states)).toBe(true)
    expect(active('current-branch-b', states)).toBe(false)
  })

  it('shows no current path when neither branch forms a complete loop', () => {
    const states = { 'switch-a': false, 'switch-b': false }

    for (const currentPath of PARALLEL_BRANCHES_CIRCUIT.currentPaths) {
      expect(matchesCircuitCondition(currentPath.activeWhen, states)).toBe(false)
    }
  })

  it('states explicitly that an open branch carries no current anywhere', () => {
    const onlyA = getCircuitPresentationState(PARALLEL_BRANCHES_CIRCUIT, {
      'switch-a': true,
      'switch-b': false,
    })
    const onlyB = getCircuitPresentationState(PARALLEL_BRANCHES_CIRCUIT, {
      'switch-a': false,
      'switch-b': true,
    })

    expect(onlyA.explanation).toContain('No current flows anywhere in open Branch B')
    expect(onlyB.explanation).toContain('No current flows anywhere in open Branch A')
  })
})
