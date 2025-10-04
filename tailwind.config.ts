import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette from strategy doc
        background: {
          primary: '#1a1a1a',    // Dark charcoal
          secondary: '#2a2a2a',   // Lighter gray
          navy: '#0f1419',        // Deep navy alternative
        },
        text: {
          primary: '#e8e8e8',     // Off-white
          secondary: '#a0a0a0',   // Muted gray
        },
        accent: {
          blue: '#4a9eff',        // Subtle blue
          teal: '#3dd6d0',        // Teal alternative
          gold: '#d4a574',        // Muted gold/amber for CTAs
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'scroll': 'scroll 2s ease-in-out infinite',
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
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
          },
          '50%': {
            transform: 'translateY(-20px) translateX(10px)',
          },
        },
        'scroll': {
          '0%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(16px)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
