# Avalanche Deploy Assurance Website — Quick Start

## 🚀 Get Running in 30 Seconds

### Prerequisites
- Node.js 18+ (check with `node --version`)
- npm 9+ (check with `npm --version`)

### Start the Development Server

```bash
cd avalanche-deploy-assurance-website
npm install
npm run dev
```

Open your browser to **http://localhost:3000**

## 📋 What You'll See

A production-ready, premium website with:

1. **Hero** — Eye-catching headline about deploy verification
2. **Problem** — 4 documented GitHub issues proving the gap
3. **Solution** — Interactive before/after comparison
4. **Features** — 6 capabilities explained
5. **Demo** — Click "Run Verification" for simulated dashboard
6. **Architecture** — System design and data flow
7. **Roadmap** — 10-week delivery plan + v2 roadmap
8. **OpenSource** — MIT license + contribution guide
9. **CTA** — Installation commands and quick start

## 🎨 Design Highlights

- **Color Palette**: Warm dark (bronze, charcoal, matte black) — NOT blue crypto
- **Animations**: Smooth Framer Motion effects, no excess motion
- **Responsive**: Works perfectly on mobile, tablet, desktop
- **Professional**: Premium developer tooling aesthetic (Vercel/Linear/Stripe vibes)

## 🔧 Commands

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build

# Run production build locally
npm run start

# Linting
npm run lint
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Color palette + Tailwind
└── components/
    ├── Navigation.tsx        # Header
    ├── Footer.tsx            # Footer
    └── sections/             # 9 page sections
        ├── Hero.tsx
        ├── Problem.tsx
        ├── Solution.tsx
        ├── Features.tsx
        ├── Demo.tsx
        ├── Architecture.tsx
        ├── Roadmap.tsx
        ├── OpenSource.tsx
        └── CTA.tsx
```

## 🎯 Interactive Elements

- **Tab Navigation** (Solution section) — Click to compare workflows
- **Demo Dashboard** (Demo section) — Click "Run Verification" to see live animation
- **JSON Viewer** (Demo section) — Click "View JSON Output" to see machine output
- **Expandable Sections** — Click details/summaries throughout
- **Smooth Scrolling** — All navigation links scroll smoothly

## 🔗 Important Links

- **Problem Evidence**: Each issue links directly to avalanche-cli GitHub
- **GitHub CTA**: All GitHub buttons link to the repo (update `your-org`)
- **Documentation**: Links in OpenSource section to project docs

## ⚙️ Configuration

Before launching publicly, update these:

1. **GitHub URLs** - Replace `your-org` in:
   - `src/components/Navigation.tsx`
   - `src/components/sections/Hero.tsx`
   - `src/components/sections/CTA.tsx`
   - `src/components/Footer.tsx`
   - `src/components/sections/OpenSource.tsx`

2. **Metadata** - Update `src/app/layout.tsx`:
   - Title
   - Description
   - OG image (add to `public/`)

3. **Favicon** - Add to `public/favicon.ico`

## 📦 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Self-Hosted
```bash
npm run build
npm run start
```

### Docker

No `Dockerfile` is committed to this repo yet. The root README's Deployment
section has one you can drop in as `avalanche-deploy-assurance-website/Dockerfile`
before running:
```bash
docker build -t avalanche-deploy-assurance-website .
docker run -p 3000:3000 avalanche-deploy-assurance-website
```

## 🧪 Verification

Once running, verify:
- ✅ Page loads without errors
- ✅ Click "Run Verification" in demo section
- ✅ Check responsive on mobile (F12 → toggle device toolbar)
- ✅ All GitHub links work
- ✅ Animations are smooth

## 📚 Documentation

- **Full guide**: `avalanche-deploy-assurance-website/README.md` (covers both the frontend and the real backend in `backend/`)
- **Project vision**: `docs/01-executive-summary.md`
- **Marketing copy**: `docs/15-landing-page-copy.md`
- **Technical design**: `docs/03-engineering-design.md` (rewritten to match the actual TypeScript implementation, not the originally-planned Go version)

## ❓ Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Port 3000 In Use
```bash
npm run dev -- -p 3001
```

### TypeScript Errors
This project has no dedicated `type-check` script — `next build` type-checks
as part of the build, or run `npx tsc --noEmit` directly.

## 🎉 Next Steps

1. **Explore the site** — Click through all sections
2. **Try the demo** — Run the verification simulation
3. **Share with reviewers** — Use `npm run build && npm run start` for production
4. **Configure GitHub** — Replace `your-org` before public launch
5. **Deploy** — Push to Vercel or self-host

---

**Built**: Next.js frontend, plus a real Node/TypeScript verification backend
in `avalanche-deploy-assurance-website/backend/` (six checks, health score,
CLI, JSON API — all implemented and live-tested against Fuji testnet; see
that repo's README for details, not covered by this quick start).
**For**: Avalanche Team1 Mini Grant reviewers
**Status**: Frontend runs as described above. Backend is separately built
and tested but not yet wired to this frontend's demo section.
**Questions?** See `avalanche-deploy-assurance-website/README.md`
