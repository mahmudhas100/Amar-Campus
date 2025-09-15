import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': '#082f49', // sky-950
        'background-secondary': '#173d57', // Custom mix for cards
        'accent': '#7dd3fc', // sky-300
        'accent-hover': '#e0f2fe', // sky-100
        'text-primary': '#e2e8f0', // slate-200
        'text-secondary': '#94a3b8', // slate-400
        'border-primary': '#385a73', // Custom mix for borders
        'background-admin': '#f3f4f6', // gray-100
        'teal-950': '#0d3833',
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out'
      }
    },
  },
  plugins: [
    typography,
  ],
};
