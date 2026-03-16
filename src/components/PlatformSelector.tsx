'use client'

import { ALL_PLATFORMS, PlatformId } from '@/lib/platforms'
import clsx from 'clsx'

interface Props {
  selected: PlatformId[]
  onChange: (platforms: PlatformId[]) => void
  disabled?: boolean
}

export function PlatformSelector({ selected, onChange, disabled }: Props) {
  const toggle = (id: PlatformId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_PLATFORMS.map((p) => {
        const active = selected.includes(p.id)
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => toggle(p.id)}
            disabled={disabled}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
              active
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm scale-105'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            )}
          >
            <span className="text-sm leading-none">{p.icon}</span>
            {p.name}
          </button>
        )
      })}
    </div>
  )
}
