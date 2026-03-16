'use client'

import { useState } from 'react'
import { PlatformId, ContentTone } from '@/lib/platforms'
import { GenerateRequest, GenerateResponse } from '@/lib/types'

const TONES: { value: ContentTone; label: string; emoji: string }[] = [
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'casual', label: 'Casual', emoji: '😊' },
  { value: 'humorous', label: 'Humorous', emoji: '😄' },
  { value: 'inspirational', label: 'Inspirational', emoji: '✨' },
  { value: 'educational', label: 'Educational', emoji: '📚' },
  { value: 'promotional', label: 'Promotional', emoji: '📣' },
]

interface Props {
  selectedPlatforms: PlatformId[]
  onGenerated: (result: GenerateResponse) => void
}

export function AIAssistant({ selectedPlatforms, onGenerated }: Props) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<ContentTone>('professional')
  const [keywords, setKeywords] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [callToAction, setCallToAction] = useState('')
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or message')
      return
    }
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform')
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload: GenerateRequest = {
        topic: topic.trim(),
        tone,
        platforms: selectedPlatforms,
        keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        targetAudience: targetAudience.trim() || undefined,
        callToAction: callToAction.trim() || undefined,
        includeHashtags,
        includeEmojis,
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      onGenerated(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🤖</span>
        <h2 className="font-semibold text-gray-900">AI Content Generator</h2>
        <span className="badge bg-purple-100 text-purple-700 ml-auto">Claude Opus 4.6</span>
      </div>

      {/* Topic */}
      <div>
        <label className="label">Topic / Main message *</label>
        <textarea
          className="input min-h-[80px] resize-none"
          placeholder="e.g. We just launched a new feature that helps teams collaborate faster..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      {/* Tone */}
      <div>
        <label className="label">Brand tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                tone === t.value
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Keywords (comma-separated)</label>
          <input
            className="input"
            placeholder="innovation, collaboration, growth"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Target audience</label>
          <input
            className="input"
            placeholder="startup founders, marketers, developers"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label">Call to action</label>
        <input
          className="input"
          placeholder="Visit our website, Sign up for free, Share with a friend"
          value={callToAction}
          onChange={(e) => setCallToAction(e.target.value)}
        />
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeHashtags}
            onChange={(e) => setIncludeHashtags(e.target.checked)}
            className="rounded"
          />
          <span className="text-gray-600">Include hashtags</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeEmojis}
            onChange={(e) => setIncludeEmojis(e.target.checked)}
            className="rounded"
          />
          <span className="text-gray-600">Include emojis</span>
        </label>
      </div>

      {/* Platforms indicator */}
      {selectedPlatforms.length === 0 && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          Select at least one platform above to enable generation.
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !topic.trim() || selectedPlatforms.length === 0}
        className="btn-primary w-full justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating with Claude…
          </>
        ) : (
          '✨ Generate Platform-Optimized Posts'
        )}
      </button>
    </div>
  )
}
