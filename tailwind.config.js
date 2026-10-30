/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aurelion: {
          navy: '#080D18',
          ink: '#0D1423',
          surface: '#141D2D',
          elevated: '#1B273D',
          ivory: '#F5F2EA',
          gold: '#D6B878',
          'gold-light': '#E5CFA0',
          'gold-dark': '#B39352',
          slate: '#929DB0',
          emerald: '#36C995',
          coral: '#FF7777',
          amber: '#F4B860',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.02em' }], // 11px
        'xs': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }], // 13px (was 12px)
        'sm': ['0.9375rem', { lineHeight: '1.4375rem' }], // 15px (was 14px)
        'base': ['1.0625rem', { lineHeight: '1.6875rem' }], // 17px (was 16px)
        'lg': ['1.1875rem', { lineHeight: '1.8125rem' }], // 19px (was 18px)
        'xl': ['1.3125rem', { lineHeight: '1.9375rem' }], // 21px (was 20px)
        '2xl': ['1.59375rem', { lineHeight: '2.1875rem' }], // 25.5px (was 24px)
        '3xl': ['2rem', { lineHeight: '2.45rem' }], // 32px (was 30px)
        '4xl': ['2.4rem', { lineHeight: '2.8rem' }], // 38.4px (was 36px)
        '5xl': ['3.2rem', { lineHeight: '1.14' }], // 51.2px (was 48px)
        '6xl': ['4rem', { lineHeight: '1.08' }], // 64px (was 60px)
        '7xl': ['4.8rem', { lineHeight: '1.05' }], // 76.8px (was 72px)
        '8xl': ['6.25rem', { lineHeight: '1' }], // 100px (was 96px)
        '9xl': ['8.25rem', { lineHeight: '1' }], // 132px (was 128px)
      },
      boxShadow: {
        'luxury': '0 24px 60px -15px rgba(0, 0, 0, 0.65), 0 0 1px 1px rgba(214, 184, 120, 0.14)',
        'luxury-light': '0 16px 40px -12px rgba(10, 15, 26, 0.07), 0 0 0 1px rgba(179, 147, 82, 0.18)',
        'gold-glow': '0 0 32px -6px rgba(214, 184, 120, 0.25)',
        'gold-glow-light': '0 0 32px -4px rgba(179, 147, 82, 0.22)',
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(circle at 50% 0%, rgba(214, 184, 120, 0.12) 0%, transparent 70%)',
        'card-obsidian': 'linear-gradient(135deg, #121824 0%, #070A10 55%, #161F30 100%)',
        'card-champagne': 'linear-gradient(135deg, #DEC389 0%, #B89758 48%, #8F7139 100%)',
        'card-arctic': 'linear-gradient(135deg, #E8EDF5 0%, #C5D1E0 50%, #9AA9BD 100%)',
        'card-emerald': 'linear-gradient(135deg, #0D2E26 0%, #071A15 55%, #123E33 100%)',
      }
    },
  },
  plugins: [],
}
