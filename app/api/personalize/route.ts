import { NextRequest } from 'next/server'

// ─── Base bio ─────────────────────────────────────────────────────────────────
// Updated to match the new portfolio voice — direct, specific, outcome-framed.
// This is what Claude rewrites from when tailoring for a specific role.
const BASE_BIO = `
Zach McEntire is a Full-Stack & AI Engineer with 5+ years spanning product engineering, Technical Account Management, and agentic AI systems.

He builds agentic systems, cloud-native APIs, and the support tooling that keeps them running — then supports the engineers who depend on them. His background means he can ship the feature, debug the integration, and explain both to a customer on the same day.

Recent work:
- TigerData: live agentic fitness tracker using Claude tool-use agents, TimescaleDB hypertables, FastAPI, and Railway. Natural-language workout ingestion → structured time-series data → real-time 1RM projections.
- HotZone: Firebase-backed field resource app for firefighters and paramedics. Designed for high-pressure, two-tap-max UX with offline persistence and county-filtered drug protocols.
- Poly Platform: Angular/TypeScript social event scheduling platform. Built reusable action card components, navigation systems, and interest-based content discovery.
- Personal podcast pipeline: Claude API + ElevenLabs for Gmail newsletter ingestion → LLM script generation → TTS synthesis → RSS delivery. Fully automated agentic workflow.

Technical stack: React, Next.js, Angular, TypeScript, Python, FastAPI, Node.js, C#/.NET, Claude API (tool-use agents), TimescaleDB, PostgreSQL, MongoDB, Firebase, GitHub Actions, Railway, Vercel, Netlify, Linux, Bash scripting.

Support & systems experience: Technical Account Management, enterprise storage, networking, Windows/macOS/Linux debugging, escalation workflows, technical documentation.

Targeting: Support Engineering, Full-Stack / Backend Engineering, Solutions Engineering. Based in Salt Lake City, open to remote.
`.trim()

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM = `You are a precise resume writer helping a software engineer tailor his professional bio for specific roles.

Rules:
- Output ONLY the rewritten summary. No preamble, no labels, no explanation, no quotes around the output.
- 3–4 sentences maximum. Every sentence must earn its place.
- Third person ("Zach" not "I").
- Mirror the exact language and priority signals in the job description — if the JD says "observability" use that word, not "monitoring".
- Lead with the most relevant aspect of Zach's background for THIS role.
- Name 2–3 specific technologies from his stack that match the role. Do not list more than 3 technologies.
- Sound like a confident human wrote it, not an AI doing keyword insertion.
- If the role has a specific domain (security, DevOps, customer success, AI/ML, etc.), lean into whichever part of Zach's experience maps to that domain.`

export async function POST(req: NextRequest) {
  const { jobDescription, roleHint } = await req.json()

  if (!jobDescription?.trim()) {
    return new Response('Job description is required', { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response('API key not configured', { status: 500 })
  }

  const hintLine = roleHint?.trim()
    ? `\n\nRole targeting hint from Zach: "${roleHint.trim()}"`
    : ''

  const userMessage = `Here is Zach's base bio and experience:\n${BASE_BIO}\n\nHere is the job description:\n${jobDescription}${hintLine}\n\nRewrite Zach's professional summary for this specific role.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',  // fast enough for streaming UX
      max_tokens: 350,
      stream:     true,
      system:     SYSTEM,
      messages:   [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const err = await response.text().catch(() => 'unknown error')
    console.error('Claude API error:', response.status, err)
    return new Response('Claude API error', { status: 500 })
  }

  // ── SSE → plain text stream ────────────────────────────────────────────────
  // Extract text deltas from Claude's SSE stream and forward as plain UTF-8.
  // The client reads this as a ReadableStream and appends chunks to state.
  const { readable, writable } = new TransformStream()
  const writer  = writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  ;(async () => {
    const reader = response.body!.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]' || !data) continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              await writer.write(encoder.encode(parsed.delta.text))
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      console.error('Stream read error:', err)
    } finally {
      await writer.close().catch(() => {})
    }
  })()

  return new Response(readable, {
    headers: {
      'Content-Type':  'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}