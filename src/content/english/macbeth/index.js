// GCSE English — Macbeth — episode registry
// Dynamic imports only — importing this file does not load any episode content.
// App loading is handled by src/content/moduleContentRegistry.js.

export const EPISODE_LOADERS = {
  'english-macbeth-power-ambition': () => import('./episodes/english-macbeth-power-ambition.js').then(m => m.default),
}

export const EPISODE_IDS = Object.keys(EPISODE_LOADERS)
