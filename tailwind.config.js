/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grace-blue': '#3B82F6',
        'grace-gold': '#D4AF37',
        'grace-dark-blue': '#1E40AF',
        'grace-light-blue': '#EFF6FF',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Source Sans Pro', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

