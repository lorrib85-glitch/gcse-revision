// ─── Component Review Lab — composed review manifest ─────────────────────────
//
// The established catalogue remains in reviewManifestCore.jsx. This thin layer
// adds review-only variants for component families that are expanding quickly,
// without duplicating the full catalogue or bending production component APIs.

import AngleExplore from '../../components/learning/AngleExplore.jsx'
import {
  REVIEW_ENTRIES as CORE_REVIEW_ENTRIES,
  REVIEW_QUESTIONS,
  STATUS_LABELS,
  INTERACTION_LABELS,
} from './reviewManifestCore.jsx'

export { REVIEW_QUESTIONS, STATUS_LABELS, INTERACTION_LABELS }

function extendAngleExplore(entry) {
  const variants = Object.fromEntries((entry.variants ?? []).map(variant => [variant.id, variant]))

  return {
    ...entry,
    function: 'Configuration-driven GCSE geometry diagram for exploring angle facts, parallel-line relationships, triangle properties and polygon angle rules. One learner-controlled value drives the SVG while page-level questions and marking remain outside the component.',
    usage: 'New component — pending review; not yet routed in ModulePlayer. Review variants cover core angle facts, formal parallel-line rules, triangle properties, quadrilateral and polygon angle sums, regular polygons and static jobs.',
    variants: [
      {
        ...variants['angle-types'],
        description: 'Drag the ray through acute, right, obtuse, straight, reflex and full-turn angles; the value and formal classification respond live.',
      },
      variants['straight-line'],
      variants['around-point'],
      variants['vertically-opposite'],
      {
        id: 'parallel-corresponding',
        label: 'Corresponding',
        description: 'Rotate a transversal across marked parallel lines. Matching-corner corresponding angles remain equal and share a colour.',
        render: () => <AngleExplore preset="parallelLines" />,
      },
      {
        id: 'parallel-alternate',
        label: 'Alternate',
        description: 'The equal interior angles sit on opposite sides of the transversal, using the formal AQA term alternate angles.',
        render: () => <AngleExplore preset="parallelAlternate" />,
      },
      {
        id: 'parallel-co-interior',
        label: 'Co-interior',
        description: 'The interior pair on the same side of the transversal changes live while its total remains 180°.',
        render: () => <AngleExplore preset="parallelCoInterior" />,
      },
      variants.triangle,
      {
        id: 'triangle-types',
        label: 'Triangle types',
        description: 'Move through scalene, isosceles, equilateral, right-angled, acute-angled and obtuse-angled triangles with governed side and angle markings.',
        render: () => <AngleExplore preset="triangleTypes" />,
      },
      {
        id: 'quadrilateral',
        label: 'Quadrilateral',
        description: 'Drag one vertex to reshape the quadrilateral while all four interior angles continue to total 360°.',
        render: () => <AngleExplore preset="quadrilateral" />,
      },
      {
        id: 'polygon-sum',
        label: 'Polygon sum',
        description: 'Change the number of sides and watch diagonals split the polygon into n − 2 triangles, deriving its interior-angle sum.',
        render: () => <AngleExplore preset="polygonSum" />,
      },
      {
        id: 'regular-polygon',
        label: 'Regular polygon',
        description: 'Change the number of equal sides to connect exterior angle 360° ÷ n with the matching interior angle.',
        render: () => <AngleExplore preset="regularPolygon" />,
      },
      variants.static,
    ].filter(Boolean),
  }
}

export const REVIEW_ENTRIES = CORE_REVIEW_ENTRIES.map(entry => (
  entry.id === 'angle-explore' ? extendAngleExplore(entry) : entry
))
