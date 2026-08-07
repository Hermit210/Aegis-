'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '#problems', label: 'Problem' },
    { href: '#solution', label: 'Solution' },
    { href: '#features', label: 'Features' },
    { href: '#architecture', label: 'Architecture' },
    { href: '#opensource', label: 'Docs' },
    { href: '#roadmap', label: 'Roadmap' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-highlight font-bold text-sm">
              A
            </div>
            <span className="font-semibold text-text-primary group-hover:text-primary transition">
              Deploy Assurance
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-primary transition text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Hermit210/Aegis-"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg font-medium text-sm hover:bg-secondary transition"
            >
              View on GitHub
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-surface rounded-lg transition"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border space-y-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-text-secondary hover:text-primary transition text-sm py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/Hermit210/Aegis-"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 bg-primary text-background rounded-lg font-medium text-sm hover:bg-secondary transition text-center mt-4"
            >
              GitHub
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
