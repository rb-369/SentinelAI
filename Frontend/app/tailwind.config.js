/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind to scan all JSX files inside src/
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#0b0b0d',
        card:    '#0f1113',
        surface: '#161a1e',
        border:  '#1f2428',
        muted:   '#6b7280',
        accent: {
          yellow: '#FFB703',
          orange: '#FB8500',
          red:    '#FF4D4D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(0,0,0,0.45)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn:  'fadeIn 0.3s ease forwards',
        slideIn: 'slideIn 0.25s ease forwards',
      },
    },
  },
  plugins: [],
}