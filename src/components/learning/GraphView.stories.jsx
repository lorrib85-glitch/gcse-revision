import GraphView from './GraphView.jsx'

export default {
  title: 'Learning/GraphView',
  component: GraphView,
}

export const Scatter = {
  args: {
    subject: 'Maths',
    block: {
      type: 'graphView',
      graphType: 'scatter',
      title: 'Revision vs test score',
      caption: 'Each point is one student.',
      xLabel: 'Hours revised',
      yLabel: 'Test score (%)',
      points: [
        { x: 1, y: 42 }, { x: 2, y: 48 }, { x: 3, y: 55 }, { x: 4, y: 61 },
        { x: 5, y: 64 }, { x: 6, y: 72 }, { x: 7, y: 75 }, { x: 8, y: 83 },
        { x: 9, y: 88 }, { x: 10, y: 91 },
      ],
      lineOfBestFit: { from: { x: 1, y: 44 }, to: { x: 10, y: 90 } },
      xMin: 0, xMax: 10, yMin: 0, yMax: 100,
    },
  },
}

export const Line = {
  args: {
    subject: 'Biology',
    block: {
      type: 'graphView',
      graphType: 'line',
      title: 'Enzyme activity vs temperature',
      caption: 'Each point is one temperature reading.',
      xLabel: 'Temperature (°C)',
      yLabel: 'Rate of reaction',
      points: [
        { x: 0, y: 2 }, { x: 10, y: 8 }, { x: 20, y: 20 }, { x: 30, y: 42 },
        { x: 37, y: 60 }, { x: 40, y: 52 }, { x: 45, y: 28 }, { x: 50, y: 6 }, { x: 60, y: 0 },
      ],
      xMin: 0, xMax: 60, yMin: 0, yMax: 65,
    },
  },
}
