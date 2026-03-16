import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PLATFORMS, PlatformId } from '@/lib/platforms'
import { GenerateRequest, GenerateResponse } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()
    const { topic, tone, platforms, keywords, targetAudience, callToAction, includeHashtags, includeEmojis } = body

    if (!topic || !tone || !platforms?.length) {
      return NextResponse.json({ error: 'topic, tone, and platforms are required' }, { status: 400 })
    }

    // Build platform-specific guidelines string for the prompt
    const platformGuidelinesText = platforms
      .map((pid) => {
        const p = PLATFORMS[pid as PlatformId]
        if (!p) return ''
        return `
### ${p.name}
- Character limit: ${p.charLimit}${p.charLimitPremium ? ` (premium: ${p.charLimitPremium})` : ''}
- Recommended hashtags: ${p.recommendedHashtags}${p.hashtagLimit === 0 ? ' (NO hashtags on this platform)' : ''}
- Links: ${p.linkAllowed ? 'Allowed' : p.linkInBioOnly ? 'Only in bio — do NOT include links in post' : 'Not allowed'}
- Audience: ${p.audienceNotes}
- Top content tips: ${p.contentTips.slice(0, 3).join(' | ')}`.trim()
      })
      .filter(Boolean)
      .join('\n\n')

    const systemPrompt = `You are an expert social media content strategist specializing in platform-optimized posting. You create compelling, platform-native content that maximizes engagement and reach while strictly following each platform's guidelines and best practices as of 2025–2026.

For every platform you generate content for:
1. Stay within the character limit — count carefully
2. Match the native tone and format of the platform
3. Use the recommended number of hashtags (never exceed, never use hashtags on platforms that don't support them like Threads)
4. Apply the content tips for that platform
5. Never hallucinate statistics or make false claims
6. Keep brand voice consistent while adapting style per platform`

    const userPrompt = `Generate platform-optimized social media posts for the following brief:

**Topic / Main message:** ${topic}
**Brand tone:** ${tone}
**Target audience:** ${targetAudience || 'General audience'}
**Keywords to include:** ${keywords?.join(', ') || 'None specified'}
**Call to action:** ${callToAction || 'None specified'}
**Include hashtags:** ${includeHashtags !== false ? 'Yes, use recommended count per platform' : 'No'}
**Include emojis:** ${includeEmojis !== false ? 'Yes, where appropriate' : 'No'}

## Platform Guidelines to Follow

${platformGuidelinesText}

## Output Format

Return ONLY a valid JSON object (no markdown code fences, no explanation) with this exact structure:
{
  "posts": {
    ${platforms.map((pid) => `"${pid}": "...platform-specific post content..."`).join(',\n    ')}
  },
  "suggestedHashtags": ["hashtag1", "hashtag2", ...],
  "suggestedEmojis": ["emoji1", "emoji2", ...],
  "contentWarnings": []
}

Each post value must be the complete post text, ready to publish. The "suggestedHashtags" and "suggestedEmojis" are extras the user can add. "contentWarnings" should list any policy concerns if the topic touches sensitive areas (empty array if none).`

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    // Extract the text block (thinking blocks appear first)
    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response from AI' }, { status: 500 })
    }

    // Strip any accidental markdown fences
    let raw = textBlock.text.trim()
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')

    let result: GenerateResponse
    try {
      result = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'AI returned invalid JSON', raw }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('Generate API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
