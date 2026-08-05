// ─── AQA GCSE Maths, Higher tier ────────────────────────────────────────────
//
// Tier lives here and nowhere else. A learner moving Foundation → Higher
// changes which pathway they follow; every chapter they finished keeps its
// `gcse_chapter_<id>` progress, because progress is keyed on the chapter
// (D-13). The six shared modules are the same records the Foundation pathway
// references; only the seventh is Higher-only, and it is Higher-only because
// this pathway alone references it.

export default {
  id: 'aqa-maths-8300-higher',
  specificationId: 'aqa-gcse-mathematics-8300',
  title: 'AQA GCSE Maths, Higher tier',
  shortTitle: 'Maths (H)',
  tier: 'higher',

  selections: {},

  moduleRefs: [
    { moduleId: 'maths-aqa-number', position: 0, required: true },
    { moduleId: 'maths-aqa-algebra', position: 1, required: true },
    { moduleId: 'maths-aqa-ratio-proportion', position: 2, required: true },
    { moduleId: 'maths-aqa-geometry-measures', position: 3, required: true },
    { moduleId: 'maths-aqa-probability', position: 4, required: true },
    { moduleId: 'maths-aqa-statistics', position: 5, required: true },
    { moduleId: 'maths-aqa-higher-algebra-extension', position: 6, required: true },
  ],

  status: 'active',
  scope: 'catalogue',
}
