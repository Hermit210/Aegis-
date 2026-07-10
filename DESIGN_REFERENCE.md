# Design Reference

Complete visual specification for the Avalanche Deploy Assurance website.

## Color Palette

```
┌─────────────────────────────────────────────────────────────┐
│ BACKGROUND                                                  │
│ #0F0E0D (Deep Charcoal - Page Background)                  │
│ Used for: Main background, text on cards                    │
│ Contrast ratio: 7.5:1 with text                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CARD                                                         │
│ #181513 (Slightly Lighter Charcoal - Card Backgrounds)     │
│ Used for: Card backgrounds, containers                      │
│ Contrast: Subtle separation from background                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SURFACE                                                      │
│ #221D1A (Warm Dark Brown - Hover/Alternate Sections)        │
│ Used for: Section alternation, hover states                 │
│ Contrast: Deeper than card, more prominent                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ACCENT                                                       │
│ #8B5E3C (Warm Bronze - Muted Highlight)                    │
│ Used for: Muted text, secondary highlights                  │
│ Contrast: 4.5:1 with background                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ HIGHLIGHT                                                    │
│ #C89A63 (Light Bronze - Primary Accent)                    │
│ Used for: CTAs, active states, links, code text             │
│ Contrast: 7:1 with dark backgrounds                         │
│ Prominence: Highest on page                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ BORDER                                                       │
│ #302823 (Subtle Dark Brown - Borders & Dividers)           │
│ Used for: Card borders, dividers, subtle lines              │
│ Contrast: Subtle but visible                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TEXT PRIMARY                                                 │
│ #F7F4EF (Off-White - Headlines & Body)                     │
│ Used for: All readable text                                 │
│ Contrast: 7.5:1 with dark backgrounds                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SUCCESS                                                      │
│ #6B8E6B (Muted Green - Pass/Success States)                │
│ Used for: ✓ PASS checks, success messages                  │
│ Contrast: 5.5:1 with background                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WARNING                                                      │
│ #D4A574 (Warm Tan - Warning/Caution States)                │
│ Used for: ⚠ WARNING checks, caution indicators              │
│ Contrast: 6:1 with background                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ERROR                                                        │
│ #A85D5D (Muted Burgundy - Error/Critical States)           │
│ Used for: ✗ ERROR checks, critical alerts                  │
│ Contrast: 5:1 with background                               │
└─────────────────────────────────────────────────────────────┘
```

## Typography

### Heading 1 (Hero Headline)
```
Font:         Inter, 700 (Bold)
Size:         56px
Line Height:  1.1 (61.6px)
Letter Sp:    -0.02em (-1.12px)
Color:        #F7F4EF
Example:      "Know Your Deployment Actually Worked"
```

### Heading 2 (Section Headlines)
```
Font:         Inter, 700 (Bold)
Size:         40px
Line Height:  1.2 (48px)
Letter Sp:    -0.01em (-0.4px)
Color:        #F7F4EF
Example:      "The Deployment Moment Nobody Owns"
```

### Heading 3 (Card Headlines)
```
Font:         Inter, 600 (Semibold)
Size:         24px
Line Height:  1.3 (31.2px)
Letter Sp:    0
Color:        #F7F4EF
Example:      "Health Score"
```

### Body Text
```
Font:         Inter, 400 (Regular)
Size:         16px
Line Height:  1.6 (25.6px)
Letter Sp:    0
Color:        #F7F4EF
Example:      "Verify validator registration, configuration..."
```

### Small Text (Muted)
```
Font:         Inter, 400 (Regular)
Size:         14px
Line Height:  1.5 (21px)
Letter Sp:    0
Color:        #8B5E3C (Accent)
Example:      "Fix: confirm validator registration..."
```

### Code/Terminal
```
Font:         JetBrains Mono, 400 (Regular)
Size:         13px
Line Height:  1.5 (19.5px)
Letter Sp:    0
Color:        #C89A63 (Highlight)
Example:      "$ avalanche-deploy-assurance doctor"
```

### Label/Badge
```
Font:         Inter, 600 (Semibold)
Size:         12px
Line Height:  1.4 (16.8px)
Letter Sp:    0.05em (+0.6px)
Color:        #F7F4EF on #8B5E3C
Example:      "NEW" or "BETA"
```

## Spacing Scale

```
xs   = 4px    (icon margins, tight spacing)
sm   = 8px    (tight gaps)
md   = 12px   (component internal padding)
lg   = 16px   (standard padding)
xl   = 24px   (medium gaps)
2xl  = 32px   (between components)
3xl  = 48px   (between subsections)
4xl  = 64px   (breathing room)
5xl  = 80px   (section gaps — DESKTOP)
6xl  = 96px   (footer/large gaps)

TABLET ADJUSTMENTS:
Section gaps = 60px (4xl)

MOBILE ADJUSTMENTS:
Section gaps = 40px (3xl)
Horizontal padding = 16px (lg)
```

## Box Shadows

```
Level 1 (Minimal):      0 1px 2px rgba(0,0,0,0.05)
                        Used for: Hover states, subtle depth

Level 2 (Default):      0 4px 12px rgba(0,0,0,0.15)
                        Used for: Card default state

Level 3 (Elevated):     0 8px 24px rgba(0,0,0,0.2)
                        Used for: Card hover, active states

Level 4 (Floating):     0 16px 40px rgba(0,0,0,0.25)
                        Used for: Sticky nav, floating elements
```

## Border Radius

```
sm  = 4px     (small, minimal rounding)
md  = 6px     (standard, comfortable rounding)
lg  = 8px     (cards, containers)
```

## Animations

### Timing Functions
```
Easing:  cubic-bezier(0.4, 0, 0.2, 1)  (Material Design standard)
Fast:    150ms (hover effects)
Medium:  300ms (color transitions, reveals)
Slow:    400-800ms (scroll reveals, hero animations)
```

### Animation Timing

```
Hero headline:      Fade in + slide up (400ms)
Subheadline:        Fade in (300ms, delayed 100ms)
CTA buttons:        Fade in (300ms, delayed 200ms)
Right-side visual:  Slide in from right (400ms)

Section on scroll:  Fade in + slide up (300-400ms)
Cards on scroll:    Stagger 100-150ms between cards

Hover effects:      All 150ms ease
Button hover:       Lift effect (scale 1.01, -2px translateY)
Card hover:         Lift + shadow upgrade (150ms)
```

## Container & Layout

### Desktop (1025px+)
```
Max width:          1400px
Horizontal padding: 32px (2xl)
Margin:             auto (centered)
Column gap:         24px (xl)
Grid columns:       12 cols per section
Row gap:            16px (lg)
```

### Tablet (768px–1024px)
```
Width:              90% (with max 1400px fallback)
Horizontal padding: 24px (xl)
Margin:             auto (centered)
Column gap:         20px (custom)
Grid columns:       8 cols
Row gap:            16px (lg)
```

### Mobile (375px–767px)
```
Width:              100%
Horizontal padding: 16px (lg)
Margin:             auto
Column gap:         16px (lg)
Grid columns:       4 cols (rarely used, mostly single col)
Row gap:            16px (lg)
```

## Component Spacing

### Card (Feature Cards, Check Cards)
```
Padding:            24px (xl) internal
Border:             1px solid #302823
Border-radius:      6px (md)
Box-shadow:         Level 2
Hover:              Shadow upgrade to Level 3
Margin-bottom:      16px (lg)
Gap (internal):     16px (lg)
```

### Button
```
Primary:            bg-highlight #C89A63, text-background
Secondary:          border-highlight, text-highlight
Padding:            12px (md) vertical, 24px (lg) horizontal
Border-radius:      6px (md)
Font-weight:        600 (semibold)
Hover:              bg upgrade, shadow Level 1
Active:             darker background
Focus:              2px outline #C89A63, 2px offset
Transition:         all 150ms ease
```

### Code Block / Terminal
```
Background:         #0F0E0D (darker than cards)
Border:             1px solid #302823
Padding:            16px (lg)
Border-radius:      6px (md)
Font:               13px JetBrains Mono
Line-height:        1.5 (19.5px)
Color:              #C89A63 (code text)
Max-height:         400px
Overflow:           auto (scrollable)
```

### Section Container
```
Padding:            80px (5xl) vertical, 32px (2xl) horizontal (desktop)
Padding:            60px (4xl) vertical (tablet)
Padding:            40px (3xl) vertical (mobile)
Max-width:          1400px
Margin:             0 auto
Border:             1px solid #302823 (sometimes)
Background:         Alternates between #0F0E0D and #221D1A
```

## Focus & Accessibility

### Focus States
```
Outline:            2px solid #C89A63 (highlight)
Outline-offset:     2px
Visible on:         :focus-visible (keyboard only)
Invisible on:       Click (mouse interactions)
```

### Color Contrast
```
Text on background:     7.5:1 (exceeds WCAG AAA)
Text on cards:          7:1 (exceeds WCAG AAA)
Muted text:             4.5:1 (meets WCAG AA)
Status badges:          4.5:1 (meets WCAG AA)
```

### Keyboard Navigation
```
Tab order:          Top-to-bottom, left-to-right
Skip link:          Visible on focus (hidden by default)
Focus trap:         None (natural flow)
Focus visible:      All interactive elements
```

## Responsive Breakpoints

```
Mobile:             375px–767px
  • 4-column grid
  • 16px horizontal padding
  • Single-column layouts
  • Stacked modals
  • Touch-friendly (48px+ buttons)

Tablet:             768px–1024px
  • 8-column grid
  • 90% width container
  • 2-column where possible
  • Flexible layouts

Desktop:            1025px–1400px+
  • 12-column grid
  • 1400px max-width container
  • Full 2-column layouts
  • All features visible
```

## Mobile-First Approach

```
1. Design for mobile first (375px)
2. @media (min-width: 768px)   → Tablet adjustments
3. @media (min-width: 1025px)  → Desktop adjustments
4. Never design desktop-first then remove for mobile
```

## Visual Consistency Rules

1. **Never full-edge content** — Always center with max-width
2. **Never left-align entire page** — Alternate directions
3. **Never huge empty spaces** — Intentional 80px spacing
4. **Never mix warm/cool palettes** — Stay warm brown
5. **Never use bright colors** — Muted, professional
6. **Never skip states** — Hover, active, focus all present
7. **Never ignore mobile** — Mobile is not an afterthought

## Examples

### Section with Alternating Layout
```
Desktop:
┌─────────────────────────────────────┐
│  LEFT TEXT      │      RIGHT VISUAL │
│  (6 cols)       │      (6 cols)     │
└─────────────────────────────────────┘

Tablet:
┌────────────────────────┐
│   TEXT (8 cols full)   │
├────────────────────────┤
│  VISUAL (8 cols full)  │
└────────────────────────┘

Mobile:
┌──────────────┐
│  TEXT        │
├──────────────┤
│  VISUAL      │
└──────────────┘
```

### Card Grid (4 Features)
```
Desktop:
┌────┐ ┌────┐ ┌────┐ ┌────┐
│ 1  │ │ 2  │ │ 3  │ │ 4  │
└────┘ └────┘ └────┘ └────┘
(4 cols × 3 cols = 12 cols)

Tablet:
┌────────┐ ┌────────┐
│   1    │ │   2    │
├────────┼─┤────────┤
│   3    │ │   4    │
└────────┘ └────────┘
(2×2 grid)

Mobile:
┌────────────┐
│     1      │
├────────────┤
│     2      │
├────────────┤
│     3      │
├────────────┤
│     4      │
└────────────┘
(1 col × 4 rows)
```

---

This design reference ensures consistency across the entire website. Every element follows this specification exactly.
