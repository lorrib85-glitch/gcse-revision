// ─── Edexcel History — The British sector of the Western Front ─────────────────
//
// Chapters of `history-edexcel-western-front`, in the order the module references them.
// Ids are preserved verbatim: each one backs a live `gcse_chapter_<id>`
// progress key and is never renamed for tidiness.

export default [
  {
    id: 'history-medicine-western-front',
    title: 'Hell in the trenches',
    subtitle: 'Medicine on the Western Front',
    era: 'c.1914–c.1918',
    icon: '⚔️',
    headerImage: '/images/history/medicine/headers/western-front.png',
    status: 'available',
    contentPath: 'src/content/history/medicine/episodes/episode-14-western-front.js',
    conceptIds: [
      'history:medicine:trench-system',
      'history:medicine:ramc',
      'history:medicine:chain-of-evacuation',
      'history:medicine:casualty-clearing-stations',
      'history:medicine:thomas-splint',
      'history:medicine:brodie-helmet',
      'history:medicine:gas-attacks',
      'history:medicine:wound-infection',
      'history:medicine:x-rays',
      'history:medicine:blood-transfusion',
      'history:medicine:blood-banks',
    ],
    requirementIds: [],
    estimatedMinutes: null,
  },
]
