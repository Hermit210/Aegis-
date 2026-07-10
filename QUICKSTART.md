# Quick Start Guide

Get the Avalanche Deploy Assurance website running in 5 minutes.

## Prerequisites

- Node.js 18+
- npm

## Installation (2 minutes)

```bash
# Clone the repository
git clone https://github.com/avalanche-labs/avalanche-deploy-assurance-website.git
cd avalanche-deploy-assurance-website

# Install dependencies
npm install
```

## Development (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**That's it!** The site is now running locally.

## Build for Production (1 minute)

```bash
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the production build.

## Deploy (1 minute)

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

### Option 2: Docker

```bash
docker build -t avalanche-website .
docker run -p 3000:3000 avalanche-website
```

### Option 3: Generic Node.js Host

```bash
npm run build
npm start
```

Then deploy the `node_modules` and `.next` directories to your hosting.

## Common Tasks

### View TypeScript Errors

```bash
npm run type-check
```

### Run Linter

```bash
npm run lint
```

### Edit Site Content

All page content is in:
- `app/page.tsx` — Homepage
- `app/docs/page.tsx` — Documentation
- `app/architecture/page.tsx` — Architecture & Contributing
- `app/security/page.tsx` — Security & Trust

### Change Colors

Edit `tailwind.config.ts` in the `colors` section.

### Add a New Page

1. Create `app/newpage/page.tsx`
2. Copy layout from existing page
3. Add nav link to `components/Header.tsx`

## Testing

Mobile: Open DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)

## Resources

- [Full Setup Guide](./SETUP.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Verification Checklist](./VERIFICATION.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

---

**Status:** ✅ Ready to build and deploy!
