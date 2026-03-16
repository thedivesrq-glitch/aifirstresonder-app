'use client'

import { getCharLimit, getCharWarning, PlatformId } from '@/lib/platforms'
import clsx from 'clsx'

interface Props {
  platform: PlatformId
  text: string
}

export function CharCounter({ platform, text }: Props) {
  const limit = getCharLimit(platform)
  const count = text.length
  const remaining = limit - count
  const status = getCharWarning(platform, text)

  return (
    <span
      className={clsx(
        'text-xs font-mono tabular-nums',
        status === 'ok' && 'text-gray-400',
        status === 'warning' && 'text-amber-500',
        status === 'over' && 'text-red-600 font-semibold'
      )}
    >
      {remaining < 0 ? `+${Math.abs(remaining)} over` : `${remaining} left`} / {limit}
    </span>
  )
}
