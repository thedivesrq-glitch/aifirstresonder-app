import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreatePostRequest } from '@/lib/types'
import { PlatformId } from '@/lib/platforms'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const posts = await prisma.post.findMany({
      where,
      include: { platformPosts: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.post.count({ where })

    // Transform JSON strings back to arrays
    const transformed = posts.map((p) => ({
      ...p,
      platforms: JSON.parse(p.platforms || '[]'),
      hashtags: JSON.parse(p.hashtags || '[]'),
      mentions: JSON.parse(p.mentions || '[]'),
      mediaUrls: JSON.parse(p.mediaUrls || '[]'),
      platformPosts: p.platformPosts
        .filter((pp) => !platform || pp.platform === platform)
        .map((pp) => ({
          ...pp,
          analytics: pp.analytics ? JSON.parse(pp.analytics) : null,
        })),
    }))

    return NextResponse.json({ posts: transformed, total })
  } catch (err) {
    console.error('GET /api/posts error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreatePostRequest = await req.json()
    const {
      content,
      platforms,
      scheduledAt,
      platformContent,
      hashtags,
      mentions,
      mediaUrls,
      tone,
      topic,
      aiGenerated,
      title,
    } = body

    if (!content || !platforms?.length) {
      return NextResponse.json({ error: 'content and platforms are required' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title: title || null,
        content,
        platforms: JSON.stringify(platforms),
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        hashtags: JSON.stringify(hashtags || []),
        mentions: JSON.stringify(mentions || []),
        mediaUrls: JSON.stringify(mediaUrls || []),
        tone: tone || null,
        topic: topic || null,
        aiGenerated: aiGenerated || false,
        platformPosts: {
          create: (platforms as PlatformId[]).map((pid) => ({
            platform: pid,
            content: platformContent?.[pid] || content,
            status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
          })),
        },
      },
      include: { platformPosts: true },
    })

    // If scheduled, create a job record
    if (scheduledAt) {
      await prisma.scheduledJob.upsert({
        where: { postId: post.id },
        update: { scheduledAt: new Date(scheduledAt), executed: false },
        create: { postId: post.id, scheduledAt: new Date(scheduledAt) },
      })
    }

    return NextResponse.json({
      ...post,
      platforms: JSON.parse(post.platforms),
      hashtags: JSON.parse(post.hashtags || '[]'),
      mentions: JSON.parse(post.mentions || '[]'),
      mediaUrls: JSON.parse(post.mediaUrls || '[]'),
    }, { status: 201 })
  } catch (err) {
    console.error('POST /api/posts error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
