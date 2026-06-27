// GCSE Biology — Inheritance, Variation and Evolution — episode registry
// Dynamic imports only — importing this file does not load any episode content.
// App loading is handled by src/content/moduleContentRegistry.js.

export const EPISODE_LOADERS = {
  'bio_genetics_evolution': () => import('./episodes/bio_genetics_evolution.js').then(m => m.default),
}

export const EPISODE_IDS = Object.keys(EPISODE_LOADERS)
