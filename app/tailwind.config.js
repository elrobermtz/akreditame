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
        },
        "on-secondary-container": "#abb9d6",
        "on-error-container": "#ffdad6",
        "background": "#031427",
        "on-tertiary-fixed-variant": "#004395",
        "pure-white": "#FFFFFF",
        "on-secondary": "#233148",
        "surface-container-high": "#1b2b3f",
        "outline": "#a98a7d",
        "error-container": "#93000a",
        "outline-variant": "#5a4136",
        "on-primary": "#561f00",
        "tertiary-fixed": "#d8e2ff",
        "on-primary-container": "#572000",
        "surface-container-lowest": "#000f21",
        "surface-dim": "#031427",
        "inverse-on-surface": "#213145",
        "surface-slate": "#112240",
        "surface-tint": "#ffb693",
        "on-primary-fixed-variant": "#7a3000",
        "tertiary-fixed-dim": "#adc6ff",
        "secondary": "#b9c7e4",
        "on-surface": "#d3e4fe",
        "primary-container": "#ff6b00",
        "surface-bright": "#2a3a4f",
        "inverse-surface": "#d3e4fe",
        "surface-variant": "#26364a",
        "primary-fixed-dim": "#ffb693",
        "on-secondary-fixed": "#0d1c32",
        "surface-container-highest": "#26364a",
        "on-surface-variant": "#e2bfb0",
        "primary-fixed": "#ffdbcc",
        "tertiary-container": "#5f97ff",
        "on-error": "#690005",
        "surface-container-low": "#0b1c30",
        "on-tertiary-container": "#002f6b",
        "surface": "#031427",
        "secondary-container": "#3c4962",
        "primary": "#ffb693",
        "secondary-fixed": "#d6e3ff",
        "surface-container": "#102034",
        "on-tertiary": "#002e6a",
        "on-primary-fixed": "#351000",
        "tertiary": "#adc6ff",
        "on-secondary-fixed-variant": "#39475f",
        "deep-navy": "#0A1128",
        "on-background": "#d3e4fe",
        "error": "#ffb4ab",
        "on-tertiary-fixed": "#001a42",
        "secondary-fixed-dim": "#b9c7e4",
        "inverse-primary": "#a04100"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "gutter": "24px",
        "margin-desktop": "40px",
        "margin-mobile": "16px",
        "unit": "8px",
        "container-max": "1280px"
      },
      fontFamily: {
        inter: ['Inter Tight', 'sans-serif'],
        "headline-lg": ["Hanken Grotesk", "sans-serif"],
        "display-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-lg-mobile": ["Hanken Grotesk", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"],
        "headline-md": ["Hanken Grotesk", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["40px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "display-lg": ["64px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "headline-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "1.0", "letterSpacing": "0.05em", "fontWeight": "500" }],
        "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }]
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
