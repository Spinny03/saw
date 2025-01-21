import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'wave-blue': '#60A5FA', // Adding wave color
      },
      keyframes: {
        glow: {
          '0%': {
            textShadow:
              '0 0 5px rgba(173, 216, 230, 0.7), 0 0 10px rgba(173, 216, 230, 0.5), 0 0 15px rgba(173, 216, 230, 0.3)', // Light blue shadow
          },
          '50%': {
            textShadow:
              '0 0 20px rgba(173, 216, 230, 0.9), 0 0 30px rgba(173, 216, 230, 0.7), 0 0 40px rgba(173, 216, 230, 0.5)', // Light blue shadow
          },
          '100%': {
            textShadow:
              '0 0 5px rgba(173, 216, 230, 0.7), 0 0 10px rgba(173, 216, 230, 0.5), 0 0 15px rgba(173, 216, 230, 0.3)', // Light blue shadow
          },
        },
        wave: {
          '0%': {
            textShadow:
              '0 0 4px rgba(96, 165, 250, 0.7), 0 0 10px rgba(96, 165, 250, 0.5)',
          },
          '50%': {
            textShadow:
              '0 0 12px rgba(96, 165, 250, 1), 0 0 18px rgba(96, 165, 250, 0.7)',
          },
          '100%': {
            textShadow:
              '0 0 4px rgba(96, 165, 250, 0.7), 0 0 10px rgba(96, 165, 250, 0.5)',
          },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        glow: 'glow 1.5s ease-in-out infinite',
        wave: 'wave 2s ease-in-out infinite', // Adding the wave animation
        spin: 'spin 1s linear infinite', // Adding the spin animation
      },
    },
  },
  plugins: [],
} satisfies Config;
