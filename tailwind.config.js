/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#0D9488',
        navy: '#0F172A',
        bg: '#F1F5F9',
        accent: '#6366F1',
        'employer-green': '#0D9488',
        mint: '#ccfbf1',
      },
      boxShadow: {
        '3d': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1), inset 0 1px 1px 0 rgb(255 255 255 / 0.1)',
        'inner-3d': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
}
