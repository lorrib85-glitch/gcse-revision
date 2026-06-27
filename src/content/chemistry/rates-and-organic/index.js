// GCSE Chemistry — Rates and Organic Chemistry — episode registry
// Dynamic imports only — importing this file does not load any episode content.
// App loading is handled by src/content/moduleContentRegistry.js.

export const EPISODE_LOADERS = {
  'chem_rates_organic': () => import('./episodes/chem_rates_organic.js').then(m => m.default),
}

export const EPISODE_IDS = Object.keys(EPISODE_LOADERS)
