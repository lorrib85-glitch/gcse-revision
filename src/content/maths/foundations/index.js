// GCSE Maths Foundations — episode registry
// Dynamic imports only — importing this file does not load any episode content.
// App loading is handled by src/content/moduleContentRegistry.js.

export const EPISODE_LOADERS = {
  'math1': () => import('./episodes/math1.js').then(m => m.default),
  'math2': () => import('./episodes/math2.js').then(m => m.default),
  'math3': () => import('./episodes/math3.js').then(m => m.default),
  'math4': () => import('./episodes/math4.js').then(m => m.default),
  'math5': () => import('./episodes/math5.js').then(m => m.default),
  'math6': () => import('./episodes/math6.js').then(m => m.default),
}

export const EPISODE_IDS = Object.keys(EPISODE_LOADERS)
