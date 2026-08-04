import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = relativePath => readFileSync(resolve(root, relativePath), 'utf8')

const DYNAMIC_CINEMATIC_SURFACES = [
  {
    name: 'chapter hook reveal',
    path: 'src/components/layout/ChapterHookScreen.jsx',
    scrollMarker: 'data-chapter-hook-reveal-scroll',
  },
  {
    name: 'guided choice reveal',
    path: 'src/components/learning/GuidedChoiceCarousel.jsx',
    scrollMarker: 'overflowY: \'auto\'',
  },
  {
    name: 'chapter outcome',
    path: 'src/components/layout/ChapterOutcomeScreen.jsx',
    scrollMarker: 'data-chapter-outcome-scroll',
  },
]

describe('dynamic cinematic action layout', () => {
  it.each(DYNAMIC_CINEMATIC_SURFACES)(
    '$name keeps variable-length copy separate from its progression action',
    ({ path, scrollMarker }) => {
      const source = read(path)
      const cinematicActions = source.match(/<CinematicContinueCTA\b/g) || []

      expect(cinematicActions.length).toBeGreaterThan(0)
      expect(source).toContain(scrollMarker)
      expect(source).toMatch(/<CinematicContinueCTA[\s\S]*?layout="inline"/)
    },
  )
})
