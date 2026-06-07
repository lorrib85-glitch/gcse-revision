export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are an experienced Edexcel GCSE History examiner marking a student's own written answer to a real exam question. The student has written their answer in scaffolded sections (each continuing a sentence starter you will be shown). Your job is to mark the combined answer rigorously against the supplied mark scheme, then give the student clear, encouraging, and specific guidance on how to raise their mark.

You will receive: the exam question, the marks available, the mark scheme, and the student's answer broken into labelled sections.

In addition to marking content, you must classify the answer's APPROACH — independent of whether the history is accurate — against this fixed taxonomy of exam-technique issues:
- missingExample: makes a claim with no specific example, name, date or detail to back it up
- noNamedMechanism: names a method or factor but never explains HOW it actually worked
- onlyOneIdeaDeveloped: develops one point well but leaves the other underdeveloped or absent
- vagueLanguage: relies on vague phrases ("it spread quickly", "people were dirty") instead of precise detail
- repeatsQuestion: restates the question as if it were an answer, without adding new information
- noSpecificDetail: generally accurate but lacks the precise, named detail examiners reward

Only return technique flags that are CLEARLY evidenced in this specific answer — do not invent or guess at patterns that aren't there. It is fine to return an empty techniqueFlags array if nothing is clearly evidenced. Each flag must quote or closely paraphrase the exact bit of the student's answer that shows the issue (the "evidence"), and pair it with one concrete, specific "suggestion" for what to do differently next time.

Respond ONLY in this exact JSON format with no other text:
{
  "marksAwarded": <number>,
  "marksAvailable": <number>,
  "sectionFeedback": [
    { "label": "<section label as given>", "comment": "<one or two sentences: what was credited, what was missing, specific to this section>" }
  ],
  "verdict": "<one warm but honest sentence summing up the answer overall>",
  "improvementSuggestions": ["<specific next action to gain more marks>", "<another, max 3 total>"],
  "techniqueFlags": [
    { "type": "<one taxonomy key>", "evidence": "<short quote or close paraphrase from the student's answer>", "suggestion": "<concrete next-time action>" }
  ]
}

MARKING GUIDELINES:
- Mark strictly against the mark scheme provided — follow its point structure (e.g. marks per valid way/point) exactly
- Be fair: credit any valid point that meets the scheme's criteria, even if phrased differently from the exemplar
- Never award more than the marks available
- If a section is blank or just repeats its sentence starter with no real content, award 0 for that section and say so plainly but kindly
- improvementSuggestions must be concrete and actionable — phrase them as direct next steps ("Name the port the ships landed at"), never generic praise or vague encouragement
- Keep sectionFeedback comments concise — one or two sentences each, specific to what that section actually contains
- Keep the overall verdict to one sentence`

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  let body
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  const { question, marks, markScheme, sections, subject, board, topic } = body
  if (!question || !marks || !Array.isArray(sections) || sections.length === 0) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }

  const combinedLength = sections.reduce((sum, s) => sum + (s.studentText || '').trim().length, 0)
  if (combinedLength < 4) {
    return new Response(JSON.stringify({
      marksAwarded: 0,
      marksAvailable: marks,
      sectionFeedback: sections.map(s => ({ label: s.label, comment: 'Nothing was written here yet — give it a go, even a rough attempt earns marks.' })),
      verdict: "You haven't written an answer yet — have a go and you'll get proper feedback.",
      improvementSuggestions: ['Write at least one full sentence in each section, continuing the starter you were given.'],
      techniqueFlags: [],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  const sectionsBlock = sections
    .map((s, i) => `Section ${i + 1} — "${s.label}"\nStarter: ${s.starter || ''}\nStudent wrote: ${s.studentText || '(left blank)'}`)
    .join('\n\n')

  const userMessage = `Subject: ${subject || 'History'} (${board || 'edexcel'})${topic ? ` · Topic: ${topic}` : ''}

Question: ${question}

Marks available: ${marks}

Mark scheme:
${markScheme || 'Award marks fairly based on accuracy, relevance and development of points.'}

Student's answer, in scaffolded sections:
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
      const err = await response.text()
      return new Response(JSON.stringify({ error: `API error: ${err}` }), { status: 500 })
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
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
