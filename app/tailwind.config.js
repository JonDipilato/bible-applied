/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          primary: '#2563EB',
          secondary: '#7C3AED',
          accent: '#D97706',
        },
        // Topic colors
        topic: {
          finances: '#10B981',
          marriage: '#EC4899',
          anxiety: '#8B5CF6',
          health: '#06B6D4',
          parenting: '#F59E0B',
          work: '#3B82F6',
          salvation: '#EF4444',
          forgiveness: '#14B8A6',
          wisdom: '#6366F1',
          peace: '#A78BFA',
          strength: '#F97316',
          prayer: '#84CC16',
        },
        // Highlight colors
        highlight: {
          yellow: '#FEF08A',
          green: '#BBF7D0',
          blue: '#BFDBFE',
          pink: '#FBCFE8',
          orange: '#FED7AA',
        },
      },
      fontFamily: {
        display: ['Crimson Pro', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'verse': ['1.125rem', { lineHeight: '1.75' }],
        'verse-lg': ['1.25rem', { lineHeight: '1.75' }],
        'verse-xl': ['1.5rem', { lineHeight: '1.75' }],
      },
      spacing: {
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
        'header': '64px',
        'reading': '720px',
      },
      animation: {
        'skeleton': 'skeleton-shimmer 1.5s infinite',
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
      },
      keyframes: {
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-dot': {
          '0%, 80%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
