import Link from 'next/link'
import { prisma } from '@/lib/db'
import { StatusBadge } from '@/components/StatusBadge'
import { PLATFORMS, PlatformId } from '@/lib/platforms'
import { formatDistanceToNow } from 'date-fns'

async function getStats() {
  const [total, drafted, scheduled, published, failed, recentPosts, platformCounts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.post.count({ where: { status: 'SCHEDULED' } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'FAILED' } }),
      prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { platformPosts: { select: { platform: true, status: true } } },
      }),
      prisma.platformPost.groupBy({ by: ['platform'], _count: { id: true } }),
    ])

  return { total, drafted, scheduled, published, failed, recentPosts, platformCounts }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const statCards = [
    { label: 'Total Posts', value: stats.total, color: 'text-gray-900', bg: 'bg-gray-50' },
    { label: 'Drafts', value: stats.drafted, color: 'text-gray-600', bg: 'bg-gray-50' },
    { label: 'Scheduled', value: stats.scheduled, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Published', value: stats.published, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Failed', value: stats.failed, color: 'text-red-700', bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered social media management</p>
        </div>
        <Link href="/compose" className="btn-primary">
          + Compose New Post
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent posts */}
        <div className="lg:col-span-2 card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Posts</h2>
            <Link href="/scheduled" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentPosts.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">
                No posts yet.{' '}
                <Link href="/compose" className="text-blue-600 hover:underline">
                  Create your first post
                </Link>
              </div>
            ) : (
              stats.recentPosts.map((post) => {
                const platforms: PlatformId[] = JSON.parse(post.platforms || '[]')
                return (
                  <div key={post.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 truncate">
                          {post.title || post.content.slice(0, 80)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={post.status} />
                          {platforms.map((pid) => {
                            const pl = PLATFORMS[pid]
                            return pl ? (
                              <span key={pid} className="text-xs text-gray-400">
                                {pl.icon} {pl.name}
                              </span>
                            ) : null
                          })}
                          {post.aiGenerated && (
                            <span className="badge bg-purple-50 text-purple-600">AI</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Platform Breakdown</h2>
          </div>
          <div className="p-5 space-y-3">
            {stats.platformCounts.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet</p>
            ) : (
              stats.platformCounts
                .sort((a, b) => b._count.id - a._count.id)
                .map((pc) => {
                  const pl = PLATFORMS[pc.platform as PlatformId]
                  const maxCount = Math.max(...stats.platformCounts.map((p) => p._count.id))
                  const pct = maxCount > 0 ? (pc._count.id / maxCount) * 100 : 0
                  return (
                    <div key={pc.platform}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700">
                          {pl?.icon} {pl?.name || pc.platform}
                        </span>
                        <span className="font-medium">{pc._count.id}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })
            )}
          </div>

          {/* Quick links */}
          <div className="px-5 pb-5 space-y-2">
            <Link href="/compose" className="btn-primary w-full justify-center text-xs py-2">
              + New Post
            </Link>
            <Link href="/guidelines" className="btn-secondary w-full justify-center text-xs py-2">
              Platform Guidelines
            </Link>
          </div>
        </div>
      </div>

      {/* Quick tips banner */}
      <div className="card p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2">2025–2026 Posting Best Practices</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <span>📱</span>
            <span>Reels/Shorts get 3× more organic reach than static posts on most platforms.</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🕐</span>
            <span>Tue–Thu 9 AM–12 PM remains the universal peak engagement window.</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🤖</span>
            <span>AI-disclosed content performs equally well when clearly labeled.</span>
          </div>
          <div className="flex items-start gap-2">
            <span>#️⃣</span>
            <span>Threads now suppresses hashtags — focus on keyword-rich copy instead.</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🔗</span>
            <span>LinkedIn native documents get 5× more engagement than external links.</span>
          </div>
          <div className="flex items-start gap-2">
            <span>♿</span>
            <span>Alt text on every image boosts SEO and meets accessibility standards.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
