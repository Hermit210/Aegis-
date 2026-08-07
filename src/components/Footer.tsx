import Link from 'next/link'
import { GitBranch, MessageCircle, FileText } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-semibold">Deploy Assurance</span>
            </div>
            <p className="text-text-secondary text-sm">
              Independent verification for Avalanche L1 deployments.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link href="/features" className="hover:text-primary transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-primary transition">
                  Roadmap
                </Link>
              </li>
              <li>
                <a href="https://github.com/Hermit210/Aegis-/releases" className="hover:text-primary transition">
                  Releases
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="https://github.com/Hermit210/Aegis-" className="hover:text-primary transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://github.com/Hermit210/Aegis-/issues" className="hover:text-primary transition">
                  Issues
                </a>
              </li>
              <li>
                <a href="https://github.com/Hermit210/Aegis-#contributing" className="hover:text-primary transition">
                  Contributing
                </a>
              </li>
              <li>
                <a href="https://github.com/Hermit210/Aegis-/blob/main/LICENSE" className="hover:text-primary transition">
                  License (MIT)
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/Hermit210/Aegis-"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-card rounded-lg flex items-center justify-center hover:bg-primary hover:text-background transition"
              >
                <GitBranch size={20} />
              </a>
              <a
                href="https://twitter.com/avalancheavax"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-card rounded-lg flex items-center justify-center hover:bg-primary hover:text-background transition"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="https://github.com/Hermit210/Aegis-/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-card rounded-lg flex items-center justify-center hover:bg-primary hover:text-background transition"
              >
                <FileText size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-6"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-text-tertiary">
          <p>&copy; {currentYear} Avalanche Deploy Assurance Contributors. MIT Licensed.</p>
          <p>
            Built for{' '}
            <a href="https://www.avalabs.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Avalanche
            </a>{' '}
            ecosystem.
          </p>
        </div>
      </div>
    </footer>
  )
}
