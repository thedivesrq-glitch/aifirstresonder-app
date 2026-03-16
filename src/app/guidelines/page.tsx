import { PlatformGuidelines } from '@/components/PlatformGuidelines'
import { ALL_PLATFORMS } from '@/lib/platforms'

export default function GuidelinesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Guidelines</h1>
        <p className="text-sm text-gray-500 mt-1">
          2025–2026 social media specifications, limits, and best practices
        </p>
      </div>

      {/* Summary table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Platform</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Char limit</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Hashtags</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Links</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Max images</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Max video</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Best times</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ALL_PLATFORMS.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <span className="mr-1.5">{p.icon}</span>{p.name}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {p.charLimit.toLocaleString()}
                  {p.charLimitPremium && (
                    <span className="text-xs text-gray-400 ml-1">({p.charLimitPremium.toLocaleString()} ★)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {p.hashtagLimit === 0 ? (
                    <span className="text-red-500 text-xs">None</span>
                  ) : (
                    <>max {p.hashtagLimit} <span className="text-gray-400">(rec. {p.recommendedHashtags})</span></>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {p.linkAllowed ? (
                    <span className="text-green-600">✓</span>
                  ) : p.linkInBioOnly ? (
                    <span className="text-amber-500 text-xs">Bio only</span>
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">{p.media.maxImages || '—'}</td>
                <td className="px-4 py-3 text-right">
                  {p.media.maxVideoLengthSec > 0 ? `${p.media.maxVideoLengthSec}s` : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.bestPostTimes[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed guidelines with tabs */}
      <PlatformGuidelines />

      {/* Compliance note */}
      <div className="card p-5 bg-amber-50 border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-2">Important Compliance Notes</h3>
        <ul className="space-y-1.5 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <span className="shrink-0">⚖️</span>
            AI-generated content must be disclosed per FTC guidelines (2024) and Meta/TikTok platform policies.
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🔒</span>
            Do not post personally identifiable information (PII) without explicit consent — GDPR & CCPA apply.
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">©️</span>
            Verify you have rights to all media before posting. Copyright violations can result in account suspension.
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🏥</span>
            Health and medical claims require licensed professional review before publishing on any platform.
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">💰</span>
            Sponsored content must be clearly labeled (#ad, #sponsored) per FTC and platform rules.
          </li>
        </ul>
      </div>
    </div>
  )
}
