import Link from 'next/link'
import { prisma } from '@/lib/db'
import { StatusBadge } from '@/components/StatusBadge'
import { PLATFORMS, PlatformId } from '@/lib/platforms'
import { format, isPast, isFuture } from 'date-fns'

async function getPosts(filter: string) {
  const where: Record<string, unknown> = {}

  if (filter === 'draft') where.status = 'DRAFT'
  else if (filter === 'scheduled') where.status = 'SCHEDULED'
  else if (filter === 'published') where.status = 'PUBLISHED'

  const posts = await prisma.post.findMany({
    where,
    include: { platformPosts: { select: { platform: true, status: true } } },
    orderBy: [{ scheduledAt: 'asc' }, { createdAt: 'desc' }],
    take: 50,
  })

  return posts.map((p) => ({
    ...p,
    platforms: JSON.parse(p.platforms || '[]') as PlatformId[],
    hashtags: JSON.parse(p.hashtags || '[]') as string[],
  }))
}

interface Props {
  searchParams: { filter?: string }
}

export default async function ScheduledPage({ searchParams }: Props) {
  const filter = searchParams.filter || 'all'
  const posts = await getPosts(filter)

  const FILTERS = [
    { value: 'all', label: 'All Posts' },
    { value: 'draft', label: 'Drafts' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'published', label: 'Published' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Link href="/compose" className="btn-primary">+ Compose</Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/scheduled?filter=${f.value}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              filter === f.value
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg font-medium">No posts found</p>
          <p className="text-sm mt-1">
            <Link href="/compose" className="text-blue-600 hover:underline">Create your first post</Link>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="card px-5 py-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <StatusBadge status={post.status} />
                    {post.aiGenerated && (
                      <span className="badge bg-purple-50 text-purple-700">🤖 AI</span>
                    )}
                    {post.platforms.map((pid) => {
                      const pl = PLATFORMS[pid]
                      return pl ? (
                        <span key={pid} className="badge bg-gray-100 text-gray-600">
                          {pl.icon} {pl.name}
                        </span>
                      ) : null
                    })}
                  </div>

                  {post.title && (
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">{post.title}</p>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.content}
                  </p>

                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.hashtags.slice(0, 5).map((tag) => (
                        <span key={tag} className="text-xs text-blue-500">#{tag}</span>
                      ))}
                      {post.hashtags.length > 5 && (
                        <span className="text-xs text-gray-400">+{post.hashtags.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="text-right shrink-0 space-y-1">
                  {post.scheduledAt && (
                    <div className={`text-xs font-medium ${isFuture(post.scheduledAt) ? 'text-blue-600' : 'text-gray-400'}`}>
                      {isFuture(post.scheduledAt) ? '⏰ ' : ''}
                      {format(post.scheduledAt, 'MMM d, h:mm a')}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    Created {format(post.createdAt, 'MMM d, yyyy')}
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <PostDeleteButton postId={post.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Inline client component for delete
function PostDeleteButton({ postId }: { postId: string }) {
  return (
    <form action={`/api/posts/${postId}`} method="DELETE">
      <button
        type="submit"
        formAction={`/api/posts/${postId}`}
        className="text-xs text-red-500 hover:underline"
        onClick={async (e) => {
          e.preventDefault()
          if (!confirm('Delete this post?')) return
          await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
          window.location.reload()
        }}
      >
        Delete
      </button>
    </form>
  )
}
