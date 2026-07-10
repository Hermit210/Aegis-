# Aegis - Avalanche Deploy Assurance Website

Official website and documentation for the Aegis (Avalanche Deploy Assurance) project.

**GitHub Repository:** https://github.com/Hermit210/Aegis-

## Tech Stack

- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
app/
├── layout.tsx           # Root layout
├── page.tsx            # Homepage
├── globals.css         # Global styles
├── docs/
│   └── page.tsx       # Documentation page
├── architecture/
│   └── page.tsx       # Architecture & Contributing
└── security/
    └── page.tsx       # Security & Trust

components/
├── Header.tsx         # Navigation header
├── Footer.tsx         # Footer
├── Hero.tsx          # Hero section
├── TheGap.tsx        # Problem statement section
├── HowItWorks.tsx    # Three-stage flow section
├── Features.tsx      # Feature cards section
├── GettingStarted.tsx # Installation section
└── Button.tsx        # Reusable button component
```

## Design System

The site follows a premium design system with:

- **Colors:** Dark brown background (#0A0501), golden brown accents (#D4AF8A), warm off-white text (#F5F1E8)
- **Typography:** Inter (body), JetBrains Mono (code)
- **Spacing:** 4px base unit (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
- **Shadows:** Four-level shadow system for depth
- **Animations:** Framer Motion with cubic-bezier easing

### Key Features

- Fully responsive (mobile, tablet, desktop)
- Dark mode by default
- Accessible (WCAG AA+, keyboard navigation)
- Performance optimized
- Copy-to-clipboard code blocks
- Smooth scroll animations

## Pages

1. **Homepage** (`/`) - Product overview, hero, three-stage flow, features, getting started
2. **Docs** (`/docs`) - Installation, first run, understanding reports, all six checks, CI/CD
3. **Architecture** (`/architecture`) - Design philosophy, check interface, contributing guide
4. **Security** (`/security`) - Trust model, threat analysis, safe defaults

## Deployment

The site is built with Next.js and can be deployed to:

- Vercel (recommended, zero-config)
- AWS, GCP, Azure (any Node.js host)
- Docker

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy with Docker

```bash
docker build -t avalanche-deploy-assurance-website .
docker run -p 3000:3000 avalanche-deploy-assurance-website
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/description`)
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Contact

For questions or issues, visit the GitHub repository at https://github.com/Hermit210/Aegis- or open a GitHub issue
