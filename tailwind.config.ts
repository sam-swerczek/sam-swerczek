import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Skill indicator and value card colors - prevents JIT from missing dynamic classes
    'text-accent-blue',
    'text-accent-teal',
    'text-accent-gold',
    'bg-accent-blue/10',
    'bg-accent-teal/10',
    'bg-accent-gold/10',
    'border-accent-blue/20',
    'border-accent-teal/20',
    'border-accent-gold/20',
    'border-accent-blue/30',
    'border-accent-teal/30',
    'border-accent-gold/30',
    'border-accent-blue/40',
    'border-accent-teal/40',
    'border-accent-gold/40',
    'border-accent-blue/60',
    'border-accent-teal/60',
    'hover:border-accent-blue/40',
    'hover:border-accent-teal/40',
    'hover:border-accent-gold/40',
    'hover:shadow-accent-blue/5',
    'hover:shadow-accent-teal/5',
    'hover:shadow-accent-gold/5',
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
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'scroll': 'scroll 2s ease-in-out infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'slide-in-from-right': 'slide-in-from-right 300ms ease-out',
        'slide-in-from-top-2': 'slide-in-from-top-2 300ms ease-out',
        'theater-reveal': 'theater-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'discover': 'discover-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'subtle-pulse': 'subtle-pulse 4s ease-in-out infinite',
        'ping-slow': 'ping-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-flash': 'subtle-flash 1.5s ease-out',
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
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'slide-in-from-right': {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        'slide-in-from-top-2': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'theater-reveal': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.98)',
            filter: 'blur(8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0)',
          },
        },
        'subtle-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
        },
        'ping-slow': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.5',
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '0.2',
          },
        },
        'subtle-flash': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 0 rgba(74, 158, 255, 0)',
          },
          '50%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(74, 158, 255, 0.4), 0 0 40px rgba(74, 158, 255, 0.2)',
          },
        },
        'discover-fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px) scale(0.98)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
