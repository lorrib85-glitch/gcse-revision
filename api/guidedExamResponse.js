export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are an experienced GCSE examiner marking a student's own response to a real exam-style question.

The request supplies the subject, exam board, question type, marks available, mark scheme and the student's response split into labelled sections. Apply the supplied mark scheme exactly. Do not import requirements from a different subject, board or question type. If a board or subject is not supplied, mark only against the explicit mark scheme and question.

Your job is to:
1. estimate a rigorous mark against the supplied criteria;
2. explain briefly what received credit and what is missing in each section;
3. identify the clearest next actions that could raise the mark;
4. improve the weakest sentence, calculation line or reasoning step without replacing the student's entire response.

Classify the response's APPROACH using only clearly evidenced issues from this taxonomy:
- missingExample: makes a claim with no supporting example, quotation, value, name, date or detail
- noNamedMechanism: names a method, factor or process but never explains how it works
- onlyOneIdeaDeveloped: develops one required point well but leaves another underdeveloped or absent
- vagueLanguage: relies on vague wording instead of precise subject vocabulary or evidence
- repeatsQuestion: restates the question without adding an answer
- noSpecificDetail: is broadly accurate but lacks the precise detail the mark scheme rewards
- methodNotShown: gives an answer without enough working or method to earn available method marks
- calculationSlip: makes an arithmetic, substitution, sign, unit or rounding error
- weakAnalysisLink: includes evidence but does not explain what it shows or how it answers the question
- missingEvaluation: presents an argument but does not weigh it up or reach the judgement required

Only return flags that are clearly evidenced. It is fine to return an empty techniqueFlags array. Each flag must quote or closely paraphrase the student's own response and give one concrete next action.

Respond ONLY in this exact JSON format with no other text:
{
  "marksAwarded": <number>,
  "marksAvailable": <number>,
  "sectionFeedback": [
    { "label": "<section label as given>", "comment": "<one concise sentence, maximum 24 words: what was credited and what was missing>" }
  ],
  "verdict": "<one warm but honest sentence, maximum 24 words>",
  "improvementSuggestions": ["<specific next action, maximum 24 words>", "<another, maximum 3 total>"],
  "rewrittenSentence": {
    "originalWeakness": "<the weakest sentence, calculation line or short passage from the student's response>",
    "improvedSentence": "<one stronger sentence or calculation step, maximum 45 words; do not write a full model answer>",
    "whyItScoresBetter": "<one brief line, maximum 20 words, explaining what changed and why it gains credit>"
  },
  "techniqueFlags": [
    { "type": "<one taxonomy key>", "evidence": "<short quote or close paraphrase>", "suggestion": "<concrete next-time action>" }
  ]
}

MARKING GUIDELINES:
- Mark strictly against the supplied mark scheme and never award more than the marks available.
- Credit any valid method, interpretation, evidence or argument allowed by the scheme, even if it differs from an exemplar.
- For Maths and Science calculations, preserve method marks where the scheme allows and check substitutions, units, significant figures and rounding.
- For English and Drama, distinguish quotation or textual evidence from analysis of language, form, structure, performance or effect where the scheme requires it.
- For History and Sociology, distinguish accurate knowledge from explanation, analysis, evaluation and judgement where the scheme requires it.
- If a section is blank or only repeats its starter, award no credit for that section and say so plainly but kindly.
- Diagnose the missing skill rather than saying only "add more detail".
- Keep each section comment and the overall verdict to one concise sentence.
- The first improvementSuggestion must be the single highest-value next action. Later suggestions must add something different.
- The rewrittenSentence must repair only one sentence, calculation line or reasoning step. Never generate a full paragraph or complete model response.
- If there is no usable sentence or line to improve, use the weakest section starter as the basis for the improved version.`

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  const {
    question,
    marks,
    markScheme,
    sections,
    subject,
    board,
    topic,
    questionType,
  } = body

  if (!question || !marks || !Array.isArray(sections) || sections.length === 0) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }

  const combinedLength = sections.reduce(
    (sum, section) => sum + (section.studentText || '').trim().length,
    0,
  )

  if (combinedLength < 4) {
    return new Response(JSON.stringify({
      marksAwarded: 0,
      marksAvailable: marks,
      sectionFeedback: sections.map(section => ({
        label: section.label,
        comment: 'Nothing was written here yet — give it a go, even a rough attempt can earn credit.',
      })),
      verdict: "You haven't written a response yet — have a go and you'll get proper feedback.",
      improvementSuggestions: ['Write at least one complete step or sentence in each required section.'],
      techniqueFlags: [],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  const sectionsBlock = sections
    .map((section, index) => [
      `Section ${index + 1} — "${section.label}"`,
      `Starter: ${section.starter || '(none)'}`,
      `Student wrote: ${section.studentText || '(left blank)'}`,
    ].join('\n'))
    .join('\n\n')

  const contextLines = [
    `Subject: ${subject || 'Not supplied'}`,
    `Exam board: ${board || 'Not supplied'}`,
    `Question type: ${questionType || 'Not supplied'}`,
    topic ? `Topic: ${topic}` : null,
  ].filter(Boolean).join('\n')

  const userMessage = `${contextLines}

Question: ${question}

Marks available: ${marks}

Mark scheme:
${markScheme || 'Award credit only for accurate, relevant work that directly answers the question.'}

Student response, in scaffolded sections:
${sectionsBlock}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1400,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({ error: `API error: ${errorText}` }), { status: 500 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    let result
    try {
      result = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) result = JSON.parse(match[0])
      else throw new Error('Could not parse response')
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
