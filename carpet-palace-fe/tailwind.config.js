/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8ddd0',
          300: '#d4c2a8',
          400: '#b89d7a',
          500: '#a0825f',
          600: '#8b6d4f',
          700: '#735842',
          800: '#604a3a',
          900: '#503f32',
          950: '#2a1f18',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        elegant: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
