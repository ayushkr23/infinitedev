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
        dark: {
          bg: '#0d0d0d',
          card: 'rgba(23, 23, 23, 0.7)',
          border: '#262626',
          text: '#e5e5e5',
          accent: '#ff6b00'
        }
      },
      backdropBlur: {
        xs: '2px',
        xl: '20px',
      }
    },
  },
  plugins: [],
}
