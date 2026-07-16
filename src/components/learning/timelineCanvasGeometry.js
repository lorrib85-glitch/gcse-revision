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

export function getNearestTimelineIndex({ centers = [], focusX = 0 } = {}) {
  if (!centers.length) return 0

  return centers.reduce((nearestIndex, center, index) => (
    Math.abs(center.x - focusX) < Math.abs(centers[nearestIndex].x - focusX)
      ? index
      : nearestIndex
  ), 0)
}

/**
 * Route arrival and card focus share the same distance model. A card begins as a
 * small, opaque waypoint, then grows to full size exactly as the active route
 * reaches its centre. The smoothstep curve keeps the approach calm rather than
 * making the card pop abruptly.
 */
export function getTimelineCardFocus({
  centerX = 0,
  focusX = 0,
  stepGap = 300,
  reducedMotion = false,
} = {}) {
  if (reducedMotion) {
    return {
      focus: 1,
      routeArrival: 1,
      scale: 1,
      brightness: 1,
    }
  }

  const distance = Math.abs(centerX - focusX)
  const rawFocus = 1 - clamp(distance / Math.max(stepGap * 0.82, 1), 0, 1)
  const focus = rawFocus * rawFocus * (3 - 2 * rawFocus)

  return {
    focus,
    routeArrival: focus,
    scale: 0.66 + focus * 0.34,
    brightness: 0.58 + focus * 0.42,
  }
}

export function getTimelineScrollLeft({
  centerX = 0,
  viewportWidth = 390,
  canvasWidth = 390,
} = {}) {
  const maximumScroll = Math.max(0, canvasWidth - viewportWidth)
  return clamp(centerX - viewportWidth / 2, 0, maximumScroll)
}

/**
 * When a detail sheet is open, preserve the journey geometry but shift the whole
 * route vertically so the selected card remains fully visible above the sheet.
 */
export function getTimelineDetailLayout({ geometry, openIndex = null } = {}) {
  if (!geometry || openIndex === null || !geometry.centers[openIndex]) {
    return {
      sheetHeight: 0,
      verticalOffset: 0,
      centers: geometry?.centers ?? [],
    }
  }

  const maximumSheetHeight = Math.max(72, geometry.canvasHeight - geometry.cardHeight - 24)
  const desiredSheetHeight = clamp(geometry.canvasHeight * 0.38, 136, 220)
  const sheetHeight = Math.round(Math.min(desiredSheetHeight, maximumSheetHeight))
  const visibleJourneyHeight = geometry.canvasHeight - sheetHeight
  const minimumCenter = geometry.cardHeight / 2 + 12
  const maximumCenter = visibleJourneyHeight - geometry.cardHeight / 2 - 12
  const selectedCenterY = maximumCenter >= minimumCenter
    ? clamp(visibleJourneyHeight / 2, minimumCenter, maximumCenter)
    : Math.max(geometry.cardHeight / 2, visibleJourneyHeight / 2)
  const verticalOffset = Math.round(selectedCenterY - geometry.centers[openIndex].y)

  return {
    sheetHeight,
    verticalOffset,
    centers: geometry.centers.map(center => ({
      ...center,
      y: center.y + verticalOffset,
    })),
  }
}
