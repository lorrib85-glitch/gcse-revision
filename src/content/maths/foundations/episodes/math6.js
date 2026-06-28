export default {
  "id": "math6",
  "subject": "Maths",
  "number": 6,
  "title": "Factors, multiples and primes",
  "subtitle": "Prime factorisation, HCF, LCM and factor trees",
  "era": "Number survival kit",
  "icon": "🔎",
  "color": "#2DD4BF",
  "colorLight": "rgba(45,212,191,.12)",
  "headerImage": "/headers/maths-numbers.webp",

  "module": "number-survival-kit",
  "moduleNumber": 1,
  "chapterNumber": 6,
  "aqaLinks": ["N4"],
  "mapsToMathsGroups": ["maths_primes"],
  "weaknessTags": ["maths:prime-numbers", "maths:hcf-lcm", "maths:prime-factorisation"],
  "prerequisiteChapters": ["math1", "math2", "math4", "math5"],

  "hook": {
    "scenario": {
      "location": "AQA Foundation Paper 1 (non-calculator)",
      "hint": "A student says 1 is a prime number because it only divides by itself."
    },
    "statement": "1 is a prime number",
    "isTrue": false,
    "accentWords": ["1", "prime"],
    "explanation": "A prime number has exactly two factors: 1 and itself. The number 1 only has one factor, so it is not prime. The first prime number is 2.",
    "wrongFeedback": "Prime means exactly two factors. 1 only has one factor, so it is not prime.",
    "correctFeedback": "Right. 1 is not prime because it has only one factor. 2 is the first prime number.",
    "loadingText": "Let's open up the building blocks hidden inside numbers…",
    "bigQuestion": "How do prime factors unlock HCF, LCM and exam method marks?",
    "revealHeader": "Primes are the building blocks of whole numbers.",
    "revealItems": [
      {
        "emoji": "🧱",
        "label": "Factors divide exactly",
        "detail": "A factor of 12 divides into 12 with no remainder. The factor pairs are 1×12, 2×6 and 3×4."
      },
      {
        "emoji": "🔁",
        "label": "Multiples are times tables",
        "detail": "Multiples of 4 are 4, 8, 12, 16 and so on. Common multiples help with timing and scheduling problems."
      },
      {
        "emoji": "🔎",
        "label": "Prime factorisation is the fingerprint",
        "detail": "60 = 2² × 3 × 5. Once you have prime factors, HCF and LCM become much easier."
      }
    ],
    "punchline": "Factors break numbers down. Multiples build them up. Prime factors show the hidden structure."
  },

  "intro": {
    "learningGoals": [
      "List factors and multiples systematically",
      "Identify prime numbers and explain why 1 is not prime",
      "Write numbers as products of prime factors in index form",
      "Find HCF and LCM using listing and prime factorisation",
      "Apply LCM and HCF to scheduling, packaging and sharing contexts"
    ]
  },

  "outcomes": {
    "intro": "Factors, multiples and primes are tested directly in AQA Foundation, and they also support fractions, ratio, standard form and algebra later in the course.",
    "bullets": [
      "Know the difference between a factor and a multiple",
      "Use factor pairs to list all factors without missing any",
      "Build a factor tree and write the answer in index form",
      "Find HCF as the biggest shared factor",
      "Find LCM as the smallest shared multiple"
    ]
  },

  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "1 is a prime number.",
        "isTrue": false
      },
      {
        "type": "choice",
        "question": "Which list shows factors of 12?",
        "options": ["12, 24, 36", "1, 2, 3, 4, 6, 12", "2, 4, 6, 8, 10"],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "The LCM of 4 and 6 is...",
        "options": [
          { "text": "12", "icon": "lightbulb" },
          { "text": "24", "icon": "warning" },
          { "text": "2", "icon": "arrow" }
        ],
        "correct": 0
      }
    ]
  },

  "screens": [
    {
      "tag": "maths:prime-numbers",
      "label": "The prime trap",
      "kicker": "Section 1 — Why it matters",
      "heading": "Why is 1 not prime?",
      "sub": "Prime numbers have exactly two factors. That word exactly matters.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "Prime numbers and prime factorisation appear regularly in AQA Foundation questions. The most common opening mistake is calling 1 prime, then building a factor tree or HCF/LCM method on a shaky foundation."
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "1 is prime because it divides by itself.",
              "answer": false,
              "reveal": "FALSE. A prime number has exactly two factors: 1 and itself. The number 1 has only one factor, so it is not prime.",
              "examTrap": "Never end a factor tree branch with 1. Prime factorisation uses prime factors only."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Which is the only even prime number?",
          "options": [
            { "text": "1", "correct": false },
            { "text": "2", "correct": true },
            { "text": "4", "correct": false }
          ],
          "explanation": "2 has exactly two factors: 1 and 2. Every other even number divides by 2 as well as 1 and itself, so it is not prime."
        }
      ]
    },

    {
      "tag": null,
      "label": "Prior knowledge",
      "kicker": "Section 2 — Check your foundations",
      "heading": "Factors, multiples and division facts.",
      "sub": "This chapter relies on knowing when numbers divide exactly.",
      "blocks": [
        {
          "type": "read",
          "label": "Prerequisite skills",
          "text": "You need division from Chapter 2, BIDMAS/index notation from Chapter 4, and checking habits from Chapter 5. If a number divides exactly with no remainder, it is a factor."
        },
        {
          "type": "quiz",
          "question": "Is 48 divisible by 6?",
          "options": [
            { "text": "Yes, because 6 × 8 = 48", "correct": true },
            { "text": "No, because 48 is not in the 6 times table", "correct": false },
            { "text": "Only if 6 is prime", "correct": false }
          ],
          "explanation": "48 ÷ 6 = 8 exactly, so 6 is a factor of 48."
        },
        {
          "type": "quiz",
          "question": "What are the first five multiples of 4?",
          "options": [
            { "text": "1, 2, 4, 8, 16", "correct": false },
            { "text": "4, 8, 12, 16, 20", "correct": true },
            { "text": "4, 6, 8, 10, 12", "correct": false }
          ],
          "explanation": "Multiples are times-table answers: 4×1, 4×2, 4×3, 4×4, 4×5."
        }
      ]
    },

    {
      "tag": "maths:prime-numbers",
      "label": "Factors and multiples",
      "kicker": "Section 3 — Core idea",
      "heading": "Factors divide. Multiples multiply.",
      "sub": "These words sound similar, but they move in opposite directions.",
      "blocks": [
        {
          "type": "read",
          "label": "Factor pairs",
          "text": "To list all factors, work in pairs. For 36:<br/>1×36, 2×18, 3×12, 4×9, 6×6.<br/>So the factors are <strong>1, 2, 3, 4, 6, 9, 12, 18, 36</strong>. Stop when the factor pairs start repeating."
        },
        {
          "type": "quiz",
          "question": "Which is a complete list of factors of 18?",
          "options": [
            { "text": "1, 2, 3, 6, 9, 18", "correct": true },
            { "text": "2, 3, 6, 9", "correct": false },
            { "text": "18, 36, 54", "correct": false }
          ],
          "explanation": "Factor pairs: 1×18, 2×9, 3×6. Full list: 1, 2, 3, 6, 9, 18."
        },
        {
          "type": "quiz",
          "question": "Which number is a multiple of both 4 and 6?",
          "options": [
            { "text": "10", "correct": false },
            { "text": "12", "correct": true },
            { "text": "14", "correct": false }
          ],
          "explanation": "12 is in the 4 times table and the 6 times table. It is a common multiple."
        }
      ]
    },

    {
      "tag": "maths:prime-numbers",
      "label": "Prime numbers",
      "kicker": "Section 3 — Core idea",
      "heading": "Prime means exactly two factors.",
      "sub": "A prime has only 1 and itself as factors.",
      "blocks": [
        {
          "type": "read",
          "label": "Prime checklist",
          "text": "Prime numbers have exactly two factors. The first primes are:<br/><strong>2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47</strong>.<br/><br/>1 is not prime. 2 is the only even prime. A composite number has more than two factors."
        },
        {
          "type": "quiz",
          "question": "Is 19 prime?",
          "options": [
            { "text": "Yes — it has no factors except 1 and 19", "correct": true },
            { "text": "No — all odd numbers are composite", "correct": false },
            { "text": "No — it is bigger than 10", "correct": false }
          ],
          "explanation": "19 is not divisible by 2, 3, 5 or 7. It has exactly two factors: 1 and 19."
        },
        {
          "type": "quiz",
          "question": "Which number is composite?",
          "options": [
            { "text": "13", "correct": false },
            { "text": "17", "correct": false },
            { "text": "21", "correct": true }
          ],
          "explanation": "21 has factors 1, 3, 7 and 21, so it has more than two factors. It is composite."
        }
      ]
    },

    {
      "tag": "maths:prime-factorisation",
      "label": "Factor trees",
      "kicker": "Section 3 — Core idea",
      "heading": "Prime factorisation finds the building blocks.",
      "sub": "Keep splitting until every branch ends in a prime.",
      "blocks": [
        {
          "type": "read",
          "label": "Factor tree method",
          "text": "Example: write 60 as a product of prime factors.<br/>60 = 2 × 30<br/>30 = 2 × 15<br/>15 = 3 × 5<br/><br/>So 60 = 2 × 2 × 3 × 5 = <strong>2² × 3 × 5</strong>. The final answer is in index form."
        },
        {
          "type": "quiz",
          "question": "Which is the prime factorisation of 90?",
          "options": [
            { "text": "9 × 10", "correct": false },
            { "text": "2 × 3² × 5", "correct": true },
            { "text": "2 × 45", "correct": false }
          ],
          "explanation": "90 = 2 × 45, 45 = 3 × 15, 15 = 3 × 5. So 90 = 2 × 3 × 3 × 5 = 2 × 3² × 5."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> A factorisation like 8 × 25 is not prime factorisation. Every final factor must be prime, and if the question asks for index form, write repeated primes as powers."
        }
      ]
    },

    {
      "tag": "maths:hcf-lcm",
      "label": "HCF and LCM",
      "kicker": "Section 3 — Core idea",
      "heading": "HCF is shared pieces. LCM is the shared meeting point.",
      "sub": "HCF usually gets smaller. LCM usually gets bigger.",
      "blocks": [
        {
          "type": "read",
          "label": "HCF vs LCM",
          "text": "<strong>HCF</strong> = highest common factor: the biggest number that divides exactly into both numbers.<br/><strong>LCM</strong> = lowest common multiple: the smallest number that both numbers land on in their times tables.<br/><br/>HCF(12, 18) = 6. LCM(4, 6) = 12."
        },
        {
          "type": "quiz",
          "question": "Find the HCF of 36 and 48.",
          "options": [
            { "text": "6", "correct": false },
            { "text": "12", "correct": true },
            { "text": "144", "correct": false }
          ],
          "explanation": "Factors of 36 include 1, 2, 3, 4, 6, 9, 12, 18, 36. Factors of 48 include 1, 2, 3, 4, 6, 8, 12, 16, 24, 48. The highest common factor is 12."
        },
        {
          "type": "quiz",
          "question": "Find the LCM of 8 and 12.",
          "options": [
            { "text": "4", "correct": false },
            { "text": "24", "correct": true },
            { "text": "96", "correct": false }
          ],
          "explanation": "Multiples of 8: 8, 16, 24. Multiples of 12: 12, 24. The lowest shared multiple is 24."
        }
      ]
    },

    {
      "tag": "maths:hcf-lcm",
      "label": "Prime factors for HCF/LCM",
      "kicker": "Section 3 — Core idea",
      "heading": "Use prime factors when the numbers get bigger.",
      "sub": "Shared lowest powers make HCF. All highest powers make LCM.",
      "blocks": [
        {
          "type": "read",
          "label": "Prime factor method",
          "text": "Example: 12 = 2² × 3 and 18 = 2 × 3².<br/><br/><strong>HCF:</strong> shared primes with lowest powers → 2¹ × 3¹ = 6.<br/><strong>LCM:</strong> all primes with highest powers → 2² × 3² = 36."
        },
        {
          "type": "quiz",
          "question": "90 = 2 × 3² × 5 and 126 = 2 × 3² × 7. What is the LCM?",
          "options": [
            { "text": "18", "correct": false },
            { "text": "630", "correct": true },
            { "text": "11340", "correct": false }
          ],
          "explanation": "LCM uses all prime factors at their highest powers: 2 × 3² × 5 × 7 = 2 × 9 × 5 × 7 = 630."
        },
        {
          "type": "quiz",
          "question": "Using 36 = 2² × 3² and 48 = 2⁴ × 3, what is the HCF?",
          "options": [
            { "text": "12", "correct": true },
            { "text": "144", "correct": false },
            { "text": "2⁴ × 3²", "correct": false }
          ],
          "explanation": "HCF uses shared primes with the lowest powers: 2² × 3 = 4 × 3 = 12."
        }
      ]
    },

    {
      "tag": "maths:prime-factorisation",
      "label": "Worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Prime factorisation in index form.",
      "sub": "This is a classic 2–3 mark AQA question.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>Write 200 as a product of its prime factors. Give your answer in index form.</strong>"
        },
        {
          "type": "read",
          "label": "Step 1 — Split into prime branches",
          "text": "200 = 2 × 100<br/>100 = 2 × 50<br/>50 = 2 × 25<br/>25 = 5 × 5"
        },
        {
          "type": "read",
          "label": "Step 2 — Collect primes and write powers",
          "text": "200 = 2 × 2 × 2 × 5 × 5 = <strong>2³ × 5²</strong>.<br/><br/>Mark scheme pattern: method for a valid factor tree, accuracy for all prime factors, final mark for correct index form if requested."
        },
        {
          "type": "quiz",
          "question": "Why is 8 × 25 not a prime factorisation of 200?",
          "options": [
            { "text": "Because 8 and 25 are not prime", "correct": true },
            { "text": "Because 8 × 25 does not equal 200", "correct": false },
            { "text": "Because factor trees cannot start with 8", "correct": false }
          ],
          "explanation": "8 × 25 equals 200, but it is not prime factorisation because 8 and 25 are composite. You must split down to primes: 2³ × 5²."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Fill in the missing parts.",
      "sub": "Practise factor trees, HCF and prime explanations.",
      "blocks": [
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "90 = 2 × 3² ×",
              "after": ".",
              "answer": "5",
              "hints": ["90 = 2 × 45.", "45 = 3 × 3 × 5."]
            },
            {
              "before": "36 = 2² × 3² and 48 = 2⁴ × 3, so the HCF is 2² × 3 =",
              "after": ".",
              "answer": "12",
              "hints": ["Use the shared prime factors with the lowest powers.", "2² × 3 = 4 × 3."]
            },
            {
              "before": "1 is not prime because it has",
              "after": "factor.",
              "answer": "one",
              "hints": ["Prime means exactly two factors.", "1 only has the factor 1."]
            }
          ],
          "correctMsg": "Good — you are using prime factors, not just any factors.",
          "wrongMsg": "Check whether every factor is prime, and whether the question asks for HCF or LCM."
        }
      ]
    },

    {
      "tag": "maths:hcf-lcm",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "LCM is not always the product.",
      "sub": "Multiplying the two numbers is tempting, but often too big.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's answer",
          "text": "A student writes:<br/><strong>LCM(4, 6) = 24 because 4 × 6 = 24.</strong>"
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "The student is correct: the LCM of 4 and 6 is 24.",
              "answer": false,
              "reveal": "FALSE. LCM means lowest common multiple. Multiples of 4 are 4, 8, 12, 16, 20, 24. Multiples of 6 are 6, 12, 18, 24. The lowest shared multiple is 12, not 24.",
              "examTrap": "The product only equals the LCM when the two numbers share no common factor other than 1."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "What is the LCM of 4 and 6?",
          "options": [
            { "text": "2", "correct": false },
            { "text": "12", "correct": true },
            { "text": "24", "correct": false }
          ],
          "explanation": "12 is the first number in both the 4 and 6 times tables."
        }
      ]
    },

    {
      "tag": null,
      "label": "Maths in the wild",
      "kicker": "Section 7 — Real-world application",
      "heading": "When do cycles meet again?",
      "sub": "Scheduling questions usually use LCM.",
      "blocks": [
        {
          "type": "scenario",
          "situation": "Bus A runs every 8 minutes. Bus B runs every 12 minutes. Both leave at 9:00.",
          "question": "When will they next leave together?",
          "options": [
            { "text": "9:12", "correct": false },
            { "text": "9:24", "correct": true },
            { "text": "9:48", "correct": false }
          ],
          "correctMsg": "LCM(8, 12) = 24. They next leave together 24 minutes after 9:00, so the answer is 9:24.",
          "wrongMsg": "Find the lowest common multiple of 8 and 12. Multiples of 8: 8, 16, 24. Multiples of 12: 12, 24."
        },
        {
          "type": "scenario",
          "situation": "48 apples and 60 oranges are divided into identical bags. Each bag must have the same number of apples and the same number of oranges. What is the largest number of bags?",
          "question": "Which number of bags works?",
          "options": [
            { "text": "12", "correct": true },
            { "text": "24", "correct": false },
            { "text": "120", "correct": false }
          ],
          "correctMsg": "This is HCF: the largest number that divides both 48 and 60. HCF(48, 60) = 12.",
          "wrongMsg": "Sharing into the largest equal groups means HCF, not LCM."
        }
      ]
    },

    {
      "tag": null,
      "label": "Retrieval",
      "kicker": "Section 8 — Retrieval practice",
      "heading": "Retrieval practice.",
      "sub": "Mixed questions from Chapters 3–6.",
      "blocks": [
        {
          "type": "quiz",
          "question": "Write 24,862 to 3 significant figures.",
          "options": [
            { "text": "24,800", "correct": false },
            { "text": "24,900", "correct": true },
            { "text": "25,000", "correct": false }
          ],
          "explanation": "From Chapter 5: first three significant figures are 2, 4 and 8. Next digit is 6, so 8 rounds up to 9."
        },
        {
          "type": "quiz",
          "question": "Work out 2³ + 4 × 3.",
          "options": [
            { "text": "20", "correct": true },
            { "text": "36", "correct": false },
            { "text": "14", "correct": false }
          ],
          "explanation": "BIDMAS: 2³ = 8, 4 × 3 = 12, then 8 + 12 = 20."
        },
        {
          "type": "quiz",
          "question": "Work out (−2) × (−5).",
          "options": [
            { "text": "−10", "correct": false },
            { "text": "10", "correct": true },
            { "text": "−7", "correct": false }
          ],
          "explanation": "Same signs give positive. 2 × 5 = 10."
        }
      ]
    },

    {
      "tag": "maths:hcf-lcm",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA-style wording, method marks shown. Answer before reading the mark scheme.",
      "blocks": [
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Prime factorisation (3 marks)",
          "question": "Write 200 as a product of its prime factors. Give your answer in index form.",
          "markPoints": [
            "Answer: 2³ × 5²",
            "Method: factor tree or repeated division with prime factors only",
            "Index form required for the final accuracy mark",
            "Common error: 8 × 25 is not prime factorisation"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — LCM from prime factors (3 marks)",
          "question": "Use prime factorisation to find the LCM of 90 and 126.",
          "markPoints": [
            "90 = 2 × 3² × 5",
            "126 = 2 × 3² × 7",
            "LCM = 2 × 3² × 5 × 7 = 630"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Explain a prime (2 marks)",
          "question": "Explain why 19 is a prime number.",
          "markPoints": [
            "19 has exactly two factors: 1 and 19",
            "It does not divide exactly by 2, 3, 5 or 7",
            "Do not just say 'because it is odd'"
          ]
        }
      ]
    },

    {
      "tag": null,
      "label": "Chapter complete",
      "kicker": "Section 10 — Confidence check",
      "heading": "Chapter 6 done.",
      "sub": "Key rules. Top traps. What comes next.",
      "blocks": [
        {
          "type": "read",
          "label": "Key rules for factors, multiples and primes",
          "text": "1. <strong>Factor:</strong> divides exactly into a number.<br/>2. <strong>Multiple:</strong> a times-table result.<br/>3. <strong>Prime:</strong> exactly two factors — 1 and itself. 1 is not prime.<br/>4. <strong>Prime factorisation:</strong> split until every final factor is prime, then write in index form.<br/>5. <strong>HCF:</strong> shared factors; biggest shared divisor.<br/>6. <strong>LCM:</strong> shared multiples; smallest shared meeting point."
        },
        {
          "type": "read",
          "label": "Top 3 errors",
          "text": "1. <strong>Calling 1 prime:</strong> it has one factor, not two.<br/>2. <strong>Stopping too early:</strong> 8 × 25 is not prime factorisation.<br/>3. <strong>LCM = product:</strong> true only when the numbers have no shared factor other than 1."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> When the question says prime factorisation, ask: are all final factors prime, and is the answer in index form if requested?"
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 6 complete.</strong> You can now: list factors and multiples · identify primes · write prime factorisations · find HCF and LCM · use LCM in scheduling and HCF in sharing contexts.<br/><br/>Next: Chapter 7 — Powers, roots and standard form. The index notation used here becomes the foundation for powers."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:prime-numbers", "maths:hcf-lcm", "maths:prime-factorisation"],
  "examTags": ["N4"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1", "title": "The prime trap", "description": "Why 1 is not prime", "screenIndex": 0 },
    { "id": "s2", "title": "Prior knowledge", "description": "Factors, multiples and division", "screenIndex": 1 },
    { "id": "s3", "title": "Factors and multiples", "description": "Divide exactly or times table", "screenIndex": 2 },
    { "id": "s4", "title": "Prime numbers", "description": "Exactly two factors", "screenIndex": 3 },
    { "id": "s5", "title": "Factor trees", "description": "Prime factorisation in index form", "screenIndex": 4 },
    { "id": "s6", "title": "HCF and LCM", "description": "Shared factors and multiples", "screenIndex": 5 },
    { "id": "s7", "title": "Prime factors for HCF/LCM", "description": "Lowest and highest powers", "screenIndex": 6 },
    { "id": "s8", "title": "Worked example", "description": "Prime factorisation of 200", "screenIndex": 7 },
    { "id": "s9", "title": "Guided practice", "description": "Factor tree and HCF blanks", "screenIndex": 8 },
    { "id": "s10", "title": "Spot the error", "description": "LCM is not always product", "screenIndex": 9 },
    { "id": "s11", "title": "Real world", "description": "Scheduling and sharing", "screenIndex": 10 },
    { "id": "s12", "title": "Retrieval", "description": "Mixed questions from Ch3–Ch6", "screenIndex": 11 },
    { "id": "s13", "title": "Exam practice", "description": "AQA-style N4 questions", "screenIndex": 12 },
    { "id": "s14", "title": "Chapter complete", "description": "Key rules and next step", "screenIndex": 13 }
  ]
}
