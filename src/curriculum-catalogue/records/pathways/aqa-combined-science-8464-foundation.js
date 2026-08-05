// ─── AQA GCSE Combined Science: Trilogy, Foundation tier ────────────────────
//
// The Science modules are referenced, not copied. The same `biology-aqa-*`
// records back Combined Science and Triple Biology; each module states both
// specifications in its own `specRefs`. Two pathways using a module is never
// a reason to define it twice.

export default {
  id: 'aqa-combined-science-8464-foundation',
  specificationId: 'aqa-gcse-combined-science-trilogy-8464',
  title: 'AQA GCSE Combined Science: Trilogy, Foundation tier',
  shortTitle: 'Combined (F)',
  tier: 'foundation',

  selections: {},

  moduleRefs: [
    { moduleId: 'biology-aqa-cell-biology', position: 0, required: true },
    { moduleId: 'biology-aqa-organisation', position: 1, required: true },
    { moduleId: 'biology-aqa-infection-and-response', position: 2, required: true },
    { moduleId: 'biology-aqa-homeostasis', position: 3, required: true },
    { moduleId: 'biology-aqa-inheritance-variation-evolution', position: 4, required: true },
    { moduleId: 'biology-aqa-ecology', position: 5, required: true },
    { moduleId: 'chemistry-aqa-atomic-structure', position: 6, required: true },
    { moduleId: 'physics-aqa-energy', position: 7, required: true },
    { moduleId: 'physics-aqa-matter-particles', position: 8, required: true },
    { moduleId: 'physics-aqa-forces-motion', position: 9, required: true },
    { moduleId: 'physics-aqa-waves-electricity', position: 10, required: true },
    { moduleId: 'physics-aqa-space', position: 11, required: true },
  ],

  status: 'active',
  scope: 'catalogue',
}
