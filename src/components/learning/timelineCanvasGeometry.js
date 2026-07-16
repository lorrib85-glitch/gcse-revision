const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/**
 * Derive the spatial journey geometry from the actual canvas region rather than
 * from the browser viewport. This keeps TimelineCanvas correct inside the real
 * full-screen shell and inside the scaled 390px Component Review Lab viewport.
 */
export function getTimelineCanvasGeometry({
  width = 390,
  height = 480,
  stepCount = 0,
} = {}) {
  const viewportWidth = Math.max(280, Number(width) || 390)
  const canvasHeight = Math.max(240, Number(height) || 480)
  const cardWidth = Math.round(clamp(viewportWidth * 0.62, 196, 244))
  const statsHeight = Math.round(clamp(canvasHeight * 0.11, 48, 58))
  const mediaHeight = Math.round(clamp(cardWidth * 0.68, 138, 168))
  const cardHeight = mediaHeight + statsHeight
  const stepGap = Math.round(clamp(viewportWidth * 0.78, 260, 330))
  const edgePadding = viewportWidth / 2

  const maximumSafeStagger = Math.max(0, (canvasHeight - cardHeight) / 2 - 16)
  const preferredStagger = clamp(canvasHeight * 0.13, 24, 72)
  const stagger = Math.round(Math.min(preferredStagger, maximumSafeStagger))

  const centers = Array.from({ length: Math.max(0, stepCount) }, (_, index) => ({
    x: edgePadding + index * stepGap,
    y: canvasHeight / 2 + (index % 2 === 0 ? -stagger : stagger),
  }))

  return {
    viewportWidth,
    canvasHeight,
    cardWidth,
    mediaHeight,
    statsHeight,
    cardHeight,
    stepGap,
    edgePadding,
    stagger,
    centers,
    canvasWidth: edgePadding * 2 + Math.max(stepCount - 1, 0) * stepGap,
  }
}
