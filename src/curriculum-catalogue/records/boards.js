// ─── Awarding bodies ───────────────────────────────────────────────────────
//
// The two organisations whose specifications this app teaches. A board record
// carries the organisation's identity and nothing about what it publishes —
// specifications reference the board, never the other way round.

import { verified } from './provenance.js'

export default [
  {
    id: 'aqa',
    name: 'AQA Education',
    shortName: 'AQA',
    provenance: verified(
      'AQA — Who we are',
      'https://www.aqa.org.uk/about-us/who-we-are',
    ),
  },
  {
    id: 'pearson-edexcel',
    name: 'Pearson Education Limited',
    shortName: 'Pearson Edexcel',
    provenance: verified(
      'Pearson Edexcel — About Edexcel',
      'https://qualifications.pearson.com/en/about-us/qualification-brands/edexcel/about-edexcel.html.html',
    ),
  },
]
