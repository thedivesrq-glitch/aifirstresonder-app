/**
 * POST /api/optimize
 * Takes existing content and optimizes it for a specific platform,
 * returning a rewritten version that adheres to 2025–2026 guidelines.
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PLATFORMS, PlatformId } from '@/lib/platforms'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { content, platform, keepHashtags } = await req.json()

    if (!content || !platform) {
      return NextResponse.json({ error: 'content and platform are required' }, { status: 400 })
    }

    const p = PLATFORMS[platform as PlatformId]
    if (!p) {
      return NextResponse.json({ error: `Unknown platform: ${platform}` }, { status: 400 })
    }

    const prompt = `Rewrite the following content to be perfectly optimized for ${p.name}:

Original content:
"""
${content}
"""

Platform rules to follow STRICTLY:
- Character limit: ${p.charLimit} (current content is ${content.length} chars)
- Hashtags: ${p.hashtagLimit === 0 ? 'NONE — this platform does not use hashtags, remove all' : `max ${p.hashtagLimit}, recommended ${p.recommendedHashtags}`}
- Links: ${p.linkAllowed ? 'allowed' : p.linkInBioOnly ? 'NOT in post — only in bio' : 'NOT allowed — remove any links'}
- Audience: ${p.audienceNotes}
- Key tip 1: ${p.contentTips[0]}
- Key tip 2: ${p.contentTips[1]}
- Key tip 3: ${p.contentTips[2]}

${keepHashtags === false ? 'Remove ALL hashtags from the output.' : ''}

Return ONLY the optimized post text — no explanation, no labels, no quotes.`

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response from AI' }, { status: 500 })
    }

    return NextResponse.json({
      optimized: textBlock.text.trim(),
      platform,
      charCount: textBlock.text.trim().length,
      charLimit: p.charLimit,
    })
  } catch (err) {
    console.error('Optimize API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
