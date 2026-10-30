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
