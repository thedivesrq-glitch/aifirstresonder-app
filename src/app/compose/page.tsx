'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlatformSelector } from '@/components/PlatformSelector'
import { AIAssistant } from '@/components/AIAssistant'
import { PostPreview } from '@/components/PostPreview'
import { PlatformId, PLATFORMS } from '@/lib/platforms'
import { GenerateResponse } from '@/lib/types'

export default function ComposePage() {
  const router = useRouter()
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([])
  const [platformContent, setPlatformContent] = useState<Partial<Record<PlatformId, string>>>({})
  const [baseContent, setBaseContent] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [saving, setSaving] = useState(false)
  const [optimizing, setOptimizing] = useState<PlatformId | null>(null)
  const [saveError, setSaveError] = useState('')
  const [tab, setTab] = useState<'ai' | 'manual'>('ai')

  const handleGenerated = (result: GenerateResponse) => {
    const newContent: Partial<Record<PlatformId, string>> = {}
    for (const [pid, text] of Object.entries(result.posts)) {
      newContent[pid as PlatformId] = text
    }
    setPlatformContent(newContent)
    setHashtags(result.suggestedHashtags)
    // Set base content from first available platform
    const first = selectedPlatforms[0]
    if (first && result.posts[first]) {
      setBaseContent(result.posts[first])
    }
    if (result.contentWarnings?.length) {
      alert('Content warnings:\n' + result.contentWarnings.join('\n'))
    }
  }

  const handlePlatformContentChange = (pid: PlatformId, text: string) => {
    setPlatformContent((prev) => ({ ...prev, [pid]: text }))
  }

  const handleOptimize = async (pid: PlatformId) => {
    const content = platformContent[pid] || baseContent
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
    } catch {
      // Silently fail optimize
    } finally {
      setOptimizing(null)
    }
  }

  const handleSave = async (asDraft: boolean) => {
    if (selectedPlatforms.length === 0) {
      setSaveError('Select at least one platform')
      return
    }

    const primaryContent = selectedPlatforms
      .map((pid) => platformContent[pid])
      .find(Boolean) || baseContent

    if (!primaryContent) {
      setSaveError('Write or generate some content first')
      return
    }

    setSaving(true)
    setSaveError('')

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || undefined,
          content: primaryContent,
          platforms: selectedPlatforms,
          platformContent,
          hashtags,
          scheduledAt: !asDraft && scheduledAt ? scheduledAt : undefined,
          aiGenerated: Object.keys(platformContent).length > 0,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }

      router.push('/scheduled')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Compose Post</h1>
      </div>

      {/* Platform selector */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-3">1. Select Platforms</h2>
        <PlatformSelector selected={selectedPlatforms} onChange={setSelectedPlatforms} />
        {selectedPlatforms.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''} selected — AI will optimize content for each.
          </p>
        )}
      </div>

      {/* Optional title */}
      <div className="card p-5">
        <label className="label">Post title (internal reference, optional)</label>
        <input
          className="input"
          placeholder="Q1 product launch announcement"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Content creation */}
      <div>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTab('ai')}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 transition-colors ${
              tab === 'ai' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🤖 AI Generate
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 transition-colors ${
              tab === 'manual' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ✏️ Write Manually
          </button>
        </div>

        {tab === 'ai' ? (
          <AIAssistant selectedPlatforms={selectedPlatforms} onGenerated={handleGenerated} />
        ) : (
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-3">2. Write Your Content</h2>
            <textarea
              className="input min-h-[140px] resize-none"
              placeholder="Write your post content here. The AI can then optimize it per platform."
              value={baseContent}
              onChange={(e) => setBaseContent(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-2">
              Use the ✨ AI Optimize button on each platform preview below to adapt this content.
            </p>
          </div>
        )}
      </div>

      {/* Per-platform previews */}
      {selectedPlatforms.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">
            3. Review & Edit Platform Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedPlatforms.map((pid) => (
              <PostPreview
                key={pid}
                platform={pid}
                content={platformContent[pid] || baseContent || ''}
                onEdit={(text) => handlePlatformContentChange(pid, text)}
                onOptimize={() => handleOptimize(pid)}
                loading={optimizing === pid}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hashtags suggestions */}
      {hashtags.length > 0 && (
        <div className="card p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Suggested hashtags</p>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span key={tag} className="badge bg-blue-50 text-blue-700">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Schedule & Save */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-3">4. Schedule or Save</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1">
            <label className="label">Schedule for (optional)</label>
            <input
              type="datetime-local"
              className="input"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="btn-secondary"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving…' : scheduledAt ? 'Schedule Post' : 'Save Post'}
            </button>
          </div>
        </div>
        {saveError && (
          <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {saveError}
          </p>
        )}
      </div>
    </div>
  )
}
