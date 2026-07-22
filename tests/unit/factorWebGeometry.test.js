import { describe, expect, it } from 'vitest'
import { FACTOR_WEB_LAYOUT } from '../../src/constants/factorWeb.js'
import {
  getFactorConnectorPath,
  getFactorSlot,
  splitFactorColumns,
} from '../../src/components/learning/FactorWeb.jsx'

const connectorRadius = FACTOR_WEB_LAYOUT.focalRadius - FACTOR_WEB_LAYOUT.connectorUnderlap

describe('FactorWeb geometry', () => {
  it.each([
    { total: 4, left: 2, right: 2 },
    { total: 5, left: 3, right: 2 },
    { total: 6, left: 3, right: 3 },
  ])('balances $total factors across the two mobile columns', ({ total, left, right }) => {
    const factors = Array.from({ length: total }, (_, index) => ({ id: `factor-${index}` }))
    const columns = splitFactorColumns(factors)

    expect(columns.left).toHaveLength(left)
    expect(columns.right).toHaveLength(right)
  })

  it.each(['left', 'right'])('places every %s connector endpoint on the shared focal circle', side => {
    for (let count = 1; count <= 3; count += 1) {
      for (let index = 0; index < count; index += 1) {
        const slot = getFactorSlot(side, index, count)
        const horizontal = slot.focalAnchorX - FACTOR_WEB_LAYOUT.focalCenterX
        const vertical = slot.focalAnchorY - FACTOR_WEB_LAYOUT.focalCenterY
        const distanceFromCentre = Math.hypot(horizontal, vertical)

        expect(distanceFromCentre).toBeCloseTo(connectorRadius, 8)
        expect(side === 'left' ? horizontal : -horizontal).toBeLessThan(0)
        expect(getFactorConnectorPath(slot)).toMatch(
          new RegExp(`${slot.focalAnchorX} ${slot.focalAnchorY}$`),
        )
      }
    }
  })

  it('keeps visible focal media and SVG connector geometry on one responsive percentage scale', () => {
    expect(FACTOR_WEB_LAYOUT.focalDiameter / 2).toBe(FACTOR_WEB_LAYOUT.focalRadius)
    expect(FACTOR_WEB_LAYOUT.connectorUnderlap).toBeGreaterThan(0)
    expect(FACTOR_WEB_LAYOUT.connectorUnderlap).toBeLessThan(FACTOR_WEB_LAYOUT.focalRadius)

    for (const viewportWidth of [320, 360, 390]) {
      const canvasWidth = Math.min(viewportWidth, FACTOR_WEB_LAYOUT.canvasMaxWidth)
      const visibleRadiusPx = canvasWidth * FACTOR_WEB_LAYOUT.focalDiameter / 200
      const connectorRadiusPx = canvasWidth * connectorRadius / 100
      const intendedUnderlapPx = canvasWidth * FACTOR_WEB_LAYOUT.connectorUnderlap / 100

      expect(visibleRadiusPx).toBeCloseTo(
        canvasWidth * FACTOR_WEB_LAYOUT.focalRadius / 100,
        8,
      )
      expect(visibleRadiusPx - connectorRadiusPx).toBeCloseTo(intendedUnderlapPx, 8)
    }
  })
})
