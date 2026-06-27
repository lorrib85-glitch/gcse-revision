export default {
  "id": "math2",
  "subject": "Maths",
  "number": 2,
  "title": "Fraction Foundations",
  "subtitle": "Numerator, denominator, equivalent fractions",
  "era": "Foundation",
  "icon": "🍕",
  "color": "#4B90FF",
  "colorLight": "rgba(75,144,255,.12)",
  "hook": {
    "scenario": {
      "location": "Any maths lesson",
      "hint": "A student sees 1/10 on the paper. They think it's bigger than 1/2 because 10 > 2."
    },
    "statement": "A bigger denominator means a bigger fraction.",
    "isTrue": false,
    "accentWords": [
      "bigger denominator",
      "bigger fraction"
    ],
    "explanation": "A bigger denominator means more pieces — so each piece is smaller. 1/10 is much less than 1/2. Think of it as slicing a pizza into more slices.",
    "wrongFeedback": "Think about slicing a pizza — more slices means each slice gets smaller, not bigger.",
    "correctFeedback": "1/2 is bigger than 1/10. The denominator tells you piece size, not fraction size.",
    "loadingText": "Let's see why the bottom number is about piece size…",
    "bigQuestion": "So what does the denominator actually tell us?",
    "revealHeader": "Bigger denominator = smaller pieces.",
    "revealVisual": "denominatorBars",
    "revealItems": [
      {
        "emoji": "🍕",
        "label": "Denominator = piece size",
        "detail": "1/2 has 2 pieces — each is huge. 1/10 has 10 pieces — each is tiny. Bigger denominator means more cuts, not more pizza."
      },
      {
        "emoji": "📐",
        "label": "More cuts = tinier pieces",
        "detail": "Cutting a pizza into 10 slices makes each slice smaller than cutting into 2. The total pizza hasn't changed."
      },
      {
        "emoji": "⚠️",
        "label": "The common trap",
        "detail": "Students see 10 and think \"bigger number = bigger fraction.\" That's the trap. 10 just means 10 tinier pieces."
      }
    ],
    "punchline": "The denominator is the piece size. Bigger denominator = smaller pieces."
  },
  "intro": {
    "learningGoals": [
      "Read any fraction using numerator and denominator",
      "Understand why bigger denominators mean smaller pieces",
      "See that different fractions can show the same amount",
      "Simplify fractions without changing their value"
    ]
  },
  "outcomes": {
    "intro": "Fractions trip up more GCSE students than almost anything else. After this chapter, they shouldn't.",
    "bullets": [
      "Add, subtract, multiply and divide fractions without a calculator",
      "Convert between fractions, decimals and percentages confidently",
      "Spot equivalent fractions and simplify them without thinking twice",
      "Apply fraction skills to problem-solving and exam questions"
    ]
  },
  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "½ and 4/8 are equal in value.",
        "isTrue": true
      },
      {
        "type": "choice",
        "question": "To multiply two fractions, you...",
        "options": [
          "Add numerators and add denominators",
          "Multiply numerators and multiply denominators",
          "Flip the second fraction then add"
        ],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "Simplifying fractions matters because...",
        "options": [
          {
            "text": "Examiners only accept the simplest form",
            "icon": "warning"
          },
          {
            "text": "It's the same value but much easier to work with",
            "icon": "lightbulb"
          },
          {
            "text": "It makes multiplication easier to check",
            "icon": "gear"
          }
        ],
        "correct": 1
      }
    ]
  },
  "screens": [
    {
      "label": "Overview",
      "kicker": "Module Overview",
      "heading": "Fractions are sharing.",
      "sub": "They tell you how many equal parts exist — and how many are selected.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Fractions unlock <strong>percentages</strong>, <strong>ratio</strong> and <strong>algebra</strong> later. Everything connects back to this."
        },
        {
          "type": "flashcards",
          "cards": [
            {
              "front": "Numerator vs denominator",
              "back": "Top = selected parts. Bottom = total equal parts."
            },
            {
              "front": "Equivalent fractions",
              "back": "Different fractions can show the same amount."
            },
            {
              "front": "Simplifying",
              "back": "Shrink the numbers without changing the amount."
            },
            {
              "front": "Fraction size",
              "back": "Fractions are easier when you picture the pieces."
            }
          ]
        }
      ]
    },
    {
      "label": "The Parts",
      "kicker": "Core Skill 1",
      "heading": "The denominator splits. The numerator selects.",
      "sub": "Denominator first — it creates the equal pieces. Then numerator selects from them.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "These words appear in <strong>every</strong> fraction question. Knowing them by sight saves time under pressure."
        },
        {
          "type": "read",
          "text": "In the fraction <strong>3/5</strong>: the bottom number (denominator) tells you 5 equal pieces exist. The top number (numerator) tells you 3 of them are selected."
        },
        {
          "type": "quiz",
          "question": "What does the denominator tell us?",
          "options": [
            {"text": "Selected parts", "correct": false},
            {"text": "Total equal parts", "correct": true},
            {"text": "The biggest number", "correct": false}
          ],
          "explanation": "The denominator tells us how many equal pieces the whole was split into."
        }
      ]
    },
    {
      "label": "Rules",
      "kicker": "Active Recall",
      "heading": "Complete the fraction rules.",
      "sub": "Lock in the language before moving to visuals.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "These words appear constantly in GCSE maths. <strong>Fluency with the terms</strong> stops you losing easy marks."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "The denominator tells us the total",
              "after": "parts.",
              "answer": "equal",
              "hints": [
                "All pieces must be the same size.",
                "The whole is split into parts of identical size."
              ]
            },
            {
              "before": "The numerator tells us the",
              "after": "parts.",
              "answer": "selected",
              "hints": [
                "It counts how many pieces are chosen.",
                "Think: how many pieces are shaded?"
              ]
            },
            {
              "before": "A bigger denominator means",
              "after": "pieces.",
              "answer": "smaller",
              "hints": [
                "Think about slicing a pizza into more parts.",
                "More slices means each slice gets…"
              ]
            },
            {
              "before": "1/2 is bigger than 1/10 because the pieces are",
              "after": ".",
              "answer": "larger",
              "hints": [
                "1/2 has only 2 pieces — each must be big.",
                "Which pizza slice would you rather have: half, or one-tenth?"
              ]
            }
          ],
          "correctMsg": "Nice. You're learning to picture the fraction, not memorise it.",
          "wrongMsg": "Think visually. More denominator pieces means each piece shrinks."
        }
      ]
    },
    {
      "label": "Equivalent",
      "kicker": "Core Skill 2",
      "heading": "Same amount. Different fraction.",
      "sub": "Equivalent fractions look different but show the same amount.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Used before <strong>adding fractions</strong> and converting to <strong>percentages</strong>. This is the key idea behind both."
        },
        {
          "type": "quiz",
          "question": "1/2 and 2/4 are equivalent fractions because…",
          "options": [
            {"text": "The pieces were split again and the total amount stayed the same", "correct": true},
            {"text": "Both numbers doubled so the fraction doubled", "correct": false},
            {"text": "The denominator is bigger so it must be bigger", "correct": false}
          ],
          "explanation": "Splitting pieces without changing the total amount — that's the whole idea of equivalent fractions."
        },
        {
          "type": "quiz",
          "question": "What fraction is equivalent to 1/2 when both numbers are multiplied by 4?",
          "options": [
            {"text": "4/8", "correct": true},
            {"text": "2/4", "correct": false},
            {"text": "5/8", "correct": false}
          ],
          "explanation": "1×4 = 4 and 2×4 = 8. So 1/2 = 4/8. Multiply top AND bottom by the same number."
        }
      ]
    },
    {
      "label": "Quiz",
      "kicker": "Practice",
      "heading": "Test yourself.",
      "sub": "Three levels. Work through them in order.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Quick retrieval builds <strong>long-term memory</strong> faster than rereading."
        },
        {
          "type": "tieredquiz",
          "tiers": [
            {
              "label": "Warm Up",
              "emoji": "🟢",
              "questions": [
                {
                  "q": "Which fraction is bigger?",
                  "options": [
                    "1/2",
                    "1/8",
                    "They are equal"
                  ],
                  "correct": 0,
                  "feedback": "Halves are larger pieces than eighths. 1/2 > 1/8.",
                  "hint": "Imagine cutting a pizza into 2 vs 8 slices. Which slice is bigger?"
                },
                {
                  "q": "What does denominator mean?",
                  "options": [
                    "selected parts",
                    "total equal parts",
                    "the biggest number"
                  ],
                  "correct": 1,
                  "feedback": "Denominator = total equal parts the whole is split into.",
                  "hint": "It's the bottom number. It tells you how many pieces exist."
                },
                {
                  "q": "Which fractions match?",
                  "options": [
                    "1/2 and 2/4",
                    "1/2 and 1/4",
                    "1/3 and 3/4"
                  ],
                  "correct": 0,
                  "feedback": "1/2 = 2/4. Both show the same amount — just split differently.",
                  "hint": "Think: which pair would shade the same amount on a fraction bar?"
                }
              ]
            },
            {
              "label": "Challenge",
              "emoji": "🟡",
              "questions": [
                {
                  "q": "Simplify: 6/8",
                  "options": [
                    "3/4",
                    "6/4",
                    "2/4"
                  ],
                  "correct": 0,
                  "feedback": "6÷2 = 3 and 8÷2 = 4. Divide both by 2 → 3/4.",
                  "hint": "What number divides into both 6 and 8?"
                },
                {
                  "q": "Which are equivalent?",
                  "options": [
                    "3/5 and 6/10",
                    "3/5 and 3/10",
                    "3/5 and 5/3"
                  ],
                  "correct": 0,
                  "feedback": "3×2=6 and 5×2=10. Both multiplied by 2 → 6/10 = 3/5.",
                  "hint": "Try multiplying numerator and denominator of 3/5 by 2."
                },
                {
                  "q": "What happens when the denominator gets bigger?",
                  "options": [
                    "Pieces get smaller",
                    "Pieces get bigger",
                    "The fraction gets bigger"
                  ],
                  "correct": 0,
                  "feedback": "More equal parts = each part is smaller. The whole hasn't changed.",
                  "hint": "Think about cutting something into more and more slices."
                }
              ]
            },
            {
              "label": "Boss Mode",
              "emoji": "🔴",
              "questions": [
                {
                  "q": "Why does 1/2 = 2/4?",
                  "options": [
                    "The pieces were split again but the amount stayed the same",
                    "Both numbers doubled so the fraction doubled",
                    "The denominator is bigger so it must be bigger"
                  ],
                  "correct": 0,
                  "feedback": "Splitting pieces without changing the amount — that's the whole idea of equivalent fractions.",
                  "hint": "Picture a bar. Split each piece in half. Same shaded amount?"
                },
                {
                  "q": "Spot the mistake: 6/8 → 6/4",
                  "options": [
                    "Only the denominator changed — both must divide by same number",
                    "The denominator should stay the same",
                    "You should multiply, not divide"
                  ],
                  "correct": 0,
                  "feedback": "Simplifying means dividing BOTH numerator and denominator by the same number. Changing only one changes the value.",
                  "hint": "What happened to the numerator (6)? Did it change?"
                },
                {
                  "q": "Which is larger: 3/4 or 5/8?",
                  "options": [
                    "3/4",
                    "5/8",
                    "They are equal"
                  ],
                  "correct": 0,
                  "feedback": "3/4 = 6/8. Compare: 6/8 > 5/8. So 3/4 is larger.",
                  "hint": "Convert 3/4 so both fractions have the same denominator."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "label": "Checkpoint",
      "kicker": "Checkpoint",
      "heading": "True or False?",
      "sub": "Catch fraction logic errors before the exam does.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Used to catch <strong>impossible fraction logic</strong> — the kind that loses marks silently."
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "6/8 = 6/4",
              "answer": false,
              "reveal": "Only the denominator changed. That changes the piece size AND the amount. 6/8 = 0.75 (three quarters). 6/4 = 1.5 (bigger than the whole!). Both numbers must change together.",
              "examTrap": null
            }
          ]
        }
      ]
    },
    {
      "label": "Lab",
      "kicker": "Apply",
      "heading": "Build the same amount.",
      "sub": "Use the multiplier to create equivalent fractions.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "This builds <strong>real fraction understanding</strong>, not memorised steps. You'll use this in simplifying and adding fractions."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "1/2 multiplied top and bottom by 2 =",
              "after": "/4",
              "answer": "2",
              "hints": [
                "Multiply the numerator: 1 × 2 = ?",
                "Both top and bottom multiply by 2."
              ]
            },
            {
              "before": "2/3 multiplied top and bottom by 2 =",
              "after": "/6",
              "answer": "4",
              "hints": [
                "Multiply the numerator: 2 × 2 = ?",
                "Both top and bottom multiply by 2."
              ]
            },
            {
              "before": "1/2 multiplied top and bottom by 3 =",
              "after": "/6",
              "answer": "3",
              "hints": [
                "Multiply the numerator: 1 × 3 = ?",
                "Both top and bottom multiply by 3."
              ]
            }
          ],
          "correctMsg": "Multiply top AND bottom by the same number — the amount stays identical, only the piece size changes.",
          "wrongMsg": "Both numerator and denominator must multiply by the same number."
        }
      ]
    },
    {
      "label": "Exam",
      "kicker": "Exam Practice",
      "heading": "Exam Practice.",
      "sub": "Method matters as much as the answer.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Used to turn understanding into <strong>GCSE marks</strong>. Knowing the method is what examiners reward."
        },
        {
          "type": "quiz",
          "question": "Simplify: 8/12",
          "options": [
            {"text": "2/3", "correct": true},
            {"text": "4/6", "correct": false},
            {"text": "4/12", "correct": false},
            {"text": "8/6", "correct": false}
          ],
          "explanation": "Find HCF of 8 and 12 (= 4). Divide both: 8÷4 = 2, 12÷4 = 3 → answer: 2/3"
        },
        {
          "type": "quiz",
          "question": "Which fraction is equivalent to 3/5?",
          "options": [
            {"text": "6/10", "correct": true},
            {"text": "3/10", "correct": false},
            {"text": "5/3", "correct": false},
            {"text": "6/5", "correct": false}
          ],
          "explanation": "Multiply both by 2: 3×2 / 5×2 = 6/10. Check: 3/5 = 0.6 and 6/10 = 0.6 ✓"
        },
        {
          "type": "quiz",
          "question": "Why does 1/2 = 2/4?",
          "options": [
            {"text": "The pieces were split again and the amount stayed the same", "correct": true},
            {"text": "The numbers doubled so the fraction doubled", "correct": false},
            {"text": "The denominator is bigger so it must be bigger", "correct": false},
            {"text": "We added 1 to the top and 2 to the bottom", "correct": false}
          ],
          "explanation": "Both numerator and denominator were multiplied by 2. Each piece halved in size, but twice as many were selected — the shaded amount stays the same."
        },
        {
          "type": "examtip",
          "tip": "Shrink the numbers, not the value. Simplifying changes the fraction label, not the amount."
        }
      ]
    },
    {
      "label": "Rewind",
      "kicker": "Retrieval",
      "heading": "Final rewind.",
      "sub": "Strong maths comes from retrieval, not rereading.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters",
          "text": "Retrieval practice <strong>builds long-term memory</strong> faster than rereading notes."
        },
        {
          "type": "quiz",
          "question": "What does denominator mean?",
          "options": [
            {
              "text": "selected parts",
              "correct": false
            },
            {
              "text": "total equal parts",
              "correct": true
            },
            {
              "text": "the bottom number only",
              "correct": false
            }
          ],
          "explanation": "Denominator = total equal parts the whole is split into. It defines the piece size."
        },
        {
          "type": "quiz",
          "question": "Why are 1/2 and 2/4 equal?",
          "options": [
            {
              "text": "Same amount, smaller pieces",
              "correct": true
            },
            {
              "text": "The numbers doubled so the fraction doubled",
              "correct": false
            },
            {
              "text": "Both have even numbers",
              "correct": false
            }
          ],
          "explanation": "The pieces were halved in size but there are twice as many selected — the amount is identical."
        },
        {
          "type": "quiz",
          "question": "What happens when the denominator gets bigger?",
          "options": [
            {
              "text": "Pieces get smaller",
              "correct": true
            },
            {
              "text": "Pieces get bigger",
              "correct": false
            },
            {
              "text": "The fraction gets bigger",
              "correct": false
            }
          ],
          "explanation": "More equal parts means each part must be smaller. The whole hasn't changed."
        },
        {
          "type": "quiz",
          "question": "When simplifying a fraction, what changes?",
          "options": [
            {
              "text": "Numbers change, amount stays same",
              "correct": true
            },
            {
              "text": "Amount changes, numbers stay same",
              "correct": false
            },
            {
              "text": "Both the numbers and amount change",
              "correct": false
            }
          ],
          "explanation": "Simplifying changes the labels (numbers) but not the value. 6/8 and 3/4 are the same amount."
        },
        {
          "type": "keypoint",
          "text": "<strong>Module complete.</strong> You now understand: numerator vs denominator · equivalent fractions · simplifying · fraction size visually."
        }
      ]
    }
  ],
  "series": "foundations",
  "recallTags": [],
  "examTags": [],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "part-1", "title": "Fraction overview", "description": "Numerator, denominator, piece size", "screenIndex": 0 },
    { "id": "part-2", "title": "The parts", "description": "What the top and bottom numbers mean", "screenIndex": 1 },
    { "id": "part-3", "title": "Fraction rules", "description": "Language and terminology", "screenIndex": 2 },
    { "id": "part-4", "title": "Equivalent fractions", "description": "Same amount, different fraction", "screenIndex": 3 },
    { "id": "part-5", "title": "Practice quiz", "description": "Retrieval across all concepts", "screenIndex": 4 },
    { "id": "part-6", "title": "Exam practice", "description": "Mark-scheme style questions", "screenIndex": 7 }
  ]
}
