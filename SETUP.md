# Setup & Development Guide

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/avalanche-labs/avalanche-deploy-assurance-website.git
cd avalanche-deploy-assurance-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checker |

## File Organization

```
avalanche-deploy-assurance-website/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── docs/
│   ├── architecture/
│   └── security/
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── TheGap.tsx
│   ├── HowItWorks.tsx
│   ├── Features.tsx
│   ├── GettingStarted.tsx
│   └── Button.tsx
├── public/               # Static assets (images, icons, etc.)
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies & scripts
└── README.md            # Project documentation
```

## Design System

### Colors (Tailwind Config)

Located in `tailwind.config.ts`:

```typescript
colors: {
  background: '#0F0E0D',    // Page background
  card: '#181513',          // Card backgrounds
  surface: '#221D1A',       // Surface/hover
  accent: '#8B5E3C',        // Muted bronze
  highlight: '#C89A63',     // Main accent
  border: '#302823',        // Borders
  text: '#F7F4EF',         // Primary text
  success: '#6B8E6B',       // Success state
  warning: '#D4A574',       // Warning state
  error: '#A85D5D',         // Error state
}
```

### Adding New Pages

1. Create directory in `app/` (e.g., `app/contributing/`)
2. Create `page.tsx` in that directory
3. Use Header/Footer components
4. Add navigation link in Header component

### Creating New Components

1. Create file in `components/` folder
2. Use `'use client'` directive if using client-side hooks
3. Import and use in pages
4. Style with Tailwind or inline motion styles

## Customization

### Update Site Metadata

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your description',
}
```

### Change Color Palette

Edit `tailwind.config.ts` colors section, then update `app/globals.css` to match.

### Add Navigation Links

Edit `components/Header.tsx` and `components/Footer.tsx`.

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

### Docker

```bash
docker build -t avalanche-website .
docker run -p 3000:3000 avalanche-website
```

### GitHub Pages

Not recommended for this project (requires static export, loses interactivity).

### Manual Deployment

```bash
npm run build
npm start
```

## Troubleshooting

### Port 3000 Already in Use

```bash
npm run dev -- -p 3001
```

### TypeScript Errors

```bash
npm run type-check
```

### Tailwind Classes Not Applying

Verify `content` array in `tailwind.config.ts` includes all template files.

### Build Fails

```bash
rm -rf node_modules .next
npm install
npm run build
```

## Performance Tips

- Images should be optimized (use Next.js Image component if added)
- Code splitting happens automatically with Next.js
- CSS is purged automatically by Tailwind

## Browser Support

- Chrome/Edge latest 2 versions
- Firefox latest 2 versions
- Safari latest 2 versions
- Mobile browsers (iOS Safari, Chrome Android)

## Accessibility

- All interactive elements are keyboard accessible
- Focus states visible on all buttons/links
- Color contrast meets WCAG AAA
- Semantic HTML used throughout
- Alt text on images
- Screen reader tested

## Next Steps

1. **Add Content:** Update text in page files to match your content
2. **Add Images:** Place in `public/` and reference in components
3. **Add More Pages:** Follow "Adding New Pages" section
4. **Deploy:** Choose deployment option above
5. **Monitor:** Set up analytics/monitoring as needed

## Support

For issues or questions:
- Check GitHub Discussions
- Open an Issue
- Review existing documentation
