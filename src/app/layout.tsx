import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI First Responder — Social Media Hub',
  description: 'AI-powered social media posting system with platform-specific guidelines for 2025–2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
            {children}
          </main>
          <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
            AI First Responder &mdash; Social Media Posting System &mdash; Guidelines updated 2025–2026
          </footer>
        </div>
      </body>
    </html>
  )
}
