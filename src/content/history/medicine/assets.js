// Medicine Through Time — asset manifest.
//
// Maps friendly asset keys to public paths under /public/history/medicine/.
// Episode files reference assetKeys by name; this file resolves them to URLs.
//
// Intended shape for future episodes (image files created separately):
//
//   heroes: {
//     medievalPhysician:  '/history/medicine/heroes/medieval-physician.webp',
//     jenner1796:         '/history/medicine/heroes/jenner-1796.webp',
//     pasteurPortrait:    '/history/medicine/heroes/pasteur-portrait.webp',
//   },
//   backgrounds: {
//     medievalHospital:   '/history/medicine/backgrounds/medieval-hospital.webp',
//     victorianStreet:    '/history/medicine/backgrounds/victorian-street.webp',
//   },
//   characters: {},
//   motifs: {},
//
// Actual image files live in public/history/medicine/ — not in src/.
// Do not import image files here; keep this as a path-string map only.

export const medicineAssets = {
  heroes: {},
  backgrounds: {},
  characters: {},
  motifs: {},
}
