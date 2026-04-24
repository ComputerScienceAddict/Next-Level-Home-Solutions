import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-50% - 0.5rem))' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(calc(-50% - 0.5rem))' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration, 20s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration, 20s) linear infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.7s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      colors: {
        black: '#111',
        offwhite: '#faf9f7',
        warmgray: '#5c5a57',
        gold: {
          DEFAULT: '#8b7355',
          50: '#faf8f5',
          100: '#f0e9dc',
          200: '#dfc08a',
          300: '#c9a86c',
          400: '#8b7355',
          500: '#6d5a45',
          600: '#564836',
          700: '#3f3427',
        },
        navy: {
          DEFAULT: '#1e2d3d',
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#b0c4d9',
          300: '#7a99b8',
          400: '#4f6d8a',
          500: '#2a3d52',
          600: '#1e2d3d',
          700: '#15202b',
          800: '#0d1419',
          900: '#050a0d',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 24px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.04)',
        'premium-lg': '0 10px 40px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.04)',
        'premium-xl': '0 20px 60px rgba(0, 0, 0, 0.16), 0 0 1px rgba(0, 0, 0, 0.04)',
        'inner-premium': 'inset 0 2px 8px rgba(0, 0, 0, 0.06)',
        'glow-gold': '0 0 20px rgba(201, 168, 108, 0.3), 0 0 40px rgba(201, 168, 108, 0.15)',
        'glow-gold-lg': '0 0 30px rgba(201, 168, 108, 0.4), 0 0 60px rgba(201, 168, 108, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, #1e2d3d 0%, #2a3d52 100%)',
        'gradient-gold': 'linear-gradient(135deg, #c9a86c 0%, #dfc08a 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
