// GCSE Biology — Organisation — episode registry
// Dynamic imports only — importing this file does not load any episode content.
// App loading is handled by src/content/moduleContentRegistry.js.

export const EPISODE_LOADERS = {
  'bio_building_life': () => import('./episodes/bio_building_life.js').then(m => m.default),
  'bio_human_machine': () => import('./episodes/bio_human_machine.js').then(m => m.default),
}

export const EPISODE_IDS = Object.keys(EPISODE_LOADERS)
