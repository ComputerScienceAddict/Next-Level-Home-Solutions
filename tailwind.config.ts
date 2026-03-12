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
      },
      animation: {
        marquee: 'marquee var(--duration, 20s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration, 20s) linear infinite',
      },
      colors: {
        black: '#111',
        offwhite: '#faf9f7',
        warmgray: '#5c5a57',
        gold: '#8b7355',
        navy: '#1e2d3d',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
