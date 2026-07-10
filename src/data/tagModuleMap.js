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
  'vesalius':               'history-medicine-renaissance-medicine',
  'harvey':                 'history-medicine-renaissance-medicine',
  'printing-press':         'history-medicine-renaissance-medicine',
  'royal-society':          'history-medicine-renaissance-medicine',
  'great-plague':           'history-medicine-renaissance-medicine',
  'scientific-method':      'history-medicine-renaissance-medicine',
  // 19th-century surgery
  'anaesthetics':           'history-medicine-surgery-anaesthetics',
  'antiseptic-surgery':     'history-medicine-surgery-anaesthetics',
  'surgery':                'history-medicine-surgery-anaesthetics',
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
  'penicillin':             'history-medicine-accidental-miracle',
  'magic-bullet':           'history-medicine-accidental-miracle',
  'war-and-medicine':       'history-medicine-accidental-miracle',
  'wwi-medicine':           'history-medicine-accidental-miracle',
  // Modern
  'nhs':                    'history-medicine-cancer',
  'diagnosis':              'history-medicine-modern-medicine',
  'lifestyle-factors':      'history-medicine-modern-medicine',
  'genetics':               'history-medicine-modern-medicine',
  // Crosses all modules — no single best link (explicitly not recoverable
  // via a single module; null is the intentional "no route" marker)
  'factors-in-change':      null,
  // Maths — Number survival kit (module ids are the real MODULES entries;
  // each tag below appears in that module's screenTags, so findTaggedScreen
  // lands on the exact teaching screen)
  'maths:place-value':          'math1',
  'maths:ordering-numbers':     'math1',
  'maths:four-operations':      'math2',
  'maths:written-methods':      'math2',
  'maths:negative-numbers':     'math3',
  'maths:ordering-negatives':   'math3',
  'maths:bidmas':               'math4',
  'maths:calculator-control':   'math4',
  'maths:rounding':             'math5',
  'maths:significant-figures':  'math5',
  'maths:estimation':           'math5',
  'maths:prime-numbers':        'math6',
  'maths:hcf-lcm':              'math6',
  'maths:prime-factorisation':  'math6',
  'maths:indices':              'math7',
  'maths:standard-form':        'math7',
  'maths:powers-roots':         'math7',
  'maths:equivalent-fractions': 'math8',
  'maths:simplifying-fractions':'math8',
  'maths:fractions-of-amounts': 'math8',
  'maths:mixed-numbers':        'math8',
}
