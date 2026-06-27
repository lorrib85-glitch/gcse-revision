export default {
  "id": "sci_bio_w1",
  "subject": "Biology",
  "number": 2,
  "title": "Plant Cells & Photosynthesis",
  "subtitle": "Tiny factories, big chemistry",
  "icon": "🌿",
  "color": "#38D27A",
  "colorLight": "rgba(56,210,122,.15)",
  "hook": {
    "statement": "The plant ate the soil.",
    "isTrue": false,
    "accentWords": [
      "ate the soil"
    ],
    "explanation": "Van Helmont's willow tree gained 74kg over 5 years. The soil lost just 57g. The mass had to come from somewhere else entirely — this chapter explains what.",
    "storyLines": [
      "Belgium, 1648. A scientist plants a tiny willow tree.",
      "He weighs everything — the tree, the soil, the pot.",
      "Five years later, the tree has gained 74 kg.",
      "The soil? Lost less than 60 grams."
    ],
    "wrongFeedback": "That's actually what most people think. But the numbers don't add up...",
    "correctFeedback": "Right. So where on earth did 74 kg of tree come from?",
    "bigQuestion": "So where did 74 kg of tree come from?",
    "revealItems": [
      {
        "emoji": "💨",
        "label": "Carbon dioxide",
        "detail": "Absorbed from the air through tiny pores in leaves. This is the main building block.",
        "color": "#38D27A",
        "bg": "rgba(56,210,122,.08)"
      },
      {
        "emoji": "💧",
        "label": "Water",
        "detail": "Pulled up from the soil through the roots. Used in the chemical reaction.",
        "color": "#34D5FF",
        "bg": "rgba(52,213,255,.08)"
      },
      {
        "emoji": "☀️",
        "label": "Light energy",
        "detail": "Absorbed by chlorophyll in the leaves. Powers the whole reaction. Without it — nothing.",
        "color": "#FFC857",
        "bg": "rgba(255,200,87,.08)"
      }
    ],
    "punchline": "Plants build themselves from thin air. Literally. This week you find out exactly how."
  },
  "intro": {
    "retrieval": {
      "question": "Before we start — what do you think photosynthesis actually produces?",
      "options": [
        "Oxygen and water",
        "Glucose and oxygen",
        "Carbon dioxide and glucose",
        "Energy and starch"
      ],
      "correctIndex": 1,
      "explanation": "Photosynthesis produces glucose (stored chemical energy) and oxygen (released as a by-product). The glucose is what the plant uses to grow, respire and build everything else."
    },
    "learningGoals": [
      "Name every organelle in a plant cell and explain its job",
      "Write the photosynthesis equation correctly using exam language",
      "Describe five different things plants do with glucose (SCARF)",
      "Spot and correct the wording mistakes that lose marks in the exam",
      "Explain why plants build mass from air, not soil"
    ]
  },
  "outcomes": {
    "intro": "You're about to understand exactly how plants turn light into food — and why this matters for all life on Earth.",
    "bullets": [
      "Describe the key parts of a plant cell and what each one does",
      "Explain the photosynthesis equation and what it actually means",
      "See why chlorophyll is the molecule that makes life possible",
      "Connect photosynthesis to respiration and energy flow in ecosystems"
    ]
  },
  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "Animal cells have a cell wall as well as a cell membrane.",
        "isTrue": false
      },
      {
        "type": "choice",
        "question": "In photosynthesis, plants absorb...",
        "options": [
          "Oxygen and glucose from the air",
          "Carbon dioxide and water using light energy",
          "Nitrogen and minerals from the soil"
        ],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "Chloroplasts are found in plant cells because...",
        "options": [
          {
            "text": "They make the plant appear green for camouflage",
            "icon": "leaf"
          },
          {
            "text": "They capture light energy to make glucose",
            "icon": "atom"
          },
          {
            "text": "They control what enters and exits the cell",
            "icon": "gear"
          }
        ],
        "correct": 1
      }
    ]
  },
  "screens": [
    {
      "type": "interactiveImage",
      "label": "🔬 Plant Cell Explorer",
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
          "description": "The control centre of the cell. Contains DNA — the instructions for everything the cell does, including making proteins and dividing.",
          "extraFact": "The nucleus directs the production of enzymes needed for photosynthesis. Without it, the chloroplasts could not function properly."
        },
        {
          "id": "chloroplast",
          "x": 20,
          "y": 68,
          "shortLabel": "Chloroplast",
          "title": "Chloroplast",
          "icon": "☀️",
          "description": "Contains chlorophyll, a green pigment that absorbs light energy. Plant cells use this energy to carry out photosynthesis and produce glucose. Only found in cells exposed to light.",
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
          "description": "The site of aerobic respiration. Mitochondria release energy from glucose so the cell can do work — growing, moving, dividing, making proteins.",
          "extraFact": "Even though plant cells make glucose in chloroplasts, they still need mitochondria to convert that glucose into usable energy (ATP)."
        },
        {
          "id": "ribosomes",
          "x": 55,
          "y": 46,
          "shortLabel": "Ribosomes",
          "title": "Ribosomes",
          "icon": "🔬",
          "description": "The site of protein synthesis. Ribosomes read instructions from DNA and assemble amino acids into proteins. Only visible under an electron microscope.",
          "extraFact": "All enzymes are proteins built by ribosomes. Every chemical reaction in the cell ultimately depends on them."
        }
      ]
    },
    {
      "label": "Quick Check",
      "kicker": "Retrieval",
      "heading": "What Did You Just Learn?",
      "sub": "No notes. No hints. Just you and what stuck.",
      "blocks": [
        {
          "type": "quiz",
          "question": "Which organelle absorbs light energy for photosynthesis?",
          "options": [
            {
              "text": "Nucleus",
              "correct": false
            },
            {
              "text": "Mitochondria",
              "correct": false
            },
            {
              "text": "Chloroplast",
              "correct": true
            },
            {
              "text": "Vacuole",
              "correct": false
            }
          ],
          "explanation": "Chloroplasts contain chlorophyll, which absorbs light energy. They're only in plant cells — and only in cells that are green (like leaf cells, not root cells)."
        },
        {
          "type": "quiz",
          "question": "Which organelle releases energy from glucose?",
          "options": [
            {
              "text": "Chloroplast",
              "correct": false
            },
            {
              "text": "Mitochondria",
              "correct": true
            },
            {
              "text": "Ribosomes",
              "correct": false
            },
            {
              "text": "Cell wall",
              "correct": false
            }
          ],
          "explanation": "Mitochondria are the site of aerobic respiration. They release energy from glucose so the cell can do work — moving, growing, making proteins."
        },
        {
          "type": "quiz",
          "question": "What gives a plant cell its rigid, fixed shape?",
          "options": [
            {
              "text": "Cell membrane",
              "correct": false
            },
            {
              "text": "Vacuole",
              "correct": false
            },
            {
              "text": "Cytoplasm",
              "correct": false
            },
            {
              "text": "Cell wall",
              "correct": true
            }
          ],
          "explanation": "The cell wall is made of cellulose and gives the plant cell a strong, fixed shape. The cell membrane is present too but is flexible, not rigid."
        },
        {
          "type": "quiz",
          "question": "A plant cell is wilting. Which organelle has likely shrunk?",
          "options": [
            {
              "text": "Nucleus",
              "correct": false
            },
            {
              "text": "Mitochondria",
              "correct": false
            },
            {
              "text": "Large vacuole",
              "correct": true
            },
            {
              "text": "Ribosomes",
              "correct": false
            }
          ],
          "explanation": "The large vacuole is filled with cell sap and keeps the cell turgid (firm). When a plant loses water, the vacuole shrinks, the cell loses pressure and the plant wilts."
        }
      ]
    },
    {
      "label": "Mistake Lab",
      "kicker": "Common Mistakes",
      "heading": "Sounds Right. Loses Marks.",
      "sub": "These are the phrases examiners see every year — and penalise every year.",
      "blocks": [
        {
          "type": "misconception",
          "label": "Tap to see why each one fails",
          "mistakes": [
            {
              "wrong": "Plants get food from the soil.",
              "right": "Plants make glucose by photosynthesis.",
              "reason": "Soil provides minerals (like nitrates), not food. Plants manufacture their own glucose using light energy — they are autotrophs."
            },
            {
              "wrong": "Chloroplasts make sunlight.",
              "right": "Chloroplasts absorb light energy.",
              "reason": "\"Make\" sunlight is physically impossible. The correct word is \"absorb\" — chlorophyll inside the chloroplast captures light energy from the sun."
            },
            {
              "wrong": "Plants create energy during photosynthesis.",
              "right": "Plants transfer light energy into chemical energy (glucose).",
              "reason": "Energy cannot be created or destroyed — it is transferred. Examiners specifically penalise \"create\" and \"make\" energy. Always say \"transfer\" or \"store\"."
            },
            {
              "wrong": "Only leaves have chloroplasts.",
              "right": "Only green parts of the plant contain chloroplasts.",
              "reason": "Any green part of a plant (stems, unripe fruit, green petals) has chloroplasts. Non-green parts (roots, white flowers) do not — they can't photosynthesise."
            }
          ]
        }
      ]
    },
    {
      "label": "The Equation",
      "kicker": "Photosynthesis",
      "heading": "Build The Recipe",
      "sub": "Photosynthesis is just cooking — light is the heat, glucose is the meal.",
      "blocks": [
        {
          "type": "read",
          "label": "📖 The Big Idea",
          "text": "Photosynthesis converts <strong>light energy</strong> into <strong>chemical energy</strong> stored in glucose. The plant takes two raw materials (carbon dioxide and water) and uses light to combine them into glucose and oxygen."
        },
        {
          "type": "builder",
          "label": "Build the photosynthesis equation",
          "slots": [
            null,
            null,
            null,
            null
          ],
          "operators": [
            "+",
            "→",
            "+"
          ],
          "pieces": [
            "carbon dioxide",
            "water",
            "glucose",
            "oxygen",
            "nitrogen",
            "starch"
          ],
          "answer": [
            "carbon dioxide",
            "water",
            "glucose",
            "oxygen"
          ],
          "hint": "Two things go IN (reactants), two things come OUT (products). Light energy drives the reaction.",
          "successText": "Carbon dioxide + water → glucose + oxygen. Light energy drives the reaction. This is the foundation of almost all life on Earth."
        },
        {
          "type": "keypoint",
          "text": "The word equation: <strong>carbon dioxide + water → glucose + oxygen</strong>. Light energy is needed. Chlorophyll absorbs it. This happens in the chloroplasts."
        },
        {
          "type": "examtip",
          "label": "🗡️ Exam Trap",
          "tip": "Students often say water is produced in photosynthesis. It is NOT. Water is a <strong>reactant</strong> (goes in). Oxygen is the gas that comes out.",
          "phrases": [
            "carbon dioxide + water → glucose + oxygen",
            "light energy required",
            "in the chloroplasts"
          ]
        }
      ]
    },
    {
      "label": "Glucose Uses",
      "kicker": "What Plants Do With Glucose",
      "heading": "SCARF: Five Things Plants Do With Glucose",
      "sub": "Students think glucose just gives energy. It does five different things.",
      "blocks": [
        {
          "type": "funfact",
          "label": "🤯 Actually Interesting",
          "text": "Wood is made from glucose. The tree trunk, every branch, every leaf — almost all of it built from sugar that the tree made from thin air using sunlight. You're basically looking at crystallised light."
        },
        {
          "type": "scarf",
          "label": "SCARF — tap each letter to reveal",
          "items": [
            {
              "letter": "S",
              "word": "Starch",
              "detail": "Glucose is converted to starch for storage. Starch is insoluble so it doesn't affect osmosis. Stored in chloroplasts and other parts of the plant."
            },
            {
              "letter": "C",
              "word": "Cellulose",
              "detail": "Used to make cellulose for cell walls. This gives the plant structural support. Wood is mostly cellulose."
            },
            {
              "letter": "A",
              "word": "Amino acids",
              "detail": "Combined with nitrates from the soil to make amino acids, which are then used to build proteins. No nitrates = no proteins = stunted growth."
            },
            {
              "letter": "R",
              "word": "Respiration",
              "detail": "Used in aerobic respiration to release energy for growth, reproduction, active transport and other cell processes."
            },
            {
              "letter": "F",
              "word": "Fats and oils",
              "detail": "Some glucose is converted into lipids (fats and oils) for storage — especially in seeds. Seeds are often very high in fats."
            }
          ]
        },
        {
          "type": "reveal",
          "label": "⚡ Exam Recall Check",
          "prompt": "Without looking up — what does SCARF stand for in terms of glucose uses?",
          "answer": "S = Starch (storage). C = Cellulose (cell walls). A = Amino acids (proteins). R = Respiration (energy). F = Fats and oils (seed storage)."
        }
      ]
    },
    {
      "label": "Decision Game",
      "kicker": "Apply Your Knowledge",
      "heading": "Where Should The Glucose Go?",
      "sub": "Six scenarios. One right answer each time. No hints.",
      "blocks": [
        {
          "type": "scenario",
          "label": "Glucose Decision",
          "completionText": "You can now link glucose uses to plant needs — a favourite AQA exam style question.",
          "scenarios": [
            {
              "situation": "The plant needs stronger cell walls to support a new branch.",
              "options": [
                "Starch",
                "Cellulose",
                "Respiration",
                "Fats"
              ],
              "correctIndex": 1,
              "explanation": "Cellulose is used to build cell walls. It gives structural strength."
            },
            {
              "situation": "The plant needs to store energy underground for winter.",
              "options": [
                "Amino acids",
                "Cellulose",
                "Starch",
                "Respiration"
              ],
              "correctIndex": 2,
              "explanation": "Starch is insoluble and used for long-term storage — in potatoes, for example."
            },
            {
              "situation": "The plant is growing rapidly and needs to make new proteins.",
              "options": [
                "Amino acids",
                "Starch",
                "Fats",
                "Cellulose"
              ],
              "correctIndex": 0,
              "explanation": "Glucose combines with nitrates to form amino acids, which are linked together to make proteins."
            },
            {
              "situation": "The plant needs energy for active transport of minerals.",
              "options": [
                "Cellulose",
                "Starch",
                "Respiration",
                "Fats"
              ],
              "correctIndex": 2,
              "explanation": "Respiration releases energy from glucose. Active transport needs this energy to move minerals against the concentration gradient."
            },
            {
              "situation": "A seed needs to store lots of energy in a compact, dense form.",
              "options": [
                "Starch",
                "Fats and oils",
                "Amino acids",
                "Cellulose"
              ],
              "correctIndex": 1,
              "explanation": "Fats contain more energy per gram than starch. Seeds (like sunflower seeds) store fats for the germinating seedling to use."
            }
          ]
        }
      ]
    },
    {
      "label": "Exam Assassin",
      "kicker": "Exam Technique",
      "heading": "How To Actually Score Marks",
      "sub": "These aren't tips. These are the specific phrases that win and lose marks.",
      "blocks": [
        {
          "type": "examtip",
          "label": "🗡️ Tip 1 — Absorb, Not Collect",
          "tip": "Say <strong>\"absorbs light energy\"</strong> — not \"collects sunlight\" or \"uses light\". Examiners want the word ABSORB.",
          "phrases": [
            "absorbs light energy",
            "chlorophyll",
            "chloroplast"
          ]
        },
        {
          "type": "examtip",
          "label": "🗡️ Tip 2 — Glucose, Not Food",
          "tip": "Photosynthesis produces <strong>glucose</strong>. Never \"food\" or \"sugar\" — use the specific term.",
          "phrases": [
            "glucose",
            "not food",
            "not sugar"
          ]
        },
        {
          "type": "examtip",
          "label": "🗡️ Tip 3 — Transfer, Not Create",
          "tip": "Light energy is <strong>transferred</strong> into chemical energy. Never say plants \"make\", \"create\" or \"produce\" energy. Energy is conserved, not created.",
          "phrases": [
            "energy is transferred",
            "light energy → chemical energy",
            "stored in glucose"
          ]
        },
        {
          "type": "quiz",
          "question": "Which answer would score the mark?",
          "options": [
            {
              "text": "Chloroplasts collect sunlight to make food for the plant.",
              "correct": false
            },
            {
              "text": "Chloroplasts absorb light energy to produce glucose by photosynthesis.",
              "correct": true
            },
            {
              "text": "Chloroplasts create energy from sunlight.",
              "correct": false
            },
            {
              "text": "Chloroplasts make sugar using the sun.",
              "correct": false
            }
          ],
          "explanation": "Option B uses the correct command words: \"absorb\", \"light energy\", \"glucose\", \"photosynthesis\". Every other option uses vague or incorrect language."
        }
      ]
    },
    {
      "label": "Boss Battle",
      "kicker": "Challenge",
      "heading": "⚔️ Boss Battle: Apply Everything",
      "sub": "Three questions. Free text. Marked by AI. No skipping.",
      "blocks": [
        {
          "type": "read",
          "label": "🔥 Real answers only.",
          "text": "Write your answer in the box — then submit it. The AI examiner will mark it against the actual mark scheme, tell you what you got right, what you missed, and show you a model answer. <strong>You have to try before you can see the model answer.</strong>"
        },
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Warm Up",
          "question": "A student says: \"Plants get food from the soil.\" Explain why this is incorrect and give a better explanation.",
          "markPoints": "- Plants do NOT get food/energy from the soil\n- Plants make glucose through photosynthesis\n- Photosynthesis uses carbon dioxide, water and light energy\n- The soil only provides minerals/nitrates (not food/energy)\n- Plants are producers/autotrophs — they make their own food"
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Challenge",
          "question": "A plant has damaged chloroplasts. Explain why this would affect the plant's growth, even if it has plenty of water and carbon dioxide.",
          "markPoints": "- Damaged chloroplasts cannot absorb light energy properly\n- Less/no photosynthesis can occur\n- Less glucose is produced\n- Less glucose means less energy available for growth (via respiration)\n- Less glucose means fewer building materials: less cellulose for cell walls, fewer amino acids for proteins\n- Plant grows more slowly or stops growing"
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Boss Mode",
          "question": "A gardener removes all the leaves from a healthy plant. Predict and explain what will happen to the plant over the following two weeks.",
          "markPoints": "- Leaves contain chloroplasts — removing them stops photosynthesis\n- No photosynthesis means no glucose being produced\n- Plant cannot respire efficiently — less energy available\n- Growth stops — no glucose for cellulose or protein synthesis\n- Plant uses up stored starch reserves\n- Plant weakens and may wilt or die\n- Cannot replace damaged or dead cells\n- Cannot produce new leaves without stored energy"
        }
      ]
    },
    {
      "label": "Fast Recap",
      "kicker": "Final Retrieval",
      "heading": "Lock It In",
      "sub": "Tap every card. This is the stuff that will come up in Paper 1.",
      "blocks": [
        {
          "type": "flashcards",
          "cards": [
            {
              "front": "Chloroplast",
              "back": "Contains chlorophyll. Absorbs light energy for photosynthesis. Only in plant and algae cells."
            },
            {
              "front": "Nucleus",
              "back": "Controls cell activities. Contains DNA (genetic instructions)."
            },
            {
              "front": "Mitochondria",
              "back": "Site of aerobic respiration. Releases energy from glucose."
            },
            {
              "front": "Cell wall",
              "back": "Made of cellulose. Gives plant cells strength and a fixed shape."
            },
            {
              "front": "Large vacuole",
              "back": "Filled with cell sap. Keeps cell turgid (firm). Not in animal cells."
            },
            {
              "front": "Photosynthesis equation",
              "back": "carbon dioxide + water → glucose + oxygen. Light energy required. In chloroplasts."
            },
            {
              "front": "SCARF",
              "back": "Starch · Cellulose · Amino acids · Respiration · Fats and oils. Five uses of glucose."
            },
            {
              "front": "Ribosomes",
              "back": "Where proteins are made. Present in all cells. Too small for a light microscope."
            },
            {
              "front": "Three things plant cells have that animal cells lack",
              "back": "Cell wall · Chloroplasts · Large permanent vacuole."
            },
            {
              "front": "Energy in photosynthesis",
              "back": "Light energy is TRANSFERRED into chemical energy stored in glucose. Never \"created\"."
            }
          ]
        },
        {
          "type": "keypoint",
          "text": "✅ <strong>You can now:</strong> name all plant cell organelles and their jobs, write the photosynthesis equation correctly, describe five uses of glucose using SCARF, and use the exact phrases that score marks in the exam."
        }
      ]
    }
  ],
  "series": "cell-biology",
  "recallTags": [],
  "examTags": [],
  "assetKeys": [],
  "stageNavigation": []
}
