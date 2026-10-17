/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0D1117',
          surface: '#161B22',
          border: 'rgba(201, 168, 76, 0.15)',
        },
        light: {
          bg: '#F0F4F8',
          surface: '#FFFFFF',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#F4D03F',
          dark: '#A0832E',
        },
        green: {
          islam: '#2D6A4F',
          light: '#40916C',
        },
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 168, 76, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
