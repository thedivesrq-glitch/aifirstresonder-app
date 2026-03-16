'use client'

import { PLATFORMS, PlatformId } from '@/lib/platforms'
import { CharCounter } from './CharCounter'
import clsx from 'clsx'

interface Props {
  platform: PlatformId
  content: string
  onEdit?: (content: string) => void
  onOptimize?: () => void
  loading?: boolean
}

export function PostPreview({ platform, content, onEdit, onOptimize, loading }: Props) {
  const p = PLATFORMS[platform]

  return (
    <div className="card overflow-hidden">
      {/* Platform header */}
      <div className={clsx('px-4 py-2.5 flex items-center gap-2 text-sm font-semibold', p.color, p.textColor)}>
        <span className="text-lg leading-none">{p.icon}</span>
        <span>{p.name}</span>
        <div className="ml-auto">
          <CharCounter platform={platform} text={content} />
        </div>
      </div>

      {/* Content area */}
      {onEdit ? (
        <textarea
          className="w-full px-4 py-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-0 min-h-[100px]"
          value={content}
          onChange={(e) => onEdit(e.target.value)}
          placeholder={`Write your ${p.name} post here...`}
        />
      ) : (
        <div className="px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap min-h-[80px]">
          {content || <span className="text-gray-400 italic">No content yet</span>}
        </div>
      )}

      {/* Footer */}
      {onOptimize && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
          <span className="text-xs text-gray-400">{p.recommendedHashtags > 0 ? `Recommended hashtags: ${p.recommendedHashtags}` : 'No hashtags on this platform'}</span>
          <button
            onClick={onOptimize}
            disabled={loading || !content}
            className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-40"
          >
            {loading ? 'Optimizing…' : '✨ AI Optimize'}
          </button>
        </div>
      )}
    </div>
  )
}
