// Sociology of the Family — episode registry
// Dynamic imports only — importing this file does not load any episode content.
// App loading is handled by src/content/moduleContentRegistry.js.

export const EPISODE_LOADERS = {
  'soc1': () => import('./episodes/soc1.js').then(m => m.default),
  'soc2': () => import('./episodes/soc2.js').then(m => m.default),
  'soc3': () => import('./episodes/soc3.js').then(m => m.default),
  'soc4': () => import('./episodes/soc4.js').then(m => m.default),
  'soc6': () => import('./episodes/soc6.js').then(m => m.default),
}

export const EPISODE_IDS = Object.keys(EPISODE_LOADERS)
