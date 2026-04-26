/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        akredita: {
          dark: '#0B1F3A',
          blue: '#009BFF',
          blueDark: '#0052CC',
          orange: '#FF6A00',
          orangeDark: '#E53900',
          bgLight: '#F9FAFB',
        }
      },
      fontFamily: {
        inter: ['Inter Tight', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
