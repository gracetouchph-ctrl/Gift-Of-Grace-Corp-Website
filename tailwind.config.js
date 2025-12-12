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
        // Client accent palette
        'grace-accent': '#f05644', // warm coral
        'grace-accent-alt': '#60b2d4', // soft sky blue
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

