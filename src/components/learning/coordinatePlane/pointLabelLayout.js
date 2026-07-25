// ─── Shared point label placement ────────────────────────────────────────────
//
// Transformations put up to eight labelled points on one plane, so label
// placement is shared infrastructure rather than per-preset offsets. Presets
// supply model meaning; this file decides where text can physically go.
//
// SVG text cannot be measured before paint, so chip boxes are estimated from
// character count — deliberately slightly generous, the same trade-off
// NumberLineExplore makes. A chip a few pixels wide of its text reads as
// deliberate; a clipped one does not.

const CHAR_WIDTH = 7.4
const CHIP_PADDING = 10
const CHIP_MIN_WIDTH = 20
const CHIP_HEIGHT = 18
const ANCHOR_RADIUS = 14

const ANCHOR_OFFSETS = {
  NE: { x: 1, y: -1 },
  NW: { x: -1, y: -1 },
  SE: { x: 1, y: 1 },
  SW: { x: -1, y: 1 },
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  W: { x: -1, y: 0 },
}

export function estimateChipBox(text) {
  const width = Math.max(CHIP_MIN_WIDTH, String(text).length * CHAR_WIDTH + CHIP_PADDING)
  return { width, height: CHIP_HEIGHT }
}

/**
 * Eight anchors in preference order, biased outward: a point in the top-right
 * of the plot prefers NE, so labels lean away from the figure rather than
 * across it.
 */
export function candidateAnchors(point, plot) {
  const towardRight = point.x >= plot.x + plot.width / 2
  const towardBottom = point.y >= plot.y + plot.height / 2

  const vertical = towardBottom ? 'S' : 'N'
  const horizontal = towardRight ? 'E' : 'W'
  const oppositeVertical = towardBottom ? 'N' : 'S'
  const oppositeHorizontal = towardRight ? 'W' : 'E'

  return [
    `${vertical}${horizontal}`,
    `${oppositeVertical}${horizontal}`,
    `${vertical}${oppositeHorizontal}`,
    `${oppositeVertical}${oppositeHorizontal}`,
    horizontal,
    vertical,
    oppositeHorizontal,
    oppositeVertical,
  ]
}

function boxAt(point, anchor, size) {
  const offset = ANCHOR_OFFSETS[anchor]
  const centreX = point.x + offset.x * (ANCHOR_RADIUS + size.width / 2)
  const centreY = point.y + offset.y * (ANCHOR_RADIUS + size.height / 2)

  return {
    x: centreX - size.width / 2,
    y: centreY - size.height / 2,
    width: size.width,
    height: size.height,
  }
}

function clampIntoPlot(box, plot) {
  return {
    ...box,
    x: Math.min(Math.max(box.x, plot.x), plot.x + plot.width - box.width),
    y: Math.min(Math.max(box.y, plot.y), plot.y + plot.height - box.height),
  }
}

function overlapArea(a, b) {
  const width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  const height = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
  return width > 0 && height > 0 ? width * height : 0
}

function bestPlacement(point, text, plot, taken) {
  const size = estimateChipBox(text)
  const anchors = candidateAnchors(point, plot)
  let fallback = null

  for (const anchor of anchors) {
    const box = clampIntoPlot(boxAt(point, anchor, size), plot)
    const collision = taken.reduce((total, other) => total + overlapArea(box, other), 0)

    if (collision === 0) return { anchor, box, collision: 0, clear: true }
    if (!fallback || collision < fallback.collision) {
      fallback = { anchor, box, collision, clear: false }
    }
  }
  return fallback
}

/**
 * Places labels in priority order, degrading to each label's short form rather
 * than allowing a collision. Degradation beats displacement: a shortened label
 * beside its point is readable, a full label pushed somewhere else is
 * misleading.
 */
export function layoutPointLabels(labels, { plot, obstacles = [] } = {}) {
  const taken = [...obstacles]

  return [...labels]
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
    .map((label) => {
      const point = { x: label.x, y: label.y }
      const full = bestPlacement(point, label.text, plot, taken)

      if (full.clear) {
        taken.push(full.box)
        return {
          id: label.id,
          text: label.text,
          degraded: false,
          anchor: full.anchor,
          box: full.box,
        }
      }

      const short = label.shortText ?? label.text
      const shortened = bestPlacement(point, short, plot, taken)

      // When neither form is clear, take whichever overlaps least — which is
      // essentially always the short one.
      //
      // Preferring the full label here would make degradation non-monotone:
      // a lightly crowded plot would shorten labels while a heavily crowded
      // one kept them long, so the figures needing the most help would get the
      // least. Falling back by overlap keeps "more crowded" and "more
      // degraded" moving in the same direction.
      const useShort = shortened.clear
        || (short !== label.text && shortened.collision < full.collision)

      const winner = useShort ? shortened : full

      taken.push(winner.box)
      return {
        id: label.id,
        text: useShort ? short : label.text,
        degraded: useShort,
        anchor: winner.anchor,
        box: winner.box,
      }
    })
}
