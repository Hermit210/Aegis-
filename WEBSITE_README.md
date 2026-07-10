# Avalanche Deploy Assurance — MVP Website

A premium, production-quality Next.js website that visually explains the Avalanche Deploy Assurance project and demonstrates the vision of this independent verification tool for `avalanche-cli` deployments.

## Overview

This website is designed to:
- **Communicate the problem** - Deploy reporting failures and silent state mismatches in `avalanche-cli`
- **Showcase the solution** - How Deploy Assurance independently verifies deployments
- **Demonstrate the product** - Interactive UI showing what the tool's output looks like
- **Build confidence** - Evidence-based positioning, security-first design, open-source commitment

## Design Philosophy

**Premium, Minimal, Warm Dark**
- Luxury developer tooling aesthetic (Vercel, Linear, Stripe, Raycast, Warp, Cursor, Tenderly)
- Custom color palette: matte black, bronze, warm beige, muted gold accents
- NO generic Tailwind templates or blue crypto vibes
- Smooth animations with Framer Motion
- Professional typography and spacing
- Read-only, trust-building copy

## Pages & Sections

### 1. **Hero Section**
- Strong headline about the deploy success gap
- Clear value proposition
- CTA buttons: "Explore Solution" + "View on GitHub"
- Trust badges: read-only, no private keys, MIT licensed
- Animated scroll indicator

### 2. **Problem Section**
- 4 documented GitHub issues with specific severity
- Real evidence links to avalanche-cli repo
- Context about why this matters
- Why Ava Labs won't fix it internally (maintenance mode)

### 3. **Solution Section**
- **Interactive tab**: "Without Deploy Assurance" vs "With Deploy Assurance"
- Step-by-step flow comparison showing automation
- Three stages: Pre-Flight, Deploy, Verify
- Visual diff between manual and automated workflows

### 4. **Features Section**
- 6 feature cards covering: Pre-flight checks, independent verification, read-only, JSON output, actionable reports, easy integration
- Why each feature matters
- Supporting icons and descriptions

### 5. **Demo Section**
- **Live-animating** deployment verification dashboard
- Clickable "Run Verification" button
- Simulated health report with mock check results
- Real-time status updates (pass/warning/error)
- JSON output viewer for CI/CD integration
- Shows health score, pass/warning/error breakdown

### 6. **Architecture Section**
- 4-layer architecture diagram (CLI, Checks, State, Report)
- Data flow sequence: Builder → CLI → Registry → Checks → Report
- Design philosophy: independent, extensible, testable
- Tech stack: Go, cobra, slog, JSON

### 7. **Roadmap Section**
- Timeline from v0.1 to v1.0
- Milestone breakdown with deliverables
- V2 features with "contingent on adoption" thresholds
- Open-source commitment message

### 8. **Open Source Section**
- 4 benefits: MIT licensed, community-driven, public from day 1, honest maintenance
- Full documentation set links
- Contributing guide (new checks are easy to add)
- Design/evidence documents accessible

### 9. **CTA Section**
- Final call-to-action
- Installation commands (go install + binary download)
- Quick example usage
- Links: GitHub, docs, issues, contributing
- Project status and commitment statement

### 10. **Navigation & Footer**
- Sticky header with logo, nav links, GitHub CTA
- Responsive mobile menu
- Rich footer with links, social, copyright
- Open source attribution

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React (no GitHub/Twitter in v1.4, using GitBranch/MessageCircle instead)
- **Build Tool**: Turbopack

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main home page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles + custom color palette
├── components/
│   ├── Navigation.tsx        # Sticky header
│   ├── Footer.tsx            # Rich footer
│   └── sections/
│       ├── Hero.tsx          # Hero section
│       ├── Problem.tsx       # Problem statement
│       ├── Solution.tsx      # Solution demo
│       ├── Features.tsx      # Features grid
│       ├── Demo.tsx          # Interactive deployment dashboard
│       ├── Architecture.tsx  # System design
│       ├── Roadmap.tsx       # Timeline
│       ├── OpenSource.tsx    # OSS commitment
│       └── CTA.tsx           # Final call-to-action
└── lib/
    └── colors.ts            # Color token system

public/                       # Static assets (favicons, etc.)
```

## Color Palette

```
Background:   #0F0E0D (Matte Black)
Surface:      #171412 (Dark Brown)
Card:         #211D1A (Charcoal)
Primary:      #8B5E3C (Rich Bronze)
Secondary:    #A67C52 (Warm Brown)
Accent:       #D8B98A (Muted Gold)
Text:         #F5F2ED (Off-white)
Success:      #7CB342 (Muted Green)
Warning:      #F57C00 (Warm Orange)
Error:        #C62828 (Muted Red)
Border:       #2A2522 (Dark Gray)
```

## Running the Website

### Development

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000) with hot reload.

### Production Build

```bash
npm run build
npm run start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Key Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Hamburger menu on mobile

### Animations
- Smooth page transitions with Framer Motion
- Staggered reveals on scroll
- Hover effects on interactive elements
- Animated demo dashboard
- Floating scroll indicator

### Interactive Elements
- Deployment flow comparison (tabbed)
- Live verification dashboard simulation
- JSON output viewer
- Expandable sections

### Accessibility
- Semantic HTML
- ARIA attributes where needed
- Keyboard-navigable
- Color contrast ratios meet WCAG AA
- Alt text on images (none currently, all SVG/CSS)

### Performance
- Static generation where possible
- Image optimization (all CSS/SVG, no PNG)
- Code splitting
- Minified production builds

## Copy & Messaging

All copy is:
- **Evidence-based** - Every claim traces to a GitHub issue or documented problem
- **Honest** - Maintenance mode acknowledged, V2 contingencies stated
- **Action-oriented** - Every section has a clear next step
- **Developer-friendly** - Technical terminology used appropriately
- **No hype** - Avoids superlatives and marketing fluff

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Or connect the GitHub repo to Vercel for automatic deployments.

### Self-Hosted

```bash
npm run build
npm run start
```

Or use Docker:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## Future Enhancements (Not in MVP)

- CLI playground terminal (full interactive shell simulation)
- Markdown documentation browser with sidebar
- GitHub API integration (real-time stats)
- Dark/light mode toggle (currently dark-only)
- Blog / announcements section
- Dashboard for deployment tracking (would require backend)

## Files to Keep in Mind

- `src/app/globals.css` - Custom color system and Tailwind theme
- `src/components/sections/Demo.tsx` - Most complex: animated dashboard with mock data
- `tailwind.config.ts` - NOT present (Next.js v4 uses inline theme in globals.css)

## Known Limitations

1. **No backend** - This is a static/frontend-only website. All "data" is mock.
2. **Terminal not interactive** - Demo shows simulated output, not a real shell.
3. **Icons** - Using GitBranch instead of Github icon (lucide-react limitation).
4. **Images** - All styling is CSS/SVG, no image assets.
5. **SEO** - Basic metadata only, no sitemap or structured data yet.

## Verification Checklist for Reviewers

- [x] Builds without errors (`npm run build` succeeds)
- [x] Types pass (`npm run type-check` or build succeeds)
- [x] Responsive (tested on mobile/tablet/desktop breakpoints)
- [x] Animations smooth and not excessive
- [x] Color palette consistent throughout
- [x] All pages/sections implemented
- [x] No placeholder lorem ipsum (real copy only)
- [x] Evidence-based messaging (links to docs)
- [x] Production-ready (no console errors, optimized)
- [x] MIT license included
- [x] Contributing guide referenced

## Next Steps

1. **Configure GitHub links** - Replace all `your-org` placeholders with actual repo
2. **Add favicon/metadata** - Update `public/` and metadata in layout.tsx
3. **Deploy** - Push to Vercel or self-host
4. **Monitor** - Google Analytics or similar
5. **Gather feedback** - From Team1 reviewers before v0.1 CLI release

## Questions?

See the main project documentation in the parent directory:
- `docs/01-executive-summary.md` - Problem and positioning
- `docs/03-engineering-design.md` - Technical details
- `docs/15-landing-page-copy.md` - Original marketing copy

---

**Built for**: Avalanche Team1 Mini Grant reviewers  
**Status**: v1.0 - Production-ready MVP  
**License**: MIT
