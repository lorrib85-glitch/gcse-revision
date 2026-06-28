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
  // Crosses all modules — no single best link
  'factors-in-change':      null,
  // Maths — Module 1
  'maths:place-value':          'maths-place-value',
  'maths:ordering-numbers':     'maths-place-value',
  'maths:negative-numbers':     'maths-negative-numbers',
  'maths:ordering-negatives':   'maths-negative-numbers',
  'maths:prime-numbers':        'maths-primes',
  'maths:hcf-lcm':              'maths-primes',
  'maths:prime-factorisation':  'maths-primes',
  // Maths — Module 1, Ch7
  'maths:indices':              'maths-powers-standard-form',
  'maths:standard-form':        'maths-powers-standard-form',
  'maths:powers-roots':         'maths-powers-standard-form',
}
