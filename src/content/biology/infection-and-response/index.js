// GCSE Biology — Infection and Response — episode registry
// Dynamic imports only — importing this file does not load any episode content.
// App loading is handled by src/content/moduleContentRegistry.js.

export const EPISODE_LOADERS = {
  'bio_disease_wars': () => import('./episodes/bio_disease_wars.js').then(m => m.default),
}

export const EPISODE_IDS = Object.keys(EPISODE_LOADERS)
