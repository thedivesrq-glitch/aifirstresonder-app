'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/compose', label: 'Compose' },
  { href: '/scheduled', label: 'Scheduled' },
  { href: '/guidelines', label: 'Guidelines' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center h-14 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-600 text-sm shrink-0">
            <span className="text-xl">🚀</span>
            <span>AI First Responder</span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="ml-auto">
            <Link href="/compose" className="btn-primary text-xs py-1.5 px-3">
              + New Post
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
