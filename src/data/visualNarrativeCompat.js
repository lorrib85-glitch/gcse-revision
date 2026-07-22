// Compatibility mapping: legacy `visualNarrative` screens → a TimelineChain
// `reveal` variant block. Kept OUTSIDE the visual component (per the refactor brief)
// so persisted or legacy lesson data that still carries `type: 'visualNarrative'`
// renders through the single reveal renderer without the old component existing.
//
// Structural mapping rule (content-agnostic — no medieval/history specifics):
//   • a beat with a `headline` → one step: { statement: headline, detail: body OR facts }
//       (a headline is a whole statement; body is its supporting explanation; when a
//        headline beat carries only facts, those facts become the supporting detail)
//   • a beat with `facts` but no `headline` → one step per fact (short statements)
//   • a beat `conclusion` → the takeaway on the final beat, otherwise a step
// The reveal step's primary field is `statement` (body copy), never the heading key
// `label`, so migrated sentences are not scanned by the sentence-case heading guard.
// Beat images and positioned highlights are intentionally dropped: the reveal variant
// is a calm vertical sequence, not the old full-bleed cinematic surface.

function factsToDetail(facts) {
  return facts.join('\n')
}

export function visualNarrativeToRevealChain(screen = {}) {
  const beats = Array.isArray(screen.beats) ? screen.beats : []
  const steps = []
  let takeaway = null
  let source = null

  beats.forEach((beat, beatIndex) => {
    const isLastBeat = beatIndex === beats.length - 1
    const hasFacts = Array.isArray(beat.facts) && beat.facts.length > 0

    if (beat.source) source = beat.source

    if (beat.headline) {
      const detail = beat.body
        ? beat.body
        : hasFacts
          ? factsToDetail(beat.facts)
          : undefined
      steps.push({
        id: `beat-${beatIndex}`,
        statement: beat.headline,
        ...(detail ? { detail } : {}),
      })
    } else if (hasFacts) {
      beat.facts.forEach((fact, factIndex) => {
        steps.push({ id: `beat-${beatIndex}-fact-${factIndex}`, statement: fact })
      })
    } else if (beat.body) {
      steps.push({ id: `beat-${beatIndex}`, statement: beat.body })
    }

    if (beat.conclusion) {
      if (isLastBeat) takeaway = beat.conclusion
      else steps.push({ id: `beat-${beatIndex}-conclusion`, statement: beat.conclusion })
    }
  })

  return {
    type: 'timelineChain',
    variant: 'reveal',
    ...(screen.title ? { title: screen.title } : {}),
    ...(screen.intro ? { intro: screen.intro } : {}),
    ...(source ? { source } : {}),
    steps,
    ...(takeaway ? { takeaway } : {}),
  }
}
