// Exact, shrink-only content-quality debt baselines.
// These are governance fixtures, not generated during tests.
// Update by hand only when reviewing real content debt changes.
export const READABILITY_GRADE_TOLERANCE = 0.05

export const KNOWN_GUARDRAIL_VIOLATIONS = {
  "history-medicine-medieval-beliefs-causes": [
    "STAGE_NO_ASSESSMENT:part-1"
  ],
  "history-medicine-harvey-pare-renaissance-method": [
    "EXAM_PREP_NO_ASSESSMENT:screen:10"
  ],
  "history-medicine-surgery-anaesthetics": [
    "PASSIVE_RUN:screen:4",
    "STAGE_NAV_NOT_INCREASING:part-5",
    "STAGE_NO_ASSESSMENT:part-1"
  ],
  "history-medicine-great-plague-1665": [
    "EXAM_PREP_NO_ASSESSMENT:screen:10"
  ],
  "history-medicine-jenner-vaccination": [
    "STAGE_NAV_NOT_INCREASING:part-2",
    "STAGE_NAV_NOT_INCREASING:part-3",
    "STAGE_NAV_NOT_INCREASING:part-4",
    "STAGE_NAV_NOT_INCREASING:part-5",
    "STAGE_NAV_NOT_INCREASING:part-6"
  ],
  "history-medicine-germ-theory": [
    "PASSIVE_RUN:screen:5",
    "STAGE_NAV_NOT_INCREASING:part-2"
  ],
  "history-medicine-cancer": [
    "STAGE_NO_ASSESSMENT:part-3"
  ],
  "bio_building_blocks": [
    "STAGE_NO_ASSESSMENT:part-3"
  ],
  "soc6": [
    "STAGE_NO_ASSESSMENT:part-1"
  ],
  "english-macbeth-power-ambition": [
    "STAGE_NAV_NOT_INCREASING:part-2",
    "STAGE_NAV_NOT_INCREASING:part-3",
    "STAGE_NAV_NOT_INCREASING:part-4",
    "STAGE_NAV_NOT_INCREASING:part-5",
    "STAGE_NAV_NOT_INCREASING:part-6"
  ]
}

export const KNOWN_READABILITY_BASELINES = {
  "history-medicine-medieval-beliefs-causes": {
    "READABILITY:screen:0": 7.58,
    "READABILITY:screen:17": 8.62,
    "READABILITY:screen:24": 8.42,
    "READABILITY:screen:28": 8.95,
    "READABILITY:screen:29": 8.3,
    "READABILITY:screen:3": 8.42,
    "READABILITY:screen:31": 7.6,
    "READABILITY:screen:6": 8.84,
    "READABILITY:screen:8": 7.72
  },
  "history-medicine-black-death": {
    "READABILITY:screen:0": 8.66,
    "READABILITY:screen:22": 7.58
  },
  "history-medicine-renaissance-medicine": {
    "READABILITY:screen:0": 8.5,
    "READABILITY:screen:1": 7.32,
    "READABILITY:screen:10": 7.46,
    "READABILITY:screen:13": 8.61,
    "READABILITY:screen:14": 7.04,
    "READABILITY:screen:15": 7.15,
    "READABILITY:screen:4": 7.22,
    "READABILITY:screen:6": 8,
    "READABILITY:screen:9": 10.28
  },
  "history-medicine-harvey-pare-renaissance-method": {
    "READABILITY:screen:0": 8.7
  },
  "history-medicine-surgery-anaesthetics": {
    "READABILITY:screen:1": 9.05,
    "READABILITY:screen:3": 10.06,
    "READABILITY:screen:4": 8.68,
    "READABILITY:screen:6": 8.38,
    "READABILITY:screen:7": 9.02,
    "READABILITY:screen:8": 8.67,
    "READABILITY:screen:9": 9.2
  },
  "history-medicine-jenner-vaccination": {
    "READABILITY:screen:0": 7.24
  },
  "history-medicine-germ-theory": {
    "READABILITY:screen:2": 7.49,
    "READABILITY:screen:3": 8.01,
    "READABILITY:screen:4": 7.99,
    "READABILITY:screen:7": 8.18,
    "READABILITY:screen:8": 7.62
  },
  "history-medicine-great-stink": {
    "READABILITY:screen:1": 7.51,
    "READABILITY:screen:2": 7.36
  },
  "history-medicine-surgery-revolution": {
    "READABILITY:screen:1": 9.62,
    "READABILITY:screen:3": 8.04,
    "READABILITY:screen:4": 7.45,
    "READABILITY:screen:5": 8.47,
    "READABILITY:screen:9": 8.12
  },
  "history-medicine-accidental-miracle": {
    "READABILITY:screen:0": 7.37,
    "READABILITY:screen:1": 9.17,
    "READABILITY:screen:10": 7.6,
    "READABILITY:screen:2": 9.29,
    "READABILITY:screen:3": 9.51,
    "READABILITY:screen:4": 7.48,
    "READABILITY:screen:5": 9.07,
    "READABILITY:screen:6": 10.02,
    "READABILITY:screen:7": 7.26,
    "READABILITY:screen:8": 7.38
  },
  "history-medicine-modern-medicine": {
    "READABILITY:screen:0": 9.91,
    "READABILITY:screen:1": 9.66,
    "READABILITY:screen:2": 11.61,
    "READABILITY:screen:3": 9.79,
    "READABILITY:screen:4": 10.58,
    "READABILITY:screen:5": 12.24,
    "READABILITY:screen:6": 8.85,
    "READABILITY:screen:7": 7.06,
    "READABILITY:screen:8": 8.9
  },
  "history-medicine-cancer": {
    "READABILITY:screen:0": 8.78,
    "READABILITY:screen:1": 7.19,
    "READABILITY:screen:10": 10.75,
    "READABILITY:screen:2": 7.87,
    "READABILITY:screen:3": 8.71,
    "READABILITY:screen:5": 8.89,
    "READABILITY:screen:6": 9.79,
    "READABILITY:screen:7": 8.69
  },
  "history-medicine-western-front": {
    "READABILITY:screen:0": 9.17,
    "READABILITY:screen:2": 7.73,
    "READABILITY:screen:6": 7.79
  },
  "bio_building_blocks": {
    "READABILITY:screen:11": 7.78,
    "READABILITY:screen:3": 8.75,
    "READABILITY:screen:4": 12.37
  },
  "sci_bio_w1": {
    "READABILITY:screen:0": 8.75
  },
  "math1": {
    "READABILITY:screen:11": 7.79,
    "READABILITY:screen:9": 7.04
  },
  "math2": {
    "READABILITY:screen:0": 7.08,
    "READABILITY:screen:13": 8.45,
    "READABILITY:screen:5": 7.4,
    "READABILITY:screen:8": 7.04
  },
  "math3": {
    "READABILITY:screen:0": 7.05,
    "READABILITY:screen:13": 7.58
  },
  "math4": {
    "READABILITY:screen:0": 8.91,
    "READABILITY:screen:10": 7.45,
    "READABILITY:screen:12": 8.08,
    "READABILITY:screen:2": 9.58,
    "READABILITY:screen:4": 7.64,
    "READABILITY:screen:5": 9.11,
    "READABILITY:screen:7": 11.18
  },
  "math5": {
    "READABILITY:screen:4": 7.21
  },
  "math8": {
    "READABILITY:screen:13": 9.56,
    "READABILITY:screen:2": 7.16,
    "READABILITY:screen:4": 7.94,
    "READABILITY:screen:6": 7.14,
    "READABILITY:screen:9": 8.72
  },
  "soc1": {
    "READABILITY:screen:0": 9.78,
    "READABILITY:screen:1": 8.11,
    "READABILITY:screen:10": 8.18,
    "READABILITY:screen:11": 8.29,
    "READABILITY:screen:5": 8.99,
    "READABILITY:screen:6": 8.53,
    "READABILITY:screen:7": 11.62,
    "READABILITY:screen:8": 7.07,
    "READABILITY:screen:9": 10.12
  },
  "soc2": {
    "READABILITY:screen:10": 9.63,
    "READABILITY:screen:11": 8.37,
    "READABILITY:screen:12": 7.23,
    "READABILITY:screen:13": 9.16,
    "READABILITY:screen:14": 8.03,
    "READABILITY:screen:15": 10.05,
    "READABILITY:screen:2": 7.66,
    "READABILITY:screen:3": 9.41,
    "READABILITY:screen:5": 7.52,
    "READABILITY:screen:7": 9.12,
    "READABILITY:screen:8": 7.61,
    "READABILITY:screen:9": 9.85
  },
  "soc3": {
    "READABILITY:screen:0": 13.1,
    "READABILITY:screen:1": 9.37,
    "READABILITY:screen:10": 9.16,
    "READABILITY:screen:2": 11.44,
    "READABILITY:screen:4": 10.22,
    "READABILITY:screen:5": 9.58,
    "READABILITY:screen:6": 8.94,
    "READABILITY:screen:7": 8.93,
    "READABILITY:screen:8": 9.48,
    "READABILITY:screen:9": 8.22
  },
  "soc4": {
    "READABILITY:screen:0": 10.46,
    "READABILITY:screen:1": 7.84,
    "READABILITY:screen:10": 11.87,
    "READABILITY:screen:11": 8.24,
    "READABILITY:screen:2": 10.28,
    "READABILITY:screen:3": 11.73,
    "READABILITY:screen:4": 10.38,
    "READABILITY:screen:5": 10.05,
    "READABILITY:screen:7": 9,
    "READABILITY:screen:8": 10.7
  },
  "soc6": {
    "READABILITY:screen:0": 8.78,
    "READABILITY:screen:1": 9.19,
    "READABILITY:screen:11": 7.07,
    "READABILITY:screen:2": 10.96,
    "READABILITY:screen:3": 9,
    "READABILITY:screen:4": 11.04,
    "READABILITY:screen:5": 9.29,
    "READABILITY:screen:6": 8.79,
    "READABILITY:screen:7": 8.82,
    "READABILITY:screen:8": 13.97,
    "READABILITY:screen:9": 8.92
  }
}

export const KNOWN_SENTENCE_CASE_VIOLATIONS = {
  "history-medicine-medieval-beliefs-causes": [
    "SENTENCE_CASE:screens[12].label:run:0",
    "SENTENCE_CASE:screens[13].label:run:0",
    "SENTENCE_CASE:screens[13].label:run:1",
    "SENTENCE_CASE:screens[13].label:run:2",
    "SENTENCE_CASE:screens[14].label:run:0",
    "SENTENCE_CASE:screens[16].theories[1].label:run:0",
    "SENTENCE_CASE:screens[1].label:run:0",
    "SENTENCE_CASE:screens[20].hotspots[2].title:run:0",
    "SENTENCE_CASE:screens[20].label:run:0",
    "SENTENCE_CASE:screens[20].label:run:1",
    "SENTENCE_CASE:screens[20].label:run:2",
    "SENTENCE_CASE:screens[23].label:run:0",
    "SENTENCE_CASE:screens[25].heading:run:0",
    "SENTENCE_CASE:screens[25].heading:run:1",
    "SENTENCE_CASE:screens[4].title:run:0",
    "SENTENCE_CASE:screens[8].sub:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:1",
    "SENTENCE_CASE:stageNavigation[2].title:run:0",
    "SENTENCE_CASE:stageNavigation[3].title:run:0",
    "SENTENCE_CASE:stageNavigation[3].title:run:1",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:title:run:0",
    "SENTENCE_CASE:title:run:1"
  ],
  "history-medicine-renaissance-medicine": [
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:1",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:1",
    "SENTENCE_CASE:stageNavigation[5].title:run:2"
  ],
  "history-medicine-surgery-anaesthetics": [
    "SENTENCE_CASE:screens[0].blocks[2].label:run:0",
    "SENTENCE_CASE:screens[1].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[1].label:run:1",
    "SENTENCE_CASE:screens[2].blocks[1].label:run:2",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[1].label:run:1",
    "SENTENCE_CASE:screens[4].blocks[1].label:run:2",
    "SENTENCE_CASE:screens[5].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[5].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[6].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[7].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[7].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[1].label:run:1",
    "SENTENCE_CASE:screens[9].blocks[1].label:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:1",
    "SENTENCE_CASE:stageNavigation[2].title:run:0",
    "SENTENCE_CASE:stageNavigation[2].title:run:1",
    "SENTENCE_CASE:stageNavigation[3].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:1",
    "SENTENCE_CASE:stageNavigation[5].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:1"
  ],
  "history-medicine-jenner-vaccination": [
    "SENTENCE_CASE:screens[0].blocks[0].label:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:1",
    "SENTENCE_CASE:stageNavigation[0].title:run:2",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[2].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:1"
  ],
  "history-medicine-germ-theory": [
    "SENTENCE_CASE:screens[0].blocks[2].label:run:0",
    "SENTENCE_CASE:screens[1].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[4].sub:run:0",
    "SENTENCE_CASE:screens[5].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[6].blocks[0].label:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:1",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:1",
    "SENTENCE_CASE:stageNavigation[1].title:run:2",
    "SENTENCE_CASE:stageNavigation[1].title:run:3",
    "SENTENCE_CASE:stageNavigation[3].title:run:0",
    "SENTENCE_CASE:stageNavigation[3].title:run:1",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:0"
  ],
  "history-medicine-great-stink": [
    "SENTENCE_CASE:screens[0].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[2].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[2].label:run:1",
    "SENTENCE_CASE:screens[0].blocks[2].label:run:2",
    "SENTENCE_CASE:screens[0].blocks[2].label:run:3",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[1].label:run:1",
    "SENTENCE_CASE:screens[3].blocks[1].label:run:2",
    "SENTENCE_CASE:screens[4].blocks[2].label:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:1",
    "SENTENCE_CASE:stageNavigation[0].title:run:2",
    "SENTENCE_CASE:stageNavigation[0].title:run:3",
    "SENTENCE_CASE:stageNavigation[2].title:run:0",
    "SENTENCE_CASE:stageNavigation[3].title:run:0",
    "SENTENCE_CASE:stageNavigation[3].title:run:1",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:1"
  ],
  "history-medicine-surgery-revolution": [
    "SENTENCE_CASE:screens[0].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:1",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:2",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:3",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:4",
    "SENTENCE_CASE:screens[0].blocks[4].label:run:0",
    "SENTENCE_CASE:screens[1].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[1].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:2",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:1",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:2",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:3",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:4",
    "SENTENCE_CASE:screens[2].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[3].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[5].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[6].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[6].blocks[2].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[8].heading:run:0",
    "SENTENCE_CASE:screens[8].heading:run:1",
    "SENTENCE_CASE:screens[8].heading:run:2",
    "SENTENCE_CASE:screens[8].heading:run:3",
    "SENTENCE_CASE:screens[9].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[9].blocks[0].label:run:1",
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:1",
    "SENTENCE_CASE:stageNavigation[2].title:run:0",
    "SENTENCE_CASE:stageNavigation[2].title:run:1",
    "SENTENCE_CASE:stageNavigation[3].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:1",
    "SENTENCE_CASE:stageNavigation[5].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:1"
  ],
  "history-medicine-accidental-miracle": [
    "SENTENCE_CASE:screens[0].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[0].blocks[0].label:run:2",
    "SENTENCE_CASE:screens[0].blocks[0].label:run:3",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:1",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:2",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:3",
    "SENTENCE_CASE:screens[0].blocks[1].label:run:4",
    "SENTENCE_CASE:screens[10].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[10].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[1].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[1].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[1].blocks[0].label:run:2",
    "SENTENCE_CASE:screens[1].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:1",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:2",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:3",
    "SENTENCE_CASE:screens[2].blocks[2].label:run:4",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[3].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[4].blocks[2].label:run:0",
    "SENTENCE_CASE:screens[5].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[5].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[6].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[6].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[7].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[7].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[8].blocks[0].label:run:2",
    "SENTENCE_CASE:screens[8].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[9].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[9].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[9].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[9].heading:run:0",
    "SENTENCE_CASE:screens[9].heading:run:1",
    "SENTENCE_CASE:screens[9].heading:run:2",
    "SENTENCE_CASE:screens[9].heading:run:3",
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:1",
    "SENTENCE_CASE:stageNavigation[0].title:run:2",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[3].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:0"
  ],
  "history-medicine-modern-medicine": [
    "SENTENCE_CASE:screens[0].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[3].label:run:1",
    "SENTENCE_CASE:screens[1].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[1].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[4].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[4].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[5].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[5].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[5].blocks[0].label:run:2",
    "SENTENCE_CASE:screens[5].label:run:0",
    "SENTENCE_CASE:screens[6].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[6].blocks[0].label:run:1",
    "SENTENCE_CASE:screens[6].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[7].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[7].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[7].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[7].heading:run:0",
    "SENTENCE_CASE:screens[7].heading:run:1",
    "SENTENCE_CASE:screens[7].heading:run:2",
    "SENTENCE_CASE:screens[7].heading:run:3",
    "SENTENCE_CASE:screens[7].heading:run:4",
    "SENTENCE_CASE:screens[8].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[0].label:run:1",
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:1",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[2].title:run:0",
    "SENTENCE_CASE:stageNavigation[3].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:1",
    "SENTENCE_CASE:stageNavigation[5].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:1",
    "SENTENCE_CASE:stageNavigation[5].title:run:2"
  ],
  "history-medicine-cancer": [
    "SENTENCE_CASE:screens[0].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[0].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[1].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[1].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[2].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[3].blocks[4].label:run:0",
    "SENTENCE_CASE:screens[4].label:run:0",
    "SENTENCE_CASE:screens[5].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[5].blocks[4].label:run:0",
    "SENTENCE_CASE:screens[6].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[6].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[6].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[9].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[9].blocks[2].label:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[0].title:run:1",
    "SENTENCE_CASE:stageNavigation[0].title:run:2",
    "SENTENCE_CASE:stageNavigation[0].title:run:3",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:1",
    "SENTENCE_CASE:stageNavigation[1].title:run:2",
    "SENTENCE_CASE:stageNavigation[2].title:run:0",
    "SENTENCE_CASE:stageNavigation[3].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:1"
  ],
  "history-medicine-western-front": [
    "SENTENCE_CASE:stageNavigation[0].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:0",
    "SENTENCE_CASE:stageNavigation[1].title:run:1",
    "SENTENCE_CASE:stageNavigation[1].title:run:2",
    "SENTENCE_CASE:stageNavigation[3].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:0",
    "SENTENCE_CASE:stageNavigation[4].title:run:1",
    "SENTENCE_CASE:stageNavigation[5].title:run:0",
    "SENTENCE_CASE:stageNavigation[5].title:run:1"
  ],
  "bio_building_blocks": [
    "SENTENCE_CASE:screens[3].hotspots[5].title:run:0",
    "SENTENCE_CASE:screens[3].title:run:0",
    "SENTENCE_CASE:screens[4].title:run:0"
  ],
  "sci_bio_w1": [
    "SENTENCE_CASE:screens[0].hotspots[5].title:run:0",
    "SENTENCE_CASE:screens[0].title:run:0"
  ],
  "math8": [
    "SENTENCE_CASE:screens[3].sub:run:0"
  ],
  "soc2": [
    "SENTENCE_CASE:screens[11].heading:run:0",
    "SENTENCE_CASE:screens[11].label:run:0",
    "SENTENCE_CASE:screens[13].label:run:0",
    "SENTENCE_CASE:screens[16].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[16].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[16].blocks[4].label:run:0",
    "SENTENCE_CASE:screens[2].label:run:0",
    "SENTENCE_CASE:screens[3].label:run:0",
    "SENTENCE_CASE:screens[8].sub:run:0"
  ],
  "soc3": [
    "SENTENCE_CASE:screens[0].label:run:0",
    "SENTENCE_CASE:screens[11].blocks[1].label:run:0",
    "SENTENCE_CASE:screens[11].blocks[1].label:run:1",
    "SENTENCE_CASE:screens[11].blocks[3].label:run:0",
    "SENTENCE_CASE:screens[11].blocks[4].label:run:0",
    "SENTENCE_CASE:screens[6].label:run:0",
    "SENTENCE_CASE:screens[7].label:run:0",
    "SENTENCE_CASE:screens[8].label:run:0",
    "SENTENCE_CASE:title:run:0"
  ],
  "soc4": [
    "SENTENCE_CASE:screens[4].blocks[0].label:run:0",
    "SENTENCE_CASE:screens[4].blocks[1].heading:run:0",
    "SENTENCE_CASE:screens[4].heading:run:0",
    "SENTENCE_CASE:screens[8].blocks[0].tiers[1].label:run:0",
    "SENTENCE_CASE:screens[8].blocks[0].tiers[2].label:run:0"
  ],
  "soc6": [
    "SENTENCE_CASE:screens[0].label:run:0",
    "SENTENCE_CASE:screens[2].label:run:0",
    "SENTENCE_CASE:title:run:0"
  ]
}

