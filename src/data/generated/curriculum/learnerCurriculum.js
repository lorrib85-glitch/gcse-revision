// GENERATED FILE — DO NOT EDIT.
//
// Run `pnpm curriculum:runtime:generate` after changing canonical curriculum
// records, Learning Sequences or Chapter content.
// `pnpm curriculum:runtime:check` fails when this projection drifts.
//
// Production imports this model through src/data/learnerCurriculum.js.
//
// Source: canonical curriculum records + build-time Learning Sequences +
// derived screen metadata. No runtime-v1 compatibility data is an input.

export const LEARNING_SEQUENCES = [
  {
    "id": "history-medicine",
    "position": 0,
    "title": "Medicine Through Time",
    "subjectId": "history",
    "subject": "History",
    "moduleIds": [
      "history-edexcel-medicine-britain",
      "history-edexcel-western-front"
    ],
    "chapterIds": [
      "history-medicine-medieval-beliefs-causes",
      "history-medicine-black-death",
      "history-medicine-vesalius-beginning-doubt",
      "history-medicine-harvey-pare-renaissance-method",
      "history-medicine-great-plague-1665",
      "history-medicine-surgery-anaesthetics",
      "history-medicine-jenner-vaccination",
      "history-medicine-germ-theory",
      "history-medicine-great-stink",
      "history-medicine-surgery-revolution",
      "history-medicine-nightingale",
      "history-medicine-accidental-miracle",
      "history-medicine-modern-medicine",
      "history-medicine-cancer",
      "history-medicine-western-front"
    ]
  },
  {
    "id": "sociology-family",
    "position": 1,
    "title": "Sociology of the Family",
    "subjectId": "sociology",
    "subject": "Sociology",
    "moduleIds": [
      "sociology-aqa-key-concepts",
      "sociology-aqa-families"
    ],
    "chapterIds": [
      "soc1",
      "soc2",
      "soc3",
      "soc4",
      "soc6"
    ]
  },
  {
    "id": "maths-number",
    "position": 2,
    "title": "GCSE Maths",
    "subjectId": "mathematics",
    "subject": "Maths",
    "moduleIds": [
      "maths-aqa-number"
    ],
    "chapterIds": [
      "math1",
      "math2",
      "math3",
      "math4",
      "math5",
      "math6",
      "math7",
      "math8"
    ]
  },
  {
    "id": "biology-core",
    "position": 3,
    "title": "GCSE Biology",
    "subjectId": "biology",
    "subject": "Biology",
    "moduleIds": [
      "biology-aqa-cell-biology",
      "biology-aqa-organisation",
      "biology-aqa-infection-and-response",
      "biology-aqa-homeostasis",
      "biology-aqa-inheritance-variation-evolution",
      "biology-aqa-ecology"
    ],
    "chapterIds": [
      "bio_building_blocks",
      "sci_bio_w1",
      "bio_building_life",
      "bio_human_machine",
      "bio_disease_wars",
      "bio_control_systems",
      "bio_genetics_evolution",
      "bio_ecosystems_group"
    ]
  },
  {
    "id": "english-macbeth",
    "position": 4,
    "title": "Macbeth",
    "subjectId": "english-literature",
    "subject": "English",
    "moduleIds": [
      "english-lit-aqa-macbeth"
    ],
    "chapterIds": [
      "english-macbeth-power-ambition",
      "english-macbeth-guilt-consequence",
      "english-macbeth-witches-fate",
      "english-macbeth-appearance-reality"
    ]
  },
  {
    "id": "history-spain-new-world",
    "position": 5,
    "title": "Spain and the New World, c1490–c1555",
    "subjectId": "history",
    "subject": "History",
    "moduleIds": [
      "history-edexcel-spain-new-world"
    ],
    "chapterIds": [
      "spain-new-world-1",
      "spain-new-world-2",
      "spain-new-world-3",
      "spain-new-world-4",
      "spain-new-world-5",
      "spain-new-world-6",
      "spain-new-world-7",
      "spain-new-world-8",
      "spain-new-world-9",
      "spain-new-world-10"
    ]
  },
  {
    "id": "history-usa-conflict",
    "position": 6,
    "title": "USA: conflict at home and abroad",
    "subjectId": "history",
    "subject": "History",
    "moduleIds": [
      "history-edexcel-usa-conflict"
    ],
    "chapterIds": [
      "usa-segregation",
      "usa-brown-v-board",
      "usa-rosa-parks",
      "usa-sit-ins",
      "usa-i-have-a-dream",
      "usa-malcolm-x",
      "usa-how-much-changed",
      "usa-why-vietnam",
      "usa-americas-war",
      "usa-guerrilla-war",
      "usa-war-comes-home",
      "usa-long-way-out"
    ]
  }
]

export const CURRICULUM_MODULES = [
  {
    "id": "biology-aqa-cell-biology",
    "title": "Cell biology",
    "shortTitle": "Cells",
    "subjectId": "biology",
    "subject": "Biology",
    "status": "active",
    "chapterRefs": [
      {
        "chapterId": "bio_building_blocks",
        "position": 0
      },
      {
        "chapterId": "sci_bio_w1",
        "position": 1
      },
      {
        "chapterId": "bio_building_life",
        "position": 2
      }
    ],
    "presentation": {
      "heroImage": "/images/biology/_shared/buildinglife.webp",
      "shortDescription": "Cell structure, microscopy, transport and cell division."
    },
    "sequenceId": "biology-core"
  },
  {
    "id": "biology-aqa-ecology",
    "title": "Ecology",
    "shortTitle": "Ecology",
    "subjectId": "biology",
    "subject": "Biology",
    "status": "planned",
    "chapterRefs": [
      {
        "chapterId": "bio_ecosystems_group",
        "position": 0
      }
    ],
    "presentation": {
      "heroImage": "/images/biology/_shared/ecosystems.webp",
      "shortDescription": "Adaptation, food chains, cycles, biodiversity and human impact."
    },
    "sequenceId": "biology-core"
  },
  {
    "id": "biology-aqa-homeostasis",
    "title": "Homeostasis and response",
    "shortTitle": "Homeostasis",
    "subjectId": "biology",
    "subject": "Biology",
    "status": "planned",
    "chapterRefs": [
      {
        "chapterId": "bio_control_systems",
        "position": 0
      }
    ],
    "presentation": {
      "heroImage": "/images/biology/_shared/controlsystems.webp",
      "shortDescription": "The nervous system, hormonal control and how the body holds itself steady."
    },
    "sequenceId": "biology-core"
  },
  {
    "id": "biology-aqa-infection-and-response",
    "title": "Infection and response",
    "shortTitle": "Infection",
    "subjectId": "biology",
    "subject": "Biology",
    "status": "planned",
    "chapterRefs": [
      {
        "chapterId": "bio_disease_wars",
        "position": 0
      }
    ],
    "presentation": {
      "heroImage": "/images/biology/_shared/diseasewars.webp",
      "shortDescription": "Pathogens, the immune response, vaccination and drug development."
    },
    "sequenceId": "biology-core"
  },
  {
    "id": "biology-aqa-inheritance-variation-evolution",
    "title": "Inheritance, variation and evolution",
    "shortTitle": "Inheritance",
    "subjectId": "biology",
    "subject": "Biology",
    "status": "planned",
    "chapterRefs": [
      {
        "chapterId": "bio_genetics_evolution",
        "position": 0
      }
    ],
    "presentation": {
      "heroImage": "/images/biology/_shared/genetics.webp",
      "shortDescription": "DNA, inheritance, variation, natural selection and selective breeding."
    },
    "sequenceId": "biology-core"
  },
  {
    "id": "biology-aqa-organisation",
    "title": "Organisation",
    "shortTitle": "Organisation",
    "subjectId": "biology",
    "subject": "Biology",
    "status": "planned",
    "chapterRefs": [
      {
        "chapterId": "bio_human_machine",
        "position": 0
      }
    ],
    "presentation": {
      "heroImage": "/images/biology/_shared/humanmachine.webp",
      "shortDescription": "Tissues, organs and the digestive, circulatory and respiratory systems."
    },
    "sequenceId": "biology-core"
  },
  {
    "id": "chemistry-aqa-atomic-structure",
    "title": "Atomic structure and the periodic table",
    "shortTitle": "Atomic structure",
    "subjectId": "chemistry",
    "subject": "Chemistry",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Atoms, elements, compounds and the structure of the periodic table."
    },
    "sequenceId": null
  },
  {
    "id": "english-language-aqa-creative-writing",
    "title": "Creative writing",
    "shortTitle": "Creative",
    "subjectId": "english-language",
    "subject": "English",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Descriptive and narrative writing to a prompt or an image."
    },
    "sequenceId": null
  },
  {
    "id": "english-language-aqa-reading-fiction",
    "title": "Reading fiction",
    "shortTitle": "Fiction",
    "subjectId": "english-language",
    "subject": "English",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Reading an unseen literature-fiction extract for language, structure and effect."
    },
    "sequenceId": null
  },
  {
    "id": "english-language-aqa-reading-non-fiction",
    "title": "Reading non-fiction",
    "shortTitle": "Non-fiction",
    "subjectId": "english-language",
    "subject": "English",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Comparing two unseen non-fiction texts from different centuries."
    },
    "sequenceId": null
  },
  {
    "id": "english-language-aqa-viewpoint-writing",
    "title": "Viewpoint writing",
    "shortTitle": "Viewpoint",
    "subjectId": "english-language",
    "subject": "English",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Writing to present a point of view for a stated form, purpose and audience."
    },
    "sequenceId": null
  },
  {
    "id": "english-lit-aqa-inspector-calls",
    "title": "An Inspector Calls",
    "shortTitle": "Inspector",
    "subjectId": "english-literature",
    "subject": "English",
    "status": "planned",
    "chapterRefs": [
      {
        "chapterId": "english-inspector-calls-social-message",
        "position": 0
      },
      {
        "chapterId": "english-inspector-calls-responsibility-denial",
        "position": 1
      },
      {
        "chapterId": "english-inspector-calls-consequences-resolution",
        "position": 2
      }
    ],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Priestley's modern text: social responsibility, denial and consequence."
    },
    "sequenceId": null
  },
  {
    "id": "english-lit-aqa-macbeth",
    "title": "Macbeth",
    "shortTitle": "Macbeth",
    "subjectId": "english-literature",
    "subject": "English",
    "status": "active",
    "chapterRefs": [
      {
        "chapterId": "english-macbeth-power-ambition",
        "position": 0
      },
      {
        "chapterId": "english-macbeth-guilt-consequence",
        "position": 1
      },
      {
        "chapterId": "english-macbeth-witches-fate",
        "position": 2
      },
      {
        "chapterId": "english-macbeth-appearance-reality",
        "position": 3
      }
    ],
    "presentation": {
      "heroImage": null,
      "shortDescription": "The Shakespeare text: power, ambition, guilt, fate and appearance against reality."
    },
    "sequenceId": "english-macbeth"
  },
  {
    "id": "history-edexcel-early-elizabethan",
    "title": "Early Elizabethan England, 1558–88",
    "shortTitle": "Elizabethan",
    "subjectId": "history",
    "subject": "History",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": "/images/history/_shared/elizabethan.webp",
      "shortDescription": "The British depth study: settlement, plots, Mary Queen of Scots and the Armada."
    },
    "sequenceId": null
  },
  {
    "id": "history-edexcel-medicine-britain",
    "title": "Medicine through time",
    "shortTitle": "Medicine",
    "subjectId": "history",
    "subject": "History",
    "status": "active",
    "chapterRefs": [
      {
        "chapterId": "history-medicine-medieval-beliefs-causes",
        "position": 0
      },
      {
        "chapterId": "history-medicine-black-death",
        "position": 1
      },
      {
        "chapterId": "history-medicine-vesalius-beginning-doubt",
        "position": 2
      },
      {
        "chapterId": "history-medicine-harvey-pare-renaissance-method",
        "position": 3
      },
      {
        "chapterId": "history-medicine-great-plague-1665",
        "position": 4
      },
      {
        "chapterId": "history-medicine-surgery-anaesthetics",
        "position": 5
      },
      {
        "chapterId": "history-medicine-jenner-vaccination",
        "position": 6
      },
      {
        "chapterId": "history-medicine-germ-theory",
        "position": 7
      },
      {
        "chapterId": "history-medicine-great-stink",
        "position": 8
      },
      {
        "chapterId": "history-medicine-surgery-revolution",
        "position": 9
      },
      {
        "chapterId": "history-medicine-nightingale",
        "position": 10
      },
      {
        "chapterId": "history-medicine-accidental-miracle",
        "position": 11
      },
      {
        "chapterId": "history-medicine-modern-medicine",
        "position": 12
      },
      {
        "chapterId": "history-medicine-cancer",
        "position": 13
      }
    ],
    "presentation": {
      "heroImage": "/images/history/_shared/medicine-through-time.webp",
      "shortDescription": "The thematic study: c1250 to the present, and what changed medicine at each turn."
    },
    "sequenceId": "history-medicine"
  },
  {
    "id": "history-edexcel-spain-new-world",
    "title": "Spain and the new world, c1490–c1555",
    "shortTitle": "Spain",
    "subjectId": "history",
    "subject": "History",
    "status": "planned",
    "chapterRefs": [
      {
        "chapterId": "spain-new-world-1",
        "position": 0
      },
      {
        "chapterId": "spain-new-world-2",
        "position": 1
      },
      {
        "chapterId": "spain-new-world-3",
        "position": 2
      },
      {
        "chapterId": "spain-new-world-4",
        "position": 3
      },
      {
        "chapterId": "spain-new-world-5",
        "position": 4
      },
      {
        "chapterId": "spain-new-world-6",
        "position": 5
      },
      {
        "chapterId": "spain-new-world-7",
        "position": 6
      },
      {
        "chapterId": "spain-new-world-8",
        "position": 7
      },
      {
        "chapterId": "spain-new-world-9",
        "position": 8
      },
      {
        "chapterId": "spain-new-world-10",
        "position": 9
      }
    ],
    "presentation": {
      "heroImage": "/images/history/_shared/spain-new-world.webp",
      "shortDescription": "The period study: Columbus, the conquistadors, the fall of the Aztecs and the silver economy."
    },
    "sequenceId": "history-spain-new-world"
  },
  {
    "id": "history-edexcel-usa-conflict",
    "title": "The USA, 1954–75: conflict at home and abroad",
    "shortTitle": "USA",
    "subjectId": "history",
    "subject": "History",
    "status": "planned",
    "chapterRefs": [
      {
        "chapterId": "usa-segregation",
        "position": 0
      },
      {
        "chapterId": "usa-brown-v-board",
        "position": 1
      },
      {
        "chapterId": "usa-rosa-parks",
        "position": 2
      },
      {
        "chapterId": "usa-sit-ins",
        "position": 3
      },
      {
        "chapterId": "usa-i-have-a-dream",
        "position": 4
      },
      {
        "chapterId": "usa-malcolm-x",
        "position": 5
      },
      {
        "chapterId": "usa-how-much-changed",
        "position": 6
      },
      {
        "chapterId": "usa-why-vietnam",
        "position": 7
      },
      {
        "chapterId": "usa-americas-war",
        "position": 8
      },
      {
        "chapterId": "usa-guerrilla-war",
        "position": 9
      },
      {
        "chapterId": "usa-war-comes-home",
        "position": 10
      },
      {
        "chapterId": "usa-long-way-out",
        "position": 11
      }
    ],
    "presentation": {
      "heroImage": "/images/history/_shared/usa-conflict.webp",
      "shortDescription": "The modern depth study: civil rights at home and the war in Vietnam."
    },
    "sequenceId": "history-usa-conflict"
  },
  {
    "id": "history-edexcel-western-front",
    "title": "The British sector of the Western Front",
    "shortTitle": "Western Front",
    "subjectId": "history",
    "subject": "History",
    "status": "active",
    "chapterRefs": [
      {
        "chapterId": "history-medicine-western-front",
        "position": 0
      }
    ],
    "presentation": {
      "heroImage": null,
      "shortDescription": "The historic environment: injuries, treatment and the chain of evacuation, 1914–18."
    },
    "sequenceId": "history-medicine"
  },
  {
    "id": "maths-aqa-algebra",
    "title": "Algebra",
    "shortTitle": "Algebra",
    "subjectId": "mathematics",
    "subject": "Maths",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Expressions, equations, sequences and graphs."
    },
    "sequenceId": null
  },
  {
    "id": "maths-aqa-geometry-measures",
    "title": "Geometry and measures",
    "shortTitle": "Geometry",
    "subjectId": "mathematics",
    "subject": "Maths",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Angles, shape properties, area and volume, transformations, Pythagoras and trigonometry."
    },
    "sequenceId": null
  },
  {
    "id": "maths-aqa-higher-algebra-extension",
    "title": "Higher algebra extension",
    "shortTitle": "Higher algebra",
    "subjectId": "mathematics",
    "subject": "Maths",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "The algebra the Higher tier adds: algebraic fractions, iteration, functions and proof."
    },
    "sequenceId": null
  },
  {
    "id": "maths-aqa-number",
    "title": "Number",
    "shortTitle": "Number",
    "subjectId": "mathematics",
    "subject": "Maths",
    "status": "active",
    "chapterRefs": [
      {
        "chapterId": "math1",
        "position": 0
      },
      {
        "chapterId": "math2",
        "position": 1
      },
      {
        "chapterId": "math3",
        "position": 2
      },
      {
        "chapterId": "math4",
        "position": 3
      },
      {
        "chapterId": "math5",
        "position": 4
      },
      {
        "chapterId": "math6",
        "position": 5
      },
      {
        "chapterId": "math7",
        "position": 6
      },
      {
        "chapterId": "math8",
        "position": 7
      }
    ],
    "presentation": {
      "heroImage": "/images/maths/_shared/numbers.webp",
      "shortDescription": "Place value, the four operations, negatives, BIDMAS, rounding, factors, powers and fractions."
    },
    "sequenceId": "maths-number"
  },
  {
    "id": "maths-aqa-probability",
    "title": "Probability",
    "shortTitle": "Probability",
    "subjectId": "mathematics",
    "subject": "Maths",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Probability scales, tree diagrams, Venn diagrams and relative frequency."
    },
    "sequenceId": null
  },
  {
    "id": "maths-aqa-ratio-proportion",
    "title": "Ratio, proportion and rates of change",
    "shortTitle": "Ratio",
    "subjectId": "mathematics",
    "subject": "Maths",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Ratio, percentages, compound measures and direct and inverse proportion."
    },
    "sequenceId": null
  },
  {
    "id": "maths-aqa-statistics",
    "title": "Statistics",
    "shortTitle": "Statistics",
    "subjectId": "mathematics",
    "subject": "Maths",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Sampling, averages, spread and the charts that carry them."
    },
    "sequenceId": null
  },
  {
    "id": "physics-aqa-energy",
    "title": "Energy",
    "shortTitle": "Energy",
    "subjectId": "physics",
    "subject": "Physics",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "AQA Physics · Topic 1"
    },
    "sequenceId": null
  },
  {
    "id": "physics-aqa-forces-motion",
    "title": "Forces and motion",
    "shortTitle": "Forces",
    "subjectId": "physics",
    "subject": "Physics",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "AQA Physics · Topic 5 & 6"
    },
    "sequenceId": null
  },
  {
    "id": "physics-aqa-matter-particles",
    "title": "Matter and particles",
    "shortTitle": "Matter",
    "subjectId": "physics",
    "subject": "Physics",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "AQA Physics · Topic 3 & 4"
    },
    "sequenceId": null
  },
  {
    "id": "physics-aqa-space",
    "title": "Space",
    "shortTitle": "Space",
    "subjectId": "physics",
    "subject": "Physics",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "AQA Physics · Topic 8"
    },
    "sequenceId": null
  },
  {
    "id": "physics-aqa-waves-electricity",
    "title": "Waves and electricity",
    "shortTitle": "Waves",
    "subjectId": "physics",
    "subject": "Physics",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "AQA Physics · Topic 6 & 2"
    },
    "sequenceId": null
  },
  {
    "id": "sociology-aqa-crime-deviance",
    "title": "Crime and deviance",
    "shortTitle": "Crime",
    "subjectId": "sociology",
    "subject": "Sociology",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Explanations of crime, social control and the patterns in who is criminalised."
    },
    "sequenceId": null
  },
  {
    "id": "sociology-aqa-education",
    "title": "Education",
    "shortTitle": "Education",
    "subjectId": "sociology",
    "subject": "Sociology",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "The role of education, achievement and the processes inside schools."
    },
    "sequenceId": null
  },
  {
    "id": "sociology-aqa-families",
    "title": "Families",
    "shortTitle": "Families",
    "subjectId": "sociology",
    "subject": "Sociology",
    "status": "active",
    "chapterRefs": [
      {
        "chapterId": "soc4",
        "position": 0
      },
      {
        "chapterId": "soc6",
        "position": 1
      }
    ],
    "presentation": {
      "heroImage": "/images/sociology/_shared/family.webp",
      "shortDescription": "Family forms, roles, relationships and the researchers who disagree about them."
    },
    "sequenceId": "sociology-family"
  },
  {
    "id": "sociology-aqa-key-concepts",
    "title": "Key concepts and approaches",
    "shortTitle": "Key concepts",
    "subjectId": "sociology",
    "subject": "Sociology",
    "status": "active",
    "chapterRefs": [
      {
        "chapterId": "soc1",
        "position": 0
      },
      {
        "chapterId": "soc2",
        "position": 1
      },
      {
        "chapterId": "soc3",
        "position": 2
      }
    ],
    "presentation": {
      "heroImage": "/images/sociology/_shared/main.webp",
      "shortDescription": "Culture, norms, values, socialisation and the sociological approaches that run through both papers."
    },
    "sequenceId": "sociology-family"
  },
  {
    "id": "sociology-aqa-research-methods",
    "title": "Research methods",
    "shortTitle": "Methods",
    "subjectId": "sociology",
    "subject": "Sociology",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Sampling, methods, ethics and evaluating a study — assessed across both papers."
    },
    "sequenceId": null
  },
  {
    "id": "sociology-aqa-social-stratification",
    "title": "Social stratification",
    "shortTitle": "Stratification",
    "subjectId": "sociology",
    "subject": "Sociology",
    "status": "planned",
    "chapterRefs": [],
    "presentation": {
      "heroImage": null,
      "shortDescription": "Class, wealth, power, life chances and social mobility."
    },
    "sequenceId": null
  }
]

export const CURRICULUM_CHAPTERS = [
  {
    "id": "bio_building_blocks",
    "subjectId": "biology",
    "subject": "Biology",
    "moduleId": "biology-aqa-cell-biology",
    "modulePosition": 0,
    "sequenceId": "biology-core",
    "sequencePosition": 0,
    "title": "Building blocks",
    "subtitle": "What every living thing is built from",
    "era": null,
    "icon": "🧬",
    "headerImage": "/images/biology/_shared/main.webp",
    "status": "available",
    "screenCount": 14,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "sci_bio_w1",
    "subjectId": "biology",
    "subject": "Biology",
    "moduleId": "biology-aqa-cell-biology",
    "modulePosition": 1,
    "sequenceId": "biology-core",
    "sequencePosition": 1,
    "title": "Plant Cells & Photosynthesis",
    "subtitle": "Tiny factories, big chemistry",
    "era": null,
    "icon": "🌿",
    "headerImage": "/images/biology/_shared/buildinglife.webp",
    "status": "available",
    "screenCount": 9,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "bio_building_life",
    "subjectId": "biology",
    "subject": "Biology",
    "moduleId": "biology-aqa-cell-biology",
    "modulePosition": 2,
    "sequenceId": "biology-core",
    "sequencePosition": 2,
    "title": "Building Life",
    "subtitle": "Cells, Microscopes & Division",
    "era": null,
    "icon": "🔬",
    "headerImage": "/images/biology/_shared/buildinglife.webp",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "bio_ecosystems_group",
    "subjectId": "biology",
    "subject": "Biology",
    "moduleId": "biology-aqa-ecology",
    "modulePosition": 0,
    "sequenceId": "biology-core",
    "sequencePosition": 7,
    "title": "Ecosystems",
    "subtitle": "Food Chains, Biodiversity & Conservation",
    "era": null,
    "icon": "🌿",
    "headerImage": "/images/biology/_shared/ecosystems.webp",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "bio_control_systems",
    "subjectId": "biology",
    "subject": "Biology",
    "moduleId": "biology-aqa-homeostasis",
    "modulePosition": 0,
    "sequenceId": "biology-core",
    "sequencePosition": 5,
    "title": "Control Systems",
    "subtitle": "Nerves, Hormones & Reproduction",
    "era": null,
    "icon": "🧠",
    "headerImage": "/images/biology/_shared/controlsystems.webp",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "bio_disease_wars",
    "subjectId": "biology",
    "subject": "Biology",
    "moduleId": "biology-aqa-infection-and-response",
    "modulePosition": 0,
    "sequenceId": "biology-core",
    "sequencePosition": 4,
    "title": "Disease Wars",
    "subtitle": "Pathogens, Immunity & Treatment",
    "era": null,
    "icon": "🦠",
    "headerImage": "/images/biology/_shared/diseasewars.webp",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "bio_genetics_evolution",
    "subjectId": "biology",
    "subject": "Biology",
    "moduleId": "biology-aqa-inheritance-variation-evolution",
    "modulePosition": 0,
    "sequenceId": "biology-core",
    "sequencePosition": 6,
    "title": "Genetics & Evolution",
    "subtitle": "DNA, Inheritance & Natural Selection",
    "era": null,
    "icon": "🧬",
    "headerImage": "/images/biology/_shared/genetics.webp",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "bio_human_machine",
    "subjectId": "biology",
    "subject": "Biology",
    "moduleId": "biology-aqa-organisation",
    "modulePosition": 0,
    "sequenceId": "biology-core",
    "sequencePosition": 3,
    "title": "The Human Machine",
    "subtitle": "Organs, Digestion & Circulation",
    "era": null,
    "icon": "🫀",
    "headerImage": "/images/biology/_shared/humanmachine.webp",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "english-inspector-calls-social-message",
    "subjectId": "english-literature",
    "subject": "English",
    "moduleId": "english-lit-aqa-inspector-calls",
    "modulePosition": 0,
    "sequenceId": null,
    "sequencePosition": null,
    "title": "We are members of one body",
    "subtitle": "Priestley's social message",
    "era": null,
    "icon": null,
    "headerImage": null,
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "english-inspector-calls-responsibility-denial",
    "subjectId": "english-literature",
    "subject": "English",
    "moduleId": "english-lit-aqa-inspector-calls",
    "modulePosition": 1,
    "sequenceId": null,
    "sequencePosition": null,
    "title": "I accept no blame",
    "subtitle": "Responsibility and denial",
    "era": null,
    "icon": null,
    "headerImage": null,
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "english-inspector-calls-consequences-resolution",
    "subjectId": "english-literature",
    "subject": "English",
    "moduleId": "english-lit-aqa-inspector-calls",
    "modulePosition": 2,
    "sequenceId": null,
    "sequencePosition": null,
    "title": "Fire, blood and anguish",
    "subtitle": "Consequences and resolution",
    "era": null,
    "icon": null,
    "headerImage": null,
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "english-macbeth-power-ambition",
    "subjectId": "english-literature",
    "subject": "English",
    "moduleId": "english-lit-aqa-macbeth",
    "modulePosition": 0,
    "sequenceId": "english-macbeth",
    "sequencePosition": 0,
    "title": "Power and ambition",
    "subtitle": "Analyse a Macbeth quote like an examiner",
    "era": "AQA GCSE English Literature",
    "icon": "🗡️",
    "headerImage": "/images/english/_shared/macbeth.webp",
    "status": "available",
    "screenCount": 1,
    "screenTags": [
      "english:quote-analysis"
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "english-macbeth-guilt-consequence",
    "subjectId": "english-literature",
    "subject": "English",
    "moduleId": "english-lit-aqa-macbeth",
    "modulePosition": 1,
    "sequenceId": "english-macbeth",
    "sequencePosition": 1,
    "title": "Out, damned spot",
    "subtitle": "Guilt and consequence",
    "era": null,
    "icon": null,
    "headerImage": null,
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "english-macbeth-witches-fate",
    "subjectId": "english-literature",
    "subject": "English",
    "moduleId": "english-lit-aqa-macbeth",
    "modulePosition": 2,
    "sequenceId": "english-macbeth",
    "sequencePosition": 2,
    "title": "Double, double, toil and trouble",
    "subtitle": "The witches and fate",
    "era": null,
    "icon": null,
    "headerImage": null,
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "english-macbeth-appearance-reality",
    "subjectId": "english-literature",
    "subject": "English",
    "moduleId": "english-lit-aqa-macbeth",
    "modulePosition": 3,
    "sequenceId": "english-macbeth",
    "sequencePosition": 3,
    "title": "Fair is foul, foul is fair",
    "subtitle": "Appearance vs reality",
    "era": null,
    "icon": null,
    "headerImage": null,
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "history-medicine-medieval-beliefs-causes",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 0,
    "sequenceId": "history-medicine",
    "sequencePosition": 0,
    "title": "Trust me, I'm Following Jupiter",
    "subtitle": "Medieval medicine: beliefs and causes of disease",
    "era": "c.1250–c.1500",
    "icon": "⚕️",
    "headerImage": "/images/history/medicine/headers/medieval-beliefs-causes.png",
    "status": "available",
    "screenCount": 34,
    "screenTags": [
      null,
      null,
      null,
      "four-humours",
      null,
      null,
      null,
      "galen",
      null,
      null,
      null,
      null,
      null,
      "medieval-practitioners",
      "miasma",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "core-takeaway",
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:four-humours",
      "history:medicine:galen",
      "history:medicine:hippocrates",
      "history:medicine:astrology",
      "history:medicine:religion",
      "history:medicine:miasma",
      "history:medicine:bloodletting",
      "history:medicine:barber-surgeons",
      "history:medicine:apothecaries",
      "history:medicine:medieval-hospitals"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-black-death",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 1,
    "sequenceId": "history-medicine",
    "sequencePosition": 1,
    "title": "The day everything changed",
    "subtitle": "The Black Death, 1348–1349",
    "era": "c.1348–c.1350",
    "icon": "☠️",
    "headerImage": "/images/history/medicine/headers/black-death.png",
    "status": "available",
    "screenCount": 24,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "plague-explanations",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:black-death",
      "history:medicine:flagellants",
      "history:medicine:miasma",
      "history:medicine:religion",
      "history:medicine:quarantine"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-vesalius-beginning-doubt",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 2,
    "sequenceId": "history-medicine",
    "sequencePosition": 2,
    "title": "The beginning of doubt",
    "subtitle": "Vesalius and the Medical Renaissance",
    "era": "c.1500–c.1600",
    "icon": "🔬",
    "headerImage": "/images/history/medicine/headers/renaissance.png",
    "status": "available",
    "screenCount": 12,
    "screenTags": [
      null,
      null,
      null,
      "vesalius",
      null,
      null,
      "printing-press",
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:vesalius",
      "history:medicine:printing-press",
      "history:medicine:anatomy"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-harvey-pare-renaissance-method",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 3,
    "sequenceId": "history-medicine",
    "sequencePosition": 3,
    "title": "The man who proved everyone wrong",
    "subtitle": "Harvey, Paré and Renaissance method",
    "era": "c.1537–c.1628",
    "icon": "🫀",
    "headerImage": "/images/history/medicine/headers/man-proved-wrong.png",
    "status": "available",
    "screenCount": 11,
    "screenTags": [
      null,
      null,
      null,
      "harvey",
      null,
      null,
      "pare",
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:harvey",
      "history:medicine:pare",
      "history:medicine:circulation"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-great-plague-1665",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 4,
    "sequenceId": "history-medicine",
    "sequencePosition": 4,
    "title": "London's year of terror",
    "subtitle": "The Great Plague of London, 1665",
    "era": "c.1665",
    "icon": "💀",
    "headerImage": "/images/history/medicine/headers/london-terror.png",
    "status": "available",
    "screenCount": 11,
    "screenTags": [
      null,
      "great-plague",
      null,
      null,
      "plague-explanations",
      null,
      null,
      null,
      "plague-comparison",
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:great-plague",
      "history:medicine:plague-doctors",
      "history:medicine:quarantine",
      "history:medicine:miasma"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-surgery-anaesthetics",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 5,
    "sequenceId": "history-medicine",
    "sequencePosition": 5,
    "title": "Surgery & anatomy",
    "subtitle": "Hold him down and hope",
    "era": "c.1700–c.1900",
    "icon": "🩺",
    "headerImage": "/images/history/medicine/headers/man-proved-wrong.png",
    "status": "available",
    "screenCount": 11,
    "screenTags": [
      null,
      "anaesthetics",
      null,
      null,
      null,
      null,
      null,
      null,
      "antiseptic-surgery",
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:anaesthetics",
      "history:medicine:chloroform",
      "history:medicine:simpson",
      "history:medicine:antiseptics"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-jenner-vaccination",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 6,
    "sequenceId": "history-medicine",
    "sequencePosition": 6,
    "title": "The boy, the cow and the cure",
    "subtitle": "Edward Jenner and the birth of vaccination",
    "era": "c.1796–c.1853",
    "icon": "🐄",
    "headerImage": "/images/history/medicine/headers/jenner.png",
    "status": "available",
    "screenCount": 1,
    "screenTags": [
      "vaccination"
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:jenner",
      "history:medicine:vaccination",
      "history:medicine:inoculation",
      "history:medicine:smallpox"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-germ-theory",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 7,
    "sequenceId": "history-medicine",
    "sequencePosition": 7,
    "title": "The invisible enemy",
    "subtitle": "Pasteur, Koch and germ theory",
    "era": "c.1857–c.1883",
    "icon": "🦠",
    "headerImage": "/images/history/medicine/headers/invisible-enemy.png",
    "status": "available",
    "screenCount": 10,
    "screenTags": [
      "germ-theory",
      "pasteur",
      "koch",
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:germ-theory",
      "history:medicine:pasteur",
      "history:medicine:koch",
      "history:medicine:spontaneous-generation"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-great-stink",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 8,
    "sequenceId": "history-medicine",
    "sequencePosition": 8,
    "title": "The great stink",
    "subtitle": "Public health 1800–1900",
    "era": "c.1800–c.1900",
    "icon": "🏭",
    "headerImage": "/images/history/medicine/headers/great-stink.png",
    "status": "available",
    "screenCount": 7,
    "screenTags": [
      null,
      null,
      null,
      "john-snow",
      "public-health",
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:john-snow",
      "history:medicine:cholera",
      "history:medicine:broad-street-pump",
      "history:medicine:great-stink",
      "history:medicine:bazalgette",
      "history:medicine:public-health-act-1875"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-surgery-revolution",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 9,
    "sequenceId": "history-medicine",
    "sequencePosition": 9,
    "title": "The day surgery changed forever",
    "subtitle": "Anaesthetics and antiseptics",
    "era": "c.1840–c.1900",
    "icon": "🔪",
    "headerImage": "/images/history/medicine/headers/surgery-revolution.png",
    "status": "available",
    "screenCount": 10,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:anaesthetics",
      "history:medicine:chloroform",
      "history:medicine:simpson",
      "history:medicine:antiseptics",
      "history:medicine:lister",
      "history:medicine:carbolic-acid",
      "history:medicine:aseptic-surgery"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-nightingale",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 10,
    "sequenceId": "history-medicine",
    "sequencePosition": 10,
    "title": "The lady with the lamp",
    "subtitle": "Florence Nightingale and modern nursing",
    "era": "c.1854–c.1860",
    "icon": "🕯️",
    "headerImage": "/images/history/medicine/headers/lady-lamp.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:nightingale"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-accidental-miracle",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 11,
    "sequenceId": "history-medicine",
    "sequencePosition": 11,
    "title": "The accidental miracle",
    "subtitle": "Magic bullets, penicillin & the antibiotic revolution",
    "era": "c.1890–c.1945",
    "icon": "💊",
    "headerImage": "/images/history/medicine/headers/accidental-miracle.png",
    "status": "available",
    "screenCount": 11,
    "screenTags": [
      null,
      "magic-bullet",
      "penicillin",
      null,
      null,
      "wwi-medicine",
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:magic-bullets",
      "history:medicine:ehrlich",
      "history:medicine:salvarsan-606",
      "history:medicine:penicillin",
      "history:medicine:fleming",
      "history:medicine:florey-and-chain"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-modern-medicine",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 12,
    "sequenceId": "history-medicine",
    "sequencePosition": 12,
    "title": "When medicine became magic",
    "subtitle": "NHS & modern medicine",
    "era": "c.1948–present",
    "icon": "🧬",
    "headerImage": "/images/history/medicine/headers/modern.png",
    "status": "available",
    "screenCount": 9,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:nhs",
      "history:medicine:dna",
      "history:medicine:watson-and-crick",
      "history:medicine:lifestyle-factors"
    ],
    "requirementIds": []
  },
  {
    "id": "history-medicine-cancer",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-medicine-britain",
    "modulePosition": 13,
    "sequenceId": "history-medicine",
    "sequencePosition": 13,
    "title": "Can we beat cancer?",
    "subtitle": "Lung cancer and modern public health",
    "era": "AQA GCSE",
    "icon": "🏥",
    "headerImage": "/images/history/medicine/headers/nhs.png",
    "status": "available",
    "screenCount": 11,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:cancer-treatment",
      "history:medicine:lifestyle-factors"
    ],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-1",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 0,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 0,
    "title": "The man who wanted to sail west",
    "subtitle": "Spain c.1490, Columbus, Isabella & the 1492 voyage",
    "era": "c.1490–c.1492",
    "icon": "⛵",
    "headerImage": "/images/history/spain-new-world/headers/spain-man-sail-west.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-2",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 1,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 1,
    "title": "A new world",
    "subtitle": "Bahamas, Caribbean, Tainos, Caribs, La Navidad — first encounters",
    "era": "c.1492–c.1493",
    "icon": "🌍",
    "headerImage": "/images/history/spain-new-world/headers/spain-a-new-world.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-3",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 2,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 2,
    "title": "Gold, God and empire",
    "subtitle": "Santo Domingo, settlement, disease, missionaries & Treaty of Tordesillas",
    "era": "c.1493–c.1500",
    "icon": "✝️",
    "headerImage": "/images/history/spain-new-world/headers/spain-gold-god-empire.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-4",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 3,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 3,
    "title": "The Conquistadors",
    "subtitle": "Balboa, Cuba, Magellan, the Pacific & Philippines",
    "era": "c.1500–c.1521",
    "icon": "⚔️",
    "headerImage": "/images/history/spain-new-world/headers/spain-conquistadors.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-5",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 4,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 4,
    "title": "The fall of the Aztecs",
    "subtitle": "Cortés, Montezuma, Tlaxcalans & Tenochtitlan",
    "era": "c.1519–c.1521",
    "icon": "🏯",
    "headerImage": "/images/history/spain-new-world/headers/spain-fall-aztecs.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-6",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 5,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 5,
    "title": "What the Spanish left behind",
    "subtitle": "Cortés as governor, consequences for the Aztecs & Panama",
    "era": "c.1521–c.1530",
    "icon": "💀",
    "headerImage": "/images/history/spain-new-world/headers/spain-left-behind.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-7",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 6,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 6,
    "title": "The last Inca Emperor",
    "subtitle": "Huayna Capac, Atahuallpa, Huascar & Pizarro",
    "era": "c.1527–c.1532",
    "icon": "👑",
    "headerImage": "/images/history/spain-new-world/headers/spain-last-inca.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-8",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 7,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 7,
    "title": "The conquest of Peru",
    "subtitle": "Cajamarca, capture, revolt & the siege of Cuzco",
    "era": "c.1532–c.1536",
    "icon": "⚔️",
    "headerImage": "/images/history/spain-new-world/headers/spain-conquest-peru.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-9",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 8,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 8,
    "title": "How to rule an empire",
    "subtitle": "Viceroys, encomienda, Las Casas & the New Laws",
    "era": "c.1535–c.1550",
    "icon": "🏛️",
    "headerImage": "/images/history/spain-new-world/headers/spain-rule-empire.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "spain-new-world-10",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-spain-new-world",
    "modulePosition": 9,
    "sequenceId": "history-spain-new-world",
    "sequencePosition": 9,
    "title": "Silver changed everything",
    "subtitle": "Bolivia, Mexico, La Paz, economy, House of Trade & Council of the Indies",
    "era": "c.1545–c.1600",
    "icon": "💰",
    "headerImage": "/images/history/spain-new-world/headers/spain-silver-changed.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-segregation",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 0,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 0,
    "title": "Separate and unequal",
    "subtitle": "Segregation, discrimination, NAACP & CORE",
    "era": "c.1865–c.1954",
    "icon": "✊",
    "headerImage": "/images/history/usa/headers/usa-separate-unequal.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-brown-v-board",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 1,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 1,
    "title": "The girl who walked into history",
    "subtitle": "Brown v Board of Education & Little Rock",
    "era": "c.1954–c.1957",
    "icon": "🏫",
    "headerImage": "/images/history/usa/headers/usa-girl-walked-history.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-rosa-parks",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 2,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 2,
    "title": "The woman who stayed seated",
    "subtitle": "Rosa Parks, Montgomery, MLK, SCLC & Civil Rights Act 1957",
    "era": "c.1955–c.1957",
    "icon": "🚌",
    "headerImage": "/images/history/usa/headers/usa-woman-stayed-seated.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-sit-ins",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 3,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 3,
    "title": "Standing up, sitting down",
    "subtitle": "Sit-ins, Freedom Riders & James Meredith",
    "era": "c.1960–c.1962",
    "icon": "🪑",
    "headerImage": "/images/history/usa/headers/usa-standing-sitting.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-i-have-a-dream",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 4,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 4,
    "title": "I have a dream",
    "subtitle": "Birmingham, Washington, Freedom Summer, Civil Rights Act 1964, Selma & Voting Rights Act",
    "era": "c.1963–c.1965",
    "icon": "🕊️",
    "headerImage": "/images/history/usa/headers/usa-i-have-a-dream.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-malcolm-x",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 5,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 5,
    "title": "By any means necessary",
    "subtitle": "Malcolm X, Black Muslims, Black Power, Carmichael, Mexico Olympics & Black Panthers",
    "era": "c.1960–c.1969",
    "icon": "✊",
    "headerImage": "/images/history/usa/headers/usa-by-any-means.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-how-much-changed",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 6,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 6,
    "title": "How much had really changed?",
    "subtitle": "Riots, Kerner Report, King's later campaigns, assassination & extent of progress by 1975",
    "era": "c.1965–c.1975",
    "icon": "⚖️",
    "headerImage": "/images/history/usa/headers/usa-how-much-changed.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-why-vietnam",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 7,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 7,
    "title": "Why America went to Vietnam",
    "subtitle": "Domino Theory, Eisenhower, Kennedy & Diem",
    "era": "c.1945–c.1963",
    "icon": "🗺️",
    "headerImage": "/images/history/usa/headers/usa-why-vietnam.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-americas-war",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 8,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 8,
    "title": "America's war",
    "subtitle": "Johnson, Gulf of Tonkin, escalation, Vietcong tactics, Search and Destroy, Rolling Thunder & Tet",
    "era": "c.1964–c.1968",
    "icon": "🔥",
    "headerImage": "/images/history/usa/headers/usa-americas-war.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-guerrilla-war",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 9,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 9,
    "title": "Can you win a guerrilla war?",
    "subtitle": "Vietnamisation, Nixon, Cambodia, Laos & bombing campaigns",
    "era": "c.1969–c.1972",
    "icon": "🌴",
    "headerImage": "/images/history/usa/headers/usa-guerrilla-war.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-war-comes-home",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 10,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 10,
    "title": "The war comes home",
    "subtitle": "Student protests, TV coverage, draft, My Lai, Kent State, silent majority & hard hats",
    "era": "c.1968–c.1973",
    "icon": "📺",
    "headerImage": "/images/history/usa/headers/usa-war-comes-home.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "usa-long-way-out",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-usa-conflict",
    "modulePosition": 11,
    "sequenceId": "history-usa-conflict",
    "sequencePosition": 11,
    "title": "The long way out",
    "subtitle": "Paris Peace Agreement, withdrawal, why the USA failed, Ho Chi Minh Trail, costs of the war",
    "era": "c.1973–c.1975",
    "icon": "🕊️",
    "headerImage": "/images/history/usa/headers/usa-long-way-out.png",
    "status": "planned",
    "screenCount": 0,
    "screenTags": [],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "history-medicine-western-front",
    "subjectId": "history",
    "subject": "History",
    "moduleId": "history-edexcel-western-front",
    "modulePosition": 0,
    "sequenceId": "history-medicine",
    "sequencePosition": 14,
    "title": "Hell in the trenches",
    "subtitle": "Medicine on the Western Front",
    "era": "c.1914–c.1918",
    "icon": "⚔️",
    "headerImage": "/images/history/medicine/headers/western-front.png",
    "status": "available",
    "screenCount": 19,
    "screenTags": [
      "prior-knowledge-western-front",
      "western-front-context",
      "trench-conditions",
      "trench-conditions-recall",
      "chain-of-evacuation",
      "chain-of-evacuation-recall",
      "medical-developments",
      "thomas-splint",
      "blood-transfusions",
      "medical-developments-recall",
      "source-utility",
      "source-follow-up",
      "western-front-core-recall",
      "describe-two-features",
      "describe-two-features",
      "source-utility-exam",
      "source-utility-exam",
      "source-follow-up",
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [
      "history:medicine:trench-system",
      "history:medicine:ramc",
      "history:medicine:chain-of-evacuation",
      "history:medicine:casualty-clearing-stations",
      "history:medicine:thomas-splint",
      "history:medicine:brodie-helmet",
      "history:medicine:gas-attacks",
      "history:medicine:wound-infection",
      "history:medicine:x-rays",
      "history:medicine:blood-transfusion",
      "history:medicine:blood-banks"
    ],
    "requirementIds": []
  },
  {
    "id": "math1",
    "subjectId": "mathematics",
    "subject": "Maths",
    "moduleId": "maths-aqa-number",
    "modulePosition": 0,
    "sequenceId": "maths-number",
    "sequencePosition": 0,
    "title": "Place value and number sense",
    "subtitle": "Ordering numbers, decimals and the number line",
    "era": "Number survival kit",
    "icon": "🔢",
    "headerImage": "/images/maths/_shared/numbers.webp",
    "status": "available",
    "screenCount": 13,
    "screenTags": [
      "maths:place-value",
      null,
      "maths:place-value",
      "maths:place-value",
      null,
      "maths:ordering-numbers",
      "maths:ordering-numbers",
      null,
      "maths:place-value",
      null,
      null,
      "maths:ordering-numbers",
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "math2",
    "subjectId": "mathematics",
    "subject": "Maths",
    "moduleId": "maths-aqa-number",
    "modulePosition": 1,
    "sequenceId": "maths-number",
    "sequencePosition": 1,
    "title": "The four operations",
    "subtitle": "Add, subtract, multiply and divide with confidence",
    "era": "Number survival kit",
    "icon": "➗",
    "headerImage": "/images/maths/_shared/numbers.webp",
    "status": "available",
    "screenCount": 14,
    "screenTags": [
      "maths:four-operations",
      null,
      "maths:written-methods",
      "maths:written-methods",
      "maths:four-operations",
      "maths:four-operations",
      null,
      "maths:four-operations",
      null,
      "maths:four-operations",
      null,
      null,
      "maths:four-operations",
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "math3",
    "subjectId": "mathematics",
    "subject": "Maths",
    "moduleId": "maths-aqa-number",
    "modulePosition": 2,
    "sequenceId": "maths-number",
    "sequencePosition": 2,
    "title": "Negative numbers without panic",
    "subtitle": "Sign rules, subtracting negatives and ordering on a number line",
    "era": "Number survival kit",
    "icon": "➖",
    "headerImage": "/images/maths/_shared/numbers.webp",
    "status": "available",
    "screenCount": 14,
    "screenTags": [
      "maths:negative-numbers",
      null,
      "maths:ordering-negatives",
      "maths:negative-numbers",
      "maths:negative-numbers",
      "maths:negative-numbers",
      "maths:negative-numbers",
      null,
      "maths:negative-numbers",
      null,
      "maths:negative-numbers",
      null,
      "maths:ordering-negatives",
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "math4",
    "subjectId": "mathematics",
    "subject": "Maths",
    "moduleId": "maths-aqa-number",
    "modulePosition": 3,
    "sequenceId": "maths-number",
    "sequencePosition": 3,
    "title": "BIDMAS and calculator control",
    "subtitle": "Order of operations, bracket entry and estimation",
    "era": "Number survival kit",
    "icon": "🧮",
    "headerImage": "/images/maths/_shared/numbers.webp",
    "status": "available",
    "screenCount": 13,
    "screenTags": [
      "maths:bidmas",
      null,
      "maths:bidmas",
      "maths:bidmas",
      "maths:bidmas",
      "maths:calculator-control",
      "maths:bidmas",
      null,
      "maths:bidmas",
      null,
      null,
      "maths:calculator-control",
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "math5",
    "subjectId": "mathematics",
    "subject": "Maths",
    "moduleId": "maths-aqa-number",
    "modulePosition": 4,
    "sequenceId": "maths-number",
    "sequencePosition": 4,
    "title": "Rounding, estimating and checking",
    "subtitle": "Decimal places, significant figures, error intervals and estimation",
    "era": "Number survival kit",
    "icon": "≈",
    "headerImage": "/images/maths/_shared/numbers.webp",
    "status": "available",
    "screenCount": 15,
    "screenTags": [
      "maths:significant-figures",
      null,
      "maths:rounding",
      "maths:significant-figures",
      "maths:estimation",
      "maths:estimation",
      "maths:rounding",
      "maths:rounding",
      "maths:estimation",
      null,
      "maths:rounding",
      null,
      null,
      "maths:significant-figures",
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "math6",
    "subjectId": "mathematics",
    "subject": "Maths",
    "moduleId": "maths-aqa-number",
    "modulePosition": 5,
    "sequenceId": "maths-number",
    "sequencePosition": 5,
    "title": "Factors, multiples and primes",
    "subtitle": "Prime factorisation, HCF, LCM and factor trees",
    "era": "Number survival kit",
    "icon": "🔎",
    "headerImage": "/images/maths/_shared/numbers.webp",
    "status": "available",
    "screenCount": 14,
    "screenTags": [
      "maths:prime-numbers",
      null,
      "maths:prime-numbers",
      "maths:prime-numbers",
      "maths:prime-factorisation",
      "maths:hcf-lcm",
      "maths:hcf-lcm",
      "maths:prime-factorisation",
      null,
      "maths:hcf-lcm",
      null,
      null,
      "maths:hcf-lcm",
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "math7",
    "subjectId": "mathematics",
    "subject": "Maths",
    "moduleId": "maths-aqa-number",
    "modulePosition": 6,
    "sequenceId": "maths-number",
    "sequencePosition": 6,
    "title": "Powers, roots and standard form",
    "subtitle": "Indices, roots, powers of 10 and scientific notation",
    "era": "Number survival kit",
    "icon": "10ˣ",
    "headerImage": "/images/maths/_shared/numbers.webp",
    "status": "available",
    "screenCount": 14,
    "screenTags": [
      "maths:standard-form",
      null,
      "maths:powers-roots",
      "maths:indices",
      "maths:standard-form",
      "maths:standard-form",
      "maths:standard-form",
      "maths:standard-form",
      null,
      "maths:standard-form",
      null,
      null,
      "maths:indices",
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "math8",
    "subjectId": "mathematics",
    "subject": "Maths",
    "moduleId": "maths-aqa-number",
    "modulePosition": 7,
    "sequenceId": "maths-number",
    "sequencePosition": 7,
    "title": "Fractions that actually make sense",
    "subtitle": "Equivalent fractions, simplifying, ordering and fractions of amounts",
    "era": "Number survival kit",
    "icon": "½",
    "headerImage": "/images/maths/_shared/numbers.webp",
    "status": "available",
    "screenCount": 14,
    "screenTags": [
      "maths:equivalent-fractions",
      null,
      "maths:equivalent-fractions",
      "maths:simplifying-fractions",
      "maths:mixed-numbers",
      "maths:fractions-of-amounts",
      "maths:simplifying-fractions",
      "maths:fractions-of-amounts",
      null,
      "maths:simplifying-fractions",
      null,
      null,
      "maths:fractions-of-amounts",
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "soc4",
    "subjectId": "sociology",
    "subject": "Sociology",
    "moduleId": "sociology-aqa-families",
    "modulePosition": 0,
    "sequenceId": "sociology-family",
    "sequencePosition": 3,
    "title": "Family & Households",
    "subtitle": "Why families are more sociological than you realised.",
    "era": "AQA GCSE",
    "icon": "🏠",
    "headerImage": "/images/sociology/_shared/family.webp",
    "status": "available",
    "screenCount": 12,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "soc6",
    "subjectId": "sociology",
    "subject": "Sociology",
    "moduleId": "sociology-aqa-families",
    "modulePosition": 1,
    "sequenceId": "sociology-family",
    "sequencePosition": 4,
    "title": "Family Researchers & Theory Battles",
    "subtitle": "Who actually understands family life?",
    "era": "Core Theory",
    "icon": "⚔️",
    "headerImage": "/images/sociology/_shared/family.webp",
    "status": "available",
    "screenCount": 12,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "soc1",
    "subjectId": "sociology",
    "subject": "Sociology",
    "moduleId": "sociology-aqa-key-concepts",
    "modulePosition": 0,
    "sequenceId": "sociology-family",
    "sequencePosition": 0,
    "title": "What Even is Sociology?",
    "subtitle": "Culture, norms, values and socialisation",
    "era": "AQA GCSE",
    "icon": "👥",
    "headerImage": "/images/sociology/_shared/main.webp",
    "status": "available",
    "screenCount": 12,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "soc2",
    "subjectId": "sociology",
    "subject": "Sociology",
    "moduleId": "sociology-aqa-key-concepts",
    "modulePosition": 1,
    "sequenceId": "sociology-family",
    "sequencePosition": 1,
    "title": "Marxism vs Functionalism",
    "subtitle": "Why does society work — conflict or cooperation?",
    "era": "AQA GCSE",
    "icon": "⚔️",
    "headerImage": "/images/sociology/_shared/main.webp",
    "status": "available",
    "screenCount": 17,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  },
  {
    "id": "soc3",
    "subjectId": "sociology",
    "subject": "Sociology",
    "moduleId": "sociology-aqa-key-concepts",
    "modulePosition": 2,
    "sequenceId": "sociology-family",
    "sequencePosition": 2,
    "title": "Feminism, Power & Life Chances",
    "subtitle": "Who has power — and who gets left behind?",
    "era": "AQA GCSE",
    "icon": "⚖️",
    "headerImage": "/images/sociology/_shared/stratification.webp",
    "status": "available",
    "screenCount": 12,
    "screenTags": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    "estimatedMinutes": null,
    "conceptIds": [],
    "requirementIds": []
  }
]

export const CHAPTER_CONTENT_LOADERS = {
  "bio_building_blocks": () => import("../../../content/biology/cell-biology/episodes/bio_building_blocks.js").then(module => module.default),
  "sci_bio_w1": () => import("../../../content/biology/cell-biology/episodes/sci_bio_w1.js").then(module => module.default),
  "bio_building_life": () => import("../../../content/biology/organisation/episodes/bio_building_life.js").then(module => module.default),
  "bio_ecosystems_group": () => import("../../../content/biology/ecology/episodes/bio_ecosystems_group.js").then(module => module.default),
  "bio_control_systems": () => import("../../../content/biology/homeostasis/episodes/bio_control_systems.js").then(module => module.default),
  "bio_disease_wars": () => import("../../../content/biology/infection-and-response/episodes/bio_disease_wars.js").then(module => module.default),
  "bio_genetics_evolution": () => import("../../../content/biology/inheritance-variation-evolution/episodes/bio_genetics_evolution.js").then(module => module.default),
  "bio_human_machine": () => import("../../../content/biology/organisation/episodes/bio_human_machine.js").then(module => module.default),
  "english-macbeth-power-ambition": () => import("../../../content/english/macbeth/episodes/english-macbeth-power-ambition.js").then(module => module.default),
  "history-medicine-medieval-beliefs-causes": () => import("../../../content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js").then(module => module.default),
  "history-medicine-black-death": () => import("../../../content/history/medicine/episodes/episode-02-black-death.js").then(module => module.default),
  "history-medicine-vesalius-beginning-doubt": () => import("../../../content/history/medicine/episodes/episode-03-vesalius-beginning-doubt.js").then(module => module.default),
  "history-medicine-harvey-pare-renaissance-method": () => import("../../../content/history/medicine/episodes/episode-04-harvey-pare-renaissance-method.js").then(module => module.default),
  "history-medicine-great-plague-1665": () => import("../../../content/history/medicine/episodes/episode-05-great-plague-1665.js").then(module => module.default),
  "history-medicine-surgery-anaesthetics": () => import("../../../content/history/medicine/episodes/episode-04-surgery-anaesthetics.js").then(module => module.default),
  "history-medicine-jenner-vaccination": () => import("../../../content/history/medicine/episodes/episode-06-jenner-vaccination.js").then(module => module.default),
  "history-medicine-germ-theory": () => import("../../../content/history/medicine/episodes/episode-07-germ-theory.js").then(module => module.default),
  "history-medicine-great-stink": () => import("../../../content/history/medicine/episodes/episode-08-great-stink.js").then(module => module.default),
  "history-medicine-surgery-revolution": () => import("../../../content/history/medicine/episodes/episode-09-surgery-revolution.js").then(module => module.default),
  "history-medicine-nightingale": () => import("../../../content/history/medicine/episodes/episode-10-nightingale.js").then(module => module.default),
  "history-medicine-accidental-miracle": () => import("../../../content/history/medicine/episodes/episode-11-accidental-miracle.js").then(module => module.default),
  "history-medicine-modern-medicine": () => import("../../../content/history/medicine/episodes/episode-12-when-medicine-became-magic.js").then(module => module.default),
  "history-medicine-cancer": () => import("../../../content/history/medicine/episodes/episode-13-can-we-beat-cancer.js").then(module => module.default),
  "spain-new-world-1": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-1.js").then(module => module.default),
  "spain-new-world-2": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-2.js").then(module => module.default),
  "spain-new-world-3": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-3.js").then(module => module.default),
  "spain-new-world-4": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-4.js").then(module => module.default),
  "spain-new-world-5": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-5.js").then(module => module.default),
  "spain-new-world-6": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-6.js").then(module => module.default),
  "spain-new-world-7": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-7.js").then(module => module.default),
  "spain-new-world-8": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-8.js").then(module => module.default),
  "spain-new-world-9": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-9.js").then(module => module.default),
  "spain-new-world-10": () => import("../../../content/history/spain-new-world/episodes/spain-new-world-10.js").then(module => module.default),
  "usa-segregation": () => import("../../../content/history/usa/episodes/usa-segregation.js").then(module => module.default),
  "usa-brown-v-board": () => import("../../../content/history/usa/episodes/usa-brown-v-board.js").then(module => module.default),
  "usa-rosa-parks": () => import("../../../content/history/usa/episodes/usa-rosa-parks.js").then(module => module.default),
  "usa-sit-ins": () => import("../../../content/history/usa/episodes/usa-sit-ins.js").then(module => module.default),
  "usa-i-have-a-dream": () => import("../../../content/history/usa/episodes/usa-i-have-a-dream.js").then(module => module.default),
  "usa-malcolm-x": () => import("../../../content/history/usa/episodes/usa-malcolm-x.js").then(module => module.default),
  "usa-how-much-changed": () => import("../../../content/history/usa/episodes/usa-how-much-changed.js").then(module => module.default),
  "usa-why-vietnam": () => import("../../../content/history/usa/episodes/usa-why-vietnam.js").then(module => module.default),
  "usa-americas-war": () => import("../../../content/history/usa/episodes/usa-americas-war.js").then(module => module.default),
  "usa-guerrilla-war": () => import("../../../content/history/usa/episodes/usa-guerrilla-war.js").then(module => module.default),
  "usa-war-comes-home": () => import("../../../content/history/usa/episodes/usa-war-comes-home.js").then(module => module.default),
  "usa-long-way-out": () => import("../../../content/history/usa/episodes/usa-long-way-out.js").then(module => module.default),
  "history-medicine-western-front": () => import("../../../content/history/medicine/episodes/episode-14-western-front.js").then(module => module.default),
  "math1": () => import("../../../content/maths/foundations/episodes/math1.js").then(module => module.default),
  "math2": () => import("../../../content/maths/foundations/episodes/math2.js").then(module => module.default),
  "math3": () => import("../../../content/maths/foundations/episodes/math3.js").then(module => module.default),
  "math4": () => import("../../../content/maths/foundations/episodes/math4.js").then(module => module.default),
  "math5": () => import("../../../content/maths/foundations/episodes/math5.js").then(module => module.default),
  "math6": () => import("../../../content/maths/foundations/episodes/math6.js").then(module => module.default),
  "math7": () => import("../../../content/maths/foundations/episodes/math7.js").then(module => module.default),
  "math8": () => import("../../../content/maths/foundations/episodes/math8.js").then(module => module.default),
  "soc4": () => import("../../../content/sociology/families/episodes/soc4.js").then(module => module.default),
  "soc6": () => import("../../../content/sociology/families/episodes/soc6.js").then(module => module.default),
  "soc1": () => import("../../../content/sociology/families/episodes/soc1.js").then(module => module.default),
  "soc2": () => import("../../../content/sociology/families/episodes/soc2.js").then(module => module.default),
  "soc3": () => import("../../../content/sociology/families/episodes/soc3.js").then(module => module.default),
}

export function getCurriculumModuleById(moduleId) {
  return CURRICULUM_MODULES.find(module => module.id === moduleId) ?? null
}

export function getCurriculumChapterById(chapterId) {
  return CURRICULUM_CHAPTERS.find(chapter => chapter.id === chapterId) ?? null
}

export function getLearningSequenceById(sequenceId) {
  return LEARNING_SEQUENCES.find(sequence => sequence.id === sequenceId) ?? null
}

export function getLearningSequenceForChapter(chapterId) {
  return LEARNING_SEQUENCES.find(sequence => sequence.chapterIds.includes(chapterId)) ?? null
}

export function getPrimaryLearningSequenceForSubject(subject) {
  return LEARNING_SEQUENCES.find(sequence => sequence.subject === subject || sequence.subjectId === subject) ?? null
}

export function isChapterAvailable(chapter) {
  return chapter?.status === 'available' && Number(chapter.screenCount) > 0
}

export function getOrderedAvailableChapters() {
  return LEARNING_SEQUENCES
    .flatMap(sequence => sequence.chapterIds)
    .map(getCurriculumChapterById)
    .filter(isChapterAvailable)
}
