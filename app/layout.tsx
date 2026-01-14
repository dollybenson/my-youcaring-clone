import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YouCaring Clone',
  description: 'Compassionate Crowdfunding',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {/* PROFESSIONAL NAVBAR */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            {/* Logo Area */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl font-bold text-purple-700 tracking-tight">
                You<span className="text-gray-700">Caring</span>
              </div>
            </Link>

            {/* Right Menu */}
            <div className="flex items-center gap-6">
              <span className="hidden md:block text-gray-600 font-medium hover:text-purple-700 cursor-pointer">Search</span>
              <span className="hidden md:block text-gray-600 font-medium hover:text-purple-700 cursor-pointer">Sign In</span>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full font-bold transition-colors">
                Start a Fundraiser
              </button>
            </div>
          </div>
        </nav>

        {children}

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white mt-20 py-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-400">© 2024 YouCaring Clone. Compassionate Crowdfunding.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
