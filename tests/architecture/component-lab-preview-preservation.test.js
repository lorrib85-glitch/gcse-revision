import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { LAB_ADAPTERS } from '../../src/dev/componentReview/labAdapters.jsx'
import { SYSTEM_REFERENCE_ITEM_IDS } from '../../src/dev/systemReference/SystemReference.jsx'

// ─── Nothing was silently dropped ────────────────────────────────────────────
//
// Phase 4 deliberately changed the Lab's population, so "nothing changed" is
// not the test. This is: every one of the 49 previews and 60 variants captured
// in the pre-Phase-4 baseline has a stated destination, and the destination is
// asserted rather than described.
//
// Three destinations exist, and no fourth:
//   • `lab`     — still a Lab selection, under its authoring key;
//   • `variant` — collapsed into another selection's variant, because it always
//                 shared that selection's authoring contract;
//   • `system`  — rehomed on System reference, because it is not an authoring
//                 choice.
//
// "Deleted" is not a destination. The mapping below is exhaustive and is
// checked against the baseline for both over- and under-coverage, so a future
// change that quietly removes a preview fails here with its name.

const root = resolve(process.cwd())
const baseline = JSON.parse(
  readFileSync(resolve(root, '.planning/phase-4-component-lab/baselines/current-lab-manifest.json'), 'utf8'),
)

const lab = key => ({ to: 'lab', key })
const variantOf = (key, variant) => ({ to: 'variant', key, variant })
const system = id => ({ to: 'system', id })

/** Every pre-Phase-4 Lab entry id → where its preview lives now. */
const DESTINATIONS = {
  'cinematic-carousel': lab('screen:cinematicCarousel'),
  // Two entries, one component, one contract, one `chartType` field.
  'graph-view-scatter': variantOf('block:graphView', 'scatter'),
  'graph-view-line': variantOf('block:graphView', 'line'),
  'timeline-chain': lab('screen:timelineChain'),
  // One entry covering two components becomes the two authoring types they are.
  'circuit-diagram': lab('block:circuitDiagram'),
  'opposite-qualities-reveal': lab('screen:oppositeQualitiesReveal'),
  'timeline-canvas': lab('screen:timelineCanvas'),
  'before-after-slider': lab('screen:beforeAfterSlider'),
  'ordered-route-task': lab('screen:orderedRouteTask'),
  'spot-the-error': lab('block:spotTheError'),
  'centre-image-reveal': lab('screen:centreImageReveal'),
  'acronym-memorise': lab('block:acronymMemorise'),
  'flashcards-block': lab('block:flashcards'),
  // Three entries, one component, one contract, three layouts.
  'builder-block': variantOf('block:builder', 'reaction'),
  'builder-block-maths': variantOf('block:builder', 'equation'),
  'builder-block-quote': variantOf('block:builder', 'quote'),
  'matching-task': lab('screen:matchingTask'),
  'visual-learning': lab('screen:visualLearning'),
  'guided-choice-carousel': lab('screen:guidedChoiceCarousel'),
  'theory-compare': lab('block:theoryCompare'),
  // Rebound from the derived screen route to the active block entry (D0).
  'misconception-check': lab('block:misconceptionCheck'),
  'factor-web': lab('screen:factorWeb'),
  'infographic': lab('screen:infographic'),
  'interactive-hotspot-image': variantOf('screen:interactiveImage', 'detail'),
  'interactive-hotspot-image-reveal': variantOf('screen:interactiveImage', 'reveal'),
  'cinematic-reveal-moment': lab('screen:cinematic'),
  'memory-hook': lab('block:memoryHook'),
  'concept-reveal': lab('screen:conceptReveal'),
  'explain-reveal': lab('block:explainReveal'),
  'col-sort-block': lab('block:colsort'),
  'quote-analyser': lab('screen:quoteAnalyser'),
  'key-figure-reveal': lab('screen:keyFigureReveal'),
  'face-the-examiner': lab('screen:faceExaminer'),
  'guided-exam-response': lab('screen:guidedExamResponse'),
  'buttons-and-progress': system('buttons-and-progress'),
  'chapter-outcome-screen': system('chapter-outcome-screen'),
  'chapter-complete-screen': system('chapter-complete-screen'),
  'chapter-hook-screen': system('chapter-hook-screen'),
  'fill-in-the-blanks': lab('block:fillblanks'),
  'swipe-sort': lab('screen:naturalSupernaturalSwipe'),
  'quick-recall-screen': lab('screen:quickRecall'),
  'examiner-explains-screen': lab('screen:examinerExplains'),
  'tiered-quiz-screen': lab('screen:tieredquiz'),
  'weak-spot-recovery': system('weak-spot-recovery'),
  'calculation-breakdown': lab('screen:calculationBreakdown'),
  'angle-explore': lab('block:angleFigure'),
  'area-perimeter-explore': lab('block:areaPerimeterFigure'),
  'coordinate-plane-explore': lab('block:coordinatePlaneFigure'),
  'number-line-explore': lab('block:numberLineFigure'),
}

/**
 * The one preview that was reached through a variant slot rather than an entry:
 * `circuit-diagram`'s `symbol-reference` variant mounted a different component.
 * Phase 4 gave that component its own authoring type, so the variant became a
 * selection of its own — the only variant in the baseline that did.
 */
const PROMOTED_VARIANTS = {
  'circuit-diagram/symbol-reference': 'block:circuitSymbolReference',
}

const previewIds = adapter => [
  ...(adapter.modes ?? []).map(mode => mode.id),
  ...(adapter.variants ?? []).map(variant => variant.id),
]

describe('the baseline is what we think it is', () => {
  it('captured 49 entries and 60 variants', () => {
    expect(baseline.totals).toEqual({
      entries: 49, entriesWithVariants: 7, variants: 60, selectableUnits: 102,
    })
  })
})

describe('every pre-Phase-4 preview has a stated destination', () => {
  it('maps exactly the baseline entries — no more, no fewer', () => {
    const baselineIds = baseline.entries.map(entry => entry.id).sort()
    expect(Object.keys(DESTINATIONS).sort()).toEqual(baselineIds)
  })

  for (const entry of baseline.entries) {
    const destination = DESTINATIONS[entry.id]

    it(`${entry.id} → ${destination.to}`, () => {
      if (destination.to === 'system') {
        expect(SYSTEM_REFERENCE_ITEM_IDS, `${entry.id} must be previewable on System reference`)
          .toContain(destination.id)
        return
      }

      const adapter = LAB_ADAPTERS[destination.key]
      expect(adapter, `${entry.id} → ${destination.key} must exist`).toBeDefined()
      expect(typeof adapter.render).toBe('function')

      if (destination.to === 'variant') {
        expect(previewIds(adapter), `${entry.id} must survive as a variant of ${destination.key}`)
          .toContain(destination.variant)
      }
    })
  }
})

describe('every pre-Phase-4 variant survives', () => {
  const entriesWithVariants = baseline.entries.filter(entry => (entry.variants?.length ?? 0) > 0)

  it('covers all seven entries that had variants', () => {
    expect(entriesWithVariants.map(entry => entry.id).sort()).toEqual([
      'angle-explore', 'area-perimeter-explore', 'calculation-breakdown',
      'circuit-diagram', 'coordinate-plane-explore', 'guided-exam-response',
      'number-line-explore',
    ])
  })

  for (const entry of entriesWithVariants) {
    it(`${entry.id} keeps all ${entry.variants.length} of its variants`, () => {
      const destination = DESTINATIONS[entry.id]
      const adapter = LAB_ADAPTERS[destination.key]
      const surviving = new Set(previewIds(adapter))

      const missing = entry.variants
        .map(variant => variant.id)
        .filter(id => !surviving.has(id))
        // A variant may have been promoted to its own selection instead.
        .filter(id => !(`${entry.id}/${id}` in PROMOTED_VARIANTS))

      expect(missing, `${entry.id} dropped these previews`).toEqual([])
    })
  }

  it('promotes the one variant that mounted a different component', () => {
    for (const [origin, key] of Object.entries(PROMOTED_VARIANTS)) {
      const [entryId, variantId] = origin.split('/')
      const captured = baseline.entries.find(entry => entry.id === entryId)
      expect(captured.variants.some(variant => variant.id === variantId), origin).toBe(true)
      expect(LAB_ADAPTERS[key], `${origin} must now be its own selection`).toBeDefined()
    }
  })

  it('adds previews rather than only removing them', () => {
    // The Lab gained sixteen selections it never had, including the two
    // most-used authorable types in the codebase.
    const total = Object.values(LAB_ADAPTERS)
      .reduce((count, adapter) => count + Math.max(1, previewIds(adapter).length + (adapter.presentations?.length ?? 0)), 0)
    expect(total).toBeGreaterThan(baseline.totals.selectableUnits)
    for (const key of ['block:read', 'block:quiz', 'block:keypoint', 'screen:standard']) {
      expect(LAB_ADAPTERS[key], `${key} must now be selectable`).toBeDefined()
    }
  })
})
