'use client'

import { useState } from 'react'
import { ALL_PLATFORMS, PlatformGuideline, PlatformId } from '@/lib/platforms'
import clsx from 'clsx'

export function PlatformGuidelines() {
  const [active, setActive] = useState<PlatformId>('twitter')
  const p: PlatformGuideline = ALL_PLATFORMS.find((pl) => pl.id === active)!

  return (
    <div className="card overflow-hidden">
      {/* Tab bar */}
      <div className="border-b border-gray-200 bg-gray-50 flex overflow-x-auto">
        {ALL_PLATFORMS.map((pl) => (
          <button
            key={pl.id}
            onClick={() => setActive(pl.id)}
            className={clsx(
              'px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors',
              active === pl.id
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <span className="mr-1">{pl.icon}</span> {pl.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: specs */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-lg">{p.icon}</span> {p.name} — 2025–2026 Specs
          </h3>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <dt className="text-gray-500">Character limit</dt>
              <dd className="font-medium">{p.charLimit.toLocaleString()}{p.charLimitPremium ? ` / ${p.charLimitPremium.toLocaleString()} (premium)` : ''}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <dt className="text-gray-500">Hashtags</dt>
              <dd className="font-medium">{p.hashtagLimit === 0 ? 'Not supported' : `Max ${p.hashtagLimit} (rec. ${p.recommendedHashtags})`}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <dt className="text-gray-500">Links</dt>
              <dd className="font-medium">{p.linkAllowed ? 'Allowed' : p.linkInBioOnly ? 'Bio only' : 'Not allowed'}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <dt className="text-gray-500">Max images</dt>
              <dd className="font-medium">{p.media.maxImages || 'N/A'}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <dt className="text-gray-500">Max video length</dt>
              <dd className="font-medium">{p.media.maxVideoLengthSec > 0 ? `${p.media.maxVideoLengthSec}s` : 'N/A'}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <dt className="text-gray-500">Image aspect</dt>
              <dd className="font-medium">{p.media.recommendedImageAspect}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <dt className="text-gray-500">Best times</dt>
              <dd className="font-medium text-right max-w-[55%]">{p.bestPostTimes.join(', ')}</dd>
            </div>
          </dl>
        </div>

        {/* Right: tips */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Audience</h4>
            <p className="text-sm text-gray-600">{p.audienceNotes}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Content Tips</h4>
            <ul className="space-y-1.5">
              {p.contentTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-red-600 mb-2">Prohibited</h4>
            <ul className="space-y-1">
              {p.banned.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                  <span className="shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
