/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ef',
          100: '#ccf0df',
          200: '#99e1bf',
          300: '#66d29f',
          400: '#33c37f',
          500: '#27ae60', // Base primary color
          600: '#208c4d',
          700: '#196a3a',
          800: '#134726',
          900: '#0a2413',
        },
        secondary: {
          50: '#e6f0f8',
          100: '#cce1f1',
          200: '#99c3e3',
          300: '#66a5d5',
          400: '#3387c7',
          500: '#2980b9', // Base secondary color
          600: '#216694',
          700: '#194d6f',
          800: '#10334a',
          900: '#081a25',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease forwards',
        'slide-in-right': 'slide-in-right 0.3s ease forwards',
        'slide-in-left': 'slide-in-left 0.3s ease forwards',
        'pulse': 'pulse 1.5s infinite',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0,0,0,0.05)',
        'message': '0 2px 5px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};