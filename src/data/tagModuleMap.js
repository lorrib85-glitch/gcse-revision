// Maps question tags to the most relevant module ID.
// Used by the results screen to surface module content after identifying gaps.

// Returns the index of the first screen in a module tagged with the given tag,
// or undefined if no screen matches (caller opens module from the start).
// Uses the metadata-only screenTags list, so this works without loading the
// module's full lesson content.
export function findTaggedScreen(mod, tag) {
  const idx = (mod.screenTags || []).indexOf(tag)
  return idx >= 0 ? idx : undefined
}

export const TAG_MODULE_MAP = {
  // Medieval
  'four-humours':           'history-medicine-medieval-beliefs-causes',
  'miasma':                 'history-medicine-medieval-beliefs-causes',
  'galen':                  'history-medicine-medieval-beliefs-causes',
  'medieval-causes':        'history-medicine-medieval-beliefs-causes',
  'medieval-prevention':    'history-medicine-medieval-beliefs-causes',
  'medieval-practitioners': 'history-medicine-medieval-beliefs-causes',
  'black-death':            'history-medicine-medieval-beliefs-causes',
  // Renaissance
  'vesalius':               'mod2',
  'harvey':                 'mod2',
  'printing-press':         'mod2',
  'royal-society':          'mod2',
  'great-plague':           'mod2',
  'scientific-method':      'mod2',
  // 19th-century surgery
  'anaesthetics':           'mod3',
  'antiseptic-surgery':     'mod3',
  'surgery':                'mod3',
  // Germ Theory
  'pasteur':                'history-medicine-germ-theory',
  'germ-theory':            'history-medicine-germ-theory',
  'vaccination':            'history-medicine-jenner-vaccination',
  'koch':                   'history-medicine-germ-theory',
  // Public Health
  'john-snow':              'history-medicine-great-stink',
  'public-health':          'history-medicine-great-stink',
  'nightingale':            'history-medicine-great-stink',
  'communication':          'history-medicine-great-stink',
  // WWI / antibiotics
  'penicillin':             'mod7',
  'magic-bullet':           'mod7',
  'war-and-medicine':       'mod7',
  'wwi-medicine':           'mod7',
  // Modern
  'nhs':                    'mod9',
  'diagnosis':              'mod8',
  'lifestyle-factors':      'mod8',
  'genetics':               'mod8',
  // Crosses all modules — no single best link
  'factors-in-change':      null,
}
