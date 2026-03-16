import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { platformPosts: true },
    })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      ...post,
      platforms: JSON.parse(post.platforms || '[]'),
      hashtags: JSON.parse(post.hashtags || '[]'),
      mentions: JSON.parse(post.mentions || '[]'),
      mediaUrls: JSON.parse(post.mediaUrls || '[]'),
      platformPosts: post.platformPosts.map((pp) => ({
        ...pp,
        analytics: pp.analytics ? JSON.parse(pp.analytics) : null,
      })),
    })
  } catch (err) {
    console.error('GET /api/posts/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { status, scheduledAt, content, title } = body

    const updates: Record<string, unknown> = {}
    if (status) updates.status = status
    if (scheduledAt !== undefined) updates.scheduledAt = scheduledAt ? new Date(scheduledAt) : null
    if (content) updates.content = content
    if (title !== undefined) updates.title = title

    const post = await prisma.post.update({
      where: { id: params.id },
      data: updates,
      include: { platformPosts: true },
    })

    return NextResponse.json({
      ...post,
      platforms: JSON.parse(post.platforms || '[]'),
      hashtags: JSON.parse(post.hashtags || '[]'),
    })
  } catch (err) {
    console.error('PATCH /api/posts/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.post.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/posts/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
