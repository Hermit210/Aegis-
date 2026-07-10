import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        card: '#F8F8F8',
        surface: '#F0F0F0',
        accent: '#3D2817',
        highlight: '#2C1810',
        border: '#E0D9D0',
        text: '#1A0F08',
        success: '#6B8E6B',
        warning: '#D4A574',
        error: '#A85D5D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
        '5xl': '80px',
        '6xl': '96px',
      },
      boxShadow: {
        'level-1': '0 1px 2px rgba(0,0,0,0.05)',
        'level-2': '0 4px 12px rgba(0,0,0,0.15)',
        'level-3': '0 8px 24px rgba(0,0,0,0.2)',
        'level-4': '0 16px 40px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
      maxWidth: {
        container: '1400px',
      },
    },
  },
  plugins: [],
}
export default config
