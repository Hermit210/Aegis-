'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'

export function Footer() {
  return (
    <section className="py-5xl bg-background">
      <div className="max-w-container mx-auto px-2xl">
        <Link href="/" className="flex items-center gap-md mb-3xl">
          <div className="w-6 h-6 bg-highlight rounded-md"></div>
          <span className="font-semibold text-text">Aegis</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3xl mb-3xl">
          {/* Product */}
          <div>
            <h4 className="text-text font-semibold mb-xl">Product</h4>
            <ul className="space-y-md text-accent">
              <li>
                <Link href="/docs" className="hover:text-highlight transition">
                  Install
                </Link>
              </li>
              <li>
                <Link href="/docs#cli" className="hover:text-highlight transition">
                  CLI Reference
                </Link>
              </li>
              <li>
                <Link href="/docs#examples" className="hover:text-highlight transition">
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-text font-semibold mb-xl">Community</h4>
            <ul className="space-y-md text-accent">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-highlight transition">
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/contributing" className="hover:text-highlight transition">
                  Contributing
                </Link>
              </li>
              <li>
                <a href="https://github.com/issues" target="_blank" rel="noopener noreferrer" className="hover:text-highlight transition">
                  Issues
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-text font-semibold mb-xl">Legal</h4>
            <ul className="space-y-md text-accent">
              <li>
                <Link href="/license" className="hover:text-highlight transition">
                  MIT License
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-highlight transition">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-3xl">
          <p className="text-accent text-sm">
            © 2026 Aegis. MIT Licensed. Open Source.
          </p>
        </div>
      </div>
    </section>
  )
}
