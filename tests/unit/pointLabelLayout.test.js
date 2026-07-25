import { describe, expect, it } from 'vitest'
import {
  candidateAnchors,
  estimateChipBox,
  layoutPointLabels,
} from '../../src/components/learning/coordinatePlane/pointLabelLayout.js'

const PLOT = { x: 0, y: 0, width: 360, height: 300 }

describe('chip box estimation', () => {
  it('grows with character count', () => {
    const short = estimateChipBox('A')
    const long = estimateChipBox("A' (5, 4)")

    expect(long.width).toBeGreaterThan(short.width)
    expect(short.height).toBe(long.height)
  })

  it('never falls below a legible minimum width', () => {
    expect(estimateChipBox('').width).toBeGreaterThanOrEqual(20)
  })
})

describe('candidate anchors', () => {
  it('prefers outward anchors for a point in the top-right of the plot', () => {
    expect(candidateAnchors({ x: 300, y: 40 }, PLOT)[0]).toBe('NE')
  })

  it('prefers outward anchors for a point in the bottom-left of the plot', () => {
    expect(candidateAnchors({ x: 40, y: 260 }, PLOT)[0]).toBe('SW')
  })

  it('always offers all eight anchors', () => {
    const anchors = candidateAnchors({ x: 180, y: 150 }, PLOT)

    expect(anchors).toHaveLength(8)
    expect(new Set(anchors).size).toBe(8)
  })
})

describe('label layout', () => {
  it('places a lone label at its preferred anchor', () => {
    const [placed] = layoutPointLabels(
      [{ id: 'a', x: 300, y: 40, text: '(5, 4)', shortText: 'A', priority: 0 }],
      { plot: PLOT },
    )

    expect(placed.id).toBe('a')
    expect(placed.anchor).toBe('NE')
    expect(placed.degraded).toBe(false)
    expect(placed.text).toBe('(5, 4)')
  })

  it('keeps every placed box inside the plot', () => {
    const placed = layoutPointLabels(
      [
        { id: 'tl', x: 2, y: 2, text: '(−6, 6)', shortText: 'A', priority: 0 },
        { id: 'br', x: 358, y: 298, text: '(6, −6)', shortText: 'B', priority: 1 },
      ],
      { plot: PLOT },
    )

    for (const label of placed) {
      expect(label.box.x).toBeGreaterThanOrEqual(PLOT.x)
      expect(label.box.y).toBeGreaterThanOrEqual(PLOT.y)
      expect(label.box.x + label.box.width).toBeLessThanOrEqual(PLOT.x + PLOT.width)
      expect(label.box.y + label.box.height).toBeLessThanOrEqual(PLOT.y + PLOT.height)
    }
  })

  it('does not overlap two labels placed near one another', () => {
    const placed = layoutPointLabels(
      [
        { id: 'a', x: 180, y: 150, text: '(0, 0)', shortText: 'A', priority: 0 },
        { id: 'b', x: 186, y: 154, text: '(1, 1)', shortText: 'B', priority: 1 },
      ],
      { plot: PLOT },
    )

    const [first, second] = placed
    const overlaps = first.box.x < second.box.x + second.box.width
      && second.box.x < first.box.x + first.box.width
      && first.box.y < second.box.y + second.box.height
      && second.box.y < first.box.y + first.box.height

    expect(overlaps).toBe(false)
  })

  it('places in priority order regardless of input order', () => {
    const placed = layoutPointLabels(
      [
        { id: 'late', x: 180, y: 150, text: '(0, 0)', shortText: 'L', priority: 5 },
        { id: 'active', x: 180, y: 150, text: '(0, 0)', shortText: 'A', priority: 0 },
      ],
      { plot: PLOT },
    )

    expect(placed[0].id).toBe('active')
  })

  // Eight labelled points in a tight cluster is the real transformation case:
  // a reflection puts three object vertices and three image vertices, plus a
  // centre and a solution marker, on one plane. Long coordinate text is used
  // deliberately so degradation is decisive rather than marginal — a test that
  // passes with exactly one degraded label would flip to zero on any small
  // constant change, and the failure would look mysterious.
  it('degrades to the short label rather than colliding when crowded', () => {
    const crowd = Array.from({ length: 9 }, (_, index) => ({
      id: `p${index}`,
      x: 180 + (index % 3) * 4,
      y: 150 + Math.floor(index / 3) * 4,
      text: `A${index}' (−${index}, −${index})`,
      shortText: `P${index}`,
      priority: index,
    }))

    const placed = layoutPointLabels(crowd, { plot: PLOT })
    const degraded = placed.filter(label => label.degraded)

    // Nine long labels clustered in a 12px square cannot all keep full text.
    expect(degraded.length).toBeGreaterThanOrEqual(2)
    for (const label of degraded) {
      expect(label.text).toBe(crowd.find(item => item.id === label.id).shortText)
    }
  })

  // The invariant that matters more than any single count: crowding a plot
  // harder must never produce FEWER shortened labels. An earlier version fell
  // back to the least-overlapping FULL label when the short form also
  // collided, so the most crowded figures kept the longest text — exactly
  // backwards, and invisible to a test that only asserted "some degraded".
  it('degrades more, never less, as the plot gets tighter', () => {
    const degradedCount = (width, height) => {
      const plot = { x: 0, y: 0, width, height }
      const crowd = Array.from({ length: 8 }, (_, index) => ({
        id: `p${index}`,
        x: width / 2 + (index % 3) * 4,
        y: height / 2 + Math.floor(index / 3) * 4,
        text: `A${index}' (−${index}, −${index})`,
        shortText: `P${index}`,
        priority: index,
      }))
      return layoutPointLabels(crowd, { plot }).filter(label => label.degraded).length
    }

    const roomy = degradedCount(360, 300)
    const tight = degradedCount(160, 120)

    expect(tight).toBeGreaterThanOrEqual(roomy)
  })

  // The complement: a label must NOT degrade when it has room. Without this,
  // the degradation test above would still pass if everything degraded always.
  it('keeps the full label when there is room for it', () => {
    const placed = layoutPointLabels(
      [
        { id: 'a', x: 60, y: 60, text: "A' (−4, 3)", shortText: 'A', priority: 0 },
        { id: 'b', x: 300, y: 240, text: "B' (5, −2)", shortText: 'B', priority: 1 },
      ],
      { plot: PLOT },
    )

    for (const label of placed) {
      expect(label.degraded).toBe(false)
      expect(label.text).toContain('(')
    }
  })

  it('avoids supplied obstacles such as axis tick labels', () => {
    const obstacle = { x: 180, y: 120, width: 80, height: 40 }
    const [placed] = layoutPointLabels(
      [{ id: 'a', x: 180, y: 150, text: '(0, 0)', shortText: 'A', priority: 0 }],
      { plot: PLOT, obstacles: [obstacle] },
    )

    const overlapsObstacle = placed.box.x < obstacle.x + obstacle.width
      && obstacle.x < placed.box.x + placed.box.width
      && placed.box.y < obstacle.y + obstacle.height
      && obstacle.y < placed.box.y + placed.box.height

    expect(overlapsObstacle).toBe(false)
  })

  it('returns an empty array for no labels', () => {
    expect(layoutPointLabels([], { plot: PLOT })).toEqual([])
  })
})
