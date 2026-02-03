/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#667eea",
        secondary: "#764ba2",
        background: "var(--color-bg)", // Use CSS var
        foreground: "var(--color-text)", // Use CSS var
      },
      fontFamily: {
        sans: ["VT323", "monospace"],
        mono: ["VT323", "monospace"],
        pixel: ["'Press Start 2P'", "cursive"],
      },
      fontSize: {
        // Redefine base sizes to match the new scale
        // Nothing < 14px (approx 0.875rem)
        xs: ['var(--font-small)', { lineHeight: '1.5' }],     // ~14px-16px
        sm: ['var(--font-label)', { lineHeight: '1.5' }],     // ~15px-17px
        base: ['var(--font-body)', { lineHeight: 'var(--lh-body)' }], // ~16px-18px
        lg: ['var(--font-h3)', { lineHeight: 'var(--lh-heading)' }],
        xl: ['var(--font-h2)', { lineHeight: 'var(--lh-heading)' }],
        '2xl': ['var(--font-h1)', { lineHeight: 'var(--lh-heading)' }],
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [],
};
