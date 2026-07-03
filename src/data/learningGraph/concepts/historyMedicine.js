// ─── Concepts: Edexcel GCSE History — Medicine in Britain, c1250–present ────
//
// Knowledge atoms for the Medicine Through Time course, including the British
// sector of the Western Front, 1914–18. Every node id is canonical: content
// and questions reference these ids exactly — never re-spell or invent
// variants. Add new concepts here, in period order, when new spec content is
// built. See docs/system/LEARNING_GRAPH.md for naming rules.
//
// The two-segment node `history:medicine` is the course node — it is the
// correct tag when an object relates to the whole course rather than one atom
// (and is what existing question-bank tags already use).

export const HISTORY_MEDICINE_CONCEPTS = [
  // Course node
  { id: 'history:medicine', label: 'Medicine in Britain, c1250–present' },

  // Medieval medicine, c1250–c1500
  { id: 'history:medicine:four-humours', label: 'The four humours' },
  { id: 'history:medicine:theory-of-opposites', label: 'The theory of opposites' },
  { id: 'history:medicine:hippocrates', label: 'Hippocrates' },
  { id: 'history:medicine:galen', label: 'Galen' },
  { id: 'history:medicine:astrology', label: 'Astrology as a cause of disease' },
  { id: 'history:medicine:religion', label: 'Religious explanations of disease' },
  { id: 'history:medicine:miasma', label: 'Miasma' },
  { id: 'history:medicine:bloodletting', label: 'Bloodletting' },
  { id: 'history:medicine:purging', label: 'Purging' },
  { id: 'history:medicine:physicians', label: 'Medieval physicians' },
  { id: 'history:medicine:barber-surgeons', label: 'Barber surgeons' },
  { id: 'history:medicine:apothecaries', label: 'Apothecaries' },
  { id: 'history:medicine:medieval-hospitals', label: 'Medieval hospitals' },
  { id: 'history:medicine:black-death', label: 'The Black Death, 1348–49' },
  { id: 'history:medicine:flagellants', label: 'Flagellants' },

  // Renaissance medicine, c1500–c1700
  { id: 'history:medicine:vesalius', label: 'Andreas Vesalius' },
  { id: 'history:medicine:harvey', label: 'William Harvey' },
  { id: 'history:medicine:sydenham', label: 'Thomas Sydenham' },
  { id: 'history:medicine:printing-press', label: 'The printing press' },
  { id: 'history:medicine:royal-society', label: 'The Royal Society' },
  { id: 'history:medicine:great-plague', label: 'The Great Plague, 1665' },
  { id: 'history:medicine:plague-doctors', label: 'Plague doctors' },
  { id: 'history:medicine:quarantine', label: 'Quarantine and isolation' },

  // c1700–c1900: prevention, germ theory, surgery, public health
  { id: 'history:medicine:inoculation', label: 'Inoculation' },
  { id: 'history:medicine:jenner', label: 'Edward Jenner' },
  { id: 'history:medicine:vaccination', label: 'Vaccination' },
  { id: 'history:medicine:smallpox', label: 'Smallpox' },
  { id: 'history:medicine:germ-theory', label: 'Germ theory' },
  { id: 'history:medicine:pasteur', label: 'Louis Pasteur' },
  { id: 'history:medicine:koch', label: 'Robert Koch' },
  { id: 'history:medicine:spontaneous-generation', label: 'Spontaneous generation' },
  { id: 'history:medicine:nightingale', label: 'Florence Nightingale' },
  { id: 'history:medicine:anaesthetics', label: 'Anaesthetics' },
  { id: 'history:medicine:chloroform', label: 'Chloroform' },
  { id: 'history:medicine:simpson', label: 'James Simpson' },
  { id: 'history:medicine:antiseptics', label: 'Antiseptics' },
  { id: 'history:medicine:lister', label: 'Joseph Lister' },
  { id: 'history:medicine:carbolic-acid', label: 'Carbolic acid' },
  { id: 'history:medicine:aseptic-surgery', label: 'Aseptic surgery' },
  { id: 'history:medicine:john-snow', label: 'John Snow' },
  { id: 'history:medicine:cholera', label: 'Cholera' },
  { id: 'history:medicine:broad-street-pump', label: 'The Broad Street pump, 1854' },
  { id: 'history:medicine:great-stink', label: 'The Great Stink, 1858' },
  { id: 'history:medicine:bazalgette', label: 'Joseph Bazalgette' },
  { id: 'history:medicine:public-health-act-1875', label: 'The Public Health Act 1875' },

  // Modern medicine, c1900–present
  { id: 'history:medicine:magic-bullets', label: 'Magic bullets' },
  { id: 'history:medicine:ehrlich', label: 'Paul Ehrlich' },
  { id: 'history:medicine:salvarsan-606', label: 'Salvarsan 606' },
  { id: 'history:medicine:penicillin', label: 'Penicillin' },
  { id: 'history:medicine:fleming', label: 'Alexander Fleming' },
  { id: 'history:medicine:florey-and-chain', label: 'Florey and Chain' },
  { id: 'history:medicine:nhs', label: 'The NHS' },
  { id: 'history:medicine:dna', label: 'DNA and genetic medicine' },
  { id: 'history:medicine:watson-and-crick', label: 'Watson and Crick' },
  { id: 'history:medicine:x-rays', label: 'X-rays' },
  { id: 'history:medicine:blood-transfusion', label: 'Blood transfusion' },
  { id: 'history:medicine:lifestyle-factors', label: 'Lifestyle factors in disease' },
  { id: 'history:medicine:cancer-treatment', label: 'Cancer treatment' },

  // The British sector of the Western Front, 1914–18
  { id: 'history:medicine:trench-system', label: 'The trench system' },
  { id: 'history:medicine:ramc', label: 'The RAMC' },
  { id: 'history:medicine:chain-of-evacuation', label: 'The chain of evacuation' },
  { id: 'history:medicine:casualty-clearing-stations', label: 'Casualty clearing stations' },
  { id: 'history:medicine:thomas-splint', label: 'The Thomas splint' },
  { id: 'history:medicine:brodie-helmet', label: 'The Brodie helmet' },
  { id: 'history:medicine:gas-attacks', label: 'Gas attacks' },
  { id: 'history:medicine:wound-infection', label: 'Wound infection and gas gangrene' },
  { id: 'history:medicine:brain-surgery', label: 'Brain surgery on the Western Front' },
  { id: 'history:medicine:plastic-surgery', label: 'Plastic surgery' },
  { id: 'history:medicine:blood-banks', label: 'Blood banks' },
]

// Question-bank topic layer (topicId → tags), used with resolveEffectiveTags:
// effective = module.tags + MEDICINE_TOPICS[q.topicId].tags + q.tags
export const MEDICINE_TOPICS = {
  th1:       { label: 'Medieval Medicine',                     tags: ['period:medieval'] },
  th2:       { label: 'Renaissance Medicine',                  tags: ['period:renaissance'] },
  th3:       { label: 'Surgery & Anatomy, c1700–c1900',        tags: ['period:18th-19th-century', 'theme:surgery'] },
  th4:       { label: 'Germ Theory & Vaccination',             tags: ['period:19th-century', 'theme:germ-theory'] },
  th5:       { label: 'Public Health',                         tags: ['period:19th-century', 'theme:public-health'] },
  th_wf:     { label: 'The Western Front, 1914–18',            tags: ['period:western-front', 'theme:war'] },
  th_modern: { label: 'Modern Medicine',                       tags: ['period:modern'] },
}

// Bridge from legacy single-word screen tags (modules.js screenTags, consumed
// by findTaggedScreen / weak-spot routing) to canonical concept ids. Only
// confident 1:1 mappings belong here — composite or navigational screen tags
// (e.g. 'core-takeaway', 'medieval-practitioners') are deliberately absent.
// The legacy tags themselves are unchanged; this map lets graph consumers
// translate without a screenTags migration.
export const MEDICINE_SCREEN_TAG_CONCEPTS = {
  'four-humours':        'history:medicine:four-humours',
  'galen':               'history:medicine:galen',
  'miasma':              'history:medicine:miasma',
  'plague-explanations': 'history:medicine:black-death',
  'vesalius':            'history:medicine:vesalius',
  'anaesthetics':        'history:medicine:anaesthetics',
  'antiseptic-surgery':  'history:medicine:antiseptics',
  'vaccination':         'history:medicine:vaccination',
  'germ-theory':         'history:medicine:germ-theory',
  'pasteur':             'history:medicine:pasteur',
  'koch':                'history:medicine:koch',
  'john-snow':           'history:medicine:john-snow',
  'magic-bullet':        'history:medicine:magic-bullets',
  'penicillin':          'history:medicine:penicillin',
  'trench-conditions':   'history:medicine:trench-system',
  'chain-of-evacuation': 'history:medicine:chain-of-evacuation',
  'thomas-splint':       'history:medicine:thomas-splint',
  'blood-transfusions':  'history:medicine:blood-transfusion',
}
