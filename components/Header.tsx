'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'

export function Header() {
  return (
    <header className="fixed top-0 w-full bg-background border-b border-border z-50">
      <div className="max-w-container mx-auto px-2xl py-lg flex items-center justify-between">
        <Link href="/" className="flex items-center gap-md">
          <div className="w-8 h-8 bg-highlight rounded-md"></div>
          <span className="font-semibold text-text">Aegis</span>
        </Link>

        <nav className="hidden md:flex gap-2xl items-center">
          <Link href="/docs" className="text-text hover:text-highlight">
            Docs
          </Link>
          <Link href="/architecture" className="text-text hover:text-highlight">
            Architecture
          </Link>
          <Link href="/security" className="text-text hover:text-highlight">
            Security
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-highlight"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
        </nav>

        <button className="md:hidden p-md text-text hover:text-highlight">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  )
}
