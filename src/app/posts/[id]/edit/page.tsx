'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { PostPreview } from '@/components/PostPreview'
import { StatusBadge } from '@/components/StatusBadge'
import { PLATFORMS, PlatformId } from '@/lib/platforms'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [post, setPost] = useState<Record<string, unknown> | null>(null)
  const [platformContent, setPlatformContent] = useState<Partial<Record<PlatformId, string>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [optimizing, setOptimizing] = useState<PlatformId | null>(null)

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data)
        const content: Partial<Record<PlatformId, string>> = {}
        for (const pp of (data.platformPosts || []) as { platform: string; content: string }[]) {
          content[pp.platform as PlatformId] = pp.content
        }
        setPlatformContent(content)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleOptimize = async (pid: PlatformId) => {
    const content = platformContent[pid] || (post?.content as string) || ''
    if (!content) return
    setOptimizing(pid)
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform: pid }),
      })
      const data = await res.json()
      if (data.optimized) {
        setPlatformContent((prev) => ({ ...prev, [pid]: data.optimized }))
      }
    } finally {
      setOptimizing(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: Object.values(platformContent)[0] || post?.content }),
      })
      if (!res.ok) throw new Error('Save failed')
      router.push('/scheduled')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>
  if (!post) return <div className="p-8 text-center text-gray-400">Post not found</div>

  const platforms = (post.platforms as PlatformId[]) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={post.status as string} />
            {(post.aiGenerated as boolean) && (
              <span className="badge bg-purple-50 text-purple-700">🤖 AI generated</span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((pid) => (
          <PostPreview
            key={pid}
            platform={pid}
            content={platformContent[pid] || (post.content as string) || ''}
            onEdit={(text) => setPlatformContent((prev) => ({ ...prev, [pid]: text }))}
            onOptimize={() => handleOptimize(pid)}
            loading={optimizing === pid}
          />
        ))}
      </div>
    </div>
  )
}
