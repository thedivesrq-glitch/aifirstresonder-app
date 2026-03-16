import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [total, drafted, scheduled, published, failed, platformCounts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.post.count({ where: { status: 'SCHEDULED' } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'FAILED' } }),
      prisma.platformPost.groupBy({ by: ['platform'], _count: { id: true } }),
    ])

    const recentPosts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { platformPosts: true },
    })

    return NextResponse.json({
      total,
      drafted,
      scheduled,
      published,
      failed,
      platformBreakdown: platformCounts.map((pc) => ({
        platform: pc.platform,
        count: pc._count.id,
      })),
      recentPosts: recentPosts.map((p) => ({
        ...p,
        platforms: JSON.parse(p.platforms || '[]'),
        hashtags: JSON.parse(p.hashtags || '[]'),
      })),
    })
  } catch (err) {
    console.error('Stats API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
