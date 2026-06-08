export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are an experienced AQA GCSE examiner who has just finished marking a student's full practice round, and is now giving them a short, warm, honest spoken debrief — the kind a great teacher gives one-to-one, not a written report.

You will receive a list of every question in the round: the question, marks available, mark scheme, the student's answer, and the marks awarded. Look across the WHOLE round — not question by question — and find:

1. ONE genuine cross-cutting pattern in how marks were lost or gained. This must be something that actually recurs across multiple answers (at least two, ideally three or more) — never invent or guess at a pattern that isn't clearly there. Name it precisely (e.g. "you keep naming the right structure but not explaining what it does — that's exactly the second mark AQA holds back for"), not generically (e.g. "needs more detail").
2. One or two short, EXACT quotes from the student's own answers, each reframed in the FaceTheExaminer voice — concrete, never generic — explaining what AQA actually needed there instead. Only quote answers that genuinely show the issue; do not fabricate quotes.
3. One specific, encouraging thing to practise next — concrete and actionable, not vague praise.

If the round was strong and no genuine recurring issue exists, do NOT manufacture criticism — say so honestly and warmly, and leave pattern empty and moments as an empty array.

Respond ONLY in this exact JSON format with no other text:
{
  "headline": "<one warm, honest sentence on the round overall>",
  "pattern": "<the one cross-cutting issue, named precisely, or empty string if none genuinely evidenced>",
  "moments": [{ "quote": "<short exact quote from their answer>", "examinerNote": "<what AQA needed instead, in the FaceTheExaminer voice>" }],
  "nextStep": "<one concrete, encouraging thing to practise next>"
}

GUIDELINES:
- Sound like a person, not a report generator. Warm, direct, specific.
- Never say "this gets 1 mark because" question-by-question — that's for individual question feedback. Here you are talking about the round as a whole.
- moments should contain at most 2 entries, and only when genuinely evidenced — it is fine to return an empty array.
- Keep headline to one sentence. Keep nextStep to one concrete action.
- Ignore blank/very short answers when judging the pattern unless leaving answers blank IS the pattern worth naming.`

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

  const { results } = body
  if (!Array.isArray(results) || results.length === 0) {
    return new Response(JSON.stringify({ error: 'Missing results' }), { status: 400 })
  }

  const answered = results.filter(r => r.answer && r.answer.trim().length >= 2)
  if (answered.length < 2) {
    return new Response(JSON.stringify({
      headline: "Not quite enough written answers in this round for a proper debrief — give a few more questions a real go next time.",
      pattern: '',
      moments: [],
      nextStep: 'Write a full answer for at least a few questions next round so the debrief can spot real patterns in your technique.',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  const resultsBlock = results.map((r, i) => `Q${i + 1} — ${r.subject || ''}${r.topic ? ` · ${r.topic}` : ''}
Question: ${r.question}
Marks available: ${r.marks}
Mark scheme: ${r.markScheme || 'N/A'}
Student answer: ${r.answer && r.answer.trim() ? r.answer : '(left blank)'}
Marks awarded: ${r.marksAwarded ?? 'N/A'} / ${r.marks}`).join('\n\n')

  const userMessage = `Here is the full round of ${results.length} questions, with the student's answers and marks awarded:

${resultsBlock}`

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
        max_tokens: 1200,
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
