import clsx from 'clsx'

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  DRAFT: { label: 'Draft', classes: 'bg-gray-100 text-gray-600' },
  SCHEDULED: { label: 'Scheduled', classes: 'bg-blue-100 text-blue-700' },
  PUBLISHING: { label: 'Publishing…', classes: 'bg-yellow-100 text-yellow-700' },
  PUBLISHED: { label: 'Published', classes: 'bg-green-100 text-green-700' },
  FAILED: { label: 'Failed', classes: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-500' },
}

interface Props {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: Props) {
  const config = STATUS_CONFIG[status] || { label: status, classes: 'bg-gray-100 text-gray-600' }
  return (
    <span className={clsx('badge', config.classes, className)}>
      {config.label}
    </span>
  )
}
