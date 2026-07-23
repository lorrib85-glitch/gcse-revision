export default {
  "id": "bio_building_blocks",
  "subject": "Biology",
  "number": 1,
  "title": "Building blocks",
  "subtitle": "What every living thing is built from",
  "icon": "🧬",
  "color": "#4FA36C",
  "colorLight": "rgba(79,163,108,.15)",
  "hook": null,
  "intro": null,
  "recall": null,
  "outcomes": {
    "intro": "All living things are made of cells. This chapter reveals the hidden world inside them.",
    "bullets": [
      {
        "text": "Describe the structures inside animal and plant cells",
        "icon": "drop"
      },
      {
        "text": "Explain what each organelle actually does in precise GCSE language",
        "icon": "star"
      },
      {
        "text": "Spot the most common exam trap about plant cells before it costs you marks",
        "icon": "question"
      },
      {
        "text": "Compare animal, plant and bacterial cells with the precision a top answer needs",
        "icon": "prayer"
      }
    ]
  },
  "screens": [
    {
      "type": "cinematic",
      "stage": "The mystery",
      "label": "BIOLOGY · CHAPTER 1",
      "videoSrc": "/videos/building-blocks-intro.mp4",
      "fallbackImage": "/figures/biology/building-blocks/plant-cell-bg.png",
      "paragraphs": [
        {
          "text": "A leaf."
        },
        {
          "text": "Blood."
        },
        {
          "text": "Human skin."
        },
        {
          "text": "Tree bark."
        },
        {
          "text": "Completely different."
        },
        {
          "text": "Yet every one of them is built from the same thing.",
          "highlights": [
            "the same thing"
          ]
        },
        {
          "text": "What is it?"
        }
      ]
    },
    {
      "type": "guidedChoiceCarousel",
      "stage": "Your prediction",
      "label": "Before we look closer",
      "headline": "A leaf. Blood. Skin. Bark.\nAll built from the same thing.",
      "question": "What do all living things have in common?",
      "helperText": "Swipe through the options and choose what you think it is.",
      "options": [
        {
          "title": "Blood",
          "subtitle": "Carries everything a body needs",
          "buttonText": "Choose Blood",
          "revealLines": [
            "Blood looks like one thing — but it isn't.",
            "Zoom in far enough, and it turns out to be made of something much smaller.",
            "Let's investigate."
          ]
        },
        {
          "title": "Cells",
          "subtitle": "The basic unit of every living thing",
          "buttonText": "Choose Cells",
          "revealLines": [
            "You're onto it.",
            "A leaf, a drop of blood, a patch of skin, a strip of bark — all built from the same tiny units.",
            "Let's investigate."
          ]
        },
        {
          "title": "Organs",
          "subtitle": "Hearts, lungs, leaves, roots",
          "buttonText": "Choose Organs",
          "revealLines": [
            "Organs are themselves built from something smaller.",
            "Before there can be an organ, there has to be a basic building block.",
            "Let's investigate."
          ]
        },
        {
          "title": "Chlorophyll",
          "subtitle": "The green pigment in plants",
          "buttonText": "Choose Chlorophyll",
          "revealLines": [
            "Chlorophyll only exists inside plants — but blood and skin are alive too.",
            "Whatever the answer is, it has to work for every living thing, not just plants.",
            "Let's investigate."
          ]
        }
      ]
    },
    {
      "label": "Mission",
      "kicker": "Chapter 1",
      "heading": "Building life",
      "sub": "The hidden structures inside every living thing.",
      "blocks": [
        {
          "type": "read",
          "text": "• Describe what every plant, animal and bacterial cell has in common — and name the structures that set them apart.<br><br>• Explain what each part of a cell actually does, in the precise language an examiner is looking for.<br><br>• Spot one of the most common GCSE traps about plant cells, before it costs you a mark.<br><br>• Compare animal, plant and bacterial cells with the precision a top answer needs.<br><br>Plant and animal cells are eukaryotic — their genetic material is enclosed in a nucleus. Bacterial cells are prokaryotic — they have no nucleus, just a single DNA loop in the cytoplasm, and may contain plasmids."
        }
      ]
    },
    {
      "type": "interactiveImage",
      "label": "Plant cell explorer",
      "title": "Inside a\nPlant Cell",
      "introText": "Plant cells contain specialised structures called organelles. Each one has a specific job that keeps the cell alive.",
      "image": "/figures/plant-cell.webp",
      "imageAlt": "Illustration of a plant cell showing major organelles",
      "ctaLabel": "Explore cell",
      "hotspots": [
        {
          "id": "cell_wall",
          "x": 50,
          "y": 6,
          "shortLabel": "Cell Wall",
          "title": "Cell Wall",
          "icon": "🧱",
          "description": "Made of cellulose, the cell wall gives the plant cell a rigid, fixed shape. Animal cells do not have one. It provides structural support and prevents the cell from bursting.",
          "extraFact": "Without a cell wall, plant stems would collapse. This is why plants wilt when they lose water — the vacuole shrinks and the wall loses its rigid support."
        },
        {
          "id": "cell_membrane",
          "x": 50,
          "y": 14,
          "shortLabel": "Cell Membrane",
          "title": "Cell Membrane",
          "icon": "🚪",
          "description": "A thin, flexible layer that controls what enters and leaves the cell. Found in all cells — plant and animal. It is selectively permeable, meaning it lets some substances through but not others.",
          "extraFact": "Glucose produced in the chloroplasts must pass through the cell membrane to reach other cells in the plant."
        },
        {
          "id": "cytoplasm",
          "x": 44,
          "y": 44,
          "shortLabel": "Cytoplasm",
          "title": "Cytoplasm",
          "icon": "🌊",
          "description": "A jelly-like fluid that fills the cell and holds organelles in place. Most of the cell's chemical reactions take place here.",
          "extraFact": "Anaerobic respiration — the backup energy process that does not need oxygen — takes place entirely in the cytoplasm."
        },
        {
          "id": "nucleus",
          "x": 68,
          "y": 28,
          "shortLabel": "Nucleus",
          "title": "Nucleus",
          "icon": "🧬",
          "description": "The control centre of the cell. Contains DNA — the instructions for everything the cell does, including making proteins and dividing. Plant cells are eukaryotic because their genetic material is enclosed in a nucleus.",
          "extraFact": "The nucleus directs the production of enzymes needed for photosynthesis. Without it, the chloroplasts could not function properly."
        },
        {
          "id": "chloroplast",
          "x": 20,
          "y": 68,
          "shortLabel": "Chloroplast",
          "title": "Chloroplast",
          "icon": "☀️",
          "description": "Many plant cells exposed to light contain chloroplasts, which contain chlorophyll — a green pigment that absorbs light energy to carry out photosynthesis and produce glucose. Not all plant cells have them: root hair cells and other cells that never see light do not.",
          "extraFact": "Photosynthesis allows plants to make their own food using sunlight, water and CO₂ — releasing oxygen as a by-product."
        },
        {
          "id": "vacuole",
          "x": 30,
          "y": 52,
          "shortLabel": "Permanent Vacuole",
          "title": "Large Permanent Vacuole",
          "icon": "💧",
          "description": "A large, water-filled sac that keeps the cell firm (turgid). If the vacuole shrinks due to lack of water, the cell becomes flaccid and the plant wilts.",
          "extraFact": "The pressure of the full vacuole pushing against the cell wall creates turgor pressure, which gives plants their upright structure."
        },
        {
          "id": "mitochondria",
          "x": 22,
          "y": 20,
          "shortLabel": "Mitochondria",
          "title": "Mitochondria",
          "icon": "⚡",
          "description": "The site of aerobic respiration, where energy is transferred for the cell to use.",
          "extraFact": "Even though plant cells make glucose in chloroplasts, they still need mitochondria to convert that glucose into usable energy (ATP)."
        },
        {
          "id": "ribosomes",
          "x": 55,
          "y": 46,
          "shortLabel": "Ribosomes",
          "title": "Ribosomes",
          "icon": "🔬",
          "description": "The site of protein synthesis. Ribosomes build proteins needed for growth, repair and chemical reactions. Only visible under an electron microscope.",
          "extraFact": "All enzymes are proteins built by ribosomes. Every chemical reaction in the cell ultimately depends on them."
        }
      ]
    },
    {
      "type": "interactiveImage",
      "label": "Animal cell explorer",
      "title": "Inside an\nAnimal Cell",
      "introText": "Animal cells share most of their structures with plant cells. Explore this one closely — and notice what's familiar, and what's missing.",
      "image": "/figures/biology/building-blocks/animal-cell-clean.png",
      "imageAlt": "Illustration of an animal cell showing its main organelles",
      "ctaLabel": "Explore cell",
      "hotspots": [
        {
          "id": "nucleus",
          "x": 44,
          "y": 33,
          "shortLabel": "Nucleus",
          "title": "Nucleus",
          "icon": "🧬",
          "description": "The control centre of the cell. Contains DNA — the instructions for everything the cell does, including making proteins and dividing. Animal cells are eukaryotic because their genetic material is enclosed in a nucleus.",
          "extraFact": "The nucleus is one of five structures every animal and plant cell shares — a fact GCSE examiners expect you to know cold."
        },
        {
          "id": "cytoplasm",
          "x": 68,
          "y": 29,
          "shortLabel": "Cytoplasm",
          "title": "Cytoplasm",
          "icon": "🌊",
          "description": "A jelly-like fluid that fills the cell and holds organelles in place. Most of the cell's chemical reactions happen here — in animal cells just as much as in plant cells.",
          "extraFact": "During hard exercise, your muscle cells run short of oxygen and start anaerobic respiration — right here, in the cytoplasm."
        },
        {
          "id": "cell_membrane",
          "x": 27,
          "y": 72,
          "shortLabel": "Cell Membrane",
          "title": "Cell Membrane",
          "icon": "🚪",
          "description": "A thin, flexible layer that controls what enters and leaves the cell. Selectively permeable — it lets some substances through and keeps others out. Identical job to the membrane in a plant cell.",
          "extraFact": "Notice there's no thick wall surrounding this membrane. That missing structure is one of the clearest differences between an animal cell and a plant cell."
        },
        {
          "id": "mitochondria",
          "x": 74,
          "y": 66,
          "shortLabel": "Mitochondria",
          "title": "Mitochondria",
          "icon": "⚡",
          "description": "The site of aerobic respiration, where energy is transferred for the cell to use.",
          "extraFact": "Cells that work hardest — muscle cells, liver cells, sperm cells — pack in unusually large numbers of mitochondria, because they need the most energy."
        },
        {
          "id": "ribosomes",
          "x": 52,
          "y": 64,
          "shortLabel": "Ribosomes",
          "title": "Ribosomes",
          "icon": "🔬",
          "description": "The site of protein synthesis. Ribosomes build proteins needed for growth, repair and chemical reactions. Far too small to see without an electron microscope.",
          "extraFact": "Every enzyme in your body is a protein built by a ribosome. Without them, not one chemical reaction inside a cell could happen."
        }
      ]
    },
    {
      "label": "Comparing the two",
      "kicker": "Discover",
      "heading": "Animal cell vs plant cell",
      "sub": "Same blueprint underneath. Different extras on top.",
      "blocks": [
        {
          "type": "theoryCompare",
          "title": "What's shared — and what isn't",
          "emphasisSide": "none",
          "leftPerson": { "name": "Animal cell" },
          "rightPerson": { "name": "Plant cell" },
          "comparisons": [
            {
              "id": "cell-shared",
              "prompt": "What do animal and plant cells share?",
              "rows": [
                { "label": "Nucleus", "left": "Controls the activities of the cell", "right": "Same" },
                { "label": "Cytoplasm", "left": "Site of most chemical reactions", "right": "Same" },
                { "label": "Cell membrane", "left": "Controls movement of substances in and out", "right": "Same" },
                { "label": "Mitochondria", "left": "Site of aerobic respiration", "right": "Same" },
                { "label": "Ribosomes", "left": "Site of protein synthesis", "right": "Same" }
              ],
              "note": "Every structure an animal cell has, a plant cell has too."
            },
            {
              "id": "cell-extras",
              "prompt": "What do plant cells add?",
              "rows": [
                { "label": "Cell wall", "left": "None", "right": "Made of cellulose — gives a rigid, fixed shape" },
                { "label": "Chloroplasts", "left": "None", "right": "Absorb light energy to carry out photosynthesis" },
                { "label": "Permanent vacuole", "left": "None", "right": "Stores cell sap and keeps the cell firm" }
              ]
            }
          ],
          "takeaway": "Typical plant cells share the main structures found in animal cells, but many plant cells also have extra structures such as a cell wall, permanent vacuole and chloroplasts. The exact structures depend on the cell's job."
        }
      ]
    },
    {
      "label": "Discover",
      "kicker": "Eukaryotes and prokaryotes",
      "heading": "Not every cell has a nucleus",
      "sub": "Animal and plant cells are not the only kind of cell. Bacterial cells are built differently.",
      "blocks": [
        {
          "type": "theoryCompare",
          "title": "Two fundamentally different cell types",
          "emphasisSide": "none",
          "leftPerson": { "name": "Eukaryotic", "subtitle": "Plant and animal cells" },
          "rightPerson": { "name": "Prokaryotic", "subtitle": "Bacterial cells" },
          "comparisons": [
            {
              "id": "euk-prok",
              "prompt": "How are they built?",
              "rows": [
                { "label": "Genetic material", "left": "Enclosed in a nucleus", "right": "A single DNA loop free in the cytoplasm — no nucleus" },
                { "label": "Plasmids", "left": "None", "right": "May contain plasmids — small rings of DNA" },
                { "label": "Cytoplasm & membrane", "left": "Both present", "right": "Both present" },
                { "label": "Cell wall", "left": "Plant cells only", "right": "Always present" },
                { "label": "Size", "left": "Larger", "right": "Much smaller" }
              ],
              "note": "Eukaryotic plant cells may also have a cell wall, chloroplasts and a permanent vacuole."
            }
          ],
          "takeaway": "EU-karyotes keep DNA in a nUcleus. PRO-karyotes are bacteria: no nucleus, just a DNA loop and sometimes plasmids."
        }
      ]
    },
    {
      "label": "Check precision",
      "kicker": "Common traps",
      "heading": "Four statements. Look closely.",
      "sub": "Each one sounds true. Decide before you read on.",
      "blocks": [
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "All plant cells contain chloroplasts.",
              "answer": false,
              "reveal": "Only cells exposed to light — like the cells in a leaf — contain chloroplasts. A root hair cell lives underground in total darkness. It has no use for chloroplasts, so it simply doesn't have any.",
              "examTrap": "Examiners love this one. If a question describes a root hair cell, a cell from a potato tuber, or anything underground, never write \"it has chloroplasts because it's a plant cell.\" A cell only contains the organelles its job requires."
            },
            {
              "statement": "Both animal cells and plant cells contain mitochondria.",
              "answer": true,
              "reveal": "True. Every cell that needs energy needs mitochondria — and that means almost every cell in both animals and plants. Mitochondria release energy from glucose through aerobic respiration, whichever kingdom the cell belongs to.",
              "examTrap": "Don't fall into thinking \"mitochondria are for animals, chloroplasts are for plants.\" A plant cell makes glucose in its chloroplasts — but it still needs mitochondria to release the energy stored inside that glucose."
            },
            {
              "statement": "All cells are roughly the same size.",
              "answer": false,
              "reveal": "Cells vary enormously. A human egg cell is around 0.1 mm — just visible to the naked eye — while a single nerve cell can stretch over a metre, from your spine to your toes. Size depends entirely on the job a cell does.",
              "examTrap": "If a question gives you a measurement in micrometres (µm), don't assume it must describe a \"typical\" cell. Specialised cells are often unusually large or small for a reason — and the examiner wants you to explain why."
            },
            {
              "statement": "Bacterial cells have DNA inside a nucleus.",
              "answer": false,
              "reveal": "Bacterial cells are prokaryotic. Their genetic material is not enclosed in a nucleus — it is usually a single DNA loop in the cytoplasm. They may also contain plasmids, which are small rings of DNA.",
              "examTrap": "Students often assume all cells have a nucleus because animal and plant cells do. GCSE Biology requires you to distinguish eukaryotic cells (nucleus present) from prokaryotic cells (bacteria — no nucleus)."
            }
          ]
        }
      ]
    },
    {
      "type": "matchingTask",
      "stage": "Apply it",
      "label": "Structure → function",
      "subject": "Biology",
      "title": "Match each structure to its job",
      "instruction": "Match each cell structure to the function an examiner would expect you to name.",
      "pairs": [
        {
          "id": "nucleus",
          "term": "Nucleus",
          "answer": "Controls the activities of the cell — contains genetic material",
          "weakGroup": "Cell structures"
        },
        {
          "id": "membrane",
          "term": "Cell membrane",
          "answer": "Controls the movement of substances into and out of the cell",
          "weakGroup": "Cell structures"
        },
        {
          "id": "cytoplasm",
          "term": "Cytoplasm",
          "answer": "Site of most of the cell's chemical reactions",
          "weakGroup": "Cell structures"
        },
        {
          "id": "mitochondria",
          "term": "Mitochondria",
          "answer": "Site of aerobic respiration — releases energy from glucose",
          "weakGroup": "Cell structures"
        },
        {
          "id": "ribosome",
          "term": "Ribosome",
          "answer": "Site of protein synthesis",
          "weakGroup": "Cell structures"
        },
        {
          "id": "cell_wall",
          "term": "Cell wall",
          "answer": "Made of cellulose — supports the cell and keeps its shape rigid",
          "weakGroup": "Cell structures"
        },
        {
          "id": "chloroplast",
          "term": "Chloroplast",
          "answer": "Absorbs light energy to carry out photosynthesis",
          "weakGroup": "Cell structures"
        },
        {
          "id": "vacuole",
          "term": "Permanent vacuole",
          "answer": "Contains cell sap — keeps the cell firm and full of water",
          "weakGroup": "Cell structures"
        },
        {
          "id": "dna_loop",
          "term": "Single DNA loop",
          "answer": "Bacterial genetic material found in the cytoplasm, not enclosed in a nucleus",
          "weakGroup": "Cell structures"
        },
        {
          "id": "plasmids",
          "term": "Plasmids",
          "answer": "Small rings of DNA found in some bacterial cells",
          "weakGroup": "Cell structures"
        }
      ]
    },
    {
      "label": "Apply it",
      "kicker": "Precise vocabulary",
      "heading": "Fill in the gaps",
      "sub": "Use the exact GCSE term — examiners mark on precision, not approximation.",
      "blocks": [
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "The",
              "after": "controls what enters and leaves the cell.",
              "answer": "cell membrane",
              "acceptedAnswers": [
                "cell membrane",
                "membrane"
              ],
              "feedback": "Correct — the cell membrane is selectively permeable, controlling exactly what passes through.",
              "hints": [
                "It surrounds every cell, plant or animal...",
                "Two words — the second one is \"membrane\"..."
              ]
            },
            {
              "before": "The",
              "after": "is the site of aerobic respiration, releasing energy from glucose.",
              "answer": "mitochondria",
              "acceptedAnswers": [
                "mitochondria",
                "mitochondrion"
              ],
              "feedback": "Correct — and notice the word \"release\". Mitochondria release energy that's already stored in glucose; they don't make it from nothing.",
              "hints": [
                "Found in both plant and animal cells...",
                "Sometimes nicknamed the cell's \"powerhouse\"..."
              ]
            },
            {
              "before": "A plant cell's",
              "after": "is made of cellulose and gives the cell a rigid, fixed shape.",
              "answer": "cell wall",
              "acceptedAnswers": [
                "cell wall"
              ],
              "feedback": "Correct — and remember, animal cells do not have one.",
              "hints": [
                "Animal cells don't have this structure...",
                "Two words — the second is \"wall\"..."
              ]
            },
            {
              "before": "Chloroplasts contain",
              "after": ", a green pigment that absorbs light energy for photosynthesis.",
              "answer": "chlorophyll",
              "acceptedAnswers": [
                "chlorophyll"
              ],
              "feedback": "Correct — chlorophyll is the pigment; the chloroplast is the structure that contains it. Examiners notice when students mix the two up.",
              "hints": [
                "Gives leaves their green colour...",
                "Starts with \"chloro-\", just like \"chloroplast\"..."
              ]
            },
            {
              "before": "A plant cell's permanent vacuole is filled with",
              "after": ", which keeps the cell firm and stops the plant from wilting.",
              "answer": "cell sap",
              "acceptedAnswers": [
                "cell sap",
                "sap"
              ],
              "feedback": "Correct — a full vacuole pushes outward against the cell wall, creating turgor pressure that keeps the whole plant upright.",
              "hints": [
                "A watery solution stored inside the vacuole...",
                "Two words — the first is \"cell\"..."
              ]
            },
            {
              "before": "Bacterial cells are",
              "after": "cells because their genetic material is not enclosed in a nucleus.",
              "answer": "prokaryotic",
              "acceptedAnswers": [
                "prokaryotic",
                "prokaryotes"
              ],
              "feedback": "Correct — bacterial cells are prokaryotic. Unlike eukaryotic cells, they have no nucleus. Their genetic material is a single DNA loop free in the cytoplasm.",
              "hints": [
                "Think about the cell type that has no nucleus...",
                "The opposite of eukaryotic..."
              ]
            }
          ]
        }
      ]
    },
    {
      "label": "Apply it",
      "kicker": "Detective work",
      "heading": "Spot the error.",
      "sub": "Something in this exam answer is wrong.",
      "blocks": [
        {
          "type": "spotTheError",
          "prompt": "A student wrote this in an exam answer. Something in it is wrong.",
          "statement": "Bacterial cells have a nucleus that contains their DNA.",
          "errorTarget": "have a nucleus that contains their DNA",
          "whatWasWrong": "Bacterial cells are prokaryotic. Their genetic material is not enclosed in a nucleus — it is a single DNA loop free in the cytoplasm. They may also contain plasmids, which are small rings of DNA.",
          "examinerNote": "Students often assume all cells have a nucleus because they have only studied animal and plant cells. GCSE Biology requires you to distinguish eukaryotic cells (which have a nucleus) from prokaryotic cells (bacteria, which do not).",
          "correctVersion": "Bacterial cells do not have a nucleus. Their genetic material is a single DNA loop in the cytoplasm, and they may contain plasmids.",
          "commonTrap": "When comparing cell types, be precise: \"eukaryotic\" for plant and animal cells, \"prokaryotic\" for bacteria. The absence of a nucleus is the defining feature of a bacterial cell.",
          "keyTerms": [
            "prokaryotic",
            "nucleus",
            "DNA loop",
            "plasmids"
          ]
        }
      ]
    },
    {
      "type": "guidedExamResponse",
      "stage": "Exam practice",
      "label": "Write for the examiner",
      "exam": {
        "board": "aqa",
        "subject": "biology",
        "topic": "cell-structure",
        "question": "Explain two differences between plant cells and animal cells. (4 marks)",
        "marks": 4,
        "sections": [
          {
            "label": "Difference 1",
            "starter": "Plant cells have a...",
            "placeholder": "e.g. ...cell wall, which animal cells do not have. This is used to..."
          },
          {
            "label": "Difference 2",
            "starter": "Plant cells also have...",
            "placeholder": "e.g. ...chloroplasts, which animal cells do not have. These are used to..."
          }
        ],
        "markScheme": "Total: 4 marks — up to 2 marks for each difference (1 mark for naming the structure correctly, 1 mark for explaining what it does).\nDifference A — Cell wall: plant cells have a cell wall, made of cellulose, that animal cells lack; it supports the cell and keeps its shape rigid.\nDifference B — Chloroplasts: plant cells contain chloroplasts that animal cells lack; chloroplasts absorb light energy so the cell can carry out photosynthesis.\nA third valid difference — the permanent vacuole, which stores cell sap and keeps the cell turgid — can also be credited.\nNo mark is given for naming a structure without explaining its function: \"plant cells have a cell wall\" alone earns 1 mark; adding \"...which gives the cell a rigid, fixed shape\" earns the second."
      }
    },
    {
      "type": "faceExaminer",
      "stage": "Exam practice",
      "label": "Face the examiner",
      "examiner": {
        "type": "4-mark-explain",
        "board": "aqa",
        "subject": "biology",
        "topic": "cell-structure",
        "difficulty": "standard",
        "question": "Explain two differences between plant cells and animal cells. (4 marks)",
        "marks": 4,
        "mark": 2,
        "summary": "Both structures are correctly named — but neither difference is actually explained. That caps this answer at 2 marks out of 4.",
        "markScheme": "Level 2 (3-4 marks): Two structures named AND their functions explained.\nLevel 1 (1-2 marks): Structures named but not explained, or only one full difference given.\n0 marks: No relevant structures identified.",
        "sampleAnswer": "Plant cells have chloroplasts. Plant cells have cell walls.",
        "annotations": [
          {
            "id": "ann1",
            "target": "Plant cells have chloroplasts.",
            "occurrence": 1,
            "type": "weak",
            "comment": "A correct structure, named clearly — that's 1 mark. But the examiner needs to know what a chloroplast actually does. Naming it isn't the same as explaining it."
          },
          {
            "id": "ann2",
            "target": "Plant cells have cell walls.",
            "occurrence": 1,
            "type": "weak",
            "comment": "The same problem, twice. A second structure named, a second mark earned — but still no explanation. This sentence repeats the exact mistake of the first."
          }
        ],
        "improvementPrompts": {
          "ann1": {
            "prompt": "+ Add what a chloroplast actually does",
            "placeholder": "e.g. ...which absorb light energy so the cell can carry out photosynthesis."
          },
          "ann2": {
            "prompt": "+ Add what a cell wall actually does",
            "placeholder": "e.g. ...which is made of cellulose and gives the cell a rigid, fixed shape."
          }
        },
        "criteriaOptions": [
          "Names two structures",
          "Explains the chloroplast's function",
          "Explains the cell wall's function",
          "Uses precise GCSE vocabulary",
          "States the structure is absent in animal cells",
          "Repeats the same mistake twice",
          "Names without explaining",
          "Too vague to award the second mark"
        ]
      }
    },
    {
      "type": "quickRecall",
      "stage": "Lock it in",
      "label": "What stuck?",
      "questions": [
        {
          "type": "choice",
          "question": "Which structure controls what enters and leaves a cell?",
          "options": [
            "Nucleus",
            "Cell membrane",
            "Cytoplasm",
            "Ribosome"
          ],
          "correct": 1,
          "explanation": "The cell membrane is selectively permeable — it controls exactly which substances pass in and out."
        },
        {
          "type": "truefalse",
          "question": "A root hair cell contains chloroplasts.",
          "isTrue": false,
          "explanation": "Root hair cells live underground in darkness. Chloroplasts would be useless to them — only cells exposed to light contain chloroplasts."
        },
        {
          "type": "choice",
          "question": "What is the function of mitochondria?",
          "options": [
            "They make energy from sunlight",
            "They release energy from glucose through respiration",
            "They control the cell's activities",
            "They store water to keep the cell firm"
          ],
          "correct": 1,
          "explanation": "\"Release energy\", not \"make energy\" — mitochondria release energy that is already stored inside glucose."
        },
        {
          "type": "connection",
          "question": "A plant cell has three structures an animal cell doesn't. Which set is correct?",
          "options": [
            {
              "text": "Nucleus, cytoplasm and ribosomes",
              "icon": "leaf"
            },
            {
              "text": "Cell wall, chloroplasts and a permanent vacuole",
              "icon": "gear"
            },
            {
              "text": "Mitochondria, membrane and cell wall",
              "icon": "atom"
            }
          ],
          "correct": 1,
          "hint": "Think about the three \"extras\" bolted onto the shared five-structure blueprint..."
        },
        {
          "type": "choice",
          "question": "A muscle cell needs to release energy quickly and constantly. Which structure would you expect to find in unusually large numbers?",
          "options": [
            "Ribosomes",
            "Chloroplasts",
            "Mitochondria",
            "Vacuoles"
          ],
          "correct": 2,
          "explanation": "Cells with high energy demands — like muscle, liver and sperm cells — pack in extra mitochondria to keep up with the demand for respiration."
        },
        {
          "type": "choice",
          "question": "Which statement correctly describes bacterial cells?",
          "options": [
            "They are eukaryotic and have a nucleus",
            "They are prokaryotic and have no nucleus",
            "They are animal cells with a cell wall",
            "They always contain chloroplasts"
          ],
          "correct": 1,
          "explanation": "Bacterial cells are prokaryotic — their genetic material is a single DNA loop in the cytoplasm, not enclosed in a nucleus. They are not animal cells, and they never contain chloroplasts."
        }
      ]
    }
  ],
  "series": "cell-biology",
  "recallTags": [],
  "examTags": [],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "part-1", "title": "Mystery opening", "description": "Cinematic hook and prediction activity.", "screenIndex": 0 },
    { "id": "part-2", "title": "Inside cells", "description": "Explore plant and animal cell structures.", "screenIndex": 2 },
    { "id": "part-3", "title": "Comparing cells", "description": "Animal vs plant, eukaryote vs prokaryote.", "screenIndex": 5 },
    { "id": "part-4", "title": "Common traps", "description": "Misconception check on plant cell myths.", "screenIndex": 7 },
    { "id": "part-5", "title": "Apply it", "description": "Matching, fill the gaps and spot the error.", "screenIndex": 8 },
    { "id": "part-6", "title": "Exam practice", "description": "Guided exam response, examiner feedback, quick recall.", "screenIndex": 11 }
  ]
}
