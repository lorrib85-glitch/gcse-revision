// GCSE Biology — Cell Biology — episode registry
// Dynamic imports only — importing this file does not load any episode content.
// App loading is handled by src/content/moduleContentRegistry.js.

export const EPISODE_LOADERS = {
  'bio_building_blocks': () => import('./episodes/bio_building_blocks.js').then(m => m.default),
  'sci_bio_w1':          () => import('./episodes/sci_bio_w1.js').then(m => m.default),
}

export const EPISODE_IDS = Object.keys(EPISODE_LOADERS)
